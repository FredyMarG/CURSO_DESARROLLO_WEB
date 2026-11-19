/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: WINDOW.MATCHMEDIA()
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO RESPONSIVE Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () {
    // Activamos el modo estricto de ECMAScript para asegurar buenas prácticas y evitar variables globales no declaradas
    'use strict';

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto centralizado que administra el estado reactivo del visor y del laboratorio interactivo
    const AppState = {
        // Índice de la diapositiva actualmente mostrada (del 1 al 11)
        currentSlide: 1,
        // Número total de diapositivas interactivas definidas en el documento
        totalSlides: 11,
        // Modo de visualización actual: 'slides' para presentación o 'guide' para lectura continua
        viewMode: 'slides',
        // Indicador booleano para habilitar o silenciar los efectos del sintetizador de audio
        soundEnabled: true,
        // Estado booleano de visibilidad de la ventana modal con la cuadrícula de diapositivas
        overviewOpen: false,

        // Estado del laboratorio de Media Queries interactivas
        mqLab: {
            // Modo de emulación activo: false para ventana real o número de píxeles emulados
            emulatedWidth: null,
            // Registro de contadores de eventos 'change' disparados por cada consulta
            counts: {
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
    const SoundFX = {
        // Variable para almacenar la instancia única de AudioContext
        ctx: null,

        // Método de inicialización segura del contexto tras la primera acción del usuario
        init() {
            // Verificamos si el contexto aún no ha sido instanciado y existe compatibilidad
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                // Obtenemos la referencia a la clase constructora estándar o con prefijo
                const AudioConstructor = window.AudioContext || window.webkitAudioContext;
                // Instanciamos el contexto de audio del navegador
                this.ctx = new AudioConstructor();
            }
        },

        // Sonido armónico suave para transiciones de diapositiva
        slide() {
            // Verificamos que el usuario tenga el sonido habilitado
            if (!AppState.soundEnabled) return;
            // Inicializamos el contexto si aún no existe
            this.init();
            // Salimos de inmediato si el navegador no soporta Web Audio API
            if (!this.ctx) return;

            // Reanudamos el contexto en caso de que esté suspendido por políticas de ahorro de energía
            if (this.ctx.state === 'suspended') {
                // Reanudamos de forma asíncrona
                this.ctx.resume();
            }

            // Creamos un oscilador para generar la onda periódica
            const osc = this.ctx.createOscillator();
            // Creamos un nodo de ganancia para modelar la envolvente de volumen
            const gain = this.ctx.createGain();

            // Configuramos una forma de onda senoidal suave y agradable
            osc.type = 'sine';
            // Obtenemos el tiempo actual del reloj del motor de audio
            const now = this.ctx.currentTime;

            // Fijamos la frecuencia inicial en 320 Hz
            osc.frequency.setValueAtTime(320, now);
            // Efectuamos una rampa exponencial ascendente hasta 480 Hz en 120 milisegundos
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

            // Fijamos el volumen inicial en cero absoluto
            gain.gain.setValueAtTime(0.001, now);
            // Rampa lineal rápida de ataque a volumen audible
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
            // Decaimiento exponencial suave hasta extinguirse en 180 milisegundos
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

            // Conectamos el oscilador al nodo de ganancia
            osc.connect(gain);
            // Conectamos la ganancia a los altavoces o auriculares del dispositivo
            gain.connect(this.ctx.destination);

            // Iniciamos la oscilación inmediatamente
            osc.start(now);
            // Detenemos el generador al culminar los 180 milisegundos
            osc.stop(now + 0.18);
        },

        // Sonido de clic sutil para botones y controles de interfaz
        click() {
            // Si el sonido está apagado, salimos
            if (!AppState.soundEnabled) return;
            // Inicializamos el contexto
            this.init();
            // Si no hay soporte, abortamos
            if (!this.ctx) return;

            // Reanudamos el contexto si estuviera suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos el oscilador de audio
            const osc = this.ctx.createOscillator();
            // Creamos el nodo de volumen
            const gain = this.ctx.createGain();

            // Usamos onda triangular de ataque percusivo
            osc.type = 'triangle';
            // Tiempo actual
            const now = this.ctx.currentTime;

            // Frecuencia fija aguda de 600 Hz
            osc.frequency.setValueAtTime(600, now);
            // Volumen inicial
            gain.gain.setValueAtTime(0.05, now);
            // Desvanecimiento veloz en 40 milisegundos
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            // Conexión del circuito de audio
            osc.connect(gain);
            // Salida de audio
            gain.connect(this.ctx.destination);

            // Disparo instantáneo
            osc.start(now);
            // Parada inmediata
            osc.stop(now + 0.04);
        },

        // Tono brillante al disparar un evento reactivo de cambio de breakpoint
        matchEvent() {
            // Verificamos que el sonido esté encendido
            if (!AppState.soundEnabled) return;
            // Aseguramos contexto activo
            this.init();
            // Salida si no hay soporte
            if (!this.ctx) return;

            // Reanudar contexto si está pausado
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos el oscilador
            const osc = this.ctx.createOscillator();
            // Creamos el nodo de ganancia
            const gain = this.ctx.createGain();

            // Onda senoidal pura
            osc.type = 'sine';
            // Marca de tiempo
            const now = this.ctx.currentTime;

            // Frecuencia inicial en tono medio (520 Hz)
            osc.frequency.setValueAtTime(520, now);
            // Modulación en rampa hacia un tono más agudo (880 Hz)
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

            // Volumen inicial
            gain.gain.setValueAtTime(0.06, now);
            // Decaimiento natural
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

            // Conectamos componentes
            osc.connect(gain);
            // Conexión a bocinas
            gain.connect(this.ctx.destination);

            // Ejecución
            osc.start(now);
            // Finalización
            osc.stop(now + 0.15);
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE DIAPOSITIVAS Y NAVEGACIÓN (SlideNavigation)
       ========================================================================== */
    // Objeto encargado de orquestar la paginación, teclado, pantalla completa e indicadores
    const SlideNavigation = {
        // Inicializa los oyentes de eventos y construye la interfaz dinámica
        init() {
            // Cacheamos referencias del DOM necesarias para la navegación
            this.wrapper = document.getElementById('presentationWrapper');
            // Colección de todas las diapositivas
            this.slides = document.querySelectorAll('.slide');
            // Barra de progreso visual
            this.progressBar = document.getElementById('progressBar');
            // Etiqueta de texto del número de diapositiva
            this.slideIndicator = document.getElementById('slideIndicator');

            // Botón de diapositiva anterior
            this.btnPrev = document.getElementById('btnPrevSlide');
            // Botón de diapositiva siguiente
            this.btnNext = document.getElementById('btnNextSlide');
            // Contenedor de bolitas de paginación
            this.dotsContainer = document.getElementById('slideDotsContainer');

            // Botón de alternar modo presentación / guía
            this.btnToggleMode = document.getElementById('btnToggleMode');
            // Texto del botón de modo
            this.modeText = document.getElementById('modeText');
            // Icono del botón de modo
            this.modeIcon = document.getElementById('modeIcon');

            // Botón de alternar sonido
            this.btnToggleSound = document.getElementById('btnToggleSound');
            // Icono del botón de sonido
            this.soundIcon = document.getElementById('soundIcon');

            // Botón de cuadrícula general de diapositivas
            this.btnOverview = document.getElementById('btnOverview');
            // Modal de cuadrícula general
            this.overviewModal = document.getElementById('overviewModal');
            // Botón para cerrar modal
            this.btnCloseOverview = document.getElementById('btnCloseOverview');
            // Rejilla contenedora de miniaturas
            this.overviewGrid = document.getElementById('overviewGrid');

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen');

            // Construimos dinámicamente los puntos de navegación
            this.buildSlideDots();
            // Construimos la cuadrícula de vista general
            this.buildOverviewGrid();
            // Vinculamos todos los eventos de interacción del usuario
            this.bindEvents();
            // Aplicamos el estado de la primera diapositiva
            this.updateUI();
        },

        // Genera los círculos clicables de paginación inferior
        buildSlideDots() {
            // Si no existe el contenedor de puntos en el DOM, salimos
            if (!this.dotsContainer) return;
            // Vaciamos el contenedor previo
            this.dotsContainer.innerHTML = '';

            // Recorremos cada diapositiva para crear su indicador correspondiente
            this.slides.forEach((slide, index) => {
                // Número real de la diapositiva (1-based)
                const slideNum = index + 1;
                // Creamos el elemento botón del punto
                const dot = document.createElement('button');
                // Asignamos la clase base del indicador
                dot.className = 'slide-dot';
                // Asignamos texto accesible para lectores de pantalla
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`);
                // Atributo de tooltip informativo
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                // Si es la diapositiva activa, añadimos la clase de resaltado
                if (slideNum === AppState.currentSlide) {
                    dot.classList.add('active');
                }

                // Asignamos el evento de clic para saltar directamente a esa diapositiva
                dot.addEventListener('click', () => {
                    // Emitimos sonido de clic
                    SoundFX.click();
                    // Navegamos a la diapositiva seleccionada
                    this.goToSlide(slideNum);
                });

                // Añadimos el punto al contenedor del DOM
                this.dotsContainer.appendChild(dot);
            });
        },

        // Genera las tarjetas interactivas de la cuadrícula de visión general
        buildOverviewGrid() {
            // Si el contenedor de cuadrícula no existe, salimos
            if (!this.overviewGrid) return;
            // Limpiamos contenido anterior
            this.overviewGrid.innerHTML = '';

            // Iteramos sobre las diapositivas
            this.slides.forEach((slide, index) => {
                // Número ordinal de diapositiva
                const slideNum = index + 1;
                // Título descriptivo de la diapositiva
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                // Creamos la tarjeta de miniatura
                const card = document.createElement('div');
                // Asignamos clase estilizada
                card.className = 'overview-card';
                // Identificador de datos
                card.dataset.slideIndex = slideNum;

                // Si corresponde a la diapositiva actual, agregamos clase activa
                if (slideNum === AppState.currentSlide) {
                    card.classList.add('active');
                }

                // Inyectamos el marcado HTML interno de la tarjeta
                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                // Agregamos evento de clic para seleccionar diapositiva y cerrar modal
                card.addEventListener('click', () => {
                    // Ejecutamos sonido de interacción
                    SoundFX.click();
                    // Navegamos a la diapositiva seleccionada
                    this.goToSlide(slideNum);
                    // Cerramos el modal de visión general
                    this.closeOverview();
                });

                // Incorporamos la tarjeta a la cuadrícula
                this.overviewGrid.appendChild(card);
            });
        },

        // Vincula todos los escuchadores de eventos de la barra de herramientas y teclado
        bindEvents() {
            // Botón de retroceder diapositiva
            if (this.btnPrev) {
                this.btnPrev.addEventListener('click', () => {
                    SoundFX.click();
                    this.prevSlide();
                });
            }

            // Botón de avanzar diapositiva
            if (this.btnNext) {
                this.btnNext.addEventListener('click', () => {
                    SoundFX.click();
                    this.nextSlide();
                });
            }

            // Botón de alternar modo presentación / guía
            if (this.btnToggleMode) {
                this.btnToggleMode.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleViewMode();
                });
            }

            // Botón de alternar sonido
            if (this.btnToggleSound) {
                this.btnToggleSound.addEventListener('click', () => {
                    this.toggleSound();
                });
            }

            // Botón de apertura de cuadrícula general
            if (this.btnOverview) {
                this.btnOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleOverview();
                });
            }

            // Botón de cierre de modal
            if (this.btnCloseOverview) {
                this.btnCloseOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.closeOverview();
                });
            }

            // Cierre del modal haciendo clic en el fondo oscuro translúcido
            if (this.overviewModal) {
                this.overviewModal.addEventListener('click', (e) => {
                    if (e.target === this.overviewModal) {
                        this.closeOverview();
                    }
                });
            }

            // Botón de alternar pantalla completa
            if (this.btnFullscreen) {
                this.btnFullscreen.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleFullscreen();
                });
            }

            // Escucha global de eventos de teclado físico
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        // Procesa los atajos de teclado para una navegación ergonómica
        handleKeyDown(e) {
            // Si el foco se encuentra en un campo de texto o elemento editable, no interceptamos
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            // Evaluamos la tecla presionada
            switch (e.key) {
                // Flecha derecha o letra D: Siguiente diapositiva
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.nextSlide();
                    break;

                // Flecha izquierda o letra A: Diapositiva anterior
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.prevSlide();
                    break;

                // Barra espaciadora: Siguiente diapositiva
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;

                // Tecla O: Abrir o cerrar cuadrícula de vista general
                case 'o':
                case 'O':
                    e.preventDefault();
                    this.toggleOverview();
                    break;

                // Tecla F: Activar o desactivar pantalla completa
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;

                // Tecla Escape: Cerrar modal si estuviera abierto
                case 'Escape':
                    if (AppState.overviewOpen) {
                        this.closeOverview();
                    }
                    break;

                // Tecla Inicio (Home): Ir a la primera diapositiva
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;

                // Tecla Fin (End): Ir a la última diapositiva
                case 'End':
                    e.preventDefault();
                    this.goToSlide(AppState.totalSlides);
                    break;

                default:
                    break;
            }
        },

        // Navega hacia una diapositiva específica por su índice numérico
        goToSlide(index) {
            // Validamos que el índice se encuentre dentro de los límites legales
            if (index < 1 || index > AppState.totalSlides) return;
            // Si ya estamos en esa diapositiva, no hacemos nada
            if (index === AppState.currentSlide) return;

            // Actualizamos el estado con el nuevo índice
            AppState.currentSlide = index;
            // Disparamos el efecto sonoro de deslizamiento
            SoundFX.slide();
            // Actualizamos la presentación visual
            this.updateUI();
        },

        // Avanza a la diapositiva siguiente
        nextSlide() {
            // Verificamos si existe una diapositiva posterior
            if (AppState.currentSlide < AppState.totalSlides) {
                // Saltamos al siguiente índice
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        // Retrocede a la diapositiva anterior
        prevSlide() {
            // Verificamos si existe una diapositiva anterior
            if (AppState.currentSlide > 1) {
                // Saltamos al índice previo
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        // Alterna entre el modo de presentación de diapositivas y el modo guía continua
        toggleViewMode() {
            // Alternamos el valor en el estado
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';

            // Si cambiamos a modo guía continua
            if (AppState.viewMode === 'guide') {
                // Reemplazamos la clase en el cuerpo del documento
                document.body.classList.remove('mode-presentation');
                document.body.classList.add('mode-document');
                // Actualizamos los textos e iconos de la barra
                if (this.modeText) this.modeText.textContent = 'Modo Diapos';
                if (this.modeIcon) this.modeIcon.textContent = '🖥️';
            } else {
                // Reemplazamos la clase a modo presentación
                document.body.classList.remove('mode-document');
                document.body.classList.add('mode-presentation');
                // Actualizamos textos e iconos
                if (this.modeText) this.modeText.textContent = 'Modo Guía';
                if (this.modeIcon) this.modeIcon.textContent = '📑';
            }

            // Sincronizamos la visibilidad según el modo
            this.updateUI();
        },

        // Activa o desactiva los efectos de sonido procedurales
        toggleSound() {
            // Invertimos el valor booleano en el estado
            AppState.soundEnabled = !AppState.soundEnabled;
            // Actualizamos el icono del botón
            if (this.soundIcon) {
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
            // Si fue habilitado, emitimos un clic de confirmación
            if (AppState.soundEnabled) {
                SoundFX.click();
            }
        },

        // Alterna el modal de vista general de diapositivas
        toggleOverview() {
            if (AppState.overviewOpen) {
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        // Abre el modal de la cuadrícula general
        openOverview() {
            AppState.overviewOpen = true;
            if (this.overviewModal) {
                this.overviewModal.classList.add('active');
            }
            // Marcamos la tarjeta activa en la cuadrícula
            const cards = document.querySelectorAll('.overview-card');
            cards.forEach(card => {
                const idx = parseInt(card.dataset.slideIndex, 10);
                card.classList.toggle('active', idx === AppState.currentSlide);
            });
        },

        // Cierra el modal de la cuadrícula general
        closeOverview() {
            AppState.overviewOpen = false;
            if (this.overviewModal) {
                this.overviewModal.classList.remove('active');
            }
        },

        // Alterna el modo de pantalla completa nativo del navegador
        toggleFullscreen() {
            // Si actualmente no hay elemento en pantalla completa
            if (!document.fullscreenElement) {
                // Solicitamos pantalla completa para todo el documento
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                // Si ya está activa, salimos de ella
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                }
            }
        },

        // Actualiza todos los elementos visuales de la interfaz acordes al estado actual
        updateUI() {
            // Actualizamos la clase active en las diapositivas si estamos en modo presentación
            if (AppState.viewMode === 'slides') {
                this.slides.forEach((slide, index) => {
                    const slideNum = index + 1;
                    if (slideNum === AppState.currentSlide) {
                        slide.classList.add('active');
                        // Desplazamos la ventana suavemente hacia el inicio superior
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        slide.classList.remove('active');
                    }
                });
            } else {
                // En modo documento todas las secciones son visibles
                this.slides.forEach(slide => slide.classList.add('active'));
            }

            // Calculamos el porcentaje de avance de la presentación
            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100;
            // Actualizamos el ancho de la barra de progreso
            if (this.progressBar) {
                this.progressBar.style.width = `${percent}%`;
            }

            // Actualizamos la etiqueta de texto (ej. "3 / 11")
            if (this.slideIndicator) {
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
            }

            // Actualizamos los puntos indicadores inferiores
            const dots = document.querySelectorAll('.slide-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide);
            });

            // Ajustamos el estado visual de los botones de navegación anterior/siguiente
            if (this.btnPrev) {
                this.btnPrev.disabled = AppState.currentSlide === 1;
                this.btnPrev.style.opacity = AppState.currentSlide === 1 ? '0.35' : '1';
            }
            if (this.btnNext) {
                this.btnNext.disabled = AppState.currentSlide === AppState.totalSlides;
                this.btnNext.style.opacity = AppState.currentSlide === AppState.totalSlides ? '0.35' : '1';
            }
        }
    };

    /* ==========================================================================
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE MATCHMEDIA (MQLabController)
       ========================================================================== */
    // Gestiona los monitores en tiempo real, eventos 'change', tarjetas y simulador de anchos
    const MQLabController = {
        // Inicializa el laboratorio y registra las Media Queries nativas del navegador
        init() {
            // Referencias del panel del medidor de resolución
            this.resWidth = document.getElementById('mqResWidth');
            this.resHeight = document.getElementById('mqResHeight');
            this.deviceLabel = document.getElementById('mqDeviceLabel');
            this.barFill = document.getElementById('mqViewportBarFill');

            // Terminal de registro de eventos
            this.terminal = document.getElementById('mqLogTerminal');

            // Botones de controles de simulación
            this.btnSimMobile = document.getElementById('btnSimMobile');
            this.btnSimTablet = document.getElementById('btnSimTablet');
            this.btnSimDesktop = document.getElementById('btnSimDesktop');
            this.btnSimReal = document.getElementById('btnSimReal');
            this.btnClearLogs = document.getElementById('btnClearMqLogs');

            // Definimos la configuración de las 6 Media Queries que serán monitoreadas
            this.queries = [
                {
                    key: 'mobile',
                    cardId: 'cardMqMobile',
                    badgeId: 'badgeMqMobile',
                    countId: 'countMqMobile',
                    rule: '(max-width: 599px)',
                    name: 'Móvil Estrecho',
                    mql: window.matchMedia('(max-width: 599px)')
                },
                {
                    key: 'tablet',
                    cardId: 'cardMqTablet',
                    badgeId: 'badgeMqTablet',
                    countId: 'countMqTablet',
                    rule: '(min-width: 600px) and (max-width: 1023px)',
                    name: 'Tablet / Portátil',
                    mql: window.matchMedia('(min-width: 600px) and (max-width: 1023px)')
                },
                {
                    key: 'desktop',
                    cardId: 'cardMqDesktop',
                    badgeId: 'badgeMqDesktop',
                    countId: 'countMqDesktop',
                    rule: '(min-width: 1024px)',
                    name: 'Escritorio Amplio',
                    mql: window.matchMedia('(min-width: 1024px)')
                },
                {
                    key: 'dark',
                    cardId: 'cardMqDark',
                    badgeId: 'badgeMqDark',
                    countId: 'countMqDark',
                    rule: '(prefers-color-scheme: dark)',
                    name: 'Tema Oscuro del Sistema',
                    mql: window.matchMedia('(prefers-color-scheme: dark)')
                },
                {
                    key: 'landscape',
                    cardId: 'cardMqLandscape',
                    badgeId: 'badgeMqLandscape',
                    countId: 'countMqLandscape',
                    rule: '(orientation: landscape)',
                    name: 'Orientación Horizontal',
                    mql: window.matchMedia('(orientation: landscape)')
                },
                {
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
            this.setupMediaQueries();
            // Vinculamos la actualización continua del visor del viewport
            this.bindViewportMeter();
            // Vinculamos los botones de emulación y limpieza
            this.bindControls();
            // Log de bienvenida inicial en el terminal del laboratorio
            this.log('Sistema de monitoreo reactivo listo. Redimensiona tu ventana para ver eventos en vivo.');
        },

        // Configura los oyentes y ejecuta la evaluación inicial para cada consulta
        setupMediaQueries() {
            // Iteramos sobre las consultas definidas
            this.queries.forEach(item => {
                // Evaluamos el estado inicial de inmediato usando .matches
                this.updateCardUI(item, item.mql.matches, false);

                // Registramos el manejador oficial de eventos mediante addEventListener("change")
                item.mql.addEventListener('change', (e) => {
                    // Incrementamos el contador de disparos para esta regla
                    AppState.mqLab.counts[item.key]++;
                    // Actualizamos la tarjeta con el nuevo estado booleano
                    this.updateCardUI(item, e.matches, true);
                    // Disparamos sonido armónico de detección de cambio
                    SoundFX.matchEvent();
                    // Registramos la notificación en el terminal interactivo
                    const statusText = e.matches ? 'CUMPLE (matches: true)' : 'DEJÓ DE CUMPLIR (matches: false)';
                    this.log(`⚡ [Evento 'change'] ${item.name}: ${statusText}`);
                });
            });
        },

        // Actualiza el aspecto de una tarjeta de consulta según su estado booleano
        updateCardUI(item, matches, isEvent) {
            // Buscamos los elementos del DOM de la tarjeta
            const cardEl = document.getElementById(item.cardId);
            const badgeEl = document.getElementById(item.badgeId);
            const countEl = document.getElementById(item.countId);

            // Si los elementos existen en el DOM
            if (cardEl && badgeEl) {
                // Si la consulta coincide actualmente
                if (matches) {
                    cardEl.classList.add('active');
                    badgeEl.className = 'mq-badge-match is-true';
                    badgeEl.textContent = 'matches: true';
                } else {
                    cardEl.classList.remove('active');
                    badgeEl.className = 'mq-badge-match is-false';
                    badgeEl.textContent = 'matches: false';
                }
            }

            // Actualizamos el contador de eventos si corresponde
            if (countEl) {
                const count = AppState.mqLab.counts[item.key] || 0;
                countEl.textContent = `${count} ${count === 1 ? 'evento' : 'eventos'}`;
            }
        },

        // Mantiene actualizado el indicador numérico de dimensiones y la barra de ancho
        bindViewportMeter() {
            // Función interna para refrescar métricas
            const refreshMeter = () => {
                // Leemos las dimensiones reales del viewport
                const width = AppState.mqLab.emulatedWidth || window.innerWidth;
                const height = window.innerHeight;

                // Actualizamos los textos de ancho y alto
                if (this.resWidth) this.resWidth.textContent = width;
                if (this.resHeight) this.resHeight.textContent = height;

                // Calculamos el porcentaje visual para la barra de 0 a 1600px
                const barPercent = Math.min(Math.max((width / 1600) * 100, 10), 100);
                if (this.barFill) {
                    this.barFill.style.width = `${barPercent}%`;
                }

                // Determinamos la etiqueta de categoría de dispositivo
                if (this.deviceLabel) {
                    if (width < 600) {
                        this.deviceLabel.textContent = '📱 Móvil';
                        this.deviceLabel.className = 'badge badge-purple';
                    } else if (width < 1024) {
                        this.deviceLabel.textContent = '💻 Tablet';
                        this.deviceLabel.className = 'badge badge-cyan';
                    } else {
                        this.deviceLabel.textContent = '🖥️ Escritorio';
                        this.deviceLabel.className = 'badge badge-emerald';
                    }
                }
            };

            // Ejecutamos inmediatamente
            refreshMeter();
            // Escuchamos redimensionamiento para actualizar únicamente el medidor visual
            window.addEventListener('resize', refreshMeter);
        },

        // Vincula los botones de control interactivo del laboratorio
        bindControls() {
            // Botón para simular resolución móvil de 375px
            if (this.btnSimMobile) {
                this.btnSimMobile.addEventListener('click', () => {
                    SoundFX.click();
                    this.simulateWidth(375, 'Móvil (375px)');
                });
            }

            // Botón para simular resolución tablet de 768px
            if (this.btnSimTablet) {
                this.btnSimTablet.addEventListener('click', () => {
                    SoundFX.click();
                    this.simulateWidth(768, 'Tablet (768px)');
                });
            }

            // Botón para simular resolución de escritorio de 1200px
            if (this.btnSimDesktop) {
                this.btnSimDesktop.addEventListener('click', () => {
                    SoundFX.click();
                    this.simulateWidth(1200, 'Escritorio (1200px)');
                });
            }

            // Botón para restablecer la medición real del viewport físico
            if (this.btnSimReal) {
                this.btnSimReal.addEventListener('click', () => {
                    SoundFX.click();
                    AppState.mqLab.emulatedWidth = null;
                    // Reevaluamos tarjetas con las instancias reales
                    this.queries.forEach(item => {
                        this.updateCardUI(item, item.mql.matches, false);
                    });
                    this.log('🔄 Modo de medición restablecido al ancho real del navegador.');
                    // Disparamos actualización del medidor
                    window.dispatchEvent(new Event('resize'));
                });
            }

            // Botón para limpiar los mensajes del terminal
            if (this.btnClearLogs) {
                this.btnClearLogs.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.terminal) {
                        this.terminal.innerHTML = '';
                        this.log('🧹 Terminal de eventos limpiado.');
                    }
                });
            }
        },

        // Simula visualmente el comportamiento de las tarjetas ante un ancho específico
        simulateWidth(targetWidth, labelName) {
            // Guardamos el ancho simulado en el estado
            AppState.mqLab.emulatedWidth = targetWidth;

            // Evaluamos lógicamente cada regla según el ancho simulado
            this.queries.forEach(item => {
                let simulatedMatch = false;

                if (item.key === 'mobile') {
                    simulatedMatch = targetWidth <= 599;
                } else if (item.key === 'tablet') {
                    simulatedMatch = targetWidth >= 600 && targetWidth <= 1023;
                } else if (item.key === 'desktop') {
                    simulatedMatch = targetWidth >= 1024;
                } else {
                    // Para preferencias de hardware o sistema mantenemos la lectura nativa
                    simulatedMatch = item.mql.matches;
                }

                // Incrementamos contador
                AppState.mqLab.counts[item.key]++;
                // Actualizamos tarjeta
                this.updateCardUI(item, simulatedMatch, true);
            });

            // Emitimos sonido de evento
            SoundFX.matchEvent();
            // Registramos en el terminal
            this.log(`🎯 [Simulador] Ancho fijado a ${labelName}. Evaluadas consultas dinámicas.`);
            // Disparamos evento de resize para actualizar la barra y la etiqueta
            window.dispatchEvent(new Event('resize'));
        },

        // Registra una línea con marca de tiempo en el terminal visual del laboratorio
        log(message) {
            // Si el terminal no existe en el DOM, salimos
            if (!this.terminal) return;

            // Obtenemos la hora, minutos y segundos actuales con formato de dos dígitos
            const now = new Date();
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            // Creamos el contenedor de la línea
            const line = document.createElement('div');
            line.className = 'mq-log-line';

            // Marcado con marca de tiempo atenuada y texto del evento
            line.innerHTML = `
                <span class="mq-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            // Incorporamos la línea al terminal
            this.terminal.appendChild(line);
            // Hacemos scroll automático hacia el final del terminal
            this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    };

    /* ==========================================================================
       5. ARRANQUE AUTOMÁTICO DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización invocada cuando el documento HTML está completamente parseado
    function startApplication() {
        // Inicializamos el controlador de navegación de diapositivas
        SlideNavigation.init();
        // Inicializamos el controlador del laboratorio interactivo de matchMedia
        MQLabController.init();
    }

    // Comprobamos si el DOM ya ha sido cargado o esperamos el evento DOMContentLoaded
    if (document.readyState === 'loading') {
        // Esperamos a que finalice el parseo del DOM
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        // Si ya está listo, arrancamos inmediatamente
        startApplication();
    }
})();
