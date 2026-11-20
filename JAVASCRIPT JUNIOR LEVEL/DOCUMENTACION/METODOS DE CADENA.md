# 📘 Guía Definitiva de Métodos de Cadena en JavaScript (ES2023–ES2025)

Referencia técnica completa de los métodos de `String.prototype`, con casos reales, introducción a expresiones regulares y comparativas prácticas.

---

## 1. Catálogo de Métodos por Categoría

* **Acceso:** `.at()`, `.charAt()`, `.charCodeAt()`, `.codePointAt()`
* **Búsqueda:** `.includes()`, `.startsWith()`, `.endsWith()`, `.indexOf()`, `.lastIndexOf()`, `.search()`, `.match()`, `.matchAll()`
* **Extracción:** `.slice()`, `.substring()` *(evitar `.substr()`)*
* **Transformación y Limpieza:** `.toLowerCase()`, `.toUpperCase()`, `.trim()`, `.trimStart()`, `.trimEnd()`, `.normalize()`
* **Reemplazo:** `.replace()`, `.replaceAll()`
* **División, Unión y Formato:** `.split()`, `.concat()`, `.repeat()`, `.padStart()`, `.padEnd()`, `.localeCompare()`

---

## 2. Acceso y Búsqueda Avanzada

### `.at(indice)` (ES2022)
Permite acceder a caracteres con índices positivos o negativos (contando desde el final):
```javascript
const texto = "Frontend";
texto.at(0);   // "F"
texto.at(-1);  // "d"
```

### `.includes()`, `.startsWith()`, `.endsWith()`
Aceptan un segundo argumento opcional de posición para acotar la búsqueda:
```javascript
const archivo = "reporte-2025.pdf";
archivo.startsWith("reporte"); // true
archivo.endsWith(".pdf");      // true
archivo.includes("2025");      // true
```

---

## 3. Introducción a Expresiones Regulares (RegExp) con Strings

Muchos métodos de cadena aceptan **Expresiones Regulares** (`/patrón/banderas`) para búsquedas y reemplazos inteligentes:
* `g` (*global*): busca todas las coincidencias, no solo la primera.
* `i` (*insensitive*): ignora mayúsculas y minúsculas.

```javascript
const mensaje = "Pedido #1042 y Pedido #2099 listos";

// .match(regex): extrae coincidencias
const numeros = mensaje.match(/\d+/g); // ["1042", "2099"]

// .replace() con RegExp para limpiar múltiples espacios internos
const sucio = "Hola     mundo   JS";
const limpio = sucio.replace(/\s+/g, " "); // "Hola mundo JS"

// .search(regex): devuelve el índice de la primera coincidencia o -1
const posPrimerNumero = mensaje.search(/\d+/); // 8
```

> **Nota sobre `.replaceAll()`:** Si pasas una expresión regular a `.replaceAll()`, es obligatorio incluir la bandera `g` (`/patron/g`); de lo contrario lanzará un `TypeError`.

---

## 4. Limpieza, Relleno y División

### `.trim()`, `.trimStart()`, `.trimEnd()`
```javascript
const entrada = "   hola@web.dev   ";
entrada.trim();      // "hola@web.dev"
entrada.trimStart(); // "hola@web.dev   "
entrada.trimEnd();   // "   hola@web.dev"
```

### `.padStart()` y `.padEnd()`
Ideales para formatear relojes, códigos, facturas o enmascarar datos sensibles:
```javascript
const segundos = "9".padStart(2, "0");         // "09"
const ultimos4 = "4821";
const enmascarado = ultimos4.padStart(16, "•"); // "••••••••••••4821"
```

### `.split(separador, limite?)`
```javascript
const csv = "Ana,Luis,Sofía,Carlos";
csv.split(",", 2); // ["Ana", "Luis"] (el segundo parámetro limita el resultado)
```

---

## 5. Ordenación Alfabética Correcta: `.localeCompare()`

Comparar strings con `<` o `>` falla con acentos y ñ (`"á"` queda después de `"z"`). Usa `localeCompare()`:

```javascript
const nombres = ["Ángel", "Zoe", "Ana", "ñandú"];
const ordenados = nombres.toSorted((a, b) => a.localeCompare(b, "es"));
// ["Ana", "Ángel", "ñandú", "Zoe"]
```

---

## 6. Caso Real: Generador de *Slug* para URLs

```javascript
function crearSlug(titulo) {
    return titulo
        .trim()
        .toLowerCase()
        .normalize("NFD")                   // Separa letras de sus tildes
        .replace(/[\u0300-\u036f]/g, "")    // Elimina las tildes
        .replace(/[^a-z0-9\s-]/g, "")       // Elimina caracteres especiales
        .replace(/\s+/g, "-");              // Espacios a guiones
}

console.log(crearSlug("  Guía de JavaScript: ¡Nivel Pro!  "));
// "guia-de-javascript-nivel-pro"
```

---

## ⚠️ Errores Comunes

* **Olvidar que los strings son inmutables:** Llamar a `str.toUpperCase()` sin guardar el resultado en una variable no cambia `str`.
* **Usar `.substr()`:** Está obsoleto (*deprecated*). Usa `.slice(inicio, fin)`.
* **Usar `.replace(" ", "-")` esperando reemplazar todos los espacios:** `.replace()` con string solo reemplaza la **primera** coincidencia. Usa `.replaceAll(" ", "-")`.
* **Llamar métodos sobre `null` o `undefined`:** Usa `texto?.trim() ?? ""` si el dato puede venir vacío desde una API.

## ✅ Buenas Prácticas

* Encadena `.trim().toLowerCase()` antes de validar emails o comparar búsquedas de usuario.
* Usa `.localeCompare()` con el código de idioma (`"es"`) al ordenar listas visibles para el usuario.
* Usa `.slice()` en lugar de `.substring()` para aprovechar índices negativos de forma consistente con `Array.prototype.slice()`.

---

## Hoja de Trucos (Cheatsheet) — Métodos de Cadena

| Método | Uso Principal | Ejemplo |
| :--- | :--- | :--- |
| `.at(-1)` | Último carácter | `"JS".at(-1)` → `"S"` |
| `.includes(sub)` | ¿Contiene el texto? | `"Hola".includes("la")` → `true` |
| `.startsWith()` / `.endsWith()` | Validar prefijo o sufijo | `"app.js".endsWith(".js")` → `true` |
| `.trim()` / `.trimStart()` / `.trimEnd()` | Quitar espacios sobrantes | `"  a ".trim()` → `"a"` |
| `.slice(ini, fin)` | Extraer subcadena (acepta negativos) | `"Hola".slice(0, -1)` → `"Hol"` |
| `.replaceAll(a, b)` | Reemplazar todas las apariciones | `"a-b-c".replaceAll("-", "/")` → `"a/b/c"` |
| `.split(sep)` | Dividir string en Array | `"1,2,3".split(",")` → `["1","2","3"]` |
| `.padStart(n, ch)` | Rellenar al inicio | `"7".padStart(2, "0")` → `"07"` |
| `.match(regex)` | Extraer coincidencias con RegExp | `"a1b2".match(/\d/g)` → `["1", "2"]` |
| `.localeCompare(otro, "es")` | Ordenar respetando tildes y ñ | `"árbol".localeCompare("casa", "es")` |
