# GUÍA DEL OBJETO MATH

El objeto `Math` es una herramienta integrada en JavaScript para realizar operaciones matemáticas complejas.
⚠️ **Nota:** `Math` no es una función, es un objeto estático (no usas `new Math()`).

---

# 🔢 1. Funciones de Redondeo

| Método | Descripción | Ejemplo (4.7) |
| :--- | :--- | :--- |
| `Math.round()` | Redondea al entero más cercano. | 5 |
| `Math.floor()` | Redondea hacia **abajo** (Piso). | 4 |
| `Math.ceil()` | Redondea hacia **arriba** (Techo). | 5 |
| `Math.trunc()` | Elimina la parte decimal (Trunca). | 4 |

---

# 🚀 2. Generación de Aleatorios

## 🎲 `Math.random()

Genera un número decimal entre 0 (inclusive) y 1 (exclusivo).

### 🎯 Fórmula para un Rango Entero

Para obtener un número entre `min` y `max`:

```js
let random = Math.floor(Math.random() * (max - min + 1)) + min;
```

---

# 📐 3. Aritmética y Potencia

| Método | Descripción |
| :--- | :--- |
| `Math.pow(base, exp)` | Eleva la base al exponente. |
| `Math.sqrt(n)` | Raíz cuadrada. |
| `Math.cbrt(n)` | Raíz cúbica. |
| `Math.abs(n)` | Valor absoluto (convierte negativos a positivos). |
| `Math.max(a, b, c...)` | Devuelve el número más alto de la lista. |
| `Math.min(a, b, c...)` | Devuelve el número más bajo de la lista. |

---

# 🥧 4. Constantes Matemáticas

| Propiedad | Valor Aproximado |
| :--- | :--- |
| `Math.PI` | 3.14159265... |
| `Math.E` | 2.718... (Constante de Euler) |
| `Math.SQRT2` | 1.414... (Raíz de 2) |

---

# 🧠 Caso Práctico: El Sorteo

```js
const participantes = ["Ana", "Pedro", "Luis", "Maria"];
const ganadorIndice = Math.floor(Math.random() * participantes.length);
console.log(`El ganador es: ${participantes[ganadorIndice]}`);
```

---

# ⚠️ Diferencia Importante: floor vs trunc

* Para números **positivos**, hacen lo mismo.
* Para números **negativos**, `floor` redondea alejándose de cero (`-4.1` → `-5`), mientras que `trunc` solo corta decimales (`-4.1` → `-4`).

---

# ⚠️ Errores Comunes

❌ Escribir `math` en minúscula. JavaScript es *case-sensitive* y debe ser `Math`.
❌ Pensar que `Math.random()` llega hasta el número máximo (recuerda que el 1 es exclusivo).

---

# ✅ Buenas Prácticas

✔️ Usa `Math.floor` cuando trabajes con índices de arrays (ya que los índices son siempre enteros).
✔️ Para redondear a una cantidad específica de decimales, usa `numero.toFixed(2)` (pero recuerda que devuelve un String).

---

```

```js
if (condicion) {
    // se ejecuta si es true
} else if (otraCondicion) {
    // se ejecuta si la primera fue false y esta es true
} else {
    // se ejecuta si ninguna anterior se cumplió
}
```

---

# 2️⃣ Operador Ternario ⚡

Es la versión corta de un `if/else`. Ideal para asignar valores rápidos.

**Sintaxis:**
`condicion ? valor_si_true : valor_si_false`

**Ejemplo:**

```js
const mensaje = (edad >= 18) ? "Bienvenido" : "Eres menor";
```

---

# 3️⃣ Sentencia Switch 🎛️

Ideal cuando tienes una variable que puede tomar muchos valores exactos (como un menú o los días de la semana).

```js
switch (variable) {
    case valor1:
        // codigo
        break; // ⚠️ Obligatorio para no ejecutar el siguiente caso
    case valor2:
        // codigo
        break;
    default:
        // se ejecuta si no hubo coincidencias
}
```

---

# 🧠 Concepto Pro: Truthy y Falsy

En JavaScript, no necesitas comparar siempre con `true`. El lenguaje evalúa los valores por sí mismos.

### ❌ Valores Falsy (Se evalúan como `false`)

* `false`
* `0` (Cero)
* `""` (String vacío)
* `null`
* `undefined`
* `NaN`

### ✅ Valores Truthy

Todo lo demás (`"Hola"`, `1`, `[]`, `{}`).

**Ejemplo:**

```js
let nombre = "";
if (nombre) { // Evalúa como false porque es un string vacío
    console.log("Hola!");
}
```

---

# ⚠️ Errores Comunes

❌ Olvidar el `break` en un `switch` (ejecutará todos los casos hacia abajo).
❌ Usar `=` en lugar de `===` dentro de un `if`.

---

# ✅ Buenas Prácticas

✔️ Usa el operador ternario para condiciones simples de una sola línea.
✔️ Usa `switch` cuando tengas más de 3 condiciones basadas en una sola variable.

---
