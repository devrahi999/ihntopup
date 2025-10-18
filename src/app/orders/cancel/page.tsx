'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaTimesCircle, FaSpinner, FaShoppingCart, FaHome } from 'react-icons/fa';

export default function OrdersCancel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing payment cancellation...');
  const [showPopup, setShowPopup] = useState(false);
  const hasShownPopup = useRef(false);

  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId');
  const status = searchParams.get('status');

  useEffect(() => {
    const handleCancellation = async () => {
      if (!transactionId || !user) {
        setMessage('Payment was cancelled. No charges were made.');
        setLoading(false);
        // Show popup only once
        if (!hasShownPopup.current) {
          hasShownPopup.current = true;
          setShowPopup(true);
        }
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        setLoading(true);
        
        // Clean up any pending orders if needed
        // The payment gateway already cancelled, so we just need to inform the user
        
        setMessage('Payment was cancelled successfully. No charges were made.');
        
        // Only show popup once using ref
        if (!hasShownPopup.current) {
          hasShownPopup.current = true;
          setShowPopup(true);
        }
        
      } catch (error) {
        console.error('Cancellation processing error:', error);
        setMessage('Payment was cancelled. No charges were made.');
        
        // Only show popup once using ref
        if (!hasShownPopup.current) {
          hasShownPopup.current = true;
          setShowPopup(true);
        }
      } finally {
        setLoading(false);
        // Auto redirect after 3 seconds
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCancellation();
  }, [transactionId, status, user, router]);

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
