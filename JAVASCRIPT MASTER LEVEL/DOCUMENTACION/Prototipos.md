# GUÍA — Prototipos y Herencia Prototípica en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender el funcionamiento interno de la orientación a objetos en JavaScript basada en prototipos, dominar la cadena de prototipos (`Prototype Chain`), manipular el `Prototype Object` y aprovechar sus características dinámicas en memoria.

---

# 📚 Temario

1. Prototipos: Definición
2. Prototype Chain (Cadena de Prototipos)
3. Prototype Object (El Objeto Prototipo)
4. Características de los Prototipos
   * 4.1. Un prototipo definido en su código fuente es mutable
   * 4.2. Es en sí mismo un objeto, así como otros
   * 4.3. Tiene una existencia física en la memoria
   * 4.4. Puede ser modificado y llamado
   * 4.5. Puede ser visto como un modelo ejemplar de una familia objeto
   * 4.6. Un objeto hereda propiedades (valores y métodos) de su prototipo
5. Analogía del mundo real
6. Diagrama de la Cadena de Prototipos
7. Buenas prácticas
8. Errores comunes
9. Ejercicios
10. Resumen

---

# Prototipos: Definición

A diferencia de lenguajes orientados a objetos tradicionales (como Java o C++) que utilizan **clases** como planos intangibles, JavaScript es un lenguaje **basado en prototipos**.

Un **prototipo** es un mecanismo mediante el cual los objetos en JavaScript heredan características entre sí. Cada objeto en JavaScript tiene una propiedad interna oculta (denominada `[[Prototype]]` en la especificación y accesible mediante `__proto__` o `Object.getPrototypeOf()`) que apunta a otro objeto: su prototipo.

```javascript
const usuario = {
    nombre: "Carlos"
};

// Aunque no definimos el método .toString(), podemos usarlo gracias a su prototipo
console.log(usuario.toString()); // "[object Object]"
```

---

# Prototype Chain (Cadena de Prototipos)

La **Prototype Chain** (Cadena de Prototipos) es el mecanismo de búsqueda escalonada que utiliza el motor de JavaScript cada vez que intentas acceder a una propiedad o método de un objeto.

Cuando solicitas una propiedad en un objeto, JavaScript sigue estos pasos:
1. Busca la propiedad directamente en el **objeto actual**.
2. Si no la encuentra, salta al **prototipo de ese objeto** (`[[Prototype]]`) y la busca allí.
3. Si tampoco está ahí, salta al **prototipo del prototipo**, subiendo eslabón por eslabón.
4. La búsqueda continúa hasta encontrar la propiedad o hasta llegar al final de la cadena: `Object.prototype`, cuyo prototipo final es **`null`**. Si llega a `null`, devuelve `undefined`.

```javascript
const abuelo = { apellido: "Pérez" };
const padre = Object.create(abuelo);
padre.profesion = "Ingeniero";

const hijo = Object.create(padre);
hijo.nombre = "Lucas";

// JavaScript busca 'apellido' en hijo -> no está -> sube a padre -> no está -> sube a abuelo -> ¡Lo encuentra!
console.log(hijo.apellido); // "Pérez"
```

---

# Prototype Object (El Objeto Prototipo)

Es fundamental distinguir entre el enlace oculto de una instancia (`[[Prototype]]` / `__proto__`) y la propiedad explícita **`prototype`** que poseen las funciones constructoras.

Cada vez que creas una función en JavaScript, el motor crea automáticamente un objeto asociado llamado **Prototype Object** y lo asigna a la propiedad `.prototype` de esa función. Este objeto servirá como molde base para todas las instancias creadas con el operador `new`.

| Concepto | Dónde vive | Qué representa |
| :--- | :--- | :--- |
| **`Función.prototype`** | En funciones constructoras y clases | Es el contenedor (molde) que se asignará como prototipo a los futuros objetos creados con `new`. |
| **`objeto.__proto__`** | En todas las instancias de objetos | Es el enlace o puente real que apunta hacia el `Prototype Object` de su constructor. |

