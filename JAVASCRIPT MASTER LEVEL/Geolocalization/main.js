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
    console.log("\n" + "=".repeat(78));
    console.log(`📌 BLOQUE ${numeroBloque}: ${titulo}`);
    console.log("=".repeat(78));
}

// ==============================================================================
// COMPATIBILIDAD UNIVERSAL: SIMULADOR DE GEOLOCATION API PARA NODE.JS
// ==============================================================================
// En el navegador existe 'navigator.geolocation' de forma nativa.
// Para que este archivo también pueda ejecutarse con 'node main.js' en la terminal
// sin lanzar errores de 'navigator is not defined', creamos un simulador fiel
// que emula tanto 'getCurrentPosition' como 'watchPosition' y 'clearWatch':
if (typeof globalThis.navigator === "undefined") {
    globalThis.navigator = {};
}

if (typeof globalThis.navigator.geolocation === "undefined") {
    let watchIdCounter = 0;
    const activeWatchers = new Map();

    globalThis.navigator.geolocation = {
        // 1. getCurrentPosition: Lectura única
        getCurrentPosition(successCallback, errorCallback, options = {}) {
            setTimeout(() => {
                if (options.timeout && options.timeout < 100) {
                    if (typeof errorCallback === "function") {
                        errorCallback({
                            code: 3,
                            PERMISSION_DENIED: 1,
                            POSITION_UNAVAILABLE: 2,
                            TIMEOUT: 3,
                            message: "Se agotó el tiempo de espera configurado (TIMEOUT)."
                        });
                    }
                    return;
                }

                if (typeof successCallback === "function") {
                    successCallback({
                        coords: {
                            latitude: 40.416775,
                            longitude: -3.703790,
                            accuracy: options.enableHighAccuracy ? 8.5 : 250.0,
                            altitude: 667.0,
                            altitudeAccuracy: 10.0,
                            heading: null,
                            speed: null
                        },
                        timestamp: Date.now()
                    });
                }
            }, 100);
        },

        // 2. watchPosition: Seguimiento continuo (devuelve un ID numérico)
        watchPosition(successCallback, errorCallback, options = {}) {
            watchIdCounter++;
            const currentId = watchIdCounter;
            let paso = 0;

            const intervalId = setInterval(() => {
                paso++;
                if (typeof successCallback === "function") {
                    successCallback({
                        coords: {
                            // Simulamos un leve desplazamiento en cada actualización
                            latitude: 40.416775 + paso * 0.00012,
                            longitude: -3.703790 + paso * 0.00008,
                            accuracy: options.enableHighAccuracy ? 6.2 : 120.0,
                            altitude: 667.0 + paso * 0.5,
                            altitudeAccuracy: 5.0,
                            heading: 45.0,
                            speed: 1.4 // metros por segundo (~5 km/h caminando)
                        },
                        timestamp: Date.now()
                    });
                }
            }, 120);

            activeWatchers.set(currentId, intervalId);
            return currentId;
        },

        // 3. clearWatch: Detiene el rastreo usando el ID retornado por watchPosition
        clearWatch(id) {
            if (activeWatchers.has(id)) {
                clearInterval(activeWatchers.get(id));
                activeWatchers.delete(id);
                return true;
            }
            return false;
        }
    };
}


// ==============================================================================
// BLOQUE 1: INTRODUCCIÓN Y VERIFICACIÓN DE SOPORTE
// ==============================================================================
imprimirSeparador(1, "INTRODUCCIÓN A LA API DE GEOLOCALIZACIÓN");

// La Geolocation API de HTML5 permite acceder a la posición física del cliente
// consultando GPS, Wi-Fi, antenas celulares y dirección IP.
const soporteGeolocation = "geolocation" in navigator;
console.log("¿La API de Geolocalización está disponible?:", soporteGeolocation ? "SÍ ✅" : "NO ❌");
console.log("Objeto nativo en el entorno              :", navigator.geolocation);


// ==============================================================================
// BLOQUE 2: CONTEXTO SEGURO OBLIGATORIO (HTTPS) Y PRIVACIDAD
// ==============================================================================
imprimirSeparador(2, "CONTEXTO SEGURO OBLIGATORIO (HTTPS) Y PRIVACIDAD");

