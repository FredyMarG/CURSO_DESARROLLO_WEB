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
    'use strict'; // Activa el modo estricto de JavaScript

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

            this.banner = document.getElementById('caStatusBanner'); // Obtiene referencia al elemento del DOM
            this.modeBadge = document.getElementById('caModeBadge'); // Obtiene referencia al elemento del DOM
            this.countEl = document.getElementById('caCount'); // Obtiene referencia al elemento del DOM
            this.hitsEl = document.getElementById('caHits'); // Obtiene referencia al elemento del DOM
            this.missesEl = document.getElementById('caMisses'); // Obtiene referencia al elemento del DOM
            this.entriesListEl = document.getElementById('caEntriesList'); // Obtiene referencia al elemento del DOM

            this.btnPut = document.getElementById('btnCaPut'); // Obtiene referencia al elemento del DOM
            this.btnMatch = document.getElementById('btnCaMatch'); // Obtiene referencia al elemento del DOM
            this.btnKeys = document.getElementById('btnCaKeys'); // Obtiene referencia al elemento del DOM
            this.btnDeleteOne = document.getElementById('btnCaDeleteOne'); // Obtiene referencia al elemento del DOM
            this.btnDeleteAll = document.getElementById('btnCaDeleteAll'); // Obtiene referencia al elemento del DOM
            this.btnClearLogs = document.getElementById('btnClearCaLogs'); // Obtiene referencia al elemento del DOM
            this.terminal = document.getElementById('caLogTerminal'); // Obtiene referencia al elemento del DOM

            if (this.modeBadge) { // Evalúa condición lógica
                this.modeBadge.textContent = this.useNative
                    ? 'CacheStorage Real (HTTPS/localhost) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindControls();
            await this.refreshEntries();
        },

        // Obtiene las rutas actualmente almacenadas en la caché
        async getStoredPaths() {
            if (this.useNative) { // Evalúa condición lógica
                const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa variable local
                const requests = await cache.keys(); // Declara e inicializa variable local
                return requests.map(req => new URL(req.url).pathname); // Retorna el resultado de la función
            }
            return Array.from(this.memStore.keys()); // Retorna el resultado de la función
        },

        // Actualiza las tarjetas de conteo y los chips visuales
        async refreshEntries() {
            const paths = await this.getStoredPaths(); // Declara e inicializa variable local
            if (this.countEl) this.countEl.textContent = paths.length; // Evalúa condición lógica
            if (this.hitsEl) this.hitsEl.textContent = this.hits; // Evalúa condición lógica
            if (this.missesEl) this.missesEl.textContent = this.misses; // Evalúa condición lógica

            if (this.banner) { // Evalúa condición lógica
                this.banner.className = paths.length > 0 ? 'ca-status-banner is-ready' : 'ca-status-banner';
            }

            if (!this.entriesListEl) return; // Evalúa condición lógica
            if (paths.length === 0) { // Evalúa condición lógica
                this.entriesListEl.innerHTML = '<span style="color: var(--text-dim); font-size: 0.8rem;">Caché vacía (0 recursos)...</span>'; // Actualiza contenido en el DOM
                return; // Retorna el resultado de la función
            }

            this.entriesListEl.innerHTML = ''; // Actualiza contenido en el DOM
            paths.forEach(p => {
                const chip = document.createElement('span'); // Declara e inicializa variable local
                chip.className = 'ca-entry-chip';
                chip.textContent = p; // Actualiza contenido en el DOM
                this.entriesListEl.appendChild(chip);
            });
        },

        // Vincula los botones interactivos del laboratorio
        bindControls() {
            // 1. Guardar recursos con cache.put()
            if (this.btnPut) { // Evalúa condición lógica
                this.btnPut.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.useNative) { // Evalúa condición lógica
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa variable local
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
            if (this.btnMatch) { // Evalúa condición lógica
                this.btnMatch.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    let foundText = null; // Declara e inicializa variable local

                    if (this.useNative) { // Evalúa condición lógica
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa variable local
                        const match = await cache.match('/api/saludo'); // Declara e inicializa variable local
                        if (match) foundText = await match.text(); // Evalúa condición lógica
                    } else {
                        if (this.memStore.has('/api/saludo')) { // Evalúa condición lógica
                            foundText = this.memStore.get('/api/saludo');
                        }
                    }

                    if (foundText !== null) { // Evalúa condición lógica
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
            if (this.btnKeys) { // Evalúa condición lógica
                this.btnKeys.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    const paths = await this.getStoredPaths(); // Declara e inicializa variable local
                    this.log(paths.length > 0 ? `📋 [cache.keys()] ${paths.join(', ')}` : '📭 [cache.keys()] El almacén está vacío.');
                });
            }

            // 4. Eliminar /api/saludo con cache.delete()
            if (this.btnDeleteOne) { // Evalúa condición lógica
                this.btnDeleteOne.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    let deleted = false; // Declara e inicializa variable local
                    if (this.useNative) { // Evalúa condición lógica
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa variable local
                        deleted = await cache.delete('/api/saludo');
                    } else {
                        deleted = this.memStore.delete('/api/saludo');
                    }
                    await this.refreshEntries();
                    this.log(deleted ? '🗑️ [cache.delete()] /api/saludo eliminado.' : '⚠️ /api/saludo no existía en caché.');
                });
            }

            // 5. Vaciar todo el almacén con caches.delete()
            if (this.btnDeleteAll) { // Evalúa condición lógica
                this.btnDeleteAll.addEventListener('click', async () => { // Registra escuchador de evento en el DOM
                    SoundFX.click();
                    if (this.useNative) { // Evalúa condición lógica
                        await caches.delete(this.CACHE_NAME);
                    } else {
                        this.memStore.clear();
                    }
                    await this.refreshEntries();
                    this.log(`💥 [caches.delete()] Almacén '${this.CACHE_NAME}' eliminado por completo.`);
                });
            }

            // 6. Limpiar logs
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
    function startApplication() { // Define función reutilizable
        SlideNavigation.init();
        CALabController.init();
    }

    if (document.readyState === 'loading') { // Evalúa condición lógica
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();

