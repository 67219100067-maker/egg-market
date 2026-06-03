import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import OrderManagement from './admin/OrderManagement';
import ProductManagement from './admin/ProductManagement';
import FinancialDashboard from './admin/FinancialDashboard';
import OrderHistory from './admin/OrderHistory';
import ReviewManagement from './admin/ReviewManagement';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <AdminLogin onLogin={handleLogin} /> : <Navigate to="/admin/dashboard" />} 
      />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/" element={isAuthenticated ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin/login" />}>
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="finance" element={<FinancialDashboard />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path="reviews" element={<ReviewManagement />} />
      </Route>
    </Routes>
  );
}
