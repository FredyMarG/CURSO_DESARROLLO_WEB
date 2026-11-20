# 🔢 Guía Completa de Operadores en JavaScript (ES2023–ES2025)

Los operadores son símbolos especiales que permiten asignar valores, realizar cálculos aritméticos, comparar datos, evaluar lógica y acceder a propiedades de forma segura.

---

## 1. Operadores de Asignación

Asignan un valor a la variable de la izquierda basándose en la expresión de la derecha.

| Operador | Nombre | Ejemplo | Equivalente |
| :--- | :--- | :--- | :--- |
| `=` | Asignación simple | `x = 10` | `x = 10` |
| `+=` | Suma y asignación | `x += 5` | `x = x + 5` |
| `-=` | Resta y asignación | `x -= 3` | `x = x - 3` |
| `*=` | Multiplicación y asignación | `x *= 2` | `x = x * 2` |
| `/=` | División y asignación | `x /= 2` | `x = x / 2` |
| `%=` | Residuo y asignación | `x %= 3` | `x = x % 3` |
| `**=` | Exponente y asignación | `x **= 2` | `x = x ** 2` |

### Operadores de Asignación Lógica (ES2021)
Combinan evaluación lógica con asignación y solo escriben si la condición de cortocircuito se cumple:

| Operador | Significado | Equivalente | Caso de uso real |
| :--- | :--- | :--- | :--- |
| `x ??= y` | Asigna `y` solo si `x` es `null` o `undefined` | `x ?? (x = y)` | Valores por defecto sin pisar `0` ni `false` |
| `x ||= y` | Asigna `y` solo si `x` es *falsy* | `x || (x = y)` | Rellenar strings vacíos o contadores en `0` |
| `x &&= y` | Asigna `y` solo si `x` es *truthy* | `x && (x = y)` | Actualizar un valor solo si ya existía |

```javascript
const configuracion = { tema: "", reintentos: 0 };

configuracion.tema ||= "oscuro";      // "" es falsy → cambia a "oscuro"
configuracion.reintentos ??= 3;       // 0 NO es nullish → mantiene 0
configuracion.usuario ??= "Invitado"; // undefined → asigna "Invitado"
```

---

## 2. Operadores Aritméticos

| Operador | Descripción | Ejemplo | Resultado |
| :--- | :--- | :--- | :--- |
| `+` | Suma (o concatenación si hay un string) | `10 + 5` | `15` |
| `-` | Resta | `10 - 5` | `5` |
| `*` | Multiplicación | `4 * 3` | `12` |
| `/` | División | `10 / 4` | `2.5` |
| `%` | Módulo (resto de la división entera) | `10 % 3` | `1` (útil para saber pares: `n % 2 === 0`) |
| `**` | Exponenciación (ES2016) | `2 ** 3` | `8` |
| `++` | Incremento en 1 | `let i = 1; i++;` | `2` |
| `--` | Decremento en 1 | `let i = 3; i--;` | `2` |

> **Prefijo vs Sufijo en `++` / `--`:** `++x` incrementa y devuelve el nuevo valor; `x++` devuelve el valor actual y luego incrementa. Para evitar confusiones, úsalos en su propia línea o prefiere `x += 1`.

---

## 3. Operadores de Comparación

Evalúan dos operandos y siempre devuelven un booleano (`true` o `false`).

### Igualdad Débil (`==`) vs Igualdad Estricta (`===`)
* **`==` / `!=`:** Realizan **coerción de tipos** antes de comparar, generando resultados contraintuitivos (`0 == ""` es `true`, `null == undefined` es `true`).
* **`===` / `!==`:** Comparan **valor Y tipo** sin convertir nada. **Úsalos siempre.**

```javascript
5 == "5"    // true  (coerción peligrosa)
5 === "5"   // false (number !== string)
0 == false  // true
0 === false // false
```

| Operador | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `===` | Estrictamente igual | `"a" === "a"` → `true` |
| `!==` | Estrictamente diferente | `5 !== "5"` → `true` |
| `>` / `>=` | Mayor / Mayor o igual | `18 >= 18` → `true` |
| `<` / `<=` | Menor / Menor o igual | `10 < 20` → `true` |

---

## 4. Operadores Lógicos y Cortocircuito (*Short-Circuit*)

