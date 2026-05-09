let respuesta = document.getElementById("respuesta"),
    calc = document.getElementById("calcular"),
    sol = document.getElementById("main-sol"),
    num1,
    num2;

class Calculadora{
    constructor(){
    }
    sumar(num1,num2){
        return parseInt(num1) + parseInt(num2)
    }
    restar(num1,num2){
        return parseInt(num1) - parseInt(num2)
    }
    multiplicar(num1,num2){
        return parseInt(num1) * parseInt(num2)
    }
    dividir(num1,num2){
        return parseInt(num1) / parseInt(num2)
    }

    potencia(num,exp){
        return parseInt(Math.pow(num,exp))
    }

    raizCuadrada(num){
        return parseInt(Math.sqrt(num))
    }

    raizCubica(num){
        return parseInt(Math.cbrt(num))
    }
}

const calculadora = new Calculadora();

function calculo() {
    let operacion = document.getElementById("operacion")
    operacion = operacion.value
    if (operacion == 1) {
        let numero1 = prompt("Primer número para sumar")
        let numero2 = prompt("Segundo número para sumar")
        resultado = calculadora.sumar(numero1,numero2)
        respuesta.innerHTML = `${numero1} + ${numero2} es ${resultado}`
    }else if (operacion == 2) {
        let numero1 = prompt("Primer número para restar")
        let numero2 = prompt("Segundo número para restar")
        resultado = calculadora.restar(numero1,numero2)
        respuesta.innerHTML = `${numero1} - ${numero2} es ${resultado}`
    }else if (operacion == 3) {
        let numero1 = prompt("Primer número para múltipicar")
        let numero2 = prompt("Segundo número para múltipicar")
        resultado = calculadora.multiplicar(numero1,numero2)
        respuesta.innerHTML = `${numero1} * ${numero2} es ${resultado}`
    }else if (operacion == 4) {
        let numero1 = prompt("Primer número para dividir")
        let numero2 = prompt("Segundo número para dividir")
        if (numero2 == 0) {
            respuesta.innerHTML = `!Error¡ no se puede dividir entre 0`
        }else{
            resultado = calculadora.dividir(numero1,numero2)
            respuesta.innerHTML = `${numero1} / ${numero2} es ${resultado}`
        }
    }
    else if (operacion == 5) {
        let numero1 = prompt("Número para calcular la potencia")
        let numero2 = prompt("Ingrese el exponente para calcular la potencia")
        resultado = calculadora.potencia(numero1,numero2)
        respuesta.innerHTML = `${numero1} a la ${numero2} es ${resultado}`
    }
    else if (operacion == 6) {
        let numero1 = prompt("Número para calcular la raíz cuadrada")
        resultado = calculadora.raizCuadrada(numero1)
        respuesta.innerHTML = `La raíz cuadrada de ${numero1} es ${resultado}`
    }
    else if (operacion == 7) {
        let numero1 = prompt("Número para calcular la raíz cúbica")
        resultado = calculadora.raizCubica(numero1)
        respuesta.innerHTML = `La raíz cúbica de ${numero1} es ${resultado}`
    }
    else{
            respuesta.innerHTML = "El valor ingresado no es correcto"
    }

    sol.style.display = "block"
}