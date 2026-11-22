# GUÍA — Gráficos 2D en el Desarrollo Web (HTML5 Canvas)

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender el funcionamiento de la API de HTML5 Canvas y su contexto de renderizado 2D, dominar el dibujo de rectángulos, estilos de trazo y relleno, y construir rutas (*paths*) personalizadas de forma limpia y estructurada.

---

# 📚 Temario

1. ¿Qué es HTML5 Canvas y cómo funciona?
2. Sintaxis básica y anatomía del contexto 2D
3. Rectángulos y estilos (`fillStyle`, `strokeStyle`, `lineWidth`, `fillRect`, `strokeRect`)
4. Rutas y trazados personalizados (`beginPath`, `moveTo`, `lineTo`, `closePath`)
5. Comparativa: Rectángulos directos vs. Trazados por rutas (`Path`)
6. Analogía del mundo real
7. Diagrama de flujo de dibujo
8. Buenas prácticas
9. Errores comunes
10. Ejercicios
11. Solucionario paso a paso
12. Resumen
13. Conceptos Complementarios
14. Hoja de Trucos (Cheatsheet)

---

# ¿Qué es HTML5 Canvas y cómo funciona?

La etiqueta **`<canvas>`** de HTML5 es un contenedor gráfico que permite dibujar formas, gráficos, animaciones y videojuegos directamente en el navegador utilizando **JavaScript**. A diferencia de los elementos HTML tradicionales o los gráficos vectoriales (SVG), Canvas funciona como un **mapa de bits (píxeles)**: una vez que dibujas algo en el lienzo, el navegador "olvida" el objeto y solo recuerda los píxeles pintados.

Para interactuar con este lienzo, primero debemos obtener su **Contexto de Renderizado 2D** (`CanvasRenderingContext2D`), el cual actúa como nuestra caja de herramientas (pinceles, colores, reglas y coordenadas) donde el origen `(0, 0)` siempre se ubica en la **esquina superior izquierda**.

---

# Sintaxis básica y anatomía del contexto 2D

Para comenzar a dibujar, necesitamos enlazar la etiqueta HTML con nuestro código JavaScript y solicitar el contexto `"2d"`:

```html
<canvas id="miLienzo" width="500" height="300"></canvas>
```

```javascript
// 1. Seleccionamos el elemento del DOM
const canvas = document.getElementById("miLienzo");

// 2. Obtenemos el contexto de dibujo 2D (nuestro "pincel")
const ctx = canvas.getContext("2d");
```

### 🔍 Desglose de los elementos clave del temario:
1. **`Canvas`:** El elemento HTML que define el área rectangular de dibujo con sus atributos `width` y `height`.
2. **`fillStyle`:** Propiedad que define el color, degradado o patrón de **relleno** interior de las figuras.
3. **`strokeStyle`:** Propiedad que define el color, degradado o patrón del **borde o contorno** (trazo).
4. **`lineWidth`:** Propiedad numérica que establece el **grosor de la línea** en píxeles (por defecto es `1`).
5. **`fillRect(x, y, ancho, alto)`:** Dibuja inmediatamente un rectángulo **relleno** en las coordenadas `(x, y)`.
6. **`strokeRect(x, y, ancho, alto)`:** Dibuja inmediatamente el **contorno** de un rectángulo sin relleno interior.
7. **`beginPath()`:** Inicia una nueva ruta o lista de sub-trazos, reiniciando cualquier trazado anterior.
8. **`moveTo(x, y)`:** Levanta el "lápiz" virtual y lo mueve a las coordenadas `(x, y)` sin dejar marca.
9. **`lineTo(x, y)`:** Traza una línea recta desde la posición actual del lápiz hasta el nuevo punto `(x, y)`.
10. **`closePath()`:** Cierra automáticamente la figura dibujando una línea recta desde el punto actual hasta el punto inicial del trazo.

---

# Rectángulos y estilos (`fillStyle`, `strokeStyle`, `lineWidth`, `fillRect`, `strokeRect`)

Los rectángulos son las únicas figuras primitivas que Canvas puede dibujar directamente sin necesidad de crear una ruta previa. Es fundamental configurar los estilos **antes** de ejecutar la orden de dibujo.

```javascript
const canvas = document.getElementById("miLienzo");
const ctx = canvas.getContext("2d");

// 1. Configuramos el relleno y dibujamos un cuadrado sólido
ctx.fillStyle = "#3498db";
ctx.fillRect(20, 20, 120, 80); // (x: 20, y: 20, ancho: 120, alto: 80)

// 2. Configuramos el contorno, grosor y dibujamos un marco
ctx.strokeStyle = "#e74c3c";
ctx.lineWidth = 5;
ctx.strokeRect(170, 20, 120, 80);
```