```javascript
function Automovil(marca) {
    this.marca = marca;
}

// Agregamos un método al Prototype Object del constructor
Automovil.prototype.encender = function() {
    console.log(`El ${this.marca} está encendido.`);
};

const miAuto = new Automovil("Toyota");

// Comprobación de que apuntan al mismo objeto en memoria:
console.log(Object.getPrototypeOf(miAuto) === Automovil.prototype); // true
```

---

# Características de los Prototipos

Los prototipos en JavaScript no son plantillas estáticas bloqueadas en tiempo de compilación; son entidades vivas y flexibles con seis características fundamentales:

## 1. Un prototipo definido en su código fuente es mutable

Puedes alterar la estructura de un prototipo en tiempo de ejecución (incluso después de haber instanciado objetos). Todos los objetos vinculados a ese prototipo reflejarán los cambios de inmediato, ya que no copian las propiedades, sino que mantienen una referencia viva hacia él.

```javascript
function Robot(nombre) {
    this.nombre = nombre;
}

const bot1 = new Robot("R2-D2");

// Modificamos el prototipo DESPUÉS de haber creado la instancia 'bot1'
Robot.prototype.saludar = function() {
    return `Beep boop, soy ${this.nombre}`;
};

// ¡bot1 ya tiene acceso al nuevo método!
console.log(bot1.saludar()); // "Beep boop, soy R2-D2"
```

## 2. Es en sí mismo un objeto, así como otros

El prototipo no es un tipo de dato especial ni una estructura abstracta (como las clases en otros lenguajes). Es un **objeto común y corriente** de JavaScript con sus propias llaves y valores, y por ende, también tiene su propio prototipo (`Object.prototype`).

```javascript
function Persona() {}

console.log(typeof Persona.prototype); // "object"

// Como cualquier objeto, podemos inspeccionar sus llaves o agregarle atributos
Persona.prototype.especie = "Humano";
console.log(Object.keys(Persona.prototype)); // ["especie"]
```

## 3. Tiene una existencia física en la memoria

En los lenguajes basados en clases tradicionales, una clase es solo un plano en papel que no ocupa espacio como objeto ejecutable hasta que se instancia. En JavaScript, el **Prototype Object existe físicamente en un bloque de la memoria RAM (Heap)** desde el momento en que se declara su función constructora o objeto base.

> 💡 **Impacto en rendimiento:** Si creas 10,000 instancias de un objeto y defines sus métodos en el prototipo, el método solo existirá **una sola vez en la memoria física**, ahorrando recursos masivos.

```javascript
function Enemigo() {
    // ❌ MALA PRÁCTICA: Esto creará 1,000 funciones distintas en memoria si instancias 1,000 enemigos
    // this.atacar = function() { console.log("Ataque"); };
}

// ✅ BUENA PRÁCTICA: Existe 1 sola vez en la memoria física y los 1,000 enemigos lo comparten
Enemigo.prototype.atacar = function() {
    console.log("Ataque compartido en memoria");
};

const orco1 = new Enemigo();
const orco2 = new Enemigo();

// Demostración de que apuntan exactamente a la misma dirección de memoria física:
console.log(orco1.atacar === orco2.atacar); // true
```

## 4. Puede ser modificado y llamado

Al ser un objeto real en memoria, puedes agregarle, sobrescribirle o eliminarle propiedades con `delete`, e incluso **invocar sus métodos directamente** sin necesidad de crear una instancia primero.

```javascript
const PrototipoCalculadora = {
    version: "1.0",
    sumar: function(a, b) {
        return a + b;
    }
};

// 1. Llamado directo sin instanciar hijos
console.log(PrototipoCalculadora.sumar(5, 3)); // 8

// 2. Modificación directa en caliente
PrototipoCalculadora.version = "2.0";
delete PrototipoCalculadora.sumar;

console.log(PrototipoCalculadora.version); // "2.0"
```

## 5. Puede ser visto como un modelo ejemplar de una familia objeto

