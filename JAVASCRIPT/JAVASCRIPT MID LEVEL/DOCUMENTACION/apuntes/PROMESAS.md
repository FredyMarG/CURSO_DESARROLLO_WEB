# GUÍA — Promesas en JavaScript

---

# 🌐 ¿QUÉ ES UNA PROMESA?

Es un objeto que representa el resultado eventual (éxito o fracaso) de una operación asíncrona.

---

# 🧠 DEFINICIÓN SIMPLE

Una promesa es como un recibo en un restaurante de comida rápida:

> "Te doy este recibo (promesa). Significa que tu comida está pendiente. En el futuro, o bien te entrego tu hamburguesa (promesa resuelta) o te digo que se acabaron los ingredientes (promesa rechazada)."

---

# 🧠 DEFINICIÓN PROFESIONAL

Una **Promise** (Promesa) es un objeto de JavaScript que actúa como un contenedor para un valor que inicialmente es desconocido y que se resolverá de manera asíncrona.

Permite que los métodos asíncronos devuelvan valores de la misma manera que los métodos síncronos: en lugar de retornar inmediatamente el resultado final, el método asíncrono devuelve la promesa de suministrar el valor en algún momento futuro.

---

# 🚀 ¿POR QUÉ EXISTEN? (DE CALLBACKS A PROMESAS)

Antes de ES6 (2015), las operaciones asíncronas se gestionaban exclusivamente con **callbacks**.

Cuando se debían encadenar múltiples tareas asíncronas sucesivas, el código se anidaba hacia la derecha de forma descontrolada, creando una estructura difícil de leer y mantener conocida como **Callback Hell** o **Pyramid of Doom**.

### Callback Hell (Ejemplo conceptual)

```javascript
obtenerUsuario(id, (err, usuario) => {
    obtenerDetalles(usuario, (err, detalles) => {
        obtenerProyectos(detalles, (err, proyectos) => {
            obtenerTareas(proyectos[0], (err, tareas) => {
                console.log(tareas);
            });
        });
    });
});
```

---

### Solución con Promesas

Las promesas permiten aplanar esta estructura a través del encadenamiento:

```javascript
obtenerUsuario(id)
    .then(usuario => obtenerDetalles(usuario))
    .then(detalles => obtenerProyectos(detalles))
    .then(proyectos => obtenerTareas(proyectos[0]))
    .then(tareas => console.log(tareas))
    .catch(error => console.error(error));
```

---

# 🚦 LOS 3 ESTADOS DE UNA PROMESA

Una promesa en JavaScript pasa obligatoriamente por diferentes estados:

```text
               [ PENDING ] (Pendiente)
              /           \
             /             \
            V               V
     [ FULFILLED ]     [ REJECTED ]
      (Resuelta)       (Rechazada)
```

## 1. Pending (Pendiente)

Es el estado inicial de la promesa al ser creada. La operación asíncrona aún no ha terminado.

## 2. Fulfilled (Resuelta / Cumplida)

Significa que la operación asíncrona se completó con éxito. La promesa ahora tiene un **valor de resolución**.

## 3. Rejected (Rechazada / Fallida)

Significa que la operación asíncrona falló. La promesa ahora tiene una **razón de rechazo** (usualmente un objeto de error).

> [!IMPORTANT]
> Una promesa es **inmutable** una vez que cambia de estado (se resuelve o se rechaza). No puede cambiar de `fulfilled` a `rejected` ni viceversa.

---

# 🔧 ANATOMÍA DE UNA PROMESA

La estructura básica se compone de dos fases:

1. **La Creación**: Definir la lógica asíncrona.
2. **El Consumo**: Escuchar el resultado de esa lógica.

---

# 🛠️ CREACIÓN DE UNA PROMESA

Para crear una promesa se utiliza el constructor de la clase `Promise`.

```javascript
const miPromesa = new Promise((resolve, reject) => {
    // Aquí dentro se realiza la tarea asíncrona...
});
```

---

# 📋 EL CALLBACK EJECUTOR (`executor`)

La función que se pasa al constructor `new Promise` se llama **ejecutor**.

* Se ejecuta **inmediatamente** cuando la promesa es instanciada.
* Recibe dos argumentos que también son funciones: `resolve` y `reject`.

---

# 🟢 EL PARÁMETRO `resolve`

