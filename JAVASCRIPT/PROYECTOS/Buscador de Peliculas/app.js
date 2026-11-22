/**
 * ============================================================================
 * LÓGICA DE CINESEARCH — BUSCADOR DE PELÍCULAS CON OMDb API Y DEBOUNCE
 * Comentado línea a línea de forma educativa en español
 * ============================================================================
 */

// 1. CONFIGURACIÓN Y REFERENCIAS AL DOM (Document Object Model)
const API_KEY = '2ed0427b'; // Llave de acceso pública para consultar la API de OMDb
const buscadorInput = document.getElementById('buscador'); // Referencia al campo de texto de búsqueda
const gridPeliculas = document.getElementById('grid-peliculas'); // Referencia al contenedor donde irán las tarjetas
const modal = document.getElementById('modal-detalle'); // Referencia al elemento nativo <dialog> de HTML5
const modalContenido = document.getElementById('modal-contenido'); // Contenedor interno donde se inyecta la ficha técnica
const btnCerrarModal = document.getElementById('btn-cerrar-modal'); // Botón para cerrar el modal de detalles

// Variable para almacenar el identificador del temporizador usado en la técnica Debounce.
let debounceTimer;

// 2. BÚSQUEDA EN VIVO CON TÉCNICA DEBOUNCE
// Escucha cada cambio en el input, pero espera a que el usuario deje de escribir para no saturar la API.
buscadorInput.addEventListener('input', (evento) => {
  clearTimeout(debounceTimer); // Cancela el temporizador anterior si el usuario sigue escribiendo
  const busqueda = evento.target.value.trim(); // Obtiene el texto ingresado y elimina espacios al inicio y al final

  if (busqueda.length < 3) { // Evita hacer búsquedas con menos de 3 caracteres (la API suele rechazarlas)
    gridPeliculas.innerHTML = ''; // Limpia los resultados anteriores en pantalla
    return; // Sale de la función sin iniciar ningún temporizador
  }

  // Programa la búsqueda para ejecutarse 500 milisegundos después de la última tecla presionada.
  debounceTimer = setTimeout(() => {
    buscarPeliculas(busqueda); // Llama a la función asíncrona que consulta la API
  }, 500);
});

// 3. CONSULTA A LA API DE OMDb (BÚSQUEDA POR TÍTULO)
// Función asíncrona (async/await) que solicita la lista de películas coincidentes.
async function buscarPeliculas(consulta) {
  gridPeliculas.innerHTML = '<p class="mensaje">Cargando...</p>'; // Muestra un mensaje temporal de espera

  try { // Bloque protegido para capturar errores de red o de respuesta
    // encodeURIComponent() codifica espacios y símbolos especiales para que la URL sea válida.
    const respuesta = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(consulta)}&apikey=${API_KEY}`);
    const datos = await respuesta.json(); // Convierte la respuesta HTTP de formato texto JSON a objeto JavaScript

    if (datos.Response === 'True') { // OMDb devuelve Response: "True" cuando encuentra películas
      renderizarPeliculas(datos.Search); // Envía el arreglo de películas encontrado a la función de renderizado
    } else { // Si no hubo coincidencias o la API devolvió un aviso
      gridPeliculas.innerHTML = `<p class="mensaje">No se encontraron resultados: ${datos.Error}</p>`;
    }
  } catch (error) { // Se ejecuta si falla la conexión a internet o el servidor no responde
    console.error('Error al consultar la API:', error); // Registra el error técnico en la consola del navegador
    gridPeliculas.innerHTML = '<p class="mensaje">Ocurrió un error en la conexión.</p>'; // Avisa al usuario
  }
}

// 4. RENDERIZADO DE TARJETAS EN LA CUADRÍCULA
// Recibe un arreglo de películas y crea dinámicamente una tarjeta HTML por cada una.
function renderizarPeliculas(peliculas) {
  gridPeliculas.innerHTML = ''; // Vacía el contenedor antes de insertar los nuevos resultados

  peliculas.forEach((pelicula) => { // Recorre cada película devuelta por la API
    const tarjeta = document.createElement('div'); // Crea un nuevo elemento <div> en memoria
    tarjeta.className = 'card-pelicula'; // Asigna la clase CSS para aplicar el estilo de tarjeta

    // Si la película no tiene póster ('N/A'), usa una imagen de relleno (placeholder).
    const urlPoster = pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450';

    // Construye el HTML interno de la tarjeta con póster, título, año y botón de detalle por imdbID.
    tarjeta.innerHTML = `
      <img src="${urlPoster}" alt="${pelicula.Title}">
      <div class="info">
        <h3>${pelicula.Title}</h3>
        <p>${pelicula.Year}</p>
        <button onclick="verDetalles('${pelicula.imdbID}')">Ver Detalle</button>
      </div>
    `;
    gridPeliculas.appendChild(tarjeta); // Inserta la tarjeta terminada dentro de la cuadrícula en el DOM
  });
}

// 5. CONSULTA DE DETALLES Y APERTURA DEL MODAL NATIVO (<dialog>)
// Obtiene la información completa (género, director, sinopsis, calificación) usando el ID único de IMDb.
async function verDetalles(imdbID) {
  try {
    // Solicita el detalle completo (plot=full) de la película seleccionada.
    const respuesta = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
    const pelicula = await respuesta.json(); // Convierte la respuesta JSON a un objeto JavaScript

    // Rellena el contenido del modal con los datos detallados de la película.
    modalContenido.innerHTML = `
      <h2>${pelicula.Title} (${pelicula.Year})</h2>
      <p><strong>Género:</strong> ${pelicula.Genre}</p>
      <p><strong>Director:</strong> ${pelicula.Director}</p>
      <p><strong>Sinopsis:</strong> ${pelicula.Plot}</p>
      <p><strong>Calificación IMDb:</strong> ⭐ ${pelicula.imdbRating}</p>
    `;
    modal.showModal(); // Método nativo de <dialog> que abre el modal en pantalla con fondo bloqueado
  } catch (error) { // Si falla la petición de detalles
    alert('No se pudieron cargar los detalles.'); // Muestra una alerta rápida al usuario
  }
}

// 6. CIERRE DEL MODAL
// Escucha el clic en el botón "Cerrar" para ocultar el <dialog> usando su método nativo close().
btnCerrarModal.addEventListener('click', () => modal.close());
