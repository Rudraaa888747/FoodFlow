import React from 'react';
import { Star, MessageSquare, ThumbsUp, MoreHorizontal, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RestaurantReviews() {
  const reviews = [
    { id: 1, customer: 'Alice Johnson', rating: 5, date: '2 days ago', text: 'Amazing Butter Chicken! Definitely ordering again.', reply: null, avatarColor: '#17c964' },
    { id: 2, customer: 'Rahul Sharma', rating: 4, date: '1 week ago', text: 'Food was great but delivery was slightly delayed.', reply: 'We apologize for the delay, Rahul. We will ensure faster delivery next time!', avatarColor: '#0070f3' },
    { id: 3, customer: 'Priya Desai', rating: 5, date: '2 weeks ago', text: 'The Garlic Naan was perfectly cooked.', reply: null, avatarColor: '#f5a623' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="flex-col" style={{ gap: '2rem' }}>
      
      {/* Header */}
      <header className="flex-between">
        <motion.div variants={itemVariants}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Customer Reviews</h1>
          <p className="text-secondary" style={{ fontSize: '1.05rem' }}>Monitor and respond to customer feedback.</p>
        </motion.div>
      </header>

      {/* Analytics Overview */}
      <motion.div variants={itemVariants} className="glass-panel review-breakdown" style={{ padding: '2rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <div style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>4.6</div>
          <div style={{ display: 'flex', justifyContent: 'center', color: '#f5a623', marginBottom: '0.5rem' }}>
            <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" style={{ opacity: 0.5 }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on 1,245 reviews</div>
        </div>
        
        <div style={{ width: '1px', height: '100px', background: 'var(--glass-border)' }} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { stars: 5, pct: 75 },
            { stars: 4, pct: 15 },
            { stars: 3, pct: 5 },
            { stars: 2, pct: 3 },
            { stars: 1, pct: 2 },
          ].map(row => (
            <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '30px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {row.stars} <Star size={12} fill="currentColor" />
              </div>
              <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ height: '100%', background: row.stars >= 4 ? 'var(--success)' : row.stars === 3 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px' }} 
                />
              </div>
              <div style={{ width: '40px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{row.pct}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div variants={itemVariants}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Recent Feedback</h2>
          <button className="secondary-button" style={{ padding: '0.5rem 1rem' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review, i) => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-panel review-item" 
              style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}
            >
              {/* Avatar */}
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600, color: '#fff', flexShrink: 0, boxShadow: `0 0 15px ${review.avatarColor}40` }}>
                {review.customer.charAt(0)}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{review.customer}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{review.date}</span>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                </div>
                
                <div style={{ display: 'flex', color: '#f5a623', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} stroke={i < review.rating ? 'currentColor' : 'var(--text-tertiary)'} />
                  ))}
                </div>
                
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  "{review.text}"
                </p>
                
                {/* Reply Section */}
                {review.reply ? (
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--glass-border-light)', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '3px', background: 'var(--text-primary)', borderRadius: '3px' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Restaurant Response</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Just now</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{review.reply}</p>
                    </div>
                  </div>
                ) : (
                  <div className="review-reply-action" style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" className="glass-input" placeholder="Type a reply..." style={{ flex: 1 }} />
                    <button className="secondary-button" style={{ padding: '0 1.5rem' }}>Reply</button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
