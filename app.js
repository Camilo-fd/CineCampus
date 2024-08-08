const express = require("express")
const app = express()

const pelicula = require("./js/model/pelicula")
const boleto = require("./js/model/boleto")
const asiento = require("./js/model/asiento")


app.get("/pelicula", async(req, res) => {
    let objPeliculas = new pelicula 
    res.status(200).send(await objPeliculas.getAllMovis())
})

app.get("/pelicula/:id", async(req, res) => {
    let objPeliculas = new pelicula 
    const idObject = { id: parseInt(req.params.id) };
    res.status(200).send(await objPeliculas.getMovisId(idObject))
})

// ----------------------------------------------------------------

app.use(express.json());

app.post("/boleto", async (req, res) => {
    let objBoleto = new boleto();
    const resultado = await objBoleto.buyTicketMovis(req.body);
    res.status(201).json(resultado);
});

// ----------------------------------------------------------------

app.get("/asiento/:proyeccion_id", async(req, res) => {
    let objAsiento = new asiento 
    const idObject = { proyeccion_id: parseInt(req.params.proyeccion_id) };
    res.status(200).send(await objAsiento.checkSeatAvailability(idObject))
})

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT}, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
})