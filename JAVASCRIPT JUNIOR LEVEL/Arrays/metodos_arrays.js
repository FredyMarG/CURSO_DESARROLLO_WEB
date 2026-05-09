//************** METODOS TRANSFORMADORES DE ARRAYS************//
let nombres = ["Juan", "María", "Pedro", "Ana"];
let resultado;

resultado = nombres.pop(); // Elimina el último elemento del array y lo devuelve
console.log(resultado);

resultado = nombres.shift(); // Elimina el primer elemento del array y lo devuelve
console.log(resultado);

resultado = nombres.push("Luis", "Carlos"); // Agrega un elemento al final del array y devuelve la nueva longitud del array
console.log(resultado);

let numeros = [ 3, 4, 5];
resultado = numeros.unshift(0,1,2); // Agrega un elemento al inicio del array y devuelve la nueva longitud del array
console.log(numeros);
console.log(resultado);

console.log(nombres);

resultado = nombres.reverse(); // Invierte el orden de los elementos del array y lo devuelve
console.log(resultado);

let num = [3,1,6,5,7,8,9,2,4];
let cadena = ["zara", "alvaro", "cartier", "berska", "dolce gabana"];
resultado = num.sort(); // Ordena los elementos del array y lo devuelve
console.log(resultado);
resultado = cadena.sort(); // Ordena los elementos del array y lo devuelve
console.log(resultado);

resultado = cadena.splice(3,0,"animales","mascotas","vegetales"); // Elimina elementos del array y/o agrega nuevos elementos en su lugar, devuelve un nuevo array con los elementos eliminados
resultado = num.splice(2,6); // Elimina elementos del array y/o agrega nuevos elementos en su lugar, devuelve un nuevo array con los elementos eliminados
console.log(cadena);
console.log(num);

//************** METODOS ACCESORES DE ARRAYS************//
let frutas = ["manzana", "banana", "naranja", "pera"];
resultado = frutas.join(" - "); // Une todos los elementos del array en una cadena y lo devuelve
console.log(resultado);

resultado = frutas.slice(0,3); // Devuelve una copia de una parte del array dentro de un nuevo array, desde el índice de inicio hasta el índice de fin (no incluido)
console.log(resultado);

resultado = frutas.includes("banana"); // Devuelve true si el elemento se encuentra en el array, o false si no se encuentra
console.log(resultado);
resultado = frutas.indexOf("banana"); // Devuelve el primer índice del elemento en el array, o -1 si no se encuentra
console.log(resultado);

//************** METODOS DE REPETICION DE ARRAYS************//
let numeros2 = [1,2,3,4,5];
resultado = numeros2.filter(n => n >= 1); // Crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada
console.log(resultado);

resultado = numeros2.forEach(n => console.log(n)); // Ejecuta una función dada una vez por cada elemento del array
console.log(resultado);

resultado = numeros2.map(n => n * 2); // Crea un nuevo array con los resultados de la llamada a una función proporcionada aplicada a cada elemento del array
console.log(resultado);
