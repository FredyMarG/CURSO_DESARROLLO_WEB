# GUÍA COMPLETA — Cache API (`caches`) en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de Caché (`Cache` y `CacheStorage`) en JavaScript para interceptar, almacenar, recuperar y eliminar pares de objetos `Request` y `Response`, permitiendo construir aplicaciones web ultrarrápidas y funcionales sin conexión (*Offline-First*).

---

# 📚 Temario

1. Definición: ¿Qué es la Cache API?
2. Principales usos en el desarrollo web moderno
3. Apertura y gestión de almacenes (`caches.open()`)
4. Almacenar información (`add()`, `addAll()`, `put()`)
5. Consultar información almacenada (`match()`, `matchAll()`, `keys()`)
6. Eliminar información (`cache.delete()`, `caches.delete()`)
7. Analogías del mundo real
8. Diagrama de flujo del ciclo de caché
9. Buenas prácticas y errores comunes
10. Proyecto Integrador: Gestor de Recursos Offline
11. Resumen técnico

---

# Definición

La **Cache API** (expuesta globalmente a través del objeto **`caches`** o `window.caches`) es un sistema de almacenamiento persistente diseñado específicamente para guardar y recuperar pares de solicitudes de red (**`Request`**) y sus correspondientes respuestas HTTP (**`Response`**).

A diferencia de `localStorage` o `sessionStorage` (que solo almacenan cadenas de texto simples de forma síncrona y con un límite aproximado de 5 MB), la Cache API opera de forma **100% asíncrona mediante Promesas**, soporta archivos binarios completos (HTML, CSS, JS, imágenes, fuentes, JSON) y puede almacenar cientos de megabytes dependiendo del espacio disponible en el dispositivo.

> **Disponibilidad:** Está disponible tanto en el hilo principal (`window.caches`) como dentro de los **Service Workers** (`self.caches`), y requiere un **contexto seguro (HTTPS o `localhost`)**.

---

# Principales usos

El almacenamiento programático en caché permite controlar con precisión cómo responde una aplicación ante la red:

### 1. Aplicaciones Web Progresivas (*PWA*) y modo *Offline* 📴
* Guardar los archivos estáticos esenciales (*App Shell*: `index.html`, `styles.css`, `app.js`, logotipos) para que la aplicación cargue instantáneamente incluso cuando el usuario no tiene conexión a internet.

### 2. Aceleración de rendimiento (*Cache-First*) ⚡
* Servir recursos pesados (fuentes tipográficas, iconos, hojas de estilo o catálogos que cambian poco) directamente desde el disco local en milisegundos, evitando latencia de red y ahorrando datos móviles.

### 3. Almacenamiento de respuestas de APIs 🌐
* Guardar respuestas `GET` de servicios REST o GraphQL para mostrar contenido reciente de inmediato mientras se actualiza en segundo plano (*Stale-While-Revalidate*).

### 4. Precarga inteligente de contenido 📦
* Descargar en segundo plano recursos que el usuario probablemente necesitará a continuación (por ejemplo, los capítulos siguientes de un curso o activos de un nivel en un videojuego web).

---

# Apertura y gestión de almacenes (`caches.open()`)

Antes de guardar o borrar archivos, es necesario abrir un espacio de almacenamiento con nombre (similar a abrir una carpeta o tabla) utilizando **`caches.open(nombreCache)`**. Si el almacén no existe, el navegador lo crea automáticamente.

```javascript
// Abrir o crear un almacén de caché con versión
const iniciarCache = async () => {
    const cache = await caches.open("mi-app-v1");
    console.log("Caché abierta y lista:", cache);
};
```

---

# Almacenar información

Una vez abierta la instancia de `cache`, existen **tres métodos principales** para guardar recursos dentro de ella:

### 1. `cache.add(request)`
Recibe una URL (o un objeto `Request`), realiza automáticamente la petición `fetch()` a la red y guarda tanto la solicitud como la respuesta resultante en la caché. Si la descarga falla (por ejemplo, error 404 o sin red), la promesa es rechazada y no guarda nada.

```javascript
const guardarUnRecurso = async () => {
    const cache = await caches.open("mi-app-v1");
    await cache.add("/estilos/principal.css");
};
```

### 2. `cache.addAll(requests)`
Recibe un arreglo (*Array*) de URLs, las descarga todas en paralelo y las almacena en bloque. Es **atómico**: si tan solo uno de los archivos falla al descargarse, **ninguno** se guarda en la caché.

```javascript
const precargarAppShell = async () => {
    const cache = await caches.open("mi-app-v1");
    const recursos = [
        "/",
        "/index.html",
        "/css/estilos.css",
        "/js/app.js",
        "/img/logo.png"
    ];

    await cache.addAll(recursos);
    console.log("Todos los recursos base fueron almacenados.");
};
```

