document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    const nombreRecuperado = localStorage.getItem('boleto');
    const objecto = JSON.parse(nombreRecuperado);
    console.log("data: ", objecto);

    const response = await fetch(`/pelicula/id/${objecto.pelicula_id}`, { method: "GET" });
    if (!response.ok) throw new Error('Error al cargar la película');
    const movie = await response.json();
    console.log("pelicula: ", movie);

    const responseUser = await fetch(`/usuario/getUserId/${objecto.usuario_id}`, { method: "GET" });
    if (!responseUser.ok) throw new Error('Error al cargar la película');
    const user = await responseUser.json();
    console.log("usuario: ", user);

    const isoDate = objecto.fecha;
    const date = new Date(isoDate);

    // Opciones de formato para obtener el resultado deseado
    const options = {
        weekday: 'short', // día de la semana abreviado
        day: '2-digit',   // día del mes con dos dígitos
        month: 'short',   // mes abreviado
        year: 'numeric',  // año completo
        hour: '2-digit',  // hora con dos dígitos
        minute: '2-digit',// minutos con dos dígitos
        hour12: false     // formato de 24 horas
    };

    // Convertir la fecha al formato deseado
    const formattedDate = date.toLocaleString('en-GB', options);

    const imagen = document.getElementById("movie-img");
    imagen.src = movie.url;

    const movie_titulo = document.getElementById("movie-titulo");
    movie_titulo.textContent = movie.titulo;

    const movie_genero = document.getElementById("movie-genero");
    movie_genero.textContent = movie.genero;

    const movie_usuario = document.getElementById("movie-usuario");
    movie_usuario.textContent = user.nombre;

    const movie_fecha = document.getElementById("movie-fecha");
    movie_fecha.textContent = formattedDate;

    function generateRandomOrderNumber() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    
    const order_number = document.getElementById("order-number")
    order_number.textContent = generateRandomOrderNumber()

    const numero_asiento = document.getElementById("numero-asiento");
    const asientos = objecto.asientos.map(asiento => asiento.numero).join(', ');
    numero_asiento.textContent = asientos;

    const totalAsientos = objecto.asientos.length;
    const price = document.getElementById("price");
    price.textContent = `$ ${objecto.total} x ${totalAsientos}`;

    const paymentCard = document.getElementById('payment-card');
    const buyTicketButton = document.getElementById('buy-ticket');

    let isButtonVisible = false;

    paymentCard.addEventListener('click', function () {
        // Alternar la visibilidad del botón
        isButtonVisible = !isButtonVisible;
        buyTicketButton.style.display = isButtonVisible ? 'block' : 'none';
    });

    const countdownElement = document.getElementById('countdown');
    let totalSeconds = 0.1 * 60; // 5 minutos en segundos (puedes cambiar esto a cualquier tiempo en segundos)

    function updateCountdown() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Formatear los minutos y segundos
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        // Actualizar el contenido del elemento
        countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

        // Decrementar el total de segundos
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            clearInterval(countdownInterval); // Detener el contador cuando llegue a 0
            alert("Time is up!"); // Mensaje de alerta o cualquier otra acción
        }
    }

    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Inicializar la primera actualización
    updateCountdown();
});
