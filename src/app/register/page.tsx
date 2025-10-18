'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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
    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.name
    );
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Registration failed');
    } else {
      setSuccess(true);
      // Supabase sends a confirmation email by default
      // You can configure this in your Supabase dashboard
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const { error: googleError } = await signInWithGoogle();
    setLoading(false);

    if (googleError) {
      setError(googleError.message || 'Google registration failed');
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
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Join IHN TOPUP</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Signup And Start Your Topup Journey !</p>
        </div>

        {/* Register Form */}
        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm">Registration successful! Please check your email to verify your account.</span>
              </div>
            </div>
          )}

          {/* Google Register Button */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="btn-google w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-xl" />
            <span>{loading ? 'Signing up...' : 'Sign up with Google'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field px-4 py-3 text-base w-full"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create a password (min. 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field px-4 py-3 text-base w-full"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
              <label className="text-xs sm:text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-primary font-semibold hover:underline">Terms & Conditions</Link> and <Link href="/privacy-policy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading || success} className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : success ? 'Account created!' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
