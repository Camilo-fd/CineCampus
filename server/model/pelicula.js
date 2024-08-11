const connect = require("../helpers/connect");

module.exports = class pelicula extends connect{
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

    // Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.

    async getAllMovis() {
        try {
            await this.conexion.connect();
    
            let dataMovis = await this.collection.aggregate([
                {
                    $lookup: {
                        from: "proyecciones",
                        localField: "id",
                        foreignField: "pelicula_id",
                        as: "proyecciones"
                    }
                },
                {
                    $unwind: "$proyecciones"
                },
                {
                    $group: {
                        _id: "$id",
                        titulo: { $first: "$titulo" },
                        genero: { $first: "$genero" },
                        duracion: { $first: "$duracion" },
                        horarios: { $first: "$horarios" },
                        proyecciones: { $push: "$proyecciones" },
                        url: { $first: "$url" }
                    }
                },
                {
                    $project: {
                        id: "$_id",
                        titulo: 1,
                        genero: 1,
                        duracion: 1,
                        horarios: 1,
                        proyecciones: 1,
                        url: 1,
                    }
                },
                {
                    $sort: { id: 1 } // Ordenar si es necesario
                }
            ]).toArray();
    
            return dataMovis;
    
        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }
    
    

    // Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.

    async getMovisId({id}) {
        try {
            await this.conexion.connect();
    
            let dataMovis = await this.collection.aggregate(
                [
                    {
                        $match: {
                            id: id      
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            id: 1,
                            titulo: 1,
                            genero: 1,
                            duracion: 1,
                            horarios: 1,
                            sinopsis: 1,
                            video: 1
                        }
                    }
                ]
            ).toArray();
    
            if (dataMovis.length === 0) {
                return { error: "Pelicula no encontrada" };
            } else {
                return dataMovis;
            }
    
        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }
    
}