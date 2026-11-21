/**
 * ==============================================================================
 * JAVASCRIPT MASTER LEVEL: EL MODO ESTRICTO ("use strict")
 * Archivo: app.js
 * Lógica Interactiva, Simuladores Sloppy vs Strict, Consola Virtual y Navegación
 * Documentación pedagógica línea por línea para fines de estudio y aprendizaje
 * ==============================================================================
 */

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
        this.playTone(523.25, 'sine', 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() { // Instrucción JavaScript
        this.playTone(320, 'sine', 0.06, 0.03); // Ejecuta llamada o método
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
    const toast = document.getElementById("toastNotification"); // Obtiene referencia DOM para "toast"
    const toastMsg = document.getElementById("toastMsg"); // Obtiene referencia DOM para "toastMsg"
    const toastIcon = document.getElementById("toastIcon"); // Obtiene referencia DOM para "toastIcon"

    if (!toast || !toastMsg) return; // Evalúa condición

    toastMsg.textContent = message; // Actualiza contenido en el DOM
    if (toastIcon) toastIcon.textContent = icon; // Evalúa condición

    toast.classList.add("active"); // Modifica clases CSS del elemento
    clearTimeout(toast._timeout); // Ejecuta llamada o método
    toast._timeout = setTimeout(() => { // Asigna valor
        toast.classList.remove("active"); // Modifica clases CSS del elemento
    }, 2800); // Ejecuta llamada o método
}

// --- MÓDULO DE CONTROLADOR DE PRESENTACIÓN ---
// Gestiona el ciclo de vida de las diapositivas, transiciones, teclado y controles
class PresentationController { // Define clase
    static init() { // Instrucción JavaScript
        this.slides = document.querySelectorAll(".slide"); // Asigna valor
        AppState.totalSlides = this.slides.length; // Asigna valor

        this.renderDots(); // Ejecuta llamada o método
        this.renderOverview(); // Ejecuta llamada o método
        this.goToSlide(1, false); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
    }

    // Renderiza dinámicamente los puntos de navegación en el dock inferior
    static renderDots() { // Instrucción JavaScript
        const container = document.getElementById("slideDotsContainer"); // Obtiene referencia DOM para "container"
        if (!container) return; // Evalúa condición
        container.innerHTML = ""; // Actualiza contenido en el DOM

        for (let i = 1; i <= AppState.totalSlides; i++) { // Inicia bucle de iteración
            const dot = document.createElement("div"); // Crea nuevo elemento DOM "dot"
            dot.className = `slide-dot ${i === 1 ? "active" : ""}`; // Asigna valor
            dot.title = `Diapositiva ${i}`; // Asigna valor
            dot.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(i); // Ejecuta llamada o método
            });
            container.appendChild(dot); // Inserta nodo en el DOM
        }
    }

    // Renderiza la lista de miniaturas en el modal de vista panorámica (Overview)
    static renderOverview() { // Instrucción JavaScript
        const grid = document.getElementById("overviewGrid"); // Obtiene referencia DOM para "grid"
        if (!grid) return; // Evalúa condición
        grid.innerHTML = ""; // Actualiza contenido en el DOM

        this.slides.forEach((slide, index) => { // Instrucción JavaScript
            const num = index + 1; // Declara e inicializa "num"
            const title = slide.getAttribute("data-title") || `Diapositiva ${num}`; // Declara e inicializa "title"
            const thumb = document.createElement("div"); // Crea nuevo elemento DOM "thumb"
            thumb.className = `overview-thumb ${num === AppState.currentSlide ? "current" : ""}`; // Asigna valor
            thumb.innerHTML = `
                <span class="thumb-num">0${num}</span>
                <span class="thumb-title">${title}</span>
            `;
            thumb.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(num); // Ejecuta llamada o método
                this.closeOverview(); // Ejecuta llamada o método
            });
            grid.appendChild(thumb); // Inserta nodo en el DOM
        });
    }

    // Navega a un número específico de diapositiva
    static goToSlide(slideNum, playSound = true) { // Instrucción JavaScript
        if (slideNum < 1 || slideNum > AppState.totalSlides) return; // Evalúa condición

        AppState.currentSlide = slideNum; // Asigna valor

        this.slides.forEach((slide) => { // Instrucción JavaScript
            const currentNum = parseInt(slide.getAttribute("data-slide"), 10); // Declara e inicializa "currentNum"
            if (currentNum === slideNum) { // Evalúa condición
                slide.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                slide.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        const progressBar = document.getElementById("progressBar"); // Obtiene referencia DOM para "progressBar"
        const slideIndicator = document.getElementById("slideIndicator"); // Obtiene referencia DOM para "slideIndicator"
        const percentage = (slideNum / AppState.totalSlides) * 100; // Declara e inicializa "percentage"

        if (progressBar) progressBar.style.width = `${percentage}%`; // Evalúa condición
        if (slideIndicator) slideIndicator.textContent = `${slideNum} / ${AppState.totalSlides}`; // Evalúa condición

        const dots = document.querySelectorAll(".slide-dot"); // Obtiene referencia DOM para "dots"
        dots.forEach((dot, idx) => { // Instrucción JavaScript
            if (idx + 1 === slideNum) { // Evalúa condición
                dot.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                dot.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        window.scrollTo({ top: 0, behavior: "smooth" }); // Ejecuta llamada o método

        if (playSound) SoundEffects.transition(); // Evalúa condición

        if (!AppState.isPresentationMode) { // Evalúa condición
            const targetSlide = document.getElementById(`slide-${slideNum}`); // Obtiene referencia DOM para "targetSlide"
            if (targetSlide) { // Evalúa condición
                targetSlide.scrollIntoView({ behavior: "smooth" }); // Ejecuta llamada o método
            }
        }
    }

    static nextSlide() { // Instrucción JavaScript
        if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
            this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            SoundEffects.alert(); // Ejecuta llamada o método
            showToast("Estás en la última diapositiva", "ℹ️"); // Ejecuta llamada o método
        }
    }

    static prevSlide() { // Instrucción JavaScript
        if (AppState.currentSlide > 1) { // Evalúa condición
            this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            SoundEffects.alert(); // Ejecuta llamada o método
            showToast("Estás en el inicio de la presentación", "ℹ️"); // Ejecuta llamada o método
        }
    }

    static toggleMode() { // Instrucción JavaScript
        AppState.isPresentationMode = !AppState.isPresentationMode; // Asigna valor
        const modeText = document.getElementById("modeText"); // Obtiene referencia DOM para "modeText"
        const modeIcon = document.getElementById("modeIcon"); // Obtiene referencia DOM para "modeIcon"

        if (AppState.isPresentationMode) { // Evalúa condición
            document.body.classList.remove("mode-document"); // Modifica clases CSS del elemento
            document.body.classList.add("mode-presentation"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Guía"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "📑"; // Evalúa condición
            this.goToSlide(AppState.currentSlide, false); // Ejecuta llamada o método
            showToast("Cambiado a Modo Presentación Interactiva (Diapositivas)", "🖥️"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            document.body.classList.remove("mode-presentation"); // Modifica clases CSS del elemento
            document.body.classList.add("mode-document"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Slides"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "📽️"; // Evalúa condición
            showToast("Cambiado a Modo Guía Completa de Estudio", "📖"); // Ejecuta llamada o método
        }
        SoundEffects.click(); // Ejecuta llamada o método
    }

    static openOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            this.renderOverview(); // Ejecuta llamada o método
            modal.classList.add("active"); // Modifica clases CSS del elemento
            SoundEffects.click(); // Ejecuta llamada o método
        }
    }

    static closeOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            modal.classList.remove("active"); // Modifica clases CSS del elemento
        }
    }

    static toggleFullscreen() { // Instrucción JavaScript
        SoundEffects.click(); // Ejecuta llamada o método
        if (!document.fullscreenElement) { // Evalúa condición
            document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
            showToast("Pantalla Completa Activada", "⛶"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            if (document.exitFullscreen) { // Evalúa condición
                document.exitFullscreen().catch(() => {}); // Ejecuta llamada o método
            }
            showToast("Pantalla Completa Desactivada", "⛶"); // Ejecuta llamada o método
        }
    }

    static bindEvents() { // Instrucción JavaScript
        const btnNext = document.getElementById("btnNextSlide"); // Obtiene referencia DOM para "btnNext"
        const btnPrev = document.getElementById("btnPrevSlide"); // Obtiene referencia DOM para "btnPrev"
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición

        const btnGoLab = document.getElementById("btnGoLab"); // Obtiene referencia DOM para "btnGoLab"
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(9)); // Evalúa condición

        const btnToggleMode = document.getElementById("btnToggleMode"); // Obtiene referencia DOM para "btnToggleMode"
        const btnToggleSound = document.getElementById("btnToggleSound"); // Obtiene referencia DOM para "btnToggleSound"
        const btnOverview = document.getElementById("btnOverview"); // Obtiene referencia DOM para "btnOverview"
        const btnFullscreen = document.getElementById("btnFullscreen"); // Obtiene referencia DOM para "btnFullscreen"
        const btnCloseOverview = document.getElementById("btnCloseOverview"); // Obtiene referencia DOM para "btnCloseOverview"

        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode()); // Evalúa condición

        if (btnToggleSound) { // Evalúa condición
            btnToggleSound.addEventListener("click", () => { // Registra escuchador de eventos
                AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
                const icon = document.getElementById("soundIcon"); // Obtiene referencia DOM para "icon"
                if (icon) icon.textContent = AppState.soundEnabled ? "🔊" : "🔇"; // Evalúa condición
                showToast(AppState.soundEnabled ? "Audio Activado" : "Audio Silenciado", AppState.soundEnabled ? "🔊" : "🔇"); // Ejecuta llamada o método
                if (AppState.soundEnabled) SoundEffects.click(); // Evalúa condición
            });
        }

        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview()); // Evalúa condición
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview()); // Evalúa condición
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen()); // Evalúa condición

        const btnStart = document.getElementById("btnStartPresentation"); // Obtiene referencia DOM para "btnStart"
        if (btnStart) { // Evalúa condición
            btnStart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(2); // Ejecuta llamada o método
            });
        }

        document.querySelectorAll("[data-jump]").forEach((item) => { // Instrucción JavaScript
            item.addEventListener("click", () => { // Registra escuchador de eventos
                const target = parseInt(item.getAttribute("data-jump"), 10); // Declara e inicializa "target"
                if (target) { // Evalúa condición
                    SoundEffects.click(); // Ejecuta llamada o método
                    this.goToSlide(target); // Ejecuta llamada o método
                }
            });
        });

        const btnRestart = document.getElementById("btnRestartPresentation"); // Obtiene referencia DOM para "btnRestart"
        if (btnRestart) { // Evalúa condición
            btnRestart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(1); // Ejecuta llamada o método
            });
        }

        window.addEventListener("keydown", (e) => { // Registra escuchador de eventos
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { // Evalúa condición
                    e.preventDefault(); // Ejecuta llamada o método
                    PlaygroundManager.runCode(); // Ejecuta llamada o método
                }
                return; // Retorna resultado
            }

            switch (e.key) { // Evalúa múltiples casos
                case "ArrowRight":
                case "d":
                case "D":
                case " ":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.nextSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case "ArrowLeft":
                case "a":
                case "A":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.prevSlide(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
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
                case "f":
                case "F":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleFullscreen(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case "m":
                case "M":
                    e.preventDefault(); // Ejecuta llamada o método
                    this.toggleMode(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
                case "Escape":
                    this.closeOverview(); // Ejecuta llamada o método
                    break; // Instrucción JavaScript
            }
        });

        const modalOverlay = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modalOverlay"
        if (modalOverlay) { // Evalúa condición
            modalOverlay.addEventListener("click", (e) => { // Registra escuchador de eventos
                if (e.target === modalOverlay) this.closeOverview(); // Evalúa condición
            });
        }
    }
}

