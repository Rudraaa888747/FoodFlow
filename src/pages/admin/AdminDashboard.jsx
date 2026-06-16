import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Store, Bike, DollarSign, Activity, TrendingUp,
  AlertTriangle, AlertOctagon, CheckCircle2, Clock,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

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

  const restaurantsCount = restaurants.length;
  const gmv = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) + 245000;
  const liveOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status.toLowerCase())).length;

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
    <motion.div initial="hidden" animate="show" variants={containerVariants} style={{ padding: '2rem' }}>
      {/* Header */}
      <motion.header variants={itemVariants} className="admin-header" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>Platform Overview</h1>
          <p className="text-secondary" style={{ margin: 0 }}>System health and global metrics for FOODFLOW.</p>
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
          <div className="flex-between" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Recent Orders</h2>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Avg. order value: ₹{avgOrderValue.toFixed(0)}</span>
          </div>
          {recentOrders.length === 0 ? <EmptyState text="No orders placed yet." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map(order => {
                const restaurant = restaurants.find(r => r.id === order.restaurantId);
                return (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--glass-bg)', gap: '1rem', flexWrap: 'wrap' }}>
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
            <div className="flex-between" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
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
            <h2 style={{ marginBottom: '1.5rem', margin: 0 }}>System Alerts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AlertItem type="warning" msg="High order volume detected. Recommend surge pricing." />
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
          .admin-header { align-items: stretch !important; flex-direction: column; }
        }
      `}</style>
    </motion.div>
  );
}

function StatCard({ title, value, icon, trend, tint, trendUp }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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