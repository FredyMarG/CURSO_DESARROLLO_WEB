/**
 * GUÍA INTERACTIVA: OBJETO MATH Y PRECISIÓN NUMÉRICA
 */

"use strict";

const liveConsole = document.getElementById("live-console");

function registrar(mensaje) {
    const linea = document.createElement("div");
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`;
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje);
}

// 1. Redondeo
document.getElementById("btn-redondear").addEventListener("click", () => {
    const n = Number(document.getElementById("math-num").value);
    if (Number.isNaN(n)) return;

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
document.getElementById("btn-random").addEventListener("click", () => {
    const min = Math.ceil(Number(document.getElementById("math-min").value) || 1);
    const max = Math.floor(Number(document.getElementById("math-max").value) || 6);
    const low = Math.min(min, max);
    const high = Math.max(min, max);

    const aleatorio = Math.floor(Math.random() * (high - low + 1)) + low;
    document.getElementById("out-random").textContent =
        `Rango [${low}, ${high}] -> Resultado: ${aleatorio}`;
    registrar(`Aleatorio [${low}, ${high}] -> ${aleatorio}`);
});

document.getElementById("btn-uuid").addEventListener("click", () => {
    const uuid = crypto.randomUUID();
    document.getElementById("out-random").textContent = `crypto.randomUUID():\n${uuid}`;
    registrar(`UUID generado: ${uuid}`);
});

// 3. Precisión flotante
document.getElementById("btn-flotante").addEventListener("click", () => {
    const suma = 0.1 + 0.2;
    const exacta = suma === 0.3;
    const conEpsilon = Math.abs(suma - 0.3) < Number.EPSILON;
    const centavos = (10 + 20) / 100;

    document.getElementById("out-flotante").textContent =
        `0.1 + 0.2 = ${suma}\n` +
        `(0.1 + 0.2) === 0.3 -> ${exacta}\n` +
        `Con Number.EPSILON -> ${conEpsilon}\n` +
        `En centavos (10 + 20) / 100 -> ${centavos}`;
    registrar(`0.1 + 0.2 = ${suma} (EPSILON=${conEpsilon})`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Math listo.");
