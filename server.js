require('dotenv').config();
const express = require("express");
const path = require("path");
//const axios = require('axios');
const omdbAPI = require('./src/server/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'movies.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'search.html'));
});

app.get('/api/movies/search', async (req, res) => {
    try {
        const { query, page } = req.query;
        const results = await omdbAPI.searchMovies(query, page);
        res.json(results);
    } catch (error) {
        console.error('error API:', error);
        res.status(500).json({ error: 'Error when searching movies' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
