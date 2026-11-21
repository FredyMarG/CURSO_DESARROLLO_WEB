/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: EL OPERADOR TERNARIO (? :)
 * ==============================================================================
 * Archivo: app.js
 * Propósito: Motor interactivo de la presentación web, simuladores y playground
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
    // Escenario actualmente seleccionado en el comparador de if/else vs ternario (Slide 4)
    activeScenario: "tarifa",
    // Estado del interruptor en la analogía de la luz (Slide 8: 'on' o 'off')
    activeSwitchState: "on"
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
    static playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) { // Instrucción JavaScript
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return; // Evalúa condición

        try { // Inicia bloque protegido contra errores
            // Aseguramos que el AudioContext esté inicializado
            this.init(); // Ejecuta llamada o método
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return; // Evalúa condición

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === 'suspended') { // Evalúa condición
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
        this.playTone(600, 'triangle', 0.04, 0.03); // Ejecuta llamada o método
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() { // Instrucción JavaScript
        this.playTone(523.25, 'sine', 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() { // Instrucción JavaScript
        this.playTone(320, 'sine', 0.06, 0.03); // Ejecuta llamada o método
        setTimeout(() => this.playTone(480, 'sine', 0.08, 0.03), 40); // Ejecuta llamada o método
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static error() { // Instrucción JavaScript
        this.playTone(280, 'sawtooth', 0.15, 0.04); // Ejecuta llamada o método
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 9 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = { // Declara e inicializa "CodePresets"
    // Preset 1: Asignación directa inmutable con const
    "preset-ternary-1": `// ==========================================
// 1. ASIGNACIÓN DIRECTA INMUTABLE CON 'const'
// ==========================================

const puntaje = 85;

// El operador ternario devuelve un valor evaluado inmediatamente
const resultado = puntaje >= 60 ? "Aprobado ✅" : "Reprobado ❌";

console.log("Puntaje obtenido :", puntaje);
console.log("Resultado final  :", resultado);`,

    // Preset 2: Evaluación de Truthy y Falsy (Coerción)
    "preset-ternary-2": `// ==========================================
// 2. EVALUACIÓN DE VALORES TRUTHY Y FALSY
// ==========================================

const probarCoercion = (valor, etiqueta) => {
    const estado = valor ? "Truthy (Verdadero)" : "Falsy (Falso)";
    console.log(\`\${etiqueta} ➔ \${estado}\`);
};

probarCoercion(0, "Número 0");
probarCoercion("", "String vacío ''");
probarCoercion(null, "Valor null");
probarCoercion(undefined, "Valor undefined");
probarCoercion(NaN, "Valor NaN");
probarCoercion("Hola", "String 'Hola'");
probarCoercion([], "Array vacío []");
probarCoercion({}, "Objeto vacío {}");`,

    // Preset 3: Inyección en Template Literals (${ ? : })
    "preset-ternary-3": `// ==========================================
// 3. INYECCIÓN EN TEMPLATE LITERALS (\${ ? : })
// ==========================================

const carrito1 = 1;
const carrito2 = 5;

// Podemos calcular dinámicamente plurales dentro del texto:
const mensaje1 = \`Tienes \${carrito1} artículo\${carrito1 === 1 ? "" : "s"} en el pedido.\`;
const mensaje2 = \`Tienes \${carrito2} artículo\${carrito2 === 1 ? "" : "s"} en el pedido.\`;

console.log("Caso singular :", mensaje1);
console.log("Caso plural   :", mensaje2);`,

    // Preset 4: Función Flecha con Retorno Ternario
    "preset-ternary-4": `// ==========================================
// 4. FUNCIÓN FLECHA CON RETORNO TERNARIO
// ==========================================

// Retorno implícito de una sola línea combinando flecha y ternario:
const clasificarTemperatura = temp => 
    temp > 30 ? "Calor intenso 🔥" : "Clima agradable ⛅";

console.log("35°C :", clasificarTemperatura(35));
console.log("22°C :", clasificarTemperatura(22));`,

    // Preset 5: Condición Compuesta con Paréntesis Legibles
    "preset-ternary-5": `// ==========================================
// 5. CONDICIÓN COMPUESTA CON PARÉNTESIS
// ==========================================

const salario = 4500;
const historialLimpio = true;
const antiguedadMeses = 24;

// Los paréntesis delimitan de forma cristalina la pregunta lógica:
const calificaCredito = (salario >= 3000 && historialLimpio && antiguedadMeses >= 12)
    ? "Apto para crédito hipotecario 🏦"
    : "Requisitos insuficientes ⚠️";

console.log("Evaluación crediticia:", calificaCredito);`,

    // Preset 6: Antipatrón Anidado vs. Object Lookup
    "preset-ternary-6": `// ==========================================
// 6. ANTIPATRÓN ANIDADO VS. OBJECT LOOKUP
// ==========================================

const codigoRol = "MOD";

// ❌ Antipatrón anidado (evitar en producción):
const rolAnidado = codigoRol === "ADM" ? "Admin" 
                 : codigoRol === "MOD" ? "Moderador" 
                 : codigoRol === "USR" ? "Usuario" 
                 : "Invitado";
console.log("Antipatrón anidado :", rolAnidado);

// ✅ Solución profesional: Object Lookup (Mapa de Diccionario):
const rolesDiccionario = {
    ADM: "Admin",
    MOD: "Moderador",
    USR: "Usuario"
};
const rolLimpio = rolesDiccionario[codigoRol] || "Invitado";
console.log("Solución limpia    :", rolLimpio);`,

    // Presets de los retos
    "preset-ex-ternary1": `// RETO 1: Número Par o Impar (Junior)
const numero = 7;

// El operador ternario evalúa el residuo (% 2):
const resultado = numero % 2 === 0 ? "Par" : "Impar";

console.log(\`¿El número \${numero} es par o impar?:\`, resultado);
console.log("Prueba con 10 :", 10 % 2 === 0 ? "Par" : "Impar");`,

    "preset-ex-ternary2": `// RETO 2: Optimización de Rol (Semi-Senior)
let rol = "admin";

// Estructura ternaria inmutable:
const acceso = rol === "admin" ? true : false;

console.log(\`Rol "\${rol}" -> Acceso:\`, acceso);
console.log("Simplificación booleana directa:", rol === "admin");`,

    "preset-ex-ternary3": `// RETO 3: obtenerMensajeEnvio con Retorno Implícito (Avanzado)
const obtenerMensajeEnvio = (totalCompra, esPremium) => 
    (totalCompra >= 50 || esPremium) ? "Envío Gratis" : "Costo de envío: $5";

console.log("Compra $30 sin membresía premium  :", obtenerMensajeEnvio(30, false));
console.log("Compra $60 sin membresía premium  :", obtenerMensajeEnvio(60, false));
console.log("Compra $20 con membresía premium  :", obtenerMensajeEnvio(20, true));`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes visuales y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-ternary-1"); // Ejecuta llamada o método
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

        // Slide 2: Probar Expresión en Vivo
        const btnTestTernaryIntro = document.getElementById("btnTestTernaryIntro"); // Obtiene referencia DOM para "btnTestTernaryIntro"
        const statusTernaryIntro = document.getElementById("testTernaryIntroStatus"); // Obtiene referencia DOM para "statusTernaryIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        if (btnTestTernaryIntro && consoleOutput1) { // Evalúa condición
            btnTestTernaryIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                if (statusTernaryIntro) statusTernaryIntro.textContent = "Evaluado con éxito"; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const edad = 20;</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; const estado = edad &gt;= 18 ? "Adulto" : "Menor de edad";</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; estado ➔ "Adulto" (Asignación inmutable limpia)</div>
                `;
                this.showToast("Expresión ternaria evaluada"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Probar valores Truthy / Falsy
        const btnCheckTruthy = document.getElementById("btnCheckTruthy"); // Obtiene referencia DOM para "btnCheckTruthy"
        const truthyResult = document.getElementById("truthyResult"); // Obtiene referencia DOM para "truthyResult"
        if (btnCheckTruthy && truthyResult) { // Evalúa condición
            btnCheckTruthy.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const evalua = v => v ? "Truthy ✅" : "Falsy ❌"; // Define función flecha "evalua"
                truthyResult.innerHTML = `
                    <code>0 ➔ ${evalua(0)}</code> | 
                    <code>"" ➔ ${evalua("")}</code> | 
                    <code>null ➔ ${evalua(null)}</code><br>
                    <code>"Texto" ➔ ${evalua("Texto")}</code> | 
                    <code>42 ➔ ${evalua(42)}</code> | 
                    <code>[] ➔ ${evalua([])}</code><br>
                    <small style="color: var(--emerald);">El motor evalúa automáticamente según la coerción de verdad o falsedad.</small>
                `;
            });
        }

        // Slide 4: Comparador de Escenarios if/else vs Ternario
        const scenarioBtns = document.querySelectorAll("[data-scenario]"); // Obtiene referencia DOM para "scenarioBtns"
        scenarioBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                scenarioBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeScenario = btn.getAttribute("data-scenario"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareTernaryModes = document.getElementById("btnCompareTernaryModes"); // Obtiene referencia DOM para "btnCompareTernaryModes"
        if (btnCompareTernaryModes) { // Evalúa condición
            btnCompareTernaryModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runScenarioSimulation(AppState.activeScenario); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de Precedencia y Flujo
        const precedenceTabs = document.querySelectorAll("[data-flow]"); // Obtiene referencia DOM para "precedenceTabs"
        precedenceTabs.forEach(tab => { // Instrucción JavaScript
            tab.addEventListener("click", () => { // Registra escuchador de eventos
                precedenceTabs.forEach(t => t.classList.remove("active")); // Modifica clases CSS del elemento
                tab.classList.add("active"); // Modifica clases CSS del elemento
                const viewId = `flow-view-${tab.getAttribute("data-flow")}`; // Declara e inicializa "viewId"
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active")); // Modifica clases CSS del elemento
                const targetView = document.getElementById(viewId); // Obtiene referencia DOM para "targetView"
                if (targetView) targetView.classList.add("active"); // Evalúa condición
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        // Slide 5: Botón Cortocircuito
        const btnTestShortCircuit = document.getElementById("btnTestShortCircuit"); // Obtiene referencia DOM para "btnTestShortCircuit"
        const shortCircuitResult = document.getElementById("shortCircuitResult"); // Obtiene referencia DOM para "shortCircuitResult"
        if (btnTestShortCircuit && shortCircuitResult) { // Evalúa condición
            btnTestShortCircuit.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                let funcionFalsaEjecutada = false; // Declara e inicializa "funcionFalsaEjecutada"
                const fnFalsa = () => { funcionFalsaEjecutada = true; return "Falso"; }; // Define función flecha "fnFalsa"
                const valor = true ? "Respuesta Verdadera" : fnFalsa(); // Declara e inicializa "valor"
                shortCircuitResult.innerHTML = `
                    <code>true ? "Respuesta Verdadera" : fnFalsa(); ➔ "${valor}"</code><br>
                    <span style="color: var(--emerald);">¿Se ejecutó fnFalsa()?: <strong>${funcionFalsaEjecutada}</strong> (Descartada por cortocircuito).</span>
                `;
            });
        }

        // Slide 5: Botón Precedencia
        const btnTestPrecedence = document.getElementById("btnTestPrecedence"); // Obtiene referencia DOM para "btnTestPrecedence"
        const precedenceResult = document.getElementById("precedenceResult"); // Obtiene referencia DOM para "precedenceResult"
        if (btnTestPrecedence && precedenceResult) { // Evalúa condición
            btnTestPrecedence.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const calc = 100 - 20 > 50 ? "Mayor a 50" : "Menor a 50"; // Declara e inicializa "calc"
                precedenceResult.innerHTML = `
                    <code>100 - 20 &gt; 50 ? "Mayor a 50" : "Menor a 50" ➔ "${calc}"</code><br>
                    <small>1. Se calculó 100 - 20 = 80.<br>2. Se comparó 80 &gt; 50 = true.<br>3. El ternario eligió la primera opción.</small>
                `;
            });
        }

        // Slide 5: Botón Paréntesis
        const btnTestParentheses = document.getElementById("btnTestParentheses"); // Obtiene referencia DOM para "btnTestParentheses"
        const parenthesesResult = document.getElementById("parenthesesResult"); // Obtiene referencia DOM para "parenthesesResult"
        if (btnTestParentheses && parenthesesResult) { // Evalúa condición
            btnTestParentheses.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const credito = (750 > 700 && 4000 > 3000) ? "Aprobado 🏦" : "Rechazado ⚠️"; // Declara e inicializa "credito"
                parenthesesResult.innerHTML = `
                    <code>(750 &gt; 700 &amp;&amp; 4000 &gt; 3000) ? "Aprobado" : "Rechazado" ➔ "${credito}"</code><br>
                    <small style="color: var(--cyan);">Los paréntesis dejan claro dónde termina la condición y empieza el retorno.</small>
                `;
            });
        }

        // Slide 7: Prueba Flecha con Ternario
        const btnTestArrowTernary = document.getElementById("btnTestArrowTernary"); // Obtiene referencia DOM para "btnTestArrowTernary"
        const arrowTernaryResult = document.getElementById("arrowTernaryResult"); // Obtiene referencia DOM para "arrowTernaryResult"
        if (btnTestArrowTernary && arrowTernaryResult) { // Evalúa condición
            btnTestArrowTernary.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const evaluarNota = nota => nota >= 90 ? "Sobresaliente 🌟" : "Estándar 👍"; // Define función flecha "evaluarNota"
                arrowTernaryResult.innerHTML = `
                    <code>evaluarNota(95) ➔ "${evaluarNota(95)}"</code><br>
                    <code>evaluarNota(75) ➔ "${evaluarNota(75)}"</code><br>
                    <small style="color: var(--emerald);">Retorno implícito limpio y sin necesidad de bloque {} ni palabra return.</small>
                `;
            });
        }

        // Slide 7: Prueba Template con Ternario
        const btnTestTemplateTernary = document.getElementById("btnTestTemplateTernary"); // Obtiene referencia DOM para "btnTestTemplateTernary"
        const templateTernaryResult = document.getElementById("templateTernaryResult"); // Obtiene referencia DOM para "templateTernaryResult"
        if (btnTestTemplateTernary && templateTernaryResult) { // Evalúa condición
            btnTestTemplateTernary.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const formatear = n => `Tienes ${n} artículo${n === 1 ? "" : "s"} en el pedido`; // Define función flecha "formatear"
                templateTernaryResult.innerHTML = `
                    <code>formatear(1) ➔ "${formatear(1)}"</code><br>
                    <code>formatear(4) ➔ "${formatear(4)}"</code><br>
                    <small style="color: var(--cyan);">Inyección directa dentro de \${} sin romper la cadena de texto.</small>
                `;
            });
        }

        // Slide 8: Metáfora del Interruptor
        const switchBtns = document.querySelectorAll("[data-switch]"); // Obtiene referencia DOM para "switchBtns"
        switchBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                switchBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeSwitchState = btn.getAttribute("data-switch"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                this.updateSwitchView(AppState.activeSwitchState); // Ejecuta llamada o método
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
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-ternary-1"; // Declara e inicializa "currentPreset"
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
                const cheatText = `# GUÍA MAESTRA: EL OPERADOR TERNARIO (? :) EN JAVASCRIPT

1. **Sintaxis y Anatomía:**
   condicion ? expresion_si_verdad : expresion_si_falsa;

2. **Expresión vs. Declaración:**
   A diferencia de 'if...else', el ternario devuelve un valor directo y permite usar 'const'.

3. **Inyección en Template Literals:**
   const txt = \`Tienes \${n} item\${n === 1 ? '' : 's'}\`;

4. **Retorno Implícito en Funciones Flecha:**
   const esAdulto = edad => edad >= 18 ? "Sí" : "No";

5. **Reglas de Oro:**
   - Cero anidamiento de ternarios múltiples (usar Object Lookup o switch).
   - Envolver condiciones compuestas entre paréntesis (a && b) ? c : d.
   - Evitar 'condicion ? true : false' redundante (usar directamente la condición).
`;
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación comparativa de escenarios para Slide 4
    static runScenarioSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalIfElse = document.getElementById("terminalIfElse"); // Obtiene referencia DOM para "terminalIfElse"
        const terminalTernary = document.getElementById("terminalTernary"); // Obtiene referencia DOM para "terminalTernary"
        const feedbackText = document.getElementById("ternaryFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalIfElse || !terminalTernary) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "tarifa") { // Evalúa condición
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let tarifa;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (esSocio) {</div>
                <div class="term-line" style="color: var(--amber);">&gt;   tarifa = "$2.00";</div>
                <div class="term-line" style="color: var(--amber);">&gt; } else {</div>
                <div class="term-line" style="color: var(--amber);">&gt;   tarifa = "$10.00";</div>
                <div class="term-line" style="color: var(--amber);">&gt; } // 6 líneas + variable mutable let</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const tarifa = esSocio ? "$2.00" : "$10.00";</div>
                <div class="term-line" style="color: var(--cyan);">&gt; // 1 sola línea + inmutable con const ✅</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Tarifa:</strong> El operador ternario condensa la evaluación y garantiza inmutabilidad con <code>const</code>."; // Evalúa condición
        } else if (scenarioKey === "descuento") { // Instrucción JavaScript
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let desc;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (total &gt; 100) { desc = 0.20; } else { desc = 0.05; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const descuento = total &gt; 100 ? 0.20 : 0.05;</div>
                <div class="term-line" style="color: var(--cyan);">&gt; totalConDesc = total * (1 - descuento);</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Descuento por Volumen:</strong> Cálculo directo sin estados intermedios mutables."; // Evalúa condición
        } else if (scenarioKey === "autenticacion") { // Instrucción JavaScript
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let ruta;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (autenticado) { ruta = "/dashboard"; } else { ruta = "/login"; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const destino = autenticado ? "/dashboard" : "/login";</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Autenticación:</strong> Muy común en routers modernos de React y Next.js."; // Evalúa condición
        } else if (scenarioKey === "tema") { // Instrucción JavaScript
            terminalIfElse.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; let claseTema;</div>
                <div class="term-line" style="color: var(--amber);">&gt; if (esModoNoche) { claseTema = "dark"; } else { claseTema = "light"; }</div>
            `;
            terminalTernary.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const claseTema = esModoNoche ? "dark" : "light";</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Tema Visual:</strong> Asignación directa e inmediata para atributos HTML o clases CSS."; // Evalúa condición
        }
    }

    // Actualiza la visualización de la analogía del interruptor en el Slide 8
    static updateSwitchView(switchState) { // Instrucción JavaScript
        const titleRight = document.getElementById("switchTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("switchSubRight"); // Obtiene referencia DOM para "subRight"
        const avatarRight = document.getElementById("switchAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const itemsRight = document.getElementById("switchItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("switchStatusRight"); // Obtiene referencia DOM para "statusRight"
        const bannerText = document.getElementById("switchBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("switchBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        const itemsLeft = document.getElementById("switchItemsLeft"); // Obtiene referencia DOM para "itemsLeft"
        const statusLeft = document.getElementById("switchStatusLeft"); // Obtiene referencia DOM para "statusLeft"

        if (switchState === "on") { // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El interruptor se presiona hacia arriba</div>
                <div class="ws-item">condicion = true</div>
            `;
            if (statusLeft) statusLeft.textContent = "El circuito eléctrico queda cerrado"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "💡"; // Evalúa condición
            if (titleRight) titleRight.textContent = "Bombilla Encendida"; // Evalúa condición
            if (subRight) subRight.textContent = "Expresión 1 Retornada"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">La bombilla ilumina la habitación al 100%</div>
                <div class="ws-item highlight-item">Retorno inmediato: "Luz Encendida"</div>
            `;
            if (statusRight) statusRight.textContent = "Bifurcación resuelta: la rama falsa se descarta"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "💡"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Interruptor ARRIBA (true):</strong> Se evalúa y devuelve únicamente la primera expresión ('Luz Encendida')."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">El interruptor se presiona hacia abajo</div>
                <div class="ws-item">condicion = false</div>
            `;
            if (statusLeft) statusLeft.textContent = "El circuito eléctrico queda abierto"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🌑"; // Evalúa condición
            if (titleRight) titleRight.textContent = "Habitación a Oscuras"; // Evalúa condición
            if (subRight) subRight.textContent = "Expresión 2 Retornada"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">No hay corriente, bombilla apagada</div>
                <div class="ws-item highlight-item">Retorno inmediato: "Luz Apagada"</div>
            `;
            if (statusRight) statusRight.textContent = "Bifurcación resuelta: la rama verdadera se descarta"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🌑"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>Interruptor ABAJO (false):</strong> Se evalúa y devuelve únicamente la segunda expresión ('Luz Apagada')."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
