import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Fetch all active banners
    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .eq('status', 'active')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Banners fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new banner (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, order_index, status, link } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Create new banner
    const { data: banner, error } = await supabase
      .from('banners')
      .insert([{
        title,
        description: description || '',
        image_url,
        order_index: order_index || 0,
        status: status || 'active',
        link: link || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Banner creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
