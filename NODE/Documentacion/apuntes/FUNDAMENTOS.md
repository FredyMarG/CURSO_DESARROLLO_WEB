# GUÍA COMPLETA — Fundamentos y Entorno de Desarrollo en Node.js

> **Nivel:** Principiante → Intermedio (base para Junior)  
> **Módulo:** 01 — Introducción al backend, entorno de desarrollo y Node.js  
> **Objetivo:** Comprender qué es Node.js, para qué sirve, cómo se relaciona con JavaScript y el navegador, dominar la terminal, npm, `package.json`, VS Code, la arquitectura cliente-servidor HTTP y construir tus primeros programas y API de bienvenida.

---

## 1. Definición: ¿Qué es Node.js?

**Node.js** es un **entorno de ejecución de JavaScript** que permite ejecutar código JavaScript **fuera del navegador**, basado en el motor V8. Se utiliza frecuentemente para construir servidores web, APIs, herramientas de consola (CLI), automatizaciones y aplicaciones en tiempo real.

- **NO es un lenguaje de programación:** el lenguaje sigue siendo **JavaScript**.
- **NO es un framework:** frameworks como Express o Fastify se construyen encima de Node.js.
- **SÍ aporta capacidades del sistema:** archivos, red, puertos, procesos y variables de entorno.

```javascript
// archivo: saludo.js
console.log('¡Hola desde Node.js!');
console.log('Versión de Node:', process.version);
```

Para ejecutarlo, abre una terminal en la carpeta del archivo y escribe:

```powershell
node saludo.js
```

> **Importante:** Ejecutar JavaScript con Node.js no convierte automáticamente una página HTML en un servidor. Son tareas diferentes que aprenderemos a conectar.

---

## 2. ¿Qué es el backend y cómo se diferencia del frontend?

El **frontend** es la parte con la que interactúa el usuario (HTML, CSS y JavaScript en el navegador). El **backend** procesa solicitudes, aplica reglas de negocio, valida datos, gestiona usuarios y se comunica con bases de datos u otros servicios.

| Aspecto | Frontend | Backend (Node.js) |
| :--- | :--- | :--- |
| Dónde suele ejecutarse | Navegador | Servidor / Terminal |
| Responsabilidad | Interfaz y experiencia de usuario | Lógica, datos, reglas y servicios |
| Tecnologías habituales | HTML, CSS, JavaScript | Node.js, PHP, Python, Java, etc. |
| Ejemplo en la plataforma | Mostrar el catálogo de cursos | Guardar el progreso del estudiante |
| Seguridad | No se confían secretos al navegador | Protege credenciales y valida permisos |

> **Regla clave:** Nunca debemos confiar en que una validación hecha únicamente en el navegador sea suficiente para proteger datos o permisos.

---

## 3. Principales usos de Node.js

1. **APIs REST 🌐:** rutas como `GET /api/cursos` o `POST /api/progreso`.
2. **Aplicaciones web con backend 🖥️:** servir contenido, gestionar sesiones y conectar interfaces con datos persistentes.
3. **Automatización y herramientas de consola (CLI) ⚙️:** scripts para ordenar archivos, procesar datos o generar documentación.
4. **Comunicación en tiempo real 💬:** chats, notificaciones y actualizaciones en vivo con WebSockets.
5. **Integraciones y servicios externos 🔌:** consumo de APIs, envío de correos o pasarelas de pago.

---

## 4. JavaScript en el navegador vs. JavaScript en Node.js

| Operación | Navegador | Node.js |
| :--- | :--- | :--- |
| Mostrar mensajes con `console.log()` | Sí | Sí |
| Manipular HTML con `document` o `window` | Sí | No de forma nativa |
| Leer archivos del servidor con `node:fs` | No | Sí |
| Crear un servidor HTTP con `node:http` | No | Sí |
| Usar `fetch()` | Sí | Sí (en versiones modernas) |

```javascript
// ❌ Falla en Node.js (document solo existe en el navegador)
// document.querySelector('h1').textContent = 'Hola';

// ✅ Nativo en Node.js: consultar sistema operativo
const os = require('node:os');
console.log('Sistema operativo:', os.platform());
```

---

## 5. Arquitectura cliente-servidor, HTTP y componentes internos

En una aplicación web, un **cliente** envía una **petición HTTP** (método, ruta, cabeceras, cuerpo) y un **servidor** devuelve una **respuesta HTTP** (código de estado `200`/`404`/`500`, cabeceras como `Content-Type: application/json` y cuerpo).

```http
GET /api/saludo HTTP/1.1
Host: localhost:3000

HTTP/1.1 200 OK
Content-Type: application/json
{"mensaje":"Bienvenido al curso de Node.js"}
```

### Componentes fundamentales de Node.js

1. **Motor V8:** compila y ejecuta JavaScript a gran velocidad.
2. **APIs nativas:** módulos integrados como `node:fs`, `node:path`, `node:os` y `node:http`.
3. **Event Loop y libuv:** coordinan callbacks y operaciones de entrada/salida (E/S) de forma no bloqueante sin paralizar el hilo principal.
4. **Objeto global `process`:** permite consultar `process.version`, `process.cwd()` y los argumentos recibidos por línea de comandos (`process.argv.slice(2)`).

