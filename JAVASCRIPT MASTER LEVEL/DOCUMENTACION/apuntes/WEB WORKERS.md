# GUÍA COMPLETA — API de Web Workers en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)  
> **Objetivo:** Dominar la API nativa de **Web Workers** en JavaScript para ejecutar tareas pesadas en hilos secundarios en segundo plano sin bloquear el hilo principal (*Main Thread*), comprender los tipos de workers, la comunicación bidireccional mediante mensajes (`postMessage` y `onmessage`), el ciclo de vida y las restricciones de seguridad (*Same-Origin*).

---

# 📚 Temario

1. ¿Qué son los Web Workers y por qué son necesarios?
2. Tipos de Web Workers (`Dedicated Worker`, `Service Worker` y `Abstract Worker`)
3. Dedicated Worker: El constructor `Worker()`
4. El parámetro `options` (`type`, `credentials`, `name`)
5. Comunicación bidireccional: `postMessage()` y `onmessage`
6. Finalización del ciclo de vida: `terminate()` y `close()`
7. Política de Origen Cruzado (*Same-Origin Policy*) y limitaciones del DOM
8. Analogías del mundo real
9. Diagrama de flujo del ciclo de comunicación
10. Buenas prácticas y errores comunes
11. Proyecto Integrador: Procesamiento Matemático Pesado sin Congelar la UI
12. Resumen técnico

---

# ¿Qué son los Web Workers?

Por naturaleza, JavaScript en el navegador es un lenguaje de **un solo hilo (*Single-Threaded*)**. Esto significa que tanto la lógica de negocio como el renderizado de la interfaz de usuario (UI), las animaciones y los eventos de clic comparten exactamente el mismo hilo principal (*Main Thread*).

Cuando ejecutas una operación muy costosa (como procesar un archivo CSV gigante, aplicar filtros a una imagen o realizar cálculos complejos), ese hilo único se bloquea y la página web se congela por completo.

La **API de Web Workers** resuelve este problema permitiendo crear **hilos secundarios reales a nivel de sistema operativo** que ejecutan scripts de JavaScript en segundo plano de forma paralela, manteniendo la interfaz fluida y receptiva en todo momento.

---

# Tipos de Web Workers

Dentro del ecosistema web existen distintas variantes según su alcance y propósito:

### 1. Dedicated Worker (Worker Dedicado)
* Es el tipo más común. Pertenece exclusivamente al script o pestaña que lo creó.
* Solo puede comunicarse con el contexto padre que lo instanció. Si el usuario cierra la pestaña, el Dedicated Worker muere automáticamente.

### 2. Service Worker
* Actúa como un proxy programable entre la aplicación web, el navegador y la red.
* Intercepta peticiones HTTP (`fetch`), gestiona cachés para funcionamiento *offline* (PWAs) y recibe notificaciones *push* en segundo plano incluso cuando la pestaña está cerrada.

### 3. Abstract Worker (Interfaz Base)
* No es un worker que se instancie directamente, sino la interfaz abstracta base de la cual heredan propiedades y eventos comunes (como `onerror`) tanto `Worker` (Dedicated) como `SharedWorker` (workers compartidos entre múltiples pestañas del mismo origen).

---

# Dedicated Worker: El constructor `Worker()`

Para crear un trabajador dedicado, se utiliza el constructor global **`new Worker(url, options)`**, pasando como primer argumento obligatorio la ruta del archivo JavaScript que se ejecutará en el hilo secundario.

```javascript
// En el archivo principal (main.js)
const miWorker = new Worker("worker.js");
```

> **Importante:** El código del worker debe residir en un archivo separado (o crearse dinámicamente mediante un `Blob`), ya que el hilo secundario no comparte el mismo espacio de memoria que el hilo principal.

---

# El parámetro `options`

El segundo argumento del constructor `new Worker(url, options)` es un objeto opcional que permite configurar cómo el navegador debe cargar e identificar el script del worker:

