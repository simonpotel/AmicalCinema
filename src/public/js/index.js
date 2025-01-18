document.addEventListener("DOMContentLoaded", async () => {
  async function loadFeaturedMovies() {
    try {
      const popularMovies = ["Titanic", "Logan", "Oppenheimer"]; // popular movies
      const moviesContainer = document.getElementById("featured-movies");
      //moviesContainer.innerHTML = ""; // clear the movies container before loading new movies (atm doesnt need because we dont reload movies after DOM loaded)

      // request to the API to get the movies
      const moviePromises = popularMovies.map(async (movieTitle) => {
        const response = await fetch(
          `/api/movies/search?query=${encodeURIComponent(movieTitle)}`
        );
        const data = await response.json(); 
        return data.Search?.[0]; // return the first movie of the search
      });

      const movies = await Promise.all(moviePromises); // wait for all the movies to be loaded

      movies.forEach((movie) => { // for each movie
        if (movie) {
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

          movieCard.style.opacity = "0"; // set the opacity to 0
          movieCard.style.transform = "translateY(20px)"; // set the transform to translateY(20px)

          movieCard.addEventListener("click", () => {
            window.location.href = `/search.html?query=${encodeURIComponent(
              movie.Title
            )}`; // redirect to the search page with the movie title
          });

          moviesContainer.appendChild(movieCard); // add the movie card to the movies container

          gsap.to(movieCard, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
          }); // animate the movie card when it's loaded
        }
      });
    } catch (error) {
      console.error("Error while loading movies:", error);
    }
  }

  loadFeaturedMovies(); // load the featured movies on the page
});
