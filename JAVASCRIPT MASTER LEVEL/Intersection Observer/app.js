/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: INTERSECTION OBSERVER API
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
        // Modo de visualización: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Indicador booleano para activar o silenciar efectos sonoros
        soundEnabled: true,
        // Estado de apertura de la ventana modal de vista general
        overviewOpen: false,

        // Estado del laboratorio interactivo de Intersection Observer
        ioLab: { // Instrucción JavaScript
            // Umbral o arreglo de umbrales activo en el observador real
            threshold: [0, 0.25, 0.5, 0.75, 1],
            // Margen de raíz activo para expandir o contraer el marco de detección
            rootMargin: '0px',
            // Referencia a la instancia activa de IntersectionObserver
            observer: null
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin archivos de audio externos
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio de forma segura tras la primera acción
        init() { // Instrucción JavaScript
            // Comprobamos si no existe contexto y el navegador soporta Web Audio API
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                // Obtenemos la clase constructora estándar o con prefijo
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioConstructor"
                // Creamos la instancia del contexto de audio
                this.ctx = new AudioConstructor(); // Asigna valor
            }
        },

        // Sonido suave para transiciones entre diapositivas
        slide() { // Instrucción JavaScript
            // Si el sonido está silenciado, salimos
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos el contexto si aún no existe
            this.init(); // Ejecuta llamada o método
            // Si no hay soporte de audio, abortamos
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos el contexto si estuviera suspendido por políticas del navegador
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos un oscilador de audio
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos un nodo de ganancia para la envolvente de volumen
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda senoidal suave
            osc.type = 'sine'; // Asigna valor
            // Marca de tiempo actual del reloj de audio
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Frecuencia inicial de 320 Hz
            osc.frequency.setValueAtTime(320, now); // Ejecuta llamada o método
            // Rampa ascendente hasta 480 Hz en 120ms
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12); // Ejecuta llamada o método

            // Volumen inicial casi nulo
            gain.gain.setValueAtTime(0.001, now); // Ejecuta llamada o método
            // Ataque rápido hasta 0.08
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02); // Ejecuta llamada o método
            // Desvanecimiento suave en 180ms
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Ejecuta llamada o método

            // Conectamos el oscilador a la ganancia
            osc.connect(gain); // Ejecuta llamada o método
            // Conectamos la ganancia a los altavoces
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Iniciamos la generación del tono
            osc.start(now); // Ejecuta llamada o método
            // Detenemos el tono tras 180ms
            osc.stop(now + 0.18); // Ejecuta llamada o método
        },

        // Sonido percusivo breve para clics en botones
        click() { // Instrucción JavaScript
            // Salimos si el audio está desactivado
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Aseguramos inicialización
            this.init(); // Ejecuta llamada o método
            // Validamos existencia del contexto
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos si está suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Oscilador y nodo de ganancia
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda triangular ligera
            osc.type = 'triangle'; // Asigna valor
            // Tiempo actual
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Frecuencia de 600 Hz
            osc.frequency.setValueAtTime(600, now); // Ejecuta llamada o método
            // Volumen inicial
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            // Caída rápida en 40ms
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Ejecuta llamada o método

            // Conexiones del circuito de audio
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Disparo y parada
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.04); // Ejecuta llamada o método
        },

        // Tono agradable cuando un objetivo entra en el área de intersección
        intersectEnter() { // Instrucción JavaScript
            // Verificamos si el audio está activo
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos
            this.init(); // Ejecuta llamada o método
            // Validamos
            if (!this.ctx) return; // Evalúa condición
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Oscilador y ganancia
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"
            // Onda senoidal pura
            osc.type = 'sine'; // Asigna valor
            // Tiempo actual
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Tono ascendente de confirmación (540 Hz a 820 Hz)
            osc.frequency.setValueAtTime(540, now); // Ejecuta llamada o método
            osc.frequency.exponentialRampToValueAtTime(820, now + 0.12); // Ejecuta llamada o método

            // Envolvente suave
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14); // Ejecuta llamada o método

            // Conexión y ejecución
            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(this.ctx.destination); // Ejecuta llamada o método
            osc.start(now); // Ejecuta llamada o método
            osc.stop(now + 0.14); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, atajos de teclado y modal de índice
    const SlideNavigation = { // Declara e inicializa "SlideNavigation"
        // Inicializa las referencias del DOM y eventos
        init() { // Instrucción JavaScript
            // Contenedor principal y colección de diapositivas
            this.wrapper = document.getElementById('presentationWrapper'); // Asigna valor
            this.slides = document.querySelectorAll('.slide'); // Asigna valor
            // Barra de progreso e indicador numérico
            this.progressBar = document.getElementById('progressBar'); // Asigna valor
            this.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor

            // Botones inferiores y contenedor de puntos
            this.btnPrev = document.getElementById('btnPrevSlide'); // Asigna valor
            this.btnNext = document.getElementById('btnNextSlide'); // Asigna valor
            this.dotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            // Botón de alternancia de modo presentación / documento
            this.btnGoLab = document.getElementById('btnGoLab'); // Asigna valor
            this.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.modeText = document.getElementById('modeText'); // Asigna valor
            this.modeIcon = document.getElementById('modeIcon'); // Asigna valor

            // Botón de audio
            this.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.soundIcon = document.getElementById('soundIcon'); // Asigna valor

            // Elementos del modal de vista general
            this.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            // Construimos los puntos indicadores y la cuadrícula de miniaturas
            this.buildSlideDots(); // Ejecuta llamada o método
            this.buildOverviewGrid(); // Ejecuta llamada o método
            // Registramos escuchadores de eventos
            this.bindEvents(); // Ejecuta llamada o método
            // Sincronizamos el estado inicial
            this.updateUI(); // Ejecuta llamada o método
        },

        // Genera los círculos clicables en la barra inferior
        buildSlideDots() { // Instrucción JavaScript
            // Validamos existencia del contenedor
            if (!this.dotsContainer) return; // Evalúa condición
            // Limpiamos el contenido previo
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            // Creamos un botón por cada diapositiva
            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                // Índice basado en 1
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                // Elemento botón
                const dot = document.createElement('button'); // Crea nuevo elemento DOM "dot"
                // Clase visual
                dot.className = 'slide-dot'; // Asigna valor
                // Etiqueta de accesibilidad
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`); // Ejecuta llamada o método
                // Tooltip con el título de la diapositiva
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Asigna valor

                // Resaltamos el punto si coincide con la diapositiva activa
                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    dot.classList.add('active'); // Modifica clases CSS del elemento
                }

                // Al hacer clic saltamos a la diapositiva elegida
                dot.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                });

                // Insertamos en el DOM
                this.dotsContainer.appendChild(dot); // Inserta nodo en el DOM
            });
        },

        // Genera las tarjetas del índice visual dentro del modal
        buildOverviewGrid() { // Instrucción JavaScript
            // Validamos existencia
            if (!this.overviewGrid) return; // Evalúa condición
            // Limpiamos tarjetas previas
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            // Iteramos sobre todas las diapositivas
            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Declara e inicializa "title"

                // Creamos la tarjeta
                const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
                card.className = 'overview-card'; // Asigna valor
                card.dataset.slideIndex = slideNum; // Asigna valor

                // Marcamos como activa si corresponde
                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    card.classList.add('active'); // Modifica clases CSS del elemento
                }

                // Contenido interno de la tarjeta
                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                // Evento clic para navegar y cerrar el modal
                card.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });

                // Agregamos a la rejilla
                this.overviewGrid.appendChild(card); // Inserta nodo en el DOM
            });
        },

        // Asocia los eventos de clic y teclado a sus controladores
        bindEvents() { // Instrucción JavaScript
            // Botón anterior
            if (this.btnPrev) { // Evalúa condición
                this.btnPrev.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                });
            }

            // Botón siguiente
            if (this.btnNext) { // Evalúa condición
                this.btnNext.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                });
            }

            // Alternar modo presentación / guía
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

            // Alternar sonido
            if (this.btnToggleSound) { // Evalúa condición
                this.btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleSound(); // Ejecuta llamada o método
                });
            }

            // Abrir/cerrar cuadrícula general
            if (this.btnOverview) { // Evalúa condición
                this.btnOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                });
            }

            // Cerrar modal con botón X
            if (this.btnCloseOverview) { // Evalúa condición
                this.btnCloseOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });
            }

            // Cerrar modal haciendo clic fuera de la ventana
            if (this.overviewModal) { // Evalúa condición
                this.overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
                    if (e.target === this.overviewModal) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                });
            }

            // Pantalla completa
            if (this.btnFullscreen) { // Evalúa condición
                this.btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                });
            }

            // Atajos de teclado globales
            document.addEventListener('keydown', (e) => this.handleKeyDown(e)); // Registra escuchador de eventos
        },

        // Gestiona la navegación mediante teclas
        handleKeyDown(e) { // Instrucción JavaScript
            // Ignoramos si el usuario escribe en un campo de formulario
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; // Evalúa condición

            // Evaluamos la tecla pulsada
            switch (e.key) { // Evalúa múltiples casos
                // Avanzar con flecha derecha o D
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Retroceder con flecha izquierda o A
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Avanzar con barra espaciadora
                case ' ':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Abrir/cerrar cuadrícula con O
                case 'o':
                case 'O':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Pantalla completa con F
                case 'f':
                case 'F':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Cerrar modal con Escape
                case 'Escape':
                    if (AppState.overviewOpen) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                    break; // Instrucción JavaScript

                // Ir al inicio con Home
                case 'Home':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(1); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Ir al final con End
                case 'End':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(AppState.totalSlides); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                default:
                    break; // Instrucción JavaScript
            }
        },

        // Navega a la diapositiva indicada por su número
        goToSlide(index) { // Instrucción JavaScript
            // Validamos límites
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición
            // Evitamos recarga redundante si ya estamos en ella
            if (index === AppState.currentSlide) return; // Evalúa condición

            // Guardamos nuevo índice
            AppState.currentSlide = index; // Asigna valor
            // Sonido de transición
            SoundFX.slide(); // Ejecuta llamada o método
            // Refrescamos interfaz
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

        // Cambia entre vista de diapositivas individuales y documento continuo
        toggleViewMode() { // Instrucción JavaScript
            // Alternamos estado
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides'; // Asigna valor

            // Aplicamos clases correspondientes en el body
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

            // Sincronizamos visibilidad
            this.updateUI(); // Ejecuta llamada o método
        },

        // Activa o desactiva el audio
        toggleSound() { // Instrucción JavaScript
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            if (this.soundIcon) { // Evalúa condición
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            if (AppState.soundEnabled) SoundFX.click(); // Evalúa condición
        },

        // Abre o cierra el modal de índice
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

        // Actualiza diapositivas activas, barra de progreso, puntos y botones
        updateUI() { // Instrucción JavaScript
            // En modo presentación mostramos solo la diapositiva activa
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
                // En modo documento mostramos todas las secciones
                this.slides.forEach(slide => slide.classList.add('active')); // Modifica clases CSS del elemento
            }

            // Actualizamos barra de progreso
            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100; // Declara e inicializa "percent"
            if (this.progressBar) this.progressBar.style.width = `${percent}%`; // Evalúa condición

            // Actualizamos indicador de texto
            if (this.slideIndicator) { // Evalúa condición
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            // Actualizamos puntos de paginación
            const dots = document.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, index) => { // Instrucción JavaScript
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide); // Modifica clases CSS del elemento
            });

            // Deshabilitamos visualmente botones en los extremos
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE INTERSECTION OBSERVER
       ========================================================================== */
    // Implementa un IntersectionObserver REAL sobre un contenedor scrolleable del DOM
    const IOLabController = { // Declara e inicializa "IOLabController"
        // Inicializa referencias, eventos y crea el observador nativo
        init() { // Instrucción JavaScript
            // Contenedor scrollable que actúa como root del observador
            this.scrollViewport = document.getElementById('ioScrollViewport'); // Asigna valor
            // Terminal de logs del laboratorio
            this.terminal = document.getElementById('ioLogTerminal'); // Asigna valor

            // Mapa de los 3 elementos objetivo vigilados y sus elementos de métricas
            this.targets = [
                { // Instrucción JavaScript
                    el: document.getElementById('ioTarget1'),
                    badge: document.getElementById('badgeIo1'),
                    ratioText: document.getElementById('ratioText1'),
                    ratioBar: document.getElementById('ratioBar1'),
                    name: 'Objetivo #1'
                },
                { // Instrucción JavaScript
                    el: document.getElementById('ioTarget2'),
                    badge: document.getElementById('badgeIo2'),
                    ratioText: document.getElementById('ratioText2'),
                    ratioBar: document.getElementById('ratioBar2'),
                    name: 'Objetivo #2'
                },
                { // Instrucción JavaScript
                    el: document.getElementById('ioTarget3'),
                    badge: document.getElementById('badgeIo3'),
                    ratioText: document.getElementById('ratioText3'),
                    ratioBar: document.getElementById('ratioBar3'),
                    name: 'Objetivo #3'
                }
            ];

            // Referencias de botones de configuración de threshold
            this.btnThresh0 = document.getElementById('btnThresh0'); // Asigna valor
            this.btnThresh05 = document.getElementById('btnThresh05'); // Asigna valor
            this.btnThresh1 = document.getElementById('btnThresh1'); // Asigna valor
            this.btnThreshArray = document.getElementById('btnThreshArray'); // Asigna valor

            // Referencias de botones de configuración de rootMargin
            this.btnMargin0 = document.getElementById('btnMargin0'); // Asigna valor
            this.btnMarginPos = document.getElementById('btnMarginPos'); // Asigna valor
            this.btnMarginNeg = document.getElementById('btnMarginNeg'); // Asigna valor

            // Referencias de botones de utilidad
            this.btnResetScroll = document.getElementById('btnResetScroll'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearIoLogs'); // Asigna valor

            // Vinculamos los clics de todos los botones del panel
            this.bindControls(); // Ejecuta llamada o método
            // Creamos y arrancamos la primera instancia de IntersectionObserver
            this.createObserver(); // Ejecuta llamada o método
        },

        // Destruye cualquier observador previo y crea uno nuevo con las opciones activas
        createObserver() { // Instrucción JavaScript
            // Si ya existe un observador activo, lo desconectamos limpiamente para evitar fugas
            if (AppState.ioLab.observer) { // Evalúa condición
                AppState.ioLab.observer.disconnect(); // Ejecuta llamada o método
            }

            // Validamos que el contenedor root exista en el DOM
            if (!this.scrollViewport || typeof window.IntersectionObserver === 'undefined') return; // Evalúa condición

            // Construimos el objeto options con el root personalizado y los valores actuales
            const options = { // Declara e inicializa "options"
                // El marco de vigilancia es nuestra caja scrolleable en lugar de toda la ventana
                root: this.scrollViewport,
                // Margen de expansión o contracción configurado por el usuario
                rootMargin: AppState.ioLab.rootMargin,
                // Umbral o arreglo de umbrales configurado por el usuario
                threshold: AppState.ioLab.threshold
            };

            // Instanciamos el IntersectionObserver nativo del navegador
            const observer = new IntersectionObserver((entries) => { // Define función flecha "observer"
                // Recorremos cada entrada reportada por el motor del navegador
                entries.forEach((entry) => { // Instrucción JavaScript
                    // Buscamos la metadata visual asociada a este target
                    const item = this.targets.find(t => t.el === entry.target); // Define función flecha "item"
                    // Si no se encuentra, continuamos
                    if (!item) return; // Evalúa condición

                    // Calculamos el porcentaje redondeado de intersección
                    const pct = Math.round(entry.intersectionRatio * 100); // Declara e inicializa "pct"

                    // Aplicamos o removemos la clase visual luminosa en la tarjeta objetivo
                    if (entry.isIntersecting) { // Evalúa condición
                        item.el.classList.add('is-visible'); // Modifica clases CSS del elemento
                        // Reproducimos un sonido sutil de confirmación al entrar
                        SoundFX.intersectEnter(); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        item.el.classList.remove('is-visible'); // Modifica clases CSS del elemento
                    }

                    // Actualizamos el badge booleano de isIntersecting
                    if (item.badge) { // Evalúa condición
                        item.badge.textContent = `isIntersecting: ${entry.isIntersecting}`; // Actualiza contenido en el DOM
                        item.badge.className = entry.isIntersecting
                            ? 'io-badge-state is-true'
                            : 'io-badge-state is-false'; // Instrucción JavaScript
                    }

                    // Actualizamos el texto y la barra de progreso de intersectionRatio
                    if (item.ratioText) item.ratioText.textContent = `${pct}%`; // Evalúa condición
                    if (item.ratioBar) item.ratioBar.style.width = `${pct}%`; // Evalúa condición

                    // Registramos la transición en el terminal de eventos
                    const estado = entry.isIntersecting ? 'ENTRÓ 🟢' : 'SALIÓ 🔴'; // Declara e inicializa "estado"
                    this.log(`${estado} ${item.name} -> ratio: ${pct}% (isIntersecting: ${entry.isIntersecting})`); // Ejecuta llamada o método
                });
            }, options); // Ejecuta llamada o método

            // Guardamos la instancia activa en el estado global
            AppState.ioLab.observer = observer; // Asigna valor

            // Ponemos bajo vigilancia a cada uno de los 3 elementos objetivo
            this.targets.forEach((item) => { // Instrucción JavaScript
                if (item.el) { // Evalúa condición
                    observer.observe(item.el); // Ejecuta llamada o método
                }
            });
        },

        // Vincula los botones interactivos para cambiar options y controlar el scroll
        bindControls() { // Instrucción JavaScript
            // Función auxiliar para actualizar threshold y reconstruir el observador
            const setThreshold = (value, label) => { // Define función flecha "setThreshold"
                SoundFX.click(); // Ejecuta llamada o método
                AppState.ioLab.threshold = value; // Asigna valor
                this.log(`⚙️ Nuevo threshold aplicado: ${label}`); // Ejecuta llamada o método
                this.createObserver(); // Ejecuta llamada o método
            };

            // Función auxiliar para actualizar rootMargin y reconstruir el observador
            const setRootMargin = (value) => { // Define función flecha "setRootMargin"
                SoundFX.click(); // Ejecuta llamada o método
                AppState.ioLab.rootMargin = value; // Asigna valor
                this.log(`📏 Nuevo rootMargin aplicado: "${value}"`); // Ejecuta llamada o método
                this.createObserver(); // Ejecuta llamada o método
            };

            // Botones de threshold
            if (this.btnThresh0) this.btnThresh0.addEventListener('click', () => setThreshold(0, '0')); // Evalúa condición
            if (this.btnThresh05) this.btnThresh05.addEventListener('click', () => setThreshold(0.5, '0.5')); // Evalúa condición
            if (this.btnThresh1) this.btnThresh1.addEventListener('click', () => setThreshold(1.0, '1.0')); // Evalúa condición
            if (this.btnThreshArray) this.btnThreshArray.addEventListener('click', () => setThreshold([0, 0.25, 0.5, 0.75, 1], '[0, 0.25, 0.5, 0.75, 1]')); // Evalúa condición

            // Botones de rootMargin
            if (this.btnMargin0) this.btnMargin0.addEventListener('click', () => setRootMargin('0px')); // Evalúa condición
            if (this.btnMarginPos) this.btnMarginPos.addEventListener('click', () => setRootMargin('40px')); // Evalúa condición
            if (this.btnMarginNeg) this.btnMarginNeg.addEventListener('click', () => setRootMargin('-40px')); // Evalúa condición

            // Botón para devolver la caja scrolleable al tope superior
            if (this.btnResetScroll) { // Evalúa condición
                this.btnResetScroll.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    if (this.scrollViewport) { // Evalúa condición
                        this.scrollViewport.scrollTo({ top: 0, behavior: 'smooth' }); // Ejecuta llamada o método
                        this.log('⬆️ Scroll restablecido al inicio.'); // Ejecuta llamada o método
                    }
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

        // Añade una línea con marca temporal al terminal del laboratorio
        log(message) { // Instrucción JavaScript
            // Si no existe terminal en el DOM, salimos
            if (!this.terminal) return; // Evalúa condición

            // Generamos la hora actual en formato HH:MM:SS
            const now = new Date(); // Declara e inicializa "now"
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':'); // Ejecuta llamada o método

            // Creamos el elemento div de la línea
            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = 'io-log-line'; // Asigna valor

            // Rellenamos con la marca temporal y el mensaje
            line.innerHTML = `
                <span class="io-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            // Insertamos al final del terminal
            this.terminal.appendChild(line); // Inserta nodo en el DOM
            // Desplazamos el scroll del terminal automáticamente al último mensaje
            this.terminal.scrollTop = this.terminal.scrollHeight; // Asigna valor
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización general
    function startApplication() { // Declara función
        // Iniciamos navegación de diapositivas
        SlideNavigation.init(); // Ejecuta llamada o método
        // Iniciamos el laboratorio interactivo de Intersection Observer
        IOLabController.init(); // Ejecuta llamada o método
    }

    // Verificamos si el DOM ya terminó de cargarse
    if (document.readyState === 'loading') { // Evalúa condición
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
