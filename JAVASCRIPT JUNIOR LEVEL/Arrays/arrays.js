/**
 * LABORATORIO INTEGRADO: ARRAYS Y ESTRUCTURAS DE DATOS
 * Este script unifica la definición, manipulación y métodos avanzados de colecciones.
 * Clasificación: Mutabilidad, Acceso e Iteración (Higher-Order Functions).
 */

console.log("%c--- MÉTODOS DE ARRAYS ---", "color: #9333ea; font-weight: bold;");

/* === 1. DEFINICIÓN Y ESTRUCTURAS BÁSICAS === */

/** 
 * Array Indexado: Colección ordenada. 
 * Usamos 'const' porque la referencia al array no cambia, aunque sus elementos sí.
 */
const frutas = ["Manzana", "Pera", "Naranja"];
console.log("%cOriginal:", "color: #9333ea; font-style: italic;", frutas);

/**
 * Objeto Literal: Pares clave-valor. 
 * Ideal para registros de datos donde el orden no es la prioridad, sino la etiqueta.
 */
const pc = {
    nombre: "Fredypc",
    procesador: "Ryzen5",
    ram: "16GB",
    espacio: "1TB"
};
console.log("%cAcceso a Objeto (Clave):", "color: #a855f7;", pc["nombre"]);

/**
 * Matriz (Array Multidimensional): Array de arrays.
 * Acceso mediante coordenadas: [fila][columna].
 */
const matrix = [["Fredy", 1], ["Andres", 3], ["Nicol", 5]];
console.log("%cAcceso a Matriz [2][1]:", "color: #c084fc;", matrix[2][1]);


/* === 2. MÉTODOS MUTADORES (Transforman el array original) === */

/** push/pop: O(1) - Alta eficiencia al operar al final del array. */
frutas.push("Uva");        // Insertar al final
frutas.pop();              // Extraer del final

/** unshift/shift: O(n) - Menos eficientes; obligan a reindexar todo el array. */
frutas.unshift("Mango");   // Insertar al inicio
frutas.shift();            // Extraer del inicio

/** 
 * .sort(): O(n log n) - Ordenamiento.
 * IMPORTANTE: Por defecto ordena como strings Unicode (10 iría antes que 2).
 * Para números usamos la función de comparación (a, b) => a - b.
 */
frutas.sort();

/** .splice(inicio, cantidad, ...elementos): El más potente. Permite borrar e insertar en cualquier punto. */
frutas.splice(1, 1, "Piña"); // En la pos 1, borra 1 e inserta "Piña"

console.log("%cTras mutaciones:", "color: #9333ea; font-weight: bold;", frutas);


/* === 3. MÉTODOS ACCESORES (Inmutables - Devuelven algo nuevo) === */

/** .join(separador): Convierte el array en un string. */
const listaString = frutas.join(" - ");
console.log("%cJoin (String):", "color: #9333ea;", listaString);

/** 
 * .slice(inicio, fin): Crea una copia superficial (shallow copy).
 * Muy utilizado para no romper la inmutabilidad de los datos originales.
 */
const seleccion = frutas.slice(0, 2);
console.log("%cSlice (Copia parcial):", "color: #9333ea;", seleccion);

/** .includes() / .indexOf(): Búsquedas lineales. */
console.log("%c¿Tiene Manzana?:", "color: #9333ea;", frutas.includes("Manzana"));


/* === 4. MÉTODOS DE ITERACIÓN (Higher-Order Functions) === */

const numeros = [1, 2, 3, 4, 5];

/** 
 * .forEach(): Ejecuta una función para cada elemento.
 * Se usa para Side Effects (como imprimir en consola), no devuelve nada.
 */
console.log("%cEjecución forEach:", "color: #7c3aed; font-weight: bold;");
numeros.forEach((n, i) => {
    console.log(`%cÍndice ${i}: %c${n}`, "color: #a855f7;", "color: #111827;");
});

/** 
 * .map(): Transforma cada elemento y devuelve un array nuevo del mismo tamaño.
 * Es el pilar de frameworks modernos como React.
 */
const duplicados = numeros.map(n => n * 2);
console.log("%cMap (Duplicados):", "color: #7c3aed;", duplicados);

/** 
 * .filter(): Crea un nuevo array solo con los elementos que cumplen la condición.
 */
const mayoresQueDos = numeros.filter(n => n > 2);
console.log("%cFilter (> 2):", "color: #7c3aed;", mayoresQueDos);

console.log("%c---------------------------", "color: #9333ea;");