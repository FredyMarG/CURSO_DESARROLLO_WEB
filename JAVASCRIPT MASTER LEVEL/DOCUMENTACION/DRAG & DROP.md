# GUÍA COMPLETA — API de Drag & Drop en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de Arrastre y Soltar (*Drag & Drop*) en JavaScript, comprender la gestión del ciclo de vida de los eventos tanto en el objeto como en la zona de destino, y asimilar la persistencia y transferencia de datos mediante la propiedad `dataTransfer`.

---

# 📚 Temario

1. Introducción a la API nativa de Drag & Drop
2. Configuración inicial: El atributo `draggable`
3. Eventos del Objeto (El elemento que se arrastra)
4. Eventos de Zona (El contenedor que recibe el objeto)
5. Manipulación de datos con la propiedad `dataTransfer`
6. Extracción de información con `getData()`
7. Persistencia e inserción con `setData()`
8. Analogías del mundo real
9. Diagrama de flujo del ciclo de arrastre
10. Buenas prácticas y errores comunes
11. Proyecto Integrador: Ejemplo de uso (Texturizador)
12. Resumen técnico

---

# Introducción a la API nativa de Drag & Drop

La API de **Drag & Drop** (Arrastrar y Soltar) de HTML5 proporciona soporte nativo para interactuar con elementos de la interfaz de usuario mediante gestos del mouse o paneles táctiles. Anteriormente, lograr este comportamiento requería calcular manualmente coordenadas de posición (`clientX`, `clientY`) con eventos redundantes de ratón. 

Hoy en día, el lenguaje expone un ecosistema especializado de eventos arquitectónicos que permiten no solo mover elementos visualmente, sino también **transferir tipos de datos complejos** entre componentes de la aplicación o incluso desde el sistema operativo del usuario hacia el navegador.

---

# Configuración inicial: El atributo `draggable`

Para que un elemento del DOM pueda iniciar el ciclo de vida de arrastre, es un requisito estrictamente obligatorio declarar de forma explícita el atributo booleano `draggable` en su etiqueta HTML. Por defecto, solo las imágenes (`<img>`) y los enlaces (`<a>`) lo tienen activo de manera nativa.

```html
<!-- Configuración correcta en un elemento personalizado -->
<div id="objeto-textura" draggable="true">Arrástrame</div>
```

---

# Eventos del Objeto

Los **eventos del objeto** gestionan exclusivamente el comportamiento y el estado del elemento que el usuario ha seleccionado y está moviendo por la pantalla.

* **`dragstart`**: Se dispara en el milisegundo exacto en que el usuario hace clic y comienza a desplazar el elemento. Es el único momento adecuado para inicializar la carga de datos que se va a transportar.
* **`drag`**: Se ejecuta continuamente (de manera cíclica a alta frecuencia) mientras el objeto está siendo desplazado por el cursor. Es ideal para actualizar interfaces dinámicas o coordenadas temporales.
* **`dragend`**: Se gatilla al finalizar la operación de arrastre, ya sea porque el objeto se soltó con éxito en una zona válida o porque el usuario canceló la acción (por ejemplo, presionando la tecla `Esc`). Se utiliza para restaurar estilos visuales u opacidades.

```javascript
const objeto = document.getElementById("objeto-textura");

objeto.addEventListener("dragstart", (e) => {
    objeto.style.opacity = "0.5";
    console.log("Inicio del arrastre");
});

objeto.addEventListener("dragend", () => {
    objeto.style.opacity = "1"; // Restauramos el estado visual
    console.log("Fin del arrastre");
});
```

---

# Eventos de Zona

Los **eventos de zona** controlan los contenedores o elementos del DOM destinados a actuar como receptores (*drop zones*) de los objetos arrastrados.

