import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowRight, Shield, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const PageLayout = ({ title, subtitle, children }) => (
  <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '6rem' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '4rem', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="company-content-wrapper"
      >
        {children}
      </motion.div>
    </div>
  </div>
);

// CSS applied via a style block inside the components
const textStyles = `
  .company-content-wrapper p { font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 1.5rem; }
  .company-content-wrapper h2 { font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 3rem 0 1.5rem; letter-spacing: -0.02em; }
  .company-content-wrapper h3 { font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 2rem 0 1rem; }
  .company-content-wrapper ul { margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--text-secondary); line-height: 1.8; }
  .company-content-wrapper li { margin-bottom: 0.5rem; }
`;

export const AboutUs = () => (
  <PageLayout title="About Us" subtitle="We're on a mission to transform how people experience food in their city.">
    <style>{textStyles}</style>
    <h2>Our Story</h2>
    <p>Founded in 2026, FoodFlow started with a simple belief: getting great food should be as enjoyable as eating it. We were tired of clunky apps, cold deliveries, and limited choices. We wanted to build a platform that treated local restaurants as partners and customers as guests.</p>

    <h2>Our Values</h2>
    <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
      {[
        { title: 'Quality First', desc: 'We never compromise on the quality of our service, our partners, or our technology.' },
        { title: 'Local Heroes', desc: 'We champion independent restaurants and help local businesses thrive in the digital age.' },
        { title: 'Speed & Precision', desc: 'Our logistics network is built for maximum efficiency, ensuring your food arrives exactly as intended.' }
      ].map((v, i) => (
        <div key={i} style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--accent)' }}>{v.title}</h3>
          <p style={{ margin: 0 }}>{v.desc}</p>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Careers = () => (
  <PageLayout title="Careers" subtitle="Join the team that's reshaping the food delivery industry.">
    <style>{textStyles}</style>
    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-elevated)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
      <h2 style={{ margin: '0 0 1rem' }}>No open roles right now</h2>
      <p style={{ margin: '0 0 2rem' }}>We're currently fully staffed, but we're always looking for exceptional talent. Check back soon!</p>
      <button onClick={() => toast(' Job alerts coming soon!', { icon: '💼' })} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, border: 'none' }}>
        Notify me of openings
      </button>
    </div>
  </PageLayout>
);

export const Blog = () => (
  <PageLayout title="The FoodFlow Blog" subtitle="Insights, updates, and stories from our kitchen to yours.">
    <style>{textStyles}</style>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {[
        { title: 'The Future of Food Delivery', date: 'June 10, 2026', tag: 'Engineering' },
        { title: 'Spotlight: Top 10 Pizzerias in Ahmedabad', date: 'May 28, 2026', tag: 'Community' },
        { title: 'Introducing FoodFlow Plus', date: 'May 15, 2026', tag: 'Product' }
      ].map((post, i) => (
        <div key={i} style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)' }}>{post.tag}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.6rem' }}>{post.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            Read article <ArrowRight size={16} />
          </div>
        </div>
      ))}
    </div>
  </PageLayout>
);

export const Contact = () => (
  <PageLayout title="Contact Us" subtitle="We're here to help. Reach out to us anytime.">
    <style>{textStyles}</style>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(255,77,46,0.1)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}><Mail size={24} /></div>
        <h3 style={{ margin: '0 0 0.5rem' }}>Email Us</h3>
        <p style={{ margin: 0 }}>support@foodflow.app</p>
      </div>
      <div style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(255,77,46,0.1)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}><Phone size={24} /></div>
        <h3 style={{ margin: '0 0 0.5rem' }}>Call Us</h3>
        <p style={{ margin: 0 }}>+91 98765 43210</p>
      </div>
      <div style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(255,77,46,0.1)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}><MapPin size={24} /></div>
        <h3 style={{ margin: '0 0 0.5rem' }}>Visit Us</h3>
        <p style={{ margin: 0 }}>Ahmedabad, Gujarat</p>
      </div>
    </div>
  </PageLayout>
);

export const LegalTemplate = ({ title, lastUpdated, children }) => (
  <PageLayout title={title} subtitle={`Last updated: ${lastUpdated}`}>
    <style>{textStyles}</style>
    <div style={{ background: 'var(--bg-elevated)', padding: 'clamp(2rem, 5vw, 4rem)', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
      {children}
    </div>
  </PageLayout>
);

export const TermsConditions = () => (
  <LegalTemplate title="Terms & Conditions" lastUpdated="June 1, 2026">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using FoodFlow, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

    <h2>2. User Registration</h2>
    <p>To use certain features of the service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>

    <h2>3. Ordering and Payment</h2>
    <p>When you place an order through FoodFlow, you are offering to purchase the items you have selected. All orders are subject to availability and confirmation of the order price.</p>

    <h2>4. Liability</h2>
    <p>FoodFlow shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the services and products offered on this site.</p>
  </LegalTemplate>
);

export const PrivacyPolicy = () => (
  <LegalTemplate title="Privacy Policy" lastUpdated="June 1, 2026">
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>

    <h2>2. How We Use Your Information</h2>
    <p>We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, and develop new features.</p>

    <h2>3. Sharing of Information</h2>
    <p>We may share the information we collect about you as described in this policy or as described at the time of collection or sharing, including with restaurants to fulfill your orders.</p>
  </LegalTemplate>
);

export const CookiePolicy = () => (
  <LegalTemplate title="Cookie Policy" lastUpdated="June 1, 2026">
    <h2>What are cookies?</h2>
    <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

    <h2>How we use cookies</h2>
    <p>We use cookies to understand how you use our site and to improve your experience. This includes personalizing content and advertising. By continuing to use our site, you accept our use of cookies.</p>

    <h2>Managing cookies</h2>
    <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org.</p>
  </LegalTemplate>
);

export const RefundPolicy = () => (
  <LegalTemplate title="Refund Policy" lastUpdated="June 1, 2026">
    <h2>1. Order Cancellation</h2>
    <p>You may cancel an order before the restaurant has accepted it. Once the restaurant begins preparing your food, the order cannot be cancelled and no refund will be issued.</p>

    <h2>2. Missing or Incorrect Items</h2>
    <p>If your order has missing or incorrect items, please contact customer support within 24 hours of delivery. We will issue a partial or full refund to your original payment method based on the situation.</p>

    <h2>3. Quality Issues</h2>
    <p>If you are unsatisfied with the quality of your food, please contact us immediately. We investigate all quality complaints and may issue a refund or account credit at our discretion.</p>

    <h2>4. Refund Processing Time</h2>
    <p>Approved refunds are processed immediately but may take 5-7 business days to appear on your bank or credit card statement depending on your financial institution.</p>
  </LegalTemplate>
);
