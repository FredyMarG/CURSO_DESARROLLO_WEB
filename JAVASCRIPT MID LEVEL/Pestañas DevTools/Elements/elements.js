/**
 * 🌳 ELEMENTS TAB LABORATORY
 * Manipulación dinámica del DOM para inspección de nodos.
 */

// Esperamos a que el DOM esté listo para evitar errores de referencia
document.addEventListener("DOMContentLoaded", () => {
    // Localizamos el contenedor donde inyectaremos nuevos elementos
    const contenedor = document.querySelector('.nested-content');
    
    // Creamos un nuevo elemento de párrafo (nodo)
    const nuevoNodo = document.createElement('p');
    
    // Definimos el contenido; notarás que 'Elements' resalta el cambio en morado/azul
    nuevoNodo.innerHTML = "<strong>Nivel 4:</strong> Nodo inyectado dinámicamente para inspección.";
    
    // Insertamos el hijo en el árbol; observa cómo se expande la jerarquía en DevTools
    contenedor.appendChild(nuevoNodo);
});