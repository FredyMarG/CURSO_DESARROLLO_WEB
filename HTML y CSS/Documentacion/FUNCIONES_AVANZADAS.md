# FUNCIONES AVANZADAS

Guía técnica detallada de funciones y conceptos modernos de CSS.

------------------------------------------------------------------------

# 1. FILTER

## Concepto

`filter` aplica efectos gráficos post-procesados al elemento completo.

## Sintaxis

``` css
element {
  filter: función(valor);
}
```

## Funciones

### blur()

``` css
filter: blur(10px);
```

Aplica desenfoque gaussiano.

### brightness()

``` css
filter: brightness(1.5);
```

Multiplica valores RGB.

### contrast()

``` css
filter: contrast(150%);
```

### grayscale()

``` css
filter: grayscale(100%);
```

### sepia()

``` css
filter: sepia(100%);
```

### invert()

``` css
filter: invert(100%);
```

### saturate()

``` css
filter: saturate(200%);
```

### hue-rotate()

``` css
filter: hue-rotate(90deg);
```

### drop-shadow()

``` css
filter: drop-shadow(5px 5px 10px black);
```

------------------------------------------------------------------------

# 2. BACKDROP-FILTER

Aplica filtros al contenido detrás del elemento.

``` css
.card {
  backdrop-filter: blur(15px);
  background: rgba(255,255,255,0.2);
}
```

------------------------------------------------------------------------

# 3. TRANSFORM

Modifica visualmente sin alterar layout.

## translate()

``` css
transform: translate(50px, 20px);
```

## scale()

``` css
transform: scale(1.2);
```

## rotate()

``` css
transform: rotate(45deg);
```

## skew()

``` css
transform: skew(10deg, 5deg);
```

## transform-origin

``` css
transform-origin: top left;
```

------------------------------------------------------------------------

# 4. MIN(), MAX(), CLAMP()

## min()

``` css
width: min(600px, 90%);
```

## max()

``` css
width: max(300px, 50%);
```

## clamp()

``` css
font-size: clamp(1rem, 2vw, 2rem);
```

------------------------------------------------------------------------

# 5. VARIABLES CSS

## Definición

``` css
:root {
  --primary-color: #3498db;
}
```

## Uso

``` css
color: var(--primary-color);
```

## Fallback

``` css
color: var(--color, blue);
```

------------------------------------------------------------------------

# 6. CALC()

``` css
width: calc(100% - 80px);
```

Permite operaciones matemáticas con unidades compatibles.

------------------------------------------------------------------------

# 7. PROPIEDADES DE SCROLL

## scroll-behavior

``` css
html {
  scroll-behavior: smooth;
}
```

## scroll-snap-type

``` css
.container {
  scroll-snap-type: y mandatory;
}
```

## scroll-snap-align

``` css
.section {
  scroll-snap-align: start;
}
```

## scroll-margin

``` css
section {
  scroll-margin-top: 80px;
}
```

## scroll-padding

``` css
.container {
  scroll-padding-top: 80px;
}
```

------------------------------------------------------------------------

# 8. INITIAL-LETTER

``` css
p::first-letter {
  initial-letter: 3;
}
```

------------------------------------------------------------------------

# 9. UNIDADES VIEWPORT MODERNAS

## lvh

Altura máxima del viewport.

## svh

Altura mínima del viewport.

## dvh

``` css
height: 100dvh;
```

------------------------------------------------------------------------

# 10. MIN-CONTENT, MAX-CONTENT Y FIT-CONTENT

## min-content

``` css
width: min-content;
```

## max-content

``` css
width: max-content;
```

## fit-content()

``` css
width: fit-content(300px);
```

------------------------------------------------------------------------

# 11. COLOR-MIX()

``` css
background: color-mix(in srgb, red 50%, blue 50%);
```

Permite mezclar colores en distintos espacios de color como srgb, lab y
lch.

------------------------------------------------------------------------

# CONCLUSIÓN

Estas funciones permiten crear interfaces modernas, responsivas y
optimizadas en rendimiento utilizando CSS avanzado.
