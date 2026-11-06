/**
 * ==============================================================================
 * 📍 JAVASCRIPT MASTER LEVEL: MÓDULO COMPLETO DE GEOLOCALIZACIÓN (GEOLOCATION API)
 * ==============================================================================
 * Archivo: main.js
 * Propósito: Guía práctica ejecutable, comentada y explicada línea por línea al 100%
 * Ejecución: Directamente en la consola del navegador o en terminal con 'node main.js'
 * 
 * TEMARIO DEL MÓDULO (DOCUMENTACION/GEOLOCALIZACIÓN.md):
 * 1. Introducción a la API de Geolocalización y verificación de soporte
 * 2. Contexto seguro obligatorio (HTTPS o localhost) y privacidad del usuario
 * 3. El método asíncrono 'getCurrentPosition(success, error, options)'
 * 4. El método de rastreo continuo en tiempo real 'watchPosition()' y 'clearWatch()'
 * 5. Comparativa arquitectónica: getCurrentPosition() vs. watchPosition()
 * 6. Callback de Éxito: Objeto 'GeolocationPosition' y métricas en 'coords'
 * 7. Extracción de coordenadas: latitude, longitude, accuracy, speed y timestamp
 * 8. Callback de Error: Objeto 'GeolocationPositionError' y sus 3 códigos nativos
 * 9. Gestión de fallos: PERMISSION_DENIED (1), POSITION_UNAVAILABLE (2) y TIMEOUT (3)
 * 10. Objeto de Configuración 'options': enableHighAccuracy, timeout y maximumAge
 * 11. Analogías del mundo real: La Fotografía (getCurrentPosition) vs. El Video en Vivo (watchPosition)
 * 12. Analogía de Precisión: El Mensajero con Láser 🛰️ y la Foto con Vencimiento ⏱️
 * 13. Diagrama de flujo completo de solicitud y seguimiento de ubicación
 * 14. Buena práctica 1: Detener siempre el rastreo con clearWatch(id) para no drenar la batería
 * 15. Buena práctica 2: Implementar siempre el callback de error con feedback al usuario
 * 16. Error común 1: El clásico typo 'enableHightAccuracy' con 't' intermedia
 * 17. Error común 2: Ejecución en conexiones HTTP estándar sin certificado SSL
 * 18. Proyecto Integrador: Rastreador Continuo con enlace dinámico a OpenStreetMap
 * 19. Resolución completa de los 3 Retos Prácticos del Módulo (Niveles 1, 2 y 3)
 * ==============================================================================
 */

// Activamos el modo estricto para garantizar código limpio y prevenir fallos silenciosos
"use strict";