```javascript
const miWorker = new Worker("worker.js", {
    type: "module",
    credentials: "same-origin",
    name: "procesador-datos"
});
```

* **`type`:** Define el tipo de script a ejecutar. Puede ser `"classic"` (por defecto, script tradicional) o `"module"` (permite utilizar `import` y `export` nativos de ES Modules dentro del worker).
* **`credentials`:** Indica si el navegador debe enviar credenciales (cookies o cabeceras de autorización) al descargar el archivo del worker cuando `type` es `"module"`. Sus valores posibles son `"omit"`, `"same-origin"` o `"include"`.
* **`name`:** Asigna un nombre identificativo legible al `DedicatedWorkerGlobalScope` (accesible dentro del worker mediante `self.name`), muy útil para depurar en las DevTools cuando tienes varios workers activos.

---

# Comunicación bidireccional: `postMessage()` y `onmessage`

Dado que el hilo principal y el Web Worker viven en entornos aislados y **no comparten variables globales**, la única forma de intercambiar información es enviando copias de datos a través de un sistema de mensajería.

### 📤 Enviar datos: `postMessage(datos)`
Este método serializa el dato (usando el *Structured Clone Algorithm*) y lo envía al otro extremo. Funciona tanto desde `main.js` hacia `worker.js` como en sentido inverso.

```javascript
// Desde main.js hacia el worker
miWorker.postMessage({ accion: "calcular", limite: 10000000 });
```

### 📥 Recibir datos: Evento `onmessage` (o `addEventListener("message")`)
Se dispara cada vez que llega un mensaje desde el otro hilo. La información enviada se encuentra dentro de la propiedad **`e.data`**.

```javascript
// Dentro de worker.js
self.onmessage = (e) => {
    const { accion, limite } = e.data;
    
    if (accion === "calcular") {
        const resultado = limite * 2;
        // Enviamos la respuesta de vuelta al hilo principal
        self.postMessage(resultado);
    }
};
```

```javascript
// De vuelta en main.js
miWorker.onmessage = (e) => {
    console.log("Respuesta recibida del worker:", e.data);
};
```

---

# Finalización del ciclo de vida: `terminate()`

Los Web Workers consumen memoria y recursos de CPU del sistema operativo mientras están activos. Cuando ya no los necesitas, debes detenerlos explícitamente:

### 1. Desde el hilo principal: `worker.terminate()`
Detiene de inmediato la ejecución del worker sin esperar a que termine lo que estaba haciendo. Una vez terminado, no puede reutilizarse.

```javascript
// Detener el worker desde main.js
miWorker.terminate();
console.log("Worker finalizado por el hilo principal.");
```

### 2. Desde el interior del propio worker: `self.close()`
El propio script del worker puede finalizar su propia ejecución tras completar su tarea.

```javascript
// Dentro de worker.js
self.postMessage("Tarea completada");
self.close(); // Se cierra a sí mismo
```

---

# Política de Origen Cruzado (*Same-Origin Policy*)

Por razones estrictas de seguridad, los Web Workers están sujetos a la **Política del Mismo Origen (*Same-Origin Policy*)**:

1. **Mismo protocolo, dominio y puerto:** El archivo JavaScript del worker (`worker.js`) **debe cargarse desde exactamente el mismo origen** (`https://midominio.com`) que la página principal que lo invoca. Intentar instanciar un worker directamente desde una URL externa (CDN o dominio distinto) lanzará un error de seguridad (`SecurityError`).
2. **Protocolo `file://` bloqueado:** Si abres un archivo `index.html` haciendo doble clic directamente desde tu carpeta local (`file:///C:/...`), los navegadores bloquearán la creación del worker. Siempre debes servir tu proyecto mediante un servidor local (`http://localhost` o Live Server).
3. **Sin acceso al DOM ni a `window`:** Dentro de un Web Worker **no existen** `document`, `window` ni `parent`. El worker no puede manipular etiquetas HTML directamente; solo puede procesar datos y enviar los resultados al hilo principal para que este actualice la interfaz.

---

# Analogías del mundo real

