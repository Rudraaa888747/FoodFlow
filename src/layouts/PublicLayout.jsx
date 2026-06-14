import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import MobileBottomNav from '../components/customer/MobileBottomNav';

export default function PublicLayout() {
  useEffect(() => {
    // Ensure light theme is used for public pages by default
    document.body.classList.remove('theme-dark');
  }, []);

  return (
    <div className="public-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />
      {/* Show bottom nav on mobile so they can easily jump to customer portal if they want */}
      <MobileBottomNav />
    </div>
  );
}
