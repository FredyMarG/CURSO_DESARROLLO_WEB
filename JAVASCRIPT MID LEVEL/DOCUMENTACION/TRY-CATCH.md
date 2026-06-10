# GUÍA — TRY...CATCH EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué es Try...Catch?
2. ¿Por qué existe?
3. Problema que resuelve
4. Funcionamiento interno
5. Flujo de manejo de excepciones
6. Sintaxis General
7. Bloque Try
8. Bloque Catch
9. Objeto Error
10. Propiedades del Objeto Error
11. Error.name
12. Error.message
13. Error.stack
14. Catch Incondicional
15. Catch Condicional
16. Sentencia Throw
17. Finally
18. Try Catch Finally
19. Propagación de errores
20. Re-Throwing
21. Casos prácticos reales
22. Errores comunes
23. Debugging profesional
24. Buenas prácticas
25. Ejercicios prácticos
26. Resumen final
27. Lo más importante que debes dominar

---

# 🌐 ¿QUÉ ES TRY...CATCH?

Es una estructura utilizada para detectar y manejar excepciones durante la ejecución de un programa.

---

# 🧠 DEFINICIÓN SIMPLE

Permite evitar que una aplicación se rompa cuando ocurre un error.

---

# 🧠 DEFINICIÓN PROFESIONAL

Try...Catch es un mecanismo de manejo de excepciones que permite interceptar errores producidos durante la ejecución de una aplicación y definir una respuesta controlada para ellos.

---

# 🚀 ¿POR QUÉ EXISTE?

Sin Try...Catch cualquier excepción detendría completamente la ejecución.

---

# EJEMPLO

```javascript
console.log("Inicio");

console.log(variableInexistente);

console.log("Fin");
```

Resultado:

```text
Inicio
ReferenceError
```

Nunca se ejecuta:

```javascript
console.log("Fin");
```

---

# PROBLEMA QUE RESUELVE

Permite:

✅ Detectar errores.

✅ Mostrar mensajes amigables.

✅ Evitar caídas de la aplicación.

✅ Registrar errores.

✅ Continuar la ejecución cuando sea posible.

---

# ⚙️ FUNCIONAMIENTO INTERNO

Cuando JavaScript encuentra un error:

```text
Error
 ↓
Buscar Catch
 ↓
¿Existe?
 ↓
Sí → Ejecutar Catch
 ↓
No → Detener programa
```

---

# 🔄 FLUJO DE MANEJO DE EXCEPCIONES

```text
Try
 ↓
Ejecutar código
 ↓
¿Error?
 ↓
No → Continuar
 ↓
Sí
 ↓
Catch
 ↓
Finally
```

---

# 🔬 SINTAXIS GENERAL

```javascript
try{

    // Código

}
catch(error){

    // Manejo de error

}
finally{

    // Limpieza

}
```

---

# 🧩 BLOQUE TRY

Contiene el código que puede generar excepciones.

---

# EJEMPLO

```javascript
try{

    console.log("Inicio");

}
catch(error){

}
```

---

# IMPORTANTE

JavaScript supervisa constantemente lo que ocurre dentro del bloque.

---

# DIAGRAMA

```text
Try
 ├─ Línea 1
 ├─ Línea 2
 ├─ Línea 3
 └─ Línea 4
```

---

# 🧩 BLOQUE CATCH

Captura excepciones producidas dentro del Try.

---

# EJEMPLO

```javascript
try{

    console.log(variable);

}
catch(error){

    console.log("Error capturado");

}
```

Resultado:

```text
Error capturado
```

---

# 🚀 VENTAJA

La aplicación no se detiene abruptamente.

---

# 🧠 OBJETO ERROR

Cuando Catch captura una excepción recibe un objeto.

---

# EJEMPLO

```javascript
catch(error){

}
```

---

# ¿QUÉ CONTIENE?

Información completa sobre el error.

---

# DIAGRAMA

```text
error
 ├─ name
 ├─ message
 └─ stack
```

---

# ERROR.NAME

