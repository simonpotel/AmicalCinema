document.addEventListener("DOMContentLoaded", async () => {
  const moviesGrid = document.getElementById("movies-grid"); // movies-grid
  let currentQuery =
    new URLSearchParams(window.location.search).get("query") || ""; // query in url
  let currentPage = 1; 
  let isLoading = false; 
  let hasMoreResults = true; // api limit

  const waitForLenis = setInterval(() => {
    if (window.lenis) {
      clearInterval(waitForLenis);
      setupInfiniteScroll();
    }
  }, 100); // wait for lenis to be loaded

  setTimeout(() => {
    const searchBar = document.querySelector(".search-bar");
    if (searchBar && currentQuery) {
      searchBar.value = decodeURIComponent(currentQuery);
    }
  }, 100); // wait for header to be loaded

  if (currentQuery) {
    searchMovies(currentQuery); // search movies
  } // if there is a query, search movies

  document.addEventListener("headerSearch", (e) => {
    handleSearch(e.detail); // handle search
  });

  function handleSearch(query) {
    // handle search
    currentQuery = query; // current query
    currentPage = 1;
    hasMoreResults = true;

    if (query) { // if there is a query, scroll to the top
      const lenis = window.lenis; 
      lenis.scrollTo(0, { // scroll to the top
        duration: 0.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          searchMovies(query, 1);
          updateURL(query);
        } // on complete, update url
      });
    } else {
      moviesGrid.innerHTML = ""; // clear movies grid
    }
  }

  async function searchMovies(query, page = 1) {
    try {
      if (page === 1) { // if page is 1, clear movies grid
        const children = Array.from(moviesGrid.children); // get children
        if (children.length > 0) { // if there are children, animate them
          gsap.to(children, {
            duration: 0.2,
            opacity: 0,
            onComplete: () => {
              moviesGrid.innerHTML = "";
            }
          }); // animate children
          
          await new Promise(resolve => setTimeout(resolve, 200)); // wait for animation to complete to clear movies grid
        } else {
          moviesGrid.innerHTML = ""; // clear movies grid
        }
      }

      isLoading = true;
      
      const requests = [
        fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page * 2 - 1}`),
        fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page * 2}`)
      ]; // fetch two pages of results in parallel 

      const responses = await Promise.all(requests); // wait for all requests to complete
      const results = await Promise.all(responses.map(r => r.json())); // get results

      const combinedMovies = []; // combined movies
      let totalResults = 0; // total results

      results.forEach(data => {
        if (data.Response === "True") {
          combinedMovies.push(...data.Search);
          totalResults = parseInt(data.totalResults);
        }
      }); // combine results

      if (combinedMovies.length > 0) {
        hasMoreResults = page * 20 < totalResults; // check if there are more results

        combinedMovies.forEach((movie, index) => {
          const card = createMovieCard(movie);
          moviesGrid.appendChild(card); // append movie card to movies grid

        });
      } else {
        if (page === 1) {
          moviesGrid.innerHTML = '<p class="no-results">Aucun résultat</p>';
        }
        hasMoreResults = false; // no more results
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      if (page === 1) {
        moviesGrid.innerHTML = '<p class="error">Une erreur est survenue..</p>';
      }
    } finally {
      isLoading = false;
    }
  }

  function createMovieCard(movie) {
    // create movie card
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

  function updateURL(query) {
    // update url with query
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("query", query);
    window.history.pushState({}, "", newUrl);
  }

  function setupInfiniteScroll() {
    const lenis = window.lenis; // get lenis

    lenis.on("scroll", ({ scroll, limit }) => { // on scroll
      const scrollPercentage = (scroll / limit) * 100; // get scroll percentage
      if (scrollPercentage >= 80 && !isLoading && hasMoreResults && currentQuery) { // if scroll percentage is x% and there are more results and there is a query
        currentPage++; // increment current page
        searchMovies(currentQuery, currentPage); // search movies
      }
    });
  }
});
