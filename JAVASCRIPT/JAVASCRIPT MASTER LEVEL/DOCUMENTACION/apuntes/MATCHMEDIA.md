# GUÍA — `window.matchMedia()` en JavaScript (Media Queries Dinámicas)

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender cómo evaluar consultas de medios (*Media Queries*) de CSS directamente desde JavaScript, dominar la propiedad `matches` y el evento `change` (`onchange`), y aprender cuándo utilizar `matchMedia()` frente al evento `resize` tradicional para crear interfaces adaptativas y eficientes.

---

# 📚 Temario

1. Definición de `window.matchMedia()`
2. Sintaxis básica y anatomía de `MediaQueryList`
3. Evaluación inicial con la propiedad `matches` y escucha dinámica con `change` (`onchange`)
4. Comparativa: `window.addEventListener("resize")` vs. `window.matchMedia()` moderno
5. Analogía del mundo real
6. Diagrama de flujo de decisión
7. ¿Cuándo debería usar `matchMedia()`?
8. Buenas prácticas
9. Errores comunes
10. Ejercicios
11. Solucionario paso a paso
12. Resumen

---

# ¿Qué es `window.matchMedia()`?

El método **`window.matchMedia()`** es una API nativa del navegador que permite **evaluar una Media Query de CSS desde JavaScript** y reaccionar dinámicamente cuando el estado de dicha consulta cambia (por ejemplo, al redimensionar la ventana, rotar un dispositivo móvil o alternar entre modo claro y oscuro).

A diferencia de las *Media Queries* tradicionales en hojas de estilo CSS —que solo modifican la apariencia visual—, `matchMedia()` devuelve un objeto **`MediaQueryList`**. Esto permite ejecutar **lógica de programación condicional**, montar o desmontar componentes complejos del DOM, pausar animaciones pesadas o activar comportamientos táctiles únicamente cuando se cumple una condición de pantalla o preferencia del sistema.

---

# Sintaxis básica y anatomía de una consulta

La sintaxis moderna en JavaScript consiste en pasar una cadena de texto con una regla *Media Query* válida (entre paréntesis) al método `window.matchMedia()`:

```javascript
const mediaQueryList = window.matchMedia("(condicion-css)");
```

### 🔍 Desglose de los elementos clave:
1. **Cadena de Media Query (`mediaQueryString`):** Una expresión idéntica a la usada en CSS, como `"(max-width: 768px)"`, `"(orientation: landscape)"` o `"(prefers-color-scheme: dark)"`.
2. **Objeto `MediaQueryList`:** El valor que retorna `matchMedia()`. Contiene el estado actual de la consulta y permite suscribirse a sus cambios.
3. **Propiedad `matches` (Booleano):** Devuelve `true` si el documento cumple actualmente con la *Media Query* especificada, o `false` en caso contrario.
4. **Propiedad `media` (String):** Devuelve la cadena de la consulta serializada que se está evaluando.
5. **Evento `change` / propiedad `onchange`:** Se dispara **exclusivamente en el instante en que el resultado de `matches` cambia** de `true` a `false` o de `false` a `true`.

---

# Evaluación inicial (`matches`) y escucha dinámica (`change` / `onchange`)

Para trabajar profesionalmente con `matchMedia()`, debes combinar la **comprobación inicial** al cargar la página (usando `.matches`) con un **observador de cambios** en tiempo real (usando `addEventListener("change", ...)` o `.onchange`).

```javascript
// 1. Definimos la consulta de medios (ej. pantallas de escritorio grandes)
const consultaEscritorio = window.matchMedia("(min-width: 1024px)");

// 2. Creamos una función manejadora que recibe el estado actual
const manejarCambioPantalla = (evento) => {
    if (evento.matches) {
        console.log("Modo Escritorio activo: Mostrando menú lateral completo.");
    } else {
        console.log("Modo Móvil/Tablet activo: Colapsando menú hamburguesa.");
    }
};

// 3. Evaluamos el estado inicial apenas carga el script
manejarCambioPantalla(consultaEscritorio);

// 4. Escuchamos futuros cambios de estado (cruzar el punto de quiebre)
consultaEscritorio.addEventListener("change", manejarCambioPantalla);
```

