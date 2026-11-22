# 📐 Guía Completa del Objeto `Math` y Precisión Numérica

El objeto integrado `Math` proporciona constantes y funciones matemáticas estáticas. **No es un constructor** (nunca uses `new Math()`).

---

## 1. Métodos de Redondeo y Signo

| Método | Comportamiento | `4.7` | `4.2` | `-4.2` |
| :--- | :--- | :---: | :---: | :---: |
| `Math.round(x)` | Al entero más cercano | `5` | `4` | `-4` |
| `Math.floor(x)` | Hacia abajo (piso, $-\infty$) | `4` | `4` | **`-5`** |
| `Math.ceil(x)` | Hacia arriba (techo, $+\infty$) | `5` | `5` | `-4` |
| `Math.trunc(x)` | Elimina decimales (corta hacia `0`) | `4` | `4` | **`-4`** |
| `Math.sign(x)` | Devuelve `1`, `-1`, `0` o `-0` según el signo | `1` | `1` | `-1` |

> **Diferencia clave `floor` vs `trunc`:** Con números positivos son idénticos, pero con negativos `Math.floor(-4.2)` baja a `-5` mientras `Math.trunc(-4.2)` simplemente corta los decimales y devuelve `-4`.

---

## 2. Aritmética, Potencias y Extremos

| Método | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `Math.abs(x)` | Valor absoluto (siempre positivo) | `Math.abs(-15)` → `15` |
| `Math.pow(base, exp)` | Potencia (equivale a `base ** exp`) | `Math.pow(2, 5)` → `32` |
| `Math.sqrt(x)` / `Math.cbrt(x)` | Raíz cuadrada / raíz cúbica | `Math.sqrt(81)` → `9` |
| `Math.max(...nums)` | El valor mayor de los argumentos | `Math.max(5, 12, 3)` → `12` |
| `Math.min(...nums)` | El valor menor de los argumentos | `Math.min(5, 12, 3)` → `3` |
| `Math.hypot(a, b)` | Hipotenusa $\sqrt{a^2 + b^2}$ | `Math.hypot(3, 4)` → `5` |

> **Tip con Arrays:** `Math.max()` no acepta un array directamente. Usa el operador *spread*: `Math.max(...[10, 45, 22])` → `45`.

---

## 3. Generación de Números Aleatorios

### `Math.random()`
Devuelve un número decimal pseudoaleatorio en el rango $[0, 1)$ (`0` incluido, `1` excluido).

### Fórmula para entero aleatorio entre `min` y `max` (ambos incluidos):
```javascript
function aleatorioEntre(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(aleatorioEntre(1, 6)); // Simula un dado (1 a 6)
```

### Aleatorios Criptográficamente Seguros (`crypto`)
`Math.random()` **NO** es seguro para contraseñas, tokens o sorteos críticos. Para seguridad real usa la Web Crypto API:

```javascript
// Generar un UUID v4 único y seguro (estándar en navegadores y Node.js)
const idUnico = crypto.randomUUID();

// Generar un entero seguro usando crypto.getRandomValues()
const buffer = new Uint32Array(1);
crypto.getRandomValues(buffer);
const numeroSeguro = buffer[0];
```

---

## 4. Precisión Flotante (`0.1 + 0.2`) y Validación Numérica

JavaScript usa el estándar **IEEE 754** de coma flotante binaria de 64 bits, lo que provoca imprecisiones clásicas en decimales:

```javascript
console.log(0.1 + 0.2);          // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);  // false ⚠️

// ✅ Soluciones para dinero o cálculos exactos:
// 1. Trabajar en centavos (enteros):
const totalCentavos = 10 + 20; // 30 centavos ($0.30)

// 2. Redondear para mostrar o comparar con tolerancia (Number.EPSILON):
const sonIguales = Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON; // true
const formateado = (0.1 + 0.2).toFixed(2); // "0.30" (devuelve string)
```

### Validaciones modernas en `Number`
```javascript
Number.isInteger(42);     // true
Number.isInteger(42.5);   // false
Number.isNaN(NaN);        // true
Number.isFinite(100);     // true (false para Infinity, -Infinity, NaN)
```

---

## 5. Constantes Matemáticas

* `Math.PI`: `3.141592653589793` ($\pi$)
* `Math.E`: `2.718281828459045` (número de Euler)
* `Math.SQRT2`: `1.4142135623730951` ($\sqrt{2}$)

---

## ⚠️ Errores Comunes

* **Escribir `math` en minúscula:** JavaScript distingue mayúsculas; siempre es `Math`.
* **Pasar un array directo a `Math.max(arr)`:** Devuelve `NaN`. Debes expandirlo con `Math.max(...arr)`.
* **Olvidar `+ 1` en la fórmula de rango:** `Math.floor(Math.random() * (max - min)) + min` nunca incluirá `max`.
* **Usar `.toFixed(2)` y seguir operando matemáticamente:** `.toFixed()` devuelve un `string`; conviértelo con `Number(val.toFixed(2))`.

## ✅ Buenas Prácticas

* Usa `crypto.randomUUID()` para generar IDs únicos en lugar de `Math.random().toString(36)`.
* En aplicaciones financieras, almacena y calcula precios en la unidad mínima entera (centavos) y formatea solo al mostrar en pantalla.
* Usa `Number.isInteger()` y `Number.isFinite()` para validar entradas numéricas.

---

## Hoja de Trucos (Cheatsheet) — `Math` y Números

| Operación | Código | Resultado / Uso |
| :--- | :--- | :--- |
| **Redondeo cercano / piso / techo** | `Math.round(x)` / `floor(x)` / `ceil(x)` | Entero según dirección |
| **Quitar decimales** | `Math.trunc(x)` | Corta decimales sin importar signo |
| **Entero aleatorio `[min, max]`** | `Math.floor(Math.random() * (max - min + 1)) + min` | Juegos y simulaciones |
| **ID único seguro** | `crypto.randomUUID()` | Identificadores únicos (UUID v4) |
| **Máximo / Mínimo de array** | `Math.max(...arr)` / `Math.min(...arr)` | Requiere spread `...` |
| **Validar entero** | `Number.isInteger(n)` | `true` si es entero exacto |
| **Formatear decimales** | `Number(n.toFixed(2))` | Redondea a 2 decimales numéricos |
