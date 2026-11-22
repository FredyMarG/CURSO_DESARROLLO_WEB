# Guía Maestra de JavaScript: Variables, Tipos y Motor de Ejecución

Esta guía cubre desde los fundamentos de declaración hasta el comportamiento interno del motor de JavaScript (V8/SpiderMonkey), la gestión de memoria y las prácticas modernas de ECMAScript (ES2023–ES2025).

---

## 1. Declaración de Variables: `var` vs `let` vs `const`

En JavaScript moderno existen tres palabras clave para declarar variables, pero solo dos deben usarse en código nuevo:

| Característica | `const` | `let` | `var` (Legado) |
| :--- | :--- | :--- | :--- |
| **Alcance (Scope)** | Bloque (`{}`) | Bloque (`{}`) | Función o Global |
| **Reasignable** | ❌ No | ✅ Sí | ✅ Sí |
| **Redeclarable en mismo scope** | ❌ No | ❌ No | ✅ Sí (peligroso) |
| **Inicialización obligatoria** | ✅ Sí | ❌ No (`undefined`) | ❌ No (`undefined`) |
| **Hoisting / TDZ** | Elevada en **TDZ** | Elevada en **TDZ** | Elevada e inicializada como `undefined` |
| **Recomendación** | ✅ **Usar por defecto** | ✅ Solo si el valor cambiará | ❌ **Evitar en código moderno** |

### ¿Por qué `const` no significa "valor inmutable"?
`const` impide **reasignar la referencia** de la variable, pero si almacena un objeto o un array, sus propiedades o elementos internos **sí pueden mutarse**:

```javascript
const usuario = { nombre: "Ana", rol: "Junior" };
usuario.rol = "Mid"; // ✅ Válido: mutamos una propiedad interna

// usuario = { nombre: "Luis" }; // ❌ TypeError: Assignment to constant variable.

// Si quieres inmutabilidad real en un objeto superficial:
const config = Object.freeze({ apiUrl: "https://api.ejemplo.com", timeout: 5000 });
```

---

## 2. El Motor de JS: Scope, Hoisting y Temporal Dead Zone (TDZ)

### Alcance (Scope)
Determina desde dónde es accesible una variable:
1. **Scope Global:** Declarada fuera de cualquier función o bloque. En módulos ES (`<script type="module">`), las variables de nivel superior quedan aisladas al módulo y no contaminan `window`.
2. **Scope de Función:** Las variables declaradas con `var`, `let` o `const` dentro de una función no existen fuera de ella.
3. **Scope de Bloque (`{}`):** Todo par de llaves (`if`, `for`, `while`, `{ ... }`) crea un ámbito aislado para `let` y `const`. `var` **ignora** los bloques `if`/`for` y se filtra al ámbito de función o global.

```javascript
if (true) {
    var filtrada = "Soy accesible fuera del if";
    let privada = "Solo existo dentro del if";
}
console.log(filtrada); // "Soy accesible fuera del if"
// console.log(privada); // ❌ ReferenceError: privada is not defined
```

### Hoisting y la Temporal Dead Zone (TDZ)
Antes de ejecutar el código línea por línea, el motor de JavaScript realiza una fase de creación/compilación donde registra las declaraciones en memoria (*hoisting*):

* **`var`:** Se registra e inicializa automáticamente con `undefined`. Por eso no lanza error si se lee antes, aunque devuelve `undefined` (fuente de bugs silenciosos).
* **`let` y `const`:** También se registran en memoria al inicio del bloque, pero **permanecen sin inicializar** dentro de la **Temporal Dead Zone (TDZ)** hasta que la ejecución alcanza exactamente su línea de declaración. Leerlas antes lanza un `ReferenceError`.
* **Declaraciones de función (`function saludar() {}`):** Se elevan por completo (nombre y cuerpo), permitiendo invocarlas antes de su definición.

```javascript
console.log(legado); // undefined (hoisting de var)
var legado = 10;

// console.log(moderna); // ❌ ReferenceError: Cannot access 'moderna' before initialization (TDZ)
let moderna = 20;
```

---

## 3. Tipos de Datos: Primitivos vs Referencia

JavaScript tiene **7 tipos primitivos** y **1 tipo de objeto** (referencia).

### A. Tipos Primitivos (Inmutables y pasados por valor)
1. **`string`**: Texto UTF-16. Soporta comillas simples `'...'`, dobles `"..."` y *Template Literals* `` `...` ``.
2. **`number`**: Números en formato IEEE 754 de 64 bits (enteros y decimales). Incluye `Infinity`, `-Infinity` y `NaN`.
3. **`bigint`**: Enteros de precisión arbitraria que superan `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). Se escriben con `n` al final: `9007199254740993n`.
4. **`boolean`**: Valores lógicos `true` o `false`.
5. **`undefined`**: Variable declarada sin valor asignado o parámetro no enviado.
6. **`null`**: Ausencia **intencional** de valor u objeto.
7. **`symbol`**: Identificador único e irrepetible, útil para claves privadas o metadatos en objetos (`Symbol("id")`).

### B. Tipos de Referencia (Objetos, Arrays, Funciones)
Los objetos (`{}`), arrays (`[]`), funciones, `Map`, `Set`, `Date`, etc., se almacenan en el *Heap* y la variable guarda una **referencia** (dirección en memoria).

```javascript
// Primitivos: copia por VALOR (independientes)
let a = 10;
let b = a;
b = 20;
console.log(a); // 10

