const express = require("express")
const appBoleto = express.Router()
const boleto = require("../model/boleto")

appBoleto.use(express.json());

appBoleto.post("/ticket", async (req, res) => {
    let objBoleto = new boleto();
    const resultado = await objBoleto.buyTicketMovis(req.body);
    res.status(201).json(resultado);
});

module.exports = appBoleto;