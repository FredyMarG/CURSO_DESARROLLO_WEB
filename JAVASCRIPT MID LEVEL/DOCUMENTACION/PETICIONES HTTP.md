# GUÍA — Peticiones HTTP

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender completamente cómo funcionan las peticiones HTTP, el modelo Cliente-Servidor, la naturaleza sin estado del protocolo, sus métodos y los códigos de respuesta del mundo real.

---

# 📚 Temario

1. ¿Qué es una petición HTTP?
2. El Modelo Cliente - Servidor
3. Protocolo sin estado (Stateless)
4. ¿Cómo se soluciona la falta de estado?
5. Estructura de una petición y respuesta
6. Métodos HTTP (Verbos)
7. Códigos de Estado (Status Codes)
8. Analogía del mundo real
9. Diagrama de flujo mental
10. Buenas prácticas
11. Errores comunes
12. Ejercicios
13. Resumen

---

# ¿Qué es una petición HTTP?

HTTP (**Hypertext Transfer Protocol**) es el idioma que utilizan las computadoras en internet para comunicarse y transmitirse datos entre sí (textos, imágenes, videos o archivos JSON).

Cada vez que entras a una página web o usas una app en tu teléfono, se están realizando cientos de peticiones HTTP en segundo plano.

---

# El Modelo Cliente - Servidor

La comunicación en la web es un viaje de ida y vuelta que siempre involucra a dos actores principales:

### 1. El Cliente (El que pide)
Es el dispositivo o programa que inicia la comunicación porque necesita información. 
*   **Ejemplos:** Tu navegador web (Chrome, Safari), una aplicación móvil, o un script de Node.js usando `fetch`.

### 2. El Servidor (El que responde)
Es una computadora remota conectada a internet las 24 horas que recibe la solicitud del cliente, procesa la lógica necesaria (como buscar en una base de datos) y devuelve un resultado.

```
[ Cliente ]  --- ( Petición / Request ) --->  [ Servidor ]
[ Cliente ]  <--- ( Respuesta / Response ) ---  [ Servidor ]
```

El cliente **siempre** inicia la conversación. El servidor no puede hablarle al cliente si este no le ha preguntado algo primero.

---

# Protocolo sin estado (Stateless)

Una de las características más importantes de HTTP es que es un protocolo **sin estado**.

> **Definición:** El servidor procesa cada petición de manera completamente aislada. No guarda memoria, registro, ni información de las peticiones pasadas.

Para el servidor, cada petición que llega es como si viniera de un completo desconocido, incluso si esa misma computadora le envió otra petición hace un milisegundo.

```
Petición 1: "Hola, soy Juan y quiero ver mi perfil" 
Servidor: "Aquí tienes tu perfil."

Petición 2: "Ahora quiero ver mis fotos"
Servidor: "¿Quién eres? No sé de quién me hablas, vuelve a identificarte."
```

### ¿Por qué se diseñó así?
*   **Escalabilidad:** Al no tener que recordar a millones de usuarios activos, los servidores consumen menos memoria y son muchísimo más rápidos.
*   **Simplicidad:** Si un servidor se cae y la petición se redirige a otro, el nuevo servidor puede procesarla sin necesidad de conocer el historial del usuario.

---

# ¿Cómo se soluciona la falta de estado?

Como los usuarios necesitan iniciar sesión y mantener carritos de compras, los desarrolladores añadieron mecanismos para "simular" el estado. En lugar de que el servidor recuerde, **el cliente debe identificarse en cada una de las peticiones**.

Se utilizan principalmente dos herramientas:

*   **Cookies:** Pequeños fragmentos de texto que el servidor le pide a tu navegador que guarde. El navegador los envía automáticamente de vuelta en cada petición posterior.
*   **Tokens (JWT — JSON Web Tokens):** Una cadena de texto cifrada que la aplicación del cliente almacena en su memoria y adjunta manualmente en las cabeceras de sus peticiones HTTP para demostrar quién es.

---

# Estructura de una Petición y Respuesta

Para que ambos extremos se entiendan, los mensajes HTTP tienen una estructura fija dividida en tres partes obligatorias:

