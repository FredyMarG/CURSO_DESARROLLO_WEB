// Activamos el modo estricto de JavaScript para evitar errores silenciosos y variables globales accidentales
"use strict"; // Activa el modo estricto de JavaScript

// Arreglo maestro que contiene todos los módulos, guías interactivas, ejercicios, proyectos y documentación del curso
const modules = [
  // --- SECCIÓN: NODE.JS (Backend, Entorno de Ejecución y APIs) ---
  // Módulo 01 interactivo de Fundamentos de Node.js
  { // Instrucción JavaScript
    cat: "node", // Categoría Node.js
    title: "01. Fundamentos de Node.js", // Título visible en la tarjeta
    tag: "14 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Entorno de ejecución, V8, libuv, Event Loop, npm, primer servidor HTTP y API de bienvenida.", // Descripción breve
    href: "NODE/Fundamentos/index.html", // Ruta relativa al módulo interactivo
  },
  // Módulo 02 interactivo de REPL de Node.js
  { // Instrucción JavaScript
    cat: "node", // Categoría Node.js
    title: "02. REPL de Node.js", // Título visible en la tarjeta
    tag: "12 Slides", // Etiqueta de cantidad de diapositivas
    desc: "Ciclo Read-Eval-Print-Loop, comandos especiales (.help, .save, .load, .editor), await y prototipo de catálogo.", // Descripción breve
    href: "NODE/REPL/index.html", // Ruta relativa al módulo interactivo
  },
  // Acceso directo a la documentación técnica de Node.js
  { // Instrucción JavaScript
    cat: "node", // Categoría Node.js
    title: "Documentación Completa Node.js", // Título visible en la tarjeta
    tag: "2 Guías MD", // Etiqueta de guías Markdown
    desc: "Guías teóricas de Fundamentos y REPL de Node.js, ejercicios por niveles, solucionario y cheatsheet.", // Descripción breve
    href: "NODE/Documentacion/index.html", // Ruta relativa al lector de documentación
  },

  // --- SECCIÓN: JS MASTER LEVEL (19 Guías Interactivas de 11-12 diapositivas + Documentación) ---
  // Módulo de consumo de APIs REST con Fetch, AbortController y Promise.all
  { // Instrucción JavaScript
    cat: "master",
    title: "APIs y Fetch",
    tag: "11 Slides",
    desc: "Consumo RESTful, fetch(), AbortController y Promise.all.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Apis/index.html",
  },
  // Módulo de Cache API (CacheStorage) para aplicaciones rápidas y soporte offline
  { // Instrucción JavaScript
    cat: "master",
    title: "Cache API (caches)",
    tag: "12 Slides",
    desc: "CacheStorage, put/match/delete, estrategias PWA y soporte offline.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Cache/index.html",
  },
  // Módulo de Cookies (document.cookie) para persistencia HTTP y seguridad web
  { // Instrucción JavaScript
    cat: "master",
    title: "Cookies (document.cookie)",
    tag: "11 Slides",
    desc: "Creación, lectura, modificación, eliminación, encodeURIComponent, SameSite y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Cookies/index.html",
  },
  // Módulo de API nativa de arrastrar y soltar elementos y archivos
  { // Instrucción JavaScript
    cat: "master",
    title: "Drag & Drop",
    tag: "11 Slides",
    desc: "Eventos de arrastre, dataTransfer y archivos del escritorio.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Drag & Drop/index.html",
  },
  // Módulo de lectura de archivos locales en el navegador con FileReader
  { // Instrucción JavaScript
    cat: "master",
    title: "FileReader API",
    tag: "11 Slides",
    desc: "Lectura de texto, DataURL, ArrayBuffer y barras de carga.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/File Reader/index.html",
  },
  // Módulo sobre sintaxis de funciones flecha, this léxico, closures y recursividad
  { // Instrucción JavaScript
    cat: "master",
    title: "Funciones Flecha",
    tag: "12 Slides",
    desc: "Sintaxis, ámbito léxico de this, closures y recursividad.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Funciones Flecha/index.html",
  },
  // Módulo de geolocalización con getCurrentPosition y watchPosition
  { // Instrucción JavaScript
    cat: "master",
    title: "Geolocalización",
    tag: "11 Slides",
    desc: "getCurrentPosition(), watchPosition() y manejo de errores.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Geolocalization/index.html",
  },
  // Módulo de navegación SPA sin recarga mediante History API
  { // Instrucción JavaScript
    cat: "master",
    title: "History API",
    tag: "11 Slides",
    desc: "pushState, replaceState, popstate y scrollRestoration.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Historial/index.html",
  },
  // Módulo de base de datos NoSQL asíncrona en el navegador (IndexedDB)
  { // Instrucción JavaScript
    cat: "master",
    title: "IndexedDB",
    tag: "12 Slides",
    desc: "Base NoSQL en el navegador, transacciones, índices y cursores.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/IndexedDB/index.html",
  },
  // Módulo de detección eficiente de visibilidad de elementos con IntersectionObserver
  { // Instrucción JavaScript
    cat: "master",
    title: "Intersection Observer",
    tag: "12 Slides",
    desc: "Lazy loading, scroll infinito y laboratorio interactivo real.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Intersection Observer/index.html",
  },
  // Módulo de almacenamiento persistente clave-valor en el navegador
  { // Instrucción JavaScript
    cat: "master",
    title: "Local Storage",
    tag: "11 Slides",
    desc: "Almacenamiento persistente, JSON y sincronización multi-pestaña.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Local Storage/index.html",
  },
  // Módulo de evaluación dinámica de Media Queries CSS desde JavaScript
  { // Instrucción JavaScript
    cat: "master",
    title: "window.matchMedia()",
    tag: "12 Slides",
    desc: "Media Queries reactivas en JS y laboratorio de breakpoints.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Matchmedia/index.html",
  },
  // Módulo de optimización de funciones puras mediante caché en memoria (Memoization)
  { // Instrucción JavaScript
    cat: "master",
    title: "Memoization",
    tag: "12 Slides",
    desc: "Caché de funciones puras, Closures, Map/WeakMap y optimización O(n).",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Memoization/index.html",
  },
  // Módulo sobre la directiva 'use strict', seguridad y módulos ES6
  { // Instrucción JavaScript
    cat: "master",
    title: "Modo Estricto",
    tag: "11 Slides",
    desc: "'use strict', ES Modules, seguridad y optimización.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html",
  },
  // Módulo sobre las interfaces del objeto BOM window.navigator
  { // Instrucción JavaScript
    cat: "master",
    title: "Objeto Navigator",
    tag: "12 Slides",
    desc: "Interfaces BOM, red, hardware, storage y Clipboard API.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Navigator/index.html",
  },
  // Módulo de alertas nativas del sistema operativo con Notifications API
  { // Instrucción JavaScript
    cat: "master",
    title: "Notifications API",
    tag: "12 Slides",
    desc: "Permisos, alertas nativas del SO y Service Workers.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Notifications/index.html",
  },
  // Módulo sobre fechas, horas y formateo internacional con Date e Intl
  { // Instrucción JavaScript
    cat: "master",
    title: "Objeto Date",
    tag: "11 Slides",
    desc: "Fechas, horas y formateo moderno con Intl.DateTimeFormat.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Objeto Date/index.html",
  },
  // Módulo sobre el objeto window.screen (dimensiones físicas, colorDepth y orientación)
  { // Instrucción JavaScript
    cat: "master",
    title: "Objeto Screen (window.screen)",
    tag: "11 Slides",
    desc: "Resolución total, availWidth/availHeight, colorDepth, orientation y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Objeto Screen/index.html",
  },
  // Módulo sobre gráficos 2D con HTML5 Canvas API (rectángulos, paths, arcos y animación)
  { // Instrucción JavaScript
    cat: "master",
    title: "Canvas (HTML5 Canvas 2D)",
    tag: "11 Slides",
    desc: "Contexto 2D, fillRect/strokeRect, beginPath, arc, requestAnimationFrame y Lab.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Canvas/index.html",
  },
  // Módulo sobre expresiones condicionales cortas y Nullish Coalescing
  { // Instrucción JavaScript
    cat: "master",
    title: "Operador Ternario",
    tag: "11 Slides",
    desc: "Expresiones condicionales, ?? Nullish Coalescing y legibilidad.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Operador Ternario/index.html",
  },
  // Módulo sobre herencia prototípica, Prototype Chain y clases ES6+
  { // Instrucción JavaScript
    cat: "master",
    title: "Prototipos",
    tag: "11 Slides",
    desc: "Prototype Chain, herencia prototípica y equivalencia con class.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Prototipos/index.html",
  },
  // Módulo de Service Workers para proxy de red, PWAs y modo offline
  { // Instrucción JavaScript
    cat: "master",
    title: "Service Workers",
    tag: "12 Slides",
    desc: "Ciclo de vida, fetch offline, Cache API y postMessage().",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Service Workers/index.html",
  },
  // Módulo de detección de pestaña activa o en segundo plano (Page Visibility API)
  { // Instrucción JavaScript
    cat: "master",
    title: "Visibility Change",
    tag: "12 Slides",
    desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Visibility Change/index.html",
  },
  // Módulo de ejecución paralela en hilos secundarios con Web Workers
  { // Instrucción JavaScript
    cat: "master",
    title: "Web Workers",
    tag: "12 Slides",
    desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Web Workers/index.html",
  },
  // Acceso directo a las 23 guías Markdown de Master Level
  { // Instrucción JavaScript
    cat: "master",
    title: "Documentación Completa Master Level",
    tag: "23 Guías MD",
    desc: "Todas las guías teóricas, ejercicios y cheatsheets de Master Level (incluyendo Cookies y Objeto Screen).",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: EJERCICIOS PRÁCTICOS (PROGRESIÓN: JUNIOR → MID LEVEL) ---
  // 01–11: Ejercicios Junior Level
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "01. Helados y Precios",
    tag: "Junior",
    desc: "Condicionales y selección de productos según dinero disponible.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/1 Helados y Precios/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "02. Fiesta y Entrada",
    tag: "Junior",
    desc: "Control de edad y horario con funciones y condicionales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/2 Fiesta y Entrada/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "03. Control de Asistencia",
    tag: "Junior",
    desc: "Registro de asistencia con bucles y arreglos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/3 Asistencia/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "04. Calculadora Básica",
    tag: "Junior",
    desc: "Operaciones aritméticas básicas mediante funciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/4 Calculadora Básica/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "05. Celular Nuevo (POO)",
    tag: "Junior",
    desc: "Modelado de dispositivos con clases y métodos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/5 Celular Nuevo/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "06. Apps Celular Nuevo",
    tag: "Junior",
    desc: "Simulación de descarga e instalación de aplicaciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/6 Apps Celular Nuevo/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "07. Calculadora Avanzada",
    tag: "Junior",
    desc: "Potencias y raíces usando el objeto Math.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/7 Calculadora Avanzada/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "08. Materias y Profesores",
    tag: "Junior",
    desc: "Búsqueda y filtrado sobre arreglos de datos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/8 Materias y Profesores/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "09. Inscripción de Materias",
    tag: "Junior",
    desc: "Validación de cupos e inscripción dinámica.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/9 Inscripción de Materias/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "10. Nota Final Consola",
    tag: "Junior",
    desc: "Cálculo de resultados y estilos en console.log.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/10 Nota Final Consola/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "11. Ordenar Tareas",
    tag: "Junior",
    desc: "Planificación y agrupación de actividades diarias.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/11 Ordenar Tareas/index.html",
  },
  // 12–15: Ejercicios Mid Level
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "12. Comprar Computador",
    tag: "Mid",
    desc: "Práctica de objetos, condiciones y presupuesto en pantalla.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/1 Comprar Computador/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "13. Mostrar Datos Web",
    tag: "Mid",
    desc: "Renderizado dinámico de información en el DOM.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/2 Mostrar Datos Web/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "14. Materia Pendiente",
    tag: "Mid",
    desc: "Validación de formularios y gestión de materias.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/3 Materia Pendiente/index.html",
  },
  { // Instrucción JavaScript
    cat: "ejercicios",
    title: "15. Promedio de Notas",
    tag: "Mid",
    desc: "Cálculo y validación de promedios con manejo de errores.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/5 Promedio de Notas Corrección/index.html",
  },

  // --- SECCIÓN: PROYECTOS INTEGRADORES (PROGRESIÓN: HTML/CSS → JUNIOR → MID → MASTER) ---
  // 10: Proyecto Junior Level
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "10. La Llave Correcta",
    tag: "Proyecto Junior",
    desc: "Creación dinámica de tarjetas seleccionables en el DOM.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html",
  },
  // 11–13: Proyectos Mid Level
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "11. Recuperación por Docente",
    tag: "Proyecto Mid",
    desc: "Asignación y control de estado académico.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/4 Recuperacion de Materia por Docente/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "12. Notas de Cofla",
    tag: "Proyecto Mid",
    desc: "Promesas y asincronía simulando obtención de calificaciones.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/6 Notas de Cofla/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "13. Compañeros de Cofla",
    tag: "Proyecto Mid",
    desc: "Consumo asíncrono de datos con Fetch/Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/7 Compañeros de Cofla Htdocs/index.html",
  },
  // 14–20: Proyectos Master Level
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "14. Reloj Digital (Date)",
    tag: "Proyecto Master",
    desc: "Reloj digital en tiempo real con setInterval.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "15. Idioma con LocalStorage",
    tag: "Proyecto Master",
    desc: "Selector bilingüe persistente con modal animado.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "16. Drag & Drop File Reader",
    tag: "Proyecto Master",
    desc: "Carga de archivos con barra de progreso animada.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "17. Texturizador Drag & Drop",
    tag: "Proyecto Master",
    desc: "Aplicación de texturas por arrastre con dataTransfer.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "18. Galería Dinámica",
    tag: "Proyecto Master",
    desc: "Bento Grid interactivo con FileReader y Lightbox.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "19. Lazy Load con IntersectionObserver",
    tag: "Proyecto Master",
    desc: "Carga progresiva de 45 publicaciones con animación al scroll.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "20. CRUD con IndexedDB",
    tag: "Proyecto Master",
    desc: "Gestor persistente de nombres en IndexedDB.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "21. Uso de Cookies (Consentimiento)",
    tag: "Proyecto Master",
    desc: "Modal interactivo de aceptación de cookies con expiración UTC y estado neón.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Uso de Cookies/index.html",
  },
  { // Ejercicio interactivo de pizarra 2D con HTML5 Canvas API
    cat: "proyectos",
    title: "22. Web Paint (Canvas 2D)",
    tag: "Proyecto Master",
    desc: "Pizarra interactiva con pincel, borrador, grosor, Deshacer (Ctrl+Z) y descarga PNG.",
    href: "JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Web Paint/index.html",
  },
  { // Proyecto práctico de gestor de finanzas personales con Canvas y localStorage
    cat: "proyectos",
    title: "23. Finanzas APP",
    tag: "Proyecto JS",
    desc: "Control de ingresos y gastos con separador de miles en vivo, localStorage y gráfico Canvas.",
    href: "JAVASCRIPT/PROYECTOS/Finanzas APP/index.html",
  },
  { // Proyecto práctico de buscador de películas en vivo con OMDb API, Debounce y <dialog>
    cat: "proyectos",
    title: "24. Buscador de Películas",
    tag: "Proyecto JS",
    desc: "Buscador CineSearch con Debounce, fetch a OMDb API y modal nativo HTML5.",
    href: "JAVASCRIPT/PROYECTOS/Buscador de Peliculas/index.html",
  },
  { // Proyecto práctico de tablero Kanban con Drag & Drop nativo y localStorage
    cat: "proyectos",
    title: "25. Tablero Kanban",
    tag: "Proyecto JS",
    desc: "Organizador de tareas en 3 columnas con Drag & Drop nativo y persistencia localStorage.",
    href: "JAVASCRIPT/PROYECTOS/Tablero Kanban/index.html",
  },

  // --- SECCIÓN: JS MID LEVEL ---
  // Práctica de programación asíncrona moderna con async y await
  { // Instrucción JavaScript
    cat: "mid",
    title: "Async y Await",
    tag: "Mid Level",
    desc: "Asincronía moderna legible con try/catch.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Async y Await/index.html",
  },
  // Práctica de Promesas y encadenamiento asíncrono
  { // Instrucción JavaScript
    cat: "mid",
    title: "Promesas",
    tag: "Mid Level",
    desc: "Estados pending, fulfilled, rejected y encadenamiento.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Promesas/index.html",
  },
  // Práctica de consumo HTTP con Fetch API
  { // Instrucción JavaScript
    cat: "mid",
    title: "Fetch API",
    tag: "Mid Level",
    desc: "Peticiones HTTP modernas en JavaScript.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Fetch/index.html",
  },
  // Práctica de peticiones HTTP y encabezados
  { // Instrucción JavaScript
    cat: "mid",
    title: "Peticiones HTTP",
    tag: "Mid Level",
    desc: "Métodos, cabeceras y códigos de estado HTTP.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Peticiones HTTP/index.html",
  },
  // Práctica de funciones callback y flujo asíncrono base
  { // Instrucción JavaScript
    cat: "mid",
    title: "Callbacks",
    tag: "Mid Level",
    desc: "Funciones de retorno y flujo asíncrono base.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Callbacks/index.html",
  },
  // Práctica de serialización y parseo con JSON
  { // Instrucción JavaScript
    cat: "mid",
    title: "Datos Estructurados (JSON)",
    tag: "Mid Level",
    desc: "Serialización y parseo de objetos JSON.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html",
  },
  // Práctica de captura y manejo de excepciones con try/catch
  { // Instrucción JavaScript
    cat: "mid",
    title: "Try-Catch y Excepciones",
    tag: "Mid Level",
    desc: "Manejo robusto de errores en tiempo de ejecución.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Try-Catch/index.html",
  },
  // Práctica de estructura de control Switch
  { // Instrucción JavaScript
    cat: "mid",
    title: "Switch",
    tag: "Mid Level",
    desc: "Evaluación múltiple de casos con switch y break.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Switch/index.html",
  },
  // Práctica de temporizadores setTimeout y setInterval
  { // Instrucción JavaScript
    cat: "mid",
    title: "Temporizadores",
    tag: "Mid Level",
    desc: "Control del tiempo con setTimeout, setInterval y clear.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Temporizadores/index.html",
  },
  // Práctica sobre código obsoleto y reemplazos modernos
  { // Instrucción JavaScript
    cat: "mid",
    title: "Código Obsoleto",
    tag: "Mid Level",
    desc: "Patrones heredados y sus equivalentes actuales.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Codigo Obsoleto/index.html",
  },
  // Sub-prácticas de AJAX
  { // Instrucción JavaScript
    cat: "mid",
    title: "AJAX (Editor)",
    tag: "Mid Level",
    desc: "Peticiones asíncronas clásicas con XMLHttpRequest.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/Ajax Editor/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "AJAX (Htdocs)",
    tag: "Mid Level",
    desc: "Práctica de AJAX en entorno de servidor local.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/Ajax Htdocs/index.html",
  },
  // Sub-prácticas de Librería Axios
  { // Instrucción JavaScript
    cat: "mid",
    title: "Librería Axios (Editor)",
    tag: "Mid Level",
    desc: "Cliente HTTP basado en Promesas con Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/Axios Editor/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Axios vs Fetch (Htdocs)",
    tag: "Mid Level",
    desc: "Comparativa práctica entre Axios y Fetch.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/Axios-Fetch-Htdocs/index.html",
  },
  // Sub-prácticas de Eventos
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos: Handlers",
    tag: "Mid Level",
    desc: "Registro y remoción de escuchadores de eventos.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Handlers/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos: Event Flow",
    tag: "Mid Level",
    desc: "Propagación de eventos (Bubbling y Capturing).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Event Flow/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos de Mouse",
    tag: "Mid Level",
    desc: "Interacciones de clic, doble clic y movimiento.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Mouse/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos de Teclado",
    tag: "Mid Level",
    desc: "Captura de teclas con keydown, keyup y keypress.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Teclado/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos de Interfaz",
    tag: "Mid Level",
    desc: "Eventos load, resize, scroll y select.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/Eventos de Interfaz/index.html",
  },
  // Sub-práctica de DevTools
  { // Instrucción JavaScript
    cat: "mid",
    title: "DevTools: Pestaña Application",
    tag: "Mid Level",
    desc: "Inspección de almacenamiento y caché en DevTools.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Pestañas DevTools/Application/index.html",
  },
  // Guías interactivas de carpeta para los módulos Mid Level
  { // Instrucción JavaScript
    cat: "mid",
    title: "AJAX (XMLHttpRequest)",
    tag: "Mid Level",
    desc: "Realiza peticiones asíncronas sin recargar la página mediante XMLHttpRequest y maneja respuestas del servidor.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Ajax/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Eventos del DOM",
    tag: "Mid Level",
    desc: "Domina addEventListener(), propagación (Bubbling/Capturing), eventos de mouse, teclado e interfaz.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Eventos/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Librería Axios",
    tag: "Mid Level",
    desc: "Realiza peticiones HTTP simplificadas con transformación automática a JSON e interceptores usando Axios.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Libreria Axios/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Objeto Location",
    tag: "Mid Level",
    desc: "Lee y manipula la URL actual del navegador mediante window.location (href, pathname, search, reload).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Location/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Objetos Barprop",
    tag: "Mid Level",
    desc: "Inspecciona la visibilidad de barras del navegador (locationbar, menubar, scrollbars, toolbar).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Objetos Barprop/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Pestañas de DevTools",
    tag: "Mid Level",
    desc: "Domina Elements, Console, Sources, Network, Performance (Timeline) y Application para depurar como un profesional.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Pestañas DevTools/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Resize y Move",
    tag: "Mid Level",
    desc: "Controla eventos de redimensionamiento (resize) y métodos de tamaño/posición de ventana.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Resize y Move/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Screen y Scroll",
    tag: "Mid Level",
    desc: "Consulta dimensiones físicas del monitor (window.screen) y controla el desplazamiento (scrollTo, scrollY).",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Screen y Scroll/index.html",
  },
  { // Instrucción JavaScript
    cat: "mid",
    title: "Objeto Window",
    tag: "Mid Level",
    desc: "Explora el objeto global del navegador: abrir/cerrar ventanas, alertas, dimensiones y propiedades globales.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/Window/index.html",
  },
  // Acceso directo a la carpeta de las 25 guías Markdown de Mid Level
  { // Instrucción JavaScript
    cat: "mid",
    title: "Documentación Completa Mid Level",
    tag: "25 Guías MD",
    desc: "Eventos, Axios, Window, DevTools, HTTP y más.",
    href: "JAVASCRIPT/JAVASCRIPT MID LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: JS JUNIOR LEVEL ---
  // Práctica de variables (var, let, const)
  { // Instrucción JavaScript
    cat: "junior",
    title: "Variables",
    tag: "Junior Level",
    desc: "Declaración, alcance y tipos de datos básicos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Variables/index.html",
  },
  // Práctica de operadores aritméticos y lógicos
  { // Instrucción JavaScript
    cat: "junior",
    title: "Operadores",
    tag: "Junior Level",
    desc: "Operadores de asignación, comparación y lógicos.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Operadores/index.html",
  },
  // Práctica de concatenación y template literals
  { // Instrucción JavaScript
    cat: "junior",
    title: "Concatenación",
    tag: "Junior Level",
    desc: "Unión de textos y uso de Template Strings.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Concatenacion/index.html",
  },
  // Práctica de estructuras condicionales if/else
  { // Instrucción JavaScript
    cat: "junior",
    title: "Condicionales",
    tag: "Junior Level",
    desc: "Toma de decisiones con if, else if y else.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Condicionales/index.html",
  },
  // Práctica de arreglos y métodos fundamentales
  { // Instrucción JavaScript
    cat: "junior",
    title: "Arrays y Métodos",
    tag: "Junior Level",
    desc: "Estructuras indexadas y métodos fundamentales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Arrays/index.html",
  },
  // Práctica de bucles while y do...while
  { // Instrucción JavaScript
    cat: "junior",
    title: "Bucles (while / do-while)",
    tag: "Junior Level",
    desc: "Repetición controlada de instrucciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Bucles/index.html",
  },
  // Práctica de bucle for, for...in y for...of
  { // Instrucción JavaScript
    cat: "junior",
    title: "Bucle For",
    tag: "Junior Level",
    desc: "Iteración clásica y recorridos sobre colecciones.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/For/index.html",
  },
  // Práctica de funciones declaradas y expresadas
  { // Instrucción JavaScript
    cat: "junior",
    title: "Funciones",
    tag: "Junior Level",
    desc: "Parámetros, retorno de valores y reutilización.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Funciones/index.html",
  },
  // Práctica de Programación Orientada a Objetos en JS
  { // Instrucción JavaScript
    cat: "junior",
    title: "POO (Programación Orientada a Objetos)",
    tag: "Junior Level",
    desc: "Clases, constructores, herencia y encapsulación.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/POO/index.html",
  },
  // Práctica de métodos de cadenas de texto
  { // Instrucción JavaScript
    cat: "junior",
    title: "Cadenas (Métodos)",
    tag: "Junior Level",
    desc: "Transformación, búsqueda y corte de strings.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Cadenas(Metodos)/index.html",
  },
  // Práctica de funciones matemáticas con el objeto Math
  { // Instrucción JavaScript
    cat: "junior",
    title: "Objeto Math",
    tag: "Junior Level",
    desc: "Redondeos, raíces, aleatorios y constantes.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Math/index.html",
  },
  // Práctica de depuración en consola
  { // Instrucción JavaScript
    cat: "junior",
    title: "Console.log y Depuración",
    tag: "Junior Level",
    desc: "Métodos de consola para inspeccionar variables y tablas.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Console.log/index.html",
  },
  // Práctica de manipulación del árbol DOM
  { // Instrucción JavaScript
    cat: "junior",
    title: "DOM (Document Object Model)",
    tag: "Junior Level",
    desc: "Selección, creación y manipulación de nodos HTML.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Dom/index.html",
  },
  // Acceso directo a la carpeta de las 14 guías Markdown de Junior Level
  { // Instrucción JavaScript
    cat: "junior",
    title: "Documentación Completa Junior Level",
    tag: "14 Guías MD",
    desc: "Variables, Operadores, Cadenas, Math, Condicionales.",
    href: "JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: HTML Y CSS (Guías Dinámicas, Prácticas y Proyectos) ---
  // 0. Mega-Portal Unificado HTML5 y CSS3
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "🎨 Mega-Portal HTML5 y CSS3 (Ruta Completa)",
    tag: "Hub Completo",
    desc: "Mapa completo paso a paso con todos los temas, subtemas, guías de 10 slides, simuladores, proyectos y apuntes.",
    href: "HTML y CSS/index.html",
  },
  // 1. Guías Dinámicas Interactivas (10 Slides con Simulador, Quiz y Laboratorio)
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Estructura base HTML5, títulos, párrafos, enlaces, imágenes, listas, probador de inputs, quiz y laboratorio.",
    href: "HTML y CSS/HTML BASICO/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "HTML semántico, formularios avanzados, tablas, multimedia, lazy loading, inspector semántico, quiz y lab.",
    href: "HTML y CSS/HTML avanzado/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Selectores, Box Model, simulador border-box, unidades de medida, colores, tipografía, sombras, quiz y lab.",
    href: "HTML y CSS/CSS BASICO/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Cascada, especificidad, simulador position/z-index, pseudoclases, pseudoelementos, BEM, quiz y lab.",
    href: "HTML y CSS/CSS avanzado/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Eje principal y cruzado, simulador Flexbox en vivo, grow/shrink/basis, patrones reales, quiz y lab.",
    href: "HTML y CSS/Flexbox/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Grid (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Unidades fr, repeat(), minmax(), simulador Grid en vivo, áreas, Subgrid, quiz y laboratorio.",
    href: "HTML y CSS/Grid/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones CSS (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Transiciones vs @keyframes, simulador de curvas cubic-bezier, rendimiento GPU 60 FPS, scroll, quiz y lab.",
    href: "HTML y CSS/Animaciones/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones CSS Avanzadas (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Variables CSS, simulador clamp() y color-mix(), calc(), dvh, clip-path, backdrop-filter, quiz y lab.",
    href: "HTML y CSS/Funciones Avanzadas/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive Design (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Mobile First, simulador de breakpoints, Media Queries, Container Queries, srcset/<picture>, quiz y lab.",
    href: "HTML y CSS/Responsive Design/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Documentación Completa HTML y CSS",
    tag: "8 Guías MD",
    desc: "Lector interactivo de apuntes: HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones y Hosting.",
    href: "HTML y CSS/Documentacion/index.html",
  },

  // 2. Prácticas por Temática — HTML Básico
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico: Títulos y Párrafos",
    tag: "HTML Básico",
    desc: "Jerarquía de encabezados h1–h6 y formato de párrafos.",
    href: "HTML y CSS/HTML BASICO/Titulos y Parrafos/Titulos y parrafos.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico: Listas",
    tag: "HTML Básico",
    desc: "Listas ordenadas <ol>, desordenadas <ul> y elementos <li>.",
    href: "HTML y CSS/HTML BASICO/Listas/listas.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico: Enlaces",
    tag: "HTML Básico",
    desc: "Navegación con etiquetas <a>, rutas relativas y target.",
    href: "HTML y CSS/HTML BASICO/Enlaces/enlaces.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico: Imágenes",
    tag: "HTML Básico",
    desc: "Inserción de imágenes con <img>, src y texto alternativo alt.",
    href: "HTML y CSS/HTML BASICO/Imagenes/img.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Básico: Formularios",
    tag: "HTML Básico",
    desc: "Campos de entrada <input>, botones y envío básico.",
    href: "HTML y CSS/HTML BASICO/Formularios/formularios.html",
  },

  // 4. Prácticas de HTML Avanzado
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: HTML Semántico",
    tag: "HTML Avanzado",
    desc: "Uso de <header>, <nav>, <main>, <article>, <aside> y <footer>.",
    href: "HTML y CSS/HTML avanzado/HTML Semantico/HTML semantico.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Accesibilidad (ARIA)",
    tag: "HTML Avanzado",
    desc: "Buenas prácticas de accesibilidad web y atributos ARIA.",
    href: "HTML y CSS/HTML avanzado/Accesibilidad/accesibilidad.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Tablas",
    tag: "HTML Avanzado",
    desc: "Tablas semánticas con <thead>, <tbody>, <th> y colspan.",
    href: "HTML y CSS/HTML avanzado/Tablas/tablas.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Audio y Video",
    tag: "HTML Avanzado",
    desc: "Reproducción multimedia nativa con <audio> y <video>.",
    href: "HTML y CSS/HTML avanzado/audio y video/audio y video.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Lazy Loading",
    tag: "HTML Avanzado",
    desc: "Carga diferida de recursos con loading='lazy'.",
    href: "HTML y CSS/HTML avanzado/Lazy load/lazy.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Select, Datalist y Option",
    tag: "HTML Avanzado",
    desc: "Listas desplegables y autocompletado nativo en formularios.",
    href: "HTML y CSS/HTML avanzado/Select Datalist y Option/selec,datalist y option.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Fieldset y Legend",
    tag: "HTML Avanzado",
    desc: "Agrupación semántica de controles de formulario.",
    href: "HTML y CSS/HTML avanzado/Fieldset y Legend/fieldset y legend.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Textarea y Labels",
    tag: "HTML Avanzado",
    desc: "Áreas de texto multilínea y vinculación accesible con <label>.",
    href: "HTML y CSS/HTML avanzado/Textarea y Labels/text-area y labels.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Details y Summary",
    tag: "HTML Avanzado",
    desc: "Componentes desplegables nativos sin JavaScript.",
    href: "HTML y CSS/HTML avanzado/Details y Summary/details y summary.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Enlaces Avanzados",
    tag: "HTML Avanzado",
    desc: "Descargas, anclas internas, tel:, mailto: y seguridad.",
    href: "HTML y CSS/HTML avanzado/Enlaces avanzados/enlaces avanzado.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Metatags e Iconos",
    tag: "HTML Avanzado",
    desc: "Comentarios, favicons y meta etiquetas SEO/OpenGraph.",
    href: "HTML y CSS/HTML avanzado/Comentarios Metatags Iconos/comentarios-metatags-iconos.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: Emmet",
    tag: "HTML Avanzado",
    desc: "Abreviaturas rápidas para generar estructura HTML.",
    href: "HTML y CSS/HTML avanzado/Emmet/emmet.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "HTML Avanzado: HTML Obsoleto",
    tag: "HTML Avanzado",
    desc: "Etiquetas deprecadas en HTML5 y sus reemplazos modernos.",
    href: "HTML y CSS/HTML avanzado/HTML Obsoleto/HTML obsoleto.html",
  },

  // 5. Prácticas de CSS Básico (integradas en CSS Básico: Guía Interactiva)
  // 6. Prácticas de CSS Avanzado
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Selectores",
    tag: "CSS Avanzado",
    desc: "Selectores de atributo, combinadores y jerarquía.",
    href: "HTML y CSS/CSS avanzado/selectores/selectores.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Herencia",
    tag: "CSS Avanzado",
    desc: "Propiedades heredables, inherit, initial y unset.",
    href: "HTML y CSS/CSS avanzado/Herencia/herencia.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Display",
    tag: "CSS Avanzado",
    desc: "Comportamiento de cajas block, inline, inline-block y none.",
    href: "HTML y CSS/CSS avanzado/Display/display.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Position Relative",
    tag: "CSS Avanzado",
    desc: "Desplazamiento relativo y contexto de referencia.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-relative.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Position Absolute",
    tag: "CSS Avanzado",
    desc: "Posicionamiento absoluto respecto al ancestro posicionado.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-absolute.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Position Fixed",
    tag: "CSS Avanzado",
    desc: "Elementos fijos respecto a la ventana del navegador.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-fixed.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Position Sticky",
    tag: "CSS Avanzado",
    desc: "Encabezados pegajosos al hacer scroll.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-sticky.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Pseudoclases",
    tag: "CSS Avanzado",
    desc: "Estados :hover, :focus, :nth-child() y :not().",
    href: "HTML y CSS/CSS avanzado/Pseudoclases/pseudoclases.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Pseudoelementos",
    tag: "CSS Avanzado",
    desc: "Elementos virtuales ::before, ::after y ::first-letter.",
    href: "HTML y CSS/CSS avanzado/Pseudoelementos/pseudoelementos.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Metodología BEM",
    tag: "CSS Avanzado",
    desc: "Nomenclatura Block__Element--Modifier para CSS escalable.",
    href: "HTML y CSS/CSS avanzado/BEM/bem.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Object Fit & Position",
    tag: "CSS Avanzado",
    desc: "Recorte y encuadre de imágenes con cover y contain.",
    href: "HTML y CSS/CSS avanzado/Object Fit_Position/fit_position.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Overflow",
    tag: "CSS Avanzado",
    desc: "Control de desbordamiento con hidden, scroll y auto.",
    href: "HTML y CSS/CSS avanzado/Overflow/overflow.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Outline",
    tag: "CSS Avanzado",
    desc: "Contornos externos y foco accesible sin mover el layout.",
    href: "HTML y CSS/CSS avanzado/Outline/outline.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Control de Flujo de Texto",
    tag: "CSS Avanzado",
    desc: "Ajuste de palabras largas, white-space y text-overflow.",
    href: "HTML y CSS/CSS avanzado/Control_flujo_texto/control_texto.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "CSS Avanzado: Transition",
    tag: "CSS Avanzado",
    desc: "Transiciones suaves entre cambios de estado.",
    href: "HTML y CSS/CSS avanzado/Transition/transition.html",
  },

  // 7. Prácticas de Flexbox
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Flex Direction",
    tag: "Flexbox",
    desc: "Dirección del eje principal: row, row-reverse, column.",
    href: "HTML y CSS/Flexbox/Flex_Direction/direction.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Alineación",
    tag: "Flexbox",
    desc: "Distribución con justify-content y align-items.",
    href: "HTML y CSS/Flexbox/Alineacion/alineacion.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Wrap y Flow",
    tag: "Flexbox",
    desc: "Saltos de línea automáticos con flex-wrap y flex-flow.",
    href: "HTML y CSS/Flexbox/Wrap y Flow/wrap_flow.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Grow, Shrink y Basis",
    tag: "Flexbox",
    desc: "Crecimiento, encogimiento y tamaño base de ítems flex.",
    href: "HTML y CSS/Flexbox/Grow,Shrink y Basis/grow.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Order",
    tag: "Flexbox",
    desc: "Reordenamiento visual de elementos flex sin tocar HTML.",
    href: "HTML y CSS/Flexbox/Order/order.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Align Self",
    tag: "Flexbox",
    desc: "Alineación individual de un hijo en el eje transversal.",
    href: "HTML y CSS/Flexbox/Align Self/align.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Flexbox: Layout Completo",
    tag: "Flexbox",
    desc: "Maquetación práctica de interfaz usando Flexbox.",
    href: "HTML y CSS/Flexbox/Layout/layout.html",
  },

  // 8. Prácticas de CSS Grid
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Principios",
    tag: "CSS Grid",
    desc: "Creación de cuadrículas con display: grid, filas y columnas.",
    href: "HTML y CSS/Grid/Principios/grid.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Auto y FR",
    tag: "CSS Grid",
    desc: "Reparto proporcional del espacio libre con la unidad fr.",
    href: "HTML y CSS/Grid/Auto y FR/auto.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Repeat",
    tag: "CSS Grid",
    desc: "Definición compacta de pistas repetitivas con repeat().",
    href: "HTML y CSS/Grid/Repeat/repeat.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Gap",
    tag: "CSS Grid",
    desc: "Separación entre filas y columnas sin márgenes extras.",
    href: "HTML y CSS/Grid/Gap/gap.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Row y Column",
    tag: "CSS Grid",
    desc: "Expansión de celdas con grid-column, grid-row y span.",
    href: "HTML y CSS/Grid/Row-Column/row-column.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Áreas (Template Areas)",
    tag: "CSS Grid",
    desc: "Maquetación visual nombrando áreas con grid-template-areas.",
    href: "HTML y CSS/Grid/Area/area.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Alineación",
    tag: "CSS Grid",
    desc: "Alineación de ítems y pistas con place-items y place-content.",
    href: "HTML y CSS/Grid/Alineacion/alineacion.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Explícito e Implícito",
    tag: "CSS Grid",
    desc: "Control de pistas automáticas con grid-auto-rows y flow.",
    href: "HTML y CSS/Grid/Grid Explicito e Implicito/exp-imp.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Dense",
    tag: "CSS Grid",
    desc: "Relleno automático de huecos con grid-auto-flow: dense.",
    href: "HTML y CSS/Grid/Dense/dense.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Dinámico (Responsive)",
    tag: "CSS Grid",
    desc: "Grillas adaptables con auto-fit, auto-fill y minmax().",
    href: "HTML y CSS/Grid/Dinamico(Responsive)/dinamico.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Grid: Subgrid",
    tag: "CSS Grid",
    desc: "Alineación de hijos anidados con la cuadrícula del padre.",
    href: "HTML y CSS/Grid/Subgrid/subgrid.html",
  },

  // 9. Prácticas de Animaciones
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Keyframes Base",
    tag: "Animaciones",
    desc: "Creación de animaciones declarativas con @keyframes.",
    href: "HTML y CSS/Animaciones/Animaciones/animaciones.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Botones Animados",
    tag: "Animaciones",
    desc: "Microinteracciones y efectos hover en botones.",
    href: "HTML y CSS/Animaciones/Botones Animados/botones.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Texto Animado",
    tag: "Animaciones",
    desc: "Efectos de entrada, escritura y degradados en texto.",
    href: "HTML y CSS/Animaciones/Texto/texto.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Transiciones (Repaso)",
    tag: "Animaciones",
    desc: "Repaso práctico de timing-functions y transiciones.",
    href: "HTML y CSS/Animaciones/Transiciones (Repaso)/transiciones.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Scroll Container",
    tag: "Animaciones",
    desc: "Animaciones vinculadas al progreso de scroll del contenedor.",
    href: "HTML y CSS/Animaciones/Scroll/Scroll Container/scroll.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Animaciones: Scroll View",
    tag: "Animaciones",
    desc: "Animaciones activadas al entrar en el viewport con view().",
    href: "HTML y CSS/Animaciones/Scroll/View/view.html",
  },

  // 10. Prácticas de Funciones Avanzadas
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Variables CSS",
    tag: "CSS Moderno",
    desc: "Custom properties (--var) y temas dinámicos.",
    href: "HTML y CSS/Funciones Avanzadas/Variables/variables.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Calc()",
    tag: "CSS Moderno",
    desc: "Operaciones matemáticas mezclando unidades en CSS.",
    href: "HTML y CSS/Funciones Avanzadas/Calc/calc.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Min, Max y Clamp",
    tag: "CSS Moderno",
    desc: "Dimensiones y tipografías fluidas con límites seguros.",
    href: "HTML y CSS/Funciones Avanzadas/Max Min Clamp/max-min.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Unidades del Viewport",
    tag: "CSS Moderno",
    desc: "Uso de vw, vh, dvh, svh y lvh en pantallas modernas.",
    href: "HTML y CSS/Funciones Avanzadas/Unidades del Viewport/unidades.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Color Mix",
    tag: "CSS Moderno",
    desc: "Mezcla nativa de colores en CSS con color-mix().",
    href: "HTML y CSS/Funciones Avanzadas/Color MIx/color.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Filter y Backdrop",
    tag: "CSS Moderno",
    desc: "Efectos blur, desenfoque de fondo y glassmorphism.",
    href: "HTML y CSS/Funciones Avanzadas/Filter y Backdrop/filter.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Clip Path",
    tag: "CSS Moderno",
    desc: "Recortes poligonales, círculos y máscaras geométricas.",
    href: "HTML y CSS/Funciones Avanzadas/Clip Path/clip.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Transform",
    tag: "CSS Moderno",
    desc: "Traslación, rotación, escala e inclinación 2D/3D.",
    href: "HTML y CSS/Funciones Avanzadas/Transform/transform.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Initial Letter",
    tag: "CSS Moderno",
    desc: "Letras capitales estilo editorial con initial-letter.",
    href: "HTML y CSS/Funciones Avanzadas/Initial Letter/initial.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Funciones Avanzadas: Scroll",
    tag: "CSS Moderno",
    desc: "Comportamiento de scroll suave y scroll-snap.",
    href: "HTML y CSS/Funciones Avanzadas/Scroll/scroll.html",
  },

  // 11. Prácticas de Responsive Design
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Mobile Design",
    tag: "Responsive",
    desc: "Principios de diseño enfocado en dispositivos móviles.",
    href: "HTML y CSS/Responsive Design/Mobile Design/mobile.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Media Queries",
    tag: "Responsive",
    desc: "Puntos de quiebre con @media (min-width / max-width).",
    href: "HTML y CSS/Responsive Design/Media Queries/mediaq.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Container Queries",
    tag: "Responsive",
    desc: "Componentes adaptables al tamaño de su contenedor padre.",
    href: "HTML y CSS/Responsive Design/Container Queries/container.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Feature Queries",
    tag: "Responsive",
    desc: "Detección de soporte CSS moderno con @supports.",
    href: "HTML y CSS/Responsive Design/Feature Queries/features.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Bloques Flexibles",
    tag: "Responsive",
    desc: "Contenedores fluidos que se adaptan al ancho disponible.",
    href: "HTML y CSS/Responsive Design/Bloques Flexibles/bloques_flexibles.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Holy Grail Layout",
    tag: "Responsive",
    desc: "Maquetación clásica de cabecera, 3 columnas y pie adaptable.",
    href: "HTML y CSS/Responsive Design/Holi Grail/holigrail.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Multimedia Flexible",
    tag: "Responsive",
    desc: "Imágenes y videos fluidos sin desbordar la pantalla.",
    href: "HTML y CSS/Responsive Design/Multimedia Flexible/multimedia.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Picture, Source y Media",
    tag: "Responsive",
    desc: "Dirección de arte y formatos WebP con <picture>.",
    href: "HTML y CSS/Responsive Design/Picture,Source,Media/picture.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Responsive: Srcset y Sizes",
    tag: "Responsive",
    desc: "Entrega de imágenes óptimas según resolución y tamaño.",
    href: "HTML y CSS/Responsive Design/Srcset y Sizes/src-szs.html",
  },

  // 12. Ejercicios Prácticos
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Ejercicio: Tarjeta de Presentación",
    tag: "Ejercicio",
    desc: "Maquetación de tarjeta de perfil con Box Model, sombras, border-radius: 50% y variantes de color.",
    href: "HTML y CSS/CSS BASICO/Ejercicios/Tarjeta de presentacion/index.html",
  },
  { // Instrucción JavaScript
    cat: "htmlcss",
    title: "Ejercicio: Ventana Modal",
    tag: "Ejercicio",
    desc: "Construcción de una ventana modal con <dialog>, position y metodología BEM.",
    href: "HTML y CSS/CSS avanzado/Ejercicios/Ventana Modal/modal.html",
  },

  // 01–09: Proyectos HTML y CSS (al inicio de Proyectos)
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "01. Proyectos HTML y CSS (Guía + Showcase)",
    tag: "Proyecto",
    desc: "Guía arquitectónica de los 7 proyectos reales de CSS puro, quiz de técnicas y acceso directo.",
    href: "HTML y CSS/PROYECTOS/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "02. Accordion (Summary)",
    tag: "Proyecto",
    desc: "Acordeón semántico nativo usando <details> y <summary>.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/SUMMARY-DETAILS/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "03. Accordion Menu (Divs)",
    tag: "Proyecto",
    desc: "Acordeón interactivo construido con contenedores div.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/DIVS/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "04. Chatbox",
    tag: "Proyecto",
    desc: "Interfaz de mensajería moderna con Flexbox y burbujas.",
    href: "HTML y CSS/PROYECTOS/CHATBOX/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "05. Flipper Card 3D",
    tag: "Proyecto",
    desc: "Efecto de rotación 3D con perspectiva CSS.",
    href: "HTML y CSS/PROYECTOS/FLIPPER CARD/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "06. One View Page",
    tag: "Proyecto",
    desc: "Maquetación de pantalla completa con diseño limpio.",
    href: "HTML y CSS/PROYECTOS/ONE VIEW PAGE/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "07. Sidebar Menu",
    tag: "Proyecto",
    desc: "Barra de navegación lateral adaptable con transiciones.",
    href: "HTML y CSS/PROYECTOS/SIDEBAR MENU/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "08. Web Page",
    tag: "Proyecto",
    desc: "Sitio web completo estructurado con Grid y Flexbox.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE/index.html",
  },
  { // Instrucción JavaScript
    cat: "proyectos",
    title: "09. Web Page Animations",
    tag: "Proyecto",
    desc: "Transiciones y @keyframes aplicados a una landing page.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE ANIMATIONS/index.html",
  },
];

