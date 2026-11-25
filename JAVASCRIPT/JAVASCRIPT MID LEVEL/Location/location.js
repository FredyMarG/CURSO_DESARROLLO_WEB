// Guía Interactiva — Location, URL y URLSearchParams

const locationTable = document.getElementById("locationTable"); // Declara e inicializa variable local
const urlInput = document.getElementById("urlInput"); // Declara e inicializa variable local
const urlOutput = document.getElementById("urlOutput"); // Declara e inicializa variable local

function renderLocation() { // Define función reutilizable
    const props = [
        ["location.href", window.location.href],
        ["location.protocol", window.location.protocol],
        ["location.host", window.location.host || "(archivo local)"],
        ["location.pathname", window.location.pathname],
        ["location.search", window.location.search || "(vacío)"],
        ["location.hash", window.location.hash || "(vacío)"]
    ];

    locationTable.innerHTML = ""; // Actualiza contenido en el DOM
    props.forEach(([clave, valor]) => {
        const row = document.createElement("div"); // Declara e inicializa variable local
        row.className = "kv-item";
        const span = document.createElement("span"); // Declara e inicializa variable local
        span.textContent = clave; // Actualiza contenido en el DOM
        const strong = document.createElement("strong"); // Declara e inicializa variable local
        strong.textContent = valor; // Actualiza contenido en el DOM
        row.append(span, strong);
        locationTable.appendChild(row);
    });
}

function analizarUrl() { // Define función reutilizable
    try { // Inicia bloque protegido contra errores
        const parsed = new URL(urlInput.value.trim()); // Declara e inicializa variable local
        const paramsObj = Object.fromEntries(parsed.searchParams.entries()); // Declara e inicializa variable local
        urlOutput.textContent = [
            `origin:   ${parsed.origin}`,
            `hostname: ${parsed.hostname}`,
            `pathname: ${parsed.pathname}`,
            `hash:     ${parsed.hash || "(ninguno)"}`,
            `params:   ${JSON.stringify(paramsObj, null, 2)}`
        ].join("\n");
    } catch {
        urlOutput.textContent = "Error: Ingresa una URL válida (incluyendo https:// o http://).";
    }
}

document.getElementById("btnParseUrl").addEventListener("click", analizarUrl); // Obtiene referencia al elemento del DOM
document.getElementById("btnAddParam").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    try { // Inicia bloque protegido contra errores
        const parsed = new URL(urlInput.value.trim()); // Declara e inicializa variable local
        parsed.searchParams.set("promo", "2026");
        urlInput.value = parsed.toString();
        analizarUrl();
    } catch {
        urlOutput.textContent = "Error: URL inválida."; // Actualiza contenido en el DOM
    }
});

renderLocation();
analizarUrl();

