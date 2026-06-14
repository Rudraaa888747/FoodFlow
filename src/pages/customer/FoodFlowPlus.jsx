import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Crown, Check, Zap, ArrowLeft, Star, Clock,
  ShieldCheck, Ticket, ArrowRight, Bike,
  Sparkles, ChevronDown, Quote
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ── tokens ──────────────────────────────────────────────────────── */
const T = {
  bg: '#FFFCF5',
  surface: '#FFFFFF',
  ink: '#1A1208',
  muted: '#78716C',
  hint: '#A8A29E',
  border: '#F0EAD6',
  amber: '#D97706',
  amberBright: '#F59E0B',
  amberGlow: '#FEF3C7',
  amberMid: '#FDE68A',
  orange: '#EA580C',
  green: '#059669',
  greenLight: '#DCFCE7',
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  gold: '#B45309',
};

/* ── shimmer keyframe injected once ─────────────────────────────── */
const SHIMMER_CSS = `
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-10px); }
}
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0;   }
}
`;

function injectStyle(css) {
  if (typeof document !== 'undefined' && !document.getElementById('ffplus-style')) {
    const s = document.createElement('style');
    s.id = 'ffplus-style';
    s.textContent = css;
    document.head.appendChild(s);
  }
}

/* ── stagger helpers ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function FoodFlowPlus() {
  const navigate = useNavigate();
  const isPremium = useStore(s => s.isPremium);
  const togglePremium = useStore(s => s.togglePremium);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpac = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    injectStyle(SHIMMER_CSS);
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = () => {
    if (isPremium) {
      toast('Already a FoodFlow Plus member!', { icon: '👑' });
      navigate('/customer');
      return;
    }
    togglePremium();
    toast.success('Welcome to FoodFlow Plus! Free delivery is now active.', { icon: '👑', duration: 4000 });
    setTimeout(() => navigate('/customer'), 1500);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.ink, fontFamily: "'Inter', -apple-system, sans-serif", overflowX: 'hidden' }}>

      {/* ── sticky nav ──────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,252,245,0.88)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5%', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: T.border, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={15} color={T.ink} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={18} color={T.amber} fill={T.amber} />
            <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.04em', color: T.gold }}>FoodFlow PLUS</span>
          </div>

          {isPremium ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: T.amberGlow, border: `1px solid ${T.amberMid}`, borderRadius: '999px', padding: '0.3rem 0.8rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.amber }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: T.gold }}>Active</span>
            </div>
          ) : <div style={{ width: '36px' }} />}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

        {/* warm radial bg */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${T.amberGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: '320px', height: '320px', borderRadius: '50%', border: `1px solid ${T.amberMid}44`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '480px', height: '480px', borderRadius: '50%', border: `1px solid ${T.border}`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '360px', height: '360px', borderRadius: '50%', border: `1px solid ${T.amberMid}33`, pointerEvents: 'none' }} />

        {/* floating badge icons */}
        {[
          { icon: '🍕', top: '18%', left: '10%', delay: 0 },
          { icon: '🍔', top: '55%', left: '6%', delay: 0.4 },
          { icon: '🌮', top: '22%', right: '10%', delay: 0.2 },
          { icon: '🍜', top: '60%', right: '7%', delay: 0.6 },
          { icon: '🍣', bottom: '20%', left: '14%', delay: 0.3 },
          { icon: '🧆', bottom: '25%', right: '12%', delay: 0.5 },
        ].map(({ icon, delay, ...pos }, i) => (
          <motion.div key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{ position: 'absolute', fontSize: '2rem', opacity: 0.55, pointerEvents: 'none', userSelect: 'none', ...pos }}
          >
            {icon}
          </motion.div>
        ))}

        <motion.div className="hero-content"
          initial="hidden" animate="show" variants={stagger}
          style={{ y: heroY, opacity: heroOpac, textAlign: 'center', maxWidth: '760px', padding: '0 5%', position: 'relative', zIndex: 2 }}>

          {/* crown anim */}
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', background: T.amberGlow, zIndex: 0 }}
              />
              <div style={{ position: 'relative', zIndex: 1, width: '72px', height: '72px', borderRadius: '50%', background: T.surface, border: `2px solid ${T.amberMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${T.amberMid}` }}>
                <Crown size={32} color={T.amber} fill={T.amber} />
              </div>
            </div>
          </motion.div>

          {/* eyebrow */}
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: T.amberGlow, border: `1px solid ${T.amberMid}`, borderRadius: '999px', padding: '0.4rem 1.1rem', marginBottom: '1.5rem' }}>
            <Star size={12} fill={T.amber} color={T.amber} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: T.gold, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Elite Membership</span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '1.5rem', color: T.ink }}>
            Zero fees.<br />
            <span style={{ color: T.amber }}>Pure pleasure.</span>
          </motion.h1>

          <motion.p variants={fadeUp}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: T.muted, lineHeight: 1.7, marginBottom: '2.75rem', maxWidth: '540px', margin: '0 auto 2.75rem' }}>
            Join the members who never pay delivery again. Unlimited free delivery, exclusive deals, and priority support — all for ₹83/month.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={handleSubscribe}
              style={{
                background: isPremium ? T.greenLight : T.amber, color: isPremium ? T.green : '#fff',
                border: 'none', borderRadius: '14px', padding: '0.9rem 2rem',
                fontWeight: 800, fontSize: '0.95rem', cursor: isPremium ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: isPremium ? 'none' : `0 8px 24px ${T.amberMid}`,
              }}>
              {isPremium ? <><Check size={16} /> Active member</> : <><Crown size={16} /> Join Plus · ₹249</>}
            </motion.button>
            <button onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'transparent', border: `1.5px solid ${T.border}`, borderRadius: '14px', padding: '0.9rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', color: T.muted, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              See benefits <ChevronDown size={15} />
            </button>
          </motion.div>

          {/* social proof row */}
          <motion.div variants={fadeUp} style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=9', 'https://i.pravatar.cc/40?img=12'].map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${T.surface}`, marginLeft: i === 0 ? 0 : '-8px', objectFit: 'cover' }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={T.amber} color={T.amber} />)}
              </div>
              <span style={{ fontSize: '0.75rem', color: T.muted, fontWeight: 600 }}>2,400+ happy Plus members</span>
            </div>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', opacity: 0.4, cursor: 'pointer' }}
          onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: T.muted, textTransform: 'uppercase' }}>Explore</span>
          <ChevronDown size={16} color={T.muted} />
        </motion.div>
      </section>

      {/* ── savings calculator strip ─────────────────────────── */}
      <section style={{ background: T.ink, padding: '2.5rem 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { val: '₹0', label: 'Delivery fee, always' },
            { val: '30%', label: 'Extra discount on top' },
            { val: '< 2m', label: 'Priority support reply' },
            { val: '₹83', label: 'Per month cost' },
          ].map(({ val, label }, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <p style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 900, color: T.amberBright, margin: 0, letterSpacing: '-0.04em' }}>{val}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: '0.25rem 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── benefits ─────────────────────────────────────────── */}
      <section id="benefits" style={{ padding: '7rem 5%', background: T.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, color: T.amber, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What you get</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 900, letterSpacing: '-0.04em', color: T.ink, margin: 0 }}>
              Built for serious foodies
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                icon: Bike, color: T.green, bg: T.greenLight, border: '#BBF7D0',
                title: 'Unlimited free delivery',
                body: 'No more ₹25–40 delivery charges. Every order above ₹199 from any partner restaurant ships free.',
                stat: '₹1,200+', statLabel: 'avg. annual savings',
              },
              {
                icon: Ticket, color: T.amber, bg: T.amberGlow, border: T.amberMid,
                title: 'Exclusive member discounts',
                body: 'Stack an extra 30% off on top of restaurant deals. Plus-only flash sales every Friday.',
                stat: '30%', statLabel: 'extra off every order',
              },
              {
                icon: ShieldCheck, color: T.indigo, bg: T.indigoLight, border: '#C7D2FE',
                title: 'Priority support',
                body: 'Skip the queue. A dedicated agent picks up your query within 2 minutes, 7 days a week.',
                stat: '< 2m', statLabel: 'avg. response time',
              },
              {
                icon: Zap, color: T.orange, bg: '#FFF7ED', border: '#FED7AA',
                title: 'Early access & drops',
                body: 'Be first to order from new restaurants before they open to the public. Limited menus, Plus-only.',
                stat: '1st', statLabel: 'access to new launches',
              },
              {
                icon: Star, color: T.gold, bg: T.amberGlow, border: T.amberMid,
                title: 'Zero surge pricing',
                body: 'Rain, peak hours, festivals — your delivery fee stays zero. No nasty surprises at checkout.',
                stat: '24/7', statLabel: 'flat zero delivery fee',
              },
              {
                icon: Sparkles, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
                title: 'Smart reorder memory',
                body: 'FoodFlow Plus remembers your usuals. One tap reorder with your saved customisations intact.',
                stat: '1 tap', statLabel: 'to reorder your favourites',
              },
            ].map(({ icon: Icon, color, bg, border, title, body, stat, statLabel }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
                style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'box-shadow 0.25s, transform 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 900, color: color, margin: 0, letterSpacing: '-0.04em' }}>{stat}</p>
                    <p style={{ fontSize: '0.65rem', color: T.hint, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{statLabel}</p>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: T.ink, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>{title}</h3>
                  <p style={{ fontSize: '0.85rem', color: T.muted, lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── comparison table ────────────────────────────────── */}
      <section style={{ padding: '4rem 5% 6rem', background: '#FEFCE8' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: T.ink, margin: 0 }}>Free vs Plus</h2>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            {/* header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: T.ink, padding: '1rem 1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Free</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.amber, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Plus 👑</span>
            </div>

            {[
              ['Delivery fee', 'Per order', 'Always free'],
              ['Discounts', 'Restaurant-only', '+30% extra'],
              ['Support', 'Standard queue', 'Priority < 2m'],
              ['Surge pricing', 'Applies', 'Never applies'],
              ['Early access drops', '✗', '✓'],
              ['Smart reorder memory', '✗', '✓'],
            ].map(([feature, free, plus], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.875rem 1.5rem', borderTop: `1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : T.bg }}>
                <span style={{ fontSize: '0.85rem', color: T.muted, fontWeight: 500 }}>{feature}</span>
                <span style={{ fontSize: '0.85rem', color: T.hint, textAlign: 'center', fontWeight: 500 }}>{free}</span>
                <span style={{ fontSize: '0.85rem', color: T.amber, textAlign: 'center', fontWeight: 700 }}>{plus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── testimonials ────────────────────────────────────── */}
      <section style={{ padding: '5rem 5%', background: T.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: T.ink, margin: 0 }}>Members love it</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { name: 'Priya S.', loc: 'Mumbai', text: 'Paid for itself in the first week. Order almost daily now without guilt.', img: 'https://i.pravatar.cc/80?img=47' },
              { name: 'Aryan M.', loc: 'Bangalore', text: 'The priority support is real. Had an issue resolved in 90 seconds flat.', img: 'https://i.pravatar.cc/80?img=12' },
              { name: 'Neha K.', loc: 'Ahmedabad', text: 'Friday flash sales are insane. Got 50% off at my favourite place last week.', img: 'https://i.pravatar.cc/80?img=32' },
            ].map(({ name, loc, text, img }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Quote size={18} color={T.amberMid} />
                <p style={{ fontSize: '0.9rem', color: T.muted, lineHeight: 1.65, margin: 0, flex: 1 }}>{text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', borderTop: `1px solid ${T.border}` }}>
                  <img src={img} alt={name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 700, color: T.ink, fontSize: '0.85rem', margin: 0 }}>{name}</p>
                    <p style={{ color: T.hint, fontSize: '0.72rem', margin: 0 }}>{loc}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '1px' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={T.amber} color={T.amber} />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── pricing card ────────────────────────────────────── */}
      <section style={{ padding: '5rem 5% 7rem', background: T.bg }}>
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: T.surface, border: `2px solid ${T.amberMid}`, borderRadius: '28px', overflow: 'hidden', boxShadow: `0 24px 60px ${T.amberMid}55` }}>

            {/* gold top bar */}
            <div style={{ height: '5px', background: `linear-gradient(90deg, ${T.amber}, ${T.orange})` }} />

            <div style={{ padding: '2.5rem 2rem' }}>
              {/* badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: T.amberGlow, border: `1px solid ${T.amberMid}`, borderRadius: '999px', padding: '0.35rem 1rem' }}>
                  <Crown size={13} color={T.amber} fill={T.amber} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>3-month plan</span>
                </div>
              </div>

              {/* price */}
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.25rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: T.amber, marginTop: '0.75rem' }}>₹</span>
                  <span style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', color: T.ink }}>249</span>
                </div>
                <p style={{ color: T.hint, fontSize: '0.825rem', margin: '0.25rem 0 0' }}>That's just ₹83/month — less than two coffees.</p>
              </div>

              {/* savings callout */}
              <div style={{ background: T.greenLight, border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.75rem 1rem', textAlign: 'center', margin: '1.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: T.green }}>Members save ₹1,200+ on average over 3 months</span>
              </div>

              {/* checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Unlimited free delivery on all orders',
                  'Up to 30% extra off on top restaurants',
                  'Priority support within 2 minutes',
                  'Zero surge pricing, ever',
                  'Cancel anytime — no lock-in',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: T.greenLight, border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color={T.green} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: T.muted, fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: isPremium ? 1 : 1.03 }} whileTap={{ scale: isPremium ? 1 : 0.97 }}
                onClick={handleSubscribe}
                style={{
                  width: '100%', padding: '1.1rem', borderRadius: '14px',
                  background: isPremium ? T.greenLight : T.amber,
                  color: isPremium ? T.green : '#fff', border: 'none',
                  fontSize: '1rem', fontWeight: 800, cursor: isPremium ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: isPremium ? 'none' : `0 8px 28px ${T.amberMid}`,
                  letterSpacing: '-0.01em',
                }}>
                {isPremium
                  ? <><Check size={18} /> You're a Plus member</>
                  : <><Crown size={18} /> Join FoodFlow Plus <ArrowRight size={15} /></>
                }
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: T.hint, marginTop: '1rem' }}>
                Secure checkout · Cancel anytime · Instant activation
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── footer ──────────────────────────────────────────── */}
      <footer style={{ background: T.ink, padding: '2rem 5%', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', margin: 0 }}>
          FoodFlow Plus · Built by Rudra Chokshi · Ahmedabad, India
        </p>
      </footer>

    </div>
  );
}