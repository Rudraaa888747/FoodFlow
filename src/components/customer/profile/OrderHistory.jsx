import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Activity, Star, CheckCircle2, Clock, RotateCcw,
  ShoppingBag, Flame, ChevronDown, ChevronUp, MapPin, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Delivered: {
    label: 'Delivered',
    dot: '#10b981',
    bg: 'var(--oh-success-bg)',
    text: 'var(--oh-success-text)',
    border: 'var(--oh-success-border)',
    icon: <CheckCircle2 size={11} />,
  },
  Preparing: {
    label: 'Preparing',
    dot: '#f97316',
    bg: 'var(--oh-warning-bg)',
    text: 'var(--oh-warning-text)',
    border: 'var(--oh-warning-border)',
    icon: <Flame size={11} />,
  },
  'Out For Delivery': {
    label: 'Out For Delivery',
    dot: '#3b82f6',
    bg: 'var(--oh-info-bg)',
    text: 'var(--oh-info-text)',
    border: 'var(--oh-info-border)',
    icon: <Activity size={11} />,
  },
  Ready: {
    label: 'Ready',
    dot: '#eab308',
    bg: 'var(--oh-ready-bg)',
    text: 'var(--oh-ready-text)',
    border: 'var(--oh-ready-border)',
    icon: <CheckCircle2 size={11} />,
  },
  Confirmed: {
    label: 'Confirmed',
    dot: '#6366f1',
    bg: 'var(--oh-confirmed-bg)',
    text: 'var(--oh-confirmed-text)',
    border: 'var(--oh-confirmed-border)',
    icon: <CheckCircle2 size={11} />,
  },
  Pending: {
    label: 'Pending',
    dot: '#9ca3af',
    bg: 'var(--oh-neutral-bg)',
    text: 'var(--oh-neutral-text)',
    border: 'var(--oh-neutral-border)',
    icon: <Clock size={11} />,
  },
  'Refund Requested': {
    label: 'Refund Requested',
    dot: '#ef4444',
    bg: 'var(--oh-danger-bg)',
    text: 'var(--oh-danger-text)',
    border: 'var(--oh-danger-border)',
    icon: <RotateCcw size={11} />,
  },
};

