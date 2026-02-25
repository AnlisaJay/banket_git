const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: 'banket_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true },
}));

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => {
  console.log('Сервер запущен на порту 5000');
});