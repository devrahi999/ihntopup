'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBars, FaTimes, FaHome, FaUsers, FaBoxOpen, FaHeadset, 
  FaImage, FaGem, FaThLarge, FaCreditCard, FaSignOutAlt, FaArrowLeft 
} from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin authentication using the correct session keys
    const adminSession = localStorage.getItem('adminSession');
    const adminLoginTime = localStorage.getItem('adminLoginTime');
    
    if (!adminSession || !adminLoginTime) {
      router.push('/admin/login');
    } else {
      // Check if session is older than 24 hours
      const loginDate = new Date(adminLoginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminLoginTime');
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminLoginTime');
      router.push('/admin/login');
    }
  };

  const handleBackToWebsite = () => {
    router.push('/');
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/admin/users', icon: FaUsers, label: 'Users' },
    { href: '/admin/orders', icon: FaBoxOpen, label: 'Orders' },
    { href: '/admin/support', icon: FaHeadset, label: 'Support Requests' },
    { href: '/admin/banners', icon: FaImage, label: 'Banner Management' },
    { href: '/admin/categories', icon: FaThLarge, label: 'Category Sections' },
    { href: '/admin/topup-cards', icon: FaCreditCard, label: 'Topup Cards' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 transform">
                <img 
                  src="/logo/logo.png" 
                  alt="IHN TOPUP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="font-bold text-lg">IHN Admin</h2>
                <p className="text-xs text-gray-400">Control Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 p-3 space-y-2">
          <button
            onClick={handleBackToWebsite}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl transition-all"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-sm font-medium">Back to Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-300 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-auto">
        {/* Top Bar with Hamburger Menu */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
              aria-label="Open menu"
            >
              <FaBars className="text-2xl text-gray-700 group-hover:text-primary transition-colors" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 transform">
                <img 
                  src="/logo/logo.png" 
                  alt="IHN TOPUP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-gray-800">IHN Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
