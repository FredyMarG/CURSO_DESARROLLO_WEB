// Guía Interactiva — Screen, Scroll e IntersectionObserver

const screenStats = document.getElementById("screenStats"); // Obtiene referencia DOM para "screenStats"
const observerStatus = document.getElementById("observerStatus"); // Obtiene referencia DOM para "observerStatus"
const scrollContainer = document.getElementById("scrollContainer"); // Obtiene referencia DOM para "scrollContainer"
const targetCard = document.getElementById("targetCard"); // Obtiene referencia DOM para "targetCard"
const seccionObjetivo = document.getElementById("seccionObjetivo"); // Obtiene referencia DOM para "seccionObjetivo"

function renderStats() { // Declara función
    const data = [
        ["screen.width × height", `${screen.width} × ${screen.height}`],
        ["screen.availWidth × availHeight", `${screen.availWidth} × ${screen.availHeight}`],
        ["screen.colorDepth", `${screen.colorDepth} bits`],
        ["window.scrollX, scrollY", `${Math.round(window.scrollX)}, ${Math.round(window.scrollY)}`]
    ];
    screenStats.innerHTML = ""; // Actualiza contenido en el DOM
    data.forEach(([k, v]) => { // Instrucción JavaScript
        const div = document.createElement("div"); // Crea nuevo elemento DOM "div"
        div.className = "kv-item"; // Asigna valor
        const span = document.createElement("span"); // Crea nuevo elemento DOM "span"
        span.textContent = k; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Crea nuevo elemento DOM "strong"
        strong.textContent = v; // Actualiza contenido en el DOM
        div.append(span, strong); // Inserta nodo en el DOM
        screenStats.appendChild(div); // Inserta nodo en el DOM
    });
}

window.addEventListener("scroll", renderStats, { passive: true }); // Registra escuchador de eventos
renderStats(); // Ejecuta llamada o método

document.getElementById("btnScrollBottom").addEventListener("click", () => { // Registra escuchador de eventos
    seccionObjetivo.scrollIntoView({ behavior: "smooth", block: "center" }); // Ejecuta llamada o método
});

document.getElementById("btnScrollTop").addEventListener("click", () => { // Registra escuchador de eventos
    window.scrollTo({ top: 0, behavior: "smooth" }); // Ejecuta llamada o método
});

const io = new IntersectionObserver((entries) => { // Define función flecha "io"
    entries.forEach((entry) => { // Instrucción JavaScript
        targetCard.classList.toggle("visible", entry.isIntersecting); // Modifica clases CSS del elemento
        observerStatus.className = entry.isIntersecting ? "output ok" : "output"; // Asigna valor
        observerStatus.textContent = entry.isIntersecting
            ? "Estado: ¡Visible en el viewport del contenedor!"
            : "Estado: Fuera de vista"; // Instrucción JavaScript
    });
}, { root: scrollContainer, threshold: 0.4 }); // Ejecuta llamada o método

io.observe(targetCard); // Ejecuta llamada o método
