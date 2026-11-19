/**
 * ==============================================================================
 * 📱 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE WINDOW.MATCHMEDIA()
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: En consola del navegador o directamente en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/MATCHMEDIA.md):
 * 1. ¿Qué es window.matchMedia()? Media queries dinámicas evaluadas desde JavaScript
 * 2. Anatomía de MediaQueryList: propiedad .matches, .media y evento change (onchange)
 * 3. Patrón estándar: Evaluación inicial obligatoria + suscripción reactiva en tiempo real
 * 4. Comparativa de rendimiento: window.addEventListener("resize") vs. matchMedia()
 * 5. Detección de preferencias del sistema:
 *    - Tema claro / oscuro: "(prefers-color-scheme: dark)"
 *    - Reducción de movimiento: "(prefers-reduced-motion: reduce)"
 *    - Orientación del dispositivo: "(orientation: landscape)" vs "(orientation: portrait)"
 *    - Tipo de puntero de entrada: "(pointer: coarse)" (táctil) vs "(pointer: fine)" (ratón)
 * 6. Analogía del mundo real: El Termostato Inteligente 🌡️ frente al termómetro manual
 * 7. Diagrama de flujo de decisión: ¿Cuándo usar CSS puro (@media) vs matchMedia() en JS?
 * 8. Buenas prácticas: Paréntesis obligatorios en consultas y uso de addEventListener
 * 9. Errores comunes: El método deprecado addListener() y olvido de ejecución inicial
 * 10. Solucionario paso a paso del Ejercicio Nivel 1 (max-width: 600px con .matches)
 * 11. Solucionario paso a paso del Ejercicio Nivel 2 (prefers-color-scheme con onchange)
 * 12. Solucionario paso a paso del Ejercicio Nivel 3 (configurarNavegacionAdaptativa con 992px)
 * 13. Proyecto Integrador: Adaptador de Interfaz y Observador Multidispositivo
 * ==============================================================================
 */

// Activamos el modo estricto de ECMAScript para asegurar código limpio y sin variables globales accidentales
"use strict";

// Definimos una función auxiliar para imprimir encabezados visuales y separadores en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial seguido de 78 caracteres de signo igual como borde superior
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque temático y el título descriptivo en mayúsculas destacadas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea divisoria de cierre de 78 caracteres de longitud
    console.log("=".repeat(78));
}

// ==============================================================================
// 0. COMPATIBILIDAD UNIVERSAL: NAVEGADOR NATIVO + SIMULADOR PARA NODE.JS
// ==============================================================================
// En el navegador web existe 'window.matchMedia' de forma nativa. Para que este archivo
// pueda ejecutarse también en la terminal mediante 'node main.js' con fines educativos,
// creamos una implementación fidedigna que emula la API W3C de MediaQueryList:

// Evaluamos si el objeto nativo matchMedia se encuentra ausente en el entorno de ejecución
if (typeof matchMedia === "undefined") {
    // Definimos el ancho y alto simulados del viewport para la terminal de Node.js
    let simulatedWidth = 1024;
    // Definimos la orientación simulada del sistema
    let simulatedDarkMode = true;

    // Asignamos una función simuladora al entorno global de Node.js
    globalThis.matchMedia = (mediaQueryString) => {
        // Función interna que evalúa si la consulta se cumple según las variables simuladas
        const evaluarMatches = () => {
            // Evaluamos max-width
            const matchMaxWidth = mediaQueryString.match(/\(max-width:\s*(\d+)px\)/);
            if (matchMaxWidth) {
                return simulatedWidth <= parseInt(matchMaxWidth[1], 10);
            }
            // Evaluamos min-width
            const matchMinWidth = mediaQueryString.match(/\(min-width:\s*(\d+)px\)/);
            if (matchMinWidth) {
                return simulatedWidth >= parseInt(matchMinWidth[1], 10);
            }
            // Evaluamos prefers-color-scheme: dark
            if (mediaQueryString.includes("prefers-color-scheme: dark")) {
                return simulatedDarkMode;
            }
            // Evaluamos orientation: landscape
            if (mediaQueryString.includes("orientation: landscape")) {
                return true;
            }
            // Por defecto retornamos falso si no coincide con las reglas emuladas
            return false;
        };

        // Objeto MediaQueryList con sus propiedades y métodos estándar
        const mql = {
            // Cadena de texto de la consulta serializada
            media: mediaQueryString,
            // Estado booleano actual de coincidencia
            matches: evaluarMatches(),
            // Manejador clásico onchange
            onchange: null,
            // Registro de escuchadores múltiples
            _listeners: [],
            // Método estándar para registrar escuchadores del evento 'change'
            addEventListener(evento, callback) {
                if (evento === "change") {
                    this._listeners.push(callback);
                }
            },
            // Método estándar para remover escuchadores
            removeEventListener(evento, callback) {
                if (evento === "change") {
                    this._listeners = this._listeners.filter(cb => cb !== callback);
                }
            },
            // Método deprecado conservado únicamente por retrocompatibilidad
            addListener(callback) {
                this.addEventListener("change", callback);
            },
            // Método deprecado de remoción
            removeListener(callback) {
                this.removeEventListener("change", callback);
            },
            // Método auxiliar del simulador para emular un cambio de pantalla o tema
            _triggerChange(nuevoEstadoMatches) {
                this.matches = nuevoEstadoMatches;
                const eventObj = { matches: nuevoEstadoMatches, media: this.media };
                if (typeof this.onchange === "function") {
                    this.onchange(eventObj);
                }
                this._listeners.forEach(cb => cb(eventObj));
            }
        };

        // Retornamos el objeto MediaQueryList construido
        return mql;
    };
}

