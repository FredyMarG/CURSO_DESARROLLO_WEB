/**
 * ==============================================================================
 * 🌐 JAVASCRIPT MASTER LEVEL: LAS APIs EN EL DESARROLLO WEB
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, simuladores HTTP y playground
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
    // Criterio actualmente seleccionado en el comparador SOAP vs RESTful (Slide 4)
    activeScenario: "formato",
    // Escenario activo en la analogía del camarero en el restaurante (Slide 8: '200' o '404')
    activeWaiterState: "200"
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


// --- SERVIDOR SIMULADO DE FETCH PARA EL PLAYGROUND ---
// Permite que las URLs pedagógicas del curso ('api.ejemplo.com', 'api.ficticia.com',
// 'api.bibliotecaescolar.edu') respondan de forma realista y sin errores de red.
function crearFetchSimulado(consolaVirtual) {
    return function fetchPlayground(url, opciones = {}) {
        const metodo = (opciones.method || "GET").toUpperCase();
        const cabeceras = opciones.headers || {};

        return new Promise((resolve) => {
            setTimeout(() => {
                // Caso 1: Ruta simulada con error 404
                if (String(url).includes("404") || String(url).includes("no-existe")) {
                    resolve({
                        ok: false,
                        status: 404,
                        statusText: "Not Found",
                        url: url,
                        headers: cabeceras,
                        json: async () => ({
                            error: "Recurso no encontrado en el servidor",
                            codigo: 404
                        })
                    });
                    return;
                }

                // Caso 2: Petición POST (Creación de recurso en /productos o /libros)
                if (metodo === "POST") {
                    let datosEnviados = {};
                    try {
                        datosEnviados = opciones.body ? JSON.parse(opciones.body) : {};
                    } catch (e) {
                        datosEnviados = { rawBody: opciones.body };
                    }

                    resolve({
                        ok: true,
                        status: 201,
                        statusText: "Created",
                        url: url,
                        headers: cabeceras,
                        json: async () => ({
                            estado: "201 Created ✅",
                            endpoint: url,
                            cabeceraContentType: cabeceras["Content-Type"] || cabeceras["content-type"] || "no especificada",
                            recursoCreado: {
                                id: 101,
                                ...datosEnviados
                            }
                        })
                    });
                    return;
                }

                // Caso 3: Biblioteca Escolar (GET /libros)
                if (String(url).includes("/libros")) {
                    resolve({
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        url: url,
                        json: async () => ([
                            { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: true },
                            { id: 2, titulo: "El Quijote", autor: "Miguel de Cervantes", disponible: true }
                        ])
                    });
                    return;
                }

                // Caso 4: Petición GET por defecto (/usuarios/42 o /perfil)
                resolve({
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    url: url,
                    json: async () => ({
                        id: 42,
                        nombre: "Ana López",
                        rol: "Desarrolladora",
                        activo: true,
                        endpoint: url
                    })
                });
            }, 60);
        });
    };
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = {
    // Preset 1: Petición básica GET con fetch() y .then()
    "preset-api-1": `// ==========================================
// 1. PETICIÓN BÁSICA GET CON FETCH Y .THEN()
// ==========================================

console.log("Enviando petición GET al Endpoint '/v1/usuarios/42'...");

fetch('https://api.ejemplo.com/v1/usuarios/42')
  .then(response => {
      console.log("Código de estado HTTP:", response.status, response.statusText);
      return response.json();
  })
  .then(data => {
      console.log("Datos JSON recibidos :", data);
  });`,

    // Preset 2: Serialización y Parseo del formato JSON
    "preset-api-2": `// ==========================================
// 2. SERIALIZACIÓN Y PARSEO DEL FORMATO JSON
// ==========================================

// 1. Objeto nativo de JavaScript en memoria:
const perfilJS = {
    id: 42,
    nombre: "Ana López",
    rol: "Desarrolladora",
    activo: true
};

// 2. Serializar (Objeto JS ➔ Texto JSON para enviar en el Body):
const cadenaJSON = JSON.stringify(perfilJS);
console.log("Texto JSON (stringify) :", cadenaJSON);
console.log("Tipo de dato           :", typeof cadenaJSON);

// 3. Parsear (Texto JSON recibido ➔ Objeto JS manipulable):
const objetoRecuperado = JSON.parse(cadenaJSON);
console.log("Objeto parseado        :", objetoRecuperado.nombre, "-", objetoRecuperado.rol);`,

    // Preset 3: Asincronía moderna con async/await y response.ok
    "preset-api-3": `// ==========================================
// 3. ASINCRONÍA CON ASYNC/AWAIT Y RESPONSE.OK
// ==========================================

async function consultarUsuario() {
    try {
        const response = await fetch("https://api.ejemplo.com/v1/usuarios/42");

        // Buena práctica obligatoria: verificar siempre response.ok (códigos 200-299)
        if (!response.ok) {
            throw new Error(\`Error HTTP: \${response.status}\`);
        }

        const usuario = await response.json();
        console.log("Usuario verificado ✅:", usuario);
    } catch (error) {
        console.error("Error capturado:", error.message);
    }
}

consultarUsuario();`,

    // Preset 4: Petición POST enviando Headers y Body JSON
    "preset-api-4": `// ==========================================
// 4. PETICIÓN POST CON HEADERS Y BODY JSON
// ==========================================

async function guardarRecurso() {
    const nuevoUsuario = {
        nombre: "Carlos Mendoza",
        rol: "Arquitecto Cloud",
        activo: true
    };

    const response = await fetch("https://api.ejemplo.com/v1/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer token_simulado_env"
        },
        body: JSON.stringify(nuevoUsuario)
    });

    const confirmacion = await response.json();
    console.log("Respuesta del servidor (POST):", confirmacion);
}

guardarRecurso();`,

    // Preset 5: Manejo de Errores HTTP 404 en bloque try...catch
    "preset-api-5": `// ==========================================
// 5. MANEJO DE ERRORES HTTP 404 (NOT FOUND)
// ==========================================

async function buscarRecursoInexistente() {
    try {
        console.log("Solicitando ruta inexistente '/v1/no-existe'...");
        const response = await fetch("https://api.ejemplo.com/v1/no-existe");

        // Fetch NO lanza error automático en 404; 'response.ok' lo detecta:
        if (!response.ok) {
            throw new Error(\`El servidor respondió con estado \${response.status} (\${response.statusText})\`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Capturado en catch 🛡️:", error.message);
    }
}

buscarRecursoInexistente();`,

    // Preset 6: Error común: Olvidar await vs. Resolución correcta
    "preset-api-6": `// ==========================================
// 6. ERROR COMÚN: OLVIDAR AWAIT EN PROMESAS
// ==========================================

// ❌ INCORRECTO: Intentar leer datos sin esperar a que la Promesa se resuelva
const respuestaSinAwait = fetch("https://api.ejemplo.com/v1/usuarios/42");
console.log("Lectura síncrona sin await (❌):", respuestaSinAwait.nombre); // undefined

// ✅ CORRECTO: Esperar la resolución con async / await
async function lecturaCorrecta() {
    const response = await fetch("https://api.ejemplo.com/v1/usuarios/42");
    const datos = await response.json();
    console.log("Lectura asíncrona con await (✅):", datos.nombre, "-", datos.rol);
}

lecturaCorrecta();`,

    // Presets de los 3 Retos del Curso
    "preset-ex-api1": `// RETO NIVEL 1 (Junior): Diseño de Endpoints RESTful para Biblioteca Escolar
// 1. Obtener la lista completa de libros (Método GET):
//    Endpoint: https://api.bibliotecaescolar.edu/v1/libros
// 2. Registrar un libro nuevo en el catálogo (Método POST):
//    Endpoint: https://api.bibliotecaescolar.edu/v1/libros

async function probarBibliotecaREST() {
    // 1. Petición GET para listar todos los libros
    const resLista = await fetch("https://api.bibliotecaescolar.edu/v1/libros");
    const libros = await resLista.json();
    console.log("1. GET /v1/libros (Catálogo actual):", libros);

    // 2. Petición POST para registrar un libro nuevo
    const resNuevo = await fetch("https://api.bibliotecaescolar.edu/v1/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: "Rayuela", autor: "Julio Cortázar" })
    });
    const confirmacion = await resNuevo.json();
    console.log("2. POST /v1/libros (Libro registrado):", confirmacion);
}

probarBibliotecaREST();`,

    "preset-ex-api2": `// RETO NIVEL 2 (Semi-Senior): Optimizar conseguirDatos() con async/await y validación
async function conseguirDatos() {
    try {
        // 1. Esperamos la respuesta HTTP del servidor con 'await'
        const respuesta = await fetch("https://api.ejemplo.com/perfil");

        // 2. Validamos que el estado HTTP sea exitoso (200-299)
        if (!respuesta.ok) {
            throw new Error(\`Error del servidor: \${respuesta.status} (\${respuesta.statusText})\`);
        }

        // 3. Transformamos el cuerpo a JSON esperando con 'await'
        const usuario = await respuesta.json();
        return usuario;
    } catch (error) {
        console.error("Error en conseguirDatos():", error.message);
        return null;
    }
}

conseguirDatos().then(perfil => {
    console.log("Perfil obtenido con éxito:", perfil);
});`,

    "preset-ex-api3": `// RETO NIVEL 3 (Avanzado): Petición POST a https://api.ficticia.com/productos
async function registrarProducto() {
    const url = "https://api.ficticia.com/productos";
    const producto = {
        nombre: "Teclado Mecánico",
        precio: 85
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error(\`Error HTTP: \${response.status}\`);
        }

        const resultado = await response.json();
        console.log("Producto registrado en servidor:", resultado);
    } catch (error) {
        console.error("Fallo al enviar producto:", error.message);
    }
}

registrarProducto();`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController {
    static init() {
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-api-1");
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

    // Ejecuta el código del Playground capturando salidas síncronas y asíncronas (fetch / async-await)
    static async runPlaygroundCode() {
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
                if (arg instanceof Promise) {
                    return "[Objeto Promise pendiente]";
                }
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

        // Creamos un objeto console dedicado para capturar logs incluso dentro de promesas diferidas
        const customConsole = {
            log: (...args) => {
                window.console.log(...args);
                appendVirtualLog("info", args);
            },
            error: (...args) => {
                window.console.error(...args);
                appendVirtualLog("error", args);
            },
            warn: (...args) => {
                window.console.warn(...args);
                appendVirtualLog("warn", args);
            },
            info: (...args) => {
                window.console.info(...args);
                appendVirtualLog("info", args);
            }
        };

        // Creamos el simulador inteligente de fetch para las rutas del curso
        const simulatedFetch = crearFetchSimulado(customConsole);

        try {
            // Ejecutamos el código dentro de un envoltorio asíncrono con console y fetch inyectados
            const runFn = new Function(
                "console",
                "fetch",
                `"use strict"; return (async () => {\n${codeToRun}\n})();`
            );
            await runFn(customConsole, simulatedFetch);

            SoundEffects.success();
            AppController.showToast("Código ejecutado con éxito");
        } catch (err) {
            customConsole.error("Excepción:", err.name, "-", err.message);
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
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

        // Slide 2: Simular Petición Fetch en Vivo
        const btnTestApiIntro = document.getElementById("btnTestApiIntro");
        const statusApiIntro = document.getElementById("testApiIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        if (btnTestApiIntro && consoleOutput1) {
            btnTestApiIntro.addEventListener("click", () => {
                SoundEffects.success();
                if (statusApiIntro) statusApiIntro.textContent = "200 OK (JSON Recibido)";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; GET https://api.ejemplo.com/v1/usuarios/42 ➔ 200 OK</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; { "id": 42, "nombre": "Ana López", "rol": "Desarrolladora", "activo": true }</div>
                `;
                this.showToast("Respuesta JSON recibida del Endpoint");
            });
        }

        // Slide 3: Inspeccionar Comportamiento de los Verbos HTTP
        const btnCheckHttpMethods = document.getElementById("btnCheckHttpMethods");
        const httpMethodsResult = document.getElementById("httpMethodsResult");
        if (btnCheckHttpMethods && httpMethodsResult) {
            btnCheckHttpMethods.addEventListener("click", () => {
                SoundEffects.success();
                httpMethodsResult.innerHTML = `
                    <code>GET ➔ 200 OK (Lee datos)</code> |
                    <code>POST ➔ 201 Created (Crea con Body JSON)</code><br>
                    <code>PUT / PATCH ➔ 200 OK (Actualiza)</code> |
                    <code>DELETE ➔ 200/204 (Elimina recurso)</code><br>
                    <small style="color: var(--emerald);">Los Headers acompañan la petición indicando metadatos como 'Content-Type: application/json'.</small>
                `;
            });
        }

        // Slide 4: Comparador de Arquitecturas SOAP vs RESTful
        const scenarioBtns = document.querySelectorAll("[data-scenario]");
        scenarioBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                scenarioBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeScenario = btn.getAttribute("data-scenario");
                SoundEffects.click();
            });
        });

        const btnCompareApiModes = document.getElementById("btnCompareApiModes");
        if (btnCompareApiModes) {
            btnCompareApiModes.addEventListener("click", () => {
                this.runScenarioSimulation(AppState.activeScenario);
            });
        }

        // Slide 5: Pestañas de JSON y Flujo de Decisión
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

        // Slide 5.1: Botón Serialización y Parseo JSON
        const btnTestJsonParse = document.getElementById("btnTestJsonParse");
        const jsonParseResult = document.getElementById("jsonParseResult");
        if (btnTestJsonParse && jsonParseResult) {
            btnTestJsonParse.addEventListener("click", () => {
                SoundEffects.success();
                const obj = { id: 42, nombre: "Ana López", rol: "Desarrolladora", activo: true };
                const str = JSON.stringify(obj);
                const parsed = JSON.parse(str);
                jsonParseResult.innerHTML = `
                    <code>JSON.stringify(obj) ➔ '${str}' (tipo: ${typeof str})</code><br>
                    <span style="color: var(--emerald);"><code>JSON.parse(str).nombre ➔ "${parsed.nombre}"</code> (Objeto nativo de JS restaurado).</span>
                `;
            });
        }

        // Slide 5.2: Botón Bifurcación de Códigos HTTP (2xx vs 4xx/5xx)
        const btnTestStatusFlow = document.getElementById("btnTestStatusFlow");
        const statusFlowResult = document.getElementById("statusFlowResult");
        if (btnTestStatusFlow && statusFlowResult) {
            btnTestStatusFlow.addEventListener("click", () => {
                SoundEffects.success();
                statusFlowResult.innerHTML = `
                    <span style="color: var(--emerald);">✔ Si Código = 200 OK (2xx) ➔ Respuesta Exitosa ➔ Procesar JSON ➔ Renderizar en Pantalla.</span><br>
                    <span style="color: var(--amber);">⚠️ Si Código = 404 / 500 (4xx/5xx) ➔ Error en Petición/Servidor ➔ Capturar en catch ➔ Mostrar alerta.</span>
                `;
            });
        }

        // Slide 5.3: Botón Guardia de Seguridad response.ok
        const btnTestResponseOk = document.getElementById("btnTestResponseOk");
        const responseOkResult = document.getElementById("responseOkResult");
        if (btnTestResponseOk && responseOkResult) {
            btnTestResponseOk.addEventListener("click", () => {
                SoundEffects.success();
                responseOkResult.innerHTML = `
                    <code>Respuesta 404: { ok: false, status: 404 }</code><br>
                    <small style="color: var(--cyan);">Al evaluar <code>if (!response.ok) throw new Error(response.status)</code>, evitamos procesar un cuerpo vacío o inválido y saltamos directo al bloque <code>catch</code>.</small>
                `;
            });
        }

        // Slide 7: Prueba Petición GET con async/await
        const btnTestAsyncGet = document.getElementById("btnTestAsyncGet");
        const asyncGetResult = document.getElementById("asyncGetResult");
        if (btnTestAsyncGet && asyncGetResult) {
            btnTestAsyncGet.addEventListener("click", () => {
                SoundEffects.success();
                asyncGetResult.innerHTML = `
                    <code>await fetch("https://api.ejemplo.com/perfil") ➔ Estado 200 (res.ok === true)</code><br>
                    <small style="color: var(--emerald);">Datos extraídos: <code>{ id: 42, nombre: "Ana López", rol: "Desarrolladora" }</code></small>
                `;
            });
        }

        // Slide 7: Prueba Petición POST con Headers y Body JSON
        const btnTestAsyncPost = document.getElementById("btnTestAsyncPost");
        const asyncPostResult = document.getElementById("asyncPostResult");
        if (btnTestAsyncPost && asyncPostResult) {
            btnTestAsyncPost.addEventListener("click", () => {
                SoundEffects.success();
                asyncPostResult.innerHTML = `
                    <code>POST https://api.ficticia.com/productos ➔ Estado 201 Created</code><br>
                    <small style="color: var(--cyan);">Servidor recibió Header <code>Content-Type: application/json</code> y guardó: <code>{"nombre":"Teclado Mecánico","precio":85}</code></small>
                `;
            });
        }

        // Slide 8: Metáfora del Camarero en el Restaurante
        const waiterBtns = document.querySelectorAll("[data-waiter]");
        waiterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                waiterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeWaiterState = btn.getAttribute("data-waiter");
                SoundEffects.click();
                this.updateWaiterView(AppState.activeWaiterState);
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-api-1";
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
                const cheatText = `# GUÍA MAESTRA: LAS APIs EN EL DESARROLLO WEB

1. **¿Qué es una API?**
   Interfaz de código (Application Programming Interface) que comunica aplicaciones a través de la red sin exponer los detalles internos del servidor.

2. **Los 4 Componentes de una Petición HTTP:**
   - **Endpoint (Ruta):** URL del recurso (ej. \`https://api.ejemplo.com/v1/usuarios/42\`).
   - **Método HTTP (Verbo):** \`GET\` (leer), \`POST\` (crear), \`PUT/PATCH\` (actualizar), \`DELETE\` (eliminar).
   - **Headers (Cabeceras):** Metadatos como \`{ "Content-Type": "application/json" }\`.
   - **Body (Cuerpo):** Datos serializados con \`JSON.stringify(datos)\`.

3. **Consumo Seguro con async/await:**
   \`\`\`javascript
   async function conseguirDatos() {
       const res = await fetch("https://api.ejemplo.com/perfil");
       if (!res.ok) throw new Error(\`Error HTTP: \${res.status}\`);
       return await res.json();
   }
   \`\`\`

4. **Reglas de Oro:**
   - Validar siempre \`response.ok\` (los códigos 404/500 no rechazan la promesa de \`fetch\` automáticamente).
   - Nunca exponer API Keys privadas en el Front-end; usar variables de entorno (\`.env\`).
`;
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre SOAP y RESTful en el Slide 4
    static runScenarioSimulation(scenarioKey) {
        const terminalSoap = document.getElementById("terminalSoap");
        const terminalRest = document.getElementById("terminalRest");
        const feedbackText = document.getElementById("apiFeedbackText");
        if (!terminalSoap || !terminalRest) return;

        SoundEffects.transition();

        if (scenarioKey === "formato") {
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; &lt;soap:Envelope&gt;</div>
                <div class="term-line" style="color: var(--amber);">&gt;   &lt;soap:Body&gt;&lt;GetUsuario&gt;&lt;Id&gt;42&lt;/Id&gt;&lt;/GetUsuario&gt;&lt;/soap:Body&gt;</div>
                <div class="term-line" style="color: var(--amber);">&gt; &lt;/soap:Envelope&gt; // Exclusivamente XML verboso</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; { "id": 42, "nombre": "Ana López", "activo": true }</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Formato JSON ligero y nativo en JavaScript ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Formato de Datos:</strong> Mientras SOAP depende exclusivamente de XML, RESTful utiliza principalmente <code>JSON</code>, reduciendo el tamaño del mensaje.";
        } else if (scenarioKey === "arquitectura") {
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Contrato rígido WSDL (Web Services Description Language)</div>
                <div class="term-line" style="color: var(--amber);">&gt; Operaciones invocadas por procedimientos XML</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Recursos identificables por URLs: /v1/usuarios/42</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Métodos HTTP estándar: GET, POST, PUT, PATCH, DELETE</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Estructura y Contratos:</strong> RESTful aprovecha de forma directa los verbos y códigos de estado nativos del protocolo HTTP.";
        } else if (scenarioKey === "rendimiento") {
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Mayor consumo de ancho de banda por etiquetas XML</div>
                <div class="term-line" style="color: var(--amber);">&gt; Parseo XML más costoso en clientes móviles</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Carga útil (Payload) mínima y ultrarrápida</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Parseo instantáneo con response.json() en el navegador</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Ligereza y Velocidad:</strong> RESTful con JSON es el estándar indiscutible para aplicaciones web rápidas y móviles.";
        } else if (scenarioKey === "casos") {
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Sistemas bancarios tradicionales (Legacy)</div>
                <div class="term-line" style="color: var(--amber);">&gt; Telecomunicaciones y software corporativo cerrado</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Aplicaciones Web modernas (SPA, React, Vue, Node.js)</div>
                <div class="term-line" style="color: var(--cyan);">&gt; APIs públicas, microservicios y aplicaciones móviles</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Casos de Uso:</strong> Usa RESTful para el desarrollo web moderno y APIs públicas; SOAP persiste en integraciones empresariales heredadas.";
        }
    }

    // Actualiza la visualización de la analogía del camarero en el Slide 8
    static updateWaiterView(waiterState) {
        const titleRight = document.getElementById("waiterTitleRight");
        const subRight = document.getElementById("waiterSubRight");
        const avatarRight = document.getElementById("waiterAvatarRight");
        const itemsRight = document.getElementById("waiterItemsRight");
        const statusRight = document.getElementById("waiterStatusRight");
        const bannerText = document.getElementById("waiterBannerText");
        const bannerIcon = document.getElementById("waiterBannerIcon");

        const itemsLeft = document.getElementById("waiterItemsLeft");
        const statusLeft = document.getElementById("waiterStatusLeft");

        if (waiterState === "200") {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El comensal solicita el platillo #42 del menú</div>
                <div class="ws-item">Petición: GET /v1/menu/platillos/42</div>
            `;
            if (statusLeft) statusLeft.textContent = "El camarero lleva la orden a la cocina sin que tú entres a cocinar";

            if (avatarRight) avatarRight.textContent = "👨‍🍳";
            if (titleRight) titleRight.textContent = "2. La Cocina (Servidor Back-end)";
            if (subRight) subRight.textContent = "Respuesta 200 OK — Plato Servido (JSON)";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">El chef prepara el pedido con ingredientes de la Base de Datos</div>
                <div class="ws-item highlight-item">El camarero regresa con el plato: { "plato": "Paella", "listo": true }</div>
            `;
            if (statusRight) statusRight.textContent = "Intercambio seguro: tus datos se renderizan en la mesa (pantalla)";

            if (bannerIcon) bannerIcon.textContent = "🍽️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Pedido Exitoso (200 OK):</strong> El camarero (API) valida tu orden en la cocina y te entrega el plato listo (JSON) en tu mesa.";
            }
        } else {
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El comensal pide el platillo #999 (no existe en carta)</div>
                <div class="ws-item">Petición: GET /v1/menu/platillos/999</div>
            `;
            if (statusLeft) statusLeft.textContent = "El camarero consulta en la cocina si existe el recurso #999";

            if (avatarRight) avatarRight.textContent = "🚫";
            if (titleRight) titleRight.textContent = "2. Cocina Informa: Platillo Inexistente";
            if (subRight) subRight.textContent = "Respuesta 404 Not Found — Control de Errores";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">La cocina reporta que el platillo #999 no está en la Base de Datos</div>
                <div class="ws-item highlight-item">El camarero te avisa cortésmente: { "error": "Platillo no encontrado" }</div>
            `;
            if (statusRight) statusRight.textContent = "Detectado con if (!response.ok) y manejado en el bloque catch";

            if (bannerIcon) bannerIcon.textContent = "⚠️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>Error Controlado (404 Not Found):</strong> El restaurante no colapsa; el camarero (API) te informa el código de estado para que elijas otra opción.";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