// --- MÓDULO 1: DEMOSTRACIÓN DE DIRECTIVA INTRODUCTORIA (SLIDE 2) ---
function initSlide2Demo() { // Declara función
    const btnTest = document.getElementById("btnTestStrictIntro"); // Obtiene referencia DOM para "btnTest"
    const consoleOut = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOut"
    const status = document.getElementById("testStrictIntroStatus"); // Obtiene referencia DOM para "status"

    if (!btnTest || !consoleOut) return; // Evalúa condición

    btnTest.addEventListener("click", () => { // Registra escuchador de eventos
        SoundEffects.click(); // Ejecuta llamada o método

        let resultado = ""; // Declara e inicializa "resultado"
        try { // Inicia bloque protegido contra errores
            // Evaluamos una función en modo estricto que intenta asignar sin declarar
            const funcionEstricta = new Function(`
                "use strict";
                usuarioSinDeclarar = "Elena";
            `);
            funcionEstricta(); // Ejecuta llamada o método
        } catch (error) { // Instrucción JavaScript
            resultado = error.name + ": " + error.message; // Asigna valor
        }

        consoleOut.innerHTML = `
            <div><span style="color:#64748b">&gt;</span> <span style="color:#f43f5e; font-weight:700;">¡EXCEPCIÓN LANZADA POR EL MOTOR!</span></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#fcd34d">${resultado}</span></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#34d399">Resultado: Se impidió la creación accidental de 'window.usuarioSinDeclarar'.</span></div>
        `;

        if (status) { // Evalúa condición
            status.textContent = "✔ ReferenceError capturado con éxito"; // Actualiza contenido en el DOM
            status.style.color = "#34d399"; // Asigna valor
        }
        SoundEffects.success(); // Ejecuta llamada o método
    });

    document.querySelectorAll(".btn-copy-code").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            const targetId = btn.getAttribute("data-target"); // Declara e inicializa "targetId"
            const codeEl = document.getElementById(targetId); // Obtiene referencia DOM para "codeEl"
            if (codeEl) { // Evalúa condición
                navigator.clipboard.writeText(codeEl.innerText).then(() => { // Instrucción JavaScript
                    btn.textContent = "¡Copiado!"; // Actualiza contenido en el DOM
                    SoundEffects.success(); // Ejecuta llamada o método
                    showToast("Código copiado al portapapeles", "📋"); // Ejecuta llamada o método
                    setTimeout(() => { btn.textContent = "Copiar"; }, 2000); // Actualiza contenido en el DOM
                });
            }
        });
    });
}

