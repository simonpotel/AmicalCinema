function loadCommonResources() {
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

    loadSmoothScroll().then(loadHeader);
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

  initializeResources(); // load the common resources on the page
}

document.addEventListener("DOMContentLoaded", loadCommonResources); // after DOM loaded, load the common resources
