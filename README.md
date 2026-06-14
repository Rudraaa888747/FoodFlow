<div align="center">
  <img src="https://raw.githubusercontent.com/Rudraaa888747/FoodFlow/main/public/favicon.svg" alt="FoodFlow Logo" width="80" height="80">
  <h1 align="center">FoodFlow</h1>
  <p align="center">
    <strong>A Premium, Full-Stack Food Delivery & Restaurant Management Platform</strong>
    <br />
    Built with React, Zustand, Framer Motion, and Supabase Realtime
  </p>
</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

## 🌟 Overview

FoodFlow is a state-of-the-art web application engineered to bridge the gap between hungry customers, busy restaurants, and platform administrators. It provides a flawlessly synchronized ecosystem where every action—from placing an order to assigning a delivery driver—is updated in real-time across all portals.

### ✨ Key Capabilities

*   🍔 **Customer Portal**: A native-like, frictionless ordering experience with live GPS-style order tracking, interactive menus, table booking, and an integrated wallet system.
*   👨‍🍳 **Restaurant Dashboard**: A dedicated OS for restaurants to accept/prepare orders, manage menus, and monitor daily revenue—instantly synced without manual refreshing.
*   👑 **Admin Command Center**: A bird's-eye view for platform owners to oversee all active orders, manage restaurant onboarding, and analyze platform-wide metrics.
*   ⚡ **Zero-Latency Realtime**: Powered by Supabase PostgreSQL WebSockets, ensuring cross-tab and cross-device synchronization in milliseconds.

---

## 📸 Platform Previews

### Customer Experience
*Immersive UI with Framer Motion transitions, cart management, and instant order success pop-ups.*

### Order Tracking
*Live timeline tracking showing status updates from Pending to Out for Delivery, complete with dynamic driver assignments.*

### Restaurant Operating System (Resto Hub)
*A sleek, dark-mode dashboard for restaurant partners to manage incoming order pipelines with optimistic UI updates.*

---

## 🛠️ Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Blazing fast component rendering and HMR. |
| **Styling Engine** | TailwindCSS | Utility-first, highly customizable design system. |
| **State Management** | Zustand | Lightweight, persistent client-side state without Redux boilerplate. |
| **Animations** | Framer Motion | Fluid spring-physics animations and layout transitions. |
| **Backend & Auth** | Supabase | Secure authentication and Row Level Security (RLS). |
| **Database** | PostgreSQL | Relational data structuring for users, orders, and notifications. |
| **Realtime Sync** | Supabase Channels | WebSockets for instant data propagation across clients. |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Rudraaa888747/FoodFlow.git
cd FoodFlow
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials (see `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Initialization
Run the provided `supabase_setup.sql` script in your Supabase SQL Editor. This will generate the necessary tables (`users`, `orders`, `bookings`, `notifications`) and enable the required `REPLICA IDENTITY FULL` settings for Realtime.

### 4. Ignite the Server
```bash
npm run dev
```

---

## 🌐 Deployment (Vercel)

FoodFlow is fully optimized for Edge networks. 
1. Push your code to GitHub.
2. Import the repository in **Vercel**.
3. Add the three environment variables from your `.env` file into the Vercel project settings.
4. Click **Deploy**.

---

<div align="center">
  <p>Built with ❤️ by Rudra</p>
</div>
