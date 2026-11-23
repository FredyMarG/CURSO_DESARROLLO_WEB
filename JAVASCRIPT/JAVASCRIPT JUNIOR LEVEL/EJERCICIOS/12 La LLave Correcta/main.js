/**
 * Lógica para la generación dinámica, renderizado optimizado con DocumentFragment
 * y selección accesible de llaves en el DOM.
 * Obtiene 20 fotografías reales de llaves desde Wikimedia Commons (Category:Antique_keys)
 * con respaldo SVG automático si el dispositivo está sin conexión.
 */

const contenedor = document.querySelector(".flex-container");
const boton = document.querySelector(".send-button");
const form = document.getElementById("keyForm");
const keyDataInput = document.querySelector(".key-data");
const statusPill = document.getElementById("selectedStatus");
const resultBox = document.getElementById("resultBox");

boton.value = boton.value.toUpperCase();

/**
 * Paleta para generar respaldos SVG únicos mientras cargan las fotos o si no hay internet.
 */
const COLORES_RESPALDO = [
    "#fbbf24", "#00f0ff", "#a855f7", "#00ff88", "#f43f5e",
    "#38bdf8", "#fb923c", "#e879f9", "#4ade80", "#facc15",
    "#60a5fa", "#fb7185", "#2dd4bf", "#c084fc", "#f87171",
    "#22d3ee", "#fcd34d", "#34d399", "#818cf8", "#f472b6"
];

/**
 * Genera una imagen SVG de respaldo mientras carga la foto real o sin internet.
 */
function respaldoOfflineSVG(indice) {
    const color = COLORES_RESPALDO[(indice - 1) % COLORES_RESPALDO.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="160" height="100">
        <rect width="160" height="100" rx="12" fill="#090f20"/>
        <circle cx="42" cy="50" r="18" fill="none" stroke="${color}" stroke-width="4"/>
        <path d="M60,50 H134 V64 H122 V50 H108 V60 H96 V50" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <text x="148" y="20" text-anchor="end" font-family="monospace" font-size="11" fill="${color}">#${String(indice).padStart(2, "0")}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Genera el contenido HTML de una tarjeta de llave.
 */
function crearLLave(nombre, modelo, precio, indice) {
    const fallback = respaldoOfflineSVG(indice);
    const img = `<img class="llave-img" data-key-idx="${indice}" src="${fallback}" alt="${nombre} (${modelo})" loading="lazy">`;
    const titulo = `<h2>${nombre}</h2>`;
    const sub = `<h3 id="${modelo}">${modelo}</h3>`;
    const valor = `<p>Precio: <b>${precio}</b></p>`;
    return [img, titulo, sub, valor];
}

/**
 * Actualiza el campo oculto del formulario y el feedback visual.
 */
function seleccionarLlave(card, nombre, modelo, precio) {
    document.querySelectorAll(".flex-item.selected").forEach((el) => {
        el.classList.remove("selected");
    });
    card.classList.add("selected");
    keyDataInput.value = modelo;

    if (statusPill) {
        statusPill.textContent = `🔑 Seleccionaste: ${nombre} — ${modelo} (${precio})`; // Actualiza contenido en el DOM
        statusPill.classList.add("has-selection");
    }
    if (resultBox) {
        resultBox.className = "result-box";
        resultBox.textContent = ""; // Actualiza contenido en el DOM
    }
}

const fragment = document.createDocumentFragment();

for (let i = 1; i <= 20; i++) {
    const modeloRandom = Math.floor(Math.random() * 9000) + 1000;
    const precioRandom = `$${(Math.random() * 10 + 30).toFixed(2)}`;
    const nombre = `Llave ${i}`;
    const modelo = `Modelo ${modeloRandom}`;

    const llave = crearLLave(nombre, modelo, precioRandom, i);
    const div = document.createElement("div");

    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.classList.add(`item-${i}`, "flex-item");
    div.innerHTML = llave.join(""); // Actualiza contenido en el DOM

    div.addEventListener("click", () => seleccionarLlave(div, nombre, modelo, precioRandom));
    div.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            seleccionarLlave(div, nombre, modelo, precioRandom);
        }
    });

    fragment.appendChild(div);
}

contenedor.appendChild(fragment);

/**
 * Carga 20 fotografías reales de llaves desde Wikimedia Commons (Category:Antique_keys).
 */
async function cargarFotosRealesLlaves() {
    const endpoint =
        "https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=categorymembers" +
        "&gcmtitle=Category:Antique_keys&gcmtype=file&gcmlimit=30&prop=imageinfo&iiprop=url&iiurlwidth=360&format=json";
    try { // Inicia bloque protegido contra errores
        const res = await fetch(endpoint);
        if (!res.ok) return;
        const data = await res.json();
        const pages = Object.values(data?.query?.pages || {});
        const urls = pages
            .map((p) => p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url)
            .filter((u) => typeof u === "string" && /\.(jpe?g|png|webp)/i.test(u));

        document.querySelectorAll("img.llave-img[data-key-idx]").forEach((imgEl, idx) => {
            const url = urls[idx];
            if (!url) return;
            const fallback = imgEl.src;
            imgEl.onerror = () => {
                imgEl.onerror = null;
                imgEl.src = fallback;
            };
            imgEl.src = url;
        });
    } catch (_) {
        // Sin conexión: se mantienen las 20 ilustraciones SVG de respaldo
    }
}

cargarFotosRealesLlaves();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!keyDataInput.value) {
        resultBox.textContent = "⚠️ Primero selecciona una llave haciendo clic sobre su tarjeta."; // Actualiza contenido en el DOM
        resultBox.className = "result-box err";
        return;
    }
    resultBox.textContent = `✅ ¡Pedido confirmado! El cerrajero llevará la llave ${keyDataInput.value}.`; // Actualiza contenido en el DOM
    resultBox.className = "result-box ok";
});
