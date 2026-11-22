// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Objeto que almacena el estado reactivo de la presentación y configuraciones del usuario
const AppState = { // Declara e inicializa "AppState"
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación
    totalSlides: 11,
    // Booleano: true para modo diapositivas (slides), false para modo documento continuo
    isPresentationMode: true,
    // Booleano: true si los efectos de sonido sintetizados están activos
    soundEnabled: true,
    // Almacena la instancia de AudioContext para la síntesis de sonido en el navegador
    audioCtx: null
};

// --- MÓDULO DE EFECTOS DE SONIDO SINTETIZADOS (Web Audio API) ---
// Clase estática que genera efectos de sonido procedimentales sin requerir archivos mp3 externos
class SoundEffects { // Define clase
    // Inicializa el contexto de audio únicamente cuando el usuario interactúa (requerido por políticas de navegadores)
    static init() { // Instrucción JavaScript
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
            // Instancia un nuevo contexto de audio
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Asigna valor
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) { // Instrucción JavaScript
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return; // Evalúa condición

        try { // Inicia bloque protegido contra errores
            // Aseguramos que el AudioContext esté inicializado
            this.init(); // Ejecuta llamada o método
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return; // Evalúa condición

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === 'suspended') { // Evalúa condición
                AppState.audioCtx.resume(); // Ejecuta llamada o método
            }

            // Creamos un nodo oscilador para emitir la onda de sonido
            const osc = AppState.audioCtx.createOscillator(); // Declara e inicializa "osc"
            // Creamos un nodo de ganancia para controlar el volumen del sonido
            const gain = AppState.audioCtx.createGain(); // Declara e inicializa "gain"

            // Asignamos el tipo de onda ('sine', 'triangle', 'sawtooth', 'square')
            osc.type = type; // Asigna valor
            // Fijamos la frecuencia en hercios en el tiempo actual del contexto
            osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime); // Ejecuta llamada o método

            // Fijamos el volumen inicial en el tiempo actual
            gain.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime); // Ejecuta llamada o método
            // Realizamos un desvanecimiento exponencial (fade out) hacia cero para evitar chasquidos de audio
            gain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + duration); // Ejecuta llamada o método

            // Conectamos el oscilador a la ganancia de volumen
            osc.connect(gain); // Ejecuta llamada o método
            // Conectamos la ganancia a la salida de audio (altavoces del usuario)
            gain.connect(AppState.audioCtx.destination); // Ejecuta llamada o método

            // Iniciamos la oscilación sonora inmediatamente
            osc.start(); // Ejecuta llamada o método
            // Detenemos la oscilación al completarse la duración especificada
            osc.stop(AppState.audioCtx.currentTime + duration); // Ejecuta llamada o método
        } catch (e) { // Instrucción JavaScript
            // Manejo silencioso en caso de bloqueo de políticas de autoplay
        }
    }

    // Sonido sutil de clic de interfaz (onda triangular de 600Hz y 40ms)
    static click() { // Instrucción JavaScript
        this.playTone(600, 'triangle', 0.04, 0.03); // Ejecuta llamada o método
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() { // Instrucción JavaScript
        // Nota C5 (523.25 Hz)
        this.playTone(523.25, 'sine', 0.1, 0.05); // Ejecuta llamada o método
        // Nota E5 (659.25 Hz) con retardo de 80ms
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80); // Ejecuta llamada o método
        // Nota G5 (783.99 Hz) con retardo de 160ms
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160); // Ejecuta llamada o método
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() { // Instrucción JavaScript
        // Tono bajo de 320 Hz
        this.playTone(320, 'sine', 0.06, 0.03); // Ejecuta llamada o método
        // Tono medio de 480 Hz con ligero desfase
        setTimeout(() => this.playTone(480, 'sine', 0.08, 0.03), 40); // Ejecuta llamada o método
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static alert() { // Instrucción JavaScript
        this.playTone(280, 'sawtooth', 0.15, 0.04); // Ejecuta llamada o método
    }
}

// --- MÓDULO DE TOAST NOTIFICATIONS (Alertas flotantes) ---
// Muestra una notificación temporal en la esquina inferior con un mensaje y un icono
function showToast(message, icon = "✔") { // Declara función
    // Obtenemos el elemento contenedor de la notificación
    const toast = document.getElementById("toastNotification"); // Obtiene referencia DOM para "toast"
    // Obtenemos el contenedor de texto de la notificación
    const toastMsg = document.getElementById("toastMsg"); // Obtiene referencia DOM para "toastMsg"
    // Obtenemos el contenedor del icono de la notificación
    const toastIcon = document.getElementById("toastIcon"); // Obtiene referencia DOM para "toastIcon"

    // Si los elementos no existen en el DOM, cancelamos
    if (!toast || !toastMsg) return; // Evalúa condición

    // Asignamos el mensaje recibido
    toastMsg.textContent = message; // Actualiza contenido en el DOM
    // Si existe el icono, asignamos el emoji o símbolo correspondiente
    if (toastIcon) toastIcon.textContent = icon; // Evalúa condición

    // Agregamos la clase .active para activar la animación de entrada
    toast.classList.add("active"); // Modifica clases CSS del elemento
    // Cancelamos cualquier temporizador previo si se disparan varios toasts seguidos
    clearTimeout(toast._timeout); // Ejecuta llamada o método
    // Programamos la desaparición automática tras 2.8 segundos (2800 ms)
    toast._timeout = setTimeout(() => { // Asigna valor
        toast.classList.remove("active"); // Modifica clases CSS del elemento
    }, 2800); // Ejecuta llamada o método
}

// --- MÓDULO DE CONTROLADOR DE PRESENTACIÓN ---
// Gestiona el ciclo de vida de las diapositivas, transiciones, teclado y controles
class PresentationController { // Define clase
    // Inicialización del controlador de presentación
    static init() { // Instrucción JavaScript
        // Seleccionamos todas las etiquetas con clase .slide
        this.slides = document.querySelectorAll(".slide"); // Asigna valor
        // Actualizamos la cantidad total de diapositivas detectadas
        AppState.totalSlides = this.slides.length; // Asigna valor

        // Generamos dinámicamente las bolitas indicadoras inferiores
        this.renderDots(); // Ejecuta llamada o método
        // Generamos la cuadrícula del modal de visión general
        this.renderOverview(); // Ejecuta llamada o método
        // Posicionamos la presentación en la diapositiva 1 sin reproducir audio al inicio
        this.goToSlide(1, false); // Ejecuta llamada o método
        // Asociamos los escuchadores de eventos (botones, clics y teclado)
        this.bindEvents(); // Ejecuta llamada o método
    }

