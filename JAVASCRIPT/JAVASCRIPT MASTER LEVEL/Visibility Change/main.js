/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: PAGE VISIBILITY API (visibilitychange)
 * ARCHIVO: main.js
 * Guía teórica, preservación del código inicial, simulador en Node.js y ejemplos
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict";

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
// Detectamos si el script se está ejecutando en un navegador web real (donde existe document y addEventListener)
const esEntornoNavegador = typeof window !== "undefined" && typeof document !== "undefined";

// Creamos un simulador ligero del objeto document para poder ejecutar toda la guía en Node.js sin errores
const docSimulado = {
    // Estado inicial de visibilidad en texto ("visible" o "hidden")
    visibilityState: "visible",
    // Propiedad booleana equivalente (false cuando es visible, true cuando está oculta)
    hidden: false,
    // Título simulado de la pestaña del navegador
    title: "Page Visibility API | Master Level",
    // Arreglo interno de funciones suscritas al evento visibilitychange
    _listeners: [],
    // Método equivalente a document.addEventListener("visibilitychange", callback)
    addEventListener(evento, callback) {
        // Si el evento registrado es visibilitychange, guardamos el callback
        if (evento === "visibilitychange") {
            // Añadimos la función a la lista de escuchadores
            this._listeners.push(callback);
        }
    },
    // Método auxiliar del simulador para emular un cambio real de pestaña en Node.js
    _simularCambio(nuevoEstado) {
        // Actualizamos la cadena visibilityState ("visible" o "hidden")
        this.visibilityState = nuevoEstado;
        // Actualizamos el booleano hidden acorde al nuevo estado
        this.hidden = nuevoEstado === "hidden";
        // Disparamos cada listener registrado exactamente como lo hace el navegador
        this._listeners.forEach((fn) => fn({ type: "visibilitychange" }));
    }
};

// Seleccionamos el objeto document real en el navegador o el simulador en Node.js
const docRef = esEntornoNavegador ? document : docSimulado;

/* ==========================================================================
   PRIMER CONTACTO ORIGINAL DEL USUARIO (PRESERVADO Y COMPATIBLE)
   ========================================================================== */
