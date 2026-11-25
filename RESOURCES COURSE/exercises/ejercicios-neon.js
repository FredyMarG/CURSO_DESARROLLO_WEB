/**
 * ============================================================================
 * COMPLEMENTO DINÁMICO NEÓN PARA EJERCICIOS Y PROYECTOS DEL CURSO
 * Agrega barra flotante con navegación Anterior / Siguiente y accesos al Portal.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    // Asigna el favicon oficial de Flaticon acorde al bloque del ejercicio/proyecto
    (function setExerciseTabIcon() {
        const pathStr = decodeURIComponent(window.location.pathname); // Ruta actual decodificada
        const iconUrl = pathStr.includes('/NODE/')
            ? 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png'
            : pathStr.includes('/JAVASCRIPT/')
                ? 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png'
                : 'https://cdn-icons-png.flaticon.com/512/732/732190.png'; // URL del ícono correspondiente
        const link = document.querySelector('link[rel~="icon"]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' }); // Reutiliza o crea <link rel="icon">
        link.type = 'image/png'; // Tipo MIME del favicon
        link.href = iconUrl; // Aplica el ícono seleccionado
    })();

    // Si la página ya tiene barra superior o HUD de proyectos, evita duplicar navegación
    if (document.querySelector('.top-nav, .ej-hud, .neon-nav-group')) return; // Sale temprano si ya existe HUD

    // Calcula dinámicamente la ruta hacia la raíz del repositorio
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Segmentos de URL
    const rootIdx = parts.findIndex(p => p === 'JAVASCRIPT' || p === 'HTML y CSS'); // Carpeta raíz de bloque
    const toPortalRoot = '../'.repeat(rootIdx !== -1 ? Math.max(1, parts.length - 1 - rootIdx) : 4); // Niveles hacia raíz

    // Secuencia ordenada de los 15 ejercicios prácticos (JS Junior + JS Mid)
    const EXERCISES = [
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/1 Helados y Precios/index.html', label: '01. Helados y Precios' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/2 Fiesta y Entrada/index.html', label: '02. Fiesta y Entrada' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/3 Asistencia/index.html', label: '03. Asistencia' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/4 Calculadora Básica/index.html', label: '04. Calculadora Básica' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/5 Celular Nuevo/index.html', label: '05. Celular Nuevo' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/6 Apps Celular Nuevo/index.html', label: '06. Apps Celular' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/7 Calculadora Avanzada/index.html', label: '07. Calc. Avanzada' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/8 Materias y Profesores/index.html', label: '08. Materias' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/9 Inscripción de Materias/index.html', label: '09. Inscripción' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/10 Nota Final Consola/index.html', label: '10. Nota Final' },
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/11 Ordenar Tareas/index.html', label: '11. Ordenar Tareas' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/1 Comprar Computador/index.html', label: '12. Computador' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/2 Mostrar Datos Web/index.html', label: '13. Datos Web' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/3 Materia Pendiente/index.html', label: '14. Materia Pendiente' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/5 Promedio de Notas Corrección/index.html', label: '15. Promedio Notas' }
    ];

    // Secuencia ordenada de los 16 proyectos de JavaScript
    const JS_PROJECTS = [
        { path: 'JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html', label: 'La Llave Correcta' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/4 Recuperacion de Materia por Docente/index.html', label: 'Recuperación Docente' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/6 Notas de Cofla/index.html', label: 'Notas de Cofla' },
        { path: 'JAVASCRIPT/JAVASCRIPT MID LEVEL/EJERCICIOS/7 Compañeros de Cofla Htdocs/index.html', label: 'Compañeros Cofla' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Reloj/index.html', label: 'Reloj Digital' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Local Storage/index.html', label: 'Idioma LocalStorage' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Drag & Drop File Reader/index.html', label: 'Drag & Drop Reader' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Texturizador/index.html', label: 'Texturizador' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Galeria Dinamica/index.html', label: 'Galería Dinámica' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Intersection Objects Lazyload/index.html', label: 'Lazy Load Observer' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/IndexedDB/index.html', label: 'CRUD IndexedDB' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Uso de Cookies/index.html', label: 'Cookies' },
        { path: 'JAVASCRIPT/JAVASCRIPT MASTER LEVEL/EJERCICIOS/Web Paint/index.html', label: 'Web Paint' },
        { path: 'JAVASCRIPT/PROYECTOS/Finanzas APP/index.html', label: 'Finanzas APP' },
        { path: 'JAVASCRIPT/PROYECTOS/Buscador de Peliculas/index.html', label: 'Buscador Películas' },
        { path: 'JAVASCRIPT/PROYECTOS/Tablero Kanban/index.html', label: 'Tablero Kanban' }
    ];

    // Helper reutilizable para crear botones tipo píldora en la barra flotante
    const createPillLink = (href, text) => {
        const a = document.createElement('a'); // Crea elemento enlace
        a.className = 'neon-portal-pill'; // Aplica estilo píldora neón
        a.href = href; // Asigna URL destino
        a.textContent = text; // Inserta texto seguro
        return a; // Retorna el enlace construido
    };

    const relFromRoot = rootIdx !== -1 ? parts.slice(rootIdx).join('/') : ''; // Ruta actual respecto a la raíz
    let scope = 'all'; // Ámbito de filtro por defecto
    try { scope = sessionStorage.getItem('cursoProjectScope') || 'all'; } catch (_) {} // Lee filtro activo del portal

    const exIdx = EXERCISES.findIndex(e => e.path.toLowerCase() === relFromRoot.toLowerCase()); // Busca en ejercicios
    const jsProjIdx = JS_PROJECTS.findIndex(p => p.path.toLowerCase() === relFromRoot.toLowerCase()); // Busca en proyectos JS

    let prevItem = null; // Enlace al elemento anterior
    let nextItem = null; // Enlace al elemento siguiente
    let hubHref = `${toPortalRoot}index.html?filter=proyectos`; // Ruta por defecto al hub de proyectos
    let hubLabel = '🚀 Proyectos'; // Etiqueta por defecto del hub

    if (exIdx !== -1) {
        hubHref = `${toPortalRoot}index.html?filter=ejercicios`; // Cambia el enlace central a Ejercicios
        hubLabel = '🧪 Ejercicios'; // Etiqueta de ejercicios
        prevItem = exIdx > 0 ? EXERCISES[exIdx - 1] : null; // Ejercicio anterior
        nextItem = exIdx < EXERCISES.length - 1 ? EXERCISES[exIdx + 1] : null; // Siguiente ejercicio
    } else if (jsProjIdx !== -1) {
        prevItem = jsProjIdx > 0 ? JS_PROJECTS[jsProjIdx - 1] : null; // Proyecto JS anterior
        nextItem = jsProjIdx < JS_PROJECTS.length - 1 ? JS_PROJECTS[jsProjIdx + 1] : null; // Siguiente proyecto JS
        // Si no hay filtro de lenguaje activo ('all'), conecta con CSS Holy Grail y Node Gestor de Tareas
        if (scope === 'all' && jsProjIdx === 0) prevItem = { path: 'HTML y CSS/Responsive Design/Holi Grail/holigrail.html', label: 'CSS: Holy Grail' };
        if (scope === 'all' && jsProjIdx === JS_PROJECTS.length - 1) nextItem = { path: 'NODE/Proyectos/Tareas/public/index.html', label: 'Node: Gestor de Tareas' };
    }

    // Construye y monta la cápsula flotante en el documento
    const group = document.createElement('div'); // Contenedor de píldoras de navegación
    group.className = 'neon-nav-group'; // Clase de posicionamiento fijo
    if (prevItem) group.appendChild(createPillLink(encodeURI(toPortalRoot + prevItem.path), `⬅ ${prevItem.label}`)); // Botón Anterior
    group.appendChild(createPillLink(hubHref, hubLabel)); // Botón Ejercicios o Proyectos
    group.appendChild(createPillLink(`${toPortalRoot}index.html`, '🏠 Portal del Curso')); // Botón Portal Principal
    if (nextItem) group.appendChild(createPillLink(encodeURI(toPortalRoot + nextItem.path), `${nextItem.label} ➡`)); // Botón Siguiente
    document.body.appendChild(group); // Inserta la barra en la página
})();
