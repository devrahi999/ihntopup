import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get all orders with user information
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    console.log('🔄 Starting order update:', { id, status });
    
    if (!id || !status) {
      console.error('❌ Missing required fields:', { id, status });
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const supabase = createClient();

    // Check if order exists first
    console.log('🔍 Checking if order exists...');
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Order not found:', checkError);
      return NextResponse.json({ error: `Order not found: ${checkError.message}` }, { status: 404 });
    }

    console.log('📋 Current order status:', existingOrder.status);

    // Update order status - try with select first
    console.log('💾 Updating order status in database...');
    const { data: updateResult, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, status, updated_at');

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      return NextResponse.json({ error: `Failed to update order: ${updateError.message}` }, { status: 500 });
    }

    console.log('✅ Update result:', updateResult);

    if (!updateResult || updateResult.length === 0) {
      console.log('⚠️ No rows returned from update with select, trying update without select...');
      
      // Try update without select to bypass any RLS issues
      const { error: simpleUpdateError } = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (simpleUpdateError) {
        console.error('❌ Simple update error:', simpleUpdateError);
        return NextResponse.json({ error: `Simple update failed: ${simpleUpdateError.message}` }, { status: 500 });
      }

      console.log('✅ Simple update completed, verifying...');
    }

    // Verify the update by fetching the order again
    console.log('🔍 Verifying update...');
    const { data: verifiedOrder, error: verifyError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
      return NextResponse.json({ error: `Update successful but verification failed: ${verifyError.message}` }, { status: 500 });
    }

    console.log('✅ Order updated successfully:', {
      id: verifiedOrder.id,
      oldStatus: existingOrder.status,
      newStatus: verifiedOrder.status,
      updatedAt: verifiedOrder.updated_at
    });

    return NextResponse.json({ 
      success: true,
      order: verifiedOrder,
      message: `Order status updated from ${existingOrder.status} to ${verifiedOrder.status}`
    });
  } catch (error) {
    console.error('❌ Unexpected error in orders update API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
