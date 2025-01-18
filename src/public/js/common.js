let resourcesLoaded = false;

function loadCommonResources() {
  if (resourcesLoaded) return Promise.resolve();
  resourcesLoaded = true;

  const head = document.head;

  // function to initialize resources
  const initializeResources = () => {
    // Google Font Space Grotesk
    const fontsCssLink = document.createElement("link");
    fontsCssLink.rel = "stylesheet";
    fontsCssLink.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap";
    head.appendChild(fontsCssLink);

    // Common CSS for every page
    const commonCssLink = document.createElement("link");
    commonCssLink.rel = "stylesheet";
    commonCssLink.href = "/css/common.css";
    head.appendChild(commonCssLink);

    // add loading class to body (so we got a fluid transition between pages)
    document.body.classList.add('loading');

    Promise.all([
      loadSmoothScroll(), // load smooth scroll
      loadHeader(), // load header
      new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(); // resolve promise
        } else {
          window.addEventListener('load', resolve); // if not complete, wait for load event
        }
      })
    ]).then(() => {
      // everything loaded, remove loading class
      document.body.classList.remove('loading');

      // if we are on search page, get query from url and set it to search bar
      if (window.location.pathname === '/search.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
        if (query) {
          const searchBar = document.querySelector('header .search-bar');
          if (searchBar) {
            searchBar.value = decodeURIComponent(query);
          }
        }
      }
    });
  };

  function loadSmoothScroll() {
    // Smooth Scroll 
    return new Promise((resolve) => {
      const smoothScrollCssLink = document.createElement("link");
      smoothScrollCssLink.rel = "stylesheet";
      smoothScrollCssLink.href = "/components/smoothScroll/smoothScroll.css";
      head.appendChild(smoothScrollCssLink);

      const smoothScrollScript = document.createElement("script");
      smoothScrollScript.src = "/components/smoothScroll/smoothScroll.js";
      smoothScrollScript.onload = () => {
        window.smoothScroll = createSmoothScroll();
        window.lenis = window.smoothScroll.getLenis();
        resolve();
      };
      document.body.appendChild(smoothScrollScript);
    });
  }

  function loadHeader() {
    return new Promise((resolve) => {
      // Header css
      const headerCssLink = document.createElement("link");
      headerCssLink.rel = "stylesheet";
      headerCssLink.href = "/components/header/header.css";
      head.appendChild(headerCssLink);

      // Header js
      const headerScript = document.createElement("script");
      headerScript.src = "/components/header/header.js";
      headerScript.onload = () => {
        const header = createHeader();
        document.body.insertBefore(header, document.body.firstChild);
        resolve();
      };
      document.body.appendChild(headerScript);
    });
  }

  return new Promise((resolve) => {
    initializeResources();
    resolve();
  });
}

window.loadCommonResources = loadCommonResources;

loadCommonResources();