// Referencia: copia de DIRECCIÓN (apuntan al mismo objeto)
const perfil1 = { nombre: "Carlos" };
const perfil2 = perfil1;
perfil2.nombre = "Lucía";
console.log(perfil1.nombre); // "Lucía" (¡ambos cambiaron!)

// Copia profunda moderna (ES2022+): structuredClone()
const copiaReal = structuredClone(perfil1);
copiaReal.nombre = "Marta";
console.log(perfil1.nombre); // "Lucía" (independiente)
```

---

## 4. El operador `typeof` y sus peculiaridades

El operador `typeof` devuelve un string indicando el tipo del operando, pero tiene casos históricos famosos que todo desarrollador debe conocer:

```javascript
typeof "hola"       // "string"
typeof 42           // "number"
typeof NaN          // "number"  ⚠️ NaN es técnicamente de tipo number
typeof 100n         // "bigint"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof Symbol()     // "symbol"
typeof (() => {})   // "function" (subtipo especial de objeto)
typeof {}           // "object"
typeof []           // "object"   ⚠️ Un array devuelve "object"
typeof null         // "object"   ⚠️ Error histórico de JS desde 1995
```

### Cómo comprobar tipos de forma segura:
* **¿Es `null`?** → `valor === null`
* **¿Es un Array?** → `Array.isArray(valor)`
* **¿Es `NaN` real?** → `Number.isNaN(valor)` (evita el `isNaN()` global que convierte strings a número primero).
* **¿Es un número finito válido?** → `Number.isFinite(valor)`

---

## 5. Ejemplo Práctico: Conversión Segura de Entradas

Cuando recibimos datos de un `<input>` del DOM (o de un `prompt()`), siempre llegan como `string`. Nunca operes matemáticamente sin validar y convertir antes:

```javascript
"use strict";

function calcularCuadrado(entradaTexto) {
    if (entradaTexto === null || entradaTexto.trim() === "") {
        return { ok: false, error: "Entrada vacía o cancelada." };
    }

    const numero = Number(entradaTexto);

    if (Number.isNaN(numero) || !Number.isFinite(numero)) {
        return { ok: false, error: `"${entradaTexto}" no es un número válido.` };
    }

    return { ok: true, resultado: numero ** 2 };
}

console.log(calcularCuadrado("8"));    // { ok: true, resultado: 64 }
console.log(calcularCuadrado("abc"));  // { ok: false, error: '"abc" no es un número válido.' }
```

---

## ⚠️ Errores Comunes

* **Usar `var` por costumbre:** Provoca fugas de variables fuera de bloques `if`/`for` y colisiones silenciosas al redeclarar.
* **Confiar en `typeof x === "object"` para detectar objetos planos:** Fallará si `x` es `null` o un `Array` (`[]`). Combina con `x !== null && !Array.isArray(x)`.
* **Clonar objetos con `=`:** Asignar `const b = a` no clona el objeto; si modificas `b`, modificas `a`. Usa `{ ...a }` (copia superficial) o `structuredClone(a)` (copia profunda).
* **Usar `isNaN("hola")` esperando `false`:** El `isNaN()` global devuelve `true` para `"hola"`. Usa `Number.isNaN()`.

## ✅ Buenas Prácticas

* Declara siempre con `const` y cambia a `let` únicamente cuando necesites reasignar la variable (contadores, acumuladores, estados).
* Usa `"use strict";` o módulos ES (`type="module"`), que activan el modo estricto automáticamente y evitan crear variables globales por accidente.
* Nombra las variables en `camelCase` descriptivo (`precioTotal`, `esAdmin`) y las constantes globales inmutables en `UPPER_SNAKE_CASE` (`MAX_INTENTOS`).
* Prefiere `undefined` para "no asignado aún" y `null` para "vacío explícito".

---

## Hoja de Trucos (Cheatsheet) — Variables y Tipos

| Concepto / Herramienta | Sintaxis / Ejemplo | Uso / Comportamiento |
| :--- | :--- | :--- |
| **Constante** | `const PI = 3.1416;` | Scope de bloque; no reasignable (usar por defecto) |
| **Variable mutable** | `let contador = 0;` | Scope de bloque; permite reasignación |
| **BigInt** | `const id = 9007199254740995n;` | Enteros arbitrariamente grandes |
| **Symbol** | `const clave = Symbol("meta");` | Identificador único para propiedades |
| **Comprobar Array** | `Array.isArray(lista)` | Devuelve `true` solo si es un Array |
| **Comprobar NaN** | `Number.isNaN(valor)` | Verifica estrictamente si el valor es `NaN` |
| **Clonado profundo** | `structuredClone(objeto)` | Copia independiente de objetos y arrays anidados |
| **Conversión numérica** | `Number("42")` / `Number.parseInt("42px", 10)` | Convierte texto a número de forma explícita |
