/**
 * CAPA DE PERSISTENCIA (src/storage.js)
 * - Único módulo que lee y escribe archivos en la carpeta data/.
 * - Guarda el estado actual en data/tareas.json (JSON formateado) y el historial
 *   append-only en data/eventos.ndjson (una línea JSON por evento, sin reescribir todo).
 * - Es compartido tanto por el CLI (src/index.js) como por la API web (src/server.js).
 */
// Importamos las funciones asíncronas de sistema de archivos basadas en promesas
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
// Importamos utilidades para construir rutas multiplataforma (Windows / Linux / macOS)
import { dirname, join } from 'node:path';
// Importamos fileURLToPath porque en ES Modules no existe __dirname por defecto
import { fileURLToPath } from 'node:url';

// Obtenemos la ruta absoluta de la carpeta actual (src/) a partir de import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));
// Subimos un nivel desde src/ hasta la raíz del proyecto y apuntamos a la carpeta data/
const DATA_DIR = join(__dirname, '..', 'data');
// Ruta completa al archivo JSON donde se guarda el estado actual de las tareas
// Nota: tareas.json NO lleva comentarios (// o /* */) porque el estándar JSON (RFC 8259) los prohíbe
const TAREAS_PATH = join(DATA_DIR, 'tareas.json');
// Ruta completa al archivo NDJSON (una línea JSON por evento) para el historial de auditoría
const EVENTOS_PATH = join(DATA_DIR, 'eventos.ndjson');

// Lee y deserializa la lista de tareas desde data/tareas.json
export async function leerTareas() {
  try {
    // Leemos el archivo como texto UTF-8
    const contenido = await readFile(TAREAS_PATH, 'utf8');
    // Convertimos el texto JSON en un arreglo de objetos JavaScript
    return JSON.parse(contenido);
  } catch (error) {
    // Si el archivo aún no existe (primer uso), devolvemos un arreglo vacío en lugar de fallar
    if (error.code === 'ENOENT') return [];
    // Si es otro error (permisos, JSON corrupto, etc.), lo propagamos
    throw error;
  }
}

// Serializa y guarda el arreglo completo de tareas en data/tareas.json
export async function guardarTareas(tareas) {
  // Creamos la carpeta data/ si no existe todavía (recursive evita error si ya existe)
  await mkdir(DATA_DIR, { recursive: true });
  // Formateamos el JSON con 2 espacios de sangría y salto de línea final
  await writeFile(TAREAS_PATH, JSON.stringify(tareas, null, 2) + '\n', 'utf8');
}

// Agrega un evento al final de data/eventos.ndjson sin reescribir todo el archivo
export async function registrarEvento(evento) {
  // Aseguramos que la carpeta data/ exista antes de escribir
  await mkdir(DATA_DIR, { recursive: true });
  // Construimos una sola línea JSON con marca de tiempo ISO 8601 + los datos del evento
  const linea = JSON.stringify({ ts: new Date().toISOString(), ...evento }) + '\n';
  // Añadimos la línea al final del archivo NDJSON
  await appendFile(EVENTOS_PATH, linea, 'utf8');
}