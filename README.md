# 🚀 Curso Completo de Desarrollo Web (HTML5, CSS3, JavaScript & Node.js)

Repositorio integral e interactivo de aprendizaje y práctica progresiva de desarrollo web Full Stack. Combina **documentación técnica en Markdown**, **diapositivas interactivas**, **laboratorios en vivo**, **retos prácticos de código**, **quizzes**, **consola integrada en el navegador** y **ejemplos ejecutables en Node.js**, todo unificado bajo una interfaz moderna de temas neón dinámicos.

---

## ✨ Características Principales

- **Portal Central Unificado (`index.html`)**: Buscador con *debounce*, catálogo completo de 208 recursos con iconos oficiales (Flaticon), barra de progreso global en `localStorage`, botón para continuar el último módulo, filtros por nivel, ruta visual guiada de 5 pasos y optimización de renderizado (`DocumentFragment`, `loading="lazy"`, `content-visibility: auto`).
- **Navegación Directa entre Módulos (`RESOURCES COURSE/`)**:
  - **5 temas de color dinámicos** (*Cyan, Purple, Emerald, Amber, Rose*) intercambiables en tiempo real.
  - Botones automáticos de **⬅ Módulo Anterior**, **Siguiente Módulo ➡**, **📘 Apuntes** y **🚀 Proyectos** en todos los niveles.
  - **Carrusel de teoría interactiva + Laboratorio en vivo + Reto Práctico + Quiz + Consola integrada**.
- **Visores de Documentación**: 5 centros de documentación (`HTML y CSS`, `JS Junior`, `JS Mid`, `JS Master` y `Node.js`) con índice lateral completo, buscador en tiempo real, tablas Markdown, botones de copia y enlace directo al módulo correspondiente.
- **Exhibiciones de Proyectos (`HTML y CSS/PROYECTOS/` y `JAVASCRIPT/PROYECTOS/`)**: Galerías dedicadas para explorar los 8 proyectos de HTML/CSS y los 16 proyectos de JavaScript sin distracciones.
- **Código documentado línea a línea**: Las **217** páginas `.html`, **141** archivos `.js` y **129** archivos `.css` cuentan con sintaxis validada y comentarios explicativos en español.

---

## 📂 Estructura del Proyecto

```text
CURSO_DESARROLLO_WEB/
├── index.html                    # Portal principal con catálogo, iconos y navegación global
├── README.md                     # Documentación general del repositorio
├── RESOURCES COURSE/             # Motor visual, catálogo, temas neón, retos y navegación
│   ├── portal/                   # app.js y style.css del portal principal
│   ├── modules/                  # course-polish.js/.css y junior-theme.js para módulos
│   └── exercises/                # ejercicios-neon.js/.css para ejercicios y proyectos
├── HTML y CSS/                   # 10 módulos principales + 8 guías .md + exhibición de 8 proyectos
├── JAVASCRIPT/
│   ├── JAVASCRIPT JUNIOR LEVEL/  # 13 módulos + 14 guías .md + 12 ejercicios
│   ├── JAVASCRIPT MID LEVEL/     # 19 módulos + 25 guías .md + 7 ejercicios
│   ├── JAVASCRIPT MASTER LEVEL/  # 24 módulos + 24 guías .md + 9 ejercicios
│   └── PROYECTOS/                # Exhibición de 16 proyectos JS + 3 apps completas
└── NODE/                         # 4 módulos interactivos + 4 guías .md + scripts CLI/HTTP
    ├── Fundamentos/              # Presentación + index.js (CLI) + servidor.js (node:http)
    ├── Instalacion/              # Presentación de LTS, winget, nvm-windows, PATH y VS Code
    ├── REPL/                     # Presentación + catalogo.js (prototipo en memoria)
    ├── Modulos/                  # Presentación + saludo.js / app.js (CommonJS y ESM)
    └── Documentacion/            # Visor de apuntes + apuntes/*.md + docs-data.js
```

---

## 📚 Contenido por Nivel

### 1. [HTML y CSS](./HTML%20y%20CSS)
- **Documentación (`HTML y CSS/Documentacion/`):** 8 guías técnicas actualizadas (incluyendo *qué es y para qué sirve* HTML5 y CSS3, Flexbox, Grid & `subgrid`, Responsive Design & Container Queries, Animaciones, Funciones Avanzadas como `color-mix()`/`clamp()`, y Hosting/Edge).
- **Módulos y Proyectos:** `HTML BASICO`, `HTML avanzado`, `CSS BASICO`, `CSS avanzado`, `Flexbox`, `Grid`, `Animaciones`, `Funciones Avanzadas`, `Responsive Design` y exhibición en `HTML y CSS/PROYECTOS/`.

