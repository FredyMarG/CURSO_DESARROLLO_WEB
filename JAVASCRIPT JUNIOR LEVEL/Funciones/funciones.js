/**
    DEFINICIÓN DE FUNCIONES BÁSICAS
    Un bloque de código reutilizable que realiza una acción.
 */
function saludar() {
    respuesta = prompt("¡Hola Fredy! ¿Como fue tu dia?")
    if (respuesta == "bien") {
        alert("Me alegro")
    }else{
        alert("Una pena")
    }
}
// Invocación de la función saludar.
saludar()

/**
    VALORES DE RETORNO (RETURN)
    Especifica qué dato devuelve la función al ser ejecutada.
 */

// con return le asignamos un valor de retorno a la funcion y la finaliza
function sal() {
    alert("hola");
    return "La funcion te saludo <br>"
}
// Invocación de la función sal y almacenamiento de su retorno.
let saludo = sal()
document.write(saludo)

/**
    USO DE PARÁMETROS
    Variables que recibe la función para trabajar con datos externos.
 */

function suma(num1,num2) {
    let res = num1 + num2
    return res
}
/**
 * Los parámetros (num1, num2) actúan como variables locales dentro de la función.
 * Al invocar suma(20, 25), los valores 20 y 25 se conocen como argumentos.
 */
let resultado = suma(20,25)
document.write(resultado + "<br>")

function saludos(nombre){
    let frase = `!Hola ${nombre}¡ ¿Como estas? <br>`
    document.write(frase)
}
saludos("petrosky")

/**
 * ÁMBITO (SCOPE) Y FUNCIONES EXPRESADAS
 */
// NOTA: La variable 'nombre' aquí no está definida en el ámbito global, lo que causaría un error.
// La función 'sayHi' debería usar su propio parámetro 'nombre' o una variable definida en su scope.
const sayHi = function(nombre){
    // Se utiliza el parámetro 'nombre' de la función para construir la frase.
    let fraseLocal = `!Hola ${nombre}¡ ¿Como estas? <br>`;
    document.write(fraseLocal);
}

//const sayHi = nombre=> document.write(frase) abreviatura de funciones

// Invocación de la función expresada sayHi.
sayHi("Pedro");