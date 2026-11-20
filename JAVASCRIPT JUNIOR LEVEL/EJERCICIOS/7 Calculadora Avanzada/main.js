/**
 * EJERCICIO: calculadora orientada a objetos (clase Calculadora).
 */

const respuesta = document.getElementById("respuesta");
const sol = document.getElementById("main-sol");

/** Agrupa operaciones aritméticas básicas, potencia y raíces */
class Calculadora {
    sumar(num1, num2) {
        return Number(num1) + Number(num2);
    }
    restar(num1, num2) {
        return Number(num1) - Number(num2);
    }
    multiplicar(num1, num2) {
        return Number(num1) * Number(num2);
    }
    dividir(num1, num2) {
        return Number(num1) / Number(num2);
    }
    potencia(num, exp) {
        return Math.pow(Number(num), Number(exp));
    }
    raizCuadrada(num) {
        return Math.sqrt(Number(num));
    }
    raizCubica(num) {
        return Math.cbrt(Number(num));
    }
}

const calculadora = new Calculadora();

/** Pide un número válido por prompt y retorna null si se cancela o es inválido */
function pedirNumero(mensaje) {
    const entrada = prompt(mensaje);
    if (entrada === null || entrada.trim() === "" || Number.isNaN(Number(entrada))) {
        return null;
    }
    return Number(entrada);
}

/** Muestra el resultado en verde neón (acierto) o rojo neón (error) */
function mostrarResultado(texto, esError = false) {
    respuesta.className = esError ? "result error" : "result success";
    respuesta.textContent = texto;
    sol.style.display = "block";
}

/**
 * Delega cada operación en la instancia `calculadora` y valida entradas.
 */
function calculo() {
    const operacion = document.getElementById("operacion").value;

    if (operacion === "" || Number(operacion) < 1 || Number(operacion) > 7) {
        return mostrarResultado("El valor ingresado no es correcto (elige entre 1 y 7).", true);
    }

    if (operacion >= 1 && operacion <= 5) {
        const numero1 = pedirNumero("Primer número");
        if (numero1 === null) return mostrarResultado("¡Error! Primer número inválido o cancelado.", true);

        const numero2 = pedirNumero(operacion == 5 ? "Ingrese el exponente" : "Segundo número");
        if (numero2 === null) return mostrarResultado("¡Error! Segundo número inválido o cancelado.", true);

        if (operacion == 1) {
            mostrarResultado(`${numero1} + ${numero2} = ${calculadora.sumar(numero1, numero2)}`);
        } else if (operacion == 2) {
            mostrarResultado(`${numero1} - ${numero2} = ${calculadora.restar(numero1, numero2)}`);
        } else if (operacion == 3) {
            mostrarResultado(`${numero1} × ${numero2} = ${calculadora.multiplicar(numero1, numero2)}`);
        } else if (operacion == 4) {
            if (numero2 === 0) {
                mostrarResultado("¡Error! No se puede dividir entre 0.", true);
            } else {
                mostrarResultado(`${numero1} ÷ ${numero2} = ${calculadora.dividir(numero1, numero2)}`);
            }
        } else if (operacion == 5) {
            mostrarResultado(`${numero1} ^ ${numero2} = ${calculadora.potencia(numero1, numero2)}`);
        }
    } else if (operacion == 6) {
        const numero1 = pedirNumero("Número para calcular la raíz cuadrada");
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true);
        if (numero1 < 0) return mostrarResultado("¡Error! No existe raíz cuadrada real de un número negativo.", true);
        mostrarResultado(`La raíz cuadrada de ${numero1} es ${calculadora.raizCuadrada(numero1)}`);
    } else if (operacion == 7) {
        const numero1 = pedirNumero("Número para calcular la raíz cúbica");
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true);
        mostrarResultado(`La raíz cúbica de ${numero1} es ${calculadora.raizCubica(numero1)}`);
    }
}
