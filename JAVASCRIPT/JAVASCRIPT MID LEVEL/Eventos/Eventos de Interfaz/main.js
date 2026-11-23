// Guía Interactiva — Eventos de Interfaz

const selectInput = document.getElementById("selectInput");
const selectOutput = document.getElementById("selectOutput");
const resizeOutput = document.getElementById("resizeOutput");
const scrollBox = document.getElementById("scrollBox");
const scrollOutput = document.getElementById("scrollOutput");
const demoImg = document.getElementById("demoImg");
const imgStatus = document.getElementById("imgStatus");

selectInput.addEventListener("select", (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const texto = e.target.value.slice(start, end);
    selectOutput.textContent = `Seleccionado (${start}..${end}): "${texto}"`; // Actualiza contenido en el DOM
});

function actualizarViewport() {
    resizeOutput.textContent = `Viewport: ${window.innerWidth}px × ${window.innerHeight}px`; // Actualiza contenido en el DOM
}

window.addEventListener("resize", actualizarViewport);
actualizarViewport();

scrollBox.addEventListener("scroll", () => {
    scrollOutput.textContent = `Scroll interno: ${Math.round(scrollBox.scrollTop)} px`; // Actualiza contenido en el DOM
}, { passive: true });

demoImg.addEventListener("error", () => {
    imgStatus.className = "status-text err";
    imgStatus.textContent = "Evento error disparado: la imagen no pudo cargarse (404)."; // Actualiza contenido en el DOM
});

document.getElementById("btnBrokenImg").addEventListener("click", () => {
    imgStatus.className = "status-text";
    imgStatus.textContent = "Intentando cargar imagen..."; // Actualiza contenido en el DOM
    demoImg.src = "ruta-inexistente-404.png";
});
