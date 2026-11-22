# GUÍA — El Operador Ternario en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender la estructura del único operador de JavaScript que acepta tres operandos, dominar su sintaxis compacta y aprender cuándo es una buena práctica usarlo como alternativa a `if...else`.

---

# ¿Qué es el Operador Ternario?

El **operador ternario** es el único operador en JavaScript que toma **tres operandos**. Se utiliza comúnmente como un atajo abreviado y elegante para la instrucción condicional `if...else`.

A diferencia de un bloque `if...else` tradicional (que es una declaración o instrucción), el operador ternario es una **expresión**. Esto significa que evalúa una condición y **devuelve un valor inmediatamente**, lo que permite asignarlo directamente a una variable o pasarlo como argumento a una función.

---

# Sintaxis básica y anatomía

La sintaxis del operador ternario utiliza un signo de interrogación (`?`) y dos puntos (`:`):

```javascript
condicion ? expresion_si_es_verdadera : expresion_si_es_falsa;
```

### 🔍 Desglose de los 3 operandos:
1. **Condición:** Una expresión que se evalúa como *truthy* (verdadera) o *falsy* (falsa).
2. **`?` (Signo de interrogación):** Separa la condición del caso verdadero. Funciona como un "¿Es esto verdad?".
3. **Expresión si es verdadera:** El código que se ejecuta y devuelve si la condición es verdadera.
4. **`:` (Dos puntos):** Separa el caso verdadero del caso falso. Actúa como un "De lo contrario...".
5. **Expresión si es falsa:** El código que se ejecuta y devuelve si la condición es falsa.

---

# Evaluación y asignación implícita

Debido a que el operador ternario devuelve un valor, su uso más potente se da al inicializar variables basadas en una condición en una sola línea limpia de código.

```javascript
const edad = 20;

// El resultado de la evaluación se guarda directamente en 'estado'
const estado = edad >= 18 ? "Adulto" : "Menor de edad";

console.log(estado); // Imprime: "Adulto"
```

---

# Comparativa: `if...else` vs. Operador Ternario

Para entender su impacto visual y la reducción de verbosidad en el código, observemos cómo se resuelve el mismo problema con ambas estructuras:

### Estructura tradicional (`if...else`)
```javascript
let mensaje;
let esMiembro = true;

if (esMiembro) {
    mensaje = "La tarifa es de $2.00";
} else {
    mensaje = "La tarifa es de $10.00";
}
```

### Estructura moderna (Operador Ternario)
```javascript
const esMiembro = true;

// Todo compactado en una línea inmutable (const)
const mensaje = esMiembro ? "La tarifa es de $2.00" : "La tarifa es de $10.00";
```

---

# Analogía del mundo real: El interruptor de luz de dos vías 💡

Imagina que estás frente a un interruptor eléctrico en una habitación:

```
1. La condición es la posición del interruptor: ¿Está hacia arriba? (interruptorArriba).
2. Si la respuesta es SÍ (?), la consecuencia inmediata es que la bombilla se enciende ("Luz prendida").
3. Si la respuesta es NO (:), la consecuencia inmediata es que la habitación se queda a oscuras ("Luz apagada").

No hay estados intermedios ni caminos alternativos; es una bifurcación directa y binaria.
```

---

# Diagrama de flujo de decisión

```
               [ Evaluar Condición ]
                         │
            ┌────────────┴────────────┐
            ▼ ¿Es verdadera?          ▼ ¿Es falsa?
           [?]                       [:]
            │                         │
            ▼                         ▼
   [ Retorna Expresión 1 ]   [ Retorna Expresión 2 ]
            │                         │
            └────────────┬────────────┘
                         ▼
             [ Asignación Final ]
```

---

# Buenas prácticas

✅ **Úsalo solo para asignaciones simples:** Es ideal cuando el resultado final es una sola línea que asigna un string, un número, un booleano o ejecuta una función corta.

✅ **Prioriza la legibilidad:** Si la condición matemática o lógica es muy larga, envuelve la condición entre paréntesis `()` para que visualmente quede claro dónde termina la pregunta y dónde empieza la respuesta.

```javascript
const beneficio = (puntuacionCredito > 700 && ingresosMensuales > 3000) ? "Aprobado" : "Rechazado";
```

