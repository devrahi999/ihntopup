import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { transactionId, userId, status } = body;

  if (!transactionId || !userId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    console.log(`🔄 Direct cancellation for transaction ${transactionId}, user ${userId}, status ${status}`);
    
    // Use direct fetch to Supabase REST API to avoid module loading issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // First, find orders by transaction ID
    const findResponse = await fetch(`${supabaseUrl}/rest/v1/orders?rupantorpay_transaction_id=eq.${transactionId}&user_id=eq.${userId}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    let orders = [];
    if (findResponse.ok) {
      const data = await findResponse.json();
      orders = data || [];
    }

    // Also find pending orders for this user
    const pendingResponse = await fetch(`${supabaseUrl}/rest/v1/orders?user_id=eq.${userId}&status=eq.pending&select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (pendingResponse.ok) {
      const pendingData = await pendingResponse.json();
      // Combine and deduplicate
      const allOrders = [...orders, ...(pendingData || [])];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );
      orders = uniqueOrders;
    }

    console.log(`📦 Found ${orders.length} orders to cancel`);

    let cancelledCount = 0;
    let failedCount = 0;

    // Cancel all orders using direct REST API
    for (const order of orders) {
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
          cancellation_reason: `Payment ${status || 'failed'} - Transaction: ${transactionId}`
        }),
      });

      if (updateResponse.ok) {
        console.log(`✅ Successfully cancelled order ${order.id}`);
        cancelledCount++;
      } else {
        console.error(`❌ Failed to cancel order ${order.id}:`, updateResponse.status);
        failedCount++;
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
    console.error('❌ Direct cancellation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
