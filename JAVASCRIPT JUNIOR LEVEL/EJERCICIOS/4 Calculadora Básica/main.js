/**
 * EJERCICIO: calculadora básica con funciones flecha y menú por prompt.
 */

const respuesta = document.getElementById("respuesta"); // Obtiene referencia DOM para "respuesta"
const sol = document.getElementById("main-sol"); // Obtiene referencia DOM para "sol"

/** Suma dos valores numéricos */
const sumar = (num1, num2) => Number(num1) + Number(num2); // Define función flecha "sumar"

/** Resta dos valores numéricos */
const restar = (num1, num2) => Number(num1) - Number(num2); // Define función flecha "restar"

/** Multiplica dos valores numéricos */
const multiplicar = (num1, num2) => Number(num1) * Number(num2); // Define función flecha "multiplicar"

/** Divide dos valores numéricos (el divisor cero se valida en calculo) */
const dividir = (num1, num2) => Number(num1) / Number(num2); // Define función flecha "dividir"

/** Pide un número válido por prompt y retorna null si se cancela o no es numérico */
function pedirNumero(mensaje) { // Declara función
    const entrada = prompt(mensaje); // Declara e inicializa "entrada"
    if (entrada === null || entrada.trim() === "" || Number.isNaN(Number(entrada))) { // Evalúa condición
        return null; // Retorna resultado
    }
    return Number(entrada); // Retorna resultado
}

/** Muestra un mensaje de éxito (verde neón) o error (rojo neón) */
function mostrarResultado(texto, esError = false) { // Declara función
    respuesta.className = esError ? "result error" : "result success"; // Asigna valor
    respuesta.textContent = texto; // Actualiza contenido en el DOM
    sol.style.display = "block"; // Asigna valor
}

/**
 * Lee la operación elegida, pide números por prompt y muestra el resultado.
 */
function calculo() { // Declara función
    const operacion = document.getElementById("operacion").value; // Obtiene referencia DOM para "operacion"

    if (operacion < "1" || operacion > "4" || operacion === "") { // Evalúa condición
        return mostrarResultado("El valor ingresado no es correcto (elige entre 1 y 4).", true); // Retorna resultado
    }

    const numero1 = pedirNumero("Primer número"); // Declara e inicializa "numero1"
    if (numero1 === null) return mostrarResultado("¡Error! Primer número inválido o cancelado.", true); // Evalúa condición

    const numero2 = pedirNumero("Segundo número"); // Declara e inicializa "numero2"
    if (numero2 === null) return mostrarResultado("¡Error! Segundo número inválido o cancelado.", true); // Evalúa condición

    if (operacion == 1) { // Evalúa condición
        mostrarResultado(`El resultado de la suma es ${sumar(numero1, numero2)}`); // Ejecuta llamada o método
    } else if (operacion == 2) { // Instrucción JavaScript
        mostrarResultado(`El resultado de la resta es ${restar(numero1, numero2)}`); // Ejecuta llamada o método
    } else if (operacion == 3) { // Instrucción JavaScript
        mostrarResultado(`El resultado de la multiplicación es ${multiplicar(numero1, numero2)}`); // Ejecuta llamada o método
    } else if (operacion == 4) { // Instrucción JavaScript
        if (numero2 === 0) { // Evalúa condición
            mostrarResultado("¡Error! No se puede dividir entre 0.", true); // Ejecuta llamada o método
        } else { // Instrucción JavaScript
            mostrarResultado(`El resultado de la división es ${dividir(numero1, numero2)}`); // Ejecuta llamada o método
        }
    }
}
