const connect = require("../../helpers/db/connect")

module.exports = class asiento extends connect{
    static instanceAsiento;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("asientos");
        if (typeof asiento.instanceAsiento === 'object') {
            return asiento.instanceAsiento;
        }
        asiento.instanceAsiento = this;
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

    // Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

    /**
         * This function checks the availability of seats for a specific projection.
         * 
         * @param {Object} object - The object containing the necessary parameters.
         * @param {number} object.proyeccion_id - The ID of the projection.
         * @param {Array<number>} object.asiento_id - An array of seat IDs to check.
         * 
         * @returns {Object|Array<string>} 
         * - If successful, returns an object with the available seats.
         * - If there are errors, returns an object with an 'error' property.
         * - If there are validation errors, returns an array of error messages.
     */
    async checkSeatAvailability(object) {
        try {
            await this.conexion.connect()

            if (!Number.isInteger(object.proyeccion_id)) {
                return { error: 'El valor proyeccion_id debe ser un entero' };
            }
            // let asientosString = [];
            // for (let tipoAsiento of object.asiento_id) {
            //     if (!Number.isInteger(tipoAsiento)) {
            //         asientosString.push(`El asiento #${tipoAsiento} debe ser un entero`);
            //     }
            // }
            
            // if (asientosString.length > 0) {
            //     return asientosString;
            // }

            let dataProyeccion = await this.db.collection("proyecciones").findOne({id: object.proyeccion_id})
            if (!dataProyeccion) {
                return { error: `No existe la proyeccion #${object.proyeccion_id}` }
            }

            let dataAsiento = await this.collection.find({ proyeccion_id: object.proyeccion_id, estado: "disponible" }).toArray();
            if (!dataAsiento.length) {
                return { error: 'No hay asientos disponibles' };
            } else {
                return { disponible: dataAsiento };
            }

            // let availableSeats = [];
            // for (let asientoId of object.asiento_id) {
            //   let dataAsiento = await this.collection.findOne({ id: asientoId });
            //   if (!dataAsiento || dataAsiento.proyeccion_id !== object.proyeccion_id || dataAsiento.estado !== "disponible") {
            //     continue;
            //   }
            //   availableSeats.push(dataAsiento);
            // }
          
            // if (availableSeats.length > 0) {
            //   return { disponibles: availableSeats };
            // } else {
            //     return { error: 'No hay asientos disponibles' };
            // }

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close()
        }
    }
}