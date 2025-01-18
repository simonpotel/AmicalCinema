document.addEventListener("DOMContentLoaded", async () => {
  async function loadFeaturedMovies() {
    try {
      const popularMovies = ["tt31433814", "tt1431045", "tt3896198"]; // Oppenheimer, Deadpool, Guardians of the Galaxy Vol. 2
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

          moviesContainer.appendChild(movieCard);

          gsap.to(movieCard, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
          });
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des films:", error);
    }
  }

  loadFeaturedMovies();
});
