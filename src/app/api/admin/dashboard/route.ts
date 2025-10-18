import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();
  
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error fetching users count:', usersError);
    }

    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    }

    // Calculate stats from orders
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
    
    // Calculate total revenue from completed orders
    const totalRevenue = orders
      ?.filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.amount || 0), 0) || 0;

    // Get recent users (last 5)
    const { data: recentUsers, error: recentUsersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentUsersError) {
      console.error('Error fetching recent users:', recentUsersError);
    }

    // Get recent orders (last 5)
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      console.error('Error fetching recent orders:', recentOrdersError);
    }

    const dashboardStats = {
      totalUsers: totalUsers || 0,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      recentUsers: recentUsers || [],
      recentOrders: recentOrders || []
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' }, 
      { status: 500 }
    );
  }
}
