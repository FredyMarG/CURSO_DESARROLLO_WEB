// Busca el formulario usado para enviar los datos del usuario.
const formulario = document.querySelector("#user-form");
// Busca el botón que envía el formulario con el cliente seleccionado.
const botonEnviar = document.querySelector("#submit-button");
// Busca el contenedor visual que indica el estado de la petición.
const areaEstado = document.querySelector("#request-status");
// Busca el texto accesible donde se muestra el mensaje de estado.
const mensajeEstado = document.querySelector("#status-message");
// Busca el elemento de código que mostrará la respuesta JSON del servidor.
const salidaRespuesta = document.querySelector("#response-output code");
// Busca el texto que explica el cliente HTTP seleccionado.
const descripcionCliente = document.querySelector("#client-description");
// Busca los botones que permiten alternar entre Fetch y Axios.
const opcionesCliente = document.querySelectorAll(".client-option");
// Busca el botón que consulta el nombre guardado en el archivo local.
const botonNombre = document.querySelector("#nombre");
// Busca el botón que consulta la edad guardada en el archivo local.
const botonEdad = document.querySelector("#edad");
// Busca el elemento donde se mostrará el nombre obtenido.
const salidaNombre = document.querySelector(".nombre");
// Busca el elemento donde se mostrará la edad obtenida.
const salidaEdad = document.querySelector(".edad");

// Define la dirección del servicio de prueba para crear usuarios.
const urlUsuarios = "https://jsonplaceholder.typicode.com/users";
// Guarda el texto explicativo asociado a cada cliente HTTP.
const descripcionesCliente = {
    // Describe Fetch, que ya está incluido en los navegadores modernos.
    fetch: "Fetch viene integrado en el navegador; hay que comprobar manualmente si la respuesta HTTP fue exitosa.",
    // Describe Axios y su manejo automático de JSON y errores HTTP.
    axios: "Axios es una biblioteca externa; transforma el JSON y gestiona los estados HTTP de error automáticamente."
}; // Termina el objeto con las descripciones de los clientes.

// Selecciona Fetch como cliente inicial de la demostración.
let clienteSeleccionado = "fetch";

// Recorre cada opción para registrar su interacción de clic.
opcionesCliente.forEach((opcion) => { // Inicia el registro de opciones.
    // Ejecuta este código cuando se selecciona Fetch o Axios.
    opcion.addEventListener("click", () => { // Inicia el controlador del clic.
        // Actualiza el cliente que se usará al enviar el formulario.
        clienteSeleccionado = opcion.dataset.client;

        // Recorre las opciones para actualizar su estado visual y accesible.
        opcionesCliente.forEach((elemento) => { // Inicia la actualización de opciones.
            // Comprueba si este botón es la opción que se acaba de pulsar.
            const seleccionado = elemento === opcion;
            // Añade o quita el estilo visual de selección.
            elemento.classList.toggle("is-selected", seleccionado);
            // Informa a tecnologías de asistencia si el botón está seleccionado.
            elemento.setAttribute("aria-pressed", String(seleccionado));
        }); // Termina la actualización visual y accesible de las opciones.

        // Muestra la descripción del cliente que quedó seleccionado.
        descripcionCliente.textContent = descripcionesCliente[clienteSeleccionado];
        // Actualiza el texto del botón de envío para reflejar la selección.
        botonEnviar.querySelector("span:first-child").textContent = `Enviar con ${clienteSeleccionado === "axios" ? "Axios" : "Fetch"}`;
    }); // Termina el controlador del clic de una opción.
}); // Termina el registro de eventos de las opciones.

