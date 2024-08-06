const connect = require("../../helpers/db/connect.js");

module.exports = class pago extends connect{
    static instancePago;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("pagos");
        if (typeof pago.instancePago === 'object') {
            return pago.instancePago;
        }
        pago.instancePago = this;
        return this;
    }

    destructor() {
        connect.instanceConnect = undefined;
        // item.instanceItem = undefined;
    }

    async getAllPago(){
        await this.conexion.connect();
        const data = await this.collection.find({}).toArray()
        await this.conexion.close();
        return data
    }
}