// Diccionario que asigna un título legible con emoji a cada categoría del portal
const titles = { // Declara e inicializa "titles"
  // Encabezado para Node.js
  node: "🟢 Node.js — Backend y Entorno de Ejecución",
  // Encabezado para Master Level
  master: "🚀 JavaScript Master Level — Guías Interactivas",
  // Encabezado para Ejercicios
  ejercicios: "🧪 Ejercicios Prácticos Interactivos (Todos los Niveles)",
  // Encabezado para Mid Level
  mid: "⚡ JavaScript Mid Level",
  // Encabezado para Junior Level
  junior: "🌱 JavaScript Junior Level",
  // Encabezado para HTML y CSS
  htmlcss: "🎨 HTML5 y CSS3",
  // Encabezado para Proyectos Integradores
  proyectos: "💼 Proyectos Integradores — HTML/CSS y JavaScript",
};

// Referencia al contenedor principal donde se inyectan las secciones y tarjetas
const portal = document.getElementById("portalContent"); // Obtiene referencia DOM para "portal"
// Referencia al campo de búsqueda en tiempo real
const searchInput = document.getElementById("searchInput"); // Obtiene referencia DOM para "searchInput"
// Colección de todos los botones de filtro por categoría
const filterBtns = document.querySelectorAll(".filter-btn"); // Obtiene referencia DOM para "filterBtns"
// Variable que almacena el filtro de categoría seleccionado actualmente
let activeFilter = "all"; // Declara e inicializa "activeFilter"

