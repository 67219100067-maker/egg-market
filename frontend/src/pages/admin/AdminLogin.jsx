import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Mock Admin Login
    // In reality: axios.post('/api/admin/login', { username, password })
    if (username === 'admin' && password === 'admin123') {
      const mockToken = 'mock-jwt-token-xyz';
      onLogin(mockToken);
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="gateway-wrapper">
      <div className="gateway-card glass animate-fade-in" style={{ maxWidth: '400px', padding: '2.5rem' }}>
        <FaUserShield className="gateway-icon" style={{ fontSize: '3.5rem', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>เข้าสู่ระบบผู้ดูแล</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>จัดการหลังร้าน ระบบขายไข่ออนไลน์</p>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>ชื่อผู้ใช้งาน (Username)</label>
            <input 
              type="text" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            เข้าสู่ระบบ
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => navigate('/')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', width: '100%' }}
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
}
