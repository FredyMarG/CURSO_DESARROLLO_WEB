/**
 * SERVIDOR HTTP Y API REST NATIVA (src/server.js)
 * - Usa node:http (sin Express) reutilizando exactamente las mismas funciones de src/tareas.js.
 * - Lee cuerpos POST por chunks con límite estricto de 1 MB (1e6 bytes) destruyendo el stream si excede.
 * - Unifica envío de archivos estáticos en intentarEnviarArchivo() buscando primero en public/
 *   y luego en COURSE_ROOT, validando con startsWith() contra path traversal (../).
 * - Solo llama a server.listen() si se ejecuta directamente (no al importarlo desde tests).
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crear, listar, completar, eliminar } from './tareas.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');
const PUBLIC_HTML = join(PUBLIC_DIR, 'index.html');
const EVENTOS_PATH = join(__dirname, '..', 'data', 'eventos.ndjson');
const COURSE_ROOT = resolve(__dirname, '..', '..', '..', '..');
const PORT = Number(process.env.PORT) || 3000;
const MAX_BODY_BYTES = 1e6;

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
function leerBodyJson(req) {
  return new Promise((resolvePromise, reject) => {
    let raw = '';
    let excedido = false;
    req.on('data', (chunk) => {
      if (excedido) return;
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) {
        excedido = true;
        req.destroy();
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      if (excedido) return;
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
function enviarJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(data));
}

// Intenta leer y enviar un archivo estático dentro de baseDir; devuelve false si no existe
async function intentarEnviarArchivo(baseDir, relPath, res) {
  const fullPath = resolve(baseDir, relPath);
  if (!fullPath.startsWith(baseDir)) {
    enviarJson(res, 403, { error: 'Acceso denegado' });
    return true;
  }
  try {
    const data = await readFile(fullPath);
    const mime = MIME_TYPES[extname(fullPath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
    return true;
  } catch {
    return false;
  }
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

// Creamos el servidor HTTP que atiende la interfaz HTML, la API REST /api/* y el portal del curso
export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  try {
    if (req.method === 'GET' && pathname === '/') {
      const html = await readFile(PUBLIC_HTML, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (req.method === 'GET' && pathname === '/api/tareas') {
      return enviarJson(res, 200, await listar());
    }

    if (req.method === 'POST' && pathname === '/api/tareas') {
      const body = await leerBodyJson(req);
      return enviarJson(res, 201, await crear(body.descripcion));
    }

    if (req.method === 'PATCH' && pathname.startsWith('/api/tareas/')) {
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length));
      return enviarJson(res, 200, await completar(id));
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/tareas/')) {
      const id = decodeURIComponent(pathname.slice('/api/tareas/'.length));
      return enviarJson(res, 200, await eliminar(id));
    }

    if (req.method === 'GET' && pathname === '/api/eventos') {
      return enviarJson(res, 200, await leerEventosNdjson());
    }

    // Estáticos: busca primero en public/ (styles.css, app.js) y luego en COURSE_ROOT (portal)
    if (req.method === 'GET' && !pathname.startsWith('/api/')) {
      const relPath = decodeURIComponent(pathname).replace(/^\/+/, '');
      if (await intentarEnviarArchivo(PUBLIC_DIR, relPath, res)) return;
      if (await intentarEnviarArchivo(COURSE_ROOT, relPath, res)) return;
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
