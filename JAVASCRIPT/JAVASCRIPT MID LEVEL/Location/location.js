// Guía Interactiva — Location, URL y URLSearchParams

const locationTable = document.getElementById("locationTable"); // Obtiene referencia DOM para "locationTable"
const urlInput = document.getElementById("urlInput"); // Obtiene referencia DOM para "urlInput"
const urlOutput = document.getElementById("urlOutput"); // Obtiene referencia DOM para "urlOutput"

function renderLocation() { // Declara función
    const props = [
        ["location.href", window.location.href],
        ["location.protocol", window.location.protocol],
        ["location.host", window.location.host || "(archivo local)"],
        ["location.pathname", window.location.pathname],
        ["location.search", window.location.search || "(vacío)"],
        ["location.hash", window.location.hash || "(vacío)"]
    ];

    locationTable.innerHTML = ""; // Actualiza contenido en el DOM
    props.forEach(([clave, valor]) => { // Instrucción JavaScript
        const row = document.createElement("div"); // Crea nuevo elemento DOM "row"
        row.className = "kv-item"; // Asigna valor
        const span = document.createElement("span"); // Crea nuevo elemento DOM "span"
        span.textContent = clave; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Crea nuevo elemento DOM "strong"
        strong.textContent = valor; // Actualiza contenido en el DOM
        row.append(span, strong); // Inserta nodo en el DOM
        locationTable.appendChild(row); // Inserta nodo en el DOM
    });
}

function analizarUrl() { // Declara función
    try { // Inicia bloque protegido contra errores
        const parsed = new URL(urlInput.value.trim()); // Declara e inicializa "parsed"
        const paramsObj = Object.fromEntries(parsed.searchParams.entries()); // Declara e inicializa "paramsObj"
        urlOutput.textContent = [
            `origin:   ${parsed.origin}`,
            `hostname: ${parsed.hostname}`,
            `pathname: ${parsed.pathname}`,
            `hash:     ${parsed.hash || "(ninguno)"}`,
            `params:   ${JSON.stringify(paramsObj, null, 2)}`
        ].join("\n"); // Ejecuta llamada o método
    } catch { // Instrucción JavaScript
        urlOutput.textContent = "Error: Ingresa una URL válida (incluyendo https:// o http://).";
    }
}

document.getElementById("btnParseUrl").addEventListener("click", analizarUrl); // Registra escuchador de eventos
document.getElementById("btnAddParam").addEventListener("click", () => { // Registra escuchador de eventos
    try { // Inicia bloque protegido contra errores
        const parsed = new URL(urlInput.value.trim()); // Declara e inicializa "parsed"
        parsed.searchParams.set("promo", "2026"); // Ejecuta llamada o método
        urlInput.value = parsed.toString(); // Asigna valor
        analizarUrl(); // Ejecuta llamada o método
    } catch { // Instrucción JavaScript
        urlOutput.textContent = "Error: URL inválida."; // Actualiza contenido en el DOM
    }
});

renderLocation(); // Ejecuta llamada o método
analizarUrl(); // Ejecuta llamada o método
