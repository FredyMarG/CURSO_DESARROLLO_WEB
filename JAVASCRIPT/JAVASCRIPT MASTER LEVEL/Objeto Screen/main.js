/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: OBJETO SCREEN (window.screen)
 * ARCHIVO: main.js
 * Guía teórica, simulador universal en Node.js y ejemplos prácticos paso a paso
 * Documentación pedagógica LÍNEA POR LÍNEA en español
 * ============================================================================
 */
"use strict"; // Activa el modo estricto de JavaScript

/* ==========================================================================
   0. ADAPTADOR UNIVERSAL PARA EJECUCIÓN EN NAVEGADOR Y NODE.JS
   ========================================================================== */
const esNavegador = typeof window !== "undefined" && typeof window.screen !== "undefined";

// Objeto simulado para poder ejecutar esta guía directamente con Node.js sin errores
const screenAPI = esNavegador
    ? window.screen
    : {
          width: 1920,
          height: 1080,
          availWidth: 1920,
          availHeight: 1040,
          colorDepth: 24,
          pixelDepth: 24,
          orientation: { type: "landscape-primary", angle: 0 }
      };

const dpr = esNavegador ? window.devicePixelRatio || 1 : 1;

/* ==========================================================================
   1. MEDICIÓN DE PANTALLA TOTAL VS DISPONIBLE
   ========================================================================== */
const anchoTotal = screenAPI.width;
const altoTotal = screenAPI.height;
const anchoDisponible = screenAPI.availWidth;
const altoDisponible = screenAPI.availHeight;
const profundidadDeColor = screenAPI.colorDepth;
const profundidadDePixel = screenAPI.pixelDepth;

console.log("=== 🖥️ GUÍA PRÁCTICA DEL OBJETO SCREEN ==="); // Imprime salida en consola
console.log("Resolución total (width x height):", anchoTotal, "x", altoTotal); // Imprime salida en consola
console.log("Área disponible (availWidth x availHeight):", anchoDisponible, "x", altoDisponible); // Imprime salida en consola
console.log("Espacio reservado por barra del SO:", `${anchoTotal - anchoDisponible}px ancho / ${altoTotal - altoDisponible}px alto`); // Imprime salida en consola
console.log("Profundidad de color / píxel:", profundidadDeColor, "bits /", profundidadDePixel, "bits"); // Imprime salida en consola
console.log("Orientación:", screenAPI.orientation?.type || "desconocida", `(${screenAPI.orientation?.angle ?? 0}°)`); // Imprime salida en consola
console.log("Píxeles físicos estimados (DPR " + dpr + "x):", Math.round(anchoTotal * dpr), "x", Math.round(altoTotal * dpr)); // Imprime salida en consola
