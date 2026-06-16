import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal, Flame, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantCard from '../../components/ui/RestaurantCard';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const restaurants = useStore(state => state.restaurants);
  const [localQuery, setLocalQuery] = useState(query);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState('All');

  // Debounce input to prevent UI freezing on rapid typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(localQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery]);

  // Elite filtering logic (Memoized & Instant Search)
  const filtered = useMemo(() => {
    let result = restaurants.filter(r =>
      r.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(debouncedQuery.toLowerCase()))
    );

    if (activeFilter === 'Top Rated') result = result.sort((a, b) => b.rating - a.rating);
    if (activeFilter === 'Fastest') result = result.sort((a, b) => a.deliveryTime - b.deliveryTime);

    return result;
  }, [restaurants, debouncedQuery, activeFilter]);

  const filters = [
    { label: 'All', icon: <Filter size={16} /> },
    { label: 'Top Rated', icon: <Star size={16} /> },
    { label: 'Fastest', icon: <Clock size={16} /> },
    { label: 'Trending', icon: <Flame size={16} /> }
  ];

  return (
    <div style={{ paddingTop: '8rem', minHeight: '100vh', paddingBottom: '6rem', background: '#f9fafb' }}>
      <div className="container">

        {/* Elite Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>Explore Menus.</h1>

          <div className="search-input-wrapper" style={{
            position: 'relative',
            background: 'var(--bg-elevated)',
            border: '1px solid #e5e7eb',
            borderRadius: '9999px',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}>
            <SearchIcon size={24} style={{ marginLeft: '1.5rem', color: '#9ca3af' }} />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search for restaurants or dishes..."
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-primary)', flex: 1, padding: '1rem', fontSize: '1.2rem', outline: 'none', fontWeight: 500
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearchParams({ q: localQuery });
              }}
            />
            <button
              className="search-btn"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: '#111827', color: '#ffffff', borderRadius: '9999px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => setSearchParams({ q: localQuery })}
              onMouseOver={(e) => e.currentTarget.style.background = '#000000'}
              onMouseOut={(e) => e.currentTarget.style.background = '#111827'}
            >
              Search
            </button>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {filters.map(filter => (
              <motion.button
                key={filter.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  background: activeFilter === filter.label ? '#111827' : '#ffffff',
                  color: activeFilter === filter.label ? '#ffffff' : '#4b5563',
                  border: `1px solid ${activeFilter === filter.label ? '#111827' : 'var(--glass-border)'}`,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {filter.icon} {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="search-header-flex" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {filtered.length} {filtered.length === 1 ? 'Result' : 'Results'} found
          </h2>
          <button onClick={() => toast(' Advanced filters coming soon!', { icon: '⚙️' })} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid #e5e7eb', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        <motion.div
          className="grid-cols-4"
        >
          <AnimatePresence>
            {filtered.map((restaurant, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={restaurant.id}
              >
                <RestaurantCard restaurant={restaurant} delay={i * 0.05} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '6rem 0', color: '#9ca3af' }}
          >
            <SearchIcon size={64} style={{ opacity: 0.3, margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ fontSize: '2rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>No exact matches found</h2>
            <p style={{ fontSize: '1.1rem' }}>Try adjusting your search or filters to find what you're looking for.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
