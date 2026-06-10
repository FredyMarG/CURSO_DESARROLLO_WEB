# GUÍA — EXCEPCIONES Y TIPOS DE EXCEPCIONES EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué es una excepción?
2. ¿Por qué existen las excepciones?
3. Diferencia entre error y excepción
4. Cómo funciona internamente una excepción
5. Flujo de propagación de excepciones
6. Error en JavaScript
7. Jerarquía de excepciones ECMAScript
8. Error
9. EvalError
10. RangeError
11. ReferenceError
12. SyntaxError
13. TypeError
14. URIError
15. AggregateError
16. InternalError
17. Throw
18. Try
19. Catch
20. Finally
21. Stack Traces
22. Error Stack
23. Casos reales
24. Errores comunes
25. Debugging profesional
26. Buenas prácticas
27. Resumen parcial

---

# 🌐 ¿QUÉ ES UNA EXCEPCIÓN?

Las excepciones son eventos anormales que ocurren durante la ejecución de un programa.

---

# 🧠 DEFINICIÓN SIMPLE

Una excepción es un problema que aparece mientras el programa está funcionando.

---

# 🧠 DEFINICIÓN PROFESIONAL

Una excepción es un mecanismo de interrupción controlada del flujo normal de ejecución que permite detectar, propagar y gestionar situaciones inesperadas producidas durante la ejecución de una aplicación.

---

# 🚀 ¿POR QUÉ EXISTEN LAS EXCEPCIONES?

Sin excepciones, cualquier error detendría completamente la aplicación.

---

# 🧪 EJEMPLO

```javascript id="g5dnwl"
console.log("Inicio");

console.log(variableInexistente);

console.log("Fin");
```

Resultado:

```text id="i3j4mu"
Inicio
ReferenceError
```

La ejecución se interrumpe.

---

# ⚠️ PROBLEMA

En aplicaciones reales:

* Bancos.
* Redes sociales.
* Videojuegos.
* APIs.

No podemos permitir que todo falle por un único error.

---

# ERROR VS EXCEPCIÓN

---

# 🧠 ERROR

Representa una condición incorrecta.

---

# 🧠 EXCEPCIÓN

Es el mecanismo utilizado para reportar ese error.

---

# EJEMPLO COTIDIANO

```text id="u5ym85"
Error:
"No hay electricidad"

Excepción:
"La alarma se activa para avisar"
```

---

# ⚙️ ¿CÓMO FUNCIONA INTERNAMENTE?

JavaScript utiliza:

```text id="zfd7y6"
Call Stack
```

para ejecutar funciones.

---

# FLUJO NORMAL

```text id="ajk7f6"
main()
  ↓
funcionA()
  ↓
funcionB()
  ↓
fin
```

---

# FLUJO CON EXCEPCIÓN

```text id="p34c9n"
main()
  ↓
funcionA()
  ↓
funcionB()
  ↓
ERROR
  ↓
Buscar Catch
  ↓
Manejar Error
```

---

# 🔥 PROPAGACIÓN DE EXCEPCIONES

Cuando ocurre un error:

1. Se genera la excepción.
2. JavaScript busca un catch.
3. Si no existe:

   * Sube por el Call Stack.
4. Continúa buscando.
5. Si no encuentra ninguno:

   * El programa falla.

---

# DIAGRAMA

```text id="1mjlwm"
funcion3()
     ↑
funcion2()
     ↑
funcion1()
     ↑
  main()
```

La excepción sube hasta encontrar un manejador.

---

# 🧩 JERARQUÍA DE EXCEPCIONES ECMASCRIPT

JavaScript incluye múltiples tipos de errores.

---

# ESTRUCTURA GENERAL

```text id="nnjv77"
Error
 ├─ EvalError
 ├─ RangeError
 ├─ ReferenceError
 ├─ SyntaxError
 ├─ TypeError
 ├─ URIError
 └─ AggregateError
```

---

# ERROR

Clase base para todas las excepciones.

---

# EJEMPLO

```javascript id="8f2mkv"
throw new Error(
    "Algo salió mal"
);
```

---

# PROPIEDADES

```javascript id="kjh9sv"
error.name
error.message
error.stack
```

---

# EVALERROR

Error relacionado históricamente con:

```javascript id="3qrf4f"
eval()
```

---

# IMPORTANTE

Actualmente casi no aparece en aplicaciones modernas.

---

# RANGEERROR

Ocurre cuando un valor está fuera del rango permitido.

---

# EJEMPLO

```javascript id="pw6nnl"
let numeros = [];

numeros.length = -1;
```

Resultado:

```text id="zh0qq2"
RangeError
```

---

# CASO REAL

Intentar crear:

```javascript id="zw6sk0"
new Array(-5);
```

---

# REFERENCEERROR

Uno de los errores más comunes.

---

# DEFINICIÓN

Se produce cuando se intenta acceder a una variable inexistente.

---

# EJEMPLO

```javascript id="31gptw"
console.log(usuario);
```

Resultado:

```text id="4u2l0y"
ReferenceError
```

---

# CASO REAL

Error de escritura:

```javascript id="3dxs5n"
let nombre = "Fredy";

console.log(nomre);
```

---

# SYNTAXERROR

Error de sintaxis.

---

# EJEMPLO

```javascript id="v9bwec"
if(true{
}
```

Resultado:

