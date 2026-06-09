# GUÍA — CONTROL DE FLUJO Y MANEJO DE ERRORES

---

# 📚 TEMARIO

1. ¿Qué es el Control de Flujo?
2. ¿Por qué es importante?
3. Cómo funciona internamente
4. Flujo de ejecución secuencial
5. Sentencias de bloque
6. Scope de bloque
7. Alcance de variables
8. if
9. if...else
10. if...else if
11. Operadores lógicos en decisiones
12. Anidación de estructuras
13. switch
14. for
15. while
16. do...while
17. break
18. continue
19. Labels
20. Diagramas de flujo
21. Casos prácticos reales
22. Errores comunes
23. Buenas prácticas
24. Resumen parcial

---

# 🌐 ¿QUÉ ES EL CONTROL DE FLUJO?

El control de flujo es el mecanismo que determina el orden en que se ejecutan las instrucciones dentro de un programa.

---

# 🧠 DEFINICIÓN SIMPLE

Es la forma en que un programa decide qué hacer primero, qué hacer después, qué repetir y qué ignorar.

---

# 🧠 DEFINICIÓN PROFESIONAL

El control de flujo es el conjunto de estructuras y mecanismos que permiten modificar, dirigir o alterar la secuencia normal de ejecución de un programa mediante decisiones, repeticiones y saltos controlados.

---

# 🚀 ¿POR QUÉ ES IMPORTANTE?

Sin control de flujo todos los programas funcionarían así:

```javascript
console.log("Paso 1");
console.log("Paso 2");
console.log("Paso 3");
```

Siempre de arriba hacia abajo.

Pero en aplicaciones reales necesitamos:

✅ Tomar decisiones.

✅ Repetir procesos.

✅ Validar información.

✅ Controlar accesos.

✅ Manejar errores.

---

# ⚙️ ¿CÓMO FUNCIONA INTERNAMENTE?

JavaScript ejecuta instrucciones utilizando:

```text
Call Stack
```

Cada línea es procesada secuencialmente.

---

# 🧠 FLUJO NORMAL

```text
Línea 1
 ↓
Línea 2
 ↓
Línea 3
 ↓
Línea 4
```

---

# 🔬 EJEMPLO

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Resultado:

```text
A
B
C
```

---

# 🔄 FLUJO DE EJECUCIÓN SECUENCIAL

Es el flujo por defecto.

---

# 🧪 EJEMPLO

```javascript
let nombre = "Fredy";

console.log(nombre);

nombre = "Ana";

console.log(nombre);
```

Resultado:

```text
Fredy
Ana
```

---

# 📦 SENTENCIAS DE BLOQUE

---

# 🧠 ¿QUÉ ES UN BLOQUE?

Un bloque es un conjunto de instrucciones agrupadas mediante llaves.

```javascript
{
    console.log("Hola");
}
```

---

# 🚀 ¿PARA QUÉ SIRVEN?

Permiten:

✅ Agrupar instrucciones.

✅ Organizar código.

✅ Crear ámbitos (scope).

✅ Controlar visibilidad de variables.

---

# 🔬 EJEMPLO

```javascript
{
    let edad = 20;

    console.log(edad);
}
```

---

# 🧩 DIAGRAMA

```text
{
    instrucción 1
    instrucción 2
    instrucción 3
}
```

Todo pertenece al mismo bloque.

---

# 🌍 SCOPE DE BLOQUE

---

# 🧠 DEFINICIÓN SIMPLE

Es la zona donde una variable existe.

---

# 🧠 DEFINICIÓN PROFESIONAL

El Block Scope es el alcance limitado que poseen las variables declaradas con let y const dentro del bloque donde fueron creadas.

---

# 🔬 EJEMPLO

```javascript
{
    let ciudad = "Bogotá";
}

console.log(ciudad);
```

Resultado:

```text
ReferenceError
```

---

# 🚀 ¿POR QUÉ OCURRE?