// ─── animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 130, damping: 20 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// ─── StatusPill ────────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  return (
    <span
      className="oh-status-pill"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      <span className="oh-status-dot" style={{ background: cfg.dot }} />
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── OrderCard ─────────────────────────────────────────────────────────────────
function OrderCard({ order, addToCart, showToast, updateOrderStatus }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const total = Number(order.total ?? 0);
  const items = order.items ?? [];
  const isDelivered = order.status === 'Delivered';
  const isActive = !isDelivered && order.status !== 'Refund Requested';

  const formattedDate = (() => {
    try {
      const d = order.date ? new Date(order.date) : new Date();
      // Fallback to today's date if parsed date is invalid
      const validDate = isNaN(d.getTime()) ? new Date() : d;
      return validDate.toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return new Date().toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    }
  })();

  const handleReorder = () => {
    items.forEach(item => addToCart && addToCart(item));
    navigate('/customer/cart');
    showToast && showToast('Items added to cart!');
  };

  const handleRefund = () => {
    updateOrderStatus && updateOrderStatus(order.id, 'Refund Requested');
    showToast && showToast('Refund request submitted successfully!');
  };

  const breakdown = [
    { label: 'Item Total', value: order.subtotal },
    { label: 'GST (5%)', value: order.gst },
    { label: 'Delivery Fee', value: order.deliveryFee, free: Number(order.deliveryFee ?? 0) === 0 },
    { label: 'Platform Fee', value: order.platformFee },
    order.discount && Number(order.discount) > 0
      ? { label: 'Discount', value: `-${Number(order.discount).toFixed(2)}`, isDiscount: true }
      : null,
    order.tip && Number(order.tip) > 0
      ? { label: 'Delivery Tip', value: order.tip }
      : null,
  ].filter(Boolean);

  return (
    <motion.article
      variants={fadeUp}
      layout
      className="oh-card"
      aria-label={`Order ${order.id}, status ${order.status}, total ₹${total.toFixed(0)}`}
    >
      {/* top bar */}
      <div className="oh-card-header">
        <div className="oh-card-meta">
          <div className="oh-order-id">
            <Package size={14} className="oh-icon-muted" aria-hidden="true" />
            <span>{order.id}</span>
          </div>
          <StatusPill status={order.status} />
        </div>
        <div className="oh-card-amount">
          <span className="oh-total">₹{total.toFixed(0)}</span>
          {order.paymentMethod && (
            <span className="oh-payment-method">
              <CreditCard size={11} aria-hidden="true" /> {order.paymentMethod}
            </span>
          )}
        </div>
      </div>

      {/* restaurant + date */}
      <div className="oh-card-sub">
        {order.restaurantName && (
          <span className="oh-restaurant">{order.restaurantName}</span>
        )}
        <span className="oh-date">
          <Clock size={11} aria-hidden="true" /> {formattedDate}
        </span>
      </div>

      {/* items */}
      <div className="oh-items-wrap">
        {items.slice(0, expanded ? items.length : 3).map((item, i) => (
          <div key={i} className="oh-item-row">
            <div className="oh-item-left">
              <span className="oh-qty-badge" aria-label={`Quantity ${item.quantity}`}>
                {item.quantity}
              </span>
              <span className="oh-item-name">{item.name}</span>
            </div>
            {item.price != null && (
              <span className="oh-item-price">
                ₹{(Number(item.price) * item.quantity).toFixed(0)}
              </span>
            )}
          </div>
        ))}
        {items.length > 3 && (
          <button
            className="oh-expand-btn"
            onClick={() => setExpanded(p => !p)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show fewer items' : `Show all ${items.length} items`}
          >
            {expanded
              ? <><ChevronUp size={13} /> Show less</>
              : <><ChevronDown size={13} /> +{items.length - 3} more items</>
            }
          </button>
        )}
      </div>

      {/* price breakdown */}
      {breakdown.length > 0 && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="oh-breakdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              {breakdown.map((row, i) => (
                <div
                  key={i}
                  className={`oh-breakdown-row${row.isDiscount ? ' oh-discount-row' : ''}`}
                >
                  <span>{row.label}</span>
                  <span className={row.free ? 'oh-free-tag' : ''}>
                    {row.free
                      ? 'FREE'
                      : row.value != null
                        ? `₹${Number(row.value).toFixed(2)}`
                        : '—'}
                  </span>
                </div>
              ))}
              <div className="oh-breakdown-total">
                <span>Total Paid</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* delivery address */}
      {order.deliveryAddress && expanded && (
        <motion.div
          className="oh-address"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <MapPin size={13} className="oh-icon-muted" aria-hidden="true" />
          <span>{order.deliveryAddress}</span>
        </motion.div>
      )}

      {/* actions */}
      <div className="oh-actions">
        {isActive ? (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="oh-btn oh-btn-primary"
            onClick={() => navigate(`/customer/orders/${order.id}`)}
            aria-label={`Track order ${order.id} live`}
          >
            <Activity size={14} /> Track live
          </motion.button>
        ) : isDelivered ? (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="oh-btn oh-btn-primary"
            onClick={handleReorder}
            aria-label={`Reorder items from order ${order.id}`}
          >
            <RotateCcw size={14} /> Reorder
          </motion.button>
        ) : null}

        {isDelivered && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="oh-btn oh-btn-ghost"
              onClick={() => showToast && showToast(' Rating feature is coming soon!', 'info')}
              aria-label={`Rate order ${order.id}`}
            >
              <Star size={14} /> Rate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="oh-btn oh-btn-danger"
              onClick={handleRefund}
              aria-label={`Request refund for order ${order.id}`}
            >
              <RotateCcw size={14} /> Refund
            </motion.button>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="oh-btn oh-btn-ghost oh-expand-toggle"
          onClick={() => setExpanded(p => !p)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse order details' : 'Expand order details'}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Less' : 'Details'}
        </motion.button>
      </div>
    </motion.article>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState() {
  const navigate = useNavigate();
  return (
    <motion.div variants={fadeUp} className="oh-empty">
      <div className="oh-empty-icon" aria-hidden="true">
        <ShoppingBag size={32} />
      </div>
      <h3 className="oh-empty-title">No orders yet</h3>
      <p className="oh-empty-sub">Your first meal is one tap away.</p>
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className="oh-btn oh-btn-cta"
        onClick={() => navigate('/customer/search')}
        aria-label="Browse restaurants to place your first order"
      >
        Browse restaurants
      </motion.button>
    </motion.div>
  );
}

// ─── styles ────────────────────────────────────────────────────────────────────
const OH_STYLES = `
  .oh-root {
    --oh-success-bg: #ecfdf5; --oh-success-text: #065f46; --oh-success-border: #a7f3d0;
    --oh-warning-bg: #fff7ed; --oh-warning-text: #9a3412; --oh-warning-border: #fed7aa;
    --oh-info-bg: #eff6ff;   --oh-info-text: #1e40af;   --oh-info-border: #bfdbfe;
    --oh-ready-bg: #fefce8;  --oh-ready-text: #713f12;  --oh-ready-border: #fde68a;
    --oh-confirmed-bg: #eef2ff; --oh-confirmed-text: #3730a3; --oh-confirmed-border: #c7d2fe;
    --oh-neutral-bg: #f9fafb;   --oh-neutral-text: #374151;   --oh-neutral-border: #e5e7eb;
    --oh-danger-bg: #fef2f2;    --oh-danger-text: #991b1b;    --oh-danger-border: #fecaca;
    --oh-card-bg: #ffffff;
    --oh-card-border: rgba(0,0,0,0.08);
    --oh-card-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --oh-items-bg: #f9fafb;
    --oh-items-border: rgba(0,0,0,0.06);
    --oh-breakdown-bg: #f3f4f6;
    --oh-text-primary: #111827;
    --oh-text-secondary: #6b7280;
    --oh-text-muted: #9ca3af;
    --oh-accent: #111827;
    --oh-accent-text: #ffffff;
    --oh-badge-bg: #111827;
    --oh-badge-text: #ffffff;
    --oh-btn-ghost-bg: transparent;
    --oh-btn-ghost-border: rgba(0,0,0,0.12);
    --oh-btn-ghost-text: #374151;
    --oh-btn-danger-bg: transparent;
    --oh-btn-danger-border: #fecaca;
    --oh-btn-danger-text: #991b1b;
    --oh-divider: rgba(0,0,0,0.07);
    --oh-free-color: #059669;
    --oh-discount-color: #059669;
  }



  .oh-root { width: 100%; font-family: inherit; }
  .oh-list { display: flex; flex-direction: column; gap: 0.875rem; }

  .oh-card {
    background: var(--oh-card-bg);
    border: 1px solid var(--oh-card-border);
    border-radius: 20px;
    padding: 1.375rem 1.5rem;
    box-shadow: var(--oh-card-shadow);
    transition: box-shadow 0.2s ease;
    overflow: hidden;
  }
  .oh-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.1); }

  .oh-card-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem;
  }
  .oh-card-meta { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
  .oh-order-id {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.85rem; font-weight: 700;
    color: var(--oh-text-primary); letter-spacing: 0.01em;
  }
  .oh-card-amount { text-align: right; flex-shrink: 0; }
  .oh-total {
    display: block; font-size: 1.3rem; font-weight: 800;
    color: var(--oh-text-primary); letter-spacing: -0.03em; line-height: 1;
  }
  .oh-payment-method {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.72rem; color: var(--oh-text-muted); margin-top: 4px;
  }

  .oh-card-sub {
    display: flex; align-items: center; gap: 0.75rem;
    flex-wrap: wrap; margin-bottom: 1rem;
  }
  .oh-restaurant { font-size: 0.82rem; font-weight: 600; color: var(--oh-text-secondary); }
  .oh-date {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.78rem; color: var(--oh-text-muted);
  }

  .oh-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 700;
    padding: 3px 9px 3px 7px; border-radius: 9999px;
    letter-spacing: 0.2px; white-space: nowrap;
  }
  .oh-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  .oh-items-wrap {
    background: var(--oh-items-bg);
    border: 1px solid var(--oh-items-border);
    border-radius: 14px; padding: 0.875rem 1rem;
    display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.875rem;
  }
  .oh-item-row { display: flex; justify-content: space-between; align-items: center; }
  .oh-item-left { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }
  .oh-qty-badge {
    width: 22px; height: 22px;
    background: var(--oh-badge-bg); color: var(--oh-badge-text);
    font-size: 0.68rem; font-weight: 800; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .oh-item-name {
    font-size: 0.85rem; color: var(--oh-text-primary); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;
  }
  .oh-item-price { font-size: 0.8rem; color: var(--oh-text-secondary); font-weight: 600; flex-shrink: 0; }
  .oh-expand-btn {
    display: inline-flex; align-items: center; gap: 4px;
    background: none; border: none; color: var(--oh-text-muted);
    font-size: 0.78rem; font-weight: 600; padding: 2px 0;
    cursor: pointer; transition: color 0.15s; margin-top: 2px;
  }
  .oh-expand-btn:hover { color: var(--oh-text-primary); }

  .oh-breakdown {
    background: var(--oh-breakdown-bg); border-radius: 12px;
    padding: 0.875rem 1rem; margin-bottom: 0.875rem; overflow: hidden;
  }
  .oh-breakdown-row {
    display: flex; justify-content: space-between;
    font-size: 0.8rem; color: var(--oh-text-secondary);
    padding: 0.28rem 0; font-weight: 500;
  }
  .oh-discount-row { color: var(--oh-discount-color); }
  .oh-free-tag { color: var(--oh-free-color); font-weight: 700; }
  .oh-breakdown-total {
    display: flex; justify-content: space-between;
    font-size: 0.85rem; font-weight: 800; color: var(--oh-text-primary);
    padding-top: 0.625rem; margin-top: 0.5rem;
    border-top: 1px solid var(--oh-divider);
  }

  .oh-address {
    display: flex; align-items: flex-start; gap: 0.45rem;
    font-size: 0.78rem; color: var(--oh-text-secondary);
    margin-bottom: 0.875rem; line-height: 1.5;
  }
  .oh-address svg { flex-shrink: 0; margin-top: 2px; }

  .oh-actions {
    display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
    padding-top: 1rem; border-top: 1px solid var(--oh-divider); margin-top: 0.25rem;
  }
  .oh-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    border: none; border-radius: 10px; padding: 0.55rem 1.125rem;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s, transform 0.1s;
  }
  .oh-btn-primary { background: var(--oh-accent); color: var(--oh-accent-text); border: 1px solid transparent; }
  .oh-btn-ghost { background: var(--oh-btn-ghost-bg); color: var(--oh-btn-ghost-text); border: 1px solid var(--oh-btn-ghost-border); }
  .oh-btn-danger { background: var(--oh-btn-danger-bg); color: var(--oh-btn-danger-text); border: 1px solid var(--oh-btn-danger-border); }
  .oh-btn-cta {
    background: var(--oh-accent); color: var(--oh-accent-text);
    padding: 0.8rem 2.25rem; font-size: 0.95rem; border-radius: 12px;
    border: none; margin-top: 0.5rem;
  }
  .oh-expand-toggle { margin-left: auto; }
  .oh-icon-muted { color: var(--oh-text-muted); flex-shrink: 0; }

  .oh-empty {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: 4.5rem 2rem; border: 1.5px dashed var(--oh-card-border);
    border-radius: 24px; background: var(--oh-card-bg);
  }
  .oh-empty-icon {
    width: 64px; height: 64px; border-radius: 18px;
    background: var(--oh-items-bg); border: 1px solid var(--oh-card-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--oh-text-muted); margin-bottom: 1.25rem;
  }
  .oh-empty-title { font-size: 1.15rem; font-weight: 800; color: var(--oh-text-primary); margin: 0 0 0.4rem; }
  .oh-empty-sub { color: var(--oh-text-secondary); font-size: 0.9rem; margin: 0 0 1.75rem; }

  @media (max-width: 480px) {
    .oh-card { padding: 1.125rem; border-radius: 16px; }
    .oh-item-name { max-width: 140px; }
    .oh-total { font-size: 1.15rem; }
    .oh-expand-toggle { display: none; }
    .oh-btn { padding: 0.55rem 0.875rem; font-size: 0.8rem; }
  }
`;

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function OrderHistory({ orders, addToCart, showToast, updateOrderStatus }) {
  const safeOrders = orders ?? [];

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="oh-root"
    >
      <style>{OH_STYLES}</style>
      {safeOrders.length === 0 ? (
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <EmptyState />
        </motion.div>
      ) : (
        <motion.div
          className="oh-list"
          variants={stagger}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
        >
          {safeOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              addToCart={addToCart}
              showToast={showToast}
              updateOrderStatus={updateOrderStatus}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}