const express = require("express")
const appUsuario = express.Router()
const usuario = require("../model/usuario")

appUsuario.use(express.json());

appUsuario.post("/newUser", async (req, res) => {
    let objUsuario = new usuario();
    const resultado = await objUsuario.newUser(req.body);
    res.status(201).json(resultado);
});

appUsuario.get("/getUser/:id", async (req, res) => {
    let objUsuario = new usuario();
    const idObject = { id: parseInt(req.params.id) };
    res.status(200).send(await objUsuario.getUserById(idObject))
});

appUsuario.post("/updateRol", async (req, res) => {
    let objUsuario = new usuario();
    const resultado = await objUsuario.updateUserRole(req.body);
    res.status(201).json(resultado);
});

appUsuario.get("/getUserRol/:rol", async (req, res) => {
    let objUsuario = new usuario();
    res.status(200).send(await objUsuario.getUsersByRole(req.params.rol))
});

module.exports = appUsuario;