---

# Comparativa: `resize` tradicional vs. `matchMedia()` Moderno

Para entender por qué `matchMedia()` es el estándar recomendado para lógica *responsive*, observemos cómo se detectaba un cambio de resolución con el enfoque tradicional frente al moderno:

### Estructura tradicional (`window.resize` + `innerWidth`)
```javascript
// ⚠️ Se dispara decenas o cientos de veces por segundo al arrastrar la ventana
window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
        console.log("Estás en móvil");
    } else {
        console.log("Estás en escritorio");
    }
});
```

### Estructura moderna (`window.matchMedia`)
```javascript
// ✅ Se dispara UNA sola vez justo cuando se cruza el límite de 768px
const mqMovil = window.matchMedia("(max-width: 768px)");

mqMovil.onchange = (e) => {
    console.log(e.matches ? "Estás en móvil" : "Estás en escritorio");
};
```

---

# Analogía del mundo real: El termostato inteligente 🌡️

Imagina cómo funciona el sistema de climatización de una oficina:

```
1. El enfoque tradicional (resize) es como una persona mirando el termómetro cada segundo 
   y gritando "¡Hacen 24°C!", "¡Hacen 23.9°C!", "¡Hacen 23.8°C!" sin parar.
2. El enfoque con matchMedia() es un termostato inteligente programado a 22°C.
3. Puedes consultarlo en cualquier momento para saber si el aire está encendido (propiedad matches).
4. El termostato guarda silencio mientras la temperatura fluctúa arriba o abajo, y SOLO envía 
   una alerta en el momento exacto en que se cruza la barrera de los 22°C (evento onchange).
```

---

# Diagrama de flujo de decisión

```
       [ Definir const mq = window.matchMedia("(max-width: 768px)") ]
                                     │
                                     ▼
                    [ Evaluar estado inicial: mq.matches ]
                          ┌──────────┴──────────┐
                          ▼ true                ▼ false
               [ Ejecutar lógica A ]  [ Ejecutar lógica B ]
                          │                     │
                          └──────────┬──────────┘
                                     ▼
               [ Registrar listener: mq.addEventListener("change") ]
                                     │
                                     ▼
               ( Usuario redimensiona ventana o gira pantalla )
                                     │
                        ¿Se cruzó el punto de quiebre?
                          ┌──────────┴──────────┐
                          ▼ No                  ▼ Sí
               [ No hacer nada (0 CPU) ] [ Disparar callback con e.matches ]
```

---

# ¿Cuándo debería usar `matchMedia()`?

Debes utilizar `window.matchMedia()` siempre que necesites **sincronizar el comportamiento lógico de JavaScript con las reglas de diseño de CSS**, especialmente en los siguientes escenarios:

* **Alterar la estructura del DOM:** Cuando en móvil necesitas mover un elemento de lugar (por ejemplo, pasar un buscador del encabezado al menú lateral) en lugar de duplicarlo y ocultarlo con `display: none`.
* **Activar o destruir librerías de terceros:** Inicializar un carrusel táctil (*Swiper*), un mapa interactivo o una gráfica pesada únicamente en pantallas grandes o pequeñas.
* **Detectar preferencias del sistema operativo:** Adaptar la lógica de tu aplicación al tema oscuro (`(prefers-color-scheme: dark)`), reducción de movimiento (`(prefers-reduced-motion: reduce)`) o alto contraste.
* **Cambios de orientación o dispositivo de puntero:** Detectar si el usuario navega con un dedo táctil (`(pointer: coarse)`) o con un ratón preciso (`(pointer: fine)`).

> **💡 Regla de oro:** Si el cambio es **puramente visual** (colores, tamaños de fuente, columnas de Grid o márgenes), usa **solo CSS (`@media`)**. Si el cambio requiere **ejecutar código, cargar datos o modificar eventos**, usa **`window.matchMedia()`**.

---

# Buenas prácticas

✅ **Usa paréntesis en la consulta:** Escribe siempre la condición encerrada entre paréntesis, tal como lo harías en una hoja de estilos: `"(max-width: 600px)"`.

