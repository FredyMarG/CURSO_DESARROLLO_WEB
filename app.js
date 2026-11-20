// Activamos el modo estricto de JavaScript para evitar errores silenciosos y variables globales accidentales
'use strict';

// Arreglo maestro que contiene todos los módulos, guías interactivas, ejercicios y documentación del curso
const modules = [
    // --- SECCIÓN: JS MASTER LEVEL (19 Guías Interactivas de 11-12 diapositivas) ---
    // Módulo de consumo de APIs REST con Fetch, AbortController y Promise.all
    { cat: "master", title: "APIs y Fetch", tag: "11 Slides", desc: "Consumo RESTful, fetch(), AbortController y Promise.all.", href: "JAVASCRIPT MASTER LEVEL/Apis/index.html" },
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
    // Módulo de detección de pestaña activa o en segundo plano (Page Visibility API)
    { cat: "master", title: "Visibility Change", tag: "12 Slides", desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.", href: "JAVASCRIPT MASTER LEVEL/Visibility Change/index.html" },
    // Módulo de ejecución paralela en hilos secundarios con Web Workers
    { cat: "master", title: "Web Workers", tag: "12 Slides", desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.", href: "JAVASCRIPT MASTER LEVEL/Web Workers/index.html" },

    // --- SECCIÓN: EJERCICIOS MASTER LEVEL ---
    // Ejercicio práctico de carga diferida progresiva y animación al scroll
    { cat: "ejercicios", title: "Lazy Load con IntersectionObserver", tag: "Ejercicio", desc: "Carga progresiva de 45 publicaciones con animación al scroll.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html" },
    // Ejercicio práctico CRUD persistente usando IndexedDB
    { cat: "ejercicios", title: "CRUD con IndexedDB", tag: "Ejercicio", desc: "Gestor persistente de nombres en IndexedDB.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html" },
    // Ejercicio práctico de carga por arrastre con barra de progreso animada
    { cat: "ejercicios", title: "Drag & Drop File Reader", tag: "Ejercicio", desc: "Carga de archivos con barra de progreso animada.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html" },
    // Ejercicio práctico de galería mosaico interactiva con Lightbox
    { cat: "ejercicios", title: "Galería Dinámica", tag: "Ejercicio", desc: "Bento Grid interactivo con FileReader y Lightbox.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html" },
    // Ejercicio práctico de selector de idioma persistente con LocalStorage
    { cat: "ejercicios", title: "Idioma con LocalStorage", tag: "Ejercicio", desc: "Selector bilingüe persistente con modal animado.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html" },
    // Ejercicio práctico de reloj digital en tiempo real con el objeto Date
    { cat: "ejercicios", title: "Reloj Digital (Date)", tag: "Ejercicio", desc: "Reloj digital en tiempo real con setInterval.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html" },
    // Ejercicio práctico de aplicación de texturas mediante Drag & Drop
    { cat: "ejercicios", title: "Texturizador Drag & Drop", tag: "Ejercicio", desc: "Aplicación de texturas por arrastre con dataTransfer.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html" },

    // --- SECCIÓN: JS MID LEVEL ---
    // Práctica de programación asíncrona moderna con async y await
    { cat: "mid", title: "Async y Await", tag: "Mid Level", desc: "Asincronía moderna legible con try/catch.", href: "JAVASCRIPT MID LEVEL/Async y Await/index.html" },
    // Práctica de Promesas y encadenamiento asíncrono
    { cat: "mid", title: "Promesas", tag: "Mid Level", desc: "Estados pending, fulfilled, rejected y encadenamiento.", href: "JAVASCRIPT MID LEVEL/Promesas/index.html" },
    // Práctica de consumo HTTP con Fetch API
    { cat: "mid", title: "Fetch API", tag: "Mid Level", desc: "Peticiones HTTP modernas en JavaScript.", href: "JAVASCRIPT MID LEVEL/Fetch/index.html" },
    // Práctica de funciones callback y flujo asíncrono base
    { cat: "mid", title: "Callbacks", tag: "Mid Level", desc: "Funciones de retorno y flujo asíncrono base.", href: "JAVASCRIPT MID LEVEL/Callbacks/index.html" },
    // Práctica de serialización y parseo con JSON
    { cat: "mid", title: "Datos Estructurados (JSON)", tag: "Mid Level", desc: "Serialización y parseo de objetos JSON.", href: "JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html" },
    // Práctica de captura y manejo de excepciones con try/catch
    { cat: "mid", title: "Try-Catch y Excepciones", tag: "Mid Level", desc: "Manejo robusto de errores en tiempo de ejecución.", href: "JAVASCRIPT MID LEVEL/Try-Catch/index.html" },
    // Acceso directo a la carpeta de las 25 guías Markdown de Mid Level
    { cat: "mid", title: "Documentación Completa Mid Level", tag: "25 Guías MD", desc: "Eventos, Axios, Window, DevTools, HTTP y más.", href: "JAVASCRIPT MID LEVEL/DOCUMENTACION/" },

    // --- SECCIÓN: JS JUNIOR LEVEL ---
    // Práctica de manipulación del árbol DOM
    { cat: "junior", title: "DOM (Document Object Model)", tag: "Junior Level", desc: "Selección, creación y manipulación de nodos HTML.", href: "JAVASCRIPT JUNIOR LEVEL/Dom/index.html" },
    // Práctica de arreglos y métodos fundamentales
    { cat: "junior", title: "Arrays y Métodos", tag: "Junior Level", desc: "Estructuras indexadas y métodos fundamentales.", href: "JAVASCRIPT JUNIOR LEVEL/Arrays/index.html" },
    // Práctica de Programación Orientada a Objetos en JS
    { cat: "junior", title: "POO (Programación Orientada a Objetos)", tag: "Junior Level", desc: "Clases, constructores, herencia y encapsulación.", href: "JAVASCRIPT JUNIOR LEVEL/POO/index.html" },
    // Práctica de funciones, lógica de control y bucles
    { cat: "junior", title: "Funciones y Bucles", tag: "Junior Level", desc: "Lógica de control, funciones y ciclos.", href: "JAVASCRIPT JUNIOR LEVEL/Funciones/index.html" },
    // Acceso directo a la carpeta de las 14 guías Markdown de Junior Level
    { cat: "junior", title: "Documentación Completa Junior Level", tag: "14 Guías MD", desc: "Variables, Operadores, Cadenas, Math, Condicionales.", href: "JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/" },

    // --- SECCIÓN: HTML Y CSS ---
    // Acceso directo a las 8 guías Markdown de HTML5 y CSS3
    { cat: "htmlcss", title: "Documentación Completa HTML y CSS", tag: "8 Guías MD", desc: "HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones Avanzadas y Hosting.", href: "HTML y CSS/Documentacion/" },
    // Acceso directo a los proyectos prácticos de maquetación
    { cat: "htmlcss", title: "Proyectos Prácticos HTML y CSS", tag: "Proyectos", desc: "Prácticas y maquetación aplicada.", href: "HTML y CSS/PROYECTOS/" }
];

// Diccionario que asigna un título legible con emoji a cada categoría del portal
const titles = {
    // Encabezado para Master Level
    master: "🚀 JavaScript Master Level — Guías Interactivas",
    // Encabezado para Ejercicios
    ejercicios: "🧪 Ejercicios Prácticos Interactivos",
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
            (m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q))
        );
        // Si ningún módulo coincide en esta categoría, no creamos sección vacía
        if (items.length === 0) return;

        // Creamos el elemento <section> contenedor de la categoría
        const sec = document.createElement("section");
        // Asignamos la clase CSS de sección de curso
        sec.className = "course-section";
        // Insertamos el título correspondiente de la categoría
        sec.innerHTML = `<h2 class="course-title">${titles[cat]}</h2>`;

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
            const isDoc = item.tag.includes("MD") || item.tag === "Proyectos";
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
