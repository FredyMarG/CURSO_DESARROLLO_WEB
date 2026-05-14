/**
 * LABORATORIO: OPERADORES EN JAVASCRIPT
 * Exploración de asignación compuesta, comparación de valores y lógica booleana.
 */

/**
 * Impresión de encabezado en consola.
 * El primer argumento usa %c para aplicar los estilos definidos en el segundo argumento.
 */
console.log("%c--- LABORATORIO: OPERADORES ---", "color: #f59e0b; font-weight: bold; font-size: 12px;");

/* 1. Operadores de asignación compuesta */
// Permiten realizar una operación aritmética y asignar el resultado a la misma variable en un solo paso.
let numero = 10; // Paso 1: Inicializamos la variable 'numero' con el valor 10.

numero += 5;   // Paso 2: Suma 5 al valor actual (10) y lo guarda. Nuevo valor: 15.
console.log("%cSuma compuesta (+=):", "color: #f59e0b;", numero);

numero -= 5;   // Paso 3: Resta 5 al valor actual (15) y lo guarda. Nuevo valor: 10.
console.log("%cResta compuesta (-=):", "color: #f59e0b;", numero);

numero /= 2;   // Paso 4: Divide el valor actual (10) por 2 y lo guarda. Nuevo valor: 5.
console.log("%cDivisión compuesta (/=):", "color: #f59e0b;", numero);

numero %= 2;   // Paso 5: Obtiene el resto de dividir 5 entre 2 (que es 1) y lo guarda. Nuevo valor: 1.
console.log("%cMódulo compuesto (%=):", "color: #f59e0b;", numero);

numero **= 3;  // Paso 6: Eleva el valor actual (1) a la potencia de 3 (1*1*1) y lo guarda. Nuevo valor: 1.
console.log("%cExponencial compuesto (**=):", "color: #f59e0b;", numero);

numero++;      // Paso 7: Operador de incremento simple. Suma 1 al valor actual (1). Nuevo valor: 2.
console.log("%cIncremento final (++):", "color: #f59e0b;", numero);

/* 2. Operadores de comparación */
// Devuelven un valor booleano (true o false).
let comparador1 = 23; // Declaramos primer valor para comparar.
let comparador2 = 13; // Declaramos segundo valor para comparar.

// Comprobamos si los valores son diferentes. Resultado esperado: true.
console.log("%c¿Es diferente? (!=):", "font-weight: bold;", comparador1 != comparador2);

// Comprobamos si los valores son estrictamente iguales. Resultado esperado: false.
console.log("%c¿Es igual? (==):", "font-weight: bold;", comparador1 == comparador2);

// Comprobamos si el primer valor es mayor o igual al segundo. Resultado esperado: true.
console.log("%c¿Es mayor o igual? (>=):", "font-weight: bold;", comparador1 >= comparador2);

/* 3. Operadores lógicos */
let num1 = 12; // Variable numérica para lógica.
let num2 = 24; // Variable numérica para lógica.

let af1 = num1 < num2;  // Evaluación 1: ¿12 es menor que 24? Sí (true).
let af2 = num1 != num2; // Evaluación 2: ¿12 es distinto de 24? Sí (true).

// AND (&&): Devuelve true solo si ambos lados son true.
// En este caso: true && true -> true.
console.log("%cAND lógico (&&):", "color: #d97706; font-weight: bold;", af1 && af2);

// OR (||): Devuelve true si al menos uno de los lados es true.
af1 = num1 > num2; // Reasignación: ¿12 es mayor que 24? No (false).

// Evaluación: false || true. Como af2 sigue siendo true, el resultado es true.
console.log("%cOR lógico (||):", "color: #d97706; font-weight: bold;", af1 || af2);
