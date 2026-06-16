import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Zap, Home, UtensilsCrossed, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Nav link with animated underline ───────────────────────────────────────
function NavLink({ to, label, icon: Icon, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
    >
      <motion.span
        whileHover="hovered"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          color: active ? '#111110' : '#9B9B96',
          fontSize: '0.88rem', fontWeight: active ? 700 : 500,
          transition: 'color 0.2s',
          padding: '0.3rem 0',
        }}
      >
        {Icon && <Icon size={15} strokeWidth={active ? 2.5 : 2} />}
        {label}
        {/* Underline dot */}
        <motion.span
          style={{
            position: 'absolute', bottom: '-2px', left: 0, right: 0,
            height: '2px', borderRadius: '9999px',
            background: '#FF4D2E',
            scaleX: active ? 1 : 0,
            originX: 0,
          }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        />
      </motion.span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const searchRef = useRef(null);

  const cart = useStore(s => s.cart) || [];
  const user = useStore(s => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/customer/search?q=${searchVal.trim()}`);
      setSearchOpen(false);
      setSearchVal('');
    }
    if (e.key === 'Escape') { setSearchOpen(false); setSearchVal(''); }
  };

  return (
    <>
      {/* ── Main Nav ──────────────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <motion.nav
          animate={{
            background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.95)',
            borderBottomColor: scrolled ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)',
            paddingTop: scrolled ? '0.55rem' : '0.85rem',
            paddingBottom: scrolled ? '0.55rem' : '0.85rem',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            paddingLeft: 0, paddingRight: 0,
          }}
        >
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '0 1.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1.5rem',
          }}>

            {/* Desktop Logo (Hidden on mobile to save space for Location) */}
            {!isMobile && (
              <Link to="/customer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
                <motion.img 
                  src="/logo.png" 
                  alt="FoodFlow Logo" 
                  whileHover={{ scale: 1.05 }}
                  style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
                />
              </Link>
            )}

            {/* Desktop nav links — center */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.25rem', flex: 1, justifyContent: 'center' }}>
                <NavLink to="/customer" label="Home" icon={Home} active={isActive('/customer')} />
                <NavLink to="/customer/search" label="Restaurants" icon={UtensilsCrossed} active={isActive('/customer/search')} />
              </div>
            )}

            {/* Right actions / Mobile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flex: isMobile ? 1 : 0, justifyContent: isMobile ? 'space-between' : 'flex-end', width: isMobile ? '100%' : 'auto' }}>
              
              {/* Mobile Header (Location & Profile) */}
              {isMobile ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Zap size={15} color="#FF4D2E" fill="#FF4D2E" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Delivering to</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>
                      Home — 123 Satellite Road, Ahmedabad
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {user ? (
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => navigate('/customer/profile')}
                        style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FF4D2E 0%, #FF8C42 100%)',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 2px 8px rgba(255,77,46,0.3)',
                          color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/auth')}
                        style={{
                          background: '#111110', color: '#FFFFFF',
                          border: 'none', borderRadius: '9999px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Log in
                      </motion.button>
                    )}
                  </div>
                </>
              ) : (
                /* Desktop Right Actions */
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <AnimatePresence mode="wait">
                    {searchOpen ? (
                      <motion.div
                        key="search-input"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '220px', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: 'var(--bg-primary)', border: '1.5px solid #E8E7E4',
                          borderRadius: '9999px', padding: '0.45rem 1rem',
                        }}>
                          <Search size={14} color="#9B9B96" />
                          <input
                            ref={searchRef}
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search food..."
                            style={{
                              background: 'transparent', border: 'none', outline: 'none',
                              fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%', fontWeight: 500,
                            }}
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
                    onClick={() => setSearchOpen(v => !v)}
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: searchOpen ? 'var(--glass-border)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#4B4B46', transition: 'background 0.2s',
                    }}
                  >
                    {searchOpen ? <X size={17} strokeWidth={2.5} /> : <Search size={17} strokeWidth={2.5} />}
                  </motion.button>

                  <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }} style={{ position: 'relative' }}>
                    <Link
                      to="/customer/cart"
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#4B4B46', textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#F7F6F4'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <ShoppingBag size={17} strokeWidth={2.2} />
                    </Link>
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                          style={{
                            position: 'absolute', top: '-1px', right: '-1px',
                            background: '#FF4D2E', color: '#FFFFFF',
                            borderRadius: '9999px', minWidth: '17px', height: '17px',
                            fontSize: '0.62rem', fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 3px',
                            boxShadow: '0 2px 6px rgba(255,77,46,0.45)',
                            border: '1.5px solid #FFFFFF',
                          }}
                        >
                          {cartCount > 9 ? '9+' : cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div style={{ width: '1px', height: '22px', background: '#E8E7E4', margin: '0 0.25rem' }} />

                  {user ? (
                    <div style={{ position: 'relative' }}>
                      <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={() => navigate('/customer/profile')}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FF4D2E 0%, #FF8C42 100%)',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 2px 8px rgba(255,77,46,0.3)',
                          color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                      </motion.button>
                      {useStore(s => s.isPremium) && (
                        <div style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px', border: '1px solid #fff', zIndex: 10 }}>
                          PLUS
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/auth')}
                      style={{
                        background: '#111110', color: '#FFFFFF',
                        border: 'none', borderRadius: '9999px',
                        padding: '0.5rem 1.2rem',
                        fontSize: '0.85rem', fontWeight: 700,
                        cursor: 'pointer', letterSpacing: '-0.01em',
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                      }}
                    >
                      <User size={14} />
                      Log in
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.nav>

        {/* ── Scroll-in pill indicator ──────────────────────────────────── */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)',
                height: '2px', width: '48px',
                background: 'linear-gradient(to right, transparent, #FF4D2E, transparent)',
                borderRadius: '9999px',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(8,8,8,0.4)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                zIndex: 199,
              }}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '78%', maxWidth: '320px',
                background: 'var(--bg-elevated)',
                zIndex: 200, display: 'flex', flexDirection: 'column',
                boxShadow: '-24px 0 60px rgba(0,0,0,0.1)',
              }}
            >
              {/* Drawer header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid #F0EFEC',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src="/logo.png" alt="FoodFlow Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'var(--bg-primary)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6B6B66', cursor: 'pointer',
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Drawer links */}
              <div style={{ flex: 1, padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { to: '/customer', label: 'Home', icon: Home },
                  { to: '/customer/search', label: 'Restaurants', icon: UtensilsCrossed },
                  { to: '/customer/cart', label: `Cart  ${cartCount > 0 ? `(${cartCount})` : ''}`, icon: ShoppingBag },
                  ...(user ? [{ to: '/customer/profile', label: 'Profile', icon: User }] : []),
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileHover={{ x: 4, background: 'var(--bg-primary)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem', borderRadius: '14px',
                        background: isActive(to) ? '#FFF1EE' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: isActive(to) ? '#FF4D2E' : '#F7F6F4',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.15s',
                        }}>
                          <Icon size={17} color={isActive(to) ? '#FFFFFF' : '#6B6B66'} />
                        </div>
                        <span style={{
                          fontSize: '0.95rem', fontWeight: 700,
                          color: isActive(to) ? '#CC3318' : '#111110',
                        }}>
                          {label}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Drawer footer */}
              <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #F0EFEC' }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF4D2E, #FF8C42)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem',
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setMenuOpen(false); navigate('/auth'); }}
                    style={{
                      width: '100%', background: '#111110', color: '#FFFFFF',
                      border: 'none', borderRadius: '12px',
                      padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Log in to FoodFlow
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}