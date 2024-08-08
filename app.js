const express = require("express")
const app = express()
const appPelicula = require("./server/router/pelicula.routes")
const appBoleto = require("./server/router/boleto.routes")
const appAsiento = require("./server/router/asiento.routes")

app.use(express.static(process.env.EXPRESS_STATIC))

app.get("/pelicula", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/pelicula.html`, {root: __dirname})
})
app.use("/pelicula", appPelicula)


app.get("/boleto", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/boleto.html`, {root: __dirname})
})
app.use("/boleto", appBoleto)


app.get("/asiento", async(req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/asiento.html`, {root: __dirname})
})
app.use("/asiento", appAsiento)

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT}, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
})