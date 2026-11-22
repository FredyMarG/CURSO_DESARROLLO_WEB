/**
 * GESTIÓN DE EVENTOS Y CICLO DE VIDA DE LISTENERS (sin alert bloqueante)
 */

"use strict"; // Activa el modo estricto de JavaScript

const button = document.querySelector(".button"); // Obtiene referencia DOM para "button"
const outListener = document.getElementById("out-listener"); // Obtiene referencia DOM para "outListener"

function saludarUnaVez() { // Declara función
    if (outListener) { // Evalúa condición
        outListener.textContent = "✅ ¡Hola! Este listener se ejecutó 1 vez y ahora se ha auto-eliminado."; // Actualiza contenido en el DOM
    }
    if (typeof window.registrarFuncionLog === "function") { // Evalúa condición
        window.registrarFuncionLog("saludarUnaVez() ejecutado y eliminado con removeEventListener."); // Ejecuta llamada o método
    }
    button.removeEventListener("click", saludarUnaVez); // Ejecuta llamada o método
}

if (button) { // Evalúa condición
    button.addEventListener("click", saludarUnaVez); // Registra escuchador de eventos
    button.addEventListener("click", (e) => { // Registra escuchador de eventos
        console.log("Listener persistente (target):", e.currentTarget); // Imprime salida en consola
    });
}
