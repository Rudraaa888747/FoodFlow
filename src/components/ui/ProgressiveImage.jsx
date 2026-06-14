import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProgressiveImage({ src, alt, className, style, objectFit = 'cover' }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}>
      {/* Shimmer Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--bg-tertiary) 0%, var(--glass-border) 50%, var(--bg-tertiary) 100%)',
              backgroundSize: '200% 100%',
              animation: 'ff-shimmer 1.5s infinite linear',
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={isLoaded ? { opacity: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          display: 'block',
        }}
      />

      <style>{`
        @keyframes ff-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