✅ **Prefiere `addEventListener("change", fn)` sobre `onchange` en aplicaciones grandes:** Mientras que `mq.onchange = fn` sobrescribe cualquier manejador previo si otro módulo usa la misma referencia, `addEventListener` permite múltiples suscripciones limpias y facilita su eliminación con `removeEventListener`.

✅ **Ejecuta la función tanto al inicio como en el evento:** El evento `change` **no se dispara al cargar la página**; solo ocurre cuando hay una transición. Llama siempre a tu función manejadora manualmente una vez al iniciar el script pasando el objeto `MediaQueryList`.

```javascript
const temaOscuro = window.matchMedia("(prefers-color-scheme: dark)");

const aplicarTema = (e) => {
    document.body.dataset.tema = e.matches ? "oscuro" : "claro";
};

aplicarTema(temaOscuro); // Evaluación inicial obligatoria
temaOscuro.addEventListener("change", aplicarTema); // Escucha reactiva
```

---

# Errores comunes

### ❌ Usar el método obsoleto `addListener()`
En versiones antiguas de Safari e Internet Explorer se utilizaba `mq.addListener(callback)`. Hoy en día está **deprecado** (obsoleto) en los estándares web modernos.

```javascript
// ❌ EVITAR ESTO: Método obsoleto
const mq = window.matchMedia("(min-width: 800px)");
mq.addListener((e) => console.log(e.matches));

// ✅ CORRECTO: Estándar moderno
mq.addEventListener("change", (e) => console.log(e.matches));
```

### ❌ Olvidar los paréntesis en la Media Query
Si pasas la condición sin paréntesis, el navegador no podrá interpretar la regla correctamente y `matches` devolverá siempre `false` sin lanzar un error evidente.

```javascript
// ❌ INCORRECTO: Falta de paréntesis, siempre evaluará a false
const mq = window.matchMedia("max-width: 768px"); 

// ✅ CORRECTO: Sintaxis CSS válida
const mqValida = window.matchMedia("(max-width: 768px)");
```

---

# Ejercicios

## Nivel 1
Crea una consulta con `window.matchMedia()` para detectar si el ancho de la pantalla es igual o menor a `600px`. Evalúa inmediatamente su propiedad `matches` y muestra en consola `"Vista móvil"` si es verdadero, o `"Vista amplia"` si es falso.

## Nivel 2
Escribe un script que detecte si el usuario tiene activado el modo oscuro en su sistema operativo mediante `"(prefers-color-scheme: dark)"`. Utiliza la propiedad `onchange` para imprimir en consola `"Cambiado a modo oscuro"` cuando se active y `"Cambiado a modo claro"` cuando se desactive.

## Nivel 3
Crea una función llamada `configurarNavegacionAdaptativa` que evalúe la consulta `"(min-width: 992px)"`. La función debe:
1. Definir una subfunción interna `actualizarInterfaz(evento)` que agregue la clase `"desktop-nav"` al `document.body` si `evento.matches` es `true`, o la elimine (`classList.remove`) si es `false`.
2. Ejecutar `actualizarInterfaz` inmediatamente al cargar para establecer el estado inicial.
3. Registrar un `addEventListener("change", ...)` para mantener sincronizada la clase cada vez que el usuario redimensione la ventana cruzando los `992px`.

---

# Solucionario paso a paso

## Solución Nivel 1: Evaluación inicial con `matches`

### 🎯 Objetivo
Instanciar un objeto `MediaQueryList` y leer su estado booleano inmediato sin necesidad de esperar eventos.

```javascript
// 1. Creamos la consulta con paréntesis válidos
const consultaMovil = window.matchMedia("(max-width: 600px)");

// 2. Comprobamos la propiedad booleana .matches
if (consultaMovil.matches) {
    console.log("Vista móvil");
} else {
    console.log("Vista amplia");
}
```

> **💡 Nota clave:** La propiedad `matches` refleja el estado exacto del *viewport* en el milisegundo en que se ejecuta esa línea de código.

## Solución Nivel 2: Escucha dinámica con `onchange`

