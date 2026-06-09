# GUÍA — SENTENCIA SWITCH EN JAVASCRIPT

---

# 📚 TEMARIO

1. ¿Qué es Switch?
2. ¿Para qué sirve realmente?
3. Problema que resuelve
4. Cómo funciona internamente
5. Anatomía completa de Switch
6. Expresión evaluada
7. Case
8. Break
9. Default
10. Comparación estricta (===)
11. Fall Through
12. Agrupación de Cases
13. Switch con Strings
14. Switch con Números
15. Switch con Booleanos
16. Switch con Expresiones
17. Switch(true)
18. Casos reales
19. Menús interactivos
20. Sistemas de Roles
21. APIs REST
22. Videojuegos
23. Máquinas de Estado
24. Optimización
25. Switch vs If Else
26. Errores comunes
27. Debugging profesional
28. Buenas prácticas
29. Flujo profesional de uso
30. Ejercicios prácticos
31. Resumen final
32. Lo más importante que debes dominar

---

# 🌐 ¿QUÉ ES SWITCH?

Switch es una estructura de control de flujo que permite ejecutar diferentes bloques de código dependiendo del valor de una expresión.

---

# 🧠 DEFINICIÓN SIMPLE

Es una estructura que permite elegir entre varias opciones posibles.

---

# 🧠 DEFINICIÓN PROFESIONAL

La sentencia `switch` es una estructura de selección múltiple que evalúa una expresión y ejecuta el bloque de código asociado al primer caso que coincida utilizando comparación estricta.

---

# 🚀 ¿PARA QUÉ SIRVE REALMENTE?

Permite:

✅ Crear menús.

✅ Manejar estados.

✅ Gestionar permisos.

✅ Controlar videojuegos.

✅ Procesar respuestas.

✅ Organizar múltiples decisiones.

---

# 🧩 PROBLEMA QUE RESUELVE

Supongamos que tenemos un sistema con muchas opciones.

---

# ❌ SIN SWITCH

```javascript
if(opcion === 1){
    console.log("Crear");
}
else if(opcion === 2){
    console.log("Editar");
}
else if(opcion === 3){
    console.log("Eliminar");
}
else if(opcion === 4){
    console.log("Buscar");
}
```

A medida que crecen las opciones, el código se vuelve difícil de mantener.

---

# ✅ CON SWITCH

```javascript
switch(opcion){

    case 1:
        console.log("Crear");
        break;

    case 2:
        console.log("Editar");
        break;

    case 3:
        console.log("Eliminar");
        break;

    case 4:
        console.log("Buscar");
        break;
}
```

Más limpio.

Más legible.

Más mantenible.

---

# ⚙️ ¿CÓMO FUNCIONA INTERNAMENTE?

Cuando JavaScript encuentra un switch:

```javascript
switch(valor)
```

Realiza los siguientes pasos:

---

## PASO 1

Evalúa la expresión.

```javascript
switch(opcion)
```

---

## PASO 2

Obtiene el valor resultante.

```javascript
opcion = 3
```

---

## PASO 3

Compara con cada case.

```javascript
case 1
case 2
case 3
```

---

## PASO 4

Encuentra coincidencia.

---

## PASO 5

Ejecuta instrucciones.

---

## PASO 6

Busca break.

---

## PASO 7

Finaliza.

---

# 🔬 DIAGRAMA INTERNO

```text
              switch()
                  |
                  V
         Evaluar expresión
                  |
                  V
         Comparar case 1
                  |
         ¿Coincide?
           /      \
         No       Sí
         |         |
         V         V
   Siguiente    Ejecutar
      Case      instrucciones
                    |
                    V
             ¿Existe break?
                 /      \
               Sí       No
               |         |
               V         V
            Final    Continúa
```

---

# 🧩 ANATOMÍA COMPLETA

```javascript
switch(expresion){

    case valor1:
        instrucciones;
        break;

    case valor2:
        instrucciones;
        break;

    default:
        instrucciones;
}
```

---

# 🎯 EXPRESIÓN EVALUADA

Es el valor que JavaScript analizará.

---

## EJEMPLO

```javascript
let rol = "admin";

switch(rol){

}
```