// Función principal encargada de filtrar y renderizar dinámicamente el catálogo en el DOM
function render() { // Declara función
  // Obtenemos el texto buscado sin espacios sobrantes y en minúsculas para comparación insensible a mayúsculas
  const q = searchInput.value.trim().toLowerCase(); // Declara e inicializa "q"
  // Limpiamos el contenido previo del portal antes de volver a dibujar
  portal.innerHTML = ""; // Actualiza contenido en el DOM

  // Definimos el orden visual en que se mostrarán las categorías
  const order = ["node", "master", "ejercicios", "proyectos", "mid", "junior", "htmlcss"]; // Declara e inicializa "order"
  // Recorremos cada categoría en el orden establecido
  order.forEach((cat) => { // Instrucción JavaScript
    // Si hay un filtro activo distinto de 'all' y no coincide con esta categoría, la omitimos
    if (activeFilter !== "all" && activeFilter !== cat) return; // Evalúa condición
    // Filtramos los módulos que pertenecen a esta categoría y coinciden con la búsqueda
    const items = modules.filter(
      (m) =>
        m.cat === cat &&
        (m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.tag.toLowerCase().includes(q)),
    );
    // Si ningún módulo coincide en esta categoría, no creamos sección vacía
    if (items.length === 0) return; // Evalúa condición

    // Ordena numéricamente Ejercicios (01–15) y Proyectos (01–20) según el avance del curso
    if (cat === "ejercicios" || cat === "proyectos") { // Evalúa condición
      items.sort((a, b) => parseInt(a.title, 10) - parseInt(b.title, 10)); // Ejecuta llamada o método
    }

    // Creamos el elemento <section> contenedor de la categoría
    const sec = document.createElement("section"); // Crea nuevo elemento DOM "sec"
    // Asignamos la clase CSS de sección de curso
    sec.className = "course-section"; // Asigna valor
    // Insertamos el título correspondiente de la categoría con el conteo de elementos
    sec.innerHTML = `<h2 class="course-title">${titles[cat]} <span class="tag">${items.length}</span></h2>`; // Actualiza contenido en el DOM

    // Creamos el contenedor en cuadrícula para las tarjetas de esta categoría
    const grid = document.createElement("div"); // Crea nuevo elemento DOM "grid"
    // Asignamos la clase CSS de rejilla responsiva
    grid.className = "grid"; // Asigna valor

    // Leemos el progreso guardado en localStorage para marcar tarjetas completadas
    let progressMap = {}; // Declara e inicializa "progressMap"
    try { progressMap = JSON.parse(localStorage.getItem("curso_web_progress") || "{}"); } catch (_) {}

    // Recorremos cada módulo filtrado para construir su tarjeta clicable
    items.forEach((item) => { // Instrucción JavaScript
      // Creamos un enlace <a> para que toda la tarjeta sea navegable
      const a = document.createElement("a"); // Crea nuevo elemento DOM "a"
      // Asignamos la clase CSS de tarjeta estilo Glassmorphism
      a.className = "card"; // Asigna valor
      // Codificamos la ruta para manejar espacios y caracteres especiales en la URL
      a.href = encodeURI(item.href); // Asigna valor
      // Detectamos si la etiqueta corresponde a documentación o proyectos para darle color distinto
      const isDoc = item.tag.includes("MD") || item.tag === "Proyecto"; // Declara e inicializa "isDoc"
      const done = progressMap[item.href]?.completed; // Declara e inicializa "done"
      const doneMark = done ? ' <span title="Completado">✅</span>' : ''; // Declara e inicializa "doneMark"
      // Construimos el HTML interno de la tarjeta con título, badge y descripción
      a.innerHTML = `
                <div class="card-top">
                    <span class="card-title">${item.title}${doneMark}</span>
                    <span class="tag ${isDoc ? "tag-doc" : ""}">${item.tag}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
            `;
      // Añadimos la tarjeta a la cuadrícula
      grid.appendChild(a); // Inserta nodo en el DOM
    });

    // Insertamos la cuadrícula dentro de la sección
    sec.appendChild(grid); // Inserta nodo en el DOM
    // Insertamos la sección completa dentro del portal principal
    portal.appendChild(sec); // Inserta nodo en el DOM
  });
}

