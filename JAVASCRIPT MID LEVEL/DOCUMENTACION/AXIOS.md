# GUÍA — Librería Axios

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender en profundidad el funcionamiento de la librería Axios, su instalación, su arquitectura basada en promesas, la manipulación de los métodos `get()` y `post()`, y las diversas formas profesionales de enviar datos al servidor.

---

# 📚 Temario

1. ¿Qué es Axios?
2. Introducción e instalación
3. Arquitectura basada en Promesas
4. El Objeto global `axios`
5. Peticiones de lectura con `get()`
6. Peticiones de creación con `post()`
7. Formas de enviar datos al servidor
8. Ventajas competitivas frente a Fetch
9. Analogía del mundo real
10. Diagrama de flujo de Axios
11. Buenas prácticas
12. Errores comunes
13. Ejercicios
14. Resumen

---

# ¿Qué es Axios?

Axios es un **cliente HTTP basado en promesas** muy popular en el ecosistema de JavaScript. Funciona de manera idéntica tanto en el navegador web como en el entorno de servidor (Node.js), lo que la convierte en una herramienta "isomórfica" o universal.

A diferencia de la API Fetch nativa, Axios actúa como un envoltorio inteligente (wrapper) que simplifica drásticamente la sintaxis y automatiza las tareas más repetitivas del manejo de peticiones de red.

---

# Introducción e instalación

Para poder utilizar Axios en tu proyecto, primero debes incluir la librería dentro de tu entorno de desarrollo. Tienes tres formas principales de hacerlo:

### 1. Usando un Gestor de Paquetes (Recomendado para Node.js / React / Vue)
Si estás construyendo una aplicación moderna con un empaquetador de módulos, ejecútala en tu terminal:

```bash
# Con NPM
npm install axios

# Con Yarn
yarn add axios
```

Una vez instalado, lo importas en tu archivo de JavaScript:
```javascript
import axios from 'axios';
```

### 2. A través de una red de distribución de contenido (CDN para HTML puro)
Si estás trabajando en un proyecto frontend clásico sin empaquetadores, agrega esta etiqueta `<script>` en el `<head>` o al final del `<body>` de tu archivo HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

---

# Arquitectura basada en Promesas

Al igual que las APIs modernas de JavaScript, Axios es **completamente asíncrono y está basado en Promesas**. Esto significa que se integra de manera nativa y elegante con la sintaxis moderna de `async` y `await`.

### El objeto de respuesta unificado
A diferencia de Fetch, que te obliga a realizar un proceso en dos fases (esperar los encabezados y luego esperar la lectura del cuerpo del mensaje), Axios resuelve la promesa entregándote un **único objeto de respuesta enriquecido**:

```javascript
async function obtenerRespuesta() {
    try {
        const respuesta = await axios.get("https://api.ejemplo.com/datos");
        
        // Axios ya parseó el JSON por ti y lo colocó en la propiedad 'data'
        console.log(respuesta.data); 
        
        // También tienes acceso directo a otros metadatos útiles:
        console.log(respuesta.status);     // Código de estado HTTP (ej. 200)
        console.log(respuesta.statusText); // Mensaje de estado (ej. "OK")
        console.log(respuesta.headers);    // Cabeceras enviadas por el servidor
        console.log(respuesta.config);     // Configuración interna de la petición
    } catch (error) {
        console.error("Error en la petición");
    }
}
```

---

# El Objeto global `axios`

Cuando importas la librería o la cargas mediante un CDN, se expone un objeto global llamado `axios`. Este objeto puede invocarse directamente como una función pasando un objeto de configuración general:

```javascript
// Método de configuración genérica
axios({
    method: 'get',
    url: 'https://api.ejemplo.com/usuarios/1',
    timeout: 4000 // Cancela automáticamente la petición si tarda más de 4 segundos
})
.then(response => console.log(response.data));
```

Sin embargo, para mejorar la legibilidad y la rapidez al escribir código, el objeto expone **métodos de acceso directo (shorthand methods)** para cada verbo HTTP, como `axios.get()`, `axios.post()`, `axios.delete()`, entre otros.

---

# Peticiones de lectura con `get()`

El método `axios.get()` está diseñado exclusivamente para solicitar y leer información del servidor de forma asíncrona.

