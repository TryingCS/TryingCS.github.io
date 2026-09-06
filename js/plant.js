const plantWrap = document.getElementById('plant-wrap');
const plant = document.getElementById('plant');
const popup = document.getElementById('water-popup');
const today = new Date().toISOString().slice(0, 10);

let s = JSON.parse(localStorage.getItem('plant') || 'null');
if (!s || s.date !== today) s = { date: today, ml: 0 }; // resets daily

const render = () => {
    plant.textContent = s.ml >= 400 ? '🪴' : s.ml >= 200 ? '🌿' : '🌱';
    popup.innerHTML = '<i class="fa-solid fa-droplet" style="color:var(--accent)"></i> Watered today: <b>' + s.ml + ' ml</b>';
};
render();

plantWrap.addEventListener('click', e => {
    s.ml += 50; // 50 ml per click
    localStorage.setItem('plant', JSON.stringify(s));
    render();

    const d = document.createElement('i');
    d.className = 'fa-solid fa-droplet drop';
    d.style.left = e.clientX - 6 + 'px';
    d.style.top = e.clientY - 12 + 'px';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 600);

    popup.classList.add('show');
    clearTimeout(popup.t);
    popup.t = setTimeout(() => popup.classList.remove('show'), 2500);
});
