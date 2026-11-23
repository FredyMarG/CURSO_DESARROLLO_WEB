/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: SERVICE WORKERS
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict"; // Activa el modo estricto de JavaScript

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
// Detectamos si nos encontramos en un navegador web real con soporte para navigator.serviceWorker
const esEntornoNavegador = typeof window !== "undefined" && "serviceWorker" in navigator;

// Creamos un simulador del ciclo de vida de ServiceWorker para ejecutar la guía en Node.js sin errores
const serviceWorkerSimulado = {
    state: "parsed",
    scope: "/",
    controller: {
        postMessage(msg) {
            console.log("   📤 [Página -> SW] postMessage:", msg); // Imprime salida en consola
        }
    },
    async register(url, options = {}) {
        this.scope = options.scope || "/";
        this.state = "installing";
        console.log(`   📦 [register('${url}')] Estado: "${this.state}" -> ejecutando event.waitUntil(cache.addAll(...))`); // Imprime salida en consola
        this.state = "activated";
        console.log(`   ✅ [activate] Estado: "${this.state}" | Alcance (scope): "${this.scope}"`); // Imprime salida en consola
        return { scope: this.scope, active: { state: this.state } };
    }
};

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
function imprimirTitulo(numero, titulo) {
    console.log("\n" + "=".repeat(78)); // Imprime salida en consola
    console.log(`📌 BLOQUE ${numero}: ${titulo}`); // Imprime salida en consola
    console.log("=".repeat(78)); // Imprime salida en consola
}

/* ==========================================================================
   FLUJO PEDAGÓGICO COMPLETO DE SERVICE WORKERS
   ========================================================================== */
async function ejecutarGuiaServiceWorkers() {
    // --- BLOQUE 1: DEFINICIÓN Y CARACTERÍSTICAS ---
    imprimirTitulo(1, "¿QUÉ ES UN SERVICE WORKER Y LA INTERFAZ ServiceWorker?");
    console.log("🛡️ Proxy programable de red entre la página, el navegador e internet:"); // Imprime salida en consola
    console.log("   • Corre en un hilo secundario sin acceso al DOM ni a localStorage."); // Imprime salida en consola
    console.log("   • Orientado a eventos: install, activate, fetch, message, push, sync."); // Imprime salida en consola
    console.log("   • Requiere HTTPS o localhost y persiste aunque cierres la pestaña."); // Imprime salida en consola

    // --- BLOQUE 2: CICLO DE VIDA Y REGISTRO ---
    imprimirTitulo(2, "CICLO DE VIDA Y REGISTRO: navigator.serviceWorker.register()");
    if (!esEntornoNavegador) {
        await serviceWorkerSimulado.register("./sw.js", { scope: "./" });
        serviceWorkerSimulado.controller.postMessage({ tipo: "OBTENER_VERSION" });
    } else {
        console.log("ℹ️ En el navegador, abre el Laboratorio de la Diapositiva 9 para probar el ciclo de vida."); // Imprime salida en consola
    }

    // --- BLOQUE 3: INTERCEPTACIÓN FETCH Y ESTRATEGIA OFFLINE ---
    imprimirTitulo(3, "INTERCEPTACIÓN DE RED (fetch) Y SOPORTE OFFLINE");
    console.log("1. install  -> Abre caché versionada y precarga archivos (event.waitUntil)."); // Imprime salida en consola
    console.log("2. activate -> Elimina cachés antiguas (caches.delete) y llama clients.claim()."); // Imprime salida en consola
    console.log("3. fetch    -> Intercepta peticiones GET con event.respondWith(caches.match || fetch)."); // Imprime salida en consola

    // --- BLOQUE 4: ANALOGÍAS, BUENAS PRÁCTICAS Y RESUMEN ---
    imprimirTitulo(4, "ANALOGÍAS, BUENAS PRÁCTICAS Y RESUMEN TÉCNICO");
    console.log("🛎️ Recepcionista de Hotel: Revisa primero su armario (Caché) antes de llamar afuera."); // Imprime salida en consola
    console.log("🔄 Relevo de Guardia: Espera su turno (installed -> activated) o usa skipWaiting()."); // Imprime salida en consola
    console.log("✅ Versiona siempre el caché ('v1', 'v2') y NO guardes el propio archivo sw.js en caché."); // Imprime salida en consola
    console.log("❌ Nunca uses document, window ni localStorage dentro de sw.js."); // Imprime salida en consola
    console.log("=".repeat(78)); // Imprime salida en consola
    console.log("🎓 ¡Módulo de Service Workers completado con éxito al 100%!"); // Imprime salida en consola
    console.log("=".repeat(78)); // Imprime salida en consola
}

// Ejecutamos la guía práctica
ejecutarGuiaServiceWorkers();
