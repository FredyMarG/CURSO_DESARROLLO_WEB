/**
 * LABORATORIO: VARIABLES Y TIPOS DE DATOS
 * En este script exploramos las formas de declarar contenedores de información
 * y los tipos de datos primitivos en JavaScript.
 */

console.log("%c--- LABORATORIO: VARIABLES ---", "color: #3b82f6; font-weight: bold; font-size: 12px;");

/* 1. Formas de declaración */
var num = 1;      // 'var' tiene alcance de función (obsoleto en JS moderno)
let num2 = 2;     // 'let' tiene alcance de bloque (recomendado para variables)
const num3 = 3;   // 'const' define valores que no cambiarán en el tiempo

/* 2. Tipos de datos primitivos */
// Es fundamental usar let/const para evitar crear variables globales accidentales
let string = 'Cadena de texto'; // String: para representar texto
let number = 10;               // Number: para valores numéricos (enteros o flotantes)
let boolean = false;           // Boolean: lógica binaria (true/false)

/* 3. Declaración múltiple */
// Se pueden declarar varias variables separadas por comas en una sola línea
let num1, numm, num4;

num1 = 1;
numm = 2;
num4 = 3;

/**
 * OBSERVACIÓN TÉCNICA: La concatenación en consola puede hacerse pasando múltiples argumentos,
 * lo cual permite inspeccionar objetos sin convertirlos a string forzosamente.
 */
console.log("%cValores múltiples:", "color: #3b82f6; font-style: italic;", num1, numm, num4);

/* 4. Interacción con el usuario */
let nombre = prompt("Dime tu nombre");
alert("Hola " + nombre + ", ¡bienvenido al curso!");