// 📚 Resize

// Cambio RELATIVO: Suma o resta los píxeles indicados al tamaño actual de la ventana (Ej: actual 500 + 100 = 600).
window.resizeBy(100, 100)

// Cambio ABSOLUTO: Establece el tamaño final exacto de la ventana, ignorando sus dimensiones previas.
window.resizeTo(800, 600)

// 📚 Move

// Desplaza la ventana de forma RELATIVA: Suma los píxeles indicados a las coordenadas actuales de la ventana en la pantalla.
window.moveBy(100, 100)

// Mueve la ventana a una posición ABSOLUTA: Ubica la ventana en las coordenadas exactas (x, y) de la pantalla del monitor.
window.moveTo(100, 100)