import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils, ArrowRight, Star, Menu, X, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import './LandingPage.css';


/* ═══════════════════════════════════════════════════════════════
   Viewport-aware counter
   Starts counting only when scrolled into view.
   Uses ease-out cubic for natural deceleration.
   ═══════════════════════════════════════════════════════════════ */

function StatCounter({ value: target, suffix = '', prefix = '', label, sublabel }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="stat-label">{label}</span>
      {sublabel && <span className="stat-sublabel">{sublabel}</span>}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   Landing Page
   Narrative arc: Curiosity → Interest → Trust → Desire →
                  Confidence → Action
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const user = useStore(state => state.user);

  /* ── Scroll-aware nav ──────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Lock body when menu open ──────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  /* ── Intersection Observer for scroll reveals ──────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -48px 0px' },
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Ticker restaurant names ───────────────────────────── */
  const tickerNames = [
    'Burger Bros', 'Spice Garden', 'Sushi Master', 'Pizza Palace',
    'Green Bowl', 'Taco Fiesta', 'The Grill House', 'Noodle Bar',
    'Café Milano', 'Dragon Wok', 'Curry House', 'The Bakery',
  ];

  return (
    <div className="landing">

      {/* ── Skip-to-content ─── */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* ── Film grain (desktop only) ─── */}
      <svg className="landing-grain" aria-hidden="true" width="100%" height="100%">
        <filter id="grain-fx">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-fx)" opacity="0.035" />
      </svg>


      {/* ════════════════════════════════════════════════════════
          NAVIGATION
          Transparent → frosted glass on scroll
          ════════════════════════════════════════════════════════ */}
      <nav
        className={`lp-nav ${navSolid ? 'lp-nav--solid' : ''}`}
        aria-label="Main navigation"
      >
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo" aria-label="FoodFlow home">
            <img src="/logo.png" alt="FoodFlow Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop links */}
          <div className="lp-nav-links">
            <Link to="/customer" className="lp-nav-link">Order food</Link>
            <Link to="/restaurant" className="lp-nav-link">For restaurants</Link>
            <Link to="/admin" className="lp-nav-link">Admin</Link>
            {!user && <Link to="/auth" className="lp-nav-cta">Sign in</Link>}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lp-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lp-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.div
              className="lp-menu-content"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.04 }}
            >
              <Link to="/customer" className="lp-menu-link" onClick={() => setIsMenuOpen(false)}>
                <span>Order food</span>
                <ChevronRight size={18} />
              </Link>
              <Link to="/restaurant" className="lp-menu-link" onClick={() => setIsMenuOpen(false)}>
                <span>For restaurants</span>
                <ChevronRight size={18} />
              </Link>
              <Link to="/admin" className="lp-menu-link" onClick={() => setIsMenuOpen(false)}>
                <span>Admin panel</span>
                <ChevronRight size={18} />
              </Link>
              <div className="lp-menu-divider" />
              {!user && (
                <Link to="/auth" className="lp-menu-signin" onClick={() => setIsMenuOpen(false)}>
                  Sign in to your account
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <main id="main-content">

        {/* ══════════════════════════════════════════════════════
            HERO — Curiosity
            Cinematic dark intro with Ember Bloom signature.
            Typography-driven. No stock photos. Pure brand.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-hero" aria-label="Welcome to FoodFlow">
          {/* Ember Bloom — signature ambient warmth */}
          <div className="lp-hero-bloom" aria-hidden="true" />
          <div className="lp-hero-bloom-secondary" aria-hidden="true" />

          <div className="lp-hero-content">
            <div className="lp-hero-eyebrow reveal">
              <span className="lp-hero-eyebrow-dot" aria-hidden="true" />
              Loved by 12,000+ food lovers
            </div>

            <h1 className="lp-hero-title reveal">
              Every great meal<br />
              starts with a{' '}
              <span className="lp-ember-text">craving.</span>
            </h1>

            <p className="lp-hero-sub reveal">
              Discover 200+ handpicked restaurants, track every order
              in real&nbsp;time, and reorder your favorites in one tap.
              This is&nbsp;FoodFlow.
            </p>

            <div className="lp-hero-actions reveal">
              <Link to="/customer" className="lp-btn-primary" id="hero-cta">
                Start ordering <ArrowRight size={16} />
              </Link>
              <Link to="/restaurant" className="lp-btn-ghost">
                List your restaurant
              </Link>
            </div>

            <div className="lp-hero-trust reveal">
              <div className="lp-hero-trust-stars" aria-label="4.9 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" color="currentColor" />
                ))}
              </div>
              <span>4.9 average from 3,200+ reviews</span>
            </div>
          </div>

          {/* Scroll hint — the ember line */}
          <div className="lp-scroll-cue" aria-hidden="true">
            <span>Scroll</span>
            <div className="lp-scroll-line" />
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            TRUSTED BY — Instant credibility
            Continuous ticker of restaurant partner names.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-trusted" aria-label="Trusted by leading restaurants">
          <span className="lp-trusted-label">Trusted by restaurants you love</span>
          <div className="lp-ticker">
            <div className="lp-ticker-track" aria-hidden="true">
              {[...tickerNames, ...tickerNames].map((name, i) => (
                <span className="lp-ticker-item" key={i}>{name}</span>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            PRODUCT SHOWCASE — Interest + Desire
            Asymmetric bento grid: 1 large + 2 stacked.
            Each card has its own accent, layout, and personality.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-showcase" aria-label="Our platform">
          <div className="lp-container">
            <div className="lp-section-header reveal">
              <span className="lp-kicker">Three experiences, one platform</span>
              <h2 className="lp-section-title">
                Built for everyone<br className="lp-br-desktop" />
                {' '}in the food chain.
              </h2>
            </div>

            <div className="lp-bento">
              {/* ── Customer card — large, prominent ── */}
              <Link
                to="/customer"
                className="lp-bento-card lp-bento-card--main reveal"
                id="showcase-customer"
              >
                <div className="lp-bento-accent lp-bento-accent--ember" aria-hidden="true" />
                <div className="lp-bento-badge">Most popular</div>
                <div className="lp-bento-body">
                  <div className="lp-bento-icon lp-bento-icon--ember">🍕</div>
                  <h3 className="lp-bento-title">Discover &amp; Order</h3>
                  <p className="lp-bento-desc">
                    Craving something specific? Browse 200+ restaurants, explore
                    curated menus, and have your favorite meal at your
                    doorstep&nbsp;— tracked live, every step of the way.
                  </p>
                  <ul className="lp-bento-features">
                    <li>Real-time GPS tracking from kitchen to door</li>
                    <li>Smart recommendations based on your taste</li>
                    <li>One-tap reordering for your go-to meals</li>
                    <li>Wallet, UPI, cards — pay your way</li>
                  </ul>
                  <div className="lp-bento-cta">
                    Start ordering <ArrowRight size={15} />
                  </div>
                </div>
              </Link>

              {/* ── Right column — Restaurant + Admin stacked ── */}
              <div className="lp-bento-stack">
                <Link
                  to="/restaurant"
                  className="lp-bento-card lp-bento-card--secondary reveal"
                  id="showcase-restaurant"
                >
                  <div className="lp-bento-accent lp-bento-accent--amber" aria-hidden="true" />
                  <div className="lp-bento-body">
                    <div className="lp-bento-icon lp-bento-icon--amber">👨‍🍳</div>
                    <h3 className="lp-bento-title">Manage &amp; Grow</h3>
                    <p className="lp-bento-desc">
                      Your kitchen, simplified. Live order queues, real-time menu
                      management, and revenue analytics that help you grow.
                    </p>
                    <div className="lp-bento-cta lp-bento-cta--amber">
                      Open dashboard <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin"
                  className="lp-bento-card lp-bento-card--tertiary reveal"
                  id="showcase-admin"
                >
                  <div className="lp-bento-accent lp-bento-accent--indigo" aria-hidden="true" />
                  <div className="lp-bento-body">
                    <div className="lp-bento-icon lp-bento-icon--indigo">⚡</div>
                    <h3 className="lp-bento-title">Oversee &amp; Scale</h3>
                    <p className="lp-bento-desc">
                      Full platform control. Monitor every order, manage every
                      restaurant, and scale operations across 14&nbsp;zones.
                    </p>
                    <div className="lp-bento-cta lp-bento-cta--indigo">
                      Open admin <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            STATS — Trust
            Asymmetric layout: 1 featured stat + 3 supporting.
            Numbers count up only when scrolled into view.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-stats" aria-label="Platform statistics">
          <div className="lp-stats-bloom" aria-hidden="true" />
          <div className="lp-container">
            <div className="lp-stats-grid">
              <div className="lp-stats-main reveal">
                <StatCounter
                  value={12000}
                  suffix="+"
                  label="Orders delivered"
                  sublabel="and counting"
                />
              </div>
              <div className="lp-stats-secondary">
                <div className="reveal" style={{ transitionDelay: '80ms' }}>
                  <StatCounter value={200} suffix="+" label="Restaurant partners" />
                </div>
                <div className="reveal" style={{ transitionDelay: '160ms' }}>
                  <StatCounter value={98} suffix="%" label="On-time delivery" />
                </div>
                <div className="reveal" style={{ transitionDelay: '240ms' }}>
                  <StatCounter value={14} label="Delivery zones" />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            HOW IT WORKS — Confidence
            3 steps with connecting dashed line.
            Editorial two-column layout on desktop:
            sticky header left, steps right.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-steps" aria-label="How it works">
          <div className="lp-container">
            <div className="lp-section-header reveal">
              <span className="lp-kicker">Simple by design</span>
              <h2 className="lp-section-title">From craving<br /> to doorstep.</h2>
            </div>

            <div className="lp-steps-list" role="list">
              <div className="lp-steps-line" aria-hidden="true" />

              {[
                {
                  num: '01',
                  title: 'Discover',
                  desc: 'Search by cuisine, rating, or distance. Explore menus with real photos and honest reviews from your neighbors.',
                },
                {
                  num: '02',
                  title: 'Order',
                  desc: 'Add to cart, customize your meal, and check out in under 60\u00A0seconds. Save favorites for one-tap reordering.',
                },
                {
                  num: '03',
                  title: 'Enjoy',
                  desc: 'Track your order live from kitchen to doorstep. No guessing, no waiting in the dark. Just hot food, on time.',
                },
              ].map(({ num, title, desc }, i) => (
                <div
                  className="lp-step reveal"
                  key={num}
                  role="listitem"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="lp-step-num" aria-hidden="true">{num}</div>
                  <div className="lp-step-content">
                    <h3 className="lp-step-title">{title}</h3>
                    <p className="lp-step-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            TESTIMONIALS — Social validation
            Staggered grid with controlled asymmetry.
            Middle card floats higher. Each has unique accent.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-testimonials" aria-label="What our community says">
          <div className="lp-container">
            <div className="lp-section-header reveal">
              <span className="lp-kicker">Real stories</span>
              <h2 className="lp-section-title">Heard from our community.</h2>
            </div>

            <div className="lp-testimonials-grid">
              {[
                {
                  quote:
                    'I ordered butter chicken at 11pm and it arrived in 28 minutes. Still hot. Still perfect. FoodFlow just gets it.',
                  name: 'Priya Sharma',
                  role: 'Customer since 2024',
                  initials: 'PS',
                  stars: 5,
                  accent: 'ember',
                },
                {
                  quote:
                    'Managing 200+ orders a day was chaos before FoodFlow. Now my kitchen runs like clockwork. Revenue is up 40% this quarter.',
                  name: 'Chef Arjun Mehta',
                  role: 'The Grill House, Owner',
                  initials: 'AM',
                  stars: 5,
                  accent: 'amber',
                },
                {
                  quote:
                    'The admin dashboard gives me a bird\u2019s-eye view of every restaurant and every delivery. Game changer for ops.',
                  name: 'Rohan Kapoor',
                  role: 'Operations Lead',
                  initials: 'RK',
                  stars: 5,
                  accent: 'indigo',
                },
              ].map(({ quote, name, role, initials, stars, accent }, i) => (
                <article
                  className={`lp-testimonial lp-testimonial--${accent} reveal`}
                  key={i}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div
                    className="lp-testimonial-stars"
                    aria-label={`${stars} out of 5 stars`}
                  >
                    {[...Array(stars)].map((_, j) => (
                      <Star key={j} size={14} fill="currentColor" color="currentColor" />
                    ))}
                  </div>
                  <blockquote className="lp-testimonial-quote">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <div className="lp-testimonial-author">
                    <div
                      className={`lp-testimonial-avatar lp-testimonial-avatar--${accent}`}
                      aria-hidden="true"
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="lp-testimonial-name">{name}</div>
                      <div className="lp-testimonial-role">{role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            FINAL CTA — Action
            Full-bleed dark section. Single CTA. No escape.
            Ember Bloom behind the button for warmth.
            ══════════════════════════════════════════════════════ */}
        <section className="lp-final-cta" aria-label="Get started with FoodFlow">
          <div className="lp-final-bloom" aria-hidden="true" />
          <div className="lp-container lp-final-content">
            <h2 className="lp-final-title reveal">
              Your next favorite meal<br />
              is already <span className="lp-ember-text">waiting.</span>
            </h2>
            <p className="lp-final-sub reveal">
              Join thousands of food lovers who&rsquo;ve made FoodFlow
              their&nbsp;go&#8209;to.
            </p>
            <div className="lp-final-actions reveal">
              <Link
                to="/customer"
                className="lp-btn-primary lp-btn-primary--large"
                id="final-cta"
              >
                Order your first meal <ArrowRight size={18} />
              </Link>
            </div>
            <p className="lp-final-note reveal">
              Free to use&ensp;·&ensp;No subscription required&ensp;·&ensp;Delivered in minutes
            </p>
          </div>
        </section>
      </main>


      {/* ════════════════════════════════════════════════════════
          FOOTER — Brand recall
          Ultra-minimal. No fat, no filler.
          ════════════════════════════════════════════════════════ */}
      <footer className="lp-footer" role="contentinfo">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <Link to="/" className="lp-logo" aria-label="FoodFlow home">
              <img src="/logo.png" alt="FoodFlow Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="lp-footer-tagline">
              Where every craving finds its way home.
            </p>
          </div>

          <div className="lp-footer-links">
            <Link to="/customer" className="lp-footer-link">Order food</Link>
            <Link to="/restaurant" className="lp-footer-link">Restaurant panel</Link>
            <Link to="/admin" className="lp-footer-link">Admin</Link>
          </div>

          <div className="lp-footer-bottom">
            <p className="lp-footer-credit">
              Built by Rudra Chokshi · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}