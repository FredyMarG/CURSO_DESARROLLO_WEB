/**
 * GUÍA INTERACTIVA: MÉTODOS DE CADENAS (STRINGS)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");

function registrar(mensaje) {
    const linea = document.createElement("div");
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. Transformador
document.querySelectorAll("[data-str]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const original = document.getElementById("str-input").value;
        const accion = btn.dataset.str;
        let resultado = "";

        if (accion === "trim") resultado = original.trim();
        else if (accion === "lower") resultado = original.toLowerCase(); // Evalúa condición alternativa
        else if (accion === "upper") resultado = original.toUpperCase(); // Evalúa condición alternativa
        else { // Rama alternativa
            resultado = original
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
        }

        document.getElementById("out-str-trans").textContent =
            `Original (${original.length} chars): ${JSON.stringify(original)}\nResultado (${resultado.length} chars): ${JSON.stringify(resultado)}\n(El original permanece inmutable)`;
        registrar(`String.${accion} -> ${JSON.stringify(resultado)}`);
    });
});

// 2. Búsqueda y slice / at
document.getElementById("btn-str-buscar").addEventListener("click", () => {
    const texto = document.getElementById("str-input").value.trim();
    const sub = document.getElementById("str-buscar").value;

    const incluye = texto.includes(sub);
    const indice = texto.indexOf(sub);
    const inicia = texto.startsWith(sub);
    const termina = texto.endsWith(sub);
    const ultimoChar = texto.at(-1) ?? "";
    const primeros5 = texto.slice(0, 5);

    document.getElementById("out-str-search").textContent =
        `Texto base: ${JSON.stringify(texto)}\n.includes("${sub}"): ${incluye}\n.indexOf("${sub}"): ${indice}\n.startsWith(): ${inicia} | .endsWith(): ${termina}\n.at(-1): "${ultimoChar}" | .slice(0, 5): "${primeros5}"`;
    registrar(`Búsqueda "${sub}" -> includes: ${incluye}, indexOf: ${indice}`);
});

// 3. padStart y split
document.getElementById("btn-str-pad").addEventListener("click", () => {
    const val = document.getElementById("str-num-pad").value.trim() || "0";
    const factura = `FAC-${val.padStart(5, "0")}`;
    const palabras = document.getElementById("str-input").value.trim().split(/\s+/);

    document.getElementById("out-str-pad").textContent =
        `padStart(5, "0"): "${factura}"\nsplit(/\\s+/) del texto superior: ${JSON.stringify(palabras)}`;
    registrar(`padStart -> ${factura} | split -> ${palabras.length} palabras`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Cadenas listo.");
