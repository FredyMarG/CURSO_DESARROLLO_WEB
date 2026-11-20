// Guía Interactiva — Screen, Scroll e IntersectionObserver

const screenStats = document.getElementById("screenStats");
const observerStatus = document.getElementById("observerStatus");
const scrollContainer = document.getElementById("scrollContainer");
const targetCard = document.getElementById("targetCard");
const seccionObjetivo = document.getElementById("seccionObjetivo");

function renderStats() {
    const data = [
        ["screen.width × height", `${screen.width} × ${screen.height}`],
        ["screen.availWidth × availHeight", `${screen.availWidth} × ${screen.availHeight}`],
        ["screen.colorDepth", `${screen.colorDepth} bits`],
        ["window.scrollX, scrollY", `${Math.round(window.scrollX)}, ${Math.round(window.scrollY)}`]
    ];
    screenStats.innerHTML = "";
    data.forEach(([k, v]) => {
        const div = document.createElement("div");
        div.className = "kv-item";
        const span = document.createElement("span");
        span.textContent = k;
        const strong = document.createElement("strong");
        strong.textContent = v;
        div.append(span, strong);
        screenStats.appendChild(div);
    });
}

window.addEventListener("scroll", renderStats, { passive: true });
renderStats();

document.getElementById("btnScrollBottom").addEventListener("click", () => {
    seccionObjetivo.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("btnScrollTop").addEventListener("click", () => {
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
