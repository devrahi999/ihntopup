import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { rupantorpayTransactionId, paymentMethod } = body;

  if (!rupantorpayTransactionId) {
    return NextResponse.json({ error: 'rupantorpayTransactionId is required' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const apiKey = process.env.RUPANTORPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const verifyBody = { transaction_id: rupantorpayTransactionId };

    const verifyHeaders = {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    };

    const verifyResponse = await fetch('https://payment.rupantorpay.com/api/payment/verify-payment', {
      method: 'POST',
      headers: verifyHeaders,
      body: JSON.stringify(verifyBody),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || verifyData.status !== 'COMPLETED') {
      console.error('Payment verification failed:', verifyData);
      return NextResponse.json({ 
        success: false, 
        status: verifyData.status || 'ERROR',
        message: verifyData.message || 'Payment not completed'
      });
    }

    // Payment successful, process based on metadata
    const metadata = verifyData.metadata || {};
    const localId = metadata.local_txn_id || metadata.order_id;
    const paymentType = metadata.type || '';
    const amount = parseFloat(verifyData.amount) || 0;

    if (!localId || !paymentType) {
      return NextResponse.json({ error: 'Invalid metadata in payment response' }, { status: 400 });
    }

    let updateSuccess = false;

    if (paymentType === 'wallet_add') {
      // First, query current status to check if pending
      const { data: currentTxn, error: queryError } = await supabase
        .from('transactions')
        .select('status, amount, user_id')
        .eq('id', localId)
        .single();

      if (queryError || !currentTxn) {
        console.error('Transaction not found:', queryError);
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      }

      if (currentTxn.status === 'completed') {
        // Already processed
        updateSuccess = true;
      } else {
        // Update transaction status
        const { error: txnUpdateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'completed', 
            description: `Wallet recharge completed via RupantorPay (${verifyData.payment_method})`,
            rupantorpay_trx_id: verifyData.trx_id 
          })
          .eq('id', localId);

        if (txnUpdateError) {
          console.error('Error updating wallet transaction:', txnUpdateError);
          return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
        }

        // Credit balance only if was pending
        const creditAmount = currentTxn.amount;
        const userId = currentTxn.user_id;

        // Query current balance to add
        const { data: userBalance, error: balanceQueryError } = await supabase
          .from('users')
          .select('wallet_balance')
          .eq('id', userId)
          .single();

        if (balanceQueryError) {
          console.error('Error querying user balance:', balanceQueryError);
        } else {
          const newBalance = (parseFloat(userBalance.wallet_balance) || 0) + creditAmount;

          const { error: balanceUpdateError } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', userId);

          if (balanceUpdateError) {
            console.error('Error updating wallet balance:', balanceUpdateError);
          } else {
            updateSuccess = true;
          }
        }
      }

    } else if (paymentType === 'topup') {
      // Similar idempotency for orders
      const { data: currentOrder, error: queryError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', localId)
        .single();

      if (queryError || !currentOrder) {
        console.error('Order not found:', queryError);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (currentOrder.status === 'completed') {
        updateSuccess = true;
      } else {
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            status: 'completed', 
            payment_method: paymentMethod || verifyData.payment_method || 'instant',
            rupantorpay_trx_id: verifyData.trx_id,
            amount: amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', localId);

        if (orderError) {
          console.error('Error updating order:', orderError);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        updateSuccess = true;
        // For topup, could credit wallet if needed, but per flow, mark completed for admin fulfillment
      }
    } else {
      return NextResponse.json({ error: 'Unknown payment type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      status: 'COMPLETED',
      details: verifyData,
      message: 'Payment verified and processed successfully'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
