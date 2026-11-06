# GUÍA COMPLETA — FileReader API en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar el procesamiento asíncrono de archivos locales en el cliente mediante el objeto nativo `FileReader`, comprendiendo la lectura en texto plano (`readAsText`), la codificación en Base64 (`readAsDataURL`), el ciclo de vida de sus eventos de carga (`progress`, `loadend`) y su integración con interfaces dinámicas y la API de Drag & Drop.

# 📚 Temario

1. Introducción a la API de FileReader
2. Lectura de contenido textual con `readAsText()`
3. Codificación en Data URL con `readAsDataURL()`
4. Ejemplo de uso 1: Cargar galería dinámicamente
5. Ejemplo de uso 2: Combinar con Drag & Drop
6. Ejemplo de uso 3: Barra de progreso con eventos `progress` y `loadend`
7. Analogías del mundo real
8. Diagrama de flujo del ciclo de lectura
9. Buenas prácticas y errores comunes
10. Resumen técnico

# Introducción a la API de FileReader

La **FileReader API** de HTML5 permite a las aplicaciones web leer de forma asíncrona el contenido de archivos (o búferes de datos sin procesar) almacenados en el ordenador del usuario utilizando objetos de tipo `File` o `Blob`.

Históricamente, para procesar o previsualizar un archivo, era indispensable subirlo primero a un servidor y devolver la respuesta. Con `FileReader`, el procesamiento se realiza íntegramente en el navegador del cliente en memoria, lo que optimiza el rendimiento, reduce el consumo de ancho de banda y mejora la experiencia de usuario (*UX*).

Para instanciar el lector, se utiliza su constructor nativo:

```javascript
const reader = new FileReader();
```

# Lectura de contenido textual con `readAsText()`

El método **`readAsText(blob[, encoding])`** inicia la lectura asíncrona del archivo especificado. Cuando la operación se completa satisfactoriamente, el resultado (`reader.result`) expone el contenido del archivo interpretado como una cadena de texto (*string*).

* **Parámetros:**
  * `blob`: Un objeto `File` o `Blob` obtenido mediante un `<input type="file">` o un evento de arrastre.
  * `encoding` *(Opcional)*: La codificación de caracteres a emplear (por defecto `"UTF-8"`).
* **Casos de uso:** Archivos `.txt`, `.json`, `.csv`, `.md`, `.xml` o código fuente.

```javascript
const inputArchivo = document.getElementById("archivo-texto");

inputArchivo.addEventListener("change", (e) => {
    const [archivo] = e.target.files;
    if (!archivo) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        console.log("Contenido del archivo:");
        console.log(reader.result);
    });

    reader.readAsText(archivo, "UTF-8");
});
```

# Codificación en Data URL con `readAsDataURL()`

El método **`readAsDataURL(blob)`** lee los bytes en crudo del archivo y los transforma en una cadena URI con el esquema `data:` codificada en **Base64** (`data:[<mediatype>][;base64],<data>`).

* **Parámetros:**
  * `blob`: El archivo o blob a codificar.
* **Propósito:** Generar una representación de cadena autocontenida que puede asignarse de manera inmediata a atributos `src` de imágenes (`<img>`), videos (`<video>`), audios o reglas CSS de fondo.
* **Casos de uso:** Previsualización instantánea de imágenes antes de subirlas al servidor, exportación de miniaturas y renderizado de recursos gráficos locales.

```javascript
const inputImagen = document.getElementById("archivo-imagen");

inputImagen.addEventListener("change", (e) => {
    const [archivo] = e.target.files;
    if (!archivo) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        const preview = document.getElementById("vista-previa");
        preview.src = reader.result; // data:image/png;base64,iVBORw0KGgoAAA...
    });

    reader.readAsDataURL(archivo);
});
```

# Ejemplo de uso 1: Cargar galería dinámicamente

En este escenario se permite seleccionar múltiples imágenes a través de un control de formulario estándar (`<input multiple>`), procesándolas en paralelo y añadiendo dinámicamente cada miniatura a un contenedor grid en el DOM:

```html
<div class="galeria-app">
    <input type="file" id="input-galeria" accept="image/*" multiple>
    <div id="grid-galeria" class="grid-contenedor"></div>
</div>
```