El prototipo actúa como el **patriarca o modelo ejemplar (arquetipo)** de una familia de objetos. Define el comportamiento y los rasgos genéticos base que caracterizan a todo un grupo o categoría de entidades dentro de tu aplicación.

```javascript
// Modelo ejemplar de la familia "Vehículo Acuático"
const ModeloAcuatico = {
    medio: "Agua",
    flotar() {
        console.log(`${this.nombre} está flotando en el ${this.medio}.`);
    }
};

// Familia de objetos creada a partir del modelo ejemplar
const barco = Object.create(ModeloAcuatico);
barco.nombre = "Titanic";

const submarino = Object.create(ModeloAcuatico);
submarino.nombre = "Nautilus";

barco.flotar();     // "Titanic está flotando en el Agua."
submarino.flotar(); // "Nautilus está flotando en el Agua."
```

## 6. Un objeto hereda propiedades (valores y métodos) de su prototipo

A través de la delegación en la cadena de prototipos, cualquier objeto hijo adquiere automáticamente acceso tanto a los **valores primitivos/propiedades** como a los **métodos (funciones)** declarados en su prototipo, ejecutándolos con su propio contexto (`this`).

```javascript
const PrototipoCuenta = {
    moneda: "USD", // Propiedad (Valor) heredado
    mostrarSaldo: function() { // Método heredado
        console.log(`Saldo actual: ${this.saldo} ${this.moneda}`);
    }
};

const cuentaAhorros = Object.create(PrototipoCuenta);
cuentaAhorros.saldo = 1500; // Propiedad propia de la instancia

// Accede tanto al método como al valor de su prototipo
cuentaAhorros.mostrarSaldo(); // "Saldo actual: 1500 USD"
```

---

# Analogía de la caja de herramientas familiar 🧰

Imagina cómo funciona el préstamo de herramientas en una familia de carpinteros:

```
1. Tú (El Objeto Instancia) necesitas un martillo para clavar un cuadro.
2. Revisas tu propio bolsillo (Tus propiedades propias). No tienes martillo.
3. En lugar de comprar uno nuevo, vas al taller de tu Padre (Tu Prototipo) y usas el suyo.
4. Si necesitas una sierra eléctrica y tu padre no la tiene, tu padre va al taller del Abuelo (El Prototipo del Prototipo).
5. Si el Abuelo compra un taladro nuevo hoy (Mutabilidad), tanto tu padre como tú pueden usarlo inmediatamente sin hacer nada extra.
6. El taller del padre existe físicamente en el garaje (Existencia en memoria), no es solo un dibujo en un plano.
```

---

# Diagrama de la Cadena de Prototipos

```
 [ Instancia: miAuto ]
   ├── marca: "Toyota" (Propiedad propia)
   └── [[Prototype]]
            │
            ▼
 [ Automovil.prototype ] (Existe físicamente en memoria)
   ├── encender: function()
   └── [[Prototype]]
            │
            ▼
 [ Object.prototype ] (Prototipo base de todo JS)
   ├── toString: function()
   ├── hasOwnProperty: function()
   └── [[Prototype]]
            │
            ▼
         [ null ] (Fin de la Prototype Chain)
```

---

# Buenas prácticas

✅ **Usa `Object.getPrototypeOf()` y `Object.create()`:** Evita usar la propiedad `__proto__` directamente en código de producción moderno, ya que fue estandarizada solo por razones de compatibilidad histórica y es lenta para el motor de JS. Usa `Object.getPrototypeOf(obj)` para leer y `Object.create(proto)` para heredar.

✅ **Coloca los métodos en el prototipo y los datos únicos en el constructor:** Define los atributos cambiantes (como `nombre`, `id`, `saldo`) dentro de la función constructora, y coloca todas las funciones y acciones dentro de `.prototype` para optimizar la memoria RAM.

