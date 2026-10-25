/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: EL OPERADOR TERNARIO (? :)
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, simuladores y playground
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
    // Escenario actualmente seleccionado en el comparador de if/else vs ternario (Slide 4)
    activeScenario: "tarifa",
    // Estado del interruptor en la analogía de la luz (Slide 8: 'on' o 'off')
    activeSwitchState: "on"
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
    static error() {
        this.playTone(280, 'sawtooth', 0.15, 0.04);
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = {
    // Preset 1: Asignación directa inmutable con const
    "preset-ternary-1": `// ==========================================
// 1. ASIGNACIÓN DIRECTA INMUTABLE CON 'const'
// ==========================================

const puntaje = 85;

// El operador ternario devuelve un valor evaluado inmediatamente
const resultado = puntaje >= 60 ? "Aprobado ✅" : "Reprobado ❌";

console.log("Puntaje obtenido :", puntaje);
console.log("Resultado final  :", resultado);`,

    // Preset 2: Evaluación de Truthy y Falsy (Coerción)
    "preset-ternary-2": `// ==========================================
// 2. EVALUACIÓN DE VALORES TRUTHY Y FALSY
// ==========================================

const probarCoercion = (valor, etiqueta) => {
    const estado = valor ? "Truthy (Verdadero)" : "Falsy (Falso)";
    console.log(\`\${etiqueta} ➔ \${estado}\`);
};

probarCoercion(0, "Número 0");
probarCoercion("", "String vacío ''");
probarCoercion(null, "Valor null");
probarCoercion(undefined, "Valor undefined");
probarCoercion(NaN, "Valor NaN");
probarCoercion("Hola", "String 'Hola'");
probarCoercion([], "Array vacío []");
probarCoercion({}, "Objeto vacío {}");`,

    // Preset 3: Inyección en Template Literals (${ ? : })
    "preset-ternary-3": `// ==========================================
// 3. INYECCIÓN EN TEMPLATE LITERALS (\${ ? : })
// ==========================================

const carrito1 = 1;
const carrito2 = 5;

// Podemos calcular dinámicamente plurales dentro del texto:
const mensaje1 = \`Tienes \${carrito1} artículo\${carrito1 === 1 ? "" : "s"} en el pedido.\`;
const mensaje2 = \`Tienes \${carrito2} artículo\${carrito2 === 1 ? "" : "s"} en el pedido.\`;

console.log("Caso singular :", mensaje1);
console.log("Caso plural   :", mensaje2);`,

    // Preset 4: Función Flecha con Retorno Ternario
    "preset-ternary-4": `// ==========================================
// 4. FUNCIÓN FLECHA CON RETORNO TERNARIO
// ==========================================

// Retorno implícito de una sola línea combinando flecha y ternario:
const clasificarTemperatura = temp => 
    temp > 30 ? "Calor intenso 🔥" : "Clima agradable ⛅";

console.log("35°C :", clasificarTemperatura(35));
console.log("22°C :", clasificarTemperatura(22));`,

    // Preset 5: Condición Compuesta con Paréntesis Legibles
    "preset-ternary-5": `// ==========================================
// 5. CONDICIÓN COMPUESTA CON PARÉNTESIS
// ==========================================

const salario = 4500;
const historialLimpio = true;
const antiguedadMeses = 24;

// Los paréntesis delimitan de forma cristalina la pregunta lógica:
const calificaCredito = (salario >= 3000 && historialLimpio && antiguedadMeses >= 12)
    ? "Apto para crédito hipotecario 🏦"
    : "Requisitos insuficientes ⚠️";

console.log("Evaluación crediticia:", calificaCredito);`,

    // Preset 6: Antipatrón Anidado vs. Object Lookup
    "preset-ternary-6": `// ==========================================
// 6. ANTIPATRÓN ANIDADO VS. OBJECT LOOKUP
// ==========================================

const codigoRol = "MOD";

// ❌ Antipatrón anidado (evitar en producción):
const rolAnidado = codigoRol === "ADM" ? "Admin" 
                 : codigoRol === "MOD" ? "Moderador" 
                 : codigoRol === "USR" ? "Usuario" 
                 : "Invitado";
console.log("Antipatrón anidado :", rolAnidado);

// ✅ Solución profesional: Object Lookup (Mapa de Diccionario):
const rolesDiccionario = {
    ADM: "Admin",
    MOD: "Moderador",
    USR: "Usuario"
};
const rolLimpio = rolesDiccionario[codigoRol] || "Invitado";
console.log("Solución limpia    :", rolLimpio);`,

    // Presets de los retos
    "preset-ex-ternary1": `// RETO 1: Número Par o Impar (Junior)
const numero = 7;

// El operador ternario evalúa el residuo (% 2):
const resultado = numero % 2 === 0 ? "Par" : "Impar";

console.log(\`¿El número \${numero} es par o impar?:\`, resultado);
console.log("Prueba con 10 :", 10 % 2 === 0 ? "Par" : "Impar");`,

    "preset-ex-ternary2": `// RETO 2: Optimización de Rol (Semi-Senior)
let rol = "admin";

// Estructura ternaria inmutable:
const acceso = rol === "admin" ? true : false;

console.log(\`Rol "\${rol}" -> Acceso:\`, acceso);
console.log("Simplificación booleana directa:", rol === "admin");`,

    "preset-ex-ternary3": `// RETO 3: obtenerMensajeEnvio con Retorno Implícito (Avanzado)
const obtenerMensajeEnvio = (totalCompra, esPremium) => 
    (totalCompra >= 50 || esPremium) ? "Envío Gratis" : "Costo de envío: $5";

console.log("Compra $30 sin membresía premium  :", obtenerMensajeEnvio(30, false));
console.log("Compra $60 sin membresía premium  :", obtenerMensajeEnvio(60, false));
console.log("Compra $20 con membresía premium  :", obtenerMensajeEnvio(20, true));`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController {
    static init() {
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-ternary-1");
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

        // Slide 2: Probar Expresión en Vivo
        const btnTestTernaryIntro = document.getElementById("btnTestTernaryIntro");
        const statusTernaryIntro = document.getElementById("testTernaryIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        if (btnTestTernaryIntro && consoleOutput1) {
            btnTestTernaryIntro.addEventListener("click", () => {
                SoundEffects.success();
                if (statusTernaryIntro) statusTernaryIntro.textContent = "Evaluado con éxito";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const edad = 20;</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; const estado = edad &gt;= 18 ? "Adulto" : "Menor de edad";</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; estado ➔ "Adulto" (Asignación inmutable limpia)</div>
                `;
                this.showToast("Expresión ternaria evaluada");
            });
        }

        // Slide 3: Probar valores Truthy / Falsy
        const btnCheckTruthy = document.getElementById("btnCheckTruthy");
        const truthyResult = document.getElementById("truthyResult");
        if (btnCheckTruthy && truthyResult) {
            btnCheckTruthy.addEventListener("click", () => {
                SoundEffects.success();
                const evalua = v => v ? "Truthy ✅" : "Falsy ❌";
                truthyResult.innerHTML = `
                    <code>0 ➔ ${evalua(0)}</code> | 
                    <code>"" ➔ ${evalua("")}</code> | 
                    <code>null ➔ ${evalua(null)}</code><br>
                    <code>"Texto" ➔ ${evalua("Texto")}</code> | 
                    <code>42 ➔ ${evalua(42)}</code> | 
                    <code>[] ➔ ${evalua([])}</code><br>
                    <small style="color: var(--emerald);">El motor evalúa automáticamente según la coerción de verdad o falsedad.</small>
                `;
            });
        }

        // Slide 4: Comparador de Escenarios if/else vs Ternario
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareTernaryModes = document.getElementById("btnCompareTernaryModes");
        if (btnCompareTernaryModes) {
            btnCompareTernaryModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de Precedencia y Flujo
        const precedenceTabs = document.querySelectorAll("[data-flow]");
        precedenceTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                precedenceTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const viewId = `flow-view-${tab.getAttribute("data-flow")}`;
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active"));
                const targetView = document.getElementById(viewId);
                if (targetView) targetView.classList.add("active");
                SoundEffects.click();
            });
        });

        // Slide 5: Botón Cortocircuito
        const btnTestShortCircuit = document.getElementById("btnTestShortCircuit");
        const shortCircuitResult = document.getElementById("shortCircuitResult");
        if (btnTestShortCircuit && shortCircuitResult) {
            btnTestShortCircuit.addEventListener("click", () => {
                SoundEffects.success();
                let funcionFalsaEjecutada = false;
                const fnFalsa = () => { funcionFalsaEjecutada = true; return "Falso"; };
                const valor = true ? "Respuesta Verdadera" : fnFalsa();
                shortCircuitResult.innerHTML = `
                    <code>true ? "Respuesta Verdadera" : fnFalsa(); ➔ "${valor}"</code><br>
                    <span style="color: var(--emerald);">¿Se ejecutó fnFalsa()?: <strong>${funcionFalsaEjecutada}</strong> (Descartada por cortocircuito).</span>
                `;
            });
        }

        // Slide 5: Botón Precedencia
        const btnTestPrecedence = document.getElementById("btnTestPrecedence");
        const precedenceResult = document.getElementById("precedenceResult");
        if (btnTestPrecedence && precedenceResult) {
            btnTestPrecedence.addEventListener("click", () => {
                SoundEffects.success();
                const calc = 100 - 20 > 50 ? "Mayor a 50" : "Menor a 50";
                precedenceResult.innerHTML = `
                    <code>100 - 20 &gt; 50 ? "Mayor a 50" : "Menor a 50" ➔ "${calc}"</code><br>
                    <small>1. Se calculó 100 - 20 = 80.<br>2. Se comparó 80 &gt; 50 = true.<br>3. El ternario eligió la primera opción.</small>
                `;
            });
        }

        // Slide 5: Botón Paréntesis
        const btnTestParentheses = document.getElementById("btnTestParentheses");
        const parenthesesResult = document.getElementById("parenthesesResult");
        if (btnTestParentheses && parenthesesResult) {
            btnTestParentheses.addEventListener("click", () => {
                SoundEffects.success();
                const credito = (750 > 700 && 4000 > 3000) ? "Aprobado 🏦" : "Rechazado ⚠️";
                parenthesesResult.innerHTML = `
                    <code>(750 &gt; 700 &amp;&amp; 4000 &gt; 3000) ? "Aprobado" : "Rechazado" ➔ "${credito}"</code><br>
                    <small style="color: var(--cyan);">Los paréntesis dejan claro dónde termina la condición y empieza el retorno.</small>
                `;
            });
        }

        // Slide 7: Prueba Flecha con Ternario
        const btnTestArrowTernary = document.getElementById("btnTestArrowTernary");
        const arrowTernaryResult = document.getElementById("arrowTernaryResult");
        if (btnTestArrowTernary && arrowTernaryResult) {
            btnTestArrowTernary.addEventListener("click", () => {
                SoundEffects.success();
                const evaluarNota = nota => nota >= 90 ? "Sobresaliente 🌟" : "Estándar 👍";
                arrowTernaryResult.innerHTML = `
                    <code>evaluarNota(95) ➔ "${evaluarNota(95)}"</code><br>
                    <code>evaluarNota(75) ➔ "${evaluarNota(75)}"</code><br>
                    <small style="color: var(--emerald);">Retorno implícito limpio y sin necesidad de bloque {} ni palabra return.</small>
                `;
            });
        }

        // Slide 7: Prueba Template con Ternario
        const btnTestTemplateTernary = document.getElementById("btnTestTemplateTernary");
        const templateTernaryResult = document.getElementById("templateTernaryResult");
        if (btnTestTemplateTernary && templateTernaryResult) {
            btnTestTemplateTernary.addEventListener("click", () => {
                SoundEffects.success();
                const formatear = n => `Tienes ${n} artículo${n === 1 ? "" : "s"} en el pedido`;
                templateTernaryResult.innerHTML = `
                    <code>formatear(1) ➔ "${formatear(1)}"</code><br>
                    <code>formatear(4) ➔ "${formatear(4)}"</code><br>
                    <small style="color: var(--cyan);">Inyección directa dentro de \${} sin romper la cadena de texto.</small>
                `;
            });
        }

        // Slide 8: Metáfora del Interruptor
        const switchBtns = document.querySelectorAll("[data-switch]");
        switchBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                switchBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeSwitchState = btn.getAttribute("data-switch");
                SoundEffects.click();
                this.updateSwitchView(AppState.activeSwitchState);
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-ternary-1";
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
                const cheatText = `# GUÍA MAESTRA: EL OPERADOR TERNARIO (? :) EN JAVASCRIPT

1. **Sintaxis y Anatomía:**
   condicion ? expresion_si_verdad : expresion_si_falsa;

2. **Expresión vs. Declaración:**
   A diferencia de 'if...else', el ternario devuelve un valor directo y permite usar 'const'.

3. **Inyección en Template Literals:**
   const txt = \`Tienes \${n} item\${n === 1 ? '' : 's'}\`;

4. **Retorno Implícito en Funciones Flecha:**
   const esAdulto = edad => edad >= 18 ? "Sí" : "No";

5. **Reglas de Oro:**
   - Cero anidamiento de ternarios múltiples (usar Object Lookup o switch).
   - Envolver condiciones compuestas entre paréntesis (a && b) ? c : d.
   - Evitar 'condicion ? true : false' redundante (usar directamente la condición).
`;
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación comparativa de escenarios para Slide 4
    static runScenarioSimulation(scenarioKey) {
        const terminalIfElse = document.getElementById("terminalIfElse");
        const terminalTernary = document.getElementById("terminalTernary");
        const feedbackText = document.getElementById("ternaryFeedbackText");
        if (!terminalIfElse || !terminalTernary) return;

        SoundEffects.transition();

        if (scenarioKey === "tarifa") {
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let tarifa;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (esSocio) {</div>
                <div class="term-line" style="color: var(--amber);">&gt;   tarifa = "$2.00";</div>
                <div class="term-line" style="color: var(--amber);">&gt; } else {</div>
                <div class="term-line" style="color: var(--amber);">&gt;   tarifa = "$10.00";</div>
                <div class="term-line" style="color: var(--amber);">&gt; } // 6 líneas + variable mutable let</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const tarifa = esSocio ? "$2.00" : "$10.00";</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // 1 sola línea + inmutable con const ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Tarifa:</strong> El operador ternario condensa la evaluación y garantiza inmutabilidad con <code>const</code>.";
        } else if (scenarioKey === "descuento") {
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let desc;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (total &gt; 100) { desc = 0.20; } else { desc = 0.05; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const descuento = total &gt; 100 ? 0.20 : 0.05;</div>
                <div class="term-line" style="color: var(--cyan);">&gt; totalConDesc = total * (1 - descuento);</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Descuento por Volumen:</strong> Cálculo directo sin estados intermedios mutables.";
        } else if (scenarioKey === "autenticacion") {
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let ruta;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (autenticado) { ruta = "/dashboard"; } else { ruta = "/login"; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const destino = autenticado ? "/dashboard" : "/login";</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Autenticación:</strong> Muy común en routers modernos de React y Next.js.";
        } else if (scenarioKey === "tema") {
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let claseTema;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (esModoNoche) { claseTema = "dark"; } else { claseTema = "light"; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const claseTema = esModoNoche ? "dark" : "light";</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Tema Visual:</strong> Asignación directa e inmediata para atributos HTML o clases CSS.";
        }
    }

    // Actualiza la visualización de la analogía del interruptor en el Slide 8
    static updateSwitchView(switchState) {
        const titleRight = document.getElementById("switchTitleRight");
        const subRight = document.getElementById("switchSubRight");
        const avatarRight = document.getElementById("switchAvatarRight");
        const itemsRight = document.getElementById("switchItemsRight");
        const statusRight = document.getElementById("switchStatusRight");
        const bannerText = document.getElementById("switchBannerText");
        const bannerIcon = document.getElementById("switchBannerIcon");

        const itemsLeft = document.getElementById("switchItemsLeft");
        const statusLeft = document.getElementById("switchStatusLeft");

        if (switchState === "on") {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El interruptor se presiona hacia arriba</div>
                <div class="ws-item">condicion = true</div>
            `;
            if (statusLeft) statusLeft.textContent = "El circuito eléctrico queda cerrado";

            if (avatarRight) avatarRight.textContent = "💡";
            if (titleRight) titleRight.textContent = "Bombilla Encendida";
            if (subRight) subRight.textContent = "Expresión 1 Retornada";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">La bombilla ilumina la habitación al 100%</div>
                <div class="ws-item highlight-item">Retorno inmediato: "Luz Encendida"</div>
            `;
            if (statusRight) statusRight.textContent = "Bifurcación resuelta: la rama falsa se descarta";

            if (bannerIcon) bannerIcon.textContent = "💡";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Interruptor ARRIBA (true):</strong> Se evalúa y devuelve únicamente la primera expresión ('Luz Encendida').";
            }
        } else {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El interruptor se presiona hacia abajo</div>
                <div class="ws-item">condicion = false</div>
            `;
            if (statusLeft) statusLeft.textContent = "El circuito eléctrico queda abierto";

            if (avatarRight) avatarRight.textContent = "🌑";
            if (titleRight) titleRight.textContent = "Habitación a Oscuras";
            if (subRight) subRight.textContent = "Expresión 2 Retornada";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">No hay corriente, bombilla apagada</div>
                <div class="ws-item highlight-item">Retorno inmediato: "Luz Apagada"</div>
            `;
            if (statusRight) statusRight.textContent = "Bifurcación resuelta: la rama verdadera se descarta";

            if (bannerIcon) bannerIcon.textContent = "🌑";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Interruptor ABAJO (false):</strong> Se evalúa y devuelve únicamente la segunda expresión ('Luz Apagada').";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
