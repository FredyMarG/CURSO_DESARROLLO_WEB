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
 * 4. Callback de Éxito: Objeto 'GeolocationPosition' y métricas en 'coords'
 * 5. Extracción de coordenadas: latitude, longitude, accuracy, altitude y timestamp
 * 6. Callback de Error: Objeto 'GeolocationPositionError' y sus 3 códigos nativos
 * 7. Gestión de fallos: PERMISSION_DENIED (1), POSITION_UNAVAILABLE (2) y TIMEOUT (3)
 * 8. Objeto de Configuración 'options': enableHighAccuracy, timeout y maximumAge
 * 9. Analogías del mundo real: El Mensajero con Láser 🛰️ y la Foto con Vencimiento ⏱️
 * 10. Diagrama de flujo completo de solicitud de ubicación
 * 11. Buena práctica 1: Implementar siempre el callback de error con feedback al usuario
 * 12. Buena práctica 2: Calibrar maximumAge para ahorrar batería y acelerar respuestas
 * 13. Error común 1: El clásico typo 'enableHightAccuracy' con 't' intermedia
 * 14. Error común 2: Ejecución en conexiones HTTP estándar sin certificado SSL
 * 15. Proyecto Integrador: Rastreador de Posición con enlace a OpenStreetMap
 * 16. Resolución completa de los 3 Retos Prácticos del Módulo (Niveles 1, 2 y 3)
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
// sin lanzar errores de 'navigator is not defined', creamos un simulador fiel:
if (typeof globalThis.navigator === "undefined") {
    globalThis.navigator = {};
}

if (typeof globalThis.navigator.geolocation === "undefined") {
    globalThis.navigator.geolocation = {
        getCurrentPosition(successCallback, errorCallback, options = {}) {
            // Emulamos la naturaleza asíncrona de la API con setTimeout
            setTimeout(() => {
                // Si options.timeout es absurdamente bajo (< 100ms), simulamos un TIMEOUT
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

                // Por defecto simulamos una lectura satelital exitosa en Madrid, España
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
            }, 150);
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

// Regla estricta de seguridad:
// 1. La API SOLO se activa bajo HTTPS o en 'http://localhost' (desarrollo local).
// 2. Requiere consentimiento explícito: el navegador muestra un cuadro de diálogo.
//    Si el usuario rechaza, se dispara el callback de error (PERMISSION_DENIED).

console.log("Protocolos permitidos : https:// o http://localhost");
console.log("Protocolos bloqueados : http:// plano (inseguro)");
console.log("Consentimiento        : Obligatorio mediante diálogo nativo del navegador");


// ==============================================================================
// BLOQUE 3: EL MÉTODO ASÍNCRONO getCurrentPosition()
// ==============================================================================
imprimirSeparador(3, "EL MÉTODO ASÍNCRONO getCurrentPosition()");

// Sintaxis canónica:
// navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
console.log("Firma del método : navigator.geolocation.getCurrentPosition(success, error, options)");
console.log("Parámetro 1      : successCallback (Obligatorio) -> Recibe GeolocationPosition");
console.log("Parámetro 2      : errorCallback   (Recomendado) -> Recibe GeolocationPositionError");
console.log("Parámetro 3      : options         (Opcional)    -> Objeto JSON de configuración");


// ==============================================================================
// BLOQUE 4: CALLBACK DE ÉXITO: OBJETO position Y coords
// ==============================================================================
imprimirSeparador(4, "CALLBACK DE ÉXITO: ANATOMÍA DE position.coords");

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
// BLOQUE 5: EXTRACCIÓN Y DESESTRUCTURACIÓN DE COORDENADAS
// ==============================================================================
imprimirSeparador(5, "EXTRACCIÓN DE MÉTRICAS GEOGRÁFICAS");

navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude, accuracy, altitude } = pos.coords;
    const horaLectura = new Date(pos.timestamp).toLocaleTimeString();

    console.log("Latitud decimal          :", latitude.toFixed(6) + "°");
    console.log("Longitud decimal         :", longitude.toFixed(6) + "°");
    console.log("Margen de precisión      : ±" + Math.round(accuracy) + " metros (95% confianza)");
    console.log("Altitud sobre nivel mar  :", altitude !== null ? altitude + " m" : "null (no disponible)");
    console.log("Hora de captura satelital:", horaLectura);
});


// ==============================================================================
// BLOQUE 6: CALLBACK DE ERROR: OBJETO GeolocationPositionError
// ==============================================================================
imprimirSeparador(6, "CALLBACK DE ERROR Y CÓDIGOS NUMÉRICOS");

