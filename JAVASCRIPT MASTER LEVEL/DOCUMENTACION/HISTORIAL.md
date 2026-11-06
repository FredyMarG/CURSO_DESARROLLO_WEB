# GUÍA COMPLETA — History API en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar el objeto nativo `history` del navegador, comprender la manipulación de la pila de navegación con `back()`, `forward()` y `go()`, inspeccionar `history.length`, y gestionar el enrutamiento dinámico en aplicaciones SPA mediante `pushState()`, `replaceState()`, la propiedad `state` y el evento `popstate`.

---

# 📚 Temario

1. Introducción a la API de Historial (`window.history`)
2. Métodos de navegación básica: `back()` y `forward()`
3. Inspección de la pila: Tamaño del historial (`length`)
4. Navegación relativa con `go()`
5. Adición de entradas con `pushState()`
6. Reemplazo de entradas con `replaceState()`
7. Estado de sesión (`history.state`) y el evento `popstate`
8. Analogías del mundo real
9. Diagrama de flujo de la pila de navegación
10. Buenas prácticas y errores comunes
11. Proyecto Integrador: Enrutador SPA sin recarga
12. Resumen técnico

---

# Introducción a la API de Historial

El objeto global **`window.history`** (accesible simplemente como `history`) forma parte del BOM (*Browser Object Model*) y permite interactuar directamente con la pila de navegación de la pestaña o sesión actual del navegador.

Históricamente, su funcionalidad se limitaba a simular las acciones de los botones de avanzar y retroceder. Sin embargo, con la llegada de HTML5, la History API evolucionó para permitir que las aplicaciones modernas de una sola página (**SPA**, *Single Page Applications*) manipulen la URL visible y almacenen estados en memoria sin provocar una recarga completa de la página (`full page reload`).

```javascript
// Acceso directo al objeto history
console.log(window.history);
console.log(history.length);
```

---

# Métodos de navegación básica: `back()` y `forward()`

Estos dos métodos emulan de forma exacta el comportamiento de los botones físicos de navegación del navegador web:

* **`history.back()`**: Hace retroceder una posición en la pila del historial de la sesión actual. Equivale a hacer clic en la flecha "Atrás" del navegador o ejecutar `history.go(-1)`. Si no existen páginas anteriores en la sesión, la llamada se ignora de forma silenciosa sin arrojar error.
* **`history.forward()`**: Avanza una posición hacia adelante en la pila de navegación. Equivale al botón "Adelante" del navegador o a `history.go(1)`. Si la página actual es la más reciente de la pila, la invocación no produce ningún efecto.

```javascript
// Botón para retroceder
document.getElementById("btn-volver").addEventListener("click", () => {
    history.back();
});

// Botón para avanzar
document.getElementById("btn-avanzar").addEventListener("click", () => {
    history.forward();
});
```

---

# Tamaño del historial (`history.length`)

La propiedad de solo lectura **`history.length`** retorna un número entero que representa la cantidad total de entradas almacenadas en la pila de historial de la pestaña activa, incluyendo la página cargada actualmente.

* Si el usuario abre una pestaña nueva y entra por primera vez a un sitio, `history.length` suele ser `1` o `2` (dependiendo de la configuración inicial de la pestaña del navegador).
* Cada vez que se navega a un enlace externo o se ejecuta con éxito `history.pushState()`, el valor de `history.length` se incrementa en `1`.
* No es posible leer la lista de URLs que componen el historial por motivos estrictos de privacidad y seguridad del usuario.

```javascript
console.log(`Número de páginas en la sesión actual: ${history.length}`);

if (history.length > 1) {
    // Es seguro mostrar un botón de "Atrás"
    document.getElementById("btn-atras").style.display = "block";
}
```

---

# Navegación relativa con `go()`

El método **`history.go([delta])`** permite desplazarse a una posición específica de la pila de historial tomando como punto de referencia cero (`0`) la página actual.

* **Valores negativos (`delta < 0`)**: Retrocede tantas páginas como indique el número (ej. `history.go(-2)` retrocede dos entradas).
* **Valores positivos (`delta > 0`)**: Avanza tantas páginas hacia adelante como indique el número (ej. `history.go(2)` avanza dos entradas).
* **Valor cero (`0`) o sin argumentos**: Recarga la página actual de la misma manera que `location.reload()`.
* Si el número especificado excede los límites disponibles en la pila, el navegador omite la instrucción sin lanzar excepciones.

```javascript
history.go(-1); // Equivalente exacto a history.back()
history.go(1);  // Equivalente exacto a history.forward()
history.go(-3); // Retrocede 3 páginas de golpe
history.go(0);  // Recarga la página actual
```

