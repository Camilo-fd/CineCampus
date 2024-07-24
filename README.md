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

