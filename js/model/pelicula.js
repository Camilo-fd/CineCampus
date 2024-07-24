import { connect } from "../../helpers/db/connect.js";

export class pelicula extends connect{
    static instancePelicula;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("peliculas");
        if (typeof pelicula.instancePelicula === 'object') {
            return pelicula.instancePelicula;
        }
        pelicula.instancePelicula = this;
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