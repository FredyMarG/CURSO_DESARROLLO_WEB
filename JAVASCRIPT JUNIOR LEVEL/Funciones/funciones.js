/**
 * GUÍA INTERACTIVA: FUNCIONES, PARÁMETROS REST, CALLBACKS Y CLOSURES
 */

"use strict";

const liveConsole = document.getElementById("live-console");

window.registrarFuncionLog = function registrar(mensaje) {
    const linea = document.createElement("div");
    linea.className = "log-line ok";
    linea.textContent = `> ${mensaje}`;
    liveConsole.append(linea);
    liveConsole.scrollTop = liveConsole.scrollHeight;
    console.log(mensaje);
};

// 1. Parámetros por defecto + Arrow Function
const saludarUsuario = (nombre = "Invitado") => `¡Hola, ${nombre}! Bienvenido a JS moderno.`;

document.getElementById("btn-saludar").addEventListener("click", () => {
    const raw = document.getElementById("fn-nombre").value.trim();
    const mensaje = raw ? saludarUsuario(raw) : saludarUsuario(undefined);
    document.getElementById("out-saludar").textContent = mensaje;
    window.registrarFuncionLog(`saludarUsuario(${raw ? `"${raw}"` : "undefined"}) -> "${mensaje}"`);
});

// 2. Parámetros Rest + Callbacks
function procesarLista(callback, ...numeros) {
    return callback(numeros);
}

const cbSumar = (arr) => arr.reduce((a, b) => a + b, 0);
const cbPromedio = (arr) => (arr.length ? cbSumar(arr) / arr.length : 0);

document.querySelectorAll("[data-cb]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const lista = document
            .getElementById("fn-nums")
            .value.split(",")
            .map((v) => Number(v.trim()))
            .filter((n) => !Number.isNaN(n));

        const tipo = btn.dataset.cb;
        const resultado = tipo === "sumar" ? procesarLista(cbSumar, ...lista) : procesarLista(cbPromedio, ...lista);

        document.getElementById("out-rest").textContent =
            `Números válidos: ${JSON.stringify(lista)}\nCallback (${tipo}): ${resultado}`;
        window.registrarFuncionLog(`Callback ${tipo} sobre ${JSON.stringify(lista)} -> ${resultado}`);
    });
});

// 3. Closures
function crearContador(inicial = 0) {
    let cuenta = inicial;
    return {
        incrementar: () => ++cuenta,
        reiniciar: () => {
            cuenta = 0;
            return cuenta;
        }
    };
}

const contador = crearContador(0);

document.getElementById("btn-closure-inc").addEventListener("click", () => {
    const actual = contador.incrementar();
    document.getElementById("out-closure").textContent = `Cuenta actual (closure privado): ${actual}`;
    window.registrarFuncionLog(`Closure incrementar() -> ${actual}`);
});

document.getElementById("btn-closure-reset").addEventListener("click", () => {
    const actual = contador.reiniciar();
    document.getElementById("out-closure").textContent = `Cuenta reiniciada: ${actual}`;
    window.registrarFuncionLog(`Closure reiniciar() -> ${actual}`);
});

document.getElementById("btn-limpiar-log").addEventListener("click", () => {
    liveConsole.replaceChildren();
});

window.registrarFuncionLog("Laboratorio de Funciones listo.");
