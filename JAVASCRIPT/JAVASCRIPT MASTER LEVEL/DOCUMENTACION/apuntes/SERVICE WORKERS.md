# GUÍA COMPLETA — Service Workers en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de **Service Workers** en JavaScript para interceptar peticiones de red, gestionar el ciclo de vida del trabajador en segundo plano, establecer comunicación bidireccional mediante `postMessage()` y construir aplicaciones web capaces de funcionar sin conexión a internet (*Offline-First* / PWA).

---

# ¿Qué es un Service Worker y la interfaz `ServiceWorker`?

Un **Service Worker** es un tipo especializado de *Web Worker* que actúa como un **proxy programable de red** situado entre tu aplicación web, el navegador y la red (internet). Se ejecuta en un hilo independiente al hilo principal de la interfaz de usuario, por lo que no bloquea el DOM ni las interacciones del usuario.

### Características de la interfaz `ServiceWorker`
* **Sin acceso directo al DOM:** Al correr en un hilo secundario, no puede manipular etiquetas HTML ni acceder a `window` o `localStorage`. Su contexto global se referencia mediante `self`.
* **Orientado a eventos:** Permanece inactivo (dormido) para ahorrar memoria y se despierta únicamente cuando ocurre un evento relevante (`install`, `activate`, `fetch`, `message`, `push`).
* **Requisito estricto de HTTPS:** Por seguridad (ya que puede interceptar y modificar cualquier petición de red), solo funciona bajo protocolos seguros **HTTPS** o en entornos locales (`localhost` / `127.0.0.1`).
* **Persistencia:** A diferencia de un *Dedicated Worker* que muere al cerrar la pestaña, el Service Worker permanece registrado en el navegador incluso después de cerrar la página.

---

# Ciclo de vida (*Service Worker Lifecycle*)

El ciclo de vida de un Service Worker está diseñado para garantizar que una aplicación web se actualice sin romper las pestañas que el usuario ya tiene abiertas. Consta de tres fases principales:

### 1. Registro (*Registration*)
El script principal de la página (`app.js`) le indica al navegador dónde se encuentra el archivo del Service Worker (`sw.js`). El navegador lo descarga y lo analiza en segundo plano.

### 2. Instalación (`install`)
Se dispara una única vez cuando el Service Worker es nuevo o cuando el navegador detecta cambios byte a byte en el archivo `sw.js`.
* **Uso principal:** Es el momento ideal para abrir la **Cache API** y descargar los archivos estáticos esenciales de la aplicación (*App Shell*: HTML, CSS, JS, logotipos).
* **`event.waitUntil()`:** Se utiliza dentro de este evento para indicarle al navegador que no dé por terminada la instalación hasta que todos los archivos se hayan guardado en caché con éxito.

### 3. Activación (`activate`)
Una vez instalado, el Service Worker espera a que no queden pestañas abiertas controladas por una versión anterior. Cuando toma el control, dispara el evento `activate`.
* **Uso principal:** Eliminar cachés antiguos de versiones previas para liberar espacio de almacenamiento y reclamar el control inmediato de los clientes activos (`self.clients.claim()`).

> **Estados internos de `ServiceWorker.state`:** A lo largo de este proceso, la instancia transita por los estados `"parsed"`, `"installing"`, `"installed"` (en espera), `"activating"`, `"activated"` y `"redundant"`.

---

# Registrar un Service Worker con `register()`

El registro se realiza desde el archivo JavaScript principal de la aplicación utilizando el método **`navigator.serviceWorker.register(url, options)`**, el cual devuelve una **Promesa** que resuelve con un objeto `ServiceWorkerRegistration`.

```javascript
// En tu archivo principal: main.js o app.js
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registro = await navigator.serviceWorker.register("/sw.js", {
                scope: "/" // Define el alcance de rutas que controlará el SW
            });
            console.log("Service Worker registrado con éxito. Alcance:", registro.scope);
        } catch (error) {
            console.error("Error al registrar el Service Worker:", error);
        }
    });
}
```

### El concepto de Alcance (*Scope*)
* Por defecto, el `scope` de un Service Worker está determinado por la carpeta donde reside el archivo. Si `sw.js` está en la raíz (`/sw.js`), controlará todo el dominio (`/`). Si está en `/js/sw.js`, solo podrá interceptar peticiones dentro de `/js/`.

---

