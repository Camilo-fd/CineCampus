document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    function mostrarAlerta(mensaje) {
        const alerta = document.getElementById('miAlerta');
        alerta.querySelector('p').textContent = mensaje;
        alerta.classList.remove('oculto');
    }
    
    function ocultarAlerta() {
        document.getElementById('miAlerta').classList.add('oculto');
    }

    const nombreRecuperado = localStorage.getItem('boleto');
    const objecto = JSON.parse(nombreRecuperado);

    const response = await fetch(`/pelicula/id/${objecto.pelicula_id}`, { method: "GET" });
    if (!response.ok) throw new Error('Error al cargar la película');
    const movie = await response.json();

    const responseUser = await fetch(`/usuario/getUserId/${objecto.usuario_id}`, { method: "GET" });
    if (!responseUser.ok) throw new Error('Error al cargar la película');
    const user = await responseUser.json();

    const isoDate = objecto.fecha;
    const date = new Date(isoDate);

    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

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
    let tiempoExpirado = false;

    paymentCard.addEventListener('click', function () {
        if (!tiempoExpirado) {
            isButtonVisible = !isButtonVisible;
            buyTicketButton.style.display = isButtonVisible ? 'block' : 'none';
        } else {
            mostrarAlerta("Lo siento, el tiempo ha expirado. No puedes comprar el boleto.");
        }
    });

    const countdownElement = document.getElementById('countdown');
    let totalSeconds = 5 * 60; 

    function updateCountdown() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
    
        countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    
        if (totalSeconds > 0) {
            totalSeconds--;
        } else {
            clearInterval(countdownInterval);
            tiempoExpirado = true;
            mostrarAlerta("Time is up!");
            buyTicketButton.style.display = 'none';
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    const cerrarAlertaButton = document.getElementById('cerrarAlerta');
    if (cerrarAlertaButton) {
        cerrarAlertaButton.addEventListener('click', ocultarAlerta);
    }

    // Nuevo código para el botón de compra
    buyTicketButton.addEventListener('click', async function() {
        if (!tiempoExpirado) {
            try {
                const asientosId = objecto.asientos.map(asiento => parseInt(asiento.id));
                const hoy = new Date();
                const año = hoy.getFullYear();
                const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
                const dia = String(hoy.getDate()).padStart(2, '0');

                const fechaFormateada = `${año}-${mes}-${dia}`;
                const userData = {
                    pelicula_id: objecto.pelicula_id,
                    proyeccion_id: objecto.proyeccion_id,
                    fechaCompra: String(fechaFormateada),
                    usuario_id: objecto.usuario_id,
                    asiento_id: asientosId,
                    precio: objecto.total,
                    estado: String("pagado")
                };

                const responseBoleto = await fetch('/boleto/ticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (!responseBoleto.ok) {
                    throw new Error('Error en la solicitud');
                }
                const boleto = await responseBoleto.json();
                console.log("Boleto creado:", boleto);
                mostrarAlerta("Boleto comprado con éxito");
            } catch (error) {
                console.error("Error al comprar el boleto:", error);
                mostrarAlerta("Error al comprar el boleto: ");
            }
        } else {
            mostrarAlerta("Lo siento, el tiempo ha expirado. No puedes comprar el boleto.");
        }
    });
});