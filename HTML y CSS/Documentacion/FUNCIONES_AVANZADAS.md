# FUNCIONES AVANZADAS - GUÍA PROFESIONAL COMPLETA

Guía técnica avanzada y ampliada de funciones modernas de CSS, incluyendo fundamentos internos, rendimiento, casos reales, errores comunes y buenas prácticas.

---

# 1. FILTER

## Concepto Técnico
`filter` aplica efectos gráficos en la etapa de post-renderizado. El navegador primero pinta el elemento y luego aplica el efecto como una capa adicional.

- No altera el layout.
- Se ejecuta en la fase de composición.
- Puede usar aceleración por GPU.

## Sintaxis

```css
selector {
  filter: <filter-function>+;
}
```

Se pueden encadenar múltiples funciones:

```css
filter: blur(5px) brightness(120%) contrast(110%);
```

## Funciones Disponibles

### blur(radius)
Desenfoque gaussiano. Alto costo si se anima con valores grandes.

### brightness()
Multiplica la luminosidad.

### contrast()
Aumenta o reduce diferencia entre claros y oscuros.

### grayscale()
Convierte a escala de grises.

### sepia()
Simula tono fotográfico antiguo.

### invert()
Invierte colores. Útil en dark mode.

### saturate()
Controla intensidad de color.

### hue-rotate()
Rota el matiz en el círculo cromático.

### drop-shadow()
Sombra que respeta transparencia real (diferente a box-shadow).

## Performance
- `blur()` es el más costoso.
- Evitar múltiples filtros animados.
- Preferir transform + opacity cuando sea posible.

---

# 2. BACKDROP-FILTER

Aplica efectos al contenido detrás del elemento.

Requiere fondo con transparencia:

```css
.card {
  backdrop-filter: blur(15px);
  background: rgba(255,255,255,0.2);
}
```

## Casos reales
- Glassmorphism
- Modales
- Navbar flotante

---

# 3. TRANSFORM

No modifica el flujo del documento.
Más eficiente que usar top/left.

## Funciones

### translate()
Movimiento en eje X, Y o Z.

### scale()
Escala proporcional.

### rotate()
Rota en grados.

### skew()
Deforma en ángulo.

## transform-origin
Define punto pivote.

## 3D Avanzado

```css
transform-style: preserve-3d;
perspective: 1000px;
```

---

# 4. MIN(), MAX(), CLAMP()

## min()
Toma el valor menor.

## max()
Toma el mayor.

## clamp()
Sintaxis:

```css
font-size: clamp(min, ideal, max);
```

Ideal para tipografía fluida:

```css
font-size: clamp(1rem, 1.5vw + 1rem, 2rem);
```

---

# 5. VARIABLES CSS

## Definición

```css
:root {
  --primary-color: #3498db;
}
```

## Uso

```css
color: var(--primary-color);
```

## Scope dinámico
Las variables pueden redefinirse por componente.

## Casos profesionales
- Theming
- Dark mode
- Sistemas de diseño

---

# 6. CALC()

Permite operaciones matemáticas.

```css
width: calc(100% - 80px);
```

Reglas:
- Espacios obligatorios entre operadores.
- Unidades compatibles.

---

# 7. PROPIEDADES DE SCROLL

## scroll-behavior

```css
html { scroll-behavior: smooth; }
```

## scroll-snap-type
Define eje y comportamiento.

## scroll-snap-align
Define alineación del hijo.

## scroll-margin
Espacio externo del snap.

## scroll-padding
Espacio interno del contenedor.

## scrollbar-width (Firefox)

```css
scrollbar-width: thin;
```

Valores:
- auto
- thin
- none

## Webkit Scrollbar

```css
::-webkit-scrollbar {}
::-webkit-scrollbar-thumb {}
::-webkit-scrollbar-track {}
```

## scroll-timeline (experimental)
Permite animaciones basadas en scroll.

---

# 8. INITIAL-LETTER

Permite drop cap editorial real.

```css
p::first-letter {
  initial-letter: 3 2;
}
```

---

# 9. UNIDADES VIEWPORT MODERNAS

Problema: 100vh falla en móviles.

## lvh
Largest viewport height.

## svh
Smallest viewport height.

## dvh
Dynamic viewport height.

```css
height: 100dvh;
```

---

# 10. MIN-CONTENT, MAX-CONTENT Y FIT-CONTENT

## min-content
Tamaño mínimo posible.

## max-content
Tamaño máximo sin romper línea.

## fit-content()
Limita crecimiento máximo.

---

# 11. COLOR-MIX()

Permite mezclar colores.

```css
background: color-mix(in lch, red 40%, blue);
```

Espacios recomendados:
- srgb
- lab
- lch

---

# RUTA DE APRENDIZAJE INTEGRADA (POST HTML + CSS 24H)

## ETAPA 1 - JavaScript Fundamentos
- Variables y tipos
- Condicionales
- Bucles
- Funciones
- Arrays y objetos
- 30 ejercicios de lógica
- Proyecto: Calculadora avanzada

## ETAPA 2 - DOM e Interactividad
- querySelector
- addEventListener
- LocalStorage
- JSON
- Proyecto: Reloj mejorado
- Proyecto: To-Do List PRO

## ETAPA 3 - JavaScript Intermedio
- Fetch API
- Promesas
- Async/Await
- try/catch
- Proyecto: App con API real

## ETAPA 4 - Profesionalización
- Git y GitHub
- Deploy
- Proyecto integrador final

## ETAPA 5 - Nivel Empleo
- Node.js
- Express
- Bases de datos
- React
- Proyecto Full Stack con CRUD y autenticación

---

# CONCLUSIÓN PROFESIONAL

Este documento integra fundamentos técnicos avanzados de CSS moderno junto con una ruta estructurada de aprendizaje frontend y full stack.

Dominar estos conceptos permite construir interfaces modernas, optimizadas y escalables siguiendo estándares actuales de desarrollo web.

