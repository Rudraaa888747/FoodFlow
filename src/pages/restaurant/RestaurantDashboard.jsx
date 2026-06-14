import React, { useState, useEffect } from 'react';
import { Package, IndianRupee, TrendingUp, Star, ArrowRight, Activity, Clock, ChevronRight, Zap, Calendar, UtensilsCrossed, Settings, MessageSquare, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function RestaurantDashboard() {
  const allOrders = useStore(state => state.orders);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  
  const RESTAURANT_ID = 'rest-2';
  const orders = allOrders.filter(order => order.items.some(item => item.restaurantId === RESTAURANT_ID));
  
  const revenue = orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + parseFloat(o.total || 0), 0) + 12450; 
  const totalOrders = orders.length + 42;
  const activeOrders = orders.filter(o => ['Preparing', 'Ready', 'Out for Delivery'].includes(o.status)).length;

  return isMobile ? (
    <MobileDashboard orders={orders} revenue={revenue} totalOrders={totalOrders} navigate={navigate} />
  ) : (
    <DesktopDashboard orders={orders} revenue={revenue} totalOrders={totalOrders} activeOrders={activeOrders} navigate={navigate} />
  );
}

function MobileDashboard({ orders, revenue, totalOrders, navigate }) {
  const [kitchenMode, setKitchenMode] = useState(false);

  const pending = orders.filter(o => o.status === 'Pending').length;
  const preparing = orders.filter(o => o.status === 'Preparing').length;
  const ready = orders.filter(o => o.status === 'Ready').length;
  const outForDelivery = orders.filter(o => o.status === 'Out For Delivery').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '90px' }}>
      {/* Header & Kitchen Mode */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
            Live Systems Active
          </div>
        </div>
        <button 
          onClick={() => setKitchenMode(!kitchenMode)}
          style={{ 
            background: kitchenMode ? '#FF4D2E' : 'var(--bg-elevated)', 
            color: '#FFF', border: '1px solid var(--glass-border)', 
            padding: '0.6rem 1rem', borderRadius: '24px', 
            fontWeight: 700, fontSize: '0.85rem',
            boxShadow: kitchenMode ? '0 4px 12px rgba(255,77,46,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          {kitchenMode && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFF', animation: 'pulse 1.5s infinite' }} />}
          {kitchenMode ? 'Exit Kitchen' : 'Kitchen Mode'}
        </button>
      </div>

      {/* KPI Overview */}
      <div style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, #051005 100%)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--glass-border-light)', display: 'flex', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '-20%', opacity: 0.05, transform: 'rotate(-10deg)', pointerEvents: 'none' }}><Zap size={150} /></div>
        <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
             <IndianRupee size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Revenue</span>
           </div>
           <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>₹{revenue.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, paddingLeft: '0.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
             <Package size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Orders</span>
           </div>
           <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{totalOrders}</div>
        </div>
      </div>

      {/* Live Operations */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0 }}>Live Operations</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <CounterCard title="New Orders" value={pending} color="#f59e0b" navigate={navigate} filter="Pending" big={kitchenMode} />
          <CounterCard title="Preparing" value={preparing} color="#3b82f6" navigate={navigate} filter="Preparing" big={kitchenMode} />
          <CounterCard title="Ready to Ship" value={ready} color="#10b981" navigate={navigate} filter="Ready" big={kitchenMode} />
          <CounterCard title="Out for Delivery" value={outForDelivery} color="#8b5cf6" navigate={navigate} filter="Out For Delivery" big={kitchenMode} />
        </div>
      </div>
    </div>
  );
}

function CounterCard({ title, value, color, navigate, filter, big }) {
  const active = value > 0;
  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/restaurant/orders`)}
      style={{ 
        background: active ? `linear-gradient(145deg, rgba(${hexToRgb(color)}, 0.15) 0%, rgba(${hexToRgb(color)}, 0.05) 100%)` : 'var(--bg-elevated)', 
        border: `1px solid ${active ? `rgba(${hexToRgb(color)}, 0.4)` : 'var(--glass-border)'}`,
        padding: big ? '1.5rem' : '1.25rem', 
        borderRadius: '16px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: active ? `0 4px 20px rgba(${hexToRgb(color)}, 0.1)` : 'none',
        overflow: 'hidden'
      }}
    >
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: active ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
      <div style={{ fontSize: big ? '3.5rem' : '2.5rem', fontWeight: 800, color: active ? color : 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      {active && <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 12px ${color}`, animation: 'pulse 2s infinite' }} />}
      {active && <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', opacity: 0.1, color: color, pointerEvents: 'none' }}><Activity size={80} /></div>}
    </motion.div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ 
        background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)',
        padding: '1rem 0.5rem', borderRadius: '12px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        cursor: 'pointer'
      }}
    >
      <Icon size={20} color="var(--text-secondary)" />
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{label}</span>
    </motion.div>
  );
}

