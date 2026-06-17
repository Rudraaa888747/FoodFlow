import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Wallet, Calendar, LogOut, ChevronRight,
  Activity, Star, Flame, TrendingUp, Plus, ArrowUpRight,
  CheckCircle2, Clock, RotateCcw, Utensils, ShoppingBag,
  MapPin, Gift, Zap, Edit2, User, Settings as SettingsIcon, CreditCard, Bell, Shield, Trash2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import OrderHistory from '../../components/customer/profile/OrderHistory';
import WalletSection from '../../components/customer/profile/WalletSection';
import BookingsSection from '../../components/customer/profile/BookingsSection';
import AccountSettings from '../../components/customer/profile/AccountSettings';

// ─── tiny sparkline bar chart ───────────────────────────────────────────────
function SparkBars({ data, color = '#FF4D2E' }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px' }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            flex: 1, background: color,
            borderRadius: '3px 3px 0 0',
            opacity: i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}



// ─── nav tab pill ────────────────────────────────────────────────────────────
function NavPill({ label, icon, active, onClick, badge }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.6rem 1.3rem',
        background: active ? '#111110' : 'transparent',
        color: active ? '#FFFFFF' : '#6B6B66',
        border: active ? 'none' : '1.5px solid #E8E7E4',
        borderRadius: '9999px',
        fontSize: '0.88rem', fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap', flexShrink: 0,
        position: 'relative',
      }}
    >
      <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      {label}
      {badge != null && badge > 0 && (
        <span style={{
          background: '#FF4D2E', color: '#fff',
          fontSize: '0.65rem', fontWeight: 800,
          borderRadius: '9999px', padding: '1px 6px',
          marginLeft: '2px',
        }}>{badge}</span>
      )}
    </motion.button>
  );
}

// ─── setting modal wrapper ───────────────────────────────────────────────────
function SettingModal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
        style={{ background: 'var(--bg-elevated)', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '2rem', position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: 0 }}>{title}</h3>
        {children}
      </motion.div>
    </div>
  );
}

