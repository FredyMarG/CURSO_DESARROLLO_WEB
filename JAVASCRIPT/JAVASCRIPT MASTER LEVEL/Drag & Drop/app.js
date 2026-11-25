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
"use strict"; // Activa el modo estricto de JavaScript

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Objeto que almacena el estado reactivo de la presentación y configuraciones del usuario
const AppState = {
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación (10 diapositivas)
    totalSlides: 11,
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
class SoundEffects { // Define clase
    // Inicializa el contexto de audio únicamente cuando el usuario interactúa (requerido por políticas de navegadores)
    static init() {
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
            // Instancia un nuevo contexto de audio nativo
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) {
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return; // Evalúa condición lógica

        try { // Inicia bloque protegido contra errores
            // Aseguramos que el AudioContext esté inicializado
            this.init();
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return; // Evalúa condición lógica

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === "suspended") { // Evalúa condición lógica
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
class AppController { // Define clase
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
        const dotsContainer = document.getElementById("slideDotsContainer"); // Declara e inicializa variable local
        if (!dotsContainer) return; // Evalúa condición lógica
        dotsContainer.innerHTML = ""; // Actualiza contenido en el DOM

        for (let i = 1; i <= AppState.totalSlides; i++) { // Itera sobre elementos o rango
            const dot = document.createElement("button"); // Declara e inicializa variable local
            dot.className = `slide-dot ${i === AppState.currentSlide ? "active" : ""}`;
            dot.title = `Ir a la diapositiva ${i}`;
            dot.setAttribute("data-slide-target", i);
            dot.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Genera las tarjetas clicables dentro del modal de Visión General (Overview Grid)
    static renderOverviewGrid() {
        const overviewGrid = document.getElementById("overviewGrid"); // Declara e inicializa variable local
        if (!overviewGrid) return; // Evalúa condición lógica
        overviewGrid.innerHTML = ""; // Actualiza contenido en el DOM

        const slideElements = document.querySelectorAll(".slide"); // Declara e inicializa variable local
        slideElements.forEach((slide, idx) => {
            const slideNum = idx + 1; // Declara e inicializa variable local
            const title = slide.getAttribute("data-title") || `Diapositiva ${slideNum}`; // Declara e inicializa variable local
            const card = document.createElement("div"); // Declara e inicializa variable local
            card.className = `overview-card ${slideNum === AppState.currentSlide ? "active" : ""}`;
            card.innerHTML = `
                <div class="ov-num">${slideNum}</div>
                <div class="ov-title">${title}</div>
            `;
            card.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.transition();
                this.goToSlide(slideNum);
                this.closeOverview();
            });
            overviewGrid.appendChild(card);
        });
    }

    // Actualiza el estado visual: diapositivas activas, barra de progreso e indicadores
    static updatePresentationState() {
        const slides = document.querySelectorAll(".slide"); // Declara e inicializa variable local
        slides.forEach((slide) => {
            const num = parseInt(slide.getAttribute("data-slide"), 10); // Declara e inicializa variable local
            if (num === AppState.currentSlide) { // Evalúa condición lógica
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        // Actualiza el indicador de texto: "X / 10"
        const slideIndicator = document.getElementById("slideIndicator"); // Declara e inicializa variable local
        if (slideIndicator) { // Evalúa condición lógica
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
        }

        // Actualiza el ancho de la barra de progreso
        const progressBar = document.getElementById("progressBar"); // Declara e inicializa variable local
        if (progressBar) { // Evalúa condición lógica
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa variable local
            progressBar.style.width = `${pct}%`;
        }

        // Actualiza las bolitas inferiores
        const dots = document.querySelectorAll(".slide-dot"); // Declara e inicializa variable local
        dots.forEach((dot, idx) => {
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición lógica
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Actualiza el estado de las tarjetas en el modal overview
        const ovCards = document.querySelectorAll(".overview-card"); // Declara e inicializa variable local
        ovCards.forEach((card, idx) => {
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición lógica
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
        if (slideNum < 1 || slideNum > AppState.totalSlides) return; // Evalúa condición lógica
        AppState.currentSlide = slideNum;
        SoundEffects.transition();
        this.updatePresentationState();
    }

    static nextSlide() {
        if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición lógica
            this.goToSlide(AppState.currentSlide + 1);
        }
    }

    static prevSlide() {
        if (AppState.currentSlide > 1) { // Evalúa condición lógica
            this.goToSlide(AppState.currentSlide - 1);
        }
    }

    // Alterna entre modo presentación (diapositivas) y modo documento corrido
    static toggleMode() {
        AppState.isPresentationMode = !AppState.isPresentationMode;
        const body = document.body; // Declara e inicializa variable local
        const modeText = document.getElementById("modeText"); // Declara e inicializa variable local
        const modeIcon = document.getElementById("modeIcon"); // Declara e inicializa variable local

        if (AppState.isPresentationMode) { // Evalúa condición lógica
            body.classList.remove("mode-document");
            body.classList.add("mode-presentation");
            if (modeText) modeText.textContent = "Modo Guía"; // Evalúa condición lógica
            if (modeIcon) modeIcon.textContent = "📑"; // Evalúa condición lógica
            this.showToast("Modo Presentación activado");
        } else {
            body.classList.remove("mode-presentation");
            body.classList.add("mode-document");
            if (modeText) modeText.textContent = "Modo Diapo"; // Evalúa condición lógica
            if (modeIcon) modeIcon.textContent = "🖼️"; // Evalúa condición lógica
            this.showToast("Modo Documento Continuo activado");
        }
    }

    // Alterna sonido On/Off
    static toggleSound() {
        AppState.soundEnabled = !AppState.soundEnabled;
        const soundIcon = document.getElementById("soundIcon"); // Declara e inicializa variable local
        if (soundIcon) { // Evalúa condición lógica
            soundIcon.textContent = AppState.soundEnabled ? "🔊" : "🔇"; // Actualiza contenido en el DOM
        }
        if (AppState.soundEnabled) { // Evalúa condición lógica
            SoundEffects.success();
            this.showToast("Efectos de audio activados");
        } else {
            this.showToast("Audio silenciado");
        }
    }

    // Abre el modal Overview
    static openOverview() {
        const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modal) { // Evalúa condición lógica
            modal.classList.add("active");
            SoundEffects.click();
        }
    }

    // Cierra el modal Overview
    static closeOverview() {
        const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modal) { // Evalúa condición lógica
            modal.classList.remove("active");
        }
    }

    // Alterna pantalla completa
    static toggleFullscreen() {
        if (!document.fullscreenElement) { // Evalúa condición lógica
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) { // Evalúa condición lógica
                document.exitFullscreen();
            }
        }
    }

    // Muestra una notificación flotante (Toast)
    static showToast(message, isError = false) {
        const toast = document.getElementById("toastNotification"); // Declara e inicializa variable local
        const toastMsg = document.getElementById("toastMsg"); // Declara e inicializa variable local
        const toastIcon = document.getElementById("toastIcon"); // Declara e inicializa variable local
        if (!toast || !toastMsg) return; // Evalúa condición lógica

        toastMsg.textContent = message; // Actualiza contenido en el DOM
        if (toastIcon) { // Evalúa condición lógica
            toastIcon.textContent = isError ? "⚠️" : "✔"; // Actualiza contenido en el DOM
        }

        toast.classList.add("active");
        setTimeout(() => {
            toast.classList.remove("active");
        }, 3000);
    }

    // Carga un preset de código en el textarea del Playground
    static loadPlaygroundPreset(presetKey) {
        const textarea = document.getElementById("liveCodeEditor"); // Declara e inicializa variable local
        if (!textarea) return; // Evalúa condición lógica
        const code = CodePresets[presetKey] || "// Código no disponible";
        textarea.value = code;

        const select = document.getElementById("codePresetSelect"); // Declara e inicializa variable local
        if (select && CodePresets[presetKey]) { // Evalúa condición lógica
            select.value = presetKey;
        }
    }

    // Ejecuta el código del Playground capturando la consola virtual
    static runPlaygroundCode() {
        const textarea = document.getElementById("liveCodeEditor"); // Declara e inicializa variable local
        const logsContainer = document.getElementById("consoleLogsContainer"); // Declara e inicializa variable local
        if (!textarea || !logsContainer) return; // Evalúa condición lógica

        const codeToRun = textarea.value; // Declara e inicializa variable local
        logsContainer.innerHTML = ""; // Actualiza contenido en el DOM

        // Función auxiliar para agregar líneas al panel de consola virtual
        const appendVirtualLog = (type, args) => {
            const line = document.createElement("div"); // Declara e inicializa variable local
            line.className = `log-line ${type}-line`;
            const timeSpan = document.createElement("span"); // Declara e inicializa variable local
            timeSpan.className = "log-time";
            timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`; // Actualiza contenido en el DOM
            line.appendChild(timeSpan);

            const contentText = args.map(arg => {
                if (typeof arg === "object" && arg !== null) { // Evalúa condición lógica
                    try { // Inicia bloque protegido contra errores
                        return JSON.stringify(arg, null, 2); // Retorna el resultado de la función
                    } catch (e) {
                        return String(arg); // Retorna el resultado de la función
                    }
                }
                return String(arg); // Retorna el resultado de la función
            }).join(" ");

            const textNode = document.createTextNode(" " + contentText); // Declara e inicializa variable local
            line.appendChild(textNode);
            logsContainer.appendChild(line);
            logsContainer.scrollTop = logsContainer.scrollHeight;
        };

        // Guardamos los métodos originales de console
        const originalLog = console.log; // Declara e inicializa variable local
        const originalError = console.error; // Declara e inicializa variable local
        const originalWarn = console.warn; // Declara e inicializa variable local
        const originalInfo = console.info; // Declara e inicializa variable local

        try { // Inicia bloque protegido contra errores
            // Sobrescribimos console para interceptar la salida
            console.log = (...args) => { // Imprime salida en consola
                originalLog(...args);
                appendVirtualLog("info", args);
            };
            console.error = (...args) => { // Imprime salida en consola
                originalError(...args);
                appendVirtualLog("error", args);
            };
            console.warn = (...args) => { // Imprime salida en consola
                originalWarn(...args);
                appendVirtualLog("warn", args);
            };
            console.info = (...args) => { // Imprime salida en consola
                originalInfo(...args);
                appendVirtualLog("info", args);
            };

            // Ejecutamos el código con Function para aislar ámbito
            const runFn = new Function(codeToRun); // Declara e inicializa variable local
            runFn();

            SoundEffects.success();
            AppController.showToast("Código ejecutado con éxito");
        } catch (err) {
            console.error("Excepción:", err.name, "-", err.message); // Imprime salida en consola
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
        } finally {
            // Restauramos los métodos originales de console
            console.log = originalLog; // Imprime salida en consola
            console.error = originalError; // Imprime salida en consola
            console.warn = originalWarn; // Imprime salida en consola
            console.info = originalInfo; // Imprime salida en consola
        }
    }

    // Conecta los eventos nativos de HTML5 Drag & Drop en las arenas interactivas (Slide 2 y Slide 7)
    static bindLiveDragArenas() {
        // 1. Arena Slide 2: .circulo y .cuadrado
        const demoCirculo = document.getElementById("demoCirculo"); // Declara e inicializa variable local
        const demoCuadrado = document.getElementById("demoCuadrado"); // Declara e inicializa variable local
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus"); // Declara e inicializa variable local
        const statusIntro = document.getElementById("testDragIntroStatus"); // Declara e inicializa variable local
        const consoleOutput1 = document.getElementById("console-output-1"); // Declara e inicializa variable local

        if (demoCirculo && demoCuadrado && consoleOutput1) { // Evalúa condición lógica
            let dragCounter = 0; // Declara e inicializa variable local

            demoCirculo.addEventListener("dragstart", (e) => { // Registra escuchador de evento en el DOM
                dragCounter = 0;
                SoundEffects.click();
                demoCirculo.classList.add("arrastrando");
                e.dataTransfer.setData("text-plain", "circulo");
                if (statusIntro) statusIntro.textContent = "Arrastrando .circulo..."; // Evalúa condición lógica
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; [dragstart] e.dataTransfer.setData("text-plain", "circulo")</div>
                `;
            });

            demoCirculo.addEventListener("drag", () => { // Registra escuchador de evento en el DOM
                dragCounter++;
                if (dragCounter === 1 || dragCounter % 25 === 0) { // Evalúa condición lógica
                    const line = document.createElement("div"); // Declara e inicializa variable local
                    line.className = "term-line";
                    line.style.color = "var(--text-muted)";
                    line.textContent = `> [drag] Desplazando .circulo (ciclo #${dragCounter})...`; // Actualiza contenido en el DOM
                    consoleOutput1.appendChild(line);
                    consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                }
            });

            demoCirculo.addEventListener("dragend", () => { // Registra escuchador de evento en el DOM
                demoCirculo.classList.remove("arrastrando");
                demoCuadrado.classList.remove("zona-activa");
                const line = document.createElement("div"); // Declara e inicializa variable local
                line.className = "term-line";
                line.style.color = "var(--amber)";
                line.textContent = "> [dragend] Operación finalizada (opacidad restaurada)"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line);
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
            });

            demoCuadrado.addEventListener("dragenter", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault();
                demoCuadrado.classList.add("zona-activa");
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "¡Zona activa! Suelta el círculo aquí..."; // Evalúa condición lógica
                const line = document.createElement("div"); // Declara e inicializa variable local
                line.className = "term-line";
                line.style.color = "var(--cyan)";
                line.textContent = "> [dragenter] Cursor entró en los límites de .cuadrado"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line);
            });

            demoCuadrado.addEventListener("dragover", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault(); // Obligatorio para habilitar el evento drop
            });

            demoCuadrado.addEventListener("dragleave", () => { // Registra escuchador de evento en el DOM
                demoCuadrado.classList.remove("zona-activa");
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "Saliste de la zona .cuadrado (dragleave)"; // Evalúa condición lógica
                const line = document.createElement("div"); // Declara e inicializa variable local
                line.className = "term-line";
                line.style.color = "var(--rose)";
                line.textContent = "> [dragleave] Cursor salió de .cuadrado sin soltar"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line);
            });

            demoCuadrado.addEventListener("drop", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault();
                SoundEffects.success();
                const claseTransferida = e.dataTransfer.getData("text-plain") || "circulo"; // Declara e inicializa variable local
                demoCuadrado.classList.remove("zona-activa");
                demoCuadrado.classList.add("zona-completada");
                if (demoCuadradoStatus) { // Evalúa condición lógica
                    demoCuadradoStatus.innerHTML = `✅ <strong>¡Drop exitoso!</strong> Recibido: <code>"${claseTransferida}"</code>`; // Actualiza contenido en el DOM
                }
                if (statusIntro) statusIntro.textContent = "¡Drop completado!"; // Evalúa condición lógica
                const line = document.createElement("div"); // Declara e inicializa variable local
                line.className = "term-line";
                line.style.color = "var(--emerald)";
                line.innerHTML = `&gt; [drop] ¡Objeto depositado! getData("text-plain") ➔ "${claseTransferida}" ✅`; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line);
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                this.showToast("¡Drop ejecutado con éxito en .cuadrado!");
            });
        }

        // 2. Arena Slide 7: Texturizador Interactivo en Vivo
        const texturasSwatches = document.querySelectorAll(".textura-swatch"); // Declara e inicializa variable local
        const canvasDestino = document.getElementById("canvas-destino"); // Declara e inicializa variable local
        const canvasDestinoText = document.getElementById("canvas-destino-text"); // Declara e inicializa variable local
        const texturizerLiveResult = document.getElementById("texturizerLiveResult"); // Declara e inicializa variable local

        if (texturasSwatches.length > 0 && canvasDestino) { // Evalúa condición lógica
            texturasSwatches.forEach((swatch) => {
                swatch.addEventListener("dragstart", (e) => { // Registra escuchador de evento en el DOM
                    SoundEffects.click();
                    const { dataTransfer, currentTarget } = e; // Declara e inicializa variable local
                    dataTransfer.setData("text/plain", currentTarget.id);
                    dataTransfer.setData("text/url-pattern", currentTarget.dataset.url || "");
                    dataTransfer.setData("text/nombre", currentTarget.dataset.nombre || currentTarget.id);
                    currentTarget.classList.add("arrastrando");
                });

                swatch.addEventListener("dragend", (e) => { // Registra escuchador de evento en el DOM
                    e.currentTarget.classList.remove("arrastrando");
                    canvasDestino.classList.remove("zona-activa");
                });
            });

            canvasDestino.addEventListener("dragenter", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault();
                canvasDestino.classList.add("zona-activa");
            });

            canvasDestino.addEventListener("dragleave", (e) => { // Registra escuchador de evento en el DOM
                if (e.target === canvasDestino) { // Evalúa condición lógica
                    canvasDestino.classList.remove("zona-activa");
                }
            });

            canvasDestino.addEventListener("dragover", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault(); // Obligatorio para desbloquear la zona
            });

            canvasDestino.addEventListener("drop", (e) => { // Registra escuchador de evento en el DOM
                e.preventDefault();
                SoundEffects.success();
                const idTextura = e.dataTransfer.getData("text/plain"); // Declara e inicializa variable local
                const patronCSS = e.dataTransfer.getData("text/url-pattern"); // Declara e inicializa variable local
                const nombreTextura = e.dataTransfer.getData("text/nombre") || idTextura; // Declara e inicializa variable local

                if (patronCSS) { // Evalúa condición lógica
                    canvasDestino.style.background = patronCSS;
                    if (canvasDestinoText) { // Evalúa condición lógica
                        canvasDestinoText.textContent = `¡Textura "${nombreTextura}" Aplicada Correctamente!`; // Actualiza contenido en el DOM
                    }
                    if (texturizerLiveResult) { // Evalúa condición lógica
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
        const btnNext = document.getElementById("btnNextSlide"); // Declara e inicializa variable local
        const btnPrev = document.getElementById("btnPrevSlide"); // Declara e inicializa variable local
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición lógica
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición lógica

        // Botones de inicio en slide 1
        const btnStart = document.getElementById("btnStartPresentation"); // Declara e inicializa variable local
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2)); // Evalúa condición lógica

        // Botones de salto [data-jump]
        document.querySelectorAll("[data-jump]").forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const target = parseInt(btn.getAttribute("data-jump"), 10); // Declara e inicializa variable local
                this.goToSlide(target);
            });
        });

        // Controles de barra superior
        const btnGoLab = document.getElementById("btnGoLab"); // Declara e inicializa variable local
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(6)); // Evalúa condición lógica

        const btnToggleMode = document.getElementById("btnToggleMode"); // Declara e inicializa variable local
        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode()); // Evalúa condición lógica

        const btnToggleSound = document.getElementById("btnToggleSound"); // Declara e inicializa variable local
        if (btnToggleSound) btnToggleSound.addEventListener("click", () => this.toggleSound()); // Evalúa condición lógica

        const btnOverview = document.getElementById("btnOverview"); // Declara e inicializa variable local
        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview()); // Evalúa condición lógica

        const btnCloseOverview = document.getElementById("btnCloseOverview"); // Declara e inicializa variable local
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview()); // Evalúa condición lógica

        const btnFullscreen = document.getElementById("btnFullscreen"); // Declara e inicializa variable local
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen()); // Evalúa condición lógica

        // Cerrar modal al hacer clic en el backdrop
        const overviewModal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (overviewModal) { // Evalúa condición lógica
            overviewModal.addEventListener("click", (e) => { // Registra escuchador de evento en el DOM
                if (e.target === overviewModal) this.closeOverview(); // Evalúa condición lógica
            });
        }

        // Atajos de teclado
        window.addEventListener("keydown", (e) => { // Registra escuchador de evento en el DOM
            // Si está escribiendo dentro del textarea o input, no intervenir
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición lógica
                // Ctrl + Enter para ejecutar código en playground
                if (e.ctrlKey && e.key === "Enter") { // Evalúa condición lógica
                    e.preventDefault();
                    this.runPlaygroundCode();
                }
                return; // Retorna el resultado de la función
            }

            if (e.key === "ArrowRight" || e.key === " " || e.key === "d" || e.key === "D") { // Evalúa condición lógica
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === "o" || e.key === "O") {
                e.preventDefault();
                const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
                if (modal && modal.classList.contains("active")) { // Evalúa condición lógica
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
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const targetId = btn.getAttribute("data-target"); // Declara e inicializa variable local
                const codeEl = document.getElementById(targetId); // Declara e inicializa variable local
                if (codeEl) { // Evalúa condición lógica
                    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => { // Actualiza contenido en el DOM
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
        const btnTestDragIntro = document.getElementById("btnTestDragIntro"); // Declara e inicializa variable local
        const statusDragIntro = document.getElementById("testDragIntroStatus"); // Declara e inicializa variable local
        const consoleOutput1 = document.getElementById("console-output-1"); // Declara e inicializa variable local
        const demoCuadrado = document.getElementById("demoCuadrado"); // Declara e inicializa variable local
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus"); // Declara e inicializa variable local

        if (btnTestDragIntro && consoleOutput1) { // Evalúa condición lógica
            btnTestDragIntro.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                if (statusDragIntro) statusDragIntro.textContent = "Ciclo simulado con éxito"; // Evalúa condición lógica
                if (demoCuadrado) demoCuadrado.classList.add("zona-completada"); // Evalúa condición lógica
                if (demoCuadradoStatus) { // Evalúa condición lógica
                    demoCuadradoStatus.innerHTML = `✅ <strong>¡Drop exitoso!</strong> Recibido: <code>"circulo"</code>`; // Actualiza contenido en el DOM
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
        const btnCheckLifecycleEvents = document.getElementById("btnCheckLifecycleEvents"); // Declara e inicializa variable local
        const lifecycleEventsResult = document.getElementById("lifecycleEventsResult"); // Declara e inicializa variable local
        if (btnCheckLifecycleEvents && lifecycleEventsResult) { // Evalúa condición lógica
            btnCheckLifecycleEvents.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                lifecycleEventsResult.innerHTML = `
                    <code>1. dragstart (Objeto)</code> ➔ <code>2. drag (Objeto)</code> ➔ <code>3. dragenter (Zona)</code> ➔ <code>4. dragover + preventDefault (Zona)</code><br>
                    <code>5. drop + getData (Zona)</code> ➔ <code>6. dragend (Objeto)</code> <small style="color: var(--emerald);">(Si sale sin soltar: dispara <code>dragleave</code>)</small>
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de dataTransfer y Reglas Nativa
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Declara e inicializa variable local
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareDragModes = document.getElementById("btnCompareDragModes"); // Declara e inicializa variable local
        if (btnCompareDragModes) { // Evalúa condición lógica
            btnCompareDragModes.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de Diagrama de Flujo, preventDefault y Aislamiento
        const flowTabs = document.querySelectorAll("[data-flow]"); // Declara e inicializa variable local
        flowTabs.forEach(tab => {
            tab.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                flowTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const viewId = `flow-view-${tab.getAttribute("data-flow")}`; // Declara e inicializa variable local
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active")); // Obtiene referencia al elemento del DOM
                const targetView = document.getElementById(viewId); // Declara e inicializa variable local
                if (targetView) targetView.classList.add("active"); // Evalúa condición lógica
                SoundEffects.click();
            });
        });

        // Slide 5.1: Botón Diagrama de Flujo
        const btnTestDecisionTree = document.getElementById("btnTestDecisionTree"); // Declara e inicializa variable local
        const decisionTreeResult = document.getElementById("decisionTreeResult"); // Declara e inicializa variable local
        if (btnTestDecisionTree && decisionTreeResult) { // Evalúa condición lógica
            btnTestDecisionTree.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                decisionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">Ruta Exitosa:</span> <code>draggable="true"</code> ➔ <code>dragstart (setData)</code> ➔ <code>dragover (preventDefault)</code> ➔ <code>drop (getData)</code> ✅<br>
                    <span style="color: var(--amber);">Ruta Cancelada:</span> Si sale de la zona dispara <code>dragleave</code>; si suelta fuera dispara <code>dragend</code>.
                `;
            });
        }

        // Slide 5.2: Botón Efecto de e.preventDefault()
        const btnTestTryCatchParse = document.getElementById("btnTestTryCatchParse"); // Declara e inicializa variable local
        const tryCatchParseResult = document.getElementById("tryCatchParseResult"); // Declara e inicializa variable local
        if (btnTestTryCatchParse && tryCatchParseResult) { // Evalúa condición lógica
            btnTestTryCatchParse.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                tryCatchParseResult.innerHTML = `
                    <span style="color: var(--rose);">Sin e.preventDefault() en dragover:</span> Cursor 🚫 bloqueado y el evento <code>drop</code> es ignorado.<br>
                    <span style="color: var(--emerald);">Con e.preventDefault() en dragover:</span> Zona receptora habilitada y lista para recibir <code>drop</code> ✅
                `;
            });
        }

        // Slide 5.3: Botón Auditoría de Permisos de dataTransfer
        const btnTestSecurityCheck = document.getElementById("btnTestSecurityCheck"); // Declara e inicializa variable local
        const securityCheckResult = document.getElementById("securityCheckResult"); // Declara e inicializa variable local
        if (btnTestSecurityCheck && securityCheckResult) { // Evalúa condición lógica
            btnTestSecurityCheck.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                securityCheckResult.innerHTML = `
                    <span style="color: var(--cyan);">En <code>dragstart</code>:</span> Permiso de Lectura y Escritura (<code>setData</code> habilitado).<br>
                    <span style="color: var(--amber);">En <code>drag / dragenter / dragover / dragleave</code>:</span> Modo Protegido (<code>getData()</code> devuelve <code>""</code>).<br>
                    <span style="color: var(--emerald);">En <code>drop</code>:</span> Modo Lectura desbloqueado (<code>getData()</code> entrega el valor real) ✅
                `;
            });
        }

        // Slide 7: Botón Simular Texturizador Automáticamente
        const btnTestTexturizerLive = document.getElementById("btnTestTexturizerLive"); // Declara e inicializa variable local
        const canvasDestino = document.getElementById("canvas-destino"); // Declara e inicializa variable local
        const canvasDestinoText = document.getElementById("canvas-destino-text"); // Declara e inicializa variable local
        const texturizerLiveResult = document.getElementById("texturizerLiveResult"); // Declara e inicializa variable local

        if (btnTestTexturizerLive && canvasDestino) { // Evalúa condición lógica
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

            btnTestTexturizerLive.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                const tex = listaTexturasDemo[AppState.demoTextureIndex % listaTexturasDemo.length]; // Declara e inicializa variable local
                AppState.demoTextureIndex++;

                canvasDestino.style.background = tex.url;
                if (canvasDestinoText) { // Evalúa condición lógica
                    canvasDestinoText.textContent = `¡Textura "${tex.nombre}" Aplicada Correctamente!`; // Actualiza contenido en el DOM
                }
                if (texturizerLiveResult) { // Evalúa condición lógica
                    texturizerLiveResult.innerHTML = `
                        <code>setData("text/plain", "${tex.id}") ➔ getData("text/url-pattern")</code><br>
                        <small style="color: var(--emerald);">Textura activa: <strong>${tex.nombre}</strong> (Pulsa de nuevo para probar la siguiente textura).</small>
                    `;
                }
                this.showToast(`Textura '${tex.nombre}' aplicada al modelo`);
            });
        }

        // Slide 8: Selector de Analogías (Camión de Mudanzas vs Tapete de Bienvenida)
        const officeBtns = document.querySelectorAll("[data-office]"); // Declara e inicializa variable local
        officeBtns.forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                officeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeOfficeState = btn.getAttribute("data-office");
                SoundEffects.click();
                this.updateOfficeView(AppState.activeOfficeState);
            });
        });

        // Slide 9: Playground select preset
        const codePresetSelect = document.getElementById("codePresetSelect"); // Declara e inicializa variable local
        if (codePresetSelect) { // Evalúa condición lógica
            codePresetSelect.addEventListener("change", (e) => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.loadPlaygroundPreset(e.target.value);
            });
        }

        // Slide 9: Botón restaurar preset
        const btnResetCode = document.getElementById("btnResetCode"); // Declara e inicializa variable local
        if (btnResetCode) { // Evalúa condición lógica
            btnResetCode.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-drag-1"; // Declara e inicializa variable local
                this.loadPlaygroundPreset(currentPreset);
                this.showToast("Código restaurado");
            });
        }

        // Slide 9: Botón ejecutar código
        const btnRunEditorCode = document.getElementById("btnRunEditorCode"); // Declara e inicializa variable local
        if (btnRunEditorCode) { // Evalúa condición lógica
            btnRunEditorCode.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                this.runPlaygroundCode();
            });
        }

        // Slide 9: Botón limpiar consola
        const btnClearConsole = document.getElementById("btnClearConsole"); // Declara e inicializa variable local
        const logsContainer = document.getElementById("consoleLogsContainer"); // Declara e inicializa variable local
        if (btnClearConsole && logsContainer) { // Evalúa condición lógica
            btnClearConsole.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>'; // Actualiza contenido en el DOM
            });
        }

        // Slide 10: Botones "Cargar en Playground" de los retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa variable local
                SoundEffects.transition();
                this.loadPlaygroundPreset(presetKey);
                this.goToSlide(9); // Salta al playground
                this.showToast("Reto cargado en el Playground");
            });
        });

        // Slide 10: Botones "Ver Solución"
        document.querySelectorAll("[data-sol]").forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const solId = btn.getAttribute("data-sol"); // Declara e inicializa variable local
                const solBox = document.getElementById(solId); // Declara e inicializa variable local
                if (solBox) { // Evalúa condición lógica
                    SoundEffects.click();
                    solBox.classList.toggle("active");
                    btn.textContent = solBox.classList.contains("active") ? "Ocultar Solución" : "Ver Solución"; // Actualiza contenido en el DOM
                }
            });
        });

        // Slide 10: Reiniciar presentación
        const btnRestart = document.getElementById("btnRestartPresentation"); // Declara e inicializa variable local
        if (btnRestart) { // Evalúa condición lógica
            btnRestart.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.transition();
                this.goToSlide(1);
            });
        }

        // Slide 10: Copiar chuleta rápida en markdown
        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat"); // Declara e inicializa variable local
        if (btnCopySummaryCheat) { // Evalúa condición lógica
            btnCopySummaryCheat.addEventListener("click", () => { // Registra escuchador de evento en el DOM
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
        const terminalImplicit = document.getElementById("terminalImplicit"); // Declara e inicializa variable local
        const terminalSerialized = document.getElementById("terminalSerialized"); // Declara e inicializa variable local
        const feedbackText = document.getElementById("storageFeedbackText"); // Declara e inicializa variable local
        if (!terminalImplicit || !terminalSerialized) return; // Evalúa condición lógica

        SoundEffects.transition();

        if (scenarioKey === "prevent") { // Evalúa condición lógica
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; cuadrado.addEventListener("dragover", e =&gt; {}); // Sin preventDefault</div>
                <div class="term-line" style="color: var(--rose);">&gt; Al soltar el clic: El evento 'drop' JAMÁS se dispara 🚫❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; cuadrado.addEventListener("dragover", e =&gt; e.preventDefault());</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Al soltar el clic: El evento 'drop' se ejecuta correctamente ✅</div>
            `;
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>Regla de Oro en dragover:</strong> Por defecto los navegadores prohíben soltar elementos dentro de un <code>div</code>. Invocar <code>e.preventDefault()</code> desbloquea la zona receptora."; // Actualiza contenido en el DOM
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
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>Aislamiento de Seguridad:</strong> Los datos guardados en <code>dataTransfer</code> están protegidos durante <code>dragover</code> y <code>dragenter</code>; solo pueden extraerse con <code>getData()</code> en el evento <code>drop</code>."; // Actualiza contenido en el DOM
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
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>El interruptor draggable=\"true\":</strong> A diferencia de <code>&lt;img&gt;</code> y <code>&lt;a&gt;</code>, cualquier contenedor <code>&lt;div&gt;</code> requiere declarar explícitamente <code>draggable=\"true\"</code>."; // Actualiza contenido en el DOM
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
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>Consistencia de Formato:</strong> El primer argumento de <code>getData(formato)</code> debe coincidir exactamente con la clave usada en <code>setData(formato, valor)</code>."; // Actualiza contenido en el DOM
            }
        }
    }

    // Actualiza la visualización de las analogías en el Slide 8 (Camión de Mudanzas vs Tapete de Bienvenida)
    static updateOfficeView(officeState) {
        const avatarLeft = document.getElementById("officeAvatarLeft"); // Declara e inicializa variable local
        const titleLeft = document.getElementById("officeTitleLeft"); // Declara e inicializa variable local
        const subLeft = document.getElementById("officeSubLeft"); // Declara e inicializa variable local
        const itemsLeft = document.getElementById("officeItemsLeft"); // Declara e inicializa variable local
        const statusLeft = document.getElementById("officeStatusLeft"); // Declara e inicializa variable local
        const arrowLabel = document.getElementById("officeArrowLabel"); // Declara e inicializa variable local

        const avatarRight = document.getElementById("officeAvatarRight"); // Declara e inicializa variable local
        const titleRight = document.getElementById("officeTitleRight"); // Declara e inicializa variable local
        const subRight = document.getElementById("officeSubRight"); // Declara e inicializa variable local
        const itemsRight = document.getElementById("officeItemsRight"); // Declara e inicializa variable local
        const statusRight = document.getElementById("officeStatusRight"); // Declara e inicializa variable local
        const bannerText = document.getElementById("officeBannerText"); // Declara e inicializa variable local
        const bannerIcon = document.getElementById("officeBannerIcon"); // Declara e inicializa variable local

        if (officeState === "camion") { // Evalúa condición lógica
            if (avatarLeft) avatarLeft.textContent = "🏠"; // Evalúa condición lógica
            if (titleLeft) titleLeft.textContent = "1. Casa de Origen (Evento dragstart)"; // Evalúa condición lógica
            if (subLeft) subLeft.textContent = "Carga de Cajas en el Camión con setData()"; // Evalúa condición lógica
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Cargas tus pertenencias en el camión antes de arrancar</div>
                <div class="ws-item">No puedes meter cajas nuevas al camión a mitad de la autopista</div>
            `;
            if (statusLeft) statusLeft.textContent = 'e.dataTransfer.setData("text/plain", id) al iniciar el viaje'; // Evalúa condición lógica
            if (arrowLabel) arrowLabel.textContent = "dataTransfer"; // Evalúa condición lógica

            if (avatarRight) avatarRight.textContent = "🏡"; // Evalúa condición lógica
            if (titleRight) titleRight.textContent = "2. Garaje del Nuevo Hogar (Evento drop)"; // Evalúa condición lógica
            if (subRight) subRight.textContent = "Descarga Segura con getData()"; // Evalúa condición lógica
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Las compuertas se abren únicamente al estacionar en destino</div>
                <div class="ws-item highlight-item">Se extraen las cajas intactas y se acomodan en la nueva casa</div>
            `;
            if (statusRight) statusRight.textContent = 'e.dataTransfer.getData("text/plain") al soltar en la zona habilitada'; // Evalúa condición lógica

            if (bannerIcon) bannerIcon.textContent = "🚚"; // Evalúa condición lógica
            if (bannerText) { // Evalúa condición lógica
                bannerText.innerHTML = "<strong>El Camión de Mudanzas (dataTransfer):</strong> <code>setData()</code> carga la información en la casa de origen (<code>dragstart</code>) y <code>getData()</code> abre las compuertas exclusivamente al estacionar en el destino final (<code>drop</code>)."; // Actualiza contenido en el DOM
            }
        } else {
            if (avatarLeft) avatarLeft.textContent = "🔔"; // Evalúa condición lógica
            if (titleLeft) titleLeft.textContent = "1. Entrar a la Tienda (Evento dragenter)"; // Evalúa condición lógica
            if (subLeft) subLeft.textContent = "Pisas el Tapete de Bienvenida"; // Evalúa condición lógica
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Das el primer paso dentro del local llevando el objeto</div>
                <div class="ws-item">Suena la campana de aviso y se ilumina el mostrador (.zona-activa)</div>
            `;
            if (statusLeft) statusLeft.textContent = 'lienzo.classList.add("zona-activa") al cruzar el borde'; // Evalúa condición lógica
            if (arrowLabel) arrowLabel.textContent = "¿Sale sin comprar?"; // Evalúa condición lógica

            if (avatarRight) avatarRight.textContent = "🚪"; // Evalúa condición lógica
            if (titleRight) titleRight.textContent = "2. Salir del Local (Evento dragleave)"; // Evalúa condición lógica
            if (subRight) subRight.textContent = "Das Marcha Atrás sin Soltar el Objeto"; // Evalúa condición lógica
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Decides salirte de los límites de la tienda sin dejar el paquete</div>
                <div class="ws-item highlight-item">La campana deja de sonar y la tienda apaga las luces de resaltado</div>
            `;
            if (statusRight) statusRight.textContent = 'lienzo.classList.remove("zona-activa") al abandonar la zona'; // Evalúa condición lógica

            if (bannerIcon) bannerIcon.textContent = "🚪"; // Evalúa condición lógica
            if (bannerText) { // Evalúa condición lógica
                bannerText.innerHTML = "<strong>El Tapete de Bienvenida (dragenter y dragleave):</strong> <code>dragenter</code> ilumina la zona receptora cuando el cursor entra, y <code>dragleave</code> restaura el diseño original si el usuario sale sin soltar el objeto."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de evento en el DOM
    AppController.init();
});

