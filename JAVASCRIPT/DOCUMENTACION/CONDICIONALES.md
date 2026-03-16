# Condicionales en JavaScript -- Guía Completa

## 1. ¿Qué es un condicional?

Un **condicional** permite ejecutar diferentes bloques de código
dependiendo de si una condición es verdadera (`true`) o falsa (`false`).

Los condicionales son fundamentales para controlar el flujo de un
programa.

Ejemplo simple:

``` javascript
let edad = 18;

if (edad >= 18) {
  console.log("Eres mayor de edad");
}
```

Si la condición es verdadera, el código dentro del bloque se ejecuta.

------------------------------------------------------------------------

# 2. Estructura básica de if

``` javascript
if (condición) {
  // código que se ejecuta si la condición es verdadera
}
```

### Ejemplo

``` javascript
let temperatura = 30;

if (temperatura > 25) {
  console.log("Hace calor");
}
```

------------------------------------------------------------------------

# 3. if...else

Permite ejecutar un bloque si la condición es verdadera y otro si es
falsa.

``` javascript
if (condición) {
  // código si es verdadero
} else {
  // código si es falso
}
```

### Ejemplo

``` javascript
let edad = 16;

if (edad >= 18) {
  console.log("Puedes votar");
} else {
  console.log("No puedes votar todavía");
}
```

------------------------------------------------------------------------

# 4. if...else if...else

Se usa cuando hay múltiples condiciones posibles.

``` javascript
if (condición1) {
  // código
} else if (condición2) {
  // código
} else {
  // código
}
```

### Ejemplo

``` javascript
let nota = 85;

if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 70) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}
```

------------------------------------------------------------------------

# 5. Diagrama lógico de if / else

              ┌─────────────┐
              │  Condición  │
              └──────┬──────┘
                     │
               ¿Verdadero?
                /      \
              Sí        No
              │          │
       Ejecutar A   Ejecutar B

------------------------------------------------------------------------

# 6. Condicionales anidados

Un condicional puede estar dentro de otro.

``` javascript
let edad = 20;
let tieneLicencia = true;

if (edad >= 18) {
  if (tieneLicencia) {
    console.log("Puedes conducir");
  } else {
    console.log("Necesitas licencia");
  }
} else {
  console.log("Eres menor de edad");
}
```

### Diagrama

              Edad >=18?
              /      \
            Sí        No
            │          │
      Tiene licencia?  Menor de edad
          /   \
        Sí     No
        │       │
     Conducir  No conducir

------------------------------------------------------------------------

# 7. Operadores de comparación

Se usan dentro de las condiciones.

  Operador   Significado
  ---------- -----------------------
  `==`       Igual (compara valor)
  `===`      Igual estricto
  `!=`       Diferente
  `!==`      Diferente estricto
  `>`        Mayor que
  `<`        Menor que
  `>=`       Mayor o igual
  `<=`       Menor o igual

### Ejemplo

``` javascript
if (5 === "5") {
  console.log("Esto no se ejecuta");
}
```

`===` compara **valor y tipo**.

------------------------------------------------------------------------

# 8. Operadores lógicos

Permiten combinar condiciones.

  Operador   Nombre   Ejemplo
  ---------- -------- ---------
  `&&`       AND      a && b
  `||`       OR       a
  `!`        NOT      !a

### AND

``` javascript
let edad = 20;
let tieneEntrada = true;

if (edad >= 18 && tieneEntrada) {
  console.log("Puedes entrar");
}
```

### OR

``` javascript
if (edad < 12 || edad > 60) {
  console.log("Tienes descuento");
}
```

### NOT

``` javascript
let activo = false;

if (!activo) {
  console.log("Cuenta inactiva");
}
```

------------------------------------------------------------------------

# 9. Truthy y Falsy

JavaScript convierte valores a booleanos automáticamente.

## Valores falsy

    false
    0
    ""
    null
    undefined
    NaN

Ejemplo:

``` javascript
let nombre = "";

if (nombre) {
  console.log("Hay nombre");
} else {
  console.log("Nombre vacío");
}
```

------------------------------------------------------------------------

# 10. Operador ternario

Forma corta de `if...else`.

## Sintaxis

``` javascript
condición ? valorSiVerdadero : valorSiFalso
```

### Ejemplo

``` javascript
let edad = 20;

let mensaje = edad >= 18 ? "Adulto" : "Menor";
console.log(mensaje);
```

### Comparación

if/else:

``` javascript
if (edad >= 18) {
  mensaje = "Adulto";
} else {
  mensaje = "Menor";
}
```

ternario:

``` javascript
mensaje = edad >= 18 ? "Adulto" : "Menor";
```

------------------------------------------------------------------------

# 11. switch

Alternativa a múltiples `if else`.

``` javascript
switch (expresion) {
  case valor1:
    // código
    break;

  case valor2:
    // código
    break;

  default:
    // código
}
```

### Ejemplo

``` javascript
let dia = 3;

switch (dia) {
  case 1:
    console.log("Lunes");
    break;

  case 2:
    console.log("Martes");
    break;

  case 3:
    console.log("Miércoles");
    break;

  default:
    console.log("Día desconocido");
}
```

------------------------------------------------------------------------

# 12. Diagrama de switch

            Valor
              │
       ┌──────┼─────────┐
       │      │         │
     case1  case2     case3
       │      │         │
     código  código    código
       │      │         │
      break  break     break
             │
          default

------------------------------------------------------------------------

# 13. Short-circuit evaluation

JavaScript puede evaluar parcialmente expresiones.

### AND

``` javascript
usuario && console.log(usuario.nombre);
```

### OR

``` javascript
let nombre = usuario || "Invitado";
```

------------------------------------------------------------------------

# 14. Optional chaining con condicionales

``` javascript
if (usuario?.direccion?.ciudad) {
  console.log(usuario.direccion.ciudad);
}
```

Evita errores cuando una propiedad no existe.

------------------------------------------------------------------------

# 15. Buenas prácticas

### 1. Usar === en lugar de ==

``` javascript
if (a === b)
```

### 2. Evitar anidamientos profundos

Mejor:

``` javascript
if (!usuario) return;
```

### 3. Usar switch para muchos casos

------------------------------------------------------------------------

# 16. Ejemplo práctico completo

``` javascript
function evaluarNota(nota) {

  if (nota >= 90) {
    return "Excelente";
  }

  if (nota >= 70) {
    return "Aprobado";
  }

  if (nota >= 50) {
    return "Recuperación";
  }

  return "Reprobado";
}

console.log(evaluarNota(85));
```

------------------------------------------------------------------------

# 17. Diagrama general de flujo

    Inicio
      │
      ▼
    Evaluar condición
      │
     ┌┴───────────┐
     │            │
    Verdadero    Falso
     │            │
    Bloque A   Bloque B
     │            │
     └──────┬─────┘
            ▼
          Fin

------------------------------------------------------------------------

# 18. Resumen

Los condicionales principales en JavaScript son:

-   `if`
-   `if else`
-   `if else if`
-   `switch`
-   `operador ternario`

Estos permiten controlar la lógica de cualquier programa.

------------------------------------------------------------------------

# 19. Recursos recomendados

-   MDN JavaScript Docs
-   JavaScript.info
-   ECMAScript specification

------------------------------------------------------------------------

# Fin del documento
