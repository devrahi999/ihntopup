import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Get all topup cards with their packs
    const { data: topupCards, error } = await supabase
      .from('topup_cards')
      .select(`
        *,
        card_packs (*)
      `)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching topup cards:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ topupCards });
  } catch (error) {
    console.error('Error in topup-cards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('topup_cards')
      .insert([body])
      .select();

    if (error) {
      console.error('Error creating topup card:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ topupCard: data[0] });
  } catch (error) {
    console.error('Error in topup-cards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id, ...updates } = body;
    
    const { data, error } = await supabase
      .from('topup_cards')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating topup card:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ topupCard: data[0] });
  } catch (error) {
    console.error('Error in topup-cards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Topup card ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('topup_cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting topup card:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in topup-cards API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
