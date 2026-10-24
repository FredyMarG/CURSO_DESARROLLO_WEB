// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Objeto que almacena el estado reactivo de la presentación y configuraciones del usuario
const AppState = {
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación
    totalSlides: 10,
    // Booleano: true para modo diapositivas (slides), false para modo documento continuo
    isPresentationMode: true,
    // Booleano: true si los efectos de sonido sintetizados están activos
    soundEnabled: true,
    // Almacena la instancia de AudioContext para la síntesis de sonido en el navegador
    audioCtx: null
};

// --- MÓDULO DE EFECTOS DE SONIDO SINTETIZADOS (Web Audio API) ---
// Clase estática que genera efectos de sonido procedimentales sin requerir archivos mp3 externos
class SoundEffects {
    // Inicializa el contexto de audio únicamente cuando el usuario interactúa (requerido por políticas de navegadores)
    static init() {
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            // Instancia un nuevo contexto de audio
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return;

        try {
            // Aseguramos que el AudioContext esté inicializado
            this.init();
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return;

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === 'suspended') {
                AppState.audioCtx.resume();
            }

            // Creamos un nodo oscilador para emitir la onda de sonido
            const osc = AppState.audioCtx.createOscillator();
            // Creamos un nodo de ganancia para controlar el volumen del sonido
            const gain = AppState.audioCtx.createGain();

            // Asignamos el tipo de onda ('sine', 'triangle', 'sawtooth', 'square')
            osc.type = type;
            // Fijamos la frecuencia en hercios en el tiempo actual del contexto
            osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime);

            // Fijamos el volumen inicial en el tiempo actual
            gain.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime);
            // Realizamos un desvanecimiento exponencial (fade out) hacia cero para evitar chasquidos de audio
            gain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + duration);

            // Conectamos el oscilador a la ganancia de volumen
            osc.connect(gain);
            // Conectamos la ganancia a la salida de audio (altavoces del usuario)
            gain.connect(AppState.audioCtx.destination);

            // Iniciamos la oscilación sonora inmediatamente
            osc.start();
            // Detenemos la oscilación al completarse la duración especificada
            osc.stop(AppState.audioCtx.currentTime + duration);
        } catch (e) {
            // Manejo silencioso en caso de bloqueo de políticas de autoplay
        }
    }

    // Sonido sutil de clic de interfaz (onda triangular de 600Hz y 40ms)
    static click() {
        this.playTone(600, 'triangle', 0.04, 0.03);
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() {
        // Nota C5 (523.25 Hz)
        this.playTone(523.25, 'sine', 0.1, 0.05);
        // Nota E5 (659.25 Hz) con retardo de 80ms
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80);
        // Nota G5 (783.99 Hz) con retardo de 160ms
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160);
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() {
        // Tono bajo de 320 Hz
        this.playTone(320, 'sine', 0.06, 0.03);
        // Tono medio de 480 Hz con ligero desfase
        setTimeout(() => this.playTone(480, 'sine', 0.08, 0.03), 40);
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static alert() {
        this.playTone(280, 'sawtooth', 0.15, 0.04);
    }
}

// --- MÓDULO DE TOAST NOTIFICATIONS (Alertas flotantes) ---
// Muestra una notificación temporal en la esquina inferior con un mensaje y un icono
function showToast(message, icon = "✔") {
    // Obtenemos el elemento contenedor de la notificación
    const toast = document.getElementById("toastNotification");
    // Obtenemos el contenedor de texto de la notificación
    const toastMsg = document.getElementById("toastMsg");
    // Obtenemos el contenedor del icono de la notificación
    const toastIcon = document.getElementById("toastIcon");

    // Si los elementos no existen en el DOM, cancelamos
    if (!toast || !toastMsg) return;

    // Asignamos el mensaje recibido
    toastMsg.textContent = message;
    // Si existe el icono, asignamos el emoji o símbolo correspondiente
    if (toastIcon) toastIcon.textContent = icon;

    // Agregamos la clase .active para activar la animación de entrada
    toast.classList.add("active");
    // Cancelamos cualquier temporizador previo si se disparan varios toasts seguidos
    clearTimeout(toast._timeout);
    // Programamos la desaparición automática tras 2.8 segundos (2800 ms)
    toast._timeout = setTimeout(() => {
        toast.classList.remove("active");
    }, 2800);
}

// --- MÓDULO DE CONTROLADOR DE PRESENTACIÓN ---
// Gestiona el ciclo de vida de las diapositivas, transiciones, teclado y controles
class PresentationController {
    // Inicialización del controlador de presentación
    static init() {
        // Seleccionamos todas las etiquetas con clase .slide
        this.slides = document.querySelectorAll(".slide");
        // Actualizamos la cantidad total de diapositivas detectadas
        AppState.totalSlides = this.slides.length;

        // Generamos dinámicamente las bolitas indicadoras inferiores
        this.renderDots();
        // Generamos la cuadrícula del modal de visión general
        this.renderOverview();
        // Posicionamos la presentación en la diapositiva 1 sin reproducir audio al inicio
        this.goToSlide(1, false);
        // Asociamos los escuchadores de eventos (botones, clics y teclado)
        this.bindEvents();
    }

    // Renderiza dinámicamente los puntos de navegación en el dock inferior
    static renderDots() {
        // Obtenemos el contenedor de puntos del DOM
        const container = document.getElementById("slideDotsContainer");
        // Verificamos existencia
        if (!container) return;
        // Limpiamos el contenido previo
        container.innerHTML = "";

        // Iteramos desde la diapositiva 1 hasta la última
        for (let i = 1; i <= AppState.totalSlides; i++) {
            // Creamos un nuevo elemento div
            const dot = document.createElement("div");
            // Le asignamos la clase base y la clase active al primer punto
            dot.className = `slide-dot ${i === 1 ? "active" : ""}`;
            // Texto descriptivo accesible para hover
            dot.title = `Diapositiva ${i}`;
            // Agregamos evento de clic para saltar a la diapositiva correspondiente
            dot.addEventListener("click", () => {
                SoundEffects.click();
                this.goToSlide(i);
            });
            // Añadimos el punto al contenedor en el DOM
            container.appendChild(dot);
        }
    }

