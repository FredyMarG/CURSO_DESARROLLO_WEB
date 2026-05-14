/**
 * 🖥️ WINDOW OBJECT: RESIZE & MOVE LABORATORY
 * 
 * ⚠️ SEGURIDAD Y POLÍTICAS DE NAVEGADOR:
 * - Estos métodos generalmente solo funcionan en ventanas abiertas mediante window.open().
 * - La mayoría de navegadores modernos bloquean estas acciones en la pestaña principal 
 *   para prevenir abusos de UX y ataques de Clickjacking.
 */

/**
 * Implementación de cambios de tamaño (RESIZE).
 * Se envuelven en funciones para permitir una ejecución controlada mediante la UI.
 */
function probarResize() {
    console.log("Iniciando prueba de redimensión...");

    // resizeBy(x, y): Cambio RELATIVO. Añade o quita píxeles a las dimensiones actuales.
    // Ejemplo: Si la ventana mide 500px, sumará 100px para llegar a 600px.
    window.resizeBy(100, 100);

    // resizeTo(width, height): Cambio ABSOLUTO. Define el tamaño exacto ignorando el estado previo.
    // Nota: Esto fallará en la mayoría de pestañas principales si no fueron abiertas por el script.
    setTimeout(() => window.resizeTo(800, 600), 1000);
}

/**
 * Implementación de cambios de posición (MOVE).
 */
function probarMove() {
    console.log("Iniciando prueba de posicionamiento...");

    // moveBy(x, y): Desplazamiento RELATIVO. Mueve la ventana respecto a su posición (x,y) actual en el monitor.
    window.moveBy(50, 50);

    // moveTo(x, y): Desplazamiento ABSOLUTO. Ubica la esquina superior izquierda en coordenadas específicas del monitor.
    // (0,0) sería la esquina superior izquierda física de tu pantalla.
    setTimeout(() => window.moveTo(200, 200), 1000);
}