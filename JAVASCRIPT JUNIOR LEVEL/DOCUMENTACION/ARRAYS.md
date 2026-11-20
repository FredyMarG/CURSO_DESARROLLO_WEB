# 📦 Guía Completa de Arrays en JavaScript (Fundamentos y ES2023+)

Un **Array** es una estructura de datos ordenada que permite almacenar múltiples valores bajo una sola variable. En JavaScript los arrays son dinámicos (su tamaño crece o se encoge automáticamente) y pueden contener cualquier tipo de dato.

---

## 1. Creación y Acceso a Elementos

```javascript
// Forma estándar (Array Literal)
const lenguajes = ["HTML", "CSS", "JavaScript", "TypeScript"];

// Acceso tradicional por índice (base 0)
console.log(lenguajes[0]);                    // "HTML"
console.log(lenguajes[lenguajes.length - 1]); // "TypeScript"

// Acceso moderno con .at() (ES2022) — soporta índices negativos
console.log(lenguajes.at(0));   // "HTML"
console.log(lenguajes.at(-1));  // "TypeScript" (último elemento)
console.log(lenguajes.at(-2));  // "JavaScript" (penúltimo)
```

### Creación avanzada con `Array.from()`
Útil para convertir iterables (`string`, `Set`, `NodeList`) o generar secuencias:

```javascript
const letras = Array.from("Hola"); // ["H", "o", "l", "a"]
const rango = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
```

---

## 2. Destructuring y Operador Spread (`...`)

### Destructuring de Arrays (ES6)
Extrae elementos por posición en variables limpias:

```javascript
const coordenadas = [19.4326, -99.1332, 2240];
const [latitud, longitud, altitud = 0] = coordenadas;

// Saltar elementos o capturar el resto con Rest (...)
const [primero, , ...resto] = ["A", "B", "C", "D"];
// primero = "A", resto = ["C", "D"]
```

### Operador Spread (`...`)
Expande los elementos de un array. Es fundamental para **copiar** o **combinar** arrays sin mutar los originales:

```javascript
const base = [1, 2, 3];
const copiaSuperficial = [...base];         // [1, 2, 3] (nuevo array)
const combinado = [0, ...base, 4, 5];       // [0, 1, 2, 3, 4, 5]
```

---

## 3. Mutabilidad vs Inmutabilidad

Comprender qué métodos modifican el array original y cuáles devuelven uno nuevo evita errores difíciles de rastrear (especialmente en frameworks como React o Vue).

### A. Métodos Mutables (Modifican el array original)
| Método | Descripción | Retorno |
| :--- | :--- | :--- |
| `.push(x)` | Añade al **final** | Nueva longitud |
| `.pop()` | Elimina del **final** | Elemento eliminado |
| `.unshift(x)` | Añade al **inicio** | Nueva longitud |
| `.shift()` | Elimina del **inicio** | Elemento eliminado |
| `.splice(i, n, ...items)` | Elimina/inserta en cualquier posición | Array con eliminados |
| `.reverse()` | Invierte el orden en su lugar | El mismo array |
| `.sort(fn)` | Ordena en su lugar | El mismo array |

### B. Alternativas Inmutables (Devuelven un array nuevo)
Desde **ES2023**, JavaScript incluye versiones inmutables de los métodos clásicos de ordenamiento y reemplazo:

| Método Inmutable | Equivalente Mutable | ¿Qué hace? |
| :--- | :--- | :--- |
| `.toSorted(fn)` | `.sort(fn)` | Devuelve una copia ordenada sin tocar el original |
| `.toReversed()` | `.reverse()` | Devuelve una copia invertida |
| `.toSpliced(i, n, ...items)` | `.splice(...)` | Devuelve una copia con elementos eliminados/insertados |
| `.with(indice, valor)` | `arr[i] = valor` | Devuelve una copia reemplazando un índice (soporta negativos) |
| `.slice(inicio, fin)` | — | Extrae una porción en un nuevo array |
| `.concat(...otros)` | — | Une arrays en uno nuevo |

```javascript
const originales = [30, 10, 20];

const ordenados = originales.toSorted((a, b) => a - b);
console.log(originales); // [30, 10, 20] (intacto)
console.log(ordenados);  // [10, 20, 30]

const actualizado = originales.with(-1, 99); // [30, 10, 99]
```

---

## 4. Comprobación de Tipos: `Array.isArray()`

Como `typeof []` devuelve `"object"`, la única forma estándar de verificar si un valor es un array es:

```javascript
Array.isArray([1, 2, 3]); // true
Array.isArray("hola");    // false
Array.isArray(null);      // false
```

---

## ⚠️ Errores Comunes

* **Usar `.sort()` sin función comparadora en números:** `[10, 2, 1].sort()` devuelve `[1, 10, 2]` porque convierte los elementos a texto y ordena alfabéticamente. Usa `(a, b) => a - b`.
* **Copiar arrays con `=`:** `const copia = original` no copia el array; ambas variables apuntan al mismo espacio en memoria. Usa `[...original]`.
* **Comparar arrays con `===`:** `[1, 2] === [1, 2]` es `false` porque compara referencias en memoria, no contenido.
* **Dejar huecos (*sparse arrays*):** Asignar `arr[10] = "x"` en un array de 2 elementos crea 8 espacios vacíos (`empty`).

## ✅ Buenas Prácticas

* Declara los arrays con `const` para evitar reasignar la variable por accidente.
* Prefiere métodos inmutables (`.map()`, `.filter()`, `.toSorted()`, `[...arr]`) para no producir efectos secundarios inesperados.
* Usa `.at(-1)` en lugar de `arr[arr.length - 1]` para acceder al último elemento de forma más limpia.

---

## Hoja de Trucos (Cheatsheet) — Arrays

| Operación | Sintaxis Moderna | Resultado / Uso |
| :--- | :--- | :--- |
| **Último elemento** | `arr.at(-1)` | Lee el final sin calcular `length - 1` |
| **Clonar array** | `[...arr]` | Copia superficial independiente |
| **Agregar sin mutar** | `[...arr, nuevo]` | Nuevo array con elemento al final |
| **Ordenar sin mutar** | `arr.toSorted((a, b) => a - b)` | Nuevo array ordenado numéricamente (ES2023) |
| **Reemplazar índice** | `arr.with(1, "nuevo")` | Nuevo array con el índice actualizado (ES2023) |
| **Verificar si es Array** | `Array.isArray(valor)` | `true` o `false` |
| **Destructuring** | `const [a, b, ...resto] = arr;` | Extrae posiciones en variables |
