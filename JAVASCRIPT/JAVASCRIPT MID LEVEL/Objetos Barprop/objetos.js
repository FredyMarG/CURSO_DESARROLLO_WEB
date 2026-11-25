// Guía Interactiva — Objetos BarProp & Display Mode

const barpropGrid = document.getElementById("barpropGrid"); // Declara e inicializa variable local
const displayModeOutput = document.getElementById("displayModeOutput"); // Declara e inicializa variable local

function leerBarProps() { // Define función reutilizable
    const barras = [
        ["window.locationbar.visible", window.locationbar?.visible],
        ["window.menubar.visible", window.menubar?.visible],
        ["window.personalbar.visible", window.personalbar?.visible],
        ["window.scrollbars.visible", window.scrollbars?.visible],
        ["window.statusbar.visible", window.statusbar?.visible],
        ["window.toolbar.visible", window.toolbar?.visible]
    ];

    barpropGrid.innerHTML = ""; // Actualiza contenido en el DOM
    barras.forEach(([nombre, estado]) => {
        const item = document.createElement("div"); // Declara e inicializa variable local
        item.className = "kv-item";
        const span = document.createElement("span"); // Declara e inicializa variable local
        span.textContent = nombre; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Declara e inicializa variable local
        strong.textContent = String(Boolean(estado)); // Actualiza contenido en el DOM
        item.append(span, strong);
        barpropGrid.appendChild(item);
    });

    const standalone = window.matchMedia("(display-mode: standalone)").matches; // Declara e inicializa variable local
    const browser = window.matchMedia("(display-mode: browser)").matches; // Declara e inicializa variable local
    displayModeOutput.textContent =
        `display-mode: standalone → ${standalone}\n` +
        `display-mode: browser    → ${browser}`;
}

document.getElementById("btnRefresh").addEventListener("click", leerBarProps); // Obtiene referencia al elemento del DOM
leerBarProps();

