/**
 * SERVIDOR HTTP Y API REST NATIVA (src/server.js)
 * - Usa node:http (sin Express) reutilizando exactamente las mismas funciones de src/tareas.js.
 * - Lee cuerpos POST por chunks con límite de 1 MB (1e6 bytes) para evitar saturar RAM.
 * - Sirve GET / (public/index.html), API REST (/api/tareas, /api/eventos) y estáticos:
 *   busca primero en public/ (styles.css, app.js) y luego en COURSE_ROOT (portal del curso)
 *   validando con startsWith() para impedir path traversal (../).
 * - Solo llama a server.listen() si se ejecuta directamente (no al importarlo desde tests).
 */
// Importamos el servidor HTTP nativo de Node.js (sin Express ni dependencias externas)
import http from 'node:http';
// Importamos lectura de archivos para servir public/index.html, el portal del curso y eventos.ndjson
import { readFile } from 'node:fs/promises';
// Importamos utilidades de rutas y URL para resolver archivos en ES Modules
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// Reutilizamos exactamente la misma lógica de negocio que usa el CLI
import { crear, listar, completar, eliminar } from './tareas.js';

// Calculamos rutas absolutas hacia public/index.html, data/eventos.ndjson y la raíz del curso
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const PUBLIC_HTML = join(PUBLIC_DIR, 'index.html');
const EVENTOS_PATH = join(__dirname, '..', 'data', 'eventos.ndjson');
// Subimos 4 niveles desde NODE/Proyectos/Tareas/src hasta CURSO_DESARROLLO_WEB/
const COURSE_ROOT = resolve(__dirname, '..', '..', '..', '..');
const PORT = Number(process.env.PORT) || 3000;

// Mapa de tipos MIME para servir el portal del curso (index.html, CSS, JS, imágenes, etc.)
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

// Lee y parsea el cuerpo JSON de una petición entrante (POST / PATCH) usando streams por chunks
function leerBodyJson(req) {
  return new Promise((resolvePromise, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      // Límite básico de seguridad (1 MB) para evitar payloads gigantes
      if (raw.length > 1e6) reject(new Error('Payload demasiado grande'));
    });
    req.on('end', () => {
      try {
        resolvePromise(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('JSON inválido en el cuerpo de la petición'));
      }
    });
    req.on('error', reject);
  });
}

// Envía una respuesta JSON estándar con código de estado HTTP y cabeceras CORS
function enviarJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

// Lee data/eventos.ndjson línea por línea y lo devuelve como arreglo de objetos
async function leerEventosNdjson() {
  try {
    const texto = await readFile(EVENTOS_PATH, 'utf8');
    return texto
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter(Boolean)
      .map((linea) => JSON.parse(linea));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

// Sirve un archivo estático buscando primero en public/ (styles.css, app.js) y luego en COURSE_ROOT
async function servirArchivoCurso(pathname, res) {
  const relPath = decodeURIComponent(pathname).replace(/^\/+/, '');
  const publicPath = resolve(PUBLIC_DIR, relPath);
  if (publicPath.startsWith(PUBLIC_DIR)) {
    try {
      const data = await readFile(publicPath);
      const mime = MIME_TYPES[extname(publicPath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      return res.end(data);
    } catch {
      // Si no está en public/, seguimos buscando en COURSE_ROOT
    }
  }

  const fullPath = resolve(COURSE_ROOT, relPath);
  if (!fullPath.startsWith(COURSE_ROOT)) {
    return enviarJson(res, 403, { error: 'Acceso denegado' });
  }
  try {
    const data = await readFile(fullPath);
    const mime = MIME_TYPES[extname(fullPath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    return res.end(data);
  } catch {
    return enviarJson(res, 404, { error: 'Ruta no encontrada' });
  }
}

// Creamos el servidor HTTP que atiende la interfaz HTML, la API REST /api/* y el portal del curso
export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  try {
    // 1) Ruta principal: sirve la interfaz gráfica web del Gestor de Tareas
    if (req.method === 'GET' && pathname === '/') {
      const html = await readFile(PUBLIC_HTML, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    // 2) GET /api/tareas -> devuelve todas las tareas desde data/tareas.json
    if (req.method === 'GET' && pathname === '/api/tareas') {
      return enviarJson(res, 200, await listar());
    }

    // 3) POST /api/tareas -> crea una nueva tarea y registra evento en eventos.ndjson
    if (req.method === 'POST' && pathname === '/api/tareas') {
      const body = await leerBodyJson(req);
      const nueva = await crear(body.descripcion);
      return enviarJson(res, 201, nueva);
    }

    // 4) PATCH /api/tareas/:id -> marca la tarea como completada
    if (req.method === 'PATCH' && pathname.startsWith('/api/tareas/')) {
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length));
      const actualizada = await completar(id);
      return enviarJson(res, 200, actualizada);
    }

    // 5) DELETE /api/tareas/:id -> elimina la tarea
    if (req.method === 'DELETE' && pathname.startsWith('/api/tareas/')) {
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length));
      const eliminada = await eliminar(id);
      return enviarJson(res, 200, eliminada);
    }

    // 6) GET /api/eventos -> devuelve el historial de eventos desde data/eventos.ndjson
    if (req.method === 'GET' && pathname === '/api/eventos') {
      return enviarJson(res, 200, await leerEventosNdjson());
    }

    // 7) Cualquier otra petición GET sirve archivos del curso (ej. /index.html?filter=proyectos)
    if (req.method === 'GET' && !pathname.startsWith('/api/')) {
      return await servirArchivoCurso(pathname, res);
    }

    return enviarJson(res, 404, { error: 'Ruta no encontrada' });
  } catch (error) {
    const status = error.code === 'validation' ? 400 : 500;
    return enviarJson(res, status, { error: error.message });
  }
});

// Solo iniciamos la escucha si este archivo se ejecuta directamente (no al importarlo en tests)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  server.listen(PORT, () => {
    console.log(`🚀 Interfaz web de Tareas activa en http://localhost:${PORT}`);
  });
}
