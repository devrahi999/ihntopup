'use client';

import Link from 'next/link';
import { FaWallet, FaUserCircle, FaGem } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, loading } = useAuth();
  const walletBalance = user?.walletBalance || 0;

  return (
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b-2 border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 transform group-hover:scale-110 transition-transform">
            <img 
              src="/logo/logo.png" 
              alt="IHN TOPUP Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-xl sm:text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"> </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links - Only visible on desktop */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-semibold transition-colors">
              Home
            </Link>
            <Link href="/wallet" className="text-gray-700 hover:text-primary font-semibold transition-colors">
              Wallet
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-primary font-semibold transition-colors">
              Orders
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-primary font-semibold transition-colors">
              Profile
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-primary font-semibold transition-colors">
              Support
            </Link>
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Wallet Balance */}
              <Link href="/wallet" className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-2 sm:px-3 py-2 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all shadow-md hover:shadow-lg">
                <FaWallet className="text-primary text-base sm:text-lg" />
                <span className="font-bold text-xs sm:text-sm text-gray-800">৳{walletBalance}</span>
              </Link>

              {/* Profile Icon */}
              <Link href="/profile" className="text-gray-600 hover:text-primary transition-colors p-2 hover:bg-gray-100 rounded-xl">
                <FaUserCircle className="text-2xl sm:text-3xl" />
              </Link>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4">
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