console.log("Protocolos permitidos : https:// o http://localhost");
console.log("Protocolos bloqueados : http:// plano (inseguro)");
console.log("Consentimiento        : Obligatorio mediante diálogo nativo del navegador");


// ==============================================================================
// BLOQUE 3: EL MÉTODO ASÍNCRONO getCurrentPosition()
// ==============================================================================
imprimirSeparador(3, "EL MÉTODO ASÍNCRONO getCurrentPosition() (LECTURA ÚNICA)");

// Sintaxis canónica:
// navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
console.log("Propósito       : Obtiene la ubicación física actual del dispositivo UNA SOLA VEZ.");
console.log("Comportamiento  : Realiza la consulta, ejecuta el callback correspondiente y se apaga.");
console.log("Firma del método: navigator.geolocation.getCurrentPosition(success, error, options)");


// ==============================================================================
// BLOQUE 4: EL MÉTODO DE SEGUIMIENTO EN TIEMPO REAL: watchPosition() Y clearWatch()
// ==============================================================================
imprimirSeparador(4, "EL MÉTODO watchPosition() Y clearWatch() (SEGUIMIENTO EN VIVO)");

// A diferencia de 'getCurrentPosition()', 'watchPosition()' registra una función de
// escucha que se ejecuta automáticamente CADA VEZ que el dispositivo detecta un
// cambio significativo en sus coordenadas o precisión (por ejemplo, cuando el usuario camina o viaja en auto).
//
// ⚠️ IMPORTANTE: 'watchPosition()' devuelve un número identificador (ID) único,
// exactamente igual que 'setInterval()'. Para detener el consumo de batería y GPS,
// debemos pasar ese ID al método 'navigator.geolocation.clearWatch(id)'.

console.log("Firma de inicio  : const watchId = navigator.geolocation.watchPosition(success, error, options);");
console.log("Firma de parada  : navigator.geolocation.clearWatch(watchId);");
console.log("Retorno de watch : Un identificador entero positivo (watchId) para cancelar el listener.");


// ==============================================================================
// BLOQUE 5: COMPARATIVA: getCurrentPosition() VS. watchPosition()
// ==============================================================================
imprimirSeparador(5, "COMPARATIVA: getCurrentPosition() VS. watchPosition()");

const tablaComparativa = [
    {
        criterio: "Frecuencia",
        getCurrentPosition: "1 sola vez (disparo único)",
        watchPosition: "Continua (cada cambio de posición)"
    },
    {
        criterio: "Uso de Recursos",
        getCurrentPosition: "Bajo (se apaga de inmediato)",
        watchPosition: "Alto (mantiene sensores GPS activos)"
    },
    {
        criterio: "Método de Parada",
        getCurrentPosition: "No requiere (finaliza solo)",
        watchPosition: "clearWatch(id) OBLIGATORIO"
    },
    {
        criterio: "Casos de Uso",
        getCurrentPosition: "Tiendas cercanas, clima actual, check-in",
        watchPosition: "Apps de running/fitness, Waze, Uber, delivery"
    }
];

tablaComparativa.forEach(fila => {
    console.log(`[${fila.criterio.padEnd(16)}] -> getCurrent: ${fila.getCurrentPosition}`);
    console.log(`${" ".repeat(21)}-> watch       : ${fila.watchPosition}`);
});


// ==============================================================================
// BLOQUE 6: DEMOSTRACIÓN DE watchPosition() EN ACCIÓN
// ==============================================================================
imprimirSeparador(6, "DEMOSTRACIÓN DE watchPosition() CON clearWatch()");

let conteoActualizaciones = 0;

