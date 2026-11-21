/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WEB WORKERS API
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
    // Objeto centralizado que almacena el estado reactivo de la presentación y del laboratorio
    const AppState = { // Declara e inicializa "AppState"
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 12,
        // Modo de visualización activo: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar efectos sonoros
        soundEnabled: true,
        // Estado de apertura de la ventana modal de vista general
        overviewOpen: false,

        // Estado del laboratorio interactivo de Web Workers
        wwLab: { // Instrucción JavaScript
            // Referencia a la instancia activa de Worker
            worker: null,
            // Contador de clics realizados en la interfaz principal para probar fluidez
            uiClicks: 0,
            // Marca de tiempo de inicio del cálculo para medir duración
            startTime: 0
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin archivos externos
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio tras la primera acción del usuario
        init() { // Instrucción JavaScript
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioConstructor"
                this.ctx = new AudioConstructor(); // Asigna valor
            }
        },

        // Sonido suave de transición entre diapositivas
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

        // Sonido breve de clic para botones
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

        // Tono de confirmación cuando el Worker devuelve el resultado
        complete() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.init(); // Ejecuta llamada o método
            if (!this.ctx) return; // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            osc.type = 'sine'; // Asigna valor
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            osc.frequency.setValueAtTime(520, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.16); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.06, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Ejecuta llamada o método

            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.18); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, atajos de teclado y modal de índice
    const SlideNavigation = { // Declara e inicializa "SlideNavigation"
        // Inicializa referencias del DOM y eventos
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

        // Construye los puntos de paginación inferiores
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

        // Construye las miniaturas del modal de índice general
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

        // Registra eventos de botones y teclado
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

        // Procesa atajos de teclado ignorando campos de texto
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE WEB WORKERS (WWLabController)
       ========================================================================== */
    // Gestiona la ejecución real de un Worker en segundo plano y mide la fluidez del hilo principal
    const WWLabController = { // Declara e inicializa "WWLabController"
        // Inicializa referencias del DOM y vincula controles
        init() { // Instrucción JavaScript
            this.banner = document.getElementById('wwStatusBanner'); // Asigna valor
            this.statusText = document.getElementById('wwStatusText'); // Asigna valor
            this.badgeState = document.getElementById('wwBadgeState'); // Asigna valor

            this.uiClicksEl = document.getElementById('wwUiClicks'); // Asigna valor
            this.workerResultEl = document.getElementById('wwWorkerResult'); // Asigna valor
            this.elapsedTimeEl = document.getElementById('wwElapsedTime'); // Asigna valor

            this.btnStart = document.getElementById('btnStartWorker'); // Asigna valor
            this.btnTestUi = document.getElementById('btnTestUiFluency'); // Asigna valor
            this.btnTerminate = document.getElementById('btnTerminateWorker'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearWwLogs'); // Asigna valor
            this.terminal = document.getElementById('wwLogTerminal'); // Asigna valor

            this.bindControls(); // Ejecuta llamada o método
        },

        // Crea una instancia de Worker compatible tanto con localhost (worker.js) como con file:// (Blob)
        createWorkerInstance() { // Instrucción JavaScript
            try { // Inicia bloque protegido contra errores
                // Si estamos bajo protocolo http/https usamos el archivo externo worker.js directamente
                if (window.location.protocol !== 'file:') { // Evalúa condición
                    return new Worker('worker.js', { name: 'worker-calculo-intensivo' }); // Retorna resultado
                }
            } catch (_) { // Instrucción JavaScript
                // Si falla por seguridad local, continuamos hacia el respaldo con Blob
            }

            // Respaldo dinámico mediante Blob para que funcione incluso abriendo index.html con doble clic
            const workerCode = `
                self.onmessage = (e) => {
                    const { iteraciones } = e.data;
                    let suma = 0;
                    for (let i = 0; i < iteraciones; i++) {
                        suma += i;
                    }
                    self.postMessage(suma);
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' }); // Declara e inicializa "blob"
            const blobUrl = URL.createObjectURL(blob); // Declara e inicializa "blobUrl"
            return new Worker(blobUrl, { name: 'worker-calculo-blob' }); // Retorna resultado
        },

        // Vincula los eventos de los botones del laboratorio
        bindControls() { // Instrucción JavaScript
            // Botón para probar que la interfaz nunca se congela durante el cálculo
            if (this.btnTestUi) { // Evalúa condición
                this.btnTestUi.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    AppState.wwLab.uiClicks++; // Instrucción JavaScript
                    if (this.uiClicksEl) this.uiClicksEl.textContent = AppState.wwLab.uiClicks; // Evalúa condición
                });
            }

            // Botón para iniciar el cálculo pesado en el Web Worker
            if (this.btnStart) { // Evalúa condición
                this.btnStart.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método

                    if (typeof window.Worker === 'undefined') { // Evalúa condición
                        this.log('❌ Tu navegador no soporta Web Workers.'); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }

                    // Si existía un worker previo, lo limpiamos antes de crear uno nuevo
                    this.cleanupWorker(); // Ejecuta llamada o método

                    // Actualizamos interfaz al estado de ejecución
                    if (this.banner) this.banner.className = 'ww-status-banner is-running'; // Evalúa condición
                    if (this.statusText) this.statusText.textContent = 'Calculando 500,000,000 iteraciones en hilo secundario...'; // Evalúa condición
                    if (this.badgeState) { // Evalúa condición
                        this.badgeState.textContent = 'Ejecutando ⚙️'; // Actualiza contenido en el DOM
                        this.badgeState.className = 'badge badge-cyan'; // Asigna valor
                    }
                    if (this.workerResultEl) this.workerResultEl.textContent = 'Calculando...'; // Evalúa condición
                    if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = '...'; // Evalúa condición

                    this.btnStart.disabled = true; // Asigna valor
                    if (this.btnTerminate) this.btnTerminate.disabled = false; // Evalúa condición

                    // Creamos el worker y guardamos el tiempo de inicio
                    AppState.wwLab.startTime = performance.now(); // Asigna valor
                    const worker = this.createWorkerInstance(); // Declara e inicializa "worker"
                    AppState.wwLab.worker = worker; // Asigna valor

                    this.log('🚀 [main.js -> worker] postMessage({ iteraciones: 500000000 }) enviado.'); // Ejecuta llamada o método
                    worker.postMessage({ iteraciones: 500_000_000 }); // Ejecuta llamada o método

                    // Escuchamos la respuesta final del hilo secundario
                    worker.onmessage = (e) => { // Asigna valor
                        const elapsed = Math.round(performance.now() - AppState.wwLab.startTime); // Declara e inicializa "elapsed"
                        if (this.banner) this.banner.className = 'ww-status-banner is-done'; // Evalúa condición
                        if (this.statusText) this.statusText.textContent = 'Cálculo completado sin congelar el Main Thread.'; // Evalúa condición
                        if (this.badgeState) { // Evalúa condición
                            this.badgeState.textContent = 'Completado ✅'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-emerald'; // Asigna valor
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = e.data.toLocaleString('es-ES'); // Evalúa condición
                        if (this.elapsedTimeEl) this.elapsedTimeEl.textContent = `${elapsed} ms`; // Evalúa condición

                        SoundFX.complete(); // Ejecuta llamada o método
                        this.log(`📥 [onmessage] Resultado recibido en ${elapsed} ms: ${e.data.toLocaleString('es-ES')}`); // Ejecuta llamada o método
                        this.cleanupWorker(); // Ejecuta llamada o método
                    };

                    // Capturamos posibles errores del worker
                    worker.onerror = (err) => { // Asigna valor
                        if (this.banner) this.banner.className = 'ww-status-banner'; // Evalúa condición
                        if (this.statusText) this.statusText.textContent = `Error en worker: ${err.message}`; // Evalúa condición
                        this.log(`❌ [onerror] Fallo en el hilo secundario: ${err.message}`); // Ejecuta llamada o método
                        this.cleanupWorker(); // Ejecuta llamada o método
                    };
                });
            }

            // Botón para abortar manualmente el worker con terminate()
            if (this.btnTerminate) { // Evalúa condición
                this.btnTerminate.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (AppState.wwLab.worker) { // Evalúa condición
                        this.cleanupWorker(); // Ejecuta llamada o método
                        if (this.banner) this.banner.className = 'ww-status-banner'; // Evalúa condición
                        if (this.statusText) this.statusText.textContent = 'Worker destruido manualmente con terminate().'; // Evalúa condición
                        if (this.badgeState) { // Evalúa condición
                            this.badgeState.textContent = 'Terminado 🛑'; // Actualiza contenido en el DOM
                            this.badgeState.className = 'badge badge-purple'; // Asigna valor
                        }
                        if (this.workerResultEl) this.workerResultEl.textContent = 'Abortado'; // Evalúa condición
                        this.log('🛑 [worker.terminate()] Hilo secundario destruido inmediatamente.'); // Ejecuta llamada o método
                    }
                });
            }

            // Botón para limpiar el terminal del laboratorio
            if (this.btnClearLogs) { // Evalúa condición
                this.btnClearLogs.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.terminal) { // Evalúa condición
                        this.terminal.innerHTML = ''; // Actualiza contenido en el DOM
                        this.log('🧹 Terminal de eventos limpiado.'); // Ejecuta llamada o método
                    }
                });
            }
        },

        // Termina la instancia activa del worker y restablece los botones
        cleanupWorker() { // Instrucción JavaScript
            if (AppState.wwLab.worker) { // Evalúa condición
                AppState.wwLab.worker.terminate(); // Ejecuta llamada o método
                AppState.wwLab.worker = null; // Asigna valor
            }
            if (this.btnStart) this.btnStart.disabled = false; // Evalúa condición
            if (this.btnTerminate) this.btnTerminate.disabled = true; // Evalúa condición
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
            line.className = 'ww-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="ww-log-time">[${timeStr}]</span>
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
        WWLabController.init(); // Ejecuta llamada o método
    }

    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
