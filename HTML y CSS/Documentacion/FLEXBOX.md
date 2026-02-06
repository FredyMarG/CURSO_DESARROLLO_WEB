# Guía completa de Flexbox en CSS

Flexbox es un modo de diseño de CSS para alinear y distribuir elementos en una dimensión (fila o columna) de forma flexible y responsiva.

---

## 1. Idea central de Flexbox

- Flexbox se activa poniendo `display: flex` (o `inline-flex`) en un contenedor; sus hijos se convierten en “flex items”.
- Está pensado para controlar una sola dimensión a la vez: fila (horizontal) o columna (vertical), con alineación muy precisa y fácil.
- Los ítems pueden encogerse, crecer y reordenarse sin cambiar el HTML, solo con CSS.

### Ejemplo mínimo

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
css
.container {
  display: flex;
}
Esto ya coloca los items 1, 2 y 3 en fila.

2. Ejes: main axis y cross axis
flex-direction define el eje principal:

row (por defecto): eje principal horizontal, eje cruzado vertical.

column: eje principal vertical, eje cruzado horizontal.

row-reverse, column-reverse: invierten el orden visual de los ítems.

Las propiedades de alineación se entienden respecto a estos ejes:

justify-content: alinea sobre el eje principal.

align-items y align-content: alinean sobre el eje cruzado.

3. Propiedades del contenedor (padre)
Se aplican al elemento que tiene display: flex o inline-flex.

3.1. display
css
.container {
  display: flex;       /* bloque flex */
  /* o */
  display: inline-flex; /* inline flex */
}
Convierte al elemento en contenedor flex.

3.2. flex-direction
css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
Define la dirección de los ítems sobre el eje principal.

row: ítems de izquierda a derecha.

row-reverse: de derecha a izquierda.

column: de arriba hacia abajo.

column-reverse: de abajo hacia arriba.

3.3. flex-wrap
css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
nowrap (por defecto): todo en una sola línea.

wrap: permite que los ítems bajen/suban a nuevas filas/columnas cuando no caben.

wrap-reverse: igual que wrap, pero invierte la dirección del salto.

3.4. flex-flow (atajo)
css
.container {
  flex-flow: row wrap; /* direction + wrap */
}
Atajo de flex-direction y flex-wrap.

3.5. justify-content (eje principal)
css
.container {
  justify-content: flex-start | flex-end | center
                   | space-between | space-around | space-evenly;
}
Controla la distribución sobre el eje principal.

flex-start: todos al inicio.

flex-end: todos al final.

center: centrados como bloque.

space-between: primero al inicio, último al final, el resto repartidos.

space-around: espacios iguales alrededor de cada ítem.

space-evenly: todos los espacios exactamente iguales (inicio, entre ítems y final).

3.6. align-items (eje cruzado, una línea)
css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
Alinea los ítems sobre el eje cruzado (cuando hay una sola línea).

stretch (por defecto): estira los ítems para ocupar todo el eje cruzado.

flex-start: al inicio del eje cruzado.

flex-end: al final.

center: centrados.

baseline: alinea según la línea de base del texto.

3.7. align-content (eje cruzado, múltiples líneas)
css
.container {
  align-content: flex-start | flex-end | center
                 | space-between | space-around | stretch;
}
Solo aplica cuando hay múltiples líneas de ítems (con flex-wrap).

Controla cómo se distribuyen las líneas en el eje cruzado.

Por ejemplo, puedes compactar las líneas arriba (flex-start), abajo (flex-end) o distribuirlas (space-between, space-around, stretch).

3.8. gap, row-gap, column-gap
css
.container {
  gap: 16px;            /* fila y columna */
  row-gap: 8px;         /* solo filas */
  column-gap: 24px;     /* solo columnas */
}
Controlan el espacio entre ítems sin márgenes manuales.

4. Propiedades de los ítems (hijos)
Se aplican a cada elemento hijo directo del contenedor flex.

4.1. order
css
.item {
  order: 0; /* por defecto */
}
Cambia el orden visual del ítem sin tocar el HTML.

Menor valor → aparece antes.

4.2. flex-grow
css
.item {
  flex-grow: 0; /* por defecto */
}
Indica cuánto puede crecer el ítem si sobra espacio.

0: no crece.

1 o más: crece proporcionalmente respecto a otros ítems.

Ejemplo:

css
.item1 { flex-grow: 1; }
.item2 { flex-grow: 2; }
.item3 { flex-grow: 1; }
El espacio extra se reparte 1:2:1 entre los tres ítems.

4.3. flex-shrink
css
.item {
  flex-shrink: 1; /* por defecto */
}
Indica cuánto puede encogerse el ítem si no hay suficiente espacio.

0: no se encoge (intenta mantener su tamaño base).

Valores mayores: se encoge más que otros ítems con valores menores.

4.4. flex-basis
css
.item {
  flex-basis: auto | 200px | 50% | etc;
}
Es el tamaño “base” del ítem en el eje principal antes de crecer/encogerse.

