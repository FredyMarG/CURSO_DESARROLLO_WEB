// ============================================================================
// MÓDULO 03: MÓDULOS EN NODE.JS — MÓDULO LOCAL EXPORTABLE (saludo.js)
// Este archivo encapsula funciones de saludo para reutilizarlas con require()
// ============================================================================

// Definimos una función que construye un saludo personalizado
function saludar(nombre) {
  // Retornamos un template string interpolando el nombre recibido
  return `Hola ${nombre}`;
} // Fin de la función saludar

// Definimos una segunda función auxiliar para mostrar exportación múltiple
function despedir(nombre) {
  // Retornamos un mensaje de despedida personalizado
  return `Hasta pronto, ${nombre}`;
} // Fin de la función despedir

// Exportamos ambas funciones mediante module.exports (CommonJS, acorde a NODE/package.json)
module.exports = {
  // Propiedad pública saludar
  saludar,
  // Propiedad pública despedir
  despedir,
}; // Fin de module.exports
