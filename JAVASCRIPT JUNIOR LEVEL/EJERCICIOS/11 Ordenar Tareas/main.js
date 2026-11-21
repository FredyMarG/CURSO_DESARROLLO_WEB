/**
 * EJERCICIO: planificador de tareas en consola y en el DOM (dos semanas).
 */

let tareas = document.getElementById("container-work"); // Obtiene referencia DOM para "tareas"

let tp = "1 hora y 40 minutos de hacer trabajos practicos"; // Declara e inicializa "tp"
let estudio = "2 horas de estudio"; // Declara e inicializa "estudio"
let trabajo = "4 horas de trabajo"; // Declara e inicializa "trabajo"
let homework = "30 minutos de cosas de la casa"; // Declara e inicializa "homework"
let descanso = "10 minutos de descanso"; // Declara e inicializa "descanso"

let diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]; // Declara e inicializa "diasSemana"

console.log("%cTAREAS", "color: orange; font-size:16px; font-weight:bold;"); // Imprime salida en consola

for (let i = 0; i < 14; i++) { // Inicia bucle de iteración

    let nombreDia = diasSemana[i % 7]; // Declara e inicializa "nombreDia"

    // 🗂 Semana
    if (i === 0 || i === 7) { // Evalúa condición

        let numeroSemana = (i === 0) ? 1 : 2; // Declara e inicializa "numeroSemana"

        console.groupCollapsed(
            `%cSemana ${numeroSemana}`,
            "color: cyan; font-weight: bold;"
        );

        tareas.innerHTML += `
            <details class="week">
                <summary>Semana ${numeroSemana}</summary>
                <div class="dias"></div>
            </details>  
        `;
    }

    let semanas = document.querySelectorAll(".dias"); // Obtiene referencia DOM para "semanas"
    let contenedorDias = semanas[semanas.length - 1]; // Declara e inicializa "contenedorDias"

    // 🎨 Color dinámico
    let color = "green"; // Declara e inicializa "color"
    if (i % 3 === 0) color = "orange"; // Evalúa condición
    if (i % 5 === 0) color = "red"; // Evalúa condición

    // 🔥 Consola con nombre del día
    console.groupCollapsed(
        `%c${nombreDia} (Día ${i + 1})`,
        `color:${color}; font-weight:bold;`
    );

    console.log("%cTrabajo practico: " + tp, "color: lightblue;"); // Imprime salida en consola
    console.log("%cEstudio: " + estudio, "color: yellow;"); // Imprime salida en consola
    console.log("%cTrabajo: " + trabajo, "color: violet;"); // Imprime salida en consola
    console.log("%cCosas de la casa: " + homework, "color: pink;"); // Imprime salida en consola
    console.log("%cDescanso: " + descanso, "color: gray;"); // Imprime salida en consola

    console.groupEnd(); // Imprime salida en consola

    // 🌐 HTML
    contenedorDias.innerHTML += `
        <div class="dia ${color}">
            <h4>${nombreDia}</h4>
            <small>Día ${i + 1}</small>
            <p>${tp}</p>
            <p>${estudio}</p>
            <p>${trabajo}</p>
            <p>${homework}</p>
            <p>${descanso}</p>
        </div>
    `;

    // 🔚 cerrar semana consola
    if (i === 6 || i === 13) { // Evalúa condición
        console.groupEnd(); // Imprime salida en consola
    }
}