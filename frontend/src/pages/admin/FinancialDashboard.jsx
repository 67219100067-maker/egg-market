import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartBar, FaMoneyBillWave, FaArrowDown, FaArrowUp, FaEgg } from 'react-icons/fa';

export default function FinancialDashboard() {
  const [report, setReport] = useState({
    totalSales: 0,
    totalCost: 0,
    wasteCost: 0
  });
  
  const [products, setProducts] = useState([]);
  const [wasteForm, setWasteForm] = useState({ productId: '', quantity: '', reason: 'ไข่แตกระหว่างขนส่ง' });
  const [wasteRecords, setWasteRecords] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchWasteRecords();
    fetchProducts();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/summary`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWasteRecords = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/finance/waste`);
      setWasteRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
      if (res.data.length > 0) {
        setWasteForm(prev => ({ ...prev, productId: res.data[0].id.toString() }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const netProfit = report.totalSales - report.totalCost - report.wasteCost;

  const handleWasteSubmit = async (e) => {
    e.preventDefault();
    if (wasteForm.quantity && wasteForm.productId) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/finance/waste`, wasteForm);
        alert('บันทึกข้อมูลไข่แตก/เสียหายสำเร็จ และหักสต๊อกแล้ว');
        setWasteForm({ ...wasteForm, quantity: '' });
        fetchSummary();
        fetchWasteRecords();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>บัญชีและกำไร (Financial Dashboard)</h2>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '50%' }}>
            <FaArrowUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ยอดขายรวม</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#10b981' }}>฿{report.totalSales.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '50%' }}>
            <FaChartBar size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ต้นทุนขายรวม</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>฿{report.totalCost.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '50%' }}>
            <FaArrowDown size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ค่าความเสียหาย (ไข่แตก)</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#ef4444' }}>฿{report.wasteCost.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--primary-color)' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '50%' }}>
            <FaMoneyBillWave size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>กำไรสุทธิ</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-color)' }}>฿{netProfit.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Record Waste */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaEgg style={{ color: '#ef4444' }}/> บันทึกไข่แตก/เสียหาย
          </h3>
          <form onSubmit={handleWasteSubmit}>
            <div className="input-group">
              <label>เลือกสินค้า</label>
              <select className="input-field" value={wasteForm.productId} onChange={(e) => setWasteForm({...wasteForm, productId: e.target.value})} required>
                <option value="">-- เลือกสินค้า --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>จำนวนที่เสียหาย (ชิ้น)</label>
              <input type="number" className="input-field" min="1" required value={wasteForm.quantity} onChange={(e) => setWasteForm({...wasteForm, quantity: e.target.value})} />
            </div>
            <div className="input-group">
              <label>สาเหตุ</label>
              <input type="text" className="input-field" required value={wasteForm.reason} onChange={(e) => setWasteForm({...wasteForm, reason: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', color: '#ef4444', borderColor: '#ef4444' }}>
              บันทึกหักสต๊อกและต้นทุน
            </button>
          </form>
        </div>

        {/* Waste History */}
        <div className="glass" style={{ padding: '2rem', overflowY: 'auto', maxHeight: '500px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>ประวัติความเสียหาย</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0' }}>วันที่</th>
                <th>สินค้า</th>
                <th>จำนวน</th>
                <th>สาเหตุ</th>
                <th style={{ textAlign: 'right' }}>ต้นทุนที่เสียไป</th>
              </tr>
            </thead>
            <tbody>
              {wasteRecords.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '0.75rem 0' }}>{new Date(record.date).toLocaleDateString('th-TH')}</td>
                  <td>{record.product?.name}</td>
                  <td style={{ color: '#ef4444', fontWeight: 'bold' }}>{record.quantity}</td>
                  <td>{record.reason}</td>
                  <td style={{ textAlign: 'right', color: '#ef4444' }}>฿{record.costLoss}</td>
                </tr>
              ))}
              {wasteRecords.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>ยังไม่มีบันทึกไข่แตก</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
