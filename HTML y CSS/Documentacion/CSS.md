
# Introducción a CSS

CSS (*Cascading Style Sheets*) es el lenguaje que describe la presentación (colores, tamaños, posiciones, animaciones, etc.) de documentos HTML o XML.  
Una hoja de estilo CSS se compone de reglas que aplican declaraciones (`propiedad: valor`) a elementos seleccionados mediante selectores.

---

# Sintaxis básica

```css
selector {
  propiedad: valor;
  otra-propiedad: otro-valor;
}
```

- **Selector**: define a qué elementos del documento se aplica la regla.  
- **Declaraciones**: pares `propiedad: valor` separados por `;`.

---

# Selectores principales

CSS define un conjunto amplio de selectores para apuntar a elementos del DOM.

## Tabla de selectores comunes

| Tipo                 | Ejemplo                | Descripción breve                                                                 |
|----------------------|------------------------|-----------------------------------------------------------------------------------|
| Universal            | `*`                    | Selecciona todos los elementos.                                           |
| Tipo (etiqueta)      | `p`, `h1`, `div`       | Selecciona por nombre de elemento.                                        |
| Clase                | `.btn`                 | Elementos con `class="btn"`.                                              |
| ID                   | `#main`                | Elemento con `id="main"`.                                                 |
| Atributo             | `a[target="_blank"]`   | Elementos con atributo que cumple una condición.                          |
| Descendiente         | `nav a`                | `a` dentro de `nav` (en cualquier profundidad).                           |
| Hijo directo         | `ul > li`              | `li` hijos directos de `ul`.                                              |
| Hermano adyacente    | `h2 + p`               | Primer `p` inmediatamente después de `h2`.                                |
| Hermano general      | `h2 ~ p`               | Todos los `p` hermanos posteriores de `h2`.                               |
| Pseudo‑clase estado  | `a:hover`              | Estado especial, por ejemplo, al pasar el ratón.                          |
| Pseudo‑clase estructura | `li:first-child`    | Según posición entre hermanos.                                            |
| Pseudo‑elemento      | `p::first-line`        | Parte de un elemento (primera línea, letra, etc.).                        |

---

# Propiedades por categoría

A continuación, una **tabla de referencia rápida** con muchas de las propiedades CSS más usadas, agrupadas por función (no exhaustiva, pero amplia).

## Texto y tipografía

| Propiedad        | Ejemplo                 | Descripción breve                                                                |
|------------------|-------------------------|----------------------------------------------------------------------------------|
| `color`          | `color: #333;`          | Color del texto.                                                         |
| `font-family`    | `font-family: Arial;`   | Familia de fuente preferida.                                             |
| `font-size`      | `font-size: 16px;`      | Tamaño de la fuente.                                                     |
| `font-weight`    | `font-weight: 700;`     | Grosor (`normal`, `bold`, `100–900`).                                    |
| `font-style`     | `font-style: italic;`   | Estilo (`normal`, `italic`, `oblique`).                                  |
| `line-height`    | `line-height: 1.5;`     | Altura de línea.                                                         |
| `font-variant`   | `font-variant: small-caps;` | Variantes tipográficas (versalitas, etc.).                           |
| `text-align`     | `text-align: center;`   | Alineación horizontal del texto.                                         |
| `text-decoration`| `text-decoration: underline;` | Subrayado, tachado, etc.                                           |
| `text-transform` | `text-transform: uppercase;` | Mayúsculas, minúsculas, capitalización.                             |
| `letter-spacing` | `letter-spacing: 0.05em;` | Espacio entre letras.                                                |
| `word-spacing`   | `word-spacing: 0.2em;`  | Espacio entre palabras.                                                  |
| `text-indent`    | `text-indent: 2em;`     | Sangría de la primera línea.                                             |
| `white-space`    | `white-space: nowrap;`  | Cómo se manejan espacios y saltos de línea.                              |
| `text-overflow`  | `text-overflow: ellipsis;` | Cómo mostrar texto recortado (p. ej. `...`).                         |

