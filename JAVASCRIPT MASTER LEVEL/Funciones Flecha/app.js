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
"use strict";

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Objeto que almacena el estado reactivo de la presentación y configuraciones del usuario
const AppState = {
    // Índice de la diapositiva actualmente visible (inicia en 1: Portada)
    currentSlide: 1,
    // Cantidad total de diapositivas en la presentación reorganizada (11 diapositivas)
    totalSlides: 11,
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
    static playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
        // Si el sonido está silenciado por el usuario, salimos de inmediato
        if (!AppState.soundEnabled) return;

        try {
            // Aseguramos que el AudioContext esté inicializado
            this.init();
            // Si el navegador no permite audio o falló, cancelamos
            if (!AppState.audioCtx) return;

            // Si el contexto fue suspendido por inactividad, lo reanudamos
            if (AppState.audioCtx.state === 'suspended') {
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
        this.playTone(600, 'triangle', 0.04, 0.03);
    }

    // Acorde arpegiado ascendente de éxito (Do5 -> Mi5 -> Sol5)
    static success() {
        this.playTone(523.25, 'sine', 0.1, 0.05); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.05), 80); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 160); // G5
    }

    // Sonido suave de cambio de diapositiva o transición
    static transition() {
        this.playTone(320, 'sine', 0.06, 0.03);
        setTimeout(() => this.playTone(480, 'sine', 0.08, 0.03), 40);
    }

    // Tono grave de alerta o advertencia (onda diente de sierra de 280 Hz)
    static error() {
        this.playTone(280, 'sawtooth', 0.15, 0.04);
    }
}


