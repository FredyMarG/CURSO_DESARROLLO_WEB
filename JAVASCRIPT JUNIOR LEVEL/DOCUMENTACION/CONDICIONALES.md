# 🚦 GUÍA DE ESTRUCTURAS CONDICIONALES

Las condicionales permiten que tu programa tome decisiones. "Si pasa esto, haz aquello".

---

# 1️⃣ Bloques if / else if / else

Es la estructura más común para evaluar rangos o condiciones múltiples.

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
