import React, { useState } from 'react';
import { Megaphone, Plus, Tag, Clock, X, Ticket, ChevronRight, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantOffers() {
  const [offers, setOffers] = useState([
    { id: 1, title: 'Navratri Special', discount: '20% OFF', code: 'NAVRATRI20', status: 'Active', expires: '2026-10-15', usage: 142 },
    { id: 2, title: 'Weekend Bonanza', discount: 'Flat ₹150 OFF', code: 'WEEKEND150', status: 'Active', expires: '2026-06-30', usage: 89 }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: '', discount: '', code: '', expires: '' });

  const handleAddOffer = (e) => {
    e.preventDefault();
    toast.error("Add action is disabled in demo mode");
    return;
    setShowAddModal(false);
    setNewOffer({ title: '', discount: '', code: '', expires: '' });
    toast.success('Campaign launched successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex-col" style={{ gap: '2rem' }}>
      
      {/* Header */}
      <header className="flex-between">
        <motion.div variants={itemVariants}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Offers & Marketing</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Create and manage promotional campaigns.</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <button className="primary-button" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> New Campaign
          </button>
        </motion.div>
      </header>

      {/* Dashboard Stats */}
      <motion.div variants={itemVariants} className="grid-cols-3">
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color="var(--success)" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Campaigns</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{offers.filter(o => o.status === 'Active').length}</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ticket size={24} color="var(--info)" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Redemptions</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>231</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={24} color="var(--warning)" />
          </div>
          <div>
            <p className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Revenue Lift</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>+12.4%</p>
          </div>
        </div>
      </motion.div>

      {/* Campaigns Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Running Campaigns</h2>
          <span className="badge badge-neutral">{offers.length}</span>
        </div>
        
        <div className="grid-cols-3">
          <AnimatePresence>
            {offers.map((offer, index) => (
              <motion.div 
                key={offer.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel" 
                style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}
                whileHover={{ y: -5, boxShadow: '0 15px 30px -10px rgba(0,0,0,0.5)' }}
              >
                {/* Status Indicator */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{offer.status}</span>
                </div>
                
                {/* Ticket Top */}
                <div style={{ padding: '2rem 1.5rem 1.5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', borderBottom: '2px dashed var(--glass-border-strong)', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-primary)', borderRight: '1px solid var(--glass-border)' }} />
                  <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-primary)', borderLeft: '1px solid var(--glass-border)' }} />
                  
                  <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                    <Megaphone size={20} className="text-secondary" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{offer.title}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent-primary)' }}>{offer.discount}</div>
                </div>
                
                {/* Ticket Bottom */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="flex-between">
                      <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Tag size={14} /> Code
                      </div>
                      <span style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                        {offer.code}
                      </span>
                    </div>
                    <div className="flex-between">
                      <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Clock size={14} /> Expires
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {new Date(offer.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex-between">
                      <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Ticket size={14} /> Usage
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {offer.usage} redemptions
                      </span>
                    </div>
                  </div>
                  
                  <button className="secondary-button" style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    View Analytics <ChevronRight size={16} className="text-secondary" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

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
                <h2 style={{ fontSize: '1.5rem' }}>Create Campaign</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}} onMouseOut={e => {e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-elevated)'}}>
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={handleAddOffer} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Campaign Title</label>
                  <input type="text" placeholder="e.g. Navratri Special" className="glass-input" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} required />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Offer Details</label>
                  <input type="text" placeholder="e.g. 20% OFF or Flat ₹150" className="glass-input" value={newOffer.discount} onChange={e => setNewOffer({...newOffer, discount: e.target.value})} required />
                </div>
                
                <div className="offer-modal-grid" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Promo Code</label>
                    <input type="text" placeholder="e.g. NAVRATRI20" className="glass-input" value={newOffer.code} onChange={e => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Expiration Date</label>
                    <input type="date" className="glass-input" value={newOffer.expires} onChange={e => setNewOffer({...newOffer, expires: e.target.value})} required style={{ colorScheme: 'dark' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button" style={{ flex: 1 }}>Launch Campaign</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
