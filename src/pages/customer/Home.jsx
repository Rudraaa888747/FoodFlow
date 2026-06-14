import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Flame, Star, Clock, ChevronRight, Zap, TrendingUp, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../../components/ui/RestaurantCard';
import { useStore } from '../../store/useStore';

// ── Greeting based on time of day ──────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌙' };
  return { text: 'Late night craving?', emoji: '🌛' };
}

// ── Theme tokens ─────────────────────────────────────────────────────────
// Light: warm paper background, near-black ink, coral accent stays the
// signature thread across both modes.
// Dark: deep charcoal (not pure black) so the coral glow has room to breathe.
const THEMES = {
  light: {
    bg: '#FAF9F6',
    bgElevated: 'var(--bg-elevated)',
    surface: '#F4F2EE',
    surfaceAlt: '#EFEDE8',
    text: '#16161A',
    textMuted: '#6B6863',
    textFaint: '#9C9892',
    border: '#E7E4DE',
    heroBg: '#16161A',
    heroText: '#FFFFFF',
    heroMuted: 'rgba(255,255,255,0.55)',
    heroSurface: 'rgba(255,255,255,0.06)',
    heroBorder: 'rgba(255,255,255,0.1)',
    accent: '#FF4D2E',
    accentSoft: 'rgba(255,77,46,0.10)',
    shadow: '0 16px 40px rgba(22,22,26,0.08)',
  },
  dark: {
    bg: '#0E0E10',
    bgElevated: '#17171A',
    surface: '#1B1B1E',
    surfaceAlt: '#222226',
    text: '#F5F4F2',
    textMuted: '#A6A4A0',
    textFaint: '#6E6C68',
    border: '#2A2A2E',
    heroBg: '#070708',
    heroText: '#FFFFFF',
    heroMuted: 'rgba(255,255,255,0.5)',
    heroSurface: 'rgba(255,255,255,0.05)',
    heroBorder: 'rgba(255,255,255,0.08)',
    accent: '#FF5C3C',
    accentSoft: 'rgba(255,92,60,0.14)',
    shadow: '0 16px 40px rgba(0,0,0,0.45)',
  },
};

// ── Magnetic Button (desktop-only pointer offset, ignored on touch) ───────
function MagneticButton({ children, onClick, style, ariaLabel }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e) => {
    if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      aria-label={ariaLabel}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ filter: 'brightness(1.06)' }}
    >
      {children}
    </motion.button>
  );
}

// ── Tilt Card Wrapper (disabled on touch devices) ─────────────────────────
function TiltCard({ children, style, onClick, ariaLabel }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRX = useSpring(rotX, { stiffness: 300, damping: 30 });
  const sRY = useSpring(rotY, { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 8);
    rotX.set(-py * 8);
  };
  const reset = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      style={{ ...style, rotateX: sRX, rotateY: sRY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {children}
    </motion.div>
  );
}

// ── Scroll Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(to / 50);
          if (start >= to) { setCount(to); return; }
          setCount(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Category data ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Biryani', emoji: '🍛' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burgers', emoji: '🍔' },
  { label: 'Sushi', emoji: '🍣' },
  { label: 'Thali', emoji: '🥘' },
  { label: 'Desserts', emoji: '🍰' },
  { label: 'Chinese', emoji: '🥡' },
  { label: 'Wraps', emoji: '🌯' },
];

