# GUÍA COMPLETA — El Objeto `Navigator` en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar el objeto global `window.navigator` y sus interfaces principales en JavaScript para inspeccionar el entorno del navegador, idioma, estado de conexión, capacidades de hardware, permisos de almacenamiento y acceso a dispositivos multimedia.

---

# Introducción al objeto `Navigator`

El objeto **`navigator`** (accesible globalmente mediante `window.navigator` o simplemente `navigator`) forma parte del **BOM (*Browser Object Model*)** y representa el estado y la identidad del agente de usuario (*User Agent*), es decir, del navegador web y del dispositivo donde se está ejecutando la aplicación.

A nivel de especificación estándar (HTML Living Standard / W3C), el objeto `navigator` no es una sola pieza monolítica, sino que implementa múltiples **interfaces (*mixins*)** especializadas que agrupan propiedades y métodos según su propósito (red, hardware, idiomas, multimedia, etc.).

---

# 1. `NavigatorID` (Identificación del navegador)

La interfaz **`NavigatorID`** agrupa las propiedades históricas y modernas destinadas a identificar el navegador, su motor de renderizado y el sistema operativo subyacente.

* **`navigator.userAgent`:** Devuelve una cadena de texto (*string*) con información detallada sobre el navegador, versión y sistema operativo.
* **`navigator.platform`:** Indica la plataforma o sistema operativo sobre el que corre el navegador (ej. `"Win32"`, `"MacIntel"`, `"Linux x86_64"`). *(Nota: En proceso de obsolescencia en favor de `userAgentData`)*.
* **`navigator.appName` / `navigator.appVersion` / `navigator.product`:** Propiedades heredadas (*legacy*) que por razones de compatibilidad histórica suelen devolver valores genéricos como `"Netscape"` o `"Gecko"`.

```javascript
console.log("User Agent:", navigator.userAgent);
console.log("Plataforma:", navigator.platform);
```

> **Nota moderna:** Debido a problemas de privacidad (*fingerprinting*), los navegadores modernos están reduciendo la información expuesta en `userAgent` y promoviendo la API estructurada `navigator.userAgentData`.

---

# 2. `NavigatorLanguage` (Idiomas y localización)

La interfaz **`NavigatorLanguage`** permite conocer las preferencias de idioma configuradas por el usuario en su navegador, siendo fundamental para implementar internacionalización (**i18n**) automática.

* **`navigator.language`:** Devuelve una cadena con el idioma principal preferido del usuario según el estándar BCP 47 (ej. `"es-ES"`, `"es-CO"`, `"en-US"`).
* **`navigator.languages`:** Devuelve un arreglo de solo lectura (`ReadOnlyArray`) ordenado por prioridad con todos los idiomas configurados en el navegador (ej. `["es-CO", "es", "en-US", "en"]`).

```javascript
const idiomaPrincipal = navigator.language;
const listaIdiomas = navigator.languages;

console.log(`Idioma preferido: ${idiomaPrincipal}`);
console.log("Todos los idiomas:", listaIdiomas);
```

---

# 3. `NavigatorOnLine` (Estado de conectividad)

La interfaz **`NavigatorOnLine`** expone el estado de conexión de red del navegador y se complementa con eventos globales en `window` para reaccionar ante caídas o recuperaciones de internet.

* **`navigator.onLine`:** Propiedad booleana (`true` o `false`) que indica si el navegador tiene conexión con una red local o internet.

```javascript
console.log("¿Está conectado?", navigator.onLine);

// Escuchar cambios de conexión en tiempo real
window.addEventListener("online", () => {
    console.log("🟢 Conexión restablecida. Sincronizando datos...");
});

window.addEventListener("offline", () => {
    console.log("🔴 Sin conexión a internet. Activando modo offline.");
});
```

> **Advertencia técnica:** Que `navigator.onLine` sea `true` garantiza que el equipo está conectado a un router o red local, pero no asegura necesariamente salida real hacia servidores externos.

---

# 4. `NavigatorContentUtils` (Manejadores de protocolos)

La interfaz **`NavigatorContentUtils`** permite que una aplicación web se registre ante el sistema operativo o el navegador como el manejador predeterminado para ciertos esquemas de URL o protocolos personalizados.

* **`navigator.registerProtocolHandler(scheme, url)`:** Permite que una web abra enlaces especiales (por ejemplo, una app de correo web registrándose para abrir enlaces `mailto:` o protocolos personalizados con prefijo `web+`).

```javascript
// Registrar nuestra web para manejar enlaces personalizados web+factura://
if ("registerProtocolHandler" in navigator) {
    navigator.registerProtocolHandler(
        "web+factura",
        "https://miapp.com/procesar?url=%s"
    );
}
```

