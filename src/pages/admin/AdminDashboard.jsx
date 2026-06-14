import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Store, Bike, DollarSign, Activity, TrendingUp,
  AlertTriangle, AlertOctagon, CheckCircle2, ArrowUpRight, Clock,
  Package, Search, Zap, Server, Database, Globe
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

export default function AdminDashboard() {
  const restaurants = useStore(state => state.restaurants);
  const orders = useStore(state => state.orders);
  const bookings = useStore(state => state.bookings);
  const notifications = useStore(state => state.notifications);
  const socketConnected = useStore(state => state.socketConnected);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const restaurantsCount = restaurants.length;
  const gmv = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) + 245000;
  const todayGmv = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) + 12500;
  const liveOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status.toLowerCase())).length;
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const totalCustomers = 12450;
  
  // Create a combined activity timeline from orders, bookings, and notifications
  const timeline = [...orders.map(o => ({ ...o, type: 'order', timestamp: o.createdAt || new Date().toISOString() })),
                   ...bookings.map(b => ({ ...b, type: 'booking', timestamp: b.createdAt || new Date().toISOString() })),
                   ...notifications.map(n => ({ ...n, type: 'notification', timestamp: n.createdAt || new Date().toISOString() }))]
                   .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                   .slice(0, 15);

  return isMobile ? (
    <MobileAdminDashboard 
      gmv={gmv} 
      todayGmv={todayGmv} 
      liveOrders={liveOrders} 
      pendingOrders={pendingOrders} 
      totalCustomers={totalCustomers}
      restaurantsCount={restaurantsCount}
      socketConnected={socketConnected}
      timeline={timeline}
      navigate={navigate}
    />
  ) : (
    <DesktopAdminDashboard 
      restaurants={restaurants} 
      orders={orders} 
      gmv={gmv} 
      restaurantsCount={restaurantsCount} 
      liveOrders={liveOrders} 
    />
  );
}

function MobileAdminDashboard({ gmv, todayGmv, liveOrders, pendingOrders, totalCustomers, restaurantsCount, socketConnected, timeline, navigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem', paddingBottom: '90px', background: '#050505', minHeight: '100vh', color: '#FFF' }}>
      
      {/* Header & Global Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>Control Center</h1>
            <div style={{ fontSize: '0.75rem', color: socketConnected ? '#10B981' : '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: socketConnected ? '#10B981' : '#F59E0B', boxShadow: `0 0 8px ${socketConnected ? '#10B981' : '#F59E0B'}`, animation: 'pulse 2s infinite' }} />
              {socketConnected ? 'Systems Online' : 'Connecting...'}
            </div>
          </div>
          <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '0.5rem', borderRadius: '12px' }}>
            <Activity size={20} color="#3742fa" />
          </div>
        </div>

        {/* Global Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input 
            type="text" 
            placeholder="Global Search (Orders, Users, Restaurants)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', background: '#111', border: '1px solid #2A2A2A', 
              padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '12px', 
              color: '#FFF', fontSize: '0.9rem', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Revenue High-Level */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A15 100%)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #3742fa44', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '-20%', opacity: 0.05, transform: 'rotate(-10deg)', pointerEvents: 'none' }}><Globe size={150} /></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
           <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', marginBottom: '0.25rem' }}>
               <DollarSign size={14} color="#3742fa" /> <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Platform Revenue</span>
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em' }}>₹{gmv.toLocaleString()}</div>
           </div>
           <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>+14.5%</span>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           <div>
             <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginBottom: '0.1rem' }}>Today's Revenue</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>₹{todayGmv.toLocaleString()}</div>
           </div>
           <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginBottom: '0.1rem' }}>Total Users</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{totalCustomers.toLocaleString()}</div>
           </div>
        </div>
      </div>

      {/* Live Operations Matrix */}
      <div>
        <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 700 }}>Live Operations Matrix</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <AdminMiniCard title="Live Orders" value={liveOrders} icon={Bike} color="#3742fa" onClick={() => navigate('/admin/orders')} />
          <AdminMiniCard title="Pending" value={pendingOrders} icon={Clock} color="#F59E0B" onClick={() => navigate('/admin/orders')} />
          <AdminMiniCard title="Restaurants" value={restaurantsCount} icon={Store} color="#FF6B2B" onClick={() => navigate('/admin/restaurants')} />
          <AdminMiniCard title="Active Users" value="1,245" icon={Users} color="#10B981" onClick={() => navigate('/admin/customers')} />
        </div>
      </div>

      {/* Critical Alerts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={14} /> Critical Alerts
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <AlertBanner type="danger" msg="High order volume in Zone B. Delivery delays expected." />
          {!socketConnected && <AlertBanner type="warning" msg="Socket disconnected. Using fallback polling." />}
        </div>
      </div>

      {/* Real-time Activity Timeline */}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Real-Time Activity</h3>
        <div style={{ background: '#111', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {timeline.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#666', fontSize: '0.85rem' }}>No recent activity.</div>
          ) : (
            timeline.map((item, i) => (
              <TimelineItem key={i} item={item} isLast={i === timeline.length - 1} />
            ))
          )}
        </div>
      </div>

      {/* System Health */}
      <div>
        <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>System Health</h3>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scroll-x">
          <HealthPill icon={Server} label="API Server" status="operational" />
          <HealthPill icon={Database} label="Primary DB" status="operational" />
          <HealthPill icon={Activity} label="Socket Server" status={socketConnected ? 'operational' : 'degraded'} />
        </div>
      </div>

    </div>
  );
}

