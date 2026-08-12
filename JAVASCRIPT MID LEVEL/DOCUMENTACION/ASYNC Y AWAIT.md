# GUÍA — Async y Await en JavaScript

> **Nivel:** Desde principiante hasta avanzado (Junior → Semi Senior)
> **Objetivo:** Comprender completamente cómo funcionan `async` y `await`, cuándo utilizarlos, cómo evitar errores comunes y cómo escribir código asíncrono profesional.

---

# 📚 Temario

1. ¿Qué es la programación asíncrona?
2. ¿Qué es una Promise?
3. ¿Por qué nacieron async y await?
4. Sintaxis de async
5. Sintaxis de await
6. Flujo de ejecución
7. Ejemplos paso a paso
8. Manejo de errores con try/catch
9. Ejecutar tareas en paralelo
10. Await dentro de ciclos
11. Buenas prácticas
12. Errores comunes
13. Comparación con Promises
14. Casos reales
15. Diagrama mental
16. Ejercicios
17. Resumen

---

# ¿Qué es la programación asíncrona?

La programación asíncrona permite que JavaScript **no se quede esperando** mientras una tarea tarda en completarse.

Imagina que vas a un restaurante.

### Código síncrono

```
Llegas
↓
Pides comida
↓
Esperas sentado
↓
Comes
↓
Te vas
```

No haces absolutamente nada mientras esperas.

---

### Código asíncrono

```
Llegas
↓
Pides comida
↓
Mientras la preparan hablas con amigos
↓
La comida está lista
↓
Comes
```

Aquí aprovechas el tiempo.

Así funciona JavaScript.

---

# ¿Por qué existe async y await?

Antes se usaban únicamente Promises.

Ejemplo:

```javascript
obtenerUsuario()
.then(usuario => {
    return obtenerPedidos(usuario.id);
})
.then(pedidos => {
    console.log(pedidos);
})
.catch(error=>{
    console.log(error);
});
```

Aunque funciona, cuando el código crece termina apareciendo algo llamado:

> Promise Hell

Muchos `.then()` uno dentro de otro.

Para solucionarlo nació:

```
async
await
```

que hacen que el código parezca síncrono aunque realmente siga siendo asíncrono.

---

# ¿Qué es async?

`async` convierte una función normal en una función asíncrona.

```javascript
async function saludar(){

}
```

También:

```javascript
const saludar = async ()=>{

}
```

---

## ¿Qué ocurre al colocar async?

Esta función automáticamente devuelve una Promise.

```javascript
async function hola(){

    return "Hola";
}

console.log(hola());
```

Resultado:

```
Promise { "Hola" }
```

Aunque retornes un string.

Internamente JavaScript hace algo parecido a:

```javascript
return Promise.resolve("Hola");
```

---

# ¿Qué es await?

`await` significa literalmente

> Espera aquí.

Solo puede usarse dentro de funciones `async`.

Ejemplo

```javascript
const promesa = Promise.resolve("Hola");

async function ejemplo(){

    const mensaje = await promesa;

    console.log(mensaje);

}
```

Salida

```
Hola
```

---

# ¿Cómo funciona internamente?

Supongamos

```javascript
async function obtenerDatos(){

    const datos = await fetch(url);

    console.log(datos);

}
```

JavaScript hace aproximadamente esto:

```
Llamar fetch
↓

Esperar respuesta

↓

Cuando llegue

↓

Continuar ejecutando
```

Mientras tanto el resto del programa sigue funcionando.

---

# Ejemplo sencillo

```javascript
function esperar(){

    return new Promise(resolve=>{

        setTimeout(()=>{

            resolve("Terminó");

        },3000);

    });

}
```

Ahora usamos async.

```javascript
async function iniciar(){

    console.log("Inicio");

    const respuesta = await esperar();

    console.log(respuesta);

    console.log("Fin");

}

iniciar();
```

Salida

```
Inicio

(espera 3 segundos)

Terminó

Fin
```

---

# ¿Qué ocurre mientras espera?

```
Inicio

↓

await

↓

JavaScript sigue ejecutando otras tareas

↓

Promise termina

↓

Continúa
```

---

# Ejemplo del mundo real

Descargar una foto.

```javascript
async function descargar(){

    const imagen = await fetch("foto.jpg");

}
```

Mientras descarga:

* Puedes mover el mouse.
* Puedes escribir.
* Puedes hacer scroll.

El navegador nunca se congela.

---

# Varias esperas

```javascript
async function ejemplo(){

    const usuario = await obtenerUsuario();

    const pedidos = await obtenerPedidos();

    const pagos = await obtenerPagos();

}
```

Todo ocurre en este orden.

```
Usuario

↓

Pedidos

↓

Pagos
```

Es completamente secuencial.

---

# ¿Cómo ejecutar todo al mismo tiempo?

Mucha gente hace esto.

```javascript
const a = await tarea1();

const b = await tarea2();

const c = await tarea3();
```

Error.

Aquí esperas una por una.

Lo correcto:

```javascript
const [a,b,c]=await Promise.all([

    tarea1(),

    tarea2(),

    tarea3()

]);
```

Ahora:

```
Tarea1

Tarea2

Tarea3

↓

Todas terminan

↓

Continúa
```

Es mucho más rápido.

---

# Await dentro de un ciclo

Incorrecto

```javascript
for(const usuario of usuarios){

    await enviarCorreo(usuario);

}
```

