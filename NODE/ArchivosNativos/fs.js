/**
 * ============================================================================
 * PRÁCTICA NATIVA: MÓDULO node:fs, node:fs/promises y node:path
 * Descripción: Demuestra cómo leer, escribir, añadir contenido (appendFile),
 * inspeccionar (stat, readdir), renombrar (rename) y eliminar (unlink)
 * archivos locales de forma segura usando __dirname y path.join().
 *
 * Cómo ejecutar en terminal:
 *   node NODE/ArchivosNativos/fs.js
 * ============================================================================
 */

// Importa el módulo nativo de sistema de archivos (versión clásica con callbacks)
const fs = require('node:fs');
// Importa la versión basada en Promesas (ideal para usar con async/await)
const fsPromises = require('node:fs/promises');
// Importa el módulo de rutas para unir carpetas de forma compatible entre Windows/Linux/Mac
const path = require('node:path');

// __dirname contiene la ruta absoluta de la carpeta donde está guardado este archivo (fs.js).
// path.join() une esa carpeta con 'fs.html' para que funcione sin importar desde dónde ejecutes node.
const rutaArchivo = path.join(__dirname, 'fs.html');

// ----------------------------------------------------------------------------
// 1. FORMA CLÁSICA: fs.readFile() con callback (err, contenido)
// Parámetros: (ruta del archivo, codificación 'utf-8' para texto, función callback)
// ----------------------------------------------------------------------------
fs.readFile(rutaArchivo, 'utf-8', (err, contenido) => {
  // Patrón "error-first": el primer parámetro siempre es el error si algo falló
  if (err) {
    // Si el archivo no existe, err.code vale 'ENOENT'; si falta permiso, 'EACCES'
    console.error('Error al leer con callback:', err.code || err.message);
    return; // Detiene la ejecución del callback para no usar un contenido vacío
  }

  // Si no hubo error, 'contenido' contiene todo el texto del archivo fs.html
  console.log('--- Lectura con callback ---');
  console.log(contenido);
});

// ----------------------------------------------------------------------------
// 2. FORMA MODERNA: node:fs/promises con async/await y try/catch
// ----------------------------------------------------------------------------
async function leerConPromesas() {
  try {
    // await pausa esta función (sin bloquear Node.js) hasta terminar de leer el archivo
    const contenido = await fsPromises.readFile(rutaArchivo, 'utf-8');
    console.log('--- Lectura con fs/promises ---');
    console.log(`Caracteres leídos: ${contenido.length}`);

    // stat() consulta metadatos del archivo (tamaño en bytes, si es archivo o carpeta)
    const info = await fsPromises.stat(rutaArchivo);
    console.log(`Tamaño de fs.html: ${info.size} bytes | Es archivo: ${info.isFile()}`);

    // readdir() lista todos los nombres de archivos/carpetas dentro de __dirname
    const archivos = await fsPromises.readdir(__dirname);
    console.log('Archivos en esta carpeta:', archivos);

    // ------------------------------------------------------------------------
    // 3. CREAR (writeFile), AÑADIR (appendFile), RENOMBRAR (rename) Y ELIMINAR (unlink)
    // ------------------------------------------------------------------------
    // Define las rutas de origen y destino dentro de esta misma carpeta (__dirname)
    const origen = path.join(__dirname, 'temporal.txt');
    const destino = path.join(__dirname, 'renombrado.txt');

    // writeFile() crea (o sobrescribe) 'temporal.txt' con texto en codificación UTF-8
    await fsPromises.writeFile(origen, 'Primera línea\n', 'utf-8');

    // appendFile() agrega texto al final del archivo SIN borrar lo que ya tenía
    await fsPromises.appendFile(origen, 'Segunda línea agregada con appendFile()\n', 'utf-8');

    // rename() cambia el nombre de 'temporal.txt' a 'renombrado.txt' (también sirve para moverlo)
    await fsPromises.rename(origen, destino);
    console.log('--- Renombrado con fsPromises.rename() ---');

    // path.basename() extrae solo el nombre del archivo sin toda la ruta de carpetas
    console.log(`Renombrado: ${path.basename(origen)} -> ${path.basename(destino)}`);

    // Lee el contenido final para comprobar que ambas líneas quedaron guardadas
    const textoFinal = await fsPromises.readFile(destino, 'utf-8');
    console.log('Contenido final tras appendFile + rename:\n' + textoFinal.trim());

    // unlink() elimina el archivo temporal de prueba para mantener limpia la carpeta
    await fsPromises.unlink(destino);
  } catch (err) {
    // Captura cualquier fallo en readFile, stat, readdir, writeFile, appendFile, rename o unlink
    console.error('Error en operación de archivos:', err.code || err.message);
  }
}

// Invoca la función asíncrona principal
leerConPromesas();
