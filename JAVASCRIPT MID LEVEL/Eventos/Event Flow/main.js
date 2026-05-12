/** Selección de elementos del DOM */
const button = document.querySelector('.button'),
    contenedor1 = document.querySelector('.contenedor1'),
    contenedor2 = document.querySelector('.contenedor2');

/**
 * EVENT PROPAGATION (Flujo de eventos)
 * 
 * Por defecto, JavaScript usa 'Bubbling' (el evento sube del hijo al padre).
 * Al pasar 'true' como tercer argumento, activamos la 'Capture Phase' (el evento baja del padre al hijo).
 */

/**
 * Event Listener en fase de captura.
 * Se ejecutará primero si se hace clic en cualquier elemento hijo de contenedor1.
 */
contenedor1.addEventListener("click",(e)=>{
    alert("Di click en el rojo")
},true)

/**
 * Event Listener en fase de captura.
 */
contenedor2.addEventListener("click",(e)=>{
    alert("Di click en el azul")
},true)

/**
 * Event Listener en fase de burbujeo (comportamiento por defecto).
 */
button.addEventListener("click",(e)=>{
    alert("Di click en un boton")
})

// Si quisieras que el contenedor responda ANTES que el botón, 
// cambiarías el parámetro a 'true' (Fase de Captura).