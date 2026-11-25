/**
 * GUÍA INTERACTIVA: MÉTODOS DE CADENAS (STRINGS)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Declara e inicializa variable local

function registrar(mensaje) { // Define función reutilizable
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. Transformador
document.querySelectorAll("[data-str]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const original = document.getElementById("str-input").value; // Declara e inicializa variable local
        const accion = btn.dataset.str; // Declara e inicializa variable local
        let resultado = ""; // Declara e inicializa variable local

        if (accion === "trim") resultado = original.trim(); // Evalúa condición lógica
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
document.getElementById("btn-str-buscar").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const texto = document.getElementById("str-input").value.trim(); // Declara e inicializa variable local
    const sub = document.getElementById("str-buscar").value; // Declara e inicializa variable local

    const incluye = texto.includes(sub); // Declara e inicializa variable local
    const indice = texto.indexOf(sub); // Declara e inicializa variable local
    const inicia = texto.startsWith(sub); // Declara e inicializa variable local
    const termina = texto.endsWith(sub); // Declara e inicializa variable local
    const ultimoChar = texto.at(-1) ?? ""; // Declara e inicializa variable local
    const primeros5 = texto.slice(0, 5); // Declara e inicializa variable local

    document.getElementById("out-str-search").textContent =
        `Texto base: ${JSON.stringify(texto)}\n.includes("${sub}"): ${incluye}\n.indexOf("${sub}"): ${indice}\n.startsWith(): ${inicia} | .endsWith(): ${termina}\n.at(-1): "${ultimoChar}" | .slice(0, 5): "${primeros5}"`;
    registrar(`Búsqueda "${sub}" -> includes: ${incluye}, indexOf: ${indice}`);
});

// 3. padStart y split
document.getElementById("btn-str-pad").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const val = document.getElementById("str-num-pad").value.trim() || "0"; // Declara e inicializa variable local
    const factura = `FAC-${val.padStart(5, "0")}`; // Declara e inicializa variable local
    const palabras = document.getElementById("str-input").value.trim().split(/\s+/); // Declara e inicializa variable local

    document.getElementById("out-str-pad").textContent =
        `padStart(5, "0"): "${factura}"\nsplit(/\\s+/) del texto superior: ${JSON.stringify(palabras)}`;
    registrar(`padStart -> ${factura} | split -> ${palabras.length} palabras`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Cadenas listo.");

