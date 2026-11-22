/**
 * GUÍA INTERACTIVA: CONCATENACIÓN Y TEMPLATE LITERALS
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

// 1. Comparación de métodos de concatenación
function generarComparacion() { // Declara función
    const nombre = document.getElementById("cat-nombre").value.trim() || "Invitado"; // Obtiene referencia DOM para "nombre"
    const lenguaje = document.getElementById("cat-lenguaje").value.trim() || "JS"; // Obtiene referencia DOM para "lenguaje"

    const tradicional = "Hola, soy " + nombre + " y aprendo " + lenguaje + "."; // Declara e inicializa "tradicional"
    const template = `Hola, soy ${nombre}\ny domino ${lenguaje} (ES2025).`; // Declara e inicializa "template"
    const conConcat = "Aprendiendo ".concat(lenguaje, " con ", nombre, "."); // Declara e inicializa "conConcat"
    const conJoin = ["Usuario:", nombre, "| Stack:", lenguaje].join(" "); // Declara e inicializa "conJoin"

    document.getElementById("out-cat").textContent =
        `1) Operador (+):\n${tradicional}\n\n2) Template Literal:\n${template}\n\n3) .concat():\n${conConcat}\n\n4) Array.join():\n${conJoin}`; // Instrucción JavaScript
    registrar(`Concatenación generada para ${nombre} (${lenguaje}).`); // Ejecuta llamada o método
}

document.getElementById("btn-generar-cat").addEventListener("click", generarComparacion); // Registra escuchador de eventos

// 2. Coerción de tipos
document.querySelectorAll("[data-coercion]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const caso = btn.dataset.coercion; // Declara e inicializa "caso"
        let res; // Declara e inicializa "res"
        let expr; // Declara e inicializa "expr"

        if (caso === "5_str5") { // Evalúa condición
            expr = '5 + "5"'; // Asigna valor
            res = 5 + "5"; // Asigna valor
        } else if (caso === "str_5_3") { // Instrucción JavaScript
            expr = '"Total: " + 5 + 3'; // Asigna valor
            res = "Total: " + 5 + 3; // Asigna valor
        } else { // Instrucción JavaScript
            expr = '"Total: " + (5 + 3)'; // Asigna valor
            res = "Total: " + (5 + 3); // Asigna valor
        }

        document.getElementById("out-coercion").textContent =
            `Expresión: ${expr}\nResultado: ${JSON.stringify(res)}\nTipo: ${typeof res}`; // Instrucción JavaScript
        registrar(`${expr} -> ${JSON.stringify(res)}`, caso === "str_paren" ? "ok" : "warn"); // Ejecuta llamada o método
    });
});

// 3. Seguridad con textContent
document.getElementById("btn-xss-safe").addEventListener("click", () => { // Registra escuchador de eventos
    const entrada = document.getElementById("xss-input").value; // Obtiene referencia DOM para "entrada"
    const out = document.getElementById("out-xss"); // Obtiene referencia DOM para "out"
    out.textContent = `Renderizado seguro con textContent:\n${entrada}`; // Actualiza contenido en el DOM
    registrar("Texto insertado de forma segura usando textContent (sin riesgo XSS)."); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

generarComparacion(); // Ejecuta llamada o método
