/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: SERVICE WORKERS
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
    const AppState = { // Declara e inicializa "AppState"
        currentSlide: 1,
        totalSlides: 12,
        viewMode: 'slides',
        soundEnabled: true,
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE SERVICE WORKERS (SWLabController)
       ========================================================================== */
    const SWLabController = { // Declara e inicializa "SWLabController"
        init() { // Instrucción JavaScript
            this.useNative = 'serviceWorker' in navigator && window.location.protocol !== 'file:'; // Asigna valor
            this.isRegistered = false; // Asigna valor

            this.banner = document.getElementById('swStatusBanner'); // Asigna valor
            this.stateText = document.getElementById('swStateText'); // Asigna valor
            this.modeBadge = document.getElementById('swModeBadge'); // Asigna valor

            this.stepRegister = document.getElementById('stepRegister'); // Asigna valor
            this.stepInstall = document.getElementById('stepInstall'); // Asigna valor
            this.stepActivate = document.getElementById('stepActivate'); // Asigna valor
            this.stepFetch = document.getElementById('stepFetch'); // Asigna valor

            this.btnRegister = document.getElementById('btnSwRegister'); // Asigna valor
            this.btnMessage = document.getElementById('btnSwMessage'); // Asigna valor
            this.btnFetch = document.getElementById('btnSwFetch'); // Asigna valor
            this.btnClear = document.getElementById('btnClearSwLogs'); // Asigna valor
            this.terminal = document.getElementById('swLogTerminal'); // Asigna valor

            if (this.modeBadge) { // Evalúa condición
                this.modeBadge.textContent = this.useNative
                    ? 'Entorno HTTPS/localhost (SW Real) ✅'
                    : 'Simulador Local (Protocolo file://)';
            }

            this.bindNativeMessages(); // Ejecuta llamada o método
            this.bindControls(); // Ejecuta llamada o método
        },

        bindNativeMessages() { // Instrucción JavaScript
            if (!this.useNative) return; // Evalúa condición
            navigator.serviceWorker.addEventListener('message', (e) => { // Registra escuchador de eventos
                SoundFX.success(); // Ejecuta llamada o método
                this.log(`📥 [Mensaje del SW]: ${JSON.stringify(e.data)}`); // Ejecuta llamada o método
            });
        },

        markStep(stepEl) { // Instrucción JavaScript
            if (stepEl) stepEl.classList.add('is-done'); // Evalúa condición
        },

        bindControls() { // Instrucción JavaScript
            // 1. Registrar / Simular ciclo de vida
            if (this.btnRegister) { // Evalúa condición
                this.btnRegister.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método

                    if (this.useNative) { // Evalúa condición
                        try { // Inicia bloque protegido contra errores
                            const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' }); // Declara e inicializa "reg"
                            this.isRegistered = true; // Asigna valor
                            this.markStep(this.stepRegister); // Ejecuta llamada o método
                            this.markStep(this.stepInstall); // Ejecuta llamada o método
                            this.markStep(this.stepActivate); // Ejecuta llamada o método
                            if (this.banner) this.banner.className = 'sw-status-banner is-active'; // Evalúa condición
                            if (this.stateText) this.stateText.textContent = `Activo (scope: ${reg.scope})`; // Evalúa condición
                            SoundFX.success(); // Ejecuta llamada o método
                            this.log(`🚀 [register] Service Worker real registrado en scope: ${reg.scope}`); // Ejecuta llamada o método
                        } catch (err) { // Instrucción JavaScript
                            this.log(`❌ Error al registrar SW: ${err.message}`); // Ejecuta llamada o método
                        }
                    } else { // Instrucción JavaScript
                        this.isRegistered = true; // Asigna valor
                        this.markStep(this.stepRegister); // Ejecuta llamada o método
                        this.log('1️⃣ [register("./sw.js")] Descargando y analizando archivo...'); // Ejecuta llamada o método
                        setTimeout(() => { // Instrucción JavaScript
                            this.markStep(this.stepInstall); // Ejecuta llamada o método
                            this.log('2️⃣ [install] caches.open("sw-master-level-v1") -> App Shell guardado.'); // Ejecuta llamada o método
                        }, 250); // Ejecuta llamada o método
                        setTimeout(() => { // Instrucción JavaScript
                            this.markStep(this.stepActivate); // Ejecuta llamada o método
                            if (this.banner) this.banner.className = 'sw-status-banner is-active'; // Evalúa condición
                            if (this.stateText) this.stateText.textContent = 'activated (controlando pestaña)'; // Evalúa condición
                            SoundFX.success(); // Ejecuta llamada o método
                            this.log('3️⃣ [activate] Cachés antiguas limpiadas. clients.claim() ejecutado.'); // Ejecuta llamada o método
                        }, 550); // Ejecuta llamada o método
                    }
                });
            }

            // 2. Enviar postMessage() al Service Worker
            if (this.btnMessage) { // Evalúa condición
                this.btnMessage.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.useNative && navigator.serviceWorker.controller) { // Evalúa condición
                        navigator.serviceWorker.controller.postMessage({ tipo: 'OBTENER_VERSION' }); // Ejecuta llamada o método
                        this.log('📤 [Página -> SW] postMessage({ tipo: "OBTENER_VERSION" }) enviado.'); // Ejecuta llamada o método
                    } else if (this.isRegistered) { // Instrucción JavaScript
                        SoundFX.success(); // Ejecuta llamada o método
                        this.log('📤 [Página -> SW] postMessage({ tipo: "OBTENER_VERSION" })'); // Ejecuta llamada o método
                        this.log('📥 [SW -> Página] { version: "sw-master-level-v1", estado: "Activo y listo" }'); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        this.log('⚠️ Registra el Service Worker primero antes de enviar mensajes.'); // Ejecuta llamada o método
                    }
                });
            }

            // 3. Simular interceptación de red (evento fetch)
            if (this.btnFetch) { // Evalúa condición
                this.btnFetch.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (!this.isRegistered) { // Evalúa condición
                        this.log('⚠️ Registra el Service Worker primero para activar el interceptor fetch.'); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }
                    this.markStep(this.stepFetch); // Ejecuta llamada o método
                    SoundFX.success(); // Ejecuta llamada o método
                    this.log('🌐 [Evento fetch] Interceptado GET /index.html -> event.respondWith(caches.match) ⚡ Servido desde Caché.'); // Ejecuta llamada o método
                });
            }

            // 4. Limpiar terminal
            if (this.btnClear) { // Evalúa condición
                this.btnClear.addEventListener('click', () => { // Registra escuchador de eventos
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
            line.className = 'sw-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="sw-log-time">[${timeStr}]</span>
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
        SWLabController.init(); // Ejecuta llamada o método
    }

    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
