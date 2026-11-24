/**
 * BUS DE EVENTOS DESACOPLADO (src/bus.js)
 * - Evita que src/tareas.js tenga que saber cómo o dónde se guardan los logs de auditoría.
 * - Cuando tareas.js emite 'tarea:creada', 'tarea:completada' o 'tarea:eliminada',
 *   este bus dispara registrarEvento() hacia data/eventos.ndjson.
 * - Redirige cualquier rechazo de promesa al evento 'error' para no tumbar el proceso Node.
 */
// Importamos EventEmitter del módulo nativo node:events para comunicar eventos internos
import { EventEmitter } from 'node:events';
// Importamos la función que persiste cada evento en data/eventos.ndjson
import { registrarEvento } from './storage.js';

// Creamos y exportamos una única instancia compartida (patrón bus de eventos)
export const bus = new EventEmitter();

// Suscribimos el mismo manejador a los tres tipos de eventos del ciclo de vida de una tarea
for (const tipo of ['tarea:creada', 'tarea:completada', 'tarea:eliminada']) {
  // Cuando se emite el evento, guardamos el registro en eventos.ndjson de forma asíncrona
  bus.on(tipo, (datos) => {
    // Si falla la escritura en disco, redirigimos el fallo al evento 'error' del propio bus
    registrarEvento({ tipo, ...datos }).catch((err) => bus.emit('error', err));
  });
}

// Listener obligatorio para 'error': evita que un fallo no capturado detenga todo el proceso Node
bus.on('error', (err) => {
  console.error('Error en bus de eventos:', err.message);
});
