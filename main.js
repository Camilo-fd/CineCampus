import { ObjectId } from "mongodb";
import { asiento } from "./js/model/asiento.js";
import { boleto } from "./js/model/boleto.js";
import { pago } from "./js/model/pago.js";
import { pelicula } from "./js/model/pelicula.js";
import { proyeccion } from "./js/model/proyeccion.js";
import { usuario } from "./js/model/usuario.js";


// let ObjPelicula = new pelicula()
// console.log(await ObjPelicula.getAllMovis());
// ObjPelicula.destructor()

// let ObjPelicula = new pelicula()
// console.log(await ObjPelicula.getMovisId(new ObjectId("64b5f1234567890123456789")));
// ObjPelicula.destructor()

// let objBoleto = new boleto();
// console.log(await objBoleto.buyTicketMovis({
//     pelicula_id: 2,
//     proyeccion_id: 2,
//     fechaCompra: "2025-01-12",
//     usuario_id: 1,
//     asiento_id: [3],
//     precio: 15000,
//     estado: "pagado"  
// }));
// objBoleto.destructor()

// let objAsiento = new asiento()
// console.log(await objAsiento.checkSeatAvailability({
//     proyeccion_id: 1,
//     asiento_id: [1]
// }));
// objAsiento.destructor()

// let objBoleto = new boleto();
// console.log(await objBoleto.reserveSeats({
//     proyeccion_id: 1,
//     usuario_id: 1,
//     asiento_id: [1, 7],
//     estado: "reservado"
// }));
// objBoleto.destructor()

// let objBoleto = new boleto();
// console.log(await objBoleto.cancelSeatReservation({
//     boleto_id: 6
// }));
// objBoleto.destructor()

// let objBoleto = new boleto();
// console.log(await objBoleto.verifyVIPCard(1));
// objBoleto.destructor()

// let objUsuario = new usuario();
// console.log(await objUsuario.newUser({
//     nombre: "Miguel_Castro",
//     email: "miguel_papu@gmail.com",
//     contraseña: "javascript",
//     rol: "estandar"
// }));

// let objUsuario = new usuario();
// console.log(await objUsuario.getUserById(2));
// objUsuario.destructor()

// let objUsuario = new usuario();
// console.log(await objUsuario.updateUserRole({
//     usuario_id: 4,
//     nuevoRol: "vip"
// }));
// objUsuario.destructor()