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
const AppState = {
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
    static init() {
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
            // Instancia un nuevo contexto de audio
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return; // Evalúa condición lógica

        try { // Inicia bloque protegido contra errores
            // Aseguramos que el AudioContext esté inicializado
            this.init();
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return; // Evalúa condición lógica

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === 'suspended') { // Evalúa condición lógica
                AppState.audioCtx.resume();
            }

            // Creamos un nodo oscilador para emitir la onda de sonido
            const osc = AppState.audioCtx.createOscillator(); // Declara e inicializa variable local
            // Creamos un nodo de ganancia para controlar el volumen del sonido
            const gain = AppState.audioCtx.createGain(); // Declara e inicializa variable local

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
        this.playTone(523.25, 'sine', 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() {
        this.playTone(320, 'sine', 0.06, 0.03);
        setTimeout(() => this.playTone(480, 'sine', 0.08, 0.03), 40);
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static alert() {
        this.playTone(280, 'sawtooth', 0.15, 0.04);
    }
}

// --- MÓDULO DE TOAST NOTIFICATIONS (Alertas flotantes) ---
// Muestra una notificación temporal en la esquina inferior con un mensaje y un icono
function showToast(message, icon = "✔") { // Define función reutilizable
    const toast = document.getElementById("toastNotification"); // Declara e inicializa variable local
    const toastMsg = document.getElementById("toastMsg"); // Declara e inicializa variable local
    const toastIcon = document.getElementById("toastIcon"); // Declara e inicializa variable local

    if (!toast || !toastMsg) return; // Evalúa condición lógica

    toastMsg.textContent = message; // Actualiza contenido en el DOM
    if (toastIcon) toastIcon.textContent = icon; // Evalúa condición lógica

    toast.classList.add("active");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove("active");
    }, 2800);
}

// --- MÓDULO DE CONTROLADOR DE PRESENTACIÓN ---
// Gestiona el ciclo de vida de las diapositivas, transiciones, teclado y controles
class PresentationController { // Define clase
    static init() {
        this.slides = document.querySelectorAll(".slide"); // Obtiene referencia al elemento del DOM
        AppState.totalSlides = this.slides.length;

        this.renderDots();
        this.renderOverview();
        this.goToSlide(1, false);
        this.bindEvents();
    }

    // Renderiza dinámicamente los puntos de navegación en el dock inferior
    static renderDots() {
        const container = document.getElementById("slideDotsContainer"); // Declara e inicializa variable local
        if (!container) return; // Evalúa condición lógica
        container.innerHTML = ""; // Actualiza contenido en el DOM

        for (let i = 1; i <= AppState.totalSlides; i++) { // Itera sobre elementos o rango
            const dot = document.createElement("div"); // Declara e inicializa variable local
            dot.className = `slide-dot ${i === 1 ? "active" : ""}`;
            dot.title = `Diapositiva ${i}`;
            dot.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.goToSlide(i);
            });
            container.appendChild(dot);
        }
    }

    // Renderiza la lista de miniaturas en el modal de vista panorámica (Overview)
    static renderOverview() {
        const grid = document.getElementById("overviewGrid"); // Declara e inicializa variable local
        if (!grid) return; // Evalúa condición lógica
        grid.innerHTML = ""; // Actualiza contenido en el DOM

        this.slides.forEach((slide, index) => {
            const num = index + 1; // Declara e inicializa variable local
            const title = slide.getAttribute("data-title") || `Diapositiva ${num}`; // Declara e inicializa variable local
            const thumb = document.createElement("div"); // Declara e inicializa variable local
            thumb.className = `overview-thumb ${num === AppState.currentSlide ? "current" : ""}`;
            thumb.innerHTML = `
                <span class="thumb-num">0${num}</span>
                <span class="thumb-title">${title}</span>
            `;
            thumb.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.goToSlide(num);
                this.closeOverview();
            });
            grid.appendChild(thumb);
        });
    }

    // Navega a un número específico de diapositiva
    static goToSlide(slideNum, playSound = true) {
        if (slideNum < 1 || slideNum > AppState.totalSlides) return; // Evalúa condición lógica

        AppState.currentSlide = slideNum;

        this.slides.forEach((slide) => {
            const currentNum = parseInt(slide.getAttribute("data-slide"), 10); // Declara e inicializa variable local
            if (currentNum === slideNum) { // Evalúa condición lógica
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        const progressBar = document.getElementById("progressBar"); // Declara e inicializa variable local
        const slideIndicator = document.getElementById("slideIndicator"); // Declara e inicializa variable local
        const percentage = (slideNum / AppState.totalSlides) * 100; // Declara e inicializa variable local

        if (progressBar) progressBar.style.width = `${percentage}%`; // Evalúa condición lógica
        if (slideIndicator) slideIndicator.textContent = `${slideNum} / ${AppState.totalSlides}`; // Evalúa condición lógica

        const dots = document.querySelectorAll(".slide-dot"); // Declara e inicializa variable local
        dots.forEach((dot, idx) => {
            if (idx + 1 === slideNum) { // Evalúa condición lógica
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        window.scrollTo({ top: 0, behavior: "smooth" });

        if (playSound) SoundEffects.transition(); // Evalúa condición lógica

        if (!AppState.isPresentationMode) { // Evalúa condición lógica
            const targetSlide = document.getElementById(`slide-${slideNum}`); // Declara e inicializa variable local
            if (targetSlide) { // Evalúa condición lógica
                targetSlide.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    static nextSlide() {
        if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición lógica
            this.goToSlide(AppState.currentSlide + 1);
        } else {
            SoundEffects.alert();
            showToast("Estás en la última diapositiva", "ℹ️");
        }
    }

    static prevSlide() {
        if (AppState.currentSlide > 1) { // Evalúa condición lógica
            this.goToSlide(AppState.currentSlide - 1);
        } else {
            SoundEffects.alert();
            showToast("Estás en el inicio de la presentación", "ℹ️");
        }
    }

    static toggleMode() {
        AppState.isPresentationMode = !AppState.isPresentationMode;
        const modeText = document.getElementById("modeText"); // Declara e inicializa variable local
        const modeIcon = document.getElementById("modeIcon"); // Declara e inicializa variable local

        if (AppState.isPresentationMode) { // Evalúa condición lógica
            document.body.classList.remove("mode-document");
            document.body.classList.add("mode-presentation");
            if (modeText) modeText.textContent = "Modo Guía"; // Evalúa condición lógica
            if (modeIcon) modeIcon.textContent = "📑"; // Evalúa condición lógica
            this.goToSlide(AppState.currentSlide, false);
            showToast("Cambiado a Modo Presentación Interactiva (Diapositivas)", "🖥️");
        } else {
            document.body.classList.remove("mode-presentation");
            document.body.classList.add("mode-document");
            if (modeText) modeText.textContent = "Modo Slides"; // Evalúa condición lógica
            if (modeIcon) modeIcon.textContent = "📽️"; // Evalúa condición lógica
            showToast("Cambiado a Modo Guía Completa de Estudio", "📖");
        }
        SoundEffects.click();
    }

    static openOverview() {
        const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modal) { // Evalúa condición lógica
            this.renderOverview();
            modal.classList.add("active");
            SoundEffects.click();
        }
    }

    static closeOverview() {
        const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modal) { // Evalúa condición lógica
            modal.classList.remove("active");
        }
    }

    static toggleFullscreen() {
        SoundEffects.click();
        if (!document.fullscreenElement) { // Evalúa condición lógica
            document.documentElement.requestFullscreen().catch(() => {});
            showToast("Pantalla Completa Activada", "⛶");
        } else {
            if (document.exitFullscreen) { // Evalúa condición lógica
                document.exitFullscreen().catch(() => {});
            }
            showToast("Pantalla Completa Desactivada", "⛶");
        }
    }

    static bindEvents() {
        const btnNext = document.getElementById("btnNextSlide"); // Declara e inicializa variable local
        const btnPrev = document.getElementById("btnPrevSlide"); // Declara e inicializa variable local
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición lógica
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición lógica

        const btnGoLab = document.getElementById("btnGoLab"); // Declara e inicializa variable local
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(9)); // Evalúa condición lógica

        const btnToggleMode = document.getElementById("btnToggleMode"); // Declara e inicializa variable local
        const btnToggleSound = document.getElementById("btnToggleSound"); // Declara e inicializa variable local
        const btnOverview = document.getElementById("btnOverview"); // Declara e inicializa variable local
        const btnFullscreen = document.getElementById("btnFullscreen"); // Declara e inicializa variable local
        const btnCloseOverview = document.getElementById("btnCloseOverview"); // Declara e inicializa variable local

        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode()); // Evalúa condición lógica

        if (btnToggleSound) { // Evalúa condición lógica
            btnToggleSound.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                AppState.soundEnabled = !AppState.soundEnabled;
                const icon = document.getElementById("soundIcon"); // Declara e inicializa variable local
                if (icon) icon.textContent = AppState.soundEnabled ? "🔊" : "🔇"; // Evalúa condición lógica
                showToast(AppState.soundEnabled ? "Audio Activado" : "Audio Silenciado", AppState.soundEnabled ? "🔊" : "🔇");
                if (AppState.soundEnabled) SoundEffects.click(); // Evalúa condición lógica
            });
        }

        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview()); // Evalúa condición lógica
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview()); // Evalúa condición lógica
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen()); // Evalúa condición lógica

        const btnStart = document.getElementById("btnStartPresentation"); // Declara e inicializa variable local
        if (btnStart) { // Evalúa condición lógica
            btnStart.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.goToSlide(2);
            });
        }

        document.querySelectorAll("[data-jump]").forEach((item) => {
            item.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const target = parseInt(item.getAttribute("data-jump"), 10); // Declara e inicializa variable local
                if (target) { // Evalúa condición lógica
                    SoundEffects.click();
                    this.goToSlide(target);
                }
            });
        });

        const btnRestart = document.getElementById("btnRestartPresentation"); // Declara e inicializa variable local
        if (btnRestart) { // Evalúa condición lógica
            btnRestart.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.goToSlide(1);
            });
        }

        window.addEventListener("keydown", (e) => { // Registra escuchador de evento en el DOM
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición lógica
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { // Evalúa condición lógica
                    e.preventDefault();
                    PlaygroundManager.runCode();
                }
                return; // Retorna el resultado de la función
            }

            switch (e.key) { // Evalúa múltiples casos
                case "ArrowRight":
                case "d":
                case "D":
                case " ":
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case "o":
                case "O":
                    e.preventDefault();
                    const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
                    if (modal && modal.classList.contains("active")) { // Evalúa condición lógica
                        this.closeOverview();
                    } else {
                        this.openOverview();
                    }
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    this.toggleMode();
                    break;
                case "Escape":
                    this.closeOverview();
                    break;
            }
        });

        const modalOverlay = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modalOverlay) { // Evalúa condición lógica
            modalOverlay.addEventListener("click", (e) => { // Registra escuchador de evento en el DOM
                if (e.target === modalOverlay) this.closeOverview(); // Evalúa condición lógica
            });
        }
    }
}

