/**
 * LOCATION (URL actual)
 * Lectura de partes de la URL. assign() carga una nueva página (requiere una URL válida).
 */

/** Propiedades y métodos del objeto Location (Control de la URL) */

document.write(window.location.href + "<br>")   // URL completa actual

document.write(window.location.hostname +"<br>"); // Nombre del dominio/host

document.write(window.location.pathname + "<br>"); // Ruta interna del recurso

document.write(window.location.protocol + "<br>"); // Protocolo (http:, https:)

/* assign(url): navega a la dirección indicada (ejemplo comentado para no redirigir al abrir el archivo)
   document.write(window.location.assign("https://ejemplo.com"))
*/