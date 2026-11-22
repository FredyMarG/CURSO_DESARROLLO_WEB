# GUÍA COMPLETA — Objetos `BarProp` en JavaScript

> **Nivel:** JavaScript Mid Level (BOM — Browser Object Model)  
> **Objetivo:** Comprender qué son los objetos `BarProp` del objeto `window`, qué representa cada una de sus seis propiedades (`locationbar`, `menubar`, `personalbar`, `scrollbars`, `statusbar`, `toolbar`), por qué hoy son de solo lectura por seguridad y qué APIs modernas los reemplazan.

---

## 1. ¿Qué son los objetos `BarProp`?

La interfaz **`BarProp`** (propiedad de barra) del *Browser Object Model* (BOM) representa la visibilidad de distintos elementos de la interfaz del navegador (*chrome* del navegador) asociados a la ventana actual (`window`).

Cada propiedad devuelve una instancia de `BarProp` cuya única propiedad estándar es:

- **`.visible`** (*booleano de solo lectura*): devuelve `true` si el navegador considera visible esa barra, o `false` si está oculta (por ejemplo, en una ventana emergente mínima o modo aplicación).

```javascript
console.log(window.locationbar);         // BarProp { visible: true }
console.log(window.locationbar.visible); // true
```

> **Importante:** En navegadores modernos, `BarProp.visible` es **solo lectura**. Intentar asignar `window.toolbar.visible = false` no oculta la barra y se ignora silenciosamente (o falla en modo estricto si se intenta redefinir).

---

## 2. Estructura en `window`

```text
window
 ├── locationbar  ──▶ Barra de direcciones (URL)
 ├── menubar      ──▶ Barra de menú (Archivo, Editar, Ver...)
 ├── personalbar  ──▶ Barra de marcadores / favoritos
 ├── scrollbars   ──▶ Barras de desplazamiento de la ventana
 ├── statusbar    ──▶ Barra de estado inferior
 └── toolbar      ──▶ Barra de herramientas (Atrás, Adelante, Recargar)
```

Esquema visual en una ventana clásica de escritorio:

```text
┌─────────────────────────────────────────────────────────────┐
│ Archivo  Editar  Ver  Historial                 (menubar)   │
├─────────────────────────────────────────────────────────────┤
│ ←  →  ⟳  🏠  │ https://ejemplo.com              (toolbar /  │
│              │                                  locationbar)│
├─────────────────────────────────────────────────────────────┤
│ ⭐ Favoritos  ⭐ Docs  ⭐ GitHub               (personalbar)│
├───────────────────────────────────────────────────────────┬─┤
│                                                           │▲│
│  Contenido de la página web (Viewport)                    │█│ ← scrollbars
│                                                           │▼│
├───────────────────────────────────────────────────────────┴─┤
│ Listo / Cargando...                             (statusbar) │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Las 6 propiedades `BarProp`

### 🌍 `window.locationbar`
Representa la **barra de direcciones** donde el usuario escribe o verifica la URL y el candado HTTPS.
```javascript
if (window.locationbar.visible) {
  console.log("La barra de direcciones está visible.");
}
```

### 🍔 `window.menubar`
Representa la **barra de menú superior** (Archivo, Editar, Ver). En muchos navegadores modernos de escritorio y móviles está oculta o unificada en un menú de tres puntos, aunque `visible` suele devolver `true` por compatibilidad.

### ⭐ `window.personalbar`
Representa la **barra personal o de marcadores/favoritos**. Su valor depende de la implementación de cada navegador.

### 📜 `window.scrollbars`
Representa si las **barras de desplazamiento** de la ventana están habilitadas para mostrarse.
> **Aclaración:** `window.scrollbars` **no** mide la posición del scroll ni permite hacer scroll. Para eso existen `window.scrollY` y `window.scrollTo()`.

### 🔔 `window.statusbar`
Representa la **barra de estado inferior** clásica. Hoy casi ha desaparecido como barra fija (los navegadores suelen mostrar un aviso flotante temporal al pasar el cursor sobre un enlace).

### 🛠️ `window.toolbar`
Representa la **barra de herramientas principal** (botones Atrás, Adelante, Recargar, Inicio).

---

## 4. Inspección rápida en consola

Puedes inspeccionar todas las propiedades `BarProp` de una sola vez usando `console.table()`:

```javascript
const estadoBarras = {
  locationbar: window.locationbar.visible,
  menubar: window.menubar.visible,
  personalbar: window.personalbar.visible,
  scrollbars: window.scrollbars.visible,
  statusbar: window.statusbar.visible,
  toolbar: window.toolbar.visible
};