// --- MÓDULO 1: DEMOSTRACIÓN DE DIRECTIVA INTRODUCTORIA (SLIDE 2) ---
function initSlide2Demo() { // Define función reutilizable
    const btnTest = document.getElementById("btnTestStrictIntro"); // Declara e inicializa variable local
    const consoleOut = document.getElementById("console-output-1"); // Declara e inicializa variable local
    const status = document.getElementById("testStrictIntroStatus"); // Declara e inicializa variable local

    if (!btnTest || !consoleOut) return; // Evalúa condición lógica

    btnTest.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        SoundEffects.click();

        let resultado = ""; // Declara e inicializa variable local
        try { // Inicia bloque protegido contra errores
            // Evaluamos una función en modo estricto que intenta asignar sin declarar
            const funcionEstricta = new Function(`
                "use strict";
                usuarioSinDeclarar = "Elena";
            `);
            funcionEstricta();
        } catch (error) {
            resultado = error.name + ": " + error.message;
        }

        consoleOut.innerHTML = `
            <div><span style="color:#64748b">&gt;</span> <span style="color:#f43f5e; font-weight:700;">¡EXCEPCIÓN LANZADA POR EL MOTOR!</span></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#fcd34d">${resultado}</span></div>
            <div><span style="color:#64748b">&gt;</span> <span style="color:#34d399">Resultado: Se impidió la creación accidental de 'window.usuarioSinDeclarar'.</span></div>
        `;

        if (status) { // Evalúa condición lógica
            status.textContent = "✔ ReferenceError capturado con éxito"; // Actualiza contenido en el DOM
            status.style.color = "#34d399";
        }
        SoundEffects.success();
    });

    document.querySelectorAll(".btn-copy-code").forEach((btn) => {
        btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            const targetId = btn.getAttribute("data-target"); // Declara e inicializa variable local
            const codeEl = document.getElementById(targetId); // Declara e inicializa variable local
            if (codeEl) { // Evalúa condición lógica
                navigator.clipboard.writeText(codeEl.innerText).then(() => {
                    btn.textContent = "¡Copiado!"; // Actualiza contenido en el DOM
                    SoundEffects.success();
                    showToast("Código copiado al portapapeles", "📋");
                    setTimeout(() => { btn.textContent = "Copiar"; }, 2000); // Actualiza contenido en el DOM
                });
            }
        });
    });
}

