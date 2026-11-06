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

// Activamos el modo estricto de JavaScript para evitar errores sutiles y variables globales accidentales
"use strict";

// Definición de una función auxiliar para imprimir encabezados y divisores visuales en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial seguido de 78 caracteres de signo igual como borde superior
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque y el título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea de cierre de 78 caracteres de longitud
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL Y AISLAMIENTO SEGURO
// ==============================================================================
// Para permitir que este script se ejecute tanto en Node.js como en navegadores
// web (incluso bajo protocolo file:///) sin provocar recargas de página destructivas
// (como go(0)) ni errores de origen nulo, empleamos un simulador de History
// de alta fidelidad que reproduce al 100% las especificaciones del W3C/WHATWG.

// Definimos la clase del simulador de la API de historial para entornos sin navegador o con restricciones
class SimuladorHistory {
    // Constructor que inicializa el origen base seguro de la simulación
    constructor(origen = "https://ejemplo.curso.dev") {
        // Almacena el origen HTTP base para verificar reglas de Same-Origin Policy
        this._origen = origen;
        // Registro interno de oyentes para el evento personalizado 'popstate'
        this._listeners = { popstate: [] };
        // Estructura interna de pila (Array) que almacena las entradas históricas de navegación
        this._stack = [{
            // Estado inicial nulo de la primera página cargada
            state: null,
            // URL completa inicial de arranque de la aplicación
            url: `${origen}/index.html`,
            // Título asociado a la entrada inicial
            title: "Página Inicial"
        }];
        // Puntero numérico que señala el índice del elemento actualmente activo en la pila
        this._pointer = 0;
        // Objeto reactivo location que emula window.location de los navegadores
        this.location = {
            // Dirección URL completa actual visible
            href: `${origen}/index.html`,
            // Origen de protocolo, dominio y puerto
            origin: origen,
            // Ruta relativa del recurso solicitado
            pathname: "/index.html",
            // Parámetros de consulta (query string) iniciales vacíos
            search: "",
            // Fragmento hash de la URL inicial vacío
            hash: ""
        };
    }

    // Getter que emula la propiedad 'history.length' devolviendo el número total de entradas en la pila
    get length() {
        // Retorna la cantidad de elementos almacenados en el array de la pila
        return this._stack.length;
    }

    // Getter que emula 'history.state' devolviendo una copia profunda del estado de la entrada activa
    get state() {
        // Obtiene la entrada correspondiente a la posición actual del puntero
        const item = this._stack[this._pointer];
        // Retorna una copia clonada profunda (serializada) o null si no posee estado
        return item && item.state ? JSON.parse(JSON.stringify(item.state)) : null;
    }

    // Método que emula 'history.back()' retrocediendo exactamente una posición en la pila
    back() {
        // Delega la operación en el método go pasando un delta de -1
        this.go(-1);
    }

    // Método que emula 'history.forward()' avanzando exactamente una posición en la pila
    forward() {
        // Delega la operación en el método go pasando un delta de +1
        this.go(1);
    }

    // Método que emula 'history.go(delta)' permitiendo saltos relativos arbitrarios en el historial
    go(delta = 0) {
        // Si el delta es cero, la especificación dicta recargar el documento actual
        if (delta === 0) {
            // Imprime mensaje explicativo informando de la simulación de recarga (location.reload())
            console.log("   [Simulador] -> history.go(0): Simula recarga completa del documento (location.reload).");
            // Sale inmediatamente para evitar bucles o recargas reales no deseadas
            return;
        }
        // Calcula el nuevo índice objetivo sumando el delta algebraico al puntero actual
        const nuevoIndex = this._pointer + delta;
        // Valida que el nuevo índice esté dentro de los límites válidos del array
        if (nuevoIndex >= 0 && nuevoIndex < this._stack.length) {
            // Actualiza el puntero interno a la nueva posición alcanzada
            this._pointer = nuevoIndex;
            // Extrae la entrada histórica en esa posición de la pila
            const item = this._stack[this._pointer];
            // Actualiza el objeto location con la URL del registro activado
            this._actualizarLocation(item.url);

            // Crea el objeto de evento popstate conteniendo el estado clonado y el tipo de evento
            const evt = { state: this.state, type: "popstate" };
            // Notifica y ejecuta cada una de las funciones escuchadoras suscritas a 'popstate'
            this._listeners.popstate.forEach(fn => fn(evt));
        } else {
            // Si el índice excede los límites (más atrás que el origen o más adelante que el tope)
            console.log(`   [Simulador] -> history.go(${delta}): Límite de pila alcanzado (sin efecto).`);
        }
    }

    // Método que emula 'history.pushState(state, unused, url)' agregando una nueva entrada a la pila
    pushState(state, unused, url) {
        // Validación de seguridad para URLs absolutas con protocolo HTTP o HTTPS
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            try {
                // Parsea la URL candidata usando la clase estándar URL
                const parsed = new URL(url);
                // Si el origen de la URL difiere del origen base registrado, se rechaza la operación
                if (parsed.origin !== this._origen) {
                    // Lanza excepción emulando el DOMException SecurityError del navegador
                    throw new Error("SecurityError: No se permite cambiar el origen (Same-Origin Policy)");
                }
            } catch (err) {
                // Si el error corresponde al SecurityError, se propaga hacia arriba
                if (err.message.includes("SecurityError")) throw err;
            }
        }