// Escucha el envío del formulario para iniciar la petición HTTP.
formulario.addEventListener("submit", async (evento) => { // Inicia el controlador asíncrono del formulario.
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();

    // Lee los campos del formulario como pares nombre y valor.
    const datosFormulario = new FormData(formulario);
    // Prepara los datos con los nombres de propiedades que espera el servicio.
    const usuario = {
        // Obtiene y elimina espacios sobrantes del nombre ingresado.
        name: datosFormulario.get("name").trim(),
        // Obtiene y elimina espacios sobrantes de la ocupación ingresada.
        job: datosFormulario.get("job").trim()
    }; // Termina el objeto de datos del usuario.

    // Comunica qué cliente está enviando la petición.
    actualizarEstado("loading", `Enviando datos con ${clienteSeleccionado === "axios" ? "Axios" : "Fetch"}...`);
    // Deshabilita el botón mientras se procesa el envío.
    botonEnviar.disabled = true;
    // Deshabilita las opciones para no cambiar el cliente durante la petición.
    opcionesCliente.forEach((opcion) => { // Inicia el bloqueo de las opciones.
        // Impide que se pulse esta opción mientras se envían los datos.
        opcion.disabled = true;
    }); // Termina el bloqueo de las opciones.
    // Indica en el panel de respuesta que la petición está en curso.
    salidaRespuesta.textContent = "Procesando petición...";

    // Inicia el bloque que gestiona el resultado y los posibles errores.
    try { // Comienza la operación de red.
        // Declara el espacio donde se guardarán el estado HTTP y los datos recibidos.
        let respuesta;

        // Comprueba si el usuario eligió Axios.
        if (clienteSeleccionado === "axios") { // Inicia la rama de Axios.
            // Comprueba si la biblioteca Axios está disponible en la página.
            if (typeof axios === "undefined") { // Inicia la comprobación de Axios.
                // Informa de forma explícita que no se pudo cargar Axios.
                throw new Error("No se pudo cargar Axios. Comprueba tu conexión e inténtalo de nuevo.");
            } // Termina la comprobación de disponibilidad de Axios.

            // Envía los datos con Axios y limita la espera a diez segundos.
            const resultado = await axios.post(urlUsuarios, usuario, {
                // Declara que el contenido enviado está codificado como JSON.
                headers: { "Content-Type": "application/json" },
                // Cancela la petición si tarda más de diez segundos.
                timeout: 10000
            }); // Termina la petición POST realizada con Axios.
            // Conserva el estado HTTP y los datos de la respuesta de Axios.
            respuesta = { status: resultado.status, data: resultado.data };
        } else { // Inicia la rama de Fetch.
            // Envía una petición POST con los datos del usuario en formato JSON.
            const resultado = await fetch(urlUsuarios, {
                // Indica que se enviarán datos para crear un recurso.
                method: "POST",
                // Declara que el cuerpo de la petición contiene JSON.
                headers: { "Content-Type": "application/json" },
                // Convierte el objeto del usuario a texto JSON para enviarlo.
                body: JSON.stringify(usuario)
            }); // Termina la petición POST realizada con Fetch.
            // Convierte el cuerpo JSON de la respuesta en un objeto JavaScript.
            const datos = await resultado.json();
            // Conserva el estado HTTP y el objeto de respuesta de Fetch.
            respuesta = { status: resultado.status, data: datos };

            // Fetch no rechaza automáticamente la promesa ante errores HTTP.
            if (!resultado.ok) { // Inicia la comprobación del estado HTTP.
                // Muestra cualquier detalle JSON proporcionado por el servidor.
                salidaRespuesta.textContent = JSON.stringify(datos, null, 2);
                // Lanza un error para mostrar el estado HTTP como fallo.
                throw new Error(`La solicitud falló con el estado HTTP ${resultado.status}.`);
            } // Termina la comprobación del estado HTTP.
        } // Termina la selección entre Axios y Fetch.

        // Muestra los datos recibidos como JSON con sangría legible.
        salidaRespuesta.textContent = JSON.stringify(respuesta.data, null, 2);
        // Indica que la petición terminó correctamente y muestra su estado HTTP.
        actualizarEstado("success", `Respuesta recibida correctamente (HTTP ${respuesta.status}).`);
    } catch (error) { // Captura errores HTTP, de red o de configuración.
        // Comprueba si Axios adjuntó una respuesta HTTP al error.
        if (error.response) { // Inicia el manejo de errores de respuesta Axios.
            // Muestra los detalles JSON que acompañan la respuesta fallida.
            salidaRespuesta.textContent = JSON.stringify(error.response.data, null, 2);
            // Informa el código HTTP de la respuesta de error.
            actualizarEstado("error", `La solicitud falló con el estado HTTP ${error.response.status}.`);
        } else { // Maneja errores sin una respuesta HTTP disponible.
            // Evita reemplazar detalles existentes salvo que siga el texto de carga.
            if (!salidaRespuesta.textContent || salidaRespuesta.textContent === "Procesando petición...") { // Inicia la comprobación del panel.
                // Muestra el mensaje del error en el panel de respuesta.
                salidaRespuesta.textContent = error.message;
            } // Termina la comprobación del contenido del panel.
            // Muestra el mensaje del error o uno general si no existe.
            actualizarEstado("error", error.message || "No fue posible completar la petición.");
        } // Termina el manejo alternativo de errores.
    } finally { // Esta sección se ejecuta tanto si hay éxito como si hay error.
        // Reactiva el botón principal cuando termina la petición.
        botonEnviar.disabled = false;
        // Reactiva las opciones para permitir elegir el cliente otra vez.
        opcionesCliente.forEach((opcion) => { // Inicia la reactivación de opciones.
            // Permite volver a pulsar esta opción de cliente HTTP.
            opcion.disabled = false;
        }); // Termina la reactivación de las opciones.
    } // Termina la gestión de la petición y sus estados.
}); // Termina el controlador de envío del formulario.

