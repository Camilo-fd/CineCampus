const express = require("express")
const appPelicula = express.Router()
const pelicula = require("../model/pelicula")

appPelicula.get("/all", async(req, res) => {
    let objPeliculas = new pelicula 
    res.status(200).send(await objPeliculas.getAllMovis())
})

appPelicula.get("/id/:id", async(req, res) => {
    let objPeliculas = new pelicula 
    const idObject = { id: parseInt(req.params.id) };
    res.status(200).send(await objPeliculas.getMovisId(idObject))
})

module.exports = appPelicula;