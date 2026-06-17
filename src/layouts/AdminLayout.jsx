import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Bike, FileText, Settings, ShieldAlert, LogOut, Package, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.classList.add('theme-dark');
    return () => document.body.classList.remove('theme-dark');
  }, []);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Sidebar - Desktop Only */}
      {!isMobile && (
        <aside className="admin-sidebar" style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--glass-border-light)', display: 'flex', flexDirection: 'column' }}>
          <div className="admin-sidebar-header" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={32} color="#3742fa" />
            <h2 style={{ color: '#3742fa', fontSize: '1.2rem' }}>ADMIN OPS</h2>
          </div>
          
          <nav className="admin-sidebar-nav" style={{ flex: 1, padding: '1rem' }}>
            <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Overview" active={path === '/admin'} />
            <NavItem to="/admin/orders" icon={<Package size={20} />} label="Orders" active={path === '/admin/orders'} />
            <NavItem to="/admin/customers" icon={<Users size={20} />} label="Customers" active={path === '/admin/customers'} />
            <NavItem to="/admin/restaurants" icon={<Store size={20} />} label="Restaurants" active={path === '/admin/restaurants'} />
            <NavItem to="/admin/reports" icon={<FileText size={20} />} label="Reports" active={path === '/admin/reports'} />
            <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Platform Settings" active={path === '/admin/settings'} />
            <NavItem to="/" icon={<Home size={20} />} label="Back to Website" active={false} />
          </nav>
          
          <div className="admin-sidebar-footer" style={{ padding: '2rem', borderTop: '1px solid var(--glass-border-light)' }}>
            <div className="flex-center" style={{ gap: '1rem', marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3742fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                SA
              </div>
              <div>
                <p style={{ fontWeight: 'bold' }}>Super Admin</p>
                <p className="text-secondary" style={{ fontSize: '0.8rem' }}>HQ Team</p>
              </div>
            </div>
            <div onClick={() => { logout(); navigate('/landing'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.9rem', cursor: 'pointer' }}>
              <LogOut size={16} /> Exit Portal
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="admin-main" style={{ 
        flex: 1, 
        padding: isMobile ? '0' : '2rem', 
        overflowY: 'auto', 
        maxHeight: isMobile ? 'calc(100vh - 80px)' : '100vh' 
      }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <AdminMobileBottomNav path={path} />}
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link 
      to={to} 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: active ? 'rgba(55, 66, 250, 0.1)' : 'transparent',
        color: active ? '#3742fa' : 'var(--text-secondary)',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
        fontWeight: active ? 'bold' : 'normal'
      }}
    >
      {icon} {label}
    </Link>
  );
}

function AdminMobileBottomNav({ path }) {
  const tabs = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dash' },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/restaurants', icon: Store, label: 'Vendors' },
    { to: '/admin/customers', icon: Users, label: 'Users' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/', icon: Home, label: 'Website' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(15, 15, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px))',
      zIndex: 1000
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = path === tab.to;
        return (
          <Link key={tab.to} to={tab.to} style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            gap: '0.4rem', textDecoration: 'none',
            position: 'relative'
          }}>
            <motion.div 
              whileTap={{ scale: 0.9 }}
              style={{
                color: isActive ? '#3742fa' : 'var(--text-secondary)',
                background: isActive ? 'rgba(55, 66, 250, 0.15)' : 'transparent',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={22} />
            </motion.div>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: isActive ? 700 : 500, 
              color: isActive ? '#3742fa' : 'var(--text-secondary)'
            }}>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  );
}
