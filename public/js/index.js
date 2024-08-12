import { loadMovies, MoviesComingSoon } from './module/pelicula.js';

async function run() {
    try {
        await loadMovies();
        await MoviesComingSoon();
    } catch (error) {
        console.log(error);
    }
}

run();