// --- MÓDULO 2: COMPROBACIÓN DE MODO ESTRICTO EN CLASES ES6 (SLIDE 3) ---
function initSlide3Demo() { // Declara función
    const btnCheck = document.getElementById("btnCheckAutoStrict"); // Obtiene referencia DOM para "btnCheck"
    const resultBox = document.getElementById("autoStrictResult"); // Obtiene referencia DOM para "resultBox"

    if (!btnCheck || !resultBox) return; // Evalúa condición

    btnCheck.addEventListener("click", () => { // Registra escuchador de eventos
        // En una clase ES6, el modo estricto se activa automáticamente sin necesidad de escribir "use strict";
        class PruebaClase { // Define clase
            metodoVerificador() { // Instrucción JavaScript
                // Si 'this' en una función suelta o llamada no vinculada es undefined, estamos en strict mode
                return (function() { return this; })(); // Retorna resultado
            }
        }

        const instancia = new PruebaClase(); // Declara e inicializa "instancia"
        const esStrict = instancia.metodoVerificador() === undefined; // Declara e inicializa "esStrict"

        resultBox.innerHTML = `
            <span style="color:#34d399; font-weight:700;">¡MODO ESTRICTO CONFIRMADO EN CLASES ES6!</span><br>
            El cuerpo de las clases de JavaScript siempre se ejecuta bajo <code>"use strict"</code> por especificación oficial de ECMAScript.<br>
            <code>this sin vincular: <strong>undefined</strong></code> (Es estricto: <strong>${esStrict}</strong>).
        `;
        SoundEffects.success(); // Ejecuta llamada o método
    });
}

