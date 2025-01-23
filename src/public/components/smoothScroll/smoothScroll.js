class SmoothScroll {
  // class to create a smooth scroll on the page using Lenis and GSAP
  constructor() {
    this.lenis = new Lenis({
      // create a new Lenis instance
      duration: 1.2, // duration of the scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
      direction: "vertical", // direction of the scroll
      gestureDirection: "vertical", // gesture direction of the scroll
      smooth: true, // smooth the scroll
      smoothTouch: false, // smooth the touch scroll
      touchMultiplier: 2, // touch multiplier
    });

    this.init(); // initialize the smooth scroll
  }

  init() {
    this.lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      // add a ticker to the gsap ticker
      this.lenis.raf(time * 1000); // raf is a request animation frame
    });

    gsap.ticker.lagSmoothing(0); // lag smoothing

    this.setupAnchorLinks(); // setup the anchor links
  }

  setupAnchorLinks() {
    // anchor will scroll to the target when clicked
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      // for each anchor link
      anchor.addEventListener("click", (e) => {
        // add an event listener to the anchor link
        e.preventDefault(); // prevent the default behavior
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          this.scrollTo(target); // scroll to the target
        }
      });
    });
  }

  scrollTo(target, options = {}) {
    // scroll to the target with the options
    this.lenis.scrollTo(target, {
      offset: 0, // offset of the scroll
      duration: 1.5, // duration of the scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
      ...options, // options of the scroll
    });
  }

  destroy() {
    this.lenis.destroy(); // destroy the lenis instance
  }

  getLenis() {
    return this.lenis; // return the lenis instance
  }
}

window.createSmoothScroll = function () {
  return new SmoothScroll(); // create a new SmoothScroll instance
};