// --- MÓDULO 2: COMPROBACIÓN DE MODO ESTRICTO EN CLASES ES6 (SLIDE 3) ---
function initSlide3Demo() { // Define función reutilizable
    const btnCheck = document.getElementById("btnCheckAutoStrict"); // Declara e inicializa variable local
    const resultBox = document.getElementById("autoStrictResult"); // Declara e inicializa variable local

    if (!btnCheck || !resultBox) return; // Evalúa condición lógica

    btnCheck.addEventListener("click", () => { // Registra escuchador de evento en el DOM
        // En una clase ES6, el modo estricto se activa automáticamente sin necesidad de escribir "use strict";
        class PruebaClase { // Define clase
            metodoVerificador() {
                // Si 'this' en una función suelta o llamada no vinculada es undefined, estamos en strict mode
                return (function() { return this; })(); // Retorna el resultado de la función
            }
        }

        const instancia = new PruebaClase(); // Declara e inicializa variable local
        const esStrict = instancia.metodoVerificador() === undefined; // Declara e inicializa variable local

        resultBox.innerHTML = `
            <span style="color:#34d399; font-weight:700;">¡MODO ESTRICTO CONFIRMADO EN CLASES ES6!</span><br>
            El cuerpo de las clases de JavaScript siempre se ejecuta bajo <code>"use strict"</code> por especificación oficial de ECMAScript.<br>
            <code>this sin vincular: <strong>undefined</strong></code> (Es estricto: <strong>${esStrict}</strong>).
        `;
        SoundEffects.success();
    });
}

