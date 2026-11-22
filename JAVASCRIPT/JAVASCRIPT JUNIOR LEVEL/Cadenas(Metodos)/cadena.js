/**
 * GUÍA INTERACTIVA: MÉTODOS DE CADENAS (STRINGS)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

function registrar(mensaje) { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = "log-line ok"; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
}

// 1. Transformador
document.querySelectorAll("[data-str]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const original = document.getElementById("str-input").value; // Obtiene referencia DOM para "original"
        const accion = btn.dataset.str; // Declara e inicializa "accion"
        let resultado = ""; // Declara e inicializa "resultado"

        if (accion === "trim") resultado = original.trim(); // Evalúa condición
        else if (accion === "lower") resultado = original.toLowerCase(); // Evalúa condición alternativa
        else if (accion === "upper") resultado = original.toUpperCase(); // Evalúa condición alternativa
        else { // Rama alternativa
            resultado = original
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-"); // Ejecuta llamada o método
        }

        document.getElementById("out-str-trans").textContent =
            `Original (${original.length} chars): ${JSON.stringify(original)}\nResultado (${resultado.length} chars): ${JSON.stringify(resultado)}\n(El original permanece inmutable)`; // Instrucción JavaScript
        registrar(`String.${accion} -> ${JSON.stringify(resultado)}`); // Ejecuta llamada o método
    });
});

// 2. Búsqueda y slice / at
document.getElementById("btn-str-buscar").addEventListener("click", () => { // Registra escuchador de eventos
    const texto = document.getElementById("str-input").value.trim(); // Obtiene referencia DOM para "texto"
    const sub = document.getElementById("str-buscar").value; // Obtiene referencia DOM para "sub"

    const incluye = texto.includes(sub); // Declara e inicializa "incluye"
    const indice = texto.indexOf(sub); // Declara e inicializa "indice"
    const inicia = texto.startsWith(sub); // Declara e inicializa "inicia"
    const termina = texto.endsWith(sub); // Declara e inicializa "termina"
    const ultimoChar = texto.at(-1) ?? ""; // Declara e inicializa "ultimoChar"
    const primeros5 = texto.slice(0, 5); // Declara e inicializa "primeros5"

    document.getElementById("out-str-search").textContent =
        `Texto base: ${JSON.stringify(texto)}\n.includes("${sub}"): ${incluye}\n.indexOf("${sub}"): ${indice}\n.startsWith(): ${inicia} | .endsWith(): ${termina}\n.at(-1): "${ultimoChar}" | .slice(0, 5): "${primeros5}"`; // Instrucción JavaScript
    registrar(`Búsqueda "${sub}" -> includes: ${incluye}, indexOf: ${indice}`); // Ejecuta llamada o método
});

// 3. padStart y split
document.getElementById("btn-str-pad").addEventListener("click", () => { // Registra escuchador de eventos
    const val = document.getElementById("str-num-pad").value.trim() || "0"; // Obtiene referencia DOM para "val"
    const factura = `FAC-${val.padStart(5, "0")}`; // Declara e inicializa "factura"
    const palabras = document.getElementById("str-input").value.trim().split(/\s+/); // Obtiene referencia DOM para "palabras"

    document.getElementById("out-str-pad").textContent =
        `padStart(5, "0"): "${factura}"\nsplit(/\\s+/) del texto superior: ${JSON.stringify(palabras)}`; // Instrucción JavaScript
    registrar(`padStart -> ${factura} | split -> ${palabras.length} palabras`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Cadenas listo."); // Ejecuta llamada o método