### 2. [JavaScript Junior Level](./JAVASCRIPT/JAVASCRIPT%20JUNIOR%20LEVEL)
- **Documentación (`JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/`):** 14 guías ordenadas progresivamente del `01.` al `14.` (`VARIABLES.md` → `DOM.md`).
- **Práctica:** 13 laboratorios interactivos con navegación directa entre módulos y 12 ejercicios resueltos en `EJERCICIOS/`.

### 3. [JavaScript Mid Level](./JAVASCRIPT/JAVASCRIPT%20MID%20LEVEL)
- **Documentación (`JAVASCRIPT/JAVASCRIPT MID LEVEL/DOCUMENTACION/`):** 25 guías técnicas ordenadas del `01.` al `25.` (`WINDOW.md`, `OBJETOS BARPROP.md` → `PESTAÑA APPLICATION.md`), con soporte de tablas Markdown.
- **Práctica:** 19 módulos interactivos con laboratorio, reto práctico y quiz, más 7 ejercicios en `EJERCICIOS/`.

### 4. [JavaScript Master Level](./JAVASCRIPT/JAVASCRIPT%20MASTER%20LEVEL)
- **Documentación (`JAVASCRIPT/JAVASCRIPT MASTER LEVEL/DOCUMENTACION/`):** 24 guías avanzadas ordenadas del `01.` al `24.` sobre Web APIs y fundamentos profundos (`MODO ESTRICTO.md` → `SERVICE WORKERS.md`).
- **Práctica:** 24 módulos interactivos, 9 ejercicios avanzados en `EJERCICIOS/` y exhibición unificada en [JAVASCRIPT/PROYECTOS/index.html](./JAVASCRIPT/PROYECTOS/index.html).

### 5. [Node.js](./NODE)
- **Documentación (`NODE/Documentacion/`):** 10 guías completas (`INTRODUCCION.md` → `MODULOS.md`).
- **Módulos y Práctica (cada uno con enfoque único, simulador, quiz y laboratorio):**
  - `01. Introducción a Node.js`: qué es Node.js, Frontend vs Backend, Navegador vs Node.js, usos reales y primer script CLI (`hola.js`).
  - `02. Fundamentos de Node.js`: ciclo Cliente-Servidor HTTP, `npm`, `package.json`, `process.argv`, servidor `node:http` y API de bienvenida.
  - `03. Instalación y Entorno`: LTS vs Current, `.msi`, `winget`, `nvm-windows`, `PATH`, PowerShell y `node --watch`.
  - `04. REPL`: ciclo Read–Eval–Print–Loop, comandos `.help`/`.save`/`.load`/`.editor` y prototipo `catalogo.js`.
  - `05. JavaScript Moderno`: `const`/`let` y TDZ, arrow functions, `map`/`filter`/`reduce`, destructuring, `?.`, `??` e inmutabilidad (`structuredClone`).
  - `06. Arquitectura Interna y Asincronía`: V8, `libuv`, Event Loop, callbacks, promesas (`all`, `allSettled`, `race`) y `async/await`.
  - `07. Módulos Nativos y Archivos`: `node:fs/promises`, `node:path`, `node:os`, `node:process`, `node:console` y `node:timers/promises`.
  - `08. Eventos y Streams`: `EventEmitter` (`on`, `once`, `off`, `'error'`), `Readable`/`Writable` por *chunks* y `pipeline()`.
  - `09. Criptografía y Seguridad`: `randomUUID`, `randomBytes`, `SHA-256`, `HMAC`, `scrypt` con sal y `timingSafeEqual()`.
  - `10. Módulos en Node.js`: CommonJS (`require`/`module.exports`), ESM (`import`/`export`), resolución de rutas, `import()` dinámico y arquitectura por capas.

---

## 🛠️ Cómo Ejecutar en Local

1. Clona o descarga este repositorio.
2. Para explorar los módulos y documentación basta con abrir [index.html](./index.html) en tu navegador (los datos en `docs-data.js` permiten leer todas las guías sin servidor).
3. **Recomendado (para módulos con `Fetch`, `Ajax`, `Cache`, `Cookies` o `Service Workers`):** inicia un servidor HTTP local desde la carpeta raíz:
   - Con **VS Code**: extensión **Live Server** → *Open with Live Server* sobre `index.html`.
   - Con **Node.js**:
     ```powershell
     npx serve .
     ```
   - Con **Python**:
     ```powershell
     python -m http.server 8080
     ```
4. **Para ejecutar las prácticas de Node.js en terminal:**
   ```powershell
   node NODE/Fundamentos/index.js
   node NODE/Fundamentos/servidor.js
   node NODE/REPL/catalogo.js
   node NODE/Modulos/app.js
   ```