    // Renderiza la lista de miniaturas en el modal de vista panorámica (Overview)
    static renderOverview() {
        // Obtenemos la rejilla del modal
        const grid = document.getElementById("overviewGrid");
        // Validamos existencia
        if (!grid) return;
        // Vaciamos contenido
        grid.innerHTML = "";

        // Recorremos cada diapositiva
        this.slides.forEach((slide, index) => {
            // Calculamos el número de diapositiva (base 1)
            const num = index + 1;
            // Leemos el título del atributo data-title o ponemos uno por defecto
            const title = slide.getAttribute("data-title") || `Diapositiva ${num}`;
            // Creamos el div contenedor de la miniatura
            const thumb = document.createElement("div");
            // Marcamos con clase .current si es la diapositiva actual
            thumb.className = `overview-thumb ${num === AppState.currentSlide ? "current" : ""}`;
            // Inyectamos el HTML con el número formateado a dos dígitos y su título
            thumb.innerHTML = `
                <span class="thumb-num">0${num}</span>
                <span class="thumb-title">${title}</span>
            `;
            // Al hacer clic en una miniatura, viajamos a esa diapositiva y cerramos el modal
            thumb.addEventListener("click", () => {
                SoundEffects.click();
                this.goToSlide(num);
                this.closeOverview();
            });
            // Insertamos la miniatura en la cuadrícula
            grid.appendChild(thumb);
        });
    }

    // Navega a un número específico de diapositiva
    static goToSlide(slideNum, playSound = true) {
        // Validamos que el número esté dentro del rango permitido
        if (slideNum < 1 || slideNum > AppState.totalSlides) return;

        // Actualizamos el número actual en el estado global
        AppState.currentSlide = slideNum;

        // Recorremos las diapositivas para encender solo la activa
        this.slides.forEach((slide) => {
            // Obtenemos el número asignado a esta diapositiva
            const currentNum = parseInt(slide.getAttribute("data-slide"), 10);
            // Si coincide con la seleccionada, añadimos .active
            if (currentNum === slideNum) {
                slide.classList.add("active");
            } else {
                // De lo contrario, removemos .active para ocultarla
                slide.classList.remove("active");
            }
        });

        // Obtenemos los elementos de la barra de progreso superior
        const progressBar = document.getElementById("progressBar");
        const slideIndicator = document.getElementById("slideIndicator");
        // Calculamos el porcentaje completado
        const percentage = (slideNum / AppState.totalSlides) * 100;

        // Actualizamos el ancho visual de la barra de progreso
        if (progressBar) progressBar.style.width = `${percentage}%`;
        // Actualizamos el texto del contador de diapositivas
        if (slideIndicator) slideIndicator.textContent = `${slideNum} / ${AppState.totalSlides}`;

        // Sincronizamos las bolitas del dock inferior
        const dots = document.querySelectorAll(".slide-dot");
        dots.forEach((dot, idx) => {
            // Si el índice coincide, activamos el punto
            if (idx + 1 === slideNum) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Hacemos scroll suave al inicio de la página para buena lectura
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Si se solicitó sonido, reproducimos la transición
        if (playSound) SoundEffects.transition();

        // Si el usuario está en Modo Documento (todas visibles), desplazamos la pantalla hasta la sección correspondiente
        if (!AppState.isPresentationMode) {
            const targetSlide = document.getElementById(`slide-${slideNum}`);
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    // Avanza a la siguiente diapositiva
    static nextSlide() {
        // Comprobamos si no estamos en la última
        if (AppState.currentSlide < AppState.totalSlides) {
            this.goToSlide(AppState.currentSlide + 1);
        } else {
            // Si ya estamos en la última, emitimos alerta y mensaje
            SoundEffects.alert();
            showToast("Estás en la última diapositiva", "ℹ️");
        }
    }

    // Retrocede a la diapositiva anterior
    static prevSlide() {
        // Comprobamos si no estamos en la primera
        if (AppState.currentSlide > 1) {
            this.goToSlide(AppState.currentSlide - 1);
        } else {
            // Si ya estamos en la primera, alertamos
            SoundEffects.alert();
            showToast("Estás en el inicio de la presentación", "ℹ️");
        }
    }

    // Alterna entre el modo Presentación (Diapositivas) y el modo Guía (Documento corrido)
    static toggleMode() {
        // Invertimos el valor booleano
        AppState.isPresentationMode = !AppState.isPresentationMode;
        // Obtenemos los elementos de texto e icono del botón de cambio
        const modeText = document.getElementById("modeText");
        const modeIcon = document.getElementById("modeIcon");

        // Si regresamos al modo presentación
        if (AppState.isPresentationMode) {
            document.body.classList.remove("mode-document");
            document.body.classList.add("mode-presentation");
            if (modeText) modeText.textContent = "Modo Guía";
            if (modeIcon) modeIcon.textContent = "📑";
            this.goToSlide(AppState.currentSlide, false);
            showToast("Cambiado a Modo Presentación Interactiva (Diapositivas)", "🖥️");
        } else {
            // Si pasamos al modo documento corrido
            document.body.classList.remove("mode-presentation");
            document.body.classList.add("mode-document");
            if (modeText) modeText.textContent = "Modo Slides";
            if (modeIcon) modeIcon.textContent = "📽️";
            showToast("Cambiado a Modo Guía Completa de Estudio", "📖");
        }
        // Reproducimos clic
        SoundEffects.click();
    }

    // Abre el modal panorámico de diapositivas
    static openOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            // Volvemos a sincronizar la miniatura activa
            this.renderOverview();
            // Mostramos el modal añadiendo .active
            modal.classList.add("active");
            SoundEffects.click();
        }
    }

    // Cierra el modal panorámico
    static closeOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            modal.classList.remove("active");
        }
    }

    // Alterna pantalla completa (Fullscreen)
    static toggleFullscreen() {
        SoundEffects.click();
        // Si no hay elemento en fullscreen actualmente
        if (!document.fullscreenElement) {
            // Solicitamos pantalla completa para todo el documento
            document.documentElement.requestFullscreen().catch(() => {});
            showToast("Pantalla Completa Activada", "⛶");
        } else {
            // Si ya estaba en pantalla completa, salimos
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
            showToast("Pantalla Completa Desactivada", "⛶");
        }
    }

