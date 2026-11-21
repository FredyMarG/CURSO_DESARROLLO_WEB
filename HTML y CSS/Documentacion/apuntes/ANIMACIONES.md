Perfecto. Voy a explicarte **item por item**, profundizando en qué hace
cada propiedad, cada animación y cada concepto del temario, con nivel
técnico progresivo (junior → senior).

------------------------------------------------------------------------

# 1️⃣ Transiciones (Repaso Profundo)

## 🔹 ¿Qué hace realmente una transición?

Una transición le dice al navegador:

> "Cuando esta propiedad cambie de valor, no la cambies
> instantáneamente. Interpólala en el tiempo."

El navegador calcula los valores intermedios automáticamente.

------------------------------------------------------------------------

## 🔹 transition: propiedad duración timing delay;

Ejemplo:

``` css
transition: background-color 0.3s ease 0.1s;
```

### 1. Propiedad

Es la propiedad que será animada.

### 2. duration

Tiempo total de interpolación.

### 3. timing-function

Curva de velocidad (Bézier cúbica).

### 4. delay

Tiempo antes de comenzar.

------------------------------------------------------------------------

## 🔹 ¿Por qué NO animar width o height?

Porque causan:

-   Reflow
-   Repaint
-   Impacto en performance

Mientras que:

-   `transform`
-   `opacity`

Se ejecutan en la GPU → más eficientes.

------------------------------------------------------------------------

# 2️⃣ Animaciones (@keyframes)

## 🔹 ¿Qué hace @keyframes?

Define una línea de tiempo.

``` css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

------------------------------------------------------------------------

## 🔹 animation (orden lógico real)

``` css
animation: name duration timing-function delay iteration-count direction fill-mode;
```

Ejemplo completo:

``` css
animation: fadeIn 1s ease-in-out 0s 1 normal forwards;
```

------------------------------------------------------------------------

### 🔹 animation-name

Nombre del keyframe.

### 🔹 animation-duration

Duración total del ciclo.

### 🔹 animation-timing-function

Curva de aceleración.

### 🔹 animation-delay

Tiempo antes de iniciar.

### 🔹 animation-iteration-count

Cantidad de repeticiones.

``` css
animation-iteration-count: infinite;
```

------------------------------------------------------------------------

# 🔹 animation-direction (NUEVA SECCIÓN INTEGRADA)

Controla la dirección en la que se ejecuta la animación en cada
iteración.

Sintaxis:

``` css
animation-direction: normal | reverse | alternate | alternate-reverse;
```

------------------------------------------------------------------------

## 1️⃣ normal (por defecto)

Siempre ejecuta:

0% → 100%\
0% → 100%

------------------------------------------------------------------------

## 2️⃣ reverse

Siempre ejecuta:

100% → 0%\
100% → 0%

⚠ La curva de velocidad también se invierte.

------------------------------------------------------------------------

## 3️⃣ alternate

Alterna dirección en cada ciclo:

0% → 100%\
100% → 0%\
0% → 100%

Ideal para animaciones infinitas suaves.

------------------------------------------------------------------------

## 4️⃣ alternate-reverse

Empieza en reversa y luego alterna:

100% → 0%\
0% → 100%

------------------------------------------------------------------------

## 🔹 Insight Senior

`animation-direction` NO modifica los keyframes. Solo altera el orden en
que se ejecutan.

Permite evitar duplicar animaciones y crear efectos más naturales.

Ejemplo profesional:

``` css
.card {
  animation-name: slide;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}

