let cantidad = parseInt(prompt("¿Cuantos alumnos son?")),
    alumnosTotales = [],
    alumnos = document.getElementById("cantidad"),
    data = document.getElementById("data")
    if(isNaN(cantidad) || cantidad == undefined){
        cantidad = 0
    }
    alumnos.innerHTML = `El total de alumnos es ${cantidad}`

for (let i = 0; i < cantidad; i++) {
    alumnosTotales[i] = [prompt("Nombre del alumno "+ (i+1)), 0]
}

const asistencia = (nombre,p)=>{
    let presencia = prompt(`Asistencia del alumno ${nombre}`) //Almacena si es presente o ausente dependiendo el nombre del alumno
    if (presencia == "p" || presencia == "P") {
        alumnosTotales[p][1]++ //estoy tomando la posicion del primer array [p] y estoy tomando la posicion 1[1] dentro del segundo array
    }
}

for (let i = 0; i < 30; i++) {
    for (alumno in alumnosTotales) {
        asistencia(alumnosTotales[alumno][0], alumno)
    }
}

for (alumno in alumnosTotales) {
    if (30 - alumnosTotales[alumno][1] > 18) {
        data.innerHTML += `<tr style="color: red;">
            <td>${alumno + 1}</td>
            <td>${alumnosTotales[alumno][0]}</td>
            <td>${alumnosTotales[alumno][1]}</td>
            <td>${30 - alumnosTotales[alumno][1]}</td>
        </tr>`;
    } else {
        data.innerHTML += `<tr>
            <td>${alumno + 1}</td>
            <td>${alumnosTotales[alumno][0]}</td>
            <td>${alumnosTotales[alumno][1]}</td>
            <td>${30 - alumnosTotales[alumno][1]}</td>
        </tr>`;
    }
}