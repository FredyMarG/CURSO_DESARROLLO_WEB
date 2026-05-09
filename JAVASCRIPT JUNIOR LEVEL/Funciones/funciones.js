/**
    funciones
 */
function saludar() {
    respuesta = prompt("¡Hola Fredy! ¿Como fue tu dia?")
    if (respuesta == "bien") {
        alert("Me alegro")
    }else{
        alert("Una pena")
    }
}
saludar()

/**
    RETURN
 */

// con return le asignamos un valor de retorno a la funcion y la finaliza
function sal() {
    alert("hola");
    return "La funcion te saludo <br>"
}
let saludo = sal()
document.write(saludo)

/**
    PARAMETROS
 */

function suma(num1,num2) {
    let res = num1 + num2
    return res
}
let resultado = suma(20,25)
document.write(resultado + "<br>")

function saludos(nombre){
    let frase = `!Hola ${nombre}¡ ¿Como estas? <br>`
    document.write(frase)
}
saludos("petrosky")

// SCOPE
let frase = `!Hola ${nombre}¡ ¿Como estas?`
const sayHi = function(nombre){
    document.write(frase)
}

//const sayHi = nombre=> document.write(frase) abreviatura de funciones

sayHi("Pedro")