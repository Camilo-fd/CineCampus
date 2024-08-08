const express = require("express")
const appAsiento = express.Router()
const asiento = require("../model/asiento")

appAsiento.get("/checkSeat/:proyeccion_id", async(req, res) => {
    let objAsiento = new asiento 
    const idObject = { proyeccion_id: parseInt(req.params.proyeccion_id) };
    res.status(200).send(await objAsiento.checkSeatAvailability(idObject))
})

module.exports = appAsiento;