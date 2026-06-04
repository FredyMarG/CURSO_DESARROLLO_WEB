/**
 * SISTEMA DE INSCRIPCIÓN DE MATERIAS
 * Este script gestiona la lógica de negocio para inscribir alumnos en diferentes materias,
 * controlando el cupo máximo, evitando duplicados y actualizando el DOM en tiempo real.
 */

// 1. REFERENCIAS AL DOM
// Capturamos los elementos necesarios para interactuar con la interfaz de usuario.
let nombre = document.getElementById("nombre"),         // Campo de texto para el nombre del alumno.
    mat = document.getElementById("materia"),           // Menú desplegable para seleccionar la materia.
    sol = document.getElementById("main-sol"),         // Contenedor que envuelve la sección de resultados.
    resultado = document.getElementById("resultado"),   // Elemento para mostrar mensajes de estado (éxito/error/aviso).
    form = document.getElementById("inscripcion-form"), // El formulario que dispara el evento de envío.
    before = document.getElementById("before"),         // Área para mostrar el estado de la materia ANTES de la acción.
    after = document.getElementById("after");           // Área para mostrar el estado de la materia DESPUÉS de la acción.


// 2. BASE DE DATOS (ESTADO)
// Objeto que almacena las materias y sus listas de alumnos inscritos.
// Está fuera de la función para que los cambios persistan entre envíos del formulario.
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
 * 3. FUNCIÓN PRINCIPAL: solucion(e)
 * Maneja el evento de 'submit', procesa los datos y actualiza la visualización.
 * @param {Event} e - Objeto del evento de envío del formulario.
 */
function solucion(e) {
    e.preventDefault(); // Detiene la recarga automática de la página para procesar con JS.

    // Activamos la visibilidad del contenedor de solución.
    sol.style.display = "block"

    let alumno = nombre.value.trim(); // Captura el nombre y elimina espacios innecesarios.
    let materia = mat.value;         // Captura la materia seleccionada.

    // VALIDACIÓN 1: Campos vacíos.
    if (alumno === "" || materia === "") {
        resultado.innerHTML = "🚨 Por favor, completa todos los campos."
        before.innerHTML = ""
        after.innerHTML = ""
        before.style.display = "none"
        after.style.display = "none"
        resultado.className = "resultado error"
        return; // Detiene la ejecución si hay campos vacíos.
    }

    let alumnos = materias[materia]; // Referencia al array específico de la materia elegida.

    // RENDERIZADO DEL ESTADO INICIAL (BEFORE)
    before.innerHTML = `
        <p>📘 Antes (${alumnos.length} alumnos):</p>
        <ul>
            ${
                alumnos.map(a => `<li>👤 ${a}</li>`).join("")
                // alumnos.map recorre el array y transforma cada alumno en un <li>
                // join("") une todos los elementos en un solo string para renderizar HTML correctamente
            }
        </ul>
    `

    // VALIDACIÓN 2: Límite de cupo (Máximo 20 alumnos).
    if (alumnos.length >= 20) {
        resultado.innerHTML = `❌ Lo siento <b>${alumno}</b>, cupo lleno en <b>${materia}</b>`
        before.innerHTML = `
            <p>📘 Antes (${alumnos.length} alumnos):</p>
            <ul>
                ${
                    alumnos.map(a => `<li>👤 ${a}</li>`).join("")
                    // alumnos.map recorre el array y transforma cada alumno en un <li>
                    // join("") une todos los elementos en un solo string para renderizar HTML correctamente
                }
            </ul>
        `
        after.innerHTML = ""
        after.style.display = "none"
        resultado.className = "resultado error"
        
        setTimeout(() => {
            form.reset(); // Resetea el formulario tras un breve retardo.
        }, 1000)
        return
    }

    // VALIDACIÓN 3: Alumno ya inscrito (Evita duplicados).
    if (alumnos.includes(alumno)) { 
        resultado.innerHTML = `⚠️ <b>${alumno.replace(/\b\w/g, l => l.toUpperCase())}</b> ya está inscrito en <b>${materia.replace(/\b\w/g, l => l.toUpperCase())}</b>`
        before.innerHTML = `
            <p>📘 ${alumnos.length} alumnos:</p>
            <ul>
                ${
                    alumnos.map(a => `<li ${a === alumno ? 'style="color:#2563eb;font-weight:bold; font-size-16px;"' : ''}>👤 ${a.replace(/\b\w/g, l => l.toUpperCase())}</li>`).join("")
                }
            </ul>
        `
        resultado.className = "resultado warning"
        after.innerHTML = ""
        after.style.display = "none"
        
        setTimeout(() => {
            form.reset();
        }, 1000)
        return
    }

    // PROCESO DE INSCRIPCIÓN: Agregamos al alumno al array correspondiente.
    alumnos.push(alumno);

    // RENDERIZADO DEL ESTADO FINAL (AFTER)
    after.innerHTML = `
        <p>📘 Después (${alumnos.length} alumnos):</p>
        <ul>
            ${
                alumnos.map(a => 
                    `<li ${a === alumno ? 'style="color:green;font-weight:bold; font-size:16px;"' : ''}>
                        👤 ${a.replace(/\b\w/g, l => l.toUpperCase())}
                    </li>`
                ).join("")
            }
        </ul>
    `

    // ACTUALIZACIÓN VISUAL DE ÉXITO
    resultado.className = "resultado success"
    resultado.innerHTML = `✅ <b>${alumno.replace(/\b\w/g, l => l.toUpperCase())}</b> fue inscrito en <b>${materia.replace(/\b\w/g, l => l.toUpperCase())}</b>`
    after.style.display = "block"
    before.style.display = "block"
    
    setTimeout(() => {
        form.reset();
    }, 1000)
}


/**
 * 4. INICIALIZACIÓN
 * Agregamos el "escuchador de eventos" al formulario.
 */
form.addEventListener("submit", solucion);