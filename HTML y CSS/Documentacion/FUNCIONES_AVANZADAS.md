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

# CONCLUSIÓN PROFESIONAL

Dominar estos conceptos permite construir interfaces modernas,
optimizadas y escalables siguiendo estándares actuales de desarrollo
web.
