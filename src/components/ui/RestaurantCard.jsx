import React from 'react';
import { Star, Clock, ArrowRight, Flame, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProgressiveImage from './ProgressiveImage';

const RestaurantCard = React.memo(({ restaurant, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/customer/restaurant/${restaurant.id}`)}
      style={{
      cursor: 'pointer',
      background: 'var(--bg-elevated)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid var(--glass-border)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
    }}
    >
      {/* Image Banner */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <ProgressiveImage src={restaurant.coverImage} alt={restaurant.name} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)' }} />
        
        {restaurant.isPopular && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(90deg, #FF4D2E, #FF7B00)', color: 'white', padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Flame size={12} fill="white" /> Popular
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{restaurant.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
            <span>{restaurant.rating}</span>
            <Star size={12} fill="white" />
          </div>
        </div>

        <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {restaurant.cuisine.join(' • ')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', borderTop: '1px solid var(--glass-border-light)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
            <Clock size={14} color="#FF4D2E" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
            <Bike size={14} color="#FF4D2E" />
            <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RestaurantCard;
