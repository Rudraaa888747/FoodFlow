import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function MobileBottomNav() {
  const location = useLocation();
  const cart = useStore(s => s.cart) || [];
  const user = useStore(s => s.user);
  
  const [isVisible, setIsVisible] = useState(false);
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const handleResize = () => setIsVisible(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  const tabs = [
    { label: 'Home', path: '/customer', icon: Home },
    { label: 'Search', path: '/customer/search', icon: Search },
    { label: 'Orders', path: '/customer/profile', icon: ClipboardList }, // Or explicit orders tab if there was one
    { label: 'Cart', path: '/customer/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Profile', path: '/customer/profile', icon: User },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)', // iOS Safe area
      height: 'calc(65px + env(safe-area-inset-bottom, 0px))',
      zIndex: 999,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.04)'
    }}>
      {tabs.map((tab) => {
        // Special case for root exact match vs prefix
        const isActive = tab.path === '/customer' 
          ? location.pathname === '/customer' || location.pathname === '/customer/'
          : location.pathname.startsWith(tab.path);
          
        const Icon = tab.icon;

        return (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
              color: isActive ? '#FF4D2E' : '#9B9B96',
            }}
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              
              <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 600 }}>
                {tab.label}
              </span>

              {/* Active Dot */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FF4D2E',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* Badge */}
              {tab.badge > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  background: '#FF4D2E',
                  color: '#FFF',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '1.5px solid #FFF',
                  boxShadow: '0 2px 5px rgba(255,77,46,0.3)'
                }}>
                  {tab.badge > 9 ? '9+' : tab.badge}
                </div>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
