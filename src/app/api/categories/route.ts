import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Fetch all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Create new category
    const { data: category, error } = await supabase
      .from('categories')
      .insert([{
        name,
        description: description || '',
        icon: icon || '📱',
        status: status || 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
