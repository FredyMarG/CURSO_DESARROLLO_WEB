let info = document.getElementById("tabla-contenido"),
    infoalumno = document.getElementById("info-alumno"),
    complete = document.getElementById("info-complete"),
    sol = document.getElementById("main-sol")

function solucion(){
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

const obtenerInformacion = (materia) => {//me trae la informacion de la materia, profesor y alumnos
    if (materias[materia] !== undefined) {
        return [materias[materia], materia]
    } else {
        return false
    }
}

const mat = Object.keys(materias) //me trae un array con las materias, para poder iterar sobre ellas y mostrar la informacion

const mostrarInformacion = () => { //me muestra la informacion de cada materia, profesor y alumnos
    
        for (let i = 0; i < mat.length; i++) {
            let informacion = obtenerInformacion(mat[i])//me trae la informacion de la materia, profesor y alumnos
            if (informacion !== false) {
                let profesor = informacion[0][0]//el primer elemento del array es el profesor, el resto son los alumnos
                let alumnos = informacion[0].slice(1)//el resto del array son los alumnos, por eso uso slice(1) para eliminar el primer elemento que es el profesor
                info.innerHTML += `<tr>
                                    <td><b>${mat[i]}</b></td>
                                    <td>${profesor}</td>
                                    <td>${alumnos.join(', ')}</td>
                                </tr>`
        }
    }
    
}
mostrarInformacion()

const clasesAlumno = (alumno) => {
    let clases = [];
    for (let i = 0; i < mat.length; i++) {
        let informacion = obtenerInformacion(mat[i]);//me trae la informacion de la materia, profesor y alumnos
        if (informacion !== false) {
            let profesor = informacion[0][0];
            let alumnos = informacion[0].slice(1);

            if (alumnos.includes(alumno)) {//si el alumno esta en la lista de alumnos de la materia, entonces lo agrego a la lista de clases del alumno
                clases.push({
                    alumno: alumno,
                    materia: informacion[1],
                    profesor: profesor
                });
            }
        }
    }

    return clases;
}

const obtenerTodosLosAlumnos = () => {
    let alumnos = [];
    Object.keys(materias).forEach(materia => {
        let lista = materias[materia].slice(1);//el primer elemento del array es el profesor, por eso uso slice(1) para eliminarlo y quedarme solo con los alumnos
        alumnos = alumnos.concat(lista);
    });

    // 🔥 eliminar repetidos
    return [...new Set(alumnos)];//el Set es una estructura de datos que no permite elementos repetidos, por eso uso el Set para eliminar los repetidos y luego lo convierto a un array con el operador spread (...)
}


const mostrarTodosLosAlumnos = () => {
    const alumnos = obtenerTodosLosAlumnos();//me trae un array con todos los alumnos, sin repetidos
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

const mostrarTabla = () => {
    let html = "";
    const alumnos = obtenerTodosLosAlumnos();//me trae un array con todos los alumnos, sin repetidos
    alumnos.forEach(alumno => {
        const clases = clasesAlumno(alumno);//me trae un array con las clases del alumno, cada clase es un objeto con el nombre del alumno, la materia y el profesor
        if (clases.length === 0) return;
        clases.forEach((c, i) => {//itero sobre las clases del alumno, para mostrar la informacion de cada clase en una fila de la tabla, si es la primera clase del alumno, entonces muestro el nombre del alumno en la primera columna, sino dejo esa columna vacia para que se vea mejor
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
}
