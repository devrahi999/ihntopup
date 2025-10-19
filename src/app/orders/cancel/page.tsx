'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimesCircle, FaSpinner, FaShoppingCart, FaHome } from 'react-icons/fa';

export default function OrdersCancel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Payment was cancelled. No charges were made.');

  useEffect(() => {
    // No need to cancel orders - they don't exist until payment is successful
    console.log('🔄 User cancelled payment - no orders to cancel');
    
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <FaSpinner className="animate-spin text-5xl text-primary mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Processing...</p>
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
        <p className="text-sm text-gray-500">Redirecting to homepage in 3 seconds...</p>
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