// --- MÓDULO 3: SIMULADOR DE ERRORES SILENCIOSOS (SLIDE 4) ---
class SilentErrorsSimulator { // Define clase
    static init() { // Instrucción JavaScript
        this.currentCase = "readonly"; // Asigna valor
        this.propButtons = document.querySelectorAll(".sim-prop-btn"); // Asigna valor
        this.btnCompare = document.getElementById("btnCompareErrorModes"); // Asigna valor
        this.termSloppy = document.getElementById("terminalSloppy"); // Asigna valor
        this.termStrict = document.getElementById("terminalStrict"); // Asigna valor
        this.feedback = document.getElementById("strictFeedbackText"); // Asigna valor

        this.cases = { // Asigna valor
            "readonly": { // Instrucción JavaScript
                title: "1. Modificar propiedad de solo lectura (writable: false)",
                sloppy: `const user = {};\nObject.defineProperty(user, "id", { value: 101, writable: false });\nuser.id = 999;\n// user.id sigue siendo 101. ¡Falla en silencio total!`,
                strict: `const user = {};\nObject.defineProperty(user, "id", { value: 101, writable: false });\nuser.id = 999;\n// ❌ TypeError: Cannot assign to read only property 'id'`,
                explanation: "En Sloppy Mode, reasignar 'user.id' simplemente no hace nada y no avisa. En Strict Mode, detiene el hilo con TypeError."
            },
            "frozen": { // Instrucción JavaScript
                title: "2. Agregar propiedades a un objeto congelado (Object.freeze)",
                sloppy: `const config = { host: "localhost" };\nObject.freeze(config);\nconfig.puerto = 8080;\n// config.puerto no se agrega. Sin avisos ni errores.`,
                strict: `const config = { host: "localhost" };\nObject.freeze(config);\nconfig.puerto = 8080;\n// ❌ TypeError: Cannot add property puerto, object is not extensible`,
                explanation: "Un objeto congelado rechaza mutaciones. Sloppy Mode oculta el fallo; Strict Mode lo evidencia al instante."
            },
            "primitive": { // Instrucción JavaScript
                title: "3. Asignar valores a valores primitivos (NaN = 5)",
                sloppy: `NaN = 5;\nundefined = true;\n// JavaScript ignora la asignación en silencio absoluto.`,
                strict: `NaN = 5;\n// ❌ TypeError: Cannot assign to read only property 'NaN' of object '#<Window>'`,
                explanation: "Intentar sobrescribir identificadores globales inmutables es detenido con TypeError en Strict Mode."
            },
            "delete": { // Instrucción JavaScript
                title: "4. delete en propiedades no configurables (delete Object.prototype)",
                sloppy: `const resultado = delete Object.prototype;\n// Devuelve false y continúa como si nada.`,
                strict: `delete Object.prototype;\n// ❌ TypeError: Cannot delete property 'prototype' of function Object()`,
                explanation: "Borrar propiedades del sistema protegidas lanza TypeError en lugar de un falso booleano 'false'."
            }
        };

        this.bindEvents(); // Ejecuta llamada o método
        this.updateView(); // Ejecuta llamada o método
    }

    static bindEvents() { // Instrucción JavaScript
        this.propButtons.forEach((btn) => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.propButtons.forEach((b) => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                this.currentCase = btn.getAttribute("data-error-case"); // Asigna valor
                this.updateView(); // Ejecuta llamada o método
            });
        });

        if (this.btnCompare) { // Evalúa condición
            this.btnCompare.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                this.updateView(true); // Ejecuta llamada o método
                showToast("Comparación Sloppy vs Strict ejecutada", "⚡"); // Ejecuta llamada o método
            });
        }
    }

    static updateView(animate = false) { // Instrucción JavaScript
        const data = this.cases[this.currentCase]; // Declara e inicializa "data"
        if (!data) return; // Evalúa condición

        if (this.termSloppy) { // Evalúa condición
            this.termSloppy.innerHTML = `<pre style="font-family:var(--font-mono); color:#fcd34d;">${data.sloppy}</pre>`; // Actualiza contenido en el DOM
        }
        if (this.termStrict) { // Evalúa condición
            this.termStrict.innerHTML = `<pre style="font-family:var(--font-mono); color:#34d399;">${data.strict}</pre>`; // Actualiza contenido en el DOM
        }
        if (this.feedback) { // Evalúa condición
            this.feedback.innerHTML = `<strong>${data.title}:</strong> ${data.explanation}`; // Actualiza contenido en el DOM
        }
    }
}