// --- MÓDULO 3: SIMULADOR DE ERRORES SILENCIOSOS (SLIDE 4) ---
class SilentErrorsSimulator { // Define clase
    static init() {
        this.currentCase = "readonly";
        this.propButtons = document.querySelectorAll(".sim-prop-btn"); // Obtiene referencia al elemento del DOM
        this.btnCompare = document.getElementById("btnCompareErrorModes"); // Obtiene referencia al elemento del DOM
        this.termSloppy = document.getElementById("terminalSloppy"); // Obtiene referencia al elemento del DOM
        this.termStrict = document.getElementById("terminalStrict"); // Obtiene referencia al elemento del DOM
        this.feedback = document.getElementById("strictFeedbackText"); // Obtiene referencia al elemento del DOM

        this.cases = {
            "readonly": {
                title: "1. Modificar propiedad de solo lectura (writable: false)",
                sloppy: `const user = {};\nObject.defineProperty(user, "id", { value: 101, writable: false });\nuser.id = 999;\n// user.id sigue siendo 101. ¡Falla en silencio total!`,
                strict: `const user = {};\nObject.defineProperty(user, "id", { value: 101, writable: false });\nuser.id = 999;\n// ❌ TypeError: Cannot assign to read only property 'id'`,
                explanation: "En Sloppy Mode, reasignar 'user.id' simplemente no hace nada y no avisa. En Strict Mode, detiene el hilo con TypeError."
            },
            "frozen": {
                title: "2. Agregar propiedades a un objeto congelado (Object.freeze)",
                sloppy: `const config = { host: "localhost" };\nObject.freeze(config);\nconfig.puerto = 8080;\n// config.puerto no se agrega. Sin avisos ni errores.`,
                strict: `const config = { host: "localhost" };\nObject.freeze(config);\nconfig.puerto = 8080;\n// ❌ TypeError: Cannot add property puerto, object is not extensible`,
                explanation: "Un objeto congelado rechaza mutaciones. Sloppy Mode oculta el fallo; Strict Mode lo evidencia al instante."
            },
            "primitive": {
                title: "3. Asignar valores a valores primitivos (NaN = 5)",
                sloppy: `NaN = 5;\nundefined = true;\n// JavaScript ignora la asignación en silencio absoluto.`,
                strict: `NaN = 5;\n// ❌ TypeError: Cannot assign to read only property 'NaN' of object '#<Window>'`,
                explanation: "Intentar sobrescribir identificadores globales inmutables es detenido con TypeError en Strict Mode."
            },
            "delete": {
                title: "4. delete en propiedades no configurables (delete Object.prototype)",
                sloppy: `const resultado = delete Object.prototype;\n// Devuelve false y continúa como si nada.`,
                strict: `delete Object.prototype;\n// ❌ TypeError: Cannot delete property 'prototype' of function Object()`,
                explanation: "Borrar propiedades del sistema protegidas lanza TypeError en lugar de un falso booleano 'false'."
            }
        };

        this.bindEvents();
        this.updateView();
    }

