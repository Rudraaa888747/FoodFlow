import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = useStore(state => state.user);
  const location = useLocation();

  if (!user) {
    // Not logged in, redirect to auth page
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user does not have it
  // (Assuming user.role is 'admin', 'restaurant', or 'customer')
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // You could redirect to a 403 Forbidden page or their respective dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'restaurant') return <Navigate to="/restaurant" replace />;
    return <Navigate to="/customer" replace />;
  }

  return children;
}