// Iniciamos el seguimiento en vivo
const miWatchId = navigator.geolocation.watchPosition(
    (pos) => {
        conteoActualizaciones++;
        const { latitude, longitude, accuracy, speed } = pos.coords;
        console.log(`📍 [watchPosition tick #${conteoActualizaciones}]`);
        console.log(`   Lat: ${latitude.toFixed(6)}° | Lng: ${longitude.toFixed(6)}° | ±${accuracy.toFixed(1)}m | Vel: ${speed} m/s`);

        // Por seguridad pedagógica, tras 3 lecturas detenemos el seguimiento con clearWatch
        if (conteoActualizaciones >= 3) {
            console.log(`🛑 [clearWatch] Deteniendo el seguimiento del watchId #${miWatchId} para ahorrar batería.`);
            navigator.geolocation.clearWatch(miWatchId);
        }
    },
    (err) => {
        console.error("Error en watchPosition:", err.message);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
);

console.log(`Watch iniciado con éxito. Identificador asignado: #${miWatchId}`);


// ==============================================================================
// BLOQUE 7: CALLBACK DE ÉXITO: OBJETO position Y coords
// ==============================================================================
imprimirSeparador(7, "CALLBACK DE ÉXITO: ANATOMÍA DE position.coords");

// Cuando la triangulación concluye, el callback recibe un objeto 'GeolocationPosition':
navigator.geolocation.getCurrentPosition(
    (pos) => {
        console.log("Objeto position recibido:", {
            coords: pos.coords,
            timestamp: pos.timestamp
        });
    },
    (err) => console.error(err)
);


// ==============================================================================
// BLOQUE 8: EXTRACCIÓN Y DESESTRUCTURACIÓN DE COORDENADAS
// ==============================================================================
imprimirSeparador(8, "EXTRACCIÓN DE MÉTRICAS GEOGRÁFICAS");

navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
    const horaLectura = new Date(pos.timestamp).toLocaleTimeString();

    console.log("Latitud decimal          :", latitude.toFixed(6) + "°");
    console.log("Longitud decimal         :", longitude.toFixed(6) + "°");
    console.log("Margen de precisión      : ±" + Math.round(accuracy) + " metros (95% confianza)");
    console.log("Altitud sobre nivel mar  :", altitude !== null ? altitude + " m" : "null (no disponible)");
    console.log("Velocidad instantánea    :", speed !== null ? speed + " m/s" : "null (estático)");
    console.log("Hora de captura satelital:", horaLectura);
});


// ==============================================================================
// BLOQUE 9: CALLBACK DE ERROR: OBJETO GeolocationPositionError
// ==============================================================================
imprimirSeparador(9, "CALLBACK DE ERROR Y CÓDIGOS NUMÉRICOS");

const codigosError = [
    { codigo: 1, constante: "PERMISSION_DENIED",    motivo: "El usuario pulsó 'Bloquear' en el diálogo de permisos" },
    { codigo: 2, constante: "POSITION_UNAVAILABLE", motivo: "Fallo físico de señal (sin cobertura GPS ni red Wi-Fi)" },
    { codigo: 3, constante: "TIMEOUT",              motivo: "Se superó el tiempo máximo fijado en options.timeout" }
];

codigosError.forEach(item => {
    console.log(`Código [${item.codigo}] -> ${item.constante.padEnd(20)} | Causa: ${item.motivo}`);
});


// ==============================================================================
// BLOQUE 10: GESTIÓN DE FALLOS CON switch(error.code)
// ==============================================================================
imprimirSeparador(10, "GESTIÓN ROBUSTA DE ERRORES CON switch");

const manejarErrorGeolocalizacion = (error) => {
    switch (error.code) {
        case 1:
            console.error("❌ Código 1: El usuario denegó el acceso a la ubicación.");
            break;
        case 2:
            console.error("❌ Código 2: Ubicación física no disponible en este momento.");
            break;
        case 3:
            console.error("❌ Código 3: Se agotó el tiempo de espera de la consulta.");
            break;
        default:
            console.error(`❌ Error no clasificado (${error.code}): ${error.message}`);
            break;
    }
};

manejarErrorGeolocalizacion({ code: 3, message: "Timeout expired" });


// ==============================================================================
// BLOQUE 11: OBJETO DE CONFIGURACIÓN 'options'
// ==============================================================================
imprimirSeparador(11, "CALIBRACIÓN CON EL OBJETO options");

const opcionesConfiguradas = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

