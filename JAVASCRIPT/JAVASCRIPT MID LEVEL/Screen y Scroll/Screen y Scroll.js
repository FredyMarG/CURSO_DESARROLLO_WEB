// Guía Interactiva — Screen, Scroll e IntersectionObserver

const screenStats = document.getElementById("screenStats"); // Declara e inicializa variable local
const observerStatus = document.getElementById("observerStatus"); // Declara e inicializa variable local
const scrollContainer = document.getElementById("scrollContainer"); // Declara e inicializa variable local
const targetCard = document.getElementById("targetCard"); // Declara e inicializa variable local
const seccionObjetivo = document.getElementById("seccionObjetivo"); // Declara e inicializa variable local

function renderStats() { // Define función reutilizable
    const data = [
        ["screen.width × height", `${screen.width} × ${screen.height}`],
        ["screen.availWidth × availHeight", `${screen.availWidth} × ${screen.availHeight}`],
        ["screen.colorDepth", `${screen.colorDepth} bits`],
        ["window.scrollX, scrollY", `${Math.round(window.scrollX)}, ${Math.round(window.scrollY)}`]
    ];
    screenStats.innerHTML = ""; // Actualiza contenido en el DOM
    data.forEach(([k, v]) => {
        const div = document.createElement("div"); // Declara e inicializa variable local
        div.className = "kv-item";
        const span = document.createElement("span"); // Declara e inicializa variable local
        span.textContent = k; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Declara e inicializa variable local
        strong.textContent = v; // Actualiza contenido en el DOM
        div.append(span, strong);
        screenStats.appendChild(div);
    });
}

window.addEventListener("scroll", renderStats, { passive: true });
renderStats();

document.getElementById("btnScrollBottom").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    seccionObjetivo.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("btnScrollTop").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        targetCard.classList.toggle("visible", entry.isIntersecting);
        observerStatus.className = entry.isIntersecting ? "output ok" : "output";
        observerStatus.textContent = entry.isIntersecting
            ? "Estado: ¡Visible en el viewport del contenedor!"
            : "Estado: Fuera de vista";
    });
}, { root: scrollContainer, threshold: 0.4 });

io.observe(targetCard);

