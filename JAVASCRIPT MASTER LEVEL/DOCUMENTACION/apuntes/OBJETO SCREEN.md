# GUÍA COMPLETA — El Objeto `screen` (`window.screen`) en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API del objeto `window.screen` en JavaScript para consultar las dimensiones físicas de la pantalla, el área disponible libre de barras del sistema operativo, la profundidad de color y la orientación del dispositivo.

---

# 📚 Temario

1. Definición: ¿Qué es el objeto `screen`?
2. Dimensiones totales vs disponibles (`width`/`height` vs `availWidth`/`availHeight`)
3. Profundidad de color y píxeles (`colorDepth` y `pixelDepth`)
4. Orientación de pantalla (`screen.orientation`)
5. Comparativa: `screen` vs `window.innerWidth` vs `window.outerWidth`
6. Densidad de píxeles (`window.devicePixelRatio`)
7. Analogía del mundo real
8. Diagrama de flujo de decisión
9. Buenas prácticas y errores comunes
10. Ejercicios y Solucionario paso a paso
11. Hoja de Trucos (Cheatsheet)

---

# Definición

El objeto **`screen`** (accesible globalmente como `screen` o `window.screen`) contiene información de **solo lectura** sobre la pantalla física o monitor en el que se encuentra la ventana del navegador.

A diferencia de `window.innerWidth` (que mide el área visible de la pestaña web), `screen` informa sobre el **hardware y el escritorio del sistema operativo** en píxeles CSS lógicos.

---

# Dimensiones Totales vs Disponibles

* **`screen.width` / `screen.height`:** Ancho y alto total de la pantalla (ej. `1920` × `1080`).
* **`screen.availWidth` / `screen.availHeight`:** Ancho y alto disponible para ventanas, descontando elementos permanentes del sistema operativo como la barra de tareas de Windows o el Dock/barra de menús de macOS.

```javascript
console.log("Resolución total:", screen.width, "x", screen.height);
console.log("Área disponible:", screen.availWidth, "x", screen.availHeight);

// Calcular cuántos píxeles ocupa la barra de tareas
const barraTareasAlto = screen.height - screen.availHeight;
console.log("Altura de barra del sistema:", barraTareasAlto, "px");
```

---

# Profundidad de Color (`colorDepth` y `pixelDepth`)

* **`screen.colorDepth`:** Cantidad de bits utilizados para representar el color de un píxel (en pantallas modernas suele ser `24` bits para *True Color* o `30`/`32` en monitores HDR).
* **`screen.pixelDepth`:** Profundidad de bits por píxel de la pantalla; en navegadores modernos suele coincidir con `colorDepth`.

```javascript
console.log("Profundidad de color:", screen.colorDepth, "bits");
console.log("Profundidad de píxel:", screen.pixelDepth, "bits");
```

---

# Orientación de Pantalla (`screen.orientation`)

Permite conocer si la pantalla está en formato horizontal (*landscape*) o vertical (*portrait*), su ángulo (`0`, `90`, `180`, `270`) y reaccionar cuando el usuario gira su teléfono o tablet.

```javascript
if (screen.orientation) {
    console.log("Tipo:", screen.orientation.type);   // ej. "landscape-primary"
    console.log("Ángulo:", screen.orientation.angle); // ej. 0

    screen.orientation.addEventListener("change", () => {
        console.log("Nueva orientación:", screen.orientation.type);
    });
}
```

---

# Comparativa: `screen` vs `innerWidth` vs `outerWidth`

| Propiedad | Qué mide | Cambia al redimensionar la ventana |
| :--- | :--- | :--- |
| `screen.width` / `screen.height` | Monitor completo | No |
| `screen.availWidth` / `screen.availHeight` | Monitor sin barra de tareas | No |
| `window.outerWidth` / `window.outerHeight` | Ventana del navegador con marcos/pestañas | Sí |
| `window.innerWidth` / `window.innerHeight` | Solo el viewport de la página web | Sí |

---

# Densidad de Píxeles (`window.devicePixelRatio`)

