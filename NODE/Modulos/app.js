// ============================================================================
// MÓDULO 03: MÓDULOS EN NODE.JS — ARCHIVO PRINCIPAL (app.js)
// Ejecutar en terminal con: node NODE/Modulos/app.js
// ============================================================================

// Importamos las funciones exportadas desde el módulo local ./saludo.js usando CommonJS
const { saludar, despedir } = require("./saludo.js");
// Importamos el módulo nativo path usando el prefijo recomendado 'node:'
const path = require("node:path");
// Importamos el módulo nativo os para consultar información del sistema
const os = require("node:os");

// Invocamos la función saludar importada de saludo.js e imprimimos el resultado
// ============================================================================
// MÓDULO 03: MÓDULOS EN NODE.JS — ARCHIVO PRINCIPAL (app.js)
// Ejecutar en terminal con: node NODE/Modulos/app.js
// ============================================================================

// Importamos las funciones exportadas desde el módulo local ./saludo.js usando CommonJS
const { saludar, despedir } = require("./saludo.js");
// Importamos el módulo nativo path usando el prefijo recomendado 'node:'
const path = require("node:path");
// Importamos el módulo nativo os para consultar información del sistema
const os = require("node:os");

// Invocamos la función saludar importada de saludo.js e imprimimos el resultado
console.log(saludar("Heidy"));
// Invocamos la segunda función importada para comprobar múltiples exportaciones
console.log(despedir("Heidy"));

// Construimos una ruta multiplataforma usando path.join()
const rutaPractica = path.join("NODE", "Modulos", "saludo.js");
// Mostramos la ruta construida y la plataforma del sistema operativo
console.log("Ruta del módulo:", rutaPractica);
console.log("Sistema operativo:", os.platform());
// Invocamos la segunda función importada para comprobar múltiples exportaciones
console.log(despedir("Heidy"));

// Mostramos la ruta construida y la plataforma del sistema operativo
console.log("Ruta del módulo:", rutaPractica);
console.log("Sistema operativo:", os.platform());
