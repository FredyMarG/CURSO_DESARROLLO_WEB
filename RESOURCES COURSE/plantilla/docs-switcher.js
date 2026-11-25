/**
 * ============================================================================
 * SELECTOR CRUZADO ENTRE CENTROS DE DOCUMENTACIÓN
 * Inyecta en .topbar una barra compacta para saltar directamente entre
 * HTML & CSS, JS Junior, JS Mid, JS Master y Node.js desde cualquier apunte.
 * ============================================================================
 */
(function () {
    'use strict';

    const topbar = document.querySelector('.topbar'); // Declara e inicializa variable local
    if (!topbar || topbar.querySelector('.docs-switcher')) return; // Evalúa condición lógica

    // Detecta el nivel de profundidad relativo hacia la raíz del repositorio
    const pathNorm = decodeURIComponent(window.location.pathname).replace(/\\/g, '/'); // Declara e inicializa variable local
    const isJsNested = /\/JAVASCRIPT\/JAVASCRIPT (?:JUNIOR|MID|MASTER) LEVEL\//i.test(pathNorm);
    const toRoot = isJsNested ? '../../../' : '../../'; // Declara e inicializa variable local

    // Catálogo ordenado de los 5 centros de documentación del curso con su favicon oficial (Flaticon)
    const DOC_CENTERS = [
        { id: 'htmlcss', label: '🎨 HTML & CSS', href: `${toRoot}HTML y CSS/Documentacion/index.html`, icon: 'https://cdn-icons-png.flaticon.com/512/174/174854.png', match: /\/HTML y CSS\//i },
        { id: 'junior',  label: '🌱 JS Junior',   href: `${toRoot}JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/DOCUMENTACION/index.html`, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png', match: /JAVASCRIPT JUNIOR LEVEL/i },
        { id: 'mid',     label: '⚡ JS Mid',      href: `${toRoot}JAVASCRIPT/JAVASCRIPT MID LEVEL/DOCUMENTACION/index.html`, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png', match: /JAVASCRIPT MID LEVEL/i },
        { id: 'master',  label: '🚀 JS Master',   href: `${toRoot}JAVASCRIPT/JAVASCRIPT MASTER LEVEL/DOCUMENTACION/index.html`, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png', match: /JAVASCRIPT MASTER LEVEL/i },
        { id: 'node',    label: '🟢 Node.js',     href: `${toRoot}NODE/Documentacion/index.html`, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png', match: /\/NODE\//i }
    ];

    // Reemplaza el favicon de la pestaña por el logo oficial de la documentación activa
    const activeCenter = DOC_CENTERS.find((c) => c.match.test(pathNorm)); // Declara e inicializa variable local
    if (activeCenter && activeCenter.icon) { // Evalúa condición lógica
        const iconLink = document.querySelector('link[rel~="icon"]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' }); // Declara e inicializa variable local
        iconLink.type = 'image/png';
        iconLink.href = activeCenter.icon;
    }

    // Paleta de color acorde a cada tecnología con contraste alto sobre fondo oscuro (#070a13)
    const THEME_BY_ID = {
        htmlcss: { primary: '#38bdf8', secondary: '#f97316', onPrimary: '#070a13' }, // Azul CSS + Naranja HTML
        junior:  { primary: '#facc15', secondary: '#fde047', onPrimary: '#070a13' }, // Amarillo oficial JS
        mid:     { primary: '#facc15', secondary: '#fde047', onPrimary: '#070a13' },
        master:  { primary: '#facc15', secondary: '#fde047', onPrimary: '#070a13' },
        node:    { primary: '#10b981', secondary: '#34d399', onPrimary: '#070a13' }  // Verde Node.js
    };
    const palette = THEME_BY_ID[activeCenter?.id] || THEME_BY_ID.node; // Declara e inicializa variable local

    // Aplica variables CSS de color y fuerza la misma tipografía ('Fira Code') en los números de índice
    const rootStyle = document.documentElement.style; // Declara e inicializa variable local
    rootStyle.setProperty('--primary', palette.primary);
    rootStyle.setProperty('--cyan', palette.secondary);
    rootStyle.setProperty('--mono', "'Fira Code', monospace");

    // Inyecta estilos encapsulados del selector, números uniformes y contraste por tema
    if (!document.getElementById('docsSwitcherStyle')) { // Evalúa condición lógica
        const st = document.createElement('style'); // Declara e inicializa variable local
        st.id = 'docsSwitcherStyle';
        st.textContent = `
            .docs-switcher { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
            .docs-switch-pill {
                font-family: var(--sans, 'Outfit', system-ui, sans-serif);
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--muted, #94a3b8);
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                border-radius: 999px;
                padding: 5px 11px;
                text-decoration: none;
                transition: all 0.2s ease;
                white-space: nowrap;
            }
            .docs-switch-pill:hover {
                color: #fff;
                border-color: var(--primary);
                background: color-mix(in srgb, var(--primary) 16%, transparent);
            }
            .docs-switch-pill.active {
                color: ${palette.onPrimary};
                background: var(--primary);
                border-color: var(--primary);
                font-weight: 700;
            }
            /* Tipografía idéntica ('Fira Code') y contraste uniforme para índices en HTML, JS y Node */
            .doc-item strong .doc-item-num {
                display: inline-block;
                font-family: 'Fira Code', monospace !important;
                font-size: 0.74rem !important;
                font-weight: 700;
                letter-spacing: 0.02em;
                color: var(--primary) !important;
                background: color-mix(in srgb, var(--primary) 14%, transparent);
                border: 1px solid color-mix(in srgb, var(--primary) 38%, transparent);
                border-radius: 6px;
                padding: 1px 6px;
                margin-right: 6px;
                vertical-align: middle;
            }
            .doc-item.active {
                background: color-mix(in srgb, var(--primary) 14%, transparent) !important;
                border-color: var(--primary) !important;
            }
            .doc-item.active strong .doc-item-num {
                background: var(--primary) !important;
                color: ${palette.onPrimary} !important;
                border-color: transparent;
            }
            .toc-num {
                font-family: 'Fira Code', monospace !important;
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--primary);
                margin-right: 6px;
            }
            .toc-link.lvl-3 {
                padding-left: 14px !important;
                font-size: 0.78rem !important;
            }
            .toc-link.lvl-3 .toc-num {
                font-size: 0.71rem;
                opacity: 0.85;
            }
            .toc-link.active {
                color: var(--primary) !important;
                font-weight: 700;
            }
            /* Modo Enfoque: oculta barras laterales y expande el lector */
            .layout.focus-mode {
                grid-template-columns: 1fr !important;
                max-width: 960px !important;
            }
            .layout.focus-mode .sidebar,
            .layout.focus-mode .toc {
                display: none !important;
            }
            .reader-tools {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }
            .read-time-badge {
                font-family: 'Fira Code', monospace;
                font-size: 0.76rem;
                color: var(--muted, #94a3b8);
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                border-radius: 999px;
                padding: 5px 10px;
            }
            /* Botón flotante ↑ Subir */
            #backToTopDocs {
                position: fixed;
                right: 22px;
                bottom: 22px;
                z-index: 50;
                opacity: 0;
                pointer-events: none;
                transform: translateY(10px);
                transition: opacity 0.2s ease, transform 0.2s ease;
                background: rgba(15, 23, 42, 0.92);
                color: var(--primary);
                border: 1px solid var(--primary);
                border-radius: 999px;
                padding: 9px 14px;
                font-family: var(--sans, 'Outfit', system-ui, sans-serif);
                font-size: 0.82rem;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
            }
            #backToTopDocs.visible {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0);
            }
            /* Contraste y acentos específicos para HTML & CSS (Azul + Naranja) y JS (Amarillo) */
            .md-body code:not(pre code) {
                background: color-mix(in srgb, var(--primary) 14%, transparent) !important;
                color: var(--primary) !important;
            }
            .md-body blockquote {
                border-left-color: ${activeCenter?.id === 'htmlcss' ? '#f97316' : 'var(--primary)'} !important;
                background: color-mix(in srgb, ${activeCenter?.id === 'htmlcss' ? '#f97316' : 'var(--primary)'} 10%, transparent) !important;
            }
            .md-body h2 {
                color: ${activeCenter?.id === 'htmlcss' ? '#f97316' : 'var(--primary)'} !important;
            }
            .md-body th {
                background: color-mix(in srgb, var(--primary) 14%, transparent) !important;
                color: var(--primary) !important;
            }
            .copy-btn:hover {
                background: var(--primary) !important;
                color: ${palette.onPrimary} !important;
            }
        `;
        document.head.appendChild(st);
    }

    // Construye el contenedor de navegación entre documentaciones
    const nav = document.createElement('nav'); // Declara e inicializa variable local
    nav.className = 'docs-switcher';
    nav.setAttribute('aria-label', 'Cambiar de documentación');

    DOC_CENTERS.forEach((center) => {
        const a = document.createElement('a'); // Declara e inicializa variable local
        const isCurrent = center.match.test(pathNorm); // Declara e inicializa variable local
        a.className = 'docs-switch-pill' + (isCurrent ? ' active' : '');
        a.href = encodeURI(center.href);
        a.textContent = center.label; // Actualiza texto plano en el DOM
        if (isCurrent) a.setAttribute('aria-current', 'page'); // Evalúa condición lógica
        nav.appendChild(a);
    });

    // Inserta el selector justo después de .brand dentro de .topbar
    const brand = topbar.querySelector('.brand'); // Declara e inicializa variable local
    if (brand && brand.nextSibling) topbar.insertBefore(nav, brand.nextSibling); // Evalúa condición lógica
    else topbar.appendChild(nav);

    // Barra universal de progreso de lectura superior (si el visor no define una propia)
    if (!document.getElementById('readProgress')) { // Evalúa condición lógica
        const rp = document.createElement('div'); // Declara e inicializa variable local
        rp.id = 'readProgress';
        rp.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,var(--primary,#38bdf8),var(--cyan,#10b981));z-index:60;transition:width 0.1s linear;';
        document.body.prepend(rp);
        window.addEventListener('scroll', () => { // Registra escuchador de evento en el DOM
            const max = document.documentElement.scrollHeight - window.innerHeight; // Declara e inicializa variable local
            rp.style.width = max > 0 ? `${Math.min(100, Math.round((window.scrollY / max) * 100))}%` : '0%';
        }, { passive: true });
    }

    // Navegación inferior universal entre guías (⬅ Anterior / Siguiente ➡) y sincronización ?doc=
    const reader = document.querySelector('main.reader'); // Declara e inicializa variable local
    const docList = document.getElementById('docList'); // Declara e inicializa variable local
    const docContent = document.getElementById('docContent'); // Declara e inicializa variable local
    if (reader && docList && docContent && !document.getElementById('docNav')) { // Evalúa condición lógica
        const docNav = document.createElement('div'); // Declara e inicializa variable local
        docNav.id = 'docNav';
        docNav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:28px;padding-top:18px;border-top:1px solid var(--border,rgba(255,255,255,0.1));flex-wrap:wrap;';
        reader.appendChild(docNav);

        const syncBottomNav = () => {
            const items = Array.from(docList.querySelectorAll('.doc-item')); // Declara e inicializa variable local
            const activeIdx = items.findIndex(b => b.classList.contains('active')); // Declara e inicializa variable local
            const prevBtn = activeIdx > 0 ? items[activeIdx - 1] : null; // Declara e inicializa variable local
            const nextBtn = activeIdx >= 0 && activeIdx < items.length - 1 ? items[activeIdx + 1] : null; // Declara e inicializa variable local
            const label = (b) => b.querySelector('strong')?.textContent || b.textContent.trim(); // Declara e inicializa variable local

            docNav.innerHTML = ''; // Actualiza estructura HTML interna
            const left = prevBtn ? document.createElement('button') : document.createElement('span'); // Declara e inicializa variable local
            if (prevBtn) { // Evalúa condición lógica
                left.className = 'btn';
                left.textContent = `⬅ ${label(prevBtn)}`; // Actualiza texto plano en el DOM
                left.addEventListener('click', () => { prevBtn.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
            }
            const right = nextBtn ? document.createElement('button') : document.createElement('span'); // Declara e inicializa variable local
            if (nextBtn) { // Evalúa condición lógica
                right.className = 'btn';
                right.textContent = `${label(nextBtn)} ➡`; // Actualiza texto plano en el DOM
                right.addEventListener('click', () => { nextBtn.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
            }
            docNav.append(left, right);
        };

        new MutationObserver(syncBottomNav).observe(docContent, { childList: true });
        syncBottomNav();
    }

    // Da formato estético uniforme al prefijo numérico (ej. "01.") en la barra lateral de los 5 visores (incluyendo Node)
    if (docList) { // Evalúa condición lógica
        const decorateSidebarNumbers = () => {
            docList.querySelectorAll('.doc-item strong').forEach((el) => {
                if (el.querySelector('.doc-item-num')) return; // Evalúa condición lógica
                const m = el.textContent.trim().match(/^(\d{2}\.)\s+([\s\S]+)$/); // Declara e inicializa variable local
                if (m) el.innerHTML = `<span class="doc-item-num">${m[1]}</span>${m[2]}`; // Evalúa condición lógica
            });
        };
        new MutationObserver(decorateSidebarNumbers).observe(docList, { childList: true });
        decorateSidebarNumbers();
    }

    // Normaliza el panel derecho (#tocList) en los 5 visores:
    // quita emojis y numera de forma uniforme secciones (01.) y subsecciones (01.1., 01.2.)
    const tocList = document.getElementById('tocList'); // Declara e inicializa variable local
    if (tocList) { // Evalúa condición lógica
        const decorateTocNumbers = () => {
            const links = Array.from(tocList.querySelectorAll('.toc-link')); // Declara e inicializa variable local
            if (!links.length) return; // Evalúa condición lógica
            // Si hay encabezados lvl-1 (#) en el índice, esos son las secciones principales; si no, lvl-2 (##)
            const hasLvl1 = links.some(a => a.classList.contains('lvl-1')); // Declara e inicializa variable local
            const mainClass = hasLvl1 ? 'lvl-1' : 'lvl-2'; // Declara e inicializa variable local
            let secNum = 0; // Declara e inicializa variable local
            let subNum = 0; // Declara e inicializa variable local

            links.forEach((a) => {
                // Elimina cualquier emoji, keycap (1️⃣, 🔟) y prefijo manual previo (1., 3.1., A.)
                let text = a.textContent
                    .replace(/(?:[0-9#*]\uFE0F?\u20E3|[\p{Extended_Pictographic}\uFE0F\u200D])/gu, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                text = text.replace(/^(?:\d+(?:\.\d+)*|[A-Z])[.)]\s+/, '').trim();

                const isMain = a.classList.contains(mainClass); // Declara e inicializa variable local
                if (isMain) { // Evalúa condición lógica
                    secNum += 1;
                    subNum = 0;
                } else {
                    if (secNum === 0) secNum = 1; // Evalúa condición lógica
                    subNum += 1;
                }

                const numLabel = isMain
                    ? `${String(secNum).padStart(2, '0')}.`
                    : `${String(secNum).padStart(2, '0')}.${subNum}`;

                a.textContent = ''; // Actualiza texto plano en el DOM
                const badge = document.createElement('span'); // Declara e inicializa variable local
                badge.className = 'toc-num';
                badge.textContent = numLabel; // Actualiza texto plano en el DOM
                a.append(badge, document.createTextNode(text));
            });
        };
        new MutationObserver(decorateTocNumbers).observe(tocList, { childList: true });
        decorateTocNumbers();
    }

    // 1. ScrollSpy automático en #tocList
    if (tocList && docContent && 'IntersectionObserver' in window) { // Evalúa condición lógica
        let spyObserver = null; // Declara e inicializa variable local
        const bindScrollSpy = () => {
            if (spyObserver) spyObserver.disconnect(); // Evalúa condición lógica
            const headings = Array.from(docContent.querySelectorAll('h1[id], h2[id], h3[id]')); // Declara e inicializa variable local
            if (!headings.length) return; // Evalúa condición lógica
            spyObserver = new IntersectionObserver((entries) => {
                const visible = entries.find(e => e.isIntersecting); // Declara e inicializa variable local
                if (!visible) return; // Evalúa condición lógica
                tocList.querySelectorAll('.toc-link').forEach(a =>
                    a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`)
                );
            }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
            headings.forEach(h => spyObserver.observe(h));
        };
        new MutationObserver(bindScrollSpy).observe(docContent, { childList: true });
        bindScrollSpy();
    }

    // 2. Tiempo estimado de lectura + Botón Modo Enfoque en .reader-head
    const readerHead = document.querySelector('.reader-head'); // Declara e inicializa variable local
    const layoutEl = document.querySelector('.layout'); // Declara e inicializa variable local
    if (readerHead && docContent && !readerHead.querySelector('.reader-tools')) { // Evalúa condición lógica
        const tools = document.createElement('div'); // Declara e inicializa variable local
        tools.className = 'reader-tools';

        const readTime = document.createElement('span'); // Declara e inicializa variable local
        readTime.className = 'read-time-badge';
        const updateReadTime = () => {
            const words = (docContent.textContent || '').trim().split(/\s+/).filter(Boolean).length; // Declara e inicializa variable local
            const mins = Math.max(1, Math.round(words / 200)); // Declara e inicializa variable local
            readTime.textContent = `⏱️ ~${mins} min`; // Actualiza texto plano en el DOM
        };
        new MutationObserver(updateReadTime).observe(docContent, { childList: true });
        updateReadTime();
        tools.appendChild(readTime);

        if (layoutEl) { // Evalúa condición lógica
            const focusBtn = document.createElement('button'); // Declara e inicializa variable local
            focusBtn.type = 'button';
            focusBtn.className = 'btn';
            focusBtn.textContent = '📖 Modo Enfoque'; // Actualiza texto plano en el DOM
            focusBtn.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                const on = layoutEl.classList.toggle('focus-mode'); // Declara e inicializa variable local
                focusBtn.textContent = on ? '📑 Mostrar Paneles' : '📖 Modo Enfoque'; // Actualiza texto plano en el DOM
            });
            tools.appendChild(focusBtn);
        }

        const modBtn = document.getElementById('moduleBtn'); // Declara e inicializa variable local
        if (modBtn) tools.appendChild(modBtn); // Evalúa condición lógica
        readerHead.appendChild(tools);
    }

    // 3. Botón flotante ↑ Subir
    if (!document.getElementById('backToTopDocs')) { // Evalúa condición lógica
        const topBtn = document.createElement('button'); // Declara e inicializa variable local
        topBtn.id = 'backToTopDocs';
        topBtn.type = 'button';
        topBtn.textContent = '↑ Subir'; // Actualiza texto plano en el DOM
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.body.appendChild(topBtn);
        window.addEventListener('scroll', () => { // Registra escuchador de evento en el DOM
            topBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
    }

    // 4. Atajo de teclado ("/" o Ctrl+K) para enfocar #docSearch y Escape para limpiar
    const docSearchInput = document.getElementById('docSearch'); // Declara e inicializa variable local
    if (docSearchInput) { // Evalúa condición lógica
        document.addEventListener('keydown', (e) => { // Registra escuchador de evento en el DOM
            if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) && document.activeElement !== docSearchInput) { // Evalúa condición lógica
                e.preventDefault();
                docSearchInput.focus();
                docSearchInput.select();
            } else if (e.key === 'Escape' && document.activeElement === docSearchInput && docSearchInput.value) {
                docSearchInput.value = '';
                docSearchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // Soporte universal de enlace directo ?doc=<archivo> en cualquiera de los 5 visores
    const reqDoc = new URLSearchParams(window.location.search).get('doc'); // Declara e inicializa variable local
    if (reqDoc && docList) { // Evalúa condición lógica
        const target = Array.from(docList.querySelectorAll('.doc-item')).find(b =>
            b.textContent.toLowerCase().includes(reqDoc.toLowerCase())
        );
        if (target && !target.classList.contains('active')) target.click(); // Evalúa condición lógica
    }
})();

