/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: OBJETO HISTORY (API DE HISTORIAL)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL, SIMULADORES INTERACTIVOS, AUDIO Y PLAYGROUND
 * ============================================================================
 */

(function () { // Instrucción JavaScript
    'use strict'; // Activa el modo estricto de JavaScript

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    const AppState = { // Declara e inicializa "AppState"
        currentSlide: 1,
        totalSlides: 11,
        viewMode: 'slides', // 'slides' | 'guide'
        soundEnabled: true,

        // 1.1 Simulador del Navegador Básico (Slide 2)
        mockHistory: { // Instrucción JavaScript
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
        spa: { // Instrucción JavaScript
            currentRoute: '/inicio',
            history: [
                { route: '/inicio', sec: 'inicio', state: { seccion: 'inicio' } }
            ],
            pointer: 0,
            views: { // Instrucción JavaScript
                '/inicio': { // Instrucción JavaScript
                    title: '🏠 Vista de Inicio',
                    desc: 'Bienvenido a nuestra aplicación SPA con navegación instantánea. El DOM se actualiza dinámicamente sin peticiones de recarga al servidor.',
                    state: { seccion: 'inicio' }
                },
                '/catalogo': { // Instrucción JavaScript
                    title: '📦 Catálogo de Productos',
                    desc: 'Explora la lista completa de artículos tecnológicos. Al pulsar Atrás en el navegador virtual, volverás a Inicio sin perder datos en memoria.',
                    state: { seccion: 'catalogo', categoria: 'tecnologia' }
                },
                '/perfil': { // Instrucción JavaScript
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
        constructor() { // Instrucción JavaScript
            this.ctx = null; // Asigna valor
        }

        init() { // Instrucción JavaScript
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioCtx"
                this.ctx = new AudioCtx(); // Asigna valor
            }
            if (this.ctx && this.ctx.state === 'suspended') { // Evalúa condición
                this.ctx.resume(); // Ejecuta llamada o método
            }
        }

        playTone(freq, type = 'sine', duration = 0.1, volume = 0.05) { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            try { // Inicia bloque protegido contra errores
                this.init(); // Ejecuta llamada o método
                if (!this.ctx) return; // Evalúa condición

                const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
                const gain = this.ctx.createGain(); // Declara e inicializa "gain"

                osc.type = type; // Asigna valor
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime); // Ejecuta llamada o método

                gain.gain.setValueAtTime(volume, this.ctx.currentTime); // Ejecuta llamada o método
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration); // Ejecuta llamada o método

                osc.connect(gain); // Ejecuta llamada o método
                gain.connect(this.ctx.destination); // Ejecuta llamada o método

                osc.start(); // Ejecuta llamada o método
                osc.stop(this.ctx.currentTime + duration); // Ejecuta llamada o método
            } catch (e) { // Instrucción JavaScript
                // Silencioso si el navegador bloquea audio sin interacción
            }
        }

        nav() { // Instrucción JavaScript
            this.playTone(480, 'sine', 0.08, 0.04); // Ejecuta llamada o método
        }

        click() { // Instrucción JavaScript
            this.playTone(600, 'triangle', 0.06, 0.05); // Ejecuta llamada o método
        }

        success() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.playTone(523.25, 'sine', 0.09, 0.05); // Ejecuta llamada o método
            setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 80); // Ejecuta llamada o método
        }

        warning() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.playTone(340, 'sawtooth', 0.12, 0.06); // Ejecuta llamada o método
            setTimeout(() => this.playTone(260, 'sawtooth', 0.15, 0.06), 100); // Ejecuta llamada o método
        }
    }

    const sound = new SoundEngine(); // Declara e inicializa "sound"

    /* ==========================================================================
       3. PRESETS DE CÓDIGO EDITABLE PARA EL PLAYGROUND (Slide 9 & Retos)
       ========================================================================== */
    const CodePresets = { // Declara e inicializa "CodePresets"
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
        constructor() { // Instrucción JavaScript
            this.dom = {}; // Asigna valor
            this.init(); // Ejecuta llamada o método
        }

        init() { // Instrucción JavaScript
            this.cacheDom(); // Ejecuta llamada o método
            this.bindEvents(); // Ejecuta llamada o método
            this.buildSlideDots(); // Ejecuta llamada o método
            this.updateSlideDisplay(); // Ejecuta llamada o método
            
            // Inicializar simuladores específicos
            this.initMockBrowser(); // Ejecuta llamada o método
            this.initScenarioSimulator(); // Ejecuta llamada o método
            this.initFlowTabs(); // Ejecuta llamada o método
            this.initSpaSimulator(); // Ejecuta llamada o método
            this.initAnalogies(); // Ejecuta llamada o método
            this.loadCodePreset('preset-hist-1'); // Ejecuta llamada o método
        }

        cacheDom() { // Instrucción JavaScript
            // Contenedores generales
            this.dom.body = document.body; // Asigna valor
            this.dom.slides = document.querySelectorAll('.slide'); // Asigna valor
            this.dom.presentationWrapper = document.getElementById('presentationWrapper'); // Asigna valor

            // Navegación superior
            this.dom.progressBar = document.getElementById('progressBar'); // Asigna valor
            this.dom.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor
            this.dom.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.dom.modeIcon = document.getElementById('modeIcon'); // Asigna valor
            this.dom.modeText = document.getElementById('modeText'); // Asigna valor
            this.dom.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.dom.soundIcon = document.getElementById('soundIcon'); // Asigna valor
            this.dom.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.dom.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            // Navegación inferior
            this.dom.btnPrevSlide = document.getElementById('btnPrevSlide'); // Asigna valor
            this.dom.btnNextSlide = document.getElementById('btnNextSlide'); // Asigna valor
            this.dom.slideDotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            // Hero Slide
            this.dom.btnStartPresentation = document.getElementById('btnStartPresentation'); // Asigna valor
            this.dom.jumpLinks = document.querySelectorAll('[data-jump]'); // Asigna valor

            // Slide 2: Mockup Navegador
            this.dom.btnMockBack = document.getElementById('btnMockBack'); // Asigna valor
            this.dom.btnMockForward = document.getElementById('btnMockForward'); // Asigna valor
            this.dom.btnMockReload = document.getElementById('btnMockReload'); // Asigna valor
            this.dom.mockUrlText = document.getElementById('mockUrlText'); // Asigna valor
            this.dom.mockStackPointer = document.getElementById('mockStackPointer'); // Asigna valor
            this.dom.mockStackLength = document.getElementById('mockStackLength'); // Asigna valor
            this.dom.btnTestHistoryIntro = document.getElementById('btnTestHistoryIntro'); // Asigna valor
            this.dom.testHistoryIntroStatus = document.getElementById('testHistoryIntroStatus'); // Asigna valor
            this.dom.consoleOutput1 = document.getElementById('console-output-1'); // Asigna valor

            // Slide 3: Pruebas de go()
            this.dom.btnCheckGoExamples = document.getElementById('btnCheckGoExamples'); // Asigna valor
            this.dom.goExamplesResult = document.getElementById('goExamplesResult'); // Asigna valor

            // Slide 4: Simulador de Escenarios
            this.dom.simPropButtons = document.querySelectorAll('.sim-prop-btn'); // Asigna valor
            this.dom.btnCompareHistoryModes = document.getElementById('btnCompareHistoryModes'); // Asigna valor
            this.dom.terminalImplicit = document.getElementById('terminalImplicit'); // Asigna valor
            this.dom.terminalSerialized = document.getElementById('terminalSerialized'); // Asigna valor
            this.dom.statusImplicit = document.getElementById('statusImplicit'); // Asigna valor
            this.dom.statusSerialized = document.getElementById('statusSerialized'); // Asigna valor
            this.dom.storageFeedbackText = document.getElementById('storageFeedbackText'); // Asigna valor

            // Slide 5: Pestañas de Características y Test en Vivo
            this.dom.charTabButtons = document.querySelectorAll('.char-tab-btn'); // Asigna valor
            this.dom.charDetailViews = document.querySelectorAll('.char-detail-view'); // Asigna valor
            this.dom.btnTestHistoryState = document.getElementById('btnTestHistoryState'); // Asigna valor
            this.dom.historyStateResult = document.getElementById('historyStateResult'); // Asigna valor
            this.dom.btnTestPopstate = document.getElementById('btnTestPopstate'); // Asigna valor
            this.dom.popstateResult = document.getElementById('popstateResult'); // Asigna valor
            this.dom.btnTestNoTrigger = document.getElementById('btnTestNoTrigger'); // Asigna valor
            this.dom.noTriggerResult = document.getElementById('noTriggerResult'); // Asigna valor

            // Slide 7: Simulador SPA
            this.dom.btnSpaBack = document.getElementById('btnSpaBack'); // Asigna valor
            this.dom.btnSpaForward = document.getElementById('btnSpaForward'); // Asigna valor
            this.dom.spaCurrentUrl = document.getElementById('spaCurrentUrl'); // Asigna valor
            this.dom.spaTabs = document.querySelectorAll('.spa-tab-btn'); // Asigna valor
            this.dom.spaCanvasTitle = document.getElementById('spaCanvasTitle'); // Asigna valor
            this.dom.spaCanvasDesc = document.getElementById('spaCanvasDesc'); // Asigna valor
            this.dom.spaStatusResult = document.getElementById('spaStatusResult'); // Asigna valor

            // Slide 8: Analogías
            this.dom.toolButtons = document.querySelectorAll('.tool-btn'); // Asigna valor
            this.dom.officeCardLeft = document.getElementById('officeCardLeft'); // Asigna valor
            this.dom.officeAvatarLeft = document.getElementById('officeAvatarLeft'); // Asigna valor
            this.dom.officeTitleLeft = document.getElementById('officeTitleLeft'); // Asigna valor
            this.dom.officeSubLeft = document.getElementById('officeSubLeft'); // Asigna valor
            this.dom.officeItemsLeft = document.getElementById('officeItemsLeft'); // Asigna valor
            this.dom.officeStatusLeft = document.getElementById('officeStatusLeft'); // Asigna valor

            this.dom.officeCardRight = document.getElementById('officeCardRight'); // Asigna valor
            this.dom.officeAvatarRight = document.getElementById('officeAvatarRight'); // Asigna valor
            this.dom.officeTitleRight = document.getElementById('officeTitleRight'); // Asigna valor
            this.dom.officeSubRight = document.getElementById('officeSubRight'); // Asigna valor
            this.dom.officeItemsRight = document.getElementById('officeItemsRight'); // Asigna valor
            this.dom.officeStatusRight = document.getElementById('officeStatusRight'); // Asigna valor

            this.dom.officeArrowLabel = document.getElementById('officeArrowLabel'); // Asigna valor
            this.dom.officeBannerIcon = document.getElementById('officeBannerIcon'); // Asigna valor
            this.dom.officeBannerText = document.getElementById('officeBannerText'); // Asigna valor

            // Slide 9: Playground
            this.dom.codePresetSelect = document.getElementById('codePresetSelect'); // Asigna valor
            this.dom.liveCodeEditor = document.getElementById('liveCodeEditor'); // Asigna valor
            this.dom.btnResetCode = document.getElementById('btnResetCode'); // Asigna valor
            this.dom.btnRunEditorCode = document.getElementById('btnRunEditorCode'); // Asigna valor
            this.dom.btnClearConsole = document.getElementById('btnClearConsole'); // Asigna valor
            this.dom.consoleLogsContainer = document.getElementById('consoleLogsContainer'); // Asigna valor

            // Slide 10: Cheat Sheet & Retos
            this.dom.accordionHeaders = document.querySelectorAll('.accordion-header'); // Asigna valor
            this.dom.btnLoadChallenges = document.querySelectorAll('[data-load-challenge]'); // Asigna valor
            this.dom.btnRestartPresentation = document.getElementById('btnRestartPresentation'); // Asigna valor
            this.dom.btnCopySummaryCheat = document.getElementById('btnCopySummaryCheat'); // Asigna valor

            // Modales & Toast
            this.dom.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.dom.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.dom.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor
            this.dom.toastNotification = document.getElementById('toastNotification'); // Asigna valor
            this.dom.toastIcon = document.getElementById('toastIcon'); // Asigna valor
            this.dom.toastMsg = document.getElementById('toastMsg'); // Asigna valor

            // Botones de copia de código en tarjetas
            this.dom.btnCopyCodes = document.querySelectorAll('.btn-copy-code'); // Asigna valor
        }

        bindEvents() { // Instrucción JavaScript
            // Navegación por diapositivas
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.addEventListener('click', () => this.prevSlide()); // Evalúa condición
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.addEventListener('click', () => this.nextSlide()); // Evalúa condición
            if (this.dom.btnStartPresentation) this.dom.btnStartPresentation.addEventListener('click', () => this.goToSlide(2)); // Evalúa condición
            if (this.dom.btnRestartPresentation) this.dom.btnRestartPresentation.addEventListener('click', () => this.goToSlide(1)); // Evalúa condición

            // Enlaces de salto directo en hero card
            this.dom.jumpLinks.forEach(link => { // Instrucción JavaScript
                link.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const slideTarget = parseInt(e.currentTarget.getAttribute('data-jump'), 10); // Declara e inicializa "slideTarget"
                    if (slideTarget) this.goToSlide(slideTarget); // Evalúa condición
                });
            });

            // Controles de barra superior
            if (this.dom.btnToggleMode) this.dom.btnToggleMode.addEventListener('click', () => this.toggleViewMode()); // Evalúa condición
            if (this.dom.btnToggleSound) this.dom.btnToggleSound.addEventListener('click', () => this.toggleSound()); // Evalúa condición
            if (this.dom.btnOverview) this.dom.btnOverview.addEventListener('click', () => this.openOverview()); // Evalúa condición
            if (this.dom.btnCloseOverview) this.dom.btnCloseOverview.addEventListener('click', () => this.closeOverview()); // Evalúa condición
            if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen()); // Evalúa condición

            // Navegación por Teclado
            window.addEventListener('keydown', (e) => { // Registra escuchador de eventos
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') { // Evalúa condición
                    // Permitir Ctrl + Enter en el playground para ejecutar
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { // Evalúa condición
                        e.preventDefault(); // Ejecuta llamada o método
                        this.runPlaygroundCode(); // Ejecuta llamada o método
                    }
                    return; // Retorna resultado
                }

                if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd' || e.key === 'D') { // Evalúa condición
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { // Instrucción JavaScript
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                } else if (e.key === 'o' || e.key === 'O') { // Instrucción JavaScript
                    this.openOverview(); // Ejecuta llamada o método
                } else if (e.key === 'Escape') { // Instrucción JavaScript
                    this.closeOverview(); // Ejecuta llamada o método
                } else if (e.key === 'f' || e.key === 'F') { // Instrucción JavaScript
                    this.toggleFullscreen(); // Ejecuta llamada o método
                }
            });

            // Slide 2: Mockup Navegador
            if (this.dom.btnMockBack) this.dom.btnMockBack.addEventListener('click', () => this.mockNavBack()); // Evalúa condición
            if (this.dom.btnMockForward) this.dom.btnMockForward.addEventListener('click', () => this.mockNavForward()); // Evalúa condición
            if (this.dom.btnMockReload) this.dom.btnMockReload.addEventListener('click', () => this.mockNavReload()); // Evalúa condición
            if (this.dom.btnTestHistoryIntro) this.dom.btnTestHistoryIntro.addEventListener('click', () => this.runHistoryIntroTest()); // Evalúa condición

            // Slide 3: go()
            if (this.dom.btnCheckGoExamples) this.dom.btnCheckGoExamples.addEventListener('click', () => this.runGoExamplesTest()); // Evalúa condición

            // Slide 4: Escenarios
            this.dom.simPropButtons.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    this.dom.simPropButtons.forEach(b => b.classList.remove('active')); // Modifica clases CSS del elemento
                    e.currentTarget.classList.add('active'); // Modifica clases CSS del elemento
                    AppState.activeScenario = e.currentTarget.getAttribute('data-scenario'); // Asigna valor
                    this.renderScenarioPreview(); // Ejecuta llamada o método
                    sound.click(); // Ejecuta llamada o método
                });
            });
            if (this.dom.btnCompareHistoryModes) this.dom.btnCompareHistoryModes.addEventListener('click', () => this.runCompareHistoryModes()); // Evalúa condición

            // Slide 5: Pestañas de Características
            this.dom.charTabButtons.forEach(tab => { // Instrucción JavaScript
                tab.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const flowId = e.currentTarget.getAttribute('data-flow'); // Declara e inicializa "flowId"
                    this.switchFlowTab(flowId); // Ejecuta llamada o método
                });
            });
            if (this.dom.btnTestHistoryState) this.dom.btnTestHistoryState.addEventListener('click', () => this.testHistoryState()); // Evalúa condición
            if (this.dom.btnTestPopstate) this.dom.btnTestPopstate.addEventListener('click', () => this.testPopstate()); // Evalúa condición
            if (this.dom.btnTestNoTrigger) this.dom.btnTestNoTrigger.addEventListener('click', () => this.testNoTriggerRule()); // Evalúa condición

            // Slide 7: Simulador SPA
            this.dom.spaTabs.forEach(tab => { // Instrucción JavaScript
                tab.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const route = e.currentTarget.getAttribute('data-sparoute'); // Declara e inicializa "route"
                    this.spaNavigate(route); // Ejecuta llamada o método
                });
            });
            if (this.dom.btnSpaBack) this.dom.btnSpaBack.addEventListener('click', () => this.spaBack()); // Evalúa condición
            if (this.dom.btnSpaForward) this.dom.btnSpaForward.addEventListener('click', () => this.spaForward()); // Evalúa condición

            // Slide 8: Analogías
            this.dom.toolButtons.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    this.dom.toolButtons.forEach(b => b.classList.remove('active')); // Modifica clases CSS del elemento
                    e.currentTarget.classList.add('active'); // Modifica clases CSS del elemento
                    AppState.activeOffice = e.currentTarget.getAttribute('data-office'); // Asigna valor
                    this.renderAnalogies(); // Ejecuta llamada o método
                    sound.click(); // Ejecuta llamada o método
                });
            });

            // Slide 9: Playground
            if (this.dom.codePresetSelect) { // Evalúa condición
                this.dom.codePresetSelect.addEventListener('change', (e) => { // Registra escuchador de eventos
                    this.loadCodePreset(e.target.value); // Ejecuta llamada o método
                });
            }
            if (this.dom.btnResetCode) { // Evalúa condición
                this.dom.btnResetCode.addEventListener('click', () => { // Registra escuchador de eventos
                    this.loadCodePreset(this.dom.codePresetSelect.value); // Ejecuta llamada o método
                    this.showToast('Código restaurado al estado original'); // Ejecuta llamada o método
                });
            }
            if (this.dom.btnRunEditorCode) this.dom.btnRunEditorCode.addEventListener('click', () => this.runPlaygroundCode()); // Evalúa condición
            if (this.dom.btnClearConsole) this.dom.btnClearConsole.addEventListener('click', () => this.clearConsole()); // Evalúa condición

            // Slide 10: Acordeones
            this.dom.accordionHeaders.forEach(header => { // Instrucción JavaScript
                header.addEventListener('click', () => { // Registra escuchador de eventos
                    const item = header.parentElement; // Declara e inicializa "item"
                    const isOpen = item.classList.contains('active'); // Declara e inicializa "isOpen"
                    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active')); // Modifica clases CSS del elemento
                    if (!isOpen) { // Evalúa condición
                        item.classList.add('active'); // Modifica clases CSS del elemento
                        sound.click(); // Ejecuta llamada o método
                    }
                });
            });

            // Cargar retos al Playground
            this.dom.btnLoadChallenges.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const challengeKey = e.currentTarget.getAttribute('data-load-challenge'); // Declara e inicializa "challengeKey"
                    this.goToSlide(9); // Ejecuta llamada o método
                    if (this.dom.codePresetSelect) { // Evalúa condición
                        this.dom.codePresetSelect.value = challengeKey; // Asigna valor
                    }
                    this.loadCodePreset(challengeKey); // Ejecuta llamada o método
                    this.showToast('Reto cargado en el Playground', '✔'); // Ejecuta llamada o método
                    sound.success(); // Ejecuta llamada o método
                });
            });

            // Copiar Markdown de Chuleta
            if (this.dom.btnCopySummaryCheat) { // Evalúa condición
                this.dom.btnCopySummaryCheat.addEventListener('click', () => this.copyCheatSheet()); // Registra escuchador de eventos
            }

            // Copiar Snippets
            this.dom.btnCopyCodes.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const targetId = e.currentTarget.getAttribute('data-target'); // Declara e inicializa "targetId"
                    const targetEl = document.getElementById(targetId); // Obtiene referencia DOM para "targetEl"
                    if (targetEl) { // Evalúa condición
                        navigator.clipboard.writeText(targetEl.innerText).then(() => { // Instrucción JavaScript
                            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
                            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000); // Actualiza contenido en el DOM
                            this.showToast('Código copiado al portapapeles'); // Ejecuta llamada o método
                            sound.success(); // Ejecuta llamada o método
                        });
                    }
                });
            });
        }

        /* --------------------------------------------------------------------------
           Navegación entre Diapositivas
           -------------------------------------------------------------------------- */
        buildSlideDots() { // Instrucción JavaScript
            if (!this.dom.slideDotsContainer) return; // Evalúa condición
            this.dom.slideDotsContainer.innerHTML = ''; // Actualiza contenido en el DOM
            for (let i = 1; i <= AppState.totalSlides; i++) { // Inicia bucle de iteración
                const dot = document.createElement('button'); // Crea nuevo elemento DOM "dot"
                dot.className = `slide-dot ${i === AppState.currentSlide ? 'active' : ''}`; // Asigna valor
                dot.setAttribute('title', `Ir a diapositiva ${i}`); // Ejecuta llamada o método
                dot.addEventListener('click', () => this.goToSlide(i)); // Registra escuchador de eventos
                this.dom.slideDotsContainer.appendChild(dot); // Inserta nodo en el DOM
            }
        }

        goToSlide(index) { // Instrucción JavaScript
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición
            AppState.currentSlide = index; // Asigna valor
            this.updateSlideDisplay(); // Ejecuta llamada o método
            sound.nav(); // Ejecuta llamada o método
        }

        nextSlide() { // Instrucción JavaScript
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
                AppState.currentSlide++; // Instrucción JavaScript
                this.updateSlideDisplay(); // Ejecuta llamada o método
                sound.nav(); // Ejecuta llamada o método
            }
        }

        prevSlide() { // Instrucción JavaScript
            if (AppState.currentSlide > 1) { // Evalúa condición
                AppState.currentSlide--; // Instrucción JavaScript
                this.updateSlideDisplay(); // Ejecuta llamada o método
                sound.nav(); // Ejecuta llamada o método
            }
        }

        updateSlideDisplay() { // Instrucción JavaScript
            if (this.dom.slideIndicator) { // Evalúa condición
                this.dom.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            if (this.dom.progressBar) { // Evalúa condición
                const percent = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa "percent"
                this.dom.progressBar.style.width = `${percent}%`; // Asigna valor
            }

            this.dom.slides.forEach((slide, idx) => { // Instrucción JavaScript
                const num = idx + 1; // Declara e inicializa "num"
                if (AppState.viewMode === 'slides') { // Evalúa condición
                    slide.classList.toggle('active', num === AppState.currentSlide); // Modifica clases CSS del elemento
                } else { // Instrucción JavaScript
                    slide.classList.add('active'); // Modo guía: todas visibles
                }
            });

            // Actualizar bolitas
            const dots = document.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, idx) => { // Instrucción JavaScript
                dot.classList.toggle('active', idx + 1 === AppState.currentSlide); // Modifica clases CSS del elemento
            });

            // Deshabilitar botones en extremos
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.disabled = AppState.currentSlide === 1; // Evalúa condición
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.disabled = AppState.currentSlide === AppState.totalSlides; // Evalúa condición

            // Scroll al inicio si cambiamos de diapositiva
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Ejecuta llamada o método
        }

        toggleViewMode() { // Instrucción JavaScript
            if (AppState.viewMode === 'slides') { // Evalúa condición
                AppState.viewMode = 'guide'; // Asigna valor
                this.dom.body.classList.remove('mode-presentation'); // Modifica clases CSS del elemento
                this.dom.body.classList.add('mode-document'); // Modifica clases CSS del elemento
                if (this.dom.modeIcon) this.dom.modeIcon.textContent = '📑'; // Evalúa condición
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Slides'; // Evalúa condición
                this.showToast('Activado Modo Documento Continuo'); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                AppState.viewMode = 'slides'; // Asigna valor
                this.dom.body.classList.remove('mode-document'); // Modifica clases CSS del elemento
                this.dom.body.classList.add('mode-presentation'); // Modifica clases CSS del elemento
                if (this.dom.modeIcon) this.dom.modeIcon.textContent = '📑'; // Evalúa condición
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Guía'; // Evalúa condición
                this.showToast('Activado Modo Diapositivas'); // Ejecuta llamada o método
            }
            this.updateSlideDisplay(); // Ejecuta llamada o método
            sound.click(); // Ejecuta llamada o método
        }

        toggleSound() { // Instrucción JavaScript
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            if (this.dom.soundIcon) { // Evalúa condición
                this.dom.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            this.showToast(AppState.soundEnabled ? 'Sonido activado' : 'Sonido silenciado'); // Ejecuta llamada o método
            if (AppState.soundEnabled) sound.click(); // Evalúa condición
        }

        toggleFullscreen() { // Instrucción JavaScript
            if (!document.fullscreenElement) { // Evalúa condición
                document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
                this.showToast('Pantalla Completa'); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                if (document.exitFullscreen) document.exitFullscreen(); // Evalúa condición
            }
        }

        openOverview() { // Instrucción JavaScript
            if (!this.dom.overviewModal || !this.dom.overviewGrid) return; // Evalúa condición
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

            slideTitles.forEach((title, i) => { // Instrucción JavaScript
                const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
                card.className = `modal-card ${i + 1 === AppState.currentSlide ? 'active' : ''}`; // Asigna valor
                card.innerHTML = `
                    <div class="modal-card-num">#${i + 1}</div>
                    <div class="modal-card-title">${title}</div>
                `;
                card.addEventListener('click', () => { // Registra escuchador de eventos
                    this.goToSlide(i + 1); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });
                this.dom.overviewGrid.appendChild(card); // Inserta nodo en el DOM
            });

            this.dom.overviewModal.classList.add('active'); // Modifica clases CSS del elemento
            sound.click(); // Ejecuta llamada o método
        }

        closeOverview() { // Instrucción JavaScript
            if (this.dom.overviewModal) { // Evalúa condición
                this.dom.overviewModal.classList.remove('active'); // Modifica clases CSS del elemento
            }
        }

        showToast(msg, icon = '✔') { // Instrucción JavaScript
            if (!this.dom.toastNotification) return; // Evalúa condición
            if (this.dom.toastIcon) this.dom.toastIcon.textContent = icon; // Evalúa condición
            if (this.dom.toastMsg) this.dom.toastMsg.textContent = msg; // Evalúa condición

            this.dom.toastNotification.classList.add('active'); // Modifica clases CSS del elemento
            clearTimeout(this.toastTimer); // Ejecuta llamada o método
            this.toastTimer = setTimeout(() => { // Asigna valor
                this.dom.toastNotification.classList.remove('active'); // Modifica clases CSS del elemento
            }, 2600); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 2: SIMULADOR DEL NAVEGADOR WEB (MOCKUP INTERACTIVO)
           -------------------------------------------------------------------------- */
        initMockBrowser() { // Instrucción JavaScript
            this.renderMockBrowser(); // Ejecuta llamada o método
        }

        renderMockBrowser() { // Instrucción JavaScript
            const h = AppState.mockHistory; // Declara e inicializa "h"
            const current = h.stack[h.pointer] || { url: 'curso.dev/inicio', title: 'Página Inicial' }; // Declara e inicializa "current"

            // 1. Actualizar URL visible
            if (this.dom.mockUrlText) { // Evalúa condición
                this.dom.mockUrlText.textContent = current.url; // Actualiza contenido en el DOM
            }

            // 2. Actualizar Puntero y Tamaño
            if (this.dom.mockStackPointer) { // Evalúa condición
                this.dom.mockStackPointer.textContent = `Posición ${h.pointer + 1} / ${h.stack.length}`; // Actualiza contenido en el DOM
            }

            if (this.dom.mockStackLength) { // Evalúa condición
                this.dom.mockStackLength.textContent = `${h.stack.length}`; // Actualiza contenido en el DOM
            }

            // 3. Habilitar/Deshabilitar botones de navegación
            if (this.dom.btnMockBack) { // Evalúa condición
                this.dom.btnMockBack.disabled = (h.pointer <= 0); // Asigna valor
            }
            if (this.dom.btnMockForward) { // Evalúa condición
                this.dom.btnMockForward.disabled = (h.pointer >= h.stack.length - 1); // Asigna valor
            }
        }

        logMockConsole(text) { // Instrucción JavaScript
            if (!this.dom.consoleOutput1) return; // Evalúa condición
            const prompt = this.dom.consoleOutput1.querySelector('.console-prompt'); // Obtiene referencia DOM para "prompt"
            if (prompt) { // Evalúa condición
                prompt.textContent = text; // Actualiza contenido en el DOM
            } else { // Instrucción JavaScript
                this.dom.consoleOutput1.innerHTML = `<div class="console-prompt">${text}</div>`; // Actualiza contenido en el DOM
            }
        }

        mockNavBack() { // Instrucción JavaScript
            if (AppState.mockHistory.pointer > 0) { // Evalúa condición
                AppState.mockHistory.pointer--; // Instrucción JavaScript
                this.renderMockBrowser(); // Ejecuta llamada o método
                const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa "item"
                this.logMockConsole(`> [history.back()] Retrocediste a: ${item.url} | Puntero: Posición ${AppState.mockHistory.pointer + 1} / ${AppState.mockHistory.stack.length}`); // Ejecuta llamada o método
                if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = `Retrocedido a ${item.url}`; // Evalúa condición
                sound.nav(); // Ejecuta llamada o método
            }
        }

        mockNavForward() { // Instrucción JavaScript
            if (AppState.mockHistory.pointer < AppState.mockHistory.stack.length - 1) { // Evalúa condición
                AppState.mockHistory.pointer++; // Instrucción JavaScript
                this.renderMockBrowser(); // Ejecuta llamada o método
                const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa "item"
                this.logMockConsole(`> [history.forward()] Avanzaste a: ${item.url} | Puntero: Posición ${AppState.mockHistory.pointer + 1} / ${AppState.mockHistory.stack.length}`); // Ejecuta llamada o método
                if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = `Avanzado a ${item.url}`; // Evalúa condición
                sound.nav(); // Ejecuta llamada o método
            }
        }

        mockNavReload() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.mockUrlText) { // Evalúa condición
                this.dom.mockUrlText.style.opacity = '0.3'; // Asigna valor
                setTimeout(() => { // Instrucción JavaScript
                    this.dom.mockUrlText.style.opacity = '1'; // Asigna valor
                }, 200); // Ejecuta llamada o método
            }
            const item = AppState.mockHistory.stack[AppState.mockHistory.pointer]; // Declara e inicializa "item"
            this.logMockConsole(`> [history.go(0)] Recargando página actual: ${item.url} (equivale a location.reload())`); // Ejecuta llamada o método
            if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Página recargada'; // Evalúa condición
        }

        runHistoryIntroTest() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Ejecutando secuencia...'; // Evalúa condición
            
            // Si estamos al final, retroceder y luego avanzar automáticamente
            if (AppState.mockHistory.pointer > 0) { // Evalúa condición
                this.mockNavBack(); // Ejecuta llamada o método
                setTimeout(() => { // Instrucción JavaScript
                    this.mockNavBack(); // Ejecuta llamada o método
                    setTimeout(() => { // Instrucción JavaScript
                        this.mockNavForward(); // Ejecuta llamada o método
                        if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Secuencia completada con éxito'; // Evalúa condición
                        sound.success(); // Ejecuta llamada o método
                    }, 800); // Ejecuta llamada o método
                }, 800); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                this.mockNavForward(); // Ejecuta llamada o método
                setTimeout(() => { // Instrucción JavaScript
                    this.mockNavForward(); // Ejecuta llamada o método
                    if (this.dom.testHistoryIntroStatus) this.dom.testHistoryIntroStatus.textContent = 'Secuencia completada con éxito'; // Evalúa condición
                    sound.success(); // Ejecuta llamada o método
                }, 800); // Ejecuta llamada o método
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 3: PRUEBAS DE SALTOS CON GO(DELTA)
           -------------------------------------------------------------------------- */
        runGoExamplesTest() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (!this.dom.goExamplesResult) return; // Evalúa condición
            this.dom.goExamplesResult.innerHTML = `
                <div style="font-family: var(--font-code); line-height: 1.6; font-size: 0.9rem;">
                    <div>⚡ <strong>history.go(-2):</strong> Retrocede 2 posiciones completas de una sola vez en la pila.</div>
                    <div>⚡ <strong>history.go(1):</strong> Equivalente directo a pulsar Adelante (<code>history.forward()</code>).</div>
                    <div>⚡ <strong>history.go(0):</strong> Vuelve a pedir el documento al servidor (recarga pura).</div>
                    <div>⚡ <strong>history.go(-99):</strong> Si el delta excede el rango del historial, <em>se descarta sin error</em>.</div>
                </div>
            `;
            sound.success(); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 4: SIMULADOR DE ESCENARIOS PUSH VS REPLACE
           -------------------------------------------------------------------------- */
        initScenarioSimulator() { // Instrucción JavaScript
            this.renderScenarioPreview(); // Ejecuta llamada o método
        }

        renderScenarioPreview() { // Instrucción JavaScript
            const sc = AppState.activeScenario; // Declara e inicializa "sc"
            if (!this.dom.terminalImplicit || !this.dom.terminalSerialized) return; // Evalúa condición

            if (sc === 'push') { // Evalúa condición
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line">&gt; window.history.pushState({ id: 1 }, "", "/perfil");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; URL cambia a: https://curso.dev/perfil</div>
                    <div class="term-line">&gt; history.length: 3 ➔ 4 (+1 entrada)</div>
                    <div class="term-line" style="color: var(--amber);">&gt; popstate disparado: NO (false)</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line" style="opacity: 0.6;">(Selecciona 'replace' para comparar la sobrescritura)</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición
                    this.dom.storageFeedbackText.innerHTML = '<strong>pushState:</strong> Agrega un nuevo registro a la pila. Si el usuario pulsa "Atrás", volverá a la página previa.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'replace') { // Instrucción JavaScript
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line" style="opacity: 0.6;">(Comparando con replaceState...)</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line">&gt; window.history.replaceState({ id: 2 }, "", "/filtro?p=2");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; URL cambia a: https://curso.dev/filtro?p=2</div>
                    <div class="term-line">&gt; history.length: 3 ➔ 3 (IDÉNTICO, no suma)</div>
                    <div class="term-line" style="color: var(--amber);">&gt; popstate disparado: NO (false)</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición
                    this.dom.storageFeedbackText.innerHTML = '<strong>replaceState:</strong> Sobrescribe la entrada actual en memoria. Ideal para filtros de búsqueda y scroll.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'cross') { // Instrucción JavaScript
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
                if (this.dom.storageFeedbackText) { // Evalúa condición
                    this.dom.storageFeedbackText.innerHTML = '🛑 <strong>SecurityError:</strong> La History API solo permite URLs que compartan exactamente el mismo origen.'; // Actualiza contenido en el DOM
                }
            } else if (sc === 'popstate') { // Instrucción JavaScript
                this.dom.terminalImplicit.innerHTML = `
                    <div class="term-line">&gt; Llamada a pushState() o replaceState()...</div>
                    <div class="term-line" style="color: var(--rose);">&gt; ¿Dispara evento 'popstate'?: NUNCA.</div>
                `;
                this.dom.terminalSerialized.innerHTML = `
                    <div class="term-line">&gt; Clic en "Atrás" / "Adelante" del navegador...</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; ¿Dispara evento 'popstate'?: SÍ (true).</div>
                `;
                if (this.dom.storageFeedbackText) { // Evalúa condición
                    this.dom.storageFeedbackText.innerHTML = '🔔 <strong>Regla de Oro:</strong> popstate es un evento de <em>navegación del usuario</em>. Las llamadas programáticas a pushState/replaceState nunca lo activan.'; // Actualiza contenido en el DOM
                }
            }
        }

        runCompareHistoryModes() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            this.renderScenarioPreview(); // Ejecuta llamada o método
            this.showToast('Escenario evaluado en tiempo real', '⚡'); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 5: PESTAÑAS DE CARACTERÍSTICAS Y PRUEBAS EN VIVO
           -------------------------------------------------------------------------- */
        initFlowTabs() { // Instrucción JavaScript
            this.switchFlowTab('1'); // Ejecuta llamada o método
        }

        switchFlowTab(flowId) { // Instrucción JavaScript
            this.dom.charTabButtons.forEach(btn => { // Instrucción JavaScript
                btn.classList.toggle('active', btn.getAttribute('data-flow') === flowId); // Modifica clases CSS del elemento
            });
            this.dom.charDetailViews.forEach(view => { // Instrucción JavaScript
                view.classList.toggle('active', view.id === `flow-view-${flowId}`); // Modifica clases CSS del elemento
            });
            sound.click(); // Ejecuta llamada o método
        }

        testHistoryState() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            const state = window.history.state; // Declara e inicializa "state"
            const res = { // Declara e inicializa "res"
                valorActual: state,
                esNull: state === null,
                longitudHistorial: window.history.length,
                urlActual: window.location.href
            };
            if (this.dom.historyStateResult) { // Evalúa condición
                this.dom.historyStateResult.innerHTML = `
                    <strong>Lectura inmediata de window.history.state:</strong><br/>
                    <code>${JSON.stringify(res, null, 2)}</code>
                `;
            }
            sound.success(); // Ejecuta llamada o método
        }

        testPopstate() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.popstateResult) { // Evalúa condición
                this.dom.popstateResult.innerHTML = `
                    <span style="color: var(--cyan); font-weight: bold;">🔔 [Simulación de popstate]</span><br/>
                    1. Usuario presionó "Atrás".<br/>
                    2. El navegador restauró el estado: <code>{ seccion: "catalogo", page: 1 }</code><br/>
                    3. La función escuchadora lee <code>event.state</code> y monta los componentes en el DOM.
                `;
            }
            sound.success(); // Ejecuta llamada o método
        }

        testNoTriggerRule() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.noTriggerResult) { // Evalúa condición
                this.dom.noTriggerResult.innerHTML = `
                    <span style="color: var(--amber); font-weight: bold;">⚠️ Verificación de Regla de Oro:</span><br/>
                    Se ejecutó <code>history.pushState({ demo: true }, '', '?demo=ok')</code>.<br/>
                    El evento <strong>popstate NO se disparó</strong>.<br/>
                    <em>Conclusión: Si usas pushState, debes renderizar tú mismo la vista en tu código.</em>
                `;
            }
            sound.warning(); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 7: SIMULADOR DE ENRUTADOR SPA COMPLETO
           -------------------------------------------------------------------------- */
        initSpaSimulator() { // Instrucción JavaScript
            this.renderSpaView('/inicio'); // Ejecuta llamada o método
        }

        spaNavigate(route) { // Instrucción JavaScript
            const view = AppState.spa.views[route]; // Declara e inicializa "view"
            if (!view) return; // Evalúa condición

            // Truncar historial si estábamos navegando atrás
            if (AppState.spa.pointer < AppState.spa.history.length - 1) { // Evalúa condición
                AppState.spa.history.splice(AppState.spa.pointer + 1); // Ejecuta llamada o método
            }

            // Añadir nueva entrada a la pila del SPA
            AppState.spa.history.push({ // Instrucción JavaScript
                route: route,
                sec: view.state.seccion,
                state: view.state
            });
            AppState.spa.pointer = AppState.spa.history.length - 1; // Asigna valor

            this.renderSpaView(route); // Ejecuta llamada o método
            sound.click(); // Ejecuta llamada o método
        }

        renderSpaView(route) { // Instrucción JavaScript
            AppState.spa.currentRoute = route; // Asigna valor
            const view = AppState.spa.views[route] || AppState.spa.views['/inicio']; // Declara e inicializa "view"

            // 1. Actualizar URL visible
            if (this.dom.spaCurrentUrl) { // Evalúa condición
                this.dom.spaCurrentUrl.textContent = route; // Actualiza contenido en el DOM
            }

            // 2. Actualizar Pestaña Activa
            this.dom.spaTabs.forEach(tab => { // Instrucción JavaScript
                const tabRoute = tab.getAttribute('data-sparoute'); // Declara e inicializa "tabRoute"
                tab.classList.toggle('active', tabRoute === route); // Modifica clases CSS del elemento
            });

            // 3. Actualizar Canvas Visual
            if (this.dom.spaCanvasTitle) this.dom.spaCanvasTitle.textContent = view.title; // Evalúa condición
            if (this.dom.spaCanvasDesc) this.dom.spaCanvasDesc.textContent = view.desc; // Evalúa condición

            // 4. Actualizar Estado de Retroalimentación
            if (this.dom.spaStatusResult) { // Evalúa condición
                this.dom.spaStatusResult.innerHTML = `
                    Pestaña activa: "<strong>${view.state.seccion}</strong>" | 
                    history.state: <code>${JSON.stringify(view.state)}</code> | 
                    Entrada en pila SPA: <strong>${AppState.spa.pointer + 1} de ${AppState.spa.history.length}</strong>
                `;
            }

            // 5. Botones Atrás / Adelante del SPA
            if (this.dom.btnSpaBack) { // Evalúa condición
                this.dom.btnSpaBack.disabled = (AppState.spa.pointer <= 0); // Asigna valor
            }
            if (this.dom.btnSpaForward) { // Evalúa condición
                this.dom.btnSpaForward.disabled = (AppState.spa.pointer >= AppState.spa.history.length - 1); // Asigna valor
            }
        }

        spaBack() { // Instrucción JavaScript
            if (AppState.spa.pointer > 0) { // Evalúa condición
                AppState.spa.pointer--; // Instrucción JavaScript
                const item = AppState.spa.history[AppState.spa.pointer]; // Declara e inicializa "item"
                this.renderSpaView(item.route); // Ejecuta llamada o método
                sound.nav(); // Ejecuta llamada o método
            }
        }

        spaForward() { // Instrucción JavaScript
            if (AppState.spa.pointer < AppState.spa.history.length - 1) { // Evalúa condición
                AppState.spa.pointer++; // Instrucción JavaScript
                const item = AppState.spa.history[AppState.spa.pointer]; // Declara e inicializa "item"
                this.renderSpaView(item.route); // Ejecuta llamada o método
                sound.nav(); // Ejecuta llamada o método
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 8: ANALOGÍAS VISUALES (PLATOS & ÁLBUM)
           -------------------------------------------------------------------------- */
        initAnalogies() { // Instrucción JavaScript
            this.renderAnalogies(); // Ejecuta llamada o método
        }

        renderAnalogies() { // Instrucción JavaScript
            const mode = AppState.activeOffice; // Declara e inicializa "mode"
            if (mode === 'platos') { // Evalúa condición
                if (this.dom.officeAvatarLeft) this.dom.officeAvatarLeft.textContent = '🍽️'; // Evalúa condición
                if (this.dom.officeTitleLeft) this.dom.officeTitleLeft.textContent = '1. Colocar un Plato Nuevo (pushState)'; // Evalúa condición
                if (this.dom.officeSubLeft) this.dom.officeSubLeft.textContent = 'La torre crece en altura'; // Evalúa condición
                if (this.dom.officeItemsLeft) { // Evalúa condición
                    this.dom.officeItemsLeft.innerHTML = `
                        <div class="ws-item">Lavas un plato nuevo y lo colocas en la cima de la torre</div>
                        <div class="ws-item">El tamaño total de la pila (history.length) se incrementa en +1</div>
                    `;
                }
                if (this.dom.officeStatusLeft) this.dom.officeStatusLeft.textContent = 'El usuario podrá volver al plato anterior pulsando "Atrás"'; // Evalúa condición

                if (this.dom.officeAvatarRight) this.dom.officeAvatarRight.textContent = '🔄'; // Evalúa condición
                if (this.dom.officeTitleRight) this.dom.officeTitleRight.textContent = '2. Cambiar el Plato de Arriba (replaceState)'; // Evalúa condición
                if (this.dom.officeSubRight) this.dom.officeSubRight.textContent = 'La altura total no cambia'; // Evalúa condición
                if (this.dom.officeItemsRight) { // Evalúa condición
                    this.dom.officeItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Sustituyes el plato de la cima por otro de diferente color</div>
                        <div class="ws-item highlight-item">La cantidad de platos (history.length) se mantiene intacta</div>
                    `;
                }
                if (this.dom.officeStatusRight) this.dom.officeStatusRight.textContent = 'Evita inflar la pila al filtrar búsquedas o cambiar de pestaña'; // Evalúa condición

                if (this.dom.officeArrowLabel) this.dom.officeArrowLabel.textContent = 'Pila LIFO'; // Evalúa condición
                if (this.dom.officeBannerIcon) this.dom.officeBannerIcon.textContent = '🍽️'; // Evalúa condición
                if (this.dom.officeBannerText) { // Evalúa condición
                    this.dom.officeBannerText.innerHTML = '<strong>pushState vs replaceState:</strong> Usa <code>pushState()</code> cuando el cambio represente una página nueva a la que el usuario querrá volver; usa <code>replaceState()</code> para filtros, paginación o formularios multipaso.'; // Actualiza contenido en el DOM
                }
            } else { // Instrucción JavaScript
                // Álbum de fotos
                if (this.dom.officeAvatarLeft) this.dom.officeAvatarLeft.textContent = '📸'; // Evalúa condición
                if (this.dom.officeTitleLeft) this.dom.officeTitleLeft.textContent = '1. La Foto y la Nota Adhesiva (state)'; // Evalúa condición
                if (this.dom.officeSubLeft) this.dom.officeSubLeft.textContent = 'Memoria asociada a cada página'; // Evalúa condición
                if (this.dom.officeItemsLeft) { // Evalúa condición
                    this.dom.officeItemsLeft.innerHTML = `
                        <div class="ws-item">Cada foto tiene su imagen visible (la URL en la barra)</div>
                        <div class="ws-item">Pegas un Post-It detrás con metadatos: { scroll: 400, filtro: 'viajes' }</div>
                    `;
                }
                if (this.dom.officeStatusLeft) this.dom.officeStatusLeft.textContent = 'history.state almacena una copia estructurada de tus datos'; // Evalúa condición

                if (this.dom.officeAvatarRight) this.dom.officeAvatarRight.textContent = '📖'; // Evalúa condición
                if (this.dom.officeTitleRight) this.dom.officeTitleRight.textContent = '2. Hojear el Álbum (popstate)'; // Evalúa condición
                if (this.dom.officeSubRight) this.dom.officeSubRight.textContent = 'Navegación del usuario'; // Evalúa condición
                if (this.dom.officeItemsRight) { // Evalúa condición
                    this.dom.officeItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Cuando pasas la página hacia atrás, despegas la nota</div>
                        <div class="ws-item highlight-item">event.state te entrega los datos para reconstruir la vista</div>
                    `;
                }
                if (this.dom.officeStatusRight) this.dom.officeStatusRight.textContent = 'popstate sólo se dispara cuando el usuario hojea hacia adelante o atrás'; // Evalúa condición

                if (this.dom.officeArrowLabel) this.dom.officeArrowLabel.textContent = 'Inspección'; // Evalúa condición
                if (this.dom.officeBannerIcon) this.dom.officeBannerIcon.textContent = '📸'; // Evalúa condición
                if (this.dom.officeBannerText) { // Evalúa condición
                    this.dom.officeBannerText.innerHTML = '<strong>state y popstate:</strong> El estado viaja silenciosamente con la entrada del historial. Cuando el usuario navega, <code>event.state</code> te dice con precisión qué estaba viendo.'; // Actualiza contenido en el DOM
                }
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 9: PLAYGROUND INTERACTIVO DE CÓDIGO
           -------------------------------------------------------------------------- */
        loadCodePreset(presetKey) { // Instrucción JavaScript
            const code = CodePresets[presetKey]; // Declara e inicializa "code"
            if (code && this.dom.liveCodeEditor) { // Evalúa condición
                this.dom.liveCodeEditor.value = code; // Asigna valor
                this.clearConsole(); // Ejecuta llamada o método
                this.printToConsole(`/* Preset cargado: [${presetKey}]. Pulsa "Ejecutar Código" (Ctrl + Enter) */`, 'info-line'); // Ejecuta llamada o método
            }
        }

        clearConsole() { // Instrucción JavaScript
            if (this.dom.consoleLogsContainer) { // Evalúa condición
                this.dom.consoleLogsContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }
        }

        printToConsole(msg, lineClass = 'log-line') { // Instrucción JavaScript
            if (!this.dom.consoleLogsContainer) return; // Evalúa condición
            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = `log-line ${lineClass}`; // Asigna valor

            const time = new Date().toLocaleTimeString(); // Declara e inicializa "time"
            const timeSpan = `<span class="log-time">[${time}]</span> `; // Declara e inicializa "timeSpan"

            if (typeof msg === 'object') { // Evalúa condición
                try { // Inicia bloque protegido contra errores
                    line.innerHTML = timeSpan + `<pre style="margin:0; display:inline;">${JSON.stringify(msg, null, 2)}</pre>`; // Actualiza contenido en el DOM
                } catch (e) { // Instrucción JavaScript
                    line.innerHTML = timeSpan + String(msg); // Actualiza contenido en el DOM
                }
            } else { // Instrucción JavaScript
                line.innerHTML = timeSpan + String(msg); // Actualiza contenido en el DOM
            }

            this.dom.consoleLogsContainer.appendChild(line); // Inserta nodo en el DOM
            this.dom.consoleLogsContainer.scrollTop = this.dom.consoleLogsContainer.scrollHeight; // Asigna valor
        }

        runPlaygroundCode() { // Instrucción JavaScript
            if (!this.dom.liveCodeEditor) return; // Evalúa condición
            const code = this.dom.liveCodeEditor.value; // Declara e inicializa "code"

            this.clearConsole(); // Ejecuta llamada o método
            sound.click(); // Ejecuta llamada o método

            // Interceptar console de manera segura
            const oldLog = console.log; // Declara e inicializa "oldLog"
            const oldInfo = console.info; // Declara e inicializa "oldInfo"
            const oldWarn = console.warn; // Declara e inicializa "oldWarn"
            const oldError = console.error; // Declara e inicializa "oldError"

            const formatArgs = (args) => { // Define función flecha "formatArgs"
                return args.map(arg => { // Retorna resultado
                    if (arg === null) return 'null'; // Evalúa condición
                    if (arg === undefined) return 'undefined'; // Evalúa condición
                    if (typeof arg === 'object') { // Evalúa condición
                        try { // Inicia bloque protegido contra errores
                            return JSON.stringify(arg); // Retorna resultado
                        } catch (e) { // Instrucción JavaScript
                            return String(arg); // Retorna resultado
                        }
                    }
                    return String(arg); // Retorna resultado
                }).join(' '); // Ejecuta llamada o método
            };

            console.log = (...args) => { // Imprime salida en consola
                oldLog(...args); // Ejecuta llamada o método
                this.printToConsole(formatArgs(args), 'log-line'); // Ejecuta llamada o método
            };
            console.info = (...args) => { // Imprime salida en consola
                oldInfo(...args); // Ejecuta llamada o método
                this.printToConsole(formatArgs(args), 'info-line'); // Ejecuta llamada o método
            };
            console.warn = (...args) => { // Imprime salida en consola
                oldWarn(...args); // Ejecuta llamada o método
                this.printToConsole(formatArgs(args), 'warn-line'); // Ejecuta llamada o método
            };
            console.error = (...args) => { // Imprime salida en consola
                oldError(...args); // Ejecuta llamada o método
                this.printToConsole(formatArgs(args), 'error-line'); // Ejecuta llamada o método
            };

            try { // Inicia bloque protegido contra errores
                const runFn = new Function(code); // Declara e inicializa "runFn"
                runFn(); // Ejecuta llamada o método
                this.printToConsole('--- Ejecución completada sin errores ---', 'info-line'); // Ejecuta llamada o método
                sound.success(); // Ejecuta llamada o método
            } catch (err) { // Instrucción JavaScript
                this.printToConsole(`Error de ejecución: ${err.name} - ${err.message}`, 'error-line'); // Ejecuta llamada o método
                sound.warning(); // Ejecuta llamada o método
            } finally { // Instrucción JavaScript
                console.log = oldLog; // Imprime salida en consola
                console.info = oldInfo; // Imprime salida en consola
                console.warn = oldWarn; // Imprime salida en consola
                console.error = oldError; // Imprime salida en consola
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 10: COPIAR CHULETA EN MARKDOWN
           -------------------------------------------------------------------------- */
        copyCheatSheet() { // Instrucción JavaScript
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

            navigator.clipboard.writeText(markdown).then(() => { // Instrucción JavaScript
                this.showToast('¡Chuleta copiada al portapapeles!'); // Ejecuta llamada o método
                sound.success(); // Ejecuta llamada o método
            }).catch(() => { // Instrucción JavaScript
                this.showToast('No se pudo copiar automáticamente. Puedes seleccionar el texto de la pantalla.'); // Ejecuta llamada o método
            });
        }
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => { // Registra escuchador de eventos
        window.appController = new AppController(); // Asigna valor
    });

})(); // Ejecuta llamada o método
