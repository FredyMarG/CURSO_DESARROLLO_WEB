/**
 * GUÍA INTERACTIVA: ARRAYS Y MÉTODOS (ES2023+)
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Declara e inicializa variable local

function registrar(mensaje, tipo = "ok") { // Define función reutilizable
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
}

// 1. Métodos Mutables
let frutas = ["Manzana", "Pera", "Naranja"]; // Declara e inicializa variable local
const outMut = document.getElementById("out-arr-mut"); // Declara e inicializa variable local

function renderFrutas(accion = "Estado inicial") { // Define función reutilizable
    outMut.textContent =
        `Acción: ${accion}\nArray: ${JSON.stringify(frutas)}\nLongitud: ${frutas.length} | Último (.at(-1)): ${frutas.at(-1) ?? "vacío"}`;
}

document.querySelectorAll("[data-arr]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const op = btn.dataset.arr; // Declara e inicializa variable local
        const nueva = document.getElementById("input-fruta").value.trim() || "Uva"; // Declara e inicializa variable local
        let detalle = ""; // Declara e inicializa variable local

        if (op === "push") { // Evalúa condición lógica
            frutas.push(nueva);
            detalle = `push("${nueva}")`;
        } else if (op === "pop") {
            const eliminado = frutas.pop(); // Declara e inicializa variable local
            detalle = `pop() -> eliminó ${JSON.stringify(eliminado)}`;
        } else if (op === "unshift") {
            frutas.unshift(nueva);
            detalle = `unshift("${nueva}")`;
        } else if (op === "shift") {
            const eliminado = frutas.shift(); // Declara e inicializa variable local
            detalle = `shift() -> eliminó ${JSON.stringify(eliminado)}`;
        } else {
            frutas = ["Manzana", "Pera", "Naranja"];
            detalle = "Reset";
        }

        renderFrutas(detalle);
        registrar(`${detalle} -> ${JSON.stringify(frutas)}`);
    });
});

// 2. Pipeline funcional
const preciosBase = [40, 120, 85, 210, 30]; // Declara e inicializa variable local

document.getElementById("btn-pipeline").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const min = Number(document.getElementById("input-min-precio").value) || 0; // Declara e inicializa variable local
    const filtrados = preciosBase.filter((p) => p >= min); // Declara e inicializa variable local
    const conDescuento = filtrados.map((p) => Number((p * 0.9).toFixed(2))); // Declara e inicializa variable local
    const total = conDescuento.reduce((acc, n) => acc + n, 0); // Declara e inicializa variable local

    document.getElementById("out-pipeline").textContent =
        `Original (intacto): ${JSON.stringify(preciosBase)}\n1) filter(>= ${min}): ${JSON.stringify(filtrados)}\n2) map(-10%): ${JSON.stringify(conDescuento)}\n3) reduce(suma): $${total.toFixed(2)}`;
    registrar(`Pipeline >= ${min} -> Total: $${total.toFixed(2)}`);
});

// 3. Inmutables ES2023
const numerosES2023 = [30, 5, 100, 20]; // Declara e inicializa variable local

document.querySelectorAll("[data-es2023]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const tipo = btn.dataset.es2023; // Declara e inicializa variable local
        let copia; // Declara e inicializa variable local
        let etiqueta = ""; // Declara e inicializa variable local

        if (tipo === "sort") { // Evalúa condición lógica
            copia = numerosES2023.toSorted((a, b) => a - b);
            etiqueta = ".toSorted((a, b) => a - b)";
        } else if (tipo === "rev") {
            copia = numerosES2023.toReversed();
            etiqueta = ".toReversed()";
        } else {
            copia = numerosES2023.with(-1, 999);
            etiqueta = ".with(-1, 999)";
        }

        document.getElementById("out-es2023").textContent =
            `Método: ${etiqueta}\nOriginal (intacto): ${JSON.stringify(numerosES2023)}\nNuevo Array:        ${JSON.stringify(copia)}`;
        registrar(`${etiqueta} -> ${JSON.stringify(copia)} (original intacto)`);
    });
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

renderFrutas();
registrar("Laboratorio de Arrays listo.");

