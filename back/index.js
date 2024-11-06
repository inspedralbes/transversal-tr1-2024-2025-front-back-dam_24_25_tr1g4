import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import http from 'http';    
import { Server } from 'socket.io'; 

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: '*',   
        methods: ['GET', 'POST','PUT']  
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit("conected", "hola, te has conectado!!!!!")
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const socketSendComandes = async (io) => {
    // select de la comanda
    //despues actualiza todo el array de comandas,porque asi es mucho mas fácil
    // io.emit
    //hacer un console.log :eligiendo estado de la comanda
    console.log("Eligiendo estado de la comanda");
    try {
        const connection = await connectToDatabase();
        // const [comandaSeleccionada] = await connection.execute('SELECT ID as id, ESTAT as estat FROM comanda WHERE ID = ?;', [id]); 
        const [comandes] = await connection.execute('SELECT ID as id, ESTAT as estat, IDUSER as iduser, PREU_TOTAL as preu_total, PRODUCTES as productes FROM comanda;');
        io.emit('actualizarArrayComandes', comandes);
        await connection.end();
    } catch (error) {
        console.error("Error al obtener el array de comandas:", error);
    }
};

   

const salt = bcrypt.genSaltSync(10);


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
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, ROUND(PREU, 2) as preu, ESTOC as estoc, IMG as imatge, ACTIVAT as activat FROM `producte`');
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
        const [rows] = await connection.execute('SELECT ID AS id, NOM as nom, ROUND(PREU, 2) as preu, ESTOC as estoc, IMG as imatge FROM `producte` WHERE ACTIVAT = 1;');
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
        const { nom, preu, estoc, imatge, activat } = req.body;
        let img = imatge
        console.log("se ha ejecutado la conexión");
        const [result] = await connection.execute('INSERT INTO PRODUCTE (NOM, PREU, ESTOC, IMG, ACTIVAT) VALUES (?, ?, ?, ?, ?)', [nom, preu, estoc, img, activat]);
        res.json({ id: result.insertId, nom, preu, estoc, img, activat });
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
        const { nom, preu, estoc, imatge, activat } = req.body;
        let img = imatge
        console.log(req.body);
        // console.log(`UPDATE PRODUCTE SET nom = ${nom}, preu = ${preu}, estoc = ${estoc}, img = ${img}, activat = ${activat} WHERE id = ${id}`);
        await connection.execute(
            'UPDATE PRODUCTE SET nom = ?, preu = ?, estoc = ?, img = ?, activat = ? WHERE id = ?',
            [nom, preu, estoc, img, activat, id]
        );
        console.log("se hace el update en la bbdd");
        res.json({ id, nom, preu, estoc, img, activat });
    } catch (error) {
        res.status(500).json({ error: `Failed to update PRODUCTE  ${error}` });
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
        rows.forEach(row => {
            row.preu_total = parseFloat(row.preu_total).toFixed(2);
            row.preu_total = parseFloat(row.preu_total);
            // console.log(typeof row.preu_total);
        });
        console.log(rows);
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
// app.get('/comandaAndroid', async (req, res) => {
//     let connection;
//     try {
//         connection = await connectToDatabase();
//         const [rows] = await connection.execute('SELECT ID as id, ESTAT as estatus, PREU_TOTAL as total, PRODUCTES as produtos FROM comanda;');

//         res.json({
//             valid: true,
//             data: rows
//         });
//     } catch (error) {

//         res.status(500).json({
//             valid: false,
//             error: 'Failed to fetch comanda'
//         });
//     } finally {
//         if (connection) {
//             await connection.end();
//             console.log('Database connection closed.');
//         }
//     }
// });




// CREATE
app.post('/comanda', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("conexion realizada");
        let { idUsuari, productes, preuTotal } = req.body;
        console.log(req.body);
        const preu_total = preuTotal;
        const idUser = idUsuari;
        productes = JSON.stringify(productes);
        const estat = 0;
        const { result, error } = await connection.execute('INSERT INTO comanda (idUser, productes, estat, preu_total) VALUES (?, ?, ?, ?)', [idUser, productes, estat, preu_total]);
        console.log("insert realizado correctamente en la bbdd");

        res.json({ valid: true });
    } catch (error) {
        console.log(error);
        res.json({ valid: false });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

//CREATE ANDOROID FUNCIONA
app.post('/comandaAndroid', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("Conexión realizada");

        const { productes } = req.body;

        const results = await Promise.all(productes.map(async (producte) => {
            const { idProducte, quantitat, preu } = producte;
            const totalPreu = quantitat * preu;

            const productesJson = JSON.stringify({ idProducte, quantitat });

            const [result] = await connection.execute(
                'INSERT INTO comanda (productes, preu_total) VALUES (?, ?)',
                [productesJson, totalPreu]
            );

            console.log(`Producto ${idProducte} insertado correctamente en la BBDD`);
            return { id: result.insertId, productes: productesJson, preu: totalPreu };
        }));

        res.json({ valid: true });
    } catch (error) {
        res.json({ valid: false });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});

// UPDATE VUE FUNCIONA
// app.put('/comanda/:id', async (req, res) => {
//     let connection;
//     try {
//         connection = await connectToDatabase();
//         console.log("conexion para actualizar comanda realizada correctamente");
//         const { id } = req.params;
//         console.log(req.params);
//         const { estat } = req.body;
//         console.log(req.body);
//         await connection.execute('UPDATE comanda SET estat = ? WHERE id = ?', [estat, id]);
//         res.json({ id, estat,});
//     } catch (error) {
//         res.status(500).json({ error: `Failed to update item ${error}` });
//     } finally {
//         if (connection) {
//             await connection.end();
//             console.log('Database connection closed.');
//         }
//     }
// });


// UPDATE COMANDA CON SOCKET.IO (PRUEBA)
app.put('/comanda/:id', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        console.log("Conexión para actualizar comanda realizada correctamente");
        
        const { id } = req.params;
        const { estat } = req.body;

        await connection.execute('UPDATE comanda SET estat = ? WHERE id = ?', [estat, id]);
        console.log("Update fet en la BBDD");

        const comandaActualizada = { id, estat };
        // console.log('Canviant estat de la comanda:', comandaActualizada);
        // await socketSendComandes(io);
        // io.emit('comandaUpdated', comandaActualizada);

        await socketSendComandes(io);

        res.json(comandaActualizada);
    } catch (error) {
        res.status(500).json({ error: `Failed to update item ${error}` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});


// DELETE SI ES NECESARIO
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

        const [checkExistingUser] = await connection.execute(
            'SELECT * FROM usuari WHERE correo = ?', [correo]
        );

        if (checkExistingUser.length > 0) {
            console.log("El usuario ya existe en la base de datos");
            const token = "2";
            return res.status(200).json({
                valid: false,
                usuari: {
                    id: 0,
                    nom: "none",
                    email: "none",
                    token
                }
            });
        }
        console.log("datos antes de hashear la contraseña: ", req.body);

        const hashedPassword = bcrypt.hashSync(password, salt);

        console.log(hashedPassword);

        const [result] = await connection.execute(
            'INSERT INTO usuari (name, password, pagament, correo) VALUES (?, ?, ?, ?)',
            [name, hashedPassword, pagament, correo]
        );
        console.log("Inserción realizada correctamente en la base de datos");

        // const token = jwt.sign({ userId: usuari.id }, process.env.JWT_SECRET, { expiresIn: '1h' });  CUANDO SE HAGA EL TOKEN REAL 
        const token = "2";
        return res.status(200).json({
            valid: true,
            usuari: {
                id: result.insertId,
                nom: name,
                email: correo,
                token
            }
        });


    } catch (error) {
        console.log(error);
        const token = "2";
        return res.status(200).json({
            valid: false,
            usuari: {
                id: 0,
                nom: "none",
                email: "none",
                token
            }
        });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexión a la base de datos cerrada.');
        }
    }
});