Es una función que debemos invocar cuando la tarea asíncrona se completa correctamente.

Al llamarla, le pasamos el resultado como argumento. Esto cambia el estado de la promesa de **Pending** a **Fulfilled**.

```javascript
const promesaExitosa = new Promise((resolve, reject) => {
    
    const datos = { id: 1, usuario: "Fredy" };
    
    resolve(datos); // Cambia el estado a Fulfilled y entrega los datos

});
```

---

# 🔴 EL PARÁMETRO `reject`

Es una función que debemos invocar cuando ocurre un error en la tarea asíncrona.

Al llamarla, le pasamos el error o el mensaje de error. Esto cambia el estado de la promesa de **Pending** a **Rejected**.

```javascript
const promesaFallida = new Promise((resolve, reject) => {
    
    reject("No se pudo conectar a la base de datos"); // Cambia el estado a Rejected

});
```

---

# 🍴 CONSUMO DE PROMESAS

Una vez que tenemos una promesa, usamos sus métodos integrados para reaccionar a su cambio de estado.

---

# 📥 EL MÉTODO `.then()`

El método `.then()` se ejecuta cuando la promesa pasa al estado **Fulfilled** (Resuelta).

Recibe como argumento una función que obtendrá el valor enviado a través del `resolve()`.

```javascript
promesaExitosa.then((resultado) => {

    console.log(resultado); // Muestra: { id: 1, usuario: "Fredy" }

});
```

---

# 📤 EL MÉTODO `.catch()`

El método `.catch()` se ejecuta cuando la promesa pasa al estado **Rejected** (Rechazada).

Recibe como argumento una función que obtendrá la razón de rechazo enviada a través del `reject()`.

```javascript
promesaFallida.catch((error) => {

    console.log(error); // Muestra: "No se pudo conectar a la base de datos"

});
```

---

# 🔄 EL MÉTODO `.finally()`

El método `.finally()` se ejecuta siempre que la promesa termina, sin importar si fue resuelta o rechazada.

No recibe argumentos de valor. Es muy útil para limpiar variables, cerrar conexiones o desactivar spinners de carga.

```javascript
miPromesa
    .then(res => console.log(res))
    .catch(err => console.error(err))
    .finally(() => {
        console.log("Proceso terminado."); // Ocurre siempre
    });
```

---

# 🔗 ENCADENAMIENTO DE PROMESAS (Promise Chaining)

Una de las ventajas clave de las promesas es la capacidad de encadenar llamadas de forma consecutiva.

Si dentro de un `.then()` retornamos un valor, ese valor estará disponible en el siguiente `.then()`. Si retornamos una **nueva promesa**, el siguiente `.then()` esperará a que esa nueva promesa se resuelva.

```javascript
const obtenerNumero = () => new Promise(resolve => resolve(5));

obtenerNumero()
    .then((numero) => {
        console.log(numero); // 5
        return numero * 2;   // Retornamos un valor normal
    })
    .then((resultado) => {
        console.log(resultado); // 10
        // Retornamos una nueva promesa asíncrona
        return new Promise(resolve => resolve(resultado + 5));
    })
    .then((nuevoResultado) => {
        console.log(nuevoResultado); // 15
    });
```

---

# 🚫 EVITANDO EL CALLBACK HELL

Veamos cómo se refactoriza el caso real de buscar un usuario e Instagram:

### Con Callbacks (Callback Hell)

```javascript
obtenerPersona(1, (err, persona) => {
    if (err) {
        console.log(err);
    } else {
        obtenerInstagram(persona.id, (error, instagram) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`El IG de ${persona.nombre} es ${instagram}`);
            }
        });
    }
});
```

---

### Con Promesas (Elegante y escalable)

```javascript
obtenerPersona(1)
    .then(persona => obtenerInstagram(persona))
    .then(datosInstagram => {
        console.log(`El IG de ${datosInstagram.nombre} es ${datosInstagram.instagram}`);
    })
    .catch(error => {
        // Captura errores de obtenerPersona o de obtenerInstagram indistintamente
        console.error("Error en el proceso:", error);
    });
```

---

# 🧰 MÉTODOS ESTÁTICOS ÚTILES

La clase `Promise` tiene métodos estáticos globales para manejar múltiples promesas en paralelo.

## 1. Promise.all()

