/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: FILEREADER API
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL, SIMULADORES DE LECTURA, DRAG & DROP Y PLAYGROUND
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

        // Demos integradas para cuando el usuario no sube archivos locales
        demos: {
            text: `// ==========================================
// CONFIGURACIÓN DE APLICACIÓN - CONFIG.JSON
// ==========================================
{
  "nombreProyecto": "JavaScript Master Level",
  "modulo": "FileReader API",
  "version": "2.4.0",
  "autor": "Comunidad JS Pro",
  "caracteristicas": [
    "Lectura asíncrona en memoria local",
    "Conversión automática a Base64",
    "Soporte para Drag & Drop nativo",
    "Monitoreo de eventos de progreso"
  ],
  "modoOffline": true,
  "fechaCreacion": "${new Date().toISOString()}"
}`,
            // Imagen SVG de demostración codificada en Data URL
            imageSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="400" height="240" rx="16" fill="%230f172a"/><circle cx="200" cy="100" r="45" fill="url(%23g)"/><path d="M120 190 Q200 130 280 190" stroke="url(%23g)" stroke-width="8" fill="none" stroke-linecap="round"/><text x="200" y="220" text-anchor="middle" fill="%23f8fafc" font-family="sans-serif" font-size="14" font-weight="600">FileReader Demo DataURL</text></svg>',

            gallery: [
                { name: 'dashboard_ui.png', size: '240 KB', color: '#6366f1', icon: '📊' },
                { name: 'avatar_usuario.webp', size: '48 KB', color: '#06b6d4', icon: '👤' },
                { name: 'banner_promocion.jpg', size: '512 KB', color: '#10b981', icon: '🎨' },
                { name: 'grafico_ventas.svg', size: '32 KB', color: '#f59e0b', icon: '📈' }
            ],

            // Lote demo heterogéneo para la sección de carga de múltiples archivos
            multiFiles: [
                {
                    name: 'usuarios_registrados.json',
                    type: 'application/json',
                    size: 1540,
                    method: 'readAsText',
                    icon: '📊',
                    content: '{\n  "total": 3,\n  "usuarios": [\n    {"id": 1, "nombre": "Carlos Gómez", "rol": "Admin"},\n    {"id": 2, "nombre": "Laura Ruiz", "rol": "Desarrollador"},\n    {"id": 3, "nombre": "Mateo Vega", "rol": "Diseñador UI"}\n  ]\n}'
                },
                {
                    name: 'reporte_ventas_2026.csv',
                    type: 'text/csv',
                    size: 890,
                    method: 'readAsText',
                    icon: '📈',
                    content: 'id,mes,ventas_usd,nuevos_alumnos\n1,Enero,18450,142\n2,Febrero,22300,185\n3,Marzo,19800,160'
                },
                {
                    name: 'notas_arquitectura.md',
                    type: 'text/markdown',
                    size: 720,
                    method: 'readAsText',
                    icon: '📄',
                    content: '# Arquitectura de Procesamiento en Cliente\n\n- **Zero Server Overhead**: La lectura ocurre 100% en RAM local.\n- **Concurrencia Segura**: Un objeto FileReader dedicado por archivo.\n- **Detección MIME**: Bifurcación entre readAsText y readAsDataURL.'
                },
                {
                    name: 'avatar_corporativo.png',
                    type: 'image/png',
                    size: 2840,
                    method: 'readAsDataURL',
                    icon: '🖼️',
                    content: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160"><rect width="240" height="160" rx="12" fill="%230f172a"/><circle cx="120" cy="70" r="42" fill="%236366f1"/><text x="120" y="82" text-anchor="middle" font-size="34">👤</text><text x="120" y="135" text-anchor="middle" fill="%23f8fafc" font-family="sans-serif" font-size="12" font-weight="600">Avatar Demo Multiarchivo</text></svg>'
                }
            ]
        },

        // Estado del simulador de progreso
        progressSim: {
            timer: null,
            loaded: 0,
            total: 8192 * 1024, // 8 MB
            isRunning: false
        },

        // Analogías visuales
        activeAnalogy: 'traductor'
    };

    /* ==========================================================================
       2. MOTOR DE AUDIO SINTETIZADO (Web Audio API)
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

        playTone(freq, type = 'sine', duration = 0.09, volume = 0.05) {
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
            } catch (e) {}
        }

        nav() {
            this.playTone(480, 'sine', 0.07, 0.04);
        }

        click() {
            this.playTone(620, 'triangle', 0.06, 0.05);
        }

        fileLoaded() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.playTone(523.25, 'sine', 0.08, 0.05);
            setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.05), 70);
            setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 140);
        }

        error() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.playTone(320, 'sawtooth', 0.12, 0.06);
            setTimeout(() => this.playTone(240, 'sawtooth', 0.15, 0.06), 90);
        }
    }

    const sound = new SoundEngine(); // Declara e inicializa variable local

    /* ==========================================================================
       3. PRESETS DE CÓDIGO EDITABLE PARA EL PLAYGROUND (Slide 9 & Retos)
       ========================================================================== */
    const CodePresets = {
        'preset-file-1': `// 1. Lectura de Archivo de Texto con readAsText()
console.log("=== LECTURA DE TEXTO EN MEMORIA LOCAL ===");

// Creamos un Blob en memoria simulando un archivo seleccionado por el usuario
const contenidoTexto = "Hola Mundo desde la FileReader API.\\nFecha: " + new Date().toLocaleString();
const archivoFalso = new Blob([contenidoTexto], { type: "text/plain" });

const reader = new FileReader();

reader.addEventListener("loadstart", () => {
    console.log("⏳ [1. loadstart] Inicio de la lectura del archivo");
});

reader.addEventListener("load", () => {
    console.log("✅ [2. load] Archivo leído con éxito!");
    console.log("Contenido del archivo (reader.result):");
    console.log(reader.result);
});

reader.addEventListener("loadend", () => {
    console.log("🏁 [3. loadend] Ciclo de vida de lectura finalizado");
});

// Iniciamos la lectura como texto UTF-8
reader.readAsText(archivoFalso, "UTF-8");`,

        'preset-file-2': `// 2. Codificación Base64 con readAsDataURL()
console.log("=== CODIFICACIÓN DE BINARIO A DATA URL ===");

// Creamos un Blob de imagen SVG en memoria
const svgString = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="purple" width="100" height="100"/></svg>';
const blobImagen = new Blob([svgString], { type: "image/svg+xml" });

const reader = new FileReader();

reader.addEventListener("load", () => {
    console.log("✅ Imagen convertida a Data URL:");
    console.log("Esquema Base64:", reader.result.substring(0, 45) + "...");
    console.log("Longitud total de la cadena:", reader.result.length, "caracteres");
    console.log("💡 Puedes asignar esta cadena directamente a: img.src = reader.result");
});

reader.readAsDataURL(blobImagen);`,

        'preset-file-3': `// 3. Procesamiento Paralelo de Galería Múltiple
console.log("=== LECTURA DE MÚLTIPLES ARCHIVOS ===");

// Simulamos una lista de 3 archivos recibidos de <input multiple>
const archivosMock = [
    new Blob(["img1"], { type: "image/png" }),
    new Blob(["img2"], { type: "image/jpeg" }),
    new Blob(["img3"], { type: "image/webp" })
];

console.log("Procesando", archivosMock.length, "archivos en paralelo:");

archivosMock.forEach((archivo, indice) => {
    // REGLA: Cada archivo requiere su propia instancia de FileReader
    const lector = new FileReader();
    
    lector.addEventListener("load", () => {
        console.log(\`🖼️ [Archivo \${indice + 1}] Minisello Base64 generado para tipo: \${archivo.type}\`);
    });
    
    lector.readAsDataURL(archivo);
});`,

        'preset-file-4': `// 4. Integración de FileReader con Eventos Drag & Drop
console.log("=== EVENTOS DE ARRASTRE Y SOLTURA (DRAG & DROP) ===");

function manejarSolturaDeArchivos(eventoDrop) {
    // 1. Evitamos que el navegador abra el archivo en una nueva pestaña
    eventoDrop.preventDefault();
    
    // 2. Extraemos la colección de archivos de dataTransfer
    const archivos = Array.from(eventoDrop.dataTransfer.files);
    console.log("Archivos recibidos en la zona:", archivos.length);
    
    archivos.forEach(file => {
        const reader = new FileReader();
        if (file.type.startsWith("image/")) {
            reader.addEventListener("load", () => console.log("Foto detectada:", file.name));
            reader.readAsDataURL(file);
        } else {
            reader.addEventListener("load", () => console.log("Texto detectado:", file.name));
            reader.readAsText(file);
        }
    });
}

console.log("Función de dropzone lista para escuchar eventos dragover y drop.");`,

        'preset-file-5': `// 5. Monitoreo de Progreso de Lectura con progress
console.log("=== MONITOREO DE EVENTO PROGRESS ===");

// Creamos un Blob de 500 KB para observar avance
const datosGrandes = new Uint8Array(500 * 1024);
const archivoPesado = new Blob([datosGrandes], { type: "application/octet-stream" });

const reader = new FileReader();

reader.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
        const porcentaje = Math.round((e.loaded / e.total) * 100);
        console.log(\`📊 Progreso: \${porcentaje}% (\${(e.loaded / 1024).toFixed(0)} / \${(e.total / 1024).toFixed(0)} KB)\`);
    }
});

reader.addEventListener("load", () => {
    console.log("🎉 Lectura completada al 100%");
});

reader.readAsArrayBuffer(archivoPesado);`,

        'preset-file-6': `// 6. Cancelación de Lectura con reader.abort()
console.log("=== CANCELACIÓN ASÍNCRONA CON ABORT() ===");

const archivoGrande = new Blob([new Uint8Array(1024 * 1024)]);
const reader = new FileReader();

reader.addEventListener("loadstart", () => {
    console.log("Iniciando lectura pesada...");
    // Simulamos que el usuario pulsa 'Cancelar' a los 2 milisegundos
    setTimeout(() => {
        console.log("🛑 El usuario canceló la operación. Ejecutando reader.abort()...");
        reader.abort();
    }, 2);
});

reader.addEventListener("abort", () => {
    console.log("⚠️ Evento 'abort' capturado: La lectura fue cancelada exitosamente.");
});

reader.addEventListener("loadend", () => {
    console.log("🏁 Evento 'loadend': Limpieza de recursos finalizada.");
});

reader.readAsArrayBuffer(archivoGrande);`,

        // Retos Prácticos
        'preset-ex-file1': `// RETO NIVEL 1: Lector y Validador JSON Seguro con try / catch
function leerYValidarJSON(archivo) {
    if (!archivo) {
        console.error("Error: No se proporcionó ningún archivo.");
        return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        try {
            const objetoParseado = JSON.parse(reader.result);
            console.log("✅ JSON válido analizado con éxito:", objetoParseado);
            console.log("Claves encontradas:", Object.keys(objetoParseado));
        } catch (error) {
            console.error("❌ Archivo corrompido: La sintaxis no es un JSON válido.", error.message);
        }
    });

    reader.addEventListener("error", () => {
        console.error("Error de lectura de archivo:", reader.error.message);
    });

    reader.readAsText(archivo, "UTF-8");
}

// Prueba con JSON válido
const mockValido = new Blob(['{"modulo":"FileReader","nivel":"Master"}'], { type: "application/json" });
leerYValidarJSON(mockValido);

// Prueba con JSON inválido
const mockInvalido = new Blob(['{ modulo: "invalido", sin_comillas: }'], { type: "application/json" });
leerYValidarJSON(mockInvalido);`,

        'preset-ex-file2': `// RETO NIVEL 2: Discriminación de Tipo MIME en Zona Drag & Drop
function procesarArchivosArrastrados(fileList) {
    const archivos = Array.from(fileList);
    console.log(\`📦 Procesando \${archivos.length} archivos...\`);

    archivos.forEach(file => {
        const reader = new FileReader();

        if (file.type.startsWith("image/")) {
            // Caso Imagen -> Base64 Data URL
            reader.addEventListener("load", () => {
                console.log(\`🖼️ [IMAGEN] \${file.name} (\${(file.size / 1024).toFixed(1)} KB) -> Asignar a galería <img src="\${reader.result.slice(0,30)}...">\`);
            });
            reader.readAsDataURL(file);
        } else if (file.type.startsWith("text/") || file.name.endsWith(".json") || file.name.endsWith(".md")) {
            // Caso Documento -> Texto Plano
            reader.addEventListener("load", () => {
                console.log(\`📄 [DOCUMENTO] \${file.name}: primer renglón -> \${reader.result.split("\\n")[0]}\`);
            });
            reader.readAsText(file, "UTF-8");
        } else {
            console.warn(\`⚠️ Tipo de archivo no admitido: \${file.name} (\${file.type || 'desconocido'})\`);
        }
    });
}

// Prueba
procesarArchivosArrastrados([
    new Blob(["# Título Markdown"], { type: "text/markdown" }),
    new Blob(["data_bin"], { type: "image/png" }),
    new Blob([new Uint8Array(10)], { type: "application/zip" })
]);`,

        'preset-ex-file3': `// RETO NIVEL 3: Clase FileUploaderManager con Progreso y Abort
class FileUploaderManager {
    constructor(archivo) {
        this.archivo = archivo;
        this.reader = new FileReader();
        this._configurarEventos();
    }

    _configurarEventos() {
        this.reader.addEventListener("loadstart", () => {
            console.log("▶ [loadstart] Lectura iniciada para:", this.archivo.name || "archivo");
        });

        this.reader.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                console.log(\`📊 [progress] \${pct}% completado\`);
            }
        });

        this.reader.addEventListener("load", () => {
            console.log("✅ [load] Lectura concluida satisfactoriamente");
        });

        this.reader.addEventListener("abort", () => {
            console.warn("🛑 [abort] Operación cancelada por el usuario");
        });

        this.reader.addEventListener("loadend", () => {
            console.log("🏁 [loadend] Limpieza de recursos completada");
        });
    }

    iniciar() {
        this.reader.readAsArrayBuffer(this.archivo);
    }

    cancelar() {
        this.reader.abort();
    }
}

const mockPesado = new Blob([new Uint8Array(200 * 1024)]);
const gestor = new FileUploaderManager(mockPesado);
gestor.iniciar();`
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
            this.initSlideText();
            this.initSlideImage();
            this.initSlideGallery();
            this.initSlideDropZone();
            this.initSlideProgress();
            this.initAnalogies();
            this.loadCodePreset('preset-file-1');
        }

        cacheDom() {
            this.dom.body = document.body;
            this.dom.slides = document.querySelectorAll('.slide'); // Obtiene referencia al elemento del DOM

            // Navegación
            this.dom.progressBar = document.getElementById('progressBar'); // Obtiene referencia al elemento del DOM
            this.dom.slideIndicator = document.getElementById('slideIndicator'); // Obtiene referencia al elemento del DOM
            this.dom.btnToggleMode = document.getElementById('btnToggleMode'); // Obtiene referencia al elemento del DOM
            this.dom.modeIcon = document.getElementById('modeIcon'); // Obtiene referencia al elemento del DOM
            this.dom.modeText = document.getElementById('modeText'); // Obtiene referencia al elemento del DOM
            this.dom.btnToggleSound = document.getElementById('btnToggleSound'); // Obtiene referencia al elemento del DOM
            this.dom.soundIcon = document.getElementById('soundIcon'); // Obtiene referencia al elemento del DOM
            this.dom.btnOverview = document.getElementById('btnOverview'); // Obtiene referencia al elemento del DOM
            this.dom.btnFullscreen = document.getElementById('btnFullscreen'); // Obtiene referencia al elemento del DOM
            this.dom.btnPrevSlide = document.getElementById('btnPrevSlide'); // Obtiene referencia al elemento del DOM
            this.dom.btnNextSlide = document.getElementById('btnNextSlide'); // Obtiene referencia al elemento del DOM
            this.dom.slideDotsContainer = document.getElementById('slideDotsContainer'); // Obtiene referencia al elemento del DOM
            this.dom.btnStartPresentation = document.getElementById('btnStartPresentation'); // Obtiene referencia al elemento del DOM
            this.dom.btnRestartPresentation = document.getElementById('btnRestartPresentation'); // Obtiene referencia al elemento del DOM
            this.dom.jumpLinks = document.querySelectorAll('[data-jump]'); // Obtiene referencia al elemento del DOM

            // Slide 2: Lector Texto
            this.dom.dropZoneText = document.getElementById('dropZoneText'); // Obtiene referencia al elemento del DOM
            this.dom.inputLocalText = document.getElementById('inputLocalText'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadDemoText = document.getElementById('btnLoadDemoText'); // Obtiene referencia al elemento del DOM
            this.dom.textReadStatus = document.getElementById('textReadStatus'); // Obtiene referencia al elemento del DOM
            this.dom.textViewerResult = document.getElementById('textViewerResult'); // Obtiene referencia al elemento del DOM

            // Slide 3: Lector Imagen DataURL
            this.dom.dropZoneImage = document.getElementById('dropZoneImage'); // Obtiene referencia al elemento del DOM
            this.dom.inputLocalImage = document.getElementById('inputLocalImage'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadDemoImage = document.getElementById('btnLoadDemoImage'); // Obtiene referencia al elemento del DOM
            this.dom.imageReadStatus = document.getElementById('imageReadStatus'); // Obtiene referencia al elemento del DOM
            this.dom.imagePreviewContainer = document.getElementById('imagePreviewContainer'); // Obtiene referencia al elemento del DOM
            this.dom.imagePreviewPlaceholder = document.getElementById('imagePreviewPlaceholder'); // Obtiene referencia al elemento del DOM
            this.dom.imagePreviewElement = document.getElementById('imagePreviewElement'); // Obtiene referencia al elemento del DOM

            // Slide 4: Carga de Múltiples Archivos & Galería
            this.dom.btnSelectMultipleFiles = document.getElementById('btnSelectMultipleFiles'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadDemoMultiFiles = document.getElementById('btnLoadDemoMultiFiles'); // Obtiene referencia al elemento del DOM
            this.dom.btnClearMultiFiles = document.getElementById('btnClearMultiFiles'); // Obtiene referencia al elemento del DOM
            this.dom.inputMultipleFiles = document.getElementById('inputMultipleFiles'); // Obtiene referencia al elemento del DOM
            this.dom.dropZoneMultiple = document.getElementById('dropZoneMultiple'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilesStatsBar = document.getElementById('multiFilesStatsBar'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilesCount = document.getElementById('multiFilesCount'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilesTotalSize = document.getElementById('multiFilesTotalSize'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilesListContainer = document.getElementById('multiFilesListContainer'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilePreviewBox = document.getElementById('multiFilePreviewBox'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilePreviewTitle = document.getElementById('multiFilePreviewTitle'); // Obtiene referencia al elemento del DOM
            this.dom.multiFilePreviewBody = document.getElementById('multiFilePreviewBody'); // Obtiene referencia al elemento del DOM
            this.dom.btnCloseMultiPreview = document.getElementById('btnCloseMultiPreview'); // Obtiene referencia al elemento del DOM

            this.dom.btnSelectMultipleImages = document.getElementById('btnSelectMultipleImages'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadDemoGallery = document.getElementById('btnLoadDemoGallery'); // Obtiene referencia al elemento del DOM
            this.dom.inputMultipleGallery = document.getElementById('inputMultipleGallery'); // Obtiene referencia al elemento del DOM
            this.dom.galleryCountStatus = document.getElementById('galleryCountStatus'); // Obtiene referencia al elemento del DOM
            this.dom.galleryGridContainer = document.getElementById('galleryGridContainer'); // Obtiene referencia al elemento del DOM

            // Slide 5: Zona Drag & Drop
            this.dom.interactiveMainDropZone = document.getElementById('interactiveMainDropZone'); // Obtiene referencia al elemento del DOM
            this.dom.dropZoneResultBox = document.getElementById('dropZoneResultBox'); // Obtiene referencia al elemento del DOM

            // Slide 7: Progreso
            this.dom.btnStartProgressSim = document.getElementById('btnStartProgressSim'); // Obtiene referencia al elemento del DOM
            this.dom.btnAbortProgressSim = document.getElementById('btnAbortProgressSim'); // Obtiene referencia al elemento del DOM
            this.dom.fileProgressBarFill = document.getElementById('fileProgressBarFill'); // Obtiene referencia al elemento del DOM
            this.dom.progressPercentLabel = document.getElementById('progressPercentLabel'); // Obtiene referencia al elemento del DOM
            this.dom.progressBytesLoaded = document.getElementById('progressBytesLoaded'); // Obtiene referencia al elemento del DOM
            this.dom.progressBytesTotal = document.getElementById('progressBytesTotal'); // Obtiene referencia al elemento del DOM
            this.dom.progressEventLogBox = document.getElementById('progressEventLogBox'); // Obtiene referencia al elemento del DOM

            // Slide 8: Analogías
            this.dom.toolButtons = document.querySelectorAll('.tool-btn'); // Obtiene referencia al elemento del DOM
            this.dom.analogyAvatarLeft = document.getElementById('analogyAvatarLeft'); // Obtiene referencia al elemento del DOM
            this.dom.analogyTitleLeft = document.getElementById('analogyTitleLeft'); // Obtiene referencia al elemento del DOM
            this.dom.analogySubLeft = document.getElementById('analogySubLeft'); // Obtiene referencia al elemento del DOM
            this.dom.analogyItemsLeft = document.getElementById('analogyItemsLeft'); // Obtiene referencia al elemento del DOM
            this.dom.analogyStatusLeft = document.getElementById('analogyStatusLeft'); // Obtiene referencia al elemento del DOM

            this.dom.analogyAvatarRight = document.getElementById('analogyAvatarRight'); // Obtiene referencia al elemento del DOM
            this.dom.analogyTitleRight = document.getElementById('analogyTitleRight'); // Obtiene referencia al elemento del DOM
            this.dom.analogySubRight = document.getElementById('analogySubRight'); // Obtiene referencia al elemento del DOM
            this.dom.analogyItemsRight = document.getElementById('analogyItemsRight'); // Obtiene referencia al elemento del DOM
            this.dom.analogyStatusRight = document.getElementById('analogyStatusRight'); // Obtiene referencia al elemento del DOM

            this.dom.analogyArrowLabel = document.getElementById('analogyArrowLabel'); // Obtiene referencia al elemento del DOM
            this.dom.analogyBannerIcon = document.getElementById('analogyBannerIcon'); // Obtiene referencia al elemento del DOM
            this.dom.analogyBannerText = document.getElementById('analogyBannerText'); // Obtiene referencia al elemento del DOM

            // Slide 9: Playground
            this.dom.codePresetSelect = document.getElementById('codePresetSelect'); // Obtiene referencia al elemento del DOM
            this.dom.liveCodeEditor = document.getElementById('liveCodeEditor'); // Obtiene referencia al elemento del DOM
            this.dom.btnResetCode = document.getElementById('btnResetCode'); // Obtiene referencia al elemento del DOM
            this.dom.btnRunEditorCode = document.getElementById('btnRunEditorCode'); // Obtiene referencia al elemento del DOM
            this.dom.btnClearConsole = document.getElementById('btnClearConsole'); // Obtiene referencia al elemento del DOM
            this.dom.consoleLogsContainer = document.getElementById('consoleLogsContainer'); // Obtiene referencia al elemento del DOM

            // Slide 10: Retos & Cheat Sheet
            this.dom.accordionHeaders = document.querySelectorAll('.accordion-header'); // Obtiene referencia al elemento del DOM
            this.dom.btnLoadChallenges = document.querySelectorAll('[data-load-challenge]'); // Obtiene referencia al elemento del DOM
            this.dom.btnCopySummaryCheat = document.getElementById('btnCopySummaryCheat'); // Obtiene referencia al elemento del DOM

            // Modales & Toast
            this.dom.overviewModal = document.getElementById('overviewModal'); // Obtiene referencia al elemento del DOM
            this.dom.btnCloseOverview = document.getElementById('btnCloseOverview'); // Obtiene referencia al elemento del DOM
            this.dom.overviewGrid = document.getElementById('overviewGrid'); // Obtiene referencia al elemento del DOM
            this.dom.toastNotification = document.getElementById('toastNotification'); // Obtiene referencia al elemento del DOM
            this.dom.toastIcon = document.getElementById('toastIcon'); // Obtiene referencia al elemento del DOM
            this.dom.toastMsg = document.getElementById('toastMsg'); // Obtiene referencia al elemento del DOM

            // Copiar snippets
            this.dom.btnCopyCodes = document.querySelectorAll('.btn-copy-code'); // Obtiene referencia al elemento del DOM
        }

        bindEvents() {
            // Navegación
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.addEventListener('click', () => this.prevSlide()); // Evalúa condición lógica
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.addEventListener('click', () => this.nextSlide()); // Evalúa condición lógica
            if (this.dom.btnStartPresentation) this.dom.btnStartPresentation.addEventListener('click', () => this.goToSlide(2)); // Evalúa condición lógica
            if (this.dom.btnRestartPresentation) this.dom.btnRestartPresentation.addEventListener('click', () => this.goToSlide(1)); // Evalúa condición lógica

            this.dom.jumpLinks.forEach(link => {
                link.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const slideTarget = parseInt(e.currentTarget.getAttribute('data-jump'), 10); // Declara e inicializa variable local
                    if (slideTarget) this.goToSlide(slideTarget); // Evalúa condición lógica
                });
            });

            // Barra superior
            if (this.dom.btnToggleMode) this.dom.btnToggleMode.addEventListener('click', () => this.toggleViewMode()); // Evalúa condición lógica
            if (this.dom.btnToggleSound) this.dom.btnToggleSound.addEventListener('click', () => this.toggleSound()); // Evalúa condición lógica
            if (this.dom.btnOverview) this.dom.btnOverview.addEventListener('click', () => this.openOverview()); // Evalúa condición lógica
            if (this.dom.btnCloseOverview) this.dom.btnCloseOverview.addEventListener('click', () => this.closeOverview()); // Evalúa condición lógica
            if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen()); // Evalúa condición lógica

            // Teclado
            window.addEventListener('keydown', (e) => { // Registra escuchador de evento en el DOM
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') { // Evalúa condición lógica
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

            // Slide 2: Lector Texto
            if (this.dom.dropZoneText && this.dom.inputLocalText) { // Evalúa condición lógica
                this.dom.dropZoneText.addEventListener('click', () => this.dom.inputLocalText.click());
                this.dom.inputLocalText.addEventListener('change', (e) => this.handleLocalTextInput(e));
                this.setupDropZone(this.dom.dropZoneText, (file) => this.readTextFile(file));
            }
            if (this.dom.btnLoadDemoText) { // Evalúa condición lógica
                this.dom.btnLoadDemoText.addEventListener('click', () => this.loadDemoText());
            }

            // Slide 3: Lector Imagen DataURL
            if (this.dom.dropZoneImage && this.dom.inputLocalImage) { // Evalúa condición lógica
                this.dom.dropZoneImage.addEventListener('click', () => this.dom.inputLocalImage.click());
                this.dom.inputLocalImage.addEventListener('change', (e) => this.handleLocalImageInput(e));
                this.setupDropZone(this.dom.dropZoneImage, (file) => this.readImageFile(file));
            }
            if (this.dom.btnLoadDemoImage) { // Evalúa condición lógica
                this.dom.btnLoadDemoImage.addEventListener('click', () => this.loadDemoImage());
            }

            // Slide 4: Carga de Múltiples Archivos & Galería
            if (this.dom.btnSelectMultipleFiles && this.dom.inputMultipleFiles) { // Evalúa condición lógica
                this.dom.btnSelectMultipleFiles.addEventListener('click', () => this.dom.inputMultipleFiles.click());
                this.dom.inputMultipleFiles.addEventListener('change', (e) => this.handleMultipleFilesInput(e.target.files));
            }
            if (this.dom.btnLoadDemoMultiFiles) { // Evalúa condición lógica
                this.dom.btnLoadDemoMultiFiles.addEventListener('click', () => this.loadDemoMultiFiles());
            }
            if (this.dom.btnClearMultiFiles) { // Evalúa condición lógica
                this.dom.btnClearMultiFiles.addEventListener('click', () => this.clearMultiFiles());
            }
            if (this.dom.dropZoneMultiple) { // Evalúa condición lógica
                this.dom.dropZoneMultiple.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    if (this.dom.inputMultipleFiles) this.dom.inputMultipleFiles.click(); // Evalúa condición lógica
                });
                this.setupDropZone(this.dom.dropZoneMultiple, (singleFile, allFiles) => {
                    const files = allFiles && allFiles.length > 0 ? allFiles : [singleFile]; // Declara e inicializa variable local
                    this.handleMultipleFilesInput(files);
                });
            }
            if (this.dom.btnCloseMultiPreview) { // Evalúa condición lógica
                this.dom.btnCloseMultiPreview.addEventListener('click', () => this.closeMultiPreview());
            }
            if (this.dom.btnSelectMultipleImages && this.dom.inputMultipleGallery) { // Evalúa condición lógica
                this.dom.btnSelectMultipleImages.addEventListener('click', () => this.dom.inputMultipleGallery.click());
                this.dom.inputMultipleGallery.addEventListener('change', (e) => this.handleMultipleGalleryInput(e));
            }
            if (this.dom.btnLoadDemoGallery) { // Evalúa condición lógica
                this.dom.btnLoadDemoGallery.addEventListener('click', () => this.loadDemoGallery());
            }

            // Slide 5: Zona Drag & Drop Interactiva
            if (this.dom.interactiveMainDropZone) { // Evalúa condición lógica
                this.setupDropZone(this.dom.interactiveMainDropZone, (file) => this.handleMainDropFile(file));
            }

            // Slide 7: Progreso
            if (this.dom.btnStartProgressSim) { // Evalúa condición lógica
                this.dom.btnStartProgressSim.addEventListener('click', () => this.startProgressSimulation());
            }
            if (this.dom.btnAbortProgressSim) { // Evalúa condición lógica
                this.dom.btnAbortProgressSim.addEventListener('click', () => this.abortProgressSimulation());
            }

            // Slide 8: Analogías
            this.dom.toolButtons.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    this.dom.toolButtons.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    AppState.activeAnalogy = e.currentTarget.getAttribute('data-analogy');
                    this.renderAnalogies();
                    sound.click();
                });
            });

            // Slide 9: Playground
            if (this.dom.codePresetSelect) { // Evalúa condición lógica
                this.dom.codePresetSelect.addEventListener('change', (e) => this.loadCodePreset(e.target.value));
            }
            if (this.dom.btnResetCode) { // Evalúa condición lógica
                this.dom.btnResetCode.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    this.loadCodePreset(this.dom.codePresetSelect.value);
                    this.showToast('Código restaurado');
                });
            }
            if (this.dom.btnRunEditorCode) { // Evalúa condición lógica
                this.dom.btnRunEditorCode.addEventListener('click', () => this.runPlaygroundCode());
            }
            if (this.dom.btnClearConsole) { // Evalúa condición lógica
                this.dom.btnClearConsole.addEventListener('click', () => this.clearConsole());
            }

            // Slide 10: Retos
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

            this.dom.btnLoadChallenges.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const challengeKey = e.currentTarget.getAttribute('data-load-challenge'); // Declara e inicializa variable local
                    this.goToSlide(9);
                    if (this.dom.codePresetSelect) { // Evalúa condición lógica
                        this.dom.codePresetSelect.value = challengeKey;
                    }
                    this.loadCodePreset(challengeKey);
                    this.showToast('Solución cargada en el Playground', '✔');
                    sound.fileLoaded();
                });
            });

            if (this.dom.btnCopySummaryCheat) { // Evalúa condición lógica
                this.dom.btnCopySummaryCheat.addEventListener('click', () => this.copyCheatSheet());
            }

            // Botones de copia de snippets
            this.dom.btnCopyCodes.forEach(btn => {
                btn.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    const targetId = e.currentTarget.getAttribute('data-target'); // Declara e inicializa variable local
                    const targetEl = document.getElementById(targetId); // Declara e inicializa variable local
                    if (targetEl) { // Evalúa condición lógica
                        navigator.clipboard.writeText(targetEl.innerText).then(() => {
                            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
                            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000); // Actualiza contenido en el DOM
                            this.showToast('Snippet copiado al portapapeles');
                            sound.fileLoaded();
                        });
                    }
                });
            });
        }

        /* --------------------------------------------------------------------------
           Navegación de Diapositivas
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
                    slide.classList.add('active');
                }
            });

            const dots = document.querySelectorAll('.slide-dot'); // Declara e inicializa variable local
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx + 1 === AppState.currentSlide);
            });

            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.disabled = AppState.currentSlide === 1; // Evalúa condición lógica
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.disabled = AppState.currentSlide === AppState.totalSlides; // Evalúa condición lógica

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        toggleViewMode() {
            if (AppState.viewMode === 'slides') { // Evalúa condición lógica
                AppState.viewMode = 'guide';
                this.dom.body.classList.remove('mode-presentation');
                this.dom.body.classList.add('mode-document');
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Slides'; // Evalúa condición lógica
                this.showToast('Activado Modo Documento Continuo');
            } else {
                AppState.viewMode = 'slides';
                this.dom.body.classList.remove('mode-document');
                this.dom.body.classList.add('mode-presentation');
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
                '1. Inicio: FileReader API',
                '2. Lectura Textual: readAsText()',
                '3. Codificación Base64: readAsDataURL()',
                '4. Carga de Varios Archivos & Galería',
                '5. Integración con Drag & Drop',
                '6. Arquitectura y Ciclo de Eventos',
                '7. Laboratorio de Progreso en Vivo',
                '8. Analogías del Mundo Real',
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

        setupDropZone(element, onFileDropCallback) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
                element.addEventListener(evt, (e) => e.preventDefault());
            });

            element.addEventListener('dragenter', () => element.classList.add('dragover'));
            element.addEventListener('dragover', () => element.classList.add('dragover'));
            element.addEventListener('dragleave', () => element.classList.remove('dragover'));

            element.addEventListener('drop', (e) => { // Registra escuchador de evento en el DOM
                element.classList.remove('dragover');
                const file = e.dataTransfer.files[0]; // Declara e inicializa variable local
                if (file && onFileDropCallback) { // Evalúa condición lógica
                    onFileDropCallback(file, e.dataTransfer.files);
                }
            });
        }

        /* --------------------------------------------------------------------------
           SLIDE 2: LECTURA DE TEXTO CON READASTEXT
           -------------------------------------------------------------------------- */
        initSlideText() {}

        handleLocalTextInput(e) {
            const file = e.target.files[0]; // Declara e inicializa variable local
            if (file) this.readTextFile(file); // Evalúa condición lógica
        }

        readTextFile(file) {
            sound.click();
            if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = `Leyendo "${file.name}"...`; // Evalúa condición lógica

            const reader = new FileReader(); // Declara e inicializa variable local
            reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                if (this.dom.textViewerResult) { // Evalúa condición lógica
                    this.dom.textViewerResult.textContent = reader.result; // Actualiza contenido en el DOM
                }
                if (this.dom.textReadStatus) { // Evalúa condición lógica
                    this.dom.textReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB) cargado`; // Actualiza contenido en el DOM
                }
                sound.fileLoaded();
                this.showToast(`Archivo "${file.name}" leído como texto`);
            });

            reader.addEventListener('error', () => { // Registra escuchador de evento en el DOM
                if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = '❌ Error al leer archivo'; // Evalúa condición lógica
                sound.error();
            });

            reader.readAsText(file, 'UTF-8');
        }

        loadDemoText() {
            sound.click();
            if (this.dom.textViewerResult) { // Evalúa condición lógica
                this.dom.textViewerResult.textContent = AppState.demos.text; // Actualiza contenido en el DOM
            }
            if (this.dom.textReadStatus) { // Evalúa condición lógica
                this.dom.textReadStatus.textContent = '✅ Documento demo (config.json) cargado'; // Actualiza contenido en el DOM
            }
            sound.fileLoaded();
            this.showToast('Documento JSON demo cargado');
        }

        /* --------------------------------------------------------------------------
           SLIDE 3: PREVISUALIZACIÓN DE IMÁGENES CON READDATAURL
           -------------------------------------------------------------------------- */
        initSlideImage() {}

        handleLocalImageInput(e) {
            const file = e.target.files[0]; // Declara e inicializa variable local
            if (file) this.readImageFile(file); // Evalúa condición lógica
        }

        readImageFile(file) {
            if (!file.type.startsWith('image/')) { // Evalúa condición lógica
                this.showToast('El archivo debe ser una imagen válida', '⚠️');
                sound.error();
                return; // Retorna el resultado de la función
            }

            sound.click();
            if (this.dom.imageReadStatus) this.dom.imageReadStatus.textContent = `Procesando "${file.name}"...`; // Evalúa condición lógica

            const reader = new FileReader(); // Declara e inicializa variable local
            reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none'; // Evalúa condición lógica
                if (this.dom.imagePreviewElement) { // Evalúa condición lógica
                    this.dom.imagePreviewElement.style.display = 'block';
                    this.dom.imagePreviewElement.src = reader.result;
                }
                if (this.dom.imageReadStatus) { // Evalúa condición lógica
                    this.dom.imageReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`; // Actualiza contenido en el DOM
                }
                sound.fileLoaded();
                this.showToast('Imagen convertida a Data URL (Base64)');
            });

            reader.readAsDataURL(file);
        }

        loadDemoImage() {
            sound.click();
            if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none'; // Evalúa condición lógica
            if (this.dom.imagePreviewElement) { // Evalúa condición lógica
                this.dom.imagePreviewElement.style.display = 'block';
                this.dom.imagePreviewElement.src = AppState.demos.imageSvg;
            }
            if (this.dom.imageReadStatus) { // Evalúa condición lógica
                this.dom.imageReadStatus.textContent = '✅ Imagen vectorial Demo (DataURL) cargada'; // Actualiza contenido en el DOM
            }
            sound.fileLoaded();
            this.showToast('Imagen vectorial demo cargada');
        }

        /* --------------------------------------------------------------------------
           SLIDE 4: CARGA DE MÚLTIPLES ARCHIVOS & GALERÍA MULTIARCHIVO
           -------------------------------------------------------------------------- */
        initSlideGallery() {}

        handleMultipleFilesInput(fileList) {
            const files = Array.from(fileList || []); // Declara e inicializa variable local
            if (!files.length) return; // Evalúa condición lógica

            sound.click();
            if (this.dom.multiFilesListContainer) { // Evalúa condición lógica
                this.dom.multiFilesListContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }

            let totalBytes = 0; // Declara e inicializa variable local
            let loadedCount = 0; // Declara e inicializa variable local

            files.forEach(file => {
                totalBytes += file.size;

                // Detección inteligente de tipo para seleccionar el método FileReader óptimo
                const isImage = file.type.startsWith('image/'); // Declara e inicializa variable local
                const isText = file.type.startsWith('text/') ||
                               file.type.includes('json') ||
                               file.type.includes('csv') ||
                               file.type.includes('xml') ||
                               /\.(txt|json|csv|md|js|ts|html|css|py|sql)$/i.test(file.name);

                let method = 'readAsArrayBuffer'; // Declara e inicializa variable local
                let methodClass = 'badge-method-buffer'; // Declara e inicializa variable local
                let icon = '📦'; // Declara e inicializa variable local

                if (isImage) { // Evalúa condición lógica
                    method = 'readAsDataURL';
                    methodClass = 'badge-method-dataurl';
                    icon = '🖼️';
                } else if (isText) {
                    method = 'readAsText';
                    methodClass = 'badge-method-text';
                    if (file.name.endsWith('.json')) icon = '📊'; // Evalúa condición lógica
                    else if (file.name.endsWith('.csv')) icon = '📈'; // Evalúa condición alternativa
                    else icon = '📄'; // Rama alternativa
                }

                // REGLA CLAVE: Instanciamos un FileReader único e independiente por cada archivo
                const reader = new FileReader(); // Declara e inicializa variable local

                reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                    loadedCount++;
                    const sizeStr = (file.size / 1024).toFixed(1) + ' KB'; // Declara e inicializa variable local
                    this.renderMultiFileCard({
                        name: file.name,
                        sizeStr: sizeStr,
                        type: file.type || 'desconocido',
                        icon: icon,
                        method: method,
                        methodClass: methodClass,
                        content: reader.result
                    });

                    if (loadedCount === files.length) { // Evalúa condición lógica
                        sound.fileLoaded();
                        this.showToast(`¡Lote de ${files.length} archivos procesado con éxito!`);
                    }
                });

                reader.addEventListener('error', () => { // Registra escuchador de evento en el DOM
                    console.error(`Error leyendo ${file.name}`); // Imprime salida en consola
                });

                // Ejecutamos el método según corresponda
                if (isImage) { // Evalúa condición lógica
                    reader.readAsDataURL(file);
                } else if (isText) {
                    reader.readAsText(file, 'UTF-8');
                } else {
                    reader.readAsArrayBuffer(file);
                }
            });

            this.updateMultiFilesStats(files.length, totalBytes);
        }

        loadDemoMultiFiles() {
            sound.click();
            if (this.dom.multiFilesListContainer) { // Evalúa condición lógica
                this.dom.multiFilesListContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }

            let totalBytes = 0; // Declara e inicializa variable local
            AppState.demos.multiFiles.forEach(item => {
                totalBytes += item.size;
                const sizeStr = (item.size / 1024).toFixed(1) + ' KB'; // Declara e inicializa variable local
                const methodClass = item.method === 'readAsDataURL' ? 'badge-method-dataurl' : 'badge-method-text'; // Declara e inicializa variable local
                this.renderMultiFileCard({
                    name: item.name,
                    sizeStr: sizeStr,
                    type: item.type,
                    icon: item.icon,
                    method: item.method,
                    methodClass: methodClass,
                    content: item.content
                });
            });

            this.updateMultiFilesStats(AppState.demos.multiFiles.length, totalBytes);
            sound.fileLoaded();
            this.showToast(`Lote Demo de ${AppState.demos.multiFiles.length} archivos mixtos cargado`);
        }

        clearMultiFiles() {
            sound.click();
            if (this.dom.multiFilesListContainer) { // Evalúa condición lógica
                this.dom.multiFilesListContainer.innerHTML = `
                    <div style="text-align: center; color: var(--text-dim); padding: 1.2rem; font-size: 0.85rem;">
                        Pulsa <strong>"📁 Cargar Varios Archivos"</strong>, <strong>"⚡ Lote Demo Multiarchivo"</strong> o arrastra archivos arriba para procesarlos en paralelo...
                    </div>
                `;
            }
            if (this.dom.galleryGridContainer) { // Evalúa condición lógica
                this.dom.galleryGridContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }
            if (this.dom.inputMultipleFiles) this.dom.inputMultipleFiles.value = ''; // Evalúa condición lógica
            if (this.dom.inputMultipleGallery) this.dom.inputMultipleGallery.value = ''; // Evalúa condición lógica
            this.updateMultiFilesStats(0, 0);
            this.closeMultiPreview();
            this.showToast('Lista de archivos limpiada');
        }

        renderMultiFileCard(info) {
            if (!this.dom.multiFilesListContainer) return; // Evalúa condición lógica

            const card = document.createElement('div'); // Declara e inicializa variable local
            card.className = 'multifile-card-item';
            card.innerHTML = `
                <div class="multifile-item-left">
                    <span class="multifile-item-icon">${info.icon}</span>
                    <div class="multifile-item-info">
                        <div class="multifile-item-name" title="${info.name}">${info.name}</div>
                        <div class="multifile-item-meta">${info.sizeStr} • ${info.type}</div>
                    </div>
                </div>
                <div class="multifile-item-right">
                    <span class="badge-method ${info.methodClass}">${info.method}()</span>
                    <button class="btn-inspect-file">👁️ Inspeccionar</button>
                </div>
            `;

            const btnInspect = card.querySelector('.btn-inspect-file'); // Declara e inicializa variable local
            btnInspect.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                e.stopPropagation();
                this.previewMultiFile(info.name, info.type, info.content, info.method);
            });

            this.dom.multiFilesListContainer.appendChild(card);
        }

        previewMultiFile(name, type, content, method) {
            sound.click();
            if (!this.dom.multiFilePreviewBox || !this.dom.multiFilePreviewBody) return; // Evalúa condición lógica

            if (this.dom.multiFilePreviewTitle) { // Evalúa condición lógica
                this.dom.multiFilePreviewTitle.textContent = `👁️ Inspeccionando: ${name} (${method})`; // Actualiza contenido en el DOM
            }

            this.dom.multiFilePreviewBody.innerHTML = ''; // Actualiza contenido en el DOM

            if (method === 'readAsDataURL') { // Evalúa condición lógica
                const img = document.createElement('img'); // Declara e inicializa variable local
                img.src = content;
                img.alt = name;
                this.dom.multiFilePreviewBody.appendChild(img);
            } else if (method === 'readAsText') {
                const pre = document.createElement('pre'); // Declara e inicializa variable local
                pre.style.margin = '0';
                pre.textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2); // Actualiza contenido en el DOM
                this.dom.multiFilePreviewBody.appendChild(pre);
            } else {
                this.dom.multiFilePreviewBody.textContent = `[Búfer binario en memoria: ${content ? (content.byteLength || content.length || 0) : 0} bytes crudos cargados]`; // Actualiza contenido en el DOM
            }

            this.dom.multiFilePreviewBox.classList.add('active');
            this.dom.multiFilePreviewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        closeMultiPreview() {
            if (this.dom.multiFilePreviewBox) { // Evalúa condición lógica
                this.dom.multiFilePreviewBox.classList.remove('active');
            }
        }

        updateMultiFilesStats(count, totalBytes) {
            if (this.dom.multiFilesCount) { // Evalúa condición lógica
                this.dom.multiFilesCount.textContent = count; // Actualiza contenido en el DOM
            }
            if (this.dom.multiFilesTotalSize) { // Evalúa condición lógica
                const formatted = totalBytes >= 1048576
                    ? (totalBytes / 1048576).toFixed(2) + ' MB'
                    : (totalBytes / 1024).toFixed(1) + ' KB';
                this.dom.multiFilesTotalSize.textContent = formatted; // Actualiza contenido en el DOM
            }
        }

        handleMultipleGalleryInput(e) {
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); // Declara e inicializa variable local
            if (!files.length) return; // Evalúa condición lógica

            sound.click();
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = ''; // Evalúa condición lógica
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = `${files.length} imágenes`; // Evalúa condición lógica

            files.forEach(file => {
                const reader = new FileReader(); // Declara e inicializa variable local
                reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                    this.renderGalleryCard(reader.result, file.name, (file.size / 1024).toFixed(1) + ' KB');
                });
                reader.readAsDataURL(file);
            });

            sound.fileLoaded();
            this.showToast(`${files.length} imágenes procesadas en paralelo`);
        }

        loadDemoGallery() {
            sound.click();
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = ''; // Evalúa condición lógica
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = '4 imágenes demo'; // Evalúa condición lógica

            AppState.demos.gallery.forEach(item => {
                const svgCard = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%230f172a"/><circle cx="100" cy="75" r="40" fill="${encodeURIComponent(item.color)}"/><text x="100" y="85" text-anchor="middle" font-size="32">${item.icon}</text></svg>`;
                this.renderGalleryCard(svgCard, item.name, item.size);
            });

            sound.fileLoaded();
            this.showToast('Galería demo cargada con 4 miniaturas');
        }

        renderGalleryCard(dataUrl, name, sizeStr) {
            if (!this.dom.galleryGridContainer) return; // Evalúa condición lógica
            const fig = document.createElement('figure'); // Declara e inicializa variable local
            fig.className = 'tarjeta-miniatura';
            fig.innerHTML = `
                <img src="${dataUrl}" alt="${name}">
                <figcaption title="${name} (${sizeStr})">${name} (${sizeStr})</figcaption>
            `;
            this.dom.galleryGridContainer.appendChild(fig);
        }

        /* --------------------------------------------------------------------------
           SLIDE 5: ZONA DRAG & DROP INTERACTIVA
           -------------------------------------------------------------------------- */
        initSlideDropZone() {}

        handleMainDropFile(file) {
            sound.click();
            const out = this.dom.dropZoneResultBox; // Declara e inicializa variable local
            if (!out) return; // Evalúa condición lógica

            const isImg = file.type.startsWith('image/'); // Declara e inicializa variable local
            const reader = new FileReader(); // Declara e inicializa variable local

            out.innerHTML = `
                <div style="font-family: var(--font-mono); font-size: 0.84rem; line-height: 1.6;">
                    <div>📂 <strong>Archivo detectado:</strong> ${file.name}</div>
                    <div>⚖️ <strong>Tamaño:</strong> ${(file.size / 1024).toFixed(2)} KB</div>
                    <div>🏷️ <strong>Tipo MIME:</strong> ${file.type || 'Desconocido'}</div>
                    <div style="color: var(--cyan); margin-top: 0.35rem;">⏳ Procesando contenido con FileReader...</div>
                </div>
            `;

            if (isImg) { // Evalúa condición lógica
                reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                    out.innerHTML += `
                        <div style="margin-top: 0.75rem;">
                            <span class="badge badge-emerald">Previsualización de Imagen</span><br/>
                            <img src="${reader.result}" style="max-height: 110px; border-radius: 6px; margin-top: 0.5rem; border: 1px solid var(--border-subtle);" alt="${file.name}">
                        </div>
                    `;
                    sound.fileLoaded();
                });
                reader.readAsDataURL(file);
            } else {
                reader.addEventListener('load', () => { // Registra escuchador de evento en el DOM
                    const firstLines = reader.result.split('\n').slice(0, 4).join('\n'); // Declara e inicializa variable local
                    out.innerHTML += `
                        <div style="margin-top: 0.75rem;">
                            <span class="badge badge-purple">Primeras Líneas de Texto</span>
                            <pre style="background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 4px; font-size: 0.78rem; margin-top: 0.4rem; color: var(--cyan);">${firstLines}</pre>
                        </div>
                    `;
                    sound.fileLoaded();
                });
                reader.readAsText(file, 'UTF-8');
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 7: SIMULADOR DE BARRA DE PROGRESO
           -------------------------------------------------------------------------- */
        initSlideProgress() {}

        startProgressSimulation() {
            const p = AppState.progressSim; // Declara e inicializa variable local
            if (p.isRunning) return; // Evalúa condición lógica

            sound.click();
            p.isRunning = true;
            p.loaded = 0;

            if (this.dom.progressEventLogBox) { // Evalúa condición lógica
                this.dom.progressEventLogBox.innerHTML = `
                    <div style="color: var(--cyan); font-family: var(--font-mono); font-size: 0.85rem;">
                        🔔 [Evento loadstart] La lectura de 8,192 KB ha comenzado...
                    </div>
                `;
            }

            clearInterval(p.timer);
            const stepBytes = 384 * 1024; // ~384 KB por pulso

            p.timer = setInterval(() => {
                p.loaded += stepBytes;
                if (p.loaded >= p.total) { // Evalúa condición lógica
                    p.loaded = p.total;
                    clearInterval(p.timer);
                    p.isRunning = false;
                    this.updateProgressUI(100, p.loaded, p.total);

                    if (this.dom.progressEventLogBox) { // Evalúa condición lógica
                        this.dom.progressEventLogBox.innerHTML += `
                            <div style="color: var(--emerald); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.35rem;">
                                ✅ [Evento load] ¡Lectura completada al 100%!
                            </div>
                            <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
                                🏁 [Evento loadend] Conclusión formal del ciclo de vida.
                            </div>
                        `;
                    }
                    sound.fileLoaded();
                    this.showToast('Simulación de lectura completada con éxito');
                } else {
                    const pct = Math.round((p.loaded / p.total) * 100); // Declara e inicializa variable local
                    this.updateProgressUI(pct, p.loaded, p.total);
                    sound.playTone(300 + pct * 5, 'sine', 0.03, 0.02);
                }
            }, 120);
        }

        abortProgressSimulation() {
            const p = AppState.progressSim; // Declara e inicializa variable local
            if (!p.isRunning) return; // Evalúa condición lógica

            clearInterval(p.timer);
            p.isRunning = false;

            if (this.dom.progressEventLogBox) { // Evalúa condición lógica
                this.dom.progressEventLogBox.innerHTML += `
                    <div style="color: var(--rose); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.35rem;">
                        🛑 [Evento abort] Operación cancelada por el usuario con reader.abort().
                    </div>
                    <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
                        🏁 [Evento loadend] Ciclo finalizado anticipadamente.
                    </div>
                `;
            }

            sound.error();
            this.showToast('Lectura cancelada con abort()', '🛑');
        }

        updateProgressUI(pct, loaded, total) {
            if (this.dom.fileProgressBarFill) this.dom.fileProgressBarFill.style.width = `${pct}%`; // Evalúa condición lógica
            if (this.dom.progressPercentLabel) this.dom.progressPercentLabel.textContent = `${pct}%`; // Evalúa condición lógica
            if (this.dom.progressBytesLoaded) { // Evalúa condición lógica
                this.dom.progressBytesLoaded.textContent = `${(loaded / 1024).toFixed(0)} KB leídos`; // Actualiza contenido en el DOM
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 8: ANALOGÍAS VISUALES
           -------------------------------------------------------------------------- */
        initAnalogies() {
            this.renderAnalogies();
        }

        renderAnalogies() {
            const mode = AppState.activeAnalogy; // Declara e inicializa variable local
            if (mode === 'traductor') { // Evalúa condición lógica
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '🎙️'; // Evalúa condición lógica
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'readAsText()'; // Evalúa condición lógica
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'Traducción directa a lenguaje humano'; // Evalúa condición lógica
                if (this.dom.analogyItemsLeft) { // Evalúa condición lógica
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">El traductor lee una carta y te dicta las palabras en español</div>
                        <div class="ws-item">El resultado es una cadena de texto lista para ser leída y comprendida</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Ideal para archivos de configuración, notas y código'; // Evalúa condición lógica

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🖼️'; // Evalúa condición lógica
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'readAsDataURL()'; // Evalúa condición lógica
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'Telegrama en código Morse (Base64)'; // Evalúa condición lógica
                if (this.dom.analogyItemsRight) { // Evalúa condición lógica
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Codifica cada pixel en una sola línea continua de caracteres</div>
                        <div class="ws-item highlight-item">No está hecho para personas, sino para que el navegador lo pinte</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Ideal para atributos src en imágenes y miniaturas'; // Evalúa condición lógica

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Comparativa'; // Evalúa condición lógica
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🎙️'; // Evalúa condición lógica
                if (this.dom.analogyBannerText) { // Evalúa condición lógica
                    this.dom.analogyBannerText.innerHTML = '<strong>readAsText vs readAsDataURL:</strong> Usa <code>readAsText()</code> cuando necesites procesar texto, editar líneas o parsear JSON; usa <code>readAsDataURL()</code> para renderizar recursos visuales sin tocar el backend.'; // Actualiza contenido en el DOM
                }
            } else {
                // Báscula de Granos
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '⚖️'; // Evalúa condición lógica
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'Evento progress'; // Evalúa condición lógica
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'La báscula de pesaje en tiempo real'; // Evalúa condición lógica
                if (this.dom.analogyItemsLeft) { // Evalúa condición lógica
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">Mide tonelada por tonelada mientras el grano cae al silo</div>
                        <div class="ws-item">Calcula con precisión milimétrica el porcentaje de avance</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Permite actualizar barras de carga para feedback fluido'; // Evalúa condición lógica

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🏁'; // Evalúa condición lógica
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'Evento loadend'; // Evalúa condición lógica
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'El pitido final de cierre de compuerta'; // Evalúa condición lógica
                if (this.dom.analogyItemsRight) { // Evalúa condición lógica
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Se dispara siempre: con éxito, error o cancelación</div>
                        <div class="ws-item highlight-item">Garantiza que la tolva quede desocupada para el siguiente ciclo</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Lugar obligatorio para ocultar spinners y habilitar botones'; // Evalúa condición lógica

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Ciclo de Vida'; // Evalúa condición lógica
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🚚'; // Evalúa condición lógica
                if (this.dom.analogyBannerText) { // Evalúa condición lógica
                    this.dom.analogyBannerText.innerHTML = '<strong>progress & loadend:</strong> Mantén informados a tus usuarios en archivos pesados calculando <code>(loaded / total) * 100</code> y aprovecha <code>loadend</code> para cerrar modales pase lo que pase.'; // Actualiza contenido en el DOM
                }
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 9: PLAYGROUND INTERACTIVO
           -------------------------------------------------------------------------- */
        loadCodePreset(presetKey) {
            const code = CodePresets[presetKey]; // Declara e inicializa variable local
            if (code && this.dom.liveCodeEditor) { // Evalúa condición lógica
                this.dom.liveCodeEditor.value = code;
                this.clearConsole();
                this.printToConsole(`/* Preset cargado: [${presetKey}]. Haz clic en "Ejecutar Código" (Ctrl + Enter) */`, 'info-line');
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
                this.printToConsole('--- Ejecución asíncrona despachada sin errores sintácticos ---', 'info-line');
                sound.fileLoaded();
            } catch (err) {
                this.printToConsole(`Error de ejecución: ${err.name} - ${err.message}`, 'error-line');
                sound.error();
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
            const markdown = `# 📜 CHULETA RÁPIDA: FILEREADER API EN JAVASCRIPT

## 1. Métodos de Lectura Asíncrona
- \`reader.readAsText(blob[, encoding])\`: Lee archivos de texto plano (.txt, .json, .csv, .md) y devuelve una cadena UTF-8 en \`reader.result\`.
- \`reader.readAsDataURL(blob)\`: Convierte el archivo binario en una URI Base64 (\`data:[mediatype];base64,...\`), ideal para \`img.src\`.
- \`reader.readAsArrayBuffer(blob)\`: Devuelve un buffer de bajo nivel (\`ArrayBuffer\`) para operaciones con TypedArrays.
- \`reader.abort()\`: Interrumpe la operación de lectura en curso.

## 2. Ciclo de Vida de Eventos
1. \`loadstart\`: Comienza la lectura del archivo.
2. \`progress\`: Se dispara periódicamente. Permite calcular el porcentaje con \`(e.loaded / e.total) * 100\` cuando \`e.lengthComputable\` es true.
3. \`load\`: La lectura finalizó satisfactoriamente. Los datos están listos en \`reader.result\`.
4. \`error\`: Ocurrió un problema de lectura. El detalle reside en \`reader.error\`.
5. \`abort\`: La lectura fue cancelada programáticamente con \`reader.abort()\`.
6. \`loadend\`: Conclusión formal absoluta del ciclo (siempre se dispara al final).

## 3. Integración con Drag & Drop
- Extrae los archivos desde \`e.dataTransfer.files\`.
- **Obligatorio:** Invocar \`e.preventDefault()\` en los eventos \`dragover\` y \`drop\` para evitar que el navegador abra el archivo en una pestaña nueva.

## 4. Regla de Oro
- **Una instancia por archivo:** Jamás intentes reutilizar la misma instancia de \`FileReader\` simultáneamente para leer varios archivos; de lo contrario se producirá un error \`InvalidStateError\`.
`;

            navigator.clipboard.writeText(markdown).then(() => {
                this.showToast('¡Chuleta copiada al portapapeles!');
                sound.fileLoaded();
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

