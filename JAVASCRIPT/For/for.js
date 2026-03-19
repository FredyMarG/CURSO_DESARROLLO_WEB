for (let i = 0; i < 6; i++) {
    console.log(i + "<br>");
    
}

for(let i = 0; i < 20; i++){
    if (i == 12) {
        //con continue me estoy saltando el numero 12, si con break lo termino con continue me lo salto
        continue
    }
    console.log(i + "<br>");
}


let animales = ["gato", "perro", "tiranosaurio rex"]
animales.edad = 20
//en el in me muestra las propiedades en of no
for(animal in animales){
    //in me devuelce la posicion de cada uno de los elementos
    document.write(animales[animal] + "<br>");
    //como in me devuelve la posicion del array, tengo que animal en la posicion 0 es gato por lo que animales[animal] me devolvera el item asumiendo que animal es igual a tener 0 animales[0]=gato
}

document.write("<br>");

for(animal of animales){
    document.write(animal + "<br>");
}

document.write("<br>");

array1 = ["maria", "josefa", "roberta"]
array2 = ["pedro", "marcelo", array1, "josefina"]

forRancio: //este es el label
for (let array in array2){
    if (array == 2) {
        for (let array of array1) {
            continue forRancio
            document.write(array + "<br>")
        }
    }else{
            document.write(array2[array] + "<br>")
    }
}