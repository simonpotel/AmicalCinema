window.createHeader = () => {
  const header = document.createElement("header");

  // logo
  const logoContainer = document.createElement("a");
  logoContainer.href = "./";
  const logo = document.createElement("img");
  logo.src = "/assets/logo.png";
  logo.alt = "monCine Logo";
  logoContainer.appendChild(logo);

  // search bar
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Rechercher un film";
  searchBar.className = "search-bar";

  header.appendChild(logoContainer);
  header.appendChild(searchBar);

  return header;
};
