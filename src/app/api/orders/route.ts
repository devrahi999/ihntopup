import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all orders for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const supabase = createClient();
  
  // Fetch orders from database
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  return NextResponse.json({ orders });
}

// POST create new order
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const { userId, offerId, packId, playerUid, amount, diamonds, paymentMethod } = body;

  if (!userId || !offerId || !packId || !playerUid || !amount || !diamonds || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // Check if user has sufficient balance for wallet payment
    if (paymentMethod === 'wallet') {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user balance:', userError);
        return NextResponse.json({ error: 'Failed to verify wallet balance' }, { status: 500 });
      }

      const currentBalance = parseFloat(user.wallet_balance) || 0;
      const orderAmount = parseFloat(amount);

      if (currentBalance < orderAmount) {
        return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
      }

      // Deduct amount from wallet
      const newBalance = currentBalance - orderAmount;
      const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating wallet balance:', updateError);
        return NextResponse.json({ error: 'Failed to deduct from wallet' }, { status: 500 });
      }

      // Record wallet transaction
      await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          type: 'debit',
          amount: orderAmount,
          description: `Order #IHN${Date.now()} - ${diamonds} diamonds`,
          method: 'wallet',
          status: 'completed'
        }]);
    }

    // Create new order
    const newOrder = {
      id: `IHN${Date.now()}`,
      user_id: userId,
      offer_id: offerId,
      pack_id: packId,
      player_uid: playerUid,
      amount: parseFloat(amount),
      diamonds: parseInt(diamonds),
      payment_method: paymentMethod,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    // Save to database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