// Registramos el evento clic en cada botón de filtro para cambiar la categoría activa
filterBtns.forEach((btn) => { // Instrucción JavaScript
  // Escuchamos el clic del botón actual
  btn.addEventListener("click", () => { // Registra escuchador de eventos
    // Quitamos la clase 'active' de todos los botones
    filterBtns.forEach((b) => b.classList.remove("active")); // Modifica clases CSS del elemento
    // Marcamos como activo el botón presionado
    btn.classList.add("active"); // Modifica clases CSS del elemento
    // Actualizamos el filtro activo leyendo su atributo data-filter
    activeFilter = btn.dataset.filter; // Asigna valor
    // Volvemos a renderizar el portal con el nuevo filtro
    render(); // Ejecuta llamada o método
  });
});

// Escuchamos el evento 'input' en la barra de búsqueda para filtrar en tiempo real al escribir
searchInput.addEventListener("input", render); // Registra escuchador de eventos

// Conectamos los botones de la Ruta Visual Paso a Paso para activar el filtro correspondiente con un clic
document.querySelectorAll(".path-step").forEach((stepBtn) => { // Instrucción JavaScript
  // Escuchamos el clic en cada paso de la ruta
  stepBtn.addEventListener("click", () => { // Registra escuchador de eventos
    // Obtenemos la categoría destino desde data-jump
    const targetCat = stepBtn.dataset.jump; // Declara e inicializa "targetCat"
    // Buscamos el botón de filtro equivalente y simulamos su selección visual
    filterBtns.forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === targetCat),
    );
    // Actualizamos la variable del filtro activo
    activeFilter = targetCat; // Asigna valor
    // Volvemos a renderizar mostrando solo ese nivel
    render(); // Ejecuta llamada o método
    // Desplazamos suavemente la pantalla hacia el contenido filtrado
    portal.scrollIntoView({ behavior: "smooth", block: "start" }); // Ejecuta llamada o método
  });
});

// Ejecutamos el renderizado inicial al cargar la página
render(); // Ejecuta llamada o método
