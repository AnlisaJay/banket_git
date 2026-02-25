const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Создать заявку
router.post('/', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  const { room, banquet_date, payment_method } = req.body;
  if (!room || !banquet_date || !payment_method) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  try {
    await pool.query(
      'INSERT INTO bookings (user_id, room, banquet_date, payment_method) VALUES ($1, $2, $3, $4)',
      [req.session.user.id, room, banquet_date, payment_method]
    );
    res.json({ message: 'Заявка создана' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить заявки текущего пользователя
router.get('/my', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.session.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;