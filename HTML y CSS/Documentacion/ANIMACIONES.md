Perfecto. Voy a explicarte **item por item**, profundizando en qué hace cada propiedad, cada animación y cada concepto del temario, con nivel técnico progresivo (junior → senior).

---

# 1️⃣ Transiciones (Repaso Profundo)

## 🔹 ¿Qué hace realmente una transición?

Una transición le dice al navegador:

> “Cuando esta propiedad cambie de valor, no la cambies instantáneamente. Interpólala en el tiempo.”

El navegador calcula los valores intermedios automáticamente.

---

## 🔹 transition: propiedad duración timing delay;

Ejemplo:

```css
transition: background-color 0.3s ease 0.1s;
```

### ¿Qué hace cada parte?

### 1. `background-color`

Es la propiedad que será animada.

El navegador:

* Detecta el valor inicial.
* Detecta el valor final.
* Calcula colores intermedios.

---

### 2. `0.3s` (duration)

Es el tiempo total que tardará en completarse la interpolación.

Si duración = 0:

* No hay animación.
* El cambio es instantáneo.

---

### 3. `ease` (timing-function)

Define la curva de velocidad.

Internamente usa una función Bézier cúbica.

Ejemplo:

* `linear`: velocidad constante
* `ease-in`: empieza lento, acelera
* `ease-out`: empieza rápido, desacelera
* `ease-in-out`: suave inicio y final

Senior insight:
La curva afecta la percepción psicológica del movimiento.

---

### 4. `delay`

Tiempo antes de que empiece la transición.

Sirve para:

* Animaciones escalonadas
* Coreografías UI

---

## 🔹 ¿Por qué NO animar width o height?

Porque causan:

* Reflow (recalculo de layout)
* Repaint
* Impacto en performance

Mientras que:

* `transform`
* `opacity`

Se ejecutan en la GPU → más eficientes.

---

# 2️⃣ Animaciones (@keyframes)

## 🔹 ¿Qué hace @keyframes?

Define una línea de tiempo.

Ejemplo:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Internamente:

* 0% = estado inicial
* 100% = estado final
* El navegador interpola los valores intermedios

---

## 🔹 animation: propiedades explicadas

```css
animation: fadeIn 1s ease-in-out 0s 1 normal forwards;
```

### fadeIn

Nombre del keyframe a ejecutar.

---

### 1s

Duración total del ciclo.

---

### ease-in-out

Curva de aceleración.

---

### 0s

Delay.

---

### 1

Cantidad de repeticiones.

Si pones:

```css
animation-iteration-count: infinite;
```

Nunca termina.

---

### normal / alternate

* `normal`: siempre 0% → 100%
* `alternate`: 0% → 100% → 0% → 100%

Sirve para efectos flotantes naturales.

---

### forwards

Define qué pasa cuando termina:

* `none`: vuelve al estado original
* `forwards`: se queda en el último frame
* `backwards`: aplica el primer frame durante delay

Senior insight:
`forwards` es clave en animaciones de entrada.

---

# 3️⃣ Botones Animados

---

## 🔹 transform: translateY(-5px);

¿Qué hace?

Mueve el elemento 5px hacia arriba.

Pero:

* No cambia el layout.
* Solo cambia su capa visual.
* Se ejecuta en GPU.

---

## 🔹 box-shadow animado

Cambia sombra progresivamente.

Simula elevación física (Material Design concept).

---

## 🔹 Ripple Effect (JS)

Cuando haces click:

```js
document.createElement("span")
```

Se crea dinámicamente un nodo.

El efecto:

* Calcula posición del click.
* Expande un círculo.
* Se desvanece.

Esto simula interacción táctil.

---

# 4️⃣ Typewriter Effect

---

## 🔹 overflow: hidden;

Evita que el texto que aún no "aparece" sea visible.

---

## 🔹 white-space: nowrap;

Evita saltos de línea.
Necesario para que el ancho crezca horizontalmente.

---

## 🔹 border-right: 2px solid;

Simula cursor.

---

## 🔹 width: 0;

Texto inicia invisible (ancho 0).

---

## 🔹 steps(40)

En lugar de animación fluida:

Divide el progreso en 40 pasos discretos.

Cada paso revela un carácter.

Si usas `linear` en vez de `steps`, parecería deslizarse, no escribirse.

---

## 🔹 blink

```css
50% { border-color: transparent; }
```

Hace parpadear el cursor.

---

# 5️⃣ Intersection Observer

---

## 🔹 ¿Qué hace?

Monitorea cuándo un elemento entra o sale del viewport.

Más eficiente que:

```js
window.addEventListener("scroll")
```

Porque:

* No se ejecuta cada pixel de scroll.
* Es optimizado por el navegador.

---

## 🔹 entry.isIntersecting

Devuelve true cuando el elemento está visible según el threshold.

---

## 🔹 classList.add("visible")

Activa la transición CSS.

Separación limpia:

* JS detecta
* CSS anima

Arquitectura correcta.

---

# 6️⃣ Rango de Animaciones

---

## 🔹 animation-play-state

Permite:

```css
animation-play-state: paused;
```

Puedes pausarla y reanudarla dinámicamente.

---

## 🔹 Web Animations API

```js
element.animate([...], { duration: 1000 })
```

Esto crea una animación programática.

Ventajas:

* Control en tiempo real
* Puedes:

  * detener
  * revertir
  * cambiar velocidad

Senior insight:
Es más poderosa que CSS puro.

---

# 7️⃣ Scroll-Timeline

---

## 🔹 animation-timeline: scrollAnim;

Vincula progreso de animación al scroll.

En vez de depender del tiempo:
Depende del porcentaje de scroll.

Progreso = posición actual / altura scroll total

---

# 8️⃣ will-change

```css
will-change: transform;
```

Le dice al navegador:

> "Prepárate, esta propiedad va a cambiar"

Hace:

* Crear capa independiente
* Optimizar render

Pero si abusas:

* Consume memoria

Senior rule:
Solo usar justo antes de animar.

---

# 9️⃣ prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce)
```

Detecta si el usuario activó reducción de movimiento en el sistema operativo.

Importante para:

* Personas con vértigo
* Epilepsia
* Trastornos vestibulares

Un senior SIEMPRE lo implementa.

---

# 🔥 Integración en una WEB Real

---

## Nivel Junior:

* Usa hover
* Usa fadeIn
* No rompe performance

---

## Nivel Mid:

* Usa IntersectionObserver
* Optimiza GPU
* Controla delays

---

## Nivel Senior:

Piensa en:

* Arquitectura de animaciones
* Sistema de duraciones
* Tokens reutilizables
* UX emocional
* Accesibilidad
* Rendimiento en dispositivos lentos
* Evitar jank (saltos visuales)

---

