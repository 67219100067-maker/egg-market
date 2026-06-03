import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { FaSearch, FaCartPlus } from 'react-icons/fa';
import ReviewSection from '../../components/ReviewSection';

export default function StoreFront({ customerName }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products from API
    // Fallback to mock data if API is unreachable for testing
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => {
        if (res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(getMockProducts());
        }
      })
      .catch(err => {
        console.warn('API not running, using mock data');
        setProducts(getMockProducts());
      });
  }, []);

  const getMockProducts = () => [
    { id: 1, name: 'ไข่ไก่ เบอร์ 0 (แผง 30 ฟอง)', category: 'ไข่ไก่', price: 140, stock: 50, isBestSeller: true, isPromotion: false },
    { id: 2, name: 'ไข่ไก่ เบอร์ 1 (แผง 30 ฟอง)', category: 'ไข่ไก่', price: 130, stock: 100, isBestSeller: false, isPromotion: true },
    { id: 3, name: 'ไข่เป็ด สดใหม่ (แผง 30 ฟอง)', category: 'ไข่เป็ด', price: 160, stock: 30, isBestSeller: true, isPromotion: false },
    { id: 4, name: 'ไข่เค็ม ดองธรรมชาติ (กล่อง 6 ฟอง)', category: 'ไข่เค็ม', price: 60, stock: 20, isBestSeller: false, isPromotion: false },
  ];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'ALL' || p.category === category;
    return matchSearch && matchCat;
  });

  const categories = ['ALL', 'ไข่ไก่', 'ไข่เป็ด', 'ไข่เค็ม'];

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Search and Filter */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า..." 
            className="input-field" 
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.9rem' }}
              onClick={() => setCategory(cat)}
            >
              {cat === 'ALL' ? 'ทั้งหมด' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🛒 รายการสินค้า
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge" style={{ backgroundColor: 'var(--primary-color)' }}>{product.category}</span>
              {product.isBestSeller && <span className="badge" style={{ backgroundColor: '#ef4444' }}>ขายดี 🔥</span>}
              {product.isPromotion && <span className="badge" style={{ backgroundColor: '#10b981' }}>โปรโมชั่น ⭐️</span>}
            </div>
            
            <div style={{ height: '150px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.imageUrl ? (
                <img src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>[ ไม่มีรูปภาพ ]</span>
              )}
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', flexGrow: 1 }}>{product.name}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>฿{product.price}</span>
              <span style={{ fontSize: '0.9rem', color: product.stock > 0 ? 'var(--text-muted)' : '#ef4444' }}>
                {product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : 'สินค้าหมด'}
              </span>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', gap: '0.5rem' }}
              disabled={product.stock <= 0}
              onClick={() => addToCart(product)}
            >
              <FaCartPlus /> {product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
            </button>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>ไม่พบสินค้าที่ค้นหา</p>
        )}
      </div>

      {/* Reviews */}
      <ReviewSection customerName={customerName} />

    </div>
  );
}
