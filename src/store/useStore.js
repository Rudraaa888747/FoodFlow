import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockRestaurants } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isPremium: false,
      login: (userData, token) => {
        set({ user: userData, token: token || null, walletBalance: userData.walletBalance || 0, isPremium: userData.isPremium || false });
        get().setupRealtime();
      },
      logout: () => {
        set({ user: null, token: null, orders: [], bookings: [], notifications: [] });
        supabase.removeAllChannels();
      },
      registerUser: async (userData) => {
        const email = userData.email.trim().toLowerCase();
        const { data: existing } = await supabase.from('users').select('email').eq('email', email).single();
        if (existing) {
           return { success: false, error: 'User already exists' };
        }
        
        const bcrypt = await import('bcryptjs');
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        const newUser = { ...userData, email, password: hashedPassword, walletBalance: 0, isPremium: false };
        
        const { error } = await supabase.from('users').insert([newUser]);
        if (error) {
           return { success: false, error: error.message };
        }
        
        const { password: _, ...userWithoutPassword } = newUser;
        return { success: true, user: userWithoutPassword, token: 'dummy-token-' + Date.now() };
      },
      verifyUser: async (email, password) => {
        const normEmail = email.trim().toLowerCase();
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normEmail)
          .single();
          
        if (error || !data) {
          return { success: false, error: 'Invalid credentials' };
        }
        
        const bcrypt = await import('bcryptjs');
        if (bcrypt.compareSync(password, data.password)) {
           const { password: _, ...userWithoutPassword } = data;
           return { success: true, user: userWithoutPassword, token: 'dummy-token-' + Date.now() };
        } else {
           return { success: false, error: 'Invalid credentials' };
        }
      },
      togglePremium: () => set((state) => ({ isPremium: !state.isPremium })),

      // Cart State
      cart: [],
      addToCart: (item, quantity = 1) => set((state) => {
        const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            ),
          };
        }
        return { cart: [...state.cart, { ...item, quantity }] };
      }),
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== itemId),
      })),
      updateQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0),
      })),
      clearCart: () => set({ cart: [] }),
      
      // Derived Cart Total
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      // Wallet State
      walletBalance: 0,
      refreshWallet: async () => {
        const user = get().user;
        if (user) {
          const { data } = await supabase.from('users').select('walletBalance, isPremium').eq('email', user.email).single();
          if (data) {
             set({ walletBalance: data.walletBalance, isPremium: data.isPremium });
          }
        }
      },

      // Orders & Bookings State (Managed by Backend)
      orders: [],
      bookings: [],
      notifications: [],
      socketConnected: false, // Tracking Supabase Realtime connection
      setSocketConnected: (connected) => set({ socketConnected: connected }),
      setOrders: (orders) => set({ orders }),
      setBookings: (bookings) => set({ bookings }),
      setNotifications: (notifications) => set({ notifications }),
      
      placeOrder: async (orderData, callback) => {
        const state = get();
        if (!state.user) {
           if (callback) callback({ success: false, error: 'Unauthorized - Please login first' });
           return;
        }

        const restaurant = mockRestaurants.find(r => r.id === orderData.restaurantId);
        if (!restaurant) {
           if (callback) callback({ success: false, error: 'Restaurant not found' });
           return;
        }

        let subtotal = 0;
        for (const item of (orderData.items || [])) {
           const officialItem = restaurant.menu.find(m => m.id === item.originalId || m.name === item.name);
           if (officialItem) {
              subtotal += (Math.max(0, officialItem.price) * Math.max(1, item.quantity));
              if (item.selectedAddons && Array.isArray(item.selectedAddons)) {
                 for (const addon of item.selectedAddons) {
                    const officialAddon = (officialItem.addons || []).find(a => a.name === addon.name);
                    if (officialAddon) {
                       subtotal += (Math.max(0, officialAddon.price) * Math.max(1, item.quantity));
                    }
                 }
              }
           }
        }

        const gst = subtotal * 0.05;
        const deliveryFee = (state.isPremium || subtotal > 500) ? 0 : 35;
        const platformFee = 4.99;
        const discount = Math.max(0, parseFloat(orderData.discount || 0));
        const tip = Math.max(0, parseFloat(orderData.tip || 0));
        const serverTotal = parseFloat((subtotal + gst + deliveryFee + platformFee - discount + tip).toFixed(2));

        if (serverTotal <= 0 || subtotal <= 0) {
           if (callback) callback({ success: false, error: 'Invalid order total' });
           return;
        }

        // Only check balance if we explicitly wanted a 'wallet' payment method
        // For testing, we'll allow the order to proceed even if balance is low (simulating external payment success)
        let newBalance = state.walletBalance;
        if (state.walletBalance >= serverTotal) {
           newBalance = state.walletBalance - serverTotal;
           await supabase.from('users').update({ walletBalance: newBalance }).eq('email', state.user.email);
        }
        set({ walletBalance: newBalance });

        const timestamp = new Date().toISOString();
        const newOrder = {
          ...orderData,
          total: serverTotal,
          customerEmail: state.user.email,
          id: orderData.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'Pending',
          driver: null,
          timeline: [{ status: 'Pending', timestamp, description: 'Order placed by customer' }],
          createdAt: timestamp,
        };

        const { error } = await supabase.from('orders').insert([newOrder]);
        if (error) {
            if (callback) callback({ success: false, error: error.message });
            return;
        }
        
        // Optimistic update so UI shows order immediately without waiting for Realtime
        if (!state.orders.find(o => o.id === newOrder.id)) {
            set({ orders: [newOrder, ...state.orders] });
        }

        const custNotif = { id: Date.now().toString() + '-c', orderId: newOrder.id, message: `Order Placed Successfully!`, timestamp, read: false, target: 'customer', customerId: newOrder.customerEmail };
        const restNotif = { id: Date.now().toString() + '-r', orderId: newOrder.id, message: `New Order: ${newOrder.id}`, timestamp, read: false, target: 'restaurant', restaurantId: newOrder.restaurantId };
        const adminNotif = { id: Date.now().toString() + '-a', orderId: newOrder.id, message: `Platform Order: ${newOrder.id}`, timestamp, read: false, target: 'admin' };
        
        await supabase.from('notifications').insert([custNotif, restNotif, adminNotif]);
        
        if (typeof callback === 'function') callback({ success: true, order: newOrder, newBalance });
      },
      
      updateOrderStatus: async (orderId, status, actor, callback) => {
         const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
         if (!order) return callback && callback({ success: false, error: 'Not found' });
         
         const timestamp = new Date().toISOString();
         const newTimeline = [...order.timeline, { status, timestamp, description: `Status updated to ${status}` }];
         
         let driver = order.driver;
         if ((status === 'Ready' || status === 'Out For Delivery') && !driver) {
           const DRIVERS = [
             { id: 'd1', name: 'Rahul Sharma', rating: 4.9, deliveries: 1240, phone: '+91 9876543210' },
             { id: 'd2', name: 'Amit Kumar', rating: 4.7, deliveries: 850, phone: '+91 9876543211' }
           ];
           driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
           newTimeline.push({ status: 'Driver Assigned', timestamp, description: `Driver ${driver.name} assigned` });
         }
         
         const updatedOrderData = { status, timeline: newTimeline, driver };
         const { error } = await supabase.from('orders').update(updatedOrderData).eq('id', orderId);
         if (error) return callback && callback({ success: false, error: error.message });
         
         // Optimistic UI update so the restaurant dashboard updates instantly
         const state = get();
         set({
           orders: state.orders.map(o => o.id === orderId ? { ...o, ...updatedOrderData } : o)
         });
         
         let notifMsg = '';
         if (status === 'Confirmed') notifMsg = `Restaurant accepted your order ${order.id}`;
         else if (status === 'Ready') notifMsg = `Order ${order.id} ready for pickup`;
         else if (status === 'Out For Delivery') notifMsg = `Order ${order.id} on the way!`;
         else if (status === 'Delivered') notifMsg = `Order ${order.id} delivered.`;
         
         if (notifMsg) {
             const notif = { id: Date.now().toString(), orderId, message: notifMsg, timestamp, read: false, target: 'customer', customerId: order.customerEmail };
             await supabase.from('notifications').insert([notif]);
         }
         
         if (typeof callback === 'function') callback({ success: true, order: { ...order, status, timeline: newTimeline, driver } });
      },
      
      placeBooking: async (bookingData, callback) => {
         const state = get();
         const timestamp = new Date().toISOString();
         const newBooking = {
           ...bookingData,
           customerEmail: state.user.email,
           id: bookingData.id || `BKG-${Math.floor(10000 + Math.random() * 90000)}`,
           status: 'Pending',
           createdAt: timestamp,
         };
         
         const { error } = await supabase.from('bookings').insert([newBooking]);
         if (error) {
             if (callback) callback({ success: false, error: error.message });
             return;
         }
         
         if (typeof callback === 'function') callback({ success: true, booking: newBooking });
      },
      
      updateBookingStatus: async (bookingId, status, actor, callback) => {
         const { data: booking } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
         if (!booking) return callback && callback({ success: false, error: 'Not found' });
         
         const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
         if (error) return callback && callback({ success: false, error: error.message });
         
         let notifMsg = '';
         if (status === 'Approved') notifMsg = `Table booking at ${booking.restaurantName || 'the restaurant'} confirmed!`;
         else if (status === 'Rejected') notifMsg = `Table booking declined.`;
         
         if (notifMsg) {
             const notif = { id: Date.now().toString(), message: notifMsg, timestamp: new Date().toISOString(), read: false, target: 'customer', customerId: booking.customerEmail };
             await supabase.from('notifications').insert([notif]);
         }
         
         if (typeof callback === 'function') callback({ success: true, booking: { ...booking, status } });
      },
      
      // Favorites
      favorites: [],
      toggleFavorite: (restaurantId) => set((state) => {
        if (state.favorites.includes(restaurantId)) {
          return { favorites: state.favorites.filter(id => id !== restaurantId) };
        }
        return { favorites: [...state.favorites, restaurantId] };
      }),

      // Restaurants State
      restaurants: mockRestaurants,
      setRestaurants: (restaurants) => set({ restaurants }),
      
      // Taste Intelligence
      recentViews: ['rest-1', 'rest-7'],
      tasteProfile: {
        favoriteCuisine: 'Burgers',
        favoriteRestaurant: 'Burger Bros'
      },
      addRestaurant: (restaurant) => set((state) => ({ restaurants: [...state.restaurants, restaurant] })),
      deleteRestaurant: (restaurantId) => set((state) => ({ 
        restaurants: state.restaurants.filter(r => r.id !== restaurantId) 
      })),

      // Menu Management Actions
      addMenuItem: (restaurantId, item) => set((state) => ({
        restaurants: state.restaurants.map(r => 
          r.id === restaurantId ? { ...r, menu: [...r.menu, item] } : r
        )
      })),
      updateMenuItem: (restaurantId, itemId, updatedItem) => set((state) => ({
        restaurants: state.restaurants.map(r => 
          r.id === restaurantId ? { 
            ...r, 
            menu: r.menu.map(m => m.id === itemId ? { ...m, ...updatedItem } : m) 
          } : r
        )
      })),
      deleteMenuItem: (restaurantId, itemId) => set((state) => ({
        restaurants: state.restaurants.map(r => 
          r.id === restaurantId ? { ...r, menu: r.menu.filter(m => m.id !== itemId) } : r
        )
      })),

      // --- SUPABASE REALTIME INITIALIZATION ---
      setupRealtime: async () => {
         const user = get().user;
         if (!user) return;
         
         set({ socketConnected: true });

         // 1. Initial Sync
         let ordersQuery = supabase.from('orders').select('*').order('createdAt', { ascending: false });
         let bookingsQuery = supabase.from('bookings').select('*').order('createdAt', { ascending: false });
         let notificationsQuery = supabase.from('notifications').select('*').order('timestamp', { ascending: false });

         if (user.role === 'customer') {
            ordersQuery = ordersQuery.eq('customerEmail', user.email);
            bookingsQuery = bookingsQuery.eq('customerEmail', user.email);
            notificationsQuery = notificationsQuery.eq('customerId', user.email);
         } else if (user.role === 'restaurant') {
            // For testing/demo purposes, let the restaurant role see all orders and bookings
            // Normally this would be: ordersQuery.eq('restaurantId', user.email);
         } else if (user.role === 'admin') {
            // Admin sees all, notifications targeted to admin or global
         }

         const [ordersRes, bookingsRes, notifsRes] = await Promise.all([
             ordersQuery, bookingsQuery, notificationsQuery
         ]);
         
         if (ordersRes.data) set({ orders: ordersRes.data });
         if (bookingsRes.data) set({ bookings: bookingsRes.data });
         if (notifsRes.data) {
             let finalNotifs = notifsRes.data;
             if (user.role === 'admin') finalNotifs = finalNotifs.filter(n => n.target === 'admin' || !n.target);
             set({ notifications: finalNotifs });
         }

         // Handle tab visibility change to catch missed events (e.g. Chrome throttled the background tab)
         if (typeof window !== 'undefined' && !window.__foodflow_visibility_hook_added) {
           window.__foodflow_visibility_hook_added = true;
           window.addEventListener('visibilitychange', () => {
             if (document.visibilityState === 'visible') {
               // Refetch when tab becomes visible to avoid stale data from missed socket events
               useStore.getState().setupRealtime();
             }
           });
         }

         // 2. Subscriptions
         supabase.removeAllChannels();
         
         const channel = supabase.channel('schema-db-changes')
           .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
             const state = get();
             const newOrder = payload.new;
             if (payload.eventType === 'INSERT') {
                set({ orders: [newOrder, ...state.orders] });
             } else if (payload.eventType === 'UPDATE') {
                set({ orders: state.orders.map(o => o.id === newOrder.id ? newOrder : o) });
             }
           })
           .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
             const state = get();
             const newBooking = payload.new;
             if (payload.eventType === 'INSERT') {
                set({ bookings: [newBooking, ...state.bookings] });
             } else if (payload.eventType === 'UPDATE') {
                set({ bookings: state.bookings.map(b => b.id === newBooking.id ? newBooking : b) });
             }
           })
           .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
             const state = get();
             const notif = payload.new;
             
             let shouldProcess = false;
             if (user.role === 'admin' && (notif.target === 'admin' || !notif.target)) shouldProcess = true;
             else if (user.role === 'restaurant' && notif.restaurantId === user.email) shouldProcess = true;
             else if (user.role === 'customer' && notif.customerId === user.email) shouldProcess = true;
             
             if (shouldProcess && !state.notifications.find(n => n.id === notif.id)) {
                 set({ notifications: [notif, ...state.notifications] });
                 
                 const path = typeof window !== 'undefined' ? window.location.pathname : '';
                 let shouldShowToast = true;
                 if (notif.target === 'customer' && !path.startsWith('/customer')) shouldShowToast = false;
                 if (notif.target === 'restaurant' && !path.startsWith('/restaurant')) shouldShowToast = false;
                 if (notif.target === 'admin' && !path.startsWith('/admin')) shouldShowToast = false;
                 
                 if (shouldShowToast) {
                   import('react-hot-toast').then(({ default: toast }) => {
                     toast.success(notif.message, { duration: 6000 });
                   });
                 }
             }
           })
           .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                 set({ socketConnected: true });
              } else {
                 set({ socketConnected: false });
              }
           });
      }
    }),
    {
      name: 'foodflow-storage',
      version: 12,
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['orders', 'bookings', 'notifications', 'socketConnected'].includes(key))
      ),
      migrate: (persistedState, version) => {
        if (version < 12) {
          if (persistedState.restaurants === undefined || persistedState.restaurants === null) {
            delete persistedState.restaurants;
          }
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state && state.token) {
          setTimeout(() => {
             useStore.getState().setupRealtime();
          }, 0);
        }
      }
    }
  )
);
