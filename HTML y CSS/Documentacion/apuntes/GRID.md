# Guía Completa de CSS Grid

## 1. ¿Qué es CSS Grid?

CSS Grid Layout es un sistema de diseño **bidimensional** para la web que permite trabajar con filas y columnas al mismo tiempo. Fue creado para resolver maquetaciones complejas que antes se hacían con floats, posicionamiento absoluto o hacks.

---

## 2. Conceptos básicos: contenedor e ítems

### 2.1 Grid container

```css
.container {
  display: grid;
}
```

### 2.2 Grid items

Los hijos directos se convierten en grid items y pueden posicionarse con `grid-column`, `grid-row` o `grid-area`.

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

---

## 4. Unidades clave: `auto` y `fr`

### `auto`
Se ajusta al contenido.

### `fr`
Representa fracciones del espacio disponible.

---

## 5. Funciones `repeat()` y `minmax()`

```css
grid-template-columns: repeat(4, 1fr);
```

```css
grid-template-columns: repeat(3, minmax(200px, 1fr));
```

---

## 6. `auto-fit` vs `auto-fill`

Ambos se utilizan dentro de `repeat()` para crear **grids dinámicos y responsivos sin necesidad de media queries**.

### 6.1 Sintaxis base

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

```css
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
```

---

### 6.2 Funcionamiento interno

1. Calcula el ancho disponible.
2. Divide entre el valor mínimo.
3. Determina cuántas columnas caben.
4. Genera esos tracks.
5. Distribuye el espacio restante según el máximo (`1fr`).

---

### 6.3 `auto-fill`

Crea tantas columnas como quepan, incluso si no hay suficientes ítems.

Ejemplo:

```
[ Item ][ Item ][ vacío ][ vacío ]
```

- Las columnas vacías NO colapsan.
- El espacio se distribuye entre todas.

Uso ideal:
- Layouts estructurales.
- Dashboards con espacios reservados.

---

### 6.4 `auto-fit`

Colapsa las columnas vacías y redistribuye el espacio.

```
[ Item           ][ Item           ]
```

- Columnas vacías → `0px`.
- Layout fluido.

Uso ideal:
- Cards responsive.
- Componentes reutilizables.

---

### 6.5 Comparación

| Característica | auto-fill | auto-fit |
|---------------|----------|----------|
| Columnas vacías | Se mantienen | Colapsan |
| Redistribuye espacio | No | Sí |
| Ideal para cards | No | Sí |

---

### 6.6 Patrón profesional recomendado

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

---

### 6.7 Edge cases

- No usar `repeat(auto-fit, 1fr)` sin `minmax()`.
- Evitar mínimos demasiado pequeños.
- Cuidado con `max-content`.

---

## 7. Grid explícito e implícito

`grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow` controlan el grid implícito.

---

## 8. Grid dinámico y responsive

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

---

## 9. Posicionamiento

```css
.item {
  grid-column: 1 / span 2;
}
```

---

## 10. `grid-auto-flow`

```css
.container {
  grid-auto-flow: row dense;
}
```

---

## 11. `grid-template-areas` (Layouts Declarativos Completos)

Permite dibujar visualmente la estructura de la página con nombres semánticos:

```css
.page-layout {
  display: grid;
  grid-template-columns: 240px 1fr 220px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header  header"
    "nav    main    aside"
    "footer footer  footer";
  min-height: 100dvh;
  gap: 1rem;
}

.header { grid-area: header; }
.nav    { grid-area: nav; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive declarativo en móvil */
@media (max-width: 768px) {
  .page-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
  }
}
```

> **Tip:** Usa un punto (`.`) para representar una celda vacía intencional dentro de `grid-template-areas`.

---

## 12. Alineación (`place-items`, `place-content`, `place-self`)

En CSS Grid existen dos ejes de alineación: **Inline** (horizontal, `justify-*`) y **Block** (vertical, `align-*`).

- **`justify-items` / `align-items` / `place-items`:** Alinea los ítems **dentro de sus celdas**.
  - `place-items: <align-items> <justify-items>;` → Ejemplo: `place-items: center;` centra horizontal y verticalmente cada ítem en su celda.
- **`justify-content` / `align-content` / `place-content`:** Alinea **toda la cuadrícula** dentro del contenedor cuando sobra espacio.
  - `place-content: center space-between;`
- **`justify-self` / `align-self` / `place-self`:** Sobrescribe la alineación en un único ítem hijo.

---

## 13. Subgrid (`grid-template-columns: subgrid` / `grid-template-rows: subgrid`)

