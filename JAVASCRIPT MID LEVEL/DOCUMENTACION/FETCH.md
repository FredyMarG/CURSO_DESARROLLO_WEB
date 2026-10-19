# GUÍA — API Fetch y Axios

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender la evolución moderna del consumo de APIS en JavaScript, dominando el uso de la API Fetch nativa y sus lectores de cuerpo, así como la integración, ventajas y comparativas con la popular biblioteca Axios.

---

# 📚 Temario

1. Introducción a la era moderna de las peticiones
2. La API Fetch: Arquitectura basada en Promesas
3. El objeto global `fetch()` y su flujo básico
4. Lectores del Cuerpo de la Respuesta (The Body Mixin)
   - `text()`
   - `json()`
   - `blob()`
   - `formData()`
   - `arrayBuffer()`
5. Introducción a Axios: ¿Por qué usar una biblioteca externa?
6. Comparativa técnica: Fetch vs. Axios
7. Analogía del mundo real
8. Diagrama de flujo de datos
9. Buenas prácticas
10. Errores comunes
11. Ejercicios prácticos
12. Resumen

---

# Introducción a la era moderna de las peticiones

Después de años sufriendo con la compleja sintaxis de eventos y estados de `XMLHttpRequest` (XHR), el comité de estándares de JavaScript decidió modernizar el navegador. 

En lugar de depender de callbacks anidados que causaban el temido *Callback Hell*, se diseñaron soluciones nativas que se acoplaran perfectamente con el flujo asíncrono asíncrono y los nuevos paradigmas de desarrollo. De ahí nació la **API Fetch**.

---

# La API Fetch: Arquitectura basada en Promesas

La principal diferencia de la API Fetch respecto a su antecesor es que está **completamente basada en Promesas nativas**.

Esto significa que cuando lanzas una petición, Fetch no se queda esperando bloqueando el hilo de ejecución, sino que te promete devolverte un objeto de respuesta en el futuro, permitiéndote encadenar métodos `.then()` y `.catch()`, o pausar ordenadamente la ejecución usando la sintaxis moderna de `async/await`.

---

# El objeto global `fetch()` y su flujo básico

Para realizar una petición simple con Fetch, solo debes llamar al método global `fetch()` pasándole como argumento obligatorio la URL del recurso:

```javascript
fetch("https://api.ejemplo.com/usuarios")
    .then(response => {
        console.log(response); // Esto NO contiene los datos aún, es un objeto Response
    })
    .catch(error => {
        console.error("Fallo crítico de red:", error);
    });
```

### El proceso en dos pasos
Un error clásico de nivel Junior es pensar que el objeto `response` devuelto en el primer `.then()` ya contiene la información lista. Fetch procesa la comunicación en dos oleadas:
1. **Paso 1:** El servidor responde las cabeceras HTTP y el estado (sabemos si la petición llegó a su destino). El cuerpo de los datos aún se está descargando en segundo plano.
2. **Paso 2:** Debes llamar a un método específico para leer y convertir el flujo de bytes del cuerpo de la respuesta al formato que necesitas. Este proceso también devuelve otra promesa.

---

# Lectores del Cuerpo de la Respuesta (The Body Mixin)

La API Fetch provee 5 métodos principales integrados en el objeto de respuesta para extraer y formatear el cuerpo del mensaje:

### 1. `text()`
Lee el cuerpo de la respuesta por completo y lo devuelve interpretado como una cadena de texto plano (`string`). Es ideal si estás leyendo archivos `.txt`, código HTML suelto o formatos csv.

```javascript
fetch("/terminos.txt")
    .then(res => res.text())
    .then(texto => console.log(texto));
```

### 2. `json()`
Analiza el flujo de texto de la respuesta y ejecuta internamente un proceso idéntico a `JSON.parse()` para devolverte un objeto o arreglo de JavaScript directo. Es el más utilizado en el desarrollo de aplicaciones web y REST APIs.

```javascript
fetch("https://api.ejemplo.com/productos")
    .then(res => res.json())
    .then(productos => console.log(productos)); // Arreglo JS nativo
```

### 3. `blob()`
Convierte los bytes binarios crudos del cuerpo en un objeto **Blob** (Binary Large Object). Es indispensable si estás descargando elementos multimedia pesados que no son texto, como imágenes (`.jpg`, `.png`), archivos de audio, o documentos `.pdf`.

```javascript
fetch("/foto-perfil.png")
    .then(res => res.blob())
    .then(imagenBlob => {
        // Creamos una URL temporal para incrustar el binario en una etiqueta <img>
        const urlImagen = URL.createObjectURL(imagenBlob);
        document.getElementById("avatar").src = urlImagen;
    });
```

