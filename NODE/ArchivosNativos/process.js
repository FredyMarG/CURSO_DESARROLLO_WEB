/**
 * ============================================================================
 * PRÁCTICA NATIVA: MÓDULO node:process
 * Descripción: Demuestra cómo inspeccionar y controlar el proceso actual de
 * Node.js (argumentos CLI, variables de entorno, carpeta de trabajo, PIDs y
 * plataforma) usando CommonJS con el prefijo oficial "node:".
 *
 * Cómo ejecutar en terminal:
 *   node NODE/ArchivosNativos/process.js Ana
 * ============================================================================
 */

const process = require('node:process');

// Arreglo con la ruta de node.exe [0], la ruta del script [1] y los argumentos del usuario [2...]
console.log('Argumentos CLI (process.argv):', process.argv);

// Objeto con las variables de entorno del sistema (PORT, PATH, USERPROFILE, etc.)
console.log('Total de variables en process.env:', Object.keys(process.env).length);

// Directorio de trabajo actual desde donde se ejecutó el comando node
console.log('Directorio actual (process.cwd):', process.cwd());

// Identificador único del proceso actual (Process ID) en el sistema operativo
console.log('PID actual (process.pid):', process.pid);

// Identificador del proceso padre (Parent PID, por ejemplo la terminal PowerShell)
console.log('PID padre (process.ppid):', process.ppid);

// Nombre o título asignado al proceso en el administrador de tareas
console.log('Título del proceso (process.title):', process.title);

// Sistema operativo donde corre Node.js ('win32', 'linux', 'darwin')
console.log('Plataforma (process.platform):', process.platform);

// Versión exacta del entorno de ejecución Node.js
console.log('Versión de Node.js (process.version):', process.version);
