/**
 * ==============================================================================
 * ⚡ JAVASCRIPT MASTER LEVEL: FUNCIONES FLECHA & CONCEPTOS AVANZADOS
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
    // Cantidad total de diapositivas en la presentación reorganizada (11 diapositivas)
    totalSlides: 12,
    // Booleano: true para modo diapositivas (slides), false para modo documento continuo
    isPresentationMode: true,
    // Booleano: true si los efectos de sonido sintetizados están activos
    soundEnabled: true,
    // Almacena la instancia de AudioContext para la síntesis de sonido en el navegador
    audioCtx: null,
    // Caso de prueba actualmente seleccionado en el simulador de 'this' (Slide 4)
    activeThisCase: "callback",
    // Caso seleccionado en las analogías del mundo real (Slide 9: 'mirror' o 'robot')
    activeAnalogy: "mirror",
    // Contador interno para la demostración del closure en vivo (Slide 7)
    closureCounterInstance: null
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


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 10 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = { // Declara e inicializa "CodePresets"
    // Preset 1: Retorno implícito vs explícito
    "preset-arrow-1": `// ==========================================
// 1. RETORNO IMPLÍCITO VS. EXPLÍCITO
// ==========================================

// Retorno implícito: una sola expresión sin {} ni return
const duplicar = x => x * 2;

// Retorno explícito con bloque {} (exige 'return')
const calcularTotal = (subtotal, tasaIva) => {
    const iva = subtotal * tasaIva;
    return subtotal + iva;
};

console.log("Duplicar 21 con retorno implícito :", duplicar(21));
console.log("Total $100 con IVA del 19%         :", calcularTotal(100, 0.19));`,

    // Preset 2: Retorno de objetos literales ({})
    "preset-arrow-2": `// ==========================================
// 2. RETORNO DE OBJETOS LITERALES Y ({})
// ==========================================

// ❌ Intento erróneo: JavaScript piensa que {} es un bloque de función
const crearUsuarioErroneo = (id, nombre) => { id: id, nombre: nombre };
console.log("Sin paréntesis (devuelve undefined):", crearUsuarioErroneo(1, "Ana"));

// ✅ Solución estándar: Envolver el objeto entre paréntesis ({})
const crearUsuarioCorrecto = (id, nombre, rol) => ({
    id,
    nombre,
    rol,
    activo: true,
    creadoEn: new Date().toLocaleTimeString()
});

console.log("Con paréntesis ({}) (objeto real)  :", crearUsuarioCorrecto(101, "Fredy", "Senior Dev"));`,

    // Preset 3: Ámbito léxico de 'this' en un temporizador
    "preset-arrow-3": `// ==========================================
// 3. ÁMBITO LÉXICO DE 'this' EN TEMPORIZADORES
// ==========================================

const contador = {
    valor: 0,
    nombre: "Contador de Métricas",
    
    iniciar() {
        console.log("Iniciando:", this.nombre);

        // La función flecha conserva el 'this' de 'iniciar' (el objeto contador)
        const incrementar = () => {
            this.valor++;
            console.log(\`[\${this.nombre}] Valor actual: \${this.valor}\`);
        };

        // Simulamos 3 ciclos de ejecución
        incrementar();
        incrementar();
        incrementar();
    }
};

contador.iniciar();`,

    // Preset 4: Recursividad con Arrow Functions (Factorial)
    "preset-arrow-4": `// ==========================================
// 4. RECURSIVIDAD CON ARROW FUNCTIONS
// ==========================================

// Función flecha recursiva para calcular el factorial:
const factorial = n => {
    if (n <= 1) return 1; // Condición base de parada
    return n * factorial(n - 1); // Llamada recursiva
};

console.log("Factorial de 3 :", factorial(3)); // 6
console.log("Factorial de 5 :", factorial(5)); // 120
console.log("Factorial de 7 :", factorial(7)); // 5040`,

    // Preset 5: Closures y Variables Privadas
    "preset-arrow-5": `// ==========================================
// 5. CLOSURES Y ENCAPSULACIÓN PRIVADA
// ==========================================

const crearCajaFuerte = (claveInicial) => {
    // Variable privada protegida por el entorno léxico del closure:
    let claveSecreta = claveInicial;
    let intentosFallidos = 0;

    return {
        abrir: (intento) => {
            if (intento === claveSecreta) {
                return "🔓 ¡Acceso concedido al cofre!";
            }
            intentosFallidos++;
            return \`🔒 Clave incorrecta. Fallos acumulados: \${intentosFallidos}\`;
        },
        cambiarClave: (claveVieja, claveNueva) => {
            if (claveVieja === claveSecreta) {
                claveSecreta = claveNueva;
                return "✅ Clave actualizada con éxito.";
            }
            return "❌ No se puede actualizar: clave anterior inválida.";
        }
    };
};

const miCaja = crearCajaFuerte("1234");
console.log(miCaja.abrir("9999"));
console.log(miCaja.abrir("1234"));
console.log(miCaja.cambiarClave("1234", "5678"));
console.log(miCaja.abrir("5678"));`,

    // Preset 6: Parámetros Rest (...args) vs arguments
    "preset-arrow-6": `// ==========================================
// 6. PARÁMETROS REST (...args) VS ARGUMENTS
// ==========================================

// En funciones flecha, 'arguments' no existe.
// Usamos Rest (...numeros) para obtener un Array nativo con .reduce():
const sumarTodo = (multiplicador, ...numeros) => {
    console.log("¿Es Array legítimo?:", Array.isArray(numeros));
    const suma = numeros.reduce((acumulado, n) => acumulado + n, 0);
    return suma * multiplicador;
};

console.log("Suma con multiplicador x2 (10, 20, 30):", sumarTodo(2, 10, 20, 30));`,

    // Preset 7: Desestructuración en Parámetros de Funciones
    "preset-arrow-7": `// ==========================================
// 7. DESESTRUCTURACIÓN EN FIRMAS DE FUNCIONES
// ==========================================

const pedido = {
    id: 554,
    cliente: { nombre: "Carlos", ciudad: "Medellín" },
    total: 320,
    descuento: 20
};

// La función desestructura directamente las propiedades requeridas:
const procesarRecibo = ({ id, cliente: { nombre, ciudad }, total, descuento = 0 }) => {
    const totalNeto = total - descuento;
    return \`Factura #\${id} para \${nombre} (\${ciudad}). Total a pagar: $\${totalNeto}\`;
};

console.log(procesarRecibo(pedido));`,

    // Preset 8: Fallo con 'new' y ausencia de [[Construct]]
    "preset-arrow-8": `// ==========================================
// 8. INTENTO DE USAR 'new' CON ARROW FUNCTION
// ==========================================

const CreadorAuto = (marca) => {
    this.marca = marca;
};

console.log("¿Tiene .prototype?:", CreadorAuto.prototype); // undefined

try {
    const miAuto = new CreadorAuto("Toyota");
} catch (error) {
    console.error("Tipo de error :", error.name);
    console.error("Mensaje motor :", error.message);
    console.log("💡 Diagnóstico : Las funciones flecha no implementan [[Construct]]");
}`,

    // Presets de los 3 nuevos retos integradores del temario
    "preset-ex-arrow1": `// RETO 1: calcularAreaCirculo en una sola línea (Junior)
const calcularAreaCirculo = radio => Math.PI * radio * radio;

console.log("Área para radio 5 :", calcularAreaCirculo(5));
console.log("Área para radio 10:", calcularAreaCirculo(10));`,

    "preset-ex-arrow2": `// RETO 2: crearCarrito con Closure y Desestructuración (Semi Senior)
const crearCarrito = () => {
    const lista = []; // Array privado resguardado por el closure

    return {
        // Desestructuración directa en la firma del método:
        agregarProducto: ({ nombre, precio }) => {
            lista.push({ nombre, precio });
            console.log(\`  + Agregado: \${nombre} ($ \${precio})\`);
        },
        // Total acumulado usando reduce funcional:
        obtenerTotal: () => lista.reduce((acum, prod) => acum + prod.precio, 0),
        obtenerCantidad: () => lista.length
    };
};

const carrito = crearCarrito();
carrito.agregarProducto({ nombre: "Laptop Gamer", precio: 1500 });
carrito.agregarProducto({ nombre: "Mouse Pad XL", precio: 30 });
carrito.agregarProducto({ nombre: "Teclado RGB", precio: 120 });
console.log("Total final a pagar:", "$" + carrito.obtenerTotal());`,

    "preset-ex-arrow3": `// RETO 3: Forzar .call() e Instanciar con new (Avanzado)
const Servicio = (url) => {
    this.url = url;
};

// 1. call() procesa argumentos pero descarta el contexto:
Servicio.call({ contexto: "invalido" }, "https://api.com");
console.log("Prueba call() completada: contexto ignorado con éxito.");

// 2. new arroja TypeError técnico:
try {
    const s = new Servicio("https://api.com");
} catch (error) {
    console.error("Excepción capturada:", error.name);
    console.error("Mensaje oficial   :", error.message);
    console.log("Diagnóstico técnico : Carece de [[Construct]] y prototype");
}`
};


// --- CONTROLADOR PRINCIPAL DE LA APLICACIÓN (AppController) ---
class AppController { // Define clase
    static init() { // Instrucción JavaScript
        // Inicializamos los componentes y escuchadores de eventos
        this.renderDots(); // Ejecuta llamada o método
        this.renderOverviewGrid(); // Ejecuta llamada o método
        this.bindEvents(); // Ejecuta llamada o método
        this.updatePresentationState(); // Ejecuta llamada o método
        this.loadPlaygroundPreset("preset-arrow-1"); // Ejecuta llamada o método
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

        // Actualiza el indicador de texto: "X / 11"
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
        if (btnGoLab) btnGoLab.addEventListener("click", () => this.goToSlide(10)); // Evalúa condición

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

        // Slide 2: Comparativa de sintaxis en vivo
        const btnTestArrowIntro = document.getElementById("btnTestArrowIntro"); // Obtiene referencia DOM para "btnTestArrowIntro"
        const statusArrowIntro = document.getElementById("testArrowIntroStatus"); // Obtiene referencia DOM para "statusArrowIntro"
        const consoleOutput1 = document.getElementById("console-output-1"); // Obtiene referencia DOM para "consoleOutput1"
        if (btnTestArrowIntro && consoleOutput1) { // Evalúa condición
            btnTestArrowIntro.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                if (statusArrowIntro) statusArrowIntro.textContent = "Ejecutado con éxito"; // Evalúa condición
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const duplicarTrad = function(x) { return x * 2; };</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; const duplicarFlecha = x =&gt; x * 2;</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; duplicarTrad(5)  ➔ 10</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; duplicarFlecha(5) ➔ 10 (Retorno implícito limpio)</div>
                `;
                this.showToast("Comparativa evaluada en vivo"); // Ejecuta llamada o método
            });
        }

        // Slide 3: Probar retorno de objeto literal ({})
        const btnCheckObjectReturn = document.getElementById("btnCheckObjectReturn"); // Obtiene referencia DOM para "btnCheckObjectReturn"
        const objectReturnResult = document.getElementById("objectReturnResult"); // Obtiene referencia DOM para "objectReturnResult"
        if (btnCheckObjectReturn && objectReturnResult) { // Evalúa condición
            btnCheckObjectReturn.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const crearUsuario = (id, nombre) => ({ id, nombre }); // Define función flecha "crearUsuario"
                const resultado = crearUsuario(101, "Fredy Martínez"); // Declara e inicializa "resultado"
                objectReturnResult.innerHTML = `
                    ✅ <strong>¡Objeto Retornado con Éxito!</strong><br>
                    <code>${JSON.stringify(resultado)}</code><br>
                    <small>Gracias a los paréntesis <code>({ ... })</code>, el motor JS reconoció el objeto y no un bloque de función.</small>
                `;
            });
        }

        // Slide 4: Simulador de 'this'
        const simBtns = document.querySelectorAll("[data-this-case]"); // Obtiene referencia DOM para "simBtns"
        simBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                simBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeThisCase = btn.getAttribute("data-this-case"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        const btnCompareThisModes = document.getElementById("btnCompareThisModes"); // Obtiene referencia DOM para "btnCompareThisModes"
        if (btnCompareThisModes) { // Evalúa condición
            btnCompareThisModes.addEventListener("click", () => { // Registra escuchador de eventos
                this.runThisSimulation(AppState.activeThisCase); // Ejecuta llamada o método
            });
        }

        // Slide 5: Pestañas de Contexto (call, apply, strict)
        const ctxTabs = document.querySelectorAll("[data-ctx]"); // Obtiene referencia DOM para "ctxTabs"
        ctxTabs.forEach(tab => { // Instrucción JavaScript
            tab.addEventListener("click", () => { // Registra escuchador de eventos
                ctxTabs.forEach(t => t.classList.remove("active")); // Modifica clases CSS del elemento
                tab.classList.add("active"); // Modifica clases CSS del elemento
                const viewId = `ctx-view-${tab.getAttribute("data-ctx")}`; // Declara e inicializa "viewId"
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active")); // Modifica clases CSS del elemento
                const targetView = document.getElementById(viewId); // Obtiene referencia DOM para "targetView"
                if (targetView) targetView.classList.add("active"); // Evalúa condición
                SoundEffects.click(); // Ejecuta llamada o método
            });
        });

        // Slide 5: Botón Probar call()
        const btnTestCallIgnored = document.getElementById("btnTestCallIgnored"); // Obtiene referencia DOM para "btnTestCallIgnored"
        const callIgnoredResult = document.getElementById("callIgnoredResult"); // Obtiene referencia DOM para "callIgnoredResult"
        if (btnTestCallIgnored && callIgnoredResult) { // Evalúa condición
            btnTestCallIgnored.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                callIgnoredResult.innerHTML = `
                    <code>const fn = () =&gt; this.nombre;</code><br>
                    <code>fn.call({ nombre: "Carlos" }); ➔ undefined</code><br>
                    <span style="color: var(--amber);">⚡ El objeto '{ nombre: "Carlos" }' fue ignorado. La función flecha mantiene su 'this' léxico exterior.</span>
                `;
            });
        }

        // Slide 5: Botón Probar apply()
        const btnTestApplyIgnored = document.getElementById("btnTestApplyIgnored"); // Obtiene referencia DOM para "btnTestApplyIgnored"
        const applyIgnoredResult = document.getElementById("applyIgnoredResult"); // Obtiene referencia DOM para "applyIgnoredResult"
        if (btnTestApplyIgnored && applyIgnoredResult) { // Evalúa condición
            btnTestApplyIgnored.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                applyIgnoredResult.innerHTML = `
                    <code>const sumar = (a, b) =&gt; a + b;</code><br>
                    <code>sumar.apply({ contexto: 123 }, [15, 25]); ➔ 40</code><br>
                    <span style="color: var(--emerald);">✔ Los argumentos [15, 25] se transmitieron perfectamente, pero el contexto se ignoró.</span>
                `;
            });
        }

        // Slide 5: Botón Probar Strict 'this'
        const btnTestStrictThis = document.getElementById("btnTestStrictThis"); // Obtiene referencia DOM para "btnTestStrictThis"
        const strictThisResult = document.getElementById("strictThisResult"); // Obtiene referencia DOM para "strictThisResult"
        if (btnTestStrictThis && strictThisResult) { // Evalúa condición
            btnTestStrictThis.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                strictThisResult.innerHTML = `
                    <strong>En Ámbito Global con "use strict":</strong><br>
                    1. <code>function trad() { return this; }</code> ➔ <code>undefined</code><br>
                    2. <code>const flecha = () =&gt; this;</code> ➔ <code>window / global</code><br>
                    <small>Las funciones flecha no se convierten en undefined porque buscan el 'this' léxico del entorno padre.</small>
                `;
            });
        }

        // Slide 7: Prueba de Recursividad
        const btnTestRecursion = document.getElementById("btnTestRecursion"); // Obtiene referencia DOM para "btnTestRecursion"
        const recursionResult = document.getElementById("recursionResult"); // Obtiene referencia DOM para "recursionResult"
        if (btnTestRecursion && recursionResult) { // Evalúa condición
            btnTestRecursion.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const factorial = n => (n <= 1 ? 1 : n * factorial(n - 1)); // Define función flecha "factorial"
                const res = factorial(5); // Declara e inicializa "res"
                recursionResult.innerHTML = `
                    <code>factorial(5) ➔ 5 * 4 * 3 * 2 * 1 = <strong>${res}</strong></code><br>
                    <small style="color: var(--emerald);">✔ Ejecutado con éxito mediante función flecha recursiva con condición base n &lt;= 1.</small>
                `;
                this.showToast("Cálculo recursivo completado"); // Ejecuta llamada o método
            });
        }

        // Slide 7: Prueba de Closure
        const btnTestClosure = document.getElementById("btnTestClosure"); // Obtiene referencia DOM para "btnTestClosure"
        const closureResult = document.getElementById("closureResult"); // Obtiene referencia DOM para "closureResult"
        if (btnTestClosure && closureResult) { // Evalúa condición
            btnTestClosure.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                if (!AppState.closureCounterInstance) { // Evalúa condición
                    const crearContador = () => { // Define función flecha "crearContador"
                        let cuentaPrivada = 0; // Declara e inicializa "cuentaPrivada"
                        return { // Retorna resultado
                            incrementar: () => ++cuentaPrivada,
                            obtener: () => cuentaPrivada
                        };
                    };
                    AppState.closureCounterInstance = crearContador(); // Asigna valor
                }
                const nuevoValor = AppState.closureCounterInstance.incrementar(); // Declara e inicializa "nuevoValor"
                closureResult.innerHTML = `
                    Valor protegido en memoria: <strong>#${nuevoValor}</strong><br>
                    <small style="color: var(--cyan);">La variable <code>cuentaPrivada</code> no es accesible desde el exterior, solo vive en el closure.</small>
                `;
            });
        }

        // Slide 8: Prueba de Desestructuración en Parámetros
        const btnTestDestructuringParam = document.getElementById("btnTestDestructuringParam"); // Obtiene referencia DOM para "btnTestDestructuringParam"
        const destructuringParamResult = document.getElementById("destructuringParamResult"); // Obtiene referencia DOM para "destructuringParamResult"
        if (btnTestDestructuringParam && destructuringParamResult) { // Evalúa condición
            btnTestDestructuringParam.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.success(); // Ejecuta llamada o método
                const procesar = ({ id, nombre, precio = 0 }) => `Item #${id}: ${nombre} ($${precio} USD)`; // Define función flecha "procesar"
                const sample = { id: 701, nombre: "Auriculares Noise-Cancelling", precio: 199, extras: "Bluetooth 5.3" }; // Declara e inicializa "sample"
                const output = procesar(sample); // Declara e inicializa "output"
                destructuringParamResult.innerHTML = `
                    <strong>Entrada:</strong> <code>${JSON.stringify(sample)}</code><br>
                    <strong>Salida de la función flecha:</strong> <code>"${output}"</code><br>
                    <small style="color: var(--emerald);">✔ La función extrajo únicamente 'id', 'nombre' y 'precio' directamente en su firma.</small>
                `;
            });
        }

        // Slide 9: Selector de Analogía (Espejo vs Archivador Robotizado)
        const analogyBtns = document.querySelectorAll("[data-analogy]"); // Obtiene referencia DOM para "analogyBtns"
        analogyBtns.forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                analogyBtns.forEach(b => b.classList.remove("active")); // Modifica clases CSS del elemento
                btn.classList.add("active"); // Modifica clases CSS del elemento
                AppState.activeAnalogy = btn.getAttribute("data-analogy"); // Asigna valor
                SoundEffects.click(); // Ejecuta llamada o método
                this.updateAnalogyView(AppState.activeAnalogy); // Ejecuta llamada o método
            });
        });

        // Slide 10: Playground select preset
        const codePresetSelect = document.getElementById("codePresetSelect"); // Obtiene referencia DOM para "codePresetSelect"
        if (codePresetSelect) { // Evalúa condición
            codePresetSelect.addEventListener("change", (e) => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(e.target.value); // Ejecuta llamada o método
            });
        }

        // Slide 10: Botón restaurar preset
        const btnResetCode = document.getElementById("btnResetCode"); // Obtiene referencia DOM para "btnResetCode"
        if (btnResetCode) { // Evalúa condición
            btnResetCode.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-arrow-1"; // Declara e inicializa "currentPreset"
                this.loadPlaygroundPreset(currentPreset); // Ejecuta llamada o método
                this.showToast("Código restaurado"); // Ejecuta llamada o método
            });
        }

        // Slide 10: Botón ejecutar código
        const btnRunEditorCode = document.getElementById("btnRunEditorCode"); // Obtiene referencia DOM para "btnRunEditorCode"
        if (btnRunEditorCode) { // Evalúa condición
            btnRunEditorCode.addEventListener("click", () => { // Registra escuchador de eventos
                this.runPlaygroundCode(); // Ejecuta llamada o método
            });
        }

        // Slide 10: Botón limpiar consola
        const btnClearConsole = document.getElementById("btnClearConsole"); // Obtiene referencia DOM para "btnClearConsole"
        const logsContainer = document.getElementById("consoleLogsContainer"); // Obtiene referencia DOM para "logsContainer"
        if (btnClearConsole && logsContainer) { // Evalúa condición
            btnClearConsole.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.click(); // Ejecuta llamada o método
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>'; // Actualiza contenido en el DOM
            });
        }

        // Slide 11: Botones "Cargar en Playground" de los retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => { // Instrucción JavaScript
            btn.addEventListener("click", () => { // Registra escuchador de eventos
                const presetKey = btn.getAttribute("data-load-preset"); // Declara e inicializa "presetKey"
                SoundEffects.transition(); // Ejecuta llamada o método
                this.loadPlaygroundPreset(presetKey); // Ejecuta llamada o método
                this.goToSlide(10); // Salta al playground
                this.showToast("Reto cargado en el Playground"); // Ejecuta llamada o método
            });
        });

        // Slide 11: Botones "Ver Solución"
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

        // Slide 11: Reiniciar presentación
        const btnRestart = document.getElementById("btnRestartPresentation"); // Obtiene referencia DOM para "btnRestart"
        if (btnRestart) { // Evalúa condición
            btnRestart.addEventListener("click", () => { // Registra escuchador de eventos
                SoundEffects.transition(); // Ejecuta llamada o método
                this.goToSlide(1); // Ejecuta llamada o método
            });
        }

        // Slide 11: Copiar chuleta rápida en markdown
        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat"); // Obtiene referencia DOM para "btnCopySummaryCheat"
        if (btnCopySummaryCheat) { // Evalúa condición
            btnCopySummaryCheat.addEventListener("click", () => { // Registra escuchador de eventos
                const cheatText = `# GUÍA MAESTRA: FUNCIONES FLECHA & CONCEPTOS AVANZADOS (ES6+)

1. **Sintaxis Compacta & Retorno Implícito:**
   const duplicar = x => x * 2; // Sin llaves ni return si es una sola expresión

2. **Reglas de Parámetros:**
   - 0 params: () => ...
   - 1 param : x => ...
   - 2+ params: (a, b) => ...
   - Objeto literal: () => ({ clave: valor })

3. **'this' Léxico (El Espejo Reflectante 🪞):**
   No tienen 'this' propio. Capturan inmutablemente el del ámbito donde nacieron.
   Los métodos .call(), .apply() y .bind() descartan el argumento de contexto.

4. **Restricciones Técnicas:**
   - Sin 'new' ni [[Construct]] (arroja TypeError).
   - .prototype es undefined.
   - Sin 'arguments' (usar Rest: ...args).
   - Prohibido saltos de línea antes de '=>' y prohibido 'yield'.

5. **Patrones Modernos:**
   - Recursividad: factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));
   - Closures: factorías y variables privadas protegidas en el entorno léxico.
   - Parámetros por Defecto: (puerto = 8080, timeout = 5000) => ...
   - Desestructuración en Firma: ({ nombre, precio }) => ...
`;
                navigator.clipboard.writeText(cheatText).then(() => { // Instrucción JavaScript
                    SoundEffects.success(); // Ejecuta llamada o método
                    this.showToast("Chuleta Markdown copiada al portapapeles"); // Ejecuta llamada o método
                });
            });
        }
    }

    // Ejecuta la simulación interactiva de 'this' para el Slide 4
    static runThisSimulation(scenarioKey) { // Instrucción JavaScript
        const terminalTrad = document.getElementById("terminalTrad"); // Obtiene referencia DOM para "terminalTrad"
        const terminalArrow = document.getElementById("terminalArrow"); // Obtiene referencia DOM para "terminalArrow"
        const feedbackText = document.getElementById("thisFeedbackText"); // Obtiene referencia DOM para "feedbackText"
        if (!terminalTrad || !terminalArrow) return; // Evalúa condición

        SoundEffects.transition(); // Ejecuta llamada o método

        if (scenarioKey === "callback") { // Evalúa condición
            terminalTrad.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; setInterval(function() {</div>
                <div class="term-line" style="color: var(--rose);">&gt;   this.contador++; // ❌ 'this' es Window / Timeout</div>
                <div class="term-line" style="color: var(--rose);">&gt; }, 1000); // this.contador resulta en NaN</div>
            `;
            terminalArrow.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; setInterval(() =&gt; {</div>
                <div class="term-line" style="color: var(--emerald);">&gt;   this.contador++; // ✅ 'this' es el Objeto Contador</div>
                <div class="term-line" style="color: var(--emerald);">&gt; }, 1000); // Incremento correcto</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 1 (Callbacks):</strong> La función flecha preserva el 'this' del objeto que creó el temporizador sin necesidad de <code>.bind(this)</code>."; // Evalúa condición
        } else if (scenarioKey === "arrayMap") { // Instrucción JavaScript
            terminalTrad.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; this.items.map(function(item) {</div>
                <div class="term-line" style="color: var(--rose);">&gt;   return item * this.factor; // ❌ this.factor es undefined</div>
                <div class="term-line" style="color: var(--amber);">&gt; });</div>
            `;
            terminalArrow.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; this.items.map(item =&gt; {</div>
                <div class="term-line" style="color: var(--emerald);">&gt;   return item * this.factor; // ✅ Acceso directo a this.factor</div>
                <div class="term-line" style="color: var(--emerald);">&gt; });</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 2 (Array.map):</strong> En métodos funcionales de array, las flechas acceden transparentemente a las propiedades del objeto superior."; // Evalúa condición
        } else if (scenarioKey === "global") { // Instrucción JavaScript
            terminalTrad.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; "use strict";</div>
                <div class="term-line" style="color: var(--amber);">&gt; function suelta() { return this; }</div>
                <div class="term-line" style="color: var(--cyan);">&gt; suelta() ➔ undefined (Modo estricto activo)</div>
            `;
            terminalArrow.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; "use strict";</div>
                <div class="term-line" style="color: var(--emerald);">&gt; const flecha = () =&gt; this;</div>
                <div class="term-line" style="color: var(--emerald);">&gt; flecha() ➔ Window / Objeto Global</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 3 (Ámbito Global):</strong> La función flecha ignora la regla de 'this = undefined' de modo estricto en el ámbito global."; // Evalúa condición
        } else if (scenarioKey === "method") { // Instrucción JavaScript
            terminalTrad.innerHTML = `
                <div class="term-line" style="color: var(--emerald);">&gt; const coche = {</div>
                <div class="term-line" style="color: var(--emerald);">&gt;   marca: 'Toyota',</div>
                <div class="term-line" style="color: var(--emerald);">&gt;   ver() { return this.marca; } // ✅ 'Toyota'</div>
                <div class="term-line" style="color: var(--emerald);">&gt; };</div>
            `;
            terminalArrow.innerHTML = `
                <div class="term-line" style="color: var(--amber);">&gt; const coche = {</div>
                <div class="term-line" style="color: var(--amber);">&gt;   marca: 'Toyota',</div>
                <div class="term-line" style="color: var(--rose);">&gt;   ver: () =&gt; this.marca // ❌ undefined</div>
                <div class="term-line" style="color: var(--amber);">&gt; };</div>
            `;
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 4 (Métodos de Objetos):</strong> ¡Antipatrón! Las funciones flecha no sirven como métodos de objetos literales porque capturan el entorno exterior."; // Evalúa condición
        }
    }

    // Actualiza la visualización de las analogías en el Slide 9
    static updateAnalogyView(analogyType) { // Instrucción JavaScript
        const titleLeft = document.getElementById("analogTitleLeft"); // Obtiene referencia DOM para "titleLeft"
        const subLeft = document.getElementById("analogSubLeft"); // Obtiene referencia DOM para "subLeft"
        const avatarLeft = document.getElementById("analogAvatarLeft"); // Obtiene referencia DOM para "avatarLeft"
        const itemsLeft = document.getElementById("analogItemsLeft"); // Obtiene referencia DOM para "itemsLeft"
        const statusLeft = document.getElementById("analogStatusLeft"); // Obtiene referencia DOM para "statusLeft"

        const titleRight = document.getElementById("analogTitleRight"); // Obtiene referencia DOM para "titleRight"
        const subRight = document.getElementById("analogSubRight"); // Obtiene referencia DOM para "subRight"
        const avatarRight = document.getElementById("analogAvatarRight"); // Obtiene referencia DOM para "avatarRight"
        const itemsRight = document.getElementById("analogItemsRight"); // Obtiene referencia DOM para "itemsRight"
        const statusRight = document.getElementById("analogStatusRight"); // Obtiene referencia DOM para "statusRight"

        const bannerText = document.getElementById("analogyBannerText"); // Obtiene referencia DOM para "bannerText"
        const bannerIcon = document.getElementById("analogyBannerIcon"); // Obtiene referencia DOM para "bannerIcon"

        if (analogyType === "mirror") { // Evalúa condición
            if (avatarLeft) avatarLeft.textContent = "📷"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "Cámara con Flash Propio"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Función Tradicional (this dinámico)"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Al disparar, genera su propia luz contextual</div>
                <div class="ws-item">Altera la iluminación del cuarto según cómo se llame</div>
            `;
            if (statusLeft) statusLeft.textContent = "'this' cambia dinámicamente según la llamada"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🪞"; // Evalúa condición
            if (titleRight) titleRight.textContent = "Espejo Plano Empotrado"; // Evalúa condición
            if (subRight) subRight.textContent = "Función Flecha (this léxico)"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">No tiene luz propia ni la crea</div>
                <div class="ws-item highlight-item">Refleja la iluminación del cuarto donde fue instalado</div>
            `;
            if (statusRight) statusRight.textContent = "'this' es inmutable y hereda el del padre"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🪞"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>El Espejo Reflectante:</strong> La función flecha nunca altera el contexto: refleja fielmente el 'this' que ya existía donde fue creada."; // Actualiza contenido en el DOM
            }
        } else { // Instrucción JavaScript
            // Analogía 2: Archivador automatizado (Desestructuración)
            if (avatarLeft) avatarLeft.textContent = "📦"; // Evalúa condición
            if (titleLeft) titleLeft.textContent = "Caja Llena de Carpetas"; // Evalúa condición
            if (subLeft) subLeft.textContent = "Sin Desestructuración (Extracción Manual)"; // Evalúa condición
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Recibes un objeto entero y pesado</div>
                <div class="ws-item">Tienes que sacar cada propiedad línea por línea: const t = obj.t;</div>
            `;
            if (statusLeft) statusLeft.textContent = "Verbosidad y código repetitivo innecesario"; // Evalúa condición

            if (avatarRight) avatarRight.textContent = "🤖"; // Evalúa condición
            if (titleRight) titleRight.textContent = "Archivador Robotizado"; // Evalúa condición
            if (subRight) subRight.textContent = "Con Desestructuración ({ nombre, precio })"; // Evalúa condición
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Entrega directamente en mano los datos exactos</div>
                <div class="ws-item highlight-item">Desecha el envoltorio del objeto al instante</div>
            `;
            if (statusRight) statusRight.textContent = "Código conciso, limpio y autodocumentado"; // Evalúa condición

            if (bannerIcon) bannerIcon.textContent = "🗂️"; // Evalúa condición
            if (bannerText) { // Evalúa condición
                bannerText.innerHTML = "<strong>El Archivador Automatizado:</strong> La función desestructuradora recibe el objeto y te entrega exactamente las propiedades necesarias en su firma."; // Actualiza contenido en el DOM
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // Registra escuchador de eventos
    AppController.init(); // Ejecuta llamada o método
});
