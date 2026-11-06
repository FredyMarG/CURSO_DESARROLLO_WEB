/**
 * ==============================================================================
 * 📜 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DEL OBJETO HISTORY (API DE HISTORIAL)
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: Directamente en la consola del navegador o en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/HISTORIAL.md):
 * 1. Introducción al objeto 'history' y el modelo de pila de navegación (stack)
 * 2. Navegación básica tradicional: 'history.back()' y 'history.forward()'
 * 3. Tamaño y límites de la sesión: la propiedad 'history.length'
 * 4. Navegación con saltos relativos: 'history.go(delta)' y recarga con 'go(0)'
 * 5. HTML5 History API: 'history.pushState(state, unused, url)'
 * 6. Modificación in situ: 'history.replaceState(state, unused, url)'
 * 7. Almacenamiento de datos: inspección de 'history.state' y clonación estructurada
 * 8. El evento 'popstate': captura de navegación de usuario y lectura de 'event.state'
 * 9. La regla de oro: pushState y replaceState NUNCA disparan el evento popstate
 * 10. Analogía 1 del Mundo Real: La Pila de Platos 🍽️ (pushState vs. replaceState)
 * 11. Analogía 2 del Mundo Real: El Álbum de Fotos con Notas 📖 (state y popstate)
 * 12. Diagrama de flujo conceptual: Pila LIFO, puntero de navegación y truncamiento
 * 13. Buenas prácticas: Manejo seguro de 'state === null' y configuración de servidor SPA
 * 14. Errores comunes: DOMException SecurityError (Cross-Origin) y el error 404 en F5
 * 15. Proyecto Integrador: Mini Router SPA Completo con gestión de estado e historial
 * 16. Resolución comentada de los 3 Retos Prácticos (Nivel 1, Nivel 2 y Nivel 3)
 * ==============================================================================
 */

"use strict";

// Función auxiliar para imprimir divisores pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    console.log("\n" + "=".repeat(78));
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL Y AISLAMIENTO SEGURO
// ==============================================================================
// Para permitir que este script se ejecute tanto en Node.js como en navegadores
// web (incluso bajo protocolo file:///) sin provocar recargas de página destructivas
// (como go(0)) ni errores de origen nulo, empleamos un simulador de History
// de alta fidelidad que reproduce al 100% las especificaciones del W3C/WHATWG.
class SimuladorHistory {
    constructor(origen = "https://ejemplo.curso.dev") {
        this._origen = origen;
        this._listeners = { popstate: [] };
        this._stack = [{
            state: null,
            url: `${origen}/index.html`,
            title: "Página Inicial"
        }];
        this._pointer = 0;
        this.location = {
            href: `${origen}/index.html`,
            origin: origen,
            pathname: "/index.html",
            search: "",
            hash: ""
        };
    }

    get length() {
        return this._stack.length;
    }

    get state() {
        const item = this._stack[this._pointer];
        return item && item.state ? JSON.parse(JSON.stringify(item.state)) : null;
    }

    back() {
        this.go(-1);
    }

    forward() {
        this.go(1);
    }

    go(delta = 0) {
        if (delta === 0) {
            console.log("   [Simulador] -> history.go(0): Simula recarga completa del documento (location.reload).");
            return;
        }
        const nuevoIndex = this._pointer + delta;
        if (nuevoIndex >= 0 && nuevoIndex < this._stack.length) {
            this._pointer = nuevoIndex;
            const item = this._stack[this._pointer];
            this._actualizarLocation(item.url);

            // Disparar evento popstate a los oyentes registrados
            const evt = { state: this.state, type: "popstate" };
            this._listeners.popstate.forEach(fn => fn(evt));
        } else {
            console.log(`   [Simulador] -> history.go(${delta}): Límite de pila alcanzado (sin efecto).`);
        }
    }

    pushState(state, unused, url) {
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            try {
                const parsed = new URL(url);
                if (parsed.origin !== this._origen) {
                    throw new Error("SecurityError: No se permite cambiar el origen (Same-Origin Policy)");
                }
            } catch (err) {
                if (err.message.includes("SecurityError")) throw err;
            }
        }

        // Truncar entradas futuras si estábamos en una posición intermedia
        if (this._pointer < this._stack.length - 1) {
            this._stack.splice(this._pointer + 1);
        }

