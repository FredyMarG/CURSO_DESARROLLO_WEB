# 🌐 GUÍA — EVENTOS EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué son los eventos?
2. Definición de eventos
3. Eventos o “Event Handlers”
4. Escucha de eventos o “Event Listeners”
5. El objeto `Event`
6. Flujo de eventos o `event flow`
7. Event Bubbling vs Event Capturing
8. `event.stopPropagation()`
9. Tipos de eventos más usados
10. Eventos de teclado
11. Eventos del mouse
12. Eventos de formularios
13. Eventos del navegador
14. Delegación de eventos
15. Buenas prácticas
16. Errores comunes
17. Debugging de eventos
18. Optimización
19. Ejercicios prácticos
20. Resumen final

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

# 🎹 EVENTOS DE TECLADO

| Evento     | Explicación        |
| ---------- | ------------------ |
| `keydown`  | Cuando se presiona |
| `keyup`    | Cuando se suelta   |
| `keypress` | Obsoleto           |

---

# 📦 EJEMPLO

```js
document.addEventListener("keydown", (event) => {
    console.log(event.key);
});
```

---

# 🖱️ EVENTOS DEL MOUSE

| Evento        | Explicación   |
| ------------- | ------------- |
| `click`       | Click         |
| `dblclick`    | Doble click   |
| `mousemove`   | Movimiento    |
| `mouseenter`  | Entrada       |
| `mouseleave`  | Salida        |
| `contextmenu` | Click derecho |

---

# 📦 EJEMPLO

```js
caja.addEventListener("mousemove", (event) => {
    console.log(event.clientX, event.clientY);
});
```

---

# 📝 EVENTOS DE FORMULARIOS

| Evento   | Explicación      |
| -------- | ---------------- |
| `submit` | Envío            |
| `input`  | Cambio inmediato |
| `change` | Cambio final     |
| `focus`  | Entrar al input  |
| `blur`   | Salir del input  |

---

# 📦 VALIDAR FORMULARIO

```js
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Formulario validado");
});
```

---

# 🌐 EVENTOS DEL NAVEGADOR

| Evento    | Explicación        |
| --------- | ------------------ |
| `load`    | Página cargada     |
| `resize`  | Cambio de tamaño   |
| `scroll`  | Scroll             |
| `online`  | Internet conectado |
| `offline` | Sin internet       |

---

# 📦 EJEMPLO

```js
window.addEventListener("resize", () => {
    console.log(window.innerWidth);
});
```

---

# 🧠 DELEGACIÓN DE EVENTOS

Una técnica avanzada.

Consiste en escuchar eventos desde un padre.

---

# 🎯 ¿POR QUÉ?

Porque los eventos burbujean.

---

# ❌ MAL

Agregar listeners a 100 botones.

```js
botones.forEach(boton => {
    boton.addEventListener("click", handler);
});
```

---

# ✅ BIEN

Escuchar desde el contenedor.

```js
contenedor.addEventListener("click", (event) => {

    if(event.target.matches("button")){
        console.log("Botón detectado");
    }

});
```

---

# 🚀 VENTAJAS

✔ Más rendimiento

✔ Menos memoria

✔ Escalable

✔ Ideal para elementos dinámicos

---

# ⚠️ ERRORES COMUNES

---

## ❌ OLVIDAR EL EVENT

```js
boton.addEventListener("click", () => {
    console.log(event);
});
```

Debe recibirse como parámetro.

```js
(event) => {}
```

---

## ❌ EJECUTAR LA FUNCIÓN DIRECTAMENTE

```js
boton.addEventListener("click", saludar());
```

❌ Incorrecto.

---

## ✅ CORRECTO

```js
boton.addEventListener("click", saludar);
```

---

## ❌ USAR MUCHOS LISTENERS

Puede afectar rendimiento.

Usa delegación.

---

# 🛠️ DEBUGGING DE EVENTOS

---

# 📦 console.log(event)

```js
boton.addEventListener("click", (event) => {
    console.log(event);
});
```

---

# 📦 breakpoints

Chrome DevTools permite pausar eventos.

```txt
Sources → Event Listener Breakpoints
```

---

# 📦 getEventListeners()

En consola:

```js
getEventListeners(boton)
```

---

# ⚡ OPTIMIZACIÓN

---

# 🚀 EVITAR EVENTOS PESADOS

`scroll` y `mousemove` pueden ejecutarse miles de veces.

---

# ❌ PROBLEMA

```js
window.addEventListener("scroll", () => {
    console.log("scroll");
});
```

---

# ✅ SOLUCIÓN

Throttle o debounce.

---

# 🧠 THROTTLE

Limita ejecuciones.

---

# 🧠 DEBOUNCE

Espera hasta terminar.

---

# 📚 EJERCICIOS PRÁCTICOS

---

# 🧪 EJERCICIO 1

Crear un botón que cambie de color al hacer click.

---

# 🧪 EJERCICIO 2

Mostrar coordenadas del mouse en tiempo real.

---

# 🧪 EJERCICIO 3

Detectar la tecla presionada.

---

# 🧪 EJERCICIO 4

Evitar envío de formulario vacío.

---

# 🧪 EJERCICIO 5

Crear delegación de eventos en una lista.

---

# 🏁 RESUMEN FINAL

---

# 📌 IDEAS IMPORTANTES

✔ Los eventos permiten interacción.

✔ `addEventListener()` es la forma moderna.

✔ El objeto `event` contiene información.

✔ Los eventos siguen un flujo.

✔ Bubbling es el comportamiento por defecto.

✔ Capturing ocurre antes.

✔ `stopPropagation()` detiene propagación.

✔ La delegación mejora rendimiento.

✔ Debugging ayuda a detectar problemas.

✔ Optimizar eventos es fundamental.

---

# 🎯 CONCLUSIÓN

Dominar eventos en JavaScript significa dominar la interacción del usuario.

Todo sistema interactivo depende de eventos:

* Botones
* Formularios
* Menús
* Juegos
* Aplicaciones web
* Dashboards
* Interfaces modernas

Los eventos son el corazón del frontend.