// Función auxiliar para imprimir divisores pedagógicos en la consola
function imprimirSeparador(numeroBloque, titulo) {
    // Imprime un salto de línea inicial y una línea horizontal divisoria de 78 caracteres de longitud
    console.log("\n" + "=".repeat(78));
    // Imprime el número del bloque formateado junto a su título descriptivo en mayúsculas
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    // Imprime una línea horizontal de cierre idéntica a la superior
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL: SIMULADOR DE GEOLOCATION API PARA NODE.JS
// ==============================================================================
// En el navegador existe 'navigator.geolocation' de forma nativa.
// Para que este archivo también pueda ejecutarse con 'node main.js' en la terminal
// sin lanzar errores de 'navigator is not defined', creamos un simulador fiel
// que emula tanto 'getCurrentPosition' como 'watchPosition' y 'clearWatch':

// Comprobamos si el objeto global navigator no existe en el entorno actual (ej. Node.js)
if (typeof globalThis.navigator === "undefined") {
    // Si no existe, inicializamos navigator como un objeto vacío en globalThis
    globalThis.navigator = {};
}

// Comprobamos si la propiedad geolocation no está definida en navigator
if (typeof globalThis.navigator.geolocation === "undefined") {
    // Variable contadora para generar identificadores numéricos únicos crecientes para watchPosition
    let watchIdCounter = 0;
    // Mapa en memoria para asociar cada watchId con su respectivo timer intervalId interno
    const activeWatchers = new Map();

    // Declaración del objeto simulador de la API de Geolocalización
    globalThis.navigator.geolocation = {
        // 1. getCurrentPosition: Lectura única de ubicación
        getCurrentPosition(successCallback, errorCallback, options = {}) {
            // Simulamos la latencia asíncrona de consulta a satélites/red con un temporizador de 100 ms
            setTimeout(() => {
                // Si se configuró un timeout extremadamente bajo (< 100ms), simulamos un fallo por tiempo agotado
                if (options.timeout && options.timeout < 100) {
                    // Si el usuario proporcionó un callback de error válido
                    if (typeof errorCallback === "function") {
                        // Invocamos el callback de error con código 3 (TIMEOUT)
                        errorCallback({
                            // Código numérico 3 correspondiente a TIMEOUT
                            code: 3,
                            // Constante numérica 1 de la especificación
                            PERMISSION_DENIED: 1,
                            // Constante numérica 2 de la especificación
                            POSITION_UNAVAILABLE: 2,
                            // Constante numérica 3 de la especificación
                            TIMEOUT: 3,
                            // Mensaje descriptivo del error producido
                            message: "Se agotó el tiempo de espera configurado (TIMEOUT)."
                        });
                    }
                    // Finalizamos la ejecución del callback
                    return;
                }

                // Si se proporcionó un callback de éxito válido
                if (typeof successCallback === "function") {
                    // Invocamos el callback de éxito entregándole el objeto de posición estructurado
                    successCallback({
                        // Objeto coords con todas las métricas geográficas
                        coords: {
                            // Latitud geográfica en grados decimales (Madrid, España)
                            latitude: 40.416775,
                            // Longitud geográfica en grados decimales
                            longitude: -3.703790,
                            // Precisión en metros: 8.5 m si se pide alta precisión, o 250 m si es estándar
                            accuracy: options.enableHighAccuracy ? 8.5 : 250.0,
                            // Altitud en metros sobre el nivel del mar
                            altitude: 667.0,
                            // Precisión de la altitud estimada
                            altitudeAccuracy: 10.0,
                            // Rumbo de desplazamiento (null si el dispositivo está estático)
                            heading: null,
                            // Velocidad en metros por segundo (null si no hay movimiento)
                            speed: null
                        },
                        // Marca de tiempo Unix del momento de la captura satelital
                        timestamp: Date.now()
                    });
                }
            }, 100);
        },

        // 2. watchPosition: Seguimiento continuo en tiempo real (devuelve un ID numérico)
        watchPosition(successCallback, errorCallback, options = {}) {
            // Incrementamos el contador para generar un nuevo identificador único
            watchIdCounter++;
            // Guardamos el ID actual asignado para este rastreador
            const currentId = watchIdCounter;
            // Contador interno de pasos para simular una trayectoria de desplazamiento
            let paso = 0;

            // Configuramos un intervalo que emitirá actualizaciones periódicas cada 120 ms
            const intervalId = setInterval(() => {
                // Incrementamos el paso del desplazamiento simulado
                paso++;
                // Si el callback de éxito existe
                if (typeof successCallback === "function") {
                    // Despachamos las coordenadas actualizadas simulando avance del usuario
                    successCallback({
                        // Coordenadas con leve variación en cada tick
                        coords: {
                            // Simulamos avance en latitud con cada paso
                            latitude: 40.416775 + paso * 0.00012,
                            // Simulamos avance en longitud con cada paso
                            longitude: -3.703790 + paso * 0.00008,
                            // Precisión estimada
                            accuracy: options.enableHighAccuracy ? 6.2 : 120.0,
                            // Altitud simulada
                            altitude: 667.0 + paso * 0.5,
                            // Precisión de altitud
                            altitudeAccuracy: 5.0,
                            // Dirección en grados respecto al norte (45° = Noreste)
                            heading: 45.0,
                            // Velocidad de caminata en metros por segundo (1.4 m/s ≈ 5 km/h)
                            speed: 1.4
                        },
                        // Marca de tiempo de la actualización actual
                        timestamp: Date.now()
                    });
                }
            }, 120);

            // Almacenamos el intervalo en el mapa bajo la clave del currentId
            activeWatchers.set(currentId, intervalId);
            // Retornamos el número identificador al llamador (igual que setInterval)
            return currentId;
        },

        // 3. clearWatch: Detiene el rastreo usando el ID retornado por watchPosition
        clearWatch(id) {
            // Comprobamos si el identificador existe en el registro de rastreadores activos
            if (activeWatchers.has(id)) {
                // Detenemos el intervalo asociado mediante clearInterval
                clearInterval(activeWatchers.get(id));
                // Eliminamos el registro del mapa de rastreadores
                activeWatchers.delete(id);
                // Retornamos true indicando cancelación exitosa
                return true;
            }
            // Retornamos false si el ID no fue encontrado
            return false;
        }
    };
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN Y VERIFICACIÓN DE SOPORTE
// ==============================================================================
// Divisor para el bloque 1
imprimirSeparador(1, "INTRODUCCIÓN A LA API DE GEOLOCALIZACIÓN");

// La Geolocation API de HTML5 permite acceder a la posición física del cliente
// comprobando la existencia de la propiedad "geolocation" en el objeto navigator
const soporteGeolocation = "geolocation" in navigator;
// Imprime en consola si la API está soportada con formato visual
console.log("¿La API de Geolocalización está disponible?:", soporteGeolocation ? "SÍ ✅" : "NO ❌");
// Muestra el tipo y estructura del objeto navigator.geolocation disponible
console.log("Objeto nativo en el entorno              :", navigator.geolocation);


// ==============================================================================
// BLOQUE 2: CONTEXTO SEGURO OBLIGATORIO (HTTPS) Y PRIVACIDAD
// ==============================================================================
// Divisor para el bloque 2
imprimirSeparador(2, "CONTEXTO SEGURO OBLIGATORIO (HTTPS) Y PRIVACIDAD");

// Explicación de los protocolos permitidos por especificación
console.log("Protocolos permitidos : https:// o http://localhost");
// Explicación de los protocolos bloqueados automáticamente por seguridad
console.log("Protocolos bloqueados : http:// plano (inseguro)");
// Detalle sobre el diálogo nativo de permisos del usuario
console.log("Consentimiento        : Obligatorio mediante diálogo nativo del navegador");


// ==============================================================================
// BLOQUE 3: EL MÉTODO ASÍNCRONO getCurrentPosition()
// ==============================================================================
// Divisor para el bloque 3
imprimirSeparador(3, "EL MÉTODO ASÍNCRONO getCurrentPosition() (LECTURA ÚNICA)");

// Propósito de la función de lectura única
console.log("Propósito       : Obtiene la ubicación física actual del dispositivo UNA SOLA VEZ.");
// Comportamiento del ciclo de vida del sensor
console.log("Comportamiento  : Realiza la consulta, ejecuta el callback correspondiente y se apaga.");
// Firma estándar de los 3 parámetros aceptados
console.log("Firma del método: navigator.geolocation.getCurrentPosition(success, error, options)");


// ==============================================================================
// BLOQUE 4: EL MÉTODO DE SEGUIMIENTO EN TIEMPO REAL: watchPosition() Y clearWatch()
// ==============================================================================
// Divisor para el bloque 4
imprimirSeparador(4, "EL MÉTODO watchPosition() Y clearWatch() (SEGUIMIENTO EN VIVO)");

// Firma de inicio que devuelve el watchId
console.log("Firma de inicio  : const watchId = navigator.geolocation.watchPosition(success, error, options);");
// Firma de detención obligatoria con clearWatch
console.log("Firma de parada  : navigator.geolocation.clearWatch(watchId);");
// Explicación del número identificador devuelto
console.log("Retorno de watch : Un identificador entero positivo (watchId) para cancelar el listener.");


// ==============================================================================
// BLOQUE 5: COMPARATIVA: getCurrentPosition() VS. watchPosition()
// ==============================================================================
// Divisor para el bloque 5
imprimirSeparador(5, "COMPARATIVA: getCurrentPosition() VS. watchPosition()");

// Arreglo de criterios para contrastar ambos métodos arquitectónicos
const tablaComparativa = [
    // Fila 1: Frecuencia de ejecución
    {
        criterio: "Frecuencia",
        getCurrentPosition: "1 sola vez (disparo único)",
        watchPosition: "Continua (cada cambio de posición)"
    },
    // Fila 2: Impacto en consumo energético y sensores
    {
        criterio: "Uso de Recursos",
        getCurrentPosition: "Bajo (se apaga de inmediato)",
        watchPosition: "Alto (mantiene sensores GPS activos)"
    },
    // Fila 3: Necesidad de método de parada
    {
        criterio: "Método de Parada",
        getCurrentPosition: "No requiere (finaliza solo)",
        watchPosition: "clearWatch(id) OBLIGATORIO"
    },
    // Fila 4: Casos de uso recomendados
    {
        criterio: "Casos de Uso",
        getCurrentPosition: "Tiendas cercanas, clima actual, check-in",
        watchPosition: "Apps de running/fitness, Waze, Uber, delivery"
    }
];

// Iteramos cada fila de la tabla comparativa e imprimimos los valores formateados
tablaComparativa.forEach(fila => {
    // Imprime el criterio alineado y el comportamiento en getCurrentPosition
    console.log(`[${fila.criterio.padEnd(16)}] -> getCurrent: ${fila.getCurrentPosition}`);
    // Imprime el comportamiento correspondiente en watchPosition
    console.log(`${" ".repeat(21)}-> watch       : ${fila.watchPosition}`);
});


// ==============================================================================
// BLOQUE 6: DEMOSTRACIÓN DE watchPosition() EN ACCIÓN
// ==============================================================================
// Divisor para el bloque 6
imprimirSeparador(6, "DEMOSTRACIÓN DE watchPosition() CON clearWatch()");

// Variable contadora de actualizaciones recibidas en el listener
let conteoActualizaciones = 0;

// Iniciamos el seguimiento en vivo invocando watchPosition
const miWatchId = navigator.geolocation.watchPosition(
    // Callback de éxito que se ejecutará en cada actualización de posición
    (pos) => {
        // Incrementamos el contador de ticks recibidos
        conteoActualizaciones++;
        // Desestructuramos las coordenadas de la posición
        const { latitude, longitude, accuracy, speed } = pos.coords;
        // Imprimimos el número de tick
        console.log(`📍 [watchPosition tick #${conteoActualizaciones}]`);
        // Imprimimos latitud, longitud, precisión y velocidad
        console.log(`   Lat: ${latitude.toFixed(6)}° | Lng: ${longitude.toFixed(6)}° | ±${accuracy.toFixed(1)}m | Vel: ${speed} m/s`);

        // Por seguridad pedagógica, tras 3 lecturas detenemos el seguimiento con clearWatch
        if (conteoActualizaciones >= 3) {
            // Informamos de la parada para proteger batería
            console.log(`🛑 [clearWatch] Deteniendo el seguimiento del watchId #${miWatchId} para ahorrar batería.`);
            // Cancelamos el listener llamando a clearWatch con el ID
            navigator.geolocation.clearWatch(miWatchId);
        }
    },
    // Callback de error
    (err) => {
        // Reporte de fallo en caso de ocurrir
        console.error("Error en watchPosition:", err.message);
    },
    // Objeto de opciones de configuración
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);

// Notificamos que el watch ha comenzado con su identificador
console.log(`Watch iniciado con éxito. Identificador asignado: #${miWatchId}`);


// ==============================================================================
// BLOQUE 7: CALLBACK DE ÉXITO: OBJETO position Y coords
// ==============================================================================
// Divisor para el bloque 7
imprimirSeparador(7, "CALLBACK DE ÉXITO: ANATOMÍA DE position.coords");

// Invocamos getCurrentPosition para inspeccionar el objeto que recibe el callback de éxito
navigator.geolocation.getCurrentPosition(
    // Callback receptor del objeto GeolocationPosition
    (pos) => {
        // Imprimimos la estructura completa recibida
        console.log("Objeto position recibido:", {
            coords: pos.coords,
            timestamp: pos.timestamp
        });
    },
    // Callback de error secundario
    (err) => console.error(err)
);


// ==============================================================================
// BLOQUE 8: EXTRACCIÓN Y DESESTRUCTURACIÓN DE COORDENADAS
// ==============================================================================
// Divisor para el bloque 8
imprimirSeparador(8, "EXTRACCIÓN DE MÉTRICAS GEOGRÁFICAS");

// Invocamos getCurrentPosition desestructurando todas sus métricas geográficas
navigator.geolocation.getCurrentPosition((pos) => {
    // Desestructuración limpia de las propiedades de coords
    const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
    // Conversión de la marca de tiempo a formato de hora local legible
    const horaLectura = new Date(pos.timestamp).toLocaleTimeString();

    // Imprime la latitud en grados decimales con 6 cifras de precisión
    console.log("Latitud decimal          :", latitude.toFixed(6) + "°");
    // Imprime la longitud en grados decimales
    console.log("Longitud decimal         :", longitude.toFixed(6) + "°");
    // Imprime el margen de error estimado en metros con 95% de nivel de confianza
    console.log("Margen de precisión      : ±" + Math.round(accuracy) + " metros (95% confianza)");
    // Imprime la altitud o 'null' si el hardware no la soporta
    console.log("Altitud sobre nivel mar  :", altitude !== null ? altitude + " m" : "null (no disponible)");
    // Imprime la velocidad actual del dispositivo en metros por segundo
    console.log("Velocidad instantánea    :", speed !== null ? speed + " m/s" : "null (estático)");
    // Imprime la hora local en que se capturó la señal
    console.log("Hora de captura satelital:", horaLectura);
});


// ==============================================================================
// BLOQUE 9: CALLBACK DE ERROR: OBJETO GeolocationPositionError
// ==============================================================================
// Divisor para el bloque 9
imprimirSeparador(9, "CALLBACK DE ERROR Y CÓDIGOS NUMÉRICOS");

// Arreglo descriptivo de los 3 códigos de error nativos del estándar W3C
const codigosError = [
    // Código 1: PERMISSION_DENIED
    { codigo: 1, constante: "PERMISSION_DENIED",    motivo: "El usuario pulsó 'Bloquear' en el diálogo de permisos" },
    // Código 2: POSITION_UNAVAILABLE
    { codigo: 2, constante: "POSITION_UNAVAILABLE", motivo: "Fallo físico de señal (sin cobertura GPS ni red Wi-Fi)" },
    // Código 3: TIMEOUT
    { codigo: 3, constante: "TIMEOUT",              motivo: "Se superó el tiempo máximo fijado en options.timeout" }
];

// Iteramos cada código de error e imprimimos su constante y causa raíz
codigosError.forEach(item => {
    // Formateo del código, constante y motivo
    console.log(`Código [${item.codigo}] -> ${item.constante.padEnd(20)} | Causa: ${item.motivo}`);
});


// ==============================================================================
// BLOQUE 10: GESTIÓN DE FALLOS CON switch(error.code)
// ==============================================================================
// Divisor para el bloque 10
imprimirSeparador(10, "GESTIÓN ROBUSTA DE ERRORES CON switch");

// Declaración de una función profesional de gestión de fallos evaluando error.code
const manejarErrorGeolocalizacion = (error) => {
    // Evaluamos el código numérico recibido mediante una estructura de control switch
    switch (error.code) {
        // Caso 1: El usuario rechazó la solicitud de permisos
        case 1:
            console.error("❌ Código 1: El usuario denegó el acceso a la ubicación.");
            break;
        // Caso 2: El dispositivo no puede triangular su posición geográfica
        case 2:
            console.error("❌ Código 2: Ubicación física no disponible en este momento.");
            break;
        // Caso 3: Se agotó el tiempo límite fijado en timeout
        case 3:
            console.error("❌ Código 3: Se agotó el tiempo de espera de la consulta.");
            break;
        // Caso por defecto: Cualquier otro fallo no contemplado
        default:
            console.error(`❌ Error no clasificado (${error.code}): ${error.message}`);
            break;
    }
};

// Invocamos la función con un error simulado de tipo TIMEOUT
manejarErrorGeolocalizacion({ code: 3, message: "Timeout expired" });


// ==============================================================================
// BLOQUE 11: OBJETO DE CONFIGURACIÓN 'options'
// ==============================================================================
// Divisor para el bloque 11
imprimirSeparador(11, "CALIBRACIÓN CON EL OBJETO options");

// Objeto de configuración con las tres propiedades estándar de la API
const opcionesConfiguradas = {
    // Exige al hardware activar el chip GPS para máxima precisión (mayor consumo)
    enableHighAccuracy: true,
    // Tiempo máximo de espera en milisegundos antes de disparar el error TIMEOUT (5 segundos)
    timeout: 5000,
    // Tiempo máximo en milisegundos que se acepta una posición en caché (0 = siempre fresca)
    maximumAge: 0
};

// Imprime en consola la configuración calibrada
console.log("Configuración de alta precisión :", opcionesConfiguradas);


// ==============================================================================
// BLOQUE 12: ANALOGÍAS DEL MUNDO REAL
// ==============================================================================
// Divisor para el bloque 12
imprimirSeparador(12, "ANALOGÍAS DEL MUNDO REAL");

// Imprime las metáforas visuales de Fotografía vs Transmisión y el Mensajero Láser
console.log(`
📸 ANALOGÍA A: LA FOTOGRAFÍA VS. LA TRANSMISIÓN EN VIVO
  - getCurrentPosition() es tomar UNA FOTO con la cámara: capturas el instante exacto,
    guardas la imagen y guardas la cámara en el bolsillo (gasto mínimo de batería).
  - watchPosition() es iniciar una TRANSMISIÓN EN VIVO (Live Streaming): la cámara
    permanece encendida todo el tiempo transmitiendo cada paso que das (máximo detalle,
    pero si no la apagas con clearWatch(), vaciará la batería de tu teléfono).

🛰️ ANALOGÍA B: EL MENSAJERO Y EL LÁSER SATELITAL (enableHighAccuracy)
  - Con enableHighAccuracy: false, el repartidor mira la estación de tren más cercana (rápido).
  - Con enableHighAccuracy: true, el repartidor enciende un visor láser satelital para
    ubicar la puerta exacta de tu casa (toma más tiempo y consume más batería).
`);


// ==============================================================================
// BLOQUE 13: BUENA PRÁCTICA: DETENER watchPosition CON clearWatch()
// ==============================================================================
// Divisor para el bloque 13
imprimirSeparador(13, "BUENA PRÁCTICA: DETENER SIEMPRE watchPosition() CON clearWatch()");

// Mensaje de recomendación estándar en producción
console.log("✅ Regla de Oro en Producción:");
// Explicación de limpieza de recursos en ciclo de vida de componentes
console.log("   Siempre que uses watchPosition(), debes guardar su ID y ejecutar");
// Recomendación de desmontaje en frameworks
console.log("   clearWatch(id) cuando el usuario cambie de pestaña, cierre el modal o");
// Equivalencias en React y Vue
console.log("   el componente se desmonte (en React/Vue: componentWillUnmount / onUnmounted).");


// ==============================================================================
// BLOQUE 14: ERROR COMÚN: TYPO EN enableHighAccuracy Y HTTP INSEGURO
// ==============================================================================
// Divisor para el bloque 14
imprimirSeparador(14, "ERRORES COMUNES (TYPO Y CONTEXTO INSEGURO)");

// Error común 1: typo con 't' intermedia
console.log("❌ enableHightAccuracy (con 't') : El navegador la ignora y usa false por defecto.");
// Corrección formal
console.log("✅ enableHighAccuracy  (sin 't') : Propiedad estándar reconocida por la especificación.");
// Error común 2: HTTP plano
console.log("❌ Servir en http:// plano       : Bloqueo inmediato del navegador por falta de SSL.");


// ==============================================================================
// BLOQUE 15: PROYECTO INTEGRADOR: RASTREADOR EN TIEMPO REAL
// ==============================================================================
// Divisor para el bloque 15
imprimirSeparador(15, "PROYECTO INTEGRADOR: RASTREADOR EN TIEMPO REAL");

// Declaración de una fábrica de rastreadores encapsulando el watchId en un cierre (closure)
const iniciarRastreadorEnVivo = () => {
    // Variable privada para custodiar el identificador del rastreo
    let watchId = null;

    // Función interna para iniciar el seguimiento
    const iniciar = () => {
        // Invocamos watchPosition y guardamos el ID
        watchId = navigator.geolocation.watchPosition(
            // Callback con desestructuración de coords
            ({ coords }) => {
                // Generamos una URL dinámica de OpenStreetMap con las coordenadas
                const osmUrl = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
                // Imprimimos la posición y el enlace directo al mapa
                console.log(`🗺️ [En vivo] Posición: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)} | Ver mapa: ${osmUrl}`);
            },
            // Callback de captura de errores
            (err) => console.error("Error en rastreador:", err.message),
            // Opciones de alta precisión
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        // Retornamos el watchId generado
        return watchId;
    };

    // Función interna para detener el seguimiento usando clearWatch
    const detener = (id) => {
        // Llamada formal a clearWatch con el ID
        navigator.geolocation.clearWatch(id);
        // Confirmación en consola
        console.log(`🛑 Rastreador #${id} detenido.`);
    };

    // Exponemos la interfaz pública con los métodos iniciar y detener
    return { iniciar, detener };
};

// Instanciamos el rastreador modular
const rastreador = iniciarRastreadorEnVivo();
// Iniciamos el rastreador y obtenemos el identificador activo
const idActivo = rastreador.iniciar();
// Programamos la detención automática a los 250 ms para no dejar procesos colgados
setTimeout(() => rastreador.detener(idActivo), 250);


// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO
// ==============================================================================
// Divisor para el bloque 16 final
imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS (NIVELES 1, 2 Y 3)");

// --- RETO NIVEL 1 (Junior): Consulta Simple con getCurrentPosition ---
console.log("--- RETO NIVEL 1 (Junior): Consulta Simple ---");
// Invocación básica de getCurrentPosition
navigator.geolocation.getCurrentPosition((pos) => {
    // Desestructuración de latitud, longitud y precisión
    const { latitude, longitude, accuracy } = pos.coords;
    // Impresión de las métricas obtenidas
    console.log(`Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ±${accuracy}m`);
});

// --- RETO NIVEL 2 (Semi-Senior): Manejador switch ---
console.log("\n--- RETO NIVEL 2 (Semi-Senior): Gestor de Errores con switch ---");
// Función gestora de errores con switch
const gestorErrores = (err) => {
    // Evaluación del código de error
    switch (err.code) {
        // Caso 1
        case 1: console.error("Permiso denegado por el usuario."); break;
        // Caso 2
        case 2: console.error("Ubicación física no disponible."); break;
        // Caso 3
        case 3: console.error("Se agotó el tiempo de espera."); break;
    }
};
// Invocación con callback de éxito y gestor de errores
navigator.geolocation.getCurrentPosition(pos => console.log("OK Nivel 2:", pos.coords.latitude), gestorErrores);

// --- RETO NIVEL 3 (Producción): watchPosition y clearWatch ---
console.log("\n--- RETO NIVEL 3 (Producción): Seguimiento Continuo con watchPosition y clearWatch ---");
// Variable para almacenar el ID del reto 3
let reto3Id = null;
// Iniciamos watchPosition
reto3Id = navigator.geolocation.watchPosition(
    // Callback receptor de coordenadas
    ({ coords }) => {
        // Imprime las coordenadas recibidas
        console.log(`[Reto 3 Live] Lat: ${coords.latitude.toFixed(6)} | Lng: ${coords.longitude.toFixed(6)}`);
        // Cancelamos inmediatamente para limpiar la prueba pedagógica
        navigator.geolocation.clearWatch(reto3Id);
    },
    // Callback de advertencia en fallo
    (err) => console.warn(err.message),
    // Opciones
    { enableHighAccuracy: true }
);

// Salto de línea y divisor de cierre
console.log("\n" + "=".repeat(78));
// Mensaje de felicitación final
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Geolocation API (con watchPosition) completado.");
// Línea divisoria de fin
console.log("=".repeat(78) + "\n");
