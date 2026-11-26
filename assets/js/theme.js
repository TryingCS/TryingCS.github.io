/* Light/dark theme toggle. Dark stays the default; the choice is remembered. */
(function () {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const current = () => (root.dataset.theme === 'light' ? 'light' : 'dark');

  function apply(theme) {
    if (theme === 'light') {
      root.dataset.theme = 'light';
    } else {
      root.removeAttribute('data-theme');
    }
    const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    btn.setAttribute('aria-pressed', String(theme === 'light'));
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  apply(current());

  btn.addEventListener('click', () => {
    const next = current() === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  });
})();
