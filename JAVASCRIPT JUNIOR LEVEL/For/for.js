/**
 * LABORATORIO MAESTRO: BUCLES Y ESTRUCTURAS REPETITIVAS
 * Este script centraliza el estudio de la iteración en JavaScript.
 * Temas: For, While, Do While, For...in (claves), For...of (valores) y Labels.
 */

console.log("%c--- LABORATORIO: BUCLES (FOR) ---", "color: #7c3aed; font-weight: bold; font-size: 12px;");

/* --- Bucle for básico: cuenta de 0 a 5 --- */
// i++ es la expresión final que incrementa el contador en cada vuelta.
for (let i = 0; i < 5; i++) { // Bucle que itera de 0 a 4
    console.log(`%cBucle for: %citeración ${i}`, "color: #7c3aed;", "font-weight: bold;");
}

/* --- Control de flujo con continue --- */
console.log("%c--- Control con Continue (salta el 5) ---", "color: #6d28d9; font-style: italic;");
for(let i = 0; i < 10; i++){ // Itera de 0 a 9
    if (i === 5) { // Si i es 5, salta esta iteración
        // continue: Interrumpe la iteración actual y salta a la siguiente sin terminar el bloque.
        continue;
    }
    console.log(`%cValor: %c${i}`, "color: #7c3aed;", "color: #111827;");
}

/* --- Bucle while: evalúa antes de ejecutar --- */
let contadorWhile = 0;
console.log("%c--- Estructura While ---", "color: #6d28d9; font-weight: bold;");
while (contadorWhile < 3) {
    console.log(`%cWhile: %citeración ${contadorWhile}`, "color: #4c1d95;", "font-weight: bold;");
    contadorWhile++;
}

/* --- Bucle do...while: asegura al menos una ejecución --- */
let contadorDo = 0;
console.log("%c--- Estructura Do While ---", "color: #6d28d9; font-weight: bold;");
do {
    console.log(`%cDo While: %citeración ${contadorDo}`, "color: #4c1d95;", "font-weight: bold;");
    contadorDo++;
} while (contadorDo < 3);

/* --- Colecciones e Iteradores específicos --- */
const animales = ["gato", "perro", "tiranosaurio rex"];
animales.edad = 20; // Propiedad extra para demostrar que for...in la captura

/** 
 * for...in: Itera sobre propiedades enumerables (las llaves/índices).
 * Útil para objetos, pero en arrays devuelve el índice y propiedades personalizadas.
 */
console.log("%c--- for...in (Keys/Indices) ---", "color: #6d28d9; font-weight: bold;");
for(const key in animales){
    console.log(`%cPropiedad: %c${key} %c-> Valor: %c${animales[key]}`, "color: #6d28d9;", "font-weight: bold;", "color: #9ca3af;", "color: #111827;");
}

/** 
 * for...of: Itera sobre los valores de objetos iterables (Arrays, Strings, Maps).
 * A diferencia de for...in, este solo devuelve los elementos del array y omite propiedades extra.
 */
console.log("%c--- Bucle for...of (valores del iterable) ---", "color: #6d28d9; font-weight: bold;");
for(let animal of animales){
    console.log(`%cfor...of (valor): %c${animal}`, "color: #7c3aed;", "font-weight: bold;");
}

/* --- Control Avanzado: Labels --- */
console.log("%c--- Sentencias Etiquetadas (Labels) ---", "color: #4c1d95; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px;");

const array1 = ["maria", "josefa", "roberta"];
const array2 = ["pedro", "marcelo", array1, "josefina"];

/**
 * SENTENCIAS ETIQUETADAS (Labels):
 * Permiten nombrar un bucle para poder controlarlo (break/continue) desde un bucle anidado.
 */
bucleExterno: // Etiqueta aplicada al bucle externo
for (let i = 0; i < array2.length; i++){
    let actual = array2[i];
    if (typeof array2[i] === 'string') { // Si es un string directo
        console.log(`%cElemento de array2: %c${array2[i]}`, "color: #4c1d95;", "font-weight: bold;");
        if (array2[i] === "marcelo") {
            console.log("%c¡Encontrado 'marcelo'! Rompiendo ambos bucles.", "color: #dc2626; font-weight: bold;");
            break bucleExterno; // Sale completamente del bucle 'bucleExterno'
        }
    } else if (Array.isArray(array2[i])) { // Si es un array anidado
        console.log(`Iterando array anidado en índice ${i}:`);
        for (let j = 0; j < array2[i].length; j++) {
            console.log(`  Elemento de array1: ${array2[i][j]}`);
            if (array2[i][j] === "josefa") {
                console.log("¡Encontrado 'josefa' en el array anidado! Rompiendo ambos bucles.");
                break bucleExterno; // Sale completamente del bucle 'bucleExterno'
            }
        }
    }
}

console.log("%c----------------------------------------", "color: #7c3aed;");