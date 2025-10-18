'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';
import { FaBox, FaCheckCircle, FaClock, FaTimesCircle, FaFilter, FaSearch, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      loadUserOrders();
    }
  }, [user, loading]);

  const loadUserOrders = async () => {
    if (!user) return;
    
    setOrdersLoading(true);
    try {
      const supabase = createClient();
      
      // Fetch user's orders from database
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database fields to match Order type
      const transformedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        userId: order.user_id,
        cardId: order.card_id,
        packId: order.pack_id,
        playerUid: order.player_uid,
        amount: order.amount,
        diamonds: order.diamonds,
        paymentMethod: order.payment_method,
        status: order.status,
        item: order.item_name,
        createdAt: order.created_at
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders. Check console for details.');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Show login required message if user is not logged in
  if (!loading && !user) {
    return (
      <div className="page-container">
        <div className="w-full max-w-md mx-auto px-4 py-8 text-center">
          <div className="card p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your order history and track your purchases.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FaSignInAlt />
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || ordersLoading) {
    return (
      <div className="page-container">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaBox className="text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.playerUid.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="page-container">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Orders 📦</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="card-gradient p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{stats.all}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="card-gradient p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card-gradient p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card-gradient p-4 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === 'all' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All ({stats.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === 'pending' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === 'completed' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Completed ({stats.completed})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === 'cancelled' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4 opacity-30">
              {searchTerm ? '🔍' : '📦'}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No orders found' : 'No Orders Yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try a different search term' : 'Your order history will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card p-4 sm:p-6 hover:shadow-2xl transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      order.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      order.status === 'pending' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      <div className="text-white text-xl sm:text-2xl">💎</div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">#{order.id}</div>
                      <div className="font-bold text-gray-800 text-base sm:text-lg mb-1">
                        {order.item || `${order.diamonds} Diamonds`}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">
                        UID: {order.playerUid}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto">
                    <div className="text-xl sm:text-2xl font-bold text-primary flex-1 sm:flex-none">
                      ৳{order.amount}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6 sm:p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Order ID</div>
                  <div className="font-bold text-gray-800">#{selectedOrder.id}</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Item</div>
                  <div className="font-bold text-gray-800 text-lg">{selectedOrder.item || `${selectedOrder.diamonds} Diamonds`}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Amount</div>
                    <div className="font-bold text-primary text-lg">৳{selectedOrder.amount}</div>
                  </div>
                  {selectedOrder.diamonds > 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Diamonds</div>
                      <div className="font-bold text-gray-800 text-lg">{selectedOrder.diamonds} 💎</div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Player UID</div>
                  <div className="font-bold text-gray-800">{selectedOrder.playerUid}</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                  <div className="font-bold text-gray-800 capitalize">{selectedOrder.paymentMethod}</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="capitalize">{selectedOrder.status}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Order Date</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'pending' && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaClock className="text-yellow-600 mt-1" />
                    <p className="text-sm text-yellow-800">
                      Your order is being processed. Diamonds will be credited to your account within 5-30 minutes.
                    </p>
                  </div>
                </div>
              )}

              {selectedOrder.status === 'completed' && (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-600 mt-1" />
                    <p className="text-sm text-green-800">
                      Order completed successfully! Diamonds have been credited to your Free Fire account.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
