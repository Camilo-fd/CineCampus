const express = require("express")
const app = express()

const pelicula = require("./js/model/pelicula")
const boleto = require("./js/model/boleto")

const host = "localhost"
const port = 5000


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

app.listen({host, port}, () => {
    console.log(`http://${host}:${port}`);
})