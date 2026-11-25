# Guía Completa sobre Cookies en JavaScript

Las **cookies** son pequeños fragmentos de datos (en formato texto) que un sitio web envía al navegador del usuario y que este almacena localmente en su dispositivo. Su objetivo principal es permitir que el servidor recuerde información sobre la visita del usuario.

---

## 1. Definición y usos comunes

Dado que el protocolo **HTTP es sin estado** (*stateless*), el servidor no recuerda quién hizo una petición anterior. Las cookies resuelven este problema mediante los siguientes usos principales:

* **Gestión de sesiones y diferenciación de usuarios:** Mantener la sesión iniciada, recordar los productos añadidos a un carrito de compras o identificar si un usuario es nuevo o recurrente.
* **Personalización y experiencia de usuario (UX):** Guardar preferencias locales como el idioma seleccionado, el tema visual (modo oscuro/claro) o la región geográfica.
* **Seguimiento, analítica y publicidad (Ads):** Analizar el comportamiento de navegación del usuario dentro y fuera del sitio para medir métricas de tráfico o mostrar anuncios personalizados.

---

## 2. Formas de clasificar cookies

Las cookies pueden agruparse bajo distintos criterios técnicos y funcionales:

### Según su tiempo de vida (Duración)
* **Cookies de sesión:** Se almacenan temporalmente en la memoria del navegador y se eliminan automáticamente al cerrar la pestaña o el navegador. No tienen fecha de expiración (`expires` o `max-age`).
* **Cookies persistentes:** Permanecen almacenadas en el dispositivo durante un tiempo determinado (definido mediante `expires` o `max-age`), incluso después de cerrar el navegador.

### Según su procedencia (Dominio)
* **Cookies propias (*First-party*):** Son creadas y gestionadas directamente por el dominio que el usuario está visitando.
* **Cookies de terceros (*Third-party*):** Son generadas por dominios externos al sitio visitado (por ejemplo, redes publicitarias, mapas incrustados o herramientas de analítica).

### Según su finalidad
* **Técnicas o necesarias:** Imprescindibles para el funcionamiento básico y la seguridad de la web.
* **De preferencias o personalización:** Recuerdan configuraciones elegidas por el usuario.
* **De análisis o medición:** Permiten cuantificar el número de usuarios y analizar su actividad.
* **De publicidad comportamental:** Almacenan información del comportamiento para crear perfiles publicitarios.

---

## 3. Crear una cookie

En JavaScript, las cookies se gestionan a través de la propiedad `document.cookie`. Cada cookie sigue el formato `clave=valor` y puede acompañarse de atributos opcionales separados por punto y coma (`;`).

```javascript
// Cookie básica de sesión
document.cookie = "usuario=JuanPerez";

// Cookie persistente con atributos de configuración
document.cookie = "tema=oscuro; max-age=86400; path=/; Secure; SameSite=Lax";
```

### Atributos principales
* `expires=FECHA_UTC`: Fecha exacta de caducidad en formato UTC (ej. `Thu, 31 Dec 2026 23:59:59 GMT`).
* `max-age=SEGUNDOS`: Tiempo de vida en segundos desde su creación (ej. `3600` para 1 hora). Tiene prioridad sobre `expires`.
* `path=RUTA`: Indica en qué rutas del dominio es accesible la cookie (por defecto es la ruta actual; `/` la hace accesible en todo el sitio).
* `domain=DOMINIO`: Especifica los subdominios que pueden acceder a la cookie.
* `Secure`: Garantiza que la cookie solo se transmita a través de conexiones cifradas (`HTTPS`).
* `SameSite=Strict | Lax | None`: Controla el envío de cookies en peticiones entre sitios para mitigar ataques CSRF.

---

## 4. Métodos `encodeURIComponent()` y `decodeURIComponent()`

Los valores de las cookies no pueden contener ciertos caracteres reservados como punto y coma (`;`), comas (`,`), espacios en blanco o signos igual (`=`), ya que romperían la estructura del encabezado HTTP.

* **`encodeURIComponent(valor)`:** Codifica caracteres especiales reemplazándolos por secuencias de escape UTF-8 (por ejemplo, un espacio pasa a ser `%20`). Debe usarse siempre antes de guardar el nombre o el valor de una cookie.
* **`decodeURIComponent(valorCodificado)`:** Realiza el proceso inverso, restaurando el texto original legible al leer la cookie.

```javascript
const nombre = "María José; Admin";
const valorSeguro = encodeURIComponent(nombre);

// Guardar codificado
document.cookie = `usuario=${valorSeguro}; path=/`;

// Recuperar decodificado
console.log(decodeURIComponent(valorSeguro)); // "María José; Admin"
```

---

## 5. Leer una cookie

