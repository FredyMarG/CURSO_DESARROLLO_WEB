# GUÍA — AJAX y XMLHttpRequest

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender la evolución de la carga asíncrona de datos mediante AJAX, dominar el uso clásico del objeto `XMLHttpRequest`, interactuar de forma segura con servidores locales y manejar formularios complejos con `FormData`.

---

# 📚 Temario

1. ¿Qué es AJAX?
2. Introducción e instalación del servidor local
3. El Objeto clásico `XMLHttpRequest`
4. Enviar peticiones GET
5. Trabajar el resultado de las peticiones (La forma antigua)
6. Objeto `ActiveXObject` (Historial de compatibilidad)
7. La nueva forma de trabajar el resultado (`onload`)
8. Enviar peticiones POST
9. Envío de formularios avanzados con el objeto `FormData`
10. Analogía del mundo real
11. Diagrama de ciclo de vida de una petición
12. Buenas prácticas
13. Errores comunes
14. Ejercicios
15. Resumen

---

# ¿Qué es AJAX?

AJAX significa **Asynchronous JavaScript And XML** (JavaScript Asíncrono y XML). No es un lenguaje de programación ni una tecnología única; es un **conjunto de técnicas de desarrollo web** que permite a las páginas actualizar datos en segundo plano.

Gracias a AJAX, el navegador puede pedirle datos al servidor y actualizar una parte de la pantalla **sin necesidad de recargar toda la página web**.

---

# Introducción e instalación del servidor local

Para practicar y realizar peticiones AJAX reales con JavaScript, **no puedes simplemente abrir un archivo `.html` haciendo doble clic en tu computadora**.

Si intentas hacer una petición AJAX desde una ruta de archivo local (`file:///C:/...`), el navegador bloqueará tu solicitud por razones de estricta seguridad (**Errores de CORS**). Necesitas un entorno que simule un servidor real de internet (`http://localhost`).

### 🚀 Herramientas rápidas para montar tu servidor:

1. **Live Server (Extensión de VS Code):**
   * Abre Visual Studio Code.
   * Ve a la sección de extensiones, busca **Live Server** e instálala.
   * Haz clic derecho sobre tu archivo `index.html` y selecciona **"Open with Live Server"**.
   * Levantará un servidor automático en la dirección `http://127.0.0.1:5500`.

2. **Servidor con Node.js (Si usas la terminal):**
   ```bash
   # Instalar una herramienta global
   npm install -g http-server
   
   # Arrancar el servidor en la carpeta de tu proyecto
   http-server
   ```

---

# El Objeto clásico `XMLHttpRequest`

Antes de que existiera el método moderno `fetch()`, el corazón de todo AJAX en el navegador era el objeto nativo **`XMLHttpRequest`** (XHR). Este objeto provee una API JavaScript completa para transferir datos de forma asíncrona.

Para iniciar cualquier petición, lo primero que se debe hacer es instanciar su constructor:

```javascript
const xhr = new XMLHttpRequest();
```

---

# Enviar peticiones GET

El método `GET` se utiliza para solicitar datos específicos a un servidor. El viaje básico con un objeto `XMLHttpRequest` requiere tres pasos fundamentales:

```javascript
const xhr = new XMLHttpRequest();

// 1. Configurar la petición: Método HTTP y URL destino
xhr.open("GET", "https://api.ejemplo.com/usuarios", true); // El tercer parámetro indica asincronía

// 2. Definir qué hacer cuando la petición responda con éxito
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("¡Datos recibidos!");
    }
};

// 3. Disparar el envío físico del mensaje por la red
xhr.send();
```

---

# Trabajar el resultado de las peticiones (Forma Antigua)

En los inicios de AJAX, para capturar la respuesta del servidor se utilizaba el evento `onreadystatechange`. Este evento se dispara cada vez que cambia el estado de la comunicación de la propiedad interna **`readyState`**.

El objeto `XMLHttpRequest` pasa por 5 estados progresivos (del 0 al 4):

| Código | Estado | Significado técnico |
| :--- | :--- | :--- |
| **0** | `UNSENT` | El objeto ha sido creado, pero aún no se llama a `.open()`. |
| **1** | `OPENED` | Ya se llamó al método `.open()`, la petición está configurada. |
| **2** | `HEADERS_RECEIVED` | Se ha llamado a `.send()` y las cabeceras de respuesta ya llegaron. |
| **3** | `LOADING` | Descargando el cuerpo de la respuesta del servidor. |
| **4** | `DONE` | **Operación completada.** Los datos están listos para ser usados. |

