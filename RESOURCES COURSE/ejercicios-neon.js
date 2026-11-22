/**
 * ============================================================================
 * COMPLEMENTO DINÁMICO NEÓN PARA TODOS LOS EJERCICIOS DEL CURSO
 * Agrega barra flotante con acceso directo a Proyectos y al Portal Principal.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    // Activa modo estricto
    'use strict';

    // Si la página ya tiene barra superior o HUD de proyectos, no duplica navegación
    if (document.querySelector('.top-nav, .ej-hud, .neon-nav-group')) return;

    // Calcula dinámicamente la ruta hacia la raíz del repositorio
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
    const rootIdx = parts.findIndex(p => p === 'JAVASCRIPT' || p === 'HTML y CSS');
    const toPortalRoot = '../'.repeat(rootIdx !== -1 ? Math.max(1, parts.length - 1 - rootIdx) : 4);

    // Crea una cápsula flotante con accesos rápidos a Proyectos y Portal
    const group = document.createElement('div');
    group.className = 'neon-nav-group';
    group.innerHTML = `
        <a class="neon-portal-pill" href="${toPortalRoot}index.html?filter=proyectos">🚀 Proyectos</a>
        <a class="neon-portal-pill" href="${toPortalRoot}index.html">🏠 Portal del Curso</a>
    `;
    document.body.appendChild(group);
})();
