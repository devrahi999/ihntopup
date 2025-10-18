import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.transaction_id && !body.trx_id) {
    return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
  }

  try {
    // Extract transaction ID
    const transactionId = body.transaction_id || body.trx_id;

    console.log('Webhook received for transaction:', transactionId, 'Data:', body);

    // Call the verify endpoint to process (handles idempotency)
    const processResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rupantorpayTransactionId: transactionId }),
    });

    const processData = await processResponse.json();

    if (processResponse.ok) {
      console.log('Webhook processed successfully:', processData);
    } else {
      console.error('Webhook processing failed:', processData);
    }

    // Always acknowledge to RupantorPay to avoid retries
    return NextResponse.json({ status: 'received and processed' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    // Still acknowledge
    return NextResponse.json({ status: 'received with error' }, { status: 200 });
  }
}
