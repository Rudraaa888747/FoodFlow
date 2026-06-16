import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  CreditCard, MapPin, CheckCircle, Percent, Plus, Minus, Edit2, Check, Loader2, Wallet, Heart, Info, ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Trash2, X, Ticket, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_IMG = '/images/banners/cafe-banner.webp';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', desc: 'Pay via any UPI app', icon: Wallet },
  { id: 'gpay', name: 'Google Pay', desc: 'Pay instantly via GPay', icon: Wallet },
  { id: 'phonepe', name: 'PhonePe', desc: 'Secure payments via PhonePe', icon: Wallet },
  { id: 'paytm', name: 'Paytm', desc: 'Wallet or UPI', icon: Wallet },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay', icon: CreditCard },
  { id: 'cod', name: 'Cash On Delivery', desc: 'Pay when your food arrives', icon: Wallet }
];

const OFFERS = [
  { code: 'SAVE50', desc: 'Flat ₹50 off on orders above ₹199', discount: 50 },
  { code: 'FIRSTORDER', desc: 'Flat ₹100 off on your first order', discount: 100 },
  { code: 'FOODFLOW20', desc: 'Flat ₹120 off on premium restaurants', discount: 120 }
];

const QUICK_TIPS = [10, 20, 50];

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useStore(s => s.cart);
  const clearCart = useStore(s => s.clearCart);
  const placeOrder = useStore(s => s.placeOrder);
  const updateQuantity = useStore(s => s.updateQuantity);
  const removeFromCart = useStore(s => s.removeFromCart);
  const isPremium = useStore(s => s.isPremium);
  
  // States
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
  
  // Address States
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'HOME', text: '123 Premium Apartments, Tech Park Road, Sector 4, Ahmedabad, Gujarat 380015' }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [tempAddressType, setTempAddressType] = useState('WORK');
  const [tempAddressText, setTempAddressText] = useState('');
  
  // Offer States
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [tip, setTip] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derivations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.05;
  const deliveryFee = (isPremium || subtotal > 500) ? 0 : 35;
  const platformFee = 4.99;
  const grandTotal = subtotal + gst + deliveryFee + platformFee - discount + tip;
  const restaurantName = cart.length > 0 ? cart[0].restaurantName || 'Restaurant' : '';



  const handleApplyCoupon = (code) => {
    const offer = OFFERS.find(o => o.code === code.toUpperCase());
    if (offer) {
      setCoupon(offer.code);
      setDiscount(offer.discount);
      setCouponSuccess(true);
      setShowOffersModal(false);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const handleSaveAddress = () => {
    if (tempAddressText.trim().length < 5) {
      alert('Please enter a valid address');
      return;
    }
    if (editingAddressId) {
      setAddresses(addresses.map(a => a.id === editingAddressId ? { ...a, type: tempAddressType, text: tempAddressText } : a));
      setSelectedAddressId(editingAddressId);
    } else {
      const newId = Date.now();
      setAddresses([...addresses, { id: newId, type: tempAddressType, text: tempAddressText }]);
      setSelectedAddressId(newId);
    }
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setTempAddressText('');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const selectedAddress = addresses.find(a => a.id === selectedAddressId)?.text || '';
    const newOrderId = `ORD-${Math.floor(Math.random() * 100000)}`;
    
    placeOrder({
      id: newOrderId,
      restaurantId: cart[0]?.restaurantId || 'rest-1',
      restaurantName: restaurantName,
      items: cart,
      subtotal: subtotal.toFixed(2),
      gst: gst.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      discount: discount.toFixed(2),
      tip: tip.toFixed(2),
      total: grandTotal.toFixed(2),
      paymentMethod,
      paymentStatus: 'Paid',
      deliveryAddress: selectedAddress,
      customerName: useStore.getState().user?.name || 'Guest User',
      customerPhone: '+91 9876543210'
    }, (response) => {
      setIsProcessing(false);
      if (response && response.success && response.order) {
        clearCart();
        navigate(`/customer/order-success/${response.order.id}`);
      } else {
        const errMsg = (response && response.error) ? response.error : "Order Creation Failed. Please try again.";
        import('react-hot-toast').then(({ default: toast }) => toast.error(errMsg));
      }
    });
  };



  return (
    <>
      <style>{`
        .checkout-page { background: #F8FAFC; min-height: 100vh; padding-bottom: 6rem; font-family: 'Inter', sans-serif; }
        .checkout-container { display: flex; gap: 2rem; align-items: flex-start; max-width: 1200px; margin: 2rem auto 0; padding: 0 5%; }
        .checkout-left { flex: 1 1 65%; min-width: 0; display: flex; flex-direction: column; gap: 1.5rem; }
        .checkout-right { flex: 1 1 30%; min-width: 320px; position: sticky; top: 100px; }
        .glass-card { background: #fff; border-radius: 20px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
        
        .step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; transition: all 0.4s ease; flex-shrink: 0; z-index: 2; position: relative; }
        .step-circle.active { background: #0f172a; color: #fff; box-shadow: 0 0 0 4px #e2e8f0; }
        .step-circle.done { background: #FF6B35; color: #fff; }
        .step-circle.pending { background: #f1f5f9; color: #94a3b8; border: 2px solid #e2e8f0; }
        
        .step-line { flex: 1; height: 3px; background: #e2e8f0; margin: 0 1rem; position: relative; overflow: hidden; border-radius: 2px; }
        .step-line-fill { position: absolute; top: 0; left: 0; height: 100%; background: #FF6B35; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .mobile-sticky-btn { display: none; }
        
        @media (max-width: 960px) {
          .checkout-container { flex-direction: column; gap: 1.5rem; }
          .checkout-left { width: 100%; }
          .checkout-right { width: 100%; position: relative; top: 0; padding-bottom: 140px; }
          .mobile-sticky-btn { display: block; position: fixed; bottom: calc(68px + env(safe-area-inset-bottom, 0px)); left: 0; right: 0; padding: 1rem 5%; background: #fff; box-shadow: 0 -4px 20px rgba(0,0,0,0.08); z-index: 50; border-top: 1px solid #e2e8f0; }
          .desktop-btn { display: none !important; }
          .glass-card { padding: 1.25rem !important; }
          .step-circle { width: 30px !important; height: 30px !important; font-size: 0.8rem !important; }
        }
      `}</style>
      
      <div className="checkout-page">
        {/* Header */}
        <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: '0', zIndex: 50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 5%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <ArrowLeft size={20} color="#0f172a" />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Secure Checkout</h1>
            <div style={{ marginLeft: 'auto' }}>
              <ShieldCheck size={24} color="#10b981" />
            </div>
          </div>
        </div>

        <div className="checkout-container">
          {/* ======================= LEFT COLUMN ======================= */}
          <div className="checkout-left">
            
            {/* STEPPER ANIMATION */}
            <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {['Cart', 'Address', 'Payment'].map((s, i) => {
                const stepNum = i + 1;
                const isDone = step > stepNum;
                const isActive = step === stepNum;
                return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '60px' }}>
                    <div className={`step-circle ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                      {isDone ? <Check size={20} strokeWidth={3} /> : stepNum}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive || isDone ? '#0f172a' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s}</span>
                  </div>
                  {i < 2 && (
                    <div className="step-line">
                      <div className="step-line-fill" style={{ width: step > stepNum ? '100%' : '0%' }} />
                    </div>
                  )}
                </React.Fragment>
              )})}
            </div>

            {/* STEP 1: CART & OFFERS */}
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={20} color="#FF6B35" /> Order Items
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '1.25rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0 }}>
                          <img src={item.image || FALLBACK_IMG} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = FALLBACK_IMG} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem', lineHeight: 1.3 }}>{item.name}</h4>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2px' }}>
                              <button onClick={() => { if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1); else removeFromCart(item.id); }} style={{ border: 'none', background: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}><Minus size={14} strokeWidth={3} /></button>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, width: '24px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ border: 'none', background: 'none', padding: '6px 10px', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center' }}><Plus size={14} strokeWidth={3} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: '#fef2f2', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}><Trash2 size={12} /> Remove</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Percent size={18} color="#FF6B35" /> Offers & Benefits</h4>
                    <button onClick={() => setShowOffersModal(true)} style={{ border: 'none', background: 'none', color: '#FF6B35', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Show more offers</button>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Enter coupon code (e.g. SAVE50)" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} style={{ flex: '1 1 200px', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'var(--bg-elevated)', fontSize: '0.95rem', outline: 'none', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }} />
                    <button onClick={() => handleApplyCoupon(coupon)} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 2rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem' }}>Apply</button>
                  </div>
                  <AnimatePresence>
                    {couponSuccess && (
                      <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginTop: '1rem', fontWeight: 700, fontSize: '0.9rem', background: '#ecfdf5', padding: '1rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                        <CheckCircle size={18} /> '{coupon}' applied successfully! ₹{discount} saved.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={() => setStep(2)} style={{ width: '100%', padding: '1.25rem', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', boxShadow: '0 10px 25px -5px rgba(255, 107, 53, 0.4)' }}>
                  Proceed to Address <ArrowRight size={20} strokeWidth={3} />
                </button>
              </motion.div>
            ) : step > 1 ? (
              <button aria-label="Review cart items" className="glass-card" style={{ width: '100%', textAlign: 'left', appearance: 'none', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff' }} onClick={() => setStep(1)}>
                 <div>
                   <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="#10b981" /> Cart Items</h3>
                   <p style={{ margin: '0.25rem 0 0 1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{cart.length} items added</p>
                 </div>
                 <div style={{ border: 'none', background: 'var(--bg-secondary)', color: '#FF6B35', fontWeight: 800, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Change</div>
              </button>
            ) : null}

            {/* STEP 2: ADDRESS */}
            {step === 2 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="#FF6B35" /> Delivery Details
                </h2>

                <AnimatePresence mode="wait">
                  {isAddingAddress ? (
                    <motion.div key="edit" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Add new address</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {['HOME', 'WORK', 'OTHER'].map(type => (
                          <button key={type} onClick={() => setTempAddressType(type)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: `1px solid ${tempAddressType === type ? '#FF6B35' : 'var(--glass-border)'}`, background: tempAddressType === type ? '#fff5f2' : '#fff', color: tempAddressType === type ? '#FF6B35' : '#64748b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>{type}</button>
                        ))}
                      </div>
                      <textarea 
                        value={tempAddressText}
                        onChange={e => setTempAddressText(e.target.value)}
                        placeholder="Enter full address details..."
                        style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid #cbd5e1', background: 'var(--bg-secondary)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'inherit', color: 'var(--text-primary)', fontWeight: 500 }}
                      />
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }} style={{ flex: 1, padding: '1rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSaveAddress} style={{ flex: 1, padding: '1rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Save Address</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {addresses.map(addr => (
                          <button aria-label={`Select address ${addr.type}`} key={addr.id} onClick={() => setSelectedAddressId(addr.id)} style={{ width: '100%', textAlign: 'left', appearance: 'none', border: `2px solid ${selectedAddressId === addr.id ? '#FF6B35' : 'var(--glass-border)'}`, borderRadius: '16px', padding: '1.25rem', position: 'relative', background: selectedAddressId === addr.id ? '#fff5f2' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <span style={{ background: selectedAddressId === addr.id ? '#FF6B35' : 'var(--bg-tertiary)', color: selectedAddressId === addr.id ? '#fff' : '#0f172a', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '999px', letterSpacing: '0.05em' }}>{addr.type}</span>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button onClick={(e) => { e.stopPropagation(); setEditingAddressId(addr.id); setTempAddressType(addr.type); setTempAddressText(addr.text); setIsAddingAddress(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}><Edit2 size={16} /></button>
                                {selectedAddressId === addr.id && <CheckCircle size={20} fill="#FF6B35" color="#fff" />}
                              </div>
                            </div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{addr.text}</p>
                          </button>
                        ))}
                      </div>
                      
                      <button onClick={() => { setTempAddressText(''); setTempAddressType('WORK'); setIsAddingAddress(true); }} style={{ width: '100%', padding: '1rem', background: 'var(--bg-secondary)', color: '#FF6B35', border: '2px dashed #cbd5e1', borderRadius: '16px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
                        <Plus size={20} strokeWidth={3} /> Add New Address
                      </button>

                      <button onClick={() => setStep(3)} style={{ width: '100%', padding: '1.25rem', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', boxShadow: '0 10px 25px -5px rgba(255, 107, 53, 0.4)' }}>
                        Proceed to Payment <ArrowRight size={20} strokeWidth={3} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : step > 2 ? (
              <button aria-label="Review delivery details" className="glass-card" style={{ width: '100%', textAlign: 'left', appearance: 'none', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #e2e8f0', background: '#fff' }} onClick={() => setStep(2)}>
                 <div>
                   <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="#10b981" /> Delivery Details</h3>
                   <p style={{ margin: '0.25rem 0 0 1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{addresses.find(a => a.id === selectedAddressId)?.text || ''}</p>
                 </div>
                 <div style={{ border: 'none', background: 'var(--bg-secondary)', color: '#FF6B35', fontWeight: 800, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Change</div>
              </button>
            ) : null}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="glass-card">
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CreditCard size={20} color="#FF6B35" /> Payment Method
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                    {PAYMENT_METHODS.map(method => (
                      <motion.label 
                        key={method.id} 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '1rem', 
                          border: `2px solid ${paymentMethod === method.id ? '#FF6B35' : 'var(--glass-border)'}`, 
                          borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', 
                          background: paymentMethod === method.id ? '#fff5f2' : '#fff',
                          boxShadow: paymentMethod === method.id ? '0 4px 12px rgba(255, 107, 53, 0.1)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input type="radio" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ display: 'none' }} />
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: paymentMethod === method.id ? '#FF6B35' : '#f8fafc', color: paymentMethod === method.id ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <method.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{method.name}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>{method.desc}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#FF6B35' }}>
                            <CheckCircle size={22} fill="#FF6B35" color="#fff" />
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* ======================= RIGHT COLUMN ======================= */}
          <div className="checkout-right">
            
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={cart[0]?.image || FALLBACK_IMG} alt={restaurantName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src = FALLBACK_IMG} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>{restaurantName}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> Delivering to Home</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                
                {/* TIP SECTION */}
                <div style={{ background: '#fff5f2', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #ffedd5' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={16} fill="#FF6B35" color="#FF6B35" /> Add a tip for delivery partner
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {QUICK_TIPS.map(t => (
                      <button 
                        key={t}
                        onClick={() => setTip(tip === t ? 0 : t)}
                        style={{ flex: 1, padding: '0.6rem', background: tip === t ? '#FF6B35' : '#fff', color: tip === t ? '#fff' : '#0f172a', border: tip === t ? '1px solid #FF6B35' : '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tip === t ? '0 4px 10px rgba(255,107,53,0.2)' : 'none' }}
                      >
                        ₹{t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICING */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px dashed #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Item Total</span><span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>₹{subtotal.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>GST (5%)</span><span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>₹{gst.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Delivery Fee</span><span style={{ color: deliveryFee === 0 ? '#10b981' : '#0f172a', fontWeight: 800 }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>Platform Fee <Info size={12} /></span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>₹{platformFee.toFixed(2)}</span>
                  </div>
                  {isPremium && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}><Crown size={14} fill="#f59e0b" /> FoodFlow Plus</span>
                      <span style={{ fontWeight: 800 }}>Free Delivery Applied</span>
                    </div>
                  )}
                  {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}><span style={{ fontWeight: 700 }}>Discount</span><span style={{ fontWeight: 800 }}>-₹{discount.toFixed(2)}</span></div>}
                  {tip > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Delivery Tip</span><span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>₹{tip.toFixed(2)}</span></div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>To Pay</span>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>₹{grandTotal.toFixed(2)}</h3>
                  </div>
                </div>

                {step === 3 ? (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="desktop-btn"
                    style={{ width: '100%', padding: '1.25rem', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 25px -5px rgba(255, 107, 53, 0.4)', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  >
                    {isProcessing ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={24} /></motion.div> Processing...</>
                    ) : (
                      <>Place Order <ArrowRight size={20} strokeWidth={3} /></>
                    )}
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                    Please complete the previous steps to place order.
                  </div>
                )}
                
                {/* TRUST SECTION */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <ShieldCheck size={16} color="#10b981" /> 100% Secure Payments
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BUTTON (Only shows on Step 3) */}
      <div className="mobile-sticky-btn">
        {step === 3 ? (
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            style={{ width: '100%', padding: '1.1rem', background: '#FF6B35', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)' }}
          >
            {isProcessing ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={20} /></motion.div>
                Processing...
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 600 }}>Total To Pay</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹{grandTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Place Order <ArrowRight size={18} strokeWidth={3} />
                </div>
              </>
            )}
          </button>
        ) : (
          <div style={{ width: '100%', padding: '1.1rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
            Complete all steps to place order
          </div>
        )}
      </div>

      {/* SHOW OFFERS MODAL */}
      <AnimatePresence>
        {showOffersModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={() => setShowOffersModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ background: 'var(--bg-secondary)', padding: '1.5rem 1.5rem 2.5rem', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '600px', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: '40px', height: '5px', background: '#cbd5e1', borderRadius: '10px', margin: '0 auto 1.5rem' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Ticket size={24} color="#FF6B35" /> Available Offers</h3>
                <button onClick={() => setShowOffersModal(false)} style={{ background: 'var(--glass-border)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' }}><X size={18} strokeWidth={2.5} /></button>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                {OFFERS.map(offer => (
                  <div key={offer.code} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    {/* Ticket cutouts */}
                    <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-secondary)', borderRight: '1px solid #e2e8f0' }} />
                    <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-secondary)', borderLeft: '1px solid #e2e8f0' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff5f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Percent size={18} color="#FF6B35" />
                        </div>
                        <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: 800, padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.9rem', letterSpacing: '0.05em', border: '1px dashed #cbd5e1' }}>{offer.code}</span>
                      </div>
                      <button onClick={() => handleApplyCoupon(offer.code)} style={{ color: '#FF6B35', fontWeight: 800, fontSize: '0.9rem', background: '#fff5f2', border: '1px solid #ffedd5', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>APPLY</button>
                    </div>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.4 }}>{offer.desc}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Valid on orders above ₹199. Max discount ₹{offer.discount}.</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>




    </>
  );
}
