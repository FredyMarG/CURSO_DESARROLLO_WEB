/**
 * GUÍA INTERACTIVA: OBJETO MATH Y PRECISIÓN NUMÉRICA
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

// 1. Redondeo
document.getElementById("btn-redondear").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const n = Number(document.getElementById("math-num").value); // Declara e inicializa variable local
    if (Number.isNaN(n)) return; // Evalúa condición lógica

    document.getElementById("out-redondeo").textContent =
        `Entrada: ${n}\n` +
        `Math.round(${n}): ${Math.round(n)}\n` +
        `Math.floor(${n}): ${Math.floor(n)}\n` +
        `Math.ceil(${n}):  ${Math.ceil(n)}\n` +
        `Math.trunc(${n}): ${Math.trunc(n)}\n` +
        `Math.sign(${n}):  ${Math.sign(n)}`;
    registrar(`Redondeos para ${n} calculados.`);
});

// 2. Aleatorio en rango y UUID
document.getElementById("btn-random").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const min = Math.ceil(Number(document.getElementById("math-min").value) || 1); // Declara e inicializa variable local
    const max = Math.floor(Number(document.getElementById("math-max").value) || 6); // Declara e inicializa variable local
    const low = Math.min(min, max); // Declara e inicializa variable local
    const high = Math.max(min, max); // Declara e inicializa variable local

    const aleatorio = Math.floor(Math.random() * (high - low + 1)) + low; // Declara e inicializa variable local
    document.getElementById("out-random").textContent =
        `Rango [${low}, ${high}] -> Resultado: ${aleatorio}`;
    registrar(`Aleatorio [${low}, ${high}] -> ${aleatorio}`);
});

document.getElementById("btn-uuid").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const uuid = crypto.randomUUID(); // Declara e inicializa variable local
    document.getElementById("out-random").textContent = `crypto.randomUUID():\n${uuid}`; // Actualiza contenido en el DOM
    registrar(`UUID generado: ${uuid}`);
});

// 3. Precisión flotante
document.getElementById("btn-flotante").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const suma = 0.1 + 0.2; // Declara e inicializa variable local
    const exacta = suma === 0.3; // Declara e inicializa variable local
    const conEpsilon = Math.abs(suma - 0.3) < Number.EPSILON; // Declara e inicializa variable local
    const centavos = (10 + 20) / 100; // Declara e inicializa variable local

    document.getElementById("out-flotante").textContent =
        `0.1 + 0.2 = ${suma}\n` +
        `(0.1 + 0.2) === 0.3 -> ${exacta}\n` +
        `Con Number.EPSILON -> ${conEpsilon}\n` +
        `En centavos (10 + 20) / 100 -> ${centavos}`;
    registrar(`0.1 + 0.2 = ${suma} (EPSILON=${conEpsilon})`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Math listo.");

