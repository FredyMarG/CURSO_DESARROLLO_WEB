// Guardamos referencias a los elementos que actualizaremos durante la petición.
const formulario = document.querySelector("#user-form");
const botonEnviar = document.querySelector("#submit-button");
const areaEstado = document.querySelector("#request-status");
const mensajeEstado = document.querySelector("#status-message");
const salidaRespuesta = document.querySelector("#response-output");

// ReqRes es un servicio externo de demostración que recibe el usuario de ejemplo.
const urlUsuarios = "https://reqres.in/api/users";

// Escuchamos el envío del formulario para realizar la petición sin recargar la página.
formulario.addEventListener("submit", (evento) => {
    // Evitamos la navegación que el navegador realizaría al enviar un formulario.
    evento.preventDefault();

    // Leemos los valores actuales y los empaquetamos con los nombres que espera la API.
    const datosFormulario = new FormData(formulario);
    const usuario = {
        name: datosFormulario.get("name").trim(),
        job: datosFormulario.get("job").trim()
    };

    // Creamos el objeto que administrará la comunicación HTTP con el servidor.
    const peticion = new XMLHttpRequest();

    // Indicamos que la solicitud está en curso y prevenimos envíos duplicados.
    actualizarEstado("loading", "Enviando datos al servidor...");
    botonEnviar.disabled = true;
    botonEnviar.querySelector("span:first-child").textContent = "Enviando...";

    // Se ejecuta cuando la respuesta llega, independientemente de su código HTTP.
    peticion.addEventListener("load", () => {
        // Solo los estados 2xx indican que la solicitud terminó correctamente.
        if (peticion.status >= 200 && peticion.status < 300) {
            try {
                // Convertimos el texto JSON recibido en un objeto de JavaScript.
                const respuesta = JSON.parse(peticion.responseText);

                // Mostramos la respuesta como texto para evitar interpretar HTML recibido.
                salidaRespuesta.textContent = JSON.stringify(respuesta, null, 2);
                actualizarEstado("success", `Respuesta recibida correctamente (HTTP ${peticion.status}).`);
            } catch (error) {
                // Informamos si el servidor respondió con contenido que no es JSON válido.
                salidaRespuesta.textContent = peticion.responseText || "El servidor devolvió una respuesta vacía.";
                actualizarEstado("error", "La respuesta llegó, pero no contiene JSON válido.");
            }
        } else {
            // Conservamos el detalle del servidor para facilitar la comprensión del error HTTP.
            salidaRespuesta.textContent = peticion.responseText || "El servidor no incluyó detalles adicionales.";
            actualizarEstado("error", `La solicitud falló con el estado HTTP ${peticion.status}.`);
        }

        // Permitimos realizar otra petición cuando la anterior ya terminó.
        restablecerBoton();
    });

    // Este evento ocurre si no se puede establecer comunicación con el servicio.
    peticion.addEventListener("error", () => {
        salidaRespuesta.textContent = "No fue posible conectar con el servicio.";
        actualizarEstado("error", "Error de red. Comprueba tu conexión e inténtalo de nuevo.");
        restablecerBoton();
    });

    // Evitamos que una petición pendiente deje la interfaz bloqueada indefinidamente.
    peticion.addEventListener("timeout", () => {
        salidaRespuesta.textContent = "La petición excedió el tiempo de espera.";
        actualizarEstado("error", "El servidor tardó demasiado en responder. Inténtalo de nuevo.");
        restablecerBoton();
    });

    // Configuramos el método y la URL antes de enviar la solicitud.
    peticion.open("POST", urlUsuarios);

    // Avisamos al servidor que el cuerpo de la petición está codificado como JSON.
    peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // Establecemos un límite de diez segundos para recibir la respuesta.
    peticion.timeout = 10000;

    // Serializamos el objeto y enviamos los datos al servicio externo.
    peticion.send(JSON.stringify(usuario));
});

// Actualiza el mensaje accesible y la clase visual que representa el estado actual.
function actualizarEstado(tipo, mensaje) {
    areaEstado.className = `status status-${tipo}`;
    mensajeEstado.textContent = mensaje;
}

// Restaura el botón después de cualquier resultado para que se pueda volver a enviar.
function restablecerBoton() {
    botonEnviar.disabled = false;
    botonEnviar.querySelector("span:first-child").textContent = "Enviar petición";
}