```javascript
const inputGaleria = document.getElementById("input-galeria");
const gridGaleria = document.getElementById("grid-galeria");

inputGaleria.addEventListener("change", (e) => {
    const archivos = Array.from(e.target.files);
    gridGaleria.innerHTML = ""; // Limpiar visualizaciones previas

    archivos.forEach(archivo => {
        // Validar que sea un archivo de tipo imagen
        if (!archivo.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.addEventListener("load", ({ target }) => {
            const figure = document.createElement("figure");
            figure.className = "tarjeta-miniatura";

            const img = document.createElement("img");
            img.src = target.result;
            img.alt = archivo.name;

            const caption = document.createElement("figcaption");
            caption.textContent = `${archivo.name} (${(archivo.size / 1024).toFixed(1)} KB)`;

            figure.append(img, caption);
            gridGaleria.appendChild(figure);
        });

        reader.readAsDataURL(archivo);
    });
});
```

# Ejemplo de uso 2: Combinar con Drag & Drop

La verdadera potencia en interfaces interactivas surge al vincular la API de `FileReader` con los eventos nativos de arrastre (`Drag & Drop`). Los archivos arrastrados desde el explorador del sistema operativo se exponen en la propiedad `e.dataTransfer.files`:

```html
<div id="dropzone" class="zona-descarga">
    <p>Arrastra y suelta tus archivos aquí (.txt, .json o imágenes)</p>
</div>
<div id="visor-contenido"></div>
```

```javascript
const dropzone = document.getElementById("dropzone");
const visor = document.getElementById("visor-contenido");

// Prevenir el comportamiento por defecto del navegador (abrir el archivo en la pestaña)
["dragenter", "dragover", "dragleave", "drop"].forEach(nombreEvento => {
    dropzone.addEventListener(nombreEvento, (e) => e.preventDefault());
});

// Estilos de retroalimentación visual
dropzone.addEventListener("dragenter", () => dropzone.classList.add("activa"));
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("activa"));

dropzone.addEventListener("drop", (e) => {
    dropzone.classList.remove("activa");

    const [archivo] = e.dataTransfer.files;
    if (!archivo) return;

    const reader = new FileReader();

    if (archivo.type.startsWith("image/")) {
        reader.addEventListener("load", () => {
            visor.innerHTML = `<img src="${reader.result}" alt="Preview" style="max-width: 300px;">`;
        });
        reader.readAsDataURL(archivo);
    } else {
        reader.addEventListener("load", () => {
            visor.innerHTML = `<pre><code>${reader.result}</code></pre>`;
        });
        reader.readAsText(archivo, "UTF-8");
    }
});
```

# Ejemplo de uso 3: Barra de progreso con `progress` y `loadend`

Al procesar archivos de gran volumen, es fundamental proporcionar retroalimentación precisa del estado de carga. Para ello, `FileReader` emite eventos durante su ciclo de ejecución:

* **`progress`**: Se dispara periódicamente mientras los datos son leídos. Su objeto de evento expone:
  * `lengthComputable`: Booleano que indica si el tamaño total es conocido.
  * `loaded`: Cantidad de bytes leídos hasta el momento.
  * `total`: Tamaño total del archivo en bytes.
* **`loadend`**: Se gatilla al concluir de manera definitiva la operación, sin importar si finalizó con éxito (`load`), con error (`error`) o si fue cancelada (`abort`).

```html
<div class="carga-pesada">
    <input type="file" id="input-pesado">
    <progress id="barra-progreso" value="0" max="100" style="width: 100%; display: none;"></progress>
    <span id="porcentaje-texto"></span>
</div>
```

```javascript
const inputPesado = document.getElementById("input-pesado");
const barraProgreso = document.getElementById("barra-progreso");
const porcentajeTexto = document.getElementById("porcentaje-texto");

inputPesado.addEventListener("change", (e) => {
    const [archivo] = e.target.files;
    if (!archivo) return;

    const reader = new FileReader();

    // 1. Inicio de la lectura
    reader.addEventListener("loadstart", () => {
        barraProgreso.style.display = "block";
        barraProgreso.value = 0;
        porcentajeTexto.textContent = "Iniciando lectura...";
    });

    // 2. Monitoreo de bytes leídos
    reader.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const porcentaje = Math.round((e.loaded / e.total) * 100);
            barraProgreso.value = porcentaje;
            porcentajeTexto.textContent = `Leyendo: ${porcentaje}% (${(e.loaded / 1024).toFixed(0)} / ${(e.total / 1024).toFixed(0)} KB)`;
        }
    });

    // 3. Lectura exitosa
    reader.addEventListener("load", () => {
        porcentajeTexto.textContent = "¡Lectura completada con éxito!";
    });

    // 4. Ciclo finalizado (limpieza o acciones finales)
    reader.addEventListener("loadend", () => {
        console.log("El ciclo de vida de FileReader ha concluido.");
    });

    // 5. Manejo de fallos
    reader.addEventListener("error", () => {
        porcentajeTexto.textContent = `Error al leer: ${reader.error.message}`;
    });

    // Iniciamos la lectura (como DataURL o Texto según corresponda)
    reader.readAsDataURL(archivo);
});
```