// Si falla la consulta, el objeto de error contiene 'code' (número) y 'message' (texto):
const codigosError = [
    { codigo: 1, constante: "PERMISSION_DENIED",    motivo: "El usuario pulsó 'Bloquear' en el diálogo de permisos" },
    { codigo: 2, constante: "POSITION_UNAVAILABLE", motivo: "Fallo físico de señal (sin cobertura GPS ni red Wi-Fi)" },
    { codigo: 3, constante: "TIMEOUT",              motivo: "Se superó el tiempo máximo fijado en options.timeout" }
];

codigosError.forEach(item => {
    console.log(`Código [${item.codigo}] -> ${item.constante.padEnd(20)} | Causa: ${item.motivo}`);
});


// ==============================================================================
// BLOQUE 7: GESTIÓN DE FALLOS CON switch(error.code)
// ==============================================================================
imprimirSeparador(7, "GESTIÓN ROBUSTA DE ERRORES CON switch");

const manejarErrorGeolocalizacion = (error) => {
    switch (error.code) {
        case 1: // error.PERMISSION_DENIED
            console.error("❌ Código 1: El usuario denegó el acceso a la ubicación.");
            break;
        case 2: // error.POSITION_UNAVAILABLE
            console.error("❌ Código 2: Ubicación física no disponible en este momento.");
            break;
        case 3: // error.TIMEOUT
            console.error("❌ Código 3: Se agotó el tiempo de espera de la consulta.");
            break;
        default:
            console.error(`❌ Error no clasificado (${error.code}): ${error.message}`);
            break;
    }
};

// Demostramos el manejador simulando un error de timeout:
manejarErrorGeolocalizacion({ code: 3, message: "Timeout expired" });


// ==============================================================================
// BLOQUE 8: OBJETO DE CONFIGURACIÓN 'options'
// ==============================================================================
imprimirSeparador(8, "CALIBRACIÓN CON EL OBJETO options");

// Las 3 propiedades fundamentales de options:
// 1. enableHighAccuracy (bool): true activa chip GPS (más consumo). false usa Wi-Fi/IP.
// 2. timeout (ms): Límite de espera tras otorgar el permiso (ej. 5000 ms = 5s).
// 3. maximumAge (ms): Antigüedad máxima de la posición en caché (0 = siempre fresca).

const opcionesConfiguradas = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

console.log("Configuración de alta precisión :", opcionesConfiguradas);


// ==============================================================================
// BLOQUE 9: ANALOGÍAS DEL MUNDO REAL (LÁSER SATELITAL Y FOTO CON VENCIMIENTO)
// ==============================================================================
imprimirSeparador(9, "ANALOGÍAS DEL MUNDO REAL: LÁSER 🛰️ Y FOTO ⏱️");

console.log(`
🛰️ ANALOGÍA 1: EL MENSAJERO Y EL LÁSER SATELITAL (enableHighAccuracy)
  - Con enableHighAccuracy: false, el repartidor mira el vecindario general mirando la
    estación de tren (rápido, pero con margen de varias calles).
  - Con enableHighAccuracy: true, el repartidor enciende un visor láser satelital para
    ubicar la puerta exacta de tu casa (toma más tiempo y consume más batería).

⏱️ ANALOGÍA 2: LA FOTO CON VENCIMIENTO (timeout y maximumAge)
  - timeout es esperar el mensaje de un amigo con su ubicación: si no contesta en 5s, abortas.
  - maximumAge es ver la última foto enviada: si tiene menos de 1 minuto (maximumAge > 0),
    asumes que sigue ahí; si necesitas saber dónde está ahora (maximumAge: 0), pides una foto nueva.
`);


// ==============================================================================
// BLOQUE 10: DIAGRAMA DE FLUJO DE SOLICITUD DE UBICACIÓN
// ==============================================================================
imprimirSeparador(10, "DIAGRAMA DE FLUJO DE SOLICITUD DE UBICACIÓN");

console.log(`
   [ Llamada a getCurrentPosition(success, error, options) ]
                               │
                               ▼
                   ¿Soporta Geolocation y HTTPS?
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
                 [ SÍ ]                [ NO ] ──► Fallo inmediato / API no disponible
                     │
                     ▼
          ¿Permiso ya otorgado?
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
       [ SÍ ]                [ NO ] ──► Muestra diálogo nativo de permisos
           │                                      │
           │                            ┌─────────┴─────────┐
           │                            ▼                   ▼
           │                        [ Acepta ]          [ Rechaza ]
           │                            │                   │
           └────────────┬───────────────┘                   ▼
                        ▼                     ( error.PERMISSION_DENIED )
            Evalúa maximumAge en caché
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
     ¿Caché válida?         ¿Caché caducada?
              │                   │
              │                   ▼
              │        Activa GPS / Redes según enableHighAccuracy
              │                   │
              │         ¿Responde antes de timeout?
              │                   │
              │         ┌─────────┴─────────┐
              │         ▼                   ▼
              │       [ SÍ ]              [ NO ] ──► ( error.TIMEOUT )
              │         │
              ▼         ▼
     ( Ejecuta successCallback con objeto position )
`);


