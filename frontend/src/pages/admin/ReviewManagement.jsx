import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentDots, FaReply, FaStar } from 'react-icons/fa';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews`);
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  const handleReplySubmit = async (e, id) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/reviews/${id}/reply`, {
        adminReply: replyText
      });
      setReplyText('');
      setReplyingTo(null);
      fetchReviews();
    } catch (error) {
      alert('ไม่สามารถส่งคำตอบกลับได้');
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
      <div className="glass" style={{ padding: '2rem', minHeight: '100%' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <FaCommentDots color="var(--primary-color)" /> จัดการความคิดเห็นลูกค้า
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>ยังไม่มีความคิดเห็นจากลูกค้า</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="glass-card hover-bg" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{review.customerName}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(review.createdAt).toLocaleDateString('th-TH')} {new Date(review.createdAt).toLocaleTimeString('th-TH')}
                  </span>
                </div>
                
                <div style={{ display: 'flex', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar key={star} size={16} color={star <= review.rating ? '#fbbf24' : '#e5e7eb'} />
                  ))}
                </div>
                
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{review.comment}</p>

                {/* Admin Reply Section */}
                {review.adminReply ? (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    borderLeft: '4px solid var(--accent-color)',
                    borderRadius: '4px'
                  }}>
                    <strong style={{ display: 'block', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>
                      คุณได้ตอบกลับแล้ว:
                    </strong>
                    <p style={{ margin: 0 }}>{review.adminReply}</p>
                  </div>
                ) : (
                  <div>
                    {replyingTo === review.id ? (
                      <form onSubmit={(e) => handleReplySubmit(e, review.id)} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <textarea
                          className="input-field"
                          rows="2"
                          placeholder="พิมพ์ข้อความตอบกลับลูกค้า..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{ flex: 1 }}
                          autoFocus
                        ></textarea>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>ส่งคำตอบ</button>
                          <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => setReplyingTo(null)}>ยกเลิก</button>
                        </div>
                      </form>
                    ) : (
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'inline-flex', gap: '0.5rem' }}
                        onClick={() => {
                          setReplyingTo(review.id);
                          setReplyText('');
                        }}
                      >
                        <FaReply /> ตอบกลับความคิดเห็น
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
