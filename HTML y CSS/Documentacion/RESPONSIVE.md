# 📱 Diseño Responsive -- Guía Completa y Profesional

Autor: Fredy Leonardo Martinez Galeano\
Formato: Guía técnica detallada con ejemplos aplicables a proyectos
reales

------------------------------------------------------------------------

# 1️⃣ ¿Qué es el Diseño Responsive?

El **Diseño Web Responsive (RWD - Responsive Web Design)** es una
metodología que permite que una interfaz web se adapte correctamente a
distintos tamaños de pantalla, resoluciones y dispositivos.

Su objetivo principal es:

-   Mejorar la experiencia de usuario
-   Evitar zoom o scroll horizontal
-   Optimizar rendimiento
-   Mantener un solo código base

------------------------------------------------------------------------

# 2️⃣ Bloques y Multimedia Flexible

## 🔹 Bloques Flexibles

Se utilizan unidades relativas en lugar de fijas.

### ❌ Incorrecto

``` css
.container {
  width: 1200px;
}
```

### ✅ Correcto

``` css
.container {
  width: 90%;
  max-width: 1200px;
  margin: auto;
}
```

### Unidades recomendadas

  Unidad   Uso
  -------- ------------------------------
  \%       Relativa al contenedor
  em       Relativa al tamaño del padre
  rem      Relativa al root
  vw       1% del ancho del viewport
  vh       1% del alto del viewport

------------------------------------------------------------------------

## 🔹 Multimedia Flexible

### Regla esencial

``` css
img, video {
  max-width: 100%;
  height: auto;
}
```

### Caso real

Galería de productos en ecommerce:

``` css
.product-card img {
  width: 100%;
  object-fit: cover;
}
```

------------------------------------------------------------------------

# 3️⃣ Atributos SRCSET y SIZES

Permiten cargar imágenes adaptadas según resolución y tamaño.

## 🔹 SRCSET

``` html
<img 
  src="imagen-800.jpg"
  srcset="imagen-400.jpg 400w,
          imagen-800.jpg 800w,
          imagen-1200.jpg 1200w"
  sizes="(max-width: 600px) 90vw, 800px"
  alt="Producto">
```

### ¿Qué hace?

El navegador elige la imagen más eficiente según el ancho del
dispositivo.

------------------------------------------------------------------------

# 4️⃣ Picture, Source y Media

Permite servir imágenes diferentes según condiciones.

``` html
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg">
  <source media="(max-width: 1024px)" srcset="tablet.jpg">
  <img src="desktop.jpg" alt="Banner principal">
</picture>
```

### Caso real:

-   Banner diferente en móvil (vertical)
-   Banner panorámico en desktop

------------------------------------------------------------------------

# 5️⃣ Media Queries

Permiten aplicar estilos condicionales.

``` css
@media (max-width: 768px) {
  .menu {
    flex-direction: column;
  }
}
```

## 🔹 Breakpoints comunes

-   480px → móviles pequeños
-   768px → tablets
-   1024px → laptops
-   1440px → desktop

------------------------------------------------------------------------

# 6️⃣ Mobile First

Se diseñan primero estilos para móvil.

``` css
.card {
  width: 100%;
}

@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}

@media (min-width: 1024px) {
  .card {
    width: 33.33%;
  }
}
```

Ventajas:

-   Mejor rendimiento
-   CSS más limpio
-   Pensamiento progresivo

------------------------------------------------------------------------

# 7️⃣ Feature Queries

Permite verificar soporte del navegador.

``` css
@supports (display: grid) {
  .layout {
    display: grid;
  }
}
```

Caso real: Aplicar Grid solo si el navegador lo soporta.

------------------------------------------------------------------------

# 8️⃣ Ejercicio "Holy Grail" con Flexbox

Estructura clásica:

-   Header
-   Nav lateral
-   Main
-   Aside
-   Footer

``` html
<div class="layout">
  <header>Header</header>
  <div class="content">
    <nav>Nav</nav>
    <main>Main</main>
    <aside>Aside</aside>
  </div>
  <footer>Footer</footer>
</div>
```

``` css
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  display: flex;
  flex: 1;
}

nav {
  width: 200px;
}

main {
  flex: 1;
}

aside {
  width: 200px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  nav, aside {
    width: 100%;
  }
}
```

------------------------------------------------------------------------

# 9️⃣ Container Queries

Permiten aplicar estilos según el tamaño del contenedor, no del
viewport.

``` css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

Ventaja:

Componentes verdaderamente reutilizables.

Caso real:

Un mismo componente tarjeta que cambia layout según el tamaño del módulo
donde se inserta.

------------------------------------------------------------------------

# 🔟 Buenas Prácticas Profesionales

✔ Usar Mobile First\
✔ Evitar breakpoints excesivos\
✔ Priorizar rendimiento\
✔ Optimizar imágenes\
✔ Probar en dispositivos reales\
✔ Usar DevTools\
✔ Diseñar componentes escalables

------------------------------------------------------------------------

# 📌 Conclusión

El diseño responsive no es solo Media Queries. Es una combinación de:

-   Unidades relativas
-   Multimedia adaptable
-   Estrategia Mobile First
-   Componentización moderna
-   Container Queries

Es la base obligatoria para cualquier proyecto profesional moderno.

------------------------------------------------------------------------

FIN DEL DOCUMENTO
