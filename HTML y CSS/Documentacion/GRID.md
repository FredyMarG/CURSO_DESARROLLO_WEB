```markdown
# Guía Completa de CSS Grid

## 1. ¿Qué es CSS Grid?

CSS Grid Layout es un sistema de diseño **bidimensional** para la web que permite trabajar con filas y columnas al mismo tiempo. Fue creado para resolver maquetaciones complejas que antes se hacían con floats, posicionamiento absoluto o hacks.

Grid se basa en una cuadrícula compuesta por:
- Contenedor (grid container).
- Elementos hijos (grid items).
- Líneas de grid (horizontales y verticales).
- Tracks (filas y columnas).
- Celdas.
- Áreas de grid.

Se utiliza principalmente para:
- Dividir una página en grandes regiones (header, sidebar, contenido, footer).
- Definir relaciones de tamaño, posición y alineación entre múltiples elementos.

---

## 2. Conceptos básicos: contenedor e ítems

### 2.1 Grid container

Un **grid container** es cualquier elemento al que se le aplica `display: grid` o `display: inline-grid`.

```css
.container {
  display: grid;
}
```

Al hacerlo:
- Sus hijos directos se convierten automáticamente en grid items.
- Se activa el contexto de grid para propiedades como `grid-template-columns`, `gap`, `justify-items`, etc.

### 2.2 Grid items

Los **grid items** son los hijos directos del contenedor grid. Estos elementos pueden:
- Ocupar una celda, varias columnas, varias filas o un área completa mediante `grid-column`, `grid-row` o `grid-area`.
- Controlar su alineación individual con `justify-self`, `align-self` y `place-self`.

---

## 3. Creando una cuadrícula básica

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
```

Puntos clave:
- `grid-template-columns` define el número y tamaño de las columnas.
- `grid-template-rows` define el número y tamaño de las filas.
- `gap` configura el espacio entre filas y columnas (equivale a `row-gap` + `column-gap`).

Detalles de líneas:
- Las líneas del grid empiezan en 1, tanto para filas como para columnas.
- Se pueden usar índices negativos: `-1` representa la última línea en esa dimensión.
- Grid puede crear tracks implícitos cuando se colocan ítems fuera del grid explícito.

Buenas prácticas al definir el grid:
- Declarar siempre algún `gap` para evitar colisiones visuales entre ítems.
- Evitar que todas las columnas sean 100% fijas; combinar tamaños fijos con unidades flexibles como `fr`.
- Usar nombres de clases claros para contenedor e ítems (ej.: `.layout`, `.layout__sidebar`, etc.).

---

## 4. Unidades clave: `auto` y `fr`

### 4.1 Unidad `auto`

`auto` ajusta el tamaño del track según el contenido.

Características:
- Si el contenido crece, la columna/fila puede expandirse para acomodarlo.
- Puede provocar columnas desbalanceadas si un ítem tiene contenido muy largo.

Ejemplo:

```css
grid-template-columns: auto 1fr;
```

La primera columna se ajusta al contenido, la segunda ocupa el espacio restante.

### 4.2 Unidad `fr` (fraction)

`fr` representa una fracción del espacio disponible dentro del contenedor una vez descontados tamaños fijos y gaps.

```css
grid-template-columns: 250px 2fr 1fr;
```

Proceso:
1. Se reservan 250px para la primera columna.
2. Se resta también el espacio ocupado por `gap` entre columnas.
3. El espacio restante se divide en 3 partes (2fr + 1fr).
4. La columna `2fr` recibe el doble de ancho que la de `1fr`.

Ventajas:
- Permite diseños fluidos sin tener que calcular porcentajes manualmente.
- Facilita la creación de columnas proporcionales (ej.: 2/3 y 1/3).

---

## 5. Funciones `repeat()` y `minmax()`

### 5.1 `repeat()`

Simplifica la definición de múltiples columnas o filas con patrones repetidos.

```css
grid-template-columns: repeat(4, 1fr);
```

Esto crea 4 columnas de igual tamaño (1fr cada una).

Beneficios:
- Mejora la legibilidad y mantenimiento del código.
- Facilita cambios futuros (solo se modifica el número o el tamaño en un lugar).

### 5.2 `minmax()`

Define un tamaño mínimo y máximo para un track.

