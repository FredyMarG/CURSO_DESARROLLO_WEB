/**
 * @file main.js
 * @description Sistema de gestión de recuperación académica. 
 * Maneja la carga dinámica de alumnos, validación de formularios y actualización de interfaz.
 */

// --- Referencias al DOM ---
const show = document.querySelector(".aceptar"); // Obtiene referencia DOM para "show"
const sol = document.querySelector(".solucion"); // Obtiene referencia DOM para "sol"
const boton = document.querySelector(".guardar"); // Obtiene referencia DOM para "boton"
const gridContainer = document.querySelector(".grid-container"); // Obtiene referencia DOM para "gridContainer"

/** 
 * @type {Array<Object>} Listado de alumnos inscritos en el sistema de recuperación 
 */
const alumnos = [{ // Declara e inicializa "alumnos"
    nombre: "Juan Perez",
    email: "juan@example.com",
    materia: "Matemáticas"
},{ // Instrucción JavaScript
    nombre: "Ana Gomez",
    email: "ana@example.com",
    materia: "Calculo 2"
},{ // Instrucción JavaScript
    nombre: "Facundo Lopez",
    email: "facundo@example.com",
    materia: "Fisica 1"
}
];

/** @type {number} ID del temporizador para el feedback visual */
let timerOcultarMensaje; // Declara e inicializa "timerOcultarMensaje"

/**
 * Inyecta la lista de alumnos en el contenedor GRID y visualiza el formulario.
 */
show.addEventListener("click", () => { // Registra escuchador de eventos
    // Control de clases para efectos de transición CSS
    sol.classList.remove("ocultar", "solucion"); // Modifica clases CSS del elemento
    sol.classList.add("mostrar"); // Modifica clases CSS del elemento
    gridContainer.innerHTML = ""; // Limpieza de seguridad antes de renderizar

    // Iteración sobre la colección para construir el template HTML
    for (let datos of alumnos) { // Inicia bucle de iteración
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
        gridContainer.innerHTML += html; // Actualiza contenido en el DOM
    }
});

/**
 * Procesa la validación de las semanas seleccionadas y confirma el guardado.
 */
boton.addEventListener("click", () => { // Registra escuchador de eventos
    clearTimeout(timerOcultarMensaje); // Reiniciar timer si el usuario hace clicks rápidos
    
    const elementos = document.querySelectorAll(".semana");   // Obtiene referencia DOM para "elementos"
    const semanaElegida = document.querySelectorAll(".semana-elegida"); // Obtiene referencia DOM para "semanaElegida"
    const resultadoDiv = document.getElementById("resultado"); // Obtiene referencia DOM para "resultadoDiv"

    // --- Fase de Validación ---
    // Verificamos si algún select tiene el valor por defecto "0"
    let faltaSeleccion = false; // Declara e inicializa "faltaSeleccion"
    for (let select of semanaElegida) { // Inicia bucle de iteración
        if (select.value === "0") { // Evalúa condición
            faltaSeleccion = true; // Asigna valor
            break; // Instrucción JavaScript
        }
    }

    if (faltaSeleccion) { // Evalúa condición
            // Mostrar feedback de error
            resultadoDiv.style.display = "block"; // Asigna valor
            resultadoDiv.innerHTML = "<p>Por favor, selecciona una semana para cada alumno.</p>"; // Actualiza contenido en el DOM
            resultadoDiv.classList.add("resultado-msg", "error"); // Modifica clases CSS del elemento
            resultadoDiv.classList.remove("success", "ocultar"); // Modifica clases CSS del elemento

            // El mensaje desaparece tras 1.5s para no ensuciar la UI
            timerOcultarMensaje = setTimeout(() => { // Asigna valor
                resultadoDiv.classList.add("ocultar"); // Modifica clases CSS del elemento
                resultadoDiv.classList.remove("resultado-msg", "error", "success"); // Modifica clases CSS del elemento
                // Retraso para que la animación de ocultar termine antes de poner display:none
                resultadoDiv.style.display = "none"; // Asigna valor
            }, 1500);             // Ejecuta llamada o método
    } else { // Instrucción JavaScript
        // Solicita confirmación antes de reemplazar los selectores
        const confirmar = confirm("¿Deseas guardar los cambios?"); // Declara e inicializa "confirmar"
        if (!confirmar) return; // Evalúa condición

        // Reemplaza los selects por la semana confirmada en verde neón
        for (let i = 0; i < elementos.length; i++) { // Inicia bucle de iteración
            const contenedorSemana = elementos[i]; // Declara e inicializa "contenedorSemana"
            contenedorSemana.innerHTML = semanaElegida[i].value; // Actualiza contenido en el DOM
            contenedorSemana.classList.add("success"); // Modifica clases CSS del elemento
        }

        // Muestra mensaje de confirmación en verde neón y oculta el botón confirmar
        resultadoDiv.style.display = "block"; // Asigna valor
        resultadoDiv.innerHTML = "<p>✅ Semanas de recuperación asignadas y guardadas correctamente.</p>"; // Actualiza contenido en el DOM
        resultadoDiv.className = "resultado-msg success"; // Asigna valor
        boton.style.display = "none"; // Asigna valor
    }
});