// ==============================================================================
// 1. CÓDIGO ORIGINAL INICIAL DEL ALUMNO (100% PRESERVADO)
// ==============================================================================
imprimirSeparador(1, "PRIMER CONTACTO CON matchMedia() Y OBJETO MediaQueryList");

// Solicitamos la evaluación de una media query que compruebe si el ancho máximo es 500px
const mq = matchMedia("(max-width: 500px)");

// Imprimimos el objeto MediaQueryList obtenido en consola
console.log(mq);
// Mostramos la propiedad booleana .matches que indica si se cumple en este instante
console.log("¿Coincide la consulta actual? (mq.matches):", mq.matches);
// Mostramos la propiedad .media con la regla que se está evaluando
console.log("Regla CSS evaluada (mq.media):", mq.media);

// ==============================================================================
// 2. PATRÓN ESTÁNDAR: EVALUACIÓN INICIAL + ESCUCHA REACTIVA CON 'change'
// ==============================================================================
imprimirSeparador(2, "PATRÓN RECOMENDADO: EVALUACIÓN INICIAL Y EVENTO 'change'");

// Definimos una consulta para pantallas de tamaño escritorio (mínimo 1024 píxeles de ancho)
const consultaEscritorio = matchMedia("(min-width: 1024px)");

// Definimos la función manejadora que procesa tanto el objeto inicial como los eventos de cambio
const manejarCambioDeDispositivo = (evento) => {
    // Si la condición de escritorio se cumple (true)
    if (evento.matches) {
        // Ejecutamos la lógica de pantalla completa de escritorio
        console.log("🖥️ [Modo Escritorio]: Cargando navegación horizontal y componentes ampliados.");
    // Si la condición no se cumple (false, pantalla inferior a 1024px)
    } else {
        // Ejecutamos la lógica para móviles o tablets
        console.log("📱 [Modo Móvil/Tablet]: Colapsando barra lateral y activando menú hamburguesa.");
    }
};

// PASO 1: Ejecución inmediata inicial para sincronizar la interfaz apenas carga el script
console.log("Paso 1: Evaluación del estado actual al arrancar la aplicación:");
manejarCambioDeDispositivo(consultaEscritorio);

// PASO 2: Suscripción al evento 'change' para reaccionar a futuros cruces de la barrera de 1024px
consultaEscritorio.addEventListener("change", manejarCambioDeDispositivo);
console.log("Paso 2: Oyente registrado exitosamente mediante addEventListener('change', ...).");

// ==============================================================================
// 3. COMPARATIVA DE RENDIMIENTO: resize TRADICIONAL VS matchMedia MODERNO
// ==============================================================================
imprimirSeparador(3, "RENDIMIENTO: window.resize TRADICIONAL VS. matchMedia() MODERNO");

// Explicamos la sobrecarga del evento resize
console.log("⚠️ window.addEventListener('resize'):");
console.log("   - Se ejecuta decenas de veces POR SEGUNDO mientras el usuario arrastra la ventana.");
console.log("   - Provoca saturación del hilo principal de JavaScript y tirones visuales (jank).");
console.log("   - Obliga a implementar 'debouncing' o 'throttling' manual para no colapsar la CPU.\n");

