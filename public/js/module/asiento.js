document.addEventListener('DOMContentLoaded', function()  {
    const back = document.getElementById("back-pelicula_detalle");
    if (back) {
        back.addEventListener("click", function(event) {
            event.preventDefault();
            history.back();
        });
    }

    const day = document.querySelectorAll(".day");  
    day.forEach(days => {
        days.addEventListener("click", () => {
            if (days.style.backgroundColor === 'red') {
                days.style.backgroundColor = '#F8F5F5'; 
                days.style.color = 'black'; 
            } else {
                days.style.backgroundColor = 'red';
                days.style.color = '#F8F5F5';
            }

            const paragraphs = days.querySelectorAll(".day p");
            paragraphs.forEach(p => {
                if (days.style.backgroundColor === 'red') {
                    p.style.backgroundColor = 'red'; 
                    p.style.color = "white"
                } else {
                    p.style.backgroundColor = 'white';
                    p.style.color = "black"
                }
            });
        });
    });

    const times = document.querySelectorAll(".time");

    times.forEach(time => {
        time.addEventListener("click", () => {
            if (time.style.backgroundColor === 'red') {
                time.style.backgroundColor = '#F8F5F5'; 
                time.style.color = 'black';
            } else {
                time.style.backgroundColor = 'red';
                time.style.color = '#F8F5F5'; 
            }

            const paragraphs = time.querySelectorAll(".time p");
            paragraphs.forEach(p => {
                if (time.style.backgroundColor === 'red') {
                    p.style.backgroundColor = 'red'; 
                    p.style.color = "white"
                } else {
                    p.style.backgroundColor = 'white';
                    p.style.color = "black"
                }
            });
        });
    });

    // ---------------------------------------------------------------------

    const price = document.querySelector(".price p:nth-child(2)"); 
    let totalPrice = 0;

    function updatePrice(val) {
        totalPrice += val;
        if (totalPrice < 0) {
            totalPrice = 0;
        }
        price.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function classSeat(seat, price) {
        if (seat.classList.contains('selected')) {
            updatePrice(-price); 
            seat.classList.remove('selected');
        } else {
            updatePrice(price); 
            seat.classList.add('selected');
        }
    }

    function initializeSeats(seatClass, price) {
        const seats = document.querySelectorAll(seatClass);
        
        seats.forEach(seat => {
            seat.setAttribute("price", price);

            seat.addEventListener("click", () => {
                classSeat(seat, price);
            });
        });
    }

    initializeSeats(".front__seat", 5.99);
    initializeSeats(".back__seat", 5.99);
    
    // ---------------------------------------------------------------------

    const frontSeats = document.querySelectorAll('.front__seat');
    const backSeats = document.querySelectorAll('.back__seat');

    // Función para recorrer y mostrar los IDs de los asientos
    function logSeatIds(seats) {
        seats.forEach(seat => {
            console.log(seat.id); // Imprime el ID del asiento
        });
    }

    // Llamar a la función para ambos grupos de asientos
    console.log('Front seats:');
    logSeatIds(frontSeats);

    console.log('Back seats:');
    logSeatIds(backSeats);

    async function loadSeats() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            try {
                const response = await fetch(`/asiento/checkSeat/${id}`, { method: "GET" });
                if (!response.ok) throw new Error('Error al cargar');

                const seatData = await response.json();
                const seatsArray = seatData.disponible;

                // Crear un mapa para los estados de los asientos
                const seatMap = new Map();
                seatsArray.forEach(seat => {
                    seatMap.set(seat.numero, seat.estado);
                });

                // Actualizar el estado de los asientos en el DOM
                document.querySelectorAll('.front__seat, .back__seat').forEach(seatElement => {
                    const seatNumber = seatElement.id;
                    const seatState = seatMap.get(seatNumber);

                    // if (seatState) {
                    //     if (seatState === 'disponible') {
                    //         seatElement.classList.add('available');
                    //         seatElement.classList.remove('unavailable');
                    //     } else if (seatState === 'ocupado') {
                    //         seatElement.classList.add('unavailable');
                    //         seatElement.classList.remove('available');
                    //     }
                    // } else {
                    //     seatElement.classList.remove('available', 'unavailable');
                    // }
                });

            } catch (error) {
                console.error('Se produjo un error:', error);
            }
        } else {
            console.error('No se proporcionó un ID de película.');
        }
    }

    loadSeats();
    
});