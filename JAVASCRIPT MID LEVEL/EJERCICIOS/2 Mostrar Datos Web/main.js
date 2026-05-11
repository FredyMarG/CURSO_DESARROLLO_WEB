/**
 * EJERCICIO: Mostrar información de navegación y controlar UI dinámica.
 */

// 🎯 Selección de nodos del DOM mediante ID.
// Se utiliza una declaración múltiple para capturar las etiquetas donde se mostrarán los datos.
let href = document.getElementById('href'),      // Párrafo para la URL completa.
    pathname = document.getElementById('path'),  // Párrafo para la ruta del archivo.
    hostname = document.getElementById('host'),  // Párrafo para el dominio/servidor.
    protocol = document.getElementById('protocol'), // Párrafo para el protocolo (http/https).
    aceptar = document.getElementById('aceptar'),   // Botón que dispara la acción.
    solucion = document.getElementById('solucion'); // Contenedor principal de los resultados.

// 🖱️ Listener para detectar el clic en el botón de confirmación.
aceptar.addEventListener('click', () => {
    
    // 🌐 Extracción de datos del objeto global 'window.location':
    // protocol: Devuelve el esquema de la URL (ej: "http:", "https:", "file:").
    protocol.textContent = `Protocolo: ${window.location.protocol}`;
    
    // hostname: Devuelve el dominio del servidor (ej: "127.0.0.1" o "google.com").
    hostname.textContent = `Host: ${window.location.hostname}`;
    
    // pathname: Devuelve la ruta relativa al host (ej: "/ejercicios/index.html").
    pathname.textContent = `Ruta: ${window.location.pathname}`;
    
    // href: Devuelve la cadena de texto con la URL completa y absoluta.
    href.textContent = `URL completa: ${window.location.href} `;

    // 👁️ Hace visible el contenedor 'solucion' cambiando su propiedad CSS.
    solucion.style.visibility = 'visible';
    
    // 🔄 Limpieza de clases de animación para permitir que el ciclo se reinicie.
    solucion.classList.remove("mostrar", "ocultar");

    /**
     * ⚡ HACK DE RENDIMIENTO: Force Reflow (Reflujo forzado).
     * Al acceder a 'offsetWidth', obligamos al motor de renderizado a recalcular el diseño.
     * Esto permite que, aunque quitemos y pongamos la clase 'mostrar' en el mismo microtask,
     * el navegador detecte el cambio y ejecute la animación CSS de nuevo.
     */
    void solucion.offsetWidth;
    
    // 🎬 Dispara la animación de entrada definida en tu archivo CSS.
    solucion.classList.add("mostrar");
});