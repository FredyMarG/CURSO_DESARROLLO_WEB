/**
 * LABORATORIO: MÉTODOS DE CADENAS (STRING)
 * En JS, los strings son inmutables: los métodos no cambian el texto original,
 * sino que generan una nueva versión del mismo.
 */

console.log("%c--- MÉTODOS DE CADENAS ---", "color: #2563eb; font-weight: bold;");

let cadena = "cadena de prueba",
    cadena2 = " cadena";

/* Variable para almacenar los retornos de los métodos */
let resultado;

/* --- concat: une dos o más cadenas --- */
resultado = cadena.concat(cadena2);
console.log("Concat:", resultado);

/* --- Búsqueda: startsWith, endsWith, includes, indexOf, lastIndexOf --- */
resultado = cadena.startsWith("cadena"); // true: verifica el inicio
console.log("¿Empieza con 'cadena'?:", resultado);

resultado = cadena.endsWith("prueba"); // true: verifica el final
console.log("¿Termina en 'prueba'?:", resultado);

resultado = cadena.includes("de"); // true: busca coincidencia en cualquier parte
console.log("¿Contiene 'de'?:", resultado);

resultado = cadena.indexOf("de"); // 7: índice de la primera aparición (-1 si no existe)
console.log("Posición de 'de':", resultado);

resultado = cadena.lastIndexOf("a"); // 15: busca de derecha a izquierda
console.log("Última posición de 'a':", resultado);

/* --- Relleno y repetición: padStart, padEnd, repeat --- */
let textoCorto = "abc";
resultado = textoCorto.padStart(6, "4"); // "444abc": rellena al inicio hasta tener longitud 6
console.log("padStart (long 6):", resultado);

resultado = textoCorto.padEnd(6, "4"); // "abc444": rellena al final
console.log("padEnd (long 6):", resultado);

resultado = "123 ".repeat(3); // Repite el string N veces
console.log("Repeat (3 veces):", resultado);

/* --- División y recorte: split, substring, toLowerCase, toUpperCase --- */
let saludo = "Hola como estas?";
resultado = saludo.split(" "); // ["Hola", "como", "estas?"]: convierte a Array usando el separador
console.log("Split por espacios:", resultado);

let letras = "AbCdEfG";
resultado = letras.substring(2, 5); // "CdE": extrae desde índice 2 hasta antes del 5
console.log("Substring (2 a 5):", resultado);

resultado = letras.toLowerCase();
console.log("Minúsculas:", resultado);

resultado = letras.toUpperCase();
console.log("Mayúsculas:", resultado);

/* --- Conversión número → cadena --- */
let num = 550;
resultado = num.toString();
console.log("Número a String:", typeof resultado);

/* --- Limpieza de espacios --- */
let conEspacios = "   limpiame   ";
console.log("Trim (total):", `'${conEspacios.trim()}'`);
console.log("TrimStart:", `'${conEspacios.trimStart()}'`);
console.log("TrimEnd:", `'${conEspacios.trimEnd()}'`);

/* --- Reemplazo y Slicing --- */
let frase = "Javascript es genial";
resultado = frase.replace("genial", "increíble"); // Reemplaza la primera coincidencia
console.log("Replace:", resultado);

resultado = frase.replaceAll("a", "4"); // Reemplaza todas las coincidencias
console.log("ReplaceAll (a -> 4):", resultado);

resultado = frase.slice(0, 10); // Similar a substring pero soporta índices negativos
console.log("Slice (0 a 10):", resultado);

console.log("ValueOf:", frase.valueOf()); // Devuelve el valor primitivo
console.log("%c---------------------------", "color: #2563eb;");