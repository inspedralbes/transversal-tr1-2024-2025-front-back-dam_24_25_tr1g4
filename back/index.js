import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();
const port = process.env.PORT;


app.use(cors())
app.use(bodyParser.json());

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

app.use('/assets', express.static('public'))

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

// CRUD PRODUCTES

// READ VUE
app.get('/producte', async (req, res) => {
    try {
        console.log("esta ejecutandose el try")
        const connection = await connectionPromise;
        console.log("se ha conectado a la bbdd")
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, PREU as preu, ESTOC as estoc, IMG as imatge, ACTIVAT as activat FROM `producte`');
        console.log("se ha ejecutado el select")
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PRODUCTE' });
    }
});


// READ ANDROID
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

// CREATE
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


// UPDATE
app.put('/producte/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        console.log("conexion establecida");
        const { id } = req.params;
        console.log(req.params);
        const { nom, preu, estoc, img, activat} = req.body;
        console.log(req.body);
        await connection.execute(
            'UPDATE PRODUCTE SET nom = ?, preu = ?, estoc = ?, img = ?, activat = ? WHERE id = ?', 
            [nom, preu, estoc, img, activat, id]
        );
        console.log("se hace el update en la bbdd");
        res.json({ id, nom, preu, estoc, img, activat });
    } catch (error) {
        res.status(500).json({ error: `Failed to update PRODUCTE  ${error}`});
    }
});

// DELETE
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



// CRUD COMANDA

// READ
app.get('/comanda', async (req, res) => {
    try {
        const connection = await connectionPromise;
        const [rows] = await connection.execute('SELECT ID as id, ESTAT as estat, IDUSER as iduser, PREU_TOTAL as preu_total, PRODUCTES as productes FROM comanda;');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comanda' });
    }
});


// CREATE
app.post('/comanda', async (req, res) => {
    try {
        const connection = await connectionPromise;
        console.log("conexion realizada");
        const {idUser, productes, estat, preu_total } = req.body;
        const [result] = await connection.execute('INSERT INTO comanda (idUser, productes, estat, preu_total) VALUES (?, ?, ?, ?)', [idUser, productes, estat, preu_total]);
        console.log("insert realizado correctamente en la bbdd");
        console.log(req.body);
        res.json({ id: result.insertId, idUser, productes, estat, preu_total});
    } catch (error) {
        res.status(500).json({ error: `Failed to create comanda ${error}` });
    }
});

// UPDATE
app.put('/comanda/:id', async (req, res) => {
    try {
        const connection = await connectionPromise;
        console.log("conexion para actualizar comanda realizada correctamente");
        const { id } = req.params;
        console.log(req.params);
        const {idUser, productes, estat, preu_total } = req.body;
        console.log(req.body);
        await connection.execute('UPDATE comanda SET idUser = ?, productes = ?, estat = ?, preu_total = ?', [idUser, productes, estat, preu_total]);
        res.json({ id, idUser, productes, estat, preu_total});
    } catch (error) {
        res.status(500).json({ error: `Failed to update item ${error}` });
    }
});

// DELETE
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
