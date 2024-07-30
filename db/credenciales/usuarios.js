// ------------------ CADENA CONEXION ------------------

// ------ Vip
// mongodb://Ana_García:ana123@monorail.proxy.rlwy.net:45882/MongoII

// ------ ESTANDAR
// mongodb://Carlos_Rodríguez:carlos123@monorail.proxy.rlwy.net:45882/MongoII

// ------ ADMINISTRADOR
// mongodb://Maria_López:maria123@monorail.proxy.rlwy.net:45882/MongoII


// ------------------ INSERTAR ------------------

db.createUser(
	{
        user: "Ana_García",
        pwd: "ana123",
        roles:[
            {role:"vip", db: "MongoII" }
        ]
    }
)

db.createUser(
	{
        user: "Carlos_Rodríguez",
        pwd: "carlos123",
        roles:[
            {role:"estandar", db: "MongoII" }
        ]
    }
)

db.createUser(
	{
        user: "Maria_López",
        pwd: "maria123",
        roles:[
            {role:"administrador", db: "MongoII" }
        ]
    }
)