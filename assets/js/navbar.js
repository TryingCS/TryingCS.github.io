// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function setMenu(open) {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
}

if (hamburger && navMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));

    // Close when any link is followed, including extra pages added by palette.js
    navMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
}

// Set active nav link based on current page
// "/uses", "/uses/" and "/uses/index.html" all normalise to "/uses"; the root to "".
function normalizePath(path) {
    return path.replace(/index\.html$/, '').replace(/\/+$/, '');
}

function setActiveNav() {
    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = normalizePath(link.getAttribute('href')) === currentPath;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setActiveNav);
