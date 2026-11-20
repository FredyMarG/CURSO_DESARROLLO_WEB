'use strict';

const modules = [
    // JS MASTER LEVEL (18 Guías Interactivas de 11-12 diapositivas)
    { cat: "master", title: "APIs y Fetch", tag: "11 Slides", desc: "Consumo RESTful, fetch(), AbortController y Promise.all.", href: "JAVASCRIPT MASTER LEVEL/Apis/index.html" },
    { cat: "master", title: "Drag & Drop", tag: "11 Slides", desc: "Eventos de arrastre, dataTransfer y archivos del escritorio.", href: "JAVASCRIPT MASTER LEVEL/Drag & Drop/index.html" },
    { cat: "master", title: "FileReader API", tag: "11 Slides", desc: "Lectura de texto, DataURL, ArrayBuffer y barras de carga.", href: "JAVASCRIPT MASTER LEVEL/File Reader/index.html" },
    { cat: "master", title: "Funciones Flecha", tag: "12 Slides", desc: "Sintaxis, ámbito léxico de this, closures y recursividad.", href: "JAVASCRIPT MASTER LEVEL/Funciones Flecha/index.html" },
    { cat: "master", title: "Geolocalización", tag: "11 Slides", desc: "getCurrentPosition(), watchPosition() y manejo de errores.", href: "JAVASCRIPT MASTER LEVEL/Geolocalization/index.html" },
    { cat: "master", title: "History API", tag: "11 Slides", desc: "pushState, replaceState, popstate y scrollRestoration.", href: "JAVASCRIPT MASTER LEVEL/Historial/index.html" },
    { cat: "master", title: "IndexedDB", tag: "12 Slides", desc: "Base NoSQL en el navegador, transacciones, índices y cursores.", href: "JAVASCRIPT MASTER LEVEL/IndexedDB/index.html" },
    { cat: "master", title: "Intersection Observer", tag: "12 Slides", desc: "Lazy loading, scroll infinito y laboratorio interactivo real.", href: "JAVASCRIPT MASTER LEVEL/Intersection Observer/index.html" },
    { cat: "master", title: "Local Storage", tag: "11 Slides", desc: "Almacenamiento persistente, JSON y sincronización multi-pestaña.", href: "JAVASCRIPT MASTER LEVEL/Local Storage/index.html" },
    { cat: "master", title: "window.matchMedia()", tag: "12 Slides", desc: "Media Queries reactivas en JS y laboratorio de breakpoints.", href: "JAVASCRIPT MASTER LEVEL/Matchmedia/index.html" },
    { cat: "master", title: "Modo Estricto", tag: "11 Slides", desc: "'use strict', ES Modules, seguridad y optimización.", href: "JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html" },
    { cat: "master", title: "Objeto Navigator", tag: "12 Slides", desc: "Interfaces BOM, red, hardware, storage y Clipboard API.", href: "JAVASCRIPT MASTER LEVEL/Navigator/index.html" },
    { cat: "master", title: "Notifications API", tag: "12 Slides", desc: "Permisos, alertas nativas del SO y Service Workers.", href: "JAVASCRIPT MASTER LEVEL/Notifications/index.html" },
    { cat: "master", title: "Objeto Date", tag: "11 Slides", desc: "Fechas, horas y formateo moderno con Intl.DateTimeFormat.", href: "JAVASCRIPT MASTER LEVEL/Objeto Date/index.html" },
    { cat: "master", title: "Operador Ternario", tag: "11 Slides", desc: "Expresiones condicionales, ?? Nullish Coalescing y legibilidad.", href: "JAVASCRIPT MASTER LEVEL/Operador Ternario/index.html" },
    { cat: "master", title: "Prototipos", tag: "11 Slides", desc: "Prototype Chain, herencia prototípica y equivalencia con class.", href: "JAVASCRIPT MASTER LEVEL/Prototipos/index.html" },
    { cat: "master", title: "Visibility Change", tag: "12 Slides", desc: "Page Visibility API, ahorro de CPU/red y reproductor inteligente.", href: "JAVASCRIPT MASTER LEVEL/Visibility Change/index.html" },
    { cat: "master", title: "Web Workers", tag: "12 Slides", desc: "Hilos en segundo plano, postMessage, Transferables y Blobs.", href: "JAVASCRIPT MASTER LEVEL/Web Workers/index.html" },

    // EJERCICIOS MASTER LEVEL
    { cat: "ejercicios", title: "Lazy Load con IntersectionObserver", tag: "Ejercicio", desc: "Carga progresiva de 45 publicaciones con animación al scroll.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html" },
    { cat: "ejercicios", title: "CRUD con IndexedDB", tag: "Ejercicio", desc: "Gestor persistente de nombres en IndexedDB.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html" },
    { cat: "ejercicios", title: "Drag & Drop File Reader", tag: "Ejercicio", desc: "Carga de archivos con barra de progreso animada.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html" },
    { cat: "ejercicios", title: "Galería Dinámica", tag: "Ejercicio", desc: "Bento Grid interactivo con FileReader y Lightbox.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html" },
    { cat: "ejercicios", title: "Idioma con LocalStorage", tag: "Ejercicio", desc: "Selector bilingüe persistente con modal animado.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html" },
    { cat: "ejercicios", title: "Reloj Digital (Date)", tag: "Ejercicio", desc: "Reloj digital en tiempo real con setInterval.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html" },
    { cat: "ejercicios", title: "Texturizador Drag & Drop", tag: "Ejercicio", desc: "Aplicación de texturas por arrastre con dataTransfer.", href: "JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html" },

    // JS MID LEVEL
    { cat: "mid", title: "Async y Await", tag: "Mid Level", desc: "Asincronía moderna legible con try/catch.", href: "JAVASCRIPT MID LEVEL/Async y Await/index.html" },
    { cat: "mid", title: "Promesas", tag: "Mid Level", desc: "Estados pending, fulfilled, rejected y encadenamiento.", href: "JAVASCRIPT MID LEVEL/Promesas/index.html" },
    { cat: "mid", title: "Fetch API", tag: "Mid Level", desc: "Peticiones HTTP modernas en JavaScript.", href: "JAVASCRIPT MID LEVEL/Fetch/index.html" },
    { cat: "mid", title: "Callbacks", tag: "Mid Level", desc: "Funciones de retorno y flujo asíncrono base.", href: "JAVASCRIPT MID LEVEL/Callbacks/index.html" },
    { cat: "mid", title: "Datos Estructurados (JSON)", tag: "Mid Level", desc: "Serialización y parseo de objetos JSON.", href: "JAVASCRIPT MID LEVEL/Datos Estructurados (JSON)/index.html" },
    { cat: "mid", title: "Try-Catch y Excepciones", tag: "Mid Level", desc: "Manejo robusto de errores en tiempo de ejecución.", href: "JAVASCRIPT MID LEVEL/Try-Catch/index.html" },
    { cat: "mid", title: "Documentación Completa Mid Level", tag: "25 Guías MD", desc: "Eventos, Axios, Window, DevTools, HTTP y más.", href: "JAVASCRIPT MID LEVEL/DOCUMENTACION/" },

    // JS JUNIOR LEVEL
    { cat: "junior", title: "DOM (Document Object Model)", tag: "Junior Level", desc: "Selección, creación y manipulación de nodos HTML.", href: "JAVASCRIPT JUNIOR LEVEL/Dom/index.html" },
    { cat: "junior", title: "Arrays y Métodos", tag: "Junior Level", desc: "Estructuras indexadas y métodos fundamentales.", href: "JAVASCRIPT JUNIOR LEVEL/Arrays/index.html" },
    { cat: "junior", title: "POO (Programación Orientada a Objetos)", tag: "Junior Level", desc: "Clases, constructores, herencia y encapsulación.", href: "JAVASCRIPT JUNIOR LEVEL/POO/index.html" },
    { cat: "junior", title: "Funciones y Bucles", tag: "Junior Level", desc: "Lógica de control, funciones y ciclos.", href: "JAVASCRIPT JUNIOR LEVEL/Funciones/index.html" },
    { cat: "junior", title: "Documentación Completa Junior Level", tag: "14 Guías MD", desc: "Variables, Operadores, Cadenas, Math, Condicionales.", href: "JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/" },

    // HTML Y CSS
    { cat: "htmlcss", title: "Documentación Completa HTML y CSS", tag: "8 Guías MD", desc: "HTML, CSS, Flexbox, Grid, Animaciones, Responsive, Funciones Avanzadas y Hosting.", href: "HTML y CSS/Documentacion/" },
    { cat: "htmlcss", title: "Proyectos Prácticos HTML y CSS", tag: "Proyectos", desc: "Prácticas y maquetación aplicada.", href: "HTML y CSS/PROYECTOS/" }
];

