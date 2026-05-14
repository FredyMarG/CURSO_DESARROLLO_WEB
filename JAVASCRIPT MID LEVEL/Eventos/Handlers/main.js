/**
 * GESTIÓN DE MANEJADORES DE EVENTOS (EVENT HANDLERS)
 * Demostración de asignación dinámica y limpieza de memoria mediante remoción de listeners.
 */

/** @type {HTMLButtonElement} - Referencia al nodo del botón principal */
const button = document.querySelector(".button");

/**
 * Registro de un Event Listener utilizando una función nominada.
 * El uso de funciones nominadas es obligatorio si se planea usar removeEventListener posteriormente.
 */
button.addEventListener("click", saludar);

/**
 * Callback para el evento click.
 * Implementa un patrón de ejecución única (Self-removing listener).
 * @function saludar
 */
function saludar() {
    alert("Hola!");
    // Remoción del listener para liberar recursos y evitar ejecuciones redundantes.
    button.removeEventListener("click", saludar);
}

/**
 * Registro concurrente de un segundo manejador.
 * Las funciones anónimas (Arrow functions) son útiles para lógica rápida pero difíciles de remover.
 */
button.addEventListener("click", (e)=>{
    /** @param {Event} e - El objeto de evento generado por el navegador */
    console.log(e.target);
});