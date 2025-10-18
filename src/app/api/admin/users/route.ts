import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (userError) {
    console.error('Error fetching users:', userError);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  // Since we already have email in public.users table (from auth trigger), use that directly
  const emailMap = new Map(users.map((u: any) => [u.id, u.email || 'N/A']));

  let orders: any[] = [];
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*');

  if (orderError) {
    console.error('Error fetching orders:', orderError);
  } else {
    orders = orderData || [];
  }

  const stats: Record<string, { count: number; spent: number }> = {};
  orders.forEach((o: any) => {
    const uid = o.user_id;
    if (o.status === 'completed') {
      if (!stats[uid]) stats[uid] = { count: 0, spent: 0 };
      stats[uid].count += 1;
      stats[uid].spent += parseFloat(o.amount || 0);
    }
  });

  const usersWithData = users.map((user: any) => ({
    ...user,
    email: emailMap.get(user.id) || 'N/A',
    orderCount: stats[user.id]?.count || 0,
    totalSpent: stats[user.id]?.spent || 0,
    status: 'active'
  }));

  return NextResponse.json(usersWithData);
}
