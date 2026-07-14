import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPrint, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { io } from 'socket.io-client';

const STATUS_MAP = {
  PENDING: { label: 'รอดำเนินการ', color: '#f59e0b' },
  PROCESSING: { label: 'กำลังจัดเตรียม', color: '#3b82f6' },
  SHIPPED: { label: 'กำลังจัดส่ง', color: '#8b5cf6' },
  DELIVERED: { label: 'จัดส่งสำเร็จแล้ว', color: '#10b981' },
  CANCELLED: { label: 'ยกเลิก', color: '#ef4444' }
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('new_order', () => fetchOrders());
    socket.on('order_status_updated', () => fetchOrders());
    
    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      setOrders(res.data);
      // Update selected order if it exists
      if (selectedOrder) {
        const updated = res.data.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="responsive-flex" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      {/* Order List */}
      <div className="glass" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>รายการคำสั่งซื้อใหม่</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div 
              key={order.id} 
              className="glass-card hover-bg" 
              style={{ padding: '1rem', cursor: 'pointer', borderLeft: selectedOrder?.id === order.id ? '4px solid var(--primary-color)' : '4px solid transparent' }}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>#{order.id} - {order.customerName}</strong>
                <span className="badge" style={{ backgroundColor: STATUS_MAP[order.status]?.color || '#6b7280' }}>
                  {STATUS_MAP[order.status]?.label || order.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>{new Date(order.createdAt).toLocaleTimeString('th-TH')}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>฿{order.totalAmount}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>ไม่มีคำสั่งซื้อ</p>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="glass" style={{ flex: 2, padding: '2rem', overflowY: 'auto' }}>
        {selectedOrder ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>รายละเอียดออร์เดอร์ #{selectedOrder.id}</h2>
              <button className="btn btn-outline" onClick={printReceipt} style={{ gap: '0.5rem' }}>
                <FaPrint /> พิมพ์ใบเสร็จ
              </button>
            </div>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ข้อมูลลูกค้า</h4>
                <p><strong>ชื่อ:</strong> {selectedOrder.customerName}</p>
                <p><strong>โทรศัพท์:</strong> {selectedOrder.phone}</p>
                <p><strong>ที่อยู่:</strong> {selectedOrder.address}</p>
                {selectedOrder.specialRequest && <p><strong>หมายเหตุ:</strong> {selectedOrder.specialRequest}</p>}
              </div>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>การชำระเงิน</h4>
                <p><strong>วิธีชำระ:</strong> {selectedOrder.paymentMethod === 'COD' ? 'เก็บเงินปลายทาง' : 'โอนเงินผ่านธนาคาร'}</p>
                <p><strong>สถานะ:</strong> <span style={{ color: STATUS_MAP[selectedOrder.status]?.color, fontWeight: 'bold' }}>{STATUS_MAP[selectedOrder.status]?.label || selectedOrder.status}</span></p>
                
                {selectedOrder.slipImageUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>สลิปโอนเงิน:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={`${import.meta.env.VITE_API_URL}${selectedOrder.slipImageUrl}`} target="_blank" rel="noreferrer">
                        <img src={`${import.meta.env.VITE_API_URL}${selectedOrder.slipImageUrl}`} alt="slip" style={{ maxWidth: '150px', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>รายการสินค้า</h4>
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0' }}>สินค้า</th>
                      <th>จำนวน</th>
                      <th>ราคา/ชิ้น</th>
                      <th style={{ textAlign: 'right' }}>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '0.75rem 0' }}>{item.product?.name || `สินค้า #${item.productId}`}</td>
                        <td>{item.quantity}</td>
                        <td>฿{item.price}</td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>฿{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                ยอดสุทธิ: ฿{selectedOrder.totalAmount}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedOrder.status === 'PENDING' && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, backgroundColor: '#3b82f6' }}
                  onClick={() => updateStatus(selectedOrder.id, 'PROCESSING')}
                >
                  <FaCheck /> ยืนยันออร์เดอร์
                </button>
              )}
              {selectedOrder.status === 'PROCESSING' && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, backgroundColor: '#8b5cf6' }}
                  onClick={() => updateStatus(selectedOrder.id, 'SHIPPED')}
                >
                  🚚 จัดส่งแล้ว
                </button>
              )}
              {selectedOrder.status === 'SHIPPED' && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, backgroundColor: '#10b981' }}
                  onClick={() => updateStatus(selectedOrder.id, 'DELIVERED')}
                >
                  ✅ จัดส่งสำเร็จแล้ว
                </button>
              )}
              {!['CANCELLED', 'DELIVERED'].includes(selectedOrder.status) && (
                <button 
                  className="btn btn-outline" 
                  style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  onClick={() => updateStatus(selectedOrder.id, 'CANCELLED')}
                >
                  <FaTimes /> ยกเลิก
                </button>
              )}
              {['CANCELLED', 'DELIVERED'].includes(selectedOrder.status) && (
                <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: STATUS_MAP[selectedOrder.status]?.color + '20', color: STATUS_MAP[selectedOrder.status]?.color, fontWeight: 'bold' }}>
                  {selectedOrder.status === 'DELIVERED' ? '✅ ออร์เดอร์นี้จัดส่งสำเร็จแล้ว' : '❌ ออร์เดอร์นี้ถูกยกเลิก'}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>คลิกที่รายการเพื่อดูรายละเอียด</p>
          </div>
        )}
      </div>

      {/* Printable Receipt */}
      {selectedOrder && (
        <div id="printable-receipt">
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>ร้านไข่ EggMarket</h3>
            <p style={{ margin: 0, fontSize: '10px' }}>ใบเสร็จรับเงิน / ใบส่งของ</p>
          </div>
          <div style={{ marginBottom: '10px', fontSize: '10px' }}>
            <p style={{ margin: 0 }}>ออร์เดอร์: #{selectedOrder.id}</p>
            <p style={{ margin: 0 }}>ลูกค้า: {selectedOrder.customerName}</p>
            <p style={{ margin: 0 }}>วันที่: {new Date(selectedOrder.createdAt).toLocaleDateString('th-TH')}</p>
          </div>
          <table style={{ width: '100%', fontSize: '10px', borderBottom: '1px dashed #000', paddingBottom: '5px', marginBottom: '5px' }}>
            <tbody>
              {selectedOrder.items.map((item, i) => (
                <React.Fragment key={i}>
                  <tr><td colSpan="3">{item.product?.name || `สินค้า #${item.productId}`}</td></tr>
                  <tr>
                    <td style={{ paddingLeft: '10px' }}>{item.quantity} x {item.price}</td>
                    <td style={{ textAlign: 'right' }}>{item.quantity * item.price}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>ยอดรวม:</span>
            <span>{selectedOrder.totalAmount} บาท</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px' }}>
            <p>ขอบคุณที่อุดหนุน</p>
          </div>
        </div>
      )}
    </div>
  );
}
