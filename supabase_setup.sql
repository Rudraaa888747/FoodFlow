-- Supabase Schema Setup for FoodFlow

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  email TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  "walletBalance" NUMERIC DEFAULT 0,
  "isPremium" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for users (optional, depending on requirements, here we will disable it for simplicity just like db.json, or configure it open for authenticated)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "restaurantName" TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC,
  gst NUMERIC,
  "deliveryFee" NUMERIC,
  "platformFee" NUMERIC,
  discount NUMERIC,
  tip NUMERIC,
  total NUMERIC,
  "paymentMethod" TEXT,
  "paymentStatus" TEXT,
  "deliveryAddress" TEXT,
  "customerName" TEXT,
  "customerPhone" TEXT,
  "customerEmail" TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  driver JSONB,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TEXT NOT NULL
);

ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  "restaurantId" TEXT NOT NULL,
  "restaurantName" TEXT,
  date TEXT,
  time TEXT,
  guests INTEGER,
  "customerName" TEXT,
  "customerPhone" TEXT,
  "customerEmail" TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  "createdAt" TEXT NOT NULL
);

ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  "orderId" TEXT,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  target TEXT,
  "customerId" TEXT,
  "restaurantId" TEXT
);

ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 5. Enable Realtime for all tables
-- This is critical for the Socket.IO replacement to work
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

