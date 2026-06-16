import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Store, TrendingUp, Users, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function PartnerPage() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', restaurantName: '', city: '' });
  const [submitted, setSubmitted] = useState(false);
  const restaurants = useStore(state => state.restaurants) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', background: '#111110', color: '#fff', padding: '8rem 2rem 6rem', overflow: 'hidden' }}>
        {/* Abstract Background Elements */}
        <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,77,46,0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', zIndex: 0 }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
              <Store size={16} color="var(--accent)" /> For Restaurants
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem', color: '#fff' }}>
              Grow your <span style={{ color: 'var(--accent)' }}>business</span> with FoodFlow.
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Join 500+ top restaurants in Ahmedabad. Reach more customers, boost your revenue, and manage everything from one powerful dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('partner-form').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(255,77,46,0.3)' }}>
                Get Started <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/auth')} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem 2rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(10px)' }}>
                Restaurant Portal
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative' }}>
             {/* Decorative Dashboard Mockup */}
             <div style={{ background: '#1A1A1A', borderRadius: '24px', border: '1px solid #333', boxShadow: '0 24px 48px rgba(0,0,0,0.5)', padding: '1.5rem', overflow: 'hidden', position: 'relative' }}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                 <div style={{ background: '#262626', padding: '1rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginBottom: '0.5rem' }}>Total Orders (Today)</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>142</div>
                 </div>
                 <div style={{ background: '#262626', padding: '1rem', borderRadius: '12px' }}>
                   <div style={{ fontSize: '0.75rem', color: '#A3A3A3', marginBottom: '0.5rem' }}>Revenue (Today)</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>₹48k</div>
                 </div>
               </div>
               <div style={{ background: '#262626', padding: '1rem', borderRadius: '12px', height: '120px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {/* Fake chart bars */}
                  {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? 'var(--accent)' : '#404040', borderRadius: '4px 4px 0 0' }} />
                  ))}
               </div>
             </div>
          </motion.div>

        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Why partner with us?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>We provide the tools, technology, and customer base you need to succeed in the digital era.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <TrendingUp size={28} />, title: 'Increase Revenue', desc: 'Reach thousands of new customers in your city who are looking for great food.' },
              { icon: <Zap size={28} />, title: '0% Commission for 30 Days', desc: 'Try our platform risk-free. Keep 100% of your earnings for the first month.' },
              { icon: <Users size={28} />, title: 'Dedicated Fleet', desc: 'Rely on our massive network of trained delivery partners to get your food delivered hot and fresh.' }
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

      {/* Form Section */}
      <section id="partner-form" style={{ background: 'var(--bg-elevated)', padding: '6rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
             <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Ready to grow?</h2>
             <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Fill out the form below and our onboarding team will contact you within 24 hours.</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '3rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
                <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>Application Submitted!</h3>
                <p style={{ color: '#047857', margin: 0 }}>Thank you for your interest. We will be in touch shortly.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-primary)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</label>
                    <input required type="text" placeholder="John Doe" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', outline: 'none', fontSize: '1rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Phone Number</label>
                    <input required type="tel" placeholder="+91 98765 43210" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', outline: 'none', fontSize: '1rem' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email Address</label>
                  <input required type="email" placeholder="john@restaurant.com" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Restaurant Name</label>
                  <input required type="text" placeholder="The Great Cafe" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', outline: 'none', fontSize: '1rem' }} />
                </div>
                <button type="submit" style={{ background: '#111110', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer', marginTop: '1rem' }}>
                  Submit Application
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Visit Our Restaurants Section */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-primary)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
               <div>
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>Visit our active restaurants</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>See the amazing businesses already growing with FoodFlow.</p>
               </div>
               <button onClick={() => navigate('/customer/search')} style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 View All Restaurants <ArrowRight size={16} />
               </button>
            </div>

            {/* Simple Grid of 3 top restaurants */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {restaurants.slice(0, 3).map((r) => (
                <button aria-label={`View ${r.name}`} key={r.id} onClick={() => navigate(`/customer/restaurant/${r.id}`)} style={{ appearance: 'none', textAlign: 'left', display: 'block', width: '100%', cursor: 'pointer', background: 'var(--bg-elevated)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                   <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img src={r.coverImage} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{r.name}</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.cuisine.join(', ')} • ★ {r.rating}</p>
                   </div>
                </button>
              ))}
            </div>
         </div>
      </section>

    </div>
  );
}
