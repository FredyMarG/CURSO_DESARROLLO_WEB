# 📘 GUÍA DEFINITIVA DE MÉTODOS DE ARRAYS EN JAVASCRIPT

## 🔥 NIVEL DIOS PRO EXTREMO

---

# 📌 1. LISTA COMPLETA DE MÉTODOS DE ARRAYS

## 🔁 RECORRIDO

* `forEach()`
* `map()`
* `filter()`
* `find()`
* `findIndex()`
* `some()`
* `every()`

---

## 📦 MODIFICACIÓN

* `push()`
* `pop()`
* `shift()`
* `unshift()`
* `splice()`
* `reverse()`
* `sort()`
* `fill()`
* `copyWithin()`

---

## 🔍 BÚSQUEDA

* `includes()`
* `indexOf()`
* `lastIndexOf()`

---

## 🔄 TRANSFORMACIÓN

* `join()`
* `slice()`
* `concat()`
* `flat()`
* `flatMap()`

---

## 🧪 OTROS

* `reduce()`
* `reduceRight()`
* `Array.from()`
* `Array.isArray()`

---

# 🧠 2. EXPLICACIÓN UNO A UNO

---

# 🔁 forEach()

## 📌 Función

👉 Recorrer un array sin retornar nada

```js
// FUNCIÓN: Mostrar lista de productos
let productos = ["zapatos", "camisa", "gorra"];

productos.forEach(p => console.log(p));
```

---

# 🔁 map()

## 📌 Función

👉 Crear un nuevo array transformando datos

```js
// FUNCIÓN: Aplicar descuento a precios
let precios = [100, 200, 300];

let conDescuento = precios.map(p => p * 0.9);
```

🧠 DIAGRAMA:

```text
[100,200,300] → map → [90,180,270]
```

---

# 🔁 filter()

## 📌 Función

👉 Filtrar elementos que cumplen condición

```js
// FUNCIÓN: Obtener mayores de edad 👤
let edades = [12, 18, 25, 15];

let mayores = edades.filter(e => e >= 18);
```

---

# 🔁 find()

## 📌 Función

👉 Obtener el primer elemento que cumpla condición

```js
// FUNCIÓN: Encontrar primer producto caro
let precios = [50, 200, 30];

precios.find(p => p > 100);
```

---

# 🔁 findIndex()

## 📌 Función

👉 Obtener posición del elemento encontrado

```js
// FUNCIÓN: Encontrar índice
[10,20,30].findIndex(n => n === 20);
```

---

# 🔁 some()

## 📌 Función

👉 Verificar si al menos uno cumple

```js
// FUNCIÓN: Verificar si hay menores
[10, 20, 30].some(n => n < 18);
```

---

# 🔁 every()

## 📌 Función

👉 Verificar si todos cumplen

```js
// FUNCIÓN: Validar todos positivos
[1,2,3].every(n => n > 0);
```

---

# 📦 push()

## 📌 Función

👉 Agregar al final

```js
// FUNCIÓN: Agregar producto al carrito 🛒
let carrito = ["camisa"];
carrito.push("zapatos");
```

---

# 📦 pop()

## 📌 Función

👉 Eliminar último elemento

```js
// FUNCIÓN: Quitar último producto
carrito.pop();
```

---

# 📦 shift()

## 📌 Función

👉 Eliminar primero

```js
// FUNCIÓN: Sacar primer cliente
clientes.shift();
```

---

# 📦 unshift()

## 📌 Función

👉 Agregar al inicio

```js
// FUNCIÓN: Prioridad cliente VIP
clientes.unshift("VIP");
```

---

# 📦 splice()

## 📌 Función

👉 Agregar, eliminar o reemplazar

```js
// FUNCIÓN: Modificar lista
let nums = [1,2,3];
nums.splice(1,1); // elimina 2
```

---

# 📦 reverse()

## 📌 Función

👉 Invertir array

