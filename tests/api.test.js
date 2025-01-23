const dotenv = require('dotenv'); // 

dotenv.config();

const omdbAPI = require('../src/server/api');

describe('omdbAPI', () => {
    test('search for Guardians of the Galaxy (omdbAPI.searchMovies)', async () => {
        const result = await omdbAPI.searchMovies('Guardians of the Galaxy');

        expect(result).toBeDefined(); // check that the result is not undefined
        expect(result.Response).toBe('True'); // check that the response is True
        expect(Array.isArray(result.Search)).toBe(true); // check that the result is an array
        
        const firstMovie = result.Search[0]; // first movie in the list
        expect(firstMovie).toHaveProperty('Title'); // check that the first movie has a title
        expect(firstMovie).toHaveProperty('Year'); // check that the first movie has a year
        expect(firstMovie).toHaveProperty('imdbID'); // check that the first movie has an imdb id
        expect(firstMovie).toHaveProperty('Poster'); // check that the first movie has a poster
    });

    test('fetch details of Guardians of the Galaxy (omdbAPI.getMovieDetails)', async () => {
        const movieId = 'tt3896198'; // Guardians of the Galaxy Vol. 2
        const result = await omdbAPI.getMovieDetails(movieId);
        
        expect(result).toBeDefined(); // check that the result is not undefined
        expect(result.Response).toBe('True'); // check that the response is True
        expect(result.Title).toContain('Guardians of the Galaxy'); // check that the title of the movie contains "Guardians of the Galaxy"
    });
}); 