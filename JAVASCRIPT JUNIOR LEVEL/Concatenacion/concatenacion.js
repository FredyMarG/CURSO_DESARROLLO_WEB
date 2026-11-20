/**
 * GUÍA INTERACTIVA: CONCATENACIÓN Y TEMPLATE LITERALS
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

// 1. Comparación de métodos de concatenación
function generarComparacion() {
    const nombre = document.getElementById("cat-nombre").value.trim() || "Invitado";
    const lenguaje = document.getElementById("cat-lenguaje").value.trim() || "JS";

    const tradicional = "Hola, soy " + nombre + " y aprendo " + lenguaje + ".";
    const template = `Hola, soy ${nombre}\ny domino ${lenguaje} (ES2025).`;
    const conConcat = "Aprendiendo ".concat(lenguaje, " con ", nombre, ".");
    const conJoin = ["Usuario:", nombre, "| Stack:", lenguaje].join(" ");

    document.getElementById("out-cat").textContent =
        `1) Operador (+):\n${tradicional}\n\n2) Template Literal:\n${template}\n\n3) .concat():\n${conConcat}\n\n4) Array.join():\n${conJoin}`;
    registrar(`Concatenación generada para ${nombre} (${lenguaje}).`);
}

document.getElementById("btn-generar-cat").addEventListener("click", generarComparacion);

// 2. Coerción de tipos
document.querySelectorAll("[data-coercion]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const caso = btn.dataset.coercion;
        let res;
        let expr;

        if (caso === "5_str5") {
            expr = '5 + "5"';
            res = 5 + "5";
        } else if (caso === "str_5_3") {
            expr = '"Total: " + 5 + 3';
            res = "Total: " + 5 + 3;
        } else {
            expr = '"Total: " + (5 + 3)';
            res = "Total: " + (5 + 3);
        }

        document.getElementById("out-coercion").textContent =
            `Expresión: ${expr}\nResultado: ${JSON.stringify(res)}\nTipo: ${typeof res}`;
        registrar(`${expr} -> ${JSON.stringify(res)}`, caso === "str_paren" ? "ok" : "warn");
    });
});

// 3. Seguridad con textContent
document.getElementById("btn-xss-safe").addEventListener("click", () => {
    const entrada = document.getElementById("xss-input").value;
    const out = document.getElementById("out-xss");
    out.textContent = `Renderizado seguro con textContent:\n${entrada}`;
    registrar("Texto insertado de forma segura usando textContent (sin riesgo XSS).");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

generarComparacion();