### 1. El Chef Principal y el Ayudante de Cocina (`Main Thread` y `Worker`) 👨‍🍳
* El **hilo principal** es el chef que atiende directamente a los clientes en la barra y emplata los pedidos (la interfaz de usuario).
* Si llega un pedido que requiere picar 50 kilos de cebolla, el chef no se pone a hacerlo él mismo porque dejaría de atender a los clientes y el restaurante se paralizaría. En su lugar, le pasa las cebollas por la ventanilla (`postMessage`) a un **ayudante en la cocina trasera (`Dedicated Worker`)**.
* El ayudante pica todo sin interrumpir el servicio y, cuando termina, devuelve el recipiente listo por la ventanilla (`onmessage`).

### 2. La Oficina de Correo Neumático (`postMessage` / `onmessage`) 📬
* El hilo principal y el worker están en habitaciones separadas sin contacto visual. Para comunicarse, meten documentos en cápsulas y las envían por un tubo neumático (`postMessage`). Al otro lado, suena una campana cuando cae la cápsula (`onmessage`) y extraen el contenido (`e.data`).

---

# Diagrama de flujo del ciclo de comunicación

```
   [ Hilo Principal (main.js) ]                  [ Hilo Secundario (worker.js) ]
                │                                               │
   new Worker("worker.js", options) ───────────────────────────►│ (Se crea e inicia el hilo)
                │                                               │
   worker.postMessage(datos) ──────────────────────────────────►│ (Envía carga de trabajo)
                │                                               │
   ( La UI sigue fluida y                                  self.onmessage(e)
     respondiendo a clics )                                     │
                │                                       [ Procesa datos pesados ]
                │                                               │
   worker.onmessage(e) ◄────────────────────────────────── self.postMessage(resultado)
                │                                               │
   [ Actualiza el DOM con e.data ]                              │
                │                                               │
   worker.terminate() ─────────────────────────────────────────►✕ (Hilo destruido y memoria liberada)
```

---

# Buenas prácticas y errores comunes

### ✅ Buenas Prácticas
* **Usa el algoritmo de clonación estructurada con cuidado:** `postMessage()` copia los datos enviados. Si transfieres objetos gigantescos de cientos de megabytes, considera usar **Transferable Objects** (como `ArrayBuffer`) para ceder la propiedad de la memoria en cero milisegundos sin duplicarla.
* **Maneja siempre los errores con `onerror`:** Registra `miWorker.onerror = (err) => console.error(err.message)` en el hilo principal para capturar fallos de sintaxis o excepciones ocurridas dentro del hilo secundario.
* **Termina workers temporales:** Si creas un worker para una única exportación o cálculo puntual, llama a `worker.terminate()` al recibir la respuesta para liberar RAM.

### ❌ Errores Comunes
* **Intentar usar `document.getElementById()` dentro del worker:** Provocará un `ReferenceError: document is not defined`. Toda modificación visual debe ocurrir en el hilo principal tras recibir `onmessage`.
* **Abrir el proyecto sin servidor local (`file://`):** Causará un bloqueo por política CORS / Same-Origin. Usa siempre `localhost` (por ejemplo, Vite, Live Server o `npx serve`).
* **Crear demasiados workers simultáneos:** Cada worker es un hilo real del sistema operativo con su propio motor JS y consumo de memoria; crear decenas de ellos degradará el rendimiento del dispositivo.

---

# Proyecto Integrador: Cálculo Pesado sin Congelar la UI

A continuación se presenta una implementación completa donde un botón realiza un cálculo masivo en un **Web Worker** mientras otro botón demuestra que la interfaz sigue respondiendo instantáneamente:

### 1. Archivo Principal (`index.html` y `main.js`)

```html
<!-- index.html -->
<div class="panel-worker">
    <button id="btn-calcular">Iniciar Cálculo Pesado (Worker)</button>
    <button id="btn-cancelar" disabled>Cancelar Worker (terminate)</button>
    <button id="btn-test-ui">Probar fluidez de UI (Clic aquí)</button>
    
    <p id="contador-clics">Clics en UI: 0</p>
    <p id="resultado-worker">Estado: En espera</p>
</div>
```

