document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  const movieContent = document.querySelector('.movie-content');
  const loader = document.getElementById('loader');

  if (!movieId) { // if the movie id is not found
    window.location.href = "/"; // redirect to the home page
    return;
  }

  const setContentOrHide = (elementId, content) => { // set the content or hide the element
    const element = document.getElementById(elementId); // get the element
    if (!element) return; // if the element is not found
    
    const section = element.closest('.info-section'); // get the section
    if (!section) return; // if the section is not found
    
    if (content === "N/A" || !content) {
      section.style.display = 'none';
    } else {
      element.textContent = content; // set the content
      section.style.display = ''; // show the section
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // abort the request after 5 seconds

    const response = await fetch(`/api/movies/details?id=${movieId}`, {
      signal: controller.signal
    }); // fetch the movie details
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const movie = await response.json(); // get the movie details

    if (movie.Response === "False") {
      throw new Error("Movie not found in the database");
    }

    if (!document.body.contains(movieContent)) { // if the movie content is not found
      return; // return
    }

    document.getElementById("poster").src = movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg"; // set the poster
    document.getElementById("poster").alt = movie.Title; // set the alt text
    document.getElementById("title").textContent = movie.Title; // set the title

    const metaElements = { // set the meta elements
      year: movie.Year,
      rated: movie.Rated,
      runtime: movie.Runtime
    };

    Object.entries(metaElements).forEach(([id, value]) => {
      const element = document.getElementById(id); // get the element
      if (!element) return;
      
      if (value === "N/A" || !value) {
        element.style.display = 'none'; // hide the element
      } else {
        element.textContent = value; // set the content
        element.style.display = ''; // show the element
      }
    });

    setContentOrHide("plot", movie.Plot);
    setContentOrHide("genre", movie.Genre);
    setContentOrHide("director", movie.Director);
    setContentOrHide("writer", movie.Writer);
    setContentOrHide("actors", movie.Actors);
    setContentOrHide("language", movie.Language);
    setContentOrHide("country", movie.Country);
    setContentOrHide("boxoffice", movie.BoxOffice);
    setContentOrHide("awards", movie.Awards);

    const ratingsContainer = document.getElementById("ratings"); // get the ratings container
    if (ratingsContainer) { // if the ratings container is found
      const ratingsSection = ratingsContainer.closest('.info-section'); // get the ratings section
      if (ratingsSection && movie.Ratings && movie.Ratings.length > 0) { // if the ratings section is found and there are ratings
        ratingsContainer.innerHTML = '';
        movie.Ratings.forEach((rating) => {
          const ratingElement = document.createElement("div"); // create a rating element
          ratingElement.className = "rating-item"; 
          ratingElement.innerHTML = `
            <span class="rating-source">${rating.Source}</span>
            <span class="rating-value">${rating.Value}</span>
          `;
          ratingsContainer.appendChild(ratingElement); // append the rating element
        });
        ratingsSection.style.display = ''; // show the ratings section
      } else if (ratingsSection) { // if the ratings section is found
        ratingsSection.style.display = 'none'; // hide the ratings section
      }
    }

    const additionalInfos = { // set the additional infos
      released: movie.Released,
      dvd: movie.DVD,
      production: movie.Production
    };

    Object.entries(additionalInfos).forEach(([id, value]) => {
      const element = document.getElementById(id); // get the element
      if (!element) return; // if the element is not found
      
      const infoItem = element.closest('.info-item'); // get the info item
      if (!infoItem) return; // if the info item is not found 
      
      if (value === "N/A" || !value) {  
        infoItem.style.display = 'none';
      } else {
        element.textContent = value;
        infoItem.style.display = '';
      }
    });

    const additionalInfoContainer = document.querySelector('.additional-info');
    if (additionalInfoContainer) {
      const additionalInfoSection = additionalInfoContainer.closest('.info-section');
      if (additionalInfoSection) {
        const hasVisibleItems = Array.from(additionalInfoContainer.children).some(
          item => item.style.display !== 'none'
        );
        additionalInfoSection.style.display = hasVisibleItems ? '' : 'none';
      }
    }

    if (loader) {
      loader.style.display = 'none';
    }
    if (movieContent) {
      movieContent.style.display = 'grid';
    }

    gsap.from(".movie-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

  } catch (error) {
    console.error("Error loading movie details:", error);
    const container = document.getElementById("movie-container");
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h2>An error occurred</h2>
          <p>Unable to load movie details.</p>
          <p class="error-details">${error.message}</p>
        </div>
      `;
    }
  }
});
