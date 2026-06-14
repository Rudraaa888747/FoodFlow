import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bike, Clock, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RideWithUs() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', background: '#09090B', color: '#fff', padding: '8rem 2rem 6rem', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(255,77,46,0.15) 0%, transparent 60%)', zIndex: 0 }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              <Bike size={16} color="var(--accent)" /> Join our fleet
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem', color: '#fff' }}>
              Earn on your own terms.
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Become a FoodFlow delivery partner and enjoy flexible hours, weekly payouts, and the freedom to work whenever you want.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Apply Now <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/auth')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 2rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Login to Portal
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative' }}>
             {/* Decorative Delivery App Mockup */}
             <div style={{ background: '#1A1A1A', borderRadius: '32px', border: '1px solid #333', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', padding: '1.5rem', overflow: 'hidden', position: 'relative', aspectRatio: '4/5', display: 'flex', flexDirection: 'column' }}>
               
               {/* Map Background Pattern */}
               <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               
               <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {/* Map Route SVG animation */}
                 <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }} preserveAspectRatio="none">
                   <motion.path
                     d="M 20 80 Q 80 80 80 50 T 20 20"
                     fill="transparent" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3"
                     initial={{ strokeDashoffset: 10 }} animate={{ strokeDashoffset: 0 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                   />
                   <circle cx="20" cy="80" r="2.5" fill="#10B981" />
                   <circle cx="20" cy="20" r="2.5" fill="#EF4444" />
                 </svg>

                 {/* Moving Element */}
                 <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                 >
                    <Bike size={24} color="#000" />
                 </motion.div>
                 
                 {/* Pulse rings */}
                 <motion.div
                   animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                   transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                   style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-24px', marginLeft: '-24px', width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent)', pointerEvents: 'none' }}
                 />
               </div>

               {/* UI Card */}
               <div style={{ position: 'relative', zIndex: 1, background: '#262626', borderRadius: '20px', padding: '1.25rem', border: '1px solid #404040' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#A3A3A3', fontWeight: 600, textTransform: 'uppercase' }}>Current Order</div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>In Progress</div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>₹140.00 <span style={{ fontSize: '0.8rem', color: '#A3A3A3', fontWeight: 500 }}>Est. Earnings</span></div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}><Clock size={14} color="var(--accent)" /> Drop-off in 12 mins</div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Why ride with us?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>We value our partners and provide the best support in the industry.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Clock size={28} />, title: 'Flexible Schedule', desc: 'Work for an hour, a day, or a week. You are the boss of your own time.' },
              { icon: <DollarSign size={28} />, title: 'Weekly Payouts', desc: 'Get your earnings transferred directly to your bank account every week without fail.' },
              { icon: <Shield size={28} />, title: 'Insurance Cover', desc: 'Ride with peace of mind. All our active partners are covered by accidental insurance.' }
            ].map((benefit, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} style={{ padding: '2.5rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 12px 32px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(255,77,46,0.1)', color: 'var(--accent)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>{benefit.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps to Join */}
      <section style={{ background: 'var(--bg-elevated)', padding: '6rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
           <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '3rem', textAlign: 'center' }}>How it works</h2>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {[
               { title: 'Sign up online', desc: 'Fill out our simple application form with your basic details.' },
               { title: 'Submit documents', desc: 'Upload your ID, driving license, and vehicle registration.' },
               { title: 'Get verified', desc: 'We will verify your documents within 24-48 hours.' },
               { title: 'Start earning', desc: 'Download the delivery app, go online, and accept your first order!' }
             ].map((step, i) => (
               <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                 <div style={{ width: '48px', height: '48px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, flexShrink: 0 }}>
                   {i + 1}
                 </div>
                 <div>
                   <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{step.title}</h3>
                   <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.05rem' }}>{step.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}