### 3. `cache.put(request, response)`
Permite almacenar manualmente un par `Request` / `Response` sin realizar una petición automática. Es indispensable cuando ya tienes la respuesta en memoria (por ejemplo, tras interceptar un `fetch` o al construir una respuesta personalizada con `new Response()`).

```javascript
const guardarRespuestaManual = async () => {
    const cache = await caches.open("datos-api-v1");
    const respuestaRed = await fetch("/api/productos");

    // IMPORTANTE: Clonar la respuesta antes de guardarla si también se va a leer
    await cache.put("/api/productos", respuestaRed.clone());
    const datos = await respuestaRed.json();
    return datos;
};
```

---

# Consultar información almacenada (`match()`, `matchAll()`, `keys()`)

Para inspeccionar y recuperar recursos guardados en caché existen **tres métodos principales**:

### 1. `cache.match(request)` (o `caches.match(request)`)
Busca y devuelve **la primera coincidencia** (`Response`) que corresponda con la petición indicada, o `undefined` si no existe. `caches.match()` busca en todos los almacenes abiertos, mientras que `cache.match()` busca solo en ese almacén.

```javascript
const obtenerDeCache = async (url) => {
    const respuestaEnCache = await caches.match(url);

    if (respuestaEnCache) {
        console.log("Recurso recuperado desde caché:", url);
        return respuestaEnCache;
    }

    console.log("No encontrado en caché, solicitando a la red...");
    return fetch(url);
};
```

### 2. `cache.matchAll(request, options)`
A diferencia de `match()` (que solo retorna la primera respuesta), **`matchAll()`** devuelve una Promesa con un **arreglo (`Array`) de todas las respuestas (`Response[]`)** que coinciden con la petición (muy útil cuando existen varias versiones de una misma ruta con distintos parámetros de consulta `?v=1`, `?v=2` usando `{ ignoreSearch: true }`).

```javascript
const buscarTodasLasCoincidencias = async () => {
    const cache = await caches.open("archivos.estaticos");
    // Si omites el argumento o pasas { ignoreSearch: true }, devuelve todas las coincidencias
    const respuestas = await cache.matchAll("/api/productos", { ignoreSearch: true });
    console.log("Coincidencias encontradas:", respuestas.length);
};
```

### 3. `cache.keys()` y `caches.keys()`
* **`cache.keys()`:** Devuelve una Promesa con un arreglo de todos los objetos **`Request`** (llaves) almacenados dentro de ese almacén específico.
* **`caches.keys()`:** Devuelve una Promesa con un arreglo de cadenas de texto (`string[]`) con los **nombres de todos los almacenes** de caché creados por el origen.

```javascript
const listarContenido = async () => {
    const nombresAlmacenes = await caches.keys();
    console.log("Almacenes existentes:", nombresAlmacenes);

    const cache = await caches.open("archivos.estaticos");
    const peticiones = await cache.keys();
    console.log("URLs guardadas:", peticiones.map((req) => req.url));
};
```

---

# Eliminar información

Mantener la caché limpia es vital para no saturar el almacenamiento del usuario ni servir versiones obsoletas de la aplicación. Existen dos niveles de eliminación:

### 1. Eliminar un recurso específico: `cache.delete(request)`
Borra una entrada puntual dentro de un almacén específico. Devuelve `true` si el elemento existía y fue eliminado, o `false` si no se encontró.

```javascript
const eliminarArchivo = async () => {
    const cache = await caches.open("mi-app-v1");
    const eliminado = await cache.delete("/img/banner-antiguo.png");

    if (eliminado) {
        console.log("Archivo eliminado correctamente de la caché.");
    }
};
```

### 2. Eliminar un almacén completo: `caches.delete(nombreCache)`
Borra toda la caché asociada a un nombre (muy utilizado al actualizar la versión de una aplicación de `"mi-app-v1"` a `"mi-app-v2"`). Devuelve `true` si el almacén fue borrado con éxito.

```javascript
const limpiarVersionesAntiguas = async () => {
    const cacheActual = "mi-app-v2";
    const nombresCaches = await caches.keys();

    await Promise.all(
        nombresCaches.map((nombre) => {
            if (nombre !== cacheActual) {
                console.log("Eliminando caché obsoleta:", nombre);
                return caches.delete(nombre);
            }
        })
    );
};
```

---

# Analogías del mundo real

