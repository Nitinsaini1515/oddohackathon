import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/common/Loader';

export default function DashboardRouter() {
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
