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
                id: proyeccion.id
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

            uniqueDates[isoDate].forEach(({ hora }) => {
                const timeElement = document.createElement('div');
                timeElement.className = 'time';
                timeElement.innerHTML = `<p>${hora}</p><p>$5.99</p>`;
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

                        if (data.error) {
                            seatsContainerA.innerHTML = `<p>${data.error}</p>`;
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
                                    seatElement.addEventListener('click', function () {
                                        if (!this.classList.contains('selected')) {
                                            this.style.backgroundColor = 'red';
                                            // Extraer solo el número del asiento
                                            const seatNumber = asiento.numero.replace(/[A-Z]/g, '');
                                            this.textContent = seatNumber;
                                            this.classList.add('selected');
                                        } else {
                                            this.style.backgroundColor = '#323232';
                                            this.textContent = '';
                                            this.classList.remove('selected');
                                        }
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

        const nextButton = document.getElementById("buy")
        if (nextButton) {
            nextButton.addEventListener("click", () => {
                // window.location.href = "/pago"
            });
        }

    } catch (error) {
        console.error('Error al obtener las proyecciones:', error);
    }
});
