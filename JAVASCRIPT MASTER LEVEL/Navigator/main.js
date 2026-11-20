/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: EL OBJETO NAVIGATOR (BOM)
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict";

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
// Detectamos si nos encontramos en un navegador web real con soporte para window.navigator
const esEntornoNavegador = typeof window !== "undefined" && typeof window.navigator !== "undefined";

// Creamos un simulador completo de window.navigator para ejecutar toda la guía en Node.js sin errores
const navigatorSimulado = {
    // Interfaz NavigatorID: cadena identificadora del navegador y sistema
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) NodeJSSimulator/1.0",
    // Plataforma del sistema operativo
    platform: "Win32",
    // Propiedades históricas heredadas (legacy)
    appName: "Netscape",
    appVersion: "5.0",
    product: "Gecko",
    // Interfaz NavigatorLanguage: idioma principal y lista ordenada por prioridad
    language: "es-CO",
    languages: ["es-CO", "es", "en-US", "en"],
    // Interfaz NavigatorOnLine: estado booleano de conexión a red
    onLine: true,
    // Interfaz NavigatorCookies: indica si las cookies están habilitadas
    cookieEnabled: true,
    // Interfaz NavigatorConcurrentHardware: hilos lógicos disponibles en CPU
    hardwareConcurrency: 8,
    // Interfaz NavigatorPlugins: soporte nativo de visor PDF
    pdfViewerEnabled: true,
    // Interfaz NavigatorStorageUtils: estimación y persistencia de almacenamiento
    storage: {
        // Retorna una promesa simulada con uso y cuota total en bytes
        async estimate() {
            return { usage: 2_450_000, quota: 2_147_483_648 };
        },
        // Solicita persistencia de datos simulada
        async persist() {
            return true;
        }
    },
    // Interfaz NavigatorContentUtils: registro simulado de protocolo personalizado
    registerProtocolHandler(scheme, url) {
        console.log(`   🔗 [Protocolo Registrado] ${scheme} -> ${url}`);
    },
    // Interfaz NavigatorUserMedia: acceso simulado a cámara y micrófono
    mediaDevices: {
        async getUserMedia(constraints) {
            return { id: "stream-simulado-01", constraints, active: true };
        }
    }
};