    // Renderiza dinámicamente los puntos de navegación en el dock inferior
    static renderDots() { // Instrucción JavaScript
        // Obtenemos el contenedor de puntos del DOM
        const container = document.getElementById("slideDotsContainer"); // Obtiene referencia DOM para "container"
        // Verificamos existencia
        if (!container) return; // Evalúa condición
        // Limpiamos el contenido previo
        container.innerHTML = ""; // Actualiza contenido en el DOM

        // Iteramos desde la diapositiva 1 hasta la última
        for (let i = 1; i <= AppState.totalSlides; i++) { // Inicia bucle de iteración
            // Creamos un nuevo elemento div
            const dot = document.createElement("div"); // Crea nuevo elemento DOM "dot"
            // Le asignamos la clase base y la clase active al primer punto
            dot.className = `slide-dot ${i === 1 ? "active" : ""}`; // Asigna valor
            // Texto descriptivo accesible para hover
            dot.title = `Diapositiva ${i}`; // Asigna valor
            // Agregamos evento de clic para saltar a la diapositiva correspondiente
            dot.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(i); // Ejecuta llamada o método
            });
            // Añadimos el punto al contenedor en el DOM
            container.appendChild(dot); // Inserta nodo en el DOM
        }
    }

    // Renderiza la lista de miniaturas en el modal de vista panorámica (Overview)
    static renderOverview() { // Instrucción JavaScript
        // Obtenemos la rejilla del modal
        const grid = document.getElementById("overviewGrid"); // Obtiene referencia DOM para "grid"
        // Validamos existencia
        if (!grid) return; // Evalúa condición
        // Vaciamos contenido
        grid.innerHTML = ""; // Actualiza contenido en el DOM

        // Recorremos cada diapositiva
        this.slides.forEach((slide, index) => { // Instrucción JavaScript
            // Calculamos el número de diapositiva (base 1)
            const num = index + 1; // Declara e inicializa "num"
            // Leemos el título del atributo data-title o ponemos uno por defecto
            const title = slide.getAttribute("data-title") || `Diapositiva ${num}`; // Declara e inicializa "title"
            // Creamos el div contenedor de la miniatura
            const thumb = document.createElement("div"); // Crea nuevo elemento DOM "thumb"
            // Marcamos con clase .current si es la diapositiva actual
            thumb.className = `overview-thumb ${num === AppState.currentSlide ? "current" : ""}`; // Asigna valor
            // Inyectamos el HTML con el número formateado a dos dígitos y su título
            thumb.innerHTML = `
                <span class="thumb-num">0${num}</span>
                <span class="thumb-title">${title}</span>
            `;
            // Al hacer clic en una miniatura, viajamos a esa diapositiva y cerramos el modal
            thumb.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(num); // Ejecuta llamada o método
                this.closeOverview(); // Ejecuta llamada o método
            });
            // Insertamos la miniatura en la cuadrícula
            grid.appendChild(thumb); // Inserta nodo en el DOM
        });
    }

    // Navega a un número específico de diapositiva
    static goToSlide(slideNum, playSound = true) { // Instrucción JavaScript
        // Validamos que el número esté dentro del rango permitido
        if (slideNum < 1 || slideNum > AppState.totalSlides) return; // Evalúa condición

        // Actualizamos el número actual en el estado global
        AppState.currentSlide = slideNum; // Asigna valor

        // Recorremos las diapositivas para encender solo la activa
        this.slides.forEach((slide) => { // Instrucción JavaScript
            // Obtenemos el número asignado a esta diapositiva
            const currentNum = parseInt(slide.getAttribute("data-slide"), 10); // Declara e inicializa "currentNum"
            // Si coincide con la seleccionada, añadimos .active
            if (currentNum === slideNum) { // Evalúa condición
                slide.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                // De lo contrario, removemos .active para ocultarla
                slide.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        // Obtenemos los elementos de la barra de progreso superior
        const progressBar = document.getElementById("progressBar"); // Obtiene referencia DOM para "progressBar"
        const slideIndicator = document.getElementById("slideIndicator"); // Obtiene referencia DOM para "slideIndicator"
        // Calculamos el porcentaje completado
        const percentage = (slideNum / AppState.totalSlides) * 100; // Declara e inicializa "percentage"

        // Actualizamos el ancho visual de la barra de progreso
        if (progressBar) progressBar.style.width = `${percentage}%`; // Evalúa condición
        // Actualizamos el texto del contador de diapositivas
        if (slideIndicator) slideIndicator.textContent = `${slideNum} / ${AppState.totalSlides}`; // Evalúa condición

        // Sincronizamos las bolitas del dock inferior
        const dots = document.querySelectorAll(".slide-dot"); // Obtiene referencia DOM para "dots"
        dots.forEach((dot, idx) => { // Instrucción JavaScript
            // Si el índice coincide, activamos el punto
            if (idx + 1 === slideNum) { // Evalúa condición
                dot.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                dot.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        // Hacemos scroll suave al inicio de la página para buena lectura
        window.scrollTo({ top: 0, behavior: "smooth" }); // Ejecuta llamada o método

        // Si se solicitó sonido, reproducimos la transición
        if (playSound) SoundEffects.transition(); // Evalúa condición

        // Si el usuario está en Modo Documento (todas visibles), desplazamos la pantalla hasta la sección correspondiente
        if (!AppState.isPresentationMode) { // Evalúa condición
            const targetSlide = document.getElementById(`slide-${slideNum}`); // Obtiene referencia DOM para "targetSlide"
            if (targetSlide) { // Evalúa condición
                targetSlide.scrollIntoView({ behavior: "smooth" }); // Ejecuta llamada o método
            }
        }
    }

    // Avanza a la siguiente diapositiva
    static nextSlide() { // Instrucción JavaScript
        // Comprobamos si no estamos en la última
        if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
            this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            // Si ya estamos en la última, emitimos alerta y mensaje
            SoundEffects.alert(); // Ejecuta llamada o método
            showToast("Estás en la última diapositiva", "ℹ️"); // Ejecuta llamada o método
        }
    }

    // Retrocede a la diapositiva anterior
    static prevSlide() { // Instrucción JavaScript
        // Comprobamos si no estamos en la primera
        if (AppState.currentSlide > 1) { // Evalúa condición
            this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            // Si ya estamos en la primera, alertamos
            SoundEffects.alert(); // Ejecuta llamada o método
            showToast("Estás en el inicio de la presentación", "ℹ️"); // Ejecuta llamada o método
        }
    }

    // Alterna entre el modo Presentación (Diapositivas) y el modo Guía (Documento corrido)
    static toggleMode() { // Instrucción JavaScript
        // Invertimos el valor booleano
        AppState.isPresentationMode = !AppState.isPresentationMode; // Asigna valor
        // Obtenemos los elementos de texto e icono del botón de cambio
        const modeText = document.getElementById("modeText"); // Obtiene referencia DOM para "modeText"
        const modeIcon = document.getElementById("modeIcon"); // Obtiene referencia DOM para "modeIcon"

        // Si regresamos al modo presentación
        if (AppState.isPresentationMode) { // Evalúa condición
            document.body.classList.remove("mode-document"); // Modifica clases CSS del elemento
            document.body.classList.add("mode-presentation"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Guía"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "📑"; // Evalúa condición
            this.goToSlide(AppState.currentSlide, false); // Ejecuta llamada o método
            showToast("Cambiado a Modo Presentación Interactiva (Diapositivas)", "🖥️"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            // Si pasamos al modo documento corrido
            document.body.classList.remove("mode-presentation"); // Modifica clases CSS del elemento
            document.body.classList.add("mode-document"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Slides"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "📽️"; // Evalúa condición
            showToast("Cambiado a Modo Guía Completa de Estudio", "📖"); // Ejecuta llamada o método
        }
        // Reproducimos clic
        SoundEffects.click(); // Ejecuta llamada o método
    }

    // Abre el modal panorámico de diapositivas
    static openOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            // Volvemos a sincronizar la miniatura activa
            this.renderOverview(); // Ejecuta llamada o método
            // Mostramos el modal añadiendo .active
            modal.classList.add("active"); // Modifica clases CSS del elemento
            SoundEffects.click(); // Ejecuta llamada o método
        }
    }

    // Cierra el modal panorámico
    static closeOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            modal.classList.remove("active"); // Modifica clases CSS del elemento
        }
    }

    // Alterna pantalla completa (Fullscreen)
    static toggleFullscreen() { // Instrucción JavaScript
        SoundEffects.click(); // Ejecuta llamada o método
        // Si no hay elemento en fullscreen actualmente
        if (!document.fullscreenElement) { // Evalúa condición
            // Solicitamos pantalla completa para todo el documento
            document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            showToast("Pantalla Completa Activada", "⛶"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            // Si ya estaba en pantalla completa, salimos
            if (document.exitFullscreen) { // Evalúa condición
                document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
            }
            showToast("Pantalla Completa Desactivada", "⛶"); // Ejecuta llamada o método
        }
    }

    // Asocia los eventos de la interfaz
    static bindEvents() { // Instrucción JavaScript
        // Botón Siguiente del dock
        const btnNext = document.getElementById("btnNextSlide"); // Obtiene referencia DOM para "btnNext"
        // Botón Anterior del dock
        const btnPrev = document.getElementById("btnPrevSlide"); // Obtiene referencia DOM para "btnPrev"
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición

        // Botones de acción de la barra superior
        const btnGoLab = document.getElementById("btnGoLab"); // Obtiene referencia DOM para "btnGoLab"
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(7)); // Evalúa condición

        const btnToggleMode = document.getElementById("btnToggleMode"); // Obtiene referencia DOM para "btnToggleMode"
        const btnToggleSound = document.getElementById("btnToggleSound"); // Obtiene referencia DOM para "btnToggleSound"
        const btnOverview = document.getElementById("btnOverview"); // Obtiene referencia DOM para "btnOverview"
        const btnFullscreen = document.getElementById("btnFullscreen"); // Obtiene referencia DOM para "btnFullscreen"
        const btnCloseOverview = document.getElementById("btnCloseOverview"); // Obtiene referencia DOM para "btnCloseOverview"

        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode()); // Evalúa condición

        // Manejo del botón de sonido
        if (btnToggleSound) { // Evalúa condición
            btnToggleSound.addEventListener("click", () => { // Registra escuchador de eventos
                // Invertimos el estado de sonido
                AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
                const icon = document.getElementById("soundIcon"); // Obtiene referencia DOM para "icon"
                // Actualizamos el icono a parlante encendido o silenciado
                if (icon) icon.textContent = AppState.soundEnabled ? "🔊" : "🔇"; // Evalúa condición
                showToast(AppState.soundEnabled ? "Audio Activado" : "Audio Silenciado", AppState.soundEnabled ? "🔊" : "🔇"); // Ejecuta llamada o método
                if (AppState.soundEnabled) SoundEffects.click(); // Evalúa condición
            });
        }

        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview()); // Evalúa condición
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview()); // Evalúa condición
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen()); // Evalúa condición

        // Botón principal de la portada "Iniciar Presentación Interactiva"
        const btnStart = document.getElementById("btnStartPresentation"); // Obtiene referencia DOM para "btnStart"
        if (btnStart) { // Evalúa condición
            btnStart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                // Salta a la diapositiva 2 (¿Qué es un Prototipo?)
                this.goToSlide(2); // Ejecuta llamada o método
            });
        }

        // Mini tarjetas de la portada con atributo data-jump
        document.querySelectorAll("[data-jump]").forEach((item) => { // Instrucción JavaScript
            item.addEventListener("click", () => { // Registra escuchador de eventos
                const target = parseInt(item.getAttribute("data-jump"), 10); // Declara e inicializa "target"
                if (target) { // Evalúa condición
                    SoundEffects.click(); // Ejecuta llamada o método
                    this.goToSlide(target); // Ejecuta llamada o método
                }
            });
        });

        // Botón "Volver al Inicio" en la diapositiva de resumen
        const btnRestart = document.getElementById("btnRestartPresentation"); // Obtiene referencia DOM para "btnRestart"
        if (btnRestart) { // Evalúa condición
            btnRestart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(1); // Ejecuta llamada o método
            });
        }

        // Escuchador global de teclado para atajos y navegación
        window.addEventListener("keydown", (e) => { // Registra escuchador de eventos
            // Si el usuario está escribiendo código en el textarea, no cambiamos de diapositiva
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición
                // Atajo especial en el editor: Ctrl + Enter ejecuta el código
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { // Evalúa condición
                    e.preventDefault(); // Ejecuta llamada o método
                    PlaygroundManager.runCode(); // Ejecuta llamada o método
                }
                return; // Retorna resultado
            }

            // Atajos de navegación general
            switch (e.key) { // Evalúa múltiples casos
                // Flecha derecha, D o barra espaciadora avanzan
                case "ArrowRight":
                case "d":
                case "D":
                case " ":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                // Flecha izquierda o A retroceden
                case "ArrowLeft":
                case "a":
                case "A":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                // Tecla 'O' abre o cierra la vista general de miniaturas
                case "o":
                case "O":
                    e.preventDefault(); // Ejecuta llamada o método
                    const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
                    if (modal && modal.classList.contains("active")) { // Evalúa condición
                        this.closeOverview(); // Ejecuta llamada o método
                    } else { // Instrucción JavaScript
                        this.openOverview(); // Ejecuta llamada o método
                    }
                    break; // Instrucción JavaScript
                // Tecla 'F' alterna pantalla completa
                case "f":
                case "F":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                // Tecla 'M' alterna el modo de vista (Slides vs Guía)
                case "m":
                case "M":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleMode(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                // Tecla Escape cierra el modal si está abierto
                case "Escape":
                    this.closeOverview(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
            }
        });

        // Si el usuario hace clic fuera de la ventana del modal, se cierra
        const modalOverlay = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modalOverlay"
        if (modalOverlay) { // Evalúa condición
            modalOverlay.addEventListener("click", (e) => { // Registra escuchador de eventos
                if (e.target === modalOverlay) this.closeOverview(); // Evalúa condición
            });
        }
    }
}

