// Activamos el modo estricto de JavaScript para evitar errores silenciosos y variables globales accidentales
"use strict";

// Arreglo maestro que contiene todos los módulos, guías interactivas, ejercicios, proyectos y documentación del curso
const modules = [
  // --- SECCIÓN: JS MASTER LEVEL (19 Guías Interactivas de 11-12 diapositivas + Documentación) ---
  // Módulo de consumo de APIs REST con Fetch, AbortController y Promise.all
  {
    cat: "master",
    title: "APIs y Fetch",
    tag: "11 Slides",
    desc: "Consumo RESTful, fetch(), AbortController y Promise.all.",
    href: "JAVASCRIPT MASTER LEVEL/Apis/index.html",
  },
  // Módulo de Cache API (CacheStorage) para aplicaciones rápidas y soporte offline
  {
    cat: "master",
    title: "Cache API (caches)",
    tag: "12 Slides",
    desc: "CacheStorage, put/match/delete, estrategias PWA y soporte offline.",
    href: "JAVASCRIPT MASTER LEVEL/Cache/index.html",
  },
  // Módulo de API nativa de arrastrar y soltar elementos y archivos
  {
    cat: "master",
    title: "Drag & Drop",
    tag: "11 Slides",
    desc: "Eventos de arrastre, dataTransfer y archivos del escritorio.",
    href: "JAVASCRIPT MASTER LEVEL/Drag & Drop/index.html",
  },
  // Módulo de lectura de archivos locales en el navegador con FileReader
  {
    cat: "master",
    title: "FileReader API",
    tag: "11 Slides",
    desc: "Lectura de texto, DataURL, ArrayBuffer y barras de carga.",
    href: "JAVASCRIPT MASTER LEVEL/File Reader/index.html",
  },
  // Módulo sobre sintaxis de funciones flecha, this léxico, closures y recursividad
  {
    cat: "master",
    title: "Funciones Flecha",
    tag: "12 Slides",
    desc: "Sintaxis, ámbito léxico de this, closures y recursividad.",
    href: "JAVASCRIPT MASTER LEVEL/Funciones Flecha/index.html",
  },
  // Módulo de geolocalización con getCurrentPosition y watchPosition
  {
    cat: "master",
    title: "Geolocalización",
    tag: "11 Slides",
    desc: "getCurrentPosition(), watchPosition() y manejo de errores.",
    href: "JAVASCRIPT MASTER LEVEL/Geolocalization/index.html",
  },
  // Módulo de navegación SPA sin recarga mediante History API
  {
    cat: "master",
    title: "History API",
    tag: "11 Slides",
    desc: "pushState, replaceState, popstate y scrollRestoration.",
    href: "JAVASCRIPT MASTER LEVEL/Historial/index.html",
  },
  // Módulo de base de datos NoSQL asíncrona en el navegador (IndexedDB)
  {
    cat: "master",
    title: "IndexedDB",
    tag: "12 Slides",
    desc: "Base NoSQL en el navegador, transacciones, índices y cursores.",
    href: "JAVASCRIPT MASTER LEVEL/IndexedDB/index.html",
  },
  // Módulo de detección eficiente de visibilidad de elementos con IntersectionObserver
  {
    cat: "master",
    title: "Intersection Observer",
    tag: "12 Slides",
    desc: "Lazy loading, scroll infinito y laboratorio interactivo real.",
    href: "JAVASCRIPT MASTER LEVEL/Intersection Observer/index.html",
  },
  // Módulo de almacenamiento persistente clave-valor en el navegador
  {
    cat: "master",
    title: "Local Storage",
    tag: "11 Slides",
    desc: "Almacenamiento persistente, JSON y sincronización multi-pestaña.",
    href: "JAVASCRIPT MASTER LEVEL/Local Storage/index.html",
  },
  // Módulo de evaluación dinámica de Media Queries CSS desde JavaScript
  {
    cat: "master",
    title: "window.matchMedia()",
    tag: "12 Slides",
    desc: "Media Queries reactivas en JS y laboratorio de breakpoints.",
    href: "JAVASCRIPT MASTER LEVEL/Matchmedia/index.html",
  },
  // Módulo de optimización de funciones puras mediante caché en memoria (Memoization)
  {
    cat: "master",
    title: "Memoization",
    tag: "12 Slides",
    desc: "Caché de funciones puras, Closures, Map/WeakMap y optimización O(n).",
    href: "JAVASCRIPT MASTER LEVEL/Memoization/index.html",
  },
  // Módulo sobre la directiva 'use strict', seguridad y módulos ES6
  {
    cat: "master",
    title: "Modo Estricto",
    tag: "11 Slides",
    desc: "'use strict', ES Modules, seguridad y optimización.",
    href: "JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html",
  },
  // Módulo sobre las interfaces del objeto BOM window.navigator
  {
    cat: "master",
    title: "Objeto Navigator",
    tag: "12 Slides",
    desc: "Interfaces BOM, red, hardware, storage y Clipboard API.",
    href: "JAVASCRIPT MASTER LEVEL/Navigator/index.html",
  },
  // Módulo de alertas nativas del sistema operativo con Notifications API
  {
    cat: "master",
    title: "Notifications API",
    tag: "12 Slides",
    desc: "Permisos, alertas nativas del SO y Service Workers.",
    href: "JAVASCRIPT MASTER LEVEL/Notifications/index.html",
  },
  // Módulo sobre fechas, horas y formateo internacional con Date e Intl
  {
    cat: "master",
    title: "Objeto Date",
    tag: "11 Slides",
    desc: "Fechas, horas y formateo moderno con Intl.DateTimeFormat.",
    href: "JAVASCRIPT MASTER LEVEL/Objeto Date/index.html",
  },
  // Módulo sobre expresiones condicionales cortas y Nullish Coalescing
  {
    cat: "master",
    title: "Operador Ternario",
    tag: "11 Slides",
    desc: "Expresiones condicionales, ?? Nullish Coalescing y legibilidad.",
    href: "JAVASCRIPT MASTER LEVEL/Operador Ternario/index.html",
  },
  // Módulo sobre herencia prototípica, Prototype Chain y clases ES6+
  {
    cat: "master",
    title: "Prototipos",
    tag: "11 Slides",
    desc: "Prototype Chain, herencia prototípica y equivalencia con class.",
    href: "JAVASCRIPT MASTER LEVEL/Prototipos/index.html",
  },
  // Módulo de Service Workers para proxy de red, PWAs y modo offline
  {
    cat: "master",
    title: "Service Workers",
    tag: "12 Slides",
    desc: "Ciclo de vida, fetch offline, Cache API y postMessage().",
    href: "JAVASCRIPT MASTER LEVEL/Service Workers/index.html",
  },
  // Módulo de detección de pestaña activa o en segundo plano (Page Visibility API)
  {
    cat: "master",
    title: "Visibility Change",
    tag: "12 Slides",
    desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.",
    href: "JAVASCRIPT MASTER LEVEL/Visibility Change/index.html",
  },
  // Módulo de ejecución paralela en hilos secundarios con Web Workers
  {
    cat: "master",
    title: "Web Workers",
    tag: "12 Slides",
    desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.",
    href: "JAVASCRIPT MASTER LEVEL/Web Workers/index.html",
  },
  // Acceso directo a las 20 guías Markdown de Master Level
  {
    cat: "master",
    title: "Documentación Completa Master Level",
    tag: "20 Guías MD",
    desc: "Todas las guías teóricas, ejercicios y cheatsheets de Master Level.",
    href: "JAVASCRIPT MASTER LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: EJERCICIOS PRÁCTICOS (MASTER, MID Y JUNIOR LEVEL) ---
  // Ejercicio Master: carga diferida progresiva y animación al scroll
  {
    cat: "ejercicios",
    title: "Lazy Load con IntersectionObserver",
    tag: "Master",
    desc: "Carga progresiva de 45 publicaciones con animación al scroll.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html",
  },
  // Ejercicio Master: CRUD persistente usando IndexedDB
  {
    cat: "ejercicios",
    title: "CRUD con IndexedDB",
    tag: "Master",
    desc: "Gestor persistente de nombres en IndexedDB.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html",
  },
  // Ejercicio Master: carga por arrastre con barra de progreso animada
  {
    cat: "ejercicios",
    title: "Drag & Drop File Reader",
    tag: "Master",
    desc: "Carga de archivos con barra de progreso animada.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html",
  },
  // Ejercicio Master: galería mosaico interactiva con Lightbox
  {
    cat: "ejercicios",
    title: "Galería Dinámica",
    tag: "Master",
    desc: "Bento Grid interactivo con FileReader y Lightbox.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html",
  },
  // Ejercicio Master: selector de idioma persistente con LocalStorage
  {
    cat: "ejercicios",
    title: "Idioma con LocalStorage",
    tag: "Master",
    desc: "Selector bilingüe persistente con modal animado.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html",
  },
  // Ejercicio Master: reloj digital en tiempo real con el objeto Date
  {
    cat: "ejercicios",
    title: "Reloj Digital (Date)",
    tag: "Master",
    desc: "Reloj digital en tiempo real con setInterval.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html",
  },
  // Ejercicio Master: aplicación de texturas mediante Drag & Drop
  {
    cat: "ejercicios",
    title: "Texturizador Drag & Drop",
    tag: "Master",
    desc: "Aplicación de texturas por arrastre con dataTransfer.",
    href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html",
  },

  // Ejercicios Mid Level (7)
  // Ejercicio Mid 1: Comprar computador
  {
    cat: "ejercicios",
    title: "1. Comprar Computador",
    tag: "Mid",
    desc: "Práctica de objetos, condiciones y presupuesto en pantalla.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/1 Comprar Computador/index.html",
  },
  // Ejercicio Mid 2: Mostrar datos web
  {
    cat: "ejercicios",
    title: "2. Mostrar Datos Web",
    tag: "Mid",
    desc: "Renderizado dinámico de información en el DOM.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/2 Mostrar Datos Web/index.html",
  },
  // Ejercicio Mid 3: Materia pendiente
  {
    cat: "ejercicios",
    title: "3. Materia Pendiente",
    tag: "Mid",
    desc: "Validación de formularios y gestión de materias.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/3 Materia Pendiente/index.html",
  },
  // Ejercicio Mid 4: Recuperación de materia por docente
  {
    cat: "ejercicios",
    title: "4. Recuperación por Docente",
    tag: "Mid",
    desc: "Asignación y control de estado académico.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/4 Recuperacion de Materia por Docente/index.html",
  },
  // Ejercicio Mid 5: Promedio de notas corrección
  {
    cat: "ejercicios",
    title: "5. Promedio de Notas",
    tag: "Mid",
    desc: "Cálculo y validación de promedios con manejo de errores.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/5 Promedio de Notas Corrección/index.html",
  },
  // Ejercicio Mid 6: Notas de Cofla
  {
    cat: "ejercicios",
    title: "6. Notas de Cofla",
    tag: "Mid",
    desc: "Promesas y asincronía simulando obtención de calificaciones.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/6 Notas de Cofla/index.html",
  },
  // Ejercicio Mid 7: Compañeros de Cofla Htdocs
  {
    cat: "ejercicios",
    title: "7. Compañeros de Cofla",
    tag: "Mid",
    desc: "Consumo asíncrono de datos con Fetch/Axios.",
    href: "JAVASCRIPT MID LEVEL/EJERCICIOS/7 Compañeros de Cofla Htdocs/index.html",
  },

  // Ejercicios Junior Level (12)
  // Ejercicio Junior 1: Helados y precios
  {
    cat: "ejercicios",
    title: "1. Helados y Precios",
    tag: "Junior",
    desc: "Condicionales y selección de productos según dinero disponible.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/1 Helados y Precios/index.html",
  },
  // Ejercicio Junior 2: Fiesta y entrada
  {
    cat: "ejercicios",
    title: "2. Fiesta y Entrada",
    tag: "Junior",
    desc: "Control de edad y horario con funciones y condicionales.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/2 Fiesta y Entrada/index.html",
  },
  // Ejercicio Junior 3: Asistencia
  {
    cat: "ejercicios",
    title: "3. Control de Asistencia",
    tag: "Junior",
    desc: "Registro de asistencia con bucles y arreglos.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/3 Asistencia/index.html",
  },
  // Ejercicio Junior 4: Calculadora básica
  {
    cat: "ejercicios",
    title: "4. Calculadora Básica",
    tag: "Junior",
    desc: "Operaciones aritméticas básicas mediante funciones.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/4 Calculadora Básica/index.html",
  },
  // Ejercicio Junior 5: Celular nuevo
  {
    cat: "ejercicios",
    title: "5. Celular Nuevo (POO)",
    tag: "Junior",
    desc: "Modelado de dispositivos con clases y métodos.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/5 Celular Nuevo/index.html",
  },
  // Ejercicio Junior 6: Apps celular nuevo
  {
    cat: "ejercicios",
    title: "6. Apps Celular Nuevo",
    tag: "Junior",
    desc: "Simulación de descarga e instalación de aplicaciones.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/6 Apps Celular Nuevo/index.html",
  },
  // Ejercicio Junior 7: Calculadora avanzada
  {
    cat: "ejercicios",
    title: "7. Calculadora Avanzada",
    tag: "Junior",
    desc: "Potencias y raíces usando el objeto Math.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/7 Calculadora Avanzada/index.html",
  },
  // Ejercicio Junior 8: Materias y profesores
  {
    cat: "ejercicios",
    title: "8. Materias y Profesores",
    tag: "Junior",
    desc: "Búsqueda y filtrado sobre arreglos de datos.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/8 Materias y Profesores/index.html",
  },
  // Ejercicio Junior 9: Inscripción de materias
  {
    cat: "ejercicios",
    title: "9. Inscripción de Materias",
    tag: "Junior",
    desc: "Validación de cupos e inscripción dinámica.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/9 Inscripción de Materias/index.html",
  },
  // Ejercicio Junior 10: Nota final consola
  {
    cat: "ejercicios",
    title: "10. Nota Final Consola",
    tag: "Junior",
    desc: "Cálculo de resultados y estilos en console.log.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/10 Nota Final Consola/index.html",
  },
  // Ejercicio Junior 11: Ordenar tareas
  {
    cat: "ejercicios",
    title: "11. Ordenar Tareas",
    tag: "Junior",
    desc: "Planificación y agrupación de actividades diarias.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/11 Ordenar Tareas/index.html",
  },
  // Ejercicio Junior 12: La llave correcta
  {
    cat: "ejercicios",
    title: "12. La Llave Correcta",
    tag: "Junior",
    desc: "Creación dinámica de tarjetas seleccionables en el DOM.",
    href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html",
  },

  // --- SECCIÓN: JS MID LEVEL ---
  // Práctica de programación asíncrona moderna con async y await
  {
    cat: "mid",
    title: "Async y Await",
    tag: "Mid Level",
    desc: "Asincronía moderna legible con try/catch.",
    href: "JAVASCRIPT MID LEVEL/Async y Await/index.html",
  },
  // Práctica de Promesas y encadenamiento asíncrono
  {
    cat: "mid",
    title: "Promesas",
    tag: "Mid Level",
    desc: "Estados pending, fulfilled, rejected y encadenamiento.",
    href: "JAVASCRIPT MID LEVEL/Promesas/index.html",
  },
  // Práctica de consumo HTTP con Fetch API
  {
    cat: "mid",
    title: "Fetch API",
    tag: "Mid Level",
    desc: "Peticiones HTTP modernas en JavaScript.",
    href: "JAVASCRIPT MID LEVEL/Fetch/index.html",
  },
  // Práctica de peticiones HTTP y encabezados
  {
    cat: "mid",
    title: "Peticiones HTTP",
    tag: "Mid Level",
    desc: "Métodos, cabeceras y códigos de estado HTTP.",
    href: "JAVASCRIPT MID LEVEL/Peticiones HTTP/index.html",
  },
  // Práctica de funciones callback y flujo asíncrono base
  {
    cat: "mid",
    title: "Callbacks",
    tag: "Mid Level",
    desc: "Funciones de retorno y flujo asíncrono base.",
    href: "JAVASCRIPT MID LEVEL/Callbacks/index.html",
  },
  // Práctica de serialización y parseo con JSON
  {
    cat: "mid",
    title: "Datos Estructurados (JSON)",
    tag: "Mid Level",
    desc: "Serialización y parseo de objetos JSON.",
    href: "JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html",
  },
  // Práctica de captura y manejo de excepciones con try/catch
  {
    cat: "mid",
    title: "Try-Catch y Excepciones",
    tag: "Mid Level",
    desc: "Manejo robusto de errores en tiempo de ejecución.",
    href: "JAVASCRIPT MID LEVEL/Try-Catch/index.html",
  },
  // Práctica de estructura de control Switch
  {
    cat: "mid",
    title: "Switch",
    tag: "Mid Level",
    desc: "Evaluación múltiple de casos con switch y break.",
    href: "JAVASCRIPT MID LEVEL/Switch/index.html",
  },
  // Práctica de temporizadores setTimeout y setInterval
  {
    cat: "mid",
    title: "Temporizadores",
    tag: "Mid Level",
    desc: "Control del tiempo con setTimeout, setInterval y clear.",
    href: "JAVASCRIPT MID LEVEL/Temporizadores/index.html",
  },
  // Práctica sobre código obsoleto y reemplazos modernos
  {
    cat: "mid",
    title: "Código Obsoleto",
    tag: "Mid Level",
    desc: "Patrones heredados y sus equivalentes actuales.",
    href: "JAVASCRIPT MID LEVEL/Codigo Obsoleto/index.html",
  },
  // Sub-prácticas de AJAX
  {
    cat: "mid",
    title: "AJAX (Editor)",
    tag: "Mid Level",
    desc: "Peticiones asíncronas clásicas con XMLHttpRequest.",
    href: "JAVASCRIPT MID LEVEL/Ajax/Ajax Editor/index.html",
  },
  {
    cat: "mid",
    title: "AJAX (Htdocs)",
    tag: "Mid Level",
    desc: "Práctica de AJAX en entorno de servidor local.",
    href: "JAVASCRIPT MID LEVEL/Ajax/Ajax Htdocs/index.html",
  },
  // Sub-prácticas de Librería Axios
  {
    cat: "mid",
    title: "Librería Axios (Editor)",
    tag: "Mid Level",
    desc: "Cliente HTTP basado en Promesas con Axios.",
    href: "JAVASCRIPT MID LEVEL/Libreria Axios/Axios Editor/index.html",
  },
  {
    cat: "mid",
    title: "Axios vs Fetch (Htdocs)",
    tag: "Mid Level",
    desc: "Comparativa práctica entre Axios y Fetch.",
    href: "JAVASCRIPT MID LEVEL/Libreria Axios/Axios-Fetch-Htdocs/index.html",
  },
  // Sub-prácticas de Eventos
  {
    cat: "mid",
    title: "Eventos: Handlers",
    tag: "Mid Level",
    desc: "Registro y remoción de escuchadores de eventos.",
    href: "JAVASCRIPT MID LEVEL/Eventos/Handlers/index.html",
  },
  {
    cat: "mid",
    title: "Eventos: Event Flow",
    tag: "Mid Level",
    desc: "Propagación de eventos (Bubbling y Capturing).",
    href: "JAVASCRIPT MID LEVEL/Eventos/Event Flow/index.html",
  },
  {
    cat: "mid",
    title: "Eventos de Mouse",
    tag: "Mid Level",
    desc: "Interacciones de clic, doble clic y movimiento.",
    href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Mouse/index.html",
  },
  {
    cat: "mid",
    title: "Eventos de Teclado",
    tag: "Mid Level",
    desc: "Captura de teclas con keydown, keyup y keypress.",
    href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Teclado/index.html",
  },
  {
    cat: "mid",
    title: "Eventos de Interfaz",
    tag: "Mid Level",
    desc: "Eventos load, resize, scroll y select.",
    href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Interfaz/index.html",
  },
  // Sub-práctica de DevTools
  {
    cat: "mid",
    title: "DevTools: Pestaña Application",
    tag: "Mid Level",
    desc: "Inspección de almacenamiento y caché en DevTools.",
    href: "JAVASCRIPT MID LEVEL/Pestañas DevTools/Application/index.html",
  },
  // Guías interactivas de carpeta para los módulos Mid Level
  {
    cat: "mid",
    title: "AJAX (XMLHttpRequest)",
    tag: "Mid Level",
    desc: "Realiza peticiones asíncronas sin recargar la página mediante XMLHttpRequest y maneja respuestas del servidor.",
    href: "JAVASCRIPT MID LEVEL/Ajax/index.html",
  },
  {
    cat: "mid",
    title: "Eventos del DOM",
    tag: "Mid Level",
    desc: "Domina addEventListener(), propagación (Bubbling/Capturing), eventos de mouse, teclado e interfaz.",
    href: "JAVASCRIPT MID LEVEL/Eventos/index.html",
  },
  {
    cat: "mid",
    title: "Librería Axios",
    tag: "Mid Level",
    desc: "Realiza peticiones HTTP simplificadas con transformación automática a JSON e interceptores usando Axios.",
    href: "JAVASCRIPT MID LEVEL/Libreria Axios/index.html",
  },
  {
    cat: "mid",
    title: "Objeto Location",
    tag: "Mid Level",
    desc: "Lee y manipula la URL actual del navegador mediante window.location (href, pathname, search, reload).",
    href: "JAVASCRIPT MID LEVEL/Location/index.html",
  },
  {
    cat: "mid",
    title: "Objetos Barprop",
    tag: "Mid Level",
    desc: "Inspecciona la visibilidad de barras del navegador (locationbar, menubar, scrollbars, toolbar).",
    href: "JAVASCRIPT MID LEVEL/Objetos Barprop/index.html",
  },
  {
    cat: "mid",
    title: "Pestañas de DevTools",
    tag: "Mid Level",
    desc: "Domina Elements, Console, Sources, Network, Performance (Timeline) y Application para depurar como un profesional.",
    href: "JAVASCRIPT MID LEVEL/Pestañas DevTools/index.html",
  },
  {
    cat: "mid",
    title: "Resize y Move",
    tag: "Mid Level",
    desc: "Controla eventos de redimensionamiento (resize) y métodos de tamaño/posición de ventana.",
    href: "JAVASCRIPT MID LEVEL/Resize y Move/index.html",
  },
  {
    cat: "mid",
    title: "Screen y Scroll",
    tag: "Mid Level",
    desc: "Consulta dimensiones físicas del monitor (window.screen) y controla el desplazamiento (scrollTo, scrollY).",
    href: "JAVASCRIPT MID LEVEL/Screen y Scroll/index.html",
  },
  {
    cat: "mid",
    title: "Objeto Window",
    tag: "Mid Level",
    desc: "Explora el objeto global del navegador: abrir/cerrar ventanas, alertas, dimensiones y propiedades globales.",
    href: "JAVASCRIPT MID LEVEL/Window/index.html",
  },
  // Acceso directo a la carpeta de las 25 guías Markdown de Mid Level
  {
    cat: "mid",
    title: "Documentación Completa Mid Level",
    tag: "25 Guías MD",
    desc: "Eventos, Axios, Window, DevTools, HTTP y más.",
    href: "JAVASCRIPT MID LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: JS JUNIOR LEVEL ---
  // Práctica de variables (var, let, const)
  {
    cat: "junior",
    title: "Variables",
    tag: "Junior Level",
    desc: "Declaración, alcance y tipos de datos básicos.",
    href: "JAVASCRIPT JUNIOR LEVEL/Variables/index.html",
  },
  // Práctica de operadores aritméticos y lógicos
  {
    cat: "junior",
    title: "Operadores",
    tag: "Junior Level",
    desc: "Operadores de asignación, comparación y lógicos.",
    href: "JAVASCRIPT JUNIOR LEVEL/Operadores/index.html",
  },
  // Práctica de concatenación y template literals
  {
    cat: "junior",
    title: "Concatenación",
    tag: "Junior Level",
    desc: "Unión de textos y uso de Template Strings.",
    href: "JAVASCRIPT JUNIOR LEVEL/Concatenacion/index.html",
  },
  // Práctica de estructuras condicionales if/else
  {
    cat: "junior",
    title: "Condicionales",
    tag: "Junior Level",
    desc: "Toma de decisiones con if, else if y else.",
    href: "JAVASCRIPT JUNIOR LEVEL/Condicionales/index.html",
  },
  // Práctica de arreglos y métodos fundamentales
  {
    cat: "junior",
    title: "Arrays y Métodos",
    tag: "Junior Level",
    desc: "Estructuras indexadas y métodos fundamentales.",
    href: "JAVASCRIPT JUNIOR LEVEL/Arrays/index.html",
  },
  // Práctica de bucles while y do...while
  {
    cat: "junior",
    title: "Bucles (while / do-while)",
    tag: "Junior Level",
    desc: "Repetición controlada de instrucciones.",
    href: "JAVASCRIPT JUNIOR LEVEL/Bucles/index.html",
  },
  // Práctica de bucle for, for...in y for...of
  {
    cat: "junior",
    title: "Bucle For",
    tag: "Junior Level",
    desc: "Iteración clásica y recorridos sobre colecciones.",
    href: "JAVASCRIPT JUNIOR LEVEL/For/index.html",
  },
  // Práctica de funciones declaradas y expresadas
  {
    cat: "junior",
    title: "Funciones",
    tag: "Junior Level",
    desc: "Parámetros, retorno de valores y reutilización.",
    href: "JAVASCRIPT JUNIOR LEVEL/Funciones/index.html",
  },
  // Práctica de Programación Orientada a Objetos en JS
  {
    cat: "junior",
    title: "POO (Programación Orientada a Objetos)",
    tag: "Junior Level",
    desc: "Clases, constructores, herencia y encapsulación.",
    href: "JAVASCRIPT JUNIOR LEVEL/POO/index.html",
  },
  // Práctica de métodos de cadenas de texto
  {
    cat: "junior",
    title: "Cadenas (Métodos)",
    tag: "Junior Level",
    desc: "Transformación, búsqueda y corte de strings.",
    href: "JAVASCRIPT JUNIOR LEVEL/Cadenas(Metodos)/index.html",
  },
  // Práctica de funciones matemáticas con el objeto Math
  {
    cat: "junior",
    title: "Objeto Math",
    tag: "Junior Level",
    desc: "Redondeos, raíces, aleatorios y constantes.",
    href: "JAVASCRIPT JUNIOR LEVEL/Math/index.html",
  },
  // Práctica de depuración en consola
  {
    cat: "junior",
    title: "Console.log y Depuración",
    tag: "Junior Level",
    desc: "Métodos de consola para inspeccionar variables y tablas.",
    href: "JAVASCRIPT JUNIOR LEVEL/Console.log/index.html",
  },
  // Práctica de manipulación del árbol DOM
  {
    cat: "junior",
    title: "DOM (Document Object Model)",
    tag: "Junior Level",
    desc: "Selección, creación y manipulación de nodos HTML.",
    href: "JAVASCRIPT JUNIOR LEVEL/Dom/index.html",
  },
  // Acceso directo a la carpeta de las 14 guías Markdown de Junior Level
  {
    cat: "junior",
    title: "Documentación Completa Junior Level",
    tag: "14 Guías MD",
    desc: "Variables, Operadores, Cadenas, Math, Condicionales.",
    href: "JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/index.html",
  },

  // --- SECCIÓN: HTML Y CSS (Guías Dinámicas, Prácticas y Proyectos) ---
  // 0. Mega-Portal Unificado HTML5 y CSS3
  {
    cat: "htmlcss",
    title: "🎨 Mega-Portal HTML5 y CSS3 (Ruta Completa)",
    tag: "Hub Completo",
    desc: "Mapa completo paso a paso con todos los temas, subtemas, guías de 10 slides, simuladores, proyectos y apuntes.",
    href: "HTML y CSS/index.html",
  },
  // 1. Guías Dinámicas Interactivas (10 Slides con Simulador, Quiz y Laboratorio)
  {
    cat: "htmlcss",
    title: "HTML Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Estructura base HTML5, títulos, párrafos, enlaces, imágenes, listas, probador de inputs, quiz y laboratorio.",
    href: "HTML y CSS/HTML BASICO/index.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "HTML semántico, formularios avanzados, tablas, multimedia, lazy loading, inspector semántico, quiz y lab.",
    href: "HTML y CSS/HTML avanzado/index.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Básico (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Selectores, Box Model, simulador border-box, unidades de medida, colores, tipografía, sombras, quiz y lab.",
    href: "HTML y CSS/CSS BASICO/index.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Cascada, especificidad, simulador position/z-index, pseudoclases, pseudoelementos, BEM, quiz y lab.",
    href: "HTML y CSS/CSS avanzado/index.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Eje principal y cruzado, simulador Flexbox en vivo, grow/shrink/basis, patrones reales, quiz y lab.",
    href: "HTML y CSS/Flexbox/index.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Grid (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Unidades fr, repeat(), minmax(), simulador Grid en vivo, áreas, Subgrid, quiz y laboratorio.",
    href: "HTML y CSS/Grid/index.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones CSS (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Transiciones vs @keyframes, simulador de curvas cubic-bezier, rendimiento GPU 60 FPS, scroll, quiz y lab.",
    href: "HTML y CSS/Animaciones/index.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones CSS Avanzadas (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Variables CSS, simulador clamp() y color-mix(), calc(), dvh, clip-path, backdrop-filter, quiz y lab.",
    href: "HTML y CSS/Funciones Avanzadas/index.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive Design (Guía Interactiva)",
    tag: "14 Slides",
    desc: "Mobile First, simulador de breakpoints, Media Queries, Container Queries, srcset/<picture>, quiz y lab.",
    href: "HTML y CSS/Responsive Design/index.html",
  },
  {
    cat: "htmlcss",
    title: "Documentación Completa HTML y CSS",
    tag: "8 Guías MD",
    desc: "Lector interactivo de apuntes: HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones y Hosting.",
    href: "HTML y CSS/Documentacion/index.html",
  },

  // 2. Prácticas por Temática — HTML Básico
  {
    cat: "htmlcss",
    title: "HTML Básico: Títulos y Párrafos",
    tag: "HTML Básico",
    desc: "Jerarquía de encabezados h1–h6 y formato de párrafos.",
    href: "HTML y CSS/HTML BASICO/Titulos y parrafos.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Básico: Listas",
    tag: "HTML Básico",
    desc: "Listas ordenadas <ol>, desordenadas <ul> y elementos <li>.",
    href: "HTML y CSS/HTML BASICO/listas.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Básico: Enlaces",
    tag: "HTML Básico",
    desc: "Navegación con etiquetas <a>, rutas relativas y target.",
    href: "HTML y CSS/HTML BASICO/enlaces.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Básico: Imágenes",
    tag: "HTML Básico",
    desc: "Inserción de imágenes con <img>, src y texto alternativo alt.",
    href: "HTML y CSS/HTML BASICO/img.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Básico: Formularios",
    tag: "HTML Básico",
    desc: "Campos de entrada <input>, botones y envío básico.",
    href: "HTML y CSS/HTML BASICO/formularios.html",
  },

  // 4. Prácticas de HTML Avanzado
  {
    cat: "htmlcss",
    title: "HTML Avanzado: HTML Semántico",
    tag: "HTML Avanzado",
    desc: "Uso de <header>, <nav>, <main>, <article>, <aside> y <footer>.",
    href: "HTML y CSS/HTML avanzado/HTML Semantico/HTML semantico.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Accesibilidad (ARIA)",
    tag: "HTML Avanzado",
    desc: "Buenas prácticas de accesibilidad web y atributos ARIA.",
    href: "HTML y CSS/HTML avanzado/Accesibilidad/accesibilidad.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Tablas",
    tag: "HTML Avanzado",
    desc: "Tablas semánticas con <thead>, <tbody>, <th> y colspan.",
    href: "HTML y CSS/HTML avanzado/tablas.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Audio y Video",
    tag: "HTML Avanzado",
    desc: "Reproducción multimedia nativa con <audio> y <video>.",
    href: "HTML y CSS/HTML avanzado/audio y video/audio y video.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Lazy Loading",
    tag: "HTML Avanzado",
    desc: "Carga diferida de recursos con loading='lazy'.",
    href: "HTML y CSS/HTML avanzado/Lazy load/lazy.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Select, Datalist y Option",
    tag: "HTML Avanzado",
    desc: "Listas desplegables y autocompletado nativo en formularios.",
    href: "HTML y CSS/HTML avanzado/selec,datalist y option.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Fieldset y Legend",
    tag: "HTML Avanzado",
    desc: "Agrupación semántica de controles de formulario.",
    href: "HTML y CSS/HTML avanzado/fieldset y legend.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Textarea y Labels",
    tag: "HTML Avanzado",
    desc: "Áreas de texto multilínea y vinculación accesible con <label>.",
    href: "HTML y CSS/HTML avanzado/text-area y labels.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Details y Summary",
    tag: "HTML Avanzado",
    desc: "Componentes desplegables nativos sin JavaScript.",
    href: "HTML y CSS/HTML avanzado/details y summary.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Enlaces Avanzados",
    tag: "HTML Avanzado",
    desc: "Descargas, anclas internas, tel:, mailto: y seguridad.",
    href: "HTML y CSS/HTML avanzado/Enlaces avanzados/enlaces avanzado.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Metatags e Iconos",
    tag: "HTML Avanzado",
    desc: "Comentarios, favicons y meta etiquetas SEO/OpenGraph.",
    href: "HTML y CSS/HTML avanzado/comentarios-metatags-iconos.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: Emmet",
    tag: "HTML Avanzado",
    desc: "Abreviaturas rápidas para generar estructura HTML.",
    href: "HTML y CSS/HTML avanzado/Emmet/emmet.html",
  },
  {
    cat: "htmlcss",
    title: "HTML Avanzado: HTML Obsoleto",
    tag: "HTML Avanzado",
    desc: "Etiquetas deprecadas en HTML5 y sus reemplazos modernos.",
    href: "HTML y CSS/HTML avanzado/HTML obsoleto.html",
  },

  // 5. Prácticas de CSS Básico (integradas en CSS Básico: Guía Interactiva)
  // 6. Prácticas de CSS Avanzado
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Selectores",
    tag: "CSS Avanzado",
    desc: "Selectores de atributo, combinadores y jerarquía.",
    href: "HTML y CSS/CSS avanzado/selectores/selectores.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Herencia",
    tag: "CSS Avanzado",
    desc: "Propiedades heredables, inherit, initial y unset.",
    href: "HTML y CSS/CSS avanzado/Herencia/herencia.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Display",
    tag: "CSS Avanzado",
    desc: "Comportamiento de cajas block, inline, inline-block y none.",
    href: "HTML y CSS/CSS avanzado/Display/display.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Position Relative",
    tag: "CSS Avanzado",
    desc: "Desplazamiento relativo y contexto de referencia.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-relative.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Position Absolute",
    tag: "CSS Avanzado",
    desc: "Posicionamiento absoluto respecto al ancestro posicionado.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-absolute.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Position Fixed",
    tag: "CSS Avanzado",
    desc: "Elementos fijos respecto a la ventana del navegador.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-fixed.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Position Sticky",
    tag: "CSS Avanzado",
    desc: "Encabezados pegajosos al hacer scroll.",
    href: "HTML y CSS/CSS avanzado/Position/position_html/position-sticky.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Pseudoclases",
    tag: "CSS Avanzado",
    desc: "Estados :hover, :focus, :nth-child() y :not().",
    href: "HTML y CSS/CSS avanzado/Pseudoclases/pseudoclases.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Pseudoelementos",
    tag: "CSS Avanzado",
    desc: "Elementos virtuales ::before, ::after y ::first-letter.",
    href: "HTML y CSS/CSS avanzado/Pseudoelementos/pseudoelementos.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Metodología BEM",
    tag: "CSS Avanzado",
    desc: "Nomenclatura Block__Element--Modifier para CSS escalable.",
    href: "HTML y CSS/CSS avanzado/BEM/bem.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Object Fit & Position",
    tag: "CSS Avanzado",
    desc: "Recorte y encuadre de imágenes con cover y contain.",
    href: "HTML y CSS/CSS avanzado/Object Fit_Position/fit_position.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Overflow",
    tag: "CSS Avanzado",
    desc: "Control de desbordamiento con hidden, scroll y auto.",
    href: "HTML y CSS/CSS avanzado/Overflow/overflow.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Outline",
    tag: "CSS Avanzado",
    desc: "Contornos externos y foco accesible sin mover el layout.",
    href: "HTML y CSS/CSS avanzado/Outline/outline.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Control de Flujo de Texto",
    tag: "CSS Avanzado",
    desc: "Ajuste de palabras largas, white-space y text-overflow.",
    href: "HTML y CSS/CSS avanzado/Control_flujo_texto/control_texto.html",
  },
  {
    cat: "htmlcss",
    title: "CSS Avanzado: Transition",
    tag: "CSS Avanzado",
    desc: "Transiciones suaves entre cambios de estado.",
    href: "HTML y CSS/CSS avanzado/Transition/transition.html",
  },

  // 7. Prácticas de Flexbox
  {
    cat: "htmlcss",
    title: "Flexbox: Flex Direction",
    tag: "Flexbox",
    desc: "Dirección del eje principal: row, row-reverse, column.",
    href: "HTML y CSS/Flexbox/Flex_Direction/direction.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Alineación",
    tag: "Flexbox",
    desc: "Distribución con justify-content y align-items.",
    href: "HTML y CSS/Flexbox/Alineacion/alineacion.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Wrap y Flow",
    tag: "Flexbox",
    desc: "Saltos de línea automáticos con flex-wrap y flex-flow.",
    href: "HTML y CSS/Flexbox/Wrap y Flow/wrap_flow.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Grow, Shrink y Basis",
    tag: "Flexbox",
    desc: "Crecimiento, encogimiento y tamaño base de ítems flex.",
    href: "HTML y CSS/Flexbox/Grow,Shrink y Basis/grow.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Order",
    tag: "Flexbox",
    desc: "Reordenamiento visual de elementos flex sin tocar HTML.",
    href: "HTML y CSS/Flexbox/Order/order.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Align Self",
    tag: "Flexbox",
    desc: "Alineación individual de un hijo en el eje transversal.",
    href: "HTML y CSS/Flexbox/Align Self/align.html",
  },
  {
    cat: "htmlcss",
    title: "Flexbox: Layout Completo",
    tag: "Flexbox",
    desc: "Maquetación práctica de interfaz usando Flexbox.",
    href: "HTML y CSS/Flexbox/Layout/layout.html",
  },

  // 8. Prácticas de CSS Grid
  {
    cat: "htmlcss",
    title: "Grid: Principios",
    tag: "CSS Grid",
    desc: "Creación de cuadrículas con display: grid, filas y columnas.",
    href: "HTML y CSS/Grid/Principios/grid.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Auto y FR",
    tag: "CSS Grid",
    desc: "Reparto proporcional del espacio libre con la unidad fr.",
    href: "HTML y CSS/Grid/Auto y FR/auto.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Repeat",
    tag: "CSS Grid",
    desc: "Definición compacta de pistas repetitivas con repeat().",
    href: "HTML y CSS/Grid/Repeat/repeat.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Gap",
    tag: "CSS Grid",
    desc: "Separación entre filas y columnas sin márgenes extras.",
    href: "HTML y CSS/Grid/Gap/gap.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Row y Column",
    tag: "CSS Grid",
    desc: "Expansión de celdas con grid-column, grid-row y span.",
    href: "HTML y CSS/Grid/Row-Column/row-column.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Áreas (Template Areas)",
    tag: "CSS Grid",
    desc: "Maquetación visual nombrando áreas con grid-template-areas.",
    href: "HTML y CSS/Grid/Area/area.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Alineación",
    tag: "CSS Grid",
    desc: "Alineación de ítems y pistas con place-items y place-content.",
    href: "HTML y CSS/Grid/Alineacion/alineacion.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Explícito e Implícito",
    tag: "CSS Grid",
    desc: "Control de pistas automáticas con grid-auto-rows y flow.",
    href: "HTML y CSS/Grid/Grid Explicito e Implicito/exp-imp.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Dense",
    tag: "CSS Grid",
    desc: "Relleno automático de huecos con grid-auto-flow: dense.",
    href: "HTML y CSS/Grid/Dense/dense.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Dinámico (Responsive)",
    tag: "CSS Grid",
    desc: "Grillas adaptables con auto-fit, auto-fill y minmax().",
    href: "HTML y CSS/Grid/Dinamico(Responsive)/dinamico.html",
  },
  {
    cat: "htmlcss",
    title: "Grid: Subgrid",
    tag: "CSS Grid",
    desc: "Alineación de hijos anidados con la cuadrícula del padre.",
    href: "HTML y CSS/Grid/Subgrid/subgrid.html",
  },

  // 9. Prácticas de Animaciones
  {
    cat: "htmlcss",
    title: "Animaciones: Keyframes Base",
    tag: "Animaciones",
    desc: "Creación de animaciones declarativas con @keyframes.",
    href: "HTML y CSS/Animaciones/Animaciones/animaciones.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones: Botones Animados",
    tag: "Animaciones",
    desc: "Microinteracciones y efectos hover en botones.",
    href: "HTML y CSS/Animaciones/Botones Animados/botones.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones: Texto Animado",
    tag: "Animaciones",
    desc: "Efectos de entrada, escritura y degradados en texto.",
    href: "HTML y CSS/Animaciones/Texto/texto.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones: Transiciones (Repaso)",
    tag: "Animaciones",
    desc: "Repaso práctico de timing-functions y transiciones.",
    href: "HTML y CSS/Animaciones/Transiciones (Repaso)/transiciones.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones: Scroll Container",
    tag: "Animaciones",
    desc: "Animaciones vinculadas al progreso de scroll del contenedor.",
    href: "HTML y CSS/Animaciones/Scroll/Scroll Container/scroll.html",
  },
  {
    cat: "htmlcss",
    title: "Animaciones: Scroll View",
    tag: "Animaciones",
    desc: "Animaciones activadas al entrar en el viewport con view().",
    href: "HTML y CSS/Animaciones/Scroll/View/view.html",
  },

  // 10. Prácticas de Funciones Avanzadas
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Variables CSS",
    tag: "CSS Moderno",
    desc: "Custom properties (--var) y temas dinámicos.",
    href: "HTML y CSS/Funciones Avanzadas/Variables/variables.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Calc()",
    tag: "CSS Moderno",
    desc: "Operaciones matemáticas mezclando unidades en CSS.",
    href: "HTML y CSS/Funciones Avanzadas/Calc/calc.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Min, Max y Clamp",
    tag: "CSS Moderno",
    desc: "Dimensiones y tipografías fluidas con límites seguros.",
    href: "HTML y CSS/Funciones Avanzadas/Max Min Clamp/max-min.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Unidades del Viewport",
    tag: "CSS Moderno",
    desc: "Uso de vw, vh, dvh, svh y lvh en pantallas modernas.",
    href: "HTML y CSS/Funciones Avanzadas/Unidades del Viewport/unidades.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Color Mix",
    tag: "CSS Moderno",
    desc: "Mezcla nativa de colores en CSS con color-mix().",
    href: "HTML y CSS/Funciones Avanzadas/Color MIx/color.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Filter y Backdrop",
    tag: "CSS Moderno",
    desc: "Efectos blur, desenfoque de fondo y glassmorphism.",
    href: "HTML y CSS/Funciones Avanzadas/Filter y Backdrop/filter.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Clip Path",
    tag: "CSS Moderno",
    desc: "Recortes poligonales, círculos y máscaras geométricas.",
    href: "HTML y CSS/Funciones Avanzadas/Clip Path/clip.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Transform",
    tag: "CSS Moderno",
    desc: "Traslación, rotación, escala e inclinación 2D/3D.",
    href: "HTML y CSS/Funciones Avanzadas/Transform/transform.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Initial Letter",
    tag: "CSS Moderno",
    desc: "Letras capitales estilo editorial con initial-letter.",
    href: "HTML y CSS/Funciones Avanzadas/Initial Letter/initial.html",
  },
  {
    cat: "htmlcss",
    title: "Funciones Avanzadas: Scroll",
    tag: "CSS Moderno",
    desc: "Comportamiento de scroll suave y scroll-snap.",
    href: "HTML y CSS/Funciones Avanzadas/Scroll/scroll.html",
  },

  // 11. Prácticas de Responsive Design
  {
    cat: "htmlcss",
    title: "Responsive: Mobile Design",
    tag: "Responsive",
    desc: "Principios de diseño enfocado en dispositivos móviles.",
    href: "HTML y CSS/Responsive Design/Mobile Design/mobile.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Media Queries",
    tag: "Responsive",
    desc: "Puntos de quiebre con @media (min-width / max-width).",
    href: "HTML y CSS/Responsive Design/Media Queries/mediaq.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Container Queries",
    tag: "Responsive",
    desc: "Componentes adaptables al tamaño de su contenedor padre.",
    href: "HTML y CSS/Responsive Design/Container Queries/container.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Feature Queries",
    tag: "Responsive",
    desc: "Detección de soporte CSS moderno con @supports.",
    href: "HTML y CSS/Responsive Design/Feature Queries/features.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Bloques Flexibles",
    tag: "Responsive",
    desc: "Contenedores fluidos que se adaptan al ancho disponible.",
    href: "HTML y CSS/Responsive Design/Bloques Flexibles/bloques_flexibles.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Holy Grail Layout",
    tag: "Responsive",
    desc: "Maquetación clásica de cabecera, 3 columnas y pie adaptable.",
    href: "HTML y CSS/Responsive Design/Holi Grail/holigrail.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Multimedia Flexible",
    tag: "Responsive",
    desc: "Imágenes y videos fluidos sin desbordar la pantalla.",
    href: "HTML y CSS/Responsive Design/Multimedia Flexible/multimedia.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Picture, Source y Media",
    tag: "Responsive",
    desc: "Dirección de arte y formatos WebP con <picture>.",
    href: "HTML y CSS/Responsive Design/Picture,Source,Media/picture.html",
  },
  {
    cat: "htmlcss",
    title: "Responsive: Srcset y Sizes",
    tag: "Responsive",
    desc: "Entrega de imágenes óptimas según resolución y tamaño.",
    href: "HTML y CSS/Responsive Design/Srcset y Sizes/src-szs.html",
  },

  // 12. Ejercicios Prácticos
  {
    cat: "htmlcss",
    title: "Ejercicio: Ventana Modal",
    tag: "Ejercicio",
    desc: "Construcción de una ventana modal con <dialog>, position y metodología BEM.",
    href: "HTML y CSS/CSS avanzado/Ejercicios/Ventana Modal/modal.html",
  },

  // 13. Proyectos Integradores (al final)
  {
    cat: "htmlcss",
    title: "Proyectos HTML y CSS (Guía + Showcase)",
    tag: "Proyecto",
    desc: "Guía arquitectónica de los 7 proyectos reales de CSS puro, quiz de técnicas y acceso directo.",
    href: "HTML y CSS/PROYECTOS/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Chatbox",
    tag: "Proyecto",
    desc: "Interfaz de mensajería moderna con Flexbox y burbujas.",
    href: "HTML y CSS/PROYECTOS/CHATBOX/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Flipper Card 3D",
    tag: "Proyecto",
    desc: "Efecto de rotación 3D con perspectiva CSS.",
    href: "HTML y CSS/PROYECTOS/FLIPPER CARD/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: One View Page",
    tag: "Proyecto",
    desc: "Maquetación de pantalla completa con diseño limpio.",
    href: "HTML y CSS/PROYECTOS/ONE VIEW PAGE/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Sidebar Menu",
    tag: "Proyecto",
    desc: "Barra de navegación lateral adaptable con transiciones.",
    href: "HTML y CSS/PROYECTOS/SIDEBAR MENU/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Web Page",
    tag: "Proyecto",
    desc: "Sitio web completo estructurado con Grid y Flexbox.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Web Page Animations",
    tag: "Proyecto",
    desc: "Transiciones y @keyframes aplicados a una landing page.",
    href: "HTML y CSS/PROYECTOS/WEB PAGE ANIMATIONS/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Accordion Menu (Divs)",
    tag: "Proyecto",
    desc: "Acordeón interactivo construido con contenedores div.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/DIVS/index.html",
  },
  {
    cat: "htmlcss",
    title: "Proyecto: Accordion (Summary)",
    tag: "Proyecto",
    desc: "Acordeón semántico nativo usando <details> y <summary>.",
    href: "HTML y CSS/PROYECTOS/ACCORDION MENU/SUMMARY-DETAILS/index.html",
  },
];

