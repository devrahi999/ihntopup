/**
 * Transaction Validation Utility
 * Prevents transaction ID reuse and ensures one-time use only
 */

import { createClient } from '@/lib/supabase/client';

// Track used transaction IDs in memory (for current session)
const usedTransactionIds = new Set<string>();

/**
 * Check if a transaction ID has already been used
 * This prevents replay attacks and duplicate processing
 */
export async function isTransactionUsed(transactionId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Check in-memory cache first (current session)
    if (usedTransactionIds.has(transactionId)) {
      console.log(`🚫 Transaction ${transactionId} already used in this session`);
      return true;
    }

    // Check database for completed transactions with this ID
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('rupantorpay_transaction_id', transactionId)
      .in('status', ['completed', 'cancelled', 'failed']);

    if (orderError) {
      console.error('Error checking orders:', orderError);
      return false; // Assume not used if we can't check
    }

    // Check wallet transactions
    const { data: transactions, error: txnError } = await supabase
      .from('transactions')
      .select('id, status')
      .eq('rupantorpay_transaction_id', transactionId)
      .eq('status', 'completed');

    if (txnError) {
      console.error('Error checking transactions:', txnError);
      return false;
    }

    const isUsed = (orders && orders.length > 0) || (transactions && transactions.length > 0);
    
    if (isUsed) {
      console.log(`🚫 Transaction ${transactionId} already processed in database`);
      usedTransactionIds.add(transactionId); // Cache for session
    }

    return isUsed;

  } catch (error) {
    console.error('Error in isTransactionUsed:', error);
    return false;
  }
}

/**
 * Mark a transaction as used (prevents reuse)
 */
export function markTransactionUsed(transactionId: string): void {
  usedTransactionIds.add(transactionId);
  console.log(`✅ Transaction ${transactionId} marked as used`);
}

/**
 * Validate payment status and prevent unauthorized access
 */
export async function validatePaymentRedirect(
  transactionId: string, 
  status: string | null, 
  userId: string
): Promise<{ isValid: boolean; message: string }> {
  
  if (!transactionId) {
    return { isValid: false, message: 'Missing transaction ID' };
  }

  if (!status) {
    return { isValid: false, message: 'Missing payment status' };
  }

  // Check if transaction already used
  const isUsed = await isTransactionUsed(transactionId);
  if (isUsed) {
    return { isValid: false, message: 'This payment has already been processed' };
  }

  // Validate status
  const validStatuses = ['completed', 'failed', 'cancelled'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return { isValid: false, message: 'Invalid payment status' };
  }

  // Check if transaction belongs to user (for security)
  const supabase = createClient();
  const { data: orders, error } = await supabase
    .from('orders')
    .select('user_id')
    .eq('rupantorpay_transaction_id', transactionId)
    .limit(1);

  if (error) {
    console.error('Error validating transaction ownership:', error);
    // Continue anyway, but log the error
  } else if (orders && orders.length > 0 && orders[0].user_id !== userId) {
    return { isValid: false, message: 'Transaction does not belong to this user' };
  }

  return { isValid: true, message: 'Valid payment redirect' };
}

/**
 * Process payment result based on status
 */
export async function processPaymentResult(
  transactionId: string,
  status: string,
  userId: string,
  amount?: string,
  paymentMethod?: string
): Promise<{ success: boolean; message: string }> {
  
  const validation = await validatePaymentRedirect(transactionId, status, userId);
  if (!validation.isValid) {
    return { success: false, message: validation.message };
  }

  const supabase = createClient();

  try {
    if (status === 'completed') {
      // Mark transaction as used immediately to prevent replay
      markTransactionUsed(transactionId);
      
      // For completed payments, we rely on the webhook for processing
      // This just validates the redirect
      return { 
        success: true, 
        message: 'Payment completed successfully' 
      };
      
    } else if (status === 'failed' || status === 'cancelled') {
      console.log(`❌ Payment ${status}, cancelling all pending orders for user ${userId}`);
      
      // More aggressive approach: cancel ALL pending orders for this user
      // This ensures no orders remain pending after a failed payment
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error finding orders to cancel:', error);
      } else if (orders && orders.length > 0) {
        console.log(`📦 Found ${orders.length} pending orders to cancel`);
        
        for (const order of orders) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString(),
              cancellation_reason: `Payment ${status} - Transaction: ${transactionId}`
            })
            .eq('id', order.id);

          if (updateError) {
            console.error(`❌ Error cancelling order ${order.id}:`, updateError);
          } else {
            console.log(`✅ Order ${order.id} marked as cancelled due to ${status} payment`);
          }
        }
      } else {
        console.log('ℹ️ No pending orders found to cancel');
      }

      markTransactionUsed(transactionId);
      return { 
        success: true, 
        message: `Payment ${status}. No charges were made. All pending orders have been cancelled.` 
      };
    }

    return { success: false, message: 'Unknown payment status' };

  } catch (error) {
    console.error('Error processing payment result:', error);
    return { success: false, message: 'Error processing payment' };
  }
}
