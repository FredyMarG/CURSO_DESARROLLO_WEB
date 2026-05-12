// Referencias a los contenedores HTML donde se inyectará la información
let info = document.getElementById("tabla-contenido"),
    infoalumno = document.getElementById("info-alumno"),
    complete = document.getElementById("info-complete"),
    sol = document.getElementById("main-sol")

/**
 * Contiene toda la lógica principal para la gestión y visualización de materias y alumnos.
 */

/**
 * Función envolvente que inicializa la lógica del ejercicio.
 * Encapsula el estado de las materias para evitar contaminar el scope global
 * mientras se ejecuta la visualización de datos.
 *
 * NOTA: Esta función se ejecuta inmediatamente (IIFE) para aislar su scope.
 */
(function solucion(){
    const materias = {
        matematicas: ['Carlos', 'Juan', 'Pedro', 'Maria', 'Luisa', 'Andres', 'Sofia', 'Diego', 'Camila'],
        fisica: ['Laura', 'Pedro', 'Andres', 'Juan', 'Valentina', 'Sofia', 'Mateo', 'Camila', 'Daniel'],
        quimica: ['Andres', 'Maria', 'Juan', 'Santiago', 'Camila', 'Valentina', 'Diego', 'Luisa', 'Mateo'],
        programacion: ['Diego', 'Carlos', 'Juan', 'Sofia', 'Mateo', 'Andres', 'Camila', 'Pedro', 'Valentina'],
        bases_datos: ['Sofia', 'Maria', 'Pedro', 'Juan', 'Luisa', 'Daniel', 'Andres', 'Mateo', 'Camila'],
        logica: ['Mateo', 'Juan', 'Pedro', 'Sofia', 'Camila', 'Andres', 'Valentina', 'Maria', 'Daniel'],
        estadistica: ['Valentina', 'Santiago', 'Juan', 'Pedro', 'Camila', 'Sofia', 'Mateo', 'Luisa', 'Andres'],
        algebra: ['Daniel', 'Juan', 'Maria', 'Pedro', 'Sofia', 'Camila', 'Andres', 'Mateo', 'Luisa'],
        calculo: ['Santiago', 'Pedro', 'Juan', 'Valentina', 'Camila', 'Sofia', 'Mateo', 'Andres', 'Maria'],
        inteligencia_artificial: ['Camila', 'Juan', 'Pedro', 'Sofia', 'Mateo', 'Andres', 'Valentina', 'Maria', 'Diego'],
        redes: ['Juan', 'Pedro', 'Andres', 'Sofia', 'Camila', 'Mateo', 'Valentina', 'Daniel', 'Luisa'],
        sistemas_operativos: ['Pedro', 'Juan', 'Maria', 'Sofia', 'Camila', 'Mateo', 'Andres', 'Valentina', 'Diego']
    }

/**
 * Obtiene la información de una materia específica, incluyendo el profesor y los alumnos.
 * @param {string} materia - El nombre de la materia a buscar.
 * @returns {Array|boolean} Un array con la lista de participantes y el nombre de la materia si se encuentra, de lo contrario, `false`.
 * NOTA: Retornar `false` puede ser menos idiomático que `null` o `undefined` en JavaScript para indicar "no encontrado".
 */
const obtenerInformacion = (materia) => {
    if (materias[materia] !== undefined) {
        return [materias[materia], materia]
    } else {
        return false
    }
}

// Array con los nombres de todas las materias disponibles.
// Se utiliza para iterar sobre las materias y mostrar su información.
const mat = Object.keys(materias);

// La variable 'info' ya está declarada globalmente, pero se usa aquí.
// Considerar pasarla como argumento a 'solucion' o declararla dentro si no se usa fuera.

/**
 * Muestra la información detallada de cada materia (profesor y alumnos) en una tabla HTML.
 */
const mostrarInformacion = () => {
    
        for (let i = 0; i < mat.length; i++) {
            let informacion = obtenerInformacion(mat[i]); // Obtiene la información de la materia, profesor y alumnos
            if (informacion !== false) {
                let profesor = informacion[0][0]; // El primer elemento del array es el profesor.
                let alumnos = informacion[0].slice(1); // El resto del array son los alumnos.
                info.innerHTML += `<tr>
                                    <td><b>${mat[i]}</b></td>
                                    <td>${profesor}</td>
                                    <td>${alumnos.join(', ')}</td>
                                </tr>`
        }
    }
    
}
mostrarInformacion()

/**
 * Obtiene las clases a las que asiste un alumno específico, incluyendo la materia y el profesor.
 * @param {string} alumno - El nombre del alumno a buscar.
 * @description Filtra la base de datos de materias para encontrar coincidencias. 
 *              Utiliza slice(1) para separar la lista de alumnos del nombre del profesor.
 * @returns {Array<Object>} Un array de objetos, donde cada objeto representa una clase con el alumno, materia y profesor.
 */
const clasesAlumno = (alumno) => {
    let clases = [];
    for (let i = 0; i < mat.length; i++) {
        let informacion = obtenerInformacion(mat[i]);
        if (informacion !== false) {
            let profesor = informacion[0][0];
            let alumnos = informacion[0].slice(1);

            // Si el alumno está en la lista de alumnos de la materia, se agrega a la lista de clases del alumno.
            if (alumnos.includes(alumno)) {
                clases.push({
                    // Se incluye el nombre del alumno, la materia y el profesor de esa clase.
                    alumno: alumno,
                    materia: informacion[1],
                    profesor: profesor
                });
            }
        }
    }

    return clases;
}

/**
 * Obtiene una lista de todos los alumnos únicos que están registrados en alguna materia.
 * @returns {Array<string>} Un array con los nombres de todos los alumnos sin repeticiones.
 */
const obtenerTodosLosAlumnos = () => {
    // Usamos Object.values para obtener los arreglos de datos directamente.
    // flatMap recorre cada materia, extrae los alumnos (slice(1)) y los aplana en un solo nivel.
    const listaAplanada = Object.values(materias).flatMap(data => data.slice(1));
    
    // Set elimina duplicados de forma eficiente.
    return [...new Set(listaAplanada)];
}

/**
 * Muestra una tabla con todos los alumnos únicos y la cantidad de clases a las que asisten.
 */
const mostrarTodosLosAlumnos = () => {
    // Obtiene un array con todos los alumnos únicos.
    const alumnos = obtenerTodosLosAlumnos();
    let html = "";
    alumnos.forEach(alumno => {
        let clases = clasesAlumno(alumno);//me trae un array con las clases del alumno, cada clase es un objeto con el nombre del alumno, la materia y el profesor
        html += `
            <tr>
                <td><b>${alumno}</b></td>
                <td>${clases.length}</td>
            </tr>
        `;
    });
    infoalumno.innerHTML = html;
}
mostrarTodosLosAlumnos()

/**
 * Muestra una tabla completa con cada alumno, las materias a las que asiste y el profesor de cada materia.
 * Agrupa las materias por alumno, mostrando el nombre del alumno una sola vez si asiste a múltiples clases.
 */
/**
 * Genera una tabla comparativa utilizando el atributo 'rowspan'.
 * Optimiza la visualización al agrupar visualmente todas las materias que cursa un mismo estudiante.
 */
const mostrarTabla = () => {
    let html = "";
    const alumnos = obtenerTodosLosAlumnos();
    alumnos.forEach(alumno => {
        const clases = clasesAlumno(alumno);
        if (clases.length === 0) return;
        clases.forEach((c, i) => {
            html += `
                <tr>
                    ${
                        i === 0 ? `<td rowspan="${clases.length}"><b>${alumno}</b></td>`: ""
                    }
                    <td>${c.materia}</td>
                    <td>${c.profesor}</td>
                </tr>
            `;
        });
    });

    complete.innerHTML = html;
};

mostrarTabla()

sol.style.display = "block"
})(); // Cierre de la IIFE
