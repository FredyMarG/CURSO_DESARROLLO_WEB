/**
 * GUÍA INTERACTIVA: VARIABLES, SCOPE Y TIPOS DE DATOS (ES2023+)
 * Demuestra declaración, tipos primitivos/referencia, TDZ y validación sin alert/prompt.
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

/**
 * Registra un mensaje tanto en el panel visual del DOM como en la consola real del navegador.
 */
function registrar(mensaje, tipo = "normal") { // Declara función
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = `log-line ${tipo}`; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor

    if (tipo === "err") console.error(mensaje); // Evalúa condición
    else if (tipo === "warn") console.warn(mensaje); // Evalúa condición alternativa
    else console.log(mensaje); // Rama alternativa
}

console.log("%c--- LABORATORIO INTERACTIVO: VARIABLES ---", "color: #3b82f6; font-weight: bold;"); // Imprime salida en consola

// 1. Inspector de typeof y comprobaciones seguras
const muestras = { // Declara e inicializa "muestras"
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

document.getElementById("btn-inspeccionar").addEventListener("click", () => { // Registra escuchador de eventos
    const clave = document.getElementById("preset-tipo").value; // Obtiene referencia DOM para "clave"
    const { valor, etiqueta } = muestras[clave]; // Declara e inicializa "variable"
    const tipo = typeof valor; // Declara e inicializa "tipo"

    let notaExtra = "Comportamiento estándar."; // Declara e inicializa "notaExtra"
    if (valor === null) notaExtra = "⚠️ typeof null devuelve 'object' por un bug histórico de 1995. Valida con valor === null."; // Evalúa condición
    else if (Array.isArray(valor)) notaExtra = "⚠️ typeof [] devuelve 'object'. Valida siempre con Array.isArray(valor)."; // Evalúa condición alternativa
    else if (Number.isNaN(valor)) notaExtra = "⚠️ typeof NaN devuelve 'number'. Valida con Number.isNaN(valor)."; // Evalúa condición alternativa

    const salida = `Valor: ${etiqueta}\ntypeof: "${tipo}"\nArray.isArray: ${Array.isArray(valor)}\nNumber.isNaN: ${Number.isNaN(valor)}\n\n${notaExtra}`; // Declara e inicializa "salida"
    document.getElementById("out-tipo").textContent = salida; // Actualiza contenido en el DOM
    registrar(`typeof ${etiqueta} -> "${tipo}"`, tipo === "object" ? "warn" : "ok"); // Ejecuta llamada o método
});

// 2. Conversión segura de inputs del DOM
document.getElementById("btn-calcular").addEventListener("click", () => { // Registra escuchador de eventos
    const nombre = document.getElementById("input-nombre").value.trim() || "Estudiante"; // Obtiene referencia DOM para "nombre"
    const entrada = document.getElementById("input-numero").value.trim(); // Obtiene referencia DOM para "entrada"
    const out = document.getElementById("out-calculo"); // Obtiene referencia DOM para "out"

    if (entrada === "") { // Evalúa condición
        out.textContent = "❌ Por favor ingresa un número."; // Actualiza contenido en el DOM
        registrar("Entrada vacía al calcular cuadrado.", "err"); // Ejecuta llamada o método
        return; // Retorna resultado
    }

    const numero = Number(entrada); // Declara e inicializa "numero"
    if (Number.isNaN(numero) || !Number.isFinite(numero)) { // Evalúa condición
        out.textContent = `❌ "${entrada}" es de tipo string y no se pudo convertir a un número válido.`; // Actualiza contenido en el DOM
        registrar(`Conversión fallida para "${entrada}"`, "err"); // Ejecuta llamada o método
        return; // Retorna resultado
    }

    const resultado = numero ** 2; // Declara e inicializa "resultado"
    out.textContent = `Hola ${nombre} 👋\nEntrada original: "${entrada}" (string)\nConvertido: ${numero} (number)\nResultado (${numero}²): ${resultado}`; // Actualiza contenido en el DOM
    registrar(`Hola ${nombre}: ${numero}² = ${resultado}`, "ok"); // Ejecuta llamada o método
});

// 3. Scope de Bloque y TDZ
document.getElementById("btn-scope-block").addEventListener("click", () => { // Registra escuchador de eventos
    let mensaje = ""; // Declara e inicializa "mensaje"
    if (true) { // Evalúa condición
        var filtrada = "Soy var (me escapo del bloque if)"; // Declara e inicializa "filtrada"
        let privada = "Soy let (solo vivo dentro del if)"; // Declara e inicializa "privada"
        mensaje += `Dentro del bloque:\n  var filtrada = "${filtrada}"\n  let privada = "${privada}"\n\n`; // Instrucción JavaScript
    }
    mensaje += `Fuera del bloque:\n  filtrada -> "${filtrada}" (✅ accesible)\n  privada -> ReferenceError (❌ protegida por scope de bloque)`; // Instrucción JavaScript
    document.getElementById("out-scope").textContent = mensaje; // Actualiza contenido en el DOM
    registrar("Scope comprobado: 'var' se filtró fuera del bloque if; 'let' quedó encapsulada.", "warn"); // Ejecuta llamada o método
});

document.getElementById("btn-tdz").addEventListener("click", () => { // Registra escuchador de eventos
    try { // Inicia bloque protegido contra errores
        // Simulamos la lectura antes de inicializar dentro de un bloque aislado
        (() => { // Instrucción JavaScript
            // @ts-ignore - demostración intencional de TDZ
            console.log(temporal); // Imprime salida en consola
            let temporal = 100; // Declara e inicializa "temporal"
        })(); // Ejecuta llamada o método
    } catch (error) { // Instrucción JavaScript
        document.getElementById("out-scope").textContent =
            `TDZ activada al leer 'let temporal' antes de su declaración:\n${error.name}: ${error.message}`; // Instrucción JavaScript
        registrar(`TDZ capturada: ${error.name} - ${error.message}`, "err"); // Ejecuta llamada o método
    }
});

// 4. Valor vs Referencia
document.getElementById("btn-ref-compartida").addEventListener("click", () => { // Registra escuchador de eventos
    const original = { nombre: "Ana", rol: "Junior" }; // Declara e inicializa "original"
    const copiaPorReferencia = original; // Apuntan al mismo objeto
    copiaPorReferencia.rol = "Senior"; // Asigna valor

    document.getElementById("out-ref").textContent =
        `Al usar '=' ambos apuntan al mismo objeto:\noriginal.rol = "${original.rol}" ⚠️ (cambió también)\ncopia.rol = "${copiaPorReferencia.rol}"`; // Instrucción JavaScript
    registrar("Referencia compartida: mutar la copia afectó al objeto original.", "warn"); // Ejecuta llamada o método
});

document.getElementById("btn-ref-clon").addEventListener("click", () => { // Registra escuchador de eventos
    const original = { nombre: "Ana", rol: "Junior" }; // Declara e inicializa "original"
    const clonReal = structuredClone(original); // Declara e inicializa "clonReal"
    clonReal.rol = "Senior"; // Asigna valor

    document.getElementById("out-ref").textContent =
        `Al usar structuredClone():\noriginal.rol = "${original.rol}" ✅ (intacto)\nclonReal.rol = "${clonReal.rol}"`; // Instrucción JavaScript
    registrar("structuredClone(): copia independiente sin mutar el original.", "ok"); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

registrar("Laboratorio de Variables listo. Interactúa con las tarjetas.", "ok"); // Ejecuta llamada o método