console.log("Configuración de alta precisión :", opcionesConfiguradas);


// ==============================================================================
// BLOQUE 12: ANALOGÍAS DEL MUNDO REAL
// ==============================================================================
imprimirSeparador(12, "ANALOGÍAS DEL MUNDO REAL");

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
imprimirSeparador(13, "BUENA PRÁCTICA: DETENER SIEMPRE watchPosition() CON clearWatch()");

console.log("✅ Regla de Oro en Producción:");
console.log("   Siempre que uses watchPosition(), debes guardar su ID y ejecutar");
console.log("   clearWatch(id) cuando el usuario cambie de pestaña, cierre el modal o");
console.log("   el componente se desmonte (en React/Vue: componentWillUnmount / onUnmounted).");


// ==============================================================================
// BLOQUE 14: ERROR COMÚN: TYPO EN enableHighAccuracy Y HTTP INSEGURO
// ==============================================================================
imprimirSeparador(14, "ERRORES COMUNES (TYPO Y CONTEXTO INSEGURO)");

console.log("❌ enableHightAccuracy (con 't') : El navegador la ignora y usa false por defecto.");
console.log("✅ enableHighAccuracy  (sin 't') : Propiedad estándar reconocida por la especificación.");
console.log("❌ Servir en http:// plano       : Bloqueo inmediato del navegador por falta de SSL.");


// ==============================================================================
// BLOQUE 15: PROYECTO INTEGRADOR: RASTREADOR EN TIEMPO REAL
// ==============================================================================
imprimirSeparador(15, "PROYECTO INTEGRADOR: RASTREADOR EN TIEMPO REAL");

const iniciarRastreadorEnVivo = () => {
    let watchId = null;

    const iniciar = () => {
        watchId = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const osmUrl = `https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}`;
                console.log(`🗺️ [En vivo] Posición: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)} | Ver mapa: ${osmUrl}`);
            },
            (err) => console.error("Error en rastreador:", err.message),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        return watchId;
    };

    const detener = (id) => {
        navigator.geolocation.clearWatch(id);
        console.log(`🛑 Rastreador #${id} detenido.`);
    };

    return { iniciar, detener };
};

const rastreador = iniciarRastreadorEnVivo();
const idActivo = rastreador.iniciar();
setTimeout(() => rastreador.detener(idActivo), 250);


// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO
// ==============================================================================
imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS (NIVELES 1, 2 Y 3)");

// --- RETO NIVEL 1 (Junior): Consulta Simple con getCurrentPosition ---
console.log("--- RETO NIVEL 1 (Junior): Consulta Simple ---");
navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude, accuracy } = pos.coords;
    console.log(`Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ±${accuracy}m`);
});

// --- RETO NIVEL 2 (Semi-Senior): Manejador switch ---
console.log("\n--- RETO NIVEL 2 (Semi-Senior): Gestor de Errores con switch ---");
const gestorErrores = (err) => {
    switch (err.code) {
        case 1: console.error("Permiso denegado por el usuario."); break;
        case 2: console.error("Ubicación física no disponible."); break;
        case 3: console.error("Se agotó el tiempo de espera."); break;
    }
};
navigator.geolocation.getCurrentPosition(pos => console.log("OK Nivel 2:", pos.coords.latitude), gestorErrores);

// --- RETO NIVEL 3 (Producción): watchPosition y clearWatch ---
console.log("\n--- RETO NIVEL 3 (Producción): Seguimiento Continuo con watchPosition y clearWatch ---");
let reto3Id = null;
reto3Id = navigator.geolocation.watchPosition(
    ({ coords }) => {
        console.log(`[Reto 3 Live] Lat: ${coords.latitude.toFixed(6)} | Lng: ${coords.longitude.toFixed(6)}`);
        // Cancelamos inmediatamente para limpiar la prueba
        navigator.geolocation.clearWatch(reto3Id);
    },
    (err) => console.warn(err.message),
    { enableHighAccuracy: true }
);

console.log("\n" + "=".repeat(78));
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Geolocation API (con watchPosition) completado.");
console.log("=".repeat(78) + "\n");
