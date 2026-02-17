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

## 11. `grid-template-areas`

Permite layouts declarativos.

---

## 12. Alineación

`justify-items`, `align-items`, `place-items`, etc.

---

## 13. Subgrid

Permite heredar tracks del grid padre.

---

## 14. Propiedades completas

Listado completo de propiedades Grid.

---

## 15. Errores comunes

- No usar gap.
- Abusar de tamaños fijos.

---

## 16. Buenas prácticas senior

- Grid para macro layout.
- Flexbox para micro layout.

---

## 17. Ejemplo completo

Layout con `grid-template-areas` y media query.


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

