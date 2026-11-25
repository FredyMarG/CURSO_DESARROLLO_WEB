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
    const parts = decodeURIComponent(window.location.pathname).split('/').filter(Boolean); // Declara e inicializa variable local
    const fileName = parts[parts.length - 1] || 'index.html'; // Declara e inicializa variable local
    const rawFolder = parts.length >= 2 ? parts[parts.length - 2] : 'Módulo'; // Declara e inicializa variable local
    const fileBase = fileName.replace(/\.html?$/i, ''); // Declara e inicializa variable local
    const brandTitleText = document.querySelector('.brand-title')?.textContent.trim(); // Declara e inicializa variable local
    const topicFolder = /^index\.html?$/i.test(fileName) ? rawFolder : (brandTitleText || fileBase); // Declara e inicializa variable local
    const knownCourses = ['HTML y CSS', 'JAVASCRIPT MID LEVEL', 'JAVASCRIPT MASTER LEVEL', 'NODE']; // Declara e inicializa variable local
    const courseIdx = parts.findIndex(p => knownCourses.includes(p)); // Declara e inicializa variable local
    const courseFolder = courseIdx !== -1 ? parts[courseIdx] : (parts.length >= 3 ? parts[parts.length - 3] : 'Curso'); // Declara e inicializa variable local
    const depthInCourse = courseIdx !== -1 ? Math.max(1, parts.length - 2 - courseIdx) : 1; // Declara e inicializa variable local
    const toCourseRoot = '../'.repeat(depthInCourse); // Declara e inicializa variable local
    const portalIdx = parts.findIndex(p => p === 'HTML y CSS' || p === 'JAVASCRIPT' || p === 'NODE'); // Ubica la carpeta raíz del bloque respecto al portal
    const depthToPortal = portalIdx !== -1 ? Math.max(1, parts.length - 1 - portalIdx) : depthInCourse + 1; // Calcula niveles hasta la raíz del repositorio
    const toPortalRoot = '../'.repeat(depthToPortal); // Declara e inicializa variable local

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
        'Modulos': 'MODULOS.md',
        'NPM': 'NPM.md',
        'JSON': 'JSON.md',
        'Process': 'PROCESS.md',
        'Testing': 'TESTING.md',
        'HttpApi': 'HTTP Y APIS.md'
    };
    // Si estamos dentro de NODE/, añadimos ?doc= para abrir directamente el apunte del módulo actual
    const nodeDocQuery = (courseFolder === 'NODE' && nodeDocMap[rawFolder]) ? `?doc=${encodeURIComponent(nodeDocMap[rawFolder])}` : ''; // Declara e inicializa variable local

    const courseMeta = {
        'HTML y CSS': { badge: '🎨 HTML5 & CSS3', levelLabel: '🎨 HTML y CSS', filter: 'htmlcss', docsHref: `${toCourseRoot}Documentacion/index.html`, portalHref: `${toPortalRoot}index.html` },
        'JAVASCRIPT MID LEVEL': { badge: '⚡ JS MID LEVEL', levelLabel: '⚡ JS Mid Level', filter: 'mid', docsHref: `${toCourseRoot}DOCUMENTACION/index.html`, portalHref: `${toPortalRoot}index.html` },
        'JAVASCRIPT MASTER LEVEL': { badge: '🚀 JS MASTER LEVEL', levelLabel: '🚀 JS Master Level', filter: 'master', docsHref: `${toCourseRoot}DOCUMENTACION/index.html`, portalHref: `${toPortalRoot}index.html` },
        'NODE': { badge: '🟢 NODE.JS', levelLabel: '🟢 Node.js', filter: 'node', docsHref: `${toCourseRoot}Documentacion/index.html${nodeDocQuery}`, portalHref: `${toPortalRoot}index.html` }
    };
    const meta = courseMeta[courseFolder] || { badge: '📘 CURSO WEB', levelLabel: '📘 Curso', filter: 'all', docsHref: `${toPortalRoot}index.html`, portalHref: `${toPortalRoot}index.html` }; // Declara e inicializa variable local

    // Asigna un favicon único y transparente acorde al tema específico de cada módulo
    (function setTopicTabIcon() {
        const key = `${topicFolder} ${fileBase} ${document.title}`.toLowerCase(); // Declara e inicializa variable local
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
            [/\bnpm\b|paquete/, '📦', '#ef4444'],
            [/\bjson\b/, '{}', '#f59e0b'],
            [/\bprocess\b|proceso/, '⚙️', '#38bdf8'],
            [/\btesting\b|node:test/, '🧪', '#10b981'],
            [/\bhttpapi\b|apis rest|servidores http/, '🌐', '#38bdf8'],
            [/formulario/, '📝', '#10b981'],
            [/expresiones regulares|regexp/, '🔎', '#a855f7'],
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
        const match = TOPIC_ICONS.find(([re]) => re.test(key)); // Declara e inicializa variable local
        const symbol = match ? match[1] : (courseFolder === 'NODE' ? 'N' : courseFolder === 'HTML y CSS' ? '🎨' : 'JS'); // Símbolo único o respaldo por bloque
        const accent = match ? match[2] : (courseFolder === 'NODE' ? '#10b981' : '#00f0ff'); // Color del símbolo si es texto
        const fontSize = symbol.length > 1 ? 40 : 52; // Escala tipográfica según cantidad de caracteres
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Fira Code,Arial,sans-serif" font-weight="800" font-size="${fontSize}" fill="${accent}">${symbol}</text></svg>`;
        // Reutiliza el <link rel="icon"> existente o crea uno nuevo de forma compacta
        const link = document.querySelector('link[rel~="icon"]') || Object.assign(document.head.appendChild(document.createElement('link')), { rel: 'icon' }); // Declara e inicializa variable local
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    })();

    // Asigna un tema de color distinto por módulo (como en Junior Level)
    const THEMES = ['cyan', 'purple', 'emerald', 'amber', 'rose']; // Declara e inicializa variable local
    if (!document.body.dataset.theme) { // Evalúa condición lógica
        let hash = 0; // Declara e inicializa variable local
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

    const slides = Array.from(document.querySelectorAll('.presentation-wrapper .slide')); // Declara e inicializa variable local
    if (slides.length === 0) return; // Evalúa condición lógica

    // Extrae datos de la portada (Slide 1)
    const heroSlide = slides[0]; // Declara e inicializa variable local
    const heroTitle = heroSlide.querySelector('h1')?.textContent.trim() || topicFolder; // Declara e inicializa variable local
    const heroDesc = heroSlide.querySelector('.hero-subtitle, .lead-text, p')?.textContent.trim() || ''; // Declara e inicializa variable local
    const heroBadgeText = document.querySelector('.brand-badge')?.textContent.trim() || meta.badge; // Declara e inicializa variable local

    // Separa diapositivas de teoría vs Lab y Quiz
    const labSlides = []; // Declara e inicializa variable local
    const quizSlides = []; // Declara e inicializa variable local
    const theorySlides = []; // Declara e inicializa variable local

    slides.slice(1).forEach(s => {
        const isLab = s.dataset.lab === 'true' || Boolean(s.querySelector('#labEditor, .lab-panel, #ckConsole, #screenConsole')); // Declara e inicializa variable local
        const isQuiz = Boolean(s.querySelector('.quiz-container, .quiz-box')); // Declara e inicializa variable local
        if (isLab) labSlides.push(s); // Evalúa condición lógica
        else if (isQuiz) quizSlides.push(s); // Evalúa condición alternativa
        else theorySlides.push(s); // Rama alternativa
    });

    // Construye el contenedor principal .jr-app-shell
    const shell = document.createElement('div'); // Declara e inicializa variable local
    shell.className = 'jr-app-shell';

    // 1. Barra superior
    const topNav = document.createElement('nav'); // Declara e inicializa variable local
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
    const dotsWrap = topNav.querySelector('.theme-dots'); // Declara e inicializa variable local
    THEMES.forEach(t => {
        const b = document.createElement('button'); // Declara e inicializa variable local
        b.type = 'button';
        b.className = 'theme-dot' + (document.body.dataset.theme === t ? ' active' : '');
        b.dataset.setTheme = t;
        b.addEventListener('click', () => { // Registra escuchador de evento en el DOM
            document.body.dataset.theme = t;
            dotsWrap.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
            b.classList.add('active');
            logConsole(`🎨 Tema cambiado a "${t}"`, 'ok');
        });
        dotsWrap.appendChild(b);
    });
    shell.appendChild(topNav);

    // 2. Cabecera .jr-hero (usa textContent para no interpretar etiquetas literales como <iframe> o <form>)
    const hero = document.createElement('header'); // Declara e inicializa variable local
    hero.className = 'jr-hero';
    const badgeEl = document.createElement('span'); // Declara e inicializa variable local
    badgeEl.className = 'jr-hero-badge';
    badgeEl.textContent = heroBadgeText; // Actualiza texto plano en el DOM
    const h1El = document.createElement('h1'); // Declara e inicializa variable local
    h1El.textContent = heroTitle; // Actualiza texto plano en el DOM
    const pEl = document.createElement('p'); // Declara e inicializa variable local
    pEl.textContent = heroDesc; // Actualiza texto plano en el DOM
    hero.append(badgeEl, h1El, pEl);
    shell.appendChild(hero);

    // 3. Carrusel de teoría (#jrDocSlides)
    if (theorySlides.length > 0) { // Evalúa condición lógica
        const docBox = document.createElement('section'); // Declara e inicializa variable local
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
                    <button type="button" class="jr-slide-btn" id="jrMdToggleBtn" title="Leer la guía teórica completa sin salir de las diapositivas">📖 Guía</button>
                    <a class="jr-slides-apuntes" href="${meta.docsHref}">Apuntes ↗</a>
                </div>
            </div>
            <div id="jrSlidesBody"></div>
            <div class="jr-md-panel" id="jrMdPanel" aria-live="polite">
                <div class="jr-md-toc" id="jrMdToc"></div>
                <div class="jr-md-body" id="jrMdBody"><p>Cargando guía teórica...</p></div>
            </div>
        `;

        const slidesBody = docBox.querySelector('#jrSlidesBody'); // Declara e inicializa variable local
        theorySlides.forEach((s, idx) => {
            const pane = document.createElement('div'); // Declara e inicializa variable local
            pane.className = 'jr-doc-slide' + (idx === 0 ? ' active' : '');
            const content = s.querySelector('.slide-content') || s; // Declara e inicializa variable local
            while (content.firstChild) pane.appendChild(content.firstChild);
            slidesBody.appendChild(pane);
        });

        const panes = Array.from(slidesBody.querySelectorAll('.jr-doc-slide')); // Declara e inicializa variable local
        const ind = docBox.querySelector('#jrSlideInd'); // Declara e inicializa variable local
        const prevBtn = docBox.querySelector('#jrPrevBtn'); // Declara e inicializa variable local
        const nextBtn = docBox.querySelector('#jrNextBtn'); // Declara e inicializa variable local
        let cur = 0; // Declara e inicializa variable local

        function showSlide(idx) { // Define función reutilizable
            cur = Math.max(0, Math.min(panes.length - 1, idx));
            panes.forEach((p, i) => p.classList.toggle('active', i === cur));
            ind.textContent = `Diapositiva ${cur + 1} / ${panes.length}`; // Actualiza contenido en el DOM
            prevBtn.disabled = cur === 0;
            nextBtn.disabled = cur === panes.length - 1;
        }
        prevBtn.addEventListener('click', () => { showSlide(cur - 1); logConsole(`⬅ Diapositiva ${cur + 1}/${panes.length}`); });
        nextBtn.addEventListener('click', () => { showSlide(cur + 1); logConsole(`➡ Diapositiva ${cur + 1}/${panes.length}`); });
        showSlide(0);

        // Visor integrado de la guía Markdown (.md) del módulo dentro de las diapositivas
        const mdToggleBtn = docBox.querySelector('#jrMdToggleBtn'); // Botón "📖 Guía"
        const mdPanel = docBox.querySelector('#jrMdPanel');         // Panel colapsable del lector
        const mdToc = docBox.querySelector('#jrMdToc');             // Barra superior de saltos a secciones ##
        const mdBody = docBox.querySelector('#jrMdBody');           // Contenedor HTML renderizado del .md
        let mdLoaded = false;                                       // Evita recargar docs-data.js si ya se abrió antes

        // Normaliza textos (sin tildes, minúsculas, sin extensión .md) para emparejar carpeta -> archivo .md
        const normText = (s) => String(s || '')
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\.md$/i, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

        // Escapa caracteres HTML peligrosos antes de convertir sintaxis Markdown
        const escHtml = (s) => String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Convierte formato Markdown en línea (`código`, **negrita**, *cursiva*)
        const inlineMd = (s) => escHtml(s)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Convierte texto Markdown completo (encabezados, tablas, bloques de código, listas y citas) a HTML seguro
        function renderMarkdownSimple(md) {
            const lines = md.replace(/\r\n/g, '\n').split('\n');
            const out = [];
            let inCode = false;
            let codeBuf = [];
            let inList = false;
            let inTable = false;
            let tableHeaderDone = false;

            const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
            const closeTable = () => { if (inTable) { out.push('</tbody></table>'); inTable = false; tableHeaderDone = false; } };

            for (const line of lines) {
                if (line.trim().startsWith('```')) {
                    closeList(); closeTable();
                    if (!inCode) { inCode = true; codeBuf = []; }
                    else { out.push(`<pre><code>${escHtml(codeBuf.join('\n'))}</code></pre>`); inCode = false; }
                    continue;
                }
                if (inCode) { codeBuf.push(line); continue; }

                const t = line.trim(); // Declara e inicializa variable local
                if (!t) { closeList(); closeTable(); continue; }
                if (/^---+$/.test(t)) { closeList(); closeTable(); out.push('<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:12px 0;">'); continue; }

                if (t.startsWith('|') && t.endsWith('|')) { // Evalúa condición lógica
                    closeList();
                    const cells = t.slice(1, -1).split('|').map(c => c.trim()); // Declara e inicializa variable local
                    if (cells.every(c => /^:?-{2,}:?$/.test(c))) { tableHeaderDone = true; continue; }
                    if (!inTable) { // Evalúa condición lógica
                        inTable = true;
                        out.push('<table><thead><tr>' + cells.map(c => `<th>${inlineMd(c)}</th>`).join('') + '</tr></thead><tbody>');
                        continue;
                    }
                    out.push('<tr>' + cells.map(c => `<td>${inlineMd(c)}</td>`).join('') + '</tr>');
                    continue;
                } else {
                    closeTable();
                }

                const hMatch = t.match(/^(#{1,3})\s+(.+)$/); // Declara e inicializa variable local
                if (hMatch) { // Evalúa condición lógica
                    closeList();
                    const lvl = hMatch[1].length; // Declara e inicializa variable local
                    const idAttr = lvl === 2 ? ` data-md-sec="${out.length}"` : ''; // Declara e inicializa variable local
                    out.push(`<h${lvl}${idAttr}>${inlineMd(hMatch[2])}</h${lvl}>`);
                    continue;
                }
                if (t.startsWith('> ')) { closeList(); out.push(`<blockquote>${inlineMd(t.slice(2))}</blockquote>`); continue; }
                if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) { // Evalúa condición lógica
                    if (!inList) { out.push('<ul>'); inList = true; }
                    out.push(`<li>${inlineMd(t.replace(/^([-*]|\d+\.)\s+/, ''))}</li>`);
                    continue;
                }
                closeList();
                out.push(`<p>${inlineMd(t)}</p>`);
            }
            closeList(); closeTable();
            return out.join('\n'); // Retorna el resultado de la función
        }

        function resolveDocKey(docsMap) { // Define función reutilizable
            const keys = Object.keys(docsMap || {}); // Declara e inicializa variable local
            if (keys.length === 0) return null; // Evalúa condición lógica
            if (courseFolder === 'NODE' && nodeDocMap[rawFolder] && docsMap[nodeDocMap[rawFolder]]) { // Evalúa condición lógica
                return nodeDocMap[rawFolder]; // Retorna el resultado de la función
            }
            const targets = [normText(topicFolder), normText(rawFolder), normText(fileBase)].filter(Boolean); // Declara e inicializa variable local
            for (const target of targets) { // Itera sobre elementos o rango
                const exact = keys.find(k => normText(k) === target); // Declara e inicializa variable local
                if (exact) return exact; // Evalúa condición lógica
            }
            for (const target of targets) { // Itera sobre elementos o rango
                const partial = keys.find(k => {
                    const nk = normText(k); // Declara e inicializa variable local
                    return nk.includes(target) || target.includes(nk); // Retorna el resultado de la función
                });
                if (partial) return partial; // Evalúa condición lógica
            }
            return keys[0]; // Retorna el resultado de la función
        }

        function loadDocsScript(src) { // Define función reutilizable
            return new Promise((resolve, reject) => {
                if (window.DOCS_CONTENT) return resolve(window.DOCS_CONTENT); // Evalúa condición lógica
                const s = document.createElement('script'); // Declara e inicializa variable local
                s.src = src;
                s.onload = () => resolve(window.DOCS_CONTENT || {});
                s.onerror = () => reject(new Error('No se pudo cargar docs-data.js'));
                document.head.appendChild(s);
            });
        }

        mdToggleBtn?.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
            const willOpen = !mdPanel.classList.contains('open'); // Declara e inicializa variable local
            mdPanel.classList.toggle('open', willOpen);
            mdToggleBtn.classList.toggle('active', willOpen);
            if (!willOpen || mdLoaded) return; // Evalúa condición lógica

            const docsDataSrc = meta.docsHref.split('#')[0].split('?')[0].replace(/index\.html$/i, 'docs-data.js'); // Declara e inicializa variable local
            try {
                const docsMap = await loadDocsScript(docsDataSrc); // Declara e inicializa variable local
                const key = resolveDocKey(docsMap); // Declara e inicializa variable local
                if (!key || !docsMap[key]) { // Evalúa condición lógica
                    mdBody.innerHTML = `<p>No se encontró una guía .md asociada. Puedes abrir <a href="${meta.docsHref}" style="color:#38bdf8;">Apuntes ↗</a>.</p>`; // Actualiza estructura HTML interna
                    return; // Retorna el resultado de la función
                }
                mdBody.innerHTML = renderMarkdownSimple(docsMap[key]); // Actualiza estructura HTML interna
                const h2s = Array.from(mdBody.querySelectorAll('h2')); // Declara e inicializa variable local
                mdToc.innerHTML = ''; // Actualiza estructura HTML interna
                h2s.forEach(h2 => {
                    const btn = document.createElement('button'); // Declara e inicializa variable local
                    btn.type = 'button';
                    btn.textContent = h2.textContent.slice(0, 34); // Actualiza texto plano en el DOM
                    btn.addEventListener('click', () => h2.scrollIntoView({ behavior: 'smooth', block: 'start' }));
                    mdToc.appendChild(btn);
                });
                mdLoaded = true;
                logConsole(`📖 Guía teórica "${key}" cargada dentro de las diapositivas`, 'ok');
            } catch (err) {
                mdBody.innerHTML = `<p>No se pudo cargar la guía en línea (${err.message}). Abre <a href="${meta.docsHref}" style="color:#38bdf8;">Apuntes ↗</a>.</p>`; // Actualiza estructura HTML interna
            }
        });

        shell.appendChild(docBox);
    }

    // 4. Rejilla principal (.jr-main-grid): Lab + Reto Práctico + Quiz
    const mainGrid = document.createElement('main'); // Declara e inicializa variable local
    mainGrid.className = 'jr-main-grid';

    labSlides.forEach(s => {
        const card = document.createElement('section'); // Declara e inicializa variable local
        card.className = 'jr-card full-span';
        const content = s.querySelector('.slide-content') || s; // Declara e inicializa variable local
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

    const challengeCard = document.createElement('section'); // Declara e inicializa variable local
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
    const chEditor = challengeCard.querySelector('.challenge-editor'); // Declara e inicializa variable local
    const chFeedback = challengeCard.querySelector('.challenge-feedback'); // Declara e inicializa variable local
    challengeCard.querySelector('[data-act="check"]').addEventListener('click', () => { // Registra escuchador de evento en el DOM
        if (ch.test(chEditor.value || '')) { // Evalúa condición lógica
            chFeedback.textContent = '✅ ¡Correcto! Dominaste el reto práctico del módulo.'; // Actualiza contenido en el DOM
            chFeedback.className = 'challenge-feedback show ok';
            logConsole(`✅ Reto "${topicFolder}" superado`, 'ok');
        } else {
            chFeedback.textContent = '❌ Aún falta algún detalle clave. Revisa la pista e inténtalo de nuevo.'; // Actualiza contenido en el DOM
            chFeedback.className = 'challenge-feedback show err';
            logConsole(`❌ Reto "${topicFolder}" incompleto`, 'err');
        }
    });
    challengeCard.querySelector('[data-act="hint"]').addEventListener('click', () => { // Registra escuchador de evento en el DOM
        chFeedback.textContent = `💡 Pista: ${ch.hint}`; // Actualiza contenido en el DOM
        chFeedback.className = 'challenge-feedback show ok';
    });
    challengeCard.querySelector('[data-act="solve"]').addEventListener('click', () => { // Registra escuchador de evento en el DOM
        chEditor.value = ch.solution;
        chFeedback.textContent = '✨ Solución cargada. Pulsa "Verificar Solución" o personalízala.'; // Actualiza contenido en el DOM
        chFeedback.className = 'challenge-feedback show ok';
        logConsole(`✨ Solución ejemplo cargada para "${topicFolder}"`);
    });
    mainGrid.appendChild(challengeCard);

    quizSlides.forEach(s => {
        const card = document.createElement('section'); // Declara e inicializa variable local
        card.className = 'jr-card';
        const content = s.querySelector('.slide-content') || s; // Declara e inicializa variable local
        while (content.firstChild) card.appendChild(content.firstChild);
        mainGrid.appendChild(card);
    });

    shell.appendChild(mainGrid);

    // 5. Consola en Vivo (.jr-console-panel)
    const consolePanel = document.createElement('section'); // Declara e inicializa variable local
    consolePanel.className = 'jr-console-panel';
    consolePanel.innerHTML = `
        <div class="jr-console-header">
            <h2>Registro de Consola en Vivo (también en DevTools)</h2>
            <button type="button" class="jr-slide-btn" id="jrClearLog">Limpiar</button>
        </div>
        <div class="jr-console-log" id="jrConsoleLog"></div>
    `;
    shell.appendChild(consolePanel);

    const logBox = consolePanel.querySelector('#jrConsoleLog'); // Declara e inicializa variable local
    function logConsole(msg, type = '') { // Define función reutilizable
        if (!logBox) return; // Evalúa condición lógica
        const line = document.createElement('div'); // Declara e inicializa variable local
        line.className = `jr-log-line ${type}`.trim();
        const hora = new Date().toLocaleTimeString(); // Declara e inicializa variable local
        line.textContent = `[${hora}] ${msg}`; // Actualiza contenido en el DOM
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
    }
    consolePanel.querySelector('#jrClearLog').addEventListener('click', () => { // Registra escuchador de evento en el DOM
        logBox.innerHTML = ''; // Actualiza contenido en el DOM
    });

    // 6. Navegación directa entre módulos del mismo nivel (⬅ Anterior / Siguiente ➡)
    const COURSE_MODULES = { // Mapa ordenado de carpetas de módulos por nivel
        'HTML y CSS': ['HTML BASICO', 'HTML avanzado', 'CSS BASICO', 'CSS avanzado', 'Formularios', 'Flexbox', 'Grid', 'Animaciones', 'Funciones Avanzadas', 'Responsive Design'],
        'JAVASCRIPT MID LEVEL': ['Window', 'Objetos Barprop', 'Location', 'Screen y Scroll', 'Resize y Move', 'Eventos', 'Switch', 'Try-Catch', 'Temporizadores', 'Callbacks', 'Promesas', 'Async y Await', 'Datos Estructurados (JSON)', 'Expresiones Regulares', 'Peticiones HTTP', 'Ajax', 'Fetch', 'Libreria Axios', 'Codigo Obsoleto', 'Pestañas DevTools'],
        'JAVASCRIPT MASTER LEVEL': ['Modo Estricto', 'Operador Ternario', 'Funciones Flecha', 'Prototipos', 'Memoization', 'Objeto Date', 'Objeto Screen', 'Navigator', 'Matchmedia', 'Visibility Change', 'Historial', 'Geolocalization', 'Drag & Drop', 'File Reader', 'Canvas', 'Local Storage', 'Cookies', 'IndexedDB', 'Intersection Observer', 'Apis', 'Cache', 'Notifications', 'Web Workers', 'Service Workers'],
        'NODE': ['Introduccion', 'Fundamentos', 'Instalacion', 'REPL', 'JavaScriptModerno', 'Modulos', 'NPM', 'JSON', 'Asincronia', 'ArchivosNativos', 'Process', 'EventosStreams', 'CryptoSeguridad', 'HttpApi', 'Testing']
    };
    const SUBMODULE_GROUPS = { // Listas de submódulos con navegación Anterior/Siguiente propia
        'Eventos': ['Handlers', 'Event Flow', 'Eventos de Mouse', 'Eventos de Teclado', 'Eventos de Interfaz'],
        'Ajax': ['Ajax Editor', 'Ajax Htdocs'],
        'Libreria Axios': ['Axios Editor', 'Axios-Fetch-Htdocs']
    };
    // Mapa agrupado de submódulos HTML y CSS: evita repetir el nombre del módulo padre en cada entrada
    const HTML_CSS_GROUPS = {
        'HTML BASICO': [
            ['Titulos y Parrafos/Titulos y parrafos.html', 'Títulos y Párrafos'],
            ['Listas/listas.html', 'Listas'],
            ['Enlaces/enlaces.html', 'Enlaces'],
            ['Imagenes/img.html', 'Imágenes'],
            ['Formularios/formularios.html', 'Formularios Básicos']
        ],
        'HTML avanzado': [
            ['HTML Semantico/HTML semantico.html', 'HTML Semántico'],
            ['Accesibilidad/accesibilidad.html', 'Accesibilidad'],
            ['Tablas/tablas.html', 'Tablas'],
            ['audio y video/audio y video.html', 'Audio y Video'],
            ['Lazy load/lazy.html', 'Lazy Load'],
            ['Select Datalist y Option/selec,datalist y option.html', 'Select y Datalist'],
            ['Fieldset y Legend/fieldset y legend.html', 'Fieldset y Legend'],
            ['Textarea y Labels/text-area y labels.html', 'Textarea y Labels'],
            ['Details y Summary/details y summary.html', 'Details y Summary'],
            ['Enlaces avanzados/enlaces avanzado.html', 'Enlaces Avanzados'],
            ['Comentarios Metatags Iconos/comentarios-metatags-iconos.html', 'Metatags e Iconos'],
            ['Emmet/emmet.html', 'Emmet'],
            ['HTML Obsoleto/HTML obsoleto.html', 'HTML Obsoleto']
        ],
        'CSS avanzado': [
            ['selectores/selectores.html', 'Selectores'],
            ['Herencia/herencia.html', 'Herencia'],
            ['Display/display.html', 'Display'],
            ['Position/position_html/position-relative.html', 'Position Relative'],
            ['Position/position_html/position-absolute.html', 'Position Absolute'],
            ['Position/position_html/position-fixed.html', 'Position Fixed'],
            ['Position/position_html/position-sticky.html', 'Position Sticky'],
            ['Pseudoclases/pseudoclases.html', 'Pseudoclases'],
            ['Pseudoelementos/pseudoelementos.html', 'Pseudoelementos'],
            ['BEM/bem.html', 'Metodología BEM'],
            ['Object Fit_Position/fit_position.html', 'Object Fit y Position'],
            ['Overflow/overflow.html', 'Overflow'],
            ['Outline/outline.html', 'Outline'],
            ['Control_flujo_texto/control_texto.html', 'Control de Texto'],
            ['Transition/transition.html', 'Transition']
        ],
        'Flexbox': [
            ['Flex_Direction/direction.html', 'Flex Direction'],
            ['Alineacion/alineacion.html', 'Alineación Flex'],
            ['Wrap y Flow/wrap_flow.html', 'Wrap y Flow'],
            ['Grow,Shrink y Basis/grow.html', 'Grow, Shrink y Basis'],
            ['Order/order.html', 'Order'],
            ['Align Self/align.html', 'Align Self'],
            ['Layout/layout.html', 'Layout Flexbox']
        ],
        'Grid': [
            ['Principios/grid.html', 'Principios de Grid'],
            ['Auto y FR/auto.html', 'Auto y FR'],
            ['Repeat/repeat.html', 'Repeat'],
            ['Gap/gap.html', 'Gap'],
            ['Row-Column/row-column.html', 'Row y Column'],
            ['Area/area.html', 'Grid Area'],
            ['Alineacion/alineacion.html', 'Alineación Grid'],
            ['Grid Explicito e Implicito/exp-imp.html', 'Explícito e Implícito'],
            ['Dense/dense.html', 'Grid Dense'],
            ['Dinamico(Responsive)/dinamico.html', 'Grid Dinámico'],
            ['Subgrid/subgrid.html', 'Subgrid']
        ],
        'Animaciones': [
            ['Animaciones/animaciones.html', 'Keyframes Base'],
            ['Botones Animados/botones.html', 'Botones Animados'],
            ['Texto/texto.html', 'Texto Animado'],
            ['Transiciones (Repaso)/transiciones.html', 'Transiciones'],
            ['Scroll/Scroll Container/scroll.html', 'Scroll Container'],
            ['Scroll/View/view.html', 'Scroll View']
        ],
        'Funciones Avanzadas': [
            ['Variables/variables.html', 'Variables CSS'],
            ['Calc/calc.html', 'Calc()'],
            ['Max Min Clamp/max-min.html', 'Max, Min y Clamp'],
            ['Unidades del Viewport/unidades.html', 'Unidades Viewport'],
            ['Color MIx/color.html', 'Color-Mix()'],
            ['Filter y Backdrop/filter.html', 'Filter y Backdrop'],
            ['Clip Path/clip.html', 'Clip-Path'],
            ['Transform/transform.html', 'Transform'],
            ['Initial Letter/initial.html', 'Initial Letter'],
            ['Scroll/scroll.html', 'Scroll Snap']
        ],
        'Responsive Design': [
            ['Mobile Design/mobile.html', 'Mobile-First'],
            ['Media Queries/mediaq.html', 'Media Queries'],
            ['Container Queries/container.html', 'Container Queries'],
            ['Feature Queries/features.html', 'Feature Queries'],
            ['Bloques Flexibles/bloques_flexibles.html', 'Bloques Flexibles'],
            ['Multimedia Flexible/multimedia.html', 'Multimedia Flexible'],
            ['Picture,Source,Media/picture.html', 'Picture y Source'],
            ['Srcset y Sizes/src-szs.html', 'Srcset y Sizes']
        ]
    };
    // Aplana los grupos anteriores a la secuencia ordenada de submódulos de HTML y CSS
    const HTML_CSS_SUBMODULES = Object.entries(HTML_CSS_GROUPS).flatMap(([parent, items]) =>
        items.map(([subPath, label]) => ({ path: `${parent}/${subPath}`, label, parent }))
    );
    const relFromCourse = courseIdx !== -1 ? parts.slice(courseIdx + 1).join('/') : ''; // Declara e inicializa variable local
    const htmlSubIdx = courseFolder === 'HTML y CSS' ? HTML_CSS_SUBMODULES.findIndex(s => s.path.toLowerCase() === relFromCourse.toLowerCase()) : -1; // Declara e inicializa variable local
    const subGroupKey = Object.keys(SUBMODULE_GROUPS).find(k => parts.includes(k) && SUBMODULE_GROUPS[k].includes(topicFolder)); // Declara e inicializa variable local
    const levelList = subGroupKey ? SUBMODULE_GROUPS[subGroupKey] : (COURSE_MODULES[courseFolder] || []); // Obtiene la lista ordenada del nivel o submódulo actual
    const modIdx = levelList.indexOf(topicFolder); // Ubica el índice del módulo actual
    if (htmlSubIdx !== -1 || (/^index\.html?$/i.test(fileName) && modIdx !== -1)) { // Aplica a módulos principales y submódulos de HTML y CSS
        let prevTarget = null; // Declara e inicializa variable local
        let nextTarget = null; // Declara e inicializa variable local
        let parentLink = subGroupKey ? { href: '../index.html', label: subGroupKey } : null; // Declara e inicializa variable local

        if (htmlSubIdx !== -1) { // Evalúa condición lógica
            const curSub = HTML_CSS_SUBMODULES[htmlSubIdx]; // Declara e inicializa variable local
            parentLink = { href: encodeURI(`${toCourseRoot}${curSub.parent}/index.html`), label: curSub.parent };
            if (htmlSubIdx > 0) { // Evalúa condición lógica
                const p = HTML_CSS_SUBMODULES[htmlSubIdx - 1]; // Declara e inicializa variable local
                prevTarget = { href: encodeURI(`${toCourseRoot}${p.path}`), label: p.label };
            } else {
                prevTarget = { href: encodeURI(`${toCourseRoot}Responsive Design/index.html`), label: 'Responsive Design' };
            }
            if (htmlSubIdx < HTML_CSS_SUBMODULES.length - 1) { // Evalúa condición lógica
                const n = HTML_CSS_SUBMODULES[htmlSubIdx + 1]; // Declara e inicializa variable local
                nextTarget = { href: encodeURI(`${toCourseRoot}${n.path}`), label: n.label };
            } else {
                nextTarget = { href: encodeURI(`${toPortalRoot}JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Variables/index.html`), label: 'JS Junior: Variables' };
            }
        } else {
            const prevMod = modIdx > 0 ? levelList[modIdx - 1] : null; // Módulo anterior si existe
            const nextMod = modIdx < levelList.length - 1 ? levelList[modIdx + 1] : null; // Módulo siguiente si existe

            // Conexión entre cursos cuando estamos en el primer o último módulo de un nivel
            const CROSS_COURSE = !subGroupKey ? {
                'HTML y CSS': { next: { href: `${toCourseRoot}${HTML_CSS_SUBMODULES[0].path}`, label: HTML_CSS_SUBMODULES[0].label } },
                'JAVASCRIPT MID LEVEL': {
                    prev: { href: `${toPortalRoot}JAVASCRIPT/JAVASCRIPT JUNIOR LEVEL/Dom/index.html`, label: 'JS Junior: Dom' },
                    next: { href: `${toPortalRoot}JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Modo Estricto/index.html`, label: 'JS Master: Modo Estricto' }
                },
                'JAVASCRIPT MASTER LEVEL': {
                    prev: { href: `${toPortalRoot}JAVASCRIPT/JAVASCRIPT MID LEVEL/Pestañas DevTools/index.html`, label: 'JS Mid: DevTools' },
                    next: { href: `${toPortalRoot}NODE/Introduccion/index.html`, label: 'Node.js: Introduccion' }
                },
                'NODE': { prev: { href: `${toPortalRoot}JAVASCRIPT/JAVASCRIPT MASTER LEVEL/Service Workers/index.html`, label: 'JS Master: Service Workers' } }
            }[courseFolder] : null;

            prevTarget = prevMod ? { href: encodeURI(`../${prevMod}/index.html`), label: prevMod } : (CROSS_COURSE?.prev ? { href: encodeURI(CROSS_COURSE.prev.href), label: CROSS_COURSE.prev.label } : null);
            nextTarget = nextMod ? { href: encodeURI(`../${nextMod}/index.html`), label: nextMod } : (CROSS_COURSE?.next ? { href: encodeURI(CROSS_COURSE.next.href), label: CROSS_COURSE.next.label } : null);
        }

        // Helper reutilizable para crear enlaces de navegación uniformes en barra superior e inferior
        const makeNavLink = (href, text) => {
            const a = document.createElement('a'); // Crea elemento <a>
            a.className = 'jr-nav-link'; // Aplica clase unificada de navegación
            a.href = href; // Asigna URL de destino
            a.textContent = text; // Inserta texto seguro sin interpretar HTML
            return a; // Retorna el enlace construido
        };

        const navRightEl = topNav.querySelector('.jr-nav-right'); // Contenedor derecho de la barra superior
        const firstNavLink = navRightEl?.querySelector('.jr-nav-link') || null; // Punto de inserción antes de los botones globales
        if (parentLink && navRightEl) navRightEl.insertBefore(makeNavLink(parentLink.href, `↩ ${parentLink.label}`), firstNavLink); // Acceso al módulo padre
        if (prevTarget && navRightEl) navRightEl.insertBefore(makeNavLink(prevTarget.href, `⬅ ${prevTarget.label}`), navRightEl.querySelector('.jr-nav-link')); // Acceso al módulo anterior
        if (nextTarget && navRightEl) navRightEl.appendChild(makeNavLink(nextTarget.href, `${nextTarget.label} ➡`)); // Acceso al módulo siguiente
        // Creamos también una barra inferior cómoda al terminar la lección
        const bottomModNav = document.createElement('nav'); // Crea barra inferior de módulos
        bottomModNav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:20px;padding:14px 18px;background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.1);border-radius:14px;'; // Estilos en línea
        bottomModNav.innerHTML = `
            ${prevTarget ? `<a class="jr-nav-link" href="${prevTarget.href}">⬅ Anterior: ${prevTarget.label}</a>` : '<span></span>'}
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${parentLink ? `<a class="jr-nav-link" href="${parentLink.href}">↩ ${parentLink.label}</a>` : ''}
                <a class="jr-nav-link" href="${meta.portalHref}?filter=${meta.filter}">${meta.levelLabel}</a>
                <a class="jr-nav-link" href="${meta.docsHref}">📘 Ver Apuntes</a>
            </div>
            ${nextTarget ? `<a class="jr-nav-link primary" href="${nextTarget.href}">Siguiente: ${nextTarget.label} ➡</a>` : '<span></span>'}
        `; // Inserta enlaces inferior anterior, nivel, apuntes y siguiente
        shell.appendChild(bottomModNav); // Añade la barra al final del contenedor principal
    }

    document.body.classList.add('jr-unified');
    document.body.prepend(shell);
    logConsole(`🚀 Módulo "${topicFolder}" cargado con estructura unificada Junior Level.`, 'ok');
})();

