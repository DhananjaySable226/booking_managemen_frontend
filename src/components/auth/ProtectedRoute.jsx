import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false, forbidRoles = [] }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (forbidRoles.includes(user.role)) {
    // Redirect based on role when route is forbidden
    let redirectTo = '/';
    if (user.role === 'admin') redirectTo = '/admin';
    else if (user.role === 'service_provider') redirectTo = '/provider';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
