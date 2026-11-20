/**
 * GESTIÓN DE EVENTOS Y CICLO DE VIDA DE LISTENERS (sin alert bloqueante)
 */

"use strict";

const button = document.querySelector(".button");
const outListener = document.getElementById("out-listener");

function saludarUnaVez() {
    if (outListener) {
        outListener.textContent = "✅ ¡Hola! Este listener se ejecutó 1 vez y ahora se ha auto-eliminado.";
    }
    if (typeof window.registrarFuncionLog === "function") {
        window.registrarFuncionLog("saludarUnaVez() ejecutado y eliminado con removeEventListener.");
    }
    button.removeEventListener("click", saludarUnaVez);
}

if (button) {
    button.addEventListener("click", saludarUnaVez);
    button.addEventListener("click", (e) => {
        console.log("Listener persistente (target):", e.currentTarget);
    });
}
