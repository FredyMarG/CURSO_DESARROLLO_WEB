/**
 * 
 * El estándar DOM Level 3 Events define 3 fases en la propagación de un evento:
 * 1. Capture Phase: El evento baja desde la raíz (window) hasta el elemento objetivo.
 * 2. Target Phase: El evento llega al elemento que originó la acción.
 * 3. Bubbling Phase: El evento sube desde el elemento objetivo hasta la raíz.
 */

/** 
 * Inicialización de nodos del DOM 
 * @type {HTMLElement}
 */
const button = document.querySelector('.button');
const contenedor1 = document.querySelector('.contenedor1');
const contenedor2 = document.querySelector('.contenedor2');

/**
 * FASE DE CAPTURA (useCapture = true)
 * Al establecer el booleano 'capture' en true, invertimos el orden de ejecución estándar.
 * El navegador ejecutará estos listeners durante el descenso (Top-Down).
 */
contenedor1.addEventListener("click",(e)=>{
    alert("Fase Captura: Contenedor Externo (Rojo)");
    /**
     * NOTA TÉCNICA: stopPropagation() evitaría que el evento siga bajando hacia 
     * los hijos o subiendo hacia los padres.
     */
    // e.stopPropagation(); 
});

contenedor2.addEventListener("click",(e)=>{
    alert("Fase Captura: Contenedor Interno (Azul)");
});

/**
 * FASE DE OBJETIVO / BURBUJEO (useCapture = false / default)
 * Es el comportamiento por defecto de la web. El evento se procesa después de que los 
 * ancestros con fase de captura hayan terminado.
 */
button.addEventListener("click",(e)=>{
    alert("Fase Objetivo/Burbujeo: Di click en el botón");
    e.stopPropagation(); // Detiene la propagación del evento hacia los padres.
    
    /**
     * SUGERENCIA TÉCNICA: stopPropagation()
     * Si descomentas la línea de abajo, el evento morirá aquí y no seguirá 
     * subiendo hacia otros posibles listeners en fase de burbujeo.
     */
    // e.stopPropagation();
});