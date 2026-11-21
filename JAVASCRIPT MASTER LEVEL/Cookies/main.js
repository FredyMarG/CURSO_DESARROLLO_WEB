/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: COOKIES (document.cookie)
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
"use strict"; // Activa el modo estricto de JavaScript

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
const esNavegador = typeof document !== "undefined"; // Declara e inicializa "esNavegador"

// Simulador en memoria de document.cookie para ejecutar esta guía en Node.js
const CookieStore = (() => { // Define función flecha "CookieStore"
    const mapa = new Map(); // Declara e inicializa "mapa"
    return { // Retorna resultado
        set(raw) { // Instrucción JavaScript
            const [par, ...attrs] = raw.split(";").map(s => s.trim()); // Define función flecha "variable"
            const eq = par.indexOf("="); // Declara e inicializa "eq"
            if (eq === -1) return; // Evalúa condición
            const clave = par.slice(0, eq); // Declara e inicializa "clave"
            const valor = par.slice(eq + 1); // Declara e inicializa "valor"
            const maxAge = attrs.find(a => a.toLowerCase().startsWith("max-age=")); // Define función flecha "maxAge"
            if (maxAge && Number(maxAge.split("=")[1]) <= 0) { // Evalúa condición
                mapa.delete(clave); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                mapa.set(clave, valor); // Ejecuta llamada o método
            }
        },
        getAll() { // Instrucción JavaScript
            return Array.from(mapa.entries()).map(([k, v]) => `${k}=${v}`).join("; "); // Retorna resultado
        }
    };
})(); // Ejecuta llamada o método

function setCookie(nombre, valor, opciones = {}) { // Declara función
    const { maxAge, expires, path = "/", secure = false, sameSite = "Lax" } = opciones; // Declara e inicializa "variable"
    let cadena = `${encodeURIComponent(nombre)}=${encodeURIComponent(valor)}; path=${path}; SameSite=${sameSite}`; // Declara e inicializa "cadena"
    if (typeof maxAge === "number") cadena += `; max-age=${maxAge}`; // Evalúa condición
    if (expires) cadena += `; expires=${expires}`; // Evalúa condición
    if (secure) cadena += `; Secure`; // Evalúa condición

    if (esNavegador) document.cookie = cadena; // Evalúa condición
    else CookieStore.set(cadena); // Rama alternativa
    return cadena; // Retorna resultado
}

function getCookie(nombre) { // Declara función
    const raw = esNavegador ? document.cookie : CookieStore.getAll(); // Declara e inicializa "raw"
    const clave = encodeURIComponent(nombre) + "="; // Declara e inicializa "clave"
    for (const item of raw.split("; ")) { // Inicia bucle de iteración
        if (item.startsWith(clave)) { // Evalúa condición
            return decodeURIComponent(item.slice(clave.length)); // Retorna resultado
        }
    }
    return null; // Retorna resultado
}

function deleteCookie(nombre, path = "/") { // Declara función
    return setCookie(nombre, "", { maxAge: 0, path }); // Retorna resultado
}

/* ==========================================================================
   1. DEMOSTRACIÓN PASO A PASO EN CONSOLA
   ========================================================================== */
console.log("=== 🍪 GUÍA PRÁCTICA DE COOKIES EN JAVASCRIPT ==="); // Imprime salida en consola

// 1. Crear cookies
console.log("\n1) Crear cookies:"); // Imprime salida en consola
console.log("  ", setCookie("usuario", "JuanPerez", { maxAge: 86400 })); // Imprime salida en consola
console.log("  ", setCookie("perfil", "María José; rol=Admin", { maxAge: 3600 })); // Imprime salida en consola

// 2. Leer cookies con decodeURIComponent()
console.log("\n2) Leer cookies decodificadas:"); // Imprime salida en consola
console.log("   usuario =>", getCookie("usuario")); // Imprime salida en consola
console.log("   perfil  =>", getCookie("perfil")); // Imprime salida en consola

// 3. Modificar cookie existente (mismo nombre y path)
console.log("\n3) Modificar cookie 'usuario':"); // Imprime salida en consola
setCookie("usuario", "JuanPerez_Pro", { maxAge: 86400 }); // Ejecuta llamada o método
console.log("   usuario actualizado =>", getCookie("usuario")); // Imprime salida en consola

// 4. Eliminar cookie (max-age=0)
console.log("\n4) Eliminar cookie 'perfil':"); // Imprime salida en consola
deleteCookie("perfil"); // Ejecuta llamada o método
console.log("   perfil tras borrar =>", getCookie("perfil")); // Imprime salida en consola
