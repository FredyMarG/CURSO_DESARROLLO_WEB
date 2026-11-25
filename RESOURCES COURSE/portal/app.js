// Activamos el modo estricto de JavaScript para evitar errores silenciosos y variables globales accidentales
"use strict"; // Activa el modo estricto de JavaScript

// Arreglo maestro que contiene todos los módulos, guías interactivas, ejercicios, proyectos y documentación del curso
const modules = [
  // --- SECCIÓN: NODE.JS (Backend, Entorno de Ejecución y APIs) ---
  {
    cat: "node", // Categoría Node.js
    title: "01. Introducción a Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Qué es Node.js, Frontend vs Backend, diferencias con el navegador, usos reales y primer script CLI.", // Descripción breve
    href: "NODE/Introduccion/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "02. Fundamentos de Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Ciclo Cliente-Servidor HTTP, npm, package.json, process.argv, node:http y API de bienvenida.", // Descripción breve
    href: "NODE/Fundamentos/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "03. Instalación y Entorno de Node.js", // Título visible en la tarjeta
    tag: "13 Slides", // Etiqueta de cantidad de diapositivas
    desc: "LTS vs Current, .msi vs winget, nvm-windows, PATH, PowerShell, node --watch y --env-file=.env.", // Descripción breve
    href: "NODE/Instalacion/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "04. REPL de Node.js", // Título visible en la tarjeta
    tag: "13 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Ciclo Read-Eval-Print-Loop, comandos .help/.save/.load/.editor, await directo y prototipo catálogo.", // Descripción breve
    href: "NODE/REPL/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "05. JavaScript Moderno para Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "ES6+: const/let y TDZ, arrow functions, map/filter/reduce, destructuring, ?. y ??, Set/Map y async/await.", // Descripción breve
    href: "NODE/JavaScriptModerno/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "06. Módulos en Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "CommonJS (require/module.exports), ESM (import/export), resolución de rutas y separación por capas.", // Descripción breve
    href: "NODE/Modulos/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "07. NPM y Gestión de Paquetes", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "package.json, SemVer (^ vs ~), dependencies vs devDependencies, package-lock.json, npm ci, npx y audit.", // Descripción breve
    href: "NODE/NPM/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "08. JSON en Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Características (RFC 8259), los 6 tipos válidos, JSON.parse/reviver, stringify/replacer/toJSON y NDJSON.", // Descripción breve
    href: "NODE/JSON/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "09. Arquitectura Interna y Asincronía", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "V8, Event Loop, Microtasks vs Macrotasks, callbacks, Promesas, async/await y fetch() con timeout.", // Descripción breve
    href: "NODE/Asincronia/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "10. Módulos Nativos y Archivos", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "APIs nativas: node:fs/promises, node:path, node:os, node:console, node:timers/promises y seguridad.", // Descripción breve
    href: "NODE/ArchivosNativos/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "11. Control del Proceso (node:process)", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "process.env y .env nativo, process.argv + util.parseArgs(), stdin/stdout/stderr, exitCode y SIGINT/SIGTERM.", // Descripción breve
    href: "NODE/Process/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "12. Eventos y Streams en Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "EventEmitter (on, once, off, 'error'), Readable/Writable/Transform por chunks, backpressure y pipeline().", // Descripción breve
    href: "NODE/EventosStreams/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "13. Criptografía y Seguridad", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "node:crypto: randomUUID, randomBytes, SHA-256, HMAC, scrypt con sal, AES-256-GCM y timingSafeEqual().", // Descripción breve
    href: "NODE/CryptoSeguridad/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "14. Servidores HTTP y APIs REST", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "node:http, new URL() + URLSearchParams, lectura de body JSON por chunks, códigos HTTP, CORS y fetch().", // Descripción breve
    href: "NODE/HttpApi/index.html", // Ruta relativa al módulo interactivo
  },
  {
    cat: "node", // Categoría Node.js
    title: "15. Testing Nativo (node:test)", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "node:test, node:assert/strict (equal, deepEqual, throws, rejects), describe/it, mkdtemp() y t.mock.fn().", // Descripción breve
    href: "NODE/Testing/index.html", // Ruta relativa al módulo interactivo
  },
  // Acceso directo a la documentación técnica de Node.js
  {
    cat: "node", // Categoría Node.js
    title: "Documentación Completa Node.js", // Título visible en la tarjeta
    tag: "15 Guías MD", // Etiqueta de guías Markdown
    desc: "Guías teóricas de los 15 módulos de Node.js, ejercicios y cheatsheets.", // Descripción breve
    href: "NODE/Documentacion/index.html", // Ruta relativa al lector de documentación
  },

  // --- SECCIÓN: JS MASTER LEVEL (19 Guías Interactivas de 11-12 diapositivas + Documentación) ---
  {
    cat: "master",
    title: "01. Modo Estricto",
    tag: "11 Slides",
    desc: "'use strict', ES Modules, seguridad y optimización.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html",
  },
  {
    cat: "master",
    title: "02. Operador Ternario",
    tag: "11 Slides",
    desc: "Expresiones condicionales, ?? Nullish Coalescing y legibilidad.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Operador Ternario/index.html",
  },
  {
    cat: "master",
    title: "03. Funciones Flecha",
    tag: "12 Slides",
    desc: "Sintaxis, ámbito léxico de this, closures y recursividad.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Funciones Flecha/index.html",
  },
  {
    cat: "master",
    title: "04. Prototipos",
    tag: "11 Slides",
    desc: "Prototype Chain, herencia prototípica y equivalencia con class.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Prototipos/index.html",
  },
  {
    cat: "master",
    title: "05. Memoization",
    tag: "12 Slides",
    desc: "Caché de funciones puras, Closures, Map/WeakMap y optimización O(n).",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Memoization/index.html",
  },
  {
    cat: "master",
    title: "06. Objeto Date",
    tag: "11 Slides",
    desc: "Fechas, horas y formateo moderno con Intl.DateTimeFormat.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Objeto Date/index.html",
  },
  {
    cat: "master",
    title: "07. Objeto Screen (window.screen)",
    tag: "11 Slides",
    desc: "Resolución total, availWidth/availHeight, colorDepth, orientation y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Objeto Screen/index.html",
  },
  {
    cat: "master",
    title: "08. Objeto Navigator",
    tag: "12 Slides",
    desc: "Interfaces BOM, red, hardware, storage y Clipboard API.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Navigator/index.html",
  },
  {
    cat: "master",
    title: "09. window.matchMedia()",
    tag: "12 Slides",
    desc: "Media Queries reactivas en JS y laboratorio de breakpoints.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Matchmedia/index.html",
  },
  {
    cat: "master",
    title: "10. Visibility Change",
    tag: "12 Slides",
    desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Visibility Change/index.html",
  },
  {
    cat: "master",
    title: "11. History API",
    tag: "11 Slides",
    desc: "pushState, replaceState, popstate y scrollRestoration.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Historial/index.html",
  },
  {
    cat: "master",
    title: "12. Geolocalización",
    tag: "11 Slides",
    desc: "getCurrentPosition(), watchPosition() y manejo de errores.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Geolocalization/index.html",
  },
  {
    cat: "master",
    title: "13. Drag & Drop",
    tag: "11 Slides",
    desc: "Eventos de arrastre, dataTransfer y archivos del escritorio.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Drag & Drop/index.html",
  },
  {
    cat: "master",
    title: "14. FileReader API",
    tag: "11 Slides",
    desc: "Lectura de texto, DataURL, ArrayBuffer y barras de carga.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/File Reader/index.html",
  },
  {
    cat: "master",
    title: "15. Canvas (HTML5 Canvas 2D)",
    tag: "11 Slides",
    desc: "Contexto 2D, fillRect/strokeRect, beginPath, arc, requestAnimationFrame y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Canvas/index.html",
  },
  {
    cat: "master",
    title: "16. Local Storage",
    tag: "11 Slides",
    desc: "Almacenamiento persistente, JSON y sincronización multi-pestaña.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Local Storage/index.html",
  },
  {
    cat: "master",
    title: "17. Cookies (document.cookie)",
    tag: "11 Slides",
    desc: "Creación, lectura, modificación, eliminación, encodeURIComponent, SameSite y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Cookies/index.html",
  },
  {
    cat: "master",
    title: "18. IndexedDB",
    tag: "12 Slides",
    desc: "Base NoSQL en el navegador, transacciones, índices y cursores.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/IndexedDB/index.html",
  },
  {
    cat: "master",
    title: "19. Intersection Observer",
    tag: "12 Slides",
    desc: "Lazy loading, scroll infinito y laboratorio interactivo real.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Intersection Observer/index.html",
  },
  {
    cat: "master",
    title: "20. APIs y Fetch",
    tag: "11 Slides",
    desc: "Consumo RESTful, fetch(), AbortController y Promise.all.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Apis/index.html",
  },
  {
    cat: "master",
    title: "21. Cache API (caches)",
    tag: "12 Slides",
    desc: "CacheStorage, put/match/delete, estrategias PWA y soporte offline.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Cache/index.html",
  },
  {
    cat: "master",
    title: "22. Notifications API",
    tag: "12 Slides",
    desc: "Permisos, alertas nativas del SO y Service Workers.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Notifications/index.html",
  },
  {
    cat: "master",
    title: "23. Web Workers",
    tag: "12 Slides",
    desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Web Workers/index.html",
  },
  {
    cat: "master",
    title: "24. Service Workers",
    tag: "12 Slides",
    desc: "Ciclo de vida, fetch offline, Cache API y postMessage().",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Service Workers/index.html",
  },
  {
    cat: "master",
    title: "Documentación Completa Master Level",
    tag: "23 Guías MD",
    desc: "Todas las guías teóricas, ejercicios y cheatsheets de Master Level (incluyendo Cookies y Objeto Screen).",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/DOCUMENTACION/index.html",
  },

// --- SECCIÓN: EJERCICIOS PRÁCTICOS (PROGRESIÓN: JUNIOR → MID LEVEL) ---
  // 01–11: Ejercicios Junior Level
  {
    cat: "ejercicios",
    title: "01. Helados y Precios",
    tag: "Junior",
    desc: "Condicionales y selección de productos según dinero disponible.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/1 Helados y Precios/index.html",
  },
  {
    cat: "ejercicios",
    title: "02. Fiesta y Entrada",
    tag: "Junior",
    desc: "Control de edad y horario con funciones y condicionales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/2 Fiesta y Entrada/index.html",
  },
  {
    cat: "ejercicios",
    title: "03. Control de Asistencia",
    tag: "Junior",
    desc: "Registro de asistencia con bucles y arreglos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/3 Asistencia/index.html",
  },
  {
    cat: "ejercicios",
    title: "04. Calculadora Básica",
    tag: "Junior",
    desc: "Operaciones aritméticas básicas mediante funciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/4 Calculadora Básica/index.html",
  },
  {
    cat: "ejercicios",
    title: "05. Celular Nuevo (POO)",
    tag: "Junior",
    desc: "Modelado de dispositivos con clases y métodos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/5 Celular Nuevo/index.html",
  },
  {
    cat: "ejercicios",
    title: "06. Apps Celular Nuevo",
    tag: "Junior",
    desc: "Simulación de descarga e instalación de aplicaciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/6 Apps Celular Nuevo/index.html",
  },
  {
    cat: "ejercicios",
    title: "07. Calculadora Avanzada",
    tag: "Junior",
    desc: "Potencias y raíces usando el objeto Math.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/7 Calculadora Avanzada/index.html",
  },
  {
    cat: "ejercicios",
    title: "08. Materias y Profesores",
    tag: "Junior",
    desc: "Búsqueda y filtrado sobre arreglos de datos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/8 Materias y Profesores/index.html",
  },
  {
    cat: "ejercicios",
    title: "09. Inscripción de Materias",
    tag: "Junior",
    desc: "Validación de cupos e inscripción dinámica.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/9 Inscripción de Materias/index.html",
  },
  {
    cat: "ejercicios",
    title: "10. Nota Final Consola",
    tag: "Junior",
    desc: "Cálculo de resultados y estilos en console.log.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/10 Nota Final Consola/index.html",
  },
  {
    cat: "ejercicios",
    title: "11. Ordenar Tareas",
    tag: "Junior",
    desc: "Planificación y agrupación de actividades diarias.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/11 Ordenar Tareas/index.html",
  },
  // 12–15: Ejercicios Mid Level
  {
    cat: "ejercicios",
    title: "12. Comprar Computador",
    tag: "Mid",
    desc: "Práctica de objetos, condiciones y presupuesto en pantalla.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/1 Comprar Computador/index.html",
  },
  {
    cat: "ejercicios",
    title: "13. Mostrar Datos Web",
    tag: "Mid",
    desc: "Renderizado dinámico de información en el DOM.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/2 Mostrar Datos Web/index.html",
  },
  {
    cat: "ejercicios",
    title: "14. Materia Pendiente",
    tag: "Mid",
    desc: "Validación de formularios y gestión de materias.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/3 Materia Pendiente/index.html",
  },
  {
    cat: "ejercicios",
    title: "15. Promedio de Notas",
    tag: "Mid",
    desc: "Cálculo y validación de promedios con manejo de errores.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/5 Promedio de Notas Corrección/index.html",
  },

  // --- SECCIÓN: PROYECTOS INTEGRADORES (PROGRESIÓN: HTML/CSS → JUNIOR → MID → MASTER) ---
  // 10: Proyecto Junior Level
  {
    cat: "proyectos",
    title: "14. La Llave Correcta",
    tag: "Proyecto Junior",
    desc: "Creación dinámica de tarjetas seleccionables en el DOM.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html",
  },
  // 11–13: Proyectos Mid Level
  {
    cat: "proyectos",
    title: "15. Recuperación por Docente",
    tag: "Proyecto Mid",
    desc: "Asignación y control de estado académico.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/4 Recuperacion de Materia por Docente/index.html",
  },
  {
    cat: "proyectos",
    title: "16. Notas de Cofla",
    tag: "Proyecto Mid",
    desc: "Promesas y asincronía simulando obtención de calificaciones.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/6 Notas de Cofla/index.html",
  },
  {
    cat: "proyectos",
    title: "17. Compañeros de Cofla",
    tag: "Proyecto Mid",
    desc: "Consumo asíncrono de datos con Fetch/Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/7 Compañeros de Cofla Htdocs/index.html",
  },
  // 14–20: Proyectos Master Level
  {
    cat: "proyectos",
    title: "18. Reloj Digital (Date)",
    tag: "Proyecto Master",
    desc: "Reloj digital en tiempo real con setInterval.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html",
  },
  {
    cat: "proyectos",
    title: "19. Idioma con LocalStorage",
    tag: "Proyecto Master",
    desc: "Selector bilingüe persistente con modal animado.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html",
  },
  {
    cat: "proyectos",
    title: "20. Drag & Drop File Reader",
    tag: "Proyecto Master",
    desc: "Carga de archivos con barra de progreso animada.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html",
  },
  {
    cat: "proyectos",
    title: "21. Texturizador Drag & Drop",
    tag: "Proyecto Master",
    desc: "Aplicación de texturas por arrastre con dataTransfer.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html",
  },
  {
    cat: "proyectos",
    title: "22. Galería Dinámica",
    tag: "Proyecto Master",
    desc: "Bento Grid interactivo con FileReader y Lightbox.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html",
  },
  {
    cat: "proyectos",
    title: "23. Lazy Load con IntersectionObserver",
    tag: "Proyecto Master",
    desc: "Carga progresiva de 45 publicaciones con animación al scroll.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html",
  },
  {
    cat: "proyectos",
    title: "24. CRUD con IndexedDB",
    tag: "Proyecto Master",
    desc: "Gestor persistente de nombres en IndexedDB.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html",
  },
  {
    cat: "proyectos",
    title: "25. Uso de Cookies (Consentimiento)",
    tag: "Proyecto Master",
    desc: "Modal interactivo de aceptación de cookies con expiración UTC y estado neón.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Uso de Cookies/index.html",
  },
  { // Ejercicio interactivo de pizarra 2D con HTML5 Canvas API
    cat: "proyectos",
    title: "26. Web Paint (Canvas 2D)",
    tag: "Proyecto Master",
    desc: "Pizarra interactiva con pincel, borrador, grosor, Deshacer (Ctrl+Z) y descarga PNG.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Web Paint/index.html",
  },
  { // Proyecto práctico de gestor de finanzas personales con Canvas y localStorage
    cat: "proyectos",
    title: "27. Finanzas APP",
    tag: "Proyecto JS",
    desc: "Control de ingresos y gastos con separador de miles en vivo, localStorage y gráfico Canvas.",
    href: "JAVASCRIPT/PROYECTOS/Finanzas APP/index.html",
  },
  { // Proyecto práctico de buscador de películas en vivo con OMDb API, Debounce y <dialog>
    cat: "proyectos",
    title: "28. Buscador de Películas",
    tag: "Proyecto JS",
    desc: "Buscador CineSearch con Debounce, fetch a OMDb API y modal nativo HTML5.",
    href: "JAVASCRIPT/PROYECTOS/Buscador de Peliculas/index.html",
  },
  { // Proyecto práctico de tablero Kanban con Drag & Drop nativo y localStorage
    cat: "proyectos",
    title: "29. Tablero Kanban",
    tag: "Proyecto JS",
    desc: "Organizador de tareas en 3 columnas con Drag & Drop nativo y persistencia localStorage.",
    href: "JAVASCRIPT/PROYECTOS/Tablero Kanban/index.html",
  },

  // --- SECCIÓN: JS MID LEVEL ---
  {
    cat: "mid",
    title: "01. Objeto Window",
    tag: "Mid Level",
    desc: "Explora el objeto global del navegador: abrir/cerrar ventanas, alertas, dimensiones y propiedades globales.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Window/index.html",
  },
  {
    cat: "mid",
    title: "02. Objetos Barprop",
    tag: "Mid Level",
    desc: "Inspecciona la visibilidad de barras del navegador (locationbar, menubar, scrollbars, toolbar).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Objetos Barprop/index.html",
  },
  {
    cat: "mid",
    title: "03. Objeto Location",
    tag: "Mid Level",
    desc: "Lee y manipula la URL actual del navegador mediante window.location (href, pathname, search, reload).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Location/index.html",
  },
  {
    cat: "mid",
    title: "04. Screen y Scroll",
    tag: "Mid Level",
    desc: "Consulta dimensiones físicas del monitor (window.screen) y controla el desplazamiento (scrollTo, scrollY).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Screen y Scroll/index.html",
  },
  {
    cat: "mid",
    title: "05. Resize y Move",
    tag: "Mid Level",
    desc: "Controla eventos de redimensionamiento (resize) y métodos de tamaño/posición de ventana.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Resize y Move/index.html",
  },
  {
    cat: "mid",
    title: "06. Eventos del DOM",
    tag: "Mid Level",
    desc: "Domina addEventListener(), propagación (Bubbling/Capturing), eventos de mouse, teclado e interfaz.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/index.html",
  },
  {
    cat: "mid",
    title: "07. Eventos: Handlers",
    tag: "Mid Level",
    desc: "Registro y remoción de escuchadores de eventos.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Handlers/index.html",
  },
  {
    cat: "mid",
    title: "08. Eventos: Event Flow",
    tag: "Mid Level",
    desc: "Propagación de eventos (Bubbling y Capturing).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Event Flow/index.html",
  },
  {
    cat: "mid",
    title: "09. Eventos de Mouse",
    tag: "Mid Level",
    desc: "Interacciones de clic, doble clic y movimiento.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Mouse/index.html",
  },
  {
    cat: "mid",
    title: "10. Eventos de Teclado",
    tag: "Mid Level",
    desc: "Captura de teclas con keydown, keyup y keypress.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Teclado/index.html",
  },
  {
    cat: "mid",
    title: "11. Eventos de Interfaz",
    tag: "Mid Level",
    desc: "Eventos load, resize, scroll y select.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Interfaz/index.html",
  },
  {
    cat: "mid",
    title: "12. Switch",
    tag: "Mid Level",
    desc: "Evaluación múltiple de casos con switch y break.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Switch/index.html",
  },
  {
    cat: "mid",
    title: "13. Try-Catch y Excepciones",
    tag: "Mid Level",
    desc: "Manejo robusto de errores en tiempo de ejecución.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Try-Catch/index.html",
  },
  {
    cat: "mid",
    title: "14. Temporizadores",
    tag: "Mid Level",
    desc: "Control del tiempo con setTimeout, setInterval y clear.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Temporizadores/index.html",
  },
  {
    cat: "mid",
    title: "15. Callbacks",
    tag: "Mid Level",
    desc: "Funciones de retorno y flujo asíncrono base.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Callbacks/index.html",
  },
  {
    cat: "mid",
    title: "16. Promesas",
    tag: "Mid Level",
    desc: "Estados pending, fulfilled, rejected y encadenamiento.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Promesas/index.html",
  },
  {
    cat: "mid",
    title: "17. Async y Await",
    tag: "Mid Level",
    desc: "Asincronía moderna legible con try/catch.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Async y Await/index.html",
  },
  {
    cat: "mid",
    title: "18. Datos Estructurados (JSON)",
    tag: "Mid Level",
    desc: "Serialización y parseo de objetos JSON.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html",
  },
  {
    cat: "mid",
    title: "19. Expresiones Regulares (RegExp)",
    tag: "14 Slides",
    desc: "Patrones RegExp, flags g/i/m/u, anclas ^/$, clases \\d/\\w/\\s, grupos nombrados y test()/match()/replace().",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Expresiones Regulares/index.html",
  },
  {
    cat: "mid",
    title: "20. Peticiones HTTP",
    tag: "Mid Level",
    desc: "Métodos, cabeceras y códigos de estado HTTP.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Peticiones HTTP/index.html",
  },
  {
    cat: "mid",
    title: "21. AJAX (XMLHttpRequest)",
    tag: "Mid Level",
    desc: "Realiza peticiones asíncronas sin recargar la página mediante XMLHttpRequest y maneja respuestas del servidor.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/index.html",
  },
  {
    cat: "mid",
    title: "22. AJAX (Editor)",
    tag: "Mid Level",
    desc: "Peticiones asíncronas clásicas con XMLHttpRequest.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/Ajax Editor/index.html",
  },
  {
    cat: "mid",
    title: "23. AJAX (Htdocs)",
    tag: "Mid Level",
    desc: "Práctica de AJAX en entorno de servidor local.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/Ajax Htdocs/index.html",
  },
  {
    cat: "mid",
    title: "24. Fetch API",
    tag: "Mid Level",
    desc: "Peticiones HTTP modernas en JavaScript.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Fetch/index.html",
  },
  {
    cat: "mid",
    title: "25. Librería Axios",
    tag: "Mid Level",
    desc: "Realiza peticiones HTTP simplificadas con transformación automática a JSON e interceptores usando Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/index.html",
  },
  {
    cat: "mid",
    title: "26. Librería Axios (Editor)",
    tag: "Mid Level",
    desc: "Cliente HTTP basado en Promesas con Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/Axios Editor/index.html",
  },
  {
    cat: "mid",
    title: "27. Axios vs Fetch (Htdocs)",
    tag: "Mid Level",
    desc: "Comparativa práctica entre Axios y Fetch.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/Axios-Fetch-Htdocs/index.html",
  },
  {
    cat: "mid",
    title: "28. Código Obsoleto",
    tag: "Mid Level",
    desc: "Patrones heredados y sus equivalentes actuales.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Codigo Obsoleto/index.html",
  },
  {
    cat: "mid",
    title: "29. Pestañas de DevTools",
    tag: "Mid Level",
    desc: "Domina Elements, Console, Sources, Network, Performance (Timeline) y Application para depurar como un profesional.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Pestañas DevTools/index.html",
  },
  {
    cat: "mid",
    title: "30. DevTools: Pestaña Application",
    tag: "Mid Level",
    desc: "Inspección de almacenamiento y caché en DevTools.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Pestañas DevTools/Application/index.html",
  },
  {
    cat: "mid",
    title: "Documentación Completa Mid Level",
    tag: "26 Guías MD",
    desc: "Eventos, Axios, Window, DevTools, HTTP y más.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/DOCUMENTACION/index.html",
  },

// --- SECCIÓN: JS JUNIOR LEVEL ---
  // Práctica de variables (var, let, const)
  {
    cat: "junior",
    title: "01. Variables",
    tag: "Junior Level",
    desc: "Declaración, alcance y tipos de datos básicos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Variables/index.html",
  },
  // Práctica de operadores aritméticos y lógicos
  {
    cat: "junior",
    title: "02. Operadores",
    tag: "Junior Level",
    desc: "Operadores de asignación, comparación y lógicos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Operadores/index.html",
  },
  // Práctica de concatenación y template literals
  {
    cat: "junior",
    title: "03. Concatenación",
    tag: "Junior Level",
    desc: "Unión de textos y uso de Template Strings.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Concatenacion/index.html",
  },
  // Práctica de estructuras condicionales if/else
  {
    cat: "junior",
    title: "04. Condicionales",
    tag: "Junior Level",
    desc: "Toma de decisiones con if, else if y else.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Condicionales/index.html",
  },
  // Práctica de arreglos y métodos fundamentales
  {
    cat: "junior",
    title: "05. Arrays y Métodos",
    tag: "Junior Level",
    desc: "Estructuras indexadas y métodos fundamentales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Arrays/index.html",
  },
  // Práctica de bucles while y do...while
  {
    cat: "junior",
    title: "06. Bucles (while / do-while)",
    tag: "Junior Level",
    desc: "Repetición controlada de instrucciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Bucles/index.html",
  },
  // Práctica de bucle for, for...in y for...of
  {
    cat: "junior",
    title: "07. Bucle For",
    tag: "Junior Level",
    desc: "Iteración clásica y recorridos sobre colecciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/For/index.html",
  },
  // Práctica de funciones declaradas y expresadas
  {
    cat: "junior",
    title: "08. Funciones",
    tag: "Junior Level",
    desc: "Parámetros, retorno de valores y reutilización.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Funciones/index.html",
  },
  // Práctica de Programación Orientada a Objetos en JS
  {
    cat: "junior",
    title: "09. POO (Programación Orientada a Objetos)",
    tag: "Junior Level",
    desc: "Clases, constructores, herencia y encapsulación.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/POO/index.html",
  },
  // Práctica de métodos de cadenas de texto
  {
    cat: "junior",
    title: "10. Cadenas (Métodos)",
    tag: "Junior Level",
    desc: "Transformación, búsqueda y corte de strings.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Cadenas(Metodos)/index.html",
  },
  // Práctica de funciones matemáticas con el objeto Math
  {
    cat: "junior",
    title: "11. Objeto Math",
    tag: "Junior Level",
    desc: "Redondeos, raíces, aleatorios y constantes.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Math/index.html",
  },
  // Práctica de depuración en consola
  {
    cat: "junior",
    title: "12. Console.log y Depuración",
    tag: "Junior Level",
    desc: "Métodos de consola para inspeccionar variables y tablas.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Console.log/index.html",
  },
  // Práctica de manipulación del árbol DOM
  {
    cat: "junior",
    title: "13. DOM (Document Object Model)",
    tag: "Junior Level",
    desc: "Selección, creación y manipulación de nodos HTML.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Dom/index.html",
  },
  // Acceso directo a la carpeta de las 14 guías Markdown de Junior Level
  {
    cat: "junior",
    title: "Documentación Completa Junior Level",
    tag: "14 Guías MD",
    desc: "Variables, Operadores, Cadenas, Math, Condicionales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: HTML Y CSS (Guías Dinámicas, Prácticas y Proyectos) ---
  // 0. Mega-Portal Unificado HTML5 y CSS3
  {
    cat: "htmlcss",
    title: "01. 🎨 Mega-Portal HTML5 y CSS3 (Ruta Completa)",
    tag: "Hub Completo",
    desc: "Mapa completo paso a paso con todos los temas, subtemas, guías de 10 slides, simuladores, proyectos y apuntes.",
    href: "HTML y CSS/index.html",
  },
  // 1. Guías Dinámicas Interactivas (10 Slides con Simulador, Quiz y Laboratorio)
  {
    cat: "htmlcss",
    title: "02. HTML Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Estructura base HTML5, títulos, párrafos, enlaces, imágenes, listas, probador de inputs, quiz y laboratorio.",
    href: "HTML y CSS/HTML BASICO/index.html",
  },
  {
    cat: "htmlcss",
    title: "03. HTML Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "HTML semántico, formularios avanzados, tablas, multimedia, lazy loading, inspector semántico, quiz y lab.",
    href: "HTML y CSS/HTML avanzado/index.html",
  },
  {
    cat: "htmlcss",
    title: "04. CSS Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Selectores, Box Model, simulador border-box, unidades de medida, colores, tipografía, sombras, quiz y lab.",
    href: "HTML y CSS/CSS BASICO/index.html",
  },
  {
    cat: "htmlcss",
    title: "05. CSS Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Cascada, especificidad, simulador position/z-index, pseudoclases, pseudoelementos, BEM, quiz y lab.",
    href: "HTML y CSS/CSS avanzado/index.html",
  },
  {
    cat: "htmlcss",
    title: "06. Formularios y Validación (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Etiquetas <form>, <label>, inputs HTML5, validación nativa, :valid/:invalid y FormData.",
    href: "HTML y CSS/Formularios/index.html",
  },
  {
    cat: "htmlcss",
    title: "07. Flexbox (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Eje principal y cruzado, simulador Flexbox en vivo, grow/shrink/basis, patrones reales, quiz y lab.",
    href: "HTML y CSS/Flexbox/index.html",
  },
  {
    cat: "htmlcss",
    title: "08. CSS Grid (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Unidades fr, repeat(), minmax(), simulador Grid en vivo, áreas, Subgrid, quiz y laboratorio.",
    href: "HTML y CSS/Grid/index.html",
  },
  {
    cat: "htmlcss",
    title: "09. Animaciones CSS (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Transiciones vs @keyframes, simulador de curvas cubic-bezier, rendimiento GPU 60 FPS, scroll, quiz y lab.",
    href: "HTML y CSS/Animaciones/index.html",
  },
  {
    cat: "htmlcss",
    title: "10. Funciones CSS Avanzadas (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Variables CSS, simulador clamp() y color-mix(), calc(), dvh, clip-path, backdrop-filter, quiz y lab.",
    href: "HTML y CSS/Funciones Avanzadas/index.html",
  },
  {
    cat: "htmlcss",
    title: "11. Responsive Design (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Mobile First, simulador de breakpoints, Media Queries, Container Queries, srcset/<picture>, quiz y lab.",
    href: "HTML y CSS/Responsive Design/index.html",
  },

  // 2. Prácticas por Temática — HTML Básico
  {
    cat: "htmlcss",
    title: "12. HTML Básico: Títulos y Párrafos",
    tag: "HTML Básico",
    desc: "Jerarquía de encabezados h1–h6 y formato de párrafos.",
    href: "HTML y CSS/HTML BASICO/Titulos y Parrafos/Titulos y parrafos.html",
  },
  {
    cat: "htmlcss",
    title: "13. HTML Básico: Listas",
    tag: "HTML Básico",
    desc: "Listas ordenadas <ol>, desordenadas <ul> y elementos <li>.",
    href: "HTML y CSS/HTML BASICO/Listas/listas.html",
  },
  {
    cat: "htmlcss",
    title: "14. HTML Básico: Enlaces",
    tag: "HTML Básico",
    desc: "Navegación con etiquetas <a>, rutas relativas y target.",
    href: "HTML y CSS/HTML BASICO/Enlaces/enlaces.html",
  },
  {
    cat: "htmlcss",
    title: "15. HTML Básico: Imágenes",
    tag: "HTML Básico",
    desc: "Inserción de imágenes con <img>, src y texto alternativo alt.",
    href: "HTML y CSS/HTML BASICO/Imagenes/img.html",
  },
  {
    cat: "htmlcss",
    title: "16. HTML Básico: Formularios",
    tag: "HTML Básico",
    desc: "Campos de entrada <input>, botones y envío básico.",
    href: "HTML y CSS/HTML BASICO/Formularios/formularios.html",
  },

  // 4. Prácticas de HTML Avanzado
  {
    cat: "htmlcss",
    title: "17. HTML Avanzado: HTML Semántico",
    tag: "HTML Avanzado",
    desc: "Uso de <header>, <nav>, <main>, <article>, <aside> y <footer>.",
    href: "HTML y CSS/HTML avanzado/HTML Semantico/HTML semantico.html",
  },
  {
    cat: "htmlcss",
    title: "18. HTML Avanzado: Accesibilidad (ARIA)",
    tag: "HTML Avanzado",
    desc: "Buenas prácticas de accesibilidad web y atributos ARIA.",
    href: "HTML y CSS/HTML avanzado/Accesibilidad/accesibilidad.html",
  },
  {
    cat: "htmlcss",
    title: "19. HTML Avanzado: Tablas",
    tag: "HTML Avanzado",
    desc: "Tablas semánticas con <thead>, <tbody>, <th> y colspan.",
    href: "HTML y CSS/HTML avanzado/Tablas/tablas.html",
  },
  {
    cat: "htmlcss",
    title: "20. HTML Avanzado: Audio y Video",
    tag: "HTML Avanzado",
    desc: "Reproducción multimedia nativa con <audio> y <video>.",
    href: "HTML y CSS/HTML avanzado/audio y video/audio y video.html",
  },
  {
    cat: "htmlcss",
    title: "21. HTML Avanzado: Lazy Loading",
    tag: "HTML Avanzado",
    desc: "Carga diferida de recursos con loading='lazy'.",
    href: "HTML y CSS/HTML avanzado/Lazy load/lazy.html",
  },
  {
    cat: "htmlcss",
    title: "22. HTML Avanzado: Select, Datalist y Option",
    tag: "HTML Avanzado",
    desc: "Listas desplegables y autocompletado nativo en formularios.",
    href: "HTML y CSS/HTML avanzado/Select Datalist y Option/selec,datalist y option.html",
  },
  {
    cat: "htmlcss",
    title: "23. HTML Avanzado: Fieldset y Legend",
    tag: "HTML Avanzado",
    desc: "Agrupación semántica de controles de formulario.",
    href: "HTML y CSS/HTML avanzado/Fieldset y Legend/fieldset y legend.html",
  },
  {
    cat: "htmlcss",
    title: "24. HTML Avanzado: Textarea y Labels",
    tag: "HTML Avanzado",
    desc: "Áreas de texto multilínea y vinculación accesible con <label>.",
    href: "HTML y CSS/HTML avanzado/Textarea y Labels/text-area y labels.html",
  },
  {
    cat: "htmlcss",
    title: "25. HTML Avanzado: Details y Summary",
    tag: "HTML Avanzado",
    desc: "Componentes desplegables nativos sin JavaScript.",
    href: "HTML y CSS/HTML avanzado/Details y Summary/details y summary.html",
  },
  {
    cat: "htmlcss",
    title: "26. HTML Avanzado: Enlaces Avanzados",
    tag: "HTML Avanzado",
    desc: "Descargas, anclas internas, tel:, mailto: y seguridad.",
    href: "HTML y CSS/HTML avanzado/Enlaces avanzados/enlaces avanzado.html",
  },
  {
    cat: "htmlcss",
    title: "27. HTML Avanzado: Metatags e Iconos",
    tag: "HTML Avanzado",
    desc: "Comentarios, favicons y meta etiquetas SEO/OpenGraph.",
    href: "HTML y CSS/HTML avanzado/Comentarios Metatags Iconos/comentarios-metatags-iconos.html",
  },
  {
    cat: "htmlcss",
    title: "28. HTML Avanzado: Emmet",
    tag: "HTML Avanzado",
    desc: "Abreviaturas rápidas para generar estructura HTML.",
    href: "HTML y CSS/HTML avanzado/Emmet/emmet.html",
  },
  {
    cat: "htmlcss",
    title: "29. HTML Avanzado: HTML Obsoleto",
    tag: "HTML Avanzado",
    desc: "Etiquetas deprecadas en HTML5 y sus reemplazos modernos.",
    href: "HTML y CSS/HTML avanzado/HTML Obsoleto/HTML obsoleto.html",
  },

  // 5. Prácticas de CSS Básico (integradas en CSS Básico: Guía Interactiva)
  // 6. Prácticas de CSS Avanzado
  {
    cat: "htmlcss",
    title: "30. CSS Avanzado: Selectores",
    tag: "CSS Avanzado",
    desc: "Selectores de atributo, combinadores y jerarquía.",
    href: "HTML y CSS/CSS avanzado/selectores/selectores.html",
  },
  {
    cat: "htmlcss",
    title: "31. CSS Avanzado: Herencia",
    tag: "CSS Avanzado",
    desc: "Propiedades heredables, inherit, initial y unset.",
    href: "HTML y CSS/CSS avanzado/Herencia/herencia.html",
  },
  {
    cat: "htmlcss",
    title: "32. CSS Avanzado: Display",
    tag: "CSS Avanzado",
    desc: "Comportamiento de cajas block, inline, inline-block y none.",
    href: "HTML y CSS/CSS avanzado/Display/display.html",
  },
  {
    cat: "htmlcss",
    title: "33. CSS Avanzado: Position Relative",
    tag: "CSS Avanzado",
    desc: "Desplazamiento relativo y contexto de referencia.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-relative.html",
  },
  {
    cat: "htmlcss",
    title: "34. CSS Avanzado: Position Absolute",
    tag: "CSS Avanzado",
    desc: "Posicionamiento absoluto respecto al ancestro posicionado.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-absolute.html",
  },
  {
    cat: "htmlcss",
    title: "35. CSS Avanzado: Position Fixed",
    tag: "CSS Avanzado",
    desc: "Elementos fijos respecto a la ventana del navegador.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-fixed.html",
  },
  {
    cat: "htmlcss",
    title: "36. CSS Avanzado: Position Sticky",
    tag: "CSS Avanzado",
    desc: "Encabezados pegajosos al hacer scroll.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-sticky.html",
  },
  {
    cat: "htmlcss",
    title: "37. CSS Avanzado: Pseudoclases",
    tag: "CSS Avanzado",
    desc: "Estados :hover, :focus, :nth-child() y :not().",
    href: "HTML y CSS/CSS avanzado/Pseudoclases/pseudoclases.html",
  },
  {
    cat: "htmlcss",
    title: "38. CSS Avanzado: Pseudoelementos",
    tag: "CSS Avanzado",
    desc: "Elementos virtuales ::before, ::after y ::first-letter.",
    href: "HTML y CSS/CSS avanzado/Pseudoelementos/pseudoelementos.html",
  },
  {
    cat: "htmlcss",
    title: "39. CSS Avanzado: Metodología BEM",
    tag: "CSS Avanzado",
    desc: "Nomenclatura Block__Element--Modifier para CSS escalable.",
    href: "HTML y CSS/CSS avanzado/BEM/bem.html",
  },
  {
    cat: "htmlcss",
    title: "40. CSS Avanzado: Object Fit & Position",
    tag: "CSS Avanzado",
    desc: "Recorte y encuadre de imágenes con cover y contain.",
    href: "HTML y CSS/CSS avanzado/Object Fit_Position/fit_position.html",
  },
  {
    cat: "htmlcss",
    title: "41. CSS Avanzado: Overflow",
    tag: "CSS Avanzado",
    desc: "Control de desbordamiento con hidden, scroll y auto.",
    href: "HTML y CSS/CSS avanzado/Overflow/overflow.html",
  },
  {
    cat: "htmlcss",
    title: "42. CSS Avanzado: Outline",
    tag: "CSS Avanzado",
    desc: "Contornos externos y foco accesible sin mover el layout.",
    href: "HTML y CSS/CSS avanzado/Outline/outline.html",
  },
  {
    cat: "htmlcss",
    title: "43. CSS Avanzado: Control de Flujo de Texto",
    tag: "CSS Avanzado",
    desc: "Ajuste de palabras largas, white-space y text-overflow.",
    href: "HTML y CSS/CSS avanzado/Control_flujo_texto/control_texto.html",
  },
  {
    cat: "htmlcss",
    title: "44. CSS Avanzado: Transition",
    tag: "CSS Avanzado",
    desc: "Transiciones suaves entre cambios de estado.",
    href: "HTML y CSS/CSS avanzado/Transition/transition.html",
  },

  // 7. Prácticas de Flexbox
  {
    cat: "htmlcss",
    title: "45. Flexbox: Flex Direction",
    tag: "Flexbox",
    desc: "Dirección del eje principal: row, row-reverse, column.",
    href: "HTML y CSS/Flexbox/Flex_Direction/direction.html",
  },
  {
    cat: "htmlcss",
    title: "46. Flexbox: Alineación",
    tag: "Flexbox",
    desc: "Distribución con justify-content y align-items.",
    href: "HTML y CSS/Flexbox/Alineacion/alineacion.html",
  },
  {
    cat: "htmlcss",
    title: "47. Flexbox: Wrap y Flow",
    tag: "Flexbox",
    desc: "Saltos de línea automáticos con flex-wrap y flex-flow.",
    href: "HTML y CSS/Flexbox/Wrap y Flow/wrap_flow.html",
  },
  {
    cat: "htmlcss",
    title: "48. Flexbox: Grow, Shrink y Basis",
    tag: "Flexbox",
    desc: "Crecimiento, encogimiento y tamaño base de ítems flex.",
    href: "HTML y CSS/Flexbox/Grow,Shrink y Basis/grow.html",
  },
  {
    cat: "htmlcss",
    title: "49. Flexbox: Order",
    tag: "Flexbox",
    desc: "Reordenamiento visual de elementos flex sin tocar HTML.",
    href: "HTML y CSS/Flexbox/Order/order.html",
  },
  {
    cat: "htmlcss",
    title: "50. Flexbox: Align Self",
    tag: "Flexbox",
    desc: "Alineación individual de un hijo en el eje transversal.",
    href: "HTML y CSS/Flexbox/Align Self/align.html",
  },
  {
    cat: "htmlcss",
    title: "51. Flexbox: Layout Completo",
    tag: "Flexbox",
    desc: "Maquetación práctica de interfaz usando Flexbox.",
    href: "HTML y CSS/Flexbox/Layout/layout.html",
  },

  // 8. Prácticas de CSS Grid
  {
    cat: "htmlcss",
    title: "52. Grid: Principios",
    tag: "CSS Grid",
    desc: "Creación de cuadrículas con display: grid, filas y columnas.",
    href: "HTML y CSS/Grid/Principios/grid.html",
  },
  {
    cat: "htmlcss",
    title: "53. Grid: Auto y FR",
    tag: "CSS Grid",
    desc: "Reparto proporcional del espacio libre con la unidad fr.",
    href: "HTML y CSS/Grid/Auto y FR/auto.html",
  },
  {
    cat: "htmlcss",
    title: "54. Grid: Repeat",
    tag: "CSS Grid",
    desc: "Definición compacta de pistas repetitivas con repeat().",
    href: "HTML y CSS/Grid/Repeat/repeat.html",
  },
  {
    cat: "htmlcss",
    title: "55. Grid: Gap",
    tag: "CSS Grid",
    desc: "Separación entre filas y columnas sin márgenes extras.",
    href: "HTML y CSS/Grid/Gap/gap.html",
  },
  {
    cat: "htmlcss",
    title: "56. Grid: Row y Column",
    tag: "CSS Grid",
    desc: "Expansión de celdas con grid-column, grid-row y span.",
    href: "HTML y CSS/Grid/Row-Column/row-column.html",
  },
  {
    cat: "htmlcss",
    title: "57. Grid: Áreas (Template Areas)",
    tag: "CSS Grid",
    desc: "Maquetación visual nombrando áreas con grid-template-areas.",
    href: "HTML y CSS/Grid/Area/area.html",
  },
  {
    cat: "htmlcss",
    title: "58. Grid: Alineación",
    tag: "CSS Grid",
    desc: "Alineación de ítems y pistas con place-items y place-content.",
    href: "HTML y CSS/Grid/Alineacion/alineacion.html",
  },
  {
    cat: "htmlcss",
    title: "59. Grid: Explícito e Implícito",
    tag: "CSS Grid",
    desc: "Control de pistas automáticas con grid-auto-rows y flow.",
    href: "HTML y CSS/Grid/Grid Explicito e Implicito/exp-imp.html",
  },
  {
    cat: "htmlcss",
    title: "60. Grid: Dense",
    tag: "CSS Grid",
    desc: "Relleno automático de huecos con grid-auto-flow: dense.",
    href: "HTML y CSS/Grid/Dense/dense.html",
  },
  {
    cat: "htmlcss",
    title: "61. Grid: Dinámico (Responsive)",
    tag: "CSS Grid",
    desc: "Grillas adaptables con auto-fit, auto-fill y minmax().",
    href: "HTML y CSS/Grid/Dinamico(Responsive)/dinamico.html",
  },
  {
    cat: "htmlcss",
    title: "62. Grid: Subgrid",
    tag: "CSS Grid",
    desc: "Alineación de hijos anidados con la cuadrícula del padre.",
    href: "HTML y CSS/Grid/Subgrid/subgrid.html",
  },

  // 9. Prácticas de Animaciones
  {
    cat: "htmlcss",
    title: "63. Animaciones: Keyframes Base",
    tag: "Animaciones",
    desc: "Creación de animaciones declarativas con @keyframes.",
    href: "HTML y CSS/Animaciones/Animaciones/animaciones.html",
  },
  {
    cat: "htmlcss",
    title: "64. Animaciones: Botones Animados",
    tag: "Animaciones",
    desc: "Microinteracciones y efectos hover en botones.",
    href: "HTML y CSS/Animaciones/Botones Animados/botones.html",
  },
  {
    cat: "htmlcss",
    title: "65. Animaciones: Texto Animado",
    tag: "Animaciones",
    desc: "Efectos de entrada, escritura y degradados en texto.",
    href: "HTML y CSS/Animaciones/Texto/texto.html",
  },
  {
    cat: "htmlcss",
    title: "66. Animaciones: Transiciones (Repaso)",
    tag: "Animaciones",
    desc: "Repaso práctico de timing-functions y transiciones.",
    href: "HTML y CSS/Animaciones/Transiciones (Repaso)/transiciones.html",
  },
  {
    cat: "htmlcss",
    title: "67. Animaciones: Scroll Container",
    tag: "Animaciones",
    desc: "Animaciones vinculadas al progreso de scroll del contenedor.",
    href: "HTML y CSS/Animaciones/Scroll/Scroll Container/scroll.html",
  },
  {
    cat: "htmlcss",
    title: "68. Animaciones: Scroll View",
    tag: "Animaciones",
    desc: "Animaciones activadas al entrar en el viewport con view().",
    href: "HTML y CSS/Animaciones/Scroll/View/view.html",
  },

  // 10. Prácticas de Funciones Avanzadas
  {
    cat: "htmlcss",
    title: "69. Funciones Avanzadas: Variables CSS",
    tag: "CSS Moderno",
    desc: "Custom properties (--var) y temas dinámicos.",
    href: "HTML y CSS/Funciones Avanzadas/Variables/variables.html",
  },
  {
    cat: "htmlcss",
    title: "70. Funciones Avanzadas: Calc()",
    tag: "CSS Moderno",
    desc: "Operaciones matemáticas mezclando unidades en CSS.",
    href: "HTML y CSS/Funciones Avanzadas/Calc/calc.html",
  },
  {
    cat: "htmlcss",
    title: "71. Funciones Avanzadas: Min, Max y Clamp",
    tag: "CSS Moderno",
    desc: "Dimensiones y tipografías fluidas con límites seguros.",
    href: "HTML y CSS/Funciones Avanzadas/Max Min Clamp/max-min.html",
  },
  {
    cat: "htmlcss",
    title: "72. Funciones Avanzadas: Unidades del Viewport",
    tag: "CSS Moderno",
    desc: "Uso de vw, vh, dvh, svh y lvh en pantallas modernas.",
    href: "HTML y CSS/Funciones Avanzadas/Unidades del Viewport/unidades.html",
  },
  {
    cat: "htmlcss",
    title: "73. Funciones Avanzadas: Color Mix",
    tag: "CSS Moderno",
    desc: "Mezcla nativa de colores en CSS con color-mix().",
    href: "HTML y CSS/Funciones Avanzadas/Color MIx/color.html",
  },
  {
    cat: "htmlcss",
    title: "74. Funciones Avanzadas: Filter y Backdrop",
    tag: "CSS Moderno",
    desc: "Efectos blur, desenfoque de fondo y glassmorphism.",
    href: "HTML y CSS/Funciones Avanzadas/Filter y Backdrop/filter.html",
  },
  {
    cat: "htmlcss",
    title: "75. Funciones Avanzadas: Clip Path",
    tag: "CSS Moderno",
    desc: "Recortes poligonales, círculos y máscaras geométricas.",
    href: "HTML y CSS/Funciones Avanzadas/Clip Path/clip.html",
  },
  {
    cat: "htmlcss",
    title: "76. Funciones Avanzadas: Transform",
    tag: "CSS Moderno",
    desc: "Traslación, rotación, escala e inclinación 2D/3D.",
    href: "HTML y CSS/Funciones Avanzadas/Transform/transform.html",
  },
  {
    cat: "htmlcss",
    title: "77. Funciones Avanzadas: Initial Letter",
    tag: "CSS Moderno",
    desc: "Letras capitales estilo editorial con initial-letter.",
    href: "HTML y CSS/Funciones Avanzadas/Initial Letter/initial.html",
  },
  {
    cat: "htmlcss",
    title: "78. Funciones Avanzadas: Scroll",
    tag: "CSS Moderno",
    desc: "Comportamiento de scroll suave y scroll-snap.",
    href: "HTML y CSS/Funciones Avanzadas/Scroll/scroll.html",
  },

  // 11. Prácticas de Responsive Design
  {
    cat: "htmlcss",
    title: "79. Responsive: Mobile Design",
    tag: "Responsive",
    desc: "Principios de diseño enfocado en dispositivos móviles.",
    href: "HTML y CSS/Responsive Design/Mobile Design/mobile.html",
  },
  {
    cat: "htmlcss",
    title: "80. Responsive: Media Queries",
    tag: "Responsive",
    desc: "Puntos de quiebre con @media (min-width / max-width).",
    href: "HTML y CSS/Responsive Design/Media Queries/mediaq.html",
  },
  {
    cat: "htmlcss",
    title: "81. Responsive: Container Queries",
    tag: "Responsive",
    desc: "Componentes adaptables al tamaño de su contenedor padre.",
    href: "HTML y CSS/Responsive Design/Container Queries/container.html",
  },
  {
    cat: "htmlcss",
    title: "82. Responsive: Feature Queries",
    tag: "Responsive",
    desc: "Detección de soporte CSS moderno con @supports.",
    href: "HTML y CSS/Responsive Design/Feature Queries/features.html",
  },
  {
    cat: "htmlcss",
    title: "83. Responsive: Bloques Flexibles",
    tag: "Responsive",
    desc: "Contenedores fluidos que se adaptan al ancho disponible.",
    href: "HTML y CSS/Responsive Design/Bloques Flexibles/bloques_flexibles.html",
  },
  {
    cat: "htmlcss",
    title: "85. Responsive: Multimedia Flexible",
    tag: "Responsive",
    desc: "Imágenes y videos fluidos sin desbordar la pantalla.",
    href: "HTML y CSS/Responsive Design/Multimedia Flexible/multimedia.html",
  },
  {
    cat: "htmlcss",
    title: "86. Responsive: Picture, Source y Media",
    tag: "Responsive",
    desc: "Dirección de arte y formatos WebP con <picture>.",
    href: "HTML y CSS/Responsive Design/Picture,Source,Media/picture.html",
  },
  {
    cat: "htmlcss",
    title: "87. Responsive: Srcset y Sizes",
    tag: "Responsive",
    desc: "Entrega de imágenes óptimas según resolución y tamaño.",
    href: "HTML y CSS/Responsive Design/Srcset y Sizes/src-szs.html",
  },
  {
    cat: "htmlcss",
    title: "88. Documentación Completa HTML y CSS",
    tag: "9 Guías MD",
    desc: "Lector interactivo de apuntes: HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones y Hosting.",
    href: "HTML y CSS/Documentacion/index.html",
  },

  // 01–09: Proyectos HTML y CSS (al inicio de Proyectos)
  {
    cat: "proyectos",
    title: "00. Proyectos HTML y CSS (Exhibición)",
    tag: "Proyecto",
    desc: "Exhibición visual de los 11 proyectos prácticos de HTML5 y CSS3.",
    href: "HTML y CSS/PROYECTOS/index.html",
  },
  {
    cat: "proyectos",
    title: "01. Exhibición de Proyectos JS",
    tag: "Proyecto",
    desc: "Exhibición visual de las 16 aplicaciones y proyectos prácticos de JavaScript.",
    href: "JAVASCRIPT/PROYECTOS/index.html",
  },
  {
    cat: "proyectos",
    title: "02. Exhibición de Proyectos Node.js",
    tag: "Proyecto Node.js",
    desc: "Exhibición del proyecto integrador de Node.js nativo: API HTTP, persistencia JSON, NDJSON y testing.",
    href: "NODE/Proyectos/index.html",
  },
  {
    cat: "proyectos",
    title: "03. Accordion (Summary)",
    tag: "Proyecto",
    desc: "Acordeón semántico nativo usando <details> y <summary>.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/SUMMARY-DETAILS/index.html",
  },
  {
    cat: "proyectos",
    title: "04. Accordion Menu (Divs)",
    tag: "Proyecto",
    desc: "Acordeón interactivo construido con contenedores div.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/DIVS/index.html",
  },
  {
    cat: "proyectos",
    title: "05. Chatbox",
    tag: "Proyecto",
    desc: "Interfaz de mensajería moderna con Flexbox y burbujas.",
    href: "HTML y CSS/PROYECTOS/CHATBOX/index.html",
  },
  {
    cat: "proyectos",
    title: "06. Flipper Card 3D",
    tag: "Proyecto",
    desc: "Efecto de rotación 3D con perspectiva CSS.",
    href: "HTML y CSS/PROYECTOS/FLIPPER CARD/index.html",
  },
  {
    cat: "proyectos",
    title: "07. Tarjeta de Presentación",
    tag: "Proyecto",
    desc: "Maquetación de tarjeta de perfil con Box Model, sombras, border-radius: 50% y variantes de color.",
    href: "HTML y CSS/CSS BASICO/Ejercicios/Tarjeta de presentacion/index.html",
  },
  {
    cat: "proyectos",
    title: "08. One View Page",
    tag: "Proyecto",
    desc: "Maquetación de pantalla completa con diseño limpio.",
    href: "HTML y CSS/PROYECTOS/ONE VIEW PAGE/index.html",
  },
  {
    cat: "proyectos",
    title: "09. Sidebar Menu",
    tag: "Proyecto",
    desc: "Barra de navegación lateral adaptable con transiciones.",
    href: "HTML y CSS/PROYECTOS/SIDEBAR MENU/index.html",
  },
  {
    cat: "proyectos",
    title: "10. Web Page",
    tag: "Proyecto",
    desc: "Sitio web completo estructurado con Grid y Flexbox.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE/index.html",
  },
  {
    cat: "proyectos",
    title: "11. Web Page Animations",
    tag: "Proyecto",
    desc: "Transiciones y @keyframes aplicados a una landing page.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE ANIMATIONS/index.html",
  },
  {
    cat: "proyectos",
    title: "12. Ventana Modal (<dialog> + BEM)",
    tag: "Proyecto",
    desc: "Construcción de una ventana modal accesible con <dialog>, position y metodología BEM.",
    href: "HTML y CSS/CSS avanzado/Ejercicios/Ventana Modal/modal.html",
  },
  {
    cat: "proyectos",
    title: "13. Holy Grail Layout",
    tag: "Proyecto",
    desc: "Estructura clásica de cabecera, 3 columnas fluidas y pie de página con CSS Grid.",
    href: "HTML y CSS/Responsive Design/Holi Grail/holigrail.html",
  },
  {
    cat: "proyectos",
    title: "30. Gestor de Tareas (Node.js)",
    tag: "Proyecto Node.js",
    desc: "Interfaz web + API HTTP nativa (node:http), persistencia JSON, auditoría NDJSON y EventEmitter.",
    href: "NODE/Proyectos/Tareas/public/index.html",
  },
];

// Iconos oficiales tomados de Flaticon (HTML5, CSS3, JavaScript y Node.js) con carga diferida
const TECH_ICONS = {
  html: '<span class="tech-icon" aria-hidden="true"><img loading="lazy" decoding="async" src="https://cdn-icons-png.flaticon.com/512/174/174854.png" alt=""></span>',
  css: '<span class="tech-icon" aria-hidden="true"><img loading="lazy" decoding="async" src="https://cdn-icons-png.flaticon.com/512/732/732190.png" alt=""></span>',
  js: '<span class="tech-icon" aria-hidden="true"><img loading="lazy" decoding="async" src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png" alt=""></span>',
  node: '<span class="tech-icon" aria-hidden="true"><img loading="lazy" decoding="async" src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png" alt=""></span>',
};

// Función auxiliar que determina qué icono de tecnología corresponde a cada tarjeta del portal
function getCardTechIcon(item) { // Define función reutilizable
  // Si pertenece a Node.js o apunta a la carpeta NODE/, usamos el icono oficial de Node.js
  if (item.cat === "node" || item.href.startsWith("NODE/")) return TECH_ICONS.node; // Evalúa condición lógica
  // Si pertenece a cualquier nivel de JavaScript o apunta a JAVASCRIPT/, usamos el icono oficial JS
  if (item.cat === "master" || item.cat === "mid" || item.cat === "junior" || item.href.startsWith("JAVASCRIPT/")) return TECH_ICONS.js; // Evalúa condición lógica
  // Si es un proyecto de HTML y CSS, mostramos ambos iconos (HTML5 y CSS3) juntos
  if (item.cat === "proyectos" && item.href.startsWith("HTML y CSS/")) return TECH_ICONS.html + TECH_ICONS.css; // Evalúa condición lógica
  // Si el módulo es específicamente de HTML, usamos el icono naranja de HTML5
  if (/html/i.test(item.title) && !/css/i.test(item.title)) return TECH_ICONS.html; // Evalúa condición lógica
  // Si es un módulo de CSS, Flexbox, Grid, Animaciones, Responsive o Funciones Avanzadas, usamos el icono azul CSS3
  if (item.cat === "htmlcss" || item.cat === "proyectos") return TECH_ICONS.css; // Evalúa condición lógica
  // Respaldo por defecto
  return ""; // Retorna el resultado de la función
}

// Función auxiliar que asigna un icono temático acorde al contenido de cada ejercicio o proyecto
function getTopicIcon(item) { // Define función reutilizable
  // Solo aplicamos icono temático adicional en ejercicios y proyectos
  if (item.cat !== "ejercicios" && item.cat !== "proyectos") return ""; // Evalúa condición lógica
  // Normalizamos el título a minúsculas para comparar palabras clave
  const t = item.title.toLowerCase(); // Declara e inicializa variable local
  if (t.includes("helado")) return "🍦"; // Helados y Precios
  if (t.includes("fiesta")) return "🎉"; // Fiesta y Entrada
  if (t.includes("asistencia")) return "📋"; // Control de Asistencia
  if (t.includes("calculadora")) return "🧮"; // Calculadora Básica / Avanzada
  if (t.includes("celular")) return "📱"; // Celular Nuevo / Apps Celular
  if (t.includes("materia") || t.includes("inscripción") || t.includes("recuperación")) return "📚"; // Materias / Inscripción / Recuperación
  if (t.includes("nota") || t.includes("promedio")) return "🎓"; // Nota Final / Promedio / Notas de Cofla
  if (t.includes("tareas")) return "✅"; // Ordenar Tareas
  if (t.includes("computador")) return "💻"; // Comprar Computador
  if (t.includes("datos web")) return "🌐"; // Mostrar Datos Web
  if (t.includes("llave")) return "🔑"; // La Llave Correcta
  if (t.includes("compañeros")) return "👥"; // Compañeros de Cofla
  if (t.includes("reloj")) return "⏰"; // Reloj Digital
  if (t.includes("idioma")) return "🌍"; // Idioma con LocalStorage
  if (t.includes("drag") || t.includes("texturizador")) return "🖱️"; // Drag & Drop / Texturizador
  if (t.includes("galería") || t.includes("lazy")) return "🖼️"; // Galería Dinámica / Lazy Load
  if (t.includes("indexeddb")) return "🗄️"; // CRUD con IndexedDB
  if (t.includes("cookies")) return "🍪"; // Uso de Cookies
  if (t.includes("paint")) return "🎨"; // Web Paint
  if (t.includes("finanzas")) return "💰"; // Finanzas APP
  if (t.includes("películas")) return "🎬"; // Buscador de Películas
  if (t.includes("kanban")) return "🗂️"; // Tablero Kanban
  if (t.includes("accordion")) return "📂"; // Accordion Menu
  if (t.includes("chatbox")) return "💬"; // Chatbox
  if (t.includes("flipper")) return "🃏"; // Flipper Card 3D
  if (t.includes("one view")) return "📄"; // One View Page
  if (t.includes("sidebar")) return "📑"; // Sidebar Menu
  if (t.includes("animations")) return "✨"; // Web Page Animations
  if (t.includes("web page")) return "🖥️"; // Web Page
  if (t.includes("proyectos html")) return "🧩"; // Proyectos HTML y CSS (Guía)
  // Icono genérico por defecto si no coincide ninguna palabra clave
  return "⚡"; // Retorna icono por defecto
}

// Diccionario que asigna un título legible con su icono oficial a cada categoría del portal
const titles = {
  // Encabezado para Node.js con hexágono verde N
  node: `${TECH_ICONS.node} Node.js — Backend y Entorno de Ejecución`,
  // Encabezado para Master Level con icono oficial JS
  master: `${TECH_ICONS.js} JavaScript Master Level — Guías Interactivas`,
  // Encabezado para Ejercicios
  ejercicios: "🧪 Ejercicios Prácticos Interactivos (Todos los Niveles)",
  // Encabezado para Mid Level con icono oficial JS
  mid: `${TECH_ICONS.js} JavaScript Mid Level`,
  // Encabezado para Junior Level con icono oficial JS
  junior: `${TECH_ICONS.js} JavaScript Junior Level`,
  // Encabezado para HTML y CSS con iconos oficiales H y CSS
  htmlcss: `${TECH_ICONS.html}${TECH_ICONS.css} HTML5 y CSS3`,
  // Encabezado para Proyectos Integradores
  proyectos: `${TECH_ICONS.html}${TECH_ICONS.css}${TECH_ICONS.js} Proyectos Integradores — HTML/CSS, JavaScript y Node.js`,
};

// Referencia al contenedor principal donde se inyectan las secciones y tarjetas
const portal = document.getElementById("portalContent"); // Declara e inicializa variable local
// Referencia al campo de búsqueda en tiempo real
const searchInput = document.getElementById("searchInput"); // Declara e inicializa variable local
// Colección de todos los botones de filtro por categoría
const filterBtns = document.querySelectorAll(".filter-btn"); // Declara e inicializa variable local
// Variable que almacena el filtro de categoría seleccionado actualmente (soporta ?filter=proyectos en la URL)
const urlFilter = new URLSearchParams(window.location.search).get("filter"); // Lee parámetro de filtro desde la URL
let activeFilter = urlFilter && ["all", "htmlcss", "junior", "mid", "master", "node", "ejercicios", "proyectos"].includes(urlFilter) ? urlFilter : "all"; // Declara e inicializa variable local
let projectSubFilter = "all"; // Subfiltro interno de la sección Proyectos (all, htmlcss, js, node)

// Si la URL trajo un filtro válido, sincronizamos el botón activo en la barra de herramientas
if (activeFilter !== "all") { // Evalúa condición lógica
  filterBtns.forEach((b) => b.classList.toggle("active", b.dataset.filter === activeFilter)); // Actualiza botón activo
}

// Función principal encargada de filtrar y renderizar dinámicamente el catálogo en el DOM
function render() { // Define función reutilizable
  // Obtenemos el texto buscado sin espacios sobrantes y en minúsculas para comparación insensible a mayúsculas
  const q = searchInput.value.trim().toLowerCase(); // Declara e inicializa variable local
  // Limpiamos el contenido previo del portal antes de volver a dibujar
  portal.innerHTML = ""; // Actualiza contenido en el DOM

  // Función auxiliar que indica si un proyecto pertenece al filtro de nivel activo (JS, Node o HTML/CSS)
  const projectMatchesFilter = (m, filter) => {
    if (m.cat !== "proyectos") return false; // Solo aplica a proyectos
    if (filter === "node") return m.href.startsWith("NODE/"); // Proyectos de Node.js
    if (filter === "junior") return m.href.includes("JAVASCRIPT JUNIOR LEVEL"); // Proyectos de JS Junior
    if (filter === "mid") return m.href.includes("JAVASCRIPT MID LEVEL"); // Proyectos de JS Mid
    if (filter === "master") return m.href.includes("JAVASCRIPT MASTER LEVEL") || m.href.startsWith("JAVASCRIPT/PROYECTOS/"); // Proyectos de JS Master y JS general
    if (filter === "htmlcss") return m.href.startsWith("HTML y CSS/"); // Proyectos de HTML y CSS
    if (filter === "js") return m.href.startsWith("JAVASCRIPT/"); // Proyectos de JavaScript (todos los niveles)
    return false; // Por defecto no coincide
  };

  // Leemos una única vez el progreso guardado en localStorage antes de recorrer categorías
  let progressMap = {}; // Declara e inicializa variable local
  try { progressMap = JSON.parse(localStorage.getItem("curso_web_progress") || "{}"); } catch (_) {}
  renderGlobalProgress(progressMap);
  // Fragmento principal para insertar todas las secciones en una sola operación DOM
  const portalFrag = document.createDocumentFragment(); // Crea DocumentFragment para minimizar reflows
  // Guarda el ámbito activo ('htmlcss', 'js', 'node' o 'all') para respetar filtros al navegar entre proyectos
  let projectScope = "all";
  if (activeFilter === "htmlcss" || (activeFilter === "proyectos" && projectSubFilter === "htmlcss")) projectScope = "htmlcss";
  else if (["junior", "mid", "master"].includes(activeFilter) || (activeFilter === "proyectos" && projectSubFilter === "js")) projectScope = "js";
  else if (activeFilter === "node" || (activeFilter === "proyectos" && projectSubFilter === "node")) projectScope = "node";
  try { sessionStorage.setItem("cursoProjectScope", projectScope); } catch (_) {}

  // Definimos el orden progresivo del curso (HTML/CSS → JS Junior → JS Mid → JS Master → Node.js → Ejercicios → Proyectos)
  const order = ["htmlcss", "junior", "mid", "master", "node", "ejercicios", "proyectos"]; // Declara e inicializa variable local
  // Recorremos cada categoría en el orden establecido
  order.forEach((cat) => {
    // Permitimos mostrar también la sección de proyectos del nivel cuando el usuario filtra por JS, Node o HTML/CSS
    const isLevelProjects = activeFilter !== "all" && cat === "proyectos" && ["htmlcss", "junior", "mid", "master", "node"].includes(activeFilter); // Declara e inicializa variable local
    // Si hay un filtro activo distinto de 'all' y no coincide con esta categoría (ni es proyectos del nivel), la omitimos
    if (activeFilter !== "all" && activeFilter !== cat && !isLevelProjects) return; // Evalúa condición lógica
    // Filtramos los módulos que pertenecen a esta categoría y coinciden con la búsqueda
    const items = modules.filter(
      (m) =>
        (isLevelProjects ? projectMatchesFilter(m, activeFilter) : (m.cat === cat && (cat !== "proyectos" || projectSubFilter === "all" || projectMatchesFilter(m, projectSubFilter)))) &&
        (m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.tag.toLowerCase().includes(q) ||
          m.href.toLowerCase().includes(q)),
    );
    // Si ningún módulo coincide en esta categoría, no creamos sección vacía
    if (items.length === 0) return; // Evalúa condición lógica

    // Ordena numéricamente Ejercicios (01–15) y Proyectos (01–20) según el avance del curso
    if (cat === "ejercicios" || cat === "proyectos") { // Evalúa condición lógica
      items.sort((a, b) => parseInt(a.title, 10) - parseInt(b.title, 10));
    }

    // Creamos el elemento <section> contenedor de la categoría
    const sec = document.createElement("section"); // Declara e inicializa variable local
    // Asignamos la clase CSS de sección de curso
    sec.className = "course-section";
    const catDone = items.filter((it) => progressMap[it.href]?.completed).length; // Declara e inicializa variable local
    const catDoneTag = catDone > 0 ? ` <span class="tag">${catDone}/${items.length} ✓</span>` : ""; // Declara e inicializa variable local
    sec.innerHTML = `<h2 class="course-title">${titles[cat]} <span class="tag">${items.length}</span>${catDoneTag}</h2>`; // Actualiza contenido en el DOM

    // Barra de subfiltros exclusiva para la sección de Proyectos (Todos, HTML y CSS, JavaScript, Node.js)
    if (cat === "proyectos" && !isLevelProjects) { // Evalúa condición lógica
      const subBar = document.createElement("div"); // Declara e inicializa variable local
      subBar.className = "filters proj-subfilters";
      subBar.style.marginBottom = "16px";
      const subOpts = [
        { id: "all", label: "Todos" },
        { id: "htmlcss", label: "HTML y CSS" },
        { id: "js", label: "JavaScript" },
        { id: "node", label: "Node.js" },
      ];
      subOpts.forEach((opt) => {
        const btn = document.createElement("button"); // Declara e inicializa variable local
        btn.type = "button";
        btn.className = "filter-btn" + (projectSubFilter === opt.id ? " active" : "");
        btn.textContent = opt.label; // Actualiza texto plano en el DOM
        btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
          projectSubFilter = opt.id;
          render();
        });
        subBar.appendChild(btn);
      });
      sec.appendChild(subBar);
    }

    // Barra de subfiltros para las secciones de JavaScript (Todos, Junior, Mid, Master)
    if (["junior", "mid", "master"].includes(cat)) { // Evalúa condición lógica
      const jsBar = document.createElement("div"); // Declara e inicializa variable local
      jsBar.className = "proj-subfilters js-subfilters";
      const jsOpts = [
        { id: "all", label: "Todos" },
        { id: "junior", label: "JS Junior" },
        { id: "mid", label: "JS Mid" },
        { id: "master", label: "JS Master" },
      ];
      jsOpts.forEach((opt) => {
        const btn = document.createElement("button"); // Declara e inicializa variable local
        btn.type = "button";
        btn.className = "filter-btn" + (activeFilter === opt.id ? " active" : "");
        btn.textContent = opt.label; // Actualiza texto plano en el DOM
        btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
          activeFilter = opt.id;
          filterBtns.forEach((b) => b.classList.toggle("active", b.dataset.filter === opt.id));
          render();
        });
        jsBar.appendChild(btn);
      });
      sec.appendChild(jsBar);
    }

    // Creamos el contenedor en cuadrícula para las tarjetas de esta categoría
    const grid = document.createElement("div"); // Declara e inicializa variable local
    // Asignamos la clase CSS de rejilla responsiva
    grid.className = "grid";
    // Fragmento local para insertar todas las tarjetas de la sección juntas
    const gridFrag = document.createDocumentFragment(); // Crea fragmento de cuadrícula

    // Recorremos cada módulo filtrado para construir su tarjeta clicable
    items.forEach((item) => {
      // Creamos un enlace <a> para que toda la tarjeta sea navegable
      const a = document.createElement("a"); // Declara e inicializa variable local
      // Asignamos la clase CSS de tarjeta estilo Glassmorphism
      a.className = "card" + (progressMap[item.href]?.completed ? " card-done" : "");
      // Codificamos la ruta para manejar espacios y caracteres especiales en la URL
      a.href = encodeURI(item.href);
      // Detectamos si la etiqueta corresponde a documentación o proyectos para darle color distinto
      const isDoc = item.tag.includes("MD") || item.tag === "Proyecto"; // Declara e inicializa variable local
      const done = progressMap[item.href]?.completed; // Declara e inicializa variable local
      const doneMark = done ? ' <span title="Completado">✅</span>' : ''; // Declara e inicializa variable local
      // Obtenemos el icono temático (para ejercicios/proyectos) y el icono oficial del lenguaje en tamaño compacto
      const topicIcon = getTopicIcon(item); // Declara e inicializa variable local
      const techIcon = getCardTechIcon(item).replace(/class="tech-icon"/g, 'class="tech-icon tech-icon-sm"'); // Declara e inicializa variable local
      // Construimos el HTML interno de la tarjeta con icono temático + icono del lenguaje + título
      a.innerHTML = `
                <div class="card-top">
                    <span class="card-title">${topicIcon ? topicIcon + " " : ""}${techIcon} ${item.title}${doneMark}</span>
                    <span class="tag ${isDoc ? "tag-doc" : ""}">${item.tag}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
            `;
      // Añadimos la tarjeta al fragmento de cuadrícula
      gridFrag.appendChild(a); // Inserta nodo en el fragmento
    });

    // Insertamos todas las tarjetas de una sola vez en la cuadrícula
    grid.appendChild(gridFrag); // Inserta fragmento en el DOM
    // Insertamos la cuadrícula dentro de la sección
    sec.appendChild(grid);
    // Añadimos la sección al fragmento principal
    portalFrag.appendChild(sec); // Inserta sección en el fragmento
  });
  // Insertamos todas las secciones en el portal en una sola operación DOM
  portal.appendChild(portalFrag); // Inserta fragmento completo en el DOM
}


