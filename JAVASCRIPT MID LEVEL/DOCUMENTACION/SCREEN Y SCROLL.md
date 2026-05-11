# 🖥️📜 GUÍA SCREEN, SCROLL, RESIZE Y MOVE EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué es `screen`?
2. ¿Qué es el scroll?
3. Diferencia entre Window, Screen y Viewport
4. Propiedades de `screen`

   * width
   * height
   * availWidth
   * availHeight
   * colorDepth
   * pixelDepth
   * screenLeft
   * screenTop
5. Propiedades de scroll

   * scrollX
   * scrollY
6. Métodos de scroll
   * scroll()
   * scrollTo()
   * scrollBy()
7. Scroll suave
8. Eventos de scroll
 9. Optimización de rendimiento (PRO)
 10. Intersection Observer API
 11. Accesibilidad y Movimiento Reducido
 12. Errores comunes
 13. Debugging
 14. Mini proyecto práctico
 15. Resumen final
 16. Conclusión

---

# 🖥️ ¿QUÉ ES `screen`?

El objeto `screen` contiene información sobre la pantalla física del usuario.

Permite conocer:

✅ resolución
✅ profundidad de color
✅ tamaño disponible
✅ dimensiones del monitor

---

# 🧠 PIÉNSALO ASÍ

```txt
MONITOR REAL DEL USUARIO
         ↓
      SCREEN
```

---

# 📜 ¿QUÉ ES EL SCROLL?

El scroll representa el desplazamiento vertical u horizontal de una página.

Cuando el usuario baja o sube:

```txt
scrollY cambia
```

Cuando se mueve horizontalmente:

```txt
scrollX cambia
```

---

# 🌎 DIFERENCIA ENTRE SCREEN, WINDOW Y VIEWPORT

```txt
MONITOR COMPLETO
 └── SCREEN
      └── NAVEGADOR
           └── VIEWPORT
                └── HTML
```

---

# 🖥️ PROPIEDADES DE SCREEN

---

# 📏 `screen.width`

Devuelve el ancho total de la pantalla.

---

# ✅ Ejemplo

```js
console.log(screen.width)
```

---

# 📌 Resultado típico

```txt
1920
```

---

# 📐 `screen.height`

Devuelve el alto total de la pantalla.

---

# ✅ Ejemplo

```js
console.log(screen.height)
```

---

# 📌 Resultado típico

```txt
1080
```

---

# 🧠 Visual

```txt
┌─────────────────────┐
│                     │
│     SCREEN          │ ← height
│                     │
└─────────────────────┘
         width
```

---

# 📱 Caso real responsive

```js
if(screen.width < 768){
    console.log("Modo móvil")
}
```

---

# 🖥️ `screen.availWidth`

Muestra el ancho disponible.

Excluye barras del sistema operativo.

---

# ✅ Ejemplo

```js
console.log(screen.availWidth)
```

---

# 🖥️ `screen.availHeight`

Muestra el alto disponible.

---

# ✅ Ejemplo

```js
console.log(screen.availHeight)
```

---

# 🎨 `screen.colorDepth`

Muestra la profundidad de color.

---

# ✅ Ejemplo

```js
console.log(screen.colorDepth)
```

---

# 📌 Resultado típico

```txt
24
```

---

# 🧠 Significa

```txt
24 bits de color
```

---

# 🖼️ `screen.pixelDepth`

Muestra profundidad de píxeles.

---

# ✅ Ejemplo

```js
console.log(screen.pixelDepth)
```

---

# 📍 `screenLeft` y `screenTop`

Devuelven la posición exacta de la ventana del navegador respecto a la pantalla.

---

# 📌 ¿Qué devuelven?

* `screenLeft`: píxeles desde el borde izquierdo
* `screenTop`: píxeles desde el borde superior

---

# ✅ Ejemplo

```js
console.log(window.screenLeft)
console.log(window.screenTop)
```

---

# 📌 Resultado

```txt
screenLeft: 100
screenTop: 50
```

---

# 🧠 VISUAL

```txt
┌─ PANTALLA ────────────────┐
│                           │
│   ← screenLeft: 100       │
│   screenTop: 50 ↓         │
│   ┌───── NAVEGADOR ───┐   │
│   │                   │   │
│   │   Contenido       │   │
│   └───────────────────┘   │
│                           │
└───────────────────────────┘
```

