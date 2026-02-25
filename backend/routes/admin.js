const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware проверки админа
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Доступ запрещён' });
  }
}

// Получить все заявки
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.login, u.full_name, u.phone, u.email 
       FROM bookings b 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменить статус заявки
router.patch('/bookings/:id', isAdmin, async (req, res) => {
  const { status } = req.body;
  const allowed = ['Новая', 'Банкет назначен', 'Банкет завершен'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Недопустимый статус' });
  }

  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: 'Статус обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
