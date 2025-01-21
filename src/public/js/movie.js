document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");
  const movieContent = document.querySelector('.movie-content');
  const loader = document.getElementById('loader');

  if (!movieId) {
    window.location.href = "/";
    return;
  }

  const setContentOrHide = (elementId, content) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const section = element.closest('.info-section');
    if (!section) return;
    
    if (content === "N/A" || !content) {
      section.style.display = 'none';
    } else {
      element.textContent = content;
      section.style.display = '';
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`/api/movies/details?id=${movieId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const movie = await response.json();

    if (movie.Response === "False") {
      throw new Error("Movie not found in the database");
    }

    if (!document.body.contains(movieContent)) {
      return;
    }

    document.getElementById("poster").src = movie.Poster !== "N/A" ? movie.Poster : "/assets/placeholder.jpg";
    document.getElementById("poster").alt = movie.Title;
    document.getElementById("title").textContent = movie.Title;

    const metaElements = {
      year: movie.Year,
      rated: movie.Rated,
      runtime: movie.Runtime
    };

    Object.entries(metaElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      if (value === "N/A" || !value) {
        element.style.display = 'none';
      } else {
        element.textContent = value;
        element.style.display = '';
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

    const ratingsContainer = document.getElementById("ratings");
    if (ratingsContainer) {
      const ratingsSection = ratingsContainer.closest('.info-section');
      if (ratingsSection && movie.Ratings && movie.Ratings.length > 0) {
        ratingsContainer.innerHTML = '';
        movie.Ratings.forEach((rating) => {
          const ratingElement = document.createElement("div");
          ratingElement.className = "rating-item";
          ratingElement.innerHTML = `
            <span class="rating-source">${rating.Source}</span>
            <span class="rating-value">${rating.Value}</span>
          `;
          ratingsContainer.appendChild(ratingElement);
        });
        ratingsSection.style.display = '';
      } else if (ratingsSection) {
        ratingsSection.style.display = 'none';
      }
    }

    const additionalInfos = {
      released: movie.Released,
      dvd: movie.DVD,
      production: movie.Production
    };

    Object.entries(additionalInfos).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      const infoItem = element.closest('.info-item');
      if (!infoItem) return;
      
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