La expresión evaluada es:

```javascript
rol
```

---

# 📌 CASE

Representa una posible coincidencia.

---

## EJEMPLO

```javascript
case "admin":
```

---

## EJEMPLO

```javascript
case 5:
```

---

## EJEMPLO

```javascript
case true:
```

---

# 🛑 BREAK

---

# 🧠 ¿QUÉ HACE?

Detiene inmediatamente la ejecución del switch.

---

# EJEMPLO

```javascript
case 1:
    console.log("Uno");
    break;
```

---

# 🚀 ¿POR QUÉ ES TAN IMPORTANTE?

Porque evita ejecutar casos posteriores.

---

# 🎯 DEFAULT

---

# DEFINICIÓN

Caso ejecutado cuando ninguna opción coincide.

---

# EJEMPLO

```javascript
default:
    console.log("No encontrado");
```

---

# COMPARACIÓN ESTRICTA

Uno de los detalles más importantes.

Switch utiliza:

```javascript
===
```

Internamente.

---

# EJEMPLO

```javascript
let numero = "5";

switch(numero){

    case 5:
        console.log("Coincide");
        break;

    default:
        console.log("No coincide");
}
```

Resultado:

```text
No coincide
```

Porque:

```javascript
"5" !== 5
```

---

# 🌊 FALL THROUGH

---

# ¿QUÉ ES?

Comportamiento donde la ejecución continúa hacia los siguientes cases.

---

# EJEMPLO

```javascript
switch(2){

    case 1:
        console.log("Uno");

    case 2:
        console.log("Dos");

    case 3:
        console.log("Tres");

    case 4:
        console.log("Cuatro");
}
```

Resultado:

```text
Dos
Tres
Cuatro
```

---

# ¿POR QUÉ OCURRE?

Porque no existe break.

---

# 🧠 AGRUPACIÓN DE CASES

Una técnica profesional.

---

# EJEMPLO

```javascript
switch(mes){

    case 12:
    case 1:
    case 2:
        console.log("Invierno");
        break;
}
```

---

# VENTAJA

Evita duplicar código.

---

# SWITCH CON STRINGS

---

## EJEMPLO

```javascript
let color = "rojo";

switch(color){

    case "rojo":
        console.log("Color rojo");
        break;

    case "azul":
        console.log("Color azul");
        break;
}
```

---

# SWITCH CON NÚMEROS

```javascript
let dia = 3;

switch(dia){

    case 1:
        console.log("Lunes");
        break;

    case 2:
        console.log("Martes");
        break;

    case 3:
        console.log("Miércoles");
        break;
}
```

---

# SWITCH CON BOOLEANOS

```javascript
let activo = true;

switch(activo){

    case true:
        console.log("Activo");
        break;

    case false:
        console.log("Inactivo");
        break;
}
```

---

# SWITCH CON EXPRESIONES

La expresión puede calcularse.

```javascript
switch(2 + 3){

    case 5:
        console.log("Correcto");
        break;
}
```

---

# SWITCH(TRUE)

Patrón avanzado.

---

# ¿PARA QUÉ SIRVE?

Permite evaluar condiciones complejas.

---

# EJEMPLO

```javascript
let edad = 20;

switch(true){

    case edad < 18:
        console.log("Menor");
        break;

    case edad >= 18:
        console.log("Adulto");
        break;
}
```

---

# 🚀 CASOS REALES

---

# MENÚ INTERACTIVO

```javascript
switch(opcion){

    case 1:
        crearUsuario();
        break;

    case 2:
        editarUsuario();
        break;

    case 3:
        eliminarUsuario();
        break;
}
```

---

# SISTEMA DE ROLES

```javascript
switch(rol){

    case "admin":
        accesoTotal();
        break;

    case "editor":
        accesoEdicion();
        break;

    case "cliente":
        accesoLectura();
        break;
}
```

---

# API REST

```javascript
switch(metodo){

    case "GET":
        obtener();
        break;

    case "POST":
        crear();
        break;

    case "PUT":
        actualizar();
        break;

    case "DELETE":
        eliminar();
        break;
}
```

---