        // Si el puntero actual no está en la cima (usuario retrocedió previamente), truncamos entradas futuras
        if (this._pointer < this._stack.length - 1) {
            // Elimina todos los elementos posteriores al puntero actual (destruye el camino hacia adelante)
            this._stack.splice(this._pointer + 1);
        }

        // Resuelve la URL absoluta combinando la ruta proporcionada con la URL activa de base
        const resolvedUrl = url ? new URL(url, this.location.href).href : this.location.href;
        // Agrega la nueva entrada en la cima de la pila con copia clonada de los datos de estado
        this._stack.push({
            // Clona profundamente los datos de estado usando JSON para emular Structured Clone
            state: state ? JSON.parse(JSON.stringify(state)) : null,
            // Asigna la URL final resuelta
            url: resolvedUrl,
            // Asigna el título o cadena vacía si no se indicó
            title: unused || ""
        });
        // Mueve el puntero activo a la nueva entrada creada al final del array
        this._pointer = this._stack.length - 1;
        // Sincroniza las propiedades del objeto location simulado
        this._actualizarLocation(resolvedUrl);
    }

    // Método que emula 'history.replaceState(state, unused, url)' modificando la entrada actual sin crear otra
    replaceState(state, unused, url) {
        // Verificación de seguridad de Same-Origin Policy para URLs absolutas
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            try {
                // Instancia un objeto URL para descomponer y validar el origen
                const parsed = new URL(url);
                // Si el origen difiere, bloquea la ejecución de inmediato
                if (parsed.origin !== this._origen) {
                    // Lanza error de seguridad por violación de origen cruzado
                    throw new Error("SecurityError: No se permite cambiar el origen (Same-Origin Policy)");
                }
            } catch (err) {
                // Propaga el error de seguridad si fue detectado
                if (err.message.includes("SecurityError")) throw err;
            }
        }

        // Resuelve la URL completa basada en la URL activa previa
        const resolvedUrl = url ? new URL(url, this.location.href).href : this.location.href;
        // Reemplaza los datos de la entrada señalada por el puntero actual sin alterar el tamaño de la pila
        this._stack[this._pointer] = {
            // Almacena una copia clonada del nuevo estado provisto
            state: state ? JSON.parse(JSON.stringify(state)) : null,
            // Actualiza la URL asignada a esta entrada
            url: resolvedUrl,
            // Asigna el título o valor por defecto
            title: unused || ""
        };
        // Sincroniza el objeto location con la nueva URL
        this._actualizarLocation(resolvedUrl);
    }

    // Método para registrar oyentes de eventos sobre la instancia del simulador
    addEventListener(event, callback) {
        // Si el evento solicitado existe en la lista de eventos soportados
        if (this._listeners[event]) {
            // Añade la función callback al array de suscriptores
            this._listeners[event].push(callback);
        }
    }

    // Método para desuscribir un callback de un evento específico
    removeEventListener(event, callback) {
        // Verifica si el tipo de evento está registrado
        if (this._listeners[event]) {
            // Filtra el array removiendo la referencia de la función que coincide
            this._listeners[event] = this._listeners[event].filter(fn => fn !== callback);
        }
    }

    // Método interno privado para descomponer y actualizar las partes de la URL en el objeto location
    _actualizarLocation(urlStr) {
        // Asigna el href completo con la cadena de URL recibida
        this.location.href = urlStr;
        try {
            // Parsea la cadena con el constructor URL nativo de JavaScript
            const parsed = new URL(urlStr);
            // Actualiza la ruta (pathname)
            this.location.pathname = parsed.pathname;
            // Actualiza los parámetros de búsqueda (search)
            this.location.search = parsed.search;
            // Actualiza el ancla o hash
            this.location.hash = parsed.hash;
        } catch (e) {
            // Ignora silenciosamente errores de parseo en formatos no canónicos
        }
    }
}

// Creamos una instancia del simulador de historial con el dominio de prueba de la clase
const simHistory = new SimuladorHistory("https://ejemplo.curso.dev");

