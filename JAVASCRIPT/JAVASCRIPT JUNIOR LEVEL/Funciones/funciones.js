/**
 * GUÍA INTERACTIVA: FUNCIONES, PARÁMETROS REST, CALLBACKS Y CLOSURES
 */

"use strict"; // Activa el modo estricto de JavaScript

const liveConsole = document.getElementById("live-console"); // Declara e inicializa variable local

window.registrarFuncionLog = function registrar(mensaje) {
    const linea = document.createElement("div"); // Declara e inicializa variable local
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`; // Actualiza contenido en el DOM
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje); // Imprime salida en consola
};

// 1. Parámetros por defecto + Arrow Function
const saludarUsuario = (nombre = "Invitado") => `¡Hola, ${nombre}! Bienvenido a JS moderno.`; // Declara e inicializa variable local

document.getElementById("btn-saludar").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const raw = document.getElementById("fn-nombre").value.trim(); // Declara e inicializa variable local
    const mensaje = raw ? saludarUsuario(raw) : saludarUsuario(undefined); // Declara e inicializa variable local
    document.getElementById("out-saludar").textContent = mensaje; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`saludarUsuario(${raw ? `"${raw}"` : "undefined"}) -> "${mensaje}"`);
});

// 2. Parámetros Rest + Callbacks
function procesarLista(callback, ...numeros) { // Define función reutilizable
    return callback(numeros); // Retorna el resultado de la función
}

const cbSumar = (arr) => arr.reduce((a, b) => a + b, 0); // Declara e inicializa variable local
const cbPromedio = (arr) => (arr.length ? cbSumar(arr) / arr.length : 0); // Declara e inicializa variable local

document.querySelectorAll("[data-cb]").forEach((btn) => {
    btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        const lista = document
            .getElementById("fn-nums")
            .value.split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !Number.isNaN(n));

        const tipo = btn.dataset.cb; // Declara e inicializa variable local
        const resultado = tipo === "sumar" ? procesarLista(cbSumar, ...lista) : procesarLista(cbPromedio, ...lista); // Declara e inicializa variable local

        document.getElementById("out-rest").textContent =
            `Números válidos: ${JSON.stringify(lista)}\nCallback (${tipo}): ${resultado}`;
        window.registrarFuncionLog(`Callback ${tipo} sobre ${JSON.stringify(lista)} -> ${resultado}`);
    });
});

// 3. Closures
function crearContador(inicial = 0) { // Define función reutilizable
    let cuenta = inicial; // Declara e inicializa variable local
    return {
        incrementar: () => ++cuenta,
        reiniciar: () => {
            cuenta = 0;
            return cuenta; // Retorna el resultado de la función
        }
    };
}

const contador = crearContador(0); // Declara e inicializa variable local

document.getElementById("btn-closure-inc").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const actual = contador.incrementar(); // Declara e inicializa variable local
    document.getElementById("out-closure").textContent = `Cuenta actual (closure privado): ${actual}`; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`Closure incrementar() -> ${actual}`);
});

document.getElementById("btn-closure-reset").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    const actual = contador.reiniciar(); // Declara e inicializa variable local
    document.getElementById("out-closure").textContent = `Cuenta reiniciada: ${actual}`; // Actualiza contenido en el DOM
    window.registrarFuncionLog(`Closure reiniciar() -> ${actual}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => { // Registra escuchador de evento en el DOM
    liveConsole.replaceChildren();
});

window.registrarFuncionLog("Laboratorio de Funciones listo.");