*(Nota: Requiere contexto seguro HTTPS, mismo origen y confirmación explícita del usuario).*

---

# 5. `NavigatorStorageUtils` (Almacenamiento y persistencia)

La interfaz **`NavigatorStorageUtils`** (y su evolución moderna en la **Storage API** mediante `navigator.storage`) proporciona utilidades para gestionar el espacio de almacenamiento local y evitar que el navegador borre datos críticos cuando quede poco espacio en disco.

* **`navigator.storage.estimate()`:** Retorna una promesa con la cuota total asignada (`quota`) y el espacio utilizado (`usage`) en bytes por el origen actual.
* **`navigator.storage.persist()`:** Solicita permiso al navegador para marcar el almacenamiento (IndexedDB, Cache API, LocalStorage) como **persistente**, evitando su limpieza automática.

```javascript
const revisarAlmacenamiento = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
        const { usage, quota } = await navigator.storage.estimate();
        const usadoMB = (usage / (1024 * 1024)).toFixed(2);
        const totalMB = (quota / (1024 * 1024)).toFixed(2);
        console.log(`Espacio usado: ${usadoMB} MB de ${totalMB} MB`);
    }
};
```

---

# 6. `NavigatorCookies` (Estado de las cookies)

La interfaz **`NavigatorCookies`** contiene una única propiedad booleana dedicada a verificar si el navegador tiene habilitado el uso de cookies en la sesión actual.

* **`navigator.cookieEnabled`:** Devuelve `true` si las cookies están activadas y pueden escribirse/leerse, o `false` si el usuario las ha bloqueado por completo desde la configuración de privacidad.

```javascript
if (!navigator.cookieEnabled) {
    console.warn("Cookies deshabilitadas: el inicio de sesión puede fallar.");
    // Mostrar aviso amigable en el DOM en lugar de bloquear con alert()
    const aviso = document.getElementById("aviso-cookies");
    if (aviso) aviso.textContent = "Por favor, habilita las cookies para iniciar sesión.";
}
```

---

# 7. `NavigatorConcurrentHardware` (Concurrencia y CPU)

La interfaz **`NavigatorConcurrentHardware`** permite consultar la capacidad de procesamiento paralelo del dispositivo del usuario sin comprometer su privacidad exacta.

* **`navigator.hardwareConcurrency`:** Devuelve un número entero con la cantidad de **procesadores lógicos (hilos/núcleos de CPU)** disponibles para ejecutar tareas simultáneas.

```javascript
const nucleos = navigator.hardwareConcurrency || 4;
console.log(`Hilos lógicos disponibles: ${nucleos}`);

// Uso típico: Crear un pool óptimo de Web Workers según la potencia del equipo
const cantidadWorkers = Math.max(1, nucleos - 1);
```

---

# 8. `NavigatorPlugins` (Plugins y tipos MIME)

La interfaz **`NavigatorPlugins`** expone información sobre los complementos (*plugins*) instalados y los tipos MIME que el navegador puede renderizar de forma nativa (como visores de PDF).

* **`navigator.pdfViewerEnabled`:** Propiedad moderna booleana que indica si el navegador soporta la visualización integrada de archivos PDF.
* **`navigator.plugins` / `navigator.mimeTypes`:** Colecciones históricas (*legacy*) que listaban extensiones binarias antiguas (como Flash o Java Applets). Hoy en día devuelven listas vacías o estandarizadas por seguridad.

```javascript
if (navigator.pdfViewerEnabled) {
    console.log("El navegador puede abrir documentos PDF directamente.");
}
```

---

# 9. `NavigatorUserMedia` (Captura de Audio y Video)

La interfaz **`NavigatorUserMedia`** (actualizada en el estándar moderno bajo **`navigator.mediaDevices`**) permite solicitar acceso a la cámara web, el micrófono o la pantalla compartida del usuario.

* **`navigator.mediaDevices.getUserMedia(constraints)`:** Método asíncrono que solicita permisos al usuario y devuelve una promesa con un objeto `MediaStream` listo para conectarse a una etiqueta `<video>` o `<audio>`.

```javascript
const iniciarCamara = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
        const videoEl = document.getElementById("camara-preview");
        videoEl.srcObject = stream;
    } catch (error) {
        console.error("Permiso denegado o cámara no disponible:", error.message);
    }
};
```

> **Requisito obligatorio:** Al igual que las notificaciones, `getUserMedia()` solo funciona bajo **HTTPS** o `localhost`.

---

# Analogías del mundo real

