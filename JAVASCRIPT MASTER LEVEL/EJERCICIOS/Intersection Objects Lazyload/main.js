// Activamos el modo estricto de JavaScript para evitar errores silenciosos y malas prácticas
"use strict";

// Seleccionamos el contenedor principal del HTML donde se insertarán las publicaciones
const publicaciones = document.querySelector(".publicaciones");

// Contador global que lleva el índice de la siguiente publicación a mostrar
let contador = 0;

// Variable caché para guardar los datos del archivo JSON y no descargarlo en cada scroll
let datosPublicaciones = null;

// Función flecha encargada de construir el bloque HTML de una publicación individual
const createPublicationCode = (name, content) => {
    // Creamos el contenedor principal de la tarjeta
    const container = document.createElement("DIV");
    // Creamos el contenedor para la barra de comentarios
    const comentarios = document.createElement("DIV");
    // Creamos el encabezado para el nombre del autor
    const nombre = document.createElement("H3");
    // Creamos el párrafo para el texto de la publicación
    const contenido = document.createElement("P");
    // Creamos el campo de texto para escribir un comentario
    const btnComentario = document.createElement("INPUT");
    // Creamos el botón de envío del comentario
    const btnEnviar = document.createElement("INPUT");

    // Asignamos la clase CSS de la tarjeta principal
    container.classList.add("publicacion");
    // Asignamos la clase CSS al bloque de comentarios
    comentarios.classList.add("comentarios");
    // Asignamos la clase CSS al input de texto
    btnComentario.classList.add("comentario");
    // Asignamos la clase CSS al botón de enviar
    btnEnviar.classList.add("enviar");

    // Definimos el texto guía dentro del campo de comentario
    btnComentario.placeholder = "Introduce un comentario";
    // Asignamos el nombre del autor al encabezado
    nombre.textContent = name;
    // Asignamos el contenido textual al párrafo
    contenido.textContent = content;
    // Indicamos que el botón es de tipo envío
    btnEnviar.type = "submit";
    // Establecemos el texto visible dentro del botón
    btnEnviar.value = "Enviar";

    // Escuchamos el clic del botón para validar y limpiar el comentario sin recargar la página
    btnEnviar.addEventListener("click", (e) => {
        // Evitamos cualquier comportamiento de recarga por defecto
        e.preventDefault();
        // Si el usuario escribió algún texto (ignorando espacios), limpiamos el campo
        if (btnComentario.value.trim() !== "") {
            // Confirmamos brevemente en el placeholder y vaciamos el input
            btnComentario.value = "";
            btnComentario.placeholder = "¡Comentario enviado!";
        }
    });

    // Agregamos el campo de texto al contenedor de comentarios
    comentarios.appendChild(btnComentario);
    // Agregamos el botón de enviar al contenedor de comentarios
    comentarios.appendChild(btnEnviar);
    // Agregamos el nombre del autor a la tarjeta
    container.appendChild(nombre);
    // Agregamos el párrafo de contenido a la tarjeta
    container.appendChild(contenido);
    // Agregamos la barra de comentarios a la tarjeta
    container.appendChild(comentarios);

    // Retornamos la tarjeta completa lista para insertarse en el DOM
    return container;
};

// Callback que se ejecuta cuando el elemento observado entra o sale del área visible
const cargarMasPublis = (entries, obs) => {
    // Verificamos si el elemento observado está intersectando (visible en pantalla)
    if (entries[0].isIntersecting) {
        // Dejamos de observar el elemento actual para que no vuelva a disparar la carga al subir/bajar
        obs.unobserve(entries[0].target);
        // Cargamos el siguiente lote de 4 publicaciones
        cargarPublicaciones(4);
    }
};

// Creamos la instancia de IntersectionObserver pasando el callback de carga
const observer = new IntersectionObserver(cargarMasPublis);

// Segundo observador encargado de activar la animación justo cuando cada tarjeta entra en pantalla
const observerAnimacion = new IntersectionObserver((entries, obs) => {
    // Recorremos todas las tarjetas que cambiaron su estado de visibilidad
    entries.forEach((entry) => {
        // Si la tarjeta ya es visible en el viewport
        if (entry.isIntersecting) {
            // Añadimos la clase 'visible' para disparar la animación CSS
            entry.target.classList.add("visible");
            // Dejamos de observar esta tarjeta porque su animación es de un solo disparo
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Función asíncrona que obtiene los datos y renderiza la cantidad solicitada de publicaciones
const cargarPublicaciones = async (num) => {
    try {
        // Si aún no hemos descargado el archivo, realizamos la petición fetch una sola vez
        if (!datosPublicaciones) {
            // Solicitamos el archivo local con los datos en formato JSON
            const request = await fetch("informacion.txt");
            // Convertimos la respuesta a un objeto JavaScript
            const content = await request.json();
            // Guardamos el arreglo de publicaciones en nuestra variable caché
            datosPublicaciones = content.content;
        }

        // Creamos un fragmento de documento para insertar todos los nodos en una sola operación
        const documentFragment = document.createDocumentFragment();

        // Iteramos la cantidad de veces indicada por el parámetro 'num'
        for (let i = 0; i < num; i++) {
            // Comprobamos si todavía existen publicaciones disponibles en el arreglo
            if (datosPublicaciones[contador] !== undefined) {
                // Construimos la tarjeta HTML con el nombre y contenido del elemento actual
                const newPublicacion = createPublicationCode(
                    datosPublicaciones[contador].nombre,
                    datosPublicaciones[contador].contenido
                );
                // Añadimos la nueva tarjeta al fragmento temporal
                documentFragment.appendChild(newPublicacion);
                // Observamos cada tarjeta para animarla cuando aparezca en pantalla
                observerAnimacion.observe(newPublicacion);
                // Incrementamos el contador global para apuntar al siguiente registro
                contador++;
                // Si es la última tarjeta del lote actual, la ponemos bajo vigilancia del observer
                if (i === num - 1) observer.observe(newPublicacion);
            } else {
                // Si ya no hay más datos, creamos el mensaje de finalización
                const noMore = document.createElement("H3");
                // Asignamos una clase CSS específica para darle estilo
                noMore.classList.add("sin-mas");
                // Definimos el texto informativo
                noMore.textContent = "No hay más publicaciones";
                // Añadimos el mensaje al fragmento
                documentFragment.appendChild(noMore);
                // Desconectamos el observador por completo porque ya no quedan elementos por cargar
                observer.disconnect();
                // Salimos del ciclo inmediatamente
                break;
            }
        }

        // Insertamos todo el fragmento acumulado dentro del contenedor del DOM
        publicaciones.appendChild(documentFragment);
    } catch (error) {
        // Mostramos en consola si ocurrió algún problema al obtener o procesar los datos
        console.error("Error al cargar las publicaciones:", error);
    }
};

// Ejecutamos la carga inicial mostrando las primeras 5 publicaciones al abrir la página
cargarPublicaciones(5);
