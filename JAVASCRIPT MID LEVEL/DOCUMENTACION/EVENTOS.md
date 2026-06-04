# 🌐 GUÍA — EVENTOS JAVASCRIPT

## 📚 TEMARIO

1. ¿Qué son los eventos?
2. Definición de eventos
3. Event Handlers
4. Event Listeners
5. El objeto Event
6. Event Flow
7. Event Bubbling vs Event Capturing
8. event.stopPropagation()
9. Tipos de eventos
10. Eventos de teclado
11. Eventos de mouse
12. Eventos de formularios
13. Eventos del navegador
14. Eventos táctiles (Touch Events)
15. Pointer Events
16. Drag & Drop
17. Eventos del portapapeles
18. Eventos multimedia
19. Eventos de imágenes
20. Eventos de animaciones
21. Eventos de transiciones CSS
22. Eventos de Storage
23. Eventos de WebSocket
24. Delegación de eventos
25. Buenas prácticas
26. Errores comunes
27. Debugging
28. Optimización
29. Proyectos prácticos
30. Resumen final

---

# ESTRUCTURA DE DOCUMENTACIÓN PARA CADA EVENTO

## 📌 Qué es

## 🧠 Cuándo se dispara

## ⚙️ Sintaxis

## 📦 Ejemplo básico

## 🌎 Ejemplo del mundo real

## 🔍 Propiedades relacionadas

## ⚠️ Errores comunes

## 🚀 Buenas prácticas

## 🧪 Ejercicio práctico

## 🏆 Mini proyecto

---

# 🎯 ¿QUÉ SON LOS EVENTOS?

Los eventos son acciones o sucesos que ocurren dentro de una página web.

JavaScript puede “escuchar” esos sucesos y ejecutar código automáticamente.

---

# 🧠 EJEMPLOS DEL MUNDO REAL

| Acción del usuario  | Evento      |
| ------------------- | ----------- |
| Hacer click         | `click`     |
| Mover el mouse      | `mousemove` |
| Escribir en teclado | `keydown`   |
| Enviar formulario   | `submit`    |
| Cargar página       | `load`      |
| Cambiar un input    | `change`    |

---

# 🧩 DEFINICIÓN DE EVENTOS

Un evento es cualquier interacción detectada por el navegador.

JavaScript trabaja así:

```txt
Usuario hace algo
       ↓
El navegador detecta el evento
       ↓
JavaScript ejecuta una función
```

---

# 📦 ESTRUCTURA BÁSICA

```js
elemento.addEventListener("click", funcion);
```

---

# 🔍 DESGLOSE

| Parte              | Explicación                  |
| ------------------ | ---------------------------- |
| `elemento`         | El objeto HTML               |
| `addEventListener` | Método para escuchar eventos |
| `click`            | Tipo de evento               |
| `funcion`          | Código que se ejecuta        |

---

# 🖱️ EJEMPLO SIMPLE

```html
<button id="btn">Haz click</button>
```

```js
let boton = document.getElementById("btn");

boton.addEventListener("click", () => {
    console.log("Botón presionado");
});
```

---

# 🎮 EVENTOS O “EVENT HANDLERS”

Los Event Handlers son funciones que reaccionan a eventos.

---

# 📌 FORMAS DE USAR EVENT HANDLERS

## 1️⃣ Inline HTML

```html
<button onclick="saludar()">Click</button>
```

```js
function saludar(){
    alert("Hola");
}
```

---

## ⚠️ PROBLEMAS DEL INLINE

❌ Mezcla HTML con JavaScript

❌ Difícil de mantener

❌ Poco escalable

---

## 2️⃣ Propiedades de eventos

```js
boton.onclick = function(){
    console.log("Click detectado");
}
```

---

## ⚠️ PROBLEMA

Solo permite UN evento.

```js
boton.onclick = funcion1;
boton.onclick = funcion2;
```

La segunda reemplaza la primera.

---

## 3️⃣ addEventListener() ✅

La forma moderna y profesional.

```js
boton.addEventListener("click", funcion);
```

---

# ✅ VENTAJAS

✔ Permite múltiples listeners

✔ Código organizado

✔ Más control

✔ Compatible con bubbling/capturing

✔ Más limpio

---

# 👂 ESCUCHA DE EVENTOS O “EVENT LISTENERS”