```
┌────────────────────────────────────────┐
│  Línea de Inicio (Método/Ruta/Código)   │
├────────────────────────────────────────┤
│  Headers (Metadatos: Tipo, Auth, etc)  │
├────────────────────────────────────────┤
│  Body (Datos reales en JSON o texto)   │
└────────────────────────────────────────┘
```

1.  **Línea de Inicio:** En la petición indica qué acción hacer y dónde (ej. `GET /usuarios`). En la respuesta indica si salió bien o mal (ej. `200 OK`).
2.  **Cabeceras (Headers):** Metadatos complementarios que describen el mensaje. Indican cosas como el idioma, el tipo de datos (ej. `Content-Type: application/json`) o credenciales de autenticación.
3.  **Cuerpo (Body):** Los datos reales del mensaje. En un `POST`, es la información que el cliente envía al servidor para guardarla. En una respuesta, suele ser el JSON con los datos solicitados. *(Nota: Métodos como `GET` normalmente no llevan Body)*.

---

# Métodos HTTP (Verbos)

Los métodos HTTP le indican al servidor **qué tipo de acción** queremos realizar sobre un recurso. Los más utilizados en el desarrollo profesional son:

| Método | Propósito Semántico | ¿Lleva Body en la Petición? |
| :--- | :--- | :--- |
| **`GET`** | **Leer** o recuperar información existente. | No |
| **`POST`** | **Crear** un recurso totalmente nuevo. | Sí |
| **`PUT`** | **Reemplazar** un recurso existente por completo. | Sí |
| **`PATCH`** | **Modificar parcialmente** un recurso existente. | Sí |
| **`DELETE`** | **Eliminar** un recurso del servidor. | Opcional (Raro) |

### Ejemplo visual de rutas en una API:
*   `GET /productos` ➡️ Trae la lista de todos los productos.
*   `POST /productos` ➡️ Agrega un nuevo producto (los datos van en el Body).
*   `PATCH /productos/45` ➡️ Cambia únicamente el precio del producto con ID 45.
*   `DELETE /productos/45` ➡️ Borra el producto 45 del inventory.

---

# Códigos de Estado (Status Codes)

El servidor utiliza un número de 3 dígitos para informarle rápidamente al cliente cuál fue el resultado de su petición. Se dividen en 5 familias numéricas:

### 🟢 2xx — Respuestas Exitosas (Todo salió bien)
*   **`200 OK`:** La petición fue exitosa y se devuelven los datos (común en `GET` y `PUT`).
*   **`201 Created`:** El recurso se creó con éxito (común en respuestas de `POST`).

### 🟡 3xx — Redirecciones (El recurso se movió)
*   **`301 Moved Permanently`:** La página o recurso cambió de dirección URL para siempre.

### 🔴 4xx — Errores del Cliente (Te equivocaste tú)
*   **`400 Bad Request`:** Los datos enviados están mal formateados o incompletos.
*   **`401 Unauthorized`:** No has iniciado sesión o no incluiste las credenciales necesarias.
*   **`403 Forbidden`:** El servidor sabe quién eres, pero **no tienes permisos** para entrar ahí.
*   **`404 Not Found`:** El recurso o la ruta solicitada no existe.

### 💥 5xx — Errores del Servidor (Se rompió el sistema)
*   **`500 Internal Server Error`:** El código del servidor falló catastróficamente (un bug, base de datos caída, etc.).

---

# Analogía con un restaurante de comida rápida 🍔

Volvamos a la analogía para conectar todos los conceptos:

```
Tú (Cliente) llegas al mostrador (Servidor).

1. Haces una petición POST (Pides una hamburguesa nueva).
2. Pagas y te identificas (Envías tu token/ticket de compra).
3. Te dan un número y te sientas. 
4. El cajero te olvida inmediatamente debido al flujo sin estado (Stateless).
5. Vuelves al mostrador mostrando tu ticket (Cookie/Token) para pedir salsa.
6. El cajero mira tu ticket, verifica que pagaste y te da la salsa (Respuesta 200 OK).
```

