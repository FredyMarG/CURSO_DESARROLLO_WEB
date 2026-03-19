# 🔁 Bucles en JavaScript
---

# 📌 ¿Qué es un bucle?

Un **bucle (loop)** es una estructura de control que permite repetir un bloque de código múltiples veces mientras se cumpla una condición lógica.

👉 Son esenciales para:

* Procesar listas de datos
* Automatizar tareas repetitivas
* Reducir código duplicado

---

# 🔄 1. Bucle `for` (EL MÁS USADO)

## 📌 ¿Cuándo usarlo?

Cuando sabes exactamente cuántas veces quieres repetir algo.

## 🧩 Sintaxis detallada:

```js
for (inicialización; condición; actualización) {
  // código
}
```

### 🔍 Cada parte:

* **Inicialización:** se ejecuta UNA vez → `let i = 0`
* **Condición:** se evalúa antes de cada iteración → `i < 5`
* **Actualización:** se ejecuta después de cada iteración → `i++`

## ✅ Ejemplo explicado:

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

### 🔎 Paso a paso:

1. i = 0 → ¿0 < 3? ✅ → imprime 0
2. i = 1 → ¿1 < 3? ✅ → imprime 1
3. i = 2 → ¿2 < 3? ✅ → imprime 2
4. i = 3 → ¿3 < 3? ❌ → termina

---

# 🔄 2. Bucle `while`

## 📌 ¿Cuándo usarlo?

Cuando NO sabes cuántas veces se repetirá.

## 🧩 Sintaxis:

```js
while (condición) {
  // código
}
```

## ⚠️ Importante

Debes modificar la condición dentro del bucle o será infinito.

---

# 🔄 3. Bucle `do...while`

## 📌 ¿Cuándo usarlo?

Cuando necesitas que el código se ejecute AL MENOS UNA VEZ.

---

# 🔄 4. Bucle `for...of` (VALORES)

## 📌 ¿Qué hace realmente?

Recorre los **VALORES** de una estructura iterable.

## 📌 Estructuras compatibles:

* Arrays
* Strings
* Map
* Set

## 🧩 Sintaxis:

```js
for (let valor of iterable) {
  // código
}
```

## ✅ Ejemplo básico:

```js
const numeros = [10, 20, 30];

for (let num of numeros) {
  console.log(num);
}
```

## 🔎 Paso a paso:

Iteración 1 → num = 10
Iteración 2 → num = 20
Iteración 3 → num = 30

## ⚠️ Importante:

* No accede al índice
* Es más limpio que `for` tradicional

## 🧠 Ejemplo con string:

```js
for (let letra of "hola") {
  console.log(letra);
}
```

---

# 🔄 5. Bucle `for...in` (CLAVES)

## 📌 ¿Qué hace realmente?

Recorre las **CLAVES (propiedades)** de un objeto.

## 🧩 Sintaxis:

```js
for (let clave in objeto) {
  // código
}
```

## ✅ Ejemplo:

```js
const usuario = {
  nombre: "Carlos",
  edad: 28
};

for (let clave in usuario) {
  console.log(clave);
}
```

👉 Resultado:

```
nombre
edad
```

## 🔎 Obtener valores:

```js
for (let clave in usuario) {
  console.log(usuario[clave]);
}
```

## ⚠️ ERROR COMÚN:

NO usar con arrays:

```js
const arr = [10, 20, 30];

for (let i in arr) {
  console.log(i); // imprime índices, no valores
}
```

---

# ⛔ `break` (DETENER BUCLE)

## 📌 ¿Qué hace?

Detiene COMPLETAMENTE el bucle.

## ✅ Ejemplo básico:

```js
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);
}
```

## 🔎 Paso a paso:

* i = 0 → imprime
* i = 1 → imprime
* i = 5 → break → TERMINA TODO

## 🧠 Ejemplo práctico (búsqueda):

```js
const numeros = [4, 7, 2, 9];

for (let num of numeros) {
  if (num === 2) {
    console.log("Encontrado");
    break;
  }
}
```

---

# ⏭️ `continue` (SALTAR ITERACIÓN)

## 📌 ¿Qué hace?

Salta la iteración actual y continúa con la siguiente.

## ✅ Ejemplo básico:

```js
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);
}
```

## 🔎 Paso a paso:

* i = 0 → imprime
* i = 1 → imprime
* i = 2 → SALTA
* i = 3 → imprime

## 🧠 Ejemplo práctico (filtrado):

```js
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) continue;
  console.log("Par:", i);
}
```

---

# 🏷️ `label` (CONTROL AVANZADO)

## 📌 ¿Para qué sirve?

Permite controlar bucles ANIDADOS.

## 🧩 Sintaxis:

```js
etiqueta:
for (...) {
}
```

## ✅ Ejemplo con break:

```js
externo:
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break externo;
    }
    console.log(i, j);
  }
}
```

👉 Rompe TODOS los bucles.

## ✅ Ejemplo con continue:

```js
externo:
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue externo;
    console.log(i, j);
  }
}
```

👉 Salta a la siguiente iteración del bucle externo.

---

# 🚀 Buenas prácticas clave

* Usa `for...of` para arrays
* Usa `for...in` SOLO para objetos
* Evita `label` si no es necesario
* Usa `break` en búsquedas
* Usa `continue` para filtros

---

# 🎯 CONCLUSIÓN

Dominar:

* `for` → control total
* `for...of` → claridad
* `for...in` → objetos
* `break/continue` → control del flujo

Te hace escribir código más limpio y profesional 🚀

