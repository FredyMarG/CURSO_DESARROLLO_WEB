# FUNCIONES AVANZADAS - GUÍA PROFESIONAL COMPLETA

Guía técnica avanzada y ampliada de funciones modernas de CSS,
incluyendo fundamentos internos, rendimiento, casos reales, errores
comunes y buenas prácticas.

------------------------------------------------------------------------

# 1. FILTER

## Concepto Técnico

`filter` aplica efectos gráficos en la etapa de post-renderizado. El
navegador primero pinta el elemento y luego aplica el efecto como una
capa adicional.

-   No altera el layout.
-   Se ejecuta en la fase de composición.
-   Puede usar aceleración por GPU.

## Sintaxis

``` css
selector {
  filter: <filter-function>+;
}
```

Se pueden encadenar múltiples funciones:

``` css
filter: blur(5px) brightness(120%) contrast(110%);
```

------------------------------------------------------------------------

# 2. BACKDROP-FILTER

Aplica efectos al contenido detrás del elemento.

``` css
.card {
  backdrop-filter: blur(15px);
  background: rgba(255,255,255,0.2);
}
```

------------------------------------------------------------------------

# 3. TRANSFORM

No modifica el flujo del documento. Más eficiente que usar top/left.

------------------------------------------------------------------------

# 4. MIN(), MAX(), CLAMP()

Ideal para tipografía fluida:

``` css
font-size: clamp(1rem, 1.5vw + 1rem, 2rem);
```

------------------------------------------------------------------------

# 5. VARIABLES CSS

``` css
:root {
  --primary-color: #3498db;
}
```

------------------------------------------------------------------------

# 6. CALC()

``` css
width: calc(100% - 80px);
```

------------------------------------------------------------------------

# 7. PROPIEDADES DE SCROLL

``` css
html { scroll-behavior: smooth; }
```

------------------------------------------------------------------------

# 8. INITIAL-LETTER

``` css
p::first-letter {
  initial-letter: 3 2;
}
```

------------------------------------------------------------------------

# 9. UNIDADES VIEWPORT MODERNAS

``` css
height: 100dvh;
```

------------------------------------------------------------------------

# 10. MIN-CONTENT, MAX-CONTENT Y FIT-CONTENT

------------------------------------------------------------------------

# 11. COLOR-MIX()

``` css
background: color-mix(in lch, red 40%, blue);
```

------------------------------------------------------------------------

# 12. CLIP-PATH

## Concepto Técnico

`clip-path` permite recortar visualmente un elemento definiendo una
región visible. Todo lo que quede fuera de esa región no se renderiza.

-   No modifica el layout.
-   Afecta únicamente la pintura (paint phase).
-   Puede combinarse con animaciones y transform.
-   Es acelerado por GPU en la mayoría de navegadores modernos.

## Sintaxis General

``` css
selector {
  clip-path: shape();
}
```

Puede usar: - `circle()` - `ellipse()` - `inset()` - `polygon()` -
`path()`

## circle()

``` css
clip-path: circle(50% at 50% 50%);
```

## ellipse()

``` css
clip-path: ellipse(40% 60% at 50% 50%);
```

## inset()

``` css
clip-path: inset(10% 20% 10% 20%);
```

Con bordes redondeados:

``` css
clip-path: inset(10% round 20px);
```

## polygon()

``` css
clip-path: polygon(
  50% 0%,
  100% 50%,
  50% 100%,
  0% 50%
);
```

## path() (Avanzado)

``` css
clip-path: path("M10 10 H 90 V 90 H 10 Z");
```

## Animaciones con clip-path

``` css
.element {
  transition: clip-path 0.5s ease;
}

.element:hover {
  clip-path: circle(75%);
}
```

Ejemplo tipo reveal:

``` css
.reveal {
  clip-path: inset(0 100% 0 0);
}

.reveal.active {
  clip-path: inset(0 0 0 0);
}
```

## Performance

-   `polygon()` con muchos puntos puede ser costoso.
-   Animar demasiados vértices reduce rendimiento.
-   Preferir formas simples cuando se animen.
-   Evitar combinar con filtros pesados si hay animación continua.

------------------------------------------------------------------------

# 13. MASK-IMAGE

Mientras `clip-path` recorta por geometría vectorial, `mask-image` utiliza la transparencia (canal alfa) o luminancia de un degradado o imagen para ocultar suavemente partes de un elemento:

```css
/* Desvanecimiento suave en los bordes de un carrusel horizontal */
.carousel {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}
```

---

# 14. COLOR MODERNO: `oklch()`, `oklab()`, `light-dark()`, `color-mix()` y Relative Color Syntax

