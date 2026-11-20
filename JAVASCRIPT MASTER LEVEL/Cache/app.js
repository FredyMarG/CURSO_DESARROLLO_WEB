/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: CACHE API (caches)
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
    // Objeto centralizado que administra la diapositiva actual y las preferencias
    const AppState = {
        // Diapositiva actualmente visible (1 a 12)
        currentSlide: 1,
        // Cantidad total de diapositivas
        totalSlides: 12,
        // Modo activo: 'slides' o 'guide'
        viewMode: 'slides',
        // Estado de audio habilitado/silenciado
        soundEnabled: true,
        // Estado de apertura del modal de índice
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE CACHE API (CALabController)
       ========================================================================== */
    const CALabController = {
        // Nombre del almacén utilizado en el laboratorio
        CACHE_NAME: 'archivos.estaticos',

        // Inicializa referencias, detecta soporte real vs file:// y actualiza la UI
        async init() {
            this.hits = 0;
            this.misses = 0;
            this.memStore = new Map();
            this.useNative = 'caches' in window && window.location.protocol !== 'file:';

            this.banner = document.getElementById('caStatusBanner');
            this.modeBadge = document.getElementById('caModeBadge');
            this.countEl = document.getElementById('caCount');
            this.hitsEl = document.getElementById('caHits');
            this.missesEl = document.getElementById('caMisses');
            this.entriesListEl = document.getElementById('caEntriesList');

            this.btnPut = document.getElementById('btnCaPut');
            this.btnMatch = document.getElementById('btnCaMatch');
            this.btnKeys = document.getElementById('btnCaKeys');
            this.btnDeleteOne = document.getElementById('btnCaDeleteOne');
            this.btnDeleteAll = document.getElementById('btnCaDeleteAll');
            this.btnClearLogs = document.getElementById('btnClearCaLogs');
            this.terminal = document.getElementById('caLogTerminal');

            if (this.modeBadge) {
                this.modeBadge.textContent = this.useNative
                    ? 'CacheStorage Real (HTTPS/localhost) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindControls();
            await this.refreshEntries();
        },

        // Obtiene las rutas actualmente almacenadas en la caché
        async getStoredPaths() {
            if (this.useNative) {
                const cache = await caches.open(this.CACHE_NAME);
                const requests = await cache.keys();
                return requests.map(req => new URL(req.url).pathname);
            }
            return Array.from(this.memStore.keys());
        },

        // Actualiza las tarjetas de conteo y los chips visuales
        async refreshEntries() {
            const paths = await this.getStoredPaths();
            if (this.countEl) this.countEl.textContent = paths.length;
            if (this.hitsEl) this.hitsEl.textContent = this.hits;
            if (this.missesEl) this.missesEl.textContent = this.misses;

            if (this.banner) {
                this.banner.className = paths.length > 0 ? 'ca-status-banner is-ready' : 'ca-status-banner';
            }

            if (!this.entriesListEl) return;
            if (paths.length === 0) {
                this.entriesListEl.innerHTML = '<span style="color: var(--text-dim); font-size: 0.8rem;">Caché vacía (0 recursos)...</span>';
                return;
            }

            this.entriesListEl.innerHTML = '';
            paths.forEach(p => {
                const chip = document.createElement('span');
                chip.className = 'ca-entry-chip';
                chip.textContent = p;
                this.entriesListEl.appendChild(chip);
            });
        },

        // Vincula los botones interactivos del laboratorio
        bindControls() {
            // 1. Guardar recursos con cache.put()
            if (this.btnPut) {
                this.btnPut.addEventListener('click', async () => {
                    SoundFX.click();
                    if (this.useNative) {
                        const cache = await caches.open(this.CACHE_NAME);
                        await cache.put('/api/config', new Response(JSON.stringify({ tema: 'oscuro' }), { headers: { 'Content-Type': 'application/json' } }));
                        await cache.put('/api/saludo', new Response('Hola desde CacheStorage real', { headers: { 'Content-Type': 'text/plain' } }));
                    } else {
                        this.memStore.set('/api/config', JSON.stringify({ tema: 'oscuro' }));
                        this.memStore.set('/api/saludo', 'Hola desde el simulador local');
                    }
                    SoundFX.success();
                    await this.refreshEntries();
                    this.log('💾 [cache.put()] Guardados /api/config y /api/saludo en archivos.estaticos.');
                });
            }

            // 2. Consultar /api/saludo con caches.match()
            if (this.btnMatch) {
                this.btnMatch.addEventListener('click', async () => {
                    SoundFX.click();
                    let foundText = null;

                    if (this.useNative) {
                        const cache = await caches.open(this.CACHE_NAME);
                        const match = await cache.match('/api/saludo');
                        if (match) foundText = await match.text();
                    } else {
                        if (this.memStore.has('/api/saludo')) {
                            foundText = this.memStore.get('/api/saludo');
                        }
                    }

                    if (foundText !== null) {
                        this.hits++;
                        SoundFX.success();
                        this.log(`⚡ [CACHE HIT] caches.match('/api/saludo') -> "${foundText}"`);
                    } else {
                        this.misses++;
                        this.log('🐢 [CACHE MISS] /api/saludo no está en caché todavía.');
                    }
                    await this.refreshEntries();
                });
            }

            // 3. Listar llaves actuales con cache.keys()
            if (this.btnKeys) {
                this.btnKeys.addEventListener('click', async () => {
                    SoundFX.click();
                    const paths = await this.getStoredPaths();
                    this.log(paths.length > 0 ? `📋 [cache.keys()] ${paths.join(', ')}` : '📭 [cache.keys()] El almacén está vacío.');
                });
            }

            // 4. Eliminar /api/saludo con cache.delete()
            if (this.btnDeleteOne) {
                this.btnDeleteOne.addEventListener('click', async () => {
                    SoundFX.click();
                    let deleted = false;
                    if (this.useNative) {
                        const cache = await caches.open(this.CACHE_NAME);
                        deleted = await cache.delete('/api/saludo');
                    } else {
                        deleted = this.memStore.delete('/api/saludo');
                    }
                    await this.refreshEntries();
                    this.log(deleted ? '🗑️ [cache.delete()] /api/saludo eliminado.' : '⚠️ /api/saludo no existía en caché.');
                });
            }

            // 5. Vaciar todo el almacén con caches.delete()
            if (this.btnDeleteAll) {
                this.btnDeleteAll.addEventListener('click', async () => {
                    SoundFX.click();
                    if (this.useNative) {
                        await caches.delete(this.CACHE_NAME);
                    } else {
                        this.memStore.clear();
                    }
                    await this.refreshEntries();
                    this.log(`💥 [caches.delete()] Almacén '${this.CACHE_NAME}' eliminado por completo.`);
                });
            }

            // 6. Limpiar logs
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
            line.className = 'ca-log-line';
            line.innerHTML = `
                <span class="ca-log-time">[${timeStr}]</span>
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
        CALabController.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