    // Asocia los eventos de la interfaz
    static bindEvents() {
        // Botón Siguiente del dock
        const btnNext = document.getElementById("btnNextSlide");
        // Botón Anterior del dock
        const btnPrev = document.getElementById("btnPrevSlide");
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide());
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide());

        // Botones de acción de la barra superior
        const btnToggleMode = document.getElementById("btnToggleMode");
        const btnToggleSound = document.getElementById("btnToggleSound");
        const btnOverview = document.getElementById("btnOverview");
        const btnFullscreen = document.getElementById("btnFullscreen");
        const btnCloseOverview = document.getElementById("btnCloseOverview");

        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode());

        // Manejo del botón de sonido
        if (btnToggleSound) {
            btnToggleSound.addEventListener("click", () => {
                // Invertimos el estado de sonido
                AppState.soundEnabled = !AppState.soundEnabled;
                const icon = document.getElementById("soundIcon");
                // Actualizamos el icono a parlante encendido o silenciado
                if (icon) icon.textContent = AppState.soundEnabled ? "🔊" : "🔇";
                showToast(AppState.soundEnabled ? "Audio Activado" : "Audio Silenciado", AppState.soundEnabled ? "🔊" : "🔇");
                if (AppState.soundEnabled) SoundEffects.click();
            });
        }

        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview());
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview());
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

        // Botón principal de la portada "Iniciar Presentación Interactiva"
        const btnStart = document.getElementById("btnStartPresentation");
        if (btnStart) {
            btnStart.addEventListener("click", () => {
                SoundEffects.click();
                // Salta a la diapositiva 2 (¿Qué es un Prototipo?)
                this.goToSlide(2);
            });
        }

        // Mini tarjetas de la portada con atributo data-jump
        document.querySelectorAll("[data-jump]").forEach((item) => {
            item.addEventListener("click", () => {
                const target = parseInt(item.getAttribute("data-jump"), 10);
                if (target) {
                    SoundEffects.click();
                    this.goToSlide(target);
                }
            });
        });

        // Botón "Volver al Inicio" en la diapositiva de resumen
        const btnRestart = document.getElementById("btnRestartPresentation");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                SoundEffects.click();
                this.goToSlide(1);
            });
        }

        // Escuchador global de teclado para atajos y navegación
        window.addEventListener("keydown", (e) => {
            // Si el usuario está escribiendo código en el textarea, no cambiamos de diapositiva
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
                // Atajo especial en el editor: Ctrl + Enter ejecuta el código
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    PlaygroundManager.runCode();
                }
                return;
            }

            // Atajos de navegación general
            switch (e.key) {
                // Flecha derecha, D o barra espaciadora avanzan
                case "ArrowRight":
                case "d":
                case "D":
                case " ":
                    e.preventDefault();
                    this.nextSlide();
                    break;
                // Flecha izquierda o A retroceden
                case "ArrowLeft":
                case "a":
                case "A":
                    e.preventDefault();
                    this.prevSlide();
                    break;
                // Tecla 'O' abre o cierra la vista general de miniaturas
                case "o":
                case "O":
                    e.preventDefault();
                    const modal = document.getElementById("overviewModal");
                    if (modal && modal.classList.contains("active")) {
                        this.closeOverview();
                    } else {
                        this.openOverview();
                    }
                    break;
                // Tecla 'F' alterna pantalla completa
                case "f":
                case "F":
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                // Tecla 'M' alterna el modo de vista (Slides vs Guía)
                case "m":
                case "M":
                    e.preventDefault();
                    this.toggleMode();
                    break;
                // Tecla Escape cierra el modal si está abierto
                case "Escape":
                    this.closeOverview();
                    break;
            }
        });

        // Si el usuario hace clic fuera de la ventana del modal, se cierra
        const modalOverlay = document.getElementById("overviewModal");
        if (modalOverlay) {
            modalOverlay.addEventListener("click", (e) => {
                if (e.target === modalOverlay) this.closeOverview();
            });
        }
    }
}

// --- MÓDULO 1: DEMOSTRACIÓN DE PROTOTIPO BÁSICO (SLIDE 2) ---
function initSlide2Demo() {
    // Obtenemos el botón para probar el prototipo básico
    const btnTest = document.getElementById("btnTestProtoBasic");
    // Obtenemos la mini consola de salida
    const consoleOut = document.getElementById("console-output-1");
    // Obtenemos la etiqueta de estado de ejecución
    const status = document.getElementById("testProtoBasicStatus");

    // Validamos existencia en el DOM
    if (!btnTest || !consoleOut) return;

    // Al hacer clic en el botón de prueba
    btnTest.addEventListener("click", () => {
        SoundEffects.click();

        // 1. Creamos un objeto literal simple
        const usuario = { nombre: "Carlos" };
        // 2. Leemos su prototipo oculto mediante el estándar Object.getPrototypeOf()
        const proto = Object.getPrototypeOf(usuario);
        // 3. Comprobamos si su prototipo coincide con el prototipo base universal de JS
        const esObjectPrototype = proto === Object.prototype;

        // Mostramos el resultado paso a paso con colores en la mini consola
        consoleOut.innerHTML = `
            <div><span style="color:#64748b">&gt;</span> <span style="color:#a78bfa">usuario.toString():</span> "${usuario.toString()}"</div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#38bdf8">Object.getPrototypeOf(usuario) === Object.prototype:</span> <strong style="color:#34d399">${esObjectPrototype}</strong></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#fcd34d">Métodos encontrados en el prototipo raíz:</span> [toString, hasOwnProperty, isPrototypeOf, valueOf, ...]</div>
        `;

        // Actualizamos el estado con color verde de éxito
        if (status) {
            status.textContent = "✔ Ejecutado con éxito";
            status.style.color = "#34d399";
        }
        // Reproducimos acorde de éxito
        SoundEffects.success();
    });

    // Añadimos la funcionalidad de copiar código al portapapeles en los botones correspondientes
    document.querySelectorAll(".btn-copy-code").forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const codeEl = document.getElementById(targetId);
            if (codeEl) {
                // Copiamos el texto al portapapeles del sistema
                navigator.clipboard.writeText(codeEl.innerText).then(() => {
                    btn.textContent = "¡Copiado!";
                    SoundEffects.success();
                    showToast("Código copiado al portapapeles", "📋");
                    // Restauramos el texto original tras 2 segundos
                    setTimeout(() => { btn.textContent = "Copiar"; }, 2000);
                });
            }
        });
    });
}

// --- MÓDULO 2: COMPARADOR DE IDENTIDAD EN MEMORIA (SLIDE 3) ---
function initSlide3Demo() {
    // Obtenemos el botón para verificar la igualdad referencial de prototipos
    const btnCheck = document.getElementById("btnCheckIdentity");
    // Obtenemos la caja de resultado
    const resultBox = document.getElementById("identityResult");

    if (!btnCheck || !resultBox) return;

    btnCheck.addEventListener("click", () => {
        // Función constructora Automovil
        function Automovil(marca) {
            this.marca = marca;
        }
        // Asignamos el método en Automovil.prototype
        Automovil.prototype.encender = function() {
            return `Auto ${this.marca} listo`;
        };

        // Creamos una nueva instancia miAuto
        const miAuto = new Automovil("Toyota");
        // Obtenemos el prototipo real de la instancia creada
        const protoInstancia = Object.getPrototypeOf(miAuto);
        // Tomamos el Prototype Object del molde constructor
        const protoConstructor = Automovil.prototype;
        // Comprobamos con igualdad estricta (===) si ambas variables apuntan al mismo espacio físico de RAM
        const sonIdenticos = protoInstancia === protoConstructor;

        // Pintamos el resultado explicativo
        resultBox.innerHTML = `
            <span style="color:#34d399; font-weight:700;">¡IDENTIDAD CONFIRMADA! (true)</span><br>
            Ambos apuntan exactamente a la misma posición física de memoria en RAM.<br>
            <code>miAuto.__proto__ === Automovil.prototype</code> es <strong>${sonIdenticos}</strong>.
        `;
        SoundEffects.success();
    });
}

