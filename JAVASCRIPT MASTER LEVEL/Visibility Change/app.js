/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: PAGE VISIBILITY API (visibilitychange)
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
    // Objeto centralizado que almacena el estado reactivo de la presentación y el laboratorio
    const AppState = { // Declara e inicializa "AppState"
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 12,
        // Modo de visualización activo: 'slides' (diapositivas) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar los efectos sonoros
        soundEnabled: true,
        // Estado de apertura del modal de vista general
        overviewOpen: false,

        // Estado del laboratorio interactivo de Page Visibility API
        vcLab: { // Instrucción JavaScript
            // Estado lógico actual ("visible" o "hidden")
            currentState: 'visible',
            // Contador de segundos transcurridos con la pestaña visible
            activeSeconds: 0,
            // Contador de segundos transcurridos con la pestaña oculta
            hiddenSeconds: 0,
            // Contador total de cambios de visibilidad detectados
            switchCount: 0,
            // Estado del reproductor inteligente: reproduciendo o pausado
            isPlaying: true,
            // Bandera para recordar si fue pausado automáticamente al ocultar la pestaña
            pausedBySystem: false,
            // Título original de la pestaña para restaurarlo al volver
            originalTitle: document.title
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin archivos externos
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio de forma segura tras la primera acción del usuario
        init() { // Instrucción JavaScript
            // Verificamos si no existe contexto aún y el navegador soporta AudioContext
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                // Obtenemos el constructor estándar o con prefijo WebKit
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioConstructor"
                // Creamos la instancia del contexto de audio
                this.ctx = new AudioConstructor(); // Asigna valor
            }
        },

        // Sonido suave de transición al cambiar de diapositiva
        slide() { // Instrucción JavaScript
            // Si el sonido está desactivado, salimos
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos el contexto si es necesario
            this.init(); // Ejecuta llamada o método
            // Validamos soporte
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos si el navegador suspendió el contexto
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos oscilador y nodo de ganancia
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda senoidal suave
            osc.type = 'sine'; // Asigna valor
            // Tiempo actual del reloj de audio
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Frecuencia ascendente de 320 Hz a 480 Hz
            osc.frequency.setValueAtTime(320, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12); // Ejecuta llamada o método

            // Envolvente de volumen suave
            gain.gain.setValueAtTime(0.001, now); // Ejecuta llamada o método
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Ejecuta llamada o método

            // Conexiones y reproducción
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.18); // Ejecuta llamada o método
        },

        // Sonido breve de clic para botones
        click() { // Instrucción JavaScript
            // Salimos si el sonido está apagado
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos
            this.init(); // Ejecuta llamada o método
            // Validamos
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos oscilador y ganancia
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda triangular percusiva
            osc.type = 'triangle'; // Asigna valor
            // Marca temporal
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Tono agudo corto de 600 Hz
            osc.frequency.setValueAtTime(600, now); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Ejecuta llamada o método

            // Conexión y disparo
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.04); // Ejecuta llamada o método
        },

        // Tono notificatorio cuando el usuario regresa a la pestaña visible
        welcomeBack() { // Instrucción JavaScript
            // Verificamos si el audio está activo
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos
            this.init(); // Ejecuta llamada o método
            // Validamos
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos oscilador y ganancia
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda senoidal limpia
            osc.type = 'sine'; // Asigna valor
            // Tiempo actual
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Tono de bienvenida de 520 Hz a 780 Hz
            osc.frequency.setValueAtTime(520, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.15); // Ejecuta llamada o método
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16); // Ejecuta llamada o método

            // Conexión y ejecución
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.16); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, teclado, modo guía y modal de índice
    const SlideNavigation = { // Declara e inicializa "SlideNavigation"
        // Inicializa referencias del DOM y eventos
        init() { // Instrucción JavaScript
            // Contenedor principal y diapositivas
            this.wrapper = document.getElementById('presentationWrapper'); // Asigna valor
            this.slides = document.querySelectorAll('.slide'); // Asigna valor
            // Barra de progreso y etiqueta de página
            this.progressBar = document.getElementById('progressBar'); // Asigna valor
            this.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor

            // Controles inferiores
            this.btnPrev = document.getElementById('btnPrevSlide'); // Asigna valor
            this.btnNext = document.getElementById('btnNextSlide'); // Asigna valor
            this.dotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            // Botón de alternancia de modo presentación / guía
            this.btnGoLab = document.getElementById('btnGoLab'); // Asigna valor
            this.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.modeText = document.getElementById('modeText'); // Asigna valor
            this.modeIcon = document.getElementById('modeIcon'); // Asigna valor

            // Botón de audio
            this.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.soundIcon = document.getElementById('soundIcon'); // Asigna valor

            // Modal de índice general
            this.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            // Generamos puntos inferiores y tarjetas del modal
            this.buildSlideDots(); // Ejecuta llamada o método
            this.buildOverviewGrid(); // Ejecuta llamada o método
            // Vinculamos eventos de interacción
            this.bindEvents(); // Ejecuta llamada o método
            // Refrescamos interfaz inicial
            this.updateUI(); // Ejecuta llamada o método
        },

        // Construye los puntos de paginación inferiores
        buildSlideDots() { // Instrucción JavaScript
            // Validamos existencia
            if (!this.dotsContainer) return; // Evalúa condición
            // Limpiamos contenido previo
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            // Iteramos sobre las diapositivas
            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                const dot = document.createElement('button'); // Crea nuevo elemento DOM "dot"
                dot.className = 'slide-dot'; // Asigna valor
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`); // Ejecuta llamada o método
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Asigna valor

                // Resaltamos el punto activo
                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    dot.classList.add('active'); // Modifica clases CSS del elemento
                }

                // Saltamos a la diapositiva al hacer clic
                dot.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                });

                // Insertamos en el DOM
                this.dotsContainer.appendChild(dot); // Inserta nodo en el DOM
            });
        },

        // Construye las miniaturas del modal de vista general
        buildOverviewGrid() { // Instrucción JavaScript
            // Validamos existencia
            if (!this.overviewGrid) return; // Evalúa condición
            // Vaciamos rejilla previa
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            // Creamos una tarjeta por cada diapositiva
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

        // Registra todos los escuchadores de eventos de controles y teclado
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

            // Atajos de teclado
            document.addEventListener('keydown', (e) => this.handleKeyDown(e)); // Registra escuchador de eventos
        },

        // Procesa atajos de teclado para navegar cómodamente
        handleKeyDown(e) { // Instrucción JavaScript
            // No interferimos si el foco está en un campo de entrada
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

        // Cambia a la diapositiva solicitada
        goToSlide(index) { // Instrucción JavaScript
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición
            if (index === AppState.currentSlide) return; // Evalúa condición
            AppState.currentSlide = index; // Asigna valor
            SoundFX.slide(); // Ejecuta llamada o método
            this.updateUI(); // Ejecuta llamada o método
        },

        // Avanza una diapositiva
        nextSlide() { // Instrucción JavaScript
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
                this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
            }
        },

        // Retrocede una diapositiva
        prevSlide() { // Instrucción JavaScript
            if (AppState.currentSlide > 1) { // Evalúa condición
                this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
            }
        },

        // Alterna entre modo presentación y modo documento continuo
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

        // Activa o desactiva el sonido
        toggleSound() { // Instrucción JavaScript
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            if (this.soundIcon) { // Evalúa condición
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            if (AppState.soundEnabled) SoundFX.click(); // Evalúa condición
        },

        // Alterna la ventana modal de índice
        toggleOverview() { // Instrucción JavaScript
            if (AppState.overviewOpen) { // Evalúa condición
                this.closeOverview(); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                this.openOverview(); // Ejecuta llamada o método
            }
        },

        // Abre el modal de vista general
        openOverview() { // Instrucción JavaScript
            AppState.overviewOpen = true; // Asigna valor
            if (this.overviewModal) this.overviewModal.classList.add('active'); // Evalúa condición
            const cards = document.querySelectorAll('.overview-card'); // Obtiene referencia DOM para "cards"
            cards.forEach(card => { // Instrucción JavaScript
                const idx = parseInt(card.dataset.slideIndex, 10); // Declara e inicializa "idx"
                card.classList.toggle('active', idx === AppState.currentSlide); // Modifica clases CSS del elemento
            });
        },

        // Cierra el modal de vista general
        closeOverview() { // Instrucción JavaScript
            AppState.overviewOpen = false; // Asigna valor
            if (this.overviewModal) this.overviewModal.classList.remove('active'); // Evalúa condición
        },

        // Alterna pantalla completa nativa
        toggleFullscreen() { // Instrucción JavaScript
            if (!document.fullscreenElement) { // Evalúa condición
                document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            } else if (document.exitFullscreen) { // Instrucción JavaScript
                document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
            }
        },

        // Actualiza visibilidad de diapositivas, barra de progreso y botones
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE VISIBILITYCHANGE
       ========================================================================== */
    // Escucha el evento real document.visibilitychange y simula el reproductor inteligente
    const VCLabController = { // Declara e inicializa "VCLabController"
        // Inicializa referencias, contadores y escuchadores nativos
        init() { // Instrucción JavaScript
            // Referencias del banner de estado
            this.banner = document.getElementById('vcStatusBanner'); // Asigna valor
            this.stateText = document.getElementById('vcStateText'); // Asigna valor
            this.hiddenBadge = document.getElementById('vcHiddenBadge'); // Asigna valor

            // Referencias de tarjetas de métricas
            this.activeSecondsEl = document.getElementById('vcActiveSeconds'); // Asigna valor
            this.hiddenSecondsEl = document.getElementById('vcHiddenSeconds'); // Asigna valor
            this.switchCountEl = document.getElementById('vcSwitchCount'); // Asigna valor

            // Referencias del reproductor inteligente
            this.playerTitle = document.getElementById('vcPlayerTitle'); // Asigna valor
            this.playerSub = document.getElementById('vcPlayerSub'); // Asigna valor
            this.btnTogglePlayer = document.getElementById('btnTogglePlayer'); // Asigna valor

            // Botones de simulación y terminal
            this.btnSimHide = document.getElementById('btnSimHide'); // Asigna valor
            this.btnSimShow = document.getElementById('btnSimShow'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearVcLogs'); // Asigna valor
            this.terminal = document.getElementById('vcLogTerminal'); // Asigna valor

            // Vinculamos el evento real visibilitychange sobre document
            this.bindVisibilityEvent(); // Ejecuta llamada o método
            // Vinculamos botones del laboratorio
            this.bindControls(); // Ejecuta llamada o método
            // Iniciamos el cronómetro de tiempo activo vs oculto (1 segundo)
            this.startMetricsTimer(); // Ejecuta llamada o método
            // Sincronizamos el estado inicial en la UI
            this.updateUI(); // Ejecuta llamada o método
        },

        // Registra el escuchador nativo del navegador sobre document
        bindVisibilityEvent() { // Instrucción JavaScript
            document.addEventListener('visibilitychange', () => { // Registra escuchador de eventos
                // Delegamos el manejo al método común pasando el estado real del navegador
                this.handleVisibilityChange(document.visibilityState, false); // Ejecuta llamada o método
            });
        },

        // Procesa una transición de estado (real o simulada)
        handleVisibilityChange(newState, isSimulated) { // Instrucción JavaScript
            // Actualizamos el estado guardado
            AppState.vcLab.currentState = newState; // Asigna valor
            // Incrementamos el contador de cambios detectados
            AppState.vcLab.switchCount++; // Instrucción JavaScript

            // Evaluamos si pasó a segundo plano ("hidden") o regresó a primer plano ("visible")
            if (newState === 'hidden') { // Evalúa condición
                // Si el reproductor estaba activo, lo pausamos automáticamente
                if (AppState.vcLab.isPlaying) { // Evalúa condición
                    AppState.vcLab.isPlaying = false; // Asigna valor
                    AppState.vcLab.pausedBySystem = true; // Asigna valor
                    document.title = '⏸️ En pausa - Vuelve pronto'; // Asigna valor
                }
                const prefix = isSimulated ? '[Simulación]' : '[Evento Real]'; // Declara e inicializa "prefix"
                this.log(`🙈 ${prefix} visibilityState === "hidden" (hidden: true). Procesos pausados.`); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                // Si fue pausado por el sistema al ocultarse, reanudamos automáticamente
                if (AppState.vcLab.pausedBySystem) { // Evalúa condición
                    AppState.vcLab.isPlaying = true; // Asigna valor
                    AppState.vcLab.pausedBySystem = false; // Asigna valor
                }
                // Restauramos el título original de la pestaña
                document.title = AppState.vcLab.originalTitle; // Asigna valor
                // Emitimos sonido sutil al regresar
                SoundFX.welcomeBack(); // Ejecuta llamada o método
                const prefix = isSimulated ? '[Simulación]' : '[Evento Real]'; // Declara e inicializa "prefix"
                this.log(`👁️ ${prefix} visibilityState === "visible" (hidden: false). Pestaña activa.`); // Ejecuta llamada o método
            }

            // Refrescamos todas las tarjetas y badges visuales
            this.updateUI(); // Ejecuta llamada o método
        },

        // Vincula los botones interactivos de simulación y control manual
        bindControls() { // Instrucción JavaScript
            // Botón para pausar o reproducir manualmente el reproductor inteligente
            if (this.btnTogglePlayer) { // Evalúa condición
                this.btnTogglePlayer.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    // Alternamos reproducción
                    AppState.vcLab.isPlaying = !AppState.vcLab.isPlaying; // Asigna valor
                    // Al ser acción manual del usuario, limpiamos la bandera automática
                    AppState.vcLab.pausedBySystem = false; // Asigna valor
                    const msg = AppState.vcLab.isPlaying
                        ? '▶️ Reproducción iniciada manualmente por el usuario.'
                        : '⏸️ Pausado manualmente (no se reanudará solo al volver).'; // Instrucción JavaScript
                    this.log(msg); // Ejecuta llamada o método
                    this.updateUI(); // Ejecuta llamada o método
                });
            }

            // Botón para simular ocultar la pestaña ("hidden")
            if (this.btnSimHide) { // Evalúa condición
                this.btnSimHide.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.handleVisibilityChange('hidden', true); // Ejecuta llamada o método
                });
            }

            // Botón para simular regresar a la pestaña ("visible")
            if (this.btnSimShow) { // Evalúa condición
                this.btnSimShow.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.handleVisibilityChange('visible', true); // Ejecuta llamada o método
                });
            }

            // Botón para limpiar los registros del terminal
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

        // Inicia un intervalo de 1 segundo para contabilizar tiempo visible vs oculto
        startMetricsTimer() { // Instrucción JavaScript
            setInterval(() => { // Instrucción JavaScript
                // Incrementamos el contador correspondiente según el estado actual
                if (AppState.vcLab.currentState === 'visible') { // Evalúa condición
                    AppState.vcLab.activeSeconds++; // Instrucción JavaScript
                } else { // Instrucción JavaScript
                    AppState.vcLab.hiddenSeconds++; // Instrucción JavaScript
                }
                // Actualizamos los contadores numéricos en pantalla
                if (this.activeSecondsEl) this.activeSecondsEl.textContent = `${AppState.vcLab.activeSeconds}s`; // Evalúa condición
                if (this.hiddenSecondsEl) this.hiddenSecondsEl.textContent = `${AppState.vcLab.hiddenSeconds}s`; // Evalúa condición
            }, 1000); // Ejecuta llamada o método
        },

        // Sincroniza los elementos visuales del laboratorio con el estado actual
        updateUI() { // Instrucción JavaScript
            const isVisible = AppState.vcLab.currentState === 'visible'; // Declara e inicializa "isVisible"

            // Actualizamos banner y badges de estado
            if (this.banner) { // Evalúa condición
                this.banner.className = isVisible ? 'vc-status-banner is-visible' : 'vc-status-banner is-hidden'; // Asigna valor
            }
            if (this.stateText) { // Evalúa condición
                this.stateText.textContent = `document.visibilityState === "${AppState.vcLab.currentState}"`; // Actualiza contenido en el DOM
            }
            if (this.hiddenBadge) { // Evalúa condición
                this.hiddenBadge.textContent = `document.hidden: ${!isVisible}`; // Actualiza contenido en el DOM
                this.hiddenBadge.className = isVisible ? 'badge badge-emerald' : 'badge badge-purple'; // Asigna valor
            }

            // Actualizamos contador de cambios de pestaña
            if (this.switchCountEl) { // Evalúa condición
                this.switchCountEl.textContent = AppState.vcLab.switchCount; // Actualiza contenido en el DOM
            }

            // Actualizamos interfaz del reproductor inteligente
            if (this.playerTitle && this.playerSub && this.btnTogglePlayer) { // Evalúa condición
                if (AppState.vcLab.isPlaying) { // Evalúa condición
                    this.playerTitle.textContent = '▶️ Reproductor Inteligente: Reproduciendo'; // Actualiza contenido en el DOM
                    this.playerSub.textContent = 'Se pausará automáticamente si ocultas la pestaña.'; // Actualiza contenido en el DOM
                    this.btnTogglePlayer.textContent = '⏸️ Pausar Manual'; // Actualiza contenido en el DOM
                } else if (AppState.vcLab.pausedBySystem) { // Instrucción JavaScript
                    this.playerTitle.textContent = '⏸️ Reproductor Inteligente: Pausado por Sistema'; // Actualiza contenido en el DOM
                    this.playerSub.textContent = 'Se reanudará automáticamente cuando la pestaña vuelva a estar visible.'; // Actualiza contenido en el DOM
                    this.btnTogglePlayer.textContent = '▶️ Reanudar'; // Actualiza contenido en el DOM
                } else { // Instrucción JavaScript
                    this.playerTitle.textContent = '⏹️ Reproductor Inteligente: Pausado Manualmente'; // Actualiza contenido en el DOM
                    this.playerSub.textContent = 'Respetando pausa manual del usuario (no se reanudará solo).'; // Actualiza contenido en el DOM
                    this.btnTogglePlayer.textContent = '▶️ Reanudar'; // Actualiza contenido en el DOM
                }
            }
        },

        // Registra un evento con marca temporal en el terminal del laboratorio
        log(message) { // Instrucción JavaScript
            if (!this.terminal) return; // Evalúa condición

            const now = new Date(); // Declara e inicializa "now"
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':'); // Ejecuta llamada o método

            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = 'vc-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="vc-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            this.terminal.appendChild(line); // Inserta nodo en el DOM
            this.terminal.scrollTop = this.terminal.scrollHeight; // Asigna valor
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización general al cargar el documento
    function startApplication() { // Declara función
        // Iniciamos navegación de diapositivas
        SlideNavigation.init(); // Ejecuta llamada o método
        // Iniciamos el laboratorio interactivo de visibilitychange
        VCLabController.init(); // Ejecuta llamada o método
    }

    // Esperamos a que el DOM esté listo si aún se encuentra cargando
    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