```javascript
console.log('Versión de Node.js:', process.version);
console.log('Directorio actual:', process.cwd());
console.log('Argumentos CLI:', process.argv.slice(2));
```

---

## 6. Terminal, Visual Studio Code y organización del proyecto

### Comandos esenciales en PowerShell

| Comando | Resultado |
| :--- | :--- |
| `pwd` | Muestra la carpeta actual |
| `dir` (o `ls`) | Lista archivos y carpetas |
| `cd carpeta` / `cd ..` | Entra a una carpeta o sube un nivel |
| `mkdir mi-proyecto` | Crea una carpeta |
| `New-Item archivo.js -ItemType File` | Crea un archivo vacío |
| `Clear-Host` | Limpia la pantalla de la terminal |
| `node --check archivo.js` | Verifica la sintaxis JS sin ejecutar el archivo |
| `code .` | Abre la carpeta actual en VS Code (si `code` está en `PATH`) |

### Visual Studio Code y depuración básica

- **VS Code no reemplaza a Node.js:** escribes el código en VS Code y lo ejecutas con `node` desde su terminal integrada (`Ctrl + Ñ`).
- **Depuración:** haz clic junto a un número de línea para poner un *breakpoint* y usa **Ejecutar y depurar** para inspeccionar variables paso a paso.
- **Organización recomendada:**

```text
curso-node/
├── package.json
├── README.md
├── .gitignore
├── src/
│   └── index.js
└── data/
    └── cursos.json
```

---

## 7. npm y `package.json`

**npm** es el gestor de paquetes que viene con Node.js. Mientras **Node.js ejecuta código**, **npm administra paquetes y scripts** del proyecto.

### Comandos esenciales de npm

| Comando | Función |
| :--- | :--- |
| `node -v` / `npm -v` | Muestra las versiones activas |
| `npm init -y` | Crea un `package.json` básico |
| `npm install paquete` | Instala una dependencia de producción (`dependencies`) |
| `npm install -D paquete` | Instala una dependencia de desarrollo (`devDependencies`) |
| `npm uninstall paquete` | Elimina una dependencia |
| `npm run nombre` / `npm start` | Ejecuta un script configurado en `package.json` |
| `npm ci` | Instala exactamente según `package-lock.json` |
| `npm list --depth=0` | Lista las dependencias directas instaladas |

### Ejemplo explicado de `package.json`

```json
{
  "name": "curso-desarrollo-node",
  "version": "1.0.0",
  "private": true,
  "description": "Prácticas de fundamentos Node.js",
  "type": "commonjs",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "check": "node --check src/index.js"
  }
}
```

| Campo | Explicación |
| :--- | :--- |
| `name` / `version` | Identificador y versión del proyecto |
| `private` | Evita publicaciones accidentales en el registro npm |
| `type` | Define cómo se interpretan los `.js` (`"commonjs"` o `"module"`) |
| `main` | Punto de entrada principal del paquete |
| `scripts` | Comandos invocables con `npm start` o `npm run <nombre>` |

> **Nota:** `package-lock.json` fija el árbol exacto de dependencias para instalaciones reproducibles; no lo confundas con `package.json`. Usa `.gitignore` para excluir `node_modules/` y `.env`.

---

## 8. Primer programa y primer servidor HTTP con `node:http`

### Primer programa CLI (`index.js`)

```javascript
const nombreCurso = 'Fundamentos de Node.js';
const totalModulos = 26;

function presentarCurso(nombre, cantidad) {
  return `Bienvenido a ${nombre}. El programa tiene ${cantidad} módulos.`;
}

console.log(presentarCurso(nombreCurso, totalModulos));
```

### Primer servidor HTTP (`servidor.js`)

```javascript
const http = require('node:http');

const PUERTO = 3000;

const servidor = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('¡Hola! Este mensaje viene desde un servidor Node.js.');
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});
```

Ejecuta `node servidor.js`, abre `http://localhost:3000` en tu navegador y detén el servidor con **Ctrl + C**.

---

## 9. Analogías y diagrama de flujo

- **Restaurante 🍽️:** El cliente es el navegador, la petición HTTP es el pedido, el servidor Node.js es la cocina y la respuesta HTTP es el plato entregado con su código de estado (`200`, `404`).
- **Cocina profesional (entorno):** Node.js es la cocina, JavaScript son las recetas, npm el proveedor de ingredientes, la terminal el sistema de órdenes, VS Code el escritorio de diseño y `package.json` la ficha de operación.

```text
┌───────────────────────────────┐
│ Cliente envía GET /api/cursos │
└───────────────┬───────────────┘
                │ HTTP
                ▼
┌───────────────────────────────┐
│ Servidor Node.js recibe req  │
└───────────────┬───────────────┘
                │
       ┌────────┴─────────┐
       ▼                  ▼
   [Coincide]        [No coincide]
       │                  │
       ▼                  ▼
 [200 + JSON]        [404 + JSON]
```

---

## 10. Buenas prácticas y errores comunes

