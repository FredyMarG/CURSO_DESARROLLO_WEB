 /* @property {boolean} visible - Indica si el componente de la interfaz es visible para el usuario.*/

/**
 * Inicialización del script tras la carga completa del DOM.
 * Se utiliza el evento 'DOMContentLoaded' para asegurar que todos los nodos HTML
 * definidos en objetos.html existan antes de intentar manipularlos.
 */
document.addEventListener("DOMContentLoaded", () => {
    /**
     * PATRÓN DE DISEÑO: Objeto de Mapeo (Lookup Table)
     * En lugar de múltiples sentencias document.getElementById repetitivas, asociamos
     * los IDs del DOM con las propiedades globales del objeto window.
     * Esto facilita la escalabilidad y mantiene el código DRY (Don't Repeat Yourself).
     */
    const props = {
        "locationbar-status": window.locationbar, // Interfaz de la barra de direcciones
        "menubar-status": window.menubar,         // Interfaz de la barra de menús del sistema
        "personalbar-status": window.personalbar, // Interfaz de la barra personal/marcadores
        "scrollbars-status": window.scrollbars,   // Interfaz de las barras de desplazamiento
        "statusbar-status": window.statusbar      // Interfaz de la barra de estado inferior
    };

    /**
     * Iteración dinámica de las propiedades.
     * Object.entries convierte el objeto 'props' en un array de pares [clave, valor]
     * permitiendo una actualización masiva del DOM.
     */
    for (const [id, barProp] of Object.entries(props)) {
        // Selección del nodo específico mediante el ID mapeado
        const element = document.getElementById(id);

        // Validación de seguridad: Verifica que el elemento exista y que la API BarProp sea soportada
        if (element && barProp) {
            // Extracción del estado de visibilidad (booleano)
            const isVisible = barProp.visible;
            
            // MANIPULACIÓN DEL DOM:
            // 1. Actualización semántica del contenido textual.
            element.textContent = isVisible ? "Visible" : "Hidden";
            
            // 2. Aplicación de clases CSS dinámicas para feedback visual inmediato (Success/Neutral).
            element.classList.add(isVisible ? "status-visible" : "status-hidden");
            
            // Telemetría básica: Registro en consola para trazabilidad del estado del navegador.
            console.log(`[BarProp Check] ${id}: ${isVisible}`);
        }
    }

/**
 * NOTA DE SEGURIDAD Y PRIVACIDAD: 
 * Históricamente, estas propiedades se usaban para "Browser Fingerprinting".
 * Actualmente, navegadores como Chrome, Firefox y Brave suelen forzar el retorno de 'true'
 * independientemente de la realidad visual. Esto es una medida de protección de privacidad
 * para evitar que un sitio web identifique patrones de uso únicos basados en la 
 * configuración de la interfaz del usuario.
 */
});