```css
grid-template-columns: repeat(3, minmax(200px, 1fr));
```

Cada columna:
- Nunca será menor de 200px.
- Puede crecer hasta 1fr, compartiendo el espacio con otras columnas.

Uso típico:
- Galerías de tarjetas que no deben volverse demasiado estrechas pero sí adaptarse al ancho disponible.

---

## 6. `auto-fit` vs `auto-fill`

Ambos se usan con `repeat()` para grids dinámicos.

Ejemplo base:

```css
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

- `auto-fill`: rellena la fila con el máximo número de columnas posibles aunque queden “huecos” vacíos reservados por columnas sin contenido.
- `auto-fit`: colapsa esas columnas vacías para que el espacio se redistribuya entre las columnas con contenido.

Recomendación:
- Usar principalmente `auto-fit` para layouts responsive fluidos de tarjetas.

---

## 7. Grid explícito e implícito

### 7.1 Grid explícito

El **grid explícito** es el definido directamente con `grid-template-columns` y `grid-template-rows`.

Ejemplo:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
}
```

Aquí se definen:
- 3 columnas explícitas.
- 2 filas explícitas.

### 7.2 Grid implícito

Cuando hay más ítems de los que caben en el grid explícito, CSS crea filas o columnas adicionales llamadas **grid implícito**.

Se controla con:
- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

Ejemplo para controlar la altura de filas implícitas:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
}
```

Beneficio:
- Evita alturas impredecibles en filas que no se han declarado explícitamente.

---

## 8. Grid dinámico y responsive

Un patrón muy usado:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

Ventajas:
- No necesita media queries para ajustar el número de columnas.
- Las tarjetas se redistribuyen automáticamente al cambiar el ancho del viewport.

Cuándo usar media queries:
- Cuando cambia la **estructura** del layout (por ejemplo, pasar de un diseño con sidebar a uno de una sola columna).
- Cuando se necesita modificar gaps, tipografía o áreas nombradas según el breakpoint.

---

## 9. Posicionamiento con `grid-column` y `grid-row`

### 9.1 Sintaxis básica

```css
.item {
  grid-column: 1 / span 2;
  grid-row: 1 / 3;
}
```

- `grid-column: inicio / fin`
- `grid-row: inicio / fin`

Se puede usar:
- Números de líneas (por ejemplo, `1 / 3`).
- `span n` para indicar cuántas líneas/track se debe abarcar.
- Índices negativos como `-1` para referirse a la última línea.

Ejemplo para abarcar todo el ancho:

```css
.item-destacado {
  grid-column: 1 / -1;
}
```

### 9.2 Casos de uso reales

- Hero a ancho completo en la parte superior.
- Producto o card destacado que ocupa dos columnas.
- Sidebars que se extienden por varias filas.

---

## 10. Flujo automático: `grid-auto-flow` y `dense`

`grid-auto-flow` define cómo se colocan los ítems que no tienen una posición explícita.

Valores principales:
- `row`: llena por filas, agregando nuevas filas según sea necesario.
- `column`: llena por columnas.
- `row dense` / `column dense`: intenta rellenar huecos optimizando el espacio.

Ejemplo:

```css
.container {
  display: grid;
  grid-auto-flow: row dense;
}
```

`dense`:
- Intenta recolocar ítems más pequeños en huecos libres.
- Puede cambiar el orden visual respecto al orden del DOM, lo que impacta accesibilidad si se abusa.

Uso típico:
- Galerías tipo masonry donde el orden exacto no es crítico.

---

## 11. Áreas de grid (`grid-template-areas`)

Permite definir layout declarativo usando nombres de áreas.

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  gap: 1rem;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }
```

Ventajas:
- Hace el layout más legible y auto-documentado.
- Facilita cambiar la disposición con media queries reorganizando solo las cadenas de `grid-template-areas`.
- Mejora la comprensión del layout en equipos multidisciplinares (diseño/dev).

Restricciones:
- Todas las filas deben tener el mismo número de “celdas” (misma cantidad de nombres).
- Un área rectangular no puede estar fragmentada; debe ser un bloque contiguo.

---

## 12. Alineación en CSS Grid

