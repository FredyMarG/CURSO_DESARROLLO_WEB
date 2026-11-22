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
const AppState = { // Declara e inicializa "AppState"
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
    static init() { // Instrucción JavaScript
        // Verifica si el contexto aún no ha sido creado y si el navegador soporta AudioContext
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
            // Instancia un nuevo contexto de audio nativo
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Asigna valor
        }
    }

    // Reproduce un tono acústico con una frecuencia, tipo de onda, duración y ganancia determinadas
    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) { // Instrucción JavaScript
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return; // Evalúa condición

        try { // Inicia bloque protegido contra errores
            // Aseguramos que el AudioContext esté inicializado
            this.init(); // Ejecuta llamada o método
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return; // Evalúa condición

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === "suspended") { // Evalúa condición
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
        this.playTone(600, "triangle", 0.04, 0.03); // Ejecuta llamada o método
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() { // Instrucción JavaScript
        this.playTone(523.25, "sine", 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, "sine", 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() { // Instrucción JavaScript
        this.playTone(320, "sine", 0.06, 0.03); // Ejecuta llamada o método
        setTimeout(() => this.playTone(480, "sine", 0.08, 0.03), 40); // Ejecuta llamada o método
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static error() { // Instrucción JavaScript
        this.playTone(280, "sawtooth", 0.15, 0.04); // Ejecuta llamada o método
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = { // Declara e inicializa "CodePresets"
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
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.bindLiveDragArenas(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-drag-1"); // Ejecuta llamada o método
    }

    // Genera las bolitas (dots) de la barra inferior de navegación
    static renderDots() { // Instrucción JavaScript
        const dotsContainer = document.getElementById("slideDotsContainer"); // Obtiene referencia DOM para "dotsContainer"
        if (!dotsContainer) return; // Evalúa condición
        dotsContainer.innerHTML = ""; // Actualiza contenido en el DOM

        for (let i = 1; i <= AppState.totalSlides; i++) { // Inicia bucle de iteración
            const dot = document.createElement("button"); // Crea nuevo elemento DOM "dot"
            dot.className = `slide-dot ${i === AppState.currentSlide ? "active" : ""}`; // Asigna valor
            dot.title = `Ir a la diapositiva ${i}`; // Asigna valor
            dot.setAttribute("data-slide-target", i); // Ejecuta llamada o método
            dot.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.goToSlide(i); // Ejecuta llamada o método
            });
            dotsContainer.appendChild(dot); // Inserta nodo en el DOM
        }
    }

    // Genera las tarjetas clicables dentro del modal de Visión General (Overview Grid)
    static renderOverviewGrid() { // Instrucción JavaScript
        const overviewGrid = document.getElementById("overviewGrid"); // Obtiene referencia DOM para "overviewGrid"
        if (!overviewGrid) return; // Evalúa condición
        overviewGrid.innerHTML = ""; // Actualiza contenido en el DOM

        const slideElements = document.querySelectorAll(".slide"); // Obtiene referencia DOM para "slideElements"
        slideElements.forEach((slide, idx) => { // Instrucción JavaScript
            const slideNum = idx + 1; // Declara e inicializa "slideNum"
            const title = slide.getAttribute("data-title") || `Diapositiva ${slideNum}`; // Declara e inicializa "title"
            const card = document.createElement("div"); // Crea nuevo elemento DOM "card"
            card.className = `overview-card ${slideNum === AppState.currentSlide ? "active" : ""}`; // Asigna valor
            card.innerHTML = `
                <div class="ov-num">${slideNum}</div>
                <div class="ov-title">${title}</div>
            `;
            card.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.transition(); // Ejecuta llamada o método
                this.goToSlide(slideNum); // Ejecuta llamada o método
                this.closeOverview(); // Ejecuta llamada o método
            });
            overviewGrid.appendChild(card); // Inserta nodo en el DOM
        });
    }

    // Actualiza el estado visual: diapositivas activas, barra de progreso e indicadores
    static updatePresentationState() { // Instrucción JavaScript
        const slides = document.querySelectorAll(".slide"); // Obtiene referencia DOM para "slides"
        slides.forEach((slide) => { // Instrucción JavaScript
            const num = parseInt(slide.getAttribute("data-slide"), 10); // Declara e inicializa "num"
            if (num === AppState.currentSlide) { // Evalúa condición
                slide.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                slide.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        // Actualiza el indicador de texto: "X / 10"
        const slideIndicator = document.getElementById("slideIndicator"); // Obtiene referencia DOM para "slideIndicator"
        if (slideIndicator) { // Evalúa condición
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
        }

        // Actualiza el ancho de la barra de progreso
        const progressBar = document.getElementById("progressBar"); // Obtiene referencia DOM para "progressBar"
        if (progressBar) { // Evalúa condición
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa "pct"
            progressBar.style.width = `${pct}%`; // Asigna valor
        }

        // Actualiza las bolitas inferiores
        const dots = document.querySelectorAll(".slide-dot"); // Obtiene referencia DOM para "dots"
        dots.forEach((dot, idx) => { // Instrucción JavaScript
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición
                dot.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                dot.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        // Actualiza el estado de las tarjetas en el modal overview
        const ovCards = document.querySelectorAll(".overview-card"); // Obtiene referencia DOM para "ovCards"
        ovCards.forEach((card, idx) => { // Instrucción JavaScript
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición
                card.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                card.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        // Desplaza suavemente hacia arriba
        window.scrollTo({ top: 0, behavior: "smooth" }); // Ejecuta llamada o método
    }

    // Salta a una diapositiva específica
    static goToSlide(slideNum) { // Instrucción JavaScript
        if (slideNum < 1 || slideNum > AppState.totalSlides) return; // Evalúa condición
        AppState.currentSlide = slideNum; // Asigna valor
        SoundEffects.transition(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
    }

    static nextSlide() { // Instrucción JavaScript
        if (AppState.currentSlide < AppState.totalSlides) { // Evalúa condición
            this.goToSlide(AppState.currentSlide + 1); // Ejecuta llamada o método
        }
    }

    static prevSlide() { // Instrucción JavaScript
        if (AppState.currentSlide > 1) { // Evalúa condición
            this.goToSlide(AppState.currentSlide - 1); // Ejecuta llamada o método
        }
    }

    // Alterna entre modo presentación (diapositivas) y modo documento corrido
    static toggleMode() { // Instrucción JavaScript
        AppState.isPresentationMode = !AppState.isPresentationMode; // Asigna valor
        const body = document.body; // Declara e inicializa "body"
        const modeText = document.getElementById("modeText"); // Obtiene referencia DOM para "modeText"
        const modeIcon = document.getElementById("modeIcon"); // Obtiene referencia DOM para "modeIcon"

        if (AppState.isPresentationMode) { // Evalúa condición
            body.classList.remove("mode-document"); // Modifica clases CSS del elemento
            body.classList.add("mode-presentation"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Guía"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "📑"; // Evalúa condición
            this.showToast("Modo Presentación activado"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            body.classList.remove("mode-presentation"); // Modifica clases CSS del elemento
            body.classList.add("mode-document"); // Modifica clases CSS del elemento
            if (modeText) modeText.textContent = "Modo Diapo"; // Evalúa condición
            if (modeIcon) modeIcon.textContent = "🖼️"; // Evalúa condición
            this.showToast("Modo Documento Continuo activado"); // Ejecuta llamada o método
        }
    }

    // Alterna sonido On/Off
    static toggleSound() { // Instrucción JavaScript
        AppState.soundEnabled = !AppState.soundEnabled; // Asigna valor
        const soundIcon = document.getElementById("soundIcon"); // Obtiene referencia DOM para "soundIcon"
        if (soundIcon) { // Evalúa condición
            soundIcon.textContent = AppState.soundEnabled ? "🔊" : "🔇"; // Actualiza contenido en el DOM
        }
        if (AppState.soundEnabled) { // Evalúa condición
            SoundEffects.success(); // Ejecuta llamada o método
            this.showToast("Efectos de audio activados"); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            this.showToast("Audio silenciado"); // Ejecuta llamada o método
        }
    }

    // Abre el modal Overview
    static openOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            modal.classList.add("active"); // Modifica clases CSS del elemento
            SoundEffects.click(); // Ejecuta llamada o método
        }
    }

    // Cierra el modal Overview
    static closeOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
            modal.classList.remove("active"); // Modifica clases CSS del elemento
        }
    }

    // Alterna pantalla completa
    static toggleFullscreen() { // Instrucción JavaScript
        if (!document.fullscreenElement) { // Evalúa condición
            document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            if (document.exitFullscreen) { // Evalúa condición
                document.exitFullscreen(); // Ejecuta llamada o método
            }
        }
    }

    // Muestra una notificación flotante (Toast)
    static showToast(message, isError = false) { // Instrucción JavaScript
        const toast = document.getElementById("toastNotification"); // Obtiene referencia DOM para "toast"
        const toastMsg = document.getElementById("toastMsg"); // Obtiene referencia DOM para "toastMsg"
        const toastIcon = document.getElementById("toastIcon"); // Obtiene referencia DOM para "toastIcon"
        if (!toast || !toastMsg) return; // Evalúa condición

        toastMsg.textContent = message; // Actualiza contenido en el DOM
        if (toastIcon) { // Evalúa condición
            toastIcon.textContent = isError ? "⚠️" : "✔"; // Actualiza contenido en el DOM
        }

        toast.classList.add("active"); // Modifica clases CSS del elemento
        setTimeout(() => { // Instrucción JavaScript
            toast.classList.remove("active"); // Modifica clases CSS del elemento
        }, 3000); // Ejecuta llamada o método
    }

    // Carga un preset de código en el textarea del Playground
    static loadPlaygroundPreset(presetKey) { // Instrucción JavaScript
        const textarea = document.getElementById("liveCodeEditor"); // Obtiene referencia DOM para "textarea"
        if (!textarea) return; // Evalúa condición
        const code = CodePresets[presetKey] || "// Código no disponible";
        textarea.value = code; // Asigna valor

        const select = document.getElementById("codePresetSelect"); // Obtiene referencia DOM para "select"
        if (select && CodePresets[presetKey]) { // Evalúa condición
            select.value = presetKey; // Asigna valor
        }
    }

    // Ejecuta el código del Playground capturando la consola virtual
    static runPlaygroundCode() { // Instrucción JavaScript
        const textarea = document.getElementById("liveCodeEditor"); // Obtiene referencia DOM para "textarea"
        const logsContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia DOM para "logsContainer"
        if (!textarea || !logsContainer) return; // Evalúa condición

        const codeToRun = textarea.value; // Declara e inicializa "codeToRun"
        logsContainer.innerHTML = ""; // Actualiza contenido en el DOM

        // Función auxiliar para agregar líneas al panel de consola virtual
        const appendVirtualLog = (type, args) => { // Define función flecha "appendVirtualLog"
            const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
            line.className = `log-line ${type}-line`; // Asigna valor
            const timeSpan = document.createElement("span"); // Crea nuevo elemento DOM "timeSpan"
            timeSpan.className = "log-time"; // Asigna valor
            timeSpan.textContent = `[${new Date().toLocaleTimeString()}]`; // Actualiza contenido en el DOM
            line.appendChild(timeSpan); // Inserta nodo en el DOM

            const contentText = args.map(arg => { // Define función flecha "contentText"
                if (typeof arg === "object" && arg !== null) { // Evalúa condición
                    try { // Inicia bloque protegido contra errores
                        return JSON.stringify(arg, null, 2); // Retorna resultado
                    } catch (e) { // Instrucción JavaScript
                        return String(arg); // Retorna resultado
                    }
                }
                return String(arg); // Retorna resultado
            }).join(" "); // Ejecuta llamada o método

            const textNode = document.createTextNode(" " + contentText); // Declara e inicializa "textNode"
            line.appendChild(textNode); // Inserta nodo en el DOM
            logsContainer.appendChild(line); // Inserta nodo en el DOM
            logsContainer.scrollTop = logsContainer.scrollHeight; // Asigna valor
        };

        // Guardamos los métodos originales de console
        const originalLog = console.log; // Declara e inicializa "originalLog"
        const originalError = console.error; // Declara e inicializa "originalError"
        const originalWarn = console.warn; // Declara e inicializa "originalWarn"
        const originalInfo = console.info; // Declara e inicializa "originalInfo"

        try { // Inicia bloque protegido contra errores
            // Sobrescribimos console para interceptar la salida
            console.log = (...args) => { // Imprime salida en consola
                originalLog(...args); // Ejecuta llamada o método
                appendVirtualLog("info", args); // Ejecuta llamada o método
            };
            console.error = (...args) => { // Imprime salida en consola
                originalError(...args); // Ejecuta llamada o método
                appendVirtualLog("error", args); // Ejecuta llamada o método
            };
            console.warn = (...args) => { // Imprime salida en consola
                originalWarn(...args); // Ejecuta llamada o método
                appendVirtualLog("warn", args); // Ejecuta llamada o método
            };
            console.info = (...args) => { // Imprime salida en consola
                originalInfo(...args); // Ejecuta llamada o método
                appendVirtualLog("info", args); // Ejecuta llamada o método
            };

            // Ejecutamos el código con Function para aislar ámbito
            const runFn = new Function(codeToRun); // Declara e inicializa "runFn"
            runFn(); // Ejecuta llamada o método

            SoundEffects.success(); // Ejecuta llamada o método
            AppController.showToast("Código ejecutado con éxito"); // Ejecuta llamada o método
        } catch (err) { // Instrucción JavaScript
            console.error("Excepción:", err.name, "-", err.message); // Imprime salida en consola
            SoundEffects.error(); // Ejecuta llamada o método
            AppController.showToast("Error al ejecutar código", true); // Ejecuta llamada o método
        } finally { // Instrucción JavaScript
            // Restauramos los métodos originales de console
            console.log = originalLog; // Imprime salida en consola
            console.error = originalError; // Imprime salida en consola
            console.warn = originalWarn; // Imprime salida en consola
            console.info = originalInfo; // Imprime salida en consola
        }
    }

    // Conecta los eventos nativos de HTML5 Drag & Drop en las arenas interactivas (Slide 2 y Slide 7)
    static bindLiveDragArenas() { // Instrucción JavaScript
        // 1. Arena Slide 2: .circulo y .cuadrado
        const demoCirculo = document.getElementById("demoCirculo"); // Obtiene referencia DOM para "demoCirculo"
        const demoCuadrado = document.getElementById("demoCuadrado"); // Obtiene referencia DOM para "demoCuadrado"
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus"); // Obtiene referencia DOM para "demoCuadradoStatus"
        const statusIntro = document.getElementById("testDragIntroStatus"); // Obtiene referencia DOM para "statusIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"

        if (demoCirculo && demoCuadrado && consoleOutput1) { // Evalúa condición
            let dragCounter = 0; // Declara e inicializa "dragCounter"

            demoCirculo.addEventListener("dragstart", (e) => { // Registra escuchador de eventos
                dragCounter = 0; // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                demoCirculo.classList.add("arrastrando"); // Modifica clases CSS del elemento
                e.dataTransfer.setData("text-plain", "circulo"); // Ejecuta llamada o método
                if (statusIntro) statusIntro.textContent = "Arrastrando .circulo..."; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; [dragstart] e.dataTransfer.setData("text-plain", "circulo")</div>
                `;
            });

            demoCirculo.addEventListener("drag", () => { // Registra escuchador de eventos
                dragCounter++; // Instrucción JavaScript
                if (dragCounter === 1 || dragCounter % 25 === 0) { // Evalúa condición
                    const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                    line.className = "term-line"; // Asigna valor
                    line.style.color = "var(--text-muted)"; // Asigna valor
                    line.textContent = `> [drag] Desplazando .circulo (ciclo #${dragCounter})...`; // Actualiza contenido en el DOM
                    consoleOutput1.appendChild(line); // Inserta nodo en el DOM
                    consoleOutput1.scrollTop = consoleOutput1.scrollHeight; // Asigna valor
                }
            });

            demoCirculo.addEventListener("dragend", () => { // Registra escuchador de eventos
                demoCirculo.classList.remove("arrastrando"); // Modifica clases CSS del elemento
                demoCuadrado.classList.remove("zona-activa"); // Modifica clases CSS del elemento
                const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                line.className = "term-line"; // Asigna valor
                line.style.color = "var(--amber)"; // Asigna valor
                line.textContent = "> [dragend] Operación finalizada (opacidad restaurada)"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line); // Inserta nodo en el DOM
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight; // Asigna valor
            });

            demoCuadrado.addEventListener("dragenter", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Ejecuta llamada o método
                demoCuadrado.classList.add("zona-activa"); // Modifica clases CSS del elemento
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "¡Zona activa! Suelta el círculo aquí..."; // Evalúa condición
                const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                line.className = "term-line"; // Asigna valor
                line.style.color = "var(--cyan)"; // Asigna valor
                line.textContent = "> [dragenter] Cursor entró en los límites de .cuadrado"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line); // Inserta nodo en el DOM
            });

            demoCuadrado.addEventListener("dragover", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Obligatorio para habilitar el evento drop
            });

            demoCuadrado.addEventListener("dragleave", () => { // Registra escuchador de eventos
                demoCuadrado.classList.remove("zona-activa"); // Modifica clases CSS del elemento
                if (demoCuadradoStatus) demoCuadradoStatus.textContent = "Saliste de la zona .cuadrado (dragleave)"; // Evalúa condición
                const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                line.className = "term-line"; // Asigna valor
                line.style.color = "var(--rose)"; // Asigna valor
                line.textContent = "> [dragleave] Cursor salió de .cuadrado sin soltar"; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line); // Inserta nodo en el DOM
            });

            demoCuadrado.addEventListener("drop", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Ejecuta llamada o método
                SoundEffects.success(); // Ejecuta llamada o método
                const claseTransferida = e.dataTransfer.getData("text-plain") || "circulo"; // Declara e inicializa "claseTransferida"
                demoCuadrado.classList.remove("zona-activa"); // Modifica clases CSS del elemento
                demoCuadrado.classList.add("zona-completada"); // Modifica clases CSS del elemento
                if (demoCuadradoStatus) { // Evalúa condición
                    demoCuadradoStatus.innerHTML = `✅ <strong>¡Drop exitoso!</strong> Recibido: <code>"${claseTransferida}"</code>`; // Actualiza contenido en el DOM
                }
                if (statusIntro) statusIntro.textContent = "¡Drop completado!"; // Evalúa condición
                const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                line.className = "term-line"; // Asigna valor
                line.style.color = "var(--emerald)"; // Asigna valor
                line.innerHTML = `&gt; [drop] ¡Objeto depositado! getData("text-plain") ➔ "${claseTransferida}" ✅`; // Actualiza contenido en el DOM
                consoleOutput1.appendChild(line); // Inserta nodo en el DOM
                consoleOutput1.scrollTop = consoleOutput1.scrollHeight; // Asigna valor
                this.showToast("¡Drop ejecutado con éxito en .cuadrado!"); // Ejecuta llamada o método
            });
        }

        // 2. Arena Slide 7: Texturizador Interactivo en Vivo
        const texturasSwatches = document.querySelectorAll(".textura-swatch"); // Obtiene referencia DOM para "texturasSwatches"
        const canvasDestino = document.getElementById("canvas-destino"); // Obtiene referencia DOM para "canvasDestino"
        const canvasDestinoText = document.getElementById("canvas-destino-text"); // Obtiene referencia DOM para "canvasDestinoText"
        const texturizerLiveResult = document.getElementById("texturizerLiveResult"); // Obtiene referencia DOM para "texturizerLiveResult"

        if (texturasSwatches.length > 0 && canvasDestino) { // Evalúa condición
            texturasSwatches.forEach((swatch) => { // Instrucción JavaScript
                swatch.addEventListener("dragstart", (e) => { // Registra escuchador de eventos
                    SoundEffects.click(); // Ejecuta llamada o método
                    const { dataTransfer, currentTarget } = e; // Declara e inicializa "variable"
                    dataTransfer.setData("text/plain", currentTarget.id); // Ejecuta llamada o método
                    dataTransfer.setData("text/url-pattern", currentTarget.dataset.url || ""); // Ejecuta llamada o método
                    dataTransfer.setData("text/nombre", currentTarget.dataset.nombre || currentTarget.id); // Ejecuta llamada o método
                    currentTarget.classList.add("arrastrando"); // Modifica clases CSS del elemento
                });

                swatch.addEventListener("dragend", (e) => { // Registra escuchador de eventos
                    e.currentTarget.classList.remove("arrastrando"); // Modifica clases CSS del elemento
                    canvasDestino.classList.remove("zona-activa"); // Modifica clases CSS del elemento
                });
            });

            canvasDestino.addEventListener("dragenter", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Ejecuta llamada o método
                canvasDestino.classList.add("zona-activa"); // Modifica clases CSS del elemento
            });

            canvasDestino.addEventListener("dragleave", (e) => { // Registra escuchador de eventos
                if (e.target === canvasDestino) { // Evalúa condición
                    canvasDestino.classList.remove("zona-activa"); // Modifica clases CSS del elemento
                }
            });

            canvasDestino.addEventListener("dragover", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Obligatorio para desbloquear la zona
            });

            canvasDestino.addEventListener("drop", (e) => { // Registra escuchador de eventos
                e.preventDefault(); // Ejecuta llamada o método
                SoundEffects.success(); // Ejecuta llamada o método
                const idTextura = e.dataTransfer.getData("text/plain"); // Declara e inicializa "idTextura"
                const patronCSS = e.dataTransfer.getData("text/url-pattern"); // Declara e inicializa "patronCSS"
                const nombreTextura = e.dataTransfer.getData("text/nombre") || idTextura; // Declara e inicializa "nombreTextura"

                if (patronCSS) { // Evalúa condición
                    canvasDestino.style.background = patronCSS; // Asigna valor
                    if (canvasDestinoText) { // Evalúa condición
                        canvasDestinoText.textContent = `¡Textura "${nombreTextura}" Aplicada Correctamente!`; // Actualiza contenido en el DOM
                    }
                    if (texturizerLiveResult) { // Evalúa condición
                        texturizerLiveResult.innerHTML = `
                            <code>getData("text/plain") ➔ "${idTextura}"</code><br>
                            <small style="color: var(--emerald);">Patrón aplicado al lienzo receptor mediante <code>dataTransfer</code> ✅</small>
                        `;
                    }
                    this.showToast(`Textura '${nombreTextura}' aplicada al lienzo`); // Ejecuta llamada o método
                }
                canvasDestino.classList.remove("zona-activa"); // Modifica clases CSS del elemento
            });
        }
    }

    // Vincula todos los escuchadores de eventos de la presentación
    static bindEvents() { // Instrucción JavaScript
        // Navegación con botones
        const btnNext = document.getElementById("btnNextSlide"); // Obtiene referencia DOM para "btnNext"
        const btnPrev = document.getElementById("btnPrevSlide"); // Obtiene referencia DOM para "btnPrev"
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición

        // Botones de inicio en slide 1
        const btnStart = document.getElementById("btnStartPresentation"); // Obtiene referencia DOM para "btnStart"
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2)); // Evalúa condición

        // Botones de salto [data-jump]
        document.querySelectorAll("[data-jump]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const target = parseInt(btn.getAttribute("data-jump"), 10); // Declara e inicializa "target"
                this.goToSlide(target); // Ejecuta llamada o método
            });
        });

        // Controles de barra superior
        const btnGoLab = document.getElementById("btnGoLab"); // Obtiene referencia DOM para "btnGoLab"
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(6)); // Evalúa condición

        const btnToggleMode = document.getElementById("btnToggleMode"); // Obtiene referencia DOM para "btnToggleMode"
        if (btnToggleMode) btnToggleMode.addEventListener("click", () => this.toggleMode()); // Evalúa condición

        const btnToggleSound = document.getElementById("btnToggleSound"); // Obtiene referencia DOM para "btnToggleSound"
        if (btnToggleSound) btnToggleSound.addEventListener("click", () => this.toggleSound()); // Evalúa condición

        const btnOverview = document.getElementById("btnOverview"); // Obtiene referencia DOM para "btnOverview"
        if (btnOverview) btnOverview.addEventListener("click", () => this.openOverview()); // Evalúa condición

        const btnCloseOverview = document.getElementById("btnCloseOverview"); // Obtiene referencia DOM para "btnCloseOverview"
        if (btnCloseOverview) btnCloseOverview.addEventListener("click", () => this.closeOverview()); // Evalúa condición

        const btnFullscreen = document.getElementById("btnFullscreen"); // Obtiene referencia DOM para "btnFullscreen"
        if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen()); // Evalúa condición

        // Cerrar modal al hacer clic en el backdrop
        const overviewModal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "overviewModal"
        if (overviewModal) { // Evalúa condición
            overviewModal.addEventListener("click", (e) => { // Registra escuchador de eventos
                if (e.target === overviewModal) this.closeOverview(); // Evalúa condición
            });
        }

        // Atajos de teclado
        window.addEventListener("keydown", (e) => { // Registra escuchador de eventos
            // Si está escribiendo dentro del textarea o input, no intervenir
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición
                // Ctrl + Enter para ejecutar código en playground
                if (e.ctrlKey && e.key === "Enter") { // Evalúa condición
                    e.preventDefault(); // Ejecuta llamada o método
                    this.runPlaygroundCode(); // Ejecuta llamada o método
                }
                return; // Retorna resultado
            }

            if (e.key === "ArrowRight" || e.key === " " || e.key === "d" || e.key === "D") { // Evalúa condición
                e.preventDefault(); // Ejecuta llamada o método
                this.nextSlide(); // Ejecuta llamada o método
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { // Instrucción JavaScript
                e.preventDefault(); // Ejecuta llamada o método
                this.prevSlide(); // Ejecuta llamada o método
            } else if (e.key === "o" || e.key === "O") { // Instrucción JavaScript
                e.preventDefault(); // Ejecuta llamada o método
                const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
                if (modal && modal.classList.contains("active")) { // Evalúa condición
                    this.closeOverview(); // Ejecuta llamada o método
                } else { // Instrucción JavaScript
                    this.openOverview(); // Ejecuta llamada o método
                }
            } else if (e.key === "f" || e.key === "F") { // Instrucción JavaScript
                e.preventDefault(); // Ejecuta llamada o método
                this.toggleFullscreen(); // Ejecuta llamada o método
            } else if (e.key === "Escape") { // Instrucción JavaScript
                this.closeOverview(); // Ejecuta llamada o método
            }
        });

        // Botones de copiar código
        document.querySelectorAll(".btn-copy-code").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const targetId = btn.getAttribute("data-target"); // Declara e inicializa "targetId"
                const codeEl = document.getElementById(targetId); // Obtiene referencia DOM para "codeEl"
                if (codeEl) { // Evalúa condición
                    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => { // Actualiza contenido en el DOM
                        SoundEffects.click(); // Ejecuta llamada o método
                        this.showToast("Código copiado al portapapeles"); // Ejecuta llamada o método
                    });
                }
            });
        });

        // ----------------------------------------------------------------------
        // INTERACCIONES ESPECÍFICAS DE SLIDES
        // ----------------------------------------------------------------------

        // Slide 2: Simular Arrastre Completo (.circulo -> .cuadrado)
        const btnTestDragIntro = document.getElementById("btnTestDragIntro"); // Obtiene referencia DOM para "btnTestDragIntro"
        const statusDragIntro = document.getElementById("testDragIntroStatus"); // Obtiene referencia DOM para "statusDragIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        const demoCuadrado = document.getElementById("demoCuadrado"); // Obtiene referencia DOM para "demoCuadrado"
        const demoCuadradoStatus = document.getElementById("demoCuadradoStatus"); // Obtiene referencia DOM para "demoCuadradoStatus"

        if (btnTestDragIntro && consoleOutput1) { // Evalúa condición
            btnTestDragIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                if (statusDragIntro) statusDragIntro.textContent = "Ciclo simulado con éxito"; // Evalúa condición
                if (demoCuadrado) demoCuadrado.classList.add("zona-completada"); // Evalúa condición
                if (demoCuadradoStatus) { // Evalúa condición
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
                this.showToast("Ciclo de 7 eventos simulado en .circulo y .cuadrado"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Inspeccionar Orden Cronológico de los 7 Eventos
        const btnCheckLifecycleEvents = document.getElementById("btnCheckLifecycleEvents"); // Obtiene referencia DOM para "btnCheckLifecycleEvents"
        const lifecycleEventsResult = document.getElementById("lifecycleEventsResult"); // Obtiene referencia DOM para "lifecycleEventsResult"
        if (btnCheckLifecycleEvents && lifecycleEventsResult) { // Evalúa condición
            btnCheckLifecycleEvents.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                lifecycleEventsResult.innerHTML = `
                    <code>1. dragstart (Objeto)</code> ➔ <code>2. drag (Objeto)</code> ➔ <code>3. dragenter (Zona)</code> ➔ <code>4. dragover + preventDefault (Zona)</code><br>
                    <code>5. drop + getData (Zona)</code> ➔ <code>6. dragend (Objeto)</code> <small style="color: var(--emerald);">(Si sale sin soltar: dispara <code>dragleave</code>)</small>
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de dataTransfer y Reglas Nativa
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareDragModes = document.getElementById("btnCompareDragModes"); // Obtiene referencia DOM para "btnCompareDragModes"
        if (btnCompareDragModes) { // Evalúa condición
            btnCompareDragModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de Diagrama de Flujo, preventDefault y Aislamiento
        const flowTabs = document.querySelectorAll("[data-flow]"); // Obtiene referencia DOM para "flowTabs"
        flowTabs.forEach(tab => { // Instrucción JavaScript
            tab.addEventListener("click", () => { // Registra escuchador de eventos
                flowTabs.forEach(t => t.classList.remove("active")); // Modifica clases CSS del elemento
                tab.classList.add("active"); // Modifica clases CSS del elemento
                const viewId = `flow-view-${tab.getAttribute("data-flow")}`; // Declara e inicializa "viewId"
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active")); // Modifica clases CSS del elemento
                const targetView = document.getElementById(viewId); // Obtiene referencia DOM para "targetView"
                if (targetView) targetView.classList.add("active"); // Evalúa condición
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        // Slide 5.1: Botón Diagrama de Flujo
        const btnTestDecisionTree = document.getElementById("btnTestDecisionTree"); // Obtiene referencia DOM para "btnTestDecisionTree"
        const decisionTreeResult = document.getElementById("decisionTreeResult"); // Obtiene referencia DOM para "decisionTreeResult"
        if (btnTestDecisionTree && decisionTreeResult) { // Evalúa condición
            btnTestDecisionTree.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                decisionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">Ruta Exitosa:</span> <code>draggable="true"</code> ➔ <code>dragstart (setData)</code> ➔ <code>dragover (preventDefault)</code> ➔ <code>drop (getData)</code> ✅<br>
                    <span style="color: var(--amber);">Ruta Cancelada:</span> Si sale de la zona dispara <code>dragleave</code>; si suelta fuera dispara <code>dragend</code>.
                `;
            });
        }

        // Slide 5.2: Botón Efecto de e.preventDefault()
        const btnTestTryCatchParse = document.getElementById("btnTestTryCatchParse"); // Obtiene referencia DOM para "btnTestTryCatchParse"
        const tryCatchParseResult = document.getElementById("tryCatchParseResult"); // Obtiene referencia DOM para "tryCatchParseResult"
        if (btnTestTryCatchParse && tryCatchParseResult) { // Evalúa condición
            btnTestTryCatchParse.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                tryCatchParseResult.innerHTML = `
                    <span style="color: var(--rose);">Sin e.preventDefault() en dragover:</span> Cursor 🚫 bloqueado y el evento <code>drop</code> es ignorado.<br>
                    <span style="color: var(--emerald);">Con e.preventDefault() en dragover:</span> Zona receptora habilitada y lista para recibir <code>drop</code> ✅
                `;
            });
        }

        // Slide 5.3: Botón Auditoría de Permisos de dataTransfer
        const btnTestSecurityCheck = document.getElementById("btnTestSecurityCheck"); // Obtiene referencia DOM para "btnTestSecurityCheck"
        const securityCheckResult = document.getElementById("securityCheckResult"); // Obtiene referencia DOM para "securityCheckResult"
        if (btnTestSecurityCheck && securityCheckResult) { // Evalúa condición
            btnTestSecurityCheck.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                securityCheckResult.innerHTML = `
                    <span style="color: var(--cyan);">En <code>dragstart</code>:</span> Permiso de Lectura y Escritura (<code>setData</code> habilitado).<br>
                    <span style="color: var(--amber);">En <code>drag / dragenter / dragover / dragleave</code>:</span> Modo Protegido (<code>getData()</code> devuelve <code>""</code>).<br>
                    <span style="color: var(--emerald);">En <code>drop</code>:</span> Modo Lectura desbloqueado (<code>getData()</code> entrega el valor real) ✅
                `;
            });
        }

        // Slide 7: Botón Simular Texturizador Automáticamente
        const btnTestTexturizerLive = document.getElementById("btnTestTexturizerLive"); // Obtiene referencia DOM para "btnTestTexturizerLive"
        const canvasDestino = document.getElementById("canvas-destino"); // Obtiene referencia DOM para "canvasDestino"
        const canvasDestinoText = document.getElementById("canvas-destino-text"); // Obtiene referencia DOM para "canvasDestinoText"
        const texturizerLiveResult = document.getElementById("texturizerLiveResult"); // Obtiene referencia DOM para "texturizerLiveResult"

        if (btnTestTexturizerLive && canvasDestino) { // Evalúa condición
            const listaTexturasDemo = [
                { // Instrucción JavaScript
                    id: "textura-madera",
                    nombre: "Madera Roble",
                    url: "repeating-linear-gradient(45deg, #78350f, #78350f 12px, #92400e 12px, #92400e 24px)"
                },
                { // Instrucción JavaScript
                    id: "textura-metal",
                    nombre: "Metal Titanio",
                    url: "linear-gradient(135deg, #334155 0%, #94a3b8 50%, #1e293b 100%)"
                },
                { // Instrucción JavaScript
                    id: "textura-neon",
                    nombre: "Ciber Neón",
                    url: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 50%, #10b981 100%)"
                }
            ];

            btnTestTexturizerLive.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const tex = listaTexturasDemo[AppState.demoTextureIndex % listaTexturasDemo.length]; // Declara e inicializa "tex"
                AppState.demoTextureIndex++; // Instrucción JavaScript

                canvasDestino.style.background = tex.url; // Asigna valor
                if (canvasDestinoText) { // Evalúa condición
                    canvasDestinoText.textContent = `¡Textura "${tex.nombre}" Aplicada Correctamente!`; // Actualiza contenido en el DOM
                }
                if (texturizerLiveResult) { // Evalúa condición
                    texturizerLiveResult.innerHTML = `
                        <code>setData("text/plain", "${tex.id}") ➔ getData("text/url-pattern")</code><br>
                        <small style="color: var(--emerald);">Textura activa: <strong>${tex.nombre}</strong> (Pulsa de nuevo para probar la siguiente textura).</small>
                    `;
                }
                this.showToast(`Textura '${tex.nombre}' aplicada al modelo`); // Ejecuta llamada o método
            });
        }

        // Slide 8: Selector de Analogías (Camión de Mudanzas vs Tapete de Bienvenida)
        const officeBtns = document.querySelectorAll("[data-office]"); // Obtiene referencia DOM para "officeBtns"
        officeBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                officeBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeOfficeState = btn.getAttribute("data-office"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                this.updateOfficeView(AppState.activeOfficeState); // Ejecuta llamada o método
            });
        });

        // Slide 9: Playground select preset
        const codePresetSelect = document.getElementById("codePresetSelect"); // Obtiene referencia DOM para "codePresetSelect"
        if (codePresetSelect) { // Evalúa condición
            codePresetSelect.addEventListener("change", (e) => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(e.target.value); // Ejecuta llamada o método
            });
        }

        // Slide 9: Botón restaurar preset
        const btnResetCode = document.getElementById("btnResetCode"); // Obtiene referencia DOM para "btnResetCode"
        if (btnResetCode) { // Evalúa condición
            btnResetCode.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-drag-1"; // Declara e inicializa "currentPreset"
                this.loadPlaygroundPreset(currentPreset); // Ejecuta llamada o método
                this.showToast("Código restaurado"); // Ejecuta llamada o método
            });
        }

        // Slide 9: Botón ejecutar código
        const btnRunEditorCode = document.getElementById("btnRunEditorCode"); // Obtiene referencia DOM para "btnRunEditorCode"
        if (btnRunEditorCode) { // Evalúa condición
            btnRunEditorCode.addEventListener("click", () => { // Registra escuchador de eventos
                this.runPlaygroundCode(); // Ejecuta llamada o método
            });
        }

        // Slide 9: Botón limpiar consola
        const btnClearConsole = document.getElementById("btnClearConsole"); // Obtiene referencia DOM para "btnClearConsole"
        const logsContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia DOM para "logsContainer"
        if (btnClearConsole && logsContainer) { // Evalúa condición
            btnClearConsole.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>'; // Actualiza contenido en el DOM
            });
        }

        // Slide 10: Botones "Cargar en Playground" de los retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa "presetKey"
                SoundEffects.transition(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(presetKey); // Ejecuta llamada o método
                this.goToSlide(9); // Salta al playground
                this.showToast("Reto cargado en el Playground"); // Ejecuta llamada o método
            });
        });

        // Slide 10: Botones "Ver Solución"
        document.querySelectorAll("[data-sol]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const solId = btn.getAttribute("data-sol"); // Declara e inicializa "solId"
                const solBox = document.getElementById(solId); // Obtiene referencia DOM para "solBox"
                if (solBox) { // Evalúa condición
                    SoundEffects.click(); // Ejecuta llamada o método
                    solBox.classList.toggle("active"); // Modifica clases CSS del elemento
                    btn.textContent = solBox.classList.contains("active") ? "Ocultar Solución" : "Ver Solución"; // Actualiza contenido en el DOM
                }
            });
        });

        // Slide 10: Reiniciar presentación
        const btnRestart = document.getElementById("btnRestartPresentation"); // Obtiene referencia DOM para "btnRestart"
        if (btnRestart) { // Evalúa condición
            btnRestart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.transition(); // Ejecuta llamada o método
                this.goToSlide(1); // Ejecuta llamada o método
            });
        }

        // Slide 10: Copiar chuleta rápida en markdown
        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat"); // Obtiene referencia DOM para "btnCopySummaryCheat"
        if (btnCopySummaryCheat) { // Evalúa condición
            btnCopySummaryCheat.addEventListener("click", () => { // Registra escuchador de eventos
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
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación comparativa en el Slide 4
    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalImplicit = document.getElementById("terminalImplicit"); // Obtiene referencia DOM para "terminalImplicit"
        const terminalSerialized = document.getElementById("terminalSerialized"); // Obtiene referencia DOM para "terminalSerialized"
        const feedbackText = document.getElementById("storageFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalImplicit || !terminalSerialized) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "prevent") { // Evalúa condición
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; cuadrado.addEventListener("dragover", e =&gt; {}); // Sin preventDefault</div>
                <div class="term-line" style="color: var(--rose);">&gt; Al soltar el clic: El evento 'drop' JAMÁS se dispara 🚫❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; cuadrado.addEventListener("dragover", e =&gt; e.preventDefault());</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Al soltar el clic: El evento 'drop' se ejecuta correctamente ✅</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>Regla de Oro en dragover:</strong> Por defecto los navegadores prohíben soltar elementos dentro de un <code>div</code>. Invocar <code>e.preventDefault()</code> desbloquea la zona receptora."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "aislamiento") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; cuadrado.addEventListener("dragover", e =&gt; e.dataTransfer.getData("text/plain"));</div>
                <div class="term-line" style="color: var(--rose);">&gt; Resultado en dragover ➔ "" (Cadena vacía por aislamiento de seguridad) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; cuadrado.addEventListener("drop", e =&gt; e.dataTransfer.getData("text/plain"));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Resultado en drop     ➔ "circulo" (Carga útil recuperada) ✅</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>Aislamiento de Seguridad:</strong> Los datos guardados en <code>dataTransfer</code> están protegidos durante <code>dragover</code> y <code>dragenter</code>; solo pueden extraerse con <code>getData()</code> en el evento <code>drop</code>."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "draggable") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; &lt;div class="circulo"&gt;&lt;/div&gt; &lt;!-- Sin atributo draggable --&gt;</div>
                <div class="term-line" style="color: var(--rose);">&gt; Al arrastrar con el mouse: Solo selecciona texto, no dispara dragstart ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; &lt;div class="circulo" draggable="true"&gt;&lt;/div&gt;</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Al arrastrar con el mouse: Inicia el fantasma nativo y dispara dragstart ✅</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>El interruptor draggable=\"true\":</strong> A diferencia de <code>&lt;img&gt;</code> y <code>&lt;a&gt;</code>, cualquier contenedor <code>&lt;div&gt;</code> requiere declarar explícitamente <code>draggable=\"true\"</code>."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "formato") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; setData("text/plain", id); ➔ getData("text/html"); // Llave distinta</div>
                <div class="term-line" style="color: var(--rose);">&gt; Resultado ➔ "" (No coincide el formato registrado) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; setData("text/url-pattern", url); ➔ getData("text/url-pattern");</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Resultado ➔ "url('madera.jpg')" (Coincidencia exacta de formato) ✅</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>Consistencia de Formato:</strong> El primer argumento de <code>getData(formato)</code> debe coincidir exactamente con la clave usada en <code>setData(formato, valor)</code>."; // Actualiza contenido en el DOM
            }
        }
    }

    // Actualiza la visualización de las analogías en el Slide 8 (Camión de Mudanzas vs Tapete de Bienvenida)
    static updateOfficeView(officeState) { // Instrucción JavaScript
        const avatarLeft = document.getElementById("officeAvatarLeft"); // Obtiene referencia DOM para "avatarLeft"
        const titleLeft = document.getElementById("officeTitleLeft"); // Obtiene referencia DOM para "titleLeft"
        const subLeft = document.getElementById("officeSubLeft"); // Obtiene referencia DOM para "subLeft"
        const itemsLeft = document.getElementById("officeItemsLeft"); // Obtiene referencia DOM para "itemsLeft"
        const statusLeft = document.getElementById("officeStatusLeft"); // Obtiene referencia DOM para "statusLeft"
        const arrowLabel = document.getElementById("officeArrowLabel"); // Obtiene referencia DOM para "arrowLabel"

        const avatarRight = document.getElementById("officeAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const titleRight = document.getElementById("officeTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("officeSubRight"); // Obtiene referencia DOM para "subRight"
        const itemsRight = document.getElementById("officeItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("officeStatusRight"); // Obtiene referencia DOM para "statusRight"
        const bannerText = document.getElementById("officeBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("officeBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        if (officeState === "camion") { // Evalúa condición
            if (avatarLeft) avatarLeft.textContent = "🏠"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "1. Casa de Origen (Evento dragstart)"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Carga de Cajas en el Camión con setData()"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Cargas tus pertenencias en el camión antes de arrancar</div>
                <div class="ws-item">No puedes meter cajas nuevas al camión a mitad de la autopista</div>
            `;
            if (statusLeft) statusLeft.textContent = 'e.dataTransfer.setData("text/plain", id) al iniciar el viaje'; // Evalúa condición
            if (arrowLabel) arrowLabel.textContent = "dataTransfer"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🏡"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Garaje del Nuevo Hogar (Evento drop)"; // Evalúa condición
            if (subRight) subRight.textContent = "Descarga Segura con getData()"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Las compuertas se abren únicamente al estacionar en destino</div>
                <div class="ws-item highlight-item">Se extraen las cajas intactas y se acomodan en la nueva casa</div>
            `;
            if (statusRight) statusRight.textContent = 'e.dataTransfer.getData("text/plain") al soltar en la zona habilitada'; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🚚"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>El Camión de Mudanzas (dataTransfer):</strong> <code>setData()</code> carga la información en la casa de origen (<code>dragstart</code>) y <code>getData()</code> abre las compuertas exclusivamente al estacionar en el destino final (<code>drop</code>)."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (avatarLeft) avatarLeft.textContent = "🔔"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "1. Entrar a la Tienda (Evento dragenter)"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Pisas el Tapete de Bienvenida"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Das el primer paso dentro del local llevando el objeto</div>
                <div class="ws-item">Suena la campana de aviso y se ilumina el mostrador (.zona-activa)</div>
            `;
            if (statusLeft) statusLeft.textContent = 'lienzo.classList.add("zona-activa") al cruzar el borde'; // Evalúa condición
            if (arrowLabel) arrowLabel.textContent = "¿Sale sin comprar?"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🚪"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Salir del Local (Evento dragleave)"; // Evalúa condición
            if (subRight) subRight.textContent = "Das Marcha Atrás sin Soltar el Objeto"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Decides salirte de los límites de la tienda sin dejar el paquete</div>
                <div class="ws-item highlight-item">La campana deja de sonar y la tienda apaga las luces de resaltado</div>
            `;
            if (statusRight) statusRight.textContent = 'lienzo.classList.remove("zona-activa") al abandonar la zona'; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🚪"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>El Tapete de Bienvenida (dragenter y dragleave):</strong> <code>dragenter</code> ilumina la zona receptora cuando el cursor entra, y <code>dragleave</code> restaura el diseño original si el usuario sale sin soltar el objeto."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
