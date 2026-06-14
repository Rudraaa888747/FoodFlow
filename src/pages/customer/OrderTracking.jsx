import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, MapPin, Phone, ChefHat, Bike, CheckCircle2,
  Package, Star, ArrowLeft, MessageCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

/* ── palette / tokens ───────────────────────────────────────────── */
const C = {
  bg: '#f8fafc',
  surface: '#ffffff',
  border: 'var(--glass-border)',
  borderLight: 'var(--bg-tertiary)',
  ink: '#0f172a',
  muted: '#64748b',
  hint: '#94a3b8',
  green: '#10b981',
  greenBg: '#ecfdf5',
  greenBorder: '#a7f3d0',
  amber: '#f59e0b',
  amberBg: '#fffbeb',
  indigo: '#6366f1',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.08)',
};

/* ── step config ─────────────────────────────────────────────────── */
const STEPS = [
  { status: 'Pending', icon: Package, label: 'Order placed', sub: 'Awaiting restaurant confirmation' },
  { status: 'Confirmed', icon: CheckCircle2, label: 'Confirmed', sub: 'Restaurant accepted your order' },
  { status: 'Preparing', icon: ChefHat, label: 'Preparing', sub: 'Your food is being prepared' },
  { status: 'Ready', icon: CheckCircle2, label: 'Ready', sub: 'Awaiting delivery partner' },
  { status: 'Out For Delivery', icon: Bike, label: 'Out for delivery', sub: 'Driver is on the way to you' },
  { status: 'Delivered', icon: CheckCircle2, label: 'Delivered', sub: 'Enjoy your meal!' },
];

/* ── ETA ticker ──────────────────────────────────────────────────── */
function useEtaTicker(initial = 28) {
  const [eta, setEta] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setEta(v => Math.max(0, v - 1)), 60000);
    return () => clearInterval(t);
  }, []);
  return eta;
}

