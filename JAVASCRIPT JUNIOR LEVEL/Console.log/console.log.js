/**
 * GUÍA TÉCNICA DE MÉTODOS DE LA CONSOLA (DEBUGGING)
 * Este archivo contiene ejemplos de cómo utilizar las herramientas de inspección del navegador.
 */

/** 
 * Muestra un mensaje de error si la condición evaluada es falsa.
 * Útil para validaciones rápidas (Sanity Checks) sin detener la ejecución del script.
 */
console.assert(5 < 4, "Error: 5 no es menor que 4"); 
console.assert(5 > 4); // No muestra nada porque es verdadero.

/** Funciones básicas de registro */
console.clear(); // Limpia la consola para empezar una sesión de debugging limpia.
console.error("Acceso denegado"); // Formato visual de error (rojo con icono de error).
console.info("La API ha respondido correctamente"); // Mensaje informativo (a veces incluye icono 'i').
console.log("Estado de la variable x:", 10); // El más común para seguimiento general.

/** .table(): Transforma arrays u objetos en tablas visuales legibles. ¡Excelente para JSON! */
console.table([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]); 

console.warn("Esta función será eliminada en la versión 2.0"); // Aviso preventivo (amarillo).

/** .dir(): A diferencia de .log, dir muestra la lista interactiva de todas las propiedades de un objeto JS. */
console.dir(document.body); 

/** Funciones de conteo */
console.count("Clic en botón"); // Útil para saber cuántas veces se ejecuta una función o evento.
console.count() 
console.countReset("Clic en botón"); // Reinicia el contador específico.
console.count() 

/** Funciones de agrupación para organizar logs jerárquicamente */
console.group("Proceso de Carga de Datos"); // Agrupa mensajes relacionados.
    console.log("Conectando a DB...");
    console.log("Descargando assets...");
    console.group("Sub-tareas");
        console.log("Limpiando caché");
    console.groupEnd(); // Finaliza el subgrupo.
console.groupEnd(); // Finaliza el grupo principal.

/** Grupo colapsado por defecto para no saturar la vista inicial */
console.groupCollapsed("Grupo Colapsado") 
console.log("Contenido oculto hasta expandir")
console.groupEnd()

/** Herramientas de medición de rendimiento (profiling básico) */
/** Ideal para comparar qué algoritmo es más rápido (ej: bucle for vs forEach). */
console.time("Carga de Imágenes"); 
    // Simulando proceso...
console.timeLog("Carga de Imágenes"); // Muestra el tiempo transcurrido sin detenerlo.
console.timeEnd("Carga de Imágenes"); // Detiene el cronómetro y muestra el resultado final en ms.