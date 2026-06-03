import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBox, FaClipboardList, FaMoneyBillWave, FaHistory, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';

export default function AdminLayout({ onLogout }) {
  const location = useLocation();

  useEffect(() => {
    // Socket.io for Real-time Notification
    const socket = io(`${import.meta.env.VITE_API_URL}`);
    
    socket.on('new_order', (order) => {
      // Create a native browser notification or custom toast
      if (Notification.permission === 'granted') {
        new Notification('มีคำสั่งซื้อใหม่!', {
          body: `ออร์เดอร์ #${order.id} ยอดรวม ฿${order.totalAmount}`,
          icon: '/egg-icon.png'
        });
      }
      
      // Play sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
      } catch (e) {
        console.log('Audio play failed');
      }
    });

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return () => socket.disconnect();
  }, []);

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaChartLine />, label: 'ภาพรวมระบบ' },
    { path: '/admin/orders', icon: <FaClipboardList />, label: 'จัดการคำสั่งซื้อ' },
    { path: '/admin/products', icon: <FaBox />, label: 'สต๊อกและสินค้า' },
    { path: '/admin/finance', icon: <FaMoneyBillWave />, label: 'บัญชีและกำไร' },
    { path: '/admin/history', icon: <FaHistory />, label: 'ประวัติการสั่งซื้อ' },
    { path: '/admin/reviews', icon: <FaClipboardList />, label: 'จัดการความคิดเห็น' },
  ];

  return (
    <div className="admin-layout-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <div className="glass admin-sidebar" style={{ width: '260px', borderRadius: '0', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', display: 'flex', flexDirection: 'column' }}>
        <div className="admin-sidebar-header" style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.5rem' }}>Admin Panel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ระบบจัดการร้านไข่</p>
        </div>
        
        <nav className="admin-sidebar-nav" style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
                className={!isActive ? 'hover-bg' : ''}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer" style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            className="btn btn-outline admin-logout-btn" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}
            onClick={onLogout}
          >
            <FaSignOutAlt /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <FaBell /> 
            <span style={{ fontSize: '0.9rem' }}>ระบบพร้อมรับออร์เดอร์</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
