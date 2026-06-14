import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Star, Clock, MapPin, Plus, Flame, Check, Search, ChevronRight, Calendar, Users, Info, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProductDetailsModal from '../../components/customer/ProductDetailsModal';
import ProgressiveImage from '../../components/ui/ProgressiveImage';

const FALLBACK_IMG = '/images/banners/cafe-banner.webp';

export default function RestaurantDetails() {
  const { id } = useParams();
  const idStr = id || '1';
  const restaurants = useStore(state => state.restaurants);
  const restaurant = restaurants.find(r => String(r.id) === idStr) || restaurants[0];
  const addToCart = useStore(s => s.addToCart);
  const cart = useStore(s => s.cart) || [];
  const cartItemCount = cart.reduce((a, i) => a + i.quantity, 0);
  const cartTotal = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Route Prefetching & Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    import('./Cart');
    import('./Checkout');
  }, []);

  // Booking State
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('19:30');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Product Details Modal State
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  const handleAddClick = (item, actionType = 'add') => {
    // Hybrid logic:
    // If user clicks anywhere on the card, OR if they click 'Add' and item has addons -> Open Modal
    if (actionType === 'card' || (item.addons && item.addons.length > 0)) {
      setSelectedProductDetails(item);
    } else {
      // Instant add if they explicitly clicked the 'Add' button and there are no addons
      addToCart(item);
      toast.success('Added to cart!', { icon: '🍔' });
    }
  };

  const handleModalAdd = (customizedItem) => {
    addToCart(customizedItem);
    setSelectedProductDetails(null);
    toast.success('Added to cart!', { icon: '🍔' });
  };

  const placeBooking = useStore(s => s.placeBooking);

  const handleBooking = () => {
    setIsBooking(true);
    placeBooking({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      customerName: useStore.getState().user?.name || 'Guest User',
      customerPhone: '+91 9876543210',
      guests,
      date,
      time,
      specialNotes: ''
    }, (res) => {
      setIsBooking(false);
      if (res && res.success === false) {
        toast.error(res.error || 'Failed to place booking. Please try again.');
        return;
      }
      setShowBookingModal(false);
      toast.success(`Table booked for ${guests} on ${date} at ${time}!`, { icon: '🎉' });
    });
  };

  if (!restaurant)
    return (
      <div style={{ padding: '8rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h2 style={{ fontWeight: 600 }}>Restaurant not found.</h2>
      </div>
    );

  const categories = ['All', ...new Set(restaurant.menu.map(i => i.category))];

  const filtered = restaurant.menu.filter(item => {
    const catOk = activeCategory === 'All' || item.category === activeCategory;
    const searchOk = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catOk && searchOk;
  });

  const grouped = activeCategory === 'All'
    ? categories.slice(1).reduce((acc, cat) => {
      const items = filtered.filter(i => i.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    }, {})
    : { [activeCategory]: filtered };

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: '52vh', minHeight: '360px', overflow: 'hidden' }}>
        <motion.img
          initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }}
          src={restaurant.coverImage} alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem 5%' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {/* Cuisine pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {restaurant.cuisine.map(c => (
                <span key={c} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '999px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  {c}
                </span>
              ))}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#fff', marginBottom: '1rem' }}>
              {restaurant.name}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
              <MetaChip icon={<Star size={14} fill="#fbbf24" color="#fbbf24" />} text={restaurant.rating} accent="#fbbf24" />
              <MetaChip icon={<Clock size={14} />} text={`${restaurant.deliveryTime} mins`} />
              <MetaChip icon={<MapPin size={14} />} text={restaurant.address} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Info strip */}
      <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.25rem 5%', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <InfoPill icon={<Star size={15} fill="#fbbf24" color="#fbbf24" />} value={restaurant.rating} label="Rating" />
          <div style={{ width: '1px', height: '32px', background: 'var(--glass-border)' }} />
          <InfoPill icon={<Clock size={15} color="#6366f1" />} value={`${restaurant.deliveryTime} min`} label="Delivery" />
          <div style={{ width: '1px', height: '32px', background: 'var(--glass-border)' }} />
          <InfoPill icon={<MapPin size={15} color="#10b981" />} value={restaurant.address} label="Location" />
          
          {/* Book Table Button */}
          <div style={{ marginLeft: 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingModal(true)}
              style={{
                background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
              }}
            >
              <Calendar size={16} /> Book Table
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sticky nav + search */}
      <div style={{ position: 'sticky', top: '64px', zIndex: 40, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="resto-details-nav" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0.875rem 5%', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.125rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem',
                  whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeCategory === cat ? '#0f172a' : 'transparent',
                  color: activeCategory === cat ? '#fff' : '#64748b',
                  border: activeCategory === cat ? '1px solid #0f172a' : '1px solid #e2e8f0',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '999px', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', gap: '0.5rem', minWidth: '220px' }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text" placeholder="Search menu..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: '#1e293b', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content (Menu + Booking Sidebar) */}
      <div className="resto-main-grid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 5% 0' }}>
        
        {/* Left Column: Menu */}
        <div className="menu-column">
          {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1rem' }}>No items found.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{category}</h2>
                <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {items.length}
                </span>
              </div>

              <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {items.map((item, i) => (
                  <MenuCard
                    key={item.id} item={item}
                    restaurantId={restaurant.id} restaurantName={restaurant.name}
                    delay={i * 0.04} onAdd={handleAddClick}
                  />
                ))}
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      {/* Floating Cart CTA (Mobile Friendly) */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
              left: '5%',
              right: '5%',
              zIndex: 50,
            }}
          >
            <button
              onClick={() => window.location.href = '/customer/cart'}
              style={{
                width: '100%',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                  {cartItemCount} items
                </div>
                <span>View Cart</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ₹{cartTotal.toFixed(2)}
                <ChevronRight size={18} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProductDetails && (
          <ProductDetailsModal 
            item={selectedProductDetails}
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            menu={restaurant.menu}
            onClose={() => setSelectedProductDetails(null)} 
            onAdd={handleModalAdd} 
          />
        )}
        {showBookingModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowBookingModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ background: 'var(--bg-elevated)', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '2rem', position: 'relative', zIndex: 1 }}
            >
              <button onClick={() => setShowBookingModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Calendar size={20} color="#FF6B35" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Book a Table</h3>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guests</label>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button key={num} onClick={() => setGuests(num)} style={{
                      flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%',
                      background: guests === num ? '#0f172a' : '#f8fafc',
                      color: guests === num ? '#fff' : '#475569',
                      border: guests === num ? 'none' : '1px solid #e2e8f0',
                      fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Today', 'Tomorrow'].map(d => (
                    <button key={d} onClick={() => setDate(d)} style={{
                      flex: 1, padding: '0.75rem', borderRadius: '12px',
                      background: date === d ? '#e0f2fe' : '#f8fafc',
                      color: date === d ? '#0369a1' : '#475569',
                      border: date === d ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
                      fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                    <button key={t} onClick={() => setTime(t)} style={{
                      padding: '0.5rem 1rem', borderRadius: '999px',
                      background: time === t ? '#ecfdf5' : '#f8fafc',
                      color: time === t ? '#059669' : '#475569',
                      border: time === t ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleBooking} disabled={isBooking}
                style={{
                  width: '100%', padding: '1rem', borderRadius: '14px',
                  background: '#FF6B35', color: '#fff', border: 'none',
                  fontWeight: 800, fontSize: '1rem', cursor: isBooking ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: isBooking ? 0.7 : 1, boxShadow: '0 4px 15px rgba(255,107,53,0.3)'
                }}
              >
                {isBooking ? 'Requesting...' : 'Request Booking'}
              </motion.button>
              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                Instant confirmation · No booking fees
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 0.25rem', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

function AddonModal({ item, onClose, onConfirm }) {
  const [selectedAddons, setSelectedAddons] = useState([]);

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirm = () => {
    onConfirm(item, selectedAddons);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        style={{ background: 'var(--bg-elevated)', width: '100%', maxWidth: '500px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '1.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Customize</h3>
          <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>{item.name} Add-ons</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {item.addons.map((addon, i) => {
              const isSelected = selectedAddons.find(a => a.name === addon.name);
              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', background: isSelected ? '#f8fafc' : '#fff', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: isSelected ? 'none' : '2px solid #cbd5e1', background: isSelected ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{addon.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>+₹{addon.price}</span>
                  <input type="checkbox" checked={!!isSelected} onChange={() => toggleAddon(addon)} style={{ display: 'none' }} />
                </label>
              );
            })}
          </div>
        </div>

        <button onClick={handleConfirm} style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Add to Cart • ₹{item.price + selectedAddons.reduce((acc, a) => acc + a.price, 0)}
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function MetaChip({ icon, text, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: accent || 'rgba(255,255,255,0.88)', fontSize: '0.875rem', fontWeight: 500 }}>
      {icon}<span>{text}</span>
    </div>
  );
}

function InfoPill({ icon, value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon}
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>{value}</p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
      </div>
    </div>
  );
}

const MenuCard = React.memo(({ item, restaurantId, restaurantName, delay, onAdd }) => {
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const src = (!item.image || imgErr) ? FALLBACK_IMG : item.image;

  const handleCardClick = () => {
    onAdd({ ...item, restaurantId, restaurantName }, 'card');
  };

  const handleAddButtonClick = (e) => {
    e.stopPropagation();
    onAdd({ ...item, restaurantId, restaurantName }, 'add');
    if (!item.addons || item.addons.length === 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.09)' }}
      style={{
        background: 'var(--bg-elevated)', border: '1px solid #e2e8f0', borderRadius: '14px',
        padding: '1.125rem', display: 'flex', gap: '1rem', transition: 'all 0.25s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer'
      }}
    >
      {/* Text side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {item.isBestseller && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Flame size={11} /> Bestseller
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>{item.name}</h3>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', flexShrink: 0 }}>₹{item.price}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.55, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>

        <button onClick={handleAddButtonClick}
          style={{
            marginTop: 'auto', alignSelf: 'flex-start', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.45rem 1rem', borderRadius: '999px',
            fontSize: '0.8rem', fontWeight: 700, border: 'none', transition: 'all 0.2s',
            background: added ? '#10b981' : '#0f172a',
            color: '#fff',
          }}
        >
          <AnimatePresence mode="wait">
            {added
              ? <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={13} /> Added!</motion.span>
              : <motion.span key="add" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Plus size={13} /> Add</motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

      {/* Image */}
      <div style={{ width: '110px', height: '110px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-tertiary)' }}>
        <ProgressiveImage src={src} alt={item.name} objectFit="cover" />
      </div>
    </motion.div>
  );
});