/**
 * LABORATORIO: INSCRIPCIÓN DE MATERIA PENDIENTE
 * Este script gestiona la validación de un formulario de inscripción de materias
 * y muestra mensajes de éxito o error al usuario.
 */

// 1. REFERENCIAS AL DOM
// Capturamos los elementos HTML con los que vamos a interactuar.
const nombre = document.getElementById("nombre"),         // Campo de entrada para el nombre completo.
    mail = document.getElementById("mail"),               // Campo de entrada para el correo electrónico.
    materia = document.getElementById("materia"),         // Campo de entrada para la materia adeudada.
    enviar = document.getElementById("enviar"),           // Botón de envío del formulario.
    solucion = document.getElementById("solucion"),       // Contenedor principal donde se muestra la respuesta.
    sol = document.getElementById("sol-res"),             // Título dentro del contenedor de solución.
    respuesta = document.getElementById("respuesta");     // Párrafo donde se mostrará el mensaje de éxito/error.

/**
 * 2. MANEJADOR DEL EVENTO SUBMIT
 * Se ejecuta cuando el usuario intenta enviar el formulario.
 */
enviar.addEventListener("click", (e) => { // Agregamos un "escuchador" al evento 'click' del botón 'enviar'.
    e.preventDefault();                   // Previene el comportamiento por defecto del formulario (recargar la página).
    let error = validarCampos();          // Llama a la función de validación y guarda el resultado.
    
    // Agregamos la clase base para el estilo del mensaje de respuesta.
    // Esto asegura que las animaciones y estilos generales del mensaje se apliquen.
    respuesta.classList.add("resultado-msg");

    // Comprueba si la validación encontró algún error.
    if (error[0]) { // Si error[0] es true, significa que hay un error.
        respuesta.innerHTML = error[1];             // Muestra el mensaje de error específico.
        respuesta.classList.add("error");           // Aplica la clase CSS 'error' para estilos negativos.
        respuesta.classList.remove("success");      // Elimina la clase 'success' si estaba presente.
        
        // Asegura que el contenedor de solución esté listo para mostrarse con la animación.
        solucion.classList.remove("solucion");      // Elimina la clase 'solucion' (que puede tener 'visibility: hidden').
        solucion.classList.add("mostrar");          // Aplica la clase 'mostrar' para activar la animación de entrada.
        
        sol.classList.add("error-res");             // Aplica un estilo específico al título de la solución para errores.
        sol.classList.remove("success-res");        // Elimina el estilo de éxito del título.
    } else { // Si error[0] es false, la validación fue exitosa.
        respuesta.innerHTML = `✅ Solicitud enviada correctamente para <b>${nombre.value}</b>.`; // Muestra mensaje de éxito.
        respuesta.classList.add("success");         // Aplica la clase CSS 'success' para estilos afirmativos.
        respuesta.classList.remove("error");        // Elimina la clase 'error' si estaba presente.
        
        // Asegura que el contenedor de solución esté listo para mostrarse con la animación.
        solucion.classList.remove("solucion");      // Elimina la clase 'solucion'.
        solucion.classList.add("mostrar");          // Aplica la clase 'mostrar' para la animación de entrada.
        
        sol.classList.add("success-res");           // Aplica un estilo específico al título de la solución para éxito.
        sol.classList.remove("error-res");          // Elimina el estilo de error del título.
    }
});

/**
 * 3. FUNCIÓN DE VALIDACIÓN DE CAMPOS
 * Verifica que los datos ingresados por el usuario cumplan con ciertos criterios.
 * @returns {Array} Un array donde el primer elemento es un booleano (true si hay error, false si no)
 *                  y el segundo elemento es el mensaje de error (si existe).
 */
const validarCampos = () => {
    let error = []; // Inicializa un array para almacenar el estado y mensaje de error.

    // VALIDACIÓN DEL CAMPO 'nombre':
    // Verifica que la longitud del nombre esté entre 5 y 40 caracteres.
    if (nombre.value.length < 5 || nombre.value.length > 40) {
        error[0] = true;                                    // Indica que hay un error.
        error[1] = "❌ El nombre debe tener entre 5 y 40 caracteres."; // Mensaje de error.
        return error;                                       // Detiene la ejecución y devuelve el error.
    }
    // VALIDACIÓN DEL CAMPO 'mail':
    // Verifica la longitud del email y que contenga '@' y '.'.
    // NOTA: Esta es una validación básica. Una validación de email más robusta usaría expresiones regulares.
    else if (mail.value.length < 5 || mail.value.length > 40 || !mail.value.includes("@") || !mail.value.includes(".")) {
        error[0] = true;                                    // Indica que hay un error.
        error[1] = "❌ El email es inválido. Debe contener '@' y '.'."; // Mensaje de error.
        return error;                                       // Detiene la ejecución y devuelve el error.
    }
    // VALIDACIÓN DEL CAMPO 'materia':
    // Verifica que la longitud de la materia esté entre 4 y 40 caracteres.
    else if (materia.value.length < 4 || materia.value.length > 40) {
        error[0] = true;                                    // Indica que hay un error.
        error[1] = "❌ La materia debe tener entre 4 y 40 caracteres."; // Mensaje de error.
        return error;                                       // Detiene la ejecución y devuelve el error.
    }

    // Si todas las validaciones anteriores pasaron, no hay errores.
    error[0] = false; // Indica que no hay errores.
    return error;     // Devuelve el array indicando éxito.
};