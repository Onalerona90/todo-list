const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();

// CORS setup to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true // Allow credentials (although we're not using sessions, we may need cookies in future)
}));

// Body parser middleware to handle JSON requests
app.use(express.json());

// Routes
app.use('/api', authRoutes); // User authentication routes

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;
