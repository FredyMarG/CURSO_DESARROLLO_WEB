/**
 * GUÍA INTERACTIVA: ARRAYS Y MÉTODOS (ES2023+)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

function registrar(mensaje, tipo = "ok") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
}

// 1. Métodos Mutables
let frutas = ["Manzana", "Pera", "Naranja"]; // Declara e inicializa "frutas"
const outMut = document.getElementById("out-arr-mut"); // Obtiene referencia DOM para "outMut"

function renderFrutas(accion = "Estado inicial") { // Declara función
    outMut.textContent =
        `Acción: ${accion}\nArray: ${JSON.stringify(frutas)}\nLongitud: ${frutas.length} | Último (.at(-1)): ${frutas.at(-1) ?? "vacío"}`; // Instrucción JavaScript
}

document.querySelectorAll("[data-arr]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const op = btn.dataset.arr; // Declara e inicializa "op"
        const nueva = document.getElementById("input-fruta").value.trim() || "Uva"; // Obtiene referencia DOM para "nueva"
        let detalle = ""; // Declara e inicializa "detalle"

        if (op === "push") { // Evalúa condición
            frutas.push(nueva); // Ejecuta llamada o método
            detalle = `push("${nueva}")`; // Asigna valor
        } else if (op === "pop") { // Instrucción JavaScript
            const eliminado = frutas.pop(); // Declara e inicializa "eliminado"
            detalle = `pop() -> eliminó ${JSON.stringify(eliminado)}`; // Asigna valor
        } else if (op === "unshift") { // Instrucción JavaScript
            frutas.unshift(nueva); // Ejecuta llamada o método
            detalle = `unshift("${nueva}")`; // Asigna valor
        } else if (op === "shift") { // Instrucción JavaScript
            const eliminado = frutas.shift(); // Declara e inicializa "eliminado"
            detalle = `shift() -> eliminó ${JSON.stringify(eliminado)}`; // Asigna valor
        } else { // Instrucción JavaScript
            frutas = ["Manzana", "Pera", "Naranja"]; // Asigna valor
            detalle = "Reset"; // Asigna valor
        }

        renderFrutas(detalle); // Ejecuta llamada o método
        registrar(`${detalle} -> ${JSON.stringify(frutas)}`); // Ejecuta llamada o método
    });
});

// 2. Pipeline funcional
const preciosBase = [40, 120, 85, 210, 30]; // Declara e inicializa "preciosBase"

document.getElementById("btn-pipeline").addEventListener("click", () => { // Registra escuchador de eventos
    const min = Number(document.getElementById("input-min-precio").value) || 0; // Obtiene referencia DOM para "min"
    const filtrados = preciosBase.filter((p) => p >= min); // Define función flecha "filtrados"
    const conDescuento = filtrados.map((p) => Number((p * 0.9).toFixed(2))); // Define función flecha "conDescuento"
    const total = conDescuento.reduce((acc, n) => acc + n, 0); // Define función flecha "total"

    document.getElementById("out-pipeline").textContent =
        `Original (intacto): ${JSON.stringify(preciosBase)}\n1) filter(>= ${min}): ${JSON.stringify(filtrados)}\n2) map(-10%): ${JSON.stringify(conDescuento)}\n3) reduce(suma): $${total.toFixed(2)}`; // Instrucción JavaScript
    registrar(`Pipeline >= ${min} -> Total: $${total.toFixed(2)}`); // Ejecuta llamada o método
});

// 3. Inmutables ES2023
const numerosES2023 = [30, 5, 100, 20]; // Declara e inicializa "numerosES2023"

document.querySelectorAll("[data-es2023]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const tipo = btn.dataset.es2023; // Declara e inicializa "tipo"
        let copia; // Declara e inicializa "copia"
        let etiqueta = ""; // Declara e inicializa "etiqueta"

        if (tipo === "sort") { // Evalúa condición
            copia = numerosES2023.toSorted((a, b) => a - b); // Asigna valor
            etiqueta = ".toSorted((a, b) => a - b)"; // Asigna valor
        } else if (tipo === "rev") { // Instrucción JavaScript
            copia = numerosES2023.toReversed(); // Asigna valor
            etiqueta = ".toReversed()"; // Asigna valor
        } else { // Instrucción JavaScript
            copia = numerosES2023.with(-1, 999); // Asigna valor
            etiqueta = ".with(-1, 999)"; // Asigna valor
        }

        document.getElementById("out-es2023").textContent =
            `Método: ${etiqueta}\nOriginal (intacto): ${JSON.stringify(numerosES2023)}\nNuevo Array:        ${JSON.stringify(copia)}`; // Instrucción JavaScript
        registrar(`${etiqueta} -> ${JSON.stringify(copia)} (original intacto)`); // Ejecuta llamada o método
    });
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

renderFrutas(); // Ejecuta llamada o método
registrar("Laboratorio de Arrays listo."); // Ejecuta llamada o método
