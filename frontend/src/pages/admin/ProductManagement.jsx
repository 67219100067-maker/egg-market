import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'ไข่ไก่',
    price: '',
    costPrice: '',
    stock: '',
    isBestSeller: false,
    isPromotion: false
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openAddModal = () => {
    setFormData({ name: '', category: 'ไข่ไก่', price: '', costPrice: '', stock: '', isBestSeller: false, isPromotion: false });
    setImageFile(null);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({ ...product });
    setImageFile(null);
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('costPrice', formData.costPrice);
      payload.append('stock', formData.stock);
      payload.append('isBestSeller', formData.isBestSeller);
      payload.append('isPromotion', formData.isPromotion);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>จัดการสต๊อกและสินค้า</h2>
        <button className="btn btn-primary" onClick={openAddModal} style={{ gap: '0.5rem' }}>
          <FaPlus /> เพิ่มสินค้าใหม่
        </button>
      </div>

      <div className="glass table-responsive" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>รูปภาพ</th>
              <th style={{ padding: '1rem' }}>ชื่อสินค้า</th>
              <th style={{ padding: '1rem' }}>หมวดหมู่</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>ราคาทุน (฿)</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>ราคาขาย (฿)</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>สต๊อกคงเหลือ</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '1rem', width: '80px' }}>
                  {product.imageUrl ? (
                    <img src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`} alt="product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>ไม่มีรูป</div>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}><span className="badge" style={{ backgroundColor: 'var(--primary-color)' }}>{product.category}</span></td>
                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>{product.costPrice}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{product.price}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: product.stock <= 10 ? '#ef4444' : 'inherit' }}>
                    {product.stock <= 10 && <FaExclamationTriangle />}
                    <span style={{ fontWeight: product.stock <= 10 ? 'bold' : 'normal' }}>{product.stock}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => openEditModal(product)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444', borderColor: 'transparent' }} onClick={() => handleDelete(product.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>ไม่มีข้อมูลสินค้า</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', backgroundColor: 'var(--bg-color)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>รูปภาพสินค้า</label>
                <input type="file" accept="image/*" className="input-field" onChange={handleFileChange} />
              </div>
              <div className="input-group">
                <label>ชื่อสินค้า *</label>
                <input type="text" name="name" className="input-field" required value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>หมวดหมู่ *</label>
                <select name="category" className="input-field" value={formData.category} onChange={handleInputChange}>
                  <option value="ไข่ไก่">ไข่ไก่</option>
                  <option value="ไข่เป็ด">ไข่เป็ด</option>
                  <option value="ไข่เค็ม">ไข่เค็ม</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>ราคาทุน (฿) *</label>
                  <input type="number" name="costPrice" className="input-field" required min="0" value={formData.costPrice} onChange={handleInputChange} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>ราคาขาย (฿) *</label>
                  <input type="number" name="price" className="input-field" required min="0" value={formData.price} onChange={handleInputChange} />
                </div>
              </div>
              <div className="input-group">
                <label>จำนวนสต๊อก *</label>
                <input type="number" name="stock" className="input-field" required min="0" value={formData.stock} onChange={handleInputChange} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleInputChange} /> สินค้าขายดี
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="isPromotion" checked={formData.isPromotion} onChange={handleInputChange} /> โปรโมชั่น
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
