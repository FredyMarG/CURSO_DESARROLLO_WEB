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

# 7️⃣ Scroll-Timeline

Vincula animación al scroll.

------------------------------------------------------------------------

# 8️⃣ will-change

Optimiza renderizado. Usar con moderación.

------------------------------------------------------------------------

# 9️⃣ prefers-reduced-motion

Accesibilidad obligatoria en producción.

------------------------------------------------------------------------

# 🔥 Integración en una WEB Real

Nivel Junior → Hover + fadeIn\
Nivel Mid → IntersectionObserver + GPU\
Nivel Senior → Sistema completo de animaciones + Accesibilidad +
Performance
