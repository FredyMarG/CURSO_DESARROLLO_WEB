// Activamos el modo estricto de JavaScript para evitar errores silenciosos y variables globales accidentales
'use strict';

// Arreglo maestro que contiene todos los módulos, guías interactivas, ejercicios, proyectos y documentación del curso
const modules = [
    // --- SECCIÓN: JS MASTER LEVEL (19 Guías Interactivas de 11-12 diapositivas + Documentación) ---
    // Módulo de consumo de APIs REST con Fetch, AbortController y Promise.all
    { cat: "master", title: "APIs y Fetch", tag: "11 Slides", desc: "Consumo RESTful, fetch(), AbortController y Promise.all.", href: "JAVASCRIPT MASTER LEVEL/Apis/index.html" },
    // Módulo de Cache API (CacheStorage) para aplicaciones rápidas y soporte offline
    { cat: "master", title: "Cache API (caches)", tag: "12 Slides", desc: "CacheStorage, put/match/delete, estrategias PWA y soporte offline.", href: "JAVASCRIPT MASTER LEVEL/Cache/index.html" },
    // Módulo de API nativa de arrastrar y soltar elementos y archivos
    { cat: "master", title: "Drag & Drop", tag: "11 Slides", desc: "Eventos de arrastre, dataTransfer y archivos del escritorio.", href: "JAVASCRIPT MASTER LEVEL/Drag & Drop/index.html" },
    // Módulo de lectura de archivos locales en el navegador con FileReader
    { cat: "master", title: "FileReader API", tag: "11 Slides", desc: "Lectura de texto, DataURL, ArrayBuffer y barras de carga.", href: "JAVASCRIPT MASTER LEVEL/File Reader/index.html" },
    // Módulo sobre sintaxis de funciones flecha, this léxico, closures y recursividad
    { cat: "master", title: "Funciones Flecha", tag: "12 Slides", desc: "Sintaxis, ámbito léxico de this, closures y recursividad.", href: "JAVASCRIPT MASTER LEVEL/Funciones Flecha/index.html" },
    // Módulo de geolocalización con getCurrentPosition y watchPosition
    { cat: "master", title: "Geolocalización", tag: "11 Slides", desc: "getCurrentPosition(), watchPosition() y manejo de errores.", href: "JAVASCRIPT MASTER LEVEL/Geolocalization/index.html" },
    // Módulo de navegación SPA sin recarga mediante History API
    { cat: "master", title: "History API", tag: "11 Slides", desc: "pushState, replaceState, popstate y scrollRestoration.", href: "JAVASCRIPT MASTER LEVEL/Historial/index.html" },
    // Módulo de base de datos NoSQL asíncrona en el navegador (IndexedDB)
    { cat: "master", title: "IndexedDB", tag: "12 Slides", desc: "Base NoSQL en el navegador, transacciones, índices y cursores.", href: "JAVASCRIPT MASTER LEVEL/IndexedDB/index.html" },
    // Módulo de detección eficiente de visibilidad de elementos con IntersectionObserver
    { cat: "master", title: "Intersection Observer", tag: "12 Slides", desc: "Lazy loading, scroll infinito y laboratorio interactivo real.", href: "JAVASCRIPT MASTER LEVEL/Intersection Observer/index.html" },
    // Módulo de almacenamiento persistente clave-valor en el navegador
    { cat: "master", title: "Local Storage", tag: "11 Slides", desc: "Almacenamiento persistente, JSON y sincronización multi-pestaña.", href: "JAVASCRIPT MASTER LEVEL/Local Storage/index.html" },
    // Módulo de evaluación dinámica de Media Queries CSS desde JavaScript
    { cat: "master", title: "window.matchMedia()", tag: "12 Slides", desc: "Media Queries reactivas en JS y laboratorio de breakpoints.", href: "JAVASCRIPT MASTER LEVEL/Matchmedia/index.html" },
    // Módulo de optimización de funciones puras mediante caché en memoria (Memoization)
    { cat: "master", title: "Memoization", tag: "12 Slides", desc: "Caché de funciones puras, Closures, Map/WeakMap y optimización O(n).", href: "JAVASCRIPT MASTER LEVEL/Memoization/index.html" },
    // Módulo sobre la directiva 'use strict', seguridad y módulos ES6
    { cat: "master", title: "Modo Estricto", tag: "11 Slides", desc: "'use strict', ES Modules, seguridad y optimización.", href: "JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html" },
    // Módulo sobre las interfaces del objeto BOM window.navigator
    { cat: "master", title: "Objeto Navigator", tag: "12 Slides", desc: "Interfaces BOM, red, hardware, storage y Clipboard API.", href: "JAVASCRIPT MASTER LEVEL/Navigator/index.html" },
    // Módulo de alertas nativas del sistema operativo con Notifications API
    { cat: "master", title: "Notifications API", tag: "12 Slides", desc: "Permisos, alertas nativas del SO y Service Workers.", href: "JAVASCRIPT MASTER LEVEL/Notifications/index.html" },
    // Módulo sobre fechas, horas y formateo internacional con Date e Intl
    { cat: "master", title: "Objeto Date", tag: "11 Slides", desc: "Fechas, horas y formateo moderno con Intl.DateTimeFormat.", href: "JAVASCRIPT MASTER LEVEL/Objeto Date/index.html" },
    // Módulo sobre expresiones condicionales cortas y Nullish Coalescing
    { cat: "master", title: "Operador Ternario", tag: "11 Slides", desc: "Expresiones condicionales, ?? Nullish Coalescing y legibilidad.", href: "JAVASCRIPT MASTER LEVEL/Operador Ternario/index.html" },
    // Módulo sobre herencia prototípica, Prototype Chain y clases ES6+
    { cat: "master", title: "Prototipos", tag: "11 Slides", desc: "Prototype Chain, herencia prototípica y equivalencia con class.", href: "JAVASCRIPT MASTER LEVEL/Prototipos/index.html" },
    // Módulo de Service Workers para proxy de red, PWAs y modo offline
    { cat: "master", title: "Service Workers", tag: "12 Slides", desc: "Ciclo de vida, fetch offline, Cache API y postMessage().", href: "JAVASCRIPT MASTER LEVEL/Service Workers/index.html" },
    // Módulo de detección de pestaña activa o en segundo plano (Page Visibility API)
    { cat: "master", title: "Visibility Change", tag: "12 Slides", desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.", href: "JAVASCRIPT MASTER LEVEL/Visibility Change/index.html" },
    // Módulo de ejecución paralela en hilos secundarios con Web Workers
    { cat: "master", title: "Web Workers", tag: "12 Slides", desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.", href: "JAVASCRIPT MASTER LEVEL/Web Workers/index.html" },
    // Acceso directo a las 20 guías Markdown de Master Level
    { cat: "master", title: "Documentación Completa Master Level", tag: "20 Guías MD", desc: "Todas las guías teóricas, ejercicios y cheatsheets de Master Level.", href: "JAVASCRIPT MASTER LEVEL/DOCUMENTACION/" },

    // --- SECCIÓN: EJERCICIOS PRÁCTICOS (MASTER, MID Y JUNIOR LEVEL) ---
    // Ejercicio Master: carga diferida progresiva y animación al scroll
    { cat: "ejercicios", title: "Lazy Load con IntersectionObserver", tag: "Master", desc: "Carga progresiva de 45 publicaciones con animación al scroll.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html" },
    // Ejercicio Master: CRUD persistente usando IndexedDB
    { cat: "ejercicios", title: "CRUD con IndexedDB", tag: "Master", desc: "Gestor persistente de nombres en IndexedDB.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html" },
    // Ejercicio Master: carga por arrastre con barra de progreso animada
    { cat: "ejercicios", title: "Drag & Drop File Reader", tag: "Master", desc: "Carga de archivos con barra de progreso animada.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html" },
    // Ejercicio Master: galería mosaico interactiva con Lightbox
    { cat: "ejercicios", title: "Galería Dinámica", tag: "Master", desc: "Bento Grid interactivo con FileReader y Lightbox.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html" },
    // Ejercicio Master: selector de idioma persistente con LocalStorage
    { cat: "ejercicios", title: "Idioma con LocalStorage", tag: "Master", desc: "Selector bilingüe persistente con modal animado.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html" },
    // Ejercicio Master: reloj digital en tiempo real con el objeto Date
    { cat: "ejercicios", title: "Reloj Digital (Date)", tag: "Master", desc: "Reloj digital en tiempo real con setInterval.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html" },
    // Ejercicio Master: aplicación de texturas mediante Drag & Drop
    { cat: "ejercicios", title: "Texturizador Drag & Drop", tag: "Master", desc: "Aplicación de texturas por arrastre con dataTransfer.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html" },

    // Ejercicios Mid Level (7)
    // Ejercicio Mid 1: Comprar computador
    { cat: "ejercicios", title: "1. Comprar Computador", tag: "Mid", desc: "Práctica de objetos, condiciones y presupuesto en pantalla.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/1 Comprar Computador/index.html" },
    // Ejercicio Mid 2: Mostrar datos web
    { cat: "ejercicios", title: "2. Mostrar Datos Web", tag: "Mid", desc: "Renderizado dinámico de información en el DOM.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/2 Mostrar Datos Web/index.html" },
    // Ejercicio Mid 3: Materia pendiente
    { cat: "ejercicios", title: "3. Materia Pendiente", tag: "Mid", desc: "Validación de formularios y gestión de materias.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/3 Materia Pendiente/index.html" },
    // Ejercicio Mid 4: Recuperación de materia por docente
    { cat: "ejercicios", title: "4. Recuperación por Docente", tag: "Mid", desc: "Asignación y control de estado académico.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/4 Recuperacion de Materia por Docente/index.html" },
    // Ejercicio Mid 5: Promedio de notas corrección
    { cat: "ejercicios", title: "5. Promedio de Notas", tag: "Mid", desc: "Cálculo y validación de promedios con manejo de errores.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/5 Promedio de Notas Corrección/index.html" },
    // Ejercicio Mid 6: Notas de Cofla
    { cat: "ejercicios", title: "6. Notas de Cofla", tag: "Mid", desc: "Promesas y asincronía simulando obtención de calificaciones.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/6 Notas de Cofla/index.html" },
    // Ejercicio Mid 7: Compañeros de Cofla Htdocs
    { cat: "ejercicios", title: "7. Compañeros de Cofla", tag: "Mid", desc: "Consumo asíncrono de datos con Fetch/Axios.", href: "JAVASCRIPT MID LEVEL/EJERCICIOS/7 Compañeros de Cofla Htdocs/index.html" },

    // Ejercicios Junior Level (12)
    // Ejercicio Junior 1: Helados y precios
    { cat: "ejercicios", title: "1. Helados y Precios", tag: "Junior", desc: "Condicionales y selección de productos según dinero disponible.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/1 Helados y Precios/index.html" },
    // Ejercicio Junior 2: Fiesta y entrada
    { cat: "ejercicios", title: "2. Fiesta y Entrada", tag: "Junior", desc: "Control de edad y horario con funciones y condicionales.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/2 Fiesta y Entrada/index.html" },
    // Ejercicio Junior 3: Asistencia
    { cat: "ejercicios", title: "3. Control de Asistencia", tag: "Junior", desc: "Registro de asistencia con bucles y arreglos.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/3 Asistencia/index.html" },
    // Ejercicio Junior 4: Calculadora básica
    { cat: "ejercicios", title: "4. Calculadora Básica", tag: "Junior", desc: "Operaciones aritméticas básicas mediante funciones.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/4 Calculadora Básica/index.html" },
    // Ejercicio Junior 5: Celular nuevo
    { cat: "ejercicios", title: "5. Celular Nuevo (POO)", tag: "Junior", desc: "Modelado de dispositivos con clases y métodos.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/5 Celular Nuevo/index.html" },
    // Ejercicio Junior 6: Apps celular nuevo
    { cat: "ejercicios", title: "6. Apps Celular Nuevo", tag: "Junior", desc: "Simulación de descarga e instalación de aplicaciones.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/6 Apps Celular Nuevo/index.html" },
    // Ejercicio Junior 7: Calculadora avanzada
    { cat: "ejercicios", title: "7. Calculadora Avanzada", tag: "Junior", desc: "Potencias y raíces usando el objeto Math.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/7 Calculadora Avanzada/index.html" },
    // Ejercicio Junior 8: Materias y profesores
    { cat: "ejercicios", title: "8. Materias y Profesores", tag: "Junior", desc: "Búsqueda y filtrado sobre arreglos de datos.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/8 Materias y Profesores/index.html" },
    // Ejercicio Junior 9: Inscripción de materias
    { cat: "ejercicios", title: "9. Inscripción de Materias", tag: "Junior", desc: "Validación de cupos e inscripción dinámica.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/9 Inscripción de Materias/index.html" },
    // Ejercicio Junior 10: Nota final consola
    { cat: "ejercicios", title: "10. Nota Final Consola", tag: "Junior", desc: "Cálculo de resultados y estilos en console.log.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/10 Nota Final Consola/index.html" },
    // Ejercicio Junior 11: Ordenar tareas
    { cat: "ejercicios", title: "11. Ordenar Tareas", tag: "Junior", desc: "Planificación y agrupación de actividades diarias.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/11 Ordenar Tareas/index.html" },
    // Ejercicio Junior 12: La llave correcta
    { cat: "ejercicios", title: "12. La Llave Correcta", tag: "Junior", desc: "Creación dinámica de tarjetas seleccionables en el DOM.", href: "JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html" },

    // --- SECCIÓN: JS MID LEVEL ---
    // Práctica de programación asíncrona moderna con async y await
    { cat: "mid", title: "Async y Await", tag: "Mid Level", desc: "Asincronía moderna legible con try/catch.", href: "JAVASCRIPT MID LEVEL/Async y Await/index.html" },
    // Práctica de Promesas y encadenamiento asíncrono
    { cat: "mid", title: "Promesas", tag: "Mid Level", desc: "Estados pending, fulfilled, rejected y encadenamiento.", href: "JAVASCRIPT MID LEVEL/Promesas/index.html" },
    // Práctica de consumo HTTP con Fetch API
    { cat: "mid", title: "Fetch API", tag: "Mid Level", desc: "Peticiones HTTP modernas en JavaScript.", href: "JAVASCRIPT MID LEVEL/Fetch/index.html" },
    // Práctica de peticiones HTTP y encabezados
    { cat: "mid", title: "Peticiones HTTP", tag: "Mid Level", desc: "Métodos, cabeceras y códigos de estado HTTP.", href: "JAVASCRIPT MID LEVEL/Peticiones HTTP/index.html" },
    // Práctica de funciones callback y flujo asíncrono base
    { cat: "mid", title: "Callbacks", tag: "Mid Level", desc: "Funciones de retorno y flujo asíncrono base.", href: "JAVASCRIPT MID LEVEL/Callbacks/index.html" },
    // Práctica de serialización y parseo con JSON
    { cat: "mid", title: "Datos Estructurados (JSON)", tag: "Mid Level", desc: "Serialización y parseo de objetos JSON.", href: "JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html" },
    // Práctica de captura y manejo de excepciones con try/catch
    { cat: "mid", title: "Try-Catch y Excepciones", tag: "Mid Level", desc: "Manejo robusto de errores en tiempo de ejecución.", href: "JAVASCRIPT MID LEVEL/Try-Catch/index.html" },
    // Práctica de estructura de control Switch
    { cat: "mid", title: "Switch", tag: "Mid Level", desc: "Evaluación múltiple de casos con switch y break.", href: "JAVASCRIPT MID LEVEL/Switch/index.html" },
    // Práctica de temporizadores setTimeout y setInterval
    { cat: "mid", title: "Temporizadores", tag: "Mid Level", desc: "Control del tiempo con setTimeout, setInterval y clear.", href: "JAVASCRIPT MID LEVEL/Temporizadores/index.html" },
    // Práctica sobre código obsoleto y reemplazos modernos
    { cat: "mid", title: "Código Obsoleto", tag: "Mid Level", desc: "Patrones heredados y sus equivalentes actuales.", href: "JAVASCRIPT MID LEVEL/Codigo Obsoleto/index.html" },
    // Sub-prácticas de AJAX
    { cat: "mid", title: "AJAX (Editor)", tag: "Mid Level", desc: "Peticiones asíncronas clásicas con XMLHttpRequest.", href: "JAVASCRIPT MID LEVEL/Ajax/Ajax Editor/index.html" },
    { cat: "mid", title: "AJAX (Htdocs)", tag: "Mid Level", desc: "Práctica de AJAX en entorno de servidor local.", href: "JAVASCRIPT MID LEVEL/Ajax/Ajax Htdocs/index.html" },
    // Sub-prácticas de Librería Axios
    { cat: "mid", title: "Librería Axios (Editor)", tag: "Mid Level", desc: "Cliente HTTP basado en Promesas con Axios.", href: "JAVASCRIPT MID LEVEL/Libreria Axios/Axios Editor/index.html" },
    { cat: "mid", title: "Axios vs Fetch (Htdocs)", tag: "Mid Level", desc: "Comparativa práctica entre Axios y Fetch.", href: "JAVASCRIPT MID LEVEL/Libreria Axios/Axios-Fetch-Htdocs/index.html" },
    // Sub-prácticas de Eventos
    { cat: "mid", title: "Eventos: Handlers", tag: "Mid Level", desc: "Registro y remoción de escuchadores de eventos.", href: "JAVASCRIPT MID LEVEL/Eventos/Handlers/index.html" },
    { cat: "mid", title: "Eventos: Event Flow", tag: "Mid Level", desc: "Propagación de eventos (Bubbling y Capturing).", href: "JAVASCRIPT MID LEVEL/Eventos/Event Flow/index.html" },
    { cat: "mid", title: "Eventos de Mouse", tag: "Mid Level", desc: "Interacciones de clic, doble clic y movimiento.", href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Mouse/index.html" },
    { cat: "mid", title: "Eventos de Teclado", tag: "Mid Level", desc: "Captura de teclas con keydown, keyup y keypress.", href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Teclado/index.html" },
    { cat: "mid", title: "Eventos de Interfaz", tag: "Mid Level", desc: "Eventos load, resize, scroll y select.", href: "JAVASCRIPT MID LEVEL/Eventos/Eventos de Interfaz/index.html" },
    // Sub-práctica de DevTools
    { cat: "mid", title: "DevTools: Pestaña Application", tag: "Mid Level", desc: "Inspección de almacenamiento y caché en DevTools.", href: "JAVASCRIPT MID LEVEL/Pestañas DevTools/Application/index.html" },
    // Acceso directo a la carpeta de las 25 guías Markdown de Mid Level
    { cat: "mid", title: "Documentación Completa Mid Level", tag: "25 Guías MD", desc: "Eventos, Axios, Window, DevTools, HTTP y más.", href: "JAVASCRIPT MID LEVEL/DOCUMENTACION/" },

    // --- SECCIÓN: JS JUNIOR LEVEL ---
    // Práctica de variables (var, let, const)
    { cat: "junior", title: "Variables", tag: "Junior Level", desc: "Declaración, alcance y tipos de datos básicos.", href: "JAVASCRIPT JUNIOR LEVEL/Variables/index.html" },
    // Práctica de operadores aritméticos y lógicos
    { cat: "junior", title: "Operadores", tag: "Junior Level", desc: "Operadores de asignación, comparación y lógicos.", href: "JAVASCRIPT JUNIOR LEVEL/Operadores/index.html" },
    // Práctica de concatenación y template literals
    { cat: "junior", title: "Concatenación", tag: "Junior Level", desc: "Unión de textos y uso de Template Strings.", href: "JAVASCRIPT JUNIOR LEVEL/Concatenacion/index.html" },
    // Práctica de estructuras condicionales if/else
    { cat: "junior", title: "Condicionales", tag: "Junior Level", desc: "Toma de decisiones con if, else if y else.", href: "JAVASCRIPT JUNIOR LEVEL/Condicionales/index.html" },
    // Práctica de arreglos y métodos fundamentales
    { cat: "junior", title: "Arrays y Métodos", tag: "Junior Level", desc: "Estructuras indexadas y métodos fundamentales.", href: "JAVASCRIPT JUNIOR LEVEL/Arrays/index.html" },
    // Práctica de bucles while y do...while
    { cat: "junior", title: "Bucles (while / do-while)", tag: "Junior Level", desc: "Repetición controlada de instrucciones.", href: "JAVASCRIPT JUNIOR LEVEL/Bucles/index.html" },
    // Práctica de bucle for, for...in y for...of
    { cat: "junior", title: "Bucle For", tag: "Junior Level", desc: "Iteración clásica y recorridos sobre colecciones.", href: "JAVASCRIPT JUNIOR LEVEL/For/index.html" },
    // Práctica de funciones declaradas y expresadas
    { cat: "junior", title: "Funciones", tag: "Junior Level", desc: "Parámetros, retorno de valores y reutilización.", href: "JAVASCRIPT JUNIOR LEVEL/Funciones/index.html" },
    // Práctica de Programación Orientada a Objetos en JS
    { cat: "junior", title: "POO (Programación Orientada a Objetos)", tag: "Junior Level", desc: "Clases, constructores, herencia y encapsulación.", href: "JAVASCRIPT JUNIOR LEVEL/POO/index.html" },
    // Práctica de métodos de cadenas de texto
    { cat: "junior", title: "Cadenas (Métodos)", tag: "Junior Level", desc: "Transformación, búsqueda y corte de strings.", href: "JAVASCRIPT JUNIOR LEVEL/Cadenas(Metodos)/index.html" },
    // Práctica de funciones matemáticas con el objeto Math
    { cat: "junior", title: "Objeto Math", tag: "Junior Level", desc: "Redondeos, raíces, aleatorios y constantes.", href: "JAVASCRIPT JUNIOR LEVEL/Math/index.html" },
    // Práctica de depuración en consola
    { cat: "junior", title: "Console.log y Depuración", tag: "Junior Level", desc: "Métodos de consola para inspeccionar variables y tablas.", href: "JAVASCRIPT JUNIOR LEVEL/Console.log/index.html" },
    // Práctica de manipulación del árbol DOM
    { cat: "junior", title: "DOM (Document Object Model)", tag: "Junior Level", desc: "Selección, creación y manipulación de nodos HTML.", href: "JAVASCRIPT JUNIOR LEVEL/Dom/index.html" },
    // Acceso directo a la carpeta de las 14 guías Markdown de Junior Level
    { cat: "junior", title: "Documentación Completa Junior Level", tag: "14 Guías MD", desc: "Variables, Operadores, Cadenas, Math, Condicionales.", href: "JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/" },

    // --- SECCIÓN: HTML Y CSS (6 Proyectos Interactivos + Documentación) ---
    // Proyecto: Caja de chat estilizada
    { cat: "htmlcss", title: "Proyecto: Chatbox", tag: "Proyecto", desc: "Interfaz de mensajería moderna con Flexbox y burbujas.", href: "HTML y CSS/PROYECTOS/CHATBOX/index.html" },
    // Proyecto: Tarjeta giratoria 3D
    { cat: "htmlcss", title: "Proyecto: Flipper Card 3D", tag: "Proyecto", desc: "Efecto de rotación 3D con perspectiva CSS.", href: "HTML y CSS/PROYECTOS/FLIPPER CARD/index.html" },
    // Proyecto: Página One View
    { cat: "htmlcss", title: "Proyecto: One View Page", tag: "Proyecto", desc: "Maquetación de pantalla completa con diseño limpio.", href: "HTML y CSS/PROYECTOS/ONE VIEW PAGE/index.html" },
    // Proyecto: Menú lateral desplegable
    { cat: "htmlcss", title: "Proyecto: Sidebar Menu", tag: "Proyecto", desc: "Barra de navegación lateral adaptable con transiciones.", href: "HTML y CSS/PROYECTOS/SIDEBAR MENU/index.html" },
    // Proyecto: Página web completa
    { cat: "htmlcss", title: "Proyecto: Web Page", tag: "Proyecto", desc: "Sitio web completo estructurado con Grid y Flexbox.", href: "HTML y CSS/PROYECTOS/WEB PAGE/index.html" },
    // Proyecto: Página web con animaciones CSS
    { cat: "htmlcss", title: "Proyecto: Web Page Animations", tag: "Proyecto", desc: "Transiciones y @keyframes aplicados a una landing page.", href: "HTML y CSS/PROYECTOS/WEB PAGE ANIMATIONS/index.html" },
    // Proyecto: Menú acordeón con Divs
    { cat: "htmlcss", title: "Proyecto: Accordion Menu (Divs)", tag: "Proyecto", desc: "Acordeón interactivo construido con contenedores div.", href: "HTML y CSS/PROYECTOS/ACCORDION MENU/DIVS/index.html" },
    // Proyecto: Menú acordeón nativo con Summary/Details
    { cat: "htmlcss", title: "Proyecto: Accordion (Summary)", tag: "Proyecto", desc: "Acordeón semántico nativo usando <details> y <summary>.", href: "HTML y CSS/PROYECTOS/ACCORDION MENU/SUMMARY-DETAILS/index.html" },
    // Prácticas de CSS Básico y Avanzado
    { cat: "htmlcss", title: "CSS Básico: Inicio", tag: "CSS Básico", desc: "Primeros pasos y selectores fundamentales en CSS.", href: "HTML y CSS/CSS BASICO/Inicio/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Colores", tag: "CSS Básico", desc: "Modelos de color HEX, RGB, RGBA y HSL.", href: "HTML y CSS/CSS BASICO/Colores/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Bordes", tag: "CSS Básico", desc: "Estilos, grosores y redondeo de bordes.", href: "HTML y CSS/CSS BASICO/Bordes/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Box Sizing", tag: "CSS Básico", desc: "Diferencia entre content-box y border-box.", href: "HTML y CSS/CSS BASICO/Box Sizing/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Fondo y Gradiente", tag: "CSS Básico", desc: "Fondos, imágenes y degradados lineales/radiales.", href: "HTML y CSS/CSS BASICO/Fondo y gradiente/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Medidas", tag: "CSS Básico", desc: "Unidades absolutas y relativas (px, rem, em, %).", href: "HTML y CSS/CSS BASICO/medidas/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Padding y Margin", tag: "CSS Básico", desc: "Espaciado interno y externo del modelo de caja.", href: "HTML y CSS/CSS BASICO/padding y margin/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Propiedades de Texto", tag: "CSS Básico", desc: "Tipografía, alineación, pesos e interlineado.", href: "HTML y CSS/CSS BASICO/Propiedades de texto/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Sombras", tag: "CSS Básico", desc: "Aplicación de box-shadow y text-shadow.", href: "HTML y CSS/CSS BASICO/sombras/index.html" },
    { cat: "htmlcss", title: "CSS Básico: Width y Height", tag: "CSS Básico", desc: "Dimensionamiento de cajas con ancho y alto.", href: "HTML y CSS/CSS BASICO/width y heigth/index.html" },
    { cat: "htmlcss", title: "Ejercicio: Tarjeta de Presentación", tag: "Ejercicio", desc: "Maquetación de tarjeta personal con CSS básico.", href: "HTML y CSS/CSS BASICO/Ejercicios/Tarjeta de presentacion/index.html" },
    { cat: "htmlcss", title: "CSS Avanzado: Especificidad y Cascada", tag: "CSS Avanzado", desc: "Jerarquía de selectores y resolución de conflictos.", href: "HTML y CSS/CSS avanzado/Especificidad y Casacada/index.html" },
    { cat: "htmlcss", title: "CSS Avanzado: Position", tag: "CSS Avanzado", desc: "Posicionamiento static, relative, absolute, fixed y sticky.", href: "HTML y CSS/CSS avanzado/Position/index.html" },
    // Acceso directo a las 8 guías Markdown de HTML5 y CSS3
    { cat: "htmlcss", title: "Documentación Completa HTML y CSS", tag: "8 Guías MD", desc: "HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones Avanzadas y Hosting.", href: "HTML y CSS/Documentacion/" }
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
    htmlcss: "🎨 HTML5 y CSS3"
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
    order.forEach(cat => {
        // Si hay un filtro activo distinto de 'all' y no coincide con esta categoría, la omitimos
        if (activeFilter !== "all" && activeFilter !== cat) return;
        // Filtramos los módulos que pertenecen a esta categoría y coinciden con la búsqueda
        const items = modules.filter(m =>
            m.cat === cat &&
            (m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q))
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

        // Recorremos cada módulo filtrado para construir su tarjeta clicable
        items.forEach(item => {
            // Creamos un enlace <a> para que toda la tarjeta sea navegable
            const a = document.createElement("a");
            // Asignamos la clase CSS de tarjeta estilo Glassmorphism
            a.className = "card";
            // Codificamos la ruta para manejar espacios y caracteres especiales en la URL
            a.href = encodeURI(item.href);
            // Detectamos si la etiqueta corresponde a documentación o proyectos para darle color distinto
            const isDoc = item.tag.includes("MD") || item.tag === "Proyecto";
            // Construimos el HTML interno de la tarjeta con título, badge y descripción
            a.innerHTML = `
                <div class="card-top">
                    <span class="card-title">${item.title}</span>
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
filterBtns.forEach(btn => {
    // Escuchamos el clic del botón actual
    btn.addEventListener("click", () => {
        // Quitamos la clase 'active' de todos los botones
        filterBtns.forEach(b => b.classList.remove("active"));
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

// Ejecutamos el renderizado inicial al cargar la página
render();
