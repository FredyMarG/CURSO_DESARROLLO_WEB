/**
 * ============================================================================
 * HUD FLOTANTE DE EJERCICIOS — HTML5 Y CSS3
 * Inyecta una barra flotante de navegación y un inspector de CSS en vivo.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () { // Instrucción JavaScript
    // Modo estricto para garantizar código seguro
    'use strict'; // Activa el modo estricto de JavaScript

    // Lee metadatos del proyecto desde los atributos data-* del <body>
    const body = document.body; // Declara e inicializa "body"
    const title = body.dataset.hudTitle || document.title || 'Proyecto CSS'; // Declara e inicializa "title"
    const desc = body.dataset.hudDesc || 'Proyecto práctico de HTML5 y CSS3.'; // Declara e inicializa "desc"
    const backProjects = body.dataset.hudBack || '../index.html'; // Declara e inicializa "backProjects"
    const backPortal = body.dataset.hudPortal || '../../index.html'; // Declara e inicializa "backPortal"

    // Crea la cápsula flotante en la esquina inferior derecha
    const hud = document.createElement('div'); // Crea nuevo elemento DOM "hud"
    hud.className = 'ej-hud'; // Asigna valor
    hud.innerHTML = `
        <span class="ej-hud-title">✨ ${title}</span>
        <button type="button" class="ej-hud-btn" id="ejBtnCss">🎨 Ver CSS</button>
        <a class="ej-hud-btn" href="${backProjects}">⬅ Proyectos</a>
        <a class="ej-hud-btn" href="${backPortal}">🏠 Portal</a>
    `;
    document.body.appendChild(hud); // Inserta nodo en el DOM

    // Crea el cajón lateral para inspeccionar el archivo style.css del ejercicio
    const drawer = document.createElement('aside'); // Crea nuevo elemento DOM "drawer"
    drawer.className = 'ej-drawer'; // Asigna valor
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
    document.body.appendChild(drawer); // Inserta nodo en el DOM

    const btnCss = document.getElementById('ejBtnCss'); // Obtiene referencia DOM para "btnCss"
    const btnClose = document.getElementById('ejBtnClose'); // Obtiene referencia DOM para "btnClose"
    const btnCopy = document.getElementById('ejBtnCopy'); // Obtiene referencia DOM para "btnCopy"
    const cssCode = document.getElementById('ejCssCode'); // Obtiene referencia DOM para "cssCode"
    let loaded = false; // Declara e inicializa "loaded"

    // Abre el cajón y carga style.css la primera vez
    btnCss.addEventListener('click', async () => { // Registra escuchador de eventos
        drawer.classList.add('open'); // Modifica clases CSS del elemento
        if (!loaded) { // Evalúa condición
            try { // Inicia bloque protegido contra errores
                const res = await fetch('style.css'); // Declara e inicializa "res"
                cssCode.textContent = res.ok ? await res.text() : '/* No se pudo cargar style.css */'; // Actualiza contenido en el DOM
                loaded = true; // Asigna valor
            } catch (_) { // Instrucción JavaScript
                cssCode.textContent = '/* Abre el proyecto desde un servidor local (Live Server) para inspeccionar style.css aquí. */'; // Actualiza contenido en el DOM
            }
        }
    });

    // Cierra el cajón lateral
    btnClose.addEventListener('click', () => drawer.classList.remove('open')); // Registra escuchador de eventos

    // Copia el CSS mostrado al portapapeles
    btnCopy.addEventListener('click', () => { // Registra escuchador de eventos
        navigator.clipboard?.writeText(cssCode.textContent || ''); // Actualiza contenido en el DOM
        btnCopy.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
        setTimeout(() => { btnCopy.textContent = 'Copiar'; }, 1400); // Actualiza contenido en el DOM
    });
})(); // Ejecuta llamada o método
