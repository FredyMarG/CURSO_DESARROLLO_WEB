let respuesta = document.getElementById("respuesta"),
    calc = document.getElementById("calcular"),
    sol = document.getElementById("main-sol"),
    num1,
    num2

    const sumar = (num1,num2)=>{
        return parseInt(num1) + parseInt(num2)
    }
    const restar = (num1,num2)=>{
        return parseInt(num1) - parseInt(num2)
    }
    const multiplicar = (num1,num2)=>{
        return parseInt(num1) * parseInt(num2)
    }
    const dividir = (num1,num2)=>{
        return parseInt(num1) / parseInt(num2)
    }

function calculo() {
    let operacion = document.getElementById("operacion")
    operacion = operacion.value
    if (operacion == 1) {
        let numero1 = prompt("Primer número para sumar")
        let numero2 = prompt("Segundo número para sumar")
        resultado = sumar(numero1,numero2)
        respuesta.innerHTML = `El resultado de la suma es ${resultado}`
    }else if (operacion == 2) {
        let numero1 = prompt("Primer número para restar")
        let numero2 = prompt("Segundo número para restar")
        resultado = restar(numero1,numero2)
        respuesta.innerHTML = `El resultado de la resta es ${resultado}`
    }else if (operacion == 3) {
        let numero1 = prompt("Primer número para multipicar")
        let numero2 = prompt("Segundo número para multipicar")
        resultado = multiplicar(numero1,numero2)
        respuesta.innerHTML = `El resultado de la multiplicación es ${resultado}`
    }else if (operacion == 4) {
        let numero1 = prompt("Primer número para dividir")
        let numero2 = prompt("Segundo número para dividir")
        if (numero2 == 0) {
            respuesta.innerHTML = `!Error¡ no se puede dividir entre 0`
        }else{
            resultado = dividir(numero1,numero2)
            respuesta.innerHTML = `El resultado de la división es ${resultado}`
        }
    }else{
            respuesta.innerHTML = "El valor ingresado no es correcto"
    }

    sol.style.display = "block"
}