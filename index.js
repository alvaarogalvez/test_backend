const express = require('express');
const db = require('./initdb');
const fs = require('fs');
const path = require('path')
const geoip = require('geoip-lite');
const morgan = require('morgan');
const PORT = 4000;
const app = express();
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));
app.get('/', (req, res) => {
    res.send("Hola mundo");
});

app.get("/imagenes", (req, res) => {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const fecha = new Date().toISOString();
    const localizacion = geoip.lookup(ip);
    const insert = db.prepare("INSERT INTO usuarios (ip, userAgent, localizacion, fecha) VALUES (?, ?, ?, ?)");

    insert.run(ip, userAgent, localizacion.city, fecha);

    const imagenes = [
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpeg",
        "5.jpg"
    ]
    const numeroAleatorio = Math.floor(Math.random() * imagenes.length);
    const imagen = imagenes[numeroAleatorio];
    res.sendFile(__dirname + `/${imagen}`);
});

app.get("/usuarios", (req, res) => {
    const stmt = "SELECT * FROM usuarios";
    const usuarios = db.prepare
    (stmt).all();
    res.json(usuarios);
});

app.post("/collect", (req, res) => {
    const data = req.body;
    console.log(data);
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})