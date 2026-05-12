/**
 * CONCATENACIÓN DE CADENAS
 * Muestra el operador + y las plantillas literales (template strings) con backticks.
 */

/* --- Unión con el operador + --- */
saludo = "Hola Pedro, ";
pregunta = "Como estas";
frase = saludo + pregunta;
console.log(frase);

/* --- Plantilla literal: inserta variables dentro del texto con ${} --- */
num1 = 10;
num2 = 5;
res = `${num1} ${num2}`;
console.log(res);