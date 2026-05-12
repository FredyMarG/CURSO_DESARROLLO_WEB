// NOTA: Este archivo parece ser una copia de `JAVASCRIPT MID LEVEL\Handlers\main.js`.
// Se recomienda consolidar o renombrar para evitar confusiones.

// Seleccionamos el primer elemento del documento que tenga la clase CSS "button"
const button = document.querySelector(".button");
 
// Registramos un "escuchador de eventos" para el evento de clic. 
// Cuando se haga clic, se ejecutará la función 'saludar'.
button.addEventListener("click", saludar);

/**
 * Muestra una alerta de saludo al usuario.
 * Inmediatamente después, utiliza removeEventListener para eliminar este manejador específico.
 * Esto garantiza que la alerta solo aparezca en el primer clic.
 */
function saludar() {
    alert("Hola!");
    button.removeEventListener("click", saludar);
}

// Agregamos un segundo manejador de eventos al mismo botón usando una función de flecha (arrow function).
// A diferencia de 'saludar', este evento no se elimina y se ejecutará en cada clic.
button.addEventListener("click", (e)=>{
    // EL OBJETO EVENTO (e):
    // Contiene metadatos sobre la interacción. 
    // e.target: Es el elemento exacto que recibió el clic.
    // e.currentTarget: Es el elemento que tiene el event listener (en este caso, siempre el botón).
    console.log(e.target);
});