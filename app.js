const express = require("express");
const NodeCache = require("node-cache");
const app = express();
const appPelicula = require("./server/router/pelicula.routes");
const appBoleto = require("./server/router/boleto.routes");
const appAsiento = require("./server/router/asiento.routes");
const appUsuario = require("./server/router/usuario.routes");
const appProyeccion = require("./server/router/proyeccion.routes")

// Inicializar el caché
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

app.use(express.static(process.env.EXPRESS_STATIC));
app.use(express.json());

// Middleware de caché
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);
        if (cachedResponse) {
            res.send(cachedResponse);
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.set(key, body, duration);
                res.sendResponse(body);
            };
            next();
        }
    };
};

app.get("/", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/index.html`, {root: __dirname});
});

app.get("/pelicula", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/pelicula.html`, {root: __dirname});
});

app.get("/pelicula/detalle", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/peliculaDetalle.html`, { root: __dirname });
});

app.get("/boleto", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/boleto.html`, {root: __dirname});
});

app.get("/asiento", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/asiento.html`, {root: __dirname});
});

app.get("/usuario", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/usuario.html`, {root: __dirname});
});

// Aplicar caché a las rutas de la API
app.use("/pelicula", cacheMiddleware(600), appPelicula);
app.use("/boleto", cacheMiddleware(300), appBoleto);
app.use("/asiento", cacheMiddleware(300), appAsiento);
app.use("/usuario", cacheMiddleware(300), appUsuario);
app.use("/proyeccion", cacheMiddleware(300), appProyeccion);

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT}, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});