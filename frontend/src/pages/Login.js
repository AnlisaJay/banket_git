import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/login', form);
      setUser({ login: form.login, isAdmin: res.data.isAdmin });
      if (res.data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/cabinet');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сервера');
    }
  }

  return (
    <div className="container">
      <h1>Банкетам.Нет</h1>
      <h2>Вход</h2>
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Войти</button>
      </form>
      <p style={{ marginTop: '16px' }}>
        Ещё не зарегистрированы? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}

export default Login;