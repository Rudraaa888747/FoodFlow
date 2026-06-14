import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Tag, ArrowRight, ShoppingBag, ChevronRight, Bike, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Quantity stepper ────────────────────────────────────────────────────────
function Stepper({ value, onInc, onDec }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--bg-primary)', borderRadius: '12px',
      border: '1.5px solid #ECEAE6', overflow: 'hidden',
    }}>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onDec}
        style={{ width: '34px', height: '34px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B66', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Minus size={13} strokeWidth={2.5} />
      </motion.button>
      <AnimatePresence mode="wait">
        <motion.span key={value}
          initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ minWidth: '26px', textAlign: 'center', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}
        </motion.span>
      </AnimatePresence>
      <motion.button whileTap={{ scale: 0.85 }} onClick={onInc}
        style={{ width: '34px', height: '34px', background: 'none', border: 'none', cursor: 'pointer', color: '#FF4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={13} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}

// ─── Coupon codes ────────────────────────────────────────────────────────────
const COUPONS = {
  FOODFLOW50: { discount: 50, label: 'Flat ₹50 off' },
  BINGE150: { discount: 150, label: 'Flat ₹150 off', minOrder: 499 },
  WELCOME100: { discount: 100, label: '₹100 welcome offer' },
};

export default function Cart() {
  const cart = useStore(state => state.cart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const navigate = useNavigate();

  // Route Prefetching
  useEffect(() => {
    import('./Checkout');
  }, []);

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setApplied] = useState(null);
  const [couponError, setCouponErr] = useState('');
  const [couponFocused, setFocused] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? (subtotal > 499 ? 0 : 49) : 0;
  const taxes = Math.round(subtotal * 0.05);
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + deliveryFee + taxes - discount;

  const handleApply = () => {
    const code = coupon.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) { setCouponErr('Invalid code. Try FOODFLOW50'); setApplied(null); return; }
    if (found.minOrder && subtotal < found.minOrder) { setCouponErr(`Min order ₹${found.minOrder} required`); setApplied(null); return; }
    setApplied({ code, ...found });
    setCouponErr('');
    setCoupon('');
  };

  const removeCoupon = () => { setApplied(null); setCouponErr(''); };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '80vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: '380px' }}
        >
          {/* Bag illustration */}
          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '100px', height: '100px', borderRadius: '28px',
              background: '#FFF1EE', margin: '0 auto 2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 16px 40px rgba(255,77,46,0.12)',
            }}
          >
            <ShoppingBag size={44} color="#FF4D2E" strokeWidth={1.5} />
          </motion.div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
            Your cart is empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/customer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#FF4D2E', color: '#FFFFFF',
              borderRadius: '14px', padding: '0.9rem 2rem',
              fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(255,77,46,0.25)',
            }}>
              Browse restaurants <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Main cart ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '3rem 0 6rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.75rem' }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.3rem' }}>
            Your cart
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {cart.length} item{cart.length !== 1 ? 's' : ''} · {cart[0]?.restaurantName || ''}
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── LEFT: Cart items ─────────────────────────────────────────── */}
          <div style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 0 }}>
            <AnimatePresence>
              {cart.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 22, delay: idx * 0.04 }}
                  style={{
                    background: 'var(--bg-elevated)', borderRadius: '20px',
                    border: '1px solid #F0EFEC',
                    padding: '1.25rem',
                    display: 'flex', gap: '1rem', alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '76px', height: '76px', flexShrink: 0,
                    borderRadius: '14px', overflow: 'hidden',
                    background: 'var(--bg-primary)',
                  }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🍽️</div>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', fontWeight: 500 }}>
                      {item.restaurantName}
                    </p>
                    <p style={{ fontSize: '1rem', fontWeight: 800, color: '#FF4D2E', letterSpacing: '-0.02em' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <Stepper
                      value={item.quantity}
                      onInc={() => updateQuantity(item.id, item.quantity + 1)}
                      onDec={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1, background: '#FFE4E4' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: '#FFF1EE', border: 'none', cursor: 'pointer',
                        color: '#CC3318', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.15s',
                      }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Delivery perks strip */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              style={{
                background: '#ECFDF5', borderRadius: '16px',
                border: '1px solid #A7F3D0',
                padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}
            >
              <Bike size={18} color="#059669" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#065F46' }}>
                {subtotal > 499
                  ? '🎉 Free delivery unlocked on this order!'
                  : `Add ₹${499 - subtotal} more for free delivery`}
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT: Order summary ──────────────────────────────────────── */}
          <motion.div
            className="cart-right-panel"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ flex: '0 1 340px', position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >

            {/* Summary card */}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: '24px',
              border: '1px solid #F0EFEC',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                Order summary
              </h2>

              {/* Coupon input */}
              <AnimatePresence mode="wait">
                {appliedCoupon ? (
                  <motion.div
                    key="applied"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{
                      background: '#ECFDF5', border: '1.5px solid #A7F3D0',
                      borderRadius: '12px', padding: '0.75rem 1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Tag size={14} color="#059669" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065F46' }}>
                        {appliedCoupon.code} — {appliedCoupon.label}
                      </span>
                    </div>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--bg-primary)',
                      border: `1.5px solid ${couponFocused ? '#FF4D2E' : '#ECEAE6'}`,
                      borderRadius: '12px', padding: '0.5rem 0.5rem 0.5rem 0.9rem',
                      marginBottom: couponError ? '0.4rem' : '1.25rem',
                      transition: 'border-color 0.2s',
                    }}>
                      <Tag size={14} color={couponFocused ? '#FF4D2E' : '#9B9B96'} style={{ flexShrink: 0 }} />
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={e => e.key === 'Enter' && handleApply()}
                        placeholder="Enter coupon code"
                        style={{
                          flex: 1, background: 'transparent', border: 'none', outline: 'none',
                          fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600,
                          letterSpacing: '0.5px',
                        }}
                      />
                      <button
                        onClick={handleApply}
                        style={{
                          background: coupon ? '#111110' : '#E8E7E4',
                          color: coupon ? '#FFFFFF' : '#9B9B96',
                          border: 'none', borderRadius: '8px',
                          padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 700,
                          cursor: coupon ? 'pointer' : 'default',
                          transition: 'all 0.2s', flexShrink: 0,
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    <AnimatePresence>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{ fontSize: '0.75rem', color: '#CC3318', fontWeight: 600, marginBottom: '1.25rem', paddingLeft: '0.2rem' }}
                        >
                          {couponError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Item total', value: `₹${subtotal.toFixed(0)}` },
                  { label: 'Delivery fee', value: deliveryFee === 0 ? '🎉 FREE' : `₹${deliveryFee}`, green: deliveryFee === 0 },
                  { label: 'Taxes & charges (5% GST)', value: `₹${taxes.toFixed(0)}` },
                  ...(discount > 0 ? [{ label: `Coupon (${appliedCoupon?.code})`, value: `-₹${discount}`, green: true }] : []),
                ].map(({ label, value, green }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: green ? '#059669' : '#3C3C38' }}>{value}</span>
                  </div>
                ))}

                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.25rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>To pay</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                    ₹{total.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="cart-checkout-cta-wrapper">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/customer/checkout', { state: { total } })}
                  className="cart-checkout-btn"
                  style={{
                    width: '100%', background: '#FF4D2E', color: '#FFFFFF',
                    border: 'none', borderRadius: '14px',
                    padding: '1rem', marginTop: '1.5rem',
                    fontSize: '0.95rem', fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: '0 8px 20px rgba(255,77,46,0.28)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <span className="cart-checkout-total" style={{ display: 'none' }}>₹{total.toFixed(0)} • </span>
                  Proceed to checkout <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>

            {/* Trust signals */}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: '18px',
              border: '1px solid #F0EFEC',
              padding: '1.1rem 1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.65rem',
            }}>
              {[
                { icon: <Shield size={14} color="#059669" />, text: 'Secure payment — SSL encrypted' },
                { icon: <Clock size={14} color="#2563EB" />, text: '30–45 min estimated delivery' },
                { icon: <Bike size={14} color="#7C3AED" />, text: 'Live GPS tracking on delivery' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {icon}
                  <span style={{ fontSize: '0.78rem', color: '#6B6B66', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Suggested coupon chips */}
            {!appliedCoupon && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Available offers
                </p>
                {Object.entries(COUPONS).map(([code, info]) => (
                  <motion.button
                    key={code}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setCoupon(code); handleApply(); setCoupon(''); }}
                    style={{
                      background: 'var(--bg-elevated)', border: '1.5px dashed #E8E7E4',
                      borderRadius: '12px', padding: '0.75rem 1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#FF4D2E'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#E8E7E4'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#CC3318', letterSpacing: '1px', background: '#FFF1EE', padding: '2px 8px', borderRadius: '6px' }}>
                        {code}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#6B6B66', fontWeight: 500 }}>{info.label}</span>
                    </div>
                    <ChevronRight size={14} color="#C0BFB9" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}