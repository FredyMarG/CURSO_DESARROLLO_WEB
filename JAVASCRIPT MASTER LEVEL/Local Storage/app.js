/**
 * ==============================================================================
 * 💾 JAVASCRIPT MASTER LEVEL: LOCALSTORAGE Y SESSIONSTORAGE
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, simuladores de almacenamiento y playground
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
    // Escenario actualmente seleccionado en el comparador de serialización (Slide 4)
    activeScenario: "objeto",
    // Estado de la analogía de la oficina (Slide 8: 'local' o 'session')
    activeOfficeState: "local",
    // Estado auxiliar para alternar idioma en la demostración del Slide 7
    demoLangToggle: "es"
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
    // Preset 1: Guardar y leer con setItem("nombre", "Fredy") y getItem()
    "preset-storage-1": `// ==========================================
// 1. GUARDAR Y LEER EN LOCALSTORAGE
// ==========================================
"use strict";

// 1. Guardamos la clave "nombre" con el valor "Fredy":
localStorage.setItem("nombre", "Fredy");
console.log("Total de claves guardadas :", localStorage.length);

// 2. Recuperamos el valor con getItem("nombre"):
let nombre = localStorage.getItem("nombre");
console.log("Valor recuperado          :", nombre);`,

    // Preset 2: Los 4 métodos fundamentales: setItem, getItem, removeItem y clear
    "preset-storage-2": `// ==========================================
// 2. LOS 4 MÉTODOS DE LA API WEB STORAGE
// ==========================================

// 1. setItem(clave, valor): Inserta o actualiza
localStorage.setItem("usuario", "Carlos");
console.log("1. getItem('usuario')           :", localStorage.getItem("usuario"));

// 2. getItem de una clave inexistente devuelve null:
console.log("2. getItem('no_existe')         :", localStorage.getItem("no_existe"));

// 3. removeItem(clave): Borra un elemento específico:
localStorage.removeItem("usuario");
console.log("3. Tras removeItem('usuario')   :", localStorage.getItem("usuario"));

// 4. clear(): Vacía todas las claves de sessionStorage:
sessionStorage.setItem("temp", "123");
sessionStorage.clear();
console.log("4. Tras sessionStorage.clear()  :", sessionStorage.length, "elementos");`,

    // Preset 3: El error "[object Object]" vs. JSON.stringify / JSON.parse
    "preset-storage-3": `// ==========================================
// 3. EL ERROR "[object Object]" VS. JSON
// ==========================================

const configuracion = { tema: "oscuro", volumen: 80 };

// ❌ ERROR: Guardar el objeto directamente sin serializar
localStorage.setItem("config_mal", configuracion);
console.log("❌ Sin stringify :", localStorage.getItem("config_mal")); // "[object Object]"

// ✅ CORRECTO: Serializar con JSON.stringify() y leer con JSON.parse()
localStorage.setItem("config_ok", JSON.stringify(configuracion));
const textoGuardado = localStorage.getItem("config_ok");
const objetoRecuperado = JSON.parse(textoGuardado);

console.log("✅ Texto JSON    :", textoGuardado);
console.log("✅ Objeto JS     :", objetoRecuperado.tema, "| Volumen:", objetoRecuperado.volumen);`,

    // Preset 4: Lectura blindada de JSON con bloque try...catch
    "preset-storage-4": `// ==========================================
// 4. LECTURA BLINDADA CON TRY...CATCH
// ==========================================

const cargarAjustes = (clave) => {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : null;
    } catch (error) {
        console.warn("Error al parsear JSON corrupto:", error.message);
        return null;
    }
};

// Simulamos un JSON corrupto mal escrito en almacenamiento:
localStorage.setItem("json_roto", "{tema: oscuro_sin_comillas");

console.log("Resultado ante JSON corrupto :", cargarAjustes("json_roto"));
console.log("La aplicación continúa funcionando sin romperse ✅");`,

    // Preset 5: La trampa del booleano "false" en string vs. JSON.parse
    "preset-storage-5": `// ==========================================
// 5. LA TRAMPA DEL BOOLEANO "false" EN STRING
// ==========================================

localStorage.setItem("estaLogueado", false);
const valorStr = localStorage.getItem("estaLogueado");

console.log("Valor recuperado :", JSON.stringify(valorStr), "| Tipo:", typeof valorStr);

// ❌ ERROR: El string "false" no está vacío, por lo que evalúa como true (truthy)
if (valorStr) {
    console.log("❌ if (valorStr) : ¡Se ejecutó por error aunque guardamos false!");
}

// ✅ SOLUCIÓN: Parsear con JSON.parse() o comparar === "true"
const booleanoReal = JSON.parse(valorStr);
console.log("✅ Con JSON.parse:", booleanoReal, "| Tipo:", typeof booleanoReal);`,

    // Preset 6: Comparativa en vivo: localStorage vs. sessionStorage
    "preset-storage-6": `// ==========================================
// 6. LOCALSTORAGE 💾 VS. SESSIONSTORAGE ⏱️
// ==========================================

// Guardamos en localStorage (Permanente entre cierres de navegador)
localStorage.setItem("preferencia_tema", "oscuro");

// Guardamos en sessionStorage (Temporal solo para esta pestaña)
sessionStorage.setItem("paso_formulario", "Paso 2 de 3");

console.log("En LocalStorage (Permanente) :", localStorage.getItem("preferencia_tema"));
console.log("En SessionStorage (Temporal) :", sessionStorage.getItem("paso_formulario"));`,

    // Presets de los 3 Retos del Curso
    "preset-ex-storage1": `// RETO NIVEL 1 (Junior): Uso de SessionStorage
// 1. Guardamos el token en la sesión temporal
sessionStorage.setItem("token", "xyz123");

// 2. Recuperamos el valor y lo imprimimos
const miToken = sessionStorage.getItem("token");
console.log("El token recuperado es:", miToken); // Imprime: xyz123

// 3. Eliminamos el token de forma específica
sessionStorage.removeItem("token");
console.log("Verificación tras removeItem('token'):", sessionStorage.getItem("token")); // null`,

    "preset-ex-storage2": `// RETO NIVEL 2 (Semi-Senior): Guardar y recuperar Arrays (Historial)
const guardarHistorial = (listaBusquedas) => {
    // Convertimos el array a una cadena JSON texto plano
    const arraySerializado = JSON.stringify(listaBusquedas);
    localStorage.setItem("busquedas", arraySerializado);
};

const obtenerHistorial = () => {
    const datosRaw = localStorage.getItem("busquedas");

    // Si datosRaw es null (no existe la clave), retornamos el array vacío []
    if (!datosRaw) {
        return [];
    }

    try {
        // Convertimos la cadena de texto de vuelta a un array de JavaScript
        return JSON.parse(datosRaw);
    } catch (error) {
        console.error("Historial corrupto, reseteando...", error);
        return [];
    }
};

// Pruebas:
guardarHistorial(["cursos js", "fetch api", "flexbox css"]);
console.log("Historial recuperado:", obtenerHistorial());`,

    "preset-ex-storage3": `// RETO NIVEL 3 (Avanzado / Producción): Sistema de Preferencia de Idioma
const IDIOMA_KEY = "app_lang";

// Limpiamos la clave primero para simular la primera visita del usuario:
localStorage.removeItem(IDIOMA_KEY);

const cambiarIdioma = (nuevoIdioma) => {
    localStorage.setItem(IDIOMA_KEY, nuevoIdioma);
    console.log(\`Idioma cambiado con éxito a: \${nuevoIdioma}\`);
};

const inicializarIdioma = () => {
    const idiomaGuardado = localStorage.getItem(IDIOMA_KEY);

    if (idiomaGuardado) {
        console.log(\`Idioma cargado desde la configuración del usuario: \${idiomaGuardado}\`);
        return idiomaGuardado;
    }

    const idiomaPorDefecto = "es";
    localStorage.setItem(IDIOMA_KEY, idiomaPorDefecto);
    console.log(\`Primera visita. Configurando idioma por defecto: \${idiomaPorDefecto}\`);
    return idiomaPorDefecto;
};

// --- Flujo de ejecución al iniciar la App ---
const idiomaActual = inicializarIdioma();
cambiarIdioma("en");
const idiomaAlRecargar = inicializarIdioma();`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController {
    static init() {
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-storage-1");
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

        // Slide 2: Guardar y Leer en LocalStorage en Vivo
        const btnTestStorageIntro = document.getElementById("btnTestStorageIntro");
        const statusStorageIntro = document.getElementById("testStorageIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        if (btnTestStorageIntro && consoleOutput1) {
            btnTestStorageIntro.addEventListener("click", () => {
                SoundEffects.success();
                localStorage.setItem("nombre", "Fredy");
                const nombre = localStorage.getItem("nombre");

                if (statusStorageIntro) statusStorageIntro.textContent = "Guardado en Navegador";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; localStorage.setItem("nombre", "Fredy");</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; let nombre = localStorage.getItem("nombre");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; Salida ➔ "${nombre}" (Persistido en disco local ✅)</div>
                `;
                this.showToast("Clave 'nombre' guardada en localStorage");
            });
        }

        // Slide 3: Probar Ciclo de los 4 Métodos en Tiempo Real
        const btnCheckStorageMethods = document.getElementById("btnCheckStorageMethods");
        const storageMethodsResult = document.getElementById("storageMethodsResult");
        if (btnCheckStorageMethods && storageMethodsResult) {
            btnCheckStorageMethods.addEventListener("click", () => {
                SoundEffects.success();
                sessionStorage.setItem("usuario_demo", "Carlos");
                const leido = sessionStorage.getItem("usuario_demo");
                sessionStorage.removeItem("usuario_demo");
                const trasBorrar = sessionStorage.getItem("usuario_demo");

                storageMethodsResult.innerHTML = `
                    <code>1. setItem("usuario", "Carlos")</code> |
                    <code>2. getItem("usuario") ➔ "${leido}"</code><br>
                    <code>3. removeItem("usuario")</code> |
                    <code>4. getItem("usuario") ➔ ${trasBorrar}</code><br>
                    <small style="color: var(--emerald);">Los 4 métodos funcionan de manera idéntica tanto en localStorage como en sessionStorage.</small>
                `;
            });
        }

        // Slide 4: Comparador de Conversión Implícita vs Serialización JSON
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareStorageModes = document.getElementById("btnCompareStorageModes");
        if (btnCompareStorageModes) {
            btnCompareStorageModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de Flujo de Decisión, try...catch y Seguridad
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

        // Slide 5.1: Botón Árbol de Decisión
        const btnTestDecisionTree = document.getElementById("btnTestDecisionTree");
        const decisionTreeResult = document.getElementById("decisionTreeResult");
        if (btnTestDecisionTree && decisionTreeResult) {
            btnTestDecisionTree.addEventListener("click", () => {
                SoundEffects.success();
                decisionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">1. ¿Persiste al cerrar navegador?</span> SÍ ➔ <code>localStorage</code> (NO ➔ <code>sessionStorage</code>)<br>
                    <span style="color: var(--emerald);">2. ¿Es Objeto o Array?</span> SÍ ➔ <code>JSON.stringify(valor)</code> antes de <code>.setItem()</code>
                `;
            });
        }

        // Slide 5.2: Botón Lectura Blindada con try...catch
        const btnTestTryCatchParse = document.getElementById("btnTestTryCatchParse");
        const tryCatchParseResult = document.getElementById("tryCatchParseResult");
        if (btnTestTryCatchParse && tryCatchParseResult) {
            btnTestTryCatchParse.addEventListener("click", () => {
                SoundEffects.success();
                tryCatchParseResult.innerHTML = `
                    <span style="color: var(--amber);">Dato dañado en Storage:</span> <code>"{tema: oscuro"</code> (JSON inválido)<br>
                    <span style="color: var(--emerald);">Con bloque try...catch:</span> Captura el <code>SyntaxError</code> y devuelve <code>null</code> sin romper la página ✅
                `;
            });
        }

        // Slide 5.3: Botón Auditoría de Seguridad
        const btnTestSecurityCheck = document.getElementById("btnTestSecurityCheck");
        const securityCheckResult = document.getElementById("securityCheckResult");
        if (btnTestSecurityCheck && securityCheckResult) {
            btnTestSecurityCheck.addEventListener("click", () => {
                SoundEffects.success();
                securityCheckResult.innerHTML = `
                    <span style="color: var(--rose);">❌ PROHIBIDO:</span> Contraseñas, tarjetas de crédito, CVV, datos médicos (expuestos a XSS).<br>
                    <span style="color: var(--emerald);">✅ PERMITIDO:</span> Tema oscuro/claro, idioma (<code>"es"</code>/<code>"en"</code>), filtros de UI.
                `;
            });
        }

        // Slide 7: Probar Persistencia de Historial en Vivo
        const btnTestHistoryStorage = document.getElementById("btnTestHistoryStorage");
        const historyStorageResult = document.getElementById("historyStorageResult");
        if (btnTestHistoryStorage && historyStorageResult) {
            btnTestHistoryStorage.addEventListener("click", () => {
                SoundEffects.success();
                const busquedas = ["cursos js", "fetch api", "flexbox css"];
                localStorage.setItem("busquedas", JSON.stringify(busquedas));
                const recuperado = JSON.parse(localStorage.getItem("busquedas"));
                historyStorageResult.innerHTML = `
                    <code>JSON guardado: '${localStorage.getItem("busquedas")}'</code><br>
                    <small style="color: var(--emerald);">Array reconstruido (${recuperado.length} ítems): <code>[${recuperado.map(x => `"${x}"`).join(", ")}]</code></small>
                `;
            });
        }

        // Slide 7: Simular Cambio y Recarga de Idioma
        const btnTestLangStorage = document.getElementById("btnTestLangStorage");
        const langStorageResult = document.getElementById("langStorageResult");
        if (btnTestLangStorage && langStorageResult) {
            btnTestLangStorage.addEventListener("click", () => {
                SoundEffects.success();
                AppState.demoLangToggle = AppState.demoLangToggle === "es" ? "en" : "es";
                localStorage.setItem("app_lang", AppState.demoLangToggle);
                const actual = localStorage.getItem("app_lang");
                langStorageResult.innerHTML = `
                    <code>cambiarIdioma("${actual}") ➔ localStorage.getItem("app_lang") === "${actual}"</code><br>
                    <small style="color: var(--cyan);">Idioma activo persistido: <strong>${actual === "es" ? "Español (es)" : "Inglés (en)"}</strong> (Pulsa de nuevo para alternar).</small>
                `;
            });
        }

        // Slide 8: Metáfora del Archivador de Oficina
        const officeBtns = document.querySelectorAll("[data-office]");
        officeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                officeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeOfficeState = btn.getAttribute("data-office");
                SoundEffects.click();
                this.updateOfficeView(AppState.activeOfficeState);
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-storage-1";
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
                const cheatText = `# GUÍA MAESTRA: LOCALSTORAGE Y SESSIONSTORAGE EN JAVASCRIPT

1. **Diferencia Clave:**
   - \`localStorage\`: Permanente (no expira al cerrar el navegador).
   - \`sessionStorage\`: Temporal (se destruye al cerrar la pestaña actual).

2. **Los 4 Métodos Fundamentales:**
   - \`setItem("clave", "valor")\`: Guarda o actualiza un par clave-valor.
   - \`getItem("clave")\`: Recupera el valor (o \`null\` si no existe).
   - \`removeItem("clave")\`: Elimina únicamente esa clave.
   - \`clear()\`: Vacía todo el almacenamiento del origen actual.

3. **Serialización de Objetos y Arrays (JSON):**
   \`\`\`javascript
   const config = { tema: "oscuro", volumen: 80 };
   localStorage.setItem("config", JSON.stringify(config));
   const recuperado = JSON.parse(localStorage.getItem("config"));
   \`\`\`

4. **Reglas de Oro:**
   - Envolver siempre \`JSON.parse()\` en un bloque \`try...catch\`.
   - Recordar que \`"false"\` en string es *truthy*; usar \`JSON.parse()\` o comparar \`=== "true"\`.
   - Nunca almacenar contraseñas ni datos sensibles en Web Storage.
`;
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre Conversión Implícita y JSON en el Slide 4
    static runScenarioSimulation(scenarioKey) {
        const terminalImplicit = document.getElementById("terminalImplicit");
        const terminalSerialized = document.getElementById("terminalSerialized");
        const feedbackText = document.getElementById("storageFeedbackText");
        if (!terminalImplicit || !terminalSerialized) return;

        SoundEffects.transition();

        if (scenarioKey === "objeto") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("cfg", { tema: "oscuro" });</div>
                <div class="term-line" style="color: var(--rose);">&gt; localStorage.getItem("cfg") ➔ "[object Object]" ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; localStorage.setItem("cfg", JSON.stringify({ tema: "oscuro" }));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; JSON.parse(localStorage.getItem("cfg")).tema ➔ "oscuro" ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Objeto Literal:</strong> Guardar un objeto sin <code>JSON.stringify()</code> invoca <code>.toString()</code> y destruye tus datos en <code>'[object Object]'</code>.";
        } else if (scenarioKey === "array") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("items", ["js", "css"]);</div>
                <div class="term-line" style="color: var(--rose);">&gt; getItem("items") ➔ "js,css" (String plano, ya no es Array) ⚠️</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; localStorage.setItem("items", JSON.stringify(["js", "css"]));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; JSON.parse(getItem("items")) ➔ ["js", "css"] (Array real) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Arrays:</strong> Con <code>JSON.stringify()</code> y <code>JSON.parse()</code> conservas un Array auténtico con acceso a <code>.map()</code> y <code>.push()</code>.";
        } else if (scenarioKey === "booleano") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("login", false);</div>
                <div class="term-line" style="color: var(--rose);">&gt; if (localStorage.getItem("login")) ➔ ¡Da TRUE porque "false" es string! ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const activo = JSON.parse(localStorage.getItem("login"));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; if (activo) ➔ Da FALSE correctamente (booleano real) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Booleanos:</strong> El string <code>'false'</code> no está vacío y evalúa como <em>truthy</em>; usa <code>JSON.parse()</code> o compara <code>=== 'true'</code>.";
        } else if (scenarioKey === "corrupto") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; JSON.parse("{json_malformado"); // Sin try...catch</div>
                <div class="term-line" style="color: var(--rose);">&gt; ❌ Uncaught SyntaxError: Unexpected token (Rompe la App)</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; try { return JSON.parse(raw); } catch (e) { return null; }</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Captura el error silenciosamente y aplica valores por defecto ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Blindaje con try...catch:</strong> Protege siempre <code>JSON.parse()</code> por si el almacenamiento fue editado o corrompido externamente.";
        }
    }

    // Actualiza la visualización de la analogía del Archivador de Oficina en el Slide 8
    static updateOfficeView(officeState) {
        const titleRight = document.getElementById("officeTitleRight");
        const subRight = document.getElementById("officeSubRight");
        const avatarRight = document.getElementById("officeAvatarRight");
        const itemsRight = document.getElementById("officeItemsRight");
        const statusRight = document.getElementById("officeStatusRight");
        const bannerText = document.getElementById("officeBannerText");
        const bannerIcon = document.getElementById("officeBannerIcon");

        if (officeState === "local") {
            if (avatarRight) avatarRight.textContent = "🗄️";
            if (titleRight) titleRight.textContent = "2. El Archivador Metálico (LocalStorage)";
            if (subRight) subRight.textContent = "Persistencia Permanente en el Rincón de la Oficina";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Lo que guardes ahí permanece intacto para siempre</div>
                <div class="ws-item highlight-item">Aunque apagues la luz y cierres la oficina por vacaciones, sigue ahí</div>
            `;
            if (statusRight) statusRight.textContent = "Sobrevive al cierre de pestañas, reinicios del navegador y del sistema";

            if (bannerIcon) bannerIcon.textContent = "🗄️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Archivador Metálico (LocalStorage):</strong> Ideal para guardar preferencias permanentes que deben seguir ahí cuando el usuario regrese días después.";
            }
        } else {
            if (avatarRight) avatarRight.textContent = "📝";
            if (titleRight) titleRight.textContent = "2. El Bloc de Notas Temporal (SessionStorage)";
            if (subRight) subRight.textContent = "Aislado para el Cliente Actual (Una Sola Pestaña)";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Mientras atiendes al cliente (pestaña abierta), el bloc mantiene sus notas</div>
                <div class="ws-item highlight-item">En cuanto el cliente se va y cierras la pestaña, tiras el papel</div>
            `;
            if (statusRight) statusRight.textContent = "Se destruye automáticamente al cerrar la pestaña del navegador";

            if (bannerIcon) bannerIcon.textContent = "📝";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Bloc de Notas (SessionStorage):</strong> Perfecto para asistentes o formularios multipaso que no deben persistir una vez cerrada la pestaña.";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