---

# Modificación de URL con `pushState()`

El método **`history.pushState(state, unused, url)`** agrega una nueva entrada a la parte superior de la pila del historial, actualiza la dirección visual en la barra del navegador y **no provoca una recarga de la página**.

Acepta tres parámetros:
1. **`state`**: Objeto JavaScript serializable (hasta ~2MB según el navegador) que contiene los datos asociados con la nueva entrada del historial.
2. **`unused`**: Parámetro reservado históricamente para el título de la página; la gran mayoría de navegadores lo ignoran, por lo que se recomienda pasar una cadena vacía `""`.
3. **`url`**: La nueva dirección URL relativa o absoluta que se mostrará en la barra de direcciones. Debe pertenecer obligatoriamente al **mismo origen** (*Same-Origin Policy*: mismo protocolo, dominio y puerto).

```javascript
// Agrega una nueva ruta y almacena un estado personalizado
const datosEstado = { seccion: "perfil", usuarioId: 104 };
history.pushState(datosEstado, "", "/usuario/perfil");

console.log(location.pathname); // Muestra: "/usuario/perfil"
console.log(history.state);    // Muestra: { seccion: "perfil", usuarioId: 104 }
```

---

# Reemplazo de URL con `replaceState()`

El método **`history.replaceState(state, unused, url)`** comparte la misma firma y sintaxis que `pushState()`, pero se comporta de forma diferente en la estructura de la pila: en lugar de insertar una entrada nueva encima, **sobrescribe la entrada actual**.

* Modifica la URL visible y el objeto `state` de la página activa.
* **No altera el valor de `history.length`**, ya que el tamaño total de la pila no cambia.
* Resulta ideal para guardar filtros de búsqueda, pestañas activas o estados temporales donde no deseas que el usuario tenga que presionar "Atrás" diez veces consecutivas para salir de la página.

```javascript
// Sobrescribe la entrada actual sin inflar el historial
const filtroActual = { categoria: "tecnologia", pagina: 2 };
history.replaceState(filtroActual, "", "/articulos?cat=tecnologia&p=2");
```

---

# Propiedad `state` y el evento `popstate`

### 📥 La propiedad `history.state`
Permite inspeccionar directamente el objeto de estado asociado a la entrada del historial sobre la cual está situado el navegador en ese instante. Si no se ha asociado ningún estado mediante `pushState()` o `replaceState()`, su valor es `null`.

```javascript
const estadoActual = history.state;
if (estadoActual) {
    console.log("Datos recuperados:", estadoActual);
}
```

### 🔔 El evento `popstate`
El evento `popstate` se dispara en la ventana global (`window`) **únicamente cuando el usuario navega activamente por la pila del historial**, ya sea presionando los botones físicos Atrás / Adelante del navegador o ejecutando `history.back()`, `history.forward()` o `history.go()`.

> **Nota crítica:** Llamar directamente a `pushState()` o `replaceState()` **no dispara** el evento `popstate`.

El objeto del evento expone la propiedad `e.state`, que entrega una copia clonada del objeto `state` guardado previamente en esa entrada:

```javascript
window.addEventListener("popstate", (event) => {
    console.log("El usuario navegó en el historial.");
    console.log("Estado restaurado:", event.state);
    
    if (event.state) {
        cargarContenido(event.state.seccion);
    } else {
        cargarContenido("inicio");
    }
});
```

---

# Analogías del mundo real

### 1. La Pila de Platos en la Cocina (`pushState` vs `replaceState`) 🍽️
* **`pushState()`** es como lavar un plato nuevo y colocarlo encima de la pila: la torre se hace más alta (`history.length` sube en 1) y el plato de arriba es el nuevo visible.
* **`replaceState()`** es como cambiar el plato que está en la cima por otro diferente sin alterar la altura de la torre: la pila sigue teniendo la misma cantidad de platos.

### 2. El Álbum de Fotos con Notas al Dorso (`state` y `popstate`) 📸
* Cuando pasas de página en un álbum, miras una foto vieja y lees la nota escrita al dorso (`popstate` recibiendo `event.state`).
* Las notas te recuerdan qué estaba pasando en ese momento sin necesidad de volver a viajar físicamente hasta ese lugar.

---

# Diagrama de flujo de la pila de navegación

