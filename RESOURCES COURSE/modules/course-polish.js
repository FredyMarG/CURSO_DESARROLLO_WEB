/**
 * ============================================================================
 * TRANSFORMADOR DE INTERFAZ UNIFICADA ESTILO JUNIOR LEVEL (ARRAYS)
 * Convierte automáticamente los módulos de HTML/CSS, JS Mid y JS Master
 * al formato: .jr-top-nav -> .jr-hero -> #jrDocSlides -> .jr-main-grid -> .jr-console-panel
 * Documentación línea por línea en español.
 * ============================================================================
 */
(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    // Detecta curso y tema actual desde la URL (soporta subcarpetas y archivos .html directos)
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean);
    const fileName = parts[parts.length - 1] || 'index.html';
    const rawFolder = parts.length >= 2 ? parts[parts.length - 2] : 'Módulo';
    const fileBase = fileName.replace(/\.html?$/i, '');
    const brandTitleText = document.querySelector('.brand-title')?.textContent.trim();
    const topicFolder = /^index\.html?$/i.test(fileName) ? rawFolder : (brandTitleText || fileBase);
    const knownCourses = ['HTML y CSS', 'JAVASCRIPT MID LEVEL', 'JAVASCRIPT MASTER LEVEL', 'NODE'];
    const courseIdx = parts.findIndex(p => knownCourses.includes(p));
    const courseFolder = courseIdx !== -1 ? parts[courseIdx] : (parts.length >= 3 ? parts[parts.length - 3] : 'Curso');
    const depthInCourse = courseIdx !== -1 ? Math.max(1, parts.length - 2 - courseIdx) : 1;
    const toCourseRoot = '../'.repeat(depthInCourse);
    const portalIdx = parts.findIndex(p => p === 'HTML y CSS' || p === 'JAVASCRIPT' || p === 'NODE'); // Ubica la carpeta raíz del bloque respecto al portal
    const depthToPortal = portalIdx !== -1 ? Math.max(1, parts.length - 1 - portalIdx) : depthInCourse + 1; // Calcula niveles hasta la raíz del repositorio
    const toPortalRoot = '../'.repeat(depthToPortal);

    // Mapa que vincula cada carpeta de módulo Node.js con su guía Markdown exacta
    const nodeDocMap = {
        'Introduccion': 'INTRODUCCION.md',
        'Fundamentos': 'FUNDAMENTOS.md',
        'Instalacion': 'INSTALACION.md',
        'JavaScriptModerno': 'JAVASCRIPT MODERNO.md',
        'Asincronia': 'ARQUITECTURA INTERNA ASINCRONIA.md',
        'ArchivosNativos': 'ARCHIVOS NATIVOS.md',
        'EventosStreams': 'EVENTOS Y STREAMS.md',
        'CryptoSeguridad': 'CRYPTO Y SEGURIDAD.md',
        'REPL': 'REPL.md',
        'Modulos': 'MODULOS.md'
    };
    // Si estamos dentro de NODE/, añadimos ?doc= para abrir directamente el apunte del módulo actual
    const nodeDocQuery = (courseFolder === 'NODE' && nodeDocMap[rawFolder]) ? `?doc=${encodeURIComponent(nodeDocMap[rawFolder])}` : '';

    const courseMeta = {
        'HTML y CSS': { badge: '🎨 HTML5 & CSS3', levelLabel: '🎨 HTML y CSS', filter: 'htmlcss', docsHref: `${toCourseRoot}Documentacion/index.html`, portalHref: `${toPortalRoot}index.html` },
        'JAVASCRIPT MID LEVEL': { badge: '⚡ JS MID LEVEL', levelLabel: '⚡ JS Mid Level', filter: 'mid', docsHref: `${toCourseRoot}DOCUMENTACION/index.html`, portalHref: `${toPortalRoot}index.html` },
        'JAVASCRIPT MASTER LEVEL': { badge: '🚀 JS MASTER LEVEL', levelLabel: '🚀 JS Master Level', filter: 'master', docsHref: `${toCourseRoot}DOCUMENTACION/index.html`, portalHref: `${toPortalRoot}index.html` },
        'NODE': { badge: '🟢 NODE.JS', levelLabel: '🟢 Node.js', filter: 'node', docsHref: `${toCourseRoot}Documentacion/index.html${nodeDocQuery}`, portalHref: `${toPortalRoot}index.html` }
    };
    const meta = courseMeta[courseFolder] || { badge: '📘 CURSO WEB', levelLabel: '📘 Curso', filter: 'all', docsHref: `${toPortalRoot}index.html`, portalHref: `${toPortalRoot}index.html` };

    // Asigna un favicon único y transparente acorde al tema específico de cada módulo
    (function setTopicTabIcon() {
        const key = `${topicFolder} ${fileBase} ${document.title}`.toLowerCase();
        const TOPIC_ICONS = [
            // Node.js (8 módulos únicos)
            [/introducci[oó]n.*node|node.*introducci[oó]n/, '🟢', '#10b981'],
            [/fundamentos.*node|node.*fundamentos/, '🏛️', '#38bdf8'],
            [/instalaci[oó]n/, '🛠️', '#38bdf8'],
            [/javascript moderno|es6\+/, '⚡', '#f59e0b'],
            [/asincron/, '⏱️', '#a855f7'],
            [/archivos nativos|archivosnativos/, '📁', '#10b981'],
            [/eventos.*stream|eventosstreams/, '🌊', '#38bdf8'],
            [/crypto|criptograf/, '🔐', '#f59e0b'],
            [/\brepl\b/, '>_', '#10b981'],
            [/m[oó]dulos/, '🧩', '#10b981'],
            // JS Master Level (24 módulos únicos)
            [/estricto|strict/, '🔒', '#f43f5e'],
            [/ternario/, '❓', '#a855f7'],
            [/flecha|arrow/, '🏹', '#38bdf8'],
            [/prototipo/, '🧬', '#f59e0b'],
            [/memoiz/, '🧠', '#a855f7'],
            [/\bdate\b|fecha/, '📅', '#38bdf8'],
            [/\bscreen\b/, '📺', '#38bdf8'],
            [/navigator/, '🧭', '#10b981'],
            [/matchmedia/, '📐', '#a855f7'],
            [/visibility/, '👁️', '#38bdf8'],
            [/historial|history/, '🕰️', '#f59e0b'],
            [/geoloc/, '📍', '#f43f5e'],
            [/drag/, '🧲', '#a855f7'],
            [/file\s*reader/, '📂', '#10b981'],
            [/canvas/, '🖌️', '#f43f5e'],
            [/local\s*storage/, '💾', '#38bdf8'],
            [/cookie/, '🍪', '#f59e0b'],
            [/indexeddb/, '🗄️', '#a855f7'],
            [/intersection/, '🔭', '#38bdf8'],
            [/service\s*worker/, '🛰️', '#10b981'],
            [/web\s*worker|worker/, '👷', '#f59e0b'],
            [/notif/, '🔔', '#f59e0b'],
            [/cache/, '⚡', '#38bdf8'],
            [/\bapis?\b/, '🔌', '#10b981'],
            // JS Mid Level
            [/window/, '🪟', '#38bdf8'],
            [/barprop|location/, '🗺️', '#a855f7'],
            [/teclado|key/, '⌨️', '#38bdf8'],
            [/mouse|puntero/, '🖱️', '#a855f7'],
            [/evento/, '⚡', '#f59e0b'],
            [/temporizador|timeout|interval/, '⏳', '#a855f7'],
            [/try|catch|error|flujo/, '🛡️', '#f43f5e'],
            [/callback/, '📞', '#38bdf8'],
            [/promesa/, '🤝', '#10b981'],
            [/await|async/, '⚡', '#a855f7'],
            [/\bjson\b/, '🧾', '#f59e0b'],
            [/ajax/, '📡', '#38bdf8'],
            [/fetch/, '🚚', '#10b981'],
            [/axios/, '🚀', '#a855f7'],
            [/devtools|elements|network|application/, '🔍', '#38bdf8'],
            // HTML & CSS granulares
            [/subgrid/, '🪟', '#a855f7'],
            [/\bgap\b/, '📏', '#38bdf8'],
            [/repeat/, '🔁', '#10b981'],
            [/\barea\b/, '🗺️', '#f59e0b'],
            [/dense/, '🧱', '#f43f5e'],
            [/grid/, '🔲', '#38bdf8'],
            [/flex|grow|shrink|basis|order|align/, '↔️', '#38bdf8'],
            [/keyframe|animaci/, '🎬', '#f43f5e'],
            [/bot[oó]n|button/, '🔘', '#a855f7'],
            [/texto|initial\s*letter/, '✍️', '#f59e0b'],
            [/transici/, '✨', '#38bdf8'],
            [/scroll/, '📜', '#10b981'],
            [/variable/, '🎛️', '#38bdf8'],
            [/calc|clamp|min|max/, '🧮', '#a855f7'],
            [/viewport|unidad/, '🖥️', '#38bdf8'],
            [/color/, '🌈', '#f43f5e'],
            [/filter|backdrop/, '🔮', '#a855f7'],
            [/clip/, '✂️', '#f59e0b'],
            [/transform/, '🌀', '#38bdf8'],
            [/mobile/, '📱', '#10b981'],
            [/media\s*quer/, '📡', '#38bdf8'],
            [/container\s*quer/, '📦', '#a855f7'],
            [/feature\s*quer/, '🧪', '#f59e0b'],
            [/holy\s*grail/, '🏛️', '#38bdf8'],
            [/picture|srcset|multimedia/, '🖼️', '#10b981'],
            [/html/, '📄', '#e34f26'],
            [/css/, '🎨', '#38bdf8']
        ];
        const match = TOPIC_ICONS.find(([re]) => re.test(key));
        const symbol = match ? match[1] : (courseFolder === 'NODE' ? 'N' : courseFolder === 'HTML y CSS' ? '🎨' : 'JS'); // Símbolo único o respaldo por bloque
        const accent = match ? match[2] : (courseFolder === 'NODE' ? '#10b981' : '#00f0ff'); // Color del símbolo si es texto
        const fontSize = symbol.length > 1 ? 40 : 52; // Escala tipográfica según cantidad de caracteres
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Fira Code,Arial,sans-serif" font-weight="800" font-size="${fontSize}" fill="${accent}">${symbol}</text></svg>`;
        // Reutiliza el <link rel="icon"> existente o crea uno nuevo de forma compacta
        const link = document.querySelector('link[rel~="icon"]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' });
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    })();

    // Asigna un tema de color distinto por módulo (como en Junior Level)
    const THEMES = ['cyan', 'purple', 'emerald', 'amber', 'rose'];
    if (!document.body.dataset.theme) {
        let hash = 0;
        for (let i = 0; i < topicFolder.length; i++) hash += topicFolder.charCodeAt(i);
        document.body.dataset.theme = THEMES[hash % THEMES.length];
    }

    // Banco de retos prácticos específicos por tema
    const CHALLENGES = {
        // Reto práctico específico para el módulo Instalación y Entorno de Node.js
        'Instalacion': {
            title: 'Reto Node.js Instalación: Script de Recarga con --watch', // Título del reto
            desc: 'Escribe el bloque "scripts" de package.json incluyendo "start" y "dev" usando node --watch.', // Consigna
            placeholder: '"scripts": {\n  "start": "node index.js",\n  "dev": "node --watch index.js"\n}', // Código guía
            hint: 'Incluye "scripts", "start" y "node --watch".', // Pista
            solution: '{\n  "name": "mi-proyecto",\n  "scripts": {\n    "start": "node index.js",\n    "dev": "node --watch index.js"\n  }\n}', // Solución
            test: v => /"scripts"\s*:/.test(v) && /node\s+--watch/.test(v) // Validación
        },
        // Reto práctico específico para el módulo Módulos en Node.js
        'Modulos': {
            title: 'Reto Node.js Módulos: Exportar e Importar', // Título del reto
            desc: 'Exporta una función saludar con module.exports (CommonJS) o export (ESM) e impórtala desde otro archivo.', // Consigna
            placeholder: "// saludo.js\nmodule.exports = { saludar: nombre => `Hola ${nombre}` };\n// app.js\nconst { saludar } = require('./saludo.js');", // Código guía
            hint: "Usa module.exports + require('./...') o export + import ... from './...'.", // Pista
            solution: "module.exports = { saludar: nombre => `Hola ${nombre}` };\nconst { saludar } = require('./saludo.js');\nconsole.log(saludar('Heidy'));", // Solución
            test: v => (/(module\.exports|exports\.)/.test(v) && /require\s*\(/.test(v)) || (/export\s+/.test(v) && /import\s+/.test(v)) // Validación
        },
        // Reto práctico específico para el módulo REPL de Node.js
        'REPL': {
            title: 'Reto Node.js REPL: Función de Avance Segura', // Título del reto
            desc: 'Crea una función flecha calcularAvance(completados, total) que devuelva 0 si total === 0 y el porcentaje en caso contrario.', // Consigna
            placeholder: "const calcularAvance = (completados, total) =>\n  total === 0 ? 0 : (completados / total) * 100;", // Código guía
            hint: "Usa total === 0 ? 0 : (completados / total) * 100.", // Pista
            solution: "const calcularAvance = (completados, total) =>\n  total === 0 ? 0 : Math.round((completados / total) * 100);", // Solución
            test: v => /=>/.test(v) && /total\s*===\s*0/.test(v) && /100/.test(v) // Validación
        },
        // Reto práctico específico para el módulo Fundamentos de Node.js
        'Fundamentos': {
            title: 'Reto Node.js Fundamentos: Servidor HTTP Básico', // Título del reto
            desc: 'Importa node:http con require y crea un servidor usando http.createServer que responda con res.end().', // Consigna
            placeholder: "const http = require('node:http');\nconst server = http.createServer((req, res) => {\n  res.end('Hola Node.js');\n});", // Código guía
            hint: "Usa require('node:http'), http.createServer(...) y res.end(...).", // Pista para el estudiante
            solution: "const http = require('node:http');\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });\n  res.end(JSON.stringify({ ok: true }));\n});\nserver.listen(3000);", // Solución de referencia
            test: v => /require\(['"](node:)?http['"]\)/.test(v) && /createServer\s*\(/.test(v) && /res\.end\s*\(/.test(v) // Validación por expresión regular
        },
        'HTML BASICO': {
            title: 'Reto HTML Básico: Imagen Accesible + Enlace Seguro',
            desc: 'Escribe una etiqueta <img> con alt="..." y un enlace <a> con target="_blank".',
            placeholder: '<img src="logo.png" alt="Logo">\n<a href="https://web.dev" target="_blank">Visitar</a>',
            hint: 'Incluye <img ... alt="..."> y <a ... target="_blank">.',
            solution: '<img src="logo.png" alt="Logo">\n<a href="https://web.dev" target="_blank" rel="noopener">Visitar</a>',
            test: v => /<img[^>]*alt=/i.test(v) && /<a[^>]*target=["']_blank["']/i.test(v)
        },
        'HTML avanzado': {
            title: 'Reto HTML Avanzado: Acordeón Nativo',
            desc: 'Construye un acordeón semántico usando <details> y <summary> sin JavaScript.',
            placeholder: '<details>\n  <summary>Pregunta</summary>\n  <p>Respuesta</p>\n</details>',
            hint: 'Usa <details> con <summary> dentro.',
            solution: '<details>\n  <summary>¿Qué es ARIA?</summary>\n  <p>Atributos para accesibilidad web.</p>\n</details>',
            test: v => /<details[\s>][\s\S]*<summary[\s>]/i.test(v)
        },
        'CSS BASICO': {
            title: 'Reto CSS Básico: Box Model Moderno',
            desc: 'Estiliza .caja con box-sizing: border-box y padding.',
            placeholder: '.caja {\n  box-sizing: border-box;\n  padding: 20px;\n}',
            hint: 'Incluye box-sizing: border-box; y padding.',
            solution: '.caja {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n}',
            test: v => /box-sizing\s*:\s*border-box/i.test(v) && /padding\s*:/i.test(v)
        },
        'Tarjeta de presentacion': {
            title: 'Reto Tarjeta de Presentación: Perfil Estilizado',
            desc: 'Crea la clase .card con border-radius, padding y box-shadow para dar profundidad.',
            placeholder: '.card {\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n}',
            hint: 'Incluye border-radius, padding y box-shadow.',
            solution: '.card {\n  max-width: 340px;\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 12px 32px rgba(0,0,0,0.35);\n}',
            test: v => /border-radius\s*:/i.test(v) && /padding\s*:/i.test(v) && /box-shadow\s*:/i.test(v)
        },
        'CSS avanzado': {
            title: 'Reto CSS Avanzado: Badge Posicionado',
            desc: 'Posiciona .badge en una esquina usando position: absolute, top y right.',
            placeholder: '.badge {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}',
            hint: 'Usa position: absolute; con top y right.',
            solution: '.badge {\n  position: absolute;\n  top: 8px;\n  right: 12px;\n}',
            test: v => /position\s*:\s*absolute/i.test(v) && /top\s*:/i.test(v) && /right\s*:/i.test(v)
        },
        'Flexbox': {
            title: 'Reto Flexbox: Centrado Perfecto',
            desc: 'Centra en ambos ejes un contenedor con display: flex, justify-content y align-items.',
            placeholder: '.box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
            hint: 'Usa display: flex, justify-content: center y align-items: center.',
            solution: '.box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}',
            test: v => /display\s*:\s*flex/i.test(v) && /justify-content\s*:\s*center/i.test(v) && /align-items\s*:\s*center/i.test(v)
        },
        'Grid': {
            title: 'Reto CSS Grid: Columnas Auto-Responsivas',
            desc: 'Usa display: grid y grid-template-columns con repeat(auto-fit, minmax(...)).',
            placeholder: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n}',
            hint: 'Combina display: grid, repeat(auto-fit, minmax(...)).',
            solution: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}',
            test: v => /display\s*:\s*grid/i.test(v) && /repeat\(\s*auto-fit/i.test(v) && /minmax\(/i.test(v)
        },
        'Animaciones': {
            title: 'Reto Animaciones: Keyframes GPU 60 FPS',
            desc: 'Define @keyframes animando transform y conéctalo con animation.',
            placeholder: '@keyframes pulso {\n  50% { transform: scale(1.1); }\n}\n.btn { animation: pulso 1.5s infinite; }',
            hint: 'Usa @keyframes, transform y animation.',
            solution: '@keyframes flotar {\n  50% { transform: translateY(-10px); }\n}\n.card { animation: flotar 2s ease-in-out infinite; }',
            test: v => /@keyframes/i.test(v) && /transform\s*:/i.test(v) && /animation\s*:/i.test(v)
        },
        'Funciones Avanzadas': {
            title: 'Reto CSS Moderno: clamp() + Variable',
            desc: 'Combina clamp(min, ideal, max) con una variable CSS var(--...).',
            placeholder: 'h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  color: var(--accent);\n}',
            hint: 'Usa clamp(...) y var(--...).',
            solution: 'h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  color: var(--accent, #00f0ff);\n}',
            test: v => /clamp\(/i.test(v) && /var\(--/i.test(v)
        },
        'Responsive Design': {
            title: 'Reto Responsive: Mobile First',
            desc: 'Escribe una Media Query @media (min-width: 768px) para pantallas medianas.',
            placeholder: '@media (min-width: 768px) {\n  .grid { grid-template-columns: 1fr 1fr; }\n}',
            hint: 'Usa @media (min-width: ...).',
            solution: '@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}',
            test: v => /@media\s*\(\s*min-width\s*:/i.test(v)
        },
        'PROYECTOS': {
            title: 'Reto Proyectos: Flipper Card 3D en CSS Puro',
            desc: 'Configura la perspectiva 3D y preserva el espacio 3D para girar una tarjeta al hacer :hover.',
            placeholder: '.scene { perspective: 1000px; }\n.card { transform-style: preserve-3d; }\n.scene:hover .card { transform: rotateY(180deg); }',
            hint: 'Incluye perspective:, transform-style: preserve-3d y rotateY(180deg).',
            solution: '.scene { perspective: 1000px; }\n.card { transform-style: preserve-3d; transition: transform 0.6s; }\n.scene:hover .card { transform: rotateY(180deg); }',
            test: v => /perspective\s*:/i.test(v) && /preserve-3d/i.test(v) && /rotateY\(/i.test(v)
        },
        'Cookies': {
            title: 'Reto Cookies: Escritura Segura',
            desc: 'Guarda una cookie usando document.cookie, encodeURIComponent() y max-age.',
            placeholder: 'document.cookie = `tema=${encodeURIComponent("oscuro")}; max-age=3600; path=/`;',
            hint: 'Incluye document.cookie = ..., encodeURIComponent( y max-age.',
            solution: 'document.cookie = `usuario=${encodeURIComponent("Ana; Pro")}; max-age=3600; path=/; SameSite=Lax`;',
            test: v => /document\.cookie\s*=/.test(v) && /encodeURIComponent\s*\(/.test(v) && /max-age/i.test(v)
        },
        'Canvas': { // Reto práctico de HTML5 Canvas 2D
            title: 'Reto Canvas 2D: Contexto + Rectángulo Neón',
            desc: 'Obtén el contexto "2d" del canvas, asigna fillStyle y dibuja un rectángulo con fillRect().',
            placeholder: 'const ctx = canvas.getContext("2d");\nctx.fillStyle = "#00f0ff";\nctx.fillRect(20, 20, 120, 80);',
            hint: 'Incluye getContext("2d"), fillStyle y fillRect(...).',
            solution: 'const ctx = canvas.getContext("2d");\nctx.fillStyle = "#00f0ff";\nctx.fillRect(20, 20, 140, 80);',
            test: v => /getContext\s*\(\s*["']2d["']\s*\)/.test(v) && /fillStyle\s*=/.test(v) && /fillRect\s*\(/.test(v)
        },
        'Objeto Screen': {
            title: 'Reto Screen: Medir Barra del Sistema',
            desc: 'Calcula el alto ocupado por la barra del sistema restando screen.availHeight a screen.height.',
            placeholder: 'const barra = screen.height - screen.availHeight;',
            hint: 'Usa screen.height y screen.availHeight.',
            solution: 'const altoBarra = screen.height - screen.availHeight;\nconsole.log(altoBarra);',
            test: v => /screen\.height/.test(v) && /screen\.availHeight/.test(v)
        },
        'Fetch': {
            title: 'Reto Fetch: Petición Validada',
            desc: 'Usa await fetch(...), verifica res.ok y parsea con res.json().',
            placeholder: 'const res = await fetch("/api");\nif (!res.ok) throw new Error(res.status);\nconst data = await res.json();',
            hint: 'Incluye fetch(, .ok y .json().',
            solution: 'async function cargar() {\n  const res = await fetch("/api");\n  if (!res.ok) throw new Error("Error");\n  return await res.json();\n}',
            test: v => /fetch\s*\(/i.test(v) && /\.ok\b/.test(v) && /\.json\s*\(\)/.test(v)
        },
        'Cache': {
            title: 'Reto Cache API: Precarga de Recursos',
            desc: 'Abre un almacén con caches.open() y guarda archivos con cache.add() o cache.put().',
            placeholder: 'const cache = await caches.open("v1");\nawait cache.add("/index.html");',
            hint: 'Usa caches.open( y .add( / .put(.',
            solution: 'const cache = await caches.open("app-v1");\nawait cache.addAll(["/", "/index.html"]);',
            test: v => /caches\.open\s*\(/.test(v) && /\.(add|addAll|put)\s*\(/.test(v)
        }
    };

    const slides = Array.from(document.querySelectorAll('.presentation-wrapper .slide'));
    if (slides.length === 0) return;

    // Extrae datos de la portada (Slide 1)
    const heroSlide = slides[0];
    const heroTitle = heroSlide.querySelector('h1')?.textContent.trim() || topicFolder;
    const heroDesc = heroSlide.querySelector('.hero-subtitle, .lead-text, p')?.textContent.trim() || '';
    const heroBadgeText = document.querySelector('.brand-badge')?.textContent.trim() || meta.badge;

    // Separa diapositivas de teoría vs Lab y Quiz
    const labSlides = [];
    const quizSlides = [];
    const theorySlides = [];

    slides.slice(1).forEach(s => {
        const isLab = s.dataset.lab === 'true' || Boolean(s.querySelector('#labEditor, .lab-panel, #ckConsole, #screenConsole'));
        const isQuiz = Boolean(s.querySelector('.quiz-container, .quiz-box'));
        if (isLab) labSlides.push(s);
        else if (isQuiz) quizSlides.push(s); // Evalúa condición alternativa
        else theorySlides.push(s); // Rama alternativa
    });

    // Construye el contenedor principal .jr-app-shell
    const shell = document.createElement('div');
    shell.className = 'jr-app-shell';

    // 1. Barra superior
    const topNav = document.createElement('nav');
    topNav.className = 'jr-top-nav';
    topNav.innerHTML = `
        <span class="jr-nav-badge">${meta.badge} · ${topicFolder}</span>
        <div class="jr-nav-right">
            <div class="theme-dots" title="Cambiar color del módulo"></div>
            <a class="jr-nav-link" href="${meta.portalHref}?filter=${meta.filter}" title="Volver a ${meta.levelLabel}">${meta.levelLabel}</a>
            <a class="jr-nav-link" href="${meta.docsHref}">📘 Apuntes</a>
            <a class="jr-nav-link" href="${meta.portalHref}?filter=proyectos">🚀 Proyectos</a>
            <a class="jr-nav-link primary" href="${meta.portalHref}">🏠 Portal Principal</a>
        </div>
    `;
    const dotsWrap = topNav.querySelector('.theme-dots');
    THEMES.forEach(t => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'theme-dot' + (document.body.dataset.theme === t ? ' active' : '');
        b.dataset.setTheme = t;
        b.addEventListener('click', () => {
            document.body.dataset.theme = t;
            dotsWrap.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
            b.classList.add('active');
            logConsole(`🎨 Tema cambiado a "${t}"`, 'ok');
        });
        dotsWrap.appendChild(b);
    });
    shell.appendChild(topNav);

    // 2. Cabecera .jr-hero
    const hero = document.createElement('header');
    hero.className = 'jr-hero';
    hero.innerHTML = `
        <span class="jr-hero-badge">${heroBadgeText}</span>
        <h1>${heroTitle}</h1>
        <p>${heroDesc}</p>
    `;
    shell.appendChild(hero);

    // 3. Carrusel de teoría (#jrDocSlides)
    if (theorySlides.length > 0) {
        const docBox = document.createElement('section');
        docBox.className = 'jr-doc-slides';
        docBox.innerHTML = `
            <div class="jr-slides-bar">
                <div>
                    <div class="jr-slides-kicker">📘 TEORÍA INTERACTIVA — ${topicFolder.toUpperCase()}</div>
                    <div class="jr-slides-ind" id="jrSlideInd">Diapositiva 1 / ${theorySlides.length}</div>
                </div>
                <div class="jr-slides-btns">
                    <button type="button" class="jr-slide-btn" id="jrPrevBtn">⬅ Anterior</button>
                    <button type="button" class="jr-slide-btn" id="jrNextBtn">Siguiente ➡</button>
                    <a class="jr-slides-apuntes" href="${meta.docsHref}">Ver Apuntes ↗</a>
                </div>
            </div>
            <div id="jrSlidesBody"></div>
        `;

        const slidesBody = docBox.querySelector('#jrSlidesBody');
        theorySlides.forEach((s, idx) => {
            const pane = document.createElement('div');
            pane.className = 'jr-doc-slide' + (idx === 0 ? ' active' : '');
            const content = s.querySelector('.slide-content') || s;
            while (content.firstChild) pane.appendChild(content.firstChild);
            slidesBody.appendChild(pane);
        });

        const panes = Array.from(slidesBody.querySelectorAll('.jr-doc-slide'));
        const ind = docBox.querySelector('#jrSlideInd');
        const prevBtn = docBox.querySelector('#jrPrevBtn');
        const nextBtn = docBox.querySelector('#jrNextBtn');
        let cur = 0;

        function showSlide(idx) {
            cur = Math.max(0, Math.min(panes.length - 1, idx));
            panes.forEach((p, i) => p.classList.toggle('active', i === cur));
            ind.textContent = `Diapositiva ${cur + 1} / ${panes.length}`; // Actualiza contenido en el DOM
            prevBtn.disabled = cur === 0;
            nextBtn.disabled = cur === panes.length - 1;
        }
        prevBtn.addEventListener('click', () => { showSlide(cur - 1); logConsole(`⬅ Diapositiva ${cur + 1}/${panes.length}`); });
        nextBtn.addEventListener('click', () => { showSlide(cur + 1); logConsole(`➡ Diapositiva ${cur + 1}/${panes.length}`); });
        showSlide(0);
        shell.appendChild(docBox);
    }

    // 4. Rejilla principal (.jr-main-grid): Lab + Reto Práctico + Quiz
    const mainGrid = document.createElement('main');
    mainGrid.className = 'jr-main-grid';

    labSlides.forEach(s => {
        const card = document.createElement('section');
        card.className = 'jr-card full-span';
        const content = s.querySelector('.slide-content') || s;
        while (content.firstChild) card.appendChild(content.firstChild);
        mainGrid.appendChild(card);
    });

    // Reto Práctico inventado por módulo
    const ch = CHALLENGES[topicFolder] || {
        title: `Reto Práctico: ${topicFolder}`,
        desc: `Escribe un fragmento de código aplicando lo visto en "${topicFolder}" (mínimo 15 caracteres) y verifícalo.`,
        placeholder: `// Escribe aquí tu práctica de ${topicFolder}\n`,
        hint: `Usa la sintaxis principal mostrada en las diapositivas de ${topicFolder}.`,
        solution: `// Solución ejemplo de ${topicFolder}\nconsole.log("Práctica completada: ${topicFolder}");`,
        test: v => v.trim().length >= 15
    };

    const challengeCard = document.createElement('section');
    challengeCard.className = 'challenge-panel';
    challengeCard.innerHTML = `
        <span class="challenge-badge">🏆 RETO PRÁCTICO DEL MÓDULO</span>
        <h2 class="challenge-title">${ch.title}</h2>
        <p class="challenge-desc">${ch.desc}</p>
        <textarea class="challenge-editor" spellcheck="false" placeholder="${ch.placeholder.replace(/"/g, '&quot;')}"></textarea>
        <div class="challenge-actions">
            <button type="button" class="challenge-btn primary" data-act="check">✅ Verificar Solución</button>
            <button type="button" class="challenge-btn" data-act="hint">💡 Pista</button>
            <button type="button" class="challenge-btn" data-act="solve">✨ Ver Solución</button>
        </div>
        <div class="challenge-feedback" aria-live="polite"></div>
    `;
    const chEditor = challengeCard.querySelector('.challenge-editor');
    const chFeedback = challengeCard.querySelector('.challenge-feedback');
    challengeCard.querySelector('[data-act="check"]').addEventListener('click', () => {
        if (ch.test(chEditor.value || '')) {
            chFeedback.textContent = '✅ ¡Correcto! Dominaste el reto práctico del módulo.'; // Actualiza contenido en el DOM
            chFeedback.className = 'challenge-feedback show ok';
            logConsole(`✅ Reto "${topicFolder}" superado`, 'ok');
        } else {
            chFeedback.textContent = '❌ Aún falta algún detalle clave. Revisa la pista e inténtalo de nuevo.'; // Actualiza contenido en el DOM
            chFeedback.className = 'challenge-feedback show err';
            logConsole(`❌ Reto "${topicFolder}" incompleto`, 'err');
        }
    });
    challengeCard.querySelector('[data-act="hint"]').addEventListener('click', () => {
        chFeedback.textContent = `💡 Pista: ${ch.hint}`; // Actualiza contenido en el DOM
        chFeedback.className = 'challenge-feedback show ok';
    });
    challengeCard.querySelector('[data-act="solve"]').addEventListener('click', () => {
        chEditor.value = ch.solution;
        chFeedback.textContent = '✨ Solución cargada. Pulsa "Verificar Solución" o personalízala.'; // Actualiza contenido en el DOM
        chFeedback.className = 'challenge-feedback show ok';
        logConsole(`✨ Solución ejemplo cargada para "${topicFolder}"`);
    });
    mainGrid.appendChild(challengeCard);

    quizSlides.forEach(s => {
        const card = document.createElement('section');
        card.className = 'jr-card';
        const content = s.querySelector('.slide-content') || s;
        while (content.firstChild) card.appendChild(content.firstChild);
        mainGrid.appendChild(card);
    });

    shell.appendChild(mainGrid);

    // 5. Consola en Vivo (.jr-console-panel)
    const consolePanel = document.createElement('section');
    consolePanel.className = 'jr-console-panel';
    consolePanel.innerHTML = `
        <div class="jr-console-header">
            <h2>Registro de Consola en Vivo (también en DevTools)</h2>
            <button type="button" class="jr-slide-btn" id="jrClearLog">Limpiar</button>
        </div>
        <div class="jr-console-log" id="jrConsoleLog"></div>
    `;
    shell.appendChild(consolePanel);

    const logBox = consolePanel.querySelector('#jrConsoleLog');
    function logConsole(msg, type = '') {
        if (!logBox) return;
        const line = document.createElement('div');
        line.className = `jr-log-line ${type}`.trim();
        const hora = new Date().toLocaleTimeString();
        line.textContent = `[${hora}] ${msg}`; // Actualiza contenido en el DOM
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
    }
    consolePanel.querySelector('#jrClearLog').addEventListener('click', () => {
        logBox.innerHTML = ''; // Actualiza contenido en el DOM
    });

    // 6. Navegación directa entre módulos del mismo nivel (⬅ Anterior / Siguiente ➡)
    const COURSE_MODULES = { // Mapa ordenado de carpetas de módulos por nivel
        'HTML y CSS': ['HTML BASICO', 'HTML avanzado', 'CSS BASICO', 'CSS avanzado', 'Flexbox', 'Grid', 'Animaciones', 'Funciones Avanzadas', 'Responsive Design'],
        'JAVASCRIPT MID LEVEL': ['Window', 'Objetos Barprop', 'Location', 'Screen y Scroll', 'Resize y Move', 'Eventos', 'Switch', 'Try-Catch', 'Temporizadores', 'Callbacks', 'Promesas', 'Async y Await', 'Datos Estructurados (JSON)', 'Peticiones HTTP', 'Ajax', 'Fetch', 'Libreria Axios', 'Codigo Obsoleto', 'Pestañas DevTools'],
        'JAVASCRIPT MASTER LEVEL': ['Modo Estricto', 'Operador Ternario', 'Funciones Flecha', 'Prototipos', 'Memoization', 'Objeto Date', 'Objeto Screen', 'Navigator', 'Matchmedia', 'Visibility Change', 'Historial', 'Geolocalization', 'Drag & Drop', 'File Reader', 'Canvas', 'Local Storage', 'Cookies', 'IndexedDB', 'Intersection Observer', 'Apis', 'Cache', 'Notifications', 'Web Workers', 'Service Workers'],
        'NODE': ['Introduccion', 'Fundamentos', 'Instalacion', 'REPL', 'JavaScriptModerno', 'Asincronia', 'ArchivosNativos', 'EventosStreams', 'CryptoSeguridad', 'Modulos']
    };
    const SUBMODULE_GROUPS = { // Listas de submódulos con navegación Anterior/Siguiente propia
        'Eventos': ['Handlers', 'Event Flow', 'Eventos de Mouse', 'Eventos de Teclado', 'Eventos de Interfaz'],
        'Ajax': ['Ajax Editor', 'Ajax Htdocs'],
        'Libreria Axios': ['Axios Editor', 'Axios-Fetch-Htdocs']
    };
    const subGroupKey = Object.keys(SUBMODULE_GROUPS).find(k => parts.includes(k) && SUBMODULE_GROUPS[k].includes(topicFolder));
    const levelList = subGroupKey ? SUBMODULE_GROUPS[subGroupKey] : (COURSE_MODULES[courseFolder] || []); // Obtiene la lista ordenada del nivel o submódulo actual
    const modIdx = levelList.indexOf(topicFolder); // Ubica el índice del módulo actual
    if (/^index\.html?$/i.test(fileName) && modIdx !== -1) { // Solo si estamos en el index.html principal del módulo
        const prevMod = modIdx > 0 ? levelList[modIdx - 1] : null; // Módulo anterior si existe
        const nextMod = modIdx < levelList.length - 1 ? levelList[modIdx + 1] : null; // Módulo siguiente si existe
        const navRightEl = topNav.querySelector('.jr-nav-right'); // Contenedor derecho de la barra superior
        // Agregamos accesos rápidos en la barra superior en orden unificado:
        // [theme-dots] -> [⬅ Anterior] -> [↩ Padre] -> [Nivel] -> [📘 Apuntes] -> [🚀 Proyectos] -> [🏠 Portal] -> [Siguiente ➡]
        if (subGroupKey && navRightEl) {
            const aParent = document.createElement('a');
            aParent.className = 'jr-nav-link';
            aParent.href = '../index.html';
            aParent.textContent = `↩ ${subGroupKey}`;
            navRightEl.insertBefore(aParent, navRightEl.querySelector('.jr-nav-link'));
        }
        if (prevMod && navRightEl) { // Si existe módulo anterior
            const aPrev = document.createElement('a'); // Crea enlace al módulo anterior
            aPrev.className = 'jr-nav-link'; // Estilo de botón de navegación
            aPrev.href = encodeURI(`../${prevMod}/index.html`); // Ruta relativa al módulo anterior
            aPrev.textContent = `⬅ ${prevMod}`; // Texto visible
            navRightEl.insertBefore(aPrev, navRightEl.querySelector('.jr-nav-link')); // Siempre primero después de theme-dots
        }
        if (nextMod && navRightEl) { // Si existe módulo siguiente
            const aNext = document.createElement('a'); // Crea enlace al módulo siguiente
            aNext.className = 'jr-nav-link'; // Estilo de botón de navegación
            aNext.href = encodeURI(`../${nextMod}/index.html`); // Ruta relativa al módulo siguiente
            aNext.textContent = `${nextMod} ➡`; // Texto visible
            navRightEl.appendChild(aNext); // Siempre al final de la barra superior
        }
        // Creamos también una barra inferior cómoda al terminar la lección
        const bottomModNav = document.createElement('nav'); // Crea barra inferior de módulos
        bottomModNav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:20px;padding:14px 18px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.1);border-radius:14px;'; // Estilos en línea
        bottomModNav.innerHTML = `
            ${prevMod ? `<a class="jr-nav-link" href="${encodeURI(`../${prevMod}/index.html`)}">⬅ Anterior: ${prevMod}</a>` : '<span></span>'}
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${subGroupKey ? `<a class="jr-nav-link" href="../index.html">↩ ${subGroupKey}</a>` : ''}
                <a class="jr-nav-link" href="${meta.portalHref}?filter=${meta.filter}">${meta.levelLabel}</a>
                <a class="jr-nav-link" href="${meta.docsHref}">📘 Ver Apuntes</a>
            </div>
            ${nextMod ? `<a class="jr-nav-link primary" href="${encodeURI(`../${nextMod}/index.html`)}">Siguiente: ${nextMod} ➡</a>` : '<span></span>'}
        `; // Inserta enlaces inferior anterior, nivel, apuntes y siguiente
        shell.appendChild(bottomModNav); // Añade la barra al final del contenedor principal
    }

    document.body.classList.add('jr-unified');
    document.body.prepend(shell);
    logConsole(`🚀 Módulo "${topicFolder}" cargado con estructura unificada Junior Level.`, 'ok');
})();
