/**
 * GUÍA INTERACTIVA: OPERADORES EN JAVASCRIPT (ES2020+)
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

// 1. Asignación compuesta
let valor = 10; // Declara e inicializa "valor"
const outAcumulador = document.getElementById("out-acumulador"); // Obtiene referencia DOM para "outAcumulador"

document.querySelectorAll("[data-op]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const op = btn.dataset.op; // Declara e inicializa "op"
        const previo = valor; // Declara e inicializa "previo"
        let expresion = ""; // Declara e inicializa "expresion"

        if (op === "add") { valor += 5; expresion = `${previo} += 5`; }
        else if (op === "sub") { valor -= 3; expresion = `${previo} -= 3`; }
        else if (op === "mul") { valor *= 2; expresion = `${previo} *= 2`; }
        else if (op === "pow") { valor **= 2; expresion = `${previo} **= 2`; }
        else if (op === "mod") { valor %= 3; expresion = `${previo} %= 3`; }
        else { valor = 10; expresion = "Reset a 10"; }

        outAcumulador.textContent = `Operación: ${expresion}\nValor actual: ${valor}`; // Actualiza contenido en el DOM
        registrar(`Asignación (${expresion}) -> ${valor}`); // Ejecuta llamada o método
    });
});

// 2. Comparación == vs ===
const paresComparacion = { // Declara e inicializa "paresComparacion"
    "5_str5": { a: 5, b: "5", label: '5 y "5"' },
    "0_false": { a: 0, b: false, label: "0 y false" },
    "empty_0": { a: "", b: 0, label: '"" y 0' },
    "null_undef": { a: null, b: undefined, label: "null y undefined" },
    "5_5": { a: 5, b: 5, label: "5 y 5" }
};

document.getElementById("btn-comparar").addEventListener("click", () => { // Registra escuchador de eventos
    const par = paresComparacion[document.getElementById("cmp-preset").value]; // Obtiene referencia DOM para "par"
    // eslint-disable-next-line eqeqeq
    const debil = par.a == par.b; // Declara e inicializa "debil"
    const estricta = par.a === par.b; // Declara e inicializa "estricta"

    document.getElementById("out-comparar").textContent =
        `Comparando ${par.label}:\n  ==  (débil):    ${debil}\n  === (estricta): ${estricta}`; // Instrucción JavaScript
    registrar(`Comparar ${par.label} -> ==: ${debil}, ===: ${estricta}`, debil !== estricta ? "warn" : "ok"); // Ejecuta llamada o método
});

// 3. || vs ??
const valoresNullish = { // Declara e inicializa "valoresNullish"
    "0": { v: 0, label: "0" },
    "empty": { v: "", label: '""' },
    "false": { v: false, label: "false" },
    "null": { v: null, label: "null" },
    "undefined": { v: undefined, label: "undefined" }
};

document.getElementById("btn-nullish").addEventListener("click", () => { // Registra escuchador de eventos
    const item = valoresNullish[document.getElementById("nullish-input").value]; // Obtiene referencia DOM para "item"
    const conOr = item.v || 100; // Declara e inicializa "conOr"
    const conNullish = item.v ?? 100; // Declara e inicializa "conNullish"

    document.getElementById("out-nullish").textContent =
        `Entrada: ${item.label}\n  entrada || 100 -> ${JSON.stringify(conOr)}\n  entrada ?? 100 -> ${JSON.stringify(conNullish)}`; // Instrucción JavaScript
    registrar(`OR vs Nullish (${item.label}) -> ||: ${conOr}, ??: ${conNullish}`); // Ejecuta llamada o método
});

// 4. Optional Chaining ?.
function evaluarCadena(usuario, etiqueta) { // Declara función
    const ciudad = usuario.perfil?.direccion?.ciudad ?? "Sin ciudad registrada"; // Declara e inicializa "ciudad"
    document.getElementById("out-chain").textContent =
        `${etiqueta}\nResultado seguro: "${ciudad}" (cero errores lanzados)`; // Instrucción JavaScript
    registrar(`Optional Chaining (${etiqueta}) -> "${ciudad}"`); // Ejecuta llamada o método
}

document.getElementById("btn-chain-ok").addEventListener("click", () => { // Registra escuchador de eventos
    evaluarCadena({ perfil: { direccion: { ciudad: "Bogotá" } } }, "Objeto completo"); // Ejecuta llamada o método
});

document.getElementById("btn-chain-null").addEventListener("click", () => { // Registra escuchador de eventos
    evaluarCadena({ perfil: null }, "Objeto con perfil: null"); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Operadores listo."); // Ejecuta llamada o método
