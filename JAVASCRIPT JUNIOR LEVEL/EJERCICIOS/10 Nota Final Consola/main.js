/**
 * SISTEMA DINÁMICO DE CALIFICACIONES
 * Calcula el estado de aprobación de materias basándose en asistencia, promedio y trabajos entregados.
 */

/** Contenedor principal donde se inyectarán las filas de materias */
const result = document.getElementById("resultado"); // Obtiene referencia DOM para "result"

/** @type {Object.<string, {asistencias: number, promedio: number, trabajos: number}>} Estado global de calificaciones */
const materias = { // Declara e inicializa "materias"
    fisica: {asistencias: 0, promedio: 0, trabajos: 0},
    matematica: {asistencias: 0, promedio: 0, trabajos: 0},
    logica: {asistencias: 0, promedio: 0, trabajos: 0},
    quimica: {asistencias: 0, promedio: 0, trabajos: 0},
    calculo: {asistencias: 0, promedio: 0, trabajos: 0},
    programacion: {asistencias: 0, promedio: 0, trabajos: 0},
    biologia: {asistencias: 0, promedio: 0, trabajos: 0},
    bd: {asistencias: 0, promedio: 0, trabajos: 0},
    algebra: {asistencias: 0, promedio: 0, trabajos: 0}
};

/**
 * Renderiza el estado actual de las materias en la consola del desarrollador.
 * Utiliza grupos y estilos CSS para facilitar la lectura.
 */
function renderConsola() { // Declara función
    console.clear(); // Imprime salida en consola

    Object.entries(materias).forEach(([nombre, data]) => { // Instrucción JavaScript

        console.group(`📘 ${nombre}`); // Imprime salida en consola

        // Evaluación de Asistencia
        console.log(
            data.asistencias >= 90 ? "%c✅ Asistencia OK" : "%c❌ Asistencia baja",
            `color:${data.asistencias >= 90 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        // Evaluación de Promedio
        console.log(
            data.promedio >= 7 ? "%c✅ Promedio OK" : "%c❌ Promedio bajo",
            `color:${data.promedio >= 7 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        // Evaluación de Trabajos
        console.log(
            data.trabajos >= 3 ? "%c✅ Trabajos OK" : "%c❌ Trabajos incompletos",
            `color:${data.trabajos >= 3 ? "green" : "red"}; margin-left: 20px; font-weight: bold;`
        );

        console.groupEnd(); // Imprime salida en consola
    });

    // Resumen tabular en consola
    console.table(materias); // Imprime salida en consola
}

/**
 * Inicialización de la interfaz dinámica.
 * Crea elementos de entrada para cada materia definida en el objeto global.
 */
Object.entries(materias).forEach(([nombre, data]) => { // Instrucción JavaScript

    // Se crea un elemento div para representar la fila de cada materia, y se le asigna la clase "fila" para aplicar estilos específicos a esta sección de la interfaz.
    const fila = document.createElement("div"); // Crea nuevo elemento DOM "fila"
    fila.classList.add("fila"); // Modifica clases CSS del elemento

    fila.innerHTML = `
        <span class="main-span">📘<span class="nombre">${nombre}</span></span>
        <input type="number" step="0.01" min="0" max="100" placeholder="Asistencia (0% - 100%)">
        <input type="number" step="0.01" min="0" max="10" placeholder="Promedio (0 - 10)">
        <input type="number" step="1" min="0" max="4" placeholder="Trabajos (0 - 4)">
        <span class="estado"></span>
    `;

    const inputs = fila.querySelectorAll("input"); // Obtiene referencia DOM para "inputs"
    const estado = fila.querySelector(".estado"); // Obtiene referencia DOM para "estado"

    /**
     * Limita la cantidad de decimales de un valor
     * @param {string|number} valor 
     * @param {number} maxDecimales 
     * @returns {number}
     */
    function limitarDecimales(valor, maxDecimales = 2) { // Declara función
        return Number(parseFloat(valor || 0).toFixed(maxDecimales)); // Retorna resultado
    }

    /**
     * Convierte un valor a entero (suelo)
     * @param {string|number} valor 
     * @returns {number}
     */
    function soloEnteros(valor) { // Declara función
        return Math.floor(Number(valor || 0)); // Retorna resultado
    }

    /**
     * Lee los inputs, valida datos y actualiza el estado global y la UI
     */
    function actualizar() { // Declara función
        let asistencias = limitarDecimales(inputs[0].value, 2); // Declara e inicializa "asistencias"
        let promedio = limitarDecimales(inputs[1].value, 2); // Declara e inicializa "promedio"
        let trabajos = soloEnteros(inputs[2].value); // Declara e inicializa "trabajos"

        // Reflejar cambios de validación en la UI
        inputs[0].value = asistencias; // Asigna valor
        inputs[1].value = promedio; // Asigna valor
        inputs[2].value = trabajos; // Asigna valor

        // Actualizar base de datos local
        data.asistencias = asistencias; // Asigna valor
        data.promedio = promedio; // Asigna valor
        data.trabajos = trabajos; // Asigna valor

        // Evaluación de reglas de negocio para aprobación
        if (asistencias >= 90 && promedio >= 7 && trabajos >= 3) { // Evalúa condición
            estado.textContent = "✅ Aprobado"; // Actualiza contenido en el DOM
            estado.className = "estado aprobado"; // Asigna valor
            fila.className = "fila aprobado"; // Asigna valor
        } else { // Instrucción JavaScript
            estado.textContent = "❌ Reprobado"; // Actualiza contenido en el DOM
            estado.className = "estado reprobado"; // Asigna valor
            fila.className = "fila reprobado"; // Asigna valor
        }

        renderConsola(); // Ejecuta llamada o método
    }

    inputs.forEach(inp => { // Instrucción JavaScript
        inp.addEventListener("input", actualizar); // Registra escuchador de eventos
    });

    // Sincronización inicial
    actualizar(); // Ejecuta llamada o método

    result.appendChild(fila); // Inserta nodo en el DOM
});