    static bindEvents() {
        this.propButtons.forEach((btn) => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.propButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentCase = btn.getAttribute("data-error-case");
                this.updateView();
            });
        });

        if (this.btnCompare) { // Evalúa condición lógica
            this.btnCompare.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                this.updateView(true);
                showToast("Comparación Sloppy vs Strict ejecutada", "⚡");
            });
        }
    }

    static updateView(animate = false) {
        const data = this.cases[this.currentCase]; // Declara e inicializa variable local
        if (!data) return; // Evalúa condición lógica

        if (this.termSloppy) { // Evalúa condición lógica
            this.termSloppy.innerHTML = `<pre style="font-family:var(--font-mono); color:#fcd34d;">${data.sloppy}</pre>`; // Actualiza contenido en el DOM
        }
        if (this.termStrict) { // Evalúa condición lógica
            this.termStrict.innerHTML = `<pre style="font-family:var(--font-mono); color:#34d399;">${data.strict}</pre>`; // Actualiza contenido en el DOM
        }
        if (this.feedback) { // Evalúa condición lógica
            this.feedback.innerHTML = `<strong>${data.title}:</strong> ${data.explanation}`; // Actualiza contenido en el DOM
        }
    }
}

// --- MÓDULO 4: RENDIMIENTO Y OPTIMIZACIÓN (SLIDE 5) ---
function initSlide5Optimization() { // Define función reutilizable
    const tabs = document.querySelectorAll(".char-tab-btn"); // Declara e inicializa variable local
    const views = document.querySelectorAll(".char-detail-view"); // Declara e inicializa variable local

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            SoundEffects.click();
            const perfId = tab.getAttribute("data-perf"); // Declara e inicializa variable local

            tabs.forEach((t) => t.classList.remove("active"));
            views.forEach((v) => v.classList.remove("active"));

            tab.classList.add("active");
            const targetView = document.getElementById(`perf-view-${perfId}`); // Declara e inicializa variable local
            if (targetView) targetView.classList.add("active"); // Evalúa condición lógica
        });
    });

    // 5.1 eval() Aislamiento
    const btnEval = document.getElementById("btnTestEvalIsolation"); // Declara e inicializa variable local
    const evalResult = document.getElementById("evalIsolationResult"); // Declara e inicializa variable local
    if (btnEval && evalResult) { // Evalúa condición lógica
        btnEval.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            // Demostración de eval() aislado
            const testFn = new Function(`
                "use strict";
                eval("var variableEnEval = 'Secreta';");
                return typeof variableEnEval; // ¿Se filtró al exterior?
            `);
            const tipo = testFn(); // Declara e inicializa variable local

            evalResult.innerHTML = `
                <strong style="color:#34d399">typeof variableEnEval fuera de eval(): "${tipo}"</strong><br>
                En Modo Estricto, eval() no contamina las variables locales circundantes.<br>
                <small style="color:#94a3b8">El motor V8 puede optimizar en memoria sin miedo a alteraciones dinámicas.</small>
            `;
            SoundEffects.success();
        });
    }

    // 5.2 arguments desvinculado
    const btnArgs = document.getElementById("btnTestArgumentsIndependence"); // Declara e inicializa variable local
    const argsResult = document.getElementById("argumentsIndependenceResult"); // Declara e inicializa variable local
    if (btnArgs && argsResult) { // Evalúa condición lógica
        btnArgs.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            const testFn = new Function(`
                "use strict";
                function demo(a) {
                    a = 999;
                    return { param: a, argCero: arguments[0] };
                }
                return demo(10);
            `);
            const res = testFn(); // Declara e inicializa variable local

            argsResult.innerHTML = `
                Parámetro modificado <code>a</code>: <strong style="color:#38bdf8">${res.param}</strong> | 
                <code>arguments[0]</code> original: <strong style="color:#34d399">${res.argCero}</strong><br>
                <span style="color:#94a3b8">¡Son totalmente independientes! No se gasta memoria ni ciclos de reloj sincronizándolos en caliente.</span>
            `;
            SoundEffects.success();
        });
    }

    // 5.3 Rechazo de with
    const btnWith = document.getElementById("btnTestWithBlock"); // Declara e inicializa variable local
    const withResult = document.getElementById("withBlockResult"); // Declara e inicializa variable local
    if (btnWith && withResult) { // Evalúa condición lógica
        btnWith.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            let errorMsg = ""; // Declara e inicializa variable local
            try { // Inicia bloque protegido contra errores
                // Intentamos compilar un bloque with en strict mode
                new Function('"use strict"; with ({}) {}');
            } catch (e) {
                errorMsg = e.name + ": " + e.message;
            }

            withResult.innerHTML = `
                <strong style="color:#f43f5e">¡Sintaxis Prohibida Rechazada!</strong><br>
                <code>${errorMsg}</code><br>
                <small style="color:#94a3b8">Al eliminar 'with', el compilador sabe con certeza a qué objeto pertenece cada variable antes de ejecutar.</small>
            `;
            SoundEffects.alert();
        });
    }
}

