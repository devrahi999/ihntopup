'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentUsers: any[];
  recentOrders: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaShoppingCart className="text-green-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">৳{stats.totalRevenue}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaMoneyBillWave className="text-purple-500 text-xl" />
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaExclamationTriangle className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
              <FaUsers className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats?.recentUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                <p className="text-center text-gray-500 py-4">No recent users</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <FaShoppingCart className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {stats?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">৳{order.amount}</p>
                    <p className={`text-sm ${
                      order.status === 'completed' ? 'text-green-600' : 
                      order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <p className="text-center text-gray-500 py-4">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <FaUsers className="text-blue-500 mb-2" />
              <p className="font-medium text-gray-800">Manage Users</p>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <FaShoppingCart className="text-green-500 mb-2" />
              <p className="font-medium text-gray-800">View Orders</p>
              <p className="text-sm text-gray-600">Check all orders</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/diamonds'}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
            >
              <FaChartLine className="text-purple-500 mb-2" />
              <p className="font-medium text-gray-800">Diamond Packs</p>
              <p className="text-sm text-gray-600">Manage diamond packs</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
