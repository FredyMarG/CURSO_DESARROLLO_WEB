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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NAVIGATOR (NVLabController)
       ========================================================================== */
    // Lee propiedades reales de window.navigator y escucha eventos de red en tiempo real
    const NVLabController = {
        // Inicializa referencias del DOM, carga diagnóstico inicial y escucha eventos de red
        init() {
            this.onlineBanner = document.getElementById('nvOnlineBanner'); // Obtiene referencia al elemento del DOM
            this.onlineText = document.getElementById('nvOnlineText'); // Obtiene referencia al elemento del DOM
            this.onlineBadge = document.getElementById('nvOnlineBadge'); // Obtiene referencia al elemento del DOM

            this.langEl = document.getElementById('nvLanguage'); // Obtiene referencia al elemento del DOM
            this.cpuEl = document.getElementById('nvCpu'); // Obtiene referencia al elemento del DOM
            this.cookiesEl = document.getElementById('nvCookies'); // Obtiene referencia al elemento del DOM
            this.pdfEl = document.getElementById('nvPdf'); // Obtiene referencia al elemento del DOM
            this.storageEl = document.getElementById('nvStorage'); // Obtiene referencia al elemento del DOM
            this.platformEl = document.getElementById('nvPlatform'); // Obtiene referencia al elemento del DOM

            this.btnRefresh = document.getElementById('btnRefreshNav'); // Obtiene referencia al elemento del DOM
            this.btnEstimate = document.getElementById('btnEstimateStorage'); // Obtiene referencia al elemento del DOM
            this.btnCopy = document.getElementById('btnCopyNavReport'); // Obtiene referencia al elemento del DOM
            this.btnClear = document.getElementById('btnClearNvLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('nvLogTerminal'); // Obtiene referencia al elemento del DOM

            this.bindNetworkEvents();
            this.bindControls();
            this.refreshDiagnostics();
        },

        // Actualiza todas las tarjetas con la información en vivo de window.navigator
        refreshDiagnostics() {
            const isOnline = navigator.onLine; // Declara e inicializa variable local
            if (this.onlineBanner) { // Evalúa condición lógica
                this.onlineBanner.className = isOnline ? 'nv-status-banner is-online' : 'nv-status-banner is-offline';
            }
            if (this.onlineText) this.onlineText.textContent = String(isOnline); // Evalúa condición lógica
            if (this.onlineBadge) { // Evalúa condición lógica
                this.onlineBadge.textContent = isOnline ? '🟢 En línea' : '🔴 Sin conexión'; // Actualiza contenido en el DOM
                this.onlineBadge.className = isOnline ? 'badge badge-emerald' : 'badge badge-purple';
            }

            if (this.langEl) { // Evalúa condición lógica
                const langs = Array.isArray(navigator.languages) ? navigator.languages.join(', ') : navigator.language; // Declara e inicializa variable local
                this.langEl.textContent = `${navigator.language} (${langs})`; // Actualiza contenido en el DOM
            }
            if (this.cpuEl) { // Evalúa condición lógica
                this.cpuEl.textContent = `${navigator.hardwareConcurrency || 'N/D'} hilos lógicos`; // Actualiza contenido en el DOM
            }
            if (this.cookiesEl) { // Evalúa condición lógica
                this.cookiesEl.textContent = navigator.cookieEnabled ? 'Habilitadas (true)' : 'Bloqueadas (false)'; // Actualiza contenido en el DOM
            }
            if (this.pdfEl) { // Evalúa condición lógica
                this.pdfEl.textContent = navigator.pdfViewerEnabled ? 'Soportado (true)' : 'No soportado (false)'; // Actualiza contenido en el DOM
            }
            if (this.platformEl) { // Evalúa condición lógica
                this.platformEl.textContent = navigator.platform || 'No reportada'; // Actualiza contenido en el DOM
            }
        },

        // Escucha los eventos nativos de red 'online' y 'offline' sobre window
        bindNetworkEvents() {
            window.addEventListener('online', () => { // Registra escuchador de evento en el DOM
                this.refreshDiagnostics();
                SoundFX.success();
                this.log('🟢 [Evento online] Conexión de red restablecida.');
            });

            window.addEventListener('offline', () => { // Registra escuchador de evento en el DOM
                this.refreshDiagnostics();
                this.log('🔴 [Evento offline] Se perdió la conexión de red.');
            });
        },

        // Vincula los botones interactivos del panel de diagnóstico
        bindControls() {
            if (this.btnRefresh) { // Evalúa condición lógica
                this.btnRefresh.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.refreshDiagnostics();
                    this.log('🔄 Diagnóstico de window.navigator actualizado.');
                });
            }

            if (this.btnEstimate) { // Evalúa condición lógica
                this.btnEstimate.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (!('storage' in navigator) || !('estimate' in navigator.storage)) { // Evalúa condición lógica
                        if (this.storageEl) this.storageEl.textContent = 'No soportado'; // Evalúa condición lógica
                        this.log('⚠️ navigator.storage.estimate() no está disponible en este contexto.');
                        return; // Retorna el resultado de la función
                    }

                    try { // Inicia bloque protegido contra errores
                        const { usage, quota } = await navigator.storage.estimate(); // Declara e inicializa variable local
                        const usedMB = (usage / (1024 * 1024)).toFixed(2); // Declara e inicializa variable local
                        const quotaGB = (quota / (1024 * 1024 * 1024)).toFixed(2); // Declara e inicializa variable local
                        const text = `${usedMB} MB / ${quotaGB} GB`; // Declara e inicializa variable local
                        if (this.storageEl) this.storageEl.textContent = text; // Evalúa condición lógica
                        SoundFX.success();
                        this.log(`💾 [storage.estimate] Uso actual: ${usedMB} MB de ${quotaGB} GB asignados.`);
                    } catch (err) {
                        this.log(`❌ Error al estimar almacenamiento: ${err.message}`);
                    }
                });
            }

            if (this.btnCopy) { // Evalúa condición lógica
                this.btnCopy.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    const report = [
                        `Idioma: ${navigator.language}`,
                        `En línea: ${navigator.onLine}`,
                        `CPU Hilos: ${navigator.hardwareConcurrency || 'N/D'}`,
                        `Cookies: ${navigator.cookieEnabled}`,
                        `PDF Nativo: ${navigator.pdfViewerEnabled}`,
                        `Plataforma: ${navigator.platform}`
                    ].join(' | ');

                    if (navigator.clipboard && navigator.clipboard.writeText) { // Evalúa condición lógica
                        try { // Inicia bloque protegido contra errores
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

            if (this.btnClear) { // Evalúa condición lógica
                this.btnClear.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.terminal) { // Evalúa condición lógica
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal de diagnóstico limpiado.');
                    }
                });
            }

            // Inspector de APIs Modernas en Slide 12
            const btnModern = document.getElementById('btnTestModernNavigator'); // Declara e inicializa variable local
            const modernOut = document.getElementById('nv-modern-output'); // Declara e inicializa variable local
            if (btnModern && modernOut) { // Evalúa condición lógica
                btnModern.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    const uaData = navigator.userAgentData
                        ? `platform=${navigator.userAgentData.platform || 'N/D'}, mobile=${navigator.userAgentData.mobile}`
                        : 'No soportado (fallback userAgent)';
                    const conn = navigator.connection
                        ? `${navigator.connection.effectiveType || 'N/D'} (~${navigator.connection.downlink ?? '?'} Mbps)`
                        : 'No soportado';
                    let perm = 'N/D'; // Declara e inicializa variable local
                    if (navigator.permissions?.query) { // Evalúa condición lógica
                        try { // Inicia bloque protegido contra errores
                            const status = await navigator.permissions.query({ name: 'notifications' }); // Declara e inicializa variable local
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
            if (!this.terminal) return; // Evalúa condición lógica

            const now = new Date(); // Declara e inicializa variable local
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            const line = document.createElement('div'); // Declara e inicializa variable local
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
    function startApplication() { // Define función reutilizable
        SlideNavigation.init();
        NVLabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

