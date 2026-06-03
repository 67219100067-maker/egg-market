import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaStore } from 'react-icons/fa';

export default function Gateway() {
  const navigate = useNavigate();

  // Create an array of random falling eggs
  const fallingEggs = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${Math.random() * 1.5 + 1.5}rem`,
  }));

  return (
    <div className="gateway-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Falling Eggs Background */}
      {fallingEggs.map(egg => (
        <div 
          key={egg.id} 
          className="falling-egg"
          style={{ 
            left: egg.left, 
            animationDuration: egg.animationDuration, 
            animationDelay: egg.animationDelay,
            fontSize: egg.fontSize 
          }}
        >
          🥚
        </div>
      ))}

      <div className="gateway-card glass animate-fade-in" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 243, 199, 0.8) 100%)' // Not completely white
      }}>
        {/* Walking Chicken on the card */}
        <div className="walking-chicken">🐥</div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>ระบบจัดการและขายไข่ออนไลน์</h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>กรุณาเลือกช่องทางการเข้าใช้งานระบบ</p>
        
        <div className="gateway-options animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div 
            className="gateway-option glass-card"
            onClick={() => navigate('/admin/login')}
          >
            <FaUserShield className="gateway-icon floating" />
            <h2 className="text-2xl font-bold">เข้าสู่ระบบผู้ดูแล</h2>
            <p style={{ color: 'var(--text-muted)' }}>จัดการหลังร้าน สต๊อกสินค้า และคำสั่งซื้อ (สำหรับแอดมิน)</p>
          </div>

          <div 
            className="gateway-option glass-card"
            onClick={() => navigate('/shop')}
          >
            <FaStore className="gateway-icon floating" style={{ animationDelay: '2s' }} />
            <h2 className="text-2xl font-bold">เข้าใช้งานสำหรับลูกค้า</h2>
            <p style={{ color: 'var(--text-muted)' }}>เลือกซื้อสินค้า ดูตะกร้า และติดตามสถานะออร์เดอร์</p>
          </div>
        </div>
      </div>
    </div>
  );
}