# Comunicación bidireccional con `postMessage()`

Dado que el Service Worker y la página web viven en hilos aislados, se comunican enviando mensajes estructurados mediante el método **`postMessage()`** y escuchando el evento **`message`**.

### 1. Enviar mensaje desde la Página hacia el Service Worker
```javascript
// En main.js
if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
        accion: "LIMPIAR_CACHE",
        payload: "cache-v1"
    });
}

// Escuchar respuestas provenientes del Service Worker
navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Respuesta recibida del Service Worker:", event.data);
});
```

### 2. Recibir y responder mensajes dentro del Service Worker
```javascript
// En sw.js
self.addEventListener("message", (event) => {
    console.log("Mensaje recibido desde la página:", event.data);

    if (event.data.accion === "LIMPIAR_CACHE") {
        // Responder de vuelta al cliente (pestaña) que envió el mensaje
        event.source.postMessage({
            estado: "OK",
            detalle: `Caché ${event.data.payload} procesada correctamente`
        });
    }
});
```

---

# Interceptación de peticiones: El evento `fetch`

Una vez que el Service Worker está **activo**, actúa como un intermediario de red: cada vez que la página solicita un recurso (una imagen, una hoja de estilos, un documento HTML o una petición `fetch()` a una API), se dispara el evento **`fetch`** dentro de `sw.js`.

El método clave de este evento es **`event.respondWith(promesa)`**, el cual secuestra la petición original del navegador y le entrega la respuesta que nosotros programemos (desde la caché, desde la red o una respuesta generada dinámicamente).

```javascript
// En sw.js
self.addEventListener("fetch", (event) => {
    console.log("Interceptando petición hacia:", event.request.url);

    // Estrategia básica: Buscar en caché; si no existe, ir a internet
    event.respondWith(
        caches.match(event.request).then((respuestaCache) => {
            return respuestaCache || fetch(event.request);
        })
    );
});
```

---

# Registrar Caché y mostrar sitio web *offline*

Combinando los eventos **`install`**, **`activate`** y **`fetch`** junto con la **Cache API (`caches`)**, logramos que el sitio web cargue instantáneamente y siga funcionando cuando el usuario pierde la conexión a internet.

### Flujo completo para soporte *Offline*:
1. **Durante `install`:** Se define un nombre de caché versionado (ej. `"sitio-static-v1"`) y se almacenan todos los recursos críticos usando `cache.addAll()`.
2. **Durante `activate`:** Se recorren todas las claves de `caches.keys()` y se eliminan aquellas que no coincidan con la versión actual.
3. **Durante `fetch`:** Se intercepta cada solicitud; si el recurso está en caché se sirve de inmediato; si falla la red (modo *offline*) y el usuario navega a una página no guardada, se entrega una página de respaldo (`offline.html`).

---

# Analogías del mundo real

### 1. El Recepcionista Inteligente de un Hotel (`fetch` y Caché) 🛎️
* Cuando un huésped (el navegador) pide una toalla o un mapa de la ciudad (`fetch`), el recepcionista (el Service Worker) revisa primero el armario que tiene justo detrás de su mostrador (**Cache API**). Si lo tiene ahí, se lo entrega en un segundo sin hacer esperar al huésped. Solo si no está en el armario, llama a la lavandería externa (**Internet**). Si se corta la línea telefónica (*Offline*), el recepcionista sigue atendiendo con todo lo que tiene guardado en su armario.

### 2. El Relevo de Guardia (`install` → `activate`) 🔄
* Cuando llega un guardia nuevo (`sw.js` actualizado), primero recibe el inventario y aprende las reglas (**`install`**). No puede echar a empujones al guardia anterior mientras este sigue atendiendo a un visitante en la puerta; espera a que el turno quede libre para asumir el puesto (**`activate`**) y archivar las bitácoras viejas.

---

# Diagrama de flujo del ciclo de vida y modo *Offline*

