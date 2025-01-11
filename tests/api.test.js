const dotenv = require('dotenv'); // 

dotenv.config();

const omdbAPI = require('../src/server/api');

describe('omdbAPI', () => {
    test('recherche des Guardians of the Galaxy (omdbAPI.searchMovies)', async () => {
        const result = await omdbAPI.searchMovies('Guardians of the Galaxy');
        
        expect(result).toBeDefined(); // vérifie que le résultat n'est pas undefined
        expect(result.Response).toBe('True'); // vérifie que la réponse est True
        expect(Array.isArray(result.Search)).toBe(true); // vérifie que le résultat est un tableau
        
        const firstMovie = result.Search[0]; // premier film de la liste
        expect(firstMovie).toHaveProperty('Title'); // vérifie que le premier film a un titre
        expect(firstMovie).toHaveProperty('Year'); // vérifie que le premier film a une année
        expect(firstMovie).toHaveProperty('imdbID'); // vérifie que le premier film a un id imdb
        expect(firstMovie).toHaveProperty('Poster'); // vérifie que le premier film a un poster
    });

    test('récupération des détails de Guardians of the Galaxy (omdbAPI.getMovieDetails)', async () => {
        const movieId = 'tt3896198'; // Guardians of the Galaxy Vol. 2
        const result = await omdbAPI.getMovieDetails(movieId);
        
        expect(result).toBeDefined(); // vérifie que le résultat n'est pas undefined
        expect(result.Response).toBe('True'); // vérifie que la réponse est True
        expect(result.Title).toContain('Guardians of the Galaxy'); // vérifie que le titre du film contient "Guardians of the Galaxy"
    });
}); 