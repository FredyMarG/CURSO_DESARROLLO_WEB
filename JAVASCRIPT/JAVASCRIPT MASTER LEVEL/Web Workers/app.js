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
    'use strict'; // Activa el modo estricto de JavaScript

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
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa variable local
                this.ctx = new AudioConstructor();
            }
        },

        // Sonido suave de transición entre diapositivas
        slide() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'sine';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

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
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'triangle';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

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
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'sine';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

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
            this.wrapper = document.getElementById('presentationWrapper'); // Obtiene referencia al elemento del DOM
            this.slides = document.querySelectorAll('.slide'); // Obtiene referencia al elemento del DOM
            this.progressBar = document.getElementById('progressBar'); // Obtiene referencia al elemento del DOM
            this.slideIndicator = document.getElementById('slideIndicator'); // Obtiene referencia al elemento del DOM

            this.btnPrev = document.getElementById('btnPrevSlide'); // Obtiene referencia al elemento del DOM
            this.btnNext = document.getElementById('btnNextSlide'); // Obtiene referencia al elemento del DOM
            this.dotsContainer = document.getElementById('slideDotsContainer'); // Obtiene referencia al elemento del DOM

            this.btnGoLab = document.getElementById('btnGoLab'); // Obtiene referencia al elemento del DOM
            this.btnToggleMode = document.getElementById('btnToggleMode'); // Obtiene referencia al elemento del DOM
            this.modeText = document.getElementById('modeText'); // Obtiene referencia al elemento del DOM
            this.modeIcon = document.getElementById('modeIcon'); // Obtiene referencia al elemento del DOM

            this.btnToggleSound = document.getElementById('btnToggleSound'); // Obtiene referencia al elemento del DOM
            this.soundIcon = document.getElementById('soundIcon'); // Obtiene referencia al elemento del DOM

            this.btnOverview = document.getElementById('btnOverview'); // Obtiene referencia al elemento del DOM
            this.overviewModal = document.getElementById('overviewModal'); // Obtiene referencia al elemento del DOM
            this.btnCloseOverview = document.getElementById('btnCloseOverview'); // Obtiene referencia al elemento del DOM
            this.overviewGrid = document.getElementById('overviewGrid'); // Obtiene referencia al elemento del DOM

            this.btnFullscreen = document.getElementById('btnFullscreen'); // Obtiene referencia al elemento del DOM

            this.buildSlideDots();
            this.buildOverviewGrid();
            this.bindEvents();
            this.updateUI();
        },

        // Construye los puntos de paginación inferiores
        buildSlideDots() {
            if (!this.dotsContainer) return; // Evalúa condición lógica
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            this.slides.forEach((slide, index) => {
                const slideNum = index + 1; // Declara e inicializa variable local
                const dot = document.createElement('button'); // Declara e inicializa variable local
                dot.className = 'slide-dot';
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`);
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                if (slideNum === AppState.currentSlide) { // Evalúa condición lógica
                    dot.classList.add('active');
                }

                dot.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.goToSlide(slideNum);
                });

                this.dotsContainer.appendChild(dot);
            });
        },

        // Construye las miniaturas del modal de índice general
        buildOverviewGrid() {
            if (!this.overviewGrid) return; // Evalúa condición lógica
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            this.slides.forEach((slide, index) => {
                const slideNum = index + 1; // Declara e inicializa variable local
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Declara e inicializa variable local

                const card = document.createElement('div'); // Declara e inicializa variable local
                card.className = 'overview-card';
                card.dataset.slideIndex = slideNum;

                if (slideNum === AppState.currentSlide) { // Evalúa condición lógica
                    card.classList.add('active');
                }

                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                card.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.goToSlide(slideNum);
                    this.closeOverview();
                });

                this.overviewGrid.appendChild(card);
            });
        },

        // Registra eventos de botones y teclado
        bindEvents() {
            if (this.btnPrev) { // Evalúa condición lógica
                this.btnPrev.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.prevSlide();
                });
            }

            if (this.btnNext) { // Evalúa condición lógica
                this.btnNext.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.nextSlide();
                });
            }

            if (this.btnGoLab) { // Evalúa condición lógica
                this.btnGoLab.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.goToSlide(9);
                });
            }

            if (this.btnToggleMode) { // Evalúa condición lógica
                this.btnToggleMode.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.toggleViewMode();
                });
            }

            if (this.btnToggleSound) { // Evalúa condición lógica
                this.btnToggleSound.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    this.toggleSound();
                });
            }

            if (this.btnOverview) { // Evalúa condición lógica
                this.btnOverview.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.toggleOverview();
                });
            }

            if (this.btnCloseOverview) { // Evalúa condición lógica
                this.btnCloseOverview.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.closeOverview();
                });
            }

            if (this.overviewModal) { // Evalúa condición lógica
                this.overviewModal.addEventListener('click', (e) => { // Registra escuchador de evento en el DOM
                    if (e.target === this.overviewModal) { // Evalúa condición lógica
                        this.closeOverview();
                    }
                });
            }

            if (this.btnFullscreen) { // Evalúa condición lógica
                this.btnFullscreen.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.toggleFullscreen();
                });
            }

            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        // Procesa atajos de teclado ignorando campos de texto
        handleKeyDown(e) {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; // Evalúa condición lógica

            switch (e.key) { // Evalúa múltiples casos
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
                    if (AppState.overviewOpen) this.closeOverview(); // Evalúa condición lógica
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
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición lógica
            if (index === AppState.currentSlide) return; // Evalúa condición lógica
            AppState.currentSlide = index;
            SoundFX.slide();
            this.updateUI();
        },

        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición lógica
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        prevSlide() {
            if (AppState.currentSlide > 1) { // Evalúa condición lógica
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        toggleViewMode() {
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';

            if (AppState.viewMode === 'guide') { // Evalúa condición lógica
                document.body.classList.remove('mode-presentation');
                document.body.classList.add('mode-document');
                if (this.modeText) this.modeText.textContent = 'Modo Diapos'; // Evalúa condición lógica
                if (this.modeIcon) this.modeIcon.textContent = '🖥️'; // Evalúa condición lógica
            } else {
                document.body.classList.remove('mode-document');
                document.body.classList.add('mode-presentation');
                if (this.modeText) this.modeText.textContent = 'Modo Guía'; // Evalúa condición lógica
                if (this.modeIcon) this.modeIcon.textContent = '📑'; // Evalúa condición lógica
            }

            this.updateUI();
        },

        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.soundIcon) { // Evalúa condición lógica
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            if (AppState.soundEnabled) SoundFX.click(); // Evalúa condición lógica
        },

        toggleOverview() {
            if (AppState.overviewOpen) { // Evalúa condición lógica
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        openOverview() {
            AppState.overviewOpen = true;
            if (this.overviewModal) this.overviewModal.classList.add('active'); // Evalúa condición lógica
            const cards = document.querySelectorAll('.overview-card'); // Declara e inicializa variable local
            cards.forEach(card => {
                const idx = parseInt(card.dataset.slideIndex, 10); // Declara e inicializa variable local
                card.classList.toggle('active', idx === AppState.currentSlide);
            });
        },

        closeOverview() {
            AppState.overviewOpen = false;
            if (this.overviewModal) this.overviewModal.classList.remove('active'); // Evalúa condición lógica
        },

        toggleFullscreen() {
            if (!document.fullscreenElement) { // Evalúa condición lógica
                document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        },

        updateUI() {
            if (AppState.viewMode === 'slides') { // Evalúa condición lógica
                this.slides.forEach((slide, index) => {
                    const slideNum = index + 1; // Declara e inicializa variable local
                    if (slideNum === AppState.currentSlide) { // Evalúa condición lógica
                        slide.classList.add('active');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        slide.classList.remove('active');
                    }
                });
            } else {
                this.slides.forEach(slide => slide.classList.add('active'));
            }

            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100; // Declara e inicializa variable local
            if (this.progressBar) this.progressBar.style.width = `${percent}%`; // Evalúa condición lógica

            if (this.slideIndicator) { // Evalúa condición lógica
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            const dots = document.querySelectorAll('.slide-dot'); // Declara e inicializa variable local
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide);
            });

            if (this.btnPrev) { // Evalúa condición lógica
                this.btnPrev.disabled = AppState.currentSlide === 1;
                this.btnPrev.style.opacity = AppState.currentSlide === 1 ? '0.35' : '1';
            }
            if (this.btnNext) { // Evalúa condición lógica
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
            this.banner = document.getElementById('wwStatusBanner'); // Obtiene referencia al elemento del DOM
            this.statusText = document.getElementById('wwStatusText'); // Obtiene referencia al elemento del DOM
            this.badgeState = document.getElementById('wwBadgeState'); // Obtiene referencia al elemento del DOM

            this.uiClicksEl = document.getElementById('wwUiClicks'); // Obtiene referencia al elemento del DOM
            this.workerResultEl = document.getElementById('wwWorkerResult'); // Obtiene referencia al elemento del DOM
            this.elapsedTimeEl = document.getElementById('wwElapsedTime'); // Obtiene referencia al elemento del DOM

            this.btnStart = document.getElementById('btnStartWorker'); // Obtiene referencia al elemento del DOM
            this.btnTestUi = document.getElementById('btnTestUiFluency'); // Obtiene referencia al elemento del DOM
            this.btnTerminate = document.getElementById('btnTerminateWorker'); // Obtiene referencia al elemento del DOM
            this.btnClearLogs = document.getElementById('btnClearWwLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('wwLogTerminal'); // Obtiene referencia al elemento del DOM

            this.bindControls();
        },

        // Crea una instancia de Worker compatible tanto con localhost (worker.js) como con file:// (Blob)
        createWorkerInstance() {
            try { // Inicia bloque protegido contra errores
                // Si estamos bajo protocolo http/https usamos el archivo externo worker.js directamente
                if (window.location.protocol !== 'file:') { // Evalúa condición lógica
                    return new Worker('worker.js', { name: 'worker-calculo-intensivo' }); // Retorna el resultado de la función
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
            const blob = new Blob([workerCode], { type: 'application/javascript' }); // Declara e inicializa variable local
            const blobUrl = URL.createObjectURL(blob); // Declara e inicializa variable local
            return new Worker(blobUrl, { name: 'worker-calculo-blob' }); // Retorna el resultado de la función
        },

        // Vincula los eventos de los botones del laboratorio
        bindControls() {
            // Botón para probar que la interfaz nunca se congela durante el cálculo
            if (this.btnTestUi) { // Evalúa condición lógica
                this.btnTestUi.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    AppState.wwLab.uiClicks++;
                    if (this.uiClicksEl) this.uiClicksEl.textContent = AppState.wwLab.uiClicks; // Evalúa condición lógica
                });
            }

            // Botón para iniciar el cálculo pesado en el Web Worker
            if (this.btnStart) { // Evalúa condición lógica
                this.btnStart.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();

                    if (typeof window.Worker === 'undefined') { // Evalúa condición lógica
                        this.log('❌ Tu navegador no soporta Web Workers.');
                        return; // Retorna el resultado de la función
                    }

                    // Si existía un worker previo, lo limpiamos antes de crear uno nuevo
                    this.cleanupWorker();

                    // Actualizamos interfaz al estado de ejecución
                    if (this.banner) this.banner.className = 'ww-status-banner is-running'; // Evalúa condición lógica
                    if (this.statusText) this.statusText.textContent = 'Calculando 500,000,000 iteraciones en hilo secundario...'; // Evalúa condición lógica
                    if (this.badgeState) { // Evalúa condición lógica
                        this.badgeState.textContent = 'Ejecutando ⚙️'; // Actualiza contenido en el DOM
                        this.badgeState.className = 'badge badge-cyan';
                    }
                    if (this.workerResultEl) this.workerResultEl.textContent = 'Calculando...'; // Evalúa condición lógica
                    if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = '...'; // Evalúa condición lógica

                    this.btnStart.disabled = true;
                    if (this.btnTerminate) this.btnTerminate.disabled = false; // Evalúa condición lógica

                    // Creamos el worker y guardamos el tiempo de inicio
                    AppState.wwLab.startTime = performance.now();
                    const worker = this.createWorkerInstance(); // Declara e inicializa variable local
                    AppState.wwLab.worker = worker;

                    this.log('🚀 [main.js -> worker] postMessage({ iteraciones: 500000000 }) enviado.');
                    worker.postMessage({ iteraciones: 500_000_000 });

                    // Escuchamos la respuesta final del hilo secundario
                    worker.onmessage = (e) => {
                        const elapsed = Math.round(performance.now() - AppState.wwLab.startTime); // Declara e inicializa variable local
                        if (this.banner) this.banner.className = 'ww-status-banner is-done'; // Evalúa condición lógica
                        if (this.statusText) this.statusText.textContent = 'Cálculo completado sin congelar el Main Thread.'; // Evalúa condición lógica
                        if (this.badgeState) { // Evalúa condición lógica
                            this.badgeState.textContent = 'Completado ✅'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-emerald';
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = e.data.toLocaleString('es-ES'); // Evalúa condición lógica
                        if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = `${elapsed} ms`; // Evalúa condición lógica

                        SoundFX.complete();
                        this.log(`📥 [onmessage] Resultado recibido en ${elapsed} ms: ${e.data.toLocaleString('es-ES')}`);
                        this.cleanupWorker();
                    };

                    // Capturamos posibles errores del worker
                    worker.onerror = (err) => {
                        if (this.banner) this.banner.className = 'ww-status-banner'; // Evalúa condición lógica
                        if (this.statusText) this.statusText.textContent = `Error en worker: ${err.message}`; // Evalúa condición lógica
                        this.log(`❌ [onerror] Fallo en el hilo secundario: ${err.message}`);
                        this.cleanupWorker();
                    };
                });
            }

            // Botón para abortar manualmente el worker con terminate()
            if (this.btnTerminate) { // Evalúa condición lógica
                this.btnTerminate.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (AppState.wwLab.worker) { // Evalúa condición lógica
                        this.cleanupWorker();
                        if (this.banner) this.banner.className = 'ww-status-banner'; // Evalúa condición lógica
                        if (this.statusText) this.statusText.textContent = 'Worker destruido manualmente con terminate().'; // Evalúa condición lógica
                        if (this.badgeState) { // Evalúa condición lógica
                            this.badgeState.textContent = 'Terminado 🛑'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-purple';
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = 'Abortado'; // Evalúa condición lógica
                        this.log('🛑 [worker.terminate()] Hilo secundario destruido inmediatamente.');
                    }
                });
            }

            // Botón para limpiar el terminal del laboratorio
            if (this.btnClearLogs) { // Evalúa condición lógica
                this.btnClearLogs.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.terminal) { // Evalúa condición lógica
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal de eventos limpiado.');
                    }
                });
            }
        },

        // Termina la instancia activa del worker y restablece los botones
        cleanupWorker() {
            if (AppState.wwLab.worker) { // Evalúa condición lógica
                AppState.wwLab.worker.terminate();
                AppState.wwLab.worker = null;
            }
            if (this.btnStart) this.btnStart.disabled = false; // Evalúa condición lógica
            if (this.btnTerminate) this.btnTerminate.disabled = true; // Evalúa condición lógica
        },

        // Registra una línea con marca temporal en el terminal
        log(message) {
            if (!this.terminal) return; // Evalúa condición lógica

            const now = new Date(); // Declara e inicializa variable local
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div'); // Declara e inicializa variable local
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
    function startApplication() { // Define función reutilizable
        SlideNavigation.init();
        WWLabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

