export async function search() {
    try {
        const input = document.querySelector(".search-input");

        // Añade un event listener para detectar la tecla Enter
        input.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Previene la acción predeterminada del navegador

                const valueInput = input.value.trim().toLowerCase();

                if (valueInput === '') {
                    // Recargar la página
                    window.location.reload();
                    return;
                }

                // Realiza la búsqueda con el valor del input
                const response = await fetch('/pelicula/all');
                if (!response.ok) throw new Error('Error al cargar las películas');

                const movies = await response.json();
                const filteredMovies = movies.filter(movie =>
                    movie.titulo.toLowerCase().includes(valueInput)
                );

                // Llama a la función para cargar las películas filtradas en el carrusel
                loadFilteredMovies(filteredMovies);
            }
        });
    } catch (error) {
        console.error('Error en la función de búsqueda:', error);
    }
}

function loadFilteredMovies(movies) {
    try {
        const carrusel = document.getElementById("carrusel");
        const pelicula_titulo = document.getElementById("pelicula-titulo");
        const pelicula_genero = document.getElementById("pelicula-genero");
        const span = document.querySelectorAll('.span');
        carrusel.innerHTML = '';

        let contador = 0;
        const seenUrls = new Set();
        const carouselItems = [];
        movies.forEach((movie, index) => {
            if (!seenUrls.has(movie.url)) {
                seenUrls.add(movie.url);
                const id = movie.id;
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                carouselItem.innerHTML = `
                    <img src="${movie.url}" alt="" class="">
                `;
                carouselItem.addEventListener('click', () => {
                    window.location.href = `/pelicula/detalle?id=${id}`;
                });
                carrusel.appendChild(carouselItem);
                carouselItems.push({ element: carouselItem, movie });
            }
        });

        // Muestra el número de puntos igual al número de películas si hay menos de 5
        span.forEach((span, index) => {
            if (index < carouselItems.length) {
                span.style.display = 'inline-block';
            } else {
                span.style.display = 'none';
            }
        });

        let lastVisibleIndex = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentItem = carouselItems.find(item => item.element === entry.target);
                    if (currentItem) {
                        const movie = currentItem.movie;
                        pelicula_titulo.textContent = movie.titulo;
                        pelicula_genero.textContent = movie.genero[0];

                        const newIndex = carouselItems.indexOf(currentItem);
                        if (newIndex !== lastVisibleIndex) {
                            if (newIndex > lastVisibleIndex) {
                                // Avanza
                                contador = (contador + 1) % Math.min(5, carouselItems.length);
                            } else {
                                // Retrocede
                                contador = (contador - 1 + Math.min(5, carouselItems.length)) % Math.min(5, carouselItems.length);
                            }
                            lastVisibleIndex = newIndex;
                        }

                        // Actualizar los punticos
                        span.forEach((span, index) => {
                            if (index < carouselItems.length) {
                                if (index === contador) {
                                    span.style.backgroundColor = 'red';
                                } else {
                                    span.style.backgroundColor = '#ccc';
                                }
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        carouselItems.forEach(item => {
            observer.observe(item.element);
        });

    } catch (error) {
        console.error('Error al cargar las películas filtradas:', error);
    }
}