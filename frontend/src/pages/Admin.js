import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/05.png';

function Admin({ setUser }) {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('desc');
    const perPage = 5;

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            const res = await axios.get('/api/admin/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogout() {
        await axios.post('/api/auth/logout');
        setUser(null);
        navigate('/login');
    }

    async function changeStatus(id, status) {
        try {
            await axios.patch(`/api/admin/bookings/${id}`, { status });
            setMessage('Статус обновлён');
            loadBookings();
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            setMessage('Ошибка при обновлении');
        }
    }


    // фильтрация и сортировка
    const filtered = bookings
        .filter(b => {
            if (!filter) return true;
            return b.status === filter;
        })
        .sort((a, b) => {
            if (sort === 'asc') return new Date(a.banquet_date) - new Date(b.banquet_date);
            return new Date(b.banquet_date) - new Date(a.banquet_date);
        });

    // пагинация
    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div>
            <nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px', paddingRight: '16px', borderRight: '1px solid rgba(255,255,255,0.4)' }}>
                    <img src={logo} alt="логотип" style={{ height: '60px', filter: 'brightness(0) invert(1)' }} />
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>Банкетам.Нет</span>
                </div>
                <button onClick={handleLogout}>Выйти</button>
            </nav>

            <div className="container" style={{ maxWidth: '900px' }}>
                <h2>Все заявки</h2>

                {message && <p className="success">{message}</p>}

                <div style={{ marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div>
                        <label>Фильтр по статусу: </label>
                        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
                            <option value="">Все</option>
                            <option value="Новая">Новая</option>
                            <option value="Банкет назначен">Банкет назначен</option>
                            <option value="Банкет завершен">Банкет завершен</option>
                        </select>
                    </div>
                    <div>
                        <label>Сортировка по дате: </label>
                        <select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="desc">Сначала новые</option>
                            <option value="asc">Сначала старые</option>
                        </select>
                    </div>
                </div>

                {paginated.length === 0 && <p>Заявок нет</p>}

                {paginated.map(b => (
                    <div key={b.id} style={{
                        border: '1px solid #FFDAB9',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px'
                    }}>
                        <p><strong>Пользователь:</strong> {b.full_name} ({b.login})</p>
                        <p><strong>Телефон:</strong> {b.phone}</p>
                        <p><strong>Email:</strong> {b.email}</p>
                        <p><strong>Помещение:</strong> {b.room}</p>
                        <p><strong>Дата:</strong> {new Date(b.banquet_date).toLocaleDateString('ru-RU')}</p>
                        <p><strong>Оплата:</strong> {b.payment_method}</p>
                        <p><strong>Статус:</strong> <small>{b.status}</small></p>

                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => changeStatus(b.id, 'Новая')}>Новая</button>
                            <button onClick={() => changeStatus(b.id, 'Банкет назначен')}>Банкет назначен</button>
                            <button onClick={() => changeStatus(b.id, 'Банкет завершен')}>Банкет завершен</button>
                        </div>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{ backgroundColor: p === page ? '#DC143C' : '#DAA520' }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;