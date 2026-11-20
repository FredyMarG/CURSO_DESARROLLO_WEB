/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: MEMOIZATION (MEMOIZACIÓN)
 * ARCHIVO: main.js
 * Guía teórica, benchmarks reales de rendimiento, patrones y solucionario
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

// Activamos el modo estricto de ECMAScript para evitar errores silenciosos y variables globales accidentales
"use strict";

/* ==========================================================================
   UTILIDAD DE IMPRESIÓN PEDAGÓGICA EN CONSOLA
   ========================================================================== */
// Función auxiliar para imprimir encabezados claros en la consola
function imprimirTitulo(numero, titulo) {
    // Línea divisoria superior
    console.log("\n" + "=".repeat(78));
    // Título numerado del bloque
    console.log(`📌 BLOQUE ${numero}: ${titulo}`);
    // Línea divisoria inferior
    console.log("=".repeat(78));
}

/* ==========================================================================
   BLOQUE 1: ¿QUÉ ES LA MEMOIZACIÓN Y CUÁNDO USARLA?
   ========================================================================== */
// Imprimimos la cabecera del primer bloque
imprimirTitulo(1, "¿QUÉ ES LA MEMOIZACIÓN (MEMOIZATION)?");

// Explicamos el concepto fundamental de Cache Hit y Cache Miss
console.log("🧠 Memoization = Técnica de optimización que guarda resultados en caché:");
console.log("   • Cache Miss (Fallo): Primera vez con esos argumentos -> ejecuta cálculo y guarda.");
console.log("   • Cache Hit (Acierto): Mismos argumentos repetidos -> retorna respuesta en O(1).");

/* ==========================================================================
   BLOQUE 2: REQUISITO INDISPENSABLE: FUNCIONES PURAS
   ========================================================================== */
// Imprimimos la cabecera del segundo bloque
imprimirTitulo(2, "FUNCIONES PURAS VS FUNCIONES IMPURAS");

// Ejemplo de función pura (mismos argumentos siempre producen la misma salida)
const multiplicarPuro = (a, b) => a * b;
// Mostramos en consola la diferencia frente a funciones impuras
console.log("✅ Función Pura (memoizable): multiplicarPuro(6, 7) ->", multiplicarPuro(6, 7));
console.log("❌ Funciones Impuras (NO memoizar): Date.now(), Math.random(), fetch() mutables.");

/* ==========================================================================
   BLOQUE 3: ANATOMÍA INTERNA (CLOSURE + MAP) Y MULTI-ARGUMENTOS
   ========================================================================== */
// Imprimimos la cabecera del tercer bloque
imprimirTitulo(3, "ANATOMÍA INTERNA: CLOSURE + MAP + MÚLTIPLES ARGUMENTOS");

// Función genérica de orden superior que envuelve cualquier función pura para darle memoria caché
const crearMemoizer = (fn, { maxSize = 100 } = {}) => {
    // El diccionario Map permanece privado en memoria gracias al Closure
    const cache = new Map();
    // Contadores internos para auditar el rendimiento de la caché
    const stats = { hits: 0, misses: 0 };

    // Retornamos la nueva función optimizada que acepta cualquier cantidad de argumentos
    const memoized = (...args) => {
        // Convertimos todos los argumentos en una clave de texto única
        const clave = JSON.stringify(args);

        // 1. Verificamos si el resultado ya existe en caché (Cache Hit)
        if (cache.has(clave)) {
            // Incrementamos el contador de aciertos
            stats.hits++;
            // Devolvemos inmediatamente el valor almacenado sin recalcular
            return cache.get(clave);
        }

        // 2. Si no existe, es un Cache Miss: ejecutamos la función original
        stats.misses++;
        const resultado = fn(...args);

        // 3. Control de memoria: si alcanzamos el límite, eliminamos la entrada más antigua
        if (cache.size >= maxSize) {
            const claveMasAntigua = cache.keys().next().value;
            cache.delete(claveMasAntigua);
        }

        // 4. Guardamos el nuevo resultado en caché y lo retornamos
        cache.set(clave, resultado);
        return resultado;
    };

    // Adjuntamos un método auxiliar para consultar estadísticas de uso
    memoized.getStats = () => ({ ...stats, size: cache.size });
    // Retornamos la función memoizada
    return memoized;
};

// Probamos nuestra función genérica con una operación simulada
const calculoCostoso = crearMemoizer((x, y) => {
    // Simulamos trabajo matemático
    let total = 0;
    for (let i = 0; i < 200_000; i++) total += (x + y);
    return total;
});

// Primera llamada con (10, 20): Cache Miss
console.log("1ra llamada (10, 20):", calculoCostoso(10, 20), "| Stats:", calculoCostoso.getStats());
// Segunda llamada con (10, 20): Cache Hit instantáneo
console.log("2da llamada (10, 20):", calculoCostoso(10, 20), "| Stats:", calculoCostoso.getStats());

/* ==========================================================================
   BLOQUE 4: BENCHMARK CLÁSICO: FIBONACCI SIN VS CON MEMOIZACIÓN
   ========================================================================== */
// Imprimimos la cabecera del cuarto bloque
imprimirTitulo(4, "BENCHMARK REAL: FIBONACCI RECURSIVO O(2^n) VS O(n)");