@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(300px); }
}
```

------------------------------------------------------------------------

### 🔹 animation-fill-mode

Define qué pasa cuando termina:

-   `none`
-   `forwards`
-   `backwards`
-   `both`

Senior insight: `forwards` es clave en animaciones de entrada.

------------------------------------------------------------------------

# 3️⃣ Botones Animados

transform se ejecuta en GPU. box-shadow simula elevación. Ripple usa DOM
dinámico.

------------------------------------------------------------------------

# 4️⃣ Typewriter Effect

Uso de: \* overflow hidden \* white-space nowrap \* steps() \* blink

------------------------------------------------------------------------

# 5️⃣ Intersection Observer

Optimizado por el navegador. Separa lógica JS de animación CSS.

------------------------------------------------------------------------

# 6️⃣ Rango de Animaciones

## animation-play-state

Permite pausar y reanudar.

## Web Animations API

Control programático avanzado.

------------------------------------------------------------------------

# 7️⃣ Scroll-Driven Animations (`scroll()` y `view()`)

Permiten vincular el progreso de una animación CSS directamente al desplazamiento del scroll **sin JavaScript**, ejecutándose en el hilo compositor a 60/120 FPS:

### Barra de progreso de lectura con `scroll()`
```css
@keyframes crecerBarra {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.reading-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 4px;
  background: #38bdf8;
  transform-origin: left;
  animation: crecerBarra linear both;
  animation-timeline: scroll(root block);
}
```

### Animación al entrar en pantalla con `view()` y `animation-range`
```css
@keyframes aparecer {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.reveal-card {
  animation: aparecer linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 35%;
}
```

---

# 8️⃣ `@starting-style` y `interpolate-size: allow-keywords`

### `@starting-style` (Transiciones desde `display: none` o Top Layer)
Antes, animar la aparición de un `<dialog>`, un `popover` o un elemento que pasaba de `display: none` a `display: block` fallaba. `@starting-style` define el estado inicial en el primer frame de renderizado:

```css
dialog[open] {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.25s ease, transform 0.25s ease, display 0.25s allow-discrete;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

### `interpolate-size: allow-keywords`
Permite animar directamente hacia palabras clave como `auto`, `min-content` o `fit-content` (ideal para acordeones sin hacks de `max-height`):

```css
:root {
  interpolate-size: allow-keywords;
}

.acordeon-contenido {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.acordeon[open] .acordeon-contenido {
  height: auto;
}
```

---

# 9️⃣ View Transitions API

Permite transiciones cinematográficas entre estados del DOM o entre páginas completas (MPA):

```css
/* Transición automática entre páginas del mismo origen */
@view-transition {
  navigation: auto;
}

/* Empareja elementos específicos entre vistas */
.hero-imagen {
  view-transition-name: producto-hero;
}
```

En SPA o cambios del DOM con JavaScript:
```js
document.startViewTransition(() => {
  actualizarVistaDOM();
});
```

---

# 🔟 `will-change` y `prefers-reduced-motion`

### `will-change`
Indica al navegador qué propiedad cambiará para promoverla a una capa GPU. Úsalo con moderación (solo en elementos que realmente se animan) para no saturar la memoria de video.

### `prefers-reduced-motion` (Accesibilidad obligatoria)
Respeta a los usuarios con sensibilidad al movimiento o trastornos vestibulares:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# ❌ Errores Comunes en Animaciones

1. **Animar `width`, `height`, `top`, `left` o `margin`:** Dispara *Layout/Reflow* en cada frame y causa tirones (*jank*); anima `transform` y `opacity`.
2. **Aplicar `will-change: transform` a cientos de elementos (`*`):** Consume demasiada VRAM y empeora el rendimiento.
3. **Usar `transition: all 0.3s`:** Puede animar propiedades inesperadas; especifica las propiedades exactas (`transition: transform 0.3s, opacity 0.3s`).
4. **Olvidar `prefers-reduced-motion`:** Provoca mareos o fatiga visual a usuarios sensibles al movimiento.

---

# ✅ Buenas Prácticas Senior

- Prioriza propiedades compuestas por GPU: `transform`, `opacity`, `clip-path`, `filter`.
- Usa `animation-timeline: view()` para reveals en scroll en lugar de librerías pesadas de JavaScript.
- Combina `@starting-style` con `transition-behavior: allow-discrete` para animar `<dialog>` y `popover` nativos.
- Mantén microinteracciones rápidas (`150ms–300ms`) con curvas naturales (`cubic-bezier(0.22, 1, 0.36, 1)` o `ease-out`).

---

# Hoja de Trucos (Cheatsheet) — Animaciones CSS

| Propiedad / Regla | Uso Principal |
| :--- | :--- |
| `transition: transform 0.25s ease` | Anima cambios suaves entre estados (`:hover`, clases) |
| `@keyframes nombre { from {} to {} }` | Define pasos intermedios de una animación compleja |
| `animation: nombre 1s infinite alternate` | Ejecuta y controla ciclos, dirección y repetición |
| `transform` & `opacity` | Propiedades aceleradas por GPU (60+ FPS sin reflow) |
| `animation-timeline: scroll() / view()` | Anima según el scroll o visibilidad sin JavaScript |
| `animation-range: entry 0% cover 40%` | Define en qué tramo del viewport ocurre la animación |
| `@starting-style` | Define el estado inicial para animar desde `display: none` |
| `interpolate-size: allow-keywords` | Permite transicionar `height: 0` → `height: auto` |
| `@view-transition { navigation: auto; }` | Transiciones nativas entre páginas o estados del DOM |
| `@media (prefers-reduced-motion: reduce)` | Desactiva o suaviza animaciones por accesibilidad |
