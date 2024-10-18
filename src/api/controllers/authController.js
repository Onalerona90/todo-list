const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Register a new user
const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    try {
        await db.execute('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [userId, username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};

// Login user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        // Generate a token and save it to the database
        const token = uuidv4();
        await db.execute('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

        // Send the token to the client
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};

// Logout user
const logout = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        await db.execute('UPDATE users SET token = NULL WHERE token = ?', [token]);
        res.json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out', error: err });
    }
};

module.exports = { register, login, logout };