Por eso el código histórico requería obligatoriamente evaluar si el estado era igual a 4 antes de leer la propiedad `xhr.responseText`:

```javascript
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) { // ¿Llegó al estado final?
        if (xhr.status === 200) { // ¿El código HTTP dice que todo salió bien?
            const datos = JSON.parse(xhr.responseText);
            console.log(datos);
        }
    }
};
```

---

# Objeto `ActiveXObject` (Historial de compatibilidad)

Si revisas bases de código heredadas de empresas o sistemas legados muy antiguos de principios de los años 2000, te toparás con un objeto especial.

```javascript
// La famosa frase en foros antiguos: "Messirve" para Internet Explorer
var xhr = new ActiveXObject("Microsoft.XMLHTTP");
```

### ¿Por qué existe esto?
*   El concepto original de realizar peticiones en segundo plano fue inventado por ingenieros de Microsoft para la aplicación web de Outlook y se implementó primero en el navegador **Internet Explorer 5** como un control ActiveX especial.
*   Navegadores competidores posteriores (como Mozilla y Safari) decidieron estandarizar esta idea creando un objeto nativo directo en la ventana llamado `XMLHttpRequest`.
*   Para escribir código que funcionara en absolutamente cualquier computadora de la época, los programadores debían crear una estructura condicional que detectara el navegador:

```javascript
var xhr;
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest(); // Para navegadores modernos y estándar de la época
} else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP"); // Para Internet Explorer 6 e inferiores
}
```

---

# La nueva forma de trabajar el resultado (`onload`)

Con las actualizaciones de los estándares de desarrollo web (XHR Nivel 2), la sintaxis se simplificó drásticamente introduciendo el evento moderno **`onload`**. 

El evento `onload` elimina la necesidad de evaluar manualmente los códigos de cambio de estado `0` a `4`. El evento **solo se dispara cuando la petición ya terminó por completo de forma exitosa (estado DONE)**.

```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.ejemplo.com/perfil");

// Forma moderna: Ya no evalúas readyState
xhr.onload = function() {
    if (xhr.status === 200) {
        const respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
    } else {
        console.error("Error en el servidor con código: " + xhr.status);
    }
};

xhr.onerror = function() {
    console.error("Error crítico de conexión de red.");
};

xhr.send();
```

---

# Enviar peticiones POST

El método `POST` se utiliza para enviar información en el cuerpo del mensaje hacia el servidor para crear recursos (como registrar un nuevo usuario).

Cuando usas `XMLHttpRequest` puro para enviar un objeto o datos de texto estructurados en formato JSON, debes **configurar manualmente la cabecera del tipo de contenido antes de enviar el mensaje**.

```javascript
const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.ejemplo.com/usuarios");

// Obligatorio: Avisarle al servidor que le enviaremos un JSON en el Body
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

xhr.onload = function() {
    if (xhr.status === 201) { // 201 = Creado con éxito
        console.log("Usuario registrado:", JSON.parse(xhr.responseText));
    }
};

const nuevoUsuario = {
    username: "dev_junior",
    correo: "junior@correo.com"
};

// Se debe convertir el objeto a string antes de inyectarlo en el send()
xhr.send(JSON.stringify(nuevoUsuario));
```

---

# Envío de formularios con el objeto `FormData`

Construir strings JSON de forma manual para formularios que contienen muchos campos, contraseñas o cargas físicas de imágenes y archivos puede ser muy engorroso. Para solucionar esto nació el objeto nativo **`FormData`**.

`FormData` compila automáticamente un mapa de llaves y valores emulando el comportamiento nativo de un formulario HTML (`enctype="multipart/form-data"`).

```javascript
// Supongamos que tienes un elemento formulario en tu HTML: <form id="miFormulario">
const formularioHTML = document.getElementById("miFormulario");

// Instanciamos FormData pasándole el elemento del DOM
const datosFormulario = new FormData(formularioHTML);

// También puedes añadir propiedades personalizadas al vuelo
datosFormulario.append("fecha_registro", "2026-10-19");

const xhr = new XMLHttpRequest();
xhr.open("POST", "/procesar-registro");

xhr.onload = function() {
    console.log("Formulario enviado con éxito.");
};

// ⚠️ NOTA DE ORO: Al enviar un objeto FormData, NUNCA debes configurar 
// la cabecera 'Content-Type'. El navegador la calculará e inyectará automáticamente.
xhr.send(datosFormulario);
```

---

# Analogía del mensajero de correspondencia 📬