* **`dragenter`**: Se dispara cuando el cursor del ratón (llevando el objeto arrastrable) entra por primera vez en los límites geométricos de la zona de destino. Sirve para iluminar o cambiar el diseño de la zona indicando que es un receptor válido.
* **`dragmove` (o `dragover`)**: Se ejecuta de forma repetitiva mientras el elemento permanezca flotando dentro de los márgenes de la zona receptora. **Nota crítica de la API nativa:** Por defecto, los navegadores prohíben soltar cosas en elementos genéricos. Para permitir el evento `drop`, es obligatorio anular el comportamiento base en este evento usando `e.preventDefault()`.
* **`dragleave`**: Se activa cuando el usuario saca el cursor de los límites de la zona receptora sin haber soltado el archivo u objeto. Se usa para limpiar los estilos de resaltado de la interfaz.
* **`drop`**: El evento culmen del ciclo de vida. Se dispara cuando el usuario suelta el botón del ratón exactamente encima de la zona receptora habilitada. Aquí es donde se procesa la lógica final del negocio.

```javascript
const zonaDestino = document.querySelector(".drop-zone");

zonaDestino.addEventListener("dragover", (e) => {
    e.preventDefault(); // ✅ OBLIGATORIO: Permite que ocurra el evento 'drop'
});

zonaDestino.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log("¡Objeto depositado con éxito!");
});
```

---

# Manipulación de datos con la propiedad `dataTransfer`

El verdadero motor de la API es el objeto **`dataTransfer`**, el cual se expone de manera nativa como una propiedad interna del evento de arrastre (`e.dataTransfer`). Este actúa como una caja de seguridad o contenedor temporal de memoria encargado de custodiar la información durante el viaje del objeto desde el origen hasta su destino final.

### 📥 Inserción con `setData(formato, valor)`
Este método almacena la información durante el evento `dragstart`. Requiere dos argumentos de tipo cadena de texto:
1. **Formato**: El tipo de datos (por ejemplo, `text/plain`, `text/html` o formatos personalizados).
2. **Valor**: La cadena de texto real o el ID del recurso que se desea transportar.

```javascript
// Dentro del evento dragstart del objeto
e.dataTransfer.setData("text/plain", objeto.id);
```

### 📤 Extracción con `getData(formato)`
Este método recupera la información custodiada exclusivamente cuando el flujo alcanza el evento `drop`. Requiere el formato exacto con el que fue registrado inicialmente.

```javascript
// Dentro del evento drop de la zona destino
const idRecuperado = e.dataTransfer.getData("text/plain");
const elementoArrastrado = document.getElementById(idRecuperado);
```

---

# Analogías del mundo real

### 1. El Camión de Mudanzas (`dataTransfer`) 🚚
* **`setData()`** representa el momento en que cargas las cajas con tus pertenencias en el camión en tu casa de origen (`dragstart`). No puedes meter más cosas al camión a mitad de camino.
* **`getData()`** representa la apertura de las compuertas del camión para descargar las cajas únicamente cuando este ya ha estacionado de manera segura en el garaje de tu nuevo hogar (`drop`).

### 2. El Tapete de Bienvenida de una Tienda (`dragenter` y `dragleave`) 🚪
* Cuando das el primer paso dentro de la tienda, suena una campana de aviso (`dragenter`). Si decides dar marcha atrás y salirte del local sin comprar nada, la campana deja de sonar y la tienda vuelve a su estado normal (`dragleave`).

---

# Diagrama de flujo del ciclo de arrastre