---

# Diagrama de flujo mental

Para saber qué método y código usar en tu código backend o frontend:

```
¿Quieres obtener información o enviar datos?
 ├── Obtener ──► Usa GET ──► ¿Existe el recurso?
 │                            ├── SÍ ──► Respuesta 200 OK
 │                            └── NO ──► Respuesta 404 Not Found
 │
 └── Enviar ───► ¿Vas a crear o modificar?
                  ├── Crear ───► Usa POST  ──► Respuesta 201 Created
                  └── Modificar ──► ¿Total o Parcial?
                                     ├── Total ───► Usa PUT ──► Respuesta 200 OK
                                     └── Parcial ─► Usa PATCH ─► Respuesta 200 OK
```

---

# Buenas prácticas

✅ **Respeta la semántica de los métodos:** No uses `GET` para eliminar un usuario de la base de datos ni `POST` solo para listar información.

✅ **Envía siempre el Content-Type correcto:** Si estás enviando datos en formato JSON, asegúrate de que tu petición incluya la cabecera `Content-Type: application/json`.

✅ **Controla los errores 4xx y 5xx en el cliente:** Nunca asumas que una petición HTTP siempre devolverá un código `200`. Envuelve tus peticiones en bloques condicionales o `try/catch` para capturar respuestas fallidas.

✅ **Aprovecha el flujo stateless:** No diseñes aplicaciones guardando sesiones críticas pesadas directamente en la memoria volátil del servidor; utiliza bases de datos de sesión como Redis o tokens autocontenidos (JWT).

---

# Errores comunes

### ❌ Pensar que un fetch fallido siempre va al catch
En JavaScript, `fetch()` solo arroja un error real (entra al `catch`) si hay un fallo de red o el servidor no responde. Si el servidor te responde con un error `404 Not Found` o `500 Error`, la promesa se resolverá como exitosa. Debes evaluar la propiedad `response.ok`.

### ❌ Tratar PUT y PATCH como si fueran idénticos
Si usas `PUT` enviando solo el campo `{ edad: 30 }` a un usuario que tiene nombre, correo y edad, podrías borrar accidentalmente el nombre y el correo. Usa `PATCH` si solo vas a alterar propiedades específicas.

### ❌ Enviar datos sensibles en la URL de un GET
Las URLs quedan grabadas en el historial del navegador, en los logs del servidor y en los proxies de red. Nunca pases contraseñas o tokens directamente dentro de los parámetros de búsqueda de un método `GET`; usa el Body de un `POST` bajo una conexión HTTPS segura.

---

# Ejercicios

## Nivel 1
Dibuja un diagrama de bloques del flujo Cliente-Servidor detallando qué elementos viajan en el Request y cuáles en el Response al momento de cargar el feed de una red social.

## Nivel 2
Analiza la pestaña **Network** (Red) de las herramientas de desarrollador de tu navegador web favorito. Identifica al menos una petición estática (`GET` de una imagen o script) y una petición dinámica (`Fetch/XHR`). Anota sus cabeceras principales y sus códigos de estado.

## Nivel 3
Diseña conceptualmente las rutas para una API REST de una biblioteca de libros. Define qué métodos HTTP utilizarías y qué códigos de estado debería devolver el servidor si:
1. El libro solicitado no existe.
2. El libro se registró con éxito.
3. El usuario intentó borrar un libro sin haber iniciado sesión.

---

# Resumen

*   El **Modelo Cliente-Servidor** dicta que el cliente siempre inicia una petición y el servidor devuelve una respuesta.
*   HTTP es **Stateless (sin estado)** por diseño para ser eficiente y escalable; cada petición se procesa de forma independiente.
*   Para simular memoria y mantener sesiones abiertas, el cliente recurre a **Cookies y Tokens** en cada Request.
*   Los **Métodos HTTP** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) aportan un estándar de comportamiento semántico a las acciones web.
*   Los **Códigos de Estado** le informan al navegador el destino de la operación de forma estandarizada mediante números de 3 dígitos divididos en familias del `100` al `500`.