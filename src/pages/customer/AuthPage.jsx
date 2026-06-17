import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Floating label input ────────────────────────────────────────────────────
function FloatingInput({ label, type: initialType, value, onChange, icon: Icon, required }) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = initialType === 'password';
  const type = isPassword && showPw ? 'text' : initialType;
  const lifted = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
      {/* Label */}
      <motion.label
        animate={{ top: lifted ? '9px' : '50%', fontSize: lifted ? '0.68rem' : '0.95rem', color: focused ? '#FF4D2E' : '#A0A09A' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          position: 'absolute', left: '48px',
          transform: 'translateY(-50%)',
          fontWeight: 600, pointerEvents: 'none',
          letterSpacing: lifted ? '0.5px' : '0',
          textTransform: lifted ? 'uppercase' : 'none',
          zIndex: 2,
        }}
      >
        {label}
      </motion.label>

      {/* Icon */}
      <div style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        color: focused ? '#FF4D2E' : '#C0BFB9',
        transition: 'color 0.2s', zIndex: 2,
        display: 'flex', alignItems: 'center',
      }}>
        <Icon size={18} />
      </div>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: focused ? '#FFFFFF' : '#F7F6F4',
          border: `1.5px solid ${focused ? '#FF4D2E' : '#ECEAE6'}`,
          borderRadius: '14px',
          padding: '1.55rem 3rem 0.55rem 48px',
          fontSize: '0.95rem', fontWeight: 500,
          color: 'var(--text-primary)', outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: focused ? '0 0 0 4px rgba(255,77,46,0.08)' : 'none',
        }}
      />

      {/* Show/hide password toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPw(v => !v)}
          style={{
            position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#A0A09A', padding: '4px', display: 'flex', alignItems: 'center',
          }}
        >
          {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}

// ─── Scrolling food ticker ───────────────────────────────────────────────────
const FOOD_ITEMS = [
  { emoji: '🍛', name: 'Chicken Biryani' },
  { emoji: '🍕', name: 'Margherita Pizza' },
  { emoji: '🍔', name: 'Smash Burger' },
  { emoji: '🥘', name: 'Dal Makhani' },
  { emoji: '🍣', name: 'Salmon Sushi' },
  { emoji: '🌮', name: 'Street Tacos' },
  { emoji: '🍜', name: 'Ramen Bowl' },
  { emoji: '🧆', name: 'Falafel Wrap' },
  { emoji: '🥗', name: 'Caesar Salad' },
  { emoji: '🍰', name: 'Gulab Jamun' },
];

function FoodTicker({ reverse = false }) {
  const doubled = [...FOOD_ITEMS, ...FOOD_ITEMS];
  return (
    <div style={{ overflow: 'hidden', width: '100%', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
      <motion.div
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '1rem', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Social proof avatars ────────────────────────────────────────────────────
const AVATARS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useStore(s => s.login);
  const registerUser = useStore(s => s.registerUser);
  const verifyUser = useStore(s => s.verifyUser);
  const user = useStore(s => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/landing');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { toast.error('Please fill in all fields.'); return; }
    if (!isLogin && !name) { toast.error('Please enter your name.'); return; }

    const normEmail = email.trim().toLowerCase();

    setLoading(true);
    setTimeout(async () => {
      if (isLogin) {
        // Sign In logic
        const res = await verifyUser(normEmail, password);
        if (res.success) {
          toast.success('Welcome back!');
          login(res.user, res.token);
          navigate('/landing');
        } else {
          toast.error(res.error || 'Invalid email or password.');
          setError(res.error || 'Invalid email or password.');
          setLoading(false);
        }
      } else {
        // Sign Up logic
        const newUser = { name, email: normEmail, password, role: 'customer' };
        const res = await registerUser(newUser);
        if (res.success) {
          toast.success('Account created successfully!');
          login(res.user, res.token);
          navigate('/landing');
        } else {
          toast.error(res.error || 'Failed to register.');
          setError(res.error || 'Failed to register.');
          setLoading(false);
        }
      }
    }, 900);
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError('');
    setEmail(''); setPassword(''); setName('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-elevated)', overflow: 'hidden' }}>

      {/* ── LEFT: Dark Brand Panel ─────────────────────────────────────── */}
      <div
        className="auth-left"
        style={{
          width: '50%', background: '#080808',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem 0 3rem',
          position: 'relative', overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Coral glow */}
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(255,77,46,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(255,77,46,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 3rem' }}
        >
          <img src="/logo.png" alt="FoodFlow Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em' }}>FOODFLOW</span>
        </motion.div>

        {/* Center headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: '0 3rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '1.75rem',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', display: 'block', boxShadow: '0 0 6px #4ADE80' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>
              500+ restaurants live
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
            fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.1, letterSpacing: '-0.04em',
            marginBottom: '1.25rem',
          }}>
            Your city's best<br />food, delivered<br />
            <span style={{ WebkitTextStroke: '1.5px #FF4D2E', color: 'transparent' }}>in minutes.</span>
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '340px' }}>
            Order from top-rated restaurants, track delivery live, and earn cashback on every bite.
          </p>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex' }}>
              {AVATARS.map((bg, i) => (
                <div key={i} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: bg, border: '2px solid #080808',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700, color: '#FFFFFF',
                }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>2M+ happy foodies</div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ fontSize: '0.7rem', color: '#FF4D2E' }}>★</span>
                ))}
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>4.8 avg rating</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Food tickers bottom */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <FoodTicker reverse={false} />
          <FoodTicker reverse={true} />
        </motion.div>
      </div>

      {/* ── RIGHT: Form Panel ──────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '2rem',
        background: 'var(--bg-elevated)',
        position: 'relative',
      }}>

        {/* Top-right switch link */}
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account?" : 'Already have one?'}
          </span>
          <button
            onClick={switchMode}
            style={{
              background: 'none', border: 'none',
              color: '#FF4D2E', fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', padding: 0,
              textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: '400px' }}
        >

          {/* Heading */}
          <div style={{ marginBottom: '2.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.4rem' }}
              >
                {isLogin ? 'Welcome back 👋' : 'Create account'}
              </motion.h2>
            </AnimatePresence>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isLogin
                ? 'Sign in to your FoodFlow account.'
                : 'Join 2M+ foodies ordering smarter.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FloatingInput label="Full name" type="text" value={name} onChange={e => setName(e.target.value)} icon={User} required={!isLogin} />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={Mail} required />
            <FloatingInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={Lock} required />

            {/* Forgot password */}
            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-0.25rem' }}>
                <button type="button" onClick={() => toast(' Password reset coming soon!', { icon: '🔐' })} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500 }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: '#FFF1EE', border: '1px solid #FFD5CC',
                    color: '#CC3318', borderRadius: '10px',
                    padding: '0.65rem 1rem', fontSize: '0.82rem', fontWeight: 600,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              disabled={loading}
              style={{
                background: loading ? '#E8E7E4' : '#FF4D2E',
                color: loading ? '#9B9B96' : '#FFFFFF',
                border: 'none', borderRadius: '14px',
                padding: '1rem', fontSize: '0.98rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'background 0.2s',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(255,77,46,0.25)',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '18px', height: '18px', border: '2.5px solid #C0BFB9', borderTopColor: '#888', borderRadius: '50%' }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ECEAE6' }} />
            <span style={{ fontSize: '0.8rem', color: '#C0BFB9', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#ECEAE6' }} />
          </div>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.02, borderColor: '#D0CFCB' }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => { toast(' Google login is coming soon!'); }}
            style={{
              width: '100%', background: 'var(--bg-elevated)',
              border: '1.5px solid #ECEAE6', borderRadius: '14px',
              padding: '0.9rem', fontSize: '0.92rem', fontWeight: 600,
              cursor: 'pointer', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Google icon SVG inline */}
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </motion.button>

          {/* Benefits strip (signup only) */}
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{ overflow: 'hidden', marginTop: '1.5rem' }}
              >
                <div style={{
                  background: 'var(--bg-primary)', borderRadius: '14px', padding: '1.1rem 1.3rem',
                  display: 'flex', flexDirection: 'column', gap: '0.55rem',
                }}>
                  {[
                    '₹100 off on your first order',
                    'Live order tracking',
                    'Cashback on every order',
                  ].map(benefit => (
                    <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={15} color="#059669" />
                      <span style={{ fontSize: '0.82rem', color: '#3C3C38', fontWeight: 500 }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.75rem', color: '#C0BFB9', lineHeight: 1.6 }}>
            By continuing, you agree to FoodFlow's{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); toast(' Terms coming soon!'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms</a>
            {' & '}
            <a href="#" onClick={(e) => { e.preventDefault(); toast(' Privacy Policy coming soon!'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy Policy</a>.
          </p>
        </motion.div>
      </div>

      {/* Responsive: hide left panel on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left { display: none !important; }
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #F7F6F4 inset;
          -webkit-text-fill-color: #111110;
        }
      `}</style>
    </div>
  );
}