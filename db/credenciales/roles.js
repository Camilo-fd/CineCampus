db.createRole({
    role: "estandar",
    privileges: [
      {
        resource: { db: "MongoII", collection: "boletos" },
        actions: ["find", "insert"]
      },
      {
        resource: { db: "MongoII", collection: "pagos" },
        actions: ["find", "insert"]
      },
      {
        resource: { db: "MongoII", collection: "asientos" },
        actions: ["find"]
      },
      {
        resource: { db: "MongoII", collection: "peliculas" },
        actions: ["find"]
      },
      {
        resource: { db: "MongoII", collection: "proyecciones" },
        actions: ["find"]
      }
    ],
    roles: []
})

db.createRole({
    role: "vip",
    privileges: [
      {
        resource: { db: "MongoII", collection: "boletos" },
        actions: ["find", "insert"]
      },
      {
        resource: { db: "MongoII", collection: "pagos" },
        actions: ["find", "insert"]
      },
      {
        resource: { db: "MongoII", collection: "asientos" },
        actions: ["find"]
      },
      {
        resource: { db: "MongoII", collection: "peliculas" },
        actions: ["find"]
      },
      {
        resource: { db: "MongoII", collection: "proyecciones" },
        actions: ["find"]
      }
    ],
    roles: []
})

db.createRole({
    role: "administrador",
    privileges: [
      {
        resource: { db: "MongoII", collection: "boletos" },
        actions: ["find", "insert", "remove"]
      },
      {
        resource: { db: "MongoII", collection: "pagos" },
        actions: ["find", "insert", "remove"]
      },
      {
        resource: { db: "MongoII", collection: "asientos" },
        actions: ["find", "insert", "remove"]
      },
      {
        resource: { db: "MongoII", collection: "peliculas" },
        actions: ["find", "insert", "remove"]
      },
      {
        resource: { db: "MongoII", collection: "proyecciones" },
        actions: ["find", "insert", "remove"]
      },
      {
        resource: { db: "MongoII", collection: "usuarios" },
        actions: ["find", "insert", "remove"]
      }
    ],
    roles: []
})