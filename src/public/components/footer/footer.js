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
            </div>
    `;
}

document.addEventListener("DOMContentLoaded", createFooter);