```
   [ Objeto con draggable="true" ]
                  │
                  ▼
         ( Evento dragstart )  ──► Se define la carga útil con e.dataTransfer.setData()
                  │
                  ▼
         ( Evento drag )       ──► Ciclo continuo de movimiento en pantalla
                  │
                  ▼
     ¿Entra en Zona de Destino?
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    [ SÍ ]                [ NO ] ──► ( Evento dragend ) ──► Cancela la operación
        │
        ▼
   ( Evento dragenter )        ──► Ilumina visualmente la zona receptora
        │
        ▼
   ( Evento dragmove / dragover ) ──► Ejecuta e.preventDefault() para desbloquear la zona
        │
        ▼
    ¿Se suelta el objeto?
        │
        ├───────────────────┐
        ▼                   ▼
    [ SÍ ]                [ NO ] ──► ( Evento dragleave ) ──► Restaura interfaz original
        │
        ▼
    ( Evento drop )            ──► Recupera datos con e.dataTransfer.getData() y aplica cambios
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Cancela siempre los eventos por defecto en `dragover` / `dragmove`:** Si olvidas invocar `e.preventDefault()`, el puntero del mouse mostrará un icono de bloqueo y el evento `drop` jamás se ejecutará.
* **Utiliza clases CSS para los cambios de estado visual:** Modifica los estilos añadiendo o removiendo clases (`zona.classList.add('highlight')`) en los eventos de zona en lugar de escribir estilos en línea directamente en JavaScript.

### ❌ Errores Comunes
* **Intentar leer `getData()` fuera del evento `drop`:** Por motivos estrictos de seguridad del navegador, los datos guardados en `dataTransfer` están protegidos y aislados de la lectura durante los eventos intermediarios como `dragover` o `dragenter`; si intentas leerlos ahí, devolverán una cadena vacía.

---

# Ejemplo práctico: Implementando un Texturizador

A continuación se presenta un desarrollo integrado donde se arrastran miniaturas de texturas hacia un lienzo central para cambiar de forma dinámica su patrón de fondo interactivo:

```html
<!-- Estructura HTML -->
<div class="contenedor-app">
    <div class="panel-texturas">
        <div id="textura-madera" class="textura" draggable="true" data-url="url('madera.jpg')">Madera</div>
        <div id="textura-metal" class="textura" draggable="true" data-url="url('metal.jpg')">Metal</div>
    </div>
    
    <div id="canvas-destino" class="drop-zone">
        <p>Arrastra una textura aquí para aplicarla al modelo</p>
    </div>
</div>
```

```javascript
// Lógica de JavaScript Moderno con Retornos Implícitos y Desestructuración en Parámetros
const texturas = document.querySelectorAll(".textura");
const lienzo = document.getElementById("canvas-destino");

// Configurar comportamiento de las texturas (Origen)
texturas.forEach(textura => {
    textura.addEventListener("dragstart", ({ dataTransfer, target }) => {
        // Guardamos el ID del elemento y la url de su atributo de datos personalizado
        dataTransfer.setData("text/plain", target.id);
        dataTransfer.setData("text/url-pattern", target.dataset.url);
        target.classList.add("arrastrando");
    });

    textura.addEventListener("dragend", ({ target }) => target.classList.remove("arrastrando"));
});

// Configurar comportamiento del Lienzo (Destino)
lienzo.addEventListener("dragenter", ({ target }) => target.classList.add("zona-activa"));
lienzo.addEventListener("dragleave", ({ target }) => target.classList.remove("zona-activa"));

// Habilitar de forma obligatoria la recepción anulando la restricción nativa
lienzo.addEventListener("dragover", (e) => e.preventDefault());

lienzo.addEventListener("drop", (e) => {
    e.preventDefault(); // Detiene aperturas colaterales de enlaces o imágenes en el navegador
    
    const { dataTransfer, target } = e;
    const rutaImagen = dataTransfer.getData("text/url-pattern");
    
    if (rutaImagen) {
        // Aplicamos la textura directamente al fondo de la zona receptora
        target.style.backgroundImage = rutaImagen;
        target.querySelector("p").innerText = "¡Textura Aplicada Correctamente!";
    }
    
    target.classList.remove("zona-activa");
});
```

---

# Resumen técnico

* **El ciclo de vida** del arrastre se divide conceptualmente en dos frentes: el control del objeto emisor (`dragstart`, `drag`, `dragend`) y el control de la zona receptora (`dragenter`, `dragmove`, `dragleave`, `drop`).
* **El atributo `draggable="true"`** es el interruptor de encendido mandatorio en HTML para otorgarle propiedades de arrastre a cualquier nodo de la estructura jerárquica del DOM.
* **El método `e.preventDefault()`** debe ser invocado de forma mandatoria en los eventos de movimiento intermedios de la zona objetivo para abrir los canales de comunicación y permitir la liberación del objeto.
* **El objeto `dataTransfer`** garantiza la integridad transaccional de los datos de la interfaz mediante sus métodos acoplados de escritura y lectura remota `setData()` y `getData()`.
