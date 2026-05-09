# 🧠 GUÍA DEFINITIVA DE `Math` EN JAVASCRIPT — NIVEL DIOS PRO EXTREMO

---

## 🚀 1. Introducción

El objeto `Math` en JavaScript es una **herramienta global** que proporciona constantes y funciones matemáticas.

⚠️ Importante:

* No es un constructor → ❌ `new Math()`
* Es estático → ✅ `Math.funcion()`

---

## 🧩 2. Estructura general

```
Math
 ├── Constantes
 └── Funciones
```

---

# 🔢 3. CONSTANTES MATEMÁTICAS

| Constante    | Descripción     |
| ------------ | --------------- |
| Math.PI      | π (3.1416...)   |
| Math.E       | Número de Euler |
| Math.SQRT2   | √2              |
| Math.SQRT1_2 | √1/2            |
| Math.LN2     | ln(2)           |
| Math.LN10    | ln(10)          |
| Math.LOG2E   | log2(e)         |
| Math.LOG10E  | log10(e)        |

### 🧠 Ejemplo real

```
const radio = 5;
const area = Math.PI * radio * radio;
```

---

# ⚙️ 4. FUNCIONES BÁSICAS

## 🔹 4.1 Redondeo

| Función      | Descripción                    |
| ------------ | ------------------------------ |
| Math.round() | Redondea al entero más cercano |
| Math.floor() | Redondea hacia abajo           |
| Math.ceil()  | Redondea hacia arriba          |
| Math.trunc() | Elimina decimales              |

### 🧠 Ejemplo

```
Math.round(4.6) // 5
Math.floor(4.9) // 4
Math.ceil(4.1)  // 5
Math.trunc(4.9) // 4
```

### 🚗 Caso real

Si tienes precios:

```
const precio = 19.99;
Math.ceil(precio); // 20
```

---

## 🔹 4.2 Valores extremos

| Función    | Descripción |
| ---------- | ----------- |
| Math.max() | Mayor valor |
| Math.min() | Menor valor |

```
Math.max(1, 5, 3) // 5
Math.min(1, 5, 3) // 1
```

---

## 🔹 4.3 Potencias y raíces

| Función        | Descripción   |
| -------------- | ------------- |
| Math.pow(a, b) | a^b           |
| Math.sqrt()    | Raíz cuadrada |
| Math.cbrt()    | Raíz cúbica   |

```
Math.pow(2, 3) // 8
Math.sqrt(16) // 4
```

---

## 🔹 4.4 Valores absolutos

```
Math.abs(-10) // 10
```

---

## 🔹 4.5 Números aleatorios

```
Math.random()
```

### 🎲 Ejemplo práctico

Número entre 1 y 10:

```
Math.floor(Math.random() * 10) + 1
```

---

# 🔬 5. FUNCIONES AVANZADAS

## 🔹 5.1 Logaritmos

```
Math.log(x)   // ln
Math.log10(x)
Math.log2(x)
```

---

## 🔹 5.2 Exponenciales

```
Math.exp(x) // e^x
```

---

## 🔹 5.3 Trigonometría

| Función    | Descripción |
| ---------- | ----------- |
| Math.sin() | Seno        |
| Math.cos() | Coseno      |
| Math.tan() | Tangente    |

⚠️ Usan radianes

### 🔄 Conversión

```
grados * (Math.PI / 180)
```

---

## 🔹 5.4 Funciones inversas

```
Math.asin()
Math.acos()
Math.atan()
```

---

## 🔹 5.5 Otras funciones útiles

```
Math.sign(x)
Math.clz32(x)
Math.imul(a, b)
Math.fround(x)
```

---

# 🧠 6. DIAGRAMA MENTAL

```
Número → Math.función() → Resultado
```

Ejemplo:

```
4.7 → Math.floor() → 4
```

---

# ⚠️ 7. ERRORES COMUNES

## ❌ Error 1: Usar new

```
new Math() ❌
```

## ❌ Error 2: No controlar decimales

## ❌ Error 3: Mal uso de random

---

# 🛠️ 8. DEBUGGING

### Problema típico

```
Math.random() * 10
```

Devuelve decimales → solución:

```
Math.floor(Math.random() * 10)
```

---

# ⚡ 9. OPTIMIZACIÓN

* Evita cálculos repetidos
* Guarda resultados en variables

---

# ⚖️ 10. COMPARACIONES

## Math.round vs floor vs ceil

| Función | Uso                    |
| ------- | ---------------------- |
| round   | Aproximación           |
| floor   | Seguridad hacia abajo  |
| ceil    | Seguridad hacia arriba |

---

# 🧪 11. CASOS PRÁCTICOS

## 🎮 Juego

```
const enemigo = Math.floor(Math.random() * 3);
```

## 💰 Finanzas

```
Math.round(precio * 100) / 100
```

---

# 🏋️ 12. EJERCICIOS

1. Genera número 1-100
2. Calcula área círculo
3. Convierte grados a radianes

---

# 📌 13. RESUMEN FINAL

* `Math` es estático
* Tiene constantes y funciones
* Se usa para cálculos, random, trigonometría

---

# 🧠 CONCLUSIÓN FINAL

`Math` es esencial para:

* Juegos
* IA
* Finanzas
* Animaciones

Dominarlo = subir de nivel como programador 🚀
