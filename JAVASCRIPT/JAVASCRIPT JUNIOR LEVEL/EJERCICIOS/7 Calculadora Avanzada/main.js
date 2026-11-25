/**
 * EJERCICIO: calculadora orientada a objetos (clase Calculadora).
 */

const respuesta = document.getElementById("respuesta"); // Declara e inicializa variable local
const sol = document.getElementById("main-sol"); // Declara e inicializa variable local

/** Agrupa operaciones aritméticas básicas, potencia y raíces */
class Calculadora { // Define clase
    sumar(num1, num2) {
        return Number(num1) + Number(num2); // Retorna el resultado de la función
    }
    restar(num1, num2) {
        return Number(num1) - Number(num2); // Retorna el resultado de la función
    }
    multiplicar(num1, num2) {
        return Number(num1) * Number(num2); // Retorna el resultado de la función
    }
    dividir(num1, num2) {
        return Number(num1) / Number(num2); // Retorna el resultado de la función
    }
    potencia(num, exp) {
        return Math.pow(Number(num), Number(exp)); // Retorna el resultado de la función
    }
    raizCuadrada(num) {
        return Math.sqrt(Number(num)); // Retorna el resultado de la función
    }
    raizCubica(num) {
        return Math.cbrt(Number(num)); // Retorna el resultado de la función
    }
}

const calculadora = new Calculadora(); // Declara e inicializa variable local

/** Pide un número válido por prompt y retorna null si se cancela o es inválido */
function pedirNumero(mensaje) { // Define función reutilizable
    const entrada = prompt(mensaje); // Declara e inicializa variable local
    if (entrada === null || entrada.trim() === "" || Number.isNaN(Number(entrada))) { // Evalúa condición lógica
        return null; // Retorna el resultado de la función
    }
    return Number(entrada); // Retorna el resultado de la función
}

/** Muestra el resultado en verde neón (acierto) o rojo neón (error) */
function mostrarResultado(texto, esError = false) { // Define función reutilizable
    respuesta.className = esError ? "result error" : "result success";
    respuesta.textContent = texto; // Actualiza contenido en el DOM
    sol.style.display = "block";
}

/**
 * Delega cada operación en la instancia `calculadora` y valida entradas.
 */
function calculo() { // Define función reutilizable
    const operacion = document.getElementById("operacion").value; // Declara e inicializa variable local

    if (operacion === "" || Number(operacion) < 1 || Number(operacion) > 7) { // Evalúa condición lógica
        return mostrarResultado("El valor ingresado no es correcto (elige entre 1 y 7).", true); // Retorna el resultado de la función
    }

    if (operacion >= 1 && operacion <= 5) { // Evalúa condición lógica
        const numero1 = pedirNumero("Primer número"); // Declara e inicializa variable local
        if (numero1 === null) return mostrarResultado("¡Error! Primer número inválido o cancelado.", true); // Evalúa condición lógica

        const numero2 = pedirNumero(operacion == 5 ? "Ingrese el exponente" : "Segundo número"); // Declara e inicializa variable local
        if (numero2 === null) return mostrarResultado("¡Error! Segundo número inválido o cancelado.", true); // Evalúa condición lógica

        if (operacion == 1) { // Evalúa condición lógica
            mostrarResultado(`${numero1} + ${numero2} = ${calculadora.sumar(numero1, numero2)}`);
        } else if (operacion == 2) {
            mostrarResultado(`${numero1} - ${numero2} = ${calculadora.restar(numero1, numero2)}`);
        } else if (operacion == 3) {
            mostrarResultado(`${numero1} × ${numero2} = ${calculadora.multiplicar(numero1, numero2)}`);
        } else if (operacion == 4) {
            if (numero2 === 0) { // Evalúa condición lógica
                mostrarResultado("¡Error! No se puede dividir entre 0.", true);
            } else {
                mostrarResultado(`${numero1} ÷ ${numero2} = ${calculadora.dividir(numero1, numero2)}`);
            }
        } else if (operacion == 5) {
            mostrarResultado(`${numero1} ^ ${numero2} = ${calculadora.potencia(numero1, numero2)}`);
        }
    } else if (operacion == 6) {
        const numero1 = pedirNumero("Número para calcular la raíz cuadrada"); // Declara e inicializa variable local
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true); // Evalúa condición lógica
        if (numero1 < 0) return mostrarResultado("¡Error! No existe raíz cuadrada real de un número negativo.", true); // Evalúa condición lógica
        mostrarResultado(`La raíz cuadrada de ${numero1} es ${calculadora.raizCuadrada(numero1)}`);
    } else if (operacion == 7) {
        const numero1 = pedirNumero("Número para calcular la raíz cúbica"); // Declara e inicializa variable local
        if (numero1 === null) return mostrarResultado("¡Error! Número inválido o cancelado.", true); // Evalúa condición lógica
        mostrarResultado(`La raíz cúbica de ${numero1} es ${calculadora.raizCubica(numero1)}`);
    }
}

