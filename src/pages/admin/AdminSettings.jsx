import React from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.error('Settings cannot be changed in demo mode.');
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Platform Settings</h1>
        <p className="text-secondary">Global configurations for FOODFLOW operations.</p>
      </header>

      <div className="admin-settings-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div className="glass-panel" style={{ flex: '1 1 60%', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Global Variables</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-settings-fees" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Platform Fee (%)</label>
                <input type="number" className="glass-input" defaultValue="10" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Default Delivery Fee (₹)</label>
                <input type="number" className="glass-input" defaultValue="49" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Surge Pricing Multiplier</label>
              <input type="number" step="0.1" className="glass-input" defaultValue="1.5" />
            </div>

            <button type="submit" className="primary-button" style={{ alignSelf: 'flex-start', background: '#3742fa', color: 'white' }}>
              Save Configuration
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ flex: '1 1 40%', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>System Toggles</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex-between">
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Maintenance Mode</h4>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Take the customer app offline</p>
              </div>
              <div style={{ width: '40px', height: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '20px', height: '20px', background: 'var(--text-secondary)', borderRadius: '50%', position: 'absolute', top: '1px', left: '2px' }} />
              </div>
            </div>
            
            <div style={{ height: '1px', background: 'var(--glass-border-light)' }} />

            <div className="flex-between">
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>Surge Pricing</h4>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Enable active surge multiplier</p>
              </div>
              <div style={{ width: '40px', height: '24px', background: 'var(--success)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
