import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;


app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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

//PRODUCTES

//FUNCIONA
app.get('/producte', async (req, res) => {
    try {
        console.log("esta ejecutandose el try")
        const connection = await connectionPromise;
        console.log("se ha conectado a la bbdd")
        const [rows] = await connection.execute('SELECT * FROM PRODUCTE');
        console.log("se ha ejecutado el select")
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PRODUCTE' });
    }
});


//FUNCIONA
app.get('/producteAndroidApp', async (req, res) => {
    try {
        console.log("esta ejecutandose el try")
        const connection = await connectionPromise;
        console.log("se ha conectado a la bbdd")
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, PREU as preu, ESTOC as estoc, IMG as imatge FROM `producte` WHERE ACTIVAT = 1;');
        console.log("se ha ejecutado el select")
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PRODUCTE' });
    }
});

//FUNCIONA
app.post('/producte', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const {nom, preu, estoc, img, activat} = req.body;
        console.log("se ha ejecutado la conexión");
        const [result] = await connection.execute('INSERT INTO PRODUCTE (NOM, PREU, ESTOC, IMG, ACTIVAT) VALUES (?, ?, ?, ?, ?)', [nom, preu, estoc, img, activat]);
        res.json({ id: result.insertId, nom, preu, estoc, img, activat});
        console.log("se ha hecho el insert correctamente ");
    } catch (error) {
        res.status(500).json({ error: `Failed to create PRODUCTE ${error}` });
    }
});

//COMPORBANDO
app.put('/producte/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        console.log("conexion establecida");
        const { id } = req.params;
        console.log(req.params);
        const { nom, preu, estoc, img, activat} = req.body;
        console.log(req.body);
        await connection.execute('UPDATE PRODUCTE SET (NOM, PREU, ESTOC, IMG, ACTIVAT) VALUES (?, ?, ?, ?, ?)', [nom, preu, estoc, img, activat, id]);
        res.json({ id, nom, preu, estoc, img, activat });
    } catch (error) {
        res.status(500).json({ error: `Failed to update PRODUCTE  ${error}`});
    }
});


app.delete('/producte/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { id } = req.params;
        await connection.execute('DELETE FROM PRODUCTE WHERE id = ?', [id]);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete PRODUCTE' });
    }
});



//CODANDA
app.get('/comanda', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const [rows] = await connection.execute('SELECT ID as id, ESTAT as estat, IDUSER as iduser, PREU_TOTAL as preu_total, PRODUCTES as productes FROM comanda;');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comanda' });
    }
});


app.post('/comanda', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const {idUser, productes, estat } = req.body;
        const [result] = await connection.execute('INSERT INTO comanda (idUser, productes, estat) VALUES (?, ?)', [idUser, productes, estat]);
        res.json({ id: result.insertId, idUser, productes, estat});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create item' });
    }
});


app.put('/comanda/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { id } = req.params;
        const {idUser, productes, estat } = req.body;
        await connection.execute('UPDATE comanda SET name = ?, value = ? WHERE id = ?', [idUser, productes, estat]);
        res.json({ id, idUser, productes, estat});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});


app.delete('/comanda/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const { id } = req.params;
        await connection.execute('DELETE FROM comanda WHERE id = ?', [id]);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
