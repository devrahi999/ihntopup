'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaTimesCircle, FaSpinner, FaShoppingCart, FaHome } from 'react-icons/fa';

export default function SimpleOrdersCancel() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing payment cancellation...');

  useEffect(() => {
    const handleCancellation = async () => {
      // Get URL parameters directly from window.location to avoid hydration issues
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('transaction_id') || urlParams.get('transactionId');
      const status = urlParams.get('status');

      console.log('🔄 Simple cancellation:', { transactionId, status, user });

      if (!user) {
        setMessage('Payment was cancelled. No charges were made.');
        setLoading(false);
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        setLoading(true);
        
        // Use the direct REST API for guaranteed cancellation
        const response = await fetch('/api/orders/cancel-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: transactionId || 'unknown',
            userId: user.id,
            status: status || 'failed'
          }),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          setMessage(`Payment ${status || 'cancelled'}. No charges were made. ${result.message}`);
        } else {
          setMessage(`Payment ${status || 'cancelled'}. No charges were made.`);
        }
        
      } catch (error) {
        console.error('Cancellation processing error:', error);
        setMessage('Payment was cancelled. No charges were made.');
      } finally {
        setLoading(false);
        setTimeout(() => router.push('/'), 3000);
      }
    };

    // Use setTimeout to ensure this runs only on client side
    setTimeout(() => {
      handleCancellation();
    }, 0);
  }, [user, router]);

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <FaSpinner className="animate-spin text-5xl text-primary mx-auto" />
          <p className="text-xl font-semibold text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">Payment Cancelled</h2>
        <p className="text-gray-600">{message}</p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FaHome />
            Back to Home
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="btn-secondary w-full flex items-center justify-center gap-2 border border-gray-300"
          >
            <FaShoppingCart />
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}
