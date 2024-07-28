import { connect } from "../../helpers/db/connect.js";
import { usuario } from "./usuario.js";

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
        // item.instanceItem = undefined;
    }

    async getAll(){
        await this.conexion.connect();
        const data = await this.collection.find({}).toArray()
        await this.conexion.close();
        return data
    }

    /**
         * This function is responsible for buying a movie ticket for a VIP user.
         * It performs several validations and operations related to the ticket purchase.
         *
         * @param {Object} objecto - The object containing the necessary data for the ticket purchase.
         * @param {number} objecto.pelicula_id - The ID of the movie.
         * @param {number} objecto.proyeccion_id - The ID of the projection.
         * @param {number} objecto.usuario_id - The ID of the user.
         * @param {Array<number>} objecto.asiento_id - The IDs of the seats.
         * @param {number} objecto.precio - The price of the ticket.
         * @param {string} objecto.fechaCompra - The date of the ticket purchase in the format YYYY-MM-DD.
         * @param {string} objecto.estado - The state of the ticket (e.g., "reservado", "comprado", "rechazado").
         *
         * @returns {Object} - An object containing either a success message or an error message.
         * @returns {Object.message} - A success message indicating that the ticket was successfully purchased.
         * @returns {Object.error} - An error message indicating that an error occurred during the ticket purchase.
     */
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

            // Verifico que el asiento exista, que esté disponible y que concuerde con la proyección
            for (let asientoId of objecto.asiento_id) {
                let dataAsiento = await this.db.collection("asientos").findOne({id: asientoId});
                if (!dataAsiento) {
                    return { error: `Asiento no existente ${asientoId}` };
                }
                if (dataAsiento.proyeccion_id !== dataProyeccion.id) {
                    return { error: `El asiento ${dataAsiento.id} no corresponde a la proyección seleccionada` };
                }
                if (dataAsiento.estado !== "disponible") {
                    return { error: `El asiento ${dataAsiento} no está disponible` };
                }
            }

            let descuento = objecto.precio * (dataUsuario.tarjeta_VIP.descuento / 100)
            let precioDescuentoAplicado = objecto.precio - descuento

            
            // Nuevo documenbto de boleto
            let nuevoBoleto = {
                id: newIdBoleto,
                proyeccion_id: objecto.proyeccion_id,
                usuario_id: objecto.usuario_id,
                asientos: objecto.asiento_id,
                precio: objecto.precio,
                descuento_aplicado: dataUsuario.tarjeta_VIP.descuento,
                fecha_compra: new Date(objecto.fechaCompra),
                estado: objecto.estado
            }
            
            await this.collection.insertOne(nuevoBoleto)
            
            // Actualizamos el estado del asiento
            for (let asiento of objecto.asiento_id){
                await this.db.collection('asientos').updateOne(
                    {id: asiento},
                    {$set:{estado: "ocupado"}});
              }
            
            // // Nuevo documento de pago
            let nuevoPago = {
                id: newIdPago,
                boleto_id: newIdBoleto,
                pago_total: precioDescuentoAplicado,
                metodo_pago: "efectivo",
                estado: "completado",
            }

            // Inserta el nuevo documento de pago
            if (objecto.estado !== "reservado" || objecto.estado !== "rechazado") {
                await this.db.collection("pagos").insertOne(nuevoPago)
            }

            return { message: "Boleto realizado" }

        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }

    // Permitir la selección y reserva de asientos para una proyección específica.

    /**
         * This function is responsible for reserving seats for a specific projection.
         * It performs several validations and operations related to seat reservation.
         *
         * @param {Object} objecto - The object containing the necessary data for seat reservation.
         * @param {number} objecto.proyeccion_id - The ID of the projection.
         * @param {number} objecto.usuario_id - The ID of the user.
         * @param {Array<number>} objecto.asiento_id - The IDs of the seats to be reserved.
         *
         * @returns {Object} - An object containing either a success message or an error message.
         * @returns {Object.message} - A success message indicating that the seats were successfully reserved.
         * @returns {Object.error} - An error message indicating that an error occurred during seat reservation.
         * @returns {Object.Reservados} - An array of reserved seat numbers.
    */
    async reserveSeats(objecto) {
        try {
            await this.conexion.connect();
    
            // Genero el nuevo id del boleto
            const [dataBoleto] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdBoleto = dataBoleto ? dataBoleto.id + 1 : 1;
    
            // Verifico si existe la proyección
            let dataProyeccion = await this.db.collection("proyecciones").findOne({ id: objecto.proyeccion_id });
            if (!dataProyeccion) {
                return { error: "No existe la proyección" };
            }
    
            // Verifico si existe el usuario
            let dataUsuario = await this.db.collection("usuarios").findOne({ id: objecto.usuario_id });
            if (!dataUsuario) {
                return { error: "Usuario no existente" };
            }
    
            // Verifico si existen los asientos de la proyección y si están disponibles
            let availableSeats = [];
            for (let asiento of objecto.asiento_id) {
                let dataAsiento = await this.db.collection("asientos").findOne({
                    id: asiento,
                    proyeccion_id: objecto.proyeccion_id
                });
    
                if (!dataAsiento) {
                    return { error: `El asiento #${asiento} no existe para la proyección` };
                }
    
                if (dataAsiento.estado === "disponible") {
                    availableSeats.push(`Asiento #${dataAsiento.id}`);
                }
            }
    
            // Actualizo el estado a reservado de los asientos
            if (availableSeats.length === objecto.asiento_id.length) {
                for (let asiento of objecto.asiento_id) {
                    await this.db.collection("asientos").updateOne(
                        { id: asiento, proyeccion_id: objecto.proyeccion_id },
                        { $set: { estado: "reservado" } }
                    );
                }

                // Nuevo documento de reserva
                let nuevoReserva = {
                    id: newIdBoleto,
                    proyeccion_id: objecto.proyeccion_id,
                    usuario_id: objecto.usuario_id,
                    asientos: objecto.asiento_id,
                    estado: "reservado"
                }

                // Inserta el nuevo documento de reserva
                await this.collection.insertOne(nuevoReserva);

                return { 
                    message: 'Asientos reservados con éxito', 
                    Reservados: availableSeats 
                };

            } else {
                return { error: 'No hay suficientes asientos disponibles' };
            }

        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }

    // Permitir la cancelación de una reserva de asiento ya realizada.

    /**
         * This function is responsible for canceling a seat reservation.
         * It connects to the database, retrieves the reservation data, checks if the reservation is in a 'reservado' state,
         * updates the seat status to 'disponible', and deletes the reservation document.
         *
         * @param {Object} objecto - The object containing the necessary data for seat reservation cancellation.
         * @param {number} objecto.boleto_id - The ID of the reservation to be canceled.
         *
         * @returns {string|Object} - A success message or an error object.
         * @returns {string} - A success message indicating that the reservation was canceled.
         * @returns {Object.error} - An error message indicating that an error occurred during the cancellation process.
     */
    async cancelSeatReservation(objecto) {
        try {
            await this.conexion.connect()

            let dataBoleto = await this.collection.findOne({id: objecto.boleto_id});
            if (!dataBoleto) {
                return { error: "Reserva no encontrada" };
            }

            if (dataBoleto.estado === "reservado") {
                for (let asiento of dataBoleto.asientos) {
                    await this.db.collection("asientos").updateOne(
                        { id: asiento, proyeccion_id: dataBoleto.proyeccion_id },
                        { $set: { estado: "disponible" } }
                    );
                }
            } else {
                return { error: "No se puede cancelar una reserva que no esté en estado reservado" };
            }

            await this.collection.deleteOne({ id: objecto.boleto_id });

            return { message: "Cancelada la reserva" }

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close();
        }
    }

    // Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.

    /**
         * This function applies discounts to the purchase of tickets for VIP users.
         * It retrieves the user's VIP card information and calculates the applicable discount.
         *
         * @param {number} usuario_id - The ID of the user for whom the discount is being applied.
         *
         * @returns {Object} - An object containing either a success message or an error message.
         * @returns {Object.message} - A success message indicating the discount percentage for VIP users.
         * @returns {Object.error} - An error message indicating that an error occurred during the discount application process.
     */
    async verifyVIPCard(usuario_id) {
        try {
            await this.conexion.connect()

            // Verifico que exista el usuario
            let dataTarjetaVIP = await this.db.collection("usuarios").findOne({ id: usuario_id});
            if (!dataTarjetaVIP) {
                return { message: "No existe usuario" };
            }

            // Verifico que tenga tarjeta VIP
            if (!dataTarjetaVIP.tarjeta_VIP) {
                return { message: "No eres usuario con tarjeta VIP" };
            }

            // Verifico que la tarjeta VIP no haya caducado
            if (dataTarjetaVIP.tarjeta_VIP.fecha_expiracion < new Date()) {
                return { message: "La tarjeta VIP caducó" };
            }

            // Saco el descuento de la tarjeta
            let descuentoAplicado = dataTarjetaVIP.tarjeta_VIP.descuento;

            return { message: `Eres usuario VIP, tu descuento para la compra es: ${descuentoAplicado}%` }

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close();
        }
    }
}