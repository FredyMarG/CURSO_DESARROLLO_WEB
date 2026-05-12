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
    // 'e' representa el objeto del evento. 'e.target' devuelve el elemento HTML que originó el evento (el botón).
    console.log(e.target);
});