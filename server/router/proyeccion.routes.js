const express = require("express")
const appProyeccion = express.Router()
const proyeccion = require("../model/proyeccion")

appProyeccion.get("/getAll/:pelicula_id", async(req, res) => {
    let objProyeccion = new proyeccion();
    const idObject = { pelicula_id: parseInt(req.params.pelicula_id) };
    res.status(200).send(await objProyeccion.getProyeccionId(idObject));
    objProyeccion.destructor()
})

module.exports = appProyeccion;   