Al consultar `document.cookie`, JavaScript devuelve una única cadena de texto con **todas** las cookies accesibles separadas por `; ` (punto y coma seguido de un espacio):

```text
"usuario=JuanPerez; tema=oscuro; idioma=es"
```

Para obtener el valor de una cookie específica, es necesario dividir y buscar dentro de esa cadena:

```javascript
function obtenerCookie(nombre) {
  const nombreBuscado = encodeURIComponent(nombre) + "=";
  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    if (cookie.startsWith(nombreBuscado)) {
      const valor = cookie.substring(nombreBuscado.length);
      return decodeURIComponent(valor);
    }
  }
  return null;
}

// Ejemplo de uso
const temaActual = obtenerCookie("tema"); // "oscuro"
```

---

## 6. Modificar una cookie

En JavaScript no existe un método específico para editar una cookie; para modificarla se debe **sobrescribir** asignando una nueva cadena a `document.cookie` con el **mismo nombre** y los **mismos atributos `path` y `domain`** con los que fue creada originalmente.

```javascript
// Creación original
document.cookie = "tema=oscuro; max-age=86400; path=/";

// Modificación (mismo nombre y mismo path)
document.cookie = "tema=claro; max-age=86400; path=/";
```

> **Nota:** Si se cambia el `path` o el `domain` al intentar modificarla, el navegador creará una cookie duplicada en lugar de actualizar la existente.

---

## 7. Borrar una cookie

Para eliminar una cookie desde JavaScript, se debe sobrescribir asignándole una **fecha de expiración en el pasado** o un **`max-age` igual a `0`** (o negativo), manteniendo exactamente el mismo `path` y `domain` originales.

```javascript
// Opción 1: Usando max-age=0 (recomendada)
document.cookie = "tema=; max-age=0; path=/";

// Opción 2: Usando una fecha pasada en expires
document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```


---

## Atributos de Seguridad Críticos

| Atributo | Función | Recomendación |
| :--- | :--- | :--- |
| `Secure` | Solo se envía por HTTPS | Obligatorio en producción |
| `HttpOnly` | Inaccesible desde `document.cookie` (JS) | Obligatorio para tokens de sesión (previene XSS) |
| `SameSite=Lax` | Se envía en navegación normal, bloquea CSRF en POST externos | Valor recomendado por defecto |
| `SameSite=Strict` | Nunca se envía desde enlaces externos | Ideal para banca / acciones sensibles |
| `Path=/` | Rutas donde aplica la cookie | Usar `/` si aplica a toda la app |
| `Max-Age=3600` | Vida en segundos (preferible a `Expires`) | Define expiración explícita |

---

## API Moderna Asíncrona (`cookieStore`)

Los navegadores basados en Chromium ofrecen `cookieStore` como alternativa limpia con Promesas (evita parsear strings manualmente):

```js
if ('cookieStore' in window) {
  await cookieStore.set({ name: 'tema', value: 'oscuro', path: '/' });
  const cookie = await cookieStore.get('tema');
  console.log(cookie?.value);
}
```

---

## ❌ Errores Comunes con Cookies

1. **Guardar JWT o sesiones sensibles sin `HttpOnly`:** Cualquier script inyectado (XSS) podría leer `document.cookie` y robar la sesión.
2. **Olvidar `encodeURIComponent()` / `decodeURIComponent()`:** Caracteres como `;`, `=` o espacios corrompen el formato de `document.cookie`.
3. **Almacenar datos grandes en cookies:** El límite es ~4 KB por cookie y se envían automáticamente en **cada petición HTTP**, ralentizando la red. Para estado local grande usa `localStorage` o `IndexedDB`.
4. **Usar `SameSite=None` sin `Secure`:** Los navegadores modernos rechazan cookies `SameSite=None` si no llevan `Secure` sobre HTTPS.

---

## ✅ Buenas Prácticas

- Reserva las cookies para **sesión/autenticación** (`HttpOnly; Secure; SameSite=Lax`) emitidas desde el servidor (`Set-Cookie`).
- Para preferencias de interfaz (tema, idioma, carrito local), prefiere `localStorage`.
- Incluye siempre `path=/` al escribir o borrar una cookie desde JS para evitar duplicados por subruta.

---

## Hoja de Trucos (Cheatsheet) — Cookies

| Operación | Ejemplo |
| :--- | :--- |
| Crear / Actualizar | `document.cookie = "tema=dark; max-age=86400; path=/; SameSite=Lax"` |
| Borrar cookie | `document.cookie = "tema=; max-age=0; path=/"` |
| Leer cookie por nombre | `document.cookie.split('; ').find(c => c.startsWith('tema='))?.split('=')[1]` |
| Límite aproximado | ~4 KB por cookie (se envía en cada request HTTP al mismo dominio) |
