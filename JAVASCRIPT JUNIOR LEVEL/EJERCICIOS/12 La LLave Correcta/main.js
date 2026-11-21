/**
 * Lógica para la generación dinámica, renderizado optimizado con DocumentFragment
 * y selección accesible de llaves en el DOM.
 * Obtiene 20 fotografías reales de llaves desde Wikimedia Commons (Category:Antique_keys)
 * con respaldo SVG automático si el dispositivo está sin conexión.
 */

const contenedor = document.querySelector(".flex-container"); // Obtiene referencia DOM para "contenedor"
const boton = document.querySelector(".send-button"); // Obtiene referencia DOM para "boton"
const form = document.getElementById("keyForm"); // Obtiene referencia DOM para "form"
const keyDataInput = document.querySelector(".key-data"); // Obtiene referencia DOM para "keyDataInput"
const statusPill = document.getElementById("selectedStatus"); // Obtiene referencia DOM para "statusPill"
const resultBox = document.getElementById("resultBox"); // Obtiene referencia DOM para "resultBox"

boton.value = boton.value.toUpperCase(); // Asigna valor

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
function respaldoOfflineSVG(indice) { // Declara función
    const color = COLORES_RESPALDO[(indice - 1) % COLORES_RESPALDO.length]; // Declara e inicializa "color"
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" width="160" height="100">
        <rect width="160" height="100" rx="12" fill="#090f20"/>
        <circle cx="42" cy="50" r="18" fill="none" stroke="${color}" stroke-width="4"/>
        <path d="M60,50 H134 V64 H122 V50 H108 V60 H96 V50" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <text x="148" y="20" text-anchor="end" font-family="monospace" font-size="11" fill="${color}">#${String(indice).padStart(2, "0")}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`; // Retorna resultado
}

/**
 * Genera el contenido HTML de una tarjeta de llave.
 */
function crearLLave(nombre, modelo, precio, indice) { // Declara función
    const fallback = respaldoOfflineSVG(indice); // Declara e inicializa "fallback"
    const img = `<img class="llave-img" data-key-idx="${indice}" src="${fallback}" alt="${nombre} (${modelo})" loading="lazy">`; // Declara e inicializa "img"
    const titulo = `<h2>${nombre}</h2>`; // Declara e inicializa "titulo"
    const sub = `<h3 id="${modelo}">${modelo}</h3>`; // Declara e inicializa "sub"
    const valor = `<p>Precio: <b>${precio}</b></p>`; // Declara e inicializa "valor"
    return [img, titulo, sub, valor]; // Retorna resultado
}

/**
 * Actualiza el campo oculto del formulario y el feedback visual.
 */
function seleccionarLlave(card, nombre, modelo, precio) { // Declara función
    document.querySelectorAll(".flex-item.selected").forEach((el) => { // Instrucción JavaScript
        el.classList.remove("selected"); // Modifica clases CSS del elemento
    });
    card.classList.add("selected"); // Modifica clases CSS del elemento
    keyDataInput.value = modelo; // Asigna valor

    if (statusPill) { // Evalúa condición
        statusPill.textContent = `🔑 Seleccionaste: ${nombre} — ${modelo} (${precio})`; // Actualiza contenido en el DOM
        statusPill.classList.add("has-selection"); // Modifica clases CSS del elemento
    }
    if (resultBox) { // Evalúa condición
        resultBox.className = "result-box"; // Asigna valor
        resultBox.textContent = ""; // Actualiza contenido en el DOM
    }
}

const fragment = document.createDocumentFragment(); // Declara e inicializa "fragment"

for (let i = 1; i <= 20; i++) { // Inicia bucle de iteración
    const modeloRandom = Math.floor(Math.random() * 9000) + 1000; // Declara e inicializa "modeloRandom"
    const precioRandom = `$${(Math.random() * 10 + 30).toFixed(2)}`; // Declara e inicializa "precioRandom"
    const nombre = `Llave ${i}`; // Declara e inicializa "nombre"
    const modelo = `Modelo ${modeloRandom}`; // Declara e inicializa "modelo"

    const llave = crearLLave(nombre, modelo, precioRandom, i); // Declara e inicializa "llave"
    const div = document.createElement("div"); // Crea nuevo elemento DOM "div"

    div.tabIndex = 0; // Asigna valor
    div.setAttribute("role", "button"); // Ejecuta llamada o método
    div.classList.add(`item-${i}`, "flex-item"); // Modifica clases CSS del elemento
    div.innerHTML = llave.join(""); // Actualiza contenido en el DOM

    div.addEventListener("click", () => seleccionarLlave(div, nombre, modelo, precioRandom)); // Registra escuchador de eventos
    div.addEventListener("keydown", (e) => { // Registra escuchador de eventos
        if (e.key === "Enter" || e.key === " ") { // Evalúa condición
            e.preventDefault(); // Ejecuta llamada o método
            seleccionarLlave(div, nombre, modelo, precioRandom); // Ejecuta llamada o método
        }
    });

    fragment.appendChild(div); // Inserta nodo en el DOM
}

contenedor.appendChild(fragment); // Inserta nodo en el DOM

/**
 * Carga 20 fotografías reales de llaves desde Wikimedia Commons (Category:Antique_keys).
 */
async function cargarFotosRealesLlaves() { // Declara función
    const endpoint =
        "https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=categorymembers" +
        "&gcmtitle=Category:Antique_keys&gcmtype=file&gcmlimit=30&prop=imageinfo&iiprop=url&iiurlwidth=360&format=json"; // Instrucción JavaScript
    try { // Inicia bloque protegido contra errores
        const res = await fetch(endpoint); // Declara e inicializa "res"
        if (!res.ok) return; // Evalúa condición
        const data = await res.json(); // Declara e inicializa "data"
        const pages = Object.values(data?.query?.pages || {}); // Declara e inicializa "pages"
        const urls = pages
            .map((p) => p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url)
            .filter((u) => typeof u === "string" && /\.(jpe?g|png|webp)/i.test(u)); // Ejecuta llamada o método

        document.querySelectorAll("img.llave-img[data-key-idx]").forEach((imgEl, idx) => { // Instrucción JavaScript
            const url = urls[idx]; // Declara e inicializa "url"
            if (!url) return; // Evalúa condición
            const fallback = imgEl.src; // Declara e inicializa "fallback"
            imgEl.onerror = () => { // Asigna valor
                imgEl.onerror = null; // Asigna valor
                imgEl.src = fallback; // Asigna valor
            };
            imgEl.src = url; // Asigna valor
        });
    } catch (_) { // Instrucción JavaScript
        // Sin conexión: se mantienen las 20 ilustraciones SVG de respaldo
    }
}

cargarFotosRealesLlaves(); // Ejecuta llamada o método

form.addEventListener("submit", (e) => { // Registra escuchador de eventos
    e.preventDefault(); // Ejecuta llamada o método
    if (!keyDataInput.value) { // Evalúa condición
        resultBox.textContent = "⚠️ Primero selecciona una llave haciendo clic sobre su tarjeta."; // Actualiza contenido en el DOM
        resultBox.className = "result-box err"; // Asigna valor
        return; // Retorna resultado
    }
    resultBox.textContent = `✅ ¡Pedido confirmado! El cerrajero llevará la llave ${keyDataInput.value}.`; // Actualiza contenido en el DOM
    resultBox.className = "result-box ok"; // Asigna valor
});
