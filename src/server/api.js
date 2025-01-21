const axios = require('axios'); // module for HTTP requests
const Cache = require('./apiCache'); // cache module for OMBD API
const CACHE_SIZE = process.env.CACHE_SIZE; // cache size max

if (!process.env.OMDB_API_KEY) {
    throw new Error('Please define OMDB_API_KEY');
} // if the key API OMBD is not defined, throw an error

const API_KEY = process.env.OMDB_API_KEY; // key API OMBD
const BASE_URL = 'http://www.omdbapi.com/'; // base URL API OMBD

class ombdAPI {
    constructor() {
        this.axios = axios.create({
            baseURL: BASE_URL, 
            params: {
                apikey: API_KEY 
            }
        });
        this.searchCache = new Cache(CACHE_SIZE);
        this.detailsCache = new Cache(CACHE_SIZE);
    }

    async searchMovies(query, page = 1, onlyCache = false) {
        const cacheKey = `${query}-${page}`;
        
        // check if the query is in the cache
        if (this.searchCache.has(cacheKey)) {
            console.log('CACHE FOUND:', query, page);
            return this.searchCache.get(cacheKey);
        }

        // if onlyCache is true and no cache found, return empty result
        if (onlyCache) {
            console.log('CACHE ONLY - NO RESULTS:', query, page);
            return { Search: [], totalResults: "0", Response: "True" };
        }

        console.log('REQUEST:', query, page);

        // structure of a request : BASE_URL + /?apikey=API_KEY&s=query&page=page
        // exemple of request : BASE_URL + /?apikey=API_KEY&s=Guardians of the Galaxy&page=1
        // exemple of response:
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
                } 
            });
            
            // stock request in cache
            this.searchCache.set(cacheKey, response.data);
            return response.data; // return data of the request
        } catch (error) {
            console.error('Erreur lors de la recherche des films:', error);
            throw error;
        }
    }

    async getMovieDetails(imdbId) {
        // check if the imdbId is in the cache
        if (this.detailsCache.has(imdbId)) {
            console.log('CACHE FOUND:', imdbId);
            return this.detailsCache.get(imdbId);
        }
        console.log('REQUEST:', imdbId);

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
                } 
            });
            
            // store the result in the cache
            this.detailsCache.set(imdbId, response.data);
            return response.data; // return the data of the request
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du film:', error);
            throw error;
        }
    }
}

module.exports = new ombdAPI(); // export class ombdAPI
