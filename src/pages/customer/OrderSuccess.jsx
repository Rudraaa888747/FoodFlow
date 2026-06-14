import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { Check, Package, MapPin, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orders = useStore(state => state.orders);
  
  const [countdown, setCountdown] = useState(8);

  const activeOrder = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    // Fire premium confetti
    const end = Date.now() + 1.5 * 1000;
    const colors = ['#FF6B35', '#10b981', '#f59e0b', '#6366f1'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/customer/orders/${orderId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, orderId]);

  if (!activeOrder) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  const itemsCount = (activeOrder.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F8FAFC', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
          border: '1px solid var(--glass-border)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background glow */}
        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)', borderRadius: '50%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            style={{
              width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Check size={40} color="#fff" strokeWidth={3} />
          </motion.div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Order Confirmed!
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Thank you for your order from <strong style={{ color: '#0f172a' }}>{activeOrder.restaurantName}</strong>. Your food is being prepared.
          </p>

          {/* Order Details Card */}
          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #cbd5e1' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>#{activeOrder.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount Paid</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>₹{activeOrder.total}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Package size={16} color="#64748b" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Items</p>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{itemsCount} Items</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Clock size={16} color="#64748b" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>ETA</p>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>~35 mins</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <MapPin size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Delivering to</p>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {activeOrder.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/customer/orders/${orderId}`)}
              style={{
                width: '100%', padding: '1.1rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden'
              }}
            >
              <span>Track Order Live</span>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                Auto in {countdown}s
              </span>
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/customer')}
              style={{
                width: '100%', padding: '1.1rem', background: '#fff', color: '#0f172a', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </motion.button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
