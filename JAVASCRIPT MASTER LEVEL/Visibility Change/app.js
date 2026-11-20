/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: PAGE VISIBILITY API (visibilitychange)
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
    // Objeto centralizado que almacena el estado reactivo de la presentación y el laboratorio
    const AppState = {
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 12,
        // Modo de visualización activo: 'slides' (diapositivas) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar los efectos sonoros
        soundEnabled: true,
        // Estado de apertura del modal de vista general
        overviewOpen: false,

        // Estado del laboratorio interactivo de Page Visibility API
        vcLab: {
            // Estado lógico actual ("visible" o "hidden")
            currentState: 'visible',
            // Contador de segundos transcurridos con la pestaña visible
            activeSeconds: 0,
            // Contador de segundos transcurridos con la pestaña oculta
            hiddenSeconds: 0,
            // Contador total de cambios de visibilidad detectados
            switchCount: 0,
            // Estado del reproductor inteligente: reproduciendo o pausado
            isPlaying: true,
            // Bandera para recordar si fue pausado automáticamente al ocultar la pestaña
            pausedBySystem: false,
            // Título original de la pestaña para restaurarlo al volver
            originalTitle: document.title
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin archivos externos
    const SoundFX = {
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio de forma segura tras la primera acción del usuario
        init() {
            // Verificamos si no existe contexto aún y el navegador soporta AudioContext
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                // Obtenemos el constructor estándar o con prefijo WebKit
                const AudioConstructor = window.AudioContext || window.webkitAudioContext;
                // Creamos la instancia del contexto de audio
                this.ctx = new AudioConstructor();
            }
        },

        // Sonido suave de transición al cambiar de diapositiva
        slide() {
            // Si el sonido está desactivado, salimos
            if (!AppState.soundEnabled) return;
            // Inicializamos el contexto si es necesario
            this.init();
            // Validamos soporte
            if (!this.ctx) return;
            // Reanudamos si el navegador suspendió el contexto
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos oscilador y nodo de ganancia
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Onda senoidal suave
            osc.type = 'sine';
            // Tiempo actual del reloj de audio
            const now = this.ctx.currentTime;

            // Frecuencia ascendente de 320 Hz a 480 Hz
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

            // Envolvente de volumen suave
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

            // Conexiones y reproducción
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        },

        // Sonido breve de clic para botones
        click() {
            // Salimos si el sonido está apagado
            if (!AppState.soundEnabled) return;
            // Inicializamos
            this.init();
            // Validamos
            if (!this.ctx) return;
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos oscilador y ganancia
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Onda triangular percusiva
            osc.type = 'triangle';
            // Marca temporal
            const now = this.ctx.currentTime;

            // Tono agudo corto de 600 Hz
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            // Conexión y disparo
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        },

        // Tono notificatorio cuando el usuario regresa a la pestaña visible
        welcomeBack() {
            // Verificamos si el audio está activo
            if (!AppState.soundEnabled) return;
            // Inicializamos
            this.init();
            // Validamos
            if (!this.ctx) return;
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos oscilador y ganancia
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Onda senoidal limpia
            osc.type = 'sine';
            // Tiempo actual
            const now = this.ctx.currentTime;

            // Tono de bienvenida de 520 Hz a 780 Hz
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

            // Conexión y ejecución
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, teclado, modo guía y modal de índice
    const SlideNavigation = {
        // Inicializa referencias del DOM y eventos
        init() {
            // Contenedor principal y diapositivas
            this.wrapper = document.getElementById('presentationWrapper');
            this.slides = document.querySelectorAll('.slide');
            // Barra de progreso y etiqueta de página
            this.progressBar = document.getElementById('progressBar');
            this.slideIndicator = document.getElementById('slideIndicator');

            // Controles inferiores
            this.btnPrev = document.getElementById('btnPrevSlide');
            this.btnNext = document.getElementById('btnNextSlide');
            this.dotsContainer = document.getElementById('slideDotsContainer');

            // Botón de alternancia de modo presentación / guía
            this.btnToggleMode = document.getElementById('btnToggleMode');
            this.modeText = document.getElementById('modeText');
            this.modeIcon = document.getElementById('modeIcon');

            // Botón de audio
            this.btnToggleSound = document.getElementById('btnToggleSound');
            this.soundIcon = document.getElementById('soundIcon');

            // Modal de índice general
            this.btnOverview = document.getElementById('btnOverview');
            this.overviewModal = document.getElementById('overviewModal');
            this.btnCloseOverview = document.getElementById('btnCloseOverview');
            this.overviewGrid = document.getElementById('overviewGrid');

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen');

            // Generamos puntos inferiores y tarjetas del modal
            this.buildSlideDots();
            this.buildOverviewGrid();
            // Vinculamos eventos de interacción
            this.bindEvents();
            // Refrescamos interfaz inicial
            this.updateUI();
        },

        // Construye los puntos de paginación inferiores
        buildSlideDots() {
            // Validamos existencia
            if (!this.dotsContainer) return;
            // Limpiamos contenido previo
            this.dotsContainer.innerHTML = '';

            // Iteramos sobre las diapositivas
            this.slides.forEach((slide, index) => {
                const slideNum = index + 1;
                const dot = document.createElement('button');
                dot.className = 'slide-dot';
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`);
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                // Resaltamos el punto activo
                if (slideNum === AppState.currentSlide) {
                    dot.classList.add('active');
                }

                // Saltamos a la diapositiva al hacer clic
                dot.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(slideNum);
                });

                // Insertamos en el DOM
                this.dotsContainer.appendChild(dot);
            });
        },

        // Construye las miniaturas del modal de vista general
        buildOverviewGrid() {
            // Validamos existencia
            if (!this.overviewGrid) return;
            // Vaciamos rejilla previa
            this.overviewGrid.innerHTML = '';

            // Creamos una tarjeta por cada diapositiva
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

        // Registra todos los escuchadores de eventos de controles y teclado
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

            // Atajos de teclado
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        // Procesa atajos de teclado para navegar cómodamente
        handleKeyDown(e) {
            // No interferimos si el foco está en un campo de entrada
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

        // Cambia a la diapositiva solicitada
        goToSlide(index) {
            if (index < 1 || index > AppState.totalSlides) return;
            if (index === AppState.currentSlide) return;
            AppState.currentSlide = index;
            SoundFX.slide();
            this.updateUI();
        },

        // Avanza una diapositiva
        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) {
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        // Retrocede una diapositiva
        prevSlide() {
            if (AppState.currentSlide > 1) {
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        // Alterna entre modo presentación y modo documento continuo
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

        // Activa o desactiva el sonido
        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.soundIcon) {
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
            if (AppState.soundEnabled) SoundFX.click();
        },

        // Alterna la ventana modal de índice
        toggleOverview() {
            if (AppState.overviewOpen) {
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        // Abre el modal de vista general
        openOverview() {
            AppState.overviewOpen = true;
            if (this.overviewModal) this.overviewModal.classList.add('active');
            const cards = document.querySelectorAll('.overview-card');
            cards.forEach(card => {
                const idx = parseInt(card.dataset.slideIndex, 10);
                card.classList.toggle('active', idx === AppState.currentSlide);
            });
        },

        // Cierra el modal de vista general
        closeOverview() {
            AppState.overviewOpen = false;
            if (this.overviewModal) this.overviewModal.classList.remove('active');
        },

        // Alterna pantalla completa nativa
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        },

        // Actualiza visibilidad de diapositivas, barra de progreso y botones
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE VISIBILITYCHANGE
       ========================================================================== */
    // Escucha el evento real document.visibilitychange y simula el reproductor inteligente
    const VCLabController = {
        // Inicializa referencias, contadores y escuchadores nativos
        init() {
            // Referencias del banner de estado
            this.banner = document.getElementById('vcStatusBanner');
            this.stateText = document.getElementById('vcStateText');
            this.hiddenBadge = document.getElementById('vcHiddenBadge');

            // Referencias de tarjetas de métricas
            this.activeSecondsEl = document.getElementById('vcActiveSeconds');
            this.hiddenSecondsEl = document.getElementById('vcHiddenSeconds');
            this.switchCountEl = document.getElementById('vcSwitchCount');

            // Referencias del reproductor inteligente
            this.playerTitle = document.getElementById('vcPlayerTitle');
            this.playerSub = document.getElementById('vcPlayerSub');
            this.btnTogglePlayer = document.getElementById('btnTogglePlayer');

            // Botones de simulación y terminal
            this.btnSimHide = document.getElementById('btnSimHide');
            this.btnSimShow = document.getElementById('btnSimShow');
            this.btnClearLogs = document.getElementById('btnClearVcLogs');
            this.terminal = document.getElementById('vcLogTerminal');

            // Vinculamos el evento real visibilitychange sobre document
            this.bindVisibilityEvent();
            // Vinculamos botones del laboratorio
            this.bindControls();
            // Iniciamos el cronómetro de tiempo activo vs oculto (1 segundo)
            this.startMetricsTimer();
            // Sincronizamos el estado inicial en la UI
            this.updateUI();
        },

        // Registra el escuchador nativo del navegador sobre document
        bindVisibilityEvent() {
            document.addEventListener('visibilitychange', () => {
                // Delegamos el manejo al método común pasando el estado real del navegador
                this.handleVisibilityChange(document.visibilityState, false);
            });
        },

        // Procesa una transición de estado (real o simulada)
        handleVisibilityChange(newState, isSimulated) {
            // Actualizamos el estado guardado
            AppState.vcLab.currentState = newState;
            // Incrementamos el contador de cambios detectados
            AppState.vcLab.switchCount++;

            // Evaluamos si pasó a segundo plano ("hidden") o regresó a primer plano ("visible")
            if (newState === 'hidden') {
                // Si el reproductor estaba activo, lo pausamos automáticamente
                if (AppState.vcLab.isPlaying) {
                    AppState.vcLab.isPlaying = false;
                    AppState.vcLab.pausedBySystem = true;
                    document.title = '⏸️ En pausa - Vuelve pronto';
                }
                const prefix = isSimulated ? '[Simulación]' : '[Evento Real]';
                this.log(`🙈 ${prefix} visibilityState === "hidden" (hidden: true). Procesos pausados.`);
            } else {
                // Si fue pausado por el sistema al ocultarse, reanudamos automáticamente
                if (AppState.vcLab.pausedBySystem) {
                    AppState.vcLab.isPlaying = true;
                    AppState.vcLab.pausedBySystem = false;
                }
                // Restauramos el título original de la pestaña
                document.title = AppState.vcLab.originalTitle;
                // Emitimos sonido sutil al regresar
                SoundFX.welcomeBack();
                const prefix = isSimulated ? '[Simulación]' : '[Evento Real]';
                this.log(`👁️ ${prefix} visibilityState === "visible" (hidden: false). Pestaña activa.`);
            }

            // Refrescamos todas las tarjetas y badges visuales
            this.updateUI();
        },

        // Vincula los botones interactivos de simulación y control manual
        bindControls() {
            // Botón para pausar o reproducir manualmente el reproductor inteligente
            if (this.btnTogglePlayer) {
                this.btnTogglePlayer.addEventListener('click', () => {
                    SoundFX.click();
                    // Alternamos reproducción
                    AppState.vcLab.isPlaying = !AppState.vcLab.isPlaying;
                    // Al ser acción manual del usuario, limpiamos la bandera automática
                    AppState.vcLab.pausedBySystem = false;
                    const msg = AppState.vcLab.isPlaying
                        ? '▶️ Reproducción iniciada manualmente por el usuario.'
                        : '⏸️ Pausado manualmente (no se reanudará solo al volver).';
                    this.log(msg);
                    this.updateUI();
                });
            }

            // Botón para simular ocultar la pestaña ("hidden")
            if (this.btnSimHide) {
                this.btnSimHide.addEventListener('click', () => {
                    SoundFX.click();
                    this.handleVisibilityChange('hidden', true);
                });
            }

            // Botón para simular regresar a la pestaña ("visible")
            if (this.btnSimShow) {
                this.btnSimShow.addEventListener('click', () => {
                    SoundFX.click();
                    this.handleVisibilityChange('visible', true);
                });
            }

            // Botón para limpiar los registros del terminal
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

        // Inicia un intervalo de 1 segundo para contabilizar tiempo visible vs oculto
        startMetricsTimer() {
            setInterval(() => {
                // Incrementamos el contador correspondiente según el estado actual
                if (AppState.vcLab.currentState === 'visible') {
                    AppState.vcLab.activeSeconds++;
                } else {
                    AppState.vcLab.hiddenSeconds++;
                }
                // Actualizamos los contadores numéricos en pantalla
                if (this.activeSecondsEl) this.activeSecondsEl.textContent = `${AppState.vcLab.activeSeconds}s`;
                if (this.hiddenSecondsEl) this.hiddenSecondsEl.textContent = `${AppState.vcLab.hiddenSeconds}s`;
            }, 1000);
        },

        // Sincroniza los elementos visuales del laboratorio con el estado actual
        updateUI() {
            const isVisible = AppState.vcLab.currentState === 'visible';

            // Actualizamos banner y badges de estado
            if (this.banner) {
                this.banner.className = isVisible ? 'vc-status-banner is-visible' : 'vc-status-banner is-hidden';
            }
            if (this.stateText) {
                this.stateText.textContent = `document.visibilityState === "${AppState.vcLab.currentState}"`;
            }
            if (this.hiddenBadge) {
                this.hiddenBadge.textContent = `document.hidden: ${!isVisible}`;
                this.hiddenBadge.className = isVisible ? 'badge badge-emerald' : 'badge badge-purple';
            }

            // Actualizamos contador de cambios de pestaña
            if (this.switchCountEl) {
                this.switchCountEl.textContent = AppState.vcLab.switchCount;
            }

            // Actualizamos interfaz del reproductor inteligente
            if (this.playerTitle && this.playerSub && this.btnTogglePlayer) {
                if (AppState.vcLab.isPlaying) {
                    this.playerTitle.textContent = '▶️ Reproductor Inteligente: Reproduciendo';
                    this.playerSub.textContent = 'Se pausará automáticamente si ocultas la pestaña.';
                    this.btnTogglePlayer.textContent = '⏸️ Pausar Manual';
                } else if (AppState.vcLab.pausedBySystem) {
                    this.playerTitle.textContent = '⏸️ Reproductor Inteligente: Pausado por Sistema';
                    this.playerSub.textContent = 'Se reanudará automáticamente cuando la pestaña vuelva a estar visible.';
                    this.btnTogglePlayer.textContent = '▶️ Reanudar';
                } else {
                    this.playerTitle.textContent = '⏹️ Reproductor Inteligente: Pausado Manualmente';
                    this.playerSub.textContent = 'Respetando pausa manual del usuario (no se reanudará solo).';
                    this.btnTogglePlayer.textContent = '▶️ Reanudar';
                }
            }
        },

        // Registra un evento con marca temporal en el terminal del laboratorio
        log(message) {
            if (!this.terminal) return;

            const now = new Date();
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div');
            line.className = 'vc-log-line';
            line.innerHTML = `
                <span class="vc-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            this.terminal.appendChild(line);
            this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización general al cargar el documento
    function startApplication() {
        // Iniciamos navegación de diapositivas
        SlideNavigation.init();
        // Iniciamos el laboratorio interactivo de visibilitychange
        VCLabController.init();
    }

    // Esperamos a que el DOM esté listo si aún se encuentra cargando
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
