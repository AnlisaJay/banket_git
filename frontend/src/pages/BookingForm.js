import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    room: '',
    banquet_date: '',
    payment_method: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.room || !form.banquet_date || !form.payment_method) {
      return setError('Заполните все поля');
    }

    try {
      await axios.post('/api/bookings', form);
      setSuccess('Заявка успешно создана');
      setTimeout(() => navigate('/cabinet'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сервера');
    }
  }

  return (
    <div className="container">
      <h1>Банкетам.Нет</h1>
      <h2>Оформление заявки</h2>
      <form onSubmit={handleSubmit}>
        <label>Помещение</label>
        <select name="room" value={form.room} onChange={handleChange}>
          <option value="">Выберите помещение</option>
          <option value="Зал">Зал</option>
          <option value="Ресторан">Ресторан</option>
          <option value="Летняя веранда">Летняя веранда</option>
          <option value="Закрытая веранда">Закрытая веранда</option>
        </select>

        <label>Дата банкета</label>
        <input
          name="banquet_date"
          type="date"
          value={form.banquet_date}
          onChange={handleChange}
        />

        <label>Способ оплаты</label>
        <select name="payment_method" value={form.payment_method} onChange={handleChange}>
          <option value="">Выберите способ оплаты</option>
          <option value="Наличные">Наличные</option>
          <option value="Карта">Карта</option>
          <option value="Безналичный расчёт">Безналичный расчёт</option>
        </select>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Отправить заявку</button>
      </form>
      <p style={{ marginTop: '16px' }}>
        <button onClick={() => navigate('/cabinet')}>Назад на главную</button>
      </p>
    </div>
  );
}

export default BookingForm;