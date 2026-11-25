/**
 * LÓGICA DE NEGOCIO / CRUD (src/tareas.js)
 * - Centraliza las reglas del dominio (crear, listar, completar, eliminar) sin depender
 *   ni de la terminal (process.argv) ni de HTTP (req/res).
 * - Usa encolarEscritura() para serializar escrituras concurrentes sobre tareas.json.
 * - Reutiliza buscarTareaPorId() para evitar duplicar validación y búsqueda por prefijo.
 */
import { randomUUID } from 'node:crypto'; // Importa módulo o dependencia
import { leerTareas, guardarTareas, encolarEscritura } from './storage.js'; // Importa módulo o dependencia
import { bus } from './bus.js'; // Importa módulo o dependencia

// Crea un Error etiquetado como 'validation' para devolver HTTP 400 o validarlo en tests
function errorValidacion(mensaje) { // Define función reutilizable
  const error = new Error(mensaje); // Declara e inicializa variable local
  error.code = 'validation';
  return error; // Retorna el resultado de la función
}

// Valida un texto obligatorio y devuelve su versión sin espacios extremos
function exigirTexto(valor, mensajeError) { // Define función reutilizable
  if (!valor || typeof valor !== 'string' || valor.trim() === '') { // Evalúa condición lógica
    throw errorValidacion(mensajeError);
  }
  return valor.trim(); // Retorna el resultado de la función
}

// Carga las tareas y localiza una por UUID completo o prefijo corto (startsWith)
async function buscarTareaPorId(id) { // Define función asíncrona
  const buscado = exigirTexto(id, 'Debes indicar el ID de la tarea'); // Declara e inicializa variable local
  const tareas = await leerTareas(); // Declara e inicializa variable local
  const indice = tareas.findIndex((t) => t.id === buscado || t.id.startsWith(buscado)); // Declara e inicializa variable local
  if (indice === -1) { // Evalúa condición lógica
    throw new Error(`No existe ninguna tarea con id "${buscado}"`);
  }
  return { tareas, indice, tarea: tareas[indice] }; // Retorna el resultado de la función
}

// Crea una nueva tarea, la guarda en tareas.json y emite 'tarea:creada'
export async function crear(descripcion) {
  const texto = exigirTexto(descripcion, 'La descripción es requerida'); // Declara e inicializa variable local
  return encolarEscritura(async () => {
    const tareas = await leerTareas(); // Declara e inicializa variable local
    const tarea = {
      id: randomUUID(),
      descripcion: texto,
      completada: false,
      creadoEn: new Date().toISOString(),
    };
    tareas.push(tarea);
    await guardarTareas(tareas);
    bus.emit('tarea:creada', { id: tarea.id, descripcion: tarea.descripcion });
    return tarea; // Retorna el resultado de la función
  });
}

// Devuelve todas las tareas almacenadas en data/tareas.json
export async function listar() {
  return await leerTareas(); // Retorna el resultado de la función
}

// Marca una tarea como completada buscando por ID completo o prefijo
export async function completar(id) {
  return encolarEscritura(async () => {
    const { tareas, tarea } = await buscarTareaPorId(id); // Declara e inicializa variable local
    tarea.completada = true;
    await guardarTareas(tareas);
    bus.emit('tarea:completada', { id: tarea.id });
    return tarea; // Retorna el resultado de la función
  });
}

// Elimina una tarea buscando por ID completo o prefijo
export async function eliminar(id) {
  return encolarEscritura(async () => {
    const { tareas, indice, tarea } = await buscarTareaPorId(id); // Declara e inicializa variable local
    tareas.splice(indice, 1);
    await guardarTareas(tareas);
    bus.emit('tarea:eliminada', { id: tarea.id });
    return tarea; // Retorna el resultado de la función
  });
}

