# 📦 GUÍA DE MÉTODOS DE ARRAYS (COLECCIONES)

Los arrays son listas ordenadas de datos. En JS son dinámicos y pueden contener cualquier tipo de dato.

---

# 🛠️ 1. Métodos Transformadores (Mutan el array original)

| Método | ¿Qué hace? |
| :--- | :--- |
| `.push(valor)` | Agrega uno o más elementos al **final**. |
| `.pop()` | Elimina y devuelve el **último** elemento. |
| `.shift()` | Elimina y devuelve el **primer** elemento. |
| `.unshift(valor)` | Agrega uno o más elementos al **inicio**. |
| `.reverse()` | Invierte el orden del array. |
| `.sort()` | Ordena los elementos (ojo: los trata como strings por defecto). |
| `.splice(inicio, cantidad, ...nuevos)` | Elimina o reemplaza elementos en cualquier posición. |

---

# 🔍 2. Métodos de Acceso (No modifican el original)

| Método | ¿Qué hace? |
| :--- | :--- |
| `.join(separador)` | Une todos los elementos en un **string**. |
| `.slice(inicio, fin)` | Devuelve una **copia** de una parte del array. |
| `.indexOf(valor)` | Devuelve el primer índice donde se encuentra el valor. |
| `.includes(valor)` | Devuelve `true` si el valor existe en el array. |
| `.concat(array2)` | Une dos o más arrays y devuelve uno nuevo. |

---

# 🔄 3. Métodos de Iteración

### `.forEach(callback)`
Ejecuta una función para cada elemento. No devuelve nada.
```js
frutas.forEach((fruta, i) => console.log(`${i}: ${fruta}`));
```

---

# 🧠 Concepto Pro: Mutabilidad

Cuando usas métodos como `push` o `splice`, el array original **CAMBIA**. 
Si necesitas mantener los datos originales, usa `slice()` para crear una copia antes de operar o usa métodos inmutables (como `map`, `filter`, que verás en nivel Senior).

---

# 📊 Analogía para Niños
Imagina que un Array es un **Tren de Carga** 🚂.
*   `push`: Enganchas un vagón al final.
*   `pop`: Quitas el último vagón.
*   `unshift`: Pones un vagón justo detrás de la locomotora.
*   `splice`: Te metes en medio del tren, sacas un vagón y pones otro.

---

# 🚀 Resumen Visual
```js
let letras = ["b", "c"];
letras.push("d");      // ["b", "c", "d"]
letras.unshift("a");   // ["a", "b", "c", "d"]
let str = letras.join(""); // "abcd"
```

---

# ⚠️ Errores Comunes
❌ Intentar acceder a un índice que no existe (devuelve `undefined`).
❌ Olvidar que el conteo empieza en **0**.

---

# ✅ Buenas Prácticas
✔️ Usa `const` para declarar arrays (puedes modificar el contenido, pero no reasignar la variable).
✔️ Prefiere `forEach` o `for...of` sobre el bucle `for` tradicional para mayor legibilidad.

---

> **Tip:** El método `.splice()` es el más potente, pero el más peligroso. Úsalo con cuidado. 🛠️