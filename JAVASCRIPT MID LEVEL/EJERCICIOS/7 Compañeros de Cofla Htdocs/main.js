// Busca el contenedor donde se mostrará la cantidad de personas aprobadas.
const aprobados = document.querySelector(".aprobados");
// Busca el contenedor donde se mostrará la cantidad de personas desaprobadas.
const desaprobados = document.querySelector(".desaprobados");
// Busca el panel que se muestra cuando el usuario elige ver la solución.
const solucion = document.querySelector(".solucion");
// Busca el botón que revela el panel de la solución.
const aceptar = document.querySelector("#aceptar");
// Busca el botón que solicita los datos del archivo.
const botonInfo = document.querySelector("#getInfo");
// Busca el espacio reservado para mostrar errores de carga.
const errorMsg = document.querySelector(".error-msg");

// Al hacer clic en "Solución", añade la clase que hace visible el panel.
aceptar.addEventListener("click", () => {
    // La clase .mostrar activa la animación CSS y revela el panel.
    solucion.classList.add("mostrar");
});

// Al hacer clic en "Obtener Info", solicita los datos y actualiza la página.
botonInfo.addEventListener("click", async () => {
    // Intenta solicitar el archivo y manejar la respuesta antes de continuar.
    try {
        // Descarga informacion.txt; Axios interpreta su contenido como JSON.
        const resultado = await axios.get("informacion.txt");

        // Vacía el contenido anterior y deja la etiqueta de aprobados.
        aprobados.replaceChildren("Aprobados: ");
        // Crea un elemento en negrita para destacar la cantidad de aprobados.
        const totalAprobados = document.createElement("b");
        // Coloca en el elemento el número recibido desde el archivo.
        totalAprobados.textContent = resultado.data.aprobados;
        // Inserta la cantidad destacada dentro de su tarjeta.
        aprobados.append(totalAprobados);

        // Vacía el contenido anterior y deja la etiqueta de desaprobados.
        desaprobados.replaceChildren("Desaprobados: ");
        // Crea un elemento en negrita para destacar la cantidad de desaprobados.
        const totalDesaprobados = document.createElement("b");
        // Coloca en el elemento el número recibido desde el archivo.
        totalDesaprobados.textContent = resultado.data.desaprobados;
        // Inserta la cantidad destacada dentro de su tarjeta.
        desaprobados.append(totalDesaprobados);

        // Borra cualquier mensaje de error que hubiera quedado de una petición previa.
        errorMsg.textContent = "";
        // Quita la clase que aplica los estilos visuales de error.
        errorMsg.classList.remove("error");
    } catch (error) {
        // Registra en la consola el detalle técnico para ayudar a diagnosticar el fallo.
        console.error("No se pudo obtener la información:", error);
        // Informa al usuario que la carga no se pudo completar.
        errorMsg.textContent = "Error al obtener la información del API. Por favor, inténtalo de nuevo más tarde.";
        // Añade la clase CSS que resalta el mensaje de error.
        errorMsg.classList.add("error");
    }
});