// --- MÓDULO 3: SIMULADOR DE PROTOTYPE CHAIN (SLIDE 4) ---
class PrototypeChainSimulator {
    static init() {
        // Propiedad que se buscará por defecto
        this.currentProp = "nombre";
        // Bandera para evitar ejecuciones concurrentes mientras corre la animación
        this.isAnimating = false;

        // Botones de propiedades seleccionables
        this.propButtons = document.querySelectorAll(".sim-prop-btn");
        // Botón de ejecución de la simulación
        this.btnRun = document.getElementById("btnRunChainSimulation");
        // Contenedor de texto de explicación en vivo
        this.feedback = document.getElementById("chainStepExplanation");

        // Diccionario con las referencias a los 5 nodos eslabones de la cadena
        this.nodes = {
            1: document.getElementById("node-hijo"),
            2: document.getElementById("node-padre"),
            3: document.getElementById("node-abuelo"),
            4: document.getElementById("node-object-proto"),
            5: document.getElementById("node-null")
        };

        // Diccionario con los 4 conectores entre nodos
        this.links = {
            "1-2": document.getElementById("link-1-2"),
            "2-3": document.getElementById("link-2-3"),
            "3-4": document.getElementById("link-3-4"),
            "4-5": document.getElementById("link-4-5")
        };

        this.bindEvents();
    }

    static bindEvents() {
        // Escuchador de clics para cada botón de propiedad a buscar
        this.propButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Si la animación está en marcha, bloqueamos la interacción
                if (this.isAnimating) return;
                SoundEffects.click();
                // Desactivamos los otros botones y activamos el seleccionado
                this.propButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                // Guardamos el nombre de la propiedad elegida
                this.currentProp = btn.getAttribute("data-prop");
                // Reiniciamos los colores de los nodos
                this.resetVisuals();
                // Actualizamos el mensaje de instrucciones
                if (this.feedback) {
                    this.feedback.innerHTML = `Propiedad seleccionada: <code>hijo.${this.currentProp}</code>. Haz clic en <strong>"Rastrear Búsqueda en la Cadena"</strong> para iniciar.`;
                }
            });
        });

        // Botón que arranca la búsqueda animada
        if (this.btnRun) {
            this.btnRun.addEventListener("click", () => {
                if (this.isAnimating) return;
                this.runSimulation();
            });
        }
    }

    // Limpia los estilos visuales de pasos anteriores
    static resetVisuals() {
        Object.values(this.nodes).forEach((n) => {
            if (n) {
                n.classList.remove("current-step", "found-here", "not-found-here");
            }
        });
        Object.values(this.links).forEach((l) => {
            if (l) l.classList.remove("link-active");
        });
        document.querySelectorAll(".prop-item").forEach((p) => p.classList.remove("prop-highlight"));
    }

    // Ejecuta la animación asíncrona de búsqueda escalón por escalón
    static async runSimulation() {
        this.isAnimating = true;
        this.btnRun.disabled = true;
        this.resetVisuals();
        SoundEffects.click();

        const prop = this.currentProp;

        // PASO 1: Inspeccionar Nodo Hijo (Instancia directa)
        await this.stepNode(1, "Buscando en la instancia propia <code>hijo</code>...");
        if (prop === "nombre") {
            // Si la propiedad es 'nombre', está directamente en hijo
            this.highlightFound(1, prop, `¡Encontrado en el Eslabón 1 (Instancia)! Valor propio: <strong>"Lucas"</strong>. No fue necesario subir en la cadena.`);
            this.finishSimulation(true);
            return;
        }
        // Si no está, lo marcamos en rojo tenue y animamos el cable al nodo padre
        this.markNotFound(1);
        await this.stepLink("1-2");

        // PASO 2: Inspeccionar Nodo Padre (Primer prototipo)
        await this.stepNode(2, `No está en <code>hijo</code>. Saltando a través de <code>[[Prototype]]</code> al taller de <code>padre</code>...`);
        if (prop === "profesion") {
            // Si la propiedad es 'profesion', se encuentra aquí
            this.highlightFound(2, prop, `¡Encontrado en el Eslabón 2 (padre)! Valor heredado: <strong>"Ingeniero"</strong>.`);
            this.finishSimulation(true);
            return;
        }
        this.markNotFound(2);
        await this.stepLink("2-3");

        // PASO 3: Inspeccionar Nodo Abuelo (Segundo prototipo en la cadena)
        await this.stepNode(3, `No está en <code>padre</code>. Subiendo otro eslabón al prototipo <code>abuelo</code>...`);
        if (prop === "apellido") {
            // Si es 'apellido', está en el abuelo
            this.highlightFound(3, prop, `¡Encontrado en el Eslabón 3 (abuelo)! Valor heredado: <strong>"Pérez"</strong>.`);
            this.finishSimulation(true);
            return;
        }
        this.markNotFound(3);
        await this.stepLink("3-4");

        // PASO 4: Inspeccionar Object.prototype (Raíz universal de todos los objetos)
        await this.stepNode(4, `No está en <code>abuelo</code>. Subiendo a la raíz universal de JavaScript: <code>Object.prototype</code>...`);
        if (prop === "toString") {
            // Si es 'toString', se encuentra en Object.prototype
            this.highlightFound(4, prop, `¡Encontrado en el Eslabón 4 (Object.prototype)! Método nativo heredado: <strong>f toString()</strong>.`);
            this.finishSimulation(true);
            return;
        }
        this.markNotFound(4);
        await this.stepLink("4-5");

        // PASO 5: Fin de la Cadena -> null
        await this.stepNode(5, `No existe en ningún prototipo. Llegamos al final de la cadena: <code>null</code>.`);
        this.highlightNull(`La propiedad <code>hijo.${prop}</code> no existe en la cadena de prototipos. El motor JS devuelve <strong>undefined</strong>.`);
        this.finishSimulation(false);
    }

    // Resalta un nodo como paso activo durante la búsqueda
    static stepNode(nodeNum, message) {
        return new Promise((resolve) => {
            const node = this.nodes[nodeNum];
            if (node) {
                node.classList.add("current-step");
            }
            if (this.feedback) {
                this.feedback.innerHTML = message;
            }
            SoundEffects.transition();
            // Pausa de 850ms para que el usuario aprecie el paso
            setTimeout(resolve, 850);
        });
    }

    // Activa la animación del pulso de luz en el cable conector
    static stepLink(linkKey) {
        return new Promise((resolve) => {
            const link = this.links[linkKey];
            if (link) {
                link.classList.add("link-active");
            }
            // Duración del viaje de la luz por el cable
            setTimeout(resolve, 550);
        });
    }

    // Marca un nodo como no poseedor de la propiedad buscada
    static markNotFound(nodeNum) {
        const node = this.nodes[nodeNum];
        if (node) {
            node.classList.remove("current-step");
            node.classList.add("not-found-here");
        }
    }

    // Resalta el nodo ganador con borde verde y resplandor
    static highlightFound(nodeNum, prop, message) {
        const node = this.nodes[nodeNum];
        if (node) {
            node.classList.remove("current-step");
            node.classList.add("found-here");
            // Ilumina la propiedad exacta dentro del nodo
            const propItem = node.querySelector(`[data-has="${prop}"]`);
            if (propItem) propItem.classList.add("prop-highlight");
        }
        if (this.feedback) {
            this.feedback.innerHTML = `🎉 ${message}`;
        }
        SoundEffects.success();
    }

    // Resalta el estado null cuando no se encontró en ninguna parte
    static highlightNull(message) {
        const node = this.nodes[5];
        if (node) {
            node.classList.remove("current-step");
            node.classList.add("found-here");
        }
        if (this.feedback) {
            this.feedback.innerHTML = `⚠️ ${message}`;
        }
        SoundEffects.alert();
    }

    // Restablece los controles al concluir la simulación
    static finishSimulation() {
        this.isAnimating = false;
        if (this.btnRun) this.btnRun.disabled = false;
    }
}

