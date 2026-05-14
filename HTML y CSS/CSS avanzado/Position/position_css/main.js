/** 
 * CURSO_WEB_DOC_JS v1
 * Archivo: HTML y CSS/CSS Avanzado/Position/position_css/main.js
 * Propósito: Manejo de eventos del DOM para interactividad básica y demostración de ciclo de vida de eventos.
 */

/** 
 * Selección del elemento botón principal mediante su clase. 
 * @type {HTMLButtonElement}
 */
const button = document.querySelector(".button");
 
/** 
 * Registro de listener de evento 'click'. 
 * Se asocia una función nominal para permitir su posterior eliminación.
 */
button.addEventListener("click", saludar);

/**
 * Lógica de saludo único.
 * Muestra una alerta y, acto seguido, elimina su propio escuchador mediante removeEventListener.
 * Esto garantiza que la alerta solo aparezca en el primer clic.
 * @function
 */
function saludar() {
    alert("Hola!"); /* Feedback directo al usuario. */
    button.removeEventListener("click", saludar); /* Limpieza del evento para evitar redundancia. */
}

/**
 * Manejador persistente mediante arrow function.
 * A diferencia de 'saludar', este listener se mantiene activo en cada clic.
 */
button.addEventListener("click", (e)=>{
    /** @param {PointerEvent} e - Objeto de evento que contiene metadatos de la interacción */
    console.log("Elemento interactuado:", e.target); /* Registra en consola el nodo exacto que recibió el clic. */
});