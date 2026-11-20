/**
 * GUÍA INTERACTIVA: ARRAYS Y MÉTODOS (ES2023+)
 */

"use strict";

const liveConsole = document.getElementById("live-console");

function registrar(mensaje, tipo = "ok") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`;
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje);
}

// 1. Métodos Mutables
let frutas = ["Manzana", "Pera", "Naranja"];
const outMut = document.getElementById("out-arr-mut");

function renderFrutas(accion = "Estado inicial") {
    outMut.textContent =
        `Acción: ${accion}\nArray: ${JSON.stringify(frutas)}\nLongitud: ${frutas.length} | Último (.at(-1)): ${frutas.at(-1) ?? "vacío"}`;
}

document.querySelectorAll("[data-arr]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const op = btn.dataset.arr;
        const nueva = document.getElementById("input-fruta").value.trim() || "Uva";
        let detalle = "";

        if (op === "push") {
            frutas.push(nueva);
            detalle = `push("${nueva}")`;
        } else if (op === "pop") {
            const eliminado = frutas.pop();
            detalle = `pop() -> eliminó ${JSON.stringify(eliminado)}`;
        } else if (op === "unshift") {
            frutas.unshift(nueva);
            detalle = `unshift("${nueva}")`;
        } else if (op === "shift") {
            const eliminado = frutas.shift();
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
const preciosBase = [40, 120, 85, 210, 30];

document.getElementById("btn-pipeline").addEventListener("click", () => {
    const min = Number(document.getElementById("input-min-precio").value) || 0;
    const filtrados = preciosBase.filter((p) => p >= min);
    const conDescuento = filtrados.map((p) => Number((p * 0.9).toFixed(2)));
    const total = conDescuento.reduce((acc, n) => acc + n, 0);

    document.getElementById("out-pipeline").textContent =
        `Original (intacto): ${JSON.stringify(preciosBase)}\n1) filter(>= ${min}): ${JSON.stringify(filtrados)}\n2) map(-10%): ${JSON.stringify(conDescuento)}\n3) reduce(suma): $${total.toFixed(2)}`;
    registrar(`Pipeline >= ${min} -> Total: $${total.toFixed(2)}`);
});

// 3. Inmutables ES2023
const numerosES2023 = [30, 5, 100, 20];

document.querySelectorAll("[data-es2023]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const tipo = btn.dataset.es2023;
        let copia;
        let etiqueta = "";

        if (tipo === "sort") {
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

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

renderFrutas();
registrar("Laboratorio de Arrays listo.");