```
   [ Navegador carga main.js ]
                │
                ▼
  ( navigator.serviceWorker.register("/sw.js") )
                │
                ▼
     ┌─────────────────────┐
     │  Evento: "install"  │ ──► Abre caché y guarda archivos estáticos (cache.addAll)
     └──────────┬──────────┘
                │
                ▼
     ┌─────────────────────┐
     │ Evento: "activate"  │ ──► Elimina versiones antiguas de caché (caches.delete)
     └──────────┬──────────┘
                │
                ▼
   [ Service Worker ACTIVO controlando la página ]
                │
                ▼
   ( Usuario navega o pide recursos ──► Evento: "fetch" )
                │
                ▼
     ¿Existe el recurso en Cache API?
                │
        ┌───────┴───────┐
        ▼               ▼
     [ SÍ ]           [ NO ]
        │               │
        ▼               ▼
  Devuelve desde   Intenta descargar de Internet (fetch)
  Caché (Rápido)        │
                ┌───────┴───────┐
                ▼               ▼
           [ Con Red ]     [ Sin Red (Offline) ]
                │               │
                ▼               ▼
         Entrega recurso   Entrega página de respaldo
           de la red         (ej. /offline.html)
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Versiona siempre el nombre de tu caché:** Utiliza nombres como `"app-shell-v1"`, `"app-shell-v2"`. Cambiar el nombre en `sw.js` modifica el archivo byte a byte, lo que dispara automáticamente la actualización del Service Worker en los navegadores de tus usuarios.
* **No guardes el propio `sw.js` en caché:** El navegador debe poder consultar siempre la versión más reciente de `sw.js` en el servidor para detectar actualizaciones.
* **Usa `self.skipWaiting()` con precaución:** Permite que un Service Worker nuevo pase de `installed` a `activated` sin esperar a que el usuario cierre las pestañas abiertas, ideal cuando despliegas correcciones críticas.

### ❌ Errores Comunes
* **Intentar usar `localStorage` o `document` dentro de `sw.js`:** Ambos son síncronos y exclusivos del hilo principal; usarlos dentro de un Service Worker lanzará un error de referencia (`ReferenceError`).
* **Olvidar `event.waitUntil()` en `install` o `activate`:** Si no envuelves las promesas de caché dentro de `waitUntil()`, el navegador puede dormir o terminar el Service Worker antes de que termine de guardar los archivos.
* **Cachear peticiones `POST` o de extensiones:** `cache.put()` solo admite peticiones con método `GET` y esquemas `http://` o `https://`. Intentar cachear peticiones `chrome-extension://` generará errores en consola.

---

# Proyecto Integrador: Sitio Web con Soporte *Offline*

A continuación se presenta la estructura completa dividida en los dos archivos necesarios: el controlador principal en el cliente (`app.js`) y el trabajador en segundo plano (`sw.js`).

### 1. Archivo Cliente (`app.js`)
```javascript
// Registro y comunicación con el Service Worker
const registrarServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
        console.warn("Este navegador no soporta Service Workers.");
        return;
    }

    try {
        const registro = await navigator.serviceWorker.register("./sw.js");
        console.log("Service Worker registrado:", registro.scope);

        // Escuchar mensajes enviados desde el Service Worker
        navigator.serviceWorker.addEventListener("message", ({ data }) => {
            console.log("[Mensaje del SW]:", data);
        });
    } catch (error) {
        console.error("Fallo en el registro del SW:", error);
    }
};

// Función para enviar orden al Service Worker activo
const solicitarVersionSW = () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ tipo: "OBTENER_VERSION" });
    }
};

window.addEventListener("load", registrarServiceWorker);
```

### 2. Archivo Service Worker (`sw.js`)
```javascript
const NOMBRE_CACHE = "mi-sitio-offline-v1";
const ARCHIVOS_ESTATICOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./offline.html"
];

// 1. INSTALACIÓN: Almacenar recursos esenciales en caché
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(NOMBRE_CACHE).then((cache) => {
            console.log("[SW] Precargando archivos en caché...");
            return cache.addAll(ARCHIVOS_ESTATICOS);
        })
    );
});

// 2. ACTIVACIÓN: Limpiar cachés de versiones anteriores
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((nombresCaches) => {
            return Promise.all(
                nombresCaches.map((cache) => {
                    if (cache !== NOMBRE_CACHE) {
                        console.log("[SW] Eliminando caché obsoleta:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. INTERCEPTACIÓN DE RED (FETCH): Estrategia Cache-First con respaldo Offline
self.addEventListener("fetch", (event) => {
    // Solo interceptamos peticiones GET
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((respuestaEnCache) => {
            // Si está en caché, lo devolvemos de inmediato
            if (respuestaEnCache) return respuestaEnCache;

            // Si no está, vamos a la red
            return fetch(event.request).catch(() => {
                // Si no hay internet y el usuario pide una página HTML, mostramos offline.html
                if (event.request.headers.get("accept")?.includes("text/html")) {
                    return caches.match("./offline.html");
                }
            });
        })
    );
});

// 4. COMUNICACIÓN: Escuchar y responder mensajes con postMessage()
self.addEventListener("message", (event) => {
    if (event.data?.tipo === "OBTENER_VERSION") {
        event.source.postMessage({
            version: NOMBRE_CACHE,
            estado: "Activo y listo para modo offline"
        });
    }
});
```

