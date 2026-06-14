import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Store, LayoutDashboard, UtensilsCrossed, Package, Megaphone, Star, Settings, LogOut, ChevronRight, Calendar, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import RestoMobileBottomNav from '../components/restaurant/RestoMobileBottomNav';

import { useStore } from '../store/useStore';

export default function RestaurantLayout() {
  const location = useLocation();
  const path = location.pathname;
  const user = useStore(state => state.user);

  useEffect(() => {
    // Enforce dark theme globally on the restaurant portal
    document.body.classList.add('theme-dark');
    return () => document.body.classList.remove('theme-dark');
  }, []);

  return (
    <div className="resto-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Premium Sidebar */}
      <aside className="resto-sidebar" style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Subtle top glow */}
        <div className="resto-sidebar-glow" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)', pointerEvents: 'none' }} />

        <div className="resto-sidebar-header" style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #111 0%, #000 100%)',
            border: '1px solid var(--glass-border-strong)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}>
            <Store size={18} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Resto Hub</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>OS for Restaurants</p>
          </div>
        </div>

        <nav className="resto-sidebar-nav" style={{ flex: 1, padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div className="nav-group-title" style={{ padding: '0 0.5rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</div>
          <NavItem to="/restaurant" icon={<LayoutDashboard size={18} />} label="Dashboard" active={path === '/restaurant'} />
          <NavItem to="/restaurant/menu" icon={<UtensilsCrossed size={18} />} label="Menu Management" active={path === '/restaurant/menu'} />
          <NavItem to="/restaurant/orders" icon={<Package size={20} />} label="Orders" active={path === '/restaurant/orders'} />
          <NavItem to="/restaurant/bookings" icon={<Calendar size={20} />} label="Table Bookings" active={path === '/restaurant/bookings'} />

          <NavItem to="/restaurant/offers" icon={<Megaphone size={18} />} label="Offers & Marketing" active={path === '/restaurant/offers'} />
          <NavItem to="/restaurant/reviews" icon={<Star size={18} />} label="Reviews" active={path === '/restaurant/reviews'} />

          <div className="nav-group-title" style={{ padding: '1.5rem 0.5rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System</div>
          <NavItem to="/restaurant/settings" icon={<Settings size={18} />} label="Settings" active={path === '/restaurant/settings'} />
        </nav>

        <div className="resto-sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)' }}>
          <Link to={`/customer/restaurant/${user?.restaurantId || 1}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--accent)', color: '#fff', borderRadius: '12px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(255,77,46,0.3)' }}>
            <Utensils size={16} /> View Live Page
          </Link>
          <div className="user-info-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border-light)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--bg-primary)', fontSize: '0.8rem' }}>
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Restaurant'}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Admin Portal</p>
            </div>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, transition: 'color var(--transition-fast)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <LogOut size={16} /> Log out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="resto-main bg-pattern" style={{ flex: 1, height: '100vh', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        {/* Top subtle fade */}
        <div className="resto-main-fade" style={{ position: 'fixed', top: 0, left: '260px', right: 0, height: '60px', background: 'linear-gradient(180deg, var(--bg-primary) 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />

        <div className="resto-main-content" style={{ padding: '3rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100%' }}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <RestoMobileBottomNav />
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link to={to} style={{ position: 'relative', display: 'block' }}>
      {active && (
        <motion.div
          layoutId="activeNavIndicator"
          style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            background: 'var(--glass-bg-hover)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border-light)',
            zIndex: 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: active ? 500 : 400,
          fontSize: '0.9rem',
          transition: 'color var(--transition-fast)',
        }}
        onMouseOver={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
          {label}
        </div>
        {active && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
      </div>
    </Link>
  );
}
