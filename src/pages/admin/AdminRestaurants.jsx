import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { Trash2, Search, Plus, Store, Star, ArrowRight, X, DollarSign, Users, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRestaurants() {
  const restaurants = useStore(state => state.restaurants);
  const orders = useStore(state => state.orders);
  const bookings = useStore(state => state.bookings);
  const deleteRestaurant = useStore(state => state.deleteRestaurant);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRest, setNewRest] = useState({ name: '', cuisine: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleOnboard = (e) => {
    e.preventDefault();
    toast.error("Add action is disabled in demo mode");
  };

  const filteredRestaurants = restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
      {/* Header */}
      {!isMobile && (
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Restaurants Management</h1>
            <p className="text-secondary">Manage active restaurants on the FOODFLOW platform.</p>
          </div>
          <button className="primary-button" style={{ background: '#3742fa', color: 'white' }} onClick={() => setShowAddModal(true)}>
            <Plus size={20} /> Onboard Restaurant
          </button>
        </header>
      )}

      {isMobile && (
        <div style={{ padding: '1rem', background: '#050505', color: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Restaurants</h1>
            <button onClick={() => setShowAddModal(true)} style={{ background: '#3742fa', color: '#FFF', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} />
            </button>
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input 
              type="text" 
              placeholder="Search restaurants..." 
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
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search restaurants..." 
              className="glass-input" 
              style={{ paddingLeft: '3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      {isMobile ? (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#050505', minHeight: '100vh' }}>
          {filteredRestaurants.map(rest => {
            const restOrders = orders.filter(o => o.restaurantId === rest.id);
            const revenue = restOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
            return (
              <MobileRestaurantCard 
                key={rest.id} 
                restaurant={rest} 
                revenue={revenue} 
                orderCount={restOrders.length}
                onClick={() => setSelectedRestaurant(rest)} 
              />
            );
          })}
          {filteredRestaurants.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>No restaurants found.</div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border-light)' }}>
                <th style={{ paddingBottom: '1rem' }}>Restaurant Name</th>
                <th style={{ paddingBottom: '1rem' }}>Cuisine</th>
                <th style={{ paddingBottom: '1rem' }}>Rating</th>
                <th style={{ paddingBottom: '1rem' }}>Menu Items</th>
                <th style={{ paddingBottom: '1rem' }}>Status</th>
                <th style={{ paddingBottom: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map(rest => (
                <tr key={rest.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{rest.name}</td>
                  <td style={{ padding: '1rem 0' }}>{rest.cuisine.join(', ')}</td>
                  <td style={{ padding: '1rem 0' }}><span className="badge" style={{ background: 'rgba(23, 201, 100, 0.1)', color: 'var(--success)' }}>{rest.rating} ★</span></td>
                  <td style={{ padding: '1rem 0' }}>{rest.menu.length} items</td>
                  <td style={{ padding: '1rem 0' }}><span style={{ color: 'var(--success)' }}>Active</span></td>
                  <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setSelectedRestaurant(rest)}
                      style={{ background: 'rgba(55, 66, 250, 0.1)', border: 'none', color: '#3742fa', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRestaurants.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No restaurants found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Onboard Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#111', border: '1px solid #2A2A2A' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, color: '#FFF' }}>Onboard New Restaurant</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleOnboard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Restaurant Name" className="glass-input" style={{ background: '#171717', border: '1px solid #333', color: '#FFF' }} value={newRest.name} onChange={e => setNewRest({...newRest, name: e.target.value})} required />
              <input type="text" placeholder="Cuisine (e.g. North Indian, Chinese)" className="glass-input" style={{ background: '#171717', border: '1px solid #333', color: '#FFF' }} value={newRest.cuisine} onChange={e => setNewRest({...newRest, cuisine: e.target.value})} required />
              
              <button type="submit" className="primary-button" style={{ marginTop: '1rem', width: '100%', background: '#3742fa', color: 'white', padding: '1rem', borderRadius: '12px' }}>Send Onboarding Invite</button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantDetailDrawer 
            restaurant={selectedRestaurant} 
            orders={orders.filter(o => o.restaurantId === selectedRestaurant.id)}
            bookings={bookings.filter(b => b.restaurantId === selectedRestaurant.id)}
            onClose={() => setSelectedRestaurant(null)} 
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileRestaurantCard({ restaurant, revenue, orderCount, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px',
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <img 
          src={restaurant.logo} 
          alt={restaurant.name} 
          style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} 
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFF' }}>{restaurant.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#10B981', fontSize: '0.7rem', fontWeight: 700 }}>
               <Star size={10} /> {restaurant.rating}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>{restaurant.cuisine.join(', ')}</div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #2A2A2A' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Revenue</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10B981' }}>₹{revenue.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Total Orders</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{orderCount}</div>
        </div>
      </div>
    </motion.div>
  );
}

function RestaurantDetailDrawer({ restaurant, orders, bookings, onClose, isMobile }) {
  const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  
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
        <div style={{ height: '200px', position: 'relative' }}>
           <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111, transparent)' }} />
           <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}>
             <X size={20} />
           </button>
           <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFF', margin: 0 }}>{restaurant.name}</h2>
              <div style={{ fontSize: '0.85rem', color: '#DDD', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10B981', fontWeight: 700 }}><Star size={14} /> {restaurant.rating}</span>
                <span>•</span>
                <span>{restaurant.location}</span>
              </div>
           </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                  <DollarSign size={14} color="#10B981" /> <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Revenue</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>₹{revenue.toLocaleString()}</div>
             </div>
             <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                  <Package size={14} color="#3742fa" /> <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Orders</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{orders.length}</div>
             </div>
             <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                  <Users size={14} color="#F59E0B" /> <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Bookings</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{bookings.length}</div>
             </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Status & Operations</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>Platform Status</span>
                <span style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>Menu Items</span>
                <span style={{ color: '#AAA', fontSize: '0.9rem' }}>{restaurant.menu.length} Items</span>
              </div>
            </div>
          </div>
          
          <button onClick={(e) => { e.preventDefault(); toast.error("Suspend action is disabled in demo mode"); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
            Suspend Restaurant
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
