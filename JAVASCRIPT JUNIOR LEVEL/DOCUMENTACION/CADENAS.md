# 🔤 Guía Completa de Cadenas de Texto (Strings)

En JavaScript, una cadena de texto (`string`) es una secuencia inmutable de caracteres UTF-16. Comprender su **inmutabilidad** es fundamental: ningún método modifica el string original; todos devuelven un **nuevo string**.

---

## 1. Creación y Acceso a Caracteres

```javascript
const simple = 'Comillas simples';
const doble = "Comillas dobles";
const plantilla = `Template Literal: ${simple}`;

// Acceso por índice (base 0) o con .at() (ES2022)
const palabra = "JavaScript";
console.log(palabra.length);  // 10
console.log(palabra[0]);      // "J"
console.log(palabra.at(-1));  // "t" (último carácter)
console.log(palabra.at(-6));  // "S"

// ❌ Error común: los strings son inmutables
palabra[0] = "j"; // No hace nada (en modo estricto lanza TypeError)
```

---

## 2. Métodos de Búsqueda y Validación

| Método | ¿Qué devuelve? | Ejemplo |
| :--- | :--- | :--- |
| `.includes(sub, pos?)` | `true` si contiene el texto | `"Hola mundo".includes("mundo")` → `true` |
| `.startsWith(sub)` | `true` si empieza con el texto | `"https://web.dev".startsWith("https")` → `true` |
| `.endsWith(sub)` | `true` si termina con el texto | `"foto.webp".endsWith(".webp")` → `true` |
| `.indexOf(sub)` | Índice de la primera coincidencia o `-1` | `"banana".indexOf("na")` → `2` |
| `.lastIndexOf(sub)` | Índice de la última coincidencia o `-1` | `"banana".lastIndexOf("a")` → `5` |

---

## 3. Métodos de Limpieza y Transformación

| Método | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `.toLowerCase()` / `.toUpperCase()` | Convierte a minúsculas / mayúsculas | `"JS".toLowerCase()` → `"js"` |
| `.trim()` | Elimina espacios en ambos extremos | `"  hola  ".trim()` → `"hola"` |
| `.trimStart()` / `.trimEnd()` | Elimina espacios solo al inicio o al final | `"  hola".trimStart()` → `"hola"` |
| `.replace(buscar, nuevo)` | Reemplaza la **primera** coincidencia (o RegExp) | `"a-b-c".replace("-", "_")` → `"a_b-c"` |
| `.replaceAll(buscar, nuevo)` | Reemplaza **todas** las coincidencias (ES2021) | `"a-b-c".replaceAll("-", "_")` → `"a_b_c"` |
| `.repeat(n)` | Repite la cadena `n` veces | `"=".repeat(5)` → `"====="` |

---

## 4. Extracción, División y Relleno

### `.slice(inicio, fin?)` vs `.substring(inicio, fin?)`
* **`.slice(inicio, fin)` (Recomendado):** Acepta índices negativos para contar desde el final.
* **`.substring(inicio, fin)`:** Convierte los negativos a `0` e intercambia los índices si `inicio > fin`.

```javascript
const codigo = "JS-2025-PRO";
console.log(codigo.slice(0, 2));   // "JS"
console.log(codigo.slice(-3));     // "PRO"
console.log(codigo.slice(3, -4));  // "2025"
```

### `.split(separador)` y Padding (`.padStart()` / `.padEnd()`)
```javascript
// Dividir en array
const tags = "html, css, js".split(", "); // ["html", "css", "js"]

// Rellenar hasta alcanzar longitud fija (ideal para fechas, relojes o tarjetas)
const mes = "7".padStart(2, "0");         // "07"
const tarjeta = "4242".padStart(16, "*"); // "************4242"
```

---

## 5. Caso Práctico: Normalización de Entrada de Usuario

```javascript
function normalizarEmail(entrada) {
    if (typeof entrada !== "string") return "";
    return entrada.trim().toLowerCase();
}

console.log(normalizarEmail("  Usuario.Dev@Correo.COM  "));
// "usuario.dev@correo.com"
```

---

## ⚠️ Errores Comunes

* **Asumir que los métodos mutan la variable:** Escribir `texto.trim();` sin reasignar o guardar el retorno no modifica `texto`.
* **Comparar textos sin normalizar mayúsculas/espacios:** `"Admin" === "admin"` es `false`. Normaliza con `.trim().toLowerCase()`.
* **Usar `.substr()`:** Está marcado como obsoleto (*deprecated*) en el estándar; usa `.slice()`.

## ✅ Buenas Prácticas

* Usa **Template Literals** (`` `...` ``) para interpolar variables y textos multilínea.
* Usa `.includes()`, `.startsWith()` y `.endsWith()` en lugar de `.indexOf() !== -1`.
* Usa `.at(-1)` o `.slice(-n)` para trabajar desde el final del string de forma legible.

---

## Hoja de Trucos (Cheatsheet) — Cadenas de Texto

| Operación | Método / Sintaxis | Ejemplo |
| :--- | :--- | :--- |
| **Longitud** | `.length` | `"Hola".length` → `4` |
| **Último carácter** | `.at(-1)` | `"Hola".at(-1)` → `"a"` |
| **Buscar subcadena** | `.includes("...")` | `"JavaScript".includes("Script")` → `true` |
| **Limpiar espacios** | `.trim()` | `"  ok  ".trim()` → `"ok"` |
| **Cortar subcadena** | `.slice(ini, fin)` | `"abcdef".slice(1, -1)` → `"bcde"` |
| **Convertir a Array** | `.split(sep)` | `"a,b,c".split(",")` → `["a", "b", "c"]` |
| **Reemplazar todo** | `.replaceAll(a, b)` | `"1 2 3".replaceAll(" ", "-")` → `"1-2-3"` |
| **Rellenar al inicio** | `.padStart(len, char)` | `"5".padStart(3, "0")` → `"005"` |
