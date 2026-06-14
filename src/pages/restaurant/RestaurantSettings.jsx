import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Phone, MapPin, Clock, Printer, Bell, Shield, CreditCard,
  Mail, MessageSquare, Smartphone, Landmark, Lock, Key, LogOut, ChevronRight
} from 'lucide-react';

/* ─── Reusable toggle switch ──────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        width: '44px', height: '24px', minHeight: '24px', borderRadius: '12px', position: 'relative',
        cursor: 'pointer', border: checked ? '1px solid var(--success-border)' : '1px solid var(--glass-border-strong)',
        background: checked ? 'var(--success)' : 'var(--bg-elevated)',
        transition: 'background 0.2s, border-color 0.2s', flexShrink: 0, padding: 0,
      }}
    >
      <motion.div
        animate={{ left: checked ? '22px' : '2px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: '18px', height: '18px', background: checked ? 'white' : 'var(--text-secondary)',
          borderRadius: '50%', position: 'absolute', top: '2px',
          boxShadow: checked ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
        }}
      />
    </button>
  );
}

/* ─── Reusable row with toggle ────────────────────────────────── */
function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex-between" style={{ gap: '1.5rem' }}>
      <div>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{title}</h4>
        <p className="text-secondary" style={{ fontSize: '0.85rem' }}>{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const SECTION_HEADER = (title, desc) => (
  <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border-light)', paddingBottom: '1.5rem' }}>
    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h2>
    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>{desc}</p>
  </div>
);

