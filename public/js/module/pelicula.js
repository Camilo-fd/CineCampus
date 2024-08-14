export async function loadMovies() {
    try {
        const response = await fetch('/pelicula/all');
        if (!response.ok) throw new Error('Error al cargar las películas');

        const movies = await response.json();
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
                const id = movie.id
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
                            if (index === contador) {
                                span.style.backgroundColor = 'red';
                            } else {
                                span.style.backgroundColor = '#ccc';
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
        console.error(error);
    }
}

export async function MoviesComingSoon() {
    try {
        const response = await fetch('/pelicula/all');
        if (!response.ok) throw new Error('Error al cargar las películas');

        const movies = await response.json();
        const carrusel_pronto = document.getElementById("carrusel-pronto");
        carrusel_pronto.innerHTML = '';

        movies.forEach((movie) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('pelicula_pronto-caratula-main');
            carouselItem.innerHTML = `
                <img src="${movie.url}" alt="">
                <div class="pelicula-info">
                    <h3>${movie.titulo}</h3>
                    <p>${movie.genero[0]}</p>
                </div>
            `;
            carrusel_pronto.appendChild(carouselItem);
        });

    } catch (error) {
        console.error(error);
    }
}