import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'testdb'
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the MySQL database.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

const connectionPromise = connectToDatabase();

app.get('/items', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const [rows] = await connection.execute('SELECT * FROM items');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.post('/items', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { name, value } = req.body;
        const [result] = await connection.execute('INSERT INTO items (name, value) VALUES (?, ?)', [name, value]);
        res.json({ id: result.insertId, name, value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { id } = req.params;
        const { name, value } = req.body;
        await connection.execute('UPDATE items SET name = ?, value = ? WHERE id = ?', [name, value, id]);
        res.json({ id, name, value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { id } = req.params;
        await connection.execute('DELETE FROM items WHERE id = ?', [id]);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});