import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/common/Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060816]">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060816]">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard based on role
    switch (user.role) {
      case 'Admin':
        return <Navigate to="/dashboard/admin" replace />;
      case 'Asset Manager':
        return <Navigate to="/dashboard/manager" replace />;
      case 'Department Head':
        return <Navigate to="/dashboard/head" replace />;
      default:
        return <Navigate to="/dashboard/employee" replace />;
    }
  }

  return children;
}