// --- MÓDULO 4: LAS 6 CARACTERÍSTICAS DINÁMICAS (SLIDE 5) ---
function initSlide5Characteristics() {
    // Selector de pestañas y paneles de las 6 características
    const tabs = document.querySelectorAll(".char-tab-btn");
    const views = document.querySelectorAll(".char-detail-view");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            SoundEffects.click();
            // Obtenemos el número de característica (1 al 6)
            const charId = tab.getAttribute("data-char");

            // Ocultamos las demás pestañas y vistas
            tabs.forEach((t) => t.classList.remove("active"));
            views.forEach((v) => v.classList.remove("active"));

            // Activamos la pestaña clicada
            tab.classList.add("active");
            // Mostramos el panel de detalle correspondiente
            const targetView = document.getElementById(`char-view-${charId}`);
            if (targetView) targetView.classList.add("active");
        });
    });

    // 4.1 Mutabilidad en caliente del prototipo
    const btnMutate = document.getElementById("btnMutateProto");
    const mutResult = document.getElementById("mutationResult");
    if (btnMutate && mutResult) {
        // Constructor Robot
        function Robot(nombre) {
            this.nombre = nombre;
        }
        // Creamos la instancia ANTES de agregar el método
        const bot1 = new Robot("R2-D2");

        btnMutate.addEventListener("click", () => {
            // Modificamos el prototipo en tiempo de ejecución (en caliente)
            Robot.prototype.saludar = function() {
                return `Beep boop! Soy ${this.nombre} y ahora hablo gracias a la mutabilidad del prototipo.`;
            };
            // bot1 puede invocar inmediatamente el nuevo método sin haber sido reiniciado
            mutResult.innerHTML = `
                <strong style="color:#34d399">¡Prototipo Mutado en Caliente!</strong><br>
                Llamando a bot1.saludar():<br>
                <em>"${bot1.saludar()}"</em>
            `;
            SoundEffects.success();
            showToast("Robot.prototype.saludar() inyectado", "⚡");
        });
    }

    // 4.2 Es en sí mismo un objeto
    const btnInspect = document.getElementById("btnInspectProtoObject");
    const inspectOutput = document.getElementById("inspectProtoObjectOutput");
    if (btnInspect && inspectOutput) {
        btnInspect.addEventListener("click", () => {
            function Persona() {}
            // Agregamos propiedades al prototipo
            Persona.prototype.especie = "Humano";
            Persona.prototype.planeta = "Tierra";

            // Inspeccionamos como objeto convencional
            const info = {
                "typeof Persona.prototype": typeof Persona.prototype,
                "Object.keys(Persona.prototype)": Object.keys(Persona.prototype),
                "Prototipo de Persona.prototype": Object.getPrototypeOf(Persona.prototype) === Object.prototype ? "Object.prototype (Raíz)" : "Otro"
            };

            // Formateamos como JSON indentado
            inspectOutput.textContent = JSON.stringify(info, null, 2);
            SoundEffects.success();
        });
    }

    // 4.3 Existencia en memoria RAM y calculadora de ahorro
    const slider = document.getElementById("instanceCountSlider");
    const sliderVal = document.getElementById("instanceCountVal");
    const badFill = document.getElementById("badMemFill");
    const badText = document.getElementById("badMemText");

    if (slider && sliderVal && badFill && badText) {
        slider.addEventListener("input", (e) => {
            // Leemos el valor del control deslizante (100 a 10,000)
            const count = parseInt(e.target.value, 10);
            sliderVal.textContent = `${count.toLocaleString()} instancias`;

            // Calculamos el porcentaje relativo para la barra de mala práctica
            const pct = Math.min(100, Math.max(10, (count / 10000) * 100));
            badFill.style.width = `${pct}%`;

            // Estimación pedagógica: cada función de objeto duplicada toma ~280 bytes en el Heap
            const memoryKbs = ((count * 280) / 1024).toFixed(1);
            badText.textContent = `~${count.toLocaleString()} funciones duplicadas (desperdicia ~${memoryKbs} KB de RAM)`;
        });
    }

    // 4.4 Modificado y llamado directamente sin instanciar
    const btnCallDirect = document.getElementById("btnTestDirectCall");
    const directResult = document.getElementById("directCallResult");
    if (btnCallDirect && directResult) {
        // Objeto prototipo con método sumar
        const PrototipoCalculadora = {
            sumar: function(a, b) {
                return a + b;
            }
        };

        btnCallDirect.addEventListener("click", () => {
            // Invocación directa del método en el prototipo
            const res = PrototipoCalculadora.sumar(12, 8);
            directResult.innerHTML = `
                Resultado de PrototipoCalculadora.sumar(12, 8): <strong style="color:#34d399">${res}</strong><br>
                <small style="color:#94a3b8">¡Invocado directamente como cualquier objeto, sin crear instancias 'new'!</small>
            `;
            SoundEffects.success();
        });
    }

    // 4.6 Hereda valores y métodos con contexto 'this' dinámico
    const btnThis = document.getElementById("btnTestThisContext");
    const thisResult = document.getElementById("thisContextResult");
    if (btnThis && thisResult) {
        // Prototipo con propiedad moneda y método que usa 'this'
        const PrototipoCuenta = {
            moneda: "USD",
            mostrarSaldo: function() {
                return `Saldo actual de ${this.titular}: $${this.saldo} ${this.moneda}`;
            }
        };
        // Creamos una cuenta individual que delega en PrototipoCuenta
        const cuentaAhorros = Object.create(PrototipoCuenta);
        cuentaAhorros.titular = "Ana Gómez";
        cuentaAhorros.saldo = 3450;

        btnThis.addEventListener("click", () => {
            // El método se ejecuta en el prototipo pero 'this' apunta a cuentaAhorros
            const res = cuentaAhorros.mostrarSaldo();
            thisResult.innerHTML = `
                <strong>${res}</strong><br>
                <span style="color:#94a3b8">El código de la función vive en el prototipo, pero <code>this</code> resolvió a <code>cuentaAhorros</code>.</span>
            `;
            SoundEffects.success();
        });
    }
}

