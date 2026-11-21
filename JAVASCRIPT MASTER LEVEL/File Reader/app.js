/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: FILEREADER API
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL, SIMULADORES DE LECTURA, DRAG & DROP Y PLAYGROUND
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

        // Demos integradas para cuando el usuario no sube archivos locales
        demos: { // Instrucción JavaScript
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
                { // Instrucción JavaScript
                    name: 'usuarios_registrados.json',
                    type: 'application/json',
                    size: 1540,
                    method: 'readAsText',
                    icon: '📊',
                    content: '{\n  "total": 3,\n  "usuarios": [\n    {"id": 1, "nombre": "Carlos Gómez", "rol": "Admin"},\n    {"id": 2, "nombre": "Laura Ruiz", "rol": "Desarrollador"},\n    {"id": 3, "nombre": "Mateo Vega", "rol": "Diseñador UI"}\n  ]\n}'
                },
                { // Instrucción JavaScript
                    name: 'reporte_ventas_2026.csv',
                    type: 'text/csv',
                    size: 890,
                    method: 'readAsText',
                    icon: '📈',
                    content: 'id,mes,ventas_usd,nuevos_alumnos\n1,Enero,18450,142\n2,Febrero,22300,185\n3,Marzo,19800,160'
                },
                { // Instrucción JavaScript
                    name: 'notas_arquitectura.md',
                    type: 'text/markdown',
                    size: 720,
                    method: 'readAsText',
                    icon: '📄',
                    content: '# Arquitectura de Procesamiento en Cliente\n\n- **Zero Server Overhead**: La lectura ocurre 100% en RAM local.\n- **Concurrencia Segura**: Un objeto FileReader dedicado por archivo.\n- **Detección MIME**: Bifurcación entre readAsText y readAsDataURL.'
                },
                { // Instrucción JavaScript
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
        progressSim: { // Instrucción JavaScript
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

        playTone(freq, type = 'sine', duration = 0.09, volume = 0.05) { // Instrucción JavaScript
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
            } catch (e) {}
        }

        nav() { // Instrucción JavaScript
            this.playTone(480, 'sine', 0.07, 0.04); // Ejecuta llamada o método
        }

        click() { // Instrucción JavaScript
            this.playTone(620, 'triangle', 0.06, 0.05); // Ejecuta llamada o método
        }

        fileLoaded() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.playTone(523.25, 'sine', 0.08, 0.05); // Ejecuta llamada o método
            setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.05), 70); // Ejecuta llamada o método
            setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 140); // Ejecuta llamada o método
        }

        error() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.playTone(320, 'sawtooth', 0.12, 0.06); // Ejecuta llamada o método
            setTimeout(() => this.playTone(240, 'sawtooth', 0.15, 0.06), 90); // Ejecuta llamada o método
        }
    }

    const sound = new SoundEngine(); // Declara e inicializa "sound"

    /* ==========================================================================
       3. PRESETS DE CÓDIGO EDITABLE PARA EL PLAYGROUND (Slide 9 & Retos)
       ========================================================================== */
    const CodePresets = { // Declara e inicializa "CodePresets"
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
            this.initSlideText(); // Ejecuta llamada o método
            this.initSlideImage(); // Ejecuta llamada o método
            this.initSlideGallery(); // Ejecuta llamada o método
            this.initSlideDropZone(); // Ejecuta llamada o método
            this.initSlideProgress(); // Ejecuta llamada o método
            this.initAnalogies(); // Ejecuta llamada o método
            this.loadCodePreset('preset-file-1'); // Ejecuta llamada o método
        }

        cacheDom() { // Instrucción JavaScript
            this.dom.body = document.body; // Asigna valor
            this.dom.slides = document.querySelectorAll('.slide'); // Asigna valor

            // Navegación
            this.dom.progressBar = document.getElementById('progressBar'); // Asigna valor
            this.dom.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor
            this.dom.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.dom.modeIcon = document.getElementById('modeIcon'); // Asigna valor
            this.dom.modeText = document.getElementById('modeText'); // Asigna valor
            this.dom.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.dom.soundIcon = document.getElementById('soundIcon'); // Asigna valor
            this.dom.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.dom.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor
            this.dom.btnPrevSlide = document.getElementById('btnPrevSlide'); // Asigna valor
            this.dom.btnNextSlide = document.getElementById('btnNextSlide'); // Asigna valor
            this.dom.slideDotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor
            this.dom.btnStartPresentation = document.getElementById('btnStartPresentation'); // Asigna valor
            this.dom.btnRestartPresentation = document.getElementById('btnRestartPresentation'); // Asigna valor
            this.dom.jumpLinks = document.querySelectorAll('[data-jump]'); // Asigna valor

            // Slide 2: Lector Texto
            this.dom.dropZoneText = document.getElementById('dropZoneText'); // Asigna valor
            this.dom.inputLocalText = document.getElementById('inputLocalText'); // Asigna valor
            this.dom.btnLoadDemoText = document.getElementById('btnLoadDemoText'); // Asigna valor
            this.dom.textReadStatus = document.getElementById('textReadStatus'); // Asigna valor
            this.dom.textViewerResult = document.getElementById('textViewerResult'); // Asigna valor

            // Slide 3: Lector Imagen DataURL
            this.dom.dropZoneImage = document.getElementById('dropZoneImage'); // Asigna valor
            this.dom.inputLocalImage = document.getElementById('inputLocalImage'); // Asigna valor
            this.dom.btnLoadDemoImage = document.getElementById('btnLoadDemoImage'); // Asigna valor
            this.dom.imageReadStatus = document.getElementById('imageReadStatus'); // Asigna valor
            this.dom.imagePreviewContainer = document.getElementById('imagePreviewContainer'); // Asigna valor
            this.dom.imagePreviewPlaceholder = document.getElementById('imagePreviewPlaceholder'); // Asigna valor
            this.dom.imagePreviewElement = document.getElementById('imagePreviewElement'); // Asigna valor

            // Slide 4: Carga de Múltiples Archivos & Galería
            this.dom.btnSelectMultipleFiles = document.getElementById('btnSelectMultipleFiles'); // Asigna valor
            this.dom.btnLoadDemoMultiFiles = document.getElementById('btnLoadDemoMultiFiles'); // Asigna valor
            this.dom.btnClearMultiFiles = document.getElementById('btnClearMultiFiles'); // Asigna valor
            this.dom.inputMultipleFiles = document.getElementById('inputMultipleFiles'); // Asigna valor
            this.dom.dropZoneMultiple = document.getElementById('dropZoneMultiple'); // Asigna valor
            this.dom.multiFilesStatsBar = document.getElementById('multiFilesStatsBar'); // Asigna valor
            this.dom.multiFilesCount = document.getElementById('multiFilesCount'); // Asigna valor
            this.dom.multiFilesTotalSize = document.getElementById('multiFilesTotalSize'); // Asigna valor
            this.dom.multiFilesListContainer = document.getElementById('multiFilesListContainer'); // Asigna valor
            this.dom.multiFilePreviewBox = document.getElementById('multiFilePreviewBox'); // Asigna valor
            this.dom.multiFilePreviewTitle = document.getElementById('multiFilePreviewTitle'); // Asigna valor
            this.dom.multiFilePreviewBody = document.getElementById('multiFilePreviewBody'); // Asigna valor
            this.dom.btnCloseMultiPreview = document.getElementById('btnCloseMultiPreview'); // Asigna valor

            this.dom.btnSelectMultipleImages = document.getElementById('btnSelectMultipleImages'); // Asigna valor
            this.dom.btnLoadDemoGallery = document.getElementById('btnLoadDemoGallery'); // Asigna valor
            this.dom.inputMultipleGallery = document.getElementById('inputMultipleGallery'); // Asigna valor
            this.dom.galleryCountStatus = document.getElementById('galleryCountStatus'); // Asigna valor
            this.dom.galleryGridContainer = document.getElementById('galleryGridContainer'); // Asigna valor

            // Slide 5: Zona Drag & Drop
            this.dom.interactiveMainDropZone = document.getElementById('interactiveMainDropZone'); // Asigna valor
            this.dom.dropZoneResultBox = document.getElementById('dropZoneResultBox'); // Asigna valor

            // Slide 7: Progreso
            this.dom.btnStartProgressSim = document.getElementById('btnStartProgressSim'); // Asigna valor
            this.dom.btnAbortProgressSim = document.getElementById('btnAbortProgressSim'); // Asigna valor
            this.dom.fileProgressBarFill = document.getElementById('fileProgressBarFill'); // Asigna valor
            this.dom.progressPercentLabel = document.getElementById('progressPercentLabel'); // Asigna valor
            this.dom.progressBytesLoaded = document.getElementById('progressBytesLoaded'); // Asigna valor
            this.dom.progressBytesTotal = document.getElementById('progressBytesTotal'); // Asigna valor
            this.dom.progressEventLogBox = document.getElementById('progressEventLogBox'); // Asigna valor

            // Slide 8: Analogías
            this.dom.toolButtons = document.querySelectorAll('.tool-btn'); // Asigna valor
            this.dom.analogyAvatarLeft = document.getElementById('analogyAvatarLeft'); // Asigna valor
            this.dom.analogyTitleLeft = document.getElementById('analogyTitleLeft'); // Asigna valor
            this.dom.analogySubLeft = document.getElementById('analogySubLeft'); // Asigna valor
            this.dom.analogyItemsLeft = document.getElementById('analogyItemsLeft'); // Asigna valor
            this.dom.analogyStatusLeft = document.getElementById('analogyStatusLeft'); // Asigna valor

            this.dom.analogyAvatarRight = document.getElementById('analogyAvatarRight'); // Asigna valor
            this.dom.analogyTitleRight = document.getElementById('analogyTitleRight'); // Asigna valor
            this.dom.analogySubRight = document.getElementById('analogySubRight'); // Asigna valor
            this.dom.analogyItemsRight = document.getElementById('analogyItemsRight'); // Asigna valor
            this.dom.analogyStatusRight = document.getElementById('analogyStatusRight'); // Asigna valor

            this.dom.analogyArrowLabel = document.getElementById('analogyArrowLabel'); // Asigna valor
            this.dom.analogyBannerIcon = document.getElementById('analogyBannerIcon'); // Asigna valor
            this.dom.analogyBannerText = document.getElementById('analogyBannerText'); // Asigna valor

            // Slide 9: Playground
            this.dom.codePresetSelect = document.getElementById('codePresetSelect'); // Asigna valor
            this.dom.liveCodeEditor = document.getElementById('liveCodeEditor'); // Asigna valor
            this.dom.btnResetCode = document.getElementById('btnResetCode'); // Asigna valor
            this.dom.btnRunEditorCode = document.getElementById('btnRunEditorCode'); // Asigna valor
            this.dom.btnClearConsole = document.getElementById('btnClearConsole'); // Asigna valor
            this.dom.consoleLogsContainer = document.getElementById('consoleLogsContainer'); // Asigna valor

            // Slide 10: Retos & Cheat Sheet
            this.dom.accordionHeaders = document.querySelectorAll('.accordion-header'); // Asigna valor
            this.dom.btnLoadChallenges = document.querySelectorAll('[data-load-challenge]'); // Asigna valor
            this.dom.btnCopySummaryCheat = document.getElementById('btnCopySummaryCheat'); // Asigna valor

            // Modales & Toast
            this.dom.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.dom.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.dom.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor
            this.dom.toastNotification = document.getElementById('toastNotification'); // Asigna valor
            this.dom.toastIcon = document.getElementById('toastIcon'); // Asigna valor
            this.dom.toastMsg = document.getElementById('toastMsg'); // Asigna valor

            // Copiar snippets
            this.dom.btnCopyCodes = document.querySelectorAll('.btn-copy-code'); // Asigna valor
        }

        bindEvents() { // Instrucción JavaScript
            // Navegación
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.addEventListener('click', () => this.prevSlide()); // Evalúa condición
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.addEventListener('click', () => this.nextSlide()); // Evalúa condición
            if (this.dom.btnStartPresentation) this.dom.btnStartPresentation.addEventListener('click', () => this.goToSlide(2)); // Evalúa condición
            if (this.dom.btnRestartPresentation) this.dom.btnRestartPresentation.addEventListener('click', () => this.goToSlide(1)); // Evalúa condición

            this.dom.jumpLinks.forEach(link => { // Instrucción JavaScript
                link.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const slideTarget = parseInt(e.currentTarget.getAttribute('data-jump'), 10); // Declara e inicializa "slideTarget"
                    if (slideTarget) this.goToSlide(slideTarget); // Evalúa condición
                });
            });

            // Barra superior
            if (this.dom.btnToggleMode) this.dom.btnToggleMode.addEventListener('click', () => this.toggleViewMode()); // Evalúa condición
            if (this.dom.btnToggleSound) this.dom.btnToggleSound.addEventListener('click', () => this.toggleSound()); // Evalúa condición
            if (this.dom.btnOverview) this.dom.btnOverview.addEventListener('click', () => this.openOverview()); // Evalúa condición
            if (this.dom.btnCloseOverview) this.dom.btnCloseOverview.addEventListener('click', () => this.closeOverview()); // Evalúa condición
            if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen()); // Evalúa condición

            // Teclado
            window.addEventListener('keydown', (e) => { // Registra escuchador de eventos
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') { // Evalúa condición
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

            // Slide 2: Lector Texto
            if (this.dom.dropZoneText && this.dom.inputLocalText) { // Evalúa condición
                this.dom.dropZoneText.addEventListener('click', () => this.dom.inputLocalText.click()); // Registra escuchador de eventos
                this.dom.inputLocalText.addEventListener('change', (e) => this.handleLocalTextInput(e)); // Registra escuchador de eventos
                this.setupDropZone(this.dom.dropZoneText, (file) => this.readTextFile(file)); // Ejecuta llamada o método
            }
            if (this.dom.btnLoadDemoText) { // Evalúa condición
                this.dom.btnLoadDemoText.addEventListener('click', () => this.loadDemoText()); // Registra escuchador de eventos
            }

            // Slide 3: Lector Imagen DataURL
            if (this.dom.dropZoneImage && this.dom.inputLocalImage) { // Evalúa condición
                this.dom.dropZoneImage.addEventListener('click', () => this.dom.inputLocalImage.click()); // Registra escuchador de eventos
                this.dom.inputLocalImage.addEventListener('change', (e) => this.handleLocalImageInput(e)); // Registra escuchador de eventos
                this.setupDropZone(this.dom.dropZoneImage, (file) => this.readImageFile(file)); // Ejecuta llamada o método
            }
            if (this.dom.btnLoadDemoImage) { // Evalúa condición
                this.dom.btnLoadDemoImage.addEventListener('click', () => this.loadDemoImage()); // Registra escuchador de eventos
            }

            // Slide 4: Carga de Múltiples Archivos & Galería
            if (this.dom.btnSelectMultipleFiles && this.dom.inputMultipleFiles) { // Evalúa condición
                this.dom.btnSelectMultipleFiles.addEventListener('click', () => this.dom.inputMultipleFiles.click()); // Registra escuchador de eventos
                this.dom.inputMultipleFiles.addEventListener('change', (e) => this.handleMultipleFilesInput(e.target.files)); // Registra escuchador de eventos
            }
            if (this.dom.btnLoadDemoMultiFiles) { // Evalúa condición
                this.dom.btnLoadDemoMultiFiles.addEventListener('click', () => this.loadDemoMultiFiles()); // Registra escuchador de eventos
            }
            if (this.dom.btnClearMultiFiles) { // Evalúa condición
                this.dom.btnClearMultiFiles.addEventListener('click', () => this.clearMultiFiles()); // Registra escuchador de eventos
            }
            if (this.dom.dropZoneMultiple) { // Evalúa condición
                this.dom.dropZoneMultiple.addEventListener('click', () => { // Registra escuchador de eventos
                    if (this.dom.inputMultipleFiles) this.dom.inputMultipleFiles.click(); // Evalúa condición
                });
                this.setupDropZone(this.dom.dropZoneMultiple, (singleFile, allFiles) => { // Instrucción JavaScript
                    const files = allFiles && allFiles.length > 0 ? allFiles : [singleFile]; // Declara e inicializa "files"
                    this.handleMultipleFilesInput(files); // Ejecuta llamada o método
                });
            }
            if (this.dom.btnCloseMultiPreview) { // Evalúa condición
                this.dom.btnCloseMultiPreview.addEventListener('click', () => this.closeMultiPreview()); // Registra escuchador de eventos
            }
            if (this.dom.btnSelectMultipleImages && this.dom.inputMultipleGallery) { // Evalúa condición
                this.dom.btnSelectMultipleImages.addEventListener('click', () => this.dom.inputMultipleGallery.click()); // Registra escuchador de eventos
                this.dom.inputMultipleGallery.addEventListener('change', (e) => this.handleMultipleGalleryInput(e)); // Registra escuchador de eventos
            }
            if (this.dom.btnLoadDemoGallery) { // Evalúa condición
                this.dom.btnLoadDemoGallery.addEventListener('click', () => this.loadDemoGallery()); // Registra escuchador de eventos
            }

            // Slide 5: Zona Drag & Drop Interactiva
            if (this.dom.interactiveMainDropZone) { // Evalúa condición
                this.setupDropZone(this.dom.interactiveMainDropZone, (file) => this.handleMainDropFile(file)); // Ejecuta llamada o método
            }

            // Slide 7: Progreso
            if (this.dom.btnStartProgressSim) { // Evalúa condición
                this.dom.btnStartProgressSim.addEventListener('click', () => this.startProgressSimulation()); // Registra escuchador de eventos
            }
            if (this.dom.btnAbortProgressSim) { // Evalúa condición
                this.dom.btnAbortProgressSim.addEventListener('click', () => this.abortProgressSimulation()); // Registra escuchador de eventos
            }

            // Slide 8: Analogías
            this.dom.toolButtons.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    this.dom.toolButtons.forEach(b => b.classList.remove('active')); // Modifica clases CSS del elemento
                    e.currentTarget.classList.add('active'); // Modifica clases CSS del elemento
                    AppState.activeAnalogy = e.currentTarget.getAttribute('data-analogy'); // Asigna valor
                    this.renderAnalogies(); // Ejecuta llamada o método
                    sound.click(); // Ejecuta llamada o método
                });
            });

            // Slide 9: Playground
            if (this.dom.codePresetSelect) { // Evalúa condición
                this.dom.codePresetSelect.addEventListener('change', (e) => this.loadCodePreset(e.target.value)); // Registra escuchador de eventos
            }
            if (this.dom.btnResetCode) { // Evalúa condición
                this.dom.btnResetCode.addEventListener('click', () => { // Registra escuchador de eventos
                    this.loadCodePreset(this.dom.codePresetSelect.value); // Ejecuta llamada o método
                    this.showToast('Código restaurado'); // Ejecuta llamada o método
                });
            }
            if (this.dom.btnRunEditorCode) { // Evalúa condición
                this.dom.btnRunEditorCode.addEventListener('click', () => this.runPlaygroundCode()); // Registra escuchador de eventos
            }
            if (this.dom.btnClearConsole) { // Evalúa condición
                this.dom.btnClearConsole.addEventListener('click', () => this.clearConsole()); // Registra escuchador de eventos
            }

            // Slide 10: Retos
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

            this.dom.btnLoadChallenges.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const challengeKey = e.currentTarget.getAttribute('data-load-challenge'); // Declara e inicializa "challengeKey"
                    this.goToSlide(9); // Ejecuta llamada o método
                    if (this.dom.codePresetSelect) { // Evalúa condición
                        this.dom.codePresetSelect.value = challengeKey; // Asigna valor
                    }
                    this.loadCodePreset(challengeKey); // Ejecuta llamada o método
                    this.showToast('Solución cargada en el Playground', '✔'); // Ejecuta llamada o método
                    sound.fileLoaded(); // Ejecuta llamada o método
                });
            });

            if (this.dom.btnCopySummaryCheat) { // Evalúa condición
                this.dom.btnCopySummaryCheat.addEventListener('click', () => this.copyCheatSheet()); // Registra escuchador de eventos
            }

            // Botones de copia de snippets
            this.dom.btnCopyCodes.forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    const targetId = e.currentTarget.getAttribute('data-target'); // Declara e inicializa "targetId"
                    const targetEl = document.getElementById(targetId); // Obtiene referencia DOM para "targetEl"
                    if (targetEl) { // Evalúa condición
                        navigator.clipboard.writeText(targetEl.innerText).then(() => { // Instrucción JavaScript
                            btn.textContent = '¡Copiado!'; // Actualiza contenido en el DOM
                            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000); // Actualiza contenido en el DOM
                            this.showToast('Snippet copiado al portapapeles'); // Ejecuta llamada o método
                            sound.fileLoaded(); // Ejecuta llamada o método
                        });
                    }
                });
            });
        }

        /* --------------------------------------------------------------------------
           Navegación de Diapositivas
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
                    slide.classList.add('active'); // Modifica clases CSS del elemento
                }
            });

            const dots = document.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, idx) => { // Instrucción JavaScript
                dot.classList.toggle('active', idx + 1 === AppState.currentSlide); // Modifica clases CSS del elemento
            });

            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.disabled = AppState.currentSlide === 1; // Evalúa condición
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.disabled = AppState.currentSlide === AppState.totalSlides; // Evalúa condición

            window.scrollTo({ top: 0, behavior: 'smooth' }); // Ejecuta llamada o método
        }

        toggleViewMode() { // Instrucción JavaScript
            if (AppState.viewMode === 'slides') { // Evalúa condición
                AppState.viewMode = 'guide'; // Asigna valor
                this.dom.body.classList.remove('mode-presentation'); // Modifica clases CSS del elemento
                this.dom.body.classList.add('mode-document'); // Modifica clases CSS del elemento
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Slides'; // Evalúa condición
                this.showToast('Activado Modo Documento Continuo'); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                AppState.viewMode = 'slides'; // Asigna valor
                this.dom.body.classList.remove('mode-document'); // Modifica clases CSS del elemento
                this.dom.body.classList.add('mode-presentation'); // Modifica clases CSS del elemento
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

        setupDropZone(element, onFileDropCallback) { // Instrucción JavaScript
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => { // Instrucción JavaScript
                element.addEventListener(evt, (e) => e.preventDefault()); // Registra escuchador de eventos
            });

            element.addEventListener('dragenter', () => element.classList.add('dragover')); // Registra escuchador de eventos
            element.addEventListener('dragover', () => element.classList.add('dragover')); // Registra escuchador de eventos
            element.addEventListener('dragleave', () => element.classList.remove('dragover')); // Registra escuchador de eventos

            element.addEventListener('drop', (e) => { // Registra escuchador de eventos
                element.classList.remove('dragover'); // Modifica clases CSS del elemento
                const file = e.dataTransfer.files[0]; // Declara e inicializa "file"
                if (file && onFileDropCallback) { // Evalúa condición
                    onFileDropCallback(file, e.dataTransfer.files); // Ejecuta llamada o método
                }
            });
        }

        /* --------------------------------------------------------------------------
           SLIDE 2: LECTURA DE TEXTO CON READASTEXT
           -------------------------------------------------------------------------- */
        initSlideText() {}

        handleLocalTextInput(e) { // Instrucción JavaScript
            const file = e.target.files[0]; // Declara e inicializa "file"
            if (file) this.readTextFile(file); // Evalúa condición
        }

        readTextFile(file) { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = `Leyendo "${file.name}"...`; // Evalúa condición

            const reader = new FileReader(); // Declara e inicializa "reader"
            reader.addEventListener('load', () => { // Registra escuchador de eventos
                if (this.dom.textViewerResult) { // Evalúa condición
                    this.dom.textViewerResult.textContent = reader.result; // Actualiza contenido en el DOM
                }
                if (this.dom.textReadStatus) { // Evalúa condición
                    this.dom.textReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB) cargado`; // Actualiza contenido en el DOM
                }
                sound.fileLoaded(); // Ejecuta llamada o método
                this.showToast(`Archivo "${file.name}" leído como texto`); // Ejecuta llamada o método
            });

            reader.addEventListener('error', () => { // Registra escuchador de eventos
                if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = '❌ Error al leer archivo'; // Evalúa condición
                sound.error(); // Ejecuta llamada o método
            });

            reader.readAsText(file, 'UTF-8'); // Ejecuta llamada o método
        }

        loadDemoText() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.textViewerResult) { // Evalúa condición
                this.dom.textViewerResult.textContent = AppState.demos.text; // Actualiza contenido en el DOM
            }
            if (this.dom.textReadStatus) { // Evalúa condición
                this.dom.textReadStatus.textContent = '✅ Documento demo (config.json) cargado'; // Actualiza contenido en el DOM
            }
            sound.fileLoaded(); // Ejecuta llamada o método
            this.showToast('Documento JSON demo cargado'); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 3: PREVISUALIZACIÓN DE IMÁGENES CON READDATAURL
           -------------------------------------------------------------------------- */
        initSlideImage() {}

        handleLocalImageInput(e) { // Instrucción JavaScript
            const file = e.target.files[0]; // Declara e inicializa "file"
            if (file) this.readImageFile(file); // Evalúa condición
        }

        readImageFile(file) { // Instrucción JavaScript
            if (!file.type.startsWith('image/')) { // Evalúa condición
                this.showToast('El archivo debe ser una imagen válida', '⚠️'); // Ejecuta llamada o método
                sound.error(); // Ejecuta llamada o método
                return; // Retorna resultado
            }

            sound.click(); // Ejecuta llamada o método
            if (this.dom.imageReadStatus) this.dom.imageReadStatus.textContent = `Procesando "${file.name}"...`; // Evalúa condición

            const reader = new FileReader(); // Declara e inicializa "reader"
            reader.addEventListener('load', () => { // Registra escuchador de eventos
                if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none'; // Evalúa condición
                if (this.dom.imagePreviewElement) { // Evalúa condición
                    this.dom.imagePreviewElement.style.display = 'block'; // Asigna valor
                    this.dom.imagePreviewElement.src = reader.result; // Asigna valor
                }
                if (this.dom.imageReadStatus) { // Evalúa condición
                    this.dom.imageReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`; // Actualiza contenido en el DOM
                }
                sound.fileLoaded(); // Ejecuta llamada o método
                this.showToast('Imagen convertida a Data URL (Base64)'); // Ejecuta llamada o método
            });

            reader.readAsDataURL(file); // Ejecuta llamada o método
        }

        loadDemoImage() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none'; // Evalúa condición
            if (this.dom.imagePreviewElement) { // Evalúa condición
                this.dom.imagePreviewElement.style.display = 'block'; // Asigna valor
                this.dom.imagePreviewElement.src = AppState.demos.imageSvg; // Asigna valor
            }
            if (this.dom.imageReadStatus) { // Evalúa condición
                this.dom.imageReadStatus.textContent = '✅ Imagen vectorial Demo (DataURL) cargada'; // Actualiza contenido en el DOM
            }
            sound.fileLoaded(); // Ejecuta llamada o método
            this.showToast('Imagen vectorial demo cargada'); // Ejecuta llamada o método
        }

        /* --------------------------------------------------------------------------
           SLIDE 4: CARGA DE MÚLTIPLES ARCHIVOS & GALERÍA MULTIARCHIVO
           -------------------------------------------------------------------------- */
        initSlideGallery() {}

        handleMultipleFilesInput(fileList) { // Instrucción JavaScript
            const files = Array.from(fileList || []); // Declara e inicializa "files"
            if (!files.length) return; // Evalúa condición

            sound.click(); // Ejecuta llamada o método
            if (this.dom.multiFilesListContainer) { // Evalúa condición
                this.dom.multiFilesListContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }

            let totalBytes = 0; // Declara e inicializa "totalBytes"
            let loadedCount = 0; // Declara e inicializa "loadedCount"

            files.forEach(file => { // Instrucción JavaScript
                totalBytes += file.size; // Instrucción JavaScript

                // Detección inteligente de tipo para seleccionar el método FileReader óptimo
                const isImage = file.type.startsWith('image/'); // Declara e inicializa "isImage"
                const isText = file.type.startsWith('text/') ||
                               file.type.includes('json') ||
                               file.type.includes('csv') ||
                               file.type.includes('xml') ||
                               /\.(txt|json|csv|md|js|ts|html|css|py|sql)$/i.test(file.name); // Ejecuta llamada o método

                let method = 'readAsArrayBuffer'; // Declara e inicializa "method"
                let methodClass = 'badge-method-buffer'; // Declara e inicializa "methodClass"
                let icon = '📦'; // Declara e inicializa "icon"

                if (isImage) { // Evalúa condición
                    method = 'readAsDataURL'; // Asigna valor
                    methodClass = 'badge-method-dataurl'; // Asigna valor
                    icon = '🖼️'; // Asigna valor
                } else if (isText) { // Instrucción JavaScript
                    method = 'readAsText'; // Asigna valor
                    methodClass = 'badge-method-text'; // Asigna valor
                    if (file.name.endsWith('.json')) icon = '📊'; // Evalúa condición
                    else if (file.name.endsWith('.csv')) icon = '📈'; // Evalúa condición alternativa
                    else icon = '📄'; // Rama alternativa
                }

                // REGLA CLAVE: Instanciamos un FileReader único e independiente por cada archivo
                const reader = new FileReader(); // Declara e inicializa "reader"

                reader.addEventListener('load', () => { // Registra escuchador de eventos
                    loadedCount++; // Instrucción JavaScript
                    const sizeStr = (file.size / 1024).toFixed(1) + ' KB'; // Declara e inicializa "sizeStr"
                    this.renderMultiFileCard({ // Instrucción JavaScript
                        name: file.name,
                        sizeStr: sizeStr,
                        type: file.type || 'desconocido',
                        icon: icon,
                        method: method,
                        methodClass: methodClass,
                        content: reader.result
                    });

                    if (loadedCount === files.length) { // Evalúa condición
                        sound.fileLoaded(); // Ejecuta llamada o método
                        this.showToast(`¡Lote de ${files.length} archivos procesado con éxito!`); // Ejecuta llamada o método
                    }
                });

                reader.addEventListener('error', () => { // Registra escuchador de eventos
                    console.error(`Error leyendo ${file.name}`); // Imprime salida en consola
                });

                // Ejecutamos el método según corresponda
                if (isImage) { // Evalúa condición
                    reader.readAsDataURL(file); // Ejecuta llamada o método
                } else if (isText) { // Instrucción JavaScript
                    reader.readAsText(file, 'UTF-8'); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    reader.readAsArrayBuffer(file); // Ejecuta llamada o método
                }
            });

            this.updateMultiFilesStats(files.length, totalBytes); // Ejecuta llamada o método
        }

        loadDemoMultiFiles() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.multiFilesListContainer) { // Evalúa condición
                this.dom.multiFilesListContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }

            let totalBytes = 0; // Declara e inicializa "totalBytes"
            AppState.demos.multiFiles.forEach(item => { // Instrucción JavaScript
                totalBytes += item.size; // Instrucción JavaScript
                const sizeStr = (item.size / 1024).toFixed(1) + ' KB'; // Declara e inicializa "sizeStr"
                const methodClass = item.method === 'readAsDataURL' ? 'badge-method-dataurl' : 'badge-method-text'; // Declara e inicializa "methodClass"
                this.renderMultiFileCard({ // Instrucción JavaScript
                    name: item.name,
                    sizeStr: sizeStr,
                    type: item.type,
                    icon: item.icon,
                    method: item.method,
                    methodClass: methodClass,
                    content: item.content
                });
            });

            this.updateMultiFilesStats(AppState.demos.multiFiles.length, totalBytes); // Ejecuta llamada o método
            sound.fileLoaded(); // Ejecuta llamada o método
            this.showToast(`Lote Demo de ${AppState.demos.multiFiles.length} archivos mixtos cargado`); // Ejecuta llamada o método
        }

        clearMultiFiles() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.multiFilesListContainer) { // Evalúa condición
                this.dom.multiFilesListContainer.innerHTML = `
                    <div style="text-align: center; color: var(--text-dim); padding: 1.2rem; font-size: 0.85rem;">
                        Pulsa <strong>"📁 Cargar Varios Archivos"</strong>, <strong>"⚡ Lote Demo Multiarchivo"</strong> o arrastra archivos arriba para procesarlos en paralelo...
                    </div>
                `;
            }
            if (this.dom.galleryGridContainer) { // Evalúa condición
                this.dom.galleryGridContainer.innerHTML = ''; // Actualiza contenido en el DOM
            }
            if (this.dom.inputMultipleFiles) this.dom.inputMultipleFiles.value = ''; // Evalúa condición
            if (this.dom.inputMultipleGallery) this.dom.inputMultipleGallery.value = ''; // Evalúa condición
            this.updateMultiFilesStats(0, 0); // Ejecuta llamada o método
            this.closeMultiPreview(); // Ejecuta llamada o método
            this.showToast('Lista de archivos limpiada'); // Ejecuta llamada o método
        }

        renderMultiFileCard(info) { // Instrucción JavaScript
            if (!this.dom.multiFilesListContainer) return; // Evalúa condición

            const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
            card.className = 'multifile-card-item'; // Asigna valor
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

            const btnInspect = card.querySelector('.btn-inspect-file'); // Obtiene referencia DOM para "btnInspect"
            btnInspect.addEventListener('click', (e) => { // Registra escuchador de eventos
                e.stopPropagation(); // Ejecuta llamada o método
                this.previewMultiFile(info.name, info.type, info.content, info.method); // Ejecuta llamada o método
            });

            this.dom.multiFilesListContainer.appendChild(card); // Inserta nodo en el DOM
        }

        previewMultiFile(name, type, content, method) { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (!this.dom.multiFilePreviewBox || !this.dom.multiFilePreviewBody) return; // Evalúa condición

            if (this.dom.multiFilePreviewTitle) { // Evalúa condición
                this.dom.multiFilePreviewTitle.textContent = `👁️ Inspeccionando: ${name} (${method})`; // Actualiza contenido en el DOM
            }

            this.dom.multiFilePreviewBody.innerHTML = ''; // Actualiza contenido en el DOM

            if (method === 'readAsDataURL') { // Evalúa condición
                const img = document.createElement('img'); // Crea nuevo elemento DOM "img"
                img.src = content; // Asigna valor
                img.alt = name; // Asigna valor
                this.dom.multiFilePreviewBody.appendChild(img); // Inserta nodo en el DOM
            } else if (method === 'readAsText') { // Instrucción JavaScript
                const pre = document.createElement('pre'); // Crea nuevo elemento DOM "pre"
                pre.style.margin = '0'; // Asigna valor
                pre.textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2); // Actualiza contenido en el DOM
                this.dom.multiFilePreviewBody.appendChild(pre); // Inserta nodo en el DOM
            } else { // Instrucción JavaScript
                this.dom.multiFilePreviewBody.textContent = `[Búfer binario en memoria: ${content ? (content.byteLength || content.length || 0) : 0} bytes crudos cargados]`; // Actualiza contenido en el DOM
            }

            this.dom.multiFilePreviewBox.classList.add('active'); // Modifica clases CSS del elemento
            this.dom.multiFilePreviewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Ejecuta llamada o método
        }

        closeMultiPreview() { // Instrucción JavaScript
            if (this.dom.multiFilePreviewBox) { // Evalúa condición
                this.dom.multiFilePreviewBox.classList.remove('active'); // Modifica clases CSS del elemento
            }
        }

        updateMultiFilesStats(count, totalBytes) { // Instrucción JavaScript
            if (this.dom.multiFilesCount) { // Evalúa condición
                this.dom.multiFilesCount.textContent = count; // Actualiza contenido en el DOM
            }
            if (this.dom.multiFilesTotalSize) { // Evalúa condición
                const formatted = totalBytes >= 1048576
                    ? (totalBytes / 1048576).toFixed(2) + ' MB'
                    : (totalBytes / 1024).toFixed(1) + ' KB'; // Instrucción JavaScript
                this.dom.multiFilesTotalSize.textContent = formatted; // Actualiza contenido en el DOM
            }
        }

        handleMultipleGalleryInput(e) { // Instrucción JavaScript
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); // Define función flecha "files"
            if (!files.length) return; // Evalúa condición

            sound.click(); // Ejecuta llamada o método
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = ''; // Evalúa condición
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = `${files.length} imágenes`; // Evalúa condición

            files.forEach(file => { // Instrucción JavaScript
                const reader = new FileReader(); // Declara e inicializa "reader"
                reader.addEventListener('load', () => { // Registra escuchador de eventos
                    this.renderGalleryCard(reader.result, file.name, (file.size / 1024).toFixed(1) + ' KB'); // Ejecuta llamada o método
                });
                reader.readAsDataURL(file); // Ejecuta llamada o método
            });

            sound.fileLoaded(); // Ejecuta llamada o método
            this.showToast(`${files.length} imágenes procesadas en paralelo`); // Ejecuta llamada o método
        }

        loadDemoGallery() { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = ''; // Evalúa condición
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = '4 imágenes demo'; // Evalúa condición

            AppState.demos.gallery.forEach(item => { // Instrucción JavaScript
                const svgCard = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%230f172a"/><circle cx="100" cy="75" r="40" fill="${encodeURIComponent(item.color)}"/><text x="100" y="85" text-anchor="middle" font-size="32">${item.icon}</text></svg>`;
                this.renderGalleryCard(svgCard, item.name, item.size); // Ejecuta llamada o método
            });

            sound.fileLoaded(); // Ejecuta llamada o método
            this.showToast('Galería demo cargada con 4 miniaturas'); // Ejecuta llamada o método
        }

        renderGalleryCard(dataUrl, name, sizeStr) { // Instrucción JavaScript
            if (!this.dom.galleryGridContainer) return; // Evalúa condición
            const fig = document.createElement('figure'); // Crea nuevo elemento DOM "fig"
            fig.className = 'tarjeta-miniatura'; // Asigna valor
            fig.innerHTML = `
                <img src="${dataUrl}" alt="${name}">
                <figcaption title="${name} (${sizeStr})">${name} (${sizeStr})</figcaption>
            `;
            this.dom.galleryGridContainer.appendChild(fig); // Inserta nodo en el DOM
        }

        /* --------------------------------------------------------------------------
           SLIDE 5: ZONA DRAG & DROP INTERACTIVA
           -------------------------------------------------------------------------- */
        initSlideDropZone() {}

        handleMainDropFile(file) { // Instrucción JavaScript
            sound.click(); // Ejecuta llamada o método
            const out = this.dom.dropZoneResultBox; // Declara e inicializa "out"
            if (!out) return; // Evalúa condición

            const isImg = file.type.startsWith('image/'); // Declara e inicializa "isImg"
            const reader = new FileReader(); // Declara e inicializa "reader"

            out.innerHTML = `
                <div style="font-family: var(--font-mono); font-size: 0.84rem; line-height: 1.6;">
                    <div>📂 <strong>Archivo detectado:</strong> ${file.name}</div>
                    <div>⚖️ <strong>Tamaño:</strong> ${(file.size / 1024).toFixed(2)} KB</div>
                    <div>🏷️ <strong>Tipo MIME:</strong> ${file.type || 'Desconocido'}</div>
                    <div style="color: var(--cyan); margin-top: 0.35rem;">⏳ Procesando contenido con FileReader...</div>
                </div>
            `;

            if (isImg) { // Evalúa condición
                reader.addEventListener('load', () => { // Registra escuchador de eventos
                    out.innerHTML += `
                        <div style="margin-top: 0.75rem;">
                            <span class="badge badge-emerald">Previsualización de Imagen</span><br/>
                            <img src="${reader.result}" style="max-height: 110px; border-radius: 6px; margin-top: 0.5rem; border: 1px solid var(--border-subtle);" alt="${file.name}">
                        </div>
                    `;
                    sound.fileLoaded(); // Ejecuta llamada o método
                });
                reader.readAsDataURL(file); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                reader.addEventListener('load', () => { // Registra escuchador de eventos
                    const firstLines = reader.result.split('\n').slice(0, 4).join('\n'); // Declara e inicializa "firstLines"
                    out.innerHTML += `
                        <div style="margin-top: 0.75rem;">
                            <span class="badge badge-purple">Primeras Líneas de Texto</span>
                            <pre style="background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 4px; font-size: 0.78rem; margin-top: 0.4rem; color: var(--cyan);">${firstLines}</pre>
                        </div>
                    `;
                    sound.fileLoaded(); // Ejecuta llamada o método
                });
                reader.readAsText(file, 'UTF-8'); // Ejecuta llamada o método
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 7: SIMULADOR DE BARRA DE PROGRESO
           -------------------------------------------------------------------------- */
        initSlideProgress() {}

        startProgressSimulation() { // Instrucción JavaScript
            const p = AppState.progressSim; // Declara e inicializa "p"
            if (p.isRunning) return; // Evalúa condición

            sound.click(); // Ejecuta llamada o método
            p.isRunning = true; // Asigna valor
            p.loaded = 0; // Asigna valor

            if (this.dom.progressEventLogBox) { // Evalúa condición
                this.dom.progressEventLogBox.innerHTML = `
                    <div style="color: var(--cyan); font-family: var(--font-mono); font-size: 0.85rem;">
                        🔔 [Evento loadstart] La lectura de 8,192 KB ha comenzado...
                    </div>
                `;
            }

            clearInterval(p.timer); // Ejecuta llamada o método
            const stepBytes = 384 * 1024; // ~384 KB por pulso

            p.timer = setInterval(() => { // Asigna valor
                p.loaded += stepBytes; // Instrucción JavaScript
                if (p.loaded >= p.total) { // Evalúa condición
                    p.loaded = p.total; // Asigna valor
                    clearInterval(p.timer); // Ejecuta llamada o método
                    p.isRunning = false; // Asigna valor
                    this.updateProgressUI(100, p.loaded, p.total); // Ejecuta llamada o método

                    if (this.dom.progressEventLogBox) { // Evalúa condición
                        this.dom.progressEventLogBox.innerHTML += `
                            <div style="color: var(--emerald); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.35rem;">
                                ✅ [Evento load] ¡Lectura completada al 100%!
                            </div>
                            <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
                                🏁 [Evento loadend] Conclusión formal del ciclo de vida.
                            </div>
                        `;
                    }
                    sound.fileLoaded(); // Ejecuta llamada o método
                    this.showToast('Simulación de lectura completada con éxito'); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    const pct = Math.round((p.loaded / p.total) * 100); // Declara e inicializa "pct"
                    this.updateProgressUI(pct, p.loaded, p.total); // Ejecuta llamada o método
                    sound.playTone(300 + pct * 5, 'sine', 0.03, 0.02); // Ejecuta llamada o método
                }
            }, 120); // Ejecuta llamada o método
        }

        abortProgressSimulation() { // Instrucción JavaScript
            const p = AppState.progressSim; // Declara e inicializa "p"
            if (!p.isRunning) return; // Evalúa condición

            clearInterval(p.timer); // Ejecuta llamada o método
            p.isRunning = false; // Asigna valor

            if (this.dom.progressEventLogBox) { // Evalúa condición
                this.dom.progressEventLogBox.innerHTML += `
                    <div style="color: var(--rose); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 0.35rem;">
                        🛑 [Evento abort] Operación cancelada por el usuario con reader.abort().
                    </div>
                    <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem;">
                        🏁 [Evento loadend] Ciclo finalizado anticipadamente.
                    </div>
                `;
            }

            sound.error(); // Ejecuta llamada o método
            this.showToast('Lectura cancelada con abort()', '🛑'); // Ejecuta llamada o método
        }

        updateProgressUI(pct, loaded, total) { // Instrucción JavaScript
            if (this.dom.fileProgressBarFill) this.dom.fileProgressBarFill.style.width = `${pct}%`; // Evalúa condición
            if (this.dom.progressPercentLabel) this.dom.progressPercentLabel.textContent = `${pct}%`; // Evalúa condición
            if (this.dom.progressBytesLoaded) { // Evalúa condición
                this.dom.progressBytesLoaded.textContent = `${(loaded / 1024).toFixed(0)} KB leídos`; // Actualiza contenido en el DOM
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 8: ANALOGÍAS VISUALES
           -------------------------------------------------------------------------- */
        initAnalogies() { // Instrucción JavaScript
            this.renderAnalogies(); // Ejecuta llamada o método
        }

        renderAnalogies() { // Instrucción JavaScript
            const mode = AppState.activeAnalogy; // Declara e inicializa "mode"
            if (mode === 'traductor') { // Evalúa condición
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '🎙️'; // Evalúa condición
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'readAsText()'; // Evalúa condición
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'Traducción directa a lenguaje humano'; // Evalúa condición
                if (this.dom.analogyItemsLeft) { // Evalúa condición
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">El traductor lee una carta y te dicta las palabras en español</div>
                        <div class="ws-item">El resultado es una cadena de texto lista para ser leída y comprendida</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Ideal para archivos de configuración, notas y código'; // Evalúa condición

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🖼️'; // Evalúa condición
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'readAsDataURL()'; // Evalúa condición
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'Telegrama en código Morse (Base64)'; // Evalúa condición
                if (this.dom.analogyItemsRight) { // Evalúa condición
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Codifica cada pixel en una sola línea continua de caracteres</div>
                        <div class="ws-item highlight-item">No está hecho para personas, sino para que el navegador lo pinte</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Ideal para atributos src en imágenes y miniaturas'; // Evalúa condición

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Comparativa'; // Evalúa condición
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🎙️'; // Evalúa condición
                if (this.dom.analogyBannerText) { // Evalúa condición
                    this.dom.analogyBannerText.innerHTML = '<strong>readAsText vs readAsDataURL:</strong> Usa <code>readAsText()</code> cuando necesites procesar texto, editar líneas o parsear JSON; usa <code>readAsDataURL()</code> para renderizar recursos visuales sin tocar el backend.'; // Actualiza contenido en el DOM
                }
            } else { // Instrucción JavaScript
                // Báscula de Granos
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '⚖️'; // Evalúa condición
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'Evento progress'; // Evalúa condición
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'La báscula de pesaje en tiempo real'; // Evalúa condición
                if (this.dom.analogyItemsLeft) { // Evalúa condición
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">Mide tonelada por tonelada mientras el grano cae al silo</div>
                        <div class="ws-item">Calcula con precisión milimétrica el porcentaje de avance</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Permite actualizar barras de carga para feedback fluido'; // Evalúa condición

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🏁'; // Evalúa condición
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'Evento loadend'; // Evalúa condición
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'El pitido final de cierre de compuerta'; // Evalúa condición
                if (this.dom.analogyItemsRight) { // Evalúa condición
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Se dispara siempre: con éxito, error o cancelación</div>
                        <div class="ws-item highlight-item">Garantiza que la tolva quede desocupada para el siguiente ciclo</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Lugar obligatorio para ocultar spinners y habilitar botones'; // Evalúa condición

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Ciclo de Vida'; // Evalúa condición
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🚚'; // Evalúa condición
                if (this.dom.analogyBannerText) { // Evalúa condición
                    this.dom.analogyBannerText.innerHTML = '<strong>progress & loadend:</strong> Mantén informados a tus usuarios en archivos pesados calculando <code>(loaded / total) * 100</code> y aprovecha <code>loadend</code> para cerrar modales pase lo que pase.'; // Actualiza contenido en el DOM
                }
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 9: PLAYGROUND INTERACTIVO
           -------------------------------------------------------------------------- */
        loadCodePreset(presetKey) { // Instrucción JavaScript
            const code = CodePresets[presetKey]; // Declara e inicializa "code"
            if (code && this.dom.liveCodeEditor) { // Evalúa condición
                this.dom.liveCodeEditor.value = code; // Asigna valor
                this.clearConsole(); // Ejecuta llamada o método
                this.printToConsole(`/* Preset cargado: [${presetKey}]. Haz clic en "Ejecutar Código" (Ctrl + Enter) */`, 'info-line'); // Ejecuta llamada o método
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
                this.printToConsole('--- Ejecución asíncrona despachada sin errores sintácticos ---', 'info-line'); // Ejecuta llamada o método
                sound.fileLoaded(); // Ejecuta llamada o método
            } catch (err) { // Instrucción JavaScript
                this.printToConsole(`Error de ejecución: ${err.name} - ${err.message}`, 'error-line'); // Ejecuta llamada o método
                sound.error(); // Ejecuta llamada o método
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

            navigator.clipboard.writeText(markdown).then(() => { // Instrucción JavaScript
                this.showToast('¡Chuleta copiada al portapapeles!'); // Ejecuta llamada o método
                sound.fileLoaded(); // Ejecuta llamada o método
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