Indica el tipo de excepción.

---

# EJEMPLO

```javascript
try{

    console.log(variable);

}
catch(error){

    console.log(error.name);

}
```

Resultado:

```text
ReferenceError
```

---

# ERROR.MESSAGE

Describe el problema.

---

# EJEMPLO

```javascript
try{

    console.log(variable);

}
catch(error){

    console.log(error.message);

}
```

Resultado aproximado:

```text
variable is not defined
```

---

# ERROR.STACK

Muestra la ruta que siguió el error.

---

# EJEMPLO

```javascript
console.log(error.stack);
```

---

# ¿PARA QUÉ SIRVE?

Permite localizar exactamente dónde ocurrió el problema.

---

# CATCH INCONDICIONAL

---

# DEFINICIÓN

Captura cualquier excepción sin importar el tipo.

---

# EJEMPLO

```javascript
try{

    ejecutar();

}
catch(error){

    console.log("Error detectado");

}
```

---

# VENTAJA

Sencillo de implementar.

---

# DESVENTAJA

No diferencia tipos de errores.

---

# CATCH CONDICIONAL

JavaScript no posee Catch Condicional nativo como otros lenguajes.

Sin embargo puede simularse usando:

```javascript
if
```

dentro del Catch.

---

# EJEMPLO

```javascript
try{

    console.log(variable);

}
catch(error){

    if(error instanceof ReferenceError){

        console.log(
            "Variable inexistente"
        );

    }

}
```

---

# EJEMPLO PROFESIONAL

```javascript
try{

    ejecutar();

}
catch(error){

    if(error instanceof TypeError){

        console.log(
            "Error de tipo"
        );

    }
    else if(error instanceof RangeError){

        console.log(
            "Valor fuera de rango"
        );

    }
    else{

        console.log(
            "Error desconocido"
        );

    }

}
```

---

# 🧩 SENTENCIA THROW

---

# ¿QUÉ ES?

Permite lanzar excepciones manualmente.

---

# SINTAXIS

```javascript
throw valor;
```

---

# EJEMPLO SIMPLE

```javascript
throw "Error";
```

---

# PROBLEMA

No es recomendable.

---

# MEJOR OPCIÓN

```javascript
throw new Error(
    "Error controlado"
);
```

---

# CASO REAL

```javascript
let edad = 16;

if(edad < 18){

    throw new Error(
        "Acceso denegado"
    );

}
```

---

# FLUJO INTERNO DE THROW

```text
Throw
 ↓
Generar excepción
 ↓
Buscar Catch
 ↓
Ejecutar Catch
```

---

# TRY + THROW + CATCH

```javascript
try{

    throw new Error(
        "Algo salió mal"
    );

}
catch(error){

    console.log(
        error.message
    );

}
```

Resultado:

```text
Algo salió mal
```

---

# 🧩 FINALLY

---

# ¿QUÉ ES?

Bloque que se ejecuta siempre.

---

# IMPORTANTE

Se ejecuta exista o no exista error.

---

# EJEMPLO

```javascript
try{

    console.log("Try");

}
catch(error){

    console.log("Catch");

}
finally{

    console.log("Finally");

}
```

Resultado:

```text
Try
Finally
```

---

# EJEMPLO CON ERROR

```javascript
try{

    console.log(variable);

}
catch(error){

    console.log("Catch");

}
finally{

    console.log("Finally");

}
```

Resultado:

```text
Catch
Finally
```

---

# ¿CUÁNDO UTILIZAR FINALLY?

---

## Cerrar archivos

```javascript
finally{

    archivo.close();

}
```

---

## Cerrar conexiones

```javascript
finally{

    conexion.close();

}
```

---

## Ocultar loaders

```javascript
finally{

    ocultarSpinner();

}
```

---

# TRY CATCH FINALLY COMPLETO

```javascript
try{

    conectar();

    obtenerDatos();

}
catch(error){

    console.log(
        error.message
    );

}
finally{

    desconectar();

}
```

---

