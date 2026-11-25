/**
 * GUÍA INTERACTIVA: CONCATENACIÓN Y TEMPLATE LITERALS
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

// 1. Comparación de métodos de concatenación
function generarComparacion() { // Define función reutilizable
    const nombre = document.getElementById("cat-nombre").value.trim() || "Invitado"; // Declara e inicializa variable local
    const lenguaje = document.getElementById("cat-lenguaje").value.trim() || "JS"; // Declara e inicializa variable local

    const tradicional = "Hola, soy " + nombre + " y aprendo " + lenguaje + "."; // Declara e inicializa variable local
    const template = `Hola, soy ${nombre}\ny domino ${lenguaje} (ES2025).`; // Declara e inicializa variable local
    const conConcat = "Aprendiendo ".concat(lenguaje, " con ", nombre, "."); // Declara e inicializa variable local
    const conJoin = ["Usuario:", nombre, "| Stack:", lenguaje].join(" "); // Declara e inicializa variable local

    document.getElementById("out-cat").textContent =
        `1) Operador (+):\n${tradicional}\n\n2) Template Literal:\n${template}\n\n3) .concat():\n${conConcat}\n\n4) Array.join():\n${conJoin}`;
    registrar(`Concatenación generada para ${nombre} (${lenguaje}).`);
}

document.getElementById("btn-generar-cat").addEventListener("click", generarComparacion); // Obtiene referencia al elemento del DOM

// 2. Coerción de tipos
document.querySelectorAll("[data-coercion]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const caso = btn.dataset.coercion; // Declara e inicializa variable local
        let res; // Declara e inicializa variable local
        let expr; // Declara e inicializa variable local

        if (caso === "5_str5") { // Evalúa condición lógica
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
document.getElementById("btn-xss-safe").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const entrada = document.getElementById("xss-input").value; // Declara e inicializa variable local
    const out = document.getElementById("out-xss"); // Declara e inicializa variable local
    out.textContent = `Renderizado seguro con textContent:\n${entrada}`; // Actualiza contenido en el DOM
    registrar("Texto insertado de forma segura usando textContent (sin riesgo XSS).");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

generarComparacion();