| Operador | Nombre | Comportamiento |
| :--- | :--- | :--- |
| `&&` | AND lógico | Devuelve el primer valor *falsy* o el último valor si todos son *truthy* |
| `||` | OR lógico | Devuelve el primer valor *truthy* o el último valor si todos son *falsy* |
| `!` | NOT lógico | Invierte el valor booleano (`!true` → `false`, `!!"hola"` → `true`) |

### Evaluación en Cortocircuito
JavaScript evalúa de izquierda a derecha y se detiene en cuanto el resultado es definitivo:

```javascript
const estaLogueado = true;
estaLogueado && console.log("Acceso concedido"); // Ejecuta el console.log

const puerto = process.env.PORT || 3000; // Si PORT es falsy, usa 3000
```

---

## 5. Operadores Modernos Imprescindibles (ES2020+)

### Nullish Coalescing (`??`)
A diferencia de `||` (que reacciona a **todos** los valores *falsy* como `0`, `""` o `false`), `??` solo activa el valor por defecto cuando la izquierda es **`null` o `undefined`**:

```javascript
const stock = 0;
console.log(stock || 10); // 10  ❌ Error lógico: 0 es un stock válido
console.log(stock ?? 10); // 0   ✅ Correcto: 0 no es null ni undefined
```

### Optional Chaining (`?.`)
Permite leer propiedades anidadas, índices o llamar métodos sin que la aplicación explote con `TypeError` si algún eslabón intermedio es `null` o `undefined`:

```javascript
const usuario = { perfil: null };

// Sin ?. lanzaría TypeError: Cannot read properties of null
const ciudad = usuario.perfil?.direccion?.ciudad ?? "Sin ciudad";
console.log(ciudad); // "Sin ciudad"

// También funciona con arrays y métodos:
const primerItem = usuario.pedidos?.[0];
const saludo = usuario.saludar?.();
```

### Operador Ternario (`condición ? siTrue : siFalse`)
Es la única expresión condicional en línea que devuelve un valor:

```javascript
const edad = 20;
const categoria = edad >= 18 ? "Adulto" : "Menor";
```

---

## ⚠️ Errores Comunes

* **Confundir `=` (asignación) con `===` (comparación):** `if (x = 5)` asigna `5` a `x` y siempre entra al `if` porque `5` es *truthy*.
* **Concatenación accidental con `+`:** `"10" + 5` produce `"105"` porque `+` prioriza concatenar si uno de los operandos es string.
* **Usar `||` para valores por defecto numéricos o booleanos:** Si el valor legítimo es `0` o `false`, `||` lo sobrescribirá; usa `??`.
* **Encadenar operadores ternarios complejos:** `a ? b : c ? d : e` destruye la legibilidad; usa `if/else` o funciones auxiliares.

## ✅ Buenas Prácticas

* Usa siempre `===` y `!==` (salvo el caso muy específico de `x == null` si quieres chequear `null` y `undefined` juntos, aunque `x === null || x === undefined` es más explícito).
* Combina `?.` y `??` para leer datos de APIs externas de forma segura: `respuesta.data?.items?.length ?? 0`.
* Usa paréntesis `()` cuando mezcles `&&` y `||` (o `??`) para dejar clara la precedencia. Nota: JavaScript prohíbe mezclar `??` con `&&` o `||` sin paréntesis explícitos.

---

## Hoja de Trucos (Cheatsheet) — Operadores

| Operador | Nombre | Ejemplo | Resultado |
| :--- | :--- | :--- | :--- |
| `===` / `!==` | Comparación estricta | `5 === "5"` | `false` |
| `**` | Exponente | `3 ** 2` | `9` |
| `%` | Módulo (residuo) | `7 % 2` | `1` |
| `&&` / `\|\|` / `!` | Lógicos | `true && false` | `false` |
| `??` | Nullish Coalescing | `0 ?? 5` / `null ?? 5` | `0` / `5` |
| `?.` | Optional Chaining | `obj?.prop?.sub` | `undefined` si falta algo |
| `??=` | Asignación Nullish | `a ??= 10` | Asigna `10` si `a` es `null`/`undefined` |
| `? :` | Ternario | `ok ? "Sí" : "No"` | `"Sí"` o `"No"` |
