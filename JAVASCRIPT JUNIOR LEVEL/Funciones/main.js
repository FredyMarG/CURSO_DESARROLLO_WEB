/**
 * GESTIÓN DE EVENTOS Y CICLO DE VIDA DE LISTENERS
 * Este script demuestra cómo registrar, ejecutar y eliminar escuchadores de eventos.
 */

const button = document.querySelector(".button");

// Registramos el evento 'click'. Nota: Pasamos la referencia de la función 'saludar' sin paréntesis.
button.addEventListener("click", saludar);

/**
 * Saluda y se auto-elimina como listener para ejecutarse solo una vez.
 * Para usar removeEventListener, es obligatorio pasar la misma referencia de función que se usó en addEventListener.
 */
function saludar() {
    alert("Hola!");
    button.removeEventListener("click", saludar);
}

/**
 * Listener persistente mediante una función de flecha (anónima).
 * @param {Event} e - El objeto de evento que contiene toda la información de la interacción.
 * .target: Identifica exactamente qué elemento recibió el clic.
 */
button.addEventListener("click", (e)=>{
    console.log(e.target);
});