/**
 * SERVIDOR HTTP Y API REST NATIVA (src/server.js)
 * - Usa node:http (sin Express) reutilizando exactamente las mismas funciones de src/tareas.js.
 * - Lee cuerpos POST por chunks con límite estricto de 1 MB (1e6 bytes) destruyendo el stream si excede.
 * - Unifica envío de archivos estáticos en intentarEnviarArchivo() buscando primero en public/
 *   y luego en COURSE_ROOT, validando con startsWith() contra path traversal (../).
 * - Solo llama a server.listen() si se ejecuta directamente (no al importarlo desde tests).
 */
import http from 'node:http'; // Importa módulo o dependencia
import { readFile } from 'node:fs/promises'; // Importa módulo o dependencia
import { dirname, extname, join, resolve } from 'node:path'; // Importa módulo o dependencia
import { fileURLToPath } from 'node:url'; // Importa módulo o dependencia
import { crear, listar, completar, eliminar } from './tareas.js'; // Importa módulo o dependencia

const __dirname = dirname(fileURLToPath(import.meta.url)); // Declara e inicializa variable local
const PUBLIC_DIR = resolve(__dirname, '..', 'public'); // Declara e inicializa variable local
const PUBLIC_HTML = join(PUBLIC_DIR, 'index.html'); // Declara e inicializa variable local
const EVENTOS_PATH = join(__dirname, '..', 'data', 'eventos.ndjson'); // Declara e inicializa variable local
const COURSE_ROOT = resolve(__dirname, '..', '..', '..', '..'); // Declara e inicializa variable local
const PORT = Number(process.env.PORT) || 3000; // Declara e inicializa variable local
const MAX_BODY_BYTES = 1e6; // Declara e inicializa variable local

// Cabeceras CORS compartidas por preflight OPTIONS y respuestas JSON
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Tipos MIME para servir el proyecto y el portal del curso
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8',
};

// Lee y parsea el cuerpo JSON de una petición entrante protegiendo la memoria del servidor
function leerBodyJson(req) { // Define función reutilizable
  return new Promise((resolvePromise, reject) => {
    let raw = ''; // Declara e inicializa variable local
    let excedido = false; // Declara e inicializa variable local
    req.on('data', (chunk) => {
      if (excedido) return; // Evalúa condición lógica
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) { // Evalúa condición lógica
        excedido = true;
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      if (excedido) return; // Evalúa condición lógica
      try {
        resolvePromise(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('JSON inválido en el cuerpo de la petición'));
      }
    });
    req.on('error', reject);
  });
}

// Envía una respuesta JSON estándar con código HTTP y cabeceras CORS
function enviarJson(res, status, data) { // Define función reutilizable
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(data));
}

// Intenta leer y enviar un archivo estático dentro de baseDir; devuelve false si no existe
async function intentarEnviarArchivo(baseDir, relPath, res) { // Define función asíncrona
  const fullPath = resolve(baseDir, relPath); // Declara e inicializa variable local
  if (!fullPath.startsWith(baseDir)) { // Evalúa condición lógica
    enviarJson(res, 403, { error: 'Acceso denegado' });
    return true; // Retorna el resultado de la función
  }
  try {
    const data = await readFile(fullPath); // Declara e inicializa variable local
    const mime = MIME_TYPES[extname(fullPath).toLowerCase()] || 'application/octet-stream'; // Declara e inicializa variable local
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
    return true; // Retorna el resultado de la función
  } catch {
    return false; // Retorna el resultado de la función
  }
}

// Lee data/eventos.ndjson línea por línea y lo devuelve como arreglo de objetos
async function leerEventosNdjson() { // Define función asíncrona
  try {
    const texto = await readFile(EVENTOS_PATH, 'utf8'); // Declara e inicializa variable local
    return texto
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter(Boolean)
      .map((linea) => JSON.parse(linea));
  } catch (error) {
    if (error.code === 'ENOENT') return []; // Evalúa condición lógica
    throw error;
  }
}

// Creamos el servidor HTTP que atiende la interfaz HTML, la API REST /api/* y el portal del curso
export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url; // Declara e inicializa variable local

  if (req.method === 'OPTIONS') { // Evalúa condición lógica
    res.writeHead(204, CORS_HEADERS);
    return res.end(); // Retorna el resultado de la función
  }

  try {
    if (req.method === 'GET' && pathname === '/') { // Evalúa condición lógica
      const html = await readFile(PUBLIC_HTML, 'utf8'); // Declara e inicializa variable local
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html); // Retorna el resultado de la función
    }

    if (req.method === 'GET' && pathname === '/api/tareas') { // Evalúa condición lógica
      return enviarJson(res, 200, await listar()); // Retorna el resultado de la función
    }

    if (req.method === 'POST' && pathname === '/api/tareas') { // Evalúa condición lógica
      const body = await leerBodyJson(req); // Declara e inicializa variable local
      return enviarJson(res, 201, await crear(body.descripcion)); // Retorna el resultado de la función
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/tareas/')) { // Evalúa condición lógica
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length)); // Declara e inicializa variable local
      return enviarJson(res, 200, await completar(id)); // Retorna el resultado de la función
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/tareas/')) { // Evalúa condición lógica
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length)); // Declara e inicializa variable local
      return enviarJson(res, 200, await eliminar(id)); // Retorna el resultado de la función
    }

    if (req.method === 'GET' && pathname === '/api/eventos') { // Evalúa condición lógica
      return enviarJson(res, 200, await leerEventosNdjson()); // Retorna el resultado de la función
    }

    // Estáticos: busca primero en public/ (styles.css, app.js) y luego en COURSE_ROOT (portal)
    if (req.method === 'GET' && !pathname.startsWith('/api/')) { // Evalúa condición lógica
      const relPath = decodeURIComponent(pathname).replace(/^\/+/, ''); // Declara e inicializa variable local
      if (await intentarEnviarArchivo(PUBLIC_DIR, relPath, res)) return; // Evalúa condición lógica
      if (await intentarEnviarArchivo(COURSE_ROOT, relPath, res)) return; // Evalúa condición lógica
    }

    return enviarJson(res, 404, { error: 'Ruta no encontrada' }); // Retorna el resultado de la función
  } catch (error) {
    const status = error.code === 'validation' ? 400 : 500; // Declara e inicializa variable local
    return enviarJson(res, status, { error: error.message }); // Retorna el resultado de la función
  }
});

// Solo iniciamos la escucha si este archivo se ejecuta directamente (no al importarlo en tests)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) { // Evalúa condición lógica
  server.listen(PORT, () => {
    console.log(`🚀 Interfaz web de Tareas activa en http://localhost:${PORT}`);
  });
}