---

# Rutas y trazados personalizados (`beginPath`, `moveTo`, `lineTo`, `closePath`)

Para dibujar cualquier otra figura geométrica (triángulos, polígonos, líneas conectadas), Canvas utiliza el concepto de **Rutas (*Paths*)**. Una ruta es una serie de puntos conectados que no se hacen visibles en pantalla hasta que llamamos a `.stroke()` (para pintar el borde) o `.fill()` (para rellenar el interior).

```javascript
// 1. Iniciamos un nuevo trazado limpio
ctx.beginPath();

// 2. Posicionamos el lápiz en el vértice superior (sin dibujar)
ctx.moveTo(150, 50);

// 3. Trazamos líneas hacia los otros vértices
ctx.lineTo(220, 150);
ctx.lineTo(80, 150);

// 4. Cerramos el triángulo uniendo el último punto con el inicial (150, 50)
ctx.closePath();

// 5. Aplicamos estilos y renderizamos en el lienzo
ctx.lineWidth = 3;
ctx.strokeStyle = "#2c3e50";
ctx.fillStyle = "#f1c40f";

ctx.fill();   // Rellena el triángulo
ctx.stroke(); // Dibuja el borde sobre el relleno
```

---

# Comparativa: Rectángulos Directos vs. Trazados por Rutas (`Path`)

Para entender cuándo utilizar cada enfoque en Canvas, observemos sus diferencias estructurales:

### Dibujo Directo (`fillRect` / `strokeRect`)
```javascript
// Renderizado inmediato en una sola línea (solo para rectángulos)
ctx.fillStyle = "teal";
ctx.fillRect(10, 10, 100, 50);
```

### Dibujo por Rutas (`beginPath` + `moveTo` + `lineTo`)
```javascript
// Construcción paso a paso en memoria antes de renderizar (cualquier forma)
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(110, 10);
ctx.lineTo(60, 60);
ctx.closePath();
ctx.fillStyle = "teal";
ctx.fill();
```

---

# Analogía del mundo real: El artista frente a un lienzo en blanco 🎨

Imagina que eres un pintor trabajando sobre una cartulina física:

```
1. El elemento <canvas> es el bastidor o cartulina física sobre tu caballete.
2. El contexto (ctx) es tu mano sosteniendo las herramientas de dibujo.
3. Cambiar fillStyle, strokeStyle o lineWidth es equivalente a mojar el pincel en un bote de pintura nuevo o cambiar a un marcador más grueso antes de tocar el papel.
4. Usar moveTo(x, y) es levantar la mano en el aire y posicionar la punta del lápiz sobre un punto exacto sin rayar la hoja.
5. Usar lineTo(x, y) es deslizar el lápiz apoyado sobre el papel arrastrando el trazo hasta otro punto.
6. Usar beginPath() es tomar una hoja de calco nueva para que los trazos nuevos no se mezclen ni se repinten sobre los anteriores.
```

---

# Diagrama de flujo de dibujo

```
           [ Obtener Contexto: canvas.getContext("2d") ]
                                │
                                ▼
               ┌────────────────┴────────────────┐
               ▼ ¿Es un rectángulo simple?       ▼ ¿Es una figura libre o línea?
               │                                 │
               ▼                                 ▼
   [ Definir fillStyle / strokeStyle ]   [ Llamar ctx.beginPath() ]
               │                                 │
               ▼                                 ▼
   [ Ejecutar fillRect() / strokeRect() ] [ Posicionar con moveTo(x, y) ]
               │                                 │
               │                                 ▼
               │                         [ Trazar puntos con lineTo(x, y) ]
               │                                 │
               │                                 ▼
               │                         [ Opcional: ctx.closePath() ]
               │                                 │
               │                                 ▼
               │                         [ Renderizar con stroke() / fill() ]
               └────────────────┬────────────────┘
                                │
                                ▼
                   [ Gráfico Pintado en Pantalla ]
```

---

# Buenas prácticas

✅ **Inicia siempre cada figura con `ctx.beginPath()`:** Si olvidas llamar a `beginPath()`, Canvas recordará todos los `moveTo` y `lineTo` anteriores y volverá a pintar los trazos viejos cada vez que llames a `stroke()` o `fill()`, degradando el rendimiento y alterando colores.

✅ **Define `width` y `height` como atributos HTML, no por CSS:** Si redimensionas un `<canvas>` usando CSS (`style="width: 500px"`), la imagen se estirará y se verá pixelada. Define siempre el tamaño real en la etiqueta HTML (`<canvas width="500" height="300">`) o directamente en JavaScript (`canvas.width = 500`).

