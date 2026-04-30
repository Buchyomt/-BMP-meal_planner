import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem('bmp_isLoggedIn') === 'true';

  // If the user is logged in, render the child routes. Otherwise, redirect to the landing page.
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;