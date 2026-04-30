import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import MealPlan from '../pages/MealPlan';
import ShoppingList from '../pages/ShoppingList';
import Preferences from '../pages/Preferences';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import Pantry from '../pages/Pantry';
import Market from '../pages/Market';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Settings from '../pages/Settings';
import ProtectedRoute from '../pages/ProtectedRoute';

import LandingPage from '../pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes that use the main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meal-plans" element={<MealPlan />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/market" element={<Market />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/preferences" element={<Navigate to="/settings" replace />} />
            <Route path="/profile" element={<Navigate to="/settings" replace />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Route>

        {/* Catch-all for 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
