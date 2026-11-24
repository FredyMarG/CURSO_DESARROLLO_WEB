# Guía completa de Flexbox en CSS

Flexbox es un modo de diseño de CSS para alinear y distribuir elementos en una dimensión (fila o columna) de forma flexible y responsiva.

---

## 1. Idea central de Flexbox

- Flexbox se activa poniendo `display: flex` (o `inline-flex`) en un contenedor; sus hijos directos se convierten en **flex items**.
- Está pensado para controlar una sola dimensión a la vez: fila (horizontal) o columna (vertical), con alineación precisa.
- Los ítems pueden encogerse, crecer y reordenarse sin cambiar el HTML, solo con CSS.

### Ejemplo mínimo

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

```css
.container {
  display: flex;
}
```

Esto ya coloca los ítems `1`, `2` y `3` en fila.

---

## 2. Ejes: `main axis` y `cross axis`

`flex-direction` define el eje principal:
- `row` (por defecto): eje principal horizontal, eje cruzado vertical.
- `column`: eje principal vertical, eje cruzado horizontal.
- `row-reverse`, `column-reverse`: invierten el orden visual de los ítems.

Las propiedades de alineación se entienden respecto a estos ejes:
- `justify-content`: alinea sobre el **eje principal**.
- `align-items` y `align-content`: alinean sobre el **eje cruzado**.

---

## 3. Propiedades del contenedor (padre)

Se aplican al elemento que tiene `display: flex` o `inline-flex`.

### 3.1. `display`

```css
.container {
  display: flex;        /* bloque flex */
  /* o */
  display: inline-flex; /* inline flex */
}
```

### 3.2. `flex-direction`

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

- `row`: ítems de izquierda a derecha.
- `row-reverse`: de derecha a izquierda.
- `column`: de arriba hacia abajo.
- `column-reverse`: de abajo hacia arriba.

### 3.3. `flex-wrap`

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

- `nowrap` (por defecto): todo en una sola línea.
- `wrap`: permite que los ítems salten a nuevas filas/columnas cuando no caben.
- `wrap-reverse`: igual que `wrap`, pero invierte la dirección del salto.

### 3.4. `flex-flow` (atajo)

```css
.container {
  flex-flow: row wrap; /* flex-direction + flex-wrap */
}
```

### 3.5. `justify-content` (eje principal)

```css
.container {
  justify-content: flex-start | flex-end | center
                   | space-between | space-around | space-evenly;
}
```

- `flex-start`: todos al inicio.
- `flex-end`: todos al final.
- `center`: centrados como bloque.
- `space-between`: primero al inicio, último al final y el resto repartidos.
- `space-around`: espacios iguales alrededor de cada ítem.
- `space-evenly`: todos los espacios exactamente iguales (inicio, entre ítems y final).

### 3.6. `align-items` (eje cruzado, una línea)

```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
```

- `stretch` (por defecto): estira los ítems para ocupar todo el eje cruzado.
- `flex-start` / `flex-end` / `center`: al inicio, final o centro del eje cruzado.
- `baseline`: alinea según la línea de base del texto.

### 3.7. `align-content` (eje cruzado, múltiples líneas)

```css
.container {
  align-content: flex-start | flex-end | center
                 | space-between | space-around | stretch;
}
```

Solo aplica cuando hay **múltiples líneas** de ítems (con `flex-wrap: wrap`).

### 3.8. `gap`, `row-gap`, `column-gap`

```css
.container {
  gap: 16px;        /* fila y columna */
  row-gap: 8px;     /* solo filas */
  column-gap: 24px; /* solo columnas */
}
```

Controlan el espacio entre ítems sin márgenes manuales.

---

## 4. Propiedades de los ítems (hijos)

Se aplican a cada elemento hijo directo del contenedor flex.

### 4.1. `order`

```css
.item {
  order: 0; /* por defecto */
}
```

Cambia el orden visual del ítem sin tocar el HTML (menor valor aparece antes).

### 4.2. `flex-grow`

```css
.item1 { flex-grow: 1; }
.item2 { flex-grow: 2; }
.item3 { flex-grow: 1; }
```

Indica cuánto puede crecer el ítem si sobra espacio (`0` no crece; aquí se reparte `1:2:1`).

### 4.3. `flex-shrink`

```css
.item {
  flex-shrink: 1; /* por defecto; 0 evita que se encoja */
}
```

### 4.4. `flex-basis`

```css
.item {
  flex-basis: auto | 200px | 50%;
}
```

Tamaño base del ítem en el eje principal antes de crecer o encogerse.

### 4.5. `flex` (atajo)

```css
.item  { flex: 1; }         /* crece y se encoge */
.card  { flex: 1 1 250px; } /* crece, se encoge, base 250px */
.fixed { flex: 0 0 200px; } /* ancho fijo de 200px */
```

### 4.6. `align-self`

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

Sobrescribe `align-items` únicamente para ese ítem.

---

## 5. Patrones típicos de uso

### 5.1. Centrar totalmente un elemento

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 5.2. Barra de navegación

```html
<nav class="nav">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>Inicio</li>
    <li>Blog</li>
    <li>Contacto</li>
  </ul>
</nav>
```

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  gap: 16px;
}
```

### 5.3. Cards responsivos

```html
<div class="cards">
  <article class="card">Card 1</article>
  <article class="card">Card 2</article>
  <article class="card">Card 3</article>
  <article class="card">Card 4</article>
