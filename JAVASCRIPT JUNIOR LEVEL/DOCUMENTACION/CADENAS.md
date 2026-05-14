# 🔤 GUÍA DE MÉTODOS DE CADENAS (STRINGS)

En JavaScript, los strings son **inmutables**. Esto significa que los métodos de cadena **NUNCA** modifican el texto original; siempre devuelven un **nuevo string**.

---

# 🔎 1. Métodos de Búsqueda

| Método | ¿Qué hace? |
| :--- | :--- |
| `.includes(texto)` | Devuelve `true` si el texto está contenido. |
| `.startsWith(texto)` | Devuelve `true` si empieza con ese texto. |
| `.endsWith(texto)` | Devuelve `true` si termina con ese texto. |
| `.indexOf(texto)` | Devuelve la posición de la primera aparición (-1 si no existe). |
| `.lastIndexOf(texto)` | Devuelve la posición de la última aparición. |

---

# ✂️ 2. Métodos de Transformación

| Método | ¿Qué hace? |
| :--- | :--- |
| `.toLowerCase()` | Convierte todo a minúsculas. |
| `.toUpperCase()` | Convierte todo a mayúsculas. |
| `.trim()` | Elimina espacios al inicio y al final. |
| `.repeat(n)` | Repite el string *n* veces. |
| `.replace(v, n)` | Reemplaza la primera aparición de *v* por *n*. |
| `.replaceAll(v, n)` | Reemplaza todas las apariciones. |

---

# 📏 3. Métodos de Selección y Corte

| Método | ¿Qué hace? |
| :--- | :--- |
| `.split(sep)` | Divide el string en un **Array** usando el separador. |
| `.substring(i, f)` | Extrae caracteres desde el índice *i* hasta el *f*. |
| `.slice(i, f)` | Similar a substring, pero acepta índices negativos (cuenta desde el final). |

---

# 🏗️ 4. Métodos de Relleno (Padding)

| Método | ¿Qué hace? |
| :--- | :--- |
| `.padStart(l, t)` | Rellena al **inicio** con *t* hasta alcanzar la longitud *l*. |
| `.padEnd(l, t)` | Rellena al **final** con *t* hasta alcanzar la longitud *l*. |

---

# 🚀 Ejemplo Pro: Limpieza de Datos

```js
let emailSucio = "  CONTACTO@GMAIL.COM   ";
let emailLimpio = emailSucio.trim().toLowerCase(); 
console.log(emailLimpio); // "contacto@gmail.com"
```

---

# 🧠 Diferencia: slice vs substring

* `slice(0, -1)`: Funciona. Quita el último carácter.
* `substring(0, -1)`: NO funciona con negativos (los trata como 0).

---

# ⚠️ Errores Comunes

❌ Intentar cambiar un carácter directamente: `cadena[0] = "A"` (No funciona en JS).
❌ Olvidar que los métodos devuelven un valor nuevo: `nombre.toUpperCase()` por sí solo no cambia la variable `nombre`.

---

# ✅ Buenas Prácticas

✔️ Usa `includes()` en lugar de `indexOf() !== -1` para mayor claridad.
✔️ Usa **Template Literals** (backticks `` ` ``) para concatenar variables en lugar del método `.concat()`.

---

> **Dato Curioso:** El método `.split("")` (con string vacío) se usa mucho para convertir una palabra en un array de letras y poder usar métodos de array como `.reverse()`. 🔄
