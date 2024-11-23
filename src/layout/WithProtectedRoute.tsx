import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
  // return <Outlet />;
};

export default ProtectedRoute;