// --- MÓDULO 1: DEMOSTRACIÓN DE PROTOTIPO BÁSICO (SLIDE 2) ---
function initSlide2Demo() { // Declara función
    // Obtenemos el botón para probar el prototipo básico
    const btnTest = document.getElementById("btnTestProtoBasic"); // Obtiene referencia DOM para "btnTest"
    // Obtenemos la mini consola de salida
    const consoleOut = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOut"
    // Obtenemos la etiqueta de estado de ejecución
    const status = document.getElementById("testProtoBasicStatus"); // Obtiene referencia DOM para "status"

    // Validamos existencia en el DOM
    if (!btnTest || !consoleOut) return; // Evalúa condición

    // Al hacer clic en el botón de prueba
    btnTest.addEventListener("click", () => { // Registra escuchador de eventos
        SoundEffects.click(); // Ejecuta llamada o método

        // 1. Creamos un objeto literal simple
        const usuario = { nombre: "Carlos" }; // Declara e inicializa "usuario"
        // 2. Leemos su prototipo oculto mediante el estándar Object.getPrototypeOf()
        const proto = Object.getPrototypeOf(usuario); // Declara e inicializa "proto"
        // 3. Comprobamos si su prototipo coincide con el prototipo base universal de JS
        const esObjectPrototype = proto === Object.prototype; // Declara e inicializa "esObjectPrototype"

        // Mostramos el resultado paso a paso con colores en la mini consola
        consoleOut.innerHTML = `
            <div><span style="color:#64748b">&gt;</span> <span style="color:#a78bfa">usuario.toString():</span> "${usuario.toString()}"</div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#38bdf8">Object.getPrototypeOf(usuario) === Object.prototype:</span> <strong style="color:#34d399">${esObjectPrototype}</strong></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#fcd34d">Métodos encontrados en el prototipo raíz:</span> [toString, hasOwnProperty, isPrototypeOf, valueOf, ...]</div>
        `;

        // Actualizamos el estado con color verde de éxito
        if (status) { // Evalúa condición
            status.textContent = "✔ Ejecutado con éxito"; // Actualiza contenido en el DOM
            status.style.color = "#34d399"; // Asigna valor
        }
        // Reproducimos acorde de éxito
        SoundEffects.success(); // Ejecuta llamada o método
    });

    // Añadimos la funcionalidad de copiar código al portapapeles en los botones correspondientes
    document.querySelectorAll(".btn-copy-code").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            const targetId = btn.getAttribute("data-target"); // Declara e inicializa "targetId"
            const codeEl = document.getElementById(targetId); // Obtiene referencia DOM para "codeEl"
            if (codeEl) { // Evalúa condición
                // Copiamos el texto al portapapeles del sistema
                navigator.clipboard.writeText(codeEl.innerText).then(() => { // Instrucción JavaScript
                    btn.textContent = "¡Copiado!"; // Actualiza contenido en el DOM
                    SoundEffects.success(); // Ejecuta llamada o método
                    showToast("Código copiado al portapapeles", "📋"); // Ejecuta llamada o método
                    // Restauramos el texto original tras 2 segundos
                    setTimeout(() => { btn.textContent = "Copiar"; }, 2000); // Actualiza contenido en el DOM
                });
            }
        });
    });
}