```text id="u8j5wz"
SyntaxError
```

---

# IMPORTANTE

Ni siquiera permite iniciar la ejecución.

---

# TYPEERROR

Probablemente el error más frecuente.

---

# DEFINICIÓN

Ocurre cuando una operación se realiza sobre un tipo incorrecto.

---

# EJEMPLO

```javascript id="2mjlwm"
let usuario = null;

usuario.nombre;
```

Resultado:

```text id="yzvh4w"
TypeError
```

---

# CASOS REALES

```javascript id="8wkl8s"
undefined.metodo()
```

```javascript id="lrzwvj"
null.propiedad
```

```javascript id="c40iqc"
5()
```

---

# URIERROR

Relacionado con funciones URI.

---

# EJEMPLO

```javascript id="mblgdr"
decodeURIComponent("%");
```

Resultado:

```text id="2jkdr4"
URIError
```

---

# AGGREGATEERROR

Introducido para manejar múltiples errores.

---

# USADO EN

```javascript id="3b02x6"
Promise.any()
```

---

# EJEMPLO

```javascript id="xti53s"
Promise.any([
    Promise.reject(),
    Promise.reject()
]);
```

---

# INTERNALERROR

Más común en motores específicos.

---

# EJEMPLO

Recursión infinita:

```javascript id="k8zvdz"
function prueba(){
    prueba();
}

prueba();
```

Resultado:

```text id="n2h05r"
Maximum call stack size exceeded
```

---

# THROW

---

# ¿QUÉ ES?

Permite lanzar excepciones manualmente.

---

# EJEMPLO

```javascript id="m3j53p"
throw new Error(
    "Acceso denegado"
);
```

---

# CASO REAL

```javascript id="jlwm5i"
let edad = 15;

if(edad < 18){

    throw new Error(
        "Debe ser mayor de edad"
    );

}
```

---

# TRY

Bloque donde intentamos ejecutar código.

---

# SINTAXIS

```javascript id="2qchlg"
try{

}
```

---

# CATCH

Captura excepciones.

---

# SINTAXIS

```javascript id="v6l1av"
catch(error){

}
```

---

# EJEMPLO

```javascript id="nqfjtb"
try{

    console.log(usuario);

}
catch(error){

    console.log(
        "Error controlado"
    );

}
```

---

# FINALLY

Se ejecuta siempre.

---

# EJEMPLO

```javascript id="h7l8i4"
try{

    conectar();

}
catch(error){

    console.log(error);

}
finally{

    cerrarConexion();

}
```

---

# STACK TRACE

---

# DEFINICIÓN SIMPLE

Muestra el camino que siguió el error.

---

# DEFINICIÓN PROFESIONAL

Es una representación de la secuencia de llamadas de funciones que condujo a una excepción.

---

# EJEMPLO

```text id="bkh2gk"
main()
 ↓
login()
 ↓
api()
 ↓
ERROR
```

---

# ERROR.STACK

Permite acceder al stack trace.

---

# EJEMPLO

```javascript id="mjlwm3"
console.log(error.stack);
```

---

# CASOS REALES

---

# LOGIN

```javascript id="6m6yt9"
if(!password){

    throw new Error(
        "Contraseña requerida"
    );

}
```

---

# API

```javascript id="jv6yvk"
if(!response.ok){

    throw new Error(
        "Error en API"
    );

}
```

---

# BANCO

```javascript id="4z1eph"
if(saldo < retiro){

    throw new Error(
        "Fondos insuficientes"
    );

}
```

---

# ❌ ERRORES COMUNES

---

# CAPTURAR Y NO HACER NADA

```javascript id="gk9hfh"
catch(error){

}
```

Oculta problemas.

---

# USAR MENSAJES VAGOS

```javascript id="f9xtxn"
throw new Error("Error");
```

---

# MEJOR

```javascript id="jlwm8p"
throw new Error(
    "Saldo insuficiente"
);
```

---

# NO USAR FINALLY

Puede dejar recursos abiertos.

---

# 🐛 DEBUGGING PROFESIONAL

---

# PASO 1

Leer mensaje.

---

# PASO 2

Leer stack trace.

---

# PASO 3

Encontrar línea exacta.

---

# PASO 4

Identificar tipo de error.

---

# PASO 5

Corregir origen.

---

# ✅ BUENAS PRÁCTICAS

---

## Lanzar errores descriptivos

---

## Utilizar try solo donde sea necesario

---

## Siempre registrar errores importantes

---

## Utilizar finally para limpieza

---

## No ignorar excepciones

---

# 🏁 RESUMEN PARCIAL

Las excepciones permiten detectar y controlar situaciones inesperadas sin detener completamente una aplicación.

JavaScript proporciona múltiples tipos de errores integrados:

✅ Error

✅ EvalError

✅ RangeError

✅ ReferenceError

✅ SyntaxError

✅ TypeError

✅ URIError

✅ AggregateError

Comprenderlos es fundamental para escribir aplicaciones robustas y profesionales.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ Error

✅ TypeError

✅ ReferenceError

✅ Try

✅ Catch

---

## Nivel Intermedio

✅ Throw

✅ Finally

✅ Stack Trace

✅ RangeError

---

## Nivel Profesional

✅ Propagación de excepciones

✅ AggregateError

✅ Debugging avanzado

✅ Manejo estructurado de errores

✅ Arquitectura resiliente