### `oklch()` y `oklab()`
Espacios de color **perceptualmente uniformes** que soportan pantallas de gama amplia (Display P3):
- `oklch(L C H / alpha)`: Luminosidad (`0%–100%` o `0–1`), Croma (saturación), Tono (`0deg–360deg`).
- Dos colores en `oklch()` con la misma `L` se perciben exactamente igual de brillantes para el ojo humano.

```css
:root {
  --brand: oklch(62% 0.21 255);
  --brand-soft: oklch(62% 0.21 255 / 0.15);
}
```

### `color-mix()` y Relative Color Syntax
Genera variantes de color dinámicas sin preprocesadores:

```css
.btn {
  background: var(--brand);
}

/* Mezcla 20% negro para estado hover */
.btn:hover {
  background: color-mix(in oklch, var(--brand) 80%, black);
}

/* Relative Color Syntax: aclara o cambia opacidad derivando del token base */
.badge {
  background: oklch(from var(--brand) calc(l + 0.2) c h / 0.2);
  color: oklch(from var(--brand) calc(l + 0.15) c h);
}
```

### `light-dark()`
Define valores para modo claro y oscuro en una sola línea sin duplicar `@media (prefers-color-scheme: dark)`:

```css
:root {
  color-scheme: light dark;
  --surface: light-dark(#ffffff, #0f172a);
  --text: light-dark(#0f172a, #f8fafc);
}
```

---

# 15. `env()` (Variables de Entorno del Dispositivo)

Accede a áreas seguras del dispositivo (notch, Dynamic Island, barra gestual inferior en móviles) cuando se usa `viewport-fit=cover`:

```css
.bottom-bar {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  padding-inline: max(1rem, env(safe-area-inset-left, 0px));
}
```

---

# 16. CSS Anchor Positioning (`anchor()`)

Permite posicionar tooltips, menús y popovers respecto a un elemento ancla en cualquier parte del DOM, sin librerías como Popper.js:

```css
.trigger-btn {
  anchor-name: --mi-boton;
}

.tooltip {
  position: fixed;
  position-anchor: --mi-boton;
  top: calc(anchor(bottom) + 8px);
  left: anchor(center);
  translate: -50% 0;
}
```

---

# 17. ERRORES COMUNES Y BUENAS PRÁCTICAS

### ❌ Errores Comunes
1. **Usar `backdrop-filter: blur()` sin fondo semitransparente:** Si el fondo es opaco (`#fff`), el desenfoque no se nota.
2. **Olvidar `color-scheme: light dark;` al usar `light-dark()`:** Sin esa declaración, `light-dark()` siempre devuelve el valor claro.
3. **Animar `polygon()` con decenas de vértices:** Impacta el rendimiento de pintura.
4. **Olvidar un valor fallback en `env()`:** Usa `env(safe-area-inset-bottom, 0px)` para evitar resultados inválidos en escritorio.

### ✅ Buenas Prácticas
- Adopta `oklch()` + `color-mix()` o Relative Color Syntax para sistemas de diseño escalables.
- Combina `clamp()` con unidades relativas (`rem` + `vw`) para nunca bloquear el zoom de accesibilidad.
- Prefiere `mask-image` con degradados para desvanecimientos suaves y `clip-path` para recortes geométricos nítidos.

------------------------------------------------------------------------

# CONCLUSIÓN PROFESIONAL

Dominar estas funciones permite construir interfaces modernas, adaptables, accesibles y escalables siguiendo los estándares actuales de CSS sin depender de preprocesadores ni JavaScript innecesario.

---

# Hoja de Trucos (Cheatsheet) — Funciones CSS Modernas

| Función | Propósito |
| :--- | :--- |
| `clamp(min, ideal, max)` | Tipografía y tamaños fluidos con límites seguros |
| `calc()` / `min()` / `max()` | Operaciones matemáticas y selección dinámica de límites |
| `color-mix(in oklch, c1 80%, c2)` | Mezcla dinámica de colores en espacios perceptuales |
| `light-dark(claro, oscuro)` | Alterna valores según `color-scheme` en una línea |
| `oklch(L C H / a)` | Color perceptualmente uniforme con soporte de gama amplia P3 |
| `oklch(from var(--c) ...)` | Relative Color Syntax para derivar tonos desde un token |
| `env(safe-area-inset-bottom)` | Respeta áreas seguras (notch/gestos) en móviles |
| `anchor(bottom)` | Posiciona elementos flotantes respecto a un elemento ancla |
| `clip-path` / `mask-image` | Recorte geométrico vectorial o máscara por transparencia |