// --- MÓDULO 2: COMPARADOR DE IDENTIDAD EN MEMORIA (SLIDE 3) ---
function initSlide3Demo() { // Declara función
    // Obtenemos el botón para verificar la igualdad referencial de prototipos
    const btnCheck = document.getElementById("btnCheckIdentity"); // Obtiene referencia DOM para "btnCheck"
    // Obtenemos la caja de resultado
    const resultBox = document.getElementById("identityResult"); // Obtiene referencia DOM para "resultBox"

    if (!btnCheck || !resultBox) return; // Evalúa condición

    btnCheck.addEventListener("click", () => { // Registra escuchador de eventos
        // Función constructora Automovil
        function Automovil(marca) { // Declara función
            this.marca = marca; // Asigna valor
        }
        // Asignamos el método en Automovil.prototype
        Automovil.prototype.encender = function() { // Asigna valor
            return `Auto ${this.marca} listo`; // Retorna resultado
        };

        // Creamos una nueva instancia miAuto
        const miAuto = new Automovil("Toyota"); // Declara e inicializa "miAuto"
        // Obtenemos el prototipo real de la instancia creada
        const protoInstancia = Object.getPrototypeOf(miAuto); // Declara e inicializa "protoInstancia"
        // Tomamos el Prototype Object del molde constructor
        const protoConstructor = Automovil.prototype; // Declara e inicializa "protoConstructor"
        // Comprobamos con igualdad estricta (===) si ambas variables apuntan al mismo espacio físico de RAM
        const sonIdenticos = protoInstancia === protoConstructor; // Declara e inicializa "sonIdenticos"

        // Pintamos el resultado explicativo
        resultBox.innerHTML = `
            <span style="color:#34d399; font-weight:700;">¡IDENTIDAD CONFIRMADA! (true)</span><br>
            Ambos apuntan exactamente a la misma posición física de memoria en RAM.<br>
            <code>miAuto.__proto__ === Automovil.prototype</code> es <strong>${sonIdenticos}</strong>.
        `;
        SoundEffects.success(); // Ejecuta llamada o método
    });
}

// --- MÓDULO 3: SIMULADOR DE PROTOTYPE CHAIN (SLIDE 4) ---
class PrototypeChainSimulator { // Define clase
    static init() { // Instrucción JavaScript
        // Propiedad que se buscará por defecto
        this.currentProp = "nombre"; // Asigna valor
        // Bandera para evitar ejecuciones concurrentes mientras corre la animación
        this.isAnimating = false; // Asigna valor

        // Botones de propiedades seleccionables
        this.propButtons = document.querySelectorAll(".sim-prop-btn"); // Asigna valor
        // Botón de ejecución de la simulación
        this.btnRun = document.getElementById("btnRunChainSimulation"); // Asigna valor
        // Contenedor de texto de explicación en vivo
        this.feedback = document.getElementById("chainStepExplanation"); // Asigna valor

        // Diccionario con las referencias a los 5 nodos eslabones de la cadena
        this.nodes = { // Asigna valor
            1: document.getElementById("node-hijo"),
            2: document.getElementById("node-padre"),
            3: document.getElementById("node-abuelo"),
            4: document.getElementById("node-object-proto"),
            5: document.getElementById("node-null")
        };

        // Diccionario con los 4 conectores entre nodos
        this.links = { // Asigna valor
            "1-2": document.getElementById("link-1-2"),
            "2-3": document.getElementById("link-2-3"),
            "3-4": document.getElementById("link-3-4"),
            "4-5": document.getElementById("link-4-5")
        };

        this.bindEvents(); // Ejecuta llamada o método
    }