Porque la variable murió al salir del bloque.

---

# 🧩 DIAGRAMA

```text
{
    let ciudad
}

↓ sale del bloque

ciudad ❌
```

---

# 🔀 SENTENCIA IF

---

# 🧠 ¿QUÉ ES?

Permite ejecutar código únicamente cuando una condición es verdadera.

---

# SINTAXIS

```javascript
if(condicion){

}
```

---

# 🔬 EJEMPLO

```javascript
let edad = 20;

if(edad >= 18){
    console.log("Puede ingresar");
}
```

---

# DIAGRAMA

```text
        Condición
            |
      ┌─────┴─────┐
      |           |
    TRUE       FALSE
      |           |
 Ejecuta      Ignora
```

---

# 🏦 CASO REAL

Validación bancaria:

```javascript
if(saldo > 0){
    retirarDinero();
}
```

---

# 🔀 IF ELSE

---

# ¿QUÉ HACE?

Permite ejecutar una alternativa.

---

# SINTAXIS

```javascript
if(condicion){

}
else{

}
```

---

# EJEMPLO

```javascript
let edad = 15;

if(edad >= 18){
    console.log("Adulto");
}
else{
    console.log("Menor");
}
```

---

# DIAGRAMA

```text
       Condición
           |
    ┌──────┴──────┐
    |             |
 TRUE         FALSE
    |             |
 Adulto       Menor
```

---

# 🔀 ELSE IF

---

# ¿QUÉ HACE?

Permite evaluar múltiples caminos.

---

# EJEMPLO

```javascript
let nota = 4.5;

if(nota >= 4.5){
    console.log("Excelente");
}
else if(nota >= 3){
    console.log("Aprobado");
}
else{
    console.log("Reprobado");
}
```

---

# 🧠 OPERADORES LÓGICOS

---

# AND (&&)

Todas deben cumplirse.

```javascript
if(
    edad >= 18 &&
    tieneDocumento
){
    ingresar();
}
```

---

# OR (||)

Al menos una.

```javascript
if(
    esAdmin ||
    esModerador
){
    acceder();
}
```

---

# NOT (!)

Invierte valor.

```javascript
if(!activo){
    bloquear();
}
```

---

# 🪆 ANIDACIÓN DE ESTRUCTURAS

Un if puede contener otro if.

```javascript
if(usuario){

    if(usuario.activo){

        ingresar();

    }

}
```

---

# ⚠️ PROBLEMA

Demasiada anidación produce:

```javascript
if(){

   if(){

      if(){

      }

   }

}
```

Difícil de mantener.

---

# 🔀 SWITCH

Permite comparar una misma variable contra múltiples opciones.

```javascript
switch(opcion){

    case 1:
        break;

    case 2:
        break;

    default:
}
```

---

# ¿CUÁNDO USARLO?

Cuando existen muchas alternativas.

---

# 🔁 BUCLE FOR

---

# DEFINICIÓN SIMPLE

Repite una cantidad conocida de veces.

---

# SINTAXIS

```javascript
for(
    inicio;
    condicion;
    incremento
){

}
```

---

# EJEMPLO

```javascript
for(
    let i = 1;
    i <= 5;
    i++
){
    console.log(i);
}
```

---

# FUNCIONAMIENTO INTERNO

```text
Inicializar
     ↓
Condición
     ↓
 Ejecutar
     ↓
Incrementar
     ↓
Condición
```

---

# 🏫 CASO REAL

Mostrar estudiantes:

```javascript
for(
    let i = 0;
    i < estudiantes.length;
    i++
){
    console.log(estudiantes[i]);
}
```

---

# 🔁 WHILE

---

# DEFINICIÓN

Repite mientras la condición sea verdadera.

---

# EJEMPLO

```javascript
let contador = 1;

while(contador <= 5){

    console.log(contador);

    contador++;

}
```

---

# DIAGRAMA

