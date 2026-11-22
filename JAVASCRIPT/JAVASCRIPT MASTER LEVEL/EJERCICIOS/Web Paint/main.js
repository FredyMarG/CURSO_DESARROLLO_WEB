/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - EJERCICIO: WEB PAINT (HTML5 CANVAS 2D)
 * ARCHIVO: main.js
 * PIZARRA INTERACTIVA CON PINCEL, BORRADOR, HISTORIAL (CTRL+Z) Y EXPORTACIÓN PNG
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
"use strict"; // Activa el modo estricto para prevenir errores silenciosos

// Seleccionamos el elemento <canvas> del DOM y obtenemos su contexto 2D
const canvas = document.getElementById("canvas"); // Referencia al lienzo HTML5
const ctx = canvas.getContext("2d"); // Contexto de renderizado bidimensional

// Seleccionamos los controles de color, grosor y barra de estado
const colorInput = document.getElementById("color"); // Selector de color del trazo
const lwInput = document.getElementById("lw"); // Control deslizante del grosor
const lwVal = document.getElementById("lwVal"); // Etiqueta que muestra el grosor en píxeles
const coordsLabel = document.getElementById("paintCoords"); // Indicador de coordenadas (x, y)
const modeLabel = document.getElementById("paintMode"); // Indicador de herramienta activa

// Seleccionamos los botones de herramientas y acciones
const btnBrush = document.getElementById("btnBrush"); // Botón de modo pincel
const btnEraser = document.getElementById("btnEraser"); // Botón de modo borrador
const btnUndo = document.getElementById("btnUndo"); // Botón para deshacer último trazo
const btnClear = document.getElementById("btnClear"); // Botón para limpiar todo el lienzo
const btnDownload = document.getElementById("btnDownload"); // Botón para descargar como PNG

// Variables de estado interno del editor
const CANVAS_BG = "#0b1120"; // Color de fondo base del lienzo (usado al limpiar y borrar)
let painting = false; // Indica si el botón/puntero está presionado dibujando
let eraserMode = false; // Indica si está activo el borrador en lugar del pincel
let difX = 0; // Última coordenada horizontal registrada
let difY = 0; // Última coordenada vertical registrada
const history = []; // Pila de capturas ImageData para deshacer cambios (Undo)

// Guarda una captura del estado actual del lienzo en la pila de historial
const guardarEstado = () => { // Declara función de guardado en historial
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Almacena píxeles actuales
    if (history.length > 25) history.shift(); // Limita la pila a 25 estados para cuidar memoria
};

// Inicializa el lienzo con el fondo oscuro base y guarda el estado inicial
const inicializarLienzo = () => { // Declara función de inicialización
    ctx.fillStyle = CANVAS_BG; // Selecciona color de fondo oscuro
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellena todo el rectángulo del lienzo
    guardarEstado(); // Registra el lienzo vacío como primer estado en historial
};

// Calcula las coordenadas exactas del puntero escaladas al tamaño real del canvas
const obtenerCoordenadas = (e) => { // Declara función de cálculo de posición
    const rect = canvas.getBoundingClientRect(); // Obtiene posición y tamaño CSS actuales en pantalla
    const scaleX = canvas.width / rect.width; // Factor de escala horizontal
    const scaleY = canvas.height / rect.height; // Factor de escala vertical
    return { // Devuelve objeto con coordenadas redondeadas
        x: Math.round((e.clientX - rect.left) * scaleX), // Posición X relativa al lienzo
        y: Math.round((e.clientY - rect.top) * scaleY) // Posición Y relativa al lienzo
    };
};

// Dibuja un segmento suave entre dos puntos usando el color y grosor actuales
const dibujar = (x1, y1, x2, y2) => { // Declara función de trazo
    ctx.beginPath(); // Inicia una ruta nueva para no mezclar trazos anteriores
    ctx.strokeStyle = eraserMode ? CANVAS_BG : colorInput.value; // Usa fondo si es borrador, o color elegido
    ctx.lineWidth = Number(lwInput.value); // Asigna el grosor numérico del slider
    ctx.lineCap = "round"; // Redondea los extremos del trazo para suavidad
    ctx.lineJoin = "round"; // Suaviza las uniones entre segmentos
    ctx.moveTo(x1, y1); // Coloca el lápiz virtual en el punto inicial
    ctx.lineTo(x2, y2); // Traza línea recta hasta el punto destino
    ctx.stroke(); // Renderiza el trazo sobre el lienzo
    ctx.closePath(); // Cierra la sub-ruta actual
};

