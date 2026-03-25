# 🧠 PROGRAMACIÓN ORIENTADA A OBJETOS (POO)

## 🚀 Guía Definitiva Nivel DIOS

---

# 📌 1. ¿Qué es la POO?

La **Programación Orientada a Objetos (POO)** es un paradigma de programación que organiza el código en torno a **objetos**, los cuales representan entidades del mundo real.

### 💡 Idea clave

En vez de pensar en funciones sueltas, pensamos en:

```
Objeto = Datos (atributos) + Comportamiento (métodos)
```

---

## 🎯 ¿Para qué sirve?

* Modelar problemas reales
* Reutilizar código
* Hacer sistemas escalables
* Facilitar mantenimiento

---

## 🧪 Ejemplo básico

```js
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre
        this.edad = edad
    }

    saludar() {
        return `Hola, soy ${this.nombre}`
    }
}

const p1 = new Persona("Juan", 20)
console.log(p1.saludar())
```

---

# 🧩 2. CONCEPTOS BÁSICOS DE POO

---

## 🏗️ Clase

Es una **plantilla** para crear objetos.

```
Clase → Molde
Objeto → Producto final
```

```js
class Auto {
    marca = ""
    color = ""
}
```

---

## 📦 Objeto

Es una **instancia de una clase**.

```js
const carro = new Auto()
```

---

## 🧾 Atributo

Son las **propiedades** del objeto.

```js
this.nombre = "Juan"
this.edad = 20
```

---

## ⚙️ Método

Son funciones dentro de la clase.

```js
saludar() {
    return "Hola"
}
```

---

## 🏁 Constructor

Método especial que se ejecuta al crear el objeto.

```js
constructor(nombre) {
    this.nombre = nombre
}
```

---

## 🧬 Instanciación

Proceso de crear un objeto.

```js
const persona = new Persona("Ana", 25)
```

---

# 🧱 3. CARACTERÍSTICAS DE LA POO

---

## 🧠 Abstracción

Oculta los detalles internos y muestra solo lo necesario.

### 📊 Ejemplo

```
[ Usuario ]
     |
     | → login()
     | → logout()

(No importa cómo funciona internamente)
```

---

## 🧩 Modularidad

Divide el sistema en partes independientes.

```
Sistema
 ├── Usuario.js
 ├── Producto.js
 └── Carrito.js
```

---

## 🧬 Jerarquía

Organiza clases en niveles.

```
Animal
 ├── Perro
 └── Gato
```

---

# 🔥 4. OTROS CONCEPTOS CLAVE

---

## 🔁 Polimorfismo

Un mismo método puede comportarse diferente.

```js
class Animal {
    sonido() {
        return "Sonido genérico"
    }
}

class Perro extends Animal {
    sonido() {
        return "Ladrido"
    }
}
```

---

## 🧬 Herencia

Permite que una clase herede de otra.

```js
class Animal {
    respirar() {
        return "Respirando"
    }
}

class Perro extends Animal {}
```

---

## 🔒 Encapsulamiento

El **encapsulamiento** consiste en **proteger los datos internos de un objeto** y controlar cómo se accede o modifica.

### 💡 Idea clave

```
NO acceder directamente a los datos
SÍ usar métodos controlados
```

---

## 🧠 ¿Por qué es importante?

* Evita modificaciones incorrectas
* Permite validar datos
* Hace el código más seguro
* Mejora mantenimiento

---

## 🔐 Ejemplo básico (sin encapsulamiento)

```js
class Cuenta {
    saldo = 0
}

const c = new Cuenta()
c.saldo = -1000 // ❌ Error lógico (no controlado)
```

---

## ✅ Ejemplo con encapsulamiento

```js
class Cuenta {
    #saldo = 0

    depositar(valor) {
        if (valor > 0) {
            this.#saldo += valor
        }
    }

    verSaldo() {
        return this.#saldo
    }
}
```

---

# ⚙️ MÉTODOS ACCESORES (GETTERS Y SETTERS)

Son métodos especiales para **leer y modificar atributos privados de forma controlada**.

---

## 👁️ Getter (obtener valor)

Permite acceder a un valor como si fuera una propiedad.

```js
class Persona {
    #edad

    constructor(edad) {
        this.#edad = edad
    }

    get edad() {
        return this.#edad
    }
}

const p = new Persona(20)
console.log(p.edad) // 20
```

### 🔍 ¿Qué pasa aquí?

* `get edad()` actúa como propiedad
* No necesitas usar paréntesis
* Protege el acceso al dato

---

## ✏️ Setter (modificar valor)

Permite cambiar un valor con validación.

```js
class Persona {
    #edad

    constructor(edad) {
        this.#edad = edad
    }

    set edad(valor) {
        if (valor >= 0) {
            this.#edad = valor
        } else {
            console.log("Edad inválida")
        }
    }
}

const p = new Persona(20)
p.edad = -5 // ❌ bloqueado
p.edad = 25 // ✅ válido
```

