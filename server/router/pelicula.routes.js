const express = require("express")
const appPelicula = express.Router()
const { query, param, validationResult } = require("express-validator");
const pelicula = require("../model/pelicula")

appPelicula.get("/id/:id", [param("id").notEmpty()], async(req, res) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    } else {
        let objPeliculas = new pelicula 
        const idObject = { id: parseInt(req.params.id) };
        res.status(200).send(await objPeliculas.getMovisId(idObject))
        objPeliculas.destructor()
    }
})

appPelicula.get("/all", async(req, res) => {
    if (Object.keys(req.query).length) { 
        return res.status(400).json({ message: "No es necesario una query" })
    } else { 
        let objPeliculas = new pelicula 
        res.status(200).send(await objPeliculas.getAllMovis())
        objPeliculas.destructor()
    }
})

module.exports = appPelicula;