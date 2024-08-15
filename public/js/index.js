import { loadMovies, MoviesComingSoon } from './module/pelicula.js';
import { search } from './module/search.js';

async function run() {
    try {
        await loadMovies();
        await MoviesComingSoon();
        await search();
    } catch (error) {
        console.log(error);
    }
}

run();