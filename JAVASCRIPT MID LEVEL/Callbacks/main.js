// -------------------------------------------------------------------
// Este archivo demuestra cómo funcionan las callbacks en JavaScript.
// Una callback es una función que se pasa como argumento a otra
// función y se ejecuta más tarde, cuando ocurre una acción específica.
// -------------------------------------------------------------------

// 1) Creamos una función que recibe dos parámetros:
//    - nombre: el valor que queremos procesar
//    - callback: la función que se ejecutará después
function procesarNombre(nombre, callback) {
    // Aquí llamamos a la función que nos pasaron como argumento.
    // Esto es lo que hace que el código sea flexible y reusable.
    callback(nombre);
}

// 2) Creamos una callback tradicional (función normal).
//    Esta función mostrará el nombre en la consola.
function mostrarNombre(nombre) {
    console.log(`Hola, ${nombre}`);
}

// 3) Ejecutamos la función principal usando la callback tradicional.
//    En este caso, la función mostrarNombre se ejecuta dentro de procesarNombre.
procesarNombre("Pedro", mostrarNombre);

// 4) Ejecutamos otra llamada usando una callback flecha.
//    La arrow function también cumple la misma función.
procesarNombre("Ana", (nombre) => {
    console.log(`Nombre recibido: ${nombre}`);
});

// 5) Seleccionamos los elementos HTML con los que vamos a interactuar.
//    El botón ejecutará la demo y el párrafo mostrará el resultado.
const boton = document.getElementById("runCallback");
const resultado = document.getElementById("result");
const estado = document.getElementById("demoNote");

// 6) Añadimos un evento al botón.
//    Cuando el usuario haga clic, se ejecutará la callback.
boton.addEventListener("click", () => {
    // Primero cambiamos el texto del estado para indicar que la acción empezó.
    estado.textContent = "Estado: ejecutando callback...";

    // Llamamos a la función procesarNombre con un nombre y una callback.
    procesarNombre("JavaScript", (nombre) => {
        // Actualizamos el contenido del párrafo con el resultado.
        resultado.textContent = `Callback ejecutada con: ${nombre}`;

        // También cambiamos el estado para mostrar que terminó correctamente.
        estado.textContent = `Estado: callback finalizada para ${nombre}`;
    });
});

// 7) Ejemplo extra para mostrar cómo se puede usar una clase.
//    Esto no afecta la landing page, pero sirve para practicar otro concepto.
class Persona {
    constructor(nombre, instagram) {
        this.nombre = nombre;
        this.instagram = instagram;
    }
}

// 8) Mostramos un ejemplo de instancia en la consola.
console.log(new Persona("Fredy", "@Fredyleo30_10"));
