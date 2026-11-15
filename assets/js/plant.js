const plantWrap = document.getElementById('plant-wrap');
const plant = document.getElementById('plant');
const popup = document.getElementById('water-popup');
const can = document.getElementById('watering-can');
const today = new Date().toISOString().slice(0, 10);

let s = JSON.parse(localStorage.getItem('plant') || 'null');
if (!s || s.date !== today) s = { date: today, ml: 0 };

const render = () => {
    plant.textContent =   s.ml >=1000 ? '🌊' : s.ml >= 400 ? '🪴' : s.ml >= 200 ? '🌿' : '🌱';
    popup.innerHTML = '<i class="fa-solid fa-droplet" style="color:var(--accent)"></i> Watered today: <b>' + s.ml + ' ml</b>';
};
render();

// spout tip = rightmost point of the (rotated) can
const spout = () => {
    const r = can.getBoundingClientRect();
    return { x: r.right - 4, y: r.top + r.height * 0.5 };
};

plantWrap.addEventListener('click', () => {
    s.ml += 50;
    localStorage.setItem('plant', JSON.stringify(s));
    render();

    // can slides in and tilts
    document.body.classList.add('watering');
    clearTimeout(can.hideT);
    can.hideT = setTimeout(() => document.body.classList.remove('watering'), 1300);

    // droplet stream from the spout
    clearInterval(can.stream);
    can.stream = setInterval(() => {
        const p = spout();
        const d = document.createElement('i');
        d.className = 'fa-solid fa-droplet drop';
        d.style.left = p.x + (Math.random() * 10 - 5) + 'px';
        d.style.top = p.y + 'px';
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 650);
    }, 90);
    clearTimeout(can.stopT);
    can.stopT = setTimeout(() => clearInterval(can.stream), 1100);

    popup.classList.add('show');
    clearTimeout(popup.t);
    popup.t = setTimeout(() => popup.classList.remove('show'), 2500);
});
