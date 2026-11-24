# Proyecto: Gestor de Tareas CLI & Web (`NODE/Proyectos/Tareas`)

Aplicación full-stack nativa en **Node.js** (cero dependencias externas) que integra los módulos del curso: **ESM (`import`/`export`)**, **`node:http`**, **`node:fs/promises`**, **`node:path`**, **`node:crypto` (`randomUUID`)**, **`EventEmitter`**, **JSON**, **NDJSON** y pruebas con **`node:test`**.

---

## 1. Arquitectura y estructura de archivos

```text
NODE/Proyectos/Tareas/
├── package.json             # Manifiesto npm ("type": "module" y scripts start/dev/web/test)
├── README.md                # Guía técnica del proyecto, comandos Bash/PowerShell y API
├── src/
│   ├── index.js             # Punto de entrada CLI (process.argv -> crear/listar/completar/eliminar)
│   ├── server.js            # Servidor HTTP nativo (API REST /api/* + estáticos de public/ y portal)
│   ├── tareas.js            # Lógica de negocio y validaciones (crear, listar, completar, eliminar)
│   ├── bus.js               # Bus de eventos (EventEmitter) que dispara el log de auditoría
│   └── storage.js           # Persistencia en disco (data/tareas.json y data/eventos.ndjson)
├── public/
│   ├── index.html           # Estructura HTML de la interfaz web (modo Node.js y modo Demo)
│   ├── styles.css           # Hoja de estilos oscuro-neón y scrollbars personalizados
│   └── app.js               # Lógica cliente (Fetch API / localStorage + visores JSON/NDJSON)
├── data/
│   ├── tareas.json          # Estado actual de las tareas en formato JSON
│   └── eventos.ndjson       # Historial append-only de eventos en formato NDJSON
└── tests/
    └── tareas.test.js       # Pruebas automatizadas con node:test y node:assert/strict
```

---

## 2. Comandos en Consola Bash (Git Bash / Linux / macOS)

### Navegar al proyecto
```bash
cd NODE/Proyectos/Tareas
```

### A) Uso por línea de comandos (CLI)
```bash
# Mostrar ayuda de comandos disponibles
node src/index.js

# Crear nuevas tareas (genera UUID y guarda en data/tareas.json + data/eventos.ndjson)
node src/index.js add "Repasar Node.js y JSON"
node src/index.js add "Probar API REST con curl"

# Listar todas las tareas con su prefijo de ID (8 caracteres) y estado
node src/index.js list

# Completar una tarea usando su ID completo o los primeros 8 caracteres
node src/index.js done 40bf73ca

# Eliminar una tarea usando su ID completo o prefijo
node src/index.js delete 40bf73ca
```

### B) Ejecutar el servidor web con interfaz gráfica
```bash
# Inicia src/server.js en http://localhost:3000
npm run web

# (Opcional) Ejecutar en otro puerto usando variable de entorno en Bash:
PORT=4000 node src/server.js
```
Abre **`http://localhost:3000`** en tu navegador. Los botones **🚀 Proyectos** y **🏠 Portal** también funcionan directamente desde `localhost:3000`.

### C) Inspeccionar archivos de datos desde Bash
```bash
# Ver el JSON completo de tareas actuales
cat data/tareas.json

# Ver todas las líneas del historial NDJSON
cat data/eventos.ndjson

# Seguir en vivo los nuevos eventos mientras usas la web o el CLI (Ctrl+C para salir)
tail -f data/eventos.ndjson

# Contar cuántos eventos se han registrado
wc -l data/eventos.ndjson
```

### D) Probar la API REST desde Bash con `curl`
Con `npm run web` corriendo en otra terminal:

```bash
# 1. Listar tareas (GET)
curl -s http://localhost:3000/api/tareas

# 2. Crear una tarea nueva (POST)
curl -s -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Creada desde Bash con curl"}'

# 3. Completar una tarea por ID o prefijo (PATCH)
curl -s -X PATCH http://localhost:3000/api/tareas/40bf73ca

# 4. Eliminar una tarea por ID o prefijo (DELETE)
curl -s -X DELETE http://localhost:3000/api/tareas/40bf73ca

# 5. Consultar el historial de eventos NDJSON en JSON (GET)
curl -s http://localhost:3000/api/eventos
```

