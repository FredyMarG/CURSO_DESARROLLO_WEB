// ===================================================================
// EXPLICACIÓN DE PROMESAS EN JAVASCRIPT
// ===================================================================
// Una promesa es un objeto que representa el éxito o fracaso
// eventual de una operación. Tiene 3 estados:
//   - Pendiente (Pending): Estado inicial, no se ha completado.
//   - Resuelta (Fulfilled): Operación exitosa (se llama a resolve).
//   - Rechazada (Rejected): Operación fallida (se llama a reject).
// ===================================================================

// 1. Declaración de una variable de prueba
// Este valor lo usaremos dentro de la promesa para evaluar la condición.
let nombre = 'fredy';

// 2. Creación de la Promesa (new Promise)
// El constructor recibe una función ejecutora con dos callbacks:
//   - resolve: Se invoca si la promesa se cumple con éxito.
//   - reject: Se invoca si la promesa falla.
const promesa = new Promise((resolve, reject) => {
    
    // Al crearse la promesa, entra en estado "PENDIENTE" (Pending)

    if (nombre !== 'fredy') {
        // Si el nombre es incorrecto, rechazamos la promesa.
        // Esto cambia el estado a "RECHAZADA" (Rejected).
        reject("El nombre no es Fredy");
    } else {
        // Si el nombre es correcto, resolvemos la promesa con éxito.
        // Esto cambia el estado a "RESUELTA" (Fulfilled) y envía el valor.
        resolve(nombre);
    }

});

// 3. Consumo de la Promesa
// Escuchamos el resultado de la promesa usando .then() y .catch():
promesa
    // .then() se ejecuta si la promesa es RESUELTA con éxito.
    // El parámetro "resultado" recibe el valor que pasamos en resolve(nombre).
    .then((resultado) => {
        console.log(resultado); // Imprime: 'fredy'
    })
    // .catch() se ejecuta si la promesa es RECHAZADA por un error.
    // El parámetro "e" recibe el mensaje que pasamos en reject().
    .catch((e) => {
        console.log(e); // Imprime el error si la validación falla
    });