```text
Condición
    |
 TRUE
    |
 Ejecutar
    |
 Volver
```

---

# 🔁 DO WHILE

---

# DIFERENCIA PRINCIPAL

Se ejecuta al menos una vez.

---

# EJEMPLO

```javascript
let numero = 10;

do{

    console.log(numero);

}
while(numero < 5);
```

Resultado:

```text
10
```

---

# 🛑 BREAK

---

# ¿QUÉ HACE?

Detiene completamente una estructura.

---

# EJEMPLO

```javascript
for(let i = 1; i <= 10; i++){

    if(i === 5){
        break;
    }

    console.log(i);
}
```

Resultado:

```text
1
2
3
4
```

---

# ⏭️ CONTINUE

---

# ¿QUÉ HACE?

Salta la iteración actual.

---

# EJEMPLO

```javascript
for(let i = 1; i <= 5; i++){

    if(i === 3){
        continue;
    }

    console.log(i);
}
```

Resultado:

```text
1
2
4
5
```

---

# 🏷️ LABELS

Característica poco usada.

---

# DEFINICIÓN

Permite nombrar bucles.

---

# EJEMPLO

```javascript
externo:

for(let i=0;i<3;i++){

    for(let j=0;j<3;j++){

        break externo;

    }

}
```

---

# ⚠️ ¿DEBERÍAS USARLAS?

Generalmente NO.

Suelen dificultar la lectura.

---

# 🚀 CASOS PRÁCTICOS REALES

---

# LOGIN

```javascript
if(usuario && password){

    autenticar();

}
```

---

# CARRITO DE COMPRAS

```javascript
for(
    let i = 0;
    i < carrito.length;
    i++
){
    total += carrito[i].precio;
}
```

---

# VIDEOJUEGO

```javascript
while(vida > 0){

    jugar();

}
```

---

# API

```javascript
if(response.ok){

    procesar();

}
else{

    mostrarError();

}
```

---

# ❌ ERRORES COMUNES

---

# BUCLES INFINITOS

```javascript
while(true){

}
```

---

# OLVIDAR BREAK

```javascript
switch(opcion){

    case 1:
        console.log("Uno");

    case 2:
        console.log("Dos");
}
```

---

# ANIDACIÓN EXCESIVA

```javascript
if(){

   if(){

      if(){

      }

   }

}
```

---

# COMPARACIONES INCORRECTAS

```javascript
if(edad = 18)
```

En lugar de:

```javascript
if(edad === 18)
```

---

# ✅ BUENAS PRÁCTICAS

---

## Usa llaves siempre

```javascript
if(condicion){

}
```

---

## Evita anidaciones profundas

---

## Usa nombres descriptivos

```javascript
usuarioAutenticado
```

Mejor que:

```javascript
u
```

---

## Utiliza switch cuando existan muchas opciones

---

## Evita bucles infinitos

---

# 🏁 RESUMEN PARCIAL

El control de flujo permite dirigir la ejecución de un programa mediante decisiones, repeticiones y agrupaciones de instrucciones.

Las estructuras más importantes son:

✅ Bloques.

✅ If.

✅ If Else.

✅ Else If.

✅ Switch.

✅ For.

✅ While.

✅ Do While.

✅ Break.

✅ Continue.

✅ Labels.

Dominar estas estructuras es fundamental antes de aprender manejo de excepciones, debugging avanzado, asincronía y arquitectura profesional de aplicaciones.

---

# 🎯 LO MÁS IMPORTANTE QUE DEBES DOMINAR

## Nivel Junior

✅ if

✅ else

✅ for

✅ while

✅ break

✅ continue

---

## Nivel Intermedio

✅ Scope de bloque

✅ Anidación

✅ Switch

✅ Optimización de bucles

---

## Nivel Profesional

✅ Diseño de flujos complejos

✅ Legibilidad

✅ Mantenimiento

✅ Prevención de bucles infinitos

✅ Arquitectura basada en estados
