import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>ตะกร้าสินค้าของคุณ</h2>

      {cart.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ไม่มีสินค้าในตะกร้า</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop/products')}>
            เลือกซื้อสินค้าต่อ
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div className="glass" style={{ padding: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>฿{item.price} / ชิ้น</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--secondary-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                    <button 
                      className="btn" 
                      style={{ padding: '0.25rem 0.5rem', background: 'transparent' }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span style={{ padding: '0 1rem', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button 
                      className="btn" 
                      style={{ padding: '0.25rem 0.5rem', background: 'transparent' }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  
                  <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ฿{item.price * item.quantity}
                  </div>

                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'transparent' }}
                    onClick={() => removeFromCart(item.id)}
                    title="ลบสินค้า"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>ยอดรวมทั้งสิ้น:</span>
              <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}>฿{cartTotal}</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => navigate('/shop/checkout')}
            >
              ดำเนินการชำระเงิน <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
