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
        // item.instanceItem = undefined;
    }

    async getAll(){
        await this.conexion.connect();
        const data = await this.collection.find({}).toArray()
        await this.conexion.close();
        return data
    }
}