/**
 * INTERFAZ DE TERMINAL / CLI (src/index.js)
 * - Punto de entrada para ejecutar comandos desde Bash o PowerShell (npm start / node src/index.js).
 * - Lee process.argv.slice(2), enruta add/list/done/delete hacia src/tareas.js
 *   y usa process.exitCode = 1 en errores para avisar a la terminal sin cortar con process.exit().
 */
// Importamos las operaciones de negocio desde src/tareas.js
import { crear, listar, completar, eliminar } from './tareas.js';

// process.argv contiene [rutaDeNode, rutaDelScript, ...argumentosDelUsuario]
// Con slice(2) tomamos el subcomando (add, list, done, delete) y el resto de argumentos
const [comando, ...args] = process.argv.slice(2);

// Imprime la guía de uso cuando el usuario no pasa un comando válido
function mostrarAyuda() {
  console.log(`
Gestor de Tareas CLI (Node.js)
Uso:
  node src/index.js add "Descripción de la tarea"
  node src/index.js list
  node src/index.js done <id-o-prefijo>
  node src/index.js delete <id-o-prefijo>
`);
}

// Función principal asíncrona que enruta el comando ingresado en la terminal
async function main() {
  try {
    switch (comando) {
      case 'add': {
        // Unimos todos los argumentos posteriores por si la descripción tiene varias palabras
        const descripcion = args.join(' ');
        // Creamos y guardamos la tarea en JSON
        const nueva = await crear(descripcion);
        // Mostramos los primeros 8 caracteres del UUID para facilitar futuros comandos
        console.log(`✅ Tarea creada [${nueva.id.slice(0, 8)}]: ${nueva.descripcion}`);
        break;
      }

      case 'list': {
        // Obtenemos todas las tareas guardadas
        const tareas = await listar();
        // Si no hay tareas, informamos con un mensaje claro
        if (tareas.length === 0) {
          console.log('📭 No hay tareas registradas todavía.');
          break;
        }
        // Recorremos e imprimimos cada tarea con su icono de estado y prefijo de ID
        for (const t of tareas) {
          const estado = t.completada ? '✅' : '⏳';
          console.log(`${estado} [${t.id.slice(0, 8)}] ${t.descripcion}`);
        }
        break;
      }

      case 'done': {
        // Marcamos como completada la tarea indicada en el primer argumento (ID o prefijo)
        const tarea = await completar(args[0]);
        console.log(`🎉 Tarea completada [${tarea.id.slice(0, 8)}]: ${tarea.descripcion}`);
        break;
      }

      case 'delete': {
        // Eliminamos la tarea indicada en el primer argumento (ID o prefijo)
        const eliminada = await eliminar(args[0]);
        console.log(`🗑️  Tarea eliminada [${eliminada.id.slice(0, 8)}]: ${eliminada.descripcion}`);
        break;
      }

      default:
        // Si no coincide con ningún comando conocido, mostramos la ayuda
        mostrarAyuda();
        break;
    }
  } catch (error) {
    // Capturamos errores de validación, ID inexistente o disco sin mostrar stack traces crudos
    console.error(`❌ Error: ${error.message}`);
    // Marcamos código de salida 1 para indicar fallo en scripts o terminales
    process.exitCode = 1;
  }
}

// Ejecutamos la función principal con top-level await (permitido en ES Modules)
await main();