En pantallas Retina o móviles de alta densidad, `screen.width` reporta **píxeles CSS lógicos**, no píxeles físicos reales de hardware. Para obtener la resolución física aproximada se multiplica por `window.devicePixelRatio`:

```javascript
const dpr = window.devicePixelRatio || 1;
console.log("Píxeles físicos estimados:", screen.width * dpr, "x", screen.height * dpr);
```

---

# Analogía del mundo real

Imagina un **escritorio físico** sobre el que colocas una **hoja de papel**:
* `screen.width` × `screen.height` es el **tamaño total del escritorio**.
* `screen.availWidth` × `screen.availHeight` es el **espacio libre del escritorio** después de restar el portalápices fijo en la esquina (la barra de tareas).
* `window.innerWidth` × `window.innerHeight` es el **tamaño de la hoja de papel** (la ventana de tu navegador) que puedes abrir grande o pequeña encima del escritorio.

---

# Diagrama de flujo de decisión

```
[ ¿Necesitas adaptar tu diseño CSS o JS? ]
                  │
     ┌────────────┴────────────┐
     ▼                         ▼
¿Tamaño de tu página?    ¿Tamaño del monitor/SO?
     │                         │
     ▼                         ▼
window.innerWidth       screen.width / availWidth
o matchMedia()          screen.orientation / colorDepth
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Usa `window.innerWidth` o CSS `matchMedia()` para diseño responsivo:** El usuario puede tener una ventana estrecha en un monitor 4K.
* **Usa `screen.availWidth` / `screen.availHeight` cuando calcules dimensiones máximas para `window.open()`:** Evitarás que la ventana emergente quede oculta detrás de la barra de tareas.

### ❌ Errores Comunes
* **Asumir que `screen.width` es el ancho disponible de tu sitio web:** En escritorio la ventana rara vez ocupa toda la pantalla si el usuario usa pantalla dividida.
* **Intentar asignar valores a `screen.width = 800`:** Las propiedades de `screen` son de solo lectura.

---

# Ejercicios

## Nivel 1
Imprime en consola las dimensiones totales de la pantalla (`screen.width` y `screen.height`) y el área disponible (`screen.availWidth` y `screen.availHeight`).

## Nivel 2
Calcula cuántos píxeles verticales y horizontales ocupa la barra de tareas o dock del sistema operativo usando la diferencia entre `screen` total y `screen` disponible.

## Nivel 3
Crea una función `obtenerResumenPantalla()` que retorne un objeto con: `resolucionLogica`, `resolucionFisica` (usando `devicePixelRatio`), `colorDepth` y `orientacion` (`screen.orientation?.type || "desconocida"`).

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
console.log(`Total: ${screen.width}x${screen.height}`);
console.log(`Disponible: ${screen.availWidth}x${screen.availHeight}`);
```

## Solución Nivel 2
```javascript
const barraHorizontal = screen.width - screen.availWidth;
const barraVertical = screen.height - screen.availHeight;
console.log(`Espacio ocupado por barras del SO -> Ancho: ${barraHorizontal}px, Alto: ${barraVertical}px`);
```

## Solución Nivel 3
```javascript
function obtenerResumenPantalla() {
    const dpr = window.devicePixelRatio || 1;
    return {
        resolucionLogica: `${screen.width}x${screen.height}`,
        resolucionFisica: `${Math.round(screen.width * dpr)}x${Math.round(screen.height * dpr)}`,
        colorDepth: `${screen.colorDepth} bits`,
        orientacion: screen.orientation?.type || "desconocida"
    };
}
console.log(obtenerResumenPantalla());
```

---

# Hoja de Trucos (Cheatsheet)

| Propiedad | Descripción |
| :--- | :--- |
| `screen.width` / `screen.height` | Ancho y alto total del monitor en píxeles CSS |
| `screen.availWidth` / `screen.availHeight` | Área útil descontando barra de tareas / dock |
| `screen.colorDepth` / `screen.pixelDepth` | Bits por píxel para representar colores (ej. `24`) |
| `screen.orientation.type` | Orientación actual (`landscape-primary`, `portrait-primary`) |
| `screen.orientation.angle` | Ángulo de rotación (`0`, `90`, `180`, `270`) |
