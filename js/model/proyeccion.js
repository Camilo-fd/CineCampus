import { connect } from "../../helpers/db/connect.js";

export class proyeccion extends connect{
    static instanceProyeccion;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("proyecciones");
        if (typeof proyeccion.instanceProyeccion === 'object') {
            return proyeccion.instanceProyeccion;
        }
        proyeccion.instanceProyeccion = this;
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