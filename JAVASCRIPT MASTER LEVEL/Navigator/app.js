/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: EL OBJETO NAVIGATOR (BOM)
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

            osc.frequency.setValueAtTime(520, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(840, now + 0.14); // Ejecuta llamada o método
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NAVIGATOR (NVLabController)
       ========================================================================== */
    // Lee propiedades reales de window.navigator y escucha eventos de red en tiempo real
    const NVLabController = { // Declara e inicializa "NVLabController"
        // Inicializa referencias del DOM, carga diagnóstico inicial y escucha eventos de red
        init() { // Instrucción JavaScript
            this.onlineBanner = document.getElementById('nvOnlineBanner'); // Asigna valor
            this.onlineText = document.getElementById('nvOnlineText'); // Asigna valor
            this.onlineBadge = document.getElementById('nvOnlineBadge'); // Asigna valor

            this.langEl = document.getElementById('nvLanguage'); // Asigna valor
            this.cpuEl = document.getElementById('nvCpu'); // Asigna valor
            this.cookiesEl = document.getElementById('nvCookies'); // Asigna valor
            this.pdfEl = document.getElementById('nvPdf'); // Asigna valor
            this.storageEl = document.getElementById('nvStorage'); // Asigna valor
            this.platformEl = document.getElementById('nvPlatform'); // Asigna valor

            this.btnRefresh = document.getElementById('btnRefreshNav'); // Asigna valor
            this.btnEstimate = document.getElementById('btnEstimateStorage'); // Asigna valor
            this.btnCopy = document.getElementById('btnCopyNavReport'); // Asigna valor
            this.btnClear = document.getElementById('btnClearNvLogs'); // Asigna valor
            this.terminal = document.getElementById('nvLogTerminal'); // Asigna valor

            this.bindNetworkEvents(); // Ejecuta llamada o método
            this.bindControls(); // Ejecuta llamada o método
            this.refreshDiagnostics(); // Ejecuta llamada o método
        },

        // Actualiza todas las tarjetas con la información en vivo de window.navigator
        refreshDiagnostics() { // Instrucción JavaScript
            const isOnline = navigator.onLine; // Declara e inicializa "isOnline"
            if (this.onlineBanner) { // Evalúa condición
                this.onlineBanner.className = isOnline ? 'nv-status-banner is-online' : 'nv-status-banner is-offline'; // Asigna valor
            }
            if (this.onlineText) this.onlineText.textContent = String(isOnline); // Evalúa condición
            if (this.onlineBadge) { // Evalúa condición
                this.onlineBadge.textContent = isOnline ? '🟢 En línea' : '🔴 Sin conexión'; // Actualiza contenido en el DOM
                this.onlineBadge.className = isOnline ? 'badge badge-emerald' : 'badge badge-purple'; // Asigna valor
            }

            if (this.langEl) { // Evalúa condición
                const langs = Array.isArray(navigator.languages) ? navigator.languages.join(', ') : navigator.language; // Declara e inicializa "langs"
                this.langEl.textContent = `${navigator.language} (${langs})`; // Actualiza contenido en el DOM
            }
            if (this.cpuEl) { // Evalúa condición
                this.cpuEl.textContent = `${navigator.hardwareConcurrency || 'N/D'} hilos lógicos`; // Actualiza contenido en el DOM
            }
            if (this.cookiesEl) { // Evalúa condición
                this.cookiesEl.textContent = navigator.cookieEnabled ? 'Habilitadas (true)' : 'Bloqueadas (false)'; // Actualiza contenido en el DOM
            }
            if (this.pdfEl) { // Evalúa condición
                this.pdfEl.textContent = navigator.pdfViewerEnabled ? 'Soportado (true)' : 'No soportado (false)'; // Actualiza contenido en el DOM
            }
            if (this.platformEl) { // Evalúa condición
                this.platformEl.textContent = navigator.platform || 'No reportada'; // Actualiza contenido en el DOM
            }
        },

        // Escucha los eventos nativos de red 'online' y 'offline' sobre window
        bindNetworkEvents() { // Instrucción JavaScript
            window.addEventListener('online', () => { // Registra escuchador de eventos
                this.refreshDiagnostics(); // Ejecuta llamada o método
                SoundFX.success(); // Ejecuta llamada o método
                this.log('🟢 [Evento online] Conexión de red restablecida.'); // Ejecuta llamada o método
            });

            window.addEventListener('offline', () => { // Registra escuchador de eventos
                this.refreshDiagnostics(); // Ejecuta llamada o método
                this.log('🔴 [Evento offline] Se perdió la conexión de red.'); // Ejecuta llamada o método
            });
        },

        // Vincula los botones interactivos del panel de diagnóstico
        bindControls() { // Instrucción JavaScript
            if (this.btnRefresh) { // Evalúa condición
                this.btnRefresh.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.refreshDiagnostics(); // Ejecuta llamada o método
                    this.log('🔄 Diagnóstico de window.navigator actualizado.'); // Ejecuta llamada o método
                });
            }

            if (this.btnEstimate) { // Evalúa condición
                this.btnEstimate.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (!('storage' in navigator) || !('estimate' in navigator.storage)) { // Evalúa condición
                        if (this.storageEl) this.storageEl.textContent = 'No soportado'; // Evalúa condición
                        this.log('⚠️ navigator.storage.estimate() no está disponible en este contexto.'); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }

                    try { // Inicia bloque protegido contra errores
                        const { usage, quota } = await navigator.storage.estimate(); // Declara e inicializa "variable"
                        const usedMB = (usage / (1024 * 1024)).toFixed(2); // Declara e inicializa "usedMB"
                        const quotaGB = (quota / (1024 * 1024 * 1024)).toFixed(2); // Declara e inicializa "quotaGB"
                        const text = `${usedMB} MB / ${quotaGB} GB`; // Declara e inicializa "text"
                        if (this.storageEl) this.storageEl.textContent = text; // Evalúa condición
                        SoundFX.success(); // Ejecuta llamada o método
                        this.log(`💾 [storage.estimate] Uso actual: ${usedMB} MB de ${quotaGB} GB asignados.`); // Ejecuta llamada o método
                    } catch (err) { // Instrucción JavaScript
                        this.log(`❌ Error al estimar almacenamiento: ${err.message}`); // Ejecuta llamada o método
                    }
                });
            }

            if (this.btnCopy) { // Evalúa condición
                this.btnCopy.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    const report = [
                        `Idioma: ${navigator.language}`,
                        `En línea: ${navigator.onLine}`,
                        `CPU Hilos: ${navigator.hardwareConcurrency || 'N/D'}`,
                        `Cookies: ${navigator.cookieEnabled}`,
                        `PDF Nativo: ${navigator.pdfViewerEnabled}`,
                        `Plataforma: ${navigator.platform}`
                    ].join(' | '); // Ejecuta llamada o método

                    if (navigator.clipboard && navigator.clipboard.writeText) { // Evalúa condición
                        try { // Inicia bloque protegido contra errores
                            await navigator.clipboard.writeText(report); // Ejecuta llamada o método
                            SoundFX.success(); // Ejecuta llamada o método
                            this.log('📋 Reporte copiado al portapapeles con navigator.clipboard.writeText().'); // Ejecuta llamada o método
                        } catch (err) { // Instrucción JavaScript
                            this.log(`⚠️ No se pudo copiar al portapapeles: ${err.message}`); // Ejecuta llamada o método
                        }
                    } else { // Instrucción JavaScript
                        this.log(`ℹ️ Reporte generado: ${report}`); // Ejecuta llamada o método
                    }
                });
            }

            if (this.btnClear) { // Evalúa condición
                this.btnClear.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.terminal) { // Evalúa condición
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal de diagnóstico limpiado.'); // Ejecuta llamada o método
                    }
                });
            }

            // Inspector de APIs Modernas en Slide 12
            const btnModern = document.getElementById('btnTestModernNavigator'); // Obtiene referencia DOM para "btnModern"
            const modernOut = document.getElementById('nv-modern-output'); // Obtiene referencia DOM para "modernOut"
            if (btnModern && modernOut) { // Evalúa condición
                btnModern.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    const uaData = navigator.userAgentData
                        ? `platform=${navigator.userAgentData.platform || 'N/D'}, mobile=${navigator.userAgentData.mobile}`
                        : 'No soportado (fallback userAgent)'; // Instrucción JavaScript
                    const conn = navigator.connection
                        ? `${navigator.connection.effectiveType || 'N/D'} (~${navigator.connection.downlink ?? '?'} Mbps)`
                        : 'No soportado'; // Instrucción JavaScript
                    let perm = 'N/D'; // Declara e inicializa "perm"
                    if (navigator.permissions?.query) { // Evalúa condición
                        try { // Inicia bloque protegido contra errores
                            const status = await navigator.permissions.query({ name: 'notifications' }); // Declara e inicializa "status"
                            perm = status.state; // Asigna valor
                        } catch { perm = 'No consultable'; }
                    }
                    modernOut.textContent = [
                        `userAgentData: ${uaData}`,
                        `connection: ${conn}`,
                        `permissions(notifications): ${perm}`,
                        `clipboard: ${'clipboard' in navigator} | share: ${'share' in navigator} | sendBeacon: ${'sendBeacon' in navigator}`
                    ].join('\n'); // Ejecuta llamada o método
                    SoundFX.success(); // Ejecuta llamada o método
                });
            }
        },

        // Registra una línea con marca temporal en el terminal
        log(message) { // Instrucción JavaScript
            if (!this.terminal) return; // Evalúa condición

            const now = new Date(); // Declara e inicializa "now"
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':'); // Ejecuta llamada o método

            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = 'nv-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="nv-log-time">[${timeStr}]</span>
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
        NVLabController.init(); // Ejecuta llamada o método
    }

    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