---

# 📌 DIFERENCIA CON INNERWIDTH

| Propiedad   | Qué es                   |
| ----------- | ------------------------ |
| screenLeft  | posición X de la ventana |
| screenTop   | posición Y de la ventana |
| innerWidth  | ancho contenido          |
| innerHeight | alto contenido           |

---

# 🧠 CASO REAL — Detectar posición ventana

```js
function mostrarPosicion(){
    console.log(`Ventana en: (${window.screenLeft}, ${window.screenTop})`)
}

window.addEventListener("resize", mostrarPosicion)
```

---

# 🎯 CASO PRÁCTICO — Abrir ventana posición específica

```js
const ventana = window.open(
    "https://google.com",
    "MiVentana",
    `width=600,height=400,left=${window.screenLeft + 100},top=${window.screenTop + 100}`
)
```

---

# 📌 RESULTADO

La nueva ventana se abrirá 100px a la derecha y 100px abajo.

---

# 🧠 CASO REAL AVANZADO — Segundo monitor

```js
const anchoMonitor1 = screen.width

function abrirEnSegundoMonitor(url){
    window.open(
        url,
        "MiVentana",
        `width=800,height=600,left=${anchoMonitor1},top=0`
    )
}

abrirEnSegundoMonitor("https://google.com")
```

---

# ⚠️ LIMITACIONES

* Solo funciona correctamente con ventanas abiertas por JavaScript
* Navegadores modernos pueden restringir acceso
* En móviles normalmente devuelve 0

---

# ✅ Verificar diferentes dispositivos

```js
if(window.screenLeft === 0 && window.screenTop === 0){
    console.log("Probablemente móvil o navegador restringido")
}else{
    console.log(`Posición: (${window.screenLeft}, ${window.screenTop})`)
}
```

---

# 📜 PROPIEDADES DE SCROLL

---

# ↕️ `scrollY`

Indica cuánto bajó el usuario.

---

# ✅ Ejemplo

```js
console.log(scrollY)
```

---

# 🧠 VISUAL

```txt
Inicio página
     ↓
Usuario baja
     ↓
scrollY aumenta
```

---

# ↔️ `scrollX`

Indica cuánto se movió horizontalmente.

---

# ✅ Ejemplo

```js
console.log(scrollX)
```

---

# 📌 CASO REAL

Galerías horizontales.

---

# 🔽 MÉTODOS DE SCROLL

---

# 🔽 `scrollTo()`

Mueve el scroll a una posición exacta.

---

# ✅ Ejemplo

```js
window.scrollTo(0, 500)
```

---

# 📌 Significa

| Valor | Significado |
| ----- | ----------- |
| 0     | horizontal  |
| 500   | vertical    |

---

# 🧠 VISUAL

```txt
0px
↓
100px
↓
200px
↓
500px ← scrollTo
```

---

# 🔽 `scrollBy()`

Mueve el scroll relativo a la posición actual.

---

# ✅ Ejemplo

```js
window.scrollBy(0, 100)
```

---

# 📌 Significa

```txt
Baja 100px más desde la posición actual
```

---

# 🔽 `scroll()`

Funciona parecido a `scrollTo()`.

---

# ✅ Ejemplo básico

```js
window.scroll(0, 500)
```

---

# ✅ Ejemplo PRO

```js
window.scroll({
    left: 0,
    top: 500,
    behavior: "smooth"
})
```

---

# 📌 Opciones

| Opción   | Significado         |
| -------- | ------------------- |
| left     | posición horizontal |
| top      | posición vertical   |
| behavior | smooth o auto       |

---

# 🧠 Ejemplo real

```js
window.scroll(0, 0)

window.scroll({
    top: 0,
    behavior: "smooth"
})
```

---

# 🌊 SCROLL SUAVE

Permite desplazamiento animado.

---

# ✅ Ejemplo PRO

```js
window.scrollTo({
    top: 1000,
    behavior: "smooth"
})
```

---

# 🧠 VISUAL

```txt
❌ Salto brusco

✅ Movimiento suave
```

---

# 🎧 EVENTOS DE SCROLL

