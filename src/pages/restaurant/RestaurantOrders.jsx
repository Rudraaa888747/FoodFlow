import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, Truck, ChefHat, X, MapPin, Package, Phone, User, Bike } from 'lucide-react';

export default function RestaurantOrders() {
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const tabs = [
    { id: 'All', label: 'All Orders' },
    { id: 'Pending', label: 'Pending', icon: <Clock size={14} /> },
    { id: 'Confirmed', label: 'Confirmed', icon: <CheckCircle size={14} /> },
    { id: 'Preparing', label: 'Preparing', icon: <ChefHat size={14} /> },
    { id: 'Ready', label: 'Ready', icon: <Package size={14} /> },
    { id: 'Out For Delivery', label: 'Out For Delivery', icon: <Truck size={14} /> },
    { id: 'Delivered', label: 'Delivered', icon: <CheckCircle size={14} /> }
  ];

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {
      console.log('Audio play failed', e);
    }
  };

  const handleAction = (orderId, nextStatus) => {
    updateOrderStatus(orderId, nextStatus, 'Restaurant Admin', (res) => {
      if (res && res.success === false) {
        toast.error(res.error || 'Failed to update order status');
        return;
      }
      toast.success(`Order #${orderId} moved to ${nextStatus}`, { icon: '✅', style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      if (nextStatus === 'Pending') {
        playNotificationSound();
      }
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: nextStatus }));
      }
    });
  };

  return (
    <div className="flex-col" style={{ gap: isMobile ? '1rem' : '2rem', position: 'relative' }}>
      {/* Header */}
      <header className={isMobile ? "flex-col" : "flex-between"} style={{ alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.25rem' }}>Order Management</h1>
          <p className="text-secondary" style={{ fontSize: isMobile ? '0.9rem' : '1.05rem' }}>Process incoming orders in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', gap: '0.5rem', width: isMobile ? '100%' : '250px' }}>
            <Search size={16} className="text-secondary" />
            <input type="text" placeholder="Search order ID..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '600px', overflow: 'hidden' }}>
        
        {/* Modern Tabs */}
        <div className="hide-scroll-x" style={{ display: 'flex', gap: '0.5rem', padding: isMobile ? '1rem 1rem 0' : '1.5rem 1.5rem 0', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                background: 'transparent',
                color: filter === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderBottom: filter === tab.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: filter === tab.id ? 600 : 500,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon} {tab.label}
              {tab.id !== 'All' && (
                <span style={{ 
                  background: filter === tab.id ? 'var(--bg-elevated)' : 'transparent',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  marginLeft: '4px'
                }}>
                  {orders.filter(o => o.status === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.5rem', overflowY: 'auto' }}>
          
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <MobileOrderCard key={order.id} order={order} handleAction={handleAction} onClick={() => setSelectedOrder(order)} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Order ID</th>
                  <th style={{ width: '25%' }}>Customer & Location</th>
                  <th style={{ width: '20%' }}>Items</th>
                  <th style={{ width: '10%' }}>Amount</th>
                  <th style={{ width: '15%' }}>Status</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      onClick={() => setSelectedOrder(orders.find(o => o.id === order.id))}
                    >
                      <td style={{ padding: '1.25rem var(--spacing-4)', fontWeight: 600, fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                        #{order.id}
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', fontWeight: 700 }}>
                            {order.customerName ? order.customerName.charAt(0) : 'G'}
                          </div>
                          <div style={{ maxWidth: '200px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{order.customerName || 'Guest User'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {order.deliveryAddress || 'Pickup'}
                            </div>
                            {order.restaurantName && (
                              <div style={{ fontSize: '0.75rem', color: '#FF6B35', fontWeight: 700, marginTop: '2px' }}>
                                From: {order.restaurantName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>
                          {order.items?.length} items
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{Number(order.total || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Pending' ? 'badge-warning' : 'badge-info'}`} style={{ fontWeight: 700 }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {order.status === 'Pending' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Confirmed'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>Accept</button>}
                          {order.status === 'Confirmed' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Preparing'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: 'var(--warning)' }}>Prepare</button>}
                          {order.status === 'Preparing' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Ready'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: 'var(--success)', color: 'black' }}>Mark Ready</button>}
                          {order.status === 'Ready' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Out For Delivery'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: 'var(--info)' }}>Dispatch</button>}
                          {order.status === 'Out For Delivery' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Delivered'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: '#10b981' }}>Complete</button>}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
          
          {filteredOrders.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} className="text-tertiary" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>All caught up!</h3>
                <p>No orders found for this status.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Order Details Drawer ── */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-primary)', height: '100%', boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div style={{ padding: isMobile ? '1.25rem' : '1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    Order #{selectedOrder.id}
                  </h2>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Placed at {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'var(--bg-elevated)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Status Card */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Status</span>
                    <span className={`badge ${selectedOrder.status === 'Delivered' ? 'badge-success' : selectedOrder.status === 'Pending' ? 'badge-warning' : 'badge-info'}`} style={{ fontWeight: 800, fontSize: '0.85rem' }}>{selectedOrder.status}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Customer Details</h3>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <User size={18} color="var(--text-secondary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedOrder.customerName || 'Guest User'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Phone size={18} color="var(--text-secondary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedOrder.customerPhone || '+91 9876543210'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <MapPin size={18} color="var(--text-secondary)" style={{ marginTop: '2px' }} />
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{selectedOrder.deliveryAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Order Items</h3>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px' }}>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#FF6B35' }}>{item.quantity}x</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total ({selectedOrder.paymentMethod})</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sticky Action Bar */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderTop: '1px solid var(--glass-border)', 
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                paddingBottom: isMobile ? 'calc(1rem + env(safe-area-inset-bottom, 0px))' : '1rem'
              }}>
                {selectedOrder.status === 'Pending' && <button onClick={() => handleAction(selectedOrder.id, 'Confirmed')} className="primary-button" style={{ width: '100%', padding: '1rem', fontWeight: 800, fontSize: '1rem', borderRadius: '12px' }}>Accept Order</button>}
                {selectedOrder.status === 'Confirmed' && <button onClick={() => handleAction(selectedOrder.id, 'Preparing')} className="primary-button" style={{ width: '100%', padding: '1rem', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', background: 'var(--warning)' }}>Start Preparing</button>}
                {selectedOrder.status === 'Preparing' && <button onClick={() => handleAction(selectedOrder.id, 'Ready')} className="primary-button" style={{ width: '100%', padding: '1rem', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', background: 'var(--success)', color: 'black' }}>Mark as Ready</button>}
                {selectedOrder.status === 'Ready' && <button onClick={() => handleAction(selectedOrder.id, 'Out For Delivery')} className="primary-button" style={{ width: '100%', padding: '1rem', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', background: 'var(--info)' }}>Dispatch Order</button>}
                {selectedOrder.status === 'Out For Delivery' && <button onClick={() => handleAction(selectedOrder.id, 'Delivered')} className="primary-button" style={{ width: '100%', padding: '1rem', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', background: '#10b981' }}>Mark as Delivered</button>}
                {selectedOrder.status === 'Delivered' && <div style={{ textAlign: 'center', fontWeight: 700, color: '#10b981', padding: '0.5rem' }}>Order Completed Successfully</div>}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MobileOrderCard({ order, handleAction, onClick }) {
  const isNew = order.status === 'Pending';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ 
        background: isNew ? 'rgba(255, 77, 46, 0.05)' : 'var(--bg-elevated)', 
        border: `1px solid ${isNew ? 'rgba(255, 77, 46, 0.3)' : 'var(--glass-border)'}`,
        borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
        boxShadow: isNew ? '0 4px 12px rgba(255, 77, 46, 0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>#{order.id}</span>
            {isNew && <span style={{ background: '#FF4D2E', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', animation: 'pulse 2s infinite' }}>New</span>}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{order.customerName || 'Guest'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{Number(order.total || 0).toFixed(2)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{order.items?.length} items</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed var(--glass-border)' }}>
        <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Pending' ? 'badge-warning' : 'badge-info'}`} style={{ fontWeight: 800 }}>
          {order.status}
        </span>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      {/* Quick Action Button for Mobile */}
      <div style={{ marginTop: '0.5rem' }}>
        {order.status === 'Pending' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Confirmed'); }} className="primary-button" style={{ width: '100%', padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px' }}>Accept Order</button>}
        {order.status === 'Confirmed' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Preparing'); }} className="primary-button" style={{ width: '100%', padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px', background: 'var(--warning)' }}>Start Preparing</button>}
        {order.status === 'Preparing' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Ready'); }} className="primary-button" style={{ width: '100%', padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px', background: 'var(--success)', color: 'black' }}>Mark Ready</button>}
        {order.status === 'Ready' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'Out For Delivery'); }} className="primary-button" style={{ width: '100%', padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px', background: 'var(--info)' }}>Dispatch</button>}
      </div>
    </motion.div>
  );
}
