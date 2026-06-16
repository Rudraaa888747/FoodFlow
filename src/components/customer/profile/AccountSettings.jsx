import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Bell, Shield, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function AccountSettings({ user, setActiveSettingModal }) {
  return (
    <motion.div key="settings" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Account Details */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #F0EFEC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Phone Number</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>+91 98765 43210</p>
              </div>
              <button 
                onClick={() => setActiveSettingModal('account')} 
                aria-label="Edit Phone Number"
                style={{ fontSize: '0.8rem', color: '#FF4D2E', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                EDIT
              </button>
            </div>
            <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Email Address</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.email}</p>
              </div>
              <button 
                onClick={() => setActiveSettingModal('account')} 
                aria-label="Edit Email Address"
                style={{ fontSize: '0.8rem', color: '#FF4D2E', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                EDIT
              </button>
            </div>
          </div>
        </div>

        {/* Manage Addresses */}
        <button 
          onClick={() => setActiveSettingModal('addresses')} 
          aria-label="Manage Addresses"
          style={{ width: '100%', textAlign: 'left', background: 'var(--bg-elevated)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #F0EFEC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px' }}><MapPin size={20} color="#111110" /></div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Manage Addresses</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Add or remove saved delivery addresses</p>
            </div>
          </div>
          <ChevronRight size={18} color="#9B9B96" />
        </button>

        {/* Payments */}
        <button 
          onClick={() => setActiveSettingModal('payments')} 
          aria-label="Manage Payments"
          style={{ width: '100%', textAlign: 'left', background: 'var(--bg-elevated)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #F0EFEC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px' }}><CreditCard size={20} color="#111110" /></div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Payments</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Manage saved cards, UPI, and wallets</p>
            </div>
          </div>
          <ChevronRight size={18} color="#9B9B96" />
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setActiveSettingModal('notifications')} 
          aria-label="Manage Notifications"
          style={{ width: '100%', textAlign: 'left', background: 'var(--bg-elevated)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #F0EFEC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px' }}><Bell size={20} color="#111110" /></div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Notifications</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Manage promo emails and push alerts</p>
            </div>
          </div>
          <ChevronRight size={18} color="#9B9B96" />
        </button>

        {/* Privacy & Security */}
        <button 
          onClick={() => setActiveSettingModal('privacy')} 
          aria-label="Manage Privacy and Security"
          style={{ width: '100%', textAlign: 'left', background: 'var(--bg-elevated)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #F0EFEC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px' }}><Shield size={20} color="#111110" /></div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Privacy & Security</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Data settings and account management</p>
            </div>
          </div>
          <ChevronRight size={18} color="#9B9B96" />
        </button>
        
      </motion.div>
    </motion.div>
  );
}