    static bindEvents() { // Instrucción JavaScript
        // Escuchador de clics para cada botón de propiedad a buscar
        this.propButtons.forEach((btn) => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                // Si la animación está en marcha, bloqueamos la interacción
                if (this.isAnimating) return; // Evalúa condición
                SoundEffects.click(); // Ejecuta llamada o método
                // Desactivamos los otros botones y activamos el seleccionado
                this.propButtons.forEach((b) => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                // Guardamos el nombre de la propiedad elegida
                this.currentProp = btn.getAttribute("data-prop"); // Asigna valor
                // Reiniciamos los colores de los nodos
                this.resetVisuals(); // Ejecuta llamada o método
                // Actualizamos el mensaje de instrucciones
                if (this.feedback) { // Evalúa condición
                    this.feedback.innerHTML = `Propiedad seleccionada: <code>hijo.${this.currentProp}</code>. Haz clic en <strong>"Rastrear Búsqueda en la Cadena"</strong> para iniciar.`; // Actualiza contenido en el DOM
                }
            });
        });

        // Botón que arranca la búsqueda animada
        if (this.btnRun) { // Evalúa condición
            this.btnRun.addEventListener("click", () => { // Registra escuchador de eventos
                if (this.isAnimating) return; // Evalúa condición
                this.runSimulation(); // Ejecuta llamada o método
            });
        }
    }

    // Limpia los estilos visuales de pasos anteriores
    static resetVisuals() { // Instrucción JavaScript
        Object.values(this.nodes).forEach((n) => { // Instrucción JavaScript
            if (n) { // Evalúa condición
                n.classList.remove("current-step", "found-here", "not-found-here"); // Modifica clases CSS del elemento
            }
        });
        Object.values(this.links).forEach((l) => { // Instrucción JavaScript
            if (l) l.classList.remove("link-active"); // Evalúa condición
        });
        document.querySelectorAll(".prop-item").forEach((p) => p.classList.remove("prop-highlight")); // Modifica clases CSS del elemento
    }

    // Ejecuta la animación asíncrona de búsqueda escalón por escalón
    static async runSimulation() { // Instrucción JavaScript
        this.isAnimating = true; // Asigna valor
        this.btnRun.disabled = true; // Asigna valor
        this.resetVisuals(); // Ejecuta llamada o método
        SoundEffects.click(); // Ejecuta llamada o método

        const prop = this.currentProp; // Declara e inicializa "prop"

        // PASO 1: Inspeccionar Nodo Hijo (Instancia directa)
        await this.stepNode(1, "Buscando en la instancia propia <code>hijo</code>..."); // Ejecuta llamada o método
        if (prop === "nombre") { // Evalúa condición
            // Si la propiedad es 'nombre', está directamente en hijo
            this.highlightFound(1, prop, `¡Encontrado en el Eslabón 1 (Instancia)! Valor propio: <strong>"Lucas"</strong>. No fue necesario subir en la cadena.`); // Ejecuta llamada o método
            this.finishSimulation(true); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        // Si no está, lo marcamos en rojo tenue y animamos el cable al nodo padre
        this.markNotFound(1); // Ejecuta llamada o método
        await this.stepLink("1-2"); // Ejecuta llamada o método

        // PASO 2: Inspeccionar Nodo Padre (Primer prototipo)
        await this.stepNode(2, `No está en <code>hijo</code>. Saltando a través de <code>[[Prototype]]</code> al taller de <code>padre</code>...`); // Ejecuta llamada o método
        if (prop === "profesion") { // Evalúa condición
            // Si la propiedad es 'profesion', se encuentra aquí
            this.highlightFound(2, prop, `¡Encontrado en el Eslabón 2 (padre)! Valor heredado: <strong>"Ingeniero"</strong>.`); // Ejecuta llamada o método
            this.finishSimulation(true); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        this.markNotFound(2); // Ejecuta llamada o método
        await this.stepLink("2-3"); // Ejecuta llamada o método

        // PASO 3: Inspeccionar Nodo Abuelo (Segundo prototipo en la cadena)
        await this.stepNode(3, `No está en <code>padre</code>. Subiendo otro eslabón al prototipo <code>abuelo</code>...`); // Ejecuta llamada o método
        if (prop === "apellido") { // Evalúa condición
            // Si es 'apellido', está en el abuelo
            this.highlightFound(3, prop, `¡Encontrado en el Eslabón 3 (abuelo)! Valor heredado: <strong>"Pérez"</strong>.`); // Ejecuta llamada o método
            this.finishSimulation(true); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        this.markNotFound(3); // Ejecuta llamada o método
        await this.stepLink("3-4"); // Ejecuta llamada o método

        // PASO 4: Inspeccionar Object.prototype (Raíz universal de todos los objetos)
        await this.stepNode(4, `No está en <code>abuelo</code>. Subiendo a la raíz universal de JavaScript: <code>Object.prototype</code>...`); // Ejecuta llamada o método
        if (prop === "toString") { // Evalúa condición
            // Si es 'toString', se encuentra en Object.prototype
            this.highlightFound(4, prop, `¡Encontrado en el Eslabón 4 (Object.prototype)! Método nativo heredado: <strong>f toString()</strong>.`); // Ejecuta llamada o método
            this.finishSimulation(true); // Ejecuta llamada o método
            return; // Retorna resultado
        }
        this.markNotFound(4); // Ejecuta llamada o método
        await this.stepLink("4-5"); // Ejecuta llamada o método

        // PASO 5: Fin de la Cadena -> null
        await this.stepNode(5, `No existe en ningún prototipo. Llegamos al final de la cadena: <code>null</code>.`); // Ejecuta llamada o método
        this.highlightNull(`La propiedad <code>hijo.${prop}</code> no existe en la cadena de prototipos. El motor JS devuelve <strong>undefined</strong>.`); // Ejecuta llamada o método
        this.finishSimulation(false); // Ejecuta llamada o método
    }

    // Resalta un nodo como paso activo durante la búsqueda
    static stepNode(nodeNum, message) { // Instrucción JavaScript
        return new Promise((resolve) => { // Retorna resultado
            const node = this.nodes[nodeNum]; // Declara e inicializa "node"
            if (node) { // Evalúa condición
                node.classList.add("current-step"); // Modifica clases CSS del elemento
            }
            if (this.feedback) { // Evalúa condición
                this.feedback.innerHTML = message; // Actualiza contenido en el DOM
            }
            SoundEffects.transition(); // Ejecuta llamada o método
            // Pausa de 850ms para que el usuario aprecie el paso
            setTimeout(resolve, 850); // Ejecuta llamada o método
        });
    }

    // Activa la animación del pulso de luz en el cable conector
    static stepLink(linkKey) { // Instrucción JavaScript
        return new Promise((resolve) => { // Retorna resultado
            const link = this.links[linkKey]; // Declara e inicializa "link"
            if (link) { // Evalúa condición
                link.classList.add("link-active"); // Modifica clases CSS del elemento
            }
            // Duración del viaje de la luz por el cable
            setTimeout(resolve, 550); // Ejecuta llamada o método
        });
    }

    // Marca un nodo como no poseedor de la propiedad buscada
    static markNotFound(nodeNum) { // Instrucción JavaScript
        const node = this.nodes[nodeNum]; // Declara e inicializa "node"
        if (node) { // Evalúa condición
            node.classList.remove("current-step"); // Modifica clases CSS del elemento
            node.classList.add("not-found-here"); // Modifica clases CSS del elemento
        }
    }

    // Resalta el nodo ganador con borde verde y resplandor
    static highlightFound(nodeNum, prop, message) { // Instrucción JavaScript
        const node = this.nodes[nodeNum]; // Declara e inicializa "node"
        if (node) { // Evalúa condición
            node.classList.remove("current-step"); // Modifica clases CSS del elemento
            node.classList.add("found-here"); // Modifica clases CSS del elemento
            // Ilumina la propiedad exacta dentro del nodo
            const propItem = node.querySelector(`[data-has="${prop}"]`); // Obtiene referencia DOM para "propItem"
            if (propItem) propItem.classList.add("prop-highlight"); // Evalúa condición
        }
        if (this.feedback) { // Evalúa condición
            this.feedback.innerHTML = `🎉 ${message}`; // Actualiza contenido en el DOM
        }
        SoundEffects.success(); // Ejecuta llamada o método
    }

    // Resalta el estado null cuando no se encontró en ninguna parte
    static highlightNull(message) { // Instrucción JavaScript
        const node = this.nodes[5]; // Declara e inicializa "node"
        if (node) { // Evalúa condición
            node.classList.remove("current-step"); // Modifica clases CSS del elemento
            node.classList.add("found-here"); // Modifica clases CSS del elemento
        }
        if (this.feedback) { // Evalúa condición
            this.feedback.innerHTML = `⚠️ ${message}`; // Actualiza contenido en el DOM
        }
        SoundEffects.alert(); // Ejecuta llamada o método
    }

    // Restablece los controles al concluir la simulación
    static finishSimulation() { // Instrucción JavaScript
        this.isAnimating = false; // Asigna valor
        if (this.btnRun) this.btnRun.disabled = false; // Evalúa condición
    }
}

// --- MÓDULO 4: LAS 6 CARACTERÍSTICAS DINÁMICAS (SLIDE 5) ---
function initSlide5Characteristics() { // Declara función
    // Selector de pestañas y paneles de las 6 características
    const tabs = document.querySelectorAll(".char-tab-btn"); // Obtiene referencia DOM para "tabs"
    const views = document.querySelectorAll(".char-detail-view"); // Obtiene referencia DOM para "views"

    tabs.forEach((tab) => { // Instrucción JavaScript
        tab.addEventListener("click", () => { // Registra escuchador de eventos
            SoundEffects.click(); // Ejecuta llamada o método
            // Obtenemos el número de característica (1 al 6)
            const charId = tab.getAttribute("data-char"); // Declara e inicializa "charId"

            // Ocultamos las demás pestañas y vistas
            tabs.forEach((t) => t.classList.remove("active")); // Modifica clases CSS del elemento
            views.forEach((v) => v.classList.remove("active")); // Modifica clases CSS del elemento

            // Activamos la pestaña clicada
            tab.classList.add("active"); // Modifica clases CSS del elemento
            // Mostramos el panel de detalle correspondiente
            const targetView = document.getElementById(`char-view-${charId}`); // Obtiene referencia DOM para "targetView"
            if (targetView) targetView.classList.add("active"); // Evalúa condición
        });
    });

    // 4.1 Mutabilidad en caliente del prototipo
    const btnMutate = document.getElementById("btnMutateProto"); // Obtiene referencia DOM para "btnMutate"
    const mutResult = document.getElementById("mutationResult"); // Obtiene referencia DOM para "mutResult"
    if (btnMutate && mutResult) { // Evalúa condición
        // Constructor Robot
        function Robot(nombre) { // Declara función
            this.nombre = nombre; // Asigna valor
        }
        // Creamos la instancia ANTES de agregar el método
        const bot1 = new Robot("R2-D2"); // Declara e inicializa "bot1"

        btnMutate.addEventListener("click", () => { // Registra escuchador de eventos
            // Modificamos el prototipo en tiempo de ejecución (en caliente)
            Robot.prototype.saludar = function() { // Asigna valor
                return `Beep boop! Soy ${this.nombre} y ahora hablo gracias a la mutabilidad del prototipo.`; // Retorna resultado
            };
            // bot1 puede invocar inmediatamente el nuevo método sin haber sido reiniciado
            mutResult.innerHTML = `
                <strong style="color:#34d399">¡Prototipo Mutado en Caliente!</strong><br>
                Llamando a bot1.saludar():<br>
                <em>"${bot1.saludar()}"</em>
            `;
            SoundEffects.success(); // Ejecuta llamada o método
            showToast("Robot.prototype.saludar() inyectado", "⚡"); // Ejecuta llamada o método
        });
    }

    // 4.2 Es en sí mismo un objeto
    const btnInspect = document.getElementById("btnInspectProtoObject"); // Obtiene referencia DOM para "btnInspect"
    const inspectOutput = document.getElementById("inspectProtoObjectOutput"); // Obtiene referencia DOM para "inspectOutput"
    if (btnInspect && inspectOutput) { // Evalúa condición
        btnInspect.addEventListener("click", () => { // Registra escuchador de eventos
            function Persona() {}
            // Agregamos propiedades al prototipo
            Persona.prototype.especie = "Humano"; // Asigna valor
            Persona.prototype.planeta = "Tierra"; // Asigna valor

            // Inspeccionamos como objeto convencional
            const info = { // Declara e inicializa "info"
                "typeof Persona.prototype": typeof Persona.prototype,
                "Object.keys(Persona.prototype)": Object.keys(Persona.prototype),
                "Prototipo de Persona.prototype": Object.getPrototypeOf(Persona.prototype) === Object.prototype ? "Object.prototype (Raíz)" : "Otro"
            };

            // Formateamos como JSON indentado
            inspectOutput.textContent = JSON.stringify(info, null, 2); // Actualiza contenido en el DOM
            SoundEffects.success(); // Ejecuta llamada o método
        });
    }

    // 4.3 Existencia en memoria RAM y calculadora de ahorro
    const slider = document.getElementById("instanceCountSlider"); // Obtiene referencia DOM para "slider"
    const sliderVal = document.getElementById("instanceCountVal"); // Obtiene referencia DOM para "sliderVal"
    const badFill = document.getElementById("badMemFill"); // Obtiene referencia DOM para "badFill"
    const badText = document.getElementById("badMemText"); // Obtiene referencia DOM para "badText"

    if (slider && sliderVal && badFill && badText) { // Evalúa condición
        slider.addEventListener("input", (e) => { // Registra escuchador de eventos
            // Leemos el valor del control deslizante (100 a 10,000)
            const count = parseInt(e.target.value, 10); // Declara e inicializa "count"
            sliderVal.textContent = `${count.toLocaleString()} instancias`; // Actualiza contenido en el DOM

            // Calculamos el porcentaje relativo para la barra de mala práctica
            const pct = Math.min(100, Math.max(10, (count / 10000) * 100)); // Declara e inicializa "pct"
            badFill.style.width = `${pct}%`; // Asigna valor

            // Estimación pedagógica: cada función de objeto duplicada toma ~280 bytes en el Heap
            const memoryKbs = ((count * 280) / 1024).toFixed(1); // Declara e inicializa "memoryKbs"
            badText.textContent = `~${count.toLocaleString()} funciones duplicadas (desperdicia ~${memoryKbs} KB de RAM)`; // Actualiza contenido en el DOM
        });
    }

    // 4.4 Modificado y llamado directamente sin instanciar
    const btnCallDirect = document.getElementById("btnTestDirectCall"); // Obtiene referencia DOM para "btnCallDirect"
    const directResult = document.getElementById("directCallResult"); // Obtiene referencia DOM para "directResult"
    if (btnCallDirect && directResult) { // Evalúa condición
        // Objeto prototipo con método sumar
        const PrototipoCalculadora = { // Declara e inicializa "PrototipoCalculadora"
            sumar: function(a, b) { // Instrucción JavaScript
                return a + b; // Retorna resultado
            }
        };

        btnCallDirect.addEventListener("click", () => { // Registra escuchador de eventos
            // Invocación directa del método en el prototipo
            const res = PrototipoCalculadora.sumar(12, 8); // Declara e inicializa "res"
            directResult.innerHTML = `
                Resultado de PrototipoCalculadora.sumar(12, 8): <strong style="color:#34d399">${res}</strong><br>
                <small style="color:#94a3b8">¡Invocado directamente como cualquier objeto, sin crear instancias 'new'!</small>
            `;
            SoundEffects.success(); // Ejecuta llamada o método
        });
    }

    // 4.6 Hereda valores y métodos con contexto 'this' dinámico
    const btnThis = document.getElementById("btnTestThisContext"); // Obtiene referencia DOM para "btnThis"
    const thisResult = document.getElementById("thisContextResult"); // Obtiene referencia DOM para "thisResult"
    if (btnThis && thisResult) { // Evalúa condición
        // Prototipo con propiedad moneda y método que usa 'this'
        const PrototipoCuenta = { // Declara e inicializa "PrototipoCuenta"
            moneda: "USD",
            mostrarSaldo: function() { // Instrucción JavaScript
                return `Saldo actual de ${this.titular}: $${this.saldo} ${this.moneda}`; // Retorna resultado
            }
        };
        // Creamos una cuenta individual que delega en PrototipoCuenta
        const cuentaAhorros = Object.create(PrototipoCuenta); // Declara e inicializa "cuentaAhorros"
        cuentaAhorros.titular = "Ana Gómez"; // Asigna valor
        cuentaAhorros.saldo = 3450; // Asigna valor

        btnThis.addEventListener("click", () => { // Registra escuchador de eventos
            // El método se ejecuta en el prototipo pero 'this' apunta a cuentaAhorros
            const res = cuentaAhorros.mostrarSaldo(); // Declara e inicializa "res"
            thisResult.innerHTML = `
                <strong>${res}</strong><br>
                <span style="color:#94a3b8">El código de la función vive en el prototipo, pero <code>this</code> resolvió a <code>cuentaAhorros</code>.</span>
            `;
            SoundEffects.success(); // Ejecuta llamada o método
        });
    }
}

// --- MÓDULO 5: METÁFORA DE LA CAJA DE HERRAMIENTAS (SLIDE 6) ---
class ToolboxSimulator { // Define clase
    static init() { // Instrucción JavaScript
        this.toolButtons = document.querySelectorAll(".tool-btn"); // Asigna valor
        this.banner = document.getElementById("toolboxBanner"); // Asigna valor
        this.bannerText = document.getElementById("bannerText"); // Asigna valor
        this.bannerIcon = document.getElementById("bannerIcon"); // Asigna valor

        // Los 3 talleres familiares
        this.workshops = { // Asigna valor
            you: document.getElementById("ws-you"),
            father: document.getElementById("ws-father"),
            grandpa: document.getElementById("ws-grandpa")
        };

        // Estados de texto en cada taller
        this.statuses = { // Asigna valor
            you: document.getElementById("status-you"),
            father: document.getElementById("status-father"),
            grandpa: document.getElementById("status-grandpa")
        };

        this.bindEvents(); // Ejecuta llamada o método
        // Seleccionamos martillo por defecto
        this.selectTool("martillo"); // Ejecuta llamada o método
    }

    static bindEvents() { // Instrucción JavaScript
        this.toolButtons.forEach((btn) => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.toolButtons.forEach((b) => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                const tool = btn.getAttribute("data-tool"); // Declara e inicializa "tool"
                this.selectTool(tool); // Ejecuta llamada o método
            });
        });
    }

    // Resuelve visualmente la búsqueda de herramientas según la cadena de delegación
    static selectTool(toolName) { // Instrucción JavaScript
        // Reiniciamos clases de búsqueda
        Object.values(this.workshops).forEach((ws) => { // Instrucción JavaScript
            if (ws) ws.classList.remove("ws-active-search", "ws-found"); // Evalúa condición
        });
        document.querySelectorAll(".ws-item").forEach((it) => it.classList.remove("highlight-item")); // Modifica clases CSS del elemento

        // Caso 1: Destornillador (Vive en tu propio bolsillo / Propiedad Propia)
        if (toolName === "destornillador") { // Evalúa condición
            this.workshops.you.classList.add("ws-found"); // Modifica clases CSS del elemento
            this.highlightToolItem("destornillador"); // Ejecuta llamada o método
            this.statuses.you.textContent = "✔ ¡La tienes en tu propio bolsillo!"; // Actualiza contenido en el DOM
            this.statuses.father.textContent = "No necesitó molestar al padre"; // Actualiza contenido en el DOM
            this.statuses.grandpa.textContent = "Sin consultas"; // Actualiza contenido en el DOM

            this.setBanner("🎉 Destornillador encontrado en tu propio bolsillo (Propiedad Propia). No fue necesario pedir prestado a la familia.", "👦"); // Ejecuta llamada o método
            SoundEffects.success(); // Ejecuta llamada o método
        } else if (toolName === "martillo") { // Instrucción JavaScript
            // Caso 2: Martillo (No lo tienes tú, lo tiene tu Padre en su taller / Prototipo 1)
            this.workshops.you.classList.add("ws-active-search"); // Modifica clases CSS del elemento
            this.workshops.father.classList.add("ws-found"); // Modifica clases CSS del elemento
            this.highlightToolItem("martillo"); // Ejecuta llamada o método

            this.statuses.you.textContent = "❌ No la tienes tú"; // Actualiza contenido en el DOM
            this.statuses.father.textContent = "✔ ¡Tu padre la tiene en su taller!"; // Actualiza contenido en el DOM
            this.statuses.grandpa.textContent = "Sin consultas"; // Actualiza contenido en el DOM

            this.setBanner("🔨 No tenías martillo, así que fuiste al taller de tu Padre (Prototipo directo) y te lo prestó.", "👨"); // Ejecuta llamada o método
            SoundEffects.success(); // Ejecuta llamada o método
        } else if (toolName === "sierra") { // Instrucción JavaScript
            // Caso 3: Sierra eléctrica (Ni tú ni tu padre la tienen; tu Abuelo la tiene / Prototipo 2)
            this.workshops.you.classList.add("ws-active-search"); // Modifica clases CSS del elemento
            this.workshops.father.classList.add("ws-active-search"); // Modifica clases CSS del elemento
            this.workshops.grandpa.classList.add("ws-found"); // Modifica clases CSS del elemento
            this.highlightToolItem("sierra"); // Ejecuta llamada o método

            this.statuses.you.textContent = "❌ No la tienes tú"; // Actualiza contenido en el DOM
            this.statuses.father.textContent = "❌ Tu padre tampoco la tiene"; // Actualiza contenido en el DOM
            this.statuses.grandpa.textContent = "✔ ¡Tu abuelo la tiene en el desván!"; // Actualiza contenido en el DOM

            this.setBanner("🪚 Ni tú ni tu padre tenían sierra eléctrica, así que tu padre fue al taller del Abuelo (Prototype Chain completa).", "👴"); // Ejecuta llamada o método
            SoundEffects.success(); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            // Caso 4: Herramienta inexistente (Cúter Láser) -> Recorre toda la familia y llega a null
            this.workshops.you.classList.add("ws-active-search"); // Modifica clases CSS del elemento
            this.workshops.father.classList.add("ws-active-search"); // Modifica clases CSS del elemento
            this.workshops.grandpa.classList.add("ws-active-search"); // Modifica clases CSS del elemento

            this.statuses.you.textContent = "❌ No existe"; // Actualiza contenido en el DOM
            this.statuses.father.textContent = "❌ No existe"; // Actualiza contenido en el DOM
            this.statuses.grandpa.textContent = "❌ Nadie la tiene (null)"; // Actualiza contenido en el DOM

            this.setBanner("⚠️ Nadie en toda la familia carpintera tiene un cúter láser. Búsqueda llegó a null → undefined.", "❓"); // Ejecuta llamada o método
            SoundEffects.alert(); // Ejecuta llamada o método
        }
    }

    // Resalta el elemento de herramienta visual en el taller
    static highlightToolItem(tool) { // Instrucción JavaScript
        const item = document.querySelector(`[data-has-item="${tool}"]`); // Obtiene referencia DOM para "item"
        if (item) item.classList.add("highlight-item"); // Evalúa condición
    }

    // Actualiza el texto del banner informativo
    static setBanner(text, icon) { // Instrucción JavaScript
        if (this.bannerText) this.bannerText.textContent = text; // Evalúa condición
        if (this.bannerIcon) this.bannerIcon.textContent = icon; // Evalúa condición
    }
}

