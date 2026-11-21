/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: COOKIES (document.cookie)
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
"use strict";

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
const esNavegador = typeof document !== "undefined";

// Simulador en memoria de document.cookie para ejecutar esta guía en Node.js
const CookieStore = (() => {
    const mapa = new Map();
    return {
        set(raw) {
            const [par, ...attrs] = raw.split(";").map(s => s.trim());
            const eq = par.indexOf("=");
            if (eq === -1) return;
            const clave = par.slice(0, eq);
            const valor = par.slice(eq + 1);
            const maxAge = attrs.find(a => a.toLowerCase().startsWith("max-age="));
            if (maxAge && Number(maxAge.split("=")[1]) <= 0) {
                mapa.delete(clave);
            } else {
                mapa.set(clave, valor);
            }
        },
        getAll() {
            return Array.from(mapa.entries()).map(([k, v]) => `${k}=${v}`).join("; ");
        }
    };
})();

function setCookie(nombre, valor, opciones = {}) {
    const { maxAge, expires, path = "/", secure = false, sameSite = "Lax" } = opciones;
    let cadena = `${encodeURIComponent(nombre)}=${encodeURIComponent(valor)}; path=${path}; SameSite=${sameSite}`;
    if (typeof maxAge === "number") cadena += `; max-age=${maxAge}`;
    if (expires) cadena += `; expires=${expires}`;
    if (secure) cadena += `; Secure`;

    if (esNavegador) document.cookie = cadena;
    else CookieStore.set(cadena);
    return cadena;
}

function getCookie(nombre) {
    const raw = esNavegador ? document.cookie : CookieStore.getAll();
    const clave = encodeURIComponent(nombre) + "=";
    for (const item of raw.split("; ")) {
        if (item.startsWith(clave)) {
            return decodeURIComponent(item.slice(clave.length));
        }
    }
    return null;
}

function deleteCookie(nombre, path = "/") {
    return setCookie(nombre, "", { maxAge: 0, path });
}

/* ==========================================================================
   1. DEMOSTRACIÓN PASO A PASO EN CONSOLA
   ========================================================================== */
console.log("=== 🍪 GUÍA PRÁCTICA DE COOKIES EN JAVASCRIPT ===");

// 1. Crear cookies
console.log("\n1) Crear cookies:");
console.log("  ", setCookie("usuario", "JuanPerez", { maxAge: 86400 }));
console.log("  ", setCookie("perfil", "María José; rol=Admin", { maxAge: 3600 }));

// 2. Leer cookies con decodeURIComponent()
console.log("\n2) Leer cookies decodificadas:");
console.log("   usuario =>", getCookie("usuario"));
console.log("   perfil  =>", getCookie("perfil"));

// 3. Modificar cookie existente (mismo nombre y path)
console.log("\n3) Modificar cookie 'usuario':");
setCookie("usuario", "JuanPerez_Pro", { maxAge: 86400 });
console.log("   usuario actualizado =>", getCookie("usuario"));

// 4. Eliminar cookie (max-age=0)
console.log("\n4) Eliminar cookie 'perfil':");
deleteCookie("perfil");
console.log("   perfil tras borrar =>", getCookie("perfil"));
