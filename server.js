const express = require("express");
const path = require("path");
//const axios = require('axios');

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
