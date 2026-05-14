/**
 * LABORATORIO: CONCATENACIÓN Y TEMPLATE LITERALS
 * Exploramos cómo unir strings y variables de forma eficiente.
 */

console.log("%c--- CONCATENACIÓN ---", "color: #f59e0b; font-weight: bold;");

let nombre = "Alex";
let lenguaje = "JavaScript";

/* 1. Método Tradicional (Operador +) */
// Requiere manejar espacios manualmente y es propenso a errores en textos largos.
let saludo1 = "Hola, mi nombre es " + nombre + " y aprendo " + lenguaje + ".";
console.log("Tradicional:", saludo1);

/* 2. Template Literals (ES6) - RECOMENDADO */
// Usa acentos graves `` y permite interpolar variables con ${}. 
// Soporta saltos de línea y mayor legibilidad.
let saludo2 = `Hola, soy ${nombre}
y estoy dominando ${lenguaje} en 2024.`;
console.log("Template Literal:\n" + saludo2);

/* 3. Método concat() */
let saludo3 = "Aprendiendo ".concat(lenguaje, " con ", nombre);
console.log("Método .concat():", saludo3);

/* 4. Coerción de tipos */
console.log("Número + String:", 5 + "5"); // Resultado: "55" (String)
console.log("%c-----------------------", "color: #f59e0b;");