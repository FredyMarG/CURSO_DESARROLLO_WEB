/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: CACHE API (caches)
 * ARCHIVO: main.js
 * Guía práctica simplificada paso a paso (Navegador + Node.js)
 * ============================================================================
 */

// Activamos el modo estricto para escribir JavaScript seguro y sin errores silenciosos
"use strict"; // Activa el modo estricto de JavaScript

// ----------------------------------------------------------------------------
// 1. PRIMER PASO: ABRIR O CREAR UN ALMACÉN DE CACHÉ
// ----------------------------------------------------------------------------
// En el navegador usamos window.caches; si ejecutamos con Node.js usamos el simulador de abajo
const cachesRef = (typeof window !== "undefined" && "caches" in window)
    ? window.caches
    : crearSimuladorCache(); // Ejecuta llamada o método

// Código inicial preservado: abre o crea el almacén llamado "archivos.estaticos"
cachesRef.open("archivos.estaticos"); // Ejecuta llamada o método

// ----------------------------------------------------------------------------
// 2. LECCIÓN PASO A PASO (FÁCIL DE LEER Y SEGUIR)
// ----------------------------------------------------------------------------
async function aprenderCachePasoAPaso() { // Declara función
    console.log("🚀 INICIANDO GUÍA PRÁCTICA DE CACHE API\n"); // Imprime salida en consola

    // PASO 1: Abrir nuestra "despensa" de archivos
    const cache = await cachesRef.open("archivos.estaticos"); // Declara e inicializa "cache"
    console.log("1️⃣ [open] Almacén 'archivos.estaticos' abierto y listo."); // Imprime salida en consola

    // En Node.js demostramos el ciclo completo de guardar, buscar y borrar sin depender de internet
    if (typeof window === "undefined") { // Evalúa condición
        // PASO 2: Guardar archivos (add, addAll, put)
        await cache.add("/estilos.css"); // Ejecuta llamada o método
        await cache.addAll(["/index.html", "/app.js"]); // Ejecuta llamada o método
        await cache.put("/api/saludo", { status: 200, text: async () => "¡Hola desde Caché!" }); // Ejecuta llamada o método
        console.log("2️⃣ [add / addAll / put] Archivos guardados en el almacén."); // Imprime salida en consola

        // PASO 3: Consultar lo que guardamos (keys, match, matchAll)
        const llaves = await cache.keys(); // Declara e inicializa "llaves"
        console.log("3️⃣ [keys] Archivos en caché:", llaves.map((req) => req.url)); // Imprime salida en consola

        const encontrado = await cachesRef.match("/api/saludo"); // Declara e inicializa "encontrado"
        if (encontrado) { // Evalúa condición
            console.log("4️⃣ [match] ¡Encontrado al instante! ->", await encontrado.text()); // Imprime salida en consola
        }

        const todas = await cache.matchAll(); // Declara e inicializa "todas"
        console.log("5️⃣ [matchAll] Total de respuestas almacenadas:", todas.length); // Imprime salida en consola

        // PASO 4: Limpiar un archivo puntual o borrar una versión vieja
        await cache.delete("/estilos.css"); // Ejecuta llamada o método
        console.log("6️⃣ [delete] '/estilos.css' eliminado correctamente."); // Imprime salida en consola
    } else { // Instrucción JavaScript
        console.log("💡 Estás en el navegador: abre la Diapositiva 9 para probar todo con botones."); // Imprime salida en consola
    }

    console.log("\n🎓 Resumen: open() -> add()/put() -> match()/keys() -> delete()"); // Imprime salida en consola
}

// Ejecutamos la lección
aprenderCachePasoAPaso(); // Ejecuta llamada o método

/* ============================================================================
   SIMULADOR PARA NODE.JS (Permite ejecutar 'node main.js' sin navegador)
   ============================================================================ */
function crearSimuladorCache() { // Declara función
    const almacenes = new Map(); // Declara e inicializa "almacenes"
    class CacheSimulada { // Define clase
        constructor(nombre) { // Instrucción JavaScript
            this.nombre = nombre; // Asigna valor
            this.entradas = new Map(); // Asigna valor
        }
        async add(url) { // Instrucción JavaScript
            this.entradas.set(url, { url, status: 200, text: async () => `Archivo ${url}` }); // Ejecuta llamada o método
        }
        async addAll(urls) { // Instrucción JavaScript
            for (const u of urls) await this.add(u); // Inicia bucle de iteración
        }
        async put(req, res) { // Instrucción JavaScript
            this.entradas.set(typeof req === "string" ? req : req.url, res); // Ejecuta llamada o método
        }
        async match(req) { // Instrucción JavaScript
            return this.entradas.get(typeof req === "string" ? req : req.url); // Retorna resultado
        }
        async matchAll() { // Instrucción JavaScript
            return Array.from(this.entradas.values()); // Retorna resultado
        }
        async keys() { // Instrucción JavaScript
            return Array.from(this.entradas.keys()).map((u) => ({ url: u })); // Retorna resultado
        }
        async delete(req) { // Instrucción JavaScript
            return this.entradas.delete(typeof req === "string" ? req : req.url); // Retorna resultado
        }
    }
    return { // Retorna resultado
        async open(nombre) { // Instrucción JavaScript
            if (!almacenes.has(nombre)) almacenes.set(nombre, new CacheSimulada(nombre)); // Evalúa condición
            return almacenes.get(nombre); // Retorna resultado
        },
        async match(req) { // Instrucción JavaScript
            for (const c of almacenes.values()) { // Inicia bucle de iteración
                const hit = await c.match(req); // Declara e inicializa "hit"
                if (hit) return hit; // Evalúa condición
            }
            return undefined; // Retorna resultado
        },
        async keys() { return Array.from(almacenes.keys()); },
        async delete(nombre) { return almacenes.delete(nombre); }
    };
}