### 1. La Despensa de la Cocina (`Cache` vs `Red`) 🥫
* Ir al supermercado cada vez que quieres cocinar un ingrediente es hacer una petición **`fetch()`** a la red: toma tiempo, depende del tráfico y si el supermercado está cerrado (sin internet), te quedas sin comer.
* Comprar los ingredientes básicos con anticipación y guardarlos en tu despensa es usar **`cache.addAll()`**: cuando necesitas cocinar, abres la puerta (`caches.match()`) y los tienes al instante. Si un producto caduca, lo tiras a la basura (`cache.delete()`).

### 2. Cajas Etiquetadas de Mudanza (`caches.open`) 📦
* Cada versión de tu aplicación es una caja sellada con etiqueta (`"app-v1"`, `"app-v2"`). Cuando lanzas una actualización, empacas en la caja nueva y desechas por completo la caja vieja con `caches.delete("app-v1")` sin tener que revisar objeto por objeto.

---

# Diagrama de flujo del ciclo de caché

```
   [ Solicitud de Recurso (Request) ]
                   │
                   ▼
      ( caches.match(request) )      ──► Busca en el almacenamiento local
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   [ ENCONTRADO ]      [ NO EXISTE ]
         │                   │
         ▼                   ▼
 ( Devuelve Response )  ( fetch(request) ) ──► Descarga desde la red
   al instante               │
                             ▼
                  ( cache.put(req, res.clone()) ) ──► Guarda copia para el futuro
                             │
                             ▼
                  ( Devuelve Response al usuario )
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Clona siempre las respuestas al usar `put()`:** Los objetos `Response` tienen un flujo (*stream*) de cuerpo que solo puede leerse una vez. Si guardas la respuesta en caché y también la consumes en tu código, usa `response.clone()`.
* **Versiona los nombres de tus cachés:** Nombra tus almacenes con un sufijo de versión (ej. `"static-v1"`, `"images-v1"`) para facilitar la limpieza masiva con `caches.delete()` en futuras actualizaciones.
* **Solo almacena peticiones `GET`:** La Cache API está diseñada únicamente para métodos seguros de lectura (`GET`).

### ❌ Errores Comunes
* **Intentar guardar peticiones `POST`, `PUT` o `DELETE`:** Llamar a `cache.put()` con una solicitud distinta de `GET` lanzará inmediatamente un error `TypeError` en el navegador.
* **Usar `addAll()` con rutas rotas:** Si una sola ruta dentro del arreglo de `addAll()` devuelve un error `404`, toda la operación fallará y no se guardará ninguno de los archivos listados.
* **No eliminar cachés antiguas:** Dejar versiones viejas acumuladas consume cuota de disco del dispositivo y puede provocar que el navegador elimine todos los datos del sitio automáticamente por falta de espacio.

---

# Proyecto Integrador: Gestor de Recursos Offline

A continuación se presenta una implementación completa que permite precargar archivos en caché, consultar el inventario almacenado, eliminar elementos individuales y purgar todo el almacén:

```html
<!-- Estructura HTML -->
<div class="panel-cache">
    <h3>Gestor de Caché Local</h3>
    <button id="btn-guardar">1. Almacenar Recursos</button>
    <button id="btn-listar">2. Ver Archivos en Caché</button>
    <button id="btn-borrar-uno">3. Eliminar un Archivo</button>
    <button id="btn-vaciar">4. Eliminar Caché Completa</button>
    <pre id="consola-cache">Esperando acción...</pre>
</div>
```

```javascript
// Lógica de JavaScript Moderno con Async/Await
const NOMBRE_CACHE = "recursos-app-v1";
const salida = document.getElementById("consola-cache");

// 1. Almacenar información usando put() con respuestas personalizadas o fetch
document.getElementById("btn-guardar").addEventListener("click", async () => {
    try {
        const cache = await caches.open(NOMBRE_CACHE);

        // Guardamos dos recursos simulados (funciona sin depender de rutas externas)
        await cache.put(
            "/api/configuracion",
            new Response(JSON.stringify({ tema: "oscuro", version: "1.0" }), {
                headers: { "Content-Type": "application/json" }
            })
        );

        await cache.put(
            "/api/saludo",
            new Response("Hola desde la Cache API local", {
                headers: { "Content-Type": "text/plain" }
            })
        );

        salida.textContent = "✅ Recursos almacenados correctamente en: " + NOMBRE_CACHE;
    } catch (error) {
        salida.textContent = "❌ Error al almacenar: " + error.message;
    }
});

// 2. Consultar las llaves (Requests) guardadas actualmente
document.getElementById("btn-listar").addEventListener("click", async () => {
    const cache = await caches.open(NOMBRE_CACHE);
    const peticiones = await cache.keys();

    if (peticiones.length === 0) {
        salida.textContent = "📭 La caché está vacía.";
        return;
    }

    const urls = peticiones.map((req) => "• " + new URL(req.url).pathname);
    salida.textContent = "📦 Archivos almacenados:\n" + urls.join("\n");
});

