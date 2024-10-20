import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db; // Export promise-based connection for async/await