// --- MÓDULO 6: SIMULADOR DE ERROR CON ARRAYS COMPARTIDOS (SLIDE 7) ---
function initSlide7Bugs() { // Declara función
    const btnBug = document.getElementById("btnTriggerBugDemo"); // Obtiene referencia DOM para "btnBug"
    const output = document.getElementById("bugSimOutput"); // Obtiene referencia DOM para "output"

    if (!btnBug || !output) return; // Evalúa condición

    btnBug.addEventListener("click", () => { // Registra escuchador de eventos
        SoundEffects.alert(); // Ejecuta llamada o método
        // Error clásico: colocar un array mutable directamente en el objeto prototipo
        const PrototipoUsuario = { // Declara e inicializa "PrototipoUsuario"
            amigos: [] // ⚠️ Compartido por referencia física en memoria
        };

        // Creamos dos instancias
        const user1 = Object.create(PrototipoUsuario); // Declara e inicializa "user1"
        const user2 = Object.create(PrototipoUsuario); // Declara e inicializa "user2"

        // user1 añade a su amigo 'Ana' al array
        user1.amigos.push("Ana"); // Ejecuta llamada o método

        // Al inspeccionar user2, ¡también tiene a Ana aunque nunca la agregó!
        output.innerHTML = `
            <strong>⚠️ ¡ERROR DETECTADO!</strong><br>
            user1 agregó a "Ana", pero mira la lista de user2:<br>
            <code>user2.amigos: ["${user2.amigos.join('", "')}"]</code><br>
            <small>¡user2 ahora tiene los amigos de user1 porque ambos apuntan al mismo Array en RAM!</small>
        `;
        showToast("Bug de Array compartido reproducido", "💥"); // Ejecuta llamada o método
    });
}

