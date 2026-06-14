import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import MobileBottomNav from '../components/customer/MobileBottomNav';
import { useStore } from '../store/useStore';

export default function CustomerLayout() {
  const user = useStore(state => state.user);

  useEffect(() => {
    // Enforce light theme globally on the customer side
    document.body.classList.remove('theme-dark');
  }, []);

  // If the user is not logged in, redirect them to the auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="customer-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
