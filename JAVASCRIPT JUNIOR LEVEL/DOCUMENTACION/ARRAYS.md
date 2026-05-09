# Guía Completa de Arrays en JavaScript

## 1. ¿Qué es un Array?

Un **array** es una estructura de datos que permite almacenar múltiples
valores dentro de una sola variable.

En JavaScript los arrays pueden almacenar **cualquier tipo de dato**:

-   Números
-   Strings
-   Booleanos
-   Objetos
-   Funciones
-   Otros arrays

``` javascript
let numeros = [1, 2, 3, 4, 5];
let mezcla = [10, "hola", true, null];
```

------------------------------------------------------------------------

# 2. Estructura de un Array

Diagrama conceptual:

    Índice:     0     1     2     3
               ┌───┬───┬───┬───┐
    Array =    │10 │20 │30 │40 │
               └───┴───┴───┴───┘

Cada valor tiene un **índice**, que empieza desde **0**.

``` javascript
let numeros = [10, 20, 30, 40];

console.log(numeros[0]); // 10
console.log(numeros[2]); // 30
```

------------------------------------------------------------------------

# 3. Crear Arrays

## Forma 1: Literal

``` javascript
let frutas = ["manzana", "pera", "mango"];
```

## Forma 2: Constructor

``` javascript
let numeros = new Array(1,2,3,4);
```

------------------------------------------------------------------------

# 4. Propiedad length

Indica el número de elementos del array.

``` javascript
let frutas = ["manzana", "pera", "mango"];

console.log(frutas.length); // 3
```

Diagrama:

    ["manzana","pera","mango"]
          0        1       2

    length = 3

------------------------------------------------------------------------

# 5. Modificar Elementos

``` javascript
let numeros = [10,20,30];

numeros[1] = 50;

console.log(numeros);
// [10,50,30]
```

------------------------------------------------------------------------

# 6. Recorrer Arrays

## For tradicional

``` javascript
let numeros = [10,20,30];

for(let i = 0; i < numeros.length; i++){
    console.log(numeros[i]);
}
```

Diagrama:

    i = 0 → numeros[0]
    i = 1 → numeros[1]
    i = 2 → numeros[2]

------------------------------------------------------------------------

## for...of

``` javascript
for(let valor of numeros){
    console.log(valor);
}
```

------------------------------------------------------------------------

## forEach

``` javascript
numeros.forEach(function(n){
    console.log(n);
});
```

------------------------------------------------------------------------

# 7. Métodos Principales de Arrays

## push()

Agrega un elemento al final.

``` javascript
let colores = ["rojo","verde"];

colores.push("azul");

console.log(colores);
```

Diagrama:

    ANTES

    ["rojo","verde"]

    DESPUÉS

    ["rojo","verde","azul"]

------------------------------------------------------------------------

## pop()

Elimina el último elemento.

``` javascript
colores.pop();
```

------------------------------------------------------------------------

## shift()

Elimina el primer elemento.

``` javascript
colores.shift();
```

------------------------------------------------------------------------

## unshift()

Agrega un elemento al inicio.

``` javascript
colores.unshift("amarillo");
```

------------------------------------------------------------------------

# 8. Métodos de Búsqueda

## indexOf()

``` javascript
let frutas = ["manzana","pera","mango"];

frutas.indexOf("pera"); // 1
```

------------------------------------------------------------------------

## includes()

``` javascript
frutas.includes("mango"); // true
```

------------------------------------------------------------------------

# 9. Métodos de Transformación

## map()

Crea un nuevo array transformando los datos.

``` javascript
let numeros = [1,2,3];

let dobles = numeros.map(n => n*2);

console.log(dobles);
// [2,4,6]
```

Diagrama:

    [1,2,3]
      │ │ │
      ▼ ▼ ▼
    [2,4,6]

------------------------------------------------------------------------

## filter()

Filtra elementos.

``` javascript
let numeros = [1,2,3,4,5];

let pares = numeros.filter(n => n % 2 === 0);

console.log(pares);
// [2,4]
```

------------------------------------------------------------------------

## reduce()

Reduce todos los valores a uno solo.

``` javascript
let numeros = [1,2,3,4];

let suma = numeros.reduce((acc,n)=>acc+n,0);

console.log(suma);
// 10
```

Diagrama:

    [1,2,3,4]

    1+2=3
    3+3=6
    6+4=10

------------------------------------------------------------------------

# 10. Arrays Multidimensionales

Son arrays dentro de otros arrays.

``` javascript
let matriz = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];
```

Diagrama:

            0   1   2
          ┌───────────┐
    0     │1   2   3  │
    1     │4   5   6  │
    2     │7   8   9  │
          └───────────┘

Acceso:

``` javascript
matriz[1][2] // 6
```

------------------------------------------------------------------------

# 11. Arrays Asociativos

JavaScript **no tiene arrays asociativos reales** como PHP.

Pero podemos usar **objetos**.

## Ejemplo incorrecto (NO recomendado)

``` javascript
let persona = [];
persona["nombre"] = "Juan";
persona["edad"] = 30;
```

Esto realmente crea **propiedades de objeto**, no índices.

------------------------------------------------------------------------

## Forma correcta: Objetos

``` javascript
let persona = {
    nombre: "Juan",
    edad: 30,
    ciudad: "Bogotá"
};
```

Diagrama:

    persona

    nombre → "Juan"
    edad   → 30
    ciudad → "Bogotá"

Acceso:

``` javascript
console.log(persona.nombre);
console.log(persona["edad"]);
```

------------------------------------------------------------------------

# 12. Arrays de Objetos

Muy usados en aplicaciones.

``` javascript
let usuarios = [
    {nombre:"Ana", edad:25},
    {nombre:"Luis", edad:30},
    {nombre:"Pedro", edad:40}
];
```

Diagrama:

    usuarios
    │
    ├── 0 → {nombre:"Ana", edad:25}
    ├── 1 → {nombre:"Luis", edad:30}
    └── 2 → {nombre:"Pedro", edad:40}

Acceso:

``` javascript
console.log(usuarios[0].nombre);
```

------------------------------------------------------------------------

# 13. Spread Operator con Arrays

Permite copiar o combinar arrays.

``` javascript
let a = [1,2,3];
let b = [...a];

console.log(b);
```

Combinar:

``` javascript
let c = [...a,4,5,6];
```

------------------------------------------------------------------------

# 14. Destructuring

Permite extraer valores.

``` javascript
let numeros = [10,20,30];

let [a,b,c] = numeros;

console.log(a); //10
```

------------------------------------------------------------------------

# 15. Buenas Prácticas

✔ Usar `const` cuando el array no cambiará de referencia\
✔ Usar `map`, `filter`, `reduce` en lugar de loops complejos\
✔ Usar objetos en lugar de arrays asociativos\
✔ Nombrar arrays en plural

Ejemplo:

``` javascript
const usuarios = [];
```

------------------------------------------------------------------------

# 16. Resumen Visual

    ARRAY

    [10,20,30]

       │
       ├── índice 0 → 10
       ├── índice 1 → 20
       └── índice 2 → 30

    ARRAY DE OBJETOS

    [
     {nombre:"Ana"},
     {nombre:"Luis"},
     {nombre:"Pedro"}
    ]

------------------------------------------------------------------------

# 17. Conclusión

Los arrays son una de las estructuras **más importantes de JavaScript**.

Permiten:

-   almacenar colecciones de datos
-   recorrer información
-   transformar datos
-   trabajar con estructuras complejas

Dominar arrays es **fundamental para aprender JavaScript avanzado**.
