'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePopup } from '@/contexts/PopupContext';
import { createClient } from '@/lib/supabase/client';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function WalletSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showPopup } = usePopup();
  const hasProcessed = useRef(false);
  const hasShownPopup = useRef(false);

  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId');
  const status = searchParams.get('status');
  const amount = searchParams.get('paymentAmount') || '0';
  const paymentMethod = searchParams.get('paymentMethod') || 'unknown';

  useEffect(() => {
    const processPayment = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      if (!transactionId || !user) {
        setTimeout(() => router.push('/wallet'), 3000);
        return;
      }

      // If status is completed, directly add money to wallet
      if (status === 'completed') {
        try {
          const supabase = createClient();
          const numericAmount = parseFloat(amount);

          // Find the pending transaction for this user
          const { data: pendingTransactions, error: queryError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .eq('amount', numericAmount)
            .order('created_at', { ascending: false })
            .limit(1);

          let transactionToUpdate = null;

          if (queryError || !pendingTransactions || pendingTransactions.length === 0) {
            console.log('No pending transaction found, creating new one');
            // Create a new transaction record
            const { data: newTransaction, error: insertError } = await supabase
              .from('transactions')
              .insert([{
                user_id: user.id,
                type: 'credit',
                amount: numericAmount,
                description: `Wallet recharge via ${paymentMethod}`,
                method: paymentMethod,
                status: 'completed',
                rupantorpay_transaction_id: transactionId,
                created_at: new Date().toISOString(),
              }])
              .select()
              .single();

            if (insertError) {
              console.error('Failed to create transaction:', insertError);
              throw new Error('Failed to create transaction record');
            }
            transactionToUpdate = newTransaction;
          } else {
            // Update the existing pending transaction
            const { error: updateError } = await supabase
              .from('transactions')
              .update({
                status: 'completed',
                description: `Wallet recharge via ${paymentMethod}`,
                rupantorpay_transaction_id: transactionId,
              })
              .eq('id', pendingTransactions[0].id);

            if (updateError) {
              console.error('Failed to update transaction:', updateError);
              throw new Error('Failed to update transaction');
            }
            transactionToUpdate = pendingTransactions[0];
          }

          // Get current wallet balance
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('Failed to get user balance:', userError);
            throw new Error('Failed to get user balance');
          }

          // Update wallet balance - use increment operation for safety
          const currentBalance = parseFloat(userData.wallet_balance) || 0;
          const newBalance = currentBalance + numericAmount;

          const { error: balanceError } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', user.id);

          if (balanceError) {
            console.error('Failed to update wallet balance:', balanceError);
            throw new Error('Failed to update wallet balance');
          }

          console.log('Wallet balance updated successfully from', currentBalance, 'to', newBalance);

          // Refresh user data to get updated balance
          if (refreshUser) {
            refreshUser();
          }

          // Success! Only show popup once
          if (!hasShownPopup.current) {
            hasShownPopup.current = true;
            // Redirect to wallet page with success parameters to show popup there
            router.push(`/wallet?paymentSuccess=true&amount=${amount}&transactionId=${transactionId}`);
          }

        } catch (error) {
          console.error('Payment processing error:', error);
          if (!hasShownPopup.current) {
            hasShownPopup.current = true;
            showPopup('error', 'Processing Error', 'Payment completed but failed to update wallet. Please contact support.');
            setTimeout(() => router.push('/wallet'), 3000);
          }
        }
      } else {
        if (!hasShownPopup.current) {
          hasShownPopup.current = true;
          showPopup('warning', 'Payment Status', 'Payment status not completed. Please check your wallet.');
          setTimeout(() => router.push('/wallet'), 3000);
        }
      }
    };

    // Only process if we have the required data
    if (transactionId && user && status === 'completed') {
      processPayment();
    } else {
      if (!hasShownPopup.current) {
        hasShownPopup.current = true;
        showPopup('warning', 'Payment Processing', 'Processing your payment...');
        setTimeout(() => router.push('/wallet'), 3000);
      }
    }
  }, [transactionId, status, user, router, showPopup, amount, paymentMethod, refreshUser]);

  return (
    <div className="page-container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="text-gray-600">
          We've received your payment of ৳{amount} via {paymentMethod}.
        </p>
        <p className="text-sm text-gray-500">
          Transaction ID: {transactionId}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/wallet')}
            className="btn-primary px-6 py-2"
          >
            Check Wallet
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn-secondary px-6 py-2 border border-gray-300"
          >
            Continue Shopping
          </button>
        </div>
        <div className="mt-4">
          <FaSpinner className="animate-spin text-primary mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Processing payment...</p>
        </div>
      </div>
    </div>
  );
}