// --- MÓDULO 4: RENDIMIENTO Y OPTIMIZACIÓN (SLIDE 5) ---
function initSlide5Optimization() { // Declara función
    const tabs = document.querySelectorAll(".char-tab-btn"); // Obtiene referencia DOM para "tabs"
    const views = document.querySelectorAll(".char-detail-view"); // Obtiene referencia DOM para "views"

    tabs.forEach((tab) => { // Instrucción JavaScript
        tab.addEventListener("click", () => { // Registra escuchador de eventos
            SoundEffects.click(); // Ejecuta llamada o método
            const perfId = tab.getAttribute("data-perf"); // Declara e inicializa "perfId"

            tabs.forEach((t) => t.classList.remove("active")); // Modifica clases CSS del elemento
            views.forEach((v) => v.classList.remove("active")); // Modifica clases CSS del elemento

            tab.classList.add("active"); // Modifica clases CSS del elemento
            const targetView = document.getElementById(`perf-view-${perfId}`); // Obtiene referencia DOM para "targetView"
            if (targetView) targetView.classList.add("active"); // Evalúa condición
        });
    });

    // 5.1 eval() Aislamiento
    const btnEval = document.getElementById("btnTestEvalIsolation"); // Obtiene referencia DOM para "btnEval"
    const evalResult = document.getElementById("evalIsolationResult"); // Obtiene referencia DOM para "evalResult"
    if (btnEval && evalResult) { // Evalúa condición
        btnEval.addEventListener("click", () => { // Registra escuchador de eventos
            // Demostración de eval() aislado
            const testFn = new Function(`
                "use strict";
                eval("var variableEnEval = 'Secreta';");
                return typeof variableEnEval; // ¿Se filtró al exterior?
            `);
            const tipo = testFn(); // Declara e inicializa "tipo"

            evalResult.innerHTML = `
                <strong style="color:#34d399">typeof variableEnEval fuera de eval(): "${tipo}"</strong><br>
                En Modo Estricto, eval() no contamina las variables locales circundantes.<br>
                <small style="color:#94a3b8">El motor V8 puede optimizar en memoria sin miedo a alteraciones dinámicas.</small>
            `;
            SoundEffects.success(); // Ejecuta llamada o método
        });
    }

    // 5.2 arguments desvinculado
    const btnArgs = document.getElementById("btnTestArgumentsIndependence"); // Obtiene referencia DOM para "btnArgs"
    const argsResult = document.getElementById("argumentsIndependenceResult"); // Obtiene referencia DOM para "argsResult"
    if (btnArgs && argsResult) { // Evalúa condición
        btnArgs.addEventListener("click", () => { // Registra escuchador de eventos
            const testFn = new Function(`
                "use strict";
                function demo(a) {
                    a = 999;
                    return { param: a, argCero: arguments[0] };
                }
                return demo(10);
            `);
            const res = testFn(); // Declara e inicializa "res"

            argsResult.innerHTML = `
                Parámetro modificado <code>a</code>: <strong style="color:#38bdf8">${res.param}</strong> | 
                <code>arguments[0]</code> original: <strong style="color:#34d399">${res.argCero}</strong><br>
                <span style="color:#94a3b8">¡Son totalmente independientes! No se gasta memoria ni ciclos de reloj sincronizándolos en caliente.</span>
            `;
            SoundEffects.success(); // Ejecuta llamada o método
        });
    }

    // 5.3 Rechazo de with
    const btnWith = document.getElementById("btnTestWithBlock"); // Obtiene referencia DOM para "btnWith"
    const withResult = document.getElementById("withBlockResult"); // Obtiene referencia DOM para "withResult"
    if (btnWith && withResult) { // Evalúa condición
        btnWith.addEventListener("click", () => { // Registra escuchador de eventos
            let errorMsg = ""; // Declara e inicializa "errorMsg"
            try { // Inicia bloque protegido contra errores
                // Intentamos compilar un bloque with en strict mode
                new Function('"use strict"; with ({}) {}'); // Ejecuta llamada o método
            } catch (e) { // Instrucción JavaScript
                errorMsg = e.name + ": " + e.message; // Asigna valor
            }

            withResult.innerHTML = `
                <strong style="color:#f43f5e">¡Sintaxis Prohibida Rechazada!</strong><br>
                <code>${errorMsg}</code><br>
                <small style="color:#94a3b8">Al eliminar 'with', el compilador sabe con certeza a qué objeto pertenece cada variable antes de ejecutar.</small>
            `;
            SoundEffects.alert(); // Ejecuta llamada o método
        });
    }
}

