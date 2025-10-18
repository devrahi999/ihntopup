'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(formData.email, formData.password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Invalid email or password');
    } else {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();
    setLoading(false);

    if (googleError) {
      setError(googleError.message || 'Google login failed');
    }
  };

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
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">IHN TOPUP</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Welcome back! Login to continue</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn-google w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-xl" />
            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field px-4 py-3 text-base w-full"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field px-4 py-3 text-base w-full"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
              <p className="text-gray-600 text-sm sm:text-base mt-2">
                Forgot your password?{' '}
                <Link href="/forgot-password" className="text-primary font-bold hover:underline">
                  Reset Password
                </Link>
              </p>
            </div>
        </div>

        {/* Info */}
        <div className="mt-6 card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-sm font-bold text-blue-800 mb-2">New here?</p>
              <p className="text-sm text-blue-700">Create an account to get started with Free Fire diamond top-ups!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
