import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { transactionId, userId, status } = body;

  if (!transactionId || !userId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    console.log(`🔄 Server-side: Cancelling orders for transaction ${transactionId}, user ${userId}`);
    
    // First, find orders by transaction ID
    const { data: ordersByTransaction, error: txError } = await supabase
      .from('orders')
      .select('*')
      .eq('rupantorpay_transaction_id', transactionId)
      .eq('user_id', userId);

    if (txError) {
      console.error('Error finding orders by transaction:', txError);
    }

    // Also find all pending orders for this user (fallback)
    const { data: pendingOrders, error: pendingError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (pendingError) {
      console.error('Error finding pending orders:', pendingError);
      return NextResponse.json({ error: 'Failed to find orders' }, { status: 500 });
    }

    // Combine and deduplicate orders
    const allOrders = [...(ordersByTransaction || []), ...(pendingOrders || [])];
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    );

    console.log(`📦 Found ${uniqueOrders.length} unique orders to process`);

    let cancelledCount = 0;
    let failedCount = 0;

    // Cancel all orders - update regardless of current status
    for (const order of uniqueOrders) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          cancellation_reason: `Payment ${status || 'failed'} - Transaction: ${transactionId}`
        })
        .eq('id', order.id);

      if (updateError) {
        console.error(`❌ Failed to cancel order ${order.id}:`, updateError);
        console.error('Update error details:', JSON.stringify(updateError));
        failedCount++;
      } else {
        console.log(`✅ Successfully cancelled order ${order.id} (previous status: ${order.status})`);
        cancelledCount++;
      }
    }

    console.log(`🏁 Cancellation summary: ${cancelledCount} cancelled, ${failedCount} failed`);

    return NextResponse.json({ 
      success: true,
      cancelledCount,
      failedCount,
      message: `Successfully cancelled ${cancelledCount} orders`
    });

  } catch (error) {
    console.error('❌ Server-side cancellation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
