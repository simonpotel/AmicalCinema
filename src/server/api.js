const axios = require('axios'); // module pour faire les requêtes HTTP

if (!process.env.OMDB_API_KEY) {
    throw new Error('La clé API OMDB est requise. Veuillez définir la variable d\'environnement OMDB_API_KEY');
} // si la clé API OMDB n'est pas définie, on lance une erreur car requêtes imposibles à l'API

const API_KEY = process.env.OMDB_API_KEY; // récupération de la clé API OMDB via env
const BASE_URL = 'http://www.omdbapi.com/'; // base de l'url de l'API OMBD

class ombdAPI {
    constructor() {
        this.axios = axios.create({
            baseURL: BASE_URL, // base de l'url de l'API OMBD
            params: {
                apikey: API_KEY // clé API OMDB (via env)
            }
        });
    }

    async searchMovies(query, page = 1) {
        // structure d'une requête : BASE_URL + /?apikey=API_KEY&s=query&page=page
        // exemple d'une requête : BASE_URL + /?apikey=API_KEY&s=Guardians of the Galaxy&page=1
        // exemple de returns:
        // {
        //     "Search": [
        //         {
        //             "Title": "Guardians of the Galaxy",
        //             "Year": "2014",
        //             "imdbID": "tt2015381",
        //             "Type": "movie",
        //            "Poster": "https://m.media-amazon.com/images/M/MV5BM2ZmNjQ2MzAtNDlhNi00MmQyLWJhZDMtNmJiMjFlOWY4MzcxXkEyXkFqcGc@._V1_SX300.jpg"
        //            },
        //            {
        //            "Title": "Guardians of the Galaxy Vol. 2",
        //            "Year": "2017",
        //            "imdbID": "tt3896198",
        //            "Type": "movie",
        //            "Poster": "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg"
        //            },...
        //     ],
        //     "totalResults": "2",
        //     "Response": "True"
        // }
        try {
            const response = await this.axios.get('', {
                params: {
                    s: query,
                    page: page
                } // paramètres de la requête
            });
            return response.data; // retourne les données de la requête
        } catch (error) {
            console.error('Erreur lors de la recherche des films:', error);
            throw error;
        }
    }

    async getMovieDetails(imdbId) {
        // BASE_URL + /?apikey=API_KEY&i=imdbId&plot=full
        // exemple de returns:
        //{
        //    "Title": "Guardians of the Galaxy Vol. 2",
        //    "Year": "2017",
        //    "Rated": "PG-13",
        //    "Released": "05 May 2017",
        //    "Runtime": "136 min",
        //    "Genre": "Action, Adventure, Comedy",
        //    "Director": "James Gunn",
        //    "Writer": "James Gunn, Dan Abnett, Andy Lanning",
        //    "Actors": "Chris Pratt, Zoe Saldana, Dave Bautista",
        //    "Plot": "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.",
        //    "Language": "English",
        //    "Country": "United States",
        //    "Awards": "Nominated for 1 Oscar. 15 wins & 60 nominations total",
        //    "Poster": "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
        //    "Ratings": [
        //    {
        //      "Source": "Internet Movie Database",
        //      "Value": "7.6/10"
        //    },
        //    {
        //      "Source": "Rotten Tomatoes",
        //      "Value": "85%"
        //    },
        //    {
        //      "Source": "Metacritic",
        //      "Value": "67/100"
        //    }
        //    ],
        //    "Metascore": "67",
        //    "imdbRating": "7.6",
        //    "imdbVotes": "780,354",
        //    "imdbID": "tt3896198",
        //    "Type": "movie",
        //    "DVD": "N/A",
        //    "BoxOffice": "$389,813,101",
        //    "Production": "N/A",
        //    "Website": "N/A",
        //    "Response": "True"
        //}
        try {
            const response = await this.axios.get('', {
                params: {
                    i: imdbId,
                    plot: 'full'
                } // paramètres de la requête
            });
            return response.data; // retourne les données de la requête
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du film:', error);
            throw error;
        }
    }
}

module.exports = new ombdAPI(); // export de la class ombdAPI