### 4. `formData()`
Lee la respuesta y la transforma directamente en un mapa de claves/valores de tipo `FormData`. Se utiliza principalmente cuando un servicio backend te devuelve un formulario serializado directamente o cuando haces pruebas avanzadas de respuestas multiparte.

```javascript
fetch("/procesar-formulario")
    .then(res => res.formData())
    .then(form => {
        console.log(form.get("usuario_id"));
    });
```

### 5. `arrayBuffer()`
Es el lector de más bajo nivel. Devuelve un contenedor de memoria fija binaria cruda (`ArrayBuffer`). No se usa para datos cotidianos; se reserva para la manipulación avanzada de bytes en el cliente, como editar video/audio en tiempo real en el navegador, o leer estructuras binarias complejas para WebAssembly.

```javascript
fetch("/archivo.bin")
    .then(res => res.arrayBuffer())
    .then(buffer => {
        console.log("Bytes descargados:", buffer.byteLength);
    });
```

---

# Introducción a Axios: ¿Por qué usar una biblioteca externa?

Aunque Fetch es espectacular y nativo, tiene ciertas limitaciones en proyectos grandes del mundo real. Para resolver estas fricciones y acelerar el desarrollo profesional nació **Axios**, una biblioteca basada en promesas sumamente popular.

### 🌟 Ventajas clave de Axios sobre Fetch:
1. **Transformación automática de JSON:** Ya no necesitas hacer el segundo paso `.json()`. Axios asume que si el servidor devuelve JSON, debe entregarte el objeto listo en la propiedad `.data`.
2. **Soporte para navegadores antiguos:** Axios utiliza por debajo `XMLHttpRequest` en navegadores viejos de forma automática si es necesario, garantizando compatibilidad universal sin añadir polyfills manuales.
3. **Manejo de errores simplificado:** Fetch no considera los códigos de error HTTP (como `404` o `500`) como fallos de promesa (no van al `catch`). **Axios sí arroja un error automáticamente** si el estatus está fuera del rango exitoso de los `2xx`.
4. **Interceptores incorporados:** Te permite programar funciones globales que capturen e inyecten tokens de seguridad (JWT) a todas tus peticiones salientes con una sola línea de configuración.

### Instalación rápida de Axios:
```html
<!-- Mediante CDN para tus proyectos HTML tradicionales -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```
O en entornos de Node.js/React:
```bash
npm install axios
```

---

# Comparativa técnica: Fetch vs. Axios

Miremos el mismo ejercicio escrito de ambas formas usando la sintaxis profesional `async/await` para notar el ahorro de código:

### Petición GET para leer datos

**Con Fetch nativo:**
```javascript
async function cargarUsuariosFetch() {
    try {
        const respuesta = await fetch("https://api.ejemplo.com/users");
        if (!respuesta.ok) throw new Error("Código de error HTTP: " + respuesta.status);
        
        const usuarios = await respuesta.json(); // Segundo await obligatorio
        console.log(usuarios);
    } catch (error) {
        console.error("Ocurrió un fallo:", error);
    }
}
```

**Con Axios:**
```javascript
async function cargarUsuariosAxios() {
    try {
        const respuesta = await axios.get("https://api.ejemplo.com/users");
        // Los datos ya están listos y parseados en la propiedad '.data'
        console.log(respuesta.data); 
    } catch (error) {
        // Los errores 4xx y 5xx caen directamente aquí de forma automática
        console.error("Error capturado por Axios:", error.response.status);
    }
}
```

### Petición POST para crear un registro

**Con Fetch nativo:**
```javascript
async function crearPostFetch() {
    const respuesta = await fetch("https://api.ejemplo.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: "Nuevo Post", autor: "Junior" })
    });
    const datos = await respuesta.get();
}
```

**Con Axios:**
```javascript
async function crearPostAxios() {
    // Axios serializa automáticamente el objeto de JS a JSON y configura los Headers por ti
    const respuesta = await axios.post("https://api.ejemplo.com/posts", {
        titulo: "Nuevo Post",
        autor: "Junior"
    });
    console.log(respuesta.data);
}
```

---

# Analogía del restaurante gourmet 🍽️

Comparemos el flujo de ambos con ir a cenar:

```
Usar FETCH es como ir a un restaurante donde pides un platillo (Paso 1). 
El mesero te trae el plato tapado a la mesa rápido. Tú sabes que llegó el pedido bien. 
Sin embargo, para poder comértelo, tienes que destaparlo y prepararlo tú mismo (Paso 2: usar .json()).

Usar AXIOS es como ir a un restaurante de súper lujo. Pides la comida, 
y el mesero te la trae perfectamente destapada, cortada y lista para consumir en tu mesa (.data). 
Además, si la comida llega fría o quemada (Error 500), el mesero grita y se la lleva de inmediato al catch.
```

---

# Diagrama de flujo de datos

```
     [ Lanzar petición web ]
                │
        ┌───────┴───────┐
        ▼               ▼
    [ FETCH ]       [ AXIOS ]
        │               │
  Espera inicial    Espera inicial
        │               │
  Llegan Headers    Llega respuesta completa
        │               │
¿ok == true? (2xx)  ¿Status es 2xx?
    ├── NO ──► *     ├── NO ──► Va directo al catch
    └── SÍ           └── SÍ
        │               │
 Ejecutar .json()   Datos listos automáticos
        │               │
   Espera bytes         │
        │               │
        ▼               ▼
 [ Objeto JS listo para usar en tu aplicación ]

* Nota: En Fetch, los errores 404/500 siguen el camino del SÍ a menos que lances un throw manual.
```

---

# Buenas prácticas

✅ **Evalúa siempre la propiedad `response.ok` en Fetch:** Dado que Fetch no rebota las respuestas `404` ni `500` al bloque `catch`, es una obligación absoluta de arquitectura verificar `if (!response.ok)` para lanzar un error personalizado controlado.

✅ **Aísla Axios en una instancia configurada:** En lugar de llamar a `axios.get` por toda tu aplicación, crea una instancia base reutilizable usando `axios.create({ baseURL: 'https://api.com' })`. Esto centralizará los nombres de dominio y cabeceras.

✅ **Elige el lector del cuerpo correcto en Fetch:** No intentes usar `.json()` si estás consumiendo una imagen o un archivo binario; de lo contrario romperás el hilo de ejecución lanzando un fallo interno de parseo.

---

# Errores comunes

### ❌ Olvidar que los métodos de lectura de Fetch son promesas
Hacer lo siguiente guardará un estado de promesa pendiente, no el valor real:
```javascript
const respuesta = await fetch(url);
const datos = respuesta.json(); // ❌ ERROR: Olvidaste el 'await' antes de json()
console.log(datos); // Imprimirá: Promise { <pending> }
```

### ❌ Intentar leer el cuerpo de un objeto Response dos veces en Fetch
Los flujos de datos del cuerpo en Fetch se consumen como canales secuenciales de entrada. Una vez que corres `.json()` o `.text()`, la respuesta queda vacía y marcada como utilizada. Intentar leerla de nuevo lanzará un fallo crítico en la consola: `TypeError: Failed to execute 'json' on 'Response': body stream already read`.

---

# Ejercicios prácticos

## Nivel 1
Escribe un script utilizando la API Fetch nativa que consuma una lista de tareas simulada, valide mediante `response.ok` que no existan fallos en la comunicación y procese el resultado usando el lector `.text()` para imprimirlo tal cual en pantalla.

## Nivel 2
Crea un visualizador de imágenes dinámico. Debes realizar un `fetch()` hacia la URL de una imagen en internet, capturar su flujo binario puro usando el método de lectura de cuerpo `.blob()`, transformarlo en una URL válida del sistema de archivos e inyectarlo en el atributo `.src` de un elemento de imagen del DOM.

## Nivel 3
Toma el ejercicio anterior de registro de usuarios mediante `POST` y realízalo utilizando la sintaxis condensada y moderna de la biblioteca **Axios**. Asegúrate de simular una respuesta de error del servidor de tipo `403 Forbidden` para demostrar cómo es interceptado directamente por el bloque del `catch`.

---

# Resumen

*   **API Fetch** es el estándar moderno basado en **Promesas** para realizar peticiones asíncronas de manera nativa en el navegador, reemplazando el esquema antiguo de XHR.
*   Fetch opera en **dos fases**: la verificación inicial de la llegada del mensaje y la descarga/conversión posterior del cuerpo.
*   El cuerpo de las respuestas de Fetch debe procesarse mediante lectores asíncronos específicos: **`json()`**, **`text()`**, **`blob()`**, **`formData()`** o **`arrayBuffer()`**.
*   **Axios** es una potente librería externa que simplifica la experiencia de desarrollo al automatizar el parseo a JSON, rechazar promesas en errores HTTP (4xx/5xx) y empaquetar herramientas como interceptores globales.