auto: suele basarse en el ancho/alto contenido o width/height.

Puedes fijar un tamaño inicial (por ejemplo flex-basis: 200px;).

4.5. flex (atajo)
css
.item {
  flex: flex-grow flex-shrink flex-basis;
}
Ejemplos típicos:

css
.item {
  flex: 1;          /* crece y se encoge, base 0 o auto según navegador */
}

.card {
  flex: 1 1 250px;  /* crece, se encoge, base 250px */
}

.fixed {
  flex: 0 0 200px;  /* no crece, no se encoge, 200px fijos */
}
4.6. align-self
css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
Sobrescribe align-items solo para ese ítem.

Útil cuando quieres que un ítem concreto se alinee diferente a los demás.

5. Patrones típicos de uso
5.1. Centrar totalmente un elemento
css
.container {
  display: flex;
  justify-content: center; /* eje principal */
  align-items: center;     /* eje cruzado */
}
Coloca el elemento hijo en el centro exacto del contenedor.

5.2. Barra de navegación
xml
<nav class="nav">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>Inicio</li>
    <li>Blog</li>
    <li>Contacto</li>
  </ul>
</nav>
css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  gap: 16px;
}
Logo a la izquierda, menú a la derecha, todo centrado verticalmente.

Las opciones de menú se reparten horizontalmente con espacio entre ellas.

5.3. Cards responsivos
xml
<div class="cards">
  <article class="card">Card 1</article>
  <article class="card">Card 2</article>
  <article class="card">Card 3</article>
  <article class="card">Card 4</article>
</div>
css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 250px; /* crece, se encoge, base 250px */
}
Se muestran varias cards por fila según el ancho disponible.

En pantallas pequeñas se reducen las columnas; en grandes caben más.

5.4. Formularios fluidos
xml
<form class="form">
  <input class="name" placeholder="Nombre">
  <input class="email" placeholder="Email">
  <button class="submit">Enviar</button>
</form>
css
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.name   { flex: 1 1 160px; }
.email  { flex: 3 1 200px; }
.submit { flex: 1 1 80px;  }
Los campos se redimensionan de forma proporcional sin necesidad de muchas media queries.

5.5. Galerías de imágenes simples
xml
<div class="gallery">
  <img src="1.jpg">
  <img src="2.jpg">
  <img src="3.jpg">
  <img src="4.jpg">
</div>
css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.gallery img {
  flex: 1 1 150px;
  object-fit: cover;
}
Las imágenes se ordenan en filas que se adaptan.

Cada imagen tiene un tamaño mínimo, pero puede crecer para rellenar el espacio.

6. Cómo pensar como “experto” en Flexbox
Piensa en ejes, no en posiciones fijas

Primero define flex-direction.

Después usa justify-content (eje principal) y align-items/align-content (eje cruzado).

Usa flex (shorthand) estratégicamente

Ítems que se adaptan: flex: 1; o flex: 1 1 0;.

Ítems fijos: flex: 0 0 200px; o el rango que necesites.

Usa gap para separación interna

Evita depender solo de margin entre ítems.

gap hace que el layout sea más predecible.

No abuses de order

Es útil, pero cambiar demasiado el orden visual vs. el orden en el DOM puede afectar la accesibilidad.

Combina Flexbox con otros sistemas

Flexbox: ideal para alineación en una dimensión (menus, barras, cards).

CSS Grid: mejor para layouts en dos dimensiones complejas.

7. Ejercicios para practicar
Centrado perfecto

Crea un div de 400x400px.

Añade un hijo de 100x100px.

Centra el hijo con Flexbox (horizontal y vertical).

Menu horizontal

Crea una barra de navegación con logo y 4 enlaces.

Usa Flexbox para: logo a la izquierda, enlaces a la derecha, centrado vertical.

3 columnas responsivas

3 cards en fila en pantallas grandes.

En pantallas pequeñas, se deben apilar (1 por fila) usando flex-wrap y flex-basis.

Layout “sidebar + contenido”

Sidebar fija (por ejemplo 250px).

Área de contenido flexible que ocupa el resto.

Pista:

css
.layout {
  display: flex;
}

.sidebar {
  flex: 0 0 250px;
}

.content {
  flex: 1 1 auto;
}
8. Recursos visuales recomendados
Para ver diagramas, animaciones e imágenes que ayuden a interiorizar Flexbox, puedes buscar:

“Interactive guide to Flexbox” (guías interactivas con visualizaciones).

“CSS Flexbox complete guide” (artículos con diagramas de ejes, ejemplos y capturas).

“Flexbox photo gallery examples” (galerías de imágenes usando Flexbox).

9. Resumen mental rápido
Activar: display: flex.

Eje: flex-direction.

Distribuir en el eje principal: justify-content.

Alinear en el eje cruzado: align-items (una línea) y align-content (múltiples líneas).

Espacios entre ítems: gap.

