# 🔁 Guía Completa de Bucles en JavaScript

Los **bucles** (*loops*) permiten repetir un bloque de código múltiples veces de forma controlada. Elegir el bucle correcto hace tu código más claro, seguro y eficiente.

---

## 1. Bucle `for` Clásico

Úsalo cuando conoces el número exacto de iteraciones o necesitas manipular el índice manualmente (por ejemplo, avanzar de 2 en 2 o recorrer hacia atrás).

```javascript
for (let i = 0; i < 5; i++) {
    console.log(`Iteración #${i}`);
}
```

* **Inicialización (`let i = 0`):** Se ejecuta una sola vez al inicio. Usa siempre `let` (nunca `var`).
* **Condición (`i < 5`):** Se evalúa antes de cada vuelta. Si es `false`, el bucle termina.
* **Actualización (`i++`):** Se ejecuta al final de cada vuelta.

---

## 2. Bucle `while`

Úsalo cuando **no sabes de antemano** cuántas iteraciones ocurrirán y dependes de que una condición cambie dinámicamente.

```javascript
let energia = 3;

while (energia > 0) {
    console.log(`Ejecutando tarea. Energía restante: ${energia}`);
    energia--; // Sin esto, el bucle sería infinito
}
```

---

## 3. Bucle `do...while`

Igual que `while`, pero evalúa la condición **al final**, garantizando que el bloque se ejecute **al menos una vez**.

```javascript
let intento = 0;

do {
    intento++;
    console.log(`Intento de conexión #${intento}`);
} while (intento < 1); // Se ejecuta 1 vez aunque la condición sea falsa tras la primera vuelta
```

---

## 4. Bucle `for...of` (Valores de Iterables — Estándar ES6+)

Recorre directamente los **valores** de cualquier objeto iterable (`Array`, `String`, `Set`, `Map`, `NodeList`). Es la forma más limpia de recorrer arrays cuando quieres usar `break` o `continue`.

```javascript
const frutas = ["Manzana", "Banana", "Uva"];

for (const fruta of frutas) {
    console.log(fruta);
}

// Si además necesitas el índice, usa .entries() con destructuring:
for (const [indice, fruta] of frutas.entries()) {
    console.log(`${indice}: ${fruta}`);
}
```

---

## 5. Bucle `for...in` (Claves de Objetos)

Recorre las **propiedades enumerables (claves)** de un objeto plano.

```javascript
const configuracion = { tema: "oscuro", idioma: "es", notificaciones: true };

for (const clave in configuracion) {
    if (Object.hasOwn(configuracion, clave)) {
        console.log(`${clave}: ${configuracion[clave]}`);
    }
}
```

> **Alternativa moderna para objetos:** `Object.entries(obj)` combinado con `for...of` evita recorrer propiedades heredadas del prototipo:
> ```javascript
> for (const [clave, valor] of Object.entries(configuracion)) {
>     console.log(`${clave} => ${valor}`);
> }
> ```

---

## 6. Control de Flujo: `break`, `continue` y Etiquetas (`label`)

* **`break`:** Detiene inmediatamente el bucle completo y continúa con el código que sigue después.
* **`continue`:** Salta el resto de la iteración actual y pasa directamente a la siguiente vuelta.
* **Etiquetas (`label`):** Permiten que `break` o `continue` actúen sobre un bucle externo cuando hay bucles anidados. Úsalas con moderación (a menudo es más limpio extraer una función y usar `return`).

```javascript
busqueda:
for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 3; col++) {
        if (fila === 1 && col === 1) {
            break busqueda; // Sale de ambos bucles
        }
        console.log(`Celda [${fila}, ${col}]`);
    }
}
```

---

## 7. ¿Cuándo usar cada bucle? y Rendimiento

* **¿Necesitas transformar o filtrar un array?** → Usa `.map()` o `.filter()` (código declarativo).
* **¿Necesitas recorrer un array y poder detenerte con `break` o usar `await` en secuencia?** → Usa `for...of`.
* **¿Necesitas recorrer propiedades de un objeto?** → Usa `for (const [k, v] of Object.entries(obj))` o `for...in`.
* **¿El rendimiento importa en millones de elementos?** → El `for` clásico con índice y `for...of` son los más rápidos en motores V8 modernos porque no invocan un callback por cada iteración.
* **Cuidado con colecciones vivas del DOM (`HTMLCollection`):** Si agregas elementos al DOM dentro de un bucle sobre `document.getElementsByClassName(...)`, su `.length` crece en cada vuelta y puede crear un bucle infinito. Usa `document.querySelectorAll()` (devuelve `NodeList` estática).

---

## ⚠️ Errores Comunes

* **Bucles infinitos:** Olvidar actualizar la variable de control en un `while` o escribir una condición que nunca se vuelve falsa (`for (let i = 0; i >= 0; i++)`).
* **Usar `for...in` con Arrays:** Recorre los índices como strings (`"0"`, `"1"`) y también puede incluir propiedades extra añadidas al array. Usa `for...of`.
* **Error "Off-by-one" (`<=` vs `<`):** Escribir `for (let i = 0; i <= arr.length; i++)` intenta acceder a `arr[arr.length]`, que siempre es `undefined`.
* **Usar `var` en bucles con callbacks asíncronos:** `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` imprime `3, 3, 3`. Con `let i` imprime `0, 1, 2`.

## ✅ Buenas Prácticas

* Usa `const` en `for (const item of lista)` cuando no vayas a reasignar `item` dentro del bloque.
* Evita anidar más de 2 niveles de bucles; si ocurre, extrae el bucle interno a una función con nombre descriptivo.
* Prefiere `break` en búsquedas manuales para no iterar innecesariamente tras encontrar el resultado.

---

## Hoja de Trucos (Cheatsheet) — Bucles

| Bucle / Sentencia | Uso Ideal | Ejemplo |
| :--- | :--- | :--- |
| **`for`** | Número conocido de vueltas o control de índice | `for (let i = 0; i < n; i++)` |
| **`for...of`** | Recorrer valores de Arrays, Strings, Set, Map | `for (const x of lista)` |
| **`for...of` + `.entries()`** | Valores + índice sin bucle clásico | `for (const [i, x] of lista.entries())` |
| **`while`** | Repetir mientras una condición sea verdadera | `while (cola.length > 0)` |
| **`do...while`** | Ejecutar al menos 1 vez antes de validar | `do { ... } while (cond);` |
| **`Object.entries` + `for...of`** | Recorrer clave y valor de objetos de forma segura | `for (const [k, v] of Object.entries(obj))` |
| **`break` / `continue`** | Terminar el bucle / saltar a la siguiente vuelta | `if (encontrado) break;` |