### E) Ejecutar las pruebas automatizadas
```bash
npm test
# o directamente:
node --test
```

---

## 3. Equivalente rápido en PowerShell (Windows)

```powershell
cd NODE\Proyectos\Tareas
node src/index.js list
npm run web
npm test
Get-Content data\eventos.ndjson -Tail 10 -Wait
```

---

## 4. Documentación línea a línea de los archivos JSON

> **Importante:** El estándar JSON (**RFC 8259**) **no permite comentarios** (`//` ni `/* */`) dentro de archivos `.json` o `.ndjson`, porque `node`, `npm` y `JSON.parse()` lanzarían `SyntaxError`. Por eso la explicación detallada vive en esta sección.

### `package.json`
```jsonc
{
  "name": "tareas",                      // Identificador del proyecto en minúsculas
  "version": "1.0.0",                    // Versión SemVer (MAJOR.MINOR.PATCH)
  "description": "",                     // Descripción opcional
  "main": "src/index.js",                // Archivo de entrada principal (CLI)
  "scripts": {                           // Atajos ejecutables con npm
    "test": "node --test",               // Ejecuta tests/tareas.test.js sin librerías externas
    "start": "node src/index.js",        // Ejecuta el CLI (ej. npm start -- list)
    "dev": "node --watch src/index.js",  // Reinicia automáticamente al guardar cambios
    "web": "node src/server.js"          // Levanta el servidor HTTP y la UI en puerto 3000
  },
  "keywords": [],                        // Etiquetas de búsqueda
  "author": "",                          // Autor
  "license": "ISC",                      // Licencia por defecto
  "type": "module"                       // Habilita ES Modules (import / export) en todo el proyecto
}
```

### `data/tareas.json`
```jsonc
[                                                     // Arreglo JSON con el estado actual de todas las tareas
  {
    "id": "40bf73ca-2d44-42f0-aede-9b2bcce85ee5",     // UUID v4 único generado por crypto.randomUUID()
    "descripcion": "Repasar Node.js y JSON",          // Texto de la tarea validado (no vacío)
    "completada": false,                              // Estado booleano: false (pendiente) / true (hecha)
    "creadoEn": "2026-11-24T04:30:57.515Z"            // Fecha/hora UTC en formato ISO 8601
  }
]
```

### `data/eventos.ndjson`
Usa **NDJSON** (*Newline Delimited JSON*): **cada línea es un objeto JSON completo**, lo que permite añadir eventos con `appendFile()` sin reescribir el archivo entero:

```jsonc
{"ts":"2026-11-24T04:30:57.525Z","tipo":"tarea:creada","id":"40bf73ca-...","descripcion":"Repasar Node.js y JSON"}
{"ts":"2026-11-24T04:30:59.100Z","tipo":"tarea:completada","id":"40bf73ca-..."}
{"ts":"2026-11-24T04:31:05.220Z","tipo":"tarea:eliminada","id":"40bf73ca-..."}
```

| Propiedad | Descripción |
|---|---|
| `ts` | Timestamp ISO 8601 exacto en el que se emitió el evento |
| `tipo` | Nombre del evento en `EventEmitter` (`tarea:creada`, `tarea:completada`, `tarea:eliminada`) |
| `id` | UUID de la tarea sobre la que ocurrió la acción |
| `descripcion` | Texto inicial (incluido en eventos `tarea:creada`) |

---

## 5. Modo dual de la interfaz web (`public/index.html`)

- **🟢 Conectado a Node.js (`http://localhost:3000`):** `public/app.js` detecta `/api/tareas` y guarda directamente en `data/tareas.json` y `data/eventos.ndjson` en disco.
- **🟡 Modo Demo Navegador (desde el Portal estático):** si se abre sin `npm run web` encendido, `public/app.js` usa `localStorage` para que toda la interfaz y los visores JSON/NDJSON funcionen igualmente.