```
                     [ Pila de Historial Actual ]
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
[ Llamada a pushState(data, "", url) ]      [ Llamada a replaceState(data, "", url) ]
          │                                               │
          ▼                                               ▼
  Crea nueva entrada en la cima               Sobrescribe la entrada actual
  URL cambia sin recargar                     URL cambia sin recargar
  history.length incrementa (+1)             history.length se mantiene intacto
  (NO dispara popstate)                       (NO dispara popstate)
          │                                               │
          └───────────────────────┬───────────────────────┘
                                  ▼
                ¿Usuario presiona botón Atrás/Adelante
                      o invoca history.go()?
                                  │
                                  ▼
                        [ Dispara evento popstate ]
                                  │
                                  ▼
                     window.onpopstate(event)
                                  │
                                  ▼
           Acceso al estado mediante event.state o history.state
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Maneja siempre el caso `event.state === null`:** La primera carga inicial de una página o una visita directa no contiene un objeto `state`; tu aplicación debe estar preparada para cargar la vista por defecto basada en `location.pathname`.
* **Configura el servidor para SPA (*Fallback Routing*):** Al modificar URLs con `pushState()`, si el usuario recarga la página o comparte el enlace (ej. `/catalogo/zapatos`), el servidor debe servir el mismo `index.html` para no responder con un error `404 Not Found`.

### ❌ Errores Comunes
* **Intentar cambiar de dominio (*Cross-Origin Error*):** Pasar una URL con un dominio o protocolo diferente a `pushState()` o `replaceState()` provocará un error de seguridad irrecuperable de tipo `SecurityError: Blocked cross-origin navigation`.
* **Esperar que `pushState()` active `popstate`:** Un error clásico en desarrolladores junior es escuchar `popstate` creyendo que se ejecutará cada vez que llaman a `pushState()`. Se debe actualizar la UI de manera explícita tras invocar `pushState()`.

---

# Ejemplo práctico: Enrutador SPA sin recarga

A continuación se presenta un sistema completo de navegación SPA que permite cambiar de pestañas, modificar la URL, conservar el historial y restaurar las vistas al usar los botones de navegación del navegador:

```html
<!-- Estructura HTML -->
<nav class="barra-navegacion">
    <button data-ruta="/inicio" data-seccion="inicio">Inicio</button>
    <button data-ruta="/productos" data-seccion="productos">Productos</button>
    <button data-ruta="/contacto" data-seccion="contacto">Contacto</button>
</nav>

<main id="contenido-vista">
    <h1>Inicio</h1>
    <p>Bienvenido a nuestra aplicación SPA.</p>
</main>
```

```javascript
// Lógica de Enrutamiento SPA con History API
const contenido = document.getElementById("contenido-vista");
const botones = document.querySelectorAll("nav button");

// Vistas simuladas en memoria
const vistas = {
    inicio: { titulo: "Inicio", texto: "Bienvenido a nuestra aplicación SPA." },
    productos: { titulo: "Catálogo", texto: "Descubre nuestros productos exclusivos." },
    contacto: { titulo: "Contacto", texto: "Escríbenos a soporte@ejemplo.com." }
};

// Función para renderizar la interfaz
const renderizarVista = (nombreSeccion) => {
    const vista = vistas[nombreSeccion] || vistas.inicio;
    contenido.innerHTML = `<h1>${vista.titulo}</h1><p>${vista.texto}</p>`;
};

// Manejo de clics en los enlaces de navegación
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const ruta = boton.dataset.ruta;
        const seccion = boton.dataset.seccion;

        // 1. Añadimos la nueva entrada a la pila del historial con su estado
        history.pushState({ seccion }, "", ruta);

        // 2. Actualizamos la vista visualmente
        renderizarVista(seccion);
    });
});

// Manejo de la navegación del usuario (Atrás / Adelante)
window.addEventListener("popstate", (e) => {
    // Si existe estado recuperamos la sección; si no, volvemos al inicio
    const seccionActiva = e.state ? e.state.seccion : "inicio";
    renderizarVista(seccionActiva);
});

// Inicialización en la primera carga
window.addEventListener("DOMContentLoaded", () => {
    // Si ya existe un estado previo (ej. tras recargar), lo respetamos
    if (history.state && history.state.seccion) {
        renderizarVista(history.state.seccion);
    }
});
```

---

# Resumen técnico

* **`history.back()` y `history.forward()`** mueven el cursor de navegación una posición hacia atrás o hacia adelante respectivamente.
* **`history.length`** expone la cantidad de entradas registradas en la sesión actual de la pestaña.
* **`history.go(n)`** ejecuta saltos relativos hacia atrás (números negativos), hacia adelante (números positivos) o recarga la página (`0`).
* **`history.pushState()`** inserta una nueva URL y objeto de estado en la pila sin recargar la página.
* **`history.replaceState()`** reemplaza la URL y el estado de la entrada activa sin alterar el tamaño de la pila.
* **El evento `popstate`** reacciona a las navegaciones del usuario en la pila y entrega el objeto asociado a través de `event.state` y `history.state`.