// Comprobamos si el objeto window no existe en el entorno global actual (caso de Node.js)
if (typeof globalThis.window === "undefined") {
    // Si no existe, apuntamos window al propio objeto globalThis
    globalThis.window = globalThis;
}
// Comprobamos si window.history no está definido
if (typeof globalThis.window.history === "undefined") {
    // Si no está definido, inyectamos nuestra instancia de simulador de alta fidelidad
    globalThis.window.history = simHistory;
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN AL OBJETO HISTORY Y LA PILA DE NAVEGACIÓN
// ==============================================================================
// Imprime el encabezado y divisor del Bloque 1
imprimirSeparador(1, "INTRODUCCIÓN AL OBJETO HISTORY Y LA PILA DE NAVEGACIÓN");

// Explica el rol de window.history dentro del navegador
console.log("El objeto 'window.history' representa el historial de sesión de la pestaña actual.");
// Detalla el principio de funcionamiento como estructura de datos tipo Pila
console.log("Funciona como una estructura de datos tipo PILA (LIFO: Last In, First Out).");
// Aclara cuándo se añaden entradas a dicha pila
console.log("Cada vez que el usuario visita una página o una URL cambia, se añade una entrada.");
// Muestra el encabezado de inspección de propiedades en consola
console.log("\nInspección del objeto history en este entorno:");
// Imprime el tipo de dato devuelto por el operador typeof al consultar window.history
console.log("- Tipo de objeto:", typeof window.history);
// Imprime la longitud inicial de la pila de historial
console.log("- Propiedad length inicial:", window.history.length);
// Imprime el estado asociado a la primera entrada
console.log("- Estado inicial (history.state):", window.history.state);

// ==============================================================================
// BLOQUE 2: NAVEGACIÓN BÁSICA: history.back() Y history.forward()
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 2
imprimirSeparador(2, "NAVEGACIÓN BÁSICA: history.back() Y history.forward()");

// Explica el método de retroceso de página
console.log("1. history.back():");
// Aclara la equivalencia con el botón físico o visual de retroceso del navegador
console.log("   Equivale exactamente a que el usuario haga clic en la flecha 'Atrás' del navegador.");
// Muestra un ejemplo de sintaxis directa
console.log("   Sintaxis: window.history.back(); // Retrocede 1 página");

// Explica el método de avance de página
console.log("\n2. history.forward():");
// Aclara la equivalencia con el botón físico o visual de avance del navegador
console.log("   Equivale a que el usuario haga clic en la flecha 'Adelante' del navegador.");
// Muestra la sintaxis estándar de invocación
console.log("   Sintaxis: window.history.forward(); // Avanza 1 página");

// Explica el manejo de bordes o límites en la navegación
console.log("\n3. Comportamiento en límites:");
// Detalla qué ocurre si no hay páginas previas
console.log("   Si el usuario no tiene historial previo (es la primera página abierta),");
// Confirma que el método es seguro y no arroja excepciones
console.log("   llamar a history.back() NO lanza ningún error: simplemente no hace nada.");

// ==============================================================================
// BLOQUE 3: TAMAÑO Y LÍMITES DE SESIÓN: history.length
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 3
imprimirSeparador(3, "TAMAÑO DEL HISTORIAL DE SESIÓN (history.length)");

// Aclara que la propiedad length es de solo lectura y no modificable
console.log("La propiedad 'history.length' es de SOLO LECTURA (read-only).");
// Explica qué valor numérico representa exactamente
console.log("Indica cuántas entradas existen en la sesión de navegación actual.");
// Muestra en la consola el valor actual de dicha propiedad
console.log(`Valor actual de history.length: ${window.history.length}`);

// Alerta pedagógica sobre restricciones de privacidad del usuario
console.log("\n⚠️ NOTA DE PRIVACIDAD CRÍTICA:");
// Detalla la prohibición de acceso a URLs ajenas visitadas por el usuario
console.log("Por razones de seguridad y privacidad, JavaScript NO PUEDE leer qué URLs");
// Explica que el contenido real de la pila es completamente opaco para el desarrollador
console.log("visitó el usuario (no puedes ver historial[0].url). Solo puedes saber cuántas hay.");

// ==============================================================================
// BLOQUE 4: NAVEGACIÓN CON SALTOS RELATIVOS: history.go(delta)
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 4
imprimirSeparador(4, "NAVEGACIÓN CON SALTOS RELATIVOS: history.go(delta)");

// Presenta el método genérico go() y su parámetro delta
console.log("El método 'go(delta)' permite desplazarse un número relativo de pasos en la pila:");
// Explica el efecto de pasar números negativos
console.log("- delta negativo (ej. -1, -2): Retrocede tantas páginas como se indique.");
// Explica el efecto de pasar números positivos
console.log("- delta positivo (ej. 1, 2):   Avanza tantas páginas como se indique.");
// Explica el efecto especial de delta = 0
console.log("- delta = 0 o sin argumentos:  Recarga la página actual (equivale a location.reload()).");

// Tabla pedagógica de equivalencias entre métodos de navegación
console.log("\nEjemplos de equivalencias universales:");
// Muestra equivalencia de retroceder un paso
console.log("history.go(-1)  <===>  history.back()");
// Muestra equivalencia de avanzar un paso
console.log("history.go(1)   <===>  history.forward()");
// Muestra equivalencia de recargar la página
console.log("history.go(0)   <===>  location.reload()");

// Ejecución controlada de prueba con delta 0
console.log("\nEjecutando demostración con go(0):");
// Invocación del método go con argumento 0 sobre la instancia simulada
simHistory.go(0);

// ==============================================================================
// BLOQUE 5: HTML5 HISTORY API: history.pushState(state, unused, url)
// ==============================================================================
// Imprime el encabezado del Bloque 5
imprimirSeparador(5, "HTML5 HISTORY API: history.pushState(state, unused, url)");

// Resalta la importancia histórica de pushState en la web moderna
console.log("Introducido en HTML5, 'pushState()' revolucionó el desarrollo web moderno:");
// Explica el beneficio de alterar la URL en la barra de direcciones
console.log("Permite agregar una nueva entrada al historial y cambiar la URL visible");
// Enfatiza la ausencia total de recarga o solicitudes al servidor
console.log("¡SIN RECARGAR LA PÁGINA NI PEDIR NADA AL SERVIDOR!");

// Desglose de cada uno de los 3 parámetros de pushState
console.log("\nParámetros que recibe pushState(state, unused, url):");
// Explicación del primer argumento: estado clonado
console.log("1. state (Objeto JS): Datos asociados a esta entrada (serializados vía Structured Clone).");
// Explicación del segundo argumento: título no utilizado
console.log("2. unused (String): Parámetro heredado del estándar (históricamente título). Hoy se pasa '' o null.");
// Explicación del tercer argumento: URL relativa o absoluta del mismo origen
console.log("3. url (String): La nueva URL que mostrará el navegador (debe ser del MISMO ORIGEN).");

// Mensaje previo a la invocación práctica
console.log("\n-> Realizando pushState a '/catalogo' con datos asociados...");
// Definimos un objeto literal de estado con información contextual de la vista
const estadoCatalogo = { seccion: "catalogo", categoria: "monitores", pagina: 1 };
// Llamamos a pushState pasando el estado, cadena vacía y la ruta relativa '/catalogo'
simHistory.pushState(estadoCatalogo, "", "/catalogo");

// Confirmación de ejecución exitosa
console.log("✅ pushState ejecutado.");
// Muestra la nueva URL activa tras el pushState
console.log("Nueva URL activa:", simHistory.location.href);
// Muestra la nueva longitud incrementada de la pila de historial
console.log("Tamaño de historial (length):", simHistory.length);
// Muestra el objeto de estado recuperado directamente de history.state
console.log("Datos en history.state:", simHistory.state);

// ==============================================================================
// BLOQUE 6: MODIFICACIÓN IN SITU: history.replaceState(state, unused, url)
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 6
imprimirSeparador(6, "MODIFICACIÓN IN SITU: history.replaceState(state, unused, url)");

// Diferenciación clave entre pushState y replaceState
console.log("A diferencia de pushState, 'replaceState()' NO crea una nueva entrada en la pila.");
// Enfatiza que se sobreescribe el registro existente
console.log("En su lugar, SOBREESCRIBE la entrada actual del historial.");

// Casos de uso prácticos recomendados en producción
console.log("\n¿Cuándo es imprescindible usar replaceState()?");
// Caso 1: Búsquedas dinámicas letra a letra
console.log("1. Filtros de búsqueda en tiempo real: Si el usuario escribe letra por letra,");
// Consecuencia de usar erróneamente pushState
console.log("   usar pushState crearía 20 entradas en el botón 'Atrás'. Con replaceState se actualiza en el mismo sitio.");
// Caso 2: Pestañas y acordeones
console.log("2. Pestañas activas o acordeones abiertos.");
// Caso 3: Guardar el scroll
console.log("3. Guardar la posición de scroll antes de abandonar la vista.");

// Guardamos la longitud del historial antes de ejecutar replaceState para contrastar
const longitudAntes = simHistory.length;
// Creamos un nuevo objeto de estado con parámetros de filtro actualizados
const estadoActualizado = { seccion: "catalogo", categoria: "monitores-4k", orden: "precio-asc" };

// Mensaje de ejecución
console.log("\n-> Ejecutando replaceState con filtros actualizados...");
// Invocamos replaceState pasando el nuevo estado y una URL enriquecida con query params
simHistory.replaceState(estadoActualizado, "", "/catalogo?filtro=4k&orden=precio");

// Mostramos la longitud antes de la operación
console.log("Longitud de historial antes:", longitudAntes);
// Mostramos la longitud después confirmando que no se incrementó
console.log("Longitud de historial ahora:", simHistory.length, "(¡Permanece idéntica!)");
// Mostramos la nueva URL en la misma entrada
console.log("URL actualizada:", simHistory.location.href);
// Mostramos el nuevo contenido de history.state
console.log("Nuevo estado:", simHistory.state);

// ==============================================================================
// BLOQUE 7: ALMACENAMIENTO DE DATOS: history.state Y CLONACIÓN ESTRUCTURADA
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 7
imprimirSeparador(7, "ALMACENAMIENTO DE DATOS: history.state Y CLONACIÓN ESTRUCTURADA");

// Explica el mecanismo de lectura de datos mediante history.state
console.log("La propiedad 'history.state' retorna los datos asociados a la entrada activa.");
// Explica el algoritmo de clonación estructurada que asegura la inmutabilidad de los datos
console.log("El navegador utiliza el 'Algoritmo de Clonación Estructurada' (Structured Clone):");
// Tipos de datos primitivos y complejos soportados por la clonación
console.log("- Soporta: Objetos, Arrays, Strings, Numbers, Booleans, Date, RegExp, Map, Set, Blobs.");
// Tipos de datos prohibidos que provocan error
console.log("- NO soporta: Funciones, Nodos del DOM (Element), Symbols ni referencias circulares no clonables.");

// Explicación del límite de tamaño en bytes
console.log("\nLímite de tamaño:");
// Rango típico de cuota permitida en el navegador
console.log("Cada navegador impone un límite (generalmente entre 2 MB y 64 MB de datos serializados).");
// Consecuencia al exceder la cuota de memoria asignada
console.log("Superar este límite lanzará una excepción DOMException.");
// Impresión del estado actual registrado
console.log("Estado actual verificado:", simHistory.state);

// ==============================================================================
// BLOQUE 8: EL EVENTO popstate: ESCUCHA Y RECUPERACIÓN DE ESTADO
// ==============================================================================
// Imprime el encabezado del Bloque 8
imprimirSeparador(8, "EL EVENTO popstate: ESCUCHA Y RECUPERACIÓN DE ESTADO");

// Indica sobre qué objeto se dispara el evento popstate
console.log("El evento 'popstate' se despacha sobre el objeto 'window'.");
// Explica las condiciones exactas en las que el navegador dispara el evento
console.log("Ocurre cuando la entrada activa del historial cambia debido a la navegación del usuario:");
// Detalle de navegación con botones del navegador
console.log("- Al hacer clic en el botón 'Atrás' o 'Adelante' del navegador.");
// Detalle de navegación programática
console.log("- Al ejecutar 'history.back()', 'history.forward()' o 'history.go(delta)'.");

// Muestra el código canónico para escuchar el evento
console.log("\nEstructura del manejador popstate:");
// Impresión del fragmento de ejemplo en bloque
console.log(`window.addEventListener('popstate', (event) => {
    console.log("Estado restaurado:", event.state);
    console.log("URL activa restaurada:", window.location.href);
});`);

// Registramos un listener activo para observar el comportamiento en directo
simHistory.addEventListener('popstate', (event) => {
    // Imprime la notificación de recepción del evento popstate
    console.log("\n🔔 [EVENTO POPSTATE DETECTADO EN TIEMPO REAL]");
    // Imprime el estado asociado al registro restaurado
    console.log("   event.state:", event.state);
    // Imprime la URL a la que se regresó o avanzó
    console.log("   window.location.href:", simHistory.location.href);
});

// ==============================================================================
// BLOQUE 9: LA REGLA DE ORO: pushState Y replaceState NUNCA DISPARAN popstate
// ==============================================================================
// Imprime el encabezado del Bloque 9
imprimirSeparador(9, "LA REGLA DE ORO: pushState / replaceState NUNCA DISPARAN popstate");

// Introduce la pregunta clásica de arquitectura web
console.log("Esta es una de las preguntas de entrevista técnica más comunes de JavaScript:");
// La pregunta fundamental de evaluación
console.log("¿Llamar a history.pushState() dispara el evento 'popstate'?");
// Respuesta definitiva e indiscutible
console.log("👉 RESPUESTA ROTUNDA: NO. NUNCA.");

// Inicio de la demostración experimental
console.log("\nDemostración práctica:");
// Variable bandera para rastrear si el evento popstate se disparó
let disparado = false;
// Función flecha que marcaría la bandera como true en caso de ejecutarse
const testFn = () => { disparado = true; };
// Añadimos el listener temporal de prueba
simHistory.addEventListener('popstate', testFn);

// Mensaje de llamada a pushState
console.log("1. Llamamos a pushState('/nueva-ruta')...");
// Invocamos pushState creando una nueva ruta con datos
simHistory.pushState({ test: 123 }, "", "/nueva-ruta");

// Comprobamos el valor de la variable bandera
console.log("2. ¿Se ejecutó el listener de popstate?:", disparado);
// Aclaramos por qué siempre permanece en false
console.log("   (Como ves, 'disparado' es FALSE. Solo el usuario o history.go() lo activan).");

// Removemos el listener de prueba para no interferir con pasos posteriores
simHistory.removeEventListener('popstate', testFn);

// Demostramos la activación legítima retrocediendo en el historial
console.log("\n3. Ahora provocamos un popstate legítimo llamando a history.back():");
// Retrocedemos una entrada, lo cual dispara inmediatamente el manejador de popstate registrado en el Bloque 8
simHistory.back(); // Volvemos a /catalogo

// ==============================================================================
// BLOQUE 10: ANALOGÍA 1 DEL MUNDO REAL: LA PILA DE PLATOS 🍽️
// ==============================================================================
// Imprime el encabezado del Bloque 10
imprimirSeparador(10, "ANALOGÍA 1: LA PILA DE PLATOS 🍽️ (pushState vs. replaceState)");

// Presenta la metáfora didáctica de la pila de platos de restaurante
console.log("Imagina que cada página del historial es un plato en una torre de platos:\n");
// Explica el caso de navegación normal o pushState
console.log("1. Navegar normalmente o hacer 'pushState':");
// Acción física: colocar un plato encima
console.log("   Tomas un PLATO NUEVO y lo colocas encima de la torre.");
// Consecuencia: mayor altura (length)
console.log("   La torre ahora es más alta (history.length aumenta en +1).");

// Explica el caso de replaceState
console.log("\n2. Hacer 'replaceState':");
// Acción física: pintar el plato superior existente
console.log("   Tomas un rotulador y PINTAS sobre el plato que ya está en la cima.");
// Consecuencia: misma altura
console.log("   No agregas ningún plato nuevo. La altura de la torre sigue siendo la misma.");

// Explica qué pasa al estar en medio de la pila y agregar algo nuevo
console.log("\n3. Si estás en medio de la torre y colocas un nuevo plato (pushState):");
// Efecto de descarte de entradas futuras (truncamiento)
console.log("   ¡Todos los platos que estaban por encima se descartan inmediatamente!");
// Estado del botón Adelante tras truncar la pila
console.log("   (El botón 'Adelante' se deshabilita y se vacía).");

// ==============================================================================
// BLOQUE 11: ANALOGÍA 2 DEL MUNDO REAL: EL ÁLBUM DE FOTOS CON NOTAS 📖
// ==============================================================================
// Imprime el encabezado del Bloque 11
imprimirSeparador(11, "ANALOGÍA 2: EL ÁLBUM DE FOTOS CON NOTAS 📖 (state y popstate)");

// Presenta la metáfora del álbum familiar
console.log("Imagina un álbum fotográfico familiar encuadernado:\n");
// Correspondencia entre la foto y la URL
console.log("- Cada fotografía es una página con su URL.");
// Correspondencia entre la nota adhesiva (Post-It) y el objeto state
console.log("- 'state' es una NOTA ADHESIVA (Post-It) que pegas detrás de la foto con apuntes:");
// Ejemplo de datos que se anotarían en el Post-It
console.log("  '{ fecha: 2026, filtro: \"playa\", scroll: 300 }'.");
// Correspondencia del acto de hojear hacia atrás con el evento popstate
console.log("- 'popstate' es cuando tú ojeas el álbum hacia atrás: al llegar a esa página,");
// Consecuencia: leer la nota y restaurar la experiencia
console.log("  despegas el Post-It ('event.state') y lees exactamente en qué estado la dejaste.");

// ==============================================================================
// BLOQUE 12: DIAGRAMA DE FLUJO CONCEPTUAL: PILA LIFO Y TRUNCAMIENTO
// ==============================================================================
// Imprime el encabezado del Bloque 12
imprimirSeparador(12, "DIAGRAMA DE FLUJO: PILA LIFO, PUNTERO Y TRUNCAMIENTO");

// Imprime el diagrama esquemático con estados de la pila y puntero
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
// Imprime el divisor y encabezado del Bloque 13
imprimirSeparador(13, "BUENAS PRÁCTICAS EN APLICACIONES REALES (SPA)");

// Regla 1: Manejar el estado null
console.log("1. Controlar siempre 'event.state === null':");
// Detalla el motivo: la primera entrada nunca tiene un estado asociado previo
console.log("   Al retroceder hasta la primera entrada de la sesión, 'event.state' será null.");
// Recomienda proveer siempre un objeto de fallback
console.log("   Tu código debe tener un valor por defecto seguro (fallback):");
// Ejemplo de operador OR para fallback
console.log("   const estado = event.state || { vista: 'inicio' };");

// Regla 2: Configuración del servidor para SPA
console.log("\n2. Configuración obligatoria del Servidor Web (Server Fallback):");
// Describe el escenario típico de recarga directa con F5
console.log("   En un SPA (React, Vue, Angular o JS Vanilla), cuando pushState genera '/usuarios/editar',");
// Consecuencia en un servidor sin soporte SPA
console.log("   si el usuario presiona F5 (recarga), el navegador solicitará ese archivo al servidor.");
// Error generado
console.log("   Si el servidor no está configurado, devolverá un error '404 Not Found'.");
// Solución recomendada
console.log("   -> SOLUCIÓN: Redirigir todas las peticiones desconocidas a 'index.html' (rewrite rule).");

// Regla 3: Moderar el peso de los datos en state
console.log("\n3. No abusar del tamaño de 'state':");
// Mala práctica: almacenar grandes volúmenes de datos
console.log("   No guardes datos gigantescos (ej. listas de 10.000 objetos) en el state.");
// Buena práctica: almacenar identificadores y filtros ligeros
console.log("   Guarda solo identificadores, parámetros de búsqueda y filtros ('{ id: 45, page: 2 }').");

// ==============================================================================
// BLOQUE 14: ERRORES COMUNES Y CÓMO EVITARLOS
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 14
imprimirSeparador(14, "ERRORES COMUNES Y CÓMO EVITARLOS");

// Error 1: Violación de origen
console.log("1. DOMException: SecurityError (Same-Origin Violation):");
// Ejemplo de llamada incorrecta
console.log("   Intentar cambiar el origen mediante pushState o replaceState:");
// Demostración en código de lo que jamás se debe hacer
console.log("   history.pushState({}, '', 'https://google.com/search'); // 🛑 ERROR DE SEGURIDAD");
// Requisito técnico obligatorio
console.log("   El protocolo, dominio y puerto DEBEN ser idénticos.");

// Bloque de prueba try/catch para capturar el error de seguridad
try {
    // Imprime la intención de probar una URL de origen diferente
    console.log("\nProbando intento de cross-origin pushState...");
    // Ejecuta pushState apuntando a un dominio externo no permitido
    simHistory.pushState({}, "", "https://banco-malicioso.com/phishing");
} catch (e) {
    // Captura y muestra el mensaje de error de seguridad arrojado
    console.log("🛑 Capturado con éxito:", e.message);
}

// Error 2: Comportamiento por defecto de enlaces HTML
console.log("\n2. Olvidar prevenir el comportamiento por defecto de enlaces <a>:");
// Describe la necesidad de preventDefault
console.log("   Si tienes un enlace <a href='/perfil'>, debes llamar a 'e.preventDefault()'");
// Consecuencia de no llamarlo
console.log("   antes de ejecutar 'history.pushState()', o el navegador recargará la página por completo.");

// ==============================================================================
// BLOQUE 15: PROYECTO INTEGRADOR: MINI ROUTER SPA MODULAR
// ==============================================================================
// Imprime el encabezado del Bloque 15
imprimirSeparador(15, "PROYECTO INTEGRADOR: MINI ROUTER SPA MODULAR");

// Declaración de la clase SimpleSPARouter para gestionar rutas en aplicaciones de una sola página
class SimpleSPARouter {
    // Constructor que recibe la instancia de history a gestionar
    constructor(historyInstance = simHistory) {
        // Almacena la referencia de la API de historial
        this.hist = historyInstance;
        // Crea una estructura de datos Map para almacenar los pares ruta -> función de renderizado
        this.rutas = new Map();
        
        // Registra un oyente para reaccionar inmediatamente a los eventos popstate del usuario
        this.hist.addEventListener('popstate', (e) => {
            // Invoca el manejador interno pasando el estado recuperado
            this._manejarPopstate(e.state);
        });
    }

    // Método para registrar una nueva ruta y su callback asociado (soporta encadenamiento)
    on(path, renderCallback) {
        // Asocia la cadena de ruta con su respectiva función de renderizado en el mapa
        this.rutas.set(path, renderCallback);
        // Retorna this para permitir fluidez y llamadas encadenadas (fluent interface)
        return this;
    }

    // Método para navegar programáticamente hacia una ruta sin recargar la página
    navegar(path, state = {}) {
        // Construye un nuevo objeto de estado inyectando metadatos como la ruta y la marca de tiempo
        const estadoConMeta = {
            // Propaga las propiedades provistas por el usuario
            ...state,
            // Agrega la ruta actual
            path: path,
            // Agrega la marca de tiempo en milisegundos
            timestamp: Date.now()
        };
        
        // 1. Modifica la URL visible y almacena el estado en la pila del historial sin recargar
        this.hist.pushState(estadoConMeta, "", path);
        
        // 2. Renderiza la vista asociada a la ruta de inmediato
        this._render(path, estadoConMeta);
    }

    // Manejador invocado automáticamente cuando el usuario navega con botones Atrás/Adelante
    _manejarPopstate(state) {
        // Obtiene la ruta actual desde el objeto location
        const pathActual = this.hist.location.pathname;
        // Imprime en consola la acción de restauración
        console.log(`[SPA Router] Restaurando ruta por navegación: ${pathActual}`);
        // Ejecuta el renderizado de la vista restaurada pasando el estado recuperado
        this._render(pathActual, state || { path: pathActual });
    }

    // Método privado que busca el handler en el mapa de rutas o recurre a la vista 404
    _render(path, state) {
        // Obtiene el callback registrado para la ruta o asigna el método fallback _ruta404
        const handler = this.rutas.get(path) || this._ruta404;
        // Invoca la función pasando los datos de estado de la vista
        handler(state);
    }

    // Función fallback para rutas no registradas
    _ruta404(state) {
        // Informa en la consola que la ruta solicitada no se encontró
        console.log(`[SPA Router] Error 404: La ruta '${simHistory.location.pathname}' no está registrada.`);
    }
}

// Instanciamos el router SPA pasando nuestra instancia de simHistory
const router = new SimpleSPARouter(simHistory);

// Registramos la ruta '/inicio' y su lógica de visualización
router.on('/inicio', (state) => {
    // Imprime la representación de la vista de inicio renderizada
    console.log("🏠 [VISTA RENDERIZADA] Bienvenido al Inicio");
});

// Registramos la ruta '/productos' y su lógica de visualización
router.on('/productos', (state) => {
    // Imprime la vista de productos mostrando los filtros activos si los hay
    console.log("📦 [VISTA RENDERIZADA] Listado de productos. Filtro:", state.filtro || "ninguno");
});

// Registramos la ruta '/checkout' y su lógica de visualización
router.on('/checkout', (state) => {
    // Imprime la vista de checkout mostrando el monto total a pagar
    console.log("💳 [VISTA RENDERIZADA] Pasarela de pago seguro. Total a pagar:", state.total || 0);
});

// Mensaje de la primera navegación
console.log("1. Navegando al inicio:");
// Navega programáticamente a /inicio pasando un estado inicial
router.navegar('/inicio', { bienvenida: true });

// Mensaje de la segunda navegación
console.log("\n2. Navegando a productos con filtros:");
// Navega programáticamente a /productos con el filtro 'laptops'
router.navegar('/productos', { filtro: 'laptops' });

// Mensaje de la tercera navegación
console.log("\n3. Navegando al checkout:");
// Navega programáticamente a /checkout con el total a cobrar
router.navegar('/checkout', { total: 1250 });

// Mensaje simulando la interacción física del usuario
console.log("\n4. Simulando que el usuario pulsa 'Atrás' en el navegador:");
// Ejecuta un retroceso de página, lo que activa popstate y re-renderiza /productos automáticamente
simHistory.back(); // Vuelve a /productos y dispara popstate

// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS
// ==============================================================================
// Imprime el divisor y encabezado del Bloque 16
imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO");

// Presenta el Reto 1
console.log("--- RETO NIVEL 1: Paginador con pushState ---");
// Función paginadora que actualiza la URL y el historial en cada cambio de página
function paginar(numPagina) {
    // Validación: si el número de página es menor a 1, no hace nada
    if (numPagina < 1) return;
    // Construye el nuevo estado que almacena el número de página y timestamp
    const nuevoEstado = { pagina: numPagina, timestamp: Date.now() };
    // Define la cadena de consulta con el parámetro page
    const queryUrl = `?page=${numPagina}`;
    
    // Registra la nueva página en la pila del historial cambiando los query params
    simHistory.pushState(nuevoEstado, "", queryUrl);
    // Imprime la confirmación con la página actual y la query string
    console.log(`[Reto 1] Navegando a página: ${numPagina} | URL: ${simHistory.location.search}`);
}
// Navega a la página 1
paginar(1);
// Navega a la página 2
paginar(2);
// Navega a la página 3
paginar(3);

// Presenta el Reto 2
console.log("\n--- RETO NIVEL 2: Filtro con Debounce y replaceState ---");
// Variable en closure para almacenar la referencia del identificador del temporizador
let timerDebounce = null;
// Función que simula un input de búsqueda con técnica de debounce para optimizar el historial
function filtrarEnTiempoReal(termino) {
    // Cancela cualquier temporizador pendiente programado anteriormente
    clearTimeout(timerDebounce);
    // Programa una nueva ejecución tras 50 milisegundos de inactividad
    timerDebounce = setTimeout(() => {
        // Construye el objeto de estado con el término y la marca de tiempo
        const stateFiltro = { q: termino, actualizacion: Date.now() };
        // Construye la query string codificando caracteres especiales con encodeURIComponent
        const queryUrl = termino ? `?buscar=${encodeURIComponent(termino)}` : "?";
        
        // Emplea replaceState para modificar la URL actual sin ensuciar la pila del botón Atrás
        simHistory.replaceState(stateFiltro, "", queryUrl);
        // Imprime en consola la confirmación del filtro aplicado
        console.log(`[Reto 2] Filtro aplicado sin agregar entrada al historial: '${termino}'`);
        // Muestra que el tamaño del historial se mantiene inalterado
        console.log(`         Tamaño del historial se mantiene en: ${simHistory.length}`);
    }, 50); // 50 milisegundos para demostración pedagógica
}
// Simula la primera pulsación de tecla ('j')
filtrarEnTiempoReal("j");
// Simula la segunda pulsación de tecla ('jav')
filtrarEnTiempoReal("jav");
// Simula la tercera pulsación de tecla completa ('javascript')
filtrarEnTiempoReal("javascript");

// Programamos la ejecución del Reto 3 con un retraso suficiente para que el debounce del Reto 2 haya terminado
setTimeout(() => {
    // Presenta el Reto 3
    console.log("\n--- RETO NIVEL 3: Flujo de Pasos y Modal de Confirmación ---");
    // Clase que emula un asistente paso a paso (Wizard) sincronizado con el historial
    class WizardCheckout {
        // Constructor que inicializa el asistente en el paso 1
        constructor() {
            // Asigna el número de paso inicial
            this.paso = 1;
        }

        // Método para avanzar al siguiente paso del asistente
        siguientePaso(numPaso) {
            // Actualiza la propiedad interna del paso activo
            this.paso = numPaso;
            // Define el estado del paso con bandera de modal activo
            const pasoState = { paso: numPaso, modalActivo: true };
            // Agrega una entrada en el historial para permitir que el botón Atrás regrese de paso
            simHistory.pushState(pasoState, "", `?paso=${numPaso}`);
            // Imprime la confirmación del paso alcanzado
            console.log(`[Reto 3] Avanzado al paso ${numPaso} del Checkout.`);
        }

        // Método que simula cuando el usuario presiona el botón Atrás para deshacer o cancelar
        retroceder() {
            // Imprime el aviso de retroceso
            console.log("[Reto 3] Usuario pulsa Atrás para cancelar o volver al paso anterior:");
            // Ejecuta el método nativo back() para restaurar el paso previo
            simHistory.back();
        }
    }

    // Instancia el asistente de checkout
    const wizard = new WizardCheckout();
    // Avanza al paso 2 (datos de entrega)
    wizard.siguientePaso(2); // Datos de entrega
    // Avanza al paso 3 (revisión y pago)
    wizard.siguientePaso(3); // Revisión y pago
    // Retrocede al paso 2 simulando pulsación del botón Atrás
    wizard.retroceder();

    // Imprime la línea divisoria de finalización
    console.log("\n" + "=".repeat(78));
    // Imprime el mensaje triunfal de cierre del módulo
    console.log("🎉 ¡MÓDULO DEL OBJETO HISTORY COMPLETADO CON ÉXITO!");
    // Imprime la línea divisoria final
    console.log("=".repeat(78) + "\n");
}, 80);
