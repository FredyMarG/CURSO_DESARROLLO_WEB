/**
 * OPERADORES EN JAVASCRIPT
 * Asignación compuesta, comparación y lógicos (AND / OR).
 */

/* --- Operadores de asignación compuesta (+, -, /, %, **, ++, &) --- */
let numero = 10;
numero += 5; /* Equivale a numero = numero + 5 */
console.log(numero);

numero += 5
console.log(numero);
numero -= 5
console.log(numero);
numero /= 3
console.log(numero);
numero %= 2
console.log(numero);
numero **= 2
console.log(numero);
numero++
console.log(numero);
numero &= 2
console.log(numero);

/* --- Operadores de comparación (==, !=, >=, <) --- */
numero = 23
let numero2 = 13 // = Asignación
console.log(numero != numero2);
console.log(numero == numero2);
console.log(numero >= numero2);
console.log(numero2 < numero);

/* --- Operadores lógicos (&& y ||) --- */
let num1 = 12
let num2 = 24
af1 = num1 < num2
af2 = num1 != num2
// AND lógico: ambas expresiones deben ser verdaderas
console.log(af1 && af2);
// OR lógico: basta con que una sea verdadera
af1 = num1 > num2
console.log(af1 || af2);
