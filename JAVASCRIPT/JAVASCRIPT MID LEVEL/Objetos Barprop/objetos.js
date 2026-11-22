// Guía Interactiva — Objetos BarProp & Display Mode

const barpropGrid = document.getElementById("barpropGrid"); // Obtiene referencia DOM para "barpropGrid"
const displayModeOutput = document.getElementById("displayModeOutput"); // Obtiene referencia DOM para "displayModeOutput"

function leerBarProps() { // Declara función
    const barras = [
        ["window.locationbar.visible", window.locationbar?.visible],
        ["window.menubar.visible", window.menubar?.visible],
        ["window.personalbar.visible", window.personalbar?.visible],
        ["window.scrollbars.visible", window.scrollbars?.visible],
        ["window.statusbar.visible", window.statusbar?.visible],
        ["window.toolbar.visible", window.toolbar?.visible]
    ];

    barpropGrid.innerHTML = ""; // Actualiza contenido en el DOM
    barras.forEach(([nombre, estado]) => { // Instrucción JavaScript
        const item = document.createElement("div"); // Crea nuevo elemento DOM "item"
        item.className = "kv-item"; // Asigna valor
        const span = document.createElement("span"); // Crea nuevo elemento DOM "span"
        span.textContent = nombre; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Crea nuevo elemento DOM "strong"
        strong.textContent = String(Boolean(estado)); // Actualiza contenido en el DOM
        item.append(span, strong); // Inserta nodo en el DOM
        barpropGrid.appendChild(item); // Inserta nodo en el DOM
    });

    const standalone = window.matchMedia("(display-mode: standalone)").matches; // Declara e inicializa "standalone"
    const browser = window.matchMedia("(display-mode: browser)").matches; // Declara e inicializa "browser"
    displayModeOutput.textContent =
        `display-mode: standalone → ${standalone}\n` +
        `display-mode: browser    → ${browser}`; // Instrucción JavaScript
}

document.getElementById("btnRefresh").addEventListener("click", leerBarProps); // Registra escuchador de eventos
leerBarProps(); // Ejecuta llamada o método