// --- MÓDULO 5: METÁFORA DE LA CAJA DE HERRAMIENTAS (SLIDE 6) ---
class ToolboxSimulator {
    static init() {
        this.toolButtons = document.querySelectorAll(".tool-btn");
        this.banner = document.getElementById("toolboxBanner");
        this.bannerText = document.getElementById("bannerText");
        this.bannerIcon = document.getElementById("bannerIcon");

        // Los 3 talleres familiares
        this.workshops = {
            you: document.getElementById("ws-you"),
            father: document.getElementById("ws-father"),
            grandpa: document.getElementById("ws-grandpa")
        };

        // Estados de texto en cada taller
        this.statuses = {
            you: document.getElementById("status-you"),
            father: document.getElementById("status-father"),
            grandpa: document.getElementById("status-grandpa")
        };

        this.bindEvents();
        // Seleccionamos martillo por defecto
        this.selectTool("martillo");
    }

    static bindEvents() {
        this.toolButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                SoundEffects.click();
                this.toolButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const tool = btn.getAttribute("data-tool");
                this.selectTool(tool);
            });
        });
    }

    // Resuelve visualmente la búsqueda de herramientas según la cadena de delegación
    static selectTool(toolName) {
        // Reiniciamos clases de búsqueda
        Object.values(this.workshops).forEach((ws) => {
            if (ws) ws.classList.remove("ws-active-search", "ws-found");
        });
        document.querySelectorAll(".ws-item").forEach((it) => it.classList.remove("highlight-item"));

        // Caso 1: Destornillador (Vive en tu propio bolsillo / Propiedad Propia)
        if (toolName === "destornillador") {
            this.workshops.you.classList.add("ws-found");
            this.highlightToolItem("destornillador");
            this.statuses.you.textContent = "✔ ¡La tienes en tu propio bolsillo!";
            this.statuses.father.textContent = "No necesitó molestar al padre";
            this.statuses.grandpa.textContent = "Sin consultas";

            this.setBanner("🎉 Destornillador encontrado en tu propio bolsillo (Propiedad Propia). No fue necesario pedir prestado a la familia.", "👦");
            SoundEffects.success();
        } else if (toolName === "martillo") {
            // Caso 2: Martillo (No lo tienes tú, lo tiene tu Padre en su taller / Prototipo 1)
            this.workshops.you.classList.add("ws-active-search");
            this.workshops.father.classList.add("ws-found");
            this.highlightToolItem("martillo");

            this.statuses.you.textContent = "❌ No la tienes tú";
            this.statuses.father.textContent = "✔ ¡Tu padre la tiene en su taller!";
            this.statuses.grandpa.textContent = "Sin consultas";

            this.setBanner("🔨 No tenías martillo, así que fuiste al taller de tu Padre (Prototipo directo) y te lo prestó.", "👨");
            SoundEffects.success();
        } else if (toolName === "sierra") {
            // Caso 3: Sierra eléctrica (Ni tú ni tu padre la tienen; tu Abuelo la tiene / Prototipo 2)
            this.workshops.you.classList.add("ws-active-search");
            this.workshops.father.classList.add("ws-active-search");
            this.workshops.grandpa.classList.add("ws-found");
            this.highlightToolItem("sierra");

            this.statuses.you.textContent = "❌ No la tienes tú";
            this.statuses.father.textContent = "❌ Tu padre tampoco la tiene";
            this.statuses.grandpa.textContent = "✔ ¡Tu abuelo la tiene en el desván!";

            this.setBanner("🪚 Ni tú ni tu padre tenían sierra eléctrica, así que tu padre fue al taller del Abuelo (Prototype Chain completa).", "👴");
            SoundEffects.success();
        } else {
            // Caso 4: Herramienta inexistente (Cúter Láser) -> Recorre toda la familia y llega a null
            this.workshops.you.classList.add("ws-active-search");
            this.workshops.father.classList.add("ws-active-search");
            this.workshops.grandpa.classList.add("ws-active-search");

            this.statuses.you.textContent = "❌ No existe";
            this.statuses.father.textContent = "❌ No existe";
            this.statuses.grandpa.textContent = "❌ Nadie la tiene (null)";

            this.setBanner("⚠️ Nadie en toda la familia carpintera tiene un cúter láser. Búsqueda llegó a null → undefined.", "❓");
            SoundEffects.alert();
        }
    }

    // Resalta el elemento de herramienta visual en el taller
    static highlightToolItem(tool) {
        const item = document.querySelector(`[data-has-item="${tool}"]`);
        if (item) item.classList.add("highlight-item");
    }

    // Actualiza el texto del banner informativo
    static setBanner(text, icon) {
        if (this.bannerText) this.bannerText.textContent = text;
        if (this.bannerIcon) this.bannerIcon.textContent = icon;
    }
}

// --- MÓDULO 6: SIMULADOR DE ERROR CON ARRAYS COMPARTIDOS (SLIDE 7) ---
function initSlide7Bugs() {
    const btnBug = document.getElementById("btnTriggerBugDemo");
    const output = document.getElementById("bugSimOutput");

    if (!btnBug || !output) return;

    btnBug.addEventListener("click", () => {
        SoundEffects.alert();
        // Error clásico: colocar un array mutable directamente en el objeto prototipo
        const PrototipoUsuario = {
            amigos: [] // ⚠️ Compartido por referencia física en memoria
        };

        // Creamos dos instancias
        const user1 = Object.create(PrototipoUsuario);
        const user2 = Object.create(PrototipoUsuario);

        // user1 añade a su amigo 'Ana' al array
        user1.amigos.push("Ana");

        // Al inspeccionar user2, ¡también tiene a Ana aunque nunca la agregó!
        output.innerHTML = `
            <strong>⚠️ ¡ERROR DETECTADO!</strong><br>
            user1 agregó a "Ana", pero mira la lista de user2:<br>
            <code>user2.amigos: ["${user2.amigos.join('", "')}"]</code><br>
            <small>¡user2 ahora tiene los amigos de user1 porque ambos apuntan al mismo Array en RAM!</small>
        `;
        showToast("Bug de Array compartido reproducido", "💥");
    });
}

