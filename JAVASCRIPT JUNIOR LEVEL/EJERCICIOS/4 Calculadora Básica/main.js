/**
 * EJERCICIO: calculadora básica con funciones flecha y menú por prompt.
 */

const respuesta = document.getElementById("respuesta");
const sol = document.getElementById("main-sol");

/** Suma dos valores numéricos */
const sumar = (num1, num2) => Number(num1) + Number(num2);

/** Resta dos valores numéricos */
const restar = (num1, num2) => Number(num1) - Number(num2);

/** Multiplica dos valores numéricos */
const multiplicar = (num1, num2) => Number(num1) * Number(num2);

/** Divide dos valores numéricos (el divisor cero se valida en calculo) */
const dividir = (num1, num2) => Number(num1) / Number(num2);

/** Pide un número válido por prompt y retorna null si se cancela o no es numérico */
function pedirNumero(mensaje) {
    const entrada = prompt(mensaje);
    if (entrada === null || entrada.trim() === "" || Number.isNaN(Number(entrada))) {
        return null;
    }
    return Number(entrada);
}

/** Muestra un mensaje de éxito (verde neón) o error (rojo neón) */
function mostrarResultado(texto, esError = false) {
    respuesta.className = esError ? "result error" : "result success";
    respuesta.textContent = texto;
    sol.style.display = "block";
}

/**
 * Lee la operación elegida, pide números por prompt y muestra el resultado.
 */
function calculo() {
    const operacion = document.getElementById("operacion").value;

    if (operacion < "1" || operacion > "4" || operacion === "") {
        return mostrarResultado("El valor ingresado no es correcto (elige entre 1 y 4).", true);
    }

    const numero1 = pedirNumero("Primer número");
    if (numero1 === null) return mostrarResultado("¡Error! Primer número inválido o cancelado.", true);

    const numero2 = pedirNumero("Segundo número");
    if (numero2 === null) return mostrarResultado("¡Error! Segundo número inválido o cancelado.", true);

    if (operacion == 1) {
        mostrarResultado(`El resultado de la suma es ${sumar(numero1, numero2)}`);
    } else if (operacion == 2) {
        mostrarResultado(`El resultado de la resta es ${restar(numero1, numero2)}`);
    } else if (operacion == 3) {
        mostrarResultado(`El resultado de la multiplicación es ${multiplicar(numero1, numero2)}`);
    } else if (operacion == 4) {
        if (numero2 === 0) {
            mostrarResultado("¡Error! No se puede dividir entre 0.", true);
        } else {
            mostrarResultado(`El resultado de la división es ${dividir(numero1, numero2)}`);
        }
    }
}
