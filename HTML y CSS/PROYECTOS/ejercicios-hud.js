/**
 * ============================================================================
 * HUD FLOTANTE DE PROYECTOS — HTML5 Y CSS3
 * Inyecta una barra flotante de navegación (Anterior / Siguiente / Proyectos /
 * Portal) y un inspector de CSS en vivo.
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    // Lee metadatos del proyecto desde los atributos data-* del <body>
    const body = document.body; // Referencia al elemento body
    const title = body.dataset.hudTitle || document.title || 'Proyecto CSS'; // Título mostrado en la cápsula
    const desc = body.dataset.hudDesc || 'Proyecto práctico de HTML5 y CSS3.'; // Descripción en el inspector
    const backProjects = body.dataset.hudBack || '../index.html'; // Ruta al índice de proyectos HTML/CSS
    const backPortal = body.dataset.hudPortal || '../../index.html'; // Ruta al portal principal

    // Lista ordenada de los 11 proyectos de HTML y CSS para navegación directa
    const HTML_CSS_PROJECTS = [
        { path: 'PROYECTOS/ACCORDION MENU/SUMMARY-DETAILS/index.html', label: 'Accordion (Summary)' },
        { path: 'PROYECTOS/ACCORDION MENU/DIVS/index.html', label: 'Accordion (Divs)' },
        { path: 'PROYECTOS/CHATBOX/index.html', label: 'Chatbox UI' },
        { path: 'PROYECTOS/FLIPPER CARD/index.html', label: 'Flipper Card 3D' },
        { path: 'CSS BASICO/Ejercicios/Tarjeta de presentacion/index.html', label: 'Tarjeta de Presentación' },
        { path: 'PROYECTOS/ONE VIEW PAGE/index.html', label: 'One View Page' },
        { path: 'PROYECTOS/SIDEBAR MENU/index.html', label: 'Sidebar Menu' },
        { path: 'PROYECTOS/WEB PAGE/index.html', label: 'Web Page' },
        { path: 'PROYECTOS/WEB PAGE ANIMATIONS/index.html', label: 'Web Page Animations' },
        { path: 'CSS avanzado/Ejercicios/Ventana Modal/modal.html', label: 'Ventana Modal' },
        { path: 'Responsive Design/Holi Grail/holigrail.html', label: 'Holy Grail Layout' }
    ];

    // Helper reutilizable para construir enlaces dentro del HUD flotante
    const createHudLink = (href, text, tooltip = '') => {
        const a = document.createElement('a'); // Crea elemento enlace
        a.className = 'ej-hud-btn'; // Aplica estilo de botón del HUD
        a.href = href; // Asigna URL de destino
        a.textContent = text; // Inserta texto seguro
        if (tooltip) a.title = tooltip; // Agrega tooltip opcional
        return a; // Retorna el enlace configurado
    };

    // Calcula la ruta relativa hacia "HTML y CSS/" y el índice del proyecto actual
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Segmentos de la URL
    const htmlCssIdx = parts.findIndex(p => p === 'HTML y CSS'); // Índice de la carpeta raíz HTML y CSS
    const relFromHtmlCss = htmlCssIdx !== -1 ? parts.slice(htmlCssIdx + 1).join('/') : ''; // Ruta relativa interna
    const toHtmlCssRoot = htmlCssIdx !== -1 ? '../'.repeat(Math.max(1, parts.length - 2 - htmlCssIdx)) : '../'; // Prefijo relativo
    const projIdx = HTML_CSS_PROJECTS.findIndex(p => p.path.toLowerCase() === relFromHtmlCss.toLowerCase()); // Posición actual

    // Lee si el usuario filtró únicamente proyectos HTML/CSS desde el portal
    let isHtmlOnly = false; // Por defecto permite continuar hacia JS
    try { isHtmlOnly = sessionStorage.getItem('cursoProjectScope') === 'htmlcss'; } catch (_) {} // Consulta filtro activo

    const prevProj = projIdx > 0 ? HTML_CSS_PROJECTS[projIdx - 1] : null; // Proyecto anterior si existe
    let nextProj = projIdx !== -1 && projIdx < HTML_CSS_PROJECTS.length - 1 ? HTML_CSS_PROJECTS[projIdx + 1] : null; // Siguiente proyecto HTML/CSS
    if (!nextProj && projIdx === HTML_CSS_PROJECTS.length - 1 && !isHtmlOnly) {
        nextProj = { path: '../JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/EJERCICIOS/12 La LLave Correcta/index.html', label: 'JS: La Llave Correcta' }; // Enlace al primer proyecto JS
    }

    // Construye la cápsula flotante en la esquina inferior derecha usando nodos seguros
    const hud = document.createElement('div'); // Contenedor principal del HUD
    hud.className = 'ej-hud'; // Aplica estilos flotantes

    const hudTitle = document.createElement('span'); // Etiqueta con el título del proyecto
    hudTitle.className = 'ej-hud-title'; // Estilo de título
    hudTitle.textContent = `✨ ${title}`; // Texto seguro del título
    hud.appendChild(hudTitle); // Inserta título

    if (prevProj) hud.appendChild(createHudLink(encodeURI(toHtmlCssRoot + prevProj.path), `⬅ ${prevProj.label}`, `Anterior: ${prevProj.label}`)); // Botón Anterior

    const btnCss = document.createElement('button'); // Botón para abrir el inspector de style.css
    btnCss.type = 'button'; // Evita envíos de formulario
    btnCss.className = 'ej-hud-btn'; // Estilo compartido
    btnCss.id = 'ejBtnCss'; // Identificador para el listener
    btnCss.textContent = '🎨 Ver CSS'; // Texto del botón
    hud.appendChild(btnCss); // Inserta botón CSS

    hud.appendChild(createHudLink(backProjects, '🚀 Proyectos')); // Enlace a exhibición de proyectos
    hud.appendChild(createHudLink(backPortal, '🏠 Portal')); // Enlace al portal principal
    if (nextProj) hud.appendChild(createHudLink(encodeURI(toHtmlCssRoot + nextProj.path), `${nextProj.label} ➡`, `Siguiente: ${nextProj.label}`)); // Botón Siguiente
    document.body.appendChild(hud); // Monta el HUD en el documento

    // Crea el cajón lateral para inspeccionar el archivo style.css del proyecto
    const drawer = document.createElement('aside'); // Contenedor lateral deslizable
    drawer.className = 'ej-drawer'; // Clase de estilos del cajón
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
    document.body.appendChild(drawer); // Monta el inspector en el DOM

    const btnClose = document.getElementById('ejBtnClose'); // Botón para cerrar el cajón
    const btnCopy = document.getElementById('ejBtnCopy'); // Botón para copiar CSS
    const cssCode = document.getElementById('ejCssCode'); // Bloque donde se muestra el código CSS
    let loaded = false; // Evita recargar style.css múltiples veces

    // Abre el cajón y descarga style.css la primera vez que se solicita
    btnCss.addEventListener('click', async () => {
        drawer.classList.add('open'); // Muestra el panel lateral
        if (loaded) return; // Si ya se cargó, no repite el fetch
        try {
            const res = await fetch('style.css'); // Solicita la hoja de estilos local
            cssCode.textContent = res.ok ? await res.text() : '/* No se pudo cargar style.css */'; // Muestra contenido
            loaded = true; // Marca como cargado
        } catch (_) {
            cssCode.textContent = '/* Abre el proyecto desde un servidor local (Live Server) para inspeccionar style.css aquí. */'; // Mensaje fallback sin servidor
        }
    });

    btnClose.addEventListener('click', () => drawer.classList.remove('open')); // Cierra el panel lateral
    btnCopy.addEventListener('click', () => {
        navigator.clipboard?.writeText(cssCode.textContent || ''); // Copia el código al portapapeles
        btnCopy.textContent = '¡Copiado!'; // Confirmación visual temporal
        setTimeout(() => { btnCopy.textContent = 'Copiar'; }, 1400); // Restaura el texto original
    });
})();
