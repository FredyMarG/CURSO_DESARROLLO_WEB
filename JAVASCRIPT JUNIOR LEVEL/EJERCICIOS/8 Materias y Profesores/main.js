/** Referencias a los elementos del DOM donde se inyectará la información generada */
let info = document.getElementById("tabla-contenido"),
    infoalumno = document.getElementById("info-alumno"),
    complete = document.getElementById("info-complete"),
    sol = document.getElementById("main-sol")

/**
 * Función envolvente que inicializa la lógica del ejercicio.
 * PATRÓN IIFE (Immediately Invoked Function Expression):
 * Encapsula el código para evitar conflictos de nombres en el scope global.
 * 
 * DISEÑO:
 * Sigue el principio de separación de responsabilidades:
 * 1. Datos (objeto materias). 2. Lógica de búsqueda. 3. Renderizado (DOM).
 */
(function solucion(){
    /** @type {Object.<string, string[]>} Base de datos simulada. Estructura: materia: [Profesor, ...Alumnos] */
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
 * Helper: Busca una materia por nombre.
 * @param {string} materia - Identificador (clave) de la materia.
 * @returns {[string[], string]|boolean} Array de datos o false si falla.
 */
const obtenerInformacion = (materia) => {
    // Acceso seguro mediante corchetes para claves dinámicas
    return materias[materia] !== undefined ? [materias[materia], materia] : false;
}

/** @type {string[]} Lista de nombres de las materias extraídas del objeto de datos */
const mat = Object.keys(materias);

/**
 * Muestra la información detallada de cada materia (profesor y alumnos) en una tabla HTML.
 * OPTIMIZACIÓN DE RENDIMIENTO:
 * Acumular strings en un 'buffer' antes de tocar el DOM es una técnica clave 
 * para evitar que el navegador recalcule el diseño (Reflow) innecesariamente.
 */
const mostrarInformacion = () => {
        let htmlBuffer = "";
        for (let i = 0; i < mat.length; i++) {
            let informacion = obtenerInformacion(mat[i]);
            if (informacion !== false) {
                // Destructuring: Forma moderna y legible de extraer datos de un array.
                const [profesor, ...alumnos] = informacion[0];
                htmlBuffer += `<tr>
                                    <td><b>${mat[i]}</b></td>
                                    <td>${profesor}</td>
                                    <td>${alumnos.join(', ')}</td>
                                </tr>`;
        }
    }
    // Una sola inserción al DOM es mucho más eficiente que múltiples +=
    info.innerHTML = htmlBuffer;
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
 * @returns {Array<string>} 
 * LÓGICA:
 * 1. Object.values(materias): Extrae todos los arreglos de participantes.
 * 2. flatMap(...): Transforma la matriz de matrices en una lista plana, 
 *    saltando el primer elemento de cada arreglo (el profesor) con slice(1).
 * 3. new Set(...): Estructura de datos que garantiza unicidad de valores.
 * 4. Spread operator [...]: Convierte el Set de vuelta a un Array.
 */
const obtenerTodosLosAlumnos = () => {
    const listaAplanada = Object.values(materias).flatMap(data => data.slice(1));
    // Set es ideal aquí: O(n) de complejidad y garantiza que no haya nombres repetidos
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
        let clases = clasesAlumno(alumno);
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
 * 
 * ESTRATEGIA DE RENDERIZADO (Rowspan):
 * Para agrupar visualmente, detectamos si es la primera materia del alumno (i === 0).
 * Si lo es, insertamos la celda del nombre con el atributo 'rowspan' igual al total de sus clases.
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

/* Visualización final del contenedor de resultados */
sol.style.display = "block"
})(); // Cierre de la IIFE
