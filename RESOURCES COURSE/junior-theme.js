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

    // Inyecta estilos para tablas comparativas (.compare-table) en módulos Junior
    if (!document.getElementById('jrCompareTableStyle')) {
        const st = document.createElement('style'); // Crea nuevo elemento DOM "st"
        st.id = 'jrCompareTableStyle'; // Asigna id único
        st.textContent = `.compare-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.9rem;background:rgba(2,6,23,.55);border:1px solid var(--border,#334155);border-radius:10px;overflow:hidden}.compare-table th,.compare-table td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08)}.compare-table th{color:var(--accent,#00f0ff);background:rgba(15,23,42,.85);font-weight:700}.compare-table tr:last-child td{border-bottom:none}`; // Asigna reglas CSS
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
    }
})(); // Ejecuta llamada o método
