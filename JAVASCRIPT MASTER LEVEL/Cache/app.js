/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: CACHE API (caches)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () { // Instrucción JavaScript
    // Activamos el modo estricto para garantizar rigor en la ejecución de JavaScript
    'use strict'; // Activa el modo estricto de JavaScript

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto centralizado que administra la diapositiva actual y las preferencias
    const AppState = { // Declara e inicializa "AppState"
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
    const SoundFX = { // Declara e inicializa "SoundFX"
        ctx: null,

        init() { // Instrucción JavaScript
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioConstructor"
                this.ctx = new AudioConstructor(); // Asigna valor
            }
        },

        slide() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.init(); // Ejecuta llamada o método
            if (!this.ctx) return; // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            osc.type = 'sine'; // Asigna valor
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            osc.frequency.setValueAtTime(320, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12); // Ejecuta llamada o método

            gain.gain.setValueAtTime(0.001, now); // Ejecuta llamada o método
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Ejecuta llamada o método

            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.18); // Ejecuta llamada o método
        },

        click() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.init(); // Ejecuta llamada o método
            if (!this.ctx) return; // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            osc.type = 'triangle'; // Asigna valor
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            osc.frequency.setValueAtTime(600, now); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Ejecuta llamada o método

            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.04); // Ejecuta llamada o método
        },

        success() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.init(); // Ejecuta llamada o método
            if (!this.ctx) return; // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            osc.type = 'sine'; // Asigna valor
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            osc.frequency.setValueAtTime(560, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(860, now + 0.14); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16); // Ejecuta llamada o método

            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.16); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    const SlideNavigation = { // Declara e inicializa "SlideNavigation"
        init() { // Instrucción JavaScript
            this.wrapper = document.getElementById('presentationWrapper'); // Asigna valor
            this.slides = document.querySelectorAll('.slide'); // Asigna valor
            this.progressBar = document.getElementById('progressBar'); // Asigna valor
            this.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor

            this.btnPrev = document.getElementById('btnPrevSlide'); // Asigna valor
            this.btnNext = document.getElementById('btnNextSlide'); // Asigna valor
            this.dotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            this.btnGoLab = document.getElementById('btnGoLab'); // Asigna valor
            this.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.modeText = document.getElementById('modeText'); // Asigna valor
            this.modeIcon = document.getElementById('modeIcon'); // Asigna valor

            this.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.soundIcon = document.getElementById('soundIcon'); // Asigna valor

            this.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor

            this.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            this.buildSlideDots(); // Ejecuta llamada o método
            this.buildOverviewGrid(); // Ejecuta llamada o método
            this.bindEvents(); // Ejecuta llamada o método
            this.updateUI(); // Ejecuta llamada o método
        },

        buildSlideDots() { // Instrucción JavaScript
            if (!this.dotsContainer) return; // Evalúa condición
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                const dot = document.createElement('button'); // Crea nuevo elemento DOM "dot"
                dot.className = 'slide-dot'; // Asigna valor
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`); // Ejecuta llamada o método
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Asigna valor

                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    dot.classList.add('active'); // Modifica clases CSS del elemento
                }

                dot.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                });

                this.dotsContainer.appendChild(dot); // Inserta nodo en el DOM
            });
        },

        buildOverviewGrid() { // Instrucción JavaScript
            if (!this.overviewGrid) return; // Evalúa condición
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Declara e inicializa "title"

                const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
                card.className = 'overview-card'; // Asigna valor
                card.dataset.slideIndex = slideNum; // Asigna valor

                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    card.classList.add('active'); // Modifica clases CSS del elemento
                }

                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                card.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });

                this.overviewGrid.appendChild(card); // Inserta nodo en el DOM
            });
        },

        bindEvents() { // Instrucción JavaScript
            if (this.btnPrev) { // Evalúa condición
                this.btnPrev.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                });
            }

            if (this.btnNext) { // Evalúa condición
                this.btnNext.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                });
            }

            if (this.btnGoLab) { // Evalúa condición
                this.btnGoLab.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(9); // Ejecuta llamada o método
                });
            }

            if (this.btnToggleMode) { // Evalúa condición
                this.btnToggleMode.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleViewMode(); // Ejecuta llamada o método
                });
            }

            if (this.btnToggleSound) { // Evalúa condición
                this.btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleSound(); // Ejecuta llamada o método
                });
            }

            if (this.btnOverview) { // Evalúa condición
                this.btnOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                });
            }

            if (this.btnCloseOverview) { // Evalúa condición
                this.btnCloseOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });
            }

            if (this.overviewModal) { // Evalúa condición
                this.overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
                    if (e.target === this.overviewModal) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                });
            }

            if (this.btnFullscreen) { // Evalúa condición
                this.btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                });
            }

            document.addEventListener('keydown', (e) => this.handleKeyDown(e)); // Registra escuchador de eventos
        },

        handleKeyDown(e) { // Instrucción JavaScript
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; // Evalúa condición

            switch (e.key) { // Evalúa múltiples casos
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case ' ':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case 'o':
                case 'O':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case 'f':
                case 'F':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case 'Escape':
                    if (AppState.overviewOpen) this.closeOverview(); // Evalúa condición
                    break; // Instrucción JavaScript
                case 'Home':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(1); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case 'End':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(AppState.totalSlides); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                default:
                    break; // Instrucción JavaScript
            }
        },

        goToSlide(index) { // Instrucción JavaScript
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición
            if (index === AppState.currentSlide) return; // Evalúa condición
            AppState.currentSlide = index; // Asigna valor
            SoundFX.slide(); // Ejecuta llamada o método
            this.updateUI(); // Ejecuta llamada o método
        },

        nextSlide() { // Instrucción JavaScript
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
                this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
            }
        },

        prevSlide() { // Instrucción JavaScript
            if (AppState.currentSlide > 1) { // Evalúa condición
                this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
            }
        },

        toggleViewMode() { // Instrucción JavaScript
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides'; // Asigna valor

            if (AppState.viewMode === 'guide') { // Evalúa condición
                document.body.classList.remove('mode-presentation'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-document'); // Modifica clases CSS del elemento
                if (this.modeText) this.modeText.textContent = 'Modo Diapos'; // Evalúa condición
                if (this.modeIcon) this.modeIcon.textContent = '🖥️'; // Evalúa condición
            } else { // Instrucción JavaScript
                document.body.classList.remove('mode-document'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-presentation'); // Modifica clases CSS del elemento
                if (this.modeText) this.modeText.textContent = 'Modo Guía'; // Evalúa condición
                if (this.modeIcon) this.modeIcon.textContent = '📑'; // Evalúa condición
            }

            this.updateUI(); // Ejecuta llamada o método
        },

        toggleSound() { // Instrucción JavaScript
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            if (this.soundIcon) { // Evalúa condición
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            if (AppState.soundEnabled) SoundFX.click(); // Evalúa condición
        },

        toggleOverview() { // Instrucción JavaScript
            if (AppState.overviewOpen) { // Evalúa condición
                this.closeOverview(); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                this.openOverview(); // Ejecuta llamada o método
            }
        },

        openOverview() { // Instrucción JavaScript
            AppState.overviewOpen = true; // Asigna valor
            if (this.overviewModal) this.overviewModal.classList.add('active'); // Evalúa condición
            const cards = document.querySelectorAll('.overview-card'); // Obtiene referencia DOM para "cards"
            cards.forEach(card => { // Instrucción JavaScript
                const idx = parseInt(card.dataset.slideIndex, 10); // Declara e inicializa "idx"
                card.classList.toggle('active', idx === AppState.currentSlide); // Modifica clases CSS del elemento
            });
        },

        closeOverview() { // Instrucción JavaScript
            AppState.overviewOpen = false; // Asigna valor
            if (this.overviewModal) this.overviewModal.classList.remove('active'); // Evalúa condición
        },

        toggleFullscreen() { // Instrucción JavaScript
            if (!document.fullscreenElement) { // Evalúa condición
                document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            } else if (document.exitFullscreen) { // Instrucción JavaScript
                document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
            }
        },

        updateUI() { // Instrucción JavaScript
            if (AppState.viewMode === 'slides') { // Evalúa condición
                this.slides.forEach((slide, index) => { // Instrucción JavaScript
                    const slideNum = index + 1; // Declara e inicializa "slideNum"
                    if (slideNum === AppState.currentSlide) { // Evalúa condición
                        slide.classList.add('active'); // Modifica clases CSS del elemento
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        slide.classList.remove('active'); // Modifica clases CSS del elemento
                    }
                });
            } else { // Instrucción JavaScript
                this.slides.forEach(slide => slide.classList.add('active')); // Modifica clases CSS del elemento
            }

            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100; // Declara e inicializa "percent"
            if (this.progressBar) this.progressBar.style.width = `${percent}%`; // Evalúa condición

            if (this.slideIndicator) { // Evalúa condición
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            const dots = document.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, index) => { // Instrucción JavaScript
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide); // Modifica clases CSS del elemento
            });

            if (this.btnPrev) { // Evalúa condición
                this.btnPrev.disabled = AppState.currentSlide === 1; // Asigna valor
                this.btnPrev.style.opacity = AppState.currentSlide === 1 ? '0.35' : '1'; // Asigna valor
            }
            if (this.btnNext) { // Evalúa condición
                this.btnNext.disabled = AppState.currentSlide === AppState.totalSlides; // Asigna valor
                this.btnNext.style.opacity = AppState.currentSlide === AppState.totalSlides ? '0.35' : '1'; // Asigna valor
            }
        }
    };

    /* ==========================================================================
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE CACHE API (CALabController)
       ========================================================================== */
    const CALabController = { // Declara e inicializa "CALabController"
        // Nombre del almacén utilizado en el laboratorio
        CACHE_NAME: 'archivos.estaticos',

        // Inicializa referencias, detecta soporte real vs file:// y actualiza la UI
        async init() { // Instrucción JavaScript
            this.hits = 0; // Asigna valor
            this.misses = 0; // Asigna valor
            this.memStore = new Map(); // Asigna valor
            this.useNative = 'caches' in window && window.location.protocol !== 'file:'; // Asigna valor

            this.banner = document.getElementById('caStatusBanner'); // Asigna valor
            this.modeBadge = document.getElementById('caModeBadge'); // Asigna valor
            this.countEl = document.getElementById('caCount'); // Asigna valor
            this.hitsEl = document.getElementById('caHits'); // Asigna valor
            this.missesEl = document.getElementById('caMisses'); // Asigna valor
            this.entriesListEl = document.getElementById('caEntriesList'); // Asigna valor

            this.btnPut = document.getElementById('btnCaPut'); // Asigna valor
            this.btnMatch = document.getElementById('btnCaMatch'); // Asigna valor
            this.btnKeys = document.getElementById('btnCaKeys'); // Asigna valor
            this.btnDeleteOne = document.getElementById('btnCaDeleteOne'); // Asigna valor
            this.btnDeleteAll = document.getElementById('btnCaDeleteAll'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearCaLogs'); // Asigna valor
            this.terminal = document.getElementById('caLogTerminal'); // Asigna valor

            if (this.modeBadge) { // Evalúa condición
                this.modeBadge.textContent = this.useNative
                    ? 'CacheStorage Real (HTTPS/localhost) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindControls(); // Ejecuta llamada o método
            await this.refreshEntries(); // Ejecuta llamada o método
        },

        // Obtiene las rutas actualmente almacenadas en la caché
        async getStoredPaths() { // Instrucción JavaScript
            if (this.useNative) { // Evalúa condición
                const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa "cache"
                const requests = await cache.keys(); // Declara e inicializa "requests"
                return requests.map(req => new URL(req.url).pathname); // Retorna resultado
            }
            return Array.from(this.memStore.keys()); // Retorna resultado
        },

        // Actualiza las tarjetas de conteo y los chips visuales
        async refreshEntries() { // Instrucción JavaScript
            const paths = await this.getStoredPaths(); // Declara e inicializa "paths"
            if (this.countEl) this.countEl.textContent = paths.length; // Evalúa condición
            if (this.hitsEl) this.hitsEl.textContent = this.hits; // Evalúa condición
            if (this.missesEl) this.missesEl.textContent = this.misses; // Evalúa condición

            if (this.banner) { // Evalúa condición
                this.banner.className = paths.length > 0 ? 'ca-status-banner is-ready' : 'ca-status-banner'; // Asigna valor
            }

            if (!this.entriesListEl) return; // Evalúa condición
            if (paths.length === 0) { // Evalúa condición
                this.entriesListEl.innerHTML = '<span style="color: var(--text-dim); font-size: 0.8rem;">Caché vacía (0 recursos)...</span>'; // Actualiza contenido en el DOM
                return; // Retorna resultado
            }

            this.entriesListEl.innerHTML = ''; // Actualiza contenido en el DOM
            paths.forEach(p => { // Instrucción JavaScript
                const chip = document.createElement('span'); // Crea nuevo elemento DOM "chip"
                chip.className = 'ca-entry-chip'; // Asigna valor
                chip.textContent = p; // Actualiza contenido en el DOM
                this.entriesListEl.appendChild(chip); // Inserta nodo en el DOM
            });
        },

        // Vincula los botones interactivos del laboratorio
        bindControls() { // Instrucción JavaScript
            // 1. Guardar recursos con cache.put()
            if (this.btnPut) { // Evalúa condición
                this.btnPut.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.useNative) { // Evalúa condición
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa "cache"
                        await cache.put('/api/config', new Response(JSON.stringify({ tema: 'oscuro' }), { headers: { 'Content-Type': 'application/json' } })); // Ejecuta llamada o método
                        await cache.put('/api/saludo', new Response('Hola desde CacheStorage real', { headers: { 'Content-Type': 'text/plain' } })); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        this.memStore.set('/api/config', JSON.stringify({ tema: 'oscuro' })); // Ejecuta llamada o método
                        this.memStore.set('/api/saludo', 'Hola desde el simulador local'); // Ejecuta llamada o método
                    }
                    SoundFX.success(); // Ejecuta llamada o método
                    await this.refreshEntries(); // Ejecuta llamada o método
                    this.log('💾 [cache.put()] Guardados /api/config y /api/saludo en archivos.estaticos.'); // Ejecuta llamada o método
                });
            }

            // 2. Consultar /api/saludo con caches.match()
            if (this.btnMatch) { // Evalúa condición
                this.btnMatch.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    let foundText = null; // Declara e inicializa "foundText"

                    if (this.useNative) { // Evalúa condición
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa "cache"
                        const match = await cache.match('/api/saludo'); // Declara e inicializa "match"
                        if (match) foundText = await match.text(); // Evalúa condición
                    } else { // Instrucción JavaScript
                        if (this.memStore.has('/api/saludo')) { // Evalúa condición
                            foundText = this.memStore.get('/api/saludo'); // Asigna valor
                        }
                    }

                    if (foundText !== null) { // Evalúa condición
                        this.hits++; // Instrucción JavaScript
                        SoundFX.success(); // Ejecuta llamada o método
                        this.log(`⚡ [CACHE HIT] caches.match('/api/saludo') -> "${foundText}"`); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        this.misses++; // Instrucción JavaScript
                        this.log('🐢 [CACHE MISS] /api/saludo no está en caché todavía.'); // Ejecuta llamada o método
                    }
                    await this.refreshEntries(); // Ejecuta llamada o método
                });
            }

            // 3. Listar llaves actuales con cache.keys()
            if (this.btnKeys) { // Evalúa condición
                this.btnKeys.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    const paths = await this.getStoredPaths(); // Declara e inicializa "paths"
                    this.log(paths.length > 0 ? `📋 [cache.keys()] ${paths.join(', ')}` : '📭 [cache.keys()] El almacén está vacío.'); // Ejecuta llamada o método
                });
            }

            // 4. Eliminar /api/saludo con cache.delete()
            if (this.btnDeleteOne) { // Evalúa condición
                this.btnDeleteOne.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    let deleted = false; // Declara e inicializa "deleted"
                    if (this.useNative) { // Evalúa condición
                        const cache = await caches.open(this.CACHE_NAME); // Declara e inicializa "cache"
                        deleted = await cache.delete('/api/saludo'); // Asigna valor
                    } else { // Instrucción JavaScript
                        deleted = this.memStore.delete('/api/saludo'); // Asigna valor
                    }
                    await this.refreshEntries(); // Ejecuta llamada o método
                    this.log(deleted ? '🗑️ [cache.delete()] /api/saludo eliminado.' : '⚠️ /api/saludo no existía en caché.'); // Ejecuta llamada o método
                });
            }

            // 5. Vaciar todo el almacén con caches.delete()
            if (this.btnDeleteAll) { // Evalúa condición
                this.btnDeleteAll.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.useNative) { // Evalúa condición
                        await caches.delete(this.CACHE_NAME); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        this.memStore.clear(); // Ejecuta llamada o método
                    }
                    await this.refreshEntries(); // Ejecuta llamada o método
                    this.log(`💥 [caches.delete()] Almacén '${this.CACHE_NAME}' eliminado por completo.`); // Ejecuta llamada o método
                });
            }

            // 6. Limpiar logs
            if (this.btnClearLogs) { // Evalúa condición
                this.btnClearLogs.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.terminal) { // Evalúa condición
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal limpiado.'); // Ejecuta llamada o método
                    }
                });
            }
        },

        log(message) { // Instrucción JavaScript
            if (!this.terminal) return; // Evalúa condición

            const now = new Date(); // Declara e inicializa "now"
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':'); // Ejecuta llamada o método

            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = 'ca-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="ca-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            this.terminal.appendChild(line); // Inserta nodo en el DOM
            this.terminal.scrollTop = this.terminal.scrollHeight; // Asigna valor
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    function startApplication() { // Declara función
        SlideNavigation.init(); // Ejecuta llamada o método
        CALabController.init(); // Ejecuta llamada o método
    }

    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
