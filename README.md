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



## Caso 4: Verificación de Disponibilidad de Asientos

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para verificar la disponibilidad de asientos para una proyección específica. La función valida los datos de entrada, verifica la existencia de la proyección y los asientos, y devuelve una lista de asientos disponibles o un mensaje de error si no hay asientos disponibles.

### Método checkSeatAvailability(object)
Este método es parte de una clase `(Asiento)` que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

**Conexión a la base de datos**: Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.

**Validación de IDs**: Se verifica que `proyeccion_id` sea un entero y que todos los `asiento_id` sean enteros. Si no es así, se retorna un mensaje de error.

**Verificación de existencia de la proyección**: Se comprueba que la proyección exista en la base de datos.

**Verificación de disponibilidad de asientos**: Se verifica la existencia de cada asiento y su correspondencia con la proyección. Se agrega a la lista de asientos disponibles aquellos que estén en estado `"disponible"`.

**Resultado**: Si hay asientos disponibles, se devuelve una lista de estos. Si no, se devuelve un mensaje de error indicando que no hay asientos disponibles.

**Manejo de errores y cierre de conexión**: Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método
Se instancia un objeto de la clase `Asiento (let objAsiento = new Asiento())`, y se llama al método `checkSeatAvailability(objecto)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let objAsiento = new asiento()
console.log(await objAsiento.checkSeatAvailability({
    proyeccion_id: 1,
    asiento_id: [1]
}));
objAsiento.destructor()
```

### Ejemplo de uso

```javascript
async checkSeatAvailability(object) {
        try {
            await this.conexion.connect()

            if (!Number.isInteger(object.proyeccion_id)) {
                return { error: 'El valor proyeccion_id debe ser un entero' };
            }
            let asientosString = [];
            for (let tipoAsiento of object.asiento_id) {
                if (!Number.isInteger(tipoAsiento)) {
                    asientosString.push(`El asiento #${tipoAsiento} debe ser un entero`);
                }
            }
            
            if (asientosString.length > 0) {
                return asientosString;
            }

            let dataProyeccion = await this.db.collection("proyecciones").findOne({id: object.proyeccion_id})
            if (!dataProyeccion) {
                return { error: `No existe la proyeccion #${object.proyeccion_id}` }
            }

            let availableSeats = [];
            for (let asientoId of object.asiento_id) {
                let dataAsiento = await this.collection.findOne({ id: asientoId });
                if (!dataAsiento) {
                    continue;
                }
                if (dataAsiento.proyeccion_id !== object.proyeccion_id) {
                    continue;
                }
                if (dataAsiento.estado === "disponible") {
                    availableSeats.push(`Asiento #${dataAsiento.id}`);
                }
            }
    
            if (availableSeats.length > 0) {
                return {Disponibles: availableSeats};
            } else {
                return { error: 'No hay asientos disponibles' };
            }

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close()
        }
    }
```

### Return

```javascript
{ Disponibles: [ 'Asiento #1' ] }
```



## Caso 5: Reserva de Asientos

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para reservar asientos para una proyección específica. La función valida los datos de entrada, verifica la existencia de la proyección, el usuario y los asientos, y actualiza el estado de los asientos a "reservado" si están disponibles.

### Método reserveSeats(objecto)

Este método es parte de una clase `(Asiento)` que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Generación de ID de boleto:** Se obtiene el último ID de boleto de la colección `asientos` y se genera un nuevo ID incrementando en 1. Si no hay boletos, se empieza con el ID 1.
3. **Verificación de existencia de la proyección:** Se comprueba que la proyección exista en la base de datos.
4. **Verificación de existencia del usuario:** Se comprueba que el usuario exista en la base de datos.
5. **Verificación de disponibilidad de asientos:** Se verifica la existencia de cada asiento y su correspondencia con la proyección, y se asegura de que estén en estado `"disponible"`.
6. **Actualización del estado de los asientos:** Si todos los asientos están disponibles, se actualiza su estado a `"reservado"`.
7. **Inserción de la reserva:** Se crea un nuevo documento de reserva con la información proporcionada y se inserta en la colección `asientos`.
8. **Resultado:** Si los asientos se reservan con éxito, se devuelve un mensaje de éxito y los asientos reservados. Si no, se devuelve un mensaje de error indicando que no hay suficientes asientos disponibles.
9. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Asiento` (`let objAsiento = new Asiento()`), y se llama al método `reserveSeats(objecto)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let objBoleto = new boleto();
console.log(await objBoleto.reserveSeats({
    proyeccion_id: 1,
    usuario_id: 1,
    asiento_id: [1, 7],
    estado: "reservado"
}));
objBoleto.destructor()
```