# VIDEOJUEGOS

```javascript
switch(tecla){

    case "W":
        moverArriba();
        break;

    case "S":
        moverAbajo();
        break;

    case "A":
        moverIzquierda();
        break;

    case "D":
        moverDerecha();
        break;
}
```

---

# 🎮 MÁQUINAS DE ESTADO

Muy utilizadas profesionalmente.

---

## EJEMPLO

```javascript
switch(estado){

    case "loading":
        mostrarSpinner();
        break;

    case "success":
        mostrarDatos();
        break;

    case "error":
        mostrarError();
        break;
}
```

---

# ⚡ OPTIMIZACIÓN

Cuando existen demasiados cases:

```javascript
case ...
case ...
case ...
case ...
```

Puede ser mejor usar objetos.

---

# EJEMPLO

```javascript
const acciones = {

    crear: crearUsuario,
    editar: editarUsuario,
    eliminar: eliminarUsuario

};

acciones[accion]();
```

---

# SWITCH VS IF ELSE

| Característica        | Switch    | If        |
| --------------------- | --------- | --------- |
| Legibilidad           | Alta      | Media     |
| Muchas opciones       | Excelente | Regular   |
| Condiciones complejas | Mala      | Excelente |
| Mantenimiento         | Alto      | Medio     |
| Comparación exacta    | Sí        | Opcional  |

---

# ❌ ERRORES COMUNES

---

# OLVIDAR BREAK

```javascript
case 1:
    console.log("Uno");
```

---

# CONFUNDIR TIPOS

```javascript
case 1
```

No coincide con:

```javascript
"1"
```

---

# NO USAR DEFAULT

Puede dejar casos sin controlar.

---

# DEMASIADOS CASES

Indica posible problema de diseño.

---

# 🐛 DEBUGGING PROFESIONAL

---

# PASO 1

Agregar logs.

```javascript
console.log(opcion);
```

---

# PASO 2

Verificar tipo.

```javascript
console.log(typeof opcion);
```

---

# PASO 3

Confirmar coincidencia.

```javascript
case "1"
```

vs

```javascript
1
```

---

# PASO 4

Verificar break.

---

# PASO 5

Probar cada ruta.

---

# ✅ BUENAS PRÁCTICAS

---

## Siempre usar break

---

## Siempre usar default

---

## Agrupar casos repetidos

---

## Mantener pocos niveles de complejidad

---

## Usar nombres descriptivos

---

## Comentar casos complejos

---

# 🎯 FLUJO PROFESIONAL

```text
Identificar variable
          ↓
Analizar opciones
          ↓
Crear switch
          ↓
Agregar cases
          ↓
Agregar break
          ↓
Agregar default
          ↓
Probar todas las rutas
```

---

# 🧪 EJERCICIOS

---

# EJERCICIO 1

Crear menú:

```text
1. Crear
2. Editar
3. Eliminar
4. Salir
```

---

# EJERCICIO 2

Crear sistema de permisos:

```text
Admin
Editor
Cliente
Invitado
```

---

# EJERCICIO 3

Crear simulador de semáforo.

```text
Rojo
Amarillo
Verde
```

---

# EJERCICIO 4

Crear videojuego usando:

```text
W
A
S
D
```

---

# EJERCICIO 5

Determinar trimestre del año según el mes.

---

# 🏁 RESUMEN FINAL

La sentencia Switch es una estructura de control de flujo diseñada para gestionar múltiples decisiones basadas en una única expresión.

Sus componentes principales son:

✅ switch

✅ case

✅ break

✅ default

Comprender correctamente:

* Comparación estricta.
* Fall Through.
* Agrupación de Cases.
* Uso profesional.
* Optimización.

permite escribir aplicaciones más organizadas, mantenibles y fáciles de escalar.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ switch

✅ case

✅ break

✅ default

---

## Nivel Intermedio

✅ Fall Through

✅ Comparación estricta

✅ Agrupación de Cases

✅ Debugging

---

## Nivel Profesional

✅ Máquinas de estado

✅ Optimización

✅ Arquitectura basada en estados

✅ Integración con APIs

✅ Patrones avanzados como switch(true)
