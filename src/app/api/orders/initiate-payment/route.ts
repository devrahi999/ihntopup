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

    // Prepare RupantorPay request - NO ORDER CREATION BEFORE PAYMENT
    const apiKey = process.env.RUPANTORPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Generate a temporary session ID to track this payment attempt
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const rupantorBody = {
      fullname: fullname || user.name || 'User',
      email: email || user.email,
      amount: amount.toString(),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/cancel`,
      webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
      metadata: {
        type: 'topup',
        user_id: userId,
        pack_id: packId,
        player_uid: playerUid,
        amount: amount,
        diamonds: diamonds || 0,
        item_name: itemName,
        card_id: cardId,
        card_name: cardName,
        quantity: quantity || 1,
        session_id: sessionId,
        phone: phone || '',
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
      console.log('✅ Payment initiated successfully, no order created yet');
      
      return NextResponse.json({ 
        success: true,
        payment_url: rupantorData.payment_url,
        session_id: sessionId,
        message: 'Payment initiated successfully'
      });
    } else {
      console.error('RupantorPay error:', rupantorData);
      return NextResponse.json({ 
        success: false,
        error: rupantorData.message || 'Failed to initiate payment'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