Los Event Listeners son “escuchas” esperando que ocurra un evento.

---

# 🧠 ANALOGÍA

Imagina un vigilante:

```txt
👮 “Estoy esperando que alguien toque la puerta”
```

Cuando alguien toca:

```txt
🚪 TOC TOC
```

El vigilante responde.

Eso es exactamente un listener.

---

# 📦 SINTAXIS COMPLETA

```js
elemento.addEventListener(tipoEvento, callback, opciones);
```

---

# 🔍 PARÁMETROS

| Parámetro    | Explicación         |
| ------------ | ------------------- |
| `tipoEvento` | Evento a escuchar   |
| `callback`   | Función ejecutada   |
| `opciones`   | Configuración extra |

---

# 🎯 EJEMPLO

```js
let caja = document.querySelector(".caja");

caja.addEventListener("mouseenter", () => {
    console.log("Mouse dentro");
});
```

---

# ⚡ MÚLTIPLES LISTENERS

```js
boton.addEventListener("click", () => {
    console.log("Evento 1");
});

boton.addEventListener("click", () => {
    console.log("Evento 2");
});
```

Ambos funcionan.

---

# 🧠 EL OBJETO EVENT

Cuando ocurre un evento, JavaScript crea automáticamente un objeto especial llamado:

```js
event
```

Contiene información del evento.

---

# 📦 EJEMPLO

```js
boton.addEventListener("click", (event) => {
    console.log(event);
});
```

---

# 🔍 INFORMACIÓN DEL EVENTO

| Propiedad        | Explicación                    |
| ---------------- | ------------------------------ |
| `target`         | Elemento que originó el evento |
| `type`           | Tipo de evento                 |
| `clientX`        | Posición X del mouse           |
| `clientY`        | Posición Y del mouse           |
| `key`            | Tecla presionada               |
| `currentTarget`  | Elemento escuchando            |
|                  |                                |
| preventDefault() | Cancela comportamiento         |

---

# 🎯 EJEMPLO CON TARGET

```html
<button id="btn">Aceptar</button>
```

```js
let boton = document.getElementById("btn");

boton.addEventListener("click", (event) => {
    console.log(event.target);
});
```

---

# 🧠 DIFERENCIA ENTRE target Y currentTarget

## `target`

Elemento que originó el evento.

## `currentTarget`

Elemento que tiene el listener.

---

# 📊 EJEMPLO VISUAL

```txt
DIV
 └── BUTTON
```

Si haces click en BUTTON:

| Propiedad       | Resultado |
| --------------- | --------- |
| `target`        | BUTTON    |
| `currentTarget` | DIV       |

---

# 🌊 FLUJO DE EVENTOS O EVENT FLOW

Los eventos no aparecen mágicamente.

Siguen una ruta.

---

# 📦 FASES DEL EVENT FLOW

```txt
1. Capturing Phase
2. Target Phase
3. Bubbling Phase
```

---

# 📊 VISUALIZACIÓN

```txt
HTML
 ↓
BODY
 ↓
DIV
 ↓
BUTTON ← click
 ↑
DIV
 ↑
BODY
 ↑
HTML
```

---

# 🔵 CAPTURING

El evento baja desde el elemento más grande.

```txt
HTML → BODY → DIV → BUTTON
```

---

# 🔴 BUBBLING

El evento sube desde el elemento interno.

```txt
BUTTON → DIV → BODY → HTML
```

---

# ⚔ EVENT BUBBLING VS EVENT CAPTURING

---

# 🔴 EVENT BUBBLING

Es el comportamiento por defecto.

El evento “burbujea” hacia arriba.

---

# 📦 EJEMPLO

```html
<div id="padre">
    <button id="hijo">Click</button>
</div>
```

```js
padre.addEventListener("click", () => {
    console.log("PADRE");
});

hijo.addEventListener("click", () => {
    console.log("HIJO");
});
```

---

# 🎯 RESULTADO

```txt
HIJO
PADRE
```

Porque el evento sube.

---

# 🔵 EVENT CAPTURING

Ocurre antes del bubbling.

Se activa de arriba hacia abajo.

---

# 📦 EJEMPLO

```js
padre.addEventListener(
    "click",
    () => {
        console.log("PADRE");
    },
    true
);
```

El `true` activa capturing.

---

# 🎯 RESULTADO

