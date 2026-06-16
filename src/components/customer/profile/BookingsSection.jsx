import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Flame, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── booking status pill ─────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Delivered: { bg: '#ECFDF5', color: '#059669', icon: <CheckCircle2 size={12} /> },
    Preparing: { bg: '#FFF7ED', color: '#EA580C', icon: <Flame size={12} /> },
    'Out For Delivery': { bg: '#EFF6FF', color: '#2563EB', icon: <Activity size={12} /> },
    Ready: { bg: '#fef08a', color: '#854d0e', icon: <CheckCircle2 size={12} /> },
    Confirmed: { bg: '#e0e7ff', color: '#3730a3', icon: <CheckCircle2 size={12} /> },
    Pending: { bg: '#F3F4F6', color: '#6B7280', icon: <Clock size={12} /> },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: s.bg, color: s.color,
      fontSize: '0.72rem', fontWeight: 700,
      padding: '3px 10px', borderRadius: '9999px',
      letterSpacing: '0.3px',
    }}>
      {s.icon} {status}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function BookingsSection({ bookings }) {
  const navigate = useNavigate();

  if (!bookings || bookings.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        style={{
          background: 'var(--bg-elevated)', borderRadius: '24px',
          padding: '4.5rem 2rem', textAlign: 'center',
          border: '1.5px dashed #E8E7E4',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🪑</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No table bookings yet</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Find a restaurant and reserve a table — it takes 10 seconds.</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/customer/search')}
          aria-label="Find restaurants for table booking"
          style={{
            background: '#111110', color: '#FFFFFF',
            border: 'none', borderRadius: '12px',
            padding: '0.8rem 2rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Find restaurants
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div key="bookings" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.map((booking) => (
          <motion.article
            key={booking.id}
            variants={fadeUp}
            whileHover={{ y: -2 }}
            aria-label={`Booking ${booking.id} at ${booking.restaurantName}, ${booking.date} at ${booking.time} for ${booking.guests} guests`}
            style={{
              background: 'var(--bg-elevated)', borderRadius: '20px',
              padding: '1.5rem', border: '1px solid #F0EFEC',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Booking #{booking.id}</span>
                  <StatusPill status={booking.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <Clock size={12} />
                  Requested on {new Date(booking.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-primary)', borderRadius: '12px',
              padding: '0.9rem 1.1rem',
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: '#3C3C38', fontWeight: 600 }}>Restaurant</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800 }}>{booking.restaurantName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: '#3C3C38', fontWeight: 600 }}>Date & Time</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800 }}>{booking.date} at {booking.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: '#3C3C38', fontWeight: 600 }}>Guests</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800 }}>{booking.guests} People</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
