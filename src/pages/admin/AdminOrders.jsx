import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Clock, Filter, ChevronRight, X, User, Store, DollarSign, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import * as reactWindow from 'react-window';
const { FixedSizeList: List } = reactWindow;

export default function AdminOrders() {
  const orders = useStore(state => state.orders);
  const restaurants = useStore(state => state.restaurants);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, live, completed
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'live' && ['delivered', 'cancelled'].includes(o.status.toLowerCase())) return false;
    if (filter === 'completed' && !['delivered', 'cancelled'].includes(o.status.toLowerCase())) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
      {/* Header */}
      {!isMobile && (
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Orders Management</h1>
            <p className="text-secondary">View and manage all platform orders.</p>
          </div>
        </header>
      )}
      
      {isMobile && (
        <div style={{ padding: '1rem', background: '#050505', color: '#FFF' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', fontWeight: 800 }}>Orders</h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
             {['all', 'live', 'completed'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 style={{ 
                   padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                   background: filter === f ? '#3742fa' : '#111', 
                   color: filter === f ? '#FFF' : '#888',
                   border: `1px solid ${filter === f ? '#3742fa' : '#2A2A2A'}`,
                   textTransform: 'capitalize'
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
      )}

      {/* Desktop Search */}
      {!isMobile && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="glass-input" 
              style={{ paddingLeft: '3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="glass-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto' }}>
             <option value="all">All Orders</option>
             <option value="live">Live Orders</option>
             <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Main Content */}
      {isMobile ? (
        <div style={{ background: '#050505', minHeight: 'calc(100vh - 200px)' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>No orders found.</div>
          ) : (
            <List
              height={window.innerHeight - 200}
              itemCount={filteredOrders.length}
              itemSize={130}
              width="100%"
              style={{ padding: '0 1rem' }}
            >
              {({ index, style }) => {
                const order = filteredOrders[index];
                const rest = restaurants.find(r => r.id === order.restaurantId);
                return (
                  <div style={{ ...style, paddingBottom: '0.75rem' }}>
                    <MobileOrderCard 
                      order={order} 
                      restaurant={rest} 
                      onClick={() => setSelectedOrder(order)} 
                    />
                  </div>
                );
              }}
            </List>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* Virtualized Table Header */}
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
            <List
              height={500}
              itemCount={filteredOrders.length}
              itemSize={65}
              width="100%"
            >
              {({ index, style }) => {
                const order = filteredOrders[index];
                const rest = restaurants.find(r => r.id === order.restaurantId);
                return (
                  <div style={{ ...style, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ flex: 1.5, fontWeight: 'bold' }}>#{order.id}</div>
                    <div style={{ flex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem' }}>{rest?.name || 'Unknown'}</div>
                    <div style={{ flex: 1.5 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div style={{ flex: 1, fontWeight: 600 }}>₹{order.total}</div>
                    <div style={{ flex: 1.5 }}><StatusBadge status={order.status} /></div>
                    <div style={{ flex: 1 }}>
                      <button className="primary-button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setSelectedOrder(order)}>View</button>
                    </div>
                  </div>
                );
              }}
            </List>
          )}
        </div>
      )}

      {/* Order Detail Drawer (Mobile & Desktop) */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer 
            order={selectedOrder} 
            restaurant={restaurants.find(r => r.id === selectedOrder.restaurantId)}
            onClose={() => setSelectedOrder(null)} 
            isMobile={isMobile}
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
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>#{order.id}</div>
        <StatusBadge status={order.status} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Store size={20} color="#3742fa" />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>{restaurant?.name || 'Unknown Restaurant'}</div>
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

function OrderDetailDrawer({ order, restaurant, onClose, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: isMobile ? '100%' : '450px', height: '100%', background: '#111', 
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
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#3742fa33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="#3742fa" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>{restaurant?.name || 'Unknown'}</div>
                <div style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '0.2rem' }}>{restaurant?.location || 'Ahmedabad'}</div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Customer</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#F59E0B" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>Guest User</div>
                <div style={{ fontSize: '0.75rem', color: '#AAA', marginTop: '0.2rem' }}>guest@foodflow.com</div>
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