// Explicamos la eficiencia de matchMedia
console.log("✅ window.matchMedia():");
console.log("   - Es gestionado internamente por el motor de renderizado del navegador a nivel de C++.");
console.log("   - Consume CERO ciclos de CPU mientras la ventana se redimensiona dentro del mismo rango.");
console.log("   - Dispara el evento 'change' EXACTAMENTE UNA VEZ cuando se cruza el punto de quiebre.");

// ==============================================================================
// 4. DETECCIÓN DE PREFERENCIAS DEL SISTEMA OPERATIVO Y ACCESIBILIDAD
// ==============================================================================
imprimirSeparador(4, "CONSULTAS AVANZADAS: MODO OSCURO, ACCESIBILIDAD Y ORIENTACIÓN");

// 1. Detección del esquema de color preferido por el usuario en su sistema operativo
const consultaTemaOscuro = matchMedia("(prefers-color-scheme: dark)");
console.log("🌙 ¿El sistema del usuario tiene activado el Tema Oscuro?:", consultaTemaOscuro.matches);

// 2. Detección de preferencia de reducción de movimiento por accesibilidad (vestibular)
const consultaMovimientoReducido = matchMedia("(prefers-reduced-motion: reduce)");
console.log("🏃 ¿El usuario solicitó reducir animaciones mareantes?:", consultaMovimientoReducido.matches);

// 3. Detección de la orientación de pantalla (landscape horizontal vs portrait vertical)
const consultaOrientacionHorizontal = matchMedia("(orientation: landscape)");
console.log("🔄 ¿Pantalla en orientación horizontal (Landscape)?:", consultaOrientacionHorizontal.matches);

// 4. Detección del tipo de puntero de entrada (táctil vs ratón)
const consultaPunteroTactil = matchMedia("(pointer: coarse)");
console.log("👆 ¿El dispositivo de entrada principal es táctil (Dedo)?:", consultaPunteroTactil.matches);

// ==============================================================================
// 5. ANALOGÍA DEL MUNDO REAL: EL TERMOSTATO INTELIGENTE 🌡️
// ==============================================================================
imprimirSeparador(5, "ANALOGÍA DEL MUNDO REAL: EL TERMOSTATO INTELIGENTE 🌡️");

console.log("Imagina cómo climatizar una oficina moderna:");
console.log("1. El enfoque antiguo ('resize') es como una persona mirando el termómetro cada");
console.log("   segundo y gritando sin parar: '¡Hacen 24°C!', '¡Hacen 23.9°C!', '¡Hacen 23.8°C!'.");
console.log("2. El enfoque moderno ('matchMedia') es un termostato inteligente calibrado a 22°C.");
console.log("3. Puedes consultarlo en cualquier momento para saber si está encendido (.matches).");
console.log("4. El termostato guarda absoluto silencio mientras la temperatura cambia, y SOLO");
console.log("   emite una notificación en el instante exacto en que cruza los 22°C (onchange).");

// ==============================================================================
// 6. SOLUCIONARIO PASO A PASO DE LOS 3 EJERCICIOS DEL TEMARIO
// ==============================================================================
imprimirSeparador(6, "SOLUCIONARIO OFICIAL: EJERCICIOS NIVEL 1, NIVEL 2 Y NIVEL 3");

// ------------------------------------------------------------------------------
// SOLUCIÓN EJERCICIO NIVEL 1: Evaluación inmediata con .matches
// ------------------------------------------------------------------------------
console.log("📘 [SOLUCIÓN EJERCICIO NIVEL 1] Detectar max-width <= 600px:");

// Creamos la consulta con la sintaxis correcta encerrada entre paréntesis
const consultaMovilNivel1 = matchMedia("(max-width: 600px)");

// Evaluamos inmediatamente su propiedad booleana .matches
if (consultaMovilNivel1.matches) {
    // Si la pantalla es menor o igual a 600px
    console.log("  ↳ Resultado: Vista móvil");
} else {
    // Si la pantalla es superior a 600px
    console.log("  ↳ Resultado: Vista amplia");
}

// ------------------------------------------------------------------------------
// SOLUCIÓN EJERCICIO NIVEL 2: Escucha con la propiedad 'onchange'
// ------------------------------------------------------------------------------
console.log("\n📗 [SOLUCIÓN EJERCICIO NIVEL 2] Observador de Modo Oscuro con .onchange:");

// Creamos la consulta de medios que evalúa el tema oscuro del sistema
const consultaTemaNivel2 = matchMedia("(prefers-color-scheme: dark)");

