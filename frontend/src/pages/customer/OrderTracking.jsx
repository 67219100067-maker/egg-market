import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaBoxOpen } from 'react-icons/fa';

export default function OrderTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/track?q=${searchQuery}`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError('ไม่สามารถตรวจสอบสถานะได้ในขณะนี้');
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PENDING': return 'รอดำเนินการ (รอตรวจสอบยอด)';
      case 'PROCESSING': return 'กำลังเตรียมจัดส่ง';
      case 'SHIPPED': return 'อยู่ระหว่างการจัดส่ง';
      case 'DELIVERED': return 'จัดส่งสำเร็จ';
      case 'CANCELLED': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#f59e0b'; // orange
      case 'PROCESSING': return '#3b82f6'; // blue
      case 'SHIPPED': return '#8b5cf6'; // purple
      case 'DELIVERED': return '#10b981'; // green
      case 'CANCELLED': return '#ef4444'; // red
      default: return '#6b7280';
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>ติดตามสถานะออร์เดอร์</h2>
      
      <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="กรอกหมายเลขคำสั่งซื้อ หรือ ชื่อลูกค้า"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSearch /> ค้นหา
          </button>
        </form>

        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>กำลังค้นหาข้อมูล...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ef4444' }}>{error}</p>}

        {orders && orders.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <FaBoxOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>ไม่พบประวัติคำสั่งซื้อ</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>ออร์เดอร์ #{order.id}</h3>
                  <span style={{ 
                    backgroundColor: getStatusColor(order.status) + '20', 
                    color: getStatusColor(order.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString('th-TH')}
                </p>
                <p style={{ fontWeight: 'bold' }}>ยอดรวม: ฿{order.totalAmount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