// Versión recursiva tradicional sin caché: complejidad exponencial O(2^n)
const fibSinMemo = (n) => (n <= 1 ? n : fibSinMemo(n - 1) + fibSinMemo(n - 2));

// Versión memoizada: cada subproblema se resuelve una única vez O(n)
const fibConMemo = crearMemoizer((n) => (n <= 1 ? n : fibConMemo(n - 1) + fibConMemo(n - 2)));

// Medimos el tiempo para n = 34 (suficiente para notar la diferencia sin bloquear segundos largos)
const nPrueba = 34;

// Cronómetro para la versión lenta sin caché
const t0 = performance.now();
const resLento = fibSinMemo(nPrueba);
const tiempoLento = (performance.now() - t0).toFixed(2);

// Cronómetro para la versión rápida con memoización
const t1 = performance.now();
const resRapido = fibConMemo(nPrueba);
const tiempoRapido = (performance.now() - t1).toFixed(3);

// Mostramos la comparativa en consola
console.log(`🐢 fibSinMemo(${nPrueba}) = ${resLento} -> Tiempo: ${tiempoLento} ms`);
console.log(`⚡ fibConMemo(${nPrueba}) = ${resRapido} -> Tiempo: ${tiempoRapido} ms`);
console.log("   ↳ Estadísticas de fibConMemo:", fibConMemo.getStats());

/* ==========================================================================
   BLOQUE 5: GESTIÓN DE MEMORIA CON WeakMap PARA CLAVES DE OBJETO
   ========================================================================== */
// Imprimimos la cabecera del quinto bloque
imprimirTitulo(5, "CACHÉ INTELIGENTE CON WeakMap PARA OBJETOS");

// WeakMap permite que el Garbage Collector libere memoria si el objeto clave desaparece
const cacheObjetos = new WeakMap();

// Función que procesa un objeto usuario y cachea el resultado por referencia
const obtenerResumenUsuario = (usuario) => {
    // Si este objeto ya fue procesado antes, lo devolvemos desde WeakMap
    if (cacheObjetos.has(usuario)) {
        return `${cacheObjetos.get(usuario)} (desde WeakMap)`;
    }
    // Construimos el resumen la primera vez
    const resumen = `${usuario.nombre.toUpperCase()} [${usuario.rol}]`;
    // Guardamos en WeakMap usando el objeto como clave
    cacheObjetos.set(usuario, resumen);
    return resumen;
};

// Creamos un objeto usuario de ejemplo
const user1 = { nombre: "Laura", rol: "Admin" };
console.log("1ra consulta:", obtenerResumenUsuario(user1));
console.log("2da consulta:", obtenerResumenUsuario(user1));

/* ==========================================================================
   BLOQUE 6: SOLUCIONARIO DE EJERCICIOS (NIVEL 1, NIVEL 2 Y NIVEL 3)
   ========================================================================== */
// Imprimimos la cabecera del sexto bloque
imprimirTitulo(6, "SOLUCIONARIO OFICIAL: EJERCICIOS NIVEL 1, 2 Y 3");

// --- NIVEL 1: Cuadrado memoizado ---
const cuadradoMemo = crearMemoizer((n) => {
    // Este mensaje solo aparece en Cache Miss
    console.log(`   ↳ [Nivel 1] Calculando cuadrado de ${n}...`);
    return n * n;
});
console.log("📘 Nivel 1 (1ra vez):", cuadradoMemo(8));
console.log("📘 Nivel 1 (2da vez):", cuadradoMemo(8));

// --- NIVEL 2: Suma de múltiples parámetros ---
const sumarTresMemo = crearMemoizer((a, b, c) => a + b + c);
console.log("📗 Nivel 2 (10+20+30):", sumarTresMemo(10, 20, 30), "| Stats:", sumarTresMemo.getStats());
console.log("📗 Nivel 2 (repetido):", sumarTresMemo(10, 20, 30), "| Stats:", sumarTresMemo.getStats());

// --- NIVEL 3: Factorial recursivo con caché propia ---
const factorialMemo = crearMemoizer((n) => (n <= 1 ? 1 : n * factorialMemo(n - 1)));
console.log("📙 Nivel 3 (6!):", factorialMemo(6), "| Tamaño caché:", factorialMemo.getStats().size);

/* ==========================================================================
   BLOQUE 7: RESUMEN TÉCNICO Y BUENAS PRÁCTICAS
   ========================================================================== */
// Imprimimos la cabecera del bloque final
imprimirTitulo(7, "RESUMEN TÉCNICO DE MEMOIZATION");

console.log("1. 🧠 Usa Closures + Map para mantener una caché privada rápida O(1).");
console.log("2. 🛡️ Aplica memoización SOLO a funciones puras y computacionalmente costosas.");
console.log("3. 🧹 Establece un límite maxSize (LRU) o usa WeakMap para evitar fugas de memoria.");
console.log("4. ⚡ En recursividad, la llamada interna debe invocar a la función memoizada.");
console.log("=".repeat(78));
console.log("🎓 ¡Módulo de Memoization completado con éxito al 100%!");
console.log("=".repeat(78));
