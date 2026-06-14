import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Star, Plus, X, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getCustomizationOptions(name = '') {
  const n = name.toLowerCase();
  if (n.includes('pizza')) {
    return {
      sizes: [{ label: 'Regular (7")', price: 0 }, { label: 'Medium (10")', price: 120 }, { label: 'Large (12")', price: 220 }],
      addons: [{ label: 'Extra Cheese', price: 40 }, { label: 'Jalapenos', price: 20 }, { label: 'Black Olives', price: 30 }, { label: 'Paneer Chunks', price: 50 }]
    };
  }
  if (n.includes('burger') || n.includes('sandwich')) {
    return {
      sizes: [{ label: 'Standard', price: 0 }, { label: 'Make it a Meal (Fries & Coke)', price: 130 }],
      addons: [{ label: 'Extra Cheese Slice', price: 25 }, { label: 'Extra Patty', price: 65 }, { label: 'Bacon / Mutton strip', price: 55 }]
    };
  }
  if (n.includes('biryani') || n.includes('rice') || n.includes('pulao')) {
    return {
      sizes: [{ label: 'Half (Serves 1)', price: 0 }, { label: 'Full (Serves 2-3)', price: 160 }],
      addons: [{ label: 'Extra Raita', price: 25 }, { label: 'Boiled Egg', price: 15 }, { label: 'Extra Salan', price: 20 }]
    };
  }
  if (n.includes('shake') || n.includes('coffee') || n.includes('drink') || n.includes('tea')) {
    return {
      sizes: [{ label: 'Regular (330ml)', price: 0 }, { label: 'Large (500ml)', price: 60 }],
      addons: [{ label: 'Less Ice', price: 0 }, { label: 'Vanilla Ice Cream Scoop', price: 45 }, { label: 'Extra Espresso Shot', price: 50 }]
    };
  }
  if (n.includes('fries') || n.includes('nachos') || n.includes('wings')) {
    return {
      sizes: [{ label: 'Regular', price: 0 }, { label: 'Large', price: 70 }],
      addons: [{ label: 'Cheese Dip', price: 25 }, { label: 'Spicy Mayo', price: 20 }, { label: 'Peri Peri Sprinkle', price: 15 }]
    };
  }
  // Default fallback for Indian curries, breads, desserts, etc.
  return {
    sizes: [{ label: 'Standard Portion', price: 0 }, { label: 'Large Portion', price: 90 }],
    addons: [{ label: 'Extra Butter/Ghee', price: 20 }, { label: 'Extra Garnish', price: 10 }]
  };
}

export default function FoodCard({ item, restaurantName, restaurantId }) {
  const addToCart = useStore((state) => state.addToCart);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState({});

  const displayImage = item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
  const options = getCustomizationOptions(item.name);

  const sizePrice = options.sizes[selectedSize]?.price || 0;
  const addonsPrice = options.addons.reduce((sum, addon, idx) => sum + (selectedAddons[idx] ? addon.price : 0), 0);
  const totalPrice = item.price + sizePrice + addonsPrice;

  const handleToggleAddon = (idx) => {
    setSelectedAddons(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAdd = () => {
    const s = options.sizes[selectedSize].label;
    const activeAddons = options.addons.filter((_, i) => selectedAddons[i]).map(a => a.label);
    
    let customName = `${item.name} (${s}`;
    if (activeAddons.length > 0) customName += `, ${activeAddons.join(', ')}`;
    customName += ')';

    // Unique ID generation based on selection to split cart items
    const customId = `${item.id}-${selectedSize}-${activeAddons.length}`;

    addToCart({ 
      ...item, 
      id: customId, 
      name: customName, 
      price: totalPrice,
      restaurantId, 
      restaurantName 
    });
    
    setShowModal(false);
    setSelectedSize(0);
    setSelectedAddons({});
  };

  return (
    <>
      <div className="glass-panel food-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
        <div className="food-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={`badge ${item.veg ? 'badge-veg' : 'badge-nonveg'}`}>
              {item.veg ? 'VEG' : 'NON-VEG'}
            </span>
            <span className="flex-center text-secondary" style={{ fontSize: '0.8rem', gap: '2px', background: 'var(--glass-bg)', padding: '2px 6px', borderRadius: '4px' }}>
              <Star fill="var(--warning)" color="var(--warning)" size={12} />
              {item.rating || '4.5'}
            </span>
          </div>
          
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{item.name}</h4>
          <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>₹{item.price}</p>
          
          <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', paddingRight: '1rem' }}>
            {item.desc || 'Delicious food made with fresh ingredients, served piping hot and ready to eat.'}
          </p>
        </div>
        
        <div className="food-card-img-container" style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <img src={displayImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }} />
          
          <button 
            className="primary-button" 
            style={{ 
              position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', 
              padding: '0.5rem 1.5rem', fontSize: '0.9rem', fontWeight: 800,
              background: 'var(--bg-elevated)', color: '#10b981', border: '1px solid #e2e8f0',
              borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
              width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
            }}
            onClick={() => setShowModal(true)}
          >
            ADD <Plus size={16} strokeWidth={3} />
          </button>
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#fff', fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            Customisable
          </div>
        </div>
      </div>

      {/* SWIGGY-STYLE BOTTOM SHEET MODAL FOR CUSTOMIZATION */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ background: 'var(--bg-secondary)', padding: '0', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '600px', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ padding: '1.5rem 1.5rem 1rem', background: 'var(--bg-elevated)', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge ${item.veg ? 'badge-veg' : 'badge-nonveg'}`} style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                      {item.veg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>Customize {item.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>₹{item.price}</p>
                </div>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={displayImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              {/* Scrollable Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Size Section */}
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Quantity / Size</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Choose 1 option</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {options.sizes.map((size, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem', borderBottom: idx < options.sizes.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedSize === idx ? '#10b981' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedSize === idx && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />}
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{size.label}</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{size.price > 0 ? `+₹${size.price}` : ''}</span>
                        <input type="radio" name="size" checked={selectedSize === idx} onChange={() => setSelectedSize(idx)} style={{ display: 'none' }} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Add-ons Section */}
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Add-ons</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Select any options (Optional)</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {options.addons.map((addon, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem', borderBottom: idx < options.addons.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${selectedAddons[idx] ? '#FF6B35' : '#cbd5e1'}`, background: selectedAddons[idx] ? '#FF6B35' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {selectedAddons[idx] && <Check size={14} color="#fff" strokeWidth={4} />}
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{addon.label}</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{addon.price > 0 ? `+₹${addon.price}` : 'FREE'}</span>
                        <input type="checkbox" checked={!!selectedAddons[idx]} onChange={() => handleToggleAddon(idx)} style={{ display: 'none' }} />
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              </div>

              <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-elevated)', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
                <button 
                  onClick={handleAdd}
                  style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                >
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '1.1rem' }}>₹{totalPrice}</span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Total</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Add Item <ChevronRight size={20} strokeWidth={3} /></span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
