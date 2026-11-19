# GUÍA COMPLETA — API de Intersection Observer en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de `IntersectionObserver` en JavaScript para detectar de forma asíncrona y eficiente cuándo un elemento entra o sale del área visible (*viewport*), optimizar el rendimiento web y construir funcionalidades modernas como *lazy loading* y *scroll infinito*.

---

# 📚 Temario

1. ¿Qué es y para qué sirve `IntersectionObserver`?
2. El constructor `IntersectionObserver()`
3. Parámetros clave: `callback` y `options`
4. La propiedad `isIntersecting`
5. Configurar `options` (`root`, `rootMargin`, `threshold`)
6. Métodos de control (`observe()`, `unobserve()`, `disconnect()`)
7. Analogías del mundo real
8. Diagrama de flujo del ciclo de observación
9. Buenas prácticas y errores comunes
10. Proyecto Integrador: Ejemplo de uso (Lazy Loading de Imágenes)
11. Resumen técnico

---

# ¿Qué es y para qué sirve?

La API de **Intersection Observer** proporciona una forma asíncrona y altamente eficiente de observar los cambios en la intersección de un elemento objetivo (*target*) con un elemento ancestro o con el área visible principal del documento (*viewport*).

Anteriormente, detectar si un elemento era visible en pantalla obligaba a escuchar el evento `scroll` y ejecutar cálculos costosos como `getBoundingClientRect()` en el hilo principal, provocando bloqueos y caídas de fotogramas (*jank*). 

**Principales casos de uso:**
* **Carga diferida (*Lazy Loading*):** Cargar imágenes, videos o componentes pesados únicamente cuando el usuario está a punto de verlos.
* **Scroll Infinito (*Infinite Scroll*):** Detectar cuándo el usuario llega al final de una lista para solicitar nuevos datos a una API.
* **Animaciones al hacer scroll:** Disparar transiciones CSS cuando una sección entra en pantalla.
* **Control de reproducción multimedia:** Pausar automáticamente un video cuando sale del campo de visión y reanudarlo al volver.

---

# El constructor `IntersectionObserver()`

Para utilizar esta API, primero se debe instanciar un objeto mediante el constructor `new IntersectionObserver()`. Este recibe dos argumentos: una función ejecutada cuando ocurre un cruce (`callback`) y un objeto opcional de reglas (`options`).

```javascript
// Sintaxis base del constructor
const observador = new IntersectionObserver(callback, options);
```

Una vez creada la instancia, se le indica qué elemento o elementos del DOM debe vigilar utilizando el método `.observe(elemento)`.

```javascript
const caja = document.getElementById("caja-objetivo");

// Iniciamos la vigilancia sobre el elemento
observador.observe(caja);
```

---

# Parámetros clave: `callback` y `options`

El funcionamiento del observador depende de la interacción entre su función de respuesta y sus reglas de configuración.

### 1. El `callback`
Es la función que el navegador ejecuta de forma asíncrona cada vez que un elemento observado cruza el umbral configurado. Recibe dos parámetros:
* **`entries`:** Un arreglo (*Array*) de objetos `IntersectionObserverEntry`. Cada objeto contiene información detallada sobre el estado de intersección de un elemento vigilado.
* **`observer`:** Una referencia a la propia instancia del observador que disparó la función (útil para dejar de observar desde adentro).

```javascript
const verificarVisibilidad = (entries, observer) => {
    entries.forEach(entry => {
        console.log("Elemento evaluado:", entry.target);
        console.log("Porcentaje visible:", entry.intersectionRatio);
    });
};
```

### 2. El objeto `options`
Es un objeto literal opcional que define las condiciones exactas bajo las cuales se invocará el `callback`. Si se omite, el navegador utiliza valores predeterminados basados en la ventana completa (*viewport*).

---

# La propiedad `isIntersecting`

Dentro de cada objeto `entry` recibido en el `callback`, la propiedad booleana **`isIntersecting`** es la más importante y utilizada en el desarrollo diario.

