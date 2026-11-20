// Guía Interactiva — ResizeObserver, matchMedia y Resize/Move

const resizableBox = document.getElementById("resizableBox");
const boxSizeLabel = document.getElementById("boxSizeLabel");
const windowMetrics = document.getElementById("windowMetrics");
const popupStatus = document.getElementById("popupStatus");

// 1. ResizeObserver moderno sobre un elemento específico
const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        const h = Math.round(entry.contentRect.height);
        boxSizeLabel.textContent = `${w}px × ${h}px`;
    }
});
observer.observe(resizableBox);

// 2. Métricas de ventana + matchMedia
const mqMobile = window.matchMedia("(max-width: 768px)");

function renderWindowMetrics() {
    const items = [
        ["innerWidth × innerHeight", `${window.innerWidth} × ${window.innerHeight}`],
        ["outerWidth × outerHeight", `${window.outerWidth} × ${window.outerHeight}`],
        ["screenX, screenY", `${window.screenX}, ${window.screenY}`],
        ["matchMedia(max-width: 768px)", String(mqMobile.matches)]
    ];

    windowMetrics.innerHTML = "";
    items.forEach(([k, v]) => {
        const div = document.createElement("div");
        div.className = "kv-item";
        const span = document.createElement("span");
        span.textContent = k;
        const strong = document.createElement("strong");
        strong.textContent = v;
        div.append(span, strong);
        windowMetrics.appendChild(div);
    });
}

window.addEventListener("resize", renderWindowMetrics);
mqMobile.addEventListener("change", renderWindowMetrics);
renderWindowMetrics();

document.getElementById("btnTryPopup").addEventListener("click", () => {
    const win = window.open("", "demoPopup", "width=360,height=260");
    if (!win) {
        popupStatus.textContent = "El navegador bloqueó el popup emergente.";
        return;
    }
    win.document.body.innerHTML = "<p style='font-family:sans-serif;padding:16px'>Popup de prueba</p>";
    win.resizeTo(420, 300);
    win.moveTo(120, 120);
    popupStatus.textContent = "Popup abierto y redimensionado con resizeTo(420, 300) y moveTo(120, 120).";
});
