/**
 * EJERCICIO 1: Lógica de validación de compra y manejo de UI dinámico.
 * Este script gestiona la detección de resolución y el feedback visual del usuario.
 */

// 🖥️ Obtiene la altura total de la pantalla física del monitor del usuario en píxeles.
let alto = window.screen.height;
// 🖥️ Obtiene el ancho total de la pantalla física del monitor del usuario en píxeles.
let ancho = window.screen.width;

// 🎯 Captura el contenedor principal donde se mostrará el veredicto final (div con id 'solucion').
let solucion = document.getElementById("solucion"),
    // 🎯 Captura el párrafo específico donde se inyectará el texto de éxito o error.
    msgRespuesta = document.getElementById("msg-respuesta"), 
    // 🎯 Selecciona el párrafo que mostrará dinámicamente la resolución actual de la ventana.
    validacion = document.querySelector(".validacion"),     
    // 🎯 Captura el botón de confirmación (clase 'aceptar') para asignarle lógica de compra.
    aceptar = document.querySelector(".aceptar"),          
    // 🎯 Captura el botón de anulación (clase 'cancelar') para asignarle lógica de rechazo.
    cancelar = document.querySelector(".cancelar");         

/**
 * Actualiza el texto de validación basándose en el Viewport actual.
 * Se utiliza innerHeight/Width para reflejar el espacio real de trabajo del navegador.
 */
function actualizarResolucion(){
    // 📐 Obtiene el alto interno de la ventana del navegador (excluyendo barras de herramientas).
    let altoViewport = window.innerHeight;
    // 📐 Obtiene el ancho interno de la ventana del navegador (lo que realmente ve la web).
    let anchoViewport = window.innerWidth;

    // ✍️ Modifica el contenido de texto del elemento 'validacion' con los datos obtenidos en tiempo real.
    validacion.textContent = `La resolución de la pantalla es: ${anchoViewport}px de ancho x ${altoViewport}px de alto`;
}

// ⚙️ Ejecuta la función por primera vez al cargar el script para mostrar la resolución inicial.
actualizarResolucion();
// ⚙️ Escucha el evento 'resize' (redimensionar) para actualizar el texto cada vez que el usuario cambie el tamaño de la ventana.
window.addEventListener("resize", actualizarResolucion)

/**
 * 🟢 Listener: Lógica de confirmación de compra
 */
aceptar.addEventListener("click", () => {
    // 📝 Asigna el string de éxito al párrafo de respuesta.
    msgRespuesta.textContent = "🎉 Compra Realizada Exitosamente";
    // 🎨 Elimina la clase 'error' por si existía de un clic previo fallido.
    msgRespuesta.classList.remove("error");
    // 🎨 Agrega la clase 'success' para aplicar el degradado verde definido en el CSS.
    msgRespuesta.classList.add("success");

    // 👁️ Hace que el contenedor de la solución pase de oculto a visible en el DOM.
    solucion.style.visibility = "visible";
    // 🔄 Remueve las clases de animación para asegurar un estado "limpio" antes de disparar la entrada.
    solucion.classList.remove("mostrar", "ocultar");

    /**
     * ⚡ HACK TÉCNICO: Force Reflow
     * Al acceder a offsetWidth, obligamos al navegador a recalcular el layout.
     * Esto permite que la animación 'mostrar' se ejecute incluso si el elemento ya la tuvo antes.
     */
    void solucion.offsetWidth;

    // 🎬 Agrega la clase 'mostrar' que activa el keyframe de entrada (scale y fade-in).
    solucion.classList.add("mostrar");

    // ⏱️ Inicia un temporizador que esperará 3 segundos antes de empezar a ocultar el mensaje.
    setTimeout(() => {
        // 🎬 Quita la clase de entrada y agrega 'ocultar' para disparar el keyframe de salida.
        solucion.classList.remove("mostrar");
        solucion.classList.add("ocultar");
        // ⏱️ Segundo temporizador: espera 1 segundo (duración de la animación de salida) para limpiar el DOM.
        setTimeout(() => {
            // 🙈 Oculta el elemento visualmente pero lo mantiene en el espacio del DOM.
            solucion.style.visibility = "hidden";
            // 🧹 Resetea las clases a su estado original (solo la clase base 'solucion').
            solucion.className = "solucion";
        }, 1000);
    }, 3000); // ⌛ El mensaje se mantiene estático durante 3 segundos.
});

/**
 * 🔴 Listener: Lógica de cancelación
 */
cancelar.addEventListener("click", () => {
    // 🧹 Asegura que el contenedor comience con su clase base limpia antes de la lógica de error.
    solucion.className = "solucion";
    // 🔄 Resetea cualquier estilo inline previo de visibilidad.
    solucion.style.visibility = "";

    // 📝 Asigna el string de cancelación al párrafo de respuesta.
    msgRespuesta.textContent = "😭 Compra Cancelada";
    // 🎨 Limpia estilos de éxito previos.
    msgRespuesta.classList.remove("success");
    // 🎨 Aplica el degradado rojo para indicar una acción negativa o cancelada.
    msgRespuesta.classList.add("error");

    // 👁️ Cambia el estado de visibilidad a 'visible' para mostrar el contenedor de error.
    solucion.style.visibility = "visible";
    // 🔄 Elimina clases de animación antiguas para evitar conflictos de reproducción de keyframes.
    solucion.classList.remove("mostrar", "ocultar");

    // ⚡ Dispara el reflujo (reflow) del navegador para que la animación se reinicie correctamente.
    void solucion.offsetWidth;

    // 🎬 Aplica la animación de entrada al mensaje de error.
    solucion.classList.add("mostrar");

    // ⏱️ Lógica de auto-ocultado (idéntica a la de éxito para mantener consistencia en la UX).
    setTimeout(() => {
        // 🎬 Cambia a animación de salida tras la espera de 3 segundos.
        solucion.classList.remove("mostrar");
        solucion.classList.add("ocultar");

        // ⏱️ Limpieza final tras completar la transición de salida de 1 segundo.
        setTimeout(() => {
            // 🙈 Vuelve a ocultar el elemento.
            solucion.style.visibility = "hidden";
            // 🧹 Deja el elemento listo para la próxima interacción del usuario.
            solucion.className = "solucion";
        }, 1000);
    }, 3000);
});