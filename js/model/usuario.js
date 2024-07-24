import { connect } from "../../helpers/db/connect.js";

export class usuario extends connect{
    static instanceUsuario;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("usuarios");
        if (typeof usuario.instanceUsuario === 'object') {
            return usuario.instanceUsuario;
        }
        usuario.instanceUsuario = this;
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