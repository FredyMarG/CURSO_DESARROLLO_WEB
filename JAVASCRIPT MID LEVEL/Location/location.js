/**
 * OBJETO WINDOW.LOCATION
 * Representa la ubicación (URL) del objeto al que está vinculado.
 * Permite interactuar con la dirección del navegador y controlar la navegación.
 */

/** 
 * Actualización dinámica del DOM con propiedades de Location.
 * Se evita el uso de document.write para no sobrescribir el documento tras la carga.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos
    const hrefEl = document.getElementById('href');
    const hostEl = document.getElementById('host');
    const pathEl = document.getElementById('path');
    const protocolEl = document.getElementById('protocol');

    // Inyección de valores
    hrefEl.textContent = window.location.href;
    hostEl.textContent = window.location.hostname;
    pathEl.textContent = window.location.pathname;
    protocolEl.textContent = window.location.protocol;
});

/** 
 * Métodos de navegación (Acciones):
 * 
 * .assign(url): Navega a la URL indicada (añade entrada al historial).
 * .replace(url): Reemplaza la URL actual (no permite "atrás").
 * .reload(): Recarga la página.
 * 
 * Ejemplo: window.location.assign("https://github.com");
 */