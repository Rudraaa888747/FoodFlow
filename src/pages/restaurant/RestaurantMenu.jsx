import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, X, Search, Edit2, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantMenu() {
  const restaurants = useStore(state => state.restaurants);
  const addMenuItem = useStore(state => state.addMenuItem);
  
  const RESTAURANT_ID = 'rest-2';
  const restaurant = restaurants.find(r => r.id === RESTAURANT_ID);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', desc: '', veg: true, category: 'Main Course' });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleAddItem = (e) => {
    e.preventDefault();
    toast.error("Add action is disabled in demo mode");
    return;
    
    addMenuItem(RESTAURANT_ID, {
      id: `r2-new-${Date.now()}`,
      ...newItem,
      price: Number(newItem.price),
      rating: "4.5",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
    });
    
    toast.success('Menu item added successfully!');
    setShowAddModal(false);
    setNewItem({ name: '', price: '', desc: '', veg: true, category: 'Main Course' });
  };

  const categories = ['All', ...new Set(restaurant?.menu.map(item => item.category) || [])];
  
  const filteredMenu = restaurant?.menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col" style={{ gap: '2rem' }}>
      
      {/* Header */}
      <header className="flex-between">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Menu Management</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Organize and update your culinary offerings.</p>
        </div>
        <button className="primary-button" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> New Item
        </button>
      </header>

      {/* Controls */}
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search your menu..." 
            className="glass-input" 
            style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />
        
        <div className="hide-scroll-x" style={{ display: 'flex', gap: '0.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: activeCategory === cat ? 'var(--text-primary)' : 'transparent',
                color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: activeCategory === cat ? '1px solid transparent' : '1px solid var(--glass-border)',
                cursor: 'pointer',
                fontWeight: activeCategory === cat ? 600 : 400,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid-cols-4">
        <AnimatePresence>
          {filteredMenu.map((item, index) => {
            const displayImage = item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
            // Console Validation
            console.log(`[Validation - RestaurantMenu] Product ID: ${item.id} | Name: ${item.name} | Image Source: ${item.image}`);
            
            return (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel" 
                style={{ 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid var(--glass-border-light)'
                }}
                whileHover={{ y: -5, borderColor: 'var(--glass-border-strong)' }}
              >
                <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                  <img src={displayImage} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}>
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span className={`badge ${item.veg ? "badge-success" : "badge-danger"}`} style={{ backdropFilter: 'blur(4px)', background: item.veg ? 'rgba(23, 201, 100, 0.2)' : 'rgba(243, 18, 96, 0.2)' }}>
                      {item.veg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none' }} />
                </div>
              
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Tag size={12} /> {item.category}
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.name}</h4>
                <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  A delicious classic, prepared with the finest ingredients and authentic spices.
                </p>
                <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>₹{item.price}</span>
                  <button onClick={() => toast.error("Delete action is disabled in demo mode")} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredMenu.length === 0 && (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
          <p>No items found matching "{search}" in {activeCategory}.</p>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-panel" 
              style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border-strong)', boxShadow: '0 25px 50px -12px rgba(0,0,0,1)' }}
            >
              <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>New Menu Item</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}} onMouseOut={e => {e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-elevated)'}}>
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Item Name</label>
                  <input type="text" placeholder="e.g. Butter Chicken" className="glass-input" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Price (₹)</label>
                  <input type="number" placeholder="e.g. 399" className="glass-input" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                  <textarea placeholder="Describe the dish..." className="glass-input" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} rows={3} style={{ resize: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Dietary</label>
                    <select className="glass-input" value={newItem.veg ? 'veg' : 'non-veg'} onChange={e => setNewItem({...newItem, veg: e.target.value === 'veg'})} style={{ WebkitAppearance: 'none' }}>
                      <option value="veg" style={{ color: 'black' }}>Vegetarian</option>
                      <option value="non-veg" style={{ color: 'black' }}>Non-Vegetarian</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                    <select className="glass-input" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={{ WebkitAppearance: 'none' }}>
                      <option value="Punjabi" style={{ color: 'black' }}>Punjabi</option>
                      <option value="Starters" style={{ color: 'black' }}>Starters</option>
                      <option value="Main Course" style={{ color: 'black' }}>Main Course</option>
                      <option value="Breads" style={{ color: 'black' }}>Breads</option>
                      <option value="Desserts" style={{ color: 'black' }}>Desserts</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button" style={{ flex: 1 }}>Create Item</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
