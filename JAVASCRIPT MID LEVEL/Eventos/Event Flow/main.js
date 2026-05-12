// Selección de elementos del DOM
const button = document.querySelector('.button'),
    contenedor = document.querySelector('.contenedor');

/**
 * EVENT BUBBLING (Fase de Burbujeo)
 * Por defecto, los eventos se propagan desde el elemento más interno (hijo)
 * hacia el más externo (padre). Al hacer clic en el botón, primero
 * se activará su alerta y luego la del contenedor.
 */
button.addEventListener("click",(e)=>{
    alert("Di click en un boton")
})

contenedor.addEventListener("click",(e)=>{
    alert("Di click en el contenedor")
}, false) // El tercer parámetro 'false' (por defecto) indica fase de burbujeo.

// Si quisieras que el contenedor responda ANTES que el botón, 
// cambiarías el parámetro a 'true' (Fase de Captura).