/**
 * EJERCICIO: calculadora orientada a objetos (clase Calculadora).
 */

const respuesta = document.getElementById("respuesta"); // Obtiene referencia DOM para "respuesta"
const sol = document.getElementById("main-sol"); // Obtiene referencia DOM para "sol"

/** Agrupa operaciones aritméticas básicas, potencia y raíces */
class Calculadora { // Define clase
    sumar(num1, num2) { // Instrucción JavaScript
        return Number(num1) + Number(num2); // Retorna resultado
    }
    restar(num1, num2) { // Instrucción JavaScript
        return Number(num1) - Number(num2); // Retorna resultado
    }
    multiplicar(num1, num2) { // Instrucción JavaScript
        return Number(num1) * Number(num2); // Retorna resultado
    }
    dividir(num1, num2) { // Instrucción JavaScript
        return Number(num1) / Number(num2); // Retorna resultado
    }
    potencia(num, exp) { // Instrucción JavaScript
        return Math.pow(Number(num), Number(exp)); // Retorna resultado
    }
    raizCuadrada(num) { // Instrucción JavaScript
        return Math.sqrt(Number(num)); // Retorna resultado
    }
    raizCubica(num) { // Instrucción JavaScript
        return Math.cbrt(Number(num)); // Retorna resultado
    }
}

const calculadora = new Calculadora(); // Declara e inicializa "calculadora"

/** Pide un número válido por prompt y retorna null si se cancela o es inválido */
function pedirNumero(mensaje) { // Declara función
    const entrada = prompt(mensaje); // Declara e inicializa "entrada"
    if (entrada === null || entrada.trim() === "" || Number.isNaN(Number(entrada))) { // Evalúa condición
        return null; // Retorna resultado
    }
    return Number(entrada); // Retorna resultado
}

/** Muestra el resultado en verde neón (acierto) o rojo neón (error) */
function mostrarResultado(texto, esError = false) { // Declara función
    respuesta.className = esError ? "result error" : "result success"; // Asigna valor
    respuesta.textContent = texto; // Actualiza contenido en el DOM
    sol.style.display = "block"; // Asigna valor
}

/**
 * Delega cada operación en la instancia `calculadora` y valida entradas.
 */
function calculo() { // Declara función
    const operacion = document.getElementById("operacion").value; // Obtiene referencia DOM para "operacion"

    if (operacion === "" || Number(operacion) < 1 || Number(operacion) > 7) { // Evalúa condición
        return mostrarResultado("El valor ingresado no es correcto (elige entre 1 y 7).", true); // Retorna resultado
    }

    if (operacion >= 1 && operacion <= 5) { // Evalúa condición
        const numero1 = pedirNumero("Primer número"); // Declara e inicializa "numero1"
        if (numero1 === null) return mostrarResultado("¡Error! Primer número inválido o cancelado.", true); // Evalúa condición

        const numero2 = pedirNumero(operacion == 5 ? "Ingrese el exponente" : "Segundo número"); // Declara e inicializa "numero2"
        if (numero2 === null) return mostrarResultado("¡Error! Segundo número inválido o cancelado.", true); // Evalúa condición

        if (operacion == 1) { // Evalúa condición
            mostrarResultado(`${numero1} + ${numero2} = ${calculadora.sumar(numero1, numero2)}`); // Ejecuta llamada o método
        } else if (operacion == 2) { // Instrucción JavaScript
            mostrarResultado(`${numero1} - ${numero2} = ${calculadora.restar(numero1, numero2)}`); // Ejecuta llamada o método
        } else if (operacion == 3) { // Instrucción JavaScript
            mostrarResultado(`${numero1} × ${numero2} = ${calculadora.multiplicar(numero1, numero2)}`); // Ejecuta llamada o método
        } else if (operacion == 4) { // Instrucción JavaScript
            if (numero2 === 0) { // Evalúa condición
                mostrarResultado("¡Error! No se puede dividir entre 0.", true); // Ejecuta llamada o método
            } else { // Instrucción JavaScript
                mostrarResultado(`${numero1} ÷ ${numero2} = ${calculadora.dividir(numero1, numero2)}`); // Ejecuta llamada o método
            }
        } else if (operacion == 5) { // Instrucción JavaScript
            mostrarResultado(`${numero1} ^ ${numero2} = ${calculadora.potencia(numero1, numero2)}`); // Ejecuta llamada o método
        }
    } else if (operacion == 6) { // Instrucción JavaScript
        const numero1 = pedirNumero("Número para calcular la raíz cuadrada"); // Declara e inicializa "numero1"
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true); // Evalúa condición
        if (numero1 < 0) return mostrarResultado("¡Error! No existe raíz cuadrada real de un número negativo.", true); // Evalúa condición
        mostrarResultado(`La raíz cuadrada de ${numero1} es ${calculadora.raizCuadrada(numero1)}`); // Ejecuta llamada o método
    } else if (operacion == 7) { // Instrucción JavaScript
        const numero1 = pedirNumero("Número para calcular la raíz cúbica"); // Declara e inicializa "numero1"
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true); // Evalúa condición
        mostrarResultado(`La raíz cúbica de ${numero1} es ${calculadora.raizCubica(numero1)}`); // Ejecuta llamada o método
    }
}
