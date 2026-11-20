/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: INTERSECTION OBSERVER API
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO EN VIVO Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () {
    // Activamos el modo estricto para garantizar rigor en la ejecución de JavaScript
    'use strict';

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto centralizado que almacena el estado reactivo de la presentación y del laboratorio
    const AppState = {
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
        ioLab: {
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
    const SoundFX = {
        // Referencia al contexto único de audio del navegador
        ctx: null,

        // Inicializa el contexto de audio de forma segura tras la primera acción
        init() {
            // Comprobamos si no existe contexto y el navegador soporta Web Audio API
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                // Obtenemos la clase constructora estándar o con prefijo
                const AudioConstructor = window.AudioContext || window.webkitAudioContext;
                // Creamos la instancia del contexto de audio
                this.ctx = new AudioConstructor();
            }
        },

        // Sonido suave para transiciones entre diapositivas
        slide() {
            // Si el sonido está silenciado, salimos
            if (!AppState.soundEnabled) return;
            // Inicializamos el contexto si aún no existe
            this.init();
            // Si no hay soporte de audio, abortamos
            if (!this.ctx) return;
            // Reanudamos el contexto si estuviera suspendido por políticas del navegador
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos un oscilador de audio
            const osc = this.ctx.createOscillator();
            // Creamos un nodo de ganancia para la envolvente de volumen
            const gain = this.ctx.createGain();
            // Onda senoidal suave
            osc.type = 'sine';
            // Marca de tiempo actual del reloj de audio
            const now = this.ctx.currentTime;

            // Frecuencia inicial de 320 Hz
            osc.frequency.setValueAtTime(320, now);
            // Rampa ascendente hasta 480 Hz en 120ms
            osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

            // Volumen inicial casi nulo
            gain.gain.setValueAtTime(0.001, now);
            // Ataque rápido hasta 0.08
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
            // Desvanecimiento suave en 180ms
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

            // Conectamos el oscilador a la ganancia
            osc.connect(gain);
            // Conectamos la ganancia a los altavoces
            gain.connect(this.ctx.destination);

            // Iniciamos la generación del tono
            osc.start(now);
            // Detenemos el tono tras 180ms
            osc.stop(now + 0.18);
        },

        // Sonido percusivo breve para clics en botones
        click() {
            // Salimos si el audio está desactivado
            if (!AppState.soundEnabled) return;
            // Aseguramos inicialización
            this.init();
            // Validamos existencia del contexto
            if (!this.ctx) return;
            // Reanudamos si está suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Oscilador y nodo de ganancia
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Onda triangular ligera
            osc.type = 'triangle';
            // Tiempo actual
            const now = this.ctx.currentTime;

            // Frecuencia de 600 Hz
            osc.frequency.setValueAtTime(600, now);
            // Volumen inicial
            gain.gain.setValueAtTime(0.05, now);
            // Caída rápida en 40ms
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            // Conexiones del circuito de audio
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            // Disparo y parada
            osc.start(now);
            osc.stop(now + 0.04);
        },

        // Tono agradable cuando un objetivo entra en el área de intersección
        intersectEnter() {
            // Verificamos si el audio está activo
            if (!AppState.soundEnabled) return;
            // Inicializamos
            this.init();
            // Validamos
            if (!this.ctx) return;
            // Reanudamos
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Oscilador y ganancia
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            // Onda senoidal pura
            osc.type = 'sine';
            // Tiempo actual
            const now = this.ctx.currentTime;

            // Tono ascendente de confirmación (540 Hz a 820 Hz)
            osc.frequency.setValueAtTime(540, now);
            osc.frequency.exponentialRampToValueAtTime(820, now + 0.12);

            // Envolvente suave
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

            // Conexión y ejecución
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
        }
    };

    /* ==========================================================================
       3. CONTROLADOR DE NAVEGACIÓN DE DIAPOSITIVAS (SlideNavigation)
       ========================================================================== */
    // Orquesta la paginación, barra de progreso, atajos de teclado y modal de índice
    const SlideNavigation = {
        // Inicializa las referencias del DOM y eventos
        init() {
            // Contenedor principal y colección de diapositivas
            this.wrapper = document.getElementById('presentationWrapper');
            this.slides = document.querySelectorAll('.slide');
            // Barra de progreso e indicador numérico
            this.progressBar = document.getElementById('progressBar');
            this.slideIndicator = document.getElementById('slideIndicator');

            // Botones inferiores y contenedor de puntos
            this.btnPrev = document.getElementById('btnPrevSlide');
            this.btnNext = document.getElementById('btnNextSlide');
            this.dotsContainer = document.getElementById('slideDotsContainer');

            // Botón de alternancia de modo presentación / documento
            this.btnGoLab = document.getElementById('btnGoLab');
            this.btnToggleMode = document.getElementById('btnToggleMode');
            this.modeText = document.getElementById('modeText');
            this.modeIcon = document.getElementById('modeIcon');

            // Botón de audio
            this.btnToggleSound = document.getElementById('btnToggleSound');
            this.soundIcon = document.getElementById('soundIcon');

            // Elementos del modal de vista general
            this.btnOverview = document.getElementById('btnOverview');
            this.overviewModal = document.getElementById('overviewModal');
            this.btnCloseOverview = document.getElementById('btnCloseOverview');
            this.overviewGrid = document.getElementById('overviewGrid');

            // Botón de pantalla completa
            this.btnFullscreen = document.getElementById('btnFullscreen');

            // Construimos los puntos indicadores y la cuadrícula de miniaturas
            this.buildSlideDots();
            this.buildOverviewGrid();
            // Registramos escuchadores de eventos
            this.bindEvents();
            // Sincronizamos el estado inicial
            this.updateUI();
        },

        // Genera los círculos clicables en la barra inferior
        buildSlideDots() {
            // Validamos existencia del contenedor
            if (!this.dotsContainer) return;
            // Limpiamos el contenido previo
            this.dotsContainer.innerHTML = '';

            // Creamos un botón por cada diapositiva
            this.slides.forEach((slide, index) => {
                // Índice basado en 1
                const slideNum = index + 1;
                // Elemento botón
                const dot = document.createElement('button');
                // Clase visual
                dot.className = 'slide-dot';
                // Etiqueta de accesibilidad
                dot.setAttribute('aria-label', `Ir a diapositiva ${slideNum}`);
                // Tooltip con el título de la diapositiva
                dot.title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                // Resaltamos el punto si coincide con la diapositiva activa
                if (slideNum === AppState.currentSlide) {
                    dot.classList.add('active');
                }

                // Al hacer clic saltamos a la diapositiva elegida
                dot.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(slideNum);
                });

                // Insertamos en el DOM
                this.dotsContainer.appendChild(dot);
            });
        },

        // Genera las tarjetas del índice visual dentro del modal
        buildOverviewGrid() {
            // Validamos existencia
            if (!this.overviewGrid) return;
            // Limpiamos tarjetas previas
            this.overviewGrid.innerHTML = '';

            // Iteramos sobre todas las diapositivas
            this.slides.forEach((slide, index) => {
                const slideNum = index + 1;
                const title = slide.getAttribute('data-title') || `Diapositiva ${slideNum}`;

                // Creamos la tarjeta
                const card = document.createElement('div');
                card.className = 'overview-card';
                card.dataset.slideIndex = slideNum;

                // Marcamos como activa si corresponde
                if (slideNum === AppState.currentSlide) {
                    card.classList.add('active');
                }

                // Contenido interno de la tarjeta
                card.innerHTML = `
                    <div class="ov-num">${slideNum}</div>
                    <div class="ov-title">${title}</div>
                `;

                // Evento clic para navegar y cerrar el modal
                card.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(slideNum);
                    this.closeOverview();
                });

                // Agregamos a la rejilla
                this.overviewGrid.appendChild(card);
            });
        },

        // Asocia los eventos de clic y teclado a sus controladores
        bindEvents() {
            // Botón anterior
            if (this.btnPrev) {
                this.btnPrev.addEventListener('click', () => {
                    SoundFX.click();
                    this.prevSlide();
                });
            }

            // Botón siguiente
            if (this.btnNext) {
                this.btnNext.addEventListener('click', () => {
                    SoundFX.click();
                    this.nextSlide();
                });
            }

            // Alternar modo presentación / guía
            if (this.btnGoLab) {
                this.btnGoLab.addEventListener('click', () => {
                    SoundFX.click();
                    this.goToSlide(9);
                });
            }

            if (this.btnToggleMode) {
                this.btnToggleMode.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleViewMode();
                });
            }

            // Alternar sonido
            if (this.btnToggleSound) {
                this.btnToggleSound.addEventListener('click', () => {
                    this.toggleSound();
                });
            }

            // Abrir/cerrar cuadrícula general
            if (this.btnOverview) {
                this.btnOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleOverview();
                });
            }

            // Cerrar modal con botón X
            if (this.btnCloseOverview) {
                this.btnCloseOverview.addEventListener('click', () => {
                    SoundFX.click();
                    this.closeOverview();
                });
            }

            // Cerrar modal haciendo clic fuera de la ventana
            if (this.overviewModal) {
                this.overviewModal.addEventListener('click', (e) => {
                    if (e.target === this.overviewModal) {
                        this.closeOverview();
                    }
                });
            }

            // Pantalla completa
            if (this.btnFullscreen) {
                this.btnFullscreen.addEventListener('click', () => {
                    SoundFX.click();
                    this.toggleFullscreen();
                });
            }

            // Atajos de teclado globales
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        },

        // Gestiona la navegación mediante teclas
        handleKeyDown(e) {
            // Ignoramos si el usuario escribe en un campo de formulario
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            // Evaluamos la tecla pulsada
            switch (e.key) {
                // Avanzar con flecha derecha o D
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.nextSlide();
                    break;

                // Retroceder con flecha izquierda o A
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.prevSlide();
                    break;

                // Avanzar con barra espaciadora
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;

                // Abrir/cerrar cuadrícula con O
                case 'o':
                case 'O':
                    e.preventDefault();
                    this.toggleOverview();
                    break;

                // Pantalla completa con F
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;

                // Cerrar modal con Escape
                case 'Escape':
                    if (AppState.overviewOpen) {
                        this.closeOverview();
                    }
                    break;

                // Ir al inicio con Home
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;

                // Ir al final con End
                case 'End':
                    e.preventDefault();
                    this.goToSlide(AppState.totalSlides);
                    break;

                default:
                    break;
            }
        },

        // Navega a la diapositiva indicada por su número
        goToSlide(index) {
            // Validamos límites
            if (index < 1 || index > AppState.totalSlides) return;
            // Evitamos recarga redundante si ya estamos en ella
            if (index === AppState.currentSlide) return;

            // Guardamos nuevo índice
            AppState.currentSlide = index;
            // Sonido de transición
            SoundFX.slide();
            // Refrescamos interfaz
            this.updateUI();
        },

        // Avanza una diapositiva
        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) {
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        // Retrocede una diapositiva
        prevSlide() {
            if (AppState.currentSlide > 1) {
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        // Cambia entre vista de diapositivas individuales y documento continuo
        toggleViewMode() {
            // Alternamos estado
            AppState.viewMode = AppState.viewMode === 'slides' ? 'guide' : 'slides';

            // Aplicamos clases correspondientes en el body
            if (AppState.viewMode === 'guide') {
                document.body.classList.remove('mode-presentation');
                document.body.classList.add('mode-document');
                if (this.modeText) this.modeText.textContent = 'Modo Diapos';
                if (this.modeIcon) this.modeIcon.textContent = '🖥️';
            } else {
                document.body.classList.remove('mode-document');
                document.body.classList.add('mode-presentation');
                if (this.modeText) this.modeText.textContent = 'Modo Guía';
                if (this.modeIcon) this.modeIcon.textContent = '📑';
            }

            // Sincronizamos visibilidad
            this.updateUI();
        },

        // Activa o desactiva el audio
        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.soundIcon) {
                this.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
            if (AppState.soundEnabled) SoundFX.click();
        },

        // Abre o cierra el modal de índice
        toggleOverview() {
            if (AppState.overviewOpen) {
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        // Abre el modal de vista general
        openOverview() {
            AppState.overviewOpen = true;
            if (this.overviewModal) this.overviewModal.classList.add('active');
            const cards = document.querySelectorAll('.overview-card');
            cards.forEach(card => {
                const idx = parseInt(card.dataset.slideIndex, 10);
                card.classList.toggle('active', idx === AppState.currentSlide);
            });
        },

        // Cierra el modal de vista general
        closeOverview() {
            AppState.overviewOpen = false;
            if (this.overviewModal) this.overviewModal.classList.remove('active');
        },

        // Alterna pantalla completa nativa
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        },

        // Actualiza diapositivas activas, barra de progreso, puntos y botones
        updateUI() {
            // En modo presentación mostramos solo la diapositiva activa
            if (AppState.viewMode === 'slides') {
                this.slides.forEach((slide, index) => {
                    const slideNum = index + 1;
                    if (slideNum === AppState.currentSlide) {
                        slide.classList.add('active');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        slide.classList.remove('active');
                    }
                });
            } else {
                // En modo documento mostramos todas las secciones
                this.slides.forEach(slide => slide.classList.add('active'));
            }

            // Actualizamos barra de progreso
            const percent = ((AppState.currentSlide - 1) / (AppState.totalSlides - 1)) * 100;
            if (this.progressBar) this.progressBar.style.width = `${percent}%`;

            // Actualizamos indicador de texto
            if (this.slideIndicator) {
                this.slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
            }

            // Actualizamos puntos de paginación
            const dots = document.querySelectorAll('.slide-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', (index + 1) === AppState.currentSlide);
            });

            // Deshabilitamos visualmente botones en los extremos
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
       4. CONTROLADOR DEL LABORATORIO INTERACTIVO DE INTERSECTION OBSERVER
       ========================================================================== */
    // Implementa un IntersectionObserver REAL sobre un contenedor scrolleable del DOM
    const IOLabController = {
        // Inicializa referencias, eventos y crea el observador nativo
        init() {
            // Contenedor scrollable que actúa como root del observador
            this.scrollViewport = document.getElementById('ioScrollViewport');
            // Terminal de logs del laboratorio
            this.terminal = document.getElementById('ioLogTerminal');

            // Mapa de los 3 elementos objetivo vigilados y sus elementos de métricas
            this.targets = [
                {
                    el: document.getElementById('ioTarget1'),
                    badge: document.getElementById('badgeIo1'),
                    ratioText: document.getElementById('ratioText1'),
                    ratioBar: document.getElementById('ratioBar1'),
                    name: 'Objetivo #1'
                },
                {
                    el: document.getElementById('ioTarget2'),
                    badge: document.getElementById('badgeIo2'),
                    ratioText: document.getElementById('ratioText2'),
                    ratioBar: document.getElementById('ratioBar2'),
                    name: 'Objetivo #2'
                },
                {
                    el: document.getElementById('ioTarget3'),
                    badge: document.getElementById('badgeIo3'),
                    ratioText: document.getElementById('ratioText3'),
                    ratioBar: document.getElementById('ratioBar3'),
                    name: 'Objetivo #3'
                }
            ];

            // Referencias de botones de configuración de threshold
            this.btnThresh0 = document.getElementById('btnThresh0');
            this.btnThresh05 = document.getElementById('btnThresh05');
            this.btnThresh1 = document.getElementById('btnThresh1');
            this.btnThreshArray = document.getElementById('btnThreshArray');

            // Referencias de botones de configuración de rootMargin
            this.btnMargin0 = document.getElementById('btnMargin0');
            this.btnMarginPos = document.getElementById('btnMarginPos');
            this.btnMarginNeg = document.getElementById('btnMarginNeg');

            // Referencias de botones de utilidad
            this.btnResetScroll = document.getElementById('btnResetScroll');
            this.btnClearLogs = document.getElementById('btnClearIoLogs');

            // Vinculamos los clics de todos los botones del panel
            this.bindControls();
            // Creamos y arrancamos la primera instancia de IntersectionObserver
            this.createObserver();
        },

        // Destruye cualquier observador previo y crea uno nuevo con las opciones activas
        createObserver() {
            // Si ya existe un observador activo, lo desconectamos limpiamente para evitar fugas
            if (AppState.ioLab.observer) {
                AppState.ioLab.observer.disconnect();
            }

            // Validamos que el contenedor root exista en el DOM
            if (!this.scrollViewport || typeof window.IntersectionObserver === 'undefined') return;

            // Construimos el objeto options con el root personalizado y los valores actuales
            const options = {
                // El marco de vigilancia es nuestra caja scrolleable en lugar de toda la ventana
                root: this.scrollViewport,
                // Margen de expansión o contracción configurado por el usuario
                rootMargin: AppState.ioLab.rootMargin,
                // Umbral o arreglo de umbrales configurado por el usuario
                threshold: AppState.ioLab.threshold
            };

            // Instanciamos el IntersectionObserver nativo del navegador
            const observer = new IntersectionObserver((entries) => {
                // Recorremos cada entrada reportada por el motor del navegador
                entries.forEach((entry) => {
                    // Buscamos la metadata visual asociada a este target
                    const item = this.targets.find(t => t.el === entry.target);
                    // Si no se encuentra, continuamos
                    if (!item) return;

                    // Calculamos el porcentaje redondeado de intersección
                    const pct = Math.round(entry.intersectionRatio * 100);

                    // Aplicamos o removemos la clase visual luminosa en la tarjeta objetivo
                    if (entry.isIntersecting) {
                        item.el.classList.add('is-visible');
                        // Reproducimos un sonido sutil de confirmación al entrar
                        SoundFX.intersectEnter();
                    } else {
                        item.el.classList.remove('is-visible');
                    }

                    // Actualizamos el badge booleano de isIntersecting
                    if (item.badge) {
                        item.badge.textContent = `isIntersecting: ${entry.isIntersecting}`;
                        item.badge.className = entry.isIntersecting
                            ? 'io-badge-state is-true'
                            : 'io-badge-state is-false';
                    }

                    // Actualizamos el texto y la barra de progreso de intersectionRatio
                    if (item.ratioText) item.ratioText.textContent = `${pct}%`;
                    if (item.ratioBar) item.ratioBar.style.width = `${pct}%`;

                    // Registramos la transición en el terminal de eventos
                    const estado = entry.isIntersecting ? 'ENTRÓ 🟢' : 'SALIÓ 🔴';
                    this.log(`${estado} ${item.name} -> ratio: ${pct}% (isIntersecting: ${entry.isIntersecting})`);
                });
            }, options);

            // Guardamos la instancia activa en el estado global
            AppState.ioLab.observer = observer;

            // Ponemos bajo vigilancia a cada uno de los 3 elementos objetivo
            this.targets.forEach((item) => {
                if (item.el) {
                    observer.observe(item.el);
                }
            });
        },

        // Vincula los botones interactivos para cambiar options y controlar el scroll
        bindControls() {
            // Función auxiliar para actualizar threshold y reconstruir el observador
            const setThreshold = (value, label) => {
                SoundFX.click();
                AppState.ioLab.threshold = value;
                this.log(`⚙️ Nuevo threshold aplicado: ${label}`);
                this.createObserver();
            };

            // Función auxiliar para actualizar rootMargin y reconstruir el observador
            const setRootMargin = (value) => {
                SoundFX.click();
                AppState.ioLab.rootMargin = value;
                this.log(`📏 Nuevo rootMargin aplicado: "${value}"`);
                this.createObserver();
            };

            // Botones de threshold
            if (this.btnThresh0) this.btnThresh0.addEventListener('click', () => setThreshold(0, '0'));
            if (this.btnThresh05) this.btnThresh05.addEventListener('click', () => setThreshold(0.5, '0.5'));
            if (this.btnThresh1) this.btnThresh1.addEventListener('click', () => setThreshold(1.0, '1.0'));
            if (this.btnThreshArray) this.btnThreshArray.addEventListener('click', () => setThreshold([0, 0.25, 0.5, 0.75, 1], '[0, 0.25, 0.5, 0.75, 1]'));

            // Botones de rootMargin
            if (this.btnMargin0) this.btnMargin0.addEventListener('click', () => setRootMargin('0px'));
            if (this.btnMarginPos) this.btnMarginPos.addEventListener('click', () => setRootMargin('40px'));
            if (this.btnMarginNeg) this.btnMarginNeg.addEventListener('click', () => setRootMargin('-40px'));

            // Botón para devolver la caja scrolleable al tope superior
            if (this.btnResetScroll) {
                this.btnResetScroll.addEventListener('click', () => {
                    SoundFX.click();
                    if (this.scrollViewport) {
                        this.scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
                        this.log('⬆️ Scroll restablecido al inicio.');
                    }
                });
            }

            // Botón para limpiar los registros del terminal
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

        // Añade una línea con marca temporal al terminal del laboratorio
        log(message) {
            // Si no existe terminal en el DOM, salimos
            if (!this.terminal) return;

            // Generamos la hora actual en formato HH:MM:SS
            const now = new Date();
            const timeStr = [
                String(now.getHours()).padStart(2, '0'),
                String(now.getMinutes()).padStart(2, '0'),
                String(now.getSeconds()).padStart(2, '0')
            ].join(':');

            // Creamos el elemento div de la línea
            const line = document.createElement('div');
            line.className = 'io-log-line';

            // Rellenamos con la marca temporal y el mensaje
            line.innerHTML = `
                <span class="io-log-time">[${timeStr}]</span>
                <span>${message}</span>
            `;

            // Insertamos al final del terminal
            this.terminal.appendChild(line);
            // Desplazamos el scroll del terminal automáticamente al último mensaje
            this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    };

    /* ==========================================================================
       5. ARRANQUE DE LA APLICACIÓN (DOM READY)
       ========================================================================== */
    // Función de inicialización general
    function startApplication() {
        // Iniciamos navegación de diapositivas
        SlideNavigation.init();
        // Iniciamos el laboratorio interactivo de Intersection Observer
        IOLabController.init();
    }

    // Verificamos si el DOM ya terminó de cargarse
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApplication);
    } else {
        startApplication();
    }
})();
