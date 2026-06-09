/**
 * @file main.js
 * @description Sistema de gestión de recuperación académica. 
 * Maneja la carga dinámica de alumnos, validación de formularios y actualización de interfaz.
 */

// --- Referencias al DOM ---
const show = document.querySelector(".aceptar");
const sol = document.querySelector(".solucion");
const boton = document.querySelector(".guardar");
const gridContainer = document.querySelector(".grid-container");

/** 
 * @type {Array<Object>} Listado de alumnos inscritos en el sistema de recuperación 
 */
const alumnos = [{
    nombre: "Juan Perez",
    email: "juan@example.com",
    materia: "Matemáticas"
},{
    nombre: "Ana Gomez",
    email: "ana@example.com",
    materia: "Calculo 2"
},{
    nombre: "Facundo Lopez",
    email: "facundo@example.com",
    materia: "Fisica 1"
}
];

/** @type {number} ID del temporizador para el feedback visual */
let timerOcultarMensaje;

/**
 * Inyecta la lista de alumnos en el contenedor GRID y visualiza el formulario.
 */
show.addEventListener("click", () => {
    // Control de clases para efectos de transición CSS
    sol.classList.remove("ocultar", "solucion");
    sol.classList.add("mostrar");
    gridContainer.innerHTML = ""; // Limpieza de seguridad antes de renderizar

    // Iteración sobre la colección para construir el template HTML
    for (let datos of alumnos) {
        let { nombre, email, materia } = datos; // Desestructuración para limpieza
        let html = `
        <div class="nombre">${nombre}</div>
        <div class="email">${email}</div>
        <div class="materia">${materia}</div>
        <div class="semana">
            <select name="semana" id="semana" class="semana-elegida">
                <option value="0" selected disabled>Selecciona la semana</option>
                <option value="Semana 1">Semana 1</option>
                <option value="Semana 2">Semana 2</option>
            </select>
        </div>`
        gridContainer.innerHTML += html;
    }
});

/**
 * Procesa la validación de las semanas seleccionadas y confirma el guardado.
 */
boton.addEventListener("click", () => {
    clearTimeout(timerOcultarMensaje); // Reiniciar timer si el usuario hace clicks rápidos
    
    const elementos = document.querySelectorAll(".semana");  
    const semanaElegida = document.querySelectorAll(".semana-elegida");
    const resultadoDiv = document.getElementById("resultado");

    // --- Fase de Validación ---
    // Verificamos si algún select tiene el valor por defecto "0"
    let faltaSeleccion = false;
    for (let select of semanaElegida) {
        if (select.value === "0") {
            faltaSeleccion = true;
            break;
        }
    }

    if (faltaSeleccion) {
            // Mostrar feedback de error
            resultadoDiv.style.display = "block";
            resultadoDiv.innerHTML = "<p>Por favor, selecciona una semana para cada alumno.</p>";
            resultadoDiv.classList.add("resultado-msg", "error");
            resultadoDiv.classList.remove("success", "ocultar");

            // El mensaje desaparece tras 1.5s para no ensuciar la UI
            timerOcultarMensaje = setTimeout(() => {
                resultadoDiv.classList.add("ocultar");
                resultadoDiv.classList.remove("resultado-msg", "error", "success");
                // Retraso para que la animación de ocultar termine antes de poner display:none
                resultadoDiv.style.display = "none";
            }, 1500);            
    } else {
        // Reemplazar los selects por el valor de texto seleccionado
        for (let i = 0; i < elementos.length; i++) {
            let contenedorSemana = elementos[i];
            contenedorSemana.innerHTML = semanaElegida[i].value;
        }

        // --- Persistencia ---
        // Se solicita confirmación antes de finalizar la edición
        const confirmar = confirm("¿Deseas guardar los cambios?");
        if (confirmar) {
            boton.style.display = "none"; // Deshabilitar edición adicional
        }
    }
});
