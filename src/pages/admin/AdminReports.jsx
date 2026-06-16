import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Download, BarChart2, PieChart, Activity, DollarSign, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const orders = useStore(state => state.orders);
  const restaurants = useStore(state => state.restaurants);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const gmv = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) + 245000;
  const platformFee = gmv * 0.1;
  const totalOrders = orders.length + 1250;

  return (
    <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
      {/* Header */}
      {!isMobile && (
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Platform Reports</h1>
            <p className="text-secondary">Analytics and financial data for FOODFLOW.</p>
          </div>
          <button onClick={() => toast(' Export feature coming soon!', { icon: '📊' })} className="primary-button" style={{ background: '#3742fa', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export CSV
          </button>
        </header>
      )}

      {isMobile && (
        <div style={{ padding: '1rem', background: '#050505', color: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Analytics</h1>
            <button onClick={() => toast(' Export feature coming soon!', { icon: '📊' })} style={{ background: '#111', color: '#FFF', border: '1px solid #2A2A2A', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isMobile ? (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#050505', minHeight: '100vh' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A15 100%)', border: '1px solid #3742fa44', padding: '1.25rem', borderRadius: '16px' }}>
              <TrendingUp size={20} color="#3742fa" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>₹{(gmv / 1000).toFixed(1)}k</div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Total GMV</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, #0A0A15 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '16px' }}>
              <DollarSign size={20} color="#10B981" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>₹{(platformFee / 1000).toFixed(1)}k</div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Platform Revenue</div>
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #2A2A2A', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FileText size={16} color="#F59E0B" /> <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Orders</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>{totalOrders.toLocaleString()}</div>
            </div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #3742fa', borderTopColor: 'transparent', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3742fa33' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0 }}>Recent Transactions</h3>
              <button onClick={() => toast(' View all transactions coming soon!')} style={{ background: 'none', border: 'none', color: '#3742fa', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>View All <ArrowRight size={12} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {orders.slice(0, 10).map((order) => {
                const total = parseFloat(order.total || 0);
                const fee = total * 0.1;
                const restaurant = restaurants.find(r => r.id === order.restaurantId);

                return (
                  <div key={order.id} style={{ background: '#111', border: '1px solid #2A2A2A', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '0.2rem' }}>{restaurant?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>TXN-{order.id}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF' }}>₹{total.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>+₹{fee.toFixed(2)} fee</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <>
          <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="glass-panel flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem' }}>
              <TrendingUp size={48} color="#3742fa" />
              <h2 style={{ fontSize: '2.5rem' }}>₹{gmv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h2>
              <p className="text-secondary">Gross Merchandise Value (MTD)</p>
            </div>
            <div className="glass-panel flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem' }}>
              <FileText size={48} color="#ffa502" />
              <h2 style={{ fontSize: '2.5rem' }}>{totalOrders}</h2>
              <p className="text-secondary">Total Orders Fulfilled (MTD)</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border-light)' }}>
                  <th style={{ paddingBottom: '1rem' }}>Txn ID</th>
                  <th style={{ paddingBottom: '1rem' }}>Date</th>
                  <th style={{ paddingBottom: '1rem' }}>Restaurant</th>
                  <th style={{ paddingBottom: '1rem' }}>Amount</th>
                  <th style={{ paddingBottom: '1rem' }}>Platform Fee (10%)</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => {
                  const total = parseFloat(order.total || 0);
                  const fee = total * 0.1;
                  const restaurant = restaurants.find(r => r.id === order.restaurantId);

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>TXN-{order.id}</td>
                      <td style={{ padding: '1rem 0' }}>{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '1rem 0' }}>{restaurant?.name || order.restaurantName || 'Unknown'}</td>
                      <td style={{ padding: '1rem 0' }}>₹{total.toFixed(2)}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--success)', fontWeight: 'bold' }}>₹{fee.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