✅ **Aplica `fill()` antes de `stroke()`:** Si vas a rellenar y delinear una misma figura con un `lineWidth` grueso, ejecuta primero `ctx.fill()` y luego `ctx.stroke()`. De lo contrario, el relleno cubrirá la mitad interna del grosor del borde.

```javascript
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(100, 120);
ctx.closePath();

ctx.lineWidth = 8;
ctx.fillStyle = "#9b59b6";
ctx.strokeStyle = "#2c3e50";

ctx.fill();   // 1. Primero el relleno
ctx.stroke(); // 2. Luego el borde completo por encima
```

---

# Errores comunes

### ❌ Olvidar llamar a `.stroke()` o `.fill()` después de `lineTo()`
Los métodos `moveTo()`, `lineTo()` y `closePath()` únicamente definen la geometría invisible en memoria. Si no llamas a `ctx.stroke()` o `ctx.fill()` al final, no aparecerá absolutamente nada en el lienzo.

```javascript
// ❌ EVITAR ESTO: La ruta se calcula, pero nunca se dibuja en pantalla
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(100, 100);
// Falta ctx.stroke();
```

### ❌ Configurar el estilo después de ejecutar `fillRect` o `strokeRect`
Canvas funciona como una máquina de estados. Cambiar `fillStyle` después de haber llamado a `fillRect()` no modifica el rectángulo ya dibujado; solo afectará a las figuras futuras.

```javascript
// ❌ INCORRECTO: El rectángulo se pintará de negro (color por defecto), no rojo
ctx.fillRect(20, 20, 100, 100);
ctx.fillStyle = "red"; 
```

---

# Ejercicios

## Nivel 1
Selecciona un elemento `<canvas>` con el ID `"lienzo1"`, obtén su contexto 2D y dibuja un rectángulo relleno de color `"#2ecc71"` ubicado en `x = 30`, `y = 40`, con un ancho de `150` píxeles y un alto de `90` píxeles. Debajo de él (en `x = 30`, `y = 150`), dibuja otro rectángulo del mismo tamaño pero **solo con contorno** de color `"#e67e22"` y un grosor de línea de `4` píxeles.

## Nivel 2
Optimiza y corrige el siguiente bloque de código para que dibuje una línea diagonal azul de `5` píxeles de grosor desde `(20, 20)` hasta `(180, 120)` y, posteriormente, una línea roja independiente desde `(20, 120)` hasta `(180, 20)` sin que la primera línea se vuelva a pintar de rojo:
```javascript
const ctx = document.getElementById("lienzo2").getContext("2d");

ctx.moveTo(20, 20);
ctx.lineTo(180, 120);
ctx.strokeStyle = "blue";
ctx.lineWidth = 5;

ctx.moveTo(20, 120);
ctx.lineTo(180, 20);
ctx.strokeStyle = "red";
ctx.stroke();
```

## Nivel 3
Crea una función llamada `dibujarCasa(ctx)` que utilice rutas (`beginPath`, `moveTo`, `lineTo`, `closePath`) y rectángulos para dibujar una casa sencilla:
1. **Base de la casa:** Un rectángulo relleno de color `"#f5cba7"` en `(100, 150)` de `160` de ancho por `120` de alto.
2. **Techo triangular:** Una ruta cerrada que conecte `(90, 150)`, `(180, 70)` y `(270, 150)`, rellena de color `"#c0392b"` y con contorno `"#641e16"` de grosor `3`.
3. **Puerta:** Un rectángulo relleno de color `"#6e2c00"` en `(160, 200)` de `40` de ancho por `70` de alto.

---

# Solucionario paso a paso

## Solución Nivel 1: Rectángulos con `fillRect` y `strokeRect`

### 🎯 Objetivo
Aplicar correctamente el orden de asignación de estilos (`fillStyle`, `strokeStyle`, `lineWidth`) antes de invocar las primitivas de rectángulo.

```javascript
const canvas = document.getElementById("lienzo1");
const ctx = canvas.getContext("2d");

// 1. Rectángulo relleno
ctx.fillStyle = "#2ecc71";
ctx.fillRect(30, 40, 150, 90);

// 2. Rectángulo solo con contorno
ctx.strokeStyle = "#e67e22";
ctx.lineWidth = 4;
ctx.strokeRect(30, 150, 150, 90);
```

> **💡 Nota clave:** El grosor `lineWidth = 4` se expande 2 píxeles hacia adentro y 2 píxeles hacia afuera del borde matemático del rectángulo.

## Solución Nivel 2: Aislamiento de trazados con `beginPath()`

### 🎯 Objetivo
Separar dos trazos distintos utilizando `beginPath()` y ejecutar `.stroke()` para cada segmento antes de cambiar de color.

