/**
 * LABORATORIO: TEMPORIZADORES EN JAVASCRIPT
 * Este script explora el uso de funciones de temporización asíncronas en JavaScript:
 * `setTimeout` para ejecutar una función una vez después de un retardo, y
 * `setInterval` para ejecutar una función repetidamente con un intervalo fijo.
 * También se demuestra cómo cancelar estos temporizadores con `clearTimeout` y `clearInterval`.
 */

console.log("%c--- LABORATORIO: TEMPORIZADORES ---", "color: #3b82f6; font-weight: bold; font-size: 12px;");

/*
 * 1. setTimeout()
 * Ejecuta una función o un fragmento de código una sola vez después de un retardo especificado.
 * Sintaxis: setTimeout(funcion, retardoEnMilisegundos, [arg1, arg2, ...])
 * Devuelve un ID numérico que puede usarse con clearTimeout().
 */
console.log("Iniciando setTimeout: Se mostrará un mensaje después de 3 segundos (si no se cancela).");
const timeout = setTimeout(() => {
   // Esta función se ejecutará 3000 milisegundos (3 segundos) después de que se llame a setTimeout.
   document.write('Han pasado 3 segundos (desde setTimeout).');
   console.log("Mensaje de setTimeout mostrado.");
}, 3000);

// 2. clearTimeout()
// Cancela la ejecución programada por setTimeout().
// Recibe como argumento el ID devuelto por setTimeout().
console.log("Intentando cancelar el setTimeout inmediatamente después de programarlo.");
clearTimeout(timeout); // Se cancela el temporizador 'timeout'. El mensaje "Han pasado 3 segundos" NO se mostrará.
console.log("setTimeout cancelado. El mensaje no debería aparecer en el documento.");


/*
 * 3. setInterval()
 * Ejecuta una función o un fragmento de código repetidamente, con un retardo fijo entre cada ejecución.
 * Sintaxis: setInterval(funcion, intervaloEnMilisegundos, [arg1, arg2, ...])
 * Devuelve un ID numérico que puede usarse con clearInterval().
 */
console.log("\nIniciando setInterval: Se mostrará un mensaje cada 3 segundos (si no se cancela).");
const intervalo =setInterval(() => {
   // Esta función se ejecutará cada 3000 milisegundos (3 segundos) indefinidamente.
   document.write('Han pasado 3 segundos (desde setInterval).<br>');
   console.log("Mensaje de setInterval mostrado.");
}, 3000);

/*
 * 4. clearInterval()
 * Cancela la ejecución repetida programada por setInterval().
 * Recibe como argumento el ID devuelto por setInterval().
 * Sin esta llamada, el setInterval se ejecutaría indefinidamente, lo que podría causar problemas de rendimiento.
 */
console.log("Programando la cancelación del setInterval después de 5 segundos para permitir algunas ejecuciones.");
// Para demostrar que setInterval funciona, lo dejaremos correr por un corto tiempo antes de cancelarlo.
setTimeout(() => {
    clearInterval(intervalo); // Se cancela el temporizador 'intervalo'.
    console.log("setInterval cancelado después de 5 segundos.");
}, 5000); // Cancela el intervalo después de 5 segundos (permitiendo al menos una ejecución completa).

console.log("\nFin del script principal. Revisa la consola y el documento para ver los resultados de los temporizadores.");