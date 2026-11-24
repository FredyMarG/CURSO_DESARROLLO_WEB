/**
 * ============================================================================
 * PRÁCTICA NATIVA: MÓDULO node:os
 * Descripción: Demuestra cómo consultar información del hardware y del sistema
 * operativo (núcleos CPU, memoria libre/total, carpetas del usuario y detalles
 * del SO) usando CommonJS con el prefijo oficial "node:".
 *
 * Cómo ejecutar en terminal:
 *   node NODE/ArchivosNativos/os.js
 * ============================================================================
 */

const os = require('node:os');

// Información de cada núcleo lógico del procesador (modelo, velocidad y tiempos)
console.log('Núcleos lógicos (os.cpus().length):', os.cpus().length);

// Memoria RAM libre actual expresada en bytes (se convierte a MB para lectura clara)
console.log('Memoria libre (os.freemem):', Math.round(os.freemem() / 1024 ** 2), 'MB');

// Memoria RAM total instalada en el equipo
console.log('Memoria total (os.totalmem):', Math.round(os.totalmem() / 1024 ** 2), 'MB');

// Ruta de la carpeta personal del usuario activo
console.log('Carpeta de usuario (os.homedir):', os.homedir());

// Ruta del directorio temporal del sistema operativo
console.log('Carpeta temporal (os.tmpdir):', os.tmpdir());

// Nombre de red del equipo (hostname)
console.log('Nombre del equipo (os.hostname):', os.hostname());

// Plataforma de compilación de Node.js ('win32', 'linux', 'darwin')
console.log('Plataforma (os.platform):', os.platform());

// Versión/compilación del kernel del sistema operativo
console.log('Release del SO (os.release):', os.release());

// Nombre del sistema operativo ('Windows_NT', 'Linux', 'Darwin')
console.log('Tipo de SO (os.type):', os.type());

// Nombre descriptivo de la edición del sistema operativo
console.log('Versión del SO (os.version):', os.version());
