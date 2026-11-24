/**
 * LÓGICA DE NEGOCIO / CRUD (src/tareas.js)
 * - Centraliza las reglas del dominio (crear, listar, completar, eliminar) sin depender
 *   ni de la terminal (process.argv) ni de HTTP (req/res).
 * - Usa encolarEscritura() para serializar escrituras concurrentes sobre tareas.json.
 * - Reutiliza buscarTareaPorId() para evitar duplicar validación y búsqueda por prefijo.
 */
import { randomUUID } from 'node:crypto';
import { leerTareas, guardarTareas, encolarEscritura } from './storage.js';
import { bus } from './bus.js';

// Crea un Error etiquetado como 'validation' para devolver HTTP 400 o validarlo en tests
function errorValidacion(mensaje) {
  const error = new Error(mensaje);
  error.code = 'validation';
  return error;
}

// Valida un texto obligatorio y devuelve su versión sin espacios extremos
function exigirTexto(valor, mensajeError) {
  if (!valor || typeof valor !== 'string' || valor.trim() === '') {
    throw errorValidacion(mensajeError);
  }
  return valor.trim();
}

// Carga las tareas y localiza una por UUID completo o prefijo corto (startsWith)
async function buscarTareaPorId(id) {
  const buscado = exigirTexto(id, 'Debes indicar el ID de la tarea');
  const tareas = await leerTareas();
  const indice = tareas.findIndex((t) => t.id === buscado || t.id.startsWith(buscado));
  if (indice === -1) {
    throw new Error(`No existe ninguna tarea con id "${buscado}"`);
  }
  return { tareas, indice, tarea: tareas[indice] };
}

// Crea una nueva tarea, la guarda en tareas.json y emite 'tarea:creada'
export async function crear(descripcion) {
  const texto = exigirTexto(descripcion, 'La descripción es requerida');
  return encolarEscritura(async () => {
    const tareas = await leerTareas();
    const tarea = {
      id: randomUUID(),
      descripcion: texto,
      completada: false,
      creadoEn: new Date().toISOString(),
    };
    tareas.push(tarea);
    await guardarTareas(tareas);
    bus.emit('tarea:creada', { id: tarea.id, descripcion: tarea.descripcion });
    return tarea;
  });
}

// Devuelve todas las tareas almacenadas en data/tareas.json
export async function listar() {
  return await leerTareas();
}

// Marca una tarea como completada buscando por ID completo o prefijo
export async function completar(id) {
  return encolarEscritura(async () => {
    const { tareas, tarea } = await buscarTareaPorId(id);
    tarea.completada = true;
    await guardarTareas(tareas);
    bus.emit('tarea:completada', { id: tarea.id });
    return tarea;
  });
}

// Elimina una tarea buscando por ID completo o prefijo
export async function eliminar(id) {
  return encolarEscritura(async () => {
    const { tareas, indice, tarea } = await buscarTareaPorId(id);
    tareas.splice(indice, 1);
    await guardarTareas(tareas);
    bus.emit('tarea:eliminada', { id: tarea.id });
    return tarea;
  });
}
