// backend/server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001; // Different from React's default

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'db', // 'db' is the service name in docker-compose
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

// Initialize DB table if it doesn't exist
async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);
        console.log("Database table 'items' checked/created.");
    } catch (err) {
        console.error("Error initializing database table:", err);
        // Retry or handle error appropriately
        setTimeout(initDb, 5000); // Retry after 5 seconds
    }
}
initDb();


app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/items', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ msg: 'Please include a name' });
        }
        const newItem = await pool.query(
            'INSERT INTO items (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).send('Backend is healthy');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Attempting to connect to DB: ${process.env.POSTGRES_USER}@${process.env.POSTGRES_HOST}:${5432}/${process.env.POSTGRES_DB}`);
});