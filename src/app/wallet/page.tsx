'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPlus, FaArrowUp, FaArrowDown, FaWallet, FaClock, FaCheckCircle, FaSignInAlt } from 'react-icons/fa';
import { Transaction } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { usePopup } from '@/contexts/PopupContext';

export default function WalletPage() {
  const { user, loading, refreshUser } = useAuth();
  const { showPopup } = usePopup();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [walletBalance, setWalletBalance] = useState(0);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasShownSuccessPopup, setHasShownSuccessPopup] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      return; // Show login required message
    }

    if (user) {
      // Always fetch the latest balance from database
      fetchCurrentBalance();
      fetchTransactions();
    }
  }, [user, loading]);

  // Handle success popup after payment
  useEffect(() => {
    const paymentSuccess = searchParams.get('paymentSuccess');
    const amount = searchParams.get('amount');
    const transactionId = searchParams.get('transactionId');

    if (paymentSuccess === 'true' && amount && !hasShownSuccessPopup) {
      setHasShownSuccessPopup(true);
      showPopup('success', 'Payment Successful!', `৳${amount} has been added to your wallet.`);
      
      // Refresh balance to show updated amount
      fetchCurrentBalance();
      
      // Remove query parameters from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('paymentSuccess');
      url.searchParams.delete('amount');
      url.searchParams.delete('transactionId');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, hasShownSuccessPopup, showPopup]);

  const fetchCurrentBalance = async () => {
    if (!user) return;
    
    try {
      const supabase = createClient();
      const { data: userData, error } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching current balance:', error);
        return;
      }

      const currentBalance = parseFloat(userData.wallet_balance) || 0;
      setWalletBalance(currentBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const supabase = createClient();
      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      // Convert database transactions to local format
      const formattedTransactions: Transaction[] = transactionsData.map(t => ({
        id: t.id,
        userId: t.user_id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        method: t.method,
        createdAt: t.created_at
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
              Please log in to access your wallet and manage your balance.
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAddMoney = async () => {
    const addAmount = parseFloat(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      showPopup('error', 'Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!user) {
      showPopup('error', 'Authentication Error', 'Please log in to add money');
      return;
    }

    try {
      const initiateBody = {
        userId: user.id,
        amount: addAmount,
        fullname: (user.name || '').trim() || 'Anonymous User',
        email: (user.email || '').trim() || 'user@ihntopup.com',
        phone: (user.phone || '').trim() || '',
      };

      console.log('Sending to API:', initiateBody); // Debug

      const initiateResponse = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initiateBody),
      });

      const initiateData = await initiateResponse.json();
      console.log('API Response:', initiateData); // Debug

      if (!initiateResponse.ok || !initiateData.success) {
        showPopup('error', 'Payment Initiation Failed', initiateData.error || 'Failed to initiate payment');
        return;
      }

      setShowAddMoneyModal(false);
      setAmount('');
      showPopup('info', 'Payment Started', 'Redirecting to payment gateway...');
      
      // Redirect to payment
      window.location.href = initiateData.payment_url;

    } catch (error) {
      console.error('Error initiating add money:', error);
      showPopup('error', 'Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Calculate stats from all transactions in the database
  const stats = {
    totalAdded: Number(transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)),
    totalSpent: Number(transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)),
  };

  return (
    <div className="page-container">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Wallet 💰</h1>

        {/* Balance Card */}
        <div className="card gradient-primary p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <FaWallet className="text-2xl" />
              <span className="text-sm opacity-90">Available Balance</span>
            </div>
            <div className="text-4xl sm:text-5xl font-bold mb-6">৳ {walletBalance.toFixed(2)}</div>
            
            <button
              onClick={() => setShowAddMoneyModal(true)}
              className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FaPlus /> Add Money
            </button>
          </div>
        </div>


        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6 sm:p-8 animate-fade-in-up max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Add Money 💵</h3>
              
              {/* Quick Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Select</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`card p-3 text-center transition-all ${
                        amount === amt.toString() ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="font-bold text-gray-800">৳{amt}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field text-lg"
                  min="1"
                />
              </div>


              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddMoneyModal(false);
                    setAmount('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMoney}
                  className="flex-1 btn-primary"
                >
                  Add ৳{amount || '0'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