---

## Fondo y color

| Propiedad            | Ejemplo                                   | Descripción breve                                                                 |
|----------------------|-------------------------------------------|-----------------------------------------------------------------------------------|
| `background-color`   | `background-color: #f5f5f5;`             | Color de fondo.                                                           |
| `background-image`   | `background-image: url(bg.png);`         | Imagen de fondo.                                                          |
| `background-repeat`  | `background-repeat: no-repeat;`          | Repetición de la imagen de fondo.                                         |
| `background-position`| `background-position: center center;`    | Posición inicial del fondo.                                               |
| `background-size`    | `background-size: cover;`                | Tamaño del fondo (`auto`, `cover`, `contain`, etc.).                      |
| `background-attachment` | `background-attachment: fixed;`      | Fijo respecto a la ventana o al elemento.                                 |
| `background-clip`    | `background-clip: padding-box;`          | Hasta dónde se pinta el fondo.                                            |
| `background`         | `background: #000 url(bg.png) no-repeat center/cover;` | Atajo para múltiples propiedades de fondo. |

---

## Modelo de caja (Box model), espaciado y borde

| Propiedad        | Ejemplo                      | Descripción breve                                                                |
|------------------|------------------------------|----------------------------------------------------------------------------------|
| `width`          | `width: 300px;`              | Ancho del contenido.                                                     |
| `height`         | `height: 200px;`             | Alto del contenido.                                                      |
| `max-width`      | `max-width: 100%;`           | Ancho máximo.                                                            |
| `max-height`     | `max-height: 80vh;`          | Alto máximo.                                                             |
| `min-width`      | `min-width: 200px;`          | Ancho mínimo.                                                            |
| `min-height`     | `min-height: 50px;`          | Alto mínimo.                                                             |
| `padding`        | `padding: 1rem;`             | Relleno interno (atajo).                                                 |
| `padding-top`    | `padding-top: 10px;`         | Relleno por lado.                                                        |
| `margin`         | `margin: 0 auto;`            | Margen externo (atajo).                                                  |
| `margin-top`     | `margin-top: 2rem;`          | Margen por lado.                                                         |
| `border`         | `border: 1px solid #ccc;`    | Borde completo (atajo).                                                  |
| `border-width`   | `border-width: 2px;`         | Ancho del borde.                                                         |
| `border-style`   | `border-style: dashed;`      | Estilo (`solid`, `dashed`, etc.).                                        |
| `border-color`   | `border-color: red;`         | Color del borde.                                                         |
| `border-radius`  | `border-radius: 8px;`        | Esquinas redondeadas.                                                    |
| `box-sizing`     | `box-sizing: border-box;`    | Cómo se calcula `width` (incluyendo borde y padding o no).               |
| `box-shadow`     | `box-shadow: 0 4px 10px rgba(0,0,0,0.2);` | Sombra externa de la caja.                                           |

---

## Display, flujo y posicionamiento

| Propiedad       | Ejemplo                         | Descripción breve                                                                 |
|-----------------|----------------------------------|-----------------------------------------------------------------------------------|
| `display`       | `display: block;`               | Tipo de caja (`block`, `inline`, `flex`, `grid`, etc.).                   |
| `visibility`    | `visibility: hidden;`           | Oculta manteniendo el espacio.                                            |
| `overflow`      | `overflow: auto;`               | Comportamiento del contenido que se desborda.                             |
| `overflow-x`    | `overflow-x: scroll;`           | Desbordamiento horizontal.                                                |
| `overflow-y`    | `overflow-y: hidden;`           | Desbordamiento vertical.                                                  |
| `position`      | `position: absolute;`           | Modelo de posicionamiento (`static`, `relative`, `absolute`, `fixed`, `sticky`). |
| `top` / `left` / `right` / `bottom` | `top: 0; left: 0;` | Offset cuando `position` ≠ `static`.                                  |
| `z-index`       | `z-index: 10;`                  | Orden de apilamiento.                                                     |
| `float`         | `float: left;`                  | Flotado (layout clásico).                                                 |
| `clear`         | `clear: both;`                  | Cancelación de flotados.                                                  |

