import bcrypt from 'bcryptjs';
import db from '../db.js';

// Login user
export const userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        res.status(200).send({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};
