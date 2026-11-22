// Busca el formulario en el documento para poder escuchar su envío.
const formulario = document.querySelector("#user-form"); // Guarda el elemento del formulario.
const botonEnviar = document.querySelector("#submit-button"); // Guarda el botón que inicia la petición.
const areaEstado = document.querySelector("#request-status"); // Guarda el contenedor que refleja el estado.
const mensajeEstado = document.querySelector("#status-message"); // Guarda el elemento donde aparece el mensaje de estado.
const salidaRespuesta = document.querySelector("#response-output"); // Guarda el elemento donde se mostrará la respuesta.

// Define el endpoint de demostración que recibirá los datos del usuario.
const urlUsuarios = "https://reqres.in/api/users"; // Almacena la dirección de la API.

// Registra el manejador que se ejecuta al enviar el formulario.
formulario.addEventListener("submit", (evento) => { // Recibe el evento de envío del formulario.
    evento.preventDefault(); // Evita que el navegador recargue o navegue a otra página.

    const datosFormulario = new FormData(formulario); // Recoge los valores introducidos en el formulario.
    const usuario = { // Agrupa los datos con la estructura esperada por la API.
        name: datosFormulario.get("name").trim(), // Obtiene el nombre y elimina espacios al principio y al final.
        job: datosFormulario.get("job").trim() // Obtiene el trabajo y elimina espacios al principio y al final.
    }; // Termina la creación del objeto con los datos del usuario.

    const peticion = new XMLHttpRequest(); // Crea el objeto que realizará la solicitud HTTP.

    actualizarEstado("loading", "Enviando datos al servidor..."); // Informa que la solicitud está en curso.
    botonEnviar.disabled = true; // Desactiva el botón para evitar envíos duplicados.
    botonEnviar.querySelector("span:first-child").textContent = "Enviando..."; // Actualiza el texto del botón.

    peticion.addEventListener("load", () => { // Atiende la respuesta cuando termina la comunicación HTTP.
        if (peticion.status >= 200 && peticion.status < 300) { // Comprueba si el código HTTP indica éxito.
            try { // Intenta interpretar la respuesta como JSON válido.
                const respuesta = JSON.parse(peticion.responseText); // Convierte el texto recibido en un objeto.

                salidaRespuesta.textContent = JSON.stringify(respuesta, null, 2); // Muestra el JSON con formato seguro como texto.
                actualizarEstado("success", `Respuesta recibida correctamente (HTTP ${peticion.status}).`); // Muestra el estado exitoso y el código HTTP.
            } catch (error) { // Gestiona el caso en que el contenido no sea JSON válido.
                salidaRespuesta.textContent = peticion.responseText || "El servidor devolvió una respuesta vacía."; // Muestra el contenido recibido o un mensaje alternativo.
                actualizarEstado("error", "La respuesta llegó, pero no contiene JSON válido."); // Informa que no se pudo interpretar la respuesta.
            } // Termina el bloque que intenta procesar el JSON.
        } else { // Atiende respuestas cuyo código HTTP indica un error.
            salidaRespuesta.textContent = peticion.responseText || "El servidor no incluyó detalles adicionales."; // Muestra el detalle del servidor o un mensaje alternativo.
            actualizarEstado("error", `La solicitud falló con el estado HTTP ${peticion.status}.`); // Informa el código HTTP que produjo el fallo.
        } // Termina la comprobación del código de respuesta.

        restablecerBoton(); // Reactiva el botón una vez finalizada la solicitud.
    }); // Termina el manejador de la respuesta HTTP.

    peticion.addEventListener("error", () => { // Atiende los errores de conexión o comunicación de red.
        salidaRespuesta.textContent = "No fue posible conectar con el servicio."; // Explica que no se pudo establecer la conexión.
        actualizarEstado("error", "Error de red. Comprueba tu conexión e inténtalo de nuevo."); // Muestra el estado de error de red.
        restablecerBoton(); // Reactiva el botón para permitir otro intento.
    }); // Termina el manejador de errores de red.

    peticion.addEventListener("timeout", () => { // Atiende el evento que ocurre si la solicitud supera su límite de tiempo.
        salidaRespuesta.textContent = "La petición excedió el tiempo de espera."; // Muestra un mensaje sobre el tiempo agotado.
        actualizarEstado("error", "El servidor tardó demasiado en responder. Inténtalo de nuevo."); // Indica que el usuario puede volver a intentarlo.
        restablecerBoton(); // Reactiva el botón después del tiempo de espera.
    }); // Termina el manejador del tiempo de espera.

    peticion.open("POST", urlUsuarios); // Configura una solicitud POST dirigida al endpoint de usuarios.
    peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // Indica que el cuerpo de la solicitud contiene JSON codificado en UTF-8.
    peticion.timeout = 10000; // Define diez segundos como tiempo máximo de espera.
    peticion.send(JSON.stringify(usuario)); // Convierte el objeto a JSON y lo envía al servidor.
}); // Termina el manejador del envío del formulario.

function actualizarEstado(tipo, mensaje) { // Define la función que actualiza el estado visual y textual.
    areaEstado.className = `status status-${tipo}`; // Asigna clases CSS según el tipo de estado recibido.
    mensajeEstado.textContent = mensaje; // Actualiza el mensaje visible para el usuario.
} // Termina la función que actualiza el estado.

function restablecerBoton() { // Define la función que devuelve el botón a su estado inicial.
    botonEnviar.disabled = false; // Habilita nuevamente el botón.
    botonEnviar.querySelector("span:first-child").textContent = "Enviar petición"; // Restaura el texto original del botón.
} // Termina la función que restablece el botón.