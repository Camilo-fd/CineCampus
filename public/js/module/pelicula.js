import { search } from "./search.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadMovies();
        await MoviesComingSoon();
        await search();
    } catch (error) {
        console.error('Error al cargar las funciones:', error);
    }

    const searchButton = document.getElementById('search');
    const searchInput = document.querySelector('.search-input');

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        searchInput.focus();
    });

    const seeAllButton = document.getElementById('see-all-btn');
    let showingAll = false; // Variable de estado para controlar si se muestran todas las películas

    seeAllButton.addEventListener('click', async () => {
        showingAll = !showingAll;
        if (showingAll) {
            await loadMovies(true);
            seeAllButton.textContent = "See less";
        } else {
            await loadMovies(false);
            seeAllButton.textContent = "See all";
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => {
                nav.classList.remove('active-nav');
                const icon = nav.querySelector('i');
                if (icon) {
                    icon.classList.remove('active-nav');
                }
            });

            this.classList.add('active-nav');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('active-nav');
            }
    });

        const ticketsButton = document.getElementById('tickets');
        const dataBoleto = localStorage.getItem('nombre');
        
        ticketsButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const nombre = dataBoleto
            
            try {
                const response = await fetch(`/boleto/getBoleto/${nombre}`);
                if (!response.ok) throw new Error('Error al obtener los tickets');

                const tickets = await response.json();
                if (tickets.error) throw new Error(tickets.error);

                localStorage.setItem('tickets', JSON.stringify(tickets));

                // Redirigir a la página de confirmación
                window.location.href = "/boletoComprado";

            } catch (error) {
                console.error('Error al obtener los tickets:', error);
            }
        });
    });
});

export async function loadMovies(showAll = false) {
    try {
        const response = await fetch('/pelicula/all', { method: 'GET' });
        if (!response.ok) throw new Error('Error al cargar las películas');

        const movies = await response.json();
        const carrusel = document.getElementById("carrusel");
        const pelicula_titulo = document.getElementById("pelicula-titulo");
        const pelicula_genero = document.getElementById("pelicula-genero");
        const span = document.querySelectorAll('.span');
        const nombre = document.querySelector(".informacion-texto h5");
        carrusel.innerHTML = '';

        let contador = 0;
        const seenUrls = new Set();
        const carouselItems = [];
        
        movies.forEach((movie, index) => {
            if (!seenUrls.has(movie.url) && (showAll || contador < 5)) {
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
                
                contador++; // Incrementa el contador después de añadir una película
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
                                span.classList.add('active');
                            } else {
                                span.classList.remove('active');
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        carouselItems.forEach(item => {
            observer.observe(item.element);
        });
        const nombreData = localStorage.getItem('nombre');
        nombre.innerHTML = `Hi, ${nombreData}`
        nombre.style = "font-size: 1em;"

    } catch (error) {
        console.error(error);
    }
}

export async function MoviesComingSoon() {
    try {
        // const response = await fetch('/pelicula/all', { method: 'GET' });
        // if (!response.ok) throw new Error('Error al cargar las películas');

        // const movies = await response.json();
        // const carrusel_pronto = document.getElementById("carrusel-pronto");
        // carrusel_pronto.innerHTML = '';

        // movies.forEach((movie) => {
        //     const carouselItem = document.createElement('div');
        //     carouselItem.classList.add('pelicula_pronto-caratula-main');
        //     carouselItem.innerHTML = `
        //         <img src="${movie.url}" alt="">
        //         <div class="pelicula-info">
        //             <h3>${movie.titulo}</h3>
        //             <p>${movie.genero[0]}</p>
        //         </div>
        //     `;
        //     carrusel_pronto.appendChild(carouselItem);
        // });

        const response = await fetch('/pelicula/pronto', { method: 'GET' });
        if (!response.ok) throw new Error('Error al cargar las películas');
        const moviesPronto = await response.json();
        
        const movieIds = moviesPronto.map(movie => movie.id);
        
        // Crear una lista de promesas para cada solicitud fetch
        const fetchPromises = movieIds.map(id => 
            fetch(`/pelicula/id/${id}`, { method: 'GET' })
                .then(response => {
                    if (!response.ok) throw new Error(`Error al cargar la película con ID ${id}`);
                    return response.json();
                })
        );
        
        // Ejecutar todas las promesas y esperar a que se resuelvan
        const movies = await Promise.all(fetchPromises);
        
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