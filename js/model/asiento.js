import { connect } from "../../helpers/db/connect.js";

export class asiento extends connect{
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
}