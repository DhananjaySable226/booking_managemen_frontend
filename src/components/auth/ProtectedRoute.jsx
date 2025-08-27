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
    // If admin is forbidden on this route, send them to admin dashboard; otherwise default to /
    const redirectTo = user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
