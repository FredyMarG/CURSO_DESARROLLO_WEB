/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: FILEREADER API
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL, SIMULADORES DE LECTURA, DRAG & DROP Y PLAYGROUND
 * ============================================================================
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    const AppState = {
        currentSlide: 1,
        totalSlides: 10,
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
    class SoundEngine {
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTone(freq, type = 'sine', duration = 0.09, volume = 0.05) {
            if (!AppState.soundEnabled) return;
            try {
                this.init();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

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
            if (!AppState.soundEnabled) return;
            this.playTone(523.25, 'sine', 0.08, 0.05);
            setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.05), 70);
            setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.05), 140);
        }

        error() {
            if (!AppState.soundEnabled) return;
            this.playTone(320, 'sawtooth', 0.12, 0.06);
            setTimeout(() => this.playTone(240, 'sawtooth', 0.15, 0.06), 90);
        }
    }

    const sound = new SoundEngine();

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
    class AppController {
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
            this.dom.slides = document.querySelectorAll('.slide');

            // Navegación
            this.dom.progressBar = document.getElementById('progressBar');
            this.dom.slideIndicator = document.getElementById('slideIndicator');
            this.dom.btnToggleMode = document.getElementById('btnToggleMode');
            this.dom.modeIcon = document.getElementById('modeIcon');
            this.dom.modeText = document.getElementById('modeText');
            this.dom.btnToggleSound = document.getElementById('btnToggleSound');
            this.dom.soundIcon = document.getElementById('soundIcon');
            this.dom.btnOverview = document.getElementById('btnOverview');
            this.dom.btnFullscreen = document.getElementById('btnFullscreen');
            this.dom.btnPrevSlide = document.getElementById('btnPrevSlide');
            this.dom.btnNextSlide = document.getElementById('btnNextSlide');
            this.dom.slideDotsContainer = document.getElementById('slideDotsContainer');
            this.dom.btnStartPresentation = document.getElementById('btnStartPresentation');
            this.dom.btnRestartPresentation = document.getElementById('btnRestartPresentation');
            this.dom.jumpLinks = document.querySelectorAll('[data-jump]');

            // Slide 2: Lector Texto
            this.dom.dropZoneText = document.getElementById('dropZoneText');
            this.dom.inputLocalText = document.getElementById('inputLocalText');
            this.dom.btnLoadDemoText = document.getElementById('btnLoadDemoText');
            this.dom.textReadStatus = document.getElementById('textReadStatus');
            this.dom.textViewerResult = document.getElementById('textViewerResult');

            // Slide 3: Lector Imagen DataURL
            this.dom.dropZoneImage = document.getElementById('dropZoneImage');
            this.dom.inputLocalImage = document.getElementById('inputLocalImage');
            this.dom.btnLoadDemoImage = document.getElementById('btnLoadDemoImage');
            this.dom.imageReadStatus = document.getElementById('imageReadStatus');
            this.dom.imagePreviewContainer = document.getElementById('imagePreviewContainer');
            this.dom.imagePreviewPlaceholder = document.getElementById('imagePreviewPlaceholder');
            this.dom.imagePreviewElement = document.getElementById('imagePreviewElement');

            // Slide 4: Galería
            this.dom.btnSelectMultipleImages = document.getElementById('btnSelectMultipleImages');
            this.dom.btnLoadDemoGallery = document.getElementById('btnLoadDemoGallery');
            this.dom.inputMultipleGallery = document.getElementById('inputMultipleGallery');
            this.dom.galleryCountStatus = document.getElementById('galleryCountStatus');
            this.dom.galleryGridContainer = document.getElementById('galleryGridContainer');

            // Slide 5: Zona Drag & Drop
            this.dom.interactiveMainDropZone = document.getElementById('interactiveMainDropZone');
            this.dom.dropZoneResultBox = document.getElementById('dropZoneResultBox');

            // Slide 7: Progreso
            this.dom.btnStartProgressSim = document.getElementById('btnStartProgressSim');
            this.dom.btnAbortProgressSim = document.getElementById('btnAbortProgressSim');
            this.dom.fileProgressBarFill = document.getElementById('fileProgressBarFill');
            this.dom.progressPercentLabel = document.getElementById('progressPercentLabel');
            this.dom.progressBytesLoaded = document.getElementById('progressBytesLoaded');
            this.dom.progressBytesTotal = document.getElementById('progressBytesTotal');
            this.dom.progressEventLogBox = document.getElementById('progressEventLogBox');

            // Slide 8: Analogías
            this.dom.toolButtons = document.querySelectorAll('.tool-btn');
            this.dom.analogyAvatarLeft = document.getElementById('analogyAvatarLeft');
            this.dom.analogyTitleLeft = document.getElementById('analogyTitleLeft');
            this.dom.analogySubLeft = document.getElementById('analogySubLeft');
            this.dom.analogyItemsLeft = document.getElementById('analogyItemsLeft');
            this.dom.analogyStatusLeft = document.getElementById('analogyStatusLeft');

            this.dom.analogyAvatarRight = document.getElementById('analogyAvatarRight');
            this.dom.analogyTitleRight = document.getElementById('analogyTitleRight');
            this.dom.analogySubRight = document.getElementById('analogySubRight');
            this.dom.analogyItemsRight = document.getElementById('analogyItemsRight');
            this.dom.analogyStatusRight = document.getElementById('analogyStatusRight');

            this.dom.analogyArrowLabel = document.getElementById('analogyArrowLabel');
            this.dom.analogyBannerIcon = document.getElementById('analogyBannerIcon');
            this.dom.analogyBannerText = document.getElementById('analogyBannerText');

            // Slide 9: Playground
            this.dom.codePresetSelect = document.getElementById('codePresetSelect');
            this.dom.liveCodeEditor = document.getElementById('liveCodeEditor');
            this.dom.btnResetCode = document.getElementById('btnResetCode');
            this.dom.btnRunEditorCode = document.getElementById('btnRunEditorCode');
            this.dom.btnClearConsole = document.getElementById('btnClearConsole');
            this.dom.consoleLogsContainer = document.getElementById('consoleLogsContainer');

            // Slide 10: Retos & Cheat Sheet
            this.dom.accordionHeaders = document.querySelectorAll('.accordion-header');
            this.dom.btnLoadChallenges = document.querySelectorAll('[data-load-challenge]');
            this.dom.btnCopySummaryCheat = document.getElementById('btnCopySummaryCheat');

            // Modales & Toast
            this.dom.overviewModal = document.getElementById('overviewModal');
            this.dom.btnCloseOverview = document.getElementById('btnCloseOverview');
            this.dom.overviewGrid = document.getElementById('overviewGrid');
            this.dom.toastNotification = document.getElementById('toastNotification');
            this.dom.toastIcon = document.getElementById('toastIcon');
            this.dom.toastMsg = document.getElementById('toastMsg');

            // Copiar snippets
            this.dom.btnCopyCodes = document.querySelectorAll('.btn-copy-code');
        }

        bindEvents() {
            // Navegación
            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.addEventListener('click', () => this.prevSlide());
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.addEventListener('click', () => this.nextSlide());
            if (this.dom.btnStartPresentation) this.dom.btnStartPresentation.addEventListener('click', () => this.goToSlide(2));
            if (this.dom.btnRestartPresentation) this.dom.btnRestartPresentation.addEventListener('click', () => this.goToSlide(1));

            this.dom.jumpLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const slideTarget = parseInt(e.currentTarget.getAttribute('data-jump'), 10);
                    if (slideTarget) this.goToSlide(slideTarget);
                });
            });

            // Barra superior
            if (this.dom.btnToggleMode) this.dom.btnToggleMode.addEventListener('click', () => this.toggleViewMode());
            if (this.dom.btnToggleSound) this.dom.btnToggleSound.addEventListener('click', () => this.toggleSound());
            if (this.dom.btnOverview) this.dom.btnOverview.addEventListener('click', () => this.openOverview());
            if (this.dom.btnCloseOverview) this.dom.btnCloseOverview.addEventListener('click', () => this.closeOverview());
            if (this.dom.btnFullscreen) this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());

            // Teclado
            window.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        this.runPlaygroundCode();
                    }
                    return;
                }

                if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd' || e.key === 'D') {
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
            if (this.dom.dropZoneText && this.dom.inputLocalText) {
                this.dom.dropZoneText.addEventListener('click', () => this.dom.inputLocalText.click());
                this.dom.inputLocalText.addEventListener('change', (e) => this.handleLocalTextInput(e));
                this.setupDropZone(this.dom.dropZoneText, (file) => this.readTextFile(file));
            }
            if (this.dom.btnLoadDemoText) {
                this.dom.btnLoadDemoText.addEventListener('click', () => this.loadDemoText());
            }

            // Slide 3: Lector Imagen DataURL
            if (this.dom.dropZoneImage && this.dom.inputLocalImage) {
                this.dom.dropZoneImage.addEventListener('click', () => this.dom.inputLocalImage.click());
                this.dom.inputLocalImage.addEventListener('change', (e) => this.handleLocalImageInput(e));
                this.setupDropZone(this.dom.dropZoneImage, (file) => this.readImageFile(file));
            }
            if (this.dom.btnLoadDemoImage) {
                this.dom.btnLoadDemoImage.addEventListener('click', () => this.loadDemoImage());
            }

            // Slide 4: Galería
            if (this.dom.btnSelectMultipleImages && this.dom.inputMultipleGallery) {
                this.dom.btnSelectMultipleImages.addEventListener('click', () => this.dom.inputMultipleGallery.click());
                this.dom.inputMultipleGallery.addEventListener('change', (e) => this.handleMultipleGalleryInput(e));
            }
            if (this.dom.btnLoadDemoGallery) {
                this.dom.btnLoadDemoGallery.addEventListener('click', () => this.loadDemoGallery());
            }

            // Slide 5: Zona Drag & Drop Interactiva
            if (this.dom.interactiveMainDropZone) {
                this.setupDropZone(this.dom.interactiveMainDropZone, (file) => this.handleMainDropFile(file));
            }

            // Slide 7: Progreso
            if (this.dom.btnStartProgressSim) {
                this.dom.btnStartProgressSim.addEventListener('click', () => this.startProgressSimulation());
            }
            if (this.dom.btnAbortProgressSim) {
                this.dom.btnAbortProgressSim.addEventListener('click', () => this.abortProgressSimulation());
            }

            // Slide 8: Analogías
            this.dom.toolButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.dom.toolButtons.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    AppState.activeAnalogy = e.currentTarget.getAttribute('data-analogy');
                    this.renderAnalogies();
                    sound.click();
                });
            });

            // Slide 9: Playground
            if (this.dom.codePresetSelect) {
                this.dom.codePresetSelect.addEventListener('change', (e) => this.loadCodePreset(e.target.value));
            }
            if (this.dom.btnResetCode) {
                this.dom.btnResetCode.addEventListener('click', () => {
                    this.loadCodePreset(this.dom.codePresetSelect.value);
                    this.showToast('Código restaurado');
                });
            }
            if (this.dom.btnRunEditorCode) {
                this.dom.btnRunEditorCode.addEventListener('click', () => this.runPlaygroundCode());
            }
            if (this.dom.btnClearConsole) {
                this.dom.btnClearConsole.addEventListener('click', () => this.clearConsole());
            }

            // Slide 10: Retos
            this.dom.accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.parentElement;
                    const isOpen = item.classList.contains('active');
                    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                    if (!isOpen) {
                        item.classList.add('active');
                        sound.click();
                    }
                });
            });

            this.dom.btnLoadChallenges.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const challengeKey = e.currentTarget.getAttribute('data-load-challenge');
                    this.goToSlide(9);
                    if (this.dom.codePresetSelect) {
                        this.dom.codePresetSelect.value = challengeKey;
                    }
                    this.loadCodePreset(challengeKey);
                    this.showToast('Solución cargada en el Playground', '✔');
                    sound.fileLoaded();
                });
            });

            if (this.dom.btnCopySummaryCheat) {
                this.dom.btnCopySummaryCheat.addEventListener('click', () => this.copyCheatSheet());
            }

            // Botones de copia de snippets
            this.dom.btnCopyCodes.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = e.currentTarget.getAttribute('data-target');
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        navigator.clipboard.writeText(targetEl.innerText).then(() => {
                            btn.textContent = '¡Copiado!';
                            setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
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
            if (!this.dom.slideDotsContainer) return;
            this.dom.slideDotsContainer.innerHTML = '';
            for (let i = 1; i <= AppState.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = `slide-dot ${i === AppState.currentSlide ? 'active' : ''}`;
                dot.setAttribute('title', `Ir a diapositiva ${i}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dom.slideDotsContainer.appendChild(dot);
            }
        }

        goToSlide(index) {
            if (index < 1 || index > AppState.totalSlides) return;
            AppState.currentSlide = index;
            this.updateSlideDisplay();
            sound.nav();
        }

        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) {
                AppState.currentSlide++;
                this.updateSlideDisplay();
                sound.nav();
            }
        }

        prevSlide() {
            if (AppState.currentSlide > 1) {
                AppState.currentSlide--;
                this.updateSlideDisplay();
                sound.nav();
            }
        }

        updateSlideDisplay() {
            if (this.dom.slideIndicator) {
                this.dom.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
            }

            if (this.dom.progressBar) {
                const percent = (AppState.currentSlide / AppState.totalSlides) * 100;
                this.dom.progressBar.style.width = `${percent}%`;
            }

            this.dom.slides.forEach((slide, idx) => {
                const num = idx + 1;
                if (AppState.viewMode === 'slides') {
                    slide.classList.toggle('active', num === AppState.currentSlide);
                } else {
                    slide.classList.add('active');
                }
            });

            const dots = document.querySelectorAll('.slide-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx + 1 === AppState.currentSlide);
            });

            if (this.dom.btnPrevSlide) this.dom.btnPrevSlide.disabled = AppState.currentSlide === 1;
            if (this.dom.btnNextSlide) this.dom.btnNextSlide.disabled = AppState.currentSlide === AppState.totalSlides;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        toggleViewMode() {
            if (AppState.viewMode === 'slides') {
                AppState.viewMode = 'guide';
                this.dom.body.classList.remove('mode-presentation');
                this.dom.body.classList.add('mode-document');
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Slides';
                this.showToast('Activado Modo Documento Continuo');
            } else {
                AppState.viewMode = 'slides';
                this.dom.body.classList.remove('mode-document');
                this.dom.body.classList.add('mode-presentation');
                if (this.dom.modeText) this.dom.modeText.textContent = 'Modo Guía';
                this.showToast('Activado Modo Diapositivas');
            }
            this.updateSlideDisplay();
            sound.click();
        }

        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.dom.soundIcon) {
                this.dom.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
            this.showToast(AppState.soundEnabled ? 'Sonido activado' : 'Sonido silenciado');
            if (AppState.soundEnabled) sound.click();
        }

        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                this.showToast('Pantalla Completa');
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        }

        openOverview() {
            if (!this.dom.overviewModal || !this.dom.overviewGrid) return;
            this.dom.overviewGrid.innerHTML = '';

            const slideTitles = [
                '1. Inicio: FileReader API',
                '2. Lectura Textual: readAsText()',
                '3. Codificación Base64: readAsDataURL()',
                '4. Galería Dinámica Multiarquivo',
                '5. Integración con Drag & Drop',
                '6. Arquitectura y Ciclo de Eventos',
                '7. Laboratorio de Progreso en Vivo',
                '8. Analogías del Mundo Real',
                '9. Laboratorio de Código Playground',
                '10. Chuleta Rápida & Retos Resueltos'
            ];

            slideTitles.forEach((title, i) => {
                const card = document.createElement('div');
                card.className = `modal-card ${i + 1 === AppState.currentSlide ? 'active' : ''}`;
                card.innerHTML = `
                    <div class="modal-card-num">#${i + 1}</div>
                    <div class="modal-card-title">${title}</div>
                `;
                card.addEventListener('click', () => {
                    this.goToSlide(i + 1);
                    this.closeOverview();
                });
                this.dom.overviewGrid.appendChild(card);
            });

            this.dom.overviewModal.classList.add('active');
            sound.click();
        }

        closeOverview() {
            if (this.dom.overviewModal) {
                this.dom.overviewModal.classList.remove('active');
            }
        }

        showToast(msg, icon = '✔') {
            if (!this.dom.toastNotification) return;
            if (this.dom.toastIcon) this.dom.toastIcon.textContent = icon;
            if (this.dom.toastMsg) this.dom.toastMsg.textContent = msg;

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

            element.addEventListener('drop', (e) => {
                element.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && onFileDropCallback) {
                    onFileDropCallback(file);
                }
            });
        }

        /* --------------------------------------------------------------------------
           SLIDE 2: LECTURA DE TEXTO CON READASTEXT
           -------------------------------------------------------------------------- */
        initSlideText() {}

        handleLocalTextInput(e) {
            const file = e.target.files[0];
            if (file) this.readTextFile(file);
        }

        readTextFile(file) {
            sound.click();
            if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = `Leyendo "${file.name}"...`;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                if (this.dom.textViewerResult) {
                    this.dom.textViewerResult.textContent = reader.result;
                }
                if (this.dom.textReadStatus) {
                    this.dom.textReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB) cargado`;
                }
                sound.fileLoaded();
                this.showToast(`Archivo "${file.name}" leído como texto`);
            });

            reader.addEventListener('error', () => {
                if (this.dom.textReadStatus) this.dom.textReadStatus.textContent = '❌ Error al leer archivo';
                sound.error();
            });

            reader.readAsText(file, 'UTF-8');
        }

        loadDemoText() {
            sound.click();
            if (this.dom.textViewerResult) {
                this.dom.textViewerResult.textContent = AppState.demos.text;
            }
            if (this.dom.textReadStatus) {
                this.dom.textReadStatus.textContent = '✅ Documento demo (config.json) cargado';
            }
            sound.fileLoaded();
            this.showToast('Documento JSON demo cargado');
        }

        /* --------------------------------------------------------------------------
           SLIDE 3: PREVISUALIZACIÓN DE IMÁGENES CON READDATAURL
           -------------------------------------------------------------------------- */
        initSlideImage() {}

        handleLocalImageInput(e) {
            const file = e.target.files[0];
            if (file) this.readImageFile(file);
        }

        readImageFile(file) {
            if (!file.type.startsWith('image/')) {
                this.showToast('El archivo debe ser una imagen válida', '⚠️');
                sound.error();
                return;
            }

            sound.click();
            if (this.dom.imageReadStatus) this.dom.imageReadStatus.textContent = `Procesando "${file.name}"...`;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none';
                if (this.dom.imagePreviewElement) {
                    this.dom.imagePreviewElement.style.display = 'block';
                    this.dom.imagePreviewElement.src = reader.result;
                }
                if (this.dom.imageReadStatus) {
                    this.dom.imageReadStatus.textContent = `✅ "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`;
                }
                sound.fileLoaded();
                this.showToast('Imagen convertida a Data URL (Base64)');
            });

            reader.readAsDataURL(file);
        }

        loadDemoImage() {
            sound.click();
            if (this.dom.imagePreviewPlaceholder) this.dom.imagePreviewPlaceholder.style.display = 'none';
            if (this.dom.imagePreviewElement) {
                this.dom.imagePreviewElement.style.display = 'block';
                this.dom.imagePreviewElement.src = AppState.demos.imageSvg;
            }
            if (this.dom.imageReadStatus) {
                this.dom.imageReadStatus.textContent = '✅ Imagen vectorial Demo (DataURL) cargada';
            }
            sound.fileLoaded();
            this.showToast('Imagen vectorial demo cargada');
        }

        /* --------------------------------------------------------------------------
           SLIDE 4: GALERÍA DINÁMICA MULTIARCHIVO
           -------------------------------------------------------------------------- */
        initSlideGallery() {}

        handleMultipleGalleryInput(e) {
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
            if (!files.length) return;

            sound.click();
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = '';
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = `${files.length} imágenes`;

            files.forEach(file => {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.renderGalleryCard(reader.result, file.name, (file.size / 1024).toFixed(1) + ' KB');
                });
                reader.readAsDataURL(file);
            });

            sound.fileLoaded();
            this.showToast(`${files.length} imágenes procesadas en paralelo`);
        }

        loadDemoGallery() {
            sound.click();
            if (this.dom.galleryGridContainer) this.dom.galleryGridContainer.innerHTML = '';
            if (this.dom.galleryCountStatus) this.dom.galleryCountStatus.textContent = '4 imágenes demo';

            AppState.demos.gallery.forEach(item => {
                const svgCard = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%230f172a"/><circle cx="100" cy="75" r="40" fill="${encodeURIComponent(item.color)}"/><text x="100" y="85" text-anchor="middle" font-size="32">${item.icon}</text></svg>`;
                this.renderGalleryCard(svgCard, item.name, item.size);
            });

            sound.fileLoaded();
            this.showToast('Galería demo cargada con 4 miniaturas');
        }

        renderGalleryCard(dataUrl, name, sizeStr) {
            if (!this.dom.galleryGridContainer) return;
            const fig = document.createElement('figure');
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
            const out = this.dom.dropZoneResultBox;
            if (!out) return;

            const isImg = file.type.startsWith('image/');
            const reader = new FileReader();

            out.innerHTML = `
                <div style="font-family: var(--font-mono); font-size: 0.84rem; line-height: 1.6;">
                    <div>📂 <strong>Archivo detectado:</strong> ${file.name}</div>
                    <div>⚖️ <strong>Tamaño:</strong> ${(file.size / 1024).toFixed(2)} KB</div>
                    <div>🏷️ <strong>Tipo MIME:</strong> ${file.type || 'Desconocido'}</div>
                    <div style="color: var(--cyan); margin-top: 0.35rem;">⏳ Procesando contenido con FileReader...</div>
                </div>
            `;

            if (isImg) {
                reader.addEventListener('load', () => {
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
                reader.addEventListener('load', () => {
                    const firstLines = reader.result.split('\n').slice(0, 4).join('\n');
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
            const p = AppState.progressSim;
            if (p.isRunning) return;

            sound.click();
            p.isRunning = true;
            p.loaded = 0;

            if (this.dom.progressEventLogBox) {
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
                if (p.loaded >= p.total) {
                    p.loaded = p.total;
                    clearInterval(p.timer);
                    p.isRunning = false;
                    this.updateProgressUI(100, p.loaded, p.total);

                    if (this.dom.progressEventLogBox) {
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
                    const pct = Math.round((p.loaded / p.total) * 100);
                    this.updateProgressUI(pct, p.loaded, p.total);
                    sound.playTone(300 + pct * 5, 'sine', 0.03, 0.02);
                }
            }, 120);
        }

        abortProgressSimulation() {
            const p = AppState.progressSim;
            if (!p.isRunning) return;

            clearInterval(p.timer);
            p.isRunning = false;

            if (this.dom.progressEventLogBox) {
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
            if (this.dom.fileProgressBarFill) this.dom.fileProgressBarFill.style.width = `${pct}%`;
            if (this.dom.progressPercentLabel) this.dom.progressPercentLabel.textContent = `${pct}%`;
            if (this.dom.progressBytesLoaded) {
                this.dom.progressBytesLoaded.textContent = `${(loaded / 1024).toFixed(0)} KB leídos`;
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 8: ANALOGÍAS VISUALES
           -------------------------------------------------------------------------- */
        initAnalogies() {
            this.renderAnalogies();
        }

        renderAnalogies() {
            const mode = AppState.activeAnalogy;
            if (mode === 'traductor') {
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '🎙️';
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'readAsText()';
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'Traducción directa a lenguaje humano';
                if (this.dom.analogyItemsLeft) {
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">El traductor lee una carta y te dicta las palabras en español</div>
                        <div class="ws-item">El resultado es una cadena de texto lista para ser leída y comprendida</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Ideal para archivos de configuración, notas y código';

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🖼️';
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'readAsDataURL()';
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'Telegrama en código Morse (Base64)';
                if (this.dom.analogyItemsRight) {
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Codifica cada pixel en una sola línea continua de caracteres</div>
                        <div class="ws-item highlight-item">No está hecho para personas, sino para que el navegador lo pinte</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Ideal para atributos src en imágenes y miniaturas';

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Comparativa';
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🎙️';
                if (this.dom.analogyBannerText) {
                    this.dom.analogyBannerText.innerHTML = '<strong>readAsText vs readAsDataURL:</strong> Usa <code>readAsText()</code> cuando necesites procesar texto, editar líneas o parsear JSON; usa <code>readAsDataURL()</code> para renderizar recursos visuales sin tocar el backend.';
                }
            } else {
                // Báscula de Granos
                if (this.dom.analogyAvatarLeft) this.dom.analogyAvatarLeft.textContent = '⚖️';
                if (this.dom.analogyTitleLeft) this.dom.analogyTitleLeft.textContent = 'Evento progress';
                if (this.dom.analogySubLeft) this.dom.analogySubLeft.textContent = 'La báscula de pesaje en tiempo real';
                if (this.dom.analogyItemsLeft) {
                    this.dom.analogyItemsLeft.innerHTML = `
                        <div class="ws-item">Mide tonelada por tonelada mientras el grano cae al silo</div>
                        <div class="ws-item">Calcula con precisión milimétrica el porcentaje de avance</div>
                    `;
                }
                if (this.dom.analogyStatusLeft) this.dom.analogyStatusLeft.textContent = 'Permite actualizar barras de carga para feedback fluido';

                if (this.dom.analogyAvatarRight) this.dom.analogyAvatarRight.textContent = '🏁';
                if (this.dom.analogyTitleRight) this.dom.analogyTitleRight.textContent = 'Evento loadend';
                if (this.dom.analogySubRight) this.dom.analogySubRight.textContent = 'El pitido final de cierre de compuerta';
                if (this.dom.analogyItemsRight) {
                    this.dom.analogyItemsRight.innerHTML = `
                        <div class="ws-item highlight-item">Se dispara siempre: con éxito, error o cancelación</div>
                        <div class="ws-item highlight-item">Garantiza que la tolva quede desocupada para el siguiente ciclo</div>
                    `;
                }
                if (this.dom.analogyStatusRight) this.dom.analogyStatusRight.textContent = 'Lugar obligatorio para ocultar spinners y habilitar botones';

                if (this.dom.analogyArrowLabel) this.dom.analogyArrowLabel.textContent = 'Ciclo de Vida';
                if (this.dom.analogyBannerIcon) this.dom.analogyBannerIcon.textContent = '🚚';
                if (this.dom.analogyBannerText) {
                    this.dom.analogyBannerText.innerHTML = '<strong>progress & loadend:</strong> Mantén informados a tus usuarios en archivos pesados calculando <code>(loaded / total) * 100</code> y aprovecha <code>loadend</code> para cerrar modales pase lo que pase.';
                }
            }
        }

        /* --------------------------------------------------------------------------
           SLIDE 9: PLAYGROUND INTERACTIVO
           -------------------------------------------------------------------------- */
        loadCodePreset(presetKey) {
            const code = CodePresets[presetKey];
            if (code && this.dom.liveCodeEditor) {
                this.dom.liveCodeEditor.value = code;
                this.clearConsole();
                this.printToConsole(`/* Preset cargado: [${presetKey}]. Haz clic en "Ejecutar Código" (Ctrl + Enter) */`, 'info-line');
            }
        }

        clearConsole() {
            if (this.dom.consoleLogsContainer) {
                this.dom.consoleLogsContainer.innerHTML = '';
            }
        }

        printToConsole(msg, lineClass = 'log-line') {
            if (!this.dom.consoleLogsContainer) return;
            const line = document.createElement('div');
            line.className = `log-line ${lineClass}`;

            const time = new Date().toLocaleTimeString();
            const timeSpan = `<span class="log-time">[${time}]</span> `;

            if (typeof msg === 'object') {
                try {
                    line.innerHTML = timeSpan + `<pre style="margin:0; display:inline;">${JSON.stringify(msg, null, 2)}</pre>`;
                } catch (e) {
                    line.innerHTML = timeSpan + String(msg);
                }
            } else {
                line.innerHTML = timeSpan + String(msg);
            }

            this.dom.consoleLogsContainer.appendChild(line);
            this.dom.consoleLogsContainer.scrollTop = this.dom.consoleLogsContainer.scrollHeight;
        }

        runPlaygroundCode() {
            if (!this.dom.liveCodeEditor) return;
            const code = this.dom.liveCodeEditor.value;

            this.clearConsole();
            sound.click();

            const oldLog = console.log;
            const oldInfo = console.info;
            const oldWarn = console.warn;
            const oldError = console.error;

            const formatArgs = (args) => {
                return args.map(arg => {
                    if (arg === null) return 'null';
                    if (arg === undefined) return 'undefined';
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg);
                        } catch (e) {
                            return String(arg);
                        }
                    }
                    return String(arg);
                }).join(' ');
            };

            console.log = (...args) => {
                oldLog(...args);
                this.printToConsole(formatArgs(args), 'log-line');
            };
            console.info = (...args) => {
                oldInfo(...args);
                this.printToConsole(formatArgs(args), 'info-line');
            };
            console.warn = (...args) => {
                oldWarn(...args);
                this.printToConsole(formatArgs(args), 'warn-line');
            };
            console.error = (...args) => {
                oldError(...args);
                this.printToConsole(formatArgs(args), 'error-line');
            };

            try {
                const runFn = new Function(code);
                runFn();
                this.printToConsole('--- Ejecución asíncrona despachada sin errores sintácticos ---', 'info-line');
                sound.fileLoaded();
            } catch (err) {
                this.printToConsole(`Error de ejecución: ${err.name} - ${err.message}`, 'error-line');
                sound.error();
            } finally {
                console.log = oldLog;
                console.info = oldInfo;
                console.warn = oldWarn;
                console.error = oldError;
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
                alert('No se pudo copiar automáticamente. Puedes seleccionar el texto de la pantalla.');
            });
        }
    }

    // Inicialización al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        window.appController = new AppController();
    });

})();
