'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

export default function OrdersSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId');
  const status = searchParams.get('status');
  const paymentMethod = searchParams.get('paymentMethod');
  const paymentAmount = searchParams.get('paymentAmount');
  const currency = searchParams.get('currency');

  useEffect(() => {
    const handleVerification = async () => {
      // Check if we have the required parameters for a successful payment
      const isSuccessfulPayment = transactionId && user && (status === 'completed' || status === 'COMPLETED');
      
      if (!isSuccessfulPayment) {
        setMessage('Invalid payment status or user not logged in.');
        setIsError(true);
        setLoading(false);
        setTimeout(() => router.push('/orders'), 3000);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            rupantorpayTransactionId: transactionId,
            paymentMethod: paymentMethod 
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setMessage(`Order placed successfully! Payment of ৳${paymentAmount} via ${paymentMethod || 'instant payment'} was completed. Your order is being processed.`);
          setIsSuccess(true);
        } else {
          setMessage(data.message || 'Payment verification failed. Please check your orders.');
          setIsError(true);
          // Only redirect on error after 3 seconds
          setTimeout(() => router.push('/orders'), 3000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('Verification failed. Please try again or contact support.');
        setIsError(true);
        // Only redirect on error after 3 seconds
        setTimeout(() => router.push('/orders'), 3000);
      } finally {
        setLoading(false);
        // No auto-redirect on success - let user stay on success page
      }
    };

    handleVerification();
  }, [transactionId, status, user, router, paymentMethod, paymentAmount]);

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
        {isSuccess ? (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Order Successful!</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => router.push('/orders')}
              className="btn-primary px-8 py-3 text-lg"
            >
              View Orders
            </button>
          </>
        ) : (
          <>
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Issue</h2>
            <p className="text-gray-600">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/orders')}
                className="btn-primary px-8 py-3"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary px-8 py-3 border border-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