Recibe un array de promesas. Se resuelve cuando **todas** las promesas del array se han resuelto con éxito. Si una sola falla, toda la operación falla inmediatamente (todo o nada).

```javascript
Promise.all([promesa1, promesa2, promesa3])
    .then(([res1, res2, res3]) => {
        console.log("Todas resueltas");
    })
    .catch(error => {
        console.error("Una falló:", error);
    });
```

---

## 2. Promise.allSettled()

Recibe un array de promesas. Espera a que todas finalicen (sean resueltas o rechazadas). Devuelve un array de objetos con el estado y resultado de cada una de ellas. Nunca se rechaza globalmente.

```javascript
Promise.allSettled([promesa1, promesa2])
    .then((resultados) => {
        resultados.forEach(res => console.log(res.status)); // "fulfilled" o "rejected"
    });
```

---

## 3. Promise.race()

Recibe un array de promesas. Se resuelve o rechaza tan pronto como **la primera** promesa del array se resuelva o se rechace. Es una "carrera" de velocidad.

```javascript
Promise.race([descargaRapida, descargaLenta])
    .then(primeraEnTerminar => {
        console.log(primeraEnTerminar);
    });
```

---

## 4. Promise.any() (ES2021)

Recibe un array de promesas y se resuelve con el valor de **la primera promesa que tenga éxito** (`fulfilled`), ignorando los rechazos previos. Solo falla (lanzando un `AggregateError`) si **todas** las promesas son rechazadas. Es ideal para consultar múltiples servidores espejo (mirrors) y quedarse con el primero que responda bien.

```javascript
Promise.any([servidorMirror1, servidorMirror2, servidorMirror3])
    .then(dato => console.log("Primer servidor exitoso:", dato))
    .catch(err => console.error("Todos fallaron:", err.errors));
```

---

## 5. Promise.withResolvers() (ES2024)

Introducido en **ECMAScript 2024**, permite extraer `{ promise, resolve, reject }` directamente sin tener que anidar el código dentro del callback ejecutor `new Promise((resolve, reject) => ...)`. Es muy útil cuando necesitas resolver una promesa desde un evento externo o desde fuera de su creación.

```javascript
const { promise, resolve, reject } = Promise.withResolvers();

// Puedes pasar resolve/reject a manejadores externos limpiamente
botonConfirmar.addEventListener("click", () => resolve("Confirmado"), { once: true });
botonCancelar.addEventListener("click", () => reject(new Error("Cancelado")), { once: true });

promise.then(console.log).catch(console.error);
```

---

# ⏱️ EVENT LOOP: MICROTASKS VS. MACROTASKS

Las callbacks de las promesas (`.then`, `.catch`, `.finally`) no se ejecutan inmediatamente ni en la misma cola que `setTimeout`. Viven en la **Microtask Queue (Cola de Microtareas)**, que tiene **mayor prioridad** que la **Macrotask Queue** (`setTimeout`, `setInterval`, eventos DOM).

```javascript
console.log("1. Síncrono");

setTimeout(() => console.log("4. Macrotask (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3. Microtask (Promise.then)"));

console.log("2. Síncrono");
// Orden real de salida: 1 -> 2 -> 3 -> 4
```

---

# ✅ BUENAS PRÁCTICAS

* ✅ **Retorna siempre en los `.then()`:** Garantiza que la cadena reciba el valor o espere la siguiente promesa.
* ✅ **Rechaza siempre con objetos `Error` (`reject(new Error("..."))`):** Así conservas el `stack trace` para depurar, en lugar de pasar strings simples.
* ✅ **Usa `Promise.allSettled()` cuando necesites resultados parciales:** Si cargar un widget secundario falla, no arruines toda la pantalla usando `Promise.all()`.
* ✅ **Prefiere `async/await` para flujos secuenciales complejos** y combina con `Promise.all` para tareas independientes en paralelo.

---

# ⚠️ ERRORES COMUNES

## 1. Olvidar retornar la promesa en una cadena

Si no usas `return` dentro de un `.then()`, la siguiente función en la cadena se ejecutará inmediatamente recibiendo `undefined` como parámetro.

