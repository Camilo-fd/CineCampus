const express = require("express")
const appAsiento = express.Router()
const asiento = require("../model/asiento")

appAsiento.get("/checkSeat/:pelicula_id", async(req, res) => {
    let objAsiento = new asiento 
    const idObject = { pelicula_id: parseInt(req.params.pelicula_id) };
    res.status(200).send(await objAsiento.checkSeatAvailability(idObject))
    objAsiento.destructor()
})

module.exports = appAsiento;    