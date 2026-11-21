// Guía Interactiva — Eventos de Mouse

const mousePad = document.getElementById("mousePad"); // Obtiene referencia DOM para "mousePad"
const coordsText = document.getElementById("coordsText"); // Obtiene referencia DOM para "coordsText"
const mouseLog = document.getElementById("mouseLog"); // Obtiene referencia DOM para "mouseLog"

function logMouse(evento, detalle = "") { // Declara función
    const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
    line.textContent = `[${new Date().toLocaleTimeString()}] ${evento} ${detalle}`; // Actualiza contenido en el DOM
    mouseLog.appendChild(line); // Inserta nodo en el DOM
    mouseLog.scrollTop = mouseLog.scrollHeight; // Asigna valor
}

mousePad.addEventListener("click", (e) => logMouse("click", `(botón ${e.button})`)); // Registra escuchador de eventos
mousePad.addEventListener("dblclick", () => logMouse("dblclick", "Doble clic detectado")); // Registra escuchador de eventos
mousePad.addEventListener("contextmenu", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // Ejecuta llamada o método
    logMouse("contextmenu", "Menú contextual bloqueado con preventDefault()"); // Ejecuta llamada o método
});
mousePad.addEventListener("mouseenter", () => { // Registra escuchador de eventos
    mousePad.classList.add("active"); // Modifica clases CSS del elemento
    logMouse("mouseenter", "Cursor entró al área"); // Ejecuta llamada o método
});
mousePad.addEventListener("mouseleave", () => { // Registra escuchador de eventos
    mousePad.classList.remove("active"); // Modifica clases CSS del elemento
    logMouse("mouseleave", "Cursor salió del área"); // Ejecuta llamada o método
});
mousePad.addEventListener("mousemove", (e) => { // Registra escuchador de eventos
    const rect = mousePad.getBoundingClientRect(); // Declara e inicializa "rect"
    const x = Math.round(e.clientX - rect.left); // Declara e inicializa "x"
    const y = Math.round(e.clientY - rect.top); // Declara e inicializa "y"
    coordsText.textContent = `X: ${x}px | Y: ${y}px`; // Actualiza contenido en el DOM
});

document.getElementById("btnClearLog").addEventListener("click", () => { // Registra escuchador de eventos
    mouseLog.innerHTML = ""; // Actualiza contenido en el DOM
});
