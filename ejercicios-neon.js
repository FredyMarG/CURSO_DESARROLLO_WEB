/**
 * ============================================================================
 * COMPLEMENTO DINÁMICO NEÓN PARA TODOS LOS EJERCICIOS DEL CURSO
 * Agrega botón flotante de regreso al Portal Principal si no existe barra.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    // Activa modo estricto
    'use strict';

    // Si la página ya tiene barra superior o HUD de proyectos, no duplica navegación
    if (document.querySelector('.top-nav, .ej-hud, .neon-portal-pill')) return;

    // Crea un enlace flotante hacia el portal principal (3 niveles arriba desde EJERCICIOS/<Tema>/)
    const pill = document.createElement('a');
    pill.className = 'neon-portal-pill';
    pill.href = '../../../index.html';
    pill.textContent = '🏠 Portal del Curso';
    document.body.appendChild(pill);
})();
