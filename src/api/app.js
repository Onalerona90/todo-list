const express = require('express');
const session = require('express-session');
const MySQLStore = require('connect-mysql-session')(session);
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dotenv = require('dotenv');
const db = require('./db');
const cors = require('cors');

dotenv.config();

const app = express();

// CORS setup to allow the frontend to communicate with the backend
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Allow cookies to be sent

// Express session setup
const sessionStore = new MySQLStore({}, db.promise());
app.use(session({
    key: 'user_sid', // Name of the cookie
    secret: process.env.SESSION_SECRET, // Secret for session encryption
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // Session valid for 2 hours
        httpOnly: true,
        secure: false // Use true if using https
    }
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;
