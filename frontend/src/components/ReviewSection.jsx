import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaCommentDots, FaPaperPlane } from 'react-icons/fa';

export default function ReviewSection({ customerName }) {
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        customerName: customerName || 'ลูกค้าทั่วไป',
        comment: newComment,
        rating
      });
      setNewComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      alert('ไม่สามารถส่งความคิดเห็นได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', marginTop: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <FaCommentDots color="var(--primary-color)" /> ความคิดเห็นจากลูกค้า
      </h2>

      {/* Write Review Form */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>ร่วมแสดงความคิดเห็นของคุณ</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar 
                key={star} 
                size={24} 
                color={star <= rating ? '#fbbf24' : '#e5e7eb'} 
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <div className="input-group">
            <textarea 
              className="input-field" 
              rows="3" 
              placeholder="พิมพ์ความคิดเห็น หรือความประทับใจของคุณที่นี่..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !newComment.trim()}>
              <FaPaperPlane style={{ marginRight: '0.5rem' }} /> {isSubmitting ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีความคิดเห็น มารีวิวเป็นคนแรกสิ!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>{review.customerName}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {new Date(review.createdAt).toLocaleDateString('th-TH')}
                </span>
              </div>
              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar key={star} size={14} color={star <= review.rating ? '#fbbf24' : '#e5e7eb'} />
                ))}
              </div>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{review.comment}</p>
              
              {/* Admin Reply */}
              {review.adminReply && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderLeft: '4px solid var(--accent-color)',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <strong style={{ display: 'block', color: 'var(--accent-color)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    ตอบกลับจากร้านค้า:
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{review.adminReply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
