/**
 * CAPA DE PERSISTENCIA (src/storage.js)
 * - Único módulo que lee y escribe archivos en la carpeta data/.
 * - Guarda el estado actual en data/tareas.json (JSON formateado) y el historial
 *   append-only en data/eventos.ndjson (una línea JSON por evento, sin reescribir todo).
 * - Optimizado con caché de creación de carpeta (ensureDataDir) y cola secuencial
 *   de escritura (encolarEscritura) para evitar condiciones de carrera entre peticiones.
 */
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Calculamos rutas absolutas hacia data/ partiendo de la ubicación real de este archivo
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const TAREAS_PATH = join(DATA_DIR, 'tareas.json');
const EVENTOS_PATH = join(DATA_DIR, 'eventos.ndjson');

// Promesa reutilizable para crear data/ una sola vez por ejecución
let dataDirPromise = null;
function ensureDataDir() {
  if (!dataDirPromise) {
    dataDirPromise = mkdir(DATA_DIR, { recursive: true });
  }
  return dataDirPromise;
}

// Cola secuencial de escrituras para evitar que dos operaciones simultáneas pisen tareas.json
let writeQueue = Promise.resolve();
export function encolarEscritura(operacion) {
  const siguiente = writeQueue.then(operacion, operacion);
  writeQueue = siguiente.catch(() => {});
  return siguiente;
}

// Lee y deserializa la lista de tareas desde data/tareas.json
export async function leerTareas() {
  try {
    const contenido = await readFile(TAREAS_PATH, 'utf8');
    return JSON.parse(contenido);
  } catch (error) {
    // Si el archivo aún no existe (primer uso), devolvemos un arreglo vacío
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// Serializa y guarda el arreglo completo de tareas en data/tareas.json
export async function guardarTareas(tareas) {
  await ensureDataDir();
  await writeFile(TAREAS_PATH, JSON.stringify(tareas, null, 2) + '\n', 'utf8');
}

// Agrega un evento al final de data/eventos.ndjson sin reescribir todo el archivo
export async function registrarEvento(evento) {
  await ensureDataDir();
  const linea = JSON.stringify({ ts: new Date().toISOString(), ...evento }) + '\n';
  await appendFile(EVENTOS_PATH, linea, 'utf8');
}
