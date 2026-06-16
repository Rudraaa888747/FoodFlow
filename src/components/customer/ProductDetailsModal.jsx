import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Star, Clock, Info } from 'lucide-react';
import './ProductDetailsModal.css';

// Fallback logic for images
const FALLBACK_IMG = '/images/banners/cafe-banner.webp';

function VegBadge({ isVeg }) {
  return (
    <div style={{
      width: '14px', height: '14px', border: `2px solid ${isVeg ? '#16a34a' : '#dc2626'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px'
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isVeg ? '#16a34a' : '#dc2626' }} />
    </div>
  );
}

export default function ProductDetailsModal({ item, restaurantId, restaurantName, menu, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [imgErr, setImgErr] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const src = (!item.image || imgErr) ? FALLBACK_IMG : item.image;

  useEffect(() => {
    // Intelligent Recommendations Logic
    if (menu && menu.length > 0) {
      let filtered = [];
      const itemCat = (item.category || '').toLowerCase();
      
      // Pairings Logic
      if (itemCat.includes('coffee') || itemCat.includes('cafe')) {
        filtered = menu.filter(m => m.id !== item.id && (m.category.toLowerCase().includes('bakery') || m.category.toLowerCase().includes('dessert')));
      } else if (itemCat.includes('pizza')) {
        filtered = menu.filter(m => m.id !== item.id && (m.category.toLowerCase().includes('sides') || m.category.toLowerCase().includes('beverage')));
      } else if (itemCat.includes('burger')) {
        filtered = menu.filter(m => m.id !== item.id && (m.category.toLowerCase().includes('sides') || m.category.toLowerCase().includes('beverage')));
      } else if (itemCat.includes('main') || itemCat.includes('thali') || itemCat.includes('classic')) {
        filtered = menu.filter(m => m.id !== item.id && (m.category.toLowerCase().includes('bread') || m.category.toLowerCase().includes('beverage') || m.category.toLowerCase().includes('dessert')));
      } else if (itemCat.includes('south indian')) {
        filtered = menu.filter(m => m.id !== item.id && (m.category.toLowerCase().includes('beverage') || m.category.toLowerCase().includes('classic')));
      }

      // If no category-aware pairings found, pick random items from same restaurant
      if (filtered.length < 2) {
        filtered = menu.filter(m => m.id !== item.id);
      }

      // Randomize and pick 2
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 2));
    }
  }, [item, menu]);

  const handleToggleAddon = (addon) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = (item.price + addonsTotal) * quantity;

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      originalId: item.id,
      quantity,
      selectedAddons,
      price: item.price + addonsTotal, // Price per unit with addons
      restaurantId,
      restaurantName
    };
    onAdd(customizedItem);
    onClose();
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="product-modal-container"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        {/* Header / Hero Image */}
        <div className="product-modal-hero">
          <button className="product-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
          <img src={src} alt={item.name} onError={() => setImgErr(true)} />
        </div>

        {/* Content Body */}
        <div className="product-modal-content">
          <div className="product-modal-header-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <VegBadge isVeg={item.veg} />
              {item.isBestseller && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#d97706', fontSize: '0.75rem', fontWeight: 700, background: '#fef3c7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  <Flame size={12} /> Bestseller
                </div>
              )}
            </div>
            
            <h2 className="product-modal-title">{item.name}</h2>
            
            <div className="product-modal-badges">
              <span className="badge badge-rating"><Star size={12} fill="currentColor" /> {item.rating || '4.5'}</span>
              <span className="badge badge-time"><Clock size={12} /> {item.preparationTime || '20 mins'}</span>
            </div>
            
            <p className="product-modal-price">₹{item.price}</p>
            <p className="product-modal-desc">{item.description}</p>
          </div>

          <hr className="product-modal-divider" />

          {/* Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div className="product-modal-section">
              <h3 className="section-title">Customize your order</h3>
              <p className="section-subtitle">Optional add-ons to enhance your meal</p>
              
              <div className="addon-list">
                {item.addons.map((addon, idx) => {
                  const isSelected = selectedAddons.includes(addon);
                  return (
                    <button 
                      aria-label={`Toggle addon ${addon.name}`}
                      key={idx} 
                      className={`addon-item ${isSelected ? 'selected' : ''}`}
                      style={{ appearance: 'none', background: 'transparent', border: 'none', textAlign: 'left', width: '100%', padding: '0', display: 'flex' }}
                      onClick={() => handleToggleAddon(addon)}
                    >
                      <div className="addon-info">
                        <div className={`checkbox ${isSelected ? 'checked' : ''}`}></div>
                        <span className="addon-name">{addon.name}</span>
                      </div>
                      <span className="addon-price">+₹{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Pairings */}
          {recommendations.length > 0 && (
            <>
              {item.addons && item.addons.length > 0 && <hr className="product-modal-divider" />}
              <div className="product-modal-section">
                <h3 className="section-title">Perfect Pairings</h3>
                <p className="section-subtitle">Often ordered together with {item.name}</p>
                
                <div className="recommendation-scroll">
                  {recommendations.map(rec => (
                    <button aria-label={`Add ${rec.name}`} key={rec.id} className="recommendation-card" style={{ appearance: 'none', border: 'none', textAlign: 'left' }} onClick={() => {
                      // Simple rapid add for recommendation, or could replace current modal item
                      // We'll just add it to cart directly to prevent nesting modals
                      onAdd({ ...rec, quantity: 1, selectedAddons: [], restaurantId, restaurantName });
                    }}>
                      <img src={rec.image || FALLBACK_IMG} alt={rec.name} className="rec-img" />
                      <div className="rec-details">
                        <h4 className="rec-name">{rec.name}</h4>
                        <span className="rec-price">₹{rec.price}</span>
                      </div>
                      <div className="rec-add-btn">Add</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Sticky Footer */}
        <div className="product-modal-footer">
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <span>Add item</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