### 🎯 Objetivo
Detectar cambios en las preferencias de accesibilidad o tema del sistema operativo en tiempo real.

```javascript
// 1. Apuntamos a la media query de esquema de color del sistema
const consultaTemaOscuro = window.matchMedia("(prefers-color-scheme: dark)");

// 2. Asignamos el manejador al evento onchange
consultaTemaOscuro.onchange = (evento) => {
    if (evento.matches) {
        console.log("Cambiado a modo oscuro");
    } else {
        console.log("Cambiado a modo claro");
    }
};
```

> **💡 Nota clave:** Para probar este código en tu navegador, abre las herramientas de desarrollo (*DevTools*), presiona `Ctrl + Shift + P` (o `Cmd + Shift + P` en Mac) y busca *"Emulate CSS prefers-color-scheme: dark"*.

## Solución Nivel 3: Patrón completo (Estado inicial + `addEventListener`)

### 🎯 Objetivo
Implementar el patrón estándar de producción que evita fallos de sincronización entre la carga inicial y los redimensionamientos posteriores.

```javascript
const configurarNavegacionAdaptativa = () => {
    // 1. Definimos el punto de quiebre (breakpoint)
    const consultaEscritorio = window.matchMedia("(min-width: 992px)");

    // 2. Función reutilizable que acepta tanto MediaQueryList como MediaQueryListEvent
    const actualizarInterfaz = (evento) => {
        if (evento.matches) {
            document.body.classList.add("desktop-nav");
            console.log("Clase 'desktop-nav' aplicada.");
        } else {
            document.body.classList.remove("desktop-nav");
            console.log("Clase 'desktop-nav' removida.");
        }
    };

    // 3. Ejecución inmediata para el estado inicial al abrir la web
    actualizarInterfaz(consultaEscritorio);

    // 4. Suscripción eficiente a futuros cruces del breakpoint
    consultaEscritorio.addEventListener("change", actualizarInterfaz);
};

// Inicializamos la configuración
configurarNavegacionAdaptativa();
```

> **💡 Nota clave:** Observa que tanto el objeto `MediaQueryList` inicial como el objeto `MediaQueryListEvent` que recibe el *callback* poseen la propiedad `.matches`, lo que permite reutilizar exactamente la misma función `actualizarInterfaz` en ambos pasos.

---

# Resumen

* **`window.matchMedia()`** permite evaluar reglas *Media Query* de CSS directamente desde JavaScript devolviendo un objeto `MediaQueryList`.
* **La propiedad `matches`** indica con un booleano (`true`/`false`) si la condición se cumple en ese instante, mientras que **`change` (`onchange`)** dispara una notificación únicamente cuando ese estado cambia.
* **Es mucho más eficiente que `window.resize`** porque evita ejecuciones innecesarias en cada píxel de movimiento, siendo la herramienta ideal para controlar lógica del DOM, librerías y preferencias del sistema.


---

# Conceptos Complementarios: Combinación de Consultas y `Hoja de Trucos`

### 1. Consultas compuestas (`and`, `,`, `not`)
Puedes combinar múltiples condiciones CSS dentro de la misma cadena de `matchMedia()`:
```javascript
// Tablet en orientación horizontal
const tabletHorizontal = window.matchMedia("(min-width: 600px) and (max-width: 1023px) and (orientation: landscape)");

// Móvil o usuario con reducción de movimiento activa
const modoLigero = window.matchMedia("(max-width: 599px), (prefers-reduced-motion: reduce)");
```

---

# Hoja de Trucos (Cheatsheet)

| Elemento | Tipo | Descripción |
| :--- | :--- | :--- |
| `window.matchMedia("(regla)")` | Método | Evalúa una Media Query CSS (paréntesis obligatorios) |
| `mql.matches` | Boolean | `true` si la condición se cumple actualmente |
| `mql.media` | String | Cadena serializada de la consulta |
| `mql.addEventListener("change", fn)` | Evento | Se dispara solo al cruzar el punto de quiebre |
| `mql.addListener()` ❌ | Obsoleto | Deprecado; usar siempre `addEventListener("change")` |
