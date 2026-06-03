import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function CustomerSession({ onStart }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <FaUserCircle style={{ fontSize: '4rem', color: 'var(--primary-color)', margin: '0 auto 1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>ยินดีต้อนรับสู่ร้านขายไข่</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>กรุณากรอกชื่อร้านค้าหรือชื่อของคุณเพื่อเริ่มสั่งซื้อสินค้า</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              className="input-field" 
              placeholder="เช่น ร้านเจ๊ตา, สมศรี"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>
            เข้าสู่ร้านค้า
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => navigate('/')}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}
