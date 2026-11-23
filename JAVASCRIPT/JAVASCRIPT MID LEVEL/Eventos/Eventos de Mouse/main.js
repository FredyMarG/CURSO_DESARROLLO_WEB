// Guía Interactiva — Eventos de Mouse

const mousePad = document.getElementById("mousePad");
const coordsText = document.getElementById("coordsText");
const mouseLog = document.getElementById("mouseLog");

function logMouse(evento, detalle = "") {
    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${evento} ${detalle}`; // Actualiza contenido en el DOM
    mouseLog.appendChild(line);
    mouseLog.scrollTop = mouseLog.scrollHeight;
}

mousePad.addEventListener("click", (e) => logMouse("click", `(botón ${e.button})`));
mousePad.addEventListener("dblclick", () => logMouse("dblclick", "Doble clic detectado"));
mousePad.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    logMouse("contextmenu", "Menú contextual bloqueado con preventDefault()");
});
mousePad.addEventListener("mouseenter", () => {
    mousePad.classList.add("active");
    logMouse("mouseenter", "Cursor entró al área");
});
mousePad.addEventListener("mouseleave", () => {
    mousePad.classList.remove("active");
    logMouse("mouseleave", "Cursor salió del área");
});
mousePad.addEventListener("mousemove", (e) => {
    const rect = mousePad.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    coordsText.textContent = `X: ${x}px | Y: ${y}px`; // Actualiza contenido en el DOM
});

document.getElementById("btnClearLog").addEventListener("click", () => {
    mouseLog.innerHTML = ""; // Actualiza contenido en el DOM
});
