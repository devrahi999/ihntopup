'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';
import { usePopup } from '@/contexts/PopupContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showPopup } = usePopup();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const checkPasswordReset = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check if we have a recovery token in the URL
          const hash = window.location.hash;
          if (hash && hash.includes('type=recovery')) {
            // Parse the hash to get tokens
            const params = new URLSearchParams(hash.substring(1));
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            
            if (access_token && refresh_token) {
              // Set the session using recovery tokens
              const { error: sessionError } = await supabase.auth.setSession({
                access_token,
                refresh_token
              });
              
              if (sessionError) {
                console.error('Session error:', sessionError);
                setTokenValid(false);
              } else {
                setTokenValid(true);
              }
            } else {
              setTokenValid(false);
            }
          } else {
            setTokenValid(false);
          }
        } else {
          // User has valid session, check if it's a recovery session
          setTokenValid(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
      }
    };

    checkPasswordReset();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      console.log('Attempting to update password...');
      
      // Update password using Supabase
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      console.log('Update result:', { data, updateError });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError(updateError.message || 'Failed to reset password. Please try again.');
      } else {
        console.log('Password updated successfully');
        
        // Show success popup
        showPopup('success', 'Password Reset Successful!', 'Your password has been successfully reset. You can now login with your new password.', 3000);
        
        // Sign out the user after password reset
        await supabase.auth.signOut();
        console.log('User signed out after password reset');
        
        // Redirect to login after showing popup
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 page-container">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white rounded-3xl mb-4 shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20">
                <img 
                  src="/logo/logo.png" 
                  alt="IHN TOPUP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Invalid Link
              </span>
            </h1>
          </div>

          <div className="glass-card p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Invalid Reset Link
            </h2>
            
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. 
              Please request a new reset link from the forgot password page.
            </p>

            <div className="space-y-4">
              <Link
                href="/forgot-password"
                className="btn-primary w-full block text-center"
              >
                Request New Reset Link
              </Link>
              
              <Link
                href="/login"
                className="block text-center text-primary font-bold hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 page-container">
      <div className="max-w-md w-full animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-3xl mb-4 shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <img 
                src="/logo/logo.png" 
                alt="IHN TOPUP Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              New Password
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create a new password for your account
          </p>
        </div>

        {/* Reset Form */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Set New Password
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field px-4 py-3 text-base w-full pl-12"
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field px-4 py-3 text-base w-full pl-12"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Remember your password?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@ihntopup.com" className="text-primary hover:underline">
              support@ihntopup.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
