// Guía Interactiva — Objetos BarProp & Display Mode

const barpropGrid = document.getElementById("barpropGrid");
const displayModeOutput = document.getElementById("displayModeOutput");

function leerBarProps() {
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
        const item = document.createElement("div");
        item.className = "kv-item";
        const span = document.createElement("span");
        span.textContent = nombre; // Actualiza contenido en el DOM
        const strong = document.createElement("strong");
        strong.textContent = String(Boolean(estado)); // Actualiza contenido en el DOM
        item.append(span, strong);
        barpropGrid.appendChild(item);
    });

    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    const browser = window.matchMedia("(display-mode: browser)").matches;
    displayModeOutput.textContent =
        `display-mode: standalone → ${standalone}\n` +
        `display-mode: browser    → ${browser}`;
}

document.getElementById("btnRefresh").addEventListener("click", leerBarProps);
leerBarProps();
