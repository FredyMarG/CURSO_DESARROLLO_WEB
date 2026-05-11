````md
# 🌐 GUÍA RESIZE, MOVE Y SCROLL EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué son los métodos de control de ventana?
2. Diferencia entre tamaño y posición
3. `resizeTo()`
4. `resizeBy()`
5. `moveTo()`
6. `moveBy()`
7. `minimize()`
8. Scroll avanzado
9. Casos reales
10. Restricciones modernas de navegadores
11. Buenas prácticas
12. Errores comunes
13. Debugging
14. Resumen final

---

# 🪟 ¿QUÉ SON LOS MÉTODOS DE CONTROL DE VENTANA?

JavaScript permite manipular ciertas características de la ventana del navegador.

Podemos:

✅ Cambiar tamaño  
✅ Mover ventanas  
✅ Detectar scroll  
✅ Hacer scroll automático  
✅ Detectar pantallas móviles  

Todo esto se hace mediante el objeto:

```js
window
```

---

# 🧠 DIFERENCIA ENTRE TAMAÑO Y POSICIÓN

| Concepto | Qué modifica |
| --- | --- |
| Resize | Tamaño |
| Move | Posición |
| Scroll | Desplazamiento interno |

---

# 📐 `resizeTo()`

Redimensiona la ventana a un tamaño exacto.

---

# ✅ Sintaxis

```js
window.resizeTo(ancho, alto)
```

---

# ✅ Ejemplo

```js
window.resizeTo(800, 600)
```

---

# 📌 Parámetros

| Parámetro | Significado |
| --- | --- |
| 800 | ancho |
| 600 | alto |

---

# 🧠 VISUAL

```txt
ANTES
┌─────────────────────┐
│                     │
│                     │
│                     │
└─────────────────────┘

window.resizeTo(800, 600)

DESPUÉS
┌───────────────┐
│               │
│               │
└───────────────┘
```

---

# ⚠️ IMPORTANTE

Solo funciona normalmente en ventanas abiertas con:

```js
window.open()
```

---

# ❌ En pestañas normales puede fallar

Los navegadores modernos bloquean esto por seguridad.

---

# 🚀 CASO REAL

---

# ✅ Popup personalizado

```js
const ventana = window.open("", "", "width=300,height=300")

ventana.resizeTo(500, 500)
```

---

# 📐 `resizeBy()`

Modifica el tamaño relativo al tamaño actual.

---

# ✅ Sintaxis

```js
window.resizeBy(x, y)
```

---

# ✅ Ejemplo

```js
window.resizeBy(100, 50)
```

---

# 🧠 VISUAL

```txt
Ventana actual: 1000x600
            ↓
window.resizeBy(100, 50)
            ↓
Nueva ventana: 1100x650
```

---

# 📌 DIFERENCIA CLAVE

| Método | Tipo |
| --- | --- |
| resizeTo | Tamaño exacto |
| resizeBy | Cambio relativo |

---

# 📍 `moveTo()`

Mueve la ventana a una posición exacta en pantalla.

---

# ✅ Sintaxis

```js
window.moveTo(x, y)
```

---

# ✅ Ejemplo

```js
window.moveTo(100, 200)
```

---

# 📌 Parámetros

| Parámetro | Significado |
| --- | --- |
| 100 | píxeles x |
| 200 | píxeles y |

---

# 🧠 VISUAL

```txt
(0,0) ┌─ PANTALLA ─────┐
      │                │
      │ (100,200)      │
      │ ┌─ VENTANA ─┐  │
      │ │           │  │
      │ │           │  │
      │ └───────────┘  │
      └────────────────┘
```

---

# 📍 `moveBy()`

Mueve la ventana relativo a la posición actual.

---

# ✅ Sintaxis

```js
window.moveBy(x, y)
```

---

# ✅ Ejemplo

```js
window.moveBy(50, 30)
```

---

# 🧠 VISUAL

```txt
Posición actual: (100, 200)
          ↓
window.moveBy(50, 30)
          ↓
Nueva posición: (150, 230)
```

---

# 📌 DIFERENCIA CLAVE

| Método | Tipo |
| --- | --- |
| moveTo | Posición exacta |
| moveBy | Movimiento relativo |

---

# 🪟 `minimize()`

Intenta minimizar la ventana actual.

---

# ✅ Ejemplo

```js
window.minimize()
```

---

# ⚠️ IMPORTANTE

No es estándar.

---

# ❌ Problema

Muchos navegadores NO soportan este método.

---

# 🧠 REALIDAD MODERNA

Actualmente los navegadores restringen mucho:

✅ mover ventanas  
✅ redimensionar  
✅ minimizar  

por razones de seguridad.

---

# 🚀 SCROLL EN JAVASCRIPT

El scroll es el desplazamiento vertical u horizontal de la página.

---

# 📍 `scrollTo()`

Mueve el scroll a una posición exacta.

---

# ✅ Sintaxis

```js
window.scrollTo(x, y)
```

---

# ✅ Ejemplo simple

```js
window.scrollTo(0, 500)
```

---

# 🧠 VISUAL

```txt
INICIO
│
│
│
▼ ScrollTo(0,500)
│
│
▼ NUEVA POSICIÓN
```

---

# 🚀 Scroll suave moderno

```js
window.scrollTo({
    top: 0,
    behavior: "smooth"
})
```

---

# 🧠 EXPLICACIÓN

| Propiedad | Función |
| --- | --- |
| top | posición vertical |
| behavior | animación |

---

# ✅ CASO REAL — BOTÓN “IR ARRIBA”

```html
<button id="btnTop">Subir</button>
```

```js
const btn = document.getElementById("btnTop")

btn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

})
```