// --- MÓDULO 5: PROBADOR DE PALABRAS RESERVADAS (SLIDE 6) ---
function initSlide6ReservedWords() { // Define función reutilizable
    const reservedList = [
        "implements", "interface", "let", "package", 
        "private", "protected", "public", "static", "yield"
    ];

    const input = document.getElementById("reservedWordInput"); // Declara e inicializa variable local
    const btnTest = document.getElementById("btnTestReservedWord"); // Declara e inicializa variable local
    const resultBox = document.getElementById("rwTesterResult"); // Declara e inicializa variable local

    // Función evaluadora
    const evaluateWord = (word) => {
        const cleanWord = word.trim(); // Declara e inicializa variable local
        if (!cleanWord) return; // Evalúa condición lógica

        if (reservedList.includes(cleanWord)) { // Evalúa condición lógica
            resultBox.innerHTML = `
                <strong style="color:#f43f5e;">❌ PALABRA RESERVADA EN MODO ESTRICTO</strong><br>
                <code>var ${cleanWord} = 10;</code> lanzará inmediatamente:<br>
                <em>SyntaxError: Unexpected strict mode reserved word '${cleanWord}'</em><br>
                <small style="color:#94a3b8">Protegida por ECMAScript para garantizar compatibilidad con ES6+ y TypeScript.</small>
            `;
            SoundEffects.alert();
        } else {
            resultBox.innerHTML = `
                <strong style="color:#34d399;">✅ IDENTIFICADOR VÁLIDO</strong><br>
                <code>let ${cleanWord} = 10;</code> es una variable legal y permitida en Modo Estricto.
            `;
            SoundEffects.success();
        }
    };

    if (btnTest && input) { // Evalúa condición lógica
        btnTest.addEventListener("click", () => evaluateWord(input.value));
        input.addEventListener("keydown", (e) => { // Registra escuchador de evento en el DOM
            if (e.key === "Enter") evaluateWord(input.value); // Evalúa condición lógica
        });
    }

    // Clic en las etiquetas sugeridas
    document.querySelectorAll(".rw-tag").forEach((tag) => {
        tag.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            const word = tag.getAttribute("data-word"); // Declara e inicializa variable local
            if (input) input.value = word; // Evalúa condición lógica
            evaluateWord(word);
        });
    });
}