```txt
PADRE
HIJO
```

---

# 🧠 DIFERENCIA CLAVE

| Bubbling  | Capturing  |
| --------- | ---------- |
| Sube      | Baja       |
| Default   | Opcional   |
| Más usado | Poco usado |

---

# ✋ event.stopPropagation()

Detiene la propagación del evento.

---

# 📦 EJEMPLO

```js
hijo.addEventListener("click", (event) => {
    event.stopPropagation();

    console.log("Solo hijo");
});
```

---

# 🎯 RESULTADO

```txt
Solo hijo
```

El evento no llega al padre.

---

# 🚨 ¿CUÁNDO USAR stopPropagation?

✔ Modales

✔ Menús desplegables

✔ Componentes interactivos

✔ Sistemas complejos de UI

---

# ⚠️ ABUSAR DE stopPropagation()

Puede romper:

❌ Delegación

❌ Otros listeners

❌ Librerías

❌ Comportamientos globales

---

# 10. EVENTOS DE TECLADO

## 10.1 keydown
## 10.2 keyup
## 10.3 keypress (obsoleto)
## 10.4 event.key
## 10.5 event.code
## 10.6 event.repeat
## 10.7 event.ctrlKey
## 10.8 event.altKey
## 10.9 event.shiftKey
## 10.10 event.metaKey
## 10.11 Atajos de teclado
## 10.12 Casos reales

---

# 11. EVENTOS DE MOUSE

## 11.1 click
## 11.2 dblclick
## 11.3 mousedown
## 11.4 mouseup
## 11.5 mousemove
## 11.6 mouseenter
## 11.7 mouseleave
## 11.8 mouseover
## 11.9 mouseout
## 11.10 contextmenu
## 11.11 wheel
## 11.12 auxclick
## 11.13 Propiedades clientX/clientY
## 11.14 Propiedades offsetX/offsetY
## 11.15 Casos reales

---

# 12. EVENTOS DE FORMULARIOS

## 12.1 submit
## 12.2 input
## 12.3 change
## 12.4 focus
## 12.5 blur
## 12.6 reset
## 12.7 invalid
## 12.8 select
## 12.9 focusin
## 12.10 focusout

---

# 13. EVENTOS DEL NAVEGADOR

## 13.1 DOMContentLoaded
## 13.2 load
## 13.3 beforeunload
## 13.4 unload
## 13.5 resize
## 13.6 scroll
## 13.7 online
## 13.8 offline
## 13.9 hashchange
## 13.10 popstate
## 13.11 error

---

# 14. EVENTOS TÁCTILES

## touchstart
## touchmove
## touchend
## touchcancel

---

# 15. POINTER EVENTS

## pointerdown
## pointerup
## pointermove
## pointerenter
## pointerleave
## pointercancel

---

# 16. DRAG & DROP

## dragstart
## drag
## dragenter
## dragover
## dragleave
## drop
## dragend

---

# 17. EVENTOS DEL PORTAPAPELES

## copy
## cut
## paste

---

# 18. EVENTOS MULTIMEDIA

## play
## pause
## ended
## volumechange
## seeking
## seeked
## timeupdate
## canplay

---

# 19. EVENTOS DE IMÁGENES

## load
## error

---

# 20. EVENTOS DE ANIMACIONES

## animationstart
## animationiteration
## animationend
## animationcancel

---

# 21. EVENTOS DE TRANSICIONES CSS

## transitionstart
## transitionrun
## transitionend
## transitioncancel

---

# 22. EVENTOS DE STORAGE

## storage

---

# 23. EVENTOS DE WEBSOCKET

## open
## message
## error
## close

---

# 24. DELEGACIÓN DE EVENTOS

- Concepto
- Ventajas
- event.target
- event.currentTarget
- matches()
- closest()

---

# 25. BUENAS PRÁCTICAS

# 26. ERRORES COMUNES

# 27. DEBUGGING

# 28. OPTIMIZACIÓN

# 29. PROYECTOS PRÁCTICOS

1. Atajos de teclado
2. Menú contextual
3. Sistema Drag & Drop
4. Reproductor multimedia
5. Formulario avanzado

---

# 30. RESUMEN FINAL

Esta es la estructura maestra sobre la que se debe expandir cada evento con explicaciones completas, ejemplos, casos reales, debugging, optimización y ejercicios.
