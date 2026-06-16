import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Clock, Filter, ChevronRight, X, User, Store, DollarSign, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const orders = useStore(state => state.orders);
  const restaurants = useStore(state => state.restaurants);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, live, completed
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'live' && ['delivered', 'cancelled'].includes(o.status.toLowerCase())) return false;
    if (filter === 'completed' && !['delivered', 'cancelled'].includes(o.status.toLowerCase())) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="admin-orders-page">
      <style>{`
        .ao-desktop { display: block; }
        .ao-mobile { display: none; }
        .admin-orders-page { padding-bottom: 0; min-height: 100vh; }
        .ao-drawer-panel { width: 450px; }
        @media (max-width: 900px) {
          .ao-desktop { display: none !important; }
          .ao-mobile { display: block !important; }
          .ao-mobile-flex { display: flex !important; }
          .admin-orders-page { padding-bottom: 80px; background: #050505; }
          .ao-drawer-panel { width: 100% !important; }
        }
      `}</style>

      {/* Desktop Header */}
      <header className="ao-desktop flex-between" style={{ marginBottom: '2rem', padding: '2rem 2rem 0 2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Orders Management</h1>
          <p className="text-secondary" style={{ margin: 0 }}>View and manage all platform orders.</p>
        </div>
      </header>
      
      {/* Mobile Header */}
      <div className="ao-mobile" style={{ padding: '1.5rem 1rem', background: '#050505', color: '#FFF' }}>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', fontWeight: 800 }}>Orders</h1>
        <div className="ao-mobile-flex" style={{ gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
           {['all', 'live', 'completed'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               style={{ 
                 padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                 background: filter === f ? '#3742fa' : '#111', 
                 color: filter === f ? '#FFF' : '#888',
                 border: `1px solid ${filter === f ? '#3742fa' : '#2A2A2A'}`,
                 textTransform: 'capitalize', whiteSpace: 'nowrap', cursor: 'pointer'
               }}
             >
               {f}
             </button>
           ))}
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', background: '#111', border: '1px solid #2A2A2A', 
              padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '12px', 
              color: '#FFF', fontSize: '0.9rem', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Desktop Search */}
      <div className="ao-desktop glass-panel" style={{ padding: '1.5rem', margin: '0 2rem 2rem 2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="glass-input" 
            style={{ paddingLeft: '3rem', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="glass-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto', cursor: 'pointer' }}>
           <option value="all">All Orders</option>
           <option value="live">Live Orders</option>
           <option value="completed">Completed</option>
        </select>
      </div>

      {/* Main Content */}
      
      {/* Mobile Content */}
      <div className="ao-mobile" style={{ padding: '0 1rem' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>No orders found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.map(order => {
              const rest = restaurants.find(r => r.id === order.restaurantId);
              return (
                <MobileOrderCard 
                  key={order.id}
                  order={order} 
                  restaurant={rest} 
                  onClick={() => setSelectedOrder(order)} 
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Content */}
      <div className="ao-desktop" style={{ padding: '0 2rem 2rem 2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '1rem', fontWeight: 600 }}>
            <div style={{ flex: 1.5 }}>Order ID</div>
            <div style={{ flex: 2 }}>Restaurant</div>
            <div style={{ flex: 1.5 }}>Date</div>
            <div style={{ flex: 1 }}>Total</div>
            <div style={{ flex: 1.5 }}>Status</div>
            <div style={{ flex: 1 }}>Action</div>
          </div>
          
          {filteredOrders.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredOrders.map((order, idx) => {
                const rest = restaurants.find(r => r.id === order.restaurantId);
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: idx < filteredOrders.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                    <div style={{ flex: 1.5, fontWeight: 'bold' }}>#{order.id}</div>
                    <div style={{ flex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem' }}>{rest?.name || 'Unknown'}</div>
                    <div style={{ flex: 1.5 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div style={{ flex: 1, fontWeight: 600 }}>₹{order.total}</div>
                    <div style={{ flex: 1.5 }}><StatusBadge status={order.status} /></div>
                    <div style={{ flex: 1 }}>
                      <button className="primary-button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>View</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer 
            order={selectedOrder} 
            restaurant={restaurants.find(r => r.id === selectedOrder.restaurantId)}
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileOrderCard({ order, restaurant, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px',
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>#{order.id}</div>
        <StatusBadge status={order.status} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Store size={20} color="#3742fa" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant?.name || 'Unknown Restaurant'}</div>
          <div style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
            <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #2A2A2A' }}>
        <div style={{ fontSize: '0.8rem', color: '#AAA' }}>Total Amount</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>₹{order.total}</div>
      </div>
    </motion.div>
  );
}

function OrderDetailDrawer({ order, restaurant, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        className="ao-drawer-panel"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        style={{
          height: '100%', background: '#111', 
          borderLeft: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>Order Details</h2>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>#{order.id}</div>
          </div>
          <button onClick={onClose} style={{ background: '#1A1A1A', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status & Payment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Status</div>
              <StatusBadge status={order.status} />
            </div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Payment</div>
              <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>Paid (Wallet)</div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Restaurant</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#3742fa33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Store size={20} color="#3742fa" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant?.name || 'Unknown'}</div>
                <div style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant?.location || 'Ahmedabad'}</div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Customer</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={20} color="#F59E0B" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>Guest User</div>
                <div style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>guest@foodflow.com</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Items</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '0.5rem 1rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: idx < order.items.length - 1 ? '1px solid #2A2A2A' : 'none' }}>
                  <div style={{ color: '#FFF', fontSize: '0.85rem' }}><span style={{ color: '#3742fa', fontWeight: 700, marginRight: '0.5rem' }}>{item.quantity}x</span> {item.name}</div>
                  <div style={{ color: '#FFF', fontWeight: 600, fontSize: '0.85rem' }}>₹{item.price * item.quantity}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0.5rem 0', borderTop: '1px dashed #333', marginTop: '0.5rem' }}>
                <div style={{ color: '#AAA', fontSize: '0.85rem' }}>Taxes & Fees</div>
                <div style={{ color: '#FFF', fontWeight: 600, fontSize: '0.85rem' }}>₹45</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0.5rem 0', borderTop: '1px solid #333' }}>
                <div style={{ color: '#FFF', fontWeight: 800 }}>Total</div>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.2rem' }}>₹{order.total}</div>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const map = {
    delivered: { color: '#10b981', label: 'Delivered' },
    preparing: { color: '#f59e0b', label: 'Preparing' },
    cancelled: { color: '#ef4444', label: 'Cancelled' },
    pending: { color: '#666666', label: 'Pending' },
    'out-for-delivery': { color: '#6366f1', label: 'Out for delivery' },
  };
  const { color, label } = map[status?.toLowerCase()] || { color: '#666', label: status || 'Unknown' };
  return (
    <span style={{
      fontSize: '0.65rem', fontWeight: 700, color, background: `${color}1a`, textTransform: 'uppercase', letterSpacing: '0.5px',
      border: `1px solid ${color}33`, borderRadius: '4px', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