```javascript
const ctx = document.getElementById("lienzo2").getContext("2d");

// Primer trazo (Azul)
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(180, 120);
ctx.strokeStyle = "blue";
ctx.lineWidth = 5;
ctx.stroke(); // Renderizamos la línea azul antes de empezar la roja

// Segundo trazo (Rojo)
ctx.beginPath(); // Reinicia la ruta para no sobrescribir la línea azul
ctx.moveTo(20, 120);
ctx.lineTo(180, 20);
ctx.strokeStyle = "red";
ctx.lineWidth = 5;
ctx.stroke();
```

> **💡 Nota clave:** Sin el segundo `ctx.beginPath()`, el segundo `ctx.stroke()` habría repintado ambas líneas de color rojo.

## Solución Nivel 3: Composición de figuras con Rutas y Rectángulos

### 🎯 Objetivo
Combinar primitivas rectangulares y rutas poligonales cerradas con `closePath()` respetando el orden de renderizado (`fill` antes que `stroke`).

```javascript
const dibujarCasa = (ctx) => {
    // 1. Base de la casa (Rectángulo relleno)
    ctx.fillStyle = "#f5cba7";
    ctx.fillRect(100, 150, 160, 120);

    // 2. Techo triangular (Ruta cerrada)
    ctx.beginPath();
    ctx.moveTo(90, 150);   // Esquina inferior izquierda del techo
    ctx.lineTo(180, 70);   // Punta superior del techo
    ctx.lineTo(270, 150);  // Esquina inferior derecha del techo
    ctx.closePath();       // Cierra la base del triángulo hacia (90, 150)

    ctx.fillStyle = "#c0392b";
    ctx.strokeStyle = "#641e16";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // 3. Puerta (Rectángulo relleno)
    ctx.fillStyle = "#6e2c00";
    ctx.fillRect(160, 200, 40, 70);
};

// Ejemplo de uso:
const canvas = document.getElementById("miLienzo");
const ctx = canvas.getContext("2d");
dibujarCasa(ctx);
```

> **💡 Nota clave:** Gracias a `closePath()`, no necesitamos escribir un `ctx.lineTo(90, 150)` manual al final; Canvas cierra la figura automáticamente y une las esquinas con un remate limpio.

---

# Resumen

* **HTML5 `<canvas>` y `getContext("2d")`** proporcionan un lienzo basado en píxeles con origen `(0, 0)` en la esquina superior izquierda.
* **`fillRect` y `strokeRect`** dibujan rectángulos de forma inmediata utilizando los valores actuales de `fillStyle`, `strokeStyle` y `lineWidth`.
* **Las rutas (`beginPath`, `moveTo`, `lineTo`, `closePath`)** permiten construir cualquier forma personalizada en memoria, haciéndose visibles únicamente al llamar a `.fill()` o `.stroke()`.

---

# Conceptos Complementarios: Limpieza del Lienzo y Estilo de Terminación de Línea

### 1. Limpiar todo o una parte del lienzo (`clearRect`)
Es esencial cuando creas animaciones o necesitas borrar un dibujo previo:
```javascript
// Borra un área rectangular específica
ctx.clearRect(20, 20, 100, 100);

// Borra todo el lienzo completo
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

### 2. Redondear las puntas y esquinas de las líneas (`lineCap` y `lineJoin`)
```javascript
ctx.beginPath();
ctx.lineWidth = 10;
ctx.lineCap = "round";  // Extremos redondeados ("butt", "round", "square")
ctx.lineJoin = "round"; // Uniones entre lineTo redondeadas ("miter", "round", "bevel")
ctx.moveTo(40, 40);
ctx.lineTo(120, 40);
ctx.lineTo(80, 100);
ctx.stroke();
```

---

# Hoja de Trucos (Cheatsheet)

| Elemento | Propósito |
| :--- | :--- |
| `canvas.getContext("2d")` | Obtiene el contexto de renderizado 2D para dibujar |
| `ctx.fillStyle = color` | Establece el color o estilo de relleno |
| `ctx.strokeStyle = color` | Establece el color o estilo del contorno/línea |
| `ctx.lineWidth = px` | Define el grosor del trazo en píxeles |
| `ctx.fillRect(x, y, w, h)` | Dibuja un rectángulo relleno de inmediato |
| `ctx.strokeRect(x, y, w, h)` | Dibuja el borde de un rectángulo de inmediato |
| `ctx.beginPath()` | Inicia una nueva ruta limpia de dibujo |
| `ctx.moveTo(x, y)` | Mueve el cursor de dibujo a `(x, y)` sin trazar línea |
| `ctx.lineTo(x, y)` | Traza una línea recta desde la posición actual hasta `(x, y)` |
| `ctx.closePath()` | Cierra la ruta actual uniendo el punto final con el inicial |
| `ctx.fill()` / `ctx.stroke()` | Renderiza el relleno o el contorno de la ruta construida |
