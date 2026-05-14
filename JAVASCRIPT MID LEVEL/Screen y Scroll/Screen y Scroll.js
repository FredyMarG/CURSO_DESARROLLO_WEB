/**
 * 🖥️ MODULE: SCREEN & SCROLL INTERFACE
 * Gestión de telemetría de hardware y manipulación programática del Viewport.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicialización de telemetría de pantalla
    actualizarDatosScreen();
    
    // Escucha de eventos de desplazamiento para actualizar métricas en vivo
    window.addEventListener("scroll", actualizarMetricasScroll);
});

/**
 * Captura datos del objeto 'screen' (Hardware).
 * @function actualizarDatosScreen
 */
function actualizarDatosScreen() {
    // screen.width/height: Resolución total del monitor físico
    document.getElementById('scr-res').textContent = `${screen.width}x${screen.height}`;
    
    // screen.availWidth/Height: Área disponible restando barras de tareas del SO
    document.getElementById('scr-avail').textContent = `${screen.availWidth}x${screen.availHeight}`;
    
    // colorDepth: Bits utilizados para representar el color de un píxel
    document.getElementById('scr-depth').textContent = `${screen.colorDepth}-bit`;
    
    // Log de posición de ventana respecto al monitor
    console.log(`Window Position: X:${window.screenLeft} Y:${window.screenTop}`);
}

/**
 * Actualiza los valores de scroll en la interfaz.
 * @function actualizarMetricasScroll
 */
function actualizarMetricasScroll() {
    // scrollX/Y: Cantidad de píxeles desplazados desde el origen (0,0)
    document.getElementById('val-x').textContent = Math.floor(window.scrollX);
    document.getElementById('val-y').textContent = Math.floor(window.scrollY);
}

/**
 * Mueve el scroll una cantidad relativa.
 */
function irAbajo() {
    // scrollBy: Desplazamiento relativo a la posición actual
    window.scrollBy({
        top: 200,
        behavior: 'smooth' // Desplazamiento animado nativo
    });
}

/**
 * Mueve el scroll a una posición absoluta.
 */
function volverInicio() {
    // scrollTo: Desplazamiento a coordenadas fijas del documento
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