// ── MAIN HOME COMPONENT ────────────────────────────────────────────────────
export default function Home() {
  const restaurants = useStore(state => state.restaurants);
  const tasteProfile = useStore(state => state.tasteProfile);
  const isPremium = useStore(s => s.isPremium);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Theme: default to system preference, persist for the session.
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);
  const t = THEMES[theme];
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Route Prefetching
  useEffect(() => {
    import('./Search');
    import('./RestaurantDetails');
  }, []);

  const greeting = getGreeting();
  const favoriteRestaurant = restaurants.find(r => r.name === tasteProfile.favoriteRestaurant) || restaurants[0];
  const trending = restaurants.slice(0, 6);

  const runSearch = () => navigate(`/customer/search?q=${encodeURIComponent(searchValue)}`);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } }
  };

  return (
    <div style={{ background: t.bg, minHeight: '100vh', fontFamily: 'inherit', overflowX: 'hidden', color: t.text, transition: 'background 0.35s ease, color 0.35s ease' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="ff-hero" style={{
        background: t.heroBg,
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Texture overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${t.accent}1A 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          opacity: theme === 'light' ? 0.5 : 1,
          pointerEvents: 'none',
        }} />

        {/* Coral glow bottom-right */}
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-80px', right: '-60px',
          width: '500px', height: '500px',
          background: `radial-gradient(circle, ${t.accent}30 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          className="ff-theme-toggle"
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '9999px',
            background: t.heroSurface, border: `1px solid ${t.heroBorder}`,
            color: t.heroText, cursor: 'pointer', backdropFilter: 'blur(12px)',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="ff-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Greeting tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: t.heroSurface, backdropFilter: 'blur(12px)',
              border: `1px solid ${t.heroBorder}`,
              padding: '0.45rem 1.1rem', borderRadius: '9999px',
              marginBottom: '2.25rem',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{greeting.emoji}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: t.heroMuted, letterSpacing: '0.5px' }}>
              {greeting.text}
            </span>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="ff-hero-title"
            style={{
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: t.heroText,
              marginBottom: '1.4rem',
              maxWidth: '900px',
            }}
          >
            Food, delivered<br />
            <span style={{
              WebkitTextStroke: `2px ${t.accent}`,
              color: 'transparent',
            }}>
              fast &amp; fresh.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '1.1rem', color: t.heroMuted, marginBottom: '2.5rem', maxWidth: '480px', lineHeight: 1.7 }}
          >
            Discover top restaurants, track your order in real-time, and eat better every day.
          </motion.p>

          {/* Search bar */}
          <motion.form
            role="search"
            onSubmit={(e) => { e.preventDefault(); runSearch(); }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="ff-search"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: searchFocused ? t.heroSurface.replace('0.05', '0.1').replace('0.06', '0.1') : t.heroSurface,
              border: `1px solid ${searchFocused ? `${t.accent}99` : t.heroBorder}`,
              borderRadius: '16px',
              padding: '0.5rem',
              maxWidth: '600px',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Search size={20} color={searchFocused ? t.accent : t.heroMuted} aria-hidden="true" style={{ flexShrink: 0, marginLeft: '0.85rem', transition: 'color 0.25s' }} />
            <label htmlFor="hero-search" className="ff-sr-only">Search restaurants or dishes</label>
            <input
              id="hero-search"
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Biryani, burgers, pizza..."
              style={{
                flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                color: t.heroText, fontSize: '1.05rem', padding: '0.6rem 0.75rem',
                fontWeight: 500,
              }}
            />
            <MagneticButton
              onClick={runSearch}
              ariaLabel="Search"
              style={{
                background: t.accent, color: '#FFFFFF',
                border: 'none', borderRadius: '10px',
                padding: '0.8rem 1.4rem', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                letterSpacing: '-0.01em', flexShrink: 0,
              }}
            >
              <span className="ff-search-label">Search</span> <ArrowRight size={17} aria-hidden="true" />
            </MagneticButton>
          </motion.form>

          {/* FoodFlow Plus Promo */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              role="button" tabIndex={0}
              onClick={() => navigate('/customer/plus')}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/customer/plus'); }}
              className="ff-plus-banner"
              style={{
                marginTop: '2.75rem',
                background: 'linear-gradient(90deg, rgba(245,158,11,0.15), rgba(255,107,53,0.15))',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                maxWidth: '100%',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', padding: '0.5rem', borderRadius: '12px', flexShrink: 0, display: 'flex' }}>
                <Zap size={20} color="#fff" fill="#fff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Get FoodFlow Plus</span>
                <span style={{ fontSize: '0.85rem', color: '#bdbab5' }}>Unlimited free delivery &amp; exclusive offers</span>
              </div>
              <ArrowRight size={18} color="#f59e0b" aria-hidden="true" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </motion.div>
          )}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="ff-stats"
            style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}
          >
            {[
              { value: 500, suffix: '+', label: 'Restaurants' },
              { value: 2, suffix: 'M+', label: 'Orders delivered' },
              { value: 98, suffix: '%', label: 'On-time rate' },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: t.heroText, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <Counter to={value} suffix={suffix} />
                </div>
                <div style={{ fontSize: '0.82rem', color: t.heroMuted, marginTop: '0.3rem', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>


      </section>

      {/* ══ CATEGORY PILLS ═════════════════════════════════════════════════ */}
      <section style={{ background: t.bgElevated, borderBottom: `1px solid ${t.border}`, padding: '1.25rem 0' }}>
        <div className="ff-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="ff-categories" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <motion.button
                  key={cat.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActiveCategory(active ? null : cat.label);
                    navigate(`/customer/search?q=${encodeURIComponent(cat.label)}`);
                  }}
                  aria-pressed={active}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: active ? t.accent : t.surface,
                    color: active ? '#FFFFFF' : t.text,
                    border: 'none', borderRadius: '9999px',
                    padding: '0.55rem 1.2rem', fontSize: '0.9rem', fontWeight: 600,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.2s, color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1rem' }} aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ BENTO GRID ══════════════════════════════════════════════════════ */}
      <section style={{ background: t.bg, padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
        <div className="ff-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="ff-bento-grid"
          >

            {/* Hero bento: Favourite restaurant */}
            {favoriteRestaurant && (
              <motion.div className="ff-bento-feature" variants={fadeUp}>
                <TiltCard
                  ariaLabel={`Order again from ${favoriteRestaurant.name}`}
                  style={{
                    backgroundImage: `url(${favoriteRestaurant.coverImage})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    borderRadius: '24px', minHeight: '420px', height: '100%',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '2rem',
                    boxShadow: t.shadow,
                  }}
                  onClick={() => navigate(`/customer/restaurant/${favoriteRestaurant.id}`)}
                >
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)' }} />
                  {/* Live badge */}
                  <div style={{
                    position: 'absolute', top: '1.5rem', left: '1.5rem',
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: t.accent, borderRadius: '9999px',
                    padding: '0.35rem 0.9rem', zIndex: 2,
                  }}>
                    <span aria-hidden="true" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'block', animation: 'ff-pulse 1.5s infinite' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>OPEN NOW</span>
                  </div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Your favourite
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                      {favoriteRestaurant.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        {favoriteRestaurant.cuisine?.[0]}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={14} fill={t.accent} color={t.accent} />
                        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>{favoriteRestaurant.rating}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="rgba(255,255,255,0.6)" />
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{favoriteRestaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    style={{
                      position: 'relative', zIndex: 2,
                      marginTop: '1.5rem',
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--bg-elevated)', color: '#16161A',
                      borderRadius: '12px', padding: '0.7rem 1.4rem',
                      fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Order again <ArrowRight size={16} aria-hidden="true" />
                  </motion.div>
                </TiltCard>
              </motion.div>
            )}

            {/* Hot deal card */}
            <motion.div className="ff-bento-deal" variants={fadeUp}>
              <div style={{
                background: t.accent, borderRadius: '24px', padding: '2rem',
                height: '100%', minHeight: '180px', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: `0 20px 40px ${t.accent}40`,
              }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                <div aria-hidden="true" style={{ position: 'absolute', bottom: '-40px', right: '30px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                  <Flame size={20} color="#FFFFFF" fill="#FFFFFF" aria-hidden="true" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Hot deal</span>
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
                    ₹150 off
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginBottom: '1rem' }}>
                    On orders above ₹499
                  </div>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                    border: '1.5px dashed rgba(255,255,255,0.5)',
                    padding: '0.4rem 1rem', borderRadius: '8px',
                    fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '3px',
                  }}>
                    BINGE150
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Taste intelligence */}
            <motion.div className="ff-bento-taste" variants={fadeUp}>
              <motion.div
                role="button" tabIndex={0}
                whileHover={{ scale: 0.985 }}
                onClick={() => navigate(`/customer/search?q=${encodeURIComponent(tasteProfile.favoriteCuisine)}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/customer/search?q=${encodeURIComponent(tasteProfile.favoriteCuisine)}`); }}
                style={{
                  background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '2rem',
                  minHeight: '180px', height: '100%', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
                }}
              >
                <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, right: 0, width: '160px', height: '160px', background: `radial-gradient(circle, ${t.accent}26 0%, transparent 70%)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '2rem' }} aria-hidden="true">✨</span>
                  <ChevronRight size={20} color={t.textFaint} aria-hidden="true" />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>
                    Taste intelligence
                  </div>
                  <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: t.text, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    Because you love <span style={{ color: t.accent }}>{tasteProfile.favoriteCuisine}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ══ TRENDING ════════════════════════════════════════════════════════ */}
      <section style={{ background: t.bgElevated, padding: 'clamp(3rem, 6vw, 4.5rem) 0 5rem', borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        <div className="ff-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ff-section-header"
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <TrendingUp size={18} color={t.accent} aria-hidden="true" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: t.accent, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Trending now
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: t.text, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                Hot picks near you
              </h2>
            </div>
            <motion.button
              whileHover={{ gap: '0.75rem' }}
              onClick={() => navigate('/customer/search')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'transparent', border: `1.5px solid ${t.border}`,
                color: t.text, borderRadius: '9999px',
                padding: '0.6rem 1.4rem', fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer', transition: 'border-color 0.2s, gap 0.2s',
                flexShrink: 0,
              }}
            >
              See all <ArrowRight size={16} aria-hidden="true" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="ff-trending-grid"
          >
            {trending.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                variants={fadeUp}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ BANNER CTA ══════════════════════════════════════════════════════ */}
      <section style={{ background: t.bg, padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
        <div className="ff-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="ff-cta-banner"
            style={{
              background: t.heroBg, borderRadius: '28px',
              padding: 'clamp(2rem, 5vw, 4rem)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', right: '-60px', top: '-60px', width: '300px', height: '300px', background: `radial-gradient(circle, ${t.accent}30 0%, transparent 70%)` }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: t.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.75rem' }}>
                For restaurants
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                Grow your restaurant<br />with FoodFlow
              </h3>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px' }}>
                Join 500+ restaurants reaching thousands of hungry customers every day.
              </p>
            </div>
            <MagneticButton
              onClick={() => navigate('/restaurant')}
              ariaLabel="Partner with FoodFlow as a restaurant"
              className="ff-cta-button"
              style={{
                background: t.accent, color: '#FFFFFF',
                border: 'none', borderRadius: '14px',
                padding: '1rem 2.2rem', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                position: 'relative', zIndex: 1,
              }}
            >
              Partner with us <ArrowRight size={18} aria-hidden="true" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Global styles: animation, responsive grids, focus states */}
      <style>{`
        @keyframes ff-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .ff-sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }

        /* Visible keyboard focus everywhere */
        button:focus-visible, input:focus-visible, [role="button"]:focus-visible, a:focus-visible {
          outline: 2px solid ${t.accent};
          outline-offset: 2px;
        }

        ::-webkit-scrollbar { height: 0; width: 0; }

        /* Hero title scales fluidly across breakpoints */
        .ff-hero-title { font-size: clamp(2.6rem, 9vw, 7rem); }

        /* Floating preview cards: desktop only */
        .ff-hero-preview { display: flex; }
        @media (max-width: 1100px) {
          .ff-hero-preview { display: none !important; }
        }

        .ff-scroll-hint { display: flex; }
        @media (max-width: 640px) {
          .ff-scroll-hint { display: none; }
        }

        /* Category rail */
        .ff-categories::-webkit-scrollbar { display: none; }
        .ff-categories { scrollbar-width: none; }

        /* Bento grid */
        .ff-bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.25rem;
        }
        .ff-bento-feature { grid-column: span 7; grid-row: span 2; min-height: 0; }
        .ff-bento-deal { grid-column: span 5; }
        .ff-bento-taste { grid-column: span 5; }

        @media (max-width: 900px) {
          .ff-bento-grid { grid-template-columns: 1fr; gap: 1rem; }
          .ff-bento-feature, .ff-bento-deal, .ff-bento-taste { grid-column: 1 / -1; grid-row: auto; }
          .ff-bento-feature > div { min-height: 320px !important; }
        }

        /* Trending grid */
        .ff-trending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        @media (max-width: 560px) {
          .ff-trending-grid { grid-template-columns: 1fr; }
        }

        /* Section header (trending) */
        .ff-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0;
        }

        /* CTA banner layout */
        .ff-cta-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .ff-cta-button { flex-shrink: 0; }
        @media (max-width: 560px) {
          .ff-cta-banner { text-align: left; }
          .ff-cta-button { width: 100%; justify-content: center; }
        }

        /* Search bar: hide button label on very small screens */
        @media (max-width: 380px) {
          .ff-search-label { display: none; }
        }

        /* Plus banner stacks gracefully on tiny screens */
        @media (max-width: 420px) {
          .ff-plus-banner { flex-wrap: wrap; }
        }

        /* Stats row tightens on mobile */
        @media (max-width: 480px) {
          .ff-stats { gap: 1.5rem; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}