import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Clock, ShoppingBag, X, DollarSign, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  // Mock customer data
  const customers = [
    { id: 'usr-1', name: 'John Doe', email: 'john@example.com', orders: 12, spent: 4500, joined: '2023-01-15' },
    { id: 'usr-2', name: 'Jane Smith', email: 'jane@example.com', orders: 5, spent: 1250, joined: '2023-03-22' },
    { id: 'usr-3', name: 'Alice Johnson', email: 'alice@example.com', orders: 28, spent: 15400, joined: '2022-11-05' },
    { id: 'usr-4', name: 'Demo User', email: 'demo@foodflow.com', orders: 3, spent: 890, joined: '2023-06-10' },
  ];

  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
      {/* Header */}
      {!isMobile && (
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Customers Management</h1>
            <p className="text-secondary">View and manage platform users.</p>
          </div>
        </header>
      )}

      {isMobile && (
        <div style={{ padding: '1rem', background: '#050505', color: '#FFF' }}>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', fontWeight: 800 }}>Users</h1>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
              placeholder="Search customers by name or email..." 
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
          {filteredCustomers.map(customer => (
            <MobileCustomerCard 
              key={customer.id} 
              customer={customer} 
              onClick={() => setSelectedCustomer(customer)} 
            />
          ))}
          {filteredCustomers.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>No users found.</div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border-light)' }}>
                <th style={{ paddingBottom: '1rem' }}>User</th>
                <th style={{ paddingBottom: '1rem' }}>Email</th>
                <th style={{ paddingBottom: '1rem' }}>Total Orders</th>
                <th style={{ paddingBottom: '1rem' }}>Total Spent</th>
                <th style={{ paddingBottom: '1rem' }}>Joined</th>
                <th style={{ paddingBottom: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{customer.name}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{customer.email}</td>
                  <td style={{ padding: '1rem 0' }}>{customer.orders}</td>
                  <td style={{ padding: '1rem 0', fontWeight: 600 }}>₹{customer.spent.toLocaleString()}</td>
                  <td style={{ padding: '1rem 0' }}>{new Date(customer.joined).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      style={{ background: 'rgba(55, 66, 250, 0.1)', border: 'none', color: '#3742fa', cursor: 'pointer', padding: '0.4rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailDrawer 
            customer={selectedCustomer} 
            onClose={() => setSelectedCustomer(null)} 
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileCustomerCard({ customer, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: '#111', border: '1px solid #2A2A2A', borderRadius: '12px',
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3742fa33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3742fa' }}>{customer.name.charAt(0)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</h3>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Mail size={12} /> {customer.email}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #2A2A2A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8rem' }}>
          <ShoppingBag size={14} /> {customer.orders} Orders
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981' }}>
          ₹{customer.spent.toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
}

function CustomerDetailDrawer({ customer, onClose, isMobile }) {
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
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#1A1A1A', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}>
            <X size={18} />
          </button>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3742fa, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 16px rgba(55,66,250,0.3)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{customer.name.charAt(0)}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', margin: 0 }}>{customer.name}</h2>
          <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={14} /> {customer.email}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
             <Activity size={12} /> Active Account
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                  <DollarSign size={14} color="#10B981" /> <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Lifetime Value</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>₹{customer.spent.toLocaleString()}</div>
             </div>
             <div style={{ background: '#171717', border: '1px solid #2A2A2A', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                  <ShoppingBag size={14} color="#3742fa" /> <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Orders</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{customer.orders}</div>
             </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Account Details</div>
            <div style={{ background: '#171717', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> Joined</span>
                <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>{new Date(customer.joined).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={14} /> Last Active</span>
                <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>Today</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
            <button onClick={() => toast.error('Reset Password is disabled in demo mode')} style={{ flex: 1, background: '#171717', border: '1px solid #333', color: '#FFF', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Reset Password
            </button>
            <button onClick={() => toast.error('Ban action is disabled in demo mode')} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Ban User
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