// --- MÓDULO 6: METÁFORA DEL CORRECTOR LEGAL (SLIDE 8) ---
class LegalEditorSimulator { // Define clase
    static init() {
        this.buttons = document.querySelectorAll(".tool-picker .tool-btn"); // Obtiene referencia al elemento del DOM
        this.bannerText = document.getElementById("analogyBannerText"); // Obtiene referencia al elemento del DOM
        this.bannerIcon = document.getElementById("analogyBannerIcon"); // Obtiene referencia al elemento del DOM

        this.statusSloppy = document.getElementById("status-sloppy-desc"); // Obtiene referencia al elemento del DOM
        this.statusStrict = document.getElementById("status-strict-desc"); // Obtiene referencia al elemento del DOM

        this.actions = {
            "typo": {
                sloppy: "El firmante 'CarlosPerez' se guardó como 'CarlosPerezz' global en window. Nadie avisó. El contrato es inválido.",
                strict: "ReferenceError inmediato en el renglón 14: 'CarlosPerezz no está definido'. Se corrige en 2 segundos.",
                banner: "✍️ Errata tipográfica: En modo descuidado se crea una variable global fantasma. En modo estricto la ejecución se detiene con alarma.",
                icon: "🚨"
            },
            "override": {
                sloppy: "Intentaste modificar la cláusula inmutable (writable: false). La máquina no escribió el cambio pero dijo que todo estaba OK. Sorpresa legal posterior.",
                strict: "TypeError: Cannot assign to read only property. El editor bloquea la pluma y protege el contrato original.",
                banner: "🔒 Modificación de regla inmutable: Sloppy Mode falla en silencio; Strict Mode defiende los datos con excepciones reales.",
                icon: "🛡️"
            },
            "duplicate": {
                sloppy: "Dos cláusulas con el mismo identificador: la segunda sobrescribe a la primera sin dejar rastro de la original.",
                strict: "SyntaxError: Duplicate parameter name not allowed. La máquina rechaza compilar hasta que nombres las cosas con claridad.",
                banner: "📋 Parámetros duplicados: Estrictamente prohibido en funciones con 'use strict'.",
                icon: "⚠️"
            }
        };

        this.bindEvents();
        this.selectAction("typo");
    }

    static bindEvents() {
        this.buttons.forEach((btn) => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.buttons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const action = btn.getAttribute("data-action"); // Declara e inicializa variable local
                this.selectAction(action);
            });
        });
    }

    static selectAction(actionKey) {
        const item = this.actions[actionKey]; // Declara e inicializa variable local
        if (!item) return; // Evalúa condición lógica

        if (this.statusSloppy) this.statusSloppy.textContent = item.sloppy; // Evalúa condición lógica
        if (this.statusStrict) this.statusStrict.textContent = item.strict; // Evalúa condición lógica

        if (this.bannerText) this.bannerText.textContent = item.banner; // Evalúa condición lógica
        if (this.bannerIcon) this.bannerIcon.textContent = item.icon; // Evalúa condición lógica

        SoundEffects.transition();
    }
}