---

## 🔥 Getter + Setter completo

```js
class Usuario {
    #password

    constructor(password) {
        this.#password = password
    }

    get password() {
        return "********" // nunca mostrar real
    }

    set password(nueva) {
        if (nueva.length >= 6) {
            this.#password = nueva
        } else {
            console.log("Contraseña muy corta")
        }
    }
}
```

---

## 🧩 Diagrama mental

```
[ Usuario ]
     |
     | → get password()   → leer seguro
     | → set password()   → validar antes de cambiar
     |
     └── #password (privado)
```

---

## ⚠️ Errores comunes con getters/setters

* ❌ Olvidar validaciones en setters
* ❌ Exponer directamente datos sensibles
* ❌ Pensar que son funciones normales

---

## ✅ Buenas prácticas

* ✔️ Usar getters para solo lectura
* ✔️ Validar SIEMPRE en setters
* ✔️ No abusar (solo cuando sea necesario)
* ✔️ Mantener atributos privados (`#`)

---

## 🧠 Nivel PRO (detalle importante)

Los getters y setters permiten:

* Crear lógica sin cambiar cómo se usa el objeto
* Simular propiedades dinámicas
* Mantener compatibilidad si cambias implementación interna

---

## 🚀 Ejemplo avanzado

```js
class Producto {
    #precio

    constructor(precio) {
        this.#precio = precio
    }

    get precioConIVA() {
        return this.#precio * 1.19
    }
}

const p = new Producto(100)
console.log(p.precioConIVA) // 119
```

👉 Aquí el getter actúa como una propiedad calculada

---

🔥 **Conclusión:**

Encapsular + usar getters/setters = código seguro, profesional y escalable.

Es una de las diferencias clave entre un programador básico y uno avanzado.

---

# ⚠️ ERRORES COMUNES

* ❌ No usar clases cuando el problema lo requiere
* ❌ Mezclar lógica sin estructura
* ❌ No entender "this"
* ❌ Crear clases innecesarias

---

# ✅ BUENAS PRÁCTICAS

* ✔️ Una clase = una responsabilidad
* ✔️ Usar nombres claros
* ✔️ Evitar código repetido (usar herencia)
* ✔️ Encapsular datos importantes

---

# 🧠 RESUMEN FINAL

```
POO
 ├── Clase
 ├── Objeto
 ├── Atributos
 ├── Métodos
 ├── Herencia
 ├── Polimorfismo
 └── Encapsulamiento
```

---

---

# ⚡ MÉTODOS ESTÁTICOS (STATIC)

Los **métodos estáticos** pertenecen a la clase, **no a los objetos**.

### 💡 Idea clave

```
Se usan SIN crear una instancia
```

---

## 🧠 ¿Para qué sirven?

* Crear utilidades relacionadas con la clase
* Operaciones generales
* Validaciones
* Métodos auxiliares

---

## 🧪 Ejemplo básico

```js
class Matematica {
    static sumar(a, b) {
        return a + b
    }
}

console.log(Matematica.sumar(5, 3)) // 8
```

👉 No necesitas hacer:

```js
const m = new Matematica()
```

---

## ⚠️ Diferencia clave

```js
class Ejemplo {
    static estatico() {
        return "Soy estático"
    }

    normal() {
        return "Soy normal"
    }
}

Ejemplo.estatico() // ✅

const e = new Ejemplo()
e.normal() // ✅

e.estatico() // ❌ Error
```

---

## 🧩 Diagrama mental

```
Clase
 ├── static metodo()   → se usa directo
 └── metodo()          → necesita objeto
```

---

## 🔥 Ejemplo real (validaciones)

```js
class Usuario {
    constructor(nombre) {
        this.nombre = nombre
    }

    static validarNombre(nombre) {
        return nombre.length > 3
    }
}

console.log(Usuario.validarNombre("Ana")) // true
```

---

## 🧠 Nivel PRO

Puedes combinar métodos estáticos con encapsulamiento:

```js
class Cuenta {
    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    static crearCuentaBasica() {
        return new Cuenta(0)
    }
}

const c = Cuenta.crearCuentaBasica()
```

👉 Aquí el método estático actúa como **fábrica de objetos**

---

## ⚠️ Errores comunes

* ❌ Intentar usar `this` como si fuera instancia
* ❌ Llamar métodos estáticos desde objetos
* ❌ Usarlos cuando deberían ser métodos normales

---

## ✅ Buenas prácticas

* ✔️ Usarlos para utilidades relacionadas
* ✔️ Usarlos como "factory methods"
* ✔️ Mantener lógica independiente de instancia

---

🔥 **Conclusión:**

Los métodos estáticos son ideales para lógica general que no depende de un objeto específico.

---

# 🚀 CONCLUSIÓN

La POO te permite escribir código más organizado, reutilizable y fácil de mantener. Es fundamental para proyectos grandes y desarrollo profesional.

---

🔥 Si dominas esto, estás a otro nivel.
