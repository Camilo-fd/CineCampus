async function loadMovies() {
    try {
        const response = await fetch('http://localhost:5000/pelicula/all');
        if (!response.ok) throw new Error('Error al cargar las películas');

        const movies = await response.json();
        const carouselContainer = document.getElementById("carrusel");
        const movieTitleElement = document.getElementById("movie-title");
        const movieGenreElement = document.getElementById("movie-genre");

        carouselContainer.innerHTML = '';

        // Verificar si hay duplicados
        const seenUrls = new Set();
        const carouselItems = [];

        movies.forEach((movie) => {
            if (!seenUrls.has(movie.url)) {
                seenUrls.add(movie.url);
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                carouselItem.innerHTML = `
                    <img src="${movie.url}" alt="" class="">
                `;
                carouselContainer.appendChild(carouselItem);
                carouselItems.push({ element: carouselItem, movie });

                // Inicializa la primera película visible
                if (carouselItems.length === 1) {
                    const firstMovie = carouselItems[0].movie;
                    movieTitleElement.textContent = firstMovie.titulo;
                    movieGenreElement.textContent = firstMovie.genero[0];
                }
            }
        });

        // Configura el Intersection Observar
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentItem = carouselItems.find(item => item.element === entry.target);
                    if (currentItem) {
                        const movie = currentItem.movie;
                        movieTitleElement.textContent = movie.titulo;
                        movieGenreElement.textContent = movie.genero[0];
                    }
                }
            });
        }, { threshold: 0.5 }); // Ajusta el umbral según sea necesario

        // Observa todos los elementos del carrusel
        carouselItems.forEach(item => {
            observer.observe(item.element);
        });
    } catch (error) {
        console.error(error);
    }
}


async function MoviesComingSoon() {
    try {
        const response = await fetch('http://localhost:5000/pelicula/all');
        if (!response.ok) throw new Error('Error al cargar las películas');

        const movies = await response.json();
        const carouselContainer = document.getElementById("carrusel-pronto");
        carouselContainer.innerHTML = '';

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
            carouselContainer.appendChild(carouselItem);
        });

    } catch (error) {
        
    }
}



MoviesComingSoon()
loadMovies();






