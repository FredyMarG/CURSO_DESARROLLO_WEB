// Guía Interactiva — Location, URL y URLSearchParams

const locationTable = document.getElementById("locationTable");
const urlInput = document.getElementById("urlInput");
const urlOutput = document.getElementById("urlOutput");

function renderLocation() {
    const props = [
        ["location.href", window.location.href],
        ["location.protocol", window.location.protocol],
        ["location.host", window.location.host || "(archivo local)"],
        ["location.pathname", window.location.pathname],
        ["location.search", window.location.search || "(vacío)"],
        ["location.hash", window.location.hash || "(vacío)"]
    ];

    locationTable.innerHTML = "";
    props.forEach(([clave, valor]) => {
        const row = document.createElement("div");
        row.className = "kv-item";
        const span = document.createElement("span");
        span.textContent = clave;
        const strong = document.createElement("strong");
        strong.textContent = valor;
        row.append(span, strong);
        locationTable.appendChild(row);
    });
}

function analizarUrl() {
    try {
        const parsed = new URL(urlInput.value.trim());
        const paramsObj = Object.fromEntries(parsed.searchParams.entries());
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

document.getElementById("btnParseUrl").addEventListener("click", analizarUrl);
document.getElementById("btnAddParam").addEventListener("click", () => {
    try {
        const parsed = new URL(urlInput.value.trim());
        parsed.searchParams.set("promo", "2026");
        urlInput.value = parsed.toString();
        analizarUrl();
    } catch {
        urlOutput.textContent = "Error: URL inválida.";
    }
});

renderLocation();
analizarUrl();