// Diccionario que asigna un título legible con emoji a cada categoría del portal
const titles = {
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
};

// Referencia al contenedor principal donde se inyectan las secciones y tarjetas
const portal = document.getElementById("portalContent");
// Referencia al campo de búsqueda en tiempo real
const searchInput = document.getElementById("searchInput");
// Colección de todos los botones de filtro por categoría
const filterBtns = document.querySelectorAll(".filter-btn");
// Variable que almacena el filtro de categoría seleccionado actualmente
let activeFilter = "all";

// Función principal encargada de filtrar y renderizar dinámicamente el catálogo en el DOM
function render() {
  // Obtenemos el texto buscado sin espacios sobrantes y en minúsculas para comparación insensible a mayúsculas
  const q = searchInput.value.trim().toLowerCase();
  // Limpiamos el contenido previo del portal antes de volver a dibujar
  portal.innerHTML = "";

  // Definimos el orden visual en que se mostrarán las categorías
  const order = ["master", "ejercicios", "mid", "junior", "htmlcss"];
  // Recorremos cada categoría en el orden establecido
  order.forEach((cat) => {
    // Si hay un filtro activo distinto de 'all' y no coincide con esta categoría, la omitimos
    if (activeFilter !== "all" && activeFilter !== cat) return;
    // Filtramos los módulos que pertenecen a esta categoría y coinciden con la búsqueda
    const items = modules.filter(
      (m) =>
        m.cat === cat &&
        (m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.tag.toLowerCase().includes(q)),
    );
    // Si ningún módulo coincide en esta categoría, no creamos sección vacía
    if (items.length === 0) return;

    // Creamos el elemento <section> contenedor de la categoría
    const sec = document.createElement("section");
    // Asignamos la clase CSS de sección de curso
    sec.className = "course-section";
    // Insertamos el título correspondiente de la categoría con el conteo de elementos
    sec.innerHTML = `<h2 class="course-title">${titles[cat]} <span class="tag">${items.length}</span></h2>`;

    // Creamos el contenedor en cuadrícula para las tarjetas de esta categoría
    const grid = document.createElement("div");
    // Asignamos la clase CSS de rejilla responsiva
    grid.className = "grid";

    // Leemos el progreso guardado en localStorage para marcar tarjetas completadas
    let progressMap = {};
    try { progressMap = JSON.parse(localStorage.getItem("curso_web_progress") || "{}"); } catch (_) {}

    // Recorremos cada módulo filtrado para construir su tarjeta clicable
    items.forEach((item) => {
      // Creamos un enlace <a> para que toda la tarjeta sea navegable
      const a = document.createElement("a");
      // Asignamos la clase CSS de tarjeta estilo Glassmorphism
      a.className = "card";
      // Codificamos la ruta para manejar espacios y caracteres especiales en la URL
      a.href = encodeURI(item.href);
      // Detectamos si la etiqueta corresponde a documentación o proyectos para darle color distinto
      const isDoc = item.tag.includes("MD") || item.tag === "Proyecto";
      const done = progressMap[item.href]?.completed;
      const doneMark = done ? ' <span title="Completado">✅</span>' : '';
      // Construimos el HTML interno de la tarjeta con título, badge y descripción
      a.innerHTML = `
                <div class="card-top">
                    <span class="card-title">${item.title}${doneMark}</span>
                    <span class="tag ${isDoc ? "tag-doc" : ""}">${item.tag}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
            `;
      // Añadimos la tarjeta a la cuadrícula
      grid.appendChild(a);
    });

    // Insertamos la cuadrícula dentro de la sección
    sec.appendChild(grid);
    // Insertamos la sección completa dentro del portal principal
    portal.appendChild(sec);
  });
}

// Registramos el evento clic en cada botón de filtro para cambiar la categoría activa
filterBtns.forEach((btn) => {
  // Escuchamos el clic del botón actual
  btn.addEventListener("click", () => {
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

// Escuchamos el evento 'input' en la barra de búsqueda para filtrar en tiempo real al escribir
searchInput.addEventListener("input", render);

// Conectamos los botones de la Ruta Visual Paso a Paso para activar el filtro correspondiente con un clic
document.querySelectorAll(".path-step").forEach((stepBtn) => {
  // Escuchamos el clic en cada paso de la ruta
  stepBtn.addEventListener("click", () => {
    // Obtenemos la categoría destino desde data-jump
    const targetCat = stepBtn.dataset.jump;
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
