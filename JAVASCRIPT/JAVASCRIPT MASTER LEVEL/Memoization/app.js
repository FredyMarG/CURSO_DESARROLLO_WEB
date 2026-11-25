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

        hit() {
            if (!AppState.soundEnabled) return; // Evalúa condición lógica
            this.init();
            if (!this.ctx) return; // Evalúa condición lógica
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición lógica

            const osc = this.ctx.createOscillator(); // Declara e inicializa variable local
            const gain = this.ctx.createGain(); // Declara e inicializa variable local
            osc.type = 'sine';
            const now = this.ctx.currentTime; // Declara e inicializa variable local

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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE MEMOIZATION (MMLabController)
       ========================================================================== */
    const MMLabController = {
        // Inicializa caché Map, contadores y eventos del laboratorio
        init() {
            this.cache = new Map();
            this.hits = 0;
            this.misses = 0;

            this.banner = document.getElementById('mmStatusBanner'); // Obtiene referencia al elemento del DOM
            this.statusText = document.getElementById('mmStatusText'); // Obtiene referencia al elemento del DOM
            this.badgeState = document.getElementById('mmBadgeState'); // Obtiene referencia al elemento del DOM

            this.resultEl = document.getElementById('mmResult'); // Obtiene referencia al elemento del DOM
            this.timeEl = document.getElementById('mmTime'); // Obtiene referencia al elemento del DOM
            this.hitsEl = document.getElementById('mmHits'); // Obtiene referencia al elemento del DOM
            this.missesEl = document.getElementById('mmMisses'); // Obtiene referencia al elemento del DOM
            this.cachePillsEl = document.getElementById('mmCachePills'); // Obtiene referencia al elemento del DOM

            this.inputN = document.getElementById('mmInputN'); // Obtiene referencia al elemento del DOM
            this.btnCalcMemo = document.getElementById('btnCalcMemo'); // Obtiene referencia al elemento del DOM
            this.btnCalcNoMemo = document.getElementById('btnCalcNoMemo'); // Obtiene referencia al elemento del DOM
            this.btnClearCache = document.getElementById('btnClearCache'); // Obtiene referencia al elemento del DOM
            this.btnClearLogs = document.getElementById('btnClearMmLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('mmLogTerminal'); // Obtiene referencia al elemento del DOM

            this.bindControls();
            this.renderCachePills();
        },

        // Fibonacci recursivo tradicional SIN caché O(2^n)
        fibSlow(n) {
            if (n <= 1) return n; // Evalúa condición lógica
            return this.fibSlow(n - 1) + this.fibSlow(n - 2); // Retorna el resultado de la función
        },

        // Fibonacci recursivo CON caché Map O(n)
        fibMemo(n) {
            if (n <= 1) return n; // Evalúa condición lógica
            if (this.cache.has(n)) return this.cache.get(n); // Evalúa condición lógica
            const res = this.fibMemo(n - 1) + this.fibMemo(n - 2); // Declara e inicializa variable local
            this.cache.set(n, res);
            return res; // Retorna el resultado de la función
        },

        // Renderiza visualmente las entradas almacenadas actualmente en el Map
        renderCachePills() {
            if (!this.cachePillsEl) return; // Evalúa condición lógica
            if (this.cache.size === 0) { // Evalúa condición lógica
                this.cachePillsEl.innerHTML = '<span style="color: var(--text-dim); font-size: 0.8rem;">Caché vacía (0 entradas)...</span>'; // Actualiza contenido en el DOM
                return; // Retorna el resultado de la función
            }

            this.cachePillsEl.innerHTML = ''; // Actualiza contenido en el DOM
            // Mostramos hasta las últimas 12 claves para mantener limpio el panel
            const entries = Array.from(this.cache.entries()).slice(-12); // Declara e inicializa variable local
            entries.forEach(([k, v]) => {
                const chip = document.createElement('span'); // Declara e inicializa variable local
                chip.className = 'mm-cache-chip';
                chip.textContent = `fib(${k}) = ${v.toLocaleString('es-ES')}`; // Actualiza contenido en el DOM
                this.cachePillsEl.appendChild(chip);
            });
        },

        // Vincula los botones del laboratorio
        bindControls() {
            // Botón para calcular CON memoización
            if (this.btnCalcMemo) { // Evalúa condición lógica
                this.btnCalcMemo.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    const n = Math.min(Math.max(parseInt(this.inputN.value, 10) || 1, 1), 42); // Declara e inicializa variable local
                    this.inputN.value = n;

                    const wasHit = this.cache.has(n); // Declara e inicializa variable local
                    const t0 = performance.now(); // Declara e inicializa variable local
                    const res = this.fibMemo(n); // Declara e inicializa variable local
                    const elapsed = (performance.now() - t0).toFixed(3); // Declara e inicializa variable local

                    if (wasHit) { // Evalúa condición lógica
                        this.hits++;
                        SoundFX.hit();
                        if (this.banner) this.banner.className = 'mm-status-banner is-hit'; // Evalúa condición lógica
                        if (this.statusText) this.statusText.textContent = `fib(${n}) devuelto desde Map en ${elapsed} ms`; // Evalúa condición lógica
                        if (this.badgeState) { // Evalúa condición lógica
                            this.badgeState.textContent = 'CACHE HIT ⚡'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-emerald';
                        }
                        this.log(`⚡ [CACHE HIT] fib(${n}) = ${res.toLocaleString('es-ES')} (${elapsed} ms)`);
                    } else {
                        this.misses++;
                        SoundFX.click();
                        if (this.banner) this.banner.className = 'mm-status-banner is-miss'; // Evalúa condición lógica
                        if (this.statusText) this.statusText.textContent = `fib(${n}) calculado y guardado en Map (${elapsed} ms)`; // Evalúa condición lógica
                        if (this.badgeState) { // Evalúa condición lógica
                            this.badgeState.textContent = 'CACHE MISS 💾'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-cyan';
                        }
                        this.log(`💾 [CACHE MISS] fib(${n}) = ${res.toLocaleString('es-ES')} calculado en ${elapsed} ms`);
                    }

                    if (this.resultEl) this.resultEl.textContent = res.toLocaleString('es-ES'); // Evalúa condición lógica
                    if (this.timeEl) this.timeEl.textContent = `${elapsed} ms`; // Evalúa condición lógica
                    if (this.hitsEl) this.hitsEl.textContent = this.hits; // Evalúa condición lógica
                    if (this.missesEl) this.missesEl.textContent = this.misses; // Evalúa condición lógica
                    this.renderCachePills();
                });
            }

            // Botón para calcular SIN memoización (comparativa real de velocidad)
            if (this.btnCalcNoMemo) { // Evalúa condición lógica
                this.btnCalcNoMemo.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    const n = Math.min(Math.max(parseInt(this.inputN.value, 10) || 1, 1), 39); // Declara e inicializa variable local
                    this.inputN.value = n;

                    const t0 = performance.now(); // Declara e inicializa variable local
                    const res = this.fibSlow(n); // Declara e inicializa variable local
                    const elapsed = (performance.now() - t0).toFixed(2); // Declara e inicializa variable local

                    if (this.banner) this.banner.className = 'mm-status-banner'; // Evalúa condición lógica
                    if (this.statusText) this.statusText.textContent = `fibSinMemo(${n}) recalculado desde cero`; // Evalúa condición lógica
                    if (this.badgeState) { // Evalúa condición lógica
                        this.badgeState.textContent = 'SIN CACHÉ 🐢'; // Actualiza contenido en el DOM
                        this.badgeState.className = 'badge badge-purple';
                    }
                    if (this.resultEl) this.resultEl.textContent = res.toLocaleString('es-ES'); // Evalúa condición lógica
                    if (this.timeEl) this.timeEl.textContent = `${elapsed} ms`; // Evalúa condición lógica

                    this.log(`🐢 [SIN MEMO] fib(${n}) = ${res.toLocaleString('es-ES')} tardó ${elapsed} ms`);
                });
            }

            // Botón para limpiar la caché del Map
            if (this.btnClearCache) { // Evalúa condición lógica
                this.btnClearCache.addEventListener('click', () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    this.cache.clear();
                    this.hits = 0;
                    this.misses = 0;
                    if (this.hitsEl) this.hitsEl.textContent = '0'; // Evalúa condición lógica
                    if (this.missesEl) this.missesEl.textContent = '0'; // Evalúa condición lógica
                    if (this.resultEl) this.resultEl.textContent = '-'; // Evalúa condición lógica
                    if (this.timeEl) this.timeEl.textContent = '0.00 ms'; // Evalúa condición lógica
                    if (this.banner) this.banner.className = 'mm-status-banner'; // Evalúa condición lógica
                    if (this.statusText) this.statusText.textContent = 'Caché reiniciada'; // Evalúa condición lógica
                    if (this.badgeState) { // Evalúa condición lógica
                        this.badgeState.textContent = 'En espera'; // Actualiza contenido en el DOM
                        this.badgeState.className = 'badge badge-cyan';
                    }
                    this.renderCachePills();
                    this.log('🗑️ Caché Map() vaciada completamente.');
                });
            }

            // Botón para limpiar logs
            if (this.btnClearLogs) { // Evalúa condición lógica
                this.btnClearLogs.addEventListener('click', () => { // Registra escuchador de evento en el DOM
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
    function startApplication() { // Define función reutilizable
        SlideNavigation.init();
        MMLabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

