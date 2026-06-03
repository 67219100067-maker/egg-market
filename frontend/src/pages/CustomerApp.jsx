import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import CustomerSession from './customer/CustomerSession';
import StoreFront from './customer/StoreFront';
import Cart from './customer/Cart';
import Checkout from './customer/Checkout';
import OrderTracking from './customer/OrderTracking';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';

export default function CustomerApp() {
  const [customerName, setCustomerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if session exists
    const savedName = localStorage.getItem('customerName');
    if (savedName) {
      setCustomerName(savedName);
    }
  }, []);

  const handleStartSession = (name) => {
    localStorage.setItem('customerName', name);
    setCustomerName(name);
    navigate('/shop/products');
  };

  const handleLogout = () => {
    localStorage.removeItem('customerName');
    setCustomerName('');
    navigate('/shop');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-color">
        {customerName && <Navbar customerName={customerName} onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/" 
            element={customerName ? <Navigate to="/shop/products" /> : <CustomerSession onStart={handleStartSession} />} 
          />
          <Route 
            path="/products" 
            element={customerName ? <StoreFront customerName={customerName} /> : <Navigate to="/shop" />} 
          />
          <Route 
            path="/cart" 
            element={customerName ? <Cart /> : <Navigate to="/shop" />} 
          />
          <Route 
            path="/checkout" 
            element={customerName ? <Checkout customerName={customerName} /> : <Navigate to="/shop" />} 
          />
          <Route 
            path="/tracking" 
            element={<OrderTracking />} 
          />
        </Routes>
      </div>
    </CartProvider>
  );
}
