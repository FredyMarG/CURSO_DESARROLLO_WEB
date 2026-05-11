// 📊 Captura de dimensiones de la pantalla física del usuario
let alto = window.screen.height;
let ancho = window.screen.width;

// 🔍 Selección de elementos del DOM (Document Object Model)
let solucion = document.getElementById("solucion"),
    msgRespuesta = document.getElementById("msg-respuesta"), // Párrafo donde se escribe el resultado
    validacion = document.querySelector(".validacion"),     // Párrafo que muestra la resolución detectada
    aceptar = document.querySelector(".aceptar"),          // Botón de confirmación
    cancelar = document.querySelector(".cancelar");         // Botón de cancelación

// ✍️ Inyecta la información de resolución en el HTML apenas carga el script
validacion.textContent = `El alto es ${alto}px, el ancho es ${ancho}px`;

// 🟢 Evento para el botón "Aceptar" (Lógica de éxito)
aceptar.addEventListener("click", () => {

    // Define el mensaje de éxito
    msgRespuesta.textContent = "🎉 Compra Realizada Exitosamente";

    // Gestiona las clases de estilo para aplicar el degradado verde (definido en CSS)
    msgRespuesta.classList.remove("error");
    msgRespuesta.classList.add("success");

    // Cambia el estado de visibilidad del contenedor de solución
    solucion.style.visibility = "visible";

    // Limpia las clases de animación previas para evitar conflictos
    solucion.classList.remove("mostrar", "ocultar");

    /**
     * ⚡ TRUCO TÉCNICO: void solucion.offsetWidth
     * Fuerza un "reflow" (reflujo) del navegador. Esto es necesario para que 
     * el navegador detecte que quitamos la clase y la volvimos a poner en el mismo 
     * ciclo de ejecución, permitiendo que la animación CSS se reinicie desde cero.
     */
    void solucion.offsetWidth;

    // Agrega la clase que dispara la animación de entrada
    solucion.classList.add("mostrar");

    // Temporizador: Mantiene el mensaje visible por 5 segundos antes de quitarlo
    setTimeout(() => {
        // Cambia la animación a la de salida (ocultar)
        solucion.classList.remove("mostrar");
        solucion.classList.add("ocultar");

        // Segundo temporizador: Espera a que termine la animación de salida (500ms) para ocultar el div
        setTimeout(() => {
            solucion.style.visibility = "hidden";
        }, 500);

    }, 5000);
});

// 🔴 Evento para el botón "Cancelar" (Lógica de error)
cancelar.addEventListener("click", () => {

    // Define el mensaje de cancelación
    msgRespuesta.textContent = "😭 Compra Cancelada";

    // Gestiona las clases de estilo para aplicar el degradado rojo
    msgRespuesta.classList.remove("success");
    msgRespuesta.classList.add("error");

    /**
     * El resto de la lógica sigue el mismo patrón que el botón aceptar:
     * 1. Hace visible el contenedor.
     * 2. Reinicia las clases de animación.
     * 3. Fuerza el reinicio visual con offsetWidth.
     * 4. Aplica la animación de entrada.
     * 5. Programa la desaparición automática tras 5 segundos.
     */
    solucion.style.visibility = "visible";

    // Reiniciar animaciones/clases
    solucion.classList.remove("mostrar", "ocultar")

    // Forzar reinicio de animación
    void solucion.offsetWidth

    // Mostrar
    solucion.classList.add("mostrar")

    setTimeout(() => {
        // Ocultar con animación
        solucion.classList.remove("mostrar")
        solucion.classList.add("ocultar")

        // Ocultar completamente al terminar
        setTimeout(() => {
            solucion.style.visibility = "hidden"
        }, 500)
    }, 5000);
});