function OrderTrackingContent() {
  const orders = useStore(s => s.orders);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const eta = useEtaTicker(35);

  const activeOrder = orderId ? orders.find(o => o.id === orderId) : orders[0];

  /* empty state */
  if (!activeOrder) return (
    <div style={{ paddingTop: '7rem', minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Package size={32} color={C.hint} />
      </div>
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: C.ink, marginBottom: '0.4rem' }}>No active orders</h2>
        <p style={{ color: C.muted, fontSize: '0.9rem' }}>Looks like you haven't ordered anything yet.</p>
      </div>
      <button onClick={() => navigate('/customer/search')}
        style={{ background: C.ink, color: '#fff', border: 'none', borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
        Order food
      </button>
    </div>
  );

  const currentStep = Math.max(0, STEPS.findIndex(s => s.status === activeOrder.status));
  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* ── Top bar ── */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1rem 5%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/customer')}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: C.borderLight, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft size={18} color={C.ink} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.7rem', color: C.hint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Tracking</p>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: C.ink, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Order #{activeOrder?.id}
            </h1>
          </div>
          <EtaBadge eta={activeOrder.status === 'Delivered' ? 0 : eta} />
        </div>
      </div>

      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '1.5rem 5% 0' }}>

        {/* ── Map card ── */}
        {['Out For Delivery', 'Delivered'].includes(activeOrder.status) && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '220px', marginBottom: '1.25rem', boxShadow: C.shadowMd }}>
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
              alt="map" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {activeOrder.status !== 'Delivered' && (
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '18px', height: '18px', borderRadius: '50%', background: C.green, border: '3px solid #fff', boxShadow: `0 0 0 6px ${C.greenBg}` }} />
            )}

            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderRadius: '999px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: C.shadow }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeOrder.status === 'Delivered' ? C.hint : C.green }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: C.ink }}>
                  {activeOrder.status === 'Delivered' ? 'Delivery Completed' : 'Driver is nearby'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Status banner ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.green, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: '#065f46', fontSize: '0.9rem', margin: 0 }}>
              {STEPS[currentStep].label}
            </p>
            <p style={{ color: '#047857', fontSize: '0.78rem', margin: 0 }}>{STEPS[currentStep].sub}</p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: C.green, background: '#d1fae5', padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
            {activeOrder.status === 'Delivered' ? 'Completed' : 'Live'}
          </span>
        </motion.div>

        {/* ── Main 2-col ── */}
        <div className="tracking-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

          {/* Timeline card */}
          <Card>
            <SectionLabel>Order progress</SectionLabel>
            <div style={{ position: 'relative', paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>

              {/* track line */}
              <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: C.border, borderRadius: '2px' }} />
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${progressPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ position: 'absolute', left: '11px', top: '24px', width: '2px', background: C.green, borderRadius: '2px', zIndex: 2 }}
              />

              {STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                const Icon = step.icon;
                
                // Find timeline event if it exists
                const timeEvent = activeOrder.timeline?.find(t => t.status === step.status);

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: i < STEPS.length - 1 ? '1.75rem' : 0, position: 'relative', zIndex: 3 }}>
                    {/* dot */}
                    <div style={{
                      position: 'absolute', left: '-2.5rem', top: 0,
                      width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: active ? C.green : done ? C.greenBg : C.borderLight,
                      border: `2px solid ${active || done ? C.green : C.border}`,
                      boxShadow: active ? `0 0 0 4px ${C.greenBg}` : 'none',
                      transition: 'all 0.3s',
                    }}>
                      {done
                        ? <CheckCircle2 size={12} color={C.green} />
                        : <Icon size={11} color={active ? '#fff' : C.hint} />
                      }
                    </div>
                    {/* text */}
                    <div style={{ opacity: done ? 1 : 0.4, transition: 'opacity 0.3s', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: active ? 700 : 600, fontSize: '0.875rem', color: active ? C.green : done ? C.ink : C.muted, margin: 0 }}>{step.label}</p>
                        <p style={{ fontSize: '0.75rem', color: C.hint, margin: '0.15rem 0 0' }}>{step.sub}</p>
                      </div>
                      {timeEvent && (
                        <div style={{ fontSize: '0.7rem', color: C.hint, fontWeight: 600 }}>
                          {new Date(timeEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Driver card */}
            <Card>
              <SectionLabel>Your delivery partner</SectionLabel>
              {activeOrder.driver ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={activeOrder.driver.avatar} alt="Driver"
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: `2px solid ${C.border}` }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: C.green, border: `2px solid #fff` }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: C.ink, fontSize: '0.9rem', margin: 0 }}>{activeOrder.driver.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                      <Star size={11} fill={C.amber} color={C.amber} />
                      <span style={{ fontSize: '0.75rem', color: C.muted }}>{activeOrder.driver.rating} · {activeOrder.driver.deliveries} deliveries</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <RoundBtn icon={<MessageCircle size={16} />} />
                    <RoundBtn icon={<Phone size={16} />} accent />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bike size={24} color={C.hint} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: C.ink, fontSize: '0.95rem', margin: 0 }}>Waiting for assignment</p>
                    <p style={{ fontSize: '0.8rem', color: C.muted, margin: '0.2rem 0 0' }}>Driver will be assigned once order is ready.</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Order summary */}
            <Card>
              <SectionLabel>Order summary</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '0.875rem' }}>
                {(activeOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '4px', background: C.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: C.muted, flexShrink: 0 }}>
                        {item.quantity}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: C.ink, fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: C.muted, fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: '0.75rem', paddingBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.muted }}><span style={{ fontWeight: 500 }}>Item Total</span><span style={{ color: C.ink, fontWeight: 600 }}>₹{activeOrder.subtotal}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.muted }}><span style={{ fontWeight: 500 }}>GST (5%)</span><span style={{ color: C.ink, fontWeight: 600 }}>₹{activeOrder.gst}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.muted }}><span style={{ fontWeight: 500 }}>Delivery Fee</span><span style={{ color: activeOrder.deliveryFee === "0.00" || activeOrder.deliveryFee === 0 ? C.green : C.ink, fontWeight: 600 }}>{activeOrder.deliveryFee === "0.00" || activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.muted }}><span style={{ fontWeight: 500 }}>Platform Fee</span><span style={{ color: C.ink, fontWeight: 600 }}>₹{activeOrder.platformFee}</span></div>
                {parseFloat(activeOrder.discount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.green }}><span style={{ fontWeight: 600 }}>Discount</span><span style={{ fontWeight: 700 }}>-₹{activeOrder.discount}</span></div>}
                {parseFloat(activeOrder.tip) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: C.muted }}><span style={{ fontWeight: 500 }}>Delivery Tip</span><span style={{ color: C.ink, fontWeight: 600 }}>₹{activeOrder.tip}</span></div>}
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.ink }}>Total paid ({activeOrder.paymentMethod})</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: C.ink }}>₹{activeOrder.total}</span>
              </div>
            </Card>

          </div>
        </div>

        {/* ── Delivery address ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1rem 1.25rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: C.shadow }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={16} color={C.indigo} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.7rem', color: C.hint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Delivering to</p>
            <p style={{ fontSize: '0.875rem', color: C.ink, fontWeight: 600, margin: 0, marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeOrder.deliveryAddress || '123, Satellite Road, Ahmedabad, GJ 380015'}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ── micro components ──────────────────────────────────────────────── */

function EtaBadge({ eta }) {
  if (eta === 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: C.amberBg, border: `1px solid #fde68a`, borderRadius: '999px', padding: '0.4rem 0.875rem' }}>
      <Clock size={13} color={C.amber} />
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>{eta} min</span>
    </div>
  );
}

export default function OrderTracking() {
  return (
    <OrderTrackingContent />
  );
}

function Card({ children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '1.25rem', boxShadow: C.shadow }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.hint, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1rem' }}>
      {children}
    </p>
  );
}

function RoundBtn({ icon, accent }) {
  return (
    <button style={{
      width: '44px', height: '44px', borderRadius: '50%', border: `1px solid ${accent ? C.green : C.border}`,
      background: accent ? C.greenBg : C.borderLight,
      color: accent ? C.green : C.muted,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
    }}>
      {icon}
    </button>
  );
}