# GUÍA — Callbacks

## Introducción

Los **Callbacks** son una técnica fundamental de JavaScript que consiste en **pasar una función como argumento a otra función** para que sea ejecutada posteriormente.

En otras palabras:

> Una función le dice a otra función: **"Cuando termines tu trabajo, ejecuta esta otra función."**

Los callbacks fueron la principal herramienta para manejar tareas asíncronas antes de la llegada de las **Promises** y **Async/Await**.

Aunque actualmente existen alternativas más modernas, comprenderlos sigue siendo indispensable porque son la base de gran parte del funcionamiento interno de JavaScript.

---

# 1. Concepto (Function in Function)

## Definición

Un callback es:

> Una función que se envía como argumento a otra función y que será ejecutada posteriormente.

## Sintaxis básica

```javascript
function principal(callback){

    callback();

}

function saludar(){

    console.log("Hola");

}

principal(saludar);
```

### Salida

```text
Hola
```

---

## ¿Qué está ocurriendo?

```text
saludar
   |
   |
   V

principal(saludar)

principal recibe la función

↓

callback()

↓

Hola
```

---

# 2. Anatomía de un Callback

Existen dos componentes principales.

## Función principal

Es la encargada de realizar una tarea.

```javascript
function principal(callback){

}
```

---

## Callback

Es la función que se ejecutará después.

```javascript
function callback(){

}
```

---

## Relación entre ambas

```text
Función Principal

↓

Recibe Callback

↓

Ejecuta Callback
```

---

# 3. Ejemplo sencillo

```javascript
function mostrarMensaje(nombre, callback){

    console.log("Hola " + nombre);

    callback();

}

function despedirse(){

    console.log("Hasta luego");

}

mostrarMensaje("Juan", despedirse);
```

### Salida

```text
Hola Juan

Hasta luego
```

---

# 4. Ejemplo usando una función anónima

No siempre es necesario crear una función aparte.

```javascript
function mostrarMensaje(nombre, callback){

    console.log("Hola " + nombre);

    callback();

}

mostrarMensaje("Juan", function(){

    console.log("Hasta luego");

});
```

### Salida

```text
Hola Juan

Hasta luego
```

---

# 5. Ejemplo usando Arrow Function

```javascript
function mostrarMensaje(nombre, callback){

    console.log("Hola " + nombre);

    callback();

}

mostrarMensaje("Juan", ()=>{

    console.log("Hasta luego");

});
```

---

# 6. Ejemplos del mundo real

## Ejemplo 1: Preparar un café

```javascript
function prepararCafe(callback){

    console.log("Preparando café...");

    callback();

}

function servirCafe(){

    console.log("☕ Café servido");

}

prepararCafe(servirCafe);
```

### Salida

```text
Preparando café...

☕ Café servido
```

---

### Diagrama

```text
Preparar café

↓

Termina

↓

Servir café
```

---

## Ejemplo 2: Lavar un carro

```javascript
function lavarCarro(callback){

    console.log("Lavando carro...");

    callback();

}

function secarCarro(){

    console.log("Secando carro...");

}

lavarCarro(secarCarro);
```

### Salida

```text
Lavando carro...

Secando carro...
```

---

## Ejemplo 3: Un videojuego

```javascript
function iniciarPartida(callback){

    console.log("Partida iniciada");

    callback();

}

function generarEnemigos(){

    console.log("Enemigos creados");

}

iniciarPartida(generarEnemigos);
```

### Salida

```text
Partida iniciada

Enemigos creados
```

---

# 7. Ejemplo con parámetros

```javascript
function calcular(a,b,callback){

    callback(a,b);

}

function sumar(a,b){

    console.log(a+b);

}

calcular(5,10,sumar);
```

### Salida

```text
15
```

---

# 8. Ejemplo avanzado

```javascript
function calcular(a,b,callback){

    return callback(a,b);

}

const resultado = calcular(20,5,(a,b)=>{

    return a*b;

});

console.log(resultado);
```

### Salida

```text
100
```

---

# 9. Uso en programación asíncrona

Los callbacks fueron creados principalmente para esperar procesos lentos.

Por ejemplo:

* Leer archivos.
* Consultar bases de datos.
* Realizar peticiones HTTP.
* Esperar respuestas de servidores.
* Ejecutar temporizadores.

---

## Ejemplo con setTimeout

```javascript
setTimeout(()=>{

    console.log("Proceso terminado");

},3000);
```

### Salida

```text
(3 segundos)

Proceso terminado
```

---

## ¿Qué hace setTimeout?

```javascript
setTimeout(callback, tiempo);
```

Diagrama:

```text
Callback

↓

Esperar tiempo

↓

Ejecutar callback
```

---

# 10. Problemas de los Callbacks

Aunque son útiles, presentan varias desventajas.

---

## Problema 1: Callback Hell (Pirámide de la muerte)

Sucede cuando se anidan demasiados callbacks.

```javascript
funcion1(()=>{

    funcion2(()=>{

        funcion3(()=>{

            funcion4(()=>{

                funcion5(()=>{

                });

            });

        });

    });

});
```

