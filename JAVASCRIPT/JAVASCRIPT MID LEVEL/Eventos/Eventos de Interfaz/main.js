// Guía Interactiva — Eventos de Interfaz

const selectInput = document.getElementById("selectInput"); // Declara e inicializa variable local
const selectOutput = document.getElementById("selectOutput"); // Declara e inicializa variable local
const resizeOutput = document.getElementById("resizeOutput"); // Declara e inicializa variable local
const scrollBox = document.getElementById("scrollBox"); // Declara e inicializa variable local
const scrollOutput = document.getElementById("scrollOutput"); // Declara e inicializa variable local
const demoImg = document.getElementById("demoImg"); // Declara e inicializa variable local
const imgStatus = document.getElementById("imgStatus"); // Declara e inicializa variable local

selectInput.addEventListener("select", (e) => { // Registra escuchador de evento en el DOM
    const start = e.target.selectionStart; // Declara e inicializa variable local
    const end = e.target.selectionEnd; // Declara e inicializa variable local
    const texto = e.target.value.slice(start, end); // Declara e inicializa variable local
    selectOutput.textContent = `Seleccionado (${start}..${end}): "${texto}"`; // Actualiza contenido en el DOM
});

function actualizarViewport() { // Define función reutilizable
    resizeOutput.textContent = `Viewport: ${window.innerWidth}px × ${window.innerHeight}px`; // Actualiza contenido en el DOM
}

window.addEventListener("resize", actualizarViewport);
actualizarViewport();

scrollBox.addEventListener("scroll", () => { // Registra escuchador de evento en el DOM
    scrollOutput.textContent = `Scroll interno: ${Math.round(scrollBox.scrollTop)} px`; // Actualiza contenido en el DOM
}, { passive: true });

demoImg.addEventListener("error", () => { // Registra escuchador de evento en el DOM
    imgStatus.className = "status-text err";
    imgStatus.textContent = "Evento error disparado: la imagen no pudo cargarse (404)."; // Actualiza contenido en el DOM
});

document.getElementById("btnBrokenImg").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    imgStatus.className = "status-text";
    imgStatus.textContent = "Intentando cargar imagen..."; // Actualiza contenido en el DOM
    demoImg.src = "ruta-inexistente-404.png";
});

