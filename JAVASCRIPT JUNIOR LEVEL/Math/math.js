/**
 * GUÍA INTERACTIVA: OBJETO MATH Y PRECISIÓN NUMÉRICA
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

// 1. Redondeo
document.getElementById("btn-redondear").addEventListener("click", () => { // Registra escuchador de eventos
    const n = Number(document.getElementById("math-num").value); // Obtiene referencia DOM para "n"
    if (Number.isNaN(n)) return; // Evalúa condición

    document.getElementById("out-redondeo").textContent =
        `Entrada: ${n}\n` +
        `Math.round(${n}): ${Math.round(n)}\n` +
        `Math.floor(${n}): ${Math.floor(n)}\n` +
        `Math.ceil(${n}):  ${Math.ceil(n)}\n` +
        `Math.trunc(${n}): ${Math.trunc(n)}\n` +
        `Math.sign(${n}):  ${Math.sign(n)}`; // Instrucción JavaScript
    registrar(`Redondeos para ${n} calculados.`); // Ejecuta llamada o método
});

// 2. Aleatorio en rango y UUID
document.getElementById("btn-random").addEventListener("click", () => { // Registra escuchador de eventos
    const min = Math.ceil(Number(document.getElementById("math-min").value) || 1); // Obtiene referencia DOM para "min"
    const max = Math.floor(Number(document.getElementById("math-max").value) || 6); // Obtiene referencia DOM para "max"
    const low = Math.min(min, max); // Declara e inicializa "low"
    const high = Math.max(min, max); // Declara e inicializa "high"

    const aleatorio = Math.floor(Math.random() * (high - low + 1)) + low; // Declara e inicializa "aleatorio"
    document.getElementById("out-random").textContent =
        `Rango [${low}, ${high}] -> Resultado: ${aleatorio}`; // Instrucción JavaScript
    registrar(`Aleatorio [${low}, ${high}] -> ${aleatorio}`); // Ejecuta llamada o método
});

document.getElementById("btn-uuid").addEventListener("click", () => { // Registra escuchador de eventos
    const uuid = crypto.randomUUID(); // Declara e inicializa "uuid"
    document.getElementById("out-random").textContent = `crypto.randomUUID():\n${uuid}`; // Actualiza contenido en el DOM
    registrar(`UUID generado: ${uuid}`); // Ejecuta llamada o método
});

// 3. Precisión flotante
document.getElementById("btn-flotante").addEventListener("click", () => { // Registra escuchador de eventos
    const suma = 0.1 + 0.2; // Declara e inicializa "suma"
    const exacta = suma === 0.3; // Declara e inicializa "exacta"
    const conEpsilon = Math.abs(suma - 0.3) < Number.EPSILON; // Declara e inicializa "conEpsilon"
    const centavos = (10 + 20) / 100; // Declara e inicializa "centavos"

    document.getElementById("out-flotante").textContent =
        `0.1 + 0.2 = ${suma}\n` +
        `(0.1 + 0.2) === 0.3 -> ${exacta}\n` +
        `Con Number.EPSILON -> ${conEpsilon}\n` +
        `En centavos (10 + 20) / 100 -> ${centavos}`; // Instrucción JavaScript
    registrar(`0.1 + 0.2 = ${suma} (EPSILON=${conEpsilon})`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Math listo."); // Ejecuta llamada o método