```js
// FUNCIÓN: Cambiar orden
[1,2,3].reverse();
```

---

# 📦 sort()

## 📌 Función

👉 Ordenar elementos

```js
// FUNCIÓN: Ordenar precios
[100, 50, 200].sort((a,b)=>a-b);
```

---

# 🔍 includes()

## 📌 Función

👉 Verificar si existe un elemento

```js
// FUNCIÓN: Verificar producto
["pan","leche"].includes("pan");
```

---

# 🔍 indexOf()

## 📌 Función

👉 Obtener posición

```js
// FUNCIÓN: Buscar posición
["a","b","c"].indexOf("b");
```

---

# 🔄 join()

## 📌 Función

👉 Convertir array a string

```js
// FUNCIÓN: Mostrar lista
["a","b"].join("-");
```

---

# 🔄 slice()

## 📌 Función

👉 Copiar parte del array

```js
// FUNCIÓN: Obtener subconjunto
[1,2,3,4].slice(1,3);
```

---

# 🔄 concat()

## 📌 Función

👉 Unir arrays

```js
// FUNCIÓN: Unir listas
[1,2].concat([3,4]);
```

---

# 🔄 flat()

## 📌 Función

👉 Aplanar arrays

```js
// FUNCIÓN: Eliminar niveles
[1,[2,3]].flat();
```

---

# 🔄 flatMap()

## 📌 Función

👉 map + flat

```js
// FUNCIÓN: Transformar y aplanar
[1,2].flatMap(n => [n, n*2]);
```

---

# 🧪 reduce()

## 📌 Función

👉 Reducir a un solo valor

```js
// FUNCIÓN: Sumar valores
[1,2,3].reduce((acc, n) => acc + n, 0);
```

🧠 DIAGRAMA:

```text
0 → +1 → 1 → +2 → 3 → +3 → 6
```

---

# 🧪 Array.from()

## 📌 Función

👉 Crear array desde iterable

```js
// FUNCIÓN: Convertir string a array
Array.from("hola");
```

---

# 🧪 Array.isArray()

## 📌 Función

👉 Verificar si es array

```js
// FUNCIÓN: Validación
Array.isArray([1,2]);
```

---

# 🧭 3. CUÁNDO USAR Y CUÁNDO NO

## ✅ USAR

* map → transformar
* filter → filtrar
* reduce → cálculos

## ❌ NO USAR

* forEach si necesitas retornar → usa map
* sort sin función → puede fallar

---

# ⚔️ 4. COMPARACIONES

## map vs forEach

| Método  | Retorna | Uso         |
| ------- | ------- | ----------- |
| map     | ✅       | transformar |
| forEach | ❌       | recorrer    |

---

# 🧪 5. CASO REAL

## 🛒 TIENDA

```js
// FUNCIÓN: Filtrar productos baratos
let precios = [100, 50, 200];

let baratos = precios.filter(p => p < 100);
```

---

# 🧱 6. PATRÓN PROFESIONAL

```js
let resultado = productos
    .filter(p => p.precio > 50)
    .map(p => p.nombre);
```

---

# 🐞 7. DEBUGGING

```js
// FUNCIÓN: Evitar errores
if (Array.isArray(datos)) {
    datos.map(...)
}
```

---

# ⚠️ 8. ERRORES COMUNES

* No retornar en map
* Usar sort sin comparar
* Mutar arrays sin querer

---

# ⚡ 9. OPTIMIZACIÓN

❌

```js
for (...) array.push(...)
```

✅

```js
array.map(...)
```

---

# 🧩 10. EJERCICIOS

1. Filtrar números pares
2. Sumar array con reduce
3. Ordenar lista

---

# 🧾 11. RESUMEN FINAL

* map → transformar
* filter → filtrar
* reduce → calcular
* push → agregar
* slice → copiar

---

# 🔥 CONCLUSIÓN

Dominar arrays = pensar como programador real.

👉 Esto ya es nivel **PRO** 🚀
