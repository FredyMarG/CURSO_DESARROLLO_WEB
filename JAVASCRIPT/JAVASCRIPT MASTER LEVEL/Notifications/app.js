/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: NOTIFICATIONS API
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
    // Objeto centralizado que almacena el estado reactivo de la presentación y el laboratorio
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
        overviewOpen: false
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

        // Tono agradable al emitir una notificación
        notify() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const now = this.ctx.currentTime;

            osc.frequency.setValueAtTime(660, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
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
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

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
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

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

        // Procesa atajos de teclado ignorando campos de formulario
        handleKeyDown(e) {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

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
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
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
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NOTIFICATIONS API
       ========================================================================== */
    // Gestiona permisos reales, emisión de notificaciones nativas y registro de eventos
    const NTLabController = {
        // Inicializa referencias del DOM y actualiza el estado inicial
        init() {
            this.banner = document.getElementById('ntPermissionBanner');
            this.permText = document.getElementById('ntPermissionText');
            this.supportBadge = document.getElementById('ntSupportBadge');

            this.titleInput = document.getElementById('ntTitleInput');
            this.bodyInput = document.getElementById('ntBodyInput');
            this.tagInput = document.getElementById('ntTagInput');

            this.btnRequestPerm = document.getElementById('btnRequestPerm');
            this.btnSendNotif = document.getElementById('btnSendNotif');
            this.btnSimNotif = document.getElementById('btnSimNotif');
            this.btnClearLogs = document.getElementById('btnClearNtLogs');
            this.terminal = document.getElementById('ntLogTerminal');

            this.bindControls();
            this.updatePermissionUI();
        },

        // Actualiza las insignias y colores según Notification.permission
        updatePermissionUI() {
            const supported = 'Notification' in window;

            if (this.supportBadge) {
                this.supportBadge.textContent = supported
                    ? 'Soporte Nativo: Disponible ✔️'
                    : 'Soporte Nativo: No disponible ❌';
                this.supportBadge.className = supported ? 'badge badge-emerald' : 'badge badge-purple';
            }

            if (!supported) {
                if (this.permText) this.permText.textContent = 'Notification no soportada en este entorno';
                return;
            }

            const perm = Notification.permission;
            if (this.permText) {
                this.permText.textContent = `Notification.permission === "${perm}"`; // Actualiza contenido en el DOM
            }

            if (this.banner) {
                this.banner.className = 'nt-permission-banner';
                if (perm === 'granted') this.banner.classList.add('is-granted');
                if (perm === 'denied') this.banner.classList.add('is-denied');
            }
        },

        // Vincula los botones del laboratorio
        bindControls() {
            // Botón para solicitar permiso nativo mediante Notification.requestPermission()
            if (this.btnRequestPerm) {
                this.btnRequestPerm.addEventListener('click', async () => {
                    SoundFX.click();

                    if (!('Notification' in window)) {
                        this.log('❌ Tu navegador no soporta la API Notification.');
                        return;
                    }

                    try { // Inicia bloque protegido contra errores
                        this.log('🔑 Solicitando permiso mediante Notification.requestPermission()...');
                        const result = await Notification.requestPermission();
                        this.updatePermissionUI();
                        this.log(`📋 Decisión del usuario: "${result}"`);
                        if (result === 'granted') SoundFX.notify();
                    } catch (err) {
                        this.log(`⚠️ Error al solicitar permiso: ${err.message}`);
                    }
                });
            }

            // Botón para emitir una notificación real en el sistema operativo
            if (this.btnSendNotif) {
                this.btnSendNotif.addEventListener('click', () => {
                    SoundFX.click();

                    if (!('Notification' in window)) {
                        this.log('❌ Notification API no disponible en este navegador.');
                        return;
                    }

                    if (Notification.permission !== 'granted') {
                        this.log(`⚠️ No se puede emitir alerta real: permiso actual es "${Notification.permission}". Pulsa "Solicitar Permiso" primero.`);
                        return;
                    }

                    const title = (this.titleInput && this.titleInput.value.trim()) || 'Notificación Master Level';
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Contenido de prueba';
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'master-level-tag';

                    // Instanciamos la notificación nativa real
                    const noti = new Notification(title, { body, tag });
                    SoundFX.notify();
                    this.log(`🔔 Notificación real enviada -> "${title}" (tag: "${tag}")`);

                    // Registramos eventos sobre la instancia creada
                    noti.addEventListener('show', () => this.log('👁️ [Evento show] La alerta apareció en pantalla.'));
                    noti.addEventListener('click', () => {
                        window.focus();
                        noti.close();
                        this.log('🖱️ [Evento click] Usuario pulsó la notificación -> window.focus() + close().');
                    });
                    noti.addEventListener('close', () => this.log('❎ [Evento close] La notificación fue cerrada.'));
                    noti.addEventListener('error', () => this.log('❌ [Evento error] Ocurrió un error al mostrar la notificación.'));
                });
            }

            // Botón para simular la notificación en el terminal sin requerir permiso del SO
            if (this.btnSimNotif) {
                this.btnSimNotif.addEventListener('click', () => {
                    SoundFX.notify();
                    const title = (this.titleInput && this.titleInput.value.trim()) || '¡Nuevo Mensaje!';
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Alerta simulada';
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'demo-tag';
                    this.log(`🧪 [Simulación] new Notification("${title}", { body: "${body}", tag: "${tag}" })`);
                });
            }

            // Botón para limpiar la consola del laboratorio
            if (this.btnClearLogs) {
                this.btnClearLogs.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.terminal) {
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal de eventos limpiado.');
                    }
                });
            }
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
            line.className = 'nt-log-line';
            line.innerHTML = `
                <span class="nt-log-time">[${timeStr}]</span>
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
        NTLabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
