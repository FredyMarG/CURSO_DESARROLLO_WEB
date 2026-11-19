# GUÍA COMPLETA — Page Visibility API (`visibilitychange`) en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de Visibilidad de Página (*Page Visibility API*) en JavaScript para detectar cuándo el usuario cambia de pestaña, minimiza el navegador o bloquea la pantalla, optimizando así el consumo de batería, red y recursos del sistema.

---

# 📚 Temario

1. ¿Qué es la Page Visibility API?
2. El evento `visibilitychange`
3. Propiedades clave (`document.visibilityState` y `document.hidden`)
4. Principales usos en el desarrollo web moderno
5. Analogías del mundo real
6. Diagrama de flujo del ciclo de visibilidad
7. Buenas prácticas y errores comunes
8. Proyecto Integrador: Reproductor de Video Inteligente
9. Resumen técnico

---

# ¿Qué es la Page Visibility API?

La **Page Visibility API** proporciona una forma nativa y estandarizada de saber si una página web es visible actualmente para el usuario o si se encuentra oculta en segundo plano.

Anteriormente, los desarrolladores intentaban adivinar este comportamiento escuchando los eventos `focus` y `blur` del objeto `window`. Sin embargo, esos eventos fallaban con frecuencia: por ejemplo, si el usuario hacía clic en la barra de direcciones o abría las herramientas de desarrollo (*DevTools*), `window.blur` se disparaba aunque la página siguiera perfectamente visible en pantalla.

Hoy en día, el evento **`visibilitychange`** resuelve este problema informando con precisión si la pestaña está realmente activa a la vista o en segundo plano.

---

# El evento `visibilitychange`

El evento **`visibilitychange`** se dispara directamente sobre el objeto **`document`** cada vez que el estado de visibilidad de la pestaña cambia (al pasar de visible a oculta, o viceversa).

* **Objetivo de escucha:** Siempre se registra en `document.addEventListener("visibilitychange", ...)` (no en `window`).
* **Parámetro del evento:** El objeto del evento (`e`) no contiene directamente el nuevo estado; este debe consultarse leyendo las propiedades del `document` dentro del *callback*.

```javascript
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        console.log("El usuario regresó a la pestaña");
    } else {
        console.log("El usuario ocultó o abandonó la pestaña");
    }
});
```

---

# Propiedades clave del `document`

Para conocer el estado exacto en el instante en que se dispara el evento, la API expone dos propiedades de solo lectura en el objeto `document`:

### 1. `document.visibilityState` (Recomendada)
Devuelve una cadena de texto (*string*) con el estado exacto de la página:
* **`"visible"`:** El contenido de la página es al menos parcialmente visible. En la práctica, significa que la pestaña está en primer plano y la ventana no está minimizada.
* **`"hidden"`:** El contenido de la página no es visible para el usuario. Ocurre cuando el usuario cambia a otra pestaña, minimiza el navegador, cambia de aplicación en el celular o bloquea la pantalla del dispositivo.

### 2. `document.hidden` (Booleana)
Devuelve un valor booleano simple:
* **`true`:** La página está oculta en segundo plano.
* **`false`:** La página está visible en primer plano.

```javascript
// Forma alternativa usando la propiedad booleana
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        console.log("Pestaña en segundo plano (Pausando procesos...)");
    } else {
        console.log("Pestaña activa (Reanudando...)");
    }
});
```

---

# Principales usos en el desarrollo web

Controlar la visibilidad de la pestaña permite construir aplicaciones web mucho más respetuosas con el rendimiento y la experiencia de usuario:

### 1. Control de reproducción multimedia (Audio y Video) 🎬
* Pausar automáticamente un video, podcast o transmisión en vivo cuando el usuario cambia de pestaña o bloquea su teléfono, y reanudarlo solo cuando regresa.

### 2. Ahorro de red y peticiones a APIs (*Polling*) 🌐
* Si una aplicación consulta datos en tiempo real cada 5 segundos (por ejemplo, cotizaciones de bolsa, marcadores deportivos o notificaciones), detener los temporizadores (`setInterval`) mientras la pestaña esté en `"hidden"` evita gastar datos móviles y sobrecargar el servidor innecesariamente.

### 3. Pausa de animaciones y videojuegos en Canvas 🎮
* Detener motores de renderizado, bucles de juego o carruseles automáticos cuando nadie está mirando la pantalla, reduciendo el uso de CPU/GPU y ahorrando batería.

### 4. Analítica web y métricas reales de lectura 📊
* Medir con exactitud cuánto tiempo real pasó un usuario leyendo un artículo, descartando las horas en las que dejó la pestaña abierta en segundo plano sin mirarla.

### 5. Gestión de sesiones y seguridad 🔒
* Iniciar cuentas regresivas de cierre de sesión por inactividad o difuminar información bancaria sensible cuando la aplicación pasa a segundo plano.

---

# Analogías del mundo real

### 1. La Luz del Refrigerador (`visibilitychange`) 💡
* La página web es el interior de un refrigerador. Mientras la puerta está abierta (`"visible"`), la luz interna se enciende y todo funciona a plena vista. En el instante en que cierras la puerta (`"hidden"`), el interruptor detecta el cambio y apaga la luz para no desperdiciar energía hasta que vuelvas a abrirla.

