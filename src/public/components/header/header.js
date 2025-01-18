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
    // on searchButton click
    const query = searchBar.value.trim(); // get query 
    if (query) { // if query is not empty
      if (window.location.pathname === '/search.html') { // if we are on search page 
        const searchEvent = new CustomEvent('headerSearch', { detail: query });  // create event
        document.dispatchEvent(searchEvent); // dispatch event
      } else {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`; // redirect to search page
      }
    }
  };

  searchButton.addEventListener('click', performSearch); // on searchButton click -> perform search
  
  searchBar.addEventListener('keypress', (e) => { // on ENTER key press -> perform search
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(searchButton);
  
  header.appendChild(logoContainer);
  header.appendChild(searchContainer);

  return header;
};