export default function RestaurantSettings() {
  const [activeTab, setActiveTab] = useState('general');

  // operations
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [autoKOT, setAutoKOT] = useState(false);
  const [openTime, setOpenTime] = useState('11:00');
  const [closeTime, setCloseTime] = useState('23:00');

  // notifications
  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyCancellation, setNotifyCancellation] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);

  // billing
  const [autoPayouts, setAutoPayouts] = useState(true);

  // security
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.error('Save action is disabled in demo mode');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Store size={18} /> },
    { id: 'operations', label: 'Operations', icon: <Clock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'billing', label: 'Billing & Payouts', icon: <CreditCard size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex-col" style={{ gap: '2rem' }}>

      {/* Header */}
      <header className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <motion.div variants={itemVariants}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Settings</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Manage your restaurant profile and operational preferences.</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <button className="primary-button" onClick={handleSave}>
            Save Changes
          </button>
        </motion.div>
      </header>

      <div className="settings-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Sidebar Nav */}
        <motion.div variants={itemVariants} className="settings-sidebar" style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: activeTab === tab.id ? 'var(--glass-bg-hover)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 500 : 400,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ flex: 1, padding: '2.5rem', minHeight: '600px' }}>

          <AnimatePresence mode="wait">

            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {SECTION_HEADER('Business Profile', 'This information will be displayed publicly to customers.')}

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="settings-row" style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}><Store size={14} /> Restaurant Name</label>
                      <input type="text" className="glass-input" defaultValue="Punjab Da Dhaba" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}><Phone size={14} /> Phone Number</label>
                      <input type="text" className="glass-input" defaultValue="+91 9876543210" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}><MapPin size={14} /> Address</label>
                    <textarea className="glass-input" rows={3} defaultValue="SG Highway, Ahmedabad, Gujarat" style={{ resize: 'none' }} />
                  </div>

                  <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border-strong)' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>Cover Image</label>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Upload a high-quality image for your restaurant banner (1920x1080 recommended).</p>
                    <button type="button" className="secondary-button" style={{ fontSize: '0.85rem' }}>Choose File...</button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'operations' && (
              <motion.div key="operations" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {SECTION_HEADER('Operations', 'Configure your daily operational workflows.')}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* Timing */}
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Operating Hours</h3>
                    <div className="settings-row" style={{ display: 'flex', gap: '1.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Opening Time</label>
                        <input type="time" className="glass-input" value={openTime} onChange={e => setOpenTime(e.target.value)} style={{ colorScheme: 'dark' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Closing Time</label>
                        <input type="time" className="glass-input" value={closeTime} onChange={e => setCloseTime(e.target.value)} style={{ colorScheme: 'dark' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

                  {/* Toggles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <ToggleRow
                      title="Accepting Orders"
                      desc="Toggle off to temporarily pause incoming orders."
                      checked={acceptingOrders}
                      onChange={setAcceptingOrders}
                    />
                    <ToggleRow
                      title="Automated KOT Printing"
                      desc="Automatically print Kitchen Order Tickets when orders are accepted."
                      checked={autoKOT}
                      onChange={setAutoKOT}
                    />
                  </div>

                  {autoKOT && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-light)' }}>
                        <Printer size={18} style={{ color: 'var(--text-secondary)' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9rem', margin: 0 }}>Connected printer: <strong>Kitchen Printer 1</strong></p>
                          <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 0 }}>Status: online</p>
                        </div>
                        <button className="secondary-button" style={{ fontSize: '0.8rem' }}>Configure</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {SECTION_HEADER('Notifications', 'Choose what you get notified about, and how.')}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Order alerts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <ToggleRow
                        title="New order received"
                        desc="Get notified the moment a new order comes in."
                        checked={notifyNewOrder}
                        onChange={setNotifyNewOrder}
                      />
                      <ToggleRow
                        title="Order cancellations"
                        desc="Get notified when a customer cancels an order."
                        checked={notifyCancellation}
                        onChange={setNotifyCancellation}
                      />
                      <ToggleRow
                        title="Weekly payout summary"
                        desc="Receive a summary of your earnings every week."
                        checked={notifyPayouts}
                        onChange={setNotifyPayouts}
                      />
                    </div>
                  </div>

                  <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Delivery channels</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <ToggleRow
                        title={<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Email notifications</span>}
                        desc="Sent to the email on file for your account."
                        checked={notifyEmail}
                        onChange={setNotifyEmail}
                      />
                      <ToggleRow
                        title={<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={16} /> SMS notifications</span>}
                        desc="Sent to your registered phone number."
                        checked={notifySms}
                        onChange={setNotifySms}
                      />
                      <ToggleRow
                        title={<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Smartphone size={16} /> Push notifications</span>}
                        desc="Sent to the restaurant app on your device."
                        checked={notifyPush}
                        onChange={setNotifyPush}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {SECTION_HEADER('Billing & Payouts', 'Manage how and when you get paid.')}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* Bank account card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-light)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--glass-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Landmark size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>HDFC Bank •••• 4521</p>
                      <p className="text-secondary" style={{ margin: 0, fontSize: '0.85rem' }}>Linked for payouts</p>
                    </div>
                    <button className="secondary-button" style={{ fontSize: '0.85rem' }}>Change</button>
                  </div>

                  <ToggleRow
                    title="Automatic payouts"
                    desc="Automatically transfer your earnings to your bank account every Monday."
                    checked={autoPayouts}
                    onChange={setAutoPayouts}
                  />

                  <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

                  {/* Recent payouts */}
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recent payouts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { date: 'Jun 9, 2026', amount: '₹42,180', status: 'Paid' },
                        { date: 'Jun 2, 2026', amount: '₹38,920', status: 'Paid' },
                        { date: 'May 26, 2026', amount: '₹45,640', status: 'Paid' },
                      ].map(p => (
                        <div key={p.date} className="flex-between" style={{ padding: '0.85rem 1.1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-light)' }}>
                          <span style={{ fontSize: '0.9rem' }}>{p.date}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.amount}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 500 }}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {SECTION_HEADER('Security', 'Keep your restaurant account safe.')}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  <ToggleRow
                    title="Two-factor authentication"
                    desc="Require a one-time code in addition to your password when signing in."
                    checked={twoFactor}
                    onChange={setTwoFactor}
                  />

                  <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Password</h3>
                    <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Key size={14} /> Change password
                    </button>
                  </div>

                  <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

                  {/* Active sessions */}
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Active sessions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { device: 'Chrome on Windows', loc: 'Ahmedabad, IN', current: true },
                        { device: 'FoodFlow app on Android', loc: 'Ahmedabad, IN', current: false },
                      ].map(s => (
                        <div key={s.device} className="flex-between" style={{ padding: '0.85rem 1.1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border-light)' }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{s.device} {s.current && <span style={{ color: 'var(--success)', fontSize: '0.78rem', fontWeight: 500 }}>· This device</span>}</p>
                            <p className="text-secondary" style={{ margin: 0, fontSize: '0.8rem' }}>{s.loc}</p>
                          </div>
                          {!s.current && (
                            <button className="secondary-button" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <LogOut size={13} /> Sign out
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      {/* responsive */}
      <style>{`
        @media (max-width: 860px) {
          .settings-layout { flex-direction: column !important; }
          .settings-sidebar {
            flex: none !important; flex-direction: row !important;
            overflow-x: auto; width: 100%; gap: 0.5rem;
          }
          .settings-sidebar button { white-space: nowrap; }
          .settings-row { flex-direction: column !important; gap: 1rem !important; }
        }
      `}</style>
    </motion.div>
  );
}