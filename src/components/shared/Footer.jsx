import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Utensils } from 'lucide-react';

export default function Footer() {
  const linkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  };

  const sections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Careers', to: '/careers' },
        { label: 'Blog', to: '/blog' },
        { label: 'Contact', to: '/contact' }
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Refund Policy', to: '/refund' }
      ],
    },
    {
      title: 'For Partners',
      links: [
        { label: 'Partner with us', to: '/partner' },
        { label: 'Ride with us', to: '/ride' },
        { label: 'Restaurant Portal', to: '/auth' },
        { label: 'Delivery Portal', to: '/auth' }
      ],
    },
  ];

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border-light)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div className="ff-footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Utensils size={16} color="#fff" />
              </div>
              <h2 className="text-gradient-accent" style={{ margin: 0, fontSize: '1.25rem' }}>FOODFLOW</h2>
            </div>
            <p className="text-secondary" style={{ marginBottom: '1.5rem', maxWidth: '280px', fontSize: '0.9rem', lineHeight: 1.7, marginLeft: '40px' }}>
              The premium food ordering experience for Ahmedabad. Quality food, fast delivery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <a href="mailto:support@foodflow.app" style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}><Mail size={16} /></div>
                <span>support@foodflow.app</span>
              </a>
              <a href="tel:+919876543210" style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}><Phone size={16} /></div>
                <span>+91 98765 43210</span>
              </a>
              <span style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}><MapPin size={16} /></div>
                <span>Ahmedabad, Gujarat, India</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginLeft: '40px' }}>
              {['FB', 'IG', 'X', 'IN'].map((social, i) => (
                <a key={i} href="#" aria-label="Social link" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--glass-bg-hover)', border: '1px solid var(--glass-border-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', transition: 'color 0.2s, border-color 0.2s',
                  fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none'
                }}>
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map(({ title, links }) => (
            <div key={title} className="ff-footer-col">
              <h4 style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0 }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={linkStyle}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border-light)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} FOODFLOW Technologies. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Made with care in Ahmedabad 🇮🇳
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ff-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            row-gap: 2.5rem !important;
          }
          .ff-footer-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 540px) {
          .ff-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}