# FoodFlow - Food Delivery & Restaurant Management App

FoodFlow is a modern, full-stack web application designed for food delivery and restaurant management. It features a seamless customer experience, a robust restaurant dashboard, and an administrative panel, all powered by real-time updates.

## 🚀 Features

- **Customer App**: Browse restaurants, add items to cart, place orders, and track them in real-time. Book tables dynamically.
- **Restaurant Dashboard**: Manage menus, view incoming orders, update order status, and handle table bookings.
- **Admin Panel**: Monitor platform performance, manage restaurants, and oversee all orders globally.
- **Real-Time Sync**: Instant order notifications and status updates powered by Supabase Realtime.
- **Modern UI**: Designed with React, TailwindCSS, and Framer Motion for smooth, native-like animations.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), TailwindCSS, Zustand (State Management), Framer Motion
- **Backend (BaaS)**: Supabase (PostgreSQL, Authentication, Realtime Channels)
- **Deployment Ready**: Fully optimized for Vercel deployment.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A [Supabase](https://supabase.com/) account.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rudraaa888747/FoodFlow.git
   cd FoodFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Update the values with your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Database Setup:**
   - Go to your Supabase project's SQL Editor.
   - Run the provided `supabase_setup.sql` file to create the necessary tables (`users`, `orders`, `bookings`, `notifications`) and enable Realtime.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

FoodFlow is optimized for serverless deployments on platforms like Vercel. 
Simply connect your GitHub repository to Vercel and ensure your environment variables are configured in the Vercel dashboard.

## 📄 License
This project is for educational and portfolio purposes.
