document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back-pagos");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    const dataBoleto = localStorage.getItem('boleto')
    const objecto = JSON.parse(dataBoleto);
    console.log(objecto);

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
    
//     if (dataBoleto) {
//         // Procesar la data del boleto
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
//     } else if (ticketsData) {
//         // Procesar la data de tickets
//         const tickets = JSON.parse(ticketsData);
//         console.log(tickets);

//         // Aquí puedes añadir el código para mostrar la información de los tickets
//         // Por ejemplo, podrías iterar sobre los tickets y mostrarlos en el DOM
//     } else {
//         // Código existente si no hay datos en localStorage
//     }
// });