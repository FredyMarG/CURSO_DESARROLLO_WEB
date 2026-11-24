/**
 * PRUEBAS AUTOMATIZADAS (tests/tareas.test.js)
 * - Usa el corredor nativo node:test y aserciones estrictas node:assert/strict (cero librerías).
 * - Valida el rechazo de descripciones vacías (error.code === 'validation') y recorre el ciclo
 *   CRUD completo (crear -> listar -> completar por prefijo -> eliminar) dejando data/ limpio.
 */
// Importamos el corredor nativo de pruebas de Node.js (sin dependencias externas)
import test from 'node:test';
// Importamos aserciones estrictas (=== en lugar de ==)
import assert from 'node:assert/strict';
// Importamos las funciones de negocio que vamos a probar desde src/tareas.js
import { crear, listar, completar, eliminar } from '../src/tareas.js';

// Prueba 1: verifica que la validación rechace descripciones vacías
test('crear() rechaza descripciones vacías con código validation', async () => {
  await assert.rejects(
    () => crear('   '),
    // Comprobamos que el error lanzado tenga nuestro código personalizado
    (err) => err.code === 'validation'
  );
});

// Prueba 2: recorre el ciclo completo CRUD (crear -> listar -> completar -> eliminar)
test('flujo completo: crear, listar, completar y eliminar tarea', async () => {
  // Creamos una tarea temporal de prueba
  const creada = await crear('Tarea de prueba automatizada');
  assert.equal(typeof creada.id, 'string');
  assert.equal(creada.completada, false);

  // Verificamos que aparezca al listar las tareas
  const todas = await listar();
  assert.equal(todas.some((t) => t.id === creada.id), true);

  // Probamos completar usando solo el prefijo de 8 caracteres del UUID
  const completada = await completar(creada.id.slice(0, 8));
  assert.equal(completada.completada, true);

  // Eliminamos la tarea temporal para dejar data/tareas.json limpio
  const eliminada = await eliminar(creada.id.slice(0, 8));
  assert.equal(eliminada.id, creada.id);

  // Confirmamos que ya no existe en el listado final
  const restantes = await listar();
  assert.equal(restantes.some((t) => t.id === creada.id), false);
});