* **`true`:** El elemento objetivo ha entrado en el área de intersección (es visible según las reglas definidas).
* **`false`:** El elemento objetivo ha salido del área de intersección (dejó de ser visible).

> **Nota importante:** El `callback` se ejecuta **una vez al inicializar** la observación para reportar el estado actual del elemento, incluso si no ha ocurrido ningún movimiento de scroll. Por ello, validar `if (entry.isIntersecting)` es fundamental.

```javascript
const callback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        } else {
            entry.target.classList.remove("visible");
        }
    });
};
```

---

# Configurar `options`

El objeto `options` permite personalizar con precisión milimétrica la zona de detección mediante tres propiedades:

```javascript
const options = {
    root: null,           // Contenedor de referencia
    rootMargin: "0px",    // Margen de expansión o contracción
    threshold: 0.5        // Umbral de visibilidad (50%)
};
```

### 1. `root`
Define el elemento contenedor que actúa como marco de visión para comprobar la visibilidad del objetivo.
* **`null` (por defecto):** Utiliza el *viewport* completo de la ventana del navegador.
* **Elemento DOM:** Puede ser cualquier contenedor padre con desplazamiento interno (por ejemplo, `document.querySelector(".contenedor-scroll")`).

### 2. `rootMargin`
Funciona exactamente igual que la propiedad `margin` en CSS (`"top right bottom left"`). Permite agrandar o encoger el cuadro delimitador del `root` antes de calcular las intersecciones.
* **Valores positivos (ej. `"200px"`):** Dispara el evento **antes** de que el elemento entre realmente en la pantalla. Ideal para precargar imágenes sin que el usuario note retrasos.
* **Valores negativos (ej. `"-50px"`):** Exige que el elemento entre más adentro de la pantalla antes de considerarse visible.

### 3. `threshold` (Umbral)
Indica qué porcentaje del elemento objetivo debe estar visible para que se ejecute el `callback`.
* **Número único (`0` a `1`):** `0` (por defecto) significa que se dispara apenas **1 píxel** entra en pantalla. `1.0` exige que el **100%** del elemento sea visible.
* **Arreglo de números (ej. `[0, 0.25, 0.5, 1]`):** Ejecuta el `callback` múltiples veces a medida que el elemento alcanza cada uno de los porcentajes listados.

---

# Métodos de control del observador

La instancia creada expone métodos esenciales para gestionar el ciclo de vida de la observación y evitar fugas de memoria:

* **`observer.observe(target)`:** Añade un elemento a la lista de vigilancia.
* **`observer.unobserve(target)`:** Detiene la vigilancia de un elemento específico (muy usado cuando una imagen ya cargó y no necesita volver a evaluarse).
* **`observer.disconnect()`:** Detiene por completo la observación de **todos** los elementos asociados a esa instancia.

---

# Analogías del mundo real

### 1. El Sensor de Movimiento de una Puerta Automática 🚪
* **`IntersectionObserver`** es el sensor infrarrojo instalado encima de la puerta de un supermercado. No está preguntando cada milisegundo "¿hay alguien ahí?" (como haría el evento `scroll`), sino que permanece en reposo hasta que alguien cruza su zona.
* **`rootMargin`** es el alcance de detección configurado en el sensor para que la puerta comience a abrirse unos metros **antes** de que choques contra el vidrio.

### 2. El Marco de una Fotografía (`root` y `threshold`) 🖼️
* **`root`** es el marco físico de madera.
* **`isIntersecting`** es `true` en el instante en que deslizas una foto detrás del marco y parte de ella asoma por el cristal. Si pones un `threshold: 1`, la foto solo cuenta como "colocada" cuando encaja completamente dentro del marco.

---

# Diagrama de flujo del ciclo de observación

