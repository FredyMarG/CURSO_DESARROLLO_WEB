/**
 * ==============================================================================
 * 🖐️ JAVASCRIPT MASTER LEVEL: API NATIVA DE DRAG & DROP
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, arenas de arrastre en vivo, texturizador y playground
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
    // Escenario actualmente seleccionado en el comparador de dataTransfer (Slide 4)
    activeScenario: "prevent",
    // Estado de la analogía seleccionada en el Slide 8 ('camion' o 'tapete')
    activeOfficeState: "camion",
    // Índice auxiliar para alternar texturas en la demostración automática del Slide 7
    demoTextureIndex: 0
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
    // Preset 1: Código Base de .circulo y .cuadrado (Los 7 Eventos y dataTransfer)
    "preset-drag-1": `// ==========================================
// 1. CÓDIGO BASE: .circulo Y .cuadrado
// ==========================================
"use strict";

// Simulamos los nodos .circulo y .cuadrado y el ciclo completo de Drag & Drop:
const dataTransfer = {
    datos: {},
    setData(formato, valor) { this.datos[formato] = String(valor); },
    getData(formato) { return this.datos[formato] || ""; }
};

console.log("1. [dragstart] en .circulo -> Cargando clase en dataTransfer...");
dataTransfer.setData("text-plain", "circulo");
console.log("   Dato guardado:", dataTransfer.getData("text-plain"));

console.log("2. [drag]      en .circulo -> Desplazando objeto en pantalla...");
console.log("3. [dragenter] en .cuadrado -> El cursor entró a la zona destino");
console.log("4. [dragover]  en .cuadrado -> e.preventDefault() ejecutado (Zona habilitada ✅)");
console.log("5. [drop]      en .cuadrado -> ¡Objeto soltado! Clase recibida:", dataTransfer.getData("text-plain"));
console.log("6. [dragend]   en .circulo -> Fin de la operación de arrastre");`,

    // Preset 2: Los 3 Eventos del Objeto (dragstart, drag, dragend)
    "preset-drag-2": `// ==========================================
// 2. LOS 3 EVENTOS DEL OBJETO EMISOR
// ==========================================
"use strict";

// Estado simulado de un nodo con draggable="true"
const objeto = { id: "objeto-textura", draggable: true, style: { opacity: "1" } };

// 1. dragstart: Inicia el arrastre y baja la opacidad
const onDragStart = () => {
    objeto.style.opacity = "0.5";
    console.log("1. [dragstart] Inicio del arrastre | Opacidad:", objeto.style.opacity);
};

// 2. drag: Se ejecuta cíclicamente mientras se mueve el ratón
const onDrag = (x, y) => {
    console.log(\`2. [drag]      Moviendo #$\{objeto.id} hacia coordenadas (\${x}px, \${y}px)\`);
};

// 3. dragend: Restaura el estilo visual al soltar o cancelar con Esc
const onDragEnd = () => {
    objeto.style.opacity = "1";
    console.log("3. [dragend]   Fin del arrastre    | Opacidad restaurada a:", objeto.style.opacity);
};

onDragStart();
onDrag(120, 85);
onDrag(240, 160);
onDragEnd();`,

    // Preset 3: Los 4 Eventos de la Zona Receptora y e.preventDefault()
    "preset-drag-3": `// ==========================================
// 3. LOS 4 EVENTOS DE ZONA Y e.preventDefault()
// ==========================================
"use strict";

const clasesZona = new Set(["drop-zone"]);

console.log("1. [dragenter] Cursor entra a la zona:");
clasesZona.add("zona-activa");
console.log("   Clases actuales:", Array.from(clasesZona).join(" "));

console.log("2. [dragover]  Cursor flota sobre la zona:");
const preventDefaultLlamado = true; // ✅ OBLIGATORIO para permitir el drop
console.log("   ¿e.preventDefault() invocado?:", preventDefaultLlamado, "-> Recepción desbloqueada 🔓");

console.log("3. [drop]      Usuario suelta el botón del ratón:");
if (preventDefaultLlamado) {
    clasesZona.delete("zona-activa");
    console.log("   ✅ ¡Objeto depositado con éxito! Clases:", Array.from(clasesZona).join(" "));
}`,

    // Preset 4: Transporte en dataTransfer: setData(formato, valor) y getData(formato)
    "preset-drag-4": `// ==========================================
// 4. MOTOR dataTransfer: setData() Y getData()
// ==========================================
"use strict";

// Caja fuerte temporal del evento de arrastre (e.dataTransfer)
const almacenDataTransfer = new Map();
const dataTransfer = {
    setData: (formato, valor) => almacenDataTransfer.set(formato, String(valor)),
    getData: (formato) => almacenDataTransfer.get(formato) ?? ""
};

// 📥 En dragstart: Guardamos múltiples formatos MIME
dataTransfer.setData("text/plain", "textura-madera");
dataTransfer.setData("text/url-pattern", "url('madera.jpg')");
console.log("📥 Datos almacenados en dragstart (Camión cargado 🚚)");

// 📤 En drop: Recuperamos exactamente con la misma llave de formato
const idRecuperado = dataTransfer.getData("text/plain");
const urlRecuperada = dataTransfer.getData("text/url-pattern");

console.log("📤 getData('text/plain')       :", idRecuperado);
console.log("📤 getData('text/url-pattern') :", urlRecuperada);`,

    // Preset 5: Seguridad: Por qué getData() devuelve "" fuera del evento drop
    "preset-drag-5": `// ==========================================
// 5. AISLAMIENTO DE SEGURIDAD DE dataTransfer
// ==========================================
"use strict";

function simularDataTransferSegunFase(faseEvento) {
    const memoriaSecreta = { "text/plain": "id-confidencial-42" };
    return {
        getData(formato) {
            // Por seguridad del navegador, solo 'dragstart' y 'drop' pueden leer el payload
            if (faseEvento !== "drop" && faseEvento !== "dragstart") {
                console.warn(\`⚠️ Intento de getData() durante '\${faseEvento}': Bloqueado por seguridad -> devuelve ""\`);
                return "";
            }
            return memoriaSecreta[formato] || "";
        }
    };
}

// ❌ ERROR COMÚN: Intentar leer getData() en dragover o dragenter
const dtEnDragOver = simularDataTransferSegunFase("dragover");
console.log("Lectura en dragover :", JSON.stringify(dtEnDragOver.getData("text/plain")));

// ✅ CORRECTO: Leer getData() únicamente dentro del evento drop
const dtEnDrop = simularDataTransferSegunFase("drop");
console.log("Lectura en drop     :", JSON.stringify(dtEnDrop.getData("text/plain")), "✅");`,

    // Preset 6: Proyecto Integrador: El Texturizador con Desestructuración ES6+
    "preset-drag-6": `// ==========================================
// 6. PROYECTO INTEGRADOR: EL TEXTURIZADOR
// ==========================================
"use strict";

// Simulamos la miniatura arrastrada y el lienzo de destino
const miniaturaMadera = {
    id: "textura-madera",
    dataset: { url: "url('madera.jpg')" },
    clases: new Set(["textura"])
};
const lienzoDestino = {
    id: "canvas-destino",
    style: { backgroundImage: "none" },
    textoInterno: "Arrastra una textura aquí para aplicarla al modelo"
};

// Objeto dataTransfer compartido en la transacción
const memoriaDT = {};
const dataTransfer = {
    setData: (k, v) => { memoriaDT[k] = v; },
    getData: (k) => memoriaDT[k] || ""
};

// 1. Evento dragstart con desestructuración ({ dataTransfer, target })
(({ dataTransfer, target }) => {
    dataTransfer.setData("text/plain", target.id);
    dataTransfer.setData("text/url-pattern", target.dataset.url);
    target.clases.add("arrastrando");
    console.log("1. [dragstart] Textura seleccionada:", target.id);
})({ dataTransfer, target: miniaturaMadera });

// 2. Evento drop sobre el lienzo receptor
(({ dataTransfer, target }) => {
    const rutaImagen = dataTransfer.getData("text/url-pattern");
    if (rutaImagen) {
        target.style.backgroundImage = rutaImagen;
        target.textoInterno = "¡Textura Aplicada Correctamente!";
    }
    console.log("2. [drop] Fondo actualizado a      :", target.style.backgroundImage);
    console.log("3. [drop] Mensaje del lienzo       :", target.textoInterno);
})({ dataTransfer, target: lienzoDestino });`,

    // Presets de los 3 Retos del Curso
    "preset-ex-drag1": `// RETO NIVEL 1 (Junior): Control del Objeto Emisor (.circulo)
"use strict";

const circulo = {
    className: "circulo",
    style: { opacity: "1" }
};
const dataTransfer = {
    payload: {},
    setData(k, v) { this.payload[k] = v; },
    getData(k) { return this.payload[k]; }
};

// 1.Al iniciar dragstart: opacidad a 0.5 y guardar clase en dataTransfer
const handleDragStart = (e) => {
    circulo.style.opacity = "0.5";
    e.dataTransfer.setData("text/plain", e.target.className);
    console.log("dragstart -> Opacidad:", circulo.style.opacity, "| Payload:", e.dataTransfer.getData("text/plain"));
};

// 2. Al finalizar dragend: restaurar opacidad a 1
const handleDragEnd = () => {
    circulo.style.opacity = "1";
    console.log("dragend   -> Opacidad restaurada a:", circulo.style.opacity);
};

handleDragStart({ target: circulo, dataTransfer });
handleDragEnd();`,

    "preset-ex-drag2": `// RETO NIVEL 2 (Semi-Senior): Zona Receptora Habilitada (.cuadrado)
"use strict";

const cuadrado = {
    clases: new Set(["cuadrado"]),
    classList: {
        add(c) { cuadrado.clases.add(c); },
        remove(c) { cuadrado.clases.delete(c); }
    }
};

// Simulamos los 4 eventos de la zona receptora:
// 1. dragenter:
(({ target }) => target.classList.add("zona-activa"))({ target: cuadrado });
console.log("Tras dragenter -> Clases:", Array.from(cuadrado.clases));

// 2. dragover:
const eventoDragOver = { preventDefault: () => console.log("dragover       -> e.preventDefault() ejecutado ✅") };
eventoDragOver.preventDefault();

// 3. drop:
const eventoDrop = {
    preventDefault: () => {},
    dataTransfer: { getData: () => "circulo" },
    target: cuadrado
};
eventoDrop.preventDefault();
const claseRecibida = eventoDrop.dataTransfer.getData("text/plain");
eventoDrop.target.classList.remove("zona-activa");
console.log("Tras drop      -> Elemento recibido:", claseRecibida, "| Clases:", Array.from(cuadrado.clases));`,

    "preset-ex-drag3": `// RETO NIVEL 3 (Producción): Motor Completo del Texturizador
"use strict";

const texturasDOM = [
    { id: "textura-madera", dataset: { url: "url('madera.jpg')" } },
    { id: "textura-metal",  dataset: { url: "url('metal.jpg')" } }
];
const lienzoDOM = { style: { backgroundImage: "" }, mensaje: "" };

const aplicarTexturaPorDragDrop = (texturaElegida) => {
    const almacen = {};
    const dataTransfer = {
        setData: (fmt, val) => { almacen[fmt] = val; },
        getData: (fmt) => almacen[fmt]
    };

    // Fase 1: dragstart en la textura origen
    (({ dataTransfer, target }) => {
        dataTransfer.setData("text/plain", target.id);
        dataTransfer.setData("text/url-pattern", target.dataset.url);
    })({ dataTransfer, target: texturaElegida });

    // Fase 2: drop en el lienzo destino
    (({ dataTransfer, target }) => {
        const rutaImagen = dataTransfer.getData("text/url-pattern");
        if (rutaImagen) {
            target.style.backgroundImage = rutaImagen;
            target.mensaje = \`¡Textura '\${dataTransfer.getData("text/plain")}' aplicada!\`;
        }
    })({ dataTransfer, target: lienzoDOM });

    console.log(lienzoDOM.mensaje, "-> CSS:", lienzoDOM.style.backgroundImage);
};

aplicarTexturaPorDragDrop(texturasDOM[0]);
aplicarTexturaPorDragDrop(texturasDOM[1]);`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController {
    static init() {
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.bindLiveDragArenas();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-drag-1");
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

    // Conecta los eventos nativos de HTML5 Drag & Drop en las arenas interactivas (Slide 2 y Slide 7)
    static bindLiveDragArenas() {
        // 1. Arena Slide 2: .circulo y .cuadrado
        const demoCirculo = document.getElementById("demoCirculo");
        const demoCuadrado = document.getElementById("demoCuadrado");
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus");
        const statusIntro = document.getElementById("testDragIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");

        if (demoCirculo && demoCuadrado && consoleOutput1) {
            let dragCounter = 0;

            demoCirculo.addEventListener("dragstart", (e) => {
                dragCounter = 0;
                SoundEffects.click();
                demoCirculo.classList.add("arrastrando");
                e.dataTransfer.setData("text-plain", "circulo");
                if (statusIntro) statusIntro.textContent = "Arrastrando .circulo...";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; [dragstart] e.dataTransfer.setData("text-plain", "circulo")</div>
                `;
            });

            demoCirculo.addEventListener("drag", () => {
                dragCounter++;
                if (dragCounter === 1 || dragCounter % 25 === 0) {
                    const line = document.createElement("div");
                    line.className = "term-line";
                    line.style.color = "var(--text-muted)";
                    line.textContent = `> [drag] Desplazando .circulo (ciclo #${dragCounter})...`;
                    consoleOutput1.appendChild(line);
                    consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                }
            });

            demoCirculo.addEventListener("dragend", () => {
                demoCirculo.classList.remove("arrastrando");
                demoCuadrado.classList.remove("zona-activa");
                const line = document.createElement("div");
                line.className = "term-line";
                line.style.color = "var(--amber)";
                line.textContent = "> [dragend] Operación finalizada (opacidad restaurada)";
                consoleOutput1.appendChild(line);
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
            });

            demoCuadrado.addEventListener("dragenter", (e) => {
                e.preventDefault();
                demoCuadrado.classList.add("zona-activa");
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "¡Zona activa! Suelta el círculo aquí...";
                const line = document.createElement("div");
                line.className = "term-line";
                line.style.color = "var(--cyan)";
                line.textContent = "> [dragenter] Cursor entró en los límites de .cuadrado";
                consoleOutput1.appendChild(line);
            });

            demoCuadrado.addEventListener("dragover", (e) => {
                e.preventDefault(); // Obligatorio para habilitar el evento drop
            });

            demoCuadrado.addEventListener("dragleave", () => {
                demoCuadrado.classList.remove("zona-activa");
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "Saliste de la zona .cuadrado (dragleave)";
                const line = document.createElement("div");
                line.className = "term-line";
                line.style.color = "var(--rose)";
                line.textContent = "> [dragleave] Cursor salió de .cuadrado sin soltar";
                consoleOutput1.appendChild(line);
            });

            demoCuadrado.addEventListener("drop", (e) => {
                e.preventDefault();
                SoundEffects.success();
                const claseTransferida = e.dataTransfer.getData("text-plain") || "circulo";
                demoCuadrado.classList.remove("zona-activa");
                demoCuadrado.classList.add("zona-completada");
                if (demoCuadradoStatus) {
                    demoCuadradoStatus.innerHTML = `✅ <strong>¡Drop exitoso!</strong> Recibido: <code>"${claseTransferida}"</code>`;
                }
                if (statusIntro) statusIntro.textContent = "¡Drop completado!";
                const line = document.createElement("div");
                line.className = "term-line";
                line.style.color = "var(--emerald)";
                line.innerHTML = `&gt; [drop] ¡Objeto depositado! getData("text-plain") ➔ "${claseTransferida}" ✅`;
                consoleOutput1.appendChild(line);
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                this.showToast("¡Drop ejecutado con éxito en .cuadrado!");
            });
        }

        // 2. Arena Slide 7: Texturizador Interactivo en Vivo
        const texturasSwatches = document.querySelectorAll(".textura-swatch");
        const canvasDestino = document.getElementById("canvas-destino");
        const canvasDestinoText = document.getElementById("canvas-destino-text");
        const texturizerLiveResult = document.getElementById("texturizerLiveResult");

        if (texturasSwatches.length > 0 && canvasDestino) {
            texturasSwatches.forEach((swatch) => {
                swatch.addEventListener("dragstart", (e) => {
                    SoundEffects.click();
                    const { dataTransfer, currentTarget } = e;
                    dataTransfer.setData("text/plain", currentTarget.id);
                    dataTransfer.setData("text/url-pattern", currentTarget.dataset.url || "");
                    dataTransfer.setData("text/nombre", currentTarget.dataset.nombre || currentTarget.id);
                    currentTarget.classList.add("arrastrando");
                });

                swatch.addEventListener("dragend", (e) => {
                    e.currentTarget.classList.remove("arrastrando");
                    canvasDestino.classList.remove("zona-activa");
                });
            });

            canvasDestino.addEventListener("dragenter", (e) => {
                e.preventDefault();
                canvasDestino.classList.add("zona-activa");
            });

            canvasDestino.addEventListener("dragleave", (e) => {
                if (e.target === canvasDestino) {
                    canvasDestino.classList.remove("zona-activa");
                }
            });

            canvasDestino.addEventListener("dragover", (e) => {
                e.preventDefault(); // Obligatorio para desbloquear la zona
            });

            canvasDestino.addEventListener("drop", (e) => {
                e.preventDefault();
                SoundEffects.success();
                const idTextura = e.dataTransfer.getData("text/plain");
                const patronCSS = e.dataTransfer.getData("text/url-pattern");
                const nombreTextura = e.dataTransfer.getData("text/nombre") || idTextura;

                if (patronCSS) {
                    canvasDestino.style.background = patronCSS;
                    if (canvasDestinoText) {
                        canvasDestinoText.textContent = `¡Textura "${nombreTextura}" Aplicada Correctamente!`;
                    }
                    if (texturizerLiveResult) {
                        texturizerLiveResult.innerHTML = `
                            <code>getData("text/plain") ➔ "${idTextura}"</code><br>
                            <small style="color: var(--emerald);">Patrón aplicado al lienzo receptor mediante <code>dataTransfer</code> ✅</small>
                        `;
                    }
                    this.showToast(`Textura '${nombreTextura}' aplicada al lienzo`);
                }
                canvasDestino.classList.remove("zona-activa");
            });
        }
    }

    // Vincula todos los escuchadores de eventos de la presentación
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

        // Slide 2: Simular Arrastre Completo (.circulo -> .cuadrado)
        const btnTestDragIntro = document.getElementById("btnTestDragIntro");
        const statusDragIntro = document.getElementById("testDragIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        const demoCuadrado = document.getElementById("demoCuadrado");
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus");

        if (btnTestDragIntro && consoleOutput1) {
            btnTestDragIntro.addEventListener("click", () => {
                SoundEffects.success();
                if (statusDragIntro) statusDragIntro.textContent = "Ciclo simulado con éxito";
                if (demoCuadrado) demoCuadrado.classList.add("zona-completada");
                if (demoCuadradoStatus) {
                    demoCuadradoStatus.innerHTML = `✅ <strong>¡Drop exitoso!</strong> Recibido: <code>"circulo"</code>`;
                }
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; 1. [dragstart] en .circulo ➔ setData("text-plain", "circulo")</div>
                    <div class="term-line" style="color: var(--text-muted);">&gt; 2. [drag]      en .circulo ➔ Desplazando elemento...</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; 3. [dragenter] en .cuadrado ➔ Entra a la zona destino</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; 4. [dragover]  en .cuadrado ➔ e.preventDefault() ejecutado</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; 5. [drop]      en .cuadrado ➔ getData("text-plain") === "circulo" ✅</div>
                    <div class="term-line" style="color: var(--amber);">&gt; 6. [dragend]   en .circulo ➔ Fin del arrastre</div>
                `;
                this.showToast("Ciclo de 7 eventos simulado en .circulo y .cuadrado");
            });
        }

        // Slide 3: Inspeccionar Orden Cronológico de los 7 Eventos
        const btnCheckLifecycleEvents = document.getElementById("btnCheckLifecycleEvents");
        const lifecycleEventsResult = document.getElementById("lifecycleEventsResult");
        if (btnCheckLifecycleEvents && lifecycleEventsResult) {
            btnCheckLifecycleEvents.addEventListener("click", () => {
                SoundEffects.success();
                lifecycleEventsResult.innerHTML = `
                    <code>1. dragstart (Objeto)</code> ➔ <code>2. drag (Objeto)</code> ➔ <code>3. dragenter (Zona)</code> ➔ <code>4. dragover + preventDefault (Zona)</code><br>
                    <code>5. drop + getData (Zona)</code> ➔ <code>6. dragend (Objeto)</code> <small style="color: var(--emerald);">(Si sale sin soltar: dispara <code>dragleave</code>)</small>
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de dataTransfer y Reglas Nativa
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareDragModes = document.getElementById("btnCompareDragModes");
        if (btnCompareDragModes) {
            btnCompareDragModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de Diagrama de Flujo, preventDefault y Aislamiento
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

        // Slide 5.1: Botón Diagrama de Flujo
        const btnTestDecisionTree = document.getElementById("btnTestDecisionTree");
        const decisionTreeResult = document.getElementById("decisionTreeResult");
        if (btnTestDecisionTree && decisionTreeResult) {
            btnTestDecisionTree.addEventListener("click", () => {
                SoundEffects.success();
                decisionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">Ruta Exitosa:</span> <code>draggable="true"</code> ➔ <code>dragstart (setData)</code> ➔ <code>dragover (preventDefault)</code> ➔ <code>drop (getData)</code> ✅<br>
                    <span style="color: var(--amber);">Ruta Cancelada:</span> Si sale de la zona dispara <code>dragleave</code>; si suelta fuera dispara <code>dragend</code>.
                `;
            });
        }

        // Slide 5.2: Botón Efecto de e.preventDefault()
        const btnTestTryCatchParse = document.getElementById("btnTestTryCatchParse");
        const tryCatchParseResult = document.getElementById("tryCatchParseResult");
        if (btnTestTryCatchParse && tryCatchParseResult) {
            btnTestTryCatchParse.addEventListener("click", () => {
                SoundEffects.success();
                tryCatchParseResult.innerHTML = `
                    <span style="color: var(--rose);">Sin e.preventDefault() en dragover:</span> Cursor 🚫 bloqueado y el evento <code>drop</code> es ignorado.<br>
                    <span style="color: var(--emerald);">Con e.preventDefault() en dragover:</span> Zona receptora habilitada y lista para recibir <code>drop</code> ✅
                `;
            });
        }

        // Slide 5.3: Botón Auditoría de Permisos de dataTransfer
        const btnTestSecurityCheck = document.getElementById("btnTestSecurityCheck");
        const securityCheckResult = document.getElementById("securityCheckResult");
        if (btnTestSecurityCheck && securityCheckResult) {
            btnTestSecurityCheck.addEventListener("click", () => {
                SoundEffects.success();
                securityCheckResult.innerHTML = `
                    <span style="color: var(--cyan);">En <code>dragstart</code>:</span> Permiso de Lectura y Escritura (<code>setData</code> habilitado).<br>
                    <span style="color: var(--amber);">En <code>drag / dragenter / dragover / dragleave</code>:</span> Modo Protegido (<code>getData()</code> devuelve <code>""</code>).<br>
                    <span style="color: var(--emerald);">En <code>drop</code>:</span> Modo Lectura desbloqueado (<code>getData()</code> entrega el valor real) ✅
                `;
            });
        }

        // Slide 7: Botón Simular Texturizador Automáticamente
        const btnTestTexturizerLive = document.getElementById("btnTestTexturizerLive");
        const canvasDestino = document.getElementById("canvas-destino");
        const canvasDestinoText = document.getElementById("canvas-destino-text");
        const texturizerLiveResult = document.getElementById("texturizerLiveResult");

        if (btnTestTexturizerLive && canvasDestino) {
            const listaTexturasDemo = [
                {
                    id: "textura-madera",
                    nombre: "Madera Roble",
                    url: "repeating-linear-gradient(45deg, #78350f, #78350f 12px, #92400e 12px, #92400e 24px)"
                },
                {
                    id: "textura-metal",
                    nombre: "Metal Titanio",
                    url: "linear-gradient(135deg, #334155 0%, #94a3b8 50%, #1e293b 100%)"
                },
                {
                    id: "textura-neon",
                    nombre: "Ciber Neón",
                    url: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 50%, #10b981 100%)"
                }
            ];

            btnTestTexturizerLive.addEventListener("click", () => {
                SoundEffects.success();
                const tex = listaTexturasDemo[AppState.demoTextureIndex % listaTexturasDemo.length];
                AppState.demoTextureIndex++;

                canvasDestino.style.background = tex.url;
                if (canvasDestinoText) {
                    canvasDestinoText.textContent = `¡Textura "${tex.nombre}" Aplicada Correctamente!`;
                }
                if (texturizerLiveResult) {
                    texturizerLiveResult.innerHTML = `
                        <code>setData("text/plain", "${tex.id}") ➔ getData("text/url-pattern")</code><br>
                        <small style="color: var(--emerald);">Textura activa: <strong>${tex.nombre}</strong> (Pulsa de nuevo para probar la siguiente textura).</small>
                    `;
                }
                this.showToast(`Textura '${tex.nombre}' aplicada al modelo`);
            });
        }

        // Slide 8: Selector de Analogías (Camión de Mudanzas vs Tapete de Bienvenida)
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-drag-1";
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
                const cheatText = `# GUÍA MAESTRA: API DE DRAG & DROP EN JAVASCRIPT

1. **Configuración Inicial en HTML:**
   - \`<div id="objeto" draggable="true">Arrástrame</div>\` (Obligatorio en elementos personalizados).

2. **Eventos del Objeto (Emisor):**
   - \`dragstart\`: Inicia el arrastre. Único lugar para guardar datos con \`e.dataTransfer.setData()\`.
   - \`drag\`: Se dispara continuamente mientras el objeto se desplaza.
   - \`dragend\`: Se dispara al finalizar (restaura opacidad/clases).

3. **Eventos de Zona (Receptor):**
   - \`dragenter\`: El cursor entra en la zona (añadir clase \`.zona-activa\`).
   - \`dragover\`: El cursor flota en la zona. **Obligatorio ejecutar \`e.preventDefault()\`** para habilitar el \`drop\`.
   - \`dragleave\`: El cursor sale de la zona sin soltar (remover clase \`.zona-activa\`).
   - \`drop\`: El usuario suelta el objeto. Se lee la carga con \`e.dataTransfer.getData()\`.

4. **Transferencia de Datos (\`dataTransfer\`):**
   \`\`\`javascript
   objeto.addEventListener("dragstart", e => {
       e.dataTransfer.setData("text/plain", e.target.id);
   });
   zona.addEventListener("dragover", e => e.preventDefault());
   zona.addEventListener("drop", e => {
       e.preventDefault();
       const id = e.dataTransfer.getData("text/plain");
   });
   \`\`\`
`;
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación comparativa en el Slide 4
    static runScenarioSimulation(scenarioKey) {
        const terminalImplicit = document.getElementById("terminalImplicit");
        const terminalSerialized = document.getElementById("terminalSerialized");
        const feedbackText = document.getElementById("storageFeedbackText");
        if (!terminalImplicit || !terminalSerialized) return;

        SoundEffects.transition();

        if (scenarioKey === "prevent") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; cuadrado.addEventListener("dragover", e =&gt; {}); // Sin preventDefault</div>
                <div class="term-line" style="color: var(--rose);">&gt; Al soltar el clic: El evento 'drop' JAMÁS se dispara 🚫❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; cuadrado.addEventListener("dragover", e =&gt; e.preventDefault());</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Al soltar el clic: El evento 'drop' se ejecuta correctamente ✅</div>
            `;
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>Regla de Oro en dragover:</strong> Por defecto los navegadores prohíben soltar elementos dentro de un <code>div</code>. Invocar <code>e.preventDefault()</code> desbloquea la zona receptora.";
            }
        } else if (scenarioKey === "aislamiento") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; cuadrado.addEventListener("dragover", e =&gt; e.dataTransfer.getData("text/plain"));</div>
                <div class="term-line" style="color: var(--rose);">&gt; Resultado en dragover ➔ "" (Cadena vacía por aislamiento de seguridad) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; cuadrado.addEventListener("drop", e =&gt; e.dataTransfer.getData("text/plain"));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Resultado en drop     ➔ "circulo" (Carga útil recuperada) ✅</div>
            `;
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>Aislamiento de Seguridad:</strong> Los datos guardados en <code>dataTransfer</code> están protegidos durante <code>dragover</code> y <code>dragenter</code>; solo pueden extraerse con <code>getData()</code> en el evento <code>drop</code>.";
            }
        } else if (scenarioKey === "draggable") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; &lt;div class="circulo"&gt;&lt;/div&gt; &lt;!-- Sin atributo draggable --&gt;</div>
                <div class="term-line" style="color: var(--rose);">&gt; Al arrastrar con el mouse: Solo selecciona texto, no dispara dragstart ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; &lt;div class="circulo" draggable="true"&gt;&lt;/div&gt;</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Al arrastrar con el mouse: Inicia el fantasma nativo y dispara dragstart ✅</div>
            `;
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>El interruptor draggable=\"true\":</strong> A diferencia de <code>&lt;img&gt;</code> y <code>&lt;a&gt;</code>, cualquier contenedor <code>&lt;div&gt;</code> requiere declarar explícitamente <code>draggable=\"true\"</code>.";
            }
        } else if (scenarioKey === "formato") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; setData("text/plain", id); ➔ getData("text/html"); // Llave distinta</div>
                <div class="term-line" style="color: var(--rose);">&gt; Resultado ➔ "" (No coincide el formato registrado) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; setData("text/url-pattern", url); ➔ getData("text/url-pattern");</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Resultado ➔ "url('madera.jpg')" (Coincidencia exacta de formato) ✅</div>
            `;
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>Consistencia de Formato:</strong> El primer argumento de <code>getData(formato)</code> debe coincidir exactamente con la clave usada en <code>setData(formato, valor)</code>.";
            }
        }
    }

    // Actualiza la visualización de las analogías en el Slide 8 (Camión de Mudanzas vs Tapete de Bienvenida)
    static updateOfficeView(officeState) {
        const avatarLeft = document.getElementById("officeAvatarLeft");
        const titleLeft = document.getElementById("officeTitleLeft");
        const subLeft = document.getElementById("officeSubLeft");
        const itemsLeft = document.getElementById("officeItemsLeft");
        const statusLeft = document.getElementById("officeStatusLeft");
        const arrowLabel = document.getElementById("officeArrowLabel");

        const avatarRight = document.getElementById("officeAvatarRight");
        const titleRight = document.getElementById("officeTitleRight");
        const subRight = document.getElementById("officeSubRight");
        const itemsRight = document.getElementById("officeItemsRight");
        const statusRight = document.getElementById("officeStatusRight");
        const bannerText = document.getElementById("officeBannerText");
        const bannerIcon = document.getElementById("officeBannerIcon");

        if (officeState === "camion") {
            if (avatarLeft) avatarLeft.textContent = "🏠";
            if (titleLeft) titleLeft.textContent = "1. Casa de Origen (Evento dragstart)";
            if (subLeft) subLeft.textContent = "Carga de Cajas en el Camión con setData()";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Cargas tus pertenencias en el camión antes de arrancar</div>
                <div class="ws-item">No puedes meter cajas nuevas al camión a mitad de la autopista</div>
            `;
            if (statusLeft) statusLeft.textContent = 'e.dataTransfer.setData("text/plain", id) al iniciar el viaje';
            if (arrowLabel) arrowLabel.textContent = "dataTransfer";

            if (avatarRight) avatarRight.textContent = "🏡";
            if (titleRight) titleRight.textContent = "2. Garaje del Nuevo Hogar (Evento drop)";
            if (subRight) subRight.textContent = "Descarga Segura con getData()";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Las compuertas se abren únicamente al estacionar en destino</div>
                <div class="ws-item highlight-item">Se extraen las cajas intactas y se acomodan en la nueva casa</div>
            `;
            if (statusRight) statusRight.textContent = 'e.dataTransfer.getData("text/plain") al soltar en la zona habilitada';

            if (bannerIcon) bannerIcon.textContent = "🚚";
            if (bannerText) {
                bannerText.innerHTML = "<strong>El Camión de Mudanzas (dataTransfer):</strong> <code>setData()</code> carga la información en la casa de origen (<code>dragstart</code>) y <code>getData()</code> abre las compuertas exclusivamente al estacionar en el destino final (<code>drop</code>).";
            }
        } else {
            if (avatarLeft) avatarLeft.textContent = "🔔";
            if (titleLeft) titleLeft.textContent = "1. Entrar a la Tienda (Evento dragenter)";
            if (subLeft) subLeft.textContent = "Pisas el Tapete de Bienvenida";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Das el primer paso dentro del local llevando el objeto</div>
                <div class="ws-item">Suena la campana de aviso y se ilumina el mostrador (.zona-activa)</div>
            `;
            if (statusLeft) statusLeft.textContent = 'lienzo.classList.add("zona-activa") al cruzar el borde';
            if (arrowLabel) arrowLabel.textContent = "¿Sale sin comprar?";

            if (avatarRight) avatarRight.textContent = "🚪";
            if (titleRight) titleRight.textContent = "2. Salir del Local (Evento dragleave)";
            if (subRight) subRight.textContent = "Das Marcha Atrás sin Soltar el Objeto";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Decides salirte de los límites de la tienda sin dejar el paquete</div>
                <div class="ws-item highlight-item">La campana deja de sonar y la tienda apaga las luces de resaltado</div>
            `;
            if (statusRight) statusRight.textContent = 'lienzo.classList.remove("zona-activa") al abandonar la zona';

            if (bannerIcon) bannerIcon.textContent = "🚪";
            if (bannerText) {
                bannerText.innerHTML = "<strong>El Tapete de Bienvenida (dragenter y dragleave):</strong> <code>dragenter</code> ilumina la zona receptora cuando el cursor entra, y <code>dragleave</code> restaura el diseño original si el usuario sale sin soltar el objeto.";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
