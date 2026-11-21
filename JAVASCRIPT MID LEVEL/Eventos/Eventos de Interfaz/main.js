// Guía Interactiva — Eventos de Interfaz

const selectInput = document.getElementById("selectInput"); // Obtiene referencia DOM para "selectInput"
const selectOutput = document.getElementById("selectOutput"); // Obtiene referencia DOM para "selectOutput"
const resizeOutput = document.getElementById("resizeOutput"); // Obtiene referencia DOM para "resizeOutput"
const scrollBox = document.getElementById("scrollBox"); // Obtiene referencia DOM para "scrollBox"
const scrollOutput = document.getElementById("scrollOutput"); // Obtiene referencia DOM para "scrollOutput"
const demoImg = document.getElementById("demoImg"); // Obtiene referencia DOM para "demoImg"
const imgStatus = document.getElementById("imgStatus"); // Obtiene referencia DOM para "imgStatus"

selectInput.addEventListener("select", (e) => { // Registra escuchador de eventos
    const start = e.target.selectionStart; // Declara e inicializa "start"
    const end = e.target.selectionEnd; // Declara e inicializa "end"
    const texto = e.target.value.slice(start, end); // Declara e inicializa "texto"
    selectOutput.textContent = `Seleccionado (${start}..${end}): "${texto}"`; // Actualiza contenido en el DOM
});

function actualizarViewport() { // Declara función
    resizeOutput.textContent = `Viewport: ${window.innerWidth}px × ${window.innerHeight}px`; // Actualiza contenido en el DOM
}

window.addEventListener("resize", actualizarViewport); // Registra escuchador de eventos
actualizarViewport(); // Ejecuta llamada o método

scrollBox.addEventListener("scroll", () => { // Registra escuchador de eventos
    scrollOutput.textContent = `Scroll interno: ${Math.round(scrollBox.scrollTop)} px`; // Actualiza contenido en el DOM
}, { passive: true }); // Ejecuta llamada o método

demoImg.addEventListener("error", () => { // Registra escuchador de eventos
    imgStatus.className = "status-text err"; // Asigna valor
    imgStatus.textContent = "Evento error disparado: la imagen no pudo cargarse (404)."; // Actualiza contenido en el DOM
});

document.getElementById("btnBrokenImg").addEventListener("click", () => { // Registra escuchador de eventos
    imgStatus.className = "status-text"; // Asigna valor
    imgStatus.textContent = "Intentando cargar imagen..."; // Actualiza contenido en el DOM
    demoImg.src = "ruta-inexistente-404.png"; // Asigna valor
});
