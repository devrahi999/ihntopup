import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// GET wallet balance and transactions
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // Fetch user balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const balance = parseFloat(userData.wallet_balance) || 0;

    // Fetch transactions
    const { data: transactionsData, error: txnError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (txnError) {
      console.error('Error fetching transactions:', txnError);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    const walletData = {
      balance,
      transactions: transactionsData || [],
    };

    return NextResponse.json(walletData);
  } catch (error) {
    console.error('Wallet GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST initiate add money to wallet (RupantorPay)
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const { userId, amount, fullname, email, phone } = body;

  if (!userId || !amount || !fullname || !email) {
    return NextResponse.json({ error: 'Missing required fields: userId, amount, fullname, email' }, { status: 400 });
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // Get user details for validation and email/fullname
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create pending transaction
    const pendingTransaction = {
      user_id: userId,
      type: 'credit',
      amount: parseFloat(amount),
      description: 'Wallet recharge - pending',
      method: 'rupantorpay',
      status: 'pending',
      rupantorpay_transaction_id: null,
      created_at: new Date().toISOString(),
    };

    const { data: newTransaction, error: insertError } = await supabase
      .from('transactions')
      .insert([pendingTransaction])
      .select()
      .single();

    if (insertError || !newTransaction) {
      console.error('Error creating pending transaction:', insertError);
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }

    const localTxnId = newTransaction.id;

    // Prepare RupantorPay request
    const apiKey = process.env.RUPANTORPAY_API_KEY;
    if (!apiKey) {
      // Clean up
      await supabase.from('transactions').delete().eq('id', localTxnId);
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const rupantorBody = {
      fullname: fullname || user.name,
      email: email || user.email,
      amount: amount.toString(),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wallet/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/wallet/cancel`,
      webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/webhook`,
      metadata: {
        type: 'wallet_add',
        local_txn_id: localTxnId,
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

    if (rupantorResponse.ok && rupantorData.status) {
      // Extract ID from payment_url for storage
      const paymentUrlId = rupantorData.payment_url.split('/').pop();
      const updateRes = await supabase
        .from('transactions')
        .update({ rupantorpay_transaction_id: paymentUrlId })
        .eq('id', localTxnId);

      if (updateRes.error) {
        console.error('Error updating transaction with payment ID:', updateRes.error);
      }

      return NextResponse.json({ 
        success: true,
        payment_url: rupantorData.payment_url,
        message: 'Payment initiated successfully'
      });
    } else {
      // Clean up pending transaction
      await supabase.from('transactions').delete().eq('id', localTxnId);
      
      console.error('RupantorPay error:', rupantorData);
      return NextResponse.json({ 
        success: false,
        error: rupantorData.message || 'Failed to initiate payment'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Wallet payment initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
