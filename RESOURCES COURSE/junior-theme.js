/**
 * ============================================================================
 * SELECTOR DINÁMICO DE COLOR PARA JAVASCRIPT JUNIOR LEVEL
 * Agrega los 5 botones de tema neón en .jr-top-nav y actualiza --accent y el fondo.
 * ============================================================================
 */
(function () { // Instrucción JavaScript
    'use strict'; // Activa el modo estricto de JavaScript

    const THEMES = { // Declara e inicializa "THEMES"
        cyan:    { accent: '#00f0ff', glow: '#083344', soft: 'rgba(0, 240, 255, 0.16)' },
        purple:  { accent: '#a855f7', glow: '#3b0764', soft: 'rgba(168, 85, 247, 0.16)' },
        emerald: { accent: '#10b981', glow: '#064e3b', soft: 'rgba(16, 185, 129, 0.16)' },
        amber:   { accent: '#f59e0b', glow: '#451a03', soft: 'rgba(245, 158, 11, 0.16)' },
        rose:    { accent: '#f43f5e', glow: '#4c0519', soft: 'rgba(244, 63, 94, 0.16)' }
    };

    const keys = Object.keys(THEMES); // Declara e inicializa "keys"
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Declara e inicializa "parts"
    const topicFolder = parts.length >= 2 ? parts[parts.length - 2] : 'Junior'; // Declara e inicializa "topicFolder"

    function aplicarTema(nombre) { // Declara función
        const t = THEMES[nombre] || THEMES.cyan; // Declara e inicializa "t"
        document.body.dataset.theme = nombre; // Asigna valor
        document.documentElement.style.setProperty('--accent', t.accent); // Ejecuta llamada o método
        document.documentElement.style.setProperty('--accent-soft', t.soft); // Ejecuta llamada o método
        document.body.style.background =
            `radial-gradient(circle at top, ${t.glow} 0%, #0b1120 55%), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)`; // Instrucción JavaScript
        document.body.style.backgroundSize = '100% 100%, 24px 24px'; // Asigna valor
    }

    let hash = 0; // Declara e inicializa "hash"
    for (let i = 0; i < topicFolder.length; i++) hash += topicFolder.charCodeAt(i); // Inicia bucle de iteración
    const initial = keys[hash % keys.length]; // Declara e inicializa "initial"
    aplicarTema(initial); // Ejecuta llamada o método

    // Inyecta estilos para tablas comparativas (.compare-table) y scrollbars neón en módulos Junior
    if (!document.getElementById('jrCompareTableStyle')) {
        const st = document.createElement('style'); // Crea nuevo elemento DOM "st"
        st.id = 'jrCompareTableStyle'; // Asigna id único
        st.textContent = `*{scrollbar-width:thin;scrollbar-color:var(--accent,#00f0ff) #0b1120}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#0b1120}::-webkit-scrollbar-thumb{background:var(--accent,#00f0ff);border-radius:999px;border:2px solid #0b1120}.compare-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.9rem;background:rgba(2,6,23,.55);border:1px solid var(--border,#334155);border-radius:10px;overflow:hidden}.compare-table th,.compare-table td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08)}.compare-table th{color:var(--accent,#00f0ff);background:rgba(15,23,42,.85);font-weight:700}.compare-table tr:last-child td{border-bottom:none}`; // Asigna reglas CSS
        document.head.appendChild(st); // Inserta estilo en head
    }

    const navRight = document.querySelector('.jr-top-nav > div'); // Obtiene referencia DOM para "navRight"
    if (navRight && !navRight.querySelector('.theme-dots')) { // Evalúa condición
        const dotsWrap = document.createElement('div'); // Crea nuevo elemento DOM "dotsWrap"
        dotsWrap.className = 'theme-dots'; // Asigna valor
        dotsWrap.title = 'Cambiar color del módulo'; // Asigna valor
        keys.forEach(t => { // Instrucción JavaScript
            const btn = document.createElement('button'); // Crea nuevo elemento DOM "btn"
            btn.type = 'button'; // Asigna valor
            btn.className = 'theme-dot' + (t === initial ? ' active' : ''); // Asigna valor
            btn.dataset.setTheme = t; // Asigna valor
            btn.addEventListener('click', () => { // Registra escuchador de eventos
                aplicarTema(t); // Ejecuta llamada o método
                dotsWrap.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active')); // Modifica clases CSS del elemento
                btn.classList.add('active'); // Modifica clases CSS del elemento
            });
            dotsWrap.appendChild(btn); // Inserta nodo en el DOM
        });
        navRight.prepend(dotsWrap); // Ejecuta llamada o método

        // Navegación directa entre módulos de JavaScript Junior Level (⬅ Anterior / Siguiente ➡)
        const JUNIOR_MODULES = ['Variables', 'Operadores', 'Concatenacion', 'Condicionales', 'Arrays', 'Bucles', 'For', 'Funciones', 'POO', 'Cadenas(Metodos)', 'Math', 'Console.log', 'Dom']; // Orden progresivo Junior
        const jIdx = JUNIOR_MODULES.indexOf(topicFolder); // Busca índice del módulo actual
        if (jIdx !== -1) { // Si coincide con un módulo de Junior Level
            const prevJ = jIdx > 0 ? JUNIOR_MODULES[jIdx - 1] : null; // Módulo anterior si existe
            const nextJ = jIdx < JUNIOR_MODULES.length - 1 ? JUNIOR_MODULES[jIdx + 1] : null; // Módulo siguiente si existe
            // Estilo común para los botones de navegación entre módulos
            const btnStyle = 'color:#cbd5e1;text-decoration:none;font-size:0.84rem;font-weight:600;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);'; // Cadena CSS
            if (prevJ) { // Agrega botón anterior en la barra superior
                const aPrev = document.createElement('a'); // Crea enlace anterior
                aPrev.href = encodeURI(`../${prevJ}/index.html`); // Ruta relativa
                aPrev.textContent = `⬅ ${prevJ}`; // Texto visible
                aPrev.style.cssText = btnStyle; // Aplica estilo
                navRight.appendChild(aPrev); // Inserta en barra superior
            }
            // Botón directo a la pestaña de Proyectos del portal
            const aProj = document.createElement('a'); // Crea enlace a Proyectos
            aProj.href = '../../../index.html?filter=proyectos'; // Ruta hacia la pestaña de Proyectos
            aProj.textContent = '🚀 Proyectos'; // Texto visible
            aProj.style.cssText = btnStyle; // Aplica estilo común
            navRight.appendChild(aProj); // Inserta en la barra superior
            if (nextJ) { // Agrega botón siguiente en la barra superior
                const aNext = document.createElement('a'); // Crea enlace siguiente
                aNext.href = encodeURI(`../${nextJ}/index.html`); // Ruta relativa
                aNext.textContent = `${nextJ} ➡`; // Texto visible
                aNext.style.cssText = btnStyle; // Aplica estilo
                navRight.appendChild(aNext); // Inserta en barra superior
            }
            // Agrega también barra inferior de navegación al final de .app-shell
            const appShell = document.querySelector('.app-shell'); // Contenedor principal Junior
            if (appShell) { // Si existe el contenedor
                const bottomNav = document.createElement('nav'); // Crea barra inferior
                bottomNav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:20px;padding:14px 18px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.1);border-radius:14px;'; // Estilos
                bottomNav.innerHTML = `
                    ${prevJ ? `<a href="${encodeURI(`../${prevJ}/index.html`)}" style="${btnStyle}">⬅ Anterior: ${prevJ}</a>` : '<span></span>'}
                    <a href="../DOCUMENTACION/index.html" style="${btnStyle}">📘 Ver Apuntes</a>
                    ${nextJ ? `<a href="${encodeURI(`../${nextJ}/index.html`)}" style="color:#070a13;text-decoration:none;font-size:0.84rem;font-weight:700;padding:6px 14px;border-radius:999px;background:var(--accent,#38bdf8);">Siguiente: ${nextJ} ➡</a>` : '<span></span>'}
                `; // Contenido de la barra inferior
                appShell.appendChild(bottomNav); // Inserta al final de .app-shell
            }
        }
    }
})(); // Ejecuta llamada o método
