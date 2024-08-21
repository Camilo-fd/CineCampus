const express = require("express")
const appProyeccion = express.Router()
const proyeccion = require("../model/proyeccion")

appProyeccion.get("/getAll/:pelicula_id", async(req, res) => {
    let objProyeccion = new proyeccion();
    const resultado = await objProyeccion.getAll(req.params.pelicula_id);
    res.status(201).json(resultado);
    objProyeccion.destructor()
})

module.exports = appProyeccion;    