### Sintaxis básica:
```javascript
async function listarProductos() {
    try {
        const url = "https://jsonplaceholder.typicode.com/posts";
        const respuesta = await axios.get(url);
        
        // Imprimimos la lista de posts devuelta de forma automática
        console.log(respuesta.data);
    } catch (error) {
        console.error("Ocurrió un error al consultar los productos:", error.message);
    }
}
```

---

# Peticiones de creación con `post()`

El método `axios.post()` se utiliza para enviar nuevos datos en el cuerpo del mensaje hacia el servidor con el fin de registrar o crear recursos.

### Sintaxis básica:
A diferencia de `get()`, el método `post()` acepta como **segundo parámetro el cuerpo de los datos (payload)** que deseas enviar. Axios detecta automáticamente que es un objeto de JavaScript y lo transforma a un string JSON tras bambalinas, configurando por ti la cabecera `Content-Type: application/json`.

```javascript
async function crearUsuario() {
    try {
        const url = "https://jsonplaceholder.typicode.com/users";
        
        // Datos del nuevo usuario como un objeto de JavaScript puro
        const nuevoUsuario = {
            name: "Juan Perez",
            email: "juan@correo.com"
        };

        // Realizamos el envío POST
        const respuesta = await axios.post(url, nuevoUsuario);
        
        console.log("Servidor responde con código:", respuesta.status); // 201 Created
        console.log("Recurso creado en el servidor:", respuesta.data);
    } catch (error) {
        console.error("Error al intentar registrar el usuario:", error.message);
    }
}
```

---

# Formas de enviar los datos

Dependiendo de los requerimientos de la API con la que estés interactuando, existen tres maneras principales de transmitir información utilizando Axios:

### 1. Parámetros en la URL (Query Parameters)
Utilizados habitualmente en métodos `GET` para filtrar, ordenar o paginar listas (por ejemplo: `?categoria=libros&limite=5`). En lugar de concatenar manualmente strings en la URL, Axios te permite pasarlos de manera limpia usando la propiedad `params`:

```javascript
async function buscarLibros() {
    // Generará la URL: https://api.ejemplo.com/buscar?categoria=libros&limite=5
    const respuesta = await axios.get("https://api.ejemplo.com/buscar", {
        params: {
            categoria: "libros",
            limite: 5
        }
    });
    console.log(respuesta.data);
}
```

### 2. Cuerpo de la petición (Request Body / Payload)
Utilizado de forma estándar en métodos de escritura como `POST`, `PUT` y `PATCH` para transmitir objetos de datos complejos.

```javascript
// Los datos se pasan directamente como el segundo argumento en métodos cortos
axios.post("/api/guardar", { token: "abc456", total: 150 });
```

### 3. Formularios nativos y binarios (`FormData`)
Si necesitas enviar archivos adjuntos (imágenes, PDFs, videos) o emular un formulario web tradicional, puedes pasar una instancia del objeto `FormData` directamente como el cuerpo de la petición.

```javascript
const formulario = new FormData();
formulario.append("foto_perfil", archivoInput.files[0]);
formulario.append("usuario_id", "99");

// Axios reconocerá el FormData y configurará las cabeceras multipart de forma transparente
const respuesta = await axios.post("/api/subir", formulario);
```

---

# Ventajas competitivas frente a Fetch

| Característica | API Fetch Nativa | Librería Axios |
| :--- | :--- | :--- |
| **Transformación de datos** | Requiere conversión manual (`res.json()`). | **Automatizada.** Retorna el JSON listo en `.data`. |
| **Manejo de errores HTTP** | No rechaza códigos `4xx` o `5xx` en el `catch`. | **Automático.** Envía códigos de error directo al `catch`. |
| **Soporte para navegadores** | No soporta navegadores obsoletos sin polyfills. | Soporte amplio y robusto incorporado de fábrica. |
| **Protección CSRF** | Requiere configuración e implementación manual. | **Seguridad pasiva.** Soporte automático incorporado. |
| **Cancelación de peticiones** | Requiere implementar el complejo `AbortController`. | Permite cancelaciones simples por configuración o tiempos límite (`timeout`). |

---

# Analogía del asistente de mensajería VIP 🤵

Imagina que necesitas enviar un paquete a otra oficina:

```
Con Fetch Nativo:
Llamas al mensajero tradicional. Tienes que envolver el paquete tú mismo, rotular la dirección con las reglas de correo exactas, y cuando el mensajero vuelve con la respuesta, tienes que desempaquetar la caja tú mismo para ver qué te trajeron.

Con Axios:
Tienes un asistente VIP privado. Solo le das el objeto en las manos ("Toma estas llaves") y le dices a dónde ir. El asistente se encarga de empacar los datos, poner las etiquetas correctas de aduana (Cabeceras) y cuando regresa, te entrega la información ya abierta y lista sobre tu escritorio.
```

