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
const AppState = {
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
    static init() {
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) { // Evalúa condición lógica
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) {
        if (!AppState.soundEnabled) return; // Evalúa condición lógica
        try { // Inicia bloque protegido contra errores
            this.init();
            if (!AppState.audioCtx) return; // Evalúa condición lógica
            if (AppState.audioCtx.state === "suspended") { // Evalúa condición lógica
                AppState.audioCtx.resume();
            }
            const osc = AppState.audioCtx.createOscillator(); // Declara e inicializa variable local
            const gain = AppState.audioCtx.createGain(); // Declara e inicializa variable local

            osc.type = type;
            osc.frequency.setValueAtTime(freq, AppState.audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, AppState.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, AppState.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(AppState.audioCtx.destination);
            osc.start();
            osc.stop(AppState.audioCtx.currentTime + duration);
        } catch (e) {
            // Manejo silencioso de autoplay policies
        }
    }

    static click() {
        this.playTone(600, "triangle", 0.04, 0.03);
    }

    static success() {
        this.playTone(523.25, "sine", 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, "sine", 0.18, 0.06), 160); // G5
    }

    static transition() {
        this.playTone(320, "sine", 0.06, 0.03);
        setTimeout(() => this.playTone(480, "sine", 0.08, 0.03), 40);
    }

    static error() {
        this.playTone(280, "sawtooth", 0.15, 0.04);
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
const CodePresets = {
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
    static init() {
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.bindGeoLiveDemos();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-geo-1");
    }

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

        const slideIndicator = document.getElementById("slideIndicator"); // Declara e inicializa variable local
        if (slideIndicator) { // Evalúa condición lógica
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`; // Actualiza contenido en el DOM
        }

        const progressBar = document.getElementById("progressBar"); // Declara e inicializa variable local
        if (progressBar) { // Evalúa condición lógica
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100; // Declara e inicializa variable local
            progressBar.style.width = `${pct}%`;
        }

        const dots = document.querySelectorAll(".slide-dot"); // Declara e inicializa variable local
        dots.forEach((dot, idx) => {
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición lógica
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        const ovCards = document.querySelectorAll(".overview-card"); // Declara e inicializa variable local
        ovCards.forEach((card, idx) => {
            if (idx + 1 === AppState.currentSlide) { // Evalúa condición lógica
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

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

    static openOverview() {
        const modal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (modal) { // Evalúa condición lógica
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
        if (!document.fullscreenElement) { // Evalúa condición lógica
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) { // Evalúa condición lógica
                document.exitFullscreen();
            }
        }
    }

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

    static runPlaygroundCode() {
        const textarea = document.getElementById("liveCodeEditor"); // Declara e inicializa variable local
        const logsContainer = document.getElementById("consoleLogsContainer"); // Declara e inicializa variable local
        if (!textarea || !logsContainer) return; // Evalúa condición lógica

        const codeToRun = textarea.value; // Declara e inicializa variable local
        logsContainer.innerHTML = ""; // Actualiza contenido en el DOM

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

        const originalLog = console.log; // Declara e inicializa variable local
        const originalError = console.error; // Declara e inicializa variable local
        const originalWarn = console.warn; // Declara e inicializa variable local
        const originalInfo = console.info; // Declara e inicializa variable local

        try { // Inicia bloque protegido contra errores
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

            const runFn = new Function(codeToRun); // Declara e inicializa variable local
            runFn();

            SoundEffects.success();
            AppController.showToast("Código ejecutado");
        } catch (err) {
            console.error("Excepción:", err.name, "-", err.message); // Imprime salida en consola
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
        } finally {
            console.log = originalLog; // Imprime salida en consola
            console.error = originalError; // Imprime salida en consola
            console.warn = originalWarn; // Imprime salida en consola
            console.info = originalInfo; // Imprime salida en consola
        }
    }

    // Vincula las demostraciones interactivas de geolocalización (Slide 2 y Slide 7)
    static bindGeoLiveDemos() {
        // Slide 2: Consulta en vivo (getCurrentPosition y watchPosition)
        const btnTestGeoLive = document.getElementById("btnTestGeoLive"); // Declara e inicializa variable local
        const btnTestWatchLive = document.getElementById("btnTestWatchLive"); // Declara e inicializa variable local
        const btnStopWatchLive = document.getElementById("btnStopWatchLive"); // Declara e inicializa variable local
        const statusBanner = document.getElementById("geoLiveStatusBanner"); // Declara e inicializa variable local
        const statusText = document.getElementById("geoLiveStatusText"); // Declara e inicializa variable local
        const metricLat = document.getElementById("metricLat"); // Declara e inicializa variable local
        const metricLng = document.getElementById("metricLng"); // Declara e inicializa variable local
        const metricAcc = document.getElementById("metricAcc"); // Declara e inicializa variable local
        const testStatus = document.getElementById("testGeoLiveStatus"); // Declara e inicializa variable local
        const consoleOutput1 = document.getElementById("console-output-1"); // Declara e inicializa variable local

        let liveWatchId = null; // Declara e inicializa variable local
        let liveWatchTick = 0; // Declara e inicializa variable local

        if (btnTestWatchLive) { // Evalúa condición lógica
            btnTestWatchLive.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                if (!navigator.geolocation) { // Evalúa condición lógica
                    SoundEffects.error();
                    AppController.showToast("Geolocalización no compatible", true);
                    return; // Retorna el resultado de la función
                }

                SoundEffects.click();
                liveWatchTick = 0;
                btnTestWatchLive.style.display = "none";
                if (btnStopWatchLive) btnStopWatchLive.style.display = "inline-flex"; // Evalúa condición lógica

                if (statusBanner) { // Evalúa condición lógica
                    statusBanner.className = "geo-status-banner warning";
                    statusText.textContent = "📡 watchPosition() activo: esperando cambios..."; // Actualiza contenido en el DOM
                }
                if (testStatus) testStatus.textContent = "Rastreando en tiempo real"; // Evalúa condición lógica

                liveWatchId = navigator.geolocation.watchPosition(
                    (pos) => {
                        liveWatchTick++;
                        SoundEffects.success();
                        const { latitude, longitude, accuracy, speed } = pos.coords; // Declara e inicializa variable local
                        if (statusBanner) { // Evalúa condición lógica
                            statusBanner.className = "geo-status-banner success";
                            statusText.textContent = `📡 watchPosition() [Tick #${liveWatchTick}] actualizado`; // Actualiza contenido en el DOM
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`; // Evalúa condición lógica
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`; // Evalúa condición lógica
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`; // Evalúa condición lógica

                        if (consoleOutput1) { // Evalúa condición lógica
                            const line = document.createElement("div"); // Declara e inicializa variable local
                            line.className = "term-line";
                            line.style.color = "var(--emerald)";
                            line.textContent = `> [watchPosition #${liveWatchId}] Tick #${liveWatchTick}: Lat ${latitude.toFixed(6)}°, Lng ${longitude.toFixed(6)}°, Margen ±${Math.round(accuracy)}m`; // Actualiza contenido en el DOM
                            consoleOutput1.appendChild(line);
                            consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                        }
                    },
                    (err) => {
                        SoundEffects.error();
                        if (statusBanner) { // Evalúa condición lógica
                            statusBanner.className = "geo-status-banner error";
                            statusText.textContent = `Error en watch (${err.code}): ${err.message}`; // Actualiza contenido en el DOM
                        }
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                );

                AppController.showToast(`watchPosition iniciado (ID: #${liveWatchId})`);
            });
        }

        if (btnStopWatchLive) { // Evalúa condición lógica
            btnStopWatchLive.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                if (liveWatchId !== null) { // Evalúa condición lógica
                    navigator.geolocation.clearWatch(liveWatchId);
                    SoundEffects.transition();
                    if (statusBanner) { // Evalúa condición lógica
                        statusBanner.className = "geo-status-banner";
                        statusText.textContent = `🛑 clearWatch(#${liveWatchId}) ejecutado. Rastreo detenido.`; // Actualiza contenido en el DOM
                    }
                    if (consoleOutput1) { // Evalúa condición lógica
                        const line = document.createElement("div"); // Declara e inicializa variable local
                        line.className = "term-line";
                        line.style.color = "var(--amber)";
                        line.textContent = `> navigator.geolocation.clearWatch(${liveWatchId}) ➔ Sensores GPS y batería liberados.`; // Actualiza contenido en el DOM
                        consoleOutput1.appendChild(line);
                        consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                    }
                    liveWatchId = null;
                    btnStopWatchLive.style.display = "none";
                    if (btnTestWatchLive) btnTestWatchLive.style.display = "inline-flex"; // Evalúa condición lógica
                    if (testStatus) testStatus.textContent = "Rastreo detenido"; // Evalúa condición lógica
                    AppController.showToast("clearWatch() ejecutado");
                }
            });
        }

        if (btnTestGeoLive) { // Evalúa condición lógica
            btnTestGeoLive.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                if (!navigator.geolocation) { // Evalúa condición lógica
                    SoundEffects.error();
                    if (statusBanner) { // Evalúa condición lógica
                        statusBanner.className = "geo-status-banner error";
                        statusText.textContent = "Geolocalización no soportada en este entorno"; // Actualiza contenido en el DOM
                    }
                    return; // Retorna el resultado de la función
                }

                SoundEffects.click();
                if (statusBanner) { // Evalúa condición lógica
                    statusBanner.className = "geo-status-banner warning";
                    statusText.textContent = "Consultando sensores y satélites..."; // Actualiza contenido en el DOM
                }
                if (testStatus) testStatus.textContent = "Esperando respuesta..."; // Evalúa condición lógica

                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        SoundEffects.success();
                        const { latitude, longitude, accuracy } = pos.coords; // Declara e inicializa variable local
                        if (statusBanner) { // Evalúa condición lógica
                            statusBanner.className = "geo-status-banner success";
                            statusText.textContent = "Posición obtenida con éxito ✅"; // Actualiza contenido en el DOM
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`; // Evalúa condición lógica
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`; // Evalúa condición lógica
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`; // Evalúa condición lógica
                        if (testStatus) testStatus.textContent = "Lectura completada"; // Evalúa condición lógica

                        if (consoleOutput1) { // Evalúa condición lógica
                            consoleOutput1.innerHTML = `
                                <div class="term-line" style="color: var(--cyan);">&gt; navigator.geolocation.getCurrentPosition(success, error, options)</div>
                                <div class="term-line" style="color: var(--emerald);">&gt; Latitud: ${latitude.toFixed(6)}° | Longitud: ${longitude.toFixed(6)}°</div>
                                <div class="term-line" style="color: var(--amber);">&gt; Precisión: ±${Math.round(accuracy)} metros (95% confianza)</div>
                            `;
                        }
                        AppController.showToast("Ubicación real capturada con éxito");
                    },
                    (err) => {
                        SoundEffects.error();
                        const errorTexts = {
                            1: "El usuario denegó el permiso de ubicación (PERMISSION_DENIED).",
                            2: "Posición no disponible en este momento (POSITION_UNAVAILABLE).",
                            3: "Tiempo límite de espera excedido (TIMEOUT)."
                        };
                        const msg = errorTexts[err.code] || err.message; // Declara e inicializa variable local
                        if (statusBanner) { // Evalúa condición lógica
                            statusBanner.className = "geo-status-banner error";
                            statusText.textContent = `Error (${err.code}): ${msg}`; // Actualiza contenido en el DOM
                        }
                        if (testStatus) testStatus.textContent = "Fallo en consulta"; // Evalúa condición lógica

                        if (consoleOutput1) { // Evalúa condición lógica
                            consoleOutput1.innerHTML = `
                                <div class="term-line" style="color: var(--rose);">&gt; Error de geolocalización (Código ${err.code}):</div>
                                <div class="term-line" style="color: var(--rose);">&gt; ${msg}</div>
                            `;
                        }
                        AppController.showToast("No se pudo obtener la ubicación", true);
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                );
            });
        }

        // Slide 7: Rastreador Completo
        const btnRunTrackerDemo = document.getElementById("btnRunTrackerDemo"); // Declara e inicializa variable local
        const trackerBanner = document.getElementById("trackerBanner"); // Declara e inicializa variable local
        const trackerBannerText = document.getElementById("trackerBannerText"); // Declara e inicializa variable local
        const trackerLat = document.getElementById("trackerLat"); // Declara e inicializa variable local
        const trackerLng = document.getElementById("trackerLng"); // Declara e inicializa variable local
        const trackerAcc = document.getElementById("trackerAcc"); // Declara e inicializa variable local
        const trackerMapLink = document.getElementById("trackerMapLink"); // Declara e inicializa variable local
        const trackerDemoResult = document.getElementById("trackerDemoResult"); // Declara e inicializa variable local

        if (btnRunTrackerDemo) { // Evalúa condición lógica
            btnRunTrackerDemo.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                if (trackerBanner) { // Evalúa condición lógica
                    trackerBanner.className = "geo-status-banner warning";
                    trackerBannerText.textContent = "Conectando con hardware GPS..."; // Actualiza contenido en el DOM
                }

                const procesarExito = (lat, lng, acc) => {
                    SoundEffects.success();
                    if (trackerBanner) { // Evalúa condición lógica
                        trackerBanner.className = "geo-status-banner success";
                        trackerBannerText.textContent = "Coordenadas fijadas en mapa ✅"; // Actualiza contenido en el DOM
                    }
                    if (trackerLat) trackerLat.textContent = `${lat.toFixed(6)}°`; // Evalúa condición lógica
                    if (trackerLng) trackerLng.textContent = `${lng.toFixed(6)}°`; // Evalúa condición lógica
                    if (trackerAcc) trackerAcc.textContent = `±${Math.round(acc)} m`; // Evalúa condición lógica

                    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
                    if (trackerMapLink) { // Evalúa condición lógica
                        trackerMapLink.href = osmUrl;
                        trackerMapLink.style.display = "inline-block";
                    }
                    if (trackerDemoResult) { // Evalúa condición lógica
                        trackerDemoResult.innerHTML = `
                            <code>Lat: ${lat.toFixed(6)}° | Lng: ${lng.toFixed(6)}° | ±${Math.round(acc)}m</code><br>
                            <small style="color: var(--emerald);">Enlace generado: <a href="${osmUrl}" target="_blank" style="color: var(--cyan); text-decoration: underline;">Abrir en OpenStreetMap</a></small>
                        `;
                    }
                    AppController.showToast("Rastreador actualizado");
                };

                if (navigator.geolocation) { // Evalúa condición lógica
                    navigator.geolocation.getCurrentPosition(
                        (pos) => procesarExito(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
                        () => {
                            // Si el usuario deniega o falla, aplicamos coordenadas de demostración pedagógica
                            procesarExito(40.416775, -3.703790, 8); // Madrid, España
                        },
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                    );
                } else {
                    procesarExito(40.416775, -3.703790, 8);
                }
            });
        }
    }

    static bindEvents() {
        const btnNext = document.getElementById("btnNextSlide"); // Declara e inicializa variable local
        const btnPrev = document.getElementById("btnPrevSlide"); // Declara e inicializa variable local
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide()); // Evalúa condición lógica
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide()); // Evalúa condición lógica

        const btnStart = document.getElementById("btnStartPresentation"); // Declara e inicializa variable local
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2)); // Evalúa condición lógica

        document.querySelectorAll("[data-jump]").forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const target = parseInt(btn.getAttribute("data-jump"), 10); // Declara e inicializa variable local
                this.goToSlide(target);
            });
        });

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

        const overviewModal = document.getElementById("overviewModal"); // Declara e inicializa variable local
        if (overviewModal) { // Evalúa condición lógica
            overviewModal.addEventListener("click", (e) => { // Registra escuchador de evento en el DOM
                if (e.target === overviewModal) this.closeOverview(); // Evalúa condición lógica
            });
        }

        window.addEventListener("keydown", (e) => { // Registra escuchador de evento en el DOM
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") { // Evalúa condición lógica
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

        // Slide 3: Inspeccionar Desestructuración de Coords
        const btnCheckCoordsExample = document.getElementById("btnCheckCoordsExample"); // Declara e inicializa variable local
        const coordsExampleResult = document.getElementById("coordsExampleResult"); // Declara e inicializa variable local
        if (btnCheckCoordsExample && coordsExampleResult) { // Evalúa condición lógica
            btnCheckCoordsExample.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                coordsExampleResult.innerHTML = `
                    <code>const { latitude, longitude, accuracy } = position.coords;</code><br>
                    <span style="color: var(--cyan);">Latitud:</span> 4.710989° | <span style="color: var(--cyan);">Longitud:</span> -74.072092° | <span style="color: var(--emerald);">Precisión:</span> ±12 m ✅
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de Error
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Declara e inicializa variable local
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareErrorModes = document.getElementById("btnCompareErrorModes"); // Declara e inicializa variable local
        if (btnCompareErrorModes) { // Evalúa condición lógica
            btnCompareErrorModes.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de options
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

        // Slide 5.1: Botón enableHighAccuracy
        const btnTestHighAccuracy = document.getElementById("btnTestHighAccuracy"); // Declara e inicializa variable local
        const highAccuracyResult = document.getElementById("highAccuracyResult"); // Declara e inicializa variable local
        if (btnTestHighAccuracy && highAccuracyResult) { // Evalúa condición lógica
            btnTestHighAccuracy.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                highAccuracyResult.innerHTML = `
                    <span style="color: var(--amber);">enableHighAccuracy: false</span> ➔ Triangulación por Wi-Fi/IP (±100m a ±1km, 50ms, 0% batería extra)<br>
                    <span style="color: var(--emerald);">enableHighAccuracy: true</span>  ➔ Chip GPS activo (±3m a ±15m, mayor demora, consumo alto de batería) ✅
                `;
            });
        }

        // Slide 5.2: Botón timeout
        const btnTestTimeout = document.getElementById("btnTestTimeout"); // Declara e inicializa variable local
        const timeoutResult = document.getElementById("timeoutResult"); // Declara e inicializa variable local
        if (btnTestTimeout && timeoutResult) { // Evalúa condición lógica
            btnTestTimeout.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                timeoutResult.innerHTML = `
                    <span style="color: var(--cyan);">timeout: 5000 (5 segundos):</span> Si el GPS no fija satélites antes de 5000ms, aborta y dispara <code>error.TIMEOUT</code>.<br>
                    <small style="color: var(--emerald);">Nota clave: El tiempo que el usuario tarda en aceptar el diálogo de permisos NO descuenta del timeout.</small>
                `;
            });
        }

        // Slide 5.3: Botón maximumAge
        const btnTestMaxAge = document.getElementById("btnTestMaxAge"); // Declara e inicializa variable local
        const maxAgeResult = document.getElementById("maxAgeResult"); // Declara e inicializa variable local
        if (btnTestMaxAge && maxAgeResult) { // Evalúa condición lógica
            btnTestMaxAge.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.success();
                maxAgeResult.innerHTML = `
                    <span style="color: var(--amber);">maximumAge: 0:</span> Fuerza un nuevo cálculo satelital sin aceptar caché.<br>
                    <span style="color: var(--emerald);">maximumAge: 60000:</span> Si hay una lectura de hace menos de 1 minuto, la devuelve al instante (0ms de espera).
                `;
            });
        }

        // Slide 8: Selector de Analogías (Mensajero con Láser vs Foto con Vencimiento)
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

        // Slide 9: Playground
        const codePresetSelect = document.getElementById("codePresetSelect"); // Declara e inicializa variable local
        if (codePresetSelect) { // Evalúa condición lógica
            codePresetSelect.addEventListener("change", (e) => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                this.loadPlaygroundPreset(e.target.value);
            });
        }

        const btnResetCode = document.getElementById("btnResetCode"); // Declara e inicializa variable local
        if (btnResetCode) { // Evalúa condición lógica
            btnResetCode.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-geo-1"; // Declara e inicializa variable local
                this.loadPlaygroundPreset(currentPreset);
                this.showToast("Código restaurado");
            });
        }

        const btnRunEditorCode = document.getElementById("btnRunEditorCode"); // Declara e inicializa variable local
        if (btnRunEditorCode) { // Evalúa condición lógica
            btnRunEditorCode.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                this.runPlaygroundCode();
            });
        }

        const btnClearConsole = document.getElementById("btnClearConsole"); // Declara e inicializa variable local
        const logsContainer = document.getElementById("consoleLogsContainer"); // Declara e inicializa variable local
        if (btnClearConsole && logsContainer) { // Evalúa condición lógica
            btnClearConsole.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.click();
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>'; // Actualiza contenido en el DOM
            });
        }

        // Slide 10: Retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => {
            btn.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa variable local
                SoundEffects.transition();
                this.loadPlaygroundPreset(presetKey);
                this.goToSlide(9);
                this.showToast("Reto cargado en el Playground");
            });
        });

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

        const btnRestart = document.getElementById("btnRestartPresentation"); // Declara e inicializa variable local
        if (btnRestart) { // Evalúa condición lógica
            btnRestart.addEventListener("click", () => { // Registra escuchador de evento en el DOM
                SoundEffects.transition();
                this.goToSlide(1);
            });
        }

        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat"); // Declara e inicializa variable local
        if (btnCopySummaryCheat) { // Evalúa condición lógica
            btnCopySummaryCheat.addEventListener("click", () => { // Registra escuchador de evento en el DOM
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
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    static runScenarioSimulation(scenarioKey) {
        const terminalImplicit = document.getElementById("terminalImplicit"); // Declara e inicializa variable local
        const terminalSerialized = document.getElementById("terminalSerialized"); // Declara e inicializa variable local
        const feedbackText = document.getElementById("storageFeedbackText"); // Declara e inicializa variable local
        if (!terminalImplicit || !terminalSerialized) return; // Evalúa condición lógica

        SoundEffects.transition();

        if (scenarioKey === "denied") { // Evalúa condición lógica
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Diálogo: "¿Permitir conocer tu ubicación?" ➔ El usuario pulsa "Bloquear"</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 1 (PERMISSION_DENIED) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; if (error.code === error.PERMISSION_DENIED) {</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   mostrarAlerta("Permiso denegado. Actívalo en el candado del navegador.");</div>
                <div class="term-line" style="color: var(--emerald);">&gt; }</div>
            `;
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>PERMISSION_DENIED (1):</strong> Ocurre cuando el usuario cancela o bloquea los permisos. Siempre debes mostrar una guía visual para que sepa cómo desbloquearlo."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "unavailable") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Dispositivo en un sótano / sin Wi-Fi / sin satélites GPS visibles</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 2 (POSITION_UNAVAILABLE) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; case error.POSITION_UNAVAILABLE:</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   solicitarIngresoManualDeDireccion(); // Plan de contingencia</div>
            `;
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>POSITION_UNAVAILABLE (2):</strong> Falla física de triangulación. La buena práctica es ofrecer al usuario la opción de escribir su ciudad o dirección manualmente."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "timeout") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; options = { timeout: 3000 }; El GPS tarda 4 segundos en fijar satélites</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 3 (TIMEOUT) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; case error.TIMEOUT:</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   reintentarConMenorPrecision(); // Reintentar con enableHighAccuracy: false</div>
            `;
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>TIMEOUT (3):</strong> Se agotó el tiempo configurado. Puedes reintentar la llamada aumentando el tiempo o desactivando <code>enableHighAccuracy</code>."; // Actualiza contenido en el DOM
            }
        } else if (scenarioKey === "inseguro") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Web servida en http://misitio.com (HTTP plano sin SSL)</div>
                <div class="term-line" style="color: var(--rose);">&gt; TypeError / Bloqueo nativo: navigator.geolocation no está disponible 🚫</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Servir la aplicación bajo https:// o en entorno local (http://localhost)</div>
                <div class="term-line" style="color: var(--cyan);">&gt; navigator.geolocation habilitado con protección criptográfica SSL ✅</div>
            `;
            if (feedbackText) { // Evalúa condición lógica
                feedbackText.innerHTML = "<strong>Contexto Seguro Obligatorio:</strong> La API de Geolocalización está prohibida en HTTP inseguro para evitar que atacantes intercepten la posición física del usuario."; // Actualiza contenido en el DOM
            }
        }
    }

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

        if (officeState === "gps") { // Evalúa condición lógica
            if (avatarLeft) avatarLeft.textContent = "🏙️"; // Evalúa condición lógica
            if (titleLeft) titleLeft.textContent = "1. Modo Ligero (enableHighAccuracy: false)"; // Evalúa condición lógica
            if (subLeft) subLeft.textContent = "Pregunta el nombre del vecindario (Wi-Fi / IP)"; // Evalúa condición lógica
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Responde casi instantáneamente en pocos milisegundos</div>
                <div class="ws-item">Ahorra 100% de batería al no encender el chip GPS</div>
            `;
            if (statusLeft) statusLeft.textContent = "Precisión moderada a nivel de vecindario o calle"; // Evalúa condición lógica
            if (arrowLabel) arrowLabel.textContent = "Calibración"; // Evalúa condición lógica

            if (avatarRight) avatarRight.textContent = "🛰️"; // Evalúa condición lógica
            if (titleRight) titleRight.textContent = "2. Visor Láser Satelital (enableHighAccuracy: true)"; // Evalúa condición lógica
            if (subRight) subRight.textContent = "Triangulación por Constelación GPS"; // Evalúa condición lógica
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Ubica la puerta exacta de tu casa con margen métrico</div>
                <div class="ws-item highlight-item">Requiere esperar conexión con satélites y gasta más batería</div>
            `;
            if (statusRight) statusRight.textContent = "Precisión de alta fidelidad (±3 a ±10 metros)"; // Evalúa condición lógica

            if (bannerIcon) bannerIcon.textContent = "🛰️"; // Evalúa condición lógica
            if (bannerText) { // Evalúa condición lógica
                bannerText.innerHTML = "<strong>enableHighAccuracy:</strong> Usa <code>false</code> para catálogos locales o tiendas cercanas; activa <code>true</code> únicamente cuando desarrolles navegación por satélite, fitness o mapas paso a paso."; // Actualiza contenido en el DOM
            }
        } else {
            if (avatarLeft) avatarLeft.textContent = "⏱️"; // Evalúa condición lógica
            if (titleLeft) titleLeft.textContent = "1. El Mensaje con Límite de Espera (timeout)"; // Evalúa condición lógica
            if (subLeft) subLeft.textContent = "Esperas que un amigo te envíe su ubicación"; // Evalúa condición lógica
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Si no responde en X segundos, asumes que no está disponible</div>
                <div class="ws-item">Evita que la aplicación quede congelada indefinidamente</div>
            `;
            if (statusLeft) statusLeft.textContent = "Dispara error.TIMEOUT si se supera el tiempo límite"; // Evalúa condición lógica
            if (arrowLabel) arrowLabel.textContent = "¿Caché o Real?"; // Evalúa condición lógica

            if (avatarRight) avatarRight.textContent = "📸"; // Evalúa condición lógica
            if (titleRight) titleRight.textContent = "2. La Foto con Vencimiento (maximumAge)"; // Evalúa condición lógica
            if (subRight) subRight.textContent = "¿Aceptar foto vieja o pedir una nueva en vivo?"; // Evalúa condición lógica
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">maximumAge > 0: Acepta la última foto si tiene menos de X minutos</div>
                <div class="ws-item highlight-item">maximumAge: 0: Pide una foto fresca tomada en este segundo exacto</div>
            `;
            if (statusRight) statusRight.textContent = "Equilibrio entre inmediatez (caché) y frescura de datos"; // Evalúa condición lógica

            if (bannerIcon) bannerIcon.textContent = "📸"; // Evalúa condición lógica
            if (bannerText) { // Evalúa condición lógica
                bannerText.innerHTML = "<strong>timeout y maximumAge:</strong> Combina ambos parámetros para que tu app responda rápido sin quemar batería calculando posiciones innecesarias cuando ya tiene una lectura reciente."; // Actualiza contenido en el DOM
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de evento en el DOM
    AppController.init();
});

