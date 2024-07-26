import { connect } from "../../helpers/db/connect.js";

export class boleto extends connect{
    static instanceBoleto;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("boletos");
        if (typeof boleto.instanceBoleto === 'object') {
            return boleto.instanceBoleto;
        }
        boleto.instanceBoleto = this;
        return this;
    }

    destructor() {
        connect.instanceConnect = undefined;
        item.instanceItem = undefined;
    }

    async getAll(){
        await this.conexion.connect();
        const data = await this.collection.find({}).toArray()
        await this.conexion.close();
        return data
    }

    async buyTicketMovis(objecto) {
        try {
            await this.conexion.connect();

            // Genero el nuevo id del boleto
            const [dataBoleto] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdBoleto = dataBoleto.id + 1;

            // Genero el nuevo id del pago
            const [dataPago] = await this.db.collection("pagos").find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdPago = dataPago.id + 1;
            
            // Verifico que exista la pelicula
            let dataPelicula = await this.db.collection("peliculas").findOne({id: objecto.pelicula_id});
            if (!dataPelicula) {
                return { error: "No existe la película que buscas" };
            }
            
            // Verifico si existen proyecciones de la pelicula
            let dataProyeccion = await this.db.collection("proyecciones").findOne({id: objecto.proyeccion_id})
            if (!dataProyeccion) {
                return { error: "No exite proyeccion"}
            }
            if (dataProyeccion.pelicula_id !== objecto.pelicula_id) {
                return { error: "La proyección no corresponde a la película seleccionada" }
            }

            // Verifico el formato de la fecha compra del boleto 
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(objecto.fechaCompra)) {
                return { error: "Formato de fecha incorrecto (YYYY-MM-DD)" };
            }
    
            const [year, month, day] = objecto.fechaCompra.split('-').map(Number);
            const dateFechaCompra = new Date(year, month - 1, day);
            
            if (
                dateFechaCompra.getFullYear() !== year ||
                dateFechaCompra.getMonth() + 1 !== month ||
                dateFechaCompra.getDate() !== day
            ) {
                return { error: "Fecha inválida. Verifica el mes o el día." };
            }

            // Verifico el usuario 
            let dataUsuario = await this.db.collection("usuarios").findOne({id: objecto.usuario_id})
            if (!dataUsuario) {
                return { error: "Usuario no existente" }
            }
            if (dataUsuario.rol !== "vip") {
                return { error: "No es vip" }
            } else if (new Date(dataUsuario.tarjeta_VIP.fecha_expiracion) <= new Date()) {
                return { error: "Membresía vencida" }
            }

            // Verifico que el asiento exista, que este disponible y que concuerde con la pelicula 
            let dataAsiento = await this.db.collection("asientos").findOne({id: objecto.asiento_id})
            if (!dataAsiento) {
                return { error: "Asiento no existente" };
            }
            if (dataAsiento.proyeccion_id !== dataProyeccion.id) {
                return { error: "El asiento no corresponde a la proyección seleccionada" };
            }
            if (dataAsiento.estado !== "disponible") {
                return { error: "El asiento no está disponible" };
            }

            // Verifico los asientos
            for (let asientoId of objecto.asiento_id) {
                let dataAsiento = await this.db.collection("asientos").findOne({id: asientoId});
                if (!dataAsiento) {
                    return { error: `Asiento no existente ${dataAsiento}`};
                }
                if (dataAsiento.proyeccion_id !== dataProyeccion.id) {
                    return { error: "El asiento no corresponde a la proyección seleccionada" };
                }
                if (dataAsiento.estado !== "disponible") {
                    return { error: "El asiento no está disponible" };
                }
            }

            let descuento = objecto.precio * (dataUsuario.tarjeta_VIP.descuento / 100)
            let descuentoAplicado = objecto.precio - descuento

            // Nuevo documenbto de boleto
            let nuevoBoleto = {
                id: newIdBoleto,
                proyeccion_id: objecto.proyeccion_id,
                usuario_id: objecto.usuario_id,
                asientos: [objecto.asiento_id],
                precio: objecto.precio,
                descuento_aplicado: descuentoAplicado,
                fecha_compra: new Date(objecto.fechaCompra),
                estado: objecto.estado
            }
            
            // await this.collection.insertOne(nuevoBoleto)

            // Nuevo documento de pago
            let nuevoPago = {
                id: newIdPago,
                boleto_id: newIdBoleto,
                monto: 15000,
                metodo_pago: "efectivo",
                estado: "completado",
                fecha_transaccion: new Date()
            }

            // if (objecto.estado !== "reservado" || objecto.estado !== "rechazado") {
            //     await this.db.collection("pagos").insertOne(nuevoPago)
            // }

            return { message: "Boleto realizado" }

        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }
}