// --- MÓDULO 5: PROBADOR DE PALABRAS RESERVADAS (SLIDE 6) ---
function initSlide6ReservedWords() { // Declara función
    const reservedList = [
        "implements", "interface", "let", "package", 
        "private", "protected", "public", "static", "yield"
    ];

    const input = document.getElementById("reservedWordInput"); // Obtiene referencia DOM para "input"
    const btnTest = document.getElementById("btnTestReservedWord"); // Obtiene referencia DOM para "btnTest"
    const resultBox = document.getElementById("rwTesterResult"); // Obtiene referencia DOM para "resultBox"

    // Función evaluadora
    const evaluateWord = (word) => { // Define función flecha "evaluateWord"
        const cleanWord = word.trim(); // Declara e inicializa "cleanWord"
        if (!cleanWord) return; // Evalúa condición

        if (reservedList.includes(cleanWord)) { // Evalúa condición
            resultBox.innerHTML = `
                <strong style="color:#f43f5e;">❌ PALABRA RESERVADA EN MODO ESTRICTO</strong><br>
                <code>var ${cleanWord} = 10;</code> lanzará inmediatamente:<br>
                <em>SyntaxError: Unexpected strict mode reserved word '${cleanWord}'</em><br>
                <small style="color:#94a3b8">Protegida por ECMAScript para garantizar compatibilidad con ES6+ y TypeScript.</small>
            `;
            SoundEffects.alert(); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            resultBox.innerHTML = `
                <strong style="color:#34d399;">✅ IDENTIFICADOR VÁLIDO</strong><br>
                <code>let ${cleanWord} = 10;</code> es una variable legal y permitida en Modo Estricto.
            `;
            SoundEffects.success(); // Ejecuta llamada o método
        }
    };

    if (btnTest && input) { // Evalúa condición
        btnTest.addEventListener("click", () => evaluateWord(input.value)); // Registra escuchador de eventos
        input.addEventListener("keydown", (e) => { // Registra escuchador de eventos
            if (e.key === "Enter") evaluateWord(input.value); // Evalúa condición
        });
    }

    // Clic en las etiquetas sugeridas
    document.querySelectorAll(".rw-tag").forEach((tag) => { // Instrucción JavaScript
        tag.addEventListener("click", () => { // Registra escuchador de eventos
            const word = tag.getAttribute("data-word"); // Declara e inicializa "word"
            if (input) input.value = word; // Evalúa condición
            evaluateWord(word); // Ejecuta llamada o método
        });
    });
}

// --- MÓDULO 6: METÁFORA DEL CORRECTOR LEGAL (SLIDE 8) ---
class LegalEditorSimulator { // Define clase
    static init() { // Instrucción JavaScript
        this.buttons = document.querySelectorAll(".tool-picker .tool-btn"); // Asigna valor
        this.bannerText = document.getElementById("analogyBannerText"); // Asigna valor
        this.bannerIcon = document.getElementById("analogyBannerIcon"); // Asigna valor

        this.statusSloppy = document.getElementById("status-sloppy-desc"); // Asigna valor
        this.statusStrict = document.getElementById("status-strict-desc"); // Asigna valor

        this.actions = { // Asigna valor
            "typo": { // Instrucción JavaScript
                sloppy: "El firmante 'CarlosPerez' se guardó como 'CarlosPerezz' global en window. Nadie avisó. El contrato es inválido.",
                strict: "ReferenceError inmediato en el renglón 14: 'CarlosPerezz no está definido'. Se corrige en 2 segundos.",
                banner: "✍️ Errata tipográfica: En modo descuidado se crea una variable global fantasma. En modo estricto la ejecución se detiene con alarma.",
                icon: "🚨"
            },
            "override": { // Instrucción JavaScript
                sloppy: "Intentaste modificar la cláusula inmutable (writable: false). La máquina no escribió el cambio pero dijo que todo estaba OK. Sorpresa legal posterior.",
                strict: "TypeError: Cannot assign to read only property. El editor bloquea la pluma y protege el contrato original.",
                banner: "🔒 Modificación de regla inmutable: Sloppy Mode falla en silencio; Strict Mode defiende los datos con excepciones reales.",
                icon: "🛡️"
            },
            "duplicate": { // Instrucción JavaScript
                sloppy: "Dos cláusulas con el mismo identificador: la segunda sobrescribe a la primera sin dejar rastro de la original.",
                strict: "SyntaxError: Duplicate parameter name not allowed. La máquina rechaza compilar hasta que nombres las cosas con claridad.",
                banner: "📋 Parámetros duplicados: Estrictamente prohibido en funciones con 'use strict'.",
                icon: "⚠️"
            }
        };

        this.bindEvents(); // Ejecuta llamada o método
        this.selectAction("typo"); // Ejecuta llamada o método
    }

    static bindEvents() { // Instrucción JavaScript
        this.buttons.forEach((btn) => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.buttons.forEach((b) => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                const action = btn.getAttribute("data-action"); // Declara e inicializa "action"
                this.selectAction(action); // Ejecuta llamada o método
            });
        });
    }

    static selectAction(actionKey) { // Instrucción JavaScript
        const item = this.actions[actionKey]; // Declara e inicializa "item"
        if (!item) return; // Evalúa condición

        if (this.statusSloppy) this.statusSloppy.textContent = item.sloppy; // Evalúa condición
        if (this.statusStrict) this.statusStrict.textContent = item.strict; // Evalúa condición

        if (this.bannerText) this.bannerText.textContent = item.banner; // Evalúa condición
        if (this.bannerIcon) this.bannerIcon.textContent = item.icon; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método
    }
}

