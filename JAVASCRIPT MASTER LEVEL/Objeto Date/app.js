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
    // Caso actualmente seleccionado en el comparador Trampas vs Moderno (Slide 4)
    activeScenario: "diaSemana",
    // Estado del reloj astronómico en la analogía (Slide 8: 'snapshot' o 'wheels')
    activeClockState: "snapshot"
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
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-date-1"); // Ejecuta llamada o método
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
                if (arg instanceof Date) { // Evalúa condición
                    return arg.toString(); // Retorna resultado
                }
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

    // Vincula todos los escuchadores de eventos
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

        // Slide 2: Capturar Fecha y Hora Actual en Vivo
        const btnTestDateIntro = document.getElementById("btnTestDateIntro"); // Obtiene referencia DOM para "btnTestDateIntro"
        const statusDateIntro = document.getElementById("testDateIntroStatus"); // Obtiene referencia DOM para "statusDateIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        if (btnTestDateIntro && consoleOutput1) { // Evalúa condición
            btnTestDateIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const ahora = new Date(); // Declara e inicializa "ahora"
                const dia = ahora.getDate(); // Declara e inicializa "dia"
                const mes = ahora.getMonth() + 1; // Declara e inicializa "mes"
                const anio = ahora.getFullYear(); // Declara e inicializa "anio"
                const h = String(ahora.getHours()).padStart(2, "0"); // Declara e inicializa "h"
                const m = String(ahora.getMinutes()).padStart(2, "0"); // Declara e inicializa "m"
                const s = String(ahora.getSeconds()).padStart(2, "0"); // Declara e inicializa "s"

                if (statusDateIntro) statusDateIntro.textContent = "Instanciado con éxito"; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const fechaActual = new Date(); // Epoch: ${ahora.getTime()} ms</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; Fecha: ${dia}/${mes}/${anio} - Hora: ${h}:${m}:${s}</div>
                `;
                this.showToast("Marca temporal capturada en vivo"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Extraer los 7 Métodos Getters en Tiempo Real
        const btnCheckAllGetters = document.getElementById("btnCheckAllGetters"); // Obtiene referencia DOM para "btnCheckAllGetters"
        const allGettersResult = document.getElementById("allGettersResult"); // Obtiene referencia DOM para "allGettersResult"
        if (btnCheckAllGetters && allGettersResult) { // Evalúa condición
            btnCheckAllGetters.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const d = new Date(); // Declara e inicializa "d"
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
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareDateModes = document.getElementById("btnCompareDateModes"); // Obtiene referencia DOM para "btnCompareDateModes"
        if (btnCompareDateModes) { // Evalúa condición
            btnCompareDateModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de Flujo de Extracción y Formateo
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

        // Slide 5.1: Botón Árbol Completo de Extracción
        const btnTestExtractionTree = document.getElementById("btnTestExtractionTree"); // Obtiene referencia DOM para "btnTestExtractionTree"
        const extractionTreeResult = document.getElementById("extractionTreeResult"); // Obtiene referencia DOM para "extractionTreeResult"
        if (btnTestExtractionTree && extractionTreeResult) { // Evalúa condición
            btnTestExtractionTree.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const d = new Date(); // Declara e inicializa "d"
                extractionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">📅 Calendario:</span> <code>getDate()=${d.getDate()} | getMonth()=${d.getMonth()} | getFullYear()=${d.getFullYear()}</code><br>
                    <span style="color: var(--emerald);">📆 Semana:</span> <code>getDay()=${d.getDay()}</code> &nbsp;|&nbsp;
                    <span style="color: var(--amber);">⌚ Reloj 24h:</span> <code>${d.getHours()}h : ${d.getMinutes()}m : ${d.getSeconds()}s</code>
                `;
            });
        }

        // Slide 5.2: Botón padStart(2, "0")
        const btnTestPadStart = document.getElementById("btnTestPadStart"); // Obtiene referencia DOM para "btnTestPadStart"
        const padStartResult = document.getElementById("padStartResult"); // Obtiene referencia DOM para "padStartResult"
        if (btnTestPadStart && padStartResult) { // Evalúa condición
            btnTestPadStart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                padStartResult.innerHTML = `
                    <span style="color: var(--amber);">⚠️ Sin padStart:</span> <code>"8:5:9"</code> (Difícil de leer y desalineado)<br>
                    <span style="color: var(--emerald);">✅ Con .padStart(2, "0"):</span> <code>"08:05:09"</code> (Estándar profesional HH:MM:SS)
                `;
            });
        }

        // Slide 5.3: Botón Arrays Indexados en Cero
        const btnTestArrayNames = document.getElementById("btnTestArrayNames"); // Obtiene referencia DOM para "btnTestArrayNames"
        const arrayNamesResult = document.getElementById("arrayNamesResult"); // Obtiene referencia DOM para "arrayNamesResult"
        if (btnTestArrayNames && arrayNamesResult) { // Evalúa condición
            btnTestArrayNames.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const d = new Date(); // Declara e inicializa "d"
                const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]; // Declara e inicializa "dias"
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; // Declara e inicializa "meses"
                arrayNamesResult.innerHTML = `
                    <code>dias[${d.getDay()}] ➔ "${dias[d.getDay()]}"</code> |
                    <code>meses[${d.getMonth()}] ➔ "${meses[d.getMonth()]}"</code><br>
                    <small style="color: var(--emerald);">Los índices 0-6 y 0-11 encajan de forma directa sin sumar ni restar nada.</small>
                `;
            });
        }

        // Slide 7: Obtener Día de la Semana en Vivo
        const btnTestDayArray = document.getElementById("btnTestDayArray"); // Obtiene referencia DOM para "btnTestDayArray"
        const dayArrayResult = document.getElementById("dayArrayResult"); // Obtiene referencia DOM para "dayArrayResult"
        if (btnTestDayArray && dayArrayResult) { // Evalúa condición
            btnTestDayArray.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]; // Declara e inicializa "dias"
                const hoy = new Date(); // Declara e inicializa "hoy"
                dayArrayResult.innerHTML = `
                    <code>hoy.getDay() ➔ ${hoy.getDay()} ➔ "${dias[hoy.getDay()]}"</code><br>
                    <small style="color: var(--emerald);">El arreglo comienza con "Domingo" en la posición [0].</small>
                `;
            });
        }

        // Slide 7: Generar Marca de Reloj Digital HH:MM:SS
        const btnTestDigitalClock = document.getElementById("btnTestDigitalClock"); // Obtiene referencia DOM para "btnTestDigitalClock"
        const digitalClockResult = document.getElementById("digitalClockResult"); // Obtiene referencia DOM para "digitalClockResult"
        if (btnTestDigitalClock && digitalClockResult) { // Evalúa condición
            btnTestDigitalClock.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const d = new Date(); // Declara e inicializa "d"
                const h = String(d.getHours()).padStart(2, "0"); // Declara e inicializa "h"
                const m = String(d.getMinutes()).padStart(2, "0"); // Declara e inicializa "m"
                const s = String(d.getSeconds()).padStart(2, "0"); // Declara e inicializa "s"
                digitalClockResult.innerHTML = `
                    <code>relojDigital() ➔ "${h}:${m}:${s}"</code><br>
                    <small style="color: var(--cyan);">Pulsa varias veces para ver avanzar el segundero formateado a 2 dígitos.</small>
                `;
            });
        }

        // Slide 8: Metáfora del Reloj Astronómico de Pared
        const clockBtns = document.querySelectorAll("[data-clock]"); // Obtiene referencia DOM para "clockBtns"
        clockBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                clockBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeClockState = btn.getAttribute("data-clock"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                this.updateClockView(AppState.activeClockState); // Ejecuta llamada o método
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-date-1"; // Declara e inicializa "currentPreset"
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
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre Trampas y Estándar Moderno en el Slide 4
    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalTraps = document.getElementById("terminalTraps"); // Obtiene referencia DOM para "terminalTraps"
        const terminalModern = document.getElementById("terminalModern"); // Obtiene referencia DOM para "terminalModern"
        const feedbackText = document.getElementById("dateFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalTraps || !terminalModern) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "diaSemana") { // Evalúa condición
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; const dia = fecha.getDays();</div>
                <div class="term-line" style="color: var(--rose);">&gt; ❌ Uncaught TypeError: fecha.getDays is not a function</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const diaSemana = fecha.getDay(); // En singular</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Devuelve 0 (Domingo) a 6 (Sábado) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getDays() vs. getDay():</strong> En apuntes suele escribirse con 's' al final por error, pero en JavaScript oficial es singular: <code>getDay()</code>."; // Evalúa condición
        } else if (scenarioKey === "anio") { // Instrucción JavaScript
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; const anio = new Date("2026-10-29").getYear();</div>
                <div class="term-line" style="color: var(--rose);">&gt; // Devuelve: 126 (Porque calcula 2026 - 1900) ⚠️</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const anio = new Date("2026-10-29").getFullYear();</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Devuelve: 2026 (Año completo de 4 dígitos) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getYear() vs. getFullYear():</strong> <code>getYear()</code> está desaprobado por el Efecto Y2K; usa siempre <code>getFullYear()</code>."; // Evalúa condición
        } else if (scenarioKey === "mes") { // Instrucción JavaScript
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; // Fecha: 29 de Octubre de 2026</div>
                <div class="term-line" style="color: var(--rose);">&gt; fecha.getMonth(); ➔ Devuelve 9 (Parece Septiembre) ⚠️</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; // Ajustado para lectura humana (1 a 12):</div>
                <div class="term-line" style="color: var(--cyan);">&gt; fecha.getMonth() + 1; ➔ Devuelve 10 (Octubre) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Indexación del Mes:</strong> Como Enero es el mes <code>0</code>, recuerda sumar <code>+ 1</code> cuando armes cadenas numéricas como <code>DD/MM/YYYY</code>."; // Evalúa condición
        } else if (scenarioKey === "diaMes") { // Instrucción JavaScript
            terminalTraps.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; // Queriendo mostrar "29 de octubre":</div>
                <div class="term-line" style="color: var(--rose);">&gt; fecha.getDay(); ➔ Devuelve 4 (Día de la semana, no del mes) ❌</div>
            `;
            terminalModern.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; // Método correcto para el número del calendario (1-31):</div>
                <div class="term-line" style="color: var(--cyan);">&gt; fecha.getDate(); ➔ Devuelve 29 ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>getDate() vs. getDay():</strong> Usa <code>getDate()</code> para el número del mes (1-31) y <code>getDay()</code> para el día de la semana (0-6)."; // Evalúa condición
        }
    }

    // Actualiza la visualización de la analogía del Reloj Astronómico en el Slide 8
    static updateClockView(clockState) { // Instrucción JavaScript
        const titleRight = document.getElementById("clockTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("clockSubRight"); // Obtiene referencia DOM para "subRight"
        const avatarRight = document.getElementById("clockAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const itemsRight = document.getElementById("clockItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("clockStatusRight"); // Obtiene referencia DOM para "statusRight"
        const bannerText = document.getElementById("clockBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("clockBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        const itemsLeft = document.getElementById("clockItemsLeft"); // Obtiene referencia DOM para "itemsLeft"
        const statusLeft = document.getElementById("clockStatusLeft"); // Obtiene referencia DOM para "statusLeft"

        if (clockState === "snapshot") { // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Al hacer const foto = new Date(), tomas una foto del reloj</div>
                <div class="ws-item">Las agujas dentro de esa variable quedan fijas en ese instante</div>
            `;
            if (statusLeft) statusLeft.textContent = "Para saber la hora 5 segundos después, debes tomar una nueva foto"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🕰️"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Mirar las Agujas en la Foto"; // Evalúa condición
            if (subRight) subRight.textContent = "getHours(), getMinutes() y getSeconds()"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Llamar a getHours() es observar dónde quedó la aguja de las horas</div>
                <div class="ws-item highlight-item">Llamar a getMinutes() o getSeconds() lee el minutero y segundero</div>
            `;
            if (statusRight) statusRight.textContent = "Lectura directa e instantánea sin alterar la fotografía original"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "📸"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>La Fotografía Instantánea:</strong> <code>new Date()</code> captura y congela las agujas del reloj en el milisegundo exacto en que fue invocado."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El reloj tiene dos rueditas mecánicas para Mes y Día de Semana</div>
                <div class="ws-item">Ambas rueditas fueron fabricadas empezando desde el número 0</div>
            `;
            if (statusLeft) statusLeft.textContent = "Posición 0 = Enero (en meses) y Posición 0 = Domingo (en semana)"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "⚙️"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Rueditas Indexadas en Cero"; // Evalúa condición
            if (subRight) subRight.textContent = "getMonth() (0-11) y getDay() (0-6)"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">getMonth() lee la ruedita de meses (0 = Enero ... 11 = Diciembre)</div>
                <div class="ws-item highlight-item">getDay() lee la ruedita semanal (0 = Domingo ... 6 = Sábado)</div>
            `;
            if (statusRight) statusRight.textContent = "Mientras tanto, la ventanilla getDate() sí cuenta del 1 al 31"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "⚙️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Las Rueditas en Cero:</strong> Tanto <code>getMonth()</code> como <code>getDay()</code> arrancan en la posición <code>0</code>, encajando directo con los índices de un Array."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
