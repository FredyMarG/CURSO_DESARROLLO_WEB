/**
 * Seleccionamos el elemento de imagen del DOM. 
 * Los eventos de interfaz nos permiten monitorear el estado de carga y manipulación de recursos.
 */
const img = document.querySelector('.img-prueba');
const input = document.querySelector('.prueba');

/**
 * Evento 'error': Se dispara cuando un recurso (como una imagen) no puede cargarse.
 * Útil para manejar rutas rotas o fallos de red y mostrar una imagen de respaldo.
 */
img.addEventListener('error', () => {
    console.log('Error al cargar la imagen');
});

/**
 * Evento 'load': Se dispara cuando el recurso se ha descargado y procesado completamente.
 * Es fundamental para ejecutar lógica que dependa de que los elementos ya existan visualmente.
 */
img.addEventListener('load', () => {
    console.log('Imagen cargada');
}); 

/**
 * Evento 'beforeunload': (Debería aplicarse a 'window').
 * Se activa justo antes de que el usuario abandone la página (refrescar o cerrar).
 * Permite mostrar un cuadro de diálogo de confirmación si hay cambios sin guardar.
 */
window.addEventListener('beforeunload', () => {
    console.log('La página se va a recargar o cerrar');
});

/**
 * Evento 'unload': Se dispara cuando la página se está descargando definitivamente.
 * Se utiliza para tareas de limpieza final o para enviar analíticas antes de cerrar.
 */
window.addEventListener('unload', () => {
    console.log('La página se ha recargado o cerrado');
});

/**
 * Evento 'resize': Se dispara al cambiar el tamaño de la ventana del navegador.
 * Es la base para crear comportamientos responsivos dinámicos mediante JavaScript.
 */
window.addEventListener('resize', () => {
    console.log('La ventana ha sido redimensionada');
});

/**
 * Evento 'scroll': Se ejecuta cada vez que el usuario se desplaza por la página o un elemento.
 * Ideal para efectos de "sticky headers", carga infinita o animaciones al hacer scroll.
 */
window.addEventListener('scroll', () => {
    console.log('La ventana ha sido desplazada');
});

/**
 * Evento 'select': (Nota Técnica).
 * Este evento se utiliza normalmente en elementos <input> o <textarea> cuando se selecciona texto.
 * En imágenes no tiene un comportamiento estándar por defecto a menos que se use en contextos específicos.
 */
input.addEventListener('select', () => {
    console.log('Texto seleccionado en la imagen');
});