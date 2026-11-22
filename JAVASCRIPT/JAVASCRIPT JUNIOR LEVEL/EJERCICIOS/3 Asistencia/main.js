/**
 * EJERCICIO: registro de asistencia por 30 días y tabla de resultados.
 */

let sol = document.getElementById("sol"),
    main_sol = document.getElementById("main_sol")

/**
 * Pide cantidad de alumnos, simula 30 días de asistencia y pinta aprobados/reprobados.
 */
function result() { // Declara función
    let cantidad = parseInt(prompt("¿Cuantos alumnos son?")),
        alumnosTotales = [],
        alumnos = document.getElementById("cantidad"),
        data = document.getElementById("data"); // Asigna valor
    if (isNaN(cantidad) || cantidad == undefined) { // Evalúa condición
        cantidad = 0; // Asigna valor
    }
    alumnos.innerHTML = `El total de alumnos es ${cantidad}`; // Actualiza contenido en el DOM

    for (let i = 0; i < cantidad; i++) { // Inicia bucle de iteración
        alumnosTotales[i] = [prompt("Nombre del alumno " + (i + 1)), 0]; // Asigna valor
    }

    /** Registra una 'P' de presente y suma al contador del alumno en la posición `p` */
    const asistencia = (nombre, p) => { // Define función flecha "asistencia"
        let presencia = prompt(`Asistencia del alumno ${nombre}`); //Almacena si es presente o ausente dependiendo el nombre del alumno
        if (presencia == "p" || presencia == "P") { // Evalúa condición
            alumnosTotales[p][1]++; //estoy tomando la posicion del primer array [p] y estoy tomando la posicion 1[1] dentro del segundo array
        }
    };

    for (let i = 0; i < 30; i++) { // Inicia bucle de iteración
        for (alumno in alumnosTotales) { // Inicia bucle de iteración
            asistencia(alumnosTotales[alumno][0], alumno); // Ejecuta llamada o método
        }
    }

    for (alumno in alumnosTotales) { // Inicia bucle de iteración
        if (30 - alumnosTotales[alumno][1] >= 18) { // Evalúa condición
            data.innerHTML += `<tr style="color: red;">
            <td>${+alumno + 1}</td>
            <td>${alumnosTotales[alumno][0]/**nombre */}</td>
            <td>${alumnosTotales[alumno][1]/**cantidad de asistencias */}</td>
            <td>${30 - alumnosTotales[alumno][1] + " REPROBADO"/**cantidad de fallas */}</td>
        </tr>`;
        } else { // Instrucción JavaScript
            data.innerHTML += `<tr>
            <td>${+alumno + 1}</td>
            <td>${alumnosTotales[alumno][0]}</td>
            <td>${alumnosTotales[alumno][1]}</td>
            <td>${30 - alumnosTotales[alumno][1]}</td>
        </tr>`;
        }        
    }
}

sol.addEventListener("click", ()=>{ // Registra escuchador de eventos
    main_sol.style.display = "block"
})