// Actualiza el estilo visual y el texto accesible del estado actual.
function actualizarEstado(tipo, mensaje) { // Declara el ayudante para actualizar estados.
    // Cambia las clases CSS según el estado, por ejemplo éxito o error.
    areaEstado.className = `status status-${tipo}`;
    // Inserta el mensaje de estado como texto seguro.
    mensajeEstado.textContent = mensaje;
} // Termina la función que actualiza el estado.

// Consulta un campo específico del archivo y lo muestra en su propia salida.
async function cargarDato(propiedad, salida, boton) { // Declara el cargador compartido de campos.
    // Deshabilita solo el botón que inició esta consulta.
    boton.disabled = true;
    // Indica en el campo correspondiente que la lectura está en curso.
    salida.textContent = "Cargando...";

    // Inicia la lectura del archivo y el manejo de posibles errores.
    try { // Comienza la petición del archivo de información.
        // Solicita el archivo local que contiene el nombre y la edad.
        const respuesta = await fetch("informacion.txt");
        // Comprueba que la respuesta del servidor indique éxito.
        if (!respuesta.ok) { // Inicia la validación de la respuesta.
            // Informa del código HTTP si no se pudo leer el archivo.
            throw new Error(`No se pudo leer informacion.txt (HTTP ${respuesta.status}).`);
        } // Termina la validación de la respuesta.

        // Convierte el JSON del archivo en un objeto JavaScript.
        const informacion = await respuesta.json();
        // Verifica que el archivo incluya la propiedad solicitada por este botón.
        if (!(propiedad in informacion)) { // Inicia la validación del campo solicitado.
            // Informa qué propiedad falta en el archivo de datos.
            throw new Error(`No se encontró el campo "${propiedad}" en informacion.txt.`);
        } // Termina la validación del campo solicitado.

        // Actualiza solo la salida del nombre o la edad seleccionada.
        salida.textContent = informacion[propiedad];
    } catch (error) { // Captura errores de red, HTTP o formato JSON.
        // Muestra el error en el campo que corresponde al botón pulsado.
        salida.textContent = error.message || "No fue posible cargar la información.";
    } finally { // Reactiva el botón después de completar la consulta.
        // Reactiva únicamente el botón que inició la lectura.
        boton.disabled = false;
    } // Termina la gestión de la lectura del campo.
} // Termina la función que carga un dato individual.

// Al pulsar este botón, consulta y actualiza únicamente el nombre.
botonNombre.addEventListener("click", () => cargarDato("Nombre", salidaNombre, botonNombre));
// Al pulsar este botón, consulta y actualiza únicamente la edad.
botonEdad.addEventListener("click", () => cargarDato("Edad", salidaEdad, botonEdad));