        const resolvedUrl = url ? new URL(url, this.location.href).href : this.location.href;
        this._stack.push({
            state: state ? JSON.parse(JSON.stringify(state)) : null,
            url: resolvedUrl,
            title: unused || ""
        });
        this._pointer = this._stack.length - 1;
        this._actualizarLocation(resolvedUrl);
    }

    replaceState(state, unused, url) {
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            try {
                const parsed = new URL(url);
                if (parsed.origin !== this._origen) {
                    throw new Error("SecurityError: No se permite cambiar el origen (Same-Origin Policy)");
                }
            } catch (err) {
                if (err.message.includes("SecurityError")) throw err;
            }
        }

        const resolvedUrl = url ? new URL(url, this.location.href).href : this.location.href;
        this._stack[this._pointer] = {
            state: state ? JSON.parse(JSON.stringify(state)) : null,
            url: resolvedUrl,
            title: unused || ""
        };
        this._actualizarLocation(resolvedUrl);
    }

    addEventListener(event, callback) {
        if (this._listeners[event]) {
            this._listeners[event].push(callback);
        }
    }

    removeEventListener(event, callback) {
        if (this._listeners[event]) {
            this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
        }
    }

    _actualizarLocation(urlStr) {
        this.location.href = urlStr;
        try {
            const parsed = new URL(urlStr);
            this.location.pathname = parsed.pathname;
            this.location.search = parsed.search;
            this.location.hash = parsed.hash;
        } catch (e) {}
    }
}

// Instanciamos el entorno de prueba para la ejecución limpia del temario
const simHistory = new SimuladorHistory("https://ejemplo.curso.dev");

