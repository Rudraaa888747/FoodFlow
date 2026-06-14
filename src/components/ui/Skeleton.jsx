import React from 'react';
import { motion } from 'framer-motion';

const shimmerAnimation = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0' },
  transition: { repeat: Infinity, duration: 1.5, ease: 'linear' }
};

export function Skeleton({ width, height, borderRadius = '8px', style, className }) {
  return (
    <motion.div
      className={className}
      initial={shimmerAnimation.initial}
      animate={shimmerAnimation.animate}
      transition={shimmerAnimation.transition}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-tertiary) 0%, var(--glass-border) 50%, var(--bg-tertiary) 100%)',
        backgroundSize: '200% 100%',
        ...style
      }}
    />
  );
}

export function RestaurantSkeleton() {
  return (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
      <Skeleton width="100%" height="180px" borderRadius="0" />
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <Skeleton width="60%" height="24px" />
          <Skeleton width="15%" height="24px" borderRadius="999px" />
        </div>
        <Skeleton width="40%" height="16px" style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Skeleton width="25%" height="20px" borderRadius="999px" />
          <Skeleton width="25%" height="20px" borderRadius="999px" />
        </div>
      </div>
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.125rem', display: 'flex', gap: '1rem' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton width="70%" height="20px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="30%" height="20px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton width="100%" height="14px" style={{ marginBottom: '0.25rem' }} />
        <Skeleton width="80%" height="14px" style={{ marginBottom: '1rem' }} />
        <Skeleton width="80px" height="32px" borderRadius="999px" style={{ marginTop: 'auto' }} />
      </div>
      <Skeleton width="110px" height="110px" borderRadius="10px" style={{ flexShrink: 0 }} />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--glass-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="100px" height="20px" />
        <Skeleton width="40px" height="40px" borderRadius="12px" />
      </div>
      <Skeleton width="60%" height="32px" />
      <Skeleton width="80px" height="14px" />
    </div>
  );
}

export function ListRowSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
      <Skeleton width="15%" height="20px" style={{ marginRight: '1rem' }} />
      <Skeleton width="20%" height="20px" style={{ marginRight: '1rem' }} />
      <Skeleton width="25%" height="20px" style={{ marginRight: 'auto' }} />
      <Skeleton width="10%" height="24px" borderRadius="999px" style={{ marginRight: '1rem' }} />
      <Skeleton width="10%" height="20px" />
    </div>
  );
}
