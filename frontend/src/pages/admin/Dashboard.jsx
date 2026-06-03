import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaMoneyBillWave, FaEgg, FaExclamationTriangle } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todaySales: 0,
    lowStockItems: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      }
    };
    fetchStats();
    // In a real app, we might poll or use socket.io here too
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>ภาพรวมระบบ (Dashboard)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '50%' }}>
            <FaShoppingCart size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ออร์เดอร์วันนี้</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stats.todayOrders}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '50%' }}>
            <FaMoneyBillWave size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ยอดขายวันนี้</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>฿{stats.todaySales.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '50%' }}>
            <FaEgg size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ออร์เดอร์รอดำเนินการ</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stats.pendingOrders}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '50%' }}>
            <FaExclamationTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>สินค้าใกล้หมด</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stats.lowStockItems} รายการ</h3>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h3>สถิติเบื้องต้น</h3>
        <p style={{ color: 'var(--text-muted)' }}>ระบบแสดงข้อมูล Real-time ตามยอดคำสั่งซื้อจากหน้าเว็บ</p>
      </div>
    </div>
  );
}
