import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, UtensilsCrossed, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

function NavItem({ to, label, icon: Icon, active, badge }) {
  return (
    <Link
      to={to}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '0.25rem', textDecoration: 'none',
        color: active ? '#FFFFFF' : '#888',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative' }}>
        <motion.div
          animate={{
            y: active ? -2 : 0,
            color: active ? '#FFFFFF' : '#888'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        </motion.div>
        
        <AnimatePresence>
          {badge > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute', top: '-4px', right: '-8px',
                background: '#FF4D2E', color: '#FFF',
                fontSize: '0.65rem', fontWeight: 800,
                minWidth: '16px', height: '16px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 2px var(--bg-secondary)', padding: '0 4px'
              }}
            >
              {badge > 99 ? '99+' : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      <motion.span
        animate={{
          fontWeight: active ? 700 : 500,
          opacity: active ? 1 : 0.8
        }}
        style={{ fontSize: '0.65rem' }}
      >
        {label}
      </motion.span>
    </Link>
  );
}

export default function RestoMobileBottomNav() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const location = useLocation();
  const orders = useStore(state => state.orders);
  
  // Assuming a generic restaurant ID for this portal context
  const RESTAURANT_ID = 'rest-2';
  
  // Count active actionable orders (Pending, Confirmed, Preparing)
  const activeActionableOrders = orders.filter(
    o => o.items.some(i => i.restaurantId === RESTAURANT_ID) && 
         ['Pending', 'Confirmed', 'Preparing'].includes(o.status)
  ).length;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className="resto-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'rgba(15, 23, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', height: '65px' }}>
        <NavItem
          to="/restaurant"
          label="Home"
          icon={LayoutDashboard}
          active={location.pathname === '/restaurant'}
        />
        <NavItem
          to="/restaurant/orders"
          label="Orders"
          icon={Package}
          active={location.pathname.startsWith('/restaurant/orders')}
          badge={activeActionableOrders}
        />
        <NavItem
          to="/restaurant/bookings"
          label="Bookings"
          icon={Calendar}
          active={location.pathname.startsWith('/restaurant/bookings')}
        />
        <NavItem
          to="/restaurant/menu"
          label="Menu"
          icon={UtensilsCrossed}
          active={location.pathname.startsWith('/restaurant/menu')}
        />
        <NavItem
          to="/restaurant/settings"
          label="Settings"
          icon={Settings}
          active={location.pathname.startsWith('/restaurant/settings')}
        />
      </div>
    </div>
  );
}
