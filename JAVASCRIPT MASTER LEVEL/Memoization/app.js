/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: MEMOIZATION (MEMOIZACIÓN)
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

        hit() {
            if (!AppState.soundEnabled) return;
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const now = this.ctx.currentTime;

            osc.frequency.setValueAtTime(620, now);
            osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE MEMOIZATION (MMLabController)
       ========================================================================== */
    const MMLabController = {
        // Inicializa caché Map, contadores y eventos del laboratorio
        init() {
            this.cache = new Map();
            this.hits = 0;
            this.misses = 0;

            this.banner = document.getElementById('mmStatusBanner');
            this.statusText = document.getElementById('mmStatusText');
            this.badgeState = document.getElementById('mmBadgeState');

            this.resultEl = document.getElementById('mmResult');
            this.timeEl = document.getElementById('mmTime');
            this.hitsEl = document.getElementById('mmHits');
            this.missesEl = document.getElementById('mmMisses');
            this.cachePillsEl = document.getElementById('mmCachePills');

            this.inputN = document.getElementById('mmInputN');
            this.btnCalcMemo = document.getElementById('btnCalcMemo');
            this.btnCalcNoMemo = document.getElementById('btnCalcNoMemo');
            this.btnClearCache = document.getElementById('btnClearCache');
            this.btnClearLogs = document.getElementById('btnClearMmLogs');
            this.terminal = document.getElementById('mmLogTerminal');

            this.bindControls();
            this.renderCachePills();
        },

        // Fibonacci recursivo tradicional SIN caché O(2^n)
        fibSlow(n) {
            if (n <= 1) return n;
            return this.fibSlow(n - 1) + this.fibSlow(n - 2);
        },

        // Fibonacci recursivo CON caché Map O(n)
        fibMemo(n) {
            if (n <= 1) return n;
            if (this.cache.has(n)) return this.cache.get(n);
            const res = this.fibMemo(n - 1) + this.fibMemo(n - 2);
            this.cache.set(n, res);
            return res;
        },

        // Renderiza visualmente las entradas almacenadas actualmente en el Map
        renderCachePills() {
            if (!this.cachePillsEl) return;
            if (this.cache.size === 0) {
                this.cachePillsEl.innerHTML = '<span style="color: var(--text-dim); font-size: 0.8rem;">Caché vacía (0 entradas)...</span>';
                return;
            }

            this.cachePillsEl.innerHTML = '';
            // Mostramos hasta las últimas 12 claves para mantener limpio el panel
            const entries = Array.from(this.cache.entries()).slice(-12);
            entries.forEach(([k, v]) => {
                const chip = document.createElement('span');
                chip.className = 'mm-cache-chip';
                chip.textContent = `fib(${k}) = ${v.toLocaleString('es-ES')}`;
                this.cachePillsEl.appendChild(chip);
            });
        },

        // Vincula los botones del laboratorio
        bindControls() {
            // Botón para calcular CON memoización
            if (this.btnCalcMemo) {
                this.btnCalcMemo.addEventListener('click', () => {
                    const n = Math.min(Math.max(parseInt(this.inputN.value, 10) || 1, 1), 42);
                    this.inputN.value = n;

                    const wasHit = this.cache.has(n);
                    const t0 = performance.now();
                    const res = this.fibMemo(n);
                    const elapsed = (performance.now() - t0).toFixed(3);

                    if (wasHit) {
                        this.hits++;
                        SoundFX.hit();
                        if (this.banner) this.banner.className = 'mm-status-banner is-hit';
                        if (this.statusText) this.statusText.textContent = `fib(${n}) devuelto desde Map en ${elapsed} ms`;
                        if (this.badgeState) {
                            this.badgeState.textContent = 'CACHE HIT ⚡';
                            this.badgeState.className = 'badge badge-emerald';
                        }
                        this.log(`⚡ [CACHE HIT] fib(${n}) = ${res.toLocaleString('es-ES')} (${elapsed} ms)`);
                    } else {
                        this.misses++;
                        SoundFX.click();
                        if (this.banner) this.banner.className = 'mm-status-banner is-miss';
                        if (this.statusText) this.statusText.textContent = `fib(${n}) calculado y guardado en Map (${elapsed} ms)`;
                        if (this.badgeState) {
                            this.badgeState.textContent = 'CACHE MISS 💾';
                            this.badgeState.className = 'badge badge-cyan';
                        }
                        this.log(`💾 [CACHE MISS] fib(${n}) = ${res.toLocaleString('es-ES')} calculado en ${elapsed} ms`);
                    }

                    if (this.resultEl) this.resultEl.textContent = res.toLocaleString('es-ES');
                    if (this.timeEl) this.timeEl.textContent = `${elapsed} ms`;
                    if (this.hitsEl) this.hitsEl.textContent = this.hits;
                    if (this.missesEl) this.missesEl.textContent = this.misses;
                    this.renderCachePills();
                });
            }

            // Botón para calcular SIN memoización (comparativa real de velocidad)
            if (this.btnCalcNoMemo) {
                this.btnCalcNoMemo.addEventListener('click', () => {
                    SoundFX.click();
                    const n = Math.min(Math.max(parseInt(this.inputN.value, 10) || 1, 1), 39);
                    this.inputN.value = n;

                    const t0 = performance.now();
                    const res = this.fibSlow(n);
                    const elapsed = (performance.now() - t0).toFixed(2);

                    if (this.banner) this.banner.className = 'mm-status-banner';
                    if (this.statusText) this.statusText.textContent = `fibSinMemo(${n}) recalculado desde cero`;
                    if (this.badgeState) {
                        this.badgeState.textContent = 'SIN CACHÉ 🐢';
                        this.badgeState.className = 'badge badge-purple';
                    }
                    if (this.resultEl) this.resultEl.textContent = res.toLocaleString('es-ES');
                    if (this.timeEl) this.timeEl.textContent = `${elapsed} ms`;

                    this.log(`🐢 [SIN MEMO] fib(${n}) = ${res.toLocaleString('es-ES')} tardó ${elapsed} ms`);
                });
            }

            // Botón para limpiar la caché del Map
            if (this.btnClearCache) {
                this.btnClearCache.addEventListener('click', () => {
                    SoundFX.click();
                    this.cache.clear();
                    this.hits = 0;
                    this.misses = 0;
                    if (this.hitsEl) this.hitsEl.textContent = '0';
                    if (this.missesEl) this.missesEl.textContent = '0';
                    if (this.resultEl) this.resultEl.textContent = '-';
                    if (this.timeEl) this.timeEl.textContent = '0.00 ms';
                    if (this.banner) this.banner.className = 'mm-status-banner';
                    if (this.statusText) this.statusText.textContent = 'Caché reiniciada';
                    if (this.badgeState) {
                        this.badgeState.textContent = 'En espera';
                        this.badgeState.className = 'badge badge-cyan';
                    }
                    this.renderCachePills();
                    this.log('🗑️ Caché Map() vaciada completamente.');
                });
            }

            // Botón para limpiar logs
            if (this.btnClearLogs) {
                this.btnClearLogs.addEventListener('click', () => {
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
            line.className = 'mm-log-line';
            line.innerHTML = `
                <span class="mm-log-time">[${timeStr}]</span>
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
        MMLabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
