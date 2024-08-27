const express = require("express")
const appBoleto = express.Router()
const boleto = require("../model/boleto")

appBoleto.use(express.json());

appBoleto.post("/ticket", async (req, res) => {
    let objBoleto = new boleto();
    const resultado = await objBoleto.buyTicketMovis(req.body);
    res.status(201).json(resultado);
    objBoleto.destructor()
});

appBoleto.post("/reserveSeats", async (req, res) => {
    let objBoleto = new boleto();
    const resultado = await objBoleto.reserveSeats(req.body);
    res.status(201).json(resultado);
});

appBoleto.get("/cancelSeats/:boleto_id", async(req, res) => {
    let objBoleto = new boleto();
    const idObject = { boleto_id: parseInt(req.params.boleto_id) };
    res.status(200).send(await objBoleto.cancelSeatReservation(idObject))
})

appBoleto.get("/verifyVip/:usuario_id", async(req, res) => {
    let objBoleto = new boleto();
    const idObject = { usuario_id: parseInt(req.params.usuario_id) };
    res.status(200).send(await objBoleto.verifyVIPCard(idObject))
})

appBoleto.get("/getBoleto/:nombre", async(req, res) => {
    let objBoleto = new boleto();
    const idObject = { nombre: req.params.nombre };
    res.status(200).send(await objBoleto.getBoleto(idObject))
    objBoleto.destructor()
})

module.exports = appBoleto;