### 1. El Pasaporte y Ficha Técnica del Pasajero (`Navigator`) 🛂
* Cuando llegas a un aeropuerto internacional, tu pasaporte indica tu nacionalidad e idioma (`NavigatorLanguage`), tu estado de tránsito (`NavigatorOnLine`), las visas o permisos especiales que portas (`NavigatorCookies` / `NavigatorStorageUtils`) y tu equipaje autorizado (`NavigatorUserMedia`). La aplicación web lee esa ficha para adaptar la experiencia a tu perfil.

### 2. El Tablero de Instrumentos de un Vehículo (`hardwareConcurrency` y `onLine`) 🚗
* Antes de acelerar en una autopista, miras el tablero para saber cuántos cilindros tiene el motor (`hardwareConcurrency`) y si tienes señal GPS activa (`onLine`). Así decides si puedes ejecutar procesos pesados en paralelo o si debes guardar tus avances localmente hasta recuperar señal.

---

# Diagrama de arquitectura del objeto `Navigator`

```
                       [ window.navigator ]
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
[ Identidad & Red ]     [ Hardware & Datos ]    [ Multimedia & Web ]
        │                       │                       │
 ├─ NavigatorID          ├─ ConcurrentHardware   ├─ NavigatorUserMedia
 │   └─ userAgent        │   └─ hardwareConcurrency   └─ mediaDevices
 │   └─ platform         │                       │
 ├─ NavigatorLanguage    ├─ NavigatorCookies     ├─ NavigatorContentUtils
 │   └─ language         │   └─ cookieEnabled    │   └─ registerProtocolHandler
 │   └─ languages        │                       │
 └─ NavigatorOnLine      ├─ StorageUtils         └─ NavigatorPlugins
     └─ onLine           │   └─ storage.estimate()   └─ pdfViewerEnabled
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Detección de características (*Feature Detection*) en lugar de *User-Agent Sniffing*:** Nunca escribas `if (navigator.userAgent.includes("Chrome"))` para habilitar funciones. Verifica directamente si la API existe (`if ("mediaDevices" in navigator)`).
* **Detén los flujos multimedia al terminar:** Cuando uses `getUserMedia()`, recorre las pistas (`stream.getTracks().forEach(track => track.stop())`) al cerrar el modal o componente para apagar la luz física de la cámara del usuario.
* **Proporciona valores de respaldo (*fallbacks*):** Propiedades como `navigator.hardwareConcurrency` pueden devolver `undefined` en navegadores muy antiguos o configuraciones restrictivas; usa siempre un valor por defecto (`navigator.hardwareConcurrency || 2`).

### ❌ Errores Comunes
* **Confiar ciegamente en `navigator.onLine` para peticiones críticas:** Si el usuario está conectado a una red Wi-Fi sin acceso a internet, `onLine` seguirá siendo `true`. Combínalo siempre con bloques `try / catch` en tus llamadas `fetch()`.
* **Intentar usar `navigator.getUserMedia` antiguo directamente:** La sintaxis antigua con *callbacks* (`navigator.getUserMedia(...)`) está obsoleta; utiliza siempre la promesa moderna `navigator.mediaDevices.getUserMedia(...)`.

---

# Proyecto Integrador: Panel de Diagnóstico del Entorno

A continuación se presenta un ejemplo práctico que inspecciona todas las interfaces del objeto `navigator` estudiadas y muestra un reporte técnico en pantalla:

```html
<!-- Estructura HTML -->
<div class="panel-diagnostico">
    <h2>Diagnóstico del Navegador</h2>
    <ul id="lista-info"></ul>
    <button id="btn-probar-camara">Probar Acceso a Cámara</button>
    <video id="vista-previa" autoplay muted playsinline width="300"></video>
</div>
```

```javascript
// Lógica de JavaScript Moderno
const listaInfo = document.getElementById("lista-info");
const btnCamara = document.getElementById("btn-probar-camara");
const videoPreview = document.getElementById("vista-previa");