---

# Resumen técnico

* **La interfaz `ServiceWorker`** ejecuta scripts en segundo plano fuera del hilo principal, operando bajo HTTPS como un proxy programable sin acceso directo al DOM.
* **El ciclo de vida** atraviesa las fases de **registro** (`navigator.serviceWorker.register()`), **instalación** (`install`) y **activación** (`activate`), asegurando transiciones limpias entre versiones.
* **El método `postMessage()`** junto con el evento `message` habilita la comunicación bidireccional de datos entre las pestañas abiertas y el Service Worker.
* **El evento `fetch`** permite interceptar solicitudes con `event.respondWith()` para servir activos previamente guardados en la **Cache API** y ofrecer experiencias completamente funcionales sin conexión a internet.


---

# Conceptos Complementarios: `skipWaiting()`, `clients.claim()`, `push` y `sync`

### 1. Actualización inmediata (`self.skipWaiting()` y `self.clients.claim()`)
* **`self.skipWaiting()` (en `install`):** Fuerza al nuevo Service Worker a activarse de inmediato sin esperar a que el usuario cierre todas las pestañas abiertas.
* **`self.clients.claim()` (en `activate`):** Permite que el Service Worker recién activado tome el control inmediato de las pestañas abiertas sin esperar una recarga.

### 2. Eventos avanzados en segundo plano
* **`push`:** Recibe notificaciones *push* enviadas desde un servidor incluso cuando la aplicación web está completamente cerrada.
* **`sync` (*Background Sync*):** Pospone una acción (como enviar un formulario sin conexión) y la ejecuta automáticamente apenas el dispositivo recupera internet.

---

# Ejercicios

## Nivel 1
Escribe el bloque de registro seguro de un Service Worker (`./sw.js`) verificando `"serviceWorker" in navigator` dentro del evento `load` de `window`.

## Nivel 2
Implementa dentro de `sw.js` el evento `install` guardando `["./", "./index.html", "./style.css"]` en `"mi-app-v1"` usando `event.waitUntil()`, y el evento `activate` eliminando cachés antiguas.

## Nivel 3
Implementa comunicación bidireccional: desde `main.js` envía `{ tipo: "PING" }` con `postMessage()`, y desde `sw.js` responde con `event.source.postMessage({ respuesta: "PONG" })`.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        const reg = await navigator.serviceWorker.register("./sw.js");
        console.log("SW registrado con alcance:", reg.scope);
    });
}
```

## Solución Nivel 2
```javascript
const CACHE = "mi-app-v1";
self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html", "./style.css"])));
});
self.addEventListener("activate", (e) => {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => k !== CACHE ? caches.delete(k) : null))));
});
```

## Solución Nivel 3
```javascript
// En sw.js:
self.addEventListener("message", (e) => {
    if (e.data?.tipo === "PING") e.source.postMessage({ respuesta: "PONG" });
});

// En main.js:
navigator.serviceWorker.addEventListener("message", (e) => console.log(e.data));
navigator.serviceWorker.controller?.postMessage({ tipo: "PING" });
```

---

# Hoja de Trucos (Cheatsheet)

| Elemento / Evento | Contexto | Propósito |
| :--- | :--- | :--- |
| `navigator.serviceWorker.register(url)` | Página (`main.js`) | Registra el Service Worker (requiere HTTPS/localhost) |
| `install` + `event.waitUntil()` | `sw.js` | Precarga el *App Shell* en Cache API |
| `activate` + `caches.delete()` | `sw.js` | Limpia cachés viejas y toma el control (`clients.claim()`) |
| `fetch` + `event.respondWith()` | `sw.js` | Intercepta peticiones de red para servir caché u *offline* |
| `postMessage()` + `message` | Ambos | Comunicación bidireccional entre página y Service Worker |