// Renderiza la barra superior de progreso global y el botón de continuar/reiniciar
function renderGlobalProgress(progressMap) { // Define función reutilizable
  const bar = document.getElementById("globalProgressBar"); // Declara e inicializa variable local
  if (!bar) return; // Evalúa condición lógica
  const total = modules.length; // Declara e inicializa variable local
  const completed = modules.filter((m) => progressMap[m.href]?.completed).length; // Declara e inicializa variable local
  const pct = total ? Math.round((completed / total) * 100) : 0; // Declara e inicializa variable local
  let lastMod = null; // Declara e inicializa variable local
  try { lastMod = JSON.parse(localStorage.getItem("curso_web_last_module") || "null"); } catch (_) {}
  const continueHtml = lastMod && lastMod.href
    ? `<a class="continue-btn" href="${encodeURI(lastMod.href)}">▶ Continuar: ${lastMod.title}</a>`
    : `<span class="continue-btn" style="opacity:0.75;cursor:default;">🧭 ${total} recursos disponibles</span>`;
  const resetHtml = (completed > 0 || lastMod)
    ? `<button type="button" class="reset-progress-btn" id="resetProgressBtn" title="Reiniciar progreso guardado">↺ Reiniciar</button>`
    : "";
  bar.innerHTML = `
    <div class="global-progress-info">
      <div class="global-progress-label">Progreso global del curso: ${completed} / ${total} módulos (${pct}%)</div>
      <div class="global-progress-track"><div class="global-progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="progress-actions">${continueHtml}${resetHtml}</div>
  `;
  document.getElementById("resetProgressBtn")?.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    if (!confirm("¿Reiniciar tu progreso guardado en este navegador?")) return; // Evalúa condición lógica
    try {
      localStorage.removeItem("curso_web_progress");
      localStorage.removeItem("curso_web_last_module");
    } catch (_) {}
    render();
  });
}

