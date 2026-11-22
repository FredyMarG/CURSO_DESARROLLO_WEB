/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: NOTIFICATIONS API
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
        // Modo de visualización activo: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar efectos sonoros
        soundEnabled: true,
        // Estado de apertura de la ventana modal de vista general
        overviewOpen: false
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

        // Tono agradable al emitir una notificación
        notify() { // Instrucción JavaScript
            if (!AppState.soundEnabled) return; // Evalúa condición
            this.init(); // Ejecuta llamada o método
            if (!this.ctx) return; // Evalúa condición
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            osc.type = 'sine'; // Asigna valor
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            osc.frequency.setValueAtTime(660, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.14); // Ejecuta llamada o método

            gain.gain.setValueAtTime(0.06, now); // Ejecuta llamada o método
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

        // Procesa atajos de teclado ignorando campos de formulario
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE NOTIFICATIONS API
       ========================================================================== */
    // Gestiona permisos reales, emisión de notificaciones nativas y registro de eventos
    const NTLabController = { // Declara e inicializa "NTLabController"
        // Inicializa referencias del DOM y actualiza el estado inicial
        init() { // Instrucción JavaScript
            this.banner = document.getElementById('ntPermissionBanner'); // Asigna valor
            this.permText = document.getElementById('ntPermissionText'); // Asigna valor
            this.supportBadge = document.getElementById('ntSupportBadge'); // Asigna valor

            this.titleInput = document.getElementById('ntTitleInput'); // Asigna valor
            this.bodyInput = document.getElementById('ntBodyInput'); // Asigna valor
            this.tagInput = document.getElementById('ntTagInput'); // Asigna valor

            this.btnRequestPerm = document.getElementById('btnRequestPerm'); // Asigna valor
            this.btnSendNotif = document.getElementById('btnSendNotif'); // Asigna valor
            this.btnSimNotif = document.getElementById('btnSimNotif'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearNtLogs'); // Asigna valor
            this.terminal = document.getElementById('ntLogTerminal'); // Asigna valor

            this.bindControls(); // Ejecuta llamada o método
            this.updatePermissionUI(); // Ejecuta llamada o método
        },

        // Actualiza las insignias y colores según Notification.permission
        updatePermissionUI() { // Instrucción JavaScript
            const supported = 'Notification' in window; // Declara e inicializa "supported"

            if (this.supportBadge) { // Evalúa condición
                this.supportBadge.textContent = supported
                    ? 'Soporte Nativo: Disponible ✔️'
                    : 'Soporte Nativo: No disponible ❌'; // Instrucción JavaScript
                this.supportBadge.className = supported ? 'badge badge-emerald' : 'badge badge-purple'; // Asigna valor
            }

            if (!supported) { // Evalúa condición
                if (this.permText) this.permText.textContent = 'Notification no soportada en este entorno'; // Evalúa condición
                return; // Retorna resultado
            }

            const perm = Notification.permission; // Declara e inicializa "perm"
            if (this.permText) { // Evalúa condición
                this.permText.textContent = `Notification.permission === "${perm}"`; // Actualiza contenido en el DOM
            }

            if (this.banner) { // Evalúa condición
                this.banner.className = 'nt-permission-banner'; // Asigna valor
                if (perm === 'granted') this.banner.classList.add('is-granted'); // Evalúa condición
                if (perm === 'denied') this.banner.classList.add('is-denied'); // Evalúa condición
            }
        },

        // Vincula los botones del laboratorio
        bindControls() { // Instrucción JavaScript
            // Botón para solicitar permiso nativo mediante Notification.requestPermission()
            if (this.btnRequestPerm) { // Evalúa condición
                this.btnRequestPerm.addEventListener('click', async () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método

                    if (!('Notification' in window)) { // Evalúa condición
                        this.log('❌ Tu navegador no soporta la API Notification.'); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }

                    try { // Inicia bloque protegido contra errores
                        this.log('🔑 Solicitando permiso mediante Notification.requestPermission()...'); // Ejecuta llamada o método
                        const result = await Notification.requestPermission(); // Declara e inicializa "result"
                        this.updatePermissionUI(); // Ejecuta llamada o método
                        this.log(`📋 Decisión del usuario: "${result}"`); // Ejecuta llamada o método
                        if (result === 'granted') SoundFX.notify(); // Evalúa condición
                    } catch (err) { // Instrucción JavaScript
                        this.log(`⚠️ Error al solicitar permiso: ${err.message}`); // Ejecuta llamada o método
                    }
                });
            }

            // Botón para emitir una notificación real en el sistema operativo
            if (this.btnSendNotif) { // Evalúa condición
                this.btnSendNotif.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método

                    if (!('Notification' in window)) { // Evalúa condición
                        this.log('❌ Notification API no disponible en este navegador.'); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }

                    if (Notification.permission !== 'granted') { // Evalúa condición
                        this.log(`⚠️ No se puede emitir alerta real: permiso actual es "${Notification.permission}". Pulsa "Solicitar Permiso" primero.`); // Ejecuta llamada o método
                        return; // Retorna resultado
                    }

                    const title = (this.titleInput && this.titleInput.value.trim()) || 'Notificación Master Level'; // Declara e inicializa "title"
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Contenido de prueba'; // Declara e inicializa "body"
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'master-level-tag'; // Declara e inicializa "tag"

                    // Instanciamos la notificación nativa real
                    const noti = new Notification(title, { body, tag }); // Declara e inicializa "noti"
                    SoundFX.notify(); // Ejecuta llamada o método
                    this.log(`🔔 Notificación real enviada -> "${title}" (tag: "${tag}")`); // Ejecuta llamada o método

                    // Registramos eventos sobre la instancia creada
                    noti.addEventListener('show', () => this.log('👁️ [Evento show] La alerta apareció en pantalla.')); // Registra escuchador de eventos
                    noti.addEventListener('click', () => { // Registra escuchador de eventos
                        window.focus(); // Ejecuta llamada o método
                        noti.close(); // Ejecuta llamada o método
                        this.log('🖱️ [Evento click] Usuario pulsó la notificación -> window.focus() + close().'); // Ejecuta llamada o método
                    });
                    noti.addEventListener('close', () => this.log('❎ [Evento close] La notificación fue cerrada.')); // Registra escuchador de eventos
                    noti.addEventListener('error', () => this.log('❌ [Evento error] Ocurrió un error al mostrar la notificación.')); // Registra escuchador de eventos
                });
            }

            // Botón para simular la notificación en el terminal sin requerir permiso del SO
            if (this.btnSimNotif) { // Evalúa condición
                this.btnSimNotif.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.notify(); // Ejecuta llamada o método
                    const title = (this.titleInput && this.titleInput.value.trim()) || '¡Nuevo Mensaje!'; // Declara e inicializa "title"
                    const body = (this.bodyInput && this.bodyInput.value.trim()) || 'Alerta simulada'; // Declara e inicializa "body"
                    const tag = (this.tagInput && this.tagInput.value.trim()) || 'demo-tag'; // Declara e inicializa "tag"
                    this.log(`🧪 [Simulación] new Notification("${title}", { body: "${body}", tag: "${tag}" })`); // Ejecuta llamada o método
                });
            }

            // Botón para limpiar la consola del laboratorio
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
            line.className = 'nt-log-line'; // Asigna valor
            line.innerHTML = `
                <span class="nt-log-time">[${timeStr}]</span>
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
        NTLabController.init(); // Ejecuta llamada o método
    }

    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
