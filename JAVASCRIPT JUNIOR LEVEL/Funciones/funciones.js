/**
 * DEFINICIÓN DE FUNCIONES BÁSICAS
 * Un bloque de código reutilizable que realiza una acción.
 */

/** Solicita entrada al usuario y muestra una respuesta condicional */
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
 * VALORES DE RETORNO (RETURN)
 * Especifica qué dato devuelve la función al ser ejecutada y finaliza su ejecución.
 */

/** 
 * Muestra una alerta y retorna un string con formato HTML 
 * @returns {string} Frase de saludo
 */
function sal() {
    alert("hola");
    return "La funcion te saludo <br>"
}
let saludo = sal()
document.write(saludo)

/**
 * USO DE PARÁMETROS
 * Variables locales que la función utiliza para procesar datos dinámicos.
 */

/**
 * Suma dos valores numéricos
 * @param {number} num1 Primer sumando
 * @param {number} num2 Segundo sumando
 * @returns {number} Resultado de la suma
 */
function suma(num1,num2) {
    let res = num1 + num2
    return res
}

let resultado = suma(20,25)
document.write(resultado + "<br>")

/**
 * Escribe un saludo personalizado en el documento
 * @param {string} nombre Nombre de la persona a saludar
 */
function saludos(nombre){
    let frase = `!Hola ${nombre}¡ ¿Como estas? <br>`
    document.write(frase)
}
saludos("petrosky")

/**
 * ÁMBITO (SCOPE) Y FUNCIONES EXPRESADAS
 */

/** 
 * Función anónima asignada a una constante (Function Expression)
 * @param {string} nombre 
 */
const sayHi = function(nombre){
    let fraseLocal = `!Hola ${nombre}¡ ¿Como estas? <br>`;
    document.write(fraseLocal);
}

//const sayHi = nombre=> document.write(frase) abreviatura de funciones

// Invocación de la función expresada sayHi.
sayHi("Pedro");