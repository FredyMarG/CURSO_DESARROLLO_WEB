/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: CACHE API (caches)
 * ARCHIVO: main.js
 * Guía práctica simplificada paso a paso (Navegador + Node.js)
 * ============================================================================
 */

// Activamos el modo estricto para escribir JavaScript seguro y sin errores silenciosos
"use strict";

// ----------------------------------------------------------------------------
// 1. PRIMER PASO: ABRIR O CREAR UN ALMACÉN DE CACHÉ
// ----------------------------------------------------------------------------
// En el navegador usamos window.caches; si ejecutamos con Node.js usamos el simulador de abajo
const cachesRef = (typeof window !== "undefined" && "caches" in window)
    ? window.caches
    : crearSimuladorCache();

// Código inicial preservado: abre o crea el almacén llamado "archivos.estaticos"
cachesRef.open("archivos.estaticos");

// ----------------------------------------------------------------------------
// 2. LECCIÓN PASO A PASO (FÁCIL DE LEER Y SEGUIR)
// ----------------------------------------------------------------------------
async function aprenderCachePasoAPaso() {
    console.log("🚀 INICIANDO GUÍA PRÁCTICA DE CACHE API\n");

    // PASO 1: Abrir nuestra "despensa" de archivos
    const cache = await cachesRef.open("archivos.estaticos");
    console.log("1️⃣ [open] Almacén 'archivos.estaticos' abierto y listo.");

    // En Node.js demostramos el ciclo completo de guardar, buscar y borrar sin depender de internet
    if (typeof window === "undefined") {
        // PASO 2: Guardar archivos (add, addAll, put)
        await cache.add("/estilos.css");
        await cache.addAll(["/index.html", "/app.js"]);
        await cache.put("/api/saludo", { status: 200, text: async () => "¡Hola desde Caché!" });
        console.log("2️⃣ [add / addAll / put] Archivos guardados en el almacén.");

        // PASO 3: Consultar lo que guardamos (keys, match, matchAll)
        const llaves = await cache.keys();
        console.log("3️⃣ [keys] Archivos en caché:", llaves.map((req) => req.url));

        const encontrado = await cachesRef.match("/api/saludo");
        if (encontrado) {
            console.log("4️⃣ [match] ¡Encontrado al instante! ->", await encontrado.text());
        }

        const todas = await cache.matchAll();
        console.log("5️⃣ [matchAll] Total de respuestas almacenadas:", todas.length);

        // PASO 4: Limpiar un archivo puntual o borrar una versión vieja
        await cache.delete("/estilos.css");
        console.log("6️⃣ [delete] '/estilos.css' eliminado correctamente.");
    } else {
        console.log("💡 Estás en el navegador: abre la Diapositiva 9 para probar todo con botones.");
    }

    console.log("\n🎓 Resumen: open() -> add()/put() -> match()/keys() -> delete()");
}

// Ejecutamos la lección
aprenderCachePasoAPaso();

/* ============================================================================
   SIMULADOR PARA NODE.JS (Permite ejecutar 'node main.js' sin navegador)
   ============================================================================ */
function crearSimuladorCache() {
    const almacenes = new Map();
    class CacheSimulada {
        constructor(nombre) {
            this.nombre = nombre;
            this.entradas = new Map();
        }
        async add(url) {
            this.entradas.set(url, { url, status: 200, text: async () => `Archivo ${url}` });
        }
        async addAll(urls) {
            for (const u of urls) await this.add(u);
        }
        async put(req, res) {
            this.entradas.set(typeof req === "string" ? req : req.url, res);
        }
        async match(req) {
            return this.entradas.get(typeof req === "string" ? req : req.url);
        }
        async matchAll() {
            return Array.from(this.entradas.values());
        }
        async keys() {
            return Array.from(this.entradas.keys()).map((u) => ({ url: u }));
        }
        async delete(req) {
            return this.entradas.delete(typeof req === "string" ? req : req.url);
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
        async keys() { return Array.from(almacenes.keys()); },
        async delete(nombre) { return almacenes.delete(nombre); }
    };
}
