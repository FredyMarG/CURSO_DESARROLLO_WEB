// 🔹 Traemos los elementos del DOM (inputs, contenedores, etc)
let nombre = document.getElementById("nombre"), // input donde el usuario escribe su nombre
    mat = document.getElementById("materia"), // select donde elige la materia
    sol = document.getElementById("main-sol"), // contenedor principal del resultado
    resultado = document.getElementById("resultado"), // donde mostramos mensajes (éxito/error)
    form = document.getElementById("inscripcion-form"), // formulario completo
    before = document.getElementById("before"), // donde mostramos la lista antes
    after = document.getElementById("after") // donde mostramos la lista después


// 🔥 IMPORTANTE: el objeto está fuera de la función para que NO se reinicie cada vez
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


// 🔹 Función principal que se ejecuta al enviar el formulario
function solucion(e) {
    e.preventDefault() // evita que el form recargue la página

    // 🔹 mostramos el contenedor de resultados (por si estaba oculto)
    sol.style.display = "block"

    // 🔹 obtenemos los valores actuales del input y select
    let alumno = nombre.value.trim() // trim elimina espacios vacíos al inicio y final
    let materia = mat.value // obtenemos la materia seleccionada

    // 🔹 VALIDACIÓN: si algún campo está vacío, mostramos mensaje y detenemos ejecución
    if (alumno === "" || materia === "") {
        resultado.innerHTML = "🚨 Por favor, completa todos los campos."
        before.innerHTML = ""
        after.innerHTML = ""
        before.style.display = "none"
        after.style.display = "none"
        resultado.className = "resultado error"
        return // corta la ejecución
    }

    // 🔹 obtenemos el array de alumnos de la materia seleccionada
    let alumnos = materias[materia]

    // 🔥 BEFORE (ANTES DE INSCRIBIR)
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

    // 🔹 VALIDAR CUPO: si hay 20 alumnos o más, no se puede inscribir
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
            // 🔹 limpiamos el formulario
        setTimeout(() => {
            form.reset() // limpia los campos del formulario
        }, 1000) // espera 1 segundo antes de limpiar para que el usuario vea el mensaje
        return
    }

    // 🔹 VALIDAR DUPLICADOS: evita que el mismo alumno se inscriba dos veces
    if (alumnos.includes(alumno)) { //alumnos.includes verifica si el alumno ya está en el array de la materia
        resultado.innerHTML = `⚠️ <b>${alumno.replace(/\b\w/g, l => l.toUpperCase())}</b> ya está inscrito en <b>${materia.replace(/\b\w/g, l => l.toUpperCase())}</b>`
            before.innerHTML = `
            <p>📘 ${alumnos.length} alumnos:</p>
            <ul>
                ${
                    alumnos.map(a => `<li ${a === alumno ? 'style="color:#2563eb;font-weight:bold; font-size-16px;"' : ''}>👤 ${a.replace(/\b\w/g, l => l.toUpperCase())}</li>`).join("")
                    // alumnos.map recorre el array y transforma cada alumno en un <li>
                    // join("") une todos los elementos en un solo string para renderizar HTML correctamente
                }
            </ul>
        `
        resultado.className = "resultado warning"
        after.innerHTML = ""
        after.style.display = "none"
        // 🔹 limpiamos el formulario
        setTimeout(() => {
            form.reset() // limpia los campos del formulario
        }, 1000) // espera 1 segundo antes de limpiar para que el usuario vea el mensaje
        return
    }


    // 🔥 INSCRIPCIÓN: agregamos el alumno al array
    alumnos.push(alumno)
    // push agrega el nuevo alumno al final del array

    // 🔥 AFTER (DESPUÉS DE INSCRIBIR)
    after.innerHTML = `
        <p>📘 Después (${alumnos.length} alumnos):</p>
        <ul>
            ${
                alumnos.map(a => 
                    `<li ${a === alumno ? 'style="color:green;font-weight:bold; font-size:16px;"' : ''}>
                        👤 ${a.replace(/\b\w/g, l => l.toUpperCase())}
                    </li>`
                ).join("")
                // map recorre todos los alumnos
                // si el alumno actual es el recién agregado → lo resalta en verde
                // join("") convierte el array en HTML válido
            }
        </ul>
    `

    // 🔹 MENSAJE FINAL
    resultado.className = "resultado success"
    resultado.innerHTML = `✅ <b>${alumno.replace(/\b\w/g, l => l.toUpperCase())}</b> fue inscrito en <b>${materia.replace(/\b\w/g, l => l.toUpperCase())}</b>`
    after.style.display = "block"
    before.style.display = "block"
    
    // 🔹 limpiamos el formulario
    setTimeout(() => {
        form.reset() // limpia los campos del formulario
    }, 1000) // espera 1 segundo antes de limpiar para que el usuario vea el mensaje
}


// 🔥 EVENTO PRINCIPAL
form.addEventListener("submit", solucion)
// escuchamos el evento submit del formulario
// cuando el usuario da click o presiona enter → se ejecuta solucion()