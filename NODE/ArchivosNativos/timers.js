/**
 * ============================================================================
 * PRÁCTICA NATIVA: MÓDULO node:timers y node:timers/promises
 * Descripción: Demuestra cómo programar tareas diferidas, inmediatas,
 * repetitivas y esperas con promesas en Node.js usando el prefijo "node:".
 *
 * Cómo ejecutar en terminal:
 *   node NODE/ArchivosNativos/timers.js
 * ============================================================================
 */

const { setTimeout, setInterval, setImmediate, clearTimeout, clearInterval } = require('node:timers');
const { setTimeout: esperar } = require('node:timers/promises');

// Función reutilizable que recibe un argumento pasado por el temporizador
function mostrarTema(tema) {
  console.log(`Estoy aprendiendo ${tema}`);
}

function sumar(a,b){
  console.log(a + b);
}

setTimeout(sumar,5000,2,5)

// 1. setImmediate(): se ejecuta al finalizar la fase actual del ciclo síncrono
setImmediate(mostrarTema, 'setImmediate (inmediato)');

// 2. setTimeout(): ejecuta la función una sola vez después de X milisegundos
setTimeout(mostrarTema, 600, 'Node.js con setTimeout');

// También podemos cancelar un temporizador antes de que se dispare con clearTimeout()
const tareaCancelable = setTimeout(mostrarTema, 5000, 'Esto nunca se imprimirá');
clearTimeout(tareaCancelable);

// 3. setInterval() + clearInterval(): repite una tarea cada X ms y la detiene al llegar al límite
let repeticion = 0;
const intervalo = setInterval((tema) => {
  repeticion += 1;
  console.log(`[Repetición ${repeticion}/3] Practicando ${tema}`);
  if (repeticion >= 3) {
    clearInterval(intervalo); // Detiene el intervalo para que Node.js pueda finalizar
  }
}, 250, 'setInterval');

// 4. node:timers/promises: permite pausar funciones async con await sin callbacks
async function flujoAsincrono() {
  await esperar(300);
  mostrarTema('timers/promises con async/await');
}

flujoAsincrono();
