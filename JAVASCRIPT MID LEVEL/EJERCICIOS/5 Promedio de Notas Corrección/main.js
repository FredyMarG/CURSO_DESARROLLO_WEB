/**
 * @file main.js
 * @description Lógica de negocio para la gestión de promedios académicos.
 * Incluye validación de entradas, cálculos matemáticos, manejo de errores 
 * y manipulación dinámica del DOM para feedback visual.
 * @author Gemini Code Assist
 */

// --- Referencias a elementos del DOM ---
const sendButton = document.getElementById("guardar");
const modal = document.querySelector(".modal-bg");
const btnAceptar = document.getElementById("aceptar");
const solucionSection = document.getElementById("solucion");

// --- Variables de estado global (Simulación de datos de servidor) ---
// Generamos dos notas aleatorias entre 1 y 10 para simular historial previo
const nota1 = Math.floor(Math.random() * 10) + 1;
const nota2 = Math.floor(Math.random() * 10) + 1;

/**
 * Evento para confirmar la lectura del resultado.
 * Muestra la sección de "solución" final en el documento.
 */
btnAceptar.addEventListener("click", () => {
    solucionSection.style.display = "block";
});

/**
 * Evento principal de ejecución.
 * Se dispara al intentar guardar la tercera nota. 
 * Implementa un bloque try-catch para gestionar errores de validación.
 */
sendButton.addEventListener("click", () => {
    let resultado, mensaje;
    try {
        // 1. Sanitización: Convertimos la entrada a un número entero
        const prevRes = parseInt(document.getElementById("nota").value);
        
        // 2. Validación de datos: Comprobamos si la conversión falló (NaN)
        if (isNaN(prevRes)) {
            throw "La nota debe ser un numero";
        }

        // 3. Procesamiento: Cálculo del promedio aritmético simple
        const promedio = (nota1 + nota2 + prevRes) / 3;
        
        // 4. Lógica de Negocio: Obtenemos el mensaje cualitativo y el estado de aprobación
        mensaje = definirMensaje(promedio);
        resultado = verificarNota(nota1, nota2, prevRes);
        
        // 5. Interfaz: Actualizamos y mostramos el modal con los resultados
        abrirModal(resultado, mensaje, prevRes, promedio);

    } catch (error) {
        // Manejo de excepciones: Captura errores de validación y los muestra al usuario
        resultado = "Error";
        mensaje = error;
        abrirModal(resultado, mensaje, 0, 0);
    }
});

/**
 * Mapea un promedio numérico a una descripción textual (Mensaje cualitativo).
 * @param {number} pr - El promedio calculado del alumno.
 * @returns {string} Mensaje descriptivo correspondiente a la nota.
 * @note Se usa Math.round() para normalizar el valor y poder compararlo en el switch.
 */
const definirMensaje = (pr) => {
    let resultado;
    switch (Math.round(pr)) {
        case 1:  resultado = "Muy deficiente"; break;
        case 2:  resultado = "Eres muy malo en la materia"; break;
        case 3:  resultado = "No sabes casi nada"; break;
        case 4:  resultado = "Muy mal"; break;
        case 5:  resultado = "Mal"; break;
        case 6:  resultado = "Regular"; break;
        case 7:  resultado = "Bien"; break;
        case 8:  resultado = "Muy bien"; break;
        case 9:  resultado = "Sobresaliente"; break;
        case 10: resultado = "Excelente"; break;
        default: resultado = "Nota fuera de rango";
    }
    return resultado;
};

/**
 * Realiza el cálculo del promedio y verifica el estado de aprobación.
 * @param {number} nota1 - Primera nota aleatoria.
 * @param {number} nota2 - Segunda nota aleatoria.
 * @param {number} prevRes - Nota ingresada por el usuario.
 * @returns {string} "Aprobado" o "Desaprobado".
 */
const verificarNota = (nota1, nota2, prevRes) => {
    const promedio = (nota1 + nota2 + prevRes) / 3;
    
    // Registro en consola para facilitar el rastreo (Debugging)
    console.log(`Cálculo: (${nota1} + ${nota2} + ${prevRes}) / 3 = ${promedio.toFixed(2)}`);
    
    if (promedio >= 7) {
        return "Aprobado";
    } else {
        return "Desaprobado";
    }
};

/**
 * Orquestador de la visualización del Modal.
 * @param {string} res - Estado final (Aprobado, Desaprobado o Error).
 * @param {string} msg - Mensaje cualitativo.
 * @param {number} prevRes - La nota capturada del input.
 * @param {number} promedio - El promedio resultante.
 */
const abrirModal = (res, msg, prevRes, promedio) => {
    // Actualización de texto en la vista
    document.querySelector(".primera").textContent = `Nota 1: ${nota1}`;
    document.querySelector(".segunda").textContent = `Nota 2: ${nota2}`;
    document.querySelector(".tercera").textContent = `Nota 3: ${prevRes}`;
    document.querySelector(".promedio").textContent = `Promedio: ${Math.round(promedio)}`;
    
    const resElement = document.querySelector(".resultado");
    const msgElement = document.querySelector(".mensaje");

    resElement.textContent = res;
    msgElement.textContent = msg;

    // Gestión de estilos visuales según el resultado
    if (res === "Aprobado") {
        document.querySelector(".resultado").classList.add("success-res");
        document.querySelector(".mensaje").classList.add("success-res");
        document.querySelector(".resultado").classList.remove("error-res");
        document.querySelector(".mensaje").classList.remove("error-res");
    }

    if (res === "Desaprobado" || res === "Error") {
        document.querySelector(".resultado").classList.add("error-res");
        document.querySelector(".mensaje").classList.add("error-res");
        document.querySelector(".resultado").classList.remove("success-res");
        document.querySelector(".mensaje").classList.remove("success-res");
    }

    // Activa la visualización del modal
    modal.style.display = "flex";
};

/**
 * Listener de cierre de modal.
 * Implementa delegación de eventos para cerrar si se hace clic fuera del contenido 
 * o en el botón específico de cierre.
 */
modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal__close-button")) {
        modal.style.display = "none";
    }
});