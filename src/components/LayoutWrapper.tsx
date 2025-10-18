'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import PopupContainer from './PopupContainer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes don't get Header, Footer, or BottomNav
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="main-content min-h-screen">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <PopupContainer />
    </>
  );
}