### Ejemplo de uso

```javascript
async reserveSeats(objecto) {
    try {
        await this.conexion.connect();

        // Genero el nuevo id del boleto
        const [dataBoleto] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
        const newIdBoleto = dataBoleto ? dataBoleto.id + 1 : 1;

        // Verifico si existe la proyección
        let dataProyeccion = await this.db.collection("proyecciones").findOne({ id: objecto.proyeccion_id });
        if (!dataProyeccion) {
            return { error: "No existe la proyección" };
        }

        // Verifico si existe el usuario
        let dataUsuario = await this.db.collection("usuarios").findOne({ id: objecto.usuario_id });
        if (!dataUsuario) {
            return { error: "Usuario no existente" };
        }

        // Verifico si existen los asientos de la proyección y si están disponibles
        let availableSeats = [];
        for (let asiento of objecto.asiento_id) {
            let dataAsiento = await this.db.collection("asientos").findOne({
                id: asiento,
                proyeccion_id: objecto.proyeccion_id
            });

            if (!dataAsiento) {
                return { error: `El asiento #${asiento} no existe para la proyección` };
            }

            if (dataAsiento.estado === "disponible") {
                availableSeats.push(`Asiento #${dataAsiento.id}`);
            }
        }

        // Actualizo el estado a reservado de los asientos
        if (availableSeats.length === objecto.asiento_id.length) {
            for (let asiento of objecto.asiento_id) {
                await this.db.collection("asientos").updateOne(
                    { id: asiento, proyeccion_id: objecto.proyeccion_id },
                    { $set: { estado: "reservado" } }
                );
            }

            // Nuevo documento de reserva
            let nuevoReserva = {
                id: newIdBoleto,
                proyeccion_id: objecto.proyeccion_id,
                usuario_id: objecto.usuario_id,
                asientos: objecto.asiento_id,
                estado: "reservado"
            }

            // Inserta el nuevo documento de reserva
            await this.collection.insertOne(nuevoReserva);

            return { 
                message: 'Asientos reservados con éxito', 
                Reservados: availableSeats 
            };

        } else {
            return { error: 'No hay suficientes asientos disponibles' };
        }

    } catch (error) {
        return { error: error.toString() };
    } finally {
        await this.conexion.close();
    }
}
```



## Caso 6: Cancelación de Reservación de Asientos

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para cancelar una reserva de asientos para una proyección específica. La función valida la existencia de la reserva, verifica que esté en estado "reservado" y actualiza el estado de los asientos a "disponible" antes de eliminar la reserva de la base de datos.

### Método cancelSeatReservation(objecto)

Este método es parte de una clase (`Boleto`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Verificación de existencia de la reserva:** Se comprueba que la reserva exista en la base de datos utilizando el ID del boleto proporcionado.
3. **Verificación del estado de la reserva:** Se asegura de que la reserva esté en estado `"reservado"` antes de proceder a la cancelación.
4. **Actualización del estado de los asientos:** Se actualiza el estado de cada asiento a` "disponible"` si están asociados con la reserva.
5. **Eliminación de la reserva:** Se elimina el documento de la reserva de la base de datos.
6. **Resultado:** Se devuelve un mensaje indicando que la reserva ha sido cancelada con éxito, o un mensaje de error si la reserva no se puede cancelar.
7. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Boleto` (`let objBoleto = new Boleto()`), y se llama al método `cancelSeatReservation(objecto)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let objBoleto = new boleto();
console.log(await objBoleto.cancelSeatReservation({
    boleto_id: 6
}));
objBoleto.destructor()
```

