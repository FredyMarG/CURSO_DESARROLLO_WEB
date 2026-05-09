# 🧠 Funciones en JavaScript

# 📌 1. ¿Qué es una función?

Una **función** es un bloque de código reutilizable que ejecuta una tarea específica.

👉 A nivel avanzado:
Una función es un **objeto ejecutable con contexto y scope**.

---

## 🧠 Modelo mental completo

Una función tiene:
- Código
- Parámetros
- Scope (entorno léxico)
- Contexto (`this`)

---

## 📊 Flujo interno del motor JS

Definición → Guardar en memoria (heap)  
↓  
Invocación → Crear Execution Context  
↓  
Ejecución → Línea a línea  
↓  
Return → Devuelve valor  

---

# 🔧 2. Definición de función

## 🧩 Sintaxis básica

```js
function saludar() {
  console.log("Hola");
}
````

## ▶️ Llamado

```js
saludar();
```

---

## 🔎 Paso a paso interno

1. JS guarda la función en memoria
2. No se ejecuta automáticamente
3. Se ejecuta al llamarla

---

# 🔄 3. Formas de crear funciones

---

## 1️⃣ Declaración (Function Declaration)

```js
function suma(a, b) {
  return a + b;
}
```

### ✅ Características:

* Tiene hoisting
* Se puede usar antes de declararla

---

## 2️⃣ Expresión de función

```js
const resta = function(a, b) {
  return a - b;
};
```

### ⚠️:

* No tiene hoisting

---

## 3️⃣ Arrow Function

```js
const mult = (a, b) => a * b;
```

---

## ⚡ Forma corta

```js
const mult = (a, b) => a * b;
```

---

## 🔥 4️⃣ Función como valor

```js
const fn = suma;
fn(2, 3);
```

---

## 🔥 5️⃣ Callback

```js
function ejecutar(fn) {
  fn();
}

ejecutar(() => console.log("Hola"));
```

---

# 🔙 4. return

---

## 📌 ¿Qué hace?

* Devuelve un valor
* Termina la ejecución

---

## 🔎 Ejemplo paso a paso

```js
function cuadrado(n) {
  return n * n;
}

cuadrado(4);
```

Flujo:
n = 4 → return 16

---

## ⚠️ Errores comunes

```js
function test() {
  return 5;
  console.log("Nunca se ejecuta");
}
```

---

## ❗ Sin return

```js
function test() {}

console.log(test()); // undefined
```

---

## 🔥 Retornar funciones

```js
function multiplicador(x) {
  return function(y) {
    return x * y;
  };
}
```

---

# 📥 5. Parámetros

---

## 📌 Parámetros vs argumentos

```js
function saludar(nombre) {}

saludar("Juan");
```

* nombre → parámetro
* "Juan" → argumento

---

## Tipos de parámetros

### 1. Normales

```js
function suma(a, b) {}
```

---

### 2. Default

```js
function suma(a = 0, b = 0) {}
```

---

### 3. Rest (...)

```js
function sumar(...nums) {
  return nums.reduce((a, b) => a + b);
}
```

---

### 4. Destructuración

```js
function saludar({nombre}) {
  console.log(nombre);
}
```

---

# 🌍 6. Scope (Alcance)

---

## 📌 Tipos

* Global
* Local
* De bloque
* Léxico

---

## 🔎 Ejemplo

```js
let x = 5;

function test() {
  let x = 10;
  console.log(x);
}
```

---

## 📊 Resolución de variables

JS busca:

1. Scope local
2. Scope externo
3. Scope global

---

## ⚠️ Shadowing

```js
let x = 5;

function test() {
  let x = 10;
}
```

---

# 🔐 7. Scope léxico y Closures

---

## 📌 Clave

Una función recuerda dónde fue creada

---

## 🔥 Ejemplo

```js
function externa() {
  let x = 10;

  return function() {
    console.log(x);
  };
}

const fn = externa();
fn(); // 10
```

---

## 📌 Closure

Función que mantiene acceso a variables externas

---

## 🔥 Ejemplo real

```js
function contador() {
  let count = 0;

  return function() {
    count++;
    return count;
  };
}
```

---

## 📊 Flujo

contador()
↓
crea variable
↓
retorna función
↓
función recuerda variable

---

# 🔧 8. Execution Context

---

## 📌 Se crea al llamar función

Contiene:

* Variables
* Scope chain
* this

---

## 📊 Flujo

Llamada
↓
Crear contexto
↓
Ejecutar
↓
Eliminar

---

# 🔄 9. Hoisting

---

## 📌 JS mueve declaraciones arriba

---

## ✅ Funciona con:

* function ✔
* var ✔
* let/const ❌

---

## 🔥 Ejemplo

```js
saludar();

function saludar() {
  console.log("Hola");
}
```

---

## ❌ Error

```js
saludar();

const saludar = function() {};
```

---

# ⚡ 10. Arrow Functions

---

## 📌 Características

* Sintaxis corta
* No tienen `this` propio

---

## ❌ Error común

```js
const obj = {
  nombre: "Juan",
  saludar: () => console.log(this.nombre)
};
```

---

## ✅ Correcto

```js
const obj = {
  nombre: "Juan",
  saludar() {
    console.log(this.nombre);
  }
};
```

---

# 🔥 11. Callbacks

---

## 📌 Definición

Función pasada como argumento

---

## 🧠 Ejemplo real

```js
setTimeout(() => {
  console.log("Hola");
}, 1000);
```

---

# ⏳ 12. Funciones asíncronas

---

## 📌 async / await

```js
async function obtenerDatos() {
  let res = await fetch("url");
  return res.json();
}
```

---

## 📊 Flujo

Llamar → esperar → continuar

---

# 🧪 13. Funciones puras vs impuras

---

## ✅ Pura

```js
function suma(a, b) {
  return a + b;
}
```

---

## ❌ Impura

```js
let total = 0;

function suma(x) {
  total += x;
}
```

---

# 🚀 14. Buenas prácticas PRO

* Funciones pequeñas
* Una sola responsabilidad
* Evitar globales
* Nombres claros
* Preferir funciones puras

---

# 💀 15. ERRORES COMUNES

* No usar return
* Confundir scope
* Usar mal arrow functions
* Abusar de variables globales
* No entender closures



# 🎯 CONCLUSIÓN FINAL

Dominar funciones = dominar JavaScript

Incluye:

* Scope
* Closures
* Execution context
* this
* Async
* Callbacks

🚀 Nivel profesional completo