// --- PRESETS DE CÓDIGO PARA EL PLAYGROUND (SLIDE 10 & RETOS) ---
// Diccionario que contiene los códigos interactivos listos para ejecutar en el editor virtual
const CodePresets = {
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
class AppController {
    static init() {
        // Inicializamos los componentes y escuchadores de eventos
        this.renderDots();
        this.renderOverviewGrid();
        this.bindEvents();
        this.updatePresentationState();
        this.loadPlaygroundPreset("preset-arrow-1");
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

        // Actualiza el indicador de texto: "X / 11"
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

    // Ejecuta el código del Playground capturando la consola virtual
    static runPlaygroundCode() {
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

        // Guardamos los métodos originales de console
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        try {
            // Sobrescribimos console para interceptar la salida
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

            // Ejecutamos el código con Function para aislar ámbito
            const runFn = new Function(codeToRun);
            runFn();

            SoundEffects.success();
            AppController.showToast("Código ejecutado con éxito");
        } catch (err) {
            console.error("Excepción:", err.name, "-", err.message);
            SoundEffects.error();
            AppController.showToast("Error al ejecutar código", true);
        } finally {
            // Restauramos los métodos originales de console
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
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

        // Slide 2: Comparativa de sintaxis en vivo
        const btnTestArrowIntro = document.getElementById("btnTestArrowIntro");
        const statusArrowIntro = document.getElementById("testArrowIntroStatus");
        const consoleOutput1 = document.getElementById("console-output-1");
        if (btnTestArrowIntro && consoleOutput1) {
            btnTestArrowIntro.addEventListener("click", () => {
                SoundEffects.success();
                if (statusArrowIntro) statusArrowIntro.textContent = "Ejecutado con éxito";
                consoleOutput1.innerHTML = `
                    <div class="term-line" style="color: var(--cyan);">&gt; const duplicarTrad = function(x) { return x * 2; };</div>
                    <div class="term-line" style="color: var(--cyan);">&gt; const duplicarFlecha = x =&gt; x * 2;</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; duplicarTrad(5)  ➔ 10</div>
                    <div class="term-line" style="color: var(--emerald);">&gt; duplicarFlecha(5) ➔ 10 (Retorno implícito limpio)</div>
                `;
                this.showToast("Comparativa evaluada en vivo");
            });
        }

        // Slide 3: Probar retorno de objeto literal ({})
        const btnCheckObjectReturn = document.getElementById("btnCheckObjectReturn");
        const objectReturnResult = document.getElementById("objectReturnResult");
        if (btnCheckObjectReturn && objectReturnResult) {
            btnCheckObjectReturn.addEventListener("click", () => {
                SoundEffects.success();
                const crearUsuario = (id, nombre) => ({ id, nombre });
                const resultado = crearUsuario(101, "Fredy Martínez");
                objectReturnResult.innerHTML = `
                    ✅ <strong>¡Objeto Retornado con Éxito!</strong><br>
                    <code>${JSON.stringify(resultado)}</code><br>
                    <small>Gracias a los paréntesis <code>({ ... })</code>, el motor JS reconoció el objeto y no un bloque de función.</small>
                `;
            });
        }

        // Slide 4: Simulador de 'this'
        const simBtns = document.querySelectorAll("[data-this-case]");
        simBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                simBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeThisCase = btn.getAttribute("data-this-case");
                SoundEffects.click();
            });
        });

        const btnCompareThisModes = document.getElementById("btnCompareThisModes");
        if (btnCompareThisModes) {
            btnCompareThisModes.addEventListener("click", () => {
                this.runThisSimulation(AppState.activeThisCase);
            });
        }

        // Slide 5: Pestañas de Contexto (call, apply, strict)
        const ctxTabs = document.querySelectorAll("[data-ctx]");
        ctxTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                ctxTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const viewId = `ctx-view-${tab.getAttribute("data-ctx")}`;
                document.querySelectorAll(".char-detail-view").forEach(v => v.classList.remove("active"));
                const targetView = document.getElementById(viewId);
                if (targetView) targetView.classList.add("active");
                SoundEffects.click();
            });
        });

        // Slide 5: Botón Probar call()
        const btnTestCallIgnored = document.getElementById("btnTestCallIgnored");
        const callIgnoredResult = document.getElementById("callIgnoredResult");
        if (btnTestCallIgnored && callIgnoredResult) {
            btnTestCallIgnored.addEventListener("click", () => {
                SoundEffects.success();
                callIgnoredResult.innerHTML = `
                    <code>const fn = () =&gt; this.nombre;</code><br>
                    <code>fn.call({ nombre: "Carlos" }); ➔ undefined</code><br>
                    <span style="color: var(--amber);">⚡ El objeto '{ nombre: "Carlos" }' fue ignorado. La función flecha mantiene su 'this' léxico exterior.</span>
                `;
            });
        }

        // Slide 5: Botón Probar apply()
        const btnTestApplyIgnored = document.getElementById("btnTestApplyIgnored");
        const applyIgnoredResult = document.getElementById("applyIgnoredResult");
        if (btnTestApplyIgnored && applyIgnoredResult) {
            btnTestApplyIgnored.addEventListener("click", () => {
                SoundEffects.success();
                applyIgnoredResult.innerHTML = `
                    <code>const sumar = (a, b) =&gt; a + b;</code><br>
                    <code>sumar.apply({ contexto: 123 }, [15, 25]); ➔ 40</code><br>
                    <span style="color: var(--emerald);">✔ Los argumentos [15, 25] se transmitieron perfectamente, pero el contexto se ignoró.</span>
                `;
            });
        }

        // Slide 5: Botón Probar Strict 'this'
        const btnTestStrictThis = document.getElementById("btnTestStrictThis");
        const strictThisResult = document.getElementById("strictThisResult");
        if (btnTestStrictThis && strictThisResult) {
            btnTestStrictThis.addEventListener("click", () => {
                SoundEffects.success();
                strictThisResult.innerHTML = `
                    <strong>En Ámbito Global con "use strict":</strong><br>
                    1. <code>function trad() { return this; }</code> ➔ <code>undefined</code><br>
                    2. <code>const flecha = () =&gt; this;</code> ➔ <code>window / global</code><br>
                    <small>Las funciones flecha no se convierten en undefined porque buscan el 'this' léxico del entorno padre.</small>
                `;
            });
        }

        // Slide 7: Prueba de Recursividad
        const btnTestRecursion = document.getElementById("btnTestRecursion");
        const recursionResult = document.getElementById("recursionResult");
        if (btnTestRecursion && recursionResult) {
            btnTestRecursion.addEventListener("click", () => {
                SoundEffects.success();
                const factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));
                const res = factorial(5);
                recursionResult.innerHTML = `
                    <code>factorial(5) ➔ 5 * 4 * 3 * 2 * 1 = <strong>${res}</strong></code><br>
                    <small style="color: var(--emerald);">✔ Ejecutado con éxito mediante función flecha recursiva con condición base n &lt;= 1.</small>
                `;
                this.showToast("Cálculo recursivo completado");
            });
        }

        // Slide 7: Prueba de Closure
        const btnTestClosure = document.getElementById("btnTestClosure");
        const closureResult = document.getElementById("closureResult");
        if (btnTestClosure && closureResult) {
            btnTestClosure.addEventListener("click", () => {
                SoundEffects.click();
                if (!AppState.closureCounterInstance) {
                    const crearContador = () => {
                        let cuentaPrivada = 0;
                        return {
                            incrementar: () => ++cuentaPrivada,
                            obtener: () => cuentaPrivada
                        };
                    };
                    AppState.closureCounterInstance = crearContador();
                }
                const nuevoValor = AppState.closureCounterInstance.incrementar();
                closureResult.innerHTML = `
                    Valor protegido en memoria: <strong>#${nuevoValor}</strong><br>
                    <small style="color: var(--cyan);">La variable <code>cuentaPrivada</code> no es accesible desde el exterior, solo vive en el closure.</small>
                `;
            });
        }

        // Slide 8: Prueba de Desestructuración en Parámetros
        const btnTestDestructuringParam = document.getElementById("btnTestDestructuringParam");
        const destructuringParamResult = document.getElementById("destructuringParamResult");
        if (btnTestDestructuringParam && destructuringParamResult) {
            btnTestDestructuringParam.addEventListener("click", () => {
                SoundEffects.success();
                const procesar = ({ id, nombre, precio = 0 }) => `Item #${id}: ${nombre} ($${precio} USD)`;
                const sample = { id: 701, nombre: "Auriculares Noise-Cancelling", precio: 199, extras: "Bluetooth 5.3" };
                const output = procesar(sample);
                destructuringParamResult.innerHTML = `
                    <strong>Entrada:</strong> <code>${JSON.stringify(sample)}</code><br>
                    <strong>Salida de la función flecha:</strong> <code>"${output}"</code><br>
                    <small style="color: var(--emerald);">✔ La función extrajo únicamente 'id', 'nombre' y 'precio' directamente en su firma.</small>
                `;
            });
        }

        // Slide 9: Selector de Analogía (Espejo vs Archivador Robotizado)
        const analogyBtns = document.querySelectorAll("[data-analogy]");
        analogyBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                analogyBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                AppState.activeAnalogy = btn.getAttribute("data-analogy");
                SoundEffects.click();
                this.updateAnalogyView(AppState.activeAnalogy);
            });
        });

        // Slide 10: Playground select preset
        const codePresetSelect = document.getElementById("codePresetSelect");
        if (codePresetSelect) {
            codePresetSelect.addEventListener("change", (e) => {
                SoundEffects.click();
                this.loadPlaygroundPreset(e.target.value);
            });
        }

        // Slide 10: Botón restaurar preset
        const btnResetCode = document.getElementById("btnResetCode");
        if (btnResetCode) {
            btnResetCode.addEventListener("click", () => {
                SoundEffects.click();
                const currentPreset = codePresetSelect ? codePresetSelect.value : "preset-arrow-1";
                this.loadPlaygroundPreset(currentPreset);
                this.showToast("Código restaurado");
            });
        }

        // Slide 10: Botón ejecutar código
        const btnRunEditorCode = document.getElementById("btnRunEditorCode");
        if (btnRunEditorCode) {
            btnRunEditorCode.addEventListener("click", () => {
                this.runPlaygroundCode();
            });
        }

        // Slide 10: Botón limpiar consola
        const btnClearConsole = document.getElementById("btnClearConsole");
        const logsContainer = document.getElementById("consoleLogsContainer");
        if (btnClearConsole && logsContainer) {
            btnClearConsole.addEventListener("click", () => {
                SoundEffects.click();
                logsContainer.innerHTML = '<div class="log-line info-line"><span class="log-time">[Consola lista]</span> Consola limpiada.</div>';
            });
        }

        // Slide 11: Botones "Cargar en Playground" de los retos
        document.querySelectorAll("[data-load-preset]").forEach(btn => {
            btn.addEventListener("click", () => {
                const presetKey = btn.getAttribute("data-load-preset");
                SoundEffects.transition();
                this.loadPlaygroundPreset(presetKey);
                this.goToSlide(10); // Salta al playground
                this.showToast("Reto cargado en el Playground");
            });
        });

        // Slide 11: Botones "Ver Solución"
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

        // Slide 11: Reiniciar presentación
        const btnRestart = document.getElementById("btnRestartPresentation");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                SoundEffects.transition();
                this.goToSlide(1);
            });
        }

        // Slide 11: Copiar chuleta rápida en markdown
        const btnCopySummaryCheat = document.getElementById("btnCopySummaryCheat");
        if (btnCopySummaryCheat) {
            btnCopySummaryCheat.addEventListener("click", () => {
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
                navigator.clipboard.writeText(cheatText).then(() => {
                    SoundEffects.success();
                    this.showToast("Chuleta Markdown copiada al portapapeles");
                });
            });
        }
    }

    // Ejecuta la simulación interactiva de 'this' para el Slide 4
    static runThisSimulation(scenarioKey) {
        const terminalTrad = document.getElementById("terminalTrad");
        const terminalArrow = document.getElementById("terminalArrow");
        const feedbackText = document.getElementById("thisFeedbackText");
        if (!terminalTrad || !terminalArrow) return;

        SoundEffects.transition();

        if (scenarioKey === "callback") {
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
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 1 (Callbacks):</strong> La función flecha preserva el 'this' del objeto que creó el temporizador sin necesidad de <code>.bind(this)</code>.";
        } else if (scenarioKey === "arrayMap") {
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
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 2 (Array.map):</strong> En métodos funcionales de array, las flechas acceden transparentemente a las propiedades del objeto superior.";
        } else if (scenarioKey === "global") {
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
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 3 (Ámbito Global):</strong> La función flecha ignora la regla de 'this = undefined' de modo estricto en el ámbito global.";
        } else if (scenarioKey === "method") {
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
            if (feedbackText) feedbackText.innerHTML = "<strong>Caso 4 (Métodos de Objetos):</strong> ¡Antipatrón! Las funciones flecha no sirven como métodos de objetos literales porque capturan el entorno exterior.";
        }
    }

    // Actualiza la visualización de las analogías en el Slide 9
    static updateAnalogyView(analogyType) {
        const titleLeft = document.getElementById("analogTitleLeft");
        const subLeft = document.getElementById("analogSubLeft");
        const avatarLeft = document.getElementById("analogAvatarLeft");
        const itemsLeft = document.getElementById("analogItemsLeft");
        const statusLeft = document.getElementById("analogStatusLeft");

        const titleRight = document.getElementById("analogTitleRight");
        const subRight = document.getElementById("analogSubRight");
        const avatarRight = document.getElementById("analogAvatarRight");
        const itemsRight = document.getElementById("analogItemsRight");
        const statusRight = document.getElementById("analogStatusRight");

        const bannerText = document.getElementById("analogyBannerText");
        const bannerIcon = document.getElementById("analogyBannerIcon");

        if (analogyType === "mirror") {
            if (avatarLeft) avatarLeft.textContent = "📷";
            if (titleLeft) titleLeft.textContent = "Cámara con Flash Propio";
            if (subLeft) subLeft.textContent = "Función Tradicional (this dinámico)";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Al disparar, genera su propia luz contextual</div>
                <div class="ws-item">Altera la iluminación del cuarto según cómo se llame</div>
            `;
            if (statusLeft) statusLeft.textContent = "'this' cambia dinámicamente según la llamada";

            if (avatarRight) avatarRight.textContent = "🪞";
            if (titleRight) titleRight.textContent = "Espejo Plano Empotrado";
            if (subRight) subRight.textContent = "Función Flecha (this léxico)";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">No tiene luz propia ni la crea</div>
                <div class="ws-item highlight-item">Refleja la iluminación del cuarto donde fue instalado</div>
            `;
            if (statusRight) statusRight.textContent = "'this' es inmutable y hereda el del padre";

            if (bannerIcon) bannerIcon.textContent = "🪞";
            if (bannerText) {
                bannerText.innerHTML = "<strong>El Espejo Reflectante:</strong> La función flecha nunca altera el contexto: refleja fielmente el 'this' que ya existía donde fue creada.";
            }
        } else {
            // Analogía 2: Archivador automatizado (Desestructuración)
            if (avatarLeft) avatarLeft.textContent = "📦";
            if (titleLeft) titleLeft.textContent = "Caja Llena de Carpetas";
            if (subLeft) subLeft.textContent = "Sin Desestructuración (Extracción Manual)";
            if (itemsLeft) itemsLeft.innerHTML = `
                <div class="ws-item">Recibes un objeto entero y pesado</div>
                <div class="ws-item">Tienes que sacar cada propiedad línea por línea: const t = obj.t;</div>
            `;
            if (statusLeft) statusLeft.textContent = "Verbosidad y código repetitivo innecesario";

            if (avatarRight) avatarRight.textContent = "🤖";
            if (titleRight) titleRight.textContent = "Archivador Robotizado";
            if (subRight) subRight.textContent = "Con Desestructuración ({ nombre, precio })";
            if (itemsRight) itemsRight.innerHTML = `
                <div class="ws-item highlight-item">Entrega directamente en mano los datos exactos</div>
                <div class="ws-item highlight-item">Desecha el envoltorio del objeto al instante</div>
            `;
            if (statusRight) statusRight.textContent = "Código conciso, limpio y autodocumentado";

            if (bannerIcon) bannerIcon.textContent = "🗂️";
            if (bannerText) {
                bannerText.innerHTML = "<strong>El Archivador Automatizado:</strong> La función desestructuradora recibe el objeto y te entrega exactamente las propiedades necesarias en su firma.";
            }
        }
    }
}

// Inicializamos la aplicación interactiva cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AppController.init();
});
