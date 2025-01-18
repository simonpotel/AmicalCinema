document.addEventListener("DOMContentLoaded", () => {
  const moviesGrid = document.getElementById("movies-grid"); // movies-grid
  let currentQuery =
    new URLSearchParams(window.location.search).get("query") || ""; // query in url

  if (currentQuery) { // we got a query (props we searched from another page)
    const headerSearchBar = document.querySelector("header .search-bar");
    if (headerSearchBar) headerSearchBar.value = currentQuery;
    searchMovies(currentQuery); // search movies
  }

  document.addEventListener("headerSearch", (e) => {
    handleSearch(e.detail); // handle search
  });

  function handleSearch(query) { // handle search
    currentQuery = query; // current query
    if (query) {
      searchMovies(query); // search movies
      updateURL(query); // update url
    } else {
      moviesGrid.innerHTML = ""; // clear movies grid
    }
  }

  async function searchMovies(query) {
    try {
      moviesGrid.innerHTML = ''; // clear movies grid

      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json(); // get data from api

      if (data.Response === "True") { // if we got data
        data.Search.forEach((movie) => 
          moviesGrid.appendChild(createMovieCard(movie)) // create movie card
        );
      } else {
        moviesGrid.innerHTML = 
          '<p class="no-results">Aucun résultat</p>'; // no results
      }
    } catch (error) {
      console.error("Erreur when searching:", error); // error when searching
      moviesGrid.innerHTML = '<p class="error">Error happened..</p>'; // error
    }
  }

  function createMovieCard(movie) { // create movie card 
    const card = document.createElement("div"); // create div
    card.className = "movie-card"; // add class movie-card
    card.innerHTML = `
      <img 
        class="movie-poster" 
        src="${
          movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg" // if poster is not N/A, use poster, else use placeholder
        }" 
        alt="${movie.Title}"
      >
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `/movie.html?id=${movie.imdbID}`; // redirect to movie page on click
    });
    return card;
  }

  function updateURL(query) { // update url with query
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("query", query);
    window.history.pushState({}, "", newUrl);
  }
});
