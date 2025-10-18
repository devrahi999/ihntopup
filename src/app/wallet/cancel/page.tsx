'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePopup } from '@/contexts/PopupContext';
import { FaTimesCircle } from 'react-icons/fa';

export default function WalletCancel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showPopup } = usePopup();
  const hasShownPopup = useRef(false);

  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId');
  const status = searchParams.get('status') || 'cancelled';
  const amount = searchParams.get('paymentAmount') || '0';

  useEffect(() => {
    // Prevent multiple popups using a ref
    if (!hasShownPopup.current) {
      hasShownPopup.current = true;
      const popupMessage = status === 'failed' ? `Payment of ৳${amount} was cancelled. No money deducted.` : 'Payment has been cancelled. No money added to wallet.';
      showPopup('warning', 'Payment Cancelled', popupMessage);
      
      const timer = setTimeout(() => {
        router.push('/wallet');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router, showPopup, status, amount]);

  return (
    <div className="page-container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <FaTimesCircle className="text-6xl text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">Payment Cancelled</h2>
        <p className="text-gray-600">No funds were added to your wallet. You can try adding money again.</p>
        <button
          onClick={() => router.push('/wallet')}
          className="btn-primary px-8 py-3"
        >
          Back to Wallet
        </button>
      </div>
    </div>
  );
}