const titles = {
    master: "🚀 JavaScript Master Level — Guías Interactivas",
    ejercicios: "🧪 Ejercicios Prácticos Interactivos",
    mid: "⚡ JavaScript Mid Level",
    junior: "🌱 JavaScript Junior Level",
    htmlcss: "🎨 HTML5 y CSS3"
};

const portal = document.getElementById("portalContent");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
let activeFilter = "all";

function render() {
    const q = searchInput.value.trim().toLowerCase();
    portal.innerHTML = "";

    const order = ["master", "ejercicios", "mid", "junior", "htmlcss"];
    order.forEach(cat => {
        if (activeFilter !== "all" && activeFilter !== cat) return;
        const items = modules.filter(m =>
            m.cat === cat &&
            (m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q))
        );
        if (items.length === 0) return;

        const sec = document.createElement("section");
        sec.className = "course-section";
        sec.innerHTML = `<h2 class="course-title">${titles[cat]}</h2>`;

        const grid = document.createElement("div");
        grid.className = "grid";

        items.forEach(item => {
            const a = document.createElement("a");
            a.className = "card";
            a.href = encodeURI(item.href);
            const isDoc = item.tag.includes("MD") || item.tag === "Proyectos";
            a.innerHTML = `
                <div class="card-top">
                    <span class="card-title">${item.title}</span>
                    <span class="tag ${isDoc ? "tag-doc" : ""}">${item.tag}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
            `;
            grid.appendChild(a);
        });

        sec.appendChild(grid);
        portal.appendChild(sec);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        render();
    });
});

searchInput.addEventListener("input", render);
render();