// Inicia el trazo al presionar ratón o dedo (Pointer Events soporta ambos)
canvas.addEventListener("pointerdown", (e) => { // Escucha inicio de presión sobre el canvas
    const pos = obtenerCoordenadas(e); // Calcula coordenadas iniciales exactas
    difX = pos.x; // Guarda X inicial
    difY = pos.y; // Guarda Y inicial
    painting = true; // Activa el estado de dibujo
    dibujar(difX, difY, pos.x + 0.01, pos.y + 0.01); // Pinta un punto inicial incluso sin arrastrar
});

// Continúa trazando mientras el puntero se mueve y actualiza coordenadas en vivo
canvas.addEventListener("pointermove", (e) => { // Escucha movimiento del puntero sobre el lienzo
    const pos = obtenerCoordenadas(e); // Calcula coordenadas actuales
    if (coordsLabel) coordsLabel.textContent = `Cursor: (x: ${pos.x}, y: ${pos.y})`; // Actualiza barra de estado
    if (!painting) return; // Detiene la ejecución si no se está presionando
    dibujar(difX, difY, pos.x, pos.y); // Dibuja segmento desde el punto previo al actual
    difX = pos.x; // Actualiza X previa para el siguiente movimiento
    difY = pos.y; // Actualiza Y previa para el siguiente movimiento
});

// Detiene el dibujo al soltar el puntero en cualquier lugar de la ventana
window.addEventListener("pointerup", () => { // Escucha liberación del puntero en toda la ventana
    if (!painting) return; // Ignora si no se estaba pintando
    painting = false; // Desactiva el estado de dibujo inmediatamente
    guardarEstado(); // Guarda el trazo completado en el historial para poder deshacer
});

// Actualiza el indicador visual de grosor cuando cambia el slider
lwInput.addEventListener("input", () => { // Escucha cambios en el control deslizante
    if (lwVal) lwVal.textContent = `${lwInput.value}px`; // Muestra el nuevo valor en píxeles
});

// Activa el modo pincel normal
btnBrush.addEventListener("click", () => { // Escucha clic en botón Pincel
    eraserMode = false; // Desactiva borrador
    btnBrush.classList.add("active"); // Marca Pincel como activo
    btnEraser.classList.remove("active"); // Quita estado activo a Borrador
    if (modeLabel) modeLabel.textContent = "Modo: Pincel · Ctrl+Z para deshacer"; // Actualiza etiqueta
});

// Activa el modo borrador
btnEraser.addEventListener("click", () => { // Escucha clic en botón Borrador
    eraserMode = true; // Activa borrador
    btnEraser.classList.add("active"); // Marca Borrador como activo
    btnBrush.classList.remove("active"); // Quita estado activo a Pincel
    if (modeLabel) modeLabel.textContent = "Modo: Borrador · Ctrl+Z para deshacer"; // Actualiza etiqueta
});

// Función para revertir el último trazo del historial
const deshacer = () => { // Declara función Undo
    if (history.length <= 1) return; // Mantiene al menos el estado inicial vacío
    history.pop(); // Descarta la última captura
    ctx.putImageData(history[history.length - 1], 0, 0); // Restaura la captura anterior en el lienzo
};

// Vincula el botón Deshacer y el atajo de teclado Ctrl+Z
btnUndo.addEventListener("click", deshacer); // Ejecuta deshacer al hacer clic
window.addEventListener("keydown", (e) => { // Escucha atajos de teclado globales
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { // Detecta Ctrl+Z o Cmd+Z
        e.preventDefault(); // Evita comportamiento por defecto del navegador
        deshacer(); // Revierte el último trazo
    }
});

// Limpia todo el lienzo rellenándolo de nuevo con el color base
btnClear.addEventListener("click", () => { // Escucha clic en botón Limpiar
    ctx.fillStyle = CANVAS_BG; // Color base oscuro
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Limpia toda el área
    guardarEstado(); // Guarda el estado limpio en el historial
});

// Exporta el dibujo actual como imagen PNG descargable
btnDownload.addEventListener("click", () => { // Escucha clic en botón Descargar PNG
    const enlace = document.createElement("a"); // Crea enlace temporal de descarga
    enlace.download = `web-paint-${Date.now()}.png`; // Define nombre único de archivo
    enlace.href = canvas.toDataURL("image/png"); // Convierte el contenido del canvas a Data URL PNG
    enlace.click(); // Dispara la descarga automáticamente
});

// Ejecuta la inicialización al cargar el script
inicializarLienzo(); // Prepara el lienzo y su primer estado en el historial
