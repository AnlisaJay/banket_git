import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/cabinet" element={user && !user.isAdmin ? <MyBookings setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/booking" element={user && !user.isAdmin ? <BookingForm /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.isAdmin ? <Admin setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