### Ejemplo de uso

```javascript
async cancelSeatReservation(objecto) {
    try {
        await this.conexion.connect()

        let dataBoleto = await this.collection.findOne({id: objecto.boleto_id});
        if (!dataBoleto) {
            return { error: "Reserva no encontrada" };
        }

        if (dataBoleto.estado === "reservado") {
            for (let asiento of dataBoleto.asientos) {
                await this.db.collection("asientos").updateOne(
                    { id: asiento, proyeccion_id: dataBoleto.proyeccion_id },
                    { $set: { estado: "disponible" } }
                );
            }
        } else {
            return { error: "No se puede cancelar una reserva que no esté en estado reservado" };
        }

        await this.collection.deleteOne({ id: objecto.boleto_id });

        return "Cancelada la reserva"

    } catch (error) {
        return { error: error.toString() }
    } finally {
        await this.conexion.close();
    }
}
```

### Return

```javascript
{ message: "Cancelada la reserva" }
```



## Caso 7: Verificar Tarjeta VIP

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para aplicar descuentos a un usuario con tarjeta VIP. La función verifica si el usuario existe, si tiene una tarjeta VIP, y si la tarjeta no ha expirado. Si todas las condiciones se cumplen, devuelve el porcentaje de descuento aplicado.

### Método verifyVIPCard(usuario_id)

