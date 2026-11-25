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

        // Tono agradable al emitir una notificación
        notify() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'sine';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

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

        // Procesa atajos de teclado ignorando campos de formulario
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NOTIFICATIONS API
       ========================================================================== */
    // Gestiona permisos reales, emisión de notificaciones nativas y registro de eventos
    const NTLabController = {
        // Inicializa referencias del DOM y actualiza el estado inicial
        init() {
            this.banner = document.getElementById('ntPermissionBanner'); // Obtiene referencia al elemento del DOM
            this.permText = document.getElementById('ntPermissionText'); // Obtiene referencia al elemento del DOM
            this.supportBadge = document.getElementById('ntSupportBadge'); // Obtiene referencia al elemento del DOM

            this.titleInput = document.getElementById('ntTitleInput'); // Obtiene referencia al elemento del DOM
            this.bodyInput = document.getElementById('ntBodyInput'); // Obtiene referencia al elemento del DOM
            this.tagInput = document.getElementById('ntTagInput'); // Obtiene referencia al elemento del DOM

            this.btnRequestPerm = document.getElementById('btnRequestPerm'); // Obtiene referencia al elemento del DOM
            this.btnSendNotif = document.getElementById('btnSendNotif'); // Obtiene referencia al elemento del DOM
            this.btnSimNotif = document.getElementById('btnSimNotif'); // Obtiene referencia al elemento del DOM
            this.btnClearLogs = document.getElementById('btnClearNtLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('ntLogTerminal'); // Obtiene referencia al elemento del DOM

            this.bindControls();
            this.updatePermissionUI();
        },

        // Actualiza las insignias y colores según Notification.permission
        updatePermissionUI() {
            const supported = 'Notification' in window; // Declara e inicializa variable local

            if (this.supportBadge) { // Evalúa condición lógica
                this.supportBadge.textContent = supported
                    ? 'Soporte Nativo: Disponible ✔️'
                    : 'Soporte Nativo: No disponible ❌';
                this.supportBadge.className = supported ? 'badge badge-emerald' : 'badge badge-purple';
            }

            if (!supported) { // Evalúa condición lógica
                if (this.permText) this.permText.textContent = 'Notification no soportada en este entorno'; // Evalúa condición lógica
                return; // Retorna el resultado de la función
            }

            const perm = Notification.permission; // Declara e inicializa variable local
            if (this.permText) { // Evalúa condición lógica
                this.permText.textContent = `Notification.permission === "${perm}"`; // Actualiza contenido en el DOM
            }

            if (this.banner) { // Evalúa condición lógica
                this.banner.className = 'nt-permission-banner';
                if (perm === 'granted') this.banner.classList.add('is-granted'); // Evalúa condición lógica
                if (perm === 'denied') this.banner.classList.add('is-denied'); // Evalúa condición lógica
            }
        },

        // Vincula los botones del laboratorio
        bindControls() {
            // Botón para solicitar permiso nativo mediante Notification.requestPermission()
            if (this.btnRequestPerm) { // Evalúa condición lógica
                this.btnRequestPerm.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();

                    if (!('Notification' in window)) { // Evalúa condición lógica
                        this.log('❌ Tu navegador no soporta la API Notification.');
                        return; // Retorna el resultado de la función
                    }

                    try { // Inicia bloque protegido contra errores
                        this.log('🔑 Solicitando permiso mediante Notification.requestPermission()...');
                        const result = await Notification.requestPermission(); // Declara e inicializa variable local
                        this.updatePermissionUI();
                        this.log(`📋 Decisión del usuario: "${result}"`);
                        if (result === 'granted') SoundFX.notify(); // Evalúa condición lógica
                    } catch (err) {
                        this.log(`⚠️ Error al solicitar permiso: ${err.message}`);
                    }
                });
            }

            // Botón para emitir una notificación real en el sistema operativo
            if (this.btnSendNotif) { // Evalúa condición lógica
                this.btnSendNotif.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();

                    if (!('Notification' in window)) { // Evalúa condición lógica
                        this.log('❌ Notification API no disponible en este navegador.');
                        return; // Retorna el resultado de la función
                    }

                    if (Notification.permission !== 'granted') { // Evalúa condición lógica
                        this.log(`⚠️ No se puede emitir alerta real: permiso actual es "${Notification.permission}". Pulsa "Solicitar Permiso" primero.`);
                        return; // Retorna el resultado de la función
                    }

                    const title = (this.titleInput && this.titleInput.value.trim()) || 'Notificación Master Level'; // Declara e inicializa variable local
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Contenido de prueba'; // Declara e inicializa variable local
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'master-level-tag'; // Declara e inicializa variable local

                    // Instanciamos la notificación nativa real
                    const noti = new Notification(title, { body, tag }); // Declara e inicializa variable local
                    SoundFX.notify();
                    this.log(`🔔 Notificación real enviada -> "${title}" (tag: "${tag}")`);

                    // Registramos eventos sobre la instancia creada
                    noti.addEventListener('show', () => this.log('👁️ [Evento show] La alerta apareció en pantalla.'));
                    noti.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                        window.focus();
                        noti.close();
                        this.log('🖱️ [Evento click] Usuario pulsó la notificación -> window.focus() + close().');
                    });
                    noti.addEventListener('close', () => this.log('❎ [Evento close] La notificación fue cerrada.'));
                    noti.addEventListener('error', () => this.log('❌ [Evento error] Ocurrió un error al mostrar la notificación.'));
                });
            }

            // Botón para simular la notificación en el terminal sin requerir permiso del SO
            if (this.btnSimNotif) { // Evalúa condición lógica
                this.btnSimNotif.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.notify();
                    const title = (this.titleInput && this.titleInput.value.trim()) || '¡Nuevo Mensaje!'; // Declara e inicializa variable local
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Alerta simulada'; // Declara e inicializa variable local
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'demo-tag'; // Declara e inicializa variable local
                    this.log(`🧪 [Simulación] new Notification("${title}", { body: "${body}", tag: "${tag}" })`);
                });
            }

            // Botón para limpiar la consola del laboratorio
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
    function startApplication() { // Define función reutilizable
        SlideNavigation.init();
        NTLabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

