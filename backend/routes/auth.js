const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Регистрация
router.post('/register', async (req, res) => {
  const { login, password, full_name, phone, email } = req.body;

  // Простая валидация
  if (!login || !password || !full_name || !phone || !email) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }
  if (!/^[a-zA-Z0-9]{6,}$/.test(login)) {
    return res.status(400).json({ message: 'Логин должен содержать только латинские буквы и цифры, минимум 6 символов' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Пароль минимум 8 символов' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE login = $1', [login]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Логин уже занят' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (login, password, full_name, phone, email) VALUES ($1, $2, $3, $4, $5)',
      [login, hash, full_name, phone, email]
    );

    res.json({ message: 'Регистрация прошла успешно' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  // Проверка на админа
  if (login === 'Admin26' && password === 'Demo20') {
    req.session.user = { id: 0, login: 'Admin26', isAdmin: true };
    return res.json({ message: 'Вход выполнен', isAdmin: true });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    req.session.user = { id: user.id, login: user.login, isAdmin: false };
    res.json({ message: 'Вход выполнен', isAdmin: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Выход
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Выход выполнен' });
});

// Проверка сессии
router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  if (req.session.user.isAdmin) {
    return res.json(req.session.user);
  }

  try {
    const result = await pool.query(
      'SELECT id, login, full_name, phone, email FROM users WHERE id = $1',
      [req.session.user.id]
    );
    res.json({ ...result.rows[0], isAdmin: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;