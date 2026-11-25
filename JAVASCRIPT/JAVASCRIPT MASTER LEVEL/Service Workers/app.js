/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: SERVICE WORKERS
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
    const AppState = {
        currentSlide: 1,
        totalSlides: 12,
        viewMode: 'slides',
        soundEnabled: true,
        overviewOpen: false
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    const SoundFX = {
        ctx: null,

        init() {
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa variable local
                this.ctx = new AudioConstructor();
            }
        },

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

        success() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'sine';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

            osc.frequency.setValueAtTime(560, now);
            osc.frequency.exponentialRampToValueAtTime(860, now + 0.14);
            gain.gain.setValueAtTime(0.05, now);
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
    const SlideNavigation = {
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE SERVICE WORKERS (SWLabController)
       ========================================================================== */
    const SWLabController = {
        init() {
            this.useNative = 'serviceWorker' in navigator && window.location.protocol !== 'file:';
            this.isRegistered = false;

            this.banner = document.getElementById('swStatusBanner'); // Obtiene referencia al elemento del DOM
            this.stateText = document.getElementById('swStateText'); // Obtiene referencia al elemento del DOM
            this.modeBadge = document.getElementById('swModeBadge'); // Obtiene referencia al elemento del DOM

            this.stepRegister = document.getElementById('stepRegister'); // Obtiene referencia al elemento del DOM
            this.stepInstall = document.getElementById('stepInstall'); // Obtiene referencia al elemento del DOM
            this.stepActivate = document.getElementById('stepActivate'); // Obtiene referencia al elemento del DOM
            this.stepFetch = document.getElementById('stepFetch'); // Obtiene referencia al elemento del DOM

            this.btnRegister = document.getElementById('btnSwRegister'); // Obtiene referencia al elemento del DOM
            this.btnMessage = document.getElementById('btnSwMessage'); // Obtiene referencia al elemento del DOM
            this.btnFetch = document.getElementById('btnSwFetch'); // Obtiene referencia al elemento del DOM
            this.btnClear = document.getElementById('btnClearSwLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('swLogTerminal'); // Obtiene referencia al elemento del DOM

            if (this.modeBadge) { // Evalúa condición lógica
                this.modeBadge.textContent = this.useNative
                    ? 'Entorno HTTPS/localhost (SW Real) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindNativeMessages();
            this.bindControls();
        },

        bindNativeMessages() {
            if (!this.useNative) return; // Evalúa condición lógica
            navigator.serviceWorker.addEventListener('message', (e) => { // Registra escuchador de evento en el DOM
                SoundFX.success();
                this.log(`📥 [Mensaje del SW]: ${JSON.stringify(e.data)}`);
            });
        },

        markStep(stepEl) {
            if (stepEl) stepEl.classList.add('is-done'); // Evalúa condición lógica
        },

        bindControls() {
            // 1. Registrar / Simular ciclo de vida
            if (this.btnRegister) { // Evalúa condición lógica
                this.btnRegister.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();

                    if (this.useNative) { // Evalúa condición lógica
                        try { // Inicia bloque protegido contra errores
                            const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' }); // Declara e inicializa variable local
                            this.isRegistered = true;
                            this.markStep(this.stepRegister);
                            this.markStep(this.stepInstall);
                            this.markStep(this.stepActivate);
                            if (this.banner) this.banner.className = 'sw-status-banner is-active'; // Evalúa condición lógica
                            if (this.stateText) this.stateText.textContent = `Activo (scope: ${reg.scope})`; // Evalúa condición lógica
                            SoundFX.success();
                            this.log(`🚀 [register] Service Worker real registrado en scope: ${reg.scope}`);
                        } catch (err) {
                            this.log(`❌ Error al registrar SW: ${err.message}`);
                        }
                    } else {
                        this.isRegistered = true;
                        this.markStep(this.stepRegister);
                        this.log('1️⃣ [register("./sw.js")] Descargando y analizando archivo...');
                        setTimeout(() => {
                            this.markStep(this.stepInstall);
                            this.log('2️⃣ [install] caches.open("sw-master-level-v1") -> App Shell guardado.');
                        }, 250);
                        setTimeout(() => {
                            this.markStep(this.stepActivate);
                            if (this.banner) this.banner.className = 'sw-status-banner is-active'; // Evalúa condición lógica
                            if (this.stateText) this.stateText.textContent = 'activated (controlando pestaña)'; // Evalúa condición lógica
                            SoundFX.success();
                            this.log('3️⃣ [activate] Cachés antiguas limpiadas. clients.claim() ejecutado.');
                        }, 550);
                    }
                });
            }

            // 2. Enviar postMessage() al Service Worker
            if (this.btnMessage) { // Evalúa condición lógica
                this.btnMessage.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.useNative && navigator.serviceWorker.controller) { // Evalúa condición lógica
                        navigator.serviceWorker.controller.postMessage({ tipo: 'OBTENER_VERSION' });
                        this.log('📤 [Página -> SW] postMessage({ tipo: "OBTENER_VERSION" }) enviado.');
                    } else if (this.isRegistered) {
                        SoundFX.success();
                        this.log('📤 [Página -> SW] postMessage({ tipo: "OBTENER_VERSION" })');
                        this.log('📥 [SW -> Página] { version: "sw-master-level-v1", estado: "Activo y listo" }');
                    } else {
                        this.log('⚠️ Registra el Service Worker primero antes de enviar mensajes.');
                    }
                });
            }

            // 3. Simular interceptación de red (evento fetch)
            if (this.btnFetch) { // Evalúa condición lógica
                this.btnFetch.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (!this.isRegistered) { // Evalúa condición lógica
                        this.log('⚠️ Registra el Service Worker primero para activar el interceptor fetch.');
                        return; // Retorna el resultado de la función
                    }
                    this.markStep(this.stepFetch);
                    SoundFX.success();
                    this.log('🌐 [Evento fetch] Interceptado GET /index.html -> event.respondWith(caches.match) ⚡ Servido desde Caché.');
                });
            }

            // 4. Limpiar terminal
            if (this.btnClear) { // Evalúa condición lógica
                this.btnClear.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.terminal) { // Evalúa condición lógica
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal limpiado.');
                    }
                });
            }
        },

        log(message) {
            if (!this.terminal) return; // Evalúa condición lógica

            const now = new Date(); // Declara e inicializa variable local
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div'); // Declara e inicializa variable local
            line.className = 'sw-log-line';
            line.innerHTML = `
                <span class="sw-log-time">[${timeStr}]</span>
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
        SWLabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

