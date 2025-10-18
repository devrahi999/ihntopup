'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 page-container">
      <div className="max-w-md w-full animate-fade-in-up">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-semibold">Back</span>
        </button>

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
              Reset Password
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Reset Form */}
        <div className="glass-card p-6 sm:p-8">
          {!success ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                Forgot Your Password?
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
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field px-4 py-3 text-base w-full pl-12"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
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
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Check Your Email
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and click the link to reset your password.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span className="text-sm">
                    Didn't receive the email? Check your spam folder or try again.
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="btn-primary w-full"
                >
                  Try Another Email
                </button>
                
                <Link
                  href="/login"
                  className="block text-center text-primary font-bold hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
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