```javascript
// main.js
const btnCalcular = document.getElementById("btn-calcular");
const btnCancelar = document.getElementById("btn-cancelar");
const btnTestUI = document.getElementById("btn-test-ui");
const textoClics = document.getElementById("contador-clics");
const textoResultado = document.getElementById("resultado-worker");

let clics = 0;
let workerActual = null;

// Botón para demostrar que el hilo principal NUNCA se congela
btnTestUI.addEventListener("click", () => {
    clics++;
    textoClics.innerText = `Clics en UI: ${clics}`;
});

// Iniciar tarea en segundo plano
btnCalcular.addEventListener("click", () => {
    textoResultado.innerText = "Calculando en segundo plano...";
    btnCalcular.disabled = true;
    btnCancelar.disabled = false;

    // Instanciamos el Dedicated Worker con opciones
    workerActual = new Worker("worker.js", {
        type: "classic",
        name: "worker-calculo-intensivo"
    });

    // Enviamos los parámetros al worker
    workerActual.postMessage({ iteraciones: 2_000_000_000 });

    // Escuchamos la respuesta del worker
    workerActual.onmessage = (e) => {
        textoResultado.innerText = `✅ Resultado final: ${e.data}`;
        limpiarWorker();
    };

    // Capturamos posibles errores del hilo secundario
    workerActual.onerror = (error) => {
        textoResultado.innerText = `❌ Error en el worker: ${error.message}`;
        limpiarWorker();
    };
});

// Finalizar manualmente el worker con terminate()
btnCancelar.addEventListener("click", () => {
    if (workerActual) {
        workerActual.terminate();
        textoResultado.innerText = "🛑 Cálculo abortado mediante terminate()";
        limpiarWorker();
    }
});

const limpiarWorker = () => {
    if (workerActual) {
        workerActual.terminate();
        workerActual = null;
    }
    btnCalcular.disabled = false;
    btnCancelar.disabled = true;
};
```

### 2. Archivo del Hilo Secundario (`worker.js`)

```javascript
// worker.js
self.onmessage = (e) => {
    const { iteraciones } = e.data;
    let suma = 0;

    // Bucle intensivo que congelaría la pantalla si corriera en main.js
    for (let i = 0; i < iteraciones; i++) {
        suma += i;
    }

    // Enviamos el resultado de vuelta al hilo principal
    self.postMessage(suma);
};
```

---

# Resumen técnico

* **Los Web Workers** permiten ejecutar código JavaScript en hilos secundarios paralelos para evitar bloquear el hilo principal (*Main Thread*) y mantener fluida la interfaz.
* **Los tipos principales** son `Dedicated Worker` (exclusivo de una pestaña), `Service Worker` (proxy de red y caché *offline*) y `Abstract Worker` (interfaz base compartida).
* **El constructor `new Worker(url, options)`** acepta configuraciones clave mediante `options`: `type` (`"classic"` o `"module"`), `credentials` y `name`.
* **La comunicación** se realiza exclusivamente mediante paso de mensajes usando **`postMessage()`** para enviar datos y el evento **`onmessage`** (`e.data`) para recibirlos.
* **El método `terminate()`** finaliza inmediatamente la ejecución del worker desde el hilo principal, liberando sus recursos del sistema.
* **Por seguridad (*Same-Origin*)**, el script del worker debe pertenecer al mismo origen que la página principal y no tiene acceso directo al DOM ni al objeto `window`.


---

# Conceptos Complementarios: Transferable Objects, `messageerror` y Blob Workers

### 1. Transferable Objects (`ArrayBuffer`)
Por defecto `postMessage(datos)` clona los datos. Si necesitas mover decenas de megabytes (audio, imágenes, buffers binarios) sin duplicar memoria RAM, transfiere la propiedad del buffer en **~0 ms**:
```javascript
const buffer = new ArrayBuffer(1024 * 1024 * 32); // 32 MB
worker.postMessage(buffer, [buffer]);
// Aquí buffer.byteLength ahora es 0 porque pertenece al Worker
```

