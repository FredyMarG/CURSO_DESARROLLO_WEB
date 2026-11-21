/**
 * GUÍA INTERACTIVA: FUNCIONES, PARÁMETROS REST, CALLBACKS Y CLOSURES
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Obtiene referencia DOM para "liveConsole"

window.registrarFuncionLog = function registrar(mensaje) { // Asigna valor
    const linea = document.createElement("div"); // Crea nuevo elemento DOM "linea"
    linea.className = "log-line ok"; // Asigna valor
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea); // Inserta nodo en el DOM
    liveConsole.scrollTop = liveConsole.scrollHeight; // Asigna valor
    console.log(mensaje); // Imprime salida en consola
};

// 1. Parámetros por defecto + Arrow Function
const saludarUsuario = (nombre = "Invitado") => `¡Hola, ${nombre}! Bienvenido a JS moderno.`; // Define función flecha "saludarUsuario"

document.getElementById("btn-saludar").addEventListener("click", () => { // Registra escuchador de eventos
    const raw = document.getElementById("fn-nombre").value.trim(); // Obtiene referencia DOM para "raw"
    const mensaje = raw ? saludarUsuario(raw) : saludarUsuario(undefined); // Declara e inicializa "mensaje"
    document.getElementById("out-saludar").textContent = mensaje; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`saludarUsuario(${raw ? `"${raw}"` : "undefined"}) -> "${mensaje}"`); // Ejecuta llamada o método
});

// 2. Parámetros Rest + Callbacks
function procesarLista(callback, ...numeros) { // Declara función
    return callback(numeros); // Retorna resultado
}

const cbSumar = (arr) => arr.reduce((a, b) => a + b, 0); // Define función flecha "cbSumar"
const cbPromedio = (arr) => (arr.length ? cbSumar(arr) / arr.length : 0); // Define función flecha "cbPromedio"

document.querySelectorAll("[data-cb]").forEach((btn) => { // Instrucción JavaScript
    btn.addEventListener("click", () => { // Registra escuchador de eventos
        const lista = document
            .getElementById("fn-nums")
            .value.split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !Number.isNaN(n)); // Ejecuta llamada o método

        const tipo = btn.dataset.cb; // Declara e inicializa "tipo"
        const resultado = tipo === "sumar" ? procesarLista(cbSumar, ...lista) : procesarLista(cbPromedio, ...lista); // Declara e inicializa "resultado"

        document.getElementById("out-rest").textContent =
            `Números válidos: ${JSON.stringify(lista)}\nCallback (${tipo}): ${resultado}`; // Instrucción JavaScript
        window.registrarFuncionLog(`Callback ${tipo} sobre ${JSON.stringify(lista)} -> ${resultado}`); // Ejecuta llamada o método
    });
});

// 3. Closures
function crearContador(inicial = 0) { // Declara función
    let cuenta = inicial; // Declara e inicializa "cuenta"
    return { // Retorna resultado
        incrementar: () => ++cuenta,
        reiniciar: () => { // Instrucción JavaScript
            cuenta = 0; // Asigna valor
            return cuenta; // Retorna resultado
        }
    };
}

const contador = crearContador(0); // Declara e inicializa "contador"

document.getElementById("btn-closure-inc").addEventListener("click", () => { // Registra escuchador de eventos
    const actual = contador.incrementar(); // Declara e inicializa "actual"
    document.getElementById("out-closure").textContent = `Cuenta actual (closure privado): ${actual}`; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`Closure incrementar() -> ${actual}`); // Ejecuta llamada o método
});

document.getElementById("btn-closure-reset").addEventListener("click", () => { // Registra escuchador de eventos
    const actual = contador.reiniciar(); // Declara e inicializa "actual"
    document.getElementById("out-closure").textContent = `Cuenta reiniciada: ${actual}`; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`Closure reiniciar() -> ${actual}`); // Ejecuta llamada o método
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de eventos
    liveConsole.replaceChildren(); // Ejecuta llamada o método
});

window.registrarFuncionLog("Laboratorio de Funciones listo."); // Ejecuta llamada o método
