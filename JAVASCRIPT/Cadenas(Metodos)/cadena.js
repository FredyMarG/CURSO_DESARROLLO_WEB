let cadena = "cadena de prueba",
    cadena2 = " cadena";
//Unir texto
resultado = cadena.concat(cadena2);
console.log(resultado);

//buscar cadena y darnos un valor booleano
resultado = cadena.startsWith(cadena2);//valida si la cadena empieza con el valor dado
console.log(resultado);

resultado = cadena.endsWith("prueba");//valida si la cadena termina con el valor dado
console.log(resultado);

resultado = cadena.includes(cadena2);//valida si la cadena contiene el valor dado
console.log(resultado);

resultado = cadena.indexOf("de");//devuelve la posicion inicial del valor dado
console.log(resultado);

resultado = cadena.lastIndexOf("prueba");//devuelve la posicion final del valor dado
console.log(resultado);

//Rellenar la cadena acorde a la modificacion dada
cadena = "abc";
resultado = cadena.padStart(6,"4");//repite la cadena el numero de veces dado hassta alcanzar la longitud dada, en este caso 6, y lo hace al inicio de la cadena
console.log(resultado);

resultado = cadena.padEnd(6,"4");//repite la cadena el numero de veces dado hassta alcanzar la longitud dada, en este caso 6, y lo hace al final de la cadena
console.log(resultado);

cadena = "123 ";
resultado = cadena.repeat(4);//repite la cadena el numero de veces dado
console.log(resultado);

//Transformar la cadena como deseemos
cadena = "Hola como estas?";
resultado = cadena.split(" ");//divide la cadena en un array de subcadenas, usando el valor dado como separador
console.log(resultado);

cadena = "AbCdEfG";
resultado = cadena.substring(2, 5);//devuelve una parte de la cadena entre los indices dados
console.log(resultado);

resultado = cadena.toLowerCase();//convierte la cadena a minusculas
console.log(resultado);

resultado = cadena.toUpperCase();//convierte la cadena a mayusculas
console.log(resultado);

let num = 550;
resultado = num.toString();//convierte el numero a cadena
console.log(resultado);

cadena = "   cadena con espacios   ";
resultado = cadena.trim();//elimina los espacios en blanco al inicio y al final de la cadena
console.log(resultado);

cadena = "   cadena de prueba     ";
resultado = cadena.trimStart();//elimina los espacios en blanco al inicio de la cadena
console.log(resultado);

resultado = cadena.trimEnd();//elimina los espacios en blanco al final de la cadena
console.log(resultado)

cadena = "cadena de prueba";
resultado = cadena.replace("prueba", "ejemplo");//reemplaza el valor dado por el nuevo valor dado
console.log(resultado); 

resultado = cadena.replaceAll("a", "4");//reemplaza todas las apariciones del valor dado por el nuevo valor dado
console.log(resultado); 

resultado = cadena.slice(0, 6);//devuelve una parte de la cadena entre los indices dados, similar a substring pero con la diferencia de que acepta indices negativos para contar desde el final de la cadena
console.log(resultado);

resultado = cadena.valueOf();//devuelve el valor primitivo de la cadena
console.log(resultado);