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

    // Crea una cápsula flotante con accesos rápidos a Proyectos y Portal
    const group = document.createElement('div');
    group.className = 'neon-nav-group';
    group.innerHTML = `
        <a class="neon-portal-pill" href="../../../HTML%20y%20CSS/PROYECTOS/index.html">💼 Proyectos</a>
        <a class="neon-portal-pill" href="../../../index.html">🏠 Portal del Curso</a>
    `;
    document.body.appendChild(group);
})();
