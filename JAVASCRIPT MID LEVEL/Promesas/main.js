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

// ===================================================================
// EJEMPLO PRÁCTICO: ENCADENAMIENTO DE PROMESAS (PROMISE CHAINING)
// ===================================================================

// 4. Definición de la clase Persona que servirá como nuestro modelo de datos.
class Persona {
    constructor(nombre, instagram) {
        this.nombre = nombre;
        this.instagram = instagram;
    }
}

// 5. Datos simulados (Base de Datos en memoria)
const data = [
    ['fredy', '@fredy'],
    ['ana', '@ana'],
    ['luis', '@luis'],
];

// Creamos un array de instancias de la clase Persona a partir de la matriz de datos
const personas = [];
for (let i = 0; i < data.length; i++) {
    personas[i] = new Persona(data[i][0], data[i][1]);
}

// 6. Función para obtener una Persona por su ID (índice del array)
// Retorna una promesa para simular una consulta asíncrona a una base de datos.
const obtenerPersona = (id) => {
    return new Promise((res, rej) => {
        // Si el elemento no existe en el índice indicado, rechazamos la promesa
        if (personas[id] == undefined) {
            rej("No se ha encontrado la persona");
        } else { 
            // Si existe, resolvemos la promesa enviando el objeto de la persona
            res(personas[id]); 
        }
    });
};

// 7. Función para obtener el Instagram de una Persona por su ID
// También retorna una promesa que resuelve con el handle de instagram.
const obtenerInstagram = (id) => {
    return new Promise((res, rej) => {
        // Si la propiedad instagram no existe o no está definida, rechazamos la promesa
        if (personas[id].instagram == undefined) {
            rej("No se ha encontrado el Instagram");
        } else { 
            // Si existe, resolvemos la promesa enviando el instagram de la persona
            res(personas[id].instagram); 
        }
    });
};

// 8. Consumo de Promesas Encadenadas (Promise Chaining)
// El encadenamiento nos ayuda a evitar el "Callback Hell" (anidación excesiva).
let id = 2;

obtenerPersona(id)
    // Primer .then(): Se ejecuta cuando obtenerPersona se resuelve correctamente.
    .then((persona) => {
        console.log(persona.nombre); // Imprime el nombre de la persona encontrada
        
        // Retornamos una nueva promesa (obtenerInstagram) dentro del .then()
        // Esto permite encadenar el siguiente .then() al mismo nivel.
        return obtenerInstagram(id);
    })
    // Segundo .then(): Recibe el resultado de la promesa retornada en el paso anterior.
    .then((instagram) => {
        console.log(instagram); // Imprime el instagram obtenido
    })
    // Un único .catch(): Captura cualquier error que ocurra en CUALQUIERA
    // de las promesas de la cadena anterior (ya sea obtenerPersona u obtenerInstagram).
    .catch((err) => {
        console.log(err); // Muestra el mensaje de error correspondiente
    });