function AdminMiniCard({ title, value, icon: Icon, color, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{ 
        background: '#111', 
        border: '1px solid #2A2A2A',
        padding: '1rem', 
        borderRadius: '12px', 
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', position: 'relative', overflow: 'hidden'
      }}
    >
      <Icon size={16} color={color} style={{ marginBottom: '0.5rem' }} />
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888' }}>{title}</div>
    </motion.div>
  );
}

function AlertBanner({ type, msg }) {
  const color = type === 'danger' ? '#EF4444' : '#F59E0B';
  const bg = type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ fontSize: '0.8rem', color: color, fontWeight: 600 }}>{msg}</div>
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  let icon, color, title, desc;
  
  if (item.type === 'order') {
    icon = Package; color = '#3742fa'; title = `Order #${item.id}`; desc = `New order placed for ₹${item.total}`;
    if (item.status === 'Delivered') { color = '#10B981'; desc = `Order delivered successfully.`; }
    else if (item.status === 'Cancelled') { color = '#EF4444'; desc = `Order cancelled.`; }
  } else if (item.type === 'booking') {
    icon = Users; color = '#F59E0B'; title = `Booking #${item.id}`; desc = `Table for ${item.guests} requested.`;
  } else {
    icon = Activity; color = '#8B5CF6'; title = 'System Update'; desc = item.message || 'Notification received.';
  }

  const Icon = icon;

  return (
    <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
      {!isLast && <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-16px', width: '2px', background: '#2A2A2A' }} />}
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `rgba(${hexToRgb(color)}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: `1px solid ${color}44` }}>
        <Icon size={12} color={color} />
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{title}</span>
          <span style={{ fontSize: '0.7rem', color: '#666' }}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
}

function HealthPill({ icon: Icon, label, status }) {
  const isOk = status === 'operational';
  const color = isOk ? '#10B981' : '#F59E0B';
  return (
    <div style={{ background: '#111', border: '1px solid #2A2A2A', padding: '0.5rem 0.75rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
      <Icon size={14} color="#888" />
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CCC' }}>{label}</span>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
}

/* ── Desktop Dashboard (Untouched) ── */
function DesktopAdminDashboard({ restaurants, orders, gmv, restaurantsCount, liveOrders }) {
  const avgOrderValue = orders.length ? gmv / orders.length : 0;
  const revenueByRestaurant = restaurants.map(r => {
    const restOrders = orders.filter(o => o.restaurantId === r.id);
    const revenue = restOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    return { ...r, revenue, orderCount: restOrders.length };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      {/* Header */}
      <motion.header variants={itemVariants} className="admin-header" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Platform Overview</h1>
          <p className="text-secondary">System health and global metrics for FOODFLOW Ahmedabad.</p>
        </div>
        <div className="glass-panel" style={{
          padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          borderRadius: 'var(--radius-full)',
        }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}
          />
          <Activity size={16} color="var(--success)" />
          <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>System Operational</span>
        </div>
      </motion.header>

      {/* Stat cards */}
      <motion.div variants={itemVariants} className="admin-stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem',
      }}>
        <StatCard title="Total Users" value="12,450" icon={<Users size={22} color="#6366f1" />} tint="#6366f1" trend="+124 today" trendUp />
        <StatCard title="Active Restaurants" value={restaurantsCount} icon={<Store size={22} color="#f59e0b" />} tint="#f59e0b" trend="Stable" />
        <StatCard title="Live Orders" value={liveOrders} icon={<Bike size={22} color="#10b981" />} tint="#10b981" trend="In progress" />
        <StatCard title="Total Platform GMV" value={`₹${gmv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} icon={<DollarSign size={22} color="#FF6B2B" />} tint="#FF6B2B" trend="Live" trendUp />
      </motion.div>

      {/* Main grid */}
      <div className="admin-dashboard-flex" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        {/* Recent orders */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Recent Orders</h2>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Avg. order value: ₹{avgOrderValue.toFixed(0)}</span>
          </div>
          {recentOrders.length === 0 ? <EmptyState text="No orders placed yet." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map(order => {
                const restaurant = restaurants.find(r => r.id === order.restaurantId);
                return (
                  <div key={order.id} className="flex-between" style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--glass-bg)', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--glass-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Store size={16} color="var(--text-secondary)" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant?.name || 'Unknown Restaurant'}</p>
                        <p className="text-secondary" style={{ margin: 0, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} /> #{order.id}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <StatusBadge status={order.status} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{parseFloat(order.total || 0).toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top restaurants */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Top Restaurants</h2>
              <TrendingUp size={18} color="var(--text-secondary)" />
            </div>
            {revenueByRestaurant.length === 0 ? <EmptyState text="No restaurant activity yet." /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {revenueByRestaurant.map((r, i) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, background: i === 0 ? 'var(--accent)' : 'var(--glass-bg-hover)', color: i === 0 ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</p>
                      <div style={{ height: '4px', borderRadius: '2px', background: 'var(--glass-bg-hover)', marginTop: '0.35rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${revenueByRestaurant[0].revenue ? (r.revenue / revenueByRestaurant[0].revenue) * 100 : 0}%`, background: 'var(--accent)', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>₹{r.revenue.toFixed(0)}</p>
                      <p className="text-secondary" style={{ margin: 0, fontSize: '0.72rem' }}>{r.orderCount} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* System alerts */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>System Alerts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AlertItem type="warning" msg="High order volume detected in Navrangpura. Recommend surge pricing." />
              <AlertItem type="danger" msg="Payment gateway simulated delay. Fallback active." />
              <AlertItem type="success" msg="Database backup completed successfully." />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-dashboard-flex { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
          .admin-header { align-items: stretch !important; }
        }
      `}</style>
    </motion.div>
  );
}

function StatCard({ title, value, icon, trend, tint, trendUp }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex-between">
        <p className="text-secondary" style={{ margin: 0, fontSize: '0.85rem' }}>{title}</p>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: `${tint}1a`, border: `1px solid ${tint}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.85rem', margin: 0, letterSpacing: '-0.02em' }}>{value}</h2>
        <span style={{
          color: trendUp ? 'var(--success)' : 'var(--text-secondary)',
          fontSize: '0.78rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.2rem',
        }}>
          {trendUp && <ArrowUpRight size={12} />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    delivered: { color: 'var(--success)', label: 'Delivered' },
    preparing: { color: 'var(--warning)', label: 'Preparing' },
    cancelled: { color: 'var(--danger)', label: 'Cancelled' },
    pending: { color: 'var(--text-secondary)', label: 'Pending' },
    'out-for-delivery': { color: '#6366f1', label: 'Out for delivery' },
  };
  const { color, label } = map[status?.toLowerCase()] || { color: 'var(--text-secondary)', label: status || 'Unknown' };
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 600, color, background: `${color}1a`,
      border: `1px solid ${color}33`, borderRadius: 'var(--radius-full)',
      padding: '0.2rem 0.6rem', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function AlertItem({ type, msg }) {
  const config = {
    warning: { color: 'var(--warning)', icon: AlertTriangle },
    danger: { color: 'var(--danger)', icon: AlertOctagon },
    success: { color: 'var(--success)', icon: CheckCircle2 },
  }[type];
  const Icon = config.icon;
  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem',
      borderLeft: `4px solid ${config.color}`, background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)',
    }}>
      <Icon size={16} color={config.color} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
      <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{msg}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1rem', color: 'var(--text-secondary)', textAlign: 'center',
    }}>
      <Activity size={32} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
      <p style={{ margin: 0, fontSize: '0.9rem' }}>{text}</p>
    </div>
  );
}