app.post('/login', async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();

        const { correu, contrasenya } = req.body;
        console.log("req.body:  ", req.body);

        const [userResult] = await connection.execute(
            'SELECT id, name, correo, password FROM usuari WHERE correo = ?', [correu]
        );

        if (userResult.length === 0) {
            const token = "2";
            return res.status(200).json({
                valid: false,
                usuari: {
                    id: 0,
                    nom: "none",
                    email: "none",
                    token
                }
            });
        }

        const usuari = userResult[0];
        console.log("contra ingresada: ", contrasenya);

        console.log("contrta bbdd: ", usuari.password); //contra bbdd
        const passwordMatch = bcrypt.compareSync(contrasenya, usuari.password);
        console.log(passwordMatch);

        if (!passwordMatch) {
            const token = "2";
            return res.status(200).json({
                valid: false,
                usuari: {
                    id: 0,
                    nom: "none",
                    email: "none",
                    token
                }
            });
        }
        else if (passwordMatch) {
            // const token = jwt.sign({ userId: usuari.id }, process.env.JWT_SECRET, { expiresIn: '1h' });  CUANDO SE HAGA EL TOKEN REAL 
            const token = "2";
            return res.status(200).json({
                valid: true,
                usuari: {
                    id: usuari.id,
                    nom: usuari.name,
                    email: usuari.correo,
                    token
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: `Error en el login: ${error.message} ` });
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});