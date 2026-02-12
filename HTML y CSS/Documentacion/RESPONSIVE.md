# 📱 Diseño Responsive --- Guía Completa y Profesional (Versión Expandida)

Autor: Fredy Leonardo Martinez Galeano

------------------------------------------------------------------------

# 1️⃣ ¿Qué es el Diseño Responsive?

El **Diseño Web Responsive (RWD - Responsive Web Design)** es una
metodología de desarrollo que permite que una interfaz web se adapte
dinámicamente a diferentes tamaños de pantalla, resoluciones,
orientaciones y tipos de dispositivo.

No se trata únicamente de "hacer que se vea bien en celular", sino de
adaptar:

-   Distribución (layout)\
-   Tipografía\
-   Imágenes\
-   Navegación\
-   Interacción táctil

Un diseño responsive bien hecho considera:

-   Jerarquía visual adaptable\
-   Espaciados proporcionales\
-   Componentes escalables\
-   Optimización de recursos

------------------------------------------------------------------------

# 2️⃣ Bloques y Multimedia Flexible

## 🔹 Bloques Flexibles

Evita valores rígidos en píxeles para contenedores principales.

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

Explicación:

-   `width: 90%` → Se adapta al ancho disponible.
-   `max-width: 1200px` → Evita que el contenido se estire demasiado.
-   `margin: auto` → Centra el contenedor.

------------------------------------------------------------------------

### 📌 Unidades recomendadas

  Unidad   Uso
  -------- ---------------------------
  \%       Relativa al contenedor
  em       Relativa al padre
  rem      Relativa al root
  vw       1% del ancho del viewport
  vh       1% del alto del viewport

------------------------------------------------------------------------

## 🔹 Multimedia Flexible

``` css
img, video {
  max-width: 100%;
  height: auto;
}
```

Permite que imágenes y videos no rompan el diseño en pantallas pequeñas.

------------------------------------------------------------------------

# 3️⃣ SRCSET y SIZES

``` html
<img 
  src="imagen-800.jpg"
  srcset="imagen-400.jpg 400w,
          imagen-800.jpg 800w,
          imagen-1200.jpg 1200w"
  sizes="(max-width: 600px) 90vw, 800px"
  alt="Producto">
```

El navegador selecciona automáticamente la imagen más eficiente según el
tamaño de pantalla.

Beneficios:

-   Mejor rendimiento\
-   Menor consumo de datos\
-   Mejor SEO

------------------------------------------------------------------------

# 4️⃣ Picture y Media

``` html
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg">
  <source media="(max-width: 1024px)" srcset="tablet.jpg">
  <img src="desktop.jpg" alt="Banner principal">
</picture>
```

Permite cambiar la composición de imagen según dispositivo (Art
Direction).

------------------------------------------------------------------------

# 5️⃣ Media Queries

``` css
@media (max-width: 768px) {
  .menu {
    flex-direction: column;
  }
}
```

Se aplican estilos condicionales según el tamaño del viewport.

------------------------------------------------------------------------

# 6️⃣ Mobile First

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

Se comienza diseñando para móvil y luego se escala hacia pantallas más
grandes.

------------------------------------------------------------------------

# 7️⃣ Feature Queries

``` css
@supports (display: grid) {
  .layout {
    display: grid;
  }
}
```

Permite aplicar mejoras progresivas si el navegador soporta una
característica.

------------------------------------------------------------------------

# 8️⃣ Holy Grail Layout con Flexbox

Estructura clásica con header, nav, main, aside y footer adaptable a
móvil mediante media queries.

------------------------------------------------------------------------

# 9️⃣ Container Queries

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

Permite que los componentes respondan al tamaño de su contenedor y no
del viewport.

------------------------------------------------------------------------

# 🔟 Buenas Prácticas

✔ Usar Mobile First\
✔ Optimizar imágenes\
✔ Evitar breakpoints innecesarios\
✔ Probar en dispositivos reales\
✔ Diseñar por componentes

------------------------------------------------------------------------

# 📌 Conclusión

El diseño responsive moderno combina:

-   Layout fluido\
-   Imágenes optimizadas\
-   Media Queries\
-   Mobile First\
-   Componentización\
-   Container Queries

Es una base obligatoria en el desarrollo frontend profesional moderno.
