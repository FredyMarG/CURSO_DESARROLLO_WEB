/**
 * ============================================================================
 * HUD FLOTANTE DE EJERCICIOS — HTML5 Y CSS3
 * Inyecta una barra flotante de navegación y un inspector de CSS en vivo.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    // Modo estricto para garantizar código seguro
    'use strict'; // Activa el modo estricto de JavaScript

    // Lee metadatos del proyecto desde los atributos data-* del <body>
    const body = document.body;
    const title = body.dataset.hudTitle || document.title || 'Proyecto CSS';
    const desc = body.dataset.hudDesc || 'Proyecto práctico de HTML5 y CSS3.';
    const backProjects = body.dataset.hudBack || '../index.html';
    const backPortal = body.dataset.hudPortal || '../../index.html';

    // Crea la cápsula flotante en la esquina inferior derecha
    const hud = document.createElement('div');
    hud.className = 'ej-hud';
    hud.innerHTML = `
        <span class="ej-hud-title">✨ ${title}</span>
        <button type="button" class="ej-hud-btn" id="ejBtnCss">🎨 Ver CSS</button>
        <a class="ej-hud-btn" href="${backProjects}">⬅ Proyectos</a>
        <a class="ej-hud-btn" href="${backPortal}">🏠 Portal</a>
    `;
    document.body.appendChild(hud);

    // Crea el cajón lateral para inspeccionar el archivo style.css del ejercicio
    const drawer = document.createElement('aside');
    drawer.className = 'ej-drawer';
    drawer.innerHTML = `
        <div class="ej-drawer-head">
            <h3>🎨 Inspector CSS: ${title}</h3>
            <div style="display:flex;gap:6px;">
                <button type="button" class="ej-hud-btn" id="ejBtnCopy">Copiar</button>
                <button type="button" class="ej-hud-btn" id="ejBtnClose">✕</button>
            </div>
        </div>
        <p class="ej-drawer-desc">${desc}</p>
        <pre class="ej-drawer-code" id="ejCssCode">Cargando style.css...</pre>
    `;
    document.body.appendChild(drawer);

    const btnCss = document.getElementById('ejBtnCss');
    const btnClose = document.getElementById('ejBtnClose');
    const btnCopy = document.getElementById('ejBtnCopy');
    const cssCode = document.getElementById('ejCssCode');
    let loaded = false;

    // Abre el cajón y carga style.css la primera vez
    btnCss.addEventListener('click', async () => {
        drawer.classList.add('open');
        if (!loaded) {
            try { // Inicia bloque protegido contra errores
                const res = await fetch('style.css');
                cssCode.textContent = res.ok ? await res.text() : '/* No se pudo cargar style.css */'; // Actualiza contenido en el DOM
                loaded = true;
            } catch (_) {
                cssCode.textContent = '/* Abre el proyecto desde un servidor local (Live Server) para inspeccionar style.css aquí. */'; // Actualiza contenido en el DOM
            }
        }
    });

    // Cierra el cajón lateral
    btnClose.addEventListener('click', () => drawer.classList.remove('open'));

    // Copia el CSS mostrado al portapapeles
    btnCopy.addEventListener('click', () => {
        navigator.clipboard?.writeText(cssCode.textContent || ''); // Actualiza contenido en el DOM
        btnCopy.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
        setTimeout(() => { btnCopy.textContent = 'Copiar'; }, 1400); // Actualiza contenido en el DOM
    });
})();
