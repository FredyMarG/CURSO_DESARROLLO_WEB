/**
 * ============================================================================
 * SELECTOR DINÁMICO DE COLOR PARA JAVASCRIPT JUNIOR LEVEL
 * Agrega los 5 botones de tema neón en .jr-top-nav y actualiza --accent y el fondo.
 * ============================================================================
 */
(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    // Extrae los segmentos de la ruta URL para identificar la carpeta del módulo actual
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
    const topicFolder = parts.length >= 2 ? parts[parts.length - 2] : 'Junior';

    /**
     * Genera un favicon SVG transparente acorde al tema específico del módulo Junior
     * y lo inyecta o actualiza en el <head> del documento.
     */
    (function setJuniorTopicTabIcon() {
        const key = `${parts.join('/')} ${document.title}`.toLowerCase(); // Texto normalizado para coincidencia temática
        // Tabla ordenada de coincidencias: [expresión regular, símbolo/emoji, color acento para texto]
        const JUNIOR_ICONS = [
            [/variable/, '📦', '#38bdf8'],
            [/operador/, '⚖️', '#a855f7'],
            [/condicional/, '🔀', '#f59e0b'],
            [/m[eé]todo.*array|array.*m[eé]todo/, '🧰', '#10b981'],
            [/array/, '🧺', '#38bdf8'],
            [/bucle|for|while/, '🔄', '#10b981'],
            [/funci/, 'ƒx', '#38bdf8'],
            [/poo|objeto/, '🏗️', '#f59e0b'],
            [/cadena|string/, '🔤', '#a855f7'],
            [/math|matem/, '🧮', '#f43f5e'],
            [/consola/, '>_', '#10b981'],
            [/dom/, '🌳', '#10b981']
        ];
        const match = JUNIOR_ICONS.find(([re]) => re.test(key));
        const symbol = match ? match[1] : 'JS'; // Símbolo temático o respaldo JS
        const accent = match ? match[2] : '#f7df1e'; // Color del símbolo cuando es texto (ej. ƒx, >_)
        const fontSize = symbol.length > 1 ? 40 : 52; // Ajusta tamaño para símbolos de 2 caracteres
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Fira Code,Arial,sans-serif" font-weight="800" font-size="${fontSize}" fill="${accent}">${symbol}</text></svg>`;

        const link = document.querySelector('link[rel~="icon"]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' });
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    })();

    // Paleta de 5 temas neón intercambiables en módulos Junior
    const THEMES = {
        cyan:    { accent: '#00f0ff', glow: '#083344', soft: 'rgba(0, 240, 255, 0.16)' },
        purple:  { accent: '#a855f7', glow: '#3b0764', soft: 'rgba(168, 85, 247, 0.16)' },
        emerald: { accent: '#10b981', glow: '#064e3b', soft: 'rgba(16, 185, 129, 0.16)' },
        amber:   { accent: '#f59e0b', glow: '#451a03', soft: 'rgba(245, 158, 11, 0.16)' },
        rose:    { accent: '#f43f5e', glow: '#4c0519', soft: 'rgba(244, 63, 94, 0.16)' }
    };

    const keys = Object.keys(THEMES);

    // Aplica el tema elegido actualizando variables CSS globales y fondo radial
    function aplicarTema(nombre) {
        const t = THEMES[nombre] || THEMES.cyan;
        document.body.dataset.theme = nombre;
        document.documentElement.style.setProperty('--accent', t.accent);
        document.documentElement.style.setProperty('--accent-soft', t.soft);
        document.body.style.background =
            `radial-gradient(circle at top, ${t.glow} 0%, #0b1120 55%), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)`;
        document.body.style.backgroundSize = '100% 100%, 24px 24px';
    }

    let hash = 0;
    for (let i = 0; i < topicFolder.length; i++) hash += topicFolder.charCodeAt(i);
    const initial = keys[hash % keys.length];
    aplicarTema(initial);

    // Inyecta estilos para tablas comparativas (.compare-table) y scrollbars neón en módulos Junior
    if (!document.getElementById('jrCompareTableStyle')) {
        const st = document.createElement('style');
        st.id = 'jrCompareTableStyle'; // Asigna id único
        st.textContent = `*{scrollbar-width:thin;scrollbar-color:var(--accent,#00f0ff) #0b1120}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#0b1120}::-webkit-scrollbar-thumb{background:var(--accent,#00f0ff);border-radius:999px;border:2px solid #0b1120}.compare-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.9rem;background:rgba(2,6,23,.55);border:1px solid var(--border,#334155);border-radius:10px;overflow:hidden}.compare-table th,.compare-table td{padding:10px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08)}.compare-table th{color:var(--accent,#00f0ff);background:rgba(15,23,42,.85);font-weight:700}.compare-table tr:last-child td{border-bottom:none}.grid .card button:not(.secondary){background:linear-gradient(135deg,var(--accent,#00f0ff),#818cf8)!important;color:#050711!important;border:none!important;border-radius:10px!important;padding:8px 16px!important;font-weight:700!important;font-size:.86rem!important;box-shadow:0 4px 16px var(--accent-soft,rgba(0,240,255,.28))!important;transition:transform .18s ease,box-shadow .18s ease!important}.grid .card button:not(.secondary):hover{transform:translateY(-1px)!important;box-shadow:0 6px 22px var(--accent-soft,rgba(0,240,255,.42))!important}.grid .card button.secondary{background:rgba(255,255,255,.06)!important;color:#f1f5f9!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;padding:8px 13px!important;font-weight:600!important;font-size:.84rem!important;transition:border-color .2s,color .2s!important}.grid .card button.secondary:hover{border-color:var(--accent,#00f0ff)!important;color:var(--accent,#00f0ff)!important}`; // Asigna reglas CSS
        document.head.appendChild(st); // Inserta estilo en head
    }

    const navRight = document.querySelector('.jr-top-nav > div');
    if (navRight && !navRight.querySelector('.theme-dots')) {
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'theme-dots';
        dotsWrap.title = 'Cambiar color del módulo';
        keys.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'theme-dot' + (t === initial ? ' active' : '');
            btn.dataset.setTheme = t;
            btn.addEventListener('click', () => {
                aplicarTema(t);
                dotsWrap.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
                btn.classList.add('active');
            });
            dotsWrap.appendChild(btn);
        });
        navRight.prepend(dotsWrap);

        // Navegación directa entre módulos de JavaScript Junior Level (⬅ Anterior / Siguiente ➡)
        const JUNIOR_MODULES = ['Variables', 'Operadores', 'Concatenacion', 'Condicionales', 'Arrays', 'Bucles', 'For', 'Funciones', 'POO', 'Cadenas(Metodos)', 'Math', 'Console.log', 'Dom']; // Orden progresivo Junior
        const jIdx = JUNIOR_MODULES.indexOf(topicFolder); // Busca índice del módulo actual
        if (jIdx !== -1) { // Si coincide con un módulo de Junior Level
            const prevJ = jIdx > 0 ? { href: encodeURI(`../${JUNIOR_MODULES[jIdx - 1]}/index.html`), label: JUNIOR_MODULES[jIdx - 1] } : { href: encodeURI('../../../HTML y CSS/Responsive Design/index.html'), label: 'HTML/CSS: Responsive' };
            const nextJ = jIdx < JUNIOR_MODULES.length - 1 ? { href: encodeURI(`../${JUNIOR_MODULES[jIdx + 1]}/index.html`), label: JUNIOR_MODULES[jIdx + 1] } : { href: encodeURI('../../JAVASCRIPT MID LEVEL/Window/index.html'), label: 'JS Mid: Window' };
            // Estilo común y primario unificados con course-polish.js
            const btnStyle = 'color:#cbd5e1;text-decoration:none;font-size:0.84rem;font-weight:600;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);';
            const primaryStyle = 'color:#070a13;text-decoration:none;font-size:0.84rem;font-weight:700;padding:6px 14px;border-radius:999px;background:var(--accent,#38bdf8);';
            // Limpia los enlaces estáticos previos conservando solo dotsWrap para garantizar orden idéntico al resto del curso:
            // [theme-dots] -> [⬅ Anterior] -> [🌱 JS Junior Level] -> [📘 Apuntes] -> [🚀 Proyectos] -> [🏠 Portal Principal] -> [Siguiente ➡]
            Array.from(navRight.querySelectorAll('a')).forEach(a => a.remove());
            const makeLink = (href, text, style) => {
                const a = document.createElement('a');
                a.href = href;
                a.textContent = text;
                a.style.cssText = style;
                return a;
            };
            if (prevJ) navRight.appendChild(makeLink(prevJ.href, `⬅ ${prevJ.label}`, btnStyle));
            navRight.appendChild(makeLink('../../../index.html?filter=junior', '🌱 JS Junior Level', btnStyle));
            navRight.appendChild(makeLink('../DOCUMENTACION/index.html', '📘 Apuntes', btnStyle));
            navRight.appendChild(makeLink('../../../index.html?filter=proyectos', '🚀 Proyectos', btnStyle));
            navRight.appendChild(makeLink('../../../index.html', '🏠 Portal Principal', primaryStyle));
            if (nextJ) navRight.appendChild(makeLink(nextJ.href, `${nextJ.label} ➡`, btnStyle));
            // Agrega también barra inferior de navegación al final de .app-shell
            const appShell = document.querySelector('.app-shell'); // Contenedor principal Junior
            if (appShell) { // Si existe el contenedor
                const bottomNav = document.createElement('nav'); // Crea barra inferior
                bottomNav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:20px;padding:14px 18px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.1);border-radius:14px;'; // Estilos
                bottomNav.innerHTML = `
                    ${prevJ ? `<a href="${prevJ.href}" style="${btnStyle}">⬅ Anterior: ${prevJ.label}</a>` : '<span></span>'}
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <a href="../../../index.html?filter=junior" style="${btnStyle}">🌱 JS Junior Level</a>
                        <a href="../DOCUMENTACION/index.html" style="${btnStyle}">📘 Ver Apuntes</a>
                    </div>
                    ${nextJ ? `<a href="${nextJ.href}" style="color:#070a13;text-decoration:none;font-size:0.84rem;font-weight:700;padding:6px 14px;border-radius:999px;background:var(--accent,#38bdf8);">Siguiente: ${nextJ.label} ➡</a>` : '<span></span>'}
                `; // Contenido de la barra inferior
                appShell.appendChild(bottomNav); // Inserta al final de .app-shell
            }
        }
    }

    // Visor integrado de la guía teórica (.md) dentro de #jrDocSlides en JS Junior Level
    const docSlidesEl = document.getElementById('jrDocSlides'); // Contenedor de teoría en módulos Junior
    const nextBtnEl = document.getElementById('jrNextBtn');     // Botón "Siguiente" junto al cual insertamos "📖 Guía"
    if (docSlidesEl && nextBtnEl && !document.getElementById('jrMdToggleBtn')) {
        // Creamos el botón "📖 Guía" con estilo secundario coherente
        const mdBtn = document.createElement('button');
        mdBtn.type = 'button';
        mdBtn.id = 'jrMdToggleBtn';
        mdBtn.className = 'secondary';
        mdBtn.textContent = '📖 Guía';
        mdBtn.title = 'Leer la guía teórica completa sin salir de las diapositivas';
        mdBtn.style.cssText = 'padding:6px 12px;cursor:pointer;';
        nextBtnEl.parentElement.insertBefore(mdBtn, nextBtnEl.nextSibling);

        // Creamos el panel colapsable que mostrará la guía .md y su índice rápido
        const mdPanel = document.createElement('div');
        mdPanel.id = 'jrMdPanel';
        mdPanel.className = 'jr-md-panel';
        mdPanel.innerHTML = '<div class="jr-md-toc" id="jrMdToc"></div><div class="jr-md-body" id="jrMdBody"><p>Cargando guía teórica...</p></div>';
        docSlidesEl.appendChild(mdPanel);

        const mdToc = mdPanel.querySelector('#jrMdToc');
        const mdBody = mdPanel.querySelector('#jrMdBody');
        let mdLoaded = false; // Evita recargar docs-data.js si ya se renderizó

        // Helpers de normalización, escape HTML y conversión Markdown -> HTML
        const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\.md$/i, '').replace(/[^a-z0-9]+/g, ' ').trim();
        const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const inlineMd = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

        function renderMd(md) {
            const lines = md.replace(/\r\n/g, '\n').split('\n');
            const out = [];
            let inCode = false, codeBuf = [], inList = false, inTable = false;
            const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
            const closeTable = () => { if (inTable) { out.push('</tbody></table>'); inTable = false; } };
            for (const line of lines) {
                if (line.trim().startsWith('```')) {
                    closeList(); closeTable();
                    if (!inCode) { inCode = true; codeBuf = []; }
                    else { out.push(`<pre><code>${esc(codeBuf.join('\n'))}</code></pre>`); inCode = false; }
                    continue;
                }
                if (inCode) { codeBuf.push(line); continue; }
                const t = line.trim();
                if (!t) { closeList(); closeTable(); continue; }
                if (/^---+$/.test(t)) { closeList(); closeTable(); out.push('<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:12px 0;">'); continue; }
                if (t.startsWith('|') && t.endsWith('|')) {
                    closeList();
                    const cells = t.slice(1, -1).split('|').map(c => c.trim());
                    if (cells.every(c => /^:?-{2,}:?$/.test(c))) continue;
                    if (!inTable) { inTable = true; out.push('<table><thead><tr>' + cells.map(c => `<th>${inlineMd(c)}</th>`).join('') + '</tr></thead><tbody>'); continue; }
                    out.push('<tr>' + cells.map(c => `<td>${inlineMd(c)}</td>`).join('') + '</tr>');
                    continue;
                } else closeTable();
                const hm = t.match(/^(#{1,3})\s+(.+)$/);
                if (hm) { closeList(); out.push(`<h${hm[1].length}>${inlineMd(hm[2])}</h${hm[1].length}>`); continue; }
                if (t.startsWith('> ')) { closeList(); out.push(`<blockquote>${inlineMd(t.slice(2))}</blockquote>`); continue; }
                if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
                    if (!inList) { out.push('<ul>'); inList = true; }
                    out.push(`<li>${inlineMd(t.replace(/^([-*]|\d+\.)\s+/, ''))}</li>`);
                    continue;
                }
                closeList();
                out.push(`<p>${inlineMd(t)}</p>`);
            }
            closeList(); closeTable();
            return out.join('\n');
        }

        mdBtn.addEventListener('click', async () => {
            const willOpen = !mdPanel.classList.contains('open');
            mdPanel.classList.toggle('open', willOpen);
            mdBtn.classList.toggle('active', willOpen);
            if (!willOpen || mdLoaded) return;
            try {
                const docsMap = await new Promise((resolve, reject) => {
                    if (window.DOCS_CONTENT) return resolve(window.DOCS_CONTENT);
                    const s = document.createElement('script');
                    s.src = '../DOCUMENTACION/docs-data.js';
                    s.onload = () => resolve(window.DOCS_CONTENT || {});
                    s.onerror = () => reject(new Error('No se pudo cargar docs-data.js'));
                    document.head.appendChild(s);
                });
                const keys = Object.keys(docsMap);
                const target = norm(topicFolder);
                const key = keys.find(k => norm(k) === target) || keys.find(k => norm(k).includes(target) || target.includes(norm(k))) || keys[0];
                if (!key || !docsMap[key]) {
                    mdBody.innerHTML = '<p>No se encontró la guía de este módulo. Puedes abrir <a href="../DOCUMENTACION/index.html" style="color:#38bdf8;">Apuntes ↗</a>.</p>';
                    return;
                }
                mdBody.innerHTML = renderMd(docsMap[key]);
                mdToc.innerHTML = '';
                mdBody.querySelectorAll('h2').forEach(h2 => {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.textContent = h2.textContent.slice(0, 34);
                    b.addEventListener('click', () => h2.scrollIntoView({ behavior: 'smooth', block: 'start' }));
                    mdToc.appendChild(b);
                });
                mdLoaded = true;
            } catch (err) {
                mdBody.innerHTML = `<p>No se pudo cargar la guía (${err.message}). Abre <a href="../DOCUMENTACION/index.html" style="color:#38bdf8;">Apuntes ↗</a>.</p>`;
            }
        });
    }
})();