Puedes detectar cuando el usuario hace scroll.

---

# ✅ Ejemplo

```js
window.addEventListener("scroll", () => {
    console.log(scrollY)
})
```

---

# 🧠 Casos reales

✅ animaciones
✅ navbar dinámica
✅ lazy loading
✅ efectos parallax

---

# ⚡ OPTIMIZACIÓN DE RENDIMIENTO (PRO)

El evento `scroll` se dispara decenas de veces por segundo. Escucharlo sin control puede ralentizar la web (un fenómeno llamado "jank").

### ✅ Throttle (Control de frecuencia)
Limita la ejecución de una función para que solo ocurra, por ejemplo, cada 100ms.

```js
const throttle = (callback, delay) => {
    let lastTime = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastTime < delay) return;
        lastTime = now;
        callback(...args);
    };
};

window.addEventListener("scroll", throttle(() => {
    console.log("Scroll optimizado ejecutándose...");
}, 100));
```

---

# 👁️ INTERSECTION OBSERVER API

Es la alternativa moderna a calcular `scrollY`. Permite ejecutar código solo cuando un elemento entra o sale del Viewport de forma nativa y eficiente.

```js
const opciones = {
    root: null, // usa el viewport
    threshold: 0.5 // se activa al ver el 50% del elemento
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            console.log("Elemento detectado");
        }
    });
}, opciones);

observer.observe(document.querySelector(".mi-seccion"));
```

---

# ♿ ACCESIBILIDAD Y MOVIMIENTO REDUCIDO

Algunos usuarios tienen trastornos vestibulares y el scroll suave puede causarles náuseas. Es una buena práctica respetar sus ajustes de sistema.

```js
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth"
});
```

# ❌ ERRORES COMUNES

---

# ❌ Confundir screen con viewport

```txt
screen = monitor completo
viewport = navegador visible
```

---

# ❌ Usar demasiados eventos scroll

Puede afectar rendimiento.

---

# ❌ Scroll infinito mal optimizado

Consume muchos recursos.

---

# 🧠 DEBUGGING

---

# ✅ Ver propiedades screen

```js
console.table(screen)
```

---

# ✅ Ver scroll en vivo

```js
setInterval(() => {
    console.log(scrollY)
}, 1000)
```

---

# 🚀 MINI PROYECTO PRÁCTICO

---

# 🎯 OBJETIVO

Crear un sistema que:

✅ detecte resolución
✅ detecte scroll
✅ haga scroll automático
✅ muestre información consola

---

# ✅ Código

```js
console.log(`
Resolución:
${screen.width} x ${screen.height}
`)

window.addEventListener("scroll", () => {
    console.log(`Scroll actual: ${scrollY}`)
})

setTimeout(() => {
    window.scrollTo({
        top: 800,
        behavior: "smooth"
    })
}, 3000)
```

---

# 🧠 RESUMEN FINAL

| Propiedad/Método | Función                    |
| ---------------- | -------------------------- |
| screen.width     | ancho pantalla             |
| screen.height    | alto pantalla              |
| availWidth       | ancho disponible           |
| availHeight      | alto disponible            |
| colorDepth       | profundidad color          |
| pixelDepth       | profundidad píxeles        |
| screenLeft       | posición izquierda ventana |
| screenTop        | posición superior ventana  |
| scrollX          | scroll horizontal          |
| scrollY          | scroll vertical            |
| scrollTo()       | mover scroll exacto        |
| scrollBy()       | mover relativo             |
| scroll()         | mover scroll               |
| resizeTo()       | cambiar tamaño exacto      |
| resizeBy()       | cambiar tamaño relativo    |
| moveTo()         | mover ventana absoluto     |
| moveBy()         | mover ventana relativo     |
| minimize()       | minimizar ventana          |

---

# 🏆 CONCLUSIÓN

Dominar `screen`, `scroll`, `resize` y `move` te permite:

✅ crear interfaces responsive
✅ detectar comportamiento usuario
✅ controlar ventanas navegador
✅ construir animaciones modernas
✅ optimizar UX
✅ manipular posición y tamaño ventanas
✅ crear experiencias frontend avanzadas

Son herramientas FUNDAMENTALES en desarrollo web moderno.
