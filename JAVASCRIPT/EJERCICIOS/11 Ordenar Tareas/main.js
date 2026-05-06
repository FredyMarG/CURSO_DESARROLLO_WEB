let tareas = document.getElementById("container-work");

let tp = "1 hora y 40 minutos de hacer trabajos practicos";
let estudio = "2 horas de estudio";
let trabajo = "4 horas de trabajo";
let homework = "30 minutos de cosas de la casa";
let descanso = "10 minutos de descanso";

let diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

console.log("%cTAREAS", "color: orange; font-size:16px; font-weight:bold;");

for (let i = 0; i < 14; i++) {

    let nombreDia = diasSemana[i % 7];

    // 🗂 Semana
    if (i === 0 || i === 7) {

        let numeroSemana = (i === 0) ? 1 : 2;

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

    let semanas = document.querySelectorAll(".dias");
    let contenedorDias = semanas[semanas.length - 1];

    // 🎨 Color dinámico
    let color = "green";
    if (i % 3 === 0) color = "orange";
    if (i % 5 === 0) color = "red";

    // 🔥 Consola con nombre del día
    console.groupCollapsed(
        `%c${nombreDia} (Día ${i + 1})`,
        `color:${color}; font-weight:bold;`
    );

    console.log("%cTrabajo practico: " + tp, "color: lightblue;");
    console.log("%cEstudio: " + estudio, "color: yellow;");
    console.log("%cTrabajo: " + trabajo, "color: violet;");
    console.log("%cCosas de la casa: " + homework, "color: pink;");
    console.log("%cDescanso: " + descanso, "color: gray;");

    console.groupEnd();

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
    if (i === 6 || i === 13) {
        console.groupEnd();
    }
}