/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: OBJETO HISTORY (API DE HISTORIAL)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL, SIMULADORES INTERACTIVOS, AUDIO Y PLAYGROUND
 * ============================================================================
 */

(function () {
    'use strict'; // Activa el modo estricto de JavaScript

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    const AppState = {
        currentSlide: 1,
        totalSlides: 11,
        viewMode: 'slides', // 'slides' | 'guide'
        soundEnabled: true,

        // 1.1 Simulador del Navegador Básico (Slide 2)
        mockHistory: {
            stack: [
                { url: 'curso.dev/inicio', state: { page: 'inicio' }, title: 'Página Inicial' },
                { url: 'curso.dev/catalogo', state: { page: 'catalogo', categoria: 'todos' }, title: 'Catálogo de Cursos' },
                { url: 'curso.dev/producto/42', state: { page: 'producto', id: 42 }, title: 'Detalle de Producto #42' }
            ],
            pointer: 2 // Inicia en la última página
        },

        // 1.2 Simulador de Escenarios (Slide 4)
        activeScenario: 'push',

        // 1.3 Simulador SPA Completo (Slide 7)
        spa: {
            currentRoute: '/inicio',
            history: [
                { route: '/inicio', sec: 'inicio', state: { seccion: 'inicio' } }
            ],
            pointer: 0,
            views: {
                '/inicio': {
                    title: '🏠 Vista de Inicio',
                    desc: 'Bienvenido a nuestra aplicación SPA con navegación instantánea. El DOM se actualiza dinámicamente sin peticiones de recarga al servidor.',
                    state: { seccion: 'inicio' }
                },
                '/catalogo': {
                    title: '📦 Catálogo de Productos',
                    desc: 'Explora la lista completa de artículos tecnológicos. Al pulsar Atrás en el navegador virtual, volverás a Inicio sin perder datos en memoria.',
                    state: { seccion: 'catalogo', categoria: 'tecnologia' }
                },
                '/perfil': {
                    title: '👤 Perfil de Usuario',
                    desc: 'Configuración de cuenta y preferencias. La URL visible en la barra cambia limpiamente mediante history.pushState().',
                    state: { seccion: 'perfil', usuarioId: 9942 }
                }
            }
        },

        // 1.4 Analogías Visuales (Slide 8)
        activeOffice: 'platos'
    };

    /* ==========================================================================
       2. MOTOR DE SONIDO SINTETIZADO (Web Audio API)
       ========================================================================== */
    class SoundEngine { // Define clase
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
                const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa variable local
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') { // Evalúa condición lógica
                this.ctx.resume();
            }
        }

        playTone(freq, type = 'sine', duration = 0.1, volume = 0.05) {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            try { // Inicia bloque protegido contra errores
                this.init();
                if (!this.ctx) return; // Evalúa condición lógica

                const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
                const gain = this.ctx.createGain(); // Declara e inicializa variable local

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                // Silencioso si el navegador bloquea audio sin interacción
            }
        }

        nav() {
            this.playTone(480, 'sine', 0.08, 0.04);
        }

        click() {
            this.playTone(600, 'triangle', 0.06, 0.05);
        }

        success() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.playTone(523.25, 'sine', 0.09, 0.05);
            setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 80);
        }

        warning() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.playTone(340, 'sawtooth', 0.12, 0.06);
            setTimeout(() => this.playTone(260, 'sawtooth', 0.15, 0.06), 100);
        }
    }

    const sound = new SoundEngine(); // Declara e inicializa variable local

    /* ==========================================================================
       3. PRESETS DE CÓDIGO EDITABLE PARA EL PLAYGROUND (Slide 9 & Retos)
       ========================================================================== */
    const CodePresets = {
        'preset-hist-1': `// 1. Navegación Básica: back(), forward() y length
console.log("=== INSPECCIÓN DEL HISTORIAL ===");
console.log("Total de entradas en la sesión (history.length):", window.history.length);
console.log("Estado actual (history.state):", window.history.state);

// Simulación de retroceso
console.log("\\n-> Retrocediendo 1 página con history.back()...");
// window.history.back(); // Descomentar en entorno con navegación previa

// Simulación de avance
console.log("-> Avanzando 1 página con history.forward()...");
// window.history.forward();

console.log("¡Comandos analizados correctamente!");`,

        'preset-hist-2': `// 2. Saltos Relativos con history.go(delta)
console.log("=== NAVEGACIÓN RELATIVA CON GO() ===");
console.log("history.go(-1)  <==>  history.back()");
console.log("history.go(1)   <===>  history.forward()");
console.log("history.go(0)   <===>  location.reload()");

console.log("\\n-> Probando cálculo de deltas:");
const saltar = (delta) => {
    console.log(\`Ejecutando salto relativo: \${delta > 0 ? '+' : ''}\${delta} páginas\`);
    // window.history.go(delta);
};

saltar(-2); // Salta dos páginas atrás
saltar(3);  // Salta tres páginas adelante`,

        'preset-hist-3': `// 3. Adición de Entradas con pushState()
console.log("=== AGREGANDO ENTRADA CON PUSHSTATE ===");
const nuevoEstado = {
    seccion: "catalogo",
    filtro: "monitores-4k",
    orden: "precio-desc",
    timestamp: Date.now()
};

const nuevaUrl = "?seccion=catalogo&filtro=monitores-4k";

console.log("Longitud antes de pushState:", window.history.length);
window.history.pushState(nuevoEstado, "", nuevaUrl);

console.log("✅ URL actualizada sin recargar la página.");
console.log("Nueva URL activa:", window.location.search);
console.log("Datos persistidos en memory state:", window.history.state);
console.log("Nueva longitud de historial:", window.history.length);`,

        'preset-hist-4': `// 4. Sobrescritura de Entrada con replaceState()
console.log("=== REEMPLAZANDO ENTRADA CON REPLACESTATE ===");
const estadoFiltro = {
    seccion: "catalogo",
    filtro: "laptops-gaming",
    pagina: 2
};

const longitudAntes = window.history.length;
console.log("Longitud inicial de historial:", longitudAntes);

// Reemplazamos la entrada actual
window.history.replaceState(estadoFiltro, "", "?filtro=laptops-gaming&page=2");

console.log("✅ Entrada actual sobrescrita.");
console.log("Longitud posterior:", window.history.length, "(¡Permanece idéntica!)");
console.log("history.state actualizado:", window.history.state);`,

        'preset-hist-5': `// 5. Lectura de history.state y Evento popstate
console.log("=== ESCUCHANDO EVENTO POPSTATE ===");

const miManejador = (event) => {
    console.log("🔔 [POPSTATE DISPARADO]");
    console.log("Estado restaurado (event.state):", event.state);
    console.log("URL activa:", window.location.href);
};

window.addEventListener('popstate', miManejador);
console.log("Listener registrado en window.");
console.log("Pulsa las flechas Atrás / Adelante del navegador para probar.");

// NOTA: Para remover el listener más adelante:
// window.removeEventListener('popstate', miManejador);`,

        'preset-hist-6': `// 6. Mini Enrutador SPA Completo con Renderizado Dinámico
class MiniRouter {
    constructor() {
        this.rutas = new Map();
        window.addEventListener('popstate', (e) => this._onPopState(e.state));
    }

    ruta(path, handler) {
        this.rutas.set(path, handler);
        return this;
    }

    navegar(path, state = {}) {
        window.history.pushState(state, "", path);
        this._render(path, state);
    }

    _onPopState(state) {
        console.log("⏪ [PopState] Restaurando vista por navegación del usuario");
        this._render(window.location.pathname, state);
    }

    _render(path, state) {
        const handler = this.rutas.get(path) || (() => console.log("404: No encontrada"));
        console.log("Renderizando ruta:", path, "con datos:", state);
        handler(state);
    }
}

const app = new MiniRouter();
app.ruta('/inicio', (s) => console.log("🏠 Renderizando Inicio"));
app.ruta('/articulos', (s) => console.log("📰 Renderizando Artículos"));

app.navegar('/inicio', { rol: 'admin' });
app.navegar('/articulos', { cat: 'js' });`,

        // Presets de los Retos Prácticos
        'preset-ex-hist1': `// RETO NIVEL 1: Paginador con pushState
function cambiarPagina(numeroPagina) {
    if (numeroPagina < 1) return;
    
    const estado = {
        pagina: numeroPagina,
        totalPaginas: 10,
        fecha: new Date().toLocaleTimeString()
    };
    
    const nuevaUrl = "?page=" + numeroPagina;
    
    // Agregamos la página a la pila de navegación
    window.history.pushState(estado, "", nuevaUrl);
    
    console.log("📄 Navegando a Página:", numeroPagina);
    console.log("URL en barra:", window.location.search);
    console.log("Estado en memoria (history.state):", window.history.state);
}

// Simulamos navegación a varias páginas:
cambiarPagina(1);
cambiarPagina(2);
cambiarPagina(3);`,

        'preset-ex-hist2': `// RETO NIVEL 2: Filtro de Búsqueda con Debounce y replaceState
let timerDebounce = null;

function filtrarConDebounce(termino) {
    clearTimeout(timerDebounce);
    
    timerDebounce = setTimeout(() => {
        const estadoFiltro = {
            query: termino,
            filtroActivo: termino.length > 0,
            timestamp: Date.now()
        };
        
        const params = new URLSearchParams(window.location.search);
        if (termino.trim()) {
            params.set('q', termino.trim());
        } else {
            params.delete('q');
        }
        
        const nuevaUrl = "?" + params.toString();
        
        // Usamos replaceState para no saturar el historial con cada letra tecleada
        window.history.replaceState(estadoFiltro, "", nuevaUrl);
        
        console.log("🔍 Filtro aplicado:", termino);
        console.log("URL reemplazada:", nuevaUrl);
        console.log("Tamaño de historial intacto:", window.history.length);
    }, 250);
}

// Simulando tipeo en una caja de texto:
filtrarConDebounce("j");
filtrarConDebounce("jav");
filtrarConDebounce("javascript");`,

        'preset-ex-hist3': `// RETO NIVEL 3: Flujo de Checkout con Modal y Botón Atrás
class CheckoutFlow {
    constructor() {
        this.pasoActual = 1;
        this.init();
    }

    init() {
        // Inicializamos estado base
        window.history.replaceState({ paso: 1, modal: false }, "", "?paso=1");
        
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.paso) {
                console.log("🔄 [PopState] Restaurando Checkout al Paso:", e.state.paso);
                this.pasoActual = e.state.paso;
            } else {
                console.log("⚠️ Volviendo al estado inicial del catálogo");
                this.pasoActual = 1;
            }
        });
    }

    avanzar(siguientePaso) {
        this.pasoActual = siguientePaso;
        const state = { paso: siguientePaso, modal: true, timestamp: Date.now() };
        window.history.pushState(state, "", "?paso=" + siguientePaso);
        console.log("➡️ Avanzado al paso " + siguientePaso + ". Si pulsas Atrás, volverás al paso anterior.");
    }

    cancelar() {
        console.log("❌ Cancelando compra...");
        window.history.back();
    }
}

const checkout = new CheckoutFlow();
checkout.avanzar(2); // Datos de entrega
checkout.avanzar(3); // Método de pago`
    };

    /* ==========================================================================
       4. CONTROLADOR PRINCIPAL DE LA INTERFAZ (AppController)
       ========================================================================== */
    class AppController { // Define clase
        constructor() {
            this.dom = {};
            this.init();
        }

        init() {
            this.cacheDom();
            this.bindEvents();
            this.buildSlideDots();
            this.updateSlideDisplay();
            
            // Inicializar simuladores específicos
            this.initMockBrowser();
            this.initScenarioSimulator();
            this.initFlowTabs();
            this.initSpaSimulator();
            this.initAnalogies();
            this.loadCodePreset('preset-hist-1');
        }

        cacheDom() {
            // Contenedores generales
            this.dom.body = document.body;
            this.dom.slides = document.querySelectorAll('.slide'); // Obtiene referencia al elemento del DOM
            this.dom.presentationWrapper = document.getElementById('presentationWrapper'); // Obtiene referencia al elemento del DOM

            // Navegación superior
            this.dom.progressBar = document.getElementById('progressBar'); // Obtiene referencia al elemento del DOM
            this.dom.slideIndicator = document.getElementById('slideIndicator'); // Obtiene referencia al elemento del DOM
            this.dom.btnToggleMode = document.getElementById('btnToggleMode'); // Obtiene referencia al elemento del DOM
            this.dom.modeIcon = document.getElementById('modeIcon'); // Obtiene referencia al elemento del DOM
            this.dom.modeText = document.getElementById('modeText'); // Obtiene referencia al elemento del DOM
            this.dom.btnToggleSound = document.getElementById('btnToggleSound'); // Obtiene referencia al elemento del DOM
            this.dom.soundIcon = document.getElementById('soundIcon'); // Obtiene referencia al elemento del DOM
            this.dom.btnOverview = document.getElementById('btnOverview'); // Obtiene referencia al elemento del DOM
            this.dom.btnFullscreen = document.getElementById('btnFullscreen'); // Obtiene referencia al elemento del DOM

            // Navegación inferior
            this.dom.btnPrevSlide = document.getElementById('btnPrevSlide'); // Obtiene referencia al elemento del DOM
            this.dom.btnNextSlide = document.getElementById('btnNextSlide'); // Obtiene referencia al elemento del DOM
            this.dom.slideDotsContainer = document.getElementById('slideDotsContainer'); // Obtiene referencia al elemento del DOM

            // Hero Slide
            this.dom.btnStartPresentation = document.getElementById('btnStartPresentation'); // Obtiene referencia al elemento del DOM
            this.dom.jumpLinks = document.querySelectorAll('[data-jump]'); // Obtiene referencia al elemento del DOM

            // Slide 2: Mockup Navegador
            this.dom.btnMockBack = document.getElementById('btnMockBack'); // Obtiene referencia al elemento del DOM
            this.dom.btnMockForward = document.getElementById('btnMockForward'); // Obtiene referencia al elemento del DOM
            this.dom.btnMockReload = document.getElementById('btnMockReload'); // Obtiene referencia al elemento del DOM
            this.dom.mockUrlText = document.getElementById('mockUrlText'); // Obtiene referencia al elemento del DOM
            this.dom.mockStackPointer = document.getElementById('mockStackPointer'); // Obtiene referencia al elemento del DOM
            this.dom.mockStackLength = document.getElementById('mockStackLength'); // Obtiene referencia al elemento del DOM
            this.dom.btnTestHistoryIntro = document.getElementById('btnTestHistoryIntro'); // Obtiene referencia al elemento del DOM
            this.dom.testHistoryIntroStatus = document.getElementById('testHistoryIntroStatus'); // Obtiene referencia al elemento del DOM
            this.dom.consoleOutput1 = document.getElementById('console-output-1'); // Obtiene referencia al elemento del DOM

            // Slide 3: Pruebas de go()
            this.dom.btnCheckGoExamples = document.getElementById('btnCheckGoExamples'); // Obtiene referencia al elemento del DOM
            this.dom.goExamplesResult = document.getElementById('goExamplesResult'); // Obtiene referencia al elemento del DOM

            // Slide 4: Simulador de Escenarios
            this.dom.simPropButtons = document.querySelectorAll('.sim-prop-btn'); // Obtiene referencia al elemento del DOM
            this.dom.btnCompareHistoryModes = document.getElementById('btnCompareHistoryModes'); // Obtiene referencia al elemento del DOM
            this.dom.terminalImplicit = document.getElementById('terminalImplicit'); // Obtiene referencia al elemento del DOM
            this.dom.terminalSerialized = document.getElementById('terminalSerialized'); // Obtiene referencia al elemento del DOM
            this.dom.statusImplicit = document.getElementById('statusImplicit'); // Obtiene referencia al elemento del DOM
            this.dom.statusSerialized = document.getElementById('statusSerialized'); // Obtiene referencia al elemento del DOM
            this.dom.storageFeedbackText = document.getElementById('storageFeedbackText'); // Obtiene referencia al elemento del DOM

            // Slide 5: Pestañas de Características y Test en Vivo
            this.dom.charTabButtons = document.querySelectorAll('.char-tab-btn'); // Obtiene referencia al elemento del DOM
            this.dom.charDetailViews = document.querySelectorAll('.char-detail-view'); // Obtiene referencia al elemento del DOM
            this.dom.btnTestHistoryState = document.getElementById('btnTestHistoryState'); // Obtiene referencia al elemento del DOM
            this.dom.historyStateResult = document.getElementById('historyStateResult'); // Obtiene referencia al elemento del DOM
            this.dom.btnTestPopstate = document.getElementById('btnTestPopstate'); // Obtiene referencia al elemento del DOM
            this.dom.popstateResult = document.getElementById('popstateResult'); // Obtiene referencia al elemento del DOM
            this.dom.btnTestNoTrigger = document.getElementById('btnTestNoTrigger'); // Obtiene referencia al elemento del DOM
            this.dom.noTriggerResult = document.getElementById('noTriggerResult'); // Obtiene referencia al elemento del DOM

            // Slide 7: Simulador SPA
            this.dom.btnSpaBack = document.getElementById('btnSpaBack'); // Obtiene referencia al elemento del DOM
            this.dom.btnSpaForward = document.getElementById('btnSpaForward'); // Obtiene referencia al elemento del DOM
            this.dom.spaCurrentUrl = document.getElementById('spaCurrentUrl'); // Obtiene referencia al elemento del DOM
            this.dom.spaTabs = document.querySelectorAll('.spa-tab-btn'); // Obtiene referencia al elemento del DOM
            this.dom.spaCanvasTitle = document.getElementById('spaCanvasTitle'); // Obtiene referencia al elemento del DOM
            this.dom.spaCanvasDesc = document.getElementById('spaCanvasDesc'); // Obtiene referencia al elemento del DOM
            this.dom.spaStatusResult = document.getElementById('spaStatusResult'); // Obtiene referencia al elemento del DOM

            // Slide 8: Analogías
            this.dom.toolButtons = document.querySelectorAll('.tool-btn'); // Obtiene referencia al elemento del DOM
            this.dom.officeCardLeft = document.getElementById('officeCardLeft'); // Obtiene referencia al elemento del DOM
            this.dom.officeAvatarLeft = document.getElementById('officeAvatarLeft'); // Obtiene referencia al elemento del DOM
            this.dom.officeTitleLeft = document.getElementById('officeTitleLeft'); // Obtiene referencia al elemento del DOM
            this.dom.officeSubLeft = document.getElementById('officeSubLeft'); // Obtiene referencia al elemento del DOM
            this.dom.officeItemsLeft = document.getElementById('officeItemsLeft'); // Obtiene referencia al elemento del DOM
            this.dom.officeStatusLeft = document.getElementById('officeStatusLeft'); // Obtiene referencia al elemento del DOM

            this.dom.officeCardRight = document.getElementById('officeCardRight'); // Obtiene referencia al elemento del DOM
            this.dom.officeAvatarRight = document.getElementById('officeAvatarRight'); // Obtiene referencia al elemento del DOM
            this.dom.officeTitleRight = document.getElementById('officeTitleRight'); // Obtiene referencia al elemento del DOM
            this.dom.officeSubRight = document.getElementById('officeSubRight'); // Obtiene referencia al elemento del DOM
            this.dom.officeItemsRight = document.getElementById('officeItemsRight'); // Obtiene referencia al elemento del DOM
            this.dom.officeStatusRight = document.getElementById('officeStatusRight'); // Obtiene referencia al elemento del DOM

            this.dom.officeArrowLabel = document.getElementById('officeArrowLabel'); // Obtiene referencia al elemento del DOM
            this.dom.officeBannerIcon = document.getElementById('officeBannerIcon'); // Obtiene referencia al elemento del DOM
            this.dom.officeBannerText = document.getElementById('officeBannerText'); // Obtiene referencia al elemento del DOM

            // Slide 9: Playground
            this.dom.codePresetSelect = document.getElementById('codePresetSelect'); // Obtiene referencia al elemento del DOM
            this.dom.liveCodeEditor = document.getElementById('liveCodeEditor'); // Obtiene referencia al elemento del DOM
            this.dom.btnResetCode = document.getElementById('btnResetCode'); // Obtiene referencia al elemento del DOM
            this.dom.btnRunEditorCode = document.getElementById('btnRunEditorCode'); // Obtiene referencia al elemento del DOM
            this.dom.btnClearConsole = document.getElementById('btnClearConsole'); // Obtiene referencia al elemento del DOM
            this.dom.consoleLogsContainer = document.getElementById('consoleLogsContainer'); // Obtiene referencia al elemento del DOM

            // Slide 10: Cheat Sheet & Retos
            this.dom.accordionHeaders = document.querySelectorAll('.accordion-header'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadChallenges = document.querySelectorAll('[data-load-challenge]'); // Obtiene referencia al elemento del DOM
            this.dom.btnRestartPresentation = document.getElementById('btnRestartPresentation'); // Obtiene referencia al elemento del DOM
            this.dom.btnCopySummaryCheat = document.getElementById('btnCopySummaryCheat'); // Obtiene referencia al elemento del DOM

            // Modales & Toast
            this.dom.overviewModal = document.getElementById('overviewModal'); // Obtiene referencia al elemento del DOM
            this.dom.btnCloseOverview = document.getElementById('btnCloseOverview'); // Obtiene referencia al elemento del DOM
            this.dom.overviewGrid = document.getElementById('overviewGrid'); // Obtiene referencia al elemento del DOM
            this.dom.toastNotification = document.getElementById('toastNotification'); // Obtiene referencia al elemento del DOM
            this.dom.toastIcon = document.getElementById('toastIcon'); // Obtiene referencia al elemento del DOM
            this.dom.toastMsg = document.getElementById('toastMsg'); // Obtiene referencia al elemento del DOM

            // Botones de copia de código en tarjetas
            this.dom.btnCopyCodes = document.querySelectorAll('.btn-copy-code'); // Obtiene referencia al elemento del DOM
        }

        bindEvents() {
            // Navegación por diapositivas
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.addEventListener('click', () => this.prevSlide()); // Evalúa condición lógica
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.addEventListener('click', () => this.nextSlide()); // Evalúa condición lógica
            if (this.dom.btnStartPresentation) this.dom.btnStartPresentation.addEventListener('click', () => this.goToSlide(2)); // Evalúa condición lógica
            if (this.dom.btnRestartPresentation) this.dom.btnRestartPresentation.addEventListener('click', () => this.goToSlide(1)); // Evalúa condición lógica

            // Enlaces de salto directo en hero card
            this.dom.jumpLinks.forEach(link => {
                link.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const slideTarget = parseInt(e.currentTarget.getAttribute('data-jump'), 10); // Declara e inicializa variable local
                    if (slideTarget) this.goToSlide(slideTarget); // Evalúa condición lógica
                });
            });

            // Controles de barra superior
            if (this.dom.btnToggleMode) this.dom.btnToggleMode.addEventListener('click', () => this.toggleViewMode()); // Evalúa condición lógica
            if (this.dom.btnToggleSound) this.dom.btnToggleSound.addEventListener('click', () => this.toggleSound()); // Evalúa condición lógica
            if (this.dom.btnOverview) this.dom.btnOverview.addEventListener('click', () => this.openOverview()); // Evalúa condición lógica
            if (this.dom.btnCloseOverview) this.dom.btnCloseOverview.addEventListener('click', () => this.closeOverview()); // Evalúa condición lógica
            if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen()); // Evalúa condición lógica

            // Navegación por Teclado
            window.addEventListener('keydown', (e) => { // Registra escuchador de evento en el DOM
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') { // Evalúa condición lógica
                    // Permitir Ctrl + Enter en el playground para ejecutar
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { // Evalúa condición lógica
                        e.preventDefault();
                        this.runPlaygroundCode();
                    }
                    return; // Retorna el resultado de la función
                }

                if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd' || e.key === 'D') { // Evalúa condición lógica
                    e.preventDefault();
                    this.nextSlide();
                } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'o' || e.key === 'O') {
                    this.openOverview();
                } else if (e.key === 'Escape') {
                    this.closeOverview();
                } else if (e.key === 'f' || e.key === 'F') {
                    this.toggleFullscreen();
                }
            });

            // Slide 2: Mockup Navegador
            if (this.dom.btnMockBack) this.dom.btnMockBack.addEventListener('click', () => this.mockNavBack()); // Evalúa condición lógica
            if (this.dom.btnMockForward) this.dom.btnMockForward.addEventListener('click', () => this.mockNavForward()); // Evalúa condición lógica
            if (this.dom.btnMockReload) this.dom.btnMockReload.addEventListener('click', () => this.mockNavReload()); // Evalúa condición lógica
            if (this.dom.btnTestHistoryIntro) this.dom.btnTestHistoryIntro.addEventListener('click', () => this.runHistoryIntroTest()); // Evalúa condición lógica

            // Slide 3: go()
            if (this.dom.btnCheckGoExamples) this.dom.btnCheckGoExamples.addEventListener('click', () => this.runGoExamplesTest()); // Evalúa condición lógica

            // Slide 4: Escenarios
            this.dom.simPropButtons.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    this.dom.simPropButtons.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    AppState.activeScenario = e.currentTarget.getAttribute('data-scenario');
                    this.renderScenarioPreview();
                    sound.click();
                });
            });
            if (this.dom.btnCompareHistoryModes) this.dom.btnCompareHistoryModes.addEventListener('click', () => this.runCompareHistoryModes()); // Evalúa condición lógica

            // Slide 5: Pestañas de Características
            this.dom.charTabButtons.forEach(tab => {
                tab.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const flowId = e.currentTarget.getAttribute('data-flow'); // Declara e inicializa variable local
                    this.switchFlowTab(flowId);
                });
            });
            if (this.dom.btnTestHistoryState) this.dom.btnTestHistoryState.addEventListener('click', () => this.testHistoryState()); // Evalúa condición lógica
            if (this.dom.btnTestPopstate) this.dom.btnTestPopstate.addEventListener('click', () => this.testPopstate()); // Evalúa condición lógica
            if (this.dom.btnTestNoTrigger) this.dom.btnTestNoTrigger.addEventListener('click', () => this.testNoTriggerRule()); // Evalúa condición lógica

            // Slide 7: Simulador SPA
            this.dom.spaTabs.forEach(tab => {
                tab.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const route = e.currentTarget.getAttribute('data-sparoute'); // Declara e inicializa variable local
                    this.spaNavigate(route);
                });
            });
            if (this.dom.btnSpaBack) this.dom.btnSpaBack.addEventListener('click', () => this.spaBack()); // Evalúa condición lógica
            if (this.dom.btnSpaForward) this.dom.btnSpaForward.addEventListener('click', () => this.spaForward()); // Evalúa condición lógica

            // Slide 8: Analogías
            this.dom.toolButtons.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    this.dom.toolButtons.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    AppState.activeOffice = e.currentTarget.getAttribute('data-office');
                    this.renderAnalogies();
                    sound.click();
                });
            });

            // Slide 9: Playground
            if (this.dom.codePresetSelect) { // Evalúa condición lógica
                this.dom.codePresetSelect.addEventListener('change', (e) => { // Registra escuchador de evento en el DOM
                    this.loadCodePreset(e.target.value);
                });
            }
            if (this.dom.btnResetCode) { // Evalúa condición lógica
                this.dom.btnResetCode.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    this.loadCodePreset(this.dom.codePresetSelect.value);
                    this.showToast('Código restaurado al estado original');
                });
            }
            if (this.dom.btnRunEditorCode) this.dom.btnRunEditorCode.addEventListener('click', () => this.runPlaygroundCode()); // Evalúa condición lógica
            if (this.dom.btnClearConsole) this.dom.btnClearConsole.addEventListener('click', () => this.clearConsole()); // Evalúa condición lógica

            // Slide 10: Acordeones
            this.dom.accordionHeaders.forEach(header => {
                header.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    const item = header.parentElement; // Declara e inicializa variable local
                    const isOpen = item.classList.contains('active'); // Declara e inicializa variable local
                    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active')); // Obtiene referencia al elemento del DOM
                    if (!isOpen) { // Evalúa condición lógica
                        item.classList.add('active');
                        sound.click();
                    }
                });
            });

            // Cargar retos al Playground
            this.dom.btnLoadChallenges.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const challengeKey = e.currentTarget.getAttribute('data-load-challenge'); // Declara e inicializa variable local
                    this.goToSlide(9);
                    if (this.dom.codePresetSelect) { // Evalúa condición lógica
                        this.dom.codePresetSelect.value = challengeKey;
                    }
                    this.loadCodePreset(challengeKey);
                    this.showToast('Reto cargado en el Playground', '✔');
                    sound.success();
                });
            });

            // Copiar Markdown de Chuleta
            if (this.dom.btnCopySummaryCheat) { // Evalúa condición lógica
                this.dom.btnCopySummaryCheat.addEventListener('click', () => this.copyCheatSheet());
            }

            // Copiar Snippets
            this.dom.btnCopyCodes.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const targetId = e.currentTarget.getAttribute('data-target'); // Declara e inicializa variable local
                    const targetEl = document.getElementById(targetId); // Declara e inicializa variable local
                    if (targetEl) { // Evalúa condición lógica
                        navigator.clipboard.writeText(targetEl.innerText).then(() => {
                            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
                            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000); // Actualiza contenido en el DOM
                            this.showToast('Código copiado al portapapeles');
                            sound.success();
                        });
                    }
                });
            });
        }

        /* --------------------------------------------------------------------------
           Navegación entre Diapositivas
           -------------------------------------------------------------------------- */
        buildSlideDots() {
            if (!this.dom.slideDotsContainer) return; // Evalúa condición lógica
            this.dom.slideDotsContainer.innerHTML = ''; // Actualiza contenido en el DOM
            for (let i = 1; i <= AppState.totalSlides; i++) { // Itera sobre elementos o rango
                const dot = document.createElement('button'); // Declara e inicializa variable local
                dot.className = `slide-dot ${i === AppState.currentSlide ? 'active' : ''}`;
                dot.setAttribute('title', `Ir a diapositiva ${i}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dom.slideDotsContainer.appendChild(dot);
            }
        }

        goToSlide(index) {
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición lógica
            AppState.currentSlide = index;
            this.updateSlideDisplay();
            sound.nav();
        }

        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición lógica
                AppState.currentSlide++;
                this.updateSlideDisplay();
                sound.nav();
            }
        }

        prevSlide() {
            if (AppState.currentSlide > 1) { // Evalúa condición lógica
                AppState.currentSlide--;
                this.updateSlideDisplay();
                sound.nav();
            }
        }

        updateSlideDisplay() {
            if (this.dom.slideIndicator) { // Evalúa condición lógica
                this.dom.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            if (this.dom.progressBar) { // Evalúa condición lógica
                const percent = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa variable local
                this.dom.progressBar.style.width = `${percent}%`;
            }

            this.dom.slides.forEach((slide, idx) => {
                const num = idx + 1; // Declara e inicializa variable local
                if (AppState.viewMode === 'slides') { // Evalúa condición lógica
                    slide.classList.toggle('active', num === AppState.currentSlide);
                } else {
                    slide.classList.add('active'); // Modo guía: todas visibles
                }
            });

            // Actualizar bolitas
            const dots = document.querySelectorAll('.slide-dot'); // Declara e inicializa variable local
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx + 1 === AppState.currentSlide);
            });

            // Deshabilitar botones en extremos
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.disabled = AppState.currentSlide === 1; // Evalúa condición lógica
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.disabled = AppState.currentSlide === AppState.totalSlides; // Evalúa condición lógica

            // Scroll al inicio si cambiamos de diapositiva
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        toggleViewMode() {
            if (AppState.viewMode === 'slides') { // Evalúa condición lógica
                AppState.viewMode = 'guide';
                this.dom.body.classList.remove('mode-presentation');
                this.dom.body.classList.add('mode-document');
                if (this.dom.modeIcon) this.dom.modeIcon.textContent = '📑'; // Evalúa condición lógica
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Slides'; // Evalúa condición lógica
                this.showToast('Activado Modo Documento Continuo');
            } else {
                AppState.viewMode = 'slides';
                this.dom.body.classList.remove('mode-document');
                this.dom.body.classList.add('mode-presentation');
                if (this.dom.modeIcon) this.dom.modeIcon.textContent = '📑'; // Evalúa condición lógica
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Guía'; // Evalúa condición lógica
                this.showToast('Activado Modo Diapositivas');
            }
            this.updateSlideDisplay();
            sound.click();
        }

        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.dom.soundIcon) { // Evalúa condición lógica
                this.dom.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            this.showToast(AppState.soundEnabled ? 'Sonido activado' : 'Sonido silenciado');
            if (AppState.soundEnabled) sound.click(); // Evalúa condición lógica
        }

        toggleFullscreen() {
            if (!document.fullscreenElement) { // Evalúa condición lógica
                document.documentElement.requestFullscreen().catch(() => {});
                this.showToast('Pantalla Completa');
            } else {
                if (document.exitFullscreen) document.exitFullscreen(); // Evalúa condición lógica
            }
        }

        openOverview() {
            if (!this.dom.overviewModal || !this.dom.overviewGrid) return; // Evalúa condición lógica
            this.dom.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            const slideTitles = [
                '1. Inicio: History API',
                '2. Navegación Básica: back() & forward()',
                '3. Inspección: length & go(delta)',
                '4. pushState vs replaceState',
                '5. history.state & popstate',
                '6. Buenas Prácticas & Errores Comunes',
                '7. Enrutador SPA en Tiempo Real',
                '8. Analogías Visuales: Platos & Fotos',
                '9. Laboratorio de Código Playground',
                '10. Chuleta Rápida & Retos Resueltos'
            ];

            slideTitles.forEach((title, i) => {
                const card = document.createElement('div'); // Declara e inicializa variable local
                card.className = `modal-card ${i + 1 === AppState.currentSlide ? 'active' : ''}`;
                card.innerHTML = `
                    <div class="modal-card-num">#${i + 1}</div>
                    <div class="modal-card-title">${title}</div>
                `;
                card.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    this.goToSlide(i + 1);
                    this.closeOverview();
                });
                this.dom.overviewGrid.appendChild(card);
            });

            this.dom.overviewModal.classList.add('active');
            sound.click();
        }

        closeOverview() {
            if (this.dom.overviewModal) { // Evalúa condición lógica
                this.dom.overviewModal.classList.remove('active');
            }
        }

        showToast(msg, icon = '✔') {
            if (!this.dom.toastNotification) return; // Evalúa condición lógica
            if (this.dom.toastIcon) this.dom.toastIcon.textContent = icon; // Evalúa condición lógica
            if (this.dom.toastMsg) this.dom.toastMsg.textContent = msg; // Evalúa condición lógica

            this.dom.toastNotification.classList.add('active');
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                this.dom.toastNotification.classList.remove('active');
            }, 2600);
        }

        /* --------------------------------------------------------------------------
           SLIDE 2: SIMULADOR DEL NAVEGADOR WEB (MOCKUP INTERACTIVO)
           -------------------------------------------------------------------------- */
        initMockBrowser() {
            this.renderMockBrowser();
        }

        renderMockBrowser() {
            const h = AppState.mockHistory; // Declara e inicializa variable local
            const current = h.stack[h.pointer] || { url: 'curso.dev/inicio', title: 'Página Inicial' }; // Declara e inicializa variable local

            // 1. Actualizar URL visible
            if (this.dom.mockUrlText) { // Evalúa condición lógica
                this.dom.mockUrlText.textContent = current.url; // Actualiza contenido en el DOM
            }

            // 2. Actualizar Puntero y Tamaño
            if (this.dom.mockStackPointer) { // Evalúa condición lógica
                this.dom.mockStackPointer.textContent = `Posición ${h.pointer + 1} / ${h.stack.length}`; // Actualiza contenido en el DOM
            }

            if (this.dom.mockStackLength) { // Evalúa condición lógica
                this.dom.mockStackLength.textContent = `${h.stack.length}`; // Actualiza contenido en el DOM
            }

            // 3. Habilitar/Deshabilitar botones de navegación
            if (this.dom.btnMockBack) { // Evalúa condición lógica
                this.dom.btnMockBack.disabled = (h.pointer <= 0);
            }
            if (this.dom.btnMockForward) { // Evalúa condición lógica
                this.dom.btnMockForward.disabled = (h.pointer >= h.stack.length - 1);
            }
        }

        logMockConsole(text) {
            if (!this.dom.consoleOutput1) return; // Evalúa condición lógica
            const prompt = this.dom.consoleOutput1.querySelector('.console-prompt'); // Declara e inicializa variable local
            if (prompt) { // Evalúa condición lógica
                prompt.textContent = text; // Actualiza contenido en el DOM
            } else {
                this.dom.consoleOutput1.innerHTML = `<div class="console-prompt">${text}</div>`; // Actualiza contenido en el DOM
            }
        }

        mockNavBack() {
            if (AppState.mockHistory.pointer > 0) { // Evalúa condición lógica
                AppState.mockHistory.pointer--;
                this.renderMockBrowser();
                const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa variable local
                this.logMockConsole(`> [history.back()] Retrocediste a: ${item.url} | Puntero: Posición ${AppState.mockHistory.pointer + 1} / ${AppState.mockHistory.stack.length}`);
                if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = `Retrocedido a ${item.url}`; // Evalúa condición lógica
                sound.nav();
            }
        }

        mockNavForward() {
            if (AppState.mockHistory.pointer < AppState.mockHistory.stack.length - 1) { // Evalúa condición lógica
                AppState.mockHistory.pointer++;
                this.renderMockBrowser();
                const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa variable local
                this.logMockConsole(`> [history.forward()] Avanzaste a: ${item.url} | Puntero: Posición ${AppState.mockHistory.pointer + 1} / ${AppState.mockHistory.stack.length}`);
                if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = `Avanzado a ${item.url}`; // Evalúa condición lógica
                sound.nav();
            }
        }

        mockNavReload() {
            sound.click();
            if (this.dom.mockUrlText) { // Evalúa condición lógica
                this.dom.mockUrlText.style.opacity = '0.3';
                setTimeout(() => {
                    this.dom.mockUrlText.style.opacity = '1';
                }, 200);
            }
            const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa variable local
            this.logMockConsole(`> [history.go(0)] Recargando página actual: ${item.url} (equivale a location.reload())`);
            if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Página recargada'; // Evalúa condición lógica
        }

        runHistoryIntroTest() {
            sound.click();
            if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Ejecutando secuencia...'; // Evalúa condición lógica
            
            // Si estamos al final, retroceder y luego avanzar automáticamente
            if (AppState.mockHistory.pointer > 0) { // Evalúa condición lógica
                this.mockNavBack();
                setTimeout(() => {
                    this.mockNavBack();
                    setTimeout(() => {
                        this.mockNavForward();
                        if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Secuencia completada con éxito'; // Evalúa condición lógica
                        sound.success();
                    }, 800);
                }, 800);
            } else {
                this.mockNavForward();
                setTimeout(() => {
                    this.mockNavForward();
                    if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Secuencia completada con éxito'; // Evalúa condición lógica
                    sound.success();
                }, 800);
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 3: PRUEBAS DE SALTOS CON GO(DELTA)
           -------------------------------------------------------------------------- */
        runGoExamplesTest() {
            sound.click();
            if (!this.dom.goExamplesResult) return; // Evalúa condición lógica
            this.dom.goExamplesResult.innerHTML = `
                <div style="font-family: var(--font-code); line-height: 1.6; font-size: 0.9rem;">
                    <div>⚡ <strong>history.go(-2):</strong> Retrocede 2 posiciones completas de una sola vez en la pila.</div>
                    <div>⚡ <strong>history.go(1):</strong> Equivalente directo a pulsar Adelante (<code>history.forward()</code>).</div>
                    <div>⚡ <strong>history.go(0):</strong> Vuelve a pedir el documento al servidor (recarga pura).</div>
                    <div>⚡ <strong>history.go(-99):</strong> Si el delta excede el rango del historial, <em>se descarta sin error</em>.</div>
                </div>
            `;
            sound.success();
        }

        /* --------------------------------------------------------------------------
           SLIDE 4: SIMULADOR DE ESCENARIOS PUSH VS REPLACE
           -------------------------------------------------------------------------- */
        initScenarioSimulator() {
            this.renderScenarioPreview();
        }

        renderScenarioPreview() {
            const sc = AppState.activeScenario; // Declara e inicializa variable local
            if (!this.dom.terminalImplicit || !this.dom.terminalSerialized) return; // Evalúa condición lógica

            if (sc === 'push') { // Evalúa condición lógica
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line">&gt; window.history.pushState({ id: 1 }, "", "/perfil");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; URL cambia a: https://curso.dev/perfil</div>
                    <div class="term-line">&gt; history.length: 3 ➔ 4 (+1 entrada)</div>
                    <div class="term-line" style="color: var(--amber);">&gt; popstate disparado: NO (false)</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line" style="opacity: 0.6;">(Selecciona 'replace' para comparar la sobrescritura)</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición lógica
                    this.dom.storageFeedbackText.innerHTML = '<strong>pushState:</strong> Agrega un nuevo registro a la pila. Si el usuario pulsa "Atrás", volverá a la página previa.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'replace') {
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line" style="opacity: 0.6;">(Comparando con replaceState...)</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line">&gt; window.history.replaceState({ id: 2 }, "", "/filtro?p=2");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; URL cambia a: https://curso.dev/filtro?p=2</div>
                    <div class="term-line">&gt; history.length: 3 ➔ 3 (IDÉNTICO, no suma)</div>
                    <div class="term-line" style="color: var(--amber);">&gt; popstate disparado: NO (false)</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición lógica
                    this.dom.storageFeedbackText.innerHTML = '<strong>replaceState:</strong> Sobrescribe la entrada actual en memoria. Ideal para filtros de búsqueda y scroll.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'cross') {
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line">&gt; window.history.pushState({}, "", "https://google.com");</div>
                    <div class="term-line" style="color: var(--rose); font-weight: bold;">
                        &gt; Uncaught DOMException: SecurityError!
                    </div>
                    <div class="term-line">&gt; Protocolo/Host/Puerto distintos.</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line">&gt; Violación de la Same-Origin Policy (Mismo Origen).</div>
                    <div class="term-line">&gt; Previene suplantación de identidad (Phishing).</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición lógica
                    this.dom.storageFeedbackText.innerHTML = '🛑 <strong>SecurityError:</strong> La History API solo permite URLs que compartan exactamente el mismo origen.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'popstate') {
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line">&gt; Llamada a pushState() o replaceState()...</div>
                    <div class="term-line" style="color: var(--rose);">&gt; ¿Dispara evento 'popstate'?: NUNCA.</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line">&gt; Clic en "Atrás" / "Adelante" del navegador...</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; ¿Dispara evento 'popstate'?: SÍ (true).</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición lógica
                    this.dom.storageFeedbackText.innerHTML = '🔔 <strong>Regla de Oro:</strong> popstate es un evento de <em>navegación del usuario</em>. Las llamadas programáticas a pushState/replaceState nunca lo activan.'; // Actualiza contenido en el DOM
                }
            }
        }

        runCompareHistoryModes() {
            sound.click();
            this.renderScenarioPreview();
            this.showToast('Escenario evaluado en tiempo real', '⚡');
        }

        /* --------------------------------------------------------------------------
           SLIDE 5: PESTAÑAS DE CARACTERÍSTICAS Y PRUEBAS EN VIVO
           -------------------------------------------------------------------------- */
        initFlowTabs() {
            this.switchFlowTab('1');
        }

        switchFlowTab(flowId) {
            this.dom.charTabButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-flow') === flowId);
            });
            this.dom.charDetailViews.forEach(view => {
                view.classList.toggle('active', view.id === `flow-view-${flowId}`);
            });
            sound.click();
        }

        testHistoryState() {
            sound.click();
            const state = window.history.state; // Declara e inicializa variable local
            const res = {
                valorActual: state,
                esNull: state === null,
                longitudHistorial: window.history.length,
                urlActual: window.location.href
            };
            if (this.dom.historyStateResult) { // Evalúa condición lógica
                this.dom.historyStateResult.innerHTML = `
                    <strong>Lectura inmediata de window.history.state:</strong><br/>
                    <code>${JSON.stringify(res, null, 2)}</code>
                `;
            }
            sound.success();
        }

        testPopstate() {
            sound.click();
            if (this.dom.popstateResult) { // Evalúa condición lógica
                this.dom.popstateResult.innerHTML = `
                    <span style="color: var(--cyan); font-weight: bold;">🔔 [Simulación de popstate]</span><br/>
                    1. Usuario presionó "Atrás".<br/>
                    2. El navegador restauró el estado: <code>{ seccion: "catalogo", page: 1 }</code><br/>
                    3. La función escuchadora lee <code>event.state</code> y monta los componentes en el DOM.
                `;
            }
            sound.success();
        }

        testNoTriggerRule() {
            sound.click();
            if (this.dom.noTriggerResult) { // Evalúa condición lógica
                this.dom.noTriggerResult.innerHTML = `
                    <span style="color: var(--amber); font-weight: bold;">⚠️ Verificación de Regla de Oro:</span><br/>
                    Se ejecutó <code>history.pushState({ demo: true }, '', '?demo=ok')</code>.<br/>
                    El evento <strong>popstate NO se disparó</strong>.<br/>
                    <em>Conclusión: Si usas pushState, debes renderizar tú mismo la vista en tu código.</em>
                `;
            }
            sound.warning();
        }

        /* --------------------------------------------------------------------------
           SLIDE 7: SIMULADOR DE ENRUTADOR SPA COMPLETO
           -------------------------------------------------------------------------- */
        initSpaSimulator() {
            this.renderSpaView('/inicio');
        }

        spaNavigate(route) {
            const view = AppState.spa.views[route]; // Declara e inicializa variable local
            if (!view) return; // Evalúa condición lógica

            // Truncar historial si estábamos navegando atrás
            if (AppState.spa.pointer < AppState.spa.history.length - 1) { // Evalúa condición lógica
                AppState.spa.history.splice(AppState.spa.pointer + 1);
            }

            // Añadir nueva entrada a la pila del SPA
            AppState.spa.history.push({
                route: route,
                sec: view.state.seccion,
                state: view.state
            });
            AppState.spa.pointer = AppState.spa.history.length - 1;

            this.renderSpaView(route);
            sound.click();
        }

        renderSpaView(route) {
            AppState.spa.currentRoute = route;
            const view = AppState.spa.views[route] || AppState.spa.views['/inicio']; // Declara e inicializa variable local

            // 1. Actualizar URL visible
            if (this.dom.spaCurrentUrl) { // Evalúa condición lógica
                this.dom.spaCurrentUrl.textContent = route; // Actualiza contenido en el DOM
            }

            // 2. Actualizar Pestaña Activa
            this.dom.spaTabs.forEach(tab => {
                const tabRoute = tab.getAttribute('data-sparoute'); // Declara e inicializa variable local
                tab.classList.toggle('active', tabRoute === route);
            });

            // 3. Actualizar Canvas Visual
            if (this.dom.spaCanvasTitle) this.dom.spaCanvasTitle.textContent = view.title; // Evalúa condición lógica
            if (this.dom.spaCanvasDesc) this.dom.spaCanvasDesc.textContent = view.desc; // Evalúa condición lógica

            // 4. Actualizar Estado de Retroalimentación
            if (this.dom.spaStatusResult) { // Evalúa condición lógica
                this.dom.spaStatusResult.innerHTML = `
                    Pestaña activa: "<strong>${view.state.seccion}</strong>" | 
                    history.state: <code>${JSON.stringify(view.state)}</code> | 
                    Entrada en pila SPA: <strong>${AppState.spa.pointer + 1} de ${AppState.spa.history.length}</strong>
                `;
            }

            // 5. Botones Atrás / Adelante del SPA
            if (this.dom.btnSpaBack) { // Evalúa condición lógica
                this.dom.btnSpaBack.disabled = (AppState.spa.pointer <= 0);
            }
            if (this.dom.btnSpaForward) { // Evalúa condición lógica
                this.dom.btnSpaForward.disabled = (AppState.spa.pointer >= AppState.spa.history.length - 1);
            }
        }

        spaBack() {
            if (AppState.spa.pointer > 0) { // Evalúa condición lógica
                AppState.spa.pointer--;
                const item = AppState.spa.history[AppState.spa.pointer]; // Declara e inicializa variable local
                this.renderSpaView(item.route);
                sound.nav();
            }
        }

        spaForward() {
            if (AppState.spa.pointer < AppState.spa.history.length - 1) { // Evalúa condición lógica
                AppState.spa.pointer++;
                const item = AppState.spa.history[AppState.spa.pointer]; // Declara e inicializa variable local
                this.renderSpaView(item.route);
                sound.nav();
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 8: ANALOGÍAS VISUALES (PLATOS & ÁLBUM)
           -------------------------------------------------------------------------- */
        initAnalogies() {
            this.renderAnalogies();
        }

        renderAnalogies() {
            const mode = AppState.activeOffice; // Declara e inicializa variable local
            if (mode === 'platos') { // Evalúa condición lógica
                if (this.dom.officeAvatarLeft) this.dom.officeAvatarLeft.textContent = '🍽️'; // Evalúa condición lógica
                if (this.dom.officeTitleLeft) this.dom.officeTitleLeft.textContent = '1. Colocar un Plato Nuevo (pushState)'; // Evalúa condición lógica
                if (this.dom.officeSubLeft) this.dom.officeSubLeft.textContent = 'La torre crece en altura'; // Evalúa condición lógica
                if (this.dom.officeItemsLeft) { // Evalúa condición lógica
                    this.dom.officeItemsLeft.innerHTML = `
                        <div class="ws-item">Lavas un plato nuevo y lo colocas en la cima de la torre</div>
                        <div class="ws-item">El tamaño total de la pila (history.length) se incrementa en +1</div>
                    `;
                }
                if (this.dom.officeStatusLeft) this.dom.officeStatusLeft.textContent = 'El usuario podrá volver al plato anterior pulsando "Atrás"'; // Evalúa condición lógica

                if (this.dom.officeAvatarRight) this.dom.officeAvatarRight.textContent = '🔄'; // Evalúa condición lógica
                if (this.dom.officeTitleRight) this.dom.officeTitleRight.textContent = '2. Cambiar el Plato de Arriba (replaceState)'; // Evalúa condición lógica
                if (this.dom.officeSubRight) this.dom.officeSubRight.textContent = 'La altura total no cambia'; // Evalúa condición lógica
                if (this.dom.officeItemsRight) { // Evalúa condición lógica
                    this.dom.officeItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Sustituyes el plato de la cima por otro de diferente color</div>
                        <div class="ws-item highlight-item">La cantidad de platos (history.length) se mantiene intacta</div>
                    `;
                }
                if (this.dom.officeStatusRight) this.dom.officeStatusRight.textContent = 'Evita inflar la pila al filtrar búsquedas o cambiar de pestaña'; // Evalúa condición lógica

                if (this.dom.officeArrowLabel) this.dom.officeArrowLabel.textContent = 'Pila LIFO'; // Evalúa condición lógica
                if (this.dom.officeBannerIcon) this.dom.officeBannerIcon.textContent = '🍽️'; // Evalúa condición lógica
                if (this.dom.officeBannerText) { // Evalúa condición lógica
                    this.dom.officeBannerText.innerHTML = '<strong>pushState vs replaceState:</strong> Usa <code>pushState()</code> cuando el cambio represente una página nueva a la que el usuario querrá volver; usa <code>replaceState()</code> para filtros, paginación o formularios multipaso.'; // Actualiza contenido en el DOM
                }
            } else {
                // Álbum de fotos
                if (this.dom.officeAvatarLeft) this.dom.officeAvatarLeft.textContent = '📸'; // Evalúa condición lógica
                if (this.dom.officeTitleLeft) this.dom.officeTitleLeft.textContent = '1. La Foto y la Nota Adhesiva (state)'; // Evalúa condición lógica
                if (this.dom.officeSubLeft) this.dom.officeSubLeft.textContent = 'Memoria asociada a cada página'; // Evalúa condición lógica
                if (this.dom.officeItemsLeft) { // Evalúa condición lógica
                    this.dom.officeItemsLeft.innerHTML = `
                        <div class="ws-item">Cada foto tiene su imagen visible (la URL en la barra)</div>
                        <div class="ws-item">Pegas un Post-It detrás con metadatos: { scroll: 400, filtro: 'viajes' }</div>
                    `;
                }
                if (this.dom.officeStatusLeft) this.dom.officeStatusLeft.textContent = 'history.state almacena una copia estructurada de tus datos'; // Evalúa condición lógica

                if (this.dom.officeAvatarRight) this.dom.officeAvatarRight.textContent = '📖'; // Evalúa condición lógica
                if (this.dom.officeTitleRight) this.dom.officeTitleRight.textContent = '2. Hojear el Álbum (popstate)'; // Evalúa condición lógica
                if (this.dom.officeSubRight) this.dom.officeSubRight.textContent = 'Navegación del usuario'; // Evalúa condición lógica
                if (this.dom.officeItemsRight) { // Evalúa condición lógica
                    this.dom.officeItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Cuando pasas la página hacia atrás, despegas la nota</div>
                        <div class="ws-item highlight-item">event.state te entrega los datos para reconstruir la vista</div>
                    `;
                }
                if (this.dom.officeStatusRight) this.dom.officeStatusRight.textContent = 'popstate sólo se dispara cuando el usuario hojea hacia adelante o atrás'; // Evalúa condición lógica

                if (this.dom.officeArrowLabel) this.dom.officeArrowLabel.textContent = 'Inspección'; // Evalúa condición lógica
                if (this.dom.officeBannerIcon) this.dom.officeBannerIcon.textContent = '📸'; // Evalúa condición lógica
                if (this.dom.officeBannerText) { // Evalúa condición lógica
                    this.dom.officeBannerText.innerHTML = '<strong>state y popstate:</strong> El estado viaja silenciosamente con la entrada del historial. Cuando el usuario navega, <code>event.state</code> te dice con precisión qué estaba viendo.'; // Actualiza contenido en el DOM
                }
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 9: PLAYGROUND INTERACTIVO DE CÓDIGO
           -------------------------------------------------------------------------- */
        loadCodePreset(presetKey) {
            const code = CodePresets[presetKey]; // Declara e inicializa variable local
            if (code && this.dom.liveCodeEditor) { // Evalúa condición lógica
                this.dom.liveCodeEditor.value = code;
                this.clearConsole();
                this.printToConsole(`/* Preset cargado: [${presetKey}]. Pulsa "Ejecutar Código" (Ctrl + Enter) */`, 'info-line');
            }
        }

        clearConsole() {
            if (this.dom.consoleLogsContainer) { // Evalúa condición lógica
                this.dom.consoleLogsContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }
        }

        printToConsole(msg, lineClass = 'log-line') {
            if (!this.dom.consoleLogsContainer) return; // Evalúa condición lógica
            const line = document.createElement('div'); // Declara e inicializa variable local
            line.className = `log-line ${lineClass}`;

            const time = new Date().toLocaleTimeString(); // Declara e inicializa variable local
            const timeSpan = `<span class="log-time">[${time}]</span> `; // Declara e inicializa variable local

            if (typeof msg === 'object') { // Evalúa condición lógica
                try { // Inicia bloque protegido contra errores
                    line.innerHTML = timeSpan + `<pre style="margin:0; display:inline;">${JSON.stringify(msg, null, 2)}</pre>`; // Actualiza contenido en el DOM
                } catch (e) {
                    line.innerHTML = timeSpan + String(msg); // Actualiza contenido en el DOM
                }
            } else {
                line.innerHTML = timeSpan + String(msg); // Actualiza contenido en el DOM
            }

            this.dom.consoleLogsContainer.appendChild(line);
            this.dom.consoleLogsContainer.scrollTop = this.dom.consoleLogsContainer.scrollHeight;
        }

        runPlaygroundCode() {
            if (!this.dom.liveCodeEditor) return; // Evalúa condición lógica
            const code = this.dom.liveCodeEditor.value; // Declara e inicializa variable local

            this.clearConsole();
            sound.click();

            // Interceptar console de manera segura
            const oldLog = console.log; // Declara e inicializa variable local
            const oldInfo = console.info; // Declara e inicializa variable local
            const oldWarn = console.warn; // Declara e inicializa variable local
            const oldError = console.error; // Declara e inicializa variable local

            const formatArgs = (args) => {
                return args.map(arg => {
                    if (arg === null) return 'null'; // Evalúa condición lógica
                    if (arg === undefined) return 'undefined'; // Evalúa condición lógica
                    if (typeof arg === 'object') { // Evalúa condición lógica
                        try { // Inicia bloque protegido contra errores
                            return JSON.stringify(arg); // Retorna el resultado de la función
                        } catch (e) {
                            return String(arg); // Retorna el resultado de la función
                        }
                    }
                    return String(arg); // Retorna el resultado de la función
                }).join(' ');
            };

            console.log = (...args) => { // Imprime salida en consola
                oldLog(...args);
                this.printToConsole(formatArgs(args), 'log-line');
            };
            console.info = (...args) => { // Imprime salida en consola
                oldInfo(...args);
                this.printToConsole(formatArgs(args), 'info-line');
            };
            console.warn = (...args) => { // Imprime salida en consola
                oldWarn(...args);
                this.printToConsole(formatArgs(args), 'warn-line');
            };
            console.error = (...args) => { // Imprime salida en consola
                oldError(...args);
                this.printToConsole(formatArgs(args), 'error-line');
            };

            try { // Inicia bloque protegido contra errores
                const runFn = new Function(code); // Declara e inicializa variable local
                runFn();
                this.printToConsole('--- Ejecución completada sin errores ---', 'info-line');
                sound.success();
            } catch (err) {
                this.printToConsole(`Error de ejecución: ${err.name} - ${err.message}`, 'error-line');
                sound.warning();
            } finally {
                console.log = oldLog; // Imprime salida en consola
                console.info = oldInfo; // Imprime salida en consola
                console.warn = oldWarn; // Imprime salida en consola
                console.error = oldError; // Imprime salida en consola
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 10: COPIAR CHULETA EN MARKDOWN
           -------------------------------------------------------------------------- */
        copyCheatSheet() {
            const markdown = `# 📜 CHULETA RÁPIDA: HISTORY API EN JAVASCRIPT

## 1. Métodos Básicos de Navegación
- \`history.back()\`: Retrocede 1 página (equivale a \`history.go(-1)\`).
- \`history.forward()\`: Avanza 1 página (equivale a \`history.go(1)\`).
- \`history.go(delta)\`: Salto relativo. \`go(0)\` recarga la página.
- \`history.length\`: Número total de entradas en la sesión de navegación.

## 2. Métodos del HTML5 History API
- \`history.pushState(state, unused, url)\`:
  - Agrega una nueva entrada a la pila.
  - Modifica la URL visible sin recargar la página.
  - Trunca entradas posteriores en el botón "Adelante".
  - **NUNCA dispara 'popstate'**.
- \`history.replaceState(state, unused, url)\`:
  - Sobrescribe la entrada actual en memoria.
  - No incrementa \`history.length\`.
  - Ideal para filtros de búsqueda, pestañas o posición de scroll.
  - **NUNCA dispara 'popstate'**.

## 3. Estado y Eventos
- \`history.state\`: Devuelve los datos asociados a la entrada actual (Structured Clone).
- \`window.addEventListener('popstate', (e) => { ... })\`:
  - Se gatilla cuando el usuario pulsa Atrás / Adelante en el navegador o ejecuta \`history.go()\`.
  - \`e.state\` contiene el objeto guardado en \`pushState\` o \`replaceState\`.
  - Si se vuelve a la carga inicial del documento, \`e.state\` es \`null\`.

## 4. Reglas Críticas
1. **Mismo Origen (Same-Origin)**: No se puede cambiar el protocolo, host ni puerto. Genera \`SecurityError\`.
2. **Server Fallback (SPAs)**: Toda URL simulada por pushState debe devolver \`index.html\` en el servidor para evitar error 404 al presionar F5.
`;

            navigator.clipboard.writeText(markdown).then(() => {
                this.showToast('¡Chuleta copiada al portapapeles!');
                sound.success();
            }).catch(() => {
                this.showToast('No se pudo copiar automáticamente. Puedes seleccionar el texto de la pantalla.');
            });
        }
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => { // Registra escuchador de evento en el DOM
        window.appController = new AppController();
    });

})();

