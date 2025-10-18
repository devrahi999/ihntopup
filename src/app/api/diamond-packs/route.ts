import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all diamond packs
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Fetch all diamond packs with topup card info
    const { data: diamondPacks, error } = await supabase
      .from('diamond_packs')
      .select(`
        *,
        topup_cards (
          title,
          description,
          image_url
        )
      `)
      .eq('status', 'active')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching diamond packs:', error);
      return NextResponse.json({ error: 'Failed to fetch diamond packs' }, { status: 500 });
    }

    return NextResponse.json({ diamondPacks });
  } catch (error) {
    console.error('Diamond packs fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new diamond pack (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topup_card_id, diamonds, price, bonus, status } = body;

    if (!topup_card_id || !diamonds || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Create new diamond pack
    const { data: diamondPack, error } = await supabase
      .from('diamond_packs')
      .insert([{
        topup_card_id,
        diamonds: parseInt(diamonds),
        price: parseFloat(price),
        bonus: bonus || 0,
        status: status || 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating diamond pack:', error);
      return NextResponse.json({ error: 'Failed to create diamond pack' }, { status: 500 });
    }

    return NextResponse.json({ diamondPack }, { status: 201 });
  } catch (error) {
    console.error('Diamond pack creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
