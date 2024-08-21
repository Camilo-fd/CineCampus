document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById("back-pelicula_detalle");
    if (backButton) {
        backButton.addEventListener("click", function(event) {
            event.preventDefault();
            history.back();
        });
    }

    const days = document.querySelectorAll(".day");  
    days.forEach(day => {
        day.addEventListener("click", () => {
            if (day.style.backgroundColor === 'red') {
                day.style.backgroundColor = '#F8F5F5'; 
                day.style.color = 'black'; 
            } else {
                day.style.backgroundColor = 'red';
                day.style.color = '#F8F5F5';
            }

            const paragraphs = day.querySelectorAll("p");
            paragraphs.forEach(p => {
                if (day.style.backgroundColor === 'red') {
                    p.style.backgroundColor = 'red'; 
                    p.style.color = "white";
                } else {
                    p.style.backgroundColor = 'white';
                    p.style.color = "black";
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

            const paragraphs = time.querySelectorAll("p");
            paragraphs.forEach(p => {
                if (time.style.backgroundColor === 'red') {
                    p.style.backgroundColor = 'red'; 
                    p.style.color = "white";
                } else {
                    p.style.backgroundColor = 'white';
                    p.style.color = "black";
                }
            });
        });
    });

    // ---------------------------------------------------------------------

    const priceElement = document.querySelector(".price p:nth-child(2)"); 
    let totalPrice = 0;

    function updatePrice(val) {
        totalPrice += val;
        if (totalPrice < 0) {
            totalPrice = 0;
        }
        priceElement.textContent = totalPrice.toFixed(2);
    }
    
    const frontSeats = document.querySelectorAll('.front__seat');
    const backSeats = document.querySelectorAll('.back__seat');
    
    // Lista de asientos seleccionados
    const selectedSeats = [];

    async function loadSeats() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
    
        if (id) {
            try {
                const response = await fetch(`/asiento/checkSeat/${id}`, { method: "GET" });
                if (!response.ok) throw new Error('Error loading data');
    
                const seatData = await response.json();
                const seatsArray = seatData.disponible;
    
                // Crear un mapa para los asientos
                const seatMap = new Map();
                seatsArray.forEach(seat => {
                    seatMap.set(seat.numero, seat.estado);
                });
    
                const allSeats = [...frontSeats, ...backSeats];
    
                // Actualizar el estado de los asientos en el DOM
                allSeats.forEach(seatElement => {
                    const seatNumber = seatElement.id;
                    const seatState = seatMap.get(seatNumber);

                    if (seatState === 'disponible') {
                        seatElement.style.backgroundColor = '#323232';
                        seatElement.classList.add('available');
                    } else {
                        seatElement.style.backgroundColor = '#CECECE';
                        seatElement.classList.remove('available');
                        seatElement.classList.add('unavailable');
                    }
                });

                initializeSeats('.available', 5.99);

            } catch (error) {
                console.error('An error occurred:', error);
            }
        } else {
            console.error('No movie ID provided.');
        }
    }

    function classSeat(seat, price) {
        if (seat.classList.contains('selected')) {
            updatePrice(-price); 
            seat.classList.remove('selected');
            seat.style.backgroundColor = '#323232';

            // Elimina el asiento de la lista de asientos seleccionados
            const seatNumber = seat.id;
            const index = selectedSeats.indexOf(seatNumber);
            if (index !== -1) {
                selectedSeats.splice(index, 1);
            }
        } else {
            updatePrice(price); 
            seat.classList.add('selected');
            seat.style.backgroundColor = 'red';

            // Añade el asiento a la lista de asientos seleccionados
            const seatNumber = seat.id;
            selectedSeats.push(seatNumber);
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

    loadSeats();
});