// Asignamos la función manejadora a la propiedad .onchange
consultaTemaNivel2.onchange = (evento) => {
    // Evaluamos el nuevo estado de la preferencia
    if (evento.matches) {
        console.log("  ↳ [onchange]: Cambiado a modo oscuro");
    } else {
        console.log("  ↳ [onchange]: Cambiado a modo claro");
    }
};

// Mostramos confirmación de la suscripción
console.log("  ↳ Escuchador asignado a consultaTemaNivel2.onchange con éxito.");

// ------------------------------------------------------------------------------
// SOLUCIÓN EJERCICIO NIVEL 3: Función configurarNavegacionAdaptativa
// ------------------------------------------------------------------------------
console.log("\n📙 [SOLUCIÓN EJERCICIO NIVEL 3] Función configurarNavegacionAdaptativa (992px):");

// Definimos la función completa solicitada en el temario
const configurarNavegacionAdaptativa = () => {
    // 1. Instanciamos la consulta con el punto de quiebre de 992px
    const consultaEscritorioNivel3 = matchMedia("(min-width: 992px)");

    // 2. Definimos la subfunción reutilizable que acepta tanto MediaQueryList como MediaQueryListEvent
    const actualizarInterfaz = (evento) => {
        // Evaluamos si el viewport tiene al menos 992px de ancho
        if (evento.matches) {
            // Si nos encontramos en navegador con DOM real
            if (typeof document !== "undefined") {
                document.body.classList.add("desktop-nav");
            }
            console.log("  ↳ [Nivel 3]: Ancho >= 992px detectado. Clase 'desktop-nav' aplicada.");
        } else {
            // Si es menor a 992px
            if (typeof document !== "undefined") {
                document.body.classList.remove("desktop-nav");
            }
            console.log("  ↳ [Nivel 3]: Ancho < 992px detectado. Clase 'desktop-nav' removida.");
        }
    };

    // 3. Ejecutamos la función de inmediato para sincronizar el estado inicial
    actualizarInterfaz(consultaEscritorioNivel3);

    // 4. Registramos el evento change con addEventListener para futuros cambios
    consultaEscritorioNivel3.addEventListener("change", actualizarInterfaz);
};

// Invocamos la función de configuración
configurarNavegacionAdaptativa();

// ==============================================================================
// 7. PROYECTO INTEGRADOR: OBSERVADOR MULTIDISPOSITIVO CON MÚLTIPLES BREAKPOINTS
// ==============================================================================
imprimirSeparador(7, "PROYECTO INTEGRADOR: OBSERVADOR MULTI-BREAKPOINT REACTIVO");

// Definimos un diccionario de consultas representativas de los estándares web actuales
const breakpoints = {
    movil: matchMedia("(max-width: 599px)"),
    tablet: matchMedia("(min-width: 600px) and (max-width: 1023px)"),
    escritorio: matchMedia("(min-width: 1024px)")
};

// Función que inspecciona y determina la categoría de pantalla actual
const diagnosticarPantalla = () => {
    if (breakpoints.movil.matches) return "📱 Dispositivo Móvil (Smartphone)";
    if (breakpoints.tablet.matches) return "📟 Tablet / Pantalla Intermedia";
    if (breakpoints.escritorio.matches) return "💻 Pantalla Grande de Escritorio";
    return "🌐 Desconocido";
};

// Imprimimos el diagnóstico de pantalla actual
console.log("Categoría de pantalla diagnosticada:", diagnosticarPantalla());

// ==============================================================================
// 8. RESUMEN MAESTRO Y CONCLUSIONES TÉCNICAS
// ==============================================================================
imprimirSeparador(8, "RESUMEN MAESTRO DEL MÓDULO MATCHMEDIA");

console.log("1. 🎯 Propósito: window.matchMedia() une la potencia de CSS Media Queries con la lógica de JS.");
console.log("2. 🔍 Propiedad .matches: Booleano inmediato (true / false) para tomar decisiones condicionales.");
console.log("3. ⚡ Evento 'change': Se dispara con cero desperdicio de CPU solo al cruzar el breakpoint.");
console.log("4. 🛡️ Buenas prácticas: Ejecutar siempre la función al inicio Y registrar addEventListener('change').");
console.log("5. 🎨 Regla de Oro: Si el cambio es solo visual, usa @media en CSS. Si requiere lógica, usa matchMedia().");
console.log("=".repeat(78));
console.log("🎓 ¡Módulo de window.matchMedia() completado con éxito al 100%!");
console.log("=".repeat(78) + "\n");
