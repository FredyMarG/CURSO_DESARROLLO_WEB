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
    selectOutput.textContent = `Seleccionado (${start}..${end}): "${texto}"`;
});

function actualizarViewport() {
    resizeOutput.textContent = `Viewport: ${window.innerWidth}px × ${window.innerHeight}px`;
}

window.addEventListener("resize", actualizarViewport);
actualizarViewport();

scrollBox.addEventListener("scroll", () => {
    scrollOutput.textContent = `Scroll interno: ${Math.round(scrollBox.scrollTop)} px`;
}, { passive: true });

demoImg.addEventListener("error", () => {
    imgStatus.className = "status-text err";
    imgStatus.textContent = "Evento error disparado: la imagen no pudo cargarse (404).";
});

document.getElementById("btnBrokenImg").addEventListener("click", () => {
    imgStatus.className = "status-text";
    imgStatus.textContent = "Intentando cargar imagen...";
    demoImg.src = "ruta-inexistente-404.png";
});
