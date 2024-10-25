import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

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

// CRUD PRODUCTES

// GET VUE
app.get('/producte', async (req, res) => {
    let connection;
    try {
        console.log("esta ejecutandose el try")
        connection = await connectToDatabase();
        console.log("se ha conectado a la bbdd")
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, PREU as preu, ESTOC as estoc, IMG as imatge, ACTIVAT as activat FROM `producte`');
        console.log("se ha ejecutado el select")
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PRODUCTE' });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// GET ANDROID
app.get('/producteAndroidApp', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("se ha conectado a la bbdd")
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, PREU as preu, ESTOC as estoc, IMG as imatge FROM `producte` WHERE ACTIVAT = 1;');
        console.log("se ha ejecutado el select")
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch PRODUCTE' });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// CREATE
app.post('/producte', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const {nom, preu, estoc, img, activat} = req.body;
        console.log("se ha ejecutado la conexión");
        const [result] = await connection.execute('INSERT INTO PRODUCTE (NOM, PREU, ESTOC, IMG, ACTIVAT) VALUES (?, ?, ?, ?, ?)', [nom, preu, estoc, img, activat]);
        res.json({ id: result.insertId, nom, preu, estoc, img, activat});
        console.log("se ha hecho el insert correctamente ");
    } catch (error) {
        res.status(500).json({ error: `Failed to create PRODUCTE ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// UPDATE
app.put('/producte/:id', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
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
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// DELETE
app.delete('/producte/:id', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const { id } = req.params;
        await connection.execute('DELETE FROM PRODUCTE WHERE id = ?', [id]);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete PRODUCTE' });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// CRUD COMANDA

// READ
app.get('/comanda', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT ID as id, ESTAT as estat, IDUSER as iduser, PREU_TOTAL as preu_total, PRODUCTES as productes FROM comanda;');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comanda' });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

//acabada
app.get('/comandaAndroid', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT ID as id, ESTAT as estatus, PREU_TOTAL as total, PRODUCTES as produtos FROM comanda;');

        res.json({
            valid: true,
            data: rows
        });
    } catch (error) {
    
        res.status(500).json({
            valid: false,
            error: 'Failed to fetch comanda'
        });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});




// CREATE
app.post('/comanda', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("conexion realizada");
        const {idUser, productes, estat, preu_total } = req.body;
        const [result] = await connection.execute('INSERT INTO comanda (idUser, productes, estat, preu_total) VALUES (?, ?, ?, ?)', [idUser, productes, estat, preu_total]);
        console.log("insert realizado correctamente en la bbdd");
        console.log(req.body);
        res.json({ id: result.insertId, idUser, productes, estat, preu_total});
    } catch (error) {
        res.status(500).json({ error: `Failed to create comanda ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

app.post('/comandaAndorid', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("conexion realizada");
        const {idProducte, quantitat, preu} = req.body;
        const [result] = await connection.execute('INSERT INTO comanda (idProduct, quantitat, preu) VALUES (?, ?, ?)', [idProducte, quantitat, preu]);
        console.log("insert realizado correctamente en la bbdd");
        console.log(req.body);
        res.json({ id: result.insertId, idProducte, quantitat, preu});
    } catch (error) {
        res.status(500).json({ error: `Failed to create comanda ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// UPDATE
app.put('/comanda/:id', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("conexion para actualizar comanda realizada correctamente");
        const { id } = req.params;
        console.log(req.params);
        const {idUser, productes, estat, preu_total } = req.body;
        console.log(req.body);
        await connection.execute('UPDATE comanda SET idUser = ?, productes = ?, estat = ?, preu_total = ?', [idUser, productes, estat, preu_total]);
        res.json({ id, idUser, productes, estat, preu_total});
    } catch (error) {
        res.status(500).json({ error: `Failed to update item ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// DELETE
app.delete('/comanda/:id', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const { id } = req.params;
        await connection.execute('DELETE FROM comanda WHERE id = ?', [id]);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: `Failed to delete item ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});



// CRUD USERS
// READ FUNCIONA
app.get('/users', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT ID as idUsuari, NAME as nom, CORREO as correu, PAGAMENT as forma_pagament FROM usuari;');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch USUARIS ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// CREATE
app.post('/users', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("Conexión realizada");

        const { name, password, pagament, correo } = req.body;

        if (!name || !password || !pagament || !correo) {
            return res.status(400).json({ error: `Todos los campos son obligatorios` });
        }
        console.log("datos antes de hashear la contraseña: " , req.body);
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const [result] = await connection.execute(
            'INSERT INTO usuari (name, password, pagament, correo) VALUES (?, ?, ?, ?)',
            [name, hashedPassword, pagament, correo]
        );

        console.log("Inserción realizada correctamente en la base de datos");

        res.json({ id: result.insertId, name, pagament, correo }); 
    } catch (error) {
        res.status(500).json({ error: `Fallo al crear usuario: ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexión a la base de datos cerrada.');
        }
    }
});

app.get('/login/idUser', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const { idUser }= req.params
        const { correo, password} = req.body
        const [rows] = await connection.execute('SELECT CORREO as correu, PASSWORD as contrasenya FROM usuari where ID = ?;', [ correo, password, idUser ]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch USUARIS ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});