import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET specific topup card by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const cardId = params.cardId;
    const supabase = createClient();
    
    // Fetch specific topup card with diamond packs
    const { data: topupCard, error: cardError } = await supabase
      .from('topup_cards')
      .select('*')
      .eq('id', cardId)
      .single();

    if (cardError) {
      console.error('Error fetching topup card:', cardError);
      return NextResponse.json({ error: 'Topup card not found' }, { status: 404 });
    }

    // Fetch diamond packs for this topup card
    const { data: diamondPacks, error: packsError } = await supabase
      .from('diamond_packs')
      .select('*')
      .eq('topup_card_id', cardId)
      .eq('status', 'active')
      .order('price', { ascending: true });

    if (packsError) {
      console.error('Error fetching diamond packs:', packsError);
      return NextResponse.json({ error: 'Failed to fetch diamond packs' }, { status: 500 });
    }

    return NextResponse.json({ 
      topupCard,
      diamondPacks: diamondPacks || []
    });
  } catch (error) {
    console.error('Topup card fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
