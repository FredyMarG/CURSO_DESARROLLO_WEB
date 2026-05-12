/**
 * BUCLE for Y VARIANTES
 * for clásico, continue, for...in, for...of y etiquetas (labels).
 */

/* --- Bucle for básico: cuenta de 0 a 5 --- */
for (let i = 0; i < 6; i++) {
    console.log(i + "<br>");
    
}

for(let i = 0; i < 20; i++){
    if (i == 12) {
/* --- continue: salta a la siguiente iteración sin ejecutar el resto del cuerpo --- */
        continue
    }
    console.log(i + "<br>");
}


let animales = ["gato", "perro", "tiranosaurio rex"]
animales.edad = 20
/* --- for...in: itera sobre nombres de propiedades (índices en arrays, claves en objetos) --- */
for(animal in animales){
    /* in devuelve la clave; animales[clave] accede al valor en esa posición --- */
    document.write(animales[animal] + "<br>");
    /* Explicación: con arrays, 'animal' es el índice (0,1,2...); animales[animal] es el elemento --- */
}

/* --- for...of: itera directamente sobre los valores del iterable --- */
for(animal of animales){
    document.write(animal + "<br>");
}

document.write("<br>");

array1 = ["maria", "josefa", "roberta"]
array2 = ["pedro", "marcelo", array1, "josefina"]

/* --- Etiqueta (label) + continue: salta al siguiente ciclo del bucle externo nombrado --- */
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