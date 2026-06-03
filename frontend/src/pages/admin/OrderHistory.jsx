import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileCsv, FaSearch } from 'react-icons/fa';

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history');
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => 
    h.customerName.includes(searchTerm) || h.id.toString().includes(searchTerm)
  );

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "Order ID,Date,Customer,Total Amount,Status\n";
    
    history.forEach(row => {
      const date = new Date(row.createdAt).toLocaleString('th-TH');
      csvContent += `${row.id},${date},${row.customerName},${row.totalAmount},${row.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "order_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>ประวัติการสั่งซื้อ (Order History)</h2>
        <button className="btn btn-outline" onClick={exportCSV} style={{ gap: '0.5rem', color: '#10b981', borderColor: '#10b981' }}>
          <FaFileCsv /> Export CSV
        </button>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <FaSearch style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="ค้นหาชื่อลูกค้า หรือ หมายเลขออร์เดอร์" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>หมายเลขออร์เดอร์</th>
                <th>วันที่สั่งซื้อ</th>
                <th>ชื่อลูกค้า/ร้านค้า</th>
                <th style={{ textAlign: 'right' }}>ยอดรวม (฿)</th>
                <th style={{ textAlign: 'center' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>#{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleString('th-TH')}</td>
                  <td>{order.customerName}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{order.totalAmount}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge" style={{ backgroundColor: order.status === 'DELIVERED' ? '#10b981' : (order.status === 'CANCELLED' ? '#ef4444' : '#3b82f6') }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>ไม่พบข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