# Analogías del mundo real

### 1. El Traductor en Cabina (`readAsText` vs `readAsDataURL`) 🎙️
* **`readAsText()`** es como un traductor que lee una carta escrita en inglés y te la dicta en español palabra por palabra; el resultado final es un texto entendible directamente por el ser humano.
* **`readAsDataURL()`** es como tomar una fotografía de un cuadro y codificar cada pixel en un telegrama en código Morse de una sola línea infinita; no está pensado para ser leído por una persona, sino para que otra máquina reconstruya la imagen original de inmediato.

### 2. El Indicador de Descarga del Camión de Granos (`progress` y `loadend`) 🚚
* El evento **`progress`** equivale a la báscula de pesaje que va marcando tonelada por tonelada mientras el grano cae del camión al silo, permitiendo calcular exactamente qué porcentaje ha entrado.
* El evento **`loadend`** es el pitido final de la compuerta que se cierra: no importa si el silo se llenó por completo o si hubo que detener el proceso por una falla, la tolva queda desocupada y el ciclo termina formalmente.

# Diagrama de flujo del ciclo de lectura

```
   [ Archivo seleccionado (input.files / e.dataTransfer.files) ]
                               │
                               ▼
                    [ new FileReader() ]
                               │
                               ▼
        Invoca método: readAsText() / readAsDataURL()
                               │
                               ▼
                     ( Evento loadstart ) ──► Inicializa UI / barra de progreso
                               │
                               ▼
            ┌────────► ( Evento progress )  ──► Actualiza barra: (loaded / total) * 100
            │                  │
    ¿Quedan bytes?             ▼
            └─────────── [ ¿Hay error? ]
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
                 [ SÍ ]                [ NO ]
                     │                   │
                     ▼                   ▼
             ( Evento error )    ( Evento load ) ──► reader.result disponible
                     │                   │
                     └─────────┬─────────┘
                               ▼
                      ( Evento loadend ) ──► Cierra el ciclo de lectura
```

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Registrar los escuchadores de eventos antes de llamar al método:** Suscribe siempre los callbacks de `load`, `progress` y `error` antes de ejecutar `readAsText()` o `readAsDataURL()` para evitar posibles condiciones de carrera (*race conditions*).
* **Validar tipo y peso antes de leer:** Consulta siempre `archivo.type` y `archivo.size` antes de leer el archivo en memoria; intentar cargar archivos de varios gigabytes con `readAsDataURL` saturará la memoria RAM del navegador.
* **Alternativa moderna `URL.createObjectURL()`:** Si solo necesitas previsualizar imágenes sin necesidad de manipular la cadena Base64, considera usar `URL.createObjectURL(archivo)`, ya que genera una URL corta en memoria de manera instantánea y con mucho menor impacto computacional.

### ❌ Errores Comunes
* **Intentar reutilizar una misma instancia de `FileReader` simultáneamente:** Un objeto `FileReader` solo puede ejecutar una operación de lectura a la vez. Si intentas llamar a `readAsText()` mientras otro archivo está leyéndose, el navegador arrojará una excepción de tipo `InvalidStateError`.
* **Confundir la lectura en cliente con la subida al servidor:** `FileReader` opera exclusivamente en el entorno local del cliente; los datos leídos no se envían a ningún servidor hasta que no los transmitas manualmente mediante `fetch()` o `XMLHttpRequest`.

# Resumen técnico

* **`FileReader`** es una clase asíncrona para inspeccionar y leer datos de objetos `File` y `Blob` en el cliente sin requerir llamadas al servidor.
* **`readAsText()`** transforma los bytes en una cadena de texto editable (`UTF-8` por defecto), ideal para archivos de configuración, documentos y formatos tabulares.
* **`readAsDataURL()`** codifica el contenido binario en una URI Base64 (`data:...`), ideal para el renderizado inmediato de imágenes en elementos `<img>`.
* **La integración con Drag & Drop** se realiza extrayendo los archivos arrastrados desde la propiedad `e.dataTransfer.files`.
* **El ciclo de vida de eventos** se monitorea mediante `loadstart`, `progress` (para métricas de avance de bytes), `load` (éxito), `error` (fallos) y `loadend` (conclusión absoluta de la tarea).
