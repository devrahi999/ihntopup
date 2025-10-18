import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const { userId, amount, fullname, email, phone, packId, playerUid, diamonds, itemName, quantity, cardId, cardName } = body;

  if (!userId || !amount || !fullname || !email || !packId || !playerUid || !itemName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // Validate user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update pending order - let Supabase generate the UUID
    const pendingOrder = {
      user_id: userId,
      pack_id: packId,
      player_uid: playerUid,
      amount: parseFloat(amount),
      diamonds: diamonds ? parseInt(diamonds) : 0,
      status: 'pending',
      payment_method: 'rupantorpay',
      item_name: itemName,
      card_id: cardId,
      card_name: cardName,
      quantity: quantity || 1,
      created_at: new Date().toISOString(),
      rupantorpay_transaction_id: null,
    };

    const { data: newOrder, error: insertError } = await supabase
      .from('orders')
      .insert([pendingOrder])
      .select()
      .single();

    if (insertError || !newOrder) {
      console.error('Error creating pending order:', insertError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const localOrderId = newOrder.id;

    // Prepare RupantorPay request
    const apiKey = process.env.RUPANTORPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const rupantorBody = {
      fullname: fullname || user.name || 'User',
      email: email || user.email,
      amount: amount.toString(),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/cancel`,
      webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
      metadata: {
        type: 'topup',
        order_id: localOrderId,
        phone: phone || '',
        player_uid: playerUid,
      },
    };

    const rupantorHeaders = {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      'X-CLIENT': process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '').replace('http://', '') || 'localhost',
    };

    const rupantorResponse = await fetch('https://payment.rupantorpay.com/api/payment/checkout', {
      method: 'POST',
      headers: rupantorHeaders,
      body: JSON.stringify(rupantorBody),
    });

    const rupantorData = await rupantorResponse.json();

    if (rupantorResponse.ok && (rupantorData.status === 1 || rupantorData.status === true)) {
      // Update order with rupantorpay id (extract from payment_url)
      const paymentUrlId = rupantorData.payment_url.split('/').pop();
      const updateRes = await supabase
        .from('orders')
        .update({ rupantorpay_transaction_id: paymentUrlId })
        .eq('id', localOrderId);

      if (updateRes.error) {
        console.error('Error updating order with payment ID:', updateRes.error);
      }

      return NextResponse.json({ 
        success: true,
        payment_url: rupantorData.payment_url,
        order_id: localOrderId,
        message: 'Order and payment initiated successfully'
      });
    } else {
      // Clean up pending order
      await supabase.from('orders').delete().eq('id', localOrderId);
      
      console.error('RupantorPay error:', rupantorData);
      return NextResponse.json({ 
        success: false,
        error: rupantorData.message || 'Failed to initiate payment'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Order payment initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