// --- MÓDULO 7: PLAYGROUND & CONSOLA VIRTUAL EN VIVO (SLIDE 9) ---
class PlaygroundManager { // Define clase
    static init() { // Instrucción JavaScript
        this.editor = document.getElementById("liveCodeEditor"); // Asigna valor
        this.consoleContainer = document.getElementById("consoleLogsContainer"); // Asigna valor
        this.presetSelect = document.getElementById("codePresetSelect"); // Asigna valor
        this.btnRun = document.getElementById("btnRunEditorCode"); // Asigna valor
        this.btnClear = document.getElementById("btnClearConsole"); // Asigna valor
        this.btnReset = document.getElementById("btnResetCode"); // Asigna valor

        this.presets = { // Asigna valor
            "preset-strict-1": `// 1. Variable sin declarar (ReferenceError en Modo Estricto)
"use strict";

let saldoBancario = 500;

try {
    // Errata tipográfica al actualizar el saldo:
    saldoBancariio = 600;
} catch (error) {
    console.error("Error detectado:", error.name, "->", error.message);
}

console.log("Saldo legítimo intacto:", saldoBancario);`,

            "preset-strict-2": `// 2. Objeto Congelado (TypeError explícito)
"use strict";

const configuracion = {
    entorno: "producción",
    version: "2.1.0"
};

// Congelamos el objeto para evitar alteraciones:
Object.freeze(configuracion);

try {
    // Intentamos modificar una propiedad congelada:
    configuracion.version = "3.0.0";
} catch (error) {
    console.error("Seguridad activada:", error.name, "->", error.message);
}

console.log("Versión actual en memoria:", configuracion.version);`,

            "preset-strict-3": `// 3. Contexto 'this' en funciones libres
"use strict";

function obtenerContexto() {
    // En modo normal devolvería el objeto global Window.
    // En Modo Estricto 'this' es de forma segura undefined:
    return this;
}

console.log("¿Valor de 'this' en función suelta?:", obtenerContexto()); // undefined
console.log("¿Evitó contaminar window?:", typeof window !== "undefined" ? true : "Entorno seguro");`,

            "preset-strict-4": `// 4. Parámetros duplicados y números octales obsoletos
"use strict";

// Literales octales modernos con prefijo 0o:
const permisoLectura = 0o755;
console.log("Permiso octal interpretado en decimal:", permisoLectura);

// Las funciones con nombres duplicados arrojan SyntaxError al compilar
function calcularTotal(subtotal, descuento) {
    return subtotal - descuento;
}

console.log("Total calculado:", calcularTotal(100, 15));`,

            "preset-ex-strict1": `// RETO NIVEL 1: Erratas Tipográficas
"use strict";
let contadorVisitas = 10;

try {
    // Comete la errata a propósito para observar el ReferenceError:
    contadoorVisitas = 11;
} catch (e) {
    console.error("Atrapado con éxito:", e.name, "->", e.message);
}

console.log("Visitas reales:", contadorVisitas);`,

            "preset-ex-strict2": `// RETO NIVEL 2: Captura de TypeError en Object.freeze()
"use strict";

const configuracionServidor = { puerto: 8080 };
Object.freeze(configuracionServidor);

try {
    configuracionServidor.puerto = 3000;
} catch (err) {
    console.error("Modo Estricto impidió la alteración:", err.name, "-", err.message);
}

console.log("Puerto asegurado:", configuracionServidor.puerto);`,

            "preset-ex-strict3": `// RETO NIVEL 3: Refactorización de Código Heredado
"use strict";

// Refactorizado: sin parámetros duplicados, sin palabras reservadas y con octales ES6+
function procesarPedido(id, precio, cantidad) {
    const impuestoBase = 0.19;
    const paqueteEnvio = "Envío Express";
    const codigoDescuento = 0o15; // 13 en decimal
    
    const subtotal = precio * cantidad;
    return (subtotal + (subtotal * impuestoBase)) - codigoDescuento;
}

console.log("Pedido procesado limpiamente:", procesarPedido(101, 50, 2));`
        };

        this.bindEvents(); // Ejecuta llamada o método
        this.loadPreset("preset-strict-1"); // Ejecuta llamada o método
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

    static loadPreset(key) { // Instrucción JavaScript
        if (this.editor && this.presets[key]) { // Evalúa condición
            this.editor.value = this.presets[key]; // Asigna valor
            if (this.presetSelect && this.presets[key] && !key.startsWith("preset-ex")) { // Evalúa condición
                this.presetSelect.value = key; // Asigna valor
            }
        }
    }

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

    static appendLog(message, type = "normal") { // Instrucción JavaScript
        if (!this.consoleContainer) return; // Evalúa condición
        const now = new Date(); // Declara e inicializa "now"
        const timeStr = now.toTimeString().split(" ")[0]; // Declara e inicializa "timeStr"

        const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
        line.className = `log-line log-${type}`; // Asigna valor
        line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`; // Actualiza contenido en el DOM
        this.consoleContainer.appendChild(line); // Inserta nodo en el DOM
        this.consoleContainer.scrollTop = this.consoleContainer.scrollHeight; // Asigna valor
    }

    static runCode() { // Instrucción JavaScript
        if (!this.editor) return; // Evalúa condición
        const userCode = this.editor.value; // Declara e inicializa "userCode"
        SoundEffects.click(); // Ejecuta llamada o método

        this.appendLog("--- Ejecutando snippet ---", "info"); // Inserta nodo en el DOM

        try { // Inicia bloque protegido contra errores
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
                    this.appendLog(formatted, "normal"); // Inserta nodo en el DOM
                },
                error: (...args) => { // Instrucción JavaScript
                    const formatted = args.join(" "); // Declara e inicializa "formatted"
                    this.appendLog(formatted, "error"); // Inserta nodo en el DOM
                }
            };

            const runner = new Function("console", userCode); // Declara e inicializa "runner"
            runner(customConsole); // Ejecuta llamada o método

            SoundEffects.success(); // Ejecuta llamada o método
            this.appendLog("✔ Ejecución completada.", "success"); // Inserta nodo en el DOM
        } catch (err) { // Instrucción JavaScript
            SoundEffects.alert(); // Ejecuta llamada o método
            this.appendLog(`❌ Excepción: ${err.name} - ${err.message}`, "error"); // Inserta nodo en el DOM
        }
    }
}

// --- MÓDULO 8: RETOS Y SOLUCIONES (SLIDE 10) ---
function initSlide10Exercises() { // Declara función
    document.querySelectorAll(".btn-ex-solution").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            SoundEffects.click(); // Ejecuta llamada o método
            const targetId = btn.getAttribute("data-sol"); // Declara e inicializa "targetId"
            const solBox = document.getElementById(targetId); // Obtiene referencia DOM para "solBox"
            if (solBox) { // Evalúa condición
                const isVisible = solBox.classList.contains("visible"); // Declara e inicializa "isVisible"
                solBox.classList.toggle("visible"); // Modifica clases CSS del elemento
                btn.textContent = isVisible ? "Ver Solución" : "Ocultar Solución"; // Actualiza contenido en el DOM
            }
        });
    });

    document.querySelectorAll("[data-load-preset]").forEach((btn) => { // Instrucción JavaScript
        btn.addEventListener("click", () => { // Registra escuchador de eventos
            const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa "presetKey"
            SoundEffects.click(); // Ejecuta llamada o método
            PlaygroundManager.loadPreset(presetKey); // Ejecuta llamada o método
            PresentationController.goToSlide(9); // Slide 9: Playground
            showToast("Reto cargado en el Playground. ¡Presiona Ejecutar!", "🚀"); // Ejecuta llamada o método
        });
    });

    const btnCopyCheat = document.getElementById("btnCopySummaryCheat"); // Obtiene referencia DOM para "btnCopyCheat"
    if (btnCopyCheat) { // Evalúa condición
        const cheatSheetMarkdown = `# CHULETA MAESTRA — Modo Estricto ("use strict") en JavaScript

## 1. Regla de Oro
Coloca siempre \`"use strict";\` en la **primera línea** absoluta de tu archivo o de una función. En Clases y Módulos ES6 viene activo de fábrica.

## 2. Errores Silenciosos Eliminados
- Asignar a propiedades \`writable: false\` ➔ \`TypeError\`.
- Asignar a objetos \`Object.freeze()\` ➔ \`TypeError\`.
- Asignar a \`NaN\` o \`undefined\` ➔ \`TypeError\`.
- Usar \`delete\` en propiedades no configurables ➔ \`TypeError\`.

## 3. Prevención de Mala Sintaxis
- Variables sin declarar (\`x = 10\`) ➔ \`ReferenceError\`.
- Parámetros duplicados (\`function(a, b, a)\`) ➔ \`SyntaxError\`.
- Octales con cero inicial (\`0123\`) ➔ \`SyntaxError\` (usar \`0o123\`).
- En funciones libres, \`this\` es de forma segura \`undefined\` (no \`window\`).

## 4. Mayor Rendimiento y Optimización V8
- \`eval()\` aislado en su propio ámbito.
- \`arguments\` y los parámetros de función desvinculados en memoria.
- Bloque \`with\` totalmente prohibido.`;

        btnCopyCheat.addEventListener("click", () => { // Registra escuchador de eventos
            navigator.clipboard.writeText(cheatSheetMarkdown).then(() => { // Instrucción JavaScript
                SoundEffects.success(); // Ejecuta llamada o método
                showToast("¡Chuleta en Markdown copiada al portapapeles!", "📋"); // Ejecuta llamada o método
            });
        });
    }
}

// --- INICIALIZACIÓN GLOBAL AL CARGAR EL DOM ---
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    PresentationController.init(); // Ejecuta llamada o método
    initSlide2Demo(); // Ejecuta llamada o método
    initSlide3Demo(); // Ejecuta llamada o método
    SilentErrorsSimulator.init(); // Ejecuta llamada o método
    initSlide5Optimization(); // Ejecuta llamada o método
    initSlide6ReservedWords(); // Ejecuta llamada o método
    LegalEditorSimulator.init(); // Ejecuta llamada o método
    PlaygroundManager.init(); // Ejecuta llamada o método
    initSlide10Exercises(); // Ejecuta llamada o método

    console.log("🛡️ Presentación de Modo Estricto cargada con éxito en JavaScript Master Level."); // Imprime salida en consola
});
