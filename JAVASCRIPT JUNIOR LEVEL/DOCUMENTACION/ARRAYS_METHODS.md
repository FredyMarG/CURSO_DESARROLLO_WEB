# 📘 Guía Definitiva de Métodos de Arrays en JavaScript (ES2023–ES2025)

Dominar los métodos funcionales de arrays te permite escribir código declarativo, legible y libre de bucles manuales propensos a errores.

---

## 1. Clasificación Rápida: Mutables vs Inmutables

| Categoría | Métodos | ¿Modifican el array original? |
| :--- | :--- | :--- |
| **Transformación y Filtrado** | `.map()`, `.filter()`, `.flat()`, `.flatMap()`, `.slice()`, `.concat()` | ❌ No (devuelven array nuevo) |
| **Búsqueda y Validación** | `.find()`, `.findLast()`, `.findIndex()`, `.findLastIndex()`, `.some()`, `.every()`, `.includes()`, `.indexOf()` | ❌ No |
| **Reducción** | `.reduce()`, `.reduceRight()`, `.join()` | ❌ No |
| **Inmutables ES2023** | `.toSorted()`, `.toReversed()`, `.toSpliced()`, `.with()` | ❌ No (devuelven copia modificada) |
| **Mutables (Efecto directo)** | `.push()`, `.pop()`, `.shift()`, `.unshift()`, `.splice()`, `.sort()`, `.reverse()`, `.fill()` | ✅ Sí (alteran el original) |

---

## 2. Recorrido y Transformación

### `.forEach(callback)`
Ejecuta una función por cada elemento. **Siempre devuelve `undefined`**, por lo que solo sirve para efectos secundarios (imprimir, guardar, modificar el DOM).

```javascript
const tareas = ["Estudiar", "Practicar", "Descansar"];
tareas.forEach((tarea, indice) => {
    console.log(`${indice + 1}. ${tarea}`);
});
```

### `.map(callback)`
Transforma cada elemento y devuelve un **nuevo array de la misma longitud**.

```javascript
const precios = [100, 200, 300];
const conIVA = precios.map(precio => Number((precio * 1.16).toFixed(2)));
// [116, 232, 348]
```

### `.filter(callback)`
Devuelve un **nuevo array** únicamente con los elementos cuya condición retorne `true`.

```javascript
const usuarios = [
    { nombre: "Ana", activo: true },
    { nombre: "Luis", activo: false },
    { nombre: "Sofía", activo: true },
];
const activos = usuarios.filter(u => u.activo);
// [{ nombre: "Ana", activo: true }, { nombre: "Sofía", activo: true }]
```

### `.flat(profundidad)` y `.flatMap(callback)`
* `.flat(nivel)` aplana arrays anidados (por defecto 1 nivel; usa `Infinity` para aplanar todo).
* `.flatMap()` ejecuta primero `.map()` y luego aplana 1 nivel automáticamente (más rápido que llamarlos por separado).

```javascript
const anidado = [1, [2, 3], [4, [5]]];
anidado.flat(2); // [1, 2, 3, 4, 5]

const frases = ["Hola mundo", "JS moderno"];
const palabras = frases.flatMap(frase => frase.split(" "));
// ["Hola", "mundo", "JS", "moderno"]
```

---

## 3. Búsqueda y Validación

| Método | ¿Qué devuelve si encuentra? | ¿Si NO encuentra? |
| :--- | :--- | :--- |
| `.find(fn)` | El **primer** elemento que cumple | `undefined` |
| `.findLast(fn)` *(ES2023)* | El **último** elemento que cumple (busca desde el final) | `undefined` |
| `.findIndex(fn)` | El índice del primer elemento que cumple | `-1` |
| `.some(fn)` | `true` si **al menos uno** cumple (se detiene al hallarlo) | `false` |
| `.every(fn)` | `true` si **todos** cumplen (se detiene si uno falla) | `false` |
| `.includes(valor)` | `true` si el valor existe (usa igualdad `SameValueZero`) | `false` |

```javascript
const pedidos = [
    { id: 1, estado: "pendiente", total: 50 },
    { id: 2, estado: "pagado", total: 120 },
    { id: 3, estado: "pagado", total: 300 },
];

const ultimoPagado = pedidos.findLast(p => p.estado === "pagado"); // { id: 3, ... }
const hayGrandes = pedidos.some(p => p.total > 250);               // true
const todosPagados = pedidos.every(p => p.estado === "pagado");    // false
```

---