Imagina que estás trabajando en tu escritorio y necesitas un reporte de la oficina central:

```
1. Instancias al mensajero (const xhr = new XMLHttpRequest()).
2. Le dices a dónde ir y qué tipo de paquete traer (xhr.open("GET", "/reporte")).
3. Le dejas una nota en la puerta diciendo qué hacer cuando él vuelva (xhr.onload = function(){...}).
4. Le das la orden de salir a la calle (xhr.send()).
5. Tú sigues escribiendo en tu computadora sin detener tu trabajo (Asincronía).
6. El mensajero regresa a tu oficina, toca la puerta y te entrega los documentos impresos (xhr.responseText).
```

---

# Diagrama del ciclo de vida de una petición

```
 [ XMLHttpRequest instanciado ] (readyState = 0)
              │
              ▼
   [ .open() configurado ]     (readyState = 1)
              │
              ▼
    [ .send() ejecutado ]      ──► Viaja por internet al servidor
              │
              ▼
 [ Cabeceras recibidas en red ] (readyState = 2)
              │
              ▼
  [ Descargando texto/JSON ]    (readyState = 3)
              │
              ▼
    [ Descarga Finalizada ]    (readyState = 4) ──► Dispara el evento .onload()
```

---

# Buenas prácticas

✅ **Usa siempre `try/catch` al parsear la respuesta:** El servidor podría responder con un código HTTP 200 pero devolver un texto corrupto o un mensaje de error que no sea un JSON válido. El método `JSON.parse(xhr.responseText)` lanzará un error que debes capturar.

✅ **Aprovecha `xhr.timeout`:** Configura siempre un tiempo límite máximo de espera para tus peticiones (por ejemplo, `xhr.timeout = 5000;`). Esto evitará que tu aplicación se quede colgada indefinidamente si la conexión del usuario es extremadamente lenta.

✅ **No configures la cabecera de Content-Type si usas FormData:** Dejar que el navegador administre el límite de separación (`boundary`) de los datos multiparte de forma automática evita que el servidor falle al intentar descomponer los campos y archivos.

---

# Errores comunes

### ❌ Leer las propiedades de respuesta fuera de los eventos
Intentar hacer esto arrojará un valor vacío (`""`) o nulo debido a que la petición se ejecuta en segundo plano y la siguiente línea de código de tu script principal se procesará antes de que el servidor responda:
```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "/datos");
xhr.send();
console.log(xhr.responseText); // ❌ ERROR: Estará vacío porque el mensajero no ha vuelto.
```

### ❌ Ignorar el estado del código HTTP en `onload`
El evento `.onload` se ejecutará de todas formas si la petición fue a un servidor y este respondió, incluso si respondió con un error catastrófico `500 Internal Server Error`. Asegúrate de verificar siempre la propiedad `xhr.status === 200`.

---

# Ejercicios

## Nivel 1
Crea una instancia de un objeto `XMLHttpRequest` que realice una petición `GET` hacia un archivo de texto local simulado en tu servidor de desarrollo (`/datos.txt`) e imprime su contenido en un elemento HTML de tu página web utilizando el evento `.onload`.

## Nivel 2
Construye una función reutilizable llamada `hacerPeticion(url, callback)` que encapsule la lógica base de un objeto `XMLHttpRequest` moderno, aislando los estados y devolviendo la información parseada a la función callback provista una vez termine la descarga de forma correcta.

## Nivel 3
Escribe un script de JavaScript que capture el envío de un formulario de registro HTML utilizando `e.preventDefault()`, extraiga todos sus inputs usando un objeto `FormData`, agregue dinámicamente un token de seguridad adicional con `.append()` y despacha toda la carga hacia una API simulada mediante un método `POST` usando `XMLHttpRequest`.

---

# Resumen

*   **AJAX** permite actualizar secciones de una página web pidiendo datos asíncronos en segundo plano sin interrumpir la experiencia del usuario.
*   **`XMLHttpRequest`** es el objeto nativo histórico que orquesta este flujo de comunicación mediante eventos de estado (`readyState`).
*   **`ActiveXObject`** fue la implementación propietaria de Microsoft para permitir AJAX dentro de los ecosistemas antiguos de Internet Explorer.
*   El evento moderno **`.onload`** simplifica la lectura de respuestas al activarse únicamente cuando la operación de red se ha completado.
*   **`FormData`** permite agrupar y serializar colecciones complejas de inputs de formularios y archivos binarios nativos de forma automática y transparente antes de ser despachados mediante una petición `POST`.
