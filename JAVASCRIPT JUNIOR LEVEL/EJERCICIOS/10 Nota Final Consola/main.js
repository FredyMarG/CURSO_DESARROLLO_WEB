/**
 * SISTEMA DINÁMICO DE CALIFICACIONES
 * Calcula el estado de aprobación de materias basándose en asistencia, promedio y trabajos entregados.
 */

/** Contenedor principal donde se inyectarán las filas de materias */
const result = document.getElementById("resultado");

/** @type {Object.<string, {asistencias: number, promedio: number, trabajos: number}>} Estado global de calificaciones */
const materias = {
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
function renderConsola() {
    console.clear();

    Object.entries(materias).forEach(([nombre, data]) => {

        console.group(`📘 ${nombre}`);

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

        console.groupEnd();
    });

    // Resumen tabular en consola
    console.table(materias);
}

/**
 * Inicialización de la interfaz dinámica.
 * Crea elementos de entrada para cada materia definida en el objeto global.
 */
Object.entries(materias).forEach(([nombre, data]) => {

    // Se crea un elemento div para representar la fila de cada materia, y se le asigna la clase "fila" para aplicar estilos específicos a esta sección de la interfaz.
    const fila = document.createElement("div");
    fila.classList.add("fila");

    fila.innerHTML = `
        <span class="main-span">📘<span class="nombre">${nombre}</span></span>
        <input type="number" step="0.01" min="0" max="100" placeholder="Asistencia (0% - 100%)">
        <input type="number" step="0.01" min="0" max="10" placeholder="Promedio (0 - 10)">
        <input type="number" step="1" min="0" max="4" placeholder="Trabajos (0 - 4)">
        <span class="estado"></span>
    `;

    const inputs = fila.querySelectorAll("input");
    const estado = fila.querySelector(".estado");

    /**
     * Limita la cantidad de decimales de un valor
     * @param {string|number} valor 
     * @param {number} maxDecimales 
     * @returns {number}
     */
    function limitarDecimales(valor, maxDecimales = 2) {
        return Number(parseFloat(valor || 0).toFixed(maxDecimales));
    }

    /**
     * Convierte un valor a entero (suelo)
     * @param {string|number} valor 
     * @returns {number}
     */
    function soloEnteros(valor) {
        return Math.floor(Number(valor || 0));
    }

    /**
     * Lee los inputs, valida datos y actualiza el estado global y la UI
     */
    function actualizar() {
        let asistencias = limitarDecimales(inputs[0].value, 2);
        let promedio = limitarDecimales(inputs[1].value, 2);
        let trabajos = soloEnteros(inputs[2].value);

        // Reflejar cambios de validación en la UI
        inputs[0].value = asistencias;
        inputs[1].value = promedio;
        inputs[2].value = trabajos;

        // Actualizar base de datos local
        data.asistencias = asistencias;
        data.promedio = promedio;
        data.trabajos = trabajos;

        // Evaluación de reglas de negocio para aprobación
        if (asistencias >= 90 && promedio >= 7 && trabajos >= 3) {
            estado.textContent = "✅ Aprobado";
            estado.className = "estado aprobado";
            fila.className = "fila aprobado";
        } else {
            estado.textContent = "❌ Reprobado";
            estado.className = "estado reprobado";
            fila.className = "fila reprobado";
        }

        renderConsola();
    }

    inputs.forEach(inp => {
        inp.addEventListener("input", actualizar);
    });

    // Sincronización inicial
    actualizar();

    result.appendChild(fila);
});