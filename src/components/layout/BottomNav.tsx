'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaWallet, FaBoxOpen, FaUser } from 'react-icons/fa';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/wallet', icon: FaWallet, label: 'Wallet' },
    { href: '/orders', icon: FaBoxOpen, label: 'Orders' },
    { href: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-2xl border-t-2 border-gray-100 md:hidden z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
              )}
              <Icon className={`text-xl transition-transform ${isActive ? 'text-primary scale-110' : 'text-gray-500'}`} />
              <span className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