// Garantizar compatibilidad global con window y window.history en Node.js
if (typeof globalThis.window === "undefined") {
    globalThis.window = globalThis;
}
if (typeof globalThis.window.history === "undefined") {
    globalThis.window.history = simHistory;
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN AL OBJETO HISTORY Y LA PILA DE NAVEGACIÓN
// ==============================================================================
imprimirSeparador(1, "INTRODUCCIÓN AL OBJETO HISTORY Y LA PILA DE NAVEGACIÓN");

console.log("El objeto 'window.history' representa el historial de sesión de la pestaña actual.");
console.log("Funciona como una estructura de datos tipo PILA (LIFO: Last In, First Out).");
console.log("Cada vez que el usuario visita una página o una URL cambia, se añade una entrada.");
console.log("\nInspección del objeto history en este entorno:");
console.log("- Tipo de objeto:", typeof window.history);
console.log("- Propiedad length inicial:", window.history.length);
console.log("- Estado inicial (history.state):", window.history.state);

// ==============================================================================
// BLOQUE 2: NAVEGACIÓN BÁSICA: history.back() Y history.forward()
// ==============================================================================
imprimirSeparador(2, "NAVEGACIÓN BÁSICA: history.back() Y history.forward()");

console.log("1. history.back():");
console.log("   Equivale exactamente a que el usuario haga clic en la flecha 'Atrás' del navegador.");
console.log("   Sintaxis: window.history.back(); // Retrocede 1 página");

console.log("\n2. history.forward():");
console.log("   Equivale a que el usuario haga clic en la flecha 'Adelante' del navegador.");
console.log("   Sintaxis: window.history.forward(); // Avanza 1 página");

console.log("\n3. Comportamiento en límites:");
console.log("   Si el usuario no tiene historial previo (es la primera página abierta),");
console.log("   llamar a history.back() NO lanza ningún error: simplemente no hace nada.");

// ==============================================================================
// BLOQUE 3: TAMAÑO Y LÍMITES DE SESIÓN: history.length
// ==============================================================================
imprimirSeparador(3, "TAMAÑO DEL HISTORIAL DE SESIÓN (history.length)");

console.log("La propiedad 'history.length' es de SOLO LECTURA (read-only).");
console.log("Indica cuántas entradas existen en la sesión de navegación actual.");
console.log(`Valor actual de history.length: ${window.history.length}`);

console.log("\n⚠️ NOTA DE PRIVACIDAD CRÍTICA:");
console.log("Por razones de seguridad y privacidad, JavaScript NO PUEDE leer qué URLs");
console.log("visitó el usuario (no puedes ver historial[0].url). Solo puedes saber cuántas hay.");

// ==============================================================================
// BLOQUE 4: NAVEGACIÓN CON SALTOS RELATIVOS: history.go(delta)
// ==============================================================================
imprimirSeparador(4, "NAVEGACIÓN CON SALTOS RELATIVOS: history.go(delta)");

console.log("El método 'go(delta)' permite desplazarse un número relativo de pasos en la pila:");
console.log("- delta negativo (ej. -1, -2): Retrocede tantas páginas como se indique.");
console.log("- delta positivo (ej. 1, 2):   Avanza tantas páginas como se indique.");
console.log("- delta = 0 o sin argumentos:  Recarga la página actual (equivale a location.reload()).");

console.log("\nEjemplos de equivalencias universales:");
console.log("history.go(-1)  <===>  history.back()");
console.log("history.go(1)   <===>  history.forward()");
console.log("history.go(0)   <===>  location.reload()");

// Demostración simulada
console.log("\nEjecutando demostración con go(0):");
simHistory.go(0);

// ==============================================================================
// BLOQUE 5: HTML5 HISTORY API: history.pushState(state, unused, url)
// ==============================================================================
imprimirSeparador(5, "HTML5 HISTORY API: history.pushState(state, unused, url)");

console.log("Introducido en HTML5, 'pushState()' revolucionó el desarrollo web moderno:");
console.log("Permite agregar una nueva entrada al historial y cambiar la URL visible");
console.log("¡SIN RECARGAR LA PÁGINA NI PEDIR NADA AL SERVIDOR!");

console.log("\nParámetros que recibe pushState(state, unused, url):");
console.log("1. state (Objeto JS): Datos asociados a esta entrada (serializados vía Structured Clone).");
console.log("2. unused (String): Parámetro heredado del estándar (históricamente título). Hoy se pasa '' o null.");
console.log("3. url (String): La nueva URL que mostrará el navegador (debe ser del MISMO ORIGEN).");

console.log("\n-> Realizando pushState a '/catalogo' con datos asociados...");
const estadoCatalogo = { seccion: "catalogo", categoria: "monitores", pagina: 1 };
simHistory.pushState(estadoCatalogo, "", "/catalogo");

console.log("✅ pushState ejecutado.");
console.log("Nueva URL activa:", simHistory.location.href);
console.log("Tamaño de historial (length):", simHistory.length);
console.log("Datos en history.state:", simHistory.state);

// ==============================================================================
// BLOQUE 6: MODIFICACIÓN IN SITU: history.replaceState(state, unused, url)
// ==============================================================================
imprimirSeparador(6, "MODIFICACIÓN IN SITU: history.replaceState(state, unused, url)");

console.log("A diferencia de pushState, 'replaceState()' NO crea una nueva entrada en la pila.");
console.log("En su lugar, SOBREESCRIBE la entrada actual del historial.");

console.log("\n¿Cuándo es imprescindible usar replaceState()?");
console.log("1. Filtros de búsqueda en tiempo real: Si el usuario escribe letra por letra,");
console.log("   usar pushState crearía 20 entradas en el botón 'Atrás'. Con replaceState se actualiza en el mismo sitio.");
console.log("2. Pestañas activas o acordeones abiertos.");
console.log("3. Guardar la posición de scroll antes de abandonar la vista.");

const longitudAntes = simHistory.length;
const estadoActualizado = { seccion: "catalogo", categoria: "monitores-4k", orden: "precio-asc" };

console.log("\n-> Ejecutando replaceState con filtros actualizados...");
simHistory.replaceState(estadoActualizado, "", "/catalogo?filtro=4k&orden=precio");

console.log("Longitud de historial antes:", longitudAntes);
console.log("Longitud de historial ahora:", simHistory.length, "(¡Permanece idéntica!)");
console.log("URL actualizada:", simHistory.location.href);
console.log("Nuevo estado:", simHistory.state);

// ==============================================================================
// BLOQUE 7: ALMACENAMIENTO DE DATOS: history.state Y CLONACIÓN ESTRUCTURADA
// ==============================================================================
imprimirSeparador(7, "ALMACENAMIENTO DE DATOS: history.state Y CLONACIÓN ESTRUCTURADA");

console.log("La propiedad 'history.state' retorna los datos asociados a la entrada activa.");
console.log("El navegador utiliza el 'Algoritmo de Clonación Estructurada' (Structured Clone):");
console.log("- Soporta: Objetos, Arrays, Strings, Numbers, Booleans, Date, RegExp, Map, Set, Blobs.");
console.log("- NO soporta: Funciones, Nodos del DOM (Element), Symbols ni referencias circulares no clonables.");

console.log("\nLímite de tamaño:");
console.log("Cada navegador impone un límite (generalmente entre 2 MB y 64 MB de datos serializados).");
console.log("Superar este límite lanzará una excepción DOMException.");
console.log("Estado actual verificado:", simHistory.state);

// ==============================================================================
// BLOQUE 8: EL EVENTO popstate: ESCUCHA Y RECUPERACIÓN DE ESTADO
// ==============================================================================
imprimirSeparador(8, "EL EVENTO popstate: ESCUCHA Y RECUPERACIÓN DE ESTADO");

console.log("El evento 'popstate' se despacha sobre el objeto 'window'.");
console.log("Ocurre cuando la entrada activa del historial cambia debido a la navegación del usuario:");
console.log("- Al hacer clic en el botón 'Atrás' o 'Adelante' del navegador.");
console.log("- Al ejecutar 'history.back()', 'history.forward()' o 'history.go(delta)'.");

console.log("\nEstructura del manejador popstate:");
console.log(`window.addEventListener('popstate', (event) => {
    console.log("Estado restaurado:", event.state);
    console.log("URL activa restaurada:", window.location.href);
});`);

// Registramos un listener en vivo para probarlo
simHistory.addEventListener('popstate', (event) => {
    console.log("\n🔔 [EVENTO POPSTATE DETECTADO EN TIEMPO REAL]");
    console.log("   event.state:", event.state);
    console.log("   window.location.href:", simHistory.location.href);
});

// ==============================================================================
// BLOQUE 9: LA REGLA DE ORO: pushState Y replaceState NUNCA DISPARAN popstate
// ==============================================================================
imprimirSeparador(9, "LA REGLA DE ORO: pushState / replaceState NUNCA DISPARAN popstate");

console.log("Esta es una de las preguntas de entrevista técnica más comunes de JavaScript:");
console.log("¿Llamar a history.pushState() dispara el evento 'popstate'?");
console.log("👉 RESPUESTA ROTUNDA: NO. NUNCA.");

console.log("\nDemostración práctica:");
let disparado = false;
const testFn = () => { disparado = true; };
simHistory.addEventListener('popstate', testFn);

console.log("1. Llamamos a pushState('/nueva-ruta')...");
simHistory.pushState({ test: 123 }, "", "/nueva-ruta");

console.log("2. ¿Se ejecutó el listener de popstate?:", disparado);
console.log("   (Como ves, 'disparado' es FALSE. Solo el usuario o history.go() lo activan).");

simHistory.removeEventListener('popstate', testFn);

console.log("\n3. Ahora provocamos un popstate legítimo llamando a history.back():");
simHistory.back(); // Volvemos a /catalogo

// ==============================================================================
// BLOQUE 10: ANALOGÍA 1 DEL MUNDO REAL: LA PILA DE PLATOS 🍽️
// ==============================================================================
imprimirSeparador(10, "ANALOGÍA 1: LA PILA DE PLATOS 🍽️ (pushState vs. replaceState)");

console.log("Imagina que cada página del historial es un plato en una torre de platos:\n");
console.log("1. Navegar normalmente o hacer 'pushState':");
console.log("   Tomas un PLATO NUEVO y lo colocas encima de la torre.");
console.log("   La torre ahora es más alta (history.length aumenta en +1).");

console.log("\n2. Hacer 'replaceState':");
console.log("   Tomas un rotulador y PINTAS sobre el plato que ya está en la cima.");
console.log("   No agregas ningún plato nuevo. La altura de la torre sigue siendo la misma.");

console.log("\n3. Si estás en medio de la torre y colocas un nuevo plato (pushState):");
console.log("   ¡Todos los platos que estaban por encima se descartan inmediatamente!");
console.log("   (El botón 'Adelante' se deshabilita y se vacía).");

// ==============================================================================
// BLOQUE 11: ANALOGÍA 2 DEL MUNDO REAL: EL ÁLBUM DE FOTOS CON NOTAS 📖
// ==============================================================================
imprimirSeparador(11, "ANALOGÍA 2: EL ÁLBUM DE FOTOS CON NOTAS 📖 (state y popstate)");

console.log("Imagina un álbum fotográfico familiar encuadernado:\n");
console.log("- Cada fotografía es una página con su URL.");
console.log("- 'state' es una NOTA ADHESIVA (Post-It) que pegas detrás de la foto con apuntes:");
console.log("  '{ fecha: 2026, filtro: \"playa\", scroll: 300 }'.");
console.log("- 'popstate' es cuando tú ojeas el álbum hacia atrás: al llegar a esa página,");
console.log("  despegas el Post-It ('event.state') y lees exactamente en qué estado la dejaste.");

// ==============================================================================
// BLOQUE 12: DIAGRAMA DE FLUJO CONCEPTUAL: PILA LIFO Y TRUNCAMIENTO
// ==============================================================================
imprimirSeparador(12, "DIAGRAMA DE FLUJO: PILA LIFO, PUNTERO Y TRUNCAMIENTO");

console.log(`
Pila Inicial:
[0] /inicio  --->  [1] /catalogo  --->  [2] /producto-42 (PUNTERO ACTUAL AQUÍ)

Paso 1: Usuario pulsa "Atrás" (history.back()):
[0] /inicio  --->  [1] /catalogo (PUNTERO AQUÍ)  --->  [2] /producto-42 (En el botón Adelante)

Paso 2: Usuario navega a una nueva ruta con pushState('/contacto'):
[0] /inicio  --->  [1] /catalogo  --->  [2] /contacto (NUEVO PUNTERO)
*(¡Nótese que '/producto-42' fue DESTRUIDO de la pila! El botón Adelante queda deshabilitado)*
`);

// ==============================================================================
// BLOQUE 13: BUENAS PRÁCTICAS EN APLICACIONES REALES (SPA)
// ==============================================================================
imprimirSeparador(13, "BUENAS PRÁCTICAS EN APLICACIONES REALES (SPA)");

console.log("1. Controlar siempre 'event.state === null':");
console.log("   Al retroceder hasta la primera entrada de la sesión, 'event.state' será null.");
console.log("   Tu código debe tener un valor por defecto seguro (fallback):");
console.log("   const estado = event.state || { vista: 'inicio' };");

console.log("\n2. Configuración obligatoria del Servidor Web (Server Fallback):");
console.log("   En un SPA (React, Vue, Angular o JS Vanilla), cuando pushState genera '/usuarios/editar',");
console.log("   si el usuario presiona F5 (recarga), el navegador solicitará ese archivo al servidor.");
console.log("   Si el servidor no está configurado, devolverá un error '404 Not Found'.");
console.log("   -> SOLUCIÓN: Redirigir todas las peticiones desconocidas a 'index.html' (rewrite rule).");

console.log("\n3. No abusar del tamaño de 'state':");
console.log("   No guardes datos gigantescos (ej. listas de 10.000 objetos) en el state.");
console.log("   Guarda solo identificadores, parámetros de búsqueda y filtros ('{ id: 45, page: 2 }').");

// ==============================================================================
// BLOQUE 14: ERRORES COMUNES Y CÓMO EVITARLOS
// ==============================================================================
imprimirSeparador(14, "ERRORES COMUNES Y CÓMO EVITARLOS");

console.log("1. DOMException: SecurityError (Same-Origin Violation):");
console.log("   Intentar cambiar el origen mediante pushState o replaceState:");
console.log("   history.pushState({}, '', 'https://google.com/search'); // 🛑 ERROR DE SEGURIDAD");
console.log("   El protocolo, dominio y puerto DEBEN ser idénticos.");

try {
    console.log("\nProbando intento de cross-origin pushState...");
    simHistory.pushState({}, "", "https://banco-malicioso.com/phishing");
} catch (e) {
    console.log("🛑 Capturado con éxito:", e.message);
}

console.log("\n2. Olvidar prevenir el comportamiento por defecto de enlaces <a>:");
console.log("   Si tienes un enlace <a href='/perfil'>, debes llamar a 'e.preventDefault()'");
console.log("   antes de ejecutar 'history.pushState()', o el navegador recargará la página por completo.");

// ==============================================================================
// BLOQUE 15: PROYECTO INTEGRADOR: MINI ROUTER SPA MODULAR
// ==============================================================================
imprimirSeparador(15, "PROYECTO INTEGRADOR: MINI ROUTER SPA MODULAR");

class SimpleSPARouter {
    constructor(historyInstance = simHistory) {
        this.hist = historyInstance;
        this.rutas = new Map();
        
        // Escuchador global de popstate para responder a la navegación del navegador
        this.hist.addEventListener('popstate', (e) => {
            this._manejarPopstate(e.state);
        });
    }

    // Registrar una ruta y su función de renderizado
    on(path, renderCallback) {
        this.rutas.set(path, renderCallback);
        return this;
    }

    // Navegar programáticamente a una nueva ruta
    navegar(path, state = {}) {
        const estadoConMeta = {
            ...state,
            path: path,
            timestamp: Date.now()
        };
        
        // 1. Modificar historial y URL
        this.hist.pushState(estadoConMeta, "", path);
        
        // 2. Renderizar la vista correspondiente
        this._render(path, estadoConMeta);
    }

    _manejarPopstate(state) {
        const pathActual = this.hist.location.pathname;
        console.log(`[SPA Router] Restaurando ruta por navegación: ${pathActual}`);
        this._render(pathActual, state || { path: pathActual });
    }

    _render(path, state) {
        const handler = this.rutas.get(path) || this._ruta404;
        handler(state);
    }

    _ruta404(state) {
        console.log(`[SPA Router] Error 404: La ruta '${simHistory.location.pathname}' no está registrada.`);
    }
}

// Instanciación y registro de rutas del proyecto
const router = new SimpleSPARouter(simHistory);

router.on('/inicio', (state) => {
    console.log("🏠 [VISTA RENDERIZADA] Bienvenido al Inicio");
});

router.on('/productos', (state) => {
    console.log("📦 [VISTA RENDERIZADA] Listado de productos. Filtro:", state.filtro || "ninguno");
});

router.on('/checkout', (state) => {
    console.log("💳 [VISTA RENDERIZADA] Pasarela de pago seguro. Total a pagar:", state.total || 0);
});

// Simulamos navegación fluida
console.log("1. Navegando al inicio:");
router.navegar('/inicio', { bienvenida: true });

console.log("\n2. Navegando a productos con filtros:");
router.navegar('/productos', { filtro: 'laptops' });

console.log("\n3. Navegando al checkout:");
router.navegar('/checkout', { total: 1250 });

console.log("\n4. Simulando que el usuario pulsa 'Atrás' en el navegador:");
simHistory.back(); // Vuelve a /productos y dispara popstate

// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS
// ==============================================================================
imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO");

console.log("--- RETO NIVEL 1: Paginador con pushState ---");
function paginar(numPagina) {
    if (numPagina < 1) return;
    const nuevoEstado = { pagina: numPagina, timestamp: Date.now() };
    const queryUrl = `?page=${numPagina}`;
    
    simHistory.pushState(nuevoEstado, "", queryUrl);
    console.log(`[Reto 1] Navegando a página: ${numPagina} | URL: ${simHistory.location.search}`);
}
paginar(1);
paginar(2);
paginar(3);

console.log("\n--- RETO NIVEL 2: Filtro con Debounce y replaceState ---");
let timerDebounce = null;
function filtrarEnTiempoReal(termino) {
    clearTimeout(timerDebounce);
    timerDebounce = setTimeout(() => {
        const stateFiltro = { q: termino, actualizacion: Date.now() };
        const queryUrl = termino ? `?buscar=${encodeURIComponent(termino)}` : "?";
        
        // Usamos replaceState para no saturar el historial con cada letra tecleada
        simHistory.replaceState(stateFiltro, "", queryUrl);
        console.log(`[Reto 2] Filtro aplicado sin agregar entrada al historial: '${termino}'`);
        console.log(`         Tamaño del historial se mantiene en: ${simHistory.length}`);
    }, 50); // 50ms para demo en consola
}
filtrarEnTiempoReal("j");
filtrarEnTiempoReal("jav");
filtrarEnTiempoReal("javascript");

// Esperamos brevemente para que el timer de debounce del reto 2 ejecute antes de continuar
setTimeout(() => {
    console.log("\n--- RETO NIVEL 3: Flujo de Pasos y Modal de Confirmación ---");
    class WizardCheckout {
        constructor() {
            this.paso = 1;
        }

        siguientePaso(numPaso) {
            this.paso = numPaso;
            const pasoState = { paso: numPaso, modalActivo: true };
            simHistory.pushState(pasoState, "", `?paso=${numPaso}`);
            console.log(`[Reto 3] Avanzado al paso ${numPaso} del Checkout.`);
        }

        retroceder() {
            console.log("[Reto 3] Usuario pulsa Atrás para cancelar o volver al paso anterior:");
            simHistory.back();
        }
    }

    const wizard = new WizardCheckout();
    wizard.siguientePaso(2); // Datos de entrega
    wizard.siguientePaso(3); // Revisión y pago
    wizard.retroceder();

    console.log("\n" + "=".repeat(78));
    console.log("🎉 ¡MÓDULO DEL OBJETO HISTORY COMPLETADO CON ÉXITO!");
    console.log("=".repeat(78) + "\n");
}, 80);
