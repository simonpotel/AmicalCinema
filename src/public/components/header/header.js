window.createHeader = () => {
  const header = document.createElement("header");

  // logo
  const logoContainer = document.createElement("a");
  logoContainer.href = "./";
  const logo = document.createElement("img");
  logo.src = "/assets/logo.svg";
  logo.alt = "monCine Logo";
  logoContainer.appendChild(logo);

  // search container
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  // search bar
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Rechercher un film";
  searchBar.className = "search-bar";

  // search button (loop icon) in nav
  const searchButton = document.createElement("button");
  searchButton.className = "search-button";
  searchButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `;

  const performSearch = () => {
    const query = searchBar.value.trim();
    if (query) {
      if (window.location.pathname === '/search.html') {
        const searchEvent = new CustomEvent('headerSearch', { detail: query });
        document.dispatchEvent(searchEvent);
      } else {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
      }
    }
  };

  searchButton.addEventListener('click', performSearch);
  
  searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  let searchTimeout;

  const showSuggestion = (movie) => {
    const suggestionContainer = document.createElement('div');
    suggestionContainer.className = 'suggestion-container';
    suggestionContainer.style.cursor = 'pointer';
    suggestionContainer.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title} Poster" />
      <div>
        <h3>${movie.Title}</h3>
        <p>${movie.Plot.substring(0, 100)}...</p>
      </div>
    `;

    suggestionContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `/movie.html?id=${movie.imdbID}`;
    });

    searchContainer.appendChild(suggestionContainer);

    document.addEventListener('click', (e) => {
      if (!suggestionContainer.contains(e.target)) {
        suggestionContainer.remove();
      }
    }, { once: true });
  };

  const checkCacheAndSuggest = async (query) => {
    try {
      const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.Search && data.Search.length > 0) {
        const movieDetails = await fetch(`/api/movies/details?id=${data.Search[0].imdbID}`);
        const movie = await movieDetails.json();
        showSuggestion(movie);
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    }
  };

  searchBar.addEventListener('input', () => {
    const existingSuggestion = searchContainer.querySelector('.suggestion-container');
    if (existingSuggestion) {
      existingSuggestion.remove();
    }
    
    clearTimeout(searchTimeout);
    const query = searchBar.value.trim();
    if (query.length >= 4) {
      searchTimeout = setTimeout(() => {
        checkCacheAndSuggest(query);
      }, 200);
    }
  });

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(searchButton);
  
  header.appendChild(logoContainer);
  header.appendChild(searchContainer);

  return header;
};
