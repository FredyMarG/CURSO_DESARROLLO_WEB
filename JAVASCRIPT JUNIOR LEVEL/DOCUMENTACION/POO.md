# 🧠 Guía Completa de Programación Orientada a Objetos (POO) en JavaScript

La **Programación Orientada a Objetos (POO)** organiza el código en torno a **objetos** que combinan **datos (propiedades)** y **comportamiento (métodos)**. Desde ES6, JavaScript ofrece la sintaxis `class` (azúcar sintáctico sobre su sistema de prototipos) y en ES2022+ incorporó campos privados reales (`#`).

---

## 1. Clases, Constructor e Instancias

Una **clase** es el molde; un **objeto (instancia)** es cada entidad creada a partir de ese molde usando `new`.

```javascript
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    describir() {
        return `${this.nombre} — $${this.precio}`;
    }
}

const laptop = new Producto("Laptop Pro", 1200);
console.log(laptop.describir()); // "Laptop Pro — $1200"
console.log(laptop instanceof Producto); // true
```

---

## 2. Encapsulamiento Real con Campos Privados (`#`) (ES2022)

Antes se usaba el prefijo `_propiedad` por convención, pero seguía siendo accesible desde fuera. Hoy el prefijo `#` garantiza **privacidad estricta** a nivel del motor de JS:

```javascript
class CuentaBancaria {
    #saldo = 0; // Campo privado: inaccesible fuera de la clase

    constructor(titular, saldoInicial = 0) {
        this.titular = titular;
        if (saldoInicial > 0) this.#saldo = saldoInicial;
    }

    depositar(monto) {
        if (monto <= 0) throw new Error("El monto debe ser positivo.");
        this.#saldo += monto;
    }

    get saldo() {
        return this.#saldo;
    }
}

const cuenta = new CuentaBancaria("Ana", 100);
cuenta.depositar(50);
console.log(cuenta.saldo); // 150
// console.log(cuenta.#saldo); // ❌ SyntaxError: Private field '#saldo' must be declared in an enclosing class
```

---

## 3. Getters y Setters (`get` / `set`)

Permiten leer o modificar propiedades ejecutando validaciones o cálculos automáticos, pero usándolas con la sintaxis limpia de una propiedad (`obj.prop`) en lugar de un método (`obj.prop()`).

```javascript
class Usuario {
    #edad;

    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad; // Invoca al setter automáticamente
    }

    get edad() {
        return this.#edad;
    }

    set edad(valor) {
        if (!Number.isInteger(valor) || valor < 0) {
            throw new RangeError("La edad debe ser un entero positivo.");
        }
        this.#edad = valor;
    }
}
```

---

## 4. Herencia (`extends`), `super` y Polimorfismo

Una subclase hereda propiedades y métodos de una clase padre con `extends`. Si defines un `constructor` en la subclase, **debes llamar a `super(...)` antes de usar `this`**.

```javascript
class Empleado {
    constructor(nombre, salarioBase) {
        this.nombre = nombre;
        this.salarioBase = salarioBase;
    }

    calcularPago() {
        return this.salarioBase;
    }
}

class Desarrollador extends Empleado {
    constructor(nombre, salarioBase, bono = 0) {
        super(nombre, salarioBase); // Llama al constructor de Empleado
        this.bono = bono;
    }

    // Polimorfismo: sobrescribe el método del padre
    calcularPago() {
        return super.calcularPago() + this.bono;
    }
}

const dev = new Desarrollador("Carlos", 2000, 500);
console.log(dev.calcularPago());      // 2500
console.log(dev instanceof Empleado); // true
```

---

## 5. Métodos y Propiedades Estáticas (`static`)

Pertenecen a la **clase en sí misma**, no a las instancias. Son ideales para utilidades o métodos fábrica (*factory methods*).

```javascript
class Validador {
    static LONGITUD_MINIMA = 4;

    static esNombreValido(nombre) {
        return typeof nombre === "string" && nombre.trim().length >= this.LONGITUD_MINIMA;
    }
}

console.log(Validador.esNombreValido("Sofía")); // true
console.log(Validador.esNombreValido("Ana"));   // false
```

---

## ⚠️ Errores Comunes

* **Olvidar `new` al instanciar:** `const p = Producto("TV", 500)` lanza `TypeError: Class constructor Producto cannot be invoked without 'new'`.
* **Usar `this` antes de `super()` en una subclase:** Lanza `ReferenceError`.
* **Perder el contexto de `this` al pasar métodos como callbacks:** `btn.addEventListener("click", obj.metodo)` hace que `this` sea el botón. Solución: `() => obj.metodo()` o `obj.metodo.bind(obj)`.
* **Llamar a un método `static` desde una instancia:** `new Validador().esNombreValido(...)` lanza `TypeError`.

## ✅ Buenas Prácticas

* Nombra las clases en `PascalCase` (`CuentaBancaria`, `CarritoCompras`).
* Protege el estado interno crítico con campos privados `#` y valida en los `setters` o métodos públicos.
* Prefiere la **composición** sobre jerarquías de herencia demasiado profundas (evita heredar más de 2 o 3 niveles).
* Usa `instanceof` cuando necesites verificar si un objeto pertenece a una clase o subclase específica.

---

## Hoja de Trucos (Cheatsheet) — POO en JavaScript

| Elemento | Sintaxis | Propósito |
| :--- | :--- | :--- |
| **Clase** | `class Nombre { ... }` | Plantilla para crear objetos |
| **Constructor** | `constructor(a, b) { this.a = a; }` | Se ejecuta automáticamente con `new` |
| **Campo privado** | `#secreto = 0;` | Propiedad encapsulada accesible solo dentro de la clase |
| **Getter / Setter** | `get prop() {}` / `set prop(v) {}` | Lectura calculada y escritura validada |
| **Herencia** | `class Hija extends Padre {}` | Reutiliza y extiende otra clase |
| **`super()`** | `super(arg)` / `super.metodo()` | Invoca constructor o método de la clase padre |
| **Estático** | `static utilidad() {}` | Se llama directo en la clase (`Clase.utilidad()`) |
| **Verificar tipo** | `obj instanceof Clase` | Devuelve `true` si `obj` deriva de `Clase` |
