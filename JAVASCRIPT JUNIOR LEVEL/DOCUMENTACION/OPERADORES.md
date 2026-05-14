# 🔢 GUÍA DE OPERADORES EN JAVASCRIPT

Los operadores permiten manipular valores, realizar cálculos y comparar datos.

---

## 1️⃣ Operadores de Asignación

Asignan un valor a la variable izquierda basado en el valor de la derecha.

| Operador | Nombre | Ejemplo | Equivalente |
| :--- | :--- | :--- | :--- |
| `=` | Asignación | `x = y` | `x = y` |
| `+=` | Asignación de suma | `x += y` | `x = x + y` |
| `-=` | Asignación de resta | `x -= y` | `x = x - y` |
| `*=` | Asignación de multiplicación | `x *= y` | `x = x * y` |
| `/=` | Asignación de división | `x /= y` | `x = x / y` |
| `%=` | Asignación de residuo | `x %= y` | `x = x % y` |
| `**=` | Asignación de exponente | `x **= y` | `x = x ** y` |

---

## 2️⃣ Operadores de Comparación

Comparan dos valores y devuelven un **booleano** (`true` o `false`).

### 🧠 Comparación Simple vs Estricta

* **`==` (Igualdad):** Compara el **valor**, pero ignora el tipo (hace coerción).
  * `5 == "5"` → `true`
* **`===` (Igualdad Estricta):** Compara **valor y tipo**. **(RECOMENDADO)**.
  * `5 === "5"` → `false`

| Operador | Descripción |
| :--- | :--- |
| `!=` | Desigualdad (diferente) |
| `!==` | Desigualdad estricta |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `<` | Menor que |
| `<=` | Menor o igual que |

---

## 3️⃣ Operadores Aritméticos

| Operador | Descripción |
| :--- | :--- |
| `+` | Suma (o concatenación de strings) |
| `-` | Resta |
| `*` | Multiplicación |
| `/` | División |
| `%` | Módulo (Resto de la división) |
| `**` | Exponenciación |
| `++` | Incremento (Suma 1) |
| `--` | Decremento (Resta 1) |

---

## 4️⃣ Operadores Lógicos

Permiten combinar múltiples condiciones.

### 🤝 AND (`&&`)

Devuelve `true` solo si **AMBOS** son verdaderos.

* `true && true` → `true`
* `true && false` → `false`

### 👐 OR (`||`)

Devuelve `true` si **AL MENOS UNO** es verdadero.

* `true || false` → `true`
* `false || false` → `false`

### ❗ NOT (`!`)

Invierte el valor (Negación).

* `!true` → `false`

---

## 🚀 Resumen para Pro: Cortocircuito

JavaScript evalúa de izquierda a derecha y se detiene si ya conoce el resultado:

* En `&&`: Si el primero es `false`, no mira el segundo.
* En `||`: Si el primero es `true`, no mira el segundo.

---

## ⚠️ Errores Comunes

❌ Confundir `=` (asignar) con `==` (comparar).
❌ Olvidar que `+` con un string concatena en lugar de sumar: `5 + "5" = "55"`.

---

## ✅ Buenas Prácticas

✔️ Usa siempre `===` y `!==` para evitar errores de tipo.
✔️ Usa paréntesis `( )` para agrupar operaciones lógicas complejas y facilitar la lectura.

---

> **Frase Pro:** "Los operadores son los verbos de tu código; úsalos con precisión." 🚀
