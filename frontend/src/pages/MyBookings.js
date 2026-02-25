import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/05.png';
import Slider from '../components/Slider';

function MyBookings({ setUser }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState({});
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadBookings();
    loadReviews();
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await axios.get('/api/auth/me');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadBookings() {
    try {
      const res = await axios.get('/api/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadReviews() {
    try {
      const res = await axios.get('/api/reviews/my');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    await axios.post('/api/auth/logout');
    setUser(null);
    navigate('/login');
  }

  async function handleReview(booking_id) {
    const text = reviewText[booking_id];
    if (!text) return setMessage('Введите текст отзыва');

    try {
      await axios.post('/api/reviews', { booking_id, text });
      setMessage('Отзыв добавлен');
      setReviewText({ ...reviewText, [booking_id]: '' });
      loadReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка');
    }
  }

  function hasReview(booking_id) {
    return reviews.some(r => r.booking_id === booking_id);
  }

  return (
    <div>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px', paddingRight: '16px', borderRight: '1px solid rgba(255,255,255,0.4)' }}>
          <img src={logo} alt="логотип" style={{ height: '60px', filter: 'brightness(0) invert(1)' }} />
          <span style={{ color: '#fff', fontWeight: 'bold' }}>Банкетам.Нет</span>
        </div>
        <button onClick={() => navigate('/booking')}>Новая заявка</button>
        <button onClick={handleLogout}>Выйти</button>
      </nav>

      <div className="container" style={{ maxWidth: '800px' }}>
        <Slider />

        <h2>Мои заявки</h2>
        {message && <p className="success">{message}</p>}

        {bookings.length === 0 && <p>Заявок пока нет</p>}

        {bookings.map(b => (
          <div key={b.id} style={{
            border: '1px solid #FFDAB9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p><strong>Помещение:</strong> {b.room}</p>
            <p><strong>Дата:</strong> {new Date(b.banquet_date).toLocaleDateString('ru-RU')}</p>
            <p><strong>Оплата:</strong> {b.payment_method}</p>
            <p><strong>Статус:</strong> <small>{b.status}</small></p>

            {b.status !== 'Новая' && !hasReview(b.id) && (
              <div style={{ marginTop: '12px' }}>
                <h3>Оставить отзыв</h3>
                <textarea
                  rows="3"
                  placeholder="Ваш отзыв..."
                  value={reviewText[b.id] || ''}
                  onChange={e => setReviewText({ ...reviewText, [b.id]: e.target.value })}
                />
                <button onClick={() => handleReview(b.id)}>Отправить отзыв</button>
              </div>
            )}

            {hasReview(b.id) && (
              <p style={{ marginTop: '8px' }}>
                <small>Отзыв оставлен</small>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;