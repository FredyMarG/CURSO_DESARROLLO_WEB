/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: SERVICE WORKERS
 * ARCHIVO: sw.js (Service Worker Real en Segundo Plano)
 * Gestiona ciclo de vida (install, activate), caché offline y mensajería
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Definimos el nombre versionado de nuestra caché estática
const NOMBRE_CACHE = "sw-master-level-v1";

// Listamos los recursos mínimos del App Shell a precargar en la instalación
const RECURSOS_BASE = ["./", "./index.html", "./style.css", "./app.js"];

// 1. EVENTO INSTALL: Se dispara al registrar por primera vez o actualizar sw.js
self.addEventListener("install", (event) => {
    // Mantenemos el estado 'installing' hasta que todos los archivos se guarden en caché
    event.waitUntil(
        caches.open(NOMBRE_CACHE).then((cache) => cache.addAll(RECURSOS_BASE))
    );
    // Forzamos la activación inmediata sin esperar a cerrar pestañas abiertas
    self.skipWaiting();
});

// 2. EVENTO ACTIVATE: Se dispara cuando el Service Worker toma el control
self.addEventListener("activate", (event) => {
    // Limpiamos cualquier caché antigua que no coincida con NOMBRE_CACHE
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(
                nombres.map((nombre) => (nombre !== NOMBRE_CACHE ? caches.delete(nombre) : null))
            )
        )
    );
    // Reclamamos el control inmediato de los clientes activos
    self.clients.claim();
});

// 3. EVENTO FETCH: Intercepta peticiones GET para aplicar estrategia Cache-First
self.addEventListener("fetch", (event) => {
    // Ignoramos peticiones que no sean GET
    if (event.request.method !== "GET") return;

    // Respondemos desde caché si existe; de lo contrario consultamos la red
    event.respondWith(
        caches.match(event.request).then((respuestaCache) => respuestaCache || fetch(event.request))
    );
});

// 4. EVENTO MESSAGE: Escucha mensajes enviados desde la página con postMessage()
self.addEventListener("message", (event) => {
    // Si la página solicita la versión activa del Service Worker
    if (event.data && event.data.tipo === "OBTENER_VERSION") {
        // Respondemos directamente al cliente emisor usando event.source
        event.source.postMessage({
            version: NOMBRE_CACHE,
            estado: "Service Worker activo y controlando la página"
        });
    }
});