console.table(estadoBarras);
console.dir(window.locationbar);
```

---

## 5. Compatibilidad moderna, historia y seguridad

En los inicios de la web, los scripts podían abrir ventanas con `window.open()` ocultando casi todas las barras (`toolbar=no,location=no,status=no`). Esto generó graves problemas:

- **Phishing y suplantación:** un sitio malicioso podía ocultar la barra de direcciones (`locationbar`) y dibujar una barra falsa para engañar al usuario.
- **Popups agresivos:** ventanas sin controles difíciles de cerrar o navegar.

Por **seguridad y privacidad**, los navegadores modernos:
1. Impiden ocultar la `locationbar` desde JavaScript estándar.
2. Hacen `.visible` **de solo lectura** en todas las propiedades `BarProp`.
3. Devuelven `true` por defecto en la mayoría de pestañas normales (o `false` solo en contextos específicos como `window.open()` con características restringidas o PWAs instaladas).

---

## 6. Alternativas modernas recomendadas

En desarrollo web actual, **no dependas de `BarProp`** para tomar decisiones de diseño o lógica. Usa las APIs modernas equivalentes:

| Necesidad actual | No uses (`BarProp`) | Usa en su lugar |
| :--- | :--- | :--- |
| Detectar si la app corre como PWA sin barras | `window.toolbar.visible` | `window.matchMedia("(display-mode: standalone)").matches` |
| Conocer el tamaño útil de pantalla | `window.toolbar` / `menubar` | `window.innerWidth`, `window.innerHeight` y `ResizeObserver` |
| Leer o mover el desplazamiento | `window.scrollbars` | `window.scrollY`, `window.scrollTo()`, CSS `overflow` |
| Ocultar interfaz del navegador bajo permiso del usuario | `window.menubar.visible = false` | Fullscreen API (`element.requestFullscreen()`) |

### Ejemplo moderno: detectar modo aplicación (PWA)

```javascript
const esPWA = window.matchMedia("(display-mode: standalone)").matches;
console.log("¿Ejecutando como app instalada?:", esPWA);
```

---

## 7. Errores comunes y buenas prácticas

### ❌ Errores comunes
1. **Intentar modificar `.visible`:** `window.statusbar.visible = false` no tiene efecto en navegadores modernos.
2. **Confundir `window.scrollbars` con el scroll real:** `scrollbars` solo indica visibilidad de la barra; para mover la página usa `window.scrollTo({ top: 0, behavior: "smooth" })`.
3. **Usar `BarProp` para diseño responsivo:** usa Media Queries CSS, Container Queries o `window.matchMedia()`.

### ✅ Buenas prácticas
- Trata `BarProp` como **propiedad informativa de solo lectura** y de valor histórico/diagnóstico.
- Verifica siempre la existencia con encadenamiento opcional si trabajas en entornos híbridos (`window.locationbar?.visible`).
- Prefiere `matchMedia("(display-mode: standalone)")` para adaptar la interfaz en PWAs instaladas.

---

## 8. Ejercicios y solucionario

## Ejercicios
1. **Nivel 1 (Inspección):** Imprime en consola una tabla (`console.table`) con el estado `.visible` de las 6 propiedades `BarProp`.
2. **Nivel 2 (Diagnóstico):** Crea una función `obtenerResumenInterfaz()` que devuelva un objeto con el estado de las barras, el ancho interno (`innerWidth`) y si la app está en modo `standalone` (PWA).
3. **Nivel 3 (Comprobación):** Demuestra en código qué ocurre al intentar asignar `window.toolbar.visible = false` y explica por qué el valor no cambia.

## Solucionario paso a paso

```javascript
// Nivel 1 y 2: Resumen completo de interfaz y diagnóstico
function obtenerResumenInterfaz() {
  return {
    barras: {
      locationbar: window.locationbar?.visible ?? null,
      menubar: window.menubar?.visible ?? null,
      personalbar: window.personalbar?.visible ?? null,
      scrollbars: window.scrollbars?.visible ?? null,
      statusbar: window.statusbar?.visible ?? null,
      toolbar: window.toolbar?.visible ?? null
    },
    viewport: {
      ancho: window.innerWidth,
      alto: window.innerHeight
    },
    esPWA: window.matchMedia("(display-mode: standalone)").matches
  };
}

console.table(obtenerResumenInterfaz().barras);

// Nivel 3: Demostración de solo lectura
window.toolbar.visible = false; // Ignorado en modo no estricto; TypeError en 'use strict'
console.log("Toolbar sigue siendo:", window.toolbar.visible);
```

---

## 9. Hoja de trucos (Cheatsheet)

| Propiedad | Qué representa | Estado actual |
| :--- | :--- | :--- |
| `window.locationbar.visible` | Barra de direcciones (URL) | Solo lectura / diagnóstico |
| `window.menubar.visible` | Barra de menú | Solo lectura / compatibilidad |
| `window.personalbar.visible` | Barra de favoritos / marcadores | Solo lectura |
| `window.scrollbars.visible` | Barras de desplazamiento | Solo lectura (usa CSS `overflow`) |
| `window.statusbar.visible` | Barra de estado inferior | Solo lectura / obsoleta visualmente |
| `window.toolbar.visible` | Barra de herramientas principal | Solo lectura |
| `matchMedia("(display-mode: standalone)")` | Modo app instalada (PWA) | **Estándar moderno recomendado** |

## Resumen técnico
- `BarProp` forma parte del BOM (`window`) y expone únicamente `.visible`.
- Por seguridad anti-phishing, los navegadores modernos impiden ocultar barras desde JavaScript.
- Para interfaces modernas, utiliza `matchMedia()`, `ResizeObserver`, `scrollY`/`scrollTo()` y la Fullscreen API.
