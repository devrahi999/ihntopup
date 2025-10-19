'use client';

import { useState, useEffect } from 'react';
import { FaUserCircle, FaWallet, FaShoppingBag, FaChartLine, FaSignOutAlt, FaEdit, FaSave, FaTrophy, FaSignInAlt, FaLock, FaHeadset } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePopup } from '@/contexts/PopupContext';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateProfile, refreshUser } = useAuth();
  const { showPopup } = usePopup();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  // Fetch user stats
  useEffect(() => {
    if (user) {
      fetchStats();
      setFormData({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const supabase = createClient();
    
    try {
      // Fetch completed orders to calculate total spent
      const { data: orders, error } = await supabase
        .from('orders')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      let totalSpent = 0;
      let totalOrders = 0;

      if (orders && orders.length > 0) {
        totalOrders = orders.length;
        totalSpent = orders.reduce((sum, order) => {
          const amount = Number(order.amount) || 0;
          return sum + amount;
        }, 0);
      }

      console.log('Profile stats calculated:', { totalOrders, totalSpent, orders });
      setStats({ totalOrders, totalSpent });
    } catch (error) {
      console.error('Error in fetchStats:', error);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      name: formData.name,
      phone: formData.phone,
    });
    setLoading(false);

    if (error) {
      alert('Failed to update profile: ' + error.message);
    } else {
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessPopup(true);
    }
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    showPopup('info', 'Logging Out', 'You have been logged out successfully.');
    setTimeout(async () => {
      await signOut();
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleResetPassword = () => {
    router.push('/reset-password');
  };


  const userLevel = stats.totalSpent >= 5000 ? 'Diamond' : 
                    stats.totalSpent >= 2000 ? 'Gold' : 
                    stats.totalSpent >= 500 ? 'Silver' : 'Bronze';

  const levelColor = userLevel === 'Diamond' ? 'from-blue-400 to-purple-600' :
                     userLevel === 'Gold' ? 'from-yellow-400 to-orange-500' :
                     userLevel === 'Silver' ? 'from-gray-300 to-gray-500' : 'from-orange-400 to-orange-600';

  // Early return if user is null (should not happen due to previous checks, but TypeScript needs this)
  if (!user) {
    return null;
  }

  // Auto-hide success popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  return (
    <div className="page-container">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <div className="font-semibold">Success!</div>
                <div className="text-sm">{successMessage}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Profile 👤</h1>

        {/* Profile Banner Card */}
        <div className={`card gradient-primary p-6 sm:p-8 mb-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <FaUserCircle className="text-5xl sm:text-6xl text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">{user.name}</h2>
                <p className="text-sm sm:text-base opacity-90">{user.email}</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${levelColor} text-white font-bold text-xs sm:text-sm mt-2`}>
                  <FaTrophy className="text-xs sm:text-sm" />
                  <span>{userLevel} Member</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <FaSave /> Cancel
                </>
              ) : (
                <>
                  <FaEdit /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="card p-4 sm:p-6 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-2">
              <FaWallet className="text-primary text-2xl sm:text-3xl" />
              <div className="text-xs sm:text-sm text-gray-600">Wallet</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">৳{user.walletBalance}</div>
          </div>

          <div className="card p-4 sm:p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <FaShoppingBag className="text-purple-600 text-2xl sm:text-3xl" />
              <div className="text-xs sm:text-sm text-gray-600">Orders</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card p-6 sm:p-8 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={isEditing ? formData.name : user.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled={true}
                className="input-field disabled:bg-gray-100 disabled:text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={isEditing ? formData.phone : user.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {isEditing && (
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>


          {/* Support Section */}
          <Link href="/support" className="block">
            <div className="card p-4 w-full text-left hover:shadow-xl transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaHeadset className="text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Support</div>
                  <div className="text-xs text-gray-500">Get help from our team</div>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6 sm:p-8 animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSignOutAlt className="text-red-500 text-2xl" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
                <p className="text-gray-600">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
