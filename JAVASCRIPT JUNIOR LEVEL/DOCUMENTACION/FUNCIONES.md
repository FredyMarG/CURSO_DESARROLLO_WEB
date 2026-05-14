# ⚡ GUÍA DE FUNCIONES EN JAVASCRIPT

Una función es un bloque de código diseñado para realizar una tarea específica. Se define una vez y se puede ejecutar (llamar) muchas veces.

---

# 1️⃣ Declaración de Funciones
Es la forma clásica. Goza de **Hoisting** (puedes llamarla antes de que aparezca en el código).

```js
function saludar(nombre) {
    return `Hola ${nombre}`;
}
```

---

# 2️⃣ Expresiones de Función
La función se guarda en una variable. No tiene hoisting.

```js
const sumar = function(a, b) {
    return a + b;
};
```

---

# 3️⃣ Funciones Flecha (Arrow Functions) 🏹
Introducidas en ES6. Son más cortas y modernas.

```js
const multiplicar = (a, b) => a * b;
```

### 🧠 Reglas de las Arrow Functions:
1.  Si solo tienen **un parámetro**, puedes quitar los paréntesis: `n => n * 2`.
2.  Si solo tienen **una línea**, puedes quitar las llaves `{}` y el `return` (el retorno es implícito).
3.  **Contexto `this`:** No tienen su propio `this`, heredan el del scope padre (vital para el DOM).

---

# 4️⃣ Parámetros y Retorno

### Parámetros por defecto
Evitan errores si no se pasa un valor al llamar a la función.
```js
const despedir = (nombre = "Invitado") => `Adiós ${nombre}`;
```

### El `return`
Finaliza la ejecución de la función y devuelve un valor. Si no hay `return`, la función devuelve `undefined`.

---

# 5️⃣ Ámbito de las variables (Scope)

*   **Global:** Variable declarada fuera de cualquier función. Accesible en todo el código.
*   **Local (Función/Bloque):** Variable declarada dentro de una función o bloque `{ }`. Solo existe allí dentro.

```js
let global = "Soy global";

function prueba() {
    let local = "Soy local";
    console.log(global); // ✅ Funciona
}

console.log(local); // ❌ ERROR
```

---

# 📊 Analogía para Niños
Imagina que una función es una **Máquina de Jugos** 🍹.
1.  **Parámetros:** Son las frutas que le echas (Input).
2.  **Código interno:** Son las cuchillas licuando.
3.  **Return:** Es el vaso de jugo que sale al final (Output).

---

# ⚠️ Errores Comunes
❌ Intentar usar una variable local fuera de su función.
❌ Olvidar el `return` cuando necesitas que la función te devuelva un dato para usarlo después.

---

# ✅ Buenas Prácticas
✔️ Usa **Arrow Functions** para funciones anónimas y callbacks.
✔️ Aplica el principio de **Responsabilidad Única**: una función debería hacer solo una cosa.
✔️ Nombra tus funciones con **verbos** (ej: `calcularPrecio`, `obtenerDatos`).

---