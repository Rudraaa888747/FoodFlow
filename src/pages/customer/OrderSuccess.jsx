import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  MapPin,
  Clock,
  ShoppingCart,
  Map,
  CreditCard,
  ShoppingBag,
  ChefHat,
  Bike,
  Home,
  Store,
} from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  green: '#10b981',
  greenDark: '#059669',
  greenGlow: 'rgba(16,185,129,0.15)',
  navy: '#0f172a',
  navyHover: '#1e293b',
  amber: '#f59e0b',
  indigo: '#6366f1',
  red: '#ef4444',
  bg: '#F8FAFC',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  border: '#e2e8f0',
  borderDashed: '#cbd5e1',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
};

// ─── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF6B35', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'];

function Confetti() {
  const pieces = Array.from({ length: 52 }, (_, i) => {
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const isCircle = Math.random() > 0.66;
    const size = 6 + Math.random() * 8;
    return {
      id: i,
      color,
      isCircle,
      size,
      left: Math.random() * 100,
      delay: Math.random() * 1.8,
      duration: 1.8 + Math.random() * 1.5,
      rotate: Math.random() * 720,
    };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -12, opacity: 1, rotate: 0 }}
          animate={{ y: 440, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.isCircle ? p.size : p.size,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : 2,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Confirmed', icon: Check, done: true, active: false },
  { label: 'Preparing', icon: ChefHat, done: false, active: true },
  { label: 'On the way', icon: Bike, done: false, active: false },
  { label: 'Delivered', icon: Home, done: false, active: false },
];

function ProgressSteps() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: '1.5rem' }}>
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Connector line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                top: 12,
                left: 'calc(50% + 14px)',
                right: 'calc(-50% + 14px)',
                height: 1.5,
                background: T.border,
              }} />
            )}
            {/* Dot */}
            <motion.div
              animate={step.active ? { scale: [1, 1.12, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: step.done || step.active ? T.green : T.surfaceMuted,
                border: step.done || step.active ? 'none' : `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Icon size={12} color={step.done || step.active ? '#fff' : T.textTertiary} strokeWidth={2.5} />
            </motion.div>
            {/* Label */}
            <span style={{
              fontSize: '0.68rem',
              color: step.active ? T.green : T.textTertiary,
              fontWeight: step.active ? 600 : 400,
              textAlign: 'center',
              marginTop: 4,
              maxWidth: 60,
              lineHeight: 1.3,
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Receipt Row ──────────────────────────────────────────────────────────────
function ReceiptCell({ icon: Icon, iconColor, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: T.surface, border: `0.5px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={15} color={iconColor} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.72rem', color: T.textTertiary }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: '0.82rem', fontWeight: 600, color: T.textPrimary, lineHeight: 1.3 }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orders = useStore((state) => state.orders);
  const [countdown, setCountdown] = useState(8);
  const [showConfetti, setShowConfetti] = useState(true);

  const activeOrder = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    // Hide confetti after animation
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4500);

    // Auto-redirect countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(`/customer/orders/${orderId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(confettiTimer);
    };
  }, [navigate, orderId]);

  if (!activeOrder) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg }}>
        <p style={{ color: T.textSecondary }}>Loading order details...</p>
      </div>
    );
  }

  const itemsCount = (activeOrder.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Confetti burst */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        style={{
          background: T.surface,
          borderRadius: 24,
          border: `0.5px solid ${T.border}`,
          padding: '2.5rem 2rem 2rem',
          maxWidth: 460,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Check Icon ── */}
        <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ping ring */}
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px solid rgba(16,185,129,0.5)`,
            }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 14, stiffness: 260 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `linear-gradient(145deg, ${T.green}, ${T.greenDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px -4px rgba(16,185,129,0.45)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', damping: 14 }}
            >
              <Check size={34} color="#fff" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '1.6rem', fontWeight: 900, color: T.textPrimary, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}
        >
          Order confirmed! 🎉
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ textAlign: 'center', marginBottom: '0.75rem' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: T.surfaceMuted, border: `0.5px solid ${T.border}`,
            borderRadius: 99, padding: '4px 12px',
            fontSize: '0.82rem', fontWeight: 600, color: T.textPrimary,
          }}>
            <Store size={14} color={T.green} />
            {activeOrder.restaurantName}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '0.9rem', color: T.textSecondary, textAlign: 'center', lineHeight: 1.55, marginBottom: '1.75rem' }}
        >
          Your food is being prepared with love. Sit tight, it's on its way!
        </motion.p>

        {/* ── Progress Steps ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ProgressSteps />
        </motion.div>

        {/* ── Receipt Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            background: T.surfaceMuted, borderRadius: 16,
            border: `0.5px solid ${T.border}`,
            overflow: 'hidden', marginBottom: '1.5rem',
          }}
        >
          {/* Top row — Order ID + Amount */}
          <div style={{ padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order ID</p>
              <p style={{ margin: '3px 0 0', fontSize: '0.9rem', fontWeight: 800, color: T.textPrimary }}>#{activeOrder.id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Amount paid</p>
              <p style={{ margin: '3px 0 0', fontSize: '1.15rem', fontWeight: 800, color: T.green }}>₹{activeOrder.total}</p>
            </div>
          </div>

          {/* Dashed divider */}
          <div style={{ borderTop: `1.5px dashed ${T.borderDashed}`, margin: '0 1.25rem' }} />

          {/* 3-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1rem 1.25rem', gap: '0.75rem' }}>
            <ReceiptCell icon={ShoppingBag} iconColor={T.green} label="Items" value={`${itemsCount} items`} />
            <ReceiptCell icon={Clock} iconColor={T.amber} label="ETA" value="~35 mins" />
            <ReceiptCell icon={CreditCard} iconColor={T.indigo} label="Payment" value={activeOrder.paymentMethod || 'UPI'} />
          </div>

          {/* Solid divider */}
          <div style={{ borderTop: `0.5px solid ${T.border}`, margin: '0 1.25rem' }} />

          {/* Delivery address */}
          <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: T.surface, border: `0.5px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={15} color={T.red} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: T.textTertiary }}>Delivering to</p>
              <p style={{
                margin: '2px 0 0', fontSize: '0.82rem', fontWeight: 600,
                color: T.textPrimary, lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {activeOrder.deliveryAddress}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/customer/orders/${orderId}`)}
            style={{
              width: '100%', padding: '1rem',
              background: T.navy, color: '#fff',
              border: 'none', borderRadius: 14,
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              fontFamily: 'inherit',
            }}
          >
            <Map size={17} />
            <span>Track order live</span>
            <span style={{
              fontSize: '0.75rem', background: 'rgba(255,255,255,0.18)',
              padding: '2px 9px', borderRadius: 99,
            }}>
              Auto in {countdown}s
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/customer')}
            style={{
              width: '100%', marginTop: '0.6rem', padding: '0.9rem',
              background: 'transparent', color: T.textPrimary,
              border: `0.5px solid ${T.border}`, borderRadius: 14,
              fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            <ShoppingCart size={16} />
            Continue shopping
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}