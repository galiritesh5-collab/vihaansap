const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://vihaansap.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Core DB API for MockDB replacement
app.use('/api/db', require('./routes/db.routes'));

// Auth routes
app.use('/api/auth', require('./routes/auth.routes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Centralized error handling
const { errorHandler } = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;
