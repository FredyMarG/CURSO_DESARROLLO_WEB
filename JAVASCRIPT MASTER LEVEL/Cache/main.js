/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: CACHE API (caches)
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
// Detectamos si nos encontramos en un navegador web con soporte nativo para window.caches
const esEntornoNavegador = typeof window !== "undefined" && "caches" in window;

// Creamos un simulador en memoria de CacheStorage y Cache para ejecutar la guía en Node.js sin errores
const cacheStorageSimulado = (() => {
    // Mapa interno que almacena cada almacén de caché por su nombre
    const almacenes = new Map();

    // Clase que emula una instancia individual de Cache
    class CacheSimulada {
        constructor(nombre) {
            this.nombre = nombre;
            this.entradas = new Map();
        }
        async add(url) {
            const res = { url, status: 200, text: async () => `Contenido simulado de ${url}`, clone() { return { ...this }; } };
            this.entradas.set(url, res);
        }
        async addAll(urls) {
            for (const u of urls) await this.add(u);
        }
        async put(req, res) {
            const clave = typeof req === "string" ? req : req.url;
            this.entradas.set(clave, res);
        }
        async match(req) {
            const clave = typeof req === "string" ? req : req.url;
            return this.entradas.get(clave);
        }
        async keys() {
            return Array.from(this.entradas.keys()).map((u) => ({ url: `https://localhost${u}` }));
        }
        async delete(req) {
            const clave = typeof req === "string" ? req : req.url;
            return this.entradas.delete(clave);
        }
    }

    return {
        async open(nombre) {
            if (!almacenes.has(nombre)) almacenes.set(nombre, new CacheSimulada(nombre));
            return almacenes.get(nombre);
        },
        async match(req) {
            for (const c of almacenes.values()) {
                const hit = await c.match(req);
                if (hit) return hit;
            }
            return undefined;
        },
        async keys() {
            return Array.from(almacenes.keys());
        },
        async delete(nombre) {
            return almacenes.delete(nombre);
        }
    };
})();

// Seleccionamos window.caches en el navegador o nuestro simulador en Node.js
const cachesRef = esEntornoNavegador ? window.caches : cacheStorageSimulado;

// Código inicial del usuario preservado: abre o crea el almacén "archivos.estaticos"
cachesRef.open("archivos.estaticos");

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
function imprimirTitulo(numero, titulo) {
    console.log("\n" + "=".repeat(78));
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    console.log("=".repeat(78));
}

/* ==========================================================================
   FLUJO PEDAGÓGICO COMPLETO DE CACHE API (ASÍNCRONO)
   ========================================================================== */
async function ejecutarGuiaCache() {
    // --- BLOQUE 1: DEFINICIÓN Y VENTAJAS ---
    imprimirTitulo(1, "¿QUÉ ES LA CACHE API (caches) Y EN QUÉ SUPERA A localStorage?");
    console.log("📦 Cache API (CacheStorage):");
    console.log("   • Almacena pares completos Request / Response de forma 100% asíncrona.");
    console.log("   • Soporta HTML, CSS, JS, imágenes, fuentes y JSON (cientos de MB).");
    console.log("   • Funciona en el hilo principal y en Service Workers (requiere HTTPS/localhost).");

    // --- BLOQUE 2: APERTURA Y ALMACENAMIENTO (open, add, addAll, put) ---
    imprimirTitulo(2, "APERTURA Y ALMACENAMIENTO: open(), add(), addAll() y put()");
    const cache = await cachesRef.open("archivos.estaticos");
    console.log("✅ Almacén 'archivos.estaticos' abierto correctamente.");

    if (!esEntornoNavegador) {
        await cache.add("/styles.css");
        await cache.addAll(["/index.html", "/app.js"]);
        await cache.put("/api/config", { status: 200, json: async () => ({ tema: "oscuro" }) });
        console.log("   ↳ Recursos precargados con add(), addAll() y put().");
    }

    // --- BLOQUE 3: CONSULTA (match, keys) ---
    imprimirTitulo(3, "CONSULTA DE RECURSOS: match() Y keys()");
    if (!esEntornoNavegador) {
        const keys = await cache.keys();
        console.log("📋 Llaves guardadas en 'archivos.estaticos':", keys.map((k) => k.url));
        const resp = await cachesRef.match("/api/config");
        if (resp) console.log("⚡ Cache Hit en '/api/config':", await resp.json());
    } else {
        console.log("ℹ️ Usa el Laboratorio de la Diapositiva 9 para probar put(), match() y keys() en vivo.");
    }

    // --- BLOQUE 4: ELIMINACIÓN (cache.delete y caches.delete) ---
    imprimirTitulo(4, "ELIMINACIÓN Y VERSIONADO: cache.delete() Y caches.delete()");
    if (!esEntornoNavegador) {
        const borrado = await cache.delete("/styles.css");
        console.log(`🗑️ ¿Se eliminó '/styles.css'?: ${borrado}`);
        await cachesRef.open("archivos-v1");
        const cachesAntes = await cachesRef.keys();
        console.log("📦 Almacenes antes de limpiar versiones:", cachesAntes);
        await cachesRef.delete("archivos-v1");
        console.log("🧹 Almacén antiguo 'archivos-v1' eliminado con caches.delete().");
    }

    // --- BLOQUE 5: ESTRATEGIAS Y BUENAS PRÁCTICAS ---
    imprimirTitulo(5, "ESTRATEGIAS OFFLINE, ANALOGÍAS Y BUENAS PRÁCTICAS");
    console.log("1. ⚡ Cache-First: Ideal para CSS, fuentes, iconos y App Shell.");
    console.log("2. 🌐 Network-First: Ideal para noticias o datos que cambian seguido.");
    console.log("3. 🔄 Stale-While-Revalidate: Sirve caché al instante y actualiza en segundo plano.");
    console.log("4. 🛡️ Clona siempre con response.clone() antes de usar cache.put().");
    console.log("5. ❌ La Cache API solo almacena peticiones GET (POST lanza TypeError).");

    // --- BLOQUE 6: RESUMEN TÉCNICO ---
    imprimirTitulo(6, "RESUMEN TÉCNICO DE CACHE API");
    console.log("• caches.open(nombre) -> Abre o crea el almacén.");
    console.log("• cache.add() / addAll() / put() -> Guarda pares Request/Response.");
    console.log("• caches.match() -> Recupera respuestas locales sin usar la red.");
    console.log("• cache.delete() / caches.delete() -> Limpia archivos o versiones viejas.");
    console.log("=".repeat(78));
    console.log("🎓 ¡Módulo de Cache API completado con éxito al 100%!");
    console.log("=".repeat(78));
}

// Ejecutamos la guía práctica
ejecutarGuiaCache();
