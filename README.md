## Proyecto: CineCampus

## Problemática

CineCampus es una empresa de entretenimiento especializada en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

## Caso 1: Consulta de todas las películas disponibles en el catálogo

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para obtener información detallada de películas junto con sus proyecciones asociadas mediante una operación de agregación.

### Método getAllMovies()

Este método es parte de una clase (`Pelicula`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.

2. **Consulta de agregación:** Se utiliza `this.collection.aggregate([...])` para realizar una operación de agregación en la colección actual (`peliculas`). La operación incluye:
- `$lookup`: Une la colección actual `peliculas` con la colección `proyecciones` usando los campos `id` de películas y `pelicula_id` de proyecciones.
    - `$unwind`: Descompone el arreglo generado por `$lookup` para obtener un documento por cada elemento del arreglo.

3. **Proyección de campos:** Se utiliza `$project` para especificar qué campos devolver en los documentos resultantes, excluyendo `_id` y seleccionando `id`, `titulo`, `genero`, `duracion`, `horarios` y `proyecciones`.

4. **Transformación a array:** Se utiliza `.toArray()` para obtener el resultado de la consulta de agregación como un arreglo de objetos.

5. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Pelicula` (`let objPelicula = new Pelicula()`), y se llama al método `getAllMovies()` utilizando `await` para esperar la resolución de la promesa devuelta por el método

```javascript
let ObjPelicula = new pelicula();
console.log(await ObjPelicula.getAllMovis());
```

### Ejemplo de uso

```javascript
    async getAllMovis(){
        try {
            await this.conexion.connect()

            let dataMovis = await this.collection.aggregate(
                [
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
                      $project: {
                        _id: 0,
                        id: 1,
                        titulo: 1,
                        genero: 1,
                        duracion: 1,
                        horarios: 1,
                        proyecciones: 1
                      }
                    }
                ]
            ).toArray()
            
            return dataMovis

        } catch (error) {
            return { error: error.toString()}
        } finally {
            await this.conexion.close()
        }
    }
```

### Return

```javascript
[
  {
    id: 1,
    titulo: 'Dune: Parte Dos',
    genero: [ 'Ciencia Ficción', 'Aventura' ],
    duracion: 166,
    proyecciones: {
      _id: new ObjectId('66a16932f1e1bd346a230869'),
      id: 1,
      pelicula_id: 1,
      fecha: 2024-07-20T00:00:00.000Z,
      hora: '14:30',
      sala: 1
    }
  },
  {
    id: 2,
    titulo: 'Oppenheimer',
    genero: [ 'Drama', 'Historia' ],
    duracion: 180,
    proyecciones: {
      _id: new ObjectId('66a16932f1e1bd346a23086a'),
      id: 2,
      pelicula_id: 2,
      fecha: 2024-07-15T00:00:00.000Z,
      hora: '15:00',
      sala: 2
    }
  }
]
```



## Caso 2: Obtener Detalles de Película

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para obtener información detallada de una película específica por su ID mediante una operación de agregación.

### Método getMovisId(id)

Este método es parte de una clase (`Pelicula`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Consulta de agregación:** Se utiliza `this.collection.aggregate([...])` para realizar una operación de agregación en la colección actual (`peliculas`). La operación incluye:

- `$match`: Filtra los documentos para encontrar la película con el ID especificado.
- `$project`: Especifica qué campos devolver en los documentos resultantes, seleccionando `id`, `titulo`, `genero`, `duracion`, `horarios` y `sinopsis`.

1. **Transformación a array:** Se utiliza `.toArray()` para obtener el resultado de la consulta de agregación como un arreglo de objetos.
2. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Pelicula` (`let objPelicula = new Pelicula()`), y se llama al método `getMovisId(id)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let ObjPelicula = new pelicula()
console.log(await ObjPelicula.getMovisId(new ObjectId("64b5f1234567890123456789")));
ObjPelicula.destructor()
```

### Ejemplo de uso

```javascript
async getMovisId(id){
    try {
        await this.conexion.connect()

        let dataMovis = await this.collection.aggregate(
            [
                {
                    $match: {
                        _id: id        
                    }
                },
                {
                    $project: {
                        id: 1,
                        titulo: 1,
                        genero: 1,
                        duracion: 1,
                        horarios: 1,
                        sinopsis: 1
                    }
                }
            ]
        ).toArray()

        return dataMovis

    } catch (error) {
        return { error: error.toString() }
    } finally {
        await this.conexion.close()
    }
}
```


### Return

```javascript
[
  {
    _id: new ObjectId('64b5f1234567890123456789'),
    id: 1,
    titulo: 'Dune: Parte Dos',
    genero: [ 'Ciencia Ficción', 'Aventura' ],
    duracion: 166,
    sinopsis: 'Paul Atreides se une a los Fremen en una guerra contra los Harkonnen.'
  }
]
```



## Caso 3: Comprar Boletos

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para realizar la compra de boletos de película. La función verifica diversos aspectos antes de registrar el boleto y el pago correspondiente en la base de datos.

### Método buyTicketMovis(objecto)

