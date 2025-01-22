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
        const data = await response.json();
        return data;
      });

      const movies = await Promise.all(moviePromises);

      movies.forEach((movie) => {
        if (movie && movie.Response !== "False") {
          const movieCard = createMovieCard(movie);
          moviesContainer.appendChild(movieCard);
        }
      });
    } catch (error) {
      console.error("Error loading featured movies:", error);
    }
  }

  function createMovieCard(movie) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg"
      }" alt="${movie.Title}">
      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    movieCard.style.opacity = "0";
    movieCard.style.transform = "translateY(20px)";

    movieCard.addEventListener("click", () => {
      window.location.href = `/movie.html?id=${movie.imdbID}`;
    });

    gsap.to(movieCard, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
    });

    return movieCard;
  }

  async function loadRecentMovies() {
    if (isLoading) return;
    
    try {
      isLoading = true;
      const loadMoreButton = document.getElementById("load-more-button");
      loadMoreButton.classList.add("loading");
      
      const searchTerms = ["love", "man", "day", "night", "world", "life", "girl", "story", "war", "death", "city", "dream", "heart", "time", "journey"];      const searchTerm = searchTerms[currentPage % searchTerms.length];
      const response = await fetch(`/api/movies/search?s=${searchTerm}&type=movie&y=2024&page=1`);
      const data = await response.json();

      if (data.Search && data.Search.length > 0) {
        const recentMoviesContainer = document.getElementById("recent-movies");
        
        data.Search.forEach((movie) => {
          const movieCard = createMovieCard(movie);
          recentMoviesContainer.appendChild(movieCard);
        });

        currentPage++;
        
        if (currentPage * 10 >= parseInt(data.totalResults)) {
          loadMoreButton.style.display = "none";
        }
      } else {
        loadMoreButton.style.display = "none";
      }
    } catch (error) {
      console.error("Error loading recent movies:", error);
    } finally {
      isLoading = false;
      const loadMoreButton = document.getElementById("load-more-button");
      loadMoreButton.classList.remove("loading");
    }
  }

  loadFeaturedMovies();
  
  document.getElementById("load-more-button").addEventListener("click", loadRecentMovies);
  loadRecentMovies();
});