```javascript
// INCORRECTO
obtenerPersona(1)
    .then(persona => {
        obtenerInstagram(persona); // Falta el return
    })
    .then(ig => {
        console.log(ig); // undefined
    });

// CORRECTO
obtenerPersona(1)
    .then(persona => {
        return obtenerInstagram(persona); // Correcto
    })
    .then(ig => {
        console.log(ig); // Datos de Instagram
    });
```

---

## 2. No colocar el bloque `.catch()`

Si una promesa se rechaza y no hay un `.catch()`, JavaScript lanzará un error de tipo `UnhandledPromiseRejection` en la consola, lo cual puede colgar ciertas aplicaciones de Node.js o ensuciar la consola del navegador.

```javascript
// INCORRECTO (Peligroso)
obtenerPersona(10).then(res => console.log(res));

// CORRECTO
obtenerPersona(10)
    .then(res => console.log(res))
    .catch(error => console.error(error));
```

---

## 3. Anidar promesas (Promise Hell)

Crear promesas anidadas dentro de `.then()` recrea el callback hell que intentamos evitar.

```javascript
// INCORRECTO
obtenerPersona(1).then(persona => {
    obtenerInstagram(persona).then(ig => {
        console.log(ig);
    });
});

// CORRECTO
obtenerPersona(1)
    .then(persona => obtenerInstagram(persona))
    .then(ig => console.log(ig));
```

---

# 📝 EJERCICIOS PRÁCTICOS

## Ejercicio 1

Crear una función `verificarEdad(edad)` que devuelva una promesa. Si la edad es mayor o igual a 18, debe resolverse con `"Acceso permitido"`. Si es menor, debe rechazarse con `"Acceso denegado"`.

```javascript
const verificarEdad = (edad) => {
    return new Promise((resolve, reject) => {
        if (edad >= 18) {
            resolve("Acceso permitido");
        } else {
            reject("Acceso denegado");
        }
    });
};

verificarEdad(20)
    .then(msg => console.log(msg))
    .catch(err => console.error(err));
```

---

## Ejercicio 2

Crear una simulación de descarga de archivo que demore 3 segundos. Debe usar `setTimeout` y resolver con `"Archivo descargado correctamente"`.

---

## Ejercicio 3

Dadas dos promesas, una que tarda 1 segundo y otra que tarda 2 segundos. Utilizar `Promise.all` para ejecutar ambas y mostrar los resultados consolidados de ambas descargas.

---

# 📌 RESUMEN FINAL

* Las **Promesas** resuelven la complejidad y desorden de los callbacks.
* Tienen 3 estados: **Pending** (inicial), **Fulfilled** (operación exitosa) y **Rejected** (operación fallida).
* Se crean con `new Promise((resolve, reject) => { ... })`.
* Se consumen con `.then()` para el éxito, `.catch()` para los errores y `.finally()` para tareas de cierre.
* Permiten el encadenamiento (`chaining`) de operaciones consecutivas de forma limpia y legible.

---

# 📋 HOJA DE TRUCOS (CHEATSHEET)

| API / Método | Comportamiento | Caso de uso ideal |
| :--- | :--- | :--- |
| `new Promise((res, rej) => ...)` | Crea una promesa manualmente. | Envolver APIs antiguas basadas en callbacks. |
| `Promise.withResolvers()` | Devuelve `{ promise, resolve, reject }` (ES2024). | Resolver promesas desde eventos externos. |
| `Promise.resolve(val)` / `reject(err)` | Crea una promesa ya resuelta o rechazada. | Tests, valores por defecto o caché inmediata. |
| `.then(fn)` / `.catch(fn)` / `.finally(fn)` | Maneja éxito, error y limpieza final. | Consumo y encadenamiento de promesas. |
| `Promise.all([...])` | Espera a todas; falla rápido si **una** rechaza. | Cargar datos dependientes entre sí en paralelo. |
| `Promise.allSettled([...])` | Espera a todas; devuelve estado de cada una. | Múltiples peticiones independientes sin abortar todo. |
| `Promise.race([...])` | Gana la primera en terminar (éxito o error). | Competencia de velocidad o timeouts manuales. |
| `Promise.any([...])` | Gana la primera en **resolverse** con éxito (ES2021). | Consultar múltiples servidores espejo (fallback). |
| Microtask Queue | Cola prioritaria de `.then/.catch` en el Event Loop. | Se ejecuta antes que cualquier `setTimeout(..., 0)`. |