// 3. Eliminar un elemento específico con cache.delete()
document.getElementById("btn-borrar-uno").addEventListener("click", async () => {
    const cache = await caches.open(NOMBRE_CACHE);
    const fueEliminado = await cache.delete("/api/saludo");

    salida.textContent = fueEliminado
        ? "🗑️ Se eliminó '/api/saludo' de la caché."
        : "⚠️ El recurso '/api/saludo' no estaba en caché.";
});

// 4. Eliminar todo el almacén con caches.delete()
document.getElementById("btn-vaciar").addEventListener("click", async () => {
    const borradoTotal = await caches.delete(NOMBRE_CACHE);

    salida.textContent = borradoTotal
        ? `💥 Almacén '${NOMBRE_CACHE}' eliminado por completo.`
        : "⚠️ No existía ninguna caché con ese nombre.";
});
```

---

# Resumen técnico

* **La Cache API (`caches`)** permite almacenar de forma asíncrona pares `Request` / `Response` en contextos seguros (`HTTPS` o `localhost`) para habilitar carga instantánea y soporte *offline*.
* **Para almacenar información** se utiliza `caches.open()` seguido de `cache.add(url)`, `cache.addAll(urls)` (atómico) o `cache.put(req, res)` (manual).
* **Para consultar información** se emplea `caches.match(req)` o `cache.match(req)`, devolviendo la respuesta almacenada sin tocar la red.
* **Para eliminar información** se usa `cache.delete(req)` para borrar un archivo puntual o `caches.delete(nombre)` para purgar un almacén completo.


---

# Estrategias Profesionales de Caché

1. **Cache-First (Caché primero):** Busca en caché; si existe lo devuelve al instante, si no, consulta la red y guarda copia. Ideal para fuentes, CSS, iconos y *App Shell*.
2. **Network-First (Red primero):** Intenta descargar datos frescos de la red; si falla (sin internet), recurre a la última copia guardada en caché. Ideal para noticias o feeds dinámicos.
3. **Stale-While-Revalidate:** Devuelve inmediatamente la copia en caché para mostrar contenido en 0 ms, mientras descarga una actualización en segundo plano para la próxima visita.

---

# Ejercicios

## Nivel 1
Abre (o crea) un almacén llamado `"archivos.estaticos"` mediante `caches.open()` e imprime la instancia resultante en consola.

## Nivel 2
Guarda una respuesta JSON simulada en la ruta `"/api/usuario"` usando `cache.put()` y `new Response(JSON.stringify({ nombre: "Ana" }))`, luego recupérala con `caches.match("/api/usuario")` e imprime el JSON leído.

## Nivel 3
Implementa una función `limpiarCachesAntiguas(cacheActual)` que obtenga todos los nombres con `caches.keys()` y elimine con `caches.delete()` cualquier almacén cuyo nombre sea distinto de `cacheActual`.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
const iniciar = async () => {
    const cache = await caches.open("archivos.estaticos");
    console.log("Caché lista:", cache);
};
iniciar();
```

## Solución Nivel 2
```javascript
const probarPutYMatch = async () => {
    const cache = await caches.open("archivos.estaticos");
    await cache.put(
        "/api/usuario",
        new Response(JSON.stringify({ nombre: "Ana" }), {
            headers: { "Content-Type": "application/json" }
        })
    );
    const res = await caches.match("/api/usuario");
    if (res) console.log("Recuperado:", await res.json());
};
```

## Solución Nivel 3
```javascript
const limpiarCachesAntiguas = async (cacheActual) => {
    const nombres = await caches.keys();
    await Promise.all(
        nombres.map((nombre) => (nombre !== cacheActual ? caches.delete(nombre) : null))
    );
};
```

---

# Hoja de Trucos (Cheatsheet)

| Método | Propósito | Retorno (Promesa) |
| :--- | :--- | :--- |
| `caches.open(nombre)` | Abre o crea un almacén de caché | `Cache` |
| `cache.add(url)` / `addAll(urls)` | Descarga por red y guarda (atómico en `addAll`) | `undefined` |
| `cache.put(req, res.clone())` | Guarda manualmente un par `Request`/`Response` | `undefined` |
| `caches.match(req)` | Busca en todos los almacenes | `Response \| undefined` |
| `cache.keys()` / `caches.keys()` | Lista peticiones guardadas o nombres de cachés | `Array` |
| `cache.delete(req)` / `caches.delete(name)` | Elimina un recurso o un almacén entero | `Boolean` |
