// Guía Interactiva — ResizeObserver, matchMedia y Resize/Move

const resizableBox = document.getElementById("resizableBox"); // Obtiene referencia DOM para "resizableBox"
const boxSizeLabel = document.getElementById("boxSizeLabel"); // Obtiene referencia DOM para "boxSizeLabel"
const windowMetrics = document.getElementById("windowMetrics"); // Obtiene referencia DOM para "windowMetrics"
const popupStatus = document.getElementById("popupStatus"); // Obtiene referencia DOM para "popupStatus"

// 1. ResizeObserver moderno sobre un elemento específico
const observer = new ResizeObserver((entries) => { // Define función flecha "observer"
    for (const entry of entries) { // Inicia bucle de iteración
        const w = Math.round(entry.contentRect.width); // Declara e inicializa "w"
        const h = Math.round(entry.contentRect.height); // Declara e inicializa "h"
        boxSizeLabel.textContent = `${w}px × ${h}px`; // Actualiza contenido en el DOM
    }
});
observer.observe(resizableBox); // Ejecuta llamada o método

// 2. Métricas de ventana + matchMedia
const mqMobile = window.matchMedia("(max-width: 768px)"); // Declara e inicializa "mqMobile"

function renderWindowMetrics() { // Declara función
    const items = [
        ["innerWidth × innerHeight", `${window.innerWidth} × ${window.innerHeight}`],
        ["outerWidth × outerHeight", `${window.outerWidth} × ${window.outerHeight}`],
        ["screenX, screenY", `${window.screenX}, ${window.screenY}`],
        ["matchMedia(max-width: 768px)", String(mqMobile.matches)]
    ];

    windowMetrics.innerHTML = ""; // Actualiza contenido en el DOM
    items.forEach(([k, v]) => { // Instrucción JavaScript
        const div = document.createElement("div"); // Crea nuevo elemento DOM "div"
        div.className = "kv-item"; // Asigna valor
        const span = document.createElement("span"); // Crea nuevo elemento DOM "span"
        span.textContent = k; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Crea nuevo elemento DOM "strong"
        strong.textContent = v; // Actualiza contenido en el DOM
        div.append(span, strong); // Inserta nodo en el DOM
        windowMetrics.appendChild(div); // Inserta nodo en el DOM
    });
}

window.addEventListener("resize", renderWindowMetrics); // Registra escuchador de eventos
mqMobile.addEventListener("change", renderWindowMetrics); // Registra escuchador de eventos
renderWindowMetrics(); // Ejecuta llamada o método

document.getElementById("btnTryPopup").addEventListener("click", () => { // Registra escuchador de eventos
    const win = window.open("", "demoPopup", "width=360,height=260"); // Declara e inicializa "win"
    if (!win) { // Evalúa condición
        popupStatus.textContent = "El navegador bloqueó el popup emergente."; // Actualiza contenido en el DOM
        return; // Retorna resultado
    }
    win.document.body.innerHTML = "<p style='font-family:sans-serif;padding:16px'>Popup de prueba</p>"; // Actualiza contenido en el DOM
    win.resizeTo(420, 300); // Ejecuta llamada o método
    win.moveTo(120, 120); // Ejecuta llamada o método
    popupStatus.textContent = "Popup abierto y redimensionado con resizeTo(420, 300) y moveTo(120, 120)."; // Actualiza contenido en el DOM
});
