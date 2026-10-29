/**
 * ==============================================================================
 * 🕰️ JAVASCRIPT MASTER LEVEL: EL OBJETO DATE EN JAVASCRIPT
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, simuladores de tiempo y playground
 * Documentación pedagógica línea por línea para fines de estudio y aprendizaje
 * ==============================================================================
 */

// Activamos el modo estricto en el archivo para garantizar ejecución segura y sin errores silenciosos
"use strict";

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Objeto que almacena el estado reactivo de la presentación y configuraciones del usuario
const AppState = {
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación (10 diapositivas)
    totalSlides: 10,
    // Booleano: true para modo diapositivas (slides), false para modo documento continuo
    isPresentationMode: true,
    // Booleano: true si los efectos de sonido sintetizados están activos
    soundEnabled: true,
    // Almacena la instancia de AudioContext para la síntesis de sonido en el navegador
    audioCtx: null,
    // Caso actualmente seleccionado en el comparador Trampas vs Moderno (Slide 4)
    activeScenario: "diaSemana",
    // Estado del reloj astronómico en la analogía (Slide 8: 'snapshot' o 'wheels')
    activeClockState: "snapshot"
};

// --- MÓDULO DE EFECTOS DE SONIDO SINTETIZADOS (Web Audio API) ---
// Clase estática que genera efectos de sonido procedimentales sin requerir archivos mp3 externos
class SoundEffects {
    // Inicializa el contexto de audio únicamente cuando el usuario interactúa (requerido por políticas de navegadores)
    static init() {
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            // Instancia un nuevo contexto de audio nativo
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) {
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return;

        try {
            // Aseguramos que el AudioContext esté inicializado
            this.init();
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return;

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === "suspended") {
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
        this.playTone(600, "triangle", 0.04, 0.03);
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() {
        this.playTone(523.25, "sine", 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, "sine", 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() {
        this.playTone(320, "sine", 0.06, 0.03);
        setTimeout(() => this.playTone(480, "sine", 0.08, 0.03), 40);
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static error() {
        this.playTone(280, "sawtooth", 0.15, 0.04);
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = {
    // Preset 1: Desglose completo de los 7 métodos Getters
    "preset-date-1": `// ==========================================
// 1. DESGLOSE DE LOS 7 MÉTODOS GETTERS
// ==========================================

const ahora = new Date();

console.log("Instancia completa       :", ahora.toString());
console.log("1. getDate() [Día 1-31]  :", ahora.getDate());
console.log("2. getDay() [Semana 0-6] :", ahora.getDay(), "(0 = Domingo)");
console.log("3. getMonth() [Mes 0-11] :", ahora.getMonth(), "(0 = Enero)");
console.log("4. getFullYear() [YYYY]  :", ahora.getFullYear());
console.log("5. getHours() [0-23]     :", ahora.getHours());
console.log("6. getMinutes() [0-59]   :", ahora.getMinutes());
console.log("7. getSeconds() [0-59]   :", ahora.getSeconds());`,

    // Preset 2: Extracción y formateo práctico (Fecha + Hora)
    "preset-date-2": `// ==========================================
// 2. EXTRACCIÓN Y FORMATEO PRÁCTICO
// ==========================================

const fechaActual = new Date();

const diaMes = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1; // Se suma 1 porque Enero es 0
const anio = fechaActual.getFullYear();

const horas = fechaActual.getHours();
const minutos = fechaActual.getMinutes();
const segundos = fechaActual.getSeconds();

console.log(\`Fecha: \${diaMes}/\${mes}/\${anio} - Hora: \${horas}:\${minutos}:\${segundos}\`);`,

    // Preset 3: Comparativa: Trampas (getDays / getYear) vs. Estándar Moderno
    "preset-date-3": `// ==========================================
// 3. TRAMPAS DE APUNTES VS. ESTÁNDAR MODERNO
// ==========================================

const fecha = new Date("2026-10-29T14:30:00");

// ⚠️ OBSOLETO: getYear() resta 1900 al año actual (Efecto Y2K)
console.log("⚠️ getYear() obsoleto    :", fecha.getYear(), "(Devuelve 126 en vez de 2026)");
console.log("✅ getFullYear() moderno :", fecha.getFullYear(), "(4 dígitos completos)");

// ⚠️ CONFUSO: getMonth() sin sumar 1 muestra Octubre como mes 9
console.log("⚠️ getMonth() crudo      :", fecha.getMonth());
console.log("✅ getMonth() + 1        :", fecha.getMonth() + 1);

// ❌ ERROR: getDays() en plural no existe (es getDay() en singular)
console.log("¿Existe fecha.getDays?   :", typeof fecha.getDays);
console.log("✅ fecha.getDay()        :", fecha.getDay(), "(4 = Jueves)");`,

    // Preset 4: Reloj Digital con String.prototype.padStart(2, "0")
    "preset-date-4": `// ==========================================
// 4. RELOJ DIGITAL CON .padStart(2, "0")
// ==========================================

// Probamos con una hora cuyos números son menores a 10 (08:05:09):
const muestra = new Date("2026-10-29T08:05:09");

const sinFormato = \`\${muestra.getHours()}:\${muestra.getMinutes()}:\${muestra.getSeconds()}\`;

const h = String(muestra.getHours()).padStart(2, "0");
const m = String(muestra.getMinutes()).padStart(2, "0");
const s = String(muestra.getSeconds()).padStart(2, "0");
const conPadStart = \`\${h}:\${m}:\${s}\`;

console.log("Sin padStart (⚠️) :", sinFormato);
console.log("Con padStart (✅) :", conPadStart);`,

    // Preset 5: Nombres de días y meses con Arrays indexados en 0
    "preset-date-5": `// ==========================================
// 5. TRADUCCIÓN DE DÍAS Y MESES CON ARRAYS
// ==========================================

const hoy = new Date();

// Como getDay() y getMonth() empiezan en 0, coinciden con los índices del Array:
const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

console.log("Índice getDay()   :", hoy.getDay(), "➔", dias[hoy.getDay()]);
console.log("Índice getMonth() :", hoy.getMonth(), "➔", meses[hoy.getMonth()]);
console.log(\`Hoy es \${dias[hoy.getDay()]}, \${hoy.getDate()} de \${meses[hoy.getMonth()]} de \${hoy.getFullYear()}\`);`,

    // Preset 6: Unix Epoch y diferencia entre new Date() y Date()
    "preset-date-6": `// ==========================================
// 6. UNIX EPOCH Y 'new Date()' VS 'Date()'
// ==========================================

const instancia = new Date();
const sinNew = Date(); // Sin la palabra 'new'

console.log("Milisegundos desde 1 Ene 1970 UTC :", instancia.getTime());
console.log("Fecha origen Unix Epoch (0 ms)    :", new Date(0).toUTCString());
console.log("Con 'new Date()' (typeof)         :", typeof instancia, "| getDate():", instancia.getDate());
console.log("Sin 'new' -> Date() (typeof)      :", typeof sinNew, "| getDate:", typeof sinNew.getDate);`,

    // Presets de los 3 Retos del Curso
    "preset-ex-date1": `// RETO NIVEL 1 (Junior): Fecha en formato "DD/MM/YYYY"
const hoy = new Date();

const dia = hoy.getDate();
const mes = hoy.getMonth() + 1; // Sumamos 1 porque enero es 0
const anio = hoy.getFullYear(); // Evitamos getYear() para obtener los 4 dígitos

const fechaFormateada = \`\${dia}/\${mes}/\${anio}\`;
console.log("Fecha actual (DD/MM/YYYY):", fechaFormateada);`,

    "preset-ex-date2": `// RETO NIVEL 2 (Semi-Senior): Función obtenerNombreDia(fecha)
function obtenerNombreDia(fecha) {
    // El índice 0 corresponde obligatoriamente a Domingo
    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];

    const indiceDia = fecha.getDay();
    return diasSemana[indiceDia];
}

const miFecha = new Date();
console.log("Hoy es:", obtenerNombreDia(miFecha));
console.log("29 de Octubre de 2026 es:", obtenerNombreDia(new Date("2026-10-29T12:00:00")));`,

    "preset-ex-date3": `// RETO NIVEL 3 (Avanzado): Función flecha relojDigital() con padStart
const relojDigital = () => {
    const ahora = new Date();

    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");

    return \`\${horas}:\${minutos}:\${segundos}\`;
};

console.log("Hora exacta en Reloj Digital:", relojDigital());`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController {
    static init() {
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-date-1");
    }

    // Genera las bolitas (dots) de la barra inferior de navegación
    static renderDots() {
        const dotsContainer = document.getElementById("slideDotsContainer");
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";

        for (let i = 1; i <= AppState.totalSlides; i++) {
            const dot = document.createElement("button");
            dot.className = `slide-dot ${i === AppState.currentSlide ? "active" : ""}`;
            dot.title = `Ir a la diapositiva ${i}`;
            dot.setAttribute("data-slide-target", i);
            dot.addEventListener("click", () => {
                SoundEffects.click();
                this.goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Genera las tarjetas clicables dentro del modal de Visión General (Overview Grid)
    static renderOverviewGrid() {
        const overviewGrid = document.getElementById("overviewGrid");
        if (!overviewGrid) return;
        overviewGrid.innerHTML = "";

        const slideElements = document.querySelectorAll(".slide");
        slideElements.forEach((slide, idx) => {
            const slideNum = idx + 1;
            const title = slide.getAttribute("data-title") || `Diapositiva ${slideNum}`;
            const card = document.createElement("div");
            card.className = `overview-card ${slideNum === AppState.currentSlide ? "active" : ""}`;
            card.innerHTML = `
                <div class="ov-num">${slideNum}</div>
                <div class="ov-title">${title}</div>
            `;
            card.addEventListener("click", () => {
                SoundEffects.transition();
                this.goToSlide(slideNum);
                this.closeOverview();
            });
            overviewGrid.appendChild(card);
        });
    }

    // Actualiza el estado visual: diapositivas activas, barra de progreso e indicadores
    static updatePresentationState() {
        const slides = document.querySelectorAll(".slide");
        slides.forEach((slide) => {
            const num = parseInt(slide.getAttribute("data-slide"), 10);
            if (num === AppState.currentSlide) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        // Actualiza el indicador de texto: "X / 10"
        const slideIndicator = document.getElementById("slideIndicator");
        if (slideIndicator) {
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
        }

        // Actualiza el ancho de la barra de progreso
        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100;
            progressBar.style.width = `${pct}%`;
        }

        // Actualiza las bolitas inferiores
        const dots = document.querySelectorAll(".slide-dot");
        dots.forEach((dot, idx) => {
            if (idx + 1 === AppState.currentSlide) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Actualiza el estado de las tarjetas en el modal overview
        const ovCards = document.querySelectorAll(".overview-card");
        ovCards.forEach((card, idx) => {
            if (idx + 1 === AppState.currentSlide) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // Desplaza suavemente hacia arriba
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Salta a una diapositiva específica
    static goToSlide(slideNum) {
        if (slideNum < 1 || slideNum > AppState.totalSlides) return;
        AppState.currentSlide = slideNum;
        SoundEffects.transition();
        this.updatePresentationState();
    }

    static nextSlide() {
        if (AppState.currentSlide < AppState.totalSlides) {
            this.goToSlide(AppState.currentSlide + 1);
        }
    }

    static prevSlide() {
        if (AppState.currentSlide > 1) {
            this.goToSlide(AppState.currentSlide - 1);
        }
    }

    // Alterna entre modo presentación (diapositivas) y modo documento corrido
    static toggleMode() {
        AppState.isPresentationMode = !AppState.isPresentationMode;
        const body = document.body;
        const modeText = document.getElementById("modeText");
        const modeIcon = document.getElementById("modeIcon");

        if (AppState.isPresentationMode) {
            body.classList.remove("mode-document");
            body.classList.add("mode-presentation");
            if (modeText) modeText.textContent = "Modo Guía";
            if (modeIcon) modeIcon.textContent = "📑";
            this.showToast("Modo Presentación activado");
        } else {
            body.classList.remove("mode-presentation");
            body.classList.add("mode-document");
            if (modeText) modeText.textContent = "Modo Diapo";
            if (modeIcon) modeIcon.textContent = "🖼️";
            this.showToast("Modo Documento Continuo activado");
        }
    }

    // Alterna sonido On/Off
    static toggleSound() {
        AppState.soundEnabled = !AppState.soundEnabled;
        const soundIcon = document.getElementById("soundIcon");
        if (soundIcon) {
            soundIcon.textContent = AppState.soundEnabled ? "🔊" : "🔇";
        }
        if (AppState.soundEnabled) {
            SoundEffects.success();
            this.showToast("Efectos de audio activados");
        } else {
            this.showToast("Audio silenciado");
        }
    }

    // Abre el modal Overview
    static openOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            modal.classList.add("active");
            SoundEffects.click();
        }
    }

    // Cierra el modal Overview
    static closeOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            modal.classList.remove("active");
        }
    }

    // Alterna pantalla completa
    static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Muestra una notificación flotante (Toast)
    static showToast(message, isError = false) {
        const toast = document.getElementById("toastNotification");
        const toastMsg = document.getElementById("toastMsg");
        const toastIcon = document.getElementById("toastIcon");
        if (!toast || !toastMsg) return;

        toastMsg.textContent = message;
        if (toastIcon) {
            toastIcon.textContent = isError ? "⚠️" : "✔";
        }

        toast.classList.add("active");
        setTimeout(() => {
            toast.classList.remove("active");
        }, 3000);
    }

    // Carga un preset de código en el textarea del Playground
    static loadPlaygroundPreset(presetKey) {
        const textarea = document.getElementById("liveCodeEditor");
        if (!textarea) return;
        const code = CodePresets[presetKey] || "// Código no disponible";
        textarea.value = code;

        const select = document.getElementById("codePresetSelect");
        if (select && CodePresets[presetKey]) {
            select.value = presetKey;
        }
    }

    // Ejecuta el código del Playground capturando la consola virtual
    static runPlaygroundCode() {
        const textarea = document.getElementById("liveCodeEditor");
        const logsContainer = document.getElementById("consoleLogsContainer");
        if (!textarea || !logsContainer) return;

        const codeToRun = textarea.value;
        logsContainer.innerHTML = "";

        // Función auxiliar para agregar líneas al panel de consola virtual
        const appendVirtualLog = (type, args) => {
            const line = document.createElement("div");
            line.className = `log-line ${type}-line`;
            const timeSpan = document.createElement("span");
            timeSpan.className = "log-time";
            timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`;
            line.appendChild(timeSpan);

            const contentText = args.map(arg => {
                if (arg instanceof Date) {
                    return arg.toString();
                }
                if (typeof arg === "object" && arg !== null) {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(" ");

            const textNode = document.createTextNode(" " + contentText);
            line.appendChild(textNode);
            logsContainer.appendChild(line);
            logsContainer.scrollTop = logsContainer.scrollHeight;
        };

        // Guardamos los métodos originales de console
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        try {
            // Sobrescribimos console para interceptar la salida
            console.log = (...args) => {
                originalLog(...args);
                appendVirtualLog("info", args);
            };
            console.error = (...args) => {
                originalError(...args);
                appendVirtualLog("error", args);
            };
            console.warn = (...args) => {
                originalWarn(...args);
                appendVirtualLog("warn", args);
            };
            console.info = (...args) => {
                originalInfo(...args);
                appendVirtualLog("info", args);
            };

            // Ejecutamos el código con Function para aislar ámbito
            const runFn = new Function(codeToRun);
            runFn();

            SoundEffects.success();
            AppController.showToast("Código ejecutado con éxito");
        } catch (err) {
            console.error("Excepción:", err.name, "-", err.message);
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
        } finally {
            // Restauramos los métodos originales de console
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
        }
    }

    // Vincula todos los escuchadores de eventos
    static bindEvents() {
        // Navegación con botones
        const btnNext = document.getElementById("btnNextSlide");
        const btnPrev = document.getElementById("btnPrevSlide");
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide());
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide());

        // Botones de inicio en slide 1
        const btnStart = document.getElementById("btnStartPresentation");
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2));

        // Botones de salto [data-jump]
        document.querySelectorAll("[data-jump]").forEach(btn => {
            btn.addEventListener("click", () => {
                const target = parseInt(btn.getAttribute("data-jump"), 10);
                this.goToSlide(target);
            });
        });

        // Controles de barra superior
        const btnToggleMode = document.getElementById("btnToggleMode");
        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode());

        const btnToggleSound = document.getElementById("btnToggleSound");
        if (btnToggleSound) btnToggleSound.addEventListener("click", () => this.toggleSound());

        const btnOverview = document.getElementById("btnOverview");
        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview());

        const btnCloseOverview = document.getElementById("btnCloseOverview");
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview());

        const btnFullscreen = document.getElementById("btnFullscreen");
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

        // Cerrar modal al hacer clic en el backdrop
        const overviewModal = document.getElementById("overviewModal");
        if (overviewModal) {
            overviewModal.addEventListener("click", (e) => {
                if (e.target === overviewModal) this.closeOverview();
            });
        }

        // Atajos de teclado
        window.addEventListener("keydown", (e) => {
            // Si está escribiendo dentro del textarea o input, no intervenir
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
                // Ctrl + Enter para ejecutar código en playground
                if (e.ctrlKey && e.key === "Enter") {
                    e.preventDefault();
                    this.runPlaygroundCode();
                }
                return;
            }

            if (e.key === "ArrowRight" || e.key === " " || e.key === "d" || e.key === "D") {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === "o" || e.key === "O") {
                e.preventDefault();
                const modal = document.getElementById("overviewModal");
                if (modal && modal.classList.contains("active")) {
                    this.closeOverview();
                } else {
                    this.openOverview();
                }
            } else if (e.key === "f" || e.key === "F") {
                e.preventDefault();
                this.toggleFullscreen();
            } else if (e.key === "Escape") {
                this.closeOverview();
            }
        });

        // Botones de copiar código
        document.querySelectorAll(".btn-copy-code").forEach(btn => {
            btn.addEventListener("click", () => {
                const targetId = btn.getAttribute("data-target");
                const codeEl = document.getElementById(targetId);
                if (codeEl) {
                    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
                        SoundEffects.click();
                        this.showToast("Código copiado al portapapeles");
                    });
                }
            });
        });

        // ----------------------------------------------------------------------
        // INTERACCIONES ESPECÍFICAS DE SLIDES
        // ----------------------------------------------------------------------

        // Slide 2: Capturar Fecha y Hora Actual en Vivo
        const btnTestDateIntro = document.getElementById("btnTestDateIntro");
        const statusDateIntro = document.getElementById("testDateIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        if (btnTestDateIntro && consoleOutput1) {
            btnTestDateIntro.addEventListener("click", () => {
                SoundEffects.success();
                const ahora = new Date();
                const dia = ahora.getDate();
                const mes = ahora.getMonth() + 1;
                const anio = ahora.getFullYear();
                const h = String(ahora.getHours()).padStart(2, "0");
                const m = String(ahora.getMinutes()).padStart(2, "0");
                const s = String(ahora.getSeconds()).padStart(2, "0");

                if (statusDateIntro) statusDateIntro.textContent = "Instanciado con éxito";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const fechaActual = new Date(); // Epoch: ${ahora.getTime()} ms</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; Fecha: ${dia}/${mes}/${anio} - Hora: ${h}:${m}:${s}</div>
                `;
                this.showToast("Marca temporal capturada en vivo");
            });
        }

        // Slide 3: Extraer los 7 Métodos Getters en Tiempo Real
        const btnCheckAllGetters = document.getElementById("btnCheckAllGetters");
        const allGettersResult = document.getElementById("allGettersResult");
        if (btnCheckAllGetters && allGettersResult) {
            btnCheckAllGetters.addEventListener("click", () => {
                SoundEffects.success();
                const d = new Date();
                allGettersResult.innerHTML = `
                    <code>getDate(): ${d.getDate()}</code> |
                    <code>getDay(): ${d.getDay()}</code> |
                    <code>getMonth(): ${d.getMonth()} (+1 = ${d.getMonth() + 1})</code> |
                    <code>getFullYear(): ${d.getFullYear()}</code><br>
                    <code>getHours(): ${d.getHours()}</code> |
                    <code>getMinutes(): ${d.getMinutes()}</code> |
                    <code>getSeconds(): ${d.getSeconds()}</code><br>
                    <small style="color: var(--emerald);">Los 7 valores fueron extraídos de la instancia actual new Date() en tu navegador.</small>
                `;
            });
        }

        // Slide 4: Comparador de Trampas vs Estándar Moderno
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareDateModes = document.getElementById("btnCompareDateModes");
        if (btnCompareDateModes) {
            btnCompareDateModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de Flujo de Extracción y Formateo
        const flowTabs = document.querySelectorAll("[data-flow]");
        flowTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                flowTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const viewId = `flow-view-${tab.getAttribute("data-flow")}`;
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active"));
                const targetView = document.getElementById(viewId);
                if (targetView) targetView.classList.add("active");
                SoundEffects.click();
            });
        });

        // Slide 5.1: Botón Árbol Completo de Extracción
        const btnTestExtractionTree = document.getElementById("btnTestExtractionTree");
        const extractionTreeResult = document.getElementById("extractionTreeResult");
        if (btnTestExtractionTree && extractionTreeResult) {
            btnTestExtractionTree.addEventListener("click", () => {
                SoundEffects.success();
                const d = new Date();
                extractionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">📅 Calendario:</span> <code>getDate()=${d.getDate()} | getMonth()=${d.getMonth()} | getFullYear()=${d.getFullYear()}</code><br>
                    <span style="color: var(--emerald);">📆 Semana:</span> <code>getDay()=${d.getDay()}</code> &nbsp;|&nbsp;
                    <span style="color: var(--amber);">⌚ Reloj 24h:</span> <code>${d.getHours()}h : ${d.getMinutes()}m : ${d.getSeconds()}s</code>
                `;
            });
        }

        // Slide 5.2: Botón padStart(2, "0")
        const btnTestPadStart = document.getElementById("btnTestPadStart");
        const padStartResult = document.getElementById("padStartResult");
        if (btnTestPadStart && padStartResult) {
            btnTestPadStart.addEventListener("click", () => {
                SoundEffects.success();
                padStartResult.innerHTML = `
                    <span style="color: var(--amber);">⚠️ Sin padStart:</span> <code>"8:5:9"</code> (Difícil de leer y desalineado)<br>
                    <span style="color: var(--emerald);">✅ Con .padStart(2, "0"):</span> <code>"08:05:09"</code> (Estándar profesional HH:MM:SS)
                `;
            });
        }

        // Slide 5.3: Botón Arrays Indexados en Cero
        const btnTestArrayNames = document.getElementById("btnTestArrayNames");
        const arrayNamesResult = document.getElementById("arrayNamesResult");
        if (btnTestArrayNames && arrayNamesResult) {
            btnTestArrayNames.addEventListener("click", () => {
                SoundEffects.success();
                const d = new Date();
                const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                arrayNamesResult.innerHTML = `
                    <code>dias[${d.getDay()}] ➔ "${dias[d.getDay()]}"</code> |
                    <code>meses[${d.getMonth()}] ➔ "${meses[d.getMonth()]}"</code><br>
                    <small style="color: var(--emerald);">Los índices 0-6 y 0-11 encajan de forma directa sin sumar ni restar nada.</small>
                `;
            });
        }

        // Slide 7: Obtener Día de la Semana en Vivo
        const btnTestDayArray = document.getElementById("btnTestDayArray");
        const dayArrayResult = document.getElementById("dayArrayResult");
        if (btnTestDayArray && dayArrayResult) {
            btnTestDayArray.addEventListener("click", () => {
                SoundEffects.success();
                const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                const hoy = new Date();
                dayArrayResult.innerHTML = `
                    <code>hoy.getDay() ➔ ${hoy.getDay()} ➔ "${dias[hoy.getDay()]}"</code><br>
                    <small style="color: var(--emerald);">El arreglo comienza con "Domingo" en la posición [0].</small>
                `;
            });
        }

        // Slide 7: Generar Marca de Reloj Digital HH:MM:SS
        const btnTestDigitalClock = document.getElementById("btnTestDigitalClock");
        const digitalClockResult = document.getElementById("digitalClockResult");
        if (btnTestDigitalClock && digitalClockResult) {
            btnTestDigitalClock.addEventListener("click", () => {
                SoundEffects.success();
                const d = new Date();
                const h = String(d.getHours()).padStart(2, "0");
                const m = String(d.getMinutes()).padStart(2, "0");
                const s = String(d.getSeconds()).padStart(2, "0");
                digitalClockResult.innerHTML = `
                    <code>relojDigital() ➔ "${h}:${m}:${s}"</code><br>
                    <small style="color: var(--cyan);">Pulsa varias veces para ver avanzar el segundero formateado a 2 dígitos.</small>
                `;
            });
        }

        // Slide 8: Metáfora del Reloj Astronómico de Pared
        const clockBtns = document.querySelectorAll("[data-clock]");
        clockBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                clockBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeClockState = btn.getAttribute("data-clock");
                SoundEffects.click();
                this.updateClockView(AppState.activeClockState);
            });
        });

        // Slide 9: Playground select preset
        const codePresetSelect = document.getElementById("codePresetSelect");
        if (codePresetSelect) {
            codePresetSelect.addEventListener("change", (e) => {
                SoundEffects.click();
                this.loadPlaygroundPreset(e.target.value);
            });
        }

        // Slide 9: Botón restaurar preset
        const btnResetCode = document.getElementById("btnResetCode");
        if (btnResetCode) {
            btnResetCode.addEventListener("click", () => {
                SoundEffects.click();
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-date-1";
                this.loadPlaygroundPreset(currentPreset);
                this.showToast("Código restaurado");
            });
        }

        // Slide 9: Botón ejecutar código
        const btnRunEditorCode = document.getElementById("btnRunEditorCode");
        if (btnRunEditorCode) {
            btnRunEditorCode.addEventListener("click", () => {
                this.runPlaygroundCode();
            });
        }

        // Slide 9: Botón limpiar consola
        const btnClearConsole = document.getElementById("btnClearConsole");
        const logsContainer = document.getElementById("consoleLogsContainer");
        if (btnClearConsole && logsContainer) {
            btnClearConsole.addEventListener("click", () => {
                SoundEffects.click();
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>';
            });
        }

        // Slide 10: Botones "Cargar en Playground" de los retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => {
            btn.addEventListener("click", () => {
                const presetKey = btn.getAttribute("data-load-preset");
                SoundEffects.transition();
                this.loadPlaygroundPreset(presetKey);
                this.goToSlide(9); // Salta al playground
                this.showToast("Reto cargado en el Playground");
            });
        });

        // Slide 10: Botones "Ver Solución"
        document.querySelectorAll("[data-sol]").forEach(btn => {
            btn.addEventListener("click", () => {
                const solId = btn.getAttribute("data-sol");
                const solBox = document.getElementById(solId);
                if (solBox) {
                    SoundEffects.click();
                    solBox.classList.toggle("active");
                    btn.textContent = solBox.classList.contains("active") ? "Ocultar Solución" : "Ver Solución";
                }
            });
        });

        // Slide 10: Reiniciar presentación
        const btnRestart = document.getElementById("btnRestartPresentation");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                SoundEffects.transition();
                this.goToSlide(1);
            });
        }

        // Slide 10: Copiar chuleta rápida en markdown
        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat");
        if (btnCopySummaryCheat) {
            btnCopySummaryCheat.addEventListener("click", () => {
                const cheatText = `# GUÍA MAESTRA: EL OBJETO DATE EN JAVASCRIPT

1. **Instanciación Obligatoria:**
   \`const ahora = new Date();\` (Almacena milisegundos desde el 1 de enero de 1970 UTC).

2. **Los 7 Métodos de Extracción (Getters):**
   - \`getDate()\`: Día del mes (\`1\` al \`31\`).
   - \`getDay()\`: Día de la semana (\`0\` Domingo a \`6\` Sábado). ¡En singular!
   - \`getMonth()\`: Mes del año (\`0\` Enero a \`11\` Diciembre). Sumar \`+ 1\` para formato numérico.
   - \`getFullYear()\`: Año completo de 4 dígitos (ej. \`2026\`). Nunca usar el obsoleto \`getYear()\`.
   - \`getHours()\`, \`getMinutes()\`, \`getSeconds()\`: Hora (0-23), minutos (0-59) y segundos (0-59).

3. **Formateo de Reloj Digital con padStart:**
   \`\`\`javascript
   const min = String(ahora.getMinutes()).padStart(2, "0");
   \`\`\`

4. **Traducción con Arreglos:**
   \`\`\`javascript
   const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
   const nombreHoy = dias[ahora.getDay()];
   \`\`\`
`;
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre Trampas y Estándar Moderno en el Slide 4
    static runScenarioSimulation(scenarioKey) {
        const terminalTraps = document.getElementById("terminalTraps");
        const terminalModern = document.getElementById("terminalModern");
        const feedbackText = document.getElementById("dateFeedbackText");
        if (!terminalTraps || !terminalModern) return;

        SoundEffects.transition();

        if (scenarioKey === "diaSemana") {
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; const dia = fecha.getDays();</div>
                <div class="term-line" style="color: var(--rose);">&gt; ❌ Uncaught TypeError: fecha.getDays is not a function</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const diaSemana = fecha.getDay(); // En singular</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Devuelve 0 (Domingo) a 6 (Sábado) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getDays() vs. getDay():</strong> En apuntes suele escribirse con 's' al final por error, pero en JavaScript oficial es singular: <code>getDay()</code>.";
        } else if (scenarioKey === "anio") {
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; const anio = new Date("2026-10-29").getYear();</div>
                <div class="term-line" style="color: var(--rose);">&gt; // Devuelve: 126 (Porque calcula 2026 - 1900) ⚠️</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const anio = new Date("2026-10-29").getFullYear();</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Devuelve: 2026 (Año completo de 4 dígitos) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getYear() vs. getFullYear():</strong> <code>getYear()</code> está desaprobado por el Efecto Y2K; usa siempre <code>getFullYear()</code>.";
        } else if (scenarioKey === "mes") {
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; // Fecha: 29 de Octubre de 2026</div>
                <div class="term-line" style="color: var(--rose);">&gt; fecha.getMonth(); ➔ Devuelve 9 (Parece Septiembre) ⚠️</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; // Ajustado para lectura humana (1 a 12):</div>
                <div class="term-line" style="color: var(--cyan);">&gt; fecha.getMonth() + 1; ➔ Devuelve 10 (Octubre) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Indexación del Mes:</strong> Como Enero es el mes <code>0</code>, recuerda sumar <code>+ 1</code> cuando armes cadenas numéricas como <code>DD/MM/YYYY</code>.";
        } else if (scenarioKey === "diaMes") {
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; // Queriendo mostrar "29 de octubre":</div>
                <div class="term-line" style="color: var(--rose);">&gt; fecha.getDay(); ➔ Devuelve 4 (Día de la semana, no del mes) ❌</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; // Método correcto para el número del calendario (1-31):</div>
                <div class="term-line" style="color: var(--cyan);">&gt; fecha.getDate(); ➔ Devuelve 29 ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getDate() vs. getDay():</strong> Usa <code>getDate()</code> para el número del mes (1-31) y <code>getDay()</code> para el día de la semana (0-6).";
        }
    }

    // Actualiza la visualización de la analogía del Reloj Astronómico en el Slide 8
    static updateClockView(clockState) {
        const titleRight = document.getElementById("clockTitleRight");
        const subRight = document.getElementById("clockSubRight");
        const avatarRight = document.getElementById("clockAvatarRight");
        const itemsRight = document.getElementById("clockItemsRight");
        const statusRight = document.getElementById("clockStatusRight");
        const bannerText = document.getElementById("clockBannerText");
        const bannerIcon = document.getElementById("clockBannerIcon");

        const itemsLeft = document.getElementById("clockItemsLeft");
        const statusLeft = document.getElementById("clockStatusLeft");

        if (clockState === "snapshot") {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Al hacer const foto = new Date(), tomas una foto del reloj</div>
                <div class="ws-item">Las agujas dentro de esa variable quedan fijas en ese instante</div>
            `;
            if (statusLeft) statusLeft.textContent = "Para saber la hora 5 segundos después, debes tomar una nueva foto";

            if (avatarRight) avatarRight.textContent = "🕰️";
            if (titleRight) titleRight.textContent = "2. Mirar las Agujas en la Foto";
            if (subRight) subRight.textContent = "getHours(), getMinutes() y getSeconds()";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Llamar a getHours() es observar dónde quedó la aguja de las horas</div>
                <div class="ws-item highlight-item">Llamar a getMinutes() o getSeconds() lee el minutero y segundero</div>
            `;
            if (statusRight) statusRight.textContent = "Lectura directa e instantánea sin alterar la fotografía original";

            if (bannerIcon) bannerIcon.textContent = "📸";
            if (bannerText) {
                bannerText.innerHTML = "<strong>La Fotografía Instantánea:</strong> <code>new Date()</code> captura y congela las agujas del reloj en el milisegundo exacto en que fue invocado.";
            }
        } else {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El reloj tiene dos rueditas mecánicas para Mes y Día de Semana</div>
                <div class="ws-item">Ambas rueditas fueron fabricadas empezando desde el número 0</div>
            `;
            if (statusLeft) statusLeft.textContent = "Posición 0 = Enero (en meses) y Posición 0 = Domingo (en semana)";

            if (avatarRight) avatarRight.textContent = "⚙️";
            if (titleRight) titleRight.textContent = "2. Rueditas Indexadas en Cero";
            if (subRight) subRight.textContent = "getMonth() (0-11) y getDay() (0-6)";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">getMonth() lee la ruedita de meses (0 = Enero ... 11 = Diciembre)</div>
                <div class="ws-item highlight-item">getDay() lee la ruedita semanal (0 = Domingo ... 6 = Sábado)</div>
            `;
            if (statusRight) statusRight.textContent = "Mientras tanto, la ventanilla getDate() sí cuenta del 1 al 31";

            if (bannerIcon) bannerIcon.textContent = "⚙️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Las Rueditas en Cero:</strong> Tanto <code>getMonth()</code> como <code>getDay()</code> arrancan en la posición <code>0</code>, encajando directo con los índices de un Array.";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
