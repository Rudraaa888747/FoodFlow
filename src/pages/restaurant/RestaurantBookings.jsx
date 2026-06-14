import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Users, Clock, CheckCircle, XCircle, MoreHorizontal, User, Phone, X, Edit2 } from 'lucide-react';

export default function RestaurantBookings() {
  const bookings = useStore(state => state.bookings);
  const updateBookingStatus = useStore(state => state.updateBookingStatus);
  
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const tabs = [
    { id: 'All', label: 'All Bookings' },
    { id: 'Pending', label: 'Pending', icon: <Clock size={14} /> },
    { id: 'Confirmed', label: 'Confirmed', icon: <CheckCircle size={14} /> },
    { id: 'Completed', label: 'Completed', icon: <CheckCircle size={14} /> },
    { id: 'Cancelled', label: 'Cancelled', icon: <XCircle size={14} /> }
  ];

  const handleAction = (bookingId, nextStatus) => {
    updateBookingStatus(bookingId, nextStatus, 'Restaurant Admin', (res) => {
      if (res && res.success === false) {
        toast.error(res.error || 'Failed to update booking status');
        return;
      }
      toast.success(`Booking ${bookingId} marked as ${nextStatus}`, { icon: '✅', style: { borderRadius: '10px', background: '#333', color: '#fff' }});
      if (selectedBooking && selectedBooking.id === bookingId) {
        // Optimistically update drawer state if open
        setSelectedBooking(prev => ({ ...prev, status: nextStatus }));
      }
    });
  };

  return (
    <div className="flex-col" style={{ gap: isMobile ? '1rem' : '2rem', position: 'relative' }}>
      {/* Header */}
      <header className={isMobile ? "flex-col" : "flex-between"} style={{ alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '0.25rem' }}>Table Bookings</h1>
          <p className="text-secondary" style={{ fontSize: isMobile ? '0.9rem' : '1.05rem' }}>Manage incoming reservations.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', gap: '0.5rem', width: isMobile ? '100%' : '250px' }}>
            <Search size={16} className="text-secondary" />
            <input type="text" placeholder="Search customer name..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
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
                  {bookings.filter(b => b.status === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Booking List */}
        <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.5rem', overflowY: 'auto' }}>
          
          {isMobile ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {filteredBookings.map(booking => (
                  <MobileBookingCard key={booking.id} booking={booking} handleAction={handleAction} onClick={() => setSelectedBooking(booking)} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Booking ID</th>
                  <th style={{ width: '25%' }}>Customer Details</th>
                  <th style={{ width: '20%' }}>Date & Time</th>
                  <th style={{ width: '15%' }}>Guests</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredBookings.map((booking) => (
                    <motion.tr 
                      key={booking.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      onClick={() => setSelectedBooking(bookings.find(b => b.id === booking.id))}
                    >
                      <td style={{ padding: '1.25rem var(--spacing-4)', fontWeight: 600, fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                        #{booking.id}
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', fontWeight: 700 }}>
                            {booking.customerName ? booking.customerName.charAt(0) : 'G'}
                          </div>
                          <div style={{ maxWidth: '200px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{booking.customerName || 'Guest User'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {booking.customerPhone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                           {booking.date}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '4px', fontWeight: 700 }}>
                           {booking.time}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <Users size={14} color="var(--text-secondary)" /> {booking.guests} Guests
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)' }}>
                        <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Pending' ? 'badge-warning' : booking.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`} style={{ fontWeight: 700 }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem var(--spacing-4)', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {booking.status === 'Pending' && <button onClick={(e) => { e.stopPropagation(); handleAction(booking.id, 'Confirmed'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>Accept</button>}
                          {booking.status === 'Confirmed' && <button onClick={(e) => { e.stopPropagation(); handleAction(booking.id, 'Completed'); }} className="primary-button" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', background: 'var(--success)', color: 'black' }}>Complete</button>}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
          
          {filteredBookings.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} className="text-tertiary" />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-primary)' }}>All clear!</h3>
                <p>No bookings found for this status.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Booking Details Drawer ── */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedBooking(null)}
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
                    Booking #{selectedBooking.id}
                  </h2>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Requested at {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'var(--bg-elevated)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Status Card */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Status</span>
                    <span className={`badge ${selectedBooking.status === 'Completed' ? 'badge-success' : selectedBooking.status === 'Pending' ? 'badge-warning' : selectedBooking.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`} style={{ fontWeight: 800, fontSize: '0.85rem' }}>{selectedBooking.status}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Customer Details</h3>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <User size={18} color="var(--text-secondary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedBooking.customerName || 'Guest User'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <Phone size={18} color="var(--text-secondary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedBooking.customerPhone || '+91 9876543210'}</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Reservation Info</h3>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Date</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>{selectedBooking.date}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Time</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>{selectedBooking.time}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Guests</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>{selectedBooking.guests} People</span>
                     </div>
                     {selectedBooking.specialNotes && (
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                         <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Special Notes</span>
                         <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4, background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: '8px' }}>{selectedBooking.specialNotes}</span>
                       </div>
                     )}
                  </div>
                </div>

              </div>
              
              {/* Sticky Action Bar */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-secondary)', 
                borderTop: '1px solid var(--glass-border)', 
                display: 'flex', gap: '0.5rem',
                paddingBottom: isMobile ? 'calc(1rem + env(safe-area-inset-bottom, 0px))' : '1rem'
              }}>
                {selectedBooking.status === 'Pending' && (
                   <>
                     <button onClick={() => handleAction(selectedBooking.id, 'Confirmed')} className="primary-button" style={{ flex: 1, padding: '1rem', fontWeight: 800, borderRadius: '12px' }}>Confirm</button>
                     <button onClick={() => handleAction(selectedBooking.id, 'Cancelled')} className="primary-button" style={{ flex: 1, padding: '1rem', fontWeight: 800, background: 'var(--bg-elevated)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '12px' }}>Reject</button>
                   </>
                )}
                {selectedBooking.status === 'Confirmed' && (
                   <>
                     <button onClick={() => handleAction(selectedBooking.id, 'Completed')} className="primary-button" style={{ flex: 1, padding: '1rem', fontWeight: 800, background: 'var(--success)', color: 'black', borderRadius: '12px' }}>Mark Completed</button>
                     <button onClick={() => handleAction(selectedBooking.id, 'Cancelled')} className="primary-button" style={{ flex: 1, padding: '1rem', fontWeight: 800, background: 'var(--bg-elevated)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '12px' }}>Cancel</button>
                   </>
                )}
                {selectedBooking.status === 'Completed' && <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, color: '#10b981', padding: '0.5rem' }}>Booking Completed</div>}
                {selectedBooking.status === 'Cancelled' && <div style={{ width: '100%', textAlign: 'center', fontWeight: 700, color: 'var(--danger)', padding: '0.5rem' }}>Booking Cancelled</div>}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MobileBookingCard({ booking, handleAction, onClick }) {
  const isNew = booking.status === 'Pending';
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
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>#{booking.id}</span>
            {isNew && <span style={{ background: '#FF4D2E', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', animation: 'pulse 2s infinite' }}>New</span>}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{booking.customerName || 'Guest'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{booking.guests} Guests</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem', fontWeight: 700 }}>{booking.time}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed var(--glass-border)' }}>
        <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : booking.status === 'Pending' ? 'badge-warning' : booking.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`} style={{ fontWeight: 800 }}>
          {booking.status}
        </span>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {booking.date}
        </div>
      </div>

      {/* Quick Action Button for Mobile */}
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        {booking.status === 'Pending' && (
           <>
             <button onClick={(e) => { e.stopPropagation(); handleAction(booking.id, 'Confirmed'); }} className="primary-button" style={{ flex: 1, padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px' }}>Confirm</button>
             <button onClick={(e) => { e.stopPropagation(); handleAction(booking.id, 'Cancelled'); }} className="primary-button" style={{ flex: 1, padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>Reject</button>
           </>
        )}
        {booking.status === 'Confirmed' && (
           <>
             <button onClick={(e) => { e.stopPropagation(); handleAction(booking.id, 'Completed'); }} className="primary-button" style={{ flex: 1, padding: '0.75rem', fontWeight: 800, fontSize: '0.9rem', borderRadius: '8px', background: 'var(--success)', color: 'black' }}>Complete</button>
           </>
        )}
      </div>
    </motion.div>
  );
}