## 4. Reducción: `.reduce(callback, valorInicial)`

Acumula todos los elementos del array en un único resultado (un número, un string, un objeto agrupado, etc.).

```javascript
const carrito = [
    { producto: "Teclado", precio: 45, cantidad: 1 },
    { producto: "Mouse", precio: 25, cantidad: 2 },
];

const total = carrito.reduce((acumulador, item) => {
    return acumulador + (item.precio * item.cantidad);
}, 0); // 0 es el valor inicial

console.log(total); // 95
```

> **Consejo:** Pasa **siempre** el `valorInicial` (segundo argumento) a `.reduce()` para evitar errores cuando el array esté vacío.

---

## 5. Métodos Inmutables Modernos (ES2023)

Antes de ES2023, `.sort()`, `.reverse()` y `.splice()` mutaban el array original obligando a clonar con `[...arr]`. Hoy tenemos equivalentes seguros:

```javascript
const puntajes = [85, 40, 100, 70];

// Ordenar de mayor a menor sin mutar 'puntajes'
const ranking = puntajes.toSorted((a, b) => b - a); // [100, 85, 70, 40]

// Invertir sin mutar
const invertido = puntajes.toReversed();            // [70, 100, 40, 85]

// Reemplazar un elemento en el índice 1 sin mutar
const corregido = puntajes.with(1, 60);             // [85, 60, 100, 70]

// Eliminar 1 elemento desde el índice 2 e insertar 95 sin mutar
const editado = puntajes.toSpliced(2, 1, 95);       // [85, 40, 95, 70]
```

---

## 6. Caso Real: Encadenamiento (*Method Chaining*)

```javascript
const productos = [
    { nombre: "Monitor", categoria: "tech", precio: 300, stock: 4 },
    { nombre: "Silla", categoria: "oficina", precio: 180, stock: 0 },
    { nombre: "Teclado", categoria: "tech", precio: 80, stock: 12 },
];

const resumenTech = productos
    .filter(p => p.categoria === "tech" && p.stock > 0)
    .toSorted((a, b) => a.precio - b.precio)
    .map(p => `${p.nombre}: $${p.precio}`);

console.log(resumenTech); // ["Teclado: $80", "Monitor: $300"]
```

---

## ⚠️ Errores Comunes

* **Olvidar el `return` en `.map()` o `.filter()` con llaves `{}`:** `arr.map(x => { x * 2 })` devuelve `[undefined, undefined]`. Si usas llaves, escribe `return`.
* **Usar `.forEach()` esperando un nuevo array:** `.forEach()` siempre devuelve `undefined`. Usa `.map()`.
* **Usar `.sort()` directamente sobre un array de estado:** Muta el array original; prefiere `.toSorted()`.
* **No pasar valor inicial a `.reduce()`:** En un array vacío `[]`, `[].reduce((a, b) => a + b)` lanza `TypeError`.

## ✅ Buenas Prácticas

* Elige el método con la intención semántica exacta: `some` para existencia, `find` para obtener un ítem, `filter` para subconjuntos, `map` para transformar 1 a 1.
* En encadenamientos largos, intenta filtrar primero (`.filter()`) para reducir la cantidad de elementos antes de transformar (`.map()`).
* Si necesitas detener una iteración anticipadamente por rendimiento, usa `for...of` con `break` o `.some()` / `.find()` en lugar de `.forEach()` (ya que `forEach` no soporta `break`).

---

## Hoja de Trucos (Cheatsheet) — Métodos de Arrays

| Necesito... | Método recomendado | Ejemplo |
| :--- | :--- | :--- |
| Transformar cada elemento | `.map()` | `nums.map(n => n * 2)` |
| Filtrar elementos | `.filter()` | `nums.filter(n => n > 10)` |
| Buscar primer / último match | `.find()` / `.findLast()` | `users.find(u => u.id === 5)` |
| Saber si al menos uno / todos cumplen | `.some()` / `.every()` | `nums.every(n => n > 0)` |
| Sumar o agrupar en un valor | `.reduce()` | `nums.reduce((a, b) => a + b, 0)` |
| Ordenar sin mutar (ES2023) | `.toSorted()` | `nums.toSorted((a, b) => a - b)` |
| Invertir sin mutar (ES2023) | `.toReversed()` | `nums.toReversed()` |
| Reemplazar índice sin mutar (ES2023) | `.with()` | `arr.with(0, "nuevo")` |
| Aplanar y mapear | `.flatMap()` | `arr.flatMap(x => [x, x * 2])` |
