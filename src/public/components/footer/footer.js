function createFooter() {
  const footer = document.querySelector("footer");

  footer.innerHTML = `

            <a href="https://github.com/simonpotel" class="footer-item" target="_blank">
                <div class="footer-text">
                    <span>Made with</span>
                    <span class="heart">❤️</span>
                    <span>by</span>
                </div>
                <img src="https://avatars.githubusercontent.com/u/155122848?v=4" alt="Simon's profile" class="footer-icon profile-image">
                <span>Simon</span>
            </a>
            <div class="footer-item">
                <span class="footer-icon">🪴</span>
                <div class="eco-popup">
                    <h3>🌱 Eco-Friendly Website</h3>
                    <p>this site minimizes resource usage with optimized API calls and caching</p>
                    <p>movie data and posters are loaded externally and cached for efficiency</p>
                    <p>fewer requests mean a greener web and faster load times!</p>
                </div>
            </div>
    `;
}

document.addEventListener("DOMContentLoaded", createFooter);
