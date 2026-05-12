/** Selección del elemento botón principal */
const button = document.querySelector(".button");
 
/** Registro de listener de evento 'click' */
button.addEventListener("click", saludar);

/**
 * Muestra una alerta de saludo al usuario.
 * Inmediatamente después, utiliza removeEventListener para eliminar este manejador específico.
 * Esto garantiza que la alerta solo aparezca en el primer clic.
 * @function
 */
function saludar() {
    alert("Hola!");
    button.removeEventListener("click", saludar);
}

/**
 * Manejador persistente mediante arrow function.
 * Registra metadatos del evento en la consola.
 */
button.addEventListener("click", (e)=>{
    /** @param {Event} e - Objeto de evento de la interacción */
    console.log(e.target);
});