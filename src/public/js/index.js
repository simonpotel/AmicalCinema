document.addEventListener("DOMContentLoaded", async () => { 
  let currentPage = 1;
  let isLoading = false;

  async function loadFeaturedMovies() {
    try {
      const popularMovies = ["tt13623148", "tt15398776", "tt3896198", "tt5463162"]; 
      const moviesContainer = document.getElementById("featured-movies");

      // request to the API to get the movies
      const moviePromises = popularMovies.map(async (movieId) => {
        const response = await fetch(`/api/movies/details?id=${movieId}`);
        const data = await response.json(); // get the data
        return data; // return the data
      });

      const movies = await Promise.all(moviePromises); // wait for all the movies to be fetched

      movies.forEach((movie) => {
        if (movie && movie.Response !== "False") {
          const movieCard = createMovieCard(movie); // create a movie card
          moviesContainer.appendChild(movieCard); // append the movie card
        }
      });
    } catch (error) {
      console.error("Error loading featured movies:", error); // error
    }
  }

  function createMovieCard(movie) {
    const movieCard = document.createElement("div"); // create a movie card
    movieCard.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg"
      }" alt="${movie.Title}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    movieCard.style.opacity = "0"; // set the opacity
    movieCard.style.transform = "translateY(20px)"; // set the transform  

    movieCard.addEventListener("click", () => {
      window.location.href = `/movie.html?id=${movie.imdbID}`; // redirect to the movie page
    });

    gsap.to(movieCard, {
      opacity: 1, // set the opacity
      y: 0, // set the y
      duration: 0.6, // set the duration
      delay: 0.2, // set the delay
      ease: "power2.out", // set the ease
    });

    return movieCard;
  }

  async function loadRecentMovies() {
    if (isLoading) return;
    
    try {
      isLoading = true; // set the loading state
      const loadMoreButton = document.getElementById("load-more-button");
      loadMoreButton.classList.add("loading"); // add the loading class
      
      const searchTerms = ["love", "man", "day", "night", "world", "life", "girl", "story", "war", "death", "city", "dream", "heart", "time", "journey"];      const searchTerm = searchTerms[currentPage % searchTerms.length];
      const response = await fetch(`/api/movies/search?s=${searchTerm}&type=movie&y=2024&page=1`); // request to the API to get the movies
      const data = await response.json(); // get the data

      if (data.Search && data.Search.length > 0) {
        const recentMoviesContainer = document.getElementById("recent-movies");

        data.Search.forEach((movie) => {
          const movieCard = createMovieCard(movie); // create a movie card
          recentMoviesContainer.appendChild(movieCard); // append the movie card
        });

        currentPage++; // increment the current page
        
        if (currentPage * 10 >= parseInt(data.totalResults)) { // if the current page is greater than the total results
          loadMoreButton.style.display = "none"; // hide the load more button
        }
      } else {
        loadMoreButton.style.display = "none"; // hide the load more button
      }
    } catch (error) {
      console.error("Error loading recent movies:", error);
    } finally {
      isLoading = false; // set the loading state
      const loadMoreButton = document.getElementById("load-more-button");
      loadMoreButton.classList.remove("loading"); // remove the loading class
    }
  }

  loadFeaturedMovies(); // load the featured movies
  
  document.getElementById("load-more-button").addEventListener("click", loadRecentMovies); // add an event listener to the load more button
  loadRecentMovies(); // load the recent movies
});
