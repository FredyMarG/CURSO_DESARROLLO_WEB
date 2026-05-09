let numero = 0

if (numero < 10) {
    console.log("Es menor que 10");    
}

//while pregunta y ejecuta hasta que la condicion sea falsa
while(numero < 6){
    numero++
    console.log(numero);
}

numero = 0
//do while ejecuta la condicion al menos una vez y luego pregunta, y ejecuta hasta que la condicion sea falsa
do{
    console.log(numero);
    numero++
    
} while(numero <= 6)

numero = 0 
while (numero < 1000){
    numero++
    console.log(numero);
    if (numero == 10) {
        //con break rompemos el ciclo, en este caso cuando numero es igual a 10 termina el while
        break
    }
}