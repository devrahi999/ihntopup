import Link from 'next/link';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mt-16 pb-16 md:pb-0 text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-16 h-16 transform">
                <img 
                  src="/logo/logo.png" 
                  alt="IHN TOPUP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"> </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bangladesh's most trusted Free Fire diamond top-up service. Fast, secure, and reliable.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <FaWhatsapp className="text-lg" />
              </a>
              <a href="https://t.me/ihntopup" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <FaTelegram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Important Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} <span className="text-primary font-semibold">IHN TOPUP</span>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Made by <span className="text-primary font-semibold">RAHI</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
