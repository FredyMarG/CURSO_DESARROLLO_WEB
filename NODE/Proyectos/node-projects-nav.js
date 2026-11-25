/**
 * ============================================================================
 * NAVEGACIÓN UNIFICADA PARA PROYECTOS DE NODE.JS
 * Agrega botones Anterior / Siguiente, Exhibición Node y Guía PDF en la barra
 * superior de cada proyecto de Node.js, respetando el filtro del portal.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    // Lista ordenada y escalable de proyectos de Node.js (agrega aquí futuros proyectos)
    const NODE_PROJECTS = [
        { path: 'NODE/Proyectos/Tareas/public/index.html', label: 'Gestor de Tareas' }
    ];

    // Ubica el índice del proyecto actual dentro de NODE_PROJECTS según la URL
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Segmentos de la ruta actual
    const nodeIdx = parts.findIndex(p => p === 'NODE'); // Índice de la carpeta raíz NODE
    const relFromRoot = nodeIdx !== -1 ? parts.slice(nodeIdx).join('/') : ''; // Ruta relativa desde la raíz del curso
    const toRoot = '../'.repeat(nodeIdx !== -1 ? Math.max(1, parts.length - 1 - nodeIdx) : 4); // Niveles hasta la raíz del portal
    const curIdx = NODE_PROJECTS.findIndex(p => p.path.toLowerCase() === relFromRoot.toLowerCase()); // Índice del proyecto actual

    // Lee el ámbito de filtro guardado por el portal ('all', 'htmlcss', 'js', 'node')
    let scope = 'all'; // Por defecto permite navegar entre todos los proyectos
    try { scope = sessionStorage.getItem('cursoProjectScope') || 'all'; } catch (_) {} // Lee filtro de sesión

    // Determina enlaces Anterior y Siguiente según el ámbito activo
    let prevProj = curIdx > 0 ? NODE_PROJECTS[curIdx - 1] : null; // Proyecto Node anterior si existe
    let nextProj = curIdx !== -1 && curIdx < NODE_PROJECTS.length - 1 ? NODE_PROJECTS[curIdx + 1] : null; // Siguiente proyecto Node si existe

    // Si no está filtrado únicamente a Node.js, conecta el primer proyecto Node con el último de JS
    if (curIdx === 0 && scope !== 'node') {
        prevProj = { path: 'JAVASCRIPT/PROYECTOS/Tablero Kanban/index.html', label: 'JS: Tablero Kanban' }; // Enlace al último proyecto JS
    }

    // Inserta los botones de navegación dentro de .topbar .actions si existe en la página
    const actions = document.querySelector('.topbar .actions'); // Contenedor de botones en la cabecera
    if (!actions) return; // Sale si la página no tiene barra de acciones

    const btnProjects = document.getElementById('btnProjects'); // Referencia al botón Proyectos existente
    if (prevProj) {
        const aPrev = document.createElement('a'); // Crea botón Anterior
        aPrev.className = 'btn-link'; // Aplica estilo de botón de barra
        aPrev.href = encodeURI(toRoot + prevProj.path); // Ruta al proyecto anterior
        aPrev.textContent = `⬅ ${prevProj.label}`; // Etiqueta legible
        actions.insertBefore(aPrev, btnProjects || actions.firstChild); // Inserta antes de Proyectos
    }

    // Botón hacia la Exhibición de Proyectos de Node.js
    const aNodeExpo = document.createElement('a'); // Crea enlace a la exhibición Node
    aNodeExpo.className = 'btn-link'; // Estilo consistente
    aNodeExpo.href = `${toRoot}NODE/Proyectos/index.html`; // Enlace a NODE/Proyectos/index.html
    aNodeExpo.textContent = '🟢 Node Proyectos'; // Texto del botón
    actions.insertBefore(aNodeExpo, btnProjects || null); // Inserta junto a Proyectos

    if (nextProj) {
        const aNext = document.createElement('a'); // Crea botón Siguiente para futuros proyectos Node
        aNext.className = 'btn-link'; // Estilo consistente
        aNext.href = encodeURI(toRoot + nextProj.path); // Ruta al siguiente proyecto
        aNext.textContent = `${nextProj.label} ➡`; // Etiqueta legible
        actions.appendChild(aNext); // Agrega al final de la barra
    }
})();