---

# Errores comunes

### ❌ Anidamiento excesivo (Ternarios encadenados)
Intentar replicar un `if...else if...else` usando múltiples operadores ternarios seguidos destruye por completo la legibilidad del código. Es considerado un antipatrón en el desarrollo profesional.

```javascript
// ❌ EVITAR ESTO: Es confuso y difícil de mantener
const tarifa = esEstudiante ? 5 : esAdultoMayor ? 7 : esSocio ? 10 : 15;
```

### ❌ Usarlo para ejecutar bloques de código complejos u operaciones múltiples
El operador ternario espera expresiones que devuelvan valores individuales. No intentes meter lógica compleja separada por comas o alterar múltiples estados dentro de las opciones.

```javascript
// ❌ INCORRECTO: Para lógica de control y múltiples acciones, usa if...else
autenticado ? (abrirSesion(), cargarPerfil(), redireccionar()) : mostrarError();
```

---

# Ejercicios

## Nivel 1
Escribe un operador ternario que evalúe si un número guardado en una variable `numero` es par o impar. El resultado debe asignar la cadena de texto `"Par"` o `"Impar"` a una constante llamada `resultado`.

## Nivel 2
Optimiza el siguiente bloque de código tradicional utilizando un único operador ternario dinámico:
```javascript
let acceso;
let rol = "admin";

if (rol === "admin") {
    acceso = true;
} else {
    acceso = false;
}
```

## Nivel 3
Crea una función flecha llamada `obtenerMensajeEnvio` que reciba dos parámetros: `totalCompra` y `esPremium` (booleano). Utiliza un operador ternario dentro del retorno implícito de la función para devolver `"Envío Gratis"` si el total de la compra es mayor o igual a 50 o si el usuario es premium. De lo contrario, debe devolver `"Costo de envío: $5"`.

---

# Resumen

* **El operador ternario** (`? :`) es una expresión compacta de tres operandos que sirve como alternativa directa a la estructura `if...else`.
* **Retorna un valor implícitamente**, lo que lo hace perfecto para realizar asignaciones directas de variables basadas en condiciones específicas.
* **No debe ser anidado** ni encadenado de forma sucesiva debido a que reduce severamente la legibilidad y mantenibilidad del software.


---

# Conceptos Complementarios: Ternario vs `??` (*Nullish Coalescing*) y `&&`

* **Operador Ternario (`cond ? a : b`):** Ideal cuando necesitas elegir entre **dos valores distintos** según una condición booleana.
* **Nullish Coalescing (`valor ?? "defecto"`):** Úsalo cuando solo quieras asignar un respaldo si el valor es `null` o `undefined` (a diferencia del ternario, respeta `0`, `false` y `""`).
* **Cortocircuito (`cond && accion()`):** Útil en JSX/React o expresiones simples cuando no hay rama `else`, aunque en JavaScript puro un `if` suele ser más legible.

---

# Solucionario paso a paso

## Solución Nivel 1
```javascript
const edad = 20;
const acceso = edad >= 18 ? "Permitido" : "Denegado";
console.log(acceso);
```

## Solución Nivel 2
```javascript
const esMiembro = true;
const total = 100;
const precioFinal = esMiembro ? total * 0.8 : total;
console.log(`Precio final: $${precioFinal}`);
```

## Solución Nivel 3
```javascript
const nota = 85;
const calificacion = nota >= 90 ? "Excelente"
                   : nota >= 70 ? "Aprobado"
                   : "Reprobado";
console.log(calificacion);
```

---

# Hoja de Trucos (Cheatsheet)

| Patrón | Ejemplo | Recomendación |
| :--- | :--- | :--- |
| Asignación simple | `const tipo = ok ? "Sí" : "No";` | ✅ Muy limpio |
| Retorno en función flecha | `const par = n => n % 2 === 0 ? "Par" : "Impar";` | ✅ Excelente |
| Ternarios anidados profundos | `a ? b ? c : d : e` | ❌ Mejor usar `if/else` o `switch` |
| Respaldo de `null`/`undefined` | `const nombre = input ?? "Anónimo";` | ✅ Preferir `??` |
