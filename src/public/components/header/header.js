window.createHeader = () => {
  const header = document.createElement("header");
  // create the header with the logo and the search bar
  header.innerHTML = `
    <a href="./">
      <img src="/assets/logo.svg" alt="monCine Logo">
    </a>
    <div class="search-container">
      <input type="text" placeholder="Search for a movie" class="search-bar">
      <button class="search-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  `;

  const searchBar = header.querySelector(".search-bar");
  const searchButton = header.querySelector(".search-button");

  const performSearch = () => {
    // perform the search
    const query = searchBar.value.trim();
    if (query) {
      // if the query is not empty
      if (window.location.pathname === "/search.html") {
        // if the current page is the search page
        const searchEvent = new CustomEvent("headerSearch", { detail: query }); // create a custom event
        document.dispatchEvent(searchEvent); // dispatch the custom event
      } else {
        window.location.href = `/search.html?query=${encodeURIComponent(
          query
        )}`;
      }
    }
  };

  searchButton.addEventListener("click", performSearch); // add an event listener to the search button
  searchBar.addEventListener("keypress", (e) => {
    // add an event listener to the search bar
    if (e.key === "Enter") {
      // if the key pressed is enter
      performSearch();
    }
  });

  let searchTimeout;

  const showSuggestion = (movie) => {
    // show the suggestion
    const suggestionContainer = document.createElement("div"); // create a div
    suggestionContainer.className = "suggestion-container"; // add a class to the div
    suggestionContainer.style.cursor = "pointer"; // set the cursor to pointer
    suggestionContainer.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title} Poster" />
      <div>
        <h3>${movie.Title}</h3>
        <p>${movie.Plot.substring(
          0,
          100
        )}...</p> // display the plot of the movie
      </div>
    `;

    suggestionContainer.addEventListener("click", (e) => {
      e.stopPropagation(); // stop the event propagation to avoid the click event on the header
      window.location.href = `/movie.html?id=${movie.imdbID}`; // redirect to the movie page
    });

    header.querySelector(".search-container").appendChild(suggestionContainer); // add the suggestion to the search container

    document.addEventListener(
      "click",
      (e) => {
        if (!suggestionContainer.contains(e.target)) {
          suggestionContainer.remove();
        }
      },
      { once: true }
    ); // remove the suggestion when the user clicks outside of it
  };

  const checkCacheAndSuggest = async (query) => {
    // check the cache and suggest the movies
    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}`
      ); // fetch the movies
      const data = await response.json();
      if (data.Search && data.Search.length > 0) {
        const movieDetails = await fetch(
          `/api/movies/details?id=${data.Search[0].imdbID}`
        ); // fetch the movie details
        const movie = await movieDetails.json();
        showSuggestion(movie);
      }
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
  };

  searchBar.addEventListener("input", () => {
    // add an event listener to the search bar
    const existingSuggestion = header.querySelector(
      ".search-container .suggestion-container"
    ); // get the existing suggestion
    if (existingSuggestion) {
      // if the existing suggestion is not null
      existingSuggestion.remove(); // remove the existing suggestion
    }

    clearTimeout(searchTimeout); // clear the timeout
    const query = searchBar.value.trim(); // get the query
    if (query.length >= 4) {
      // if the query is longer than 4 characters
      searchTimeout = setTimeout(() => {
        // set a timeout
        checkCacheAndSuggest(query); // check the cache and suggest the movies
      }, 200); // 200ms delay
    }
  });

  return header;
};
