/**
 * ==============================================================================
 * 📍 JAVASCRIPT MASTER LEVEL: GEOLOCATION API
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, rastreador de satélites en vivo,
 *            laboratorio de simulación de errores y playground interactivo.
 * Documentación pedagógica línea por línea para fines de estudio y aprendizaje.
 * ==============================================================================
 */

// Activamos el modo estricto para garantizar ejecución segura y sin errores silenciosos
"use strict"; // Activa el modo estricto de JavaScript

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const AppState = { // Declara e inicializa "AppState"
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación (10 diapositivas)
    totalSlides: 11,
    // Booleano: true para modo diapositivas (slides), false para modo documento continuo
    isPresentationMode: true,
    // Booleano: true si los efectos de sonido sintetizados están activos
    soundEnabled: true,
    // Instancia de AudioContext para la síntesis de sonido en el navegador
    audioCtx: null,
    // Escenario seleccionado en el comparador de errores (Slide 4)
    activeScenario: "denied",
    // Estado de la analogía seleccionada en el Slide 8 ('gps' o 'foto')
    activeOfficeState: "gps"
};

// --- MÓDULO DE EFECTOS DE SONIDO SINTETIZADOS (Web Audio API) ---
class SoundEffects { // Define clase
    static init() { // Instrucción JavaScript
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Asigna valor
        }
    }

    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) { // Instrucción JavaScript
        if (!AppState.soundEnabled) return; // Evalúa condición
        try { // Inicia bloque protegido contra errores
            this.init(); // Ejecuta llamada o método
            if (!AppState.audioCtx) return; // Evalúa condición
            if (AppState.audioCtx.state === "suspended") { // Evalúa condición
                AppState.audioCtx.resume(); // Ejecuta llamada o método
            }
            const osc = AppState.audioCtx.createOscillator(); // Declara e inicializa "osc"
            const gain = AppState.audioCtx.createGain(); // Declara e inicializa "gain"

            osc.type = type; // Asigna valor
            osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime); // Ejecuta llamada o método
            gain.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime); // Ejecuta llamada o método
            gain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + duration); // Ejecuta llamada o método

            osc.connect(gain); // Ejecuta llamada o método
            gain.connect(AppState.audioCtx.destination); // Ejecuta llamada o método
            osc.start(); // Ejecuta llamada o método
            osc.stop(AppState.audioCtx.currentTime + duration); // Ejecuta llamada o método
        } catch (e) { // Instrucción JavaScript
            // Manejo silencioso de autoplay policies
        }
    }

    static click() { // Instrucción JavaScript
        this.playTone(600, "triangle", 0.04, 0.03); // Ejecuta llamada o método
    }

    static success() { // Instrucción JavaScript
        this.playTone(523.25, "sine", 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, "sine", 0.18, 0.06), 160); // G5
    }

    static transition() { // Instrucción JavaScript
        this.playTone(320, "sine", 0.06, 0.03); // Ejecuta llamada o método
        setTimeout(() => this.playTone(480, "sine", 0.08, 0.03), 40); // Ejecuta llamada o método
    }

    static error() { // Instrucción JavaScript
        this.playTone(280, "sawtooth", 0.15, 0.04); // Ejecuta llamada o método
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
const CodePresets = { // Declara e inicializa "CodePresets"
    // Preset 1: Código Base de getCurrentPosition()
    "preset-geo-1": `// ==========================================
// 1. CÓDIGO BASE DE GEOLOCALIZACIÓN
// ==========================================
"use strict";

const geolocation = navigator.geolocation;

// Callback de éxito
const posicion = (pos) => {
    console.log("Objeto position completo:", pos);
    console.log("Coordenadas recibidas:", pos.coords);
};

// Callback de error
const err = (error) => {
    console.warn("Error al geolocalizar:", error.message);
};

// Opciones
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

console.log("Consultando geolocalización...");
geolocation.getCurrentPosition(posicion, err, options);`,

    // Preset 2: Extracción y Formato de coords
    "preset-geo-2": `// ==========================================
// 2. EXTRACCIÓN Y FORMATO DE COORDENADAS
// ==========================================
"use strict";

const onSuccess = (position) => {
    // Desestructuración limpia de coords y timestamp
    const { latitude, longitude, accuracy, altitude } = position.coords;
    const fechaLectura = new Date(position.timestamp).toLocaleTimeString();

    console.log("--- DATOS DE POSICIÓN ---");
    console.log("Latitud      :", latitude.toFixed(6) + "°");
    console.log("Longitud     :", longitude.toFixed(6) + "°");
    console.log("Precisión    : ±" + Math.round(accuracy) + " metros");
    console.log("Altitud      :", altitude !== null ? altitude + " m" : "No disponible");
    console.log("Hora lectura :", fechaLectura);
};

navigator.geolocation.getCurrentPosition(onSuccess, err => console.error(err.message));`,

    // Preset 3: Manejo Completo de Errores con switch(error.code)
    "preset-geo-3": `// ==========================================
// 3. GESTIÓN PROFESIONAL DE ERRORES
// ==========================================
"use strict";

const onError = (error) => {
    console.warn("Código numérico de error:", error.code);

    switch (error.code) {
        case error.PERMISSION_DENIED: // Código 1
            console.error("❌ PERMISSION_DENIED: El usuario denegó el acceso.");
            console.log("💡 Consejo: Muestra un mensaje guiando al usuario a activar permisos en el candado de la URL.");
            break;

        case error.POSITION_UNAVAILABLE: // Código 2
            console.error("❌ POSITION_UNAVAILABLE: No se pudo triangular la posición.");
            console.log("💡 Consejo: Comprueba si el dispositivo tiene señal de satélite o Wi-Fi.");
            break;

        case error.TIMEOUT: // Código 3
            console.error("❌ TIMEOUT: Se agotó el tiempo máximo de espera.");
            console.log("💡 Consejo: Intenta de nuevo o aumenta el valor de 'options.timeout'.");
            break;

        default:
            console.error("❌ Error desconocido:", error.message);
            break;
    }
};

navigator.geolocation.getCurrentPosition(pos => console.log("OK:", pos.coords), onError);`,

    // Preset 4: Calibrando Hardware con options
    "preset-geo-4": `// ==========================================
// 4. CONFIGURACIÓN TÉCNICA DEL OBJETO options
// ==========================================
"use strict";

const opcionesGPS = {
    // 1. enableHighAccuracy: Solicita GPS satelital en lugar de solo Wi-Fi/IP
    enableHighAccuracy: true,

    // 2. timeout: Espera como máximo 6 segundos antes de disparar error
    timeout: 6000,

    // 3. maximumAge: 0 fuerza una lectura fresca sin usar caché previa
    maximumAge: 0
};

console.log("Configuración aplicada:", opcionesGPS);

navigator.geolocation.getCurrentPosition(
    ({ coords }) => console.log("Precisión obtenida: ±" + coords.accuracy + " metros"),
    err => console.error(err.message),
    opcionesGPS
);`,

    // Preset 5: Typo enableHightAccuracy vs enableHighAccuracy
    "preset-geo-5": `// ==========================================
// 5. EVITANDO EL ERROR COMÚN DE TYPO
// ==========================================
"use strict";

// ❌ ERROR TÍPICO: Escribir con 't' intermedia ("enableHightAccuracy")
const opcionesErroneas = {
    enableHightAccuracy: true // El navegador lo ignora silenciosamente -> usa false
};

// ✅ FORMA CORRECTA: Termina en "-gh" ("enableHighAccuracy")
const opcionesCorrectas = {
    enableHighAccuracy: true // Activa correctamente el chip GPS
};

console.log("¿Existe 'enableHighAccuracy' en opcionesCorrectas?:", "enableHighAccuracy" in opcionesCorrectas);
console.log("¿Existe typo en opcionesErroneas?:", "enableHightAccuracy" in opcionesErroneas, "❌ (Ignorado)");`,

    // Preset 6: Rastreador con Enlace a OpenStreetMap
    "preset-geo-6": `// ==========================================
// 6. RASTREADOR CON ENLACE A MAPA OPENSTREETMAP
// ==========================================
"use strict";

navigator.geolocation.getCurrentPosition(
    ({ coords, timestamp }) => {
        const { latitude, longitude, accuracy } = coords;
        const osmUrl = \`https://www.openstreetmap.org/?mlat=\${latitude}&mlon=\${longitude}#map=16/\${latitude}/\${longitude}\`;

        console.log("✅ Coordenadas capturadas con éxito:");
        console.log("Latitud   :", latitude);
        console.log("Longitud  :", longitude);
        console.log("Precisión : ±" + Math.round(accuracy) + " m");
        console.log("🗺️ Enlace al mapa:", osmUrl);
    },
    (err) => console.error("Error al obtener posición:", err.message),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
);`,

    // Retos del Temario
    "preset-ex-geo1": `// RETO NIVEL 1 (Junior): Consulta Simple de Coordenadas
"use strict";

navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude, accuracy } = pos.coords;
    console.log("Latitud   :", latitude);
    console.log("Longitud  :", longitude);
    console.log("Precisión : ±" + accuracy + " metros");
});`,

    "preset-ex-geo2": `// RETO NIVEL 2 (Semi-Senior): Gestor de Errores con switch(error.code)
"use strict";

const onError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("Permiso denegado por el usuario.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Ubicación física no disponible.");
            break;
        case error.TIMEOUT:
            console.error("Se agotó el tiempo de espera.");
            break;
    }
};

navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords), onError);`,

    "preset-ex-geo3": `// RETO NIVEL 3 (Producción): Calibrador con Objeto options y Enlace
"use strict";

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
        const url = \`https://www.openstreetmap.org/#map=16/\${coords.latitude}/\${coords.longitude}\`;
        console.log("Enlace generado:", url);
    },
    (err) => console.warn(err.message),
    options
);`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.bindGeoLiveDemos(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-geo-1"); // Ejecuta llamada o método
    }

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

        const slideIndicator = document.getElementById("slideIndicator"); // Obtiene referencia DOM para "slideIndicator"
        if (slideIndicator) { // Evalúa condición
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
        }

        const progressBar = document.getElementById("progressBar"); // Obtiene referencia DOM para "progressBar"
        if (progressBar) { // Evalúa condición
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa "pct"
            progressBar.style.width = `${pct}%`; // Asigna valor
        }

        const dots = document.querySelectorAll(".slide-dot"); // Obtiene referencia DOM para "dots"
        dots.forEach((dot, idx) => { // Instrucción JavaScript
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición
                dot.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                dot.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        const ovCards = document.querySelectorAll(".overview-card"); // Obtiene referencia DOM para "ovCards"
        ovCards.forEach((card, idx) => { // Instrucción JavaScript
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición
                card.classList.add("active"); // Modifica clases CSS del elemento
            } else { // Instrucción JavaScript
                card.classList.remove("active"); // Modifica clases CSS del elemento
            }
        });

        window.scrollTo({ top: 0, behavior: "smooth" }); // Ejecuta llamada o método
    }

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

    static openOverview() { // Instrucción JavaScript
        const modal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "modal"
        if (modal) { // Evalúa condición
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
        if (!document.fullscreenElement) { // Evalúa condición
            document.documentElement.requestFullscreen().catch(() => {}); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            if (document.exitFullscreen) { // Evalúa condición
                document.exitFullscreen(); // Ejecuta llamada o método
            }
        }
    }

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

    static runPlaygroundCode() { // Instrucción JavaScript
        const textarea = document.getElementById("liveCodeEditor"); // Obtiene referencia DOM para "textarea"
        const logsContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia DOM para "logsContainer"
        if (!textarea || !logsContainer) return; // Evalúa condición

        const codeToRun = textarea.value; // Declara e inicializa "codeToRun"
        logsContainer.innerHTML = ""; // Actualiza contenido en el DOM

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

        const originalLog = console.log; // Declara e inicializa "originalLog"
        const originalError = console.error; // Declara e inicializa "originalError"
        const originalWarn = console.warn; // Declara e inicializa "originalWarn"
        const originalInfo = console.info; // Declara e inicializa "originalInfo"

        try { // Inicia bloque protegido contra errores
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

            const runFn = new Function(codeToRun); // Declara e inicializa "runFn"
            runFn(); // Ejecuta llamada o método

            SoundEffects.success(); // Ejecuta llamada o método
            AppController.showToast("Código ejecutado"); // Ejecuta llamada o método
        } catch (err) { // Instrucción JavaScript
            console.error("Excepción:", err.name, "-", err.message); // Imprime salida en consola
            SoundEffects.error(); // Ejecuta llamada o método
            AppController.showToast("Error al ejecutar código", true); // Ejecuta llamada o método
        } finally { // Instrucción JavaScript
            console.log = originalLog; // Imprime salida en consola
            console.error = originalError; // Imprime salida en consola
            console.warn = originalWarn; // Imprime salida en consola
            console.info = originalInfo; // Imprime salida en consola
        }
    }

    // Vincula las demostraciones interactivas de geolocalización (Slide 2 y Slide 7)
    static bindGeoLiveDemos() { // Instrucción JavaScript
        // Slide 2: Consulta en vivo (getCurrentPosition y watchPosition)
        const btnTestGeoLive = document.getElementById("btnTestGeoLive"); // Obtiene referencia DOM para "btnTestGeoLive"
        const btnTestWatchLive = document.getElementById("btnTestWatchLive"); // Obtiene referencia DOM para "btnTestWatchLive"
        const btnStopWatchLive = document.getElementById("btnStopWatchLive"); // Obtiene referencia DOM para "btnStopWatchLive"
        const statusBanner = document.getElementById("geoLiveStatusBanner"); // Obtiene referencia DOM para "statusBanner"
        const statusText = document.getElementById("geoLiveStatusText"); // Obtiene referencia DOM para "statusText"
        const metricLat = document.getElementById("metricLat"); // Obtiene referencia DOM para "metricLat"
        const metricLng = document.getElementById("metricLng"); // Obtiene referencia DOM para "metricLng"
        const metricAcc = document.getElementById("metricAcc"); // Obtiene referencia DOM para "metricAcc"
        const testStatus = document.getElementById("testGeoLiveStatus"); // Obtiene referencia DOM para "testStatus"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"

        let liveWatchId = null; // Declara e inicializa "liveWatchId"
        let liveWatchTick = 0; // Declara e inicializa "liveWatchTick"

        if (btnTestWatchLive) { // Evalúa condición
            btnTestWatchLive.addEventListener("click", () => { // Registra escuchador de eventos
                if (!navigator.geolocation) { // Evalúa condición
                    SoundEffects.error(); // Ejecuta llamada o método
                    AppController.showToast("Geolocalización no compatible", true); // Ejecuta llamada o método
                    return; // Retorna resultado
                }

                SoundEffects.click(); // Ejecuta llamada o método
                liveWatchTick = 0; // Asigna valor
                btnTestWatchLive.style.display = "none"; // Asigna valor
                if (btnStopWatchLive) btnStopWatchLive.style.display = "inline-flex"; // Evalúa condición

                if (statusBanner) { // Evalúa condición
                    statusBanner.className = "geo-status-banner warning"; // Asigna valor
                    statusText.textContent = "📡 watchPosition() activo: esperando cambios..."; // Actualiza contenido en el DOM
                }
                if (testStatus) testStatus.textContent = "Rastreando en tiempo real"; // Evalúa condición

                liveWatchId = navigator.geolocation.watchPosition(
                    (pos) => { // Instrucción JavaScript
                        liveWatchTick++; // Instrucción JavaScript
                        SoundEffects.success(); // Ejecuta llamada o método
                        const { latitude, longitude, accuracy, speed } = pos.coords; // Declara e inicializa "variable"
                        if (statusBanner) { // Evalúa condición
                            statusBanner.className = "geo-status-banner success"; // Asigna valor
                            statusText.textContent = `📡 watchPosition() [Tick #${liveWatchTick}] actualizado`; // Actualiza contenido en el DOM
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`; // Evalúa condición
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`; // Evalúa condición
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`; // Evalúa condición

                        if (consoleOutput1) { // Evalúa condición
                            const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                            line.className = "term-line"; // Asigna valor
                            line.style.color = "var(--emerald)"; // Asigna valor
                            line.textContent = `> [watchPosition #${liveWatchId}] Tick #${liveWatchTick}: Lat ${latitude.toFixed(6)}°, Lng ${longitude.toFixed(6)}°, Margen ±${Math.round(accuracy)}m`; // Actualiza contenido en el DOM
                            consoleOutput1.appendChild(line); // Inserta nodo en el DOM
                            consoleOutput1.scrollTop = consoleOutput1.scrollHeight; // Asigna valor
                        }
                    },
                    (err) => { // Instrucción JavaScript
                        SoundEffects.error(); // Ejecuta llamada o método
                        if (statusBanner) { // Evalúa condición
                            statusBanner.className = "geo-status-banner error"; // Asigna valor
                            statusText.textContent = `Error en watch (${err.code}): ${err.message}`; // Actualiza contenido en el DOM
                        }
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                );

                AppController.showToast(`watchPosition iniciado (ID: #${liveWatchId})`); // Ejecuta llamada o método
            });
        }

        if (btnStopWatchLive) { // Evalúa condición
            btnStopWatchLive.addEventListener("click", () => { // Registra escuchador de eventos
                if (liveWatchId !== null) { // Evalúa condición
                    navigator.geolocation.clearWatch(liveWatchId); // Ejecuta llamada o método
                    SoundEffects.transition(); // Ejecuta llamada o método
                    if (statusBanner) { // Evalúa condición
                        statusBanner.className = "geo-status-banner"; // Asigna valor
                        statusText.textContent = `🛑 clearWatch(#${liveWatchId}) ejecutado. Rastreo detenido.`; // Actualiza contenido en el DOM
                    }
                    if (consoleOutput1) { // Evalúa condición
                        const line = document.createElement("div"); // Crea nuevo elemento DOM "line"
                        line.className = "term-line"; // Asigna valor
                        line.style.color = "var(--amber)"; // Asigna valor
                        line.textContent = `> navigator.geolocation.clearWatch(${liveWatchId}) ➔ Sensores GPS y batería liberados.`; // Actualiza contenido en el DOM
                        consoleOutput1.appendChild(line); // Inserta nodo en el DOM
                        consoleOutput1.scrollTop = consoleOutput1.scrollHeight; // Asigna valor
                    }
                    liveWatchId = null; // Asigna valor
                    btnStopWatchLive.style.display = "none"; // Asigna valor
                    if (btnTestWatchLive) btnTestWatchLive.style.display = "inline-flex"; // Evalúa condición
                    if (testStatus) testStatus.textContent = "Rastreo detenido"; // Evalúa condición
                    AppController.showToast("clearWatch() ejecutado"); // Ejecuta llamada o método
                }
            });
        }

        if (btnTestGeoLive) { // Evalúa condición
            btnTestGeoLive.addEventListener("click", () => { // Registra escuchador de eventos
                if (!navigator.geolocation) { // Evalúa condición
                    SoundEffects.error(); // Ejecuta llamada o método
                    if (statusBanner) { // Evalúa condición
                        statusBanner.className = "geo-status-banner error"; // Asigna valor
                        statusText.textContent = "Geolocalización no soportada en este entorno"; // Actualiza contenido en el DOM
                    }
                    return; // Retorna resultado
                }

                SoundEffects.click(); // Ejecuta llamada o método
                if (statusBanner) { // Evalúa condición
                    statusBanner.className = "geo-status-banner warning"; // Asigna valor
                    statusText.textContent = "Consultando sensores y satélites..."; // Actualiza contenido en el DOM
                }
                if (testStatus) testStatus.textContent = "Esperando respuesta..."; // Evalúa condición

                navigator.geolocation.getCurrentPosition(
                    (pos) => { // Instrucción JavaScript
                        SoundEffects.success(); // Ejecuta llamada o método
                        const { latitude, longitude, accuracy } = pos.coords; // Declara e inicializa "variable"
                        if (statusBanner) { // Evalúa condición
                            statusBanner.className = "geo-status-banner success"; // Asigna valor
                            statusText.textContent = "Posición obtenida con éxito ✅"; // Actualiza contenido en el DOM
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`; // Evalúa condición
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`; // Evalúa condición
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`; // Evalúa condición
                        if (testStatus) testStatus.textContent = "Lectura completada"; // Evalúa condición

                        if (consoleOutput1) { // Evalúa condición
                            consoleOutput1.innerHTML = `
                                <div class="term-line" style="color: var(--cyan);">&gt; navigator.geolocation.getCurrentPosition(success, error, options)</div>
                                <div class="term-line" style="color: var(--emerald);">&gt; Latitud: ${latitude.toFixed(6)}° | Longitud: ${longitude.toFixed(6)}°</div>
                                <div class="term-line" style="color: var(--amber);">&gt; Precisión: ±${Math.round(accuracy)} metros (95% confianza)</div>
                            `;
                        }
                        AppController.showToast("Ubicación real capturada con éxito"); // Ejecuta llamada o método
                    },
                    (err) => { // Instrucción JavaScript
                        SoundEffects.error(); // Ejecuta llamada o método
                        const errorTexts = { // Declara e inicializa "errorTexts"
                            1: "El usuario denegó el permiso de ubicación (PERMISSION_DENIED).",
                            2: "Posición no disponible en este momento (POSITION_UNAVAILABLE).",
                            3: "Tiempo límite de espera excedido (TIMEOUT)."
                        };
                        const msg = errorTexts[err.code] || err.message; // Declara e inicializa "msg"
                        if (statusBanner) { // Evalúa condición
                            statusBanner.className = "geo-status-banner error"; // Asigna valor
                            statusText.textContent = `Error (${err.code}): ${msg}`; // Actualiza contenido en el DOM
                        }
                        if (testStatus) testStatus.textContent = "Fallo en consulta"; // Evalúa condición

                        if (consoleOutput1) { // Evalúa condición
                            consoleOutput1.innerHTML = `
                                <div class="term-line" style="color: var(--rose);">&gt; Error de geolocalización (Código ${err.code}):</div>
                                <div class="term-line" style="color: var(--rose);">&gt; ${msg}</div>
                            `;
                        }
                        AppController.showToast("No se pudo obtener la ubicación", true); // Ejecuta llamada o método
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                );
            });
        }

        // Slide 7: Rastreador Completo
        const btnRunTrackerDemo = document.getElementById("btnRunTrackerDemo"); // Obtiene referencia DOM para "btnRunTrackerDemo"
        const trackerBanner = document.getElementById("trackerBanner"); // Obtiene referencia DOM para "trackerBanner"
        const trackerBannerText = document.getElementById("trackerBannerText"); // Obtiene referencia DOM para "trackerBannerText"
        const trackerLat = document.getElementById("trackerLat"); // Obtiene referencia DOM para "trackerLat"
        const trackerLng = document.getElementById("trackerLng"); // Obtiene referencia DOM para "trackerLng"
        const trackerAcc = document.getElementById("trackerAcc"); // Obtiene referencia DOM para "trackerAcc"
        const trackerMapLink = document.getElementById("trackerMapLink"); // Obtiene referencia DOM para "trackerMapLink"
        const trackerDemoResult = document.getElementById("trackerDemoResult"); // Obtiene referencia DOM para "trackerDemoResult"

        if (btnRunTrackerDemo) { // Evalúa condición
            btnRunTrackerDemo.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                if (trackerBanner) { // Evalúa condición
                    trackerBanner.className = "geo-status-banner warning"; // Asigna valor
                    trackerBannerText.textContent = "Conectando con hardware GPS..."; // Actualiza contenido en el DOM
                }

                const procesarExito = (lat, lng, acc) => { // Define función flecha "procesarExito"
                    SoundEffects.success(); // Ejecuta llamada o método
                    if (trackerBanner) { // Evalúa condición
                        trackerBanner.className = "geo-status-banner success"; // Asigna valor
                        trackerBannerText.textContent = "Coordenadas fijadas en mapa ✅"; // Actualiza contenido en el DOM
                    }
                    if (trackerLat) trackerLat.textContent = `${lat.toFixed(6)}°`; // Evalúa condición
                    if (trackerLng) trackerLng.textContent = `${lng.toFixed(6)}°`; // Evalúa condición
                    if (trackerAcc) trackerAcc.textContent = `±${Math.round(acc)} m`; // Evalúa condición

                    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
                    if (trackerMapLink) { // Evalúa condición
                        trackerMapLink.href = osmUrl; // Asigna valor
                        trackerMapLink.style.display = "inline-block"; // Asigna valor
                    }
                    if (trackerDemoResult) { // Evalúa condición
                        trackerDemoResult.innerHTML = `
                            <code>Lat: ${lat.toFixed(6)}° | Lng: ${lng.toFixed(6)}° | ±${Math.round(acc)}m</code><br>
                            <small style="color: var(--emerald);">Enlace generado: <a href="${osmUrl}" target="_blank" style="color: var(--cyan); text-decoration: underline;">Abrir en OpenStreetMap</a></small>
                        `;
                    }
                    AppController.showToast("Rastreador actualizado"); // Ejecuta llamada o método
                };

                if (navigator.geolocation) { // Evalúa condición
                    navigator.geolocation.getCurrentPosition(
                        (pos) => procesarExito(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
                        () => { // Instrucción JavaScript
                            // Si el usuario deniega o falla, aplicamos coordenadas de demostración pedagógica
                            procesarExito(40.416775, -3.703790, 8); // Madrid, España
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                    );
                } else { // Instrucción JavaScript
                    procesarExito(40.416775, -3.703790, 8); // Ejecuta llamada o método
                }
            });
        }
    }

    static bindEvents() { // Instrucción JavaScript
        const btnNext = document.getElementById("btnNextSlide"); // Obtiene referencia DOM para "btnNext"
        const btnPrev = document.getElementById("btnPrevSlide"); // Obtiene referencia DOM para "btnPrev"
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición

        const btnStart = document.getElementById("btnStartPresentation"); // Obtiene referencia DOM para "btnStart"
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2)); // Evalúa condición

        document.querySelectorAll("[data-jump]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const target = parseInt(btn.getAttribute("data-jump"), 10); // Declara e inicializa "target"
                this.goToSlide(target); // Ejecuta llamada o método
            });
        });

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

        const overviewModal = document.getElementById("overviewModal"); // Obtiene referencia DOM para "overviewModal"
        if (overviewModal) { // Evalúa condición
            overviewModal.addEventListener("click", (e) => { // Registra escuchador de eventos
                if (e.target === overviewModal) this.closeOverview(); // Evalúa condición
            });
        }

        window.addEventListener("keydown", (e) => { // Registra escuchador de eventos
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición
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

        // Slide 3: Inspeccionar Desestructuración de Coords
        const btnCheckCoordsExample = document.getElementById("btnCheckCoordsExample"); // Obtiene referencia DOM para "btnCheckCoordsExample"
        const coordsExampleResult = document.getElementById("coordsExampleResult"); // Obtiene referencia DOM para "coordsExampleResult"
        if (btnCheckCoordsExample && coordsExampleResult) { // Evalúa condición
            btnCheckCoordsExample.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                coordsExampleResult.innerHTML = `
                    <code>const { latitude, longitude, accuracy } = position.coords;</code><br>
                    <span style="color: var(--cyan);">Latitud:</span> 4.710989° | <span style="color: var(--cyan);">Longitud:</span> -74.072092° | <span style="color: var(--emerald);">Precisión:</span> ±12 m ✅
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de Error
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareErrorModes = document.getElementById("btnCompareErrorModes"); // Obtiene referencia DOM para "btnCompareErrorModes"
        if (btnCompareErrorModes) { // Evalúa condición
            btnCompareErrorModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de options
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

        // Slide 5.1: Botón enableHighAccuracy
        const btnTestHighAccuracy = document.getElementById("btnTestHighAccuracy"); // Obtiene referencia DOM para "btnTestHighAccuracy"
        const highAccuracyResult = document.getElementById("highAccuracyResult"); // Obtiene referencia DOM para "highAccuracyResult"
        if (btnTestHighAccuracy && highAccuracyResult) { // Evalúa condición
            btnTestHighAccuracy.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                highAccuracyResult.innerHTML = `
                    <span style="color: var(--amber);">enableHighAccuracy: false</span> ➔ Triangulación por Wi-Fi/IP (±100m a ±1km, 50ms, 0% batería extra)<br>
                    <span style="color: var(--emerald);">enableHighAccuracy: true</span>  ➔ Chip GPS activo (±3m a ±15m, mayor demora, consumo alto de batería) ✅
                `;
            });
        }

        // Slide 5.2: Botón timeout
        const btnTestTimeout = document.getElementById("btnTestTimeout"); // Obtiene referencia DOM para "btnTestTimeout"
        const timeoutResult = document.getElementById("timeoutResult"); // Obtiene referencia DOM para "timeoutResult"
        if (btnTestTimeout && timeoutResult) { // Evalúa condición
            btnTestTimeout.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                timeoutResult.innerHTML = `
                    <span style="color: var(--cyan);">timeout: 5000 (5 segundos):</span> Si el GPS no fija satélites antes de 5000ms, aborta y dispara <code>error.TIMEOUT</code>.<br>
                    <small style="color: var(--emerald);">Nota clave: El tiempo que el usuario tarda en aceptar el diálogo de permisos NO descuenta del timeout.</small>
                `;
            });
        }

        // Slide 5.3: Botón maximumAge
        const btnTestMaxAge = document.getElementById("btnTestMaxAge"); // Obtiene referencia DOM para "btnTestMaxAge"
        const maxAgeResult = document.getElementById("maxAgeResult"); // Obtiene referencia DOM para "maxAgeResult"
        if (btnTestMaxAge && maxAgeResult) { // Evalúa condición
            btnTestMaxAge.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                maxAgeResult.innerHTML = `
                    <span style="color: var(--amber);">maximumAge: 0:</span> Fuerza un nuevo cálculo satelital sin aceptar caché.<br>
                    <span style="color: var(--emerald);">maximumAge: 60000:</span> Si hay una lectura de hace menos de 1 minuto, la devuelve al instante (0ms de espera).
                `;
            });
        }

        // Slide 8: Selector de Analogías (Mensajero con Láser vs Foto con Vencimiento)
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

        // Slide 9: Playground
        const codePresetSelect = document.getElementById("codePresetSelect"); // Obtiene referencia DOM para "codePresetSelect"
        if (codePresetSelect) { // Evalúa condición
            codePresetSelect.addEventListener("change", (e) => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(e.target.value); // Ejecuta llamada o método
            });
        }

        const btnResetCode = document.getElementById("btnResetCode"); // Obtiene referencia DOM para "btnResetCode"
        if (btnResetCode) { // Evalúa condición
            btnResetCode.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-geo-1"; // Declara e inicializa "currentPreset"
                this.loadPlaygroundPreset(currentPreset); // Ejecuta llamada o método
                this.showToast("Código restaurado"); // Ejecuta llamada o método
            });
        }

        const btnRunEditorCode = document.getElementById("btnRunEditorCode"); // Obtiene referencia DOM para "btnRunEditorCode"
        if (btnRunEditorCode) { // Evalúa condición
            btnRunEditorCode.addEventListener("click", () => { // Registra escuchador de eventos
                this.runPlaygroundCode(); // Ejecuta llamada o método
            });
        }

        const btnClearConsole = document.getElementById("btnClearConsole"); // Obtiene referencia DOM para "btnClearConsole"
        const logsContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia DOM para "logsContainer"
        if (btnClearConsole && logsContainer) { // Evalúa condición
            btnClearConsole.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>'; // Actualiza contenido en el DOM
            });
        }

        // Slide 10: Retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa "presetKey"
                SoundEffects.transition(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(presetKey); // Ejecuta llamada o método
                this.goToSlide(9); // Ejecuta llamada o método
                this.showToast("Reto cargado en el Playground"); // Ejecuta llamada o método
            });
        });

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

        const btnRestart = document.getElementById("btnRestartPresentation"); // Obtiene referencia DOM para "btnRestart"
        if (btnRestart) { // Evalúa condición
            btnRestart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.transition(); // Ejecuta llamada o método
                this.goToSlide(1); // Ejecuta llamada o método
            });
        }

        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat"); // Obtiene referencia DOM para "btnCopySummaryCheat"
        if (btnCopySummaryCheat) { // Evalúa condición
            btnCopySummaryCheat.addEventListener("click", () => { // Registra escuchador de eventos
                const cheatText = `# GUÍA MAESTRA: GEOLOCATION API EN JAVASCRIPT

1. **Invocación Principal:**
   \`\`\`javascript
   navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
   \`\`\`

2. **Callback de Éxito (\`position\`):**
   - \`coords.latitude\`: Latitud decimal.
   - \`coords.longitude\`: Longitud decimal.
   - \`coords.accuracy\`: Margen de error en metros.
   - \`timestamp\`: Hora en milisegundos.

3. **Callback de Error (\`error.code\`):**
   - \`1 (PERMISSION_DENIED)\`: El usuario rechazó el permiso.
   - \`2 (POSITION_UNAVAILABLE)\`: No se pudo triangular.
   - \`3 (TIMEOUT)\`: Tiempo de espera excedido.

4. **Objeto \`options\`:**
   - \`enableHighAccuracy: true\` (Activa GPS satelital).
   - \`timeout: 5000\` (Límite en ms).
   - \`maximumAge: 0\` (Forzar lectura en tiempo real).
`;
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalImplicit = document.getElementById("terminalImplicit"); // Obtiene referencia DOM para "terminalImplicit"
        const terminalSerialized = document.getElementById("terminalSerialized"); // Obtiene referencia DOM para "terminalSerialized"
        const feedbackText = document.getElementById("storageFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalImplicit || !terminalSerialized) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "denied") { // Evalúa condición
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Diálogo: "¿Permitir conocer tu ubicación?" ➔ El usuario pulsa "Bloquear"</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 1 (PERMISSION_DENIED) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; if (error.code === error.PERMISSION_DENIED) {</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   mostrarAlerta("Permiso denegado. Actívalo en el candado del navegador.");</div>
                <div class="term-line" style="color: var(--emerald);">&gt; }</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>PERMISSION_DENIED (1):</strong> Ocurre cuando el usuario cancela o bloquea los permisos. Siempre debes mostrar una guía visual para que sepa cómo desbloquearlo."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "unavailable") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Dispositivo en un sótano / sin Wi-Fi / sin satélites GPS visibles</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 2 (POSITION_UNAVAILABLE) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; case error.POSITION_UNAVAILABLE:</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   solicitarIngresoManualDeDireccion(); // Plan de contingencia</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>POSITION_UNAVAILABLE (2):</strong> Falla física de triangulación. La buena práctica es ofrecer al usuario la opción de escribir su ciudad o dirección manualmente."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "timeout") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; options = { timeout: 3000 }; El GPS tarda 4 segundos en fijar satélites</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 3 (TIMEOUT) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; case error.TIMEOUT:</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   reintentarConMenorPrecision(); // Reintentar con enableHighAccuracy: false</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>TIMEOUT (3):</strong> Se agotó el tiempo configurado. Puedes reintentar la llamada aumentando el tiempo o desactivando <code>enableHighAccuracy</code>."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "inseguro") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Web servida en http://misitio.com (HTTP plano sin SSL)</div>
                <div class="term-line" style="color: var(--rose);">&gt; TypeError / Bloqueo nativo: navigator.geolocation no está disponible 🚫</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Servir la aplicación bajo https:// o en entorno local (http://localhost)</div>
                <div class="term-line" style="color: var(--cyan);">&gt; navigator.geolocation habilitado con protección criptográfica SSL ✅</div>
            `;
            if (feedbackText) { // Evalúa condición
                feedbackText.innerHTML = "<strong>Contexto Seguro Obligatorio:</strong> La API de Geolocalización está prohibida en HTTP inseguro para evitar que atacantes intercepten la posición física del usuario."; // Actualiza contenido en el DOM
            }
        }
    }

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

        if (officeState === "gps") { // Evalúa condición
            if (avatarLeft) avatarLeft.textContent = "🏙️"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "1. Modo Ligero (enableHighAccuracy: false)"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Pregunta el nombre del vecindario (Wi-Fi / IP)"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Responde casi instantáneamente en pocos milisegundos</div>
                <div class="ws-item">Ahorra 100% de batería al no encender el chip GPS</div>
            `;
            if (statusLeft) statusLeft.textContent = "Precisión moderada a nivel de vecindario o calle"; // Evalúa condición
            if (arrowLabel) arrowLabel.textContent = "Calibración"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🛰️"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Visor Láser Satelital (enableHighAccuracy: true)"; // Evalúa condición
            if (subRight) subRight.textContent = "Triangulación por Constelación GPS"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Ubica la puerta exacta de tu casa con margen métrico</div>
                <div class="ws-item highlight-item">Requiere esperar conexión con satélites y gasta más batería</div>
            `;
            if (statusRight) statusRight.textContent = "Precisión de alta fidelidad (±3 a ±10 metros)"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🛰️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>enableHighAccuracy:</strong> Usa <code>false</code> para catálogos locales o tiendas cercanas; activa <code>true</code> únicamente cuando desarrolles navegación por satélite, fitness o mapas paso a paso."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (avatarLeft) avatarLeft.textContent = "⏱️"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "1. El Mensaje con Límite de Espera (timeout)"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Esperas que un amigo te envíe su ubicación"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Si no responde en X segundos, asumes que no está disponible</div>
                <div class="ws-item">Evita que la aplicación quede congelada indefinidamente</div>
            `;
            if (statusLeft) statusLeft.textContent = "Dispara error.TIMEOUT si se supera el tiempo límite"; // Evalúa condición
            if (arrowLabel) arrowLabel.textContent = "¿Caché o Real?"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "📸"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. La Foto con Vencimiento (maximumAge)"; // Evalúa condición
            if (subRight) subRight.textContent = "¿Aceptar foto vieja o pedir una nueva en vivo?"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">maximumAge > 0: Acepta la última foto si tiene menos de X minutos</div>
                <div class="ws-item highlight-item">maximumAge: 0: Pide una foto fresca tomada en este segundo exacto</div>
            `;
            if (statusRight) statusRight.textContent = "Equilibrio entre inmediatez (caché) y frescura de datos"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "📸"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>timeout y maximumAge:</strong> Combina ambos parámetros para que tu app responda rápido sin quemar batería calculando posiciones innecesarias cuando ya tiene una lectura reciente."; // Actualiza contenido en el DOM
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
