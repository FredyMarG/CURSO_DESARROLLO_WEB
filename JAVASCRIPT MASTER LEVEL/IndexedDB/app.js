/**
 * ============================================================================
 * JAVASCRIPT MASTER LEVEL - MÓDULO: INDEXEDDB (BASE DE DATOS NOSQL)
 * ARCHIVO: app.js
 * CONTROLADOR PRINCIPAL DE DIAPOSITIVAS, LABORATORIO INTERACTIVO Y SONIDO
 * Documentación pedagógica LÍNEA POR LÍNEA al 100%
 * ============================================================================
 */

(function () {
    // Activamos el modo estricto de ECMAScript para código riguroso y sin variables implícitas
    'use strict';

    /* ==========================================================================
       1. ESTADO GLOBAL DE LA APLICACIÓN (AppState)
       ========================================================================== */
    // Objeto central que almacena el estado reactivo del visor y los simuladores
    const AppState = {
        // Índice de la diapositiva actualmente visible (1 a 11)
        currentSlide: 1,
        // Cantidad total de diapositivas interactivas
        totalSlides: 11,
        // Modo de visualización activo: 'slides' (presentación) o 'guide' (documento continuo)
        viewMode: 'slides',
        // Estado del sintetizador de audio para efectos sonoros
        soundEnabled: true,
        // Estado del modal de vista general de diapositivas
        overviewOpen: false,

        // Estado del laboratorio interactivo de IndexedDB
        idbLab: {
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
    const SoundFX = {
        // Contexto de audio Web Audio API
        ctx: null,

        // Método para inicializar el contexto de audio con la primera interacción del usuario
        init() {
            // Si el contexto aún no existe y el navegador soporta AudioContext
            if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
                // Creamos una nueva instancia del contexto de audio
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                // Instanciamos el contexto
                this.ctx = new AudioCtx();
            }
        },

        // Sonido suave de transición al cambiar de diapositiva
        slide() {
            // Si el sonido está desactivado o no hay soporte, salimos
            if (!AppState.soundEnabled) return;
            // Inicializamos contexto si es necesario
            this.init();
            // Validamos que el contexto exista
            if (!this.ctx) return;

            // Reanudamos contexto si el navegador lo suspendió por políticas de autoplay
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            // Creamos un oscilador de audio
            const osc = this.ctx.createOscillator();
            // Creamos un nodo de ganancia para controlar el volumen
            const gain = this.ctx.createGain();

            // Configuramos onda senoidal suave
            osc.type = 'sine';
            // Frecuencia inicial en 420 Hz
            osc.frequency.setValueAtTime(420, this.ctx.currentTime);
            // Glissando descendente hasta 280 Hz en 0.12 segundos
            osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);

            // Volumen inicial suave al 6%
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            // Desvanecimiento a silencio en 0.12 segundos
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

            // Conectamos el oscilador al nodo de ganancia
            osc.connect(gain);
            // Conectamos la ganancia a los altavoces
            gain.connect(this.ctx.destination);

            // Iniciamos el sonido en el tiempo actual
            osc.start();
            // Detenemos el oscilador tras 0.13 segundos
            osc.stop(this.ctx.currentTime + 0.13);
        },

        // Sonido de éxito en operaciones de base de datos
        success() {
            // Verificamos si los efectos están habilitados
            if (!AppState.soundEnabled) return;
            // Inicializamos
            this.init();
            // Salimos si no hay contexto
            if (!this.ctx) return;

            // Reanudamos contexto si está suspendido
            if (this.ctx.state === 'suspended') this.ctx.resume();

            // Creamos oscilador
            const osc = this.ctx.createOscillator();
            // Creamos ganancia
            const gain = this.ctx.createGain();

            // Onda triangular con cuerpo
            osc.type = 'triangle';
            // Frecuencia en tono armónico de 523.25 Hz (Do5)
            osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
            // Ascenso armónico a 659.25 Hz (Mi5)
            osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.16);

            // Volumen al 7%
            gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
            // Desvanecimiento
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

            // Conectamos
            osc.connect(gain);
            // Salida a altavoces
            gain.connect(this.ctx.destination);

            // Iniciamos
            osc.start();
            // Detenemos
            osc.stop(this.ctx.currentTime + 0.17);
        }
    };

    /* ==========================================================================
       3. NAVEGACIÓN Y CONTROLADOR DE DIAPOSITIVAS
       ========================================================================== */
    // Controlador de navegación y modo de vista
    const Navigation = {
        // Elementos del DOM cacheados para optimizar rendimiento
        elements: {},

        // Inicialización de selectores del DOM y eventos
        init() {
            // Contenedor principal de la presentación
            this.elements.wrapper = document.getElementById('presentationWrapper');
            // Colección de todas las secciones de diapositivas
            this.elements.slides = document.querySelectorAll('.slide');
            // Barra de progreso de lectura
            this.elements.progressBar = document.getElementById('progressBar');
            // Indicador numérico de diapositiva actual
            this.elements.slideIndicator = document.getElementById('slideIndicator');

            // Botones de la barra de herramientas superior
            this.elements.btnToggleMode = document.getElementById('btnToggleMode');
            this.elements.modeIcon = document.getElementById('modeIcon');
            this.elements.modeText = document.getElementById('modeText');
            this.elements.btnToggleSound = document.getElementById('btnToggleSound');
            this.elements.soundIcon = document.getElementById('soundIcon');
            this.elements.btnOverview = document.getElementById('btnOverview');
            this.elements.btnFullscreen = document.getElementById('btnFullscreen');

            // Botones inferiores flotantes de navegación
            this.elements.btnPrevSlide = document.getElementById('btnPrevSlide');
            this.elements.btnNextSlide = document.getElementById('btnNextSlide');
            this.elements.slideDotsContainer = document.getElementById('slideDotsContainer');

            // Modal de vista general
            this.elements.overviewModal = document.getElementById('overviewModal');
            this.elements.btnCloseOverview = document.getElementById('btnCloseOverview');
            this.elements.overviewGrid = document.getElementById('overviewGrid');

            // Botón inicial de la portada
            this.elements.btnStart = document.getElementById('btnStartPresentation');

            // Construimos los puntos indicadores inferiores
            this.buildSlideDots();
            // Construimos la cuadrícula del modal de visión general
            this.buildOverviewGrid();
            // Registramos los escuchadores de eventos
            this.bindEvents();
            // Renderizamos la diapositiva inicial
            this.renderSlide(AppState.currentSlide, false);
        },

        // Construye las bolitas interactivas para cada diapositiva
        buildSlideDots() {
            if (!this.elements.slideDotsContainer) return;
            this.elements.slideDotsContainer.innerHTML = '';

            for (let i = 1; i <= AppState.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'slide-dot';
                if (i === AppState.currentSlide) dot.classList.add('active');
                dot.setAttribute('title', `Ir a Diapositiva ${i}`);
                dot.addEventListener('click', () => {
                    this.goToSlide(i);
                });
                this.elements.slideDotsContainer.appendChild(dot);
            }
        },

        // Actualiza el punto activo en la barra inferior
        updateSlideDots(activeIdx) {
            if (!this.elements.slideDotsContainer) return;
            const dots = this.elements.slideDotsContainer.querySelectorAll('.slide-dot');
            dots.forEach((dot, idx) => {
                if (idx + 1 === activeIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },

        // Construye las tarjetas en miniatura del modal de vista general
        buildOverviewGrid() {
            if (!this.elements.overviewGrid) return;
            this.elements.overviewGrid.innerHTML = '';

            this.elements.slides.forEach((slide, idx) => {
                const num = idx + 1;
                const title = slide.getAttribute('data-title') || `Diapositiva ${num}`;

                const card = document.createElement('div');
                card.className = 'overview-card';
                card.innerHTML = `
                    <div class="overview-card-header">
                        <span class="overview-card-num">#${num}</span>
                    </div>
                    <div class="overview-card-title">${title}</div>
                `;

                card.addEventListener('click', () => {
                    this.goToSlide(num);
                    this.closeOverview();
                });

                this.elements.overviewGrid.appendChild(card);
            });
        },

        // Vinculación de eventos de interfaz y teclado
        bindEvents() {
            // Teclado para navegación con flechas, espacio y teclas de acceso rápido
            document.addEventListener('keydown', (e) => {
                // Si el foco está en un campo de texto interactivo, no interceptamos teclas
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                    return;
                }

                // Flecha derecha o barra espaciadora para avanzar
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault();
                    this.nextSlide();
                // Flecha izquierda para retroceder
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                // Tecla 'O' para alternar la cuadrícula general de diapositivas
                } else if (e.key === 'o' || e.key === 'O') {
                    e.preventDefault();
                    this.toggleOverview();
                // Tecla 'Escape' para cerrar modal si está abierto
                } else if (e.key === 'Escape') {
                    if (AppState.overviewOpen) {
                        this.closeOverview();
                    }
                // Tecla 'F' para pantalla completa
                } else if (e.key === 'f' || e.key === 'F') {
                    e.preventDefault();
                    this.toggleFullscreen();
                // Tecla 'M' para alternar sonido
                } else if (e.key === 'm' || e.key === 'M') {
                    e.preventDefault();
                    this.toggleSound();
                }
            });

            // Botón iniciar presentación en la portada
            if (this.elements.btnStart) {
                this.elements.btnStart.addEventListener('click', () => {
                    this.goToSlide(2);
                });
            }

            // Botón anterior en la barra inferior
            if (this.elements.btnPrevSlide) {
                this.elements.btnPrevSlide.addEventListener('click', () => {
                    this.prevSlide();
                });
            }

            // Botón siguiente en la barra inferior
            if (this.elements.btnNextSlide) {
                this.elements.btnNextSlide.addEventListener('click', () => {
                    this.nextSlide();
                });
            }

            // Botón abrir visión general
            if (this.elements.btnOverview) {
                this.elements.btnOverview.addEventListener('click', () => {
                    this.toggleOverview();
                });
            }

            // Botón cerrar visión general
            if (this.elements.btnCloseOverview) {
                this.elements.btnCloseOverview.addEventListener('click', () => {
                    this.closeOverview();
                });
            }

            // Cerrar modal al hacer clic en el fondo oscuro
            if (this.elements.overviewModal) {
                this.elements.overviewModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.overviewModal) {
                        this.closeOverview();
                    }
                });
            }

            // Botones interactivos con atributo data-jump para saltos directos
            document.querySelectorAll('[data-jump]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(btn.getAttribute('data-jump'), 10);
                    if (!isNaN(targetIndex)) {
                        this.goToSlide(targetIndex);
                    }
                });
            });

            // Botón para alternar entre modo diapositivas y modo guía continua
            if (this.elements.btnToggleMode) {
                this.elements.btnToggleMode.addEventListener('click', () => {
                    this.toggleViewMode();
                });
            }

            // Botón para activar o silenciar audio
            if (this.elements.btnToggleSound) {
                this.elements.btnToggleSound.addEventListener('click', () => {
                    this.toggleSound();
                });
            }

            // Botón para pantalla completa
            if (this.elements.btnFullscreen) {
                this.elements.btnFullscreen.addEventListener('click', () => {
                    this.toggleFullscreen();
                });
            }
        },

        // Cambiar a una diapositiva específica
        goToSlide(index, playSound = true) {
            // Validamos que el índice esté dentro del rango permitido
            if (index < 1) index = 1;
            if (index > AppState.totalSlides) index = AppState.totalSlides;

            // Si es la misma diapositiva, no hacemos nada
            if (AppState.currentSlide === index && AppState.viewMode === 'slides') return;

            // Actualizamos el estado
            AppState.currentSlide = index;
            // Renderizamos la diapositiva en pantalla
            this.renderSlide(index, playSound);
        },

        // Avanzar a la siguiente diapositiva
        nextSlide() {
            if (AppState.currentSlide < AppState.totalSlides) {
                this.goToSlide(AppState.currentSlide + 1);
            }
        },

        // Retroceder a la diapositiva anterior
        prevSlide() {
            if (AppState.currentSlide > 1) {
                this.goToSlide(AppState.currentSlide - 1);
            }
        },

        // Renderizado visual de la diapositiva activa
        renderSlide(index, playSound = true) {
            // Reproducimos efecto de sonido si corresponde
            if (playSound) SoundFX.slide();

            // Si estamos en modo presentación
            if (AppState.viewMode === 'slides') {
                // Recorremos todas las diapositivas
                this.elements.slides.forEach((slide, i) => {
                    // Calculamos el índice base 1
                    const slideIndex = i + 1;
                    // Removemos clases activas previas
                    slide.classList.remove('active', 'prev', 'next');

                    // Asignamos clase 'active' a la diapositiva actual
                    if (slideIndex === index) {
                        slide.classList.add('active');
                        // Aseguramos scroll superior
                        slide.scrollTop = 0;
                    // Diapositivas anteriores
                    } else if (slideIndex < index) {
                        slide.classList.add('prev');
                    // Diapositivas siguientes
                    } else {
                        slide.classList.add('next');
                    }
                });
            }

            // Actualizamos los puntos inferiores
            this.updateSlideDots(index);

            // Actualizamos la barra de progreso
            if (this.elements.progressBar) {
                const percent = ((index - 1) / (AppState.totalSlides - 1)) * 100;
                this.elements.progressBar.style.width = `${percent}%`;
            }

            // Actualizamos el indicador de texto
            if (this.elements.slideIndicator) {
                this.elements.slideIndicator.textContent = `${index} / ${AppState.totalSlides}`;
            }
        },

        // Abrir/cerrar modal de índice rápido
        toggleOverview() {
            if (AppState.overviewOpen) {
                this.closeOverview();
            } else {
                this.openOverview();
            }
        },

        openOverview() {
            AppState.overviewOpen = true;
            if (this.elements.overviewModal) {
                this.elements.overviewModal.classList.add('active');
            }
        },

        closeOverview() {
            AppState.overviewOpen = false;
            if (this.elements.overviewModal) {
                this.elements.overviewModal.classList.remove('active');
            }
        },

        // Alternar entre modo diapositivas y modo guía continua
        toggleViewMode() {
            if (AppState.viewMode === 'slides') {
                AppState.viewMode = 'guide';
                document.body.classList.remove('mode-presentation');
                document.body.classList.add('mode-document');
                if (this.elements.modeIcon) this.elements.modeIcon.textContent = '📑';
                if (this.elements.modeText) this.elements.modeText.textContent = 'Modo Diapos';
            } else {
                AppState.viewMode = 'slides';
                document.body.classList.remove('mode-document');
                document.body.classList.add('mode-presentation');
                if (this.elements.modeIcon) this.elements.modeIcon.textContent = '🖥️';
                if (this.elements.modeText) this.elements.modeText.textContent = 'Modo Guía';
                this.renderSlide(AppState.currentSlide, false);
            }
        },

        // Alternar silencio o sonido
        toggleSound() {
            AppState.soundEnabled = !AppState.soundEnabled;
            if (this.elements.soundIcon) {
                this.elements.soundIcon.textContent = AppState.soundEnabled ? '🔊' : '🔇';
            }
        },

        // Alternar pantalla completa
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                }
            }
        }
    };

    /* ==========================================================================
       4. LABORATORIO INTERACTIVO DE INDEXEDDB (CRUD EN VIVO)
       ========================================================================== */
    // Motor que conecta con la API nativa de IndexedDB para el laboratorio de la Diapositiva 10
    const IDBLabController = {
        // Inicialización del laboratorio
        init() {
            // Conectamos y abrimos la base de datos del laboratorio
            this.abrirBaseDeDatos();
            // Vinculamos botones de la interfaz
            this.bindControls();
        },

        // Abre la base de datos nativa con almacén 'usuarios'
        abrirBaseDeDatos() {
            // Validamos que el navegador soporte IndexedDB
            if (!('indexedDB' in window)) {
                this.log('❌ IndexedDB no es compatible con este navegador.');
                return;
            }

            // Solicitud de apertura
            const request = window.indexedDB.open(AppState.idbLab.dbName, AppState.idbLab.version);

            // Evento upgradeneeded para crear almacén
            request.addEventListener('upgradeneeded', (e) => {
                const db = e.target.result;
                this.log("🛠️ Evento 'upgradeneeded': Inicializando Object Store 'usuarios'...");

                if (!db.objectStoreNames.contains(AppState.idbLab.storeName)) {
                    // Creamos con clave autoincremental
                    db.createObjectStore(AppState.idbLab.storeName, { autoIncrement: true });
                    this.log("  ↳ Object Store 'usuarios' creado con { autoIncrement: true }.");
                }
            });

            // Evento success
            request.addEventListener('success', (e) => {
                AppState.idbLab.dbInstance = e.target.result;
                this.log(`✅ Base de datos '${AppState.idbLab.dbName}' abierta con éxito.`);
                // Cargamos registros iniciales si está vacía
                this.inicializarRegistrosSiVacia();
            });

            // Evento error
            request.addEventListener('error', (e) => {
                this.log(`❌ Error al abrir IndexedDB: ${e.target.error}`);
            });
        },

        // Escribe una línea en el terminal visual del laboratorio
        log(mensaje) {
            const terminal = document.getElementById('idbLogTerminal');
            if (!terminal) return;

            const ahora = new Date();
            const tiempo = ahora.toTimeString().split(' ')[0];

            const linea = document.createElement('div');
            linea.className = 'idb-log-line';
            linea.innerHTML = `<span class="idb-log-time">[${tiempo}]</span> ${mensaje}`;

            terminal.appendChild(linea);
            terminal.scrollTop = terminal.scrollHeight;
        },

        // Si la base está vacía, inserta 2 registros de muestra
        inicializarRegistrosSiVacia() {
            const db = AppState.idbLab.dbInstance;
            if (!db) return;

            const tx = db.transaction(AppState.idbLab.storeName, 'readonly');
            const store = tx.objectStore(AppState.idbLab.storeName);
            const countReq = store.count();

            countReq.onsuccess = () => {
                if (countReq.result === 0) {
                    this.log('ℹ️ Base vacía: insertando registros de ejemplo...');
                    this.insertarRegistroDirecto({ nombre: 'Fredy Developer', rol: 'Tech Lead', nivel: 'Master' }, () => {
                        this.insertarRegistroDirecto({ nombre: 'Ana Gómez', rol: 'Frontend Architect', nivel: 'Senior' }, () => {
                            this.refrescarTabla();
                        });
                    });
                } else {
                    this.refrescarTabla();
                }
            };
        },

        // Inserción directa de registro
        insertarRegistroDirecto(objeto, callback) {
            const db = AppState.idbLab.dbInstance;
            if (!db) return;

            const tx = db.transaction(AppState.idbLab.storeName, 'readwrite');
            const store = tx.objectStore(AppState.idbLab.storeName);
            const req = store.add(objeto);

            req.onsuccess = () => {
                if (callback) callback(req.result);
            };
        },

        // Refresca la tabla del DOM leyendo con cursor
        refrescarTabla() {
            const db = AppState.idbLab.dbInstance;
            const tbody = document.getElementById('idbTableBody');
            const badgeCount = document.getElementById('idbRecordCount');
            if (!db || !tbody) return;

            tbody.innerHTML = '';
            const lista = [];

            const tx = db.transaction(AppState.idbLab.storeName, 'readonly');
            const store = tx.objectStore(AppState.idbLab.storeName);
            const cursorReq = store.openCursor();

            cursorReq.addEventListener('success', (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    lista.push({ key: cursor.key, val: cursor.value });
                    cursor.continue();
                } else {
                    AppState.idbLab.registros = lista;
                    if (badgeCount) badgeCount.textContent = `${lista.length} registros`;

                    if (lista.length === 0) {
                        tbody.innerHTML = `<tr><td colspan="5" class="idb-table-empty">El almacén 'usuarios' está vacío. Utiliza el formulario superior para agregar registros.</td></tr>`;
                    } else {
                        lista.forEach(item => {
                            const tr = document.createElement('tr');
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
                            tbody.appendChild(tr);
                        });

                        // Eventos para botones de borrado individual
                        tbody.querySelectorAll('[data-del]').forEach(btn => {
                            btn.addEventListener('click', () => {
                                const k = parseInt(btn.getAttribute('data-del'), 10);
                                this.eliminarRegistro(k);
                            });
                        });
                    }
                }
            });
        },

        // Elimina un registro por clave
        eliminarRegistro(key) {
            const db = AppState.idbLab.dbInstance;
            if (!db) return;

            const tx = db.transaction(AppState.idbLab.storeName, 'readwrite');
            const store = tx.objectStore(AppState.idbLab.storeName);
            const req = store.delete(key);

            req.onsuccess = () => {
                SoundFX.success();
                this.log(`🗑️ [deleteObjeto] Registro con clave #${key} eliminado.`);
                this.refrescarTabla();
            };
        },

        // Vincula controles interactivos
        bindControls() {
            const btnAdd = document.getElementById('idbBtnAdd');
            const btnRefresh = document.getElementById('idbBtnRefresh');
            const btnClear = document.getElementById('idbBtnClear');

            const inputNombre = document.getElementById('idbInputNombre');
            const inputRol = document.getElementById('idbInputRol');
            const inputNivel = document.getElementById('idbInputNivel');

            // Agregar registro
            if (btnAdd) {
                btnAdd.addEventListener('click', (e) => {
                    e.preventDefault();
                    const nombre = inputNombre ? inputNombre.value.trim() : '';
                    const rol = inputRol ? inputRol.value.trim() : '';
                    const nivel = inputNivel ? inputNivel.value.trim() : '';

                    if (!nombre) {
                        alert('Por favor introduce un nombre para el registro.');
                        return;
                    }

                    const nuevo = { nombre, rol: rol || 'Desarrollador', nivel: nivel || 'Master' };
                    this.insertarRegistroDirecto(nuevo, (keyGenerada) => {
                        SoundFX.success();
                        this.log(`🟢 [addObjeto] Registro agregado con clave autoincremental: #${keyGenerada}`);
                        if (inputNombre) inputNombre.value = '';
                        if (inputRol) inputRol.value = '';
                        this.refrescarTabla();
                    });
                });
            }

            // Refrescar lista con cursor
            if (btnRefresh) {
                btnRefresh.addEventListener('click', () => {
                    this.log("🔄 [leerObjetos] Recorriendo almacén con openCursor()...");
                    this.refrescarTabla();
                });
            }

            // Vaciar almacén con .clear()
            if (btnClear) {
                btnClear.addEventListener('click', () => {
                    if (!confirm("¿Deseas vaciar todos los registros del almacén 'usuarios'?")) return;
                    const db = AppState.idbLab.dbInstance;
                    if (!db) return;

                    const tx = db.transaction(AppState.idbLab.storeName, 'readwrite');
                    tx.objectStore(AppState.idbLab.storeName).clear().onsuccess = () => {
                        this.log("🧹 [clear] Almacén de objetos vaciado completamente.");
                        this.refrescarTabla();
                    };
                });
            }
        }
    };

    /* ==========================================================================
       5. ARRANQUE DEL APLICATIVO
       ========================================================================== */
    // Inicialización al cargar el DOM completo
    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
        IDBLabController.init();
    });

})();
