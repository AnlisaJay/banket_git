import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    login: '', password: '', full_name: '', phone: '', email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhoneChange(e) {
    const input = e.target.value;

    // если пользователь удаляет всё
    if (input === '' || input === '+') {
      setForm({ ...form, phone: '' });
      return;
    }

    let val = input.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (!val.startsWith('7')) val = '7' + val;
    val = val.slice(0, 11);

    let formatted = '+7';
    if (val.length > 1) formatted += '(' + val.slice(1, 4);
    if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
    if (val.length >= 7) formatted += '-' + val.slice(7, 9);
    if (val.length >= 9) formatted += '-' + val.slice(9, 11);

    setForm({ ...form, phone: formatted });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[a-zA-Z0-9]{6,}$/.test(form.login)) {
      return setError('Логин должен содержать только латинские буквы и цифры, минимум 6 символов');
    }
    if (form.password.length < 8) {
      return setError('Пароль минимум 8 символов');
    }
    if (!form.full_name || !form.phone || !form.email) {
      return setError('Заполните все поля');
    }
    if (form.full_name.trim().split(' ').length < 2) {
      return setError('Введите фамилию и имя');
    }
    if (form.phone.replace(/\D/g, '').length < 11) {
      return setError('Введите полный номер телефона');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError('Введите корректный email');
    }

    try {
      await axios.post('/api/auth/register', form);
      setSuccess('Регистрация прошла успешно');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сервера');
    }
  }

  return (
    <div className="container">
      <h1>Банкетам.Нет</h1>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="login"
          placeholder="Логин"
          value={form.login}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="full_name"
          placeholder="ФИО"
          value={form.full_name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="+7(___) ___-__-__"
          value={form.phone}
          onChange={handlePhoneChange}
        />
        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p style={{ marginTop: '16px' }}>
        Уже зарегистрированы? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;