// --- MÓDULO 7: PLAYGROUND & CONSOLA VIRTUAL EN VIVO (SLIDE 8) ---
class PlaygroundManager {
    static init() {
        this.editor = document.getElementById("liveCodeEditor");
        this.consoleContainer = document.getElementById("consoleLogsContainer");
        this.presetSelect = document.getElementById("codePresetSelect");
        this.btnRun = document.getElementById("btnRunEditorCode");
        this.btnClear = document.getElementById("btnClearConsole");
        this.btnReset = document.getElementById("btnResetCode");

        // Plantillas de código listas para ejecutar
        this.presets = {
            "preset-1": `// 1. Objeto simple y lectura de su prototipo (Tu snippet inicial)
let objeto = {
    "propiedad": "datos"
};

console.log("Objeto:", objeto);
console.log("Prototipo (__proto__):", objeto.__proto__);
console.log("Estándar moderno:", Object.getPrototypeOf(objeto) === Object.prototype);
console.log("¿Posee toString?:", "toString" in objeto);
console.log("¿Es propia toString?:", Object.hasOwn(objeto, "toString"));`,

            "preset-2": `// 2. Función Constructora y prototype
function Automovil(marca, modelo) {
    this.marca = marca;
    this.modelo = modelo;
}

// Asignamos el método al Prototype Object compartido
Automovil.prototype.arrancar = function() {
    return \`El \${this.marca} \${this.modelo} ruge con fuerza.\`;
};

const auto1 = new Automovil("Nissan", "Skyline GTR");
const auto2 = new Automovil("Toyota", "Supra");

console.log(auto1.arrancar());
console.log(auto2.arrancar());
console.log("¿Comparten la misma función física en RAM?:", auto1.arrancar === auto2.arrancar);`,

            "preset-3": `// 3. Cadena de Prototipos de 3 niveles con Object.create
const abuelo = { apellido: "Pérez" };

const padre = Object.create(abuelo);
padre.profesion = "Arquitecto";

const hijo = Object.create(padre);
hijo.nombre = "Mateo";

console.log("Nombre del hijo (propio):", hijo.nombre);
console.log("Profesión (heredada de padre):", hijo.profesion);
console.log("Apellido (heredado de abuelo):", hijo.apellido);
console.log("Prototipo del abuelo:", Object.getPrototypeOf(abuelo) === Object.prototype);`,

            "preset-4": `// 4. Demostración de Ahorro Masivo de Memoria
function EnemigoConMetodoPropio() {
    // ❌ Mala práctica: duplica la función por cada instancia
    this.atacar = function() { return "Ataque clonado"; };
}

function EnemigoConPrototipo() {}
// ✅ Buena práctica: 1 sola función compartida
EnemigoConPrototipo.prototype.atacar = function() { return "Ataque compartido"; };

const clon1 = new EnemigoConMetodoPropio();
const clon2 = new EnemigoConMetodoPropio();
console.log("¿Misma función sin prototipo?:", clon1.atacar === clon2.atacar); // false

const proto1 = new EnemigoConPrototipo();
const proto2 = new EnemigoConPrototipo();
console.log("¿Misma función con prototipo?:", proto1.atacar === proto2.atacar); // true!`,

            "preset-ex1": `// RETO NIVEL 1: El Vehículo Base con Object.create()
const vehiculoPrototipo = {
    ruedas: 4,
    arrancar() {
        return \`El vehículo de \${this.ruedas} ruedas ha arrancado.\`;
    }
};

const miCoche = Object.create(vehiculoPrototipo);
miCoche.marca = "Tesla";

console.log("Marca propia:", miCoche.marca);
console.log("Ruedas heredadas:", miCoche.ruedas);
console.log(miCoche.arrancar());`,

            "preset-ex2": `// RETO NIVEL 2: Mutabilidad Compartida en Personajes
function Personaje(nombre, vida) {
    this.nombre = nombre;
    this.vida = vida;
}

const guerrero = new Personaje("Thor", 100);
const mago = new Personaje("Gandalf", 80);

// Inyectamos el método curar() en el prototipo en caliente:
Personaje.prototype.curar = function(pts) {
    this.vida += pts;
    return \`\${this.nombre} curado. Vida actual: \${this.vida}\`;
};

console.log(guerrero.curar(25));
console.log(mago.curar(40));
console.log("¿Comparten la referencia exacta en RAM?:", guerrero.curar === mago.curar);`,

            "preset-ex3": `// RETO NIVEL 3: Cadena de 3 Niveles con Object.hasOwn()
const Entidad = {
    respirar() { return "Respirando oxígeno..."; }
};

const Empleado = Object.create(Entidad);
Empleado.empresa = "TechCorp";
Empleado.trabajar = function() { return \`Trabajando en \${this.empresa}\`; };

const dev = Object.create(Empleado);
dev.nombre = "Sofia";
dev.lenguaje = "JavaScript";
dev.programar = function() { return \`\${this.nombre} programa en \${this.lenguaje}\`; };

console.log(dev.programar()); // Nivel 1 (Propio)
console.log(dev.trabajar());  // Nivel 2 (Empleado)
console.log(dev.respirar());  // Nivel 3 (Entidad)

console.log("¿'nombre' es propia?:", Object.hasOwn(dev, "nombre"));
console.log("¿'empresa' es propia?:", Object.hasOwn(dev, "empresa"));`
        };

        this.bindEvents();
        // Cargamos el primer ejemplo por defecto
        this.loadPreset("preset-1");
    }

    static bindEvents() {
        if (this.btnRun) {
            this.btnRun.addEventListener("click", () => this.runCode());
        }
        if (this.btnClear) {
            this.btnClear.addEventListener("click", () => this.clearConsole());
        }
        if (this.btnReset) {
            this.btnReset.addEventListener("click", () => {
                SoundEffects.click();
                this.loadPreset(this.presetSelect.value);
                showToast("Código restaurado", "↺");
            });
        }
        if (this.presetSelect) {
            this.presetSelect.addEventListener("change", (e) => {
                SoundEffects.click();
                this.loadPreset(e.target.value);
            });
        }
    }