// --- MÓDULO 7: PLAYGROUND & CONSOLA VIRTUAL EN VIVO (SLIDE 8) ---
class PlaygroundManager { // Define clase
    static init() { // Instrucción JavaScript
        this.editor = document.getElementById("liveCodeEditor"); // Asigna valor
        this.consoleContainer = document.getElementById("consoleLogsContainer"); // Asigna valor
        this.presetSelect = document.getElementById("codePresetSelect"); // Asigna valor
        this.btnRun = document.getElementById("btnRunEditorCode"); // Asigna valor
        this.btnClear = document.getElementById("btnClearConsole"); // Asigna valor
        this.btnReset = document.getElementById("btnResetCode"); // Asigna valor

        // Plantillas de código listas para ejecutar
        this.presets = { // Asigna valor
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

        this.bindEvents(); // Ejecuta llamada o método
        // Cargamos el primer ejemplo por defecto
        this.loadPreset("preset-1"); // Ejecuta llamada o método
    }

    static bindEvents() { // Instrucción JavaScript
        if (this.btnRun) { // Evalúa condición
            this.btnRun.addEventListener("click", () => this.runCode()); // Registra escuchador de eventos
        }
        if (this.btnClear) { // Evalúa condición
            this.btnClear.addEventListener("click", () => this.clearConsole()); // Registra escuchador de eventos
        }
        if (this.btnReset) { // Evalúa condición
            this.btnReset.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.loadPreset(this.presetSelect.value); // Ejecuta llamada o método
                showToast("Código restaurado", "↺"); // Ejecuta llamada o método
            });
        }
        if (this.presetSelect) { // Evalúa condición
            this.presetSelect.addEventListener("change", (e) => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.loadPreset(e.target.value); // Ejecuta llamada o método
            });
        }
    }

    // Carga un snippet de código en el textarea del editor
    static loadPreset(key) { // Instrucción JavaScript
        if (this.editor && this.presets[key]) { // Evalúa condición
            this.editor.value = this.presets[key]; // Asigna valor
            if (this.presetSelect && this.presets[key] && !key.startsWith("preset-ex")) { // Evalúa condición
                this.presetSelect.value = key; // Asigna valor
            }
        }
    }

    // Limpia las líneas impresas en la consola virtual
    static clearConsole() { // Instrucción JavaScript
        if (this.consoleContainer) { // Evalúa condición
            this.consoleContainer.innerHTML = `
                <div class="log-line info-line">
                    <span class="log-time">[Consola limpia]</span> Lista para nuevas ejecuciones...
                </div>
            `;
            SoundEffects.click(); // Ejecuta llamada o método
        }
    }

    // Inserta una línea de mensaje con timestamp y clase de color en la consola
    static appendLog(message, type = "normal") { // Instrucción JavaScript
        if (!this.consoleContainer) return; // Evalúa condición
        const now = new Date(); // Declara e inicializa "now"
        const timeStr = now.toTimeString().split(" ")[0]; // Declara e inicializa "timeStr"

        const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
        line.className = `log-line log-${type}`; // Asigna valor
        line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`; // Actualiza contenido en el DOM
        this.consoleContainer.appendChild(line); // Inserta nodo en el DOM
        // Desplaza el scroll automáticamente al final
        this.consoleContainer.scrollTop = this.consoleContainer.scrollHeight; // Asigna valor
    }

    // Ejecuta el código JavaScript escrito por el usuario de forma segura en un sandbox
    static runCode() { // Instrucción JavaScript
        if (!this.editor) return; // Evalúa condición
        const userCode = this.editor.value; // Declara e inicializa "userCode"
        SoundEffects.click(); // Ejecuta llamada o método

        this.appendLog("--- Ejecutando snippet ---", "info"); // Inserta nodo en el DOM

        // Almacén de registros capturados
        const logsCaptured = []; // Declara e inicializa "logsCaptured"

        try { // Inicia bloque protegido contra errores
            // Emulador de salida de consola que redirige a la consola visual
            const customConsole = { // Declara e inicializa "customConsole"
                log: (...args) => { // Instrucción JavaScript
                    const formatted = args.map((arg) => { // Define función flecha "formatted"
                        if (typeof arg === "object" && arg !== null) { // Evalúa condición
                            try { // Inicia bloque protegido contra errores
                                return JSON.stringify(arg, (k, v) => typeof v === "function" ? "[Function]" : v); // Retorna resultado
                            } catch (e) { // Instrucción JavaScript
                                return String(arg); // Retorna resultado
                            }
                        }
                        return String(arg); // Retorna resultado
                    }).join(" "); // Ejecuta llamada o método
                    logsCaptured.push(formatted); // Ejecuta llamada o método
                    this.appendLog(formatted, "normal"); // Inserta nodo en el DOM
                },
                error: (...args) => { // Instrucción JavaScript
                    const formatted = args.join(" "); // Declara e inicializa "formatted"
                    this.appendLog(formatted, "error"); // Inserta nodo en el DOM
                }
            };

            // Ejecutamos en función con alcance aislado pasando nuestro customConsole
            const runner = new Function("console", userCode); // Declara e inicializa "runner"
            runner(customConsole); // Ejecuta llamada o método

            SoundEffects.success(); // Ejecuta llamada o método
            this.appendLog("✔ Ejecución finalizada sin errores.", "success"); // Inserta nodo en el DOM
        } catch (err) { // Instrucción JavaScript
            // Captura de errores en tiempo de ejecución (ej. sintaxis o referencias inválidas)
            SoundEffects.alert(); // Ejecuta llamada o método
            this.appendLog(`❌ Error en tiempo de ejecución: ${err.message}`, "error"); // Inserta nodo en el DOM
        }
    }
}

// --- MÓDULO 8: RETOS Y SOLUCIONES (SLIDE 9) ---
function initSlide9Exercises() { // Declara función
    // Botones para alternar visibilidad de las soluciones
    document.querySelectorAll(".btn-ex-solution").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            SoundEffects.click(); // Ejecuta llamada o método
            const targetId = btn.getAttribute("data-sol"); // Declara e inicializa "targetId"
            const solBox = document.getElementById(targetId); // Obtiene referencia DOM para "solBox"
            if (solBox) { // Evalúa condición
                const isVisible = solBox.classList.contains("visible"); // Declara e inicializa "isVisible"
                solBox.classList.toggle("visible"); // Modifica clases CSS del elemento
                btn.textContent = isVisible ? "Ver Solución Paso a Paso" : "Ocultar Solución"; // Actualiza contenido en el DOM
            }
        });
    });

    // Botones para cargar el reto directamente en el playground interactivo
    document.querySelectorAll("[data-load-preset]").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa "presetKey"
            SoundEffects.click(); // Ejecuta llamada o método
            // Cargamos el código del reto
            PlaygroundManager.loadPreset(presetKey); // Ejecuta llamada o método
            // Saltamos a la diapositiva 8 (Playground)
            PresentationController.goToSlide(8); // Ejecuta llamada o método
            showToast("Reto cargado en el Playground. ¡Presiona Ejecutar!", "🚀"); // Ejecuta llamada o método
        });
    });
}

// --- MÓDULO 9: CHULETA RÁPIDA (SLIDE 10) ---
function initSlide10Summary() { // Declara función
    const btnCopyCheat = document.getElementById("btnCopySummaryCheat"); // Obtiene referencia DOM para "btnCopyCheat"
    if (!btnCopyCheat) return; // Evalúa condición

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

    btnCopyCheat.addEventListener("click", () => { // Registra escuchador de eventos
        // Copiamos el texto al portapapeles
        navigator.clipboard.writeText(cheatSheetMarkdown).then(() => { // Instrucción JavaScript
            SoundEffects.success(); // Ejecuta llamada o método
            showToast("¡Chuleta en Markdown copiada al portapapeles!", "📋"); // Ejecuta llamada o método
        });
    });
}

// --- INICIALIZACIÓN GLOBAL AL CARGAR EL DOM ---
// Esperamos a que la estructura HTML esté totalmente parseada para arrancar todos los módulos
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    // 1. Iniciamos el controlador de diapositivas y navegación
    PresentationController.init(); // Ejecuta llamada o método
    // 2. Iniciamos la demostración básica de prototipos
    initSlide2Demo(); // Ejecuta llamada o método
    // 3. Iniciamos el comprobador de identidad en memoria
    initSlide3Demo(); // Ejecuta llamada o método
    // 4. Iniciamos el simulador interactivo de Prototype Chain
    PrototypeChainSimulator.init(); // Ejecuta llamada o método
    // 5. Iniciamos las 6 características y la calculadora de RAM
    initSlide5Characteristics(); // Ejecuta llamada o método
    // 6. Iniciamos la metáfora visual de la caja de herramientas familiar
    ToolboxSimulator.init(); // Ejecuta llamada o método
    // 7. Iniciamos el simulador de errores de arrays mutables
    initSlide7Bugs(); // Ejecuta llamada o método
    // 8. Iniciamos el playground con consola virtual
    PlaygroundManager.init(); // Ejecuta llamada o método
    // 9. Iniciamos los retos prácticos de 3 niveles
    initSlide9Exercises(); // Ejecuta llamada o método
    // 10. Iniciamos el módulo de resumen y chuleta
    initSlide10Summary(); // Ejecuta llamada o método

    console.log("✨ Presentación de Prototipos cargada con éxito en JavaScript Master Level."); // Imprime salida en consola
});
