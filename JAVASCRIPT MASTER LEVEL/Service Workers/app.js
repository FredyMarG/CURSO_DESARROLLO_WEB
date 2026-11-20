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
    'use strict';

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
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                const AudioConstructor = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioConstructor();
            }
        },

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

        success() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const now = this.ctx.currentTime;

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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE SERVICE WORKERS (SWLabController)
       ========================================================================== */
    const SWLabController = {
        init() {
            this.useNative = 'serviceWorker' in navigator && window.location.protocol !== 'file:';
            this.isRegistered = false;

            this.banner = document.getElementById('swStatusBanner');
            this.stateText = document.getElementById('swStateText');
            this.modeBadge = document.getElementById('swModeBadge');

            this.stepRegister = document.getElementById('stepRegister');
            this.stepInstall = document.getElementById('stepInstall');
            this.stepActivate = document.getElementById('stepActivate');
            this.stepFetch = document.getElementById('stepFetch');

            this.btnRegister = document.getElementById('btnSwRegister');
            this.btnMessage = document.getElementById('btnSwMessage');
            this.btnFetch = document.getElementById('btnSwFetch');
            this.btnClear = document.getElementById('btnClearSwLogs');
            this.terminal = document.getElementById('swLogTerminal');

            if (this.modeBadge) {
                this.modeBadge.textContent = this.useNative
                    ? 'Entorno HTTPS/localhost (SW Real) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindNativeMessages();
            this.bindControls();
        },

        bindNativeMessages() {
            if (!this.useNative) return;
            navigator.serviceWorker.addEventListener('message', (e) => {
                SoundFX.success();
                this.log(`📥 [Mensaje del SW]: ${JSON.stringify(e.data)}`);
            });
        },

        markStep(stepEl) {
            if (stepEl) stepEl.classList.add('is-done');
        },

        bindControls() {
            // 1. Registrar / Simular ciclo de vida
            if (this.btnRegister) {
                this.btnRegister.addEventListener('click', async () => {
                    SoundFX.click();

                    if (this.useNative) {
                        try {
                            const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
                            this.isRegistered = true;
                            this.markStep(this.stepRegister);
                            this.markStep(this.stepInstall);
                            this.markStep(this.stepActivate);
                            if (this.banner) this.banner.className = 'sw-status-banner is-active';
                            if (this.stateText) this.stateText.textContent = `Activo (scope: ${reg.scope})`;
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
                            if (this.banner) this.banner.className = 'sw-status-banner is-active';
                            if (this.stateText) this.stateText.textContent = 'activated (controlando pestaña)';
                            SoundFX.success();
                            this.log('3️⃣ [activate] Cachés antiguas limpiadas. clients.claim() ejecutado.');
                        }, 550);
                    }
                });
            }

            // 2. Enviar postMessage() al Service Worker
            if (this.btnMessage) {
                this.btnMessage.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.useNative && navigator.serviceWorker.controller) {
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
            if (this.btnFetch) {
                this.btnFetch.addEventListener('click', () => {
                    SoundFX.click();
                    if (!this.isRegistered) {
                        this.log('⚠️ Registra el Service Worker primero para activar el interceptor fetch.');
                        return;
                    }
                    this.markStep(this.stepFetch);
                    SoundFX.success();
                    this.log('🌐 [Evento fetch] Interceptado GET /index.html -> event.respondWith(caches.match) ⚡ Servido desde Caché.');
                });
            }

            // 4. Limpiar terminal
            if (this.btnClear) {
                this.btnClear.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.terminal) {
                        this.terminal.innerHTML = '';
                        this.log('🧹 Terminal limpiado.');
                    }
                });
            }
        },

        log(message) {
            if (!this.terminal) return;

            const now = new Date();
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div');
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
    function startApplication() {
        SlideNavigation.init();
        SWLabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
