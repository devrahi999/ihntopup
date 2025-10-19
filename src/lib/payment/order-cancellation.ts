/**
 * Order Cancellation Utility
 * Handles marking orders as cancelled when payment is cancelled or fails
 */

import { createClient } from '@/lib/supabase/client';

export async function cancelPendingOrder(transactionId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    console.log('🔄 Attempting to cancel order for transaction:', transactionId, 'user:', userId);
    
    // First, try to find by RupantorPay transaction ID
    let { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('rupantorpay_transaction_id', transactionId)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (orderError) {
      console.error('❌ Error finding order by transaction ID:', orderError);
      return false;
    }

    // If no orders found by transaction ID, try to find the most recent pending order for this user
    if (!orders || orders.length === 0) {
      console.log('🔍 No orders found by transaction ID, searching for recent pending orders...');
      
      const { data: recentOrders, error: recentError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) {
        console.error('❌ Error finding recent pending orders:', recentError);
        return false;
      }

      orders = recentOrders;
    }

    if (!orders || orders.length === 0) {
      console.log('❌ No pending orders found to cancel');
      return false;
    }

    console.log(`📦 Found ${orders.length} pending order(s) to cancel`);

    // Update all found orders to cancelled status
    let successCount = 0;
    for (const order of orders) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          cancellation_reason: 'Payment cancelled by user'
        })
        .eq('id', order.id);

      if (updateError) {
        console.error(`❌ Error cancelling order ${order.id}:`, updateError);
      } else {
        console.log(`✅ Successfully cancelled order ${order.id}`);
        successCount++;
      }
    }

    console.log(`🏁 Cancellation completed: ${successCount}/${orders.length} orders cancelled`);
    return successCount > 0;

  } catch (error) {
    console.error('❌ Unexpected error in cancelPendingOrder:', error);
    return false;
  }
}

/**
 * Cancel order by order ID directly
 */
export async function cancelOrderById(orderId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    console.log('🔄 Attempting to cancel order by ID:', orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        cancellation_reason: 'Payment cancelled'
      })
      .eq('id', orderId);

    if (error) {
      console.error('❌ Error cancelling order by ID:', error);
      return false;
    }

    console.log(`✅ Successfully cancelled order ${orderId}`);
    return true;

  } catch (error) {
    console.error('❌ Unexpected error in cancelOrderById:', error);
    return false;
  }
}

/**
 * Get pending orders for user that might need cancellation
 */
export async function getPendingOrders(userId: string) {
  const supabase = createClient();
  
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending orders:', error);
      return [];
    }

    return orders || [];
  } catch (error) {
    console.error('Unexpected error in getPendingOrders:', error);
    return [];
  }
}
