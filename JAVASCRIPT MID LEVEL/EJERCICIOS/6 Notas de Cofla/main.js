/**
 * @file main.js
 * @description Lógica del Ejercicio 6: Notas de Cofla (JavaScript Mid Level).
 * Simula la consulta asíncrona de materias y calificaciones almacenadas
 * en un servidor remoto mediante el uso de Promesas (Promise) y Async/Await,
 * renderizando progresivamente los resultados en el DOM.
 * @author Curso de Desarrollo Web
 */

// ==========================================================================
// 1. REFERENCIAS A ELEMENTOS DEL DOM
// ==========================================================================

// Contenedor principal donde se inyectará dinámicamente el HTML de cada materia
const materiasHTML = document.querySelector(".materias");

// Botón de interacción que inicia la visualización y consulta de notas
const button = document.querySelector("#aceptar");

// Contenedor de la sección de solución (oculto inicialmente mediante CSS)
const solucion = document.querySelector("#solucion");


// ==========================================================================
// 2. FUENTE DE DATOS (Simulación de Base de Datos en Servidor Remoto)
// ==========================================================================

/**
 * Arreglo de objetos que simula el registro académico del estudiante en la base de datos.
 * Cada objeto contiene el nombre de la asignatura y su respectiva calificación final.
 */
const materias = [
    {
        nombre: "Fisica 4",
        nota: 7
    },
    {
        nombre: "Calculo 4",
        nota: 8
    },
    {
        nombre: "Base de Datos 4",
        nota: 9
    },
    {
        nombre: "Matemáticas Discretas 3",
        nota: 7
    },
    {
        nombre: "Programación 4",
        nota: 8
    }
];


// ==========================================================================
// 3. PETICIÓN ASÍNCRONA SIMULADA (PROMESAS)
// ==========================================================================

/**
 * Simula una petición HTTP a un servidor externo para obtener la materia por su índice.
 * Utiliza setTimeout con un retardo aleatorio para emular la latencia real de red.
 * 
 * @param {number} id - Posición o índice de la materia en el arreglo.
 * @returns {Promise<Object>} Promesa que resuelve con el objeto de la materia si existe,
 *                            o rechaza con un mensaje de error si no se encuentra.
 */
const obtenerMateria = (id) => {
    return new Promise((resolve, reject) => {
        // Accedemos a la materia en el arreglo según el índice recibido
        materia = materias[id];

        // Verificamos si la materia no existe (índice fuera de rango)
        if (materia == undefined) {
            reject("La materia no existe");
        } else {
            // Emulamos tiempo de respuesta del servidor (entre 0 y 1400 milisegundos)
            setTimeout(() => {
                resolve(materia);
            }, Math.random() * 1400);
        }
    });
};


// ==========================================================================
// 4. CONSUMO ASÍNCRONO Y RENDERIZADO EN EL DOM (ASYNC / AWAIT)
// ==========================================================================

/**
 * Función asíncrona que itera sobre la colección de materias, espera la resolución
 * de cada petición de forma secuencial y construye la interfaz visual dinámicamente.
 */
const devolverMaterias = async () => {
    let materia = [];

    // Recorremos secuencialmente todas las materias disponibles
    for (let i = 0; i < materias.length; i++) {
        // 'await' pausa la ejecución hasta que la Promesa de 'obtenerMateria' se resuelve
        materia[i] = await obtenerMateria(i);

        // Estructura HTML con los datos de la materia obtenida
        let newHtmlcode = `<div class="materia">
                <div class="nombre">${materia[i].nombre}</div>
                <div class="nota">${materia[i].nota}</div>
            </div>`;

        // Inyectamos el nuevo nodo HTML en el contenedor del DOM
        materiasHTML.innerHTML += newHtmlcode;
    }
};


// ==========================================================================
// 5. CONTROLADOR DE EVENTOS (INTERACCIÓN DEL USUARIO)
// ==========================================================================

/**
 * Escuchador del evento 'click' en el botón "Solución".
 * Desencadena la animación para hacer visible el panel y comienza
 * la carga asíncrona de las notas de Cofla.
 */
button.addEventListener("click", async () => {
    // Agrega la clase CSS 'mostrar' para ejecutar la animación de entrada
    solucion.classList.add("mostrar");

    // Ejecuta la consulta secuencial y pintado de las materias en pantalla
    await devolverMaterias();
});