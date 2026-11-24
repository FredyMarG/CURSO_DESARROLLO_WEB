/**
 * LÓGICA DE NEGOCIO / CRUD (src/tareas.js)
 * - Centraliza las reglas del dominio (crear, listar, completar, eliminar) sin depender
 *   ni de la terminal (process.argv) ni de HTTP (req/res).
 * - Etiqueta los fallos de entrada con error.code = 'validation' para que server.js
 *   pueda responder HTTP 400 y los tests puedan identificarlos fácilmente.
 * - completar() y eliminar() aceptan UUID completo (web) o prefijo corto (CLI) vía startsWith().
 */
// Importamos randomUUID para generar identificadores únicos criptográficamente seguros
import { randomUUID } from 'node:crypto';
// Importamos las funciones de lectura y escritura JSON de la capa de almacenamiento
import { leerTareas, guardarTareas } from './storage.js';
// Importamos el bus de eventos para notificar cada acción realizada sobre una tarea
import { bus } from './bus.js';

// Crea una nueva tarea, la guarda en tareas.json y emite el evento 'tarea:creada'
export async function crear(descripcion) {
  // Validamos que la descripción exista, sea string y no tenga solo espacios
  if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
    const error = new Error('La descripción es requerida');
    // Etiquetamos el error con un código propio para distinguirlo fácilmente
    error.code = 'validation';
    throw error;
  }

  // Leemos las tareas actuales desde disco
  const tareas = await leerTareas();
  // Generamos un UUID v4 único (ej. "40bf73ca-...")
  const id = randomUUID();
  // Construimos el objeto tarea con los campos que se serializarán a data/tareas.json
  const tarea = {
    id,
    descripcion: descripcion.trim(),
    completada: false,
    creadoEn: new Date().toISOString(),
  };

  // Añadimos la nueva tarea al arreglo en memoria
  tareas.push(tarea);
  // Persistimos el arreglo actualizado en data/tareas.json
  await guardarTareas(tareas);
  // Notificamos al bus para que registre la creación en data/eventos.ndjson
  bus.emit('tarea:creada', { id: tarea.id, descripcion: tarea.descripcion });
  // Devolvemos la tarea recién creada al llamador (CLI o test)
  return tarea;
}

// Devuelve todas las tareas almacenadas en data/tareas.json
export async function listar() {
  return await leerTareas();
}

// Marca una tarea como completada buscando por ID completo o por su prefijo corto
export async function completar(id) {
  // Validamos que se haya pasado un ID no vacío
  if (!id || typeof id !== 'string' || id.trim() === '') {
    const error = new Error('Debes indicar el ID de la tarea');
    error.code = 'validation';
    throw error;
  }

  // Cargamos todas las tareas desde disco
  const tareas = await leerTareas();
  // Limpiamos espacios del ID recibido
  const buscado = id.trim();
  // Buscamos coincidencia exacta o por los primeros caracteres del UUID
  const tarea = tareas.find((t) => t.id === buscado || t.id.startsWith(buscado));
  // Si no existe ninguna coincidencia, lanzamos un error descriptivo
  if (!tarea) {
    throw new Error(`No existe ninguna tarea con id "${buscado}"`);
  }

  // Actualizamos el estado de la tarea a completada
  tarea.completada = true;
  // Guardamos los cambios en data/tareas.json
  await guardarTareas(tareas);
  // Emitimos el evento de auditoría correspondiente
  bus.emit('tarea:completada', { id: tarea.id });
  // Devolvemos la tarea actualizada
  return tarea;
}

// Elimina una tarea buscando por ID completo o por su prefijo corto
export async function eliminar(id) {
  // Validamos que el ID no esté vacío
  if (!id || typeof id !== 'string' || id.trim() === '') {
    const error = new Error('Debes indicar el ID de la tarea');
    error.code = 'validation';
    throw error;
  }

  // Cargamos las tareas actuales
  const tareas = await leerTareas();
  // Limpiamos espacios del ID recibido
  const buscado = id.trim();
  // Localizamos la tarea objetivo para poder devolverla y registrar su ID completo
  const objetivo = tareas.find((t) => t.id === buscado || t.id.startsWith(buscado));
  // Si no se encuentra, lanzamos error
  if (!objetivo) {
    throw new Error(`No existe ninguna tarea con id "${buscado}"`);
  }

  // Creamos un nuevo arreglo excluyendo la tarea encontrada (sin mutar innecesariamente)
  const restantes = tareas.filter((t) => t.id !== objetivo.id);
  // Guardamos el nuevo arreglo en data/tareas.json
  await guardarTareas(restantes);
  // Emitimos el evento de eliminación hacia eventos.ndjson
  bus.emit('tarea:eliminada', { id: objetivo.id });
  // Devolvemos la tarea que fue eliminada
  return objetivo;
}
