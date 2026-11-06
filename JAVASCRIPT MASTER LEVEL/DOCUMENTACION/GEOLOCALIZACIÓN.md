# GUÍA COMPLETA — Geolocation API en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar el uso de la API nativa de Geolocalización en JavaScript, comprender la ejecución asíncrona de `getCurrentPosition()`, la gestión de callbacks de éxito y error, y la optimización de precisión mediante el objeto de configuración `options`.

---

# 📚 Temario

1. Introducción a la API de Geolocalización
2. El método `getCurrentPosition()`
3. Callback de Éxito: Objeto `position` y sus coordenadas
4. Callback de Error: Manejo de excepciones y códigos de error
5. Objeto de Configuración (`options`)
6. Parámetros de precisión: `enableHighAccuracy`, `timeout` y `maximumAge`
7. Analogías del mundo real
8. Diagrama de flujo de solicitud de ubicación
9. Buenas prácticas y errores comunes
10. Proyecto Integrador: Rastreador de Posición
11. Resumen técnico

---

# Introducción a la API de Geolocalización

La **Geolocation API** de HTML5 permite a las aplicaciones web acceder a la ubicación geográfica física del dispositivo del usuario (latitud, longitud, altitud, etc.). A diferencia de los métodos basados en resolución de direcciones IP en servidores, esta API consulta directamente fuentes de hardware y red del sistema del cliente (GPS, antenas de telefonía celular, redes Wi-Fi y dirección IP).

Para proteger la privacidad del usuario, la API implementa un modelo de seguridad estricto: **solo funciona en contextos seguros (HTTPS o localhost)** y requiere siempre el consentimiento explícito del usuario a través de un diálogo del navegador antes de emitir cualquier dato.

```javascript
// Verificación de soporte en el navegador
if ("geolocation" in navigator) {
    console.log("Geolocalización disponible");
} else {
    console.warn("Geolocalización no soportada en este entorno");
}
```

---

# El método `getCurrentPosition()`

El método principal para obtener la posición actual una sola vez es `navigator.geolocation.getCurrentPosition()`. Es una función asíncrona basada en funciones de retrollamada (*callbacks*) que acepta hasta tres parámetros:

```javascript
navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
```

* **`successCallback`** *(Obligatorio)*: Función que se invoca si el navegador obtiene con éxito las coordenadas geográficas.
* **`errorCallback`** *(Opcional, pero recomendado)*: Función que se ejecuta si el usuario rechaza los permisos o si el dispositivo no logra triangular la posición.
* **`options`** *(Opcional)*: Objeto JSON que permite personalizar la precisión, los límites de tiempo de espera y el ciclo de vida de la memoria caché.

---

# Callback de Éxito: El objeto `position`

Cuando la consulta concluye satisfactoriamente, el callback de éxito recibe un único argumento: un objeto de tipo `GeolocationPosition`. Este contiene dos propiedades principales: `coords` (métricas de ubicación) y `timestamp` (marca de tiempo en milisegundos).

```javascript
navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);
    console.log(`Precisión: ±${accuracy} metros`);
});
```

### Propiedades clave de `position.coords`
* **`latitude`**: Latitud decimal en grados.
* **`longitude`**: Longitud decimal en grados.
* **`accuracy`**: Nivel de precisión de la latitud y longitud, medido en metros.
* **`altitude`**: Altura sobre el nivel del mar en metros (o `null` si no está disponible).
* **`speed`**: Velocidad de desplazamiento horizontal en metros por segundo.

---

# Callback de Error: El objeto `error`

Si la solicitud falla o el usuario no da permiso, el callback de error recibe un objeto de tipo `GeolocationPositionError`. Este expone un código numérico (`error.code`) y un mensaje explicativo (`error.message`).

```javascript
navigator.geolocation.getCurrentPosition(
    (position) => console.log(position),
    (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("El usuario denegó el acceso a la ubicación.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("La ubicación no está disponible en este momento.");
                break;
            case error.TIMEOUT:
                console.error("Se agotó el tiempo de espera para obtener la ubicación.");
                break;
            default:
                console.error("Error desconocido:", error.message);
                break;
        }
    }
);
```

---

# Objeto de Configuración (`options`)

El tercer parámetro permite ajustar la conducta interna del motor de localización del dispositivo. Se define como un objeto estándar de JavaScript con tres propiedades configurables:

```javascript
const opciones = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
```

---

# Parámetros de `options`

### 1. `enableHighAccuracy` (Booleano)
* **Valor por defecto:** `false`
* **Propósito:** Indica si la aplicación desea obtener la mejor precisión posible. Cuando se establece en `true`, el navegador intentará activar el chip GPS del dispositivo móvil en lugar de conformarse con la triangulación rápida de redes Wi-Fi o IP.
* **Impacto:** Ofrece coordenadas mucho más exactas, pero incrementa el tiempo de respuesta y consume más batería.

### 2. `timeout` (Entero en milisegundos)
* **Valor por defecto:** `Infinity`
* **Propósito:** Define el tiempo máximo que la aplicación está dispuesta a esperar antes de abortar la búsqueda y disparar el callback de error con el código `TIMEOUT`.
* **Detalle técnico:** El temporizador empieza a contar únicamente **después** de que el usuario haya aceptado el diálogo de permisos.

