/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: INDEXEDDB (BASE DE DATOS NOSQL)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO INTERACTIVO Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () { // Instrucción JavaScript
    // Activamos el modo estricto de ECMAScript para código riguroso y sin variables implícitas
    'use strict'; // Activa el modo estricto de JavaScript

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto central que almacena el estado reactivo del visor y los simuladores
    const AppState = { // Declara e inicializa "AppState"
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 12,
        // Modo de visualización activo: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Estado del sintetizador de audio para efectos sonoros
        soundEnabled: true,
        // Estado del modal de vista general de diapositivas
        overviewOpen: false,

        // Estado del laboratorio interactivo de IndexedDB
        idbLab: { // Instrucción JavaScript
            // Nombre de la base de datos del laboratorio interactivo
            dbName: 'LaboratorioMasterDB',
            // Versión activa de la base de datos
            version: 1,
            // Nombre del almacén de objetos principal
            storeName: 'usuarios',
            // Referencia a la instancia de IDBDatabase abierta
            dbInstance: null,
            // Registros en memoria para refresco visual en tiempo real
            registros: []
        }
    };

    /* ==========================================================================
       2. MÓDULO DE AUDIO: SINTETIZADOR WEB AUDIO API
       ========================================================================== */
    // Generador de efectos de sonido procedurales sin dependencias de archivos externos
    const SoundFX = { // Declara e inicializa "SoundFX"
        // Contexto de audio Web Audio API
        ctx: null,

        // Método para inicializar el contexto de audio con la primera interacción del usuario
        init() { // Instrucción JavaScript
            // Si el contexto aún no existe y el navegador soporta AudioContext
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
                // Creamos una nueva instancia del contexto de audio
                const AudioCtx = window.AudioContext || window.webkitAudioContext; // Declara e inicializa "AudioCtx"
                // Instanciamos el contexto
                this.ctx = new AudioCtx(); // Asigna valor
            }
        },

        // Sonido suave de transición al cambiar de diapositiva
        slide() { // Instrucción JavaScript
            // Si el sonido está desactivado o no hay soporte, salimos
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos contexto si es necesario
            this.init(); // Ejecuta llamada o método
            // Validamos que el contexto exista
            if (!this.ctx) return; // Evalúa condición

            // Reanudamos contexto si el navegador lo suspendió por políticas de autoplay
            if (this.ctx.state === 'suspended') { // Evalúa condición
                this.ctx.resume(); // Ejecuta llamada o método
            }

            // Creamos un oscilador de audio
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos un nodo de ganancia para controlar el volumen
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"

            // Configuramos onda senoidal suave
            osc.type = 'sine'; // Asigna valor
            // Frecuencia inicial en 420 Hz
            osc.frequency.setValueAtTime(420, this.ctx.currentTime); // Ejecuta llamada o método
            // Glissando descendente hasta 280 Hz en 0.12 segundos
            osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12); // Ejecuta llamada o método

            // Volumen inicial suave al 6%
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Ejecuta llamada o método
            // Desvanecimiento a silencio en 0.12 segundos
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12); // Ejecuta llamada o método

            // Conectamos el oscilador al nodo de ganancia
            osc.connect(gain); // Ejecuta llamada o método
            // Conectamos la ganancia a los altavoces
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Iniciamos el sonido en el tiempo actual
            osc.start(); // Ejecuta llamada o método
            // Detenemos el oscilador tras 0.13 segundos
            osc.stop(this.ctx.currentTime + 0.13); // Ejecuta llamada o método
        },

        // Sonido de éxito en operaciones de base de datos
        success() { // Instrucción JavaScript
            // Verificamos si los efectos están habilitados
            if (!AppState.soundEnabled) return; // Evalúa condición
            // Inicializamos
            this.init(); // Ejecuta llamada o método
            // Salimos si no hay contexto
            if (!this.ctx) return; // Evalúa condición

            // Reanudamos contexto si está suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume(); // Evalúa condición

            // Creamos oscilador
            const osc = this.ctx.createOscillator(); // Declara e inicializa "osc"
            // Creamos ganancia
            const gain = this.ctx.createGain(); // Declara e inicializa "gain"

            // Onda triangular con cuerpo
            osc.type = 'triangle'; // Asigna valor
            // Frecuencia en tono armónico de 523.25 Hz (Do5)
            osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // Ejecuta llamada o método
            // Ascenso armónico a 659.25 Hz (Mi5)
            osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.16); // Ejecuta llamada o método

            // Volumen al 7%
            gain.gain.setValueAtTime(0.07, this.ctx.currentTime); // Ejecuta llamada o método
            // Desvanecimiento
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16); // Ejecuta llamada o método

            // Conectamos
            osc.connect(gain); // Ejecuta llamada o método
            // Salida a altavoces
            gain.connect(this.ctx.destination); // Ejecuta llamada o método

            // Iniciamos
            osc.start(); // Ejecuta llamada o método
            // Detenemos
            osc.stop(this.ctx.currentTime + 0.17); // Ejecuta llamada o método
        }
    };

    /* ==========================================================================
       3. NAVEGACIÓN Y CONTROLADOR DE DIAPOSITIVAS
       ========================================================================== */
    // Controlador de navegación y modo de vista
    const Navigation = { // Declara e inicializa "Navigation"
        // Elementos del DOM cacheados para optimizar rendimiento
        elements: {},

        // Inicialización de selectores del DOM y eventos
        init() { // Instrucción JavaScript
            // Contenedor principal de la presentación
            this.elements.wrapper = document.getElementById('presentationWrapper'); // Asigna valor
            // Colección de todas las secciones de diapositivas
            this.elements.slides = document.querySelectorAll('.slide'); // Asigna valor
            // Barra de progreso de lectura
            this.elements.progressBar = document.getElementById('progressBar'); // Asigna valor
            // Indicador numérico de diapositiva actual
            this.elements.slideIndicator = document.getElementById('slideIndicator'); // Asigna valor

            // Botones de la barra de herramientas superior
            this.elements.btnToggleMode = document.getElementById('btnToggleMode'); // Asigna valor
            this.elements.modeIcon = document.getElementById('modeIcon'); // Asigna valor
            this.elements.modeText = document.getElementById('modeText'); // Asigna valor
            this.elements.btnToggleSound = document.getElementById('btnToggleSound'); // Asigna valor
            this.elements.soundIcon = document.getElementById('soundIcon'); // Asigna valor
            this.elements.btnOverview = document.getElementById('btnOverview'); // Asigna valor
            this.elements.btnFullscreen = document.getElementById('btnFullscreen'); // Asigna valor

            // Botones inferiores flotantes de navegación
            this.elements.btnPrevSlide = document.getElementById('btnPrevSlide'); // Asigna valor
            this.elements.btnNextSlide = document.getElementById('btnNextSlide'); // Asigna valor
            this.elements.slideDotsContainer = document.getElementById('slideDotsContainer'); // Asigna valor

            // Modal de vista general
            this.elements.overviewModal = document.getElementById('overviewModal'); // Asigna valor
            this.elements.btnCloseOverview = document.getElementById('btnCloseOverview'); // Asigna valor
            this.elements.overviewGrid = document.getElementById('overviewGrid'); // Asigna valor

            // Botón inicial de la portada
            this.elements.btnStart = document.getElementById('btnStartPresentation'); // Asigna valor

            // Construimos los puntos indicadores inferiores
            this.buildSlideDots(); // Ejecuta llamada o método
            // Construimos la cuadrícula del modal de visión general
            this.buildOverviewGrid(); // Ejecuta llamada o método
            // Registramos los escuchadores de eventos
            this.bindEvents(); // Ejecuta llamada o método
            // Renderizamos la diapositiva inicial
            this.renderSlide(AppState.currentSlide, false); // Ejecuta llamada o método
        },

        // Construye las bolitas interactivas para cada diapositiva
        buildSlideDots() { // Instrucción JavaScript
            if (!this.elements.slideDotsContainer) return; // Evalúa condición
            this.elements.slideDotsContainer.innerHTML = ''; // Actualiza contenido en el DOM

            for (let i = 1; i <= AppState.totalSlides; i++) { // Inicia bucle de iteración
                const dot = document.createElement('div'); // Crea nuevo elemento DOM "dot"
                dot.className = 'slide-dot'; // Asigna valor
                if (i === AppState.currentSlide) dot.classList.add('active'); // Evalúa condición
                dot.setAttribute('title', `Ir a Diapositiva ${i}`); // Ejecuta llamada o método
                dot.addEventListener('click', () => { // Registra escuchador de eventos
                    this.goToSlide(i); // Ejecuta llamada o método
                });
                this.elements.slideDotsContainer.appendChild(dot); // Inserta nodo en el DOM
            }
        },

        // Actualiza el punto activo en la barra inferior
        updateSlideDots(activeIdx) { // Instrucción JavaScript
            if (!this.elements.slideDotsContainer) return; // Evalúa condición
            const dots = this.elements.slideDotsContainer.querySelectorAll('.slide-dot'); // Obtiene referencia DOM para "dots"
            dots.forEach((dot, idx) => { // Instrucción JavaScript
                if (idx + 1 === activeIdx) { // Evalúa condición
                    dot.classList.add('active'); // Modifica clases CSS del elemento
                } else { // Instrucción JavaScript
                    dot.classList.remove('active'); // Modifica clases CSS del elemento
                }
            });
        },

        // Construye las tarjetas en miniatura del modal de vista general
        buildOverviewGrid() { // Instrucción JavaScript
            if (!this.elements.overviewGrid) return; // Evalúa condición
            this.elements.overviewGrid.innerHTML = ''; // Actualiza contenido en el DOM

            this.elements.slides.forEach((slide, idx) => { // Instrucción JavaScript
                const num = idx + 1; // Declara e inicializa "num"
                const title = slide.getAttribute('data-title') || `Diapositiva ${num}`; // Declara e inicializa "title"

                const card = document.createElement('div'); // Crea nuevo elemento DOM "card"
                card.className = 'overview-card'; // Asigna valor
                card.innerHTML = `
                    <div class="overview-card-header">
                        <span class="overview-card-num">#${num}</span>
                    </div>
                    <div class="overview-card-title">${title}</div>
                `;

                card.addEventListener('click', () => { // Registra escuchador de eventos
                    this.goToSlide(num); // Ejecuta llamada o método
                    this.closeOverview(); // Ejecuta llamada o método
                });

                this.elements.overviewGrid.appendChild(card); // Inserta nodo en el DOM
            });
        },

        // Vinculación de eventos de interfaz y teclado
        bindEvents() { // Instrucción JavaScript
            // Teclado para navegación con flechas, espacio y teclas de acceso rápido
            document.addEventListener('keydown', (e) => { // Registra escuchador de eventos
                // Si el foco está en un campo de texto interactivo, no interceptamos teclas
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { // Evalúa condición
                    return; // Retorna resultado
                }

                // Flecha derecha o barra espaciadora para avanzar
                if (e.key === 'ArrowRight' || e.key === ' ') { // Evalúa condición
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                // Flecha izquierda para retroceder
                } else if (e.key === 'ArrowLeft') { // Instrucción JavaScript
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                // Tecla 'O' para alternar la cuadrícula general de diapositivas
                } else if (e.key === 'o' || e.key === 'O') { // Instrucción JavaScript
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleOverview(); // Ejecuta llamada o método
                // Tecla 'Escape' para cerrar modal si está abierto
                } else if (e.key === 'Escape') { // Instrucción JavaScript
                    if (AppState.overviewOpen) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                // Tecla 'F' para pantalla completa
                } else if (e.key === 'f' || e.key === 'F') { // Instrucción JavaScript
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                // Tecla 'M' para alternar sonido
                } else if (e.key === 'm' || e.key === 'M') { // Instrucción JavaScript
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleSound(); // Ejecuta llamada o método
                }
            });

            // Botón iniciar presentación en la portada
            if (this.elements.btnStart) { // Evalúa condición
                this.elements.btnStart.addEventListener('click', () => { // Registra escuchador de eventos
                    this.goToSlide(2); // Ejecuta llamada o método
                });
            }

            // Botón anterior en la barra inferior
            if (this.elements.btnPrevSlide) { // Evalúa condición
                this.elements.btnPrevSlide.addEventListener('click', () => { // Registra escuchador de eventos
                    this.prevSlide(); // Ejecuta llamada o método
                });
            }

            // Botón siguiente en la barra inferior
            if (this.elements.btnNextSlide) { // Evalúa condición
                this.elements.btnNextSlide.addEventListener('click', () => { // Registra escuchador de eventos
                    this.nextSlide(); // Ejecuta llamada o método
                });
            }

            // Botón abrir visión general
            if (this.elements.btnOverview) { // Evalúa condición
                this.elements.btnOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleOverview(); // Ejecuta llamada o método
                });
            }

            // Botón cerrar visión general
            if (this.elements.btnCloseOverview) { // Evalúa condición
                this.elements.btnCloseOverview.addEventListener('click', () => { // Registra escuchador de eventos
                    this.closeOverview(); // Ejecuta llamada o método
                });
            }

            // Cerrar modal al hacer clic en el fondo oscuro
            if (this.elements.overviewModal) { // Evalúa condición
                this.elements.overviewModal.addEventListener('click', (e) => { // Registra escuchador de eventos
                    if (e.target === this.elements.overviewModal) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    }
                });
            }

            // Botones interactivos con atributo data-jump para saltos directos
            document.querySelectorAll('[data-jump]').forEach(btn => { // Instrucción JavaScript
                btn.addEventListener('click', (e) => { // Registra escuchador de eventos
                    e.preventDefault(); // Ejecuta llamada o método
                    const targetIndex = parseInt(btn.getAttribute('data-jump'), 10); // Declara e inicializa "targetIndex"
                    if (!isNaN(targetIndex)) { // Evalúa condición
                        this.goToSlide(targetIndex); // Ejecuta llamada o método
                    }
                });
            });

            // Botón para alternar entre modo diapositivas y modo guía continua
            if (this.elements.btnToggleMode) { // Evalúa condición
                this.elements.btnToggleMode.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleViewMode(); // Ejecuta llamada o método
                });
            }

            // Botón para activar o silenciar audio
            if (this.elements.btnToggleSound) { // Evalúa condición
                this.elements.btnToggleSound.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleSound(); // Ejecuta llamada o método
                });
            }

            // Botón para pantalla completa
            if (this.elements.btnFullscreen) { // Evalúa condición
                this.elements.btnFullscreen.addEventListener('click', () => { // Registra escuchador de eventos
                    this.toggleFullscreen(); // Ejecuta llamada o método
                });
            }
        },

        // Cambiar a una diapositiva específica
        goToSlide(index, playSound = true) { // Instrucción JavaScript
            // Validamos que el índice esté dentro del rango permitido
            if (index < 1) index = 1; // Evalúa condición
            if (index > AppState.totalSlides) index = AppState.totalSlides; // Evalúa condición

            // Si es la misma diapositiva, no hacemos nada
            if (AppState.currentSlide === index && AppState.viewMode === 'slides') return; // Evalúa condición

            // Actualizamos el estado
            AppState.currentSlide = index; // Asigna valor
            // Renderizamos la diapositiva en pantalla
            this.renderSlide(index, playSound); // Ejecuta llamada o método
        },

        // Avanzar a la siguiente diapositiva
        nextSlide() { // Instrucción JavaScript
            if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
                this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
            }
        },

        // Retroceder a la diapositiva anterior
        prevSlide() { // Instrucción JavaScript
            if (AppState.currentSlide > 1) { // Evalúa condición
                this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
            }
        },

        // Renderizado visual de la diapositiva activa
        renderSlide(index, playSound = true) { // Instrucción JavaScript
            // Reproducimos efecto de sonido si corresponde
            if (playSound) SoundFX.slide(); // Evalúa condición

            // Si estamos en modo presentación
            if (AppState.viewMode === 'slides') { // Evalúa condición
                // Recorremos todas las diapositivas
                this.elements.slides.forEach((slide, i) => { // Instrucción JavaScript
                    // Calculamos el índice base 1
                    const slideIndex = i + 1; // Declara e inicializa "slideIndex"
                    // Removemos clases activas previas
                    slide.classList.remove('active', 'prev', 'next'); // Modifica clases CSS del elemento

                    // Asignamos clase 'active' a la diapositiva actual
                    if (slideIndex === index) { // Evalúa condición
                        slide.classList.add('active'); // Modifica clases CSS del elemento
                        // Aseguramos scroll superior
                        slide.scrollTop = 0; // Asigna valor
                    // Diapositivas anteriores
                    } else if (slideIndex < index) { // Instrucción JavaScript
                        slide.classList.add('prev'); // Modifica clases CSS del elemento
                    // Diapositivas siguientes
                    } else { // Instrucción JavaScript
                        slide.classList.add('next'); // Modifica clases CSS del elemento
                    }
                });
            }

            // Actualizamos los puntos inferiores
            this.updateSlideDots(index); // Ejecuta llamada o método

            // Actualizamos la barra de progreso
            if (this.elements.progressBar) { // Evalúa condición
                const percent = ((index - 1) / (AppState.totalSlides - 1)) * 100; // Declara e inicializa "percent"
                this.elements.progressBar.style.width = `${percent}%`; // Asigna valor
            }

            // Actualizamos el indicador de texto
            if (this.elements.slideIndicator) { // Evalúa condición
                this.elements.slideIndicator.textContent = `${index} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
            }
        },

        // Abrir/cerrar modal de índice rápido
        toggleOverview() { // Instrucción JavaScript
            if (AppState.overviewOpen) { // Evalúa condición
                this.closeOverview(); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                this.openOverview(); // Ejecuta llamada o método
            }
        },

        openOverview() { // Instrucción JavaScript
            AppState.overviewOpen = true; // Asigna valor
            if (this.elements.overviewModal) { // Evalúa condición
                this.elements.overviewModal.classList.add('active'); // Modifica clases CSS del elemento
            }
        },

        closeOverview() { // Instrucción JavaScript
            AppState.overviewOpen = false; // Asigna valor
            if (this.elements.overviewModal) { // Evalúa condición
                this.elements.overviewModal.classList.remove('active'); // Modifica clases CSS del elemento
            }
        },

        // Alternar entre modo diapositivas y modo guía continua
        toggleViewMode() { // Instrucción JavaScript
            if (AppState.viewMode === 'slides') { // Evalúa condición
                AppState.viewMode = 'guide'; // Asigna valor
                document.body.classList.remove('mode-presentation'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-document'); // Modifica clases CSS del elemento
                if (this.elements.modeIcon) this.elements.modeIcon.textContent = '📑'; // Evalúa condición
                if (this.elements.modeText) this.elements.modeText.textContent = 'Modo Diapos'; // Evalúa condición
            } else { // Instrucción JavaScript
                AppState.viewMode = 'slides'; // Asigna valor
                document.body.classList.remove('mode-document'); // Modifica clases CSS del elemento
                document.body.classList.add('mode-presentation'); // Modifica clases CSS del elemento
                if (this.elements.modeIcon) this.elements.modeIcon.textContent = '🖥️'; // Evalúa condición
                if (this.elements.modeText) this.elements.modeText.textContent = 'Modo Guía'; // Evalúa condición
                this.renderSlide(AppState.currentSlide, false); // Ejecuta llamada o método
            }
        },

        // Alternar silencio o sonido
        toggleSound() { // Instrucción JavaScript
            AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
            if (this.elements.soundIcon) { // Evalúa condición
                this.elements.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇'; // Actualiza contenido en el DOM
            }
        },

        // Alternar pantalla completa
        toggleFullscreen() { // Instrucción JavaScript
            if (!document.fullscreenElement) { // Evalúa condición
                document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                if (document.exitFullscreen) { // Evalúa condición
                    document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
                }
            }
        }
    };

    /* ==========================================================================
       4. LABORATORIO INTERACTIVO DE INDEXEDDB (CRUD EN VIVO)
       ========================================================================== */
    // Motor que conecta con la API nativa de IndexedDB para el laboratorio de la Diapositiva 10
    const IDBLabController = { // Declara e inicializa "IDBLabController"
        // Inicialización del laboratorio
        init() { // Instrucción JavaScript
            // Conectamos y abrimos la base de datos del laboratorio
            this.abrirBaseDeDatos(); // Ejecuta llamada o método
            // Vinculamos botones de la interfaz
            this.bindControls(); // Ejecuta llamada o método
        },

        // Abre la base de datos nativa con almacén 'usuarios'
        abrirBaseDeDatos() { // Instrucción JavaScript
            // Validamos que el navegador soporte IndexedDB
            if (!('indexedDB' in window)) { // Evalúa condición
                this.log('❌ IndexedDB no es compatible con este navegador.'); // Ejecuta llamada o método
                return; // Retorna resultado
            }

            // Solicitud de apertura
            const request = window.indexedDB.open(AppState.idbLab.dbName, AppState.idbLab.version); // Declara e inicializa "request"

            // Evento upgradeneeded para crear almacén
            request.addEventListener('upgradeneeded', (e) => { // Registra escuchador de eventos
                const db = e.target.result; // Declara e inicializa "db"
                this.log("🛠️ Evento 'upgradeneeded': Inicializando Object Store 'usuarios'..."); // Ejecuta llamada o método

                if (!db.objectStoreNames.contains(AppState.idbLab.storeName)) { // Evalúa condición
                    // Creamos con clave autoincremental
                    db.createObjectStore(AppState.idbLab.storeName, { autoIncrement: true }); // Ejecuta llamada o método
                    this.log("  ↳ Object Store 'usuarios' creado con { autoIncrement: true }."); // Ejecuta llamada o método
                }
            });

            // Evento success
            request.addEventListener('success', (e) => { // Registra escuchador de eventos
                AppState.idbLab.dbInstance = e.target.result; // Asigna valor
                this.log(`✅ Base de datos '${AppState.idbLab.dbName}' abierta con éxito.`); // Ejecuta llamada o método
                // Cargamos registros iniciales si está vacía
                this.inicializarRegistrosSiVacia(); // Ejecuta llamada o método
            });

            // Evento error
            request.addEventListener('error', (e) => { // Registra escuchador de eventos
                this.log(`❌ Error al abrir IndexedDB: ${e.target.error}`); // Ejecuta llamada o método
            });
        },

        // Escribe una línea en el terminal visual del laboratorio
        log(mensaje) { // Instrucción JavaScript
            const terminal = document.getElementById('idbLogTerminal'); // Obtiene referencia DOM para "terminal"
            if (!terminal) return; // Evalúa condición

            const ahora = new Date(); // Declara e inicializa "ahora"
            const tiempo = ahora.toTimeString().split(' ')[0]; // Declara e inicializa "tiempo"

            const linea = document.createElement('div'); // Crea nuevo elemento DOM "linea"
            linea.className = 'idb-log-line'; // Asigna valor
            linea.innerHTML = `<span class="idb-log-time">[${tiempo}]</span> ${mensaje}`; // Actualiza contenido en el DOM

            terminal.appendChild(linea); // Inserta nodo en el DOM
            terminal.scrollTop = terminal.scrollHeight; // Asigna valor
        },

        // Si la base está vacía, inserta 2 registros de muestra
        inicializarRegistrosSiVacia() { // Instrucción JavaScript
            const db = AppState.idbLab.dbInstance; // Declara e inicializa "db"
            if (!db) return; // Evalúa condición

            const tx = db.transaction(AppState.idbLab.storeName, 'readonly'); // Declara e inicializa "tx"
            const store = tx.objectStore(AppState.idbLab.storeName); // Declara e inicializa "store"
            const countReq = store.count(); // Declara e inicializa "countReq"

            countReq.onsuccess = () => { // Asigna valor
                if (countReq.result === 0) { // Evalúa condición
                    this.log('ℹ️ Base vacía: insertando registros de ejemplo...'); // Ejecuta llamada o método
                    this.insertarRegistroDirecto({ nombre: 'Fredy Developer', rol: 'Tech Lead', nivel: 'Master' }, () => { // Instrucción JavaScript
                        this.insertarRegistroDirecto({ nombre: 'Ana Gómez', rol: 'Frontend Architect', nivel: 'Senior' }, () => { // Instrucción JavaScript
                            this.refrescarTabla(); // Ejecuta llamada o método
                        });
                    });
                } else { // Instrucción JavaScript
                    this.refrescarTabla(); // Ejecuta llamada o método
                }
            };
        },

        // Inserción directa de registro
        insertarRegistroDirecto(objeto, callback) { // Instrucción JavaScript
            const db = AppState.idbLab.dbInstance; // Declara e inicializa "db"
            if (!db) return; // Evalúa condición

            const tx = db.transaction(AppState.idbLab.storeName, 'readwrite'); // Declara e inicializa "tx"
            const store = tx.objectStore(AppState.idbLab.storeName); // Declara e inicializa "store"
            const req = store.add(objeto); // Declara e inicializa "req"

            req.onsuccess = () => { // Asigna valor
                if (callback) callback(req.result); // Evalúa condición
            };
        },

        // Refresca la tabla del DOM leyendo con cursor
        refrescarTabla() { // Instrucción JavaScript
            const db = AppState.idbLab.dbInstance; // Declara e inicializa "db"
            const tbody = document.getElementById('idbTableBody'); // Obtiene referencia DOM para "tbody"
            const badgeCount = document.getElementById('idbRecordCount'); // Obtiene referencia DOM para "badgeCount"
            if (!db || !tbody) return; // Evalúa condición

            tbody.innerHTML = ''; // Actualiza contenido en el DOM
            const lista = []; // Declara e inicializa "lista"

            const tx = db.transaction(AppState.idbLab.storeName, 'readonly'); // Declara e inicializa "tx"
            const store = tx.objectStore(AppState.idbLab.storeName); // Declara e inicializa "store"
            const cursorReq = store.openCursor(); // Declara e inicializa "cursorReq"

            cursorReq.addEventListener('success', (e) => { // Registra escuchador de eventos
                const cursor = e.target.result; // Declara e inicializa "cursor"
                if (cursor) { // Evalúa condición
                    lista.push({ key: cursor.key, val: cursor.value }); // Ejecuta llamada o método
                    cursor.continue(); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    AppState.idbLab.registros = lista; // Asigna valor
                    if (badgeCount) badgeCount.textContent = `${lista.length} registros`; // Evalúa condición

                    if (lista.length === 0) { // Evalúa condición
                        tbody.innerHTML = `<tr><td colspan="5" class="idb-table-empty">El almacén 'usuarios' está vacío. Utiliza el formulario superior para agregar registros.</td></tr>`; // Actualiza contenido en el DOM
                    } else { // Instrucción JavaScript
                        lista.forEach(item => { // Instrucción JavaScript
                            const tr = document.createElement('tr'); // Crea nuevo elemento DOM "tr"
                            tr.innerHTML = `
                                <td><span class="idb-badge-pk">#${item.key}</span></td>
                                <td><strong>${item.val.nombre || 'Sin nombre'}</strong></td>
                                <td>${item.val.rol || 'General'}</td>
                                <td><span class="badge badge-purple">${item.val.nivel || 'N/A'}</span></td>
                                <td>
                                    <button class="idb-btn idb-btn-danger" style="padding: 0.25rem 0.6rem; font-size: 0.74rem;" data-del="${item.key}">
                                        🗑️ Borrar
                                    </button>
                                </td>
                            `;
                            tbody.appendChild(tr); // Inserta nodo en el DOM
                        });

                        // Eventos para botones de borrado individual
                        tbody.querySelectorAll('[data-del]').forEach(btn => { // Instrucción JavaScript
                            btn.addEventListener('click', () => { // Registra escuchador de eventos
                                const k = parseInt(btn.getAttribute('data-del'), 10); // Declara e inicializa "k"
                                this.eliminarRegistro(k); // Ejecuta llamada o método
                            });
                        });
                    }
                }
            });
        },

        // Elimina un registro por clave
        eliminarRegistro(key) { // Instrucción JavaScript
            const db = AppState.idbLab.dbInstance; // Declara e inicializa "db"
            if (!db) return; // Evalúa condición

            const tx = db.transaction(AppState.idbLab.storeName, 'readwrite'); // Declara e inicializa "tx"
            const store = tx.objectStore(AppState.idbLab.storeName); // Declara e inicializa "store"
            const req = store.delete(key); // Declara e inicializa "req"

            req.onsuccess = () => { // Asigna valor
                SoundFX.success(); // Ejecuta llamada o método
                this.log(`🗑️ [deleteObjeto] Registro con clave #${key} eliminado.`); // Ejecuta llamada o método
                this.refrescarTabla(); // Ejecuta llamada o método
            };
        },

        // Vincula controles interactivos
        bindControls() { // Instrucción JavaScript
            const btnAdd = document.getElementById('idbBtnAdd'); // Obtiene referencia DOM para "btnAdd"
            const btnRefresh = document.getElementById('idbBtnRefresh'); // Obtiene referencia DOM para "btnRefresh"
            const btnClear = document.getElementById('idbBtnClear'); // Obtiene referencia DOM para "btnClear"

            const inputNombre = document.getElementById('idbInputNombre'); // Obtiene referencia DOM para "inputNombre"
            const inputRol = document.getElementById('idbInputRol'); // Obtiene referencia DOM para "inputRol"
            const inputNivel = document.getElementById('idbInputNivel'); // Obtiene referencia DOM para "inputNivel"

            // Agregar registro
            if (btnAdd) { // Evalúa condición
                btnAdd.addEventListener('click', (e) => { // Registra escuchador de eventos
                    e.preventDefault(); // Ejecuta llamada o método
                    const nombre = inputNombre ? inputNombre.value.trim() : ''; // Declara e inicializa "nombre"
                    const rol = inputRol ? inputRol.value.trim() : ''; // Declara e inicializa "rol"
                    const nivel = inputNivel ? inputNivel.value.trim() : ''; // Declara e inicializa "nivel"

                    if (!nombre) { // Evalúa condición
                        this.log('⚠️ Por favor introduce un nombre para el registro.'); // Ejecuta llamada o método
                        if (inputNombre) inputNombre.focus(); // Evalúa condición
                        return; // Retorna resultado
                    }

                    const nuevo = { nombre, rol: rol || 'Desarrollador', nivel: nivel || 'Master' }; // Declara e inicializa "nuevo"
                    this.insertarRegistroDirecto(nuevo, (keyGenerada) => { // Instrucción JavaScript
                        SoundFX.success(); // Ejecuta llamada o método
                        this.log(`🟢 [addObjeto] Registro agregado con clave autoincremental: #${keyGenerada}`); // Ejecuta llamada o método
                        if (inputNombre) inputNombre.value = ''; // Evalúa condición
                        if (inputRol) inputRol.value = ''; // Evalúa condición
                        this.refrescarTabla(); // Ejecuta llamada o método
                    });
                });
            }

            // Refrescar lista con cursor
            if (btnRefresh) { // Evalúa condición
                btnRefresh.addEventListener('click', () => { // Registra escuchador de eventos
                    this.log("🔄 [leerObjetos] Recorriendo almacén con openCursor()..."); // Ejecuta llamada o método
                    this.refrescarTabla(); // Ejecuta llamada o método
                });
            }

            // Vaciar almacén con .clear()
            if (btnClear) { // Evalúa condición
                btnClear.addEventListener('click', () => { // Registra escuchador de eventos
                    if (!confirm("¿Deseas vaciar todos los registros del almacén 'usuarios'?")) return; // Evalúa condición
                    const db = AppState.idbLab.dbInstance; // Declara e inicializa "db"
                    if (!db) return; // Evalúa condición

                    const tx = db.transaction(AppState.idbLab.storeName, 'readwrite'); // Declara e inicializa "tx"
                    tx.objectStore(AppState.idbLab.storeName).clear().onsuccess = () => { // Instrucción JavaScript
                        this.log("🧹 [clear] Almacén de objetos vaciado completamente."); // Ejecuta llamada o método
                        this.refrescarTabla(); // Ejecuta llamada o método
                    };
                });
            }
        }
    };

    /* ==========================================================================
       5. ARRANQUE DEL APLICATIVO
       ========================================================================== */
    // Inicialización al cargar el DOM completo
    document.addEventListener('DOMContentLoaded', () => { // Registra escuchador de eventos
        Navigation.init(); // Ejecuta llamada o método
        IDBLabController.init(); // Ejecuta llamada o método
    });

})(); // Ejecuta llamada o método
