document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search); // get query params
  const movieId = urlParams.get("id"); // get movie id

  if (!movieId) {
    window.location.href = "/"; // if no movie id, redirect to index page
    return;
  }

  try {
    const response = await fetch(`/api/movies/details?id=${movieId}`);
    const movie = await response.json();

    if (movie.Response === "False") {
      throw new Error("Movie not found in database of the API");
    }

    // global infos
    document.getElementById("poster").src =
      movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg"; // set poster
    document.getElementById("poster").alt = movie.Title; // set poster alt

    document.getElementById("title").textContent = movie.Title; // set title
    document.getElementById("year").textContent = movie.Year; // set year
    document.getElementById("runtime").textContent = movie.Runtime; // set runtime
    document.getElementById("plot").textContent = movie.Plot; // set plot
    document.getElementById("genre").textContent = movie.Genre; // set genre
    document.getElementById("actors").textContent = movie.Actors; // set actors

    // ratings
    const ratingsContainer = document.getElementById("ratings"); // get ratings container
    if (movie.Ratings && movie.Ratings.length > 0) { // if ratings are available
      movie.Ratings.forEach((rating) => { // for each rating
        const ratingElement = document.createElement("div"); // create rating element
        ratingElement.className = "rating-item"; // set class
        ratingElement.innerHTML = `
          <span class="rating-source">${rating.Source}</span>
          <span class="rating-value">${rating.Value}</span>
        `;
        ratingsContainer.appendChild(ratingElement); // append rating element to ratings container
      });
    } else {
      ratingsContainer.textContent = "No rating available"; // if no rating, set text to "No rating available"
    }

    // DVD release date
    const dvdElement = document.getElementById("dvd"); // get dvd element   
    if (movie.DVD && movie.DVD !== "N/A") { // if dvd is available
      const dvdDate = new Date(movie.DVD); // create dvd date
      const formattedDate = dvdDate.toLocaleDateString("fr-FR"); // format dvd date
      dvdElement.textContent = formattedDate; // set dvd date
      dvdTitle.textContent = "Sortie DVD"; // set dvd title
    } else {
      dvdElement.textContent = "N/A"; // if no dvd date, set text to empty
    }

    gsap.from(".movie-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  } catch (error) {
    console.error("Error loading movie:", error);
    document.getElementById("movie-container").innerHTML = `
      <div class="error-message">
        <h2>An error occurred</h2>
        <p>Impossible to load movie details.</p>
      </div>
    `;
  }
});