A nivel **contenedor**:
- `justify-content`: alinea el grid completo en el eje horizontal dentro del contenedor.
- `align-content`: alinea el grid completo en el eje vertical.
- `place-content`: shorthand para `align-content` + `justify-content`.

A nivel **ítems**:
- `justify-items`: alineación horizontal por defecto de todos los ítems (por celda).
- `align-items`: alineación vertical por defecto de todos los ítems.
- `place-items`: shorthand para `align-items` + `justify-items`.

A nivel de ítem individual:
- `justify-self`: alineación horizontal de un ítem concreto.
- `align-self`: alineación vertical de un ítem concreto.
- `place-self`: shorthand para ambos.

Ejemplo:

```css
.container {
  display: grid;
  justify-items: center;
  align-items: start;
}

.item-destacado {
  align-self: center;
  justify-self: stretch;
}
```

---

## 13. Subgrid

`subgrid` es una característica avanzada que permite a un grid hijo heredar las filas y/o columnas del grid padre.

Ejemplo básico:

```css
.parent {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

Características:
- El grid hijo comparte las líneas del padre, garantizando alineación perfecta entre elementos anidados.
- Reduce duplicación de definiciones de tracks (se evita repetir tamaños de columnas en múltiples niveles).
- Es especialmente útil en layouts complejos, formularios largos y componentes que deben alinearse con la rejilla global.

Consideraciones:
- El soporte de navegador ha sido progresivo; conviene revisar compatibilidad antes de depender totalmente de subgrid.
- Es buena idea planear fallbacks cuando se apunta a navegadores antiguos.

---

## 14. Propiedades completas de CSS Grid

Principales propiedades relacionadas con Grid en CSS:

- `display: grid | inline-grid`
- `grid-template-columns`
- `grid-template-rows`
- `grid-template-areas`
- `grid-template` (shorthand)
- `grid-auto-columns`
- `grid-auto-rows`
- `grid-auto-flow`
- `grid-row-start`
- `grid-row-end`
- `grid-row`
- `grid-column-start`
- `grid-column-end`
- `grid-column`
- `grid-area`
- `grid` (shorthand que combina template + auto-* + auto-flow)
- `row-gap`
- `column-gap`
- `gap`
- `justify-items`
- `align-items`
- `place-items`
- `justify-content`
- `align-content`
- `place-content`
- `justify-self`
- `align-self`
- `place-self`

Estas propiedades permiten controlar estructura, colocación, espacios, y alineación tanto global como individual.

---

## 15. Errores comunes

- No usar `gap`, generando interfaces densas y difíciles de leer.
- Abusar de tamaños fijos (px) en lugar de `fr`, `minmax` o porcentajes, reduciendo la capacidad responsive del layout.
- No controlar el grid implícito con `grid-auto-rows` o `grid-auto-columns`, provocando tracks inesperados.
- Mezclar Grid y Flexbox sin una estrategia clara, lo que complica el mantenimiento.
- No probar el layout en múltiples tamaños de pantalla y orientaciones.

---

## 16. Buenas prácticas de nivel senior

- Usar Grid para el **macro layout** (estructuras generales: header, sidebar, main, footer) y Flexbox para el **micro layout** (alineación interna de componentes).
- Definir grids responsivos con `repeat(auto-fit, minmax(...))` siempre que sea posible para reducir media queries.
- Aprovechar `grid-template-areas` para layouts declarativos y fáciles de refactorizar.
- Mantener una jerarquía clara de contenedores grid y documentar qué grid gobierna cada zona del diseño.
- Usar `subgrid` en sistemas de diseño grandes para alinear componentes anidados sin duplicar definiciones de tracks.
- Encapsular patrones de grid frecuentes en utilidades o componentes reutilizables (por ejemplo, clases utilitarias o componentes de diseño en frameworks).

---

## 17. Ejemplo completo de layout con Grid

```css
body {
  margin: 0;
}

.layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  min-height: 100vh;
  gap: 1.5rem;
  padding: 1.5rem;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }

/* Responsive: en móviles, una sola columna */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      "header"
      "sidebar"
      "content"
      "footer";
  }
}
```

Este patrón:
- Usa `grid-template-areas` para estructurar el layout.
- Se adapta a mobile cambiando solo el template en el breakpoint.
- Ilustra el uso de Grid como capa de arquitectura visual de alto nivel.
```