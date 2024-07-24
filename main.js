import { asiento } from "./js/model/asiento.js";
import { boleto } from "./js/model/boleto.js";
import { pago } from "./js/model/pago.js";
import { pelicula } from "./js/model/pelicula.js";
import { proyeccion } from "./js/model/proyeccion.js";
import { usuario } from "./js/model/usuario.js";


let ObjPelicula = new pelicula()
console.log(await ObjPelicula.getAll());
ObjPelicula.destructor()

console.log("--------------------------------------------------------");

let ObjProyeccion = new proyeccion()
console.log(await ObjProyeccion.getAll());
ObjProyeccion.destructor()

console.log("--------------------------------------------------------");

let ObjUsuario = new usuario()
console.log(await ObjUsuario.getAll());
ObjUsuario.destructor()

console.log("--------------------------------------------------------");

let ObjBoleto = new boleto()
console.log(await ObjBoleto.getAll());
ObjBoleto.destructor()

console.log("--------------------------------------------------------");

let ObjAsiento = new asiento()
console.log(await ObjAsiento.getAll());
ObjAsiento.destructor()

console.log("--------------------------------------------------------");

let ObjPago = new pago()
console.log(await ObjPago.getAll());
ObjPago.destructor()