// Seleccionamos el objeto navigator nativo en el navegador o el simulado en Node.js
const navRef = esEntornoNavegador ? window.navigator : navigatorSimulado;

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir encabezados bien formateados en consola
function imprimirTitulo(numero, titulo) {
    // Línea divisoria superior
    console.log("\n" + "=".repeat(78));
    // Título numerado del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: INTRODUCCIÓN Y NavigatorID
   ========================================================================== */
// Imprimimos la cabecera del primer bloque
imprimirTitulo(1, "INTRODUCCIÓN AL OBJETO NAVIGATOR Y NavigatorID");

// Mostramos las propiedades de identificación del navegador
console.log("🪪 Identificación del Agente de Usuario (NavigatorID):");
console.log(`   • navigator.userAgent : ${navRef.userAgent}`);
console.log(`   • navigator.platform  : ${navRef.platform}`);
console.log(`   • navigator.appName   : ${navRef.appName} (legacy)`);
console.log("   ℹ️ Nota moderna: Por privacidad se recomienda usar navigator.userAgentData o Feature Detection.");

/* ==========================================================================
   BLOQUE 2: NavigatorLanguage (IDIOMAS Y LOCALIZACIÓN i18n)
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "NavigatorLanguage: IDIOMA PRINCIPAL Y PREFERENCIAS REGIONALES");

// Leemos el idioma principal y la lista de idiomas configurados
console.log(`🌐 Idioma principal (navigator.language) : ${navRef.language}`);
console.log(`🗣️ Lista de idiomas (navigator.languages): ${JSON.stringify(navRef.languages)}`);

/* ==========================================================================
   BLOQUE 3: NavigatorOnLine (CONECTIVIDAD Y EVENTOS online / offline)
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "NavigatorOnLine: ESTADO DE CONEXIÓN Y EVENTOS DE RED");

// Evaluamos el estado inicial de conectividad
console.log(`📡 ¿Está conectado actualmente? (navigator.onLine): ${navRef.onLine}`);

// En el navegador registramos escuchadores reales en window para cambios de red
if (esEntornoNavegador) {
    // Evento cuando regresa la conexión a la red
    window.addEventListener("online", () => console.log("🟢 Conexión restablecida. Sincronizando..."));
    // Evento cuando se pierde la conexión
    window.addEventListener("offline", () => console.log("🔴 Sin conexión. Activando modo offline."));
} else {
    // En Node.js explicamos el comportamiento
    console.log("   • window.addEventListener('online' / 'offline') detecta caídas y recuperaciones en vivo.");
}

/* ==========================================================================
   BLOQUE 4: NavigatorContentUtils Y NavigatorCookies
   ========================================================================== */
// Imprimimos la cabecera del cuarto bloque
imprimirTitulo(4, "NavigatorContentUtils (PROTOCOLOS) Y NavigatorCookies");

// Verificamos si las cookies están habilitadas
console.log(`🍪 Cookies habilitadas (navigator.cookieEnabled): ${navRef.cookieEnabled}`);

// Verificamos soporte para registrar manejadores de protocolos personalizados
if ("registerProtocolHandler" in navRef) {
    // En Node.js ejecutamos el simulador; en navegador solo mostramos la sintaxis para no pedir diálogo al cargar
    if (!esEntornoNavegador) {
        navRef.registerProtocolHandler("web+factura", "https://miapp.com/procesar?url=%s");
    } else {
        console.log("🔗 registerProtocolHandler disponible en este navegador (requiere HTTPS y acción de usuario).");
    }
}

/* ==========================================================================
   BLOQUE 5: NavigatorConcurrentHardware Y NavigatorPlugins
   ========================================================================== */
// Imprimimos la cabecera del quinto bloque
imprimirTitulo(5, "NavigatorConcurrentHardware (CPU) Y NavigatorPlugins (PDF/MIME)");

// Leemos la cantidad de hilos lógicos disponibles aplicando un respaldo seguro
const nucleos = navRef.hardwareConcurrency || 4;
// Calculamos cuántos Web Workers conviene crear según la potencia del equipo
const workersOptimos = Math.max(1, nucleos - 1);

console.log(`⚡ Hilos lógicos de CPU (hardwareConcurrency): ${nucleos}`);
console.log(`   ↳ Pool óptimo sugerido de Web Workers: ${workersOptimos}`);
console.log(`📄 Visor PDF nativo (pdfViewerEnabled): ${Boolean(navRef.pdfViewerEnabled)}`);

/* ==========================================================================
   BLOQUE 6: NavigatorStorageUtils Y NavigatorUserMedia (ASYNC)
   ========================================================================== */
// Imprimimos la cabecera del sexto bloque
imprimirTitulo(6, "NavigatorStorageUtils (ALMACENAMIENTO) Y NavigatorUserMedia (MEDIA)");

// Función asíncrona principal para consultar cuota de disco y demostrar mediaDevices
async function ejecutarDiagnosticoAsincrono() {
    // 1. Storage API: estimación de uso y cuota asignada al origen
    if (navRef.storage && navRef.storage.estimate) {
        const { usage, quota } = await navRef.storage.estimate();
        const usadoMB = (usage / (1024 * 1024)).toFixed(2);
        const totalMB = (quota / (1024 * 1024)).toFixed(2);
        console.log(`💾 Espacio usado: ${usadoMB} MB de ${totalMB} MB disponibles.`);
    }

    // 2. NavigatorUserMedia (mediaDevices): verificamos disponibilidad sin encender cámara al cargar
    const soportaMedia = "mediaDevices" in navRef && "getUserMedia" in navRef.mediaDevices;
    console.log(`📷 ¿Soporta navigator.mediaDevices.getUserMedia()? ${soportaMedia}`);

    /* ==========================================================================
       BLOQUE 7: ANALOGÍAS DEL MUNDO REAL
       ========================================================================== */
    imprimirTitulo(7, "ANALOGÍAS DEL MUNDO REAL: PASAPORTE Y TABLERO DE VEHÍCULO");
    console.log("🛂 1. El Pasaporte del Pasajero (Navigator): indica idioma, tránsito y permisos.");
    console.log("🚗 2. El Tablero de Instrumentos: muestra potencia del motor (CPU) y señal (onLine).");

    /* ==========================================================================
       BLOQUE 8: BUENAS PRÁCTICAS, ERRORES COMUNES Y RESUMEN
       ========================================================================== */
    imprimirTitulo(8, "BUENAS PRÁCTICAS Y RESUMEN TÉCNICO");
    console.log("✅ Usa Feature Detection ('mediaDevices' in navigator) en lugar de User-Agent Sniffing.");
    console.log("✅ Detén las pistas (track.stop()) al cerrar cámara/micrófono para apagar el LED físico.");
    console.log("✅ Usa valores de respaldo (navigator.hardwareConcurrency || 2).");
    console.log("❌ No confíes ciegamente en navigator.onLine sin try/catch en fetch().");
    console.log("=".repeat(78));
    console.log("🎓 ¡Módulo del Objeto Navigator (BOM) completado con éxito al 100%!");
    console.log("=".repeat(78));
}

// Ejecutamos el diagnóstico asíncrono
ejecutarDiagnosticoAsincrono();