</div>
```

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 250px;
}
```

### 5.4. Formularios fluidos

```html
<form class="form">
  <input class="name" placeholder="Nombre">
  <input class="email" placeholder="Email">
  <button class="submit">Enviar</button>
</form>
```

```css
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.name   { flex: 1 1 160px; }
.email  { flex: 3 1 200px; }
.submit { flex: 1 1 80px;  }
```

### 5.5. Galerías de imágenes simples

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.gallery img {
  flex: 1 1 150px;
  object-fit: cover;
}
```

---

## 6. Cómo pensar como experto en Flexbox

- **Piensa en ejes, no en posiciones fijas:** define `flex-direction`, luego `justify-content` y `align-items`.
- **Usa `flex` estratégicamente:** `flex: 1` para ítems fluidos y `flex: 0 0 200px` para columnas fijas.
- **Usa `gap` para separación interna** en lugar de márgenes residuales.
- **Combina Flexbox con CSS Grid:** Flexbox para una dimensión (navbars, toolbars, botones) y Grid para layouts 2D.

---

## 7. Ejercicios para practicar

1. **Centrado perfecto:** crea un contenedor de `400x400px` y centra un hijo de `100x100px`.
2. **Menú horizontal:** logo a la izquierda, 4 enlaces a la derecha y todo centrado verticalmente.
3. **3 columnas responsivas:** 3 cards en fila que se apilen con `flex-wrap` y `flex-basis` en pantallas pequeñas.
4. **Layout sidebar + contenido:**

```css
.layout  { display: flex; }
.sidebar { flex: 0 0 250px; }
.content { flex: 1 1 auto; }
```

---

## 8. Resumen mental rápido

- Activar: `display: flex`.
- Eje principal: `flex-direction`.
- Distribuir en el eje principal: `justify-content`.
- Alinear en el eje cruzado: `align-items` (una línea) y `align-content` (múltiples líneas).
- Espacios entre ítems: `gap`.

---

## 9. Profundización: `flex` Shorthand, `align-content` vs `align-items` y Accesibilidad

### `flex` Shorthand (Valores Clave)

| Atajo | Equivale a | Comportamiento |
| :--- | :--- | :--- |
| `flex: 1` | `flex: 1 1 0%` | Crece y encoge por igual ignorando el tamaño del contenido |
| `flex: auto` | `flex: 1 1 auto` | Crece y encoge partiendo del tamaño intrínseco del contenido |
| `flex: none` | `flex: 0 0 auto` | Ni crece ni encoge (mantiene su tamaño natural) |
| `flex: 0 0 240px` | `0 0 240px` | Columna/sidebar fija de exactamente `240px` |

### `align-items` vs `align-content`
- **`align-items`**: alinea los ítems **dentro de cada fila/línea** en el eje cruzado.
- **`align-content`**: distribuye **el bloque completo de líneas** en el eje cruzado (no tiene efecto si `flex-wrap: nowrap`).

### `order` y Accesibilidad (a11y)
Cambiar `order` (o usar `row-reverse` / `column-reverse`) **solo altera el orden visual**, pero la navegación con `Tab` y los lectores de pantalla siguen el orden del DOM HTML. Si el orden lógico importa, reordena el HTML.

---

## 10. Errores Comunes en Flexbox

1. **Usar `align-content` sin `flex-wrap: wrap`:** no tiene efecto porque solo existe una línea.
2. **Olvidar `min-width: 0` en un flex item con texto largo:** por defecto `min-width: auto` impide encoger por debajo del contenido.
3. **Confundir `flex: 1` con `width: 100%`:** `flex: 1` reparte espacio entre hermanos; `width: 100%` ocupa todo el ancho.
4. **Seguir usando márgenes con `:last-child { margin-right: 0 }`:** usa `gap` directamente.

---

## 11. Buenas Prácticas

- Usa `gap` (`row-gap` / `column-gap`) para toda separación entre flex items.
- Usa `margin-inline-start: auto` en un ítem específico para empujarlo al extremo opuesto de una barra.
- Aplica `min-width: 0` en contenedores flex con textos truncados o bloques `<pre>`.

---

## 12. Hoja de Trucos (Cheatsheet) — Flexbox

| Propiedad | Valor / Ejemplo | Propósito |
| :--- | :--- | :--- |
| `display: flex` | `flex` / `inline-flex` | Activa el contexto flex en el contenedor |
| `flex-direction` | `row` / `column` | Define el eje principal |
| `flex-wrap` | `wrap` / `nowrap` | Permite que los ítems salten a nuevas líneas |
| `justify-content` | `center` / `space-between` | Distribuye ítems en el eje principal |
| `align-items` | `center` / `stretch` | Alinea ítems en el eje cruzado (por línea) |
| `align-content` | `space-between` / `center` | Distribuye múltiples líneas en el eje cruzado |
| `gap` | `1rem` / `8px 16px` | Espacio uniforme entre ítems sin márgenes extra |
| `flex` | `1` / `0 0 250px` / `1 1 260px` | Atajo de `flex-grow`, `flex-shrink` y `flex-basis` |
| `align-self` | `flex-end` / `center` | Sobrescribe `align-items` para un único hijo |
