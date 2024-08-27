document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back-pagos");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    const dataBoleto = localStorage.getItem('boleto')
    const dataTickets = localStorage.getItem('tickets')
    const objecto = JSON.parse(dataBoleto);
    const objectoT = JSON.parse(dataTickets);
    console.log(objecto);
    console.log("t",objectoT);

    const response = await fetch(`/pelicula/id/${objecto.pelicula_id}`, { method: "GET"});
    if (!response.ok) throw new Error('Error al cargar la película');
    const movie = await response.json();
    console.log("movie: ", movie);

    const movie_cover = document.getElementById("movieCover")
    movie_cover.src = movie.url

    const movie_titule = document.getElementById("movieTitle")
    movie_titule.textContent =  movie.titulo 

    const partes = objecto.fecha.split(', ');
    const fechaParte = partes[1];
    const horaParte = partes[2];

    const movie_date = document.getElementById("movieDate")
    movie_date.textContent = fechaParte

    const movie_time = document.getElementById("movieTime")
    movie_time.textContent = horaParte

    const seat_info = document.getElementById("seatInfo")
    seat_info.textContent = objecto.asiento

    const total_cost = document.getElementById("totalCost")
    total_cost.textContent = `$${objecto.precio}`

    const order_number = document.getElementById("orderNumber")
    order_number.textContent = objecto.order
})


// document.addEventListener('DOMContentLoaded', async function () {
//     const backButton = document.getElementById("back-pagos");
//     if (backButton) {
//         backButton.addEventListener("click", function (event) {
//             event.preventDefault();
//             history.back();
//         });
//     }

//     // Verificar si hay datos en localStorage
//     const dataBoleto = localStorage.getItem('boleto');
//     const ticketsData = localStorage.getItem('tickets');
    
//     if (ticketsData) {
//         // Procesar la data del boleto
//         const objBoleto = JSON.parse(ticketsData);

//         // Obtener las proyecciones de manera concurrente
//         const fetchProyecciones = objBoleto.map(async boleto => {
//             const proyeccionId = boleto.proyeccion_id;
//             try {
//                 const responseProyeccion = await fetch(`/proyeccion/getAll/${proyeccionId}`, { method: "GET" });
//                 if (!responseProyeccion.ok) throw new Error('Error al cargar la proyección');
//                 return await responseProyeccion.json();
//             } catch (error) {
//                 console.error(`Error con proyeccion_id ${proyeccionId}:`, error);
//                 return null; // Devuelve null en caso de error
//             }
//         });
        
//         // Esperamos a que todas las solicitudes de proyección terminen
//         const proyecciones = await Promise.all(fetchProyecciones);
        
//         // Filtrar proyecciones válidas (no null) y extraer `pelicula_id`
//         const peliculaIds = proyecciones
//             .filter(proyeccion => proyeccion && Array.isArray(proyeccion) && proyeccion.length > 0) // Filtra cualquier valor nulo o vacío
//             .flat() // Aplana el array si es un array de arrays
//             .map(proyeccion => proyeccion.pelicula_id);
        
//         const uniquePeliculaIds = [...new Set(peliculaIds)];
        
//         const fetchPeliculas = uniquePeliculaIds.map(async peliculaId => {
//             try {
//                 const responsePelicula = await fetch(`/pelicula/id/${peliculaId}`, { method: "GET" });
//                 if (!responsePelicula.ok) throw new Error('Error al cargar la película');
//                 return await responsePelicula.json();
//             } catch (error) {
//                 console.error(`Error con pelicula_id ${peliculaId}:`, error);
//                 return null; // Devuelve null en caso de error
//             }
//         });
        
//         const peliculas = await Promise.all(fetchPeliculas);
//         const validPeliculas = peliculas.filter(pelicula => pelicula !== null);
        
//         // Asumimos una relación 1:1 entre boleto y película
//         objBoleto.forEach((boleto, index) => {
//             const pelicula = validPeliculas[index];
//             if (pelicula) {
//                 const movie_cover = document.getElementById("movieCover");
//                 if (movie_cover) {
//                     movie_cover.src = pelicula.url;
//                 }
        
//                 const movie_title = document.getElementById("movieTitle");
//                 if (movie_title) {
//                     movie_title.textContent = pelicula.titulo;
//                 }
//             }
        
//             const partes = boleto.fecha_compra.split(', ');
//             const fechaParte = partes[1];
//             const horaParte = partes[2];
        
//             const movie_date = document.getElementById("movieDate");
//             if (movie_date) {
//                 movie_date.textContent = fechaParte;
//             }
        
//             const movie_time = document.getElementById("movieTime");
//             if (movie_time) {
//                 movie_time.textContent = horaParte;
//             }
        
//             const seat_info = document.getElementById("seatInfo");
//             if (seat_info) {
//                 seat_info.textContent = boleto.asiento;
//             }
        
//             const total_cost = document.getElementById("totalCost");
//             if (total_cost) {
//                 total_cost.textContent = `$${boleto.precio}`;
//             }
        
//             const order_number = document.getElementById("orderNumber");
//             if (order_number) {
//                 order_number.textContent = boleto.order;
//             }
//         })


//     } else if (dataBoleto) {
//         // Procesar la data de tickets

//         const objecto = JSON.parse(dataBoleto);
//         console.log(objecto);

//         const response = await fetch(`/pelicula/id/${objecto.pelicula_id}`, { method: "GET"});
//         if (!response.ok) throw new Error('Error al cargar la película');
//         const movie = await response.json();
//         console.log("movie: ", movie);

//         const movie_cover = document.getElementById("movieCover");
//         movie_cover.src = movie.url;

//         const movie_title = document.getElementById("movieTitle");
//         movie_title.textContent = movie.titulo;

//         const partes = objecto.fecha.split(', ');
//         const fechaParte = partes[1];
//         const horaParte = partes[2];

//         const movie_date = document.getElementById("movieDate");
//         movie_date.textContent = fechaParte;

//         const movie_time = document.getElementById("movieTime");
//         movie_time.textContent = horaParte;

//         const seat_info = document.getElementById("seatInfo");
//         seat_info.textContent = objecto.asiento;

//         const total_cost = document.getElementById("totalCost");
//         total_cost.textContent = `$${objecto.precio}`;

//         const order_number = document.getElementById("orderNumber");
//         order_number.textContent = objecto.order;

//         // Limpiar la data después de usarla si es necesario
//         localStorage.removeItem('boleto');
//         // Aquí puedes añadir el código para mostrar la información de los tickets
//         // Por ejemplo, podrías iterar sobre los tickets y mostrarlos en el DOM
//     } else {
//         // Código existente si no hay datos en localStorage
//     }
// });