/**
 * GUÍA TÉCNICA DEL OBJETO MATH EN JAVASCRIPT
 * El objeto Math es un objeto incorporado que tiene propiedades y métodos para constantes y funciones matemáticas.
 * Nota: Math no es un constructor; todas las propiedades y métodos son estáticos.
 */

console.log("%c--- MÉTODOS DEL OBJETO MATH ---", "color: #059669; font-weight: bold;");

let numero;

/** --- MÉTODOS DE CÁLCULO Y ARITMÉTICA --- */

// Math.sqrt(x): Devuelve la raíz cuadrada de un número. Si x es negativo, devuelve NaN.
numero = Math.sqrt(25); 
console.log(numero);

// Math.cbrt(x): Devuelve la raíz cúbica de un número.
numero = Math.cbrt(27); 
console.log(numero);

// Math.max(...valores): Compara una lista de números y retorna el valor más alto.
numero = Math.max(5, 10, 15, 0, 30, 1, 100); 
console.log(numero);

// Math.min(...valores): Compara una lista de números y retorna el valor más bajo.
numero = Math.min(5, 10, 15, 0, 30, 1, 100); 
console.log(numero);

/** --- GENERACIÓN DE NÚMEROS ALEATORIOS --- */

// Math.random(): Genera un número de punto flotante pseudo-aleatorio entre 0 (inclusive) y 1 (exclusivo).
numero = Math.random(); 
console.log(numero);

// Generación de un rango: Para obtener un entero entre 0 y 100, multiplicamos y luego redondeamos.
numero = Math.random() * 100; 
console.log(numero);

/** --- MÉTODOS DE REDONDEO Y TRUNCAMIENTO --- */

// Math.round(x): Redondea al entero más próximo. .5 redondea hacia arriba (hacia el infinito positivo).
numero = Math.round(4.7); 
console.log(numero);

// Math.floor(x): "Piso". Redondea hacia abajo al entero más cercano.
numero = Math.floor(4.7); 
console.log(numero);

// Math.fround(x): Retorna la representación flotante de precisión simple (32 bits) más cercana.
numero = Math.fround(4.7549999999999); 
console.log(numero);

// Math.trunc(x): Elimina la parte decimal. A diferencia de floor, simplemente corta los decimales.
numero = Math.trunc(5.99999); 
console.log(numero);

/** --- CONSTANTES MATEMÁTICAS (PROPIEDADES) --- */

// Math.PI: Relación entre la longitud de la circunferencia de un círculo y su diámetro (~3.14159).
numero = Math.PI; 
console.log(numero);

// Math.E: Constante de Euler, base de los logaritmos naturales (~2.718).
numero = Math.E; 
console.log(numero);

// Math.SQRT1_2: Raíz cuadrada de 1/2, equivalente a 1 dividido por la raíz cuadrada de 2 (~0.707).
numero = Math.SQRT1_2; 
console.log(numero);

// Math.SQRT2: Raíz cuadrada de 2 (~1.414).
numero = Math.SQRT2; 
console.log(numero);

/** --- LOGARITMOS --- */

// Math.LN2: Logaritmo natural de 2 (~0.693).
numero = Math.LN2; 
console.log(numero);

// Math.LN10: Logaritmo natural de 10 (~2.302).
numero = Math.LN10; 
console.log(numero);

// Math.LOG2E: Logaritmo de E en base 2 (~1.442).
numero = Math.LOG2E; 
console.log(numero);

// Math.LOG10E: Logaritmo de E en base 10 (~0.434).
numero = Math.LOG10E; 
console.log(numero);

/** 
 * RESUMEN DE USO:
 * - Para números aleatorios enteros: Math.floor(Math.random() * (max - min + 1)) + min.
 * - Para formatear decimales visualmente (no matemático): usar el método .toFixed() de los números.
 */

console.log("%c-------------------------------", "color: #059669;");