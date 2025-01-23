const express = require('express');
const db = require('./initdb');
const geoip = require('geoip-lite');
const PORT = 4000;
const app = express();

app.get('/', (req, res) => {
    res.send("Hola mundo");
});

app.get("/imagenes", (req, res) => {
    const ip = req.ip;
    const userAgent = req.get('User-Agent');
    const fecha = new Date().toISOString();
    const localizacion = geoip.lookup(ip);
    const insert = db.prepare("INSERT INTO usuarios (ip, userAgent, localizacion, fecha) VALUES (?, ?, ?, ?)");
    insert.run(ip, userAgent, localizacion, fecha);

    
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})