/**
 * GUÍA INTERACTIVA: OPERADORES EN JAVASCRIPT (ES2020+)
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

// 1. Asignación compuesta
let valor = 10;
const outAcumulador = document.getElementById("out-acumulador");

document.querySelectorAll("[data-op]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const op = btn.dataset.op;
        const previo = valor;
        let expresion = "";

        if (op === "add") { valor += 5; expresion = `${previo} += 5`; }
        else if (op === "sub") { valor -= 3; expresion = `${previo} -= 3`; }
        else if (op === "mul") { valor *= 2; expresion = `${previo} *= 2`; }
        else if (op === "pow") { valor **= 2; expresion = `${previo} **= 2`; }
        else if (op === "mod") { valor %= 3; expresion = `${previo} %= 3`; }
        else { valor = 10; expresion = "Reset a 10"; }

        outAcumulador.textContent = `Operación: ${expresion}\nValor actual: ${valor}`;
        registrar(`Asignación (${expresion}) -> ${valor}`);
    });
});

// 2. Comparación == vs ===
const paresComparacion = {
    "5_str5": { a: 5, b: "5", label: '5 y "5"' },
    "0_false": { a: 0, b: false, label: "0 y false" },
    "empty_0": { a: "", b: 0, label: '"" y 0' },
    "null_undef": { a: null, b: undefined, label: "null y undefined" },
    "5_5": { a: 5, b: 5, label: "5 y 5" }
};

document.getElementById("btn-comparar").addEventListener("click", () => {
    const par = paresComparacion[document.getElementById("cmp-preset").value];
    // eslint-disable-next-line eqeqeq
    const debil = par.a == par.b;
    const estricta = par.a === par.b;

    document.getElementById("out-comparar").textContent =
        `Comparando ${par.label}:\n  ==  (débil):    ${debil}\n  === (estricta): ${estricta}`;
    registrar(`Comparar ${par.label} -> ==: ${debil}, ===: ${estricta}`, debil !== estricta ? "warn" : "ok");
});

// 3. || vs ??
const valoresNullish = {
    "0": { v: 0, label: "0" },
    "empty": { v: "", label: '""' },
    "false": { v: false, label: "false" },
    "null": { v: null, label: "null" },
    "undefined": { v: undefined, label: "undefined" }
};

document.getElementById("btn-nullish").addEventListener("click", () => {
    const item = valoresNullish[document.getElementById("nullish-input").value];
    const conOr = item.v || 100;
    const conNullish = item.v ?? 100;

    document.getElementById("out-nullish").textContent =
        `Entrada: ${item.label}\n  entrada || 100 -> ${JSON.stringify(conOr)}\n  entrada ?? 100 -> ${JSON.stringify(conNullish)}`;
    registrar(`OR vs Nullish (${item.label}) -> ||: ${conOr}, ??: ${conNullish}`);
});

// 4. Optional Chaining ?.
function evaluarCadena(usuario, etiqueta) {
    const ciudad = usuario.perfil?.direccion?.ciudad ?? "Sin ciudad registrada";
    document.getElementById("out-chain").textContent =
        `${etiqueta}\nResultado seguro: "${ciudad}" (cero errores lanzados)`;
    registrar(`Optional Chaining (${etiqueta}) -> "${ciudad}"`);
}

document.getElementById("btn-chain-ok").addEventListener("click", () => {
    evaluarCadena({ perfil: { direccion: { ciudad: "Bogotá" } } }, "Objeto completo");
});

document.getElementById("btn-chain-null").addEventListener("click", () => {
    evaluarCadena({ perfil: null }, "Objeto con perfil: null");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Operadores listo.");
