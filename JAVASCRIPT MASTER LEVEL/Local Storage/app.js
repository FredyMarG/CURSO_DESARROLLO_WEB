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
    // Escenario actualmente seleccionado en el comparador de serialización (Slide 4)
    activeScenario: "objeto",
    // Estado de la analogía de la oficina (Slide 8: 'local' o 'session')
    activeOfficeState: "local",
    // Estado auxiliar para alternar idioma en la demostración del Slide 7
    demoLangToggle: "es"
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
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-storage-1"); // Ejecuta llamada o método
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

        // Slide 2: Guardar y Leer en LocalStorage en Vivo
        const btnTestStorageIntro = document.getElementById("btnTestStorageIntro"); // Obtiene referencia DOM para "btnTestStorageIntro"
        const statusStorageIntro = document.getElementById("testStorageIntroStatus"); // Obtiene referencia DOM para "statusStorageIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        if (btnTestStorageIntro && consoleOutput1) { // Evalúa condición
            btnTestStorageIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                localStorage.setItem("nombre", "Fredy"); // Ejecuta llamada o método
                const nombre = localStorage.getItem("nombre"); // Declara e inicializa "nombre"

                if (statusStorageIntro) statusStorageIntro.textContent = "Guardado en Navegador"; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; localStorage.setItem("nombre", "Fredy");</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; let nombre = localStorage.getItem("nombre");</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; Salida ➔ "${nombre}" (Persistido en disco local ✅)</div>
                `;
                this.showToast("Clave 'nombre' guardada en localStorage"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Probar Ciclo de los 4 Métodos en Tiempo Real
        const btnCheckStorageMethods = document.getElementById("btnCheckStorageMethods"); // Obtiene referencia DOM para "btnCheckStorageMethods"
        const storageMethodsResult = document.getElementById("storageMethodsResult"); // Obtiene referencia DOM para "storageMethodsResult"
        if (btnCheckStorageMethods && storageMethodsResult) { // Evalúa condición
            btnCheckStorageMethods.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                sessionStorage.setItem("usuario_demo", "Carlos"); // Ejecuta llamada o método
                const leido = sessionStorage.getItem("usuario_demo"); // Declara e inicializa "leido"
                sessionStorage.removeItem("usuario_demo"); // Ejecuta llamada o método
                const trasBorrar = sessionStorage.getItem("usuario_demo"); // Declara e inicializa "trasBorrar"

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
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareStorageModes = document.getElementById("btnCompareStorageModes"); // Obtiene referencia DOM para "btnCompareStorageModes"
        if (btnCompareStorageModes) { // Evalúa condición
            btnCompareStorageModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de Flujo de Decisión, try...catch y Seguridad
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

        // Slide 5.1: Botón Árbol de Decisión
        const btnTestDecisionTree = document.getElementById("btnTestDecisionTree"); // Obtiene referencia DOM para "btnTestDecisionTree"
        const decisionTreeResult = document.getElementById("decisionTreeResult"); // Obtiene referencia DOM para "decisionTreeResult"
        if (btnTestDecisionTree && decisionTreeResult) { // Evalúa condición
            btnTestDecisionTree.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                decisionTreeResult.innerHTML = `
                    <span style="color: var(--cyan);">1. ¿Persiste al cerrar navegador?</span> SÍ ➔ <code>localStorage</code> (NO ➔ <code>sessionStorage</code>)<br>
                    <span style="color: var(--emerald);">2. ¿Es Objeto o Array?</span> SÍ ➔ <code>JSON.stringify(valor)</code> antes de <code>.setItem()</code>
                `;
            });
        }

        // Slide 5.2: Botón Lectura Blindada con try...catch
        const btnTestTryCatchParse = document.getElementById("btnTestTryCatchParse"); // Obtiene referencia DOM para "btnTestTryCatchParse"
        const tryCatchParseResult = document.getElementById("tryCatchParseResult"); // Obtiene referencia DOM para "tryCatchParseResult"
        if (btnTestTryCatchParse && tryCatchParseResult) { // Evalúa condición
            btnTestTryCatchParse.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                tryCatchParseResult.innerHTML = `
                    <span style="color: var(--amber);">Dato dañado en Storage:</span> <code>"{tema: oscuro"</code> (JSON inválido)<br>
                    <span style="color: var(--emerald);">Con bloque try...catch:</span> Captura el <code>SyntaxError</code> y devuelve <code>null</code> sin romper la página ✅
                `;
            });
        }

        // Slide 5.3: Botón Auditoría de Seguridad
        const btnTestSecurityCheck = document.getElementById("btnTestSecurityCheck"); // Obtiene referencia DOM para "btnTestSecurityCheck"
        const securityCheckResult = document.getElementById("securityCheckResult"); // Obtiene referencia DOM para "securityCheckResult"
        if (btnTestSecurityCheck && securityCheckResult) { // Evalúa condición
            btnTestSecurityCheck.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                securityCheckResult.innerHTML = `
                    <span style="color: var(--rose);">❌ PROHIBIDO:</span> Contraseñas, tarjetas de crédito, CVV, datos médicos (expuestos a XSS).<br>
                    <span style="color: var(--emerald);">✅ PERMITIDO:</span> Tema oscuro/claro, idioma (<code>"es"</code>/<code>"en"</code>), filtros de UI.
                `;
            });
        }

        // Slide 7: Probar Persistencia de Historial en Vivo
        const btnTestHistoryStorage = document.getElementById("btnTestHistoryStorage"); // Obtiene referencia DOM para "btnTestHistoryStorage"
        const historyStorageResult = document.getElementById("historyStorageResult"); // Obtiene referencia DOM para "historyStorageResult"
        if (btnTestHistoryStorage && historyStorageResult) { // Evalúa condición
            btnTestHistoryStorage.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const busquedas = ["cursos js", "fetch api", "flexbox css"]; // Declara e inicializa "busquedas"
                localStorage.setItem("busquedas", JSON.stringify(busquedas)); // Ejecuta llamada o método
                const recuperado = JSON.parse(localStorage.getItem("busquedas")); // Declara e inicializa "recuperado"
                historyStorageResult.innerHTML = `
                    <code>JSON guardado: '${localStorage.getItem("busquedas")}'</code><br>
                    <small style="color: var(--emerald);">Array reconstruido (${recuperado.length} ítems): <code>[${recuperado.map(x => `"${x}"`).join(", ")}]</code></small>
                `;
            });
        }

        // Slide 7: Simular Cambio y Recarga de Idioma
        const btnTestLangStorage = document.getElementById("btnTestLangStorage"); // Obtiene referencia DOM para "btnTestLangStorage"
        const langStorageResult = document.getElementById("langStorageResult"); // Obtiene referencia DOM para "langStorageResult"
        if (btnTestLangStorage && langStorageResult) { // Evalúa condición
            btnTestLangStorage.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                AppState.demoLangToggle = AppState.demoLangToggle === "es" ? "en" : "es"; // Asigna valor
                localStorage.setItem("app_lang", AppState.demoLangToggle); // Ejecuta llamada o método
                const actual = localStorage.getItem("app_lang"); // Declara e inicializa "actual"
                langStorageResult.innerHTML = `
                    <code>cambiarIdioma("${actual}") ➔ localStorage.getItem("app_lang") === "${actual}"</code><br>
                    <small style="color: var(--cyan);">Idioma activo persistido: <strong>${actual === "es" ? "Español (es)" : "Inglés (en)"}</strong> (Pulsa de nuevo para alternar).</small>
                `;
            });
        }

        // Slide 8: Metáfora del Archivador de Oficina
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-storage-1"; // Declara e inicializa "currentPreset"
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
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre Conversión Implícita y JSON en el Slide 4
    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalImplicit = document.getElementById("terminalImplicit"); // Obtiene referencia DOM para "terminalImplicit"
        const terminalSerialized = document.getElementById("terminalSerialized"); // Obtiene referencia DOM para "terminalSerialized"
        const feedbackText = document.getElementById("storageFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalImplicit || !terminalSerialized) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "objeto") { // Evalúa condición
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("cfg", { tema: "oscuro" });</div>
                <div class="term-line" style="color: var(--rose);">&gt; localStorage.getItem("cfg") ➔ "[object Object]" ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; localStorage.setItem("cfg", JSON.stringify({ tema: "oscuro" }));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; JSON.parse(localStorage.getItem("cfg")).tema ➔ "oscuro" ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Objeto Literal:</strong> Guardar un objeto sin <code>JSON.stringify()</code> invoca <code>.toString()</code> y destruye tus datos en <code>'[object Object]'</code>."; // Evalúa condición
        } else if (scenarioKey === "array") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("items", ["js", "css"]);</div>
                <div class="term-line" style="color: var(--rose);">&gt; getItem("items") ➔ "js,css" (String plano, ya no es Array) ⚠️</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; localStorage.setItem("items", JSON.stringify(["js", "css"]));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; JSON.parse(getItem("items")) ➔ ["js", "css"] (Array real) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Arrays:</strong> Con <code>JSON.stringify()</code> y <code>JSON.parse()</code> conservas un Array auténtico con acceso a <code>.map()</code> y <code>.push()</code>."; // Evalúa condición
        } else if (scenarioKey === "booleano") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; localStorage.setItem("login", false);</div>
                <div class="term-line" style="color: var(--rose);">&gt; if (localStorage.getItem("login")) ➔ ¡Da TRUE porque "false" es string! ❌</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const activo = JSON.parse(localStorage.getItem("login"));</div>
                <div class="term-line" style="color: var(--cyan);">&gt; if (activo) ➔ Da FALSE correctamente (booleano real) ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Booleanos:</strong> El string <code>'false'</code> no está vacío y evalúa como <em>truthy</em>; usa <code>JSON.parse()</code> o compara <code>=== 'true'</code>."; // Evalúa condición
        } else if (scenarioKey === "corrupto") { // Instrucción JavaScript
            terminalImplicit.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; JSON.parse("{json_malformado"); // Sin try...catch</div>
                <div class="term-line" style="color: var(--rose);">&gt; ❌ Uncaught SyntaxError: Unexpected token (Rompe la App)</div>
            `;
            terminalSerialized.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; try { return JSON.parse(raw); } catch (e) { return null; }</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Captura el error silenciosamente y aplica valores por defecto ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Blindaje con try...catch:</strong> Protege siempre <code>JSON.parse()</code> por si el almacenamiento fue editado o corrompido externamente."; // Evalúa condición
        }
    }

    // Actualiza la visualización de la analogía del Archivador de Oficina en el Slide 8
    static updateOfficeView(officeState) { // Instrucción JavaScript
        const titleRight = document.getElementById("officeTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("officeSubRight"); // Obtiene referencia DOM para "subRight"
        const avatarRight = document.getElementById("officeAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const itemsRight = document.getElementById("officeItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("officeStatusRight"); // Obtiene referencia DOM para "statusRight"
        const bannerText = document.getElementById("officeBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("officeBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        if (officeState === "local") { // Evalúa condición
            if (avatarRight) avatarRight.textContent = "🗄️"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. El Archivador Metálico (LocalStorage)"; // Evalúa condición
            if (subRight) subRight.textContent = "Persistencia Permanente en el Rincón de la Oficina"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Lo que guardes ahí permanece intacto para siempre</div>
                <div class="ws-item highlight-item">Aunque apagues la luz y cierres la oficina por vacaciones, sigue ahí</div>
            `;
            if (statusRight) statusRight.textContent = "Sobrevive al cierre de pestañas, reinicios del navegador y del sistema"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🗄️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Archivador Metálico (LocalStorage):</strong> Ideal para guardar preferencias permanentes que deben seguir ahí cuando el usuario regrese días después."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (avatarRight) avatarRight.textContent = "📝"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. El Bloc de Notas Temporal (SessionStorage)"; // Evalúa condición
            if (subRight) subRight.textContent = "Aislado para el Cliente Actual (Una Sola Pestaña)"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Mientras atiendes al cliente (pestaña abierta), el bloc mantiene sus notas</div>
                <div class="ws-item highlight-item">En cuanto el cliente se va y cierras la pestaña, tiras el papel</div>
            `;
            if (statusRight) statusRight.textContent = "Se destruye automáticamente al cerrar la pestaña del navegador"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "📝"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Bloc de Notas (SessionStorage):</strong> Perfecto para asistentes o formularios multipaso que no deben persistir una vez cerrada la pestaña."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