---

# Diagrama de flujo de Axios

```
  Petición Axios Disparada (get / post)
                 │
                 ▼
     [ Serialización Automática ]  ──► Transforma objetos JavaScript a texto JSON
                 │
                 ▼
     [ Envío de datos a la Red ]
                 │
                 ▼
       ¿Código HTTP de Respuesta?
        ├── Es de la familia 2xx ──► Resuelve la promesa ──► Entra al .then() / await
        └── Es de la familia 4xx/5xx ─► Rechaza la promesa ─► Entra directo al catch()
```

---

# Buenas prácticas

✅ **Aprovecha el interceptor de errores en el `catch`:** Al capturar un error en Axios, evalúa si `error.response` está presente. Esto te permite separar un error real del servidor (como un código 404) de un error donde el servidor nunca contestó (problemas de internet del usuario).

✅ **Define una URL base reutilizable:** Si todas tus peticiones van al mismo servidor, evita reescribir todo el dominio. Puedes crear una instancia personalizada:
```javascript
const clienteAPI = axios.create({
    baseURL: 'https://api.miweb.com/v1',
    timeout: 5000
});
// Ahora usas: clienteAPI.get('/usuarios')
```

✅ **Usa la propiedad `params` para peticiones GET limpias:** Evita concatenar strings manualmente con variables (`url + "?id=" + id`), ya que esto abre la puerta a caracteres inválidos o problemas de codificación URL. Dejar que Axios limpie los parámetros con `params` es más seguro.

---

# Errores comunes

### ❌ Buscar la respuesta directamente en el objeto de retorno
Olvidar que Axios envuelve el JSON del servidor dentro de una propiedad intermedia llamada `data`:
```javascript
const respuesta = await axios.get('/api/usuario');
console.log(respuesta.nombre); // ❌ ERROR: Dará undefined.
console.log(respuesta.data.nombre); //  CORRECTO
```

### ❌ Intentar usar `.json()` en la respuesta de Axios
Debido a la costumbre de usar Fetch nativo, muchos desarrolladores intentan hacer esto, lo cual desatará un error en la consola dado que esa función no existe en el objeto de respuesta de Axios:
```javascript
const respuesta = await axios.get('/api/datos');
const datos = await respuesta.json(); // ❌ ERROR CRÍTICO: respuesta.json no es una función
```

---

# Ejercicios

## Nivel 1
Instala o carga Axios mediante CDN en un archivo HTML de prueba. Realiza una petición `GET` hacia una API pública (como `https://jsonplaceholder.typicode.com/todos/1`) e imprime el título de la tarea directamente en el cuerpo de tu página web utilizando `async/await`.

## Nivel 2
Crea un script que realice una petición de creación `POST` utilizando `axios.post()`. Debes enviar un objeto que simule un nuevo artículo de blog (título, cuerpo y ID de usuario). Asegúrate de capturar la respuesta y comprobar en la consola que el servidor te devuelva el código de estado `201 Created`.

## Nivel 3
Desarrolla una función de búsqueda avanzada que reciba dos argumentos de texto: `genero` y `anio`. La función debe despachar una petición `GET` utilizando Axios hacia la ruta `/peliculas`, inyectando de forma limpia ambos argumentos a través del objeto de configuración `params`. Envuelve la lógica en un bloque `try/catch` profesional capaz de desglosar el mensaje de error si la petición falla.

---

# Resumen

*   **Axios** es un cliente HTTP isomórfico y moderno basado íntegramente en el ecosistema de **Promesas** de JavaScript.
*   Automatiza la **serialización y deserialización** de datos, abstrayendo al desarrollador del uso de procesos manuales como `JSON.stringify()` o `.json()`.
*   El método **`get()`** acepta la propiedad `params` para formatear de manera segura parámetros de búsqueda en la URL.
*   El método **`post()`** inyecta objetos complejos directamente como segundo parámetro para ser transmitidos en el cuerpo del mensaje.
*   Posee un **sistema automático de control de errores** que desvía de forma inmediata cualquier respuesta de estado HTTP fuera del rango exitoso (`2xx`) hacia el bloque `catch`.
