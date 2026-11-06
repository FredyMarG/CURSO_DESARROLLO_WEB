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
"use strict";

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const AppState = {
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación (10 diapositivas)
    totalSlides: 10,
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
class SoundEffects {
    static init() {
        if (!AppState.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
            AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    static playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.05) {
        if (!AppState.soundEnabled) return;
        try {
            this.init();
            if (!AppState.audioCtx) return;
            if (AppState.audioCtx.state === "suspended") {
                AppState.audioCtx.resume();
            }
            const osc = AppState.audioCtx.createOscillator();
            const gain = AppState.audioCtx.createGain();

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
class AppController {
    static init() {
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.bindGeoLiveDemos();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-geo-1");
    }

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

        const slideIndicator = document.getElementById("slideIndicator");
        if (slideIndicator) {
            slideIndicator.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
        }

        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            const pct = (AppState.currentSlide / AppState.totalSlides) * 100;
            progressBar.style.width = `${pct}%`;
        }

        const dots = document.querySelectorAll(".slide-dot");
        dots.forEach((dot, idx) => {
            if (idx + 1 === AppState.currentSlide) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        const ovCards = document.querySelectorAll(".overview-card");
        ovCards.forEach((card, idx) => {
            if (idx + 1 === AppState.currentSlide) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

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

    static openOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            modal.classList.add("active");
            SoundEffects.click();
        }
    }

    static closeOverview() {
        const modal = document.getElementById("overviewModal");
        if (modal) {
            modal.classList.remove("active");
        }
    }

    static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

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

    static runPlaygroundCode() {
        const textarea = document.getElementById("liveCodeEditor");
        const logsContainer = document.getElementById("consoleLogsContainer");
        if (!textarea || !logsContainer) return;

        const codeToRun = textarea.value;
        logsContainer.innerHTML = "";

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

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        try {
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

            const runFn = new Function(codeToRun);
            runFn();

            SoundEffects.success();
            AppController.showToast("Código ejecutado");
        } catch (err) {
            console.error("Excepción:", err.name, "-", err.message);
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
        } finally {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
        }
    }

    // Vincula las demostraciones interactivas de geolocalización (Slide 2 y Slide 7)
    static bindGeoLiveDemos() {
        // Slide 2: Consulta en vivo (getCurrentPosition y watchPosition)
        const btnTestGeoLive = document.getElementById("btnTestGeoLive");
        const btnTestWatchLive = document.getElementById("btnTestWatchLive");
        const btnStopWatchLive = document.getElementById("btnStopWatchLive");
        const statusBanner = document.getElementById("geoLiveStatusBanner");
        const statusText = document.getElementById("geoLiveStatusText");
        const metricLat = document.getElementById("metricLat");
        const metricLng = document.getElementById("metricLng");
        const metricAcc = document.getElementById("metricAcc");
        const testStatus = document.getElementById("testGeoLiveStatus");
        const consoleOutput1 = document.getElementById("console-output-1");

        let liveWatchId = null;
        let liveWatchTick = 0;

        if (btnTestWatchLive) {
            btnTestWatchLive.addEventListener("click", () => {
                if (!navigator.geolocation) {
                    SoundEffects.error();
                    AppController.showToast("Geolocalización no compatible", true);
                    return;
                }

                SoundEffects.click();
                liveWatchTick = 0;
                btnTestWatchLive.style.display = "none";
                if (btnStopWatchLive) btnStopWatchLive.style.display = "inline-flex";

                if (statusBanner) {
                    statusBanner.className = "geo-status-banner warning";
                    statusText.textContent = "📡 watchPosition() activo: esperando cambios...";
                }
                if (testStatus) testStatus.textContent = "Rastreando en tiempo real";

                liveWatchId = navigator.geolocation.watchPosition(
                    (pos) => {
                        liveWatchTick++;
                        SoundEffects.success();
                        const { latitude, longitude, accuracy, speed } = pos.coords;
                        if (statusBanner) {
                            statusBanner.className = "geo-status-banner success";
                            statusText.textContent = `📡 watchPosition() [Tick #${liveWatchTick}] actualizado`;
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`;
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`;
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`;

                        if (consoleOutput1) {
                            const line = document.createElement("div");
                            line.className = "term-line";
                            line.style.color = "var(--emerald)";
                            line.textContent = `> [watchPosition #${liveWatchId}] Tick #${liveWatchTick}: Lat ${latitude.toFixed(6)}°, Lng ${longitude.toFixed(6)}°, Margen ±${Math.round(accuracy)}m`;
                            consoleOutput1.appendChild(line);
                            consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                        }
                    },
                    (err) => {
                        SoundEffects.error();
                        if (statusBanner) {
                            statusBanner.className = "geo-status-banner error";
                            statusText.textContent = `Error en watch (${err.code}): ${err.message}`;
                        }
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                );

                AppController.showToast(`watchPosition iniciado (ID: #${liveWatchId})`);
            });
        }

        if (btnStopWatchLive) {
            btnStopWatchLive.addEventListener("click", () => {
                if (liveWatchId !== null) {
                    navigator.geolocation.clearWatch(liveWatchId);
                    SoundEffects.transition();
                    if (statusBanner) {
                        statusBanner.className = "geo-status-banner";
                        statusText.textContent = `🛑 clearWatch(#${liveWatchId}) ejecutado. Rastreo detenido.`;
                    }
                    if (consoleOutput1) {
                        const line = document.createElement("div");
                        line.className = "term-line";
                        line.style.color = "var(--amber)";
                        line.textContent = `> navigator.geolocation.clearWatch(${liveWatchId}) ➔ Sensores GPS y batería liberados.`;
                        consoleOutput1.appendChild(line);
                        consoleOutput1.scrollTop = consoleOutput1.scrollHeight;
                    }
                    liveWatchId = null;
                    btnStopWatchLive.style.display = "none";
                    if (btnTestWatchLive) btnTestWatchLive.style.display = "inline-flex";
                    if (testStatus) testStatus.textContent = "Rastreo detenido";
                    AppController.showToast("clearWatch() ejecutado");
                }
            });
        }

        if (btnTestGeoLive) {
            btnTestGeoLive.addEventListener("click", () => {
                if (!navigator.geolocation) {
                    SoundEffects.error();
                    if (statusBanner) {
                        statusBanner.className = "geo-status-banner error";
                        statusText.textContent = "Geolocalización no soportada en este entorno";
                    }
                    return;
                }

                SoundEffects.click();
                if (statusBanner) {
                    statusBanner.className = "geo-status-banner warning";
                    statusText.textContent = "Consultando sensores y satélites...";
                }
                if (testStatus) testStatus.textContent = "Esperando respuesta...";

                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        SoundEffects.success();
                        const { latitude, longitude, accuracy } = pos.coords;
                        if (statusBanner) {
                            statusBanner.className = "geo-status-banner success";
                            statusText.textContent = "Posición obtenida con éxito ✅";
                        }
                        if (metricLat) metricLat.textContent = `${latitude.toFixed(6)}°`;
                        if (metricLng) metricLng.textContent = `${longitude.toFixed(6)}°`;
                        if (metricAcc) metricAcc.textContent = `±${Math.round(accuracy)} m`;
                        if (testStatus) testStatus.textContent = "Lectura completada";

                        if (consoleOutput1) {
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
                        const msg = errorTexts[err.code] || err.message;
                        if (statusBanner) {
                            statusBanner.className = "geo-status-banner error";
                            statusText.textContent = `Error (${err.code}): ${msg}`;
                        }
                        if (testStatus) testStatus.textContent = "Fallo en consulta";

                        if (consoleOutput1) {
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
        const btnRunTrackerDemo = document.getElementById("btnRunTrackerDemo");
        const trackerBanner = document.getElementById("trackerBanner");
        const trackerBannerText = document.getElementById("trackerBannerText");
        const trackerLat = document.getElementById("trackerLat");
        const trackerLng = document.getElementById("trackerLng");
        const trackerAcc = document.getElementById("trackerAcc");
        const trackerMapLink = document.getElementById("trackerMapLink");
        const trackerDemoResult = document.getElementById("trackerDemoResult");

        if (btnRunTrackerDemo) {
            btnRunTrackerDemo.addEventListener("click", () => {
                SoundEffects.click();
                if (trackerBanner) {
                    trackerBanner.className = "geo-status-banner warning";
                    trackerBannerText.textContent = "Conectando con hardware GPS...";
                }

                const procesarExito = (lat, lng, acc) => {
                    SoundEffects.success();
                    if (trackerBanner) {
                        trackerBanner.className = "geo-status-banner success";
                        trackerBannerText.textContent = "Coordenadas fijadas en mapa ✅";
                    }
                    if (trackerLat) trackerLat.textContent = `${lat.toFixed(6)}°`;
                    if (trackerLng) trackerLng.textContent = `${lng.toFixed(6)}°`;
                    if (trackerAcc) trackerAcc.textContent = `±${Math.round(acc)} m`;

                    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
                    if (trackerMapLink) {
                        trackerMapLink.href = osmUrl;
                        trackerMapLink.style.display = "inline-block";
                    }
                    if (trackerDemoResult) {
                        trackerDemoResult.innerHTML = `
                            <code>Lat: ${lat.toFixed(6)}° | Lng: ${lng.toFixed(6)}° | ±${Math.round(acc)}m</code><br>
                            <small style="color: var(--emerald);">Enlace generado: <a href="${osmUrl}" target="_blank" style="color: var(--cyan); text-decoration: underline;">Abrir en OpenStreetMap</a></small>
                        `;
                    }
                    AppController.showToast("Rastreador actualizado");
                };

                if (navigator.geolocation) {
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
        const btnNext = document.getElementById("btnNextSlide");
        const btnPrev = document.getElementById("btnPrevSlide");
        if (btnNext) btnNext.addEventListener("click", () => this.nextSlide());
        if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide());

        const btnStart = document.getElementById("btnStartPresentation");
        if (btnStart) btnStart.addEventListener("click", () => this.goToSlide(2));

        document.querySelectorAll("[data-jump]").forEach(btn => {
            btn.addEventListener("click", () => {
                const target = parseInt(btn.getAttribute("data-jump"), 10);
                this.goToSlide(target);
            });
        });

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

        const overviewModal = document.getElementById("overviewModal");
        if (overviewModal) {
            overviewModal.addEventListener("click", (e) => {
                if (e.target === overviewModal) this.closeOverview();
            });
        }

        window.addEventListener("keydown", (e) => {
            if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
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

        // Slide 3: Inspeccionar Desestructuración de Coords
        const btnCheckCoordsExample = document.getElementById("btnCheckCoordsExample");
        const coordsExampleResult = document.getElementById("coordsExampleResult");
        if (btnCheckCoordsExample && coordsExampleResult) {
            btnCheckCoordsExample.addEventListener("click", () => {
                SoundEffects.success();
                coordsExampleResult.innerHTML = `
                    <code>const { latitude, longitude, accuracy } = position.coords;</code><br>
                    <span style="color: var(--cyan);">Latitud:</span> 4.710989° | <span style="color: var(--cyan);">Longitud:</span> -74.072092° | <span style="color: var(--emerald);">Precisión:</span> ±12 m ✅
                `;
            });
        }

        // Slide 4: Comparador de Escenarios de Error
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareErrorModes = document.getElementById("btnCompareErrorModes");
        if (btnCompareErrorModes) {
            btnCompareErrorModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de options
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

        // Slide 5.1: Botón enableHighAccuracy
        const btnTestHighAccuracy = document.getElementById("btnTestHighAccuracy");
        const highAccuracyResult = document.getElementById("highAccuracyResult");
        if (btnTestHighAccuracy && highAccuracyResult) {
            btnTestHighAccuracy.addEventListener("click", () => {
                SoundEffects.success();
                highAccuracyResult.innerHTML = `
                    <span style="color: var(--amber);">enableHighAccuracy: false</span> ➔ Triangulación por Wi-Fi/IP (±100m a ±1km, 50ms, 0% batería extra)<br>
                    <span style="color: var(--emerald);">enableHighAccuracy: true</span>  ➔ Chip GPS activo (±3m a ±15m, mayor demora, consumo alto de batería) ✅
                `;
            });
        }

        // Slide 5.2: Botón timeout
        const btnTestTimeout = document.getElementById("btnTestTimeout");
        const timeoutResult = document.getElementById("timeoutResult");
        if (btnTestTimeout && timeoutResult) {
            btnTestTimeout.addEventListener("click", () => {
                SoundEffects.success();
                timeoutResult.innerHTML = `
                    <span style="color: var(--cyan);">timeout: 5000 (5 segundos):</span> Si el GPS no fija satélites antes de 5000ms, aborta y dispara <code>error.TIMEOUT</code>.<br>
                    <small style="color: var(--emerald);">Nota clave: El tiempo que el usuario tarda en aceptar el diálogo de permisos NO descuenta del timeout.</small>
                `;
            });
        }

        // Slide 5.3: Botón maximumAge
        const btnTestMaxAge = document.getElementById("btnTestMaxAge");
        const maxAgeResult = document.getElementById("maxAgeResult");
        if (btnTestMaxAge && maxAgeResult) {
            btnTestMaxAge.addEventListener("click", () => {
                SoundEffects.success();
                maxAgeResult.innerHTML = `
                    <span style="color: var(--amber);">maximumAge: 0:</span> Fuerza un nuevo cálculo satelital sin aceptar caché.<br>
                    <span style="color: var(--emerald);">maximumAge: 60000:</span> Si hay una lectura de hace menos de 1 minuto, la devuelve al instante (0ms de espera).
                `;
            });
        }

        // Slide 8: Selector de Analogías (Mensajero con Láser vs Foto con Vencimiento)
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

        // Slide 9: Playground
        const codePresetSelect = document.getElementById("codePresetSelect");
        if (codePresetSelect) {
            codePresetSelect.addEventListener("change", (e) => {
                SoundEffects.click();
                this.loadPlaygroundPreset(e.target.value);
            });
        }

        const btnResetCode = document.getElementById("btnResetCode");
        if (btnResetCode) {
            btnResetCode.addEventListener("click", () => {
                SoundEffects.click();
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-geo-1";
                this.loadPlaygroundPreset(currentPreset);
                this.showToast("Código restaurado");
            });
        }

        const btnRunEditorCode = document.getElementById("btnRunEditorCode");
        if (btnRunEditorCode) {
            btnRunEditorCode.addEventListener("click", () => {
                this.runPlaygroundCode();
            });
        }

        const btnClearConsole = document.getElementById("btnClearConsole");
        const logsContainer = document.getElementById("consoleLogsContainer");
        if (btnClearConsole && logsContainer) {
            btnClearConsole.addEventListener("click", () => {
                SoundEffects.click();
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>';
            });
        }

        // Slide 10: Retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => {
            btn.addEventListener("click", () => {
                const presetKey = btn.getAttribute("data-load-preset");
                SoundEffects.transition();
                this.loadPlaygroundPreset(presetKey);
                this.goToSlide(9);
                this.showToast("Reto cargado en el Playground");
            });
        });

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

        const btnRestart = document.getElementById("btnRestartPresentation");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                SoundEffects.transition();
                this.goToSlide(1);
            });
        }

        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat");
        if (btnCopySummaryCheat) {
            btnCopySummaryCheat.addEventListener("click", () => {
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
        const terminalImplicit = document.getElementById("terminalImplicit");
        const terminalSerialized = document.getElementById("terminalSerialized");
        const feedbackText = document.getElementById("storageFeedbackText");
        if (!terminalImplicit || !terminalSerialized) return;

        SoundEffects.transition();

        if (scenarioKey === "denied") {
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Diálogo: "¿Permitir conocer tu ubicación?" ➔ El usuario pulsa "Bloquear"</div>
                <div class="term-line" style="color: var(--rose);">&gt; Dispara error con error.code === 1 (PERMISSION_DENIED) ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; if (error.code === error.PERMISSION_DENIED) {</div>
                <div class="term-line" style="color: var(--cyan);">&gt;   mostrarAlerta("Permiso denegado. Actívalo en el candado del navegador.");</div>
                <div class="term-line" style="color: var(--emerald);">&gt; }</div>
            `;
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>PERMISSION_DENIED (1):</strong> Ocurre cuando el usuario cancela o bloquea los permisos. Siempre debes mostrar una guía visual para que sepa cómo desbloquearlo.";
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
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>POSITION_UNAVAILABLE (2):</strong> Falla física de triangulación. La buena práctica es ofrecer al usuario la opción de escribir su ciudad o dirección manualmente.";
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
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>TIMEOUT (3):</strong> Se agotó el tiempo configurado. Puedes reintentar la llamada aumentando el tiempo o desactivando <code>enableHighAccuracy</code>.";
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
            if (feedbackText) {
                feedbackText.innerHTML = "<strong>Contexto Seguro Obligatorio:</strong> La API de Geolocalización está prohibida en HTTP inseguro para evitar que atacantes intercepten la posición física del usuario.";
            }
        }
    }

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

        if (officeState === "gps") {
            if (avatarLeft) avatarLeft.textContent = "🏙️";
            if (titleLeft) titleLeft.textContent = "1. Modo Ligero (enableHighAccuracy: false)";
            if (subLeft) subLeft.textContent = "Pregunta el nombre del vecindario (Wi-Fi / IP)";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Responde casi instantáneamente en pocos milisegundos</div>
                <div class="ws-item">Ahorra 100% de batería al no encender el chip GPS</div>
            `;
            if (statusLeft) statusLeft.textContent = "Precisión moderada a nivel de vecindario o calle";
            if (arrowLabel) arrowLabel.textContent = "Calibración";

            if (avatarRight) avatarRight.textContent = "🛰️";
            if (titleRight) titleRight.textContent = "2. Visor Láser Satelital (enableHighAccuracy: true)";
            if (subRight) subRight.textContent = "Triangulación por Constelación GPS";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Ubica la puerta exacta de tu casa con margen métrico</div>
                <div class="ws-item highlight-item">Requiere esperar conexión con satélites y gasta más batería</div>
            `;
            if (statusRight) statusRight.textContent = "Precisión de alta fidelidad (±3 a ±10 metros)";

            if (bannerIcon) bannerIcon.textContent = "🛰️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>enableHighAccuracy:</strong> Usa <code>false</code> para catálogos locales o tiendas cercanas; activa <code>true</code> únicamente cuando desarrolles navegación por satélite, fitness o mapas paso a paso.";
            }
        } else {
            if (avatarLeft) avatarLeft.textContent = "⏱️";
            if (titleLeft) titleLeft.textContent = "1. El Mensaje con Límite de Espera (timeout)";
            if (subLeft) subLeft.textContent = "Esperas que un amigo te envíe su ubicación";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Si no responde en X segundos, asumes que no está disponible</div>
                <div class="ws-item">Evita que la aplicación quede congelada indefinidamente</div>
            `;
            if (statusLeft) statusLeft.textContent = "Dispara error.TIMEOUT si se supera el tiempo límite";
            if (arrowLabel) arrowLabel.textContent = "¿Caché o Real?";

            if (avatarRight) avatarRight.textContent = "📸";
            if (titleRight) titleRight.textContent = "2. La Foto con Vencimiento (maximumAge)";
            if (subRight) subRight.textContent = "¿Aceptar foto vieja o pedir una nueva en vivo?";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">maximumAge > 0: Acepta la última foto si tiene menos de X minutos</div>
                <div class="ws-item highlight-item">maximumAge: 0: Pide una foto fresca tomada en este segundo exacto</div>
            `;
            if (statusRight) statusRight.textContent = "Equilibrio entre inmediatez (caché) y frescura de datos";

            if (bannerIcon) bannerIcon.textContent = "📸";
            if (bannerText) {
                bannerText.innerHTML = "<strong>timeout y maximumAge:</strong> Combina ambos parámetros para que tu app responda rápido sin quemar batería calculando posiciones innecesarias cuando ya tiene una lectura reciente.";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