`subgrid` permite que un elemento hijo (que también es `display: grid`) **herede exactamente las líneas y pistas del grid padre**, logrando alineación perfecta entre tarjetas hermanas (títulos, descripciones y botones alineados aunque tengan distinta longitud de texto):

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.card {
  display: grid;
  grid-row: span 3; /* Reserva 3 filas: título, descripción, botón */
  grid-template-rows: subgrid; /* Hereda el alto de fila de las tarjetas vecinas */
  gap: 0.75rem;
  padding: 1.25rem;
  background: #1e293b;
  border-radius: 12px;
}
```

---

## 14. Inspección de Grid en DevTools

Tanto Chrome/Edge como Firefox incluyen un **Grid Inspector** integrado:

1. Abre DevTools (`F12`) y haz clic en el badge **`grid`** junto al elemento en el panel Elements/Inspector.
2. Activa **Mostrar números de línea**, **Nombres de áreas** y **Tamaños de pista** en la pestaña *Layout* (Diseño).
3. Úsalo para depurar desbordamientos implícitos, verificar `auto-fit` vs `auto-fill` y comprobar qué tracks hereda `subgrid`.

---

## 15. Errores Comunes en CSS Grid

1. **Usar `repeat(auto-fit, 1fr)` sin `minmax()`:** Provoca columnas diminutas o una sola columna rígida; siempre combina con `minmax(250px, 1fr)`.
2. **Olvidar `min-width: 0` en ítems con contenido largo:** Un `<pre>` o URL larga puede estirar una columna `1fr`; usa `minmax(0, 1fr)` para evitarlo.
3. **Abusar de `height` fijo en filas:** Prefiere `minmax(120px, auto)` o `auto` para evitar texto cortado.
4. **Confundir `align-items` con `align-content`:** `align-items` mueve ítems dentro de su celda; `align-content` mueve toda la grilla dentro del contenedor.

---

## 16. Buenas Prácticas Senior

- **Grid para macro-layout, Flexbox para micro-layout:** Usa Grid para la estructura general de la página o grillas de tarjetas, y Flexbox dentro de cada barra de navegación o fila de botones.
- Prefiere `gap` sobre márgenes externos entre ítems.
- Usa `minmax(0, 1fr)` en columnas críticas con contenido dinámico para evitar desbordamientos horizontales.
- Aprovecha `subgrid` para alinear encabezados y botones entre tarjetas de altura variable.

---

## 17. Ejemplo Completo: Dashboard Responsivo

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "sidebar topbar"
    "sidebar content";
  min-height: 100dvh;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
}
```


---

## 18. Explicación nivel aprendiz: `repeat()` y `minmax()`

### 📦 `repeat()` explicado fácil

Sirve para **no escribir lo mismo muchas veces** cuando creas columnas o filas.

En vez de:

```css
grid-template-columns: 1fr 1fr 1fr 1fr;
```

Puedes escribir:

```css
grid-template-columns: repeat(4, 1fr);
```

Significa:

> "Crea 4 columnas de 1fr cada una".

También puede repetir patrones:

```css
grid-template-columns: repeat(2, 200px 1fr);
```

Resultado:

```
200px 1fr 200px 1fr
```

---

### 📏 `minmax()` explicado fácil

Sirve para decir:

> "Esta columna puede medir mínimo esto y máximo esto otro".

Sintaxis:

```css
minmax(MIN, MAX)
```

Ejemplo:

```css
grid-template-columns: minmax(200px, 1fr);
```

Significa:

- Nunca será menor a 200px.
- Puede crecer si hay espacio disponible.

---

### 🔥 La combinación más usada

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

Esto hace que:

1. Se creen tantas columnas como quepan.
2. Cada columna tenga mínimo 250px.
3. Si sobra espacio, las columnas crezcan.

En pantallas grandes:

```
[ card ][ card ][ card ][ card ]
```

En pantallas pequeñas:

```
[ card ]
[ card ]
[ card ]
```

Sin necesidad de media queries.

---

### 🎯 Resumen mental fácil

- `repeat()` = Repite columnas o filas.
- `minmax()` = Limita el tamaño mínimo y máximo.
- `1fr` = Toma el espacio sobrante.

---

# Hoja de Trucos (Cheatsheet) — CSS Grid

| Propiedad / Función | Uso Principal |
| :--- | :--- |
| `display: grid;` | Convierte el contenedor en una cuadrícula bidimensional |
| `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));` | Columnas responsivas automáticas sin media queries |
| `grid-template-areas` + `grid-area` | Layout declarativo por nombres semánticos |
| `grid-template-rows: subgrid;` | Hereda pistas del grid padre para alinear tarjetas hermanas |
| `gap: 1.5rem;` | Espaciado uniforme entre filas y columnas |
| `place-items: center;` | Atajo de `align-items` + `justify-items` dentro de cada celda |
| `place-content: center;` | Alinea toda la cuadrícula dentro del contenedor |
| `grid-column: 1 / span 2;` | Hace que un ítem ocupe 2 columnas desde la línea 1 |

