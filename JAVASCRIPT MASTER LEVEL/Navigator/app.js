/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: EL OBJETO NAVIGATOR (BOM)
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

            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(840, now + 0.14);
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NAVIGATOR (NVLabController)
       ========================================================================== */
    // Lee propiedades reales de window.navigator y escucha eventos de red en tiempo real
    const NVLabController = {
        // Inicializa referencias del DOM, carga diagnóstico inicial y escucha eventos de red
        init() {
            this.onlineBanner = document.getElementById('nvOnlineBanner');
            this.onlineText = document.getElementById('nvOnlineText');
            this.onlineBadge = document.getElementById('nvOnlineBadge');

            this.langEl = document.getElementById('nvLanguage');
            this.cpuEl = document.getElementById('nvCpu');
            this.cookiesEl = document.getElementById('nvCookies');
            this.pdfEl = document.getElementById('nvPdf');
            this.storageEl = document.getElementById('nvStorage');
            this.platformEl = document.getElementById('nvPlatform');

            this.btnRefresh = document.getElementById('btnRefreshNav');
            this.btnEstimate = document.getElementById('btnEstimateStorage');
            this.btnCopy = document.getElementById('btnCopyNavReport');
            this.btnClear = document.getElementById('btnClearNvLogs');
            this.terminal = document.getElementById('nvLogTerminal');

            this.bindNetworkEvents();
            this.bindControls();
            this.refreshDiagnostics();
        },

        // Actualiza todas las tarjetas con la información en vivo de window.navigator
        refreshDiagnostics() {
            const isOnline = navigator.onLine;
            if (this.onlineBanner) {
                this.onlineBanner.className = isOnline ? 'nv-status-banner is-online' : 'nv-status-banner is-offline';
            }
            if (this.onlineText) this.onlineText.textContent = String(isOnline);
            if (this.onlineBadge) {
                this.onlineBadge.textContent = isOnline ? '🟢 En línea' : '🔴 Sin conexión';
                this.onlineBadge.className = isOnline ? 'badge badge-emerald' : 'badge badge-purple';
            }

            if (this.langEl) {
                const langs = Array.isArray(navigator.languages) ? navigator.languages.join(', ') : navigator.language;
                this.langEl.textContent = `${navigator.language} (${langs})`;
            }
            if (this.cpuEl) {
                this.cpuEl.textContent = `${navigator.hardwareConcurrency || 'N/D'} hilos lógicos`;
            }
            if (this.cookiesEl) {
                this.cookiesEl.textContent = navigator.cookieEnabled ? 'Habilitadas (true)' : 'Bloqueadas (false)';
            }
            if (this.pdfEl) {
                this.pdfEl.textContent = navigator.pdfViewerEnabled ? 'Soportado (true)' : 'No soportado (false)';
            }
            if (this.platformEl) {
                this.platformEl.textContent = navigator.platform || 'No reportada';
            }
        },

        // Escucha los eventos nativos de red 'online' y 'offline' sobre window
        bindNetworkEvents() {
            window.addEventListener('online', () => {
                this.refreshDiagnostics();
                SoundFX.success();
                this.log('🟢 [Evento online] Conexión de red restablecida.');
            });

            window.addEventListener('offline', () => {
                this.refreshDiagnostics();
                this.log('🔴 [Evento offline] Se perdió la conexión de red.');
            });
        },

        // Vincula los botones interactivos del panel de diagnóstico
        bindControls() {
            if (this.btnRefresh) {
                this.btnRefresh.addEventListener('click', () => {
                    SoundFX.click();
                    this.refreshDiagnostics();
                    this.log('🔄 Diagnóstico de window.navigator actualizado.');
                });
            }

            if (this.btnEstimate) {
                this.btnEstimate.addEventListener('click', async () => {
                    SoundFX.click();
                    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
                        if (this.storageEl) this.storageEl.textContent = 'No soportado';
                        this.log('⚠️ navigator.storage.estimate() no está disponible en este contexto.');
                        return;
                    }

                    try {
                        const { usage, quota } = await navigator.storage.estimate();
                        const usedMB = (usage / (1024 * 1024)).toFixed(2);
                        const quotaGB = (quota / (1024 * 1024 * 1024)).toFixed(2);
                        const text = `${usedMB} MB / ${quotaGB} GB`;
                        if (this.storageEl) this.storageEl.textContent = text;
                        SoundFX.success();
                        this.log(`💾 [storage.estimate] Uso actual: ${usedMB} MB de ${quotaGB} GB asignados.`);
                    } catch (err) {
                        this.log(`❌ Error al estimar almacenamiento: ${err.message}`);
                    }
                });
            }

            if (this.btnCopy) {
                this.btnCopy.addEventListener('click', async () => {
                    SoundFX.click();
                    const report = [
                        `Idioma: ${navigator.language}`,
                        `En línea: ${navigator.onLine}`,
                        `CPU Hilos: ${navigator.hardwareConcurrency || 'N/D'}`,
                        `Cookies: ${navigator.cookieEnabled}`,
                        `PDF Nativo: ${navigator.pdfViewerEnabled}`,
                        `Plataforma: ${navigator.platform}`
                    ].join(' | ');

                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        try {
                            await navigator.clipboard.writeText(report);
                            SoundFX.success();
                            this.log('📋 Reporte copiado al portapapeles con navigator.clipboard.writeText().');
                        } catch (err) {
                            this.log(`⚠️ No se pudo copiar al portapapeles: ${err.message}`);
                        }
                    } else {
                        this.log(`ℹ️ Reporte generado: ${report}`);
                    }
                });
            }

            if (this.btnClear) {
                this.btnClear.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.terminal) {
                        this.terminal.innerHTML = '';
                        this.log('🧹 Terminal de diagnóstico limpiado.');
                    }
                });
            }

            // Inspector de APIs Modernas en Slide 12
            const btnModern = document.getElementById('btnTestModernNavigator');
            const modernOut = document.getElementById('nv-modern-output');
            if (btnModern && modernOut) {
                btnModern.addEventListener('click', async () => {
                    SoundFX.click();
                    const uaData = navigator.userAgentData
                        ? `platform=${navigator.userAgentData.platform || 'N/D'}, mobile=${navigator.userAgentData.mobile}`
                        : 'No soportado (fallback userAgent)';
                    const conn = navigator.connection
                        ? `${navigator.connection.effectiveType || 'N/D'} (~${navigator.connection.downlink ?? '?'} Mbps)`
                        : 'No soportado';
                    let perm = 'N/D';
                    if (navigator.permissions?.query) {
                        try {
                            const status = await navigator.permissions.query({ name: 'notifications' });
                            perm = status.state;
                        } catch { perm = 'No consultable'; }
                    }
                    modernOut.textContent = [
                        `userAgentData: ${uaData}`,
                        `connection: ${conn}`,
                        `permissions(notifications): ${perm}`,
                        `clipboard: ${'clipboard' in navigator} | share: ${'share' in navigator} | sendBeacon: ${'sendBeacon' in navigator}`
                    ].join('\n');
                    SoundFX.success();
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
            line.className = 'nv-log-line';
            line.innerHTML = `
                <span class="nv-log-time">[${timeStr}]</span>
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
        NVLabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