Esto envía un correo a la vez.

Si hay 100 usuarios tardará muchísimo.

---

Correcto

```javascript
await Promise.all(

    usuarios.map(usuario=>enviarCorreo(usuario))

);
```

Todos comienzan casi simultáneamente.

---

# Manejo de errores

Siempre usa

```javascript
try{

}catch(error){

}
```

Ejemplo

```javascript
async function cargar(){

    try{

        const respuesta = await fetch(url);

        const datos = await respuesta.json();

        console.log(datos);

    }catch(error){

        console.log("Ocurrió un error");

        console.error(error);

    }

}
```

---

# Múltiples await dentro del try

```javascript
try{

    const usuario = await obtenerUsuario();

    const pedidos = await obtenerPedidos(usuario.id);

    const pagos = await obtenerPagos(usuario.id);

}catch(error){

}
```

Si cualquiera falla, pasa al `catch`.

---

# ¿Cuándo usar async?

Cuando la función necesita esperar:

* Peticiones HTTP
* Base de datos
* Leer archivos
* Escribir archivos
* Esperar temporizadores
* Consultar APIs
* Operaciones lentas

---

# Caso real con Fetch

```javascript
async function obtenerUsuarios(){

    try{

        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        const usuarios = await respuesta.json();

        console.log(usuarios);

    }catch(error){

        console.log(error);

    }

}

obtenerUsuarios();
```

---

# Analogía con un automóvil 🚗

Sin async

```
Conduces

↓

Semáforo rojo

↓

Apagas el carro

↓

Esperas

↓

Lo vuelves a prender
```

Muy ineficiente.

---

Con async

```
Conduces

↓

Semáforo rojo

↓

Esperas

↓

Continúas
```

El flujo sigue siendo ordenado y eficiente.

---

# Analogía con un perro 🐶

Lanzas una pelota.

```
Perro corre

↓

Tú esperas

↓

Regresa

↓

Continúas jugando
```

`await` sería esperar a que vuelva con la pelota antes de seguir con el siguiente lanzamiento.

---

# Diagrama completo

```
Inicio

↓

Función async

↓

Llega await

↓

Se pausa SOLO esa función

↓

JavaScript sigue trabajando

↓

Promise termina

↓

Continúa la función

↓

return
```

---

# Async + Await vs Then

Con Promise

```javascript
obtenerDatos()

.then(datos=>{

    console.log(datos);

})

.catch(error=>{

    console.log(error);

});
```

Con async

```javascript
try{

    const datos = await obtenerDatos();

    console.log(datos);

}catch(error){

    console.log(error);

}
```

La segunda versión suele ser más legible.

---

# Buenas prácticas

✅ Usa `await` únicamente cuando realmente necesites el resultado.

✅ Agrupa operaciones independientes con `Promise.all()`.

✅ Maneja errores con `try/catch`.

✅ Mantén las funciones pequeñas y con una sola responsabilidad.

✅ Usa nombres descriptivos (`obtenerUsuarios`, `guardarPedido`) para que el flujo sea fácil de leer.

---

# Errores comunes

### ❌ Usar await fuera de async

```javascript
const datos = await fetch(url);
```

Error.

Debe estar dentro de una función `async` (o en módulos con soporte para top-level await).

---

### ❌ Esperar tareas independientes

```javascript
await tarea1();
await tarea2();
await tarea3();
```

Usa `Promise.all()` si no dependen entre sí.

---

### ❌ No capturar errores

```javascript
const datos = await fetch(url);
```

Si falla la petición, la función puede rechazar la promesa y terminar con un error no controlado.

---

### ❌ Olvidar await

```javascript
const datos = fetch(url);

console.log(datos);
```

Obtendrás una `Promise`, no la respuesta.

---

# Casos reales

## Consumir una API

```javascript
const respuesta = await fetch(url);
const datos = await respuesta.json();
```

---

## Leer un archivo (Node.js)

```javascript
const contenido = await fs.readFile("datos.txt","utf8");
```

---

## Guardar en una base de datos

```javascript
await usuario.save();
```

---

## Esperar un temporizador

```javascript
await new Promise(resolve=>setTimeout(resolve,2000));
```

---

# Ejercicios

## Nivel 1

Crea una función `esperar()` que devuelva una promesa y espera 2 segundos antes de mostrar `"Listo"`.

---

## Nivel 2

Consume una API pública con `fetch` y muestra el nombre del primer usuario.

---

## Nivel 3

Realiza tres peticiones independientes y ejecútalas con `Promise.all()`.

---

## Nivel 4

Simula un sistema de compras:

1. Obtener usuario.
2. Obtener carrito.
3. Calcular total.
4. Realizar pago.
5. Mostrar confirmación.

Controla los errores con `try/catch`.

---

# Resumen

* `async` convierte una función en una función que devuelve una `Promise`.
* `await` pausa únicamente la ejecución de esa función hasta que la promesa se resuelva o rechace.
* `try/catch` es la forma recomendada de manejar errores con `async/await`.
* `Promise.all()` permite ejecutar varias tareas independientes en paralelo y esperar a que todas finalicen.
* `async/await` mejora la legibilidad del código, pero no hace que las operaciones sean más rápidas por sí mismas; la mejora proviene de usar correctamente la concurrencia cuando es posible.
* Comprender cómo interactúan `Promises`, `async`, `await` y el Event Loop es fundamental para desarrollar aplicaciones JavaScript modernas.