---

# 📌 RESULTADO

Cuando el usuario hace click:

✅ la página sube  
✅ suavemente  
✅ con animación moderna  

---

# 📏 DETECTAR TAMAÑO DE PANTALLA

Usando:

```js
screen.width
```

---

# ✅ Detectar móvil

```js
if(screen.width <= 768){

    console.log("Móvil")

}
```

---

# 🧠 EXPLICACIÓN

| Valor | Dispositivo |
| --- | --- |
| <= 768 | móvil |
| <= 1024 | tablet |
| > 1024 | escritorio |

---

# 🚀 CASO REAL

---

# ✅ Cambiar diseño móvil

```js
if(screen.width <= 768){

    document.body.style.background = "lightblue"

}
```

---

# 📜 DETECTAR SCROLL EN TIEMPO REAL

---

# ✅ Ejemplo

```js
window.addEventListener("scroll", () => {

    console.log(`Scroll: ${scrollY}`)

})
```

---

# 🧠 EXPLICACIÓN

| Elemento | Función |
| --- | --- |
| scroll | evento al desplazarse |
| scrollY | posición vertical |

---

# 📌 RESULTADO

```txt
Scroll: 0
Scroll: 50
Scroll: 120
Scroll: 500
```

---

# 🚀 CASOS REALES PROFESIONALES

---

# ✅ Navbar dinámica

```js
window.addEventListener("scroll", () => {

    if(scrollY > 100){

        console.log("Navbar compacta")

    }

})
```

---

# ✅ Mostrar botón flotante

```js
window.addEventListener("scroll", () => {

    if(scrollY > 300){

        console.log("Mostrar botón")

    }

})
```

---

# ✅ Lazy loading

```js
window.addEventListener("scroll", () => {

    console.log("Cargar imágenes")

})
```

---

# ⚠️ RESTRICCIONES MODERNAS

---

# ❌ Muchos métodos están limitados

Los navegadores modernos bloquean:

❌ resize agresivo  
❌ mover pestañas normales  
❌ minimizar ventanas  
❌ popups automáticos  

---

# 🧠 ¿POR QUÉ?

Por seguridad y experiencia de usuario.

Antes las páginas abusaban de esto.

---

# 🚨 ERRORES COMUNES

---

# ❌ Usar resize en pestaña normal

```js
window.resizeTo(300, 300)
```

Puede no funcionar.

---

# ❌ Usar scrollY sin scroll

```js
console.log(scrollY)
```

Siempre será 0 si no hay desplazamiento.

---

# ❌ Confundir screen con window

```js
screen.width
```

NO es lo mismo que:

```js
window.innerWidth
```

---

# 📌 DIFERENCIA

| Propiedad | Qué mide |
| --- | --- |
| screen.width | pantalla total |
| innerWidth | ventana navegador |

---

# 🔥 DEBUGGING PROFESIONAL

---

# ✅ Ver tamaño ventana

```js
console.log(window.innerWidth)
console.log(window.innerHeight)
```

---

# ✅ Ver scroll actual

```js
console.log(scrollY)
```

---

# ✅ Detectar resize

```js
window.addEventListener("resize", () => {

    console.log("Ventana redimensionada")

})
```

---

# 🧠 EVENTOS IMPORTANTES

| Evento | Cuándo ocurre |
| --- | --- |
| scroll | al desplazar |
| resize | al cambiar tamaño |
| load | al cargar |
| beforeunload | antes de cerrar |

---

# 🚀 EJEMPLO NIVEL PRO

---

# ✅ Sistema responsive dinámico

```js
window.addEventListener("resize", () => {

    if(window.innerWidth <= 768){

        console.log("Modo móvil")

    }else{

        console.log("Modo escritorio")

    }

})
```

---

# 🧠 FLUJO COMPLETO

```txt
Usuario cambia tamaño
           ↓
Evento resize
           ↓
JavaScript detecta ancho
           ↓
Cambian estilos/comportamiento
```

---

# 🏆 BUENAS PRÁCTICAS

---

# ✅ Usar resize con moderación

Muchos eventos resize consumen rendimiento.

---

# ✅ Usar scroll optimizado

El evento scroll ocurre MUCHÍSIMAS veces.

---

# ✅ Preferir CSS responsive

No depender solo de JS.

---

# ✅ Usar smooth scroll moderno

```js
behavior: "smooth"
```

---

# ❌ NO abusar de popups

Los navegadores pueden bloquearlos.

---

# 🧪 EJERCICIOS

---

# ✅ Ejercicio 1

Crear un botón que haga scroll abajo.

---

# ✅ Ejercicio 2

Mostrar en consola el tamaño de la ventana.

---

# ✅ Ejercicio 3

Detectar cuándo el usuario llega al final.

---

# 💡 PISTA

```js
window.innerHeight
document.body.scrollHeight
scrollY
```

---

# 🧠 RESUMEN FINAL

| Método | Función |
| --- | --- |
| resizeTo | tamaño exacto |
| resizeBy | cambio relativo |
| moveTo | posición exacta |
| moveBy | movimiento relativo |
| scrollTo | mover scroll |
| scrollY | posición scroll |
| screen.width | ancho pantalla |

---

# 🏆 CONCLUSIÓN

El control de ventanas y scroll permite:

✅ interfaces dinámicas  
✅ experiencia moderna  
✅ efectos visuales  
✅ responsive design  
✅ navegación avanzada  

Pero los navegadores modernos limitan varias funciones por seguridad.

Hoy en día lo más usado realmente es:

🔥 scroll  
🔥 resize  
🔥 responsive  
🔥 eventos dinámicos  

mientras que mover/minimizar ventanas es cada vez menos común.
````