Visualmente:

```text
funcion1

↓

funcion2

↓

funcion3

↓

funcion4

↓

funcion5
```

### Consecuencias

* Difícil lectura.
* Difícil mantenimiento.
* Difícil depuración.

---

## Problema 2: Código difícil de depurar

```javascript
funcion1(()=>{

    funcion2(()=>{

        funcion3(()=>{

            console.log(variable);

        });

    });

});
```

Si aparece un error:

```text
ReferenceError
```

Puede ser complicado encontrar su origen.

---

## Problema 3: Menor mantenibilidad

Modificar una parte del código puede afectar múltiples secciones.

```text
Cambiar funcion3

↓

Afecta funcion4

↓

Afecta funcion5
```

---

## Problema 4: Código desordenado

```javascript
funcion1(()=>{

    funcion2(()=>{

        funcion3(()=>{

            funcion4(()=>{

                funcion5(()=>{

                    funcion6(()=>{

                    });

                });

            });

        });

    });

});
```

La legibilidad disminuye considerablemente.

---

## Problema 5: Manejo complejo de errores

```javascript
leerArchivo((error,data)=>{

    if(error){

        console.log(error);

        return;

    }

    console.log(data);

});
```

El manejo de errores debe realizarse manualmente.

---

# 11. Soluciones modernas

Actualmente se utilizan herramientas más modernas.

## Promises

```javascript
miPromesa()

.then(()=>{

})

.catch(()=>{

});
```

---

## Async/Await

```javascript
async function ejecutar(){

    try{

        const datos = await obtenerDatos();

    }

    catch(error){

        console.log(error);

    }

}
```

---

# 12. ¿Los callbacks están obsoletos?

No.

Pero:

```text
No son la opción principal actualmente.
```

La evolución fue:

```text
Callbacks

↓

Promises

↓

Async/Await
```

Los callbacks siguen siendo importantes porque muchas librerías aún los utilizan.

---

# 13. ¿Cuándo usar Callbacks?

### Sí utilizarlos cuando:

✅ Una librería los requiera.

✅ La tarea sea pequeña.

✅ Se necesite ejecutar una función después de otra.

✅ Se manejen eventos simples.

---

# 14. ¿Cuándo NO utilizarlos?

❌ Procesos complejos.

❌ Muchas tareas consecutivas.

❌ Procesos asíncronos extensos.

❌ Aplicaciones grandes.

❌ Cuando Async/Await sea una mejor opción.

---

# 15. Comparación

| Característica      | Callbacks | Promises | Async/Await |
| ------------------- | --------- | -------- | ----------- |
| Legibilidad         | Baja      | Media    | Alta        |
| Mantenimiento       | Bajo      | Medio    | Alto        |
| Depuración          | Difícil   | Media    | Fácil       |
| Limpieza del código | Regular   | Buena    | Excelente   |
| Uso moderno         | Medio     | Alto     | Muy alto    |

---

# 16. Buenas prácticas

✅ Mantener callbacks pequeños.

✅ Evitar anidaciones profundas.

✅ Separar funciones.

✅ Utilizar nombres descriptivos.

✅ Migrar a Async/Await cuando sea posible.

---

# 17. Errores comunes

## Error 1: Ejecutar la función en lugar de pasarla

Incorrecto:

```javascript
principal(saludar());
```

Correcto:

```javascript
principal(saludar);
```

---

## Error 2: Anidar demasiados callbacks

Incorrecto:

```javascript
funcion1(()=>{

    funcion2(()=>{

        funcion3(()=>{

        });

    });

});
```

---

## Error 3: No controlar errores

Incorrecto:

```javascript
leerArchivo((data)=>{

});
```

Correcto:

```javascript
leerArchivo((error,data)=>{

    if(error){

        return;

    }

});
```

---

# 18. Ejercicios prácticos

## Ejercicio 1

Crear:

```javascript
saludar(nombre, callback)
```

Salida esperada:

```text
Hola Juan

Bienvenido
```

---

## Ejercicio 2

Crear:

```javascript
multiplicar(a,b,callback)
```

Y devolver el resultado.

---

## Ejercicio 3

Simular:

```text
Encender computador

↓

Abrir navegador

↓

Abrir página web
```

Usando callbacks.

---

## Ejercicio 4

Crear un setTimeout() que espere 5 segundos y luego muestre:

```text
Proceso terminado
```

---

# 19. Resumen final

Los callbacks permiten enviar una función como argumento a otra función para ejecutarla posteriormente.

Fueron la base de la programación asíncrona en JavaScript, pero presentan varios problemas:

* Callback Hell.
* Código difícil de leer.
* Difícil mantenimiento.
* Depuración compleja.
* Manejo manual de errores.

Por esta razón, hoy se recomienda utilizar:

```text
Callbacks

↓

Promises

↓

Async/Await
```

Sin embargo, dominar los callbacks sigue siendo indispensable porque muchas herramientas y librerías modernas se apoyan en ellos internamente.
