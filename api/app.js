import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// const dotenv = require('dotenv');
import { userLogin } from './controllers/userLogin.js';

// Load environment variables
dotenv.config();

const app = express();
const router = express.Router();

// CORS setup to allow requests from the frontend
app.use(cors({
    origin: '*', // Frontend URL
    credentials: true // Allow credentials (although we're not using sessions, we may need cookies in future)
}));

// Body parser middleware to handle JSON requests
app.use(express.json());

app.use(router);

// Routes
router.post('/login', userLogin); // User login authentication route

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
