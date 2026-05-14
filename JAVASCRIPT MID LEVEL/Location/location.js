/**
 * OBJETO WINDOW.LOCATION
 * Representa la ubicación (URL) del objeto al que está vinculado.
 * Permite interactuar con la dirección del navegador y controlar la navegación.
 */

/** Propiedades de lectura del objeto Location */

// .href: Retorna la URL completa (ej: https://localhost:3000/index.html)
document.write(`<b>URL:</b> ${window.location.href} <br>`);

// .hostname: Retorna el dominio del servidor (ej: www.google.com)
document.write(`<b>Host:</b> ${window.location.hostname} <br>`);

// .pathname: Retorna el path o ruta interna tras el dominio (ej: /user/settings)
document.write(`<b>Ruta:</b> ${window.location.pathname} <br>`);

// .protocol: Retorna el protocolo de transferencia (http: o https:)
document.write(`<b>Protocolo:</b> ${window.location.protocol} <br>`);

/** 
 * Métodos de navegación (Acciones):
 * 
 * .assign(url): Navega a la URL indicada (añade entrada al historial).
 * .replace(url): Reemplaza la URL actual (no permite "atrás").
 * .reload(): Recarga la página.
 * 
 * Ejemplo: window.location.assign("https://github.com");
 */