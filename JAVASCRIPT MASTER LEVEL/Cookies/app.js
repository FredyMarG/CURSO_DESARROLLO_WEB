/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WEB WORKERS API
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () {
    // Activamos el modo estricto para garantizar rigor en la ejecución de JavaScript
    'use strict';

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto centralizado que almacena el estado reactivo de la presentación y del laboratorio
    const AppState = {
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 12,
        // Modo de visualización activo: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar efectos sonoros
        soundEnabled: true,
        // Estado de apertura de la ventana modal de vista general
        overviewOpen: false,

        // Estado del laboratorio interactivo de Web Workers
        wwLab: {
            // Referencia a la instancia activa de Worker
            worker: null,
            // Contador de clics realizados en la interfaz principal para probar fluidez
            uiClicks: 0,
            // Marca de tiempo de inicio del cálculo para medir duración
            startTime: 0
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin archivos externos
    const SoundFX = {
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio tras la primera acción del usuario
        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioConstructor = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioConstructor();
            }
        },

        // Sonido suave de transición entre diapositivas
        slide() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const now = this.ctx.currentTime;

            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        },

        // Sonido breve de clic para botones
        click() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            const now = this.ctx.currentTime;

            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        },

        // Tono de confirmación cuando el Worker devuelve el resultado
        complete() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const now = this.ctx.currentTime;

            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, atajos de teclado y modal de índice
    const SlideNavigation = {
        // Inicializa referencias del DOM y eventos
        init() {
            this.wrapper = document.getElementById('presentationWrapper');
            this.slides = document.querySelectorAll('.slide');
            this.progressBar = document.getElementById('progressBar');
            this.slideIndicator = document.getElementById('slideIndicator');

            this.btnPrev = document.getElementById('btnPrevSlide');
            this.btnNext = document.getElementById('btnNextSlide');
            this.dotsContainer = document.getElementById('slideDotsContainer');

            this.btnGoLab = document.getElementById('btnGoLab');
            this.btnToggleMode = document.getElementById('btnToggleMode');
            this.modeText = document.getElementById('modeText');
            this.modeIcon = document.getElementById('modeIcon');

            this.btnToggleSound = document.getElementById('btnToggleSound');
            this.soundIcon = document.getElementById('soundIcon');

            this.btnOverview = document.getElementById('btnOverview');
            this.overviewModal = document.getElementById('overviewModal');
            this.btnCloseOverview = document.getElementById('btnCloseOverview');
            this.overviewGrid = document.getElementById('overviewGrid');

            this.btnFullscreen = document.getElementById('btnFullscreen');

            this.buildSlideDots();
            this.buildOverviewGrid();
            this.bindEvents();
            this.updateUI();
        },

        // Construye los puntos de paginación inferiores
        buildSlideDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';

            this.slides.forEach((slide, index) => {
                const slideNum = index + 1;
                const dot = document.createElement('button');
                dot.className = 'slide-dot';
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`);
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                if (slideNum === AppState.currentSlide) {
                    dot.classList.add('active');
                }

                dot.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(slideNum);
                });

                this.dotsContainer.appendChild(dot);
            });
        },

        // Construye las miniaturas del modal de índice general
        buildOverviewGrid() {
            if (!this.overviewGrid) return;
            this.overviewGrid.innerHTML = '';

            this.slides.forEach((slide, index) => {
                const slideNum = index + 1;
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                const card = document.createElement('div');
                card.className = 'overview-card';
                card.dataset.slideIndex = slideNum;

                if (slideNum === AppState.currentSlide) {
                    card.classList.add('active');
                }

                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                card.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(slideNum);
                    this.closeOverview();
                });

                this.overviewGrid.appendChild(card);
            });
        },

        // Registra eventos de botones y teclado
        bindEvents() {
            if (this.btnPrev) {
                this.btnPrev.addEventListener('click', () => {
                    SoundFX.click();
                    this.prevSlide();
                });
            }

            if (this.btnNext) {
                this.btnNext.addEventListener('click', () => {
                    SoundFX.click();
                    this.nextSlide();
                });
            }

            if (this.btnGoLab) {
                this.btnGoLab.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(9);
                });
            }

            if (this.btnToggleMode) {
                this.btnToggleMode.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleViewMode();
                });
            }

            if (this.btnToggleSound) {
                this.btnToggleSound.addEventListener('click', () => {
                    this.toggleSound();
                });
            }

            if (this.btnOverview) {
                this.btnOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleOverview();
                });
            }

            if (this.btnCloseOverview) {
                this.btnCloseOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.closeOverview();
                });
            }

            if (this.overviewModal) {
                this.overviewModal.addEventListener('click', (e) => {
                    if (e.target === this.overviewModal) {
                        this.closeOverview();
                    }
                });
            }

            if (this.btnFullscreen) {
                this.btnFullscreen.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleFullscreen();
                });
            }

            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        // Procesa atajos de teclado ignorando campos de texto
        handleKeyDown(e) {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'o':
                case 'O':
                    e.preventDefault();
                    this.toggleOverview();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (AppState.overviewOpen) this.closeOverview();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(AppState.totalSlides);
                    break;
                default:
                    break;
            }
        },

        goToSlide(index) {
            if (index < 1 || index > AppState.totalSlides) return;
            if (index === AppState.currentSlide) return;
            AppState.currentSlide = index;
            SoundFX.slide();
            this.updateUI();
        },

        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) {
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        prevSlide() {
            if (AppState.currentSlide > 1) {
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        toggleViewMode() {
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';

            if (AppState.viewMode === 'guide') {
                document.body.classList.remove('mode-presentation');
                document.body.classList.add('mode-document');
                if (this.modeText) this.modeText.textContent = 'Modo Diapos';
                if (this.modeIcon) this.modeIcon.textContent = '🖥️';
            } else {
                document.body.classList.remove('mode-document');
                document.body.classList.add('mode-presentation');
                if (this.modeText) this.modeText.textContent = 'Modo Guía';
                if (this.modeIcon) this.modeIcon.textContent = '📑';
            }

            this.updateUI();
        },

        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.soundIcon) {
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
            if (AppState.soundEnabled) SoundFX.click();
        },

        toggleOverview() {
            if (AppState.overviewOpen) {
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        openOverview() {
            AppState.overviewOpen = true;
            if (this.overviewModal) this.overviewModal.classList.add('active');
            const cards = document.querySelectorAll('.overview-card');
            cards.forEach(card => {
                const idx = parseInt(card.dataset.slideIndex, 10);
                card.classList.toggle('active', idx === AppState.currentSlide);
            });
        },

        closeOverview() {
            AppState.overviewOpen = false;
            if (this.overviewModal) this.overviewModal.classList.remove('active');
        },

        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        },

        updateUI() {
            if (AppState.viewMode === 'slides') {
                this.slides.forEach((slide, index) => {
                    const slideNum = index + 1;
                    if (slideNum === AppState.currentSlide) {
                        slide.classList.add('active');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        slide.classList.remove('active');
                    }
                });
            } else {
                this.slides.forEach(slide => slide.classList.add('active'));
            }

            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100;
            if (this.progressBar) this.progressBar.style.width = `${percent}%`;

            if (this.slideIndicator) {
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
            }

            const dots = document.querySelectorAll('.slide-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide);
            });

            if (this.btnPrev) {
                this.btnPrev.disabled = AppState.currentSlide === 1;
                this.btnPrev.style.opacity = AppState.currentSlide === 1 ? '0.35' : '1';
            }
            if (this.btnNext) {
                this.btnNext.disabled = AppState.currentSlide === AppState.totalSlides;
                this.btnNext.style.opacity = AppState.currentSlide === AppState.totalSlides ? '0.35' : '1';
            }
        }
    };

    /* ==========================================================================
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE WEB WORKERS (WWLabController)
       ========================================================================== */
    // Gestiona la ejecución real de un Worker en segundo plano y mide la fluidez del hilo principal
    const WWLabController = {
        // Inicializa referencias del DOM y vincula controles
        init() {
            this.banner = document.getElementById('wwStatusBanner');
            this.statusText = document.getElementById('wwStatusText');
            this.badgeState = document.getElementById('wwBadgeState');

            this.uiClicksEl = document.getElementById('wwUiClicks');
            this.workerResultEl = document.getElementById('wwWorkerResult');
            this.elapsedTimeEl = document.getElementById('wwElapsedTime');

            this.btnStart = document.getElementById('btnStartWorker');
            this.btnTestUi = document.getElementById('btnTestUiFluency');
            this.btnTerminate = document.getElementById('btnTerminateWorker');
            this.btnClearLogs = document.getElementById('btnClearWwLogs');
            this.terminal = document.getElementById('wwLogTerminal');

            this.bindControls();
        },

        // Crea una instancia de Worker compatible tanto con localhost (worker.js) como con file:// (Blob)
        createWorkerInstance() {
            try {
                // Si estamos bajo protocolo http/https usamos el archivo externo worker.js directamente
                if (window.location.protocol !== 'file:') {
                    return new Worker('worker.js', { name: 'worker-calculo-intensivo' });
                }
            } catch (_) {
                // Si falla por seguridad local, continuamos hacia el respaldo con Blob
            }

            // Respaldo dinámico mediante Blob para que funcione incluso abriendo index.html con doble clic
            const workerCode = `
                self.onmessage = (e) => {
                    const { iteraciones } = e.data;
                    let suma = 0;
                    for (let i = 0; i < iteraciones; i++) {
                        suma += i;
                    }
                    self.postMessage(suma);
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);
            return new Worker(blobUrl, { name: 'worker-calculo-blob' });
        },

        // Vincula los eventos de los botones del laboratorio
        bindControls() {
            // Botón para probar que la interfaz nunca se congela durante el cálculo
            if (this.btnTestUi) {
                this.btnTestUi.addEventListener('click', () => {
                    SoundFX.click();
                    AppState.wwLab.uiClicks++;
                    if (this.uiClicksEl) this.uiClicksEl.textContent = AppState.wwLab.uiClicks;
                });
            }

            // Botón para iniciar el cálculo pesado en el Web Worker
            if (this.btnStart) {
                this.btnStart.addEventListener('click', () => {
                    SoundFX.click();

                    if (typeof window.Worker === 'undefined') {
                        this.log('❌ Tu navegador no soporta Web Workers.');
                        return;
                    }

                    // Si existía un worker previo, lo limpiamos antes de crear uno nuevo
                    this.cleanupWorker();

                    // Actualizamos interfaz al estado de ejecución
                    if (this.banner) this.banner.className = 'ww-status-banner is-running';
                    if (this.statusText) this.statusText.textContent = 'Calculando 500,000,000 iteraciones en hilo secundario...';
                    if (this.badgeState) {
                        this.badgeState.textContent = 'Ejecutando ⚙️';
                        this.badgeState.className = 'badge badge-cyan';
                    }
                    if (this.workerResultEl) this.workerResultEl.textContent = 'Calculando...';
                    if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = '...';

                    this.btnStart.disabled = true;
                    if (this.btnTerminate) this.btnTerminate.disabled = false;

                    // Creamos el worker y guardamos el tiempo de inicio
                    AppState.wwLab.startTime = performance.now();
                    const worker = this.createWorkerInstance();
                    AppState.wwLab.worker = worker;

                    this.log('🚀 [main.js -> worker] postMessage({ iteraciones: 500000000 }) enviado.');
                    worker.postMessage({ iteraciones: 500_000_000 });

                    // Escuchamos la respuesta final del hilo secundario
                    worker.onmessage = (e) => {
                        const elapsed = Math.round(performance.now() - AppState.wwLab.startTime);
                        if (this.banner) this.banner.className = 'ww-status-banner is-done';
                        if (this.statusText) this.statusText.textContent = 'Cálculo completado sin congelar el Main Thread.';
                        if (this.badgeState) {
                            this.badgeState.textContent = 'Completado ✅';
                            this.badgeState.className = 'badge badge-emerald';
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = e.data.toLocaleString('es-ES');
                        if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = `${elapsed} ms`;

                        SoundFX.complete();
                        this.log(`📥 [onmessage] Resultado recibido en ${elapsed} ms: ${e.data.toLocaleString('es-ES')}`);
                        this.cleanupWorker();
                    };

                    // Capturamos posibles errores del worker
                    worker.onerror = (err) => {
                        if (this.banner) this.banner.className = 'ww-status-banner';
                        if (this.statusText) this.statusText.textContent = `Error en worker: ${err.message}`;
                        this.log(`❌ [onerror] Fallo en el hilo secundario: ${err.message}`);
                        this.cleanupWorker();
                    };
                });
            }

            // Botón para abortar manualmente el worker con terminate()
            if (this.btnTerminate) {
                this.btnTerminate.addEventListener('click', () => {
                    SoundFX.click();
                    if (AppState.wwLab.worker) {
                        this.cleanupWorker();
                        if (this.banner) this.banner.className = 'ww-status-banner';
                        if (this.statusText) this.statusText.textContent = 'Worker destruido manualmente con terminate().';
                        if (this.badgeState) {
                            this.badgeState.textContent = 'Terminado 🛑';
                            this.badgeState.className = 'badge badge-purple';
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = 'Abortado';
                        this.log('🛑 [worker.terminate()] Hilo secundario destruido inmediatamente.');
                    }
                });
            }

            // Botón para limpiar el terminal del laboratorio
            if (this.btnClearLogs) {
                this.btnClearLogs.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.terminal) {
                        this.terminal.innerHTML = '';
                        this.log('🧹 Terminal de eventos limpiado.');
                    }
                });
            }
        },

        // Termina la instancia activa del worker y restablece los botones
        cleanupWorker() {
            if (AppState.wwLab.worker) {
                AppState.wwLab.worker.terminate();
                AppState.wwLab.worker = null;
            }
            if (this.btnStart) this.btnStart.disabled = false;
            if (this.btnTerminate) this.btnTerminate.disabled = true;
        },

        // Registra una línea con marca temporal en el terminal
        log(message) {
            if (!this.terminal) return;

            const now = new Date();
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div');
            line.className = 'ww-log-line';
            line.innerHTML = `
                <span class="ww-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            this.terminal.appendChild(line);
            this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    function startApplication() {
        SlideNavigation.init();
        WWLabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