// ==============================================================================
// BLOQUE 11: BUENA PRÁCTICA 1: GESTIÓN DE ERRORES CON FEEDBACK AL USUARIO
// ==============================================================================
imprimirSeparador(11, "BUENA PRÁCTICA 1: FEEDBACK OBLIGATORIO ANTE ERRORES");

console.log("✅ Regla de Oro: Nunca omitas el callback de error.");
console.log("   Si el usuario bloquea los permisos y no manejas el error,");
console.log("   tu aplicación quedará congelada sin ninguna explicación visual.");


// ==============================================================================
// BLOQUE 12: BUENA PRÁCTICA 2: CALIBRAR maximumAge
// ==============================================================================
imprimirSeparador(12, "BUENA PRÁCTICA 2: AHORRO DE BATERÍA CON maximumAge");

console.log("✅ Si tu app solo necesita conocer la ciudad o región aproximada,");
console.log("   define maximumAge: 60000 (1 min) o 300000 (5 min) para evitar encender el chip GPS.");


// ==============================================================================
// BLOQUE 13: ERROR COMÚN: TYPO EN enableHighAccuracy
// ==============================================================================
imprimirSeparador(13, "ERROR COMÚN: TYPO 'enableHightAccuracy' CON 't'");

// ❌ Error clásico: escribir "enableHightAccuracy" (con 't' intermedia)
const opcionesConTypo = { enableHightAccuracy: true };
console.log("❌ enableHightAccuracy (con 't') : El navegador la ignora y usa false por defecto.");
console.log("✅ enableHighAccuracy  (sin 't') : Propiedad estándar reconocida por la especificación.");


// ==============================================================================
// BLOQUE 14: ERROR COMÚN: EJECUCIÓN EN HTTP INSEGURO
// ==============================================================================
imprimirSeparador(14, "ERROR COMÚN: EJECUCIÓN EN HTTP INSEGURO");

console.log("❌ En dominios 'http://', el navegador bloquea la llamada por seguridad.");
console.log("✅ Solución: Instalar certificados SSL/TLS (HTTPS) o probar en 'localhost'.");


// ==============================================================================
// BLOQUE 15: PROYECTO INTEGRADOR: RASTREADOR DE POSICIÓN
// ==============================================================================
imprimirSeparador(15, "PROYECTO INTEGRADOR: RASTREADOR Y MAPA OPENSTREETMAP");

const rastrearUsuario = () => {
    const opcionesRastreo = {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
    };

    const exito = ({ coords, timestamp }) => {
        const { latitude, longitude, accuracy } = coords;
        const enlaceMapa = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;

        console.log("1. Posición fijada exitosamente:");
        console.log(`   Lat: ${latitude.toFixed(6)}° | Lng: ${longitude.toFixed(6)}° | Margen: ±${Math.round(accuracy)}m`);
        console.log("2. Enlace generado a OpenStreetMap:");
        console.log(`   ${enlaceMapa}`);
    };

    const fallo = (error) => {
        console.error("Fallo al rastrear:", error.message);
    };

    navigator.geolocation.getCurrentPosition(exito, fallo, opcionesRastreo);
};

rastrearUsuario();


// ==============================================================================
// BLOQUE 16: RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS DEL MÓDULO
// ==============================================================================
imprimirSeparador(16, "RESOLUCIÓN DE LOS 3 RETOS PRÁCTICOS (NIVELES 1, 2 Y 3)");

// --- RETO NIVEL 1 (Junior): Consulta Simple ---
console.log("--- RETO NIVEL 1 (Junior): Consulta Simple de Coordenadas ---");
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

// --- RETO NIVEL 3 (Producción): options y Enlace ---
console.log("\n--- RETO NIVEL 3 (Producción): Calibrador con options y Enlace ---");
const opcionesReto3 = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
        const url = `https://www.openstreetmap.org/#map=16/${coords.latitude}/${coords.longitude}`;
        console.log("Enlace Nivel 3 generado:", url);
    },
    err => console.warn(err.message),
    opcionesReto3
);

console.log("\n" + "=".repeat(78));
console.log("🎯 [FIN DEL LABORATORIO]: Módulo de Geolocation API completado.");
console.log("=".repeat(78) + "\n");