// Atajos de teclado globales: "/" o Ctrl+K enfocan el buscador; Escape limpia el filtro
document.addEventListener("keydown", (e) => { // Registra escuchador de evento en el DOM
  if ((e.key === "/" || (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))) && document.activeElement !== searchInput) { // Evalúa condición lógica
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  } else if (e.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
    searchInput.value = "";
    render();
  }
});

portal.addEventListener("click", (e) => { // Registra escuchador de evento en el DOM
  const card = e.target.closest("a.card"); // Declara e inicializa variable local
  if (!card) return; // Evalúa condición lógica
  const titleEl = card.querySelector(".card-title"); // Declara e inicializa variable local
  const href = card.getAttribute("href"); // Declara e inicializa variable local
  if (href) { // Evalúa condición lógica
    try {
      localStorage.setItem("curso_web_last_module", JSON.stringify({
        title: (titleEl?.textContent || "Último módulo").trim().slice(0, 48),
        href: decodeURI(href)
      }));
    } catch (_) {}
  }
});

// Registramos el evento clic en cada botón de filtro para cambiar la categoría activa
filterBtns.forEach((btn) => {
  // Escuchamos el clic del botón actual
  btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    // Quitamos la clase 'active' de todos los botones
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Marcamos como activo el botón presionado
    btn.classList.add("active");
    // Actualizamos el filtro activo leyendo su atributo data-filter
    activeFilter = btn.dataset.filter;
    // Volvemos a renderizar el portal con el nuevo filtro
    render();
  });
});

// Escuchamos el evento 'input' en la barra de búsqueda con un breve retardo (debounce) para evitar renders innecesarios al teclear rápido
let searchTimer; // Temporizador de debounce para búsqueda
searchInput.addEventListener("input", () => { // Registra escuchador de evento en el DOM
  clearTimeout(searchTimer); // Cancela el render pendiente si sigue escribiendo
  searchTimer = setTimeout(render, 80); // Ejecuta render 80ms después de pausar la escritura
});

// Conectamos los botones de la Ruta Visual Paso a Paso para activar el filtro correspondiente con un clic
document.querySelectorAll(".path-step").forEach((stepBtn) => {
  // Escuchamos el clic en cada paso de la ruta
  stepBtn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
    // Obtenemos la categoría destino desde data-jump
    const targetCat = stepBtn.dataset.jump; // Declara e inicializa variable local
    // Buscamos el botón de filtro equivalente y simulamos su selección visual
    filterBtns.forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === targetCat),
    );
    // Actualizamos la variable del filtro activo
    activeFilter = targetCat;
    // Volvemos a renderizar mostrando solo ese nivel
    render();
    // Desplazamos suavemente la pantalla hacia el contenido filtrado
    portal.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Ejecutamos el renderizado inicial al cargar la página
render();


