// Guía Interactiva — Eventos de Mouse

const mousePad = document.getElementById("mousePad"); // Declara e inicializa variable local
const coordsText = document.getElementById("coordsText"); // Declara e inicializa variable local
const mouseLog = document.getElementById("mouseLog"); // Declara e inicializa variable local

function logMouse(evento, detalle = "") { // Define función reutilizable
    const line = document.createElement("div"); // Declara e inicializa variable local
    line.textContent = `[${new Date().toLocaleTimeString()}] ${evento} ${detalle}`; // Actualiza contenido en el DOM
    mouseLog.appendChild(line);
    mouseLog.scrollTop = mouseLog.scrollHeight;
}

mousePad.addEventListener("click", (e) => logMouse("click", `(botón ${e.button})`));
mousePad.addEventListener("dblclick", () => logMouse("dblclick", "Doble clic detectado"));
mousePad.addEventListener("contextmenu", (e) => { // Registra escuchador de evento en el DOM
    e.preventDefault();
    logMouse("contextmenu", "Menú contextual bloqueado con preventDefault()");
});
mousePad.addEventListener("mouseenter", () => { // Registra escuchador de evento en el DOM
    mousePad.classList.add("active");
    logMouse("mouseenter", "Cursor entró al área");
});
mousePad.addEventListener("mouseleave", () => { // Registra escuchador de evento en el DOM
    mousePad.classList.remove("active");
    logMouse("mouseleave", "Cursor salió del área");
});
mousePad.addEventListener("mousemove", (e) => { // Registra escuchador de evento en el DOM
    const rect = mousePad.getBoundingClientRect(); // Declara e inicializa variable local
    const x = Math.round(e.clientX - rect.left); // Declara e inicializa variable local
    const y = Math.round(e.clientY - rect.top); // Declara e inicializa variable local
    coordsText.textContent = `X: ${x}px | Y: ${y}px`; // Actualiza contenido en el DOM
});

document.getElementById("btnClearLog").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    mouseLog.innerHTML = ""; // Actualiza contenido en el DOM
});

