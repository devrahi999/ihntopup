import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET all support tickets for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Fetch support tickets for the user
    const { data: supportTickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
      return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 });
    }

    return NextResponse.json({ supportTickets });
  } catch (error) {
    console.error('Support tickets fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new support ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, message, priority } = body;

    if (!userId || !subject || !message) {
      return NextResponse.json({ error: 'User ID, subject, and message are required' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Create new support ticket
    const { data: supportTicket, error } = await supabase
      .from('support_tickets')
      .insert([{
        user_id: userId,
        subject,
        message,
        priority: priority || 'medium',
        status: 'open'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
    }

    return NextResponse.json({ supportTicket }, { status: 201 });
  } catch (error) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
