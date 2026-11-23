/**
 * GUÍA INTERACTIVA: VARIABLES, SCOPE Y TIPOS DE DATOS (ES2023+)
 * Demuestra declaración, tipos primitivos/referencia, TDZ y validación sin alert/prompt.
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console");

/**
 * Registra un mensaje tanto en el panel visual del DOM como en la consola real del navegador.
 */
function registrar(mensaje, tipo = "normal") {
    const linea = document.createElement("div");
    linea.className = `log-line ${tipo}`;
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;

    if (tipo === "err") console.error(mensaje);
    else if (tipo === "warn") console.warn(mensaje); // Evalúa condición alternativa
    else console.log(mensaje); // Rama alternativa
}

console.log("%c--- LABORATORIO INTERACTIVO: VARIABLES ---", "color: #3b82f6; font-weight: bold;"); // Imprime salida en consola

// 1. Inspector de typeof y comprobaciones seguras
const muestras = {
    string: { valor: "Hola JS", etiqueta: '"Hola JS"' },
    number: { valor: 42, etiqueta: "42" },
    bigint: { valor: 9007199254740995n, etiqueta: "9007199254740995n" },
    boolean: { valor: true, etiqueta: "true" },
    undefined: { valor: undefined, etiqueta: "undefined" },
    null: { valor: null, etiqueta: "null" },
    nan: { valor: NaN, etiqueta: "NaN" },
    array: { valor: [1, 2, 3], etiqueta: "[1, 2, 3]" },
    symbol: { valor: Symbol("id"), etiqueta: 'Symbol("id")' }
};

document.getElementById("btn-inspeccionar").addEventListener("click", () => {
    const clave = document.getElementById("preset-tipo").value;
    const { valor, etiqueta } = muestras[clave];
    const tipo = typeof valor;

    let notaExtra = "Comportamiento estándar.";
    if (valor === null) notaExtra = "⚠️ typeof null devuelve 'object' por un bug histórico de 1995. Valida con valor === null.";
    else if (Array.isArray(valor)) notaExtra = "⚠️ typeof [] devuelve 'object'. Valida siempre con Array.isArray(valor)."; // Evalúa condición alternativa
    else if (Number.isNaN(valor)) notaExtra = "⚠️ typeof NaN devuelve 'number'. Valida con Number.isNaN(valor)."; // Evalúa condición alternativa

    const salida = `Valor: ${etiqueta}\ntypeof: "${tipo}"\nArray.isArray: ${Array.isArray(valor)}\nNumber.isNaN: ${Number.isNaN(valor)}\n\n${notaExtra}`;
    document.getElementById("out-tipo").textContent = salida; // Actualiza contenido en el DOM
    registrar(`typeof ${etiqueta} -> "${tipo}"`, tipo === "object" ? "warn" : "ok");
});

// 2. Conversión segura de inputs del DOM
document.getElementById("btn-calcular").addEventListener("click", () => {
    const nombre = document.getElementById("input-nombre").value.trim() || "Estudiante";
    const entrada = document.getElementById("input-numero").value.trim();
    const out = document.getElementById("out-calculo");

    if (entrada === "") {
        out.textContent = "❌ Por favor ingresa un número."; // Actualiza contenido en el DOM
        registrar("Entrada vacía al calcular cuadrado.", "err");
        return;
    }

    const numero = Number(entrada);
    if (Number.isNaN(numero) || !Number.isFinite(numero)) {
        out.textContent = `❌ "${entrada}" es de tipo string y no se pudo convertir a un número válido.`; // Actualiza contenido en el DOM
        registrar(`Conversión fallida para "${entrada}"`, "err");
        return;
    }

    const resultado = numero ** 2;
    out.textContent = `Hola ${nombre} 👋\nEntrada original: "${entrada}" (string)\nConvertido: ${numero} (number)\nResultado (${numero}²): ${resultado}`; // Actualiza contenido en el DOM
    registrar(`Hola ${nombre}: ${numero}² = ${resultado}`, "ok");
});

// 3. Scope de Bloque y TDZ
document.getElementById("btn-scope-block").addEventListener("click", () => {
    let mensaje = "";
    if (true) {
        var filtrada = "Soy var (me escapo del bloque if)";
        let privada = "Soy let (solo vivo dentro del if)";
        mensaje += `Dentro del bloque:\n  var filtrada = "${filtrada}"\n  let privada = "${privada}"\n\n`;
    }
    mensaje += `Fuera del bloque:\n  filtrada -> "${filtrada}" (✅ accesible)\n  privada -> ReferenceError (❌ protegida por scope de bloque)`;
    document.getElementById("out-scope").textContent = mensaje; // Actualiza contenido en el DOM
    registrar("Scope comprobado: 'var' se filtró fuera del bloque if; 'let' quedó encapsulada.", "warn");
});

document.getElementById("btn-tdz").addEventListener("click", () => {
    try { // Inicia bloque protegido contra errores
        // Simulamos la lectura antes de inicializar dentro de un bloque aislado
        (() => {
            // @ts-ignore - demostración intencional de TDZ
            console.log(temporal); // Imprime salida en consola
            let temporal = 100;
        })();
    } catch (error) {
        document.getElementById("out-scope").textContent =
            `TDZ activada al leer 'let temporal' antes de su declaración:\n${error.name}: ${error.message}`;
        registrar(`TDZ capturada: ${error.name} - ${error.message}`, "err");
    }
});

// 4. Valor vs Referencia
document.getElementById("btn-ref-compartida").addEventListener("click", () => {
    const original = { nombre: "Ana", rol: "Junior" };
    const copiaPorReferencia = original; // Apuntan al mismo objeto
    copiaPorReferencia.rol = "Senior";

    document.getElementById("out-ref").textContent =
        `Al usar '=' ambos apuntan al mismo objeto:\noriginal.rol = "${original.rol}" ⚠️ (cambió también)\ncopia.rol = "${copiaPorReferencia.rol}"`;
    registrar("Referencia compartida: mutar la copia afectó al objeto original.", "warn");
});

document.getElementById("btn-ref-clon").addEventListener("click", () => {
    const original = { nombre: "Ana", rol: "Junior" };
    const clonReal = structuredClone(original);
    clonReal.rol = "Senior";

    document.getElementById("out-ref").textContent =
        `Al usar structuredClone():\noriginal.rol = "${original.rol}" ✅ (intacto)\nclonReal.rol = "${clonReal.rol}"`;
    registrar("structuredClone(): copia independiente sin mutar el original.", "ok");
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

registrar("Laboratorio de Variables listo. Interactúa con las tarjetas.", "ok");