```
   [ Elemento Objetivo en el DOM ]
                  │
                  ▼
   ( new IntersectionObserver(cb, opt) ) ──► Define reglas (root, rootMargin, threshold)
                  │
                  ▼
       ( observer.observe(el) )          ──► Inicia vigilancia asíncrona fuera del hilo principal
                  │
                  ▼
     ¿Cruza el umbral configurado?
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    [ SÍ ]                [ NO ] ──► Permanece en espera sin consumir CPU
        │
        ▼
   ( Ejecuta Callback )                  ──► Recibe array de 'entries'
        │
        ▼
   ¿entry.isIntersecting === true?
        │
        ├───────────────────┐
        ▼                   ▼
    [ TRUE ]            [ FALSE ] ──► El elemento salió de pantalla
        │
        ▼
  ( Aplica lógica / Carga recurso )
        │
        ▼
  ( observer.unobserve(entry.target) ) ──► (Opcional) Libera memoria si es acción única
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Deja de observar elementos de un solo uso:** Si utilizas el observador para cargar una imagen o disparar una animación inicial, llama a `observer.unobserve(entry.target)` inmediatamente después de ejecutar la acción para liberar recursos.
* **Usa `rootMargin` positivo para *Lazy Loading*:** Configurar `"150px"` o `"200px"` garantiza que los recursos multimedia ya estén descargados cuando el usuario llegue a ellos.
* **Reutiliza una misma instancia:** Si tienes 50 tarjetas en pantalla con las mismas reglas, usa un solo `IntersectionObserver` y aplica `.observe()` a cada tarjeta en un bucle, en lugar de crear 50 instancias distintas.

### ❌ Errores Comunes
* **Olvidar validar `entry.isIntersecting`:** Como el *callback* también se dispara cuando el elemento **sale** de la pantalla, omitir esta validación provocará que tu código se ejecute dos veces (al entrar y al salir).
* **Usar `threshold: 1` en elementos muy altos:** Si un elemento mide `1200px` de alto y la pantalla del celular mide `800px`, el elemento nunca podrá verse al 100% simultáneamente y el *callback* jamás se disparará.

---

# Ejemplo práctico: Lazy Loading de Imágenes

A continuación se presenta una implementación real donde las imágenes mantienen su ruta pesada oculta en un atributo `data-src` y solo se descargan cuando se acercan al área visible del usuario:

```html
<!-- Estructura HTML -->
<div class="galeria">
    <img class="lazy-img" data-src="foto-alta-calidad-1.jpg" alt="Paisaje 1">
    <img class="lazy-img" data-src="foto-alta-calidad-2.jpg" alt="Paisaje 2">
    <img class="lazy-img" data-src="foto-alta-calidad-3.jpg" alt="Paisaje 3">
</div>
```

```javascript
// Lógica de JavaScript Moderno
const imagenes = document.querySelectorAll(".lazy-img");

// 1. Configuramos las opciones: precargar 150px antes de entrar en pantalla
const opcionesObservador = {
    root: null,
    rootMargin: "0px 0px 150px 0px",
    threshold: 0.1
};

// 2. Definimos el callback de intersección
const cargarImagen = (entries, observer) => {
    entries.forEach(entry => {
        // Verificamos que el elemento esté entrando en la zona
        if (!entry.isIntersecting) return;

        const img = entry.target;
        
        // Transferimos la URL real desde data-src hacia src
        img.src = img.dataset.src;
        img.classList.add("cargada");

        // Detenemos la observación de esta imagen porque ya cumplió su objetivo
        observer.unobserve(img);
    });
};

// 3. Instanciamos y activamos el observador
const observadorImagenes = new IntersectionObserver(cargarImagen, opcionesObservador);

imagenes.forEach(imagen => observadorImagenes.observe(imagen));
```

---

# Resumen técnico

* **`IntersectionObserver`** reemplaza los costosos escuchadores de eventos `scroll` delegando la detección de visibilidad de forma asíncrona al motor del navegador.
* **El constructor** requiere una función `callback(entries, observer)` y acepta un objeto opcional `options` (`root`, `rootMargin`, `threshold`).
* **La propiedad `entry.isIntersecting`** devuelve un booleano (`true` o `false`) que confirma si el elemento observado está cruzando actualmente hacia el interior del área vigilada.
* **La gestión de memoria** se optimiza invocando `observer.unobserve(target)` una vez completadas tareas de un solo disparo como la carga diferida de recursos.