### 3. `maximumAge` (Entero en milisegundos)
* **Valor por defecto:** `0`
* **Propósito:** Determina la antigüedad máxima permitida de una posición guardada en caché.
* **Comportamiento:** Si se define como `0`, el dispositivo se ve forzado a recalcular la posición en tiempo real. Si se pasa un valor como `60000` (1 minuto), el navegador reutilizará una posición previamente almacenada si esta tiene menos de un minuto de antigüedad.

---

# Analogías del mundo real

### 1. El Servicio de Mensajería y el GPS (`enableHighAccuracy`) 🛰️
* Con `enableHighAccuracy: false`, el repartidor solo pregunta en qué vecindario estás mirando el nombre de la estación de tren más cercana (rápido, pero aproximado a unas cuantas calles).
* Con `enableHighAccuracy: true`, el repartidor enciende un visor láser satelital para ubicar la puerta exacta de tu casa (toma más tiempo y gasta más energía).

### 2. El Mensaje de Texto con Vencimiento (`timeout` y `maximumAge`) ⏱️
* **`timeout`** es como esperar que un amigo te responda un mensaje con su ubicación: si no contesta en 10 segundos, asumes que no está disponible y sigues con tu plan.
* **`maximumAge`** es como mirar la última foto que te mandó: si la envió hace 2 minutos (`maximumAge > 0`), asumes que sigue en ese café; si necesitas saber dónde está en este segundo exacto (`maximumAge: 0`), le pides que te mande una foto nueva de inmediato.

---

# Diagrama de flujo de solicitud de ubicación

```
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
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Maneja siempre el callback de error:** Nunca omitas la función de error; de lo contrario, si el usuario bloquea el permiso, tu aplicación fallará silenciosamente sin retroalimentación visual.
* **Ajusta `maximumAge` para ahorrar recursos:** Si tu aplicación no necesita navegación paso a paso en tiempo real, define un `maximumAge` razonable (por ejemplo, de 1 a 5 minutos) para evitar encender el GPS innecesariamente.

### ❌ Errores Comunes
* **Confundir la sintaxis de las opciones:** Escribir erróneamente `enableHightAccuracy` en lugar de `enableHighAccuracy` (con terminación en `-gh` y no `-ght`), lo que provoca que el navegador ignore la propiedad y use el valor por defecto (`false`).
* **Ejecutar en entornos HTTP no seguros:** La API de Geolocalización es bloqueada de inmediato por los navegadores modernos si la página se sirve sobre conexiones HTTP estándar sin certificado SSL/TLS.

---

# Ejemplo práctico: Rastreador de Posición

A continuación se muestra una implementación completa que solicita la ubicación del usuario con alta precisión, gestiona todos los posibles errores y refleja las métricas en pantalla:

```html
<!-- Estructura HTML -->
<div class="panel-geolocalizacion">
    <button id="btn-localizar">Obtener Mi Ubicación</button>
    <div id="resultado" class="tarjeta-info">
        <p id="estado">Presiona el botón para consultar tu posición.</p>
    </div>
</div>
```

```javascript
// Lógica de JavaScript Moderno
const boton = document.getElementById("btn-localizar");
const estado = document.getElementById("estado");

const opcionesConfiguracion = {
    enableHighAccuracy: true, // Solicita la máxima precisión (GPS si está disponible)
    timeout: 8000,            // Espera como máximo 8 segundos
    maximumAge: 0             // No utiliza posiciones guardadas previamente
};

const onSuccess = ({ coords, timestamp }) => {
    const { latitude, longitude, accuracy } = coords;
    const fecha = new Date(timestamp).toLocaleTimeString();
    
    estado.innerHTML = `
        <strong>Coordenadas obtenidas:</strong><br>
        Latitud: ${latitude.toFixed(6)}°<br>
        Longitud: ${longitude.toFixed(6)}°<br>
        Precisión: ±${Math.round(accuracy)} metros<br>
        Hora de captura: ${fecha}
    `;
};

const onError = ({ code, message }) => {
    const tiposError = {
        1: "Permiso denegado por el usuario.",
        2: "No se pudo determinar la ubicación física.",
        3: "Se excedió el tiempo límite de espera."
    };
    
    estado.innerHTML = `<span style="color: red;">Error: ${tiposError[code] || message}</span>`;
};

boton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        estado.textContent = "La API de geolocalización no es compatible con este navegador.";
        return;
    }

    estado.textContent = "Buscando satélites y calculando posición...";
    navigator.geolocation.getCurrentPosition(onSuccess, onError, opcionesConfiguracion);
});
```

---

# Resumen técnico

* **`navigator.geolocation.getCurrentPosition()`** requiere al menos un callback de éxito y permite opcionalmente un callback de error y un objeto de opciones.
* **El objeto `position`** provee la latitud, longitud y margen de error (en metros) a través de su sub-objeto `coords`.
* **El objeto `error`** tipifica los fallos en tres códigos numéricos universales: `PERMISSION_DENIED` (1), `POSITION_UNAVAILABLE` (2) y `TIMEOUT` (3).
* **El objeto `options`** permite calibrar el rendimiento del hardware mediante `enableHighAccuracy` (prioriza precisión sobre batería), `timeout` (límite de espera) y `maximumAge` (reutilización de caché).