Este método es parte de una clase (`Boleto`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Generación de IDs para boleto y pago:** Se obtienen los IDs más recientes de las colecciones `boletos` y `pagos`, respectivamente, y se incrementan en 1 para generar los nuevos IDs.
3. **Verificación de existencia de película y proyección:** Se comprueba que la película y la proyección existan en la base de datos y que la proyección corresponda a la película seleccionada.
4. **Verificación del formato y validez de la fecha de compra:** Se comprueba que la fecha de compra siga el formato `YYYY-MM-DD` y que sea una fecha válida.
5. **Verificación de existencia y rol del usuario:** Se comprueba que el usuario exista, tenga el rol `VIP` y que su membresía VIP no esté vencida.
6. **Verificación de existencia y disponibilidad de asientos:** Se verifica que los asientos existan, estén disponibles y correspondan a la proyección seleccionada.
7. **Cálculo del descuento y precio final:** Se aplica el descuento correspondiente al usuario VIP y se calcula el precio final del boleto.
8. **Inserción del nuevo boleto:** Se inserta el nuevo documento de boleto en la colección `boletos`.
9. **Actualización del estado de los asientos:** Se actualiza el estado de los asientos a "ocupado".
10. **Inserción del nuevo pago:** Se inserta el nuevo documento de pago en la colección `pagos`, si el estado del boleto no es "reservado" o "rechazado".
11. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Boleto` (`let objBoleto = new Boleto()`), y se llama al método `buyTicketMovis(objecto)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let objBoleto = new boleto();
console.log(await objBoleto.buyTicketMovis({
    pelicula_id: 2,
    proyeccion_id: 2,
    fechaCompra: "2025-01-12",
    usuario_id: 1,
    asiento_id: [3],
    precio: 15000,
    estado: "pagado"  
}));
objBoleto.destructor();
```

### Ejemplo de uso

```javascript
    async buyTicketMovis(objecto) {
        try {
            await this.conexion.connect();

            // Genero el nuevo id del boleto
            const [dataBoleto] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdBoleto = dataBoleto.id + 1;

            // Genero el nuevo id del pago
            const [dataPago] = await this.db.collection("pagos").find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdPago = dataPago.id + 1;
            
            // Verifico que exista la pelicula
            let dataPelicula = await this.db.collection("peliculas").findOne({id: objecto.pelicula_id});
            if (!dataPelicula) {
                return { error: "No existe la película que buscas" };
            }
            
            // Verifico si existen proyecciones de la pelicula
            let dataProyeccion = await this.db.collection("proyecciones").findOne({id: objecto.proyeccion_id})
            if (!dataProyeccion) {
                return { error: "No exite proyeccion"}
            }
            if (dataProyeccion.pelicula_id !== objecto.pelicula_id) {
                return { error: "La proyección no corresponde a la película seleccionada" }
            }

            // Verifico el formato de la fecha compra del boleto 
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(objecto.fechaCompra)) {
                return { error: "Formato de fecha incorrecto (YYYY-MM-DD)" };
            }
    
            const [year, month, day] = objecto.fechaCompra.split('-').map(Number);
            const dateFechaCompra = new Date(year, month - 1, day);
            
            if (
                dateFechaCompra.getFullYear() !== year ||
                dateFechaCompra.getMonth() + 1 !== month ||
                dateFechaCompra.getDate() !== day
            ) {
                return { error: "Fecha inválida. Verifica el mes o el día." };
            }

            // Verifico el usuario 
            let dataUsuario = await this.db.collection("usuarios").findOne({id: objecto.usuario_id})
            if (!dataUsuario) {
                return { error: "Usuario no existente" }
            }
            if (dataUsuario.rol !== "vip") {
                return { error: "No es vip" }
            } else if (new Date(dataUsuario.tarjeta_VIP.fecha_expiracion) <= new Date()) {
                return { error: "Membresía vencida" }
            }

            // Verifico que el asiento exista, que esté disponible y que concuerde con la proyección
            for (let asientoId of objecto.asiento_id) {
                let dataAsiento = await this.db.collection("asientos").findOne({id: asientoId});
                if (!dataAsiento) {
                    return { error: `Asiento no existente ${asientoId}` };
                }
                if (dataAsiento.proyeccion_id !== dataProyeccion.id) {
                    return { error: `El asiento ${dataAsiento.id} no corresponde a la proyección seleccionada` };
                }
                if (dataAsiento.estado !== "disponible") {
                    return { error: `El asiento ${dataAsiento} no está disponible` };
                }
            }

            let descuento = objecto.precio * (dataUsuario.tarjeta_VIP.descuento / 100)
            let precioDescuentoAplicado = objecto.precio - descuento

            
            // Nuevo documenbto de boleto
            let nuevoBoleto = {
                id: newIdBoleto,
                proyeccion_id: objecto.proyeccion_id,
                usuario_id: objecto.usuario_id,
                asientos: objecto.asiento_id,
                precio: objecto.precio,
                descuento_aplicado: dataUsuario.tarjeta_VIP.descuento,
                fecha_compra: new Date(objecto.fechaCompra),
                estado: objecto.estado
            }
            
            await this.collection.insertOne(nuevoBoleto)
            
            // Actualizamos el estado del asiento
            for (let asiento of objecto.asiento_id){
                await this.db.collection('asientos').updateOne(
                    {id: asiento},
                    {$set:{estado: "ocupado"}});
              }
            
            // // Nuevo documento de pago
            let nuevoPago = {
                id: newIdPago,
                boleto_id: newIdBoleto,
                pago_total: precioDescuentoAplicado,
                metodo_pago: "efectivo",
                estado: "completado",
            }

            // Inserta el nuevo documento de pago
            if (objecto.estado !== "reservado" || objecto.estado !== "rechazado") {
                await this.db.collection("pagos").insertOne(nuevoPago)
            }

            return { message: "Boleto realizado" }

        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }
```

### Return

```javascript
{ message: 'Boleto realizado' }
```

