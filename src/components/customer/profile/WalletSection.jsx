import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Gift, Zap, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function WalletSection({ walletBalance, addMoney, showToast, savedAmt }) {
  const [customAmt, setCustomAmt] = useState('');

  return (
    <motion.div key="wallet" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }}>

      {/* Balance hero */}
      <motion.div
        variants={fadeUp}
        style={{
          background: '#111110', borderRadius: '24px',
          padding: '2rem 2.5rem', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          overflow: 'hidden', position: 'relative',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', right: '-30px', top: '-30px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,77,46,0.15) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
            Available balance
          </div>
          <div aria-live="polite" style={{ fontSize: '3rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.05em', lineHeight: 1 }}>
            ₹{(walletBalance || 0).toFixed(2)}
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Gift size={14} color="rgba(255,77,46,0.8)" />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>₹{savedAmt} saved via cashbacks</span>
          </div>
        </div>
        <Wallet size={52} color="rgba(255,255,255,0.07)" aria-hidden="true" style={{ flexShrink: 0 }} />
      </motion.div>

      {/* Quick add amounts */}
      <motion.div
        variants={fadeUp}
        style={{
          background: 'var(--bg-elevated)', borderRadius: '24px',
          padding: '2rem', marginBottom: '1.25rem',
          border: '1px solid #F0EFEC',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
          Add money
        </h3>
        <div className="profile-add-money-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[200, 500, 1000, 2000].map(amt => (
            <motion.button
              key={amt}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => { addMoney(amt); showToast(`₹${amt} added to wallet!`); }}
              aria-label={`Add ₹${amt} to wallet`}
              style={{
                background: 'var(--bg-primary)', color: 'var(--text-primary)',
                border: '1.5px solid #E8E7E4', borderRadius: '12px',
                padding: '0.9rem 0', fontSize: '0.95rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              }}
            >
              <Plus size={14} color="#FF4D2E" aria-hidden="true" />
              ₹{amt}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label htmlFor="custom-wallet-amount" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            Custom amount
          </label>
          <input
            id="custom-wallet-amount"
            type="number"
            value={customAmt}
            onChange={e => setCustomAmt(e.target.value)}
            placeholder="Custom amount..."
            style={{
              flex: 1, border: '1.5px solid #E8E7E4',
              borderRadius: '12px', padding: '0.8rem 1.1rem',
              fontSize: '0.95rem', outline: 'none', color: 'var(--text-primary)',
              background: 'var(--bg-primary)', fontWeight: 500,
            }}
            onFocus={e => e.target.style.borderColor = '#FF4D2E'}
            onBlur={e => e.target.style.borderColor = '#E8E7E4'}
          />
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const amt = parseFloat(customAmt);
              if (amt > 0) {
                addMoney(amt);
                showToast(`₹${amt} added to wallet!`);
                setCustomAmt('');
              }
            }}
            aria-label="Add custom amount to wallet"
            style={{
              background: '#FF4D2E', color: '#FFFFFF',
              border: 'none', borderRadius: '12px',
              padding: '0.8rem 1.6rem', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            Add
          </motion.button>
        </div>
      </motion.div>

      {/* Offers strip */}
      <motion.div
        variants={fadeUp}
        role="button"
        tabIndex={0}
        aria-label="5% cashback offer — use code WALLET5 on orders above ₹299"
        style={{
          background: '#FFF1EE', borderRadius: '18px',
          padding: '1.2rem 1.5rem',
          border: '1px solid #FFD5CC',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: '#FF4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#CC3318' }}>5% cashback on next order</div>
            <div style={{ fontSize: '0.78rem', color: '#E8715A' }}>Use code <b>WALLET5</b> · Min ₹299</div>
          </div>
        </div>
        <ChevronRight size={18} color="#CC3318" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}
