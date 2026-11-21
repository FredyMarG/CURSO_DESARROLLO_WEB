# ⚡ Guía Completa de Funciones en JavaScript

Las funciones son bloques de código reutilizables que encapsulan lógica. En JavaScript las funciones son **ciudadanos de primera clase**: pueden guardarse en variables, pasarse como argumentos (*callbacks*) y devolverse desde otras funciones (*closures*).

---

## 1. Formas de Definir Funciones

### A. Declaración de Función (*Function Declaration*)
Tiene **Hoisting completo**: puedes invocarla incluso líneas antes de su definición.

```javascript
console.log(saludar("Ana")); // ✅ Funciona por hoisting

function saludar(nombre) {
    return `Hola, ${nombre}`;
}
```

### B. Expresión de Función (*Function Expression*)
Se asigna a una variable (`const`). No tiene hoisting usable antes de su línea (está en la TDZ).

```javascript
const sumar = function (a, b) {
    return a + b;
};
```

### C. Funciones Flecha (*Arrow Functions* — ES6+)
Sintaxis concisa, ideal para callbacks y funciones cortas.

```javascript
// Forma completa
const multiplicar = (a, b) => {
    return a * b;
};

// Retorno implícito (sin llaves)
const doble = n => n * 2;

// ⚠️ Para retornar implícitamente un objeto literal, envuélvelo en paréntesis:
const crearUsuario = (nombre, rol) => ({ nombre, rol });
```

**Diferencia clave (`this`):** Las *Arrow Functions* no crean su propio contexto `this`; heredan el `this` del ámbito donde fueron creadas. Además, no poseen el objeto `arguments` ni pueden usarse como constructores con `new`.

---

## 2. Parámetros Modernos: Por Defecto y Rest (`...`)

### Parámetros por Defecto (ES6)
Se aplican cuando el argumento no se envía o es `undefined`:

```javascript
function crearSaludo(nombre = "Invitado", idioma = "es") {
    return idioma === "es" ? `Hola, ${nombre}` : `Hello, ${nombre}`;
}
```

### Parámetros Rest (`...args`)
Agrupa un número indefinido de argumentos en un **array real**:

```javascript
function sumarTodos(...numeros) {
    return numeros.reduce((total, n) => total + n, 0);
}

console.log(sumarTodos(10, 20, 30, 40)); // 100
```

---

## 3. `return` y Retorno Temprano (*Early Return*)

Toda función sin `return` explícito devuelve `undefined`. Usar `return` al inicio para descartar casos inválidos evita anidar `if/else` innecesarios:

```javascript
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") return null;
    if (b === 0) return Infinity;
    return a / b;
}
```

---

## 4. Callbacks (Introducción)

Un **callback** es una función que se pasa como argumento a otra función para que esta la ejecute en el momento adecuado:

```javascript
function procesarOperacion(a, b, operacionCallback) {
    return operacionCallback(a, b);
}

const resultado = procesarOperacion(5, 3, (x, y) => x * y); // 15
```

Los callbacks son la base de eventos del DOM (`addEventListener`), temporizadores (`setTimeout`) y métodos de array (`.map()`, `.filter()`).

---

## 5. Closures (Introducción)

Un **closure** (clausura) ocurre cuando una función interna recuerda y puede acceder a las variables de su función padre, incluso después de que la función padre haya terminado de ejecutarse:

```javascript
function crearContador(inicial = 0) {
    let cuenta = inicial; // Variable privada protegida por el closure

    return function incrementar() {
        cuenta++;
        return cuenta;
    };
}

const contadorA = crearContador(10);
console.log(contadorA()); // 11
console.log(contadorA()); // 12
```

---

## ⚠️ Errores Comunes

* **Confundir referencia con invocación:** Pasar `miFuncion()` en lugar de `miFuncion` a un `addEventListener` la ejecuta inmediatamente en lugar de esperar al clic.
* **Olvidar paréntesis al retornar un objeto en Arrow Function:** `x => { id: x }` interpreta `{}` como bloque de función y devuelve `undefined`. Usa `x => ({ id: x })`.
* **Mutar parámetros u objetos externos sin intención:** Modificar un objeto recibido por parámetro afecta al objeto original fuera de la función (efectos secundarios).
* **Olvidar `return`:** Si una función calcula un valor pero no tiene `return`, devolverá `undefined`.

## ✅ Buenas Prácticas

* **Responsabilidad única:** Cada función debe hacer una sola tarea bien definida y tener un nombre verbal claro (`calcularTotal`, `validarEmail`).
* Usa `const` para declarar expresiones y *arrow functions*.
* Prefiere funciones puras (mismos argumentos → mismo resultado, sin efectos secundarios) siempre que sea posible.
* Limita los parámetros a 2 o 3; si necesitas más, pasa un objeto de opciones con destructuring: `function crear({ nombre, edad, rol = "user" }) {}`.

---

## Hoja de Trucos (Cheatsheet) — Funciones

| Concepto | Sintaxis | Característica clave |
| :--- | :--- | :--- |
| **Declaración** | `function fn(a) { return a; }` | Tiene hoisting completo |
| **Expresión** | `const fn = function(a) { return a; };` | Sin hoisting usable antes de la línea |
| **Arrow Function** | `const fn = a => a * 2;` | Retorno implícito y `this` léxico |
| **Retornar objeto** | `const fn = id => ({ id });` | Paréntesis obligatorios alrededor de `{}` |
| **Valor por defecto** | `function fn(x = 10) {}` | Se usa si `x` es `undefined` |
| **Parámetro Rest** | `function fn(...args) {}` | Recibe N argumentos como Array |
| **Callback** | `arr.map(item => item * 2)` | Función pasada como argumento |
| **Closure** | Función interna que recuerda su scope | Permite estado privado sin clases |
