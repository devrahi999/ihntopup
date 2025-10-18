import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all topup cards
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Fetch all topup cards from database
    const { data: topupCards, error } = await supabase
      .from('topup_cards')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching topup cards:', error);
      return NextResponse.json({ error: 'Failed to fetch topup cards' }, { status: 500 });
    }

    return NextResponse.json({ topupCards });
  } catch (error) {
    console.error('Topup cards fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new topup card (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, status, category_id } = body;

    if (!title || !description || !image_url || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Create new topup card
    const { data: topupCard, error } = await supabase
      .from('topup_cards')
      .insert([{
        title,
        description,
        image_url,
        status: status || 'active',
        category_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating topup card:', error);
      return NextResponse.json({ error: 'Failed to create topup card' }, { status: 500 });
    }

    return NextResponse.json({ topupCard }, { status: 201 });
  } catch (error) {
    console.error('Topup card creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