// ─── toggle switch ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{ width: '44px', height: '24px', background: checked ? '#FF4D2E' : '#E8E7E4', borderRadius: '999px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
    >
      <div style={{ width: '20px', height: '20px', background: 'var(--bg-elevated)', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function Profile() {
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const orders = useStore(s => s.orders);
  const walletBalance = useStore(s => s.walletBalance);
  const addMoney = useStore(s => s.addMoney);
  const addToCart = useStore(s => s.addToCart);
  const tasteProfile = useStore(s => s.tasteProfile);
  const bookings = useStore(s => s.bookings);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const navigate = useNavigate();

  const [tab, setTab] = useState('orders');
  const [customAmt, setCustomAmt] = useState('');
  const [toast, setToast] = useState(null);
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(user?.name || '');

  // Settings State
  const [activeSettingModal, setActiveSettingModal] = useState(null);
  const [phoneVal, setPhoneVal] = useState('+91 98765 43210');
  const [emailVal, setEmailVal] = useState(user?.email || 'user@foodflow.com');
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: '123, Food Street, Bangalore' },
    { id: 2, type: 'Work', address: 'Tech Park, Block B, Bangalore' }
  ]);
  const [payments, setPayments] = useState([
    { id: 1, type: 'Card', details: 'Visa ending in 4242' },
    { id: 2, type: 'UPI', details: 'user@okaxis' }
  ]);
  const [notifications, setNotifications] = useState({ promo: true, push: true, sms: false });
  const [privacy, setPrivacy] = useState({ location: true, ads: false });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // Fake spending data for sparkline (last 7 weeks)
  const spendData = [420, 680, 310, 890, 560, 740, walletBalance > 0 ? 950 : 620];
  const safeOrders = orders || [];
  const totalSpent = safeOrders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = safeOrders.length ? (totalSpent / safeOrders.length) : 0;
  const savedAmt = Math.round(totalSpent * 0.08); // 8% cashback simulation

  // Cuisine tags from safeOrders
  const cuisineTags = tasteProfile?.favoriteCuisine
    ? [tasteProfile.favoriteCuisine, 'Biryani', 'Pizza'].slice(0, 3)
    : ['Biryani', 'Pizza', 'Burgers'];

  const foodPersonality = safeOrders.length > 10 ? '🔥 Power Foodie' :
    safeOrders.length > 4 ? '😋 Regular Explorer' : '🌱 New Taster';

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

  // ── not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-elevated)', borderRadius: '28px',
            padding: '3.5rem', textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            maxWidth: '380px', width: '90%',
          }}
        >
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: '#FFF1EE', margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Utensils size={32} color="#FF4D2E" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            Welcome to FoodFlow
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Log in to track orders, manage your wallet, and more.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => useStore.getState().login({ name: 'Demo User', email: 'demo@foodflow.com' })}
            style={{
              background: '#FF4D2E', color: '#FFFFFF',
              border: 'none', borderRadius: '14px',
              padding: '0.9rem 2.5rem', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', width: '100%',
            }}
          >
            Continue as Demo User
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── main layout ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'inherit' }}>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              background: toast.type === 'success' ? '#111110' : '#FF4D2E',
              color: '#FFFFFF', padding: '0.7rem 1.5rem',
              borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600,
              zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <Zap size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Hero Card ──────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid #F0EFEC' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem 2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '1.75rem', flexWrap: 'wrap' }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '84px', height: '84px', borderRadius: '24px',
                background: 'linear-gradient(135deg, #FF4D2E 0%, #FF8C42 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF',
                letterSpacing: '-0.02em',
                boxShadow: '0 8px 24px rgba(255,77,46,0.25)',
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
              </div>
              {/* Personality badge */}
              <div style={{
                position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                background: '#111110', color: '#FFFFFF',
                fontSize: '0.65rem', fontWeight: 700,
                padding: '3px 8px', borderRadius: '9999px',
                whiteSpace: 'nowrap', letterSpacing: '0.3px',
              }}>
                {foodPersonality}
              </div>
            </div>

            {/* Name + email */}
            <div style={{ flex: 1, paddingTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                {editName ? (
                  <input
                    autoFocus
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    onBlur={() => { setEditName(false); }}
                    onKeyDown={e => { if (e.key === 'Enter') setEditName(false); }}
                    style={{
                      fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)',
                      border: 'none', borderBottom: '2px solid #FF4D2E',
                      outline: 'none', background: 'transparent',
                      letterSpacing: '-0.04em', width: '220px',
                    }}
                  />
                ) : (
                  <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
                    {nameVal}
                  </h1>
                )}
                <button
                  onClick={() => setEditName(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0BFB9', padding: '4px' }}
                >
                  <Edit2 size={15} />
                </button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{user.email}</p>
              {/* Cuisine taste tags */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {cuisineTags.map(tag => (
                  <span key={tag} style={{
                    background: '#FFF1EE', color: '#CC3318',
                    fontSize: '0.75rem', fontWeight: 600,
                    padding: '3px 10px', borderRadius: '9999px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {[
                { label: 'Orders', value: safeOrders.length, icon: <ShoppingBag size={15} /> },
                { label: 'Saved', value: `₹${savedAmt}`, icon: <Gift size={15} /> },
                { label: 'Wallet', value: `₹${(walletBalance || 0).toFixed(0)}`, icon: <Wallet size={15} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  background: 'var(--bg-primary)', borderRadius: '14px',
                  padding: '0.75rem 1.1rem', textAlign: 'center', minWidth: '80px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {icon}
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Nav tabs ──────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '2rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
            <NavPill label="Orders" icon={<Package size={15} />} active={tab === 'orders'} onClick={() => setTab('orders')} badge={safeOrders.filter(o => o.status !== 'Delivered').length} />
            <NavPill label="Wallet" icon={<Wallet size={15} />} active={tab === 'wallet'} onClick={() => setTab('wallet')} />
            <NavPill label="Bookings" icon={<Calendar size={15} />} active={tab === 'bookings'} onClick={() => setTab('bookings')} />
            <NavPill label="Settings" icon={<SettingsIcon size={15} />} active={tab === 'settings'} onClick={() => setTab('settings')} />

            {/* Logout pushed right */}
            <div style={{ flex: 1 }} />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { logout(); navigate('/landing'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'transparent', border: '1.5px solid #F0EFEC',
                color: '#C0392B', borderRadius: '9999px',
                padding: '0.6rem 1.1rem', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <LogOut size={14} /> Log out
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>
        <AnimatePresence mode="wait">

          {/* ════ ORDERS ════════════════════════════════════════════════════ */}
          {tab === 'orders' && (
            <OrderHistory orders={safeOrders} addToCart={addToCart} showToast={showToast} updateOrderStatus={useStore.getState().updateOrderStatus} />
          )}

          {/* ════ WALLET ════════════════════════════════════════════════════ */}
          {tab === 'wallet' && (
            <WalletSection walletBalance={walletBalance} addMoney={addMoney} showToast={showToast} savedAmt={savedAmt} />
          )}

          {/* ════ BOOKINGS ══════════════════════════════════════════════════ */}
          {tab === 'bookings' && (
            <BookingsSection bookings={bookings} />
          )}

          {/* ════ SETTINGS ══════════════════════════════════════════════════ */}
          {tab === 'settings' && (
            <motion.div key="settings" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }} className="mobile-settings-center">
              <AccountSettings user={user} setActiveSettingModal={setActiveSettingModal} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button onClick={() => setActiveSettingModal('delete')} aria-label="Delete Account" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FF4D2E', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Settings Modals ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSettingModal === 'account' && (
          <SettingModal title="Account Details" onClose={() => setActiveSettingModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone Number</label>
                <input value={phoneVal} onChange={e => setPhoneVal(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E8E7E4', fontSize: '1rem', marginTop: '0.4rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
                <input value={emailVal} onChange={e => setEmailVal(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E8E7E4', fontSize: '1rem', marginTop: '0.4rem', outline: 'none' }} />
              </div>
              <button onClick={() => { showToast('Account updated!'); setActiveSettingModal(null); }} style={{ marginTop: '1rem', background: '#111110', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                Save Changes
              </button>
            </div>
          </SettingModal>
        )}

        {activeSettingModal === 'addresses' && (
          <SettingModal title="Manage Addresses" onClose={() => setActiveSettingModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addresses.map(addr => (
                <div key={addr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F0EFEC', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <MapPin size={20} color="#FF4D2E" />
                    <div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem' }}>{addr.type}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{addr.address}</p>
                    </div>
                  </div>
                  <button onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0BFB9' }}><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => showToast(' Address addition is coming soon!', 'info')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-primary)', border: '1.5px dashed #E8E7E4', padding: '1rem', borderRadius: '12px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', marginTop: '0.5rem' }}>
                <Plus size={16} /> Add New Address
              </button>
            </div>
          </SettingModal>
        )}

        {activeSettingModal === 'payments' && (
          <SettingModal title="Payment Methods" onClose={() => setActiveSettingModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {payments.map(pay => (
                <div key={pay.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F0EFEC', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <CreditCard size={20} color="#FF4D2E" />
                    <div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem' }}>{pay.type}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{pay.details}</p>
                    </div>
                  </div>
                  <button onClick={() => setPayments(payments.filter(p => p.id !== pay.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0BFB9' }}><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => showToast(' Payment methods coming soon!', 'info')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-primary)', border: '1.5px dashed #E8E7E4', padding: '1rem', borderRadius: '12px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', marginTop: '0.5rem' }}>
                <Plus size={16} /> Add Payment Method
              </button>
            </div>
          </SettingModal>
        )}

        {activeSettingModal === 'notifications' && (
          <SettingModal title="Notifications" onClose={() => setActiveSettingModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>Order Updates (Push)</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time updates on your active orders</p>
                </div>
                <Toggle checked={notifications.push} onChange={v => setNotifications({ ...notifications, push: v })} />
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>Promotional Emails</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive offers and discounts via email</p>
                </div>
                <Toggle checked={notifications.promo} onChange={v => setNotifications({ ...notifications, promo: v })} />
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>SMS Offers</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Get limited time flash sales via SMS</p>
                </div>
                <Toggle checked={notifications.sms} onChange={v => setNotifications({ ...notifications, sms: v })} />
              </div>
            </div>
          </SettingModal>
        )}

        {activeSettingModal === 'privacy' && (
          <SettingModal title="Privacy & Security" onClose={() => setActiveSettingModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>Location Data</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Share location for accurate delivery fees</p>
                </div>
                <Toggle checked={privacy.location} onChange={v => setPrivacy({ ...privacy, location: v })} />
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>Personalized Ads</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allow tailored restaurant recommendations</p>
                </div>
                <Toggle checked={privacy.ads} onChange={v => setPrivacy({ ...privacy, ads: v })} />
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)', marginBottom: '0.5rem' }} />
              <button onClick={() => { showToast('Logged out of all devices'); setActiveSettingModal(null); }} style={{ width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid #E8E7E4', padding: '0.9rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                Log out of all devices
              </button>
            </div>
          </SettingModal>
        )}

        {activeSettingModal === 'delete' && (
          <SettingModal title="Delete Account" onClose={() => setActiveSettingModal(null)}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: '#FFF1EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Trash2 size={28} color="#FF4D2E" />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>Are you absolutely sure?</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 2rem' }}>
                This action cannot be undone. All your orders, saved addresses, and wallet balance (₹{walletBalance}) will be permanently lost.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setActiveSettingModal(null)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid #E8E7E4', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { logout(); navigate('/landing'); }} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: '#FF4D2E', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </SettingModal>
        )}
      </AnimatePresence>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { display: none; }
        
        @media (max-width: 768px) {
          .mobile-settings-center {
            margin: 0 auto;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .mobile-settings-center > * {
            width: 100%;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
}