✅ **Verifica propiedades propias con `Object.hasOwn()`:** Cuando recorras las llaves de un objeto (por ejemplo, con un bucle `for...in`), recuerda que este recorrerá también las propiedades heredadas del prototipo. Usa `Object.hasOwn(objeto, 'propiedad')` (o el clásico `objeto.hasOwnProperty()`) para filtrar solo las propias.

---

# Errores comunes

### ❌ Modificar el prototipo de objetos nativos globales (Monkey Patching)
Alterar `Object.prototype` o `Array.prototype` directamente es una mala práctica severa. Puede romper librerías de terceros o colisionar con futuras actualizaciones del lenguaje JavaScript.
```javascript
// ❌ PELIGRO: Nunca hagas esto en proyectos reales
Array.prototype.miMetodoInventado = function() { ... };
```

### ❌ Poner arrays u objetos mutables en el prototipo y modificarlos desde las instancias
Si colocas un Array en el prototipo y una instancia le hace `.push()`, **todas las demás instancias verán ese elemento agregado**, porque comparten el mismo objeto físico en memoria.
```javascript
const PrototipoUsuario = {
    amigos: [] // ⚠️ Compartido en la misma dirección de memoria
};

const user1 = Object.create(PrototipoUsuario);
const user2 = Object.create(PrototipoUsuario);

user1.amigos.push("Ana"); // Modifica el array del prototipo directamente

console.log(user2.amigos); // ❌ ["Ana"] -> ¡user2 ahora tiene los amigos de user1!
```

### ❌ Usar Arrow Functions (`=>`) para métodos en el prototipo
Las funciones flecha no tienen su propio contexto `this`, por lo que al ser llamadas desde una instancia no apuntarán al objeto hijo, sino al entorno global (`window` o `undefined`).
```javascript
function Perro(nombre) { this.nombre = nombre; }

// ❌ ERROR: 'this.nombre' dará undefined
Perro.prototype.ladrar = () => console.log(`${this.nombre} dice Guau!`);
```

---

# Ejercicios

## Nivel 1
Crea un objeto literal llamado `vehiculoPrototipo` que tenga una propiedad `ruedas: 4` y un método `arrancar()`. Luego, utilizando `Object.create()`, instancia un nuevo objeto `miCoche`, asígnale una propiedad propia `marca` y ejecuta el método heredado junto con la lectura de la propiedad `ruedas`.

## Nivel 2
Declara una función constructora `Personaje(nombre, vida)` e instancia dos objetos: `guerrero` y `mago`. Posterior a la creación de ambos, aprovecha la **mutabilidad** del prototipo para inyectar en `Personaje.prototype` un método `curar(puntos)` que incremente su vida. Comprueba en consola que ambos objetos comparten exactamente la misma referencia del método en memoria (`===`).

## Nivel 3
Construye una cadena de prototipos (`Prototype Chain`) de 3 niveles: `Entidad` -> `Empleado` -> `Desarrollador`. 
* `Entidad` debe tener un método `respirar()`.
* `Empleado` debe heredar de `Entidad` y tener una propiedad `empresa: "TechCorp"` y un método `trabajar()`.
* `Desarrollador` debe heredar de `Empleado` y tener un método `programar()`.
Instancia un objeto final y demuestra cómo puede invocar métodos de los 3 eslabones de la cadena, verificando con `Object.hasOwn()` cuáles propiedades le pertenecen directamente y cuáles son heredadas.

---

# Resumen

*   **Prototipo:** Es el objeto base del cual otros objetos heredan propiedades y comportamientos en JavaScript.
*   **Prototype Chain:** Es el camino de búsqueda ascendente que recorre JavaScript a través de los enlaces `[[Prototype]]` hasta encontrar una propiedad o toparse con `null`.
*   **Prototype Object:** Es el objeto contenedor alojado en `Constructor.prototype` que sirve como molde para las instancias creadas con `new`.
*   **Características clave:** Los prototipos son objetos reales con **existencia física única en memoria**, son **mutables en tiempo de ejecución**, pueden **ser llamados o editados directamente**, actúan como **modelos ejemplares de una familia de objetos** y permiten **heredar tanto valores como métodos**.
