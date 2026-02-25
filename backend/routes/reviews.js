const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Оставить отзыв
router.post('/', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  const { booking_id, text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Введите текст отзыва' });
  }

  try {
    // Отзыв можно оставить только если статус не "Новая"
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [booking_id, req.session.user.id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    if (booking.rows[0].status === 'Новая') {
      return res.status(400).json({ message: 'Отзыв можно оставить только после изменения статуса' });
    }

    // Проверяем что отзыв ещё не оставлен
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE booking_id = $1',
      [booking_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Отзыв уже оставлен' });
    }

    await pool.query(
      'INSERT INTO reviews (user_id, booking_id, text) VALUES ($1, $2, $3)',
      [req.session.user.id, booking_id, text]
    );

    res.json({ message: 'Отзыв добавлен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить отзывы пользователя
router.get('/my', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const result = await pool.query(
      'SELECT r.*, b.room, b.banquet_date FROM reviews r JOIN bookings b ON r.booking_id = b.id WHERE r.user_id = $1',
      [req.session.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;