Este método es parte de una clase (`Boleto`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Verificación de existencia del usuario:** Se comprueba que el usuario exista en la base de datos utilizando el ID del usuario proporcionado.
3. **Verificación de tarjeta VIP:** Se asegura de que el usuario tenga una `tarjeta_VIP` y que no esté expirada.
4. **Resultado:** Se devuelve un mensaje indicando el porcentaje de descuento si el usuario tiene una tarjeta VIP válida, o mensajes de error si alguna de las condiciones no se cumple.
5. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Boleto` (`let objBoleto = new Boleto()`), y se llama al método `verifyVIPCard(usuario_id)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript
let objBoleto = new boleto();
console.log(await objBoleto.verifyVIPCard(1));
objBoleto.destructor()
```

### Ejemplo de uso

```javascript
async verifyVIPCard(usuario_id) {
    try {
        await this.conexion.connect()

        // Verifico que exista el usuario
        let dataTarjetaVIP = await this.db.collection("usuarios").findOne({ id: usuario_id});
        if (!dataTarjetaVIP) {
            return { message: "No existe usuario" };
        }

        // Verifico que tenga tarjeta VIP
        if (!dataTarjetaVIP.tarjeta_VIP) {
            return { message: "No eres usuario con tarjeta VIP" };
        }

        // Verifico que la tarjeta VIP no haya caducado
        if (dataTarjetaVIP.tarjeta_VIP.fecha_expiracion < new Date()) {
            return { message: "La tarjeta VIP caducó" };
        }

        // Saco el descuento de la tarjeta
        let descuentoAplicado = dataTarjetaVIP.tarjeta_VIP.descuento;

        return { message: `Eres usuario VIP, tu descuento para la compra es: ${descuentoAplicado}%` }

    } catch (error) {
        return { error: error.toString() }
    } finally {
        await this.conexion.close();
    }
}
```

### Return 

```javascript
{ message: 'Eres usuario VIP, tu descuento para la compra es: 10%' }
```



## Caso 8: Crear Usuario

### Descripción

Este código muestra un método asíncrono en JavaScript que utiliza MongoDB para crear un nuevo usuario en la base de datos. La función valida la existencia de un usuario con el mismo nombre o email, valida la estructura del email, y crea un nuevo usuario con diferentes tipos de roles: VIP, estándar o administrador.

### Método newUser(objecto)

Este método es parte de una clase (`Usuario`) que interactúa con la base de datos MongoII. La función realiza las siguientes operaciones:

1. **Conexión a la base de datos:** Se utiliza `await this.conexion.connect()` para establecer la conexión antes de ejecutar consultas.
2. **Generación de IDs:** Se genera un nuevo ID para el usuario y un nuevo número para la tarjeta VIP, si corresponde, utilizando el ID máximo actual en la colección.
3. **Validación de existencia del nombre y email:** Se verifica que el nombre y el email proporcionados no estén ya en uso en la base de datos.
4. **Validación del email:** Se comprueba que el email tenga una estructura válida utilizando una expresión regular.
5. **Creación de fecha de expiración:** Se establece la fecha de expiración de la tarjeta VIP a un año a partir de la fecha actual.
6. **Creación del nuevo usuario:** Dependiendo del rol proporcionado en `objecto.rol`, se crea un nuevo documento de usuario en la base de datos con los detalles correspondientes:
   - **VIP:** Incluye información de la tarjeta VIP con descuento.
   - **Estándar y Administrador:** Sin información de tarjeta VIP.
7. **Inserción del usuario:** Se inserta el nuevo usuario en la colección correspondiente de la base de datos.
8. **Resultado:** Se devuelve un mensaje indicando que el usuario se creó correctamente, o un mensaje de error si alguna de las validaciones falla.
9. **Manejo de errores y cierre de conexión:** Se utiliza un bloque `try-catch-finally` para manejar errores y asegurar que la conexión a la base de datos se cierre correctamente después de ejecutar la consulta.

### Uso del método

Se instancia un objeto de la clase `Usuario` (`let objUsuario = new Usuario()`), y se llama al método `newUser(objecto)` utilizando `await` para esperar la resolución de la promesa devuelta por el método.

```javascript

let objUsuario = new usuario();
console.log(await objUsuario.newUser({
    nombre: "Miguel_Castro",
    email: "miguel_papu@gmail.com",
    contraseña: "javascript",
    rol: "estandar"
}));
```

### Ejemplo de uso

```javascript
async newUser(objecto) {
        try {
            await this.conexion.connect()

            // Genero el nuevo id del usuario
            const [dataUsuario] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdUsuario = dataUsuario.id + 1;

            // Genero el nuevo numero de la tarjeta VIP
            const dataNumeroVip = await this.collection.find({}).sort({ tarjeta_VIP: -1 }).limit(1).toArray();
            const numeroVip = dataNumeroVip[0].tarjeta_VIP.numero + 1

            // Valido que el nombre no exita
            const nombreExiste = await this.collection.findOne({ nombre: objecto.nombre });
            if (nombreExiste) {
                return { error: "El nombre de usuario ya existe." }
            }

            // Valido que el email no exita
            const emailExiste = await this.collection.findOne({ email: objecto.email });
            if (emailExiste) {
                return { error: "El email ya está en uso." }
            }

            // Valido que el email sea correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(objecto.email)) {
                throw new Error("El email ingresado no tiene una estructura válida.");
            }

            // Creo la fecha expiracion 
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

            // Creo el nuevo usuario VIP
            let nuevoUsuarioVip = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
                tarjeta_VIP: {
                    fecha_expiracion: fechaExpiracion,
                    numero: numeroVip,
                    descuento: 10
                }
            }

            // Creo el nuevo usuario estandar
            let nuevoUsuarioEstandar = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
            }

            // Creo el nuevo usuario administrador
            let nuevoUsuarioAdministrador = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
            }

            // Inserto el nuevo usuario en la base de datos según el rol
            if (objecto.rol === "vip") {
                await this.collection.insertOne(nuevoUsuarioVip)
            } else if (objecto.rol === "estandar") {
                await this.collection.insertOne(nuevoUsuarioEstandar)
            } else if (objecto.rol === "administrador") {
                await this.collection.insertOne(nuevoUsuarioAdministrador)
            } 

            return { message: "Usuario creado correctamente"}

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close()
        }
    }
```

### Return

```javascript
{ message: "Usuario creado correctamente"}
```