### 2. El Marcador de un Libro 📖
* Cuando estás leyendo un libro y alguien te interrumpe, colocas un separador en la página (`visibilityState === "hidden"`) y detienes tu lectura. Cuando vuelves a abrir el libro (`visibilityState === "visible"`), retomas exactamente desde donde lo dejaste sin haberte perdido ningún párrafo.

---

# Diagrama de flujo del ciclo de visibilidad

```
   [ Usuario navega en la Pestaña Activa ]
                     │
                     ▼
   ( document.visibilityState === "visible" )
                     │
                     ▼
     ¿Cambia de pestaña, minimiza o bloquea?
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
         [ SÍ ]              [ NO ] ──► Continúa ejecución normal
           │
           ▼
   ( Dispara evento: "visibilitychange" )
           │
           ▼
   ( document.visibilityState === "hidden" )
           │
           ▼
   [ Pausa videos, intervalos o animaciones ]
           │
           ▼
     ¿El usuario regresa a la pestaña?
           │
           ▼
   ( Dispara evento: "visibilitychange" )
           │
           ▼
   ( document.visibilityState === "visible" )
           │
           ▼
   [ Reanuda procesos y sincroniza datos ]
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Registra el evento en `document`:** Usa siempre `document.addEventListener("visibilitychange", ...)` para garantizar compatibilidad total en navegadores de escritorio y móviles.
* **Respeta la intención previa del usuario al reanudar:** Si un usuario pausó manualmente un video *antes* de cambiar de pestaña, no debes reproducirlo automáticamente cuando regrese. Guarda una bandera de estado (ej. `pausadoPorSistema = true`) para saber si fuiste tú quien lo pausó.
* **Combínalo con `requestAnimationFrame`:** Aunque los navegadores modernos ya reducen la frecuencia de `requestAnimationFrame` en pestañas ocultas, limpiar intervalos (`clearInterval`) manualmente garantiza cero consumo residual en lógica de negocio.

### ❌ Errores Comunes
* **Confundir `visibilitychange` con `window.onblur`:** Usar `blur` pausará tu aplicación incluso si el usuario solo hace clic en otra ventana dividida en pantalla (Split Screen) mientras sigue viendo tu web. `visibilitychange` sí sabe que la página sigue visible.
* **Intentar reproducir audio con sonido al volver sin interacción previa:** Si la página cargó directamente en una pestaña en segundo plano (por ejemplo, al abrir un enlace con clic central), los navegadores bloquearán el `video.play()` automático hasta que el usuario interactúe con la página.

---

# Proyecto Integrador: Reproductor de Video Inteligente

A continuación se presenta una implementación completa de un reproductor de video que se pausa automáticamente cuando el usuario abandona la pestaña y se reanuda al volver, respetando si el usuario lo había pausado manualmente:

```html
<!-- Estructura HTML -->
<div class="contenedor-video">
    <video id="video-principal" width="640" controls>
        <source src="tutorial-javascript.mp4" type="video/mp4">
        Tu navegador no soporta la etiqueta de video.
    </video>
    <p id="estado-reproductor">Estado: Listo para reproducir</p>
</div>
```

```javascript
// Lógica de JavaScript Moderno
const video = document.getElementById("video-principal");
const textoEstado = document.getElementById("estado-reproductor");

// Bandera para recordar si el video se pausó por cambio de pestaña
let pausadoAutomaticamente = false;

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        // Solo pausamos si el video estaba reproduciéndose activamente
        if (!video.paused) {
            video.pause();
            pausadoAutomaticamente = true;
            document.title = "⏸️ Video en pausa - Vuelve pronto";
        }
    } else if (document.visibilityState === "visible") {
        // Solo reanudamos si fue pausado por el sistema al ocultar la pestaña
        if (pausadoAutomaticamente) {
            video.play();
            pausadoAutomaticamente = false;
            document.title = "▶️ Reproduciendo tutorial";
            textoEstado.innerText = "Estado: Reproducción reanudada automáticamente";
        }
    }
});

// Si el usuario pausa manualmente, reiniciamos la bandera de control
video.addEventListener("pause", () => {
    if (document.visibilityState === "visible") {
        pausadoAutomaticamente = false;
        textoEstado.innerText = "Estado: Pausado manualmente por el usuario";
    }
});
```

---

# Resumen técnico

* **La Page Visibility API** permite detectar con precisión cuándo una pestaña pasa a primer o segundo plano mediante el evento **`visibilitychange`** en el objeto `document`.
* **La propiedad `document.visibilityState`** devuelve `"visible"` o `"hidden"` (mientras que `document.hidden` devuelve un booleano `true` o `false`).
* **Sus principales usos** incluyen pausar contenido multimedia, detener peticiones periódicas a APIs (*polling*), ahorrar batería en animaciones y medir tiempos reales de lectura.
* **A diferencia de `window.blur`**, esta API no genera falsos positivos cuando el usuario interactúa con la interfaz del navegador o ventanas divididas.
