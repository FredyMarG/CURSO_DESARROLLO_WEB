/**
 * RESIZE Y MOVE
 * Manipulación programática de la ventana (Window Object).
 * ⚠️ SEGURIDAD Y POLÍTICAS DE NAVEGADOR:
 * - Estos métodos generalmente solo funcionan en ventanas abiertas mediante window.open().
 * - La mayoría de navegadores modernos bloquean estas acciones en la pestaña principal 
 *   para prevenir abusos de UX y ataques de Clickjacking.
 */

// 📚 Resize

// Cambio RELATIVO: Suma o resta los píxeles indicados al tamaño actual de la ventana (Ej: actual 500 + 100 = 600).
// Sintaxis: window.resizeBy(xDelta, yDelta)
window.resizeBy(100, 100)

// Cambio ABSOLUTO: Establece el tamaño final exacto de la ventana, ignorando sus dimensiones previas.
window.resizeTo(800, 600)

// 📚 Move

// Desplaza la ventana de forma RELATIVA: Suma los píxeles indicados a las coordenadas actuales de la ventana en la pantalla.
window.moveBy(100, 100)

// Mueve la ventana a una posición ABSOLUTA: Ubica la ventana en las coordenadas exactas (x, y) de la pantalla del monitor.
window.moveTo(100, 100)