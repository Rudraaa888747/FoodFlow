import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';

import ProtectedRoute from './components/shared/ProtectedRoute';

// Landing Page (Portal Selector)
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Public Pages
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const PartnerPage = lazy(() => import('./pages/public/PartnerPage'));
const RideWithUs = lazy(() => import('./pages/public/RideWithUs'));
const AboutUs = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.AboutUs })));
const Careers = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.Careers })));
const Blog = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.Contact })));
const TermsConditions = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.TermsConditions })));
const PrivacyPolicy = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.CookiePolicy })));
const RefundPolicy = lazy(() => import('./pages/public/CompanyPages').then(m => ({ default: m.RefundPolicy })));
// Customer Portal
const CustomerLayout = lazy(() => import('./layouts/CustomerLayout'));
const AuthPage = lazy(() => import('./pages/customer/AuthPage'));
const Home = lazy(() => import('./pages/customer/Home'));
const Search = lazy(() => import('./pages/customer/Search'));
const RestaurantDetails = lazy(() => import('./pages/customer/RestaurantDetails'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const OrderSuccess = lazy(() => import('./pages/customer/OrderSuccess'));
const OrderTracking = lazy(() => import('./pages/customer/OrderTracking'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const FoodFlowPlus = lazy(() => import('./pages/customer/FoodFlowPlus'));

// Restaurant Portal
const RestaurantLayout = lazy(() => import('./layouts/RestaurantLayout'));
const RestaurantDashboard = lazy(() => import('./pages/restaurant/RestaurantDashboard'));
const RestaurantOrders = lazy(() => import('./pages/restaurant/RestaurantOrders'));
const RestaurantMenu = lazy(() => import('./pages/restaurant/RestaurantMenu'));
const RestaurantOffers = lazy(() => import('./pages/restaurant/RestaurantOffers'));
const RestaurantReviews = lazy(() => import('./pages/restaurant/RestaurantReviews'));
const RestaurantBookings = lazy(() => import('./pages/restaurant/RestaurantBookings'));
const RestaurantSettings = lazy(() => import('./pages/restaurant/RestaurantSettings'));

// Admin Portal
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminRestaurants = lazy(() => import('./pages/admin/AdminRestaurants'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Import mock data initializer
import { initMockDatabase } from './data/mockData';

const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FF4D2E' }}
    />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes key={location.pathname} location={location}>
          {/* Auth Page as Initial Load */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Portal Selector Landing Page */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Public Static Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/ride" element={<RideWithUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
          </Route>

          {/* Customer Experience Flow */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="restaurant/:id" element={<RestaurantDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:orderId" element={<OrderSuccess />} />
            <Route path="orders/:orderId" element={<OrderTracking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="plus" element={<FoodFlowPlus />} />
          </Route>

          {/* Restaurant Management Portal (Demo Mode: Open to all logged-in users) */}
          <Route path="/restaurant" element={
            <ProtectedRoute>
              <RestaurantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RestaurantDashboard />} />
            <Route path="orders" element={<RestaurantOrders />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="offers" element={<RestaurantOffers />} />
            <Route path="reviews" element={<RestaurantReviews />} />
            <Route path="bookings" element={<RestaurantBookings />} />
            <Route path="settings" element={<RestaurantSettings />} />
          </Route>

          {/* Admin Portal (Demo Mode: Open to all logged-in users) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const theme = useStore(s => s.theme);

  useEffect(() => {
    // Initialize our mock local storage DB if it doesn't exist
    initMockDatabase();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [theme]);

  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { background: '#111110', color: '#ffffff', border: '1px solid #333333', borderRadius: '12px', fontWeight: 600, padding: '12px 20px' },
          success: {
            style: { background: '#10b981', color: '#ffffff', border: 'none' },
            iconTheme: { primary: '#ffffff', secondary: '#10b981' }
          }
        }} 
      />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