// Si estamos en el navegador registramos directamente con addEventListener global; en Node.js usamos docRef
if (esEntornoNavegador) {
    // Código base del usuario: escucha el cambio de visibilidad en la pestaña actual
    addEventListener("visibilitychange", () => {
        // Imprime un mensaje en consola cada vez que el usuario cambia de pestaña
        console.log("Se cambio de pestaña");
    });
} else {
    // En Node.js registramos el mismo mensaje dentro del simulador para demostrar su ejecución
    docRef.addEventListener("visibilitychange", () => {
        // Imprime en consola al simular el cambio de pestaña
        console.log("Se cambio de pestaña");
    });
}

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir encabezados ordenados en la consola
function imprimirTitulo(numero, titulo) {
    // Línea divisoria superior de 78 caracteres
    console.log("\n" + "=".repeat(78));
    // Título numerado del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: ¿QUÉ ES LA PAGE VISIBILITY API?
   ========================================================================== */
// Imprimimos la cabecera del primer bloque
imprimirTitulo(1, "¿QUÉ ES LA PAGE VISIBILITY API (visibilitychange vs focus/blur)?");

// Explicamos por qué visibilitychange reemplaza a los antiguos eventos focus y blur
console.log("⚠️ Enfoque Antiguo (window.onblur / window.onfocus):");
console.log("   - Falsos positivos: se disparaba al abrir DevTools o hacer clic en la barra de URL.");
console.log("   - En pantallas divididas (Split Screen) pausaba la app aunque siguiera visible.");
console.log("\n✅ Enfoque Moderno (document + visibilitychange):");
console.log("   - Informa con precisión si la pestaña está realmente visible o en segundo plano.");
console.log("   - Detecta cambio de pestaña, minimización del navegador o bloqueo del celular.");

/* ==========================================================================
   BLOQUE 2: EL EVENTO 'visibilitychange' Y PROPIEDADES DEL DOCUMENT
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "EVENTO 'visibilitychange', visibilityState Y document.hidden");

// Registramos un observador completo en el objeto document (o simulado en Node.js)
docRef.addEventListener("visibilitychange", () => {
    // Evaluamos la propiedad recomendada document.visibilityState
    if (docRef.visibilityState === "visible") {
        // El usuario regresó a la pestaña en primer plano
        console.log(`👁️ [VISIBLE] El usuario regresó. (hidden: ${docRef.hidden})`);
    } else {
        // El usuario ocultó o abandonó la pestaña ("hidden")
        console.log(`🙈 [HIDDEN] Pestaña en segundo plano. (hidden: ${docRef.hidden})`);
    }
});

// En Node.js simulamos un ciclo completo: ocultar pestaña y regresar a ella
if (!esEntornoNavegador) {
    // Mostramos el estado inicial antes de simular cambios
    console.log(`Estado inicial -> visibilityState: "${docRef.visibilityState}" | hidden: ${docRef.hidden}`);
    // Simulamos que el usuario cambia a otra pestaña
    docRef._simularCambio("hidden");
    // Simulamos que el usuario regresa a nuestra pestaña
    docRef._simularCambio("visible");
}

/* ==========================================================================
   BLOQUE 3: PRINCIPALES USOS EN EL DESARROLLO WEB MODERNO
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "PRINCIPALES USOS: MULTIMEDIA, POLLING, ANIMACIONES Y ANALÍTICA");

// Listamos los 5 escenarios reales de aplicación
console.log("1. 🎬 Multimedia: Pausar videos/podcasts al ocultar la pestaña y reanudar al volver.");
console.log("2. 🌐 Ahorro de Red: Detener setInterval() de consultas a APIs cuando nadie mira.");
console.log("3. 🎮 Videojuegos/Canvas: Pausar el bucle de renderizado para ahorrar CPU y batería.");
console.log("4. 📊 Analítica Real: Medir el tiempo efectivo de lectura excluyendo pestañas inactivas.");
console.log("5. 🔒 Seguridad: Difuminar datos bancarios o iniciar cierre de sesión en segundo plano.");

/* ==========================================================================
   BLOQUE 4: ANALOGÍAS DEL MUNDO REAL
   ========================================================================== */
// Imprimimos la cabecera del cuarto bloque
imprimirTitulo(4, "ANALOGÍAS DEL MUNDO REAL: REFRIGERADOR Y MARCADOR DE LIBRO");

// Describimos las dos analogías de la guía
console.log("💡 1. La Luz del Refrigerador:");
console.log("   - Puerta abierta ('visible') -> la luz se enciende y todo opera a plena vista.");
console.log("   - Puerta cerrada ('hidden')  -> el interruptor apaga la luz para ahorrar energía.");
console.log("\n📖 2. El Marcador de un Libro:");
console.log("   - Al interrumpir la lectura colocas un separador ('hidden') y pausas.");
console.log("   - Al volver a abrirlo ('visible') retomas exactamente desde donde lo dejaste.");

/* ==========================================================================
   BLOQUE 5: BUENAS PRÁCTICAS Y ERRORES COMUNES
   ========================================================================== */
// Imprimimos la cabecera del quinto bloque
imprimirTitulo(5, "BUENAS PRÁCTICAS Y ERRORES HABITUALES");

// Resumimos las reglas clave de calidad
console.log("✅ Registrar siempre en 'document.addEventListener(\"visibilitychange\", ...)'.");
console.log("✅ Guardar una bandera de estado si pausaste un video automáticamente, para no");
console.log("   reanudarlo si el usuario lo había pausado manualmente antes de irse.");
console.log("❌ Error común: Confundir 'visibilitychange' con 'window.onblur'.");
console.log("❌ Error común: Intentar reproducir audio al volver si el usuario nunca interactuó.");

/* ==========================================================================
   BLOQUE 6: PROYECTO INTEGRADOR: REPRODUCTOR DE VIDEO INTELIGENTE
   ========================================================================== */
// Imprimimos la cabecera del sexto bloque
imprimirTitulo(6, "PROYECTO INTEGRADOR: REPRODUCTOR DE VIDEO INTELIGENTE");

// Simulamos un reproductor de video con su estado de reproducción
const reproductorSimulado = {
    // Indica si el video está pausado actualmente
    paused: false,
    // Método para reproducir el video
    play() {
        // Cambiamos el estado a reproduciendo
        this.paused = false;
        // Notificamos en consola
        console.log("   ▶️ video.play() -> Reproducción reanudada.");
    },
    // Método para pausar el video
    pause() {
        // Cambiamos el estado a pausado
        this.paused = true;
        // Notificamos en consola
        console.log("   ⏸️ video.pause() -> Reproducción pausada.");
    }
};

// Bandera de control para recordar si la pausa fue automática por cambio de pestaña
let pausadoAutomaticamente = false;

// Función controladora del reproductor inteligente
const controlarVideoPorVisibilidad = () => {
    // Si la pestaña pasó a segundo plano
    if (docRef.visibilityState === "hidden") {
        // Verificamos que el video estuviera reproduciéndose activamente
        if (!reproductorSimulado.paused) {
            // Pausamos el video
            reproductorSimulado.pause();
            // Marcamos que la pausa fue realizada automáticamente por el sistema
            pausadoAutomaticamente = true;
            // Actualizamos el título de la pestaña
            docRef.title = "⏸️ Video en pausa - Vuelve pronto";
        }
    } else if (docRef.visibilityState === "visible") {
        // Solo reanudamos si fuimos nosotros quienes lo pausamos al ocultarse la pestaña
        if (pausadoAutomaticamente) {
            // Reanudamos el video
            reproductorSimulado.play();
            // Reiniciamos la bandera
            pausadoAutomaticamente = false;
            // Restauramos el título de la pestaña
            docRef.title = "▶️ Reproduciendo tutorial";
        }
    }
};

// Suscribimos el controlador al evento visibilitychange
docRef.addEventListener("visibilitychange", controlarVideoPorVisibilidad);

// En Node.js demostramos el flujo completo del reproductor inteligente
if (!esEntornoNavegador) {
    // 1. El usuario está viendo el video y cambia de pestaña
    console.log("Escenario A: Video reproduciéndose -> usuario cambia de pestaña:");
    docRef._simularCambio("hidden");
    // 2. El usuario regresa a la pestaña -> el video se reanuda automáticamente
    console.log("Escenario B: Usuario regresa a la pestaña:");
    docRef._simularCambio("visible");
}

/* ==========================================================================
   BLOQUE 7: RESUMEN TÉCNICO DEL MÓDULO
   ========================================================================== */
// Imprimimos la cabecera del bloque final
imprimirTitulo(7, "RESUMEN TÉCNICO DE PAGE VISIBILITY API");

// Síntesis final
console.log("1. 🎯 Evento: document.addEventListener('visibilitychange', callback).");
console.log("2. 🔍 Estado en texto: document.visibilityState ('visible' | 'hidden').");
console.log("3. ⚡ Estado booleano: document.hidden (true | false).");
console.log("4. 🛡️ Ventaja clave: Cero falsos positivos frente a window.blur/focus.");
console.log("=".repeat(78));
console.log("🎓 ¡Módulo de Page Visibility API (visibilitychange) completado al 100%!");
console.log("=".repeat(78));
