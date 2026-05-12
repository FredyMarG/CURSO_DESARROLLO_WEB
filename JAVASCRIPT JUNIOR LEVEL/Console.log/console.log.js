/**
 * GUÍA TÉCNICA DE MÉTODOS DE LA CONSOLA (DEBUGGING)
 * Este archivo contiene ejemplos de cómo utilizar las herramientas de inspección del navegador.
 */

/** 
 * Muestra un mensaje de error si la condición evaluada es falsa.
 * Útil para pruebas unitarias rápidas.
 */
console.assert(5 < 4) // Aserción fallida, se muestra un mensaje de error en la consola
console.assert(5 > 4) // Aserción exitosa, no se muestra ningún mensaje en la consola

/** Funciones básicas de registro */
console.clear() // Limpia el historial de la consola
console.error("Mensaje de error") // Registro con estilo de error (rojo)
console.info("Mensaje de información") // Registro informativo
console.log("Mensaje Normal") // Registro estándar
console.table([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]) // Muestra datos estructurados en una tabla
console.warn("Mensaje de Alerta") // Registro con estilo de advertencia (amarillo)
console.dir({ name: "Alice", age: 30 }) // Muestra una representación interactiva del objeto (propiedades)

/** Funciones de conteo */
console.count() // Incrementa y muestra el contador predeterminado
console.count() 
console.countReset() // Reinicia el contador predeterminado
console.count() 

/** Funciones de agrupación para organizar logs jerárquicamente */
console.group("Grupo 1") // Inicia bloque de mensajes agrupados
console.log("Mensaje dentro del Grupo 1") 
console.log("Otro mensaje dentro del Grupo 1") 
console.group("Subgrupo 1.1") // Grupo anidado
console.log("Mensaje dentro del Subgrupo 1.1") 
console.log("Otro mensaje dentro del subgrupo 1.1");
console.groupEnd() // Cierra el subgrupo
console.groupEnd() // Cierra el grupo principal

/** Grupo colapsado por defecto para no saturar la vista inicial */
console.groupCollapsed("Grupo Colapsado") 
console.log("Contenido oculto hasta expandir")
console.groupEnd()

/** Herramientas de medición de rendimiento (profiling básico) */
console.time("Tiempo de ejecución") // Inicia cronómetro con etiqueta
console.timeLog("Tiempo de ejecución") // Muestra tiempo parcial
console.timeEnd("Tiempo de ejecución") // Detiene cronómetro y muestra tiempo total