    // Carga un snippet de código en el textarea del editor
    static loadPreset(key) {
        if (this.editor && this.presets[key]) {
            this.editor.value = this.presets[key];
            if (this.presetSelect && this.presets[key] && !key.startsWith("preset-ex")) {
                this.presetSelect.value = key;
            }
        }
    }

    // Limpia las líneas impresas en la consola virtual
    static clearConsole() {
        if (this.consoleContainer) {
            this.consoleContainer.innerHTML = `
                <div class="log-line info-line">
                    <span class="log-time">[Consola limpia]</span> Lista para nuevas ejecuciones...
                </div>
            `;
            SoundEffects.click();
        }
    }

    // Inserta una línea de mensaje con timestamp y clase de color en la consola
    static appendLog(message, type = "normal") {
        if (!this.consoleContainer) return;
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];

        const line = document.createElement("div");
        line.className = `log-line log-${type}`;
        line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`;
        this.consoleContainer.appendChild(line);
        // Desplaza el scroll automáticamente al final
        this.consoleContainer.scrollTop = this.consoleContainer.scrollHeight;
    }

    // Ejecuta el código JavaScript escrito por el usuario de forma segura en un sandbox
    static runCode() {
        if (!this.editor) return;
        const userCode = this.editor.value;
        SoundEffects.click();

        this.appendLog("--- Ejecutando snippet ---", "info");

        // Almacén de registros capturados
        const logsCaptured = [];

        try {
            // Emulador de salida de consola que redirige a la consola visual
            const customConsole = {
                log: (...args) => {
                    const formatted = args.map((arg) => {
                        if (typeof arg === "object" && arg !== null) {
                            try {
                                return JSON.stringify(arg, (k, v) => typeof v === "function" ? "[Function]" : v);
                            } catch (e) {
                                return String(arg);
                            }
                        }
                        return String(arg);
                    }).join(" ");
                    logsCaptured.push(formatted);
                    this.appendLog(formatted, "normal");
                },
                error: (...args) => {
                    const formatted = args.join(" ");
                    this.appendLog(formatted, "error");
                }
            };

            // Ejecutamos en función con alcance aislado pasando nuestro customConsole
            const runner = new Function("console", userCode);
            runner(customConsole);

            SoundEffects.success();
            this.appendLog("✔ Ejecución finalizada sin errores.", "success");
        } catch (err) {
            // Captura de errores en tiempo de ejecución (ej. sintaxis o referencias inválidas)
            SoundEffects.alert();
            this.appendLog(`❌ Error en tiempo de ejecución: ${err.message}`, "error");
        }
    }
}

// --- MÓDULO 8: RETOS Y SOLUCIONES (SLIDE 9) ---
function initSlide9Exercises() {
    // Botones para alternar visibilidad de las soluciones
    document.querySelectorAll(".btn-ex-solution").forEach((btn) => {
        btn.addEventListener("click", () => {
            SoundEffects.click();
            const targetId = btn.getAttribute("data-sol");
            const solBox = document.getElementById(targetId);
            if (solBox) {
                const isVisible = solBox.classList.contains("visible");
                solBox.classList.toggle("visible");
                btn.textContent = isVisible ? "Ver Solución Paso a Paso" : "Ocultar Solución";
            }
        });
    });

    // Botones para cargar el reto directamente en el playground interactivo
    document.querySelectorAll("[data-load-preset]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const presetKey = btn.getAttribute("data-load-preset");
            SoundEffects.click();
            // Cargamos el código del reto
            PlaygroundManager.loadPreset(presetKey);
            // Saltamos a la diapositiva 8 (Playground)
            PresentationController.goToSlide(8);
            showToast("Reto cargado en el Playground. ¡Presiona Ejecutar!", "🚀");
        });
    });
}

// --- MÓDULO 9: CHULETA RÁPIDA (SLIDE 10) ---
function initSlide10Summary() {
    const btnCopyCheat = document.getElementById("btnCopySummaryCheat");
    if (!btnCopyCheat) return;

    // Resumen estructurado en formato Markdown para estudio del alumno
    const cheatSheetMarkdown = `# CHULETA MAESTRA — Prototipos en JavaScript

## 1. El Concepto Clave
JavaScript no tiene clases tradicionales: tiene **delegación prototípica**. Cada objeto tiene un enlace oculto [[Prototype]] hacia otro objeto vivo en RAM.

## 2. Métodos Estándar Recomendados
- **Crear objeto con prototipo:** \`const hijo = Object.create(padre);\`
- **Inspeccionar prototipo:** \`Object.getPrototypeOf(obj);\`
- **Comprobar pertenencia directa:** \`Object.hasOwn(obj, "propiedad");\`

## 3. Cadena de Prototipos (Prototype Chain)
\`obj -> Constructor.prototype -> Object.prototype -> null\`
Si busca una propiedad y no existe, devuelve \`undefined\`.

## 4. Regla de Oro de Memoria
Define los atributos únicos en el constructor y **todos los métodos en el prototipo** (\`Clase.prototype.metodo = ...\`) para que solo existan una sola vez en la memoria RAM.`;

    btnCopyCheat.addEventListener("click", () => {
        // Copiamos el texto al portapapeles
        navigator.clipboard.writeText(cheatSheetMarkdown).then(() => {
            SoundEffects.success();
            showToast("¡Chuleta en Markdown copiada al portapapeles!", "📋");
        });
    });
}

// --- INICIALIZACIÓN GLOBAL AL CARGAR EL DOM ---
// Esperamos a que la estructura HTML esté totalmente parseada para arrancar todos los módulos
document.addEventListener("DOMContentLoaded", () => {
    // 1. Iniciamos el controlador de diapositivas y navegación
    PresentationController.init();
    // 2. Iniciamos la demostración básica de prototipos
    initSlide2Demo();
    // 3. Iniciamos el comprobador de identidad en memoria
    initSlide3Demo();
    // 4. Iniciamos el simulador interactivo de Prototype Chain
    PrototypeChainSimulator.init();
    // 5. Iniciamos las 6 características y la calculadora de RAM
    initSlide5Characteristics();
    // 6. Iniciamos la metáfora visual de la caja de herramientas familiar
    ToolboxSimulator.init();
    // 7. Iniciamos el simulador de errores de arrays mutables
    initSlide7Bugs();
    // 8. Iniciamos el playground con consola virtual
    PlaygroundManager.init();
    // 9. Iniciamos los retos prácticos de 3 niveles
    initSlide9Exercises();
    // 10. Iniciamos el módulo de resumen y chuleta
    initSlide10Summary();

    console.log("✨ Presentación de Prototipos cargada con éxito en JavaScript Master Level.");
});