// --- MÓDULO 7: PLAYGROUND & CONSOLA VIRTUAL EN VIVO (SLIDE 9) ---
class PlaygroundManager { // Define clase
    static init() {
        this.editor = document.getElementById("liveCodeEditor"); // Obtiene referencia al elemento del DOM
        this.consoleContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia al elemento del DOM
        this.presetSelect = document.getElementById("codePresetSelect"); // Obtiene referencia al elemento del DOM
        this.btnRun = document.getElementById("btnRunEditorCode"); // Obtiene referencia al elemento del DOM
        this.btnClear = document.getElementById("btnClearConsole"); // Obtiene referencia al elemento del DOM
        this.btnReset = document.getElementById("btnResetCode"); // Obtiene referencia al elemento del DOM

        this.presets = {
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

        this.bindEvents();
        this.loadPreset("preset-strict-1");
    }

    static bindEvents() {
        if (this.btnRun) { // Evalúa condición lógica
            this.btnRun.addEventListener("click", () => this.runCode());
        }
        if (this.btnClear) { // Evalúa condición lógica
            this.btnClear.addEventListener("click", () => this.clearConsole());
        }
        if (this.btnReset) { // Evalúa condición lógica
            this.btnReset.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.loadPreset(this.presetSelect.value);
                showToast("Código restaurado", "↺");
            });
        }
        if (this.presetSelect) { // Evalúa condición lógica
            this.presetSelect.addEventListener("change", (e) => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.loadPreset(e.target.value);
            });
        }
    }

    static loadPreset(key) {
        if (this.editor && this.presets[key]) { // Evalúa condición lógica
            this.editor.value = this.presets[key];
            if (this.presetSelect && this.presets[key] && !key.startsWith("preset-ex")) { // Evalúa condición lógica
                this.presetSelect.value = key;
            }
        }
    }

    static clearConsole() {
        if (this.consoleContainer) { // Evalúa condición lógica
            this.consoleContainer.innerHTML = `
                <div class="log-line info-line">
                    <span class="log-time">[Consola limpia]</span> Lista para nuevas ejecuciones...
                </div>
            `;
            SoundEffects.click();
        }
    }

    static appendLog(message, type = "normal") {
        if (!this.consoleContainer) return; // Evalúa condición lógica
        const now = new Date(); // Declara e inicializa variable local
        const timeStr = now.toTimeString().split(" ")[0]; // Declara e inicializa variable local

        const line = document.createElement("div"); // Declara e inicializa variable local
        line.className = `log-line log-${type}`;
        line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`; // Actualiza contenido en el DOM
        this.consoleContainer.appendChild(line);
        this.consoleContainer.scrollTop = this.consoleContainer.scrollHeight;
    }

    static runCode() {
        if (!this.editor) return; // Evalúa condición lógica
        const userCode = this.editor.value; // Declara e inicializa variable local
        SoundEffects.click();

        this.appendLog("--- Ejecutando snippet ---", "info");

        try { // Inicia bloque protegido contra errores
            const customConsole = {
                log: (...args) => {
                    const formatted = args.map((arg) => {
                        if (typeof arg === "object" && arg !== null) { // Evalúa condición lógica
                            try { // Inicia bloque protegido contra errores
                                return JSON.stringify(arg, (k, v) => typeof v === "function" ? "[Function]" : v); // Retorna el resultado de la función
                            } catch (e) {
                                return String(arg); // Retorna el resultado de la función
                            }
                        }
                        return String(arg); // Retorna el resultado de la función
                    }).join(" ");
                    this.appendLog(formatted, "normal");
                },
                error: (...args) => {
                    const formatted = args.join(" "); // Declara e inicializa variable local
                    this.appendLog(formatted, "error");
                }
            };

            const runner = new Function("console", userCode); // Declara e inicializa variable local
            runner(customConsole);

            SoundEffects.success();
            this.appendLog("✔ Ejecución completada.", "success");
        } catch (err) {
            SoundEffects.alert();
            this.appendLog(`❌ Excepción: ${err.name} - ${err.message}`, "error");
        }
    }
}

// --- MÓDULO 8: RETOS Y SOLUCIONES (SLIDE 10) ---
function initSlide10Exercises() { // Define función reutilizable
    document.querySelectorAll(".btn-ex-solution").forEach((btn) => {
        btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            SoundEffects.click();
            const targetId = btn.getAttribute("data-sol"); // Declara e inicializa variable local
            const solBox = document.getElementById(targetId); // Declara e inicializa variable local
            if (solBox) { // Evalúa condición lógica
                const isVisible = solBox.classList.contains("visible"); // Declara e inicializa variable local
                solBox.classList.toggle("visible");
                btn.textContent = isVisible ? "Ver Solución" : "Ocultar Solución"; // Actualiza contenido en el DOM
            }
        });
    });

    document.querySelectorAll("[data-load-preset]").forEach((btn) => {
        btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa variable local
            SoundEffects.click();
            PlaygroundManager.loadPreset(presetKey);
            PresentationController.goToSlide(9); // Slide 9: Playground
            showToast("Reto cargado en el Playground. ¡Presiona Ejecutar!", "🚀");
        });
    });

    const btnCopyCheat = document.getElementById("btnCopySummaryCheat"); // Declara e inicializa variable local
    if (btnCopyCheat) { // Evalúa condición lógica
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

        btnCopyCheat.addEventListener("click", () => { // Registra escuchador de evento en el DOM
            navigator.clipboard.writeText(cheatSheetMarkdown).then(() => {
                SoundEffects.success();
                showToast("¡Chuleta en Markdown copiada al portapapeles!", "📋");
            });
        });
    }
}

// --- INICIALIZACIÓN GLOBAL AL CARGAR EL DOM ---
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de evento en el DOM
    PresentationController.init();
    initSlide2Demo();
    initSlide3Demo();
    SilentErrorsSimulator.init();
    initSlide5Optimization();
    initSlide6ReservedWords();
    LegalEditorSimulator.init();
    PlaygroundManager.init();
    initSlide10Exercises();

    console.log("🛡️ Presentación de Modo Estricto cargada con éxito en JavaScript Master Level."); // Imprime salida en consola
});

