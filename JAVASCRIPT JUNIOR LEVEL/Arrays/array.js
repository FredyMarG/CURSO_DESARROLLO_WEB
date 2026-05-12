/**
 * ARRAYS Y ESTRUCTURAS
 * Acceso por índice, objeto como "mapa" de claves y arreglos anidados.
 */

/* --- Array indexado: lista ordenada de valores --- */
let frutas = ["banano", "manzana", "mangostino", "pera"]
console.log(frutas[0]);


/* --- Objeto literal: pares clave-valor (útil como registro o "array asociativo") --- */
let pc = {
    nombre: "Fredypc",
    procesador: "Ryzen5",
    ram: "16GB",
    espacio: "1TB"
}

let pc2 = ["fredypc", "Ryzen5", "16GB", "1TB"]

console.log(pc2[3]);
console.log(pc["nombre"]);

/* --- Matriz: array de arrays; [fila][columna] --- */
let array = [["Fredy", 1],["Andres", 3],["Nicol", 5]]
console.log(array[2][1]);
