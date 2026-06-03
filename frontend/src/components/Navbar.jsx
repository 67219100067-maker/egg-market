import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEgg, FaShoppingCart, FaSignOutAlt, FaTruck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function Navbar({ customerName, onLogout }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <nav className="navbar glass" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="container nav-content">
        <Link to="/shop/products" className="nav-logo">
          <FaEgg /> 
          <span>EggMarket <span style={{ display: 'inline-block', fontSize: '1.2rem' }} className="floating">🐔</span></span>
        </Link>
        
        <div className="nav-links">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <span style={{ color: 'var(--text-muted)' }}>สวัสดี,</span>
            <span style={{ color: 'var(--primary-color)' }}>{customerName}</span>
          </div>

          <button className="btn btn-outline" onClick={() => navigate('/shop/tracking')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '0.5rem' }}>
            <FaTruck /> สถานะออร์เดอร์
          </button>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button className="btn btn-primary" onClick={() => navigate('/shop/cart')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%' }}>
              <FaShoppingCart style={{ marginRight: '0.5rem' }} /> ตะกร้า
            </button>
            {cartCount > 0 && <span className="badge bounce" style={{ position: 'absolute', top: '-8px', right: '-8px', zIndex: 10 }}>{cartCount}</span>}
          </div>

          <button className="btn btn-outline" onClick={onLogout} style={{ padding: '0.5rem', border: 'none', color: 'var(--text-muted)' }} title="เปลี่ยนชื่อ/ออกจากระบบ">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
