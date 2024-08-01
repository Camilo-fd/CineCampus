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
      },
      {
        resource: { db: "MongoII", collection: "usuarios" },
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
      },
      {
        resource: { db: "MongoII", collection: "usuarios" },
        actions: ["find"]
      }
    ],
    roles: []
})

db.createRole({
    role: "administrador",
    privileges: [],
    roles: [
        { role: "dbOwner", db: "MongoII" }
    ]
});