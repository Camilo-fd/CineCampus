document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back-pelicula_detalle");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    // Tomamos el id de la pelicula de la vista anterior
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Variable para almacenar el precio total
    let totalPrice = 0;

    // Actualizar la visualización del precio total
    const updateTotalPrice = (price) => {
        const priceElement = document.getElementById('total-price');
        if (priceElement) {
            priceElement.textContent = `$ ${price.toLocaleString('en-US')}`;
        }
    };

    try {
        // Se obtiene las proyecciones mediante el id
        const response = await fetch(`/proyeccion/getAll/${id}`);
        const proyecciones = await response.json();

        // Se almacena las fechas y sus proyecciones
        const uniqueDates = {}; 
        proyecciones.forEach(proyeccion => {
            const isoDate = new Date(proyeccion.fecha).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            if (!uniqueDates[isoDate]) {
                uniqueDates[isoDate] = [];
            }
            uniqueDates[isoDate].push({
                hora: proyeccion.hora,
                id: proyeccion.id,
                precio_boleto: proyeccion.precio_boleto // Almacenamos el precio del boleto
            });
        });

        // Seleccionamos elementos del html
        const daysContainer = document.querySelector('.days');
        const timesContainer = document.querySelector('.times');
        const seatsContainerA = document.querySelector('.seat_A');
        const seatsContainerB = document.querySelector('.seat_B');
        const seatsContainer = document.querySelector('.group__seats');

        daysContainer.innerHTML = '';
        timesContainer.innerHTML = '';
        seatsContainerA.innerHTML = ''; 
        seatsContainerB.innerHTML = ''; 
        seatsContainer.innerHTML = '';

        // Creamos los div de la fecha y la hora, y lo colocamos en el html
        Object.keys(uniqueDates).forEach(isoDate => {
            const dateObj = new Date(isoDate);
            const date = dateObj.getDate();
            const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.dataset.fecha = isoDate;
            dayElement.innerHTML = `<p>${day}</p><p>${date}</p>`;
            daysContainer.appendChild(dayElement);

            const timeWrapper = document.createElement('div');
            timeWrapper.className = 'time-wrapper';
            timeWrapper.dataset.fecha = isoDate;
            timeWrapper.style.display = 'none';

            uniqueDates[isoDate].forEach(({ hora, precio_boleto }) => {
                const timeElement = document.createElement('div');
                timeElement.className = 'time';
                timeElement.dataset.precioBoleto = precio_boleto; // Almacenamos el precio del boleto en el elemento
                timeElement.innerHTML = `<p>${hora}</p><p>${(precio_boleto / 1000).toFixed(2)}k</p>`;
                timeWrapper.appendChild(timeElement);
            });

            timesContainer.appendChild(timeWrapper);
        });

        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', function () {
                const isSelected = this.classList.contains('selected');
                document.querySelectorAll('.day').forEach(d => {
                    d.classList.remove('selected');
                    d.classList.remove('selected-background');
                });
                document.querySelectorAll('.time-wrapper').forEach(wrapper => {
                    wrapper.style.display = 'none';
                });

                if (!isSelected) {
                    this.classList.add('selected');
                    this.classList.add('selected-background');
                    const selectedFecha = this.dataset.fecha;
                    const timeWrapper = document.querySelector(`.time-wrapper[data-fecha="${selectedFecha}"]`);
                    if (timeWrapper) {
                        timeWrapper.style.display = 'flex';
                        timeWrapper.style.flexDirection = 'column';
                        timeWrapper.style.alignItems = 'center';
                    }
                }
            });
        });

        document.querySelectorAll('.time').forEach(time => {
            time.addEventListener('click', async function () {
                const isSelected = this.classList.contains('selected');
                document.querySelectorAll('.time').forEach(t => {
                    t.classList.remove('selected');
                    t.classList.remove('selected-background');
                });
                
                if (!isSelected) {
                    this.classList.add('selected');
                    this.classList.add('selected-background');
                }

                // Obtener la fecha y la hora seleccionadas
                const selectedDay = document.querySelector('.day.selected');
                const selectedDate = selectedDay ? selectedDay.dataset.fecha : '';
                const selectedHour = this.querySelector('p').innerText.trim();

                try {
                    // Encuentra la proyección que coincide con la fecha y hora seleccionadas
                    const proyeccion = proyecciones.find(p => {
                        const isoDate = new Date(p.fecha).toISOString().split('T')[0];
                        return isoDate === selectedDate && p.hora === selectedHour;
                    });
                    
                    if (proyeccion) {
                        const response = await fetch('/asiento/checkSeat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                pelicula_id: id,
                                fecha: proyeccion.fecha,
                                hora: selectedHour
                            })
                        });
                        const data = await response.json();

                        // Limpiar los contenedores de asientos
                        seatsContainerA.innerHTML = '';
                        seatsContainerB.innerHTML = '';
                        seatsContainer.innerHTML = '';

                        if (data.error || !data.disponible || data.disponible.length === 0) {
                            seatsContainerA.innerHTML = `<p>${data.error || 'No hay asientos disponibles para esta función.'}</p>`;
                        } else {
                            data.disponible.forEach(asiento => {
                                const seatElement = document.createElement('div');
                                seatElement.classList.add('seat');
    
                                if (asiento.estado === 'ocupado') {
                                    seatElement.classList.add('ocupado');
                                    seatElement.style.backgroundColor = '#808080';
                                    seatElement.style.pointerEvents = 'none';
                                } else {
                                    seatElement.style.backgroundColor = '#323232';
                                    
                                    // Precio base del asiento
                                    let seatPrice = proyeccion.precio_boleto;

                                    // Incremento del 15% para las filas E y F
                                    if (asiento.numero.startsWith('E') || asiento.numero.startsWith('F')) {
                                        seatPrice *= 1.15;
                                    }

                                    seatElement.dataset.seatPrice = seatPrice; // Almacenamos el precio en el elemento
                                    seatElement.dataset.seatId = asiento.id; // Almacenamos el ID del asiento en el elemento
                                    seatElement.dataset.seatNumber = asiento.numero; // Almacenamos el número completo del asiento en el elemento

                                    seatElement.addEventListener('click', function () {
                                        if (!this.classList.contains('selected')) {
                                            this.style.backgroundColor = 'red';
                                            this.textContent = asiento.numero.replace(/[A-Z]/g, '');
                                            this.classList.add('selected');
                                            totalPrice += parseFloat(this.dataset.seatPrice); // Sumar el precio al total
                                        } else {
                                            this.style.backgroundColor = '#323232';
                                            this.textContent = '';
                                            this.classList.remove('selected');
                                            totalPrice -= parseFloat(this.dataset.seatPrice); // Restar el precio al total
                                        }

                                        updateTotalPrice(totalPrice); // Actualizar la visualización del precio total
                                    });
                                }

                                if (asiento.numero.startsWith('A')) {
                                    seatElement.classList.add('front__seat');
                                    seatsContainerA.appendChild(seatElement);
                                } else if (asiento.numero.startsWith('B')) {
                                    seatElement.classList.add('front__seat');
                                    seatsContainerB.appendChild(seatElement);
                                } else {
                                    seatElement.classList.add('back__seat');
                                    seatsContainer.appendChild(seatElement);
                                }
                            });
                        }

                    } else {
                        seatsContainer.innerHTML = `<p>No se encontró la proyección para la fecha y hora seleccionadas.</p>`;
                    }

                } catch (error) {
                    console.error('Error al obtener los asientos:', error);
                    seatsContainer.innerHTML = `<p>Error al obtener los asientos.</p>`;
                }
            });
        });

        const usuarioId = localStorage.getItem('id')

        const nextButton = document.getElementById("buy");
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                // Obtener la fecha y hora seleccionadas
                const selectedDay = document.querySelector('.day.selected');
                const selectedHourElement = document.querySelector('.time.selected');
                const selectedDate = selectedDay ? selectedDay.dataset.fecha : '';
                const selectedHour = selectedHourElement ? selectedHourElement.querySelector('p').innerText.trim() : '';

                // Encontrar la proyección que coincide con la fecha y la hora seleccionadas
                const proyeccion = proyecciones.find(p => {
                    const isoDate = new Date(p.fecha).toISOString().split('T')[0];
                    return isoDate === selectedDate && p.hora === selectedHour;
                });
                
                // Obtener los asientos seleccionados por ID
                const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'));
                const selectedSeatData = selectedSeats.map(seat => ({
                    id: seat.dataset.seatId,
                    numero: seat.dataset.seatNumber
                }));
                
                const dataAll = {
                    pelicula_id: parseInt(id),
                    proyeccion_id: proyeccion.id,
                    fecha: new Date(),
                    usuario_id: parseInt(usuarioId),
                    asientos: selectedSeatData,
                    total: totalPrice,
                    estado: "pagado"
                };
                localStorage.setItem('boleto', JSON.stringify(dataAll));

                window.location.href = "/pago";
            });
        }

    } catch (error) {
        console.error('Error al obtener las proyecciones:', error);
    }
});