### 2. Workers Dinámicos en Línea (`Blob` + `URL.createObjectURL`)
Permite crear un worker sin un archivo `.js` externo separado:
```javascript
const codigo = `self.onmessage = (e) => self.postMessage(e.data * 2);`;
const blob = new Blob([codigo], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
const worker = new Worker(url);
URL.revokeObjectURL(url); // Libera la URL temporal de memoria
```

### 3. Captura de errores de serialización (`messageerror`)
Además de `worker.onerror` (errores de ejecución), `worker.addEventListener("messageerror", ...)` captura fallos cuando un objeto no puede clonarse (por ejemplo, funciones o nodos del DOM).

### 4. `SharedWorker` vs `DedicatedWorker`
* **`DedicatedWorker` (`new Worker(...)`):** Exclusivo de la pestaña o script que lo creó. Al cerrar la pestaña, el worker se destruye.
* **`SharedWorker` (`new SharedWorker(...)`):** Puede ser compartido simultáneamente por **múltiples pestañas, ventanas o iframes del mismo origen**. La comunicación se realiza a través de un puerto (`worker.port.postMessage()` y `worker.port.onmessage` tras llamar a `worker.port.start()`), y dentro del worker se escucha el evento `onconnect`.

```javascript
// En cualquier pestaña (main.js)
const shared = new SharedWorker("shared-worker.js");
shared.port.start();
shared.port.postMessage("Hola desde una pestaña");
shared.port.onmessage = (e) => console.log("SharedWorker dice:", e.data);
```

---

# Ejercicios

## Nivel 1
Crea un Web Worker que reciba un número mediante `postMessage()` y devuelva su cuadrado (`n * n`) al hilo principal.

## Nivel 2
Configura un worker con `{ name: "validador-datos" }` que escuche errores mediante `worker.onerror` y se cierre a sí mismo desde su interior usando `self.close()` tras responder.

## Nivel 3
Implementa una función `ejecutarEnWorker(fnTexto, datos)` que genere un `Blob Worker` temporal, envíe `datos`, resuelva una **Promesa** con la respuesta del worker y llame automáticamente a `worker.terminate()` y `URL.revokeObjectURL()`.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
// En worker.js:
self.onmessage = (e) => self.postMessage(e.data * e.data);

// En main.js:
const w = new Worker("worker.js");
w.onmessage = (e) => console.log("Cuadrado:", e.data);
w.postMessage(12);
```

## Solución Nivel 2
```javascript
// En worker.js:
self.onmessage = (e) => {
    self.postMessage(`Procesado por ${self.name}: ${e.data}`);
    self.close();
};

// En main.js:
const w = new Worker("worker.js", { name: "validador-datos" });
w.onerror = (err) => console.error("Error en worker:", err.message);
w.postMessage("OK");
```

## Solución Nivel 3
```javascript
const ejecutarEnWorker = (codigoWorker, datos) => new Promise((resolve, reject) => {
    const blob = new Blob([codigoWorker], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
        URL.revokeObjectURL(url);
    };
    worker.onerror = (err) => {
        reject(err);
        worker.terminate();
        URL.revokeObjectURL(url);
    };
    worker.postMessage(datos);
});
```

---

# Hoja de Trucos (Cheatsheet)

| Elemento | Dónde se usa | Función |
| :--- | :--- | :--- |
| `new Worker(url, options)` | Main Thread | Crea hilo secundario (`type`, `credentials`, `name`) |
| `postMessage(data, [transfer])` | Ambos | Envía copia o transfiere `ArrayBuffer` |
| `onmessage` / `addEventListener` | Ambos | Recibe datos en `e.data` |
| `worker.terminate()` / `self.close()` | Main / Worker | Destruye el hilo y libera memoria |
| `worker.onerror` | Main Thread | Captura excepciones del hilo secundario |