const generarReporteNavigator = async () => {
    // 1. Consulta de almacenamiento asíncrona
    let infoAlmacenamiento = "No soportado";
    if (navigator.storage && navigator.storage.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        infoAlmacenamiento = `${(usage / 1e6).toFixed(2)} MB usados de ${(quota / 1e9).toFixed(2)} GB`;
    }

    // 2. Recopilación de interfaces de Navigator
    const datos = [
        { etiqueta: "Navegador (User Agent)", valor: navigator.userAgent },
        { etiqueta: "Idioma Principal", valor: `${navigator.language} (Lista: ${navigator.languages.join(", ")})` },
        { etiqueta: "Estado de Red", valor: navigator.onLine ? "🟢 En línea" : "🔴 Sin conexión" },
        { etiqueta: "Cookies Habilitadas", valor: navigator.cookieEnabled ? "Sí" : "No" },
        { etiqueta: "Núcleos Lógicos (CPU)", valor: `${navigator.hardwareConcurrency || "Desconocido"} hilos` },
        { etiqueta: "Visor PDF Nativo", valor: navigator.pdfViewerEnabled ? "Soportado" : "No soportado" },
        { etiqueta: "Cuota de Almacenamiento", valor: infoAlmacenamiento }
    ];

    listaInfo.innerHTML = datos
        .map(item => `<li><strong>${item.etiqueta}:</strong> ${item.valor}</li>`)
        .join("");
};

// 3. Prueba de NavigatorUserMedia (mediaDevices)
btnCamara.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoPreview.srcObject = stream;
    } catch (err) {
        console.error(`No se pudo acceder a la cámara: ${err.name}`);
        listaInfo.insertAdjacentHTML("beforeend", `<li>⚠️ Cámara: ${err.name}</li>`);
    }
});

// Inicializar diagnóstico
generarReporteNavigator();
```

---

# Resumen técnico

* **El objeto `window.navigator`** implementa múltiples interfaces estándar (`NavigatorID`, `NavigatorLanguage`, `NavigatorOnLine`, `NavigatorCookies`, `NavigatorConcurrentHardware`, `NavigatorPlugins`, `NavigatorContentUtils`, `NavigatorStorageUtils` y `NavigatorUserMedia`).
* **La detección de entorno** permite adaptar el idioma (`navigator.language`), gestionar el modo sin conexión (`navigator.onLine`) y dimensionar procesos paralelos según la CPU (`navigator.hardwareConcurrency`).
* **Las capacidades avanzadas** como la persistencia de datos (`navigator.storage`) y la captura audiovisual (`navigator.mediaDevices.getUserMedia`) operan de forma asíncrona mediante Promesas y exigen contextos seguros (**HTTPS**).


---

# 10. APIs Modernas Adicionales en `navigator`

Además de las interfaces clásicas, los navegadores modernos exponen utilidades esenciales directamente bajo `navigator`:

### 1. Portapapeles Asíncrono (`navigator.clipboard`)
Permite leer y escribir texto en el portapapeles del sistema de forma segura (reemplaza al obsoleto `document.execCommand("copy")`).
```javascript
// Copiar texto al portapapeles tras un clic
await navigator.clipboard.writeText("Texto copiado desde Master Level");
```

### 2. Compartir Nativo (`navigator.share()`)
Abre la hoja de compartir nativa del sistema operativo (WhatsApp, correo, AirDrop, etc.) en dispositivos móviles y navegadores compatibles.
```javascript
if (navigator.share) {
    await navigator.share({
        title: "Curso JavaScript Master Level",
        text: "Aprende el objeto Navigator paso a paso",
        url: window.location.href
    });
}
```

### 3. Consulta de Permisos (`navigator.permissions.query()`)
Permite inspeccionar sin mostrar ventanas emergentes si un permiso (`"geolocation"`, `"notifications"`, `"camera"`, `"microphone"`) está en `"granted"`, `"prompt"` o `"denied"`.
```javascript
const estado = await navigator.permissions.query({ name: "notifications" });
console.log("Permiso actual:", estado.state);
```

### 4. Información de Red (`navigator.connection`)
La **Network Information API** permite adaptar la experiencia (calidad de imágenes, precarga de videos o modo ahorro de datos) según la conexión real del usuario:
```javascript
if ("connection" in navigator) {
    const conn = navigator.connection;
    console.log("Tipo efectivo:", conn.effectiveType); // "4g", "3g", "2g", "slow-2g"
    console.log("Ancho de banda estimado (Mbps):", conn.downlink);
    console.log("Ahorro de datos activo:", conn.saveData);

    conn.addEventListener("change", () => {
        console.log("La calidad de red cambió a:", conn.effectiveType);
    });
}
```

### 5. Client Hints (`navigator.userAgentData`) frente al clásico `userAgent`
Debido a la reducción del *User-Agent* para evitar el rastreo (*fingerprinting*), `navigator.userAgent` se encuentra congelado/reducido en navegadores modernos. Su reemplazo estructurado es **`navigator.userAgentData`**:
```javascript
if (navigator.userAgentData) {
    console.log("¿Es móvil?", navigator.userAgentData.mobile);
    console.log("Plataforma:", navigator.userAgentData.platform);
    console.log("Marcas:", navigator.userAgentData.brands);

    // Datos de alta entropía (asíncrono)
    navigator.userAgentData
        .getHighEntropyValues(["platformVersion", "architecture"])
        .then((ua) => console.log("Detalles avanzados:", ua));
}
```

### 6. Telemetría confiable al salir (`navigator.sendBeacon()`)
Cuando un usuario cierra la pestaña o navega a otra página, las peticiones `fetch()` tradicionales suelen cancelarse. **`navigator.sendBeacon(url, data)`** envía datos analíticos o registros en segundo plano de forma asíncrona y garantizada, sin bloquear la descarga de la página:
```javascript
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && "sendBeacon" in navigator) {
        const payload = JSON.stringify({ evento: "salida", timestamp: Date.now() });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
    }
});
```

### 7. Dispositivos y Compartir Pantalla (`navigator.mediaDevices`)
Además de `getUserMedia()`, `navigator.mediaDevices` incluye:
* **`enumerateDevices()`:** Lista cámaras, micrófonos y altavoces conectados (los nombres detallados requieren permiso previo).
* **`getDisplayMedia()`:** Solicita al usuario compartir una pestaña, ventana o pantalla completa.

---

# Ejercicios

## Nivel 1
Crea una función `mostrarIdiomaYRed()` que imprima en consola el idioma principal del navegador (`navigator.language`) y si el usuario está conectado (`navigator.onLine ? "En línea" : "Sin conexión"`).

## Nivel 2
Implementa una función asíncrona `copiarTextoSeguro(texto)` que verifique mediante *Feature Detection* si `navigator.clipboard` existe. Si está disponible, copia el texto usando `writeText(texto)` dentro de un `try...catch` y muestra `"Texto copiado"` en consola.

## Nivel 3
Crea una función `dimensionarWorkers()` que lea `navigator.hardwareConcurrency` con un valor de respaldo de `2`. Si el equipo tiene `4` o más núcleos, retorna `nucleos - 1`; de lo contrario, retorna `1`. Además, consulta `navigator.storage.estimate()` si existe para mostrar el porcentaje de espacio usado.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
const mostrarIdiomaYRed = () => {
    console.log("Idioma:", navigator.language);
    console.log("Estado:", navigator.onLine ? "En línea" : "Sin conexión");
};
mostrarIdiomaYRed();
```