| Error / Situación | Causa probable | Solución |
| :--- | :--- | :--- |
| `node` no reconocido | Instalación o `PATH` incompleto | Reinstala LTS y reinicia la terminal |
| `npm start` falla | Falta el script `start` en `package.json` | Agrégalo en `"scripts"` |
| `Unexpected token` | Error de sintaxis JS | Verifica con `node --check archivo.js` |
| `require is not defined` | El archivo se ejecuta como ESM | Usa `import` o `"type": "commonjs"` |
| `Cannot find module` / `ENOENT` | Ruta o nombre de archivo incorrecto | Revisa la ruta y usa `node:path` |
| Puerto `3000` ocupado (`EADDRINUSE`) | Otro servidor activo en ese puerto | Detén el proceso previo o cambia el puerto |

**Buenas prácticas clave:** usa versión **LTS**, valida entradas y `process.argv`, usa `Content-Type: application/json; charset=utf-8` para APIs JSON, maneja errores explícitamente y nunca subas `node_modules/` ni `.env` al repositorio.

---

## 11. Proyecto integrador: API de bienvenida con `node:http`

Crea una carpeta `proyecto-01-api-bienvenida`, ejecuta `npm init -y` y crea `servidor.js`:

```javascript
const http = require('node:http');
const PUERTO = 3000;

const cursos = [
  { id: 1, nombre: 'HTML y CSS', nivel: 'Fundamentos' },
  { id: 2, nombre: 'JavaScript', nivel: 'Fundamentos' },
  { id: 3, nombre: 'Node.js', nivel: 'Principiante a avanzado' }
];

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET' && url.pathname === '/api/bienvenida') {
    res.writeHead(200);
    return res.end(JSON.stringify({ mensaje: 'Bienvenido al curso', moduloActual: 'Fundamentos de Node.js' }));
  }

  if (req.method === 'GET' && url.pathname === '/api/cursos') {
    res.writeHead(200);
    return res.end(JSON.stringify({ total: cursos.length, cursos }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

servidor.listen(PUERTO, () => console.log(`API lista en http://localhost:${PUERTO}`));
```

Prueba en PowerShell con:
```powershell
Invoke-RestMethod http://localhost:3000/api/bienvenida
Invoke-RestMethod http://localhost:3000/api/cursos
```

---

## 12. Ejercicios de tres niveles y solucionario

- **Nivel 1 — Reconocimiento:** Ejecuta `node -v`, `npm -v`, `pwd` y crea `hola.js` imprimiendo tu nombre, el módulo actual y `process.version`.
- **Nivel 2 — Aplicación:** Crea un script que reciba dos números desde `process.argv.slice(2)`, valide que sean finitos y muestre su suma; además, levanta un servidor en el puerto `3001` que devuelva JSON `{"mensaje":"Hola, estudiante"}`.
- **Nivel 3 — Desafío:** Implementa rutas `/api/saludo`, `/api/version`, lectura de query param `?categoria=` en `/api/cursos` con `url.searchParams.get('categoria')` y respuesta `404` para rutas desconocidas.

### Solucionario resumido

```javascript
// Nivel 2: suma con process.argv
const [aTexto, bTexto] = process.argv.slice(2);
const a = Number(aTexto), b = Number(bTexto);
if (!Number.isFinite(a) || !Number.isFinite(b)) {
  console.error('Uso: node suma.js NUM1 NUM2');
  process.exitCode = 1;
} else {
  console.log(`Resultado: ${a + b}`);
}
```

```javascript
// Nivel 3: servidor con rutas y query params
const http = require('node:http');
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/api/saludo') {
    res.writeHead(200); return res.end(JSON.stringify({ mensaje: 'Hola' }));
  }
  if (req.method === 'GET' && url.pathname === '/api/version') {
    res.writeHead(200); return res.end(JSON.stringify({ version: '1.0.0' }));
  }
  if (req.method === 'GET' && url.pathname === '/api/cursos') {
    res.writeHead(200); return res.end(JSON.stringify({ categoria: url.searchParams.get('categoria') }));
  }
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'No encontrado' }));
}).listen(3002, () => console.log('Servidor en puerto 3002'));
```

---

## 13. Hoja de trucos (Cheatsheet)

| Concepto / Comando | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `node -v` / `npm -v` | Ver versiones instaladas | `node -v` |
| `node archivo.js` | Ejecutar script JavaScript | `node index.js` |
| `node --check archivo.js` | Validar sintaxis sin ejecutar | `node --check servidor.js` |
| `npm init -y` | Crear `package.json` | `npm init -y` |
| `npm start` / `npm run dev` | Ejecutar scripts del proyecto | `npm start` |
| `process.argv.slice(2)` | Leer argumentos de terminal | `const args = process.argv.slice(2)` |
| `require('node:http')` | Importar módulo HTTP nativo | `const http = require('node:http')` |
| `http.createServer()` | Crear servidor HTTP | `http.createServer((req, res) => {})` |
| `new URL(req.url, base)` | Extraer `pathname` y query params | `url.searchParams.get('categoria')` |
| `JSON.stringify()` | Serializar objeto JS a JSON | `JSON.stringify({ ok: true })` |