---

## Flexbox

| Propiedad           | Ejemplo                          | Descripción breve                                                                |
|---------------------|-----------------------------------|----------------------------------------------------------------------------------|
| `display`           | `display: flex;`                 | Activa el contexto flex.                                                 |
| `flex-direction`    | `flex-direction: row;`           | Dirección principal (`row`, `column`).                                   |
| `flex-wrap`         | `flex-wrap: wrap;`               | Permite que los ítems salten de línea.                                   |
| `flex-flow`         | `flex-flow: row wrap;`           | Atajo para dirección y wrap.                                             |
| `justify-content`   | `justify-content: space-between;`| Distribución en el eje principal.                                        |
| `align-items`       | `align-items: center;`           | Alineación en el eje cruzado.                                            |
| `align-content`     | `align-content: flex-start;`     | Alinea las líneas cuando hay múltiples filas.                            |
| `gap`               | `gap: 1rem;`                     | Espacio entre ítems.                                                     |
| `flex-grow`         | `flex-grow: 1;`                  | Capacidad de crecer para ocupar espacio.                                 |
| `flex-shrink`       | `flex-shrink: 0;`                | Capacidad de encoger.                                                    |
| `flex-basis`        | `flex-basis: 200px;`             | Tamaño base antes de distribuir espacio.                                 |
| `flex`              | `flex: 1 0 200px;`               | Atajo para grow, shrink y basis.                                         |
| `align-self`        | `align-self: flex-end;`          | Alineación de un ítem individual.                                        |

---

## Grid

| Propiedad                | Ejemplo                                 | Descripción breve                                                                 |
|--------------------------|------------------------------------------|-----------------------------------------------------------------------------------|
| `display`                | `display: grid;`                        | Activa el contexto grid.                                                 |
| `grid-template-columns`  | `grid-template-columns: 1fr 2fr;`       | Definición de columnas.                                                  |
| `grid-template-rows`     | `grid-template-rows: auto 1fr auto;`    | Definición de filas.                                                     |
| `grid-template-areas`    | `grid-template-areas: "h h" "s m" "f f";` | Áreas nombradas.                                                       |
| `grid-column-gap` / `grid-row-gap` | `grid-column-gap: 1rem;`    | Separación entre columnas/filas (predecesor de `column-gap`/`row-gap`).  |
| `gap`                    | `gap: 1rem;`                            | Espaciado general en grid/flex.                                          |
| `justify-items`          | `justify-items: center;`                | Alineación horizontal de ítems en sus celdas.                            |
| `align-items`            | `align-items: start;`                   | Alineación vertical de ítems.                                            |
| `justify-content`        | `justify-content: center;`              | Alineación del grid dentro del contenedor.                               |
| `align-content`          | `align-content: space-between;`         | Distribución vertical del grid como bloque.                              |
| `grid-column`            | `grid-column: 1 / 3;`                   | Inicio/fin de columna de un ítem.                                        |
| `grid-row`               | `grid-row: 2 / 4;`                      | Inicio/fin de fila de un ítem.                                           |

---

## Transformaciones, transiciones y animaciones

