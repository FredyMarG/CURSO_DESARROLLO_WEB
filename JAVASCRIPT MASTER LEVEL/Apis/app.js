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
    // Criterio actualmente seleccionado en el comparador SOAP vs RESTful (Slide 4)
    activeScenario: "formato",
    // Escenario activo en la analogía del camarero en el restaurante (Slide 8: '200' o '404')
    activeWaiterState: "200"
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


// --- SERVIDOR SIMULADO DE FETCH PARA EL PLAYGROUND ---
// Permite que las URLs pedagógicas del curso ('api.ejemplo.com', 'api.ficticia.com',
// 'api.bibliotecaescolar.edu') respondan de forma realista y sin errores de red.
function crearFetchSimulado(consolaVirtual) { // Declara función
    return function fetchPlayground(url, opciones = {}) { // Retorna resultado
        const metodo = (opciones.method || "GET").toUpperCase(); // Declara e inicializa "metodo"
        const cabeceras = opciones.headers || {}; // Declara e inicializa "cabeceras"

        return new Promise((resolve) => { // Retorna resultado
            setTimeout(() => { // Instrucción JavaScript
                // Caso 1: Ruta simulada con error 404
                if (String(url).includes("404") || String(url).includes("no-existe")) { // Evalúa condición
                    resolve({ // Instrucción JavaScript
                        ok: false,
                        status: 404,
                        statusText: "Not Found",
                        url: url,
                        headers: cabeceras,
                        json: async () => ({ // Instrucción JavaScript
                            error: "Recurso no encontrado en el servidor",
                            codigo: 404
                        })
                    });
                    return; // Retorna resultado
                }

                // Caso 2: Petición POST (Creación de recurso en /productos o /libros)
                if (metodo === "POST") { // Evalúa condición
                    let datosEnviados = {}; // Declara e inicializa "datosEnviados"
                    try { // Inicia bloque protegido contra errores
                        datosEnviados = opciones.body ? JSON.parse(opciones.body) : {}; // Asigna valor
                    } catch (e) { // Instrucción JavaScript
                        datosEnviados = { rawBody: opciones.body }; // Asigna valor
                    }

                    resolve({ // Instrucción JavaScript
                        ok: true,
                        status: 201,
                        statusText: "Created",
                        url: url,
                        headers: cabeceras,
                        json: async () => ({ // Instrucción JavaScript
                            estado: "201 Created ✅",
                            endpoint: url,
                            cabeceraContentType: cabeceras["Content-Type"] || cabeceras["content-type"] || "no especificada",
                            recursoCreado: { // Instrucción JavaScript
                                id: 101,
                                ...datosEnviados
                            }
                        })
                    });
                    return; // Retorna resultado
                }

                // Caso 3: Biblioteca Escolar (GET /libros)
                if (String(url).includes("/libros")) { // Evalúa condición
                    resolve({ // Instrucción JavaScript
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        url: url,
                        json: async () => ([
                            { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", disponible: true },
                            { id: 2, titulo: "El Quijote", autor: "Miguel de Cervantes", disponible: true }
                        ])
                    });
                    return; // Retorna resultado
                }

                // Caso 4: Petición GET por defecto (/usuarios/42 o /perfil)
                resolve({ // Instrucción JavaScript
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    url: url,
                    json: async () => ({ // Instrucción JavaScript
                        id: 42,
                        nombre: "Ana López",
                        rol: "Desarrolladora",
                        activo: true,
                        endpoint: url
                    })
                });
            }, 60); // Ejecuta llamada o método
        });
    };
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = { // Declara e inicializa "CodePresets"
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
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-api-1"); // Ejecuta llamada o método
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

    // Ejecuta el código del Playground capturando salidas síncronas y asíncronas (fetch / async-await)
    static async runPlaygroundCode() { // Instrucción JavaScript
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
                if (arg instanceof Promise) { // Evalúa condición
                    return "[Objeto Promise pendiente]"; // Retorna resultado
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

        // Creamos un objeto console dedicado para capturar logs incluso dentro de promesas diferidas
        const customConsole = { // Declara e inicializa "customConsole"
            log: (...args) => { // Instrucción JavaScript
                window.console.log(...args); // Imprime salida en consola
                appendVirtualLog("info", args); // Ejecuta llamada o método
            },
            error: (...args) => { // Instrucción JavaScript
                window.console.error(...args); // Imprime salida en consola
                appendVirtualLog("error", args); // Ejecuta llamada o método
            },
            warn: (...args) => { // Instrucción JavaScript
                window.console.warn(...args); // Imprime salida en consola
                appendVirtualLog("warn", args); // Ejecuta llamada o método
            },
            info: (...args) => { // Instrucción JavaScript
                window.console.info(...args); // Imprime salida en consola
                appendVirtualLog("info", args); // Ejecuta llamada o método
            }
        };

        // Creamos el simulador inteligente de fetch para las rutas del curso
        const simulatedFetch = crearFetchSimulado(customConsole); // Declara e inicializa "simulatedFetch"

        try { // Inicia bloque protegido contra errores
            // Ejecutamos el código dentro de un envoltorio asíncrono con console y fetch inyectados
            const runFn = new Function(
                "console",
                "fetch",
                `"use strict"; return (async () => {\n${codeToRun}\n})();`
            );
            await runFn(customConsole, simulatedFetch); // Ejecuta llamada o método

            SoundEffects.success(); // Ejecuta llamada o método
            AppController.showToast("Código ejecutado con éxito"); // Ejecuta llamada o método
        } catch (err) { // Instrucción JavaScript
            customConsole.error("Excepción:", err.name, "-", err.message); // Ejecuta llamada o método
            SoundEffects.error(); // Ejecuta llamada o método
            AppController.showToast("Error al ejecutar código", true); // Ejecuta llamada o método
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

        // Slide 2: Simular Petición Fetch en Vivo
        const btnTestApiIntro = document.getElementById("btnTestApiIntro"); // Obtiene referencia DOM para "btnTestApiIntro"
        const statusApiIntro = document.getElementById("testApiIntroStatus"); // Obtiene referencia DOM para "statusApiIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        if (btnTestApiIntro && consoleOutput1) { // Evalúa condición
            btnTestApiIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                if (statusApiIntro) statusApiIntro.textContent = "200 OK (JSON Recibido)"; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; GET https://api.ejemplo.com/v1/usuarios/42 ➔ 200 OK</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; { "id": 42, "nombre": "Ana López", "rol": "Desarrolladora", "activo": true }</div>
                `;
                this.showToast("Respuesta JSON recibida del Endpoint"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Inspeccionar Comportamiento de los Verbos HTTP
        const btnCheckHttpMethods = document.getElementById("btnCheckHttpMethods"); // Obtiene referencia DOM para "btnCheckHttpMethods"
        const httpMethodsResult = document.getElementById("httpMethodsResult"); // Obtiene referencia DOM para "httpMethodsResult"
        if (btnCheckHttpMethods && httpMethodsResult) { // Evalúa condición
            btnCheckHttpMethods.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
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
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareApiModes = document.getElementById("btnCompareApiModes"); // Obtiene referencia DOM para "btnCompareApiModes"
        if (btnCompareApiModes) { // Evalúa condición
            btnCompareApiModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de JSON y Flujo de Decisión
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

        // Slide 5.1: Botón Serialización y Parseo JSON
        const btnTestJsonParse = document.getElementById("btnTestJsonParse"); // Obtiene referencia DOM para "btnTestJsonParse"
        const jsonParseResult = document.getElementById("jsonParseResult"); // Obtiene referencia DOM para "jsonParseResult"
        if (btnTestJsonParse && jsonParseResult) { // Evalúa condición
            btnTestJsonParse.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const obj = { id: 42, nombre: "Ana López", rol: "Desarrolladora", activo: true }; // Declara e inicializa "obj"
                const str = JSON.stringify(obj); // Declara e inicializa "str"
                const parsed = JSON.parse(str); // Declara e inicializa "parsed"
                jsonParseResult.innerHTML = `
                    <code>JSON.stringify(obj) ➔ '${str}' (tipo: ${typeof str})</code><br>
                    <span style="color: var(--emerald);"><code>JSON.parse(str).nombre ➔ "${parsed.nombre}"</code> (Objeto nativo de JS restaurado).</span>
                `;
            });
        }

        // Slide 5.2: Botón Bifurcación de Códigos HTTP (2xx vs 4xx/5xx)
        const btnTestStatusFlow = document.getElementById("btnTestStatusFlow"); // Obtiene referencia DOM para "btnTestStatusFlow"
        const statusFlowResult = document.getElementById("statusFlowResult"); // Obtiene referencia DOM para "statusFlowResult"
        if (btnTestStatusFlow && statusFlowResult) { // Evalúa condición
            btnTestStatusFlow.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                statusFlowResult.innerHTML = `
                    <span style="color: var(--emerald);">✔ Si Código = 200 OK (2xx) ➔ Respuesta Exitosa ➔ Procesar JSON ➔ Renderizar en Pantalla.</span><br>
                    <span style="color: var(--amber);">⚠️ Si Código = 404 / 500 (4xx/5xx) ➔ Error en Petición/Servidor ➔ Capturar en catch ➔ Mostrar alerta.</span>
                `;
            });
        }

        // Slide 5.3: Botón Guardia de Seguridad response.ok
        const btnTestResponseOk = document.getElementById("btnTestResponseOk"); // Obtiene referencia DOM para "btnTestResponseOk"
        const responseOkResult = document.getElementById("responseOkResult"); // Obtiene referencia DOM para "responseOkResult"
        if (btnTestResponseOk && responseOkResult) { // Evalúa condición
            btnTestResponseOk.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                responseOkResult.innerHTML = `
                    <code>Respuesta 404: { ok: false, status: 404 }</code><br>
                    <small style="color: var(--cyan);">Al evaluar <code>if (!response.ok) throw new Error(response.status)</code>, evitamos procesar un cuerpo vacío o inválido y saltamos directo al bloque <code>catch</code>.</small>
                `;
            });
        }

        // Slide 7: Prueba Petición GET con async/await
        const btnTestAsyncGet = document.getElementById("btnTestAsyncGet"); // Obtiene referencia DOM para "btnTestAsyncGet"
        const asyncGetResult = document.getElementById("asyncGetResult"); // Obtiene referencia DOM para "asyncGetResult"
        if (btnTestAsyncGet && asyncGetResult) { // Evalúa condición
            btnTestAsyncGet.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                asyncGetResult.innerHTML = `
                    <code>await fetch("https://api.ejemplo.com/perfil") ➔ Estado 200 (res.ok === true)</code><br>
                    <small style="color: var(--emerald);">Datos extraídos: <code>{ id: 42, nombre: "Ana López", rol: "Desarrolladora" }</code></small>
                `;
            });
        }

        // Slide 7: Prueba Petición POST con Headers y Body JSON
        const btnTestAsyncPost = document.getElementById("btnTestAsyncPost"); // Obtiene referencia DOM para "btnTestAsyncPost"
        const asyncPostResult = document.getElementById("asyncPostResult"); // Obtiene referencia DOM para "asyncPostResult"
        if (btnTestAsyncPost && asyncPostResult) { // Evalúa condición
            btnTestAsyncPost.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                asyncPostResult.innerHTML = `
                    <code>POST https://api.ficticia.com/productos ➔ Estado 201 Created</code><br>
                    <small style="color: var(--cyan);">Servidor recibió Header <code>Content-Type: application/json</code> y guardó: <code>{"nombre":"Teclado Mecánico","precio":85}</code></small>
                `;
            });
        }

        // Slide 8: Metáfora del Camarero en el Restaurante
        const waiterBtns = document.querySelectorAll("[data-waiter]"); // Obtiene referencia DOM para "waiterBtns"
        waiterBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                waiterBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeWaiterState = btn.getAttribute("data-waiter"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                this.updateWaiterView(AppState.activeWaiterState); // Ejecuta llamada o método
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-api-1"; // Declara e inicializa "currentPreset"
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
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación comparativa entre SOAP y RESTful en el Slide 4
    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalSoap = document.getElementById("terminalSoap"); // Obtiene referencia DOM para "terminalSoap"
        const terminalRest = document.getElementById("terminalRest"); // Obtiene referencia DOM para "terminalRest"
        const feedbackText = document.getElementById("apiFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalSoap || !terminalRest) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "formato") { // Evalúa condición
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; &lt;soap:Envelope&gt;</div>
                <div class="term-line" style="color: var(--amber);">&gt;   &lt;soap:Body&gt;&lt;GetUsuario&gt;&lt;Id&gt;42&lt;/Id&gt;&lt;/GetUsuario&gt;&lt;/soap:Body&gt;</div>
                <div class="term-line" style="color: var(--amber);">&gt; &lt;/soap:Envelope&gt; // Exclusivamente XML verboso</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; { "id": 42, "nombre": "Ana López", "activo": true }</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // Formato JSON ligero y nativo en JavaScript ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Formato de Datos:</strong> Mientras SOAP depende exclusivamente de XML, RESTful utiliza principalmente <code>JSON</code>, reduciendo el tamaño del mensaje."; // Evalúa condición
        } else if (scenarioKey === "arquitectura") { // Instrucción JavaScript
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Contrato rígido WSDL (Web Services Description Language)</div>
                <div class="term-line" style="color: var(--amber);">&gt; Operaciones invocadas por procedimientos XML</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Recursos identificables por URLs: /v1/usuarios/42</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Métodos HTTP estándar: GET, POST, PUT, PATCH, DELETE</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Estructura y Contratos:</strong> RESTful aprovecha de forma directa los verbos y códigos de estado nativos del protocolo HTTP."; // Evalúa condición
        } else if (scenarioKey === "rendimiento") { // Instrucción JavaScript
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Mayor consumo de ancho de banda por etiquetas XML</div>
                <div class="term-line" style="color: var(--amber);">&gt; Parseo XML más costoso en clientes móviles</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Carga útil (Payload) mínima y ultrarrápida</div>
                <div class="term-line" style="color: var(--cyan);">&gt; Parseo instantáneo con response.json() en el navegador</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Ligereza y Velocidad:</strong> RESTful con JSON es el estándar indiscutible para aplicaciones web rápidas y móviles."; // Evalúa condición
        } else if (scenarioKey === "casos") { // Instrucción JavaScript
            terminalSoap.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; Sistemas bancarios tradicionales (Legacy)</div>
                <div class="term-line" style="color: var(--amber);">&gt; Telecomunicaciones y software corporativo cerrado</div>
            `;
            terminalRest.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; Aplicaciones Web modernas (SPA, React, Vue, Node.js)</div>
                <div class="term-line" style="color: var(--cyan);">&gt; APIs públicas, microservicios y aplicaciones móviles</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Casos de Uso:</strong> Usa RESTful para el desarrollo web moderno y APIs públicas; SOAP persiste en integraciones empresariales heredadas."; // Evalúa condición
        }
    }

    // Actualiza la visualización de la analogía del camarero en el Slide 8
    static updateWaiterView(waiterState) { // Instrucción JavaScript
        const titleRight = document.getElementById("waiterTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("waiterSubRight"); // Obtiene referencia DOM para "subRight"
        const avatarRight = document.getElementById("waiterAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const itemsRight = document.getElementById("waiterItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("waiterStatusRight"); // Obtiene referencia DOM para "statusRight"
        const bannerText = document.getElementById("waiterBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("waiterBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        const itemsLeft = document.getElementById("waiterItemsLeft"); // Obtiene referencia DOM para "itemsLeft"
        const statusLeft = document.getElementById("waiterStatusLeft"); // Obtiene referencia DOM para "statusLeft"

        if (waiterState === "200") { // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El comensal solicita el platillo #42 del menú</div>
                <div class="ws-item">Petición: GET /v1/menu/platillos/42</div>
            `;
            if (statusLeft) statusLeft.textContent = "El camarero lleva la orden a la cocina sin que tú entres a cocinar"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "👨‍🍳"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. La Cocina (Servidor Back-end)"; // Evalúa condición
            if (subRight) subRight.textContent = "Respuesta 200 OK — Plato Servido (JSON)"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">El chef prepara el pedido con ingredientes de la Base de Datos</div>
                <div class="ws-item highlight-item">El camarero regresa con el plato: { "plato": "Paella", "listo": true }</div>
            `;
            if (statusRight) statusRight.textContent = "Intercambio seguro: tus datos se renderizan en la mesa (pantalla)"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🍽️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Pedido Exitoso (200 OK):</strong> El camarero (API) valida tu orden en la cocina y te entrega el plato listo (JSON) en tu mesa."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El comensal pide el platillo #999 (no existe en carta)</div>
                <div class="ws-item">Petición: GET /v1/menu/platillos/999</div>
            `;
            if (statusLeft) statusLeft.textContent = "El camarero consulta en la cocina si existe el recurso #999"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🚫"; // Evalúa condición
            if (titleRight) titleRight.textContent = "2. Cocina Informa: Platillo Inexistente"; // Evalúa condición
            if (subRight) subRight.textContent = "Respuesta 404 Not Found — Control de Errores"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">La cocina reporta que el platillo #999 no está en la Base de Datos</div>
                <div class="ws-item highlight-item">El camarero te avisa cortésmente: { "error": "Platillo no encontrado" }</div>
            `;
            if (statusRight) statusRight.textContent = "Detectado con if (!response.ok) y manejado en el bloque catch"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "⚠️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Error Controlado (404 Not Found):</strong> El restaurante no colapsa; el camarero (API) te informa el código de estado para que elijas otra opción."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