# PROPAGACIÓN DE ERRORES

---

# DEFINICIÓN

Los errores pueden viajar entre funciones.

---

# EJEMPLO

```javascript
function c(){

    throw new Error(
        "Error"
    );

}

function b(){

    c();

}

function a(){

    b();

}

a();
```

---

# DIAGRAMA

```text
a()
 ↓
b()
 ↓
c()
 ↓
ERROR
 ↑
b()
 ↑
a()
```

---

# RE-THROWING

---

# ¿QUÉ ES?

Volver a lanzar una excepción.

---

# EJEMPLO

```javascript
try{

    ejecutar();

}
catch(error){

    console.log(
        "Registrando..."
    );

    throw error;

}
```

---

# ¿PARA QUÉ SIRVE?

Permite registrar el error y seguir propagándolo.

---

# 🚀 CASOS PRÁCTICOS REALES

---

# LOGIN

```javascript
try{

    login();

}
catch(error){

    mostrarMensaje(
        "Usuario incorrecto"
    );

}
```

---

# API

```javascript
try{

    obtenerDatos();

}
catch(error){

    mostrarError();

}
```

---

# BANCO

```javascript
try{

    retirarDinero();

}
catch(error){

    console.log(
        "Operación cancelada"
    );

}
```

---

# FORMULARIOS

```javascript
try{

    validarFormulario();

}
catch(error){

    mostrarErrores();

}
```

---

# ❌ ERRORES COMUNES

---

# CATCH VACÍO

```javascript
catch(error){

}
```

Mala práctica.

---

# THROW CON STRINGS

```javascript
throw "Error";
```

Evitar.

---

# OLVIDAR FINALLY

Puede dejar recursos abiertos.

---

# OCULTAR ERRORES IMPORTANTES

```javascript
catch(error){

    console.log("Error");

}
```

Sin registrar detalles.

---

# NO USAR ERROR.MESSAGE

```javascript
catch(error){

    console.log(error);

}
```

A veces genera información difícil de leer.

---

# 🐛 DEBUGGING PROFESIONAL

---

# PASO 1

Leer:

```javascript
error.name
```

---

# PASO 2

Leer:

```javascript
error.message
```

---

# PASO 3

Analizar:

```javascript
error.stack
```

---

# PASO 4

Encontrar línea exacta.

---

# PASO 5

Corregir causa raíz.

---

# ✅ BUENAS PRÁCTICAS

---

## Utilizar mensajes descriptivos

```javascript
throw new Error(
    "Saldo insuficiente"
);
```

---

## Capturar únicamente donde sea necesario

---

## Utilizar Finally para limpieza

---

## No ignorar excepciones

---

## Registrar errores importantes

---

## Manejar tipos específicos cuando sea posible

```javascript
if(error instanceof TypeError)
```

---

# 🧪 EJERCICIOS

---

# EJERCICIO 1

Crear un programa que lance un error si la edad es menor de 18.

---

# EJERCICIO 2

Capturar un ReferenceError.

---

# EJERCICIO 3

Mostrar:

```javascript
error.name
error.message
```

---

# EJERCICIO 4

Crear un sistema bancario usando:

```javascript
throw
try
catch
```

---

# EJERCICIO 5

Simular una API que falle y utilizar Finally para ocultar un loader.

---

# 🏁 RESUMEN FINAL

Try...Catch es el mecanismo principal de manejo de excepciones en JavaScript.

Sus componentes fundamentales son:

✅ Try

✅ Catch

✅ Throw

✅ Finally

✅ Error

Dominar estas herramientas permite crear aplicaciones más robustas, seguras y fáciles de mantener.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Try

✅ Catch

✅ Error.message

✅ Error.name

---

## Nivel Intermedio

✅ Throw

✅ Finally

✅ Catch Condicional

✅ Stack Trace

---

## Nivel Profesional

✅ Propagación de errores

✅ Re-Throwing

✅ Arquitectura de manejo de excepciones

✅ Logging profesional

✅ Manejo centralizado de errores