| Propiedad         | Ejemplo                                | Descripción breve                                                                 |
|-------------------|-----------------------------------------|-----------------------------------------------------------------------------------|
| `transform`       | `transform: translateY(-4px) scale(1.1);` | Mover, escalar, rotar, sesgar.                                         |
| `transform-origin`| `transform-origin: center center;`      | Punto de origen de la transformación.                                     |
| `transition-property` | `transition-property: background;` | Qué propiedades se animan en una transición.                             |
| `transition-duration` | `transition-duration: 0.3s;`       | Duración de la transición.                                               |
| `transition-timing-function` | `transition-timing-function: ease;` | Curva de velocidad (por ejemplo `ease`, `linear`).                 |
| `transition-delay` | `transition-delay: 0.1s;`             | Retardo antes de iniciar la transición.                                   |
| `transition`      | `transition: all 0.2s ease-in-out;`    | Atajo para las anteriores.                                               |
| `animation-name`  | `animation-name: fade-in;`             | Nombre de la animación definida con `@keyframes`.                        |
| `animation-duration` | `animation-duration: 1s;`          | Duración de un ciclo.                                                    |
| `animation-timing-function` | `animation-timing-function: ease-out;` | Curva de la animación.                                         |
| `animation-iteration-count` | `animation-iteration-count: infinite;` | Número de repeticiones.                                           |
| `animation-direction` | `animation-direction: alternate;`  | Dirección (normal, inversa, alterna).                                    |
| `animation-delay` | `animation-delay: 0.5s;`               | Retardo antes de iniciar la animación.                                   |
| `animation-fill-mode` | `animation-fill-mode: forwards;`   | Cómo se comporta antes/después de la animación.                          |
| `animation`       | `animation: fade-in 1s ease-out both;` | Atajo para las propiedades de animación.                                 |

---

## Opacidad, filtros y mezcla

| Propiedad      | Ejemplo                               | Descripción breve                                                                 |
|----------------|----------------------------------------|-----------------------------------------------------------------------------------|
| `opacity`      | `opacity: 0.5;`                       | Transparencia del elemento (0–1).                                         |
| `filter`       | `filter: blur(4px) grayscale(0.5);`   | Filtros gráficos como desenfoque, contraste, etc.                         |
| `mix-blend-mode` | `mix-blend-mode: multiply;`         | Cómo se mezclan los píxeles con el fondo.                                 |
| `background-blend-mode` | `background-blend-mode: screen;` | Mezcla entre capas de fondo.                                          |

---

## Layout responsive y unidades

| Propiedad / concepto | Ejemplo                          | Descripción breve                                                                 |
|----------------------|-----------------------------------|-----------------------------------------------------------------------------------|
| `@media`             | `@media (max-width: 600px) {}`   | Media queries para adaptar el diseño a dispositivos.                     |
| `max-width`          | `max-width: 100%;`               | Limitar ancho para diseños fluidos.                                       |
| Unidades relativas   | `font-size: 1.2rem;`             | Medidas relativas a `root` (`rem`) o a elemento (`em`).                   |
| Unidades viewport    | `height: 100vh;`                 | Medidas respecto a la ventana (`vh`, `vw`).                               |
| `clamp()`            | `font-size: clamp(1rem, 2vw, 2rem);` | Fija mínimo, preferido y máximo en un valor.                         |

---

## Variables (propiedades personalizadas)

| Elemento           | Ejemplo                                   | Descripción breve                                                                 |
|--------------------|-------------------------------------------|-----------------------------------------------------------------------------------|
| Definición (`--*`) | `--color-primary: #2563eb;`               | Propidades personalizadas definidas por el autor.                         |
| Uso `var()`        | `background: var(--color-primary);`       | Lectura del valor de una custom property.                                 |
| Alcance/herencia   | Definir en `:root` para uso global        | Se heredan por defecto como otras propiedades.                            |

```css
:root {
  --color-primary: #2563eb;
  --spacing-md: 1rem;
}

button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
}
```

---

# At‑rules clave

| At‑rule     | Ejemplo                        | Descripción breve                                                                 |
|-------------|---------------------------------|-----------------------------------------------------------------------------------|
| `@import`   | `@import url("reset.css");`    | Importa otra hoja de estilos.                                           |
| `@media`    | `@media (max-width: 768px){}` | Aplica estilos bajo condiciones de media.                               |
| `@font-face`| Define fuentes externas        | Carga fuentes personalizadas.                                           |
| `@keyframes`| `@keyframes fade-in { ... }`   | Define fotogramas de animaciones CSS.                                   |
| `@supports` | `@supports (display: grid){}` | Aplica estilos solo si el navegador soporta una característica. [web:16]         |

Ejemplo con `@keyframes`:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.modal {
  animation: fade-in 0.4s ease-out;
}
```

---