## Solución Nivel 2
```javascript
const copiarTextoSeguro = async (texto) => {
    if (!("clipboard" in navigator)) {
        console.warn("Clipboard API no soportada en este contexto.");
        return;
    }
    try {
        await navigator.clipboard.writeText(texto);
        console.log("✅ Texto copiado al portapapeles.");
    } catch (error) {
        console.error("❌ No se pudo copiar:", error.message);
    }
};
```

## Solución Nivel 3
```javascript
const dimensionarWorkers = async () => {
    const nucleos = navigator.hardwareConcurrency || 2;
    const workers = nucleos >= 4 ? nucleos - 1 : 1;
    console.log(`Núcleos: ${nucleos} | Workers recomendados: ${workers}`);

    if (navigator.storage?.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        const pct = ((usage / quota) * 100).toFixed(4);
        console.log(`Almacenamiento usado: ${pct}%`);
    }
    return workers;
};
```

---

# Hoja de Trucos (Cheatsheet)

| Propiedad / Método | Tipo | Propósito | Requiere HTTPS |
| :--- | :--- | :--- | :--- |
| `navigator.language` / `languages` | String / Array | Idioma principal (BCP 47) y preferencias | No |
| `navigator.onLine` | Boolean | Estado de conexión a red local | No |
| `navigator.cookieEnabled` | Boolean | Si las cookies están activas | No |
| `navigator.hardwareConcurrency` | Number | Hilos lógicos de CPU | No |
| `navigator.userAgentData` | Object | Client Hints estructurados (reemplaza `userAgent`) | Sí |
| `navigator.connection` | Object | Calidad de red (`effectiveType`, `downlink`, `saveData`) | No |
| `navigator.clipboard.writeText()` | Promise | Copiar texto al portapapeles | Sí |
| `navigator.share()` | Promise | Hoja nativa de compartir del SO | Sí |
| `navigator.permissions.query()` | Promise | Consultar estado de permisos sin prompt | Sí |
| `navigator.sendBeacon()` | Boolean | Enviar telemetría confiable al cerrar/ocultar página | No |
| `navigator.storage.estimate()` | Promise | Uso y cuota de almacenamiento | Sí |
| `navigator.mediaDevices.getUserMedia()` | Promise | Acceso a cámara y micrófono (y `getDisplayMedia()`) | Sí |
