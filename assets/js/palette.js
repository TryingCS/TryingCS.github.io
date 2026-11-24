/* Ctrl+K command palette. Add new pages to PAGES ONLY. */
(function () {
  const PAGES = [
    { title: "Home",     url: "/",          tags: "index accueil الرئيسية" },
    { title: "Projects", url: "/projects/", tags: "experiments مشاريع" },
    { title: "Uses",     url: "/uses/",     tags: "setup gear hardware" },
    { title: "About",    url: "/about/",    tags: "contact whoami" },
    // future experiment? just add a line:
    // { title: "Pixel Habits", url: "/projects/pixelHabits/", tags: "game habit tracker" },
  ];

  const CSS = `
  #pal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9998;display:none}
  #pal-box{position:fixed;z-index:9999;top:15vh;left:50%;transform:translateX(-50%);
    width:min(600px,92vw);background:#0d1117;color:#e6edf3;border:1px solid #30363d;
    border-radius:10px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.4);display:none}
  #pal-input{width:100%;padding:14px 16px;font-size:16px;background:transparent;border:0;
    border-bottom:1px solid #30363d;color:#e6edf3;outline:none}
  #pal-list{list-style:none;margin:0;padding:6px;max-height:min(320px,60vh);overflow-y:auto}
  #pal-list li{padding:10px 12px;border-radius:6px;cursor:pointer;display:flex;
    justify-content:space-between;gap:12px;align-items:baseline}
  #pal-list li.active{background:rgba(88,166,255,.15)}
  #pal-list .u{font-size:12px;color:#8b949e}
  #pal-empty{padding:16px;color:#8b949e;font-size:14px;display:none}
  #pal-foot{padding:8px 16px;border-top:1px solid #30363d;font-size:12px;color:#8b949e}
  #pal-fab{position:fixed;right:18px;bottom:18px;z-index:9997;width:52px;height:52px;
    border-radius:50%;border:1px solid #30363d;background:#0d1117;color:#e6edf3;font-size:18px;
    display:none;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.35);cursor:pointer}
  @media (pointer:coarse),(max-width:768px){
    #pal-fab{display:flex}
    #pal-box{top:0;left:0;transform:none;width:100vw;border:0;border-radius:0 0 12px 12px}
    #pal-list{max-height:70vh}
    #pal-list li{padding:14px 12px}
  }`;

  const style = document.createElement("style"); style.textContent = CSS;
  const backdrop = document.createElement("div"); backdrop.id = "pal-backdrop";
  const box = document.createElement("div"); box.id = "pal-box";
  box.innerHTML = `<input id="pal-input" type="text" placeholder="Search or jump to…" autocomplete="off">
    <ul id="pal-list"></ul><div id="pal-empty">No match.</div>
    <div id="pal-foot">↑↓ navigate · Enter open · Esc close</div>`;
  const fab = document.createElement("button"); fab.id = "pal-fab";
  fab.setAttribute("aria-label", "Search pages");
  fab.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
  document.head.append(style);
  document.body.append(backdrop, box, fab);

  const input = box.querySelector("#pal-input");
  const list = box.querySelector("#pal-list");
  const empty = box.querySelector("#pal-empty");
  let active = 0, results = [];

  const score = (p, q) => {
    if (!q) return 1;
    const t = p.title.toLowerCase(), u = p.url.toLowerCase(), g = (p.tags || "").toLowerCase();
    if (t.startsWith(q)) return 3;
    if (t.includes(q)) return 2;
    return (u.includes(q) || g.includes(q)) ? 1 : 0;
  };

  function render() {
    const q = input.value.trim().toLowerCase();
    results = PAGES.map(p => [score(p, q), p]).filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0]).map(([, p]) => p);
    list.innerHTML = "";
    results.forEach((p, i) => {
      const li = document.createElement("li");
      const t = document.createElement("span"); t.textContent = p.title;
      const u = document.createElement("span"); u.className = "u"; u.textContent = p.url;
      li.append(t, u);
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
  const open = () => { backdrop.style.display = "block"; box.style.display = "block"; input.value = ""; render(); input.focus(); };
  const close = () => { backdrop.style.display = "none"; box.style.display = "none"; };

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
  fab.addEventListener("click", open);
})();