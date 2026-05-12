/**
 * BUCLES Y CONTROL DE FLUJO
 * while, do...while y uso de break para salir antes de tiempo.
 */

let numero = 0

if (numero < 10) {
/* --- Condición simple con if --- */
    console.log("Es menor que 10");    
}

/* --- while: evalúa la condición al inicio de cada iteración --- */
while(numero < 6){
    numero++
    console.log(numero);
}

numero = 0
/* --- do...while: ejecuta al menos una vez y luego evalúa la condición --- */
do{
    console.log(numero);
    numero++
    
} while(numero <= 6)

numero = 0 
while (numero < 1000){
    numero++
    console.log(numero);
    if (numero == 10) {
        /* break: interrumpe el bucle por completo --- */
        break
    }
}