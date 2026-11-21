/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WINDOW.MATCHMEDIA()
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO RESPONSIVE Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () { // Instrucción JavaScript
    // Activamos el modo estricto de ECMAScript para asegurar buenas prácticas y evitar variables globales no declaradas
    'use strict'; // Activa el modo estricto de JavaScript

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto centralizado que administra el estado reactivo del visor y del laboratorio interactivo
    const AppState = { // Declara e inicializa "AppState"
        // Índice de la diapositiva actualmente mostrada (del 1 al 11)
        currentSlide: 1,
        // Número total de diapositivas interactivas definidas en el documento
        totalSlides: 12,
        // Modo de visualización actual: 'slides' para presentación o 'guide' para lectura continua
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar los efectos del sintetizador de audio
        soundEnabled: true,
        // Estado booleano de visibilidad de la ventana modal con la cuadrícula de diapositivas
        overviewOpen: false,

        // Estado del laboratorio de Media Queries interactivas
        mqLab: { // Instrucción JavaScript
            // Modo de emulación activo: false para ventana real o número de píxeles emulados
            emulatedWidth: null,
            // Registro de contadores de eventos 'change' disparados por cada consulta
            counts: { // Instrucción JavaScript
                // Contador para la consulta de móviles
                mobile: 0,
                // Contador para la consulta de tabletas
                tablet: 0,
                // Contador para la consulta de computadoras de escritorio
                desktop: 0,
                // Contador para la consulta de modo oscuro del sistema
                dark: 0,
                // Contador para la consulta de orientación horizontal
                landscape: 0,
                // Contador para la consulta de puntero fino de ratón
                pointer: 0
            }
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR PROCEDURAL (Web Audio API)
       ========================================================================== */
    // Generador de audio sin dependencias externas mediante síntesis de ondas
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Variable para almacenar la instancia única de AudioContext
        ctx: null,

        // Método de inicialización segura del contexto tras la primera acción del usuario
        init() { // Instrucción JavaScript
            // Verificamos si el contexto aún no ha sido instanciado y existe compatibilidad
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                // Obtenemos la referencia a la clase constructora estándar o con prefijo
                const AudioConstructor = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioConstructor"
                // Instanciamos el contexto de audio del navegador
                this.ctx = new AudioConstructor(); // Asigna valor
            }
        },

        // Sonido armónico suave para transiciones de diapositiva
        slide() { // Instrucción JavaScript
            // Verificamos que el usuario tenga el sonido habilitado
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos el contexto si aún no existe
            this.init(); // Ejecuta llamada o método
            // Salimos de inmediato si el navegador no soporta Web Audio API
            if (!this.ctx) return; // Evalúa condición

            // Reanudamos el contexto en caso de que esté suspendido por políticas de ahorro de energía
            if (this.ctx.state === 'suspended') { // Evalúa condición
                // Reanudamos de forma asíncrona
                this.ctx.resume(); // Ejecuta llamada o método
            }

            // Creamos un oscilador para generar la onda periódica
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos un nodo de ganancia para modelar la envolvente de volumen
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"

            // Configuramos una forma de onda senoidal suave y agradable
            osc.type = 'sine'; // Asigna valor
            // Obtenemos el tiempo actual del reloj del motor de audio
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Fijamos la frecuencia inicial en 320 Hz
            osc.frequency.setValueAtTime(320, now); // Ejecuta llamada o método
            // Efectuamos una rampa exponencial ascendente hasta 480 Hz en 120 milisegundos
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12); // Ejecuta llamada o método

            // Fijamos el volumen inicial en cero absoluto
            gain.gain.setValueAtTime(0.001, now); // Ejecuta llamada o método
            // Rampa lineal rápida de ataque a volumen audible
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02); // Ejecuta llamada o método
            // Decaimiento exponencial suave hasta extinguirse en 180 milisegundos
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Ejecuta llamada o método

            // Conectamos el oscilador al nodo de ganancia
            osc.connect(gain); // Ejecuta llamada o método
            // Conectamos la ganancia a los altavoces o auriculares del dispositivo
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Iniciamos la oscilación inmediatamente
            osc.start(now); // Ejecuta llamada o método
            // Detenemos el generador al culminar los 180 milisegundos
            osc.stop(now + 0.18); // Ejecuta llamada o método
        },

        // Sonido de clic sutil para botones y controles de interfaz
        click() { // Instrucción JavaScript
            // Si el sonido está apagado, salimos
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos el contexto
            this.init(); // Ejecuta llamada o método
            // Si no hay soporte, abortamos
            if (!this.ctx) return; // Evalúa condición

            // Reanudamos el contexto si estuviera suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos el oscilador de audio
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos el nodo de volumen
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"

            // Usamos onda triangular de ataque percusivo
            osc.type = 'triangle'; // Asigna valor
            // Tiempo actual
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Frecuencia fija aguda de 600 Hz
            osc.frequency.setValueAtTime(600, now); // Ejecuta llamada o método
            // Volumen inicial
            gain.gain.setValueAtTime(0.05, now); // Ejecuta llamada o método
            // Desvanecimiento veloz en 40 milisegundos
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Ejecuta llamada o método

            // Conexión del circuito de audio
            osc.connect(gain); // Ejecuta llamada o método
            // Salida de audio
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Disparo instantáneo
            osc.start(now); // Ejecuta llamada o método
            // Parada inmediata
            osc.stop(now + 0.04); // Ejecuta llamada o método
        },

        // Tono brillante al disparar un evento reactivo de cambio de breakpoint
        matchEvent() { // Instrucción JavaScript
            // Verificamos que el sonido esté encendido
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Aseguramos contexto activo
            this.init(); // Ejecuta llamada o método
            // Salida si no hay soporte
            if (!this.ctx) return; // Evalúa condición

            // Reanudar contexto si está pausado
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos el oscilador
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos el nodo de ganancia
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"

            // Onda senoidal pura
            osc.type = 'sine'; // Asigna valor
            // Marca de tiempo
            const now = this.ctx.currentTime; // Declara e inicializa "now"

            // Frecuencia inicial en tono medio (520 Hz)
            osc.frequency.setValueAtTime(520, now); // Ejecuta llamada o método
            // Modulación en rampa hacia un tono más agudo (880 Hz)
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // Ejecuta llamada o método

            // Volumen inicial
            gain.gain.setValueAtTime(0.06, now); // Ejecuta llamada o método
            // Decaimiento natural
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); // Ejecuta llamada o método

            // Conectamos componentes
            osc.connect(gain); // Ejecuta llamada o método
            // Conexión a bocinas
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Ejecución
            osc.start(now); // Ejecuta llamada o método
            // Finalización
            osc.stop(now + 0.15); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE DIAPOSITIVAS Y NAVEGACIÓN (SlideNavigation)
       ========================================================================== */
    // Objeto encargado de orquestar la paginación, teclado, pantalla completa e indicadores
    const SlideNavigation = { // Declara e inicializa "SlideNavigation"
        // Inicializa los oyentes de eventos y construye la interfaz dinámica
        init() { // Instrucción JavaScript
            // Cacheamos referencias del DOM necesarias para la navegación
            this.wrapper = document.getElementById('presentationWrapper'); // Asigna valor
            // Colección de todas las diapositivas
            this.slides = document.querySelectorAll('.slide'); // Asigna valor
            // Barra de progreso visual
            this.progressBar = document.getElementById('progressBar'); // Asigna valor
            // Etiqueta de texto del número de diapositiva
            this.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor

            // Botón de diapositiva anterior
            this.btnPrev = document.getElementById('btnPrevSlide'); // Asigna valor
            // Botón de diapositiva siguiente
            this.btnNext = document.getElementById('btnNextSlide'); // Asigna valor
            // Contenedor de bolitas de paginación
            this.dotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            // Botón de alternar modo presentación / guía
            this.btnGoLab = document.getElementById('btnGoLab'); // Asigna valor
            this.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            // Texto del botón de modo
            this.modeText = document.getElementById('modeText'); // Asigna valor
            // Icono del botón de modo
            this.modeIcon = document.getElementById('modeIcon'); // Asigna valor

            // Botón de alternar sonido
            this.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            // Icono del botón de sonido
            this.soundIcon = document.getElementById('soundIcon'); // Asigna valor

            // Botón de cuadrícula general de diapositivas
            this.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            // Modal de cuadrícula general
            this.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            // Botón para cerrar modal
            this.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            // Rejilla contenedora de miniaturas
            this.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            // Construimos dinámicamente los puntos de navegación
            this.buildSlideDots(); // Ejecuta llamada o método
            // Construimos la cuadrícula de vista general
            this.buildOverviewGrid(); // Ejecuta llamada o método
            // Vinculamos todos los eventos de interacción del usuario
            this.bindEvents(); // Ejecuta llamada o método
            // Aplicamos el estado de la primera diapositiva
            this.updateUI(); // Ejecuta llamada o método
        },

        // Genera los círculos clicables de paginación inferior
        buildSlideDots() { // Instrucción JavaScript
            // Si no existe el contenedor de puntos en el DOM, salimos
            if (!this.dotsContainer) return; // Evalúa condición
            // Vaciamos el contenedor previo
            this.dotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            // Recorremos cada diapositiva para crear su indicador correspondiente
            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                // Número real de la diapositiva (1-based)
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                // Creamos el elemento botón del punto
                const dot = document.createElement('button'); // Crea nuevo elemento DOM "dot"
                // Asignamos la clase base del indicador
                dot.className = 'slide-dot'; // Asigna valor
                // Asignamos texto accesible para lectores de pantalla
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`); // Ejecuta llamada o método
                // Atributo de tooltip informativo
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Asigna valor

                // Si es la diapositiva activa, añadimos la clase de resaltado
                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    dot.classList.add('active'); // Modifica clases CSS del elemento
                }

                // Asignamos el evento de clic para saltar directamente a esa diapositiva
                dot.addEventListener('click', () => { // Registra escuchador de eventos
                    // Emitimos sonido de clic
                    SoundFX.click(); // Ejecuta llamada o método
                    // Navegamos a la diapositiva seleccionada
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                });

                // Añadimos el punto al contenedor del DOM
                this.dotsContainer.appendChild(dot); // Inserta nodo en el DOM
            });
        },

        // Genera las tarjetas interactivas de la cuadrícula de visión general
        buildOverviewGrid() { // Instrucción JavaScript
            // Si el contenedor de cuadrícula no existe, salimos
            if (!this.overviewGrid) return; // Evalúa condición
            // Limpiamos contenido anterior
            this.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            // Iteramos sobre las diapositivas
            this.slides.forEach((slide, index) => { // Instrucción JavaScript
                // Número ordinal de diapositiva
                const slideNum = index + 1; // Declara e inicializa "slideNum"
                // Título descriptivo de la diapositiva
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`; // Declara e inicializa "title"

                // Creamos la tarjeta de miniatura
                const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
                // Asignamos clase estilizada
                card.className = 'overview-card'; // Asigna valor
                // Identificador de datos
                card.dataset.slideIndex = slideNum; // Asigna valor

                // Si corresponde a la diapositiva actual, agregamos clase activa
                if (slideNum === AppState.currentSlide) { // Evalúa condición
                    card.classList.add('active'); // Modifica clases CSS del elemento
                }

                // Inyectamos el marcado HTML interno de la tarjeta
                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                // Agregamos evento de clic para seleccionar diapositiva y cerrar modal
                card.addEventListener('click', () => { // Registra escuchador de eventos
                    // Ejecutamos sonido de interacción
                    SoundFX.click(); // Ejecuta llamada o método
                    // Navegamos a la diapositiva seleccionada
                    this.goToSlide(slideNum); // Ejecuta llamada o método
                    // Cerramos el modal de visión general
                    this.closeOverview(); // Ejecuta llamada o método
                });

                // Incorporamos la tarjeta a la cuadrícula
                this.overviewGrid.appendChild(card); // Inserta nodo en el DOM
            });
        },

        // Vincula todos los escuchadores de eventos de la barra de herramientas y teclado
        bindEvents() { // Instrucción JavaScript
            // Botón de retroceder diapositiva
            if (this.btnPrev) { // Evalúa condición
                this.btnPrev.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                });
            }

            // Botón de avanzar diapositiva
            if (this.btnNext) { // Evalúa condición
                this.btnNext.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                });
            }

            // Botón de alternar modo presentación / guía
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

            // Botón de alternar sonido
            if (this.btnToggleSound) { // Evalúa condición
                this.btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleSound(); // Ejecuta llamada o método
                });
            }

            // Botón de apertura de cuadrícula general
            if (this.btnOverview) { // Evalúa condición
                this.btnOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                });
            }

            // Botón de cierre de modal
            if (this.btnCloseOverview) { // Evalúa condición
                this.btnCloseOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });
            }

            // Cierre del modal haciendo clic en el fondo oscuro translúcido
            if (this.overviewModal) { // Evalúa condición
                this.overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
                    if (e.target === this.overviewModal) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                });
            }

            // Botón de alternar pantalla completa
            if (this.btnFullscreen) { // Evalúa condición
                this.btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                });
            }

            // Escucha global de eventos de teclado físico
            document.addEventListener('keydown', (e) => this.handleKeyDown(e)); // Registra escuchador de eventos
        },

        // Procesa los atajos de teclado para una navegación ergonómica
        handleKeyDown(e) { // Instrucción JavaScript
            // Si el foco se encuentra en un campo de texto o elemento editable, no interceptamos
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; // Evalúa condición

            // Evaluamos la tecla presionada
            switch (e.key) { // Evalúa múltiples casos
                // Flecha derecha o letra D: Siguiente diapositiva
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Flecha izquierda o letra A: Diapositiva anterior
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Barra espaciadora: Siguiente diapositiva
                case ' ':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Tecla O: Abrir o cerrar cuadrícula de vista general
                case 'o':
                case 'O':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Tecla F: Activar o desactivar pantalla completa
                case 'f':
                case 'F':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Tecla Escape: Cerrar modal si estuviera abierto
                case 'Escape':
                    if (AppState.overviewOpen) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                    break; // Instrucción JavaScript

                // Tecla Inicio (Home): Ir a la primera diapositiva
                case 'Home':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(1); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                // Tecla Fin (End): Ir a la última diapositiva
                case 'End':
                    e.preventDefault(); // Ejecuta llamada o método
                    this.goToSlide(AppState.totalSlides); // Ejecuta llamada o método
                    break; // Instrucción JavaScript

                default:
                    break; // Instrucción JavaScript
            }
        },

        // Navega hacia una diapositiva específica por su índice numérico
        goToSlide(index) { // Instrucción JavaScript
            // Validamos que el índice se encuentre dentro de los límites legales
            if (index < 1 || index > AppState.totalSlides) return; // Evalúa condición
            // Si ya estamos en esa diapositiva, no hacemos nada
            if (index === AppState.currentSlide) return; // Evalúa condición

            // Actualizamos el estado con el nuevo índice
            AppState.currentSlide = index; // Asigna valor
            // Disparamos el efecto sonoro de deslizamiento
            SoundFX.slide(); // Ejecuta llamada o método
            // Actualizamos la presentación visual
            this.updateUI(); // Ejecuta llamada o método
        },

        // Avanza a la diapositiva siguiente
        nextSlide() { // Instrucción JavaScript
            // Verificamos si existe una diapositiva posterior
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
                // Saltamos al siguiente índice
                this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
            }
        },

        // Retrocede a la diapositiva anterior
        prevSlide() { // Instrucción JavaScript
            // Verificamos si existe una diapositiva anterior
            if (AppState.currentSlide > 1) { // Evalúa condición
                // Saltamos al índice previo
                this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
            }
        },

        // Alterna entre el modo de presentación de diapositivas y el modo guía continua
        toggleViewMode() { // Instrucción JavaScript
            // Alternamos el valor en el estado
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides'; // Asigna valor

            // Si cambiamos a modo guía continua
            if (AppState.viewMode === 'guide') { // Evalúa condición
                // Reemplazamos la clase en el cuerpo del documento
                document.body.classList.remove('mode-presentation'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-document'); // Modifica clases CSS del elemento
                // Actualizamos los textos e iconos de la barra
                if (this.modeText) this.modeText.textContent = 'Modo Diapos'; // Evalúa condición
                if (this.modeIcon) this.modeIcon.textContent = '🖥️'; // Evalúa condición
            } else { // Instrucción JavaScript
                // Reemplazamos la clase a modo presentación
                document.body.classList.remove('mode-document'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-presentation'); // Modifica clases CSS del elemento
                // Actualizamos textos e iconos
                if (this.modeText) this.modeText.textContent = 'Modo Guía'; // Evalúa condición
                if (this.modeIcon) this.modeIcon.textContent = '📑'; // Evalúa condición
            }

            // Sincronizamos la visibilidad según el modo
            this.updateUI(); // Ejecuta llamada o método
        },

        // Activa o desactiva los efectos de sonido procedurales
        toggleSound() { // Instrucción JavaScript
            // Invertimos el valor booleano en el estado
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            // Actualizamos el icono del botón
            if (this.soundIcon) { // Evalúa condición
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
            // Si fue habilitado, emitimos un clic de confirmación
            if (AppState.soundEnabled) { // Evalúa condición
                SoundFX.click(); // Ejecuta llamada o método
            }
        },

        // Alterna el modal de vista general de diapositivas
        toggleOverview() { // Instrucción JavaScript
            if (AppState.overviewOpen) { // Evalúa condición
                this.closeOverview(); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                this.openOverview(); // Ejecuta llamada o método
            }
        },

        // Abre el modal de la cuadrícula general
        openOverview() { // Instrucción JavaScript
            AppState.overviewOpen = true; // Asigna valor
            if (this.overviewModal) { // Evalúa condición
                this.overviewModal.classList.add('active'); // Modifica clases CSS del elemento
            }
            // Marcamos la tarjeta activa en la cuadrícula
            const cards = document.querySelectorAll('.overview-card'); // Obtiene referencia DOM para "cards"
            cards.forEach(card => { // Instrucción JavaScript
                const idx = parseInt(card.dataset.slideIndex, 10); // Declara e inicializa "idx"
                card.classList.toggle('active', idx === AppState.currentSlide); // Modifica clases CSS del elemento
            });
        },

        // Cierra el modal de la cuadrícula general
        closeOverview() { // Instrucción JavaScript
            AppState.overviewOpen = false; // Asigna valor
            if (this.overviewModal) { // Evalúa condición
                this.overviewModal.classList.remove('active'); // Modifica clases CSS del elemento
            }
        },

        // Alterna el modo de pantalla completa nativo del navegador
        toggleFullscreen() { // Instrucción JavaScript
            // Si actualmente no hay elemento en pantalla completa
            if (!document.fullscreenElement) { // Evalúa condición
                // Solicitamos pantalla completa para todo el documento
                document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                // Si ya está activa, salimos de ella
                if (document.exitFullscreen) { // Evalúa condición
                    document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
                }
            }
        },

        // Actualiza todos los elementos visuales de la interfaz acordes al estado actual
        updateUI() { // Instrucción JavaScript
            // Actualizamos la clase active en las diapositivas si estamos en modo presentación
            if (AppState.viewMode === 'slides') { // Evalúa condición
                this.slides.forEach((slide, index) => { // Instrucción JavaScript
                    const slideNum = index + 1; // Declara e inicializa "slideNum"
                    if (slideNum === AppState.currentSlide) { // Evalúa condición
                        slide.classList.add('active'); // Modifica clases CSS del elemento
                        // Desplazamos la ventana suavemente hacia el inicio superior
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        slide.classList.remove('active'); // Modifica clases CSS del elemento
                    }
                });
            } else { // Instrucción JavaScript
                // En modo documento todas las secciones son visibles
                this.slides.forEach(slide => slide.classList.add('active')); // Modifica clases CSS del elemento
            }

            // Calculamos el porcentaje de avance de la presentación
            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100; // Declara e inicializa "percent"
            // Actualizamos el ancho de la barra de progreso
            if (this.progressBar) { // Evalúa condición
                this.progressBar.style.width = `${percent}%`; // Asigna valor
            }

            // Actualizamos la etiqueta de texto (ej. "3 / 11")
            if (this.slideIndicator) { // Evalúa condición
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }

            // Actualizamos los puntos indicadores inferiores
            const dots = document.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, index) => { // Instrucción JavaScript
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide); // Modifica clases CSS del elemento
            });

            // Ajustamos el estado visual de los botones de navegación anterior/siguiente
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE MATCHMEDIA (MQLabController)
       ========================================================================== */
    // Gestiona los monitores en tiempo real, eventos 'change', tarjetas y simulador de anchos
    const MQLabController = { // Declara e inicializa "MQLabController"
        // Inicializa el laboratorio y registra las Media Queries nativas del navegador
        init() { // Instrucción JavaScript
            // Referencias del panel del medidor de resolución
            this.resWidth = document.getElementById('mqResWidth'); // Asigna valor
            this.resHeight = document.getElementById('mqResHeight'); // Asigna valor
            this.deviceLabel = document.getElementById('mqDeviceLabel'); // Asigna valor
            this.barFill = document.getElementById('mqViewportBarFill'); // Asigna valor

            // Terminal de registro de eventos
            this.terminal = document.getElementById('mqLogTerminal'); // Asigna valor

            // Botones de controles de simulación
            this.btnSimMobile = document.getElementById('btnSimMobile'); // Asigna valor
            this.btnSimTablet = document.getElementById('btnSimTablet'); // Asigna valor
            this.btnSimDesktop = document.getElementById('btnSimDesktop'); // Asigna valor
            this.btnSimReal = document.getElementById('btnSimReal'); // Asigna valor
            this.btnClearLogs = document.getElementById('btnClearMqLogs'); // Asigna valor

            // Definimos la configuración de las 6 Media Queries que serán monitoreadas
            this.queries = [
                { // Instrucción JavaScript
                    key: 'mobile',
                    cardId: 'cardMqMobile',
                    badgeId: 'badgeMqMobile',
                    countId: 'countMqMobile',
                    rule: '(max-width: 599px)',
                    name: 'Móvil Estrecho',
                    mql: window.matchMedia('(max-width: 599px)')
                },
                { // Instrucción JavaScript
                    key: 'tablet',
                    cardId: 'cardMqTablet',
                    badgeId: 'badgeMqTablet',
                    countId: 'countMqTablet',
                    rule: '(min-width: 600px) and (max-width: 1023px)',
                    name: 'Tablet / Portátil',
                    mql: window.matchMedia('(min-width: 600px) and (max-width: 1023px)')
                },
                { // Instrucción JavaScript
                    key: 'desktop',
                    cardId: 'cardMqDesktop',
                    badgeId: 'badgeMqDesktop',
                    countId: 'countMqDesktop',
                    rule: '(min-width: 1024px)',
                    name: 'Escritorio Amplio',
                    mql: window.matchMedia('(min-width: 1024px)')
                },
                { // Instrucción JavaScript
                    key: 'dark',
                    cardId: 'cardMqDark',
                    badgeId: 'badgeMqDark',
                    countId: 'countMqDark',
                    rule: '(prefers-color-scheme: dark)',
                    name: 'Tema Oscuro del Sistema',
                    mql: window.matchMedia('(prefers-color-scheme: dark)')
                },
                { // Instrucción JavaScript
                    key: 'landscape',
                    cardId: 'cardMqLandscape',
                    badgeId: 'badgeMqLandscape',
                    countId: 'countMqLandscape',
                    rule: '(orientation: landscape)',
                    name: 'Orientación Horizontal',
                    mql: window.matchMedia('(orientation: landscape)')
                },
                { // Instrucción JavaScript
                    key: 'pointer',
                    cardId: 'cardMqPointer',
                    badgeId: 'badgeMqPointer',
                    countId: 'countMqPointer',
                    rule: '(pointer: fine)',
                    name: 'Ratón Preciso (Fine Pointer)',
                    mql: window.matchMedia('(pointer: fine)')
                }
            ];

            // Suscribimos cada Media Query y realizamos su evaluación inicial obligatoria
            this.setupMediaQueries(); // Ejecuta llamada o método
            // Vinculamos la actualización continua del visor del viewport
            this.bindViewportMeter(); // Ejecuta llamada o método
            // Vinculamos los botones de emulación y limpieza
            this.bindControls(); // Ejecuta llamada o método
            // Log de bienvenida inicial en el terminal del laboratorio
            this.log('Sistema de monitoreo reactivo listo. Redimensiona tu ventana para ver eventos en vivo.'); // Ejecuta llamada o método
        },

        // Configura los oyentes y ejecuta la evaluación inicial para cada consulta
        setupMediaQueries() { // Instrucción JavaScript
            // Iteramos sobre las consultas definidas
            this.queries.forEach(item => { // Instrucción JavaScript
                // Evaluamos el estado inicial de inmediato usando .matches
                this.updateCardUI(item, item.mql.matches, false); // Ejecuta llamada o método

                // Registramos el manejador oficial de eventos mediante addEventListener("change")
                item.mql.addEventListener('change', (e) => { // Registra escuchador de eventos
                    // Incrementamos el contador de disparos para esta regla
                    AppState.mqLab.counts[item.key]++; // Instrucción JavaScript
                    // Actualizamos la tarjeta con el nuevo estado booleano
                    this.updateCardUI(item, e.matches, true); // Ejecuta llamada o método
                    // Disparamos sonido armónico de detección de cambio
                    SoundFX.matchEvent(); // Ejecuta llamada o método
                    // Registramos la notificación en el terminal interactivo
                    const statusText = e.matches ? 'CUMPLE (matches: true)' : 'DEJÓ DE CUMPLIR (matches: false)'; // Declara e inicializa "statusText"
                    this.log(`⚡ [Evento 'change'] ${item.name}: ${statusText}`); // Ejecuta llamada o método
                });
            });
        },

        // Actualiza el aspecto de una tarjeta de consulta según su estado booleano
        updateCardUI(item, matches, isEvent) { // Instrucción JavaScript
            // Buscamos los elementos del DOM de la tarjeta
            const cardEl = document.getElementById(item.cardId); // Obtiene referencia DOM para "cardEl"
            const badgeEl = document.getElementById(item.badgeId); // Obtiene referencia DOM para "badgeEl"
            const countEl = document.getElementById(item.countId); // Obtiene referencia DOM para "countEl"

            // Si los elementos existen en el DOM
            if (cardEl && badgeEl) { // Evalúa condición
                // Si la consulta coincide actualmente
                if (matches) { // Evalúa condición
                    cardEl.classList.add('active'); // Modifica clases CSS del elemento
                    badgeEl.className = 'mq-badge-match is-true'; // Asigna valor
                    badgeEl.textContent = 'matches: true'; // Actualiza contenido en el DOM
                } else { // Instrucción JavaScript
                    cardEl.classList.remove('active'); // Modifica clases CSS del elemento
                    badgeEl.className = 'mq-badge-match is-false'; // Asigna valor
                    badgeEl.textContent = 'matches: false'; // Actualiza contenido en el DOM
                }
            }

            // Actualizamos el contador de eventos si corresponde
            if (countEl) { // Evalúa condición
                const count = AppState.mqLab.counts[item.key] || 0; // Declara e inicializa "count"
                countEl.textContent = `${count} ${count === 1 ? 'evento' : 'eventos'}`; // Actualiza contenido en el DOM
            }
        },

        // Mantiene actualizado el indicador numérico de dimensiones y la barra de ancho
        bindViewportMeter() { // Instrucción JavaScript
            // Función interna para refrescar métricas
            const refreshMeter = () => { // Define función flecha "refreshMeter"
                // Leemos las dimensiones reales del viewport
                const width = AppState.mqLab.emulatedWidth || window.innerWidth; // Declara e inicializa "width"
                const height = window.innerHeight; // Declara e inicializa "height"

                // Actualizamos los textos de ancho y alto
                if (this.resWidth) this.resWidth.textContent = width; // Evalúa condición
                if (this.resHeight) this.resHeight.textContent = height; // Evalúa condición

                // Calculamos el porcentaje visual para la barra de 0 a 1600px
                const barPercent = Math.min(Math.max((width / 1600) * 100, 10), 100); // Declara e inicializa "barPercent"
                if (this.barFill) { // Evalúa condición
                    this.barFill.style.width = `${barPercent}%`; // Asigna valor
                }

                // Determinamos la etiqueta de categoría de dispositivo
                if (this.deviceLabel) { // Evalúa condición
                    if (width < 600) { // Evalúa condición
                        this.deviceLabel.textContent = '📱 Móvil'; // Actualiza contenido en el DOM
                        this.deviceLabel.className = 'badge badge-purple'; // Asigna valor
                    } else if (width < 1024) { // Instrucción JavaScript
                        this.deviceLabel.textContent = '💻 Tablet'; // Actualiza contenido en el DOM
                        this.deviceLabel.className = 'badge badge-cyan'; // Asigna valor
                    } else { // Instrucción JavaScript
                        this.deviceLabel.textContent = '🖥️ Escritorio'; // Actualiza contenido en el DOM
                        this.deviceLabel.className = 'badge badge-emerald'; // Asigna valor
                    }
                }
            };

            // Ejecutamos inmediatamente
            refreshMeter(); // Ejecuta llamada o método
            // Escuchamos redimensionamiento para actualizar únicamente el medidor visual
            window.addEventListener('resize', refreshMeter); // Registra escuchador de eventos
        },

        // Vincula los botones de control interactivo del laboratorio
        bindControls() { // Instrucción JavaScript
            // Botón para simular resolución móvil de 375px
            if (this.btnSimMobile) { // Evalúa condición
                this.btnSimMobile.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.simulateWidth(375, 'Móvil (375px)'); // Ejecuta llamada o método
                });
            }

            // Botón para simular resolución tablet de 768px
            if (this.btnSimTablet) { // Evalúa condición
                this.btnSimTablet.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.simulateWidth(768, 'Tablet (768px)'); // Ejecuta llamada o método
                });
            }

            // Botón para simular resolución de escritorio de 1200px
            if (this.btnSimDesktop) { // Evalúa condición
                this.btnSimDesktop.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    this.simulateWidth(1200, 'Escritorio (1200px)'); // Ejecuta llamada o método
                });
            }

            // Botón para restablecer la medición real del viewport físico
            if (this.btnSimReal) { // Evalúa condición
                this.btnSimReal.addEventListener('click', () => { // Registra escuchador de eventos
                    SoundFX.click(); // Ejecuta llamada o método
                    AppState.mqLab.emulatedWidth = null; // Asigna valor
                    // Reevaluamos tarjetas con las instancias reales
                    this.queries.forEach(item => { // Instrucción JavaScript
                        this.updateCardUI(item, item.mql.matches, false); // Ejecuta llamada o método
                    });
                    this.log('🔄 Modo de medición restablecido al ancho real del navegador.'); // Ejecuta llamada o método
                    // Disparamos actualización del medidor
                    window.dispatchEvent(new Event('resize')); // Ejecuta llamada o método
                });
            }

            // Botón para limpiar los mensajes del terminal
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

        // Simula visualmente el comportamiento de las tarjetas ante un ancho específico
        simulateWidth(targetWidth, labelName) { // Instrucción JavaScript
            // Guardamos el ancho simulado en el estado
            AppState.mqLab.emulatedWidth = targetWidth; // Asigna valor

            // Evaluamos lógicamente cada regla según el ancho simulado
            this.queries.forEach(item => { // Instrucción JavaScript
                let simulatedMatch = false; // Declara e inicializa "simulatedMatch"

                if (item.key === 'mobile') { // Evalúa condición
                    simulatedMatch = targetWidth <= 599; // Asigna valor
                } else if (item.key === 'tablet') { // Instrucción JavaScript
                    simulatedMatch = targetWidth >= 600 && targetWidth <= 1023; // Asigna valor
                } else if (item.key === 'desktop') { // Instrucción JavaScript
                    simulatedMatch = targetWidth >= 1024; // Asigna valor
                } else { // Instrucción JavaScript
                    // Para preferencias de hardware o sistema mantenemos la lectura nativa
                    simulatedMatch = item.mql.matches; // Asigna valor
                }

                // Incrementamos contador
                AppState.mqLab.counts[item.key]++; // Instrucción JavaScript
                // Actualizamos tarjeta
                this.updateCardUI(item, simulatedMatch, true); // Ejecuta llamada o método
            });

            // Emitimos sonido de evento
            SoundFX.matchEvent(); // Ejecuta llamada o método
            // Registramos en el terminal
            this.log(`🎯 [Simulador] Ancho fijado a ${labelName}. Evaluadas consultas dinámicas.`); // Ejecuta llamada o método
            // Disparamos evento de resize para actualizar la barra y la etiqueta
            window.dispatchEvent(new Event('resize')); // Ejecuta llamada o método
        },

        // Registra una línea con marca de tiempo en el terminal visual del laboratorio
        log(message) { // Instrucción JavaScript
            // Si el terminal no existe en el DOM, salimos
            if (!this.terminal) return; // Evalúa condición

            // Obtenemos la hora, minutos y segundos actuales con formato de dos dígitos
            const now = new Date(); // Declara e inicializa "now"
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':'); // Ejecuta llamada o método

            // Creamos el contenedor de la línea
            const line = document.createElement('div'); // Crea nuevo elemento DOM "line"
            line.className = 'mq-log-line'; // Asigna valor

            // Marcado con marca de tiempo atenuada y texto del evento
            line.innerHTML = `
                <span class="mq-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            // Incorporamos la línea al terminal
            this.terminal.appendChild(line); // Inserta nodo en el DOM
            // Hacemos scroll automático hacia el final del terminal
            this.terminal.scrollTop = this.terminal.scrollHeight; // Asigna valor
        }
    };

    /* ==========================================================================
       5. ARRANQUE AUTOMÁTICO DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización invocada cuando el documento HTML está completamente parseado
    function startApplication() { // Declara función
        // Inicializamos el controlador de navegación de diapositivas
        SlideNavigation.init(); // Ejecuta llamada o método
        // Inicializamos el controlador del laboratorio interactivo de matchMedia
        MQLabController.init(); // Ejecuta llamada o método
    }

    // Comprobamos si el DOM ya ha sido cargado o esperamos el evento DOMContentLoaded
    if (document.readyState === 'loading') { // Evalúa condición
        // Esperamos a que finalice el parseo del DOM
        document.addEventListener('DOMContentLoaded', startApplication); // Registra escuchador de eventos
    } else { // Instrucción JavaScript
        // Si ya está listo, arrancamos inmediatamente
        startApplication(); // Ejecuta llamada o método
    }
})(); // Ejecuta llamada o método
