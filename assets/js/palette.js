/* Ctrl+K command palette. Copy comes from assets/js/i18n.js. */
(function () {
  const t = (key, vars) => window.i18n.t(key, vars);

  // Pages are stored by translation key so their labels follow the language.
  const PAGES = [
    { key: "nav.home",     url: "/" },
    { key: "nav.projects", url: "/projects/" },
    { key: "nav.uses",     url: "/uses/" },
    { key: "nav.about",    url: "/about/" },
  ];

  const CSS = `
  body.pal-open{overflow:hidden}
  #pal-backdrop{position:fixed;inset:0;background:var(--overlay);z-index:9998;display:none}
  #pal-box{position:fixed;z-index:9999;top:15vh;left:50%;transform:translateX(-50%);
    width:min(600px,92vw);background:var(--card-bg);color:var(--text-main);
    border:1px solid var(--navbar-border);border-radius:10px;overflow:hidden;
    box-shadow:0 16px 48px rgba(0,0,0,.35);display:none}
  #pal-input{width:100%;padding:14px 16px;font-size:16px;background:transparent;border:0;
    border-bottom:1px solid var(--navbar-border);color:var(--text-main);outline:none;
    font-family:inherit}
  #pal-input::placeholder{color:var(--text-sub);opacity:.8}
  #pal-list{list-style:none;margin:0;padding:6px;max-height:min(320px,60vh);overflow-y:auto}
  #pal-list li{padding:10px 12px;border-radius:6px;cursor:pointer;display:flex;
    justify-content:space-between;gap:12px;align-items:baseline}
  #pal-list li.active{background:var(--hover-tint)}
  #pal-list .u{font-size:12px;color:var(--text-sub)}
  #pal-empty{padding:16px;color:var(--text-sub);font-size:14px;display:none}
  #pal-foot{padding:8px 16px;border-top:1px solid var(--navbar-border);font-size:12px;color:var(--text-sub)}
  @media (pointer:coarse),(max-width:768px){
    #pal-box{top:0;left:0;transform:none;width:100vw;border:0;border-radius:0 0 12px 12px}
    #pal-list{max-height:70vh}
    #pal-list li{padding:14px 12px}
  }`;

  const style = document.createElement("style"); style.textContent = CSS;
  const backdrop = document.createElement("div"); backdrop.id = "pal-backdrop";
  const box = document.createElement("div"); box.id = "pal-box";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", t("palette.dialog"));
  box.innerHTML = `<input id="pal-input" type="text" placeholder="${t("palette.placeholder")}" autocomplete="off">
    <ul id="pal-list"></ul><div id="pal-empty">${t("palette.noMatch")}</div>
    <div id="pal-foot">${t("palette.hints")}</div>`;
  document.head.append(style);
  document.body.append(backdrop, box);

  // Pages missing from the navbar are otherwise reachable only via Ctrl+K.
  // Mirror them into the mobile menu so phones can discover them too.
  const navMenu = document.querySelector(".nav-menu");
  const norm = (url) => (url || "/").replace(/\/+$/, "") || "/";
  if (navMenu) {
    const navUrls = new Set(
      [...navMenu.querySelectorAll("a.nav-link")].map((a) => norm(a.getAttribute("href")))
    );
    const extra = PAGES.filter((p) => !navUrls.has(norm(p.url)));
    if (extra.length) {
      const label = document.createElement("li");
      label.className = "nav-more-label";
      label.dataset.i18n = "nav.more";
      label.textContent = t("nav.more");
      navMenu.append(label);
      extra.forEach((p) => {
        const li = document.createElement("li");
        li.className = "nav-more";
        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = p.url;
        a.dataset.i18n = p.key;
        a.textContent = t(p.key);
        li.append(a);
        navMenu.append(li);
      });
    }
  }

  const input = box.querySelector("#pal-input");
  const list = box.querySelector("#pal-list");
  const empty = box.querySelector("#pal-empty");
  const foot = box.querySelector("#pal-foot");
  let active = 0, results = [];

  // Search every language: typing "مشاريع" finds Projects in an English UI.
  const score = (page, q) => {
    if (!q) return 1;
    const title = t(page.key).toLowerCase();
    if (title.startsWith(q)) return 3;
    if (title.includes(q)) return 2;
    return window.i18n.every(page.key).join(" ").toLowerCase().includes(q) ? 1 : 0;
  };

  function render() {
    const q = input.value.trim().toLowerCase();
    results = PAGES.map(p => [score(p, q), p]).filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0]).map(([, p]) => p);
    list.innerHTML = "";
    results.forEach((p, i) => {
      const li = document.createElement("li");
      const title = document.createElement("span"); title.textContent = t(p.key);
      const url = document.createElement("span"); url.className = "u"; url.textContent = p.url;
      li.append(title, url);
      li.addEventListener("click", () => location.assign(p.url));
      li.addEventListener("mousemove", () => setActive(i));
      list.appendChild(li);
    });
    empty.style.display = results.length ? "none" : "block";
    setActive(0);
  }
  function setActive(i) {
    if (!list.children.length) return;
    active = i;
    [...list.children].forEach((el, j) => el.classList.toggle("active", j === i));
    list.children[i].scrollIntoView({ block: "nearest" });
  }
  const isOpen = () => box.style.display === "block";
  const open = () => {
    const menu = document.querySelector(".nav-menu");
    const burger = document.querySelector(".hamburger");
    if (menu) menu.classList.remove("active");
    if (burger) { burger.classList.remove("active"); burger.setAttribute("aria-expanded", "false"); }
    backdrop.style.display = "block";
    box.style.display = "block";
    document.body.classList.add("pal-open");
    input.value = "";
    render();
    input.focus();
  };
  const close = () => {
    backdrop.style.display = "none";
    box.style.display = "none";
    document.body.classList.remove("pal-open");
  };

  input.addEventListener("input", render);
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(active + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
    if (e.key === "Enter" && results[active]) location.assign(results[active].url);
  });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); isOpen() ? close() : open(); }
    else if (e.key === "Escape") close();
  });
  backdrop.addEventListener("click", close);
  document.querySelectorAll("[data-palette-open]").forEach(el => el.addEventListener("click", open));

  // Palette chrome is built here, so it needs its own language refresh.
  document.addEventListener("i18n:change", () => {
    const label = t("palette.dialog");
    box.setAttribute("aria-label", label);
    input.placeholder = t("palette.placeholder");
    empty.textContent = t("palette.noMatch");
    foot.textContent = t("palette.hints");
    if (isOpen()) render();
  });
})();