/* ── Desktop Dashboard ── */
function DesktopDashboard({ orders, revenue, totalOrders, activeOrders, navigate }) {
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex-col" style={{ gap: '2rem' }}>
      {/* Header section */}
      <header className="flex-between">
        <motion.div variants={itemVariants}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', background: 'rgba(23, 201, 100, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(23, 201, 100, 0.2)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
            <span style={{ color: 'var(--success)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>Live Systems Active</span>
          </div>
          <h1 style={{ marginBottom: '0.25rem' }}>Command Center</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Real-time overview of Punjab Da Dhaba.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem' }}>
          <button className="secondary-button" onClick={() => navigate('/restaurant/menu')}>Edit Menu</button>
          <button className="primary-button" onClick={() => navigate('/restaurant/orders')}>View Live Orders <ArrowRight size={16} /></button>
        </motion.div>
      </header>

      {/* Bento Grid */}
      <div className="bento-grid">
        <motion.div variants={itemVariants} className="bento-card col-span-8" style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, #051005 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '240px' }}>
          <div style={{ position: 'absolute', right: '-5%', top: '-10%', opacity: 0.03, transform: 'rotate(-10deg)', pointerEvents: 'none' }}><Zap size={300} /></div>
          <div>
            <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}><TrendingUp size={24} color="var(--success)" /></div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Revenue is up 14.5%</h2>
            <p className="text-secondary" style={{ maxWidth: '70%' }}>Your new combo meals are performing exceptionally well today. Consider running a weekend promotion to maintain momentum.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em' }}>₹{revenue.toLocaleString()}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Today</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '240px' }}>
          <div className="flex-between" style={{ marginBottom: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}><Activity size={18} /> <span style={{ fontWeight: 500 }}>Active Orders</span></div>
            <span className="badge badge-warning">Processing</span>
          </div>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}><div style={{ fontSize: '4.5rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.05em', color: 'var(--accent-primary)', textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>{activeOrders}</div></div>
          <button className="secondary-button" style={{ width: '100%' }} onClick={() => navigate('/restaurant/orders')}>Process Orders <ChevronRight size={16} /></button>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}><Package size={18} /> <span style={{ fontWeight: 500 }}>Total Orders</span></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{totalOrders}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--success)' }}>+5.2%</span> <span style={{ color: 'var(--text-secondary)' }}>vs last week</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}><IndianRupee size={18} /> <span style={{ fontWeight: 500 }}>Avg. Value</span></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>₹345</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--success)' }}>+2.1%</span> <span style={{ color: 'var(--text-secondary)' }}>vs last week</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}><Star size={18} /> <span style={{ fontWeight: 500 }}>Rating</span></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>4.6</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--success)' }}>+0.2</span> <span style={{ color: 'var(--text-secondary)' }}>vs last week</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}><Clock size={18} /> <span style={{ fontWeight: 500 }}>Avg. Prep Time</span></div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>14m</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ color: 'var(--success)' }}>-2m</span> <span style={{ color: 'var(--text-secondary)' }}>improvement</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-6" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}><h3 style={{ fontSize: '1.1rem' }}>Top Performers</h3></div>
          <div style={{ padding: '0.5rem' }}>
            <PopularItem name="Butter Chicken" sales="124 orders" price="₹399" trend="+12%" />
            <PopularItem name="Garlic Naan" sales="98 orders" price="₹89" trend="+8%" />
            <PopularItem name="Paneer Tikka Masala" sales="76 orders" price="₹379" trend="-2%" negative />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bento-card col-span-6" style={{ padding: 0 }}>
          <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Latest Feedback</h3>
            <button className="secondary-button" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => navigate('/restaurant/reviews')}>View All</button>
          </div>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border-light)' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Rahul Sharma</span>
                <div style={{ display: 'flex', color: '#f5a623' }}><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>"Best butter chicken in town. Arrived piping hot!"</p>
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Priya Patel</span>
                <div style={{ display: 'flex', color: '#f5a623' }}><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              </div>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>"Good food, but naan could be slightly softer."</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PopularItem({ name, sales, price, trend, negative }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={18} color="var(--text-secondary)" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.1rem', fontWeight: 500 }}>{name}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span className="text-secondary">{sales}</span>
            <span style={{ color: negative ? 'var(--danger)' : 'var(--success)' }}>{trend}</span>
          </div>
        </div>
      </div>
      <div style={{ fontWeight: 500 }}>{price}</div>
    </div>
  );
}
